var asnContext = {
    "asn": "http://purl.org/asn/schema/core/",
    "asnPublicationStatus": "http://purl.org/asn/scheme/ASNPublicationStatus/",
    "asnscheme": "http://purl.org/asn/scheme/",
    "ceasn": "https://purl.org/ctdlasn/terms/",
    "ceterms": "https://purl.org/ctdl/terms/",
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

var ceasnExportUriPrefix = null;
var ceasnExportUriPrefixGraph = null;

function ceasnExportUriTransform(uri, frameworkUri) {
    if (ceasnExportUriPrefix == null)
        return uri;
    if (uri.startsWith(ceasnExportUriPrefix))
        return uri;
    var uuid = null;
    var parts = EcRemoteLinkedData.trimVersionFromUrl(uri).split("/");
    uuid = parts[parts.length - 1];
    if (frameworkUri != null && frameworkUri !== undefined) {
        uri = EcRemoteLinkedData.trimVersionFromUrl(frameworkUri) + EcRemoteLinkedData.trimVersionFromUrl(uri);
    }
    else
        uri = EcRemoteLinkedData.trimVersionFromUrl(uri);
    if (!uuid.matches("^(ce-)?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"))
        uuid = new UUID(3, "nil", uri).format();
    return ceasnExportUriPrefix + uuid;
}

function cassFrameworkAsCeasn() {
    EcRepository.cache = new Object();
    if (false && repoEndpoint().contains("localhost"))
        error("Endpoint Configuration is not set.", 500);
    var query = queryParse.call(this);
    var framework = null;
    if (framework == null)
        framework = skyrepoGet.call(this, query);
    if (framework != null && framework["@type"] != null && framework["@type"].contains("oncept")) {
        return cassConceptSchemeAsCeasn(framework);
    }
    if (framework == null || framework["@type"] == null || !framework["@type"].contains("ramework"))
        framework = null;
    if (framework == null && urlDecode(this.params.id) != null)
        framework = EcFramework.getBlocking(urlDecode(this.params.id));
    var competency = null;
    if (framework == null) {
        competency = skyrepoGet.call(this, query);
        if (competency == null && urlDecode(this.params.id) != null)
            competency = EcCompetency.getBlocking(urlDecode(this.params.id));
        else if (competency != null) {
            var c = new EcCompetency();
            c.copyFrom(competency);
            competency = c;
        }
        if (competency != null) {
            EcFramework.search(repo, "competency:\"" + c.shortId() + "\"", function (frameworks) {
                if (frameworks.length == 0) {
                    error("Individual competencies are not permitted to be represented in CEASN outside of a framework. See https://github.com/CredentialEngine/CompetencyFrameworks/issues/43 for more details.", 404);
                }
                framework = frameworks[0];
            }, function (error) {
                error("Framework search failed.");
            });
        }
    }
    if (framework == null)
        error("Object not found or you did not supply sufficient permissions to access the object.", 404);

    var f = new EcFramework();
    f.copyFrom(framework);
    if (f.competency == null) f.competency = [];
    if (f.relation == null) f.relation = [];

    var all = [];
    if (f.competency != null)
        all = all.concat(f.competency);
    if (f.relation != null)
        all = all.concat(f.relation);

    repo.precache(all, function (results) {
    });

    var allCompetencies = JSON.parse(JSON.stringify(f.competency));
    var competencies = {};

    for (var i = 0; i < f.competency.length; i++) {
        var c = EcCompetency.getBlocking(f.competency[i]);
        if (c != null) {
            competencies[f.competency[i]] = competencies[c.id] = c;
        }
    }

    for (var i = 0; i < f.relation.length; i++) {
        var r = EcAlignment.getBlocking(f.relation[i]);
        if (r == null) continue;
        if (r.source == null || r.target == null) continue;
        if (r.relationType == Relation.NARROWS) {
            if (allCompetencies.indexOf(r.target) == -1 || allCompetencies.indexOf(r.source) == -1) {
                if (r.target == f.id || r.target == f.shortId()) continue;

                if (competencies[r.source] != null)
                    if (competencies[r.source]["ceasn:broadAlignment"] == null)
                        competencies[r.source]["ceasn:broadAlignment"] = [];

                if (competencies[r.source] != null)
                    if (competencies[r.target] != null)
                        competencies[r.source]["ceasn:broadAlignment"].push(ceasnExportUriTransform(competencies[r.target].id, f.id));
                    else
                        competencies[r.source]["ceasn:broadAlignment"].push(ceasnExportUriTransform(r.target, f.id));

                if (competencies[r.target] != null)
                    if (competencies[r.target]["ceasn:narrowAlignment"] == null)
                        competencies[r.target]["ceasn:narrowAlignment"] = [];

                if (competencies[r.target] != null)
                    if (competencies[r.source] != null)
                        competencies[r.target]["ceasn:narrowAlignment"].push(ceasnExportUriTransform(competencies[r.source].id, f.id));
                    else
                        competencies[r.target]["ceasn:narrowAlignment"].push(ceasnExportUriTransform(r.source, f.id));
            }
            else {
                EcArray.setRemove(f.competency, r.target);

                if (r.target == f.id || r.target == f.shortId()) continue;

                if (competencies[r.source] != null)
                    if (competencies[r.source]["ceasn:isChildOf"] == null)
                        competencies[r.source]["ceasn:isChildOf"] = [];

                if (competencies[r.source] != null)
                    if (competencies[r.target] != null)
                        competencies[r.source]["ceasn:isChildOf"].push(ceasnExportUriTransform(competencies[r.target].id, f.id));
                    else
                        competencies[r.source]["ceasn:isChildOf"].push(ceasnExportUriTransform(r.target, f.id));

                if (competencies[r.target] != null)
                    if (competencies[r.target]["ceasn:hasChild"] == null)
                        competencies[r.target]["ceasn:hasChild"] = {"@list": []};

                if (competencies[r.target] != null)
                    if (competencies[r.source] != null)
                        competencies[r.target]["ceasn:hasChild"]["@list"].push(ceasnExportUriTransform(competencies[r.source].id, f.id));
                    else
                        competencies[r.target]["ceasn:hasChild"]["@list"].push(ceasnExportUriTransform(r.source, f.id));
            }
        }
        if (r.relationType == Relation.IS_EQUIVALENT_TO) {
            if (competencies[r.target] != null)
                if (competencies[r.target]["ceasn:exactAlignment"] == null)
                    competencies[r.target]["ceasn:exactAlignment"] = [];

            if (competencies[r.source] != null)
                if (competencies[r.source]["ceasn:exactAlignment"] == null)
                    competencies[r.source]["ceasn:exactAlignment"] = [];

            if (competencies[r.target] != null)
                if (competencies[r.source] != null)
                    competencies[r.target]["ceasn:exactAlignment"].push(ceasnExportUriTransform(competencies[r.source].id, f.id));
                else
                    competencies[r.target]["ceasn:exactAlignment"].push(ceasnExportUriTransform(r.source, f.id));

            if (competencies[r.source] != null)
                if (competencies[r.target] != null)
                    competencies[r.source]["ceasn:exactAlignment"].push(ceasnExportUriTransform(competencies[r.target].id, f.id));
                else
                    competencies[r.source]["ceasn:exactAlignment"].push(ceasnExportUriTransform(r.target, f.id));
        }
        if (r.relationType == Relation.IS_RELATED_TO) {
            EcArray.setRemove(f.competency, r.source);
            if (competencies[r.target] != null)
                if (competencies[r.target]["ceasn:minorAlignment"] == null)
                    competencies[r.target]["ceasn:minorAlignment"] = [];

            if (competencies[r.source] != null)
                if (competencies[r.source]["ceasn:minorAlignment"] == null)
                    competencies[r.source]["ceasn:minorAlignment"] = [];

            if (competencies[r.target] != null)
                if (competencies[r.source] != null)
                    competencies[r.target]["ceasn:minorAlignment"].push(ceasnExportUriTransform(competencies[r.source].id, f.id));
                else
                    competencies[r.target]["ceasn:minorAlignment"].push(ceasnExportUriTransform(r.source, f.id));

            if (competencies[r.source] != null)
                if (competencies[r.target] != null)
                    competencies[r.source]["ceasn:minorAlignment"].push(ceasnExportUriTransform(competencies[r.target].id, f.id));
                else
                    competencies[r.source]["ceasn:minorAlignment"].push(ceasnExportUriTransform(r.target, f.id));
        }
        if (r.relationType == Relation.REQUIRES) {
            EcArray.setRemove(f.competency, r.source);
            if (competencies[r.target] != null)
                if (competencies[r.target]["ceasn:prerequisiteAlignment"] == null)
                    competencies[r.target]["ceasn:prerequisiteAlignment"] = [];

            if (competencies[r.target] != null)
                if (competencies[r.source] != null)
                    competencies[r.target]["ceasn:prerequisiteAlignment"].push(ceasnExportUriTransform(competencies[r.source].id, f.id));
                else
                    competencies[r.target]["ceasn:prerequisiteAlignment"].push(ceasnExportUriTransform(r.source, f.id));
        }
    }

    var ctx = JSON.stringify(httpGet("https://credreg.net/ctdlasn/schema/context/json")["@context"]);
    f.competency = [];
    for (var i = 0; i < allCompetencies.length; i++) {
        var c = competencies[allCompetencies[i]];
        if (c == null) continue;
        if (c["ceasn:hasChild"] != null && c["ceasn:hasChild"]["@list"] != null)
        c["ceasn:hasChild"]["@list"].sort(function (a, b) {
            return allCompetencies.indexOf(a) - allCompetencies.indexOf(b);
        });
        delete competencies[allCompetencies[i]];
        var id = c.id;
        c.context = "https://schema.cassproject.org/0.4/cass2ceasn";
        console.log(f.id);
        c["ceasn:isPartOf"] = ceasnExportUriTransform(f.id);
        console.log(c["ceasn:isPartOf"]);
        if (c["ceasn:isChildOf"] == null) {
            c["ceasn:isTopChildOf"] = ceasnExportUriTransform(f.id);
            if (f["ceasn:hasTopChild"] == null)
                f["ceasn:hasTopChild"] = {"@list": []};
            f["ceasn:hasTopChild"]["@list"].push(ceasnExportUriTransform(c.id, f.id));
        }
        f.competency.push(ceasnExportUriTransform(c.id, f.id));
        if (c.name == null || c.name == "")
            if (c.description != null && c.description != "") {
                c.name = c.description;
                delete c.description;
            }
        if (c.type == null) //Already done / referred to by another name.
            continue;
        var guid = c.getGuid();
        var uuid = new UUID(3, "nil", c.shortId()).format();

        competencies[allCompetencies[i]] = competencies[id] = jsonLdCompact(c.toJson(), ctx);

        if (competencies[id]["ceterms:ctid"] == null) {
            if (guid.matches("^(ce-)?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"))
                competencies[id]["ceterms:ctid"] = guid;
            else
                competencies[id]["ceterms:ctid"] = uuid;
        }
        if (competencies[id]["ceterms:ctid"].indexOf("ce-") != 0)
            competencies[id]["ceterms:ctid"] = "ce-" + competencies[id]["ceterms:ctid"];
        if (competencies[id]["ceasn:name"] != null) {
            competencies[id]["ceasn:competencyText"] = competencies[id]["ceasn:name"];
            delete competencies[id]["ceasn:name"];
        }
        if (competencies[id]["ceasn:description"] != null) {
            competencies[id]["ceasn:comment"] = competencies[id]["ceasn:description"];
            delete competencies[id]["ceasn:description"];
        }
        if (competencies[id]["ceasn:inLanguage"] == null)
            competencies[id]["ceasn:inLanguage"] = "en";
        delete competencies[id]["@context"];
        competencies[id] = stripNonCe(competencies[id]);
    }

    f.context = "https://schema.cassproject.org/0.4/cass2ceasn";
    delete f.relation;

    if (f.description == null)
        f.description = f.name;
    framework = f;
    delete f.competency;
    var guid = f.getGuid();
    var uuid = new UUID(3, "nil", f.shortId()).format();
    f = jsonLdCompact(f.toJson(), ctx);
    if (f["ceasn:inLanguage"] == null)
        f["ceasn:inLanguage"] = "en";
    if (f["ceterms:ctid"] == null) {
        if (guid.matches("^(ce-)?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"))
            f["ceterms:ctid"] = guid;
        else
            f["ceterms:ctid"] = uuid;
    }
    if (f["ceterms:ctid"].indexOf("ce-") != 0)
        f["ceterms:ctid"] = "ce-" + f["ceterms:ctid"];

    if (f["@id"] != ceasnExportUriTransform(f["@id"])) {
        if (f["ceasn:source"] != null)
            if (EcArray.isArray(f["ceasn:source"])) {
                f["ceasn:source"].push(f["@id"]);
            }
            else {
                f["ceasn:source"] = [f["ceasn:source"], f["@id"]];
            }
        else
            f["ceasn:source"] = f["@id"];
    }
    f["@id"] = ceasnExportUriTransform(f["@id"]);

    var results = [];
    f = stripNonCe(f);
    results.push(f);
    for (var k in competencies) {
        var c = competencies[k];
        var found = false;
        for (var j = 0; j < results.length; j++)
            if (results[j]["@id"] == competencies[k]["@id"]) {
                found = true;
                break;
            }
        if (found) continue;
        if (c["@id"] != ceasnExportUriTransform(c["@id"])) {
            if (c["ceasn:exactAlignment"] != null)
                if (EcArray.isArray(c["ceasn:exactAlignment"])) {
                    c["ceasn:exactAlignment"].push(c["@id"]);
                }
                else {
                    c["ceasn:exactAlignment"] = [c["ceasn:exactAlignment"], c["@id"]];
                }
            else
                c["ceasn:exactAlignment"] = [c["@id"]];
        }
        competencies[k]["@id"] = ceasnExportUriTransform(competencies[k]["@id"], f["@id"]);
        results.push(competencies[k]);
        if (competency != null)
            if (competency.id == competencies[k]["@id"]||ceasnExportUriTransform(competency.id, f["@id"]) == competencies[k]["@id"])
                return JSON.stringify(competencies[k], null, 2);
    }
    delete f["@context"];
    var r = {};
    r["@context"] = "https://credreg.net/ctdlasn/schema/context/json";
    if (ceasnExportUriPrefixGraph != null)
        if (guid.matches("^(ce-)?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"))
            r["@id"] = ceasnExportUriPrefixGraph + guid;
        else
            r["@id"] = ceasnExportUriPrefixGraph + uuid;
    r["@graph"] = results;
    return JSON.stringify(r, null, 2);
}

function stripNonCe(f) {
    for (var k in f) {
        if (EcObject.isObject(f[k]) == false)
            if (k.indexOf("@") != 0)
                if (k.indexOf("ceterms:ctid") != 0)
                    if (k.indexOf("ceasn:description") != 0)
                        if (k.indexOf("ceasn:name") != 0)
                            if (k.indexOf("ceasn:weight") != 0)
                                if (k.indexOf("ceasn:derivedFrom") != 0)
                                    if (k.indexOf("ceasn:isTopChildOf") != 0)
                                        if (k.indexOf("ceasn:isPartOf") != 0)
                                            if (k.indexOf("ceasn:conceptKeywords") != 0)
                                                if (k.indexOf("ceasn:listID") != 0)
                                                    if (k.indexOf("ceasn:isVersionOf") != 0)
                                                        if (k.indexOf("ceasn:dateCopyrighted") != 0)
                                                            if (k.indexOf("ceasn:repositoryDate") != 0)
                                                                if (k.indexOf("ceasn:dateCreated") != 0)
                                                                    if (k.indexOf("ceasn:dateModified") != 0)
                                                                        if (k.indexOf("ceasn:dateValidFrom") != 0)
                                                                            if (k.indexOf("ceasn:dateValidUntil") != 0)
                                                                                if (k.indexOf("ceasn:rights") != 0)
                                                                                    if (k.indexOf("ceasn:license") != 0)
                                                                                        if (k.indexOf("ceasn:rightsHolder") != 0)
                                                                                            if (k.indexOf("ceasn:publicationStatusType") != 0)
                                                                                                if (k.indexOf("ceasn:codedNotation") != 0)
                                                                                                    if (k.indexOf("ceasn:competencyText") != 0)
                                                                                                        if (EcArray.isArray(f[k]) == false)
                                                                                                            f[k] = [f[k]];
        //For properties that allow many per language, force it into an array with even just 1 value.
        if (k === "ceasn:publisherName" || k === "ceasn:conceptKeyword" || k === "ceasn:comment") {
            Object.keys(f[k]).forEach(function (key) {
                if (EcArray.isArray(f[k][key]) == false)
                    f[k][key] = [f[k][key]];
            });
        }
        if (k.indexOf("ceasn:") == 0 || k.indexOf("ceterms:") == 0 || k.indexOf("@") == 0)
            ;
        else
            delete f[k];
    }
    return orderFields(f);
}

function orderFields(object) {
    var ordered = {};
    Object.keys(object).sort().forEach(function (key) {
        ordered[key] = object[key];
        delete object[key];
    });
    Object.keys(ordered).forEach(function (key) {
        object[key] = ordered[key];
    });
    return object;
}

function conceptArrays(object) {
    for (var k in object) {
        if (EcObject.isObject(object[k]) == false)
            if (k.indexOf("@") != 0)
                if (k.indexOf("ceterms:ctid") != 0)
                    if (k.indexOf("ceasn:description") != 0)
                        if (k.indexOf("ceasn:name") != 0)
                            if (k.indexOf("ceasn:dateCopyrighted") != 0)
                                if (k.indexOf("ceasn:dateCreated") != 0)
                                    if (k.indexOf("ceasn:dateModified") != 0)
                                        if (k.indexOf("ceasn:license") != 0)
                                            if (k.indexOf("ceasn:publicationStatusType") != 0)
                                                if (k.indexOf("ceasn:publisher") != 0)
                                                    if (k.indexOf("ceasn:publisherName") != 0)
                                                        if (k.indexOf("ceasn:rights") != 0)
                                                            if (k.indexOf("ceasn:source") != 0)
                                                                if (k.indexOf("skos:broader") != 0)
                                                                    if (k.indexOf("skos:definition") != 0)
                                                                        if (k.indexOf("skos:inScheme") != 0)
                                                                            if (k.indexOf("skos:notation") != 0)
                                                                                if (k.indexOf("skos:prefLabel") != 0)
                                                                                    if (k.indexOf("skos:topConceptOf") != 0)
                                                                                        if (EcArray.isArray(object[k]) == false)
                                                                                            object[k] = [object[k]];
        //For properties that allow many per language, force it into an array with even just 1 value.
        if (k === "skos:changeNote" || k === "ceasn:conceptKeyword" || k === "skos:note" || k === "skos:hiddenLabel" || k === "skos:altLabel") {
            Object.keys(object[k]).forEach(function (key) {
                if (EcArray.isArray(object[k][key]) == false)
                    object[k][key] = [object[k][key]];
            });
        }
    }
    return orderFields(object);
}

function cassConceptSchemeAsCeasn(framework) {
    if (framework == null)
        error("Concept Scheme not found.", 404);

    var cs = new EcConceptScheme();
    cs.copyFrom(framework);
    if (cs["skos:hasTopConcept"] == null) {
        cs["skos:hasTopConcept"] = [];
    }

    var concepts = {};
    var allConcepts = JSON.parse(JSON.stringify(cs["skos:hasTopConcept"]));

    for (var i = 0; i < cs["skos:hasTopConcept"].length; i++) {
        var c = EcConcept.getBlocking(cs["skos:hasTopConcept"][i]);
        if (c != null) {
            concepts[cs["skos:hasTopConcept"][i]] = concepts[c.id] = c;
            if (c["skos:narrower"]) {
                function getSubConcepts(c) {
                    for (var j = 0; j < c["skos:narrower"].length; j++) {
                        var subC = EcConcept.getBlocking(c["skos:narrower"][j]);
                        if (subC != null) {
                            concepts[subC.id] = subC;
                            allConcepts.push(subC.id);
                            if (subC["skos:narrower"]) {
                                getSubConcepts(subC);
                            }
                        }
                    }
                    
                }
                getSubConcepts(c);
            }
        }
    }

    var ctx = JSON.stringify(httpGet("https://credreg.net/ctdlasn/schema/context/json")["@context"]);
    
    for (var i = 0; i < allConcepts.length; i++) {
        var c = concepts[allConcepts[i]];
        delete concepts[allConcepts[i]];
        if (c != null && c.id != null) {
            var id = c.id;
            concepts[id] = c;
            delete concepts[id]["owner"];
            delete concepts[id]["signature"];

            c.context = "https://schema.cassproject.org/0.4/cass2ceasnConcepts";
            if (c.id != ceasnExportUriTransform(c.id)) {
                if (c["skos:exactMatch"] != null)
                    if (EcArray.isArray(c["skos:exactMatch"])) {
                        c["skos:exactMatch"].push(c.id);
                    }
                    else {
                        c["skos:exactMatch"] = [c["skos:exactMatch"], c.id];
                    }
                else
                    c["skos:exactMatch"] = [c.id];
            }
            c.id = ceasnExportUriTransform(c.id);
            c["skos:inScheme"] = ceasnExportUriTransform(cs.id);
            if (c["skos:topConceptOf"] != null) {
                c["skos:topConceptOf"] = ceasnExportUriTransform(cs.id);
            }
            if (c.type == null) //Already done / referred to by another name.
                continue;
            var guid = c.getGuid();
            var uuid = new UUID(3, "nil", c.shortId()).format();
            concepts[allConcepts[i]] = concepts[id] = jsonLdCompact(c.toJson(), ctx);

            if (concepts[id]["ceterms:ctid"] == null) {
                if (guid.matches("^(ce-)?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$")) {
                    concepts[id]["ceterms:ctid"] = guid;
                }
                else {
                    concepts[id]["ceterms:ctid"] = uuid;
                }
            }

            if (concepts[id]["ceterms:ctid"].indexOf("ce-") != 0) {
                concepts[id]["ceterms:ctid"] = "ce-" + concepts[id]["ceterms:ctid"];
            }
            if (concepts[id]["skos:inLanguage"] == null) {
                concepts[id]["skos:inLanguage"] = "en";
            }
            delete concepts[id]["@context"];

            concepts[id] = conceptArrays(concepts[id]);
        }
    }

    cs.context = "https://schema.cassproject.org/0.4/cass2ceasnConcepts";

    framework = cs;
    var guid = cs.getGuid();
    var uuid = new UUID(3, "nil", cs.shortId()).format();
    var csId = cs.id;
    delete cs["owner"];
    delete cs["signature"];
    cs = jsonLdCompact(cs.toJson(), ctx);
    if (cs["ceasn:inLanguage"] == null) {
        cs["ceasn:inLanguage"] = "en";
    }
    if (cs["ceterms:ctid"] == null) {
        if (guid.matches("^(ce-)?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$")) {
            cs["ceterms:ctid"] = guid;
        }
        else {
            cs["ceterms:ctid"] = uuid;
        }
    }
    if (cs["ceterms:ctid"].indexOf("ce-") != 0) {
        cs["ceterms:ctid"] = "ce-" + cs["ceterms:ctid"];
    }

    if (csId != ceasnExportUriTransform(csId)) {
        if (cs["ceasn:exactAlignment"] != null)
            if (EcArray.isArray(cs["ceasn:exactAlignment"])) {
                cs["ceasn:exactAlignment"].push(csId);
            }
            else {
                cs["ceasn:exactAlignment"] = [cs["ceasn:exactAlignment"], csId];
            }
        else
            cs["ceasn:exactAlignment"] = [csId];
    }
    cs["@id"] = ceasnExportUriTransform(csId);

    var results = [];

    cs = conceptArrays(cs);
    results.push(cs);
    for (var k in concepts) {
        var c = concepts[k];
        var found = false;
        for (var j = 0; j < results.length; j++) {
            if (results[j]["@id"] == concepts[k]["@id"]) {
                found = true;
                break;
            }
        }
        if (found) continue;
        concepts[k]["@id"] = ceasnExportUriTransform(concepts[k]["@id"]);
        results.push(concepts[k]);
    }
        
    delete cs["@context"];
    var r = {};
    r["@context"] = "https://credreg.net/ctdlasn/schema/context/json";
    if (ceasnExportUriPrefixGraph != null)
        if (guid.matches("^(ce-)?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"))
            r["@id"] = ceasnExportUriPrefixGraph + guid;
        else
            r["@id"] = ceasnExportUriPrefixGraph + uuid;
    r["@graph"] = results;

    return JSON.stringify(r, null, 2);
}

function importCeFrameworkToCass(frameworkObj, competencyList) {

    var owner = fileToString.call(this,(fileFromDatastream).call(this,"owner"));

    var ceasnIdentity = new EcIdentity();
    ceasnIdentity.ppk = EcPpk.fromPem(keyFor("adapter.ceasn.private"));
    ceasnIdentity.displayName = "CEASN Server Identity";
    EcIdentityManager.addIdentity(ceasnIdentity);

    EcRemote.async = false;
    if (false && repoEndpoint().contains("localhost"))
        error("Endpoint Configuration is not set.", 500);

    var cassCompetencies = [];
    var cassRelationships = [];
    var relationshipMap = {};
    var parentMap = {};

    if (frameworkObj != null) {
        var topChild = frameworkObj["ceasn:hasTopChild"] ? frameworkObj["ceasn:hasTopChild"] : frameworkObj["ceasn:hasChild"];
        if (topChild != null && topChild.length != null) {
            for (var i = 0; i < topChild.length; i++) {
                cassCompetencies.push(EcRemoteLinkedData.trimVersionFromUrl(topChild[i]));
            }
        }
    }

    var listToSave = [];

    for (var idx in competencyList) {
        var asnComp = competencyList[idx];

        var canonicalId = asnComp["@id"];

        var childComps = asnComp["ceasn:hasChild"];
        if (childComps != null && childComps.length != null) {
            for (var i = 0; i < childComps.length; i++) {
                var r = new EcAlignment();
                r.source = EcRemoteLinkedData.trimVersionFromUrl(childComps[i]);
                r.target = EcRemoteLinkedData.trimVersionFromUrl(canonicalId);
                r.relationType = Relation.NARROWS;
                r.generateId(repoEndpoint());
                r.addOwner(ceasnIdentity.ppk.toPk());

                if (owner != null)
                    r.addOwner(EcPk.fromPem(owner));

                if (relationshipMap[r.source + r.target] != true) {
                    relationshipMap[r.source + r.target] = true;
                    listToSave.push(r);
                    cassRelationships.push(r.shortId());
                    cassCompetencies.push(r.source);
                }
            }
        }

        var newComp = JSON.parse(JSON.stringify(asnComp));
        delete newComp["ceasn:hasChild"];

        newComp["@context"] = "https://schema.cassproject.org/0.4/ceasn2cass";
        var expandedComp = jsonLdExpand(JSON.stringify(newComp));
        var compactedComp = jsonLdCompact(JSON.stringify(expandedComp), "https://schema.cassproject.org/0.4");

        delete compactedComp["ceasn:isChildOf"];
        delete compactedComp["ceasn:hasChild"];
        delete compactedComp["ceasn:isPartOf"];

        var c = new EcCompetency();
        c.copyFrom(compactedComp);
        c.addOwner(ceasnIdentity.ppk.toPk());

        if (c["schema:inLanguage"] == null || c["schema:inLanguage"] === undefined) {
            if (frameworkObj != null && (frameworkObj["ceasn:inLanguage"] != null || frameworkObj["schema:inLanguage"] != null)) {
                c["schema:inLanguage"] = frameworkObj["ceasn:inLanguage"] ? frameworkObj["ceasn:inLanguage"] : frameworkObj["schema:inLanguage"];
            }
            else {
                c["schema:inLanguage"] = "en";
            }
        }


        if (c["schema:dateCreated"] == null || c["schema:dateCreated"] === undefined) {
            var timestamp;
            var date;
            if (!c.id.substring(c.id.lastIndexOf("/")).matches("\\/[0-9]+")) {
                timestamp = null;
            }
            else {
                timestamp = c.id.substring(c.id.lastIndexOf("/")+1);
            }
            if (timestamp != null) {
                date = new Date(parseInt(timestamp)).toISOString();
            }
            else {
                date = new Date().toISOString();
            }
            c["schema:dateCreated"] = date;
        }

        if (owner != null)
            c.addOwner(EcPk.fromPem(owner));

        listToSave.push(c);

    } // end for each competency in  competencyList

    if (frameworkObj != null) {
        var guid = stringToHex(md5(EcRemoteLinkedData.trimVersionFromUrl(frameworkObj["@id"])));

        frameworkObj["@context"] = "https://schema.cassproject.org/0.4/ceasn2cass";
        var expanded = jsonLdExpand(JSON.stringify(frameworkObj));
        var compacted = jsonLdCompact(JSON.stringify(expanded), "https://schema.cassproject.org/0.4");

        delete compacted["ceasn:hasChild"];
        delete compacted["ceasn:hasTopChild"];

        compacted["competency"] = cassCompetencies;
        compacted["relation"] = cassRelationships;
        //delete compacted["@context"];
        //delete compacted["@type"];

        var f = new EcFramework();
        f.copyFrom(compacted);
        f.addOwner(ceasnIdentity.ppk.toPk());

        if (owner != null)
            f.addOwner(EcPk.fromPem(owner));

        if (f["schema:inLanguage"] == null || f["schema:inLanguage"] === undefined) {
            f["schema:inLanguage"] = "en";
        }

        if (f["schema:dateCreated"] == null || f["schema:dateCreated"] === undefined) {
            var timestamp;
            var date;
            if (!f.id.substring(f.id.lastIndexOf("/")).matches("\\/[0-9]+")) {
                timestamp = null;
            }
            else {
                timestamp = f.id.substring(f.id.lastIndexOf("/")+1);
            }
            if (timestamp != null) {
                date = new Date(parseInt(timestamp)).toISOString();
            }
            else {
                date = new Date().toISOString();
            }
            f["schema:dateCreated"] = date;
        }

        listToSave.push(f);

        repo.multiput(listToSave,console.log,console.error);
        return repoEndpoint() + "data/" + guid;
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
    if (text[0] != "{") {
        text = text.slice(1);
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
                graphObj["@context"] = jsonLd["@context"];
                frameworkObj = graphObj;
            } else if (graphObj["@type"] == "ceasn:Competency") { //&& graphObj["asn:statementLabel"] != undefined && (graphObj["asn:statementLabel"] == "Competency" || graphObj["asn:statementLabel"]["@value"] == "Competency")){
                graphObj["@context"] = jsonLd["@context"];
                competencyList.push(graphObj);
            }
        }

        if (frameworkObj == undefined && competencyList.length != Object.keys(graph).length) {
            return importJsonLdGraph.call(this, graph, jsonLd["@context"]);
        } else {
            return importCeFrameworkToCass.call(this, frameworkObj, competencyList);
        }
    } else {
        error("no @graph created, unsure how to parse");
    }
}

