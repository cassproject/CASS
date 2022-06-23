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

require("./shims/levr.js");
require("./shims/stjs.js");


global.skyrepoMigrate = async function (after) {
    var elasticState = await httpGet(elasticEndpoint + "/", true, global.elasticHeaders());
    if (elasticState == null)
    {
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, "SkyrepMigrate", "Waiting for Elasticsearch to appear at "+elasticEndpoint+"...");
        setTimeout(function(){skyrepoMigrate(after)},1000);
        return;
    }
    global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, "SkyrepMigrate", "Current Elasticsearch Version: " + elasticState.version.number);
    global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, "SkyrepMigrate", "Current Minimum Index Compatibility Version: " + elasticState.version.minimum_index_compatibility_version);
    var health = "red";
    health = (await httpGet(elasticEndpoint + "/_cluster/health",true, global.elasticHeaders())).status;
    if (health != "yellow" && health != "green")
    {
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, "SkyrepMigrate", "Waiting for cluster health...", health);
        setTimeout(function(){skyrepoMigrate(after)},1000);
        return;
    }
    if (elasticState.version.number.startsWith("7.") && elasticState.version.minimum_index_compatibility_version == "6.0.0-beta1")
    {
        var settings = await httpGet(elasticEndpoint + "/_settings", true, global.elasticHeaders());
        var indices = EcObject.keys(settings);
        for (var i = 0; i < indices.length; i++)
        {
            var index = indices[i];
            global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, "SkyrepMigrate", "Checking to see if " + index + " needs upgrading...");
            if (index.startsWith("."))
            {
                continue;
            }
            if (settings[index].settings.index.version.created != "6081299" && settings[index].settings.index.version.created != "6082199" && settings[index].settings.index.version.created != "6082299" && settings[index].settings.index.version.created != "6082399")
            {
                continue;
            }

//            if (index.indexOf("https:") != -1)
//            {
//                var r2 = null;
//                console.log(r2 = httpDelete(elasticEndpoint+"/"+index,true));
//                continue;
//            }
            global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, "SkyrepMigrate", "Reindexing " + index + " -> .temp."+index.replace("https:..","").replace(":","."));
            if (index == "permanent")
            {
                var mappings = new Object();
                var doc = new Object();
                (mappings)["mappings"] = doc;
                (doc)["enabled"] = false;
                var result = await httpPut(mappings, elasticEndpoint + "/.temp."+index.replace("https:..","").replace(":","."), "application/json", null, true, global.elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", JSON.stringify(result));
            }
            else if (index.endsWith("assertion"))
            {
                var mapping = await httpGet(elasticEndpoint + "/" + index + "/_mapping", true, global.elasticHeaders());
                var mappings = new Object();
                var doc = new Object();
                (mappings)["mappings"] = doc;
                (doc).properties = {
                    "@version":{type:"long"},
                    "confidence":{type:"float"},
                    "assertionDateDecrypted":{type:"long"}
                };
                var result = await httpPut(mappings, elasticEndpoint + "/.temp."+index.replace("https:..","").replace(":","."), "application/json", null, true, global.elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", JSON.stringify(result));
            }
            else if (index.endsWith("competency"))
            {
                var mapping = await httpGet(elasticEndpoint + "/" + index + "/_mapping", true, global.elasticHeaders());
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
                var result = await httpPut(mappings, elasticEndpoint + "/.temp."+index.replace("https:..","").replace(":","."), "application/json", null, true, global.elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", JSON.stringify(result));
            }
            else if (index.endsWith("conceptscheme"))
            {
                var mapping = await httpGet(elasticEndpoint + "/" + index + "/_mapping", true, global.elasticHeaders());
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
                var result = await httpPut(mappings, elasticEndpoint + "/.temp."+index.replace("https:..","").replace(":","."), "application/json", null, true, global.elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", JSON.stringify(result));
            }
            else
            {
                var mapping = await httpGet(elasticEndpoint + "/" + index + "/_mapping", true, global.elasticHeaders());
                var setting = await httpGet(elasticEndpoint + "/" + index + "/_settings", true, global.elasticHeaders());
                var fields = setting[index].settings?.index?.mapping?.total_fields.limit;
                if (!fields) {
                    fields = 1000;
                }
                var mappings = new Object();
                var doc = new Object();
                (mappings)["mappings"] = doc;
                (doc).properties = {"@version":{type:"long"}};
                mappings["settings"] = {"index.mapping.total_fields.limit": fields};
                var result = await httpPut(mappings, elasticEndpoint + "/.temp."+index.replace("https:..","").replace(":","."), "application/json", null, true, global.elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", JSON.stringify(result));
            }
            var r = null;
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", r = await httpPost(JSON.stringify({
                source:{index:index},
                dest:{index:".temp."+index.replace("https:..","").replace(":","."),version_type:"external"}
            }),elasticEndpoint+"/_reindex?refresh=true", "application/json", "false", global.elasticHeaders()));
            if (r.error != null) continue;
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", "Deleting " + index);
            var r2 = null;
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", r2 = await httpDelete(elasticEndpoint+"/"+index,true, global.elasticHeaders()));
            if (r2.error != null) continue;
            //if (r.total == 0) continue;
            if (index == "permanent")
            {
                var mappings = new Object();
                var doc = new Object();
                (mappings)["mappings"] = doc;
                (doc)["enabled"] = false;
                var result = await httpPut(mappings, elasticEndpoint + "/permanent", "application/json", null, true, global.elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", JSON.stringify(result));
            }
            else if (index.endsWith("competency"))
            {
                var mapping = await httpGet(elasticEndpoint + "/.temp." + index.replace("https:..","").replace(":",".") + "/_mapping", true, global.elasticHeaders());
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
                var result = await httpPut(mappings, elasticEndpoint + "/"+index.replace("https:..","").replace(":","."), "application/json", null, true, global.elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", JSON.stringify(result));
            }
            else if (index.endsWith("conceptscheme"))
            {
                var mapping = await httpGet(elasticEndpoint + "/.temp." + index.replace("https:..","").replace(":",".") + "/_mapping", true, global.elasticHeaders());
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
                var result = await httpPut(mappings, elasticEndpoint + "/"+index.replace("https:..","").replace(":","."), "application/json", null, true, global.elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", JSON.stringify(result));
            }
            else if (index.endsWith("assertion"))
            {
                var mapping = await httpGet(elasticEndpoint + "/.temp." + index.replace("https:..","").replace(":",".") + "/_mapping", true, global.elasticHeaders());
                var mappings = new Object();
                var doc = new Object();
                (mappings)["mappings"] = doc;
                (doc).properties = {
                    "@version":{type:"long"},
                    "confidence":{type:"float"},
                    "assertionDateDecrypted":{type:"long"}
                };
                var result = await httpPut(mappings, elasticEndpoint + "/"+index.replace("https:..","").replace(":","."), "application/json", null, true, global.elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", JSON.stringify(result));
            }
            else
            {
                var mapping = await httpGet(elasticEndpoint + "/.temp." + index.replace("https:..","").replace(":",".") + "/_mapping", true, global.elasticHeaders());
                var setting = await httpGet(elasticEndpoint + "/.temp." + index + "/_settings", true, global.elasticHeaders());
                var fields = setting[".temp." + index].settings?.index?.mapping?.total_fields.limit;
                if (!fields) {
                    fields = 1000;
                }
                var mappings = new Object();
                var doc = new Object();
                (mappings)["mappings"] = doc;
                (doc).properties = {"@version":{type:"long"}};
                mappings["settings"] = {"index.mapping.total_fields.limit": fields};
                var result = await httpPut(mappings, elasticEndpoint + "/"+index.replace("https:..","").replace(":","."), "application/json", null, true, global.elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", JSON.stringify(result));
            }
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", "Reindexing .temp." + index.replace("https:..","").replace(":",".") + " -> "+index.replace("https:..","").replace(":","."));
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", r = await httpPost(JSON.stringify({
                source:{index:".temp."+index.replace("https:..","").replace(":",".")},
                dest:{index:index.replace("https:..","").replace(":","."),version_type:"external"}
            }),elasticEndpoint+"/_reindex?refresh=true", "application/json", "false", global.elasticHeaders()));
            if (r.error != null) continue;
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", "Deleting .temp." + index.replace("https:..","").replace(":","."));
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", await httpDelete(elasticEndpoint+"/.temp."+index.replace("https:..","").replace(":","."),true));
        }
    }
    if (elasticState.version.number.startsWith("6.") && elasticState.version.minimum_index_compatibility_version == "5.0.0")
    {
        var settings = await httpGet(elasticEndpoint + "/_settings", true, global.elasticHeaders());
        var indices = EcObject.keys(settings);
        for (var i = 0; i < indices.length; i++)
        {
            var index = indices[i];
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", "Checking to see if " + index + " needs upgrading...");
            if (index.startsWith("."))
            {
                continue;
            }
            if (settings[index].settings.index.version.created != "5061299" && settings[index].settings.index.version.created != "5061699" && settings[index].settings.index.version.created != "5040099")
            {
                continue;
            }
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", "Reindexing " + index + " -> .temp."+index);
            if (index == "permanent")
            {
                var mappings = new Object();
                var permNoIndex = new Object();
                var doc = new Object();
                (mappings)["mappings"] = permNoIndex;
                (permNoIndex)["permanent"] = doc;
                (doc)["enabled"] = false;
                var result = await httpPut(mappings, elasticEndpoint + "/.temp."+index, "application/json", null, true, global.elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", JSON.stringify(result));
            }
            else if (index.endsWith("assertion"))
            {
                var mapping = await httpGet(elasticEndpoint + "/" + index + "/_mapping", true, global.elasticHeaders());
                var mappings = new Object();
                var permNoIndex = new Object();
                var doc = new Object();
                (mappings)["mappings"] = permNoIndex;
                if (EcObject.keys(mapping[index].mappings)[0]) {
                    (permNoIndex)[EcObject.keys(mapping[index].mappings)[0]] = doc;
                }
                (doc).properties = {
                    "@version":{type:"long"},
                    "confidence":{type:"float"},
                    "assertionDateDecrypted":{type:"long"}
                };
                var result = await httpPut(mappings, elasticEndpoint + "/.temp."+index, "application/json", null, true, global.elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", JSON.stringify(result));
            }
            else if (index.endsWith("competency"))
            {
                var mapping = await httpGet(elasticEndpoint + "/" + index + "/_mapping", true, global.elasticHeaders());
                var mappings = new Object();
                var permNoIndex = new Object();
                var doc = new Object();
                (mappings)["mappings"] = permNoIndex;
                if (EcObject.keys(mapping[index].mappings)[0]) {
                    (permNoIndex)[EcObject.keys(mapping[index].mappings)[0]] = doc;
                } else if (index.indexOf('encryptedvalue') !== -1) {
                    let substring = index.substring(0, index.lastIndexOf('.') + 1);
                    (permNoIndex)[substring + "EncryptedValue"] = doc;
                }
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
                var result = await httpPut(mappings, elasticEndpoint + "/.temp."+index, "application/json", null, true, global.elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", JSON.stringify(result));
            }
            else
            {
                var mapping = await httpGet(elasticEndpoint + "/" + index + "/_mapping", true, global.elasticHeaders());
                var setting = await httpGet(elasticEndpoint + "/" + index + "/_settings", true, global.elasticHeaders());
                var fields = setting[index].settings?.index?.mapping?.total_fields.limit;
                if (!fields) {
                    fields = 1000;
                }
                var mappings = new Object();
                var permNoIndex = new Object();
                var doc = new Object();
                (mappings)["mappings"] = permNoIndex;
                if (EcObject.keys(mapping[index].mappings)[0]) {
                    (permNoIndex)[EcObject.keys(mapping[index].mappings)[0]] = doc;
                }
                (doc).properties = {"@version":{type:"long"}};
                mappings["settings"] = {"index.mapping.total_fields.limit": fields};
                var result = await httpPut(mappings, elasticEndpoint + "/.temp."+index, "application/json", null, true, global.elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", JSON.stringify(result));
            }
            var r = null;
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", r = await httpPost(JSON.stringify({
                source:{index:index},
                dest:{index:".temp."+index,version_type:"external"}
            }),elasticEndpoint+"/_reindex?refresh=true", "application/json", "false", global.elasticHeaders()));
            if (r.error != null) continue;
            var r2 = null;
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", r2 = await httpDelete(elasticEndpoint+"/"+index,true, global.elasticHeaders()));
            if (r2.error != null) continue;
            //if (r.total == 0) continue;
            if (index == "permanent")
            {
                var mappings = new Object();
                var permNoIndex = new Object();
                var doc = new Object();
                (mappings)["mappings"] = permNoIndex;
                (permNoIndex)["permanent"] = doc;
                (doc)["enabled"] = false;
                var result = await httpPut(mappings, elasticEndpoint + "/permanent", "application/json", null, true, global.elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", JSON.stringify(result));
            }
            else if (index.endsWith("competency"))
            {
                var mapping = await httpGet(elasticEndpoint + "/.temp." + index + "/_mapping", true, global.elasticHeaders());
                var mappings = new Object();
                var permNoIndex = new Object();
                var doc = new Object();
                (mappings)["mappings"] = permNoIndex;
                if (EcObject.keys(mapping[".temp."+index].mappings)[0]) {
                    (permNoIndex)[EcObject.keys(mapping[".temp."+index].mappings)[0]] = doc;
                }
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
                var result = await httpPut(mappings, elasticEndpoint + "/"+index, "application/json", null, true, global.elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", JSON.stringify(result));
            }
            else if (index.endsWith("assertion"))
            {
                var mapping = await httpGet(elasticEndpoint + "/.temp." + index + "/_mapping", true, global.elasticHeaders());
                var mappings = new Object();
                var permNoIndex = new Object();
                var doc = new Object();
                (mappings)["mappings"] = permNoIndex;
                if (EcObject.keys(mapping[".temp."+index].mappings)[0]) {
                    (permNoIndex)[EcObject.keys(mapping[".temp."+index].mappings)[0]] = doc;
                }
                (doc).properties = {
                    "@version":{type:"long"},
                    "confidence":{type:"float"},
                    "assertionDateDecrypted":{type:"long"}
                };
                var result = await httpPut(mappings, elasticEndpoint + "/"+index, "application/json", null, true, global.elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", JSON.stringify(result));
            }
            else
            {
                var mapping = await httpGet(elasticEndpoint + "/.temp." + index + "/_mapping", true, global.elasticHeaders());
                var setting = await httpGet(elasticEndpoint + "/.temp." + index + "/_settings", true, global.elasticHeaders());
                var fields = setting[".temp." + index].settings?.index?.mapping?.total_fields.limit;
                if (!fields) {
                    fields = 1000;
                }
                var mappings = new Object();
                var permNoIndex = new Object();
                var doc = new Object();
                (mappings)["mappings"] = permNoIndex;
                if (EcObject.keys(mapping[".temp."+index].mappings)[0]) {
                    (permNoIndex)[EcObject.keys(mapping[".temp."+index].mappings)[0]] = doc;
                }
                (doc).properties = {"@version":{type:"long"}};
                mappings["settings"] = {"index.mapping.total_fields.limit": fields};
                var result = await httpPut(mappings, elasticEndpoint + "/"+index, "application/json", null, true, global.elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", JSON.stringify(result));
            }
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", "Reindexing .temp." + index + " -> "+index);
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", r = await httpPost(JSON.stringify({
                source:{index:".temp."+index},
                dest:{index:index,version_type:"external"}
            }),elasticEndpoint+"/_reindex?refresh=true", "application/json", "false"));
            if (r.error != null) continue;
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", "Deleting .temp." + index);
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepMigrate", await httpDelete(elasticEndpoint+"/.temp."+index,true, global.elasticHeaders()));
        }
    }
    after();
};

