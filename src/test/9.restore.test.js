const { assert } = require('chai');
const sinon = require('sinon');
const fs = require('fs');
require('cassproject');

describe('Skyrepo Log Restore', function () {
    if (process.env.NODEV != null) return;
    it('Restore', async () => {
        global.auditLogger.report = global.auditLogger.oldReport;
        assert.strictEqual(global.auditLogger.report, global.auditLogger.oldReport);
    });
});

// Root-level hook: mocha runs it once, after every test file (including the
// node_modules/cassproject tests that load after this one). Shut the server
// down here rather than in a test, so CLOSE runs execute the whole suite.
// Don't call process.exit: the npm scripts pass --exit, which ends the process
// with an exit code that reflects any failures.
after(function () {
    if (process.env.NODEV != null || !process.env.CLOSE) return;
    console.log("CLOSE is set -- Closing server.");
    if (global.server) global.server.close();
    global.auditLogger.flush();
});
