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

const specPath = path.resolve(__dirname, '..', '..', 'swaggerx.json');
const spec = JSON.parse(fs.readFileSync(specPath, 'utf-8'));

describe('MCP Adapter — OpenAPI Tool Generation', function () {
    this.timeout(30000);

    before(async () => {
        const mod = await import('../main/server/mcp/lib/openapi-to-tools.js');
        generateTools = mod.generateTools;
        generateResourceTemplates = mod.generateResourceTemplates;
    });

    // ── Full spec ─────────────────────────────────────────────────────────

    describe('Full spec parsing', () => {
        let tools;
        let toolMap;

        before(() => {
            tools = generateTools(spec);
            toolMap = new Map(tools.map(t => [t.name, t]));
        });

        it('generates tools for all path+method combinations', () => {
            assert.isAtLeast(tools.length, 73, `Expected >= 73 tools, got ${tools.length}`);
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

        it('generates get_ping for GET /api/ping', () => {
            assert.isTrue(toolMap.has('get_ping'));
            const ping = toolMap.get('get_ping');
            assert.strictEqual(ping.method, 'get');
            assert.strictEqual(ping.pathTemplate, '/api/ping');
        });

        it('generates get_framework_list with correct metadata', () => {
            assert.isTrue(toolMap.has('get_framework_list'));
            const fw = toolMap.get('get_framework_list');
            assert.strictEqual(fw.method, 'get');
            assert.strictEqual(fw.pathTemplate, '/api/framework/list');
            assert.isAbove(fw.description.length, 0);
        });

        it('generates get_data_by_type_and_uid for parameterized path', () => {
            assert.isTrue(toolMap.has('get_data_by_type_and_uid'));
            const t = toolMap.get('get_data_by_type_and_uid');
            assert.strictEqual(t.pathTemplate, '/api/data/{type}/{uid}');
        });

        it('handles POST endpoints with requestBody', () => {
            assert.isTrue(toolMap.has('post_sky_id_create'));
            const t = toolMap.get('post_sky_id_create');
            assert.strictEqual(t.method, 'post');
            assert.ok(t.inputSchema.properties.body, 'POST tool should have body in inputSchema');
        });

        it('resolves $ref parameters', () => {
            const t = toolMap.get('get_sky_repo_search');
            assert.ok(t, 'Missing get_sky_repo_search');
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
