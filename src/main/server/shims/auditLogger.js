const EcArray = require('cassproject/src/com/eduworks/ec/array/EcArray');

const sendMail = require('./mailer.js').sendMail;

const SyslogFacility = {
    USER: 1, // user
    DAEMON: 3, // daemon - anything that runs in the background like jobs
    AUTH: 4, // auth - anything that deals with authentication or authorization
    FTP: 11, // ftp - transferring files in and out of the server
    NETWORK: 16, // local0 - network traffic related like HTTP POST, GET, and DELETE
    STORAGE: 17, // local1 - things like DBs
    STANDARD: 18, // local2 - anything that doesn't fit into other categories most likely goes here

    // theses are open still, syslog format says that we can go from 16-23 for custom
    // facility ids and still be in spec
    // OPEN1, //local3
    // OPEN2, //local4
    // OPEN3, //local5
    // OPEN4, //local6
    // OPEN5 //local7
};

const LogCategory = {
    SYSTEM: 'sys',
    AUTH: 'auth',
    MESSAGE: 'msg',
    FILE_SYSTEM: 'fs',
    NETWORK: 'net',
    STORAGE: 'stor',
    ADAPTER: 'adap',
    PROFILE: 'prof',
};

const Severity = {
    EMERGENCY: 0, // system isn't working
    ALERT: 1, // system needs attention
    CRITICAL: 2, // code path has failed
    ERROR: 3, // code path has failed, but can recover
    WARNING: 4, // unusual conditions
    NOTICE: 5, // normal but unlikely
    INFO: 6, // normal
    DEBUG: 7, // extra information
    NETWORK: 8, // traffic information
};

const InverseSeverity = {
    0: 'EMERGENCY',
    1: 'ALERT    ',
    2: 'CRITICAL ',
    3: 'ERROR    ',
    4: 'WARNING  ',
    5: 'NOTICE   ',
    6: 'INFO     ',
    7: 'DEBUG    ',
    8: 'NETWORK  ',
};

let logBuffers = [];
let timeoutHandler;
let previousHash = '';


let flush = function () {
    try {
        if (logBuffers.length > 0) {
            console.log(logBuffers.join('\n'));
            logBuffers = [];
            if (timeoutHandler) {
                clearTimeout(timeoutHandler);
                timeoutHandler = undefined;
            }
        }
    } catch (e) {
        sendMail(`CaSS Server`, 'Logging Failure', `The CaSS Server at ${process.env.CASS_LOOPBACK} experience a logging failure: ${e}.`);
    }
};

let hash = function (msg) {
    let concat = previousHash + msg;
    let newHash = EcCrypto.md5(concat);
    previousHash = newHash;
    return `${newHash} ${msg}`;
};

let syslogFormat = function (facility, severity, timestamp, msgID, data) {
    // RFC 3164
    let msg = hash(`<${(SyslogFacility.USER * 8) + severity}>${timestamp.toISOString()} ${global.repo.selectedServer} ${facility + msgID.trim().substr(0, 27)} ${data}`);
    return msg;
};

/*
   * @param message must be 27 or fewer characters and no spaces otherwise it will be truncated to 27
   */
let report = function (system, severity, message, ...data) {
    if (process.env.PRODUCTION == 'true') {
        try {
            if (filterLogs(system, severity, message)) {
                const msg = JSON.stringify({ date: new Date(), message, data, system, severity });
                logBuffers.push(hash(msg));
            }
            if (logBuffers.length > 1000) {
                flush();
            } else {
                if (!timeoutHandler) {
                    timeoutHandler = setTimeout(flush, 5000);
                }
            }
        } catch (e) {
            sendMail(`CaSS Server`, 'Logging Failure', `The CaSS Server at ${process.env.CASS_LOOPBACK} experience a logging failure: ${e}.`);
        }
    } else {
        if (data.length == 1) {
            data = data[0];
        }
        if (severity <= 6 || global.skyrepoDebug) {
            try {
                if (severity == 3)
                    console.trace(data?.[0]);
                if (EcArray.isArray(data)) data = JSON.stringify(data);
                console.log(new Date(), system, (((v8.getHeapStatistics().used_heap_size) / 1024 / 1024).toFixed(0))+"M", InverseSeverity[severity], '', message.substr(0, 18), '\t:', data);
            } catch (ex) {
                console.trace(new Date(), system, (((v8.getHeapStatistics().used_heap_size) / 1024 / 1024).toFixed(0))+"M", InverseSeverity[severity], '', message.substr(0, 18), '\t:',ex);
            }
        }
    }
};

let filteredCategories = {};
let filteredSeverities = {};
let filteredMessages = {};
if (process.env.LOG_FILTERED_CATEGORIES) {
    try {
        let arr = process.env.LOG_FILTERED_CATEGORIES.split(',');
        for (let str of arr) {
            filteredCategories[str.trim().toLowerCase()] = 1;
        }
    } catch (e) {
        report(LogCategory.SYSTEM, Severity.ERROR, 'AuditLogCategoriesError', e);
    }
}

if (process.env.LOG_FILTERED_SEVERITIES) {
    try {
        let arr = process.env.LOG_FILTERED_SEVERITIES.split(',');
        for (let str of arr) {
            filteredSeverities[str.trim().toUpperCase()] = 1;
        }
    } catch (e) {
        report(LogCategory.SYSTEM, Severity.ERROR, 'AuditLogSeveritiesError', e);
    }
}

if (process.env.LOG_FILTERED_MESSAGES) {
    try {
        let arr = process.env.LOG_FILTERED_MESSAGES.split(',');
        for (let str of arr) {
            filteredMessages[str.trim()] = 1;
        }
    } catch (e) {
        report(LogCategory.SYSTEM, Severity.ERROR, 'AuditLogMessagesError', e);
    }
}

let filterLogs = function (system, severity, message) {
    if (filteredCategories[system]) {
        return false;
    }
    if (filteredSeverities[InverseSeverity[severity]]) {
        return false;
    }
    return !(filteredMessages[message]);
};

module.exports = {
    report,
    flush,
    LogCategory,
    Severity,
};
