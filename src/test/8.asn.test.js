let chai = require("chai");

let hrtime = function () {
    try {
        return [Math.round(performance.now() / 1000), performance.now() * 1000];
    } catch (e) {
        // Eat quietly.
    }
    return process.hrtime();
};

var should = chai.should();
var expect = chai.expect;
var assert = chai.assert;


describe("ASN Adapter", function () {
    this.timeout(30000);

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
    before(async () => {
        try {
            await fetch(`${process.env.CASS_LOOPBACK || "http://localhost/api/"}data/70d27b782c062d1280b240890141dcf6`);
        }
        catch (err) {
            let onet = await (await fetch("https://www.onetcenter.org/ctdlasn/graph/ce-07c25f74-9119-11e8-b852-782bcb5df6ac")).json();
            const formData = new FormData();
            formData.append('data', JSON.stringify(onet));
            await fetch(`${process.env.CASS_LOOPBACK || "http://localhost/api/"}ctdlasn`, { method: 'POST', body: formData });
        }
    });

    it('conversion to ASN', async () => {
        await fetch(`${process.env.CASS_LOOPBACK || "http://localhost/api/"}asn/70d27b782c062d1280b240890141dcf6`)
    }).timeout(30000);
});