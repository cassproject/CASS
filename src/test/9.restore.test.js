const { assert } = require('chai');
const sinon = require('sinon');
const fs = require('fs');
require('cassproject');

describe('Skyrepo Log Restore', function () {
    if (process.env.NODEV != null) return;
    it('Restore', async () => {
        global.auditLogger.report = global.auditLogger.oldReport;
        assert.strictEqual(global.auditLogger.report, global.auditLogger.oldReport);
        if (process.env.CLOSE)
        {
            console.log("CLOSE is set -- Closing server.");
            server.close();
            global.auditLogger.flush();
            process.exit(0);
        }
    });
});