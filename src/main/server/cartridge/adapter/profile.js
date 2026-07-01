const { StaticPool } = require('node-worker-threads-pool');

const filePath = './src/main/server/profile/worker.js';
require("../../profile/util.js");

let pool = null;
let profileInProgress = global.profileInProgress = {};

let profileCalculator = async function () {
    const subjectId = this.params.subject;
    const frameworkId = this.params.frameworkId;
    if (this.params.flushCache != null && this.params.flushCache) {
        EcRepository.cacheBacking = {};
    }

    if (subjectId == null)
        error("Subject not identified or does not exist.", 400);
    if (frameworkId == null)
        error("Framework not identified or does not exist.", 400);

    let query_agent_fingerprint = [];
    let query_agent_pk = [];
    let query_agent_ppk = [];
    if (this?.ctx?.req?.eim) {
        query_agent_pk.push(...this.ctx.req.eim.ids.map(x => x.ppk.toPk().toPem()));
        query_agent_ppk.push(...this.ctx.req.eim.ids.map(x => x.ppk.toPem()));
        query_agent_fingerprint.push(...this.ctx.req.eim.ids.map(x => x.ppk.toPk().fingerprint()));
    }
    if (process.env.PROFILE_PPK != null) {
        query_agent_ppk.push(process.env.PROFILE_PPK);
        query_agent_pk.push(EcPpk.fromPem(query_agent_ppk).toPk().toPem());
        query_agent_fingerprint.push(EcPpk.fromPem(query_agent_ppk).toPk().fingerprint());
    }

    if (query_agent_ppk.length == 0)
        error("Server is not acting on behalf of a user, and has no ability to access data.", 400);

    let subject = await anythingToPem(subjectId);

    let paramsCopy = { ...this.params };
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
        if (profile.error == null) {
            // if (process.env.PROFILE_CACHE == "true" || this.params.cache == "true")
            await global.ephemeral.put(p.cacheKey, profile, new Date().getTime() + (process.env.PROFILE_TTL || 30 * 24 * 60 * 60 * 1000));
            delete profileInProgress[p.cacheKey];
            return JSON.stringify(profile);
        }
    } catch (ex) {
        console.trace(ex);
        error(ex, 500);
    }
    if (profile.error != null) {
        error(profile.error, 500);
    }
}

/**
 * @openapi
 * /api/profile/latest:
 *   get:
 *     tags:
 *       - Profile
 *     summary: Compute the current state of the learner
 *     x-mcp-tool-name: get_learner_profile
 *     x-mcp-description: >
 *       Use this tool to answer the question "what does this person know?"
 *       Given a learner and a competency framework, this tool computes a
 *       complete profile showing which competencies the learner has positive
 *       evidence for, negative evidence for, or no evidence at all.
 *       REQUIRED PARAMETERS - frameworkId (the full URL of a CaSS Framework)
 *       and subject (identifies the learner by email, username, Person URL,
 *       or PEM public key). Both are mandatory.
 *       BOUNDARIES - Do NOT use this tool to search for frameworks or
 *       people. Use search_data first to find the right frameworkId and
 *       subject values. Do NOT use this tool to record evidence. Use
 *       record_evidence to create assertions first, then call this tool
 *       to see the updated profile.
 *     x-mcp-hints: >
 *       FINDING INPUTS - To get a frameworkId, call search_data with
 *       q=@type:Framework and a keyword. To identify a subject, use an
 *       email address directly, or call search_data to look up a Person
 *       record.
 *       SUBJECT FORMATS - The subject parameter accepts: an email address
 *       (e.g. jane.doe@example.com), a username, a full CaSS Person URL
 *       (e.g. https://server/api/data/schema.org.Person/uid), or a PEM
 *       public key.
 *       RESPONSE STRUCTURE - The response is a tree of competencies. Each
 *       node contains id (competency URL), name, children (sub-competencies),
 *       and a state object. Key state fields: hasPositiveEvidence (boolean),
 *       hasNegativeEvidence (boolean), latestEvidenceIsPositive (true/false/null),
 *       distinctPositiveSignatures and distinctNegativeSignatures (counts of
 *       unique authorities), isGoal (boolean).
 *       CACHING - Profiles may be cached. Set flushCache=true after recording
 *       new evidence to force recalculation. Set cache=true for faster repeat
 *       queries when freshness is not critical.
 *       TYPICAL WORKFLOW - (1) Call search_data to find the framework,
 *       (2) Identify the person (email or search for a Person record),
 *       (3) Call get_learner_profile with frameworkId and subject,
 *       (4) Inspect each competency node's state fields to determine mastery
 *       and gaps.
 *     description: Computes the current state of the learner given a framework. Returns an object representing the learner's profile, including calculated competency levels.
 *     parameters:
 *       - $ref: '#/components/parameters/frameworkId'
 *       - $ref: '#/components/parameters/subject'
 *       - $ref: '#/components/parameters/flushCache'
 *       - $ref: '#/components/parameters/cache'
 *       - $ref: '#/components/parameters/targetDateTime'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Learner competency profile tree with evidence state per competency.
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The framework URL this profile was computed against.
 *                 children:
 *                   type: array
 *                   description: Top-level competencies in the framework hierarchy.
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The competency URL.
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       children:
 *                         type: array
 *                         description: Sub-competencies (recursive tree structure).
 *                         items:
 *                           type: object
 *                       state:
 *                         type: object
 *                         description: Evidence summary for this competency.
 *                         properties:
 *                           hasPositiveEvidence:
 *                             type: boolean
 *                           hasNegativeEvidence:
 *                             type: boolean
 *                           latestEvidenceIsPositive:
 *                             type: boolean
 *                             nullable: true
 *                           hasAnyChildrenWithPositiveEvidence:
 *                             type: boolean
 *                           distinctPositiveSignatures:
 *                             type: integer
 *                           distinctNegativeSignatures:
 *                             type: integer
 *                           isGoal:
 *                             type: boolean
 *                           isHighPriorityGoal:
 *                             type: boolean
 *                 msSpeed:
 *                   type: integer
 *                   description: Milliseconds taken to compute the profile.
 *       400:
 *         description: Missing required parameters or server not acting on behalf of a user.
 */

let lastFlush = Date.now();
global.profileFlush = () => {
    lastFlush = Date.now();
}

if (!global.disabledAdapters['profile']) {
    bindWebService("/profile/latest", global.calculateProfile = profileCalculator);

    let workerData = {};
    pool = new StaticPool({
        size: 1,
        task: filePath,
        shareEnv: true,
        workerData: workerData,
        resourceLimits: {
            maxYoungGenerationSizeMb: process.env.WORKER_MAX_MEMORY || 1024,
            maxOldGenerationSizeMb: process.env.WORKER_MAX_MEMORY || 1024
        }
    });

    require("../../profile/controller.js");
}