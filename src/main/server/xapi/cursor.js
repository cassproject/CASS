/**
 * Read position ("since") handling for polling an LRS.
 *
 * The LRS applies `since` exclusively against each statement's `stored` time, on the LRS's
 * clock. The next `since` must therefore come from the `stored` times of statements actually
 * processed: anything later (such as the time the poll ran) skips statements the LRS stored
 * while the poll was reading earlier pages.
 *
 * An LRS can also make a statement visible only some time after its `stored` time (when the
 * transaction that wrote it commits), so with several writers a statement can appear behind a
 * newer one that was already read. To pick those up, the saved since is held a settle interval
 * (XAPI_SINCE_SETTLE_MS, 5 seconds by default) behind the newest statement read and behind the
 * time the poll started, and that interval is read again by the next poll.
 *
 * Kept free of server globals so it can be unit-tested against a simulated LRS.
 */

const crypto = require('node:crypto');

const LEGACY_SINCE_FILE = 'etc/adapter.xapi.since.txt';

/** Since file for one configured LRS; the unconfigured (default) endpoint keeps the legacy file. */
const sinceFileFor = (config) => {
    if (config?.xapiEndpoint == null) return LEGACY_SINCE_FILE;
    return 'etc/adapter.xapi.since.' + crypto.createHash('sha256').update(config.xapiEndpoint).digest('hex') + '.txt';
};

const DEFAULT_SETTLE_MS = 5000;

/** The settle interval from XAPI_SINCE_SETTLE_MS, in milliseconds. */
const settleFromEnv = () => {
    const ms = Number.parseInt(process.env.XAPI_SINCE_SETTLE_MS, 10);
    return Number.isFinite(ms) ? Math.max(0, ms) : DEFAULT_SETTLE_MS;
};

class XapiCursor {
    latest = null; // The latest `stored` value seen, as the LRS wrote it.
    latestMs = null;
    inOrder = true; // Whether statements arrived oldest first, so a partial poll can be resumed.
    seen = []; // [ms, stored] of every statement seen.

    /**
     * @param {object} [options]
     * @param {number} [options.settleMs] How far behind the newest statement (and the poll's
     *   start) the position is held. 0 saves the newest statement read.
     * @param {number} [options.now] When the poll started, on this server's clock.
     */
    constructor({ settleMs = 0, now = Date.now() } = {}) {
        this.settleMs = settleMs;
        this.startedMs = now;
    }

    observe(statement) {
        const ms = Date.parse(statement?.stored);
        if (!Number.isFinite(ms)) {
            this.inOrder = false;
            return;
        }
        this.seen.push([ms, statement.stored]);
        if (this.latestMs != null && ms < this.latestMs) {
            this.inOrder = false;
        }
        if (this.latestMs == null || ms > this.latestMs) {
            this.latest = statement.stored;
            this.latestMs = ms;
        }
    }

    /** The latest stored value seen that is at or before the settled limit (and, if `strict`, before `latest`). */
    settled(strict) {
        if (this.latestMs == null) return null;
        const limit = this.settleMs > 0 ? Math.min(this.latestMs, this.startedMs) - this.settleMs : this.latestMs;
        let best = null;
        for (const [ms, stored] of this.seen) {
            if (ms <= limit && !(strict && ms >= this.latestMs) && (best == null || ms > best[0])) best = [ms, stored];
        }
        return best == null ? null : best[1];
    }

    /**
     * A since that is safe to save before the poll has finished, or null. It stops short of
     * `latest` because statements stored at that same instant may still be on later pages.
     */
    checkpoint() {
        return this.inOrder ? this.settled(true) : null;
    }

    /** The since to save once every page has been processed, or null to keep the current one. */
    final() {
        return this.settled(false);
    }
}

/**
 * Reads every page of one poll, oldest first, turning statements into assertions.
 *
 * Assertions are saved in groups of `flushEvery`, and `since` is only saved after the
 * assertions for every statement it covers have been saved. Re-reading a statement is
 * harmless (assertion ids are derived from the statement id), so on any doubt the
 * position is left where it was.
 *
 * Statements in the settle interval are read again by the next poll. Given `recent`, a Set
 * kept by the caller for one LRS, a poll skips the statements an earlier successful poll
 * already processed there, and after a successful poll `recent` holds the ids the next poll
 * will read again.
 *
 * @param {object} options
 * @param {Function} options.firstPage Resolves to the first page ({statements, more}).
 * @param {Function} options.nextPage Resolves the page for a `more` link.
 * @param {Function} options.processStatement (statement, assertions) adds the statement's assertions.
 * @param {Function} options.saveAssertions Saves an array of assertions.
 * @param {Function} options.saveSince Persists the new since.
 * @param {number} [options.flushEvery]
 * @param {number} [options.settleMs] Defaults to XAPI_SINCE_SETTLE_MS, or 5000.
 * @param {Set<string>} [options.recent]
 * @returns {Promise<{statements: number, since: string|null}>}
 */
const pollStatements = async ({ firstPage, nextPage, processStatement, saveAssertions, saveSince, flushEvery = 500, settleMs = settleFromEnv(), recent = null }) => {
    const cursor = new XapiCursor({ settleMs });
    const read = []; // [stored ms, id] of every statement read
    let assertions = [];
    let processed = 0;
    let saved = null;
    const flush = async (since) => {
        if (assertions.length > 0) {
            const batch = assertions;
            assertions = [];
            await saveAssertions(batch);
        }
        if (since != null && since !== saved) {
            await saveSince(since);
            saved = since;
        }
    };

    let page = await firstPage();
    while (page != null && Array.isArray(page.statements) && page.statements.length > 0) {
        for (const statement of page.statements) {
            const id = statement?.id;
            if (!(id != null && recent?.has(id))) {
                await processStatement(statement, assertions);
            }
            cursor.observe(statement);
            if (id != null) read.push([Date.parse(statement.stored), id]);
            processed++;
        }
        if (assertions.length >= flushEvery) {
            await flush(cursor.checkpoint());
        }
        page = page.more != null && page.more !== '' ? await nextPage(page.more) : null;
    }
    const since = cursor.final();
    await flush(since);
    if (recent != null && read.length > 0) {
        // The next poll reads again whatever is after the since it starts from.
        const sinceMs = since == null ? null : Date.parse(since);
        recent.clear();
        for (const [ms, id] of read) {
            if (sinceMs == null || !(ms <= sinceMs)) recent.add(id);
        }
    }
    return { statements: processed, since: saved };
};

module.exports = { XapiCursor, pollStatements, sinceFileFor, settleFromEnv, LEGACY_SINCE_FILE, DEFAULT_SETTLE_MS };
