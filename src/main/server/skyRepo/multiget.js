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

    const docs = [];
    for (let {id,version} of manyParseParams) {
        const p = {
            '_index': index,
            '_id': id + '.' + (version == null ? '' : version)
        };
        if (elasticSearchVersion().startsWith('8.')) {
            // Don't multiget with _type
        } else if (elasticSearchVersion().startsWith('7.')) {
            (p)['_type'] = '_doc';
        } else {
            (p)['_type'] = index;
        }
        docs.push(p);
    }

    return await httpPost({ docs }, elasticEndpoint + '/_mget', 'application/json', false, null, null, true, elasticHeaders());
};
const skyrepoManyGetIndexSearch = async function (ary) {
    let results = [];
    while (ary.length > 0) {
        let batch = ary.splice(0, 10);

        let microSearchUrl = elasticEndpoint + '/_search?version&q=';
        microSearchUrl += batch.map(x=>`_id:"${x.id}"`).join(" OR ");

        const microSearch = await httpGet(microSearchUrl, true, elasticHeaders());
        if (microSearch.error) 
            throw new Error(microSearch.error.reason);
        if (global.skyrepoDebug) {
            global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepManyGetIndexSearch', microSearchUrl);
        }
        results.push(...(microSearch?.hits?.hits || []));
    }
    return results;
};

const skyrepoManyGetPermanent = async function (manyParseParams) {
    return await skyrepoManyGetIndexInternal.call(this, 'permanent', manyParseParams);
};

let skyrepoManyGetInternal = async function (manyParseParams) {
    let response = await skyrepoManyGetPermanent(manyParseParams);

    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepMGStuff', response);
    }

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

    if (global.skyrepoDebug && notFoundInPermanent.length > 0) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepManyGetInternal', 'Failed to find ' + JSON.stringify(notFoundInPermanent) + ' -- trying degraded form from search index.');
    }

    response = await skyrepoManyGetIndexSearch.call(this, notFoundInPermanent);

    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepManyGetInternal', 'Index get - ' + JSON.stringify(response));
    }

    results.push(...(response || []).map(doc=>doc['_source']));
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
    const parseParams = queryParse.call(this, urlRemainder, null);
    const id = parseParams['id'];
    const type = parseParams['type'];
    const version = parseParams['version'];
    const o = await (skyrepoGetParsed).call(this, id, version, type, dontDecrypt, null);
    if (o != null) {
        return o;
    }
    return null;
};

const endpointManyGet = async function () {
    const manyParseParams = [];
    for (const urlRemainder of this.params.objs) {
        const parseParams = queryParse.call(this, urlRemainder, null);
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
        const parseParams = queryParse.call(this, urlRemainder, null);
        const id = parseParams['id'];
        lookup[id] = urlRemainder;
        const version = parseParams['version'];
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
            if (doc['found']) {
                delete lookup[doc['_id'].substring(0, doc['_id'].indexOf('.'))];
                results.push(JSON.parse(doc['_source']['data']));
            }
        }
    }
    await (signatureSheet).call(this);
    await (filterResults).call(this, results, idsFlag != null ? true : null);
    ary = EcObject.keys(lookup);
    for (let i = 0; i < ary.length; i++) {
        ary[i] = lookup[ary[i]];
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
    // skyrepoManyGetIndex,
    // skyrepoManyGetPermanent,
    skyrepoManyGetInternal,
    // endpointSingleGet,
    endpointManyGet
};