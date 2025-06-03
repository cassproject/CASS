const chai = require('chai');
const sinon = require('sinon');
const fs = require('fs');
require('cassproject');
const {skyrepoAdminPk, skyrepoAdminList} = require('../main/server/skyRepo/admin');

const hrtime = function () {
    try {
        return [Math.round(performance.now() / 1000), performance.now() * 1000];
    } catch (e) {
        // Eat quietly.
    }
    return process.hrtime();
};

const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;
describe('Skyrepo Admin.js', function () {
    it('Files match', async () => {
        if (!fs.existsSync('etc/skyAdmin2.pem')) {
            fileSave(EcPpk.fromPem(rsaGenerate()).toPem(), 'etc/skyAdmin2.pem');
        }
        assert.strictEqual(EcPpk.fromPem(fileToString(fileLoad('etc/skyAdmin2.pem'))).toPk().toPem(), skyrepoAdminPk(), 'skyrepoAdminPk should return the public key from the pem file');
    });
});