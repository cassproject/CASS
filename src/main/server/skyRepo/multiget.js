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
const { skyrepoGetParsed } = require('./get');
const { allIndices } = require('./searchUtil');
const { mgetDoc, debugLog, publish } = require('./common');

// Fetches many documents by id in one request. In permanent, ids are `<id>.<version>`, with `<id>.`
// for the latest version.
const skyrepoManyGetIndexInternal = async function (index, manyParseParams) {
    debugLog('SkyrepManyGetIndexInternal', () => 'Fetching from ' + index + ' : ' + manyParseParams.length);
    const docs = manyParseParams.map(({ id, version }) => mgetDoc(index, id + '.' + (version == null ? '' : version)));
    return await httpPost({ docs }, elasticEndpoint + '/_mget', 'application/json', false, null, null, true, elasticHeaders());
};

// Finds objects in the search indices by id, ten at a time. Empties the array it is given.
const skyrepoManyGetIndexSearch = async function (ary) {
    let results = [];
    while (ary.length > 0) {
        let batch = ary.splice(0, 10);

        let microSearchUrl = elasticEndpoint + '/' + allIndices() + '/_search?version&q=';
        microSearchUrl += batch.map(x => `_id:"${x.id}"`).join(" OR ");

        const microSearch = await httpGet(microSearchUrl, true, elasticHeaders());
        if (microSearch.error)
            throw new Error(microSearch.error.reason);
        debugLog('SkyrepManyGetIndexSearch', () => microSearchUrl);
        results.push(...(microSearch?.hits?.hits || []));
    }
    return results;
};

const skyrepoManyGetPermanent = async function (manyParseParams) {
    return await skyrepoManyGetIndexInternal.call(this, 'permanent', manyParseParams);
};

// Reads many objects from permanent, falling back to the search index copy of those not found there.
let skyrepoManyGetInternal = async function (manyParseParams) {
    let response = await skyrepoManyGetPermanent(manyParseParams);
    debugLog('SkyrepMGStuff', () => response);

    let resultDocs = response.docs;
    const results = [];
    const notFoundInPermanent = [];
    if (resultDocs != null) {
        for (let i = 0; i < resultDocs.length; i++) {
            let doc = resultDocs[i];
            if (doc.found) {
                results.push(JSON.parse(doc['_source']['data']));
            } else {
                notFoundInPermanent.push(manyParseParams[i]);
            }
        }
    }

    if (notFoundInPermanent.length > 0) {
        debugLog('SkyrepManyGetInternal', () => 'Failed to find ' + JSON.stringify(notFoundInPermanent) + ' -- trying degraded form from search index.');
    }

    response = await skyrepoManyGetIndexSearch.call(this, notFoundInPermanent);
    debugLog('SkyrepManyGetInternal', () => 'Index get - ' + JSON.stringify(response));

    results.push(...(response || []).map(doc => doc['_source']));
    return results;
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
    publish(this, ['read', 'any'], filtered);
    return filtered;
};

const endpointSingleGet = async function (dontDecrypt) {
    const parseParams = queryParse.call(this, this.params.obj, null);
    return await skyrepoGetParsed.call(this, parseParams['id'], parseParams['version'], parseParams['type'], dontDecrypt, null);
};

const endpointManyGet = async function () {
    const manyParseParams = this.params.objs.map((urlRemainder) => queryParse.call(this, urlRemainder, null));
    if (manyParseParams.length == 0) {
        return [];
    }
    return await skyrepoManyGetParsed.call(this, manyParseParams);
};

const endpointMultiGet = async function () {
    let ary = JSON.parse(fileToString((fileFromDatastream).call(this, 'data', null))) || [];
    let idsFlag = fileToString((fileFromDatastream).call(this, 'ids', null));
    // Everything asked for, by id. What permanent has is taken off; the rest is fetched one by one.
    const lookup = {};
    const manyParseParams = [];
    for (const entry of ary) {
        const urlRemainder = entry.replace('data/', '');
        const parseParams = queryParse.call(this, urlRemainder, null);
        lookup[parseParams['id']] = urlRemainder;
        manyParseParams.push(parseParams);
    }
    const response = await skyrepoManyGetPermanent(manyParseParams);
    let results = [];
    for (const doc of response['docs'] || []) {
        if (doc['found']) {
            delete lookup[doc['_id'].substring(0, doc['_id'].indexOf('.'))];
            results.push(JSON.parse(doc['_source']['data']));
        }
    }
    await (signatureSheet).call(this);
    await (filterResults).call(this, results, idsFlag != null ? true : null);
    ary = Object.values(lookup);
    const forEachResults = [];
    while (ary.length > 0)
        forEachResults.push(...await Promise.all(ary.splice(0, 100).map((hit) => {
            return endpointSingleGet.call({ ctx: this.ctx, params: { obj: hit }, dataStreams: this.dataStreams }, idsFlag != null ? true : null);
        })));
    for (const result of forEachResults) {
        if (result != null) {
            results.push(result);
        }
    }
    if (idsFlag != null) {
        results = results.map((x) => x['@id']);
    }
    return JSON.stringify(results);
};
/**
 * @openapi
 * /api/sky/repo/multiGet:
 *   post:
 *     x-mcp-ignore: true
 *     tags:
 *       - Repository
 *     summary: Fetch multiple records simultaneously
 *     description: 'Fetches multiple pieces of data simultaneously. Note, testing this function via LLMs/Swagger often fails due to multipart array format requirements. See: https://stackoverflow.com/questions/68291244'
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

module.exports = {
    // skyrepoManyGetParsed,
    skyrepoManyGetIndexInternal,
    // skyrepoManyGetIndexSearch,
    // skyrepoManyGetIndex,
    skyrepoManyGetPermanent,
    skyrepoManyGetInternal,
    // endpointSingleGet,
    endpointManyGet
};