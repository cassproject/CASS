module.exports = function (common) {
    if (process.env.CASS_OIDC_ENABLED || false) {
        if (global.baseUrl != "") {
            global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.WARNING, "CassAuthBaseUrl", `BASE URL is ${global.baseURL} and this can cause problems with callbacks from SSO providers. You may need to modify your reverse proxy (if you have one) to match up callbacks. If you use the cass installer script, this requires taking /cass out of the Apache2 redirect.`);
        }
        const { auth } = require('express-openid-connect');
        app.use(
            auth({
                issuerBaseURL: process.env.CASS_OIDC_ISSUER_BASE_URL || 'https://dev.keycloak.eduworks.com/auth/realms/test-realm/',
                baseURL: process.env.CASS_OIDC_BASE_URL || 'http://localhost/',
                clientID: process.env.CASS_OIDC_CLIENT_ID || 'cass',
                secret: process.env.CASS_OIDC_SECRET || 'a71b92d4-336e-4664-bc05-2226f76b4042',
                routes: { callback: global.baseUrl + "/callback" },
                authorizationParams: {
                    scope: process.env.CASS_OIDC_SCOPE || 'openid profile email'
                },
                authRequired: false,
                session: {
                    rollingDuration: process.env.CASS_SESSION_MAX_AGE ? parseInt(process.env.CASS_SESSION_MAX_AGE) : undefined,
                    cookie: {
                        sameSite: process.env.CORS_CREDENTIALS && process.env.CORS_CREDENTIALS.trim() == 'true' ? 'None' : 'Lax',
                    }
                }
            })
        );
        app.get(global.baseUrl + '/api/login', (req, res) => {
            res.oidc.login({
                returnTo: req.query.redirectUrl || '/',
                authorizationParams: {
                    scope: process.env.CASS_OIDC_SCOPE || 'openid profile email',
                }
            });
        });
        app.get(global.baseUrl + '/api/logout', (req, res) => {
            res.oidc.logout({
                returnTo: req.query.redirectUrl || '/'
            });
        });
        const { auth: auth2 } = require('express-oauth2-jwt-bearer');
        app.use(
            auth2({
                issuerBaseURL: process.env.CASS_OIDC_ISSUER_BASE_URL || 'https://dev.keycloak.eduworks.com/auth/realms/test-realm/',
                secret: process.env.CASS_OIDC_SECRET,
                audience: process.env.CASS_OIDC_AUDIENCE || 'account',
                tokenSigningAlg: process.env.CASS_OIDC_ALG || 'HS256',
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
                const safeScopes = ['openid', 'profile', 'email', 'offline_access', 'address', 'phone'];
                const filteredScopes = (oidcConfig.scopes_supported || [])
                    .filter(s => safeScopes.includes(s));

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
