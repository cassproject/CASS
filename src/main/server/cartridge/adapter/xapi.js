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
var getAlignedCompetencies = async function (objectId) {
    var results = [];
    if (alignedCompetenciesCache[objectId] != null)
        return alignedCompetenciesCache[objectId];
    let creativeWorks = await loopback.repositorySearch(global.repo, "@type:CreativeWork AND url:\"" + objectId + "\"", {});
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

    let alignedCompetencies = await getAlignedCompetencies.call(this, s.object.id);
    if (s?.object?.id != null && s?.object?.id.startsWith("http") && (await EcCompetency.get(EcRemoteLinkedData.trimVersionFromUrl(s?.object?.id), null, null, repo, xapiIm)) != null)
        alignedCompetencies.push({
            targetUrl: EcRemoteLinkedData.trimVersionFromUrl(s.object.id)
        });
    if (s?.object?.definition?.moreInfo != null && s?.object?.definition?.moreInfo.startsWith("http") && (await EcCompetency.get(EcRemoteLinkedData.trimVersionFromUrl(s?.object?.definition?.moreInfo))) != null)
        alignedCompetencies.push({
            targetUrl: EcRemoteLinkedData.trimVersionFromUrl(s?.object?.definition?.moreInfo)
        });
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
            EcRepository.save(a, (msg) => {
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
        console.log(val, this.dataStreams[val]);
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
     *     summary: Receive a single xAPI statement
     *     description: |
     *       Accepts an xAPI statement via POST and converts it into CaSS
     *       assertions based on aligned competencies. The statement should
     *       be sent as form data.
     *     requestBody:
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *     responses:
     *       200:
     *         description: Statement processed and assertions created.
     */
    bindWebService("/xapi/statement", xapiStatementListener);

    /**
     * @openapi
     * /api/xapi/statements:
     *   post:
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
