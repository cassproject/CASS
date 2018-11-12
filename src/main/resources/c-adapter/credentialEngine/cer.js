var navigator = {};
var loadedCer = false;

registerElementWithCer = function (element, boolDelete) {
    if (!loadedCer)
        load("https://cdnjs.cloudflare.com/ajax/libs/jsrsasign/8.0.4/jsrsasign-all-min.js");
    loadedCer = true;
    var sHeader = JSON.stringify({
        alg: 'RS256',
        typ: 'JWT'
    });
    var prvKey = KEYUTIL.getKey(EcPpk.fromPem(keyFor("adapter.cer.private")).toPkcs8Pem());

    var e = new EcRemoteLinkedData();
    e.copyFrom(element);

    var ceGuid = e.getGuid();
    if (e["ceterms:ctid"] != null)
        ceGuid = e["ceterms:ctid"]
    else
        ceGuid = "ce-" + ceGuid;
    var envelopeGuid = ceGuid.replace("ce-", "");

    // Creating JWT encoded package.
    var sPayload = JSON.stringify(element);
    var sJWT = KJUR.jws.JWS.sign("RS256", sHeader, sPayload, prvKey);

    var package = {};
    package.envelope_id = envelopeGuid;
    package.envelope_type = "resource_data";
    package.envelope_version = "1.0.0";
    if (boolDelete == true) {
        package.delete_token = sJWT;
        package.delete_token_format = "json";
        package.delete_token_encoding = "jwt";
        package.delete_token_public_key = forge.pki.publicKeyToPem(EcPpk.fromPem(keyFor("adapter.cer.private")).toPk().pk);
    } else {
        package.resource = sJWT;
        package.resource_format = "json";
        package.resource_encoding = "jwt";
        package.resource_public_key = forge.pki.publicKeyToPem(EcPpk.fromPem(keyFor("adapter.cer.private")).toPk().pk);
    }
    var result = {
        a: httpPost(JSON.stringify(package), "http://lr-staging.learningtapestry.com/resources/", "application/json", "false"),
        c: element
    }
    return result;
}

registerWithCer = function (boolDelete) {
    var query = queryParse.call(this);
    var resource = null;
    if (resource == null)
        resource = skyrepoGet.call(this, query);
    if (resource == null)
        resource = EcRepository.getBlocking(urlDecode(this.params.id));
    else {
        var f = new EcRemoteLinkedData();
        f.copyFrom(resource);
        resource = f;
    }
    if (resource == null)
        error("Candidate for registration not found.", 404);

    var ceasnResource = httpGet(repoEndpoint() + "ceasn" + this.params.urlRemainder);

    if (ceasnResource["@graph"] != null) {
        var results = [];

        for (var i = 0; i < ceasnResource["@graph"].length; i++) {
            var element = ceasnResource["@graph"][i];
            element["@context"] = ceasnResource["@context"];

            results.push(registerElementWithCer(element, f.id, boolDelete));
        }

        return JSON.stringify(results);
    }

    error("Individual competencies are not permitted to be registered outside of a framework. See https://github.com/CredentialEngine/CompetencyFrameworks/issues/43 for more details.", 403);
}

deleteFromCer = function () {
    registerWithCer.call(this, true);
}

bindWebService("/cer/register", registerWithCer);
bindWebService("/cer/delete", deleteFromCer);
