/* -
 * --BEGIN_LICENSE--
 * Competency and Skills System
 * -----
 * Copyright (C) 2015 - 2025 Eduworks Corporation and other contributing parties.
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
const spdy = require('spdy');
require('cassproject');
const fs = require('fs');
let v8 = global.v8 = require('v8');
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
            global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.ERROR, 'CorsConfigError', 'Misconfigured CORS_ORIGINS env var, ensure the value is a comma separated list of origins',e);
            System.exit(1);
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
const options = {
    definition: JSON.parse(fs.readFileSync('src/main/swagger.json') + ''),
    apis: ['./src/**/*.js']
};
app.get('/api/swagger.json', (req, res, next) => {
    res.end(JSON.stringify(swaggerJsdoc(options), null, 2));
});
app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(options)));
app.get('/api', (req, res, next) => {
    return res.redirect('/api/swagger');
});
app.get('/api/', (req, res, next) => {
    return res.redirect('swagger');
});

if (process.env.KILL) {
    app.get('/api/kill', (req, res, next) => {
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.EMERGENCY, 'CassExit', "Kill received. Exiting process.");
        process.exit(0);
    });
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
    server.on('connection', function(socket) {
        socket.setKeepAlive(true);
    });
    require('./server/websocket.js');
});

global.events.server.init.next();