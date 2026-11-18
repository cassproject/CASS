/* -
 * --BEGIN_LICENSE--
 * Competency and Skills System
 * -----
 * Copyright (C) 2015 - 2026 Eduworks Corporation and other contributing parties.
 * -----
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * --END_LICENSE--
 */

// Helpers shared by the skyRepo modules: how to address Elasticsearch across its versions, and the
// small steps that single and bulk operations have in common.

/**
 *  Indexed fields of the permanent index. Everything else in the document
 *  (notably the serialized object in 'data') is stored in _source but left
 *  unmapped by 'dynamic: false'. Shared with the migration in ../util.js
 *  (through global.PERMANENT_PROPERTIES, set in put.js) so the two cannot
 *  drift apart.
 */
const PERMANENT_PROPERTIES = {
    baseId: { type: 'keyword' },
};

/**
 *  Versions above this are timestamps in milliseconds (this one is 28 March 2025); versions below it
 *  are counters. When a write conflicts with a stored version that is a later timestamp, the write
 *  is stale and is dropped. When the stored version is a counter, the write is retried at the next
 *  version instead.
 */
const TIMESTAMP_VERSION_FLOOR = 1743202754349;

/**
 *  What the search engine is, from what it reports about itself: OpenSearch says so in
 *  version.distribution, and numbers its versions on its own (1.x was forked from Elasticsearch 7.10).
 *  @return {{openSearch: boolean, major: number}} major is NaN when the version cannot be read
 */
const engine = function () {
    const version = global.elasticSearchInfo?.version;
    return {
        openSearch: version?.distribution == 'opensearch',
        major: Number.parseInt(version?.number),
    };
};

/**
 *  Elasticsearch 7 and later, and every OpenSearch, address a document as /{index}/_doc/{id}.
 *  Elasticsearch before 7 addresses it as /{index}/{type}/{id}. A version that cannot be read is
 *  taken to be a current one.
 *  @return {boolean}
 */
const usesDocEndpoint = function () {
    const { openSearch, major } = engine();
    return openSearch || !(major < 7);
};

/**
 *  Elasticsearch 8 and later, and OpenSearch 2 and later, reject a document type in _bulk and _mget
 *  requests. Elasticsearch 7 and OpenSearch 1 accept '_doc', and Elasticsearch before 7 needs the type.
 *  @return {boolean}
 */
const rejectsDocType = function () {
    const { openSearch, major } = engine();
    return !(major < (openSearch ? 2 : 8));
};

/**
 *  In a list of indices, Elasticsearch 9 and later read '-name' as "but not name" wherever it is.
 *  Elasticsearch before 9, and OpenSearch, only read it so after an expression with a wildcard, and
 *  otherwise look for an index called '-name' and fail the request. A version that cannot be read
 *  is taken to need the wildcard, which is harmless where it is not needed.
 *  @return {boolean}
 */
const exclusionNeedsWildcardFirst = function () {
    const { openSearch, major } = engine();
    return openSearch || !(major >= 9);
};

/**
 *  URL of one document.
 *  @param {string} index
 *  @param {string} legacyType document type, used only before Elasticsearch 7
 *  @param {string} id
 *  @param {string} [suffix] appended as it is, after the encoded id
 *  @return {string}
 */
const docUrl = function (index, legacyType, id, suffix = '') {
    return elasticEndpoint + '/' + index + '/' + (usesDocEndpoint() ? '_doc' : legacyType) + '/' + encodeURIComponent(id) + suffix;
};

/**
 *  Query string of a write: the refresh policy of the request (refresh=true unless the request set
 *  another), and the external version when there is one.
 *  @param {object} self the endpoint's `this`
 *  @param {number} [version]
 *  @return {string}
 */
const writeQuery = function (self, version) {
    const refresh = self.ctx.get('refresh');
    const refreshPart = 'refresh=' + (refresh == null ? 'true' : refresh);
    if (version == null) {
        return '?' + refreshPart;
    }
    return '?version=' + version + '&version_type=external&' + refreshPart;
};

/**
 *  The action line of a _bulk index request, with an external version.
 *  @param {string} index
 *  @param {string} id
 *  @param {string} docType document type, as getTypeForObject gives it
 *  @param {number} version
 *  @return {object}
 */
const bulkIndexAction = function (index, id, docType, version) {
    const action = { '_index': index, '_id': id, '_type': docType, 'version': version, 'version_type': 'external' };
    if (rejectsDocType()) {
        delete action['_type'];
    }
    return { 'index': action };
};

/**
 *  One entry of an _mget request.
 *  @param {string} index
 *  @param {string} id
 *  @return {object}
 */
const mgetDoc = function (index, id) {
    const doc = { '_index': index, '_id': id };
    if (!rejectsDocType()) {
        doc['_type'] = usesDocEndpoint() ? '_doc' : index;
    }
    return doc;
};

/**
 *  The hits of a search response, or null when there is no response or nothing was found.
 *  @param {object} response
 *  @return {Array|null}
 */
const searchHits = function (response) {
    const hits = response?.hits?.hits;
    return hits == null || hits.length == 0 ? null : hits;
};

