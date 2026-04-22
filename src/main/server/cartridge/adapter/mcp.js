/**
 * MCP (Model Context Protocol) Adapter for CaSS
 *
 * Exposes all CaSS OpenAPI capabilities as MCP tools and JSON-LD
 * resources via Streamable HTTP transport, mounted directly on the
 * CaSS Express server at /api/mcp.
 *
 * Enable/disable via DISABLED_ADAPTERS env var (key: 'mcp').
 *
 * @see https://modelcontextprotocol.io/
 */

const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

/**
 * Initialize the MCP adapter and mount routes on Express.
 *
 * Uses dynamic import() to load the ESM-only MCP SDK modules
 * from within this CommonJS cartridge.
 */
async function initMcp() {
    // Dynamic imports for ESM modules
    const { McpServer, ResourceTemplate } = await import('@modelcontextprotocol/sdk/server/mcp.js');
    const { StreamableHTTPServerTransport } = await import('@modelcontextprotocol/sdk/server/streamableHttp.js');
    const { generateTools, generateResourceTemplates } = await import('../../mcp/lib/openapi-to-tools.js');
    const { inputSchemaToZodShape } = await import('../../mcp/lib/json-schema-to-zod.js');

    // -----------------------------------------------------------------------
    // 1. Load the OpenAPI spec — prefer the live generated spec from server.js
    // -----------------------------------------------------------------------

    let spec;
    const specPath = path.resolve(process.cwd(), 'swaggerx.json');

    // Try the live spec served by CaSS first (available after startup)
    const loopback = global.repo ? global.repo.selectedServer : null;
    if (loopback) {
        try {
            const res = await fetch(loopback.replace(/\/$/, '') + '/swagger.json');
            if (res.ok) {
                spec = await res.json();
                global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, 'McpSpecLive', `MCP adapter loaded live OpenAPI spec (${Object.keys(spec.paths || {}).length} paths)`);
            }
        } catch (e) {
            // Fall through to file
        }
    }

    // Fallback to swaggerx.json on disk
    if (!spec) {
        try {
            spec = JSON.parse(fs.readFileSync(specPath, 'utf-8'));
            global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, 'McpSpecFile', `MCP adapter loaded OpenAPI spec from ${specPath}`);
        } catch (e) {
            global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.ERROR, 'McpSpecError', `MCP adapter cannot load OpenAPI spec: ${e.message}`);
            return;
        }
    }

    // -----------------------------------------------------------------------
    // 2. Generate tool and resource definitions
    // -----------------------------------------------------------------------

    const toolDefs = generateTools(spec);
    const resourceTemplateDefs = generateResourceTemplates(spec);

    global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, 'McpToolsGenerated', `MCP adapter generated ${toolDefs.length} tools, ${resourceTemplateDefs.length} resource templates`);

    // -----------------------------------------------------------------------
    // 3. Build the MCP server with all tools and resources
    // -----------------------------------------------------------------------

    /**
     * Create and configure a fresh McpServer instance.
     * Called once per session so each client gets its own server state.
     */
    function createMcpServer() {
        const server = new McpServer({
            name: 'cass-mcp-server',
            version: spec.info?.version || '1.0.0',
        }, {
            capabilities: {
                tools: { listChanged: false },
                resources: { listChanged: false },
            },
        });

        // Register tools
        const cassUrl = (global.repo ? global.repo.selectedServer : 'http://localhost/api/').replace(/\/$/, '');

        for (const toolDef of toolDefs) {
            const zodShape = inputSchemaToZodShape(toolDef.inputSchema);
            const def = toolDef;

            server.registerTool(
                def.name,
                {
                    description: def.description,
                    inputSchema: zodShape,
                },
                async (args) => {
                    try {
                        const result = await callCassInternal(cassUrl, def.method, def.pathTemplate, args, def.parameterMap);

                        if (result.status >= 400) {
                            return {
                                content: [{
                                    type: 'text',
                                    text: `CaSS API error (HTTP ${result.status}):\n${result.body}`,
                                }],
                                isError: true,
                            };
                        }

                        let formattedBody = result.body;
                        try {
                            const parsed = JSON.parse(result.body);
                            formattedBody = JSON.stringify(parsed, null, 2);
                        } catch {
                            // Not JSON
                        }

                        return {
                            content: [{ type: 'text', text: formattedBody }],
                        };
                    } catch (err) {
                        return {
                            content: [{ type: 'text', text: `Failed to call CaSS API: ${err.message}` }],
                            isError: true,
                        };
                    }
                }
            );
        }

        // Register resource templates
        for (const resDef of resourceTemplateDefs) {
            const def = resDef;

            server.resource(
                def.name,
                new ResourceTemplate(def.uriTemplate, { list: undefined }),
                async (uri, variables) => {
                    try {
                        let apiPath = def.pathTemplate;
                        for (const [key, value] of Object.entries(variables)) {
                            apiPath = apiPath.replace(`{${key}}`, encodeURIComponent(String(value)));
                        }

                        let fetchUrl = cassUrl + apiPath.replace(/^\/api\//, '/').replace(/^\/api$/, '');
                        const response = await fetch(fetchUrl, {
                            headers: { 'Accept': 'application/ld+json, application/json' },
                        });
                        const body = await response.text();

                        return {
                            contents: [{
                                uri: uri.href,
                                mimeType: def.mimeType || 'application/ld+json',
                                text: body,
                            }],
                        };
                    } catch (err) {
                        return {
                            contents: [{
                                uri: uri.href,
                                mimeType: 'text/plain',
                                text: `Error fetching resource: ${err.message}`,
                            }],
                        };
                    }
                }
            );
        }

        return server;
    }

    // -----------------------------------------------------------------------
    // 4. Internal HTTP caller (loopback to self)
    // -----------------------------------------------------------------------

    async function callCassInternal(cassUrl, method, pathTemplate, args, parameterMap) {
        let resolvedPath = pathTemplate;
        const queryParams = new URLSearchParams();
        const headers = { 'Accept': 'application/json' };

        for (const [paramName, paramMeta] of Object.entries(parameterMap)) {
            const value = args[paramName];
            if (value === undefined || value === null) continue;

            switch (paramMeta.location) {
            case 'path':
                resolvedPath = resolvedPath.replace(`{${paramName}}`, encodeURIComponent(String(value)));
                break;
            case 'query':
                if (Array.isArray(value)) {
                    for (const v of value) queryParams.append(paramName, String(v));
                } else {
                    queryParams.set(paramName, String(value));
                }
                break;
            case 'header':
                headers[paramName] = String(value);
                break;
            }
        }

        let fetchBody = undefined;
        if (args.body !== undefined && args.body !== null) {
            headers['Content-Type'] = 'application/json';
            fetchBody = typeof args.body === 'string' ? args.body : JSON.stringify(args.body);
        }

        // Build URL — cassUrl already includes /api (e.g. http://localhost/api)
        // pathTemplate starts with /api/... so strip the /api prefix
        let relativePath = resolvedPath;
        if (relativePath.startsWith('/api')) {
            relativePath = relativePath.substring(4);
        }

        let url = cassUrl + relativePath;
        const qs = queryParams.toString();
        if (qs) url += '?' + qs;

        const fetchOptions = { method: method.toUpperCase(), headers };
        if (fetchBody && method.toUpperCase() !== 'GET' && method.toUpperCase() !== 'HEAD') {
            fetchOptions.body = fetchBody;
        }

        const response = await fetch(url, fetchOptions);
        const responseText = await response.text();
        return { status: response.status, body: responseText };
    }

    // -----------------------------------------------------------------------
    // 5. Mount on Express — Streamable HTTP transport
    // -----------------------------------------------------------------------

    const sessions = {};

    const express = require('express');
    const jsonParser = express.json();

    // POST /api/mcp — main MCP message handler
    global.app.post('/api/mcp', jsonParser, async (req, res) => {
        try {
            const sessionId = req.headers['mcp-session-id'];

            // New session (initialize request)
            if (!sessionId) {
                const transport = new StreamableHTTPServerTransport({
                    sessionIdGenerator: () => randomUUID(),
                    onsessioninitialized: (id) => {
                        sessions[id] = transport;
                        global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, 'McpSessionCreated', `MCP session created: ${id}`);
                    },
                });

                transport.onclose = () => {
                    const id = Object.keys(sessions).find(k => sessions[k] === transport);
                    if (id) {
                        delete sessions[id];
                        global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, 'McpSessionClosed', `MCP session closed: ${id}`);
                    }
                };

                const server = createMcpServer();
                await server.connect(transport);
                await transport.handleRequest(req, res, req.body);
                return;
            }

            // Existing session
            const transport = sessions[sessionId];
            if (!transport) {
                res.status(404).json({ error: 'MCP session not found. Send an initialize request first.' });
                return;
            }

            await transport.handleRequest(req, res, req.body);
        } catch (err) {
            global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.ERROR, 'McpRequestError', err.message);
            if (!res.headersSent) {
                res.status(500).json({ error: err.message });
            }
        }
    });

    // GET /api/mcp — SSE stream for server-initiated notifications
    global.app.get('/api/mcp', async (req, res) => {
        const sessionId = req.headers['mcp-session-id'];
        const transport = sessionId ? sessions[sessionId] : null;
        if (!transport) {
            res.status(404).json({ error: 'MCP session not found.' });
            return;
        }
        await transport.handleRequest(req, res);
    });

    // DELETE /api/mcp — session termination
    global.app.delete('/api/mcp', async (req, res) => {
        const sessionId = req.headers['mcp-session-id'];
        const transport = sessionId ? sessions[sessionId] : null;
        if (!transport) {
            res.status(404).json({ error: 'MCP session not found.' });
            return;
        }
        await transport.handleRequest(req, res);
    });

    global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, 'McpReady', `MCP adapter mounted at /api/mcp (${toolDefs.length} tools, ${resourceTemplateDefs.length} resources)`);
}