skyrepoReindex = async function () {
    if (this.params.debug != null)
        skyrepoDebug = true;
    if (this.params.secret.trim() !== skyIdSecret().trim())
        error("You must provide secret=`cat skyId.secret` to invoke reindex.", 401);

    var firstQueryPost = {
        query: {
            query_string: {query: "*:*"}
        },
        explain: "false",
        size: "50",
        sort: "_doc"
    };
    var firstQueryUrl = elasticEndpoint + "/permanent/_search?scroll=1m&version";
    var results = await httpPost(JSON.stringify(firstQueryPost), firstQueryUrl, "application/json", "false", global.elasticHeaders());
    var scroll = results["_scroll_id"];
    var counter = 0;
    while (results != null && scroll != null && scroll != "") {
        scroll = results["_scroll_id"];
        var hits = results.hits.hits;
        if (hits.length == 0)
            break;
        for (var i = 0; i < hits.length; i++) {
            let hit = hits[i];
			let id = hit._id;
            if(id.indexOf(".") == id.length-1) {
                if (++counter % 1000 == 0)
                    global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepReindex", "Reindexed " + counter + " records.");
                await skyrepoPutInternal.call(this,JSON.parse(hit["_source"].data), hit["_id"].replace("." + hit["_version"], "").replace(/\.$/, ""), null, hit["_type"]);
            }
        }
        results = await httpGet(elasticEndpoint + "/_search/scroll?scroll=1m&scroll_id=" + scroll, global.elasticHeaders());
    }
    global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepReindex", "Reindexed " + counter + " records.");
    if (this.params.debug != null)
        skyrepoDebug = false;
}
bindWebService("/util/reindex", skyrepoReindex);

