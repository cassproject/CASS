/**
 *  Base class for all importers, can hold helper functions
 *  that are useful for all importers
 * 
 *  @author devlin.junker@eduworks.com
 *  @module org.cassproject
 *  @class Importer
 *  @abstract
 */
var Importer = function() {};
Importer = stjs.extend(Importer, null, [], function(constructor, prototype) {
    constructor.isObject = function(obj) {
        return Object.prototype.toString.call(obj) == "[object Object]";
    };
    constructor.isArray = function(obj) {
        return Object.prototype.toString.call(obj) == "[object Array]";
    };
}, {}, {});
/**
 *  Base class for all exporters, can hold helper functions
 *  that are useful for all exporters
 * 
 *  @author devlin.junker@eduworks.com
 *  @module org.cassproject
 *  @class Exporter
 *  @abstract
 */
var Exporter = function() {};
Exporter = stjs.extend(Exporter, null, [], null, {}, {});
var PapaParseParams = function() {};
PapaParseParams = stjs.extend(PapaParseParams, null, [], function(constructor, prototype) {
    prototype.complete = null;
    prototype.header = null;
    prototype.error = null;
    prototype.encoding = null;
}, {complete: {name: "Callback1", arguments: ["Object"]}, error: {name: "Callback1", arguments: ["Object"]}}, {});
/**
 *  Import methods to handle an ASN JSON file containing a framework,
 *  competencies and relationships, and store them in a CASS instance
 * 
 *  @author devlin.junker@eduworks.com
 *  @author fritz.ray@eduworks.com
 *  @module org.cassproject
 *  @class ASNImport
 *  @static
 *  @extends Importer
 */
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
    constructor.importedFramework = null;
    constructor.competencies = null;
    constructor.progressObject = null;
    constructor.savedCompetencies = 0;
    constructor.savedRelations = 0;
    /**
     *  Recursive function that looks through the file and saves each
     *  competency object in a map for use during importing. It also counts
     *  the number of competencies and relationships that it finds
     * 
     *  @param {Object} obj
     *                  The current JSON object we're examining for comepetencies and reationships
     *  @param {String} key
     *                  The ASN identifier of the current object
     *  @memberOf ASNImport
     *  @method asnJsonPrime
     *  @private
     *  @static
     */
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
    /**
     *  Does the actual legwork of looking for competencies and relationships.
     *  <p>
     *  This function finds the framework information, and pulls out the competency
     *  objects array to be scanned by asnJsonPrime
     * 
     *  @param {Object} obj
     *                  ASN JSON Object from file that contains framework information and competencies/relationships
     *  @memberOf ASNImport
     *  @method lookThroughSource
     *  @private
     *  @static
     */
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
    /**
     *  Analyzes an ASN File for competencies and relationships.
     *  <p>
     *  This should be called before import, the success callback returns an object
     *  indicating the number of competencies and relationships found.
     * 
     *  @param {Object}            file
     *                             ASN JSON file
     *  @param {Callback1<Object>} success
     *                             Callback triggered on successful analysis of file
     *  @param {Callback1<Object>} [failure]
     *                             Callback triggered if there is an error during analysis of the file
     *  @memberOf ASNImport
     *  @method analyzeFile
     *  @static
     */
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
        reader.readAsText(file, "UTF-8");
    };
    /**
     *  Method to import the competencies from an ASN JSON file,
     *  should be called after analyzing the file
     * 
     *  @param {String}                        serverUrl
     *                                         URL Prefix for the competencies to be imported
     *  @param {EcIdentity}                    owner
     *                                         EcIdentity that will own the new competencies
     *  @param {boolean}                       createFramework
     *                                         Flag to create a framework and include the competencies and relationships created
     *  @param {Callback2<Array<EcCompetency>, EcFramework>} success
     *                                         Callback triggered after the competencies (and framework?) are created
     *  @param {Callback1<Object>}             failure
     *                                         Callback triggered if an error occurs while creating the competencies
     *  @param {Callback1<Object>}             [incremental]
     *                                         Callback triggered incrementally during the creation of competencies to indicate progress,
     *                                         returns an object indicating the number of competencies (and relationships?) created so far
     *  @memberOf ASNImport
     *  @method importCompetencies
     *  @static
     */
    constructor.importCompetencies = function(serverUrl, owner, createFramework, success, failure, incremental, repo) {
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
                    ASNImport.createFramework(serverUrl, owner, success, failure, repo);
                } else {
                    var compList = [];
                    for (var key in ASNImport.competencies) {
                        compList.push(ASNImport.competencies[key]);
                    }
                    if (success != null) 
                        success(compList, null);
                }
            }, failure, incremental, repo);
        }, failure, incremental, repo);
    };
    /**
     *  Handles creating the competencies found during analysis, iterates through the
     *  competency ASN objects saved and creates them in the CASS repository at the URL given.
     * 
     *  @param {String}            serverUrl
     *                             URL Prefix for the competencies to be imported
     *  @param {EcIdentity}        owner
     *                             EcIdentity that will own the new competencies
     *  @param {Callback0}         success
     *                             Callback triggered after the competencies are created
     *  @param {Callback1<Object>} failure
     *                             Callback triggered if an error occurs while creating the competencies
     *  @param {Callback1<Object>} [incremental]
     *                             Callback triggered incrementally during the creation of competencies to indicate progress
     *  @memberOf ASNImport
     *  @method createCompetencies
     *  @private
     *  @static
     */
    constructor.createCompetencies = function(serverUrl, owner, success, failure, incremental, repo) {
        ASNImport.savedCompetencies = 0;
        for (var key in ASNImport.jsonCompetencies) {
            var comp = new EcCompetency();
            var jsonComp = ASNImport.jsonCompetencies[key];
            if ((jsonComp)["http://purl.org/dc/elements/1.1/title"] == null) 
                comp.name = (((jsonComp)["http://purl.org/dc/terms/description"])["0"])["value"];
             else 
                comp.name = (((jsonComp)["http://purl.org/dc/elements/1.1/title"])["0"])["value"];
            if ((jsonComp)["http://purl.org/dc/terms/description"] != null) 
                comp.description = (((jsonComp)["http://purl.org/dc/terms/description"])["0"])["value"];
            comp.id = key;
            if (comp.id == null) {
                if (repo == null || repo.selectedServer.indexOf(serverUrl) != -1) 
                    comp.generateId(serverUrl);
                 else 
                    comp.generateShortId(serverUrl);
            }
            if (owner != null) 
                comp.addOwner(owner.ppk.toPk());
            if (ASNImport.importedFramework != null) 
                ASNImport.importedFramework.addCompetency(comp.shortId());
            ASNImport.competencies[key] = comp;
            ASNImport.saveCompetency(success, failure, incremental, comp, repo);
        }
    };
    constructor.saveCompetency = function(success, failure, incremental, comp, repo) {
        Task.asyncImmediate(function(o) {
            var keepGoing = o;
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
                keepGoing();
            }, function(p1) {
                failure("Failed to save competency");
                keepGoing();
            }, repo);
        });
    };
    /**
     *  Handles creating the relationships from the file analyzed earlier.
     *  Recursively travels through looking for the hasChild field and creates
     *  relationships based off of that.
     * 
     *  @param {String}            serverUrl
     *                             URL Prefix for the relationships to be imported
     *  @param {EcIdentity}        owner
     *                             EcIdentity that will own the new relationships
     *  @param {Object}            node
     *  @param {String}            nodeId
     *  @param {Callback0}         success
     *                             Callback triggered after the relationships are created
     *  @param {Callback1<Object>} failure
     *                             Callback triggered if an error occurs while creating the relationships
     *  @param {Callback1<Object>} incremental
     *                             Callback triggered incrementally during the creation of relationships to indicate progress
     *  @memberOf ASNImport
     *  @method createRelationships
     *  @private
     *  @static
     */
    constructor.createRelationships = function(serverUrl, owner, node, nodeId, success, failure, incremental, repo) {
        ASNImport.savedRelations = 0;
        if (ASNImport.relationCount == 0) {
            success();
        }
        var children = (node)["http://purl.org/gem/qualifiers/hasChild"];
        if (children != null) 
            for (var j = 0; j < children.length; j++) {
                if (nodeId != null) {
                    var relation = new EcAlignment();
                    relation.target = ASNImport.competencies[nodeId].id;
                    relation.source = ASNImport.competencies[(children[j])["value"]].id;
                    relation.relationType = "narrows";
                    relation.name = "";
                    relation.description = "";
                    if (repo == null || repo.selectedServer.indexOf(serverUrl) != -1) 
                        relation.generateId(serverUrl);
                     else 
                        relation.generateShortId(serverUrl);
                    if (owner != null) 
                        relation.addOwner(owner.ppk.toPk());
                    if (ASNImport.importedFramework != null) 
                        ASNImport.importedFramework.addRelation(relation.shortId());
                    ASNImport.saveRelation(success, failure, incremental, relation, repo);
                }
                ASNImport.createRelationships(serverUrl, owner, ASNImport.jsonCompetencies[(children[j])["value"]], (children[j])["value"], success, failure, incremental, repo);
            }
    };
    constructor.saveRelation = function(success, failure, incremental, relation, repo) {
        Task.asyncImmediate(function(o) {
            var keepGoing = o;
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
                keepGoing();
            }, function(p1) {
                failure("Failed to save Relationship");
                keepGoing();
            }, repo);
        });
    };
    /**
     *  Handles creating the framework if the createFramework flag was set
     * 
     *  @param {String}                        serverUrl
     *                                         URL Prefix for the framework to be imported
     *  @param {EcIdentity}                    owner
     *                                         EcIdentity that will own the new framework
     *  @param {Callback2<Array<EcCompetency>, EcFramework>} success
     *                                         Callback triggered after the framework is created
     *  @param {Callback1<Object>}             failure
     *                                         Callback triggered if there is an error during the creation of framework
     *  @meberOf ASNImport
     *  @method createFramework
     *  @private
     *  @static
     */
    constructor.createFramework = function(serverUrl, owner, success, failure, repo) {
        ASNImport.importedFramework.name = (((ASNImport.jsonFramework)["http://purl.org/dc/elements/1.1/title"])["0"])["value"];
        ASNImport.importedFramework.description = (((ASNImport.jsonFramework)["http://purl.org/dc/terms/description"])["0"])["value"];
        ASNImport.importedFramework.id = ASNImport.frameworkUrl;
        if (ASNImport.importedFramework.id == null) {
            if (repo == null || repo.selectedServer.indexOf(serverUrl) != -1) 
                ASNImport.importedFramework.generateId(serverUrl);
             else 
                ASNImport.importedFramework.generateShortId(serverUrl);
        }
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
        }, repo);
    };
}, {jsonFramework: "Object", jsonCompetencies: {name: "Map", arguments: [null, "Object"]}, importedFramework: "EcFramework", competencies: {name: "Map", arguments: [null, "EcCompetency"]}, progressObject: "Object"}, {});
/**
 *  Importer methods to create competencies based on a
 *  Medbiquitous competency XML file
 * 
 *  @author devlin.junker@eduworks.com
 *  @author fritz.ray@eduworks.com
 *  @module org.cassproject
 *  @class MedbiqImport
 *  @static
 *  @extends Importer
 */
