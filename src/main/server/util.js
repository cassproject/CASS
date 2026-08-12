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

require('./shims/levr.js');
require('./shims/stjs.js');

let skyIdSecret = () => {
    return loadConfigurationFile('skyId.secret', function () {
        return randomString(2048);
    });
};

/**
 *  Number of documents in an index, or null if it does not exist.
 */
let skyrepoIndexDocCount = async function (index) {
    const stats = await httpGet(elasticEndpoint + '/' + index + '/_stats', true, elasticHeaders());
    return stats?._all?.primaries?.docs?.count;
};

/**
 *  Polls until two indices hold the same number of documents, or the deadline
 *  passes. Returns true only when the counts actually match — callers must not
 *  delete a source index unless this returned true.
 */
let skyrepoAwaitReindex = async function (destination, source, label) {
    const waitMs = (parseInt(process.env.PERMANENT_MIGRATION_TIMEOUT) || 3600) * 1000;
    const deadline = new Date().getTime() + waitMs;
    while (new Date().getTime() < deadline) {
        await httpGet(elasticEndpoint + '/_refresh', true, elasticHeaders());
        const destinationCount = await skyrepoIndexDocCount(destination);
        const sourceCount = await skyrepoIndexDocCount(source);
        if (destinationCount != null && sourceCount != null && destinationCount == sourceCount) {
            return true;
        }
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'SkyrepMigratePermanent', label + ' ' + destinationCount + ' / ' + sourceCount);
        await new Promise((r) => setTimeout(r, 10000));
    }
    return false;
};

/**
 *  Migrates the permanent index so that version history can be retrieved with
 *  a term query on an indexed baseId field.
 *
 *  The permanent index used to be created with 'enabled: false', which indexes
 *  nothing, so history had to script over the _id metadata field. That needs
 *  fielddata on _id — deprecated since Elasticsearch 7.6 and rejected by newer
 *  versions even with indices.id_field_data.enabled set — which made history
 *  fail with a script_exception that surfaced only as an empty result.
 *
 *  A root mapping's 'enabled' flag cannot be changed in place, so the index is
 *  rebuilt through .temp.permanent using the same reindex-and-swap approach the
 *  rest of this migration uses. baseId is derived from each document's _id,
 *  which is written as `<baseId>.<version>`.
 *
 *  Safe to re-run: it is a no-op once baseId is mapped, and it resumes if a
 *  previous attempt was interrupted midway. The source index is only ever
 *  deleted after the copy is verified to hold the same number of documents.
 */
