const { assert } = require('chai');

describe('shims/auth.js module loading', function () {
    before(function () {
        if (process.env.NODEV != null) this.skip();
    });

    it('loads the auth modules in filename order, which is the order their middleware runs in', () => {
        const { authModules } = require('../main/server/shims/auth.js');
        assert.deepEqual(authModules, [
            '00_rate.js',
            '10_oidc.js',
            '20_jwt.js',
            '30_platformOne.js',
            '40_bearerBridge.js',
            '50_signatureSheet.js',
            '60_ipAllow.js'
        ]);
    });
});
