require("cassproject");
let chai = require("chai");

var assert = chai.assert;

// Regression tests for cass-editor#1427: a Progression Model (ConceptScheme
// with subType "Progression") exported through /api/ceasn/<id> must emit
// ceasn:publisher as an array even when only a single publisher is present,
// matching the Competency Framework export behavior.
describe("CEASN Progression Model export", function () {
    this.timeout(60000);

    const loopback = process.env.CASS_LOOPBACK || "http://localhost/api/";
    let repo = new EcRepository();
    let scheme = null;
    const publisherUrl = "https://credentialengineregistry.org/resources/ce-11111111-2222-3333-4444-555555555555";

    it('Waiting for server to be ready', async () => {
        if (process.env.NODEV != null) return;
        let ready = false;
        global.events.server.ready.subscribe(function (isReady) {
            if (!isReady) {
                console.log('Server not ready. Skipping tests.');
                return;
            }
            ready = true;
        });
        while (!ready) { await new Promise((resolve) => setTimeout(resolve, 100)); }
    });

    it('create progression model with a single publisher', async () => {
        await repo.init(loopback);
        if (EcIdentityManager.default.ids.length === 0) {
            let newId1 = new EcIdentity();
            newId1.ppk = EcPpk.fromPem(
                "-----BEGIN RSA PRIVATE KEY-----MIIEpAIBAAKCAQEAz4BiFucFE9bNcKfGD+e6aPRHl402YM4Z6nrurDRNlnwsWpsCoZasPLkjC314pVtHAI2duZo+esGKDloBsiLxASRJo3R2XiXVh2Y8U1RcHA5mWL4tMG5UY2d0libpNEHbHPNBmooVYpA2yhxN/vGibIk8x69uZWxJcFOxOg6zWG8EjF8UMgGnRCVSMTY3THhTlfZ0cGUzvrfb7OvHUgdCe285XkmYkj/V9P/m7hbWoOyJAJSTOm4/s6fIKpl72lblfN7bKaxTCsJp6/rQdmUeo+PIaa2lDOfo7dWbuTMcqkZ93kispNfYYhsEGUGlCsrrVWhlve8MenO4GdLsFP+HRwIDAQABAoIBAGaQpOuBIYde44lNxJ7UAdYi+Mg2aqyK81Btl0/TQo6hriLTAAfzPAt/z4y8ZkgFyCDD3zSAw2VWCPFzF+d/UfUohKWgyWlb9iHJLQRbbHQJwhkXV6raviesWXpmnVrROocizkie/FcNxac9OmhL8+cGJt7lHgJP9jTpiW6TGZ8ZzM8KBH2l80x9AWdvCjsICuPIZRjc706HtkKZzTROtq6Z/F4Gm0uWRnwAZrHTRpnh8qjtdBLYFrdDcUoFtzOM6UVRmocTfsNe4ntPpvwY2aGTWY7EmTj1kteMJ+fCQFIS+KjyMWQHsN8yQNfD5/j2uv6/BdSkO8uorGSJT6DwmTECgYEA8ydoQ4i58+A1udqA+fujM0Zn46++NTehFe75nqIt8rfQgoduBam3lE5IWj2U2tLQeWxQyr1ZJkLbITtrAI3PgfMnuFAii+cncwFo805Fss/nbKx8K49vBuCEAq3MRhLjWy3ZvIgUHj67jWvl50dbNqc7TUguxhS4BxGr/cPPkP0CgYEA2nbJPGzSKhHTETL37NWIUAdU9q/6NVRISRRXeRqZYwE1VPzs2sIUxA8zEDBHX7OtvCKzvZy1Lg5Unx1nh4nCEVkbW/8npLlRG2jOcZJF6NRfhzwLz3WMIrP6j9SmjJaB+1mnrTjfsg36tDEPDjjJLjJHCx9z/qRJh1v4bh4aPpMCgYACG31T2IOEEZVlnvcvM3ceoqWT25oSbAEBZ6jSLyWmzOEJwJK7idUFfAg0gAQiQWF9K+snVqzHIB02FIXA43nA7pKRjmA+RiqZXJHEShFgk1y2HGiXGA8mSBvcyhTTJqbBy4vvjl5eRLzrZNwBPSUVPC3PZajCHrvZk9WhxWivIQKBgQCzCu1MH2dy4R7ZlqsIJ8zKweeJMZpfQI7pjclO0FTrhh7+Yzd+5db9A/P2jYrBTVHSwaILgTYf49DIguHJfEZXz26TzB7iapqlWxTukVHISt1ryPNo+E58VoLAhChnSiaHJ+g7GESE+d4A9cAACNwgh0YgQIvhIyW70M1e+j7KDwKBgQDQSBLFDFmvvTP3sIRAr1+0OZWd1eRcwdhs0U9GwootoCoUP/1Y64pqukT6B9oIB/No9Nyn8kUX3/ZDtCslaGKEUGMJXQ4hc5J+lq0tSi9ZWBdhqOuMPEfUF3IxW+9yeILP4ppUBn1m5MVOWg5CvuuEeCmy4bhMaUErUlHZ78t5cA==-----END RSA PRIVATE KEY-----"
            );
            EcIdentityManager.default.addIdentity(newId1);
        }
        scheme = new EcConceptScheme();
        scheme.generateId(repo.selectedServer);
        scheme.addOwner(EcIdentityManager.default.ids[0].ppk.toPk());
        scheme["dcterms:title"] = {"@language": "en", "@value": "Issue 1427 Progression Model"};
        scheme["dcterms:publisher"] = publisherUrl;
        scheme.subType = "Progression";
        await repo.saveTo(scheme);
        let readBack = await EcRepository.get(scheme.shortId());
        assert(readBack != null, "Progression model saved to CaSS.");
    }).timeout(30000);

    it('exports ceasn:publisher as an array even with a single value (#1427)', async () => {
        let guid = scheme.getGuid();
        let response = await fetch(`${loopback}ceasn/${guid}`);
        assert.equal(response.status, 200, "ceasn export endpoint returned OK");
        let exported = await response.json();
        assert(exported["@graph"] != null && exported["@graph"].length > 0, "export has an @graph");
        let model = exported["@graph"][0];
        assert.equal(model["@type"], "asn:ProgressionModel", "exported node is a progression model");
        assert.isArray(model["ceasn:publisher"], "ceasn:publisher must be an array (cass-editor#1427)");
        assert.equal(model["ceasn:publisher"].length, 1, "single publisher exported as one-element array");
        assert.equal(model["ceasn:publisher"][0], publisherUrl, "publisher value preserved");
    }).timeout(30000);

    after(async () => {
        if (scheme != null) {
            try {
                let toDelete = await EcRepository.get(scheme.shortId());
                await EcRepository._delete(toDelete);
            } catch (e) {
                // Leave test data behind rather than fail the suite on cleanup.
            }
        }
    });
});
