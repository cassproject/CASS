const { assert } = require('chai');
const { spawnSync } = require('child_process');

// The permanent index used to be created with `enabled: false`, which indexes nothing, so history
// could not look versions up by base id. At startup CaSS rebuilds such an index with an indexed
// baseId field (util.js, skyrepoMigratePermanent).
//
// This file sorts before 0.harness.test.js, which starts the server when it is loaded. On an
// Elasticsearch with no permanent index (a fresh test cluster), it stages a legacy one now, before
// the server starts, and then checks the migration. On a cluster that already has a permanent index
// it stages nothing, so data that is not the test's own is never touched.
const endpoint = process.env.ELASTICSEARCH_ENDPOINT || 'http://localhost:9200';
const base = 'legacymigration' + Date.now();
const docs = {
    [base + '.1000']: { data: JSON.stringify({ '@id': 'urn:legacy:' + base + '/1000', name: 'v1' }), writeMs: 1000 },
    [base + '.2000']: { data: JSON.stringify({ '@id': 'urn:legacy:' + base + '/2000', name: 'v2' }), writeMs: 2000 },
    [base + '.']: { data: JSON.stringify({ '@id': 'urn:legacy:' + base + '/2000', name: 'v2' }), writeMs: 2000 },
};

let staged = false;
if (process.env.NODEV == null) {
    // Synchronous, so that the legacy index exists before the harness starts the server.
    const script = `
        const endpoint = ${JSON.stringify(endpoint)};
        const headers = { 'Content-Type': 'application/json' };
        if (process.env.ELASTICSEARCH_AUTHORIZATION) headers.Authorization = process.env.ELASTICSEARCH_AUTHORIZATION.trim();
        const docs = ${JSON.stringify(docs)};
        (async () => {
            const deadline = Date.now() + 120000;
            while (true) {
                try { if ((await fetch(endpoint, { headers })).ok) break; } catch (e) { /* not up yet */ }
                if (Date.now() > deadline) { console.log('unreachable'); return; }
                await new Promise((r) => setTimeout(r, 1000));
            }
            const existing = await fetch(endpoint + '/permanent', { headers });
            if (existing.status !== 404) { console.log('exists'); return; }
            const created = await fetch(endpoint + '/permanent', { method: 'PUT', headers, body: JSON.stringify({ mappings: { enabled: false } }) });
            if (!created.ok) { console.log('create failed ' + created.status); return; }
            for (const [id, doc] of Object.entries(docs)) {
                const put = await fetch(endpoint + '/permanent/_doc/' + encodeURIComponent(id) + '?refresh=true', { method: 'PUT', headers, body: JSON.stringify(doc) });
                if (!put.ok) { console.log('put failed ' + put.status); return; }
            }
            console.log('staged');
        })();
    `;
    const result = spawnSync(process.execPath, ['-e', script], { encoding: 'utf8', timeout: 150000 });
    staged = (result.stdout || '').trim() === 'staged';
}

describe('SkyRepo permanent index migration', function () {
    this.timeout(120000);
    const headers = () => global.elasticHeaders();

    before(async function () {
        if (process.env.NODEV != null || !staged) this.skip();
        let connected = false;
        const subscription = global.events.database.connected.subscribe((isConnected) => { if (isConnected) connected = true; });
        while (!connected) await new Promise((resolve) => setTimeout(resolve, 100));
        if (subscription && subscription.unsubscribe) subscription.unsubscribe();
    });

    it('rebuilds a legacy permanent index with an indexed baseId field', async () => {
        const mapping = await (await fetch(endpoint + '/permanent/_mapping', { headers: headers() })).json();
        assert.isUndefined(mapping.permanent.mappings.enabled);
        assert.strictEqual(mapping.permanent.mappings.dynamic, 'false');
        assert.deepEqual(mapping.permanent.mappings.properties.baseId, { type: 'keyword' });
    });

    it('keeps every document, each with the base id taken from its _id', async () => {
        for (const [id, doc] of Object.entries(docs)) {
            const stored = await (await fetch(endpoint + '/permanent/_doc/' + encodeURIComponent(id), { headers: headers() })).json();
            assert.isTrue(stored.found, id);
            assert.strictEqual(stored._source.data, doc.data, id);
            assert.strictEqual(stored._source.baseId, base, id);
        }
    });

    it('finds every version by base id afterwards', async () => {
        const found = await (await fetch(endpoint + '/permanent/_search', {
            method: 'POST',
            headers: { ...headers(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: { term: { baseId: base } }, size: 10 }),
        })).json();
        assert.sameMembers(found.hits.hits.map((h) => h._id), Object.keys(docs));
    });

    it('removes its working copy', async () => {
        const temp = await fetch(endpoint + '/.temp.permanent', { headers: headers() });
        assert.strictEqual(temp.status, 404);
    });
});
