const { assert } = require('chai');
const nodeCrypto = require('node:crypto');
const recorder = require('./support/skyrepoRecorder');

// Performance of the skyRepo paths whose cost grows faster than their input. Each test runs the
// real endpoint code against an in-memory Elasticsearch, so the time measured is CaSS's own.
//
// The budgets are several times what the code needs on a developer machine, to stay quiet on a
// slow CI runner, and far below what the quadratic versions of the same code took. Each test also
// logs its time; SKYREPO_PERF_REPORT=true prints the times without enforcing the budgets.
describe('SkyRepo performance', function () {
    this.timeout(600000);
    let endpoints;
    let server;
    const enforce = process.env.SKYREPO_PERF_REPORT != 'true';
    const timed = async function (label, budgetMs, fn) {
        const start = performance.now();
        const result = await fn();
        const ms = performance.now() - start;
        console.log(`      ${label}: ${ms.toFixed(0)} ms (budget ${budgetMs} ms)`);
        if (enforce) assert.isBelow(ms, budgetMs, label);
        return result;
    };
    const uuid = (i) => String(i).padStart(8, '0') + '-0000-4000-8000-000000000000';
    const local = (i, version, extra) => ({
        '@context': 'http://schema.org/', '@type': 'Thing', '@id': server + 'data/schema.org.Thing/' + uuid(i) + '/' + (1800000000000 + version), 'name': 'Thing ' + i, ...extra,
    });
    const call = (endpoint, options) => endpoints[endpoint].call(recorder.request(options));

    before(async function () {
        if (process.env.NODEV != null) this.skip();
        let ready = false;
        global.events.server.ready.subscribe((isReady) => { if (isReady) ready = true; });
        while (!ready) await new Promise((resolve) => setTimeout(resolve, 100));
        endpoints = recorder.install();
        server = repo.selectedServer;
    });
    after(() => recorder.uninstall());

    // The original history ordering and de-duplication, kept here as the reference the current
    // implementation must agree with. It parses both documents on every comparison.
    const referenceHistory = function (hits) {
        hits = hits.slice();
        hits.sort((a, b) => {
            const A = new EcRemoteLinkedData();
            A.copyFrom(JSON.parse(a._source.data));
            const B = new EcRemoteLinkedData();
            B.copyFrom(JSON.parse(b._source.data));
            let Ats = A.getTimestamp();
            let Bts = B.getTimestamp();
            if (Ats == null) Ats = a._source.writeMs;
            if (Bts == null) Bts = b._source.writeMs;
            if (Ats == null || Bts == null) return 0;
            return Bts - Ats;
        });
        for (let i = 0; i < hits.length; i++) {
            for (let j = i; j < hits.length; j++) {
                if (i == j) continue;
                const A = new EcRemoteLinkedData();
                A.copyFrom(JSON.parse(hits[i]._source.data));
                const B = new EcRemoteLinkedData();
                B.copyFrom(JSON.parse(hits[j]._source.data));
                let Ats = A.getTimestamp();
                let Bts = B.getTimestamp();
                if (Ats == null) Ats = hits[i]._source.writeMs;
                if (Bts == null) Bts = hits[j]._source.writeMs;
                if (A.id + Ats == B.id + Bts) {
                    hits.splice(j--, 1);
                }
            }
        }
        return hits.map((h) => JSON.parse(h._source.data));
    };

    describe('history', function () {
        // Deterministic pseudo-random numbers, so a failure can be reproduced.
        const random = (seed) => () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;

        it('orders and de-duplicates exactly as the original implementation did', async function () {
            const { skyrepoHistoryInternal } = require('../main/server/skyRepo/history');
            for (let round = 0; round < 200; round++) {
                const next = random(round + 1);
                const elastic = new recorder.FakeElastic();
                const count = 1 + Math.floor(next() * 40);
                for (let i = 0; i < count; i++) {
                    const shape = Math.floor(next() * 6);
                    const version = 1000 + Math.floor(next() * 8);
                    let data;
                    if (shape == 0) data = { '@type': 'Thing', '@id': 'https://x.example/t/' + version, 'n': i };
                    else if (shape == 1) data = { '@type': 'Thing', '@id': 'https://x.example/t', 'n': i }; // no timestamp
                    else if (shape == 2) data = { '@id': 'https://x.example/t/' + version, 'n': i }; // no type: copyFrom leaves id unset
                    else if (shape == 3) data = { 'n': i }; // no id at all
                    else if (shape == 4) data = { '@type': 'Thing', '@id': 'https://x.example/other/' + version, 'n': i };
                    else data = { '@type': 'Thing', 'id': 'https://x.example/t/' + version, 'n': i };
                    const source = { data: JSON.stringify(data), baseId: 'base' };
                    const writeMs = Math.floor(next() * 3);
                    if (writeMs > 0) source.writeMs = 5000 + writeMs; // sometimes absent
                    elastic.write('permanent', 'base.' + i, source, i + 1, true);
                }
                const stored = elastic.search('permanent', { size: 10000, query: { term: { baseId: 'base' } } }).hits.hits;
                const expected = referenceHistory(stored);
                let actual;
                await recorder.play({ elastic: elastic }, async () => { actual = await skyrepoHistoryInternal('base', null, null); });
                assert.deepStrictEqual(actual, expected, 'round ' + round);
            }
        });

        it('returns the history of an object with 3,000 versions quickly', async function () {
            const elastic = new recorder.FakeElastic();
            const versions = 3000;
            for (let v = 1; v <= versions; v++) {
                const obj = local(1, 1000000 + v, { description: 'x'.repeat(500) });
                const source = { data: JSON.stringify(obj), writeMs: 1000000 + v, baseId: uuid(1) };
                elastic.write('permanent', uuid(1) + '.' + (1000000 + v), source, 1000000 + v, true);
                // Every tenth version is also stored under a second id, as the latest-version copy is.
                if (v % 10 == 0) elastic.write('permanent', uuid(1) + '.dup' + v, source, 1000000 + v, true);
            }
            let history;
            await recorder.play({ elastic: elastic }, async () => {
                history = await timed('history of 3,000 versions', 3000, async () =>
                    JSON.parse(await call('/data/*', { params: { urlRemainder: 'schema.org.Thing/' + uuid(1), history: 'true' } })));
            });
            assert.lengthOf(history, versions);
            assert.strictEqual(history[0]['@id'], local(1, 1000000 + versions)['@id'], 'newest first');
            assert.strictEqual(history[versions - 1]['@id'], local(1, 1000001)['@id'], 'oldest last');
        });
    });

    describe('reading restricted objects', function () {
        it('checks a large object against many signatures quickly', async function () {
            const elastic = new recorder.FakeElastic();
            // Five real keys: four strangers, repeated to make 400 signatures, and the reader.
            const keys = [];
            for (let i = 0; i < 5; i++) {
                const { privateKey } = nodeCrypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
                keys.push(EcPpk.fromPem(privateKey.export({ type: 'pkcs1', format: 'pem' })).toPk().toPem());
            }
            const reader = keys.pop();
            const strangers = [];
            for (let i = 0; i < 400; i++) strangers.push(keys[i % keys.length]);
            const big = local(2, 1000, { '@reader': [reader], 'description': 'y'.repeat(2000000) });
            elastic.write('permanent', uuid(2) + '.', { data: JSON.stringify(big), baseId: uuid(2) }, 1000, true);
            {
                await recorder.play({ elastic: elastic }, async () => {
                    const found = await timed('2 MB object, reader is the last of 401 signatures', 2000, async () =>
                        JSON.parse(await call('/data/*', { params: { urlRemainder: uuid(2) }, signatures: [...strangers, reader] })));
                    assert.strictEqual(found['@id'], big['@id']);
                    let refused;
                    await timed('2 MB object, 400 signatures and none may read it', 2000, async () => {
                        try {
                            await call('/data/*', { params: { urlRemainder: uuid(2) }, signatures: strangers });
                        } catch (ex) {
                            refused = ex;
                        }
                    });
                    assert.strictEqual(refused.status, 404);
                });
            }
        });
    });

    describe('multiPut', function () {
        const batch = (count, version, extra) => {
            const objs = [];
            for (let i = 0; i < count; i++) objs.push(local(i, version, extra));
            return objs;
        };
        const withBatchSize = async function (size, fn) {
            const before = process.env.MULTIPUT_BATCH_SIZE;
            process.env.MULTIPUT_BATCH_SIZE = String(size);
            try {
                return await fn();
            } finally {
                if (before === undefined) delete process.env.MULTIPUT_BATCH_SIZE;
                else process.env.MULTIPUT_BATCH_SIZE = before;
            }
        };

        it('updates 3,000 objects in one batch quickly', async function () {
            const elastic = new recorder.FakeElastic();
            await withBatchSize(3000, () => recorder.play({ elastic: elastic }, async () => {
                const created = JSON.parse(await call('/sky/repo/multiPut', { method: 'POST', dataStreams: { data: JSON.stringify(batch(3000, 1000)) } }));
                assert.lengthOf(created, 3000);
                const updated = await timed('multiPut updating 3,000 objects', 6000, async () =>
                    JSON.parse(await call('/sky/repo/multiPut', { method: 'POST', dataStreams: { data: JSON.stringify(batch(3000, 2000)) } })));
                assert.lengthOf(updated, 3000);
            }));
            assert.strictEqual(elastic.index('schema.org.thing').size, 3000);
            assert.strictEqual(elastic.index('schema.org.thing').get(uuid(7)).version, 1800000002000);
        });

        it('handles a batch of 3,000 where Elasticsearch rejects or conflicts on most of it quickly', async function () {
            const elastic = new recorder.FakeElastic();
            await withBatchSize(3000, () => recorder.play({ elastic: elastic }, async () => {
                await call('/sky/repo/multiPut', { method: 'POST', dataStreams: { data: JSON.stringify(batch(3000, 2000)) } });
                // A third is rejected by the search index, a third by permanent, and the rest are older
                // than what is stored, so they conflict and are retried.
                elastic.bulkFaults.push((action, meta) => {
                    if (action != 'index') return undefined;
                    if (!meta._id.includes('-')) return undefined; // only the ids that are GUIDs
                    const n = Number(meta._id.substring(0, 8));
                    if (meta._index != 'permanent' && n % 3 == 0) return { type: 'mapper_parsing_exception', reason: 'rejected' };
                    if (meta._index == 'permanent' && n % 3 == 1) return { type: 'mapper_parsing_exception', reason: 'rejected' };
                    return undefined;
                });
                const saved = await timed('multiPut of 3,000 with rejections and conflicts', 8000, async () =>
                    JSON.parse(await call('/sky/repo/multiPut', { method: 'POST', dataStreams: { data: JSON.stringify(batch(3000, 1000)) } })));
                assert.lengthOf(saved, 1000, 'a third is rejected by each index; the rest are stale and dropped without failing');
            }));
        });
    });

    describe('requests sent to Elasticsearch', function () {
        // Round trips are the dominant cost of the single-object endpoints, and each write with
        // refresh=true also forces a refresh, so their number is pinned here.
        const count = async function (fn) {
            const { log } = await recorder.play({}, fn);
            return log.filter((e) => e.elastic != null);
        };
        const U = uuid(9);
        const thing = (version, extra) => local(9, version, extra);
        const post = (obj) => call('/data/*', { method: 'POST', params: { urlRemainder: 'schema.org.Thing/' + U + '/' + obj['@id'].split('/').pop() }, dataStreams: { data: JSON.stringify(obj) } });

        it('a single put', async function () {
            const created = await count(async () => { await post(thing(1000)); });
            const updated = await count(async (s) => {
                s.elastic.write('permanent', U + '.', { data: JSON.stringify(thing(1000)), baseId: U }, 1000, true);
                s.elastic.write('schema.org.thing', U, thing(1000), 1000, true);
                await post(thing(2000));
            });
            console.log(`      create: ${created.length} requests, update: ${updated.length} requests`);
            assert.isAtMost(created.length, 9);
            assert.isAtMost(updated.length, 9);
        });

        it('a single delete', async function () {
            const deleted = await count(async (s) => {
                s.elastic.write('permanent', U + '.', { data: JSON.stringify(thing(1000)), baseId: U }, 1000, true);
                s.elastic.write('schema.org.thing', U, thing(1000), 1000, true);
                await call('/data/*', { method: 'DELETE', params: { urlRemainder: 'schema.org.Thing/' + U } });
            });
            console.log(`      delete: ${deleted.length} requests`);
            assert.isAtMost(deleted.length, 7);
        });
    });
});
