const sharedAdminCache = require("../util/sharedAdminCache.js");

module.exports = function (common) {
    const { getPk, getPkCache, getPersonCache, skyrepoAdminPpk, skyrepoAdminKey, allowEnvEmails, envEmailArray } = common;

    let signatureSheetCache = {};

    app.use(async function (req, res, next) {
        let email = null;
        let identifier = null;
        let name = null;
        let username = null;
        if ((process.env.AUTH_OVERRIDE || global.AUTH_OVERRIDE) != null) {
            req.user = JSON.parse(process.env.AUTH_OVERRIDE || global.AUTH_OVERRIDE);
            let ppk = getPkCache[req.user.email];
            if (getPkCache[req.user.email] == null)
                ppk = getPkCache[req.user.email] = EcPpk.fromPem(process.env.AUTH_OVERRIDE_KEY || global.AUTH_OVERRIDE_KEY).toPem();
            if (getPersonCache[EcPpk.fromPem(ppk).toPk().toPem()] == null) {
                let p = new EcPerson();
                p.addOwner(EcPpk.fromPem(ppk).toPk());
                p.assignId(repo.selectedServerProxy == null ? repo.selectedServer : repo.selectedServerProxy, EcPpk.fromPem(ppk).toPk().fingerprint());
                p.name = req.user.name;
                p.email = req.user.email;
                p.identifier = req.user.sub;
                getPersonCache[EcPpk.fromPem(ppk).toPk().toPem()] = p;
            }
            global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.WARNING, "CaSSFalsifyingIdentity", "Falsifying identity for testing purposes.", req.user, EcPpk.fromPem(process.env.AUTH_OVERRIDE_KEY || global.AUTH_OVERRIDE_KEY).toPk().toPem());
        }
        if (req.user != null) {
            if (req.user.iat != null) {
                let secondsSinceEpoch = req.user.iat;
                if (secondsSinceEpoch * 1000 < new Date().getTime() + 20000) {
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
        if (req.oidc?.user != null) {
            name = req.oidc.user.name;
            identifier = req.oidc.user.sub;
            email = req.oidc.user.email;
            username = req.oidc.user.preferred_username;
            if (email == null)
                global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.INFO, "CassOidcMissEmail", "OIDC token does not have email address.");
        }
        if (req.client?.authorized) {
            let cert = req.socket.getPeerCertificate();
            if (cert.subject != null) {
                email = cert.subject.emailAddress;
                name = cert.subject.CN;
            }
        }
        if (email != null) {
            global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.NETWORK, "CassAuthSigSheetCreating", `Securing Proxy: Creating signature sheet for request from ${email}.`);
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
                    if (group.toLowerCase().startsWith("admin")) {
                        i.ppk = skyrepoAdminKey();
                    }
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
                        p.ssoSignature = await EcRsaOaepAsync.sign(skyrepoAdminKey(), i.ppk.toPk().toPem());
                        p.assignId(repo.selectedServerProxy == null ? repo.selectedServer : repo.selectedServerProxy, i.ppk.toPk().fingerprint());
                        p.name = group.replaceAll(/_/g, " ").replace("fp", "").replace("FP", "").replace("Cont", "Contributor").replace("Read", "Reader").trim();
                        await repo.saveTo(p);
                    }
                }
            }
            let p = getPersonCache[i.ppk.toPk().toPem()];
            if (p == null)
                try {
                    p = await EcPerson.getByPk(repo, i.ppk.toPk(), null, null, eim);
                    getPersonCache[i.ppk.toPk().toPem()] = p;
                } catch (ex) {
                    global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.INFO, "CassAuthPersonNotFound", "Could not find person.", ex);
                }
            if (p == null) {
                global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.INFO, "CassAuthCreatingPerson", "Creating person.", i.ppk.toPk().fingerprint());
                p = new EcPerson();
                p.addOwner(i.ppk.toPk());
                p.assignId(repo.selectedServerProxy == null ? repo.selectedServer : repo.selectedServerProxy, i.ppk.toPk().fingerprint());
                p.name = name;
                p.email = email;
                p.identifier = identifier;
                p.username = username;
                p.ssoSignature = await EcRsaOaepAsync.sign(EcPpk.fromPem(skyrepoAdminPpk()), i.ppk.toPk().toPem());
                await repo.saveTo(p);
            }
            let signatureSheet = signatureSheetCache[p.shortId()];
            if (signatureSheet != null) {
                let maxTimeout = 0;
                let ss = JSON.parse(signatureSheet);
                for (let o of ss)
                    maxTimeout = Math.max(maxTimeout, o.expiry);
                if (maxTimeout < new Date().getTime() + 20000)
                    signatureSheet = null;
            }
            if (signatureSheet == null) {
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

                signatureSheetCache[p.shortId()] = signatureSheet;
                global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.NETWORK, "CassSigSheetCreated", `Securing Proxy: Created signature sheet for request from ${email}.`);
            }
            else
                global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.NETWORK, "CassSigSheetCreated", `Securing Proxy: Reused signature sheet for request from ${email}.`);
            req.headers.signatureSheet = signatureSheet;
            req.eim = eim;
        }
        next();
    });
};
