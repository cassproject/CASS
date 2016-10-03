/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
var Importer = function() {};
Importer = stjs.extend(Importer, null, [], function(constructor, prototype) {
    constructor.isObject = function(obj) {
        return toString.call(obj) == "[object Object]";
    };
    constructor.isArray = function(obj) {
        return toString.call(obj) == "[object Array]";
    };
}, {}, {});
var PapaParseParams = function() {};
PapaParseParams = stjs.extend(PapaParseParams, null, [], function(constructor, prototype) {
    prototype.complete = null;
    prototype.error = null;
}, {complete: {name: "Callback1", arguments: ["Object"]}, error: {name: "Callback1", arguments: ["Object"]}}, {});
var CSVImport = function() {};
CSVImport = stjs.extend(CSVImport, null, [], function(constructor, prototype) {
    constructor.analyzeFile = function(file, success, failure) {
        Papa.parse(file, {complete: function(results) {
            var tabularData = (results)["data"];
            success(tabularData);
        }, error: failure});
    };
    constructor.competencies = null;
    constructor.saved = 0;
    constructor.importCompetencies = function(file, serverUrl, owner, nameIndex, descriptionIndex, scopeIndex, success, failure) {
        if (nameIndex < 0) {
            failure("Name Index not Set");
            return;
        }
        Papa.parse(file, {complete: function(results) {
            var tabularData = (results)["data"];
            CSVImport.competencies = [];
            for (var i = 1; i < tabularData.length; i++) {
                var competency = new EcCompetency();
                if (tabularData[i][nameIndex] == null || tabularData[i][nameIndex] == "") {
                    failure("Name column contained blank value or could not be found in the CSV");
                    return;
                }
                competency.name = tabularData[i][nameIndex];
                if (descriptionIndex >= 0) 
                    competency.description = tabularData[i][descriptionIndex];
                if (scopeIndex >= 0) 
                    competency.scope = tabularData[i][scopeIndex];
                competency.generateId(serverUrl);
                if (owner != null) 
                    competency.addOwner(owner.ppk.toPk());
                CSVImport.competencies.push(competency);
            }
            CSVImport.saved = 0;
            for (var i = 0; i < CSVImport.competencies.length; i++) {
                var comp = CSVImport.competencies[i];
                comp.save(function(results) {
                    CSVImport.saved++;
                    if (CSVImport.saved == CSVImport.competencies.length) 
                        success(CSVImport.competencies);
                }, function(results) {
                    failure("Failed to save competency");
                    for (var j = 0; j < CSVImport.competencies.length; j++) {
                        CSVImport.competencies[j]._delete(null, null, null);
                    }
                });
            }
        }, error: failure});
    };
}, {competencies: {name: "Array", arguments: ["EcCompetency"]}}, {});
var MedbiqImport = function() {
    Importer.call(this);
};
MedbiqImport = stjs.extend(MedbiqImport, Importer, [], function(constructor, prototype) {
    constructor.medbiqXmlCompetencies = null;
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
    constructor.saved = 0;
    constructor.importCompetencies = function(serverUrl, owner, success, failure) {
        for (var i = 0; i < MedbiqImport.medbiqXmlCompetencies.length; i++) {
            var comp = MedbiqImport.medbiqXmlCompetencies[i];
            comp.generateId(serverUrl);
            if (owner != null) 
                comp.addOwner(owner.ppk.toPk());
            comp.save(function(p1) {
                MedbiqImport.saved++;
                if (MedbiqImport.saved == MedbiqImport.medbiqXmlCompetencies.length) 
                    success(MedbiqImport.medbiqXmlCompetencies);
            }, function(p1) {
                failure("Failed to Save Competency");
            });
        }
    };
}, {medbiqXmlCompetencies: {name: "Array", arguments: ["EcCompetency"]}}, {});
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
var ASNImport = function() {
    Importer.call(this);
};
ASNImport = stjs.extend(ASNImport, Importer, [], function(constructor, prototype) {
    constructor.jsonFramework = null;
    constructor.frameworkUrl = null;
    constructor.jsonCompetencies = null;
    constructor.asnJsonPrime = function(obj, key) {
        var value = (obj)[key];
        if (Importer.isObject(value)) {
            if ((value)["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"] != null) {
                var stringVal = (((value)["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"])["0"])["value"];
                if (stringVal == "http://purl.org/ASN/schema/core/Statement") {
                    ASNImport.jsonCompetencies[key] = value;
                    var children = (value)["http://purl.org/gem/qualifiers/hasChild"];
                    if (children != null) 
                        for (var j = 0; j < children.length; j++) {
                            ASNImport.asnJsonPrime(obj, (children[j])["value"]);
                        }
                }
            }
        }
    };
    constructor.lookThroughSource = function(obj) {
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
            failure("No File to Analyze");
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
    constructor.importCompetencies = function(serverUrl, owner, createFramework, success, failure) {
        ASNImport.competencies = {};
        if (createFramework) {
            ASNImport.importedFramework = new EcFramework();
            ASNImport.importedFramework.competency = [];
            ASNImport.importedFramework.relation = [];
        } else {
            ASNImport.importedFramework = null;
        }
        ASNImport.createCompetencies(serverUrl, owner, failure);
        ASNImport.createRelationships(serverUrl, owner, ASNImport.jsonFramework, null, failure);
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
    };
    constructor.createCompetencies = function(serverUrl, owner, failure) {
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
            comp.save(function(p1) {}, function(p1) {
                failure("Failed to save competency");
            });
        }
    };
    constructor.createRelationships = function(serverUrl, owner, node, nodeId, failure) {
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
                    relation.save(function(p1) {}, function(p1) {
                        failure("Failed to save Relationship");
                    });
                }
                ASNImport.createRelationships(serverUrl, owner, ASNImport.jsonCompetencies[(children[j])["value"]], (children[j])["value"], failure);
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
}, {jsonFramework: "Object", jsonCompetencies: {name: "Map", arguments: [null, "Object"]}, importedFramework: "EcFramework", competencies: {name: "Map", arguments: [null, "EcCompetency"]}}, {});
