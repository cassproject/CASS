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
        }),xapiConfigFilePath);
    this.xapiConfig = JSON.parse(fileToString(fileLoad(xapiConfigFilePath)));
    return this.xapiConfig;
}
var xapiConfigAutoExecute = xapiConfig;

var xapiEndpoint = async function (more, since, config) {
    var endpoint;
    if (config) {
        endpoint = config.xapiEndpoint + "statements?format=exact&limit=0";
    } else {
        endpoint = xapiConfig.call(this).xapiEndpoint + "statements?format=exact&limit=0";
    }
    if (since != null)
        endpoint += "&since=" + since;
    if (more != null)
        endpoint += more;
    var headers = {};
    if (config) {
        headers["Authorization"] = config.xapiAuth;
    } else {
        headers["Authorization"] = xapiConfig.call(this).xapiAuth;
    }
    headers["X-Experience-API-Version"] = "1.0.1";
    return await httpGet(endpoint,false, headers);
}

var getMbox = function (agentObject) {
    if (agentObject == null)
        return null;
    if (EcArray.isArray(agentObject))
        agentObject = agentObject[0];
    var email = agentObject.mbox;
    if (email != null)
        return email;
    if (agentObject.account != null)
        return agentObject.account.name;
    return null;
}

let personCache = {};
setInterval(function () {
    personCache = {};
}, 1000 * 60 * 60);
var personFromEmail = async function (mbox) {
    if (mbox == null) return null;
    if (personCache[mbox] != null) return personCache[mbox];
    var person = null;
    mbox = mbox.replace("mailto:", "");
    if (mbox.indexOf("@") != -1)
    {
        let people = null;
        people = await loopback.repositorySearch(global.repo,"@type:Person AND email:\"" + mbox + "\"",{});
        if (people != null) {
            if (people.length >= 1)
                person = people[0];
        }
    }
    else
    {
        let people = null;
        people = await loopback.repositorySearch(global.repo,"@type:Person AND (identifier:\"" + mbox + "\" OR username:\"" + mbox + "\")",{});
        if (people != null) {
            if (people.length >= 1)
                person = people[0];
        }
    }
    if (person != null) personCache[mbox] = person;
    return person;
}

var pkFromMbox = async function (xapiPerson) {
    var mbox = getMbox.call(this, xapiPerson);
    if (mbox == null)
        return null;
    var person = await personFromEmail.call(this, mbox);
    if (person == null)
        return null;
    var pk = null;
    for (var i = 0; i < person.owner.length; i++)
        if (EcPk.fromPem(person.owner[i]).fingerprint() == person.getGuid())
            pk = EcPk.fromPem(person.owner[i]);
    return pk;
}

let alignedCompetenciesCache = {};
setInterval(function () {
    alignedCompetenciesCache = {};
}, 1000 * 60 * 60);
var getAlignedCompetencies = async function (objectId) {
    var results = [];
    if (alignedCompetenciesCache[objectId] != null)
        return alignedCompetenciesCache[objectId];
    let creativeWorks = await loopback.repositorySearch(global.repo,"@type:CreativeWork AND url:\"" + objectId + "\"",{});
    for (let creativeWork of creativeWorks)
    {
        if (creativeWork.educationalAlignment == null) continue;
        if (!EcArray.isArray(creativeWork.educationalAlignment))
            creativeWork.educationalAlignment = [creativeWork.educationalAlignment];
        for (var i = 0; i < creativeWork.educationalAlignment.length; i++)
            results.push(creativeWork.educationalAlignment[i]);
    }
    alignedCompetenciesCache[objectId] = results;
    return results;
}

