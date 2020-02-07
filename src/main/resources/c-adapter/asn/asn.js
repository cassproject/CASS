var asnContext = {
    asn: "http://purl.org/ASN/schema/core/",
    cc: "http://creativecommons.org/ns#",
    dc: "http://purl.org/dc/elements/1.1/",
    dcterms: "http://purl.org/dc/terms/",
    foaf: "http://xmlns.com/foaf/0.1/",
    gemq: "http://purl.org/gem/qualifiers/",
    loc: "http://www.loc.gov/loc.terms/relators/",
    owl: "http://www.w3.org/2002/07/owl#",
    rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    rdfs: "http://www.w3.org/2000/01/rdf-schema#",
    skos: "http://www.w3.org/2004/02/skos/core#",
    xsd: "http://www.w3.org/2001/XMLSchema#"
};

//asnContext["@vocab"] = "http://schema.cassproject.org/0.2/cass2asn";

function cassFrameworkAsAsn() {
    EcRepository.cache = new Object();

    if (false && repoEndpoint().contains("localhost"))
        error("Endpoint Configuration is not set.", 500);
    var query = queryParse.call(this);
    var framework = null;
    if (framework == null)
        framework = skyrepoGet.call(this, query);
    if (framework == null || framework["@type"] == null || !framework["@type"].contains("ramework"))
        framework = null;
    if (framework == null)
        framework = EcFramework.getBlocking(urlDecode(this.params.id));
    if (framework == null) {
        var competency = null;
        competency = skyrepoGet.call(this, query);
        if (competency == null)
            competency = EcCompetency.getBlocking(urlDecode(this.params.id));
        else {
            var c = new EcCompetency();
            c.copyFrom(competency);
            competency = c;
        }
        if (competency != null) {
            competency.context = "https://schema.cassproject.org/0.4/cass2asn";
            return jsonLdToRdfJson(competency.toJson());
        }
    }
    if (framework == null)
        error("Framework not found.", "404");

    var f = new EcFramework();
    f.copyFrom(framework);
    if (f.competency == null) f.competency = [];
    if (f.relation == null) f.relation = [];

    var ids = [];
    ids = ids.concat(f.competency);
    ids = ids.concat(f.relation);

    repo.precache(ids, function (results) {
    });

    var allCompetencies = JSON.parse(JSON.stringify(f.competency));
    var competencies = {};
    var topLevelCompIds = []
    if (f.competency != null)
        for (var i = 0; i < f.competency.length; i++) {
            var c = EcCompetency.getBlocking(f.competency[i]);
            if (c == null) continue;
            competencies[f.competency[i]] = c;
            if (competencies[f.competency[i]] == null)
                error("Competency not found.", 404);
        }

    if (f.relation != null)
        for (var i = 0; i < f.relation.length; i++) {
            //Workaround due to bug in 1.3.0
            if (EcRepository.getBlocking(f.relation[i]) == null) continue;
            var r = EcAlignment.getBlocking(f.relation[i]);
            if (r.source == null || r.target == null) continue;
            if (r.relationType == Relation.NARROWS) {
                EcArray.setRemove(f.competency, r.target);

                if (r.target == f.id || r.target == f.shortId()) continue;

                if (competencies[r.source] != null)
                    if (competencies[r.source]["gemq:isChildOf"] == null)
                        competencies[r.source]["gemq:isChildOf"] = [];
                if (competencies[r.source] != null)
                    if (competencies[r.target] != null)
                        competencies[r.source]["gemq:isChildOf"].push(competencies[r.target].id);
                    else
                        competencies[r.source]["gemq:isChildOf"].push(r.target);

                if (competencies[r.target] != null)
                    if (competencies[r.target]["gemq:hasChild"] == null)
                        competencies[r.target]["gemq:hasChild"] = [];
                if (competencies[r.target] != null)
                    if (competencies[r.source] != null)
                        competencies[r.target]["gemq:hasChild"].push(competencies[r.source].id);
                    else
                        competencies[r.target]["gemq:hasChild"].push(r.source);
            }
            if (r.relationType == Relation.IS_EQUIVALENT_TO) {
                EcArray.setRemove(f.competency, r.source);
                if (competencies[r.target] != null)
                    if (competencies[r.target].sameAs == null)
                        competencies[r.target].sameAs = [];
                if (competencies[r.source] != null)
                    if (competencies[r.source].sameAs == null)
                        competencies[r.source].sameAs = [];
                if (competencies[r.target] != null)
                    if (competencies[r.source] != null)
                        competencies[r.target].sameAs.push(competencies[r.source].id);
                    else
                        competencies[r.target].sameAs.push(r.source);

                if (competencies[r.source] != null)
                    if (competencies[r.target] != null)
                        competencies[r.source].sameAs.push(competencies[r.target].id);
                    else
                        competencies[r.source].sameAs.push(r.target);
            }
            if (r.relationType == Relation.IS_RELATED_TO) {
                EcArray.setRemove(f.competency, r.source);
                if (competencies[r.target] != null)
                    if (competencies[r.target]["skos:related"] == null)
                        competencies[r.target]["skos:related"] = [];
                if (competencies[r.target] != null)
                    if (competencies[r.source] != null)
                        competencies[r.target]["skos:related"].push(competencies[r.source].id);
                    else
                        competencies[r.target]["skos:related"].push(r.source);
                if (competencies[r.source] != null)
                    if (competencies[r.source]["skos:related"] == null)
                        competencies[r.source]["skos:related"] = [];
                if (competencies[r.source] != null)
                    if (competencies[r.target] != null)
                        competencies[r.source]["skos:related"].push(competencies[r.target].id);
                    else
                        competencies[r.source]["skos:related"].push(r.target);
            }
            if (r.relationType == Relation.REQUIRES) {
                EcArray.setRemove(f.competency, r.source);
                if (competencies[r.target] != null)
                    if (competencies[r.target]["asn:prerequisiteAlignment"] == null)
                        competencies[r.target]["asn:prerequisiteAlignment"] = [];
                if (competencies[r.target] != null)
                    if (competencies[r.source] != null)
                        competencies[r.target]["asn:prerequisiteAlignment"].push(competencies[r.source].id);
                    else
                        competencies[r.target]["asn:prerequisiteAlignment"].push(r.source);
            }
        }

    for (var i = 0; i < allCompetencies.length; i++) {
        var c = competencies[allCompetencies[i]];
        delete competencies[allCompetencies[i]];
        if (c == null) continue;
        var id = c.id;
        c.context = "https://schema.cassproject.org/0.4/cass2asn";
        if (c.type == null) //Already done / referred to by another name.
            continue;
        competencies[id] = JSON.parse(jsonLdToRdfJson(c.toJson()))[id];
    }

    f.context = "https://schema.cassproject.org/0.4/cass2asn";
    delete f.relation;
    competencies[f.id] = JSON.parse(jsonLdToRdfJson(f.toJson()))[f.id];
    return JSON.stringify(competencies, null, 2);
}

