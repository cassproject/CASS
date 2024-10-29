
// ANSI Escape codes, for terminal readability
const blue = "\x1b[38;5;38m";
const red = "\x1b[38;5;196m";
const orange = "\x1b[38;5;208m";
const gray = "\x1b[38;5;242m";
// const gold = "\x1b[38;5;227m";
// const blink = "\x1b[5m";
const reset = "\x1b[0m";

const _ = () => {};

const calculatorVersion = 4;

// Library (node-object-hash) for generating hashes of JS objects.
// Used to determine when rippling properties are done being computed.
const hashSortCoerce = hasher({sort: false, coerce: false});

// Globals defined at beginning of profile calculation
const TRACE_SOURCE = false; // Logs the framework name and entire subject PEM with each console log

const PROFILE_REPOSITORY_CACHE = process.env.PROFILE_REPOSITORY_CACHE || false;

//Coprocessor Initialization
let glob = require('glob');
let path = require('path');
let PRECACHE_ALL_FRAMEWORKS = true;

let coprocessors = [];
let coprocessorConfiguration = "";
glob.sync( 'src/main/server/profile/coprocessors/*.js' ).forEach( function( file ) {
    let coprocessor = require( path.resolve( file ) );
    if (coprocessor.enabled !== false)
    {
        coprocessors.push(coprocessor);
        coprocessorConfiguration += path.resolve(file) + coprocessor.version;
    }
});
coprocessorConfiguration = EcCrypto.md5(coprocessorConfiguration);
coprocessors.sort((a,b)=>{return a.order - b.order});

