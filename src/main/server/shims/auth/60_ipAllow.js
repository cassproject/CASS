const jose = require('jose');
const rateLimit = require('express-rate-limit');

module.exports = function installIpAllow(common) {
    const { getJWKS, ipMatch } = common;

    if (process.env.CASS_IP_ALLOW != null || process.env.CASS_SSO_ACCOUNT_REQUIRED != null) {
        console.log("IP allow / SSO guard middleware is active. CASS_IP_ALLOW:", process.env.CASS_IP_ALLOW, "CASS_SSO_ACCOUNT_REQUIRED:", process.env.CASS_SSO_ACCOUNT_REQUIRED);
        const csv = (v) => String(v || '').split(',').map((x) => x.trim()).filter(Boolean);
        const clientAllowList = csv(process.env.CASS_IP_ALLOW);
        const peerAllowList = [...clientAllowList, '127.0.0.1', '::1'];
        const trustedProxies = csv(process.env.CASS_TRUSTED_PROXIES);
        const clientIpHeader = String(process.env.CASS_CLIENT_IP_HEADER || 'x-forwarded-for').trim().toLowerCase();
        // The client address the trusted proxy reports. For X-Forwarded-For
        // that is the rightmost entry that is not itself a trusted proxy;
        // anything to its left was written by the client.
        const forwardedClient = (req) => {
            const v = req.headers[clientIpHeader];
            if (v == null) return null;
            const hops = String(Array.isArray(v) ? v.join(',') : v).split(',').map((x) => x.trim()).filter(Boolean);
            if (clientIpHeader !== 'x-forwarded-for') return hops.length === 1 ? hops[0] : null;
            for (let i = hops.length - 1; i >= 0; i--)
                if (!ipMatch(trustedProxies, hops[i])) return hops[i];
            return null;
        };
        // Never write credentials to the audit log.
        const loggedHeaders = (h) => {
            const out = { ...h };
            for (const k of ['authorization', 'cookie', 'proxy-authorization', 'x-api-key']) if (out[k] != null) out[k] = '[redacted]';
            return out;
        };
        if (trustedProxies.length === 0 && clientAllowList.length > 0)
            console.log("CASS_IP_ALLOW is matched against the connecting address only; set CASS_TRUSTED_PROXIES to honour " + clientIpHeader + " from a reverse proxy.");
        app.use(async function (req, res, next) {

            if (process.env.CASS_SESSION_VALIDATION_INTERVAL) {
                const validationIntervalMs = Number.parseInt(process.env.CASS_SESSION_VALIDATION_INTERVAL) * 1000;
                const now = Date.now();

                if (req.oidc && req.oidc.session) {
                    if (req.oidc.session.lastValidated && (now - req.oidc.session.lastValidated > validationIntervalMs)) {
                        try {
                            const accessToken = req.oidc.session.accessToken;
                            const issuerBaseUrl = (process.env.CASS_OIDC_ISSUER_BASE_URL || '').replace(/\/$/, '');
                            if (!accessToken || !issuerBaseUrl) {
                                throw new Error('Missing token or issuer URL for validation');
                            }

                            const userInfoUrl = issuerBaseUrl + '/protocol/openid-connect/userinfo';
                            const response = await fetch(userInfoUrl, {
                                headers: { 'Authorization': `Bearer ${accessToken}` }
                            });

                            if (!response.ok) {
                                throw new Error(`SSO validation failed: HTTP ${response.status}`);
                            }
                            req.oidc.session.lastValidated = now;
                        } catch (e) {
                            global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.INFO, 'SSOForcedExpiration', `SSO session expired or invalid for user: ${req.oidc.user?.email}. Error: ${e.message}`);
                            return res.oidc.logout({ returnTo: '/api/login' });
                        }
                    } else {
                        req.oidc.session.lastValidated = now;
                    }
                }
            }

            // The allowlist is matched against the TCP peer. A client-supplied
            // forwarding header counts only when the peer is a configured trusted
            // proxy (CASS_TRUSTED_PROXIES), and then only the one header that
            // proxy sets (CASS_CLIENT_IP_HEADER). Loopback is allowed for the
            // peer only: a header claiming 127.0.0.1 used to pass the guard.
            const peer = req.socket?.remoteAddress;
            let allowed = false;
            req.permittedBy = [];
            if (peer != null && ipMatch(peerAllowList, peer)) { req.permittedBy.push("Permitted by: " + 'connection' + ": " + peer); allowed = true; } //Remote address is permitted. (vpns, direct access, loopback)
            if (!allowed && clientAllowList.length > 0 && peer != null && trustedProxies.length > 0 && ipMatch(trustedProxies, peer)) {
                const client = forwardedClient(req);
                if (client != null && ipMatch(clientAllowList, client)) { req.permittedBy.push("Permitted by: " + clientIpHeader + ": " + client + " via proxy " + peer); allowed = true; } //Indirect remote access through a trusted proxy
            }
            if (process.env.CASS_API_KEY != null && req.headers?.['authorization'] != null && req.headers['authorization'] == process.env.CASS_API_KEY) { req.permittedBy.push("Permitted by: " + 'bearer token'); allowed = true; } //Bearer token is permitted
            if (req.originalUrl == global.baseUrl + "/callback") { req.permittedBy.push("Permitted by: " + 'sso callback'); allowed = true; } //SSO is permitted
            if (req.originalUrl == global.baseUrl + "/login") { req.permittedBy.push("Permitted by: " + 'sso callback'); allowed = true; } //SSO redirect is permitted
            if (req.originalUrl == global.baseUrl + "/logout") { req.permittedBy.push("Permitted by: " + 'sso callback'); allowed = true; } //SSO redirect is permitted
            if (req.originalUrl == global.baseUrl + "/api/ping") { req.permittedBy.push("Permitted by: " + 'sso callback'); allowed = true; } //Health check is permitted
            if (req.originalUrl == "/.well-known/oauth-authorization-server") { req.permittedBy.push("Permitted by: " + 'oauth discovery'); allowed = true; } //MCP OAuth discovery is permitted
            if (req.originalUrl == "/.well-known/oauth-protected-resource") { req.permittedBy.push("Permitted by: " + 'oauth discovery'); allowed = true; } //MCP OAuth resource metadata is permitted
            if (process.env.CASS_SSO_ACCOUNT_REQUIRED != null)
                if (req.eim != null && req.eim.ids.length >= Number.parseInt(process.env.CASS_SSO_ACCOUNT_REQUIRED)) { req.permittedBy.push("Permitted by: " + 'sso ids > ' + process.env.CASS_SSO_ACCOUNT_REQUIRED + ": " + req.eim.ids.length); allowed = true; } //In a permissioned group.

            // Validate OAuth Bearer tokens (for MCP/API clients that authenticated via the OAuth flow).
            if (!allowed && req.headers.authorization) {
                const authHeader = req.headers.authorization;
                if (authHeader.startsWith('Bearer ')) {
                    const token = authHeader.substring(7);
                    const JWKS = getJWKS();
                    if (JWKS) {
                        try {
                            const issuerUrl = (process.env.CASS_OIDC_ISSUER_BASE_URL || '').replace(/\/$/, '');
                            const externalIssuerUrl = (process.env.CASS_OIDC_EXTERNAL_ISSUER_URL || '').replace(/\/$/, '');
                            // Accept tokens issued with either the internal or external issuer URL
                            const allowedIssuers = [issuerUrl, externalIssuerUrl].filter(Boolean);
                            const { payload } = await jose.jwtVerify(token, JWKS, {
                                issuer: allowedIssuers.length > 0 ? allowedIssuers : undefined,
                            });
                            req.permittedBy.push('Permitted by: Bearer token (sub: ' + payload.sub + ')');
                            allowed = true;
                            global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.INFO, 'CassBearerTokenGranted',
                                `Bearer token validated for sub=${payload.sub}, azp=${payload.azp || 'N/A'}`);
                        } catch (err) {
                            global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.WARNING, 'CassBearerTokenRejected',
                                `Bearer token validation failed: ${err.message}`);
                        }
                    }
                }
            }

            if (!allowed) {
                global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.WARNING, "CassIpAllowDenied", "DENIED", JSON.stringify({
                    allowed,
                    headers: loggedHeaders(req.headers),
                    connections: {
                        socket: req.socket?.remoteAddress ?? null,
                        info: req.info?.remoteAddress ?? null
                    },
                    eim: req.eim != null ? req.eim.ids.map(i => i.displayName) : null
                }), `Client address header (from CASS_TRUSTED_PROXIES only): ${clientIpHeader}`);

                // Detect API/MCP client requests via Accept header or MCP endpoint path.
                // These clients expect JSON or SSE streams, not HTML redirects.
                const acceptHeader = (req.headers['accept'] || '').toLowerCase();
                const isMcpPath = req.originalUrl.startsWith(global.baseUrl + '/api/mcp');
                const isApiClient = isMcpPath
                    || ((acceptHeader.includes('text/event-stream')
                        || acceptHeader.includes('application/json'))
                        && req.originalUrl.startsWith(global.baseUrl + '/api/'));

                if (isApiClient) {
                    const serverOrigin = (process.env.CASS_OIDC_BASE_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
                    let wwwAuth = 'Bearer';
                    if (process.env.CASS_OIDC_ENABLED) {
                        wwwAuth = `Bearer resource_metadata="${serverOrigin}/.well-known/oauth-protected-resource"`;
                    } else if (process.env.CASS_IP_DENIED_REDIRECT) {
                        wwwAuth = `Bearer realm="${process.env.CASS_IP_DENIED_REDIRECT}"`;
                    }

                    global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.INFO, "CassApiClientDenied",
                        `API/MCP client denied (returning 401 instead of redirect). Path: ${req.originalUrl}`);
                    res.set('WWW-Authenticate', wwwAuth);
                    res.status(401).json({ error: 'Unauthorized' });
                }
                else if (process.env.CASS_IP_DENIED_REDIRECT) {
                    res.redirect(process.env.CASS_IP_DENIED_REDIRECT);
                    res.end();
                }
                else {
                    res.status(403);
                    res.end();
                }
            }
            else {
                global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.INFO, "CassIpAllowGranted", `GRANTED BY ${req.permittedBy}.`, JSON.stringify({
                    allowed,
                    permittedBy: req.permittedBy,
                    headers: loggedHeaders(req.headers),
                    connections: {
                        socket: req.socket?.remoteAddress ?? null,
                        info: req.info?.remoteAddress ?? null
                    },
                    eim: req.eim != null ? req.eim.ids.map(i => i.displayName) : null
                }), `Client address header (from CASS_TRUSTED_PROXIES only): ${clientIpHeader}`);
                next();
            }
        });
    }
};
