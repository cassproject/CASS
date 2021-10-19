const {StaticPool} = require('node-worker-threads-pool');

const filePath = './src/main/server/profile/worker.js';

let pool = null;
let profileCache = global.profileCache = {};
let profileInProgress = global.profileInProgress = {};

let profileCalculator = async function(){    
    const subjectId = this.params.subject;
    const frameworkId = this.params.frameworkId;

    if (subjectId == null) 
        error("Subject not identified or does not exist.", 400);
    if (frameworkId == null)
        error("Framework not identified or does not exist.", 400);

    let framework = await EcFramework.get(frameworkId);
    if (framework == null)
        error("Framework not identified or does not exist.", 400);

    if (this.ctx.req.eim == null || this.ctx.req.eim.ids[0] == null)
        error("Server is not acting on behalf of a user, and has no ability to access data.", 400);

    let query_agent_pk = this.ctx.req.eim.ids[0].ppk.toPk().toPem();
    let query_agent_ppk = this.ctx.req.eim.ids[0].ppk.toPem();
    let subject = await anythingToPem(subjectId);
    
    const p = {subject: subjectId, frameworkId: frameworkId, query_agent: query_agent_ppk, flushCache: this.params.flushCache, params: this.params};

    // Perform caching check and establish cache key
    p.cacheKey = `${framework.shortId()}|${subject}|${query_agent_pk}|general`;
    if (this.params.flushCache == "true")
        delete profileInProgress[p.cacheKey];
    else if (process.env.PROFILE_CACHE == "true")
        if (profileInProgress[p.cacheKey] != null) { // Profile being computed elsewhere, delay
            if (new Date().getTime() - profileInProgress[p.cacheKey] < 60000) { // Proceed if it seems stuck
                console.log("Blocked - Profile computing elsewhere");
                await setTimeout(() => profileCalculator.call(this), 100);
                return;
            }
        }

    // Return the profile if it's already been computed
    const cached = profileCache[p.cacheKey];
    if (cached != null && (this.params.flushCache !== "true" && (process.env.PROFILE_CACHE == "true" || this.params.cache == "true"))) {
        cached.msSpeed = new Date().getTime() - p.timer;
        console.log("Cache hit - Profile already computed");
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

let workerData = {};
module.exports = async ()=>{
    pool = new StaticPool({
        size: 1,
        task: filePath,
        shareEnv: true,
        workerData: workerData
    });
};

/** Will NOT return null, but may throw errors. */
let anythingToPem = async(subject) => {
    if (typeof subject === "string" && subject.startsWith("-----BEGIN")) {
        return subject;
    }

    return anythingToPerson(subject).then(person => {
        if (person == null) throw new exports.NotFoundError();
        return person.owner[0];
    }).catch(e => {
        throw e;
    });
};

let anythingToPerson = async(subject) => {
    // No/Invalid subject?
    if (subject == null) throw new exports.ParseError();

    let result;

    // Subject is URL?
    if (typeof subject === "string" && subject.startsWith("http")) {
        const url = subject;
        let person;
        try {
            person = await EcPerson.get(url);
        } catch (e) {
            error(e,500);
        }

        if (person == null) 
            error("Person not found.",400);

        result = person;
    } else if (typeof subject === "string" && subject.startsWith("-----BEGIN")) {
        // Subject is PEM
        subject = EcPk.fromPem(subject).toPem();
        let person;
        try {
            person = await EcPerson.getByPk(repo, EcPk.fromPem(subject)).catch(() => {});
            if (person == null) {
                people = await cass.personSearch(`owner:"${subject}"`, {});
                people = people.filter((p) => p.owner[0] == subject);
                if (people.length > 0) person = people[0];
                if (people.length > 1) console.log("Looking for person, found people! " + people.length);
            }
        } catch (e) {
            console.trace(e);
            if (e instanceof TypeError) {
                throw new exports.ParseError();
            } else throw new exports.UnknownError(e.message);
        }

        if (person == null) throw new exports.NotFoundError("Could not find " + subject);

        result = person;
    } else if (typeof subject === "string") {
        // Subject is an Email or Username
        let people;
        try {
            people = await cass.personSearch(`email:"${subject}" OR username:"${subject}"`, {});
        } catch (e) {
            throw new exports.UnknownError(e.message);
        }
        if (people == null || people.length === 0) throw new exports.NotFoundError();

        result = people[0];
    }

    if (result != null) {
        if (result.personType != null && result.personType !== "Person")
            throw new exports.NotFoundError("No Person found for " + subject);
        return result;
    }

    throw new exports.ParseError();
}