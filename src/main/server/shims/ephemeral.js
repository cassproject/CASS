let rxjs = require('rxjs');

const init = async ()=>{
    const result = await httpPut({
        mappings:{
            enabled: false
        }
    }, elasticEndpoint + '/ephemeral', 'application/json', elasticHeaders());
    if (global.skyrepoDebug) {
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'SkyrepoPutInternalEphe', JSON.stringify(result));
    }

    global.ephemeral.put('test', {test: 'test'}, new Date().getTime() + 10000);

    const timer = rxjs.interval(60000);
    timer.subscribe(async ()=>{
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
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, 'EphemeralDeleteOld', JSON.stringify(result));
    });
    global.ephemeral = {
        get: async function (id) {
            return (await httpGet(elasticEndpoint + '/ephemeral/_doc/' + id, 'application/json', elasticHeaders()))["_source"];
        },
        put: async function (id, obj, until) {
            return await httpPut(obj, elasticEndpoint + '/ephemeral/_doc/' + id + '?version=' + until + '&version_type=external', 'application/json', elasticHeaders());
        },
    }
}

init();