/**
 * MCP Adapter — openapi-to-tools.js edge cases not exercised by the CaSS spec itself.
 *
 * Pure unit tests: no server or network needed.
 */

const { assert } = require('chai');

describe('MCP Adapter — OpenAPI Tool Generation (edge cases)', function () {
    let generateTools;

    before(async () => {
        ({ generateTools } = await import('../main/server/mcp/lib/openapi-to-tools.js'));
    });

    const only = (spec) => {
        const tools = generateTools(spec);
        assert.lengthOf(tools, 1);
        return tools[0];
    };

    it('infers annotations for PUT and PATCH', () => {
        const tools = generateTools({
            paths: {
                '/api/thing': {
                    put: { summary: 'Replace' },
                    patch: { summary: 'Amend' },
                },
            },
        });
        const put = tools.find((t) => t.description.startsWith('Replace'));
        const patch = tools.find((t) => t.description.startsWith('Amend'));
        assert.deepEqual(put.annotations, { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false });
        assert.deepEqual(patch.annotations, { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false });
    });

    it('describes an operation with no summary or description by its method and path', () => {
        const tool = only({ paths: { '/api/bare': { get: {} } } });
        assert.strictEqual(tool.description, 'GET /api/bare');
    });

    it('labels array and enum parameter types in the description', () => {
        const tool = only({
            paths: {
                '/api/labels': {
                    get: {
                        summary: 'Labels',
                        parameters: [
                            { name: 'ids', in: 'query', schema: { type: 'array', items: { type: 'string' } } },
                            { name: 'mode', in: 'query', schema: { enum: ['a', 'b'] } },
                            { name: 'nested', in: 'query', schema: { type: 'array' } },
                        ],
                    },
                },
            },
        });
        assert.include(tool.description, '- ids: array of string');
        assert.include(tool.description, '- mode: string (one of: a, b) [values: a, b]');
        assert.include(tool.description, '- nested: array of any');
    });

    it('skips an unresolvable parameter $ref in the description but fails tool generation on it', () => {
        const spec = {
            paths: {
                '/api/broken': {
                    get: { summary: 'Broken', parameters: [{ $ref: '#/components/parameters/missing' }] },
                },
            },
        };
        assert.throws(() => generateTools(spec), /Cannot resolve \$ref: #\/components\/parameters\/missing/);
    });

    it('documents a request body: description, $ref schema properties and example', () => {
        const tool = only({
            components: {
                schemas: {
                    Payload: {
                        type: 'object',
                        required: ['name'],
                        properties: {
                            name: { type: 'string', description: 'What it is called', example: 'Widget' },
                            count: { type: 'integer' },
                        },
                    },
                },
            },
            paths: {
                '/api/payload': {
                    post: {
                        summary: 'Send',
                        requestBody: {
                            required: true,
                            description: 'The thing to send.',
                            content: {
                                'application/ld+json': {
                                    schema: { $ref: '#/components/schemas/Payload' },
                                    example: { name: 'Widget' },
                                },
                            },
                        },
                    },
                },
            },
        });
        assert.include(tool.description, '- body (required): object — The request payload to send.');
        assert.include(tool.description, '  The thing to send.');
        assert.include(tool.description, '  - name (required): string — What it is called (e.g. "Widget")');
        assert.include(tool.description, '  - count: integer');
        assert.include(tool.description, '  Example: {"name":"Widget"}');
        assert.strictEqual(tool.requestContentType, 'application/ld+json');
        assert.deepEqual(tool.inputSchema.required, ['body']);
        assert.strictEqual(tool.inputSchema.properties.body.type, 'object');
    });

    it('keeps an unresolvable body $ref as-is in the description', () => {
        const spec = {
            paths: {
                '/api/payload': {
                    post: {
                        summary: 'Send',
                        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Gone' } } } },
                    },
                },
            },
        };
        // The description tolerates it; building the input schema does not.
        assert.throws(() => generateTools(spec), /Cannot resolve \$ref/);
    });

    it('chooses the request content type: JSON first, then the first one listed', () => {
        const contentType = (content) => only({
            paths: { '/api/x': { post: { summary: 'X', requestBody: { content } } } },
        }).requestContentType;
        assert.strictEqual(contentType({ 'text/plain': {}, 'application/json': { schema: { type: 'object' } } }), 'application/json');
        assert.strictEqual(contentType({ 'text/csv': {}, 'text/plain': {} }), 'text/csv');
        assert.strictEqual(contentType({ 'multipart/form-data': {}, 'application/json': {} }), 'multipart/form-data');
    });

    it('x-mcp-description with hints but no arguments keeps the hints', () => {
        const tool = only({
            paths: {
                '/api/hinted': {
                    get: { 'x-mcp-description': '  Hinted.  ', 'x-mcp-hints': '  Use sparingly. ' },
                },
            },
        });
        assert.strictEqual(tool.description, 'Hinted.\nHints:\nUse sparingly.');
    });

    it('x-mcp-description alone is the whole description', () => {
        const tool = only({ paths: { '/api/plain': { get: { 'x-mcp-description': 'Plain.' } } } });
        assert.strictEqual(tool.description, 'Plain.');
    });
});
