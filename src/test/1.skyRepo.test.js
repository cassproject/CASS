const chai = require('chai');
const sinon = require('sinon');
const fs = require('fs');
require('cassproject');

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
describe('SkyRepo Adapter', function () {
  it('Waiting for server to be ready', async () => {
    let ready = false;
    global.events.server.ready.subscribe(function (isReady) {
      if (!isReady) {
        console.log('Server not ready. Skipping tests.');
        return;
      }
      ready = true;
    });
    while (!ready) { await new Promise((resolve) => setTimeout(resolve, 100)); }
  });
  it('Search auto-extends', async () => {

  });

  it('Server Move', async () => {
    // Initial creation.
    const repo1 = new EcRepository();
    await repo1.init(process.env.CASS_LOOPBACK || "http://localhost/api/");
    const thing = new schema.Thing();
    thing.name = 'A thing.';
    thing.generateId(repo1.selectedServer);
    const canonicalUrl = thing.shortId();
    await repo1.saveTo(thing);

    // Wipe and create second repo link to alternate url.
    EcRepository.repos = [];
    const repo2 = new EcRepository();
    await repo2.init(process.env.CASS_LOOPBACK || `http://127.0.0.1:${process.env.PORT || 80}/api/`);

    // Get from repo2. Falls back to search (in error case);
    const thingCopy2 = await EcRepository.get(canonicalUrl);

    // Change the name.
    thingCopy2.name = 'B thing.';
    // And save it.
    await repo2.saveTo(thingCopy2);
    EcRepository.repos = [];

    EcRepository.repos = [repo1];
    // Now if we fetch using repo1, the name will be A thing, and if we fetch using repo2, the name will be B thing.
    const name1 = (await EcRepository.get(canonicalUrl)).name;
    EcRepository.repos = [repo2];
    const name2 = (await EcRepository.get(canonicalUrl)).name;
    assert.strictEqual(name1, name2, 'Names do not match.');
    EcRepository.repos = [repo1];
    await repo1.deleteRegistered(thing);
    assert.strictEqual((await EcRepository.get(canonicalUrl)), null, 'Canonical URL based reference is not null after deleted.');
    EcRepository.repos = [repo2];
    assert.strictEqual((await EcRepository.get(canonicalUrl)), null, 'Registered URL based reference is not null after deleted.');
  }).timeout(5000);

  it('Multiput', async () => {
    const repo = new EcRepository();
    await repo.init(process.env.CASS_LOOPBACK || "http://localhost/api/");

    let thing1 = new schema.Thing();
    thing1.generateId(repo.selectedServer);
    thing1.name = 'Thing 1';
    let thing2 = new schema.Thing();
    thing2.generateId(repo.selectedServer);
    thing2.name = 'Thing 2';



    // Multiput 2 things
    let result = await repo.multiput([thing1, thing2]);
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0]['@id'], thing1.id);
    assert.strictEqual(result[1]['@id'], thing2.id);

    const thing1id = thing1.id;
    const thing2id = thing2.id;

    // Should be able to get by shortId, and id and shortId should match what was saved
    const getThingByShortId1 = await EcRepository.get(thing1.shortId());
    assert.strictEqual(thing1.shortId(), getThingByShortId1.shortId());
    assert.strictEqual(thing1id, getThingByShortId1.id);

    const getThingByShortId2 = await EcRepository.get(thing2.shortId());
    assert.strictEqual(thing2.shortId(), getThingByShortId2.shortId());
    assert.strictEqual(thing2id, getThingByShortId2.id);

    // Should be able to get by id, and id and shortId should match what was saved
    const getThingById1 = await EcRepository.get(thing1.id);
    assert.strictEqual(thing1.shortId(), getThingById1.shortId());
    assert.strictEqual(thing1id, getThingById1.id);

    const getThingById2 = await EcRepository.get(thing2.id);
    assert.strictEqual(thing2.shortId(), getThingById2.shortId());
    assert.strictEqual(thing2id, getThingById2.id);

    // Updating should increase the version number
    thing1.name = 'Thing 1a';
    thing2.name = 'Thing 2a';
    result = await repo.multiput([thing1, thing2]);
    assert.strictEqual(result.length, 2);

    const getThingByShortId1a = await EcRepository.get(thing1.shortId());
    assert.strictEqual(thing1.shortId(), getThingByShortId1a.shortId());
    assert.isBelow(parseInt(thing1id.split('/').pop()), parseInt(getThingByShortId1a.id.split('/').pop()));
    assert.strictEqual('Thing 1a', getThingByShortId1a.name);

    const getThingByShortId2a = await EcRepository.get(thing2.shortId());
    assert.strictEqual(thing2.shortId(), getThingByShortId2.shortId());
    assert.isBelow(parseInt(thing2id.split('/').pop()), parseInt(getThingByShortId2a.id.split('/').pop()));
    assert.strictEqual('Thing 2a', getThingByShortId2a.name);

    // Test with short IDs
    thing1.generateShortId(repo.selectedServer);
    thing1.name = 'Thing 1b';
    thing2.generateShortId(repo.selectedServer);
    thing2.name = 'Thing 2b';

    const thing1bid = thing1.id;
    const thing2bid = thing2.id;

    result = await repo.multiput([thing1, thing2]);
    assert.strictEqual(result.length, 2);

    const getByShortId1b = await EcRepository.get(thing1.shortId());
    assert.strictEqual(thing1bid, getByShortId1b.id);
    const getByShortId2b = await EcRepository.get(thing2.shortId());
    assert.strictEqual(thing2bid, getByShortId2b.id);

    thing1.name = 'Thing 1c';
    thing2.name = 'Thing 2c';

    result = await repo.multiput([thing1, thing2]);
    assert.strictEqual(result.length, 2);

    const getByShortId1c = await EcRepository.get(thing1.shortId());
    assert.strictEqual(thing1bid, getByShortId1c.id);
    assert.strictEqual(getByShortId1c.name, 'Thing 1c');

    const getByShortId2c = await EcRepository.get(thing2.shortId());
    assert.strictEqual(thing2bid, getByShortId2c.id);
    assert.strictEqual(getByShortId2c.name, 'Thing 2c');

    // If not owner, shouldn't save
    newId1 = new EcIdentity();
    newId1.ppk = EcPpk.fromPem(
      "-----BEGIN RSA PRIVATE KEY-----MIIEowIBAAKCAQEArhqVpI3B8eM8nZcg4TbBnPWp31w5c7S84nbeGvOYYkS2g/I4WKxuxeRHSgU/skGM86b2GLt2im7mmZROphZIRh0Qo6g8E58j71Kr7G62N8V8i36XRM4SEhOlgMpI43OjwGwkgmNL5N4NDr1ZMMqXx1+QZ3x/KJrR5/pqonrbe5QM7qm4CATey2Oqnt86sOnpDslsXE+s1uZmqO37sHQttD/Ct1fLqxrIpP+XMk3iPZZbe3BxkWeT4DOPq6WI7tWJYbWXXX3Xf7BJaXH0hQUy8ylBt/vAWiEmTm6t7yiFzGTXZUDLX6smFe7vkfBz2ByyuH2b6HQWXSvOktAQcCLTcQIDAQABAoIBAHf6lAMZOX0i1oPXQO5S2Kv803q8SE9HTx9VQQwbsHiP16MoCdJ5ycCP5tzIrzN9XtANz+wNS8xsTnepr2VfV6ERqITPi88NzSrAsv+079eRPZm3vDDLPcK9TUFqpT4xU7hoDeTY3tUyfJcav1sTUfMwFQhr0AlAX8TYWiHsPlJy+fy3fZvjCvk6DhUiArpqXBAXzuN3jTYrbrYxfmmszFZNl9hVe5vQ3O+lNB1i/jvsP2aWR6AOfcrCzzrVGU+WavbuGCrHyAvsUIgHFfBiFdi6HSE/TB2HjgSyRhiarum9WD1f2cGn05IXbpJGx2b/jmjE/PqSypb4R2zWAMe2PH0CgYEA3d81eNpz6c1yfZzMVEDU+4Rbnd0Wa/0Ukufu1TOQgNiAYoz81ZrA5u99QpGONwzNtgBA2GkvkQVPPEXpBKser0eedZ1F+SG8O2KqJlhnOo/AHhQNNloJylsv9APDrI77FsGk8sBK38BB5s6c7SeCckR7bXJLdjrM+iZuWaXx1esCgYEAyOJh3MpJdQb7o0nkMZSwAAXOn0z4nm5sXT9n0Zvh+vZMbRtSK3366OY3bLK2C8YwBilgWE2z9kOiUVvcOYGes54ScYz6AVHcVfejBgn40NMCcNR6lcktll3pFwL5vfePey+yLzcWGl8RgIl6jIYba4OJnfGQ189qLmb3SvTkGRMCgYEAufx3HYS57/6Jf+Sln+bs4p4UEqQXPJTc3zzPByd/dZKHJJWdCA3+sFeHf/r15Q21j2Bs+zxJZF64CgVsjL5JLZNysJMS6gEugfV2PkiS2BNSb6RNYwdc96Uy8HELYSZGMtBGzjsFSMUoOStvfplFDzZ65McPnN8znmoCzOF/dNsCgYAYqzQ5WN4McP8V3k0XiZrTZeMpzNn7GrRT/yVQqEPn/bcE7wX4MVBOqXbE8m1IpN3g49PhBCnFZCjatN0mcrR6ej7pktZgsxzLsc1jQHY9rqvuDym+myXuATpOiR8CJRSJnCHVin48XtBXaIqUFyPm4BBWRQP0fJQdfqd/nPMl4QKBgEI705+8hkvGZU7mrCiIGSrQekY5DjeDU1Eq2kKFdm6sYOPxdvxkzmdJMEvkQ1bcHmtpdHMQPCe9Cglp+3ES0ZaSHODFOOdUbFQ6vu4Zwcf8upcjVG74ZfLe27doGP9SPORI2yfRp5WaTLbgqcrHKW8Zf5DEWOguccnr1NR1+aMW-----END RSA PRIVATE KEY-----"
    );
    thing1.addOwner(newId1.ppk.toPk());
    thing2.addOwner(newId1.ppk.toPk());

    result = await repo.multiput([thing1, thing2]);
    assert.strictEqual(result.length, 2);

    thing1.name = 'Thing 1d';
    thing2.name = 'Thing 2d';

    let result2 = await repo.multiput([thing1, thing2]);
    assert.strictEqual(result2.length, 0);

    const getByShortId1d = await EcRepository.get(thing1.shortId());
    assert.strictEqual(thing1bid, getByShortId1d.id);
    assert.strictEqual(getByShortId1d.name, 'Thing 1c');

    const getByShortId2d = await EcRepository.get(thing2.shortId());
    assert.strictEqual(thing2bid, getByShortId2d.id);
    assert.strictEqual(getByShortId2d.name, 'Thing 2c');

    // Should fail when field types are mix of object and not object

    const test1 = new EcCompetency();
    test1.generateId(repo.selectedServer);
    test1.testDataField = 'string';
    test1.name = 'Test 1';

    result = await repo.multiput([test1]);
    assert.strictEqual(result.length, 1);

    const test2 = new EcCompetency();
    test2.generateId(repo.selectedServer);
    test2.testDataField = { obj: 'thing' };
  // });
  // describe('global.keyFor', function () {
  //   let originalEnv;
  //   let fileToStringStub, fileLoadStub, fileSaveStub;

  //   beforeEach(function () {
  //     // Save original env and stubs
  //     originalEnv = { ...process.env };

  //     // Patch fs
  //     global.existsSyncStub = sinon.stub(fs, 'existsSync');
  //     fileToStringStub = sinon.stub(global, 'fileToString');
  //     fileLoadStub = sinon.stub(global, 'fileLoad');
  //     fileSaveStub = sinon.stub(global, 'fileSave');
  //   });

  //   afterEach(function () {
  //     process.env = originalEnv;
  //     sinon.restore();
  //   });

  //   it('should return key from process.env if present', function () {
  //     process.env['MY_KEY'] = 'env-key';
  //     const result = global.keyFor('MY_KEY');
  //     assert.strictEqual(result, 'env-key');
  //   });

  //   it('should return key from filename.pem if exists', function () {
  //     process.env['MY_KEY'] = undefined;
  //     fs.existsSync.withArgs('MY_KEY.pem').returns(true);
  //     fileLoadStub.withArgs('MY_KEY.pem', false, true).returns('file-content');
  //     fileToStringStub.withArgs('file-content').returns('pem-key');
  //     const result = global.keyFor('MY_KEY');
  //     assert.strictEqual(result, 'pem-key');
  //   });

  //   it('should return key from etc/filename.pem if exists', function () {
  //     process.env['MY_KEY'] = undefined;
  //     fs.existsSync.withArgs('MY_KEY.pem').returns(false);
  //     fs.existsSync.withArgs('etc/MY_KEY.pem').returns(true);
  //     fileLoadStub.withArgs('etc/MY_KEY.pem', false, true).returns('file-content');
  //     fileToStringStub.withArgs('file-content').returns('etc-pem-key');
  //     const result = global.keyFor('MY_KEY');
  //     assert.strictEqual(result, 'etc-pem-key');
  //   });

  //   it('should create etc directory if not exists', function () {
  //     process.env['MY_KEY'] = undefined;
  //     fs.existsSync.withArgs('MY_KEY.pem').returns(false);
  //     fs.existsSync.withArgs('etc/MY_KEY.pem').returns(false);
  //     fs.existsSync.withArgs('etc').returns(false);
  //     fileLoadStub.withArgs('etc/MY_KEY.pem', false, true).returns('file-content');
  //     fileToStringStub.withArgs('file-content').returns('generated-key');
  //     const result = global.keyFor('MY_KEY');
  //     sinon.assert.calledOnce(fileSaveStub);
  //     assert.strictEqual(result, 'generated-key');
  //   });

  //   it('should not create etc directory if it exists', function () {
  //     process.env['MY_KEY'] = undefined;
  //     fs.existsSync.withArgs('MY_KEY.pem').returns(false);
  //     fs.existsSync.withArgs('etc/MY_KEY.pem').returns(false);
  //     fs.existsSync.withArgs('etc').returns(true);
  //     fileLoadStub.withArgs('etc/MY_KEY.pem', false, true).returns('file-content');
  //     fileToStringStub.withArgs('file-content').returns('generated-key');
  //     const result = global.keyFor('MY_KEY');
  //     sinon.assert.calledOnce(fileSaveStub);
  //     assert.strictEqual(result, 'generated-key');
  //   });
  });
});