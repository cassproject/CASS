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

const EcArray = require('cassproject/src/com/eduworks/ec/array/EcArray');
const EcRsaOaepAsync = require('cassproject/src/com/eduworks/ec/crypto/EcRsaOaepAsync');
const EcEncryptedValue = require('cassproject/src/org/cassproject/ebac/repository/EcEncryptedValue');
const EcRemoteLinkedData = require('cassproject/src/org/cassproject/schema/general/EcRemoteLinkedData');
const fs = require('fs');
const sharedAdminCache = require("./shims/util/sharedAdminCache");

const objectNotFoundError = 'Object not found or you did not supply sufficient permissions to access the object.';

global.keyFor = function (filename) {
    // Check environment variable first
    if (process.env[filename]) return process.env[filename];

    // Build possible file paths
    const fileNames = [
        filename + '.pem',
        'etc/' + filename + '.pem'
    ];

    // Try to find an existing key file
    for (const filePath of fileNames) {
        if (fs.existsSync(filePath)) {
            return fileToString(fileLoad(filePath, false, true));
        }
    }

    // If not found, generate and save a new key
    const keyPath = 'etc/' + filename + '.pem';
    fileSave(EcPpk.generateKey().toPem(), keyPath);
    return fileToString(fileLoad(keyPath, false, true));
};

global.repoAutoDetect = function () {
    if (process.env.CASS_LOOPBACK != null) {
        repo.init(process.env.CASS_LOOPBACK, function () {
            global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.INFO, 'CassRepoInit', EcObject.keys(EcRemoteLinkedData.forwardingTable).length + ' records now in forwarding table.');
        }, (error) => {
            global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.ERROR, 'CassRepoInitError', error);
        });
    } else {
        repo.autoDetectRepository();
    }

    global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.INFO, 'CassRepoAutoDetect',
        'Loopback: ' + repo.selectedServer,
        'Loopback Proxy: ' + repo.selectedServerProxy,
        'Elasticsearch Endpoint: ' + elasticEndpoint,
        'Text Encoding: ' + java.lang.System.getProperty('file.encoding'),
        'Text Encoding: ' + java.nio.charset.Charset.defaultCharset().toString());
};

global.elasticHeaders = function () {
    const headers = {};
    if (process.env.ELASTICSEARCH_AUTHORIZATION != null) {
        headers.Authorization = process.env.ELASTICSEARCH_AUTHORIZATION.trim();
    }
    return headers;
};

global.elasticSearchVersion = function () {
    return ((elasticSearchInfo)['version'])['number'];
};
const getTypeFromObject = function (o) {
    let encryptedType = (o)['encryptedType'];
    let encryptedContext = (o)['encryptedContext'];
    let type = (o)['@type'];
    let context = (o)['@context'];
    if (type == null) {
        type = (o)['type'];
    }
    if (context == null) {
        context = (o)['context'];
    }
    if (encryptedType == null) {
        encryptedType = (o)['@encryptedType'];
    }
    if (encryptedContext == null) {
        encryptedContext = (o)['@encryptedContext'];
    }
    if (encryptedType != null) {
        type = encryptedType;
    }
    if (encryptedContext != null) {
        context = encryptedContext;
    }
    if (type == null) {
        return null;
    }
    if (type.indexOf('http') != -1) {
        return type;
    }
    if (context == null) {
        return type;
    }
    if (context.endsWith('/')) {
        return context + type;
    } else {
        return context + '/' + type;
    }
};

