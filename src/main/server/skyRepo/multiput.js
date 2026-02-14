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
let permanentCreated = false;

let skyrepoPutInternalPermanentBulk = global.skyrepoPutInternalPermanentBulk = async function (map) {
    const failed = {};

    let body = '';

    for (let x of Object.values(map)) {
        let writeMs = new Date().getTime();

        for (let id of x.permanentIds) {
            let obj = {
                'index': {
                    '_index': 'permanent',
                    '_id': id + '.' + (x.version || ''),
                    '_type': getTypeForObject(x.object, x.type),
                    'version': x.version,
                    'version_type': 'external'
                }
            };
            if (elasticSearchVersion().startsWith('8.') || elasticSearchVersion().startsWith('9.')) {
                delete obj.index['_type'];
            }
            body += `${JSON.stringify(obj)}\n`;
            body += `${JSON.stringify({ data: JSON.stringify(x.object), writeMs: writeMs })}\n`;

            obj = {
                'index': {
                    '_index': 'permanent',
                    '_id': id + '.',
                    '_type': getTypeForObject(x.object, x.type),
                    'version': x.version,
                    'version_type': 'external'
                }
            };
            if (elasticSearchVersion().startsWith('8.') || elasticSearchVersion().startsWith('9.')) {
                delete obj.index['_type'];
            }
            body += `${JSON.stringify(obj)}\n`;
            body += `${JSON.stringify({ data: JSON.stringify(x.object), writeMs: writeMs })}\n`;
        }
    }
    const response = await httpPost(body, elasticEndpoint + '/_bulk', 'application/x-ndjson', false, null, null, true, elasticHeaders());
    if (!response) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.ERROR, 'DbPutPermBulk', 'No response');
        for (let x of Object.values(map)) {
            failed[x.id] = true;
        }
        return failed;
    }

    if (response.errors) {
        let retries = {};

        for (let item of response.items) {
            if (item.index.status === 409) {
                let found = Object.values(map).find((x) => x.permanentIds.includes(item.index['_id'].split('.')[0]));
                if (found) {
                    retries[found.id] = found;
                }
            } else if (item.index.error) {
                global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.ERROR, 'PutPermBulk', item);
                let found = Object.values(map).find((x) => x.permanentIds.includes(item.index['_id'].split('.')[0]));
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
                let found = retries[currentDoc['_id'].split('.')[0]];
                if (currentDoc['_version'] >= found.version && currentDoc['_version'] > 1743202754349) {
                    delete retries[currentDoc['_id'].split('.')[0]];
                    global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.WARNING, 'SkyrepoPutInternal', 'Dumping, was at: [' + found.version + ']');
                }
                else if (currentDoc['_version'] >= found.version) {
                    found.version = currentDoc['_version'] + 1;
                }
            }
            global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.WARNING, 'DbPutInternal', 'Updated to: [' + Object.values(retries).map((x) => x.version).toString() + ']');

            // Used to replay replication / database log files without "just jamming the data in"
            if (Object.values(retries).length > 0)
                if (process.env.ALLOW_SANCTIONED_REPLAY != 'true' || this.ctx.sanctionedReplay != true) {
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

let skyrepoManyGetIndexRecords = async function (ary) {
    //TODO: Merge with multiget.skyrepoManyGetIndexSearch
    if (ary.length === 0) {
        return [];
    }
    let hashIds = ary.map((x) => EcCrypto.md5(x));
    let microSearchUrl = "";
    for (let id of ary) {
        microSearchUrl += '@id:"' + id + '" OR ';
    }
    for (let i = 0; i < hashIds.length; i++) {
        microSearchUrl += '@id:"' + hashIds[i] + '"';
        if (i < hashIds.length - 1) {
            microSearchUrl += ' OR ';
        }
    }

    const searchParameters = await searchObj.call(this, microSearchUrl, null, 10000);
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepSearch', JSON.stringify(searchParameters));
    }
    const microSearch = await httpPost(searchParameters, searchUrl(), 'application/json', false, null, null, true, elasticHeaders());

    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepManyGetIndexRecords', microSearchUrl);
    }
    if (microSearch == null) {
        return [];
    }
    const hitshits = (microSearch)['hits'];
    if (hitshits == null) {
        return [];
    }
    const hits = (hitshits)['hits'];
    if (hits.length == 0) {
        return [];
    }
    return hits;
};

