/**
 * Lookup cache for the xAPI adapter (Persons by email or account, competency alignments of
 * activities).
 *
 * Within a batch of statements the cache only grows: entries expire, and changes reported by
 * other writers are applied, once the batch ends (and any batch overlapping it, such as a
 * statement POST during an LRS poll). Statements in one batch therefore all see the same
 * answers, and objects a batch creates are found again without being saved first.
 *
 * Kept free of server globals so it can be unit-tested.
 */
class BatchCache {
    /**
     * @param {object} [options]
     * @param {number} [options.ttlMs] Lifetime of a found value.
     * @param {number} [options.missTtlMs] Lifetime of a "not found" (null) value, so something created later is picked up.
     * @param {Function} [options.now] Clock in milliseconds.
     */
    constructor({ ttlMs = 60 * 60 * 1000, missTtlMs = 5 * 60 * 1000, now = Date.now } = {}) {
        this.ttlMs = ttlMs;
        this.missTtlMs = missTtlMs;
        this.now = now;
        this.entries = new Map(); // key -> { value, at }
        this.changes = new Map(); // key -> { value } to set, or null to drop, at endBatch
        this.added = new Set(); // keys cached while batches are active
        this.active = 0;
        this.failed = false;
    }

    beginBatch() {
        this.active++;
    }

    has(key) {
        return this.entries.has(key);
    }

    peek(key) {
        return this.entries.get(key)?.value;
    }

    /**
     * The cached value for key, or else the result of load(), which is cached. load() may
     * return undefined to report a failed lookup that should not be cached.
     */
    async get(key, load) {
        if (this.entries.has(key)) return this.entries.get(key).value;
        const value = await load();
        if (value === undefined) return null;
        this.set(key, value);
        return value;
    }

    /** Caches a value now, for objects this batch creates or changes itself. */
    set(key, value) {
        this.entries.set(key, { value, at: this.now() });
        if (this.active > 0) this.added.add(key);
    }

    /** Drops key at the end of the running batch, or now if none is running. */
    invalidate(key) {
        if (this.active > 0) this.changes.set(key, null);
        else this.entries.delete(key);
    }

    /** Replaces key's value at the end of the running batch, or now if none is running. */
    replaceLater(key, value) {
        if (this.active > 0) this.changes.set(key, { value });
        else this.entries.set(key, { value, at: this.now() });
    }

    /**
     * Ends a batch. When no batch is left running, applies the changes reported meanwhile and
     * expires old entries. If any of those batches failed, what they cached is dropped as well:
     * it may include objects created but never saved, which must not be reused.
     */
    endBatch({ failed = false } = {}) {
        if (failed) this.failed = true;
        this.active = Math.max(0, this.active - 1);
        if (this.active > 0) return;
        if (this.failed) {
            for (const key of this.added) this.entries.delete(key);
        }
        this.failed = false;
        for (const [key, change] of this.changes) {
            if (change == null) this.entries.delete(key);
            else this.entries.set(key, { value: change.value, at: this.now() });
        }
        this.changes.clear();
        this.added.clear();
        const now = this.now();
        for (const [key, entry] of this.entries) {
            const ttl = entry.value == null ? this.missTtlMs : this.ttlMs;
            if (now - entry.at > ttl) this.entries.delete(key);
        }
    }

    get size() {
        return this.entries.size;
    }
}

module.exports = { BatchCache };