var MedbiqImport = function() {
    Importer.call(this);
};
MedbiqImport = stjs.extend(MedbiqImport, Importer, [], function(constructor, prototype) {
    constructor.INCREMENTAL_STEP = 5;
    constructor.medbiqXmlCompetencies = null;
    constructor.progressObject = null;
    constructor.saved = 0;
    /**
     *  Does the legwork of looking for competencies in the XML
     * 
     *  @param {Object} obj
     *                  Parsed XML Object
     *  @memberOf MedbiqImport
     *  @method medbiqXmlLookForCompetencyObject
     *  @private
     *  @static
     */
    constructor.medbiqXmlLookForCompetencyObject = function(obj) {
        if (Importer.isObject(obj) || Importer.isArray(obj)) 
            for (var key in (obj)) {
                if (key == "CompetencyObject") 
                    MedbiqImport.medbiqXmlParseCompetencyObject((obj)[key]);
                 else 
                    MedbiqImport.medbiqXmlLookForCompetencyObject((obj)[key]);
            }
    };
    /**
     *  Does the legwork of parsing the competencies out of the parsed XML
     * 
     *  @param {Object} obj
     *                  Parsed XML Object
     *  @memberOf MedbiqImport
     *  @method medbiqXmlParseCompetencyObject
     *  @private
     *  @static
     */
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
    /**
     *  Analyzes a Medbiquitous XML file for competencies and saves them for use in the import process
     * 
     *  @param {Object}                         file
     *                                          Medbiquitous XML file
     *  @param {Callback1<Array<EcCompetency>>} success
     *                                          Callback triggered on succesfully analyzing competencies,
     *                                          returns an array of all of the competencies found
     *  @param {Callback1<String>}              [failure]
     *                                          Callback triggered on error analyzing file
     *  @memberOf MedbiqImport
     *  @method analyzeFile
     *  @static
     */
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
        reader.readAsText(file, "UTF-8");
    };
    /**
     *  Method for actually creating the competencies in the CASS repository after a
     *  Medbiquitous XML file has been parsed. Must be called after analyzeFile
     * 
     *  @param {String}                         serverUrl
     *                                          URL Prefix for the created competencies (and relationships?)
     *  @param {EcIdentity}                     owner
     *                                          EcIdentity that will own the created competencies (and relationships?)
     *  @param {Callback1<Array<EcCompetency>>} success
     *                                          Callback triggered after successfully creating the competencies from the XML file
     *  @param {Callback1<Object>}              [failure]
     *                                          Callback triggered if there is an error while creating the competencies
     *  @param {Callback1<Object>}              [incremental]
     *                                          Callback triggered incrementally while the competencies are being created to show progress,
     *                                          returns an object indicating the number of competencies created so far
     *  @memberOf MedbiqImport
     *  @method importCompetencies
     *  @static
     */
    constructor.importCompetencies = function(serverUrl, owner, success, failure, incremental, repo) {
        MedbiqImport.progressObject = null;
        MedbiqImport.saved = 0;
        for (var i = 0; i < MedbiqImport.medbiqXmlCompetencies.length; i++) {
            var comp = MedbiqImport.medbiqXmlCompetencies[i];
            if (repo == null || repo.selectedServer.indexOf(serverUrl) != -1) 
                comp.generateId(serverUrl);
             else 
                comp.generateShortId(serverUrl);
            if (owner != null) 
                comp.addOwner(owner.ppk.toPk());
            MedbiqImport.saveCompetency(success, failure, incremental, comp, repo);
        }
    };
    constructor.saveCompetency = function(success, failure, incremental, comp, repo) {
        Task.asyncImmediate(function(o) {
            var keepGoing = o;
            var scs = function(p1) {
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
                keepGoing();
            };
            var err = function(p1) {
                failure("Failed to Save Competency");
                keepGoing();
            };
            comp.save(scs, err, repo);
        });
    };
}, {medbiqXmlCompetencies: {name: "Array", arguments: ["EcCompetency"]}, progressObject: "Object"}, {});
var TabStructuredImport = function() {};
TabStructuredImport = stjs.extend(TabStructuredImport, null, [], function(constructor, prototype) {
    /**
     *  Method to create competencies (and relationships if the parameters are passed in)
     *  based on a CSV file and references to which columns correspond to which pieces
     *  of data.
     * 
     *  @param {Object}                        text
     *                                         Text to extract competencies from
     *  @param {String}                        serverUrl
     *                                         URL Prefix for the created competencies (and relationships?)
     *  @param {EcIdentity}                    owner
     *                                         EcIdentity that will own the created competencies (and relationships?)
     *  @param {Callback2<Array<EcCompetency>, Array<EcAlignment>>} success
     *                                         Callback triggered after the competencies (and relationships?) have been created
     *  @param {Callback1<Object>}             [failure]
     *                                         Callback triggered if an error during creating the competencies
     *  @param {Callback1<Object>}             [incremental]
     *                                         Callback triggered incrementally during creation of competencies to indicate progress,
     *                                         returns an object indicating the number of competencies (and relationships?) created so far
     *  @param {EcRepository}                  repo
     *                                         Repository to save any new data to, or to use to generate IDs.
     *  @memberOf TabStructuredImport
     *  @method importCompetencies
     *  @static
     */
    constructor.importCompetencies = function(text, serverUrl, owner, success, failure, incremental, repo, hashNameForId) {
        var lines = text.split("\n");
        var competencies = new Array();
        var alignments = new Array();
        for (var i = 0; i < lines.length; i++) 
            TabStructuredImport.parseLinesIntoHierarchy(lines, competencies, alignments, i, serverUrl, hashNameForId, repo);
        success(competencies, alignments);
    };
    constructor.parseLinesIntoHierarchy = function(lines, competencies, alignments, index, serverUrl, hashNameForId, repo) {
        var parentI = -1;
        for (var i = index - 1; i >= 0; i--) {
            if (TabStructuredImport.tabs(lines[i]) < TabStructuredImport.tabs(lines[index])) {
                parentI = i;
                break;
            }
        }
        var c = null;
        for (var i = 0; i < competencies.length; i++) {
            if (competencies[i].getName().trim() == lines[index].trim()) {
                c = competencies[i];
                break;
            }
        }
        if (c == null) {
            c = new EcCompetency();
            if (hashNameForId) 
                c.assignId(serverUrl, EcCrypto.md5(lines[index].trim()));
             else if (serverUrl != repo.selectedServer) 
                c.generateShortId(serverUrl);
             else 
                c.generateId(serverUrl);
            c.setName(lines[index]);
            competencies.push(c);
        }
        if (parentI != -1) {
            var parent = null;
            for (var i = 0; i < competencies.length; i++) {
                if (competencies[i].getName().trim() == lines[parentI].trim()) {
                    parent = competencies[i];
                    break;
                }
            }
            if (parent != null) {
                var a = new EcAlignment();
                if (serverUrl != repo.selectedServer) 
                    a.generateShortId(serverUrl);
                 else 
                    a.generateId(serverUrl);
                a.relationType = EcAlignment.NARROWS;
                a.source = c.shortId();
                a.target = parent.shortId();
                alignments.push(a);
            }
        }
    };
    constructor.tabs = function(line) {
        var tabs = 0;
        for (var i = 0; i < line.length; i++) {
            var c = line.charAt(i);
            if (c == '\t' || c == ' ') 
                tabs++;
             else 
                return tabs;
        }
        return tabs;
    };
}, {}, {});
/**
 *  Importer methods to copy or link to competencies that already
 *  exist in another framework in a CASS instance.
 * 
 *  @author devlin.junker@eduworks.com
 *  @module org.cassproject
 *  @class FrameworkImport
 *  @static
 *  @extends Importer
 */