/**
 *
 * @param jsonLd
 * @returns
 */
function fixScalars(jsonLd) {
    var JSONLD_VALUE = "@value";
    var JSONLD_ID = "@id";
    var JSONLD_TYPE = "@type";
    var JSONLD_LANG = "@language";

    if (jsonLd === Object(jsonLd)) {
        for (var key in jsonLd) {
            try {
                var field = jsonLd[key];
                if (Array.isArray(field)) {
                    var flattenText = true;
                    var textArray = [];
                    var langArray = [];
                    for (var idx in field) {
                        var obj = field[idx];

                        if (obj === Object(obj)) {
                            if (obj["type"] != undefined) {
                                if (obj["type"] == "uri") {
                                    if (obj["value"] != undefined && obj[JSONLD_ID] == undefined) {
                                        obj[JSONLD_ID] = obj["value"];
                                        delete obj["value"];
                                    }
                                } else {
                                    if (obj["value"] != undefined && obj[JSONLD_VALUE] == undefined) {
                                        obj[JSONLD_VALUE] = obj["value"];
                                        delete obj["value"];
                                    }
                                }

                                delete obj["type"];
                            }
                            if (obj["datatype"] != undefined && obj[JSONLD_TYPE] == undefined) {
                                obj[JSONLD_TYPE] = obj["datatype"];
                                delete obj["datatype"];
                            }
                            if (obj["lang"] != undefined && obj[JSONLD_LANG] == undefined) {
                                obj[JSONLD_LANG] = obj["lang"];
                                delete obj["lang"];

                            }

                            field[idx] = obj;
                        }
                    }

                } else if (field === Object(field)) {
                    var keepGoing = true;


                    if (field["type"] != undefined) {
                        if (field["type"] == "uri") {
                            if (field["value"] != undefined && field[JSONLD_ID] == undefined) {
                                field[JSONLD_ID] = field["value"];
                                delete field["value"];
                                keepGoing = false;
                            }
                        } else {
                            if (field["value"] != undefined && field[JSONLD_VALUE] == undefined) {
                                field[JSONLD_VALUE] = field["value"];
                                delete field["value"];
                                keepGoing = false;
                            }
                        }

                        delete field["type"];
                        keepGoing = false;
                    }
                    if (field["datatype"] != undefined && field[JSONLD_TYPE] == undefined) {
                        field[JSONLD_TYPE] = field["datatype"];
                        delete field["datatype"];
                        keepGoing = false;
                    }
                    if (field["lang"] != undefined && field[JSONLD_LANG] == undefined) {
                        field[JSONLD_LANG] = field["lang"];
                        delete field["lang"];

                        keepGoing = false;
                    }

                    if (keepGoing) {
                        field = fixScalars(field);
                    }
                }

                jsonLd[key] = field;
            } catch (exception) {
                error("Exception when fixing json-ld scalars " + exception.message)
            }
        }
    }
    return jsonLd;
}

