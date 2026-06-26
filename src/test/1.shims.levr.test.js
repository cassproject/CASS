const chai = require('chai');
require('cassproject');
const { Readable } = require('stream');
if (process.env.NODEV == null)
{
    const assert = chai.assert;

    describe('shims/levr.js', function () {
        it('exposes a getStream that reads a stream to a string', async () => {
            const { getStream } = require('../main/server/shims/levr');
            assert.typeOf(getStream, 'function', 'levr.js must expose a callable getStream');
            const text = await getStream(Readable.from(['hello ', 'world']));
            assert.strictEqual(text, 'hello world');
        });
    });
}
