const fs = require('fs');
const sharedAdminCache = require("./util/sharedAdminCache.js");

let keyEim = null;

let getPkCache = {};
let getPersonCache = {};
var skyrepoAdminPpk = function() {
    if (!fs.existsSync("etc/skyAdmin2.pem")) 
        fileSave(EcPpk.fromPem(rsaGenerate()).toPem(), "etc/skyAdmin2.pem");
    return EcPpk.fromPem(fileToString(fileLoad("etc/skyAdmin2.pem"))).toPem();
};
const skyrepoAdminKey = function () {
    if (!fs.existsSync('etc/skyAdmin2.pem')) {
        fileSave(EcPpk.fromPem(rsaGenerate()).toPem(), 'etc/skyAdmin2.pem');
    }
    return EcPpk.fromPem(fileToString(fileLoad('etc/skyAdmin2.pem')));
};

function interpretAdminCSV(envCSV) {
    if (envCSV == undefined || typeof envCSV !== "string" || envCSV === "")
        return [];

    return envCSV.split(",");
}

// Optional Admin Config
const allowEnvEmails = process.env.AUTH_ALLOW_ENV_ADMINS == "true";
const envEmailArray = interpretAdminCSV(process.env.AUTH_ENV_ADMIN_EMAILS);

let getPk = async(identifier) => {
    if (getPkCache[identifier] != null)
    {
        return getPkCache[identifier];
    }
    global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.DEBUG, 'AuthLookingIdentifier', "Looking for " + identifier);
    if (process.env.CASS_ELASTIC_KEYSTORE != true && process.env.CASS_ELASTIC_KEYSTORE != 'true')
        return loadConfigurationFile("keys/"+identifier, () => {
            return EcPpk.fromPem(rsaGenerate()).toPem();
        });
    if (keyEim == null)
    {
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.NOTICE, 'AuthCreatingIdentifier', "Establishing skyId Elastic EIM.");
        keyEim = new EcIdentityManager();
        let i = new EcIdentity();
        i.displayName = "Key Manager";
        i.ppk = EcPpk.fromPem(loadConfigurationFile("skyId.pem", function() {
            global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.NOTICE, 'AuthGeneratingEIMFingerprint', "Generating SkyId Elastic EIM fingerprint.");
            return EcPpk.fromPem(rsaGenerate()).toPem();
        }));
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'AuthEIMFingerprint', "SkyId Elastic EIM fingerprint: " + i.ppk.toPk().fingerprint());
        keyEim.addIdentity(i);
    }
    let myKey = loadConfigurationFile("keys/"+identifier, () => {
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'AuthFindKeyDirectoryFail', "Could not find " + identifier + " in file system.");
        return null;
    });
    
    let identityPrefix = process.env.CASS_ELASTIC_KEYSTORE_ENDPOINT || "http://identity/api/"; // NOSONAR -- This is being used as a URI.
    let keypair = new EcRemoteLinkedData();
    if (myKey != null)
    {
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'AuthFoundFileSystemKeypair', "Found file system keypair. Securing and saving to Elastic.");
        loadConfigurationFile("keys/backup/" + identifier, () => {
            global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'AuthFoundFileKeypairBackupSaved', "Saved to backup location.");
            return myKey;
        });
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'AuthFoundFileKeypairDeleted', "Deleting old keypair file.");
        fs.unlinkSync("etc/keys/"+identifier);
        let keypair = new EcRemoteLinkedData();
        keypair.context = "https://schema.cassproject.org/0.4/";
        keypair.type = "KeyPair";
        keypair.addOwner(keyEim.ids[0].ppk.toPk());
        keypair.assignId(identityPrefix,keyEim.ids[0].ppk.toPk().fingerprint() + ":" + identifier);
        keypair.ppk = myKey;
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'AuthFoundElasticKeypairSaved', "Saving Elastic keypair to: " + keypair.shortId());
        await repo.saveTo(await EcEncryptedValue.toEncryptedValue(keypair),null,null,keyEim);
    }
    if (myKey == null)
    {
        let keypair = new EcRemoteLinkedData();
        keypair.context = "https://schema.cassproject.org/0.4/";
        keypair.type = "KeyPair";
        keypair.assignId(identityPrefix, keyEim.ids[0].ppk.toPk().fingerprint() + ":" + identifier);
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'AuthElasticKeypairRead', "Reading Elastic keypair from: " + keypair.shortId());
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
        keypair.assignId(identityPrefix, keyEim.ids[0].ppk.toPk().fingerprint() + ":" + identifier);
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'AuthElasticKeypairRead2', "Reading Elastic keypair (again) from: " + keypair.shortId());
        keypair = await EcRepository.get(keypair.shortId(),null,null,repo,keyEim);
        if (keypair != null)
            keypair = await EcEncryptedValue.fromEncryptedValue(keypair,null,null,keyEim);
        if (keypair != null)
            myKey = keypair.ppk;
    }
    if (myKey == null)
    {
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'AuthElasticKeypairCreate', "Could not find Elastic keypair. Generating a new one.");
        let keypair = new EcRemoteLinkedData();
        keypair.context = "https://schema.cassproject.org/0.4/";
        keypair.type = "KeyPair";
        keypair.addOwner(keyEim.ids[0].ppk.toPk());
        keypair.assignId(identityPrefix,keyEim.ids[0].ppk.toPk().fingerprint() + ":" + identifier);
        myKey = keypair.ppk = EcPpk.fromPem(rsaGenerate()).toPem();
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'AuthElasticKeypairSave', "Saving Elastic keypair to: " + keypair.shortId());
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
                scope: 'openid profile email microprofile-jwt'
            },
            authRequired: false
        })
    );
    app.get(global.baseUrl + '/api/login', (req, res) => {
        res.oidc.login({
            returnTo: req.query.redirectUrl || '/',
            authorizationParams: {
                scope: 'openid profile email microprofile-jwt',
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

if (process.env.CASS_PLATFORM_ONE_AUTH_ENABLED)
{
    /**
     * Extract the encoded JWT from the request's provided Authorization header.
     * @param {String} authHeader 
     * @returns 
     */
    function parseHeader(authHeader) {
        if (!authHeader || !authHeader.startsWith("Bearer "))
            return null;
    
        let tokenStr = authHeader.slice(7);
        let parsed = parseJwt(tokenStr);
        
        return parsed;
    }
    
    /**
     * Parse the JWT's body string into a JSON object.
     * @param {String} tokenStr 
     * @returns 
     */
    function parseJwt (tokenStr) {
        let parts = tokenStr.split('.');
        let bodyEncodedB64 = parts[1];
        let bodyDecodedStr = Buffer.from(bodyEncodedB64, 'base64').toString();
        let bodyDecoded = JSON.parse(bodyDecodedStr);
    
        return bodyDecoded;
    }

    function interpretEnvFlag(envFlag) {
        return envFlag == "true";
    }

    function interpretEnvCSV(envCSV) {
        if (envCSV == undefined || typeof envCSV !== "string" || envCSV === "")
            return null;

        return envCSV.split(",");
    }

    /** @param {String} uuid */
    function numberFromUUID(uuid) {
        let hex = Buffer.from(uuid).toString("hex");
        return parseInt(hex, 16);
    }

    let adjectives = null;
    let nouns = null;

    function createAdjectiveFrom(uuid) {

        if (adjectives == null)
            adjectives = interpretEnvCSV(process.env.CASS_PLATFORM_ONE_AUTH_ADJECTIVES);

        if (adjectives != null && adjectives.length > 0)
        {
            let uuidNumber = numberFromUUID(uuid);
            let index = uuidNumber % adjectives.length;

            return adjectives[index];
        }
        
        return "Anonymous";
    }

    function createNounFrom(uuid) {

        if (nouns == null)
            nouns = interpretEnvCSV(process.env.CASS_PLATFORM_ONE_AUTH_NOUNS);

        if (nouns != null && nouns.length > 0)
        {
            let uuidNumber = numberFromUUID(uuid);
            let index = uuidNumber % nouns.length;

            return nouns[index];
        }

        return "User";
    }
    
    /**
     * Validate whether this token has the expectd Platform One properties.
     * @param {Object} token 
     * @returns 
     */
    function validateJwt (token) {

        if (token == null)
            return false;

        let checkIssuer = interpretEnvFlag(process.env.CASS_PLATFORM_ONE_AUTH_CHECK_ISSUER);
        if (checkIssuer) {
            let expectedIssuer = process.env.CASS_PLATFORM_ONE_ISSUER;
            let actualIssuer = token.iss;
            if (actualIssuer !== expectedIssuer)
                return false;
        }

        let checkClient = interpretEnvFlag(process.env.CASS_PLATFORM_ONE_AUTH_CHECK_CLIENT);
        if (checkClient) {
            let expectedClient = process.env.CASS_PLATFORM_ONE_CLIENT;
            let actualClient = token.azp;
            if (actualClient !== expectedClient)
                return false;
        }

        let ignoreIssueTime = interpretEnvFlag(process.env.CASS_PLATFORM_ONE_AUTH_IGNORE_ISSUE_TIME);
        if (!ignoreIssueTime)
        {
            if (token.iat == undefined)
                return false;

            let secondsSinceEpoch = token.iat;
            if (secondsSinceEpoch * 1000 < new Date().getTime() + 20000)
                return false;
        }

        let uuid = token.sub;
        if (typeof uuid !== "string" || uuid.length !== 36)
            return false;

        return true;
    }
    
    app.use((req, res, next) => {
        
        let authHeader = req.get("Authorization");
        let token = parseHeader(authHeader);

        let seemsValid = validateJwt(token);
        if (seemsValid)
        {
            let shouldAnonymize = interpretEnvFlag(process.env.CASS_PLATFORM_ONE_AUTH_ANONYMIZE_USERS);
            if (shouldAnonymize)
            {
                let adjective = createAdjectiveFrom(token.sub);
                let noun = createNounFrom(token.sub);

                token.name = `${adjective} ${noun}`;
                token.email = token.sub;
            }

            req.p1 = token;
        }
        
        next();
    });
}

app.use(async function (req, res, next) {
    let email = null;
    let identifier = null;
    let name = null;
    let username = null;
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
    if (req.p1 != null) {
        if (req.p1.name != null)
            name = req.p1.name;
        if (req.p1.email != null)
            email = req.p1.email;
        if (req.p1.sub != null)
            identifier = req.p1.sub;
    }
    if (req.oidc?.user != null)
    {
        name = req.oidc.user.name;
        identifier = req.oidc.user.sub;
        email = req.oidc.user.email;
        username = req.oidc.user.preferred_username;
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
        let myKey = await getPk(email);
        let i = new EcIdentity();
        i.displayName = name;
        i.ppk = EcPpk.fromPem(myKey);
        eim.addIdentity(i);
        if (req.oidc?.user?.groups != null) {
            for (const group of req.oidc?.user?.groups ?? []) {
                let myKey = await getPk(group);
                let i = new EcIdentity();
                i.displayName = group.replaceAll(/_/g, " ").trim();
                i.ppk = EcPpk.fromPem(myKey);
                eim.addIdentity(i);
                let p = getPersonCache[i.ppk.toPk().toPem()];
                if (p == null)
                    try {
                        p = await EcPerson.getByPk(repo, i.ppk.toPk(), null, null, eim);
                        getPersonCache[i.ppk.toPk().toPem()] = p;
                    } catch (ex) {
                        global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.INFO, "CassAuthPersonNotFound", "Could not find organization.", ex);
                    }
                if (p == null) {
                    global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.INFO, "CassAuthCreatingPerson", "Creating organization.", i.ppk.toPk().fingerprint());
                    p = new EcPerson();
                    p.addOwner(i.ppk.toPk());
                    p.ssoSignature = await EcRsaOaepAsync.sign(EcPpk.fromPem(skyrepoAdminPpk()), i.ppk.toPk().toPem());
                    p.assignId(repo.selectedServerProxy == null ? repo.selectedServer : repo.selectedServerProxy, i.ppk.toPk().fingerprint());
                    p.name = group.replaceAll(/_/g, " ").replace("fp", "").replace("FP", "").replace("Cont", "Contributor").replace("Read", "Reader").trim();
                    await repo.saveTo(p);
                }
            }
        }
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
            p.identifier = identifier;
            p.username = username;
            p.ssoSignature = await EcRsaOaepAsync.sign(EcPpk.fromPem(skyrepoAdminPpk()), i.ppk.toPk().toPem());
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
            let signatureServer = repo.selectedServerProxy == null ? repo.selectedServer : repo.selectedServerProxy;

            signatureSheet = await eim.signatureSheet(6000000, signatureServer, null, null, "SHA-256");
            
            let considerUserAnAdmin = allowEnvEmails && envEmailArray.includes(email);
            if (considerUserAnAdmin && signatureSheet != null) {

                let adminKey = skyrepoAdminKey();
                let adminSignature = await eim.createSignature(6000000, signatureServer, adminKey, "SHA-256");

                let signatureSheetObj = JSON.parse(signatureSheet);
                let adminSignatureObj = JSON.parse(JSON.stringify(adminSignature));
                
                global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.INFO, "CassSigSheetCreated", `Securing Proxy: Adding ADMIN signature for due to ENV config for ${email}.`, signatureSheet);

                signatureSheetObj.push(adminSignatureObj);
                signatureSheet = JSON.stringify(signatureSheetObj);
                
                let userPublicKeyStr = signatureSheetObj[0]["@owner"];
                sharedAdminCache.addPublicKeyToKnownAdmins(userPublicKeyStr);
            }

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
        let ipFilter = process.env.CASS_IP_ALLOW || "";
        ipFilter += ",::ffff:127.0.0.1";
        let ipFilterList = ipFilter.split(",");
        let allowed = false;
        req.permittedBy = [];
        if (req.originalUrl == global.baseUrl + "/callback")
            {req.permittedBy.push("Permitted by: " + 'sso callback');allowed = true;} //SSO is permitted
        if (req.originalUrl == global.baseUrl + "/login")
            {req.permittedBy.push("Permitted by: " + 'sso callback');allowed = true;} //SSO redirect is permitted
        if (req.originalUrl == global.baseUrl + "/logout")
            {req.permittedBy.push("Permitted by: " + 'sso callback');allowed = true;} //SSO redirect is permitted
        if (req.originalUrl == global.baseUrl + "/api/ping")
            {req.permittedBy.push("Permitted by: " + 'sso callback');allowed = true;} //Health check is permitted
        if (req.headers['x-client-ip'] != null && ipMatch(ipFilterList,req.headers['x-client-ip']))
            {req.permittedBy.push("Permitted by: " + 'x-client-ip' + ": " + req.headers['x-client-ip']);allowed = true;} //Indirect remote access is permitted (reverse proxies, etc)
        if (req.headers['x-forwarded-for'] != null && ipMatch(ipFilterList,req.headers['x-forwarded-for']))
            {req.permittedBy.push("Permitted by: " + 'x-forwarded-for' + ": " + req.headers['x-forwarded-for']);allowed = true;} //Indirect remote access is permitted (reverse proxies, etc)
        if (req.headers['cf-connecting-ip'] != null && ipMatch(ipFilterList,req.headers['cf-connecting-ip']))
            {req.permittedBy.push("Permitted by: " + 'cf-connecting-ip' + ": " + req.headers['cf-connecting-ip']);allowed = true;} //Indirect remote access is permitted (reverse proxies, etc)
        if (req.headers['fastly-client-ip'] != null && ipMatch(ipFilterList,req.headers['fastly-client-ip']))
            {req.permittedBy.push("Permitted by: " + 'fastly-client-ip' + ": " + req.headers['fastly-client-ip']);allowed = true;} //Indirect remote access is permitted (reverse proxies, etc)
        if (req.headers['true-client-ip'] != null && ipMatch(ipFilterList,req.headers['true-client-ip']))
            {req.permittedBy.push("Permitted by: " + 'true-client-ip' + ": " + req.headers['true-client-ip']);allowed = true;} //Indirect remote access is permitted (reverse proxies, etc)
        if (req.headers['x-real-ip'] != null && ipMatch(ipFilterList,req.headers['x-real-ip']))
            {req.permittedBy.push("Permitted by: " + 'x-real-ip' + ": " + req.headers['x-real-ip']);allowed = true;} //Indirect remote access is permitted (reverse proxies, etc)
        if (req.headers['x-cluster-client-ip'] != null && ipMatch(ipFilterList,req.headers['x-cluster-client-ip']))
            {req.permittedBy.push("Permitted by: " + 'x-cluster-client-ip' + ": " + req.headers['x-cluster-client-ip']);allowed = true;} //Indirect remote access is permitted (reverse proxies, etc)
        if (req.headers['x-forwarded'] != null && ipMatch(ipFilterList,req.headers['x-forwarded']))
            {req.permittedBy.push("Permitted by: " + 'x-forwarded' + ": " + req.headers['x-forwarded']);allowed = true;} //Indirect remote access is permitted (reverse proxies, etc)
        if (req.connection?.remoteAddress != null && ipMatch(ipFilterList,req.connection.remoteAddress))
            {req.permittedBy.push("Permitted by: " + 'connection' + ": " + req.connection.remoteAddress);allowed = true;} //Remote address is permitted. (vpns, direct access)
        if (req.socket?.remoteAddress != null && ipMatch(ipFilterList,req.socket.remoteAddress))
            {req.permittedBy.push("Permitted by: " + 'socket' + ": " + req.socket.remoteAddress);allowed = true;} //Remote address is permitted. (vpns, direct access)
        if (req.connection?.socket?.remoteAddress != null && ipMatch(ipFilterList,req.connection.socket.remoteAddress))
            {req.permittedBy.push("Permitted by: " + 'connectionSocket' + ": " + req.connection.socket.remoteAddress);allowed = true;} //Remote address is permitted. (vpns, direct access)
        if (req.info?.remoteAddress != null && ipMatch(ipFilterList,req.info.remoteAddress))
            {req.permittedBy.push("Permitted by: " + 'info' + ": " + req.info.remoteAddress);allowed = true;} //Remote address is permitted. (vpns, direct access)
        if (process.env.CASS_SSO_ACCOUNT_REQUIRED != null)
        if (req.eim != null && req.eim.ids.length >= parseInt(process.env.CASS_SSO_ACCOUNT_REQUIRED))
            {req.permittedBy.push("Permitted by: " + 'sso ids > '+ process.env.CASS_SSO_ACCOUNT_REQUIRED + ": " + req.eim.ids.length);allowed = true;} //In a permissioned group.
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

var Address = require('ipaddr.js');

//Source: https://github.com/KennyTangHK/express-ip-access-control/blob/master/LICENSE
/*
The MIT License (MIT)

Copyright (c) 2015 Kenny Tang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
var isNumeric = function(n) { return !isNaN(parseFloat(n)) && isFinite(n); };

var ipMatch = function(list,clientIp) {
	if (clientIp && Address.isValid(clientIp)) {
		// `Address.process` return the IP instance in IPv4 or IPv6 form.
		// It will return IPv4 instance if it's a IPv4 mapped IPv6 address
		clientIp = Address.process(clientIp);
		return list.some(function(e) {
			// IPv6 address has 128 bits and IPv4 has 32 bits.
			// Setting the routing prefix to all bits in a CIDR address means only the specified address is allowed.
			e = e || '';
			e = e.indexOf('/') === -1 ? e + '/128' : e;
			var range = e.split('/');
			if (range.length === 2 && Address.isValid(range[0]) && isNumeric(range[1])) {
				var ip = Address.process(range[0]);
				var bit = parseInt(range[1], 10);

				// `IP.kind()` return `'ipv4'` or `'ipv6'`. Only same type can be `match`.
				if (clientIp.kind() === ip.kind()) {
					return clientIp.match(ip, bit);
				}
			}
			return false;
		});
	}
	return false;
};