var FrameworkImport = function() {};
FrameworkImport = stjs.extend(FrameworkImport, null, [], function(constructor, prototype) {
    constructor.savedComp = 0;
    constructor.savedRel = 0;
    constructor.targetUsable = null;
    constructor.competencies = null;
    constructor.relations = null;
    constructor.compMap = null;
    /**
     *  Copies or links competencies that exist in one framework in a CASS instance,
     *  to another different framework in the same CASS instance.
     * 
     *  @param {EcFramework}                    source
     *                                          Framework to copy or link the competencies from
     *  @param {EcFramework}                    target
     *                                          Framework to add the copied or linked competencies to
     *  @param {boolean}                        copy
     *                                          Flag indicating whether or not to copy or link the competencies in the source framework
     *  @param {String}                         serverUrl
     *                                          URL Prefix for the created competencies if copied
     *  @param {EcIdentity}                     owner
     *                                          EcIdentity that will own the created competencies if copied
     *  @param {Callback1<Array<EcCompetency>>} success
     *                                          Callback triggered after succesfully copying or linking all of the competencies,
     *                                          returns an array of the new or linked competencies
     *  @param {Callback1<Object>}              [failure]
     *                                          Callback triggered if an error occurred while creating the competencies
     *  @memberOf FrameworkImport
     *  @method importCompetencies
     *  @static
     */
    constructor.importCompetencies = function(source, target, copy, serverUrl, owner, success, failure, repo) {
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
        FrameworkImport.relations = [];
        if (copy) {
            FrameworkImport.compMap = {};
            FrameworkImport.savedComp = 0;
            FrameworkImport.savedRel = 0;
            for (var i = 0; i < source.competency.length; i++) {
                var id = source.competency[i];
                EcCompetency.get(id, function(comp) {
                    var competency = new EcCompetency();
                    competency.copyFrom(comp);
                    if (repo == null || repo.selectedServer.indexOf(serverUrl) != -1) 
                        competency.generateId(serverUrl);
                     else 
                        competency.generateShortId(serverUrl);
                    FrameworkImport.compMap[comp.shortId()] = competency.shortId();
                    if (owner != null) 
                        competency.addOwner(owner.ppk.toPk());
                    var id = competency.id;
                    Task.asyncImmediate(function(o) {
                        var keepGoing = o;
                        competency.save(function(str) {
                            FrameworkImport.savedComp++;
                            FrameworkImport.targetUsable.addCompetency(id);
                            if (FrameworkImport.savedComp == FrameworkImport.competencies.length) {
                                FrameworkImport.targetUsable.save(function(p1) {
                                    for (var i = 0; i < source.relation.length; i++) {
                                        var id = source.relation[i];
                                        EcAlignment.get(id, function(rel) {
                                            var relation = new EcAlignment();
                                            relation.copyFrom(rel);
                                            if (repo == null || repo.selectedServer.indexOf(serverUrl) != -1) 
                                                relation.generateId(serverUrl);
                                             else 
                                                relation.generateShortId(serverUrl);
                                            relation.source = FrameworkImport.compMap[rel.source];
                                            relation.target = FrameworkImport.compMap[rel.target];
                                            if (owner != null) 
                                                relation.addOwner(owner.ppk.toPk());
                                            var id = relation.id;
                                            Task.asyncImmediate(function(o) {
                                                var keepGoing2 = o;
                                                relation.save(function(str) {
                                                    FrameworkImport.savedRel++;
                                                    FrameworkImport.targetUsable.addRelation(id);
                                                    if (FrameworkImport.savedRel == FrameworkImport.relations.length) {
                                                        FrameworkImport.targetUsable.save(function(p1) {
                                                            success(FrameworkImport.competencies, FrameworkImport.relations);
                                                        }, function(p1) {
                                                            failure(p1);
                                                        }, repo);
                                                    }
                                                    keepGoing2();
                                                }, function(str) {
                                                    failure("Trouble Saving Copied Competency");
                                                    keepGoing2();
                                                }, repo);
                                            });
                                            FrameworkImport.relations.push(relation);
                                        }, function(str) {
                                            failure(str);
                                        });
                                    }
                                }, function(p1) {
                                    failure(p1);
                                }, repo);
                            }
                            keepGoing();
                        }, function(str) {
                            failure("Trouble Saving Copied Competency");
                            keepGoing();
                        }, repo);
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
                                for (var i = 0; i < source.relation.length; i++) {
                                    if (target.relation == null || (target.relation.indexOf(source.relation[i]) == -1 && target.relation.indexOf(EcRemoteLinkedData.trimVersionFromUrl(source.competency[i])) == -1)) {
                                        EcAlignment.get(source.relation[i], function(relation) {
                                            FrameworkImport.relations.push(relation);
                                            FrameworkImport.targetUsable.addRelation(relation.id);
                                            if (FrameworkImport.relations.length == source.relation.length) {
                                                delete (FrameworkImport.targetUsable)["competencyObjects"];
                                                Task.asyncImmediate(function(o) {
                                                    var keepGoing = o;
                                                    FrameworkImport.targetUsable.save(function(p1) {
                                                        success(FrameworkImport.competencies, FrameworkImport.relations);
                                                        keepGoing();
                                                    }, function(p1) {
                                                        failure(p1);
                                                        keepGoing();
                                                    }, repo);
                                                });
                                            }
                                        }, function(p1) {
                                            failure(p1);
                                        });
                                    }
                                }
                            }, function(p1) {
                                failure(p1);
                            }, repo);
                        }
                    }, function(p1) {
                        failure(p1);
                    });
                }
            }
        }
    };
}, {targetUsable: "EcFramework", competencies: {name: "Array", arguments: ["EcCompetency"]}, relations: {name: "Array", arguments: ["EcAlignment"]}, compMap: {name: "Map", arguments: [null, null]}}, {});
/**
 *  Export methods to handle exporting two CSV file , one of competencies
 *  and one of relationships representing a framework
 * 
 *  @author devlin.junker@eduworks.com
 *  @author fritz.ray@eduworks.com
 *  @module org.cassproject
 *  @class CSVExport
 *  @static
 *  @extends Exporter
 */
