let loopback = require('../../shims/cassproject.js');
var xapiMePpk = keyFor("xapiAdapter");

var xapiConfig = function () {
    if (this.xapiConfig != null) return this.xapiConfig;
    var xapiConfigFilePath = "etc/adapter.xapi.json";
    if (!fileExists(xapiConfigFilePath))
        fileSave(JSON.stringify({
            xapiEndpoint: "",
            xapiHostname: "",
            xapiAuth: "",
            enabled: false
        }), xapiConfigFilePath);
    this.xapiConfig = JSON.parse(fileToString(fileLoad(xapiConfigFilePath)));
    this.xapiConfig.xapiEndpoint = process.env.XAPI_ENDPOINT || this.xapiConfig.xapiEndpoint;
    this.xapiConfig.xapiAuth = process.env.XAPI_AUTH || this.xapiConfig.xapiAuth;
    this.xapiConfig.enabled = (process.env.XAPI_ENABLED ? true : false) || this.xapiConfig.xapiEnabled;
    if (process.env.XAPI_DEBUG) console.log(this.xapiConfig);
    return this.xapiConfig;
}
var xapiConfigAutoExecute = xapiConfig;

var xapiEndpoint = async function (more, since, config) {
    var endpoint;
    if (config) {
        endpoint = config.xapiEndpoint + "statements?format=exact&limit=" + (process.env.XAPI_STATEMENT_COUNT || 10);
    } else {
        endpoint = xapiConfig.call(this).xapiEndpoint + "statements?format=exact&limit=0";
        if (!xapiConfig.call(this).enabled)
            return;
    }
    if (since != null)
        endpoint += "&since=" + since;
    if (more != null)
        if (config) {
            endpoint = config.xapiHostname + more;
        } else {
            endpoint = xapiConfig.call(this).xapiHostname + more;
        }
    var headers = {};
    if (config) {
        headers["Authorization"] = config.xapiAuth;
    } else {
        headers["Authorization"] = xapiConfig.call(this).xapiAuth;
    }
    headers["X-Experience-API-Version"] = "1.0.1";
    if (process.env.XAPI_DEBUG) console.log(endpoint, headers);
    let results = await fetch(endpoint, { method: "GET", headers: headers });
    results = await results.json();
    if (process.env.XAPI_DEBUG) console.log(results);
    return results;
}

var getMbox = function (agentObject) {
    if (agentObject == null)
        return [];
    if (EcArray.isArray(agentObject))
        agentObject = agentObject[0];
    if (agentObject.objectType == "Group") {
        let agents = [];
        for (let agent of agentObject.member)
            agents = agents.concat(getMbox(agent));
        return agents;
    }
    var email = agentObject.mbox;
    if (email != null)
        return [{ mbox: email, name: agentObject.name }];
    if (agentObject.account != null)
        return [{ mbox: agentObject.account.name, name: agentObject.name }];
    return [];
}

let personCache = {};
setInterval(function () {
    personCache = {};
}, 1000 * 60 * 60);
var personFromEmail = async function (mbox, name) {
    if (mbox == null) return null;
    if (personCache[mbox] != null) return personCache[mbox];
    var person = null;
    mbox = mbox.replace("mailto:", "");
    if (mbox.indexOf("@") != -1) {
        let people = null;
        people = await loopback.repositorySearch(global.repo, "@type:Person AND email:\"" + mbox + "\"", {});
        if (people != null) {
            if (people.length >= 1)
                person = people[0];
            else if (people.length == 0) {
                var ppk = await EcPpk.generateKey();
                person = new schema.Person();
                person.assignId(repo.selectedServer, ppk.toPk().fingerprint());
                person.addOwner(ppk.toPk());
                person.addOwner(EcPpk.fromPem(xapiMePpk).toPk());
                var mb = mbox.replace("mailto:", "");
                if (mb.indexOf("@") == -1) {
                    person.username = mb;
                    person.identifier = mb;
                }
                else
                    person.email = mb;
                person.name = name;
                await repo.saveTo(person, null, null, xapiIm);
                global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, "XapiSavePerson");
            }
            if (person.name == null) {
                person.name = name;
                await repo.saveTo(person, null, null, xapiIm);
                global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, "XapiSavePerson");
            }
        }
    }
    else {
        let people = null;
        people = await loopback.repositorySearch(global.repo, "@type:Person AND (identifier:\"" + mbox + "\" OR username:\"" + mbox + "\")", {});
        if (people != null) {
            if (people.length >= 1)
                person = people[0];
        }
    }
    if (person != null) personCache[mbox] = person;
    return person;
}

