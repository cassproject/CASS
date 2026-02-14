/*
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

let startupDt = new Date();
global.auditLogger = require('./server/shims/auditLogger.js');
const express = require('express');
let app = global.app = express();
const https = require('https');
const spdy = require('spdy-fixes');
require('cassproject');
const fs = require('fs');
global.v8 = require('v8');
let glob = require('glob');
let path = require('path');
const sendMail = require('./server/shims/mailer.js').sendMail;

process.on('uncaughtException', async (err) => {
    await sendMail(`CaSS Server`, 'Uncaught Exception', `The CaSS Server at ${process.env.CASS_LOOPBACK} experienced an uncaught exception: ${err.stack}`);
    global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.EMERGENCY, 'uncaughtException', err.stack);
    global.auditLogger.flush();
    process.exit(1);
});

const baseUrl = global.baseUrl = process.env.CASS_BASE || '';
const envHttps = process.env.HTTPS != null ? process.env.HTTPS.trim() == 'true' : false;
const envHttp2 = process.env.HTTP2_SERVER != null ? process.env.HTTP2_SERVER.trim() == 'true' : true;
const port = global.port = process.env.PORT || (envHttps ? 443 : 80);
global.elasticEndpoint = process.env.ELASTICSEARCH_ENDPOINT || 'http://localhost:9200';
global.skyrepoDebug = process.env.SKYREPO_DEBUG || false;

let repo = global.repo = new EcRepository();
repo.selectedServer = process.env.CASS_LOOPBACK || (envHttps ? 'https://localhost/api/' : 'http://localhost/api/');
repo.selectedServerProxy = process.env.CASS_LOOPBACK_PROXY || null;

const compression = require('compression')
app.use(compression({}));

let corsOptions;
if (process.env.CORS_ORIGINS != null || process.env.CORS_CREDENTIALS != null) {
    corsOptions = {};

    if (process.env.CORS_CREDENTIALS != null) {
        corsOptions.credentials = process.env.CORS_CREDENTIALS.trim() == 'true';
    };

    if (process.env.CORS_ORIGINS != null) {
        try {
            corsOptions.origin = process.env.CORS_ORIGINS.split(',').map((x) => x.trim());
        } catch (e) {
            global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.ERROR, 'CorsConfigError', 'Misconfigured CORS_ORIGINS env var, ensure the value is a comma separated list of origins', e);
            process.exit(1);
        }
    }
}

const cors = require('cors');
app.use(cors(corsOptions));

global.disabledAdapters = {};
if (process.env.DISABLED_ADAPTERS) {
    let arr = process.env.DISABLED_ADAPTERS.split(',');
    for (let str of arr) {
        global.disabledAdapters[str.trim()] = 1;
    }
}

require('./server/shims/event.js');
require('./server/shims/ephemeral.js');
require('./server/shims/jobs.js');
require('./server/shims/mailer.js');
if (process.env.STATIC_NOAUTH != "true") {
    require("./server/shims/auth.js");
}
require('./server/shims/levr.js');
require('./server/shims/stjs.js');
require('./server/shims/cassproject.js');
require('./server/util.js');
require('./server/skyRepo.js');
require('./server/skyId.js');
require('./server/profile/coordinator.js')();

if (process.env.DISABLED_EDITOR != "true") {
    app.use(baseUrl, express.static('src/main/webapp/', { maxAge: 24 * 60 * 60 * 1000 }));
    app.use(baseUrl + "cass-editor/", express.static('src/main/webapp/', { maxAge: 24 * 60 * 60 * 1000 }));
}

if (process.env.STATIC_NOAUTH == "true") {
    require("./server/shims/auth.js");
}

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const banner = process.env.CASS_BANNER_MESSAGE ? {
    message: process.env.CASS_BANNER_MESSAGE, // string
    color: process.env.CASS_BANNER_TEXT_COLOR, // valid css color value
    background: process.env.CASS_BANNER_BACKGROUND_COLOR, // valid css color value
} : undefined;

const motd = process.env.MOTD_MESSAGE ? {
    title: process.env.MOTD_TITLE,
    message: process.env.MOTD_MESSAGE,
} : undefined;

let customJsStr = `
    let swaggerBody = document.getElementById('swagger-ui');
`;

if (banner && banner.message) {
    customJsStr += `
        let header = document.createElement('div');
        header.textContent = "${banner.message}";
        header.classList.add('banner');
        swaggerBody.parentElement.insertBefore(header, swaggerBody);
        let footer = document.createElement('div');
        footer.textContent = "${banner.message}";
        footer.classList.add('banner');
        footer.classList.add('banner-bot');
        swaggerBody.parentElement.parentElement.appendChild(footer);
    `;
}

if (motd && motd.message) {
    customJsStr += `
        let modal = document.createElement('div');
        modal.innerHTML = '<div id="motd-modal" class="modal is-active" data-v-248059c4=""><div class="modal-background"></div><div class="modal-card" role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDescription"><header id="modalTitle" class="modal-card-head"><p class="modal-card-title">${motd.title}</p><button class="delete close-modal" aria-label="close">&times;</button></header><section id="modalDescription" class="modal-card-body">${motd.message}</section><footer class="modal-card-foot"><div class="buttons is-right"><button class="button close-modal"> Cancel </button></div></footer></div></div>';
        swaggerBody.parentElement.insertBefore(modal, swaggerBody);
        var closeModalElements = document.querySelectorAll('.close-modal');

        // Add a click event listener to each element
        closeModalElements.forEach(function(element) {
            element.addEventListener('click', function() {
                document.getElementById('motd-modal').classList.remove("is-active");
            });
        });
    `;
}


const swaggerUiOptions = {
    customCss: `
    @import url("https://fonts.googleapis.com/css2?family=Roboto+Condensed&family=Roboto&display=swap");
    .banner {
        height: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        position: sticky;
        top: 0px;
        z-index: 30;
        background-color: ${banner ? banner.background : 'yellow'};
        color: ${banner ? banner.color : 'red'};
    }
    
    .banner-bot {
        position: fixed;
        bottom: 0px;
        top: unset;
    }
    .modal {
        position: fixed;
        display: none;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        overflow: hidden;
        z-index: 40;
        width: 100vw;
        height: 100vh;
        top: 0px;
        left: 0px;
    }
    .modal.is-active {
        display: flex;
    }
    .modal-background {
        bottom: 0;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        background-color: rgba(2, 42, 58, 0.86);
    }
    .modal-card {
        display: flex;
        flex-direction: column;
        max-height: calc(100vh - 40px);
        overflow: hidden;
        -ms-overflow-y: visible;
        margin: 0 auto;
        max-width: 640px;
        position: relative;
    }
    .modal-card-head {
        border-bottom: 1px solid hsl(0deg, 0%, 86%);
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        align-items: center;
        background-color: white;
        display: flex;
        flex-shrink: 0;
        justify-content: flex-start;
        padding: 20px;
        position: relative;
    }
    .modal-card-title {
        color: #022a3a;
        font-family: Roboto Condensed,"sans-serif";
        flex-grow: 1;
        flex-shrink: 0;
        font-size: 1.35rem;
        line-height: 1;
    }
    .delete {
        -moz-appearance: none;
        -webkit-appearance: none;
        background-color: rgba(2, 42, 58, 0.2);
        border: none;
        border-radius: 9999px;
        cursor: pointer;
        display: inline-flex;
        flex-grow: 0;
        flex-shrink: 0;
        font-size: 20px;
        height: 20px;
        max-height: 20px;
        max-width: 20px;
        min-height: 20px;
        min-width: 20px;
        outline: none;
        position: relative;
        vertical-align: top;
        justify-content: center;
        align-items: center;
        width: 20px;
        color: white;
        font-weight: bold;
    }
    .modal-card-body {
        -webkit-overflow-scrolling: touch;
        background-color: white;
        flex-grow: 1;
        flex-shrink: 1;
        overflow: auto;
        padding: 20px;
    }
    .modal-card-foot {
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
        border-top: 1px solid hsl(0deg, 0%, 86%);
        align-items: center;
        background-color: white;
        display: flex;
        flex-shrink: 0;
        justify-content: flex-start;
        padding: 20px;
        position: relative;
    }
    .buttons {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
    }
    .buttons.is-right {
        justify-content: flex-end;
        margin-bottom: -0.5rem;
    }
    .button {
        -moz-appearance: none;
        -webkit-appearance: none;
        align-items: center;
        border-radius: 4px;
        box-shadow: none;
        display: inline-flex;
        font-size: 0.9rem;
        height: 2.25em;
        justify-content: flex-start;
        line-height: 1.5;
        padding-bottom: calc(0.5em - 1px);
        padding-left: calc(0.75em - 1px);
        padding-right: calc(0.75em - 1px);
        padding-top: calc(0.5em - 1px);
        position: relative;
        vertical-align: top;
        background-color: white;
        border-color: hsl(0deg, 0%, 86%);
        border-width: 1px;
        color: #022a3a;
        cursor: pointer;
        justify-content: center;
        padding-bottom: calc(0.5em - 1px);
        padding-left: 1em;
        padding-right: 1em;
        padding-top: calc(0.5em - 1px);
        text-align: center;
        white-space: nowrap;
    }`,
    customJsStr: customJsStr,
    swaggerOptions: {
        syntaxHighlight: false
    }
};

const options = {
    definition: JSON.parse(fs.readFileSync('src/main/swagger.json') + ''),
    apis: ['./src/**/*.js']
};
const generatedSpec = swaggerJsdoc(options);

