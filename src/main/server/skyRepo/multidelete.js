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

const endpointManyDelete = async function () {
    const manyParseParams = [];
    for (const urlRemainder of this.params.objs) {
        const parseParams = (queryParse).call(this, urlRemainder, null);
        manyParseParams.push(parseParams);
    }
    if (manyParseParams.length == 0) {
        return [];
    }
    const oldObjs = await (validateSignaturesBulk).call(this, manyParseParams, 'Only an owner of an object may delete it.');
    if (oldObjs == null) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.WARNING, 'IndexNoPermanent', "Couldn't find data to delete, removing the index entry.");
        await skyrepoDeleteInternalIndex.call(this, id, version, type);
        return null;
    }
    const ids = [id];
    if (oldObjs.id != null && oldObjs.getGuid() != null) {
        ids.push(oldObjs.getGuid());
    };
    if (oldObjs.id != null && oldObjs.shortId() != null) {
        ids.push(EcCrypto.md5(oldObjs.shortId()));
    }
    EcArray.removeDuplicates(ids);
    if (oldObjs != null) {
        for (const id of ids) {
            await skyrepoDeleteInternalIndex.call(this, id, version, type);
            await skyrepoDeleteInternalIndex.call(this, id, version, inferTypeFromObj(oldObjs));
            await skyrepoDeleteInternalPermanent.call(this, id, version, type);
        }
    } else {
        error('Can\'t find object to delete', 401);
    }
    global.events.data.delete.next([oldObjs], this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()))
    global.events.data.any.next([oldObjs], this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()))
    return oldObjs;
};

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