var CSVExport = function() {
    Exporter.call(this);
};
CSVExport = stjs.extend(CSVExport, Exporter, [], function(constructor, prototype) {
    constructor.frameworkCompetencies = null;
    constructor.frameworkRelations = null;
    constructor.exportObjects = function(objects, fileName, piped) {
        var compExport = new CSVExport.CSVExportProcess();
        compExport.buildExport(objects, piped);
        compExport.downloadCSV(fileName);
    };
    constructor.exportCTDLASN = function(json, name) {
        var objects = [];
        CSVExport.findGraphs(json, objects);
        CSVExport.exportObjects(objects, name + ".csv", true);
    };
    constructor.findGraphs = function(json, objects) {
        var jsonArray;
        if (!EcArray.isArray(json)) {
            jsonArray = [json];
        } else {
            jsonArray = json;
        }
        for (var j = 0; j < jsonArray.length; j++) {
            var framework = jsonArray[j];
            var graph = (framework)["@graph"];
            if (graph != null) {
                for (var i = 0; i < graph.length; i++) {
                    var rld = new EcRemoteLinkedData("https://credreg.net/ctdlasn/schema/context/json", (graph[i])["@type"]);
                    rld.copyFrom(graph[i]);
                    objects.push(rld);
                    if ((graph[i])["@graph"] != null) {
                        CSVExport.findGraphs(graph[i], objects);
                    }
                }
            }
        }
    };
    /**
     *  Method to export the CSV files of competencies and relationships for a framework
     * 
     *  @param {String}            frameworkId
     *                             Id of the framework to export
     *  @param {Callback0}         success
     *                             Callback triggered after both files have been successfully exported
     *  @param {Callback1<String>} failure
     *                             Callback triggered if an error occurs during export
     *  @memberOf CSVExport
     *  @method export
     *  @static
     */
    constructor.exportFramework = function(frameworkId, success, failure) {
        if (frameworkId == null) {
            failure("Framework not selected.");
            return;
        }
        CSVExport.frameworkCompetencies = [];
        CSVExport.frameworkRelations = [];
        EcRepository.get(frameworkId, function(data) {
            if (data.isAny(new EcFramework().getTypes())) {
                var fw = new EcFramework();
                fw.copyFrom(data);
                if (fw.competency == null || fw.competency.length == 0) 
                    failure("No Competencies in Framework");
                for (var i = 0; i < fw.competency.length; i++) {
                    var competencyUrl = fw.competency[i];
                    EcRepository.get(competencyUrl, function(competency) {
                        CSVExport.frameworkCompetencies.push(competency);
                        if (CSVExport.frameworkCompetencies.length == fw.competency.length) {
                            var compExport = new CSVExport.CSVExportProcess();
                            compExport.buildExport(CSVExport.frameworkCompetencies, false);
                            compExport.downloadCSV(fw.getName() + " - Competencies.csv");
                        } else {}
                    }, function(s) {
                        CSVExport.frameworkCompetencies.push(null);
                        if (CSVExport.frameworkCompetencies.length == fw.competency.length) {
                            var compExport = new CSVExport.CSVExportProcess();
                            compExport.buildExport(CSVExport.frameworkCompetencies, false);
                            compExport.downloadCSV(fw.getName() + " - Competencies.csv");
                        } else {}
                    });
                }
                for (var i = 0; i < fw.relation.length; i++) {
                    var relationUrl = fw.relation[i];
                    EcRepository.get(relationUrl, function(relation) {
                        CSVExport.frameworkRelations.push(relation);
                        if (CSVExport.frameworkRelations.length == fw.relation.length) {
                            var compExport = new CSVExport.CSVExportProcess();
                            compExport.buildExport(CSVExport.frameworkRelations, false);
                            compExport.downloadCSV(fw.getName() + " - Relations.csv");
                            if (success != null && success != undefined) 
                                success();
                        } else {}
                    }, function(s) {
                        CSVExport.frameworkRelations.push(null);
                        if (CSVExport.frameworkRelations.length == fw.relation.length) {
                            var compExport = new CSVExport.CSVExportProcess();
                            compExport.buildExport(CSVExport.frameworkRelations, false);
                            compExport.downloadCSV(fw.getName() + " - Relations.csv");
                            if (success != null && success != undefined) 
                                success();
                        } else {}
                    });
                }
            }
        }, failure);
    };
    constructor.CSVExportProcess = function() {
        this.csvOutput = [];
    };
    constructor.CSVExportProcess = stjs.extend(constructor.CSVExportProcess, null, [], function(constructor, prototype) {
        prototype.csvOutput = null;
        prototype.flattenObject = function(flattenedObject, object, prefix, piped) {
            var data = new EcRemoteLinkedData((object)["@context"], (object)["@type"]);
            data.copyFrom(object);
            var tempObj = JSON.parse(data.toJson());
            var props = (tempObj);
            for (var prop in props) {
                var id;
                if (prefix != null && prefix != undefined && !piped) 
                    id = prefix + "." + prop;
                 else 
                    id = prop;
                if (props[prop] != null && props[prop] != "" && stjs.isInstanceOf(props[prop].constructor, Object) && !piped) {
                    this.flattenObject(flattenedObject, props[prop], id, false);
                } else if (props[prop] != null && props[prop] != "" && (stjs.isInstanceOf(props[prop].constructor, Object) || EcArray.isArray(props[prop]))) {
                    var display = "";
                    var props2 = (props[prop]);
                    for (var prop2 in props2) {
                        display += props2[prop2] + "|";
                    }
                    display = display.substring(0, display.length - 1);
                    (flattenedObject)[id] = display;
                } else {
                    var display = Thing.getDisplayStringFrom(props[prop]);
                    (flattenedObject)[id] = display;
                }
            }
        };
        prototype.addCSVRow = function(object, piped) {
            var flattenedObject = new EcRemoteLinkedData(object.context, object.type);
            this.flattenObject(flattenedObject, object, null, piped);
            this.csvOutput.push(JSON.parse(flattenedObject.toJson()));
            var props = (JSON.parse(flattenedObject.toJson()));
            for (var prop in props) {
                if (props[prop] != null && props[prop] != "") {
                    for (var i = 0; i < this.csvOutput.length; i++) {
                        var row = this.csvOutput[i];
                        if (!(row).hasOwnProperty(prop)) {
                            (row)[prop] = "";
                        }
                    }
                }
            }
        };
        prototype.buildExport = function(objects, piped) {
            for (var i = 0; i < objects.length; i++) 
                if (objects[i] != null) {
                    var object = objects[i];
                    this.addCSVRow(object, piped);
                }
        };
        prototype.downloadCSV = function(name) {
            var csv = Papa.unparse(this.csvOutput);
            var pom = window.document.createElement("a");
            pom.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
            pom.setAttribute("download", name);
            if ((window.document)["createEvent"] != null) {
                var event = ((window.document)["createEvent"]).call(window.document, "MouseEvents");
                ((event)["initEvent"]).call(event, "click", true, true);
                pom.dispatchEvent(event);
            } else {
                ((pom)["click"]).call(pom);
            }
        };
    }, {csvOutput: {name: "Array", arguments: ["Object"]}}, {});
}, {frameworkCompetencies: {name: "Array", arguments: ["EcRemoteLinkedData"]}, frameworkRelations: {name: "Array", arguments: ["EcRemoteLinkedData"]}}, {});
/**
 *  Import methods to handle an CSV file of competencies and a
 *  CSV file of relationships and store them in a CASS instance
 * 
 *  @author devlin.junker@eduworks.com
 *  @author fritz.ray@eduworks.com
 *  @module org.cassproject
 *  @class CSVImport
 *  @static
 *  @extends Importer
 */
