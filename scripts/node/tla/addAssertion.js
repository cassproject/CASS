var fs = require('fs');

require("node-jquery-xhr");
var forge = require("node-forge");
var FormData = require('form-data');
var antlr4 = require('antlr4/index');

var window = null;
var document = {};
var view = {};
var localStorage = {};

eval(fs.readFileSync("../../src/main/js/cass/random.js") + "");
eval(fs.readFileSync("../../src/main/js/cass/blobHelper.js") + "");
eval(fs.readFileSync("../../src/main/js/cass/stjs.js") + "");
eval(fs.readFileSync("../../src/main/js/cass/ec.base.js") + "");
eval(fs.readFileSync("../../src/main/js/cass/ec.crypto.js") + "");
eval(fs.readFileSync("../../src/main/js/cass/org.json-ld.js") + "");
eval(fs.readFileSync("../../src/main/js/cass/org.cassproject.schema.general.js") + "");
eval(fs.readFileSync("../../src/main/js/cass/org.schema.js") + "");
eval(fs.readFileSync("../../src/main/js/cass/org.cassproject.schema.ebac.js") + "");
eval(fs.readFileSync("../../src/main/js/cass/org.cassproject.schema.cass.js") + "");
eval(fs.readFileSync("../../src/main/js/cass/ebac.identity.js") + "");
eval(fs.readFileSync("../../src/main/js/cass/ebac.repository.js") + "");
eval(fs.readFileSync("../../src/main/js/cass/cass.competency.js") + "");

var competencyId = null;
var frameworkId = null;
var owner = null;
var agent = null;
var subject = null;
var endpoint = null;
var confidence = null;

process.argv.forEach(function (val, index, array) {
    if (val.split("=")[0] == "competencyId")
        competencyId = val.split("=")[1];
    if (val.split("=")[0] == "frameworkId")
        frameworkId = val.split("=")[1];
    if (val.split("=")[0] == "owner")
        owner = val.replace("owner=", "");
    if (val.split("=")[0] == "agent")
        agent = val.replace("agent=", "");
    if (val.split("=")[0] == "subject")
        subject = val.replace("subject=", "");
    if (val.split("=")[0] == "endpoint")
        endpoint = val.replace("endpoint=", "");
    if (val.split("=")[0] == "confidence")
        confidence = val.replace("confidence=", "");
});
var debug = false;
if (debug) console.log("competencyId:" + competencyId);
if (debug) console.log("frameworkId:" + frameworkId);
if (debug) console.log("owner:" + owner);
if (debug) console.log("agent:" + agent);
if (debug) console.log("subject:" + subject);
if (debug) console.log("endpoint:" + endpoint);
if (debug) console.log("confidence:" + confidence);
if (competencyId == null) {
    console.log("Competency ID is missing.");
    process.exit(1);
}
if (owner == null) {
    console.log("Owner is missing.");
    process.exit(1);
}
if (agent == null) {
    console.log("Agent is missing.");
    process.exit(1);
}
if (subject == null) {
    console.log("Subject is missing.");
    process.exit(1);
}
if (endpoint == null) {
    console.log("Endpoint is missing.");
    process.exit(1);
}
if (confidence == null) {
    console.log("Confidence is missing.");
    process.exit(1);
}

var error = function (e) {
    console.log(e);
};

var repo = new EcRepository();
repo.selectedServer = endpoint;
if (debug) console.log("Remote server: " + repo.selectedServer);

if (debug) console.log("Generating Assertion.");

var identity = new EcIdentity();
identity.ppk = EcPpk.fromPem(owner);
identity.displayName = "Person";
EcIdentityManager.addIdentity(identity);

if (EcIdentityManager.ids.length > 0)
    identity = EcIdentityManager.ids[0];

var a = new EcAssertion();
a.generateId(repo.selectedServer);
a.addOwner(identity.ppk.toPk());
a.setSubject(EcPk.fromPem(subject));
a.setAgent(EcPk.fromPem(agent));
a.setCompetency(competencyId);
a.setConfidence(confidence);
var date = new Date();
a.setAssertionDate(date.getTime());
date.setFullYear(date.getFullYear()+1);
a.setExpirationDate(date.getTime());
a.setDecayFunction("t");


if (debug) console.log(JSON.stringify(a));

EcRepository.save(a,
    function (success) {
        if (debug) console.log(success);
        console.log("OK");
        process.exit(0);
    },
    function (failure) {
        console.log(failure);
        process.exit(1);
    });
