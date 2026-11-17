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
                    logout: (opts) => { res.loggedOut = true; res.logout = opts; },
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

        it('registers the session, signed-out session and bearer middleware and the login, logout and discovery routes', () => {
            load(enabled);
            assert.lengthOf(used, 3);
            const base = global.baseUrl || '';
            assert.includeMembers(Object.keys(routes), [base + '/api/login', base + '/api/logout', '/logout',
                '/.well-known/oauth-protected-resource', '/.well-known/oauth-authorization-server']);
        });

        describe('required settings', () => {
            let reports;
            beforeEach(() => {
                reports = [];
                global.auditLogger.report = (...args) => { reports.push(args); };
            });
            afterEach(() => {
                global.auditLogger.report = () => { };
            });

            const refuses = (env, pattern) => {
                assert.throws(() => load(env), pattern);
                assert.lengthOf(used, 0, 'no middleware may be installed');
                assert.deepEqual(Object.keys(routes), [], 'no routes may be installed');
                const emergency = reports.filter((r) => r[1] === global.auditLogger.Severity.EMERGENCY);
                assert.lengthOf(emergency, 1, 'the refusal must be logged once at EMERGENCY');
                assert.strictEqual(emergency[0][2], 'CassAuthMisconfigured');
                assert.match(emergency[0][3], pattern);
            };

            for (const alg of [undefined, 'RS256']) {
                const signing = alg ? { CASS_OIDC_ALG: alg } : {};
                const label = alg || 'the default algorithm';

                it(`refuses to start without CASS_OIDC_ISSUER_BASE_URL (${label})`, () => {
                    const { CASS_OIDC_ISSUER_BASE_URL, ...rest } = enabled;
                    refuses({ ...rest, ...signing }, /CASS_OIDC_ISSUER_BASE_URL/);
                });

                it(`refuses to start without CASS_OIDC_SECRET (${label})`, () => {
                    const { CASS_OIDC_SECRET, ...rest } = enabled;
                    refuses({ ...rest, ...signing }, /CASS_OIDC_SECRET/);
                });

                it(`names both settings when both are missing (${label})`, () => {
                    refuses({ CASS_OIDC_ENABLED: 'true', ...signing }, /CASS_OIDC_ISSUER_BASE_URL and CASS_OIDC_SECRET/);
                });
            }

            it('treats blank settings as missing', () => {
                refuses({ ...enabled, CASS_OIDC_ISSUER_BASE_URL: '  ', CASS_OIDC_SECRET: '' }, /CASS_OIDC_ISSUER_BASE_URL and CASS_OIDC_SECRET/);
            });

            it('checks HS256 bearer tokens with CASS_OIDC_SECRET', async () => {
                const { SignJWT } = require('jose');
                // The bearer library reads the issuer's discovery document even for HS256 tokens, so serve one.
                const http = require('node:http');
                let issuer;
                const idp = http.createServer((req, res) => {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ issuer, jwks_uri: issuer + 'certs' }));
                });
                await new Promise((resolve) => idp.listen(0, '127.0.0.1', resolve));
                issuer = `http://127.0.0.1:${idp.address().port}/realms/test/`;
                try {
                    load({ ...enabled, CASS_OIDC_ISSUER_BASE_URL: issuer });
                    const bearer = used[2];
                    const sign = (secret, iss = issuer) => new SignJWT({ sub: 'someone' })
                        .setProtectedHeader({ alg: 'HS256' })
                        .setIssuer(iss)
                        .setAudience('account')
                        .setIssuedAt()
                        .setExpirationTime('5m')
                        .sign(new TextEncoder().encode(secret));
                    // With authRequired: false a token that fails verification is ignored, not an error:
                    // req.auth is only set for a token that verifies.
                    const run = (token) => new Promise((resolve) => {
                        const req = {
                            headers: { authorization: 'Bearer ' + token, host: 'cass.example.com' },
                            protocol: 'https', hostname: 'cass.example.com', originalUrl: '/api/ping', method: 'GET',
                            query: {}, is: () => false, get(h) { return this.headers[h.toLowerCase()]; },
                        };
                        bearer(req, {}, (err) => resolve({ err, auth: req.auth }));
                    });

                    const good = await run(await sign(enabled.CASS_OIDC_SECRET));
                    assert.isUndefined(good.err);
                    assert.strictEqual(good.auth?.payload?.sub, 'someone', 'a token signed with CASS_OIDC_SECRET must verify');

                    const forged = await run(await sign('some-other-secret-of-the-same-size'));
                    assert.isUndefined(forged.auth, 'a token signed with another secret must not verify');

                    const foreign = await run(await sign(enabled.CASS_OIDC_SECRET, 'https://idp.example.com/realms/other/'));
                    assert.isUndefined(foreign.auth, 'a token from another issuer must not verify');
                } finally {
                    await new Promise((resolve) => idp.close(resolve));
                }
            });

            it('starts with both set, under either algorithm', () => {
                load(enabled);
                assert.lengthOf(used, 3);
                load({ ...enabled, CASS_OIDC_ALG: 'RS256' });
                assert.lengthOf(used, 3);
                assert.isEmpty(reports.filter((r) => r[1] === global.auditLogger.Severity.EMERGENCY));
            });
        });

        it('also loads with a client secret (code flow), cookie options and a session age', () => {
            load({ ...enabled, CASS_OIDC_CLIENT_SECRET: 'client-secret', CASS_SESSION_MAX_AGE: '3600', CORS_CREDENTIALS: 'true' });
            assert.lengthOf(used, 3);
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

        describe('signing out', () => {
            const day = 24 * 60 * 60 * 1000;
            let realEphemeral;
            let store;
            let reads;
            let reports;
            const session = (idToken) => ({ appSession: { id_token: idToken, access_token: 'access' } });
            // Runs the signed-out session check on a request; true when the request keeps its session.
            const signedIn = async (req) => {
                await new Promise((resolve) => used[1](req, {}, resolve));
                return req.appSession !== undefined;
            };
            const memoryStore = () => ({
                get: async (id) => { reads.push(id); return store.get(id) ?? null; },
                put: async (id, obj, until) => { store.set(id, { ...obj, storedUntil: until }); },
            });

            beforeEach(() => {
                realEphemeral = global.ephemeral;
                store = new Map();
                reads = [];
                reports = [];
                global.ephemeral = memoryStore();
                global.auditLogger.report = (...args) => { reports.push(args); };
            });
            afterEach(() => {
                global.ephemeral = realEphemeral;
                global.auditLogger.report = () => { };
            });

            it('ends the session for every copy of its cookie, and only that session', async () => {
                load(enabled);
                assert.isTrue(await signedIn(session('token-a')));
                const res = await call('/api/logout', session('token-a'));
                assert.isTrue(res.loggedOut);
                assert.isFalse(await signedIn(session('token-a')), 'a copy of the signed-out cookie must no longer be signed in');
                assert.isTrue(await signedIn(session('token-b')), 'other sessions stay signed in');
                const anonymous = { headers: {} };
                await signedIn(anonymous);
                assert.deepEqual(anonymous, { headers: {} },'requests without a session pass through');
            });

            it('serves /logout the same way, returning where the library would', async () => {
                load(enabled);
                const res = await call('/logout', session('token-a'));
                assert.isTrue(res.loggedOut);
                assert.isUndefined(res.logout);
                assert.isFalse(await signedIn(session('token-a')));
            });

            it('signs out without a session, recording nothing', async () => {
                load(enabled);
                assert.isTrue((await call('/api/logout')).loggedOut);
                assert.strictEqual(store.size, 0);
            });

            it('shares the sign-out with other CaSS servers for as long as a session can last', async () => {
                load(enabled);
                const before = Date.now();
                await call('/api/logout', session('token-a'));
                assert.strictEqual(store.size, 1);
                const [[id, entry]] = [...store];
                assert.match(id, /^signedOut\.[0-9a-f]{64}$/);
                assert.notInclude(id, 'token-a', 'the ID token itself is not stored');
                assert.strictEqual(entry.until, entry.storedUntil);
                assert.approximately(entry.until - before, 7 * day, 5000);

                load(enabled); // another server: nothing in memory
                assert.isFalse(await signedIn(session('token-a')));
                assert.isTrue(await signedIn(session('token-b')));
            });

            it('looks a signed-in session up in the shared store at most every 10 seconds', async () => {
                load(enabled);
                assert.isTrue(await signedIn(session('token-a')));
                assert.isTrue(await signedIn(session('token-a')));
                assert.lengthOf(reads, 1);
            });

            it('ignores an expired sign-out', async () => {
                load(enabled);
                await call('/api/logout', session('token-a'));
                const [[id]] = [...store];
                store.set(id, { until: Date.now() - 1 });
                load(enabled);
                assert.isTrue(await signedIn(session('token-a')));
            });

            it('still signs out on this server when the shared store fails, and logs a warning', async () => {
                load(enabled);
                global.ephemeral = { get: async () => { throw new Error('store down'); }, put: async () => { throw new Error('store down'); } };
                const res = await call('/api/logout', session('token-a'));
                assert.isTrue(res.loggedOut);
                assert.isFalse(await signedIn(session('token-a')));
                assert.isTrue(await signedIn(session('token-b')), 'a failed lookup leaves the request signed in');
                const warnings = reports.filter((r) => r[1] === global.auditLogger.Severity.WARNING).map((r) => r[2]);
                assert.includeMembers(warnings, ['CassSignOutStoreFailed', 'CassSignOutCheckFailed']);
            });

            it('works before the shared store is ready', async () => {
                global.ephemeral = undefined;
                load(enabled);
                assert.isTrue((await call('/api/logout', session('token-a'))).loggedOut);
                assert.isFalse(await signedIn(session('token-a')));
                assert.isTrue(await signedIn(session('token-b')));
            });
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
