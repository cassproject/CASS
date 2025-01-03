const checkDiskSpace = require('check-disk-space').default
const sendMail = require('./mailer.js').sendMail;

global.events.server.periodic.subscribe(async () => {
    try {
        let diskSpace = await checkDiskSpace(__dirname);
        let capacity = Math.round((diskSpace.free / diskSpace.size) * 100);
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, "CassDiskSpace", capacity+"% used.");
        if (capacity >= 75) { // 75% utilization
            await sendMail(`CaSS Server`, 'Disk Space Warning', `The CaSS Server at ${process.env.CASS_LOOPBACK} has reached ${capacity}% of disk capacity.`);
        }
    } catch (e) {
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.ERROR, "CassDiskSpaceJobError", e);
    }
});