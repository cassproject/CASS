/**
 * Unit tests for src/main/server/xapi/lookups.js — the xAPI adapter's lookup cache, whose
 * entries only change between batches.
 */

const chai = require('chai');
const assert = chai.assert;
const { BatchCache } = require('../main/server/xapi/lookups.js');

describe('xAPI lookup cache', function () {
    let time, cache;
    const advance = (ms) => { time += ms; };

    beforeEach(() => {
        time = 1_760_000_000_000;
        cache = new BatchCache({ ttlMs: 60000, missTtlMs: 5000, now: () => time });
    });

    const counted = (value) => {
        const load = async () => { load.calls++; return value; };
        load.calls = 0;
        return load;
    };

    it('loads a value once and then serves it from the cache', async () => {
        const load = counted({ name: 'Person A' });
        cache.beginBatch();
        assert.deepEqual(await cache.get('person:a@example.com', load), { name: 'Person A' });
        assert.deepEqual(await cache.get('person:a@example.com', load), { name: 'Person A' });
        cache.endBatch();
        assert.deepEqual(await cache.get('person:a@example.com', load), { name: 'Person A' });
        assert.strictEqual(load.calls, 1);
    });

    it('caches "not found" (null), so a missing authority is not searched again', async () => {
        const load = counted(null);
        assert.isNull(await cache.get('person:lrs-api-key', load));
        assert.isNull(await cache.get('person:lrs-api-key', load));
        assert.strictEqual(load.calls, 1);
    });

    it('does not cache a failed lookup (undefined)', async () => {
        const load = counted(undefined);
        assert.isNull(await cache.get('person:x', load));
        assert.isNull(await cache.get('person:x', load));
        assert.strictEqual(load.calls, 2);
    });

    it('entries only expire at the end of a batch', async () => {
        const load = counted('found');
        cache.beginBatch();
        await cache.get('k', load);
        advance(60001);
        await cache.get('k', load);
        assert.strictEqual(load.calls, 1, 'still cached mid-batch, though past its lifetime');
        cache.endBatch();
        await cache.get('k', load);
        assert.strictEqual(load.calls, 2, 'expired at the end of the batch');
    });

    it('"not found" expires sooner than a found value, so something created later is picked up', async () => {
        await cache.get('miss', counted(null));
        await cache.get('hit', counted('found'));
        advance(5001);
        cache.beginBatch();
        cache.endBatch();
        assert.isFalse(cache.has('miss'));
        assert.isTrue(cache.has('hit'));
    });

    it('set() caches an object a batch created, before it is saved', async () => {
        cache.beginBatch();
        cache.set('person:new@example.com', { name: 'New' });
        const load = counted('should not load');
        assert.deepEqual(await cache.get('person:new@example.com', load), { name: 'New' });
        assert.strictEqual(load.calls, 0);
        cache.endBatch();
    });

    it('invalidations from other writers apply at the end of the batch, not during it', async () => {
        cache.beginBatch();
        await cache.get('aligned:https://activity', counted(['c1']));
        cache.invalidate('aligned:https://activity');
        assert.deepEqual(await cache.get('aligned:https://activity', counted(['c2'])), ['c1'], 'unchanged mid-batch');
        cache.endBatch();
        assert.deepEqual(await cache.get('aligned:https://activity', counted(['c2'])), ['c2']);
    });

    it('a change reported while no batch is running applies at once, so the next batch sees it', async () => {
        await cache.get('aligned:https://activity', counted(['c1']));
        cache.invalidate('aligned:https://activity');
        cache.beginBatch();
        assert.deepEqual(await cache.get('aligned:https://activity', counted(['c2'])), ['c2']);
        cache.endBatch();
        cache.replaceLater('person:a@example.com', { v: 2 });
        assert.deepEqual(cache.peek('person:a@example.com'), { v: 2 });
    });

    it('replaceLater swaps in a changed value at the end of the batch', async () => {
        cache.beginBatch();
        await cache.get('person:a@example.com', counted({ v: 1 }));
        cache.replaceLater('person:a@example.com', { v: 2 });
        assert.deepEqual(cache.peek('person:a@example.com'), { v: 1 });
        cache.endBatch();
        assert.deepEqual(cache.peek('person:a@example.com'), { v: 2 });
    });

    it('a replaced value counts as fresh', async () => {
        cache.beginBatch();
        await cache.get('k', counted({ v: 1 }));
        advance(59000);
        cache.replaceLater('k', { v: 2 });
        cache.endBatch();
        advance(2000);
        cache.beginBatch();
        cache.endBatch();
        assert.deepEqual(cache.peek('k'), { v: 2 });
    });

    it('a failed batch drops what it cached, so unsaved objects are not reused', async () => {
        await cache.get('before', counted('kept'));
        cache.beginBatch();
        cache.set('person:new@example.com', { name: 'never saved' });
        await cache.get('aligned:x', counted([]));
        cache.endBatch({ failed: true });
        assert.isFalse(cache.has('person:new@example.com'));
        assert.isFalse(cache.has('aligned:x'));
        assert.isTrue(cache.has('before'));
    });

    it('overlapping batches: nothing changes until the last one ends', async () => {
        cache.beginBatch(); // an LRS poll
        await cache.get('k', counted('v1'));
        cache.beginBatch(); // a statement POST meanwhile
        cache.invalidate('k');
        cache.endBatch(); // the POST ends; the poll is still running
        assert.isTrue(cache.has('k'));
        cache.endBatch();
        assert.isFalse(cache.has('k'));
    });

    it('overlapping batches: one failing does not drop the other\'s unsaved objects mid-batch', async () => {
        cache.beginBatch(); // the poll creates a Person, saved at its next flush
        cache.set('person:new@example.com', { name: 'created by the poll' });
        cache.beginBatch(); // a POST fails meanwhile
        cache.endBatch({ failed: true });
        assert.isTrue(cache.has('person:new@example.com'), 'the poll still finds the Person it created');
        cache.endBatch();
        assert.isFalse(cache.has('person:new@example.com'), 'dropped once no batch is running; looked up again next time');
    });

    it('a successful batch keeps what it cached', async () => {
        cache.beginBatch();
        cache.set('person:new@example.com', { name: 'saved' });
        cache.endBatch();
        assert.isTrue(cache.has('person:new@example.com'));
    });
});
