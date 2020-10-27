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

var xapiEndpoint = function (more, since) {
    var endpoint = xapiConfig.call(this).xapiEndpoint + "statements?format=exact&limit=0";
    if (since != null)
        endpoint = xapiConfig.call(this).xapiEndpoint + "statements?format=exact&limit=0&since=" + since;
    if (more != null)
        endpoint = xapiConfig.call(this).xapiEndpoint + more;
    var headers = {};
    headers["Authorization"] = xapiConfig.call(this).xapiAuth;
    headers["X-Experience-API-Version"] = "1.0.1";
    return httpGet(endpoint,false, headers);
}
bindWebService("/xapi/endpoint", xapiEndpoint);

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

var personFromEmail = function (mbox) {
    if (mbox == null) return null;
    var person = null;
    mbox = mbox.replace("mailto:", "");
    if (mbox.indexOf("@") != -1)
        repo.search("@type:Person AND email:\"" + mbox + "\"", function (person) {}, function (people) {
            if (people.length == 1)
                person = people[0];
            else if (people.length > 1)
                console.error("Cannot generate xAPI statements for " + mbox + " -- too many people with that email.");
        }, console.error);
    else
        repo.search("@type:Person AND identifier:\"" + mbox + "\"", function (person) {}, function (people) {
            if (people.length == 1)
                person = people[0];
            else if (people.length > 1)
                console.error("Cannot generate xAPI statements for " + mbox + " -- too many people with that identifier.");
        }, console.error);
    return person;
}

var pkFromMbox = function (xapiPerson) {
    var mbox = getMbox.call(this, xapiPerson);
    if (mbox == null)
        return null;
    var person = personFromEmail.call(this, mbox);
    if (person == null)
        return null;
    var pk = null;
    for (var i = 0; i < person.owner.length; i++)
        if (EcPk.fromPem(person.owner[i]).fingerprint() == person.getGuid())
            pk = EcPk.fromPem(person.owner[i]);
    return pk;
}

var getAlignedCompetencies = function (objectId) {
    var results = [];
    repo.search("@type:CreativeWork AND url:\"" + objectId + "\"", function (creativeWork) {
            if (creativeWork.educationalAlignment == null) return;
            if (!EcArray.isArray(creativeWork.educationalAlignment))
                creativeWork.educationalAlignment = [creativeWork.educationalAlignment];
            for (var i = 0; i < creativeWork.educationalAlignment.length; i++)
                results.push(creativeWork.educationalAlignment[i]);
        },
        function (creativeWorks) {}, console.error);
    return results;
}

var xapiStatement = function (s) {
    if (s == null) return;
    if (EcObject.isArray(s))
        for (var i = 0;i < s.length;i++)
            xapiStatement(s[i]);
    if (!EcObject.isObject(s)) return;
    if (s.result == null) return;
    var negative = false;
    if (s.result.score != null) {
        var scaled = s.result.score.scaled;
        if (scaled > 0.7)
            negative = false;
        else
            negative = true;
    } else if (s.result.success != null) {
        var scaled = 1.0;
        if (s.result.success == true)
            negative = false;
        else
            negative = true;
    } else
        return;

    var actorPk = pkFromMbox.call(this, s.actor);
    if (actorPk == null) return;
    var authorityPk = pkFromMbox.call(this, s.authority);
    if (authorityPk == null)
        authorityPk = EcPpk.fromPem(xapiMePpk).toPk();
    if (authorityPk == null) return;

    if (s.object == null) return;
    
    var alignedCompetencies = getAlignedCompetencies.call(this, s.object.id);
    var alreadyAligned = {};
    for (var i = 0; i < alignedCompetencies.length; i++) {
        var a = new EcAssertion();
        a.assignId(repo.selectedServer, EcCrypto.md5(s.id+alignedCompetencies[i].targetUrl));
        a.addOwner(EcPpk.fromPem(xapiMePpk).toPk());
        a.addOwner(authorityPk);
        a.setSubject(actorPk);
        a.setAgent(authorityPk);
        a.competency = alignedCompetencies[i].targetUrl;
        a.framework = alignedCompetencies[i].educationalFramework;
        if (alreadyAligned[a.competency + a.framework] == true)
            continue;
        alreadyAligned[a.competency + a.framework] = true;
        a.setEvidence([JSON.stringify(s)]);
        a.setAssertionDate(date(s.timestamp, null, true));
        a.setNegative(negative);
        a.confidence = scaled;
        EcRepository.save(a, console.log, console.error);
    }
}

var xapiStatementListener = function () {
    var data = fileFromDatastream.call(this);
    data = fileToString(data.get(0));
    data = JSON.parse(data);
    xapiStatement(data);
}

var ident = new EcIdentity();
ident.displayName = "xAPI Adapter";
ident.ppk = EcPpk.fromPem(xapiMePpk);
EcIdentityManager.addIdentity(ident);
xapiKey = function () {
    return ident.ppk.toPk().toPem();
}
bindWebService("/xapi/pk", xapiKey);
bindWebService("/xapi/statement", xapiStatementListener);

var xapiLoop = function () {
    var ident = new EcIdentity();
    ident.displayName = "xAPI Adapter";
    ident.ppk = EcPpk.fromPem(xapiMePpk);
    EcIdentityManager.addIdentity(ident);
    var sinceFilePath = "etc/adapter.xapi.since.txt";
    var since = null;
    if (fileExists(sinceFilePath)) {
        since = fileLoad(sinceFilePath);
        since = fileToString(since);
    }
    var results = xapiEndpoint.call(this, null, since);
    while (results.statements != null && results.statements.length > 0) {
        for (var i = 0; i < results.statements.length; i++) {
            xapiStatement.call(this, results.statements[i]);
        }
        fileSave(date(null, "yyyy-MM-dd'T'HH:mm:ssXXX"), sinceFilePath);
        if (results.more != null && results.more != "")
            results = xapiEndpoint.call(this, results.more, null);
        else
            results = {};
    }
}
bindWebService("/xapi/tick", xapiLoop);
