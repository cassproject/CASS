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
const { skyrepoManyGetIndexInternal, skyrepoManyGetPermanent } = require('./multiget');
const { searchUrl, searchObj } = require('./searchUtil');
const {
    TIMESTAMP_VERSION_FLOOR, bulkIndexAction, debugLog, ensurePermanentIndex, objectIds,
    normalizeKeys, stampVersion, noteRekeyRequest, publish,
} = require('./common');

// The bulk functions work on a map of entries by id: { id, object, version, type }, to which they
// add permanentIds (every id the object is stored under) and index (its search index). Entries that
// cannot be saved are removed from the map, and their ids are returned as the keys of `failed`.

const bulk = async function (body) {
    return await httpPost(body, elasticEndpoint + '/_bulk', 'application/x-ndjson', false, null, null, true, elasticHeaders());
};

const failAll = function (map) {
    const failed = {};
    for (const x of Object.values(map)) {
        failed[x.id] = true;
    }
    return failed;
};

// Returns a function giving the entry a _bulk response item belongs to: the first one still in the
// map that is stored under the item's id. Built once per response, so that a response with many
// failed items does not scan the whole map for each of them.
const entryFinder = function (map) {
    const byPermanentId = new Map();
    for (const x of Object.values(map)) {
        for (const id of x.permanentIds) {
            if (!byPermanentId.has(id)) {
                byPermanentId.set(id, []);
            }
            byPermanentId.get(id).push(x);
        }
    }
    return (item) => byPermanentId.get(item.index['_id'].split('.')[0])?.find((x) => map[x.id] === x);
};

let skyrepoPutInternalPermanentBulk = global.skyrepoPutInternalPermanentBulk = async function (map) {
    const failed = {};

    let body = '';
    for (const x of Object.values(map)) {
        const docType = getTypeForObject(x.object, x.type);
        const writeMs = Date.now();
        for (const id of x.permanentIds) {
            const source = JSON.stringify({ data: JSON.stringify(x.object), writeMs: writeMs, baseId: id });
            // This version, and the latest version.
            for (const suffix of [x.version || '', '']) {
                body += `${JSON.stringify(bulkIndexAction('permanent', id + '.' + suffix, docType, x.version))}\n`;
                body += `${source}\n`;
            }
        }
    }
    const response = await bulk(body);
    if (!response) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.ERROR, 'DbPutPermBulk', 'No response');
        return failAll(map);
    }

    if (response.errors) {
        let retries = {};
        const entryFor = entryFinder(map);

        for (let item of response.items) {
            if (item.index.status === 409) {
                const found = entryFor(item);
                if (found) {
                    retries[found.id] = found;
                }
            } else if (item.index.error) {
                global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.ERROR, 'PutPermBulk', item);
                const found = entryFor(item);
                if (found) {
                    failed[found.id] = true;
                    delete map[found.id];
                }
            }
        }

        if (Object.values(retries).length > 0) {
            global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.WARNING, 'DbPutInternal', '409, version is: [' + Object.values(retries).map((x) => x.version).toString() + ']');
            const current = await skyrepoManyGetPermanent.call(this, Object.values(retries));
            for (let currentDoc of current.docs) {
                const id = currentDoc['_id'].split('.')[0];
                const found = retries[id];
                if (currentDoc['_version'] >= found.version && currentDoc['_version'] > TIMESTAMP_VERSION_FLOOR) {
                    delete retries[id];
                    global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.WARNING, 'SkyrepoPutInternal', 'Dumping, was at: [' + found.version + ']');
                } else if (currentDoc['_version'] >= found.version) {
                    found.version = currentDoc['_version'] + 1;
                }
            }
            global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.WARNING, 'DbPutInternal', 'Updated to: [' + Object.values(retries).map((x) => x.version).toString() + ']');

            // Used to replay replication / database log files without "just jamming the data in"
            if (Object.values(retries).length > 0 && (process.env.ALLOW_SANCTIONED_REPLAY != 'true' || Number(this.ctx.sanctionedReplay) !== 1)) {
                const newFailed = await skyrepoPutInternalBulk.call(this, retries);
                for (let key of Object.keys(newFailed)) {
                    failed[key] = true;
                    delete map[key];
                }
            }
        }
    }

    return failed;
};

