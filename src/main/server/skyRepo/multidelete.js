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

const endpointMultiDelete = async function () {
    let ary = JSON.parse(fileToString((fileFromDatastream).call(this, 'data', null)));
    const manyParseParams = {};
    for (const urlRemainder of ary) {
        manyParseParams[urlRemainder] = queryParse.call(this, urlRemainder.replace('data/', ''), null);
    }
    if (Object.values(manyParseParams).length == 0) {
        return [];
    }
    await (signatureSheet).call(this);
    const {succeeded: oldObjs,failed} = await validateSignaturesBulk.call(this, manyParseParams, 'Only an owner of an object may delete it.');
    
    let deleteBody = '';
    for (let oldObj of oldObjs) {
        let ids = [];
        if (oldObj.id != null && oldObj.getGuid() != null) {
            ids.push(oldObj.getGuid());
        };
        if (oldObj.id != null && oldObj.shortId() != null) {
            ids.push(EcCrypto.md5(oldObj.shortId()));
        }
        EcArray.removeDuplicates(ids);
        if (oldObj != null) {
            for (const id of ids) {
                deleteBody += `${JSON.stringify({ delete: { _index: inferTypeFromObj(oldObj).toLowerCase(), _id: id } })}\n`;
                deleteBody += `${JSON.stringify({ delete: { _index: 'permanent', _id: id+'.' } })}\n`;
            }
        } else {
            error('Can\'t find object to delete', 401);
        }
    }
    let deleteResponse = [];
    if (deleteBody.length != 0)
        deleteResponse = await httpPost(deleteBody, elasticEndpoint + '/_bulk', 'application/x-ndjson', false, null, null, true, elasticHeaders());
    global.events.data.delete.next(oldObjs, this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()))
    global.events.data.any.next(oldObjs, this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()))
    await (filterResults).call(this, oldObjs);
    await httpGet(elasticEndpoint + '/_all/_refresh', true, elasticHeaders());
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
bindWebService('/sky/repo/multiDelete', endpointMultiDelete);