let skyrepoPutInternalIndexBulk = global.skyrepoPutInternalIndexBulk = async function (map) {
    const failed = {};
    for (let x of Object.values(map)) {
        x.permanentIds = [];
        x.permanentIds.push(x.id);

        const erld = new EcRemoteLinkedData(null, null);
        erld.copyFrom(x.object);
        if (this.ctx && this.ctx.req && this.ctx.req.eim != null) {
            try {
                await this.ctx.req.eim.sign(erld);
                x.object = JSON.parse(erld.toJson());
            } catch (msg) {
                global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.ERROR, 'DbPutInternalError', msg);
            }
        }

        if (erld.id != null && erld.getGuid() != null) {
            EcArray.setAdd(x.permanentIds, erld.getGuid());
        };
        if (erld.id != null && erld.shortId() != null) {
            EcArray.setAdd(x.permanentIds, EcCrypto.md5(erld.shortId()));
        }
    }
    const permIndexes = await skyrepoManyGetIndexInternal.call(this, 'permanent', Object.values(map));
    if (permIndexes) {
        for (let x of permIndexes.docs) {
            let id = x['_id'].split('.')[0];
            let chosenVersion = map[id].version;
            if (chosenVersion == null) {
                if (x != null && x['_version'] != null && !isNaN(x['_version'])) {
                    chosenVersion = x['_version'] + 1;
                } else {
                    chosenVersion = 1;
                }
            }

            map[id].version = chosenVersion;
        }
    } else {
        for (let key of Object.keys(map)) {
            if (map[key].version == null) {
                map[key].version = 1;
            }
        }
    }

    let body = '';

    for (let x of Object.values(map)) {
        let o = x.object;
        o = flattenLangstrings(JSON.parse(JSON.stringify(o)));
        if ((o)['owner'] != null && EcArray.isArray((o)['owner'])) {
            let owners = (o)['owner'];
            for (let i = 0; i < owners.length; i++) {
                if (owners[i].indexOf('\n') != -1) {
                    owners[i] = EcPk.fromPem(owners[i]).toPem();
                }
            }
        }
        if ((o)['reader'] != null && EcArray.isArray((o)['reader'])) {
            let owners = (o)['reader'];
            for (let i = 0; i < owners.length; i++) {
                if (owners[i].indexOf('\n') != -1) {
                    owners[i] = EcPk.fromPem(owners[i]).toPem();
                }
            }
        }
        try {
            (o)['@version'] = parseInt(x.version);
            if (isNaN((o)['@version'])) {
                (o)['@version'] = new Date().getTime();
            }
        } catch (ex) {
            (o)['@version'] = new Date().getTime();
        }
        if (x.type != null && x.type.indexOf('EncryptedValue') != -1) {
            delete (o)['payload'];
            delete (o)['secret'];
        }

        x.index = inferTypeFromObj(x.object, x.type).toLowerCase();

        let obj = { 'index': { '_index': x.index, '_id': x.id, '_type': getTypeForObject(x.object, x.type), 'version': x.version, 'version_type': 'external' } };
        if (elasticSearchVersion().startsWith('8.') || elasticSearchVersion().startsWith('9.')) {
            delete obj.index['_type'];
        }

        body += `${JSON.stringify(obj)}\n`;
        body += `${JSON.stringify(o)}\n`;
    }
    const response = await httpPost(body, elasticEndpoint + '/_bulk', 'application/x-ndjson', false, null, null, true, elasticHeaders());
    if (!response) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.ERROR, 'DbPutIndexBulk', 'No response');
        for (let x of Object.values(map)) {
            failed[x.id] = true;
        }
        return failed;
    }

    if (response.errors) {
        for (let item of response.items) {
            if (item.index.status === 409) {
                // Do nothing
            } else if (item.index.error) {
                global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.ERROR, 'DbPutIndexBulk', item);
                let found = Object.values(map).find((x) => x.permanentIds.includes(item.index['_id'].split('.')[0]));
                if (found) {
                    failed[found.id] = true;
                    delete map[found.id];
                }
            }
        }
    }

    let recordsToGet = [...response.items];
    let oldIndexRecords = [];
    while (recordsToGet.length > 0)
        oldIndexRecords.push(...(await skyrepoManyGetIndexRecords.call(this, recordsToGet.splice(0, 1000).filter((x) => !x.index.error && x.index._index !== 'permanent').map((x) => {
            let obj = x.index;
            const erld = new EcRemoteLinkedData(null, null);
            erld.copyFrom(map[obj._id].object);
            if (erld.id != null) {
                return erld.shortId();
            }
        }).filter((x) => x))));

    const recordsToDelete = [];

    for (const oldIndexRecord of oldIndexRecords) {
        let obj = Object.values(map).find((x) => x.id == oldIndexRecord._id);
        if (!obj || obj.index != oldIndexRecord._index) {
            recordsToDelete.push(oldIndexRecord);
        }
    }

    if (recordsToDelete.length > 0) {
        let deleteBody = '';
        for (let record of recordsToDelete) {
            deleteBody += `${JSON.stringify({ delete: { _index: record._index, _id: record._id } })}\n`;
        }
        const deleteResponse = await httpPost(deleteBody, elasticEndpoint + '/_bulk', 'application/x-ndjson', false, null, null, true, elasticHeaders());
    }

    return failed;
};
const skyrepoPutParsedBulk = async function (ary) {
    const map = {};
    for (let x of ary) {
        map[x.id] = x;
    }

    const { succeeded, failed } = await validateSignaturesBulk.call(this, map, 'Only an owner of an object may change it.');
    // Everything failed already
    if (Object.values(map).length === 0) {
        return failed;
    }

    // Add the additional fails
    Object.assign(failed, await skyrepoPutInternalBulk.call(this, map));

    for (let x of Object.values(map)) {
        let o = x.object;
        const rld = new EcRemoteLinkedData(null, null);
        rld.copyFrom(o);
        if (rld.isAny(new EcRekeyRequest().getTypes())) {
            const err = new EcRekeyRequest();
            err.copyFrom(o);
            if (err.verify()) {
                err.addRekeyRequestToForwardingTable();
            }
            global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.INFO, 'SkyrepoPutInternal', EcObject.keys(EcRemoteLinkedData.forwardingTable).length + ' records now in forwarding table.');
        }
    }

    global.events.data.write.next(ary, this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()))
    global.events.data.any.next(ary, this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()))
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
        // The following is also in skyrepoPutInternalPermanent. Adding it here avoids trying to create the permanent index for each object in multiput.
        if (permanentCreated != true) {
            const mappings = {};
            const permNoIndex = {};
            const doc = {};
            (mappings)['mappings'] = permNoIndex;

            if (elasticSearchVersion().startsWith('7.') || elasticSearchVersion().startsWith('8.') || elasticSearchVersion().startsWith('9.')) {
                permNoIndex.enabled = false;
            } else {
                (permNoIndex)['permanent'] = doc;
            }
            doc['enabled'] = false;
            const result = await httpPut(mappings, elasticEndpoint + '/permanent', 'application/json', elasticHeaders());
            if (global.skyrepoDebug) {
                global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepEndpointMultiput', JSON.stringify(result));
            }
            permanentCreated = true;
        }
        await ((signatureSheet).call(this));

        const uniques = {};
        for (let x of ary) {
            const ld = new EcRemoteLinkedData(null, null);
            const o = x;
            ld.copyFrom(o);
            let id = null;
            if (!EcRepository.alwaysTryUrl && repo != null && !repo.constructor.shouldTryUrl(ld.id) && ld.id.indexOf(repo.selectedServerProxy) == -1 && ld.id.indexOf(repo.selectedServer) == -1) {
                id = EcCrypto.md5(ld.shortId());
            } else {
                id = ld.getGuid();
            }
            let version = ld.getTimestamp();
            if (isNaN(version)) {
                version = null;
            }
            const type = ld.getDottedType();
            uniques[id] = {
                object: o,
                id: id,
                version: version,
                type: type,
            };
        }

        const uniqueAry = Object.values(uniques);

        while (uniqueAry.length > 0) {
            results.push(...(await endpointMultiPutBulk.call({ ctx: this.ctx, dataStreams: this.dataStreams, params: { ary: uniqueAry.splice(0, parseInt(process.env.MULTIPUT_BATCH_SIZE || 100)) } })).filter((x) => x != null));
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
 *     tags:
 *       - Repository
 *     description: 'Stores multiple pieces of data simultaneously. Note, testing this function does not work. See: https://stackoverflow.com/questions/68291244/how-to-format-a-json-array-in-the-request-body-of-a-multipart-form-data-request/68291856#68291856'
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