/**
 *  Writes a debug log entry when skyrepoDebug is on. The message is only built then.
 *  @param {string} tag
 *  @param {function} message returns the message
 */
const debugLog = function (tag, message) {
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, tag, message());
    }
};

let permanentCreated = false;
/**
 *  Creates the permanent index with its mapping, once per process. When the index already exists
 *  Elasticsearch refuses, which is fine.
 *  @param {string} tag debug log tag
 */
const ensurePermanentIndex = async function (tag) {
    if (permanentCreated) {
        return;
    }
    let mappings;
    if (usesDocEndpoint()) {
        // 'dynamic: false' rather than 'enabled: false': both keep the
        // document body out of the mappings (so version history cannot
        // exhaust the index field limit), but 'dynamic' still allows the
        // explicitly declared fields to be indexed. baseId has to be
        // searchable because history looks records up by it — an
        // 'enabled: false' index indexes nothing at all, which previously
        // forced history to script over the _id metadata field instead.
        mappings = { dynamic: false, properties: PERMANENT_PROPERTIES };
    } else {
        mappings = { permanent: { enabled: false } };
    }
    const result = await httpPut({ mappings: mappings }, elasticEndpoint + '/permanent', 'application/json', elasticHeaders());
    debugLog(tag, () => JSON.stringify(result));
    permanentCreated = true;
};

/**
 *  The ids an object is stored under besides the one in the request: its GUID, and the MD5 of its
 *  unversioned URL (which is how an object registered under another server's URL is addressed).
 *  @param {EcRemoteLinkedData} rld
 *  @return {string[]}
 */
const objectIds = function (rld) {
    const ids = [];
    if (rld.id != null && rld.getGuid() != null) {
        ids.push(rld.getGuid());
    }
    if (rld.id != null && rld.shortId() != null) {
        ids.push(EcCrypto.md5(rld.shortId()));
    }
    return ids;
};

/**
 *  @param {string[]} ids
 *  @return {string[]} the ids without repeats, in their original order
 */
const unique = function (ids) {
    return [...new Set(ids)];
};

/**
 *  Puts the owner and reader keys of an object about to be indexed into the one PEM form searches
 *  use, so that a search by key finds the object however the key was written.
 *  @param {object} o
 */
const normalizeKeys = function (o) {
    for (const field of ['owner', 'reader']) {
        const keys = o[field];
        if (keys != null && EcArray.isArray(keys)) {
            for (let i = 0; i < keys.length; i++) {
                if (keys[i].includes('\n')) {
                    keys[i] = EcPk.fromPem(keys[i]).toPem();
                }
            }
        }
    }
};

/**
 *  Records the version on an object about to be indexed. Without a usable version, it is now.
 *  @param {object} o
 *  @param {*} version
 */
const stampVersion = function (o, version) {
    const parsed = Number.parseInt(version);
    o['@version'] = Number.isNaN(parsed) ? Date.now() : parsed;
};

/**
 *  Removes what must not be searchable from an object about to be indexed, at every depth:
 *  signatures, and the payload and secrets of encrypted values.
 *  @param {*} o
 */
const removeNonIndexables = function (o) {
    if (o != null && EcObject.isObject(o)) {
        for (const key of EcObject.keys(o)) {
            removeNonIndexables(o[key]);
        }
        if (o.type == 'EncryptedValue' || o['@type'] == 'EncryptedValue') {
            delete o['payload'];
            delete o['secret'];
        }
        delete o['signature'];
        delete o['@signature'];
    } else if (o != null && EcArray.isArray(o)) {
        for (const item of o) {
            removeNonIndexables(item);
        }
    }
};

/**
 *  When a saved object is a rekey request, adds it to the forwarding table if it verifies.
 *  @param {object} o
 */
const noteRekeyRequest = function (o) {
    const rld = new EcRemoteLinkedData(null, null);
    rld.copyFrom(o);
    if (rld.isAny(new EcRekeyRequest().getTypes())) {
        const request = new EcRekeyRequest();
        request.copyFrom(o);
        if (request.verify()) {
            request.addRekeyRequestToForwardingTable();
        }
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.INFO, 'SkyrepoPutInternal', EcObject.keys(EcRemoteLinkedData.forwardingTable).length + ' records now in forwarding table.');
    }
};

/**
 *  Publishes data on the named data events, along with the keys of whoever is signed in.
 *  @param {object} self the endpoint's `this`
 *  @param {string[]} names events under global.events.data
 *  @param {*} data
 */
const publish = function (self, names, data) {
    const keys = self.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem());
    for (const name of names) {
        global.events.data[name].next(data, keys);
    }
};

module.exports = {
    PERMANENT_PROPERTIES,
    TIMESTAMP_VERSION_FLOOR,
    usesDocEndpoint,
    rejectsDocType,
    exclusionNeedsWildcardFirst,
    docUrl,
    writeQuery,
    bulkIndexAction,
    mgetDoc,
    searchHits,
    debugLog,
    ensurePermanentIndex,
    objectIds,
    unique,
    normalizeKeys,
    stampVersion,
    removeNonIndexables,
    noteRekeyRequest,
    publish,
};
