/**
 * Unit tests for src/main/server/xapi/cursor.js — the LRS read position, against a
 * simulated LRS that keeps receiving statements while a poll is reading pages.
 */

const { assert } = require('chai');
const { XapiCursor, pollStatements, sinceFileFor, settleFromEnv, LEGACY_SINCE_FILE, DEFAULT_SETTLE_MS } = require('../main/server/xapi/cursor.js');

/**
 * Behaves like an LRS for GET /statements: `since` is exclusive on `stored`, the result set
 * is fixed when the query is made, and `more` pages through that fixed set. A statement
 * stored `uncommitted` gets its `stored` time but is not visible until `commit()`, as when
 * the transaction that wrote it is still open.
 */
class SimulatedLrs {
    constructor({ pageSize = 3, honoursAscending = true } = {}) {
        this.pageSize = pageSize;
        this.honoursAscending = honoursAscending;
        this.statements = [];
        this.clock = Date.parse('2026-10-14T12:00:00.000Z');
        this.cursors = {};
        this.onPage = () => { };
        this.pagesServed = 0;
        this.hidden = new Set();
    }
    store(n = 1, sameInstant = false, { uncommitted = false } = {}) {
        for (let i = 0; i < n; i++) {
            if (!(sameInstant && i > 0)) this.clock += 7;
            const statement = { id: 'st-' + this.statements.length, stored: new Date(this.clock).toISOString() };
            if (uncommitted) this.hidden.add(statement.id);
            this.statements.push(statement);
        }
    }
    commit() { this.hidden.clear(); }
    wait(ms) { this.clock += ms; }
    query(since) {
        const sinceMs = since == null ? -Infinity : Date.parse(since);
        let matching = this.statements.filter((s) => Date.parse(s.stored) > sinceMs && !this.hidden.has(s.id));
        matching.sort((a, b) => Date.parse(a.stored) - Date.parse(b.stored));
        if (!this.honoursAscending) matching.reverse();
        return this.page(matching, 0);
    }
    page(list, offset) {
        this.pagesServed++;
        this.onPage(this.pagesServed);
        const statements = list.slice(offset, offset + this.pageSize);
        let more = '';
        if (offset + this.pageSize < list.length) {
            const token = 'more-' + Object.keys(this.cursors).length;
            this.cursors[token] = { list, offset: offset + this.pageSize };
            more = '/statements?more=' + token;
        }
        return { statements, more };
    }
    next(more) {
        const c = this.cursors[more.split('more=')[1]];
        return this.page(c.list, c.offset);
    }
    /** Time on the LRS clock now (used to model the old cursor, which saved the poll time). */
    now() { return new Date(this.clock + 1).toISOString(); }
}

/** One adapter poll against the simulated LRS, recording what happened. */
const poll = async (lrs, state, overrides = {}) => {
    const log = [];
    const result = await pollStatements({
        firstPage: async () => lrs.query(state.since),
        nextPage: async (more) => lrs.next(more),
        processStatement: async (statement, assertions) => {
            if (overrides.failOn != null && statement.id === overrides.failOn) throw new Error('processing failed');
            state.processed.push(statement.id);
            assertions.push({ about: statement.id });
        },
        saveAssertions: async (assertions) => {
            log.push(['assertions', assertions.length]);
            state.saved.push(...assertions.map((a) => a.about));
        },
        saveSince: async (since) => {
            log.push(['since', since]);
            state.since = since;
        },
        flushEvery: overrides.flushEvery,
        settleMs: overrides.settleMs ?? 0,
        recent: state.recent,
    });
    return { result, log };
};

const newState = (since = null) => ({ since, processed: [], saved: [], recent: new Set() });