let skyrepoMigratePermanent = async function () {
    const permanentMappings = {
        mappings: {
            dynamic: false,
            properties: global.PERMANENT_PROPERTIES || { baseId: { type: 'keyword' } },
        },
    };
    const baseIdScript = {
        lang: 'painless',
        source: 'int i = ctx._id.lastIndexOf(\'.\'); ctx._source.baseId = i > 0 ? ctx._id.substring(0, i) : ctx._id;',
    };

    const mapping = await httpGet(elasticEndpoint + '/permanent/_mapping', true, elasticHeaders());
    const permanentExists = mapping != null && mapping.error == null && mapping.permanent != null;
    const tempCount = await skyrepoIndexDocCount('.temp.permanent');

    if (permanentExists && mapping.permanent.mappings?.properties?.baseId != null) {
        return; // Already migrated.
    }
    if (!permanentExists && tempCount == null) {
        return; // Nothing stored yet; the index is created with the current mapping on first write.
    }

    if (permanentExists) {
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'SkyrepMigratePermanent', 'Adding indexed baseId to the permanent index. History is unavailable until this completes.');
        // Discard any copy left by an interrupted attempt — permanent is intact, so it is authoritative.
        if (tempCount != null) {
            await httpDelete(elasticEndpoint + '/.temp.permanent', elasticHeaders());
        }
        await httpPut(permanentMappings, elasticEndpoint + '/.temp.permanent', 'application/json', elasticHeaders());
        const forward = await httpPost({
            source: { index: 'permanent' },
            dest: { index: '.temp.permanent', version_type: 'external' },
            script: baseIdScript,
        }, elasticEndpoint + '/_reindex?wait_for_completion=false&refresh=true', 'application/json', 'false', elasticHeaders());
        if (forward == null || forward.error != null) {
            global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.ERROR, 'SkyrepMigratePermanent', 'Could not start reindex of permanent: ' + JSON.stringify(forward?.error));
            return;
        }
        if (!(await skyrepoAwaitReindex('.temp.permanent', 'permanent', 'Copying permanent ->.temp.permanent...'))) {
            global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.ERROR, 'SkyrepMigratePermanent', 'Timed out copying permanent. Nothing was deleted; migration will be retried on next startup.');
            return;
        }
        await httpDelete(elasticEndpoint + '/permanent', elasticHeaders());
    } else {
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.WARNING, 'SkyrepMigratePermanent', 'Resuming an interrupted permanent migration from .temp.permanent.');
    }

    await httpPut(permanentMappings, elasticEndpoint + '/permanent', 'application/json', elasticHeaders());
    const back = await httpPost({
        source: { index: '.temp.permanent' },
        dest: { index: 'permanent', version_type: 'external' },
    }, elasticEndpoint + '/_reindex?wait_for_completion=false&refresh=true', 'application/json', 'false', elasticHeaders());
    if (back == null || back.error != null) {
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.ERROR, 'SkyrepMigratePermanent', 'Could not start reindex back into permanent: ' + JSON.stringify(back?.error) + ' Data remains in .temp.permanent.');
        return;
    }
    if (!(await skyrepoAwaitReindex('permanent', '.temp.permanent', 'Restoring .temp.permanent -> permanent...'))) {
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.ERROR, 'SkyrepMigratePermanent', 'Timed out restoring permanent. Data remains in .temp.permanent and the migration will resume on next startup.');
        return;
    }
    await httpDelete(elasticEndpoint + '/.temp.permanent', elasticHeaders());
    global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'SkyrepMigratePermanent', 'Permanent index migrated; history now uses an indexed baseId.');
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
    if (elasticState.version.number.startsWith('8.') || elasticState.version.number.startsWith('9.')) {
        await httpPut({
            'persistent': {
                'indices.id_field_data.enabled': true,
            },
        }, elasticEndpoint + '/_cluster/settings', 'application/json', elasticHeaders());
    }
    if ((elasticState.version.number.startsWith('9.') && elasticState.version.minimum_index_compatibility_version == '8.0.0')
        || (elasticState.version.number.startsWith('8.19') && elasticState.version.minimum_index_compatibility_version == '7.0.0')
        || (elasticState.version.number.startsWith('7.') && elasticState.version.minimum_index_compatibility_version == '6.0.0-beta1')) {

        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'SkyrepMigrate', 'Deleted pipelines: ' + JSON.stringify(await httpDelete(elasticEndpoint + '/_ingest/pipeline/*', elasticHeaders())));

        let geoipDatabases = await httpGet(elasticEndpoint + '/_ingest/geoip/database/', true, elasticHeaders());
        if (geoipDatabases?.databases)
            for (const db of geoipDatabases.databases) {
                global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'SkyrepMigrate', 'Found GeoIP database: ' + db.id);
                global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'SkyrepMigrate', 'Deleted GeoIP database: ' + JSON.stringify(await httpDelete(elasticEndpoint + '/_ingest/geoip/database/' + db.id, elasticHeaders())));
            }

        let ipLocationDatabases = await httpGet(elasticEndpoint + '/_ingest/ip_location/database/', true, elasticHeaders());
        if (ipLocationDatabases?.databases)
            for (const db of ipLocationDatabases.databases) {
                global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'SkyrepMigrate', 'Found IP Location database: ' + db.id);
                global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'SkyrepMigrate', 'Deleted IP Location database: ' + JSON.stringify(await httpDelete(elasticEndpoint + '/_ingest/ip_location/database/' + db.id, elasticHeaders())));
            }

        let settings = await httpGet(elasticEndpoint + '/_settings?expand_wildcards=all', true, elasticHeaders());
        let indices = EcObject.keys((await httpGet(elasticEndpoint + '/_stats?expand_wildcards=all', true, elasticHeaders())).indices);
        for (const index of indices) {
            global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, '1SkyrepMigrate', 'Checking to see if ' + index + ' needs upgrading...' + settings?.[index]?.settings?.index?.version?.created);
            if (index.startsWith('.temp.')) {
                continue;
            }
            if (index.startsWith('.geoip')) {
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'GeoIpDelete', await httpDelete(elasticEndpoint + '/' + index.replace('https:..', '').replace(':', '.'), elasticHeaders()));
                continue;
            }
            if (elasticState.version.number.startsWith('9.') && elasticState.version.minimum_index_compatibility_version == '8.0.0') {
                if (!settings[index].settings.index.version.created.startsWith('8'))
                    continue;
            }
            if ((elasticState.version.number.startsWith('8.19') && elasticState.version.minimum_index_compatibility_version == '7.0.0')
                || (elasticState.version.number.startsWith('7.') && elasticState.version.minimum_index_compatibility_version == '6.0.0-beta1')) {
                if (!settings[index].settings.index.version.created.startsWith('7') && settings[index].settings.index.version.created != '6081299' && settings[index].settings.index.version.created != '6082199' && settings[index].settings.index.version.created != '6082299' && settings[index].settings.index.version.created != '6082399')
                    continue;
            }
            global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, '2SkyrepMigrate', 'Reindexing ' + index + ' -> .temp.' + index.replace('https:..', '').replace(':', '.'));
            if (index == 'permanent' || index == 'ephemeral') {
                let mappings = {};
                let doc = {};
                (mappings)['mappings'] = doc;
                doc['enabled'] = false;
                let result = await httpPut(mappings, elasticEndpoint + '/.temp.' + index.replace('https:..', '').replace(':', '.'), 'application/json', elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, '3SkyrepMigrate', JSON.stringify(result));
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
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, '3SkyrepMigrate', JSON.stringify(result));
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
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, '3SkyrepMigrate', JSON.stringify(result));
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
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, '3SkyrepMigrate', JSON.stringify(result));
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
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, '3SkyrepMigrate', JSON.stringify(result));
            }
            let r = null;
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, '4SkyrepMigrate', r = await httpPost({
                source: { index: index },
                dest: { index: '.temp.' + index.replace('https:..', '').replace(':', '.'), version_type: 'external' },
            }, elasticEndpoint + '/_reindex', 'application/json', 'false', elasticHeaders()));
            if (r.error != null) continue;
            {
                let leftIndex = 1;
                let rightIndex = 2;
                while (leftIndex != rightIndex) {
                    leftIndex = (await httpGet(elasticEndpoint + '/.temp.' + index.replace('https:..', '').replace(':', '.') + '/_stats', true, elasticHeaders()))?._all?.primaries?.docs?.count;
                    rightIndex = (await httpGet(elasticEndpoint + '/' + index.replace('https:..', '').replace(':', '.') + '/_stats', true, elasticHeaders()))?._all?.primaries?.docs?.count;
                    if (leftIndex == rightIndex) break;
                    global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, '5SkyrepMigrate', 'Waiting for documents to reindex... ' + leftIndex + ' / ' + rightIndex);
                    await httpGet(elasticEndpoint + '/_refresh', true, elasticHeaders());
                    await httpGet(elasticEndpoint + '/_flush', true, elasticHeaders());
                    await new Promise(r => setTimeout(r, 10000));
                }
            }
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, '5SkyrepMigrate', 'Deleting ' + index);
            let r2 = null;
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, '6SkyrepMigrate', r2 = await httpDelete(elasticEndpoint + '/' + index, elasticHeaders()));
            if (r2?.error != null) continue;
            if (index == 'permanent' || index == 'ephemeral') {
                let mappings = {};
                let doc = {};
                (mappings)['mappings'] = doc;
                doc['enabled'] = false;
                let result = await httpPut(mappings, elasticEndpoint + '/' + index, 'application/json', elasticHeaders());
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, '7SkyrepMigrate', JSON.stringify(result));
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
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, '7SkyrepMigrate', JSON.stringify(result));
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
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, '7SkyrepMigrate', JSON.stringify(result));
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
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, '7SkyrepMigrate', JSON.stringify(result));
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
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, '7SkyrepMigrate', JSON.stringify(result));
            }
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, '8SkyrepMigrate', 'Reindexing .temp.' + index.replace('https:..', '').replace(':', '.') + ' -> ' + index.replace('https:..', '').replace(':', '.'));
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, '9SkyrepMigrate', r = await httpPost({
                source: { index: '.temp.' + index.replace('https:..', '').replace(':', '.') },
                dest: { index: index.replace('https:..', '').replace(':', '.'), version_type: 'external' },
            }, elasticEndpoint + '/_reindex', 'application/json', 'false', elasticHeaders()));
            await new Promise(r => setTimeout(r, 1000));
            if (r.error != null) continue;
            {
                let leftIndex = 1;
                let rightIndex = 2;
                while (leftIndex != rightIndex) {
                    leftIndex = (await httpGet(elasticEndpoint + '/' + index.replace('https:..', '').replace(':', '.') + '/_stats', true, elasticHeaders()))?._all?.primaries?.docs?.count;
                    rightIndex = (await httpGet(elasticEndpoint + '/.temp.' + index.replace('https:..', '').replace(':', '.') + '/_stats', true, elasticHeaders()))?._all?.primaries?.docs?.count;
                    if (leftIndex == rightIndex) break;
                    global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, '5SkyrepMigrate', 'Waiting for documents to reindex... ' + leftIndex + ' / ' + rightIndex);
                    await httpGet(elasticEndpoint + '/_refresh', true, elasticHeaders());
                    await httpGet(elasticEndpoint + '/_flush', true, elasticHeaders());
                    await new Promise(r => setTimeout(r, 10000));
                }
            }
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, '10SkyrepMigrate', 'Deleting .temp.' + index.replace('https:..', '').replace(':', '.'));
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, '11SkyrepMigrate', await httpDelete(elasticEndpoint + '/.temp.' + index.replace('https:..', '').replace(':', '.'), elasticHeaders()));
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
            }), elasticEndpoint + '/_reindex?refresh=false', 'application/json', 'false', elasticHeaders()));
            if (r.error != null) continue;
            let r2 = null;
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', r2 = await httpDelete(elasticEndpoint + '/' + index, elasticHeaders()));
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
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepMigrate', await httpDelete(elasticEndpoint + '/.temp.' + index, elasticHeaders()));
        }
    }
    await skyrepoMigratePermanent();
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