var pkFromMbox = async function (xapiPerson) {
    var mboxes = getMbox.call(this, xapiPerson);
    let results = [];
    for (let mbox of mboxes) {
        if (mbox == null)
            continue;
        var person = await personFromEmail.call(this, mbox.mbox, mbox.name);
        if (person == null)
            continue;
        var pk = null;
        for (var i = 0; i < person.owner.length; i++)
            if (EcPk.fromPem(person.owner[i]).fingerprint() == person.getGuid())
                pk = EcPk.fromPem(person.owner[i]);
        if (pk != null)
            results.push(pk);
    }
    return results;
}

let alignedCompetenciesCache = {};
setInterval(function () {
    alignedCompetenciesCache = {};
}, 1000 * 60 * 60);
/**
 *  Resolves a language map to a single string, preferring en-US, then en,
 *  then the first available value. Returns null if the map is empty/null.
 */
var resolveLanguageMap = function (langMap) {
    if (langMap == null) return null;
    if (typeof langMap === "string") return langMap;
    if (typeof langMap !== "object") return null;
    if (langMap["en-US"] != null) return langMap["en-US"];
    if (langMap["en"] != null) return langMap["en"];
    var keys = Object.keys(langMap);
    if (keys.length > 0) return langMap[keys[0]];
    return null;
}

var getAlignedCompetencies = async function (objectId, xapiObject) {
    var results = [];
    if (alignedCompetenciesCache[objectId] != null)
        return alignedCompetenciesCache[objectId];
    let creativeWorks = await loopback.repositorySearch(global.repo, "@type:CreativeWork AND url:\"" + objectId + "\"", {});
    if (creativeWorks.length === 0 && objectId != null && objectId.startsWith("http")) {
        // No existing CreativeWork found for this xAPI object ID — create one with no alignments.
        let cw = new schema.CreativeWork();
        cw.assignId(global.repo.selectedServer, EcCrypto.md5(objectId));
        cw.url = objectId;
        let def = xapiObject?.definition;
        cw.name = resolveLanguageMap(def?.name);
        cw.description = resolveLanguageMap(def?.description);    
        cw.addOwner(EcPpk.fromPem(xapiMePpk).toPk());
        await repo.saveTo(cw, null, null, xapiIm);
        global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, "XapiCreateCreativeWork", objectId);
        if (process.env.XAPI_DEBUG) console.log("Created CreativeWork for xAPI object: " + objectId);
        creativeWorks = [cw];
    }
    if (process.env.XAPI_DEBUG) console.log("Found " + creativeWorks.length + " CreativeWorks for xAPI object: " + objectId);
    for (let creativeWork of creativeWorks) {
        if (creativeWork.educationalAlignment == null) continue;
        if (!EcArray.isArray(creativeWork.educationalAlignment))
            creativeWork.educationalAlignment = [creativeWork.educationalAlignment];
        for (var i = 0; i < creativeWork.educationalAlignment.length; i++)
            results.push(creativeWork.educationalAlignment[i]);
    }
    alignedCompetenciesCache[objectId] = results;
    return results;
}

/**
 *  Sets the subjects of an assertion. Makes a few assumptions: Owners of the
 *  object should be able to see and change the encrypted value. Owners and
 *  readers of the object should be persisted.
 *
 *  @param pk
 */
let setSubjects = global.setSubjects = async function (pks) {
    if (pks.length == 1) {
        await this.setSubject(pks[0]);
        return;
    }
    var owners = [];
    var readers = null;
    if (this.reader == null) readers = [];
    else readers = JSON.parse(JSON.stringify(this.reader));
    if (this.owner != null) owners = owners.concat(this.owner);
    for (let pk of pks) {
        EcArray.setAdd(readers, pk.toPem());
    }
    this.subject = (await EcEncryptedValue.encryptValue(
        JSON.stringify(pks.map((pk) => pk.toPem())),
        this.id,
        owners,
        readers
    ));
}
let getSubjects = global.getSubjects = async function () {
    if (this.subject == null) return null;
    var v = new EcEncryptedValue();
    v.copyFrom(this.subject);
    var codebook = Assertion.getCodebook(this);
    var decryptedString;
    if (codebook != null)
        decryptedString = await v
            .decryptIntoStringUsingSecret(codebook.subject)
            .catch((error) => null);
    else {
        decryptedString = await v
            .decryptIntoString(null, null, eim)
            .catch((error) => null);
    }
    if (decryptedString == null) return null;
    if (decryptedString.startsWith("["))
        return JSON.parse(decryptedString).map((str) => EcPk.fromPem(str));
    return EcPk.fromPem(decryptedString);
}