const signatureSheetEach = async function (obj) {
    const signature = new EbacSignature();
    signature.copyFrom(obj);
    if (signature == null)
        error('Missing Signature.', 496);

    let owner = signature.owner || signature["@owner"];
    signature['@owner'] = owner;
    delete signature.owner;

    const ownerPk = EcPk.fromPem(owner);
    global.auditLogger.report(global.auditLogger.LogCategory.SECURITY, global.auditLogger.Severity.NETWORK, 'CassIdentity', ownerPk.fingerprint());

    const validTypes = signature.getTypes();
    // Check if the signature type is valid
    if (!validTypes.some(validType => validType == getTypeFromObject(obj))) {
        error('Invalid Signature Version.', 422);
    }
    if (signature.expiry == null) {
        error('Missing expiry date.', 422);
    }
    const now = new Date().getTime();
    if (signature.expiry < now) {
        // Used to replay replication / database log files without "just jamming the data in"
        if (process.env.ALLOW_SANCTIONED_REPLAY != 'true' || this.ctx.sanctionedReplay != true) {
            error('A Signature is Expired. My time is ' + now + ' and the signature expires at ' + signature.expiry, 419);
        }
    }
    let signBytes = signature.signature || signature['@signature'];
    let signBytesSha256 = signature.signatureSha256 || signature['@signatureSha256'];
    let realSignature = signature.toJson();
    signature.signature = (signature)['@signature'] = signature.signatureSha256 = (signature)['@signatureSha256'] = null;
    if (process.env.REJECT_SHA1) {
        if (signBytes != null && signBytesSha256 == null) {
            warn('SHA1 Signature Detected. Rejecting: ' + realSignature);
            error('SHA1 Signature is not supported. Invalid Signature Detected: ' + realSignature, 451);
        } else if (!(await EcRsaOaepAsync.verifySha256(ownerPk, signature.toJson(), signBytesSha256))) {
            error('Invalid Signature Detected: ' + realSignature, 451);
        }
    } else {
        if (signBytes == null && signBytesSha256 == null) {
            error('No Signature Detected: ' + realSignature, 451);
        }
        if (signBytesSha256 != null) {
            if (!(await EcRsaOaepAsync.verifySha256(ownerPk, signature.toJson(), signBytesSha256))) {
                error('Invalid Signature Detected: ' + realSignature, 451);
            }
        }
        if (signBytes != null) {
            if (!(await EcRsaOaepAsync.verify(ownerPk, signature.toJson(), signBytes))) {
                error('Invalid Signature Detected: ' + realSignature, 451);
            }
        }
    }
    signature.owner = signature['@owner'];
    return signature;
};
const signatureSheet = async function () {
    let sigSheet = this.ctx.get('signatureSheet');
    if (sigSheet != null)
        return sigSheet;
    sigSheet = [];

    const fromDatastream = (fileFromDatastream).call(this, 'signatureSheet', null);
    const stringFromDatastream = fileToString(fromDatastream);
    if (stringFromDatastream != null)
        try {
            sigSheet = sigSheet.concat(JSON.parse(stringFromDatastream));
        } catch {
            error('Missing or Malformed Signature.', 496);
        }

    const hdrs = headers.call(this);
    if (hdrs.signatureSheet != null || hdrs.signaturesheet != null) {
        sigSheet = sigSheet.concat(JSON.parse(hdrs.signatureSheet || hdrs.signaturesheet));
    }

    sigSheet = await Promise.all(sigSheet.map(async (sig) => {
        return await signatureSheetEach.call(this, sig);
    }));

    this.ctx.put('signatureSheet', sigSheet);
    return sigSheet;
};
const eevPrototype = new EcEncryptedValue();
const filterResults = async function (o, dontDecryptInSso) {
    if (o == null)
        return o;
    if (EcArray.isArray(o)) {
        return (await Promise.all(o.map(async (x) => {
            try {
                return await filterResults.call(this, x, dontDecryptInSso);
            } catch (ex) {
                if (ex != null && ex.toString().indexOf(objectNotFoundError) == -1) {
                    throw ex;
                }
                return null;
            }
        }))).filter((x) => x);
    } else if (EcObject.isObject(o)) {
        delete o.decryptedSecret;
        const rld = new EcRemoteLinkedData().copyFrom(o);
        console.log(rld);
        if ((rld.reader != null && rld.reader.length != 0) || rld.isAny(eevPrototype.getTypes())) {
            const signatures = await (signatureSheet).call(this);
            let foundSignature = false;
            for (let signature of signatures) {
                if (JSON.stringify(o).indexOf(signature.owner) != -1) {
                    foundSignature = true;
                    break;
                }
                if (EcPk.fromPem(skyrepoAdminPk()).equals(EcPk.fromPem(signature.owner))) {
                    foundSignature = true;
                    break;
                }
            }
            if (!foundSignature) {
                throw new Error(objectNotFoundError);
            }
            // Securing Proxy: Decrypt data that is being passed back via SSO.
            if (this.ctx.req.eim != null && dontDecryptInSso == null)
            {
                try {
                    let eev = new EcEncryptedValue();
                    eev.copyFrom(o);
                    o.decryptedSecret = await eev.decryptSecret(this.ctx.req.eim);
                } catch (msg) {
                    global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.ERROR, 'CassDecryptError', 'We couldn\'t decrypt it, hope the client has better luck! -- ' + msg);
                }
            }
        }
        await Promise.all(EcObject.keys(o).map(async (key) => {
            try {
                o[key] = await filterResults.call(this, o[key], dontDecryptInSso);
            } catch (ex) {
                if (ex != null && ex.toString().indexOf(objectNotFoundError) == -1) {
                    throw ex;
                }
                delete o[key];
            }
            if (o[key] == null) 
                delete o[key];
        }));
        return o;
    } else {
        return o;
    }
};
const inferTypeFromObj = function (o, atType) {
    let fullType = getTypeFromObject(o);
    if (fullType == null) {
        return fullType;
    }
    fullType = fullType.replace('http://', '');
    fullType = fullType.replace('https://', '');
    fullType = fullType.replace(/\//g, '.');
    fullType = fullType.replace(/:/g, '.');
    return fullType;
};
const inferTypeWithoutObj = function (atType) {
    if (atType !== undefined && atType != null) {
        return atType;
    }
    return '_all';
};
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
const getUrl = function (index, id, version, type) {
    let url = elasticEndpoint;
    url += '/' + index;
    if (elasticSearchVersion().startsWith('7.') || elasticSearchVersion().startsWith('8.')) {
        url += '/_doc';
    } else if (index == 'permanent') {
        url += '/permanent';
    } else {
        const typeFromObj = inferTypeWithoutObj(type);
        url += '/' + typeFromObj;
    }
    if (index == 'permanent') {
        url += '/' + encodeURIComponent(id) + '.' + (version === undefined || version == null ? '' : version);
    } else {
        url += '/' + encodeURIComponent(id);
    }
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepoGetUrl', 'Get:' + url);
    }
    return url;
};
const deleteUrl = function (id, version, type) {
    const typeFromObj = inferTypeWithoutObj(type);
    let refreshPart = 'refresh=true';
    if (this.ctx.get('refresh') !== undefined && this.ctx.get('refresh') != null) {
        refreshPart = 'refresh=' + this.ctx.get('refresh');
    }
    let url = elasticEndpoint;
    url += '/' + typeFromObj.toLowerCase();
    if (elasticSearchVersion().startsWith('7.') || elasticSearchVersion().startsWith('8.')) {
        url += '/_doc';
    } else {
        url += '/' + typeFromObj;
    }
    url += '/' + encodeURIComponent(id);
    url += '?' + refreshPart;
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepoDeleteUrl', 'Delete:' + url);
    }
    return url;
};
const deletePermanentBaseUrl = function (id, version, type) {
    let url = elasticEndpoint;
    url += '/permanent';
    if (elasticSearchVersion().startsWith('7.') || elasticSearchVersion().startsWith('8.')) {
        url += '/_doc';
    } else {
        url += '/permanent';
    }
    url += '/' + encodeURIComponent(id) + '.';
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepoDeletePermBase', 'DeletePermanentBase:' + url);
    }
    return url;
};
const languages = require('./langs').reduce(function (result, item, index, array) {
    result[item] = 1;
    return result;
}, {});
const flattenLangstrings = function (o) {
    if (EcObject.isObject(o)) {
        let langStringObject = {};
        let langStringArray = [];
        for (const key of EcObject.keys(o)) {
            if (key == '@value') {
                return o[key];
            }
            if (langStringArray != null) {
                if ((languages)[key.toLowerCase()] == 1) {
                    langStringArray.push(flattenLangstrings(o[key]));
                } else {
                    langStringArray = null;
                }
            }
            langStringObject[key] = flattenLangstrings(o[key]);
        }
        if (langStringArray != null && langStringArray.length > 0) {
            return langStringArray;
        }
        return langStringObject;
    } else if (EcArray.isArray(o)) {
        return o.map((x) => flattenLangstrings(x));
    }
    return o;
};
const getTypeForObject = function (o, type) {
    if (elasticSearchVersion().startsWith('7.') || elasticSearchVersion().startsWith('8.')) {
        return '_doc';
    } else {
        return inferTypeFromObj(o, type);
    }
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
let permanentCreated = false;
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
        (doc)['enabled'] = false;
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
let skyrepoPutInternalPermanentBulk = global.skyrepoPutInternalPermanentBulk = async function (map) {
    const failed = {};

    let body = '';

    for (let x of Object.values(map)) {
        let writeMs = new Date().getTime();

        for (let id of x.permanentIds) {
            let obj = { 'index': { '_index': 'permanent', '_id': id + '.' + (x.version || ''), '_type': getTypeForObject(x.object, x.type), 'version': x.version, 'version_type': 'external' } };
            if (elasticSearchVersion().startsWith('8.')) {
                delete obj.index['_type'];
            }
            body += `${JSON.stringify(obj)}\n`;
            body += `${JSON.stringify({ data: JSON.stringify(x.object), writeMs: writeMs })}\n`;

            obj = { 'index': { '_index': 'permanent', '_id': id + '.', '_type': getTypeForObject(x.object, x.type), 'version': x.version, 'version_type': 'external' } };
            if (elasticSearchVersion().startsWith('8.')) {
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
        if (elasticSearchVersion().startsWith('8.')) {
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
const skyrepoGetIndexInternal = async function (index, id, version, type) {
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepGetIndexInternal', 'Fetching from ' + index + ' : ' + type + ' / ' + id + ' / ' + version);
    }
    const response = await httpGet(getUrl.call(this, index, id, version, type), true, elasticHeaders());
    return response;
};

const skyrepoManyGetIndexInternal = async function (index, manyParseParams) {
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepManyGetIndexInternal', 'Fetching from ' + index + ' : ' + manyParseParams.length);
    }

    const ary = manyParseParams;
    const mget = {};
    const docs = [];
    (mget)['docs'] = docs;
    for (let i = 0; i < ary.length; i++) {
        const parseParams = ary[i];
        const id = (parseParams)['id'];
        const version = (parseParams)['version'];
        const p = {};
        (p)['_index'] = index;
        if (elasticSearchVersion().startsWith('8.')) {
            // Don't multiget with _type
        } else if (elasticSearchVersion().startsWith('7.')) {
            (p)['_type'] = '_doc';
        } else {
            (p)['_type'] = index;
        }
        (p)['_id'] = id + '.' + (version == null ? '' : version);
        docs.push(p);
    }

    const response = await httpPost(mget, elasticEndpoint + '/_mget', 'application/json', false, null, null, true, elasticHeaders());
    return response;
};

const skyrepoGetIndexSearch = async function (id, version, type) {
    const microSearchUrl = elasticEndpoint + '/_search?version&q=_id:' + id + '';
    const microSearch = await httpGet(microSearchUrl, true, elasticHeaders());
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepGetIndexSearch', microSearchUrl);
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
    const hit = hits[0];
    return hit;
};

const skyrepoManyGetIndexSearch = async function (ary) {
    let results = [];
    if (ary.length == 0) {
        return results;
    }
    while (ary.length > 0) {
        let batch = ary.splice(0, 10);
        let microSearchUrl = elasticEndpoint + '/_search?version&q=';
        for (let i = 0; i < batch.length; i++) {
            microSearchUrl += '_id:"' + batch[i].id + '"';
            if (i < batch.length - 1) {
                microSearchUrl += ' OR ';
            }
        }

        const microSearch = await httpGet(microSearchUrl, true, elasticHeaders());
        if (microSearch.error) throw new Error(microSearch.error.reason);
        if (global.skyrepoDebug) {
            global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepManyGetIndexSearch', microSearchUrl);
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
        for (let hit of hits)
            results.push(hit);
    }
    return results;
};

let skyrepoGetIndexRecords = async function (id) {
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

let skyrepoManyGetIndexRecords = async function (ary) {
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

    const searchParameters = await (searchObj).call(this, microSearchUrl, null, 10000);
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

const skyrepoGetIndex = async function (id, version, type) {
    if (type !== undefined && type != null && type != '') {
        const result = await skyrepoGetIndexInternal(type.toLowerCase(), id, version, type);
        return result;
    } else {
        return await skyrepoGetIndexSearch(id, version, type);
    }
};
const skyrepoManyGetIndex = async function (manyParseParams) {
    return await skyrepoManyGetIndexSearch(manyParseParams);
};
const skyrepoGetPermanent = async function (id, version, type) {
    const result = await skyrepoGetIndexInternal.call(this, 'permanent', id, version, type);
    return result;
};
const skyrepoHistoryPermanent = async function (id, version, type) {
    const query = {
        'size': 10000,
        'query': {
            'script': {
                'script': {
                    'source': 'doc[\'_id\'][0].indexOf(params.param1+\'.\') > -1',
                    'lang': 'painless',
                    'params': {
                        'param1': `${id}`,
                    },
                },
            },
        },
    };
    const historyUrl = elasticEndpoint + '/permanent/_search';
    const history = await httpPost(query, historyUrl, 'application/json', null, null, null, null, elasticHeaders());
    return history;
};
global.skyrepoGetInternal = async function (id, version, type) {
    let result = await skyrepoGetPermanent(id, version, type);
    if (result == null) {
        return null;
    }
    if ((result)['error'] != null) {
        return null;
    }
    if ((result)['found'] == true) {
        return JSON.parse(((result)['_source'])['data']);
    }
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepGetInternal', 'Failed to find ' + type + '/' + id + '/' + version + ' -- trying degraded form from search index.');
    }
    result = await (skyrepoGetIndex).call(this, id, version, type);
    if (result == null) {
        return null;
    }
    if ((result)['error'] != null) {
        return null;
    }
    if ((result)['found'] == true || (result)['_source'] != null) {
        return (result)['_source'];
    }
    return null;
};
global.skyrepoHistoryInternal = async function (id, version, type) {
    const result = await skyrepoHistoryPermanent(id, version, type);
    if (result == null) {
        return null;
    }
    if ((result)['error'] != null) {
        return null;
    }
    if ((result).hits.total.value > 0) {
        const hits = result.hits.hits;
        hits.sort((a, b) => {
            const A = new EcRemoteLinkedData();
            A.copyFrom(JSON.parse(a._source.data));
            const B = new EcRemoteLinkedData();
            B.copyFrom(JSON.parse(b._source.data));
            let Ats = A.getTimestamp();
            let Bts = B.getTimestamp();
            if (Ats == null) Ats = a._source.writeMs;
            if (Bts == null) Bts = b._source.writeMs;
            if (Ats == null || Bts == null) return 0;
            return Bts - Ats;
        });
        for (let i = 0; i < hits.length; i++) {
            for (let j = i; j < hits.length; j++) {
                if (i == j) continue;
                const A = new EcRemoteLinkedData();
                A.copyFrom(JSON.parse(hits[i]._source.data));
                const B = new EcRemoteLinkedData();
                B.copyFrom(JSON.parse(hits[j]._source.data));
                let Ats = A.getTimestamp();
                let Bts = B.getTimestamp();
                if (Ats == null) Ats = hits[i]._source.writeMs;
                if (Bts == null) Bts = hits[j]._source.writeMs;
                if (A.id + Ats == B.id + Bts) {
                    hits.splice(j--, 1); // NOSONAR -- Valid method of filtering.
                }
            }
        }
        return hits.map((h) => JSON.parse(h._source.data));
    }
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepoHistoryInternal', 'Failed to find ' + type + '/' + id + '/' + version + '.');
    }
    return null;
};
const skyrepoManyGetPermanent = async function (manyParseParams) {
    const result = await skyrepoManyGetIndexInternal.call(this, 'permanent', manyParseParams);
    return result;
};
let skyrepoManyGetInternal = global.skyrepoManyGetInternal = async function (manyParseParams) {
    let response = await skyrepoManyGetPermanent(manyParseParams);

    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepMGStuff', response);
    }
    let resultDocs = (response)['docs'];
    const results = [];
    const notFoundInPermanent = [];
    if (resultDocs != null) {
        for (let i = 0; i < resultDocs.length; i++) {
            let doc = resultDocs[i];
            if ((doc)['found']) {
                results.push(JSON.parse(((doc)['_source'])['data']));
            } else {
                notFoundInPermanent.push(manyParseParams[i]);
            }
        }
    }

    if (global.skyrepoDebug && notFoundInPermanent.length > 0) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepManyGetInternal', 'Failed to find ' + JSON.stringify(notFoundInPermanent) + ' -- trying degraded form from search index.');
    }

    response = await (skyrepoManyGetIndex).call(this, notFoundInPermanent);

    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepManyGetInternal', 'Index get - ' + JSON.stringify(response));
    }

    let resultDocs2 = (response);
    if (resultDocs2 != null) {
        for (let doc of resultDocs2) {
            results.push(doc['_source']);
        }
    }
    return results;
};
global.skyrepoGet = async function (parseParams) {
    if (parseParams == null && EcObject.isObject(this.params.obj)) {
        parseParams = this.params.obj;
    }
    if (parseParams == null) {
        parseParams = {};
        (parseParams)['id'] = this.params.id;
        (parseParams)['type'] = this.params.type;
        (parseParams)['version'] = this.params.version;
        (parseParams)['history'] = this.params.history;
    }
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepGet', JSON.stringify(parseParams));
    }
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepGet', JSON.stringify(this.params.obj));
    }
    const id = (parseParams)['id'];
    const type = (parseParams)['type'];
    const version = (parseParams)['version'];
    const history = (parseParams)['history'];
    return await (skyrepoGetParsed).call(this, id, version, type, null, history);
};

