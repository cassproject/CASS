/**
 * Unit tests for src/main/server/profile/cache.js — profile caching and request
 * coordination for /api/profile/latest, driven with an in-memory store and a fake clock.
 */

const chai = require('chai');
const assert = chai.assert;
const { ProfileCache, profileTtl, profileWorkers, workerMaxMemory, DAY_MS, STALE_LIMIT } = require('../main/server/profile/cache.js');

/** In-memory stand-in for global.ephemeral: entries disappear at `until`. */
class MemoryStore {
    constructor(clock) {
        this.clock = clock;
        this.docs = {};
        this.puts = [];
        this.deletes = [];
        this.failPuts = false;
    }
    async get(id) {
        const doc = this.docs[id];
        if (doc == null || doc.until < this.clock.now()) return null;
        return JSON.parse(JSON.stringify(doc.obj));
    }
    async put(id, obj, until) {
        if (this.failPuts) throw new Error('store unavailable');
        this.puts.push({ id, obj, until });
        this.docs[id] = { obj: JSON.parse(JSON.stringify(obj)), until };
    }
    async deleteWith(parts) {
        this.deletes.push(parts);
        for (const id of Object.keys(this.docs)) if (parts.some((part) => id.includes(part))) delete this.docs[id];
    }
    /** The profile stored under id, without the cache's bookkeeping. */
    profile(id) {
        return this.docs[id]?.obj?.profile;
    }
}

/** A clock that only moves when sleep() is called, yielding to other pending work each time. */
class FakeClock {
    constructor() { this.time = 1_760_000_000_000; }
    now() { return this.time; }
    async sleep(ms) {
        this.time += ms;
        await new Promise((resolve) => setImmediate(resolve));
    }
}

const deferred = () => {
    let resolve, reject;
    const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
    return { promise, resolve, reject };
};

const settle = () => new Promise((resolve) => setImmediate(resolve));

