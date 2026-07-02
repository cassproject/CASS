/**
 * MCP Adapter — Unit tests for openapi-to-tools.js
 *
 * Tests the OpenAPI spec → MCP tool definition converter,
 * including name generation, $ref resolution, parameter mapping,
 * and resource template generation.
 *
 * These tests are pure unit tests that do NOT require the CaSS
 * server to be running — they test the converter logic directly.
 */

const chai = require('chai');
const assert = chai.assert;
const fs = require('fs');
const path = require('path');

let generateTools, generateResourceTemplates;
let spec;

describe('MCP Adapter — OpenAPI Tool Generation', function () {
    this.timeout(30000);

    before(async () => {
        const mod = await import('../main/server/mcp/lib/openapi-to-tools.js');
        generateTools = mod.generateTools;
        generateResourceTemplates = mod.generateResourceTemplates;

        const BASE = process.env.CASS_LOOPBACK || 'http://localhost/api/';
        if (process.env.NODEV == null && global.events && global.events.server) {
            let ready = false;
            global.events.server.ready.subscribe((isReady) => {
                if (isReady) ready = true;
            });
            while (!ready) { await new Promise((resolve) => setTimeout(resolve, 100)); }
        }

        const res = await fetch(`${BASE.replace(/\/$/, '')}/swagger.json`);
        spec = await res.json();
    });

    // ── Full spec ─────────────────────────────────────────────────────────

    describe('Full spec parsing', () => {
        let tools;
        let toolMap;

        before(() => {
            tools = generateTools(spec);
            toolMap = new Map(tools.map(t => [t.name, t]));
        });

        it('generates exactly 6 tools from the current spec', () => {
            assert.strictEqual(tools.length, 6, `Expected 6 tools, got ${tools.length}: ${tools.map(t => t.name).join(', ')}`);
        });

        it('produces unique tool names', () => {
            const names = tools.map(t => t.name);
            const unique = new Set(names);
            assert.strictEqual(names.length, unique.size, 'Duplicate tool names found');
        });

        it('every tool has required fields', () => {
            for (const tool of tools) {
                assert.ok(tool.name, 'Missing name');
                assert.ok(tool.description, `Missing description on ${tool.name}`);
                assert.ok(tool.method, `Missing method on ${tool.name}`);
                assert.ok(tool.pathTemplate, `Missing pathTemplate on ${tool.name}`);
                assert.isObject(tool.parameterMap, `Missing parameterMap on ${tool.name}`);
                assert.ok(tool.inputSchema, `Missing inputSchema on ${tool.name}`);
                assert.strictEqual(tool.inputSchema.type, 'object');
            }
        });

        it('generates server_status for GET /api/ping', () => {
            assert.isTrue(toolMap.has('server_status'), 'Expected tool name server_status from x-mcp-tool-name');
            const ping = toolMap.get('server_status');
            assert.strictEqual(ping.method, 'get');
            assert.strictEqual(ping.pathTemplate, '/api/ping');
            assert.ok(ping.parameterMap.fields, 'Expected fields parameter in parameterMap');
            assert.strictEqual(ping.parameterMap.fields.location, 'query');
            assert.ok(ping.inputSchema.properties.fields, 'Expected fields in inputSchema properties');
            assert.ok(ping.annotations, 'Expected annotations on server_status tool');
            assert.strictEqual(ping.annotations.readOnlyHint, true);
            assert.strictEqual(ping.annotations.destructiveHint, false);
            assert.strictEqual(ping.annotations.idempotentHint, true);
            assert.strictEqual(ping.annotations.openWorldHint, false);
        });

        it('generates search_data for GET /api/data/', () => {
            assert.isTrue(toolMap.has('search_data'), 'Expected tool name search_data from x-mcp-tool-name');
            const t = toolMap.get('search_data');
            assert.strictEqual(t.method, 'get');
            assert.strictEqual(t.pathTemplate, '/api/data/');
            // Should have search parameters from $ref resolution
            assert.ok(t.parameterMap.q, 'Expected q parameter');
            assert.ok(t.parameterMap.start, 'Expected start parameter');
            assert.ok(t.parameterMap.size, 'Expected size parameter');
            assert.ok(t.parameterMap.index_hint, 'Expected index_hint parameter');
            // Should have x-mcp-description with Elasticsearch guidance
            assert.ok(t.description.includes('CaSS repository'), 'search_data description should mention CaSS repository');
            assert.ok(t.description.includes('Hints:'), 'search_data should have Hints section');
            // Annotations for GET
            assert.strictEqual(t.annotations.readOnlyHint, true);
            assert.strictEqual(t.annotations.idempotentHint, true);
        });

        it('generates get_object for GET /api/data/{uid}', () => {
            assert.isTrue(toolMap.has('get_object'), 'Expected tool name get_object from x-mcp-tool-name');
            const t = toolMap.get('get_object');
            assert.strictEqual(t.method, 'get');
            assert.strictEqual(t.pathTemplate, '/api/data/{uid}');
            assert.ok(t.parameterMap.uid, 'Expected uid parameter');
            assert.strictEqual(t.parameterMap.uid.location, 'path');
            assert.ok(t.parameterMap.history, 'Expected history parameter');
            assert.strictEqual(t.parameterMap.history.location, 'query');
            assert.deepInclude(t.inputSchema.required, 'uid');
            assert.strictEqual(t.annotations.readOnlyHint, true);
        });

        it('generates save_object for POST /api/data/{uid}', () => {
            assert.isTrue(toolMap.has('save_object'), 'Expected tool name save_object from x-mcp-tool-name');
            const t = toolMap.get('save_object');
            assert.strictEqual(t.method, 'post');
            assert.strictEqual(t.pathTemplate, '/api/data/{uid}');
            assert.ok(t.parameterMap.uid, 'Expected uid parameter');
            assert.deepInclude(t.inputSchema.required, 'uid');
            // POST annotation defaults
            assert.strictEqual(t.annotations.readOnlyHint, false);
            assert.strictEqual(t.annotations.idempotentHint, false);
        });

        it('generates record_evidence for POST /api/xapi/statement', () => {
            assert.isTrue(toolMap.has('record_evidence'), 'Expected tool name record_evidence from x-mcp-tool-name');
            const t = toolMap.get('record_evidence');
            assert.strictEqual(t.method, 'post');
            assert.strictEqual(t.pathTemplate, '/api/xapi/statement');
            assert.ok(t.inputSchema.properties.body, 'record_evidence should have body in inputSchema');
            assert.deepInclude(t.inputSchema.required, 'body');
            // Description should contain xAPI guidance
            assert.ok(t.description.includes('evidence'), 'record_evidence description should mention evidence');
            assert.ok(t.description.includes('Hints:'), 'record_evidence should have Hints section');
            assert.strictEqual(t.annotations.readOnlyHint, false);
        });

        it('generates get_learner_profile for GET /api/profile/latest', () => {
            assert.isTrue(toolMap.has('get_learner_profile'), 'Expected tool name get_learner_profile from x-mcp-tool-name');
            const t = toolMap.get('get_learner_profile');
            assert.strictEqual(t.method, 'get');
            assert.strictEqual(t.pathTemplate, '/api/profile/latest');
            assert.ok(t.parameterMap.frameworkId, 'Expected frameworkId parameter');
            assert.ok(t.parameterMap.subject, 'Expected subject parameter');
            assert.ok(t.parameterMap.flushCache, 'Expected flushCache parameter');
            assert.ok(t.parameterMap.cache, 'Expected cache parameter');
            assert.ok(t.parameterMap.targetDateTime, 'Expected targetDateTime parameter');
            // Description should contain profile guidance
            assert.ok(t.description.includes('competency'), 'get_learner_profile description should mention competency');
            assert.ok(t.description.includes('Hints:'), 'get_learner_profile should have Hints section');
            assert.strictEqual(t.annotations.readOnlyHint, true);
            assert.strictEqual(t.annotations.idempotentHint, true);
        });

        it('excludes x-mcp-ignore endpoints from tool generation', () => {
            // POST /api/data/ (search POST), POST /api/xapi/tick, GET /api/xapi/pk,
            // POST /api/xapi/statements, GET /api/xapi/endpoint,
            // and /api/data/{type}/{uid} variants are all x-mcp-ignore: true
            const ignoredNames = ['post_data', 'post_xapi_tick', 'get_xapi_pk',
                'post_xapi_statements', 'get_xapi_endpoint',
                'get_data_by_type_and_uid', 'post_data_by_type_and_uid',
                'get_data_by_type_uid_and_version'];
            for (const name of ignoredNames) {
                assert.isFalse(toolMap.has(name), `${name} should be excluded by x-mcp-ignore`);
            }
        });

        it('resolves $ref parameters on search_data', () => {
            const t = toolMap.get('search_data');
            assert.ok(t, 'Missing search_data');
            const paramNames = Object.keys(t.parameterMap);
            assert.isAbove(paramNames.length, 0);
            for (const name of paramNames) {
                assert.ok(t.parameterMap[name].location, `Param ${name} should have location`);
            }
        });
    });

    // ── Name generation ───────────────────────────────────────────────────

    describe('Name generation', () => {
        it('converts camelCase path segments to snake_case', () => {
            const tools = generateTools({
                openapi: '3.0.0', info: { title: 'T', version: '1' },
                paths: { '/api/util/cullFast': { post: { summary: 'Fast cull' } } },
            });
            assert.strictEqual(tools[0].name, 'post_util_cull_fast');
        });

        it('appends _by_param for path parameters', () => {
            const tools = generateTools({
                openapi: '3.0.0', info: { title: 'T', version: '1' },
                paths: { '/api/badge/assertion/{id}': { get: {
                    summary: 'Get badge',
                    parameters: [{ name: 'id', in: 'path', schema: { type: 'string' } }],
                } } },
            });
            assert.strictEqual(tools[0].name, 'get_badge_assertion_by_id');
        });

        it('handles multiple path parameters', () => {
            const tools = generateTools({
                openapi: '3.0.0', info: { title: 'T', version: '1' },
                paths: { '/api/data/{type}/{uid}': { get: {
                    summary: 'Get data',
                    parameters: [
                        { name: 'type', in: 'path', schema: { type: 'string' } },
                        { name: 'uid', in: 'path', schema: { type: 'string' } },
                    ],
                } } },
            });
            assert.strictEqual(tools[0].name, 'get_data_by_type_and_uid');
        });
    });

    // ── Parameter mapping ─────────────────────────────────────────────────

    describe('Parameter mapping', () => {
        it('categorizes path, query, and header params correctly', () => {
            const tools = generateTools({
                openapi: '3.0.0', info: { title: 'T', version: '1' },
                paths: { '/api/test/{id}': { get: {
                    summary: 'Test',
                    parameters: [
                        { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
                        { name: 'q', in: 'query', schema: { type: 'string' } },
                        { name: 'X-Custom', in: 'header', schema: { type: 'string' } },
                    ],
                } } },
            });
            const t = tools[0];
            assert.strictEqual(t.parameterMap.id.location, 'path');
            assert.strictEqual(t.parameterMap.q.location, 'query');
            assert.strictEqual(t.parameterMap['X-Custom'].location, 'header');
        });

        it('marks required params in inputSchema', () => {
            const tools = generateTools({
                openapi: '3.0.0', info: { title: 'T', version: '1' },
                paths: { '/api/test': { get: {
                    summary: 'Test',
                    parameters: [
                        { name: 'q', in: 'query', required: true, schema: { type: 'string' } },
                        { name: 'page', in: 'query', schema: { type: 'integer' } },
                    ],
                } } },
            });
            assert.deepStrictEqual(tools[0].inputSchema.required, ['q']);
        });

        it('resolves $ref parameters from components', () => {
            const tools = generateTools({
                openapi: '3.0.0', info: { title: 'T', version: '1' },
                components: { parameters: { searchQuery: { name: 'q', in: 'query', schema: { type: 'string' } } } },
                paths: { '/api/search': { get: {
                    summary: 'Search',
                    parameters: [{ '$ref': '#/components/parameters/searchQuery' }],
                } } },
            });
            assert.strictEqual(tools[0].parameterMap.q.location, 'query');
            assert.ok(tools[0].inputSchema.properties.q);
        });
    });

    // ── x-mcp-* extension support ─────────────────────────────────────────

    describe('x-mcp extensions', () => {
        it('x-mcp-tool-name overrides auto-generated name', () => {
            const tools = generateTools({
                openapi: '3.0.0', info: { title: 'T', version: '1' },
                paths: { '/api/some/endpoint': { get: {
                    summary: 'Some endpoint',
                    'x-mcp-tool-name': 'custom_tool_name',
                } } },
            });
            assert.strictEqual(tools[0].name, 'custom_tool_name');
        });

        it('falls back to auto-generated name when x-mcp-tool-name absent', () => {
            const tools = generateTools({
                openapi: '3.0.0', info: { title: 'T', version: '1' },
                paths: { '/api/some/endpoint': { get: {
                    summary: 'Some endpoint',
                } } },
            });
            assert.strictEqual(tools[0].name, 'get_some_endpoint');
        });

        it('x-mcp-description replaces summary/description in tool description', () => {
            const tools = generateTools({
                openapi: '3.0.0', info: { title: 'T', version: '1' },
                paths: { '/api/test': { get: {
                    summary: 'Original summary',
                    description: 'Original description',
                    'x-mcp-description': 'MCP-optimized description for AI callers.',
                } } },
            });
            assert.ok(tools[0].description.startsWith('MCP-optimized description for AI callers.'));
            assert.ok(!tools[0].description.includes('Original summary'));
        });

        it('x-mcp-description preserves Arguments section', () => {
            const tools = generateTools({
                openapi: '3.0.0', info: { title: 'T', version: '1' },
                paths: { '/api/test': { get: {
                    summary: 'Original',
                    'x-mcp-description': 'MCP description.',
                    parameters: [
                        { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Query' },
                    ],
                } } },
            });
            assert.ok(tools[0].description.includes('MCP description.'));
            assert.ok(tools[0].description.includes('Arguments:'));
            assert.ok(tools[0].description.includes('q'));
        });

        it('x-mcp-hints appends hints to description', () => {
            const tools = generateTools({
                openapi: '3.0.0', info: { title: 'T', version: '1' },
                paths: { '/api/test': { get: {
                    summary: 'Test endpoint',
                    'x-mcp-hints': 'Use fields=a,b for minimal response.',
                } } },
            });
            assert.ok(tools[0].description.includes('Hints:'));
            assert.ok(tools[0].description.includes('Use fields=a,b for minimal response.'));
        });

        it('x-mcp-ignore skips the operation', () => {
            const tools = generateTools({
                openapi: '3.0.0', info: { title: 'T', version: '1' },
                paths: { '/api/hidden': { get: {
                    summary: 'Hidden',
                    'x-mcp-ignore': true,
                } } },
            });
            assert.strictEqual(tools.length, 0);
        });

        it('infers readOnly + idempotent annotations for GET', () => {
            const tools = generateTools({
                openapi: '3.0.0', info: { title: 'T', version: '1' },
                paths: { '/api/test': { get: { summary: 'Test' } } },
            });
            assert.deepStrictEqual(tools[0].annotations, {
                readOnlyHint: true,
                destructiveHint: false,
                idempotentHint: true,
                openWorldHint: false,
            });
        });

        it('infers destructive annotations for DELETE', () => {
            const tools = generateTools({
                openapi: '3.0.0', info: { title: 'T', version: '1' },
                paths: { '/api/test': { delete: { summary: 'Delete' } } },
            });
            assert.strictEqual(tools[0].annotations.destructiveHint, true);
            assert.strictEqual(tools[0].annotations.readOnlyHint, false);
            assert.strictEqual(tools[0].annotations.idempotentHint, true);
        });

        it('infers non-idempotent annotations for POST', () => {
            const tools = generateTools({
                openapi: '3.0.0', info: { title: 'T', version: '1' },
                paths: { '/api/test': { post: { summary: 'Create' } } },
            });
            assert.strictEqual(tools[0].annotations.readOnlyHint, false);
            assert.strictEqual(tools[0].annotations.idempotentHint, false);
        });

        it('x-mcp-annotations overrides inferred annotations', () => {
            const tools = generateTools({
                openapi: '3.0.0', info: { title: 'T', version: '1' },
                paths: { '/api/test': { post: {
                    summary: 'Idempotent create',
                    'x-mcp-annotations': { idempotentHint: true, openWorldHint: true },
                } } },
            });
            // POST defaults overridden by x-mcp-annotations
            assert.strictEqual(tools[0].annotations.idempotentHint, true);
            assert.strictEqual(tools[0].annotations.openWorldHint, true);
            // Non-overridden values retain POST defaults
            assert.strictEqual(tools[0].annotations.readOnlyHint, false);
            assert.strictEqual(tools[0].annotations.destructiveHint, false);
        });
    });

    // ── Resource templates ────────────────────────────────────────────────

    describe('Resource templates', () => {
        let templates;

        before(() => {
            templates = generateResourceTemplates(spec);
        });

        it('generates resource templates', () => {
            assert.isAtLeast(templates.length, 3);
        });

        it('includes typed JSON-LD resource template', () => {
            const typed = templates.find(t => t.uriTemplate === 'cass://data/{type}/{uid}');
            assert.ok(typed, 'Missing cass://data/{type}/{uid} template');
            assert.strictEqual(typed.mimeType, 'application/ld+json');
        });

        it('includes versioned resource template', () => {
            assert.ok(templates.find(t => t.uriTemplate === 'cass://data/{type}/{uid}/{version}'));
        });

        it('includes UID-only resource template', () => {
            assert.ok(templates.find(t => t.uriTemplate === 'cass://data/{uid}'));
        });
    });
});
