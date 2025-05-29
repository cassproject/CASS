const fs = require('fs');
const https = require('https');
let chai = require("chai");
const EcPpk = require('cassproject/src/com/eduworks/ec/crypto/EcPpk');
require("cassproject");

let hrtime = function () {
    try {
        return [Math.round(performance.now() / 1000), performance.now() * 1000];
    } catch (e) {
        try {
            if (typeof process !== 'undefined')
                return process.hrtime();
            return [new Date().getTime(), new Date().getTime() * 1000];
        }
        catch (ex) {
            return [new Date().getTime(), new Date().getTime() * 1000];
        }
    }
};

let should = chai.should();
let expect = chai.expect;
let assert = chai.assert;

after(() => EcRsaOaepAsyncWorker.teardown());

let deleteById = async function (id) {
    await EcRepository.get(
        id,
        function (p1) {
            EcRepository._delete(p1, null, failure);
        }, failure
    );
};
let failure = function (p1) {
    console.trace(p1);
    assert.fail();
};

if (fs.readFileSync != null) {
    https.globalAgent.options.key = fs.readFileSync('client.key');
    https.globalAgent.options.cert = fs.readFileSync('client.crt');
    https.globalAgent.options.ca = fs.readFileSync('ca.crt');
    // global.axiosOptions.key =  fs.readFileSync('client.key');
    // global.axiosOptions.cert = fs.readFileSync('client.crt');
    // global.axiosOptions.ca = fs.readFileSync('ca.crt');
    //When http2 supports client side self-signed certificates, don't use this.
    //process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
}

let changeNameAndSaveAndCheck = async (rld) => {
    let newName = "Some Thing " + EcCrypto.generateUUID();
    rld.setName(newName);
    await repo.saveTo(rld);
    assert.equal((await EcEncryptedValue.fromEncryptedValue(await EcRepository.get(rld.shortId(), null, null, repo))).getName(), newName);
};

let changeNameAndSaveAndCheckRepo = async (rld) => {
    let newName = "Some Thing " + EcCrypto.generateUUID();
    rld.setName(newName);
    await EcRepository.save(rld);
    assert.equal((await EcEncryptedValue.fromEncryptedValue(await EcRepository.get(rld.shortId(), null, null, repo))).getName(), newName);
};

let changeNameAndSaveAndCheckMultiput = async (rld) => {
    let newName = "Some Thing " + EcCrypto.generateUUID();
    rld.setName(newName);
    await repo.multiput([rld]);
    assert.equal((await EcEncryptedValue.fromEncryptedValue(await EcRepository.get(rld.shortId(), null, null, repo))).getName(), newName);
};

let repo = new EcRepository();

let newId1 = null;

