const { assert } = require('chai');
const fs = require('node:fs');
const nodePath = require('node:path');
const nodeCrypto = require('node:crypto');
const recorder = require('./support/skyrepoRecorder');

// Characterization of the skyRepo endpoints: for each scenario below, everything observable is
// recorded (results, errors, each request sent to Elasticsearch, each event published) against an
// in-memory Elasticsearch, and compared with the recording in fixtures/skyrepo.recording.json.
//
// The recording is the specification. A change that is meant to preserve behaviour must leave it
// untouched; a change that is meant to alter behaviour shows up as a reviewable diff of that file.
// To re-record after an intended change: SKYREPO_RECORD=true npm run mochaDev
const recordingPath = nodePath.join(__dirname, 'fixtures', 'skyrepo.recording.json');
const recording = fs.existsSync(recordingPath) ? JSON.parse(fs.readFileSync(recordingPath, 'utf8')) : {};
const rerecord = process.env.SKYREPO_RECORD == 'true';

const RECORDED_VERSIONS = ['9.5.3', '6.8.23'];
const U1 = '11111111-1111-4111-8111-111111111111';
const U2 = '22222222-2222-4222-8222-222222222222';
const U3 = '33333333-3333-4333-8333-333333333333';
const U4 = '44444444-4444-4444-8444-444444444444';

