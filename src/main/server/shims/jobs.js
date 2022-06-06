var CronJob = require('cron').CronJob;
const checkDiskSpace = require('check-disk-space').default
const sendMail = require('./mailer.js').sendMail;

let diskSpaceJob = new CronJob(
    '0 * * * * *', // Every minute
    async function() {
        try {
            let diskSpace = await checkDiskSpace(__dirname);
            let capacity = Math.round((diskSpace.free / diskSpace.size) * 100);
            if (capacity >= 75) { // 75% utilization
                await sendMail(`CaSS Server`, 'Disk Space Warning', `The CaSS Server at ${process.env.CASS_LOOPBACK} has reached ${capacity}% of disk capacity.`);
            }
        } catch (e) {
            console.error(e);
        }
    },
    null,
    true
)