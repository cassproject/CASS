const chai = require('chai');
const Ajv = require('ajv');

const assert = chai.assert;

const BASE = process.env.CASS_LOOPBACK || 'http://localhost/api/';

describe('OpenAPI Schema Validation', function () {
    this.timeout(60000);
    let spec;
    let ajv;

    it('Waiting for server to be ready', async () => {
        if (process.env.NODEV != null) return;
        if (!global.events || !global.events.server) return;
        let ready = false;
        global.events.server.ready.subscribe(function (isReady) {
            if (!isReady) {
                console.log('Server not ready. Skipping tests.');
                return;
            }
            ready = true;
        });
        while (!ready) { await new Promise((resolve) => setTimeout(resolve, 100)); }
    });

    // Pre-process a schema to convert OpenAPI 3.0 `nullable` to JSON Schema `type: [..., 'null']`.
    function convertNullable(schema) {
        if (!schema || typeof schema !== 'object') return schema;
        if (Array.isArray(schema)) return schema.map(convertNullable);
        const result = {};
        for (const [key, value] of Object.entries(schema)) {
            if (key === 'nullable') continue; // Remove the keyword, handled via type.
            result[key] = convertNullable(value);
        }
        if (schema.nullable === true && result.type && !Array.isArray(result.type)) {
            result.type = [result.type, 'null'];
        }
        return result;
    }

    it('load swagger spec and set up validator', async () => {
        const res = await fetch(`${BASE}swagger.json`);
        assert.strictEqual(res.status, 200, 'Failed to fetch swagger.json');
        spec = await res.json();

        ajv = new Ajv({ allErrors: true, strict: false });
        const schemas = spec.components && spec.components.schemas;
        if (schemas) {
            for (const [name, schema] of Object.entries(schemas)) {
                ajv.addSchema(convertNullable(schema), `#/components/schemas/${name}`);
            }
        }
    });

    // ── Endpoints that reliably return 200 with a body we can validate ───
    //
    // We only test endpoints whose responses we can trigger without
    // authentication, special data, or external services. Endpoints that
    // need path params or request bodies are skipped here — they are
    // covered by the status-code test in 3.swagger.test.js.

    const simpleEndpoints = [
        { method: 'GET', path: '/api/ping', label: 'GET /api/ping' },
        { method: 'GET', path: '/api/sky/admin', label: 'GET /api/sky/admin' },
        { method: 'GET', path: '/api/sky/id/salts', label: 'GET /api/sky/id/salts' },
        { method: 'GET', path: '/api/badge/pk', label: 'GET /api/badge/pk' },
        { method: 'GET', path: '/api/xapi/pk', label: 'GET /api/xapi/pk' },
        { method: 'GET', path: '/api/xapi/endpoint', label: 'GET /api/xapi/endpoint' },
        { method: 'GET', path: '/api/ims/case/getDocs', label: 'GET /api/ims/case/getDocs' },
        { method: 'GET', path: '/api/sky/repo/search', label: 'GET /api/sky/repo/search' },
        { method: 'POST', path: '/api/sky/repo/search', label: 'POST /api/sky/repo/search' },
        { method: 'POST', path: '/api/xapi/tick', label: 'POST /api/xapi/tick' },
        { method: 'POST', path: '/api/xapi/statement', label: 'POST /api/xapi/statement' },
        { method: 'POST', path: '/api/xapi/statements', label: 'POST /api/xapi/statements' },
        { method: 'POST', path: '/api/sky/repo/multiPut', label: 'POST /api/sky/repo/multiPut' },
    ];

    for (const ep of simpleEndpoints) {
        it(`response schema: ${ep.label}`, async function () {
            if (!spec) this.skip();

            const specPath = spec.paths[ep.path];
            if (!specPath) {
                this.skip();
                return;
            }
            const operation = specPath[ep.method.toLowerCase()];
            if (!operation) {
                this.skip();
                return;
            }

            // Find the 200 response schema.
            const response200 = operation.responses && operation.responses['200'];
            if (!response200 || !response200.content) {
                this.skip();
                return;
            }
            const mediaType = response200.content['application/json'];
            if (!mediaType || !mediaType.schema) {
                this.skip();
                return;
            }

            // Make the request.
            const fetchOpts = { method: ep.method };
            if (['POST', 'PUT', 'PATCH'].includes(ep.method)) {
                fetchOpts.body = new URLSearchParams();
                fetchOpts.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
            }

            const res = await fetch(
                `${BASE.replace(/\/api\/$/, '')}${ep.path}`,
                fetchOpts,
            );

            // Only validate if we got a 200.
            if (res.status !== 200) {
                const text = await res.text();
                this.skip();
                return;
            }

            let body;
            const text = await res.text();
            try {
                body = JSON.parse(text);
            } catch {
                // Some endpoints return non-JSON 200s (e.g. plain text).
                // Schema validation doesn't apply.
                this.skip();
                return;
            }

            // Resolve $ref if present.
            let schema = mediaType.schema;
            if (schema.$ref) {
                const refPath = schema.$ref.replace('#/', '').split('/');
                schema = refPath.reduce((obj, key) => obj && obj[key], spec);
                if (!schema) {
                    assert.fail(`Could not resolve $ref: ${mediaType.schema.$ref}`);
                }
            }

            const validate = ajv.compile(convertNullable(schema));
            const valid = validate(body);
            assert.isTrue(
                valid,
                `Response body does not match schema for ${ep.label}:\n` +
                (validate.errors || [])
                    .map((e) => `  ${e.instancePath || '/'}: ${e.message}`)
                    .join('\n') +
                `\n  Body: ${JSON.stringify(body).substring(0, 500)}`,
            );
        });
    }

    // ── Error-response schema validation ─────────────────────────────────
    // Validate that error responses (4xx) also match documented schemas.

    const errorEndpoints = [
        { method: 'POST', path: '/api/sky/id/create', expectedStatus: '422', label: 'POST /api/sky/id/create (422)' },
        { method: 'POST', path: '/api/sky/id/commit', expectedStatus: '422', label: 'POST /api/sky/id/commit (422)' },
        { method: 'POST', path: '/api/sky/id/login', expectedStatus: '422', label: 'POST /api/sky/id/login (422)' },
        { method: 'GET', path: '/api/profile/latest', expectedStatus: '400', label: 'GET /api/profile/latest (400)' },
    ];

    for (const ep of errorEndpoints) {
        it(`error schema: ${ep.label}`, async function () {
            if (!spec) this.skip();

            const specPath = spec.paths[ep.path];
            if (!specPath) {
                this.skip();
                return;
            }
            const operation = specPath[ep.method.toLowerCase()];
            if (!operation) {
                this.skip();
                return;
            }

            const expectedResponse = operation.responses && operation.responses[ep.expectedStatus];
            if (!expectedResponse) {
                // The status code is documented (we verified in 3.swagger.test.js)
                // but may not have a schema — just check the code matches.
                const fetchOpts = { method: ep.method };
                if (['POST', 'PUT', 'PATCH'].includes(ep.method)) {
                    fetchOpts.body = new URLSearchParams();
                    fetchOpts.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
                }
                const res = await fetch(`${BASE.replace(/\/api\/$/, '')}${ep.path}`, fetchOpts);
                await res.text();
                assert.strictEqual(
                    String(res.status),
                    ep.expectedStatus,
                    `Expected ${ep.expectedStatus} but got ${res.status}`,
                );
                return;
            }

            // If there's a content schema, validate the body.
            const fetchOpts = { method: ep.method };
            if (['POST', 'PUT', 'PATCH'].includes(ep.method)) {
                fetchOpts.body = new URLSearchParams();
                fetchOpts.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
            }
            const res = await fetch(`${BASE.replace(/\/api\/$/, '')}${ep.path}`, fetchOpts);
            const text = await res.text();
            assert.strictEqual(
                String(res.status),
                ep.expectedStatus,
                `Expected ${ep.expectedStatus} but got ${res.status}`,
            );

            if (expectedResponse.content && expectedResponse.content['application/json']) {
                let schema = expectedResponse.content['application/json'].schema;
                if (schema && schema.$ref) {
                    const refPath = schema.$ref.replace('#/', '').split('/');
                    schema = refPath.reduce((obj, key) => obj && obj[key], spec);
                }
                if (schema) {
                    let body;
                    try {
                        body = JSON.parse(text);
                    } catch {
                        this.skip();
                        return;
                    }
                    const validate = ajv.compile(convertNullable(schema));
                    const valid = validate(body);
                    assert.isTrue(
                        valid,
                        `Error response body does not match schema for ${ep.label}:\n` +
                        (validate.errors || [])
                            .map((e) => `  ${e.instancePath || '/'}: ${e.message}`)
                            .join('\n'),
                    );
                }
            }
        });
    }

    // ── 501 stub validation ──────────────────────────────────────────────
    const stubEndpoints = [
        '/api/ims/case/v1p0/CFAssociationGroupings',
        '/api/ims/case/v1p0/CFConcepts',
        '/api/ims/case/v1p0/CFItemTypes',
        '/api/ims/case/v1p0/CFLicenses',
        '/api/ims/case/v1p0/CFRubrics',
        '/api/ims/case/v1p0/CFSubjects',
    ];

    for (const path of stubEndpoints) {
        it(`501 stub: GET ${path}`, async function () {
            if (!spec) this.skip();
            const res = await fetch(`${BASE.replace(/\/api\/$/, '')}${path}`);
            await res.text();
            assert.strictEqual(res.status, 501, `Expected 501 for ${path} but got ${res.status}`);
        });
    }
});
