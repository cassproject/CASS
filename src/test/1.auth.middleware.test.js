const { assert } = require('chai');
const path = require('path');
const jose = require('jose');

// The smaller auth modules (shims/auth/*.js), each loaded on its own with a stub app so a
// case can choose its environment. Each test restores the environment it changed.
if (process.env.NODEV == null) {
    const authDir = path.resolve(__dirname, '../main/server/shims/auth');

    // Loads one auth module under `env` and returns the middleware it registered.
    const load = (file, env, commonOverrides = {}) => {
        const saved = {};
        for (const k of Object.keys(env)) {
            saved[k] = process.env[k];
            if (env[k] === undefined) delete process.env[k];
            else process.env[k] = env[k];
        }
        const used = [];
        const realApp = global.app;
        global.app = { use: (fn) => used.push(fn), get() { } };
        try {
            const modulePath = path.join(authDir, file);
            delete require.cache[modulePath];
            const { common } = require('../main/server/shims/auth.js');
            require(modulePath)({ ...common, ...commonOverrides });
        } finally {
            global.app = realApp;
            for (const k of Object.keys(saved)) {
                if (saved[k] === undefined) delete process.env[k];
                else process.env[k] = saved[k];
            }
        }
        return used;
    };

    // Runs `fn` with `env` set, restoring it afterwards.
    const withEnv = async (env, fn) => {
        const saved = {};
        for (const k of Object.keys(env)) {
            saved[k] = process.env[k];
            if (env[k] === undefined) delete process.env[k];
            else process.env[k] = env[k];
        }
        try {
            return await fn();
        } finally {
            for (const k of Object.keys(saved)) {
                if (saved[k] === undefined) delete process.env[k];
                else process.env[k] = saved[k];
            }
        }
    };

    const run = async (middleware, req) => {
        let passed = false;
        await middleware(req, {}, () => { passed = true; });
        return passed;
    };

    describe('Auth modules loaded on their own', function () {
        let report;
        before(() => {
            report = global.auditLogger.report;
            global.auditLogger.report = () => { };
        });
        after(() => {
            global.auditLogger.report = report;
        });

        describe('00_rate.js', () => {
            it('registers nothing unless CASS_RATE_LIMIT is set', () => {
                assert.lengthOf(load('00_rate.js', { CASS_RATE_LIMIT: undefined }), 0);
            });

            it('registers a rate limiter when CASS_RATE_LIMIT is set', () => {
                const used = load('00_rate.js', { CASS_RATE_LIMIT: 'true', CASS_RATE_LIMIT_WINDOW_MS: '1000', CASS_RATE_LIMIT_MAX: '5' });
                assert.lengthOf(used, 1);
                assert.isFunction(used[0]);
            });
        });

        describe('20_jwt.js', () => {
            it('registers nothing unless CASS_JWT_ENABLED is true', () => {
                assert.lengthOf(load('20_jwt.js', { CASS_JWT_ENABLED: undefined }), 0);
            });

            it('registers the JWT parser, and a session store when CASS_JWT_SESSION_ENABLED is true', () => {
                assert.lengthOf(load('20_jwt.js', { CASS_JWT_ENABLED: 'true', CASS_JWT_SESSION_ENABLED: undefined }), 1);
                assert.lengthOf(load('20_jwt.js', { CASS_JWT_ENABLED: 'true', CASS_JWT_SESSION_ENABLED: 'true' }), 2);
            });

            it('puts the claims of a token signed with CASS_JWT_SECRET on req.auth', async () => {
                const [parse] = load('20_jwt.js', { CASS_JWT_ENABLED: 'true', CASS_JWT_SESSION_ENABLED: undefined, CASS_JWT_SECRET: 'test-secret' });
                const token = await new jose.SignJWT({ email: 'jwt.user@example.com' })
                    .setProtectedHeader({ alg: 'HS256' })
                    .sign(new TextEncoder().encode('test-secret'));
                const req = { headers: { authorization: 'Bearer ' + token }, get: () => undefined };
                await new Promise((resolve, reject) => parse(req, {}, (err) => (err ? reject(err) : resolve())));
                assert.strictEqual(req.auth.email, 'jwt.user@example.com');
            });
        });

        describe('30_platformOne.js', () => {
            const P1 = {
                CASS_PLATFORM_ONE_AUTH_ENABLED: 'true',
                CASS_PLATFORM_ONE_AUTH_CHECK_ISSUER: undefined,
                CASS_PLATFORM_ONE_ISSUER: undefined,
                CASS_PLATFORM_ONE_AUTH_CHECK_CLIENT: undefined,
                CASS_PLATFORM_ONE_CLIENT: undefined,
                CASS_PLATFORM_ONE_AUTH_IGNORE_ISSUE_TIME: undefined,
                CASS_PLATFORM_ONE_AUTH_ANONYMIZE_USERS: undefined,
                CASS_PLATFORM_ONE_AUTH_ADJECTIVES: undefined,
                CASS_PLATFORM_ONE_AUTH_NOUNS: undefined,
            };
            const sub = '0f3c2b8e-1a2b-4c3d-8e9f-0123456789ab';
            // The body is all the module reads; the signature is not checked here.
            const jwt = (claims) => 'Bearer x.' + Buffer.from(JSON.stringify(claims)).toString('base64') + '.y';
            const request = (authorization) => ({ get: (h) => (h === 'Authorization' ? authorization : undefined) });
            const p1 = async (env, authorization) => {
                const [middleware] = load('30_platformOne.js', { ...P1, ...env });
                return withEnv({ ...P1, ...env }, async () => {
                    const req = request(authorization);
                    assert.isTrue(await run(middleware, req), 'always passes the request on');
                    return req.p1;
                });
            };

            it('registers nothing unless CASS_PLATFORM_ONE_AUTH_ENABLED is set', () => {
                assert.lengthOf(load('30_platformOne.js', { CASS_PLATFORM_ONE_AUTH_ENABLED: undefined }), 0);
            });

            it('ignores requests without a bearer token', async () => {
                assert.isUndefined(await p1({}, undefined));
                assert.isUndefined(await p1({}, 'Basic abc'));
            });

            it('accepts a token with a 36-character subject when issue time is ignored', async () => {
                const token = await p1({ CASS_PLATFORM_ONE_AUTH_IGNORE_ISSUE_TIME: 'true' }, jwt({ sub, name: 'Pat', email: 'pat@example.com' }));
                assert.deepEqual(token, { sub, name: 'Pat', email: 'pat@example.com' });
            });

            it('refuses a subject that is not 36 characters long', async () => {
                assert.isUndefined(await p1({ CASS_PLATFORM_ONE_AUTH_IGNORE_ISSUE_TIME: 'true' }, jwt({ sub: 'short' })));
                assert.isUndefined(await p1({ CASS_PLATFORM_ONE_AUTH_IGNORE_ISSUE_TIME: 'true' }, jwt({ sub: 42 })));
            });

            it('requires an issue time unless told to ignore it', async () => {
                assert.isUndefined(await p1({}, jwt({ sub })));
            });

            it('accepts a token only if its issue time is more than 20 seconds ahead', async () => {
                // Current behaviour: the issue time is compared as if it were an expiry time.
                const now = Math.floor(Date.now() / 1000);
                assert.isUndefined(await p1({}, jwt({ sub, iat: now })));
                assert.isDefined(await p1({}, jwt({ sub, iat: now + 3600 })));
            });

            it('checks the issuer when CASS_PLATFORM_ONE_AUTH_CHECK_ISSUER is true', async () => {
                const env = { CASS_PLATFORM_ONE_AUTH_IGNORE_ISSUE_TIME: 'true', CASS_PLATFORM_ONE_AUTH_CHECK_ISSUER: 'true', CASS_PLATFORM_ONE_ISSUER: 'https://login.example.com' };
                assert.isUndefined(await p1(env, jwt({ sub, iss: 'https://elsewhere.example.com' })));
                assert.isDefined(await p1(env, jwt({ sub, iss: 'https://login.example.com' })));
            });

            it('checks the client when CASS_PLATFORM_ONE_AUTH_CHECK_CLIENT is true', async () => {
                const env = { CASS_PLATFORM_ONE_AUTH_IGNORE_ISSUE_TIME: 'true', CASS_PLATFORM_ONE_AUTH_CHECK_CLIENT: 'true', CASS_PLATFORM_ONE_CLIENT: 'cass' };
                assert.isUndefined(await p1(env, jwt({ sub, azp: 'other' })));
                assert.isDefined(await p1(env, jwt({ sub, azp: 'cass' })));
            });

            it('anonymizes users with "Anonymous User" when no word lists are set', async () => {
                const token = await p1({ CASS_PLATFORM_ONE_AUTH_IGNORE_ISSUE_TIME: 'true', CASS_PLATFORM_ONE_AUTH_ANONYMIZE_USERS: 'true' }, jwt({ sub, name: 'Pat', email: 'pat@example.com' }));
                assert.strictEqual(token.name, 'Anonymous User');
                assert.strictEqual(token.email, sub);
            });

            it('anonymizes users with words picked from the subject', async () => {
                const env = {
                    CASS_PLATFORM_ONE_AUTH_IGNORE_ISSUE_TIME: 'true', CASS_PLATFORM_ONE_AUTH_ANONYMIZE_USERS: 'true',
                    CASS_PLATFORM_ONE_AUTH_ADJECTIVES: 'Brave', CASS_PLATFORM_ONE_AUTH_NOUNS: 'Otter'
                };
                const token = await p1(env, jwt({ sub, name: 'Pat' }));
                assert.strictEqual(token.name, 'Brave Otter');
                assert.strictEqual(token.email, sub);
                // The same subject always gets the same words.
                const multi = { ...env, CASS_PLATFORM_ONE_AUTH_ADJECTIVES: 'Brave,Calm,Swift', CASS_PLATFORM_ONE_AUTH_NOUNS: 'Otter,Heron' };
                const first = await p1(multi, jwt({ sub }));
                const second = await p1(multi, jwt({ sub }));
                assert.strictEqual(second.name, first.name);
            });
        });

        describe('40_bearerBridge.js', () => {
            const issuer = 'https://idp.example.com/realms/test';
            let privateKey;
            let jwks;
            let bridge;

            before(async () => {
                const pair = await jose.generateKeyPair('RS256');
                privateKey = pair.privateKey;
                const publicJwk = await jose.exportJWK(pair.publicKey);
                jwks = jose.createLocalJWKSet({ keys: [{ ...publicJwk, alg: 'RS256', kid: 'k1' }] });
                [bridge] = load('40_bearerBridge.js', {}, { getJWKS: () => jwks });
            });

            const sign = (claims, iss = issuer) => new jose.SignJWT(claims)
                .setProtectedHeader({ alg: 'RS256', kid: 'k1' })
                .setIssuer(iss)
                .setIssuedAt()
                .setExpirationTime('5m')
                .sign(privateKey);

            const bridged = (authorization, extra = {}) => withEnv({ CASS_OIDC_ISSUER_BASE_URL: issuer + '/', CASS_OIDC_EXTERNAL_ISSUER_URL: undefined }, async () => {
                const req = { headers: { authorization }, ...extra };
                assert.isTrue(await run(bridge, req));
                return req.oidc;
            });

            it('turns a valid bearer token into an OIDC user', async () => {
                const oidc = await bridged('Bearer ' + await sign({ sub: 'u1', name: 'Una', email: 'una@example.com', groups: ['g1'] }));
                assert.deepEqual(oidc.user, { sub: 'u1', name: 'Una', email: 'una@example.com', preferred_username: 'u1', groups: ['g1'] });
                assert.isTrue(oidc.isAuthenticated());
            });

            it('fills in name, email and groups from other claims', async () => {
                const byUsername = await bridged('Bearer ' + await sign({ sub: 'u2', preferred_username: 'pat', realm_access: { roles: ['r1'] } }));
                assert.deepEqual(byUsername.user, { sub: 'u2', name: 'pat', email: 'pat@bearer', preferred_username: 'pat', groups: ['r1'] });
                const bySub = await bridged('Bearer ' + await sign({ sub: 'u3' }));
                assert.deepEqual(bySub.user, { sub: 'u3', name: 'u3', email: 'u3@bearer', preferred_username: 'u3', groups: [] });
            });

            it('leaves the request alone for a token from another issuer, a bad token, or a signed-in user', async () => {
                assert.isUndefined(await bridged('Bearer ' + await sign({ sub: 'u4' }, 'https://other.example.com')));
                assert.isUndefined(await bridged('Bearer not.a.token'));
                const signedIn = { user: { sub: 'browser' } };
                assert.strictEqual(await bridged('Bearer ' + await sign({ sub: 'u5' }), { oidc: signedIn }), signedIn);
                assert.isUndefined(await bridged('Basic abc'));
            });

            it('does nothing without an issuer to fetch keys from', async () => {
                const [noIssuer] = load('40_bearerBridge.js', {}, { getJWKS: () => null });
                const req = { headers: { authorization: 'Bearer ' + await sign({ sub: 'u6' }) } };
                assert.isTrue(await run(noIssuer, req));
                assert.isUndefined(req.oidc);
            });
        });

        describe('getJWKS', () => {
            it('is null without an issuer, and one key set per issuer otherwise', () => withEnv({ CASS_OIDC_ISSUER_BASE_URL: undefined }, async () => {
                const { getJWKS } = require('../main/server/shims/auth.js').common;
                assert.isNull(getJWKS());
                process.env.CASS_OIDC_ISSUER_BASE_URL = 'https://idp-a.example.com/realms/a/';
                const a = getJWKS();
                assert.isFunction(a);
                assert.strictEqual(getJWKS(), a, 'cached for the same issuer');
                process.env.CASS_OIDC_ISSUER_BASE_URL = 'https://idp-b.example.com/realms/b';
                assert.notStrictEqual(getJWKS(), a, 'recreated when the issuer changes');
            }));
        });
    });
}