let defaultAuthority = null;
var xapiStatement = async function (s, accm) {
    if (s == null) return;
    if (EcArray.isArray(s))
        await Promise.map(s, async (st) => {
            await xapiStatement(st, accm);
        }, { concurrency: 1 });
    if (!EcObject.isObject(s)) return;
    if (s.result == null) return;
    var negative = false;
    if (s.result.success != null) {
        var scaled = 1.0;
        if (s.result.success == true)
            negative = false;
        else
            negative = true;
    } else if (s.result.score != null) {
        var scaled = s.result.score.scaled;
        if (scaled > 0.7)
            negative = false;
        else
            negative = true;
    } else if (s.result.response == "Pass") {
        var scaled = 1.0;
        negative = false;
    } else if (s.result.response == "Fail") {
        var scaled = 1.0;
        negative = true;
    } else if (s.result.response == "At Expectation") {
        var scaled = 1.0;
        negative = false;
    } else if (s.result.response == "Above Expectation") {
        var scaled = 1.0;
        negative = false;
    } else if (s.result.response == "Below Expectation") {
        var scaled = 1.0;
        negative = true;
    } else
        return;

    var actorPks = await pkFromMbox.call(this, s.actor);
    if (process.env.XAPI_DEBUG) console.log("Actor Pks: " + actorPks.length);
    if (actorPks.length == 0) return;
    var authorityPks = await pkFromMbox.call(this, s.authority);
    EcArray.setAdd(authorityPks, EcPpk.fromPem(xapiMePpk).toPk());
    if (process.env.XAPI_DEBUG) console.log("Authority Pks: " + authorityPks.length);
    if (authorityPks.length == 0) return;

    if (s.object == null) return;

    let alignedCompetencies = await getAlignedCompetencies.call(this, s.object.id, s.object);
    try{
    if (s?.object?.id != null && s?.object?.id.startsWith("http") && (await EcCompetency.get(EcRemoteLinkedData.trimVersionFromUrl(s?.object?.id), null, null, repo, xapiIm)) != null)
        alignedCompetencies.push({
            targetUrl: EcRemoteLinkedData.trimVersionFromUrl(s.object.id)
        });
    if (s?.object?.definition?.moreInfo != null && s?.object?.definition?.moreInfo.startsWith("http") && (await EcCompetency.get(EcRemoteLinkedData.trimVersionFromUrl(s?.object?.definition?.moreInfo))) != null)
        alignedCompetencies.push({
            targetUrl: EcRemoteLinkedData.trimVersionFromUrl(s?.object?.definition?.moreInfo)
        });
    } catch {}
    if (process.env.XAPI_DEBUG) console.log("Aligned Competencies: " + alignedCompetencies.length);
    let alreadyAligned = {};
    for (let i = 0; i < alignedCompetencies.length; i++) {
        let a = new EcAssertion();
        a.assignId(global.repo.selectedServer, EcCrypto.md5(s.id + alignedCompetencies[i].targetUrl));
        a.addOwner(EcPpk.fromPem(xapiMePpk).toPk());
        for (let authorityPk of authorityPks)
            await a.addOwner(authorityPk);
        for (let actorPk of actorPks) {
            await a.addReader(actorPk);
        }
        if (actorPks.length > 1) {
            let groupHash = actorPks.map(x => x.toPem()).sort().join("");
            let groupMd5 = EcCrypto.md5(groupHash);
            let groupPerson = personCache[groupMd5] || (await EcPerson.search(repo, `identifier:"${groupMd5}"`, null, null, repo, xapiIm))[0];
            if (groupPerson == null) {
                var ppk = await EcPpk.generateKey();
                groupPerson = new schema.Person();
                groupPerson.assignId(global.repo.selectedServer, ppk.toPk().fingerprint());
                groupPerson.identifier = groupMd5;
                await groupPerson.addOwner(ppk.toPk());
                await groupPerson.addOwner(EcPpk.fromPem(xapiMePpk).toPk());
                let theNames = (await Promise.all(actorPks.map((pk) => EcPerson.getByPk(repo, pk, null, null, xapiIm))));
                if (process.env.XAPI_DEBUG) console.log(theNames);
                groupPerson.name = theNames.map(x => x.name).filter(x => x).join(", ");
                if (groupPerson.name == "")
                    groupPerson.name = null;
                for (let authorityPk of authorityPks)
                    await groupPerson.addOwner(authorityPk);
                // for (let actorPk of actorPks)
                //     await groupPerson.addReader(actorPk);

                await repo.saveTo(groupPerson, null, null, xapiIm);
                global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, "XapiSavePerson");
            }
            if (groupPerson.name == null) {
                await repo.saveTo(groupPerson, null, null, xapiIm);
                global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, "XapiSavePerson");
            }
            personCache[groupMd5] = groupPerson;
            actorPks = [EcPk.fromPem(groupPerson.owner[0])];
            if (process.env.XAPI_DEBUG) console.log(groupPerson.shortId());
            await a.addReader(EcPk.fromPem(groupPerson.owner[0]));
        }
        global.events.person.assertionAbout.next(actorPks[0]);
        await a.setSubject(actorPks[0]);
        await a.setAgent(authorityPks[0]);
        a.competency = alignedCompetencies[i].targetUrl;
        a.framework = alignedCompetencies[i].educationalFramework;
        if (alreadyAligned[a.competency + a.framework] == true)
            continue;
        alreadyAligned[a.competency + a.framework] = true;
        await a.setEvidence([JSON.stringify(s)]);
        await a.setAssertionDate(new Date(s.timestamp).getTime() || new Date().getTime());
        await a.setNegative(negative);
        a.confidence = scaled;
        a.registration = s.context?.registration;
        if (accm != null)
            accm.push(a);
        else
            await EcRepository.save(a, (msg) => {
                global.events.person.assertionAbout.next(actorPks);
                global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, "XapiSaveAssertion", msg);
            }, (error) => {
                global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.ERROR, "XapiSaveAssertion", error);
            }, repo, xapiIm);
    }
}

