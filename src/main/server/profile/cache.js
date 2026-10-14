/**
 * Caching and request coordination for /api/profile/latest.
 *
 * Kept free of server globals (the store, clock and sleep are injected) so the
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

class ProfileCache {
    /**
     * @param {object} options
     * @param {{get: Function, put: Function, deleteWith: Function}} options.store Ephemeral store; put(id, obj, until).
     * @param {Function} [options.now] Clock in milliseconds.
     * @param {Function} [options.sleep] Resolves after the given milliseconds.
     * @param {number} [options.waitMs] How long to wait on another request computing the same profile before computing anyway.
     * @param {number} [options.pollMs] How often to check whether that request has finished.
     * @param {number} [options.settleMs] Results from computations started this soon after an invalidation are not cached,
     *     because the write that caused the invalidation may not be searchable yet.
     * @param {Function} [options.log] Receives (message, detail) for cache events.
     */
    constructor({ store, now = Date.now, sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)), waitMs = 60000, pollMs = 100, settleMs = 2000, log = () => { } }) {
        this.store = store;
        this.now = now;
        this.sleep = sleep;
        this.waitMs = waitMs;
        this.pollMs = pollMs;
        this.settleMs = settleMs;
        this.log = log;
        this.inProgress = {};
        this.invalidatedAt = {};
    }

    /** Drops every cached profile about the subject with this key fingerprint. */
    async invalidate(fingerprint) {
        this.invalidatedAt[fingerprint] = this.now();
        return await this.store.deleteWith('|' + fingerprint + '|');
    }

    /**
     * Returns { profile, fromCache }, computing the profile with compute() when it is not usable from the cache.
     *
     * @param {object} request
     * @param {string} request.cacheKey
     * @param {string} request.fingerprint Fingerprint of the profile's subject.
     * @param {boolean} [request.flush] Ignore and replace any cached or in-progress profile.
     * @param {boolean} [request.readCache] Answer from the cache when possible.
     * @param {boolean} [request.waitForOthers] Wait for a request already computing this profile instead of duplicating it.
     * @param {number} request.ttl Milliseconds to cache the result.
     * @param {Function} compute Resolves to the profile; a profile with an error property is returned but not cached.
     */
    async get({ cacheKey, fingerprint, flush, readCache, waitForOthers, ttl }, compute) {
        if (flush) {
            delete this.inProgress[cacheKey];
        } else if (waitForOthers) {
            while (this.inProgress[cacheKey] != null && this.now() - this.inProgress[cacheKey] < this.waitMs) {
                this.log('Blocked - Profile computing elsewhere');
                await this.sleep(this.pollMs);
            }
        }

        if (!flush && readCache) {
            const cached = await this.store.get(cacheKey);
            if (cached != null) {
                return { profile: cached, fromCache: true };
            }
        }

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
                        await this.store.put(cacheKey, profile, this.now() + ttl);
                    } catch (ex) {
                        this.log('Could not cache profile', ex);
                    }
                }
            }
            return { profile, fromCache: false };
        } finally {
            // Clear the marker however compute() ended, unless a newer request has replaced it.
            if (this.inProgress[cacheKey] === started) {
                delete this.inProgress[cacheKey];
            }
        }
    }
}

module.exports = { ProfileCache, profileTtl, profileWorkers, workerMaxMemory, DAY_MS };
