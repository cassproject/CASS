let axios = require("axios");
let FormData = require("form-data");
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
            await axios.get("http://localhost/api/data/70d27b782c062d1280b240890141dcf6");
        }
        catch(err){
            let onet = (await axios.get("https://www.onetcenter.org/ctdlasn/graph/ce-07c25f74-9119-11e8-b852-782bcb5df6ac",{httpsAgent: new require("https").Agent({ rejectUnauthorized: false })})).data;
            const formData = new FormData();
            formData.append('data',JSON.stringify(onet));
            await axios.post("http://localhost/api/ctdlasn",formData,{headers:formData.getHeaders()});
        }
    });

    it('conversion to ASN', async () => {
        await axios.get("http://localhost/api/asn/70d27b782c062d1280b240890141dcf6")
    }).timeout(30000);
});