var xapiStatementListener = async function () {
    let accm = [];
    if (process.env.XAPI_DEBUG) console.log(this.params, this.dataStreams, this?.ctx?.req?.rawHeaders, this?.ctx?.req?.headers);
    for (let val in this.dataStreams) {
        //Convert datastream to JSON if it is a string
        if (typeof this.dataStreams[val] === "string") {
            this.dataStreams[val] = JSON.parse(this.dataStreams[val]);
        }
        console.log(val, this.dataStreams[val], typeof this.dataStreams[val]);
        await xapiStatement(this.dataStreams[val], accm);
    }
    if (accm.length > 0) {
        console.log("Saving " + accm.length + " xAPI statements as assertions.");
        await global.repo.multiput(accm, null, null, xapiIm);
    }
}

var ident = new EcIdentity();
ident.displayName = "xAPI Adapter";
ident.ppk = EcPpk.fromPem(xapiMePpk);
let xapiIm = new EcIdentityManager();
EcIdentityManager.default.addIdentity(ident);
xapiIm.addIdentity(ident);
xapiKey = function () {
    return ident.ppk.toPk().toPem();
}


var xapiLoopEach = async function (since, config, sinceFilePath) {
    if (process.env.XAPI_DEBUG) console.log(since, config, sinceFilePath);
    try {
        var results = await xapiEndpoint.call(this, null, since, config);
    } catch (ex) { console.log(ex); return; }
    if (process.env.XAPI_DEBUG) console.log(results);
    let accm = [];
    while (results != null && results.statements != null && results.statements.length > 0) {
        let lastRequested = new Date().toISOString();
        for (var i = 0; i < results.statements.length; i++) {
            await xapiStatement.call(this, results.statements[i], accm);
        }
        fileSave(lastRequested, sinceFilePath);
        if (results.more != null && results.more != "")
            results = await xapiEndpoint.call(this, results.more, null, config);
        else
            results = {};

        if (accm > 500) {
            if (accm.length > 0) {
                console.log("Saving " + accm.length + " xAPI statements as assertions.");
                await global.repo.multiput(accm, null, null, xapiIm);
            }
            accm = [];
        }
    }
    if (accm.length > 0) {
        console.log("Saving " + accm.length + " xAPI statements as assertions.");
        await global.repo.multiput(accm, null, null, xapiIm);
    }
}

