const chai = require('chai');
const assert = chai.assert;
require('cassproject');

// Two kinds of Elasticsearch index must stay invisible to the CaSS API:
//  - indices whose names start with '@', which belong to other applications sharing the cluster;
//  - 'ephemeral', the server's own cache index of dehydrated blobs.
// These tests seed both directly in Elasticsearch and then try to reach the seeded data through
// every API path that ends in an Elasticsearch query: default searches, index_hint searches,
// URL-addressed searches, single and multi gets (whose "degraded" fallback is a cluster-wide
// search), and the writes that search for existing records before mutating them.
const CASS_LOOPBACK = process.env.CASS_LOOPBACK || 'http://localhost/api/';

describe('Foreign (@-prefixed) and ephemeral Elasticsearch indices are unreachable through the API', function () {
    this.timeout(60000);

    const esEndpoint = () => global.elasticEndpoint || process.env.ELASTICSEARCH_ENDPOINT || 'http://localhost:9200';
    const esHeaders = () => {
        const headers = { 'Content-Type': 'application/json' };
        if (process.env.ELASTICSEARCH_AUTHORIZATION != null) {
            headers.Authorization = process.env.ELASTICSEARCH_AUTHORIZATION.trim();
        }
        return headers;
    };
    // The index expression the server must use for a broad search.
    const DEFAULT_EXPRESSION = '*,-permanent,-ephemeral,-@*';

    const suffix = EcCrypto.generateUUID().replace(/-/g, '').substring(0, 12).toLowerCase();
    const FOREIGN_INDEX = '@cass-test-foreign-' + suffix;
    const EPHEMERAL_KEY = 'cass-test-ephemeral-' + suffix;
    // A single, unique search token that appears in every seeded document.
    const CANARY = 'foreigncanary' + suffix;
    const COMPETENCY_TYPE = 'schema.cassproject.org.0.4.Competency';
    const readGuid = EcCrypto.generateUUID();
    const plainGuid = EcCrypto.generateUUID();
    const saveGuid = EcCrypto.generateUUID();
    const deleteGuid = EcCrypto.generateUUID();
    const ephemeralGuid = EcCrypto.generateUUID();
    const idFor = (guid) => CASS_LOOPBACK + 'data/' + COMPETENCY_TYPE + '/' + guid;
    const cassShapedDoc = (guid) => ({
        '@context': 'https://schema.cassproject.org/0.4',
        '@type': 'Competency',
        '@id': idFor(guid),
        'name': CANARY,
        'description': 'Seeded directly into Elasticsearch by the test suite.',
    });
    // Markers that must never show up in a successful API response. saveGuid is deliberately
    // absent: the write test legitimately creates a CaSS object with that guid.
    const LEAK_MARKERS = () => [CANARY, readGuid, plainGuid, deleteGuid, ephemeralGuid, FOREIGN_INDEX, EPHEMERAL_KEY];

    async function es(method, path, body) {
        const res = await fetch(esEndpoint() + path, {
            method,
            headers: esHeaders(),
            body: body === undefined ? undefined : JSON.stringify(body),
        });
        const text = await res.text();
        let json = null;
        try { json = JSON.parse(text); } catch (e) { /* not JSON */ }
        return { status: res.status, json, text };
    }
    async function foreignDocExists(guid) {
        const res = await es('GET', '/' + FOREIGN_INDEX + '/_doc/' + guid);
        return res.json != null && res.json.found === true;
    }
    async function ephemeralDocExists() {
        const res = await es('GET', '/ephemeral/_doc/' + EPHEMERAL_KEY);
        return res.json != null && res.json.found === true;
    }

    async function apiGet(path) {
        const res = await fetch(CASS_LOOPBACK + path);
        return { status: res.status, text: await res.text() };
    }
    async function apiDelete(path) {
        const res = await fetch(CASS_LOOPBACK + path, { method: 'DELETE' });
        return { status: res.status, text: await res.text() };
    }
    async function apiPostForm(path, fields) {
        const fd = new FormData();
        for (const [key, value] of Object.entries(fields)) {
            fd.append(key, value);
        }
        const res = await fetch(CASS_LOOPBACK + path, { method: 'POST', body: fd });
        return { status: res.status, text: await res.text() };
    }
    // "Not successful" means: either the request was refused, or it succeeded without
    // exposing anything that lives only in an excluded index.
    function assertNotLeaked(res, label) {
        if (res.status >= 200 && res.status < 300) {
            for (const marker of LEAK_MARKERS()) {
                assert.notInclude(res.text, marker, `${label} returned HTTP ${res.status} containing "${marker}": ${res.text.substring(0, 300)}`);
            }
        }
    }
    // Writes go through the raw HTTP API rather than the cassproject client so the test does not
    // depend on the client's fetch/FormData pairing (see profile/undici-compat.js).
    async function apiSaveCompetency(guid, name) {
        const obj = { '@context': 'https://schema.cassproject.org/0.4', '@type': 'Competency', '@id': idFor(guid), 'name': name };
        return apiPostForm(`data/${COMPETENCY_TYPE}/${guid}`, { data: JSON.stringify(obj), signatureSheet: '[]' });
    }
    async function apiDeleteCompetency(guid) {
        try { await apiDelete(`data/${COMPETENCY_TYPE}/${guid}`); } catch (e) { /* best effort cleanup */ }
    }
    function assertNotFound(res, label) {
        assert.isAtLeast(res.status, 400, `${label} should have been refused but returned HTTP ${res.status}: ${res.text.substring(0, 300)}`);
        assertNotLeaked(res, label);
    }

    before(async function () {
        let ping = null;
        try { ping = await es('GET', '/'); } catch (e) { /* unreachable */ }
        if (ping == null || ping.status !== 200) {
            if (process.env.NODEV != null) {
                console.log('Elasticsearch is not reachable from the test host at ' + esEndpoint() + '; skipping excluded-index tests.');
                this.skip();
            }
            assert.fail('Elasticsearch must be reachable at ' + esEndpoint() + ' to seed test indices for these tests.');
        }
        const created = await es('PUT', '/' + FOREIGN_INDEX, { settings: { number_of_shards: 1, number_of_replicas: 0 } });
        assert.strictEqual(created.status, 200, 'Could not create ' + FOREIGN_INDEX + ': ' + created.text);
        const seeds = [
            ['/' + FOREIGN_INDEX + '/_doc/' + readGuid, cassShapedDoc(readGuid)],
            ['/' + FOREIGN_INDEX + '/_doc/' + saveGuid, cassShapedDoc(saveGuid)],
            ['/' + FOREIGN_INDEX + '/_doc/' + deleteGuid, cassShapedDoc(deleteGuid)],
            ['/' + FOREIGN_INDEX + '/_doc/' + plainGuid, { message: CANARY, source: 'some-other-application' }],
            // Same dehydrated shape the server writes into its cache index.
            ['/ephemeral/_doc/' + EPHEMERAL_KEY, { data: JSON.stringify(cassShapedDoc(ephemeralGuid)), writeMs: new Date().getTime() }],
        ];
        for (const [path, doc] of seeds) {
            const put = await es('PUT', path + '?refresh=true', doc);
            assert.include([200, 201], put.status, 'Could not seed ' + path + ': ' + put.text);
        }
    });

    after(async function () {
        await es('DELETE', '/' + FOREIGN_INDEX);
        await es('DELETE', '/ephemeral/_doc/' + EPHEMERAL_KEY + '?refresh=true');
    });

    describe('test fixture sanity', () => {
        it('the seeded foreign documents are visible to an unrestricted Elasticsearch query', async () => {
            const res = await es('GET', '/*/_search?q=' + CANARY);
            assert.strictEqual(res.json?.hits?.total?.value, 4, 'expected all four foreign documents: ' + res.text.substring(0, 300));
        });
        it('the seeded ephemeral document is visible to an unrestricted Elasticsearch query', async () => {
            const res = await es('GET', '/*/_search?q=_id:' + EPHEMERAL_KEY);
            assert.strictEqual(res.json?.hits?.total?.value, 1, res.text.substring(0, 300));
            assert.strictEqual(res.json.hits.hits[0]._index, 'ephemeral');
        });
        it('the default CaSS index expression hides all of them at the Elasticsearch level', async () => {
            let res = await es('GET', '/' + DEFAULT_EXPRESSION + '/_search?q=' + CANARY);
            assert.strictEqual(res.json?.hits?.total?.value, 0, res.text.substring(0, 300));
            res = await es('GET', '/' + DEFAULT_EXPRESSION + '/_search?q=_id:' + EPHEMERAL_KEY);
            assert.strictEqual(res.json?.hits?.total?.value, 0, res.text.substring(0, 300));
        });
    });

    const SEARCH_ENDPOINTS = ['data/', 'sky/repo/search'];
    // Ways a caller could try to steer the search at an excluded index.
    const HOSTILE_HINTS = () => [
        FOREIGN_INDEX,
        '@*',
        '*',
        '*foreign*',
        FOREIGN_INDEX + ',permanent',
        FOREIGN_INDEX.toUpperCase(),
        'ephemeral',
        'eph*',
        FOREIGN_INDEX + ',ephemeral',
    ];
    // Queries that would hit the seeded documents if the index were in scope.
    const HOSTILE_QUERIES = () => [CANARY, '_id:' + EPHEMERAL_KEY, '*'];
    // Both endpoints accept a searchParams JSON part; only sky/repo/search takes the query as 'data'.
    const postFields = (endpoint, q, params) => {
        const fields = { signatureSheet: '[]' };
        if (endpoint === 'data/') {
            fields.searchParams = JSON.stringify({ q, ...params });
        } else {
            fields.data = q;
            fields.searchParams = JSON.stringify(params);
        }
        return fields;
    };

    for (const endpoint of SEARCH_ENDPOINTS) {
        describe(`search via ${endpoint}`, () => {
            it('GET with the default index set does not return excluded documents', async () => {
                for (const q of HOSTILE_QUERIES()) {
                    const eq = encodeURIComponent(q);
                    assertNotLeaked(await apiGet(`${endpoint}?q=${eq}&size=10000`), `GET ${endpoint}?q=${q}`);
                    assertNotLeaked(await apiGet(`${endpoint}?q=${eq}&size=10000&ids=true`), `GET ${endpoint}?q=${q}&ids=true`);
                }
            });

            it('POST with the default index set does not return excluded documents', async () => {
                for (const q of HOSTILE_QUERIES()) {
                    assertNotLeaked(await apiPostForm(endpoint, postFields(endpoint, q, { size: 10000 })), `POST ${endpoint} q=${q}`);
                    assertNotLeaked(await apiPostForm(endpoint, postFields(endpoint, q, { size: 10000, ids: true })), `POST ${endpoint} q=${q} ids`);
                }
            });

            for (const hint of HOSTILE_HINTS()) {
                it(`GET with index_hint=${hint} does not return excluded documents`, async () => {
                    const h = encodeURIComponent(hint);
                    for (const q of HOSTILE_QUERIES()) {
                        const eq = encodeURIComponent(q);
                        assertNotLeaked(await apiGet(`${endpoint}?q=${eq}&size=10000&index_hint=${h}`), `GET ${endpoint} q=${q} index_hint=${hint}`);
                        assertNotLeaked(await apiGet(`${endpoint}?q=${eq}&size=10000&index_hint=${h}&ids=true`), `GET ${endpoint} q=${q} index_hint=${hint} ids`);
                    }
                });

                it(`POST with searchParams.index_hint=${hint} does not return excluded documents`, async () => {
                    for (const q of HOSTILE_QUERIES()) {
                        assertNotLeaked(await apiPostForm(endpoint, postFields(endpoint, q, { index_hint: hint, size: 10000 })), `POST ${endpoint} q=${q} index_hint=${hint}`);
                        assertNotLeaked(await apiPostForm(endpoint, postFields(endpoint, q, { index_hint: hint, size: 10000, ids: true })), `POST ${endpoint} q=${q} index_hint=${hint} ids`);
                    }
                });
            }
        });
    }

    describe('search with the index named in the URL path', () => {
        it('GET data/<@index>?q= does not return foreign documents', async () => {
            assertNotLeaked(await apiGet(`data/${FOREIGN_INDEX}?q=${CANARY}`), `GET data/${FOREIGN_INDEX}?q=`);
            assertNotLeaked(await apiGet(`data/${FOREIGN_INDEX}/?q=*&size=10000`), `GET data/${FOREIGN_INDEX}/?q=*`);
            assertNotLeaked(await apiGet(`data/${FOREIGN_INDEX}?q=${CANARY}&ids=true`), `GET data/${FOREIGN_INDEX}?q=&ids=true`);
        });
        it('GET data/ephemeral?q= does not return cache documents', async () => {
            assertNotLeaked(await apiGet(`data/ephemeral?q=${encodeURIComponent('_id:' + EPHEMERAL_KEY)}`), 'GET data/ephemeral?q=_id:');
            assertNotLeaked(await apiGet(`data/ephemeral/?q=*&size=10000`), 'GET data/ephemeral/?q=*');
        });
        it('POST data/<@index> with searchParams does not return foreign documents', async () => {
            assertNotLeaked(await apiPostForm(`data/${FOREIGN_INDEX}`, postFields('data/', CANARY, { size: 10000 })), `POST data/${FOREIGN_INDEX}`);
            assertNotLeaked(await apiPostForm('data/ephemeral', postFields('data/', '*', { size: 10000 })), 'POST data/ephemeral');
        });
    });

    describe('object retrieval (whose fallback is a cluster-wide search)', () => {
        it('GET data/<guid> cannot resolve a document that only exists in a foreign index', async () => {
            assertNotFound(await apiGet(`data/${readGuid}`), `GET data/${readGuid}`);
            assertNotFound(await apiGet(`data/${plainGuid}`), `GET data/${plainGuid}`);
        });
        it('GET data/<key> cannot resolve a document that only exists in the ephemeral index', async () => {
            assertNotFound(await apiGet(`data/${EPHEMERAL_KEY}`), `GET data/${EPHEMERAL_KEY}`);
        });
        it('GET data/<@index>/<guid> cannot read from a foreign index by naming it as the type', async () => {
            assertNotFound(await apiGet(`data/${FOREIGN_INDEX}/${readGuid}`), `GET data/${FOREIGN_INDEX}/${readGuid}`);
            assertNotFound(await apiGet(`data/${FOREIGN_INDEX.toUpperCase()}/${readGuid}`), `GET data/${FOREIGN_INDEX.toUpperCase()}/${readGuid}`);
        });
        it('GET data/ephemeral/<key> cannot read from the cache index by naming it as the type', async () => {
            assertNotFound(await apiGet(`data/ephemeral/${EPHEMERAL_KEY}`), `GET data/ephemeral/${EPHEMERAL_KEY}`);
            assertNotFound(await apiGet(`data/Ephemeral/${EPHEMERAL_KEY}`), `GET data/Ephemeral/${EPHEMERAL_KEY}`);
        });
        it('GET data/<type>/<guid> with a CaSS type does not fall through to the excluded copy', async () => {
            assertNotFound(await apiGet(`data/${COMPETENCY_TYPE}/${readGuid}`), `GET data/${COMPETENCY_TYPE}/${readGuid}`);
            assertNotFound(await apiGet(`data/${COMPETENCY_TYPE}/${ephemeralGuid}`), `GET data/${COMPETENCY_TYPE}/${ephemeralGuid}`);
        });
        it('POST sky/repo/multiGet cannot resolve documents that only exist in excluded indices', async () => {
            const targets = JSON.stringify([
                'data/' + readGuid,
                'data/' + plainGuid,
                'data/' + EPHEMERAL_KEY,
                'data/' + FOREIGN_INDEX + '/' + readGuid,
                'data/ephemeral/' + EPHEMERAL_KEY,
                'data/' + COMPETENCY_TYPE + '/' + readGuid,
            ]);
            assertNotLeaked(await apiPostForm('sky/repo/multiGet', { data: targets, signatureSheet: '[]' }), 'POST sky/repo/multiGet');
            assertNotLeaked(await apiPostForm('sky/repo/multiGet', { data: targets, ids: 'true', signatureSheet: '[]' }), 'POST sky/repo/multiGet ids');
        });
    });

    describe('writes that search for existing records first', () => {
        it('saving a CaSS object whose @id collides with a foreign document leaves the foreign document alone', async () => {
            assert.isTrue(await foreignDocExists(saveGuid), 'fixture: foreign copy must exist before the save');
            try {
                const save = await apiSaveCompetency(saveGuid, 'Legitimate competency ' + suffix);
                assert.isBelow(save.status, 300, `sanity: saving the CaSS copy failed with HTTP ${save.status}: ${save.text.substring(0, 300)}`);
                const saved = await apiGet('data/' + saveGuid);
                assert.strictEqual(saved.status, 200, 'sanity: the CaSS copy should be readable after saving');
                assert.include(saved.text, 'Legitimate competency ' + suffix);
                assert.notInclude(saved.text, CANARY, 'the CaSS read must come from the CaSS copy, not the foreign one');
                assert.isTrue(await foreignDocExists(saveGuid), 'saving over a colliding @id must not delete the foreign index record');
            } finally {
                await apiDeleteCompetency(saveGuid);
            }
            assert.isTrue(await foreignDocExists(saveGuid), 'deleting the CaSS copy must not delete the foreign index record either');
        });

        it('DELETE data/<@index>/<guid> does not remove a foreign document', async () => {
            assert.isTrue(await foreignDocExists(deleteGuid), 'fixture: foreign copy must exist before the delete');
            await apiDelete(`data/${FOREIGN_INDEX}/${deleteGuid}`);
            assert.isTrue(await foreignDocExists(deleteGuid), 'DELETE with the foreign index as the type must not touch it');
            await apiDelete(`data/${deleteGuid}`);
            assert.isTrue(await foreignDocExists(deleteGuid), 'DELETE by bare guid must not touch it');
            await apiDelete(`data/${COMPETENCY_TYPE}/${deleteGuid}`);
            assert.isTrue(await foreignDocExists(deleteGuid), 'DELETE with a CaSS type must not touch it');
        });

        it('DELETE data/ephemeral/<key> does not remove a cache document', async () => {
            assert.isTrue(await ephemeralDocExists(), 'fixture: ephemeral copy must exist before the delete');
            await apiDelete(`data/ephemeral/${EPHEMERAL_KEY}`);
            assert.isTrue(await ephemeralDocExists(), 'DELETE with ephemeral as the type must not touch it');
            await apiDelete(`data/${EPHEMERAL_KEY}`);
            assert.isTrue(await ephemeralDocExists(), 'DELETE by bare key must not touch it');
        });
    });

    // When the server runs in-process, every Elasticsearch call goes through the global
    // httpGet/httpPost shims. Wrapping them lets us assert on the exact index expression the
    // server sends, which is the only way to observe exclusions whose documents the API would
    // drop anyway (ephemeral blobs have no @type and never surface as objects).
    describe('every Elasticsearch search the server issues carries the exclusions', () => {
        const originals = {};
        const recorded = [];
        before(function () {
            if (process.env.NODEV != null || typeof global.httpPost !== 'function' || typeof global.httpGet !== 'function') {
                this.skip();
            }
            for (const name of ['httpPost', 'httpGet']) {
                originals[name] = global[name];
                global[name] = function (...args) {
                    const url = name === 'httpPost' ? args[1] : args[0];
                    if (typeof url === 'string' && url.indexOf('/_search') !== -1) {
                        recorded.push(url);
                    }
                    return originals[name].apply(this, args);
                };
            }
        });
        after(() => {
            for (const name of Object.keys(originals)) {
                global[name] = originals[name];
            }
        });

        it('across broad searches, hinted searches, gets and multi-gets', async () => {
            recorded.length = 0;
            await apiGet('data/?q=*&size=5');
            await apiGet('sky/repo/search?q=*&size=5');
            for (const hint of HOSTILE_HINTS()) {
                await apiGet(`data/?q=*&index_hint=${encodeURIComponent(hint)}`);
            }
            await apiGet(`data/${FOREIGN_INDEX}?q=*`);
            await apiGet(`data/${readGuid}`);
            await apiGet(`data/${EPHEMERAL_KEY}`);
            await apiPostForm('sky/repo/multiGet', { data: JSON.stringify(['data/' + readGuid, 'data/' + EPHEMERAL_KEY]), signatureSheet: '[]' });
            assert.isAtLeast(recorded.length, HOSTILE_HINTS().length + 4, 'expected the requests above to reach Elasticsearch');
            for (const url of recorded) {
                const expression = url.substring(esEndpoint().length).split('/_search')[0].replace(/^\//, '');
                assert.include(expression, '-ephemeral', 'missing ephemeral exclusion in ' + url);
                assert.include(expression, '-@*', 'missing @ exclusion in ' + url);
                assert.isFalse(expression.toLowerCase().startsWith('ephemeral'), 'ephemeral targeted directly in ' + url);
            }
            // The broad search must use exactly the documented default expression.
            assert.include(recorded[0], '/' + DEFAULT_EXPRESSION + '/_search', 'broad search used ' + recorded[0]);
        });
    });

    describe('legitimate searches still work with the exclusions in place', () => {
        it('a CaSS object is found with and without an index_hint', async () => {
            const guid = EcCrypto.generateUUID();
            const name = 'Findable competency ' + suffix;
            try {
                const save = await apiSaveCompetency(guid, name);
                assert.isBelow(save.status, 300, `sanity: saving failed with HTTP ${save.status}: ${save.text.substring(0, 300)}`);
                for (const hint of [null, '*', '*competency', COMPETENCY_TYPE.toLowerCase()]) {
                    const query = `data/?q=${encodeURIComponent('name:"' + name + '"')}` + (hint == null ? '' : `&index_hint=${encodeURIComponent(hint)}`);
                    const res = await apiGet(query);
                    assert.strictEqual(res.status, 200, `${query} -> HTTP ${res.status}: ${res.text.substring(0, 300)}`);
                    assert.include(res.text, guid, `${query} should still find the CaSS object`);
                    assertNotLeaked(res, query);
                }
                for (const typePath of [COMPETENCY_TYPE, COMPETENCY_TYPE + '/']) {
                    const query = `data/${typePath}?q=${encodeURIComponent('name:"' + name + '"')}`;
                    const res = await apiGet(query);
                    assert.strictEqual(res.status, 200, `${query} -> HTTP ${res.status}: ${res.text.substring(0, 300)}`);
                    assert.include(res.text, guid, `${query} should find the CaSS object through the URL-named index`);
                    assertNotLeaked(res, query);
                }
            } finally {
                await apiDeleteCompetency(guid);
            }
        });
    });
});
