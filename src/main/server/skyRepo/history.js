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
const { debugLog } = require('./common');

const skyrepoHistoryPermanent = async function (id, version, type) {
    // Matches on the indexed baseId field written by skyrepoPutInternalPermanent.
    // This previously scripted over doc['_id'], which required fielddata on the
    // _id metadata field: deprecated since 7.6, gated behind the
    // indices.id_field_data.enabled cluster setting, and rejected outright by
    // newer Elasticsearch even when that setting is enabled. A term query on a
    // real keyword field needs no fielddata, and does not scan every document.
    const query = {
        'size': 10000,
        'query': {
            'term': {
                'baseId': `${id}`,
            },
        },
    };
    const historyUrl = elasticEndpoint + '/permanent/_search';
    const history = await httpPost(query, historyUrl, 'application/json', null, null, null, null, elasticHeaders());
    return history;
};

const skyrepoHistoryInternal = async function (id, version, type) {
    const result = await skyrepoHistoryPermanent(id, version, type);
    if (result == null) {
        return null;
    }
    if ((result)['error'] != null) {
        // Logged rather than silently swallowed: an Elasticsearch-side failure
        // here is otherwise indistinguishable from "no history exists", and
        // reaches the caller as a null with no explanation.
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.ERROR, 'SkyrepoHistoryError', 'History query failed for ' + id + ': ' + JSON.stringify((result)['error']));
        return null;
    }
    if ((result).hits.total.value > 0) {
        // Each stored version is parsed once. Its time is the timestamp in its id, or failing that
        // when it was written.
        const versions = result.hits.hits.map((hit) => {
            const data = JSON.parse(hit._source.data);
            const rld = new EcRemoteLinkedData();
            rld.copyFrom(data);
            const timestamp = rld.getTimestamp();
            return { data: data, id: rld.id, time: timestamp == null ? hit._source.writeMs : timestamp };
        });
        // Newest first. A version with no time at all stays where it is.
        versions.sort((a, b) => a.time == null || b.time == null ? 0 : b.time - a.time);
        // A version is stored under each id of its object (GUID, MD5 of its URL), so the same one
        // can come back more than once: keep the first of each id and time. NaN is what the key is
        // when there is no id to tell versions apart by, and such versions are all kept.
        const seen = new Set();
        const history = [];
        for (const v of versions) {
            const key = v.id + v.time;
            if (!Number.isNaN(key)) {
                if (seen.has(String(key))) {
                    continue;
                }
                seen.add(String(key));
            }
            history.push(v.data);
        }
        return history;
    }
    debugLog('SkyrepoHistoryInternal', () => 'Failed to find ' + type + '/' + id + '/' + version + '.');
    return null;
};

module.exports = {
    skyrepoHistoryInternal
}