/**
 * @openapi
 * /api/util/reindex:
 *   post:
 *     x-mcp-ignore: true
 *     tags:
 *       - Administration
 *     summary: Reindex all data in Elasticsearch
 *     description: |
 *       Iterates over every record in the permanent index and re-saves it,
 *       rebuilding all Elasticsearch mappings and search indices.
 *       Requires the server secret (`skyId.secret`) for authentication.
 *     parameters:
 *       - in: query
 *         name: secret
 *         required: true
 *         schema:
 *           type: string
 *         description: Contents of the server's `skyId.secret` file.
 *       - in: query
 *         name: debug
 *         schema:
 *           type: string
 *         description: If present, enables debug logging during reindex.
 *     responses:
 *       200:
 *         description: Reindex completed.
 *       401:
 *         description: Invalid or missing secret.
 */
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
        log.push(await httpDelete(elasticEndpoint + '/' + index, elasticHeaders()));
    }
    return JSON.stringify(log, null, 2);
};

/**
 * @openapi
 * /api/util/purge:
 *   post:
 *     x-mcp-ignore: true
 *     tags:
 *       - Administration
 *     summary: Purge all Elasticsearch indices
 *     description: |
 *       Deletes all Elasticsearch indices and their mappings.
 *       This is a destructive operation — all indexed data will be removed.
 *       Requires the server secret (`skyId.secret`) for authentication.
 *     parameters:
 *       - in: query
 *         name: secret
 *         required: true
 *         schema:
 *           type: string
 *         description: Contents of the server's `skyId.secret` file.
 *     responses:
 *       200:
 *         description: Purge completed. Returns a JSON array of deletion results per index.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Invalid or missing secret.
 */
