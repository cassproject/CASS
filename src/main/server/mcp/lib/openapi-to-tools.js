/**
 * OpenAPI 3.0 specification → MCP tool definitions converter.
 *
 * Parses a CaSS OpenAPI spec (swaggerx.json) and produces an array of
 * tool descriptors that can be registered with the MCP server.
 *
 * Each path + HTTP method combination becomes one tool.
 */

const HTTP_METHODS = ['get', 'post', 'put', 'delete', 'patch'];

/**
 * Resolve a JSON `$ref` pointer within the spec.
 * Only handles local references (#/components/…).
 *
 * @param {Object} spec - The full OpenAPI spec object.
 * @param {string} ref  - The $ref string, e.g. "#/components/parameters/uid".
 * @returns {Object} The resolved object.
 */
function resolveRef(spec, ref) {
    if (!ref || !ref.startsWith('#/')) return ref;
    const parts = ref.substring(2).split('/');
    let current = spec;
    for (const part of parts) {
        current = current[part];
        if (current === undefined) {
            throw new Error(`Cannot resolve $ref: ${ref}`);
        }
    }
    return current;
}

/**
 * Convert an OpenAPI schema type to a descriptive string for tool descriptions.
 */
function schemaTypeLabel(schema) {
    if (!schema) return 'any';
    if (schema.type === 'array') {
        return `array of ${schemaTypeLabel(schema.items || {})}`;
    }
    if (schema.enum) {
        return `${schema.type || 'string'} (one of: ${schema.enum.join(', ')})`;
    }
    return schema.type || 'any';
}

/**
 * Convert an OpenAPI parameter/property schema to a JSON Schema fragment
 * suitable for MCP tool inputSchema.
 */
function toJsonSchema(openapiSchema) {
    if (!openapiSchema) return { type: 'string' };

    const result = {};

    if (openapiSchema.type) result.type = openapiSchema.type;
    if (openapiSchema.description) result.description = openapiSchema.description;
    if (openapiSchema.enum) result.enum = openapiSchema.enum;
    if (openapiSchema.default !== undefined) result.default = openapiSchema.default;
    if (openapiSchema.example !== undefined) result.examples = [openapiSchema.example];

    if (openapiSchema.type === 'array' && openapiSchema.items) {
        result.items = toJsonSchema(openapiSchema.items);
    }

    if (openapiSchema.type === 'object' && openapiSchema.properties) {
        result.properties = {};
        for (const [k, v] of Object.entries(openapiSchema.properties)) {
            result.properties[k] = toJsonSchema(v);
        }
        if (openapiSchema.required) {
            result.required = openapiSchema.required;
        }
    }

    // Default to string if no type specified
    if (!result.type && !result.oneOf && !result.anyOf) {
        result.type = 'string';
    }

    return result;
}

/**
 * Generate a clean, human-readable tool name from HTTP method + path.
 *
 * Examples:
 *   GET  /api/framework/list        → get_framework_list
 *   POST /api/assertion/bulk/create  → post_assertion_bulk_create
 *   GET  /api/data/{type}/{uid}     → get_data_by_type_and_uid
 *   GET  /api/ims/case/v1p0/CFItems → get_ims_case_v1p0_cf_items
 */
function generateToolName(method, path) {
    // Remove /api prefix
    let cleaned = path.replace(/^\/api\/?/, '');

    // Replace path parameters {param} with "by_param"
    const pathParams = [];
    cleaned = cleaned.replace(/\{(\w+)\}/g, (_, paramName) => {
        pathParams.push(paramName);
        return '';
    });

    // Convert camelCase segments to snake_case
    cleaned = cleaned.replace(/([a-z])([A-Z])/g, '$1_$2');

    // Replace slashes and other separators with underscores
    cleaned = cleaned.replace(/[\/\-\.]+/g, '_');

    // Remove trailing/leading/double underscores
    cleaned = cleaned.replace(/_+/g, '_').replace(/^_|_$/g, '');

    // Lowercase everything
    cleaned = cleaned.toLowerCase();

    // Append path param context
    if (pathParams.length > 0) {
        cleaned += '_by_' + pathParams.join('_and_');
    }

    return `${method.toLowerCase()}_${cleaned}`;
}