describe('SkyRepo characterization', function () {
    this.timeout(60000);
    let endpoints;
    let tokens;
    let server;
    let alice;
    let bob;
    let adminPk;
    const recorded = {};

    const newKey = function () {
        const { privateKey } = nodeCrypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
        const ppk = EcPpk.fromPem(privateKey.export({ type: 'pkcs1', format: 'pem' }));
        return { ppk: ppk, pk: ppk.toPk().toPem(), rawPk: nodeCrypto.createPublicKey(privateKey).export({ type: 'spki', format: 'pem' }) };
    };

    before(async function () {
        if (process.env.NODEV != null) this.skip();
        let ready = false;
        global.events.server.ready.subscribe((isReady) => { if (isReady) ready = true; });
        while (!ready) await new Promise((resolve) => setTimeout(resolve, 100));
        endpoints = recorder.install();
        server = repo.selectedServer;
        alice = newKey();
        bob = newKey();
        adminPk = skyrepoAdminPk();
        tokens = {
            [alice.pk]: '<pk:alice>', [alice.rawPk]: '<rawpk:alice>', [alice.ppk.toPem()]: '<ppk:alice>',
            [bob.pk]: '<pk:bob>', [bob.rawPk]: '<rawpk:bob>', [bob.ppk.toPem()]: '<ppk:bob>',
            [adminPk]: '<pk:admin>',
            [server]: '<server>/',
        };
    });

    after(function () {
        recorder.uninstall();
        if (rerecord && Object.keys(recorded).length > 0) {
            fs.mkdirSync(nodePath.dirname(recordingPath), { recursive: true });
            fs.writeFileSync(recordingPath, JSON.stringify(recorded, null, 1) + '\n');
        }
    });

    // ---- Things to store -------------------------------------------------------------------------
    // Versions are timestamps in practice. Scenario versions such as 1000 are offsets from this one,
    // which is later than the cut-off the conflict handling uses to tell timestamps from counters.
    const ver = (version) => 1800000000000 + version;
    const local = (uuid, version, extra) => ({
        '@context': 'http://schema.org/', '@type': 'Thing',
        '@id': server + 'data/schema.org.Thing/' + uuid + (version == null ? '' : '/' + ver(version)),
        'name': 'Thing ' + uuid.substring(0, 1), ...extra,
    });
    const foreign = (path, extra) => ({
        '@context': 'http://schema.org/', '@type': 'Thing', '@id': 'https://elsewhere.example/' + path, 'name': 'Foreign ' + path, ...extra,
    });
    const md5 = (s) => EcCrypto.md5(s);

    // ---- Endpoint calls --------------------------------------------------------------------------
    const call = (s, label, endpoint, options) => s.call(label, () => endpoints[endpoint].call(recorder.request(options)));
    const post = (s, label, remainder, obj, options = {}) => call(s, label, '/data/*', {
        method: 'POST', ...options, params: { urlRemainder: remainder, ...options.params },
        dataStreams: { data: typeof obj == 'string' ? obj : JSON.stringify(obj), ...options.dataStreams },
    });
    const get = (s, label, remainder, options = {}) => call(s, label, '/data/*', { method: 'GET', ...options, params: { urlRemainder: remainder, ...options.params } });
    const del = (s, label, remainder, options = {}) => call(s, label, '/data/*', { method: 'DELETE', ...options, params: { urlRemainder: remainder, ...options.params } });
    const multiPut = (s, label, objs, options = {}) => call(s, label, '/sky/repo/multiPut', { method: 'POST', ...options, dataStreams: { data: JSON.stringify(objs) } });
    const multiGet = (s, label, urls, options = {}) => call(s, label, '/sky/repo/multiGet', { method: 'POST', ...options, dataStreams: { data: JSON.stringify(urls), ...options.dataStreams } });
    const multiDelete = (s, label, urls, options = {}) => call(s, label, '/sky/repo/multiDelete', { method: 'POST', ...options, dataStreams: { data: JSON.stringify(urls) } });
    const state = (s, label) => s.call('state: ' + label, async () => s.elastic.dump());
    const thing = (uuid, version) => 'schema.org.Thing/' + uuid + (version == null ? '' : '/' + ver(version));
    // The same with small counter versions, as old data has.
    const counted = (uuid, version, extra) => ({ ...local(uuid, null, extra), '@id': server + 'data/schema.org.Thing/' + uuid + '/' + version });

    // ---- Scenarios -------------------------------------------------------------------------------
    // Each runs against an empty Elasticsearch stand-in.
    const scenarios = {
        'single object: create, read, update, version conflict, delete': async (s) => {
            await post(s, 'create with a version in the URL', thing(U1, 1000), local(U1, 1000));
            await get(s, 'get by id', U1);
            await get(s, 'get by type and id', thing(U1));
            await get(s, 'get by type, id and version', thing(U1, 1000));
            await get(s, 'get a version that does not exist', thing(U1, 999));
            await get(s, 'get something that does not exist', U4);
            await call(s, 'post without a body reads', '/data/*', { method: 'POST', params: { urlRemainder: thing(U1) }, dataStreams: {} });
            await post(s, 'post with an empty body', thing(U1), '');
            await post(s, 'update with a newer version', thing(U1, 2000), local(U1, 2000, { name: 'Renamed' }));
            await post(s, 'update with an older version', thing(U1, 1500), local(U1, 1500, { name: 'Stale' }));
            await post(s, 'update with the same version', thing(U1, 2000), local(U1, 2000, { name: 'Same version' }));
            await get(s, 'history', thing(U1), { params: { history: 'true' } });
            await get(s, 'history as 1', thing(U1), { params: { history: 1 } });
            await get(s, 'history of something that does not exist', U4, { params: { history: 'true' } });
            await state(s, 'before delete');
            await del(s, 'delete', thing(U1));
            await get(s, 'get after delete', U1);
            await state(s, 'after delete');
            await del(s, 'delete again', thing(U1));
        },
        'single object: no version anywhere': async (s) => {
            await post(s, 'create', thing(U1), local(U1));
            await post(s, 'update', thing(U1), local(U1, null, { name: 'Second' }));
            await post(s, 'update by id only', U1, local(U1, null, { name: 'Third' }));
            await get(s, 'get', U1);
            await state(s, 'after three writes');
            await del(s, 'delete by id only', U1);
            await state(s, 'after delete');
        },
        'single object: registered under another server\'s URL': async (s) => {
            const o = foreign('thing/abc');
            await post(s, 'create by md5', 'schema.org.Thing/' + md5(o['@id']), o);
            await post(s, 'update by md5', 'schema.org.Thing/' + md5(o['@id']), { ...o, name: 'Updated' });
            await get(s, 'get by md5', md5(o['@id']));
            await state(s, 'stored');
            await del(s, 'delete by md5', 'schema.org.Thing/' + md5(o['@id']));
            await state(s, 'after delete');
        },
        'single object: validation and refresh': async (s) => {
            await post(s, 'no @id', thing(U1), { '@context': 'http://schema.org/', '@type': 'Thing' });
            await post(s, 'no @type', thing(U1), { '@context': 'http://schema.org/', '@id': server + 'data/' + U1 });
            await post(s, 'no @context', thing(U1), { '@type': 'Thing', '@id': server + 'data/' + U1 });
            await post(s, 'refresh=false', thing(U1, 1000), local(U1, 1000), { params: { refresh: 'false' } });
            await del(s, 'delete with refresh=wait_for', thing(U1), { params: { refresh: 'wait_for' } });
            await get(s, 'no resource', null);
            await call(s, 'unknown method does nothing', '/data/*', { method: 'PUT', params: { urlRemainder: thing(U1) } });
        },
        'single object: ownership': async (s) => {
            const owned = local(U1, 1000, { '@owner': [alice.pk] });
            await post(s, 'create owned', thing(U1, 1000), owned, { signatures: [alice.pk] });
            await post(s, 'update with no signature', thing(U1, 2000), { ...local(U1, 2000), '@owner': [alice.pk] });
            await post(s, 'update by someone else', thing(U1, 2000), { ...local(U1, 2000), '@owner': [alice.pk] }, { signatures: [bob.pk] });
            await post(s, 'update by the owner', thing(U1, 2000), { ...local(U1, 2000), '@owner': [alice.pk] }, { signatures: [bob.pk, alice.pk] });
            await post(s, 'update by the admin', thing(U1, 3000), { ...local(U1, 3000), '@owner': [alice.pk] }, { signatures: [adminPk] });
            await get(s, 'anyone can read it', U1);
            await del(s, 'delete with no signature', thing(U1));
            await del(s, 'delete by someone else', thing(U1), { signatures: [bob.pk] });
            await del(s, 'delete by the owner', thing(U1), { signatures: [alice.pk] });
            await state(s, 'after delete');
        },
        'single object: readers, encrypted values and what is left out of the search index': async (s) => {
            const eev = new EcEncryptedValue();
            const restricted = local(U1, 1000, { '@owner': [bob.rawPk], '@reader': [alice.rawPk], '@signature': ['top-signature'] });
            const encrypted = {
                '@context': eev.context, '@type': eev.type, '@id': server + 'data/' + eev.getDottedType() + '/' + U2 + '/' + ver(1000),
                '@owner': [alice.pk], 'payload': 'ciphertext', 'secret': ['wrapped-key'], '@signature': ['enc-signature'],
            };
            const nested = local(U3, 1000, {
                name: { 'en-us': 'Named', 'fr': 'Nommé' },
                description: { '@language': 'en', '@value': 'Described' },
                part: { '@type': 'EncryptedValue', 'payload': 'inner-ciphertext', 'secret': ['inner-key'], 'signature': 'inner-signature', 'name': 'kept' },
                parts: [{ 'type': 'EncryptedValue', 'payload': 'p', 'secret': ['k'] }, { 'name': { 'en': 'deep', 'xx-not-a-language': 'x' } }],
            });
            await post(s, 'create restricted', thing(U1, 1000), restricted, { signatures: [bob.pk] });
            await post(s, 'create restricted, keys in the form the server writes them', thing(U4, 1000), local(U4, 1000, { '@owner': [bob.pk], '@reader': [alice.pk] }), { signatures: [bob.pk] });
            await post(s, 'create encrypted', eev.getDottedType() + '/' + U2 + '/' + ver(1000), encrypted, { signatures: [alice.pk] });
            await post(s, 'create nested', thing(U3, 1000), nested);
            await state(s, 'stored');
            await get(s, 'restricted, no signature', U1);
            await get(s, 'restricted, a stranger', U1, { signatures: [newKeyPem] });
            await get(s, 'restricted, the reader', U1, { signatures: [alice.pk] });
            await get(s, 'restricted, the owner', U1, { signatures: [bob.pk] });
            await get(s, 'restricted, the admin', U1, { signatures: [adminPk] });
            await get(s, 'second restricted, no signature', U4);
            await get(s, 'second restricted, a stranger', U4, { signatures: [newKeyPem] });
            await get(s, 'second restricted, the reader', U4, { signatures: [alice.pk] });
            await get(s, 'second restricted, the owner', U4, { signatures: [newKeyPem, bob.pk] });
            await get(s, 'second restricted, history as the reader', thing(U4), { signatures: [alice.pk], params: { history: 'true' } });
            await get(s, 'encrypted, no signature', U2);
            await get(s, 'encrypted, the owner', U2, { signatures: [alice.pk] });
            await get(s, 'nested, anyone', U3);
            await call(s, 'search, no signature', '/data/', { params: { q: '*' } });
            await call(s, 'search, the reader', '/data/', { params: { q: '*' }, signatures: [alice.pk] });
            await multiGet(s, 'multiGet, the reader', ['data/' + thing(U4), 'data/' + eev.getDottedType() + '/' + U2, 'data/' + thing(U3)], { signatures: [alice.pk] });
        },
        'single object: changing type moves the search index entry': async (s) => {
            await post(s, 'create as Thing', thing(U1, 1000), local(U1, 1000));
            const person = { ...local(U1, 2000), '@type': 'Person', '@id': server + 'data/schema.org.Person/' + U1 + '/' + ver(2000) };
            await post(s, 'save as Person', 'schema.org.Person/' + U1 + '/' + ver(2000), person);
            await state(s, 'after type change');
            await get(s, 'get by id', U1);
            await del(s, 'delete as Thing', thing(U1));
            await state(s, 'after delete');
        },
        'single object: signed in through SSO': async (s) => {
            const eim = { ids: [{ ppk: alice.ppk }, { ppk: bob.ppk }], sign: async (rld) => { rld.signature = ['signed-by-sso']; } };
            const failing = { ids: [{ ppk: alice.ppk }], sign: async () => { throw new Error('cannot sign'); } };
            await post(s, 'create', thing(U1, 1000), local(U1, 1000), { eim: eim });
            await post(s, 'create when signing fails', thing(U2, 1000), local(U2, 1000), { eim: failing });
            await get(s, 'get', U1, { eim: eim });
            await multiPut(s, 'multiPut', [local(U3, 1000)], { eim: eim });
            await multiPut(s, 'multiPut when signing fails', [local(U4, 1000)], { eim: failing });
            await multiGet(s, 'multiGet', ['data/' + thing(U1), 'data/' + thing(U3)], { eim: eim });
            await call(s, 'search', '/data/', { params: { q: '*' }, eim: eim });
            await del(s, 'delete', thing(U1), { eim: eim });
            await multiDelete(s, 'multiDelete', ['data/' + thing(U3)], { eim: eim });
            await state(s, 'end');
        },
        'single object: replaying a log does not retry a conflicting write': async (s) => {
            const before = process.env.ALLOW_SANCTIONED_REPLAY;
            process.env.ALLOW_SANCTIONED_REPLAY = 'true';
            try {
                await post(s, 'create', thing(U1, 2000), local(U1, 2000));
                await post(s, 'replay an older write', thing(U1, 1000), local(U1, 1000, { name: 'Old' }), { sanctionedReplay: 1 });
                await post(s, 'an older write that is not a replay', thing(U1, 1500), local(U1, 1500, { name: 'Older' }));
                await state(s, 'end');
            } finally {
                if (before === undefined) delete process.env.ALLOW_SANCTIONED_REPLAY;
                else process.env.ALLOW_SANCTIONED_REPLAY = before;
            }
        },
        'single object: an index entry with nothing in permanent': async (s) => {
            s.elastic.index('permanent', true);
            s.elastic.write('schema.org.thing', U1, local(U1, 1000), ver(1000), true);
            s.elastic.write('schema.org.thing', U2, local(U2, 1000, { '@owner': [alice.pk] }), ver(1000), true);
            await get(s, 'get by id falls back to the search index', U1);
            await get(s, 'get by type and id falls back to the search index', thing(U1));
            await get(s, 'get from a foreign index is refused', '@foreign/' + U1);
            await get(s, 'get from the ephemeral index is refused', 'ephemeral/' + U1);
            await multiGet(s, 'multiGet falls back to the search index', ['data/' + thing(U1), 'data/' + U2, 'data/' + thing(U3)]);
            await del(s, 'delete the owned one with no signature', thing(U2));
            await del(s, 'delete', thing(U1));
            await del(s, 'delete from a foreign index', '@foreign/' + U3);
            await state(s, 'end');
        },
        'search through /data/': async (s) => {
            await multiPut(s, 'seed', [local(U1, 1000), local(U2, 1000), local(U3, 1000), foreign('thing/x'),
                { ...local(U4, 1000), '@type': 'Person', '@id': server + 'data/schema.org.Person/' + U4 + '/' + ver(1000) }]);
            await call(s, 'everything', '/data/', { params: { q: '*' } });
            await call(s, 'start and size', '/data/', { params: { q: '*', start: '1', size: '2' } });
            await call(s, 'by type', '/data/', { params: { q: '@type:Person' } });
            await call(s, 'ids only', '/data/', { params: { q: '*', ids: 'true' } });
            await call(s, 'sort and track_scores', '/data/', { params: { q: '*', sort: '[{"name.keyword":"asc"}]', track_scores: 'true' } });
            await call(s, 'index_hint', '/data/', { params: { q: '*', index_hint: 'schema.org.person' } });
            await call(s, 'index_hint naming permanent is ignored', '/data/', { params: { q: '*', index_hint: 'permanent' } });
            await call(s, 'an index in the URL', '/data/*', { params: { q: '*', urlRemainder: 'Schema.Org.Person' } });
            await call(s, 'searchParams override the query string', '/data/', {
                method: 'POST', params: { q: 'name:nothing', start: '3', size: '1', sort: 'ignored', index_hint: 'ignored', ids: null },
                dataStreams: { searchParams: JSON.stringify({ q: '*', start: 0, size: 3, sort: '[{"name.keyword":"desc"}]', track_scores: true, index_hint: 'schema.org.thing', ids: true }) },
            });
            await call(s, 'searchParams with nulls keep the query string', '/data/', {
                method: 'POST', params: { q: '@type:Person', start: '0', size: '1' },
                dataStreams: { searchParams: JSON.stringify({ q: null, start: null, size: null, sort: null, track_scores: null, index_hint: null, history: null, ids: null }) },
            });
            await call(s, 'empty searchParams', '/data/', { method: 'POST', params: { q: '*' }, dataStreams: { searchParams: '{}' } });
            await call(s, 'signed search adds the caller\'s keys', '/data/', { params: { q: '*', size: '1' }, signatures: [alice.pk, bob.pk] });
            await call(s, 'null start and size use the defaults', '/data/', { params: { q: '*', start: null, size: null } });
        },
        'search through /sky/repo/search': async (s) => {
            await multiPut(s, 'seed', [local(U1, 1000), local(U2, 1000), local(U3, 1000)]);
            await call(s, 'no query means everything', '/sky/repo/search', {});
            await call(s, 'query string', '/sky/repo/search', { params: { q: 'name:"Thing 1"', start: '0', size: '5', sort: '[{"name.keyword":"asc"}]', track_scores: 'true', index_hint: 'schema.org.thing', ids: 'true' } });
            await call(s, 'searchParams', '/sky/repo/search', {
                method: 'POST', params: { q: 'name:nothing' },
                dataStreams: { searchParams: JSON.stringify({ q: '*', start: 1, size: 1, sort: '[{"name.keyword":"asc"}]', track_scores: true, index_hint: 'schema.org.thing', ids: true }) },
            });
            await call(s, 'data overrides q', '/sky/repo/search', { method: 'POST', params: { q: 'name:nothing' }, dataStreams: { data: '@type:Thing', searchParams: JSON.stringify({ q: 'name:nothing' }) } });
            await call(s, 'empty data and q', '/sky/repo/search', { method: 'POST', params: { q: '' }, dataStreams: { data: '' } });
        },
        'search fills a page when results are filtered out': async (s) => {
            const objs = [];
            for (let i = 0; i < 6; i++) {
                const uuid = String(i).repeat(8) + '-0000-4000-8000-000000000000';
                objs.push(local(uuid, 1000, i % 2 == 0 ? { '@owner': [bob.pk], '@reader': [bob.pk] } : {}));
            }
            await multiPut(s, 'seed', objs, { signatures: [bob.pk] });
            await call(s, 'two visible results wanted', '/data/', { params: { q: '*', size: '2' } });
            await call(s, 'two visible ids wanted', '/data/', { params: { q: '*', size: '2', ids: 'true' } });
        },
        'search reports Elasticsearch errors': async (s) => {
            const fail = (response) => { const handle = s.elastic.handle; s.elastic.handle = function () { s.elastic.handle = handle; return response; }; };
            fail({ status: 400, body: { error: { root_cause: [{ reason: 'Failed to parse query' }] }, status: 400 } });
            await call(s, 'a bad query', '/data/', { params: { q: '((' } });
            fail({ status: 400, body: { error: { root_cause: [] }, hits: { hits: [] }, status: 400 } });
            await call(s, 'an error without a cause', '/data/', { params: { q: '*' } });
            fail({ status: 200, body: null });
            await call(s, 'no response', '/data/', { params: { q: '*' } });
        },
        'counter versions: a stale write is retried one version at a time': async (s) => {
            await post(s, 'create at 2000', 'schema.org.Thing/' + U1 + '/2000', counted(U1, 2000));
            await post(s, 'post 1998', 'schema.org.Thing/' + U1 + '/1998', counted(U1, 1998, { name: 'Stale post' }));
            await state(s, 'after post');
            await multiPut(s, 'multiPut 2000', [counted(U2, 2000)]);
            await multiPut(s, 'multiPut 1998', [counted(U2, 1998, { name: 'Stale multiPut' })]);
            await state(s, 'after multiPut');
        },
        'multiPut': async (s) => {
            const f = foreign('thing/multi');
            await multiPut(s, 'create local, versionless and foreign', [local(U1, 1000), local(U2), f]);
            await state(s, 'after create');
            await multiPut(s, 'update all three', [local(U1, 2000, { name: 'One again' }), local(U2, null, { name: 'Two again' }), { ...f, name: 'Foreign again' }]);
            await multiPut(s, 'an older version of the first', [local(U1, 1500, { name: 'Stale' })]);
            await multiPut(s, 'the same object twice', [local(U3, 1000, { name: 'First copy' }), local(U3, 1000, { name: 'Second copy' })]);
            await multiPut(s, 'change type', [{ ...local(U2, 5000), '@type': 'Person', '@id': server + 'data/schema.org.Person/' + U2 + '/' + ver(5000) }]);
            await multiPut(s, 'nothing', []);
            await state(s, 'end');
            await multiGet(s, 'read them back', ['data/' + thing(U1), 'data/' + U2, 'data/schema.org.Thing/' + md5(f['@id']), 'data/' + thing(U3)]);
        },
        'multiPut: ownership, encrypted values and what is left out of the search index': async (s) => {
            const eev = new EcEncryptedValue();
            await multiPut(s, 'create owned and unowned', [local(U1, 1000, { '@owner': [alice.rawPk], '@reader': [bob.rawPk], '@signature': ['sig'] }), local(U2, 1000)], { signatures: [alice.pk] });
            await multiPut(s, 'update both with no signature', [local(U1, 2000, { '@owner': [alice.pk], 'name': 'Taken' }), local(U2, 2000, { name: 'Updated' })]);
            await multiPut(s, 'update both as someone else', [local(U1, 2000, { '@owner': [alice.pk], 'name': 'Taken' }), local(U2, 3000, { name: 'Updated again' })], { signatures: [bob.pk] });
            await multiPut(s, 'update as the owner', [local(U1, 2000, { '@owner': [alice.pk], 'name': 'Mine' })], { signatures: [alice.pk] });
            await multiPut(s, 'update as the admin', [local(U1, 3000, { '@owner': [alice.pk], 'name': 'Administered' })], { signatures: [adminPk] });
            await multiPut(s, 'encrypted and nested', [
                { '@context': eev.context, '@type': eev.type, '@id': server + 'data/' + eev.getDottedType() + '/' + U3 + '/' + ver(1000), '@owner': [alice.pk], 'payload': 'ciphertext', 'secret': ['wrapped-key'], '@signature': ['enc-signature'] },
                local(U4, 1000, {
                    name: { 'en-us': 'Named', 'fr': 'Nommé' },
                    part: { '@type': 'EncryptedValue', 'payload': 'inner-ciphertext', 'secret': ['inner-key'], 'signature': 'inner-signature', 'name': 'kept' },
                }),
            ], { signatures: [alice.pk] });
            await state(s, 'end');
        },
        'multiPut: Elasticsearch failures': async (s) => {
            await multiPut(s, 'seed', [local(U1, 1000), local(U2, 1000)]);
            s.elastic.bulkFaults.push((action, meta) => meta._index != 'permanent' && meta._id == U2 ? { type: 'mapper_parsing_exception', reason: 'bad field' } : undefined);
            await multiPut(s, 'the search index rejects one', [local(U1, 2000), local(U2, 2000), local(U3, 2000)]);
            s.elastic.bulkFaults.length = 0;
            s.elastic.bulkFaults.push((action, meta) => meta._index == 'permanent' && meta._id.startsWith(U3) ? { type: 'mapper_parsing_exception', reason: 'bad field' } : undefined);
            await multiPut(s, 'permanent rejects one', [local(U1, 3000), local(U3, 3000)]);
            s.elastic.bulkFaults.length = 0;
            s.elastic.nextBulkResponse = null;
            await multiPut(s, 'no response from the search index', [local(U1, 4000)]);
            await state(s, 'end');
        },
        'multiGet': async (s) => {
            const f = foreign('thing/got');
            await multiPut(s, 'seed', [local(U1, 1000), local(U2, 1000), f]);
            await post(s, 'a second version', thing(U1, 2000), local(U1, 2000, { name: 'Second' }));
            await multiGet(s, 'by type and id', ['data/' + thing(U1), 'data/' + thing(U2)]);
            await multiGet(s, 'a specific version, a bare id, an md5 and a missing one', ['data/' + thing(U1, 1000), 'data/' + U2, 'data/' + md5(f['@id']), 'data/' + thing(U4)]);
            await multiGet(s, 'ids only', ['data/' + thing(U1), 'data/' + thing(U4)], { dataStreams: { ids: 'true' } });
            await multiGet(s, 'nothing', []);
            await multiGet(s, 'no body', undefined);
        },
        'multiDelete': async (s) => {
            const f = foreign('thing/gone');
            await multiPut(s, 'seed', [local(U1, 1000, { '@owner': [alice.pk] }), local(U2, 1000, { '@owner': [bob.pk] }), local(U3, 1000), { ...f, '@owner': [alice.pk] }], { signatures: [alice.pk, bob.pk] });
            await multiDelete(s, 'no signature', ['data/' + thing(U1), 'data/' + thing(U2)]);
            await multiDelete(s, 'alice deletes hers, bob\'s, an unowned one and a missing one', ['data/' + thing(U1), 'data/' + thing(U2), 'data/' + thing(U3), 'data/' + thing(U4), 'data/schema.org.Thing/' + md5(f['@id'])], { signatures: [alice.pk] });
            await state(s, 'after alice');
            await multiDelete(s, 'the admin deletes the rest', ['data/' + thing(U2), 'data/' + thing(U3)], { signatures: [adminPk] });
            await multiDelete(s, 'nothing', []);
            await state(s, 'end');
        },
        'history': async (s) => {
            await post(s, 'v1000', thing(U1, 1000), local(U1, 1000, { name: 'one' }));
            await post(s, 'v3000', thing(U1, 3000), local(U1, 3000, { name: 'three' }));
            await post(s, 'v2000 arrives late', thing(U1, 2000), local(U1, 2000, { name: 'two' }));
            await post(s, 'another object', thing(U2, 1000), local(U2, 1000));
            await get(s, 'history, newest first', thing(U1), { params: { history: 'true' } });
            await get(s, 'history of a restricted object, no signature', thing(U3), { params: { history: 'true' } });
            await call(s, 'history through searchParams', '/data/*', { method: 'POST', params: { urlRemainder: thing(U1) }, dataStreams: { searchParams: JSON.stringify({ history: true }) } });
        },
        'rekey requests': async (s) => {
            const r = new EcRekeyRequest();
            const o = { '@context': r.context, '@type': r.type, '@id': server + 'data/' + r.getDottedType() + '/' + U1 + '/' + ver(1000), 'rekeyPk': alice.pk };
            await post(s, 'post', r.getDottedType() + '/' + U1 + '/' + ver(1000), o);
            await multiPut(s, 'multiPut', [{ ...o, '@id': server + 'data/' + r.getDottedType() + '/' + U2 + '/' + ver(1000) }]);
        },
    };

    // Used as a stranger's key in one scenario; assigned in the first test so before() has run.
    let newKeyPem;

    it('creates the permanent index once, with the mapping history needs', async function () {
        const creations = async (version) => {
            recorder.uninstall();
            endpoints = recorder.install();
            const { log } = await recorder.play({ version: version }, async (s) => {
                await post(s, 'put', thing(U1, 1000), local(U1, 1000));
                await post(s, 'put again', thing(U1, 2000), local(U1, 2000));
                await multiPut(s, 'multiPut', [local(U2, 1000)]);
                await multiPut(s, 'multiPut again', [local(U2, 2000)]);
            });
            return log.filter((e) => e.elastic?.method == 'PUT').map((e) => e.elastic);
        };
        for (const version of ['7.17.28', '9.5.3']) {
            const made = await creations(version);
            assert.isAtLeast(made.length, 1, version);
            assert.isAtMost(made.length, 2, version + ': at most once by put and once by multiPut');
            for (const m of made) assert.deepStrictEqual(m, { method: 'PUT', url: '/permanent', body: { mappings: { dynamic: false, properties: { baseId: { type: 'keyword' } } } } }, version);
        }
        const legacy = await creations('6.8.23');
        assert.isAtLeast(legacy.length, 1);
        for (const m of legacy) assert.deepStrictEqual(m, { method: 'PUT', url: '/permanent', body: { mappings: { permanent: { enabled: false } } } });
        // Leave a private copy in place whose index is already made, so the scenarios below do not record it.
        recorder.uninstall();
        endpoints = recorder.install();
        await recorder.play({}, async (s) => {
            await post(s, 'put', thing(U1, 1000), local(U1, 1000));
            await multiPut(s, 'multiPut', [local(U2, 1000)]);
        });
    });

    const run = async function (scenario, version) {
        if (newKeyPem == null) {
            const stranger = newKey();
            newKeyPem = stranger.pk;
            tokens[stranger.pk] = '<pk:stranger>';
        }
        const { log } = await recorder.play({ version: version }, scenario);
        return recorder.normalize(log, tokens);
    };
    // Removes the document type Elasticsearch 7 still takes in _mget and _bulk requests.
    const withoutDocType = function (value) {
        let found = 0;
        const strip = (v) => {
            if (Array.isArray(v)) return v.map(strip);
            if (v != null && typeof v == 'object') {
                const out = {};
                for (const [k, x] of Object.entries(v)) {
                    if (k == '_type' && x == '_doc') found++;
                    else out[k] = strip(x);
                }
                return out;
            }
            return v;
        };
        return { value: strip(value), found: found };
    };

    for (const [name, scenario] of Object.entries(scenarios)) {
        describe(name, function () {
            // Recorded: current Elasticsearch, and the typed URLs used before Elasticsearch 7.
            for (const version of RECORDED_VERSIONS) {
                const key = name + ' [Elasticsearch ' + version + ']';
                it('Elasticsearch ' + version + ' matches the recording', async function () {
                    const actual = await run(scenario, version);
                    recorded[key] = actual;
                    if (rerecord) return;
                    assert.isDefined(recording[key], 'No recording for this scenario. Record one with SKYREPO_RECORD=true.');
                    assert.deepStrictEqual(actual, recording[key]);
                });
            }
            it('Elasticsearch 8 behaves exactly as 9', async function () {
                assert.deepStrictEqual(await run(scenario, '8.19.4'), await run(scenario, '9.5.3'));
            });
            it('Elasticsearch 7 differs from 9 only by naming the _doc type in _mget and _bulk', async function () {
                const seven = withoutDocType(await run(scenario, '7.17.28'));
                const nine = withoutDocType(await run(scenario, '9.5.3'));
                assert.strictEqual(nine.found, 0);
                assert.deepStrictEqual(seven.value, nine.value);
                const text = JSON.stringify(nine.value);
                if (text.includes('"/_mget"') || text.includes('"/_bulk"')) assert.isAbove(seven.found, 0);
            });
        });
    }

    it('the recording has no scenarios that no longer exist', function () {
        if (rerecord) this.skip();
        const expected = Object.keys(scenarios).flatMap((name) => RECORDED_VERSIONS.map((v) => name + ' [Elasticsearch ' + v + ']'));
        assert.sameMembers(Object.keys(recording), expected);
    });
});