const skyrepoGetParsed = async function (id, version, type, dontDecrypt, history) {
    let filtered = null;
    if (history == true || history == 'true') {
        filtered = await skyrepoHistoryInternal.call(this, id, version, type);
        filtered = await (filterResults).call(this, filtered, dontDecrypt);
    } else {
        const result = await (skyrepoGetInternal).call(this, id, version, type);
        if (result == null) {
            return null;
        }
        try {
            console.log('Fetching from skyrepoGetInternal2');
            filtered = await (filterResults).call(this, result, dontDecrypt);
        } catch (ex) {
            if (ex.toString().indexOf('Signature Violation') != -1) {
                throw ex;
            }
        }
    }
    if (filtered == null) {
        return null;
    }
    if (EcObject.keys(filtered).length == 0) {
        return null;
    }
    global.events.data.read.next(filtered, this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()))
    global.events.data.any.next(filtered, this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()))
    return filtered;
};
const skyrepoManyGetParsed = async function (manyParseParams) {
    const results = await skyrepoManyGetInternal.call(this, manyParseParams);
    if (results == null) {
        return null;
    }
    let filtered = null;
    try {
        await (signatureSheet).call(this);
        filtered = await (filterResults).call(this, results, null);
    } catch (ex) {
        if (ex.toString().indexOf('Signature Violation') != -1) {
            throw ex;
        }
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.ERROR, 'SkyrepManyGetParsedError', ex);
    }
    if (filtered == null) {
        return null;
    }
    global.events.data.read.next(filtered, this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()))
    global.events.data.any.next(filtered, this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()))
    return filtered;
};
global.skyrepoPut = async function (parseParams) {
    if (parseParams == null && this.params.id != null && this.params.id != '') {
        parseParams = {};
        (parseParams)['id'] = this.params.id;
        (parseParams)['type'] = this.params.type;
        (parseParams)['version'] = this.params.version;
        (parseParams)['obj'] = this.params.obj;
    }
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepPut', 'put pp:' + JSON.stringify(parseParams));
    }
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepPut', 'put obj:' + JSON.stringify(this.params.obj));
    }
    if (parseParams == null && EcObject.isObject(this.params.obj)) {
        parseParams = this.params.obj;
    }
    let obj = (parseParams)['obj'];
    if (!EcObject.isObject(obj)) {
        obj = JSON.parse(obj);
    }
    const id = (parseParams)['id'];
    const type = (parseParams)['type'];
    const version = (parseParams)['version'];
    return await (skyrepoPutParsed).call(this, obj, id, version, type, null);
};
global.skyrepoPutParsed = async function (o, id, version, type) {
    if (o == null) {
        return;
    }
    await (validateSignatures).call(this, id, version, type, 'Only an owner of an object may change it.', null, null);
    await skyrepoPutInternal.call(this, o, id, version, type);
    global.events.data.write.next([o], this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()))
    global.events.data.any.next([o], this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()))
};
global.skyrepoPutParsedBulk = async function (ary) {
    const map = {};
    for (let x of ary) {
        map[x.id] = x;
    }

    const failed = await validateSignaturesBulk.call(this, map, 'Only an owner of an object may change it.');
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
let validateSignatures = async function (id, version, type, errorMessage) {
    const oldGet = await (skyrepoGetInternal).call(this, id, version, type);
    if (oldGet == null) {
        return null;
    }
    const oldObj = new EcRemoteLinkedData(null, null);
    oldObj.copyFrom(oldGet);
    if (oldObj.owner !== undefined && oldObj.owner != null && oldObj.owner.length > 0) {
        const signatures = await ((signatureSheet).call(this));
        let success = false;
        for (let i = 0; i < signatures.length; i++) {
            let owner = signatures[i].owner;
            if (owner == null) {
                owner = (signatures[i])['@owner'];
            }
            if (oldObj.hasOwner(EcPk.fromPem(owner))) {
                success = true;
                break;
            }
            if (EcPk.fromPem(skyrepoAdminPk()).equals(EcPk.fromPem(owner))) {
                global.auditLogger.report(global.auditLogger.LogCategory.SECURITY, global.auditLogger.Severity.INFO, 'SkyrepoAdminKeyUseDetected', 'Admin override detected.');
                success = true;
                break;
            }
        }
        if (!success) {
            error(errorMessage, 401);
        }
    }
    return oldObj;
};
let validateSignaturesBulk = async function (map, errorMessage) {
    const failed = {};
    const oldGets = await skyrepoManyGetInternal.call(this, Object.values(map));
    const signatures = this.ctx.get('signatureSheet') || [];
    for (let oldGet of oldGets) {
        if (oldGet) {
            const oldObj = new EcRemoteLinkedData(null, null);
            oldObj.copyFrom(oldGet);
            try {
                if (oldObj.owner !== undefined && oldObj.owner != null && oldObj.owner.length > 0) {
                    let success = false;
                    for (let i = 0; i < signatures.length; i++) {
                        let owner = signatures[i].owner;
                        if (owner == null) {
                            owner = (signatures[i])['@owner'];
                        }
                        if (oldObj.hasOwner(EcPk.fromPem(owner))) {
                            success = true;
                            break;
                        }
                        if (EcPk.fromPem(skyrepoAdminPk()).equals(EcPk.fromPem(owner))) {
                            global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.INFO, 'SkyrepoAdminKeyUseDetected', 'Admin override detected.');
                            success = true;
                            break;
                        }
                    }
                    if (!success) {
                        throw new Error(errorMessage);
                    }
                }
            } catch (e) {
                let id = oldObj.getGuid();
                failed[id] = true;
                delete map[id];
                id = EcCrypto.md5(oldObj.shortId());
                failed[id] = true;
                delete map[id];
            }
        }
    }
    return failed;
};
let skyrepoDeleteInternalIndex = async function (id, version, type) {
    const url = deleteUrl.call(this, id, version, type);
    return await httpDelete(url, elasticHeaders());
};
const skyrepoDeleteInternalPermanent = async function (id, version, type) {
    const url = deletePermanentBaseUrl(id, version, type);
    return await httpDelete(url, elasticHeaders());
};
global.skyrepoDelete = async function (id, version, type) {
    const oldObj = await (validateSignatures).call(this, id, version, type, 'Only an owner of an object may delete it.');
    if (oldObj == null) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.WARNING, 'IndexNoPermanent', "Couldn't find data to delete, removing the index entry.");
        await skyrepoDeleteInternalIndex.call(this, id, version, type);
        return null;
    }
    const ids = [id];
    if (oldObj.id != null && oldObj.getGuid() != null) {
        ids.push(oldObj.getGuid());
    };
    if (oldObj.id != null && oldObj.shortId() != null) {
        ids.push(EcCrypto.md5(oldObj.shortId()));
    }
    EcArray.removeDuplicates(ids);
    if (oldObj != null) {
        for (const id of ids) {
            await skyrepoDeleteInternalIndex.call(this, id, version, type);
            await skyrepoDeleteInternalIndex.call(this, id, version, inferTypeFromObj(oldObj));
            await skyrepoDeleteInternalPermanent.call(this, id, version, type);
        }
    } else {
        error('Can\'t find object to delete', 401);
    }
    global.events.data.delete.next([oldObj], this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()))
    global.events.data.any.next([oldObj], this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()))
    return oldObj;
};
const searchObj = async function (q, start, size, sort, track_scores) {
    const s = {};
    if (start != null) {
        (s)['from'] = start;
    }
    if (size != null) {
        (s)['size'] = size;
    }
    if (sort != null) {
        (s)['sort'] = JSON.parse(sort);
    }
    (s)['version'] = true;
    const query = {};
    (s)['query'] = query;
    const bool = {};
    (query)['bool'] = bool;
    const must = {};
    (bool)['must'] = must;
    const query_string = {};
    (must)['query_string'] = query_string;
    const signatures = await (signatureSheet).call(this);
    (query_string)['query'] = q;
    if (signatures != null && signatures.length > 0) {
        let q2 = '';
        for (let i = 0; i < signatures.length; i++) {
            if (i > 0) {
                q2 += ' OR ';
            }
            q2 += '"' + signatures[i].owner + '"';
        }
        const should = {};
        (bool)['should'] = should;
        const query_string2 = {};
        (should)['query_string'] = query_string2;
        (query_string2)['query'] = q2;
    }
    return s;
};
const searchUrl = function (urlRemainder, index_hint) {
    let url = elasticEndpoint;
    if (index_hint != null && index_hint.indexOf('permanent') != -1) {
        index_hint = null;
    }
    if (urlRemainder != null && urlRemainder != '' && urlRemainder != '/') {
        url += urlRemainder.toLowerCase();
    } else if (index_hint == null) {
        url += '/*,-permanent';
    } else {
        url += '/' + index_hint;
    }
    if (!url.endsWith('/')) {
        url += '/';
    }
    url += '_search';
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepSearchUrl', url);
    }
    return url;
};
const skyrepoSearch = async function (q, urlRemainder, start, size, sort, track_scores, index_hint, originalSize, ids) {
    const searchParameters = await (searchObj).call(this, q, start, size, sort, track_scores);
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepSearch', JSON.stringify(searchParameters));
    }
    const results = await httpPost(searchParameters, searchUrl(urlRemainder, index_hint), 'application/json', false, null, null, true, elasticHeaders());

    if (results == null) {
        error('An unknown error has occurred. If using the \'start\' parameter, request may be out of bounds.', 500);
    }
    if ((results)['error'] != null) {
        const root_cause = ((results)['error'])['root_cause'];
        if (root_cause.length > 0) {
            const reasonObj = root_cause[0];
            const reason = (reasonObj)['reason'];
            if (reason != null) {
                error(reason, (results)['status']);
            }
        }
    }
    const hits = ((results)['hits'])['hits'];
    let searchResults = [];
    if (ids != null) {
        try {
            await (signatureSheet).call(this);
            searchResults = await (filterResults).call(this, hits.map((h) => h._source), true);
            global.events.data.found.next(searchResults, this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()))
            global.events.data.any.next(searchResults, this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()))
            searchResults = searchResults.map((x) => x['@id']).filter(x => x);
        } catch (ex) {
            if (ex.toString().indexOf('Signature Violation') != -1) {
                throw ex;
            }
            global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.ERROR, 'SkyrepManyGetParsedError', ex);
        }
    } else {
        for (let i = 0; i < hits.length; i++) {
            const searchResult = hits[i];
            const type = inferTypeFromObj((searchResult)['_source'], null);
            if (type == null) {
                hits.splice(i--, 1); // NOSONAR -- Valid method of filtering.
                continue;
            }
            const id = (searchResult)['_id'];
            let hit = '';
            if (type != null) {
                hit += type + '/';
            }
            hit += id;
            hits[i] = hit;
        }
        searchResults = (await endpointManyGet.call({ ctx: this.ctx, params: { objs: hits }, dataStreams: this.dataStreams })).filter(x => x);
    }
    // If we don't have enough results, and our search hit enough results, and we're not at the size limit, try again with max size.
    originalSize = originalSize || size;
    if (size < 10000 && hits.length >= size && searchResults.length < originalSize) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepPagin8', size, hits.length, searchResults.length);
        return (await skyrepoSearch.call(this, q, urlRemainder, start, Math.min(10000, size + (hits.length * 100 - searchResults.length * 100)), sort, track_scores, index_hint, size, ids)).slice(0, size);
    }
    return searchResults;
};
let queryParse = global.queryParse = function (urlRemainder) {
    if (urlRemainder == null && this.params.urlRemainder != null) {
        urlRemainder = this.params.urlRemainder;
    }
    if (urlRemainder == null) {
        error('No resource specified.', 404);
    }
    const split = urlRemainder.split('/');
    const result = {};
    if (split.length >= 1) {
        (result)['id'] = split[0];
    }
    if (split.length >= 2) {
        (result)['type'] = split[0] == '' ? null : split[0];
        (result)['id'] = split[1];
    }
    if (split.length == 3) {
        (result)['version'] = split[2] == '' ? null : parseInt(split[2]);
    }
    return result;
};
const tryFormatOutput = function (o, expand) {
    const hdrs = (headers).call(this);
    let accept = (hdrs)['Accept'];
    if (accept == null) {
        accept = (hdrs)['accept'];
    }
    if (accept == null) {
        if (expand == true) {
            return JSON.stringify(jsonLdExpand(o));
        } else {
            return JSON.stringify(o);
        }
    }
    if (accept == 'text/n4' || accept == 'application/rdf+n4') {
        return jsonLdToNQuads(o);
    }
    if (accept == 'application/rdf+xml') {
        return jsonLdToRdfXml(o);
    }
    if (accept == 'application/x-turtle' || accept == 'text/turtle') {
        return jsonLdToTurtle(o);
    }
    return JSON.stringify(o);
};
const endpointData = async function () {
    let q = this.params.q;
    const urlRemainder = this.params.urlRemainder;
    let start = 0;
    if (this.params.start !== undefined) {
        if (this.params.start != null) {
            start = parseInt(this.params.start);
        }
    }
    let size = 50;
    if (this.params.size !== undefined) {
        if (this.params.size != null) {
            size = parseInt(this.params.size);
        }
    }
    if (this.params.refresh !== undefined) {
        if (this.params.refresh != null) {
            this.ctx.put('refresh', this.params.refresh);
        }
    }
    let sort = this.params.sort;
    let track_scores = this.params.track_scores;
    let index_hint = this.params.index_hint;
    let history = this.params.history;
    let ids = this.params.ids;
    let searchParams = (fileFromDatastream).call(this, 'searchParams', null);
    if (searchParams != null) {
        searchParams = fileToString(searchParams);
        if (searchParams !== undefined) {
            if (searchParams != null) {
                searchParams = JSON.parse(searchParams);
            }
        }
        if ((searchParams)['q'] != undefined) {
            if ((searchParams)['q'] != null) {
                q = (searchParams)['q'];
            }
        }
        if ((searchParams)['start'] != undefined) {
            if ((searchParams)['start'] != null) {
                start = (searchParams)['start'];
            }
        }
        if ((searchParams)['size'] != undefined) {
            if ((searchParams)['size'] != null) {
                size = (searchParams)['size'];
            }
        }
        if ((searchParams)['sort'] != undefined) {
            if ((searchParams)['sort'] != null) {
                sort = (searchParams)['sort'];
            }
        }
        if ((searchParams)['track_scores'] != undefined) {
            if ((searchParams)['track_scores'] != null) {
                track_scores = (searchParams)['track_scores'];
            }
        }
        if ((searchParams)['index_hint'] != undefined) {
            if ((searchParams)['index_hint'] != null) {
                index_hint = (searchParams)['index_hint'];
            }
        }
        if ((searchParams)['history'] != undefined) {
            if ((searchParams)['history'] != null) {
                history = (searchParams)['history'];
            }
        }
        if ((searchParams)['ids'] != undefined) {
            if ((searchParams)['ids'] != null) {
                ids = (searchParams)['ids'];
            }
        }
    }
    if (size === undefined || size == null) {
        size = 50;
    }
    if (start === undefined || start == null) {
        start = 0;
    }
    if (q !== undefined && q != null) {
        return JSON.stringify(await (skyrepoSearch).call(this, q, urlRemainder, start, size, sort, track_scores, index_hint, null, ids));
    }
    const methodType = this.params.methodType;
    const parseParams = (queryParse).call(this, urlRemainder, null);
    const id = (parseParams)['id'];
    const type = (parseParams)['type'];
    const version = (parseParams)['version'];
    if (methodType == 'DELETE') {
        const oldObj = await (skyrepoDelete).call(this, id, version, type);
        if (oldObj == null) {
            return null;
        }
        global.events.database.afterSave.next(oldObj);
        return null;
    } else if (methodType == 'POST') {
        let o = (fileFromDatastream).call(this, 'data', null);
        if (o !== undefined && o != null) {
            o = JSON.parse(fileToString(o));
        }
        if (o == null || o == '') {
            o = await (skyrepoGetParsed).call(this, id, version, type, null, history);
            if (o == null) {
                error(objectNotFoundError, 404);
            }
            let expand = this.params.expand != null;
            o = (tryFormatOutput).call(this, o, expand, null);
            return o;
        }
        await (skyrepoPutParsed).call(this, o, id, version, type);
        global.events.database.afterSave.next(o);
        return null;
    } else if (methodType == 'GET') {
        let o = await (skyrepoGetParsed).call(this, id, version, type, null, history);
        if (o == null) {
            error(objectNotFoundError, 404);
        }
        let expand = this.params.expand != null;
        o = (tryFormatOutput).call(this, o, expand, null);
        return o;
    }
    return null;
};
/**
 * @openapi
 * /api/data/:
 *   get:
 *     tags:
 *       - Search
 *     description: Searches for data in the system.
 *     parameters:
 *       - $ref: '#/components/parameters/q'
 *       - $ref: '#/components/parameters/start'
 *       - $ref: '#/components/parameters/size'
 *       - $ref: '#/components/parameters/index_hint'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JsonLdArray'
 *   post:
 *     tags:
 *       - Search
 *     description: Searches for data in the system.
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/SearchParams'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JsonLdArray'
 * /api/data/{uid}:
 *   get:
 *     tags:
 *       - Repository
 *     description: Retrieves data from the system.
 *     parameters:
 *       - $ref: '#/components/parameters/uid'
 *       - $ref: '#/components/parameters/history'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *               - $ref: '#/components/schemas/JsonLd'
 *               - $ref: '#/components/schemas/JsonLdHistory'
 *       404:
 *         description: "Failure to locate data due to permission or absence of data."
 *   post:
 *     tags:
 *       - Repository
 *     description: Puts data into the system.
 *     parameters:
 *       - $ref: '#/components/parameters/uid'
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 $ref: '#/components/schemas/JsonLd'
 *               signatureSheet:
 *                 $ref: '#/components/schemas/SignatureSheet'
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: "Failure to locate data due to permission or absence of data."
 * /api/data/{type}/{uid}:
 *   get:
 *     tags:
 *       - Repository
 *     description: Searches for data in the system.
 *     parameters:
 *       - $ref: '#/components/parameters/uid'
 *       - $ref: '#/components/parameters/type'
 *       - $ref: '#/components/parameters/history'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *               - $ref: '#/components/schemas/JsonLd'
 *               - $ref: '#/components/schemas/JsonLdHistory'
 *       404:
 *         description: "Failure to locate data due to permission or absence of data."
 * /api/data/{type}/{uid}/{version}:
 *   get:
 *     tags:
 *       - Repository
 *     description: Searches for data in the system.
 *     parameters:
 *       - $ref: '#/components/parameters/type'
 *       - $ref: '#/components/parameters/uid'
 *       - $ref: '#/components/parameters/version'
 *       - $ref: '#/components/parameters/history'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *               - $ref: '#/components/schemas/JsonLd'
 *               - $ref: '#/components/schemas/JsonLdHistory'
 *       404:
 *         description: "Failure to locate data due to permission or absence of data."
 */
