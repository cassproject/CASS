require('../main/server.js');
global.events.server.ready.subscribe(async (isListening) => {
    if (isListening){
        console.log("Hijacking auditLogger to make test results easy to read.");
        global.auditLogger.oldReport = global.auditLogger.report;
        global.auditLogger.report = function (message, severity, category, facility) {};
    }
});

if (global.bindWebService == null) global.bindWebService = () => { };