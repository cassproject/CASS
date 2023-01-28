const fs = require('fs');
let keyEim = null;

let getPkCache = {};
let getPersonCache = {};
var skyrepoAdminPpk = function() {
    if (!fs.existsSync("etc/skyAdmin2.pem")) 
        fileSave(EcPpk.fromPem(rsaGenerate()).toPem(), "etc/skyAdmin2.pem");
    return EcPpk.fromPem(fileToString(fileLoad("etc/skyAdmin2.pem"))).toPem();
};
let getPk = async(identifier) => {
    if (getPkCache[identifier] != null) 
        return getPkCache[identifier];
    if (process.env.CASS_ELASTIC_KEYSTORE != true && process.env.CASS_ELASTIC_KEYSTORE != 'true')
        return loadConfigurationFile("keys/"+identifier, () => {
            return EcPpk.fromPem(rsaGenerate()).toPem();
        });
    if (identifier.toLowerCase().indexOf("admin") != -1)
    {
        return skyrepoAdminPpk();
    }
    if (keyEim == null)
    {
        console.log("Establishing skyId Elastic EIM.");
        keyEim = new EcIdentityManager();
        let i = new EcIdentity();
        i.displayName = "Key Manager";
        i.ppk = EcPpk.fromPem(loadConfigurationFile("skyId.pem", function() {
            console.log("Generating SkyId Elastic EIM fingerprint.");
            return EcPpk.fromPem(rsaGenerate()).toPem();
        }));
        console.log("SkyId Elastic EIM fingerprint: " + i.ppk.toPk().fingerprint());
        keyEim.addIdentity(i);
    }
    console.log("Looking for " + identifier);
    let myKey = loadConfigurationFile("keys/"+identifier, () => {
        console.log("Could not find " + identifier + " in file system.");
        return null;
    });
    
    let identityPrefix = process.env.CASS_ELASTIC_KEYSTORE_ENDPOINT | "http://identity/";
    let keypair = new EcRemoteLinkedData();
    if (myKey != null)
    {
        console.log("Found file system keypair. Securing and saving to Elastic.");
        loadConfigurationFile("keys/backup/"+identifier, () => {
            console.log("Saved to backup location.");
            return myKey;
        });
        console.log("Deleting old keypair file.");
        fs.unlinkSync("etc/keys/"+identifier);
        let keypair = new EcRemoteLinkedData();
        keypair.context = "https://schema.cassproject.org/0.4/";
        keypair.type = "KeyPair";
        keypair.addOwner(keyEim.ids[0].ppk.toPk());
        keypair.assignId(identityPrefix,keyEim.ids[0].ppk.toPk().fingerprint() + ":" + identifier);
        keypair.ppk = myKey;
        console.log("Saving Elastic keypair to: " + keypair.shortId());
        await repo.saveTo(await EcEncryptedValue.toEncryptedValue(keypair),null,null,keyEim);
    }
    if (myKey == null)
    {        
        let keypair = new EcRemoteLinkedData();
        keypair.context = "https://schema.cassproject.org/0.4/";
        keypair.type = "KeyPair";
        keypair.assignId(identityPrefix,keyEim.ids[0].ppk.toPk().fingerprint() + ":" + identifier);
        console.log("Reading Elastic keypair from: " + keypair.shortId());
        keypair = await EcRepository.get(keypair.shortId(),null,null,repo,keyEim);
        if (keypair != null)
            keypair = await EcEncryptedValue.fromEncryptedValue(keypair,null,null,keyEim);
        if (keypair != null)
            myKey = keypair.ppk;
    }
    if (myKey == null && repo.selectedServerProxy != null)
    {
        let keypair = new EcRemoteLinkedData();
        keypair.context = "https://schema.cassproject.org/0.4/";
        keypair.type = "KeyPair";
        keypair.assignId(identityPrefix,keyEim.ids[0].ppk.toPk().fingerprint() + ":" + identifier);
        console.log("Reading Elastic keypair (again) from: " + keypair.shortId());
        keypair = await EcRepository.get(keypair.shortId(),null,null,repo,keyEim);
        if (keypair != null)
            keypair = await EcEncryptedValue.fromEncryptedValue(keypair,null,null,keyEim);
        if (keypair != null)
            myKey = keypair.ppk;
    }
    if (myKey == null)
    {
        console.log("Could not find Elastic keypair. Generating a new one.");
        let keypair = new EcRemoteLinkedData();
        keypair.context = "https://schema.cassproject.org/0.4/";
        keypair.type = "KeyPair";
        keypair.addOwner(keyEim.ids[0].ppk.toPk());
        keypair.assignId(identityPrefix,keyEim.ids[0].ppk.toPk().fingerprint() + ":" + identifier);
        myKey = keypair.ppk = EcPpk.fromPem(rsaGenerate()).toPem();
        console.log("Saving Elastic keypair to: " + keypair.shortId());
        await repo.saveTo(await EcEncryptedValue.toEncryptedValue(keypair),null,null,keyEim);
    }
    getPkCache[identifier] = myKey;
    return myKey;
}

