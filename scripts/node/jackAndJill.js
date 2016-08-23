var fs = require('fs');

require("node-jquery-xhr");
var forge = require("node-forge");
var FormData = require('form-data');

var window = null;
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

var error = function(e){console.log(e);};

var repo = new EcRepository();
repo.selectedServer="https://dev.cassproject.org/api/custom/";
console.log("Remote server: " + repo.selectedServer);

var remoteIdentityManager = new EcRemoteIdentityManager();
remoteIdentityManager.server = repo.selectedServer;
remoteIdentityManager.configureFromServer(function(o){
	console.log("Encryption settings retrieved from server.");
	console.log("-----");
	console.log("Logging in as Jack.");
	remoteIdentityManager.startLogin("jack","jack");
	console.log("-----");
	console.log("Salted & Hashed Username: " + remoteIdentityManager.usernameWithSalt);
	console.log("Salted & Hashed Password: " + remoteIdentityManager.passwordWithSalt);
	console.log("Salted & Hashed Secret (to encrypt/decrypt Identities):   " + remoteIdentityManager.secretWithSalt);
	console.log("-----");
	console.log("Beginning Login.");
	remoteIdentityManager.fetch(function(o2){
		console.log("-----");
		console.log("Logged in as Jack. Enumerating identities.");
		for (var i = 0;i < EcIdentityManager.ids.length;i++)
		{
			var identity = EcIdentityManager.ids[i];
			console.log("-----");
			console.log("Identity "+i+" Name: "+identity.displayName);
			console.log("Identity "+i+" Public Key: ");
			console.log(identity.ppk.toPk().toPem());
			console.log("Identity "+i+" Private Key: ");
			console.log(identity.ppk.toPem());
		}
		console.log("-----");
		console.log("Enumerating contacts (identifiers).");
		for (var i = 0;i < EcIdentityManager.contacts.length;i++)
		{
			var identity = EcIdentityManager.contacts[i];
			console.log("-----");
			console.log("Contact "+i+" Name: "+identity.displayName);
			console.log("Contact "+i+" Public Key: ");
			console.log(identity.pk.toPem());
		}
		console.log("-----");
		var jack_identifier = EcIdentityManager.ids[0].ppk.toPk();
		var jill_identifier = EcIdentityManager.contacts[0].pk;
		console.log("Jack will now generate an assertion about Jill.");
		var a = new EcAssertion();
		a.generateId(repo.selectedServer);
		console.log("Jack owns the assertion, so setting him as owner.");
		console.log("");
		a.addOwner(jack_identifier);
		console.log("Setting Subject to Jill. This will automatically give her read access to this information about her.");
		console.log("");
		a.setSubject(jill_identifier);
		console.log("Setting Agent to Jack");
		console.log("");
		a.setAgent(jack_identifier);
		console.log("Setting Competency to 'Going up the hill'");
		console.log("");
		a.setCompetency("https://dev.cassproject.org/api/custom/data/schema.eduworks.com.cass.0.2.competency/58f246bc-36a3-4eee-8d5c-e6198344ed70");
		console.log("Setting Level to 'Expediently'");
		console.log("");
		a.setLevel("https://dev.cassproject.org/api/custom/data/schema.eduworks.com.cass.0.2.level/587dbeb3-606b-4745-a4d0-2cbf0a69d009");
		console.log("Setting Confidence to maximum.");
		console.log("");
		a.setConfidence(1.0);
		console.log("Setting Evidence to a link to the famous book.");
		console.log("");
		a.setEvidence(["https://www.amazon.com/Jack-Charles-Reasoner-Nursery-Rhymes/dp/147953806X"]);
		console.log("Setting the time of the assertion to now.");
		console.log("");
		a.setAssertionDate(new Date().getTime());
		console.log("Setting the time of the expiration to a day from now.");
		console.log("");
		a.setExpirationDate(new Date().getTime()+86400000);
		console.log("Taking a look at the assertion before we store it. Note that much of the data is encrypted.");
		console.log("");
		console.log(a);
	    EcRepository.save(a, function (o3) {
	    	console.log("Stored in repository.");
	    }, error);
	});
});