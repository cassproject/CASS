const { assert } = require('chai');
const fs = require('fs');

// getPk with CASS_ELASTIC_KEYSTORE: user keypairs are kept, encrypted, in the repository
// instead of etc/keys. Runs against the test server.
if (process.env.NODEV == null) {
    describe('getPk with the Elasticsearch keystore', function () {
        this.timeout(60000);
        const ENV = ['CASS_ELASTIC_KEYSTORE', 'CASS_ELASTIC_KEYSTORE_ENDPOINT'];
        let saved;
        let report;
        let common;
        const unique = (label) => `keystore-${label}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;

        before(async () => {
            let ready = false;
            global.events.server.ready.subscribe((isReady) => { if (isReady) ready = true; });
            while (!ready) await new Promise((resolve) => setTimeout(resolve, 100));
            common = require('../main/server/shims/auth.js').common;
            saved = Object.fromEntries(ENV.map((k) => [k, process.env[k]]));
            report = global.auditLogger.report;
            global.auditLogger.report = () => { };
            process.env.CASS_ELASTIC_KEYSTORE = 'true';
            process.env.CASS_ELASTIC_KEYSTORE_ENDPOINT = repo.selectedServer;
        });
        after(() => {
            for (const k of ENV) {
                if (saved[k] === undefined) delete process.env[k];
                else process.env[k] = saved[k];
            }
            global.auditLogger.report = report;
        });

        it('creates a keypair for a new identifier, and reads the same one back later', async () => {
            const id = unique('new');
            const created = await common.getPk(id);
            assert.match(created, /^-----BEGIN RSA PRIVATE KEY-----/);
            assert.strictEqual(await common.getPk(id), created, 'cached');
            assert.isFalse(fs.existsSync('etc/keys/' + id), 'nothing is written to etc/keys');

            delete common.getPkCache[id];
            assert.strictEqual(await common.getPk(id), created, 'read back from the repository');
        });

        it('moves a keypair from etc/keys into the repository, keeping a backup', async () => {
            const id = unique('file');
            const pem = EcPpk.generateKey().toPem();
            fs.mkdirSync('etc/keys', { recursive: true });
            fs.writeFileSync('etc/keys/' + id, pem);
            try {
                assert.strictEqual(await common.getPk(id), pem);
                assert.isFalse(fs.existsSync('etc/keys/' + id), 'the plain file is removed');
                assert.strictEqual(fs.readFileSync('etc/keys/backup/' + id, 'utf8'), pem, 'a backup is kept');

                delete common.getPkCache[id];
                assert.strictEqual(await common.getPk(id), pem, 'read back from the repository');
            } finally {
                for (const f of ['etc/keys/' + id, 'etc/keys/backup/' + id]) if (fs.existsSync(f)) fs.unlinkSync(f);
            }
        });

        it('keeps keys in etc/keys when the keystore is off', async () => {
            const id = unique('files');
            delete process.env.CASS_ELASTIC_KEYSTORE;
            try {
                const pem = await common.getPk(id);
                assert.match(pem, /^-----BEGIN RSA PRIVATE KEY-----/);
                assert.strictEqual(fs.readFileSync('etc/keys/' + id, 'utf8'), pem);
            } finally {
                process.env.CASS_ELASTIC_KEYSTORE = 'true';
                if (fs.existsSync('etc/keys/' + id)) fs.unlinkSync('etc/keys/' + id);
            }
        });
    });
}