if (process.env.CASS_OIDC_ENABLED || false)
{
    if (global.baseUrl != "")
    {
        global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.WARNING, "CassAuthBaseUrl", `BASE URL is ${global.baseURL} and this can cause problems with callbacks from SSO providers. You may need to modify your reverse proxy (if you have one) to match up callbacks. If you use the cass installer script, this requires taking /cass out of the Apache2 redirect.`);
    }
    const { auth } = require('express-openid-connect');
    app.use(
        auth({
            issuerBaseURL: process.env.CASS_OIDC_ISSUER_BASE_URL || 'https://dev.keycloak.eduworks.com/auth/realms/test-realm/',
            baseURL: process.env.CASS_OIDC_BASE_URL || 'http://localhost/',
            clientID: process.env.CASS_OIDC_CLIENT_ID || 'cass',
            secret: process.env.CASS_OIDC_SECRET || 'a71b92d4-336e-4664-bc05-2226f76b4042',
	        routes:{callback:global.baseUrl + "/callback"},
            authorizationParams: {
                scope: 'openid profile email'
            },
            authRequired: false
        })
    );
    app.get(global.baseUrl + '/api/login', (req, res) => {
        res.oidc.login({
            returnTo: req.query.redirectUrl || '/',
            authorizationParams: {
                scope: 'openid profile email',
            }
        });
    });
    app.get(global.baseUrl + '/api/logout', (req, res) => {
        res.oidc.logout({
            returnTo: req.query.redirectUrl || '/'
        });
    });
}

if (process.env.CASS_JWT_ENABLED)
{
    var jwt = require('express-jwt');
    app.use(
        jwt({
            secret: process.env.CASS_JWT_SECRET || 'cass',
            algorithms: [process.env.CASS_JWT_ALGORITHM || 'HS256'],
            credentialsRequired: false
        })
    );
}

