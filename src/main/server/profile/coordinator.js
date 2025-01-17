const EcArray = require('cassproject/src/com/eduworks/ec/array/EcArray');
const {StaticPool} = require('node-worker-threads-pool');

const filePath = './src/main/server/profile/worker.js';
require("./util.js");

let pool = null;
let profileCache = global.profileCache = {};
let profileInProgress = global.profileInProgress = {};

let profileCalculator = async function() {
    const subjectId = this.params.subject;
    const frameworkId = this.params.frameworkId;
    if (this.params.flushCache != null && this.params.flushCache)
    {
        EcRepository.cache = {};
        profileCache = global.profileCache = {};
    }

    if (subjectId == null) 
        error("Subject not identified or does not exist.", 400);
    if (frameworkId == null)
        error("Framework not identified or does not exist.", 400);

    let query_agent_fingerprint = [];
    let query_agent_pk = [];
    let query_agent_ppk = [];
    if (this?.ctx?.req?.eim)
    {
        query_agent_pk.push(...this.ctx.req.eim.ids.map(x => x.ppk.toPk().toPem()));
        query_agent_ppk.push(...this.ctx.req.eim.ids.map(x => x.ppk.toPem()));
        query_agent_fingerprint.push(...this.ctx.req.eim.ids.map(x => x.ppk.toPk().fingerprint()));
    }
    if (process.env.PROFILE_PPK != null)
    {
        query_agent_ppk.push(process.env.PROFILE_PPK);
        query_agent_pk.push(EcPpk.fromPem(query_agent_ppk).toPk().toPem());
        query_agent_fingerprint.push(EcPpk.fromPem(query_agent_ppk).toPk().fingerprint());
    }

    if (query_agent_ppk.length == 0)
        error("Server is not acting on behalf of a user, and has no ability to access data.", 400);

    let subject = await anythingToPem(subjectId);
    
    let paramsCopy = {...this.params};
    delete paramsCopy.subject;
    delete paramsCopy.frameworkId;
    delete paramsCopy.flushCache;
    delete paramsCopy.cache;
    delete paramsCopy.autoComputed;
    delete paramsCopy.methodType;
    delete paramsCopy.urlRemainder;
    const p = {
        subject: subject, 
        frameworkId: frameworkId, 
        query_agent: query_agent_ppk, 
        flushCache: this.params.flushCache, 
        lastFlush: lastFlush,
        params: paramsCopy
    };

    // Perform caching check and establish cache key
    p.cacheKey = `${EcRemoteLinkedData.trimVersionFromUrl(frameworkId).split("/").pop()}|${EcPk.fromPem(subject).fingerprint()}|-${query_agent_fingerprint.join('-')}|${EcCrypto.md5(JSON.stringify(p.params))}|general`;
    if (this.params.flushCache == "true")
        delete profileInProgress[p.cacheKey];
    else if (process.env.PROFILE_CACHE == "true") {
        if (profileInProgress[p.cacheKey] != null) { // Profile being computed elsewhere, delay
            if (new Date().getTime() - profileInProgress[p.cacheKey] < 60000) { // Proceed if it seems stuck
                global.auditLogger.report(global.auditLogger.LogCategory.PROFILE, global.auditLogger.Severity.INFO, "ProfileCalculator", "Blocked - Profile computing elsewhere");
                await setTimeout(() => profileCalculator.call(this), 100);
                return;
            }
        }
    }
    console.log(p.params);
    console.log(p.cacheKey);

    // Return the profile if it's already been computed
    const cached = await global.ephemeral.get(p.cacheKey);
    if (cached != null && (this.params.flushCache !== "true" && (process.env.PROFILE_CACHE == "true" || this.params.cache == "true"))) {
        cached.msSpeed = new Date().getTime() - p.timer;
        if (this.params.autoComputed != true)
            global.auditLogger.report(global.auditLogger.LogCategory.PROFILE, global.auditLogger.Severity.INFO, "ProfileCalculator", "Cache hit - Profile already computed");
        return JSON.stringify(cached);
    }

    // Mark this profile as currently being computed, in case another request is made for this profile
    profileInProgress[p.cacheKey] = new Date().getTime();

    let profile = null;
    try {
        profile = await pool.exec(p);
        if (profile.error == null)
        {
            // if (process.env.PROFILE_CACHE == "true" || this.params.cache == "true")
            await global.ephemeral.put(p.cacheKey,profile,new Date().getTime()+24*60*60*1000);
            delete profileInProgress[p.cacheKey];
            return JSON.stringify(profile);
        }
    } catch (ex) {
        error(ex,500);
    }
    if (profile.error != null)
    {
        error(profile.error,500);
    }
}
let oldError = global.error;
global.error = (error)=>{console.trace(error);oldError(error);}

if (!global.disabledAdapters['profile']) {
    bindWebService("/profile/latest", global.calculateProfile = profileCalculator);
}


let lastFlush = Date.now();
let workerData = {};
module.exports = async ()=>{
    pool = new StaticPool({
        size: 1,
        task: filePath,
        shareEnv: true,
        workerData: workerData,
        resourceLimits: {
            maxYoungGenerationSizeMb: process.env.WORKER_MAX_MEMORY || 512,
            maxOldGenerationSizeMb: process.env.WORKER_MAX_MEMORY || 512
        }
    });
    global.profileFlush = ()=>{
        lastFlush = Date.now();
        profileCache = global.profileCache = {};
    }
};

require("./controller.js");