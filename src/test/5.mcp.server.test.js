/**
 * MCP Adapter — End-to-end tests for the /api/mcp endpoint.
 *
 * Exercises the MCP Streamable HTTP transport (SDK v2) against the
 * running CaSS server: initialize handshake with session management,
 * tools/list, tools/call (loopback to the REST API), resource
 * templates, and session termination.
 */

const chai = require('chai');
const assert = chai.assert;

const CASS_LOOPBACK = process.env.CASS_LOOPBACK || 'http://localhost/api/';
const MCP_URL = CASS_LOOPBACK.replace(/\/$/, '') + '/mcp';

describe('MCP Adapter — Streamable HTTP server', function () {
    this.timeout(60000);

    let sessionId;
    let nextId = 1;

    it('Waiting for server to be ready', async () => {
        if (process.env.NODEV != null) return;
        if (!global.events || !global.events.server) return;
        let ready = false;
        global.events.server.ready.subscribe((isReady) => {
            if (isReady) ready = true;
        });
        while (!ready) { await new Promise((resolve) => setTimeout(resolve, 100)); }
        // The MCP adapter mounts asynchronously after server.ready — poll until it responds.
        for (let i = 0; i < 100; i++) {
            const res = await fetch(MCP_URL, { method: 'GET' });
            await res.text();
            if (res.status != 404) return;
            await new Promise((resolve) => setTimeout(resolve, 200));
        }
        assert.fail('MCP endpoint never became available');
    });

    /**
     * Helper: send a JSON-RPC message to /api/mcp. Parses both
     * application/json and text/event-stream (SSE) response bodies.
     */
    async function rpc(method, params, opts) {
        const isNotification = opts && opts.notification;
        const message = { jsonrpc: '2.0', method };
        if (!isNotification) message.id = nextId++;
        if (params !== undefined) message.params = params;

        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/event-stream',
        };
        if (sessionId) headers['Mcp-Session-Id'] = sessionId;

        const res = await fetch(MCP_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify(message),
        });

        if (res.headers.get('mcp-session-id')) {
            sessionId = res.headers.get('mcp-session-id');
        }

        const bodyText = await res.text();
        if (isNotification) return { status: res.status, body: null };

        assert.isTrue(res.status < 400, `MCP ${method} returned HTTP ${res.status}: ${bodyText}`);

        const contentType = res.headers.get('content-type') || '';
        let payload;
        if (contentType.includes('text/event-stream')) {
            // Extract the last data: line of the SSE stream.
            const dataLines = bodyText.split('\n').filter((l) => l.startsWith('data:'));
            assert.isTrue(dataLines.length > 0, `No SSE data in ${method} response: ${bodyText}`);
            payload = JSON.parse(dataLines[dataLines.length - 1].substring(5).trim());
        } else {
            payload = JSON.parse(bodyText);
        }
        assert.isUndefined(payload.error, `MCP ${method} returned JSON-RPC error: ${JSON.stringify(payload.error)}`);
        return { status: res.status, body: payload };
    }

    it('initialize creates a session', async () => {
        const { body } = await rpc('initialize', {
            protocolVersion: '2025-06-18',
            capabilities: {},
            clientInfo: { name: 'cass-test-client', version: '1.0.0' },
        });
        assert.isDefined(body.result, 'initialize should return a result');
        assert.isDefined(body.result.serverInfo, 'initialize result should include serverInfo');
        assert.strictEqual(body.result.serverInfo.name, 'cass-mcp-server');
        assert.isDefined(sessionId, 'Server should issue an Mcp-Session-Id header');

        await rpc('notifications/initialized', undefined, { notification: true });
    });

    it('tools/list returns generated CaSS tools', async () => {
        const { body } = await rpc('tools/list', {});
        const tools = body.result.tools;
        assert.isArray(tools, 'tools/list should return a tools array');
        assert.isTrue(tools.length > 0, 'Should expose at least one tool');

        const names = tools.map((t) => t.name);
        assert.include(names, 'server_status', 'Named tools from x-mcp-tool-name should be present');
        assert.include(names, 'search_data', 'Named tools from x-mcp-tool-name should be present');
        assert.include(names, 'record_evidence', 'Named tools from x-mcp-tool-name should be present');

        for (const tool of tools) {
            assert.isDefined(tool.inputSchema, `Tool ${tool.name} should have an inputSchema`);
            assert.strictEqual(tool.inputSchema.type, 'object', `Tool ${tool.name} inputSchema should be a JSON Schema object`);
        }
    });

    it('resources/templates/list returns CaSS resource templates', async () => {
        const { body } = await rpc('resources/templates/list', {});
        const templates = body.result.resourceTemplates;
        assert.isArray(templates, 'Should return resourceTemplates array');
        assert.isTrue(templates.length > 0, 'Should expose at least one resource template');
        const uris = templates.map((t) => t.uriTemplate);
        assert.include(uris, 'cass://data/{type}/{uid}', 'JSON-LD object template should be present');
    });

    it('tools/call server_status loops back to the CaSS API', async () => {
        const { body } = await rpc('tools/call', {
            name: 'server_status',
            arguments: {},
        });
        assert.isDefined(body.result, 'tools/call should return a result');
        assert.isFalse(body.result.isError === true, 'server_status should not error: ' + JSON.stringify(body.result.content));
        assert.isArray(body.result.content);
        const text = body.result.content[0].text;
        const parsed = JSON.parse(text);
        assert.strictEqual(parsed.ping, 'pong', 'server_status should return the ping response');
    });

    it('tools/call search_data performs a repository search', async () => {
        const { body } = await rpc('tools/call', {
            name: 'search_data',
            arguments: { q: '*', size: 1 },
        });
        assert.isDefined(body.result, 'tools/call should return a result');
        assert.isFalse(body.result.isError === true, 'search_data should not error: ' + JSON.stringify(body.result.content));
        const text = body.result.content[0].text;
        assert.doesNotThrow(() => JSON.parse(text), 'search_data should return JSON');
    });

    it('tools/call validates input against the tool schema', async () => {
        // 'size' is numeric — passing a non-coercible object should be rejected
        // by the SDK's schema validation, returning a JSON-RPC error.
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/event-stream',
            'Mcp-Session-Id': sessionId,
        };
        const res = await fetch(MCP_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                jsonrpc: '2.0', id: nextId++, method: 'tools/call',
                params: { name: 'search_data', arguments: { q: '*', size: { bogus: true } } },
            }),
        });
        const bodyText = await res.text();
        const contentType = res.headers.get('content-type') || '';
        let payload;
        if (contentType.includes('text/event-stream')) {
            const dataLines = bodyText.split('\n').filter((l) => l.startsWith('data:'));
            payload = JSON.parse(dataLines[dataLines.length - 1].substring(5).trim());
        } else {
            payload = JSON.parse(bodyText);
        }
        assert.isTrue(payload.error != null || payload.result?.isError === true,
            'Invalid arguments should produce an error: ' + bodyText);
    });

    it('DELETE terminates the session', async () => {
        const res = await fetch(MCP_URL, {
            method: 'DELETE',
            headers: { 'Mcp-Session-Id': sessionId },
        });
        await res.text();
        assert.isTrue(res.status < 400, `DELETE should close the session, got HTTP ${res.status}`);

        // Subsequent use of the dead session should be rejected.
        const res2 = await fetch(MCP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/event-stream',
                'Mcp-Session-Id': sessionId,
            },
            body: JSON.stringify({ jsonrpc: '2.0', id: nextId++, method: 'tools/list', params: {} }),
        });
        await res2.text();
        assert.isTrue(res2.status >= 400, 'Requests on a terminated session should fail');
    });
});