var CSVImport = function() {};
CSVImport = stjs.extend(CSVImport, null, [], function(constructor, prototype) {
    constructor.INCREMENTAL_STEP = 5;
    constructor.importCsvLookup = null;
    constructor.saved = 0;
    constructor.progressObject = null;
    /**
     *  Analyzes a CSV File to return the column names to the user for specifying
     *  which columns contain which data. This should be called before import.
     * 
     *  @param {Object}            file
     *                             CSV file to be analyzed
     *  @param {Callback1<Object>} success
     *                             Callback triggered after successfully analyzing the CSV file
     *  @param {Callback1<Object>} [failure]
     *                             Callback triggered if there is an error analyzing the CSV file
     *  @memberOf CSVImport
     *  @method analyzeFile
     *  @static
     */
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
        Papa.parse(file, {encoding: "UTF-8", complete: function(results) {
            var tabularData = (results)["data"];
            success(tabularData);
        }, error: failure});
    };
    /**
     *  Helper function to transform a competencies oldID to match the new server url
     * 
     *  @param {String}             oldId
     *                              Old ID found in the CSV file
     *  @param {EcRemoteLinkedData} newObject
     *                              New competency being created
     *  @param {String}             selectedServer
     *                              New URL Prefix that the new competency's ID should match
     *  @memberOf CSVImport
     *  @method transformId
     *  @private
     *  @static
     */
    constructor.transformId = function(oldId, newObject, selectedServer, repo) {
        if (oldId == null || oldId == "" || oldId.toLowerCase().indexOf("http") == -1) 
            newObject.assignId(selectedServer, oldId);
         else {
            newObject.id = oldId;
        }
    };
    /**
     *  Method to create competencies (and relationships if the parameters are passed in)
     *  based on a CSV file and references to which columns correspond to which pieces
     *  of data.
     * 
     *  @param {Object}                        file
     *                                         CSV File to import competencies from
     *  @param {String}                        serverUrl
     *                                         URL Prefix for the created competencies (and relationships?)
     *  @param {EcIdentity}                    owner
     *                                         EcIdentity that will own the created competencies (and relationships?)
     *  @param {int}                           nameIndex
     *                                         Index of the column that contains the competency names
     *  @param {int}                           descriptionIndex
     *                                         Index of the column that contains the competency descriptions
     *  @param {int}                           scopeIndex
     *                                         Index of the column that contains the competency scopes
     *  @param {int}                           idIndex
     *                                         Index of the column that contains the old competency ID (Optional, if not exists pass null or negative)
     *  @param {Object}                        [relations]
     *                                         CSV File to import relationships from (Optional, if not exists pass null)
     *  @param {int}                           [sourceIndex]
     *                                         Index (in relation file) of the column containing the relationship source competency ID (Optional, if not exists pass null or negative)
     *  @param {int}                           [relationTypeIndex]
     *                                         Index (in relation file) of the column containing the relationship type (Optional, if not exists pass null or negative)
     *  @param {int}                           [destIndex]
     *                                         Index (in relation file) of the column containing the relationship destination competency ID (Optional, if not exists pass null or negative)
     *  @param {Callback2<Array<EcCompetency>, Array<EcAlignment>>} success
     *                                         Callback triggered after the competencies (and relationships?) have been created
     *  @param {Callback1<Object>}             [failure]
     *                                         Callback triggered if an error during creating the competencies
     *  @param {Callback1<Object>}             [incremental]
     *                                         Callback triggered incrementally during creation of competencies to indicate progress,
     *                                         returns an object indicating the number of competencies (and relationships?) created so far
     *  @memberOf CSVImport
     *  @method importCompetencies
     *  @static
     */
    constructor.importCompetencies = function(file, serverUrl, owner, nameIndex, descriptionIndex, scopeIndex, idIndex, relations, sourceIndex, relationTypeIndex, destIndex, success, failure, incremental, uniquify, repo) {
        CSVImport.progressObject = null;
        CSVImport.importCsvLookup = new Object();
        if (nameIndex < 0) {
            failure("Name Index not Set");
            return;
        }
        var competencies = [];
        Papa.parse(file, {encoding: "UTF-8", complete: function(results) {
            var tabularData = (results)["data"];
            var colNames = tabularData[0];
            for (var i = 1; i < tabularData.length; i++) {
                if (tabularData[i].length == 0 || (tabularData[i].length == 1 && (tabularData[i][0] == null || tabularData[i][0] == undefined || tabularData[i][0] == ""))) {
                    continue;
                }
                if (tabularData[i][nameIndex] == null || tabularData[i][nameIndex] == undefined || tabularData[i][nameIndex] == "") {
                    continue;
                }
                var competency = new EcCompetency();
                competency.name = tabularData[i][nameIndex];
                if (descriptionIndex >= 0) 
                    competency.description = tabularData[i][descriptionIndex];
                if (scopeIndex >= 0) 
                    competency.scope = tabularData[i][scopeIndex];
                if ((uniquify == undefined || uniquify == null || uniquify == false) && idIndex != null && idIndex >= 0) {
                    competency.id = tabularData[i][idIndex];
                    CSVImport.transformId(tabularData[i][idIndex], competency, serverUrl, repo);
                } else {
                    if (repo == null || repo.selectedServer.indexOf(serverUrl) != -1) 
                        competency.generateId(serverUrl);
                     else 
                        competency.generateShortId(serverUrl);
                }
                if (owner != undefined && owner != null) 
                    competency.addOwner(owner.ppk.toPk());
                var shortId = null;
                if (idIndex != null && idIndex != undefined && idIndex >= 0) {
                    var oldId = tabularData[i][idIndex];
                    shortId = EcRemoteLinkedData.trimVersionFromUrl(oldId);
                    (CSVImport.importCsvLookup)[shortId] = competency.shortId();
                }
                if (idIndex != null && idIndex != undefined && idIndex >= 0 && tabularData[i][idIndex] != null && tabularData[i][idIndex] != "") {
                    if ((CSVImport.importCsvLookup)[tabularData[i][idIndex]] == null) 
                        (CSVImport.importCsvLookup)[tabularData[i][idIndex]] = competency.shortId();
                }
                (CSVImport.importCsvLookup)[competency.getName()] = competency.shortId();
                for (var idx = 0; idx < tabularData[i].length; idx++) {
                    var name = colNames[idx];
                    if (name == null || name.trim() == "" || name.startsWith("@") || name.indexOf(".") != -1 || tabularData[i][idx].trim() == "" || idx == nameIndex || idx == descriptionIndex || idx == scopeIndex || idx == idIndex) {
                        continue;
                    } else {
                        (competency)[colNames[idx]] = tabularData[i][idx];
                    }
                }
                competencies.push(competency);
            }
            CSVImport.saved = 0;
            for (var i = 0; i < competencies.length; i++) {
                var comp = competencies[i];
                CSVImport.saveCompetency(comp, incremental, competencies, relations, success, serverUrl, owner, sourceIndex, relationTypeIndex, destIndex, failure, repo);
            }
        }, error: failure});
    };
    constructor.saveCompetency = function(comp, incremental, competencies, relations, success, serverUrl, owner, sourceIndex, relationTypeIndex, destIndex, failure, repo) {
        Task.asyncImmediate(function(o) {
            var keepGoing = o;
            var saveDone = function(results) {
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
                        CSVImport.importRelations(serverUrl, owner, relations, sourceIndex, relationTypeIndex, destIndex, competencies, success, failure, incremental, repo);
                }
                keepGoing();
            };
            comp.save(saveDone, saveDone, repo);
        });
    };
    /**
     *  Handles actually importing the relationships from the relationship CSV file
     * 
     *  @param {String}                        serverUrl
     *                                         URL Prefix for the created competencies (and relationships?)
     *  @param {EcIdentity}                    owner
     *                                         EcIdentity that will own the created competencies (and relationships?)
     *  @param {Object}                        file
     *                                         CSV File to import competencies from
     *  @param {int}                           sourceIndex
     *                                         Index (in relation file) of the column containing the relationship source competency ID
     *  @param {int}                           relationTypeIndex
     *                                         Index (in relation file) of the column containing the relationship type
     *  @param {int}                           destIndex
     *                                         Index (in relation file) of the column containing the relationship destination competency ID
     *  @param {Array<EcCompetency>}           competencies
     *                                         Array of newly created competencies
     *  @param {Callback2<Array<EcCompetency>, Array<EcAlignment>>} success
     *                                         Callback triggered after the relationships have been created
     *  @param {Callback1<Object>}             failure
     *                                         Callback triggered if an error during creating the relationships
     *  @param {Callback1<Object>}             incremental
     *                                         Callback triggered incrementally during creation to indicate progress
     *  @memberOf CSVImport
     *  @method importRelations
     *  @private
     *  @static
     */
    constructor.importRelations = function(serverUrl, owner, file, sourceIndex, relationTypeIndex, destIndex, competencies, success, failure, incremental, repo) {
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
        Papa.parse(file, {encoding: "UTF-8", complete: function(results) {
            var tabularData = (results)["data"];
            for (var i = 1; i < tabularData.length; i++) {
                var alignment = new EcAlignment();
                var sourceKey = tabularData[i][sourceIndex];
                var relationTypeKey = tabularData[i][relationTypeIndex];
                var destKey = tabularData[i][destIndex];
                if ((CSVImport.importCsvLookup)[sourceKey] == null) 
                    alignment.source = sourceKey;
                 else 
                    alignment.source = (CSVImport.importCsvLookup)[sourceKey];
                if ((CSVImport.importCsvLookup)[destKey] == null) 
                    alignment.target = destKey;
                 else 
                    alignment.target = (CSVImport.importCsvLookup)[destKey];
                alignment.relationType = relationTypeKey;
                if (owner != null) 
                    alignment.addOwner(owner.ppk.toPk());
                if (repo == null || repo.selectedServer.indexOf(serverUrl) != -1) 
                    alignment.generateId(serverUrl);
                 else 
                    alignment.generateShortId(serverUrl);
                relations.push(alignment);
            }
            CSVImport.saved = 0;
            for (var i = 0; i < relations.length; i++) {
                var relation = relations[i];
                CSVImport.saveRelation(relation, incremental, relations, success, competencies, failure, repo);
            }
            if (CSVImport.saved == 0 && CSVImport.saved == relations.length) {
                success(competencies, relations);
            }
        }, error: failure});
    };
    constructor.saveRelation = function(relation, incremental, relations, success, competencies, failure, repo) {
        Task.asyncImmediate(function(o) {
            var keepGoing = o;
            relation.save(function(results) {
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
                keepGoing();
            }, function(results) {
                failure("Failed to save competency or relation");
                for (var j = 0; j < competencies.length; j++) {
                    competencies[j]._delete(null, null, null);
                }
                for (var j = 0; j < relations.length; j++) {
                    relations[j]._delete(null, null);
                }
                keepGoing();
            }, repo);
        });
    };
    constructor.hasContextColumn = function(colNames) {
        for (var idx = 0; idx < colNames.length; idx++) {
            if (colNames[idx] == "@context") {
                return idx;
            }
        }
        return -1;
    };
    constructor.hasTypeColumn = function(colNames) {
        for (var idx = 0; idx < colNames.length; idx++) {
            if (colNames[idx] == "@type") {
                return idx;
            }
        }
        return -1;
    };
    constructor.expandObject = function(nestedFields, nestedObj, value) {
        if (nestedFields.length == 0) {
            return;
        } else if (nestedFields.length == 1) {
            (nestedObj)[nestedFields[0]] = value;
        } else {
            var key = nestedFields[0];
            if ((nestedObj)[key] == null || (nestedObj)[key] == undefined) 
                (nestedObj)[key] = new Object();
            nestedFields.splice(0, 1);
            CSVImport.expandObject(nestedFields, (nestedObj)[key], value);
        }
    };
    constructor.transformReferences = function(data) {
        var props = (data);
        for (var prop in props) {
            if (props[prop] == null || props[prop] == undefined || Object.prototype.toString.call(props[prop]).indexOf("String") == -1) {
                if (EcObject.isObject(props[prop])) {
                    var nested = props[prop];
                    CSVImport.transformReferences(nested);
                    (data)[prop] = nested;
                }
                continue;
            }
            var oldVal = props[prop];
            if ((CSVImport.importCsvLookup)[oldVal] != null && (CSVImport.importCsvLookup)[oldVal] != undefined && (CSVImport.importCsvLookup)[oldVal] != "") {
                (data)[prop] = (CSVImport.importCsvLookup)[oldVal];
            }
        }
    };
    constructor.importData = function(file, serverUrl, owner, success, failure, incremental, idIndex, assignedContext, assignedType, repo) {
        var objects = [];
        var hasAssignedContext = assignedContext != undefined && assignedContext != null && assignedContext.trim() != "";
        var hasAssignedType = assignedType != undefined && assignedType != null && assignedType.trim() != "";
        CSVImport.importCsvLookup = new Object();
        Papa.parse(file, {encoding: "UTF-8", complete: function(results) {
            var tabularData = (results)["data"];
            var colNames = tabularData[0];
            var contextIdx = -1;
            var typeIdx = -1;
            if (!hasAssignedContext && (contextIdx = CSVImport.hasContextColumn(colNames)) == -1) {
                failure("Was not passed and cannot find column with data context");
            } else if (!hasAssignedType && (typeIdx = CSVImport.hasTypeColumn(colNames)) == 1) {
                failure("Was not passed and cannot find column with data type");
            }
            for (var i = 1; i < tabularData.length; i++) {
                if (tabularData[i].length == 0 || (tabularData[i].length == 1 && (tabularData[i][0] == null || tabularData[i][0] == undefined || tabularData[i][0] == ""))) {
                    continue;
                }
                var context = null;
                var type = null;
                if (hasAssignedContext) 
                    context = assignedContext;
                 else 
                    context = tabularData[i][contextIdx];
                if (hasAssignedType) 
                    type = assignedType;
                 else 
                    type = tabularData[i][typeIdx];
                var data = new EcRemoteLinkedData(context, type);
                var nestedObjs = {};
                for (var idx = 0; idx < tabularData[i].length; idx++) {
                    var name = colNames[idx];
                    if (name == "@id" || name == "id") {
                        data.id = tabularData[i][idx];
                        continue;
                    } else if (name == null || name.trim() == "" || name.startsWith("@") || tabularData[i][idx].trim() == "" || idx == contextIdx || idx == typeIdx) {
                        continue;
                    } else if (name.indexOf(".") != -1) {
                        var split = (name.split("."));
                        if (split.length > 1) {
                            var key = split[0];
                            if (nestedObjs[key] == null || nestedObjs[key] == undefined) 
                                nestedObjs[key] = new Object();
                            split.splice(0, 1);
                            CSVImport.expandObject(split, nestedObjs[key], tabularData[i][idx]);
                            continue;
                        }
                        name = split[0];
                    }
                    var val = tabularData[i][idx];
                    (data)[name] = val;
                }
                for (var key in nestedObjs) {
                    (data)[key] = nestedObjs[key];
                }
                if (owner != null) 
                    data.addOwner(owner.ppk.toPk());
                var fileId = data.id;
                if (idIndex != undefined && idIndex != null && idIndex >= 0) {
                    data.id = tabularData[i][idIndex];
                    CSVImport.transformId(tabularData[i][idIndex], data, serverUrl, repo);
                } else {
                    if (repo == null || repo.selectedServer.indexOf(serverUrl) != -1) 
                        data.generateId(serverUrl);
                     else 
                        data.generateShortId(serverUrl);
                }
                var shortId;
                if (idIndex != null && idIndex != undefined && idIndex >= 0) {
                    var oldId = tabularData[i][idIndex];
                    shortId = EcRemoteLinkedData.trimVersionFromUrl(oldId);
                    (CSVImport.importCsvLookup)[shortId] = data.shortId();
                }
                if (idIndex != null && idIndex != undefined && idIndex >= 0 && tabularData[i][idIndex] != null && tabularData[i][idIndex] != "") {
                    if ((CSVImport.importCsvLookup)[tabularData[i][idIndex]] == null) 
                        (CSVImport.importCsvLookup)[tabularData[i][idIndex]] = data.shortId();
                } else if (fileId != null && fileId != undefined && fileId != "") {
                    if ((CSVImport.importCsvLookup)[fileId] == null) 
                        (CSVImport.importCsvLookup)[fileId] = data.shortId();
                    shortId = EcRemoteLinkedData.trimVersionFromUrl(fileId);
                    if ((CSVImport.importCsvLookup)[shortId] == null) 
                        (CSVImport.importCsvLookup)[shortId] = data.shortId();
                }
                objects.push(data);
            }
            CSVImport.saved = 0;
            for (var i = 0; i < objects.length; i++) {
                var data = objects[i];
                CSVImport.transformReferences(data);
                CSVImport.saveTransformedData(data, incremental, objects, success, failure, repo);
            }
        }, error: failure});
    };
    constructor.saveTransformedData = function(data, incremental, objects, success, failure, repo) {
        Task.asyncImmediate(function(o) {
            var keepGoing = o;
            var scs = function(results) {
                CSVImport.saved++;
                if (CSVImport.saved % CSVImport.INCREMENTAL_STEP == 0) 
                    incremental(CSVImport.saved);
                if (CSVImport.saved == objects.length) 
                    success(objects);
                keepGoing();
            };
            var err = function(results) {
                failure("Failed to save object");
                keepGoing();
            };
            if (repo == null) 
                EcRepository.save(data, scs, err);
             else 
                repo.saveTo(data, scs, err);
        });
    };
}, {importCsvLookup: "Object", progressObject: "Object"}, {});
var CTDLASNCSVImport = function() {};
CTDLASNCSVImport = stjs.extend(CTDLASNCSVImport, null, [], function(constructor, prototype) {
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
        Papa.parse(file, {encoding: "UTF-8", complete: function(results) {
            var tabularData = (results)["data"];
            var colNames = tabularData[0];
            var nameToCol = new Object();
            for (var i = 0; i < colNames.length; i++) 
                (nameToCol)[colNames[i]] = i;
            var frameworkCounter = 0;
            var competencyCounter = 0;
            var typeCol = (nameToCol)["@type"];
            if (typeCol == null) {
                this.error("No @type in CSV.");
                return;
            }
            for (var i = 0; i < tabularData.length; i++) {
                if (i == 0) 
                    continue;
                var col = tabularData[i];
                if (col[typeCol] != null && col[typeCol].trim() == "ceasn:CompetencyFramework") 
                    frameworkCounter++;
                 else if (col[typeCol] != null && col[typeCol].trim() == "ceasn:Competency") 
                    competencyCounter++;
                 else if (col[typeCol] == null || col[typeCol] == "") 
                    continue;
                 else {
                    this.error("Found unknown type:" + col[typeCol]);
                    return;
                }
            }
            success(frameworkCounter, competencyCounter);
        }, error: failure});
    };
    constructor.importFrameworksAndCompetencies = function(repo, file, success, failure, ceo) {
        if (file == null) {
            failure("No file to analyze");
            return;
        }
        if ((file)["name"] == null) {
            failure("Invalid file");
        } else if (!((file)["name"]).endsWith(".csv")) {
            failure("Invalid file type");
        }
        Papa.parse(file, {header: true, encoding: "UTF-8", complete: function(results) {
            var tabularData = (results)["data"];
            var frameworks = new Object();
            var frameworkArray = new Array();
            var frameworkRows = new Object();
            var competencies = new Array();
            var competencyRows = new Object();
            var relations = new Array();
            var relationById = new Object();
            new EcAsyncHelper().each(tabularData, function(pretranslatedE, callback0) {
                if ((pretranslatedE)["@type"] == "ceasn:CompetencyFramework") {
                    var translator = new EcLinkedData(null, null);
                    translator.copyFrom(pretranslatedE);
                    CTDLASNCSVImport.cleanUpTranslator(translator);
                    translator.recast("https://schema.cassproject.org/0.4/ceasn2cass", "https://schema.cassproject.org/0.4", function(e) {
                        var f = new EcFramework();
                        f.copyFrom(e);
                        if ((e)["owner"] != null) {
                            var id = new EcIdentity();
                            id.ppk = EcPpk.fromPem((e)["owner"]);
                            f.addOwner(id.ppk.toPk());
                            EcIdentityManager.addIdentityQuietly(id);
                        }
                        if (ceo != null) 
                            f.addOwner(ceo.ppk.toPk());
                        if (EcFramework.template != null && (EcFramework.template)[("schema:dateCreated")] != null) {
                            CTDLASNCSVImport.setDateCreated(e, f);
                        }
                        (frameworks)[f.id] = f;
                        (frameworkRows)[f.id] = e;
                        (f)["ceasn:hasChild"] = null;
                        (f)["ceasn:hasTopChild"] = null;
                        frameworkArray.push(f);
                        f.competency = new Array();
                        f.relation = new Array();
                        callback0();
                    }, failure);
                } else if ((pretranslatedE)["@type"] == "ceasn:Competency") {
                    var translator = new EcLinkedData(null, null);
                    translator.copyFrom(pretranslatedE);
                    CTDLASNCSVImport.cleanUpTranslator(translator);
                    translator.recast("https://schema.cassproject.org/0.4/ceasn2cass", "https://schema.cassproject.org/0.4", function(e) {
                        var f = new EcCompetency();
                        f.copyFrom(e);
                        if ((e)["id"] == null) {
                            callback0();
                            return;
                        }
                        if ((e)["ceasn:isPartOf"] != null) {
                            ((frameworks)[(e)["ceasn:isPartOf"]]).competency.push(f.shortId());
                        } else {
                            var parent = e;
                            var done = false;
                             while (!done && parent != null){
                                if ((parent)["ceasn:isChildOf"] != null && (parent)["ceasn:isChildOf"] != "") {
                                    parent = (competencyRows)[(parent)["ceasn:isChildOf"]];
                                } else if ((parent)["ceasn:isTopChildOf"] != null && (parent)["ceasn:isTopChildOf"] != "") {
                                    parent = (frameworkRows)[(parent)["ceasn:isTopChildOf"]];
                                    done = true;
                                }
                            }
                            if (!done) {
                                this.error("Could not find framework:" + (e)["type"]);
                                return;
                            }
                            if (parent != null) {
                                if ((parent)["type"] == "Framework") {
                                    (e)["ceasn:isPartOf"] = (parent)["id"];
                                    ((frameworks)[(parent)["id"]]).competency.push(f.shortId());
                                } else {
                                    this.error("Object cannot trace to framework:" + (e)["type"]);
                                    return;
                                }
                            } else {
                                this.error("Object has no framework:" + (e)["type"]);
                                return;
                            }
                        }
                        if ((e)["owner"] == null) {
                            if (((frameworkRows)[(e)["ceasn:isPartOf"]])["owner"] != null) 
                                (e)["owner"] = ((frameworkRows)[(e)["ceasn:isPartOf"]])["owner"];
                        }
                        var id = new EcIdentity();
                        if ((e)["owner"] != null) {
                            id.ppk = EcPpk.fromPem((e)["owner"]);
                            if (id.ppk != null) 
                                f.addOwner(id.ppk.toPk());
                            EcIdentityManager.addIdentityQuietly(id);
                        }
                        if (ceo != null) 
                            f.addOwner(ceo.ppk.toPk());
                        if (EcCompetency.template != null && (EcCompetency.template)[("schema:dateCreated")] != null) {
                            CTDLASNCSVImport.setDateCreated(e, f);
                        }
                        if ((e)["ceasn:isChildOf"] != null) {
                            CTDLASNCSVImport.createEachRelation(e, "ceasn:isChildOf", Relation.NARROWS, repo, ceo, id, relations, relationById, frameworks, -1);
                        }
                        if ((e)["ceasn:broadAlignment"] != null) {
                            CTDLASNCSVImport.createRelations(e, "ceasn:broadAlignment", Relation.NARROWS, repo, ceo, id, relations, relationById, frameworks);
                        }
                        if ((e)["ceasn:narrowAlignment"] != null) {
                            CTDLASNCSVImport.createRelations(e, "ceasn:narrowAlignment", Relation.NARROWS, repo, ceo, id, relations, relationById, frameworks);
                        }
                        if ((e)["sameAs"] != null) {
                            CTDLASNCSVImport.createRelations(e, "sameAs", Relation.IS_EQUIVALENT_TO, repo, ceo, id, relations, relationById, frameworks);
                        }
                        if ((e)["ceasn:majorAlignment"] != null) {
                            CTDLASNCSVImport.createRelations(e, "ceasn:majorAlignment", "majorRelated", repo, ceo, id, relations, relationById, frameworks);
                        }
                        if ((e)["ceasn:minorAlignment"] != null) {
                            CTDLASNCSVImport.createRelations(e, "ceasn:minorAlignment", "minorRelated", repo, ceo, id, relations, relationById, frameworks);
                        }
                        if ((e)["ceasn:prerequisiteAlignment"] != null) {
                            CTDLASNCSVImport.createRelations(e, "ceasn:prerequisiteAlignment", Relation.REQUIRES, repo, ceo, id, relations, relationById, frameworks);
                        }
                        (f)["ceasn:isTopChildOf"] = null;
                        (f)["ceasn:isChildOf"] = null;
                        (f)["ceasn:isPartOf"] = null;
                        (f)["ceasn:broadAlignment"] = null;
                        (f)["ceasn:narrowAlignment"] = null;
                        (f)["sameAs"] = null;
                        (f)["ceasn:majorAlignment"] = null;
                        (f)["ceasn:minorAlignment"] = null;
                        (f)["ceasn:prerequisiteAlignment"] = null;
                        (f)["ceasn:hasChild"] = null;
                        competencies.push(f);
                        (competencyRows)[f.id] = e;
                        callback0();
                    }, failure);
                } else if ((pretranslatedE)["@type"] == null || (pretranslatedE)["@type"] == "") {
                    callback0();
                    return;
                } else {
                    this.error("Found unknown type:" + (pretranslatedE)["@type"]);
                    callback0();
                    return;
                }
            }, function(strings) {
                success(frameworkArray, competencies, relations);
            });
        }, error: failure});
    };
    constructor.cleanUpTranslator = function(translator) {
        for (var key in (translator)) {
            if ((translator)[key] == "") {
                (translator)[key] = null;
            } else if ((translator)[key] != null) {
                var thisKey = (translator)[key];
                if ((typeof thisKey) == "string") {
                    if (((translator)[key]).trim().length == 0) {
                        (translator)[key] = null;
                    } else if ((thisKey).indexOf("|") != -1) {
                        thisKey = (thisKey).split("|");
                        (translator)[key] = thisKey;
                        for (var i = 0; i < (thisKey).length; i++) {
                            if ((thisKey)[i] != (thisKey)[i].trim()) {
                                var thisVal = (thisKey)[i].trim();
                                (thisKey)[i] = thisVal;
                            }
                        }
                    }
                }
                if (key != key.trim()) {
                    var trimKey = key.trim();
                    (translator)[trimKey] = (translator)[key];
                    (translator)[key] = null;
                }
            }
        }
    };
    constructor.createRelations = function(e, field, type, repo, ceo, id, relations, relationById, frameworks) {
        if (!EcArray.isArray((e)[field])) {
            var makeArray = Array((e)[field]);
            (e)[field] = makeArray;
        }
        for (var i = 0; i < ((e)[field]).length; i++) {
            CTDLASNCSVImport.createEachRelation(e, field, type, repo, ceo, id, relations, relationById, frameworks, i);
        }
    };
    constructor.createEachRelation = function(e, field, type, repo, ceo, id, relations, relationById, frameworks, i) {
        var r = new EcAlignment();
        r.generateId(repo.selectedServer);
        if (ceo != null) 
            r.addOwner(ceo.ppk.toPk());
        if (id.ppk != null) 
            r.addOwner(id.ppk.toPk());
        r.relationType = type;
        if (field == "ceasn:narrowAlignment") {
            r.source = ((e)[field])[i];
            r.target = (e)["id"];
        } else {
            r.source = (e)["id"];
            if (i != -1) {
                r.target = ((e)[field])[i];
            } else {
                r.target = ((e)[field]);
            }
        }
        relations.push(r);
        (relationById)[r.shortId()] = r;
        ((frameworks)[(e)["ceasn:isPartOf"]]).relation.push(r.shortId());
    };
    constructor.setDateCreated = function(importObject, object) {
        if ((importObject)["ceasn:dateCreated"] == null && (importObject)["schema:dateCreated"] == null) {
            var timestamp = object.getTimestamp();
            var date;
            if (timestamp != null) {
                date = new Date(parseInt(timestamp)).toISOString();
            } else {
                date = new Date().toISOString();
            }
            (object)["schema:dateCreated"] = date;
        }
    };
}, {}, {});
var CTDLASNCSVConceptImport = function() {};
CTDLASNCSVConceptImport = stjs.extend(CTDLASNCSVConceptImport, null, [], function(constructor, prototype) {
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
        Papa.parse(file, {encoding: "UTF-8", complete: function(results) {
            var tabularData = (results)["data"];
            var colNames = tabularData[0];
            var nameToCol = new Object();
            for (var i = 0; i < colNames.length; i++) 
                (nameToCol)[colNames[i]] = i;
            var conceptSchemeCounter = 0;
            var conceptCounter = 0;
            var typeCol = (nameToCol)["@type"];
            if (typeCol == null) {
                this.error("No @type in CSV.");
                return;
            }
            for (var i = 0; i < tabularData.length; i++) {
                if (i == 0) 
                    continue;
                var col = tabularData[i];
                if (col[typeCol] == "skos:ConceptScheme") 
                    conceptSchemeCounter++;
                 else if (col[typeCol] == "skos:Concept") 
                    conceptCounter++;
                 else if (col[typeCol] == null || col[typeCol] == "") 
                    continue;
                 else {
                    this.error("Found unknown type:" + col[typeCol]);
                    return;
                }
            }
            success(conceptSchemeCounter, conceptCounter);
        }, error: failure});
    };
    constructor.importFrameworksAndCompetencies = function(repo, file, success, failure, ceo) {
        if (file == null) {
            failure("No file to analyze");
            return;
        }
        if ((file)["name"] == null) {
            failure("Invalid file");
        } else if (!((file)["name"]).endsWith(".csv")) {
            failure("Invalid file type");
        }
        Papa.parse(file, {header: true, encoding: "UTF-8", complete: function(results) {
            var tabularData = (results)["data"];
            var schemeArray = new Array();
            var concepts = new Array();
            new EcAsyncHelper().each(tabularData, function(pretranslatedE, callback0) {
                if ((pretranslatedE)["@type"] == "skos:ConceptScheme") {
                    var translator = new EcLinkedData(null, null);
                    translator.copyFrom(pretranslatedE);
                    CTDLASNCSVImport.cleanUpTranslator(translator);
                    if ((translator)["ceasn:name"] != null) {
                        var name = (translator)["ceasn:name"];
                        var nameWithLanguage = new Object();
                        (nameWithLanguage)["en-US"] = name;
                        (translator)["ceasn:name"] = nameWithLanguage;
                    }
                    translator.recast("https://schema.cassproject.org/0.4/ceasn2cassConcepts", "https://schema.cassproject.org/0.4/skos", function(e) {
                        var f = new EcConceptScheme();
                        f.copyFrom(e);
                        if ((e)["owner"] != null) {
                            var id = new EcIdentity();
                            id.ppk = EcPpk.fromPem((e)["owner"]);
                            f.addOwner(id.ppk.toPk());
                            EcIdentityManager.addIdentityQuietly(id);
                        }
                        if (ceo != null) 
                            f.addOwner(ceo.ppk.toPk());
                        (f)["schema:dateModified"] = new Date().toISOString();
                        if (EcConceptScheme.template != null && (EcConceptScheme.template)[("schema:dateCreated")] != null) {
                            CTDLASNCSVImport.setDateCreated(e, f);
                        }
                        schemeArray.push(f);
                        callback0();
                    }, failure);
                } else if ((pretranslatedE)["@type"] == "skos:Concept") {
                    var translator = new EcLinkedData(null, null);
                    translator.copyFrom(pretranslatedE);
                    CTDLASNCSVImport.cleanUpTranslator(translator);
                    if ((translator)["skos:prefLabel"] != null) {
                        var name = (translator)["skos:prefLabel"];
                        var nameWithLanguage = new Object();
                        (nameWithLanguage)["en-US"] = name;
                        (translator)["skos:prefLabel"] = nameWithLanguage;
                    }
                    translator.recast("https://schema.cassproject.org/0.4/ceasn2cassConcepts", "https://schema.cassproject.org/0.4/skos", function(e) {
                        var f = new EcConcept();
                        f.copyFrom(e);
                        if ((e)["id"] == null) {
                            callback0();
                            return;
                        }
                        if ((e)["owner"] != null) {
                            var id = new EcIdentity();
                            id.ppk = EcPpk.fromPem((e)["owner"]);
                            if (id.ppk != null) 
                                f.addOwner(id.ppk.toPk());
                            EcIdentityManager.addIdentityQuietly(id);
                        }
                        if (ceo != null) 
                            f.addOwner(ceo.ppk.toPk());
                        if (EcConcept.template != null && (EcConcept.template)[("schema:dateCreated")] != null) {
                            CTDLASNCSVImport.setDateCreated(e, f);
                        }
                        if ((e)["skos:narrower"] != null) {
                            var relation = (e)["skos:narrower"];
                            if (!EcArray.isArray(relation)) {
                                var array = [relation];
                                (f)["skos:narrower"] = array;
                            }
                        }
                        if ((e)["skos:broader"] != null) {
                            var relation = (e)["skos:broader"];
                            if (!EcArray.isArray(relation)) {
                                var array = [relation];
                                (f)["skos:broader"] = array;
                            }
                        }
                        if ((e)["skos:broadMatch"] != null) {
                            var relation = (e)["skos:broadMatch"];
                            if (!EcArray.isArray(relation)) {
                                var array = [relation];
                                (f)["skos:broadMatch"] = array;
                            }
                        }
                        if ((e)["skos:closeMatch"] != null) {
                            var relation = (e)["skos:closeMatch"];
                            if (!EcArray.isArray(relation)) {
                                var array = [relation];
                                (f)["skos:closeMatch"] = array;
                            }
                        }
                        if ((e)["skos:exactMatch"] != null) {
                            var relation = (e)["skos:exactMatch"];
                            if (!EcArray.isArray(relation)) {
                                var array = [relation];
                                (f)["skos:exactMatch"] = array;
                            }
                        }
                        if ((e)["skos:narrowMatch"] != null) {
                            var relation = (e)["skos:narrowMatch"];
                            if (!EcArray.isArray(relation)) {
                                var array = [relation];
                                (f)["skos:narrowMatch"] = array;
                            }
                        }
                        if ((e)["skos:related"] != null) {
                            var relation = (e)["skos:related"];
                            if (!EcArray.isArray(relation)) {
                                var array = [relation];
                                (f)["skos:related"] = array;
                            }
                        }
                        if ((e)["skos:topConceptOf"] != null) {
                            var scheme = (e)["skos:topConceptOf"];
                            for (var i = 0; i < schemeArray.length; i++) {
                                var schemeObj = schemeArray[i];
                                if (scheme == (schemeObj)["id"]) {
                                    if ((schemeObj)["skos:hasTopConcept"] == null) {
                                        var hasTopConcept = new Array();
                                        (schemeObj)["skos:hasTopConcept"] = hasTopConcept;
                                    }
                                    var conceptId = f.shortId();
                                    EcArray.setAdd((schemeObj)["skos:hasTopConcept"], conceptId);
                                }
                            }
                        }
                        (f)["schema:dateModified"] = new Date().toISOString();
                        concepts.push(f);
                        callback0();
                    }, failure);
                } else if ((pretranslatedE)["@type"] == null || (pretranslatedE)["@type"] == "") {
                    callback0();
                    return;
                } else {
                    this.error("Found unknown type:" + (pretranslatedE)["@type"]);
                    callback0();
                    return;
                }
            }, function(strings) {
                success(schemeArray, concepts);
            });
        }, error: failure});
    };
}, {}, {});