let skyrepoPutInternalBulk = global.skyrepoPutInternalBulk = async function (map) {
    const failed = {};
    Object.assign(failed, await skyrepoPutInternalIndexBulk.call(this, map));
    if (Object.values(map).length > 0) {
        Object.assign(failed, await skyrepoPutInternalPermanentBulk.call(this, map));
    }

    return failed;
};

// The search index entries of the objects with these URLs, wherever they are: under the URL, or the MD5 of it.
let skyrepoManyGetIndexRecords = async function (ary) {
    //TODO: Merge with multiget.skyrepoManyGetIndexSearch
    if (ary.length === 0) {
        return [];
    }
    const query = [...ary, ...ary.map((x) => EcCrypto.md5(x))].map((id) => '@id:"' + id + '"').join(' OR ');

    const searchParameters = await searchObj.call(this, query, null, 10000);
    debugLog('SkyrepSearch', () => JSON.stringify(searchParameters));
    const microSearch = await httpPost(searchParameters, searchUrl(), 'application/json', false, null, null, true, elasticHeaders());
    debugLog('SkyrepManyGetIndexRecords', () => query);
    return microSearch?.hits?.hits || [];
};

// Signs each object when the caller is signed in through SSO, and lists the ids it is stored under.
const signAndIdentify = async function (map) {
    for (const x of Object.values(map)) {
        const erld = new EcRemoteLinkedData(null, null);
        erld.copyFrom(x.object);
        if (this.ctx?.req?.eim != null) {
            try {
                await this.ctx.req.eim.sign(erld);
                x.object = JSON.parse(erld.toJson());
            } catch (msg) {
                global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.ERROR, 'DbPutInternalError', msg);
            }
        }
        x.permanentIds = [x.id];
        for (const id of objectIds(erld)) {
            EcArray.setAdd(x.permanentIds, id);
        }
    }
};

// Gives each entry without a version the one after what is stored, or 1.
const chooseVersions = async function (map) {
    const permIndexes = await skyrepoManyGetIndexInternal.call(this, 'permanent', Object.values(map));
    if (permIndexes) {
        for (const doc of permIndexes.docs) {
            const entry = map[doc['_id'].split('.')[0]];
            if (entry.version == null) {
                entry.version = doc?.['_version'] != null && !Number.isNaN(Number(doc['_version'])) ? doc['_version'] + 1 : 1;
            }
        }
    } else {
        for (const entry of Object.values(map)) {
            if (entry.version == null) {
                entry.version = 1;
            }
        }
    }
};

// The object as it goes into the search index.
const indexable = function (x) {
    const o = flattenLangstrings(JSON.parse(JSON.stringify(x.object)));
    normalizeKeys(o);
    stampVersion(o, x.version);
    if (x.type != null && x.type.includes('EncryptedValue')) {
        delete o['payload'];
        delete o['secret'];
    }
    return o;
};

// Removes the entries the written objects had under another id or in another index (their type changed).
const removeStaleIndexRecords = async function (map, items) {
    items = [...items];
    const oldIndexRecords = [];
    while (items.length > 0) {
        const urls = items.splice(0, 500).filter((item) => !item.index.error && item.index._index !== 'permanent').map((item) => {
            const erld = new EcRemoteLinkedData(null, null);
            erld.copyFrom(map[item.index._id].object);
            return erld.id != null ? erld.shortId() : null;
        }).filter(Boolean);
        oldIndexRecords.push(...(await skyrepoManyGetIndexRecords.call(this, urls)));
    }

    let deleteBody = '';
    for (const record of oldIndexRecords) {
        const entry = Object.hasOwn(map, record._id) ? map[record._id] : undefined;
        if (!entry || entry.index != record._index) {
            deleteBody += `${JSON.stringify({ delete: { _index: record._index, _id: record._id } })}\n`;
        }
    }
    if (deleteBody != '') {
        await bulk(deleteBody);
    }
};

