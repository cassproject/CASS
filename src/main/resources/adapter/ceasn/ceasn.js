var asnContext = {
    "asn": "http://purl.org/asn/schema/core/",
    "asnPublicationStatus": "http://purl.org/asn/scheme/ASNPublicationStatus/",
    "asnscheme": "http://purl.org/asn/scheme/",
    "ceasn": "http://purl.org/ctdlasn/terms/",
    "ceterms": "http://purl.org/ctdl/terms/",
    "dc": "http://purl.org/dc/elements/1.1/",
    "dct": "http://purl.org/dc/terms/",
    "gem": "http://purl.org/gem/elements/",
    "gemq": "http://purl.org/gem/qualifiers/",
    "loc": "http://www.loc.gov/loc.terms/",
    "locr": "http://www.loc.gov/loc.terms/relators/",
    "meta": "http://credreg.net/meta/terms/",
    "publicationStatus": "http://credreg.net/ctdlasn/vocabs/publicationStatus/",
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "schema": "http://schema.org/",
    "skos": "http://www.w3.org/2004/02/skos/core#",
    "vs": "https://www.w3.org/2003/06/sw-vocab-status/ns",
    "xsd": "http://www.w3.org/2001/XMLSchema#"
};

var ceasnIdentity = new EcIdentity();
ceasnIdentity.ppk = EcPpk.fromPem(ceasnPpk());
ceasnIdentity.displayName = "CEASN Server Identity";
EcIdentityManager.addIdentity(ceasnIdentity);

function cassFrameworkAsCeasn() {
    EcRepository.cache = {};
    var repo = new EcRepository();
    repo.selectedServer = repoEndpoint();

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
            error("Individual competencies are not permitted to be represented in CEASN outside of a framework. See https://github.com/CredentialEngine/CompetencyFrameworks/issues/43 for more details.", 404);
        }
    }
    if (framework == null)
        error("Framework not found.", 404);

    f = new EcFramework();
    f.copyFrom(framework);
    if (f.competency == null) f.competency = [];
    if (f.relation == null) f.relation = [];

    var all = [];
    all = all.concat(f.competency);
    all = all.concat(f.relation);
    repo.precache(all, null, null);

    var allCompetencies = JSON.parse(JSON.stringify(f.competency));
    var competencies = {};

    for (var i = 0; i < f.competency.length; i++) {
        var c = null;
        if (c == null)
            c = EcCompetency.getBlocking(f.competency[i]);
        competencies[f.competency[i]] = competencies[c.id] = c;
        if (competencies[c.id] == null)
            error("Competency not found.", 404);
    }

    for (var i = 0; i < f.relation.length; i++) {
    	//Workaround due to bug in 1.3.0
    	if (EcRepository.getBlocking(f.relation[i]) == null) continue;
        var r = EcAlignment.getBlocking(f.relation[i]);
        if (r.source == null || r.target == null) continue;
        if (r.relationType == Relation.NARROWS) {
            EcArray.setRemove(f.competency, r.target);

            if (r.target == f.id || r.target == f.shortId()) continue;

            if (competencies[r.source] != null)
                if (competencies[r.source]["ceasn:isChildOf"] == null)
                    competencies[r.source]["ceasn:isChildOf"] = [];

            if (competencies[r.source] != null)
                if (competencies[r.target] != null)
                    competencies[r.source]["ceasn:isChildOf"].push(competencies[r.target].id);
                else
                    competencies[r.source]["ceasn:isChildOf"].push(r.target);

            if (competencies[r.target] != null)
                if (competencies[r.target]["ceasn:hasChild"] == null)
                    competencies[r.target]["ceasn:hasChild"] = [];

            if (competencies[r.target] != null)
                if (competencies[r.source] != null)
                    competencies[r.target]["ceasn:hasChild"].push(competencies[r.source].id);
                else
                    competencies[r.target]["ceasn:hasChild"].push(r.source);
        }
        if (r.relationType == Relation.IS_EQUIVALENT_TO)
            if (r.target.indexOf("data") != 0 && r.source.indexOf("data") != 0) {

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
                if (competencies[r.target]["ceasn:relatedMatch"] == null)
                    competencies[r.target]["ceasn:relatedMatch"] = [];

            if (competencies[r.source] != null)
                if (competencies[r.source]["ceasn:relatedMatch"] == null)
                    competencies[r.source]["ceasn:relatedMatch"] = [];

            if (competencies[r.target] != null)
                if (competencies[r.source] != null)
                    competencies[r.target]["ceasn:relatedMatch"].push(competencies[r.source].id);
                else
                    competencies[r.target]["ceasn:relatedMatch"].push(r.source);

            if (competencies[r.source] != null)
                if (competencies[r.target] != null)
                    competencies[r.source]["ceasn:relatedMatch"].push(competencies[r.target].id);
                else
                    competencies[r.source]["ceasn:relatedMatch"].push(r.target);
        }
        if (r.relationType == Relation.REQUIRES) {
            EcArray.setRemove(f.competency, r.source);
            if (competencies[r.target] != null)
                if (competencies[r.target]["ceasn:prerequisiteAlignment"] == null)
                    competencies[r.target]["ceasn:prerequisiteAlignment"] = [];

            if (competencies[r.target] != null)
                if (competencies[r.source] != null)
                    competencies[r.target]["ceasn:prerequisiteAlignment"].push(competencies[r.source].id);
                else
                    competencies[r.target]["ceasn:prerequisiteAlignment"].push(r.source);
        }
    }

    var ctx = JSON.stringify(httpGet("http://credreg.net/ctdlasn/schema/context/json")["@context"]);
    f.competency = [];
    for (var i = 0; i < allCompetencies.length; i++) {
        var c = competencies[allCompetencies[i]];
        delete competencies[allCompetencies[i]];
        var id = c.id;
        c.context = "http://schema.cassproject.org/0.3/cass2ceasn";
        c["ceasn:isPartOf"] = f.id;
        if (c["ceasn:isChildOf"] == null) {
            c["ceasn:isChildOf"] = f.id;
            if (f["ceasn:hasTopChild"] == null)
                f["ceasn:hasTopChild"] = [];
            f["ceasn:hasTopChild"].push(c.id);
        }
        f.competency.push(c.id);
        competencies[allCompetencies[i]] = competencies[id] = jsonLdCompact(c.toJson(), ctx);
        competencies[id]["ceterms:ctid"] = "ce-" + uuidFromString(f.id + c.shortId());
        competencies[id]["ceasn:competencyText"] = competencies[id]["ceasn:name"];
        delete competencies[id]["ceasn:name"];
        if (competencies[id]["ceasn:inLanguage"] == null)
            competencies[id]["ceasn:inLanguage"] = "en";
        delete competencies[id]["@context"];
        competencies[id] = stripNonCe(competencies[id]);
    }

    f.context = "http://schema.cassproject.org/0.3/cass2ceasn";
    delete f.relation;

    if (f.description == null)
        f.description = f.name;
    framework = f;
    f = jsonLdCompact(f.toJson(), ctx);
    f["ceterms:ctid"] = "ce-" + uuidFromString(framework.id);

    if (f["ceasn:inLanguage"] == null)
        f["ceasn:inLanguage"] = "en";
    var results = [];
    for (var k in competencies) {
        var found = false;
        for (var j = 0; j < results.length; j++)
            if (results[j]["@id"] == competencies[k]["@id"]) {
                found = true;
                break;
            }
        if (found) continue;
        results.push(competencies[k]);
    }
    f = stripNonCe(f);
    results.push(f);
    delete f["@context"];
    var r = {};
    r["@graph"] = results;
    r["@context"] = "http://credreg.net/ctdlasn/schema/context/json";
    return JSON.stringify(r, null, 2);
}

