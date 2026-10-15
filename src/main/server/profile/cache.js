/**
 * Caching and request coordination for /api/profile/latest.
 *
 * Kept free of server globals (the store, clock and timers are injected) so the
 * behaviour can be unit-tested with an in-memory store.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

// Environment variables are strings; anything that is not a positive integer falls back to the default.
const positiveInt = (value, fallback) => {
    const n = parseInt(value);
    return Number.isFinite(n) && n >= 1 ? n : fallback;
};

/** Milliseconds a computed profile stays cached (PROFILE_TTL, default 24 hours). */
const profileTtl = (env = process.env) => positiveInt(env.PROFILE_TTL, DAY_MS);

/** Number of profile worker threads (PROFILE_WORKERS, default 1). */
const profileWorkers = (env = process.env) => positiveInt(env.PROFILE_WORKERS, 1);

/** Per-worker heap limit in MB (WORKER_MAX_MEMORY, default 1024). */
const workerMaxMemory = (env = process.env) => positiveInt(env.WORKER_MAX_MEMORY, 1024);

/**
 * A cached profile older than its ttl is still served (while it is recomputed in the
 * background) until it is this many ttls old.
 */
const STALE_LIMIT = 2;

class ProfileCache {
    /**
     * @param {object} options
     * @param {{get: Function, put: Function, deleteWith: Function}} options.store Ephemeral store; put(id, obj, until);
     *     deleteWith(parts) deletes every entry whose id contains any of the parts.
     * @param {Function} [options.now] Clock in milliseconds.
     * @param {Function} [options.sleep] Resolves after the given milliseconds; used while waiting on another request.
     * @param {Function} [options.wait] Resolves after the given milliseconds; used to collect invalidations.
     * @param {number} [options.waitMs] How long to wait on another request computing the same profile before computing anyway.
     * @param {number} [options.pollMs] How often to check whether that request has finished.
     * @param {number} [options.settleMs] Results from computations started this soon after an invalidation are not cached,
     *     because the write that caused the invalidation may not be searchable yet.
     * @param {number} [options.coalesceMs] Invalidations arriving within this window are deleted in one request.
     * @param {number} [options.retainMs] How long an invalidation is remembered (it must outlast any computation).
     * @param {Function} [options.log] Receives (message, detail) for cache events.
     */
    constructor({
        store,
        now = Date.now,
        sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
        wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
        waitMs = 60000,
        pollMs = 100,
        settleMs = 2000,
        coalesceMs = 1000,
        retainMs = 10 * 60 * 1000,
        log = () => { },
    }) {
        this.store = store;
        this.now = now;
        this.sleep = sleep;
        this.wait = wait;
        this.waitMs = waitMs;
        this.pollMs = pollMs;
        this.settleMs = settleMs;
        this.coalesceMs = coalesceMs;
        this.retainMs = retainMs;
        this.log = log;
        this.inProgress = {};
        this.invalidatedAt = {};
        this.pendingInvalidations = new Set();
        this.flushing = null;
    }

    /**
     * Drops every cached profile about the subject with this key fingerprint. Invalidations
     * within coalesceMs of each other are deleted together; the returned promise settles
     * when this one has been.
     */
    invalidate(fingerprint) {
        this.invalidatedAt[fingerprint] = this.now();
        this.pendingInvalidations.add('|' + fingerprint + '|');
        if (this.flushing == null) {
            this.flushing = this.wait(this.coalesceMs).then(() => this.flushInvalidations());
        }
        return this.flushing;
    }

    async flushInvalidations() {
        const parts = [...this.pendingInvalidations];
        this.pendingInvalidations.clear();
        this.flushing = null; // Invalidations from here on start the next group.
        const forgetBefore = this.now() - this.retainMs;
        for (const [fingerprint, at] of Object.entries(this.invalidatedAt)) {
            if (at < forgetBefore) delete this.invalidatedAt[fingerprint];
        }
        if (parts.length > 0) await this.store.deleteWith(parts);
    }

