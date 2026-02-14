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
const deleteUrl = function (id, version, type) {
    const typeFromObj = inferTypeWithoutObj(type);
    let refreshPart = 'refresh=true';
    if (this.ctx.get('refresh') !== undefined && this.ctx.get('refresh') != null) {
        refreshPart = 'refresh=' + this.ctx.get('refresh');
    }
    let url = elasticEndpoint;
    url += '/' + typeFromObj.toLowerCase();
    if (elasticSearchVersion().startsWith('7.') || elasticSearchVersion().startsWith('8.') || elasticSearchVersion().startsWith('9.')) {
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
    if (elasticSearchVersion().startsWith('7.') || elasticSearchVersion().startsWith('8.') || elasticSearchVersion().startsWith('9.')) {
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

const skyrepoDeleteInternalIndex = async function (id, version, type) {
    const url = deleteUrl.call(this, id, version, type);
    return await httpDelete(url, elasticHeaders());
};

const skyrepoDeleteInternalPermanent = async function (id, version, type) {
    const url = deletePermanentBaseUrl(id, version, type);
    return await httpDelete(url, elasticHeaders());
};

const skyrepoDelete = async function (id, version, type) {
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

module.exports = {
    // deleteUrl,
    // deletePermanentBaseUrl,
    skyrepoDeleteInternalIndex,
    skyrepoDeleteInternalPermanent,
    skyrepoDelete,
    // endpointManyDelete
};