const { assert } = require('chai');

// multiGet returns what get returns for each object: an object with readers only to a request
// signed by one of its owners or readers.
describe('SkyRepo multiGet reads as get does', function () {
    this.timeout(60000);
    const api = () => process.env.CASS_LOOPBACK || 'http://localhost/api/';
    let r;
    let ownerEim;
    let readerEim;
    let strangerEim;
    let restricted;
    let open;

    const identityManager = function () {
        const eim = new EcIdentityManager();
        const identity = new EcIdentity();
        identity.ppk = EcPpk.generateKey();
        eim.addIdentity(identity);
        return eim;
    };
    const multiGet = async function (things, eim, ids) {
        const form = new FormData();
        form.append('data', JSON.stringify(things.map((t) => 'data/' + t.getDottedType() + '/' + t.getGuid())));
        if (ids) form.append('ids', 'true');
        if (eim != null) form.append('signatureSheet', await eim.signatureSheet(60000, r.selectedServer));
        const response = await fetch(api() + 'sky/repo/multiGet', { method: 'POST', body: form });
        assert.strictEqual(response.status, 200);
        return await response.json();
    };
    const get = async function (thing, eim) {
        const headers = eim == null ? {} : { signatureSheet: await eim.signatureSheet(60000, r.selectedServer) };
        return (await fetch(api() + 'data/' + thing.getGuid(), { headers: headers })).status;
    };

    before(async function () {
        if (process.env.NODEV != null) this.skip();
        let ready = false;
        global.events.server.ready.subscribe((isReady) => { if (isReady) ready = true; });
        while (!ready) await new Promise((resolve) => setTimeout(resolve, 100));
        r = new EcRepository();
        await r.init(api());
        ownerEim = identityManager();
        readerEim = identityManager();
        strangerEim = identityManager();

        restricted = new schema.Thing();
        restricted.generateId(r.selectedServer);
        restricted.name = 'For its readers';
        restricted.addOwner(ownerEim.ids[0].ppk.toPk());
        restricted.addReader(readerEim.ids[0].ppk.toPk());
        await r.saveTo(restricted, null, null, ownerEim);

        open = new schema.Thing();
        open.generateId(r.selectedServer);
        open.name = 'For anyone';
        open.addOwner(ownerEim.ids[0].ppk.toPk());
        await r.saveTo(open, null, null, ownerEim);
    });

    after(async function () {
        if (r == null) return;
        for (const thing of [restricted, open]) {
            try {
                await r.deleteRegistered(thing, null, null, ownerEim);
            } catch (e) {
                // best effort cleanup
            }
        }
    });

    it('get: an object with readers is for its owners and readers', async function () {
        assert.strictEqual(await get(restricted), 404, 'no signature');
        assert.strictEqual(await get(restricted, strangerEim), 404, 'someone else');
        assert.strictEqual(await get(restricted, readerEim), 200, 'a reader');
        assert.strictEqual(await get(restricted, ownerEim), 200, 'an owner');
        assert.strictEqual(await get(open), 200, 'an object without readers is for anyone');
    });

    it('multiGet: the same, for each object asked for', async function () {
        const names = async (eim) => (await multiGet([restricted, open], eim)).map((o) => o.name).sort();
        assert.deepStrictEqual(await names(null), ['For anyone'], 'no signature');
        assert.deepStrictEqual(await names(strangerEim), ['For anyone'], 'someone else');
        assert.deepStrictEqual(await names(readerEim), ['For anyone', 'For its readers'], 'a reader');
        assert.deepStrictEqual(await names(ownerEim), ['For anyone', 'For its readers'], 'an owner');
    });

    it('multiGet with ids: the same', async function () {
        assert.deepStrictEqual(await multiGet([restricted, open], null, true), [open.id], 'no signature');
        assert.deepStrictEqual((await multiGet([restricted, open], readerEim, true)).sort(), [open.id, restricted.id].sort(), 'a reader');
    });

    it('multiGet of only objects the request may not read returns nothing', async function () {
        assert.deepStrictEqual(await multiGet([restricted], null), []);
    });
});
