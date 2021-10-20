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
require("cassproject");
const fs = require('fs');
const baseUrl = global.baseUrl = process.env.CASS_BASE || "";
const app = global.app = express();
const cors = require('cors');
const https = require('https');
app.use(cors());
const envHttps = process.env.HTTPS != null ? process.env.HTTPS.trim() == 'true' : false;
const port = process.env.PORT || (envHttps ? 443 : 80);

global.repo = new EcRepository();
repo.selectedServer = process.env.CASS_LOOPBACK || (envHttps ? "https://localhost/api/" : "http://localhost/api");
repo.selectedServerProxy = process.env.CASS_LOOPBACK_PROXY || null;
global.elasticEndpoint = process.env.ELASTICSEARCH_ENDPOINT || "http://localhost:9200";

global.skyrepoDebug = false;
global.thisEndpoint = function(){return repo.selectedServer;}
global.repoEndpoint = function(){return repo.selectedServer;}


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
//Tests remaining: Import concept schemes
require("./server/adapter/jsonLd/jsonLd.js");
require("./server/adapter/openbadges/openbadges.js");
require("./server/adapter/xapi/xapi.js");
require("./server/adapter/replicate/replicate.js");
require("./server/profile/coordinator.js")();

app.use(baseUrl,express.static('src/main/webapp/'));
app.use(baseUrl+"cass-editor/",express.static('src/main/webapp/'));

let v8 = require("v8");

skyrepoMigrate(function(){
    const after = async () => {    
        global.elasticSearchInfo = await httpGet(elasticEndpoint + "/", true);
        console.log(`CaSS listening at http${envHttps?'s':''}://localhost:${port}${baseUrl}`);
        console.log(`CaSS thinks it its endpoint is at ${repo.selectedServer}`);
        if (repo.selectedServerProxy != null)
            console.log(`CaSS talks to itself at ${repo.selectedServerProxy}`);
        global.replicate();
        console.log("Startup time " + (new Date().getTime() - startupDt.getTime()) + " ms");
        let totalHeapSizeInGB = (((v8.getHeapStatistics().total_available_size) / 1024 / 1024 / 1024).toFixed(2));
        console.log(`Total Heap Size ${totalHeapSizeInGB}GB`);
    };
    if (envHttps)
    {
        var options = {
            key: fs.readFileSync('cass.key'),
            cert: fs.readFileSync('cass.crt'),
            ca: global.ca = fs.readFileSync('ca.crt'), //client auth ca OR cert
            requestCert: process.env.REQUEST_CLIENT_SIDE_CERTIFICATE == 'true' || false,                   //new
            rejectUnauthorized: process.env.CLIENT_SIDE_CERTIFICATE_ONLY == 'true' || false            //new
        };
        global.server = https.createServer(options, app).listen(port, after);
        https.globalAgent.options.rejectUnauthorized = false;
    }
    else
        global.server = app.listen(port,after);
    require("./server/websocket.js");
});
