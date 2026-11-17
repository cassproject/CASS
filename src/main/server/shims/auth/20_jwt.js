module.exports = function installJwt(common) {
    if (process.env.CASS_JWT_ENABLED === 'true') {
        global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.INFO, "CassAuthJwtEnabled", `JWT authentication is enabled.`);

        // The key that verifies tokens has no safe default: refuse to start
        // rather than verify tokens with a value nobody configured.
        if (!process.env.CASS_JWT_SECRET?.trim()) {
            const message = "JWT authentication is enabled (CASS_JWT_ENABLED), but CASS_JWT_SECRET is not set. Set it and restart CaSS.";
            global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.EMERGENCY, "CassAuthMisconfigured", message);
            throw new Error(message);
        }

        const { expressjwt: jwt } = require("express-jwt");

        if (process.env.CASS_JWT_SESSION_ENABLED === 'true') {
            const session = require('express-session')
            const MemoryStore = require('memorystore')(session)

            app.use(session({
                cookie: { maxAge: 2 * 60 * 60 * 1000 },
                store: new MemoryStore({
                    checkPeriod: 2 * 60 * 60 * 1000 // prune expired entries every 24h
                }),
                resave: false,
                secret: EcCrypto.generateUUID()
            }))
        }

        app.use(
            jwt({
                secret: process.env.CASS_JWT_SECRET,
                algorithms: [process.env.CASS_JWT_ALGORITHM || 'HS256'],
                credentialsRequired: false
            })
        );
    }
};
