const { assert } = require('chai');
require('cassproject');
const { Readable } = require('stream');
if (process.env.NODEV == null)
{

    describe('shims/levr.js', function () {
        it('exposes a getStream that reads a stream to a string', async () => {
            const { getStream } = require('../main/server/shims/levr');
            assert.typeOf(getStream, 'function', 'levr.js must expose a callable getStream');
            const text = await getStream(Readable.from(['hello ', 'world']));
            assert.strictEqual(text, 'hello world');
        });

        it('explains permission errors when writing configuration files', () => {
            const { explainWriteError } = require('../main/server/shims/levr');
            const denied = Object.assign(new Error("EACCES: permission denied, open 'etc/skyId.salt'"), { code: 'EACCES' });
            const explained = explainWriteError(denied, 'etc/skyId.salt');
            assert.strictEqual(explained.code, 'EACCES');
            assert.strictEqual(explained.cause, denied);
            assert.include(explained.message, require('path').resolve('etc/skyId.salt'));
            assert.include(explained.message, 'must be writable by the user CaSS runs as');
            assert.include(explained.message, 'fsGroup');
        });

        it('leaves other write errors unchanged', () => {
            const { explainWriteError } = require('../main/server/shims/levr');
            const missing = Object.assign(new Error('ENOENT'), { code: 'ENOENT' });
            assert.strictEqual(explainWriteError(missing, 'etc/x'), missing);
        });
    });

    // bindWebService binds onto global.app, so these cases bind onto a fresh express app of their own and talk
    // to it over HTTP.
    describe('shims/levr.js bindWebService request bodies and errors', function () {
        const express = require('express');
        const testApp = express();
        let server;
        let base;
        let calls;
        let unhandled;
        const onUnhandled = (reason) => { unhandled.push(reason); };

        const bind = (endpoint, handler) => {
            const realApp = global.app;
            global.app = testApp;
            try {
                global.bindWebService(endpoint, handler);
            } finally {
                global.app = realApp;
            }
        };

        before(async () => {
            bind('/levrtest/echo', async function () {
                calls++;
                return JSON.stringify({ body: this.dataStreams?.body ?? null, fields: Object.keys(this.dataStreams || {}) });
            });
            bind('/levrtest/forbidden', async function () {
                calls++;
                error('Not allowed.', 403);
            });
            bind('/levrtest/stringStatus', async function () {
                calls++;
                error('No such method.', '405');
            });
            bind('/levrtest/plainThrow', async function () {
                calls++;
                throw new Error('boom');
            });
            bind('/levrtest/throwNothing', async function () {
                calls++;
                throw undefined;
            });
            bind('/levrtest/endsThenThrows', async function () {
                calls++;
                this.ctx.res.end('done');
                error('Too late to answer.', 400);
            });
            bind('/levrtest/endsThenReturns', async function () {
                calls++;
                this.ctx.res.end('done');
                return 'ignored';
            });
            await new Promise((resolve) => { server = testApp.listen(0, '127.0.0.1', resolve); });
            base = `http://127.0.0.1:${server.address().port}${global.baseUrl || ''}/api`;
            process.on('unhandledRejection', onUnhandled);
        });

        after(async () => {
            process.removeListener('unhandledRejection', onUnhandled);
            await new Promise((resolve) => server.close(resolve));
        });

        beforeEach(() => {
            calls = 0;
            unhandled = [];
        });

        afterEach(async () => {
            await new Promise((resolve) => setTimeout(resolve, 50)); // let a stray rejection surface
            assert.deepEqual(unhandled, [], 'the request left an unhandled rejection');
        });

        const send = async (path, { method = 'POST', type = 'application/json', body } = {}) => {
            const response = await fetch(base + path, { method, headers: type ? { 'Content-Type': type } : {}, body });
            return { status: response.status, text: await response.text() };
        };

        it('answers 400 to a JSON POST whose body is not JSON, without calling the handler', async () => {
            const r = await send('/levrtest/echo', { body: '{' });
            assert.strictEqual(r.status, 400);
            assert.strictEqual(r.text, 'Request body is not valid JSON.');
            assert.strictEqual(calls, 0);
        });

        it('answers 400 to a PUT whose body is not JSON', async () => {
            const r = await send('/levrtest/echo', { method: 'PUT', type: 'text/plain', body: 'not json' });
            assert.strictEqual(r.status, 400);
            assert.strictEqual(calls, 0);
        });

        it('passes a valid JSON body to the handler', async () => {
            const r = await send('/levrtest/echo', { body: JSON.stringify({ a: 1 }) });
            assert.strictEqual(r.status, 200);
            assert.deepEqual(JSON.parse(r.text).body, { a: 1 });
        });

        it('calls the handler for an empty JSON POST', async () => {
            const r = await send('/levrtest/echo', { body: '' });
            assert.strictEqual(r.status, 200);
            assert.strictEqual(JSON.parse(r.text).body, null);
        });

        it("answers a JSON POST with the status of the handler's error()", async () => {
            const r = await send('/levrtest/forbidden', { body: '{}' });
            assert.strictEqual(r.status, 403);
            assert.strictEqual(r.text, 'Not allowed.');
        });

        it('accepts a numeric string as an error status', async () => {
            assert.strictEqual((await send('/levrtest/stringStatus', { body: '{}' })).status, 405);
            assert.strictEqual((await send('/levrtest/stringStatus', { method: 'GET', type: null })).status, 405);
            assert.strictEqual((await send('/levrtest/stringStatus', { method: 'DELETE', type: null })).status, 405);
        });

        it('answers 500 when a JSON handler throws an Error or nothing at all', async () => {
            const thrown = await send('/levrtest/plainThrow', { body: '{}' });
            assert.strictEqual(thrown.status, 500);
            assert.include(thrown.text, 'boom');
            assert.strictEqual((await send('/levrtest/throwNothing', { body: '{}' })).status, 500);
            assert.strictEqual((await send('/levrtest/throwNothing', { method: 'GET', type: null })).status, 500);
        });

        it('keeps the response a handler already ended, whether it then throws or returns', async () => {
            for (const path of ['/levrtest/endsThenThrows', '/levrtest/endsThenReturns']) {
                const json = await send(path, { body: '{}' });
                assert.strictEqual(json.status, 200, path);
                assert.strictEqual(json.text, 'done', path);
                const multipart = new FormData();
                multipart.append('a', 'b');
                const posted = await fetch(base + path, { method: 'POST', body: multipart });
                assert.strictEqual(posted.status, 200, path);
                assert.strictEqual(await posted.text(), 'done', path);
            }
        });

        it('answers 413 to a JSON body larger than POST_MAX_SIZE, without calling the handler', async () => {
            const limit = global.postMaxSize;
            global.postMaxSize = 1024;
            try {
                const r = await send('/levrtest/echo', { body: JSON.stringify({ pad: 'x'.repeat(4096) }) });
                assert.strictEqual(r.status, 413);
                assert.strictEqual(calls, 0);
                assert.strictEqual((await send('/levrtest/echo', { body: JSON.stringify({ pad: 'x'.repeat(100) }) })).status, 200);
            } finally {
                global.postMaxSize = limit;
            }
        });

        it('answers 400 to a truncated multipart body, without calling the handler', async () => {
            const body = '--xyz\r\nContent-Disposition: form-data; name="a"\r\n\r\nhello';
            const r = await send('/levrtest/echo', { type: 'multipart/form-data; boundary=xyz', body });
            assert.strictEqual(r.status, 400);
            assert.strictEqual(r.text, 'Request body is not valid multipart form data.');
            assert.strictEqual(calls, 0);
        });

        it('answers 400 to a multipart body cut off inside a file part', async () => {
            const body = '--xyz\r\nContent-Disposition: form-data; name="f"; filename="f.txt"\r\nContent-Type: text/plain\r\n\r\npartial file';
            const r = await send('/levrtest/echo', { type: 'multipart/form-data; boundary=xyz', body });
            assert.strictEqual(r.status, 400);
            assert.strictEqual(calls, 0);
        });

        it('still passes well-formed multipart fields and files to the handler', async () => {
            const form = new FormData();
            form.append('field', 'value');
            form.append('file', new Blob(['contents']), 'f.txt');
            const response = await fetch(base + '/levrtest/echo', { method: 'POST', body: form });
            assert.strictEqual(response.status, 200);
            assert.sameMembers(JSON.parse(await response.text()).fields, ['field', 'file']);
        });

        it("answers a multipart POST with the status of the handler's error()", async () => {
            const form = new FormData();
            form.append('a', 'b');
            const response = await fetch(base + '/levrtest/forbidden', { method: 'POST', body: form });
            assert.strictEqual(response.status, 403);
        });
    });
}
