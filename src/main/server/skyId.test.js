let axios = require("axios");
let FormData = require("form-data");
let chai = require("chai");
const EcCrypto = require("cassproject/src/com/eduworks/ec/crypto/EcCrypto");
const EcAes = require("cassproject/src/com/eduworks/ec/crypto/EcAes");
const EcRemoteLinkedData = require("cassproject/src/org/cassproject/schema/general/EcRemoteLinkedData");
const EcRemoteIdentityManager = require("cassproject/src/org/cassproject/ebac/identity/remote/EcRemoteIdentityManager");
const EcIdentityManager = require("cassproject/src/org/cassproject/ebac/identity/EcIdentityManager");
const EcIdentity = require("cassproject/src/org/cassproject/ebac/identity/EcIdentity");
const EcPpk = require("cassproject/src/com/eduworks/ec/crypto/EcPpk");

let hrtime = function() {
    try {
        return [Math.round(performance.now()/1000), performance.now() * 1000];
    } catch (e) {
        // Eat quietly.
    }
    return process.hrtime();
};

var should = chai.should();
var expect = chai.expect;
var assert = chai.assert;


describe("SkyID Adapter", function() {
    this.timeout(30000);
    let username = EcAes.newIv(6);
    let password = EcAes.newSecret(6);
    let name = "Test User";
    let email = username + "@test.cassproject.org";
    let ident = null;

    it('create user', async () => {
        let rld = new EcRemoteIdentityManager();
        rld.server = "http://localhost/api/";
        await rld.configureFromServer(null,null);
        rld.startLogin(username,password);
        let im = new EcIdentityManager();
        await rld.create(null,null,im);
        im = await rld.fetch();
        ident = new EcIdentity();
        ident.ppk = await EcPpk.generateKeyAsync(null,null);
        ident.displayName = name;
        im.addIdentity(ident);
        await rld.commit(null,null,im);
    }).timeout(1000);

    it('change password', async () => {
        let rld = new EcRemoteIdentityManager();
        rld.server = "http://localhost/api/";
        await rld.configureFromServer(null,null);
        rld.startLogin(username,password);
        let im = await rld.fetch();
        assert.equal(im.ids[0].ppk.toPem(),ident.ppk.toPem());
        let newPassword = EcAes.newSecret(6);
        rld.changePassword(username,password,newPassword);
        rld.commit(null,null,im);
    }).timeout(1000);
    
    it('load user', async () => {
        let rld = new EcRemoteIdentityManager();
        rld.server = "http://localhost/api/";
        await rld.configureFromServer(null,null);
        rld.startLogin(username,password);
        let im = await rld.fetch();
        assert.equal(im.ids[0].ppk.toPem(),ident.ppk.toPem());
    }).timeout(1000);

});