bindWebService('/util/purge', skyrepoPurge);

skyrepoCull = async function () {
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
    let firstQueryUrl = elasticEndpoint + '/permanent/_search?scroll=1m&version';
    let results = await httpPost(firstQueryPost, firstQueryUrl, 'application/json', 'false', global.elasticHeaders());
    let scroll = results['_scroll_id'];
    global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, 'SkyrepoCullResults', JSON.stringify(results, null, 2));
    let counter = 0;
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
        await Promise.map(hits, async (hit) => {
            let id = hit._id;
            resultsData.total++;
            if (id.indexOf('.') == id.length - 1) {
                global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.DEBUG, 'SkyrepoCullLatestId', "Latest: " + id);
            }
            else {
                global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.DEBUG, 'SkyrepoCullLatestVersioned', "Versioned: " + id, JSON.stringify(resultsData));
                let latestId = id.substring(0, id.indexOf('.'));
                let latest = await httpGet(elasticEndpoint + '/permanent/_doc/' + latestId + ".", global.elasticHeaders());
                if (latest != null && latest._source != null) {
                    let latestVersion = EcRemoteLinkedData.getVersionFromUrl(JSON.parse(latest._source.data)["@id"]);
                    let version = parseInt(id.substring(id.indexOf('.') + 1));
                    if (version != null && latestVersion != null && version < latestVersion) {
                        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.DEBUG, 'SkyrepoCullLatestDeleted', " Deleting: " + id, " version: " + version + " latest: " + latestVersion);
                        resultsData.deletedRevision++;
                        httpDelete(elasticEndpoint + '/permanent/_doc/' + id, global.elasticHeaders());
                    }
                }
                else {
                    global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.DEBUG, 'SkyrepoCullLatestDeleted', " Deleting (doesn't exist): " + id);
                    resultsData.deletedDeleted++;
                    httpDelete(elasticEndpoint + '/permanent/_doc/' + id, global.elasticHeaders());
                }
            }
            if (++counter % 100 == 0) {
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepoCull', 'Culling records: on ' + counter + ' .');
            }
        }, { concurrency: 10 });
        results = await httpGet(elasticEndpoint + '/_search/scroll?scroll=1m&scroll_id=' + scroll, global.elasticHeaders());
    }
    global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'SkyrepoCull', 'Culled ' + counter + ' records.');
    if (this.params.debug != null) {
        global.skyrepoDebug = false;
    }
    return JSON.stringify(resultsData, null, 2);
};

