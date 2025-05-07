const WebSocket = require('ws');
let mePpk = process.env.CASS_REPLICATION_PPK || keyFor("replicateAdapter");
let replicateEndpoint = process.env.CASS_REPLICATION_ENDPOINT || null;
let replConfig = {};
let sizeWindow = 100;

let meIm = new EcIdentityManager();
let meIdent = new EcIdentity();
meIdent.ppk = EcPpk.fromPem(mePpk);
meIdent.displayName = "Replication Adapter";
meIm.addIdentity(meIdent);

var replicateConfigFilePath = "etc/adapter.replication.json";
var replicateConfig = function () {
    if (this.xapiConfig != null) return this.xapiConfig;
    if (!fileExists(replicateConfigFilePath))
        fileSave(JSON.stringify({
            lastReplicated: 0
        }),replicateConfigFilePath);
    this.replConfig = JSON.parse(fileToString(fileLoad(replicateConfigFilePath)));
    return this.replConfig;
}

global.replicate = async function(last){
    if (replicateEndpoint == null) 
        return;
    if (global.replicateRepo == null)
        global.replicateRepo = new EcRepository();
    global.replicateRepo.selectedServer = replicateEndpoint; 
    let data = await replicateRepo.searchWithParams(
        "@version:>"+replicateConfig().lastReplicated,
        {
            size:sizeWindow,
            sort:JSON.stringify([ { 
                "@version": {
                    order: "asc"
                }
            } ])
        },
        null,null,null,meIm
    ).catch((error) => {
        global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.ERROR, "Replicate", error);
    });
    if (data == null)
    {
        global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, "Replicate", "Failed to retrieve data. Resetting window and waiting a little bit.");
        sizeWindow = 100;
        setTimeout(replicate,10000);
        return;
    }
    global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, "Replicate", data.length);
    let latest = replicateConfig().lastReplicated;
    for (let datum of data)
    {
        if (datum.id == null)
            global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, "Replicate", JSON.stringify(datum,null,2));
        else {
            try{
                latest = Math.max(latest,datum.getTimestamp());
            } catch (ex){
                EcArray.setRemove(data,datum);
                global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.ERROR, "Replicate", JSON.stringify(datum,null,2), ex);
            }
        }
    }
    global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, "Replicate", new Date(latest));
    data = data.filter((x)=>x);
    if (data == null || data.length == 0 && sizeWindow == 10000 || JSON.stringify(data) == JSON.stringify(last) && sizeWindow == 10000)
    {
        global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, "Replicate", "Completed initial replication. Installing websocket.");
        connectWebsocket();
        return;
    }
    try{
        await repo.multiput(data,null,null,meIm);
        if (replConfig.lastReplicated == latest)
        {
            sizeWindow = Math.min(sizeWindow*8,10000);
            global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, "Replicate", "Replication failed to create progress. Increasing size window.");
        }
        replConfig.lastReplicated = latest;
        global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, "Replicate", `Replication timestamp saved: ${new Date(replConfig.lastReplicated)}`);
        fileSave(JSON.stringify(replConfig),replicateConfigFilePath);
        replicate(data);
    } catch(e)
    {
        global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.ERROR, "Replicate", e);
    }    
}

global.events.server.listening.subscribe(async (isListening) => {
    if (!isListening) return;
    global.replicate();
});

let reconnectMs = 1000;
function connectWebsocket(){
    const wsEndpoint = replicateEndpoint.replace(/http/, "ws").replace(/api\//, "ws/custom");
    const ws = new WebSocket(wsEndpoint);

    ws.on('open', () => {
        global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, "ReplicateWsOpen", `Replication Websocket established to ${wsEndpoint}`);
        replConfig.lastReplicated = new Date().getTime();
        global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, "ReplicateWsOpen", `Replication timestamp saved: ${new Date(replConfig.lastReplicated)}`);
        fileSave(JSON.stringify(replConfig),replicateConfigFilePath);
    });

    ws.on('message', async (data) => {   
        let ary = null;         
        if (data.startsWith("[")) {
            ary = JSON.parse(data);
        }
        else
            ary = [data];
        global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, "ReplicateWsMsg", `Replicating: ${ary}`);
        let updates = await global.replicateRepo.multiget(ary,null,null,meIm);
        repo.multiput(updates,null,null,meIm);
        replConfig.lastReplicated = new Date().getTime();
        global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, "ReplicateWsMsg", `Replication timestamp saved: ${new Date(replConfig.lastReplicated)}`);
        fileSave(JSON.stringify(replConfig),replicateConfigFilePath);
    });

    ws.on('close', () => {
        global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.INFO, "ReplicateWsClosed", `Replication Websocket closed to ${wsEndpoint}`);
        reconnectMs = Math.max(reconnectMs*2,60000);
        setTimeout(connectWebsocket,reconnectMs)
    });
}