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
const { endpointManyGet } = require("./multiget");
const { searchUrl, searchObj, readSearchParams } = require('./searchUtil');
const { debugLog, publish } = require('./common');

const MAX_SEARCH_SIZE = 10000;

const skyrepoSearch = async function (q, urlRemainder, start, size, sort, track_scores, index_hint, originalSize, ids) {
    const searchParameters = await searchObj.call(this, q, start, size, sort, track_scores);
    debugLog('SkyrepSearch', () => JSON.stringify(searchParameters));
    const results = await httpPost(searchParameters, searchUrl(urlRemainder, index_hint), 'application/json', false, null, null, true, elasticHeaders());

    if (results == null) {
        error('An unknown error has occurred. If using the \'start\' parameter, request may be out of bounds.', 500);
    }
    if (results['error'] != null) {
        const root_cause = results['error']['root_cause'];
        if (root_cause.length > 0 && root_cause[0]['reason'] != null) {
            error(root_cause[0]['reason'], results['status']);
        }
    }
    const hits = results['hits']['hits'];
    // How many hits count towards a full page: all of them, or with full objects, those that have a type.
    let hitCount = hits.length;
    let searchResults = [];
    if (ids != null) {
        // Only ids are wanted, so the search index copies are enough to check who may see them.
        try {
            await signatureSheet.call(this);
            searchResults = await filterResults.call(this, hits.map((h) => h._source), true);
            publish(this, ['found', 'any'], searchResults);
            searchResults = searchResults.map((x) => x['@id']).filter(Boolean);
        } catch (ex) {
            if (ex.toString().indexOf('Signature Violation') != -1) {
                throw ex;
            }
            global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.ERROR, 'SkyrepManyGetParsedError', ex);
        }
    } else {
        // Full objects are wanted, so fetch each hit from permanent as type/id.
        const urls = [];
        for (const hit of hits) {
            const type = inferTypeFromObj(hit['_source'], null);
            if (type != null) {
                urls.push(type + '/' + hit['_id']);
            }
        }
        hitCount = urls.length;
        searchResults = (await endpointManyGet.call({ ctx: this.ctx, params: { objs: urls }, dataStreams: this.dataStreams })).filter(Boolean);
    }
    // If we don't have enough results, and our search hit enough results, and we're not at the size limit, try again with max size.
    originalSize = originalSize || size;
    if (size < MAX_SEARCH_SIZE && hitCount >= size && searchResults.length < originalSize) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepPagin8', size, hitCount, searchResults.length);
        const larger = Math.min(MAX_SEARCH_SIZE, size + (hitCount * 100 - searchResults.length * 100));
        return (await skyrepoSearch.call(this, q, urlRemainder, start, larger, sort, track_scores, index_hint, size, ids)).slice(0, size);
    }
    return searchResults;
};

const skyRepoSearch = async function () {
    const searchParams = JSON.parse(fileToString(fileFromDatastream.call(this, 'searchParams', null)));
    const p = readSearchParams(this.params, searchParams, ['q', 'start', 'size', 'sort', 'track_scores', 'index_hint', 'ids']);
    const data = fileToString(fileFromDatastream.call(this, 'data', null));
    if (data != null && data != '') {
        p.q = data;
    }
    if (p.q == null || p.q == '') {
        p.q = '*';
    }
    return JSON.stringify(await skyrepoSearch.call(this, p.q, this.params.urlRemainder, p.start, p.size, p.sort, p.track_scores, p.index_hint, null, p.ids));
};

/**
 * @openapi
 * /api/sky/repo/search:
 *   get:
 *     x-mcp-ignore: true
 *     tags:
 *       - Search
 *     deprecated: true
 *     summary: Search for data (deprecated)
 *     description: Legacy endpoint to search for data in the CaSS repository. Deprecated in favor of the /api/data endpoint.
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
 *     x-mcp-ignore: true
 *     tags:
 *       - Search
 *     deprecated: true
 *     summary: Search for data (deprecated)
 *     description: Legacy endpoint to search for data in the CaSS repository using POST. Deprecated in favor of the /api/data endpoint.
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

module.exports = {
    // skyRepoSearch,
    // searchUrl,
    searchObj,
    skyrepoSearch
}