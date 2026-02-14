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

const skyrepoHistoryPermanent = async function (id, version, type) {
    const query = {
        'size': 10000,
        'query': {
            'script': {
                'script': {
                    'source': 'doc[\'_id\'][0].indexOf(params.param1+\'.\') > -1',
                    'lang': 'painless',
                    'params': {
                        'param1': `${id}`,
                    },
                },
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
        return null;
    }
    if ((result).hits.total.value > 0) {
        const hits = result.hits.hits;
        hits.sort((a, b) => {
            const A = new EcRemoteLinkedData();
            A.copyFrom(JSON.parse(a._source.data));
            const B = new EcRemoteLinkedData();
            B.copyFrom(JSON.parse(b._source.data));
            let Ats = A.getTimestamp();
            let Bts = B.getTimestamp();
            if (Ats == null) Ats = a._source.writeMs;
            if (Bts == null) Bts = b._source.writeMs;
            if (Ats == null || Bts == null) return 0;
            return Bts - Ats;
        });
        for (let i = 0; i < hits.length; i++) {
            for (let j = i; j < hits.length; j++) {
                if (i == j) continue;
                const A = new EcRemoteLinkedData();
                A.copyFrom(JSON.parse(hits[i]._source.data));
                const B = new EcRemoteLinkedData();
                B.copyFrom(JSON.parse(hits[j]._source.data));
                let Ats = A.getTimestamp();
                let Bts = B.getTimestamp();
                if (Ats == null) Ats = hits[i]._source.writeMs;
                if (Bts == null) Bts = hits[j]._source.writeMs;
                if (A.id + Ats == B.id + Bts) {
                    hits.splice(j--, 1); // NOSONAR -- Valid method of filtering.
                }
            }
        }
        return hits.map((h) => JSON.parse(h._source.data));
    }
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.STORAGE, global.auditLogger.Severity.DATA, 'SkyrepoHistoryInternal', 'Failed to find ' + type + '/' + id + '/' + version + '.');
    }
    return null;
};

module.exports = {
    skyrepoHistoryInternal
}