bindWebService('/data/*', endpointData);
const endpointMultiGet = async function () {
    let ary = JSON.parse(fileToString((fileFromDatastream).call(this, 'data', null)));
    let idsFlag = fileToString((fileFromDatastream).call(this, 'ids', null));
    const lookup = {};
    const mget = {};
    const docs = [];
    (mget)['docs'] = docs;
    for (let i = 0; i < ary.length; i++) {
        const urlRemainder = ary[i].replace('data/', '');
        const parseParams = (queryParse).call(this, urlRemainder, null);
        const id = (parseParams)['id'];
        (lookup)[id] = urlRemainder;
        const version = (parseParams)['version'];
        const p = {};
        (p)['_index'] = 'permanent';
        if (elasticSearchVersion().startsWith('8.')) {
            // Don't multiget with _type
        } else
            if (elasticSearchVersion().startsWith('7.')) {
                (p)['_type'] = '_doc';
            } else {
                (p)['_type'] = 'permanent';
            }
        (p)['_id'] = id + '.' + (version == null ? '' : version);
        docs.push(p);
    }
    const response = await httpPost(mget, elasticEndpoint + '/_mget', 'application/json', false, null, null, true, elasticHeaders());
    const resultDocs = (response)['docs'];
    let results = [];
    if (resultDocs != null) {
        for (let i = 0; i < resultDocs.length; i++) {
            const doc = resultDocs[i];
            if ((doc)['found']) {
                delete (lookup)[((doc)['_id']).substring(0, ((doc)['_id']).indexOf('.'))];
                results.push(JSON.parse(((doc)['_source'])['data']));
            }
        }
    }
    await (signatureSheet).call(this);
    await (filterResults).call(this, results, idsFlag != null ? true : null);
    ary = EcObject.keys(lookup);
    for (let i = 0; i < ary.length; i++) {
        ary[i] = (lookup)[ary[i]];
    }
    if (ary != null) {
        const me = this;
        const forEachResults = [];
        while (ary.length > 0)
            forEachResults.push(...await Promise.all(ary.splice(0, 100).map(function (hit) {
                return endpointSingleGet.call({ ctx: me.ctx, params: { obj: hit }, dataStreams: me.dataStreams }, idsFlag != null ? true : null);
            })));
        for (let i = 0; i < forEachResults.length; i++) {
            if (forEachResults[i] != null) {
                results.push(forEachResults[i]);
            }
        }
    }
    if (idsFlag != null ? true : false) {
        results = results.map((x) => x['@id']);
    }
    return JSON.stringify(results);
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

            if (elasticSearchVersion().startsWith('7.') || elasticSearchVersion().startsWith('8.')) {
                permNoIndex.enabled = false;
            } else {
                (permNoIndex)['permanent'] = doc;
            }
            (doc)['enabled'] = false;
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
const endpointSingleGet = async function (dontDecrypt) {
    const urlRemainder = this.params.obj;
    const parseParams = (queryParse).call(this, urlRemainder, null);
    const id = (parseParams)['id'];
    const type = (parseParams)['type'];
    const version = (parseParams)['version'];
    const o = await (skyrepoGetParsed).call(this, id, version, type, dontDecrypt, null);
    if (o != null) {
        return o;
    }
    return null;
};
const endpointManyGet = async function () {
    const manyParseParams = [];
    for (const urlRemainder of this.params.objs) {
        const parseParams = (queryParse).call(this, urlRemainder, null);
        manyParseParams.push(parseParams);
    }
    if (manyParseParams.length == 0) {
        return [];
    }
    const o = await (skyrepoManyGetParsed).call(this, manyParseParams);
    if (o != null) {
        return o;
    }
    return null;
};
const skyRepoSearch = async function () {
    let q = this.params.q;
    const urlRemainder = this.params.urlRemainder;
    let start = 0;
    if (this.params.start != undefined) {
        if (this.params.start != null) {
            start = parseInt(this.params.start);
        }
    }
    let size = 50;
    if (this.params.size != undefined) {
        if (this.params.size != null) {
            size = parseInt(this.params.size);
        }
    }
    let sort = this.params.sort;
    let track_scores = this.params.track_scores;
    let index_hint = this.params.index_hint;
    let ids = this.params.ids;
    const searchParams = JSON.parse(fileToString((fileFromDatastream).call(this, 'searchParams', null)));
    if (searchParams != null) {
        if ((searchParams)['q'] != undefined) {
            if ((searchParams)['q'] != null) {
                q = (searchParams)['q'];
            }
        }
        if ((searchParams)['start'] != undefined) {
            if ((searchParams)['start'] != null) {
                start = (searchParams)['start'];
            }
        }
        if ((searchParams)['size'] != undefined) {
            if ((searchParams)['size'] != null) {
                size = (searchParams)['size'];
            }
        }
        if ((searchParams)['sort'] != undefined) {
            if ((searchParams)['sort'] != null) {
                sort = (searchParams)['sort'];
            }
        }
        if ((searchParams)['track_scores'] != undefined) {
            if ((searchParams)['track_scores'] != null) {
                track_scores = (searchParams)['track_scores'];
            }
        }
        if ((searchParams)['index_hint'] != undefined) {
            if ((searchParams)['index_hint'] != null) {
                index_hint = (searchParams)['index_hint'];
            }
        }
        if ((searchParams)['ids'] != undefined) {
            if ((searchParams)['ids'] != null) {
                ids = (searchParams)['ids'];
            }
        }
    }
    const data = fileToString((fileFromDatastream).call(this, 'data', null));
    if (data !== undefined && data != null && data != '') {
        q = data;
    }
    if (q === undefined || q == null || q == '') {
        q = '*';
    }
    return JSON.stringify(await (skyrepoSearch).call(this, q, urlRemainder, start, size, sort, track_scores, index_hint, null, ids));
};
/**
 * @openapi
 * /api/sky/repo/search:
 *   get:
 *     tags:
 *       - Search
 *     deprecated: true
 *     description: Searches for data in the system.
 *     parameters:
 *       - $ref: '#/components/parameters/q'
 *       - $ref: '#/components/parameters/start'
 *       - $ref: '#/components/parameters/size'
 *       - $ref: '#/components/parameters/index_hint'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JsonLdArray'
 *   post:
 *     tags:
 *       - Search
 *     deprecated: true
 *     description: Searches for data in the system.
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/SearchParams'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JsonLdArray'
 */
bindWebService('/sky/repo/search', skyRepoSearch);
const endpointAdmin = function () {
    return JSON.stringify(skyrepoAdminList());
};
const skyrepoAdminPk = global.skyrepoAdminPk = function () {
    if (!fs.existsSync('etc/skyAdmin2.pem')) {
        fileSave(EcPpk.fromPem(rsaGenerate()).toPem(), 'etc/skyAdmin2.pem');
    }
    return EcPpk.fromPem(fileToString(fileLoad('etc/skyAdmin2.pem'))).toPk().toPem();
};
const skyrepoAdminList = global.skyrepoAdminList = function () {
    const array = [];
    array.push(skyrepoAdminPk());

    let mayHaveUserAdmins = process.env.AUTH_ALLOW_ENV_ADMINS == "true";
    if (mayHaveUserAdmins) {
        let knownAdminPks = sharedAdminCache.getKnownUserAdminPks();
        for (let userPk of knownAdminPks) {
            array.push(userPk);
        }
    }

    return array;
};
/**
 * @openapi
 * /api/sky/admin:
 *   get:
 *     tags:
 *       - Infrastructure
 *     description: Fetches public key of the admin user. An identity with the corresponding private key will have edit/delete capabilities over all data.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               description: Array of admin public keys
 *               example: ["<public key>"]
 */
bindWebService('/sky/admin', endpointAdmin);
// When CORS_CREDENTIALS is true, inform the cass client that all requests to the urls specified in CORS_ORIGINS should be made with credentials
const getCorsOrigins = function () {
    let corsOrigins;
    if (process.env.CORS_CREDENTIALS != null && process.env.CORS_CREDENTIALS.trim() == 'true' && process.env.CORS_ORIGINS != null) {
        try {
            corsOrigins = process.env.CORS_ORIGINS.split(',').map((x) => x.trim());
        } catch (e) {
            global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.ERROR, 'CorsConfigError', 'Misconfigured CORS_ORIGINS env var, ensure the value is a comma separated list of origins', e);
        }
    }
    return corsOrigins;
};
let realCrypto = require('crypto');
const EcPpk = require('cassproject/src/com/eduworks/ec/crypto/EcPpk');
const pingWithTime = function () {
    if (this.ctx?.req?.eim?.ids)
        global.events.person.doPing(this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()));
    return JSON.stringify({
        ping: 'pong',
        time: new Date().getTime(),
        ssoViaP1: this.ctx.req.p1 ? true : null,
        ssoPublicKey: this.ctx.req.eim ? this.ctx.req.eim.ids[0].ppk.toPk().toPem() : undefined,
        ssoAdditionalPublicKeys: this.ctx.req.eim && this.ctx.req.eim.ids.length ? this.ctx.req.eim.ids.slice(1).map((identity) => identity.ppk.toPk().toPem()) : undefined,
        ssoLogin: this.ctx.req.oidc ? (process.env.CASS_OIDC_BASE_URL || 'http://localhost/') + 'api/login' : undefined,
        ssoLogout: this.ctx.req.oidc ? (process.env.CASS_OIDC_BASE_URL || 'http://localhost/') + 'api/logout' : undefined,
        banner: process.env.CASS_BANNER_MESSAGE ? {
            message: process.env.CASS_BANNER_MESSAGE, // string
            color: process.env.CASS_BANNER_TEXT_COLOR, // valid css color value
            background: process.env.CASS_BANNER_BACKGROUND_COLOR, // valid css color value
        } : undefined,
        motd: process.env.MOTD_MESSAGE ? {
            title: process.env.MOTD_TITLE,
            message: process.env.MOTD_MESSAGE,
        } : undefined,
        plugins: process.env.DEFAULT_PLUGINS ? process.env.DEFAULT_PLUGINS : undefined,
        adminPublicKeys: skyrepoAdminList(),
        corsOrigins: getCorsOrigins(),
        postMaxSize: global.postMaxSize,
        signatureSheetHashAlgorithm: 'SHA-256',
        fips: realCrypto.getFips(),
    });
};
/**
 * @openapi
 * /api/ping:
 *   get:
 *     tags:
 *       - Infrastructure
 *     description: Fetches server parameters along with information about you, if SSO is enabled.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Ping response
 *               additionalProperties: false
 *               required:
 *                 - ping
 *                 - time
 *                 - adminPublicKeys
 *                 - postMaxSize
 *               properties:
 *                 ping:
 *                   type: string
 *                   description: Just a known value for ensuring the response isn't from something else.
 *                   example: pong
 *                 time:
 *                   type: integer
 *                   description: The current number of milliseconds since the Unix epoch, for ensuring signature sheet signing can sign time-nonced signatures that will not be time-desynchronized with the server.
 *                   example: 1674857764808
 *                 ssoViaP1:
 *                   type: boolean
 *                   description: A flag indicating that the user logged in through a Platform One JWT.
 *                   example: true
 *                 ssoPublicKey:
 *                   type: string
 *                   description: When logged in with SSO, the public key of the first key in the keyring.
 *                   example: <public key>
 *                 ssoAdditionalPublicKeys:
 *                   type: array
 *                   description: When logged in with SSO, the public keys of keys past the first in the keyring.
 *                   example: ["<public key>"]
 *                 ssoLogin:
 *                   type: string
 *                   description: When logged in with OIDC (or similar), the URL of the login redirect page, using CASS_OIDC_BASE_URL environment variable for the endpoint.
 *                   example: http://localhost/api/login
 *                 ssoLogout:
 *                   type: string
 *                   description: When logged in with OIDC (or similar), the URL of the logout redirect page, using CASS_OIDC_BASE_URL environment variable for the endpoint.
 *                   example: http://localhost/api/logout
 *                 banner:
 *                   type: object
 *                   required:
 *                     - message
 *                     - color
 *                     - background
 *                   description: If specified in CASS_BANNER_MESSAGE, CASS_BANNER_TEXT_COLOR, CASS_BANNER_BACKGROUND_COLOR environment variables communicated from the server.
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Banner text as specified by CASS_BANNER_MESSAGE environment variable.
 *                       example: <Security markings>
 *                     color:
 *                       type: string
 *                       description: CSS text color as specified by CASS_BANNER_TEXT_COLOR environment variable.
 *                       example: red
 *                     background:
 *                       type: string
 *                       description: CSS background color as specified by CASS_BANNER_BACKGROUND_COLOR environment variable.
 *                       example: yellow
 *                 motd:
 *                   type: object
 *                   description: If specified in MOTD_TITLE, MOTD_MESSAGE environment variables communicated from the server.
 *                   required:
 *                     - message
 *                     - color
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Message of the Day title as specified by MOTD_TITLE environment variable.
 *                       example: Message of the Day
 *                     color:
 *                       type: string
 *                       description: Message of the Day text as specified by MOTD_MESSAGE environment variable.
 *                       example: Have a good day!
 *                 adminPublicKeys:
 *                   type: array
 *                   description: Array of admin public keys
 *                   example: ["<public key>"]
 *                 corsOrigins:
 *                   type: array
 *                   description: For which origins should the cass client include credentials for in its requests.
 *                   example: ["http://localhost"]
 *                 postMaxSize:
 *                   type: number
 *                   description: Max size of fields and files in POST requests that this server can handle in bytes.
 */
