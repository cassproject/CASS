/* -
 * --BEGIN_LICENSE--
 * Competency and Skills System
 * -----
 * Copyright (C) 2015 - 2026 Eduworks Corporation and other contributing parties.
 * -----
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * --END_LICENSE--
 */

// When CORS_CREDENTIALS is true, inform the cass client that all requests to the urls specified in CORS_ORIGINS should be made with credentials
const getCorsOrigins = function () {
    let corsOrigins;
    if (process.env.CORS_CREDENTIALS != null && process.env.CORS_CREDENTIALS.trim() == 'true' && process.env.CORS_ORIGINS != null) {
        try {
            corsOrigins = process.env.CORS_ORIGINS.split(',').map((x) => x.trim());
        } catch (e) {
            global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.ERROR, 'CorsConfigError', 'Misconfigured CORS_ORIGINS env var, ensure the value is a comma separated list of origins', e);
        }
    }
    return corsOrigins;
};
let realCrypto = require('crypto');
const cassVersion = require('../../../../package.json').version;
const pingWithTime = function () {
    if (this.ctx?.req?.eim?.ids)
        global.events.person.doPing(this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()));
    const full = {
        ping: 'pong',
        version: cassVersion,
        time: new Date().getTime(),
        ssoViaP1: this.ctx.req.p1 ? true : null,
        ssoPublicKey: this.ctx.req.eim ? this.ctx.req.eim.ids[0].ppk.toPk().toPem() : undefined,
        ssoAdditionalPublicKeys: this.ctx.req.eim && this.ctx.req.eim.ids.length ? this.ctx.req.eim.ids.slice(1).map((identity) => identity.ppk.toPk().toPem()) : undefined,
        ssoLogin: this.ctx.req.oidc ? new URL('api/login', process.env.CASS_OIDC_BASE_URL || 'http://localhost/').toString() : undefined,
        ssoLogout: this.ctx.req.oidc ? new URL('api/logout', process.env.CASS_OIDC_BASE_URL || 'http://localhost/').toString() : undefined,
        banner: process.env.CASS_BANNER_MESSAGE ? {
            message: process.env.CASS_BANNER_MESSAGE, // string
            color: process.env.CASS_BANNER_TEXT_COLOR, // valid css color value
            background: process.env.CASS_BANNER_BACKGROUND_COLOR, // valid css color value
        } : undefined,
        motd: process.env.MOTD_MESSAGE ? {
            title: process.env.MOTD_TITLE,
            message: process.env.MOTD_MESSAGE,
        } : undefined,
        plugins: process.env.DEFAULT_PLUGINS ? process.env.DEFAULT_PLUGINS : undefined,
        adminPublicKeys: skyrepoAdminList(),
        corsOrigins: getCorsOrigins(),
        postMaxSize: global.postMaxSize,
        signatureSheetHashAlgorithm: 'SHA-256',
        fips: realCrypto.getFips(),
    };

    // When ?fields=field1,field2 is provided, return only those fields.
    // This reduces token overhead for MCP / AI callers that only need
    // a subset of the response (e.g. version and time).
    const fieldsParam = this.params?.fields;
    if (fieldsParam) {
        const requested = fieldsParam.split(',').map((f) => f.trim()).filter(Boolean);
        const filtered = {};
        for (const key of requested) {
            if (key in full) {
                filtered[key] = full[key];
            }
        }
        return JSON.stringify(filtered);
    }

    return JSON.stringify(full);
};


