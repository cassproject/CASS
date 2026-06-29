module.exports = function (common) {
    if (process.env.CASS_JWT_ENABLED === 'true') {
        var { expressjwt: jwt } = require("express-jwt");

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
                secret: process.env.CASS_JWT_SECRET || 'cass',
                algorithms: [process.env.CASS_JWT_ALGORITHM || 'HS256'],
                credentialsRequired: false
            })
        );
    }
};
