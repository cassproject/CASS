const crypto = require('crypto');

// The longest a session lasts, in seconds (the session library's default, set
// explicitly because signed-out sessions are remembered for this long).
const SESSION_ABSOLUTE_DURATION = 7 * 24 * 60 * 60;
// How long another CaSS server's sign-out can go unnoticed: a session found
// signed in is looked up in the shared store again after this many milliseconds.
const SIGNED_OUT_RECHECK_MS = 10000;

module.exports = function installOidc(common) {
    if (process.env.CASS_OIDC_ENABLED) {
        global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.INFO, "CassAuthEnabled", `OIDC authentication is enabled.`);
        if (global.baseUrl != "") {
            global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.WARNING, "CassAuthBaseUrl", `BASE URL is ${global.baseURL} and this can cause problems with callbacks from SSO providers. You may need to modify your reverse proxy (if you have one) to match up callbacks. If you use the cass installer script, this requires taking /cass out of the Apache2 redirect.`);
        }
        // The issuer and the session secret have no safe defaults: refuse to
        // start rather than trust an identity provider or a cookie key nobody
        // configured.
        const missing = ['CASS_OIDC_ISSUER_BASE_URL', 'CASS_OIDC_SECRET'].filter((name) => !process.env[name]?.trim());
        if (missing.length > 0) {
            const message = `OIDC authentication is enabled (CASS_OIDC_ENABLED), but ${missing.join(' and ')} ${missing.length > 1 ? 'are' : 'is'} not set. Set ${missing.length > 1 ? 'them' : 'it'} and restart CaSS.`;
            global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.EMERGENCY, "CassAuthMisconfigured", message);
            throw new Error(message);
        }
        const tokenSigningAlg = process.env.CASS_OIDC_ALG || 'HS256';

        // Signing out ends the session for every copy of its cookie. The session
        // is kept only in the browser's encrypted cookie, so clearing that cookie
        // would leave any other copy of it (a response still in flight when the
        // user signed out, a saved cookie) signed in until it expired. A session
        // is known by a hash of its ID token, which every copy of its cookie
        // carries. Signed-out sessions are remembered in memory and in the
        // ephemeral index, where every CaSS server sees them, for as long as a
        // session can last.
        const signedOut = new Map(); // session hash -> remembered until (ms)
        const checked = new Map(); // session hash -> when the shared store last had no sign-out for it
        const sessionHash = (req) => {
            const idToken = req.appSession?.id_token;
            return typeof idToken === 'string' && idToken !== '' ? crypto.createHash('sha256').update(idToken).digest('hex') : null;
        };
        const storeId = (hash) => 'signedOut.' + hash;
        const isSignedOut = async (hash) => {
            const now = Date.now();
            const until = signedOut.get(hash);
            if (until != null) {
                if (until > now) return true;
                signedOut.delete(hash);
            }
            if (global.ephemeral == null) return false;
            const last = checked.get(hash);
            if (last != null && now - last < SIGNED_OUT_RECHECK_MS) return false;
            try {
                const entry = await global.ephemeral.get(storeId(hash));
                if (entry?.until > now) {
                    signedOut.set(hash, entry.until);
                    checked.delete(hash);
                    return true;
                }
            } catch (e) {
                global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.WARNING, "CassSignOutCheckFailed", `Could not check whether a session was signed out: ${e.message}`);
                return false;
            }
            if (checked.size >= 10000) checked.clear();
            checked.set(hash, now);
            return false;
        };
        const signOut = (logoutOptions) => async (req, res) => {
            const hash = sessionHash(req);
            if (hash != null) {
                const now = Date.now();
                const until = now + SESSION_ABSOLUTE_DURATION * 1000;
                for (const [known, knownUntil] of signedOut) {
                    if (knownUntil <= now) signedOut.delete(known);
                }
                signedOut.set(hash, until);
                checked.delete(hash);
                try {
                    await global.ephemeral?.put(storeId(hash), { until }, until);
                } catch (e) {
                    global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.WARNING, "CassSignOutStoreFailed", `Could not share a sign-out with other CaSS servers: ${e.message}`);
                }
            }
            res.oidc.logout(logoutOptions(req));
        };

        const { auth } = require('express-openid-connect');
        app.use(
            auth({
                issuerBaseURL: process.env.CASS_OIDC_ISSUER_BASE_URL,
                baseURL: process.env.CASS_OIDC_BASE_URL || 'http://localhost/',
                clientID: process.env.CASS_OIDC_CLIENT_ID || 'cass',
                // Confidential client secret (distinct from CASS_OIDC_SECRET,
                // which remains the session-cookie / HS256 secret). Setting it
                // enables the authorization code flow for providers that do not
                // support the implicit flow (e.g. Dex).
                clientSecret: process.env.CASS_OIDC_CLIENT_SECRET || undefined,
                secret: process.env.CASS_OIDC_SECRET,
                authorizationParams: {
                    scope: process.env.CASS_OIDC_SCOPE || 'openid profile email',
                    // Default to the code flow when a client secret is present,
                    // otherwise keep the historical implicit id_token flow.
                    // CASS_OIDC_RESPONSE_TYPE overrides (id_token, code, code id_token).
                    response_type: process.env.CASS_OIDC_RESPONSE_TYPE || (process.env.CASS_OIDC_CLIENT_SECRET ? 'code' : 'id_token'),
                },
                authRequired: false,
                // Served below, so that signing out also ends the session.
                routes: { callback: global.baseUrl + "/callback", logout: false },
                session: {
                    absoluteDuration: SESSION_ABSOLUTE_DURATION,
                    rollingDuration: process.env.CASS_SESSION_MAX_AGE ? Number.parseInt(process.env.CASS_SESSION_MAX_AGE) : undefined,
                    cookie: {
                        sameSite: process.env.CORS_CREDENTIALS?.trim() == 'true' ? 'None' : 'Lax',
                    }
                }
            })
        );
        // A request carrying a signed-out session continues as anonymous, and its cookie is cleared.
        app.use(async (req, res, next) => {
            const hash = sessionHash(req);
            if (hash != null && await isSignedOut(hash)) {
                req.appSession = undefined;
            }
            next();
        });
        app.get(global.baseUrl + '/api/login', (req, res) => {
            res.oidc.login({
                returnTo: req.query.redirectUrl || '/',
                authorizationParams: {
                    scope: process.env.CASS_OIDC_SCOPE || 'openid profile email',
                }
            });
        });
        app.get(global.baseUrl + '/api/logout', signOut((req) => ({
            returnTo: req.query.redirectUrl || '/'
        })));
        app.get('/logout', signOut(() => undefined));
        const { auth: auth2 } = require('express-oauth2-jwt-bearer');
        app.use(
            auth2({
                issuerBaseURL: process.env.CASS_OIDC_ISSUER_BASE_URL,
                // Only symmetric (HS*) tokens are checked with CASS_OIDC_SECRET;
                // the library refuses a secret alongside an asymmetric algorithm,
                // whose keys come from the issuer instead.
                secret: tokenSigningAlg.startsWith('HS') ? process.env.CASS_OIDC_SECRET : undefined,
                audience: process.env.CASS_OIDC_AUDIENCE || 'account',
                tokenSigningAlg,
                authRequired: false
            })
        );

        // -----------------------------------------------------------------------
        // OAuth 2.0 Protected Resource Metadata (RFC 9728) for MCP clients.
        //
        // When an MCP server returns 401, clients discover the authorization
        // server via /.well-known/oauth-protected-resource on the MCP server's
        // origin. authorization_servers points to CaSS because CaSS proxies
        // the RFC 8414 metadata (many providers don't serve it natively).
        // -----------------------------------------------------------------------
        app.get('/.well-known/oauth-protected-resource', (req, res) => {
            const serverOrigin = (process.env.CASS_OIDC_BASE_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');

            if (!process.env.CASS_OIDC_ISSUER_BASE_URL) {
                res.status(404).json({ error: 'OIDC issuer not configured' });
                return;
            }

            const metadata = {
                resource: serverOrigin,
                authorization_servers: [serverOrigin],
                scopes_supported: (process.env.CASS_OIDC_SCOPE || 'openid profile email').split(/\s+/),
                bearer_methods_supported: ['header'],
            };

            global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.INFO, 'OAuthProtectedResourceServed',
                `Served OAuth Protected Resource Metadata (auth_server: ${serverOrigin})`);
            res.json(metadata);
        });

        // -----------------------------------------------------------------------
        // OAuth 2.0 Authorization Server Metadata (RFC 8414) for MCP clients.
        //
        // Proxies the upstream OIDC discovery document and serves it as RFC 8414
        // metadata. The issuer is set to the CaSS origin to match what we
        // advertise in authorization_servers above (RFC 8414 §3.3).
        // -----------------------------------------------------------------------
        let cachedOAuthMetadata = null;
        let cachedOAuthMetadataExpiry = 0;

        app.get('/.well-known/oauth-authorization-server', async (req, res) => {
            try {
                global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.INFO, 'OAuthMetadataRequest',
                    `OAuth Authorization Server Metadata requested`);

                const now = Date.now();
                if (cachedOAuthMetadata && now < cachedOAuthMetadataExpiry) {
                    res.json(cachedOAuthMetadata);
                    return;
                }

                const issuerBaseUrl = (process.env.CASS_OIDC_ISSUER_BASE_URL || '').replace(/\/$/, '');
                if (!issuerBaseUrl) {
                    res.status(404).json({ error: 'OIDC issuer not configured' });
                    return;
                }

                const discoveryUrl = issuerBaseUrl + '/.well-known/openid-configuration';
                const response = await fetch(discoveryUrl, { signal: AbortSignal.timeout(10000) });
                if (!response.ok) {
                    global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.ERROR, 'OAuthMetadataFetchError',
                        `Failed to fetch OIDC discovery from ${discoveryUrl}: HTTP ${response.status}`);
                    res.status(502).json({ error: 'Failed to fetch upstream OIDC configuration' });
                    return;
                }

                const oidcConfig = await response.json();

                // Keep standard OAuth/OIDC scopes, drop provider-internal ones.
                const safeScopes = new Set(['openid', 'profile', 'email', 'offline_access', 'address', 'phone']);
                const filteredScopes = (oidcConfig.scopes_supported || [])
                    .filter(s => safeScopes.has(s));

                // Rewrite internal URLs to be externally reachable.
                const externalIssuer = process.env.CASS_OIDC_EXTERNAL_ISSUER_URL;
                const rewriteUrl = (url) => {
                    if (!url || !externalIssuer) return url;
                    const internalIssuer = oidcConfig.issuer;
                    if (url.startsWith(internalIssuer)) {
                        return externalIssuer.replace(/\/$/, '') + url.substring(internalIssuer.length);
                    }
                    return url;
                };

                // issuer MUST match authorization_servers from protected resource metadata.
                const serverOrigin = (process.env.CASS_OIDC_BASE_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');

                cachedOAuthMetadata = {
                    issuer: serverOrigin,
                    authorization_endpoint: rewriteUrl(oidcConfig.authorization_endpoint),
                    token_endpoint: rewriteUrl(oidcConfig.token_endpoint),
                    registration_endpoint: rewriteUrl(oidcConfig.registration_endpoint) || undefined,
                    jwks_uri: rewriteUrl(oidcConfig.jwks_uri),
                    scopes_supported: filteredScopes,
                    response_types_supported: ['code'],
                    grant_types_supported: ['authorization_code', 'refresh_token'],
                    token_endpoint_auth_methods_supported: oidcConfig.token_endpoint_auth_methods_supported,
                    code_challenge_methods_supported: oidcConfig.code_challenge_methods_supported || ['S256'],
                };
                cachedOAuthMetadataExpiry = now + 5 * 60 * 1000;

                global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.INFO, 'OAuthMetadataServed',
                    `Served OAuth Authorization Server Metadata (issuer: ${cachedOAuthMetadata.issuer})`);
                res.json(cachedOAuthMetadata);
            } catch (err) {
                global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.ERROR, 'OAuthMetadataError',
                    `Error serving OAuth metadata: ${err.message}`);
                res.status(500).json({ error: 'Internal error fetching OAuth metadata' });
            }
        });
    }
};