/**
 * @openapi
 * /api/util/cull:
 *   post:
 *     x-mcp-ignore: true
 *     tags:
 *       - Administration
 *     summary: Remove old versioned records
 *     description: |
 *       Walks every record in the permanent index and deletes old version
 *       entries that no longer match the current head pointer, reclaiming
 *       storage. Requires the server secret for authentication.
 *     parameters:
 *       - in: query
 *         name: secret
 *         required: true
 *         schema:
 *           type: string
 *         description: Contents of the server's `skyId.secret` file.
 *       - in: query
 *         name: debug
 *         schema:
 *           type: string
 *         description: If present, enables debug logging during cull.
 *     responses:
 *       200:
 *         description: Cull completed.
 *       401:
 *         description: Invalid or missing secret.
 */
bindWebService('/util/cull', skyrepoCull);
skyrepoCullFast = async function () {
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
        let nextResults = httpGet(elasticEndpoint + '/_search/scroll?scroll=1m&scroll_id=' + scroll, null, global.elasticHeaders());

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

/**
 * @openapi
 * /api/util/cullFast:
 *   post:
 *     x-mcp-ignore: true
 *     tags:
 *       - Administration
 *     summary: Fast cull of old versioned records
 *     description: |
 *       An optimised version of `/api/util/cull` that uses bulk multi-get
 *       and bulk delete operations. Compares each record against its head
 *       pointer and removes stale versions in batch. Returns statistics.
 *       Requires the server secret for authentication.
 *     parameters:
 *       - in: query
 *         name: secret
 *         required: true
 *         schema:
 *           type: string
 *         description: Contents of the server's `skyId.secret` file.
 *       - in: query
 *         name: debug
 *         schema:
 *           type: string
 *         description: If present, enables debug logging during cull.
 *     responses:
 *       200:
 *         description: Fast cull completed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 deletedRevision:
 *                   type: integer
 *                 deletedDeleted:
 *                   type: integer
 *       401:
 *         description: Invalid or missing secret.
 */
bindWebService('/util/cullFast', skyrepoCullFast);