let lastCleanup = 0;
let subscription = global.events.database.connected.subscribe(async (connected) => {
    if (connected) {
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'EphemeralInit');
        const result = await httpPut({
            mappings: {
                enabled: false
            }
        }, elasticEndpoint + '/ephemeral', 'application/json', elasticHeaders());
        if (global.skyrepoDebug) {
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'SkyrepoPutInternalEphe', JSON.stringify(result));
        }

        // Throttled cleanup state: only purge expired entries at most once per interval.
        const cleanupIntervalMs = parseInt(process.env.EPHEMERAL_CLEANUP_INTERVAL) || 60000;

        // Fire-and-forget cleanup of expired ephemeral entries.
        // Compares the document version (which stores the expiry timestamp) against the current time.
        function cleanupExpired() {
            const now = Date.now();
            if (now - cleanupIntervalMs < lastCleanup) return;
            lastCleanup = now;
            httpPost({
                "query": {
                    "bool": {
                        "filter": {
                            "script": {
                                "script": {
                                    "source": "doc._version.value < params.param1",
                                    "lang": "painless",
                                    "params": {
                                        "param1": now
                                    }
                                }
                            }
                        }
                    }
                }
            }, elasticEndpoint + '/ephemeral/_delete_by_query', 'application/json', false, null, null, true, elasticHeaders())
                .then((result) => {
                    global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'EphemeralDeleteOld', JSON.stringify(result));
                })
                .catch((err) => {
                    global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.WARNING, 'EphemeralDeleteOldError', err.toString());
                });
        }

        // Ephemeral documents are dehydrated the same way permanent records are:
        // the object is serialized into a single 'data' string field rather than
        // being written out as a nested document. Cached profiles are deep
        // competency trees, so storing them raw lets Elasticsearch's dynamic
        // mapping create a field per property and quickly exhaust the index's
        // total-field limit. Dehydrating bounds every ephemeral document to a few
        // fields regardless of the index's mapping state.
        function dehydrate(obj, until) {
            return {
                data: JSON.stringify(obj),
                writeMs: new Date().getTime(),
                until: until,
            };
        }

        // A document that cannot be rehydrated — such as one written in the raw
        // form used before dehydration — is reported as a miss rather than an
        // error, so the caller simply recomputes. The data is ephemeral by
        // definition, so there is nothing to preserve.
        function rehydrate(source) {
            if (source == null) {
                return source;
            }
            try {
                return JSON.parse(source.data);
            } catch (e) {
                return null;
            }
        }

        // Deleting by part of an id. Up to Elasticsearch 9.4 a painless script
        // can read doc._id once util.js enables indices.id_field_data.enabled.
        // Elasticsearch 9.5 no longer allows fielddata on _id ("Fielddata
        // access on the _id field is disallowed"), and no query matches a
        // substring of _id, so there the ids are listed with a scroll and the
        // matching ones bulk-deleted. The version is read once from GET /;
        // if a script is refused anyway, the scroll path is used from then on.
        let idScripts = null; // true: doc._id usable in scripts; false: scroll instead
        const idScriptsUsable = async () => {
            if (idScripts != null) return idScripts;
            try {
                const state = await httpGet(elasticEndpoint + '/', true, elasticHeaders());
                const [major, minor] = String(state?.version?.number || '').split('.').map((n) => parseInt(n, 10));
                idScripts = Number.isFinite(major) && (major < 9 || (major === 9 && minor < 5));
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'EphemeralIdStrategy',
                    `Elasticsearch ${state?.version?.number}: ephemeral deletes by id ${idScripts ? 'script' : 'scroll and bulk delete'}.`);
            } catch (e) {
                idScripts = false;
            }
            return idScripts;
        };
        const idFielddataRefused = (result) => JSON.stringify(result || '').includes('id_field_data');
        const post = (body, url, contentType = 'application/json') => httpPost(body, url, contentType, false, null, null, true, elasticHeaders());

        async function deleteByIdScroll(partOfId) {
            let deleted = 0;
            let res = await post({ size: 1000, _source: false, query: { match_all: {} } }, elasticEndpoint + '/ephemeral/_search?scroll=1m');
            while (res?.hits?.hits?.length > 0) {
                const ids = res.hits.hits.map((h) => h._id).filter((id) => String(id).includes(partOfId));
                if (ids.length > 0) {
                    const bulk = ids.map((id) => JSON.stringify({ delete: { _index: 'ephemeral', _id: id } })).join('\n') + '\n';
                    await post(bulk, elasticEndpoint + '/_bulk', 'application/x-ndjson');
                    deleted += ids.length;
                }
                if (!res._scroll_id) break;
                res = await post({ scroll: '1m', scroll_id: res._scroll_id }, elasticEndpoint + '/_search/scroll');
            }
            return { deleted, method: 'scroll' };
        }

        // The expiry time is the document version, and is also kept in the document (see put).
        // cleanupExpired only runs once per interval, so reads also treat an expired document as missing.
        function unexpired(doc) {
            if (doc == null || doc._source == null) return null;
            const until = doc._source.until != null ? Number(doc._source.until) : doc._version;
            if (until != null && until < Date.now()) return null;
            return rehydrate(doc._source);
        }

        global.ephemeral = {
            get: async function (id) {
                cleanupExpired();
                return unexpired(await httpGet(elasticEndpoint + '/ephemeral/_doc/' + id, 'application/json', elasticHeaders()));
            },
            gets: async function (ids) {
                cleanupExpired();
                if (global.skyrepoDebug) {
                    global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'EphemeralGets', 'Fetching from ephemeral : ' + ids.length);
                }

                const mget = {};
                const docs = [];
                (mget)['docs'] = docs;

                docs.push(...ids.map(id => ({ _index: 'ephemeral', _id: id })));
                
                let response = await httpPost(mget, elasticEndpoint + '/_mget', 'application/json', false, null, null, true, elasticHeaders());
                response = response?.docs?.map(unexpired);
                return response || [];
            },
            // until is the expiry time in milliseconds and becomes the document's external version.
            put: async function (id, obj, until) {
                until = Number(until);
                if (!Number.isSafeInteger(until) || until <= 0) {
                    throw new Error('Ephemeral expiry must be a time in milliseconds, got ' + JSON.stringify(arguments[2]));
                }
                const url = elasticEndpoint + '/ephemeral/_doc/' + id;
                let result = await httpPut(dehydrate(obj, until), url + '?version=' + until + '&version_type=external', 'application/json', elasticHeaders());
                // The stored version is at or above this expiry: the entry was cached with a longer lifetime,
                // or its version was corrupted (a string expiry once concatenated digits into a version
                // decades ahead), which would otherwise block every later write. The entry is only a cache,
                // so overwrite it; the expiry kept in the document then governs reads. (Deleting first does
                // not help: Elasticsearch remembers a deleted document's version for index.gc_deletes.)
                if (result?.error?.type == 'version_conflict_engine_exception') {
                    result = await httpPut(dehydrate(obj, until), url, 'application/json', elasticHeaders());
                }
                return result;
            },
            delete: async function (id) {
                return await httpDelete(elasticEndpoint + '/ephemeral/_doc/' + id, elasticHeaders());
            },
            deleteWith: async function (partOfId) {
                if (!(await idScriptsUsable())) {
                    const result = await deleteByIdScroll(partOfId);
                    global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'EphemeralDeleteOld', JSON.stringify(result));
                    return;
                }
                let result = await httpPost({
                    "query": {
                        "bool": {
                            "filter": {
                                "script": {
                                    "script": {
                                        "source": "doc._id.value.contains(params.param1)",
                                        "lang": "painless",
                                        "params": {
                                            "param1": partOfId
                                        }
                                    }
                                }
                            }
                        }
                    }
                }, elasticEndpoint + '/ephemeral/_delete_by_query', 'application/json', false, null, null, true, elasticHeaders());
                if (idFielddataRefused(result)) {
                    idScripts = false;
                    result = await deleteByIdScroll(partOfId);
                }
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'EphemeralDeleteOld', JSON.stringify(result));
            }
        }

        global.ephemeral.put('test', { test: 'test' }, new Date().getTime() + 10000);

        subscription.unsubscribe();
    }
});
