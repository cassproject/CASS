const { assert } = require('chai');

// The server tests version numbers, ports and CIDR prefixes with the global
// isNaN, isFinite, parseInt and parseFloat, which coerce their argument.
// These tests pin down the results for the kinds of value those call sites
// see, so that moving to the Number.* forms cannot change behaviour.
describe('Number coercion (characterization)', function () {
    const samples = [
        undefined, null, '', ' ', '0', '12', ' 12 ', '12abc', 'abc', '1e3', '0x10', '-7', '3.5',
        'Infinity', '-Infinity', 'NaN', NaN, 0, -0, 12, 3.5, Infinity, -Infinity,
        true, false, [], [7], [1, 2], {}, new Date(0), '1793898814791', 1793898814791
    ];

    it('Number.parseInt and Number.parseFloat are the global functions', () => {
        assert.strictEqual(Number.parseInt, parseInt);
        assert.strictEqual(Number.parseFloat, parseFloat);
    });

    it('Number.isNaN(Number(x)) agrees with isNaN(x)', () => {
        for (const x of samples) assert.strictEqual(Number.isNaN(Number(x)), isNaN(x), String(x));
    });

    it('Number.isFinite(Number(x)) agrees with isFinite(x)', () => {
        for (const x of samples) assert.strictEqual(Number.isFinite(Number(x)), isFinite(x), String(x));
    });

    it('isNaN(x) is true for the version values put treats as missing', () => {
        // skyRepo/put.js and multiput.js: a version that is not a number means "pick one".
        assert.isTrue(isNaN(undefined));
        assert.isTrue(isNaN('abc'));
        assert.isTrue(isNaN(parseInt(undefined)));
        assert.isFalse(isNaN(null), 'null counts as 0, not as missing');
        assert.isFalse(isNaN('1793898814791'));
    });
});

describe('ipMatch', function () {
    let ipMatch;

    before(function () {
        if (process.env.NODEV != null) this.skip();
        ipMatch = require('../main/server/shims/auth.js').common.ipMatch;
    });

    const cases = [
        // [allow list, client address, expected]
        [['10.0.0.0/8'], '10.1.2.3', true],
        [['10.0.0.0/8'], '11.1.2.3', false],
        [['10.0.0.0/ 8'], '10.1.2.3', false],
        [['10.0.0.0/8.9'], '10.1.2.3', false],
        [['10.0.0.0/0x8'], '10.1.2.3', false],
        [['10.0.0.0/08'], '10.1.2.3', true],
        [['10.0.0.0/-8'], '10.1.2.3', false],
        [['10.0.0.0/8 '], '10.1.2.3', false],
        [['10.0.0.0/abc'], '10.1.2.3', false],
        [['10.0.0.0/'], '10.1.2.3', false],
        [['10.0.0.0/Infinity'], '10.1.2.3', false],
        [['10.0.0.0/8/9'], '10.1.2.3', false],
        [['192.168.1.5'], '192.168.1.5', true],
        [['192.168.1.5'], '192.168.1.6', false],
        [['::1'], '::1', true],
        [['fd00::/8'], 'fd12::1', true],
        [['fd00::/8'], '10.1.2.3', false],
        [['127.0.0.1'], '::ffff:127.0.0.1', true],
        [[null, ''], '10.1.2.3', false],
        [['10.0.0.0/8'], 'not an address', false],
        [['10.0.0.0/8'], undefined, false],
        [[], '10.1.2.3', false]
    ];

    for (const [list, client, expected] of cases) {
        it(`${JSON.stringify(list)} ${expected ? 'admits' : 'refuses'} ${client}`, () => {
            assert.strictEqual(ipMatch(list, client), expected);
        });
    }
});
