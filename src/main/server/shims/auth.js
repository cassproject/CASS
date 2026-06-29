const fs = require('fs');
const path = require('path');
const jose = require('jose');
const sanitize = require("sanitize-filename");

// Cached JWKS remote key set for Bearer token validation (MCP/API clients)
let cachedJWKS = null;
let jwksIssuer = null;
function getJWKS() {
    const issuerUrl = (process.env.CASS_OIDC_ISSUER_BASE_URL || '').replace(/\/$/, '');
    if (!issuerUrl) return null;
    // Recreate if issuer changed or not yet initialized
    if (!cachedJWKS || jwksIssuer !== issuerUrl) {
        jwksIssuer = issuerUrl;
        cachedJWKS = jose.createRemoteJWKSet(new URL(issuerUrl + '/protocol/openid-connect/certs'));
    }
    return cachedJWKS;
}
let keyEim = null;

let getPkCache = {};
let getPersonCache = {};
var skyrepoAdminPpk = function () {
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

let getPk = async (identifier) => {
    if (getPkCache[identifier] != null)
        return getPkCache[identifier];
    global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.DEBUG, 'AuthLookingIdentifier', "Looking for " + identifier);
    if (process.env.CASS_ELASTIC_KEYSTORE != true && process.env.CASS_ELASTIC_KEYSTORE != 'true')
        return loadConfigurationFile("keys/" + identifier, () => {
            return EcPpk.fromPem(rsaGenerate()).toPem();
        });
    if (keyEim == null) {
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.NOTICE, 'AuthCreatingIdentifier', "Establishing skyId Elastic EIM.");
        keyEim = new EcIdentityManager();
        let i = new EcIdentity();
        i.displayName = "Key Manager";
        i.ppk = EcPpk.fromPem(loadConfigurationFile("skyId.pem", function () {
            global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.NOTICE, 'AuthGeneratingEIMFingerprint', "Generating SkyId Elastic EIM fingerprint.");
            return EcPpk.fromPem(rsaGenerate()).toPem();
        }));
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'AuthEIMFingerprint', "SkyId Elastic EIM fingerprint: " + i.ppk.toPk().fingerprint());
        keyEim.addIdentity(i);
    }
    global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.DEBUG, "GetPk", "Looking for " + identifier);
    let myKey = loadConfigurationFile("keys/" + identifier, () => {
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'AuthFindKeyDirectoryFail', "Could not find " + identifier + " in file system.");
        return null;
    });

    let identityPrefix = process.env.CASS_ELASTIC_KEYSTORE_ENDPOINT || "http://identity/api/"; // NOSONAR -- This is being used as a URI.
    let keypair = new EcRemoteLinkedData();
    if (myKey != null) {
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'AuthFoundFileSystemKeypair', "Found file system keypair. Securing and saving to Elastic.");
        loadConfigurationFile("keys/backup/" + sanitize(identifier), () => {
            global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'AuthFoundFileKeypairBackupSaved', "Saved to backup location.");
            return myKey;
        });
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'AuthFoundFileKeypairDeleted', "Deleting old keypair file.");
        global.pathCheck(identifier);
        fs.unlinkSync("etc/keys/" + sanitize(identifier));
        let keypair = new EcRemoteLinkedData();
        keypair.context = "https://schema.cassproject.org/0.4/";
        keypair.type = "KeyPair";
        keypair.addOwner(keyEim.ids[0].ppk.toPk());
        keypair.assignId(identityPrefix, keyEim.ids[0].ppk.toPk().fingerprint() + ":" + identifier);
        keypair.ppk = myKey;
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'AuthFoundElasticKeypairSaved', "Saving Elastic keypair to: " + keypair.shortId());
        await repo.saveTo(await EcEncryptedValue.toEncryptedValue(keypair), null, null, keyEim);
    }
    if (myKey == null) {
        let keypair = new EcRemoteLinkedData();
        keypair.context = "https://schema.cassproject.org/0.4/";
        keypair.type = "KeyPair";
        keypair.assignId(identityPrefix, keyEim.ids[0].ppk.toPk().fingerprint() + ":" + identifier);
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'AuthElasticKeypairRead', "Reading Elastic keypair from: " + keypair.shortId());
        keypair = await EcRepository.get(keypair.shortId(), null, null, repo, keyEim);
        if (keypair != null)
            keypair = await EcEncryptedValue.fromEncryptedValue(keypair, null, null, keyEim);
        if (keypair != null)
            myKey = keypair.ppk;
    }
    if (myKey == null && repo.selectedServerProxy != null) {
        let keypair = new EcRemoteLinkedData();
        keypair.context = "https://schema.cassproject.org/0.4/";
        keypair.type = "KeyPair";
        keypair.assignId(identityPrefix, keyEim.ids[0].ppk.toPk().fingerprint() + ":" + identifier);
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'AuthElasticKeypairRead2', "Reading Elastic keypair (again) from: " + keypair.shortId());
        keypair = await EcRepository.get(keypair.shortId(), null, null, repo, keyEim);
        if (keypair != null)
            keypair = await EcEncryptedValue.fromEncryptedValue(keypair, null, null, keyEim);
        if (keypair != null)
            myKey = keypair.ppk;
    }
    if (myKey == null) {
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'AuthElasticKeypairCreate', "Could not find Elastic keypair. Generating a new one.");
        let keypair = new EcRemoteLinkedData();
        keypair.context = "https://schema.cassproject.org/0.4/";
        keypair.type = "KeyPair";
        keypair.addOwner(keyEim.ids[0].ppk.toPk());
        keypair.assignId(identityPrefix, keyEim.ids[0].ppk.toPk().fingerprint() + ":" + identifier);
        myKey = keypair.ppk = EcPpk.fromPem(rsaGenerate()).toPem();
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'AuthElasticKeypairSave', "Saving Elastic keypair to: " + keypair.shortId());
        await repo.saveTo(await EcEncryptedValue.toEncryptedValue(keypair), null, null, keyEim);
    }
    getPkCache[identifier] = myKey;
    return myKey;
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
var isNumeric = function (n) { return !isNaN(parseFloat(n)) && isFinite(n); };

var ipMatch = function (list, clientIp) {
    if (clientIp && Address.isValid(clientIp)) {
        // `Address.process` return the IP instance in IPv4 or IPv6 form.
        // It will return IPv4 instance if it's a IPv4 mapped IPv6 address
        clientIp = Address.process(clientIp);
        return list.some(function (e) {
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

// Common utilities shared across auth modules
const common = {
    getJWKS,
    getPk,
    getPkCache,
    getPersonCache,
    skyrepoAdminPpk,
    skyrepoAdminKey,
    allowEnvEmails,
    envEmailArray,
    ipMatch,
};

// Load auth modules from auth/ directory in alphabetical order
const authDir = path.join(__dirname, 'auth');
fs.readdirSync(authDir)
    .filter(f => f.endsWith('.js'))
    .sort()
    .forEach(mod => require(path.join(authDir, mod))(common));
