const { skyrepoGet } = require('../../skyRepo/get');
let frameworkTranslation = {
    "@id": "id",
    "ceasn:derivedFrom": "authoritativeSource",
    competency: "competencyDefinition",
    relation: "resourceAssociation",
}
let frameworkTerms = ["id", "authoritativeSource", "competencyDefinition", "name", "resourceAssociation", "description"];
let competencyTranslation = {
    "@id": "id",
    name: "competencyStatement",
    frameworks: "competencyFramework",
    "ceasn:competencyLabel": "name",
    "ceasn:codedNotation": "referenceCode",
    "dcterms:type": "typeLabel"
}
let competencyTerms = ["id", "competencyStatement", "competencyFramework", "description", "name", "referenceCode", "typeLabel"];
let relationTranslation = {
    "@id": "id",
    relationType: "associationType",
    target: "destination",
    framework: "competencyFramework"
}
let relationTerms = ["id", "associationType", "source", "destination", "weight", "competencyFramework"];

function removeFields(o, terms) {
    for (var k in o) {
        if (!terms.includes(k)) {
            delete o[k];
        }
    }
}

function getGuid(id) {
    var shortId = EcRemoteLinkedData.trimVersionFromUrl(id);
    var parts = shortId.split("/");
    return parts[parts.length - 1];
}

function transformUrl(url) {
    if (EcRepository.shouldTryUrl(url) === false && url.indexOf(this.repo.selectedServer) === -1) {
        guid = EcCrypto.md5(EcRemoteLinkedData.trimVersionFromUrl(url));
    } else {
        guid = getGuid(url);
    }
    return this.repo.selectedServer + "scd/" + guid;
}

async function cassFrameworkAsScd(framework) {
    var f = new EcFramework();
    f.copyFrom(framework);
    for (let each in f) {
        if (frameworkTranslation[each]) {
            f[frameworkTranslation[each]] = f[each];
            delete f[each];
        }
    }
    removeFields(f, frameworkTerms);
    for (let i = 0; i < f.competencyDefinition.length; i++) {
        f.competencyDefinition[i] = transformUrl(f.competencyDefinition[i]);
    }
    for (let i = 0; i < f.resourceAssociation.length; i++) {
        f.resourceAssociation[i] = transformUrl(f.resourceAssociation[i]);
    }
    return JSON.stringify(f, null, 2);
}

async function cassCompetencyAsScd(c) {
    let frameworks = null;
    try {
        frameworks = await EcFramework.search(repo, "competency:\"" + c.shortId() + "\"");
    } catch (error) {
        error("Framework search failed.");
    }
    if (frameworks) {
        c.frameworks = [];
        for (let i = 0; i < frameworks.length; i++) {
            c.frameworks.push(transformUrl(frameworks[i]["id"]));
        }
    }
    for (let each in c) {
        if (competencyTranslation[each]) {
            c[competencyTranslation[each]] = c[each];
            delete c[each];
        }
    }
    removeFields(c, competencyTerms);
    return JSON.stringify(c, null, 2);
}

async function cassRelationAsScd(r) {
    let frameworks = null;
    try {
        frameworks = await EcFramework.search(repo, "relation:\"" + r.shortId() + "\"");
    } catch (error) {
        error("Framework search failed.");
    }
    if (frameworks) {
        r.frameworks = [];
        for (let i = 0; i < frameworks.length; i++) {
            r.frameworks.push(transformUrl(frameworks[i]["id"]));
        }
    }
    r.source = transformUrl(r.source);
    r.target = transformUrl(r.target);
    for (let each in r) {
        if (relationTranslation[each]) {
            r[relationTranslation[each]] = r[each];
            delete r[each];
        }
    }
    removeFields(r, relationTerms);
    return JSON.stringify(r, null, 2);
}

async function cassToScd() {
    var query = queryParse.call(this);
    var framework = null;
    var competency = null;
    var relation = null;
    if (framework == null)
        framework = await skyrepoGet.call(this, query);
    if (framework == null && this.params.id != null) {
        framework = await EcFramework.get(decodeURIComponent(this.params.id), null, null, repo);
    }
    if (framework == null && this.params.urlRemainder != null) {
        var id = global.repo.selectedServer + "data" + this.params.urlRemainder;
        framework = await EcFramework.get(id, null, null, repo);
    }
    if (framework == null || framework["@type"] == null || !framework["@type"].contains("ramework"))
        framework = null;
    if (framework != null) {
        return await cassFrameworkAsScd(framework);
    } else if (framework == null) {
        competency = await skyrepoGet.call(this, query);
        if (competency == null && this.params.id != null)
            competency = await EcCompetency.get(decodeURIComponent(this.params.id), null, null, repo);
        else if (competency != null && competency["@type"].contains("ompetency")) {
            var c = new EcCompetency();
            c.copyFrom(competency);
            competency = c;
        }
        if (competency == null && this.params.urlRemainder != null) {
            var id = global.repo.selectedServer + "data" + this.params.urlRemainder;
            competency = await EcCompetency.get(id, null, null, repo);
        }
        if (competency.type == null || !competency.type.contains("ompetency"))
            competency = null;
        if (competency != null) {
            return await cassCompetencyAsScd(competency);
        } else {
            relation = await skyrepoGet.call(this, query);
            if (relation == null && this.params.id != null)
                relation = await EcAlignment.get(decodeURIComponent(this.params.id), null, null, repo);
            else if (relation != null) {
                var r = new EcAlignment();
                r.copyFrom(relation);
                relation = r;
            }
            if (relation == null && this.params.urlRemainder != null) {
                var id = global.repo.selectedServer + "data" + this.params.urlRemainder;
                relation = await EcAlignment.get(id, null, null, repo);
            }
            if (relation != null) {
                return await cassRelationAsScd(relation);
            }
        }
    }
    if (framework == null && competency == null && relation == null)
        error("Object not found or you did not supply sufficient permissions to access the object.", 404);
}

async function scdEndpoint() {
    if (this.params.methodType == "GET")
        return await cassToScd.call(this);
    else
        error("Not Yet Implemented.", "405");
    return "Not Yet Implemented";
}

/**
 * @openapi
 * /api/scd/{id}:
 *   get:
 *     tags:
 *       - SCD Adapter
 *     summary: Export a framework, competency, or relation in SCD format
 *     description: |
 *       Looks up the object by ID and converts it to Skills Competency Data
 *       (SCD) format. Automatically detects the type (framework, competency,
 *       or relation) and returns the appropriate SCD representation.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Object identifier (GUID or full URL).
 *     responses:
 *       200:
 *         description: SCD-formatted JSON object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Object not found or insufficient permissions.
 *       405:
 *         description: Non-GET methods are not yet implemented.
 */
bindWebService("/scd/*", scdEndpoint);