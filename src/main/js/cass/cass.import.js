/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
var PapaParseParams = function() {};
PapaParseParams = stjs.extend(PapaParseParams, null, [], function(constructor, prototype) {
    prototype.complete = null;
    prototype.error = null;
}, {complete: {name: "Callback1", arguments: ["Object"]}, error: {name: "Callback1", arguments: ["Object"]}}, {});
var Importer = function() {};
Importer = stjs.extend(Importer, null, [], function(constructor, prototype) {
    constructor.isObject = function(obj) {
        return toString.call(obj) == "[object Object]";
    };
    constructor.isArray = function(obj) {
        return toString.call(obj) == "[object Array]";
    };
}, {}, {});
var MedbiqImport = function() {
    Importer.call(this);
};
MedbiqImport = stjs.extend(MedbiqImport, Importer, [], function(constructor, prototype) {
    constructor.medbiqXmlCompetencies = null;
    constructor.INCREMENTAL_STEP = 5;
    constructor.medbiqXmlLookForCompetencyObject = function(obj) {
        if (Importer.isObject(obj) || Importer.isArray(obj)) 
            for (var key in (obj)) {
                if (key == "CompetencyObject") 
                    MedbiqImport.medbiqXmlParseCompetencyObject((obj)[key]);
                 else 
                    MedbiqImport.medbiqXmlLookForCompetencyObject((obj)[key]);
            }
    };
    constructor.medbiqXmlParseCompetencyObject = function(obj) {
        if (Importer.isArray(obj)) {
            for (var key in (obj)) {
                MedbiqImport.medbiqXmlParseCompetencyObject((obj)[key]);
            }
        } else {
            var newCompetency = new EcCompetency();
            if ((obj)["lom"] != null && ((obj)["lom"])["general"] != null) {
                newCompetency.name = ((((obj)["lom"])["general"])["title"])["string"].toString();
                if ((((obj)["lom"])["general"])["description"] != null) 
                    newCompetency.description = ((((obj)["lom"])["general"])["description"])["string"].toString();
                if ((((obj)["lom"])["general"])["identifier"] != null) 
                    newCompetency.url = ((((obj)["lom"])["general"])["identifier"])["entry"].toString();
                if (newCompetency.description == null) 
                    newCompetency.description = "";
                MedbiqImport.medbiqXmlCompetencies.push(newCompetency);
            }
        }
    };
    constructor.analyzeFile = function(file, success, failure) {
        if (file == null) {
            failure("No file to analyze");
            return;
        }
        if ((file)["name"] == null) {
            failure("Invalid file");
            return;
        } else if (!((file)["name"]).endsWith(".xml")) {
            failure("Invalid file type");
            return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            var result = ((e)["target"])["result"];
            var jsonObject = new X2JS().xml_str2json(result);
            MedbiqImport.medbiqXmlCompetencies = [];
            MedbiqImport.medbiqXmlLookForCompetencyObject(jsonObject);
            success(MedbiqImport.medbiqXmlCompetencies);
        };
        reader.onerror = function(p1) {
            failure("Error Reading File");
        };
        reader.readAsText(file);
    };
    constructor.progressObject = null;
    constructor.saved = 0;
    constructor.importCompetencies = function(serverUrl, owner, success, failure, incremental) {
        MedbiqImport.progressObject = null;
        MedbiqImport.saved = 0;
        for (var i = 0; i < MedbiqImport.medbiqXmlCompetencies.length; i++) {
            var comp = MedbiqImport.medbiqXmlCompetencies[i];
            comp.generateId(serverUrl);
            if (owner != null) 
                comp.addOwner(owner.ppk.toPk());
            comp.save(function(p1) {
                MedbiqImport.saved++;
                if (MedbiqImport.saved % MedbiqImport.INCREMENTAL_STEP == 0) {
                    if (MedbiqImport.progressObject == null) 
                        MedbiqImport.progressObject = new Object();
                    (MedbiqImport.progressObject)["competencies"] = MedbiqImport.saved;
                    incremental(MedbiqImport.progressObject);
                }
                if (MedbiqImport.saved == MedbiqImport.medbiqXmlCompetencies.length) {
                    if (MedbiqImport.progressObject == null) 
                        MedbiqImport.progressObject = new Object();
                    (MedbiqImport.progressObject)["competencies"] = MedbiqImport.saved;
                    incremental(MedbiqImport.progressObject);
                    success(MedbiqImport.medbiqXmlCompetencies);
                }
            }, function(p1) {
                failure("Failed to Save Competency");
            });
        }
    };
}, {medbiqXmlCompetencies: {name: "Array", arguments: ["EcCompetency"]}, progressObject: "Object"}, {});
var CSVImport = function() {};
CSVImport = stjs.extend(CSVImport, null, [], function(constructor, prototype) {
    constructor.INCREMENTAL_STEP = 5;
    constructor.analyzeFile = function(file, success, failure) {
        if (file == null) {
            failure("No file to analyze");
            return;
        }
        if ((file)["name"] == null) {
            failure("Invalid file");
        } else if (!((file)["name"]).endsWith(".csv")) {
            failure("Invalid file type");
        }
        Papa.parse(file, {complete: function(results) {
            var tabularData = (results)["data"];
            success(tabularData);
        }, error: failure});
    };
    constructor.importCsvLookup = null;
    constructor.saved = 0;
    constructor.progressObject = null;
    constructor.transformId = function(oldId, newObject, selectedServer) {
        if (oldId.indexOf("http") != -1) {
            var parts = (oldId).split("/");
            var guid = null;
            var timestamp = null;
            var pattern = new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$", "i");
            for (var i = 0; i < parts.length; i++) {
                if (!isNaN(parseInt(parts[i]))) 
                    timestamp = parts[i];
                 else if (pattern.test(parts[i])) 
                    guid = parts[i];
            }
            if (guid == null) 
                newObject.assignId(selectedServer, parts[parts.length - 2]);
             else 
                newObject.assignId(selectedServer, guid);
        } else 
            newObject.assignId(selectedServer, oldId);
    };
    constructor.importCompetencies = function(file, serverUrl, owner, nameIndex, descriptionIndex, scopeIndex, idIndex, relations, sourceIndex, relationTypeIndex, destIndex, success, failure, incremental) {
        CSVImport.progressObject = null;
        CSVImport.importCsvLookup = new Object();
        if (nameIndex < 0) {
            failure("Name Index not Set");
            return;
        }
        var competencies = [];
        Papa.parse(file, {complete: function(results) {
            var tabularData = (results)["data"];
            for (var i = 1; i < tabularData.length; i++) {
                var competency = new EcCompetency();
                if (tabularData[i][nameIndex] == null || tabularData[i][nameIndex] == "") {
                    failure("One or more names is blank or could not be found in the CSV.");
                    return;
                }
                competency.name = tabularData[i][nameIndex];
                if (descriptionIndex >= 0) 
                    competency.description = tabularData[i][descriptionIndex];
                if (scopeIndex >= 0) 
                    competency.scope = tabularData[i][scopeIndex];
                var shortId = null;
                if (idIndex != null && idIndex >= 0) {
                    competency.id = tabularData[i][idIndex];
                    shortId = competency.shortId();
                }
                if (idIndex != null && idIndex >= 0) 
                    CSVImport.transformId(tabularData[i][idIndex], competency, serverUrl);
                 else 
                    competency.generateId(serverUrl);
                if (idIndex != null && idIndex >= 0) 
                    (CSVImport.importCsvLookup)[tabularData[i][idIndex]] = competency.shortId();
                (CSVImport.importCsvLookup)[competency.name] = competency.shortId();
                if (shortId != null && idIndex >= 0) 
                    (CSVImport.importCsvLookup)[shortId] = competency.shortId();
                if (owner != null) 
                    competency.addOwner(owner.ppk.toPk());
                competencies.push(competency);
            }
            CSVImport.saved = 0;
            for (var i = 0; i < competencies.length; i++) {
                var comp = competencies[i];
                comp.save(function(results) {
                    CSVImport.saved++;
                    if (CSVImport.saved % CSVImport.INCREMENTAL_STEP == 0) {
                        if (CSVImport.progressObject == null) 
                            CSVImport.progressObject = new Object();
                        (CSVImport.progressObject)["competencies"] = CSVImport.saved;
                        incremental(CSVImport.progressObject);
                    }
                    if (CSVImport.saved == competencies.length) {
                        if (relations == null) 
                            success(competencies, new Array());
                         else 
                            CSVImport.importRelations(serverUrl, owner, relations, sourceIndex, relationTypeIndex, destIndex, competencies, success, failure, incremental);
                    }
                }, function(results) {
                    failure("Failed to save competency");
                    for (var j = 0; j < competencies.length; j++) {
                        competencies[j]._delete(null, null, null);
                    }
                });
            }
        }, error: failure});
    };
    constructor.importRelations = function(serverUrl, owner, file, sourceIndex, relationTypeIndex, destIndex, competencies, success, failure, incremental) {
        var relations = new Array();
        if (sourceIndex == null || sourceIndex < 0) {
            failure("Source Index not Set");
            return;
        }
        if (relationTypeIndex == null || relationTypeIndex < 0) {
            failure("Relation Type Index not Set");
            return;
        }
        if (destIndex == null || destIndex < 0) {
            failure("Destination Index not Set");
            return;
        }
        Papa.parse(file, {complete: function(results) {
            var tabularData = (results)["data"];
            for (var i = 1; i < tabularData.length; i++) {
                var alignment = new EcAlignment();
                var sourceKey = tabularData[i][sourceIndex];
                var relationTypeKey = tabularData[i][relationTypeIndex];
                var destKey = tabularData[i][destIndex];
                if ((CSVImport.importCsvLookup)[sourceKey] == null) 
                    return;
                if ((CSVImport.importCsvLookup)[destKey] == null) 
                    return;
                alignment.source = (CSVImport.importCsvLookup)[sourceKey];
                alignment.relationType = relationTypeKey;
                alignment.target = (CSVImport.importCsvLookup)[destKey];
                alignment.addOwner(owner.ppk.toPk());
                alignment.generateId(serverUrl);
                relations.push(alignment);
            }
            CSVImport.saved = 0;
            for (var i = 0; i < relations.length; i++) {
                var comp = relations[i];
                comp.save(function(results) {
                    CSVImport.saved++;
                    if (CSVImport.saved % CSVImport.INCREMENTAL_STEP == 0) {
                        if (CSVImport.progressObject == null) 
                            CSVImport.progressObject = new Object();
                        (CSVImport.progressObject)["relations"] = CSVImport.saved;
                        incremental(CSVImport.progressObject);
                        incremental(CSVImport.saved);
                    }
                    if (CSVImport.saved == relations.length) {
                        success(competencies, relations);
                    }
                }, function(results) {
                    failure("Failed to save competency or relation");
                    for (var j = 0; j < competencies.length; j++) {
                        competencies[j]._delete(null, null, null);
                    }
                    for (var j = 0; j < relations.length; j++) {
                        relations[j]._delete(null, null);
                    }
                });
            }
        }, error: failure});
    };
}, {importCsvLookup: "Object", progressObject: "Object"}, {});
var ASNImport = function() {
    Importer.call(this);
};
ASNImport = stjs.extend(ASNImport, Importer, [], function(constructor, prototype) {
    constructor.INCREMENTAL_STEP = 5;
    constructor.jsonFramework = null;
    constructor.frameworkUrl = null;
    constructor.jsonCompetencies = null;
    constructor.competencyCount = 0;
    constructor.relationCount = 0;
    constructor.asnJsonPrime = function(obj, key) {
        var value = (obj)[key];
        if (Importer.isObject(value)) {
            if ((value)["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"] != null) {
                var stringVal = (((value)["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"])["0"])["value"];
                if (stringVal == "http://purl.org/ASN/schema/core/Statement") {
                    ASNImport.jsonCompetencies[key] = value;
                    ASNImport.competencyCount++;
                    var children = (value)["http://purl.org/gem/qualifiers/hasChild"];
                    if (children != null) 
                        for (var j = 0; j < children.length; j++) {
                            ASNImport.relationCount++;
                            ASNImport.asnJsonPrime(obj, (children[j])["value"]);
                        }
                }
            }
        }
    };
    constructor.lookThroughSource = function(obj) {
        ASNImport.competencyCount = 0;
        ASNImport.relationCount = 0;
        for (var key in (obj)) {
            var value = (obj)[key];
            if (Importer.isObject(value)) {
                if ((value)["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"] != null) {
                    var stringVal = (((value)["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"])["0"])["value"];
                    if (stringVal == "http://purl.org/ASN/schema/core/StandardDocument") {
                        ASNImport.jsonFramework = value;
                        ASNImport.frameworkUrl = key;
                        var children = (value)["http://purl.org/gem/qualifiers/hasChild"];
                        if (children != null) 
                            for (var j = 0; j < children.length; j++) {
                                ASNImport.asnJsonPrime(obj, (children[j])["value"]);
                            }
                    }
                }
            }
        }
    };
    constructor.analyzeFile = function(file, success, failure) {
        if (file == null) {
            failure("No file to analyze");
            return;
        }
        if ((file)["name"] == null) {
            failure("Invalid file");
            return;
        } else if (!((file)["name"]).endsWith(".json")) {
            failure("Invalid file type");
            return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            var result = ((e)["target"])["result"];
            var jsonObj = JSON.parse(result);
            ASNImport.jsonCompetencies = {};
            ASNImport.jsonFramework = null;
            ASNImport.frameworkUrl = "";
            ASNImport.lookThroughSource(jsonObj);
            if (ASNImport.jsonFramework == null) {
                failure("Could not find StandardDocument.");
            } else {
                success(ASNImport.jsonCompetencies);
            }
        };
        reader.readAsText(file);
    };
    constructor.importedFramework = null;
    constructor.competencies = null;
    constructor.progressObject = null;
    constructor.importCompetencies = function(serverUrl, owner, createFramework, success, failure, incremental) {
        ASNImport.competencies = {};
        if (createFramework) {
            ASNImport.importedFramework = new EcFramework();
            ASNImport.importedFramework.competency = [];
            ASNImport.importedFramework.relation = [];
        } else {
            ASNImport.importedFramework = null;
        }
        ASNImport.progressObject = null;
        ASNImport.createCompetencies(serverUrl, owner, function() {
            ASNImport.createRelationships(serverUrl, owner, ASNImport.jsonFramework, null, function() {
                if (createFramework) {
                    ASNImport.createFramework(serverUrl, owner, success, failure);
                } else {
                    var compList = [];
                    for (var key in ASNImport.competencies) {
                        compList.push(ASNImport.competencies[key]);
                    }
                    if (success != null) 
                        success(compList, null);
                }
            }, failure, incremental);
        }, failure, incremental);
    };
    constructor.savedCompetencies = 0;
    constructor.createCompetencies = function(serverUrl, owner, success, failure, incremental) {
        ASNImport.savedCompetencies = 0;
        for (var key in ASNImport.jsonCompetencies) {
            var comp = new EcCompetency();
            var jsonComp = ASNImport.jsonCompetencies[key];
            if ((jsonComp)["http://purl.org/dc/elements/1.1/title"] == null) 
                comp.name = (((jsonComp)["http://purl.org/dc/terms/description"])["0"])["value"];
             else 
                comp.name = (((jsonComp)["http://purl.org/dc/elements/1.1/title"])["0"])["value"];
            comp.sameAs = key;
            if ((jsonComp)["http://purl.org/dc/terms/description"] != null) 
                comp.description = (((jsonComp)["http://purl.org/dc/terms/description"])["0"])["value"];
            comp.generateId(serverUrl);
            if (owner != null) 
                comp.addOwner(owner.ppk.toPk());
            if (ASNImport.importedFramework != null) 
                ASNImport.importedFramework.addCompetency(comp.shortId());
            ASNImport.competencies[key] = comp;
            comp.save(function(p1) {
                ASNImport.savedCompetencies++;
                if (ASNImport.savedCompetencies % ASNImport.INCREMENTAL_STEP == 0) {
                    if (ASNImport.progressObject == null) 
                        ASNImport.progressObject = new Object();
                    (ASNImport.progressObject)["competencies"] = ASNImport.savedCompetencies;
                    incremental(ASNImport.progressObject);
                }
                if (ASNImport.savedCompetencies == ASNImport.competencyCount) {
                    if (ASNImport.progressObject == null) 
                        ASNImport.progressObject = new Object();
                    (ASNImport.progressObject)["competencies"] = ASNImport.savedCompetencies;
                    incremental(ASNImport.progressObject);
                    success();
                }
            }, function(p1) {
                failure("Failed to save competency");
            });
        }
    };
    constructor.savedRelations = 0;
    constructor.createRelationships = function(serverUrl, owner, node, nodeId, success, failure, incremental) {
        ASNImport.savedRelations = 0;
        if (ASNImport.relationCount == 0) {
            success();
        }
        var children = (node)["http://purl.org/gem/qualifiers/hasChild"];
        if (children != null) 
            for (var j = 0; j < children.length; j++) {
                if (nodeId != null) {
                    var relation = new EcAlignment();
                    relation.target = ASNImport.competencies[nodeId].shortId();
                    relation.source = ASNImport.competencies[(children[j])["value"]].shortId();
                    relation.relationType = "narrows";
                    relation.name = "";
                    relation.description = "";
                    relation.generateId(serverUrl);
                    if (owner != null) 
                        relation.addOwner(owner.ppk.toPk());
                    if (ASNImport.importedFramework != null) 
                        ASNImport.importedFramework.addRelation(relation.shortId());
                    relation.save(function(p1) {
                        ASNImport.savedRelations++;
                        if (ASNImport.savedRelations % ASNImport.INCREMENTAL_STEP == 0) {
                            if (ASNImport.progressObject == null) 
                                ASNImport.progressObject = new Object();
                            (ASNImport.progressObject)["relations"] = ASNImport.savedRelations;
                            incremental(ASNImport.progressObject);
                        }
                        if (ASNImport.savedRelations == ASNImport.relationCount) {
                            success();
                        }
                    }, function(p1) {
                        failure("Failed to save Relationship");
                    });
                }
                ASNImport.createRelationships(serverUrl, owner, ASNImport.jsonCompetencies[(children[j])["value"]], (children[j])["value"], success, failure, incremental);
            }
    };
    constructor.createFramework = function(serverUrl, owner, success, failure) {
        ASNImport.importedFramework.name = (((ASNImport.jsonFramework)["http://purl.org/dc/elements/1.1/title"])["0"])["value"];
        ASNImport.importedFramework.description = (((ASNImport.jsonFramework)["http://purl.org/dc/terms/description"])["0"])["value"];
        ASNImport.importedFramework.generateId(serverUrl);
        ASNImport.importedFramework.sameAs = ASNImport.frameworkUrl;
        if (owner != null) 
            ASNImport.importedFramework.addOwner(owner.ppk.toPk());
        ASNImport.importedFramework.save(function(p1) {
            var compList = [];
            for (var key in ASNImport.competencies) {
                compList.push(ASNImport.competencies[key]);
            }
            if (success != null) 
                success(compList, ASNImport.importedFramework);
        }, function(p1) {
            failure("Failed to save framework");
        });
    };
}, {jsonFramework: "Object", jsonCompetencies: {name: "Map", arguments: [null, "Object"]}, importedFramework: "EcFramework", competencies: {name: "Map", arguments: [null, "EcCompetency"]}, progressObject: "Object"}, {});
var FrameworkImport = function() {};
FrameworkImport = stjs.extend(FrameworkImport, null, [], function(constructor, prototype) {
    constructor.saved = 0;
    constructor.targetUsable = null;
    constructor.competencies = null;
    constructor.importCompetencies = function(source, target, copy, serverUrl, owner, success, failure) {
        if (source == null) {
            failure("Source Framework not set");
            return;
        }
        if (target == null) {
            failure("Target Framework not Set");
            return;
        }
        FrameworkImport.targetUsable = target;
        if (source.competency == null || source.competency.length == 0) {
            failure("Source Has No Competencies");
            return;
        }
        FrameworkImport.competencies = [];
        if (copy) {
            FrameworkImport.saved = 0;
            for (var i = 0; i < source.competency.length; i++) {
                var id = source.competency[i];
                EcCompetency.get(id, function(comp) {
                    var competency = new EcCompetency();
                    competency.copyFrom(comp);
                    competency.generateId(serverUrl);
                    if (owner != null) 
                        competency.addOwner(owner.ppk.toPk());
                    var id = competency.id;
                    competency.save(function(str) {
                        FrameworkImport.saved++;
                        FrameworkImport.targetUsable.addCompetency(id);
                        if (FrameworkImport.saved == FrameworkImport.competencies.length) {
                            FrameworkImport.targetUsable.save(function(p1) {
                                success(FrameworkImport.competencies);
                            }, function(p1) {
                                failure(p1);
                            });
                        }
                    }, function(str) {
                        failure("Trouble Saving Copied Competency");
                    });
                    FrameworkImport.competencies.push(competency);
                }, function(str) {
                    failure(str);
                });
            }
        } else {
            for (var i = 0; i < source.competency.length; i++) {
                if (target.competency == null || (target.competency.indexOf(source.competency[i]) == -1 && target.competency.indexOf(EcRemoteLinkedData.trimVersionFromUrl(source.competency[i])) == -1)) {
                    EcCompetency.get(source.competency[i], function(comp) {
                        FrameworkImport.competencies.push(comp);
                        FrameworkImport.targetUsable.addCompetency(comp.id);
                        if (FrameworkImport.competencies.length == source.competency.length) {
                            delete (FrameworkImport.targetUsable)["competencyObjects"];
                            FrameworkImport.targetUsable.save(function(p1) {
                                success(FrameworkImport.competencies);
                            }, function(p1) {
                                failure(p1);
                            });
                        }
                    }, function(p1) {
                        failure(p1);
                    });
                }
            }
        }
    };
}, {targetUsable: "EcFramework", competencies: {name: "Array", arguments: ["EcCompetency"]}}, {});
