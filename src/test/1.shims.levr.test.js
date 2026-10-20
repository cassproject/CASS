const { assert } = require('chai');
require('cassproject');
const { Readable } = require('stream');
if (process.env.NODEV == null)
{

    describe('shims/levr.js', function () {
        it('exposes a getStream that reads a stream to a string', async () => {
            const { getStream } = require('../main/server/shims/levr');
            assert.typeOf(getStream, 'function', 'levr.js must expose a callable getStream');
            const text = await getStream(Readable.from(['hello ', 'world']));
            assert.strictEqual(text, 'hello world');
        });

        it('explains permission errors when writing configuration files', () => {
            const { explainWriteError } = require('../main/server/shims/levr');
            const denied = Object.assign(new Error("EACCES: permission denied, open 'etc/skyId.salt'"), { code: 'EACCES' });
            const explained = explainWriteError(denied, 'etc/skyId.salt');
            assert.strictEqual(explained.code, 'EACCES');
            assert.strictEqual(explained.cause, denied);
            assert.include(explained.message, require('path').resolve('etc/skyId.salt'));
            assert.include(explained.message, 'must be writable by the user CaSS runs as');
            assert.include(explained.message, 'fsGroup');
        });

        it('leaves other write errors unchanged', () => {
            const { explainWriteError } = require('../main/server/shims/levr');
            const missing = Object.assign(new Error('ENOENT'), { code: 'ENOENT' });
            assert.strictEqual(explainWriteError(missing, 'etc/x'), missing);
        });
    });
}
