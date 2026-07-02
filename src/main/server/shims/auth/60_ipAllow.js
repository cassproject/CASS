const jose = require('jose');
const rateLimit = require('express-rate-limit');

module.exports = function (common) {
    const { getJWKS, ipMatch } = common;

    if (process.env.CASS_IP_ALLOW != null || process.env.CASS_SSO_ACCOUNT_REQUIRED != null) {
        // Rate limiter for IP allow / SSO guard — prevents brute-force access attempts.
        const ipAllowRateLimiter = rateLimit({
            windowMs: parseInt(process.env.CASS_RATE_LIMIT_WINDOW_MS) || 60 * 1000, // 1 minute
            max: parseInt(process.env.CASS_RATE_LIMIT_MAX) || 2000,                 // higher limit since this also gates normal traffic
            standardHeaders: true,
            legacyHeaders: false,
            message: { error: 'Too many requests, please try again later.' },
        });
        if (process.env.CASS_RATE_LIMIT) {
            app.use(ipAllowRateLimiter);
        }

        app.use(async function (req, res, next) {

            if (process.env.CASS_SESSION_VALIDATION_INTERVAL) {
                const validationIntervalMs = parseInt(process.env.CASS_SESSION_VALIDATION_INTERVAL) * 1000;
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

            let debug = true;
            let ipFilter = process.env.CASS_IP_ALLOW || "";
            ipFilter += ",::ffff:127.0.0.1";
            let ipFilterList = ipFilter.split(",");
            let allowed = false;
            req.permittedBy = [];
            if (process.env.CASS_API_KEY != null && req.headers?.['authorization'] != null && req.headers['authorization'] == process.env.CASS_API_KEY) { req.permittedBy.push("Permitted by: " + 'bearer token'); allowed = true; } //Bearer token is permitted
            if (req.originalUrl == global.baseUrl + "/callback") { req.permittedBy.push("Permitted by: " + 'sso callback'); allowed = true; } //SSO is permitted
            if (req.originalUrl == global.baseUrl + "/login") { req.permittedBy.push("Permitted by: " + 'sso callback'); allowed = true; } //SSO redirect is permitted
            if (req.originalUrl == global.baseUrl + "/logout") { req.permittedBy.push("Permitted by: " + 'sso callback'); allowed = true; } //SSO redirect is permitted
            if (req.originalUrl == global.baseUrl + "/api/ping") { req.permittedBy.push("Permitted by: " + 'sso callback'); allowed = true; } //Health check is permitted
            if (req.originalUrl == "/.well-known/oauth-authorization-server") { req.permittedBy.push("Permitted by: " + 'oauth discovery'); allowed = true; } //MCP OAuth discovery is permitted
            if (req.originalUrl == "/.well-known/oauth-protected-resource") { req.permittedBy.push("Permitted by: " + 'oauth discovery'); allowed = true; } //MCP OAuth resource metadata is permitted
            if (req.headers['x-client-ip'] != null && ipMatch(ipFilterList, req.headers['x-client-ip'])) { req.permittedBy.push("Permitted by: " + 'x-client-ip' + ": " + req.headers['x-client-ip']); allowed = true; } //Indirect remote access is permitted (reverse proxies, etc)
            if (req.headers['x-forwarded-for'] != null && ipMatch(ipFilterList, req.headers['x-forwarded-for'])) { req.permittedBy.push("Permitted by: " + 'x-forwarded-for' + ": " + req.headers['x-forwarded-for']); allowed = true; } //Indirect remote access is permitted (reverse proxies, etc)
            if (req.headers['cf-connecting-ip'] != null && ipMatch(ipFilterList, req.headers['cf-connecting-ip'])) { req.permittedBy.push("Permitted by: " + 'cf-connecting-ip' + ": " + req.headers['cf-connecting-ip']); allowed = true; } //Indirect remote access is permitted (reverse proxies, etc)
            if (req.headers['fastly-client-ip'] != null && ipMatch(ipFilterList, req.headers['fastly-client-ip'])) { req.permittedBy.push("Permitted by: " + 'fastly-client-ip' + ": " + req.headers['fastly-client-ip']); allowed = true; } //Indirect remote access is permitted (reverse proxies, etc)
            if (req.headers['true-client-ip'] != null && ipMatch(ipFilterList, req.headers['true-client-ip'])) { req.permittedBy.push("Permitted by: " + 'true-client-ip' + ": " + req.headers['true-client-ip']); allowed = true; } //Indirect remote access is permitted (reverse proxies, etc)
            if (req.headers['x-real-ip'] != null && ipMatch(ipFilterList, req.headers['x-real-ip'])) { req.permittedBy.push("Permitted by: " + 'x-real-ip' + ": " + req.headers['x-real-ip']); allowed = true; } //Indirect remote access is permitted (reverse proxies, etc)
            if (req.headers['x-cluster-client-ip'] != null && ipMatch(ipFilterList, req.headers['x-cluster-client-ip'])) { req.permittedBy.push("Permitted by: " + 'x-cluster-client-ip' + ": " + req.headers['x-cluster-client-ip']); allowed = true; } //Indirect remote access is permitted (reverse proxies, etc)
            if (req.headers['x-forwarded'] != null && ipMatch(ipFilterList, req.headers['x-forwarded'])) { req.permittedBy.push("Permitted by: " + 'x-forwarded' + ": " + req.headers['x-forwarded']); allowed = true; } //Indirect remote access is permitted (reverse proxies, etc)
            if (req.socket?.remoteAddress != null && ipMatch(ipFilterList, req.socket.remoteAddress)) { req.permittedBy.push("Permitted by: " + 'connection' + ": " + req.socket.remoteAddress); allowed = true; } //Remote address is permitted. (vpns, direct access)
            if (req.socket?.remoteAddress != null && ipMatch(ipFilterList, req.socket.remoteAddress)) { req.permittedBy.push("Permitted by: " + 'socket' + ": " + req.socket.remoteAddress); allowed = true; } //Remote address is permitted. (vpns, direct access)
            if (req.info?.remoteAddress != null && ipMatch(ipFilterList, req.info.remoteAddress)) { req.permittedBy.push("Permitted by: " + 'info' + ": " + req.info.remoteAddress); allowed = true; } //Remote address is permitted. (vpns, direct access)
            if (process.env.CASS_SSO_ACCOUNT_REQUIRED != null)
                if (req.eim != null && req.eim.ids.length >= parseInt(process.env.CASS_SSO_ACCOUNT_REQUIRED)) { req.permittedBy.push("Permitted by: " + 'sso ids > ' + process.env.CASS_SSO_ACCOUNT_REQUIRED + ": " + req.eim.ids.length); allowed = true; } //In a permissioned group.

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
                    headers: req.headers,
                    connections: {
                        socket: (req.socket != null && req.socket.remoteAddress != null) ? req.socket.remoteAddress : null,
                        info: (req.info != null && req.info.remoteAddress != null) ? req.info.remoteAddress : null
                    },
                    eim: req.eim != null ? req.eim.ids.map(i => i.displayName) : null
                }), "Use forwarding headers: x-client-ip, x-forwarded-for, cf-connecting-ip, fastly-client-ip, true-client-ip, x-real-ip, x-cluster-client-ip, x-forwarded");

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
                    headers: req.headers,
                    connections: {
                        socket: (req.socket != null && req.socket.remoteAddress != null) ? req.socket.remoteAddress : null,
                        info: (req.info != null && req.info.remoteAddress != null) ? req.info.remoteAddress : null
                    },
                    eim: req.eim != null ? req.eim.ids.map(i => i.displayName) : null
                }), "Use forwarding headers: x-client-ip, x-forwarded-for, cf-connecting-ip, fastly-client-ip, true-client-ip, x-real-ip, x-cluster-client-ip, x-forwarded");
                next();
            }
        });
    }
};
