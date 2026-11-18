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
const { skyrepoGetPermanent } = require('./get');
const { skyrepoDeleteInternalIndex } = require('./delete');
const { allIndices } = require('./searchUtil');
const {
    PERMANENT_PROPERTIES, TIMESTAMP_VERSION_FLOOR, docUrl, writeQuery, searchHits, debugLog, ensurePermanentIndex,
    objectIds, unique, normalizeKeys, stampVersion, removeNonIndexables, noteRekeyRequest, publish,
} = require('./common');

// Read by the permanent index migration in ../util.js.
global.PERMANENT_PROPERTIES = PERMANENT_PROPERTIES;

const putUrl = function (o, id, version, type) {
    const typeFromObj = inferTypeFromObj(o, type);
    const url = docUrl(typeFromObj.toLowerCase(), typeFromObj, id, writeQuery(this, version));
    debugLog('SkyrepoPutUrl', () => 'Put:' + url);
    return url;
};

// `<id>.<version>` in permanent: one version of the object.
const putPermanentUrl = function (o, id, version, type) {
    const url = docUrl('permanent', 'permanent', id, '.' + (version == null ? '' : version) + writeQuery(this, version));
    debugLog('SkyrepoPutPermanentUrl', () => 'PutPermanent:' + url);
    return url;
};

// `<id>.` in permanent: the latest version of the object.
const putPermanentBaseUrl = function (o, id, version, type) {
    const url = docUrl('permanent', 'permanent', id, '.' + writeQuery(this, version));
    debugLog('SkyrepoPutPermanentBaseUrl', () => 'PutPermanentBase:' + url);
    return url;
};

const skyrepoPutInternalIndex = async function (o, id, version, type) {
    const url = putUrl.call(this, o, id, version, type);
    o = flattenLangstrings(o);
    removeNonIndexables(o);
    normalizeKeys(o);
    stampVersion(o, version);
    debugLog('DbPutInternalIndex', () => JSON.stringify(o));
    return await httpPost(o, url, 'application/json', false, null, null, true, elasticHeaders());
};

const skyrepoPutInternalPermanent = async function (o, id, version, type) {
    await ensurePermanentIndex('DbPutInternalPerm');
    const data = {
        data: JSON.stringify(o),
        writeMs: Date.now(),
        // Indexed so version history can be retrieved with a term query. The
        // document _id is `<baseId>.<version>`; storing the base separately avoids
        // querying the _id metadata field, which requires fielddata that
        // Elasticsearch no longer permits.
        baseId: id,
    };
    let results = await httpPost(data, putPermanentBaseUrl.call(this, o, id, version, type), 'application/json', false, null, null, true, elasticHeaders());
    if (results === 409) {
        return JSON.stringify(results);
    }
    if (version != null) {
        results = await httpPost(data, putPermanentUrl.call(this, o, id, version, type), 'application/json', false, null, null, true, elasticHeaders());
    }
    debugLog('DbPutInternalPerm', () => JSON.stringify(results));
    return JSON.stringify(results);
};

// The search index entries of an object, wherever they are: under its URL, or the MD5 of it.
const skyrepoGetIndexRecords = async function (id) {
    const hashId = EcCrypto.md5(id);
    const microSearchUrl = elasticEndpoint + '/' + allIndices() + '/_search?version&q=@id:"' + id + '" OR @id:"' + hashId + '"';
    const microSearch = await httpGet(microSearchUrl, true, elasticHeaders());
    debugLog('SkyrepGetIndexRecords', () => microSearchUrl);
    return searchHits(microSearch);
};

