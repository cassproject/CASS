/**
 * XAPI_DEBUG handling: only an explicit true value enables it ("false" used to), and LRS
 * credentials are redacted from anything it logs.
 */

const isXapiDebug = (env = process.env) => /^(1|true|yes|on)$/i.test(String(env.XAPI_DEBUG ?? '').trim());

const SECRET_KEYS = /^(xapiauth|authorization|proxy-authorization|cookie|signaturesheet)$/i;

/** A copy of value with credentials replaced, for logging. Raw header lists alternate name, value. */
const redact = (value, seen = new WeakSet()) => {
    if (value == null || typeof value !== 'object') return value;
    if (seen.has(value)) return '[circular]';
    seen.add(value);
    if (Array.isArray(value)) {
        return value.map((item, i) => (i > 0 && typeof value[i - 1] === 'string' && SECRET_KEYS.test(value[i - 1])) ? '[redacted]' : redact(item, seen));
    }
    const copy = {};
    for (const [key, item] of Object.entries(value)) {
        copy[key] = SECRET_KEYS.test(key) ? '[redacted]' : redact(item, seen);
    }
    return copy;
};

/** console.log when XAPI_DEBUG is on, with credentials redacted. */
const debugLog = (...args) => {
    if (isXapiDebug()) console.log(...args.map((arg) => redact(arg)));
};

module.exports = { isXapiDebug, redact, debugLog };
