/* -
 * --BEGIN_LICENSE--
 * Competency and Skills System
 * -----
 * Copyright (C) 2015 - 2025 Eduworks Corporation and other contributing parties.
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
let permanentCreated = false;

const putUrl = function (o, id, version, type) {
    const typeFromObj = inferTypeFromObj(o, type);
    let versionPart = null;
    let refreshPart = 'refresh=true';
    if (this.ctx.get('refresh') !== undefined && this.ctx.get('refresh') != null) {
        refreshPart = 'refresh=' + this.ctx.get('refresh');
    }
    if (version === undefined || version == null) {
        versionPart = '?' + refreshPart;
    } else {
        versionPart = '?version=' + (version === undefined || version == null ? '' : version) + '&version_type=external&' + refreshPart;
    }
    let url = elasticEndpoint;
    url += '/' + typeFromObj.toLowerCase();
    if (elasticSearchVersion().startsWith('7.') || elasticSearchVersion().startsWith('8.')) {
        url += '/_doc';
    } else {
        url += '/' + typeFromObj;
    }
    url += '/' + encodeURIComponent(id) + versionPart;
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepoPutUrl', 'Put:' + url);
    }
    return url;
};

const putPermanentUrl = function (o, id, version, type) {
    let versionPart = null;
    let refreshPart = 'refresh=true';
    if (this.ctx.get('refresh') !== undefined && this.ctx.get('refresh') != null) {
        refreshPart = 'refresh=' + this.ctx.get('refresh');
    }
    if (version === undefined || version == null) {
        versionPart = '?' + refreshPart;
    } else {
        versionPart = '?version=' + (version === undefined || version == null ? '' : version) + '&version_type=external&' + refreshPart;
    }
    let url = elasticEndpoint;
    url += '/permanent';
    if (elasticSearchVersion().startsWith('7.') || elasticSearchVersion().startsWith('8.')) {
        url += '/_doc';
    } else {
        url += '/permanent';
    }
    url += '/' + encodeURIComponent(id) + '.' + (version === undefined || version == null ? '' : version) + versionPart;
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepoPutPermanentUrl', 'PutPermanent:' + url);
    }
    return url;
};

const putPermanentBaseUrl = function (o, id, version, type) {
    let versionPart = null;
    let refreshPart = 'refresh=true';
    if (this.ctx.get('refresh') !== undefined && this.ctx.get('refresh') != null) {
        refreshPart = 'refresh=' + this.ctx.get('refresh');
    }
    if (version === undefined || version == null) {
        versionPart = '?' + refreshPart;
    } else {
        versionPart = '?version=' + (version === undefined || version == null ? '' : version) + '&version_type=external&' + refreshPart;
    }
    let url = elasticEndpoint;
    url += '/permanent';
    if (elasticSearchVersion().startsWith('7.') || elasticSearchVersion().startsWith('8.')) {
        url += '/_doc';
    } else {
        url += '/permanent';
    }
    url += '/' + encodeURIComponent(id) + '.' + versionPart;
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepoPutPermanentBaseUrl', 'PutPermanentBase:' + url);
    }
    return url;
};

const removeNonIndexables = function (o) {
    if (o != null && EcObject.isObject(o)) {
        const keys = EcObject.keys(o);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            removeNonIndexables((o)[key]);
        }
        if (o.type == 'EncryptedValue' || o['@type'] == 'EncryptedValue') {
            delete (o)['payload'];
            delete (o)['secret'];
        }
        delete (o)['signature'];
        delete (o)['@signature'];
    } else if (o != null && EcArray.isArray(o)) {
        const a = o;
        for (let i = 0; i < a.length; i++) {
            removeNonIndexables(a[i]);
        }
    }
};
const skyrepoPutInternalIndex = async function (o, id, version, type) {
    const url = putUrl.call(this, o, id, version, type);
    o = flattenLangstrings(o);
    removeNonIndexables(o);
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
        (o)['@version'] = parseInt(version);
        if (isNaN((o)['@version'])) {
            (o)['@version'] = new Date().getTime();
        }
    } catch (ex) {
        (o)['@version'] = new Date().getTime();
    }
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'DbPutInternalIndex', JSON.stringify(o));
    }
    const response = await httpPost(o, url, 'application/json', false, null, null, true, elasticHeaders());
    return response;
};

const skyrepoPutInternalPermanent = async function (o, id, version, type) {
    if (permanentCreated != true) {
        const mappings = {};
        const permNoIndex = {};
        const doc = {};
        (mappings)['mappings'] = permNoIndex;

        if (elasticSearchVersion().startsWith('7.') || elasticSearchVersion().startsWith('8.')) {
            permNoIndex.enabled = false;
        } else {
            (permNoIndex)['permanent'] = doc;
        }
        doc['enabled'] = false;
        const result = await httpPut(mappings, elasticEndpoint + '/permanent', 'application/json', elasticHeaders());
        if (global.skyrepoDebug) {
            global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'DbPutInternalPerm', JSON.stringify(result));
        }
        permanentCreated = true;
    }
    const data = {};
    (data)['data'] = JSON.stringify(o);
    data.writeMs = new Date().getTime();
    let url = putPermanentBaseUrl.call(this, o, id, version, type);
    let results = await httpPost(data, url, 'application/json', false, null, null, true, elasticHeaders());
    if (results === 409) {
        return JSON.stringify(results);
    }
    if (version != null) {
        url = putPermanentUrl.call(this, o, id, version, type);
        results = await httpPost(data, url, 'application/json', false, null, null, true, elasticHeaders());
    }
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'DbPutInternalPerm', JSON.stringify(results));
    }
    return JSON.stringify(results);
};

const skyrepoGetIndexRecords = async function (id) {
    const hashId = EcCrypto.md5(id);
    const microSearchUrl = elasticEndpoint + '/_search?version&q=@id:"' + id + '" OR @id:"' + hashId + '"';
    const microSearch = await httpGet(microSearchUrl, true, elasticHeaders());
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepGetIndexRecords', microSearchUrl);
    }
    if (microSearch == null) {
        return null;
    }
    const hitshits = (microSearch)['hits'];
    if (hitshits == null) {
        return null;
    }
    const hits = (hitshits)['hits'];
    if (hits.length == 0) {
        return null;
    }
    return hits;
};

let skyrepoPutInternal = global.skyrepoPutInternal = async function (o, id, version, type) {
    // Securing Proxy: Sign data that is to be saved.
    const erld = new EcRemoteLinkedData(null, null);
    erld.copyFrom(o);
    if (this.ctx && this.ctx.req && this.ctx.req.eim != null) {
        try {
            await this.ctx.req.eim.sign(erld);
            o = JSON.parse(erld.toJson());
        } catch (msg) {
            global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.ERROR, 'DbPutInternalError', msg);
        }
    }
    const oldPermanent = await skyrepoGetPermanent(id, version, type);
    if (isNaN(version)) {
        version = null;
    }
    let chosenVersion = version;
    // If we are doing a manual put with a CASS_LOOPBACK that has an associated CASS_LOOPBACK_PROXY from localhost,
    // we have to pull the version from the object not the url (because it wasn't sent with the url because it's using the md5)
    if (chosenVersion == null && erld.id && (erld.id.startsWith(repo.selectedServer) || erld.id.startsWith(repo.selectedServerProxy))) {
        chosenVersion = erld.getTimestamp();
    }
    if (chosenVersion == null) {
        if (oldPermanent != null && oldPermanent['_version'] != null && !isNaN(oldPermanent['_version'])) {
            chosenVersion = oldPermanent['_version'] + 1;
        } else {
            chosenVersion = 1;
        }
    }
    const obj = await skyrepoPutInternalIndex.call(this, o, id, chosenVersion, type);
    if (erld.id != null) {
        const oldIndexRecords = await skyrepoGetIndexRecords(erld.shortId());
        if (oldIndexRecords != null) {
            for (const oldIndexRecord of oldIndexRecords) {
                if (oldIndexRecord._id != obj._id || oldIndexRecord._index != obj._index) {
                    await skyrepoDeleteInternalIndex.call(this, oldIndexRecord._id, null, oldIndexRecord._index);
                }
            }
        }
    }
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'PutInternal', JSON.stringify(obj));
    }
    const permanentIds = [id];
    if (erld.id != null && erld.getGuid() != null) {
        permanentIds.push(erld.getGuid());
    };
    if (erld.id != null && erld.shortId() != null) {
        permanentIds.push(EcCrypto.md5(erld.shortId()));
    }
    EcArray.removeDuplicates(permanentIds);
    for (const permId of permanentIds) {
        const status = await skyrepoPutInternalPermanent.call(this, o, permId, chosenVersion, type);
        if (status === '409') {
            global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.WARNING, 'PutInternal', '409, version is: ' + chosenVersion);
            const current = await skyrepoGetPermanent.call(this, permId, null, type);
            if (current && current._version > chosenVersion && current._version > 1743202754349) {
                global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.WARNING, 'PutInternal', 'Dumping, was at ' + chosenVersion);
                break;
            }
            else if (current && current._version > chosenVersion) {
                chosenVersion = current._version;
                global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.WARNING, 'PutInternal', 'Updated to ' + chosenVersion);
            }
            // Used to replay replication / database log files without "just jamming the data in"
            if (process.env.ALLOW_SANCTIONED_REPLAY != 'true' || this.ctx.sanctionedReplay != true) {
                await skyrepoPutInternal.call(this, o, id, chosenVersion + 1, type, true);
            }
            break;
        }
    }
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
};

const skyrepoPut = async function (parseParams) {
    if (parseParams == null && this.params.id != null && this.params.id != '') {
        parseParams = {};
        parseParams['id'] = this.params.id;
        parseParams['type'] = this.params.type;
        parseParams['version'] = this.params.version;
        parseParams['obj'] = this.params.obj;
    }
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepPut', 'put pp:' + JSON.stringifyparseParams);
    }
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepPut', 'put obj:' + JSON.stringify(this.params.obj));
    }
    if (parseParams == null && EcObject.isObject(this.params.obj)) {
        parseParams = this.params.obj;
    }
    let obj = parseParams['obj'];
    if (!EcObject.isObject(obj)) {
        obj = JSON.parse(obj);
    }
    const id = parseParams['id'];
    const type = parseParams['type'];
    const version = parseParams['version'];
    return await (skyrepoPutParsed).call(this, obj, id, version, type, null);
};
const skyrepoPutParsed = async function (o, id, version, type) {
    if (o == null) {
        return;
    }
    await (validateSignatures).call(this, id, version, type, 'Only an owner of an object may change it.', null, null);
    await skyrepoPutInternal.call(this, o, id, version, type);
    global.events.data.write.next([o], this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()))
    global.events.data.any.next([o], this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()))
};

module.exports = {
    putUrl,
    putPermanentUrl,
    putPermanentBaseUrl,
    skyrepoPutInternalIndex,
    skyrepoPutInternalPermanent,
    skyrepoPutInternal,
    skyrepoPut,
    skyrepoPutParsed
};