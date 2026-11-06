const { assert } = require('chai');
const http = require('http');
const fs = require('fs');

// xAPI statement handling the main xAPI tests do not reach (expectation responses, groups,
// context agents, language maps, existing learners) and polling an LRS, against a stub LRS.
describe('xAPI adapter (coverage)', function () {
    this.timeout(120000);
    const loopback = process.env.CASS_LOOPBACK || 'http://localhost/api/';
    const run = Date.now();
    let repo;
    let framework;
    let competency;
    let activity;
    let authority;
    let authorityEmail;

    const identity = (name) => {
        const i = new EcIdentity();
        i.ppk = EcPpk.generateKey();
        i.displayName = name;
        EcIdentityManager.default.addIdentity(i);
        return i;
    };
    // A Person the adapter can resolve: stored under its own key's fingerprint.
    const person = async (i, email, name) => {
        const p = new EcPerson();
        p.assignId(repo.selectedServer, i.ppk.toPk().fingerprint());
        p.addOwner(i.ppk.toPk());
        p.email = email;
        if (name != null) p.name = name;
        await repo.saveTo(p);
        await refresh();
        return p;
    };
    // Make what was just saved searchable, as the adapter finds learners by searching.
    const refresh = async () => {
        await fetch(global.elasticEndpoint + '/_refresh', { method: 'POST', headers: global.elasticHeaders() });
    };
    const statement = (actor, result, extra) => ({
        id: EcCrypto.generateUUID(),
        actor,
        verb: { id: 'http://adlnet.gov/expapi/verbs/completed', display: { 'en-US': 'completed' } },
        object: { id: activity, objectType: 'Activity' },
        result,
        authority: { objectType: 'Agent', mbox: 'mailto:' + authorityEmail },
        timestamp: '2026-03-04T05:06:07Z',
        ...(extra || {})
    });
    const submit = async (s) => {
        const res = await fetch(loopback + 'xapi/statement', { method: 'POST', body: JSON.stringify(s), headers: { 'Content-Type': 'application/json' } });
        assert.strictEqual(res.status, 200, await res.text());
    };
    // The assertion the adapter makes for statement s about competency targetUrl, if any. Assertions
    // are read with a signature: only their owners and readers may see them.
    const assertionFor = async (s, targetUrl) => {
        const found = await EcAssertion.get(repo.selectedServer + 'data/' + EcCrypto.md5(s.id + targetUrl), null, null, repo).catch(() => null);
        if (found == null) return null;
        const a = new EcAssertion();
        a.copyFrom(found);
        return a;
    };

    before(async function () {
        if (process.env.NODEV != null) this.skip();
        let ready = false;
        global.events.server.ready.subscribe((isReady) => { if (isReady) ready = true; });
        while (!ready) await new Promise((resolve) => setTimeout(resolve, 100));
        repo = new EcRepository();
        await repo.init(loopback);
        authority = identity('xAPI coverage authority');
        authorityEmail = 'xapi.cov.authority.' + run + '@example.com';
        await person(authority, authorityEmail, 'Authority');

        competency = new EcCompetency();
        competency.generateId(repo.selectedServer);
        competency.setName('xAPI coverage competency');
        competency.addOwner(authority.ppk.toPk());
        framework = new EcFramework();
        framework.generateId(repo.selectedServer);
        framework.setName('xAPI coverage framework');
        framework.addOwner(authority.ppk.toPk());
        framework.addCompetency(competency.shortId());
        activity = 'https://activities.example.com/xapi-coverage/' + run;
        const cw = new schema.CreativeWork();
        cw.assignId(repo.selectedServer, EcCrypto.md5(activity));
        cw.url = activity;
        cw.educationalAlignment = [{ targetUrl: competency.shortId(), educationalFramework: framework.shortId() }];
        cw.addOwner(authority.ppk.toPk());
        await repo.multiput([competency, framework, cw]);
        await refresh();
    });

    describe('statements', function () {
        for (const [response, negative] of [['At Expectation', false], ['Above Expectation', false], ['Below Expectation', true]]) {
            it(`a "${response}" response makes a ${negative ? 'negative' : 'positive'} assertion`, async () => {
                const learner = identity('Learner ' + response);
                const email = 'xapi.cov.' + response.replace(/ /g, '') + '.' + run + '@example.com';
                await person(learner, email, 'Learner');
                const s = statement({ objectType: 'Agent', mbox: 'mailto:' + email }, { response });
                await submit(s);
                const a = await assertionFor(s, competency.shortId());
                assert.isNotNull(a, 'assertion saved');
                assert.strictEqual((await a.getSubject()).toPem(), learner.ppk.toPk().toPem());
                assert.strictEqual(await a.getNegative(), negative);
                assert.strictEqual(a.confidence, 1);
            });
        }

        it('an unrecognised response is ignored', async () => {
            const s = statement({ objectType: 'Agent', mbox: 'mailto:' + authorityEmail }, { response: 'Maybe' });
            await submit(s);
            assert.isNull(await assertionFor(s, competency.shortId()));
        });

        it('a single context agent, not in an array, becomes the assertion\'s agent', async () => {
            const learner = identity('Learner with a coach');
            const email = 'xapi.cov.coached.' + run + '@example.com';
            await person(learner, email, 'Coached');
            const coach = identity('Coach');
            const coachEmail = 'xapi.cov.coach.' + run + '@example.com';
            await person(coach, coachEmail, 'Coach');
            const s = statement({ objectType: 'Agent', mbox: 'mailto:' + email }, { success: true }, {
                context: { contextAgents: { objectType: 'contextAgent', agent: { objectType: 'Agent', mbox: 'mailto:' + coachEmail } } }
            });
            await submit(s);
            const a = await assertionFor(s, competency.shortId());
            assert.isNotNull(a);
            assert.strictEqual((await a.getAgent()).toPem(), coach.ppk.toPk().toPem());
            assert.isTrue(a.hasOwner(coach.ppk.toPk()));
        });

        it('a group of learners is asserted about through a Person for the group', async () => {
            const ann = identity('Ann');
            const ben = identity('Ben');
            const annEmail = 'xapi.cov.ann.' + run + '@example.com';
            const benEmail = 'xapi.cov.ben.' + run + '@example.com';
            await person(ann, annEmail, 'Ann');
            await person(ben, benEmail, 'Ben');
            const s = statement({
                objectType: 'Group',
                member: [{ objectType: 'Agent', mbox: 'mailto:' + annEmail }, { objectType: 'Agent', mbox: 'mailto:' + benEmail }]
            }, { success: true });
            await submit(s);
            const a = await assertionFor(s, competency.shortId());
            assert.isNotNull(a);
            assert.isTrue(a.hasReader(ann.ppk.toPk()));
            assert.isTrue(a.hasReader(ben.ppk.toPk()));
            const groupMd5 = EcCrypto.md5([ann.ppk.toPk().toPem(), ben.ppk.toPk().toPem()].sort().join(''));
            const groups = await EcPerson.search(repo, `identifier:"${groupMd5}"`);
            assert.lengthOf(groups, 1, 'one Person stands for the group');
            assert.sameMembers(groups[0].name.split(', '), ['Ann', 'Ben']);
            assert.isTrue(a.hasReader(EcPk.fromPem(groups[0].owner[0])));
        });

        it('creates a Person for a new learner, and fills in its name when a later statement gives one', async () => {
            const email = 'xapi.cov.newcomer.' + run + '@example.com';
            await submit(statement({ objectType: 'Agent', mbox: 'mailto:' + email }, { success: true }));
            await refresh();
            let found = await EcPerson.search(repo, `email:"${email}"`);
            assert.lengthOf(found, 1, 'the adapter made a Person');
            assert.isUndefined(found[0].name);
            // Persons are cached by address within the adapter until something changes them; a new batch reads it again.
            await submit(statement({ objectType: 'Agent', mbox: 'mailto:' + email, name: 'Named By xAPI' }, { success: true }));
            await refresh();
            found = await EcPerson.search(repo, `email:"${email}"`);
            assert.lengthOf(found, 1);
            assert.strictEqual(found[0].name, 'Named By xAPI');
        });

        it('with several People for one address, asserts about the newest', async () => {
            const email = 'xapi.cov.twice.' + run + '@example.com';
            const older = identity('Older');
            await person(older, email, 'Twice');
            await new Promise((resolve) => setTimeout(resolve, 20));
            const newer = identity('Newer');
            await person(newer, email, 'Twice');
            const s = statement({ objectType: 'Agent', mbox: 'mailto:' + email }, { success: true });
            await submit(s);
            const a = await assertionFor(s, competency.shortId());
            assert.strictEqual((await a.getSubject()).toPem(), newer.ppk.toPk().toPem());
        });

        it('a learner known only by an account with no Person is skipped', async () => {
            const s = statement({ objectType: 'Agent', account: { homePage: 'https://lms.example.com', name: 'nobody-' + run } }, { success: true });
            await submit(s);
            assert.isNull(await assertionFor(s, competency.shortId()));
        });

        it('names an unknown activity from its "en" name, or else its first name', async () => {
            const learnerEmail = authorityEmail;
            const enActivity = 'https://activities.example.com/xapi-coverage/en/' + run;
            const frActivity = 'https://activities.example.com/xapi-coverage/fr/' + run;
            const s1 = statement({ objectType: 'Agent', mbox: 'mailto:' + learnerEmail }, { success: true });
            s1.object = { id: enActivity, objectType: 'Activity', definition: { name: { en: 'English name', fr: 'Nom' }, description: { en: 'English description' } } };
            const s2 = statement({ objectType: 'Agent', mbox: 'mailto:' + learnerEmail }, { success: true });
            s2.object = { id: frActivity, objectType: 'Activity', definition: { name: { fr: 'Nom seulement' } } };
            await submit(s1);
            await submit(s2);
            const cw1 = await (await fetch(loopback + 'data/' + EcCrypto.md5(enActivity), { headers: { Accept: 'application/json' } })).json();
            assert.strictEqual(cw1.name, 'English name');
            assert.strictEqual(cw1.description, 'English description');
            const cw2 = await (await fetch(loopback + 'data/' + EcCrypto.md5(frActivity), { headers: { Accept: 'application/json' } })).json();
            assert.strictEqual(cw2.name, 'Nom seulement');
        });
    });

    describe('setSubjects and getSubjects', function () {
        it('one subject is stored as one key', async () => {
            const a = new EcAssertion();
            a.generateId(repo.selectedServer);
            a.addOwner(authority.ppk.toPk());
            await global.setSubjects.call(a, [authority.ppk.toPk()]);
            assert.strictEqual((await a.getSubject()).toPem(), authority.ppk.toPk().toPem());
        });

        it('several subjects are stored together, readable by each', async () => {
            const one = identity('Subject one');
            const two = identity('Subject two');
            const a = new EcAssertion();
            a.generateId(repo.selectedServer);
            a.addOwner(authority.ppk.toPk());
            await global.setSubjects.call(a, [one.ppk.toPk(), two.ppk.toPk()]);
            assert.isTrue(a.subject.reader.includes(one.ppk.toPk().toPem()));
            assert.isTrue(a.subject.reader.includes(two.ppk.toPk().toPem()));
            const v = new EcEncryptedValue();
            v.copyFrom(a.subject);
            const stored = JSON.parse(await v.decryptIntoString());
            assert.sameMembers(stored, [one.ppk.toPk().toPem(), two.ppk.toPk().toPem()]);
        });

        it('no subject reads as null', async () => {
            assert.isNull(await global.getSubjects.call(new EcAssertion()));
        });
    });

    describe('polling an LRS', function () {
        const { sinceFileFor, LEGACY_SINCE_FILE } = require('../main/server/xapi/cursor.js');
        let lrs;
        let lrsUrl;
        let requests;
        let reply;
        const savedEnv = {};
        const ENV = ['XAPI_ENABLED', 'XAPI_ENDPOINT', 'XAPI_AUTH', 'XAPI_CONFIG_COVERAGE'];
        let legacySince;
        const sinceFiles = [];

        before(async () => {
            for (const k of ENV) savedEnv[k] = process.env[k];
            legacySince = fs.existsSync(LEGACY_SINCE_FILE) ? fs.readFileSync(LEGACY_SINCE_FILE, 'utf8') : null;
            lrs = http.createServer((req, res) => {
                requests.push({ url: req.url, auth: req.headers.authorization, method: req.method });
                let body = '';
                req.on('data', (c) => body += c);
                req.on('end', () => {
                    const out = reply(req, body);
                    res.writeHead(out.status || 200, { 'Content-Type': out.type || 'application/json' });
                    res.end(typeof out.body === 'string' ? out.body : JSON.stringify(out.body));
                });
            });
            await new Promise((resolve) => lrs.listen(0, '127.0.0.1', resolve));
            lrsUrl = 'http://127.0.0.1:' + lrs.address().port;
        });

        beforeEach(() => { requests = []; });

        afterEach(() => {
            for (const k of ENV) {
                if (savedEnv[k] === undefined) delete process.env[k];
                else process.env[k] = savedEnv[k];
            }
        });

        after(() => {
            lrs && lrs.close();
            for (const f of sinceFiles) if (fs.existsSync(f)) fs.unlinkSync(f);
            if (legacySince == null) { if (fs.existsSync(LEGACY_SINCE_FILE)) fs.unlinkSync(LEGACY_SINCE_FILE); }
            else fs.writeFileSync(LEGACY_SINCE_FILE, legacySince);
        });

        // A configured LRS's more links are joined to its hostname; the default LRS has no hostname, so they must be absolute.
        const pagedStatements = (prefix, s, moreBase) => (req) => {
            if (req.url.startsWith(prefix + 'statements')) return { body: { statements: [s], more: moreBase + prefix + 'more/1' } };
            if (req.url === prefix + 'more/1') return { body: { statements: [], more: '' } };
            return { status: 404, body: { error: 'unknown' } };
        };

        it('a configured LRS is read page by page, and its position is saved', async () => {
            const s = statement({ objectType: 'Agent', mbox: 'mailto:' + authorityEmail }, { success: true }, { stored: '2026-03-04T05:06:08.000Z' });
            reply = pagedStatements('/configured/', s, '');
            const config = { xapiEndpoint: lrsUrl + '/configured/', xapiHostname: lrsUrl, xapiAuth: 'Basic Y292OmNvdg==' };
            process.env.XAPI_CONFIG_COVERAGE = JSON.stringify(config);
            const sinceFile = sinceFileFor(config);
            sinceFiles.push(sinceFile);
            const res = await fetch(loopback + 'xapi/tick');
            assert.strictEqual(res.status, 200, await res.text());
            assert.isTrue(requests.some((r) => r.url.startsWith('/configured/statements?format=exact&ascending=true')));
            assert.isTrue(requests.every((r) => r.auth === 'Basic Y292OmNvdg=='));
            assert.isNotNull(await assertionFor(s, competency.shortId()));
            assert.strictEqual(fs.readFileSync(sinceFile, 'utf8'), '2026-03-04T05:06:08.000Z');
        });

        it('the default LRS follows more links from its hostname', async () => {
            const s = statement({ objectType: 'Agent', mbox: 'mailto:' + authorityEmail }, { success: true }, { stored: '2026-03-04T05:06:09.000Z' });
            reply = pagedStatements('/default/', s, lrsUrl);
            process.env.XAPI_ENABLED = 'true';
            process.env.XAPI_ENDPOINT = lrsUrl + '/default/';
            process.env.XAPI_AUTH = 'Basic ZGVmOmRlZg==';
            const res = await fetch(loopback + 'xapi/tick');
            assert.strictEqual(res.status, 200, await res.text());
            assert.isTrue(requests.some((r) => r.url === '/default/more/1'), JSON.stringify(requests));
            assert.isNotNull(await assertionFor(s, competency.shortId()));
        });

        it('an LRS that answers with something other than JSON is reported, not fatal', async () => {
            reply = () => ({ status: 400, type: 'text/plain', body: 'This does not seem to be a valid LRS.' });
            const config = { xapiEndpoint: lrsUrl + '/broken/', xapiHostname: lrsUrl, xapiAuth: 'Basic eDp4' };
            process.env.XAPI_CONFIG_COVERAGE = JSON.stringify(config);
            sinceFiles.push(sinceFileFor(config));
            const res = await fetch(loopback + 'xapi/tick');
            assert.strictEqual(res.status, 200, await res.text());
            assert.isAbove(requests.length, 0);
            assert.isTrue(requests.every((r) => r.url.startsWith('/broken/statements')));
            assert.isFalse(fs.existsSync(sinceFileFor(config)), 'no position is saved');
        });
    });
});