let openid = require('openid-client');
var xapiLoop = async function () {
    let tokenSet = null;
    if (process.env.OIDC_CLIENT_ENDPOINT != null) {
        const oidcIssuer = await openid.Issuer.discover(process.env.OIDC_CLIENT_ENDPOINT);
        if (process.env.XAPI_DEBUG) console.log('Discovered issuer %s %O', oidcIssuer.issuer, oidcIssuer.metadata);
        const client = new oidcIssuer.Client({
            client_id: process.env.OIDC_CLIENT_CLIENT_ID,
            client_secret: process.env.OIDC_CLIENT_CLIENT_SECRET,
            redirect_uris: [process.env.OIDC_CLIENT_REDIRECT_URI],
            response_types: [process.env.OIDC_CLIENT_RESPONSE_TYPE || "code"],
            // id_token_signed_response_alg (default "RS256")
            // token_endpoint_auth_method (default "client_secret_basic")
        }); // => Client

        tokenSet = await client.grant({
            resource: 'urn:example:third-party-api',
            grant_type: 'client_credentials'
        });
        if (process.env.XAPI_DEBUG) console.log(tokenSet);
    }

    var ident = new EcIdentity();
    ident.displayName = "xAPI Adapter";
    ident.ppk = EcPpk.fromPem(xapiMePpk);
    EcIdentityManager.default.addIdentity(ident);
    var sinceFilePath = "etc/adapter.xapi.since.txt";
    var since = null;
    let config = [];
    for (let key in process.env) {
        if (key.startsWith("XAPI_CONFIG_")) {
            config.push(JSON.parse(process.env[key]));
            if (process.env.OIDC_CLIENT_ENDPOINT != null) {
                config[config.length - 1].xapiAuth = tokenSet.token_type + " " + tokenSet.access_token;
            }
        }
    }
    if (fileExists(sinceFilePath)) {
        since = fileLoad(sinceFilePath);
        since = fileToString(since);
    }
    for (let each in config) {
        await xapiLoopEach.call(this, since, config[each], sinceFilePath);
    }
    if (!config || config.length === 0) {
        await xapiLoopEach.call(this, since, null, sinceFilePath);
    }

}

const rxjs = require('rxjs');
events.server.xapiTick = new rxjs.interval(5000);
let working = false;
events.server.xapiTick.subscribe(async () => {
    if (working) return;
    try {
        working = true;
        await xapiLoop.call(this);
    } catch (ex) {
        console.error("Error in xAPI loop: ", ex);
    }
    finally {
        working = false;
    }
});

