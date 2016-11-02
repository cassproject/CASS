var fs = require('fs');

require("node-jquery-xhr");
var forge = require("node-forge");
var FormData = require('form-data');
var antlr4 = require('antlr4/index');

var window = null;
var document = {};
var global = {
    document: {}
};
var view = {};
var localStorage = {};
var Papa = require("papaparse");

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
eval(fs.readFileSync("../../src/main/js/cass/cass.import.js") + "");

var frameworkGuid = null;
var frameworkName = null;
var competencyPath = null;
var relationPath = null;
var owner = null;
var endpoint = null;

process.argv.forEach(function (val, index, array) {
    if (val.split("=")[0] == "frameworkGuid")
        frameworkGuid = val.replace("frameworkGuid=", "");
    if (val.split("=")[0] == "frameworkName")
        frameworkName = val.replace("frameworkName=", "");
    if (val.split("=")[0] == "competencyPath")
        competencyPath = val.replace("competencyPath=", "");
    if (val.split("=")[0] == "relationPath")
        relationPath = val.replace("relationPath=", "");
    if (val.split("=")[0] == "owner")
        owner = val.replace("owner=", "");
    if (val.split("=")[0] == "endpoint")
        endpoint = val.replace("endpoint=", "");
});
var debug = false;
if (debug) console.log("frameworkGuid:" + frameworkGuid);
if (debug) console.log("frameworkName:" + frameworkName);
if (debug) console.log("competencyPath:" + competencyPath);
if (debug) console.log("relationPath:" + relationPath);
if (debug) console.log("owner:" + owner);
if (debug) console.log("endpoint:" + endpoint);
if (frameworkGuid == null) {
    console.log("Framework Guid is missing.");
    process.exit(1);
}
if (frameworkName == null) {
    console.log("Framework Name is missing.");
    process.exit(1);
}
if (competencyPath == null) {
    console.log("Path to local Competency CSV file missing.");
    process.exit(1);
}
if (relationPath == null) {
    console.log("Path to local Relation CSV file missing.");
    process.exit(1);
}
if (owner == null) {
    console.log("Owner in PEM format is missing.");
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
if (debug) console.log("Remote server: " + repo.selectedServer);

if (debug) console.log("Ingesting identity.");

var identity = new EcIdentity();
identity.ppk = EcPpk.fromPem(owner);
identity.displayName = "Person";
EcIdentityManager.addIdentity(identity);

if (EcIdentityManager.ids.length > 0)
    identity = EcIdentityManager.ids[0];

/*
Object file, final String serverUrl, final EcIdentity owner,
			final Integer nameIndex, final Integer descriptionIndex, final Integer scopeIndex, final Integer idIndex,
			final Object relations, final Integer sourceIndex, final Integer relationTypeIndex, final Integer destIndex,
			final Callback2<Array<EcCompetency>, Array<EcAlignment>> success, final Callback1<Object> failure,
			final Callback1<Object> incremental
*/

var f = new EcFramework();
f.assignId(repo.selectedServer, frameworkGuid);
f.addOwner(identity.ppk.toPk());
f.name = frameworkName.replace("\"", "").replace("\"", "");
CSVImport.importCompetencies(
    fs.readFileSync(competencyPath, "utf8"),
    repo.selectedServer,
    identity,
    5,
    null,
    null,
    1,
    fs.readFileSync(relationPath, "utf8"),
    6,
    5,
    7,
    function (competencies, alignments) {
        for (var i = 0; i < competencies.length; i++)
            f.addCompetency(competencies[i].shortId());
        for (var i = 0; i < alignments.length; i++)
            f.addRelation(alignments[i].shortId());
        EcRepository.save(f,
            function (success) {
                process.exit(0);
            },
            function (failure) {
                console.log(failure);
                process.exit(1);
            });
    },
    function (failure) {
        console.log(failure);
        process.exit(1);
    },
    function (incremental) {}
);
