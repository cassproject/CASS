// (Tyler, 06/07/21)
// The code here seems to work, though the accuracy of its output hasn't been completely validated.
// The logic for computing profile state properties (in post-processing step) must be reviewed.
// See TODO and CHECKME comments for more

// General notes
// * Triple - Stored as an edge in EcFrameworkGraph.edges, has:
//     * 'edge' (typeof any, but usually an EcAlignment)
//     * 'destination' (typeof vertex), and
//     * 'source' (typeof vertex)
// * EcFrameworkGraph - Is it a DAG? "EcDirectedGraph (may have multiple edges between two vertices)"
//     * g.addFramework - Adds vertices
//     * g.verticies - Competencies (typo in name)
//     * g.edges - Store Triples
//     * g.metaVerticies - Objects we can use to store information attached to each vertex
//                         Also modified by g.processAssertionsBoolean
//     * ? g.metaEdges - Unused
//     * g.getMetaStateCompetency(EcCompetency)
//     * g.processAssertionsBoolean(assertions, success, failure)
//         * Helper method to populate the graph with assertion data
//         * Populates each metaVertex's .positiveAssertion and .negativeAssertion properties
//         * Based on propagation rules implicit in the relations (see devs.cassproject.org, Relations)
//         * Does not draw conclusions
//         * "Must be able to decrypt 'negative' value"
// Algorithm:
//         The goal is to return an object holding a hierarchy of competencies, sourced from a single framework as well
//         as all frameworks attached to it through Relations (EcAlignments). Each competency will have information
//         attached to it including the related frameworks, resource alignments, the user's goals, assertions on the
//         user, and other information regarding how the goals & assertions relate to other related competencies (by
//         looking at relevant Relations).
//
//         An EcFrameworkGraph is constructed holding the given framework as well as all outside frameworks connected
//         by outside competencies within the graph's edges (Triple objects). This graph holds Vertices (which are
//         competencies) connected by these edges (which store EcRelations), as well was MetaVertices which are nothing
//         more than auxilliary storage containers for each competency (besides being populated with graph's
//         processAssertionsBoolean). We'll use the MetaVertices to store all information attached to each competency.
//         Once all relevant information is retrieved, we'll repeatedly iterate over each edge to update information
//         inside each meta-vertex based on how the edges' Relations (EcAlignments) relate to goals & assertions

const https = require('https');

let app;
require("cassproject");

const hashModuleRoot = require("node-object-hash");

// Newer versions of this library moved the function to a property
//
if (typeof hashModuleRoot !== "function")
    global.hasher = hashModuleRoot.hasher;
else
    global.hasher = hashModuleRoot;

const envHttps = process.env.HTTPS != null ? process.env.HTTPS.trim() == 'true' : false;

var repo = global.repo = new EcRepository();
repo.selectedServer = process.env.CASS_LOOPBACK || (envHttps ? "https://localhost/api/" : "http://localhost/api/");
if (envHttps) {
    https.globalAgent.options.rejectUnauthorized = false;
}
repo.selectedServerProxy = process.env.CASS_LOOPBACK_PROXY || null;

EcRepository.caching = true;
EcRepository.cachingSearch = true;
EcCrypto.caching = true;

const PRECACHE_ALL_FRAMEWORKS = true;
let allFrameworks = global.allFrameworks = []; // Cache of all frameworks
let profileFrameworks = global.profileFrameworks = {}; //Cache of constructed frameworks

// Access the workerData by requiring it.
let { parentPort, workerData } = require('worker_threads');

let initialized = false;

let glob = require('glob');
let path = require('path');
const EcPk = require("cassproject/src/com/eduworks/ec/crypto/EcPk");

global.auditLogger = require(path.resolve(glob.sync('src/main/server/shims/auditLogger.js')[0]));

const formatMemoryUsage = (data) => `${Math.round(data / 1024 / 1024 * 100) / 100} MB`;
let ProfileCalculator = require(path.resolve(glob.sync('src/main/server/profile/calculator.js')[0]));

