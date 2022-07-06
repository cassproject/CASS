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
            if (secondsSinceEpoch * 1000 + 600000 < new Date().getTime())
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
        let myKey = loadConfigurationFile("keys/"+email, () => {
            return EcPpk.fromPem(rsaGenerate()).toPem();
        });
        let i = new EcIdentity();
        i.displayName = name;
        i.ppk = EcPpk.fromPem(myKey);
        eim.addIdentity(i);
        let p = null;
        try{
            p = await EcPerson.getByPk(repo,i.ppk.toPk(),null,null,eim);
        }catch(ex){
            global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.INFO, "CassAuthPersonNotFound", "Could not find person.");
        }
        if (p == null)
        {
            global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.INFO, "CassAuthCreatingPerson", "Creating person.");
            p = new EcPerson();
            p.addOwner(i.ppk.toPk());
            p.assignId(repo.selectedServerProxy == null ? repo.selectedServer : repo.selectedServerProxy,i.ppk.toPk().fingerprint());
            p.name = name;
            p.email = email;
            await repo.saveTo(p);
        }
        let signatureSheet = await eim.signatureSheet(60000,repo.selectedServerProxy == null ? repo.selectedServer : repo.selectedServerProxy);
        req.headers.signatureSheet = signatureSheet;
        req.eim = eim;
        global.auditLogger.report(global.auditLogger.LogCategory.AUTH, global.auditLogger.Severity.INFO, "CassSigSheetCreated", `Securing Proxy: Created signature sheet for request from ${email}.`, signatureSheet);
    }
    next();
});
