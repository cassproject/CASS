let loopback = require('../../shims/cassproject.js');

const fsPromises = require('fs').promises;

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

let UUID = require('pure-uuid');

async function ceasnExportUriTransform(uri, frameworkUri) {
    if (ceasnExportUriPrefix == null)
        return uri;
    if (uri.startsWith(ceasnExportUriPrefix))
        return uri;
    try {
        var found = await EcRepository.get(uri, null, null, repo);
        if (!found) {
            return uri;
        }
    } catch(err) {
        debug(err);
        return uri;
    }
    var uuid = null;
    var parts = EcRemoteLinkedData.trimVersionFromUrl(uri).split("/");
    uuid = parts[parts.length - 1];
    if (frameworkUri != null && frameworkUri !== undefined) {
        uri = EcRemoteLinkedData.trimVersionFromUrl(frameworkUri) + EcRemoteLinkedData.trimVersionFromUrl(uri);
    } else
        uri = EcRemoteLinkedData.trimVersionFromUrl(uri);
    if (!uuid.matches("^(ce-)?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"))
        uuid = new UUID(3, "nil", uri).format();
    return ceasnExportUriPrefix + uuid;
}

async function competencyPromise(compId, competencies, allCompetencies, f, ctx, terms) {
    return new Promise(async (resolve) => {
        try {
            var c = competencies[compId];
            if (c == null) resolve();
            if (c["ceasn:hasChild"] != null && c["ceasn:hasChild"]["@list"] != null)
                c["ceasn:hasChild"]["@list"].sort(function (a, b) {
                    return allCompetencies.indexOf(a) - allCompetencies.indexOf(b);
                });
            delete competencies[compId];
            var id = c.id;
            c.context = "https://schema.cassproject.org/0.4/jsonld1.1/cass2ceasn.json";
            c["ceasn:isPartOf"] = await ceasnExportUriTransform(f.id);
            if (c["ceasn:isChildOf"] == null) {
                c["ceasn:isTopChildOf"] = await ceasnExportUriTransform(f.id);
                if (f["ceasn:hasTopChild"] == null)
                    f["ceasn:hasTopChild"] = {
                        "@list": []
                    };
                f["ceasn:hasTopChild"]["@list"].push(await ceasnExportUriTransform(c.id));
            }
            f.competency.push(await ceasnExportUriTransform(c.id));
            if (c.name == null || c.name == "")
                if (c.description != null && c.description != "") {
                    c.name = c.description;
                    delete c.description;
                }
            if (c.type == null) //Already done / referred to by another name.
                resolve();
            var guid = c.getGuid();
            var uuid = new UUID(3, "nil", c.shortId()).format();

            //If schema:identifier is not a URI, remove from translation
            if (c["schema:identifier"] != null && !EcArray.isArray(c["schema:identifier"]) && c["schema:identifier"].indexOf("http") == -1) {
                delete c["schema:identifier"];
            } else if (c["schema:identifier"] != null) {
                if (!EcArray.isArray(c["schema:identifier"])) {
                    c["schema:identifier"] = [c["schema:identifier"]];
                }
                for (var k = c["schema:identifier"].length - 1; k >= 0; k--) {
                    if (c["schema:identifier"][k].indexOf("http") == -1) {
                        c["schema:identifier"].splice(k, 1);
                    }
                }
            }

            //Remove fields that are only whitespace
            for (var key in c) {
                if (typeof c[key] == "string" && c[key].trim().length == 0) {
                    delete c[key];
                }
            }
            var socList = c["socList"];
            var naicsList = c["naicsList"];
            var cipList = c["cipList"];

            for (let each in c) {
                if (terms[each]) {
                    c[terms[each]] = c[each];
                    delete c[each];
                }
                if (each === "type") {
                    c[each] = "ceasn:Competency";
                }
            }

            c = await jsonLdCompact(c.toJson(), ctx);
            if (socList) {
                c["socList"] = socList;
            }
            if (naicsList) {
                c["naicsList"] = naicsList;
            }
            if (cipList) {
                c["cipList"] = cipList;
            }

            if (c["ceasn:inLanguage"] == null)
                c["ceasn:inLanguage"] = "en";

            competencies[compId] = competencies[id] = c;

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
            if (c["schema:educationalAlignment"] != null) { 
                if (!EcArray.isArray(c["schema:educationalAlignment"])) { 
                    competencies[id]["ceasn:educationLevelType"] = c["schema:educationalAlignment"]["schema:targetName"]; 
                } 
                else { 
                    competencies[id]["ceasn:educationLevelType"] = []; 
                    for (var j = 0; j < c["schema:educationalAlignment"].length; j++) { 
                        competencies[id]["ceasn:educationLevelType"].push(c["schema:educationalAlignment"][j]["schema:targetName"]); 
                    } 
                } 
            } 
            delete competencies[id]["@context"];
            competencies[id] = stripNonCe(competencies[id]);
            resolve();
        } catch(err) {
            console.log(err);
            resolve();
        }
    });
}

