/**
 * MCP Adapter — Unit tests for json-schema-to-zod.js
 *
 * Tests the JSON Schema → Zod schema converter used by the MCP
 * adapter to translate OpenAPI parameter schemas into Zod types.
 */

const chai = require('chai');
const assert = chai.assert;

let inputSchemaToZodShape;

describe('MCP Adapter — JSON Schema to Zod', function () {
    this.timeout(30000);

    before(async () => {
        const mod = await import('../main/server/mcp/lib/json-schema-to-zod.js');
        inputSchemaToZodShape = mod.inputSchemaToZodShape;
    });

    describe('Basic types', () => {
        it('converts string properties', () => {
            const shape = inputSchemaToZodShape({
                type: 'object',
                properties: { name: { type: 'string' } },
                required: ['name'],
            });
            assert.isTrue(shape.name.safeParse('hello').success);
            assert.isFalse(shape.name.safeParse(123).success);
        });

        it('converts number properties', () => {
            const shape = inputSchemaToZodShape({
                type: 'object',
                properties: { count: { type: 'number' } },
            });
            assert.isTrue(shape.count.safeParse(42).success);
        });

        it('converts integer as number', () => {
            const shape = inputSchemaToZodShape({
                type: 'object',
                properties: { page: { type: 'integer' } },
            });
            assert.isTrue(shape.page.safeParse(5).success);
        });

        it('converts boolean properties', () => {
            const shape = inputSchemaToZodShape({
                type: 'object',
                properties: { flag: { type: 'boolean' } },
            });
            assert.isTrue(shape.flag.safeParse(true).success);
        });

        it('converts array properties', () => {
            const shape = inputSchemaToZodShape({
                type: 'object',
                properties: { items: { type: 'array', items: { type: 'string' } } },
            });
            assert.isTrue(shape.items.safeParse(['a', 'b']).success);
        });
    });

    describe('Optionality', () => {
        it('makes non-required properties optional', () => {
            const shape = inputSchemaToZodShape({
                type: 'object',
                properties: { a: { type: 'string' }, b: { type: 'string' } },
                required: ['a'],
            });
            assert.isFalse(shape.a.safeParse(undefined).success);
            assert.isTrue(shape.b.safeParse(undefined).success);
        });

        it('handles empty required array', () => {
            const shape = inputSchemaToZodShape({
                type: 'object',
                properties: { x: { type: 'string' } },
                required: [],
            });
            assert.isTrue(shape.x.safeParse(undefined).success);
        });

        it('handles missing required field', () => {
            const shape = inputSchemaToZodShape({
                type: 'object',
                properties: { x: { type: 'string' } },
            });
            assert.isTrue(shape.x.safeParse(undefined).success);
        });
    });

    describe('Enums', () => {
        it('converts string enums', () => {
            const shape = inputSchemaToZodShape({
                type: 'object',
                properties: { decay: { type: 'string', enum: ['t', 't^2', 'sqrt(t)'] } },
                required: ['decay'],
            });
            assert.isTrue(shape.decay.safeParse('t').success);
            assert.isFalse(shape.decay.safeParse('invalid').success);
        });
    });

    describe('Nested objects', () => {
        it('converts object properties with sub-properties', () => {
            const shape = inputSchemaToZodShape({
                type: 'object',
                properties: {
                    body: {
                        type: 'object',
                        properties: { name: { type: 'string' }, count: { type: 'number' } },
                        required: ['name'],
                    },
                },
            });
            assert.isTrue(shape.body.safeParse({ name: 'test' }).success);
            assert.isFalse(shape.body.safeParse({ count: 5 }).success);
        });
    });

    describe('Edge cases', () => {
        it('returns empty shape for null/undefined input', () => {
            assert.deepStrictEqual(inputSchemaToZodShape(null), {});
            assert.deepStrictEqual(inputSchemaToZodShape(undefined), {});
        });

        it('returns empty shape for schema without properties', () => {
            assert.deepStrictEqual(inputSchemaToZodShape({ type: 'object' }), {});
        });

        it('handles unknown types as z.any()', () => {
            const shape = inputSchemaToZodShape({
                type: 'object',
                properties: { x: { description: 'mystery' } },
            });
            assert.isTrue(shape.x.safeParse('anything').success);
            assert.isTrue(shape.x.safeParse(42).success);
        });
    });
});
