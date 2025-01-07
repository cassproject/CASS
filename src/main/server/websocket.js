require('express-ws')(global.app, global.server);
let wses = [];
app.ws('/ws/custom', function(ws, req) {
    wses.push(ws);
    global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "CassWsCustom", "Websocket connected.");
    ws.on('close', function(msg) {
        for (let i = 0;i < wses.length;i++)
            if (wses[i] == ws)
            {
                wses.splice(i--,1);
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "CassWsCustom", "closed");
            }
    });
});
global.events.database.afterSave.subscribe(async (s) => {
    if (EcArray.isArray(s))
        s = JSON.stringify(s.map(x=>EcRemoteLinkedData.trimVersionFromUrl(x.toJson ? JSON.parse(x.toJson())["@id"] : x["@id"])));
    else
        s = EcRemoteLinkedData.trimVersionFromUrl(s.toJson ? JSON.parse(s.toJson())["@id"] : s["@id"]);
    for (let ws of wses)
        try {
            ws.send(s);
        } catch(err) {
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.ERROR, "CassWsCustomError", err);
        }
});