async function cassFrameworkAsCeasn() {
    EcRepository.cache = new Object();
    EcRepository.caching = true;
    if (false && repoEndpoint().contains("localhost"))
        error("Endpoint Configuration is not set.", 500);
    var query = queryParse.call(this);
    var framework = null;
    if (framework == null)
        framework = await skyrepoGet.call(this, query);
    if (framework != null && framework["@type"] != null && framework["@type"].contains("oncept")) {
        return await cassConceptSchemeAsCeasn(framework);
    }
    if (framework != null && framework.subType === "Collection") {
        return await cassFrameworkAsCeasnCollection(framework);
    }
    if (framework == null && this.params.id != null) {
        framework = await EcFramework.get(decodeURIComponent(this.params.id), null, null, repo);
    }
    if (framework == null && this.params.urlRemainder != null) {
        var id = repoEndpoint() + "data" + this.params.urlRemainder;
        framework = await EcFramework.get(id, null, null, repo);
    }
    if (framework == null || framework["@type"] == null || !framework["@type"].contains("ramework"))
        framework = null;
    var competency = null;
    if (framework == null) {
        competency = await skyrepoGet.call(this, query);
        if (competency == null && this.params.id != null)
            competency = await EcCompetency.get(decodeURIComponent(this.params.id), null, null, repo);
        else if (competency != null) {
            var c = new EcCompetency();
            c.copyFrom(competency);
            competency = c;
        }
        if (competency == null && this.params.urlRemainder != null) {
            var id = repoEndpoint() + "data" + this.params.urlRemainder;
            competency = await EcCompetency.get(id, null, null, repo);
        }
        if (competency != null) {
            let frameworks = [];
            try {
                frameworks = await EcFramework.search(repo, "competency:\"" + competency.shortId() + "\"");
            } catch(error) {
                error("Framework search failed.");
            }
            if (frameworks.length == 0) {
                error("Individual competencies are not permitted to be represented in CEASN outside of a framework. See https://github.com/CredentialEngine/CompetencyFrameworks/issues/43 for more details.", 404);
            }
            framework = frameworks[0];
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

    repo.precache(all, function (results) {});

    var allCompetencies = JSON.parse(JSON.stringify(f.competency));
    var competencies = {};

    for (var i = 0; i < f.competency.length; i++) {
        var c = await EcCompetency.get(f.competency[i], null, null, repo);
        if (c != null) {
            competencies[f.competency[i]] = competencies[c.id] = c;
        }
    }

    for (var i = 0; i < f.relation.length; i++) {
        var r = await EcAlignment.get(f.relation[i], null, null, repo);
        if (r == null) continue;
        if (r.source == null || r.target == null) continue;
        if (r.source == "" || r.target == "") continue;
        if (r.relationType == Relation.NARROWS) {
            if (allCompetencies.indexOf(r.target) == -1 || allCompetencies.indexOf(r.source) == -1) {
                if (r.target == f.id || r.target == f.shortId()) continue;

                if (competencies[r.source] != null)
                    if (competencies[r.source]["ceasn:broadAlignment"] == null)
                        competencies[r.source]["ceasn:broadAlignment"] = [];

                if (competencies[r.source] != null)
                    if (competencies[r.target] != null)
                        competencies[r.source]["ceasn:broadAlignment"].push(await ceasnExportUriTransform(competencies[r.target].id));
                    else
                        competencies[r.source]["ceasn:broadAlignment"].push(await ceasnExportUriTransform(r.target));

                if (competencies[r.target] != null)
                    if (competencies[r.target]["ceasn:narrowAlignment"] == null)
                        competencies[r.target]["ceasn:narrowAlignment"] = [];

                if (competencies[r.target] != null)
                    if (competencies[r.source] != null)
                        competencies[r.target]["ceasn:narrowAlignment"].push(await ceasnExportUriTransform(competencies[r.source].id));
                    else
                        competencies[r.target]["ceasn:narrowAlignment"].push(await ceasnExportUriTransform(r.source));
            } else {
                EcArray.setRemove(f.competency, r.target);

                if (r.target == f.id || r.target == f.shortId()) continue;

                if (competencies[r.source] != null)
                    if (competencies[r.source]["ceasn:isChildOf"] == null)
                        competencies[r.source]["ceasn:isChildOf"] = [];

                if (competencies[r.source] != null)
                    if (competencies[r.target] != null)
                        competencies[r.source]["ceasn:isChildOf"].push(await ceasnExportUriTransform(competencies[r.target].id));
                    else
                        competencies[r.source]["ceasn:isChildOf"].push(await ceasnExportUriTransform(r.target));

                if (competencies[r.target] != null)
                    if (competencies[r.target]["ceasn:hasChild"] == null)
                        competencies[r.target]["ceasn:hasChild"] = {
                            "@list": []
                        };

                if (competencies[r.target] != null)
                    if (competencies[r.source] != null)
                        competencies[r.target]["ceasn:hasChild"]["@list"].push(await ceasnExportUriTransform(competencies[r.source].id));
                    else
                        competencies[r.target]["ceasn:hasChild"]["@list"].push(await ceasnExportUriTransform(r.source));
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
                    competencies[r.target]["ceasn:exactAlignment"].push(await ceasnExportUriTransform(competencies[r.source].id));
                else
                    competencies[r.target]["ceasn:exactAlignment"].push(await ceasnExportUriTransform(r.source));

            if (competencies[r.source] != null)
                if (competencies[r.target] != null)
                    competencies[r.source]["ceasn:exactAlignment"].push(await ceasnExportUriTransform(competencies[r.target].id));
                else
                    competencies[r.source]["ceasn:exactAlignment"].push(await ceasnExportUriTransform(r.target));
        }
        if (r.relationType == "minorRelated") {
            EcArray.setRemove(f.competency, r.source);
            if (competencies[r.target] != null)
                if (competencies[r.target]["ceasn:minorAlignment"] == null)
                    competencies[r.target]["ceasn:minorAlignment"] = [];

            if (competencies[r.source] != null)
                if (competencies[r.source]["ceasn:minorAlignment"] == null)
                    competencies[r.source]["ceasn:minorAlignment"] = [];

            if (competencies[r.target] != null)
                if (competencies[r.source] != null)
                    competencies[r.target]["ceasn:minorAlignment"].push(await ceasnExportUriTransform(competencies[r.source].id));
                else
                    competencies[r.target]["ceasn:minorAlignment"].push(await ceasnExportUriTransform(r.source));

            if (competencies[r.source] != null)
                if (competencies[r.target] != null)
                    competencies[r.source]["ceasn:minorAlignment"].push(await ceasnExportUriTransform(competencies[r.target].id));
                else
                    competencies[r.source]["ceasn:minorAlignment"].push(await ceasnExportUriTransform(r.target));
        }
        if (r.relationType == "majorRelated") {
            EcArray.setRemove(f.competency, r.source);
            if (competencies[r.target] != null)
                if (competencies[r.target]["ceasn:majorAlignment"] == null)
                    competencies[r.target]["ceasn:majorAlignment"] = [];

            if (competencies[r.source] != null)
                if (competencies[r.source]["ceasn:majorAlignment"] == null)
                    competencies[r.source]["ceasn:majorAlignment"] = [];

            if (competencies[r.target] != null)
                if (competencies[r.source] != null)
                    competencies[r.target]["ceasn:majorAlignment"].push(await ceasnExportUriTransform(competencies[r.source].id));
                else
                    competencies[r.target]["ceasn:majorAlignment"].push(await ceasnExportUriTransform(r.source));

            if (competencies[r.source] != null)
                if (competencies[r.target] != null)
                    competencies[r.source]["ceasn:majorAlignment"].push(await ceasnExportUriTransform(competencies[r.target].id));
                else
                    competencies[r.source]["ceasn:majorAlignment"].push(await ceasnExportUriTransform(r.target));
        }
        if (r.relationType == Relation.REQUIRES) {
            EcArray.setRemove(f.competency, r.source);
            if (competencies[r.source] != null)
                if (competencies[r.source]["ceasn:prerequisiteAlignment"] == null)
                    competencies[r.source]["ceasn:prerequisiteAlignment"] = [];

            if (competencies[r.source] != null)
                if (competencies[r.target] != null)
                    competencies[r.source]["ceasn:prerequisiteAlignment"].push(await ceasnExportUriTransform(competencies[r.target].id));
                else
                    competencies[r.source]["ceasn:prerequisiteAlignment"].push(await ceasnExportUriTransform(r.target));
        }
    }

    var ctx = JSON.stringify((await httpGet("https://credreg.net/ctdlasn/schema/context/json"))["@context"],true);
    const terms = JSON.parse(JSON.stringify((await httpGet("https://schema.cassproject.org/0.4/jsonld1.1/cass2ceasnTerms")),true));
    f.competency = [];
    for (let i = 0; i < allCompetencies.length; i+=100) {
        await Promise.all(allCompetencies.slice(i, i+100).map((id) => competencyPromise(id, competencies, allCompetencies, f, ctx, terms)));
    }

    f.context = "https://schema.cassproject.org/0.4/jsonld1.1/cass2ceasn.json";
    delete f.relation;

    if (f.description == null)
        f.description = f.name;
    framework = f;
    delete f.competency;
    var guid = f.getGuid();
    var uuid = new UUID(3, "nil", f.shortId()).format();

    //If schema:publisher field is not a URI, put data in ceasn:publisherName field
    if (f["schema:publisher"] != null && !EcArray.isArray(f["schema:publisher"]) && f["schema:publisher"].indexOf("http") == -1) {
        if (!EcArray.isArray(f["ceasn:publisherName"])) {
            f["ceasn:publisherName"] = [];
        }
        f["ceasn:publisherName"].push(f["schema:publisher"]);
        delete f["schema:publisher"];
    } else if (f["schema:publisher"] != null && EcArray.isArray(f["schema:publisher"])) {
        for (var i = f["schema:publisher"].length - 1; i >= 0; i--) {
            if (f["schema:publisher"][i].indexOf("http") == -1) {
                if (!EcArray.isArray(f["ceasn:publisherName"])) {
                    f["ceasn:publisherName"] = [];
                }
                f["ceasn:publisherName"].push(f["schema:publisher"][i]);
                f["schema:publisher"].splice(i, 1);
            }
        }
    }

    //If schema:identifier is not a URI, remove from translation
    if (f["schema:identifier"] != null && !EcArray.isArray(f["schema:identifier"]) && f["schema:identifier"].indexOf("http") == -1) {
        delete f["schema:identifier"];
    } else if (f["schema:identifier"] != null) {
        if (!EcArray.isArray(f["schema:identifier"])) { 
            f["schema:identifier"] = [f["schema:identifier"]]; 
        }
        for (var i = f["schema:identifier"].length - 1; i >= 0; i--) {
            if (f["schema:identifier"][i].indexOf("http") == -1) {
                f["schema:identifier"].splice(i, 1);
            }
        }
    }

    //Remove fields that are only whitespace
    for (var key in f) {
        if (typeof f[key] == "string" && f[key].trim().length == 0) {
            delete f[key];
        }
    }
    delete f["ceterms:ownedBy"];
    var socList = f["socList"];
    var naicsList = f["naicsList"];
    var cipList = f["cipList"];

    for (let each in f) {
        if (terms[each]) {
            f[terms[each]] = f[each];
            delete f[each];
        }
        if (each === "type") {
            f[each] = "ceasn:CompetencyFramework";
        }
    }

    f = await jsonLdCompact(f.toJson(), ctx);
    if (socList) {
        f["socList"] = socList;
    }
    if (naicsList) {
        f["naicsList"] = naicsList;
    }
    if (cipList) {
        f["cipList"] = cipList;
    }
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

    if (f["@id"] != await ceasnExportUriTransform(f["@id"])) {
        if (f["ceasn:source"] != null)
            if (EcArray.isArray(f["ceasn:source"])) {
                f["ceasn:source"].push(f["@id"]);
            }
        else {
            f["ceasn:source"] = [f["ceasn:source"], f["@id"]];
        } else
            f["ceasn:source"] = f["@id"];
    }
    f["@id"] = await ceasnExportUriTransform(f["@id"]);

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
        if (c["@id"] != await ceasnExportUriTransform(c["@id"])) {
            if (c["ceasn:exactAlignment"] != null)
                if (EcArray.isArray(c["ceasn:exactAlignment"])) {
                    c["ceasn:exactAlignment"].push(c["@id"]);
                }
            else {
                c["ceasn:exactAlignment"] = [c["ceasn:exactAlignment"], c["@id"]];
            } else
                c["ceasn:exactAlignment"] = [c["@id"]];
        }
        competencies[k]["@id"] = await ceasnExportUriTransform(competencies[k]["@id"]);
        results.push(competencies[k]);
        if (competency != null)
            if (competency.id == competencies[k]["@id"] || await ceasnExportUriTransform(competency.id) == competencies[k]["@id"])
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
                                                                                                        if (k.indexOf("ceterms:subjectWebpage") != 0)
                                                                                                            if (EcArray.isArray(f[k]) == false)
                                                                                                                f[k] = [f[k]];
        //For properties that allow many per language, force it into an array with even just 1 value.
        if (k === "ceasn:publisherName" || k === "ceasn:conceptKeyword" || k === "ceasn:comment" || k === "ceterms:keyword") {
            Object.keys(f[k]).forEach(function (key) {
                if (EcArray.isArray(f[k][key]) == false)
                    f[k][key] = [f[k][key]];
            });
        }
        if (k.indexOf("ceasn:") == 0 || k.indexOf("ceterms:") == 0 || k.indexOf("asn:") == 0 || k.indexOf("@") == 0 || k.indexOf("socList") != -1 || k.indexOf("naicsList") != -1 || k.indexOf("cipList") != -1)
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

async function competencyInCollectionPromise(compId, competencies, allCompetencies, f, ctx, terms, cass2ceasn) {
    return new Promise(async (resolve) => {
        try {
            var c = competencies[compId];
            if (c == null) {
                resolve();
                return;
            }
            if (!f['ceterms:hasMember'] || !EcArray.isArray(f['ceterms:hasMember'])) {
                f['ceterms:hasMember'] = [];
            }

            f['ceterms:hasMember'].push(await ceasnExportUriTransform(c.shortId()));
            let frameworks = await EcFramework.search(repo, 'competency:"' + c.shortId() + '"');
            let collections = [];
            if (frameworks && frameworks.length > 0) {
                for (let each in frameworks) {
                    if (frameworks[each].subType !== "Collection") {
                        delete competencies[compId];
                        delete competencies[c.id];
                        resolve();
                        return;
                    } else {
                        collections.push(await ceasnExportUriTransform(frameworks[each].id));
                    }
                }
            }
            delete competencies[compId];
            var id = c.id;
            c.context = JSON.parse(cass2ceasn);
            c["ceterms:isMemberOf"] = collections;
            if (c.name == null || c.name == "")
                if (c.description != null && c.description != "") {
                    c.name = c.description;
                    delete c.description;
                }
            if (c.type == null) //Already done / referred to by another name.
                resolve();
            var guid = c.getGuid();
            var uuid = new UUID(3, "nil", c.shortId()).format();

            //Remove fields that are only whitespace
            for (var key in c) {
                if (typeof c[key] == "string" && c[key].trim().length == 0) {
                    delete c[key];
                }
            }
            var socList = c["socList"];
            var naicsList = c["naicsList"];
            var cipList = c["cipList"];

            for (let each in c) {
                if (terms[each]) {
                    c[terms[each]] = c[each];
                    delete c[each];
                }
                if (each === "type") {
                    c[each] = "ceasn:Competency";
                }
            }
            c = await jsonLdCompact(c.toJson(), ctx);
            if (socList) {
                c["socList"] = socList;
            }
            if (naicsList) {
                c["naicsList"] = naicsList;
            }
            if (cipList) {
                c["cipList"] = cipList;
            }

            competencies[compId] = competencies[id] = c;

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
            if (c["schema:educationalAlignment"] != null) { 
                if (!EcArray.isArray(c["schema:educationalAlignment"])) { 
                    competencies[id]["ceasn:educationLevelType"] = c["schema:educationalAlignment"]["schema:targetName"]; 
                } 
                else { 
                    competencies[id]["ceasn:educationLevelType"] = []; 
                    for (var j = 0; j < c["schema:educationalAlignment"].length; j++) { 
                        competencies[id]["ceasn:educationLevelType"].push(c["schema:educationalAlignment"][j]["schema:targetName"]); 
                    } 
                } 
            } 
            delete competencies[id]["@context"];
            competencies[id] = stripNonCe(competencies[id]);
            resolve();
        } catch(err) {
            console.log(err);
            resolve();
        }
    });
}

async function cassFrameworkAsCeasnCollection(framework) {
    EcRepository.cache = new Object();
    EcRepository.caching = true;

    const terms = JSON.parse(JSON.stringify((await httpGet("https://schema.cassproject.org/0.4/jsonld1.1/cass2ceasnTerms")),true));
    const collectionTerms = JSON.parse(JSON.stringify((await httpGet("https://schema.cassproject.org/0.4/jsonld1.1/cass2ceasncollectionTerms")),true));
    var ctx = JSON.stringify((await httpGet("https://credreg.net/ctdlasn/schema/context/json"))["@context"],true);
    const collectionContext = JSON.stringify((await httpGet("https://schema.cassproject.org/0.4/jsonld1.1/cass2ceasncollection.json"))["@context"],true);
    const cass2ceasn = JSON.stringify((await httpGet("https://schema.cassproject.org/0.4/jsonld1.1/cass2ceasn.json"))["@context"], true);
    const cetermsctx = JSON.stringify((await httpGet("https://credreg.net/ctdl/schema/context/json"))["@context"], true);

    var f = new EcFramework();
    f.copyFrom(framework);
    if (f.competency == null) f.competency = [];
    if (f.relation == null) f.relation = [];

    var all = [];
    if (f.competency != null)
        all = all.concat(f.competency);
    if (f.relation != null)
        all = all.concat(f.relation);

    repo.precache(all, function (results) {});

    var allCompetencies = JSON.parse(JSON.stringify(f.competency));
    var competencies = {};

    for (var i = 0; i < f.competency.length; i++) {
        var c = await EcCompetency.get(f.competency[i], null, null, repo);
        if (c != null) {
            competencies[f.competency[i]] = competencies[c.id] = c;
        }
    }

    for (var i = 0; i < f.relation.length; i++) {
        var r = await EcAlignment.get(f.relation[i], null, null, repo);
        if (r == null) continue;
        if (r.source == null || r.target == null) continue;
        if (r.source == "" || r.target == "") continue;
        if (r.relationType == Relation.NARROWS) {
            if (allCompetencies.indexOf(r.target) == -1 || allCompetencies.indexOf(r.source) == -1) {
                if (r.target == f.id || r.target == f.shortId()) continue;

                if (competencies[r.source] != null)
                    if (competencies[r.source]["ceasn:broadAlignment"] == null)
                        competencies[r.source]["ceasn:broadAlignment"] = [];

                if (competencies[r.source] != null)
                    if (competencies[r.target] != null)
                        competencies[r.source]["ceasn:broadAlignment"].push(await ceasnExportUriTransform(competencies[r.target].id));
                    else
                        competencies[r.source]["ceasn:broadAlignment"].push(await ceasnExportUriTransform(r.target));

                if (competencies[r.target] != null)
                    if (competencies[r.target]["ceasn:narrowAlignment"] == null)
                        competencies[r.target]["ceasn:narrowAlignment"] = [];

                if (competencies[r.target] != null)
                    if (competencies[r.source] != null)
                        competencies[r.target]["ceasn:narrowAlignment"].push(await ceasnExportUriTransform(competencies[r.source].id));
                    else
                        competencies[r.target]["ceasn:narrowAlignment"].push(await ceasnExportUriTransform(r.source));
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
                    competencies[r.target]["ceasn:exactAlignment"].push(await ceasnExportUriTransform(competencies[r.source].id));
                else
                    competencies[r.target]["ceasn:exactAlignment"].push(await ceasnExportUriTransform(r.source));

            if (competencies[r.source] != null)
                if (competencies[r.target] != null)
                    competencies[r.source]["ceasn:exactAlignment"].push(await ceasnExportUriTransform(competencies[r.target].id));
                else
                    competencies[r.source]["ceasn:exactAlignment"].push(await ceasnExportUriTransform(r.target));
        }
        if (r.relationType == "minorRelated") {
            EcArray.setRemove(f.competency, r.source);
            if (competencies[r.target] != null)
                if (competencies[r.target]["ceasn:minorAlignment"] == null)
                    competencies[r.target]["ceasn:minorAlignment"] = [];

            if (competencies[r.source] != null)
                if (competencies[r.source]["ceasn:minorAlignment"] == null)
                    competencies[r.source]["ceasn:minorAlignment"] = [];

            if (competencies[r.target] != null)
                if (competencies[r.source] != null)
                    competencies[r.target]["ceasn:minorAlignment"].push(await ceasnExportUriTransform(competencies[r.source].id));
                else
                    competencies[r.target]["ceasn:minorAlignment"].push(await ceasnExportUriTransform(r.source));

            if (competencies[r.source] != null)
                if (competencies[r.target] != null)
                    competencies[r.source]["ceasn:minorAlignment"].push(await ceasnExportUriTransform(competencies[r.target].id));
                else
                    competencies[r.source]["ceasn:minorAlignment"].push(await ceasnExportUriTransform(r.target));
        }
        if (r.relationType == "majorRelated") {
            EcArray.setRemove(f.competency, r.source);
            if (competencies[r.target] != null)
                if (competencies[r.target]["ceasn:majorAlignment"] == null)
                    competencies[r.target]["ceasn:majorAlignment"] = [];

            if (competencies[r.source] != null)
                if (competencies[r.source]["ceasn:majorAlignment"] == null)
                    competencies[r.source]["ceasn:majorAlignment"] = [];

            if (competencies[r.target] != null)
                if (competencies[r.source] != null)
                    competencies[r.target]["ceasn:majorAlignment"].push(await ceasnExportUriTransform(competencies[r.source].id));
                else
                    competencies[r.target]["ceasn:majorAlignment"].push(await ceasnExportUriTransform(r.source));

            if (competencies[r.source] != null)
                if (competencies[r.target] != null)
                    competencies[r.source]["ceasn:majorAlignment"].push(await ceasnExportUriTransform(competencies[r.target].id));
                else
                    competencies[r.source]["ceasn:majorAlignment"].push(await ceasnExportUriTransform(r.target));
        }
        if (r.relationType == Relation.REQUIRES) {
            EcArray.setRemove(f.competency, r.source);
            if (competencies[r.source] != null)
                if (competencies[r.source]["ceasn:prerequisiteAlignment"] == null)
                    competencies[r.source]["ceasn:prerequisiteAlignment"] = [];

            if (competencies[r.source] != null)
                if (competencies[r.target] != null)
                    competencies[r.source]["ceasn:prerequisiteAlignment"].push(await ceasnExportUriTransform(competencies[r.target].id));
                else
                    competencies[r.source]["ceasn:prerequisiteAlignment"].push(await ceasnExportUriTransform(r.target));
        }
    }

    f.competency = [];
    
    for (let i = 0; i < allCompetencies.length; i+=10) {
        await Promise.all(allCompetencies.slice(i, i+10).map((id) => competencyInCollectionPromise(id, competencies, allCompetencies, f, ctx, terms, cass2ceasn)));
    }

    f.context = JSON.parse(collectionContext);
    delete f.relation;

    if (f.description == null)
        f.description = f.name;
    framework = f;
    delete f.competency;
    var guid = f.getGuid();
    var uuid = new UUID(3, "nil", f.shortId()).format();

    //Remove fields that are only whitespace
    for (var key in f) {
        if (typeof f[key] == "string" && f[key].trim().length == 0) {
            delete f[key];
        }
    }
    delete f["ceasn:publisher"];
    delete f["ceasn:publisherName"];
    var socList = f["socList"];
    var naicsList = f["naicsList"];
    var cipList = f["cipList"];

    for (let each in f) {
        if (collectionTerms[each]) {
            f[collectionTerms[each]] = f[each];
            delete f[each];
        }
        if (each === "type") {
            f[each] = "ceterms:Collection";
        }
    }

    f = await jsonLdCompact(f.toJson(), JSON.parse(cetermsctx));
    if (socList) {
        f["socList"] = socList;
    }
    if (naicsList) {
        f["naicsList"] = naicsList;
    }
    if (cipList) {
        f["cipList"] = cipList;
    }
    if (f["ceterms:ctid"] == null) {
        if (guid.matches("^(ce-)?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"))
            f["ceterms:ctid"] = guid;
        else
            f["ceterms:ctid"] = uuid;
    }
    if (f["ceterms:ctid"].indexOf("ce-") != 0)
        f["ceterms:ctid"] = "ce-" + f["ceterms:ctid"];

    if (f["@id"] != await ceasnExportUriTransform(f["@id"])) {
        if (f["ceasn:source"] != null)
            if (EcArray.isArray(f["ceasn:source"])) {
                f["ceasn:source"].push(f["@id"]);
            }
        else {
            f["ceasn:source"] = [f["ceasn:source"], f["@id"]];
        } else
            f["ceasn:source"] = f["@id"];
    }
    f["@id"] = await ceasnExportUriTransform(f["@id"]);

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
        if (c["@id"] != await ceasnExportUriTransform(c["@id"])) {
            if (c["ceasn:exactAlignment"] != null)
                if (EcArray.isArray(c["ceasn:exactAlignment"])) {
                    c["ceasn:exactAlignment"].push(c["@id"]);
                }
            else {
                c["ceasn:exactAlignment"] = [c["ceasn:exactAlignment"], c["@id"]];
            } else
                c["ceasn:exactAlignment"] = [c["@id"]];
        }
        competencies[k]["@id"] = await ceasnExportUriTransform(competencies[k]["@id"]);
        results.push(competencies[k]);
    }
    delete f["@context"];
    delete f["ceasn:dateCreated"];
    delete f["ceasn:dateModified"];
    var r = {};
    r["@context"] = "https://credreg.net/ctdl/schema/context/json";
    if (ceasnExportUriPrefixGraph != null)
        if (guid.matches("^(ce-)?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"))
            r["@id"] = ceasnExportUriPrefixGraph + guid;
        else
            r["@id"] = ceasnExportUriPrefixGraph + uuid;
    r["@graph"] = results;
    return JSON.stringify(r, null, 2);
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

async function conceptPromise(obj, concepts, cs, ctx, terms) {
    return new Promise(async (resolve) => {
        try {
            var c = concepts[obj];
            delete concepts[obj];
            if (c != null && c.id != null) {
                var id = c.id;
                concepts[id] = c;
                delete concepts[id]["owner"];
                delete concepts[id]["signature"];
                delete concepts[id]["skos:inLanguage"];

                c.context = "https://schema.cassproject.org/0.4/jsonld1.1/cass2ceasnConcepts.json";
                if (c.id != await ceasnExportUriTransform(c.id)) {
                    if (c["skos:exactMatch"] != null)
                        if (EcArray.isArray(c["skos:exactMatch"])) {
                            c["skos:exactMatch"].push(c.id);
                        }
                    else {
                        c["skos:exactMatch"] = [c["skos:exactMatch"], c.id];
                    } else
                        c["skos:exactMatch"] = [c.id];
                }
                c.id = await ceasnExportUriTransform(c.id);
                c["skos:inScheme"] = await ceasnExportUriTransform(cs.id);
                if (c["skos:topConceptOf"] != null) {
                    c["skos:topConceptOf"] = await ceasnExportUriTransform(cs.id);
                }
                if (c.type == null) //Already done / referred to by another name.
                    resolve();
                var guid = c.getGuid();
                var uuid = new UUID(3, "nil", c.shortId()).format();
                for (let each in c) {
                    if (terms[each]) {
                        c[terms[each]] = c[each];
                        delete c[each];
                    }
                    if (each === "type") {
                        c[each] = "ceasn:Concept";
                    }
                }
                concepts[obj] = concepts[id] = await jsonLdCompact(c.toJson(), ctx);

                if (concepts[id]["ceterms:ctid"] == null) {
                    if (guid.matches("^(ce-)?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$")) {
                        concepts[id]["ceterms:ctid"] = guid;
                    } else {
                        concepts[id]["ceterms:ctid"] = uuid;
                    }
                }

                if (concepts[id]["ceterms:ctid"].indexOf("ce-") != 0) {
                    concepts[id]["ceterms:ctid"] = "ce-" + concepts[id]["ceterms:ctid"];
                }
                delete concepts[id]["@context"];

                concepts[id] = conceptArrays(concepts[id]);
            }
            resolve();
        } catch(err) {
            console.log(err);
            resolve();
        }
    });
}

async function cassConceptSchemeAsCeasn(framework) {
    EcRepository.caching = true;
    if (framework == null)
        error("Concept Scheme not found.", 404);

    var cs = new EcConceptScheme();
    cs.copyFrom(framework);
    if (cs["skos:hasTopConcept"] == null) {
        cs["skos:hasTopConcept"] = [];
    }
    repo.precache(cs["skos:hasTopConcept"], function() {});

    var concepts = {};
    var allConcepts = JSON.parse(JSON.stringify(cs["skos:hasTopConcept"]));

    for (var i = 0; i < cs["skos:hasTopConcept"].length; i++) {
        var c = await EcConcept.get(cs["skos:hasTopConcept"][i], null, null, repo);
        if (c != null) {
            concepts[cs["skos:hasTopConcept"][i]] = concepts[c.id] = c;
            if (c["skos:narrower"]) {
                async function getSubConcepts(c) {
                    repo.precache(c["skos:narrower"], function() {});
                    for (var j = 0; j < c["skos:narrower"].length; j++) {
                        var subC = await EcConcept.get(c["skos:narrower"][j], null, null, repo);
                        if (subC != null) {
                            concepts[subC.id] = subC;
                            allConcepts.push(subC.id);
                            if (subC["skos:narrower"]) {
                                getSubConcepts(subC);
                            }
                        }
                    }

                }
                await getSubConcepts(c);
            }
        }
    }

    var ctx = JSON.stringify((await httpGet("https://credreg.net/ctdlasn/schema/context/json"))["@context"],true);
    const terms = JSON.parse(JSON.stringify((await httpGet("https://schema.cassproject.org/0.4/jsonld1.1/cass2ceasnConceptsTerms")),true));

    for (let i = 0; i < allConcepts.length; i+=100) {
        await Promise.all(allConcepts.slice(i, i+100).map((id) => conceptPromise(id, concepts, cs, ctx, terms)));
    }

    cs.context = "https://schema.cassproject.org/0.4/jsonld1.1/cass2ceasnConcepts.json";

    framework = cs;
    var guid = cs.getGuid();
    var uuid = new UUID(3, "nil", cs.shortId()).format();
    var csId = cs.id;
    delete cs["owner"];
    delete cs["signature"];
    for (let each in cs) {
        if (terms[each]) {
            cs[terms[each]] = cs[each];
            delete cs[each];
        }
        if (each === "type") {
            cs[each] = "skos:ConceptScheme";
        }
    }
    cs = await jsonLdCompact(cs.toJson(), ctx);
    if (cs["ceasn:inLanguage"] == null) {
        cs["ceasn:inLanguage"] = "en";
    }
    if (cs["ceterms:ctid"] == null) {
        if (guid.matches("^(ce-)?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$")) {
            cs["ceterms:ctid"] = guid;
        } else {
            cs["ceterms:ctid"] = uuid;
        }
    }
    if (cs["ceterms:ctid"].indexOf("ce-") != 0) {
        cs["ceterms:ctid"] = "ce-" + cs["ceterms:ctid"];
    }

    if (csId != await ceasnExportUriTransform(csId)) {
        if (cs["ceasn:exactAlignment"] != null)
            if (EcArray.isArray(cs["ceasn:exactAlignment"])) {
                cs["ceasn:exactAlignment"].push(csId);
            }
        else {
            cs["ceasn:exactAlignment"] = [cs["ceasn:exactAlignment"], csId];
        } else
            cs["ceasn:exactAlignment"] = [csId];
    }
    cs["@id"] = await ceasnExportUriTransform(csId);

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
        concepts[k]["@id"] = await ceasnExportUriTransform(concepts[k]["@id"]);
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

function createEachRelation(e, field, type, repo, ceo, id, cassRelations, toSave, i) {
    var r = new EcAlignment();
    r.generateId(process.env.CASS_EXTERNAL_ENDPOINT || repo.selectedServer);
    if (ceo != null)
        r.addOwner(ceo.ppk.toPk());
    if (id != null)
        r.addOwner(EcPk.fromPem(id));

    r.relationType = type;
    if (field == "ceasn:narrowAlignment") {
        r.source = EcRemoteLinkedData.trimVersionFromUrl(e[field][i]);
        r.target = EcRemoteLinkedData.trimVersionFromUrl(e.id);
    }
    else {
        r.source = EcRemoteLinkedData.trimVersionFromUrl(e.id);
        r.target = EcRemoteLinkedData.trimVersionFromUrl(e[field][i]);
    }

    cassRelations.push(r.shortId());
    toSave.push(r);
}

function createRelations(e, field, type, repo, ceo, id, cassRelations, toSave) {
    if (!EcArray.isArray(e[field])) {
        e[field] = [e[field]];
    }
    for (var i = 0; i < e[field].length; i++) {
        createEachRelation(e, field, type, repo, ceo, id, cassRelations, toSave, i);
    }
}

async function importCompetencyPromise(asnComp, relationshipMap, listToSave, cassRelationships, cassCompetencies, ceasnIdentity, repo, owner, ceasn2cassTerms) {
    return new Promise(async (resolve) => {
        try {
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

            newComp["@context"] = "https://schema.cassproject.org/0.4/jsonld1.1/ceasn2cass.json";
            for (let each in newComp) {
                if (ceasn2cassTerms[each]) {
                    newComp[ceasn2cassTerms[each]] = newComp[each];
                    delete newComp[each];
                }
                if (each === "@type") {
                    newComp[each] = "Competency";
                }
            }
            var expandedComp = await jsonLdExpand(JSON.stringify(newComp));
            var compactedComp = await jsonLdCompact(JSON.stringify(expandedComp), "https://schema.cassproject.org/0.4");

            delete compactedComp["ceasn:isChildOf"];
            delete compactedComp["ceasn:hasChild"];
            delete compactedComp["ceasn:isPartOf"];

            var c = new EcCompetency();
            c.copyFrom(compactedComp);
            c.addOwner(ceasnIdentity.ppk.toPk());

            if (c["schema:dateCreated"] == null || c["schema:dateCreated"] === undefined) {
                var timestamp;
                var date;
                if (!c.id.substring(c.id.lastIndexOf("/")).matches("\\/[0-9]+")) {
                    timestamp = null;
                } else {
                    timestamp = c.id.substring(c.id.lastIndexOf("/") + 1);
                }
                if (timestamp != null) {
                    date = new Date(parseInt(timestamp)).toISOString();
                } else {
                    date = new Date().toISOString();
                }
                c["schema:dateCreated"] = date;
            }
            if (c["ceasn:broadAlignment"]) {
                createRelations(c, "ceasn:broadAlignment", "narrows", repo, ceasnIdentity, owner, cassRelationships, listToSave);
            }
            if (c["ceasn:narrowAlignment"]) {
                createRelations(c, "ceasn:narrowAlignment", "narrows", repo, ceasnIdentity, owner, cassRelationships, listToSave);
            }
            if (c["sameAs"]) {
                createRelations(c, "sameAs", "isEquivalentTo", repo, ceasnIdentity, owner, cassRelationships, listToSave);
            }
            if (c["ceasn:majorAlignment"]) {
                createRelations(e, "ceasn:majorAlignment", "majorRelated", repo, ceasnIdentity, owner, cassRelationships, listToSave);
            }
            if (c["ceasn:minorAlignment"]) {
                createRelations(c, "ceasn:minorAlignment", "minorRelated", repo, ceasnIdentity, owner, cassRelationships, listToSave);
            }
            if (c["ceasn:prerequisiteAlignment"]) {
                createRelations(c, "ceasn:prerequisiteAlignment", "requires", repo, ceasnIdentity, owner, cassRelationships, listToSave);
            }
            delete c["ceasn:broadAlignment"];
            delete c["ceasn:narrowAlignment"];
            delete c["sameAs"];
            delete c["ceasn:majorAlignment"];
            delete c["ceasn:minorAlignment"];
            delete c["ceasn:prerequisiteAlignment"];

            if (c["ceasn:broadAlignment"]) {
                createRelations(c, "ceasn:broadAlignment", "narrows", repo, ceasnIdentity, owner, cassRelationships, listToSave);
            }
            if (c["ceasn:narrowAlignment"]) {
                createRelations(c, "ceasn:narrowAlignment", "narrows", repo, ceasnIdentity, owner, cassRelationships, listToSave);
            }
            if (c["sameAs"]) {
                createRelations(c, "sameAs", "isEquivalentTo", repo, ceasnIdentity, owner, cassRelationships, listToSave);
            }
            if (c["ceasn:majorAlignment"]) {
                createRelations(e, "ceasn:majorAlignment", "majorRelated", repo, ceasnIdentity, owner, cassRelationships, listToSave);
            }
            if (c["ceasn:minorAlignment"]) {
                createRelations(c, "ceasn:minorAlignment", "minorRelated", repo, ceasnIdentity, owner, cassRelationships, listToSave);
            }
            if (c["ceasn:prerequisiteAlignment"]) {
                createRelations(c, "ceasn:prerequisiteAlignment", "requires", repo, ceasnIdentity, owner, cassRelationships, listToSave);
            }
            delete c["ceasn:broadAlignment"];
            delete c["ceasn:narrowAlignment"];
            delete c["sameAs"];
            delete c["ceasn:majorAlignment"];
            delete c["ceasn:minorAlignment"];
            delete c["ceasn:prerequisiteAlignment"];

            if (owner != null)
                c.addOwner(EcPk.fromPem(owner));
            listToSave.push(c);
            resolve();
        } catch(err) {
            console.log(err);
            resolve();
        }
    });
}

async function importCeFrameworkToCass(frameworkObj, competencyList) {
    const nodeDocumentLoader = jsonld.documentLoaders.node();
    const cassContext = JSON.stringify((await httpGet("https://schema.cassproject.org/0.4")),true);
    const ceasn2cassContext = JSON.stringify((await httpGet("https://schema.cassproject.org/0.4/jsonld1.1/ceasn2cass.json")),true);
    const ceasn2cassTerms = JSON.parse(JSON.stringify((await httpGet("https://schema.cassproject.org/0.4/jsonld1.1/ceasn2cassTerms")),true));

    const customLoader = async (url) => {
        if(url === "https://schema.cassproject.org/0.4") {
            return {
                contextUrl: null, // this is for a context via a link header
                document: cassContext, // this is the actual document that was loaded
                documentUrl: url // this is the actual context URL after redirects
            };
        }
        if(url === "https://schema.cassproject.org/0.4/jsonld1.1/ceasn2cass.json") {
            return {
                contextUrl: null, // this is for a context via a link header
                document: ceasn2cassContext, // this is the actual document that was loaded
                documentUrl: url // this is the actual context URL after redirects
            };
        }
        // call the default documentLoader
        return await nodeDocumentLoader(url);
    };

    jsonld.documentLoader = customLoader;

    var owner = fileToString.call(this, (fileFromDatastream).call(this, "owner"));

    var ceasnIdentity = new EcIdentity();
    ceasnIdentity.ppk = EcPpk.fromPem(keyFor("adapter.ceasn.private"));
    ceasnIdentity.displayName = "CEASN Server Identity";
    EcIdentityManager.default.addIdentity(ceasnIdentity);

    if (false && repoEndpoint().contains("localhost"))
        error("Endpoint Configuration is not set.", 500);

    var cassCompetencies = [];
    var cassRelationships = [];
    var relationshipMap = {};

    if (frameworkObj != null) {
        var topChild = frameworkObj["ceasn:hasTopChild"] ? frameworkObj["ceasn:hasTopChild"] : frameworkObj["ceasn:hasChild"];
        if (topChild != null && topChild.length != null) {
            for (var i = 0; i < topChild.length; i++) {
                cassCompetencies.push(EcRemoteLinkedData.trimVersionFromUrl(topChild[i]));
            }
        }
    }

    var listToSave = [];
    for (let idx = 0; idx < competencyList.length; idx+=100) {
        await Promise.all(competencyList.slice(idx, idx+100).map((comp) => importCompetencyPromise(comp, relationshipMap, listToSave, cassRelationships, cassCompetencies, ceasnIdentity, repo, owner, ceasn2cassTerms)));
    }

    if (frameworkObj != null) {
        var guid = EcCrypto.md5(EcRemoteLinkedData.trimVersionFromUrl(frameworkObj["@id"]));

        frameworkObj["@context"] = "https://schema.cassproject.org/0.4/jsonld1.1/ceasn2cass.json";
        for (let each in frameworkObj) {
            if (ceasn2cassTerms[each]) {
                frameworkObj[ceasn2cassTerms[each]] = frameworkObj[each];
                delete frameworkObj[each];
            }
            if (each === "@type") {
                frameworkObj[each] = "Framework";
            }
        }
        var expanded = await jsonLdExpand(JSON.stringify(frameworkObj));
        var compacted = await jsonLdCompact(JSON.stringify(expanded), "https://schema.cassproject.org/0.4");

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
            if (EcFramework.template != null && EcFramework.template["schema:inLanguage"] != null) {
                f["schema:inLanguage"] = EcFramework.template["schema:inLanguage"];
            }
            else {
                f["schema:inLanguage"] = "en";
            }
        }

        if (f["schema:dateCreated"] == null || f["schema:dateCreated"] === undefined) {
            var timestamp;
            var date;
            if (!f.id.substring(f.id.lastIndexOf("/")).matches("\\/[0-9]+")) {
                timestamp = null;
            } else {
                timestamp = f.id.substring(f.id.lastIndexOf("/") + 1);
            }
            if (timestamp != null) {
                date = new Date(parseInt(timestamp)).toISOString();
            } else {
                date = new Date().toISOString();
            }
            f["schema:dateCreated"] = date;
        }

        listToSave.push(f);

        await loopback.multiput(repo,listToSave);
        return f.shortId();
    } // end if frameworkObj != null
}

async function importCompetencyToCollectionPromise(asnComp, listToSave, cassRelationships, ceasnIdentity, repo, owner, terms) {
    return new Promise(async (resolve) => {
        try {
            var newComp = JSON.parse(JSON.stringify(asnComp));

            let frameworks = await EcFramework.search(repo, 'competency:"' + EcRemoteLinkedData.trimVersionFromUrl(newComp.id) + '" AND NOT subType:Collection');
            if (frameworks && frameworks.length > 0) {
                resolve();
                return;
            }

            newComp["@context"] = "https://schema.cassproject.org/0.4/jsonld1.1/ceasn2cass.json";
            for (let each in newComp) {
                if (terms[each]) {
                    newComp[terms[each]] = newComp[each];
                    delete newComp[each];
                }
                if (each === "@type") {
                    newComp[each] = "Competency";
                }
            }
            var expandedComp = await jsonLdExpand(JSON.stringify(newComp));
            var compactedComp = await jsonLdCompact(JSON.stringify(expandedComp), "https://schema.cassproject.org/0.4");

            delete compactedComp["ceasn:isChildOf"];
            delete compactedComp["ceasn:hasChild"];
            delete compactedComp["ceasn:isPartOf"];

            var c = new EcCompetency();
            c.copyFrom(compactedComp);
            c.addOwner(ceasnIdentity.ppk.toPk());

            if (c["schema:dateCreated"] == null || c["schema:dateCreated"] === undefined) {
                var timestamp;
                var date;
                if (!c.id.substring(c.id.lastIndexOf("/")).matches("\\/[0-9]+")) {
                    timestamp = null;
                } else {
                    timestamp = c.id.substring(c.id.lastIndexOf("/") + 1);
                }
                if (timestamp != null) {
                    date = new Date(parseInt(timestamp)).toISOString();
                } else {
                    date = new Date().toISOString();
                }
                c["schema:dateCreated"] = date;
            }
            if (c["ceasn:broadAlignment"]) {
                createRelations(c, "ceasn:broadAlignment", "narrows", repo, ceasnIdentity, owner, cassRelationships, listToSave);
            }
            if (c["ceasn:narrowAlignment"]) {
                createRelations(c, "ceasn:narrowAlignment", "narrows", repo, ceasnIdentity, owner, cassRelationships, listToSave);
            }
            if (c["sameAs"]) {
                createRelations(c, "sameAs", "isEquivalentTo", repo, ceasnIdentity, owner, cassRelationships, listToSave);
            }
            if (c["ceasn:majorAlignment"]) {
                createRelations(e, "ceasn:majorAlignment", "majorRelated", repo, ceasnIdentity, owner, cassRelationships, listToSave);
            }
            if (c["ceasn:minorAlignment"]) {
                createRelations(c, "ceasn:minorAlignment", "minorRelated", repo, ceasnIdentity, owner, cassRelationships, listToSave);
            }
            if (c["ceasn:prerequisiteAlignment"]) {
                createRelations(c, "ceasn:prerequisiteAlignment", "requires", repo, ceasnIdentity, owner, cassRelationships, listToSave);
            }
            delete c["ceasn:broadAlignment"];
            delete c["ceasn:narrowAlignment"];
            delete c["sameAs"];
            delete c["ceasn:majorAlignment"];
            delete c["ceasn:minorAlignment"];
            delete c["ceasn:prerequisiteAlignment"];

            if (owner != null)
                c.addOwner(EcPk.fromPem(owner));
            listToSave.push(c);
            resolve();
        } catch(err) {
            console.log(err);
            resolve();
        }
    });
}

async function importCeCollectionToCass(frameworkObj, competencyList) {
    const nodeDocumentLoader = jsonld.documentLoaders.node();
    const cassContext = JSON.stringify((await httpGet("https://schema.cassproject.org/0.4")),true);
    const ceasn2cassContext = JSON.stringify((await httpGet("https://schema.cassproject.org/0.4/jsonld1.1/ceasn2cass.json")),true);
    const ceasn2cassTerms = JSON.parse(JSON.stringify((await httpGet("https://schema.cassproject.org/0.4/jsonld1.1/ceasn2cassTerms")),true));

    const customLoader = async (url) => {
        if(url === "https://schema.cassproject.org/0.4") {
            return {
                contextUrl: null, // this is for a context via a link header
                document: cassContext, // this is the actual document that was loaded
                documentUrl: url // this is the actual context URL after redirects
            };
        }
        if(url === "https://schema.cassproject.org/0.4/jsonld1.1/ceasn2cass.json") {
            return {
                contextUrl: null, // this is for a context via a link header
                document: ceasn2cassContext, // this is the actual document that was loaded
                documentUrl: url // this is the actual context URL after redirects
            };
        }
        // call the default documentLoader
        return await nodeDocumentLoader(url);
    };

    jsonld.documentLoader = customLoader;

    var owner = fileToString.call(this, (fileFromDatastream).call(this, "owner"));

    var ceasnIdentity = new EcIdentity();
    ceasnIdentity.ppk = EcPpk.fromPem(keyFor("adapter.ceasn.private"));
    ceasnIdentity.displayName = "CEASN Server Identity";
    EcIdentityManager.default.addIdentity(ceasnIdentity);

    if (false && repoEndpoint().contains("localhost"))
        error("Endpoint Configuration is not set.", 500);

    var cassCompetencies = [];
    var cassRelationships = [];
    var relationshipMap = {};

    if (frameworkObj != null) {
        var topChild = frameworkObj["ceterms:hasMember"];
        if (topChild != null && topChild.length != null) {
            for (var i = 0; i < topChild.length; i++) {
                cassCompetencies.push(EcRemoteLinkedData.trimVersionFromUrl(topChild[i]));
            }
        }
    }

    var listToSave = [];
    for (let idx = 0; idx < competencyList.length; idx+=100) {
        await Promise.all(competencyList.slice(idx, idx+100).map((comp) => importCompetencyToCollectionPromise(comp, listToSave, cassRelationships, ceasnIdentity, repo, owner, ceasn2cassTerms)));
    }

    if (frameworkObj != null) {
        var guid = EcCrypto.md5(EcRemoteLinkedData.trimVersionFromUrl(frameworkObj["@id"]));

        frameworkObj["@context"] = "https://schema.cassproject.org/0.4/jsonld1.1/ceasn2cass.json";
        for (let each in frameworkObj) {
            if (ceasn2cassTerms[each]) {
                frameworkObj[ceasn2cassTerms[each]] = frameworkObj[each];
                delete frameworkObj[each];
            }
            if (each === "@type") {
                frameworkObj[each] = "Framework";
            }
        }
        var expanded = await jsonLdExpand(JSON.stringify(frameworkObj));
        var compacted = await jsonLdCompact(JSON.stringify(expanded), "https://schema.cassproject.org/0.4");

        delete compacted["ceasn:hasChild"];
        delete compacted["ceasn:hasTopChild"];

        compacted["competency"] = cassCompetencies;
        delete compacted['ceterms:hasMember'];
        compacted["relation"] = cassRelationships;
        compacted["@type"] = "Framework";
        compacted.subType = "Collection";

        var f = new EcFramework();
        f.copyFrom(compacted);
        f.addOwner(ceasnIdentity.ppk.toPk());

        if (owner != null)
            f.addOwner(EcPk.fromPem(owner));

        if (f["schema:dateCreated"] == null || f["schema:dateCreated"] === undefined) {
            var timestamp;
            var date;
            if (!f.id.substring(f.id.lastIndexOf("/")).matches("\\/[0-9]+")) {
                timestamp = null;
            } else {
                timestamp = f.id.substring(f.id.lastIndexOf("/") + 1);
            }
            if (timestamp != null) {
                date = new Date(parseInt(timestamp)).toISOString();
            } else {
                date = new Date().toISOString();
            }
            f["schema:dateCreated"] = date;
        }

        listToSave.push(f);

        await loopback.multiput(repo,listToSave);
        console.log(listToSave);
        return f.shortId();
    } // end if frameworkObj != null
}

async function ceasnFrameworkToCass() {
    EcRepository.caching = true;
    var jsonLd, text;

    var data = fileFromDatastream.call(this, "data");
    if (data === undefined || data == null) {
        data = fileFromDatastream.call(this, "file");
        if (data && data.path) {
            data = await fsPromises.readFile(data.path, {encoding: 'utf8'});
        }
    }
    text = fileToString(data);
    try {
        jsonLd = JSON.parse(text);
    } catch (e) {
        debug("Not json.");
        debug(e);
        debug(text);
        // rdfToJsonLd not defined anywhere
        // jsonLd = rdfToJsonLd(text);
    }

    var frameworkObj = undefined;
    var collectionObj = undefined;
    var competencyList = [];

    if (jsonLd["@graph"] != undefined && jsonLd["@graph"] != "") {
        var graph = jsonLd["@graph"];

        for (var idx in graph) {
            var graphObj = graph[idx];

            if (graphObj["@type"] == "ceasn:CompetencyFramework") {
                graphObj["@context"] = jsonLd["@context"];
                frameworkObj = graphObj;
            } else if (graphObj["@type"] == "ceterms:Collection") {
                graphObj["@context"] = jsonLd["@context"];
                collectionObj = graphObj;
            } else if (graphObj["@type"] == "ceasn:Competency") { //&& graphObj["asn:statementLabel"] != undefined && (graphObj["asn:statementLabel"] == "Competency" || graphObj["asn:statementLabel"]["@value"] == "Competency")){
                graphObj["@context"] = jsonLd["@context"];
                competencyList.push(graphObj);
            }
        }

        if (frameworkObj == undefined && collectionObj == undefined && competencyList.length != Object.keys(graph).length) {
            return await importJsonLdGraph.call(this, graph, jsonLd["@context"]);
        } else if (collectionObj) {
            return await importCeCollectionToCass.call(this, collectionObj, competencyList);
        } else {
            return await importCeFrameworkToCass.call(this, frameworkObj, competencyList);
        }
    } else {
        error("no @graph created, unsure how to parse");
    }
}

async function ceasnEndpoint() {
    if (this.params.methodType == "GET")
        return await cassFrameworkAsCeasn.call(this);
    else if (this.params.methodType == "POST" || this.params.methodType == "PUT")
        return await ceasnFrameworkToCass.call(this);
    else if (this.params.methodType == "DELETE")
        error("Not Yet Implemented.", "405");
    else
        error("Not Yet Implemented.", "405");
    return "Not Yet Implemented";
}

bindWebService("/ceasn/*", ceasnEndpoint);
bindWebService("/ctdlasn/*", ceasnEndpoint);
bindWebService("/ctdlasn", ceasnEndpoint);