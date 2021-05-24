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

const express = require('express');
require("cassproject");
const fs = require('fs');
const baseUrl = global.baseUrl = process.env.CASS_BASE || "";
const app = global.app = express();
const cors = require('cors');
app.use(cors());
const port = process.env.PORT || 80;
require("./server/websocket.js");

app.use(baseUrl,express.static('src/main/webapp/'));

global.repo = new EcRepository();
repo.selectedServer = process.env.CASS_LOOPBACK || "http://localhost/api/";
global.elasticEndpoint = process.env.ELASTICSEARCH_ENDPOINT || "http://localhost:9200";

global.skyrepoDebug = false;
global.thisEndpoint = function(){return repo.selectedServer;}
global.repoEndpoint = function(){return repo.selectedServer;}

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

skyrepoMigrate(function(){
    app.listen(port, async () => {    
        global.elasticSearchInfo = await httpGet(elasticEndpoint + "/", true);
        console.log(`CaSS listening at http://localhost:${port}${baseUrl}`);
        global.replicate();
    });
});