app.use(async function (req, res, next) {
    let email = null;
    let identifier = null;
    let name = null;
    if (req.user != null)
    {
        if (req.user.iat != null)
        {
            let secondsSinceEpoch = req.user.iat;
            if (secondsSinceEpoch * 1000 < new Date().getTime() + 20000)
            {
                res.end("JWT token is expired.");
                return;
            }
        }
        if (req.user.name != null)
            name = req.user.name;
        if (req.user.email != null)
            email = req.user.email;
        if (req.user.identifier != null)
            identifier = req.user.sub;
    }
    if (req.oidc?.user != null)
    {
        name = req.oidc.user.name;
        identifier = req.oidc.user.sub;
        email = req.oidc.user.email;
        if (email == null)
            global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.INFO, "CassOidcMissEmail", "OIDC token does not have email address.");
    }
    if (req.client?.authorized) {
        let cert = req.socket.getPeerCertificate();
        if (cert.subject != null)
        {
            email = cert.subject.emailAddress;
            name = cert.subject.CN;
        }
    }
    if (email != null)
    {
        global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.INFO, "CassAuthSigSheetCreating", `Securing Proxy: Creating signature sheet for request from ${email}.`);
        let eim = new EcIdentityManager();
        let myKey = getPk(email);
        let i = new EcIdentity();
        i.displayName = name;
        i.ppk = EcPpk.fromPem(myKey);
        eim.addIdentity(i);
        let p = getPersonCache[i.ppk.toPk().toPem()];
        if (p == null)
            try{
                p = await EcPerson.getByPk(repo,i.ppk.toPk(),null,null,eim);
                getPersonCache[i.ppk.toPk().toPem()] = p;
            }catch(ex){
                global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.INFO, "CassAuthPersonNotFound", "Could not find person.", ex);
            }
        if (p == null)
        {
            global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.INFO, "CassAuthCreatingPerson", "Creating person.", i.ppk.toPk().fingerprint());
            p = new EcPerson();
            p.addOwner(i.ppk.toPk());
            p.assignId(repo.selectedServerProxy == null ? repo.selectedServer : repo.selectedServerProxy,i.ppk.toPk().fingerprint());
            p.name = name;
            p.email = email;
            await repo.saveTo(p);
        }
        //THIS IS NOT OK, THE KEY INTO THE CACHE SHOULD NOT BE THE SERVER NAME!!!!!!!!!!
        let signatureSheet = signatureSheetCache[p.shortId()];
        if (signatureSheet != null)
        {
            let maxTimeout = 0;
            let ss = JSON.parse(signatureSheet);
            for (let o of ss)
                maxTimeout = Math.max(maxTimeout,o.expiry);
            if (maxTimeout < new Date().getTime()+20000)
                signatureSheet = null;
        }
        if (signatureSheet == null)
        {
            signatureSheet = await eim.signatureSheet(60000,repo.selectedServerProxy == null ? repo.selectedServer : repo.selectedServerProxy);
            //THIS IS NOT OK, THE KEY INTO THE CACHE SHOULD NOT BE THE SERVER NAME!!!!!!!!!!
            signatureSheetCache[p.shortId()] = signatureSheet;
            global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.INFO, "CassSigSheetCreated", `Securing Proxy: Created signature sheet for request from ${email}.`, signatureSheet);
        }
        else
            global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.INFO, "CassSigSheetCreated", `Securing Proxy: Reused signature sheet for request from ${email}.`, signatureSheet);
        req.headers.signatureSheet = signatureSheet;
        req.eim = eim;
    }
    next();
});
let signatureSheetCache = {};