function ceasnEndpoint() {
    if (this.params.methodType == "GET")
        return cassFrameworkAsCeasn.call(this);
    else if (this.params.methodType == "POST" || this.params.methodType == "PUT")
        return ceasnFrameworkToCass.call(this);
    else if (this.params.methodType == "DELETE")
        error("Not Yet Implemented.", "405");
    else
        error("Not Yet Implemented.", "405");
    return "Not Yet Implemented";
}

bindWebService("/ceasn", ceasnEndpoint);
bindWebService("/ctdlasn", ceasnEndpoint);

/*!
**  Pure-UUID -- Pure JavaScript Based Universally Unique Identifier (UUID)
**  Copyright (c) 2004-2018 Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*  Universal Module Definition (UMD)  */
(function (root, name, factory) {
    /* global define: false */
    /* global module: false */
    if (typeof define === "function" && typeof define.amd !== "undefined")
    /*  AMD environment  */
        define(function () {
            return factory(root);
        });
    else if (typeof module === "object" && typeof module.exports === "object") {
        /*  CommonJS environment  */
        module.exports = factory(root);
        module.exports["default"] = module.exports;
    }
    else
    /*  Browser environment  */
        root[name] = factory(root);
}(this, "UUID", function (/* root */) {

    /*  array to hex-string conversion  */
    var a2hs = function (bytes, begin, end, uppercase, str, pos) {
        var mkNum = function (num, uppercase) {
            var base16 = num.toString(16);
            if (base16.length < 2)
                base16 = "0" + base16;
            if (uppercase)
                base16 = base16.toUpperCase();
            return base16;
        };
        for (var i = begin; i <= end; i++)
            str[pos++] = mkNum(bytes[i], uppercase);
        return str;
    };

    /*  hex-string to array conversion  */
    var hs2a = function (str, begin, end, bytes, pos) {
        for (var i = begin; i <= end; i += 2)
            bytes[pos++] = parseInt(str.substr(i, 2), 16);
    };

    /*  This library provides Z85: ZeroMQ's Base-85 encoding/decoding
        (see http://rfc.zeromq.org/spec:32 for details)  */

    var z85_encoder = (
        "0123456789" +
        "abcdefghijklmnopqrstuvwxyz" +
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
        ".-:+=^!/*?&<>()[]{}@%$#"
    ).split("");
    var z85_decoder = [
        0x00, 0x44, 0x00, 0x54, 0x53, 0x52, 0x48, 0x00,
        0x4B, 0x4C, 0x46, 0x41, 0x00, 0x3F, 0x3E, 0x45,
        0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
        0x08, 0x09, 0x40, 0x00, 0x49, 0x42, 0x4A, 0x47,
        0x51, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2A,
        0x2B, 0x2C, 0x2D, 0x2E, 0x2F, 0x30, 0x31, 0x32,
        0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A,
        0x3B, 0x3C, 0x3D, 0x4D, 0x00, 0x4E, 0x43, 0x00,
        0x00, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10,
        0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18,
        0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E, 0x1F, 0x20,
        0x21, 0x22, 0x23, 0x4F, 0x00, 0x50, 0x00, 0x00
    ];
    var z85_encode = function (data, size) {
        if ((size % 4) !== 0)
            throw new Error("z85_encode: invalid input length (multiple of 4 expected)");
        var str = "", i = 0, value = 0;
        while (i < size) {
            value = (value * 256) + data[i++];
            if ((i % 4) === 0) {
                var divisor = 85 * 85 * 85 * 85;
                while (divisor >= 1) {
                    var idx = Math.floor(value / divisor) % 85;
                    str += z85_encoder[idx];
                    divisor /= 85;
                }
                value = 0;
            }
        }
        return str;
    };
    var z85_decode = function (str, dest) {
        var l = str.length;
        if ((l % 5) !== 0)
            throw new Error("z85_decode: invalid input length (multiple of 5 expected)");
        if (typeof dest === "undefined")
            dest = new Array(l * 4 / 5);
        var i = 0, j = 0, value = 0;
        while (i < l) {
            var idx = str.charCodeAt(i++) - 32;
            if (idx < 0 || idx >= z85_decoder.length)
                break;
            value = (value * 85) + z85_decoder[idx];
            if ((i % 5) === 0) {
                var divisor = 256 * 256 * 256;
                while (divisor >= 1) {
                    dest[j++] = Math.trunc((value / divisor) % 256);
                    divisor /= 256;
                }
                value = 0;
            }
        }
        return dest;
    };

    /*  This library provides conversions between 8/16/32-bit character
        strings and 8/16/32-bit big/little-endian word arrays.  */

    /*  string to array conversion  */
    var s2a = function (s, _options) {
        /*  determine options  */
        var options = {ibits: 8, obits: 8, obigendian: true};
        for (var opt in _options)
            if (typeof options[opt] !== "undefined")
                options[opt] = _options[opt];

        /*  convert string to array  */
        var a = [];
        var i = 0;
        var c, C;
        var ck = 0;
        var w;
        var wk = 0;
        var sl = s.length;
        for (; ;) {
            /*  fetch next octet from string  */
            if (ck === 0)
                C = s.charCodeAt(i++);
            c = (C >> (options.ibits - (ck + 8))) & 0xFF;
            ck = (ck + 8) % options.ibits;

            /*  place next word into array  */
            if (options.obigendian) {
                if (wk === 0) w = (c << (options.obits - 8));
                else w |= (c << ((options.obits - 8) - wk));
            }
            else {
                if (wk === 0) w = c;
                else w |= (c << wk);
            }
            wk = (wk + 8) % options.obits;
            if (wk === 0) {
                a.push(w);
                if (i >= sl)
                    break;
            }
        }
        return a;
    };

    /*  array to string conversion  */
    var a2s = function (a, _options) {
        /*  determine options  */
        var options = {ibits: 32, ibigendian: true};
        for (var opt in _options)
            if (typeof options[opt] !== "undefined")
                options[opt] = _options[opt];

        /* convert array to string */
        var s = "";
        var imask = 0xFFFFFFFF;
        if (options.ibits < 32)
            imask = (1 << options.ibits) - 1;
        var al = a.length;
        for (var i = 0; i < al; i++) {
            /* fetch next word from array */
            var w = a[i] & imask;

            /* place next octet into string */
            for (var j = 0; j < options.ibits; j += 8) {
                if (options.ibigendian)
                    s += String.fromCharCode((w >> ((options.ibits - 8) - j)) & 0xFF);
                else
                    s += String.fromCharCode((w >> j) & 0xFF);
            }
        }
        return s;
    };

    /*  this is just a really minimal UI64 functionality,
        just sufficient enough for the UUID v1 generator and PCG PRNG!  */

    /*  UI64 constants  */
    var UI64_DIGITS = 8;
    /* number of digits */
    var UI64_DIGIT_BITS = 8;
    /* number of bits in a digit */
    var UI64_DIGIT_BASE = 256;
    /* the numerical base of a digit */

    /*  convert between individual digits and the UI64 representation  */
    var ui64_d2i = function (d7, d6, d5, d4, d3, d2, d1, d0) {
        return [d0, d1, d2, d3, d4, d5, d6, d7];
    };

    /*  the zero represented as an UI64  */
    var ui64_zero = function () {
        return ui64_d2i(0, 0, 0, 0, 0, 0, 0, 0);
    };

    /*  clone the UI64  */
    var ui64_clone = function (x) {
        return x.slice(0);
    };

    /*  convert between number and UI64 representation  */
    var ui64_n2i = function (n) {
        var ui64 = ui64_zero();
        for (var i = 0; i < UI64_DIGITS; i++) {
            ui64[i] = Math.floor(n % UI64_DIGIT_BASE);
            n /= UI64_DIGIT_BASE;
        }
        return ui64;
    };

    /*  convert between UI64 representation and number  */
    var ui64_i2n = function (x) {
        var n = 0;
        for (var i = UI64_DIGITS - 1; i >= 0; i--) {
            n *= UI64_DIGIT_BASE;
            n += x[i];
        }
        return Math.floor(n);
    };

    /*  add UI64 (y) to UI64 (x) and return overflow/carry as number  */
    var ui64_add = function (x, y) {
        var carry = 0;
        for (var i = 0; i < UI64_DIGITS; i++) {
            carry += x[i] + y[i];
            x[i] = Math.floor(carry % UI64_DIGIT_BASE);
            carry = Math.floor(carry / UI64_DIGIT_BASE);
        }
        return carry;
    };

    /*  multiply number (n) to UI64 (x) and return overflow/carry as number  */
    var ui64_muln = function (x, n) {
        var carry = 0;
        for (var i = 0; i < UI64_DIGITS; i++) {
            carry += x[i] * n;
            x[i] = Math.floor(carry % UI64_DIGIT_BASE);
            carry = Math.floor(carry / UI64_DIGIT_BASE);
        }
        return carry;
    };

    /*  multiply UI64 (y) to UI64 (x) and return overflow/carry as UI64  */
    var ui64_mul = function (x, y) {
        var i, j;

        /*  clear temporary result buffer zx  */
        var zx = new Array(UI64_DIGITS + UI64_DIGITS);
        for (i = 0; i < (UI64_DIGITS + UI64_DIGITS); i++)
            zx[i] = 0;

        /*  perform multiplication operation  */
        var carry;
        for (i = 0; i < UI64_DIGITS; i++) {
            /*  calculate partial product and immediately add to zx  */
            carry = 0;
            for (j = 0; j < UI64_DIGITS; j++) {
                carry += (x[i] * y[j]) + zx[i + j];
                zx[i + j] = (carry % UI64_DIGIT_BASE);
                carry /= UI64_DIGIT_BASE;
            }

            /*  add carry to remaining digits in zx  */
            for (; j < UI64_DIGITS + UI64_DIGITS - i; j++) {
                carry += zx[i + j];
                zx[i + j] = (carry % UI64_DIGIT_BASE);
                carry /= UI64_DIGIT_BASE;
            }
        }

        /*  provide result by splitting zx into x and ov  */
        for (i = 0; i < UI64_DIGITS; i++)
            x[i] = zx[i];
        return zx.slice(UI64_DIGITS, UI64_DIGITS);
    };

    /*  AND operation: UI64 (x) &= UI64 (y)  */
    var ui64_and = function (x, y) {
        for (var i = 0; i < UI64_DIGITS; i++)
            x[i] &= y[i];
        return x;
    };

    /*  OR operation: UI64 (x) |= UI64 (y)  */
    var ui64_or = function (x, y) {
        for (var i = 0; i < UI64_DIGITS; i++)
            x[i] |= y[i];
        return x;
    };

    /*  rotate right UI64 (x) by a "s" bits and return overflow/carry as number  */
    var ui64_rorn = function (x, s) {
        var ov = ui64_zero();
        if ((s % UI64_DIGIT_BITS) !== 0)
            throw new Error("ui64_rorn: only bit rotations supported with a multiple of digit bits");
        var k = Math.floor(s / UI64_DIGIT_BITS);
        for (var i = 0; i < k; i++) {
            for (var j = UI64_DIGITS - 1 - 1; j >= 0; j--)
                ov[j + 1] = ov[j];
            ov[0] = x[0];
            for (j = 0; j < UI64_DIGITS - 1; j++)
                x[j] = x[j + 1];
            x[j] = 0;
        }
        return ui64_i2n(ov);
    };

    /*  rotate right UI64 (x) by a "s" bits and return overflow/carry as number  */
    var ui64_ror = function (x, s) {
        /*  sanity check shifting  */
        if (s > (UI64_DIGITS * UI64_DIGIT_BITS))
            throw new Error("ui64_ror: invalid number of bits to shift");

        /*  prepare temporary buffer zx  */
        var zx = new Array(UI64_DIGITS + UI64_DIGITS);
        var i;
        for (i = 0; i < UI64_DIGITS; i++) {
            zx[i + UI64_DIGITS] = x[i];
            zx[i] = 0;
        }

        /*  shift bits inside zx  */
        var k1 = Math.floor(s / UI64_DIGIT_BITS);
        var k2 = s % UI64_DIGIT_BITS;
        for (i = k1; i < UI64_DIGITS + UI64_DIGITS - 1; i++) {
            zx[i - k1] =
                ((zx[i] >>> k2) |
                    (zx[i + 1] << (UI64_DIGIT_BITS - k2))) &
                ((1 << UI64_DIGIT_BITS) - 1);
        }
        zx[UI64_DIGITS + UI64_DIGITS - 1 - k1] =
            (zx[UI64_DIGITS + UI64_DIGITS - 1] >>> k2) &
            ((1 << UI64_DIGIT_BITS) - 1);
        for (i = UI64_DIGITS + UI64_DIGITS - 1 - k1 + 1; i < UI64_DIGITS + UI64_DIGITS; i++)
            zx[i] = 0;

        /*  provide result by splitting zx into x and ov  */
        for (i = 0; i < UI64_DIGITS; i++)
            x[i] = zx[i + UI64_DIGITS];
        return zx.slice(0, UI64_DIGITS);
    };

    /*  rotate left UI64 (x) by a "s" bits and return overflow/carry as UI64  */
    var ui64_rol = function (x, s) {
        /*  sanity check shifting  */
        if (s > (UI64_DIGITS * UI64_DIGIT_BITS))
            throw new Error("ui64_rol: invalid number of bits to shift");

        /*  prepare temporary buffer zx  */
        var zx = new Array(UI64_DIGITS + UI64_DIGITS);
        var i;
        for (i = 0; i < UI64_DIGITS; i++) {
            zx[i + UI64_DIGITS] = 0;
            zx[i] = x[i];
        }

        /*  shift bits inside zx  */
        var k1 = Math.floor(s / UI64_DIGIT_BITS);
        var k2 = s % UI64_DIGIT_BITS;
        for (i = UI64_DIGITS - 1 - k1; i > 0; i--) {
            zx[i + k1] =
                ((zx[i] << k2) |
                    (zx[i - 1] >>> (UI64_DIGIT_BITS - k2))) &
                ((1 << UI64_DIGIT_BITS) - 1);
        }
        zx[0 + k1] = (zx[0] << k2) & ((1 << UI64_DIGIT_BITS) - 1);
        for (i = 0 + k1 - 1; i >= 0; i--)
            zx[i] = 0;

        /*  provide result by splitting zx into x and ov  */
        for (i = 0; i < UI64_DIGITS; i++)
            x[i] = zx[i];
        return zx.slice(UI64_DIGITS, UI64_DIGITS);
    };

    /*  XOR UI64 (y) onto UI64 (x) and return x  */
    var ui64_xor = function (x, y) {
        for (var i = 0; i < UI64_DIGITS; i++)
            x[i] ^= y[i];
        return;
    };

    /*  this is just a really minimal UI32 functionality,
        just sufficient enough for the MD5 and SHA1 digests!  */

    /*  safely add two integers (with wrapping at 2^32)  */
    var ui32_add = function (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    };

    /*  bitwise rotate 32-bit number to the left  */
    var ui32_rol = function (num, cnt) {
        return (
            ((num << cnt) & 0xFFFFFFFF)
            | ((num >>> (32 - cnt)) & 0xFFFFFFFF)
        );
    };

    /*  calculate the SHA-1 of an array of big-endian words, and a bit length  */
    var sha1_core = function (x, len) {
        /*  perform the appropriate triplet combination function for the current iteration  */
        function sha1_ft(t, b, c, d) {
            if (t < 20) return (b & c) | ((~b) & d);
            if (t < 40) return b ^ c ^ d;
            if (t < 60) return (b & c) | (b & d) | (c & d);
            return b ^ c ^ d;
        }

        /*  determine the appropriate additive constant for the current iteration  */
        function sha1_kt(t) {
            return (t < 20) ? 1518500249 :
                (t < 40) ? 1859775393 :
                    (t < 60) ? -1894007588 :
                        -899497514;
        }

        /*  append padding  */
        x[len >> 5] |= 0x80 << (24 - len % 32);
        x[((len + 64 >> 9) << 4) + 15] = len;

        var w = Array(80);
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;
        var e = -1009589776;

        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;
            var olde = e;
            for (var j = 0; j < 80; j++) {
                if (j < 16)
                    w[j] = x[i + j];
                else
                    w[j] = ui32_rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
                var t = ui32_add(
                    ui32_add(ui32_rol(a, 5), sha1_ft(j, b, c, d)),
                    ui32_add(ui32_add(e, w[j]), sha1_kt(j))
                );
                e = d;
                d = c;
                c = ui32_rol(b, 30);
                b = a;
                a = t;
            }
            a = ui32_add(a, olda);
            b = ui32_add(b, oldb);
            c = ui32_add(c, oldc);
            d = ui32_add(d, oldd);
            e = ui32_add(e, olde);
        }
        return [a, b, c, d, e];
    };

    /*  calculate the SHA-1 of an octet string  */
    var sha1 = function (s) {
        return a2s(
            sha1_core(
                s2a(s, {ibits: 8, obits: 32, obigendian: true}),
                s.length * 8),
            {ibits: 32, ibigendian: true});
    };

    /*  calculate the MD5 of an array of little-endian words, and a bit length  */
    var md5_core = function (x, len) {
        /*  basic operations the algorithm uses  */
        function md5_cmn(q, a, b, x, s, t) {
            return ui32_add(ui32_rol(ui32_add(ui32_add(a, q), ui32_add(x, t)), s), b);
        }

        function md5_ff(a, b, c, d, x, s, t) {
            return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
        }

        function md5_gg(a, b, c, d, x, s, t) {
            return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
        }

        function md5_hh(a, b, c, d, x, s, t) {
            return md5_cmn(b ^ c ^ d, a, b, x, s, t);
        }

        function md5_ii(a, b, c, d, x, s, t) {
            return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
        }

        /*  append padding  */
        x[len >> 5] |= 0x80 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;

        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;

            a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
            d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

            a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
            a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

            a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
            d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
            c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

            a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
            d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

            a = ui32_add(a, olda);
            b = ui32_add(b, oldb);
            c = ui32_add(c, oldc);
            d = ui32_add(d, oldd);
        }
        return [a, b, c, d];
    };

    /*  calculate the MD5 of an octet string  */
    var md5 = function (s) {
        return a2s(
            md5_core(
                s2a(s, {ibits: 8, obits: 32, obigendian: false}),
                s.length * 8),
            {ibits: 32, ibigendian: false});
    };

    /*  PCG Pseudo-Random-Number-Generator (PRNG)
        http://www.pcg-random.org/pdf/hmc-cs-2014-0905.pdf
        This is the PCG-XSH-RR variant ("xorshift high (bits), random rotation"),
        based on 32-bit output, 64-bit internal state and the formulas:
        state = state * MUL + INC
        output = rotate32((state ^ (state >> 18)) >> 27, state >> 59)  */

    var PCG = function (seed) {
        /*  pre-load some "magic" constants  */
        this.mul = ui64_d2i(0x58, 0x51, 0xf4, 0x2d, 0x4c, 0x95, 0x7f, 0x2d);
        this.inc = ui64_d2i(0x14, 0x05, 0x7b, 0x7e, 0xf7, 0x67, 0x81, 0x4f);
        this.mask = ui64_d2i(0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff);

        /*  generate an initial internal state  */
        this.state = ui64_clone(this.inc);
        this.next();
        ui64_and(this.state, this.mask);
        seed = ui64_n2i(seed !== undefined ?
            (seed >>> 0) : ((Math.random() * 0xffffffff) >>> 0));
        ui64_or(this.state, seed);
        this.next();
    };
    PCG.prototype.next = function () {
        /*  save current state  */
        var state = ui64_clone(this.state);

        /*  advance internal state  */
        ui64_mul(this.state, this.mul);
        ui64_add(this.state, this.inc);

        /*  calculate: (state ^ (state >> 18)) >> 27  */
        var output = ui64_clone(state);
        ui64_ror(output, 18);
        ui64_xor(output, state);
        ui64_ror(output, 27);

        /*  calculate: state >> 59  */
        var rot = ui64_clone(state);
        ui64_ror(rot, 59);

        /*  calculate: rotate32(xorshifted, rot)  */
        ui64_and(output, this.mask);
        var k = ui64_i2n(rot);
        var output2 = ui64_clone(output);
        ui64_rol(output2, 32 - k);
        ui64_ror(output, k);
        ui64_xor(output, output2);

        /*  return pseudo-random number  */
        return ui64_i2n(output);
    };
    var pcg = new PCG();

    /*  utility function: simple Pseudo Random Number Generator (PRNG)  */
    var prng = function (len, radix) {
        var bytes = [];
        for (var i = 0; i < len; i++)
            bytes[i] = (pcg.next() % radix);
        return bytes;
    };

    /*  internal state  */
    var time_last = 0;
    var time_seq = 0;

    /*  the API constructor  */
    var UUID = function () {
        if (arguments.length === 1 && typeof arguments[0] === "string")
            this.parse.apply(this, arguments);
        else if (arguments.length >= 1 && typeof arguments[0] === "number")
            this.make.apply(this, arguments);
        else if (arguments.length >= 1)
            throw new Error("UUID: constructor: invalid arguments");
        else
            for (var i = 0; i < 16; i++)
                this[i] = 0x00;
    };

    /*  inherit from a standard class which provides the
        best UUID representation in the particular environment  */
    /* global Uint8Array: false */
    /* global Buffer: false */
    if (typeof Uint8Array !== "undefined")
    /*  HTML5 TypedArray (browser environments: IE10, FF, CH, SF, OP)
        (http://caniuse.com/#feat=typedarrays)  */
        UUID.prototype = new Uint8Array(16);
    else if (Buffer)
    /*  Node Buffer (server environments: Node.js, IO.js)  */
        UUID.prototype = new Buffer(16);
    else
    /*  JavaScript (any environment)  */
        UUID.prototype = new Array(16);
    UUID.prototype.constructor = UUID;

    /*  API method: generate a particular UUID  */
    UUID.prototype.make = function (version) {
        var i;
        var uuid = this;
        if (version === 1) {
            /*  generate UUID version 1 (time and node based)  */

            /*  determine current time and time sequence counter  */
            var date = new Date();
            var time_now = date.getTime();
            if (time_now !== time_last)
                time_seq = 0;
            else
                time_seq++;
            time_last = time_now;

            /*  convert time to 100*nsec  */
            var t = ui64_n2i(time_now);
            ui64_muln(t, 1000 * 10);

            /*  adjust for offset between UUID and Unix Epoch time  */
            ui64_add(t, ui64_d2i(0x01, 0xB2, 0x1D, 0xD2, 0x13, 0x81, 0x40, 0x00));

            /*  compensate for low resolution system clock by adding
                the time/tick sequence counter  */
            if (time_seq > 0)
                ui64_add(t, ui64_n2i(time_seq));

            /*  store the 60 LSB of the time in the UUID  */
            var ov;
            ov = ui64_rorn(t, 8);
            uuid[3] = (ov & 0xFF);
            ov = ui64_rorn(t, 8);
            uuid[2] = (ov & 0xFF);
            ov = ui64_rorn(t, 8);
            uuid[1] = (ov & 0xFF);
            ov = ui64_rorn(t, 8);
            uuid[0] = (ov & 0xFF);
            ov = ui64_rorn(t, 8);
            uuid[5] = (ov & 0xFF);
            ov = ui64_rorn(t, 8);
            uuid[4] = (ov & 0xFF);
            ov = ui64_rorn(t, 8);
            uuid[7] = (ov & 0xFF);
            ov = ui64_rorn(t, 8);
            uuid[6] = (ov & 0x0F);

            /*  generate a random clock sequence  */
            var clock = prng(2, 255);
            uuid[8] = clock[0];
            uuid[9] = clock[1];

            /*  generate a random local multicast node address  */
            var node = prng(6, 255);
            node[0] |= 0x01;
            node[0] |= 0x02;
            for (i = 0; i < 6; i++)
                uuid[10 + i] = node[i];
        }
        else if (version === 4) {
            /*  generate UUID version 4 (random data based)  */
            var data = prng(16, 255);
            for (i = 0; i < 16; i++)
                this[i] = data[i];
        }
        else if (version === 3 || version === 5) {
            /*  generate UUID version 3/5 (MD5/SHA-1 based)  */
            var input = "";
            var nsUUID = (
                typeof arguments[1] === "object" && arguments[1] instanceof UUID ?
                    arguments[1] : new UUID().parse(arguments[1])
            );
            for (i = 0; i < 16; i++)
                input += String.fromCharCode(nsUUID[i]);
            input += arguments[2];
            var s = version === 3 ? md5(input) : sha1(input);
            for (i = 0; i < 16; i++)
                uuid[i] = s.charCodeAt(i);
        }
        else
            throw new Error("UUID: make: invalid version");

        /*  brand with particular UUID version  */
        uuid[6] &= 0x0F;
        uuid[6] |= (version << 4);

        /*  brand as UUID variant 2 (DCE 1.1)  */
        uuid[8] &= 0x3F;
        uuid[8] |= (0x02 << 6);

        return uuid;
    };

    /*  API method: format UUID into usual textual representation  */
    UUID.prototype.format = function (type) {
        var str, arr;
        if (type === "z85")
            str = z85_encode(this, 16);
        else if (type === "b16") {
            arr = Array(32);
            a2hs(this, 0, 15, true, arr, 0);
            str = arr.join("");
        }
        else if (type === undefined || type === "std") {
            arr = new Array(36);
            a2hs(this, 0, 3, false, arr, 0);
            arr[8] = "-";
            a2hs(this, 4, 5, false, arr, 9);
            arr[13] = "-";
            a2hs(this, 6, 7, false, arr, 14);
            arr[18] = "-";
            a2hs(this, 8, 9, false, arr, 19);
            arr[23] = "-";
            a2hs(this, 10, 15, false, arr, 24);
            str = arr.join("");
        }
        return str;
    };

    /*  API method: format UUID into usual textual representation  */
    UUID.prototype.toString = function (type) {
        return this.format(type);
    };

    /*  API method: parse UUID from usual textual representation  */
    UUID.prototype.parse = function (str, type) {
        if (typeof str !== "string")
            throw new Error("UUID: parse: invalid argument (type string expected)");
        if (type === "z85")
            z85_decode(str, this);
        else if (type === "b16")
            hs2a(str, 0, 35, this, 0);
        else if (type === undefined || type === "std") {
            var map = {
                "nil": "00000000-0000-0000-0000-000000000000",
                "ns:DNS": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
                "ns:URL": "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
                "ns:OID": "6ba7b812-9dad-11d1-80b4-00c04fd430c8",
                "ns:X500": "6ba7b814-9dad-11d1-80b4-00c04fd430c8"
            };
            if (map[str] !== undefined)
                str = map[str];
            else if (!str.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/))
                throw new Error("UUID: parse: invalid string representation " +
                    "(expected \"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\")");
            hs2a(str, 0, 7, this, 0);
            hs2a(str, 9, 12, this, 4);
            hs2a(str, 14, 17, this, 6);
            hs2a(str, 19, 22, this, 8);
            hs2a(str, 24, 35, this, 10);
        }
        return this;
    };

    /*  API method: export UUID into standard array of numbers  */
    UUID.prototype.export = function () {
        var arr = Array(16);
        for (var i = 0; i < 16; i++)
            arr[i] = this[i];
        return arr;
    };

    /*  API method: import UUID from standard array of numbers  */
    UUID.prototype.import = function (arr) {
        if (!(typeof arr === "object" && arr instanceof Array))
            throw new Error("UUID: import: invalid argument (type Array expected)");
        if (arr.length !== 16)
            throw new Error("UUID: import: invalid argument (Array of length 16 expected)");
        for (var i = 0; i < 16; i++) {
            if (typeof arr[i] !== "number")
                throw new Error("UUID: import: invalid array element #" + i +
                    " (type Number expected)");
            if (!(isFinite(arr[i]) && Math.floor(arr[i]) === arr[i]))
                throw new Error("UUID: import: invalid array element #" + i +
                    " (Number with integer value expected)");
            if (!(arr[i] >= 0 && arr[i] <= 255))
                throw new Error("UUID: import: invalid array element #" + i +
                    " (Number with integer value in range 0...255 expected)");
            this[i] = arr[i];
        }
        return this;
    };

    /*  API method: compare UUID against another one  */
    UUID.prototype.compare = function (other) {
        if (typeof other !== "object")
            throw new Error("UUID: compare: invalid argument (type UUID expected)");
        if (!(other instanceof UUID))
            throw new Error("UUID: compare: invalid argument (type UUID expected)");
        for (var i = 0; i < 16; i++) {
            if (this[i] < other[i])
                return -1;
            else if (this[i] > other[i])
                return +1;
        }
        return 0;
    };

    /*  API method: hash UUID by XOR-folding it k times  */
    UUID.prototype.fold = function (k) {
        if (typeof k === "undefined")
            throw new Error("UUID: fold: invalid argument (number of fold operations expected)");
        if (k < 1 || k > 4)
            throw new Error("UUID: fold: invalid argument (1-4 fold operations expected)");
        var n = 16 / Math.pow(2, k);
        var hash = new Array(n);
        for (var i = 0; i < n; i++) {
            var h = 0;
            for (var j = 0; i + j < 16; j += n)
                h ^= this[i + j];
            hash[i] = h;
        }
        return hash;
    };

    UUID.PCG = PCG;

    /*  export API  */
    return UUID;
}));

