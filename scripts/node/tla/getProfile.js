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
eval(fs.readFileSync("../../src/main/js/cass/RollupListener.js") + "");
eval(fs.readFileSync("../../src/main/js/cass/RollupParser.js") + "");
eval(fs.readFileSync("../../src/main/js/cass/RollupLexer.js") + "");
eval(fs.readFileSync("../../src/main/js/cass/cass.rollup.js") + "");

var competencyId = null;
var frameworkId = null;
var ppk = null;
var pk = null;
var endpoint = null;

process.argv.forEach(function (val, index, array) {
    if (val.split("=")[0] == "frameworkId")
        frameworkId = val.split("=")[1];
    if (val.split("=")[0] == "ppk")
        ppk = val.replace("ppk=", "");
    if (val.split("=")[0] == "pk")
        pk = val.replace("pk=", "");
    if (val.split("=")[0] == "endpoint")
        endpoint = val.replace("endpoint=", "");
});
var debug = false;
if (debug) console.log("frameworkId:" + frameworkId);
if (debug) console.log("ppk:" + ppk);
if (debug) console.log("pk:" + pk);
if (debug) console.log("endpoint:" + endpoint);
if (frameworkId == null) {
    console.log("Framework ID is missing.");
    process.exit(1);
}
if (ppk == null) {
    console.log("PPK is missing.");
    process.exit(1);
}
if (pk == null) {
    console.log("PK is missing.");
    process.exit(1);
}
if (endpoint == null) {
    console.log("Endpoint is missing.");
    process.exit(1);
}

var error = function (e) {
    console.log(e);
};

var repo = new EcRepository();
repo.selectedServer = endpoint;
EcRepository.caching = true;
EcRepository.cachingSearch = true;
if (debug) console.log("Remote server: " + repo.selectedServer);

var remoteIdentityManager = new EcRemoteIdentityManager();
remoteIdentityManager.server = repo.selectedServer;

var identity = new EcIdentity();
identity.ppk = EcPpk.fromPem(ppk);
identity.displayName = "Person";
EcIdentityManager.addIdentity(identity);

if (EcIdentityManager.ids.length > 0)
    identity = EcIdentityManager.ids[0];
var counter = 0;
var target = EcPk.fromPem(pk);
var profile = {};
if (debug) console.log("Fetching framework.");
EcFramework.get(
    frameworkId,
    function (framework) {
        counter = framework.competency.length;
        for (var i = 0; i < framework.competency.length; i++) {
            var competencyId = framework.competency[i];
            if (debug) console.log("Fetching: " + competencyId);
            EcCompetency.get(
                competencyId,
                function (competency) {
                    if (debug) console.log("Processing assertions.");
                    var ep = new PessimisticQuadnaryAssertionProcessor();
                    ep.logFunction = function (data) {
                        if (debug) console.log(data);
                    };
                    ep.repositories.push(repo);
                    var subject = new Array();
                    subject.push(target);
                    var additionalSignatures = null;
                    ep.has(
                        subject,
                        competency,
                        null,
                        framework,
                        additionalSignatures,
                        function (data) {
                            counter--;
                            if (debug) console.log(data);
                            profile[data.competency[0].id] = data.result._name;
                            if (counter == 0) {
                                console.log(profile);
                                process.exit();
                            }
                        },
                        function (data) {
                            if (debug) console.log("Need answer to question: " + data);
                            console.log("error");
                            process.exit()
                        },
                        function (data) {
                            if (debug) console.log(data);
                            console.log("error");
                            process.exit()
                        }
                    );
                }
            );
        }
    }
);
