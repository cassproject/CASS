const { assert } = require('chai');
const path = require('path');

// shims/auth/10_oidc.js loaded on its own with a stub app: the login and logout routes and the
// OAuth discovery documents it serves for MCP clients. The upstream issuer is a stubbed fetch.
if (process.env.NODEV == null) {
    const modulePath = path.resolve(__dirname, '../main/server/shims/auth/10_oidc.js');
    const OIDC_ENV = ['CASS_OIDC_ENABLED', 'CASS_OIDC_ISSUER_BASE_URL', 'CASS_OIDC_BASE_URL', 'CASS_OIDC_CLIENT_ID',
        'CASS_OIDC_CLIENT_SECRET', 'CASS_OIDC_SECRET', 'CASS_OIDC_SCOPE', 'CASS_OIDC_RESPONSE_TYPE',
        'CASS_OIDC_AUDIENCE', 'CASS_OIDC_ALG', 'CASS_OIDC_EXTERNAL_ISSUER_URL', 'CASS_SESSION_MAX_AGE', 'CORS_CREDENTIALS'];

    describe('OIDC module (10_oidc.js)', function () {
        let saved;
        let report;
        let realFetch;
        let routes;
        let used;
        let fetched;
        let upstream;

        const load = (env) => {
            for (const k of OIDC_ENV) delete process.env[k];
            Object.assign(process.env, env);
            routes = {};
            used = [];
            const realApp = global.app;
            global.app = { use: (fn) => used.push(fn), get: (p, fn) => { routes[p] = fn; } };
            try {
                delete require.cache[modulePath];
                require(modulePath)({});
            } finally {
                global.app = realApp;
            }
        };

        const call = async (route, req = {}) => {
            const res = {
                code: 200,
                status(c) { this.code = c; return this; },
                json(body) { this.body = body; return this; },
                oidc: {
                    login: (opts) => { res.login = opts; },
                    logout: (opts) => { res.logout = opts; },
                },
            };
            const handler = routes[(global.baseUrl || '') + route] || routes[route];
            await handler({ query: {}, protocol: 'http', get: () => 'cass.test', ...req }, res);
            return res;
        };

        const discovery = {
            issuer: 'http://keycloak:8080/realms/test',
            authorization_endpoint: 'http://keycloak:8080/realms/test/protocol/openid-connect/auth',
            token_endpoint: 'http://keycloak:8080/realms/test/protocol/openid-connect/token',
            registration_endpoint: 'http://keycloak:8080/realms/test/clients-registrations/openid-connect',
            jwks_uri: 'http://keycloak:8080/realms/test/protocol/openid-connect/certs',
            scopes_supported: ['openid', 'profile', 'email', 'offline_access', 'web-origins', 'roles', 'microprofile-jwt'],
            token_endpoint_auth_methods_supported: ['client_secret_basic'],
            code_challenge_methods_supported: ['plain', 'S256'],
        };

        before(() => {
            saved = Object.fromEntries(OIDC_ENV.map((k) => [k, process.env[k]]));
            report = global.auditLogger.report;
            global.auditLogger.report = () => { };
            realFetch = global.fetch;
            global.fetch = async (url) => {
                fetched.push(String(url));
                if (upstream instanceof Error) throw upstream;
                return { ok: upstream.ok, status: upstream.status, json: async () => upstream.body };
            };
        });
        beforeEach(() => {
            fetched = [];
            upstream = { ok: true, status: 200, body: discovery };
        });
        after(() => {
            for (const k of OIDC_ENV) {
                if (saved[k] === undefined) delete process.env[k];
                else process.env[k] = saved[k];
            }
            global.auditLogger.report = report;
            global.fetch = realFetch;
        });

        const enabled = {
            CASS_OIDC_ENABLED: 'true',
            CASS_OIDC_ISSUER_BASE_URL: 'http://keycloak:8080/realms/test/',
            CASS_OIDC_BASE_URL: 'https://cass.example.com/',
            CASS_OIDC_SECRET: 'a-session-secret-of-reasonable-length',
        };

        it('registers nothing unless CASS_OIDC_ENABLED is set', () => {
            load({});
            assert.lengthOf(used, 0);
            assert.deepEqual(Object.keys(routes), []);
        });

        it('registers the session and bearer middleware and the login, logout and discovery routes', () => {
            load(enabled);
            assert.lengthOf(used, 2);
            const base = global.baseUrl || '';
            assert.includeMembers(Object.keys(routes), [base + '/api/login', base + '/api/logout',
                '/.well-known/oauth-protected-resource', '/.well-known/oauth-authorization-server']);
        });

        it('also loads with a client secret (code flow), cookie options and a session age', () => {
            load({ ...enabled, CASS_OIDC_CLIENT_SECRET: 'client-secret', CASS_SESSION_MAX_AGE: '3600', CORS_CREDENTIALS: 'true' });
            assert.lengthOf(used, 2);
        });

        it('/api/login returns to redirectUrl, or to / by default', async () => {
            load({ ...enabled, CASS_OIDC_SCOPE: 'openid email' });
            assert.deepEqual((await call('/api/login', { query: { redirectUrl: '/cfm/' } })).login, { returnTo: '/cfm/', authorizationParams: { scope: 'openid email' } });
            assert.strictEqual((await call('/api/login')).login.returnTo, '/');
        });

        it('/api/logout returns to redirectUrl, or to / by default', async () => {
            load(enabled);
            assert.deepEqual((await call('/api/logout', { query: { redirectUrl: '/bye' } })).logout, { returnTo: '/bye' });
            assert.deepEqual((await call('/api/logout')).logout, { returnTo: '/' });
        });

        describe('/.well-known/oauth-protected-resource', () => {
            it('names CaSS as both resource and authorization server', async () => {
                load({ ...enabled, CASS_OIDC_SCOPE: 'openid profile' });
                const res = await call('/.well-known/oauth-protected-resource');
                assert.deepEqual(res.body, {
                    resource: 'https://cass.example.com',
                    authorization_servers: ['https://cass.example.com'],
                    scopes_supported: ['openid', 'profile'],
                    bearer_methods_supported: ['header'],
                });
            });

            it('falls back to the request\'s origin without CASS_OIDC_BASE_URL', async () => {
                load(enabled);
                // The route reads CASS_OIDC_BASE_URL per request.
                delete process.env.CASS_OIDC_BASE_URL;
                const res = await call('/.well-known/oauth-protected-resource', { protocol: 'https', get: () => 'cass.local' });
                assert.strictEqual(res.body.resource, 'https://cass.local');
            });

            it('is a 404 when no issuer is configured', async () => {
                load(enabled);
                delete process.env.CASS_OIDC_ISSUER_BASE_URL;
                const res = await call('/.well-known/oauth-protected-resource');
                assert.strictEqual(res.code, 404);
            });
        });

        describe('/.well-known/oauth-authorization-server', () => {
            it('serves the upstream discovery document with CaSS as issuer and only standard scopes', async () => {
                load(enabled);
                const res = await call('/.well-known/oauth-authorization-server');
                assert.deepEqual(fetched, ['http://keycloak:8080/realms/test/.well-known/openid-configuration']);
                assert.deepEqual(res.body, {
                    issuer: 'https://cass.example.com',
                    authorization_endpoint: discovery.authorization_endpoint,
                    token_endpoint: discovery.token_endpoint,
                    registration_endpoint: discovery.registration_endpoint,
                    jwks_uri: discovery.jwks_uri,
                    scopes_supported: ['openid', 'profile', 'email', 'offline_access'],
                    response_types_supported: ['code'],
                    grant_types_supported: ['authorization_code', 'refresh_token'],
                    token_endpoint_auth_methods_supported: ['client_secret_basic'],
                    code_challenge_methods_supported: ['plain', 'S256'],
                });
            });

            it('caches the document', async () => {
                load(enabled);
                const first = await call('/.well-known/oauth-authorization-server');
                const second = await call('/.well-known/oauth-authorization-server');
                assert.lengthOf(fetched, 1);
                assert.deepEqual(second.body, first.body);
            });

            it('rewrites internal issuer URLs to CASS_OIDC_EXTERNAL_ISSUER_URL, and defaults missing fields', async () => {
                load({ ...enabled, CASS_OIDC_EXTERNAL_ISSUER_URL: 'https://login.example.com/realms/test/' });
                upstream.body = { ...discovery, registration_endpoint: undefined, scopes_supported: undefined, code_challenge_methods_supported: undefined };
                const res = await call('/.well-known/oauth-authorization-server');
                assert.strictEqual(res.body.authorization_endpoint, 'https://login.example.com/realms/test/protocol/openid-connect/auth');
                assert.strictEqual(res.body.jwks_uri, 'https://login.example.com/realms/test/protocol/openid-connect/certs');
                assert.isUndefined(res.body.registration_endpoint);
                assert.deepEqual(res.body.scopes_supported, []);
                assert.deepEqual(res.body.code_challenge_methods_supported, ['S256']);
            });

            it('is a 404 without an issuer, a 502 when the issuer fails, and a 500 when it cannot be reached', async () => {
                load(enabled);
                delete process.env.CASS_OIDC_ISSUER_BASE_URL;
                assert.strictEqual((await call('/.well-known/oauth-authorization-server')).code, 404);

                load(enabled);
                upstream = { ok: false, status: 503, body: {} };
                assert.strictEqual((await call('/.well-known/oauth-authorization-server')).code, 502);

                load(enabled);
                upstream = new Error('connection refused');
                const res = await call('/.well-known/oauth-authorization-server');
                assert.strictEqual(res.code, 500);
                assert.deepEqual(res.body, { error: 'Internal error fetching OAuth metadata' });
            });
        });
    });
}
