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
const { skyrepoHistoryInternal } = require('./history');
const getUrl = function (index, id, version, type) {
    let url = elasticEndpoint;
    url += '/' + index;
    if (elasticSearchVersion().startsWith('7.') || elasticSearchVersion().startsWith('8.') || elasticSearchVersion().startsWith('9.')) {
        url += '/_doc';
    } else if (index == 'permanent') {
        url += '/permanent';
    } else {
        const typeFromObj = inferTypeWithoutObj(type);
        url += '/' + typeFromObj;
    }
    if (index == 'permanent') {
        url += '/' + encodeURIComponent(id) + '.' + (version === undefined || version == null ? '' : version);
    } else {
        url += '/' + encodeURIComponent(id);
    }
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepoGetUrl', 'Get:' + url);
    }
    return url;
};

const skyrepoGetIndexInternal = async function (index, id, version, type) {
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepGetIndexInternal', 'Fetching from ' + index + ' : ' + type + ' / ' + id + ' / ' + version);
    }
    const response = await httpGet(getUrl.call(this, index, id, version, type), true, elasticHeaders());
    return response;
};

const skyrepoGetIndexSearch = async function (id, version, type) {
    const microSearchUrl = elasticEndpoint + '/_search?version&q=_id:' + id + '';
    const microSearch = await httpGet(microSearchUrl, true, elasticHeaders());
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepGetIndexSearch', microSearchUrl);
    }
    if (microSearch == null) {
        return null;
    }
    const hitshits = (microSearch)['hits'];
    if (hitshits == null) {
        return null;
    }
    const hits = (hitshits)['hits'];
    if (hits.length == 0) {
        return null;
    }
    const hit = hits[0];
    return hit;
};

const skyrepoGetIndex = async function (id, version, type) {
    if (type !== undefined && type != null && type != '') {
        const result = await skyrepoGetIndexInternal(type.toLowerCase(), id, version, type);
        return result;
    } else {
        return await skyrepoGetIndexSearch(id, version, type);
    }
};

const skyrepoGetPermanent = async function (id, version, type) {
    const result = await skyrepoGetIndexInternal.call(this, 'permanent', id, version, type);
    return result;
};

const skyrepoGetInternal = async function (id, version, type) {
    let result = await skyrepoGetPermanent(id, version, type);
    if (result == null) {
        return null;
    }
    if ((result)['error'] != null) {
        return null;
    }
    if ((result)['found'] == true) {
        return JSON.parse(((result)['_source'])['data']);
    }
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepGetInternal', 'Failed to find ' + type + '/' + id + '/' + version + ' -- trying degraded form from search index.');
    }
    result = await (skyrepoGetIndex).call(this, id, version, type);
    if (result == null) {
        return null;
    }
    if ((result)['error'] != null) {
        return null;
    }
    if ((result)['found'] == true || (result)['_source'] != null) {
        return (result)['_source'];
    }
    return null;
};

const skyrepoGet = async function (parseParams) {
    if (parseParams == null && EcObject.isObject(this.params.obj)) {
        parseParams = this.params.obj;
    }
    if (parseParams == null) {
        parseParams = {};
        parseParams['id'] = this.params.id;
        parseParams['type'] = this.params.type;
        parseParams['version'] = this.params.version;
        parseParams['history'] = this.params.history;
    }
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepGet', JSON.stringify(parseParams));
    }
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepGet', JSON.stringify(this.params.obj));
    }
    const id = parseParams['id'];
    const type = parseParams['type'];
    const version = parseParams['version'];
    const history = parseParams['history'];
    return await (skyrepoGetParsed).call(this, id, version, type, null, history);
};

const skyrepoGetParsed = async function (id, version, type, dontDecrypt, history) {
    let filtered = null;
    if (history == true || history == 'true') {
        filtered = await skyrepoHistoryInternal.call(this, id, version, type);
        filtered = await (filterResults).call(this, filtered, dontDecrypt);
    } else {
        const result = await (skyrepoGetInternal).call(this, id, version, type);
        if (result == null) {
            return null;
        }
        try {
            filtered = await (filterResults).call(this, result, dontDecrypt);
        } catch (ex) {
            if (ex.toString().indexOf('Signature Violation') != -1) {
                throw ex;
            }
        }
    }
    if (filtered == null) {
        return null;
    }
    if (EcObject.keys(filtered).length == 0) {
        return null;
    }
    global.events.data.read.next(filtered, this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()))
    global.events.data.any.next(filtered, this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()))
    return filtered;
};

module.exports = {
    skyrepoGet,
    skyrepoGetParsed,
    skyrepoGetInternal,
    skyrepoGetIndex,
    skyrepoGetIndexInternal,
    skyrepoGetIndexSearch,
    skyrepoGetPermanent
}