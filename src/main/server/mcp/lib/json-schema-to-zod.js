/**
 * Converts JSON Schema property objects into Zod schemas.
 *
 * The MCP SDK requires Zod schemas for tool input validation.
 * This module bridges our OpenAPI-derived JSON Schema definitions
 * to Zod runtime schemas.
 */

import { z } from 'zod';

/**
 * Convert a JSON Schema property definition to a Zod schema.
 *
 * @param {Object} jsonSchema - A JSON Schema property definition.
 * @returns {import('zod').ZodTypeAny}
 */
function jsonSchemaToZod(jsonSchema) {
    if (!jsonSchema) return z.any();

    const type = jsonSchema.type;

    switch (type) {
    case 'string': {
        let schema = z.string();
        if (jsonSchema.description) schema = schema.describe(jsonSchema.description);
        if (jsonSchema.enum) schema = z.enum(jsonSchema.enum).describe(jsonSchema.description || '');
        return schema;
    }
    case 'integer':
    case 'number': {
        let schema = z.number();
        if (jsonSchema.description) schema = schema.describe(jsonSchema.description);
        return schema;
    }
    case 'boolean': {
        let schema = z.boolean();
        if (jsonSchema.description) schema = schema.describe(jsonSchema.description);
        return schema;
    }
    case 'array': {
        const itemSchema = jsonSchema.items ? jsonSchemaToZod(jsonSchema.items) : z.any();
        let schema = z.array(itemSchema);
        if (jsonSchema.description) schema = schema.describe(jsonSchema.description);
        return schema;
    }
    case 'object': {
        if (jsonSchema.properties) {
            const shape = {};
            for (const [key, propDef] of Object.entries(jsonSchema.properties)) {
                shape[key] = jsonSchemaToZod(propDef).optional();
            }
            // Make required properties non-optional
            if (jsonSchema.required) {
                for (const reqKey of jsonSchema.required) {
                    if (shape[reqKey]) {
                        // Unwrap the optional and replace with the required version
                        shape[reqKey] = jsonSchemaToZod(jsonSchema.properties[reqKey]);
                    }
                }
            }
            let schema = z.object(shape);
            if (jsonSchema.description) schema = schema.describe(jsonSchema.description);
            return schema;
        }
        let schema = z.record(z.string(), z.any());
        if (jsonSchema.description) schema = schema.describe(jsonSchema.description);
        return schema;
    }
    default:
        return z.any().describe(jsonSchema.description || '');
    }
}

/**
 * Convert a tool's inputSchema (JSON Schema with properties) into
 * a Zod object shape suitable for McpServer.tool().
 *
 * The MCP SDK expects a flat Zod shape object { key: ZodType, ... },
 * not a z.object() wrapper.
 *
 * @param {Object} inputSchema - JSON Schema with `properties` and optional `required`.
 * @returns {Object} A Zod shape object: { paramName: ZodType, ... }
 */
export function inputSchemaToZodShape(inputSchema) {
    if (!inputSchema || !inputSchema.properties) return {};

    const shape = {};
    const required = new Set(inputSchema.required || []);

    for (const [key, propSchema] of Object.entries(inputSchema.properties)) {
        let zodSchema = jsonSchemaToZod(propSchema);
        if (!required.has(key)) {
            zodSchema = zodSchema.optional();
        }
        shape[key] = zodSchema;
    }

    return shape;
}
