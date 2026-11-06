const { assert } = require('chai');

// Smaller server behaviours: ping field selection, write validation, the custom websocket,
// path checks, route building, search paging, time bounding, and tolerant person lookup.
describe('Server odds and ends', function () {
    this.timeout(60000);
    const loopback = process.env.CASS_LOOPBACK || 'http://localhost/api/';
    let repo;
    let me;

    before(async function () {
        if (process.env.NODEV != null) this.skip();
        let ready = false;
        global.events.server.ready.subscribe((isReady) => { if (isReady) ready = true; });
        while (!ready) await new Promise((resolve) => setTimeout(resolve, 100));
        repo = new EcRepository();
        await repo.init(loopback);
        me = new EcIdentity();
        me.ppk = EcPpk.generateKey();
        me.displayName = 'Odds and ends';
        EcIdentityManager.default.addIdentity(me);
    });

    describe('GET /api/ping?fields=', function () {
        it('returns only the requested fields that exist', async () => {
            const res = await fetch(loopback + 'ping?fields=' + encodeURIComponent(' version, time ,,nonexistent'));
            assert.strictEqual(res.status, 200);
            const body = await res.json();
            assert.deepEqual(Object.keys(body).sort(), ['time', 'version']);
            assert.strictEqual(body.version, (await (await fetch(loopback + 'ping')).json()).version);
        });
    });

    describe('POST /api/data validation', function () {
        const post = async (obj) => {
            const form = new FormData();
            form.append('data', JSON.stringify(obj));
            form.append('signatureSheet', await EcIdentityManager.default.signatureSheet(60000, repo.selectedServer));
            const uid = EcCrypto.generateUUID();
            const res = await fetch(loopback + 'data/schema.org.Thing/' + uid, { method: 'POST', body: form });
            return { status: res.status, text: await res.text() };
        };

        it('refuses an object without @id, @type or @context', async () => {
            const id = repo.selectedServer + 'data/' + EcCrypto.generateUUID();
            const noId = await post({ '@type': 'Thing', '@context': 'https://schema.org/' });
            assert.strictEqual(noId.status, 400);
            assert.include(noId.text, 'Object must have an @id.');
            const noType = await post({ '@id': id, '@context': 'https://schema.org/' });
            assert.strictEqual(noType.status, 400);
            assert.include(noType.text, 'Object must have an @type.');
            const noContext = await post({ '@id': id, '@type': 'Thing' });
            assert.strictEqual(noContext.status, 400);
            assert.include(noContext.text, 'Object must have an @context.');
        });
    });

    describe('GET /api/data/?q= paging', function () {
        it('honours start and size', async () => {
            const name = 'Paged ' + EcCrypto.generateUUID();
            for (let i = 0; i < 3; i++) {
                const t = new schema.Thing();
                t.generateId(repo.selectedServer);
                t.name = name;
                t.addOwner(me.ppk.toPk());
                await repo.saveTo(t);
            }
            const page = async (start, size) => (await fetch(loopback + 'data/?q=' + encodeURIComponent('name:"' + name + '"') + '&start=' + start + '&size=' + size)).json();
            assert.lengthOf(await page(0, 10), 3);
            assert.lengthOf(await page(1, 10), 2);
            assert.lengthOf(await page(1, 1), 1);
        });
    });

    describe('websocket /ws/custom', function () {
        const WebSocket = require('ws');
        const wsUrl = (path) => loopback.replace(/^http/, 'ws').replace(/\/api\/?$/, '') + path;

        it('announces the id of each saved object to connected clients, and forgets them on close', async () => {
            const ws = new WebSocket(wsUrl('/ws/custom'), { rejectUnauthorized: false });
            await new Promise((resolve, reject) => { ws.once('open', resolve); ws.once('error', reject); });
            const t = new schema.Thing();
            t.generateId(repo.selectedServer);
            t.name = 'Announced';
            t.addOwner(me.ppk.toPk());
            const announced = new Promise((resolve) => {
                ws.on('message', (m) => { if (String(m).includes(t.shortId())) resolve(String(m)); });
            });
            await repo.saveTo(t);
            assert.include(await announced, t.shortId());
            await new Promise((resolve) => { ws.once('close', resolve); ws.close(); });
        });

        it('refuses an upgrade on any other path', async () => {
            const ws = new WebSocket(wsUrl('/ws/elsewhere'), { rejectUnauthorized: false });
            const outcome = await new Promise((resolve) => {
                ws.once('open', () => resolve('open'));
                ws.once('error', () => resolve('error'));
            });
            assert.strictEqual(outcome, 'error');
        });
    });

    describe('global helpers', function () {
        it('pathCheck accepts a relative path inside the application and refuses traversal', () => {
            assert.doesNotThrow(() => global.pathCheck('etc/skyId.secret'));
            assert.throws(() => global.pathCheck('../outside'), /Path must be normalized, and not be an absolute path/);
            assert.throws(() => global.pathCheck('etc/../../outside'), /Path must be normalized/);
        });

        it('buildApiRoute joins the server URL, a path and optional query parameters', () => {
            const server = global.selectedServerWithSlash;
            assert.isTrue(server.endsWith('/'));
            assert.strictEqual(global.buildApiRoute('data/x'), server + 'data/x');
            assert.strictEqual(global.buildApiRoute('data/', { q: 'a b', size: 2 }), server + 'data/?q=a+b&size=2');
        });

        it('the old profile coordinator module only says where it went', () => {
            const saved = { log: console.log, warn: console.warn };
            const said = [];
            console.log = (m) => said.push(m);
            console.warn = (m) => said.push(m);
            try {
                const path = require.resolve('../main/server/profile/coordinator.js');
                delete require.cache[path];
                require(path)();
            } finally {
                console.log = saved.log;
                console.warn = saved.warn;
            }
            assert.lengthOf(said, 2);
            for (const m of said) assert.include(m, 'It is now an adapter.');
        });
    });

    describe('time bounding coprocessor', function () {
        let bounding;
        before(() => {
            bounding = require('../main/server/profile/coprocessors/timeBounding.js');
        });
        const assertionAt = (ms) => ({ at: ms, getAssertionDate: async () => ms });
        const run = async (params) => {
            const vertex = {
                positiveAssertion: [assertionAt(1000), assertionAt(2000), assertionAt(3000)],
                negativeAssertion: [assertionAt(1500), assertionAt(2500), assertionAt(3500)],
            };
            const processor = { params, cache: true, g: { metaVerticies: { c: vertex } } };
            await bounding.fetchAssertions.call(processor);
            await bounding.processAssertions.call(processor);
            return { processor, kept: vertex.positiveAssertion.map((a) => a.at), keptNegative: vertex.negativeAssertion.map((a) => a.at) };
        };

        it('without dates, changes nothing and keeps the profile cacheable', async () => {
            const { processor, kept, keptNegative } = await run({});
            assert.isTrue(processor.cache);
            assert.deepEqual(kept, [1000, 2000, 3000]);
            assert.deepEqual(keptNegative, [1500, 2500, 3500]);
        });

        it('drops assertions before startDate and after endDate, and turns caching off', async () => {
            const { processor, kept, keptNegative } = await run({ startDate: '1500', endDate: '3000' });
            assert.isFalse(processor.cache);
            assert.deepEqual(kept, [2000, 3000]);
            assert.deepEqual(keptNegative, [1500, 2500]);
        });

        it('takes either bound on its own', async () => {
            assert.deepEqual((await run({ startDate: '2000' })).kept, [2000, 3000]);
            assert.deepEqual((await run({ endDate: '2000' })).keptNegative, [1500]);
        });
    });

    describe('anythingToPerson tolerance', function () {
        it('an unknown URL resolves to the Unknown Person', async () => {
            const found = await global.anythingToPerson(repo.selectedServer + 'data/' + EcCrypto.generateUUID());
            assert.strictEqual(found.name, 'Unknown Person');
        });

        it('a subject that is neither a string nor an array resolves to the Unknown Person', async () => {
            assert.strictEqual((await global.anythingToPerson(42)).name, 'Unknown Person');
        });

        it('an entity that is not a Person resolves to the Unknown Person', async () => {
            const org = new EcPerson();
            org.generateId(repo.selectedServer);
            org.addOwner(me.ppk.toPk());
            org.email = 'org.' + Date.now() + '@example.com';
            org.personType = 'Organization';
            await repo.saveTo(org);
            assert.strictEqual((await global.anythingToPerson(org.email)).name, 'Unknown Person');
        });

        it('rejects a missing subject', async () => {
            let thrown = null;
            try { await global.anythingToPerson(null); } catch (e) { thrown = e; }
            assert.match(String(thrown && thrown.message), /Parse Error/);
        });
    });
});
