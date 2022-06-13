const EcArray = require('cassproject/src/com/eduworks/ec/array/EcArray');
const {StaticPool} = require('node-worker-threads-pool');

const filePath = './src/main/server/profile/worker.js';
require("./util.js");

let pool = null;
let profileCache = global.profileCache = {};
let profileInProgress = global.profileInProgress = {};

let profileCalculator = async function(){    
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

    let framework = await EcFramework.get(frameworkId);
    if (framework == null)
        error("Framework not identified or does not exist.", 400);

    let query_agent_pk = null;
    let query_agent_ppk = null;
    if (this.ctx.req.eim != null && this.ctx.req.eim.ids[0] != null)
    {
        query_agent_pk = this.ctx.req.eim.ids[0].ppk.toPk().toPem();
        query_agent_ppk = this.ctx.req.eim.ids[0].ppk.toPem();
    }
    if (process.env.PROFILE_PPK != null)
    {
        query_agent_ppk = process.env.PROFILE_PPK;
        query_agent_pk = EcPpk.fromPem(query_agent_ppk).toPk().toPem();
    }

    if (query_agent_ppk == null)
        error("Server is not acting on behalf of a user, and has no ability to access data.", 400);

    let subject = await anythingToPem(subjectId);
    
    const p = {
        subject: subjectId, 
        frameworkId: frameworkId, 
        query_agent: query_agent_ppk, 
        flushCache: this.params.flushCache, 
        lastFlush: lastFlush,
        params: this.params
    };

    // Perform caching check and establish cache key
    p.cacheKey = `${framework.shortId()}|${subject}|${query_agent_pk}|${EcCrypto.md5(JSON.stringify(p.params))}|general`;
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

    // Return the profile if it's already been computed
    const cached = profileCache[p.cacheKey];
    if (cached != null && (this.params.flushCache !== "true" && (process.env.PROFILE_CACHE == "true" || this.params.cache == "true"))) {
        cached.msSpeed = new Date().getTime() - p.timer;
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
            if (process.env.PROFILE_CACHE == "true" || this.params.cache == "true")
                profileCache[p.cacheKey] = profile;
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

bindWebService("/profile/latest", profileCalculator);

let lastFlush = Date.now();
let workerData = {};
module.exports = async ()=>{
    pool = new StaticPool({
        size: 1,
        task: filePath,
        shareEnv: true,
        workerData: workerData
    });
    global.profileFlush = ()=>{
        lastFlush = Date.now();
        profileCache = global.profileCache = {};
    }
};