/**
 * Generate a human-readable description for a tool, including
 * descriptions and examples of all parameters as MCP tool inputs.
 */
function generateDescription(method, path, operation, spec) {
    const parts = [];

    if (operation.summary) {
        parts.push(operation.summary);
    }

    if (operation.description && operation.description !== operation.summary) {
        parts.push(operation.description);
    }

    if (parts.length === 0) {
        parts.push(`${method.toUpperCase()} ${path}`);
    }

    // Document parameters — presented as flat tool input arguments
    const rawParams = operation.parameters || [];
    const hasBody = !!operation.requestBody;

    if (rawParams.length > 0 || hasBody) {
        parts.push('\nArguments:');
    }

    for (let param of rawParams) {
        if (param['$ref']) {
            try { param = resolveRef(spec, param['$ref']); } catch { continue; }
        }
        const name = param.name || 'unknown';
        const schema = param.schema || {};
        const typeStr = schemaTypeLabel(schema);
        const required = param.required ? ' (required)' : '';

        let line = `- ${name}${required}: ${typeStr}`;
        if (param.description) line += ` — ${param.description}`;
        if (param.example !== undefined) line += ` (e.g. ${JSON.stringify(param.example)})`;
        else if (schema.example !== undefined) line += ` (e.g. ${JSON.stringify(schema.example)})`;
        else if (schema.default !== undefined) line += ` (default: ${JSON.stringify(schema.default)})`;
        if (schema.enum) line += ` [values: ${schema.enum.join(', ')}]`;
        parts.push(line);
    }

    // Document request body — passed as "body" argument
    if (operation.requestBody) {
        const reqBody = operation.requestBody;
        const content = reqBody.content || {};
        const mediaType =
            content['application/json'] ||
            content['application/ld+json'] ||
            content['multipart/form-data'] ||
            Object.values(content)[0];

        const bodyReqStr = reqBody.required ? ' (required)' : '';
        parts.push(`- body${bodyReqStr}: object — The request payload to send.`);

        if (reqBody.description) {
            parts.push(`  ${reqBody.description}`);
        }

        if (mediaType && mediaType.schema) {
            let bodySchema = mediaType.schema;
            if (bodySchema['$ref']) {
                try { bodySchema = resolveRef(spec, bodySchema['$ref']); } catch { /* use as-is */ }
            }

            // List body object properties if available
            if (bodySchema.properties) {
                parts.push('  Properties:');
                const bodyRequired = new Set(bodySchema.required || []);
                for (const [propName, propSchema] of Object.entries(bodySchema.properties)) {
                    const typeStr = schemaTypeLabel(propSchema);
                    const req = bodyRequired.has(propName) ? ' (required)' : '';
                    let line = `  - ${propName}${req}: ${typeStr}`;
                    if (propSchema.description) line += ` — ${propSchema.description}`;
                    if (propSchema.example !== undefined) line += ` (e.g. ${JSON.stringify(propSchema.example)})`;
                    parts.push(line);
                }
            }

            if (mediaType.example !== undefined) {
                parts.push(`  Example: ${JSON.stringify(mediaType.example)}`);
            }
        }
    }

    return parts.join('\n');
}

/**
 * Parse the full OpenAPI spec and return an array of MCP tool descriptors.
 *
 * @param {Object} spec - Parsed OpenAPI 3.0 spec object.
 * @returns {Array<Object>} Array of tool descriptors.
 */