// Validate the OpenAPI spec at startup — exit if invalid.
const OpenApiSchemaValidator = require('openapi-schema-validator').default;
const specValidator = new OpenApiSchemaValidator({ version: 3 });
const specValidationResult = specValidator.validate(generatedSpec);
if (specValidationResult.errors.length > 0) {
    console.error('OpenAPI specification validation failed:');
    for (const err of specValidationResult.errors) {
        console.error(`  - ${err.instancePath || '/'}: ${err.message}`);
    }
    process.exit(1);
}

app.get('/api/swagger.json', (req, res, next) => {
    res.end(JSON.stringify(generatedSpec, null, 2));
});
app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(generatedSpec, swaggerUiOptions));
app.get('/api', (req, res, next) => {
    return res.redirect('/api/swagger');
});
app.get('/api/', (req, res, next) => {
    return res.redirect('swagger');
});

// Optional: validate every response against the OpenAPI spec (enable for testing).
if (process.env.VALIDATE_RESPONSES) {
    const OpenApiValidator = require('express-openapi-validator');
    app.use(OpenApiValidator.middleware({
        apiSpec: generatedSpec,
        validateRequests: false,
        validateResponses: true,
    }));
}

if (process.env.KILL) {
    app.get('/api/kill', (req, res, next) => {
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.EMERGENCY, 'CassExit', "Kill received. Exiting process.");
        res.statusCode = 200;
        res.write("Killing process.");
        res.end();
        setTimeout(() => {
            process.exit(0);
        }, 1000);
    });
}