if (!global.disabledAdapters['xapi']) {
    /**
     * @openapi
     * /api/xapi/tick:
     *   post:
     *     x-mcp-ignore: true
     *     tags:
     *       - xAPI Adapter
     *     summary: Manually trigger one xAPI polling cycle
     *     description: |
     *       Runs a single iteration of the xAPI statement polling loop,
     *       fetching new statements from the configured LRS and converting
     *       them into CaSS assertions. Normally this runs automatically
     *       every 5 seconds.
     *     responses:
     *       200:
     *         description: Polling cycle completed.
     */
    bindWebService("/xapi/tick", xapiLoop);

    /**
     * @openapi
     * /api/xapi/pk:
     *   get:
     *     x-mcp-ignore: true
     *     tags:
     *       - xAPI Adapter
     *     summary: Get the xAPI adapter public key
     *     description: Returns the PEM-encoded public key used by the xAPI adapter for assertion ownership.
     *     responses:
     *       200:
     *         description: PEM-encoded public key string.
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     */
    bindWebService("/xapi/pk", xapiKey);

    /**
     * @openapi
     * /api/xapi/statement:
     *   post:
     *     tags:
     *       - xAPI Adapter
     *     summary: Receive a single xAPI statement and convert to CaSS assertions
     *     x-mcp-tool-name: record_evidence
     *     x-mcp-description: >
     *       Record evidence of a person's performance and convert it into
     *       competency claims. This endpoint accepts an xAPI statement (a
     *       standardized record of a learning experience) and automatically
     *       creates encrypted competency assertions in the CaSS repository.
     *       WHAT THIS DOES - An xAPI statement says "a person did something
     *       and here is the outcome". CaSS converts that into "this person
     *       does or does not possess this competency" by looking up which
     *       competencies are aligned to the activity. The pipeline is (1)
     *       the actor field identifies WHO - resolved to a CaSS Person via
     *       email or account name, created automatically if not found, (2)
     *       the object.id identifies WHAT - matched against CaSS CreativeWork
     *       URLs to find educationalAlignment entries linking to competencies,
     *       or used directly if it is itself a competency URL, (3) the result
     *       determines the OUTCOME - positive or negative assertion based on
     *       success, score, or text response, (4) one encrypted Assertion is
     *       created per aligned competency, owned by the authority and readable
     *       by the actor.
     *       HOW TO DETERMINE POSITIVE vs NEGATIVE - CaSS checks result fields
     *       in this priority order - result.success true means positive and
     *       false means negative, result.score.scaled greater than 0.7 means
     *       positive and 0.7 or below means negative, result.response of Pass
     *       or At Expectation or Above Expectation means positive and Fail or
     *       Below Expectation means negative. You must provide at least one of
     *       these three fields or the statement will be silently ignored.
     *       REQUIRED FIELDS - actor (with mbox or account.name), verb (with id),
     *       object (with id), and result (with success, score.scaled, or response).
     *       IMPORTANT - The statement must be sent as multipart/form-data. The
     *       form field name does not matter - CaSS processes all attached data
     *       streams. Send the JSON statement as the value of any named field.
     *     x-mcp-hints: >
     *       MINIMAL COMPLETE EXAMPLE - To record that jane.doe passed a quiz
     *       and should be credited with competency, send this JSON as a
     *       multipart/form-data field named "statement" -
     *       {"actor":{"mbox":"mailto:jane.doe@example.com","name":"Jane Doe"},
     *       "verb":{"id":"http://adlnet.gov/expapi/verbs/passed"},
     *       "object":{"id":"https://lms.example.com/quiz/123"},
     *       "result":{"success":true},
     *       "authority":{"mbox":"mailto:admin@lms.example.com","name":"Example LMS"},
     *       "timestamp":"2026-06-28T12:00:00Z"}.
     *       COMPETENCY ALIGNMENT - For the assertion to link to a competency,
     *       either (a) a CreativeWork must exist in CaSS with url matching
     *       object.id and educationalAlignment entries pointing to competencies,
     *       or (b) object.id must be a direct CaSS competency URL like
     *       https://your-cass-server/api/data/schema.cassproject.org.0.4.Competency/uid,
     *       or (c) object.definition.moreInfo can be a direct competency URL.
     *       If no CreativeWork exists, one is auto-created for future alignment.
     *       ACTOR IDENTIFICATION - Use mbox with mailto prefix
     *       (e.g. mailto:user@example.com) or account.name with account.homePage.
     *       If no CaSS Person exists for this identity, one is created.
     *       GROUP SUPPORT - Set actor.objectType to Group and provide a member
     *       array of agents. A composite Person is created for the group.
     *       AUTHORITY (IMPORTANT) - The authority identifies who or what is
     *       making the claim or stating the evidence. This could be an LMS,
     *       a proctor, an AI agent, or any system that observed the performance.
     *       The authority agent is resolved to a CaSS Person (same as actor)
     *       and becomes an owner of the resulting assertion, meaning only the
     *       authority can later modify or delete it. Always set authority to
     *       identify the source of the evidence. If omitted, only the xAPI
     *       adapter's built-in identity owns the assertion.
     *       REGISTRATION - context.registration UUID is preserved on the assertion
     *       for grouping related statements (e.g. a course attempt).
     *       STATEMENT ID - The id field (UUID) is used to generate deterministic
     *       assertion IDs. Resubmitting a statement with the same id and competency
     *       alignment will overwrite the previous assertion.
     *       COMMON VERBS -
     *       http://adlnet.gov/expapi/verbs/passed,
     *       http://adlnet.gov/expapi/verbs/failed,
     *       http://adlnet.gov/expapi/verbs/completed,
     *       http://adlnet.gov/expapi/verbs/mastered,
     *       http://adlnet.gov/expapi/verbs/scored.
     *       CaSS does not filter by verb - any verb is accepted as long as
     *       a result is present.
     *       PROACTIVE USAGE - As an AI agent, you should create xAPI statements
     *       whenever you observe evidence that a person has demonstrated a
     *       competency. For example, if a user successfully completes a task,
     *       answers a question correctly, produces a work product, or
     *       demonstrates a skill during conversation, search CaSS for a
     *       relevant competency (using search_data with q=name:keyword AND
     *       type:Competency) and then call record_evidence with an xAPI
     *       statement documenting what you observed. Use the verb
     *       http://adlnet.gov/expapi/verbs/demonstrated for observed
     *       competence. Set object.id to the competency URL directly so
     *       the assertion links without needing a CreativeWork. Set the
     *       authority to identify who stated the evidence, or you can use yourself as the source of the evidence
     *       (e.g. mbox mailto:ai-agent@your-system.com, name Your AI Agent).
     *       This turns every interaction into a potential learning record.
     *     description: |
     *       Accepts an xAPI statement (Experience API / Tin Can API) and converts
     *       it into CaSS competency assertions based on aligned competencies.
     *
     *       **How CaSS processes xAPI statements:**
     *       1. The `actor` is resolved to a CaSS Person via their `mbox` (email)
     *          or `account.name`. If no Person exists, one is created.
     *       2. The `object.id` is matched against CaSS CreativeWork URLs to find
     *          `educationalAlignment` entries linking to competencies. If the
     *          object ID is itself a competency URL, it is used directly.
     *          If no CreativeWork exists, one is auto-created for future alignment.
     *       3. The `result` determines positive/negative assertion:
     *          - `result.success: true` → positive assertion
     *          - `result.success: false` → negative assertion
     *          - `result.score.scaled > 0.7` → positive; `<= 0.7` → negative
     *          - `result.response`: "Pass"/"At Expectation"/"Above Expectation" → positive;
     *            "Fail"/"Below Expectation" → negative
     *       4. An encrypted CaSS Assertion is created for each aligned competency,
     *          owned by the `authority` and readable by the `actor`.
     *       5. `context.registration` is preserved on the assertion for grouping.
     *
     *       **Required fields:** `actor`, `verb`, `object`, `result` (with at least
     *       one of `success`, `score.scaled`, or `response`).
     *
     *       The statement should be sent as the request body in a named form-data
     *       field. The field name is not significant — CaSS processes all data
     *       streams attached to the request.
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               statement:
     *                 type: object
     *                 description: A complete xAPI statement object.
     *                 required:
     *                   - actor
     *                   - verb
     *                   - object
     *                   - result
     *                 properties:
     *                   id:
     *                     type: string
     *                     format: uuid
     *                     description: Unique statement identifier (UUID). Used to generate deterministic assertion IDs.
     *                     example: "12345678-1234-1234-1234-123456789012"
     *                   actor:
     *                     type: object
     *                     description: |
     *                       The learner or group who performed the activity.
     *                       CaSS resolves the actor to a Person record via `mbox` (mailto: email)
     *                       or `account.name`. If objectType is "Group", each member is resolved
     *                       individually and a composite Person is created.
     *                     properties:
     *                       objectType:
     *                         type: string
     *                         enum: [Agent, Group]
     *                         default: Agent
     *                       name:
     *                         type: string
     *                         description: Display name of the actor.
     *                         example: "Jane Doe"
     *                       mbox:
     *                         type: string
     *                         description: "mailto: URI of the actor's email. Primary identifier for Person lookup."
     *                         example: "mailto:jane.doe@example.com"
     *                       account:
     *                         type: object
     *                         description: Alternative identifier when mbox is unavailable.
     *                         properties:
     *                           homePage:
     *                             type: string
     *                             example: "https://lms.example.com"
     *                           name:
     *                             type: string
     *                             description: Account username or ID. Used as Person identifier lookup.
     *                             example: "jdoe123"
     *                       member:
     *                         type: array
     *                         description: Group members (only when objectType is "Group").
     *                         items:
     *                           type: object
     *                           properties:
     *                             name:
     *                               type: string
     *                             mbox:
     *                               type: string
     *                   verb:
     *                     type: object
     *                     description: |
     *                       The action performed. CaSS does not filter by verb —
     *                       any verb is accepted as long as a result is present.
     *                       Common xAPI verbs include completed, passed, failed, scored, mastered.
     *                     properties:
     *                       id:
     *                         type: string
     *                         format: uri
     *                         description: IRI identifying the verb.
     *                         example: "http://adlnet.gov/expapi/verbs/completed"
     *                       display:
     *                         type: object
     *                         description: Human-readable verb name as a language map.
     *                         properties:
     *                           en-US:
     *                             type: string
     *                             example: "completed"
     *                   object:
     *                     type: object
     *                     description: |
     *                       The activity or competency the statement is about.
     *                       `object.id` is matched against CaSS CreativeWork URLs to find
     *                       competency alignments. If object.id is itself a competency URL
     *                       in CaSS, it is used directly. `object.definition.moreInfo` is
     *                       also checked as a secondary competency URL.
     *                     required:
     *                       - id
     *                     properties:
     *                       id:
     *                         type: string
     *                         format: uri
     *                         description: |
     *                           IRI identifying the activity. This is matched against
     *                           CreativeWork.url in CaSS to find aligned competencies.
     *                           Can also be a direct CaSS competency URL.
     *                         example: "https://lms.example.com/courses/cybersecurity-101/quiz-3"
     *                       objectType:
     *                         type: string
     *                         default: Activity
     *                       definition:
     *                         type: object
     *                         properties:
     *                           name:
     *                             type: object
     *                             description: Language map for activity name.
     *                             properties:
     *                               en-US:
     *                                 type: string
     *                                 example: "Cybersecurity 101 - Quiz 3"
     *                           description:
     *                             type: object
     *                             description: Language map for activity description.
     *                             properties:
     *                               en-US:
     *                                 type: string
     *                                 example: "Assessment of basic cybersecurity concepts"
     *                           moreInfo:
     *                             type: string
     *                             format: uri
     *                             description: |
     *                               Secondary URL checked as a direct competency URL in CaSS.
     *                               Use this to explicitly link a statement to a CaSS competency.
     *                   result:
     *                     type: object
     *                     description: |
     *                       The outcome of the activity. At least one of `success`,
     *                       `score`, or `response` is required for CaSS to create an assertion.
     *                       Determines whether the assertion is positive or negative.
     *                     properties:
     *                       success:
     *                         type: boolean
     *                         description: "true = positive assertion, false = negative assertion."
     *                         example: true
     *                       score:
     *                         type: object
     *                         description: Numeric score. `scaled > 0.7` = positive, `<= 0.7` = negative.
     *                         properties:
     *                           scaled:
     *                             type: number
     *                             minimum: 0
     *                             maximum: 1
     *                             description: "Normalized score between 0 and 1. Threshold is 0.7."
     *                             example: 0.85
     *                           raw:
     *                             type: number
     *                             description: Raw score value.
     *                             example: 85
     *                           min:
     *                             type: number
     *                             example: 0
     *                           max:
     *                             type: number
     *                             example: 100
     *                       response:
     *                         type: string
     *                         description: |
     *                           Text response. Recognized values:
     *                           - "Pass", "At Expectation", "Above Expectation" → positive
     *                           - "Fail", "Below Expectation" → negative
     *                         enum: [Pass, Fail, At Expectation, Above Expectation, Below Expectation]
     *                       completion:
     *                         type: boolean
     *                         description: Whether the activity was completed (informational, not used for assertion logic).
     *                   context:
     *                     type: object
     *                     description: Context for the statement. `registration` UUID is preserved on the assertion.
     *                     properties:
     *                       registration:
     *                         type: string
     *                         format: uuid
     *                         description: UUID grouping related statements (e.g., a course attempt). Stored on the assertion.
     *                         example: "ec531277-b9b7-4700-a81d-1a43e3be340e"
     *                   authority:
     *                     type: object
     *                     description: |
     *                       The agent asserting the truth of the statement (e.g., the LMS).
     *                       Resolved to a CaSS Person via mbox/account, same as actor.
     *                       The authority becomes an owner of the resulting assertion.
     *                     properties:
     *                       objectType:
     *                         type: string
     *                         default: Agent
     *                       name:
     *                         type: string
     *                         example: "LMS System"
     *                       mbox:
     *                         type: string
     *                         example: "mailto:admin@lms.example.com"
     *                   timestamp:
     *                     type: string
     *                     format: date-time
     *                     description: ISO 8601 timestamp of when the experience occurred. Used as the assertion date.
     *                     example: "2026-06-28T12:00:00Z"
     *           example:
     *             statement:
     *               id: "12345678-1234-1234-1234-123456789012"
     *               actor:
     *                 objectType: "Agent"
     *                 name: "Jane Doe"
     *                 mbox: "mailto:jane.doe@example.com"
     *               verb:
     *                 id: "http://adlnet.gov/expapi/verbs/passed"
     *                 display:
     *                   en-US: "passed"
     *               object:
     *                 id: "https://lms.example.com/courses/cybersecurity-101/final-exam"
     *                 objectType: "Activity"
     *                 definition:
     *                   name:
     *                     en-US: "Cybersecurity 101 Final Exam"
     *                   description:
     *                     en-US: "Final assessment for the Cybersecurity 101 course"
     *               result:
     *                 success: true
     *                 score:
     *                   scaled: 0.92
     *                   raw: 92
     *                   min: 0
     *                   max: 100
     *                 completion: true
     *               context:
     *                 registration: "ec531277-b9b7-4700-a81d-1a43e3be340e"
     *               authority:
     *                 objectType: "Agent"
     *                 name: "Example LMS"
     *                 mbox: "mailto:admin@lms.example.com"
     *               timestamp: "2026-06-28T12:00:00Z"
     *     responses:
     *       200:
     *         description: Statement processed and assertions created for each aligned competency.
     */
    bindWebService("/xapi/statement", xapiStatementListener);

    /**
     * @openapi
     * /api/xapi/statements:
     *   post:
     *     x-mcp-ignore: true
     *     tags:
     *       - xAPI Adapter
     *     summary: Receive multiple xAPI statements
     *     description: |
     *       Accepts multiple xAPI statements via POST and converts them into
     *       CaSS assertions based on aligned competencies. Statements should
     *       be sent as form data.
     *     requestBody:
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *     responses:
     *       200:
     *         description: Statements processed and assertions created.
     */
    bindWebService("/xapi/statements", xapiStatementListener);

    /**
     * @openapi
     * /api/xapi/endpoint:
     *   get:
     *     x-mcp-ignore: true
     *     tags:
     *       - xAPI Adapter
     *     summary: Proxy-fetch statements from the configured LRS
     *     description: |
     *       Fetches xAPI statements from the configured Learning Record Store
     *       endpoint. Used for debugging and manual inspection of the xAPI
     *       data source. Requires XAPI_ENDPOINT to be configured.
     *     responses:
     *       200:
     *         description: xAPI statements from the LRS.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    bindWebService("/xapi/endpoint", xapiEndpoint);
}
