global.axios = require('axios');
let chai = require('chai');
const EcAes = require('cassproject/src/com/eduworks/ec/crypto/EcAes');
const EcRemoteIdentityManager = require('cassproject/src/org/cassproject/ebac/identity/remote/EcRemoteIdentityManager');
const EcIdentityManager = require('cassproject/src/org/cassproject/ebac/identity/EcIdentityManager');
const EcIdentity = require('cassproject/src/org/cassproject/ebac/identity/EcIdentity');
const EcPpk = require('cassproject/src/com/eduworks/ec/crypto/EcPpk');

let assert = chai.assert;

describe('SkyID Adapter', function() {
    this.timeout(30000);
    let username = EcAes.newIv(6);
    let password = EcAes.newSecret(6);
    let newPassword = EcAes.newSecret(6);
    let name = 'Test User';
    let ident = null;

    it('create user', async () => {
        let rld = new EcRemoteIdentityManager();
        rld.server = 'http://localhost/api/';
        await rld.configureFromServer(null, null);
        rld.startLogin(username, password);
        let im = new EcIdentityManager();
        await rld.create(null, null, im);
        im = await rld.fetch();
        ident = new EcIdentity();
        ident.ppk = await EcPpk.generateKeyAsync(null, null);
        ident.displayName = name;
        im.addIdentity(ident);
        await rld.commit(null, null, im);
    }).timeout(2000);

    it('change password', async () => {
        let rld = new EcRemoteIdentityManager();
        rld.server = 'http://localhost/api/';
        await rld.configureFromServer(null, null);
        rld.startLogin(username, password);
        let im = await rld.fetch();
        assert.equal(im.ids[0].ppk.toPem(), ident.ppk.toPem());
        rld.changePassword(username, password, newPassword);
        await rld.commit(null, null, im);
    }).timeout(2000);

    it('load user', async () => {
        let rld = new EcRemoteIdentityManager();
        rld.server = 'http://localhost/api/';
        await rld.configureFromServer(null, null);
        rld.startLogin(username, newPassword);
        let im = await rld.fetch();
        assert.equal(im.ids[0].ppk.toPem(), ident.ppk.toPem());
    }).timeout(2000);
});
