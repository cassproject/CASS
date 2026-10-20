/**
 * Integration tests for src/main/server/shims/ephemeral.js against Elasticsearch, through the
 * in-process server's global.ephemeral. Skipped when the server runs out of process (NODEV).
 */

const { assert } = require('chai');

describe('Ephemeral store', function () {
    this.timeout(60000);

    const ids = [];
    const newId = (label) => {
        const id = 'ephemeral-test-' + label + '-' + Date.now() + '-' + Math.floor(Math.random() * 1e6);
        ids.push(id);
        return id;
    };
    const esDoc = async (id) => (await fetch(global.elasticEndpoint + '/ephemeral/_doc/' + id, { headers: global.elasticHeaders() })).json();

    it('Waiting for server to be ready', async function () {
        if (process.env.NODEV != null || !global.events || !global.events.server) this.skip();
        let ready = false;
        global.events.server.ready.subscribe((isReady) => { if (isReady) ready = true; });
        while (!ready || global.ephemeral == null) { await new Promise((resolve) => setTimeout(resolve, 100)); }
    });

    beforeEach(function () {
        if (global.ephemeral == null) this.skip();
    });

    it('stores and returns an object until its expiry', async () => {
        const id = newId('roundtrip');
        await global.ephemeral.put(id, { name: 'cached', nested: { n: 1 } }, Date.now() + 60000);
        assert.deepEqual(await global.ephemeral.get(id), { name: 'cached', nested: { n: 1 } });
    });

    it('returns null for an id that was never stored', async () => {
        assert.isNull(await global.ephemeral.get(newId('missing')));
    });

    it('stops returning an object once it has expired, without waiting for cleanup', async () => {
        const id = newId('expiry');
        await global.ephemeral.put(id, { name: 'short-lived' }, Date.now() + 1500);
        // This read also triggers (and so uses up) the periodic cleanup while the object is still valid.
        assert.deepEqual(await global.ephemeral.get(id), { name: 'short-lived' });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        assert.isTrue((await esDoc(id)).found, 'the expired document is still in Elasticsearch');
        assert.isNull(await global.ephemeral.get(id), 'but it is not served');
    });

    it('gets() returns objects in order, with null for expired or missing ones', async () => {
        const live = newId('gets-live');
        const expired = newId('gets-expired');
        await global.ephemeral.put(live, { n: 'live' }, Date.now() + 60000);
        await global.ephemeral.put(expired, { n: 'expired' }, Date.now() + 1000);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        assert.deepEqual(await global.ephemeral.gets([live, expired, newId('gets-missing')]), [{ n: 'live' }, null, null]);
    });

    it('accepts an expiry given as a numeric string', async () => {
        const id = newId('string-expiry');
        await global.ephemeral.put(id, { n: 1 }, String(Date.now() + 60000));
        assert.deepEqual(await global.ephemeral.get(id), { n: 1 });
    });

    it('rejects an expiry built by string concatenation instead of storing it as a far-future version', async () => {
        const id = newId('concatenated');
        const until = Date.now() + '60000'; // what PROFILE_TTL=60000 used to produce
        try {
            await global.ephemeral.put(id, { n: 1 }, until);
            assert.fail('expected the put to be rejected');
        } catch (ex) {
            assert.match(ex.message, /expiry/);
        }
        assert.isFalse((await esDoc(id)).found);
    });

    it('replaces an entry whose stored version was corrupted, instead of failing every later write', async () => {
        const id = newId('poisoned');
        const poisoned = Date.now() + '60000';
        const res = await fetch(global.elasticEndpoint + '/ephemeral/_doc/' + id + '?version=' + poisoned + '&version_type=external&refresh=true', {
            method: 'PUT',
            headers: { ...global.elasticHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: JSON.stringify({ n: 'stuck' }), writeMs: Date.now() }),
        });
        assert.strictEqual(res.status, 201, await res.text());
        assert.deepEqual(await global.ephemeral.get(id), { n: 'stuck' });

        const until = Date.now() + 1500;
        await global.ephemeral.put(id, { n: 'fresh' }, until);
        assert.deepEqual(await global.ephemeral.get(id), { n: 'fresh' });
        assert.strictEqual((await esDoc(id))._source.until, until);

        // The replacement still expires on time, despite the version it inherited.
        await new Promise((resolve) => setTimeout(resolve, 2000));
        assert.isNull(await global.ephemeral.get(id));
        await global.ephemeral.put(id, { n: 'again' }, Date.now() + 60000);
        assert.deepEqual(await global.ephemeral.get(id), { n: 'again' });
    });

    it('a later expiry replaces an earlier one', async () => {
        const id = newId('replace');
        await global.ephemeral.put(id, { n: 1 }, Date.now() + 60000);
        await global.ephemeral.put(id, { n: 2 }, Date.now() + 120000);
        assert.deepEqual(await global.ephemeral.get(id), { n: 2 });
    });

    it('an earlier expiry replaces a later one (for example after PROFILE_TTL is lowered)', async () => {
        const id = newId('shorter');
        await global.ephemeral.put(id, { n: 'long-lived' }, Date.now() + 24 * 60 * 60 * 1000);
        await global.ephemeral.put(id, { n: 'short-lived' }, Date.now() + 1500);
        assert.deepEqual(await global.ephemeral.get(id), { n: 'short-lived' });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        assert.isNull(await global.ephemeral.get(id), 'the shorter lifetime applies');
    });

    it('delete removes an entry', async () => {
        const id = newId('delete');
        await global.ephemeral.put(id, { n: 1 }, Date.now() + 60000);
        await global.ephemeral.delete(id);
        assert.isNull(await global.ephemeral.get(id));
    });

    it('deleteWith removes every entry whose id contains the text, and nothing else', async () => {
        const marker = 'FP' + Date.now();
        const a = newId('with-a') + '|' + marker + '|';
        const b = newId('with-b') + '|' + marker + '|';
        const other = newId('with-other');
        ids.push(a, b);
        for (const id of [a, b, other]) await global.ephemeral.put(id, { id }, Date.now() + 60000);
        await fetch(global.elasticEndpoint + '/ephemeral/_refresh', { method: 'POST', headers: global.elasticHeaders() });
        await global.ephemeral.deleteWith('|' + marker + '|');
        assert.isNull(await global.ephemeral.get(a));
        assert.isNull(await global.ephemeral.get(b));
        assert.deepEqual(await global.ephemeral.get(other), { id: other });
    });

    it('deleteWith takes several texts and removes entries containing any of them in one call', async () => {
        const stamp = Date.now();
        const a = newId('many-a') + '|FPA' + stamp + '|';
        const b = newId('many-b') + '|FPB' + stamp + '|';
        const other = newId('many-other') + '|FPC' + stamp + '|';
        ids.push(a, b, other);
        for (const id of [a, b, other]) await global.ephemeral.put(id, { id }, Date.now() + 60000);
        await fetch(global.elasticEndpoint + '/ephemeral/_refresh', { method: 'POST', headers: global.elasticHeaders() });
        await global.ephemeral.deleteWith(['|FPA' + stamp + '|', '|FPB' + stamp + '|']);
        assert.isNull(await global.ephemeral.get(a));
        assert.isNull(await global.ephemeral.get(b));
        assert.deepEqual(await global.ephemeral.get(other), { id: other });
    });

    it('deleteWith leaves no scroll contexts open', async () => {
        const open = async () => (await (await fetch(global.elasticEndpoint + '/_nodes/stats/indices/search', { headers: global.elasticHeaders() })).json());
        const contexts = (stats) => Object.values(stats.nodes).reduce((n, node) => n + node.indices.search.scroll_current, 0);
        const before = contexts(await open());
        for (let i = 0; i < 5; i++) await global.ephemeral.deleteWith('|nothing-matches-' + Date.now() + '|');
        assert.isAtMost(contexts(await open()), before);
    });

    after(async () => {
        if (global.ephemeral == null) return;
        for (const id of ids) {
            await fetch(global.elasticEndpoint + '/ephemeral/_doc/' + encodeURIComponent(id), { method: 'DELETE', headers: global.elasticHeaders() });
        }
    });
});
