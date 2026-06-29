const rateLimit = require('express-rate-limit');

module.exports = function (common) {
    // Rate limiter for auth middleware — prevents brute-force token attempts.
    const authRateLimiter = rateLimit({
        windowMs: parseInt(process.env.CASS_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
        max: parseInt(process.env.CASS_RATE_LIMIT_MAX) || 100,                 // limit each IP to 100 requests per window
        standardHeaders: true,
        legacyHeaders: false,
        message: { error: 'Too many requests, please try again later.' },
    });
    if (process.env.CASS_RATE_LIMIT) {
        app.use(authRateLimiter);
    }
}