/**
 * @openapi
 * /api/ping:
 *   get:
 *     tags:
 *       - Infrastructure
 *     summary: Check server status and parameters
 *     description: Call this endpoint to verify that the server is online and to retrieve fundamental server configuration, time, and Single Sign-On (SSO) identity information if applicable.
 *     x-mcp-tool-name: server_status
 *     x-mcp-description: >
 *       Retrieve CaSS server status, version, current time, and configuration.
 *       Use this tool to check whether the server is online, get the server
 *       version, synchronize timestamps for signature sheets, or discover
 *       SSO login/logout URLs. Pass the 'fields' parameter with a
 *       comma-separated list of field names to reduce the response size.
 *     x-mcp-hints: >
 *       Common field sets:
 *       - Health check: fields=ping
 *       - Version info: fields=version,time
 *       - SSO discovery: fields=ssoLogin,ssoLogout,ssoPublicKey
 *       - Full config: omit the fields parameter.
 *       Available field names: ping, version, time, ssoViaP1, ssoPublicKey,
 *       ssoAdditionalPublicKeys, ssoLogin, ssoLogout, banner, motd, plugins,
 *       adminPublicKeys, corsOrigins, postMaxSize, signatureSheetHashAlgorithm, fips
 *     parameters:
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Comma-separated list of response field names to return. When omitted, all fields are returned. Use this to reduce response size for MCP or programmatic callers.
 *         example: version,time,fips
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Ping response
 *               required:
 *                 - ping
 *                 - version
 *                 - time
 *                 - adminPublicKeys
 *                 - postMaxSize
 *                 - signatureSheetHashAlgorithm
 *               properties:
 *                 ping:
 *                   type: string
 *                   description: Just a known value for ensuring the response isn't from something else.
 *                   example: pong
 *                 version:
 *                   type: string
 *                   description: Current CASS server version from package.json.
 *                   example: 1.6.21
 *                 time:
 *                   type: integer
 *                   description: The current number of milliseconds since the Unix epoch, for ensuring signature sheet signing can sign time-nonced signatures that will not be time-desynchronized with the server.
 *                   example: 1674857764808
 *                 ssoViaP1:
 *                   type: boolean
 *                   nullable: true
 *                   description: A flag indicating that the user logged in through a Platform One JWT.
 *                   example: true
 *                 ssoPublicKey:
 *                   type: string
 *                   description: When logged in with SSO, the public key of the first key in the keyring.
 *                   example: <public key>
 *                 ssoAdditionalPublicKeys:
 *                   type: array
 *                   description: When logged in with SSO, the public keys of keys past the first in the keyring.
 *                   items:
 *                     type: string
 *                   example: ["<public key>"]
 *                 ssoLogin:
 *                   type: string
 *                   description: When logged in with OIDC (or similar), the URL of the login redirect page, using CASS_OIDC_BASE_URL environment variable for the endpoint.
 *                   example: http://localhost/api/login
 *                 ssoLogout:
 *                   type: string
 *                   description: When logged in with OIDC (or similar), the URL of the logout redirect page, using CASS_OIDC_BASE_URL environment variable for the endpoint.
 *                   example: http://localhost/api/logout
 *                 banner:
 *                   type: object
 *                   required:
 *                     - message
 *                     - color
 *                     - background
 *                   description: If specified in CASS_BANNER_MESSAGE, CASS_BANNER_TEXT_COLOR, CASS_BANNER_BACKGROUND_COLOR environment variables communicated from the server.
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Banner text as specified by CASS_BANNER_MESSAGE environment variable.
 *                       example: <Security markings>
 *                     color:
 *                       type: string
 *                       description: CSS text color as specified by CASS_BANNER_TEXT_COLOR environment variable.
 *                       example: red
 *                     background:
 *                       type: string
 *                       description: CSS background color as specified by CASS_BANNER_BACKGROUND_COLOR environment variable.
 *                       example: yellow
 *                 motd:
 *                   type: object
 *                   description: If specified in MOTD_TITLE, MOTD_MESSAGE environment variables communicated from the server.
 *                   required:
 *                     - message
 *                     - title
 *                   properties:
 *                     title:
 *                       type: string
 *                       description: Message of the Day title as specified by MOTD_TITLE environment variable.
 *                       example: Message of the Day
 *                     message:
 *                       type: string
 *                       description: Message of the Day text as specified by MOTD_MESSAGE environment variable.
 *                       example: Have a good day!
 *                 plugins:
 *                   type: string
 *                   description: Default plugins to load, as specified by DEFAULT_PLUGINS environment variable.
 *                 adminPublicKeys:
 *                   type: array
 *                   description: Array of admin public keys
 *                   items:
 *                     type: string
 *                   example: ["<public key>"]
 *                 corsOrigins:
 *                   type: array
 *                   description: For which origins should the cass client include credentials for in its requests.
 *                   items:
 *                     type: string
 *                   example: ["http://localhost"]
 *                 postMaxSize:
 *                   type: number
 *                   description: Max size of fields and files in POST requests that this server can handle in bytes.
 *                 signatureSheetHashAlgorithm:
 *                   type: string
 *                   description: The hash algorithm used for signature sheet verification.
 *                   example: SHA-256
 *                 fips:
 *                   type: integer
 *                   description: FIPS mode status from OpenSSL crypto module. 0 means disabled, 1 means enabled.
 *                   example: 0
 */
bindWebService('/ping', pingWithTime);
