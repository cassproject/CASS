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

/**
 * Initialize the MCP adapter and mount routes on Express.
 *
 * Uses dynamic import() to load the ESM-only MCP SDK modules
 * from within this CommonJS cartridge.
 */
async function initMcp() {
    // Dynamic imports for ESM modules
    const { McpServer, ResourceTemplate } = await import('@modelcontextprotocol/sdk/server/mcp.js');
    const { SSEServerTransport } = await import('@modelcontextprotocol/sdk/server/sse.js');
    const { generateTools, generateResourceTemplates } = await import('../../mcp/lib/openapi-to-tools.js');
    const { inputSchemaToZodShape } = await import('../../mcp/lib/json-schema-to-zod.js');

    let spec;

    // Fetch the live spec served by CaSS (available after startup)
    const loopback = process.env.CASS_LOOPBACK;
    if (!loopback) {
        global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.ERROR, 'McpSpecError', 'MCP adapter cannot load OpenAPI spec: loopback URL not configured.');
        return;
    }

    try {
        const res = await fetch(loopback.replace(/\/$/, '') + '/swagger.json');
        if (res.ok) {
            spec = await res.json();
            global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, 'McpSpecLive', `MCP adapter loaded live OpenAPI spec (${Object.keys(spec.paths || {}).length} paths)`);
        } else {
            global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.ERROR, 'McpSpecError', `MCP adapter failed to load spec from server: HTTP ${res.status}`);
            return;
        }
    } catch (e) {
        global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.ERROR, 'McpSpecError', `MCP adapter cannot load OpenAPI spec: ${e}`);
        return;
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
     *
     * @param {Object} sessionCtx - Mutable per-session context. The POST handler
     *   updates sessionCtx.signatureSheet on each request from auth.js middleware.
     */
    function createMcpServer(sessionCtx) {
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
                    const startTime = Date.now();
                    global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, 'McpToolCall',
                        `MCP tool invoked: ${def.name} | args: ${JSON.stringify(args)} | sigSheet: ${sessionCtx.signatureSheet ? 'present (' + sessionCtx.signatureSheet.length + ' chars)' : 'MISSING'}`);


                    try {
                        const result = await callCassInternal(cassUrl, def.method, def.pathTemplate, args, def.parameterMap, def.requestContentType, sessionCtx.signatureSheet, sessionCtx.authorization);
                        const elapsed = Date.now() - startTime;

                        global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, 'McpToolResult',
                            `MCP tool result: ${def.name} | ${result.method} ${result.url} | HTTP ${result.status} | ${result.body.length} bytes | ${elapsed}ms`);

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
                        const elapsed = Date.now() - startTime;
                        global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.ERROR, 'McpToolError',
                            `MCP tool error: ${def.name} | ${def.method.toUpperCase()} ${def.pathTemplate} | ${err.message} | ${elapsed}ms`);
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
                        const fetchHeaders = { 'Accept': 'application/ld+json, application/json' };

                        // Forward signature sheet for resource access
                        if (sessionCtx.signatureSheet) {
                            fetchHeaders['signatureSheet'] = sessionCtx.signatureSheet;
                        }
                        // Forward Bearer token for identity/eim creation on loopback
                        if (sessionCtx.authorization) {
                            fetchHeaders['Authorization'] = sessionCtx.authorization;
                        }

                        const response = await fetch(fetchUrl, { headers: fetchHeaders });
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

    async function callCassInternal(cassUrl, method, pathTemplate, args, parameterMap, requestContentType, signatureSheet, authorization) {
        let resolvedPath = pathTemplate;
        const queryParams = new URLSearchParams();
        const headers = { 'Accept': 'application/json' };

        // Forward the signature sheet from the auth.js middleware.
        // kbac.js reads this from req.headers.signatureSheet (line 97-98).
        if (signatureSheet) {
            headers['signatureSheet'] = signatureSheet;
        }

        // Forward the Bearer token so the loopback request goes through
        // the JWT bridge middleware, which populates req.oidc.user and
        // triggers signature sheet / req.eim creation on the server side.
        if (authorization) {
            headers['Authorization'] = authorization;
        }

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
        const upperMethod = method.toUpperCase();

        if (args.body !== undefined && args.body !== null) {
            if (requestContentType === 'multipart/form-data') {
                // Construct multipart/form-data — CaSS reads named parts
                // via fileFromDatastream(name). Each body property becomes
                // a named form field.
                const formData = new FormData();
                const bodyObj = typeof args.body === 'string' ? JSON.parse(args.body) : args.body;

                if (bodyObj && typeof bodyObj === 'object' && !Array.isArray(bodyObj)) {
                    for (const [key, value] of Object.entries(bodyObj)) {
                        if (value === undefined || value === null) continue;
                        // Convert objects/arrays to JSON strings for the form field
                        const fieldValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
                        formData.append(key, new Blob([fieldValue], { type: 'application/json' }), key);
                    }
                } else {
                    // Single value — send as 'data' field
                    const content = typeof bodyObj === 'object' ? JSON.stringify(bodyObj) : String(bodyObj);
                    formData.append('data', new Blob([content], { type: 'application/json' }), 'data');
                }

                fetchBody = formData;
                // Do NOT set Content-Type header — fetch sets it automatically
                // with the correct multipart boundary
            } else {
                // Default: JSON body
                headers['Content-Type'] = 'application/json';
                fetchBody = typeof args.body === 'string' ? args.body : JSON.stringify(args.body);
            }
        } else if (['POST', 'PUT', 'PATCH'].includes(upperMethod)) {
            headers['Content-Type'] = 'application/json';
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

        const fetchOptions = { method: upperMethod, headers };
        if (fetchBody && upperMethod !== 'GET' && upperMethod !== 'HEAD') {
            fetchOptions.body = fetchBody;
        }

        const response = await fetch(url, fetchOptions);
        const responseText = await response.text();
        return { status: response.status, body: responseText, url, method: upperMethod };
    }

    // -----------------------------------------------------------------------
    // 5. Mount on Express — SSE transport with signature sheet forwarding
    // -----------------------------------------------------------------------

    const sessions = {};

    const express = require('express');
    const jsonParser = express.json({ type: 'application/json' });

    // GET /api/mcp — SSE stream for MCP connection
    global.app.get('/api/mcp', async (req, res) => {
        try {
            const transport = new SSEServerTransport('/api/mcp/message', res);

            // Per-session context — auth.js sets req.headers.signatureSheet
            // on every request. We capture it here and update it on each POST.
            const sessionCtx = {
                signatureSheet: req.headers.signaturesheet || req.headers.signatureSheet || null,
                authorization: req.headers.authorization || null,
            };
            
            transport.onclose = () => {
                delete sessions[transport.sessionId];
                global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, 'McpSessionClosed', `MCP session closed: ${transport.sessionId}`);
            };

            sessions[transport.sessionId] = { transport, sessionCtx };

            const server = createMcpServer(sessionCtx);
            await server.connect(transport);
            global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, 'McpSessionCreated', `MCP session created: ${transport.sessionId}`);
        } catch (err) {
            global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.ERROR, 'McpRequestError', err.message);
            if (!res.headersSent) {
                res.status(500).json({ error: err.message });
            }
        }
    });

    // POST /api/mcp/message — main MCP message handler
    global.app.post('/api/mcp/message', jsonParser, async (req, res) => {
        try {
            const sessionId = req.query.sessionId;
            const session = sessions[sessionId];

            if (!session) {
                res.status(404).json({ error: 'MCP session not found. Initiate via GET /api/mcp first.' });
                return;
            }

            // Update the session's signature sheet from the current request.
            // auth.js middleware has already processed SSO/OIDC/JWT and set
            // req.headers.signatureSheet by this point.
            session.sessionCtx.signatureSheet = req.headers.signaturesheet || req.headers.signatureSheet || session.sessionCtx.signatureSheet;
            session.sessionCtx.authorization = req.headers.authorization || session.sessionCtx.authorization;

            // SSEServerTransport expects handlePostMessage
            await session.transport.handlePostMessage(req, res, req.body);
        } catch (err) {
            global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.ERROR, 'McpRequestError', err.message);
            if (!res.headersSent) {
                res.status(500).json({ error: err.message });
            }
        }
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
     *   get:
     *     tags:
     *       - MCP Adapter
     *     x-mcp-ignore: true
     *     summary: MCP SSE notification stream
     *     description: |
     *       Opens a Server-Sent Events stream for the Model Context Protocol.
     *       The server will send an `endpoint` event containing the relative URL 
     *       to POST messages to (typically `/api/mcp/message?sessionId=...`).
     *     responses:
     *       200:
     *         description: SSE event stream.
     * /api/mcp/message:
     *   post:
     *     tags:
     *       - MCP Adapter
     *     x-mcp-ignore: true
     *     summary: Model Context Protocol message handler
     *     description: Receive JSON-RPC messages for an active MCP session.
     *     parameters:
     *       - in: query
     *         name: sessionId
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             description: JSON-RPC 2.0 request object per the MCP specification.
     *     responses:
     *       200:
     *         description: OK
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