const skyrepoPutInternal = global.skyrepoPutInternal = async function (o, id, version, type) {
    // Securing Proxy: Sign data that is to be saved.
    const erld = new EcRemoteLinkedData(null, null);
    erld.copyFrom(o);
    if (this.ctx?.req?.eim != null) {
        try {
            await this.ctx.req.eim.sign(erld);
            o = JSON.parse(erld.toJson());
        } catch (msg) {
            global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.ERROR, 'DbPutInternalError', msg);
        }
    }
    const oldPermanent = await skyrepoGetPermanent(id, version, type);
    if (Number.isNaN(Number(version))) {
        version = null;
    }
    let chosenVersion = version;
    // If we are doing a manual put with a CASS_LOOPBACK that has an associated CASS_LOOPBACK_PROXY from localhost,
    // we have to pull the version from the object not the url (because it wasn't sent with the url because it's using the md5)
    if (chosenVersion == null && erld.id && (erld.id.startsWith(repo.selectedServer) || erld.id.startsWith(repo.selectedServerProxy))) {
        chosenVersion = erld.getTimestamp();
    }
    if (chosenVersion == null) {
        if (oldPermanent?.['_version'] != null && !Number.isNaN(Number(oldPermanent['_version']))) {
            chosenVersion = oldPermanent['_version'] + 1;
        } else {
            chosenVersion = 1;
        }
    }
    const obj = await skyrepoPutInternalIndex.call(this, o, id, chosenVersion, type);
    // Remove the entries the object had under another id or in another index (its type changed).
    if (erld.id != null) {
        const oldIndexRecords = await skyrepoGetIndexRecords(erld.shortId());
        for (const oldIndexRecord of oldIndexRecords || []) {
            if (oldIndexRecord._id != obj._id || oldIndexRecord._index != obj._index) {
                await skyrepoDeleteInternalIndex.call(this, oldIndexRecord._id, null, oldIndexRecord._index);
            }
        }
    }
    debugLog('PutInternal', () => JSON.stringify(obj));
    for (const permId of unique([id, ...objectIds(erld)])) {
        const status = await skyrepoPutInternalPermanent.call(this, o, permId, chosenVersion, type);
        if (status === '409') {
            global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.WARNING, 'PutInternal', '409, version is: ' + chosenVersion);
            const current = await skyrepoGetPermanent.call(this, permId, null, type);
            if (current && current._version > chosenVersion && current._version > TIMESTAMP_VERSION_FLOOR) {
                global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.WARNING, 'PutInternal', 'Dumping, was at ' + chosenVersion);
                break;
            } else if (current && current._version > chosenVersion) {
                chosenVersion = current._version;
                global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.WARNING, 'PutInternal', 'Updated to ' + chosenVersion);
            }
            // Used to replay replication / database log files without "just jamming the data in"
            if (process.env.ALLOW_SANCTIONED_REPLAY != 'true' || Number(this.ctx.sanctionedReplay) !== 1) {
                await skyrepoPutInternal.call(this, o, id, chosenVersion + 1, type);
            }
            break;
        }
    }
    noteRekeyRequest(o);
};

const skyrepoPut = async function (parseParams) {
    if (parseParams == null && this.params.id != null && this.params.id != '') {
        parseParams = {
            id: this.params.id,
            type: this.params.type,
            version: this.params.version,
            obj: this.params.obj,
        };
    }
    debugLog('SkyrepPut', () => 'put pp:' + JSON.stringify(parseParams));
    debugLog('SkyrepPut', () => 'put obj:' + JSON.stringify(this.params.obj));
    if (parseParams == null && EcObject.isObject(this.params.obj)) {
        parseParams = this.params.obj;
    }
    let obj = parseParams['obj'];
    if (!EcObject.isObject(obj)) {
        obj = JSON.parse(obj);
    }
    return await skyrepoPutParsed.call(this, obj, parseParams['id'], parseParams['version'], parseParams['type']);
};

const skyrepoPutParsed = async function (o, id, version, type) {
    if (o == null) {
        return;
    }

    // Validate required JSON-LD fields
    if (!o['@id']) {
        error('Object must have an @id.', 400);
    }
    if (!o['@type']) {
        error('Object must have an @type.', 400);
    }
    if (!o['@context']) {
        error('Object must have an @context.', 400);
    }

    await validateSignatures.call(this, id, version, type, 'Only an owner of an object may change it.');
    await skyrepoPutInternal.call(this, o, id, version, type);
    publish(this, ['write', 'any'], [o]);
};

module.exports = {
    putUrl,
    putPermanentUrl,
    putPermanentBaseUrl,
    skyrepoPutInternalIndex,
    skyrepoPutInternalPermanent,
    skyrepoPutInternal,
    skyrepoPut,
    skyrepoPutParsed,
};