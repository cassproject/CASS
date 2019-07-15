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
var ppk = null;
var pk = null;
var endpoint = null;
var email = null;

process.argv.forEach(function (val, index, array) {
    if (val.split("=")[0] == "competencyId")
        competencyId = val.split("=")[1];
    if (val.split("=")[0] == "endpoint")
        endpoint = val.replace("endpoint=", "");
    if (val.split("=")[0] == "email")
        email = val.replace("email=", "");
});
var debug = true;
if (debug) console.log("competencyId:" + competencyId);
if (debug) console.log("endpoint:" + endpoint);
if (debug) console.log("email:" + email);
if (competencyId == null) {
    console.log("Competency ID is missing.");
    process.exit(1);
}
if (endpoint == null) {
    console.log("Endpoint is missing.");
    process.exit(1);
}
if (email == null) {
    console.log("Email address is missing.");
    process.exit(1);
}

var error = function (e) {
    console.log(e);
};

var repo = new EcRepository();
repo.selectedServer = endpoint;
if (debug) console.log("Remote server: " + repo.selectedServer);

var counter = 0;
if (debug) console.log("@type:Person AND email:" + email + ' AND seeks.itemOffered.serviceOutput:"' + competencyId.replaceAll(/:/, "\\:").replaceAll(/\./, "\\\.").replaceAll(/\//, "\\/") + '"');
repo.search("@type:Person AND email:" + email + ' AND seeks.itemOffered.serviceOutput:"' + competencyId.replaceAll(/:/, "\\:").replaceAll(/\./, "\\\.").replaceAll(/\//, "\\/") + '"',
    function (eachSuccess) {
        if (debug) console.log(JSON.stringify(eachSuccess));
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
            });
        counter++;
    },
    function (success) {},
    function (failure) {
        console.log(failure);
        process.exit(1);
    });
