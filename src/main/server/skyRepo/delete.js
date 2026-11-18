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
const { isExcludedIndex } = require('./searchUtil');
const { docUrl, writeQuery, debugLog, objectIds, unique, publish, usesDocEndpoint } = require('./common');

const deleteUrl = function (id, version, type) {
    const typeFromObj = inferTypeWithoutObj(type);
    const url = docUrl(typeFromObj.toLowerCase(), typeFromObj, id, writeQuery(this));
    debugLog('SkyrepoDeleteUrl', () => 'Delete:' + url);
    return url;
};

// The latest-version copy in permanent, `<id>.`. The numbered versions are kept as history.
const deletePermanentBaseUrl = function (id) {
    const url = docUrl('permanent', 'permanent', id, '.');
    debugLog('SkyrepoDeletePermBase', () => 'DeletePermanentBase:' + url);
    return url;
};

const skyrepoDeleteInternalIndex = async function (id, version, type) {
    if (isExcludedIndex(type)) {
        return null;
    }
    return await httpDelete(deleteUrl.call(this, id, version, type), elasticHeaders());
};

const skyrepoDeleteInternalPermanent = async function (id, version, type) {
    return await httpDelete(deletePermanentBaseUrl(id), elasticHeaders());
};

// Where deleteUrl sends a type, without the id.
const indexTarget = function (type) {
    const typeFromObj = inferTypeWithoutObj(type);
    return typeFromObj.toLowerCase() + '/' + (usesDocEndpoint() ? '_doc' : typeFromObj);
};

const skyrepoDelete = async function (id, version, type) {
    const oldObj = await validateSignatures.call(this, id, version, type, 'Only an owner of an object may delete it.');
    if (oldObj == null) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.WARNING, 'IndexNoPermanent', "Couldn't find data to delete, removing the index entry.");
        await skyrepoDeleteInternalIndex.call(this, id, version, type);
        return null;
    }
    // The search index entry is under the object's own type, which may not be the type in the URL.
    const types = [type];
    const objectType = inferTypeFromObj(oldObj);
    if (indexTarget(objectType) != indexTarget(type)) {
        types.push(objectType);
    }
    // The deletes are independent of each other, so they are sent together.
    const deletes = [];
    for (const storedId of unique([id, ...objectIds(oldObj)])) {
        for (const indexType of types) {
            deletes.push(skyrepoDeleteInternalIndex.call(this, storedId, version, indexType));
        }
        deletes.push(skyrepoDeleteInternalPermanent.call(this, storedId, version, type));
    }
    await Promise.all(deletes);
    publish(this, ['delete', 'any'], [oldObj]);
    return oldObj;
};

module.exports = {
    skyrepoDeleteInternalIndex,
    skyrepoDeleteInternalPermanent,
    skyrepoDelete,
};
