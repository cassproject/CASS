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


describe("ASN Adapter", function() {
    this.timeout(30000);

    before(async ()=>{
        try{
            await fetch("http://localhost/api/data/70d27b782c062d1280b240890141dcf6");
        }
        catch(err){
            let onet = await (await fetch("https://www.onetcenter.org/ctdlasn/graph/ce-07c25f74-9119-11e8-b852-782bcb5df6ac")).json();
            const formData = new FormData();
            formData.append('data',JSON.stringify(onet));
            await fetch("http://localhost/api/ctdlasn",{method: 'POST', body: formData});
        }
    });

    it('conversion to ASN', async () => {
        await fetch("http://localhost/api/asn/70d27b782c062d1280b240890141dcf6")
    }).timeout(30000);
});