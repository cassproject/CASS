/**
 * Unit tests for src/main/server/xapi/debug.js — XAPI_DEBUG parsing and credential redaction.
 */

const { assert } = require('chai');
const { isXapiDebug, redact, debugLog } = require('../main/server/xapi/debug.js');

describe('xAPI debug logging', function () {
    it('XAPI_DEBUG is only on for an explicit true value', () => {
        for (const value of ['1', 'true', 'TRUE', 'yes', 'on', ' true ']) {
            assert.isTrue(isXapiDebug({ XAPI_DEBUG: value }), JSON.stringify(value));
        }
        for (const value of [undefined, '', 'false', 'FALSE', '0', 'no', 'off', 'disabled']) {
            assert.isFalse(isXapiDebug({ XAPI_DEBUG: value }), JSON.stringify(value));
        }
    });

    it('redacts the LRS credential from a config', () => {
        const config = { xapiEndpoint: 'https://lrs.example.com/xapi/', xapiAuth: 'Basic c2VjcmV0OnNlY3JldA==', enabled: true };
        assert.deepEqual(redact(config), { xapiEndpoint: 'https://lrs.example.com/xapi/', xapiAuth: '[redacted]', enabled: true });
        assert.strictEqual(config.xapiAuth, 'Basic c2VjcmV0OnNlY3JldA==', 'the original is untouched');
    });

    it('redacts authorization headers, in any case and nested', () => {
        const headers = { Authorization: 'Basic abc', 'X-Experience-API-Version': '1.0.1', nested: { authorization: 'Bearer xyz', cookie: 'session=1' } };
        assert.deepEqual(redact(headers), { Authorization: '[redacted]', 'X-Experience-API-Version': '1.0.1', nested: { authorization: '[redacted]', cookie: '[redacted]' } });
    });

    it('redacts values in a raw header list (name, value, name, value)', () => {
        const raw = ['Host', 'localhost', 'Authorization', 'Basic abc', 'signatureSheet', '[...]', 'Accept', '*/*'];
        assert.deepEqual(redact(raw), ['Host', 'localhost', 'Authorization', '[redacted]', 'signatureSheet', '[redacted]', 'Accept', '*/*']);
    });

    it('leaves strings, numbers and null alone and copes with cycles', () => {
        assert.strictEqual(redact('Basic abc'), 'Basic abc');
        assert.strictEqual(redact(3), 3);
        assert.isNull(redact(null));
        const loop = { a: 1 };
        loop.self = loop;
        assert.deepEqual(redact(loop), { a: 1, self: '[circular]' });
    });

    describe('debugLog', () => {
        let logged, original, saved;
        beforeEach(() => {
            logged = [];
            original = console.log;
            saved = process.env.XAPI_DEBUG;
            console.log = (...args) => logged.push(args);
        });
        afterEach(() => {
            console.log = original;
            if (saved === undefined) delete process.env.XAPI_DEBUG;
            else process.env.XAPI_DEBUG = saved;
        });

        it('logs nothing when XAPI_DEBUG is "false"', () => {
            process.env.XAPI_DEBUG = 'false';
            debugLog({ xapiAuth: 'Basic abc' });
            assert.deepEqual(logged, []);
        });

        it('logs with credentials redacted when XAPI_DEBUG is "true"', () => {
            process.env.XAPI_DEBUG = 'true';
            debugLog('https://lrs.example.com/xapi/statements', { Authorization: 'Basic abc' });
            assert.deepEqual(logged, [['https://lrs.example.com/xapi/statements', { Authorization: '[redacted]' }]]);
        });
    });
});
