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
const { searchUrl, searchObj } = require('./searchUtil');
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

module.exports = {
    // skyRepoSearch,
    // searchUrl,
    searchObj,
    skyrepoSearch
}