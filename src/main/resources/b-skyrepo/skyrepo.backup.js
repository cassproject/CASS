/*-
 * --BEGIN_LICENSE--
 * Competency and Skills System
 * -----
 * Copyright (C) 2015 - 2020 Eduworks Corporation and other contributing parties.
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

if (java.lang.System.getenv("ELASTICSEARCH_ENDPOINT") != null)
    elasticEndpoint = java.lang.System.getenv("ELASTICSEARCH_ENDPOINT");

skyrepoMigrate = function () {
    var elasticState = httpGet(elasticEndpoint + "/", true);
    console.log("Current Elasticsearch Version: " + elasticState.version.number);
    console.log("Current Minimum Index Compatibility Version: " + elasticState.version.minimum_index_compatibility_version);
    console.log("Waiting for cluster health...");
    var health = "red";
    while (health != "yellow" && health != "green")
    {
        health = httpGet(elasticEndpoint + "/_cluster/health",true).status;
        java.lang.Thread.sleep(1000);
        console.log(health);
    }
    if (elasticState.version.number == "7.9.2" && elasticState.version.minimum_index_compatibility_version == "6.0.0-beta1")
    {
        var settings = httpGet(elasticEndpoint + "/_settings", true);
        var indices = EcObject.keys(settings);
        for (var i = 0; i < indices.length; i++)
        {
            var index = indices[i];
            console.log("Checking to see if " + index + " needs upgrading...");
            if (index.startsWith("."))
            {
                continue;
            }
            if (settings[index].settings.index.version.created != "6081299")
            {
                continue;
            }

//            if (index.indexOf("https:") != -1)
//            {
//                var r2 = null;
//                console.log(r2 = httpDelete(elasticEndpoint+"/"+index,true));
//                continue;
//            }
            console.log("Reindexing " + index + " -> .temp."+index.replace("https:..","").replace(":","."));
            if (index == "permanent")
            {
                var mappings = new Object();
                var doc = new Object();
                (mappings)["mappings"] = doc;
                (doc)["enabled"] = false;
                var result = httpPut(mappings, elasticEndpoint + "/.temp."+index.replace("https:..","").replace(":","."), "application/json", null, true);
                    console.log(JSON.stringify(result));
            }
            else if (index.endsWith("assertion"))
            {
                var mapping = httpGet(elasticEndpoint + "/" + index + "/_mapping", true);
                var mappings = new Object();
                var doc = new Object();
                (mappings)["mappings"] = doc;
                (doc).properties = {
                    "@version":{type:"long"},
                    "confidence":{type:"float"}
                };
                var result = httpPut(mappings, elasticEndpoint + "/.temp."+index.replace("https:..","").replace(":","."), "application/json", null, true);
                console.log(JSON.stringify(result));
            }
            else if (index.endsWith("competency"))
            {
                var mapping = httpGet(elasticEndpoint + "/" + index + "/_mapping", true);
                var mappings = new Object();
                var doc = new Object();
                (mappings)["mappings"] = doc;
                (doc).properties = {
                    "@version":{type:"long"},
                    "ceasn:codedNotation":{
                        type:"text",
                        "fields": {
                            "keyword": {
                                "type": "keyword",
                                "ignore_above": 256
                            }
                        }
                    }
                };
                var result = httpPut(mappings, elasticEndpoint + "/.temp."+index.replace("https:..","").replace(":","."), "application/json", null, true);
                console.log(JSON.stringify(result));
            }
            else if (index.endsWith("conceptscheme"))
            {
                var mapping = httpGet(elasticEndpoint + "/" + index + "/_mapping", true);
                var mappings = new Object();
                var doc = new Object();
                (mappings)["mappings"] = doc;
                (doc).properties = {
                    "@version":{type:"long"},
                    "skos:hasTopConcept":{
                        type:"text",
                        "fields": {
                            "keyword": {
                                "type": "keyword",
                                "ignore_above": 256
                            }
                        }
                    }
                };
                var result = httpPut(mappings, elasticEndpoint + "/.temp."+index.replace("https:..","").replace(":","."), "application/json", null, true);
                console.log(JSON.stringify(result));
            }
            else
            {
                var mapping = httpGet(elasticEndpoint + "/" + index + "/_mapping", true);
                var mappings = new Object();
                var doc = new Object();
                (mappings)["mappings"] = doc;
                (doc).properties = {"@version":{type:"long"}};
                var result = httpPut(mappings, elasticEndpoint + "/.temp."+index.replace("https:..","").replace(":","."), "application/json", null, true);
                console.log(JSON.stringify(result));
            }
            var r = null;
            console.log(r = httpPost(JSON.stringify({
                source:{index:index},
                dest:{index:".temp."+index.replace("https:..","").replace(":","."),version_type:"external"}
            }),elasticEndpoint+"/_reindex?refresh=true", "application/json", "false"));
            if (r.error != null) continue;
            console.log("Deleting " + index);
            var r2 = null;
            console.log(r2 = httpDelete(elasticEndpoint+"/"+index,true));
            if (r2.error != null) continue;
            if (r.total == 0) continue;
            if (index == "permanent")
            {
                var mappings = new Object();
                var doc = new Object();
                (mappings)["mappings"] = doc;
                (doc)["enabled"] = false;
                var result = httpPut(mappings, elasticEndpoint + "/permanent", "application/json", null, true);
                    console.log(JSON.stringify(result));
            }
            else if (index.endsWith("competency"))
            {
                var mapping = httpGet(elasticEndpoint + "/.temp." + index.replace("https:..","").replace(":",".") + "/_mapping", true);
                var mappings = new Object();
                var doc = new Object();
                (mappings)["mappings"] = doc;
                (doc).properties = {
                    "@version":{type:"long"},
                    "ceasn:codedNotation":{
                        type:"text",
                        "fields": {
                            "keyword": {
                                "type": "keyword",
                                "ignore_above": 256
                            }
                        }
                    }
                };
                var result = httpPut(mappings, elasticEndpoint + "/"+index.replace("https:..","").replace(":","."), "application/json", null, true);
                console.log(JSON.stringify(result));
            }
            else if (index.endsWith("conceptscheme"))
            {
                var mapping = httpGet(elasticEndpoint + "/.temp." + index.replace("https:..","").replace(":",".") + "/_mapping", true);
                var mappings = new Object();
                var doc = new Object();
                (mappings)["mappings"] = doc;
                (doc).properties = {
                    "@version":{type:"long"},
                    "skos:hasTopConcept":{
                        type:"text",
                        "fields": {
                            "keyword": {
                                "type": "keyword",
                                "ignore_above": 256
                            }
                        }
                    }
                };
                var result = httpPut(mappings, elasticEndpoint + "/"+index.replace("https:..","").replace(":","."), "application/json", null, true);
                console.log(JSON.stringify(result));
            }
            else if (index.endsWith("assertion"))
            {
                var mapping = httpGet(elasticEndpoint + "/.temp." + index.replace("https:..","").replace(":",".") + "/_mapping", true);
                var mappings = new Object();
                var doc = new Object();
                (mappings)["mappings"] = doc;
                (doc).properties = {
                    "@version":{type:"long"},
                    "confidence":{type:"float"}
                };
                var result = httpPut(mappings, elasticEndpoint + "/"+index.replace("https:..","").replace(":","."), "application/json", null, true);
                console.log(JSON.stringify(result));
            }
            else
            {
                var mapping = httpGet(elasticEndpoint + "/.temp." + index.replace("https:..","").replace(":",".") + "/_mapping", true);
                var mappings = new Object();
                var doc = new Object();
                (mappings)["mappings"] = doc;
                (doc).properties = {"@version":{type:"long"}};
                var result = httpPut(mappings, elasticEndpoint + "/"+index.replace("https:..","").replace(":","."), "application/json", null, true);
                console.log(JSON.stringify(result));
            }
            console.log("Reindexing .temp." + index.replace("https:..","").replace(":",".") + " -> "+index.replace("https:..","").replace(":","."));
            console.log(r = httpPost(JSON.stringify({
                source:{index:".temp."+index.replace("https:..","").replace(":",".")},
                dest:{index:index.replace("https:..","").replace(":","."),version_type:"external"}
            }),elasticEndpoint+"/_reindex?refresh=true", "application/json", "false"));
            if (r.error != null) continue;
            console.log("Deleting .temp." + index.replace("https:..","").replace(":","."));
            console.log(httpDelete(elasticEndpoint+"/.temp."+index.replace("https:..","").replace(":","."),true));
        }
    }
    if (elasticState.version.number == "6.8.12" && elasticState.version.minimum_index_compatibility_version == "5.0.0")
    {
        var settings = httpGet(elasticEndpoint + "/_settings", true);
        var indices = EcObject.keys(settings);
        for (var i = 0; i < indices.length; i++)
        {
            var index = indices[i];
            console.log("Checking to see if " + index + " needs upgrading...");
            if (index.startsWith("."))
            {
                continue;
            }
            if (settings[index].settings.index.version.created != "5061299" && settings[index].settings.index.version.created != "5040099")
            {
                continue;
            }
            console.log("Reindexing " + index + " -> .temp."+index);
            if (index == "permanent")
            {
                var mappings = new Object();
                var permNoIndex = new Object();
                var doc = new Object();
                (mappings)["mappings"] = permNoIndex;
                (permNoIndex)["permanent"] = doc;
                (doc)["enabled"] = false;
                var result = httpPut(mappings, elasticEndpoint + "/.temp."+index, "application/json", null, true);
                    console.log(JSON.stringify(result));
            }
            else if (index.endsWith("assertion"))
            {
                var mapping = httpGet(elasticEndpoint + "/" + index + "/_mapping", true);
                var mappings = new Object();
                var permNoIndex = new Object();
                var doc = new Object();
                (mappings)["mappings"] = permNoIndex;
                (permNoIndex)[EcObject.keys(mapping[index].mappings)[0]] = doc;
                (doc).properties = {
                    "@version":{type:"long"},
                    "confidence":{type:"float"}
                };
                var result = httpPut(mappings, elasticEndpoint + "/.temp."+index, "application/json", null, true);
                console.log(JSON.stringify(result));
            }
            else if (index.endsWith("competency"))
            {
                var mapping = httpGet(elasticEndpoint + "/" + index + "/_mapping", true);
                var mappings = new Object();
                var permNoIndex = new Object();
                var doc = new Object();
                (mappings)["mappings"] = permNoIndex;
                (permNoIndex)[EcObject.keys(mapping[index].mappings)[0]] = doc;
                (doc).properties = {
                    "@version":{type:"long"},
                    "ceasn:codedNotation":{
                        type:"text",
                        "fields": {
                            "keyword": {
                                "type": "keyword",
                                "ignore_above": 256
                            }
                        }
                    }
                };
                var result = httpPut(mappings, elasticEndpoint + "/.temp."+index, "application/json", null, true);
                console.log(JSON.stringify(result));
            }
            else
            {
                var mapping = httpGet(elasticEndpoint + "/" + index + "/_mapping", true);
                var mappings = new Object();
                var permNoIndex = new Object();
                var doc = new Object();
                (mappings)["mappings"] = permNoIndex;
                (permNoIndex)[EcObject.keys(mapping[index].mappings)[0]] = doc;
                (doc).properties = {"@version":{type:"long"}};
                var result = httpPut(mappings, elasticEndpoint + "/.temp."+index, "application/json", null, true);
                console.log(JSON.stringify(result));
            }
            var r = null;
            console.log(r = httpPost(JSON.stringify({
                source:{index:index},
                dest:{index:".temp."+index,version_type:"external"}
            }),elasticEndpoint+"/_reindex?refresh=true", "application/json", "false"));
            if (r.error != null) continue;
            var r2 = null;
            console.log(r2 = httpDelete(elasticEndpoint+"/"+index,true));
            if (r2.error != null) continue;
            if (r.total == 0) continue;
            if (index == "permanent")
            {
                var mappings = new Object();
                var permNoIndex = new Object();
                var doc = new Object();
                (mappings)["mappings"] = permNoIndex;
                (permNoIndex)["permanent"] = doc;
                (doc)["enabled"] = false;
                var result = httpPut(mappings, elasticEndpoint + "/permanent", "application/json", null, true);
                    console.log(JSON.stringify(result));
            }
            else if (index.endsWith("competency"))
            {
                var mapping = httpGet(elasticEndpoint + "/.temp." + index + "/_mapping", true);
                var mappings = new Object();
                var permNoIndex = new Object();
                var doc = new Object();
                (mappings)["mappings"] = permNoIndex;
                (permNoIndex)[EcObject.keys(mapping[".temp."+index].mappings)[0]] = doc;
                (doc).properties = {
                    "@version":{type:"long"},
                    "ceasn:codedNotation":{
                        type:"text",
                        "fields": {
                            "keyword": {
                                "type": "keyword",
                                "ignore_above": 256
                            }
                        }
                    }
                };
                var result = httpPut(mappings, elasticEndpoint + "/"+index, "application/json", null, true);
                console.log(JSON.stringify(result));
            }
            else if (index.endsWith("assertion"))
            {
                var mapping = httpGet(elasticEndpoint + "/.temp." + index + "/_mapping", true);
                var mappings = new Object();
                var permNoIndex = new Object();
                var doc = new Object();
                (mappings)["mappings"] = permNoIndex;
                (permNoIndex)[EcObject.keys(mapping[".temp."+index].mappings)[0]] = doc;
                (doc).properties = {
                    "@version":{type:"long"},
                    "confidence":{type:"float"}
                };
                var result = httpPut(mappings, elasticEndpoint + "/"+index, "application/json", null, true);
                console.log(JSON.stringify(result));
            }
            else
            {
                var mapping = httpGet(elasticEndpoint + "/.temp." + index + "/_mapping", true);
                var mappings = new Object();
                var permNoIndex = new Object();
                var doc = new Object();
                (mappings)["mappings"] = permNoIndex;
                (permNoIndex)[EcObject.keys(mapping[".temp."+index].mappings)[0]] = doc;
                (doc).properties = {"@version":{type:"long"}};
                var result = httpPut(mappings, elasticEndpoint + "/"+index, "application/json", null, true);
                console.log(JSON.stringify(result));
            }
            console.log("Reindexing .temp." + index + " -> "+index);
            console.log(r = httpPost(JSON.stringify({
                source:{index:".temp."+index},
                dest:{index:index,version_type:"external"}
            }),elasticEndpoint+"/_reindex?refresh=true", "application/json", "false"));
            if (r.error != null) continue;
            console.log("Deleting .temp." + index);
            console.log(httpDelete(elasticEndpoint+"/.temp."+index,true));
        }
    }
    if (!fileExists("skyrepo"))
        return;
    var settings = elasticMapping();
    var indices = EcObject.keys(settings);
    var types = idxIndices(".", "skyrepo");
    for (var i = 0; i < indices.length; i++)
        types = types.concat(EcObject.keys(settings[indices[i]].mappings));
    for (var i = 0; i < types.length; i++) {
        try {
            var counter = 0;
            var keys = idxKeys(".", "skyrepo", types[i]);
            for (var j = 0; j < keys.length; j++) {
                if (++counter % 100 == 0)
                    console.log(types[i] + ": Migrated " + counter + "/" + keys.length + " versions of records out of local database and into ElasticSearch.");
                var data = JSON.parse(idxGet(".", "skyrepo", types[i], keys[j]));
                var split = [keys[j].substring(0, keys[j].lastIndexOf("/")), keys[j].substring(keys[j].lastIndexOf("/") + 1)];
                skyrepoPutInternalPermanent(data, split[0], split[1], types[i]);
                if (skyrepoGetPermanent(split[0], split[1], types[i])["found"] == false) {
                    console.log("Failed to migrate record. Halting. " + [split[0], split[1], types[i], JSON.stringify(data, null, 2), JSON.stringify(skyrepoGetPermanent(split[0], split[1], types[i]), null, 2)]);
                }
            }
        }
        catch (e) {
            console.log("Could not migrate " + types[i]);
        }
    }
    if (counter > 0) {
        fileSave(fileLoad("skyrepo"), "skyrepoOld");
        fileDelete("skyrepo");
        fileSave(fileLoad("skyrepo.p"), "skyrepoOld.p");
        fileDelete("skyrepo.p");
        fileSave(fileLoad("skyrepo.t"), "skyrepoOld.t");
        fileDelete("skyrepo.t");
    }
};

var skyrepoMigrateAutoExecute = skyrepoMigrate;

skyrepoReindex = function () {
    skyrepoDebug = true;
    if (this.params.secret != skyIdSecret())
        error("You must provide secret=`cat skyId.secret` to invoke reindex.", 401);

    var firstQueryPost = {
        query: {
            query_string: {query: "*:*"}
        },
        explain: "false",
        size: "50",
        sort: "_doc"
    };
    var firstQueryUrl = elasticEndpoint + "/_search?scroll=1m&version";
    var results = httpPost(JSON.stringify(firstQueryPost), firstQueryUrl, "application/json", "false");
    var scroll = results["_scroll_id"];
    var counter = 0;
    while (results != null && scroll != null && scroll != "") {
        scroll = results["_scroll_id"];
        var hits = results.hits.hits;
        if (hits.length == 0)
            break;
        for (var i = 0; i < hits.length; i++) {
            if (++counter % 1000 == 0)
                console.log("Reindexed " + counter + " records.");
            if (hits[i]["_type"] == "permanent") {
                skyrepoPutInternalPermanent(JSON.parse(hits[i]["_source"].data), hits[i]["_id"].replace("." + hits[i]["_version"], "").replace(/\.$/, ""), hits[i]["_version"], hits[i]["_type"]);
            }
        }
        results = httpGet(elasticEndpoint + "/_search/scroll?scroll=1m&scroll_id=" + scroll);
    }
    skyrepoDebug = false;
}
bindWebService("/util/reindex", skyrepoReindex);

skyrepoBackup = function () {
    if (this.params.secret != skyIdSecret())
        error("You must provide secret=`cat skyId.secret` to invoke backup.", 401);
    var backup = {permanent: {}, indexed: {}};
    var settings = elasticMapping();
    var indices = EcObject.keys(settings);

    var firstQueryPost = {
        query: {
            query_string: {query: "*:*"}
        },
        explain: "false",
        size: "50",
        sort: "_doc"
    };
    var firstQueryUrl = elasticEndpoint + "/_search?scroll=1m&version";
    var results = httpPost(JSON.stringify(firstQueryPost), firstQueryUrl, "application/json", "false");
    var scroll = results["_scroll_id"];
    while (results != null && scroll != null && scroll != "") {
        scroll = results["_scroll_id"];
        var hits = results.hits.hits;
        if (hits.length == 0)
            break;
        for (var i = 0; i < hits.length; i++) {
            var key = hits[i]["_type"] + "/" + hits[i]["_id"] + "/" + hits[i]["_version"];
            if (hits[i]["_type"] == "permanent")
                if (backup.permanent[key] == null)
                    backup.permanent[key] = hits[i]["_source"];
                else if (backup.indexed[key] == null)
                    backup.indexed[key] = hits[i]["_source"];
        }
        results = httpPost(JSON.stringify({scroll:"1m",scroll_id:scroll}),elasticEndpoint + "/_search/scroll", "application/json", "false");
    }
    return JSON.stringify(backup, null, 2);
}
bindWebService("/util/backup", skyrepoBackup);

skyrepoRestore = function () {
    var log = [];
    if (this.params.secret != skyIdSecret())
        error("You must provide secret=`cat skyId.secret` to invoke a restore.", 401);

    var file = getFileFromPost.call(this, "data");
    if (file == undefined || file == null)
        error("Unable to find restore file. Please attach via a multi part POST request with the name = 'data'.", 400);
    if (EcArray.isArray(file))
        file = file[0];
    file = JSON.parse(fileToString(file));
    var keys = EcObject.keys(file.indexed);
    for (var i = 0; i < keys.length; i++) {
        var parts = keys[i].split("/");
        log.push(skyrepoPutInternalIndex(file.indexed[keys[i]], parts[1], parts[2], parts[0]));
    }
    keys = EcObject.keys(file.permanent);
    for (var i = 0; i < keys.length; i++) {
        var parts = keys[i].split("/");
        log.push(skyrepoPutInternalPermanent(file.permanent[keys[i]], parts[1], parts[2], parts[0]));
    }
    return JSON.stringify(log, null, 2);
}
bindWebService("/util/restore", skyrepoRestore);

skyrepoPurge = function () {
    if (this.params.secret != skyIdSecret())
        error("You must provide secret=`cat skyId.secret` to invoke purge.", 401);
    var log = [];
    var settings = elasticMapping();
    var indices = EcObject.keys(settings);
    var types = [];
    for (var i = 0; i < indices.length; i++) {
        types = types.concat(EcObject.keys(settings[indices[i]].mappings));
        log.push(httpDelete(elasticEndpoint + "/" + indices[i]));
    }
    return JSON.stringify(log, null, 2);
}
bindWebService("/util/purge", skyrepoPurge);