let skyrepoPutInternalIndexBulk = global.skyrepoPutInternalIndexBulk = async function (map) {
    const failed = {};
    await signAndIdentify.call(this, map);
    await chooseVersions.call(this, map);

    let body = '';
    for (const x of Object.values(map)) {
        const o = indexable(x);
        x.index = inferTypeFromObj(x.object, x.type).toLowerCase();
        body += `${JSON.stringify(bulkIndexAction(x.index, x.id, getTypeForObject(x.object, x.type), x.version))}\n`;
        body += `${JSON.stringify(o)}\n`;
    }
    const response = await bulk(body);
    if (!response) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.ERROR, 'DbPutIndexBulk', 'No response');
        return failAll(map);
    }

    if (response.errors) {
        const entryFor = entryFinder(map);
        for (let item of response.items) {
            // A version conflict is left for the permanent write to settle.
            if (item.index.status !== 409 && item.index.error) {
                global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.ERROR, 'DbPutIndexBulk', item);
                const found = entryFor(item);
                if (found) {
                    failed[found.id] = true;
                    delete map[found.id];
                }
            }
        }
    }

    await removeStaleIndexRecords.call(this, map, response.items);
    return failed;
};

const skyrepoPutParsedBulk = async function (ary) {
    const map = {};
    for (let x of ary) {
        map[x.id] = x;
    }

    const { failed } = await validateSignaturesBulk.call(this, map, 'Only an owner of an object may change it.');
    // Everything failed already
    if (Object.values(map).length === 0) {
        return failed;
    }

    // Add the additional fails
    Object.assign(failed, await skyrepoPutInternalBulk.call(this, map));

    for (let x of Object.values(map)) {
        noteRekeyRequest(x.object);
    }

    publish(this, ['write', 'any'], ary);
    return failed;
};

const endpointMultiPutBulk = async function () {
    const ary = this.params.ary;
    this.ctx.put('refresh', 'false');
    const failed = await (skyrepoPutParsedBulk).call(this, ary);
    return ary.filter((x) => !failed[x.id]).map((x) => x.object);
};

const endpointMultiPut = async function () {
    const ary = JSON.parse(fileToString((fileFromDatastream).call(this, 'data', null)));
    const results = [];
    if (ary != null) {
        // Done once here, rather than by each write.
        await ensurePermanentIndex('SkyrepEndpointMultiput');
        await ((signatureSheet).call(this));
        await (requireSignedWrite).call(this);

        // One entry per object; when an object is given more than once, the last one wins.
        const uniques = {};
        for (const o of ary) {
            const ld = new EcRemoteLinkedData(null, null);
            ld.copyFrom(o);
            let id = null;
            if (!EcRepository.alwaysTryUrl && repo != null && !repo.constructor.shouldTryUrl(ld.id) && !ld.id.includes(repo.selectedServerProxy) && !ld.id.includes(repo.selectedServer)) {
                id = EcCrypto.md5(ld.shortId());
            } else {
                id = ld.getGuid();
            }
            let version = ld.getTimestamp();
            if (Number.isNaN(Number(version))) {
                version = null;
            }
            uniques[id] = {
                object: o,
                id: id,
                version: version,
                type: ld.getDottedType(),
            };
        }

        const uniqueAry = Object.values(uniques);
        const batchSize = Number.parseInt(process.env.MULTIPUT_BATCH_SIZE || 100);
        while (uniqueAry.length > 0) {
            results.push(...(await endpointMultiPutBulk.call({ ctx: this.ctx, dataStreams: this.dataStreams, params: { ary: uniqueAry.splice(0, batchSize) } })).filter((x) => x != null));
        }
    }
    await httpGet(elasticEndpoint + '/_all/_refresh', true, elasticHeaders());
    global.events.database.afterSave.next(results);
    return JSON.stringify(results);
};

/**
 * @openapi
 * /api/sky/repo/multiPut:
 *   post:
 *     x-mcp-ignore: true
 *     tags:
 *       - Repository
 *     summary: Store multiple records simultaneously
 *     description: 'Stores multiple pieces of data simultaneously. Note, testing this function via LLMs/Swagger often fails due to multipart array format requirements. See: https://stackoverflow.com/questions/68291244'
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 $ref: '#/components/schemas/JsonLdArray'
 *               signatureSheet:
 *                 $ref: '#/components/schemas/SignatureSheet'
 *     responses:
 *       200:
 *         description: Returns data that was saved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JsonLdArray'
 */
bindWebService('/sky/repo/multiPut', endpointMultiPut);