describe('Profile cache', function () {
    let clock, store, cache;
    const request = (overrides = {}) => ({ cacheKey: 'fw|FP1|-agent|params|general', fingerprint: 'FP1', readCache: true, waitForOthers: true, ttl: 60000, ...overrides });
    const newCache = (options = {}) => new ProfileCache({ store, now: () => clock.now(), sleep: (ms) => clock.sleep(ms), wait: () => settle(), ...options });

    beforeEach(() => {
        clock = new FakeClock();
        store = new MemoryStore(clock);
        cache = newCache();
    });

    describe('Environment settings', () => {
        it('PROFILE_TTL is a number, so an expiry is added rather than concatenated', () => {
            const ttl = profileTtl({ PROFILE_TTL: '60000' });
            assert.strictEqual(ttl, 60000);
            const until = clock.now() + ttl;
            assert.strictEqual(until, 1_760_000_060_000);
            assert.isBelow(until, Number.MAX_SAFE_INTEGER);
        });

        it('PROFILE_TTL defaults to 24 hours when unset or not a positive integer', () => {
            assert.strictEqual(DAY_MS, 86400000);
            for (const value of [undefined, '', 'abc', '0', '-5']) {
                assert.strictEqual(profileTtl({ PROFILE_TTL: value }), DAY_MS, 'PROFILE_TTL=' + value);
            }
        });

        it('PROFILE_WORKERS sets the worker pool size, defaulting to one', () => {
            assert.strictEqual(profileWorkers({}), 1);
            assert.strictEqual(profileWorkers({ PROFILE_WORKERS: '4' }), 4);
            for (const value of ['0', '-2', 'many']) {
                assert.strictEqual(profileWorkers({ PROFILE_WORKERS: value }), 1, 'PROFILE_WORKERS=' + value);
            }
        });

        it('WORKER_MAX_MEMORY is passed to workers as a number', () => {
            assert.strictEqual(workerMaxMemory({}), 1024);
            assert.strictEqual(workerMaxMemory({ WORKER_MAX_MEMORY: '2048' }), 2048);
            assert.strictEqual(workerMaxMemory({ WORKER_MAX_MEMORY: 'lots' }), 1024);
        });
    });

    describe('Caching', () => {
        it('computes a profile and caches it, fresh for ttl and kept for STALE_LIMIT ttls', async () => {
            const result = await cache.get(request(), async () => ({ id: 'fw', children: [] }));
            assert.deepEqual(result, { profile: { id: 'fw', children: [] }, fromCache: false, stale: false });
            assert.lengthOf(store.puts, 1);
            const { obj, until } = store.puts[0];
            assert.deepEqual(obj, { profile: { id: 'fw', children: [] }, cachedAt: clock.now(), freshUntil: clock.now() + 60000 });
            assert.strictEqual(STALE_LIMIT, 2);
            assert.strictEqual(until, clock.now() + 2 * 60000);
            assert.typeOf(until, 'number');
        });

        it('answers from the cache without computing', async () => {
            await cache.get(request(), async () => ({ id: 'fw', n: 1 }));
            let computed = 0;
            const result = await cache.get(request(), async () => { computed++; return { id: 'fw', n: 2 }; });
            assert.strictEqual(computed, 0);
            assert.deepEqual(result, { profile: { id: 'fw', n: 1 }, fromCache: true, stale: false });
        });

        it('reads a bare profile cached by CaSS 1.7.11 as fresh', async () => {
            store.docs[request().cacheKey] = { obj: { id: 'fw', n: 'old format' }, until: clock.now() + 60000 };
            const result = await cache.get(request(), async () => assert.fail('should not compute'));
            assert.deepEqual(result, { profile: { id: 'fw', n: 'old format' }, fromCache: true, stale: false });
        });

        it('recomputes once the cached profile has gone from the store', async () => {
            await cache.get(request(), async () => ({ n: 1 }));
            await clock.sleep(2 * 60000 + 1);
            const result = await cache.get(request(), async () => ({ n: 2 }));
            assert.deepEqual(result, { profile: { n: 2 }, fromCache: false, stale: false });
        });

        it('does not read the cache when readCache is off, but still refreshes it', async () => {
            await cache.get(request(), async () => ({ n: 1 }));
            const result = await cache.get(request({ readCache: false }), async () => ({ n: 2 }));
            assert.deepEqual(result, { profile: { n: 2 }, fromCache: false, stale: false });
            assert.deepEqual(store.profile(request().cacheKey), { n: 2 });
        });

        it('flush ignores the cached profile and recomputes', async () => {
            await cache.get(request(), async () => ({ n: 1 }));
            const result = await cache.get(request({ flush: true }), async () => ({ n: 2 }));
            assert.deepEqual(result, { profile: { n: 2 }, fromCache: false, stale: false });
        });

        it('keys are independent', async () => {
            await cache.get(request(), async () => ({ n: 1 }));
            const result = await cache.get(request({ cacheKey: 'fw2|FP1|-agent|params|general' }), async () => ({ n: 2 }));
            assert.deepEqual(result, { profile: { n: 2 }, fromCache: false, stale: false });
        });

        it('returns a profile with an error without caching it', async () => {
            const result = await cache.get(request(), async () => ({ error: 'framework not found' }));
            assert.deepEqual(result, { profile: { error: 'framework not found' }, fromCache: false, stale: false });
            assert.lengthOf(store.puts, 0);
        });

        it('still returns the profile when the cache cannot be written', async () => {
            store.failPuts = true;
            const result = await cache.get(request(), async () => ({ n: 1 }));
            assert.deepEqual(result, { profile: { n: 1 }, fromCache: false, stale: false });
        });
    });

    describe('Expired profiles (stale while revalidating)', () => {
        it('an expired profile is returned at once and recomputed in the background', async () => {
            await cache.get(request(), async () => ({ n: 1 }));
            await clock.sleep(60001);
            const recompute = deferred();
            let computed = 0;
            const result = await cache.get(request(), () => { computed++; return recompute.promise; });
            assert.deepEqual(result, { profile: { n: 1 }, fromCache: true, stale: true });
            assert.strictEqual(computed, 1, 'a background recompute started');
            assert.isNotEmpty(cache.inProgress);

            recompute.resolve({ n: 2 });
            await settle();
            await settle();
            assert.deepEqual(store.profile(request().cacheKey), { n: 2 });
            const next = await cache.get(request(), async () => assert.fail('should not compute'));
            assert.deepEqual(next, { profile: { n: 2 }, fromCache: true, stale: false });
        });

        it('readers of an expired profile do not wait, and start only one recompute', async () => {
            await cache.get(request(), async () => ({ n: 1 }));
            await clock.sleep(60001);
            const recompute = deferred();
            let computed = 0;
            const compute = () => { computed++; return recompute.promise; };
            const results = await Promise.all([cache.get(request(), compute), cache.get(request(), compute), cache.get(request(), compute)]);
            for (const result of results) assert.deepEqual(result, { profile: { n: 1 }, fromCache: true, stale: true });
            assert.strictEqual(computed, 1);
            recompute.resolve({ n: 2 });
        });

        it('a failed background recompute leaves the stale profile and clears the marker', async () => {
            const logged = [];
            cache = newCache({ log: (message) => logged.push(message) });
            await cache.get(request(), async () => ({ n: 1 }));
            await clock.sleep(60001);
            await cache.get(request(), async () => { throw new Error('worker crashed'); });
            await settle();
            await settle();
            assert.deepEqual(cache.inProgress, {});
            assert.include(logged, 'Background recompute failed');
            const again = await cache.get(request(), async () => ({ n: 2 }));
            assert.deepEqual(again, { profile: { n: 1 }, fromCache: true, stale: true });
        });

        it('a profile older than STALE_LIMIT ttls is not served; the reader waits for a fresh one', async () => {
            await cache.get(request(), async () => ({ n: 1 }));
            await clock.sleep(STALE_LIMIT * 60000 + 1);
            const result = await cache.get(request(), async () => ({ n: 2 }));
            assert.deepEqual(result, { profile: { n: 2 }, fromCache: false, stale: false });
        });
    });

    describe('Concurrent requests for the same profile', () => {
        it('a waiting request gets the profile the first request computed, without computing it again', async () => {
            const first = deferred();
            let computed = 0;
            const a = cache.get(request(), () => { computed++; return first.promise; });
            await settle();
            await settle();
            let bDone = false;
            const b = cache.get(request(), async () => { computed++; return { n: 'duplicate' }; }).then((r) => { bDone = true; return r; });
            await clock.sleep(500);
            assert.isFalse(bDone, 'the second request waits while the first is computing');
            first.resolve({ id: 'fw', n: 1 });
            const [ra, rb] = await Promise.all([a, b]);
            assert.deepEqual(ra, { profile: { id: 'fw', n: 1 }, fromCache: false, stale: false });
            assert.deepEqual(rb, { profile: { id: 'fw', n: 1 }, fromCache: true, stale: false });
            assert.strictEqual(computed, 1);
        });

        it('a waiting request computes for itself once the other has taken longer than waitMs', async () => {
            cache = newCache({ waitMs: 1000, pollMs: 100 });
            const stuck = deferred();
            cache.get(request(), () => stuck.promise);
            await settle();
            await settle();
            const result = await cache.get(request(), async () => ({ n: 'own' }));
            assert.deepEqual(result, { profile: { n: 'own' }, fromCache: false, stale: false });
            assert.isAtLeast(clock.now() - 1_760_000_000_000, 1000);
            stuck.resolve({ n: 'late' });
        });

        it('without waitForOthers, concurrent requests compute independently', async () => {
            const first = deferred();
            let computed = 0;
            const a = cache.get(request({ waitForOthers: false }), () => { computed++; return first.promise; });
            await settle();
            await settle();
            const b = await cache.get(request({ waitForOthers: false }), async () => { computed++; return { n: 2 }; });
            assert.deepEqual(b, { profile: { n: 2 }, fromCache: false, stale: false });
            first.resolve({ n: 1 });
            await a;
            assert.strictEqual(computed, 2);
        });

        it('a failed computation does not make later requests wait', async () => {
            const failing = cache.get(request(), async () => { throw new Error('worker crashed'); });
            try {
                await failing;
                assert.fail('expected the computation error');
            } catch (ex) {
                assert.strictEqual(ex.message, 'worker crashed');
            }
            assert.deepEqual(cache.inProgress, {});
            const startedAt = clock.now();
            const result = await cache.get(request(), async () => ({ n: 1 }));
            assert.deepEqual(result, { profile: { n: 1 }, fromCache: false, stale: false });
            assert.strictEqual(clock.now(), startedAt, 'no time spent waiting');
        });

        it('a computation that returns an error does not make later requests wait', async () => {
            await cache.get(request(), async () => ({ error: 'bad' }));
            assert.deepEqual(cache.inProgress, {});
        });

        it('an older computation finishing does not clear a newer request\'s marker', async () => {
            const older = deferred();
            const newer = deferred();
            const a = cache.get(request(), () => older.promise);
            await settle();
            await settle();
            await clock.sleep(10);
            const b = cache.get(request({ flush: true }), () => newer.promise);
            await settle();
            const newerMarker = cache.inProgress[request().cacheKey];
            older.resolve({ n: 1 });
            await a;
            assert.strictEqual(cache.inProgress[request().cacheKey], newerMarker);
            newer.resolve({ n: 2 });
            await b;
            assert.deepEqual(cache.inProgress, {});
        });
    });

    describe('Invalidation by new evidence', () => {
        it('invalidate deletes every cached profile about the subject', async () => {
            await cache.get(request(), async () => ({ n: 1 }));
            await cache.get(request({ cacheKey: 'other-fw|FP1|-agent|params|general' }), async () => ({ n: 1 }));
            await cache.get(request({ cacheKey: 'fw|FP2|-agent|params|general', fingerprint: 'FP2' }), async () => ({ n: 1 }));
            await cache.invalidate('FP1');
            assert.deepEqual(store.deletes, [['|FP1|']]);
            assert.deepEqual(Object.keys(store.docs), ['fw|FP2|-agent|params|general']);
        });

        it('invalidations within the coalescing window are deleted in one request', async () => {
            const window = deferred();
            cache = newCache({ wait: () => window.promise });
            const done = [cache.invalidate('FP1'), cache.invalidate('FP2'), cache.invalidate('FP1'), cache.invalidate('FP3')];
            assert.deepEqual(store.deletes, [], 'nothing is deleted before the window closes');
            window.resolve();
            await Promise.all(done);
            assert.deepEqual(store.deletes, [['|FP1|', '|FP2|', '|FP3|']]);
        });

        it('an invalidation after a group has been sent starts the next group', async () => {
            await cache.invalidate('FP1');
            await cache.invalidate('FP2');
            assert.deepEqual(store.deletes, [['|FP1|'], ['|FP2|']]);
        });

        it('every subject is deleted, even one this server never cached (another replica may have)', async () => {
            await cache.invalidate('FP-NEVER-SEEN');
            assert.deepEqual(store.deletes, [['|FP-NEVER-SEEN|']]);
        });

        it('a cached profile computed before an invalidation is not served while its deletion is pending', async () => {
            await cache.get(request(), async () => ({ n: 'before' }));
            const window = deferred();
            cache.wait = () => window.promise;
            await clock.sleep(10);
            const pending = cache.invalidate('FP1');
            assert.isDefined(store.docs[request().cacheKey], 'not deleted yet');
            const result = await cache.get(request(), async () => ({ n: 'after' }));
            assert.deepEqual(result, { profile: { n: 'after' }, fromCache: false, stale: false });
            window.resolve();
            await pending;
        });

        it('an expired profile invalidated by new evidence is not served stale', async () => {
            await cache.get(request(), async () => ({ n: 'before' }));
            await clock.sleep(60001);
            const window = deferred();
            cache.wait = () => window.promise;
            cache.invalidate('FP1');
            const result = await cache.get(request(), async () => ({ n: 'after' }));
            assert.deepEqual(result, { profile: { n: 'after' }, fromCache: false, stale: false });
            window.resolve();
        });

        it('a profile computed from evidence that changed meanwhile is returned but not cached', async () => {
            const computing = deferred();
            const a = cache.get(request(), () => computing.promise);
            await settle();
            await settle();
            await clock.sleep(100);
            await cache.invalidate('FP1');
            computing.resolve({ n: 'stale' });
            assert.deepEqual(await a, { profile: { n: 'stale' }, fromCache: false, stale: false });
            assert.lengthOf(store.puts, 0);
            const next = await cache.get(request(), async () => ({ n: 'fresh' }));
            assert.deepEqual(next, { profile: { n: 'fresh' }, fromCache: false, stale: false });
        });

        it('a profile started just after an invalidation is not cached, as the new evidence may not be searchable yet', async () => {
            await cache.invalidate('FP1');
            await clock.sleep(500);
            await cache.get(request(), async () => ({ n: 1 }));
            assert.lengthOf(store.puts, 0);
        });

        it('profiles computed well after an invalidation are cached again', async () => {
            await cache.invalidate('FP1');
            await clock.sleep(5000);
            await cache.get(request(), async () => ({ n: 1 }));
            assert.lengthOf(store.puts, 1);
        });

        it('invalidating one subject does not stop another subject\'s profile from being cached', async () => {
            const computing = deferred();
            const a = cache.get(request(), () => computing.promise);
            await settle();
            await settle();
            await cache.invalidate('FP2');
            computing.resolve({ n: 1 });
            await a;
            assert.lengthOf(store.puts, 1);
        });

        it('old invalidations are forgotten after retainMs', async () => {
            cache = newCache({ retainMs: 60000 });
            await cache.invalidate('FP1');
            await clock.sleep(60001);
            await cache.invalidate('FP2');
            assert.deepEqual(Object.keys(cache.invalidatedAt), ['FP2']);
        });
    });
});
