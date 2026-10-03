const chai = require('chai');
const assert = chai.assert;
require('cassproject');

// Other applications may share CaSS's Elasticsearch cluster and keep their data in indices
// whose names start with '@'. These tests seed such an index directly in Elasticsearch and
// then try to reach its documents through every CaSS API path that ends in an Elasticsearch
// query: default searches, index_hint searches, URL-addressed searches, single and multi
// gets (whose "degraded" fallback is a cluster-wide search), and the writes that search
// for existing records before mutating them. None of them may see the seeded data.
const CASS_LOOPBACK = process.env.CASS_LOOPBACK || 'http://localhost/api/';

describe('Foreign (@-prefixed) Elasticsearch indices are unreachable through the API', function () {
    this.timeout(60000);

    const esEndpoint = () => global.elasticEndpoint || process.env.ELASTICSEARCH_ENDPOINT || 'http://localhost:9200';
    const esHeaders = () => {
        const headers = { 'Content-Type': 'application/json' };
        if (process.env.ELASTICSEARCH_AUTHORIZATION != null) {
            headers.Authorization = process.env.ELASTICSEARCH_AUTHORIZATION.trim();
        }
        return headers;
    };

    const suffix = EcCrypto.generateUUID().replace(/-/g, '').substring(0, 12).toLowerCase();
    const FOREIGN_INDEX = '@cass-test-foreign-' + suffix;
    // A single, unique search token that appears in every seeded document.
    const CANARY = 'foreigncanary' + suffix;
    const COMPETENCY_TYPE = 'schema.cassproject.org.0.4.Competency';
    const readGuid = EcCrypto.generateUUID();
    const plainGuid = EcCrypto.generateUUID();
    const saveGuid = EcCrypto.generateUUID();
    const deleteGuid = EcCrypto.generateUUID();
    const idFor = (guid) => CASS_LOOPBACK + 'data/' + COMPETENCY_TYPE + '/' + guid;
    const cassShapedDoc = (guid) => ({
        '@context': 'https://schema.cassproject.org/0.4',
        '@type': 'Competency',
        '@id': idFor(guid),
        'name': CANARY,
        'description': 'Seeded directly into ' + FOREIGN_INDEX + ' by the test suite.',
    });
    // Markers that must never show up in a successful API response. saveGuid is deliberately
    // absent: the write test legitimately creates a CaSS object with that guid.
    const LEAK_MARKERS = () => [CANARY, readGuid, plainGuid, deleteGuid, FOREIGN_INDEX];

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
    // exposing anything that lives only in the foreign index.
    function assertNotLeaked(res, label) {
        if (res.status >= 200 && res.status < 300) {
            for (const marker of LEAK_MARKERS()) {
                assert.notInclude(res.text, marker, `${label} returned HTTP ${res.status} containing "${marker}": ${res.text.substring(0, 300)}`);
            }
        }
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
                console.log('Elasticsearch is not reachable from the test host at ' + esEndpoint() + '; skipping foreign-index tests.');
                this.skip();
            }
            assert.fail('Elasticsearch must be reachable at ' + esEndpoint() + ' to seed a foreign index for these tests.');
        }
        const created = await es('PUT', '/' + FOREIGN_INDEX, { settings: { number_of_shards: 1, number_of_replicas: 0 } });
        assert.strictEqual(created.status, 200, 'Could not create ' + FOREIGN_INDEX + ': ' + created.text);
        const seeds = [
            [readGuid, cassShapedDoc(readGuid)],
            [saveGuid, cassShapedDoc(saveGuid)],
            [deleteGuid, cassShapedDoc(deleteGuid)],
            [plainGuid, { message: CANARY, source: 'some-other-application' }],
        ];
        for (const [guid, doc] of seeds) {
            const put = await es('PUT', '/' + FOREIGN_INDEX + '/_doc/' + guid + '?refresh=true', doc);
            assert.include([200, 201], put.status, 'Could not seed ' + guid + ' into ' + FOREIGN_INDEX + ': ' + put.text);
        }
    });

    after(async function () {
        await es('DELETE', '/' + FOREIGN_INDEX);
    });

    describe('test fixture sanity', () => {
        it('the seeded documents are visible to an unrestricted Elasticsearch query', async () => {
            const res = await es('GET', '/*/_search?q=' + CANARY);
            assert.strictEqual(res.json?.hits?.total?.value, 4, 'expected all four seeded documents: ' + res.text.substring(0, 300));
        });
        it('the default CaSS index expression hides them at the Elasticsearch level', async () => {
            const res = await es('GET', '/*,-permanent,-@*/_search?q=' + CANARY);
            assert.strictEqual(res.json?.hits?.total?.value, 0, res.text.substring(0, 300));
        });
    });

    const SEARCH_ENDPOINTS = ['data/', 'sky/repo/search'];
    // Ways a caller could try to steer the search at the foreign index.
    const HOSTILE_HINTS = () => [
        FOREIGN_INDEX,
        '@*',
        '*',
        '*foreign*',
        FOREIGN_INDEX + ',permanent',
        FOREIGN_INDEX.toUpperCase(),
    ];
    // Both endpoints accept a searchParams JSON part; only sky/repo/search takes the query as 'data'.
    const postFields = (endpoint, params) => {
        const fields = { signatureSheet: '[]' };
        if (endpoint === 'data/') {
            fields.searchParams = JSON.stringify({ q: CANARY, ...params });
        } else {
            fields.data = CANARY;
            fields.searchParams = JSON.stringify(params);
        }
        return fields;
    };

    for (const endpoint of SEARCH_ENDPOINTS) {
        describe(`search via ${endpoint}`, () => {
            it('GET with the default index set does not return foreign documents', async () => {
                assertNotLeaked(await apiGet(`${endpoint}?q=${CANARY}`), `GET ${endpoint}?q=`);
                assertNotLeaked(await apiGet(`${endpoint}?q=${CANARY}&ids=true`), `GET ${endpoint}?q=&ids=true`);
                assertNotLeaked(await apiGet(`${endpoint}?q=*&size=10000`), `GET ${endpoint}?q=*`);
            });

            it('POST with the default index set does not return foreign documents', async () => {
                assertNotLeaked(await apiPostForm(endpoint, postFields(endpoint, { size: 10000 })), `POST ${endpoint}`);
                assertNotLeaked(await apiPostForm(endpoint, postFields(endpoint, { size: 10000, ids: true })), `POST ${endpoint} ids`);
            });

            for (const hint of HOSTILE_HINTS()) {
                it(`GET with index_hint=${hint} does not return foreign documents`, async () => {
                    const h = encodeURIComponent(hint);
                    assertNotLeaked(await apiGet(`${endpoint}?q=${CANARY}&index_hint=${h}`), `GET ${endpoint} index_hint=${hint}`);
                    assertNotLeaked(await apiGet(`${endpoint}?q=${CANARY}&index_hint=${h}&ids=true`), `GET ${endpoint} index_hint=${hint} ids`);
                    assertNotLeaked(await apiGet(`${endpoint}?q=*&size=10000&index_hint=${h}`), `GET ${endpoint} q=* index_hint=${hint}`);
                });

                it(`POST with searchParams.index_hint=${hint} does not return foreign documents`, async () => {
                    assertNotLeaked(await apiPostForm(endpoint, postFields(endpoint, { index_hint: hint, size: 10000 })), `POST ${endpoint} index_hint=${hint}`);
                    assertNotLeaked(await apiPostForm(endpoint, postFields(endpoint, { index_hint: hint, size: 10000, ids: true })), `POST ${endpoint} index_hint=${hint} ids`);
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
        it('POST data/<@index> with searchParams does not return foreign documents', async () => {
            assertNotLeaked(await apiPostForm(`data/${FOREIGN_INDEX}`, postFields('data/', { size: 10000 })), `POST data/${FOREIGN_INDEX}`);
        });
    });

    describe('object retrieval (whose fallback is a cluster-wide search)', () => {
        it('GET data/<guid> cannot resolve a document that only exists in a foreign index', async () => {
            assertNotFound(await apiGet(`data/${readGuid}`), `GET data/${readGuid}`);
            assertNotFound(await apiGet(`data/${plainGuid}`), `GET data/${plainGuid}`);
        });
        it('GET data/<@index>/<guid> cannot read from a foreign index by naming it as the type', async () => {
            assertNotFound(await apiGet(`data/${FOREIGN_INDEX}/${readGuid}`), `GET data/${FOREIGN_INDEX}/${readGuid}`);
            assertNotFound(await apiGet(`data/${FOREIGN_INDEX.toUpperCase()}/${readGuid}`), `GET data/${FOREIGN_INDEX.toUpperCase()}/${readGuid}`);
        });
        it('GET data/<type>/<guid> with a CaSS type does not fall through to the foreign copy', async () => {
            assertNotFound(await apiGet(`data/${COMPETENCY_TYPE}/${readGuid}`), `GET data/${COMPETENCY_TYPE}/${readGuid}`);
        });
        it('POST sky/repo/multiGet cannot resolve documents that only exist in a foreign index', async () => {
            const targets = JSON.stringify([
                'data/' + readGuid,
                'data/' + plainGuid,
                'data/' + FOREIGN_INDEX + '/' + readGuid,
                'data/' + COMPETENCY_TYPE + '/' + readGuid,
            ]);
            assertNotLeaked(await apiPostForm('sky/repo/multiGet', { data: targets, signatureSheet: '[]' }), 'POST sky/repo/multiGet');
            assertNotLeaked(await apiPostForm('sky/repo/multiGet', { data: targets, ids: 'true', signatureSheet: '[]' }), 'POST sky/repo/multiGet ids');
        });
    });

    describe('writes that search for existing records first', () => {
        it('saving a CaSS object whose @id collides with a foreign document leaves the foreign document alone', async () => {
            assert.isTrue(await foreignDocExists(saveGuid), 'fixture: foreign copy must exist before the save');
            // Same request the cassproject client issues for repo.saveTo(): the object's @id is
            // exactly the @id already sitting in the foreign index.
            const competency = new EcCompetency();
            competency.id = idFor(saveGuid);
            competency.setName('Legitimate competency ' + suffix);
            const path = 'data/' + COMPETENCY_TYPE + '/' + saveGuid;
            try {
                const saved = await apiPostForm(path, { data: competency.toJson(), signatureSheet: '[]' });
                assert.strictEqual(saved.status, 200, `POST ${path} -> HTTP ${saved.status}: ${saved.text.substring(0, 300)}`);
                const readBack = await apiGet('data/' + saveGuid);
                assert.strictEqual(readBack.status, 200, 'sanity: the CaSS copy should be readable after saving');
                assert.include(readBack.text, 'Legitimate competency ' + suffix);
                assert.notInclude(readBack.text, CANARY, 'the CaSS read must come from the CaSS copy, not the foreign one');
                assert.isTrue(await foreignDocExists(saveGuid), 'saving over a colliding @id must not delete the foreign index record');
            } finally {
                await apiDelete(path);
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
    });

    describe('legitimate searches still work with the exclusion in place', () => {
        it('a CaSS object is found with and without an index_hint', async () => {
            const guid = EcCrypto.generateUUID();
            const competency = new EcCompetency();
            competency.id = idFor(guid);
            const name = 'Findable competency ' + suffix;
            competency.setName(name);
            const path = 'data/' + COMPETENCY_TYPE + '/' + guid;
            try {
                const saved = await apiPostForm(path, { data: competency.toJson(), signatureSheet: '[]' });
                assert.strictEqual(saved.status, 200, `POST ${path} -> HTTP ${saved.status}: ${saved.text.substring(0, 300)}`);
                for (const hint of [null, '*', '*competency', COMPETENCY_TYPE.toLowerCase()]) {
                    const query = `data/?q=${encodeURIComponent('name:"' + name + '"')}` + (hint == null ? '' : `&index_hint=${encodeURIComponent(hint)}`);
                    const res = await apiGet(query);
                    assert.strictEqual(res.status, 200, `${query} -> HTTP ${res.status}: ${res.text.substring(0, 300)}`);
                    assert.include(res.text, guid, `${query} should still find the CaSS object`);
                    assertNotLeaked(res, query);
                }
            } finally {
                await apiDelete(path);
            }
        });
    });
});
