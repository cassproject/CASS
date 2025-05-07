const checkDiskSpace = require('check-disk-space').default
const sendMail = require('./mailer.js').sendMail;

let counter = 0;
global.events.server.periodic.subscribe(async () => {
    if (counter++ % 60 == 0)
    try {
        let diskSpace = await checkDiskSpace(__dirname);
        let capacity = Math.round((diskSpace.free / diskSpace.size) * 100);
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, "CassDiskSpace", capacity+"% free.");
        if (capacity < 25) { // 75% utilization
            await sendMail(`CaSS Server`, 'Disk Space Warning', `The CaSS Server at ${process.env.CASS_LOOPBACK} has reached ${capacity}% disk free capacity.`);
        }
    } catch (e) {
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.ERROR, "CassDiskSpaceJobError", e);
    }
});