bindWebService('/ping', pingWithTime);
/**
 * @openapi
 * /api/sky/repo/multiGet:
 *   post:
 *     tags:
 *       - Repository
 *     description: 'Fetches multiple pieces of data simultaneously. Note, testing this function does not work. See: https://stackoverflow.com/questions/68291244/how-to-format-a-json-array-in-the-request-body-of-a-multipart-form-data-request/68291856#68291856'
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 $ref: '#/components/schemas/MultiGetParams'
 *               signatureSheet:
 *                 $ref: '#/components/schemas/SignatureSheet'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JsonLdArray'
 */
bindWebService('/sky/repo/multiGet', endpointMultiGet);
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
/**
 * @openapi
 * /api/sky/repo/multiDelete:
 *   post:
 *     tags:
 *       - Repository
 *     description: 'Deletes multiple pieces of data simultaneously. See: https://stackoverflow.com/questions/68291244/how-to-format-a-json-array-in-the-request-body-of-a-multipart-form-data-request/68291856#68291856'
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 $ref: '#/components/schemas/MultiGetParams'
 *               signatureSheet:
 *                 $ref: '#/components/schemas/SignatureSheet'
 *     responses:
 *       200:
 *         description: Returns data that was deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JsonLdArray'
 */
// bindWebService('/sky/repo/multiDelete', endpointMultiDelete);
