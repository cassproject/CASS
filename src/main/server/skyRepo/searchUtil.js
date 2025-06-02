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
const searchUrl = function (urlRemainder, index_hint) {
    let url = elasticEndpoint;
    if (index_hint != null && index_hint.indexOf('permanent') != -1) {
        index_hint = null;
    }
    if (urlRemainder != null && urlRemainder != '' && urlRemainder != '/') {
        url += urlRemainder.toLowerCase();
    } else if (index_hint == null) {
        url += '/*,-permanent';
    } else {
        url += '/' + index_hint;
    }
    if (!url.endsWith('/')) {
        url += '/';
    }
    url += '_search';
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepSearchUrl', url);
    }
    return url;
};
const searchObj = async function (q, start, size, sort, track_scores) {
    const s = {};
    if (start != null) {
        (s)['from'] = start;
    }
    if (size != null) {
        (s)['size'] = size;
    }
    if (sort != null) {
        (s)['sort'] = JSON.parse(sort);
    }
    (s)['version'] = true;
    const query = {};
    (s)['query'] = query;
    const bool = {};
    (query)['bool'] = bool;
    const must = {};
    (bool)['must'] = must;
    const query_string = {};
    (must)['query_string'] = query_string;
    const signatures = await (signatureSheet).call(this);
    (query_string)['query'] = q;
    if (signatures != null && signatures.length > 0) {
        let q2 = '';
        for (let i = 0; i < signatures.length; i++) {
            if (i > 0) {
                q2 += ' OR ';
            }
            q2 += '"' + signatures[i].owner + '"';
        }
        const should = {};
        (bool)['should'] = should;
        const query_string2 = {};
        (should)['query_string'] = query_string2;
        (query_string2)['query'] = q2;
    }
    return s;
};
module.exports = {
    searchUrl,
    searchObj
}