global.lastFlush = Date.now();
// Main thread will pass the data you need through this event listener.
parentPort.on('message', async (param) => {
    try {

        const subject = param.subject;
        const frameworkId = param.frameworkId;
        const query_agent = param.query_agent;

        let userChanged = true;
        if (EcIdentityManager.default.ids.length > 0)
            if (JSON.stringify(EcIdentityManager.default.ids.map(x => x.ppk.toPem())) == JSON.stringify(query_agent));
        userChanged = false;
        EcIdentityManager.default.clearIdentities();
        if (param.lastFlush != global.lastFlush) {
            global.lastFlush = param.lastFlush;
            global.auditLogger.report(global.auditLogger.LogCategory.PROFILE, global.auditLogger.Severity.INFO, "WorkerMessage", "Flushing cache (cause: new Assertions).");
            EcRepository.cache = {};
        }
        if (param.flushCache == "true") {
            global.auditLogger.report(global.auditLogger.LogCategory.PROFILE, global.auditLogger.Severity.INFO, "WorkerMessage", "Flushing cache.");
            EcRepository.cache = {};
            allFrameworks = global.allFrameworks = [];
            profileFrameworks = global.profileFrameworks = {};
        }
        if (userChanged) {
            EcCrypto.cache = {};
            EcRepository.cache = {};
        }

        const memoryData = process.memoryUsage();
        if (memoryData.heapUsed > 750 * 1024 * 1024) {

            global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.DEBUG, 'ProfileWorkerCryptoCacheCleared', "Hit high water memory mark, clearing crypto cache.");
            EcCrypto.cache = {};
            if (global.gc && process.memoryUsage().heapUsed > 500 * 1024 * 1024) {
                global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.DEBUG, 'ProfileWorkerProfileFrameworksCleared', "Hit high water memory mark, clearing profile frameworks cache.");
                global.profileFrameworks = {};
                if (global.gc) global.gc();
            }
            if (global.gc && process.memoryUsage().heapUsed > 500 * 1024 * 1024) {
                global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.DEBUG, 'ProfileWorkerAllFrameworksCleared', "Hit high water memory mark, clearing all frameworks cache.");
                global.allFrameworks = {};
                if (global.gc) global.gc();
            }
            if (process.memoryUsage().heapUsed > 400 * 1024 * 1024) {
                global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.DEBUG, 'ProfileWorkerRepositoryCacheCleared', "Hit high water memory mark, clearing repository cache.");
                EcRepository.cache = {};
                if (global.gc) global.gc();
            }
            if (global.gc) global.gc();
        }

        for (let a of query_agent) {
            global.agent = new EcIdentity();
            global.agent.ppk = EcPpk.fromPem(a);
            global.agent.displayName = "User";
            EcIdentityManager.default.addIdentity(global.agent);
        }

        let cacheInsertCounter = 0;

        if (!initialized) {
            initialized = true;
            if (workerData.repoCache != null) {
                for (let key in workerData.repoCache) {
                    if (EcRepository.cache[key] == null) {
                        EcRepository.cache[key] = new EcRemoteLinkedData();
                        EcRepository.cache[key].copyFrom(workerData.repoCache[key]);
                        cacheInsertCounter++;
                    }
                }
            }

            if (workerData.cryptoCache != null) {
                for (let key in workerData.cryptoCache) {
                    if (EcCrypto.decryptionCache[key] == null) {
                        EcCrypto.decryptionCache[key] = workerData.cryptoCache[key];
                        cacheInsertCounter++;
                    }
                }
            }

            if (workerData.allFrameworks != null) {
                allFrameworks = [];
                for (let framework of workerData.allFrameworks) {
                    let f = new EcFramework();
                    f.copyFrom(framework);
                    allFrameworks.push(f);
                }
            }
            workerData = null;
            global.auditLogger.report(global.auditLogger.LogCategory.PROFILE, global.auditLogger.Severity.INFO, "WorkerMessage", `cache updated with ${cacheInsertCounter} items`);
        }
        if (allFrameworks.length == 0) {
            allFrameworks = await EcFramework.search(repo, "@type:Framework", null, null, { size: 10000 });
            global.auditLogger.report(global.auditLogger.LogCategory.PROFILE, global.auditLogger.Severity.INFO, "WorkerMessage", `Profile Calculator: Fetched ${allFrameworks.length} frameworks for determining network effects.`);
        }

        const p = new ProfileCalculator();
        p.params = param.params;

        // Get necessary information on person from subject
        try {
            p.person = await global.anythingToPerson(subject);
            p.pem = await global.anythingToPem(subject);
            if (EcArray.isArray(p.pem))
                p.pk = p.pem.map((p) => EcPk.fromPem(p));
            else
                p.pk = EcPk.fromPem(p.pem);
            if (EcArray.isArray(p.pk))
                p.fingerprint = p.pk.map((p) => p.fingerprint());
            else
                p.fingerprint = p.pk.fingerprint();
        } catch (e) {
            global.auditLogger.report(global.auditLogger.LogCategory.PROFILE, global.auditLogger.Severity.ERROR, "WorkerMessage", e);
            return;
        }

        // Get framework from ID
        p.frameworkId = frameworkId;
        try {
            p.framework = await EcFramework.get(frameworkId, null, null, repo);
        } catch (e) {
            global.auditLogger.report(global.auditLogger.LogCategory.PROFILE, global.auditLogger.Severity.ERROR, "WorkerMessage", e);
            throw e;
        }

        let profile = await p.calculate();
        try {
            // return the result to main thread.
            // FR: Somewhere sometimes there's a promise being put in this data structure.
            parentPort.postMessage(JSON.parse(JSON.stringify(profile)));
        } catch (ex) {
            console.trace(ex);
            global.auditLogger.report(global.auditLogger.LogCategory.PROFILE, global.auditLogger.Severity.ERROR, "WorkerMessage", e);
            parentPort.postMessage({ error: ex });
            throw ex;
        }
    } catch (ex) {
        console.trace(ex);
        throw ex;
    }
});