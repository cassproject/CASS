// -----------------------------------------------------------------------
// Bearer JWT → req.oidc.user bridge (for MCP/API clients).
//
// The signature sheet middleware below reads req.oidc.user to get the
// email/name/sub for identity creation.  For browser-based OIDC sessions,
// express-openid-connect populates this.  For Bearer-token clients (MCP),
// we validate the JWT here and synthesize req.oidc.user from its claims
// so the signature sheet flow works identically.
// -----------------------------------------------------------------------
const jose = require('jose');

module.exports = function (common) {
    const { getJWKS } = common;

    app.use(async function (req, res, next) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ') && (!req.oidc || !req.oidc.user)) {
            const token = authHeader.substring(7);
            const JWKS = getJWKS();
            if (JWKS) {
                try {
                    const issuerUrl = (process.env.CASS_OIDC_ISSUER_BASE_URL || '').replace(/\/$/, '');
                    const externalIssuerUrl = (process.env.CASS_OIDC_EXTERNAL_ISSUER_URL || '').replace(/\/$/, '');
                    const allowedIssuers = [issuerUrl, externalIssuerUrl].filter(Boolean);
                    const { payload } = await jose.jwtVerify(token, JWKS, {
                        issuer: allowedIssuers.length > 0 ? allowedIssuers : undefined,
                    });
                    // Replace req.oidc entirely with a plain object.
                    // express-openid-connect's RequestContext defines .user as a
                    // getter-only property (no setter), so assigning to it silently
                    // fails. Using a plain object ensures the signature sheet
                    // middleware can read these values at req.oidc.user.
                    req.oidc = {
                        user: {
                            sub: payload.sub,
                            name: payload.name || payload.preferred_username || payload.sub,
                            email: payload.email || (payload.preferred_username ? payload.preferred_username + '@bearer' : payload.sub + '@bearer'),
                            preferred_username: payload.preferred_username || payload.sub,
                            groups: payload.groups || payload.realm_access?.roles || [],
                        },
                        isAuthenticated: () => true,
                    };
                } catch (err) {
                    // Token invalid — let subsequent middleware handle it
                }
            }
        }
        next();
    });
};
