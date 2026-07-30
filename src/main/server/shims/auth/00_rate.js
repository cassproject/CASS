const rateLimit = require('express-rate-limit');

module.exports = function (common) {
    if (process.env.CASS_RATE_LIMIT) {
        global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.INFO, "CassAuthRateLimit", `Rate limiting is enabled for auth middleware. Window: ${process.env.CASS_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000} ms, Max: ${process.env.CASS_RATE_LIMIT_MAX || 100} requests.`);

        // Rate limiter for auth middleware — prevents brute-force token attempts.
        const authRateLimiter = rateLimit({
            windowMs: parseInt(process.env.CASS_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
            max: parseInt(process.env.CASS_RATE_LIMIT_MAX) || 100,                 // limit each IP to 100 requests per window
            standardHeaders: true,
            legacyHeaders: false,
            message: { error: 'Too many requests, please try again later.' },
        });
        app.use(authRateLimiter);
    }
}