if (process.env.DISABLED_EDITOR != 'true') {
    app.use(baseUrl, express.static('src/main/webapp/'));
    app.use(baseUrl + 'cass-editor/', express.static('src/main/webapp/'));
}

if (process.env.INCLUDE_SAMEORIGIN_IFRAME_HEADER == "true") {
    app.use((req, res, next) => {
        res.setHeader("X-Frame-Options", "SAMEORIGIN")
        next();
    });
}

if (process.env.INCLUDE_STRICT_TRANSPORT_SECURITY_HEADER == "true") {
    app.use((req, res, next) => {
        let forwardingProtocol = req.headers["x-forwarded-proto"];
        let forwardedSecurely = forwardingProtocol && forwardingProtocol === "https";
        if (forwardedSecurely || req.secure) {
            res.setHeader("Strict-Transport-Security", "max-age=31536000")
        }
        next();
    });
}

if (process.env.INCLUDE_MIME_NOSNIFF_HEADER == "true") {
    app.use((req, res, next) => {
        res.setHeader("X-Content-Type-Options", "nosniff");
        next();
    });
}

process.on('exit', () => {
    global.auditLogger.flush();
});

process.on('SIGTERM', function (code) {
    console.log('SIGTERM received...');
    server.close();
    global.auditLogger.flush();
    process.exit(code || 1);
});

