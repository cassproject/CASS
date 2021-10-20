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

require("cassproject");
const https = require('https');
global.hasher = require('node-object-hash');

const envHttps = process.env.HTTPS != null ? process.env.HTTPS.trim() == 'true' : false;

global.repo = new EcRepository();
repo.selectedServer = process.env.CASS_LOOPBACK || (envHttps ? "https://localhost/api/" : "http://localhost/api");
if (envHttps)
{
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
let {parentPort, workerData} = require('worker_threads');

let initialized = false;

let glob = require('glob');
let path = require('path');

let ProfileCalculator = require(path.resolve(glob.sync( 'src/main/server/profile/calculator.js' )[0]));

// Main thread will pass the data you need through this event listener.
parentPort.on('message', async(param) => {
    const subject = param.subject;
    const frameworkId = param.frameworkId;
    const query_agent = param.query_agent;

    let userChanged = true;
    if (EcIdentityManager.default.ids.length > 0)
        if (EcIdentityManager.default.ids[0].ppk.toPem() == query_agent);
            userChanged = false;
    EcIdentityManager.default.clearIdentities();
    if (param.flushCache == "true")
    {
        EcRepository.cache = {};
        allFrameworks = [];
        profileFrameworks = {};
    }
    if (userChanged)
    {
        EcCrypto.cache = {};
        EcRepository.cache = {};
    }

    global.agent = new EcIdentity();
    agent.ppk = EcPpk.fromPem(query_agent);
    agent.displayName = "User";
    EcIdentityManager.default.addIdentity(agent);

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
        console.log("cache updated with " + cacheInsertCounter + " items");
    }
    if (allFrameworks.length == 0)
    {
        allFrameworks = await EcFramework.search(repo,"*",null,null,{size:10000});
        console.log("Profile Calculator: Fetched " + allFrameworks.length + " frameworks for determining network effects.");
    }

    const p = new ProfileCalculator();
    p.params = param.params;

    // Get necessary information on person from subject
    try {
        if (subject.startsWith("http"))
            p.person = await EcPerson.get(subject);
        else if (subject.startsWith("-----"))
            p.person = await EcPerson.getByPk(repo, EcPk.fromPem(subject)).catch(() => {});   
        if (p.person == null) {
            let people = await EcPerson.search(repo,`owner:"${subject}"`, {});
            people = people.filter((p) => p.owner[0] == subject);
            if (people.length > 0) p.person = people[0];
            if (people.length > 1) console.log("Looking for person, found people! " + people.length);
        }
        p.pem = p.person.owner[0];
        p.pk = EcPk.fromPem(p.pem);
        p.fingerprint = p.pk.fingerprint();
    } catch (e) {
        console.trace(e);
        return;
    }

    // Get framework from ID
    p.frameworkId = frameworkId;
    try {
        p.framework = await EcFramework.get(frameworkId);
    } catch (e) {
        console.trace(e);
        throw e;
    }

    let profile = await p.calculate();
    try {
        // return the result to main thread.
        // FR: Somewhere sometimes there's a promise being put in this data structure.
        parentPort.postMessage(JSON.parse(JSON.stringify(profile)));
    } catch (ex) {
        console.trace(ex);
        parentPort.postMessage({error: ex});
        throw ex;
    }
});