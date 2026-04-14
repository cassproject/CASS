const chai = require('chai');
const sinon = require('sinon');
const fs = require('fs');
require('cassproject');

const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;
describe('Skyrepo Log Restore', function () {
    if (process.env.NODEV != null) return;
    it('Restore', async () => {
        global.auditLogger.report = global.auditLogger.oldReport;
        if (process.env.CLOSE)
        {
            console.log("CLOSE is set -- Closing server.");
            server.close();
            global.auditLogger.flush();
            process.exit(0);
        }
    });
});