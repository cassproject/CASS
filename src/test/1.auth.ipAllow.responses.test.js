const { assert } = require('chai');
const path = require('path');
const jose = require('jose');

// The IP allow / SSO guard (shims/auth/60_ipAllow.js), loaded on its own with a stub app:
// session revalidation, bearer tokens from the configured issuer, and how refused requests
// are answered (401 for API and MCP clients, a redirect or 403 for browsers).
if (process.env.NODEV == null) {
    const guardPath = path.resolve(__dirname, '../main/server/shims/auth/60_ipAllow.js');
    const GUARD_ENV = ['CASS_IP_ALLOW', 'CASS_SSO_ACCOUNT_REQUIRED', 'CASS_TRUSTED_PROXIES', 'CASS_CLIENT_IP_HEADER',
        'CASS_IP_DENIED_REDIRECT', 'CASS_API_KEY', 'CASS_OIDC_ENABLED', 'CASS_SESSION_VALIDATION_INTERVAL',
        'CASS_OIDC_ISSUER_BASE_URL', 'CASS_OIDC_EXTERNAL_ISSUER_URL', 'CASS_OIDC_BASE_URL'];
    const issuer = 'https://idp.example.com/realms/test';

    describe('Auth guard responses and sessions', function () {
        let saved;
        let report;
        let realFetch;
        let guard;
        let jwks;
        let privateKey;
        let userinfo;

        const useEnv = (env) => {
            for (const k of GUARD_ENV) delete process.env[k];
            Object.assign(process.env, env);
            const { common } = require('../main/server/shims/auth.js');
            const realApp = global.app;
            global.app = { use: (fn) => { guard = fn; } };
            try {
                delete require.cache[guardPath];
                require(guardPath)({ ...common, getJWKS: () => jwks });
            } finally {
                global.app = realApp;
            }
        };

        const request = async ({ peer = '203.0.113.5', headers = {}, url = '/api/data/x', oidc, eim }) => {
            const req = { socket: { remoteAddress: peer }, headers, originalUrl: (global.baseUrl || '') + url, eim, oidc, protocol: 'http', get: () => 'cass.test' };
            const res = {
                code: 200, headers: {},
                set(k, v) { this.headers[k] = v; return this; },
                json(body) { this.body = body; return this; },
                end() { return this; },
                status(c) { this.code = c; return this; },
                redirect(u) { this.code = 302; this.location = u; return this; },
                oidc: { logout: (opts) => { res.loggedOut = opts; } },
            };
            let passed = false;
            await guard(req, res, () => { passed = true; });
            return { passed, res, req };
        };

        const sign = (claims, iss = issuer) => new jose.SignJWT(claims)
            .setProtectedHeader({ alg: 'RS256', kid: 'k1' })
            .setIssuer(iss)
            .setIssuedAt()
            .setExpirationTime('5m')
            .sign(privateKey);

        before(async () => {
            saved = Object.fromEntries(GUARD_ENV.map((k) => [k, process.env[k]]));
            report = global.auditLogger.report;
            global.auditLogger.report = () => { };
            realFetch = global.fetch;
            global.fetch = async (url, opts) => {
                userinfo.calls.push({ url: String(url), auth: opts?.headers?.Authorization });
                return { ok: userinfo.ok, status: userinfo.ok ? 200 : 401 };
            };
            const pair = await jose.generateKeyPair('RS256');
            privateKey = pair.privateKey;
            jwks = jose.createLocalJWKSet({ keys: [{ ...(await jose.exportJWK(pair.publicKey)), alg: 'RS256', kid: 'k1' }] });
        });
        beforeEach(() => { userinfo = { ok: true, calls: [] }; });
        after(() => {
            for (const k of GUARD_ENV) {
                if (saved[k] === undefined) delete process.env[k];
                else process.env[k] = saved[k];
            }
            global.auditLogger.report = report;
            global.fetch = realFetch;
        });

        describe('refused requests', () => {
            it('API clients asking for JSON get a 401 with a Bearer challenge', async () => {
                useEnv({ CASS_SSO_ACCOUNT_REQUIRED: '1' });
                const { passed, res } = await request({ headers: { accept: 'application/json' } });
                assert.isFalse(passed);
                assert.strictEqual(res.code, 401);
                assert.strictEqual(res.headers['WWW-Authenticate'], 'Bearer');
                assert.deepEqual(res.body, { error: 'Unauthorized' });
            });

            it('MCP requests get a 401 even without an Accept header', async () => {
                useEnv({ CASS_SSO_ACCOUNT_REQUIRED: '1' });
                const { res } = await request({ url: '/api/mcp' });
                assert.strictEqual(res.code, 401);
            });

            it('with OIDC, the challenge points at the protected resource metadata', async () => {
                useEnv({ CASS_SSO_ACCOUNT_REQUIRED: '1', CASS_OIDC_ENABLED: 'true', CASS_OIDC_BASE_URL: 'https://cass.example.com/' });
                const { res } = await request({ headers: { accept: 'text/event-stream' } });
                assert.strictEqual(res.headers['WWW-Authenticate'], 'Bearer resource_metadata="https://cass.example.com/.well-known/oauth-protected-resource"');
                useEnv({ CASS_SSO_ACCOUNT_REQUIRED: '1', CASS_OIDC_ENABLED: 'true' });
                const { res: fromHost } = await request({ headers: { accept: 'application/json' } });
                assert.strictEqual(fromHost.headers['WWW-Authenticate'], 'Bearer resource_metadata="http://cass.test/.well-known/oauth-protected-resource"');
            });

            it('without OIDC, the challenge names CASS_IP_DENIED_REDIRECT as the realm', async () => {
                useEnv({ CASS_SSO_ACCOUNT_REQUIRED: '1', CASS_IP_DENIED_REDIRECT: '/api/login' });
                const { res } = await request({ headers: { accept: 'application/json' } });
                assert.strictEqual(res.headers['WWW-Authenticate'], 'Bearer realm="/api/login"');
            });

            it('browsers are redirected to CASS_IP_DENIED_REDIRECT, or refused with 403', async () => {
                useEnv({ CASS_SSO_ACCOUNT_REQUIRED: '1', CASS_IP_DENIED_REDIRECT: '/api/login?redirectUrl=/cfm/' });
                const redirected = await request({ url: '/cfm/', headers: { accept: 'text/html' } });
                assert.strictEqual(redirected.res.code, 302);
                assert.strictEqual(redirected.res.location, '/api/login?redirectUrl=/cfm/');
                useEnv({ CASS_SSO_ACCOUNT_REQUIRED: '1' });
                assert.strictEqual((await request({ url: '/cfm/' })).res.code, 403);
            });

            it('JSON requests outside /api/ are treated as browser requests', async () => {
                useEnv({ CASS_SSO_ACCOUNT_REQUIRED: '1' });
                assert.strictEqual((await request({ url: '/cfm/data.json', headers: { accept: 'application/json' } })).res.code, 403);
            });
        });

        describe('open endpoints', () => {
            it('login, logout, the callback, ping and OAuth discovery are always allowed', async () => {
                useEnv({ CASS_SSO_ACCOUNT_REQUIRED: '1' });
                for (const url of ['/callback', '/login', '/logout', '/api/ping'])
                    assert.isTrue((await request({ url })).passed, url);
                for (const url of ['/.well-known/oauth-authorization-server', '/.well-known/oauth-protected-resource']) {
                    const req = { socket: { remoteAddress: '203.0.113.5' }, headers: {}, originalUrl: url, protocol: 'http', get: () => 'cass.test' };
                    let passed = false;
                    await guard(req, { set() { return this; }, status() { return this; }, json() { return this; }, end() { } }, () => { passed = true; });
                    assert.isTrue(passed, url);
                }
            });

            it('CASS_API_KEY in the Authorization header is allowed', async () => {
                useEnv({ CASS_SSO_ACCOUNT_REQUIRED: '1', CASS_API_KEY: 'the-api-key' });
                assert.isTrue((await request({ headers: { authorization: 'the-api-key' } })).passed);
                assert.isFalse((await request({ headers: { authorization: 'another-key' } })).passed);
            });

            it('a trusted proxy that sends no client address header is judged as itself', async () => {
                useEnv({ CASS_IP_ALLOW: '198.51.100.0/24', CASS_TRUSTED_PROXIES: '10.0.0.0/8' });
                assert.isFalse((await request({ peer: '10.1.2.3' })).passed);
            });
        });

        describe('bearer tokens', () => {
            it('admits a token signed by the configured issuer', async () => {
                useEnv({ CASS_SSO_ACCOUNT_REQUIRED: '1', CASS_OIDC_ISSUER_BASE_URL: issuer + '/' });
                const { passed, req } = await request({ headers: { authorization: 'Bearer ' + await sign({ sub: 'mcp-client', azp: 'claude' }) } });
                assert.isTrue(passed);
                assert.include(req.permittedBy.join(' '), 'Bearer token (sub: mcp-client)');
            });

            it('admits a token from CASS_OIDC_EXTERNAL_ISSUER_URL too', async () => {
                useEnv({ CASS_SSO_ACCOUNT_REQUIRED: '1', CASS_OIDC_ISSUER_BASE_URL: 'http://keycloak:8080/realms/test', CASS_OIDC_EXTERNAL_ISSUER_URL: issuer + '/' });
                assert.isTrue((await request({ headers: { authorization: 'Bearer ' + await sign({ sub: 'mcp-client' }) } })).passed);
            });

            it('refuses a token from another issuer, or one that does not verify', async () => {
                useEnv({ CASS_SSO_ACCOUNT_REQUIRED: '1', CASS_OIDC_ISSUER_BASE_URL: issuer });
                assert.isFalse((await request({ headers: { authorization: 'Bearer ' + await sign({ sub: 'x' }, 'https://other.example.com') } })).passed);
                assert.isFalse((await request({ headers: { authorization: 'Bearer abc.def.ghi' } })).passed);
                assert.isFalse((await request({ headers: { authorization: 'Basic abc' } })).passed);
            });
        });

        describe('CASS_SESSION_VALIDATION_INTERVAL', () => {
            const session = (lastValidated, accessToken = 'access-token') => ({ session: { lastValidated, accessToken }, user: { email: 'sam@example.com' } });

            it('stamps a session the first time it is seen', async () => {
                useEnv({ CASS_SSO_ACCOUNT_REQUIRED: '1', CASS_SESSION_VALIDATION_INTERVAL: '60', CASS_OIDC_ISSUER_BASE_URL: issuer });
                const oidc = session(undefined);
                await request({ oidc, eim: { ids: [{}] } });
                assert.isNumber(oidc.session.lastValidated);
                assert.lengthOf(userinfo.calls, 0);
            });

            it('does not recheck a session validated within the interval', async () => {
                useEnv({ CASS_SSO_ACCOUNT_REQUIRED: '1', CASS_SESSION_VALIDATION_INTERVAL: '60', CASS_OIDC_ISSUER_BASE_URL: issuer });
                const recent = Date.now() - 1000;
                const oidc = session(recent);
                assert.isTrue((await request({ oidc, eim: { ids: [{}] } })).passed);
                assert.lengthOf(userinfo.calls, 0);
                assert.isAbove(oidc.session.lastValidated, recent);
            });

            it('rechecks an older session against the userinfo endpoint and keeps it if valid', async () => {
                useEnv({ CASS_SSO_ACCOUNT_REQUIRED: '1', CASS_SESSION_VALIDATION_INTERVAL: '60', CASS_OIDC_ISSUER_BASE_URL: issuer + '/' });
                const oidc = session(Date.now() - 120000);
                const { passed } = await request({ oidc, eim: { ids: [{}] } });
                assert.isTrue(passed);
                assert.deepEqual(userinfo.calls, [{ url: issuer + '/protocol/openid-connect/userinfo', auth: 'Bearer access-token' }]);
            });

            it('logs the user out when the provider rejects the session', async () => {
                useEnv({ CASS_SSO_ACCOUNT_REQUIRED: '1', CASS_SESSION_VALIDATION_INTERVAL: '60', CASS_OIDC_ISSUER_BASE_URL: issuer });
                userinfo.ok = false;
                const { passed, res } = await request({ oidc: session(Date.now() - 120000), eim: { ids: [{}] } });
                assert.isFalse(passed);
                assert.deepEqual(res.loggedOut, { returnTo: '/api/login' });
            });

            it('logs the user out when there is no access token or issuer to check with', async () => {
                useEnv({ CASS_SSO_ACCOUNT_REQUIRED: '1', CASS_SESSION_VALIDATION_INTERVAL: '60' });
                const { res } = await request({ oidc: session(Date.now() - 120000, null), eim: { ids: [{}] } });
                assert.deepEqual(res.loggedOut, { returnTo: '/api/login' });
                assert.lengthOf(userinfo.calls, 0);
            });
        });
    });
}
