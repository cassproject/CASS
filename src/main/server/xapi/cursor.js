/**
 * Read position ("since") handling for polling an LRS.
 *
 * The LRS applies `since` exclusively against each statement's `stored` time, on the LRS's
 * clock. The next `since` must therefore come from the `stored` times of statements actually
 * processed: anything later (such as the time the poll ran) skips statements the LRS stored
 * while the poll was reading earlier pages.
 *
 * Kept free of server globals so it can be unit-tested against a simulated LRS.
 */

const crypto = require('crypto');

const LEGACY_SINCE_FILE = 'etc/adapter.xapi.since.txt';

/** Since file for one configured LRS; the unconfigured (default) endpoint keeps the legacy file. */
const sinceFileFor = (config) => {
    if (config == null || config.xapiEndpoint == null) return LEGACY_SINCE_FILE;
    return 'etc/adapter.xapi.since.' + crypto.createHash('sha256').update(config.xapiEndpoint).digest('hex') + '.txt';
};

class XapiCursor {
    constructor() {
        this.latest = null; // The latest `stored` value seen, as the LRS wrote it.
        this.latestMs = null;
        this.earlier = null; // The latest `stored` value strictly before `latest`.
        this.inOrder = true; // Whether statements arrived oldest first, so a partial poll can be resumed.
    }

    observe(statement) {
        const ms = Date.parse(statement?.stored);
        if (!Number.isFinite(ms)) {
            this.inOrder = false;
            return;
        }
        if (this.latestMs != null && ms < this.latestMs) {
            this.inOrder = false;
        }
        if (this.latestMs == null || ms > this.latestMs) {
            this.earlier = this.latest;
            this.latest = statement.stored;
            this.latestMs = ms;
        }
    }

    /**
     * A since that is safe to save before the poll has finished, or null. It stops short of
     * `latest` because statements stored at that same instant may still be on later pages.
     */
    checkpoint() {
        return this.inOrder ? this.earlier : null;
    }

    /** The since to save once every page has been processed, or null to keep the current one. */
    final() {
        return this.latest;
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
 * @param {object} options
 * @param {Function} options.firstPage Resolves to the first page ({statements, more}).
 * @param {Function} options.nextPage Resolves the page for a `more` link.
 * @param {Function} options.processStatement (statement, assertions) adds the statement's assertions.
 * @param {Function} options.saveAssertions Saves an array of assertions.
 * @param {Function} options.saveSince Persists the new since.
 * @param {number} [options.flushEvery]
 * @returns {Promise<{statements: number, since: string|null}>}
 */
const pollStatements = async ({ firstPage, nextPage, processStatement, saveAssertions, saveSince, flushEvery = 500 }) => {
    const cursor = new XapiCursor();
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
            await processStatement(statement, assertions);
            cursor.observe(statement);
            processed++;
        }
        if (assertions.length >= flushEvery) {
            await flush(cursor.checkpoint());
        }
        page = page.more != null && page.more !== '' ? await nextPage(page.more) : null;
    }
    await flush(cursor.final());
    return { statements: processed, since: saved };
};

module.exports = { XapiCursor, pollStatements, sinceFileFor, LEGACY_SINCE_FILE };