if (process.env.CASS_IP_ALLOW != null || process.env.CASS_SSO_ACCOUNT_REQUIRED != null)
{
    app.use(async function (req, res, next) {
        let debug = true;
        let ipFilter = process.env.CASS_IP_ALLOW | "";
        ipFilter += ",::ffff:127.0.0.1";
        let allowed = false;
        if (req.originalUrl == global.baseUrl + "/callback")
            {if (debug) console.log("Permitted by: " + 'sso callback');allowed = true;} //Indirect remote access is permitted (reverse proxies, etc)
        if (req.headers['x-client-ip'] != null && ipFilter.indexOf(req.headers['x-client-ip']) != -1)
            {if (debug) console.log("Permitted by: " + 'x-client-ip' + ": " + req.headers['x-client-ip']);allowed = true;} //Indirect remote access is permitted (reverse proxies, etc)
        if (req.headers['x-forwarded-for'] != null && ipFilter.indexOf(req.headers['x-forwarded-for']) != -1)
            {if (debug) console.log("Permitted by: " + 'x-forwarded-for' + ": " + req.headers['x-forwarded-for']);allowed = true;} //Indirect remote access is permitted (reverse proxies, etc)
        if (req.headers['cf-connecting-ip'] != null && ipFilter.indexOf(req.headers['cf-connecting-ip']) != -1)
            {if (debug) console.log("Permitted by: " + 'cf-connecting-ip' + ": " + req.headers['cf-connecting-ip']);allowed = true;} //Indirect remote access is permitted (reverse proxies, etc)
        if (req.headers['fastly-client-ip'] != null && ipFilter.indexOf(req.headers['fastly-client-ip']) != -1)
            {if (debug) console.log("Permitted by: " + 'fastly-client-ip' + ": " + req.headers['fastly-client-ip']);allowed = true;} //Indirect remote access is permitted (reverse proxies, etc)
        if (req.headers['true-client-ip'] != null && ipFilter.indexOf(req.headers['true-client-ip']) != -1)
            {if (debug) console.log("Permitted by: " + 'true-client-ip' + ": " + req.headers['true-client-ip']);allowed = true;} //Indirect remote access is permitted (reverse proxies, etc)
        if (req.headers['x-real-ip'] != null && ipFilter.indexOf(req.headers['x-real-ip']) != -1)
            {if (debug) console.log("Permitted by: " + 'x-real-ip' + ": " + req.headers['x-real-ip']);allowed = true;} //Indirect remote access is permitted (reverse proxies, etc)
        if (req.headers['x-cluster-client-ip'] != null && ipFilter.indexOf(req.headers['x-cluster-client-ip']) != -1)
            {if (debug) console.log("Permitted by: " + 'x-cluster-client-ip' + ": " + req.headers['x-cluster-client-ip']);allowed = true;} //Indirect remote access is permitted (reverse proxies, etc)
        if (req.headers['x-forwarded'] != null && ipFilter.indexOf(req.headers['x-forwarded']) != -1)
            {if (debug) console.log("Permitted by: " + 'x-forwarded' + ": " + req.headers['x-forwarded']);allowed = true;} //Indirect remote access is permitted (reverse proxies, etc)
        if (req.connection != null && req.connection.remoteAddress != null && ipFilter.indexOf(req.connection.remoteAddress) != -1)
            {if (debug) console.log("Permitted by: " + 'connection' + ": " + req.connection.remoteAddress);allowed = true;} //Remote address is permitted. (vpns, direct access)
        if (req.socket != null && req.socket.remoteAddress != null && ipFilter.indexOf(req.socket.remoteAddress) != -1)
            {if (debug) console.log("Permitted by: " + 'socket' + ": " + req.socket.remoteAddress);allowed = true;} //Remote address is permitted. (vpns, direct access)
        if (req.connection != null && req.connection.socket != null && req.connection.socket.remoteAddress != null && ipFilter.indexOf(req.connection.socket.remoteAddress) != -1)
            {if (debug) console.log("Permitted by: " + 'connectionSocket' + ": " + req.connection.socket.remoteAddress);allowed = true;} //Remote address is permitted. (vpns, direct access)
        if (req.info != null && req.info.remoteAddress != null && ipFilter.indexOf(req.info.remoteAddress) != -1)
            {if (debug) console.log("Permitted by: " + 'info' + ": " + req.info.remoteAddress);allowed = true;} //Remote address is permitted. (vpns, direct access)
        if (process.env.CASS_SSO_ACCOUNT_REQUIRED != null)
        if (req.eim != null && req.eim.ids.length >= parseInt(process.env.CASS_SSO_ACCOUNT_REQUIRED))
            {if (debug) console.log("Permitted by: " + 'sso ids > '+ process.env.CASS_SSO_ACCOUNT_REQUIRED + ": " + req.eim.ids.length);allowed = true;} //In a permissioned group.
        if (!allowed)
        {            
            global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.WARNING, "CassIpAllowDenied", "DENIED BY CASS_IP_ALLOW.",JSON.stringify( {
                allowed,
                headers:req.headers,
                connections:{
                    connection:(req.connection != null && req.connection.remoteAddress != null) ? req.connection.remoteAddress:null,
                    socket:(req.socket != null && req.socket.remoteAddress != null) ? req.socket.remoteAddress : null,
                    connectionSocket:(req.connection != null && req.connection.socket != null && req.connection.socket.remoteAddress != null) ? req.connection.socket.remoteAddress : null,
                    info:(req.info != null && req.info.remoteAddress != null) ? req.info.remoteAddress : null
                },
                eim: req.eim != null ? req.eim.ids.map(i=>i.displayName) : null
            }),"Use forwarding headers: x-client-ip, x-forwarded-for, cf-connecting-ip, fastly-client-ip, true-client-ip, x-real-ip, x-cluster-client-ip, x-forwarded");
            if (process.env.CASS_IP_DENIED_REDIRECT)
            {
                res.redirect(process.env.CASS_IP_DENIED_REDIRECT);
                res.end();
            }
            else
            {
                res.status(403);
                res.end();
            }
        }
        else
            next();
    });
}

