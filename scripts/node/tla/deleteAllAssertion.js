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

var owner = null;
var agent = null;
var subject = null;
var endpoint = null;

process.argv.forEach(function (val, index, array) {
    if (val.split("=")[0] == "endpoint")
        endpoint = val.replace("endpoint=", "");
    if (val.split("=")[0] == "owner")
        owner = val.replace("owner=", "");
    if (val.split("=")[0] == "agent")
        agent = val.replace("agent=", "");
    if (val.split("=")[0] == "subject")
        subject = val.replace("subject=", "");
});
var debug = true;
if (debug) console.log("endpoint:" + endpoint);
if (debug) console.log("owner:" + owner);
if (debug) console.log("agent:" + agent);
if (debug) console.log("subject:" + subject);
if (endpoint == null) {
    console.log("Endpoint is missing.");
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

var error = function (e) {
    console.log(e);
};

var identity = new EcIdentity();
identity.ppk = EcPpk.fromPem(owner);
identity.displayName = "Person";
EcIdentityManager.addIdentity(identity);

if (EcIdentityManager.ids.length > 0)
    identity = EcIdentityManager.ids[0];

var repo = new EcRepository();
repo.selectedServer = endpoint;
if (debug) console.log("Remote server: " + repo.selectedServer);

var counter = 0;
if (debug) console.log("@type:assertion AND \\*@reader:\"" + subject + "\"");
repo.search("@type:assertion AND \\*@reader:\"" + subject + "\"",
    function (eachSuccess) {
        if (debug) console.log(JSON.stringify(eachSuccess));
        var a = new EcAssertion();
        a.copyFrom(eachSuccess);
        if (a.getSubject().equals(EcPk.fromPem(subject))) {
            counter++;
            EcRepository._delete(
                eachSuccess,
                function (success) {
                    if (debug) console.log(JSON.stringify(success));
                    counter--;
                    if (counter == 0)
                        process.exit(0);
                },
                function (failure) {
                    if (debug) console.log(JSON.stringify(failure));
                    counter--;
                    if (counter == 0)
                        process.exit(0);
                }
            );
        }
    },
    function (success) {},
    function (failure) {
        console.log(failure);
        process.exit(1);
    });
