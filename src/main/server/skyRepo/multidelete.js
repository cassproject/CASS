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
const { objectIds, unique, publish } = require('./common');

const endpointMultiDelete = async function () {
    let ary = JSON.parse(fileToString((fileFromDatastream).call(this, 'data', null))) || [];
    const manyParseParams = {};
    for (const urlRemainder of ary) {
        manyParseParams[urlRemainder] = queryParse.call(this, urlRemainder.replace('data/', ''), null);
    }
    if (Object.values(manyParseParams).length == 0) {
        return [];
    }
    await (signatureSheet).call(this);
    await (requireSignedWrite).call(this);
    const { succeeded: oldObjs } = await validateSignaturesBulk.call(this, manyParseParams, 'Only an owner of an object may delete it.');

    // From the search index, and the latest-version copy in permanent. The numbered versions are kept as history.
    let deleteBody = '';
    for (const oldObj of oldObjs) {
        for (const id of unique(objectIds(oldObj))) {
            deleteBody += `${JSON.stringify({ delete: { _index: inferTypeFromObj(oldObj).toLowerCase(), _id: id } })}\n`;
            deleteBody += `${JSON.stringify({ delete: { _index: 'permanent', _id: id + '.' } })}\n`;
        }
    }
    if (deleteBody.length != 0)
        await httpPost(deleteBody, elasticEndpoint + '/_bulk', 'application/x-ndjson', false, null, null, true, elasticHeaders());
    publish(this, ['delete', 'any'], oldObjs);
    await (filterResults).call(this, oldObjs);
    await httpGet(elasticEndpoint + '/_all/_refresh', true, elasticHeaders());
    return oldObjs;
};


/**
 * @openapi
 * /api/sky/repo/multiDelete:
 *   post:
 *     x-mcp-ignore: true
 *     tags:
 *       - Repository
 *     summary: Delete multiple records simultaneously
 *     description: 'Deletes multiple pieces of data simultaneously. Note, testing this function via LLMs/Swagger often fails due to multipart array format requirements. See: https://stackoverflow.com/questions/68291244'
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