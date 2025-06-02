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
const { skyrepoGetParsed } = require('./get');
const { searchUrl, searchObj } = require('./searchUtil');

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

const skyrepoManyGetIndex = async function (manyParseParams) {
    return await skyrepoManyGetIndexSearch(manyParseParams);
};

const skyrepoManyGetPermanent = async function (manyParseParams) {
    const result = await skyrepoManyGetIndexInternal.call(this, 'permanent', manyParseParams);
    return result;
};

let skyrepoManyGetInternal = async function (manyParseParams) {
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

module.exports = {
    // skyrepoManyGetParsed,
    skyrepoManyGetIndexInternal,
    // skyrepoManyGetIndexSearch,
    skyrepoManyGetIndexRecords,
    // skyrepoManyGetIndex,
    // skyrepoManyGetPermanent,
    skyrepoManyGetInternal,
    // endpointSingleGet,
    endpointManyGet
};