/**
 *
 */
function importFrameworkToCass(frameworkObj, competencyList) {
    var asnIdentity = new EcIdentity();
    asnIdentity.ppk = EcPpk.fromPem(keyFor("adapter.asn.private"));
    asnIdentity.displayName = "ASN Server Identity";
    EcIdentityManager.addIdentity(asnIdentity);

    if (false && repoEndpoint().contains("localhost"))
        error("Endpoint Configuration is not set.", 500);

    var asnToCassFrameworkContext = JSON.parse(JSON.stringify(asnContext));
    asnToCassFrameworkContext["@vocab"] = "https://schema.cassproject.org/0.4/";
    asnToCassFrameworkContext["asn:StandardDocument"] = "https://schema.cassproject.org/0.4/Framework";
    asnToCassFrameworkContext["dc:title"] = "http://schema.org/name";
    asnToCassFrameworkContext["dcterms:description"] = "http://schema.org/description";
    asnToCassFrameworkContext["sameAs"] = "http://schema.org/sameAs";

    var asnToCassCompetencyContext = JSON.parse(JSON.stringify(asnContext));
    asnToCassCompetencyContext["asn:Statement"] = "https://schema.cassproject.org/0.4/Competency";
    asnToCassCompetencyContext["dcterms:description"] = "http://schema.org/name";
    asnToCassCompetencyContext["sameAs"] = "http://schema.org/sameAs";

    var cassCompetencies = [];
    var cassRelationships = [];
    var relationshipMap = {};
    var parentMap = {};

    EcRemote.async = false;

    for (var idx in competencyList) {
        var asnComp = competencyList[idx];

        var compGuid = stringToHex(md5(asnComp["@id"]));
        print(compGuid);
        var compVersion = date(null, null, true);

        var canonicalId = asnComp["@id"];

        cassCompetencies.push(canonicalId);

        var childComps = asnComp["gemq:hasChild"];
        if (childComps != undefined && childComps.length != undefined) {
            for (var idx in childComps) {
                var r = new EcAlignment();
                r.source = childComps[idx]["@id"];
                r.target = canonicalId;
                r.relationType = Relation.NARROWS;
                r.generateId(repoEndpoint());
                r.addOwner(asnIdentity.ppk.toPk());

                if (relationshipMap[r.source + r.target] != true) {
                    relationshipMap[r.source + r.target] = true;
                    r.save(null, print);
                    cassRelationships.push(r.id);
                }
            }
        }

        var newComp = JSON.parse(JSON.stringify(asnComp));
        delete newComp["gemq:hasChild"];

        newComp["@context"] = asnToCassCompetencyContext;

        var expandedComp = jsonLdExpand(JSON.stringify(newComp));

        var compactedComp = jsonLdCompact(JSON.stringify(expandedComp), "https://schema.cassproject.org/0.4");

        delete compactedComp["gemq:isChildOf"];

        var c = new EcCompetency();
        c.copyFrom(compactedComp);
        c.addOwner(asnIdentity.ppk.toPk());
        EcIdentityManager.sign(c);
        this.dataStreams.put("signatureSheet", new java.io.StringBufferInputStream(EcIdentityManager.signatureSheetFor(c.owner, 60000, c.id)));
        skyrepoPut.call(this, {
            obj: c.toJson(),
            type: c.getFullType().replace("http://", "").replace("https://", "").replaceAll("/", "."),
            id: compGuid,
            version: compVersion
        });

        if (asnComp["gemq:isChildOf"] != undefined && asnComp["gemq:isChildOf"] != "") {
            var parentId = asnComp["gemq:isChildOf"]["@id"];
            if (parentId != frameworkObj["@id"]) {
                var r = new EcAlignment();
                r.source = compactedComp["@id"];

                r.target = parentId;
                r.relationType = Relation.NARROWS;
                r.generateId(repoEndpoint());
                r.addOwner(asnIdentity.ppk.toPk());

                if (relationshipMap[r.source + r.target] != true) {
                    relationshipMap[r.source + r.target] = true;
                    r.save(null, print);
                    cassRelationships.push(r.id);
                }
            }
        }
    } // end for each competency in  competencyList

    if (frameworkObj != null) {
        var guid = stringToHex(md5(frameworkObj["@id"]));
        var version = date(null, null, true);

        frameworkObj["@context"] = asnToCassFrameworkContext;

        var expanded = jsonLdExpand(JSON.stringify(frameworkObj))[0];

        var compacted = jsonLdCompact(JSON.stringify(expanded), "https://schema.cassproject.org/0.4/");

        delete compacted["gemq:hasChild"];

        compacted["competency"] = cassCompetencies;
        compacted["relation"] = cassRelationships;

        var f = new EcFramework();
        f.copyFrom(compacted);
        f.addOwner(asnIdentity.ppk.toPk());
        EcIdentityManager.sign(f);
        this.dataStreams.put("signatureSheet", new java.io.StringBufferInputStream(EcIdentityManager.signatureSheetFor(f.owner, 60000, f.id)));
        skyrepoPut.call(this, {
            obj: f.toJson(),
            type: f.getFullType().replace("http://", "").replace("https://", "").replaceAll("/", "."),
            id: guid,
            version: version
        });

        return repoEndpoint() + "asn/" + guid;
    } // end if frameworkObj != null
}

