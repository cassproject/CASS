const { assert } = require('chai');

// Characterization tests for profile helpers whose internals are being tidied:
// the convergence hash in calculator.js and the PEM lookup in util.js.
describe('Profile helpers (characterization)', function () {
    this.timeout(60000);
    const loopback = process.env.CASS_LOOPBACK || 'http://localhost/api/';

    before(async function () {
        if (process.env.NODEV != null) this.skip();
        let ready = false;
        global.events.server.ready.subscribe((isReady) => { if (isReady) ready = true; });
        while (!ready) await new Promise((resolve) => setTimeout(resolve, 100));
    });

    describe('getPersistentSafeHash', function () {
        let hash;
        before(() => {
            // calculator.js normally loads inside the profile worker, which defines this global.
            if (global.hasher == null) {
                const hashModuleRoot = require('node-object-hash');
                global.hasher = typeof hashModuleRoot === 'function' ? hashModuleRoot : hashModuleRoot.hasher;
            }
            hash = require('../main/server/profile/calculator.js').getPersistentSafeHash;
        });

        it('does not depend on the order keys were added in', () => {
            assert.strictEqual(hash({ b: 1, a: 2, B: 3, _: 4, 'é': 5, '10': 6, '9': 7 }), hash({ '9': 7, '10': 6, 'é': 5, _: 4, B: 3, a: 2, b: 1 }));
        });

        it('orders keys by UTF-16 code unit, as Array.prototype.sort does', () => {
            // Golden values: a change to the key order changes these digests.
            assert.strictEqual(hash({ b: 1, a: 2, B: 3, _: 4, 'é': 5, '10': 6, '9': 7, 'Z': 8, 'ä': 9 }), '75792d2ab5cd2a34fc3ab39a612fee77b67cee4de6f1bbcd9c4fe13c69243562');
            assert.strictEqual(hash([{ id: 'x', children: [{ id: 'x' }], b: 'B', a: 'A' }, null, 1, '1', true]), '207c4ca542272e72b9fdfca4f96b57a3f7b55179fdce268c5e03512754367c61');
        });

        it('distinguishes values that differ only in type', () => {
            assert.notStrictEqual(hash({ a: 1 }), hash({ a: '1' }));
            assert.notStrictEqual(hash([1]), hash({ 0: 1 }));
        });
    });

    describe('anythingToPerson', function () {
        it('finds a person by PEM when the person is not stored under the key\'s fingerprint', async () => {
            const repo = new EcRepository();
            await repo.init(loopback);
            const me = new EcIdentity();
            me.ppk = EcPpk.generateKey();
            me.displayName = 'Lookup by owner';
            EcIdentityManager.default.addIdentity(me);
            const person = new EcPerson();
            person.generateId(repo.selectedServer);
            person.addOwner(me.ppk.toPk());
            person.name = 'Owned Person';
            await repo.saveTo(person);

            const found = await global.anythingToPerson(me.ppk.toPk().toPem());
            assert.strictEqual(found.shortId(), person.shortId());
            assert.strictEqual(found.name, 'Owned Person');
            assert.strictEqual(await global.anythingToPem(me.ppk.toPk().toPem()), me.ppk.toPk().toPem());
        });

        it('an unknown e-mail address resolves to the Unknown Person', async () => {
            const found = await global.anythingToPerson('nobody.' + Date.now() + '@example.com');
            assert.strictEqual(found.name, 'Unknown Person');
        });
    });
});
