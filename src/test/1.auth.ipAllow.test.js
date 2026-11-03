const { assert } = require('chai');
const path = require('path');

// The IP allow / SSO guard (shims/auth/60_ipAllow.js), loaded on its own with a stub app so each
// case can choose its environment. Requests are plain objects: the guard reads the TCP peer, the
// headers, the URL and the identities.
if (process.env.NODEV == null) {
    const guardPath = path.resolve(__dirname, '../main/server/shims/auth/60_ipAllow.js');
    const GUARD_ENV = ['CASS_IP_ALLOW', 'CASS_SSO_ACCOUNT_REQUIRED', 'CASS_TRUSTED_PROXIES', 'CASS_CLIENT_IP_HEADER',
        'CASS_IP_DENIED_REDIRECT', 'CASS_API_KEY', 'CASS_OIDC_ENABLED', 'CASS_SESSION_VALIDATION_INTERVAL'];
    const SPOOF_HEADERS = ['x-client-ip', 'x-forwarded-for', 'cf-connecting-ip', 'fastly-client-ip',
        'true-client-ip', 'x-real-ip', 'x-cluster-client-ip', 'x-forwarded'];

    describe('Auth guard (CASS_IP_ALLOW / CASS_SSO_ACCOUNT_REQUIRED)', function () {
        let saved;
        let guard;
        let logged;
        let report;

        const useEnv = (env) => {
            for (const k of GUARD_ENV) delete process.env[k];
            Object.assign(process.env, env);
            const { common } = require('../main/server/shims/auth.js');
            const realApp = global.app;
            global.app = { use: (fn) => { guard = fn; } };
            try {
                delete require.cache[guardPath];
                require(guardPath)(common);
            } finally {
                global.app = realApp;
            }
        };

        const request = async ({ peer, headers = {}, url = '/api/data/x', ids = 0 }) => {
            const req = {
                socket: { remoteAddress: peer },
                headers,
                originalUrl: (global.baseUrl || '') + url,
                eim: ids > 0 ? { ids: new Array(ids).fill({ displayName: 'user' }) } : null,
                protocol: 'http',
                get: () => 'localhost',
            };
            const res = {
                code: 200, set() { return this; }, json() { return this; }, end() { return this; },
                status(c) { this.code = c; return this; }, redirect(u) { this.code = 302; this.location = u; return this; },
            };
            let passed = false;
            await guard(req, res, () => { passed = true; });
            return { passed, code: res.code };
        };

        before(() => {
            saved = Object.fromEntries(GUARD_ENV.map((k) => [k, process.env[k]]));
            report = global.auditLogger.report;
            global.auditLogger.report = (...args) => { logged.push(JSON.stringify(args)); };
        });
        beforeEach(() => { logged = []; });
        after(() => {
            for (const k of GUARD_ENV) {
                if (saved[k] === undefined) delete process.env[k];
                else process.env[k] = saved[k];
            }
            global.auditLogger.report = report;
        });

        describe('SSO account required, no allowlist', () => {
            before(() => useEnv({ CASS_SSO_ACCOUNT_REQUIRED: '1' }));

            for (const header of SPOOF_HEADERS) {
                for (const claim of ['127.0.0.1', '::ffff:127.0.0.1']) {
                    it(`refuses an anonymous request claiming ${header}: ${claim}`, async () => {
                        const r = await request({ peer: '203.0.113.5', headers: { [header]: claim } });
                        assert.isFalse(r.passed);
                        assert.equal(r.code, 403);
                    });
                }
            }

            it('admits a loopback peer (CaSS calling itself)', async () => {
                for (const peer of ['127.0.0.1', '::ffff:127.0.0.1', '::1'])
                    assert.isTrue((await request({ peer })).passed, peer);
            });

            it('admits a signed-in user', async () => {
                assert.isTrue((await request({ peer: '203.0.113.5', ids: 1 })).passed);
            });

            it('keeps credentials out of the audit log', async () => {
                const headers = { authorization: 'Bearer secret-token-1', cookie: 'appSession=secret-cookie-2', 'x-api-key': 'secret-key-3' };
                await request({ peer: '203.0.113.5', headers });
                await request({ peer: '127.0.0.1', headers });
                const text = logged.join('\n');
                assert.include(text, 'CassIpAllowDenied');
                assert.include(text, 'CassIpAllowGranted');
                for (const secret of ['secret-token-1', 'secret-cookie-2', 'secret-key-3'])
                    assert.notInclude(text, secret);
            });
        });

        describe('allowlist behind a trusted proxy', () => {
            before(() => useEnv({ CASS_IP_ALLOW: '198.51.100.0/24', CASS_TRUSTED_PROXIES: '10.0.0.0/8' }));
            const proxy = '10.1.2.3';

            it('admits an allowed client forwarded by the proxy', async () => {
                assert.isTrue((await request({ peer: proxy, headers: { 'x-forwarded-for': '198.51.100.7' } })).passed);
                assert.isTrue((await request({ peer: proxy, headers: { 'x-forwarded-for': '198.51.100.7, 10.0.0.9' } })).passed, 'trusted hops are skipped');
            });

            it('refuses a client-written entry to the left of the real client', async () => {
                assert.isFalse((await request({ peer: proxy, headers: { 'x-forwarded-for': '198.51.100.7, 203.0.113.9' } })).passed);
            });

            it('never grants loopback from a forwarded address', async () => {
                assert.isFalse((await request({ peer: proxy, headers: { 'x-forwarded-for': '127.0.0.1' } })).passed);
            });

            it('ignores other client address headers', async () => {
                assert.isFalse((await request({ peer: proxy, headers: { 'x-client-ip': '198.51.100.7' } })).passed);
            });

            it('admits an allowed client connecting directly', async () => {
                assert.isTrue((await request({ peer: '198.51.100.7' })).passed);
            });

            it('refuses a forwarded address from a peer that is not a trusted proxy', async () => {
                assert.isFalse((await request({ peer: '203.0.113.5', headers: { 'x-forwarded-for': '198.51.100.7' } })).passed);
            });
        });

        describe('allowlist without trusted proxies', () => {
            before(() => useEnv({ CASS_IP_ALLOW: '198.51.100.0/24' }));

            it('ignores X-Forwarded-For', async () => {
                assert.isFalse((await request({ peer: '10.1.2.3', headers: { 'x-forwarded-for': '198.51.100.7' } })).passed);
            });
        });

        describe('CASS_CLIENT_IP_HEADER', () => {
            before(() => useEnv({ CASS_IP_ALLOW: '198.51.100.0/24', CASS_TRUSTED_PROXIES: '10.0.0.0/8', CASS_CLIENT_IP_HEADER: 'X-Real-IP' }));

            it('reads the configured header only', async () => {
                assert.isTrue((await request({ peer: '10.1.2.3', headers: { 'x-real-ip': '198.51.100.7' } })).passed);
                assert.isFalse((await request({ peer: '10.1.2.3', headers: { 'x-forwarded-for': '198.51.100.7' } })).passed);
            });
        });
    });
}