// skyrepoBackup = function () {
//     if (this.params.secret != skyIdSecret())
//         error("You must provide secret=`cat skyId.secret` to invoke backup.", 401);
//     var backup = {permanent: {}, indexed: {}};
//     var settings = elasticMapping();
//     var indices = EcObject.keys(settings);

//     var firstQueryPost = {
//         query: {
//             query_string: {query: "*:*"}
//         },
//         explain: "false",
//         size: "50",
//         sort: "_doc"
//     };
//     var firstQueryUrl = elasticEndpoint + "/_search?scroll=1m&version";
//     var results = httpPost(JSON.stringify(firstQueryPost), firstQueryUrl, "application/json", "false");
//     var scroll = results["_scroll_id"];
//     while (results != null && scroll != null && scroll != "") {
//         scroll = results["_scroll_id"];
//         var hits = results.hits.hits;
//         if (hits.length == 0)
//             break;
//         for (var i = 0; i < hits.length; i++) {
//             var key = hits[i]["_type"] + "/" + hits[i]["_id"] + "/" + hits[i]["_version"];
//             if (hits[i]["_type"] == "permanent")
//                 if (backup.permanent[key] == null)
//                     backup.permanent[key] = hits[i]["_source"];
//                 else if (backup.indexed[key] == null)
//                     backup.indexed[key] = hits[i]["_source"];
//         }
//         results = httpPost(JSON.stringify({scroll:"1m",scroll_id:scroll}),elasticEndpoint + "/_search/scroll", "application/json", "false");
//     }
//     return JSON.stringify(backup, null, 2);
// }
// bindWebService("/util/backup", skyrepoBackup);

