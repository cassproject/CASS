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

require('./shims/levr.js');
require('./shims/stjs.js');

let skyIdSecret = () => {
    return loadConfigurationFile('skyId.secret', function () {
        return randomString(2048);
    });
};

let skyrepoMigrate = async function (after) {
    let elasticState = await httpGet(elasticEndpoint + '/', true, elasticHeaders());
    if (elasticState == null) {
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'SkyrepMigrate', 'Waiting for Elasticsearch to appear at ' + elasticEndpoint + '...');
        setTimeout(function () {
            skyrepoMigrate(after);
        }, 1000);
        return;
    }
    const result = await httpPut({ 'index.mapping.total_fields.limit': 10000 }, elasticEndpoint + '/schema.cassproject.org.0.4.configuration/_settings', 'application/json', elasticHeaders());
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'SkyrepoSetTotalFieldLimits', JSON.stringify(result));
    }
    global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'SkyrepMigrate', 'Current Elasticsearch Version: ' + elasticState.version.number);
    global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'SkyrepMigrate', 'Current Minimum Index Compatibility Version: ' + elasticState.version.minimum_index_compatibility_version);
    let health;
    health = (await httpGet(elasticEndpoint + '/_cluster/health', true, elasticHeaders())).status;
    if (health != 'yellow' && health != 'green') {
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'SkyrepMigrate', 'Waiting for cluster health...', health);
        setTimeout(function () {
            skyrepoMigrate(after);
        }, 1000);
        return;
    }
    if (elasticState.version.number.startsWith('8.')) {
        await httpPut({
            'persistent': {
                'indices.id_field_data.enabled': true,
            },
        }, elasticEndpoint + '/_cluster/settings', 'application/json', elasticHeaders());
    }
    if (elasticState.version.number.startsWith('7.') && elasticState.version.minimum_index_compatibility_version == '6.0.0-beta1') {
        let settings = await httpGet(elasticEndpoint + '/_settings', true, elasticHeaders());
        let indices = EcObject.keys(settings);
        for (const index of indices) {
            global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'SkyrepMigrate', 'Checking to see if ' + index + ' needs upgrading...');
            if (index.startsWith('.')) {
                continue;
            }
            if (settings[index].settings.index.version.created != '6081299' && settings[index].settings.index.version.created != '6082199' && settings[index].settings.index.version.created != '6082299' && settings[index].settings.index.version.created != '6082399') {
                continue;
            }
            global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'SkyrepMigrate', 'Reindexing ' + index + ' -> .temp.' + index.replace('https:..', '').replace(':', '.'));
            if (index == 'permanent') {
                let mappings = {};
                let doc = {};
                (mappings)['mappings'] = doc;
                doc['enabled'] = false;
                let result = await httpPut(mappings, elasticEndpoint + '/.temp.' + index.replace('https:..', '').replace(':', '.'), 'application/json', elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', JSON.stringify(result));
            } else if (index.endsWith('assertion')) {
                await httpGet(elasticEndpoint + '/' + index + '/_mapping', true, elasticHeaders());
                let mappings = {};
                let doc = {};
                (mappings)['mappings'] = doc;
                doc.properties = {
                    '@version': { type: 'long' },
                    'confidence': { type: 'float' },
                    'assertionDateDecrypted': { type: 'long' },
                };
                let result = await httpPut(mappings, elasticEndpoint + '/.temp.' + index.replace('https:..', '').replace(':', '.'), 'application/json', elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', JSON.stringify(result));
            } else if (index.endsWith('competency')) {
                await httpGet(elasticEndpoint + '/' + index + '/_mapping', true, elasticHeaders());
                let mappings = {};
                let doc = {};
                (mappings)['mappings'] = doc;
                doc.properties = {
                    '@version': { type: 'long' },
                    'ceasn:codedNotation': {
                        'type': 'text',
                        'fields': {
                            'keyword': {
                                'type': 'keyword',
                                'ignore_above': 256,
                            },
                        },
                    },
                };
                let result = await httpPut(mappings, elasticEndpoint + '/.temp.' + index.replace('https:..', '').replace(':', '.'), 'application/json', elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', JSON.stringify(result));
            } else if (index.endsWith('conceptscheme')) {
                await httpGet(elasticEndpoint + '/' + index + '/_mapping', true, elasticHeaders());
                let mappings = {};
                let doc = {};
                (mappings)['mappings'] = doc;
                doc.properties = {
                    '@version': { type: 'long' },
                    'skos:hasTopConcept': {
                        'type': 'text',
                        'fields': {
                            'keyword': {
                                'type': 'keyword',
                                'ignore_above': 256,
                            },
                        },
                    },
                };
                let result = await httpPut(mappings, elasticEndpoint + '/.temp.' + index.replace('https:..', '').replace(':', '.'), 'application/json', elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', JSON.stringify(result));
            } else {
                await httpGet(elasticEndpoint + '/' + index + '/_mapping', true, elasticHeaders());
                let setting = await httpGet(elasticEndpoint + '/' + index + '/_settings', true, elasticHeaders());
                let fields = setting[index].settings?.index?.mapping?.total_fields.limit;
                if (!fields) {
                    fields = 1000;
                }
                let mappings = {};
                let doc = {};
                (mappings)['mappings'] = doc;
                doc.properties = { '@version': { type: 'long' } };
                mappings['settings'] = { 'index.mapping.total_fields.limit': fields };
                let result = await httpPut(mappings, elasticEndpoint + '/.temp.' + index.replace('https:..', '').replace(':', '.'), 'application/json', elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', JSON.stringify(result));
            }
            let r = null;
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', r = await httpPost(JSON.stringify({
                source: { index: index },
                dest: { index: '.temp.' + index.replace('https:..', '').replace(':', '.'), version_type: 'external' },
            }), elasticEndpoint + '/_reindex?refresh=true', 'application/json', 'false', elasticHeaders()));
            if (r.error != null) continue;
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', 'Deleting ' + index);
            let r2 = null;
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', r2 = await httpDelete(elasticEndpoint + '/' + index, true, elasticHeaders()));
            if (r2.error != null) continue;
            if (index == 'permanent') {
                let mappings = {};
                let doc = {};
                (mappings)['mappings'] = doc;
                doc['enabled'] = false;
                let result = await httpPut(mappings, elasticEndpoint + '/permanent', 'application/json', elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', JSON.stringify(result));
            } else if (index.endsWith('competency')) {
                await httpGet(elasticEndpoint + '/.temp.' + index.replace('https:..', '').replace(':', '.') + '/_mapping', true, elasticHeaders());
                let mappings = {};
                let doc = {};
                (mappings)['mappings'] = doc;
                doc.properties = {
                    '@version': { type: 'long' },
                    'ceasn:codedNotation': {
                        'type': 'text',
                        'fields': {
                            'keyword': {
                                'type': 'keyword',
                                'ignore_above': 256,
                            },
                        },
                    },
                };
                let result = await httpPut(mappings, elasticEndpoint + '/' + index.replace('https:..', '').replace(':', '.'), 'application/json', elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', JSON.stringify(result));
            } else if (index.endsWith('conceptscheme')) {
                await httpGet(elasticEndpoint + '/.temp.' + index.replace('https:..', '').replace(':', '.') + '/_mapping', true, elasticHeaders());
                let mappings = {};
                let doc = {};
                (mappings)['mappings'] = doc;
                doc.properties = {
                    '@version': { type: 'long' },
                    'skos:hasTopConcept': {
                        'type': 'text',
                        'fields': {
                            'keyword': {
                                'type': 'keyword',
                                'ignore_above': 256,
                            },
                        },
                    },
                };
                let result = await httpPut(mappings, elasticEndpoint + '/' + index.replace('https:..', '').replace(':', '.'), 'application/json', elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', JSON.stringify(result));
            } else if (index.endsWith('assertion')) {
                await httpGet(elasticEndpoint + '/.temp.' + index.replace('https:..', '').replace(':', '.') + '/_mapping', true, elasticHeaders());
                let mappings = {};
                let doc = {};
                (mappings)['mappings'] = doc;
                doc.properties = {
                    '@version': { type: 'long' },
                    'confidence': { type: 'float' },
                    'assertionDateDecrypted': { type: 'long' },
                };
                let result = await httpPut(mappings, elasticEndpoint + '/' + index.replace('https:..', '').replace(':', '.'), 'application/json', elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', JSON.stringify(result));
            } else {
                await httpGet(elasticEndpoint + '/.temp.' + index.replace('https:..', '').replace(':', '.') + '/_mapping', true, elasticHeaders());
                let setting = await httpGet(elasticEndpoint + '/.temp.' + index + '/_settings', true, elasticHeaders());
                let fields = setting['.temp.' + index].settings?.index?.mapping?.total_fields.limit;
                if (!fields) {
                    fields = 10000;
                }
                let mappings = {};
                let doc = {};
                (mappings)['mappings'] = doc;
                doc.properties = { '@version': { type: 'long' } };
                mappings['settings'] = { 'index.mapping.total_fields.limit': fields };
                let result = await httpPut(mappings, elasticEndpoint + '/' + index.replace('https:..', '').replace(':', '.'), 'application/json', elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', JSON.stringify(result));
            }
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', 'Reindexing .temp.' + index.replace('https:..', '').replace(':', '.') + ' -> ' + index.replace('https:..', '').replace(':', '.'));
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', r = await httpPost(JSON.stringify({
                source: { index: '.temp.' + index.replace('https:..', '').replace(':', '.') },
                dest: { index: index.replace('https:..', '').replace(':', '.'), version_type: 'external' },
            }), elasticEndpoint + '/_reindex?refresh=true', 'application/json', 'false', elasticHeaders()));
            if (r.error != null) continue;
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', 'Deleting .temp.' + index.replace('https:..', '').replace(':', '.'));
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', await httpDelete(elasticEndpoint + '/.temp.' + index.replace('https:..', '').replace(':', '.'), true));
        }
    }
    if (elasticState.version.number.startsWith('6.') && elasticState.version.minimum_index_compatibility_version == '5.0.0') {
        let settings = await httpGet(elasticEndpoint + '/_settings', true, elasticHeaders());
        let indices = EcObject.keys(settings);
        for (const index of indices) {
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', 'Checking to see if ' + index + ' needs upgrading...');
            if (index.startsWith('.')) {
                continue;
            }
            if (settings[index].settings.index.version.created != '5061299' && settings[index].settings.index.version.created != '5061699' && settings[index].settings.index.version.created != '5040099') {
                continue;
            }
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', 'Reindexing ' + index + ' -> .temp.' + index);
            if (index == 'permanent') {
                let mappings = {};
                let permNoIndex = {};
                let doc = {};
                (mappings)['mappings'] = permNoIndex;
                (permNoIndex)['permanent'] = doc;
                doc['enabled'] = false;
                let result = await httpPut(mappings, elasticEndpoint + '/.temp.' + index, 'application/json', elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', JSON.stringify(result));
            } else if (index.endsWith('assertion')) {
                let mapping = await httpGet(elasticEndpoint + '/' + index + '/_mapping', true, elasticHeaders());
                let mappings = {};
                let permNoIndex = {};
                let doc = {};
                (mappings)['mappings'] = permNoIndex;
                if (EcObject.keys(mapping[index].mappings)[0]) {
                    (permNoIndex)[EcObject.keys(mapping[index].mappings)[0]] = doc;
                }
                doc.properties = {
                    '@version': { type: 'long' },
                    'confidence': { type: 'float' },
                    'assertionDateDecrypted': { type: 'long' },
                };
                let result = await httpPut(mappings, elasticEndpoint + '/.temp.' + index, 'application/json', elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', JSON.stringify(result));
            } else if (index.endsWith('competency')) {
                let mapping = await httpGet(elasticEndpoint + '/' + index + '/_mapping', true, elasticHeaders());
                let mappings = {};
                let permNoIndex = {};
                let doc = {};
                (mappings)['mappings'] = permNoIndex;
                if (EcObject.keys(mapping[index].mappings)[0]) {
                    (permNoIndex)[EcObject.keys(mapping[index].mappings)[0]] = doc;
                } else if (index.indexOf('encryptedvalue') !== -1) {
                    let substring = index.substring(0, index.lastIndexOf('.') + 1);
                    (permNoIndex)[substring + 'EncryptedValue'] = doc;
                }
                doc.properties = {
                    '@version': { type: 'long' },
                    'ceasn:codedNotation': {
                        'type': 'text',
                        'fields': {
                            'keyword': {
                                'type': 'keyword',
                                'ignore_above': 256,
                            },
                        },
                    },
                };
                let result = await httpPut(mappings, elasticEndpoint + '/.temp.' + index, 'application/json', elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', JSON.stringify(result));
            } else {
                let mapping = await httpGet(elasticEndpoint + '/' + index + '/_mapping', true, elasticHeaders());
                let setting = await httpGet(elasticEndpoint + '/' + index + '/_settings', true, elasticHeaders());
                let fields = setting[index].settings?.index?.mapping?.total_fields.limit;
                if (!fields) {
                    fields = 10000;
                }
                let mappings = {};
                let permNoIndex = {};
                let doc = {};
                (mappings)['mappings'] = permNoIndex;
                if (EcObject.keys(mapping[index].mappings)[0]) {
                    (permNoIndex)[EcObject.keys(mapping[index].mappings)[0]] = doc;
                }
                doc.properties = { '@version': { type: 'long' } };
                mappings['settings'] = { 'index.mapping.total_fields.limit': fields };
                let result = await httpPut(mappings, elasticEndpoint + '/.temp.' + index, 'application/json', elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', JSON.stringify(result));
            }
            let r = null;
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', r = await httpPost(JSON.stringify({
                source: { index: index },
                dest: { index: '.temp.' + index, version_type: 'external' },
            }), elasticEndpoint + '/_reindex?refresh=true', 'application/json', 'false', elasticHeaders()));
            if (r.error != null) continue;
            let r2 = null;
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', r2 = await httpDelete(elasticEndpoint + '/' + index, true, elasticHeaders()));
            if (r2.error != null) continue;
            if (index == 'permanent') {
                let mappings = {};
                let permNoIndex = {};
                let doc = {};
                (mappings)['mappings'] = permNoIndex;
                (permNoIndex)['permanent'] = doc;
                doc['enabled'] = false;
                let result = await httpPut(mappings, elasticEndpoint + '/permanent', 'application/json', elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', JSON.stringify(result));
            } else if (index.endsWith('competency')) {
                let mapping = await httpGet(elasticEndpoint + '/.temp.' + index + '/_mapping', true, elasticHeaders());
                let mappings = {};
                let permNoIndex = {};
                let doc = {};
                (mappings)['mappings'] = permNoIndex;
                if (EcObject.keys(mapping['.temp.' + index].mappings)[0]) {
                    (permNoIndex)[EcObject.keys(mapping['.temp.' + index].mappings)[0]] = doc;
                }
                doc.properties = {
                    '@version': { type: 'long' },
                    'ceasn:codedNotation': {
                        'type': 'text',
                        'fields': {
                            'keyword': {
                                'type': 'keyword',
                                'ignore_above': 256,
                            },
                        },
                    },
                };
                let result = await httpPut(mappings, elasticEndpoint + '/' + index, 'application/json', elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', JSON.stringify(result));
            } else if (index.endsWith('assertion')) {
                let mapping = await httpGet(elasticEndpoint + '/.temp.' + index + '/_mapping', true, elasticHeaders());
                let mappings = {};
                let permNoIndex = {};
                let doc = {};
                (mappings)['mappings'] = permNoIndex;
                if (EcObject.keys(mapping['.temp.' + index].mappings)[0]) {
                    (permNoIndex)[EcObject.keys(mapping['.temp.' + index].mappings)[0]] = doc;
                }
                doc.properties = {
                    '@version': { type: 'long' },
                    'confidence': { type: 'float' },
                    'assertionDateDecrypted': { type: 'long' },
                };
                let result = await httpPut(mappings, elasticEndpoint + '/' + index, 'application/json', elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', JSON.stringify(result));
            } else {
                let mapping = await httpGet(elasticEndpoint + '/.temp.' + index + '/_mapping', true, elasticHeaders());
                let setting = await httpGet(elasticEndpoint + '/.temp.' + index + '/_settings', true, elasticHeaders());
                let fields = setting['.temp.' + index].settings?.index?.mapping?.total_fields.limit;
                if (!fields) {
                    fields = 10000;
                }
                let mappings = {};
                let permNoIndex = {};
                let doc = {};
                (mappings)['mappings'] = permNoIndex;
                if (EcObject.keys(mapping['.temp.' + index].mappings)[0]) {
                    (permNoIndex)[EcObject.keys(mapping['.temp.' + index].mappings)[0]] = doc;
                }
                doc.properties = { '@version': { type: 'long' } };
                mappings['settings'] = { 'index.mapping.total_fields.limit': fields };
                let result = await httpPut(mappings, elasticEndpoint + '/' + index, 'application/json', elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', JSON.stringify(result));
            }
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', 'Reindexing .temp.' + index + ' -> ' + index);
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', r = await httpPost(JSON.stringify({
                source: { index: '.temp.' + index },
                dest: { index: index, version_type: 'external' },
            }), elasticEndpoint + '/_reindex?refresh=true', 'application/json', 'false'));
            if (r.error != null) continue;
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', 'Deleting .temp.' + index);
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', await httpDelete(elasticEndpoint + '/.temp.' + index, true, elasticHeaders()));
        }
    }
    global.events.database.connected.next(true);
};
global.events.server.init.subscribe(skyrepoMigrate);
let skyrepoReindex = async function () {
    if (this.params.debug != null) {
        global.skyrepoDebug = true;
    }
    if (this.params.secret.trim() !== skyIdSecret().trim()) {
        error('You must provide secret=`cat skyId.secret` to invoke reindex.', 401);
    }

    let firstQueryPost = {
        query: {
            query_string: { query: '*:*' },
        },
        explain: 'false',
        size: '50',
        sort: '_doc',
    };
    let firstQueryUrl = elasticEndpoint + '/permanent/_search?scroll=1m&version';
    let results = await httpPost(JSON.stringify(firstQueryPost), firstQueryUrl, 'application/json', 'false', elasticHeaders());
    let scroll = results['_scroll_id'];
    let counter = 0;
    while (results != null && scroll != null && scroll != '') {
        scroll = results['_scroll_id'];
        let hits = results.hits.hits;
        if (hits.length == 0) {
            break;
        }
        for (const hit of hits) {
            let id = hit._id;
            if (id.indexOf('.') == id.length - 1) {
                if (++counter % 1000 == 0) {
                    global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepReindex', 'Reindexed ' + counter + ' records.');
                }
                await skyrepoPutInternal.call(this, JSON.parse(hit['_source'].data), hit['_id'].replace('.' + hit['_version'], '').replace(/\.$/, ''), null, hit['_type']);
            }
        }
        results = await httpGet(elasticEndpoint + '/_search/scroll?scroll=1m&scroll_id=' + scroll, elasticHeaders());
    }
    global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepReindex', 'Reindexed ' + counter + ' records.');
    if (this.params.debug != null) {
        global.skyrepoDebug = false;
    }
};
bindWebService('/util/reindex', skyrepoReindex);

