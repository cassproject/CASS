if (process.env.NODEV == null)
{
    require('../main/server.js');
    global.events.server.ready.subscribe(async (isListening) => {
        if (isListening){
            console.log("Hijacking auditLogger to make test results easy to read.");
            global.auditLogger.oldReport = global.auditLogger.report;
            global.auditLogger.report = function (message, severity, category, facility) {};
        }
    });

    if (global.bindWebService == null) global.bindWebService = () => { };
}

describe('SkyRepo Adapter', function () {
  it('Waiting for server to be ready', async () => {
    if (process.env.NODEV != null) return;
    let ready = false;
    global.events.server.ready.subscribe(function (isReady) {
      if (!isReady) {
        console.log('Server not ready. Skipping tests.');
        return;
      }
      ready = true;
    });
    while (!ready) { await new Promise((resolve) => setTimeout(resolve, 100)); }
  }).timeout(60000);
});