    /**
     * Returns { profile, fromCache, stale }, computing the profile with compute() when it is not usable from the cache.
     *
     * A cached profile past its ttl is returned at once (stale: true) and recomputed in the
     * background. One invalidated by new evidence is not used: the request waits for a fresh one.
     *
     * @param {object} request
     * @param {string} request.cacheKey
     * @param {string} request.fingerprint Fingerprint of the profile's subject.
     * @param {boolean} [request.flush] Ignore and replace any cached or in-progress profile.
     * @param {boolean} [request.readCache] Answer from the cache when possible.
     * @param {boolean} [request.waitForOthers] Wait for a request already computing this profile instead of duplicating it.
     * @param {number} request.ttl Milliseconds a cached profile is fresh.
     * @param {Function} compute Resolves to the profile; a profile with an error property is returned but not cached.
     */
    async get(request, compute) {
        const { cacheKey, flush, readCache, waitForOthers } = request;
        if (flush) {
            delete this.inProgress[cacheKey];
        } else if (readCache) {
            const hit = await this.readCached(request, compute);
            if (hit != null) return hit;
        }

        if (!flush && waitForOthers && this.inProgress[cacheKey] != null) {
            while (this.inProgress[cacheKey] != null && this.now() - this.inProgress[cacheKey] < this.waitMs) {
                this.log('Blocked - Profile computing elsewhere');
                await this.sleep(this.pollMs);
            }
            if (readCache) {
                const hit = await this.readCached(request, compute);
                if (hit != null) return hit;
            }
        }

        return { profile: await this.computeAndStore(request, compute), fromCache: false, stale: false };
    }

    async readCached(request, compute) {
        const { cacheKey, fingerprint } = request;
        const entry = unwrap(await this.store.get(cacheKey));
        if (entry == null) return null;
        const invalidated = this.invalidatedAt[fingerprint];
        if (invalidated != null && entry.cachedAt != null && entry.cachedAt <= invalidated) {
            return null; // Computed before the latest evidence; its deletion may not have landed yet.
        }
        if (entry.freshUntil == null || this.now() <= entry.freshUntil) {
            return { profile: entry.profile, fromCache: true, stale: false };
        }
        if (this.inProgress[cacheKey] == null) {
            this.log('Serving stale profile while recomputing', cacheKey);
            this.computeAndStore(request, compute).catch((ex) => this.log('Background recompute failed', ex));
        }
        return { profile: entry.profile, fromCache: true, stale: true };
    }

    async computeAndStore({ cacheKey, fingerprint, ttl }, compute) {
        const started = this.now();
        this.inProgress[cacheKey] = started;
        try {
            const profile = await compute();
            if (profile != null && profile.error == null) {
                const invalidated = this.invalidatedAt[fingerprint];
                if (invalidated != null && invalidated >= started - this.settleMs) {
                    this.log('Not caching - evidence changed while computing', fingerprint);
                } else {
                    try {
                        const cachedAt = this.now();
                        await this.store.put(cacheKey, { profile, cachedAt: started, freshUntil: cachedAt + ttl }, cachedAt + STALE_LIMIT * ttl);
                    } catch (ex) {
                        this.log('Could not cache profile', ex);
                    }
                }
            }
            return profile;
        } finally {
            // Clear the marker however compute() ended, unless a newer request has replaced it.
            if (this.inProgress[cacheKey] === started) {
                delete this.inProgress[cacheKey];
            }
        }
    }
}

/**
 * Cache entries are { profile, cachedAt, freshUntil }. Entries written by CaSS 1.7.11 are the
 * bare profile; they are used as fresh until the store expires them.
 */
const unwrap = (entry) => {
    if (entry == null) return null;
    if (entry.profile != null && entry.cachedAt != null) return entry;
    return { profile: entry, cachedAt: null, freshUntil: null };
};

module.exports = { ProfileCache, profileTtl, profileWorkers, workerMaxMemory, DAY_MS, STALE_LIMIT };
