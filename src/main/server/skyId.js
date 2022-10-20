

const fs = require('fs');
var usernameSalt = null;
var passwordSalt = null;
var secretSalt = null;
var skyIdSalt = null;
var skyIdSecretStr = null;
var skyIdSecret = function() {
    return skyIdSecretStr;
};
var skyIdSecretKey = null;
var skyIdPem = null;
var cachedSalts = {};
var salts = function() {
    return JSON.stringify(cachedSalts);
};
var skyIdCreate = async function() {
    var id = null;
    var password = null;
    var credentials = null;
    var searchParams = JSON.parse(fileToString((fileFromDatastream).call(this, "credentialCommit", null)));
    if (searchParams != null) {
        if ((searchParams)["username"] != undefined) 
        if ((searchParams)["username"] != null) 
            id = (searchParams)["username"];
        if ((searchParams)["password"] != undefined) 
        if ((searchParams)["password"] != null) 
            password = (searchParams)["password"];
        if ((searchParams)["credentials"] != undefined) 
        if ((searchParams)["credentials"] != null) 
            credentials = (searchParams)["credentials"];
    }
    if (id == null) 
        error("Missing username.", 422);
    if (password == null) 
        error("Missing password.", 422);
    var payload = credentials;
    var saltedPassword = forge.util.encode64(forge.pkcs5.pbkdf2(password, skyIdSalt, 10000, 64));
    (payload)["password"] = saltedPassword;
    var saltedId = forge.util.encode64(forge.pkcs5.pbkdf2(id, skyIdSalt, 10000, 16));
    var signatureSheet = new Array();
    signatureSheet.push(await EcIdentityManager.default.createSignature(60000, null, skyIdPem));
    this.ctx.put("signatureSheet", signatureSheet);
    var get = await (skyrepoGetInternal).call(this, saltedId, null, "schema.cassproject.org.kbac.0.2.EncryptedValue", null);
    if (get != null) 
        get = JSON.parse(await EcAesCtrAsync.decrypt((get)["payload"], skyIdSecretKey, saltedId));
    var encryptedPayload = new EcEncryptedValue();
    encryptedPayload.addOwner(skyIdPem.toPk());
    encryptedPayload.payload = await EcAesCtrAsync.encrypt(JSON.stringify(payload), skyIdSecretKey, saltedId);
    if (get == null) 
        await (skyrepoPutParsed).call(this, JSON.parse(encryptedPayload.toJson()), saltedId, null, "schema.cassproject.org.kbac.0.2.EncryptedValue");
     else 
        error("Cannot create, account already exists.", 422);
    return null;
};
var skyIdCommit = async function() {
    var id = null;
    var password = null;
    var token = null;
    var credentials = null;
    var searchParams = JSON.parse(fileToString((fileFromDatastream).call(this, "credentialCommit", null)));
    if (searchParams != null) {
        if ((searchParams)["username"] != undefined) 
        if ((searchParams)["username"] != null) 
            id = (searchParams)["username"];
        if ((searchParams)["password"] != undefined) 
        if ((searchParams)["password"] != null) 
            password = (searchParams)["password"];
        if ((searchParams)["token"] != undefined) 
        if ((searchParams)["token"] != null) 
            token = (searchParams)["token"];
        if ((searchParams)["credentials"] != undefined) 
        if ((searchParams)["credentials"] != null) 
            credentials = (searchParams)["credentials"];
    }
    if (id == null) 
        error("Missing username.", 422);
    if (password == null) 
        error("Missing password.", 422);
    if (token == null) 
        error("Missing token.", 422);
    var payload = credentials;
    (payload)["token"] = token;
    var saltedPassword = forge.util.encode64(forge.pkcs5.pbkdf2(password, skyIdSalt, 10000, 64));
    (payload)["password"] = saltedPassword;
    var saltedId = forge.util.encode64(forge.pkcs5.pbkdf2(id, skyIdSalt, 10000, 16));
    var encryptedPayload = new EcEncryptedValue();
    encryptedPayload.addOwner(skyIdPem.toPk());
    encryptedPayload.payload = await EcAesCtrAsync.encrypt(JSON.stringify(payload), skyIdSecretKey, saltedId);
    var signatureSheet = new Array();
    signatureSheet.push(await EcIdentityManager.default.createSignature(60000, null, skyIdPem));
    this.ctx.put("signatureSheet", signatureSheet);
    var get = await (skyrepoGetInternal).call(this, saltedId, null, "schema.cassproject.org.kbac.0.2.EncryptedValue", null);
    if (get == null) 
        error("User does not exist.", 404);
    get = JSON.parse(await EcAesCtrAsync.decrypt((get)["payload"], skyIdSecretKey, saltedId));
    if ((get)["token"] != token) 
        error("An error in synchronization has occurred. Please re-login and try again.", 403);
    await (skyrepoPutParsed).call(this, JSON.parse(encryptedPayload.toJson()), saltedId, null, "schema.cassproject.org.kbac.0.2.EncryptedValue");
    return null;
};
var skyIdLogin = async function() {
    var id = null;
    var password = null;
    var credentials = null;
    var searchParams = JSON.parse(fileToString((fileFromDatastream).call(this, "credentialRequest", null)));
    if (searchParams != null) {
        if ((searchParams)["username"] !== undefined) 
        if ((searchParams)["username"] != null) 
            id = (searchParams)["username"];
        if ((searchParams)["password"] != undefined) 
        if ((searchParams)["password"] != null) 
            password = (searchParams)["password"];
        if ((searchParams)["credentials"] != undefined) 
        if ((searchParams)["credentials"] != null) 
            credentials = (searchParams)["credentials"];
    }
    if (id == null) 
        error("Missing username.", 422);
    if (password == null) 
        error("Missing password.", 422);
    var saltedPassword = forge.util.encode64(forge.pkcs5.pbkdf2(password, skyIdSalt, 10000, 64));
    var saltedId = forge.util.encode64(forge.pkcs5.pbkdf2(id, skyIdSalt, 10000, 16));
    var signatureSheet = new Array();
    signatureSheet.push(await EcIdentityManager.default.createSignature(60000, null, skyIdPem));
    this.ctx.put("signatureSheet", signatureSheet);
    var get = await (skyrepoGetInternal).call(this, saltedId, null, "schema.cassproject.org.kbac.0.2.EncryptedValue", null);
    if (get == null) 
        error("User does not exist.", 404);
    get = JSON.parse(await EcAesCtrAsync.decrypt((get)["payload"], skyIdSecretKey, saltedId));
    if ((get)["password"] != saltedPassword) 
        error("Invalid password.", 403);
    (get)["token"] = randomString(20);
    var lastLogin = (get)["lastLogin"] || Date.now();
    (get)["lastLogin"] = Date.now(); // Save current time as lastLogin
    var encryptedPayload = new EcEncryptedValue();
    encryptedPayload.addOwner(skyIdPem.toPk());
    encryptedPayload.payload = await EcAesCtrAsync.encrypt(JSON.stringify(get), skyIdSecretKey, saltedId);
    await (skyrepoPutParsed).call(this, JSON.parse(encryptedPayload.toJson()), saltedId, null, "schema.cassproject.org.kbac.0.2.EncryptedValue");
    delete (get)["password"];
    (get)["lastLogin"] = lastLogin;
    return JSON.stringify(get);
};
global.loadConfigurationFile = function(path, dflt) {
    if (fs.existsSync("etc") == false)
        fs.mkdirSync("etc");
    let pathParts = path.split("/");
    pathParts.pop();
    let cumulativePath = "etc/";
    for (let path of pathParts)
    {
        cumulativePath += path + "/";
        if (fs.existsSync(cumulativePath) == false)
            fs.mkdirSync(cumulativePath);    
    }
    if (fs.existsSync(path)) 
        return fileToString(fileLoad(path));
    if (fs.existsSync("etc/" + path)) 
        return fileToString(fileLoad("etc/" + path));
    if (dflt == null) 
        return null;
    let def = dflt();
    if (def != null)
        fileSave(def, "etc/" + path);
    else
        return null;
    return fileToString(fileLoad("etc/" + path));
};
(function() {
    usernameSalt = loadConfigurationFile("skyId.username.public.salt", function() {
        return randomString(2048);
    });
    passwordSalt = loadConfigurationFile("skyId.password.public.salt", function() {
        return randomString(2048);
    });
    secretSalt = loadConfigurationFile("skyId.secret.public.salt", function() {
        return randomString(2048);
    });
    (cachedSalts)["usernameSalt"] = usernameSalt;
    (cachedSalts)["usernameIterations"] = 5000;
    (cachedSalts)["usernameLength"] = 64;
    (cachedSalts)["passwordSalt"] = passwordSalt;
    (cachedSalts)["passwordIterations"] = 5000;
    (cachedSalts)["passwordLength"] = 64;
    (cachedSalts)["secretSalt"] = secretSalt;
    (cachedSalts)["secretIterations"] = 5000;
    (cachedSalts)["secretLength"] = 64;
    skyIdSalt = loadConfigurationFile("skyId.salt", function() {
        return randomString(2048);
    });
    skyIdSecretStr = loadConfigurationFile("skyId.secret", function() {
        return randomString(2048);
    });
    skyIdSecretKey = forge.util.encode64(forge.pkcs5.pbkdf2(skyIdSecretStr, skyIdSalt, 10000, 16));
    skyIdPem = EcPpk.fromPem(loadConfigurationFile("skyId.pem", function() {
        return EcPpk.fromPem(rsaGenerate()).toPem();
    }));
    bindWebService("/sky/id/salts", salts)
    bindWebService("/sky/id/create", skyIdCreate);
    bindWebService("/sky/id/commit", skyIdCommit);
    bindWebService("/sky/id/login", skyIdLogin);
})();