describe("EcRepository (SSO L0 Cache)", () => {
    let id = null;
    let rld = null;
    // it('Waiting for server to be ready', async () => {
    //     let ready = false;
    //     global.events.server.ready.subscribe(function (isReady) {
    //         if (!isReady) {
    //             console.log('Server not ready. Skipping tests.');
    //             return;
    //         }
    //         ready = true;
    //     });
    //     while (!ready) { await new Promise((resolve) => setTimeout(resolve, 100)); }
    //     global.AUTH_OVERRIDE = JSON.stringify({name:"Test User", email:"test@test.me", sub:"testUser"});
    //     global.AUTH_OVERRIDE_KEY = "-----BEGIN RSA PRIVATE KEY-----MIIEpAIBAAKCAQEAz4BiFucFE9bNcKfGD+e6aPRHl402YM4Z6nrurDRNlnwsWpsCoZasPLkjC314pVtHAI2duZo+esGKDloBsiLxASRJo3R2XiXVh2Y8U1RcHA5mWL4tMG5UY2d0libpNEHbHPNBmooVYpA2yhxN/vGibIk8x69uZWxJcFOxOg6zWG8EjF8UMgGnRCVSMTY3THhTlfZ0cGUzvrfb7OvHUgdCe285XkmYkj/V9P/m7hbWoOyJAJSTOm4/s6fIKpl72lblfN7bKaxTCsJp6/rQdmUeo+PIaa2lDOfo7dWbuTMcqkZ93kispNfYYhsEGUGlCsrrVWhlve8MenO4GdLsFP+HRwIDAQABAoIBAGaQpOuBIYde44lNxJ7UAdYi+Mg2aqyK81Btl0/TQo6hriLTAAfzPAt/z4y8ZkgFyCDD3zSAw2VWCPFzF+d/UfUohKWgyWlb9iHJLQRbbHQJwhkXV6raviesWXpmnVrROocizkie/FcNxac9OmhL8+cGJt7lHgJP9jTpiW6TGZ8ZzM8KBH2l80x9AWdvCjsICuPIZRjc706HtkKZzTROtq6Z/F4Gm0uWRnwAZrHTRpnh8qjtdBLYFrdDcUoFtzOM6UVRmocTfsNe4ntPpvwY2aGTWY7EmTj1kteMJ+fCQFIS+KjyMWQHsN8yQNfD5/j2uv6/BdSkO8uorGSJT6DwmTECgYEA8ydoQ4i58+A1udqA+fujM0Zn46++NTehFe75nqIt8rfQgoduBam3lE5IWj2U2tLQeWxQyr1ZJkLbITtrAI3PgfMnuFAii+cncwFo805Fss/nbKx8K49vBuCEAq3MRhLjWy3ZvIgUHj67jWvl50dbNqc7TUguxhS4BxGr/cPPkP0CgYEA2nbJPGzSKhHTETL37NWIUAdU9q/6NVRISRRXeRqZYwE1VPzs2sIUxA8zEDBHX7OtvCKzvZy1Lg5Unx1nh4nCEVkbW/8npLlRG2jOcZJF6NRfhzwLz3WMIrP6j9SmjJaB+1mnrTjfsg36tDEPDjjJLjJHCx9z/qRJh1v4bh4aPpMCgYACG31T2IOEEZVlnvcvM3ceoqWT25oSbAEBZ6jSLyWmzOEJwJK7idUFfAg0gAQiQWF9K+snVqzHIB02FIXA43nA7pKRjmA+RiqZXJHEShFgk1y2HGiXGA8mSBvcyhTTJqbBy4vvjl5eRLzrZNwBPSUVPC3PZajCHrvZk9WhxWivIQKBgQCzCu1MH2dy4R7ZlqsIJ8zKweeJMZpfQI7pjclO0FTrhh7+Yzd+5db9A/P2jYrBTVHSwaILgTYf49DIguHJfEZXz26TzB7iapqlWxTukVHISt1ryPNo+E58VoLAhChnSiaHJ+g7GESE+d4A9cAACNwgh0YgQIvhIyW70M1e+j7KDwKBgQDQSBLFDFmvvTP3sIRAr1+0OZWd1eRcwdhs0U9GwootoCoUP/1Y64pqukT6B9oIB/No9Nyn8kUX3/ZDtCslaGKEUGMJXQ4hc5J+lq0tSi9ZWBdhqOuMPEfUF3IxW+9yeILP4ppUBn1m5MVOWg5CvuuEeCmy4bhMaUErUlHZ78t5cA==-----END RSA PRIVATE KEY-----";
    // });
    it('create', async () => {
        EcRepository.caching = false;
        EcRepository.cachingL2 = false;
        EcIdentityManager.default.clearIdentities();
        if ((typeof Cypress !== 'undefined') && Cypress != null && Cypress.env != null)
            process.env.CASS_LOOPBACK = Cypress.env('CASS_LOOPBACK');
        await repo.init(process.env.CASS_LOOPBACK || "http://localhost/api/");
        if (EcIdentityManager.default.ids.length > 0)
            newId1 = EcIdentityManager.default.ids[0];
        else {
            newId1 = new EcIdentity();
            newId1.ppk = EcPpk.fromPem(
                "-----BEGIN RSA PRIVATE KEY-----MIIEpAIBAAKCAQEAz4BiFucFE9bNcKfGD+e6aPRHl402YM4Z6nrurDRNlnwsWpsCoZasPLkjC314pVtHAI2duZo+esGKDloBsiLxASRJo3R2XiXVh2Y8U1RcHA5mWL4tMG5UY2d0libpNEHbHPNBmooVYpA2yhxN/vGibIk8x69uZWxJcFOxOg6zWG8EjF8UMgGnRCVSMTY3THhTlfZ0cGUzvrfb7OvHUgdCe285XkmYkj/V9P/m7hbWoOyJAJSTOm4/s6fIKpl72lblfN7bKaxTCsJp6/rQdmUeo+PIaa2lDOfo7dWbuTMcqkZ93kispNfYYhsEGUGlCsrrVWhlve8MenO4GdLsFP+HRwIDAQABAoIBAGaQpOuBIYde44lNxJ7UAdYi+Mg2aqyK81Btl0/TQo6hriLTAAfzPAt/z4y8ZkgFyCDD3zSAw2VWCPFzF+d/UfUohKWgyWlb9iHJLQRbbHQJwhkXV6raviesWXpmnVrROocizkie/FcNxac9OmhL8+cGJt7lHgJP9jTpiW6TGZ8ZzM8KBH2l80x9AWdvCjsICuPIZRjc706HtkKZzTROtq6Z/F4Gm0uWRnwAZrHTRpnh8qjtdBLYFrdDcUoFtzOM6UVRmocTfsNe4ntPpvwY2aGTWY7EmTj1kteMJ+fCQFIS+KjyMWQHsN8yQNfD5/j2uv6/BdSkO8uorGSJT6DwmTECgYEA8ydoQ4i58+A1udqA+fujM0Zn46++NTehFe75nqIt8rfQgoduBam3lE5IWj2U2tLQeWxQyr1ZJkLbITtrAI3PgfMnuFAii+cncwFo805Fss/nbKx8K49vBuCEAq3MRhLjWy3ZvIgUHj67jWvl50dbNqc7TUguxhS4BxGr/cPPkP0CgYEA2nbJPGzSKhHTETL37NWIUAdU9q/6NVRISRRXeRqZYwE1VPzs2sIUxA8zEDBHX7OtvCKzvZy1Lg5Unx1nh4nCEVkbW/8npLlRG2jOcZJF6NRfhzwLz3WMIrP6j9SmjJaB+1mnrTjfsg36tDEPDjjJLjJHCx9z/qRJh1v4bh4aPpMCgYACG31T2IOEEZVlnvcvM3ceoqWT25oSbAEBZ6jSLyWmzOEJwJK7idUFfAg0gAQiQWF9K+snVqzHIB02FIXA43nA7pKRjmA+RiqZXJHEShFgk1y2HGiXGA8mSBvcyhTTJqbBy4vvjl5eRLzrZNwBPSUVPC3PZajCHrvZk9WhxWivIQKBgQCzCu1MH2dy4R7ZlqsIJ8zKweeJMZpfQI7pjclO0FTrhh7+Yzd+5db9A/P2jYrBTVHSwaILgTYf49DIguHJfEZXz26TzB7iapqlWxTukVHISt1ryPNo+E58VoLAhChnSiaHJ+g7GESE+d4A9cAACNwgh0YgQIvhIyW70M1e+j7KDwKBgQDQSBLFDFmvvTP3sIRAr1+0OZWd1eRcwdhs0U9GwootoCoUP/1Y64pqukT6B9oIB/No9Nyn8kUX3/ZDtCslaGKEUGMJXQ4hc5J+lq0tSi9ZWBdhqOuMPEfUF3IxW+9yeILP4ppUBn1m5MVOWg5CvuuEeCmy4bhMaUErUlHZ78t5cA==-----END RSA PRIVATE KEY-----"
            );
            EcIdentityManager.default.ids = [];
            EcIdentityManager.default.addIdentity(newId1);
        }
        rld = new schema.Thing();
        rld.generateId(repo.selectedServer);
        rld.addOwner(newId1.ppk.toPk());
        rld.setName("Some Thing");
        rld.setDescription("Some Description");
        rld.squirrel = "brown";
        assert.notEqual(EcIdentityManager.default.ids.length, 0);
    });
    it('save (to)', async () => {
        await changeNameAndSaveAndCheck(rld);
    }).timeout(10000);
    it('encrypt and save (to)', async () => {
        EcEncryptedValue.encryptOnSave(rld.shortId(), true);
        await changeNameAndSaveAndCheck(rld);
    }).timeout(10000);
    it('encrypt some more', async () => {
        await changeNameAndSaveAndCheck(rld);
        rld = await EcEncryptedValue.toEncryptedValue(rld);
        rld = await EcEncryptedValue.toEncryptedValue(rld);
        rld = await EcEncryptedValue.toEncryptedValue(rld);
        rld = await EcEncryptedValue.toEncryptedValue(rld);
        rld = await EcEncryptedValue.toEncryptedValue(rld);
        rld = await EcEncryptedValue.toEncryptedValue(rld);
        EcEncryptedValue.encryptOnSave(rld.shortId(), true);
        await repo.saveTo(rld);
    }).timeout(10000);
    it('search', async () => {
        let results = await repo.search(`@id:"${rld.shortId()}"`);
        assert.equal(results.length, 1);
        assert.equal(results[0].shortId(), rld.shortId());
        results[0] = await EcEncryptedValue.fromEncryptedValue(results[0]);
        assert.equal(results[0].squirrel, "brown");
    }).timeout(10000);
    it('decrypt and save (to)', async () => {
        rld = await EcEncryptedValue.fromEncryptedValue(await EcRepository.get(rld.shortId(), null, null, repo));
        EcEncryptedValue.encryptOnSave(rld.shortId(), false);
        await changeNameAndSaveAndCheck(rld);
    }).timeout(10000);
    it('search', async () => {
        let results = await repo.search(`@id:"${rld.shortId()}"`);
        assert.equal(results.length, 1);
        assert.equal(results[0].shortId(), rld.shortId());
    }).timeout(10000);
    it('searchCache', async () => {
        EcRepository.caching = true;
        let results = await repo.search(`@id:"${rld.shortId()}"`);
        assert.equal(results.length, 1);
        assert.equal(results[0].shortId(), rld.shortId());
        results = await EcRepository.get(rld.shortId());
        EcRepository.caching = false;
    }).timeout(10000);
    it('encrypt and save (to)', async () => {
        EcEncryptedValue.encryptOnSave(rld.shortId(), true);
        await changeNameAndSaveAndCheck(rld);
    }).timeout(10000);
    it('search', async () => {
        let results = await repo.search(`@id:"${rld.shortId()}"`);
        assert.equal(results.length, 1);
        assert.equal(results[0].shortId(), rld.shortId());
    }).timeout(10000);
    it('decrypt and save (to)', async () => {
        EcEncryptedValue.encryptOnSave(rld.shortId(), false);
        await changeNameAndSaveAndCheck(rld);
    }).timeout(10000);
    it('history', async () => {
        let history = await EcRepository.history(rld.shortId(), repo);
        assert.isAbove(history.length, 6, "History is not populated.");
    }).timeout(10000);
    it('search', async () => {
        let results = await repo.search(`@id:"${rld.shortId()}"`);
        assert.equal(results.length, 1);
        assert.equal(results[0].shortId(), rld.shortId());
    }).timeout(10000);
    it('create', async () => {
        rld = new schema.Thing();
        rld.generateId(repo.selectedServer);
        rld.addOwner(newId1.ppk.toPk());
        rld.setName("Some Thing");
        rld.setDescription("Some Description");
    });
    it('save (ecrepository)', async () => {
        await changeNameAndSaveAndCheckRepo(rld);
    }).timeout(10000);
    it('encrypt and save (ecrepository)', async () => {
        EcEncryptedValue.encryptOnSave(rld.shortId(), true);
        await changeNameAndSaveAndCheckRepo(rld);
    }).timeout(10000);
    it('search', async () => {
        let results = await repo.search(`@id:"${rld.shortId()}"`);
        assert.equal(results.length, 1);
        assert.equal(results[0].shortId(), rld.shortId());
    }).timeout(10000);
    it('decrypt and save (ecrepository)', async () => {
        EcEncryptedValue.encryptOnSave(rld.shortId(), false);
        await changeNameAndSaveAndCheckRepo(rld);
    }).timeout(10000);
    it('search', async () => {
        let results = await repo.search(`@id:"${rld.shortId()}"`);
        assert.equal(results.length, 1);
        assert.equal(results[0].shortId(), rld.shortId());
    }).timeout(10000);
    it('save (ecrepository)', async () => {
        await changeNameAndSaveAndCheckRepo(rld);
    }).timeout(10000);
    it('encrypt and save (ecrepository)', async () => {
        EcEncryptedValue.encryptOnSave(rld.shortId(), true);
        await changeNameAndSaveAndCheckRepo(rld);
    }).timeout(10000);
    it('search', async () => {
        let results = await repo.search(`@id:"${rld.shortId()}"`);
        assert.equal(results.length, 1);
        assert.equal(results[0].shortId(), rld.shortId());
    }).timeout(10000);
    it('decrypt and save (ecrepository)', async () => {
        EcEncryptedValue.encryptOnSave(rld.shortId(), false);
        await changeNameAndSaveAndCheckRepo(rld);
    }).timeout(10000);
    it('search', async () => {
        let results = await repo.search(`@id:"${rld.shortId()}"`);
        assert.equal(results.length, 1);
        assert.equal(results[0].shortId(), rld.shortId());
    }).timeout(10000);
    it('create', async () => {
        rld = new schema.Thing();
        rld.generateId(repo.selectedServer);
        rld.addOwner(newId1.ppk.toPk());
        rld.setName("Some Thing");
        rld.setDescription("Some Description");
    });
    it('save (multiput)', async () => {
        await changeNameAndSaveAndCheckMultiput(rld);
    }).timeout(10000);
    it('encrypt and save (multiput)', async () => {
        EcEncryptedValue.encryptOnSave(rld.shortId(), true);
        await changeNameAndSaveAndCheckMultiput(rld);
    }).timeout(10000);
    it('search', async () => {
        let results = await repo.search(`@id:"${rld.shortId()}"`);
        assert.equal(results.length, 1);
        assert.equal(results[0].shortId(), rld.shortId());
    }).timeout(10000);
    it('decrypt and save (multiput)', async () => {
        EcEncryptedValue.encryptOnSave(rld.shortId(), false);
        await changeNameAndSaveAndCheckMultiput(rld);
    }).timeout(10000);
    it('search', async () => {
        let results = await repo.search(`@id:"${rld.shortId()}"`);
        assert.equal(results.length, 1);
        assert.equal(results[0].shortId(), rld.shortId());
    }).timeout(10000);
    it('save (multiput)', async () => {
        await changeNameAndSaveAndCheckMultiput(rld);
    }).timeout(10000);
    it('encrypt and save (multiput)', async () => {
        EcEncryptedValue.encryptOnSave(rld.shortId(), true);
        await changeNameAndSaveAndCheckMultiput(rld);
    }).timeout(10000);
    it('search', async () => {
        let results = await repo.search(`@id:"${rld.shortId()}"`);
        assert.equal(results.length, 1);
        assert.equal(results[0].shortId(), rld.shortId());
    }).timeout(10000);
    it('decrypt and save (multiput)', async () => {
        EcEncryptedValue.encryptOnSave(rld.shortId(), false);
        await changeNameAndSaveAndCheckMultiput(rld);
    }).timeout(10000);
    it('search', async () => {
        let results = await repo.search(`@id:"${rld.shortId()}"`);
        assert.equal(results.length, 1);
        assert.equal(results[0].shortId(), rld.shortId());
    }).timeout(10000);
    it('registered create', async () => {
        rld = new schema.Thing();
        rld.id = "https://this.object.is.not.here/" + EcCrypto.generateUUID();
        rld.addOwner(newId1.ppk.toPk());
        rld.setName("Some Thing");
        rld.setDescription("Some Description");
    });
    it('registered save (to)', async () => {
        await changeNameAndSaveAndCheck(rld);
    }).timeout(10000);
    it('registered encrypt and save (to)', async () => {
        EcEncryptedValue.encryptOnSave(rld.shortId(), true);
        await changeNameAndSaveAndCheck(rld);
    }).timeout(10000);
    it('registered search', async () => {
        let results = await repo.search(`@id:"${rld.shortId()}"`);
        assert.equal(results.length, 1);
        assert.equal(results[0].shortId(), rld.shortId());
    }).timeout(10000);
    it('registered decrypt and save (to)', async () => {
        EcEncryptedValue.encryptOnSave(rld.shortId(), false);
        await changeNameAndSaveAndCheck(rld);
    }).timeout(10000);
    it('registered search', async () => {
        let results = await repo.search(`@id:"${rld.shortId()}"`);
        assert.equal(results.length, 1);
        assert.equal(results[0].shortId(), rld.shortId());
    }).timeout(10000);
    it('registered encrypt and save (to)', async () => {
        EcEncryptedValue.encryptOnSave(rld.shortId(), true);
        await changeNameAndSaveAndCheck(rld);
    }).timeout(10000);
    it('registered search', async () => {
        let results = await repo.search(`@id:"${rld.shortId()}"`);
        assert.equal(results.length, 1);
        assert.equal(results[0].shortId(), rld.shortId());
    }).timeout(10000);
    it('registered decrypt and save (to)', async () => {
        EcEncryptedValue.encryptOnSave(rld.shortId(), false);
        await changeNameAndSaveAndCheck(rld);
    }).timeout(10000);
    it('registered search', async () => {
        let results = await repo.search(`@id:"${rld.shortId()}"`);
        assert.equal(results.length, 1);
        assert.equal(results[0].shortId(), rld.shortId());
    }).timeout(10000);
    it('registered create', async () => {
        rld = new schema.Thing();
        rld.id = "https://this.object.is.not.here/" + EcCrypto.generateUUID();
        rld.addOwner(newId1.ppk.toPk());
        rld.setName("Some Thing");
        rld.setDescription("Some Description");
    });
    it('registered save (multiput)', async () => {
        await changeNameAndSaveAndCheckMultiput(rld);
    }).timeout(10000);
    it('registered encrypt and save (multiput)', async () => {
        EcEncryptedValue.encryptOnSave(rld.shortId(), true);
        await changeNameAndSaveAndCheckMultiput(rld);
    }).timeout(10000);
    it('registered search', async () => {
        let results = await repo.search(`@id:"${rld.shortId()}"`);
        assert.equal(results.length, 1);
        assert.equal(results[0].shortId(), rld.shortId());
    }).timeout(10000);
    it('registered decrypt and save (multiput)', async () => {
        EcEncryptedValue.encryptOnSave(rld.shortId(), false);
        await changeNameAndSaveAndCheckMultiput(rld);
    }).timeout(10000);
    it('registered search', async () => {
        let results = await repo.search(`@id:"${rld.shortId()}"`);
        assert.equal(results.length, 1);
        assert.equal(results[0].shortId(), rld.shortId());
    }).timeout(10000);
    it('registered save (multiput)', async () => {
        await changeNameAndSaveAndCheckMultiput(rld);
    }).timeout(10000);
    it('registered encrypt and save (multiput)', async () => {
        EcEncryptedValue.encryptOnSave(rld.shortId(), true);
        await changeNameAndSaveAndCheckMultiput(rld);
    }).timeout(10000);
    it('registered search', async () => {
        let results = await repo.search(`@id:"${rld.shortId()}"`);
        assert.equal(results.length, 1);
        assert.equal(results[0].shortId(), rld.shortId());
    }).timeout(10000);
    it('registered decrypt and save (multiput)', async () => {
        EcEncryptedValue.encryptOnSave(rld.shortId(), false);
        await changeNameAndSaveAndCheckMultiput(rld);
    }).timeout(10000);
    it('registered search', async () => {
        let results = await repo.search(`@id:"${rld.shortId()}"`);
        assert.equal(results.length, 1);
        assert.equal(results[0].shortId(), rld.shortId());
    }).timeout(10000);
    it('registered history', async () => {
        let history = await EcRepository.history(rld.shortId(), repo);
        assert.isTrue(history.length == 6, "History is not populated.");
    }).timeout(10000);
    it('search index/permanent mismatch', async () => {
        let thing = new schema.Thing();
        thing.generateId(repo.selectedServer);
        thing.name = "Thing (index)";
        thing.updateTimestamp();
        let indexStore = await fetch(`${process.env.ELASTICSEARCH_ENDPOINT || "http://localhost:9200/"}schema.org.thing/_doc/${EcCrypto.md5(thing.shortId())}?version=${thing.getTimestamp()}&version_type=external&refresh=true`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: thing.toJson()
        });
        let oldId = thing.id;
        thing.updateTimestamp();
        assert.isTrue(indexStore.status >= 200 && indexStore.status < 300, "Index store failed.");
        let permanentStore = await fetch(`${process.env.ELASTICSEARCH_ENDPOINT || "http://localhost:9200/"}permanent/_doc/${EcCrypto.md5(thing.shortId())}.?refresh=true`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: thing.toJson() })
        });
        assert.isTrue(permanentStore.status >= 200 && permanentStore.status < 300, "Permanent store 1 failed.");
        let permanentStore2 = await fetch(`${process.env.ELASTICSEARCH_ENDPOINT || "http://localhost:9200/"}permanent/_doc/${EcCrypto.md5(thing.shortId())}.${thing.getTimestamp()}?refresh=true`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: thing.toJson() })
        });
        assert.isTrue(permanentStore2.status >= 200 && permanentStore2.status < 300, "Permanent store 2 failed.");
        let permanentStore3 = await fetch(`${process.env.ELASTICSEARCH_ENDPOINT || "http://localhost:9200/"}permanent/_doc/${thing.getGuid()}.?refresh=true`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: thing.toJson() })
        });
        assert.isTrue(permanentStore3.status >= 200 && permanentStore3.status < 300, "Permanent store 3 failed.");
        let permanentStore4 = await fetch(`${process.env.ELASTICSEARCH_ENDPOINT || "http://localhost:9200/"}permanent/_doc/${thing.getGuid()}.${thing.getTimestamp()}?refresh=true`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: thing.toJson() })
        });
        assert.isTrue(permanentStore4.status >= 200 && permanentStore4.status < 300, "Permanent store 4 failed.");
        thing.id = oldId;
        let results = await repo.search(`@id:"${thing.shortId()}"`);
        assert.isAbove(results.length, 0, "Search (short) failed.");
        results = await repo.search(`@id:"${thing.id}"`);
        assert.isAbove(results.length, 0, "Search (long) failed.");
        results = await repo.multiget([thing.id]);
        assert.equal(results.length, 0, "Multiget (long) failed.");
        results = await repo.multiget([thing.shortId()]);
        assert.isAbove(results.length, 0, "Multiget (short) failed.");
        results = await repo.multiget([EcRemoteLinkedData.veryShortId(repo.selectedServer, EcCrypto.md5(thing.shortId()))]);
        assert.isAbove(results.length, 0, "Multiget (md5 id) failed.");
    }).timeout(10000);
    it('Turn off caching', async () => {
        EcRepository.caching = false;
        EcRepository.cachingL2 = false;
        delete global.AUTH_OVERRIDE;
    }).timeout(10000);
});