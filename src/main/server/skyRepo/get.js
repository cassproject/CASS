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
const { skyrepoHistoryInternal } = require('./history');
const { isExcludedIndex, allIndices } = require('./searchUtil');
const { docUrl, searchHits, debugLog, publish } = require('./common');

// In permanent, an object is stored as `<id>.<version>`, and its latest version also as `<id>.`.
const getUrl = function (index, id, version, type) {
    let url;
    if (index == 'permanent') {
        url = docUrl('permanent', 'permanent', id, '.' + (version == null ? '' : version));
    } else {
        url = docUrl(index, inferTypeWithoutObj(type), id);
    }
    debugLog('SkyrepoGetUrl', () => 'Get:' + url);
    return url;
};

const skyrepoGetIndexInternal = async function (index, id, version, type) {
    debugLog('SkyrepGetIndexInternal', () => 'Fetching from ' + index + ' : ' + type + ' / ' + id + ' / ' + version);
    return await httpGet(getUrl(index, id, version, type), true, elasticHeaders());
};

// Finds an object in the search indices by id, when its type (and so its index) is not known.
const skyrepoGetIndexSearch = async function (id, version, type) {
    const microSearchUrl = elasticEndpoint + '/' + allIndices() + '/_search?version&q=_id:' + id + '';
    const microSearch = await httpGet(microSearchUrl, true, elasticHeaders());
    debugLog('SkyrepGetIndexSearch', () => microSearchUrl);
    const hits = searchHits(microSearch);
    return hits == null ? null : hits[0];
};

const skyrepoGetIndex = async function (id, version, type) {
    if (type != null && type != '') {
        if (isExcludedIndex(type)) {
            return null;
        }
        return await skyrepoGetIndexInternal(type.toLowerCase(), id, version, type);
    }
    return await skyrepoGetIndexSearch(id, version, type);
};

const skyrepoGetPermanent = async function (id, version, type) {
    return await skyrepoGetIndexInternal('permanent', id, version, type);
};

// Reads from permanent. When Elasticsearch answers but has no such document, falls back to the copy
// in the search index, which is degraded: it lacks what removeNonIndexables took out.
const skyrepoGetInternal = async function (id, version, type) {
    let result = await skyrepoGetPermanent(id, version, type);
    if (result == null || result['error'] != null) {
        return null;
    }
    if (result['found'] === true) {
        return JSON.parse(result['_source']['data']);
    }
    debugLog('SkyrepGetInternal', () => 'Failed to find ' + type + '/' + id + '/' + version + ' -- trying degraded form from search index.');
    result = await skyrepoGetIndex(id, version, type);
    if (result == null || result['error'] != null) {
        return null;
    }
    if (result['found'] === true || result['_source'] != null) {
        return result['_source'];
    }
    return null;
};

const skyrepoGet = async function (parseParams) {
    if (parseParams == null && EcObject.isObject(this.params.obj)) {
        parseParams = this.params.obj;
    }
    if (parseParams == null) {
        parseParams = {
            id: this.params.id,
            type: this.params.type,
            version: this.params.version,
            history: this.params.history,
        };
    }
    debugLog('SkyrepGet', () => JSON.stringify(parseParams));
    debugLog('SkyrepGet', () => JSON.stringify(this.params.obj));
    return await skyrepoGetParsed.call(this, parseParams['id'], parseParams['version'], parseParams['type'], null, parseParams['history']);
};

const skyrepoGetParsed = async function (id, version, type, dontDecrypt, history) {
    let filtered = null;
    if (Number(history) === 1 || history == 'true') {
        filtered = await skyrepoHistoryInternal.call(this, id, version, type);
        filtered = await filterResults.call(this, filtered, dontDecrypt);
    } else {
        const result = await skyrepoGetInternal.call(this, id, version, type);
        if (result == null) {
            return null;
        }
        try {
            filtered = await filterResults.call(this, result, dontDecrypt);
        } catch (ex) {
            if (ex.toString().indexOf('Signature Violation') != -1) {
                throw ex;
            }
        }
    }
    if (filtered == null || EcObject.keys(filtered).length == 0) {
        return null;
    }
    publish(this, ['read', 'any'], filtered);
    return filtered;
};

module.exports = {
    skyrepoGet,
    skyrepoGetParsed,
    skyrepoGetInternal,
    skyrepoGetIndex,
    skyrepoGetIndexInternal,
    skyrepoGetIndexSearch,
    skyrepoGetPermanent,
};