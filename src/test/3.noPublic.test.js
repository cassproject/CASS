const { assert } = require('chai');
require("cassproject");

// NO_PUBLIC=true: writes without a signature sheet are refused; signed writes and reads still work.
describe("NO_PUBLIC", function () {
    this.timeout(30000);
    const server = process.env.CASS_LOOPBACK || "http://localhost/api/";
    let repo;
    let identity;
    let previous;

    before(async () => {
        repo = new EcRepository();
        repo.selectedServer = server;
        identity = new EcIdentity();
        identity.ppk = EcPpk.generateKey();
        identity.displayName = "NO_PUBLIC test user";
        previous = process.env.NO_PUBLIC;
        process.env.NO_PUBLIC = 'true';
    });

    after(() => {
        if (previous === undefined) delete process.env.NO_PUBLIC;
        else process.env.NO_PUBLIC = previous;
        EcIdentityManager.default.ids = EcIdentityManager.default.ids.filter((i) => i !== identity);
    });

    const unsignedPost = async (path, body) => {
        const formData = new FormData();
        formData.append('data', JSON.stringify(body));
        return await fetch(server + path, { method: 'POST', body: formData });
    };

    const competency = (owner) => {
        const c = new EcCompetency();
        c.generateId(server);
        c.setName("NO_PUBLIC " + EcCrypto.generateUUID());
        if (owner) c.addOwner(owner.ppk.toPk());
        return c;
    };

    it('refuses an anonymous save', async () => {
        const c = competency(null);
        const response = await unsignedPost('data/' + c.getGuid(), JSON.parse(c.toJson()));
        assert.equal(response.status, 401);
        assert.equal(await EcRepository.get(c.shortId()), null, "Nothing was saved.");
    });

    it('refuses an anonymous multiPut', async () => {
        const c = competency(null);
        const response = await unsignedPost('sky/repo/multiPut', [JSON.parse(c.toJson())]);
        assert.equal(response.status, 401);
    });

    it('refuses an anonymous delete', async () => {
        const response = await fetch(server + 'data/' + EcCrypto.generateUUID(), { method: 'DELETE' });
        assert.equal(response.status, 401);
    });

    it('accepts a signed save, and reads stay open', async () => {
        EcIdentityManager.default.addIdentity(identity);
        const c = competency(identity);
        await repo.saveTo(c);
        const read = await fetch(c.shortId());
        assert.equal(read.status, 200, "Anonymous reads are unaffected.");
        assert.equal(EcRemoteLinkedData.trimVersionFromUrl(JSON.parse(await read.text())["@id"]), c.shortId());
    });

    it('accepts anonymous saves when NO_PUBLIC is not true', async () => {
        process.env.NO_PUBLIC = 'false';
        try {
            const c = competency(null);
            const response = await unsignedPost('data/' + c.getGuid(), JSON.parse(c.toJson()));
            assert.equal(response.status, 200);
        } finally {
            process.env.NO_PUBLIC = 'true';
        }
    });
});
