let subscription = global.events.database.connected.subscribe(async (connected) => {
    if (connected) {
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'EphemeralInit');
        const result = await httpPut({
            mappings: {
                enabled: false
            }
        }, elasticEndpoint + '/ephemeral', 'application/json', elasticHeaders());
        if (global.skyrepoDebug) {
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'SkyrepoPutInternalEphe', JSON.stringify(result));
        }

        global.ephemeral = {
            get: async function (id) {
                return (await httpGet(elasticEndpoint + '/ephemeral/_doc/' + id, 'application/json', elasticHeaders()))["_source"];
            },
            gets: async function (ids) {
                if (global.skyrepoDebug) {
                    global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'SkyrepManyGetIndexInternal', 'Fetching from ' + index + ' : ' + manyParseParams.length);
                }

                const mget = {};
                const docs = [];
                (mget)['docs'] = docs;

                docs.push(...ids.map(id => ({ _index: 'ephemeral', _id: id })));
                
                let response = await httpPost(mget, elasticEndpoint + '/_mget', 'application/json', false, null, null, true, elasticHeaders());
                response = response?.docs?.map(x => x._source);
                return response || [];
            },
            put: async function (id, obj, until) {
                return await httpPut(obj, elasticEndpoint + '/ephemeral/_doc/' + id + '?version=' + until + '&version_type=external', 'application/json', elasticHeaders());
            },
            delete: async function (id) {
                return await httpDelete(obj, elasticEndpoint + '/ephemeral/_doc/' + id, elasticHeaders())
            },
            deleteWith: async function (partOfId) { 
                let result = await httpPost({
                    "query": {
                        "bool": {
                            "filter": {
                                "script": {
                                    "script": {
                                        "source": "doc._id.value.contains(params.param1)",
                                        "lang": "painless",
                                        "params": {
                                            "param1": partOfId
                                        }
                                    }
                                }
                            }
                        }
                    }
                }, elasticEndpoint + '/ephemeral/_delete_by_query', 'application/json', elasticHeaders());
                console.log(JSON.stringify(result));
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'EphemeralDeleteOld', JSON.stringify(result));
            }
        }

        global.ephemeral.put('test', { test: 'test' }, new Date().getTime() + 10000);

        global.events.database.periodic.subscribe(async () => {
            let result = await httpPost({
                "query": {
                    "bool": {
                        "filter": {
                            "script": {
                                "script": {
                                    "source": "doc._version.value < params.param1",
                                    "lang": "painless",
                                    "params": {
                                        "param1": new Date().getTime()
                                    }
                                }
                            }
                        }
                    }
                }
            }, elasticEndpoint + '/ephemeral/_delete_by_query', 'application/json', elasticHeaders());
            console.log(JSON.stringify(result));
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'EphemeralDeleteOld', JSON.stringify(result));
        });
        subscription.unsubscribe();
    }
});