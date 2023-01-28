const axios = require('axios');
const FormData = require('form-data');
const chai = require('chai');
require('cassproject');

const hrtime = function() {
  try {
    return [Math.round(performance.now()/1000), performance.now() * 1000];
  } catch (e) {
    // Eat quietly.
  }
  return process.hrtime();
};

const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;


describe('SkyRepo Adapter', function() {
  it('Search auto-extends', async ()=>{

  });

  it('Server Move', async () => {
    // Initial creation.
    const repo1 = new EcRepository();
    await repo1.init('http://localhost/api/');
    const thing = new schema.Thing();
    thing.name = 'A thing.';
    thing.generateId(repo1.selectedServer);
    const canonicalUrl = thing.shortId();
    await repo1.saveTo(thing);

    // Wipe and create second repo link to alternate url.
    EcRepository.repos = [];
    const repo2 = new EcRepository();
    await repo2.init('http://127.0.0.1/api/');

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
  }).timeout(1000);
});
