let loopback = require('../../shims/cassproject.js');
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
    ).catch(console.error);
    console.log(data.length);
    let latest = replicateConfig().lastReplicated;
    for (let datum of data)
    {
        if (datum.id == null)
            console.log(JSON.stringify(datum,null,2));
        else {
            try{
                latest = Math.max(latest,datum.getTimestamp());
            } catch (ex){
                EcArray.setRemove(data,datum);
                console.log(JSON.stringify(datum,null,2));
                console.trace(ex);
            }
        }
    } 
    console.log(new Date(latest));
    data = data.filter((x)=>x);
    if (data == null || data.length == 0 || JSON.stringify(data) == JSON.stringify(last) && sizeWindow == 10000)
    {
        console.log("Completed initial replication. Installing websocket.");
        connectWebsocket();
        return;
    }
    try{
        await repo.multiput(data,null,null,meIm);
        if (replConfig.lastReplicated == latest)
        {
            sizeWindow = Math.min(sizeWindow*8,10000);
            console.log("Replication failed to create progress. Increasing size window.");
        }
        replConfig.lastReplicated = latest;
        console.log("Replication timestamp saved: " + new Date(replConfig.lastReplicated));
        fileSave(JSON.stringify(replConfig),replicateConfigFilePath);
        replicate(data);
    } catch(e)
    {
        console.trace(e);
    }    
}

let reconnectMs = 1000;
function connectWebsocket(){
    const wsEndpoint = replicateEndpoint.replace(/http/, "ws").replace(/api\//, "ws/custom");
    const ws = new WebSocket(wsEndpoint);

    ws.on('open', () => {
        console.log("Replication Websocket established to " + wsEndpoint);
        replConfig.lastReplicated = new Date().getTime();
        console.log("Replication timestamp saved: " + new Date(replConfig.lastReplicated));
        fileSave(JSON.stringify(replConfig),replicateConfigFilePath);
    });

    ws.on('message', async (data) => {   
        let ary = null;         
        if (data.startsWith("[")) {
            ary = JSON.parse(data);
        }
        else
            ary = [data];
        console.log("Replicating: " + ary)
        let updates = await global.replicateRepo.multiget(ary,null,null,meIm);
        repo.multiput(updates,null,null,meIm);
        replConfig.lastReplicated = new Date().getTime();
        console.log("Replication timestamp saved: " + new Date(replConfig.lastReplicated));
        fileSave(JSON.stringify(replConfig),replicateConfigFilePath);
    });

    ws.on('close', () => {
        console.log("Replication Websocket closed to " + wsEndpoint);
        reconnectMs = Math.max(reconnectMs*2,60000);
        setTimeout(connectWebsocket,reconnectMs)
    });
}