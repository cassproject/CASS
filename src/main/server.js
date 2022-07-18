/*-
 * --BEGIN_LICENSE--
 * Competency and Skills System
 * -----
 * Copyright (C) 2015 - 2021 Eduworks Corporation and other contributing parties.
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
const express = require('express');
const https = require('https');
const spdy = require('spdy');
const baseUrl = global.baseUrl = process.env.CASS_BASE || "";
const envHttp2 = process.env.HTTP2 != null ? process.env.HTTP2.trim() == 'true' : true;
let app = global.app = express();
if (!envHttp2)
{
    global.axios = require("axios"); //Pre-empt http2 use.
}
global.auditLogger = require('./server/shims/auditLogger.js');
require("cassproject");
const fs = require('fs');
const cors = require('cors');
app.use(cors());
const envHttps = process.env.HTTPS != null ? process.env.HTTPS.trim() == 'true' : false;
const port = process.env.PORT || (envHttps ? 443 : 80);

global.repo = new EcRepository();
repo.selectedServer = (process.env.CASS_LOOPBACK || (envHttps ? "https://localhost" : "http://localhost")) + "/api";
repo.selectedServerProxy = process.env.CASS_LOOPBACK_PROXY || null;

global.elasticEndpoint = process.env.ELASTICSEARCH_ENDPOINT || "http://localhost:9200";

global.skyrepoDebug = false;
global.thisEndpoint = function(){return repo.selectedServer;}
global.repoEndpoint = function(){return repo.selectedServer;}

global.blockPublicCreation = !!process.env.NO_PUBLIC;


global.disabledAdapters = {};
if (process.env.DISABLED_ADAPTERS) {
    let arr = process.env.DISABLED_ADAPTERS.split(',');
    for (let str of arr) {
        global.disabledAdapters[str.trim()] = 1;
    }
}

require('./server/shims/jobs.js');
require("./server/shims/mailer.js");
require("./server/shims/auth.js");
require("./server/shims/levr.js");
require("./server/shims/stjs.js");
require("./server/shims/cassproject.js");

//Tests remaining: Upgrade from elasticsearch 5.x to 6.x to 7.x
require("./server/util.js");
require('./server/skyRepo.js');
require('./server/skyId.js');

require("./server/adapter/asn/asn.js");
require("./server/adapter/case/caseAdapter.js");
require("./server/adapter/case/caseIngest.js");
require("./server/adapter/ceasn/ceasn.js");
require("./server/adapter/scd/scd.js");
//Tests remaining: Import concept schemes
require("./server/adapter/jsonLd/jsonLd.js");
require("./server/adapter/openbadges/openbadges.js");
require("./server/adapter/xapi/xapi.js");
require("./server/adapter/replicate/replicate.js");
require("./server/profile/coordinator.js")();

if (process.env.DISABLED_EDITOR != "true")
{
    app.use(baseUrl,express.static('src/main/webapp/'));
    app.use(baseUrl+"cass-editor/",express.static('src/main/webapp/'));
}

let v8 = require("v8");
let glob = require('glob');
let path = require('path');
const sendMail = require('./server/shims/mailer.js').sendMail;

process.on('uncaughtException', async (err) => {
    await sendMail(`CaSS Server`, 'Uncaught Exception', `The CaSS Server at ${process.env.CASS_LOOPBACK} experienced an uncaught exception: ${err.stack}`);
    global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.EMERGENCY, "uncaughtException", err.stack);
    global.auditLogger.flush();
    process.exit(1);
});
  
process.on('exit', () => {
    global.auditLogger.flush();
});

skyrepoMigrate(function(){
    const after = async () => {       
        global.elasticSearchInfo = await httpGet(elasticEndpoint + "/", true);
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, "CassListening", `CaSS listening at http${envHttps?'s':''}://localhost:${port}${baseUrl}`);
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, "CassEndpoint", `CaSS thinks it its endpoint is at ${repo.selectedServer}`);
        if (repo.selectedServerProxy != null)
            global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, "CassLoopbackProxy", `CaSS talks to itself at ${repo.selectedServerProxy}`);
        global.replicate();
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, "CassStartupTime", `Startup time ${(new Date().getTime() - startupDt.getTime())} ms`);
        let totalHeapSizeInGB = (((v8.getHeapStatistics().total_available_size) / 1024 / 1024 / 1024).toFixed(2));
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, "CassHeapSize", `Total Heap Size ${totalHeapSizeInGB}GB`);
        glob.sync( './src/main/server/cartridge/*.js' ).forEach( function( file ) {
            require( path.resolve( file ) );
        });
    };
    if (envHttps)
    {
        global.ca = fs.readFileSync('ca.crt');
        var options = {
            key: fs.readFileSync('cass.key'),
            cert: fs.readFileSync('cass.crt'),
            ca: global.ca, //client auth ca OR cert
            requestCert: process.env.REQUEST_CLIENT_SIDE_CERTIFICATE == 'true' || false,   
            rejectUnauthorized: process.env.CLIENT_SIDE_CERTIFICATE_ONLY == 'true' || false,      
            allowHTTP1: true
        };
        if (envHttp2) {
            global.server = spdy.createServer(options, app).listen(port, after);
        } else
            global.server = https.createServer(options, app).listen(port, after);
        if (process.env.HTTPS_REJECT_UNAUTHORIZED == 'false')
        {
            global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.WARNING, "CassIgnoreUnauthorized", "Ignoring Unauthorized / Self-Signed HTTPS Certificates. This should only be used in testing mode or in an internal network.");
            process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
        }
    }
    else
    {
        global.server = app.listen(port,after);
    }

    if (typeof process.env.MAX_CONNECTIONS !== 'undefined') {
        global.server.maxConnections = parseInt(process.env.MAX_CONNECTIONS);
    }

    server.on('connection', function(socket) {
        socket.setKeepAlive(true);
    })
    require("./server/websocket.js");

});
