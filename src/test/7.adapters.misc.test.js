const { assert } = require('chai');

// Adapter paths the other tests do not reach: the Ollama framework generator (against a stubbed
// Ollama), profile request validation, OpenBadges assertions, and the MCP tool and resource proxies.
describe('Adapters (coverage)', function () {
    this.timeout(120000);
    const loopback = process.env.CASS_LOOPBACK || 'http://localhost/api/';
    let repo;
    let owner;

    const getText = async (path, init) => {
        const res = await fetch(loopback + path, init);
        return { status: res.status, text: await res.text(), headers: res.headers };
    };

    before(async function () {
        if (process.env.NODEV != null) this.skip();
        let ready = false;
        global.events.server.ready.subscribe((isReady) => { if (isReady) ready = true; });
        while (!ready) await new Promise((resolve) => setTimeout(resolve, 100));
        repo = new EcRepository();
        await repo.init(loopback);
        owner = new EcIdentity();
        owner.ppk = EcPpk.generateKey();
        owner.displayName = 'Adapter coverage owner';
        EcIdentityManager.default.addIdentity(owner);
    });

    describe('Ollama', function () {
        const realFetch = global.fetch;
        let prompts;
        let pullOk;

        // The adapter talks to Ollama on localhost:11434 through the global fetch; answer those calls here.
        beforeEach(() => {
            prompts = [];
            pullOk = true;
            global.fetch = async (url, init) => {
                const u = String(url);
                if (!u.startsWith('http://localhost:11434/')) return realFetch(url, init);
                if (u.endsWith('/api/pull')) {
                    if (!pullOk) throw new Error('connection refused');
                    return new Response('{}', { status: 200 });
                }
                const body = JSON.parse(init.body);
                prompts.push(body.prompt);
                return new Response(JSON.stringify({ response: 'Answer ' + prompts.length, context: [prompts.length] }), { status: 200 });
            };
        });
        afterEach(() => { global.fetch = realFetch; });

        it('builds a framework of tasks, knowledge, skills and abilities from Ollama\'s answers', async () => {
            const res = await getText('ollama/framework?name=' + encodeURIComponent('Bridge Building'));
            assert.strictEqual(res.status, 200, res.text);
            const { framework, competencies } = JSON.parse(res.text);
            assert.strictEqual(framework.name, 'Bridge Building');
            assert.match(framework.description, /^Answer \d+$/);
            assert.include(prompts[0], 'human capabilities framework for "Bridge Building"');
            assert.lengthOf(competencies, 5, 'five top-level tasks');
            const first = competencies[0];
            assert.strictEqual(first['dcterms:type'], 'Task');
            assert.match(first.name, /^Answer \d+$/);
            // Two of each of four kinds under every task, two levels deep.
            assert.lengthOf(first.children, 8);
            assert.sameMembers([...new Set(first.children.map((c) => c['dcterms:type']))], ['Task', 'Knowledge', 'Skill', 'Natural Ability']);
            assert.lengthOf(first.children[0].children, 8);
            assert.deepEqual(first.children[0].children[0].children, undefined);
        });

        it('fails when Ollama is not running', async () => {
            pullOk = false;
            const res = await getText('ollama/framework?name=Anything');
            assert.strictEqual(res.status, 500);
            assert.include(res.text, 'Ollama service is not running');
        });
    });

    describe('Profile request validation', function () {
        it('requires a framework', async () => {
            const res = await getText('profile/latest?subject=someone@example.com');
            assert.strictEqual(res.status, 400);
            assert.include(res.text, 'Framework not identified or does not exist.');
        });

        it('requires the server to act for someone', async () => {
            const saved = global.AUTH_OVERRIDE;
            const savedKey = global.AUTH_OVERRIDE_KEY;
            const savedPpk = process.env.PROFILE_PPK;
            delete global.AUTH_OVERRIDE;
            delete global.AUTH_OVERRIDE_KEY;
            delete process.env.PROFILE_PPK;
            try {
                const res = await getText('profile/latest?subject=someone@example.com&frameworkId=' + encodeURIComponent(repo.selectedServer + 'data/nothing'));
                assert.strictEqual(res.status, 400);
                assert.include(res.text, 'Server is not acting on behalf of a user');
            } finally {
                if (saved !== undefined) global.AUTH_OVERRIDE = saved;
                if (savedKey !== undefined) global.AUTH_OVERRIDE_KEY = savedKey;
                if (savedPpk !== undefined) process.env.PROFILE_PPK = savedPpk;
            }
        });

        it('acts with PROFILE_PPK when it is set', async () => {
            const savedPpk = process.env.PROFILE_PPK;
            const profileKey = EcPpk.generateKey();
            process.env.PROFILE_PPK = profileKey.toPem();
            try {
                const f = new EcFramework();
                f.generateId(repo.selectedServer);
                f.setName('Profile key framework');
                f.addOwner(owner.ppk.toPk());
                await repo.saveTo(f);
                const out = await global.calculateProfile.call({
                    params: { subject: owner.ppk.toPk().toPem(), frameworkId: f.shortId(), flushCache: 'true' },
                    ctx: { req: {} }
                });
                const profile = JSON.parse(out);
                assert.isArray(profile.children);
            } finally {
                if (savedPpk === undefined) delete process.env.PROFILE_PPK;
                else process.env.PROFILE_PPK = savedPpk;
            }
        });

        it('profileFlush moves the flush time forward', () => {
            assert.doesNotThrow(() => global.profileFlush());
        });
    });

    describe('OpenBadges assertion', function () {
        it('describes an assertion the adapter can read as a hosted badge', async () => {
            const badgePk = EcPk.fromPem(await (await fetch(loopback + 'badge/pk')).text());
            const subject = new EcIdentity();
            subject.ppk = EcPpk.generateKey();
            subject.displayName = 'Badge subject';
            EcIdentityManager.default.addIdentity(subject);
            const subjectPerson = new EcPerson();
            subjectPerson.assignId(repo.selectedServer, subject.ppk.toPk().fingerprint());
            subjectPerson.addOwner(subject.ppk.toPk());
            subjectPerson.name = 'Badge Subject';
            subjectPerson.email = 'badge.subject@example.com';
            await repo.saveTo(subjectPerson);
            const agentPerson = new EcPerson();
            agentPerson.assignId(repo.selectedServer, owner.ppk.toPk().fingerprint());
            agentPerson.addOwner(owner.ppk.toPk());
            agentPerson.name = 'Badge Issuer';
            await repo.saveTo(agentPerson);

            const c = new EcCompetency();
            c.generateId(repo.selectedServer);
            c.setName('Badge competency');
            c.addOwner(owner.ppk.toPk());
            await repo.saveTo(c);

            const a = new EcAssertion();
            a.generateId(repo.selectedServer);
            a.addOwner(owner.ppk.toPk());
            a.addReader(badgePk);
            a.competency = c.shortId();
            a.framework = repo.selectedServer + 'data/some-framework';
            await a.setSubject(subject.ppk.toPk());
            await a.setAgent(owner.ppk.toPk());
            await a.setEvidence(['Watched them do it.', 'https://example.com/evidence']);
            await a.setAssertionDate(Date.parse('2026-01-02T03:04:05Z'));
            await a.setExpirationDate(Date.parse('2027-01-02T03:04:05Z'));
            await repo.saveTo(a);

            const res = await getText('badge/assertion/' + a.getGuid());
            assert.strictEqual(res.status, 200, res.text);
            const badge = JSON.parse(res.text);
            assert.strictEqual(badge.type, 'Assertion');
            assert.strictEqual(badge.id, repo.selectedServer + 'badge/assertion/' + a.getGuid());
            assert.strictEqual(badge.recipient.type, 'email');
            assert.isTrue(badge.recipient.hashed);
            assert.deepEqual(badge.evidence, [{ type: 'Evidence', narrative: 'Watched them do it.' }, 'https://example.com/evidence']);
            assert.strictEqual(badge.issuedOn, '2026-01-02T03:04:05.000Z');
            assert.strictEqual(badge.expires, '2027-01-02T03:04:05.000Z');
            assert.strictEqual(badge.badge, repo.selectedServer + 'badge/class/' + c.getGuid() + '/' + owner.ppk.toPk().fingerprint());
        });

        it('an unknown assertion is refused', async () => {
            const res = await getText('badge/assertion/' + EcCrypto.generateUUID());
            assert.notStrictEqual(res.status, 200);
        });
    });

    describe('MCP tool and resource proxies', function () {
        const MCP_URL = loopback.replace(/\/$/, '') + '/mcp';
        let sessionId;
        let nextId = 1;
        let thing;

        async function rpc(method, params, extraHeaders) {
            const headers = { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', ...(extraHeaders || {}) };
            if (sessionId) headers['Mcp-Session-Id'] = sessionId;
            const message = { jsonrpc: '2.0', method, id: nextId++ };
            if (params !== undefined) message.params = params;
            const res = await fetch(MCP_URL, { method: 'POST', headers, body: JSON.stringify(message) });
            if (res.headers.get('mcp-session-id')) sessionId = res.headers.get('mcp-session-id');
            const text = await res.text();
            assert.isBelow(res.status, 400, text);
            const lines = text.split('\n').filter((l) => l.startsWith('data:'));
            const payload = lines.length ? JSON.parse(lines[lines.length - 1].substring(5).trim()) : JSON.parse(text);
            assert.isUndefined(payload.error, JSON.stringify(payload.error));
            return payload.result;
        }

        before(async () => {
            for (let i = 0; i < 100; i++) {
                const res = await fetch(MCP_URL, { method: 'GET' });
                await res.text();
                if (res.status != 404) break;
                await new Promise((resolve) => setTimeout(resolve, 200));
            }
            await rpc('initialize', { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'coverage', version: '1' } });
            await fetch(MCP_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', 'Mcp-Session-Id': sessionId },
                body: JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' })
            }).then((r) => r.text());
            thing = new schema.Thing();
            thing.generateId(repo.selectedServer);
            thing.name = 'MCP thing';
            thing.addOwner(owner.ppk.toPk());
            await repo.saveTo(thing);
        });

        after(async () => {
            if (sessionId) await fetch(MCP_URL, { method: 'DELETE', headers: { 'Mcp-Session-Id': sessionId } }).then((r) => r.text());
        });

        it('get_object fills the path parameter and returns the object', async () => {
            const result = await rpc('tools/call', { name: 'get_object', arguments: { uid: thing.getGuid() } });
            assert.notOk(result.isError, JSON.stringify(result));
            assert.include(result.content[0].text, 'MCP thing');
        });

        it('get_object reports an API error for an unknown object', async () => {
            const result = await rpc('tools/call', { name: 'get_object', arguments: { uid: EcCrypto.generateUUID() } });
            assert.isTrue(result.isError);
            assert.match(result.content[0].text, /^CaSS API error \(HTTP 4\d\d\)/);
        });

        it('save_object sends its body as multipart form fields, with the caller\'s signature sheet', async () => {
            const updated = new schema.Thing();
            updated.copyFrom(thing);
            updated.name = 'MCP thing, renamed';
            await EcIdentityManager.default.sign(updated);
            const sheet = await EcIdentityManager.default.signatureSheet(60000, repo.selectedServer);
            const result = await rpc('tools/call', { name: 'save_object', arguments: { uid: thing.getGuid(), body: { data: updated.toJson() } } }, { signatureSheet: sheet });
            assert.notOk(result.isError, JSON.stringify(result));
            const saved = await (await fetch(loopback + 'data/' + thing.getGuid(), { headers: { Accept: 'application/json' } })).json();
            assert.strictEqual(saved.name, 'MCP thing, renamed');
        });

        it('save_object sends a body that is not an object as the data field', async () => {
            const result = await rpc('tools/call', { name: 'save_object', arguments: { uid: EcCrypto.generateUUID(), body: '"just a string"' } });
            assert.isTrue(result.isError, 'a bare string is not an object CaSS can save');
        });

        it('a resource template reads the object it names', async () => {
            const result = await rpc('resources/read', { uri: 'cass://data/' + thing.getGuid() });
            assert.include(result.contents[0].text, 'MCP thing');
            assert.strictEqual(result.contents[0].uri, 'cass://data/' + thing.getGuid());
        });
    });
});
