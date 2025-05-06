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

require('express-ws')(global.app, global.server);
let wses = [];
app.ws('/ws/custom', function(ws, req) {
    wses.push(ws);
    if (this.ctx?.req?.eim?.ids)
        global.events.person.doPing(this.ctx?.req?.eim?.ids.map((identity) => identity.ppk.toPem()));
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