global.events.server.listening.subscribe(async (isListening) => {
    if (!isListening) return;
    glob.sync('./src/main/server/cartridge/*.js').forEach(function (file) {
        require(path.resolve(file));
    });
    glob.sync('./src/main/server/cartridge/**/*.js').forEach(function (file) {
        require(path.resolve(file));
    });
    global.elasticSearchInfo = await httpGet(elasticEndpoint + '/', true, elasticHeaders());
    global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'CassListening', `CaSS listening at http${envHttps ? 's' : ''}://localhost:${port}${baseUrl}`);
    global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'CassEndpoint', `CaSS talks to itself at ${repo.selectedServer}`);
    if (repo.selectedServerProxy != null) {
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'CassLoopbackProxy', `CaSS thinks it its endpoint is at ${repo.selectedServerProxy}`);
    }
    global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'CassStartupTime', `Startup time ${(new Date().getTime() - startupDt.getTime())} ms`);
    let totalHeapSizeInGB = (((v8.getHeapStatistics().total_available_size) / 1024 / 1024 / 1024).toFixed(2));
    global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'CassHeapSize', `Total Heap Size ${totalHeapSizeInGB}GB`);
    global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'CassFipsEnabled', `FIPS Enabled: ${require('crypto').getFips()}`);
    global.events.server.ready.next(true);
});

global.events.database.connected.subscribe(async function (isConnected) {
    if (!isConnected) return;
    try {
        // Increase the number of fields for cass configurations
        let result = await httpPut({
            "index.mapping.total_fields.limit": 10000
        }, elasticEndpoint + '/schema.cassproject.org.0.4.configuration/_settings', "application/json", elasticHeaders());
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", JSON.stringify(result));
    } catch (e) {
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.ERROR, "SkyrepMigrate", 'Unable to increase configuration field limit', e);
    }

    try {
        // Increase the number of fields for competencies
        let result2 = await httpPut({
            "index.mapping.total_fields.limit": 10000
        }, elasticEndpoint + '/schema.cassproject.org.0.4.competency/_settings', "application/json", elasticHeaders());
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", JSON.stringify(result2));
    } catch (e) {
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.ERROR, "SkyrepMigrate", 'Unable to increase competency field limit', e);
    }

    if (envHttps) {
        global.ca = fs.readFileSync('ca.crt');
        let options = {
            key: fs.readFileSync('cass.key'),
            cert: fs.readFileSync('cass.crt'),
            ca: global.ca, // client auth ca OR cert
            requestCert: process.env.REQUEST_CLIENT_SIDE_CERTIFICATE == 'true' || false,
            rejectUnauthorized: process.env.CLIENT_SIDE_CERTIFICATE_ONLY == 'true' || false,
            allowHTTP1: true,
            secureProtocol: 'TLSv1_2_method',
        };
        // Load CRL Lists
        if (process.env.CRL_LISTS === 'true') {
            try {
                let paths = glob.sync('./src/main/server/crl/*.pem');
                let crls = paths.map(x => fs.readFileSync(path.resolve(x)));
                options.crl = crls;
                global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, "CRLList", `Loaded CRLs: ${paths}`);
            } catch (e) {
                global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.ERROR, "CRLListError", e);
            }
        }
        if (envHttp2) {
            global.server = spdy.createServer(options, app).listen(port, () => { global.events.server.listening.next(true); });
        } else {
            global.server = https.createServer(options, app).listen(port, () => { global.events.server.listening.next(true); });
        }
        if (process.env.HTTPS_REJECT_UNAUTHORIZED == 'false') {
            global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.WARNING, 'CassIgnoreUnauthorized', 'Accepting Unauthorized / Self-Signed HTTPS Certificates. This should only be used in testing mode or in an internal network.');
            process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
        }
    } else {
        global.server = app.listen(port, () => { global.events.server.listening.next(true); });
    }

    if (typeof process.env.MAX_CONNECTIONS !== 'undefined') {
        global.server.maxConnections = parseInt(process.env.MAX_CONNECTIONS);
    }
    server.on('connection', function (socket) {
        socket.setKeepAlive(true);
    });
    require('./server/websocket.js');
});

global.events.server.init.next();