let skyrepoPurge = async function () {
    if (this.params.secret != skyIdSecret()) {
        error('You must provide secret=`cat skyId.secret` to invoke purge.', 401);
    }
    let log = [];
    let settings = await httpGet(elasticEndpoint + '/_mapping', 'application/json', null, true, elasticHeaders());
    let indices = EcObject.keys(settings);
    let types = [];
    for (const index of indices) {
        types = types.concat(EcObject.keys(settings[index].mappings));
        log.push(await httpDelete(elasticEndpoint + '/' + index, true, elasticHeaders()));
    }
    return JSON.stringify(log, null, 2);
};
bindWebService('/util/purge', skyrepoPurge);

let skyrepoCullFast = async function () {
    if (this.params.secret.trim() !== skyIdSecret().trim()) {
        error('You must provide secret=`cat skyId.secret` to invoke reindex.', 401);
    }

    let firstQueryPost = {
        query: {
            query_string: { query: '*:*' },
        },
        explain: 'false',
        size: '500',
        sort: '_doc',
    };
    let firstQueryUrl = elasticEndpoint + '/permanent/_search?scroll=30m&version';
    let results = await httpPost(firstQueryPost, firstQueryUrl, 'application/json', false, null, null, null, global.elasticHeaders());
    let scroll = results['_scroll_id'];
    global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'SkyrepoCullFastResults', JSON.stringify(results, null, 2));
    let counter = 0;
    let deleted = 0;
    let resultsData = {
        total: 0,
        deletedRevision: 0,
        deletedDeleted: 0
    }
    while (results != null && scroll != null && scroll != '') {
        scroll = results['_scroll_id'];
        let hits = results.hits.hits;
        if (hits.length == 0) {
            break;
        }
        let nextResults = await httpGet(elasticEndpoint + '/_search/scroll?scroll=1m&scroll_id=' + scroll, null, global.elasticHeaders());

        //Filter out records that end with "."
        let hits2 = hits.filter((hit) => {
            return hit._id.indexOf('.') != hit._id.length - 1;
        });
        //Create multiget request for all the records
        let heads = await httpPost({
            docs: hits2.map((hit) => {
                return {
                    _index: 'permanent',
                    _id: hit._id.split('.')[0] + '.'
                };
            })
        }, elasticEndpoint + '/_mget', 'application/json', false, null, null, true, elasticHeaders());
        heads = heads.docs;
        heads = heads.filter(head => head._source)
        //Filter out records where the head's version matches the record's version
        let hits3 = hits2.filter(
            hit => !heads.filter(head => head._id.split('.')[0] == hit._id.split('.')[0])
                .some(head => JSON.parse(head._source.data)["@id"] == JSON.parse(hit._source.data)["@id"])
        );
        counter += hits.length;
        deleted += hits3.length;
        //Delete what's left (records with no head and records with a head with a different version)
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.NOTICE, 'SkyrepoCullFastIterate', "Deleting " + hits3.length + " records" + ` (${counter}, ${deleted}, ${hits?.length}, ${hits2?.length}, ${heads?.length}, ${hits3?.length})`);
        if (hits3.length > 0) {
            let del = hits3.map((hit) => {
                return {
                    delete:
                    {
                        _index: 'permanent',
                        _id: hit._id
                    }
                }
            }).map(x => JSON.stringify(x)).join("\n") + "\n\n";
            let deleted = httpPost(del, elasticEndpoint + '/_bulk', 'application/x-ndjson', false, null, null, true, elasticHeaders());
        }
        results = await nextResults;
    }
    global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepReindex', 'Culled ' + counter + ' records.');
    if (this.params.debug != null) {
        global.skyrepoDebug = false;
    }
    return JSON.stringify(resultsData, null, 2);
};
bindWebService('/util/cull', skyrepoCullFast);
bindWebService('/util/cullFast', skyrepoCullFast);