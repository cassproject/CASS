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


describe("CASE Adapter", function () {
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
            await fetch("http://localhost/api/ctdlasn", { method: 'POST', body: formData });
        }
    });

    it('conversion to CASE', async () => {
        await fetch(`${process.env.CASS_LOOPBACK || "http://localhost/api/"}ims/case/v1p0/CFPackages/70d27b782c062d1280b240890141dcf6`)
    }).timeout(10000);

    it('ACT Collective Problem Solving import', async () => {
        await fetch(`${process.env.CASS_LOOPBACK || "http://localhost/api/"}ims/case/harvest?caseEndpoint=https://opensalt.net&dId=f0e7396a-7edd-11e9-86d4-23cb22a51e7e`)
    }).timeout(30000);
});