describe('xAPI read position', function () {
    describe('XapiCursor', () => {
        it('final() is the latest stored time seen', () => {
            const cursor = new XapiCursor();
            cursor.observe({ stored: '2026-10-14T12:00:00.100Z' });
            cursor.observe({ stored: '2026-10-14T12:00:00.300Z' });
            cursor.observe({ stored: '2026-10-14T12:00:00.200Z' });
            assert.strictEqual(cursor.final(), '2026-10-14T12:00:00.300Z');
        });

        it('keeps the LRS\'s own spelling of the timestamp', () => {
            const cursor = new XapiCursor();
            cursor.observe({ stored: '2026-10-14T12:00:00.1234567+00:00' });
            assert.strictEqual(cursor.final(), '2026-10-14T12:00:00.1234567+00:00');
        });

        it('checkpoint() stops short of statements stored at the same instant as the latest', () => {
            const cursor = new XapiCursor();
            cursor.observe({ stored: '2026-10-14T12:00:00.100Z' });
            cursor.observe({ stored: '2026-10-14T12:00:00.200Z' });
            cursor.observe({ stored: '2026-10-14T12:00:00.200Z' });
            assert.strictEqual(cursor.checkpoint(), '2026-10-14T12:00:00.100Z');
        });

        it('checkpoint() is null when statements arrive newest first', () => {
            const cursor = new XapiCursor();
            cursor.observe({ stored: '2026-10-14T12:00:00.300Z' });
            cursor.observe({ stored: '2026-10-14T12:00:00.200Z' });
            cursor.observe({ stored: '2026-10-14T12:00:00.100Z' });
            assert.isNull(cursor.checkpoint());
            assert.strictEqual(cursor.final(), '2026-10-14T12:00:00.300Z');
        });

        it('checkpoint() is null once a statement without a stored time is seen', () => {
            const cursor = new XapiCursor();
            cursor.observe({ stored: '2026-10-14T12:00:00.100Z' });
            cursor.observe({ stored: '2026-10-14T12:00:00.200Z' });
            cursor.observe({ id: 'no-stored' });
            assert.isNull(cursor.checkpoint());
            assert.strictEqual(cursor.final(), '2026-10-14T12:00:00.200Z');
        });

        it('nothing seen: no position to save', () => {
            const cursor = new XapiCursor();
            assert.isNull(cursor.final());
            assert.isNull(cursor.checkpoint());
        });
    });

    describe('sinceFileFor', () => {
        it('the default endpoint keeps the legacy file', () => {
            assert.strictEqual(sinceFileFor(null), LEGACY_SINCE_FILE);
            assert.strictEqual(LEGACY_SINCE_FILE, 'etc/adapter.xapi.since.txt');
        });

        it('each configured LRS gets its own stable file', () => {
            const a = sinceFileFor({ xapiEndpoint: 'https://lrs-a.example.com/xapi/' });
            const b = sinceFileFor({ xapiEndpoint: 'https://lrs-b.example.com/xapi/' });
            assert.match(a, /^etc\/adapter\.xapi\.since\.[0-9a-f]{64}\.txt$/);
            assert.notEqual(a, b);
            assert.strictEqual(a, sinceFileFor({ xapiEndpoint: 'https://lrs-a.example.com/xapi/', xapiAuth: 'other' }));
        });
    });

    describe('pollStatements', () => {
        it('reads every page and saves the last stored time as since', async () => {
            const lrs = new SimulatedLrs({ pageSize: 3 });
            lrs.store(8);
            const state = newState();
            const { result } = await poll(lrs, state);
            assert.deepEqual(state.processed, lrs.statements.map((s) => s.id));
            assert.strictEqual(state.since, lrs.statements[7].stored);
            assert.deepEqual(result, { statements: 8, since: lrs.statements[7].stored });
        });

        it('the simulated LRS reproduces the reported loss with the old cursor (poll time as since)', async () => {
            const lrs = new SimulatedLrs({ pageSize: 2 });
            lrs.store(4);
            lrs.onPage = (n) => { if (n > 1) lrs.store(1); };
            const processed = [];
            let since = null;
            let page = lrs.query(since);
            while (page.statements.length > 0) {
                const lastRequested = lrs.now();
                processed.push(...page.statements.map((s) => s.id));
                since = lastRequested;
                page = page.more ? lrs.next(page.more) : { statements: [] };
            }
            lrs.onPage = () => { };
            page = lrs.query(since);
            processed.push(...page.statements.map((s) => s.id));
            const missed = lrs.statements.map((s) => s.id).filter((id) => !processed.includes(id));
            assert.isNotEmpty(missed, 'statements stored during the poll are skipped by the old cursor');
        });

        it('statements stored while a poll is running are read by the next poll', async () => {
            const lrs = new SimulatedLrs({ pageSize: 2 });
            lrs.store(5);
            let arrivals = 0;
            lrs.onPage = () => { if (arrivals++ < 20) lrs.store(1); };
            const state = newState();
            for (let i = 0; i < 30 && (i == 0 || state.processed.length < lrs.statements.length); i++) {
                await poll(lrs, state);
            }
            assert.strictEqual(lrs.statements.length, 25);
            assert.sameMembers([...new Set(state.processed)], lrs.statements.map((s) => s.id));
            assert.sameMembers([...new Set(state.saved)], lrs.statements.map((s) => s.id));
        });

        it('an empty poll saves nothing', async () => {
            const lrs = new SimulatedLrs();
            const state = newState('2026-10-14T11:00:00.000Z');
            const { log } = await poll(lrs, state);
            assert.deepEqual(log, []);
            assert.strictEqual(state.since, '2026-10-14T11:00:00.000Z');
        });

        it('a poll whose first request fails saves nothing', async () => {
            const state = newState('2026-10-14T11:00:00.000Z');
            const log = [];
            await pollStatements({
                firstPage: async () => null,
                nextPage: async () => assert.fail('no next page'),
                processStatement: async () => assert.fail('nothing to process'),
                saveAssertions: async () => log.push('assertions'),
                saveSince: async () => log.push('since'),
            });
            assert.deepEqual(log, []);
        });

        it('assertions are saved before the since that covers them', async () => {
            const lrs = new SimulatedLrs({ pageSize: 3 });
            lrs.store(7);
            const state = newState();
            const { log } = await poll(lrs, state, { flushEvery: 3 });
            assert.deepEqual(log, [
                ['assertions', 3], ['since', lrs.statements[1].stored],
                ['assertions', 3], ['since', lrs.statements[4].stored],
                ['assertions', 1], ['since', lrs.statements[6].stored],
            ]);
        });

        it('assertions are saved in groups of flushEvery rather than all at the end', async () => {
            const lrs = new SimulatedLrs({ pageSize: 10 });
            lrs.store(1200);
            const state = newState();
            const { log } = await poll(lrs, state);
            const groups = log.filter(([kind]) => kind === 'assertions').map(([, n]) => n);
            assert.deepEqual(groups, [500, 500, 200]);
            assert.strictEqual(state.saved.length, 1200);
        });

        it('a poll that fails part-way resumes without skipping anything', async () => {
            const lrs = new SimulatedLrs({ pageSize: 2 });
            lrs.store(9);
            const state = newState();
            try {
                await poll(lrs, state, { flushEvery: 2, failOn: 'st-6' });
                assert.fail('expected the processing error');
            } catch (ex) {
                assert.strictEqual(ex.message, 'processing failed');
            }
            assert.isAtMost(Date.parse(state.since), Date.parse(lrs.statements[5].stored));
            await poll(lrs, state, { flushEvery: 2 });
            assert.sameMembers([...new Set(state.saved)], lrs.statements.map((s) => s.id));
            assert.strictEqual(state.since, lrs.statements[8].stored);
        });

        it('a part-way failure re-reads statements stored at the same instant across a page boundary', async () => {
            const lrs = new SimulatedLrs({ pageSize: 2 });
            lrs.store(1);
            lrs.store(3, true); // st-1..st-3 share one stored time; st-3 is on the second page
            lrs.store(1);
            const state = newState();
            try {
                await poll(lrs, state, { flushEvery: 2, failOn: 'st-3' });
                assert.fail('expected the processing error');
            } catch (ex) {
                assert.strictEqual(ex.message, 'processing failed');
            }
            await poll(lrs, state, { flushEvery: 2 });
            assert.include(state.saved, 'st-3');
            assert.sameMembers([...new Set(state.saved)], lrs.statements.map((s) => s.id));
        });

        it('an LRS that returns newest first: since only advances once the whole poll is read', async () => {
            const lrs = new SimulatedLrs({ pageSize: 2, honoursAscending: false });
            lrs.store(6);
            const state = newState();
            const { log } = await poll(lrs, state, { flushEvery: 2 });
            assert.deepEqual(log.filter(([kind]) => kind === 'since'), [['since', lrs.statements[5].stored]]);
            assert.sameMembers(state.saved, lrs.statements.map((s) => s.id));
        });

        it('an LRS that returns newest first and fails part-way does not skip older statements', async () => {
            const lrs = new SimulatedLrs({ pageSize: 2, honoursAscending: false });
            lrs.store(6);
            const state = newState();
            try {
                await poll(lrs, state, { flushEvery: 2, failOn: 'st-1' });
            } catch (ex) { /* expected */ }
            assert.isNull(state.since);
            await poll(lrs, state, { flushEvery: 2 });
            assert.sameMembers([...new Set(state.saved)], lrs.statements.map((s) => s.id));
        });
    });

    describe('settle interval', () => {
        const SETTLE = 5000;
        const ids = (lrs) => lrs.statements.map((s) => s.id);
        const count = (list, id) => list.filter((x) => x === id).length;

        it('XAPI_SINCE_SETTLE_MS sets it, 5 seconds by default', () => {
            const saved = process.env.XAPI_SINCE_SETTLE_MS;
            try {
                delete process.env.XAPI_SINCE_SETTLE_MS;
                assert.strictEqual(settleFromEnv(), 5000);
                assert.strictEqual(DEFAULT_SETTLE_MS, 5000);
                process.env.XAPI_SINCE_SETTLE_MS = '250';
                assert.strictEqual(settleFromEnv(), 250);
                process.env.XAPI_SINCE_SETTLE_MS = '0';
                assert.strictEqual(settleFromEnv(), 0);
                process.env.XAPI_SINCE_SETTLE_MS = 'soon';
                assert.strictEqual(settleFromEnv(), 5000);
                process.env.XAPI_SINCE_SETTLE_MS = '-1';
                assert.strictEqual(settleFromEnv(), 0);
            } finally {
                if (saved === undefined) delete process.env.XAPI_SINCE_SETTLE_MS;
                else process.env.XAPI_SINCE_SETTLE_MS = saved;
            }
        });

        it('XapiCursor: final() is the newest statement at least the interval older than the newest seen', () => {
            const cursor = new XapiCursor({ settleMs: 1000, now: Date.parse('2026-10-14T13:00:00.000Z') });
            cursor.observe({ stored: '2026-10-14T12:00:00.000Z' });
            cursor.observe({ stored: '2026-10-14T12:00:01.000Z' });
            cursor.observe({ stored: '2026-10-14T12:00:01.500Z' });
            cursor.observe({ stored: '2026-10-14T12:00:02.000Z' });
            assert.strictEqual(cursor.final(), '2026-10-14T12:00:01.000Z');
            assert.strictEqual(cursor.checkpoint(), '2026-10-14T12:00:01.000Z');
        });

        it('XapiCursor: and at least the interval older than the start of the poll, when the LRS clock is ahead', () => {
            const cursor = new XapiCursor({ settleMs: 1000, now: Date.parse('2026-10-14T12:00:01.200Z') });
            cursor.observe({ stored: '2026-10-14T12:00:00.000Z' });
            cursor.observe({ stored: '2026-10-14T12:00:00.100Z' });
            cursor.observe({ stored: '2026-10-14T12:00:00.500Z' });
            cursor.observe({ stored: '2026-10-14T12:00:05.000Z' });
            assert.strictEqual(cursor.final(), '2026-10-14T12:00:00.100Z');
        });

        it('XapiCursor: nothing old enough keeps the current position', () => {
            const cursor = new XapiCursor({ settleMs: 1000, now: Date.parse('2026-10-14T13:00:00.000Z') });
            cursor.observe({ stored: '2026-10-14T12:00:00.000Z' });
            cursor.observe({ stored: '2026-10-14T12:00:00.900Z' });
            assert.isNull(cursor.final());
            assert.isNull(cursor.checkpoint());
        });

        it('without it, a statement made visible after a newer one was read is never read', async () => {
            const lrs = new SimulatedLrs({ pageSize: 10 });
            lrs.store(2);
            lrs.store(1, false, { uncommitted: true });
            lrs.store(2);
            const state = newState();
            await poll(lrs, state, { settleMs: 0 });
            lrs.commit();
            await poll(lrs, state, { settleMs: 0 });
            assert.notInclude(state.saved, 'st-2');
        });

        it('with it, that statement is read by a later poll, and the others are processed once', async () => {
            const lrs = new SimulatedLrs({ pageSize: 10 });
            lrs.store(2);
            lrs.store(1, false, { uncommitted: true });
            lrs.store(2);
            const state = newState();
            await poll(lrs, state, { settleMs: SETTLE });
            assert.notInclude(state.saved, 'st-2');
            lrs.commit();
            await poll(lrs, state, { settleMs: SETTLE });
            assert.sameMembers(state.saved, ids(lrs));
            for (const id of ids(lrs)) assert.strictEqual(count(state.processed, id), 1, id);
        });

        it('since moves forward once statements are older than the interval, and repeated polls process each statement once', async () => {
            const lrs = new SimulatedLrs({ pageSize: 2 });
            lrs.store(3);
            const state = newState();
            await poll(lrs, state, { settleMs: SETTLE });
            assert.isNull(state.since, 'all three are within the interval of the newest');
            await poll(lrs, state, { settleMs: SETTLE });
            lrs.wait(SETTLE);
            lrs.store(2);
            await poll(lrs, state, { settleMs: SETTLE });
            assert.strictEqual(state.since, lrs.statements[2].stored);
            await poll(lrs, state, { settleMs: SETTLE });
            assert.sameMembers(state.saved, ids(lrs));
            for (const id of ids(lrs)) assert.strictEqual(count(state.processed, id), 1, id);
        });

        it('statements committing late while polls run are all read, across many polls', async () => {
            const lrs = new SimulatedLrs({ pageSize: 4 });
            const state = newState();
            for (let round = 0; round < 40; round++) {
                lrs.commit();
                lrs.store(3);
                lrs.store(1, false, { uncommitted: true });
                lrs.store(2);
                lrs.wait(1000);
                await poll(lrs, state, { settleMs: SETTLE });
            }
            lrs.commit();
            lrs.wait(2 * SETTLE);
            await poll(lrs, state, { settleMs: SETTLE });
            assert.sameMembers([...new Set(state.saved)], ids(lrs));
            for (const id of ids(lrs)) assert.strictEqual(count(state.processed, id), 1, id);
        });

        it('a poll that fails keeps what the last successful one processed, and nothing is skipped', async () => {
            const lrs = new SimulatedLrs({ pageSize: 2 });
            lrs.store(4);
            const state = newState();
            await poll(lrs, state, { settleMs: SETTLE });
            lrs.store(3);
            try {
                await poll(lrs, state, { settleMs: SETTLE, flushEvery: 2, failOn: 'st-5' });
                assert.fail('expected the processing error');
            } catch (ex) {
                assert.strictEqual(ex.message, 'processing failed');
            }
            await poll(lrs, state, { settleMs: SETTLE });
            assert.sameMembers([...new Set(state.saved)], ids(lrs));
            for (const id of ['st-0', 'st-1', 'st-2', 'st-3']) assert.strictEqual(count(state.processed, id), 1, id);
        });

        it('an empty or failed read keeps what the last poll processed', async () => {
            const lrs = new SimulatedLrs({ pageSize: 10 });
            lrs.store(3);
            const state = newState();
            await poll(lrs, state, { settleMs: SETTLE });
            const before = [...state.recent];
            assert.lengthOf(before, 3);
            await pollStatements({
                firstPage: async () => null,
                nextPage: async () => assert.fail('no next page'),
                processStatement: async () => assert.fail('nothing to process'),
                saveAssertions: async () => { },
                saveSince: async () => { },
                settleMs: SETTLE,
                recent: state.recent,
            });
            assert.sameMembers([...state.recent], before);
            await poll(lrs, state, { settleMs: SETTLE });
            for (const id of ids(lrs)) assert.strictEqual(count(state.processed, id), 1, id);
        });
    });
});
