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
        
        console.log("Creating framework.")
		var f = new EcFramework();
        f.name = "Node Script Framework";
        f.generateId(repo.selectedServer);
        console.log("Framework Id: " + f.shortId());
        f.addOwner(identity.ppk.toPk());
    	console.log("Saving framework.");
        f.save(function(o3){
        	console.log("Saved framework.");
        	console.log("Creating competency.");
        	var c = new EcCompetency();
        	c.name = "Node Script Competency";
        	c.generateId(repo.selectedServer);
            console.log("Competency Id: " + f.shortId());
        	c.addOwner(identity.ppk.toPk());
        	console.log("Saving competency.");
        	c.save(function(p1){
        		console.log("Saved competency.");
        		console.log("Adding competency to framework using short identifier.");
        		f.addCompetency(c.shortId());
        		console.log("Saving framework after modification.");
        		f.save(function(o4){
        			console.log("Saved framework.");
        			EcRepository.get(f.shortId(),function(get0){
        				console.log("Fetched framework from server. Looks like this:");
        				console.log(get0);
                    	f._delete(function(o5){
                    		console.log("Deleted framework.");
                    	},error);
        			},error);
        			EcRepository.get(c.shortId(),function(get1){
        				console.log("Fetched competency from server. Looks like this:");
        				console.log(get1);
                    	c._delete(function(o6){
                    		console.log("Deleted competency.");
                    	},error);
        			},error);
        		},error);
        	},error);
        },error);		
	},error);
},error);

 
