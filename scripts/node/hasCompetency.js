var fs = require('fs');

require("node-jquery-xhr");
var forge = require("node-forge");
var FormData = require('form-data');
var antlr4 = require('antlr4/index');

var window = null;
var document = {};
var view = {};
var localStorage = {};

eval(fs.readFileSync("../../src/main/js/cass/random.js")+"");
eval(fs.readFileSync("../../src/main/js/cass/blobHelper.js")+"");
eval(fs.readFileSync("../../src/main/js/cass/stjs.js")+"");
eval(fs.readFileSync("../../src/main/js/cass/ec.base.js")+"");
eval(fs.readFileSync("../../src/main/js/cass/ec.crypto.js")+"");
eval(fs.readFileSync("../../src/main/js/cass/org.json-ld.js")+"");
eval(fs.readFileSync("../../src/main/js/cass/org.cassproject.schema.general.js")+"");
eval(fs.readFileSync("../../src/main/js/cass/org.schema.js")+"");
eval(fs.readFileSync("../../src/main/js/cass/org.cassproject.schema.ebac.js")+"");
eval(fs.readFileSync("../../src/main/js/cass/org.cassproject.schema.cass.js")+"");
eval(fs.readFileSync("../../src/main/js/cass/ebac.identity.js")+"");
eval(fs.readFileSync("../../src/main/js/cass/ebac.repository.js")+"");
eval(fs.readFileSync("../../src/main/js/cass/cass.competency.js")+"");
eval(fs.readFileSync("../../src/main/js/cass/RollupListener.js")+"");
eval(fs.readFileSync("../../src/main/js/cass/RollupParser.js")+"");
eval(fs.readFileSync("../../src/main/js/cass/RollupLexer.js")+"");
eval(fs.readFileSync("../../src/main/js/cass/cass.rollup.js")+"");


var error = function(e){console.log(e);};

var repo = new EcRepository();
repo.selectedServer="https://dev.cassproject.org/api/custom/";
console.log("Remote server: " + repo.selectedServer);

var remoteIdentityManager = new EcRemoteIdentityManager();
remoteIdentityManager.server = repo.selectedServer;
remoteIdentityManager.configureFromServer(function(o){
	console.log("Configured salt from server.");
	remoteIdentityManager.startLogin("username","password");
	console.log("Salted Username: " + remoteIdentityManager.usernameWithSalt);
	console.log("Salted Password: " + remoteIdentityManager.passwordWithSalt);
	console.log("Salted Secret:   " + remoteIdentityManager.secretWithSalt);
	console.log("Beginning Login.");
	remoteIdentityManager.fetch(function(o2){
		console.log("Logged in.");
		console.log("Token: " + remoteIdentityManager.token);

        if (EcIdentityManager.ids.length > 0)
            identity = EcIdentityManager.ids[0];

        console.log("Private Key: " + identity.ppk.toPem());
        console.log("Public Key: " + identity.ppk.toPk().toPem());
        
        console.log("Asking question: Do I know about X");
        
        var competencyId = "https://dev.cassproject.org/api/custom/data/schema.eduworks.com.cass.0.2.competency/5164fc54-3438-4367-8399-7e7ac7645dde";
        var frameworkId = "https://dev.cassproject.org/api/custom/data/schema.eduworks.com.cass.0.2.framework/c98eb325-6569-4d5d-9fab-881baedf3f42";
        var target = EcIdentityManager.ids[0].ppk.toPk();

        EcCompetency.get(
            competencyId,
            function (competency) {
                EcFramework.get(
                    frameworkId,
                    function (framework) {
                        var ep = new PessimisticQuadnaryAssertionProcessor();
                        ep.logFunction = function (data) {
                            console.log(data);
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
                            	console.log(data);
                            },
                            function (data) {
                                console.log(data);
                            },
                            function (data) {
                                console.log(data);
                            }
                        );
                    }
                );
            }
        );
        
	},error);
},error);

 
