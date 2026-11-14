const { assert } = require('chai');
const path = require('path');

// shims/auth/50_signatureSheet.js loaded on its own with a stub app: how it turns the signed-in
// identity (a JWT user, a Platform One token, an OIDC session or a client certificate) into the
// signature sheet and identities the rest of the server uses. Runs against the test server.
if (process.env.NODEV == null) {
    const modulePath = path.resolve(__dirname, '../main/server/shims/auth/50_signatureSheet.js');

    describe('Signature sheet middleware (50_signatureSheet.js)', function () {
        this.timeout(60000);
        let report;
        let saved;
        let common;

        const load = (overrides = {}) => {
            const used = [];
            const realApp = global.app;
            global.app = { use: (fn) => used.push(fn) };
            try {
                delete require.cache[modulePath];
                require(modulePath)({ ...common, allowEnvEmails: false, envEmailArray: [], ...overrides });
            } finally {
                global.app = realApp;
            }
            return used[0];
        };

        const run = async (middleware, req) => {
            req.headers = req.headers || {};
            const res = { ended: null, end(text) { this.ended = text; } };
            let passed = false;
            await middleware(req, res, () => { passed = true; });
            return { req, res, passed };
        };

        const unique = (label) => `${label}.${Date.now()}.${Math.floor(Math.random() * 1e6)}@example.com`;

        before(async function () {
            let ready = false;
            global.events.server.ready.subscribe((isReady) => { if (isReady) ready = true; });
            while (!ready) await new Promise((resolve) => setTimeout(resolve, 100));
            common = require('../main/server/shims/auth.js').common;
            report = global.auditLogger.report;
            global.auditLogger.report = () => { };
            saved = {
                AUTH_OVERRIDE: process.env.AUTH_OVERRIDE, AUTH_OVERRIDE_KEY: process.env.AUTH_OVERRIDE_KEY,
                SKYREPO_ADMIN_GROUP: process.env.SKYREPO_ADMIN_GROUP,
                globalOverride: global.AUTH_OVERRIDE, globalOverrideKey: global.AUTH_OVERRIDE_KEY,
            };
            delete process.env.AUTH_OVERRIDE;
            delete process.env.AUTH_OVERRIDE_KEY;
            global.AUTH_OVERRIDE = null;
            global.AUTH_OVERRIDE_KEY = null;
        });
        after(() => {
            global.auditLogger.report = report;
            for (const k of ['AUTH_OVERRIDE', 'AUTH_OVERRIDE_KEY', 'SKYREPO_ADMIN_GROUP']) {
                if (saved[k] === undefined) delete process.env[k];
                else process.env[k] = saved[k];
            }
            global.AUTH_OVERRIDE = saved.globalOverride;
            global.AUTH_OVERRIDE_KEY = saved.globalOverrideKey;
        });

        it('passes an anonymous request on without a signature sheet', async () => {
            const { req, passed } = await run(load(), {});
            assert.isTrue(passed);
            assert.isUndefined(req.headers.signatureSheet);
            assert.isUndefined(req.eim);
        });

        it('signs for an OIDC user, and creates their person once', async () => {
            const middleware = load();
            const email = unique('oidc');
            const first = await run(middleware, { oidc: { user: { name: 'Olive', sub: 'sub-olive', email, preferred_username: 'olive' } } });
            assert.isTrue(first.passed);
            assert.lengthOf(first.req.eim.ids, 1);
            assert.strictEqual(first.req.eim.ids[0].displayName, 'Olive');
            const sheet = JSON.parse(first.req.headers.signatureSheet);
            assert.isArray(sheet);
            assert.strictEqual(sheet[0]['@owner'], first.req.eim.ids[0].ppk.toPk().toPem());

            const person = await EcPerson.getByPk(repo, first.req.eim.ids[0].ppk.toPk(), null, null, first.req.eim);
            assert.strictEqual(person.name, 'Olive');
            assert.strictEqual(person.email, email);
            assert.strictEqual(person.identifier, 'sub-olive');
            assert.strictEqual(person.username, 'olive');
            assert.isString(person.ssoSignature);

            const second = await run(middleware, { oidc: { user: { name: 'Olive', sub: 'sub-olive', email } } });
            assert.strictEqual(second.req.headers.signatureSheet, first.req.headers.signatureSheet, 'the sheet is reused while it is fresh');
        });

        it('adds an identity for each OIDC group, and the admin key for SKYREPO_ADMIN_GROUP', async () => {
            process.env.SKYREPO_ADMIN_GROUP = 'CaSS_Admins';
            try {
                const group = 'fpTeam_Cont_' + Date.now();
                const { req } = await run(load(), { oidc: { user: { name: 'Gus', sub: 'sub-gus', email: unique('groups'), groups: [group, 'cass_admins'] } } });
                assert.lengthOf(req.eim.ids, 3);
                assert.strictEqual(req.eim.ids[1].displayName, group.replaceAll('_', ' ').trim());
                assert.strictEqual(req.eim.ids[2].ppk.toPem(), common.skyrepoAdminKey().toPem(), 'the admin group signs with the server admin key');
                const org = await EcPerson.getByPk(repo, req.eim.ids[1].ppk.toPk(), null, null, req.eim);
                assert.strictEqual(org.name, group.replaceAll('_', ' ').replace('fp', '').replace('Cont', 'Contributor').trim());
            } finally {
                delete process.env.SKYREPO_ADMIN_GROUP;
            }
        });

        it('does not sign for an OIDC user without an e-mail address', async () => {
            const { req, passed } = await run(load(), { oidc: { user: { name: 'Nemo', sub: 'sub-nemo' } } });
            assert.isTrue(passed);
            assert.isUndefined(req.eim);
        });

        it('signs for a Platform One token', async () => {
            const { req } = await run(load(), { p1: { name: 'Pia', email: unique('p1'), sub: '0f3c2b8e-1a2b-4c3d-8e9f-0123456789ab' } });
            assert.strictEqual(req.eim.ids[0].displayName, 'Pia');
        });

        it('signs for a client certificate', async () => {
            const { req } = await run(load(), {
                client: { authorized: true },
                socket: { getPeerCertificate: () => ({ subject: { emailAddress: unique('cert'), CN: 'Cert Holder' } }) },
            });
            assert.strictEqual(req.eim.ids[0].displayName, 'Cert Holder');
        });

        it('signs for a JWT user without an issue time', async () => {
            const { req } = await run(load(), { user: { name: 'Jay', email: unique('jwt'), identifier: 'x', sub: 'sub-jay' } });
            assert.strictEqual(req.eim.ids[0].displayName, 'Jay');
        });

        it('answers "JWT token is expired." unless the issue time is more than 20 seconds ahead', async () => {
            // Current behaviour: the issue time is compared as if it were an expiry time.
            const middleware = load();
            const now = Math.floor(Date.now() / 1000);
            const stale = await run(middleware, { user: { name: 'Jay', email: unique('jwt'), iat: now } });
            assert.isFalse(stale.passed);
            assert.strictEqual(stale.res.ended, 'JWT token is expired.');
            const ahead = await run(middleware, { user: { name: 'Jay', email: unique('jwt'), iat: now + 3600 } });
            assert.isTrue(ahead.passed);
        });

        it('uses AUTH_OVERRIDE as the signed-in user', async () => {
            const ppk = EcPpk.generateKey();
            global.AUTH_OVERRIDE = JSON.stringify({ name: 'Override', email: unique('override'), sub: 'sub-override' });
            global.AUTH_OVERRIDE_KEY = ppk.toPem();
            try {
                const { req } = await run(load(), {});
                assert.strictEqual(req.eim.ids[0].ppk.toPem(), ppk.toPem());
                assert.strictEqual(req.user.name, 'Override');
            } finally {
                global.AUTH_OVERRIDE = null;
                global.AUTH_OVERRIDE_KEY = null;
            }
        });

        it('adds an admin signature for an address in AUTH_ENV_ADMIN_EMAILS', async () => {
            const email = unique('admin');
            const { req } = await run(load({ allowEnvEmails: true, envEmailArray: [email] }), { oidc: { user: { name: 'Ada', sub: 'sub-ada', email } } });
            const sheet = JSON.parse(req.headers.signatureSheet);
            assert.lengthOf(sheet, 2);
            assert.strictEqual(sheet[1]['@owner'], common.skyrepoAdminKey().toPk().toPem());
        });
    });
}
