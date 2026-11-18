const { assert } = require('chai');
const recorder = require('./support/skyrepoRecorder');

// The bulk endpoints treat an object as the single-object endpoints do:
//  - multiPut keeps signatures and the payload and secrets of encrypted values out of the search
//    index at every depth, as a single put does;
//  - multiDelete deletes an object that has no owner, as a single delete does.
// Each is checked against the in-memory Elasticsearch, and against the real one through the server.
describe('SkyRepo bulk endpoints match the single-object ones', function () {
    this.timeout(60000);
    let endpoints;
    let server;
    const elasticGet = async (path) => (await fetch(global.elasticEndpoint + path, { headers: global.elasticHeaders() })).json();
    const guid = () => crypto.randomUUID();
    const version = 1800000001000;
    const thing = (id, extra) => ({
        '@context': 'http://schema.org/', '@type': 'Thing', '@id': server + 'data/schema.org.Thing/' + id + '/' + version, 'name': 'Bulk test thing', ...extra,
    });
    const sensitive = (id) => thing(id, {
        '@signature': ['top-signature'],
        'signature': 'bare-signature',
        'part': { '@type': 'EncryptedValue', 'payload': 'inner-ciphertext', 'secret': ['inner-key'], '@signature': ['inner-signature'], 'name': 'kept' },
        'parts': [{ 'type': 'EncryptedValue', 'payload': 'listed-ciphertext', 'secret': ['listed-key'] }, { 'deep': { 'signature': 'deep-signature', 'name': 'also kept' } }],
    });
    const assertIndexedWithoutSecrets = function (indexed, context) {
        const text = JSON.stringify(indexed);
        for (const secret of ['top-signature', 'bare-signature', 'inner-ciphertext', 'inner-key', 'inner-signature', 'listed-ciphertext', 'listed-key', 'deep-signature']) {
            assert.notInclude(text, secret, context);
        }
        assert.strictEqual(indexed.part.name, 'kept', context);
        assert.strictEqual(indexed.parts[1].deep.name, 'also kept', context);
        assert.strictEqual(indexed.name, 'Bulk test thing', context);
    };
    const form = function (fields) {
        const body = new FormData();
        for (const [name, value] of Object.entries(fields)) body.append(name, value);
        return body;
    };

    before(async function () {
        if (process.env.NODEV != null) this.skip();
        let ready = false;
        global.events.server.ready.subscribe((isReady) => { if (isReady) ready = true; });
        while (!ready) await new Promise((resolve) => setTimeout(resolve, 100));
        server = repo.selectedServer;
    });

    describe('against the in-memory Elasticsearch', function () {
        before(() => { endpoints = recorder.install(); });
        after(() => recorder.uninstall());
        const call = (endpoint, options) => endpoints[endpoint].call(recorder.request(options));

        it('multiPut indexes what a single put indexes', async function () {
            const single = guid();
            const many = guid();
            const { elastic } = await recorder.play({}, async () => {
                await call('/data/*', { method: 'POST', params: { urlRemainder: 'schema.org.Thing/' + single + '/' + version }, dataStreams: { data: JSON.stringify(sensitive(single)) } });
                await call('/sky/repo/multiPut', { method: 'POST', dataStreams: { data: JSON.stringify([sensitive(many)]) } });
            });
            const index = elastic.index('schema.org.thing');
            assertIndexedWithoutSecrets(index.get(single).source, 'single put');
            assertIndexedWithoutSecrets(index.get(many).source, 'multiPut');
            // Apart from their ids, the two index entries are the same.
            const comparable = (source, id) => JSON.parse(JSON.stringify(source).replaceAll(id, '<id>'));
            assert.deepStrictEqual(comparable(index.get(many).source, many), comparable(index.get(single).source, single));
            // What is stored in permanent is the whole object.
            assert.deepStrictEqual(JSON.parse(elastic.index('permanent').get(many + '.').source.data), sensitive(many));
        });

        it('multiDelete deletes objects with no owner, and still refuses ones owned by someone else', async function () {
            const unowned = guid();
            const owned = guid();
            const owner = EcPpk.fromPem(require('node:crypto').generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey.export({ type: 'pkcs1', format: 'pem' })).toPk().toPem();
            const { elastic } = await recorder.play({}, async () => {
                await call('/sky/repo/multiPut', { method: 'POST', dataStreams: { data: JSON.stringify([thing(unowned), thing(owned, { '@owner': [owner] })]) }, signatures: [owner] });
                await call('/sky/repo/multiDelete', { method: 'POST', dataStreams: { data: JSON.stringify(['data/schema.org.Thing/' + unowned, 'data/schema.org.Thing/' + owned]) } });
            });
            assert.isFalse(elastic.index('schema.org.thing').has(unowned), 'the unowned object leaves the search index');
            assert.isFalse(elastic.index('permanent').has(unowned + '.'), 'and its latest version leaves permanent');
            assert.isTrue(elastic.index('permanent').has(unowned + '.' + version), 'its history stays');
            assert.isTrue(elastic.index('schema.org.thing').has(owned), 'the owned object is untouched');
            assert.isTrue(elastic.index('permanent').has(owned + '.'));
        });
    });

    describe('against the server', function () {
        const api = () => process.env.CASS_LOOPBACK || 'http://localhost/api/';
        const post = async (path, fields) => fetch(api() + path, { method: 'POST', body: form(fields) });

        it('multiPut keeps signatures and encrypted payloads out of the search index', async function () {
            const id = guid();
            const saved = await (await post('sky/repo/multiPut', { data: JSON.stringify([sensitive(id)]) })).json();
            assert.lengthOf(saved, 1);
            const indexed = await elasticGet('/schema.org.thing/_doc/' + id);
            assert.isTrue(indexed.found);
            assertIndexedWithoutSecrets(indexed._source, 'multiPut');
            const stored = await (await fetch(api() + 'data/' + id)).json();
            assert.deepStrictEqual(stored['@signature'], ['top-signature'], 'the stored object is whole');
            assert.strictEqual(stored.part.payload, 'inner-ciphertext');
            await post('sky/repo/multiDelete', { data: JSON.stringify(['data/schema.org.Thing/' + id]) });
        });

        it('multiDelete deletes objects with no owner', async function () {
            const ids = [guid(), guid()];
            await post('sky/repo/multiPut', { data: JSON.stringify(ids.map((id) => thing(id))) });
            for (const id of ids) assert.strictEqual((await fetch(api() + 'data/' + id)).status, 200);
            const response = await post('sky/repo/multiDelete', { data: JSON.stringify(ids.map((id) => 'data/schema.org.Thing/' + id)) });
            assert.strictEqual(response.status, 200);
            for (const id of ids) {
                assert.strictEqual((await fetch(api() + 'data/' + id)).status, 404, 'gone from /data/');
                assert.isFalse((await elasticGet('/schema.org.thing/_doc/' + id)).found, 'gone from the search index');
            }
            const found = await (await fetch(api() + 'data/?q=' + encodeURIComponent(ids.map((id) => '@id:"' + thing(id)['@id'] + '"').join(' OR ')))).json();
            assert.deepStrictEqual(found, []);
        });
    });
});