function stripNonCe(f) {
    for (var k in f) {
        if (k.indexOf("@") != 0)
            if (k.indexOf("ceterms:ctid") != 0)
                if (k.indexOf("ceasn:description") != 0)
                    if (k.indexOf("ceasn:name") != 0)
                        if (k.indexOf("ceasn:codedNotation") != 0)
                            if (k.indexOf("ceasn:competencyText") != 0)
                                if (EcArray.isArray(f[k]) == false)
                                    f[k] = [f[k]];
        if (k.indexOf("ceasn:") == 0 || k.indexOf("ceterms:") == 0 || k.indexOf("@") == 0)
        ;
        else
            delete f[k];
    }
    return f;
}

function importCeFrameworkToCass(frameworkObj, competencyList) {
    if (false && repoEndpoint().contains("localhost"))
        error("Endpoint Configuration is not set.", 500);

    var asnToCassFrameworkContext = JSON.parse(JSON.stringify(asnContext));
    asnToCassFrameworkContext["@vocab"] = "http://schema.cassproject.org/0.3/";
    asnToCassFrameworkContext["ceasn:CompetencyFramework"] = "http://schema.cassproject.org/0.3/Framework";
    asnToCassFrameworkContext["ceasn:name"] = "http://schema.org/name";
    asnToCassFrameworkContext["ceasn:description"] = "http://schema.org/description";
    asnToCassFrameworkContext["ceasn:exactAlignment"] = "http://schema.org/sameAs";

    var asnToCassCompetencyContext = JSON.parse(JSON.stringify(asnContext));
    asnToCassCompetencyContext["ceasn:Competency"] = "http://schema.cassproject.org/0.3/Competency";
    asnToCassCompetencyContext["ceasn:description"] = "http://schema.org/name";
    asnToCassCompetencyContext["ceasn:exactAlignment"] = "http://schema.org/sameAs";

    var cassCompetencies = [];
    var cassRelationships = [];
    var relationshipMap = {};
    var parentMap = {};

    EcIdentityManager.addIdentity(ceasnIdentity);

    for (var idx in competencyList) {
        var asnComp = competencyList[idx];

        var compGuid = stringToHex(md5(asnComp["@id"]));
        print(compGuid);
        var compVersion = date(null, null, true);

        var canonicalId = asnComp["@id"];

        cassCompetencies.push(canonicalId);

        var childComps = asnComp["ceasn:hasChild"];
        if (childComps != undefined && childComps.length != undefined) {
            for (var idx in childComps) {
                var r = new EcAlignment();
                r.source = childComps[idx]["@id"];
                r.target = canonicalId;
                r.relationType = Relation.NARROWS;
                r.generateId(repoEndpoint());
                r.addOwner(ceasnIdentity.ppk.toPk());

                if (relationshipMap[r.source + r.target] != true) {
                    relationshipMap[r.source + r.target] = true;
                    r.save(null, print);
                    cassRelationships.push(r.id);
                }
            }
        }

        var newComp = JSON.parse(JSON.stringify(asnComp));
        delete newComp["ceasn:hasChild"];

        newComp["@context"] = asnToCassCompetencyContext;

        var expandedComp = jsonLdExpand(JSON.stringify(newComp));

        var compactedComp = jsonLdCompact(JSON.stringify(expandedComp), "http://schema.cassproject.org/0.3");

        delete compactedComp["ceasn:isChildOf"];

        var c = new EcCompetency();
        c.copyFrom(compactedComp);
        c.addOwner(ceasnIdentity.ppk.toPk());
        EcIdentityManager.sign(c);
        this.dataStreams.put("signatureSheet", new java.io.StringBufferInputStream(EcIdentityManager.signatureSheetFor(c.owner, 60000, c.id)));
        skyrepoPut.call(this, {
            obj: c.toJson(),
            type: c.getFullType().replace("http://", "").replaceAll("/", "."),
            id: compGuid,
            version: compVersion
        });

        if (asnComp["ceasn:isChildOf"] != undefined && asnComp["ceasn:isChildOf"] != "") {
            var parentId = asnComp["ceasn:isChildOf"]["@id"];
            if (parentId != frameworkObj["@id"]) {
                var r = new EcAlignment();
                r.source = compactedComp["@id"];

                r.target = parentId;
                r.relationType = Relation.NARROWS;
                r.generateId(repoEndpoint());
                r.addOwner(ceasnIdentity.ppk.toPk());

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

        var compacted = jsonLdCompact(JSON.stringify(expanded), "http://schema.cassproject.org/0.3/");

        delete compacted["ceasn:hasChild"];

        compacted["competency"] = cassCompetencies;
        compacted["relation"] = cassRelationships;

        var f = new EcFramework();
        f.copyFrom(compacted);
        f.addOwner(ceasnIdentity.ppk.toPk());
        EcIdentityManager.sign(f);
        this.dataStreams.put("signatureSheet", new java.io.StringBufferInputStream(EcIdentityManager.signatureSheetFor(f.owner, 60000, f.id)));
        skyrepoPut.call(this, {
            obj: f.toJson(),
            type: f.getFullType().replace("http://", "").replaceAll("/", "."),
            id: guid,
            version: version
        });

        return repoEndpoint() + "ceasn/" + guid;
    } // end if frameworkObj != null
}

function ceasnFrameworkToCass() {

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

            if (graphObj["@type"] == "ceasn:CompetencyFramework") {
                frameworkObj = graphObj;
            } else if (graphObj["@type"] == "ceasn:Competency") { //&& graphObj["asn:statementLabel"] != undefined && (graphObj["asn:statementLabel"] == "Competency" || graphObj["asn:statementLabel"]["@value"] == "Competency")){
                competencyList.push(graphObj);
            }
        }

        if (frameworkObj == undefined && competencyList.length != Object.keys(graph).length) {
            return importJsonLdGraph.call(this, graph, jsonLd["@context"]);
        } else {
            return importCeFrameworkToCass.call(this, frameworkObj, competencyList)
        }
    } else {
        error("no @graph created, unsure how to parse");
    }
}

function ceasnEndpoint() {
    if (this.params.methodType == "GET")
        return cassFrameworkAsCeasn.call(this);
    else if (this.params.methodType == "POST" || this.params.methodType == "PUT")
        error("Not Yet Implemented.", "405");
    else if (this.params.methodType == "DELETE")
        error("Not Yet Implemented.", "405");
    else
        error("Not Yet Implemented.", "405");
    return "Not Yet Implemented";
}

bindWebService("/ceasn", ceasnEndpoint);