/**
 *
 */
function asnFrameworkToCass() {

    var jsonLd, text;

    var file = getFileFromPost.call(this);

    if (file == undefined || file == null) {
        error("Unable to find ASN to Convert");
    } else if (file.length != undefined) {
        var data = getFileFromPost.call(this, "data");
        if (data != undefined && data != null) {
            text = fileToString(data);
        } else {
            text = fileToString(file[0]);
        }
    } else {
        text = fileToString(file);
    }

    try {
        jsonLd = JSON.parse(text);
    } catch (e) {
        debug("Not json.");
        jsonLd = rdfToJsonLd(text);
    }

    var frameworkObj = undefined;
    var competencyList = [];

    if (jsonLd["@graph"] != undefined && jsonLd["@graph"] != "") {
        var graph = jsonLd["@graph"];

        for (var idx in graph) {
            var graphObj = graph[idx];

            if (graphObj["@type"] == "asn:StandardDocument") {
                frameworkObj = graphObj;
            } else if (graphObj["@type"] == "asn:Statement") { //&& graphObj["asn:statementLabel"] != undefined && (graphObj["asn:statementLabel"] == "Competency" || graphObj["asn:statementLabel"]["@value"] == "Competency")){
                competencyList.push(graphObj);
            }
        }

        if (frameworkObj == undefined && competencyList.length != Object.keys(graph).length) {
            return importJsonLdGraph.call(this, graph, jsonLd["@context"]);
        } else {
            return importFrameworkToCass.call(this, frameworkObj, competencyList)
        }
    } else {
        error("no @graph created, unsure how to parse");
    }
}


/**
 *
 * @param graph
 * @param context
 */
