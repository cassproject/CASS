/**
 * MCP Adapter — Unit tests for http-client.js buildRequest URL assembly.
 *
 * Pure unit tests: no server or network needed.
 */

const { assert } = require('chai');

describe('MCP Adapter — http-client', function () {
    let buildRequest;

    before(async () => {
        ({ buildRequest } = await import('../main/server/mcp/lib/http-client.js'));
    });

    const params = { uid: { location: 'path' }, q: { location: 'query' } };

    it('joins the base URL and the path without doubling /api', () => {
        const { url } = buildRequest('get', '/api/data/{uid}', { uid: 'x' }, params, { baseUrl: 'http://cass.test/api' });
        assert.strictEqual(url, 'http://cass.test/api/data/x');
    });

    it('trims any number of trailing slashes from the base URL', () => {
        for (const baseUrl of ['http://cass.test/api/', 'http://cass.test/api///', 'http://cass.test/api']) {
            const { url } = buildRequest('get', '/api/data/{uid}', { uid: 'x', q: 'y' }, params, { baseUrl });
            assert.strictEqual(url, 'http://cass.test/api/data/x?q=y', baseUrl);
        }
    });

    it('keeps slashes inside the base URL', () => {
        const { url } = buildRequest('get', '/api/ping', {}, params, { baseUrl: 'http://cass.test//api//' });
        assert.strictEqual(url, 'http://cass.test//api/ping');
    });

    it('a base URL of only slashes becomes empty', () => {
        const { url } = buildRequest('get', '/api/ping', {}, params, { baseUrl: '///' });
        assert.strictEqual(url, '/ping');
    });

    it('trims a base URL of many slashes in linear time', () => {
        const start = Date.now();
        buildRequest('get', '/api/ping', {}, params, { baseUrl: 'http://cass.test' + '/'.repeat(50000) + 'x' + '/'.repeat(50000) + 'x' });
        assert.isBelow(Date.now() - start, 1000);
    });

    it('trims trailing slashes from CASS_URL', async () => {
        const saved = process.env.CASS_URL;
        process.env.CASS_URL = 'http://env.test/api//';
        try {
            // A query string loads a fresh copy of the module, which reads CASS_URL at load time.
            const fresh = await import('../main/server/mcp/lib/http-client.js?cass-url-' + Date.now());
            const { url } = fresh.buildRequest('get', '/api/ping', {}, params);
            assert.strictEqual(url, 'http://env.test/api/ping');
        } finally {
            if (saved === undefined) delete process.env.CASS_URL;
            else process.env.CASS_URL = saved;
        }
    });
});