// skyrepoRestore = function () {
//     var log = [];
//     if (this.params.secret != skyIdSecret())
//         error("You must provide secret=`cat skyId.secret` to invoke a restore.", 401);

//     var file = getFileFromPost.call(this, "data");
//     if (file == undefined || file == null)
//         error("Unable to find restore file. Please attach via a multi part POST request with the name = 'data'.", 400);
//     if (EcArray.isArray(file))
//         file = file[0];
//     file = JSON.parse(fileToString(file));
//     var keys = EcObject.keys(file.indexed);
//     for (var i = 0; i < keys.length; i++) {
//         var parts = keys[i].split("/");
//         log.push(skyrepoPutInternalIndex(file.indexed[keys[i]], parts[1], parts[2], parts[0]));
//     }
//     keys = EcObject.keys(file.permanent);
//     for (var i = 0; i < keys.length; i++) {
//         var parts = keys[i].split("/");
//         log.push(skyrepoPutInternalPermanent(file.permanent[keys[i]], parts[1], parts[2], parts[0]));
//     }
//     return JSON.stringify(log, null, 2);
// }
// bindWebService("/util/restore", skyrepoRestore);
var skyIdSecret = ()=>{return loadConfigurationFile("skyId.secret", function() {
    return randomString(2048);
})}
skyrepoPurge = async function () {
    if (this.params.secret != skyIdSecret())
        error("You must provide secret=`cat skyId.secret` to invoke purge.", 401);
    var log = [];
    var settings = await httpGet(elasticEndpoint + "/_mapping", "application/json", null, true, global.elasticHeaders());
    var indices = EcObject.keys(settings);
    var types = [];
    for (var i = 0; i < indices.length; i++) {
        types = types.concat(EcObject.keys(settings[indices[i]].mappings));
        log.push(await httpDelete(elasticEndpoint + "/" + indices[i],true,global.elasticHeaders()));
    }
    return JSON.stringify(log, null, 2);
}
bindWebService("/util/purge", skyrepoPurge);