function importJsonLdGraph(graph, context) {
    EcRemote.async = false;
    var owner = fileToString.call(this, (fileFromDatastream).call(this, "owner"));

    var skosIdentity = new EcIdentity();
    skosIdentity.ppk = EcPpk.fromPem(keyFor("adapter.skos.private"));
    skosIdentity.displayName = "SKOS Server Identity";
    EcIdentityManager.addIdentity(skosIdentity);

    var conceptSchemeGuid;
    var lang = null;
    var toSave = [];

    for (var idx in graph) {
        var graphObj = graph[idx];

        if (context != undefined) {
            if (context == "http://credreg.net/ctdlasn/schema/context/json" || context == "http://credreg.net/ctdl/schema/context/json"
                || context == "https://credreg.net/ctdlasn/schema/context/json" || context == "https://credreg.net/ctdl/schema/context/json") {
                context = "https://schema.cassproject.org/0.4/ceasn2cassConcepts";
            }
            if (context["schema"] == undefined) {
                context["schema"] = "http://schema.org";
            }

            graphObj["@context"] = context;

            if (graphObj["rdfs:comment"] != null && graphObj["rdfs:comment"] !== undefined) {
                delete graphObj["dct:description"];
                delete graphObj["dcterms:description"];
            }

            var expanded = jsonLdExpand(JSON.stringify(graphObj))[0];
            var compacted;
            if (graphObj["@type"].indexOf("Concept") != -1) {
                compacted = jsonLdCompact(JSON.stringify(expanded), "https://schema.cassproject.org/0.4/skos/");
            }
            else {
                compacted = jsonLdCompact(JSON.stringify(expanded), "https://schema.cassproject.org/0.4/");
            }
        }

        var type = compacted["@type"]
        var guid = EcCrypto.md5(compacted["@id"]);
        var objToSave = compacted;

        if (type == "ConceptScheme") {
            conceptSchemeGuid = guid;
            objToSave["@context"] = "https://schema.cassproject.org/0.4/skos/";
            objToSave = new EcConceptScheme();
            objToSave.copyFrom(compacted);
            objToSave.addOwner(skosIdentity.ppk.toPk());
            if (owner != null)
                objToSave.addOwner(EcPk.fromPem(owner));

            if (objToSave["dcterms:language"] == null || objToSave["dcterms:language"] === undefined) {
                if (EcConceptScheme.template != null && EcConceptScheme.template["dcterms:language"] != null) {
                    objToSave["dcterms:language"] = EcConceptScheme.template["dcterms:language"];
                }
                else {
                    objToSave["dcterms:language"] = "en";
                }
            }
            else {
                lang = objToSave["dcterms:language"];
            }

            if (objToSave["skos:hasTopConcept"] != null && !EcArray.isArray(objToSave["skos:hasTopConcept"])) {
                objToSave["skos:hasTopConcept"] = [objToSave["skos:hasTopConcept"]];
            }

            if (objToSave["schema:dateCreated"] == null || objToSave["schema:dateCreated"] === undefined) {
                var timestamp;
                var date;
                if (!objToSave.id.substring(objToSave.id.lastIndexOf("/")).matches("\\/[0-9]+")) {
                    timestamp = null;
                }
                else {
                    timestamp = objToSave.id.substring(objToSave.id.lastIndexOf("/")+1);
                }
                if (timestamp != null) {
                    date = new Date(parseInt(timestamp)).toISOString();
                }
                else {
                    date = new Date().toISOString();
                }
                objToSave["schema:dateCreated"] = date;
            }
            toSave.push(objToSave);
        }
        else if (type == "Concept") {
            objToSave["@context"] = "https://schema.cassproject.org/0.4/skos/";
            objToSave = new EcConcept();
            objToSave.copyFrom(compacted);
            objToSave.addOwner(skosIdentity.ppk.toPk());
            if (owner != null)
                objToSave.addOwner(EcPk.fromPem(owner));

            if (objToSave["skos:narrower"] != null && !EcArray.isArray(objToSave["skos:narrower"])) {
                objToSave["skos:narrower"] = [objToSave["skos:narrower"]];
            }
            if (objToSave["skos:broader"] != null && !EcArray.isArray(objToSave["skos:broader"])) {
                objToSave["skos:broader"] = [objToSave["skos:broader"]];
            }
            if (objToSave["skos:broadMatch"] != null && !EcArray.isArray(objToSave["skos:broadMatch"])) {
                objToSave["skos:broadMatch"] = [objToSave["skos:broadMatch"]];
            }
            if (objToSave["skos:closeMatch"] != null && !EcArray.isArray(objToSave["skos:closeMatch"])) {
                objToSave["skos:closeMatch"] = [objToSave["skos:closeMatch"]];
            }
            if (objToSave["skos:exactMatch"] != null && !EcArray.isArray(objToSave["skos:exactMatch"])) {
                objToSave["skos:exactMatch"] = [objToSave["skos:exactMatch"]];
            }
            if (objToSave["skos:narrowMatch"] != null && !EcArray.isArray(objToSave["skos:narrowMatch"])) {
                objToSave["skos:narrowMatch"] = [objToSave["skos:narrowMatch"]];
            }
            if (objToSave["skos:related"] != null && !EcArray.isArray(objToSave["skos:related"])) {
                objToSave["skos:related"] = [objToSave["skos:related"]];
            }

            if (objToSave["schema:dateCreated"] == null || objToSave["schema:dateCreated"] === undefined) {
                var timestamp;
                var date;
                if (!objToSave.id.substring(objToSave.id.lastIndexOf("/")).matches("\\/[0-9]+")) {
                    timestamp = null;
                }
                else {
                    timestamp = objToSave.id.substring(objToSave.id.lastIndexOf("/")+1);
                }
                if (timestamp != null) {
                    date = new Date(parseInt(timestamp)).toISOString();
                }
                else {
                    date = new Date().toISOString();
                }
                objToSave["schema:dateCreated"] = date;
            }

            toSave.push(objToSave);
        }
    }
    repo.multiput(toSave, function() {}, console.error);
    if (conceptSchemeGuid) {
        return repoEndpoint() + "data/" + conceptSchemeGuid;
    }
}