export function generateTools(spec) {
    const tools = [];

    for (const [path, pathItem] of Object.entries(spec.paths || {})) {
        for (const method of HTTP_METHODS) {
            const operation = pathItem[method];
            if (!operation) continue;

            if (operation['x-mcp-ignore'] === true) continue;

            const toolName = generateToolName(method, path);
            const description = generateDescription(method, path, operation, spec);

            // Build the parameter map and input schema properties.
            const parameterMap = {};
            const inputSchemaProperties = {};
            const requiredParams = [];

            // Resolve and process parameters (path, query, header).
            const rawParams = operation.parameters || [];
            for (let param of rawParams) {
                // Resolve $ref if needed
                if (param['$ref']) {
                    param = resolveRef(spec, param['$ref']);
                }

                const paramName = param.name;
                const location = param.in; // path, query, header

                parameterMap[paramName] = {
                    location,
                    schema: param.schema || {},
                    required: param.required || false,
                };

                // Build JSON Schema for this parameter
                const propSchema = toJsonSchema(param.schema || {});
                if (param.description) {
                    propSchema.description = param.description;
                }
                if (param.example !== undefined && !propSchema.examples) {
                    propSchema.examples = [param.example];
                }

                inputSchemaProperties[paramName] = propSchema;

                if (param.required) {
                    requiredParams.push(paramName);
                }
            }

            // Determine the request content type from the spec
            let requestContentType = null;
            if (operation.requestBody) {
                const reqBody = operation.requestBody;
                const content = reqBody.content || {};

                // Prefer application/json, fall back to first available
                const mediaType =
                    content['application/json'] ||
                    content['application/ld+json'] ||
                    content['multipart/form-data'] ||
                    Object.values(content)[0];

                if (mediaType && mediaType.schema) {
                    let bodySchema = mediaType.schema;
                    if (bodySchema['$ref']) {
                        bodySchema = resolveRef(spec, bodySchema['$ref']);
                    }

                    const bodyJsonSchema = toJsonSchema(bodySchema);
                    bodyJsonSchema.description = bodyJsonSchema.description ||
                        (reqBody.description || 'Request body');

                    inputSchemaProperties['body'] = bodyJsonSchema;

                    if (reqBody.required) {
                        requiredParams.push('body');
                    }
                }

                // Determine content type — use the first key in content
                const contentTypes = Object.keys(content);
                if (contentTypes.includes('multipart/form-data')) {
                    requestContentType = 'multipart/form-data';
                } else if (contentTypes.includes('application/json')) {
                    requestContentType = 'application/json';
                } else if (contentTypes.includes('application/ld+json')) {
                    requestContentType = 'application/ld+json';
                } else if (contentTypes.length > 0) {
                    requestContentType = contentTypes[0];
                }
            }

            // Build the final inputSchema
            const inputSchema = {
                type: 'object',
                properties: inputSchemaProperties,
            };
            if (requiredParams.length > 0) {
                inputSchema.required = requiredParams;
            }

            tools.push({
                name: toolName,
                description,
                inputSchema,
                method,
                pathTemplate: path,
                parameterMap,
                requestContentType,
            });
        }
    }

    return tools;
}

/**
 * Extract JSON-LD resource type templates from the OpenAPI spec.
 *
 * CaSS serves JSON-LD objects via /api/data/{type}/{uid} and similar patterns.
 * This generates MCP resource templates for browsable access.
 *
 * @param {Object} spec - Parsed OpenAPI 3.0 spec object.
 * @returns {Array<Object>} Array of resource template descriptors.
 */
export function generateResourceTemplates(spec) {
    const templates = [];

    // Static resource template for fetching any JSON-LD object by type + uid
    templates.push({
        uriTemplate: 'cass://data/{type}/{uid}',
        name: 'CaSS JSON-LD Object',
        description: 'Retrieve any JSON-LD object from the CaSS repository by its type and unique identifier. ' +
            'Type follows the CaSS namespace convention (e.g. schema.cassproject.org.0.4.Framework). ' +
            'UID is the GUID or MD5 hash of the object\'s @id.',
        mimeType: 'application/ld+json',
        method: 'GET',
        pathTemplate: '/api/data/{type}/{uid}',
    });

    // Template for versioned access
    templates.push({
        uriTemplate: 'cass://data/{type}/{uid}/{version}',
        name: 'CaSS JSON-LD Object (Versioned)',
        description: 'Retrieve a specific version of a JSON-LD object from the CaSS repository. ' +
            'Version is typically a timestamp for CaSS-created data.',
        mimeType: 'application/ld+json',
        method: 'GET',
        pathTemplate: '/api/data/{type}/{uid}/{version}',
    });

    // Template for fetching any object by uid alone
    templates.push({
        uriTemplate: 'cass://data/{uid}',
        name: 'CaSS Object by UID',
        description: 'Retrieve a JSON-LD object from CaSS by its UID (type auto-detected).',
        mimeType: 'application/ld+json',
        method: 'GET',
        pathTemplate: '/api/data/{uid}',
    });

    return templates;
}
