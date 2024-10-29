const EcRepository = require("cassproject/src/org/cassproject/ebac/repository/EcRepository");
let chai = require("chai");

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


describe("CEASN Adapter", function() {
    this.timeout(30000);

    before(async ()=>{
        try {
            await fetch(`${process.env.CASS_LOOPBACK || "http://localhost/api/"}data/70d27b782c062d1280b240890141dcf6`);
        } catch (err) {
            console.log('doing things');
            let onet = await (await fetch("https://www.onetcenter.org/ctdlasn/graph/ce-07c25f74-9119-11e8-b852-782bcb5df6ac")).json();
            console.log('onet', onet);
            const formData = new FormData();
            formData.append('data', JSON.stringify(onet));
            await fetch("http://localhost/api/ctdlasn", {method: 'POST', body: formData});
        }
    });

    it('conversion to CEASN', async () => {
        await fetch(`${process.env.CASS_LOOPBACK || "http://localhost/api/"}ceasn/70d27b782c062d1280b240890141dcf6`)
    }).timeout(30000);

    it('conversion from CEASN', async () => {
        let repo = new EcRepository();
        repo.selectedServer = process.env.CASS_LOOPBACK || "http://localhost/api/";
        let onet = await (await fetch("https://www.onetcenter.org/ctdlasn/graph/ce-07c264d7-9119-11e8-b852-782bcb5df6ac")).json();
        const formData = new FormData();
        formData.append('data', JSON.stringify(onet));
        await fetch(`${process.env.CASS_LOOPBACK || "http://localhost/api/"}ctdlasn`, {method: 'POST', body: formData});
        let framework = await EcRepository.get("https://www.onetcenter.org/ctdlasn/resources/ce-07c264d7-9119-11e8-b852-782bcb5df6ac");
        assert(framework != null, "Framework saved to CaSS.");
    }).timeout(30000);

    it('conversion from CEASN (Technology Skills)', async () => {
        let repo = new EcRepository();
        repo.selectedServer = process.env.CASS_LOOPBACK || "http://localhost/api/";
        let onet = await (await fetch("https://www.onetcenter.org/ctdlasn/graph/ce-9fab4187-d8e7-11e9-8250-782bcb5df6ac")).json();
        const formData = new FormData();
        formData.append('data', JSON.stringify(onet));
        await fetch(`${process.env.CASS_LOOPBACK || "http://localhost/api/"}ctdlasn`, {method: 'POST', body: formData});
        let framework = await EcRepository.get("https://www.onetcenter.org/ctdlasn/resources/ce-9fab4187-d8e7-11e9-8250-782bcb5df6ac");
        assert(framework != null, "Framework saved to CaSS.");
    }).timeout(300000);

    // it('Reimport after delete', async () => {
    //     let repo = new EcRepository();
    //     repo.selectedServer = "http://localhost/api/";
    //     // identity needed to delete
    //     var ceasnIdentity = new EcIdentity();
    //     let key = (fs.readFileSync("etc/adapter.ceasn.private.pem")) + "";
    //     ceasnIdentity.ppk = EcPpk.fromPem(key);
    //     ceasnIdentity.displayName = "CEASN Server Identity";
    //     EcIdentityManager.default.addIdentity(ceasnIdentity);

    //     let id = "https://www.onetcenter.org/ctdlasn/resources/ce-07c264d7-9119-11e8-b852-782bcb5df6ac"
    //     let hashId = EcCrypto.md5(id);
    //     var microSearchUrl = "http://localhost:9200/_search?version&q=@id:\"" + id + "\" OR @id:\"" + hashId + "\"";
    //     let microSearch = (await axios.get(microSearchUrl)).data;
    //     let version = null;
    //     let version2 = null;
    //     for (let each of microSearch.hits.hits) {
    //         if (each["_id"] === hashId) {
    //             version = each["_source"]["@version"];
    //             break;
    //         }
    //     }
    //     await repo.deleteRegistered(await EcRepository.get(id));
    //     let onet = (await axios.get("https://www.onetcenter.org/ctdlasn/graph/ce-07c264d7-9119-11e8-b852-782bcb5df6ac",{httpsAgent: new require("https").Agent({ rejectUnauthorized: false })})).data;
    //     const formData = new FormData();
    //     formData.append('data',JSON.stringify(onet));
    //     await axios.post("http://localhost/api/ctdlasn",formData,{headers:formData.getHeaders()});
    //     microSearch = (await axios.get(microSearchUrl)).data;
    //     for (let each of microSearch.hits.hits) {
    //         if (each["_id"] === hashId) {
    //             version2 = each["_source"]["@version"];
    //             break;
    //         }
    //     }
    //     assert(version < version2, 'Version was incremented after delete and reimport.');
    // }).timeout(30000);
});