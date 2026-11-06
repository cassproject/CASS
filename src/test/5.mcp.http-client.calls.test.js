/**
 * MCP Adapter — http-client.js request building and callCass, against a local HTTP server.
 *
 * No CaSS server or public network needed.
 */

const { assert } = require('chai');
const http = require('http');

describe('MCP Adapter — http-client calls', function () {
    let server;
    let baseUrl;
    let requests;

    before(async () => {
        server = http.createServer((req, res) => {
            let body = '';
            req.on('data', (c) => { body += c; });
            req.on('end', () => {
                requests.push({ method: req.method, url: req.url, headers: req.headers, body });
                // Connection: close keeps no pooled sockets open when mocha exits (a libuv assertion on Windows otherwise).
                res.writeHead(req.url.startsWith('/api/missing') ? 404 : 200, { 'Content-Type': 'application/json', Connection: 'close' });
                res.end(JSON.stringify({ echoed: req.url, size: body.length }));
            });
        });
        await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
        baseUrl = 'http://127.0.0.1:' + server.address().port + '/api';
    });

    beforeEach(() => { requests = []; });

    after(async () => {
        if (server != null) await new Promise((resolve) => server.close(resolve));
    });

    const params = {
        uid: { location: 'path' },
        tag: { location: 'query' },
        'x-trace': { location: 'header' },
        ignored: { location: 'cookie' },
    };

    describe('buildRequest', () => {
        let buildRequest;
        before(async () => {
            ({ buildRequest } = await import('../main/server/mcp/lib/http-client.js'));
        });

        it('places path, repeated query, header and body arguments, and forwards the signature sheet', () => {
            const { url, fetchOptions } = buildRequest('post', '/api/data/{uid}', {
                uid: 'a b', tag: ['x', 'y'], 'x-trace': 7, ignored: 'z', body: { name: 'n' },
            }, params, { baseUrl, signatureSheet: '[{"sig":1}]' });
            assert.strictEqual(url, baseUrl + '/data/a%20b?tag=x&tag=y');
            assert.strictEqual(fetchOptions.method, 'POST');
            assert.strictEqual(fetchOptions.headers['x-trace'], '7');
            assert.strictEqual(fetchOptions.headers.signatureSheet, '[{"sig":1}]');
            assert.strictEqual(fetchOptions.headers['Content-Type'], 'application/json');
            assert.strictEqual(fetchOptions.body, '{"name":"n"}');
            assert.notProperty(fetchOptions.headers, 'ignored');
        });

        it('sends a string body as it is', () => {
            const { fetchOptions } = buildRequest('put', '/api/data/{uid}', { uid: 'u', body: 'raw' }, params, { baseUrl });
            assert.strictEqual(fetchOptions.body, 'raw');
        });

        it('never sends a body with GET or HEAD', () => {
            for (const method of ['get', 'head']) {
                const { fetchOptions } = buildRequest(method, '/api/data/{uid}', { uid: 'u', body: { a: 1 } }, params, { baseUrl });
                assert.notProperty(fetchOptions, 'body', method);
            }
        });

        it('skips null and undefined arguments', () => {
            const { url, fetchOptions } = buildRequest('get', '/api/data/{uid}', { uid: 'u', tag: null, 'x-trace': undefined }, params, { baseUrl });
            assert.strictEqual(url, baseUrl + '/data/u');
            assert.notProperty(fetchOptions.headers, 'x-trace');
        });
    });

    describe('callCass with debug logging', () => {
        let callCass;
        let errors;
        let savedError;
        const saved = {};

        before(async () => {
            for (const k of ['CASS_DEBUG', 'CASS_DEBUG_BODY_LENGTH']) saved[k] = process.env[k];
            process.env.CASS_DEBUG = 'true';
            process.env.CASS_DEBUG_BODY_LENGTH = '5';
            // A query string loads a fresh copy of the module, which reads these at load time.
            ({ callCass } = await import('../main/server/mcp/lib/http-client.js?debug-' + Date.now()));
        });

        after(() => {
            for (const [k, v] of Object.entries(saved)) {
                if (v === undefined) delete process.env[k];
                else process.env[k] = v;
            }
        });

        beforeEach(() => {
            errors = [];
            savedError = console.error;
            console.error = (...args) => { errors.push(args.join(' ')); };
        });

        afterEach(() => { console.error = savedError; });

        it('returns the status and body, and logs the request and a truncated response', async () => {
            const result = await callCass('post', '/api/data/{uid}', { uid: 'u1', body: { name: 'a long name' } }, params, { baseUrl });
            console.error = savedError;
            assert.strictEqual(result.status, 200);
            assert.deepEqual(JSON.parse(result.body), { echoed: '/api/data/u1', size: 22 });
            assert.strictEqual(requests[0].body, '{"name":"a long name"}');
            assert.isTrue(errors.some((e) => e.includes('[cass-mcp:http]') && e.includes('→ POST ' + baseUrl + '/data/u1')));
            assert.isTrue(errors.some((e) => e.includes('Headers:')));
            assert.isTrue(errors.some((e) => e.includes('Body: {"nam… (22 bytes total)')));
            assert.isTrue(errors.some((e) => e.includes('← 200 OK')));
            assert.isTrue(errors.some((e) => e.includes('Body: {"ech… (')));
        });

        it('logs short bodies whole and passes error statuses through', async () => {
            const result = await callCass('post', '/api/missing/{uid}', { uid: 'u', body: 'abc' }, params, { baseUrl });
            console.error = savedError;
            assert.strictEqual(result.status, 404);
            assert.isTrue(errors.some((e) => e.endsWith('Body: abc')));
        });

        it('logs and rethrows a network error', async () => {
            const closed = http.createServer();
            await new Promise((resolve) => closed.listen(0, '127.0.0.1', resolve));
            const port = closed.address().port;
            await new Promise((resolve) => closed.close(resolve));
            let thrown = null;
            try {
                await callCass('get', '/api/ping', {}, params, { baseUrl: 'http://127.0.0.1:' + port + '/api' });
            } catch (e) {
                thrown = e;
            }
            console.error = savedError;
            assert.isNotNull(thrown);
            assert.isTrue(errors.some((e) => e.includes('NETWORK ERROR')));
        });
    });
});