function asnEndpoint() {
    if (this.params.methodType == "GET")
        return cassFrameworkAsAsn.call(this);
    else if (this.params.methodType == "POST" || this.params.methodType == "PUT")
        return asnFrameworkToCass.call(this);
    else if (this.params.methodType == "DELETE") {
        error("Not Yet Implemented.", "405");
        return "Not Yet Implemented";
    }
}

bindWebService("/asn", asnEndpoint);


//function test(){
//	var jsonLd;
//	var text = fileToString(fileLoad(this.params.path));
//	
//	try{
//		jsonLd = JSON.parse(text);
//	}catch(e){
//		debug("Not json")
//		
//		jsonLd = rdfToJsonLd(text);
//	}
//	
//	print(JSON.stringify(jsonLd));
//	
//	jsonLd = fixScalars(jsonLd);
//	
//	print(JSON.stringify(jsonLd));
//	
//	for(var idx in jsonLd){
//		var obj = jsonLd[idx];
//		
//		var context = JSON.parse(JSON.stringify(asnContext));
//		context["type"] = "@type";
//		context["uri"] = "@id";
//		
//		obj["@context"] = context;
//		
//		if(obj["@id"] == undefined)
//			obj["@id"] = idx;
//		
//		var expanded = jsonLdExpand(JSON.stringify(obj));
//		
//		//print(JSON.stringify(expanded));
//		
//		var graphObj = jsonLdCompact(JSON.stringify(expanded), "http://schema.cassproject.org/0.3/");
//		
//		print(JSON.stringify(graphObj));
//		
//		if(graphObj["rdf:type"] != undefined && graphObj["@type"] == undefined){
//			//print(JSON.stringify(graphObj["rdf:type"]));
//			//print(Object.keys(graphObj["rdf:type"]));
//			if(graphObj["rdf:type"]["@id"] == undefined){
//				graphObj["@type"] = graphObj["rdf:type"]
//			}else{
//				graphObj["@type"] = graphObj["rdf:type"]["@id"]
//			}
//			delete graphObj["rdf:type"];
//		}
//		
//		if(graphObj["@type"] == "asn:StandardDocument"){
//			frameworkObj = graphObj;
//		}else if (graphObj["@type"] == "asn:Statement" ){
//			competencyList.push(graphObj);
//		}
//	}
//}

//bindWebService("/quickTest", test);