// ---------------------------------------------------------------------------
// Guard with disabledAdapters check, then initialize after server is ready
// ---------------------------------------------------------------------------

if (!global.disabledAdapters['mcp']) {
    /**
     * @openapi
     * /api/mcp:
     *   post:
     *     tags:
     *       - MCP Adapter
     *     summary: Model Context Protocol endpoint
     *     description: |
     *       Streamable HTTP transport endpoint for the Model Context Protocol (MCP).
     *       AI assistants use this endpoint to discover and invoke CaSS API tools.
     *       Send an `initialize` JSON-RPC request to start a session, then include
     *       the returned `mcp-session-id` header in subsequent requests.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             description: JSON-RPC 2.0 request object per the MCP specification.
     *     responses:
     *       200:
     *         description: JSON-RPC 2.0 response or SSE stream.
     *       404:
     *         description: MCP session not found.
     *   get:
     *     tags:
     *       - MCP Adapter
     *     summary: MCP SSE notification stream
     *     description: Opens a Server-Sent Events stream for receiving server-initiated MCP notifications.
     *     parameters:
     *       - in: header
     *         name: mcp-session-id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: SSE event stream.
     *       404:
     *         description: MCP session not found.
     *   delete:
     *     tags:
     *       - MCP Adapter
     *     summary: Terminate MCP session
     *     description: Closes and cleans up an MCP session.
     *     parameters:
     *       - in: header
     *         name: mcp-session-id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Session terminated.
     *       404:
     *         description: MCP session not found.
     */
    global.events.server.ready.subscribe(async (isReady) => {
        if (!isReady) return;
        try {
            await initMcp();
        } catch (err) {
            global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.ERROR, 'McpInitError', `MCP adapter failed to initialize: ${err.stack}`);
        }
    });
}