module.exports = class ProfileCalculator {
    constructor() {
        this.timer = new Date().getTime(); // Time at start of execution
        this.timerTotal = new Date().getTime(); // Time at start of execution
        this.res = undefined;
        this.cacheKey = undefined;
        this.after = undefined;
        this.person = undefined;
        this.pk = undefined;
        this.pem = undefined;
        this.g = undefined;
        this.fingerprint = undefined;
        this.frameworkId = undefined;
        this.cache = true;
        this.framework = undefined; // EcFramework
        this.precaching = false;
    }

    /** Prints current operation to the console. (Consider outputting to a log file if needed) */
    log(msg) {
        const ms = new Date().getTime() - this.timer;
        const msTotal = new Date().getTime() - this.timerTotal;
        if (TRACE_SOURCE) global.auditLogger.report(global.auditLogger.LogCategory.PROFILE, global.auditLogger.Severity.INFO, "Calculator",
            `${blue}${this.fingerprint}${reset}\n` +
            `${orange}${this.framework.getName()}${reset}\n` +
            `${gray}(${ms}ms)${reset}\n`
        )
        this.timer = new Date().getTime();
        global.auditLogger.report(global.auditLogger.LogCategory.PROFILE, global.auditLogger.Severity.INFO, "Calculator", `${msg} (${ms} ms step, ${msTotal} ms total)`);
    }

    /** Prints an error to the console, but doesn't stop execution. */
    err(msg, e) {
        global.auditLogger.report(global.auditLogger.LogCategory.PROFILE, global.auditLogger.Severity.ERROR, "Calculator", `${red}WARNING:${reset} ${msg}`);
        if (e != null) global.auditLogger.report(global.auditLogger.LogCategory.PROFILE, global.auditLogger.Severity.ERROR, "Calculator", e);
    }

    // Calculate the profile
    async calculate() {
        if (this.g == null) {
            let cacheKey = "graph_"+this.frameworkId;
            this.g = profileFrameworks[cacheKey];
            if (this.g == null) {
                this.g = new EcFrameworkGraph();

                // Add the framework to the graph
                await this.g.addFramework(this.framework, repo, _, _);

                // Insert resource alignments
                await Promise.all(coprocessors.map(async(coprocessor)=>{await coprocessor.insertResources.call(this)}));

                // Recursively add outside (aka related) frameworks to graph, based on framework's relations stored in graph's edges
                await this.insertOutsideFrameworks([this.framework.shortId()]);

                profileFrameworks[cacheKey] = cloneGraph(this.g);
                this.log(`Computed graph structure. ${this.g.verticies.length} vertices`);
            } else {
                this.log("Graph cache hit.");
                this.g = cloneGraph(this.g);
            }
        } else {
            this.log(`Provided graph structure. ${this.g.verticies.length} vertices`);
        }

        let assertionHash = null;
        // Search for assertions about the subject for later in the background
        let assertions = [];
        await Promise.all(coprocessors.map(async(coprocessor)=>{assertions = assertions.concat(await coprocessor.fetchAssertions.call(this))}));
        assertions = assertions.filter((x)=>x); //Remove nulls.
        for (let i = 0;i < assertions.length;i++) //Remove duplicates.
        {
            for (let j = i;j < assertions.length;j++)
            {
                if (j == i) continue;
                while (assertions[i].id == assertions[j].id) 
                    assertions.splice(j,1);
            }
        }
        
        if (this.frameworkId != null)
            if (this.framework == null)
                this.framework = await EcFramework.get(this.frameworkId,null,null,repo,eim);

        let profileKey = null;
        let storedProfile = null;

        if (this.framework.id != null && PROFILE_REPOSITORY_CACHE) {
            let frameworkIdHash = EcCrypto.md5(this.framework.id);
            profileKey = calculatorVersion + "_" + frameworkIdHash + "_" + assertionHash + "_" + EcCrypto.md5(this.person.id) + "_" + coprocessorConfiguration;
            let storedProfile = new EcRemoteLinkedData("https://schema.cassproject.org/0.4/", "StoredProfile");
            storedProfile.assignId(repo.selectedServer, profileKey);

            if (this.cache == true)
                try {
                    storedProfile = await EcRepository.get(storedProfile.shortId());
                    if (storedProfile != null && this.precaching) {
                        this.log("Cache hit (Repository)");
                        return;
                    }
                    storedProfile = await EcEncryptedValue.fromEncryptedValue(storedProfile);
                    this.log("Cache hit (Repository)");
                    if (EcObject.isObject(storedProfile.result))
                        return storedProfile.result;
                    else
                        return JSON.parse(storedProfile.result);
                } catch (ex) {
                    storedProfile = null;
                }
            else
                storedProfile = null;
        }

        // Wait for assertion search to finish, and get results
        assertions = await assertions;
        this.log("Received assertions.");

        // Place assertions in their corresponding meta-vertices
        await this.g.processAssertionsBoolean(assertions, _, _);

        // Decrypt, filter (based on subject & expiration), format, and move assertions
        for (let coprocessor of coprocessors)
            await coprocessor.processAssertions.call(this);

        // This step could be broken up into smaller pieces, re-written, and made asynchronous.
        // But, it makes no HTTP requests so it's not a big bottleneck
        this.log("Processing state.");

        let result = await this.postProcess();

        if (profileKey != null && PROFILE_REPOSITORY_CACHE) {
            let len = JSON.stringify(result).length;
            if (len < 30*1024*1024) {
                storedProfile = new EcRemoteLinkedData("https://schema.cassproject.org/0.4/", "StoredProfile");
                storedProfile.assignId(repo.selectedServer, profileKey);
                storedProfile.addOwner(EcIdentityManager.default.ids[0].ppk.toPk());
                storedProfile.result = result;
                this.log("Encrypting!");
                storedProfile = await EcEncryptedValue.toEncryptedValue(storedProfile, false);
                this.log("Encrypted! Saving!");
                await repo.saveTo(storedProfile);
                this.log("Saved!");
            } else
                global.auditLogger.report(global.auditLogger.LogCategory.PROFILE, global.auditLogger.Severity.INFO, "Calculate", len);
        }
        return result;
    }

    /** Checks all edges in the graph to find competencies in outside frameworks. */
    async insertOutsideFrameworks(
        /** Array A list of frameworks that have already been added (to know what to skip). */
        frameworksAdded,
        /** Array | undefined A list of edges that will be used to find frameworks (updated on each framework add). */
        newEdges = undefined
    ) {
        const g = this.g; // Necessary because of scoping problems with functions inside functions

        if (newEdges == null) newEdges = g.edges;

        const frameworkLoadedCount = frameworksAdded.length;
        const vertexIds = g.verticies.map(v => v.shortId());

        // CHECKME
        // Since all edges added to g are pushed to the end, we'll mark the index to determine which edges
        // haven't been handled yet
        const newEdgesStartIdx = g.edges.length;

        // CHECKME This doesn't seem to do anything, and it's the only place 'framework' parameter is used here.
        //         Was this supposed to be g.relation?
        // if (framework.relation == null) framework.relation = [];

        const edgePromises = newEdges.map(triple => handleEdge(triple));
        // Process assertions (boolean)
        return Promise.allSettled(edgePromises).then(
            (results) => {
                // Debugging info
                for (const result of results) {
                    if (result.status === "rejected")
                        global.auditLogger.report(global.auditLogger.LogCategory.PROFILE, global.auditLogger.Severity.ERROR, "InsertOutsideFrameworks", result.reason);
                }

                this.log(`Finished pass - ${frameworkLoadedCount} => ${frameworksAdded.length}`);
                // No unique outside frameworks added?
                if (frameworksAdded.length !== frameworkLoadedCount && newEdges.length !== 0) {
                    // Repeat for new edges found in outside frameworks
                    newEdges = this.g.edges.slice(newEdgesStartIdx);
                    return this.insertOutsideFrameworks(frameworksAdded, newEdges);
                }
            }
        );

        async function handleEdge(triple) {
            const relation = triple.edge; // typeof EcAlignment
            if (relation == null) return null;

            // Competencies on both sides of the edge
            let outsideCompID = null; // Based outside the current framework
            // let insideCompID = null; // Based inside the current framework
            let insideComp = null;
            let outsideComp = null;

            // Check which node of the edge, if any, is based in an outside framework
            let numOutsideComps = 0;
            if (!EcArray.has(vertexIds, EcRemoteLinkedData.trimVersionFromUrl(relation.source))) {
                numOutsideComps++;
                outsideCompID = relation.source;
                // insideCompID = relation.target;
                insideComp = triple.destination;
                outsideComp = triple.source;
            }
            if (!EcArray.has(vertexIds, EcRemoteLinkedData.trimVersionFromUrl(relation.target))) {
                numOutsideComps++;
                outsideCompID = relation.target;
                // insideCompID = relation.source;
                insideComp = triple.source;
                outsideComp = triple.destination;
            }

            // Check if any outside competencies were found
            if (numOutsideComps === 2) return global.auditLogger.report(global.auditLogger.LogCategory.PROFILE, global.auditLogger.Severity.ERROR, "HandleEdge", "An edge in the graph contains no inside competency");
            if (numOutsideComps === 0) return;
            // Search for framework(s) attached to outside competency
            let outsideFrameworks = [];
            if (PRECACHE_ALL_FRAMEWORKS) {
                // TODO Find a better way than iterating over every single framework
                for (const f of allFrameworks) {
                    if (
                        f.competency != null &&
                        !EcArray.has(frameworksAdded, f.shortId()) &&
                        EcArray.has(f.competency, outsideCompID)
                    ) outsideFrameworks.push(f);
                }
            } else {
                outsideFrameworks = await EcFramework.search(
                    repo,
                    `competency:"${outsideCompID}"`,
                    null, null,
                    {size: 5}
                );
            }

            const promises = [];
            const ms = g.getMetaStateCompetency(insideComp);
            for (const outsideFramework of outsideFrameworks) {
                // Skip this framework if already added
                if (EcArray.has(frameworksAdded, outsideFramework.shortId())) {
                    continue;
                }
                frameworksAdded.push(outsideFramework.shortId());

                const ofName = outsideFramework.getName();
                const ocName = outsideComp.getName();
                const icName = insideComp.getName();
                global.auditLogger.report(global.auditLogger.LogCategory.PROFILE, global.auditLogger.Severity.INFO, "HandleEdge", `Found outside framework ${ofName}, because of ${ocName}, connected to ${icName}`);

                // Add framework's competencies as vertices and alignments as edges
                const promise = g.addFramework(
                    outsideFramework,
                    repo,
                    _, _
                ).then(
                    () => {
                        global.auditLogger.report(global.auditLogger.LogCategory.PROFILE, global.auditLogger.Severity.INFO, "HandleEdge", `Outside framework added - ${ofName}`);
                        // This property will be directly included in resulting profile
                        ms.relatedFrameworks = [];
                        outsideFrameworks.forEach(e => ms.relatedFrameworks.push(e.shortId()));
                    }
                ).catch((e) => {
                    global.auditLogger.report(global.auditLogger.LogCategory.PROFILE, global.auditLogger.Severity.ERROR, "HandleEdge", e);
                });

                promises.push(promise);
            }

            await Promise.all(promises);
        }
    }

    /** Performs post-processing on the EcFrameworkGraph once all necessary data is retrieved. */
    postProcess() {
        const vertices = {}; // These are metaVertices
        const topLevelVertices = {}; // These are metaVertices
        const inEdges = {};
        for (let coprocessor of coprocessors)
            coprocessor.postProcessStart.call(this,vertices,topLevelVertices, inEdges);

        // Put information from each vertex into its meta-vertex,
        // and attach additional data on assertions, goals, & required signatures into meta.state
        for (const vertex of this.g.verticies) {
            for (let coprocessor of coprocessors)
                coprocessor.postProcessEachVertex.call(this,vertex,vertices,topLevelVertices, inEdges);
        }

        // Process each edge by itself to create initial processing data, and build:
        // * A vertex.state.children hierarchy
        // * topLevelVertices
        // * inEdges.equivalent
        // * inEdges.narrows
        for (const edge of this.g.edges) {
            for (let coprocessor of coprocessors)
                coprocessor.postProcessEachEdge.call(this,edge,vertices,topLevelVertices, inEdges);
        }

        let hash;
        do {
            hash = hashSortCoerce.hash(topLevelVertices);

            // Handle relations between competencies, to determine how the competencies relate to goals
            for (const edge of this.g.edges) {
                for (let coprocessor of coprocessors)
                    coprocessor.postProcessEachEdgeRepeating.call(this,edge,vertices,topLevelVertices, inEdges);
            }

            for (const vertex of this.g.verticies) {
                for (let coprocessor of coprocessors)
                    coprocessor.postProcessEachVertexRepeating.call(this,vertex,vertices,topLevelVertices, inEdges);
            }
        } while (hash !== hashSortCoerce.hash(topLevelVertices));

        let profile = {
            children: []
        };
        for (let coprocessor of coprocessors)
            coprocessor.postProcessProfileBefore.call(this,profile,vertices,topLevelVertices, inEdges);

        // Hides data from outputted profile
        const pruneNonFrameworkData = (vertex, depth)=>{
            if (depth == null)
                depth = 0;
            delete vertex.framework;
            for (let i = 0; i < vertex.children.length; i++) {
                let prune = pruneNonFrameworkData(vertex.children[i], depth + 1);
                if (prune.length == 0) {
                    vertex.children.splice(i--, 1); // NOSONAR -- This is a method for filtering.
                }
                if (prune.length == 1) {
                    vertex.children.splice(i, 1, ...prune);
                }
                if (prune.length > 1) {
                    vertex.children.splice(i--, 1, ...prune); // NOSONAR -- This is a method for filtering.
                }
            }
            if (!EcArray.has(this.framework.competency, vertex.id)) {
                return vertex.children;
            }
            return [vertex];
        };

        // Add top-level vertices to profile's children - they store references to all other children
        for (var vertexKey in topLevelVertices) {
            profile.children = profile.children.concat(topLevelVertices[vertexKey]);
        }
        // Get summary statistics for results
        for (const child of profile.children) {
            for (let coprocessor of coprocessors)
                coprocessor.postProcessProfileEachElement.call(this,child,inEdges,vertices);
        }

        let newChildren = [];
        for (let i = 0; i < profile.children.length; i++)
            newChildren = newChildren.concat(pruneNonFrameworkData(profile.children[i]));

        profile.children = newChildren;

        // Insert profile.timeline (resource alignments for goal competencies and their children)
        for (let obj of profile.children)
        for (let coprocessor of coprocessors)
            coprocessor.postProcessProfileAfter.call(this,obj,profile);
        this.log("Done computing profile.");

        return profile;
    }

};

const cloneGraph = (g) => {
    let g2 = new EcFrameworkGraph();
    for (let gx in g.metaVerticies)
        g2.metaVerticies[gx] = Object.assign({}, g.metaVerticies[gx]);
    for (let gx in g.metaEdges)
        g2.metaEdges[gx] = Object.assign({}, g.metaEdges[gx]);
    g2.edges = [...g.edges];
    g2.verticies = [...g.verticies];
    Object.assign(g2.competencyMap, g.competencyMap);
    Object.assign(g2.edgeMap, g.edgeMap);
    Object.assign(g2.dontTryAnyMore, g.dontTryAnyMore);
    g2.frameworks.push(...g.frameworks);
    g2.repo = g.repo;
    g2.eim = g.eim;
    return g2;
};