let defaultAuthority = null;
var xapiStatement = async function (s,accm) {
    if (s == null) return;
    if (EcArray.isArray(s))
        for (let st of s)
            await xapiStatement(st,accm);
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
    } else
        return;

    var actorPk = await pkFromMbox.call(this, s.actor);
    if (actorPk == null)
    {
        var ppk = await EcPpk.generateKey();
        var person = new schema.Person();
        person.assignId(global.repo.selectedServer,ppk.toPk().fingerprint());
        person.addOwner(ppk.toPk());
		var mb = getMbox.call(this, s.actor).replace("mailto:","");
        if (mb.indexOf("@") == -1)
            person.username = mb;
        else
            person.email = mb;
        person.name = s.actor.name;
        await EcRepository.save(person, (msg) => {
            global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, "XapiSavePerson", msg);
        }, (error) => {
            global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.ERROR, "XapiSavePerson", error);
        });
        actorPk = ppk.toPk();
    }
    if (actorPk == null) return;
    var authorityPk = await pkFromMbox.call(this, s.authority);
    if (authorityPk == null)
    {
        let ppk = EcPpk.fromPem(xapiMePpk);
        var person = new schema.Person();
        person.assignId(global.repo.selectedServer,ppk.toPk().fingerprint());
        person.addOwner(ppk.toPk());
        var mb = getMbox.call(this, s.authority);
        if (mb != null) mb = mb.replace("mailto:","");
        if (mb == null) 
        {
            mb = "Some Authority";
            if (defaultAuthority == null)
            {
                defaultAuthority = person;
                if (mb.indexOf("@") == -1)
                    person.username = mb;
                else
                    person.email = mb;
                person.name = (s.authority != null ? s.authority.name : null) || mb;
                await EcRepository.save(person, (msg) => {
                    global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, "XapiSavePerson", msg);
                }, (error) => {
                    global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.ERROR, "XapiSavePerson", error);
                });
            }
        }
        else
        {
            if (mb.indexOf("@") == -1)
                person.username = mb;
            else
                person.email = mb;
            person.name = (s.authority != null ? s.authority.name : null) || mb;
            await EcRepository.save(person, (msg) => {
                global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, "XapiSavePerson", msg);
            }, (error) => {
                global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.ERROR, "XapiSavePerson", error);
            });
        }
        authorityPk = ppk.toPk();
    }
    if (authorityPk == null) 
        return;
    if (s.object == null) 
        return;
    var alignedCompetencies = await getAlignedCompetencies.call(this, s.object.id);
    var alreadyAligned = {};
    for (var i = 0; i < alignedCompetencies.length; i++) {
        var a = new EcAssertion();
        a.assignId(global.repo.selectedServer, EcCrypto.md5(s.id+alignedCompetencies[i].targetUrl));
        a.addOwner(EcPpk.fromPem(xapiMePpk).toPk());
        a.addOwner(authorityPk);
        a.addOwner(EcPk.fromPem(skyrepoAdminPk()));
        a.addReader(actorPk);
        await a.setSubject(actorPk);
        await a.setAgent(authorityPk);
        a.competency = alignedCompetencies[i].targetUrl;
        a.framework = alignedCompetencies[i].educationalFramework;
        if (alreadyAligned[a.competency + a.framework] == true)
            continue;
        alreadyAligned[a.competency + a.framework] = true;
        await a.setEvidence([JSON.stringify(s)]);
        await a.setAssertionDate(new Date(s.timestamp).getTime() || new Date().getTime());
        await a.setNegative(negative);
        a.confidence = scaled;
        if (accm != null)
            accm.push(a);
        else
            EcRepository.save(a, (msg) => {
                global.person?.assertionAbout.next(actorPk);
                global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, "XapiSaveAssertion", msg);
            }, (error) => {
                global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.ERROR, "XapiSaveAssertion", error);
            });
    }
}

var xapiStatementListener = async function () {
    let accm = [];
    for (let val in this.dataStreams)
        await xapiStatement(this.dataStreams[val],accm);
    await global.repo.multiput(accm);
}

var ident = new EcIdentity();
ident.displayName = "xAPI Adapter";
ident.ppk = EcPpk.fromPem(xapiMePpk);
EcIdentityManager.default.addIdentity(ident);
xapiKey = function () {
    return ident.ppk.toPk().toPem();
}


var xapiLoopEach = async function(since, config, sinceFilePath) {
    try
    {
        var results = await xapiEndpoint.call(this, null, since, config);
    } catch (ex) { 
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.ERROR, 'xAPILoopEach', ex);
        return; 
    }
    while (results != null && results.statements != null && results.statements.length > 0) {
        for (var i = 0; i < results.statements.length; i++) {
            await xapiStatement.call(this, results.statements[i]);
        }
        fileSave(new Date().toISOString(), sinceFilePath);
        if (results.more != null && results.more != "")
            results = await xapiEndpoint.call(this, results.more, null, config);
        else
            results = {};
    }
}

let openid = require('openid-client');
var xapiLoop = async function () {
    let tokenSet = null;
    if (process.env.OIDC_CLIENT_ENDPOINT != null) {
        const oidcIssuer = await openid.Issuer.discover(process.env.OIDC_CLIENT_ENDPOINT);
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.NOTICE, 'xAPILoop', 'Discovered issuer %s %O', oidcIssuer.issuer, oidcIssuer.metadata);

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

        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'xAPIOIDCAuth', tokenSet);
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

if (!global.disabledAdapters['xapi']) {
    bindWebService("/xapi/tick", xapiLoop);
    bindWebService("/xapi/pk", xapiKey);
    bindWebService("/xapi/statement", xapiStatementListener);
    bindWebService("/xapi/statements", xapiStatementListener);
    bindWebService("/xapi/endpoint", xapiEndpoint);
}
