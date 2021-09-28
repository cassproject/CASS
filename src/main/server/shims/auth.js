
const { auth } = require('express-openid-connect');
if (process.env.OIDC_ENABLED || true)
{
    app.use(
        auth({
            issuerBaseURL: process.env.CASS_OIDC_ISSUER_BASE_URL || 'https://dev.keycloak.eduworks.com/auth/realms/test-realm/',
            baseURL: process.env.CASS_OIDC_BASE_URL || 'http://localhost/',
            clientID: process.env.CASS_OIDC_CLIENT_ID || 'cass',
            secret: process.env.CASS_OIDC_SECRET || 'a71b92d4-336e-4664-bc05-2226f76b4042',
            authorizationParams: {
                scope: 'openid profile email'
            },
            authRequired: false
        })
    );
    app.get('/api/login', (req, res) => {
        res.oidc.login({
            returnTo: req.query.redirectUrl || '/',
            authorizationParams: {
                scope: 'openid profile email',
            }
        });
    });
    app.get('/api/logout', (req, res) => {
        res.oidc.logout({
            returnTo: req.query.redirectUrl || '/'
        });
    });
}

app.use(async function (req, res, next) {
    let email = null;
    let identifier = null;
    let name = null;
    if (req.oidc?.user != null)
    {
        console.log(req.oidc.user);
        name = req.oidc.user.name;
        identifier = req.oidc.user.sub;
        email = req.oidc.user.email;
        if (email == null)
            console.log("OIDC token does not have email address.");
    }
    if (req.client?.authorized) {
        let cert = req.socket.getPeerCertificate();
        //console.log(cert);
        if (cert.subject != null)
        {
            email = cert.subject.emailAddress;
            name = cert.subject.CN;
        }
    }
    if (email != null)
    {
        console.log(`Securing Proxy: Creating signature sheet for request from ${email}.`)
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
            console.log("Could not find person.");
        }
        if (p == null)
        {
            console.log("Creating person.");
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
    }
    next();
});
