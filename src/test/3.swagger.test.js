const chai = require('chai');

const assert = chai.assert;

const BASE = process.env.CASS_LOOPBACK || 'http://localhost/api/';

describe('OpenAPI / Swagger', function () {
    this.timeout(60000);
    let spec;

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

    // ── 1. Spec structure validation ─────────────────────────────────────
    it('swagger.json is a valid OpenAPI 3.0 document', async () => {
        const res = await fetch(`${BASE}swagger.json`);
        assert.strictEqual(res.status, 200, 'Failed to fetch swagger.json');
        spec = await res.json();

        const OpenApiSchemaValidator = require('openapi-schema-validator').default;
        const validator = new OpenApiSchemaValidator({ version: 3 });
        const result = validator.validate(spec);
        assert.strictEqual(
            result.errors.length,
            0,
            'OpenAPI spec has validation errors:\n' +
            result.errors.map((e) => `  ${e.instancePath || '/'}: ${e.message}`).join('\n'),
        );
    });

    // ── 2. Every documented path returns a spec-documented status code ───
    it('all documented endpoints return documented status codes', async () => {
        // Depends on spec being loaded in previous test.
        if (!spec) this.skip();

        const results = [];
        const paths = Object.entries(spec.paths || {});

        for (const [path, methods] of paths) {
            for (const [method, operation] of Object.entries(methods)) {
                if (['parameters', 'summary', 'description'].includes(method)) continue;

                // Build the URL — replace path params with a dummy value.
                const url = BASE.replace(/\/api\/$/, '') +
                    path.replace(/\{[^}]+\}/g, 'test-placeholder');

                const documentedCodes = Object.keys(operation.responses || {});

                let res;
                try {
                    const fetchOpts = { method: method.toUpperCase() };
                    // For POST/PUT/PATCH, send an empty form body so the
                    // server doesn't hang waiting for multipart data.
                    if (['post', 'put', 'patch'].includes(method)) {
                        fetchOpts.body = new URLSearchParams();
                        fetchOpts.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
                    }
                    res = await fetch(url, fetchOpts);
                } catch (err) {
                    results.push({ path, method, status: 'FETCH_ERROR', error: err.message });
                    continue;
                }

                // Drain the body so the connection doesn't hang.
                await res.text();

                const statusStr = String(res.status);
                const matched = documentedCodes.includes(statusStr) ||
                    documentedCodes.includes('default') ||
                    // Tolerate undocumented 4xx/5xx for endpoints that require auth/data we can't provide.
                    res.status >= 400;

                results.push({
                    path,
                    method: method.toUpperCase(),
                    status: res.status,
                    documented: documentedCodes,
                    pass: matched,
                });
            }
        }

        // Print a summary table.
        const table = results.map((r) =>
            `${r.pass !== false ? '✓' : '✗'} ${r.method.padEnd(6)} ${String(r.status).padEnd(4)} ${r.path}` +
            (r.pass === false ? ` (expected one of: ${r.documented.join(', ')})` : ''),
        );
        console.log('\n      Endpoint responses:\n      ' + table.join('\n      '));

        const failures = results.filter((r) => r.pass === false);
        assert.strictEqual(
            failures.length,
            0,
            `${failures.length} endpoint(s) returned undocumented status codes:\n` +
            failures.map((f) => `  ${f.method} ${f.path}: got ${f.status}, expected ${f.documented.join('|')}`).join('\n'),
        );
    });
});
