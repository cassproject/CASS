let glob = require('glob');
let path = require('path');
let util = require(path.resolve(glob.sync( 'src/main/server/profile/util.js' )[0]));

//Each of these is being called such that using 'this' refers to the profileProcessor.
let fetchAssertions = async function(){
    let assertions = [];
    let competencies = this.g.verticies.map(x=>x.shortId());
    while (competencies.length > 0) {
        let first = true;
        let bigSearchString = "";
        for (const competency of competencies.splice(0, 100)) {
            if (!first)
                bigSearchString += " OR ";
            first = false;
            bigSearchString += `competency:"${competency}"`;
        }
        let someAssertions = await EcAssertion.search(
        repo,
            `"${this.pem}" AND (${bigSearchString})`,
            null,
            null,
            { size: 10000 }
        )
        global.auditLogger.report(global.auditLogger.LogCategory.PROFILE, global.auditLogger.Severity.INFO, "DefaultFetchAssertions", `Searching for assertions, ${someAssertions.length} found.`);
        assertions.push(...someAssertions.filter(x=>x));
    }

            let prevCount = assertions.length;
    assertions = await Promise.all(assertions.map(async (a) => {
                let subjectPk = await a.getSubject();
                if (subjectPk == null) return null;
                if (subjectPk.toPem() == this.pem)
                    return a;
                return null;
            }));
    assertions = assertions.filter((x) => (x));
            global.auditLogger.report(global.auditLogger.LogCategory.PROFILE, global.auditLogger.Severity.INFO, "DefaultFetchAssertions", `Relevant assertion count: (${prevCount} -> ${assertions.length})`);
    assertions.sort((a, b) => {
                return b.id.localeCompare(a.id);
            });
            let concatAssertions = "";
            for (let assertion of assertions)
                concatAssertions += assertion.id;
            assertionHash = EcCrypto.md5(concatAssertions);
            return assertions;
}
let insertResources = async function(){
    // Search for resource alignments
    let bigSearchString = "";
    let countdown = [...this.g.verticies];
    while (countdown.length > 0) {
        let first = true;
        for (const vertex of countdown.splice(0, 100)) {
            if (!first)
                bigSearchString += " OR ";
            first = false;
            bigSearchString += `educationalAlignment.targetUrl:"${vertex.shortId()}"`;
        }
        let results = null;
        let counter = 0;
        while (results == null && counter++ < 0)
            try {
                results = await EcCreativeWork.search(
                    repo,
                    bigSearchString,
                    null, null, {size: 10000}
                );
            } catch (ex) {
                results = null;
            }

        if (results == null) continue;
        global.auditLogger.report(global.auditLogger.LogCategory.PROFILE, global.auditLogger.Severity.INFO, "DefaultInsertResources", `Searching for alignments, ${results.length} found.`);

        for (let i = 0; i < results.length; i++) {
            const resource = results[i];
            const vertexId = resource.educationalAlignment.targetUrl;

            // TODO When will the meta vertex ever be null?
            let competency = this.g.getCompetencySoft(vertexId);
            if (competency == null) continue;
            let metaVertex = this.g.getMetaStateCompetency(competency);

            if (metaVertex.resources == null)
                metaVertex.resources = [];

            // Trim alignments, add to metaVertex
            metaVertex.resources.push(resource);
        }
    }
}
let processAssertions = async function(){
    const allPromises = [];

    for (const metaVertexId in this.g.metaVerticies) {
        const metaVertex = this.g.metaVerticies[metaVertexId];

        // Combine positive and negative assertions
        let assertions = [];
        // These are defined with g.processAssertionsBoolean()
        if (metaVertex.positiveAssertion != null)
            assertions = assertions.concat(metaVertex.positiveAssertion);
        if (metaVertex.negativeAssertion != null)
            assertions = assertions.concat(metaVertex.negativeAssertion);

        for (const a of assertions) {
            const dataPromises = [
                a.getSubject(), a.getAgent(), a.getNegative(),
                a.getAssertionDate(), a.getExpirationDate()
            ];

            // Push a promise that handles this assertion
            allPromises.push(Promise.all(dataPromises).then(
                async(assertionData) => {
                    const [subject, agent, negative, assertionDate, expirationDate] = assertionData;
                    let agentPerson;
                    let evidence;

                    if (expirationDate != null && 
                        // Ignore an expired assertion
                        new Date().getTime() > expirationDate ||
                        // Ignore assertions not about the person for this profile
                        !subject.equals(this.pk)
                    ) return;

                    try {
                        agentPerson = await util.anythingToPerson(agent.toPem());
                    } catch (e) {
                        return this.err("Unhandled exception while converting an assertion's agent to person", e);
                    }

                    if (a.evidence != null) {
                        try {
                            evidence = await a.getEvidences();
                        } catch (e) {
                            // TODO Please make it so getEvidences() does not throw errors in the CaSS library
                            this.log(`Error decrypting evidence for assertion ${a.shortId()}`);
                        }
                    }

                    // Compile assertion data
                    const assertionOutput = {
                        negative,
                        grade: a.grade == null ? undefined : a.grade,
                        subject: this.person.name,
                        agent: agentPerson.name,
                        competency: (await EcCompetency.get(a.competency)).getName(),
                        assertionDate,
                        expirationDate
                    };
                    if (evidence != null) assertionOutput.evidence = evidence;

                    // Add the assertion
                    if (metaVertex.assertions == null)
                        metaVertex.assertions = [];
                    metaVertex.assertions.push(assertionOutput);
                }
            ));
        }
    }

    // Return when all assertions of all meta-vertices have been inserted
    return Promise.allSettled(allPromises).then(results => {
        for (const result of results) {
            if (result.status === "rejected")
                global.auditLogger.report(global.auditLogger.LogCategory.PROFILE, global.auditLogger.Severity.ERROR, "DefaultProcessAssertions", result.reason);
        }
    });
}
let postProcessStart = async function(vertices,topLevelVertices, inEdges){
}  
let postProcessEachVertex = function(vertex,vertices,topLevelVertices,inEdges){
    if (inEdges.equivalent == null)
        inEdges.equivalent = {};
    if (inEdges.narrows == null)
        inEdges.narrows = {};
    const meta = this.g.getMetaStateCompetency(vertex);
    topLevelVertices[vertex.id] = meta; // All vertices go in here (these will be filtered later)
    vertices[vertex.id] = meta;

    meta.name = vertex.getName()?.trim();
    meta.shortName = schema.Thing.getDisplayStringFrom(vertex["schema:alternateName"]);
    meta.id = vertex.shortId();
    //TODO meta.inFrameworks = [...new Set(global.competencyFrameworkMap[vertex.shortId()])],
    meta.type = schema.Thing.getDisplayStringFrom(vertex["dcterms:type"]);
    if (vertex.requiredSignatureCount != null)
        meta.requiredSignatureCount = parseInt(vertex.requiredSignatureCount);
    meta.children = [];
    
    const state = {
        latestEvidenceIsPositive: null,
        hasEvidence: meta.assertions != null,
        isGoal: false,
        isHighPriorityGoal: false,
        leadsToGoalTopDown: false,
        requiredForGoalBottomUp: false,
        leadsToHighPriorityGoalTopDown: false,
        requiredForHighPriorityGoalBottomUp: false,
        hasPositiveEvidence: false,
        hasNegativeEvidence: false,
        distinctPositiveSignatures: 0,
        distinctNegativeSignatures: 0,
        isQualifiedAccordingToSignatures: false
    };

    // Check if it's a goal / high-priority goal
    for (const seek of this.person.seeks || []) {
        // Follow the schema.org format
        if (seek?.itemOffered?.serviceOutput?.competency === vertex.shortId()) {
            state.isGoal = true;
            if (seek.isHighPriorityGoal) {
                state.isHighPriorityGoal = true;
                break;
            }
        }
    }

    // Compile negative/positive assertions
    // CHECKME These held subjects before, I changed them to agents
    const distinctPositivePersons = []; // Sets, to avoid duplicates from same person
    const distinctNegativePersons = [];
    if (meta.assertions != null) {
        meta.assertions.sort((a, b) => a.assertionDate - b.assertionDate);
        for (const assertion of meta.assertions) {
            state.latestEvidenceIsPositive = !assertion.negative;

            if (assertion.negative === true) {
                state.hasNegativeEvidence = true;
                EcArray.setAdd(distinctNegativePersons, assertion.agent);
            } else {
                state.hasPositiveEvidence = true;
                EcArray.setAdd(distinctPositivePersons, assertion.agent);
            }
        }
    }
    state.distinctPositiveSignatures = distinctPositivePersons.length;
    state.distinctNegativeSignatures = distinctNegativePersons.length;

    // CHECKME This was requiredQualifierCount before, assumed it was a typo
    // Insert requiredSignatureCount if it exists on competency
    if (vertex.requiredSignatureCount != null) {
        meta.requiredDistinctPositiveSignatures = parseInt(vertex.requiredSignatureCount);
        state.isQualifiedAccordingToSignatures =
            state.distinctPositiveSignatures > meta.requiredDistinctPositiveSignatures;
    }

    meta.state = state;
    // State contains the following:
    // * latestEvidenceIsPositive: null,
    // * hasEvidence: ms.assertions != null,
    // * isGoal: false,
    // * isHighPriorityGoal: false,
    // * leadsToGoalTopDown: false,
    // * requiredForGoalBottomUp: false,
    // * leadsToHighPriorityGoalTopDown: false,
    // * requiredForHighPriorityGoalBottomUp: false,
    // * hasPositiveEvidence: false,
    // * hasNegativeEvidence: false,
    // * distinctPositiveSignatures: 0,
    // * distinctNegativeSignatures: 0,
    // * isQualifiedAccordingToSignatures: false

    // Delete leftover g.processAssertionsBoolean values
    delete meta.positiveAssertion;
    delete meta.negativeAssertion;
}   
let postProcessEachEdge = function(edge,vertices,topLevelVertices,inEdges){
    const relationType = edge.edge.relationType;
    const thisVertex = edge.source;
    const otherVertex = edge.destination;
    const vtxSrc = vertices[thisVertex.id];
    const vtxDst = vertices[otherVertex.id];
    if (vtxSrc == null || vtxDst == null) return;
    const src = vtxSrc.state;
    const dst = vtxDst.state;

    if (relationType === "narrows") {
        // Src NARROWS Dst -> Src is a child of Dst
        const child = src;
        const parent = dst;

        // Build children hierarchy
        vtxDst.children.push(vtxSrc);

        // Top-Down Goal Relationships
        if (child.isGoal)
            parent.leadsToGoalTopDown = true;
        if (child.isHighPriorityGoal)
            parent.leadsToHighPriorityGoalTopDown = true;
        // Bottom-Up Goal Relationships
        if (parent.isGoal)
            child.requiredForGoalBottomUp = true;
        if (parent.isHighPriorityGoal)
            child.requiredForHighPriorityGoalBottomUp = true;

        // CHECKME Not sure if possible
        if ((src.isHighPriorityGoal && !src.isGoal) || (dst.isHighPriorityGoal && !dst.isGoal))
            this.err("A high-priority goal exists without being a goal");

        // A top-level vertex cannot be contained within another
        delete topLevelVertices[edge.source.id];

        // Mark this relationship for later
        // TODO Why are these using .id, while inEdges.equivalent is using .shortId()?
        if (inEdges.narrows[otherVertex.id] == null)
            inEdges.narrows[otherVertex.id] = [];
        inEdges.narrows[otherVertex.id].push(thisVertex);
    } else if (relationType === "isEquivalentTo") {
        // Mark this relationship for later
        if (inEdges.equivalent[thisVertex.shortId()] == null)
            inEdges.equivalent[thisVertex.shortId()] = [];
        if (inEdges.equivalent[otherVertex.shortId()] == null)
            inEdges.equivalent[otherVertex.shortId()] = [];
        inEdges.equivalent[thisVertex.shortId()].push(otherVertex);
        inEdges.equivalent[otherVertex.shortId()].push(thisVertex);
    }
    // else this.err(`Unhandled EcAlignment relationType ${edge.edge.relationType}`);
    // Found so far: isRelatedTo, requires, ...
}
let postProcessEachEdgeRepeating = function(edge,vertices,topLevelVertices,inEdges){
    // TODO Aren't we just defining two copies of both vertices?
    const vtxSrc = vertices[edge.source.id];
    const vtxDst = vertices[edge.destination.id];
    if (vtxSrc == null || vtxDst == null) return;
    const relationType = edge.edge.relationType;

    if (relationType === "narrows") {
        const child = vtxSrc.state;
        const parent = vtxDst.state;

        // Top-Down
        if (child.leadsToGoalTopDown === true) {
            parent.leadsToGoalTopDown = true;
            if (child.leadsToHighPriorityGoalTopDown === true)
                parent.leadsToHighPriorityGoalTopDown = true;
        }

        // Bottom-Up
        if (parent.requiredForGoalBottomUp === true) {
            child.requiredForGoalBottomUp = true;
            if (parent.requiredForHighPriorityGoalBottomUp === true)
                child.requiredForHighPriorityGoalBottomUp = true;
        }
    }
}
let postProcessEachVertexRepeating = function(vertex,vertices,topLevelVertices,inEdges){ 
    const ms = this.g.getMetaStateCompetency(vertex);

    if (inEdges.narrows[vertex.id] != null) {
        for (const thisVertex of inEdges.narrows[vertex.id]) {
            const vtx = vertices[thisVertex.id];
            if (vtx == null) continue;
            const v = vtx.state;
            const m = ms.state;

            if (
                v.latestEvidenceIsPositive === false ||
                (
                    v.latestEvidenceIsPositive == null &&
                    v.allChildrenLatestEvidenceIsPositive === false
                )
            ) m.allChildrenLatestEvidenceIsPositive = false;

            if (
                v.latestEvidenceIsPositive === true &&
                m.allChildrenLatestEvidenceIsPositive == null // &&
                // m.allChildrenLatestEvidenceIsPositive !== false // CHECKME What was this for?
            ) m.allChildrenLatestEvidenceIsPositive = true;

            if (
                v.hasPositiveEvidence ||
                v.hasAnyChildrenWithPositiveEvidence
            ) m.hasAnyChildrenWithPositiveEvidence = true;

            if (
                m.hasAnyChildrenWithPositiveEvidence == null &&
                v.hasPositiveEvidence !== true
            ) m.hasAnyChildrenWithPositiveEvidence = false;
        }
    }

    if (inEdges.equivalent[vertex.shortId()] != null) {
        for (const thisVertex of inEdges.equivalent[vertex.shortId()]) {
            const vtx = vertices[thisVertex.id];
            if (vtx == null) continue;
            const v = vtx.state;
            const m = ms.state;

            // Duplicate the properties
            // TODO Check if the ordering is handled properly here
            if (v.hasAnyChildrenWithPositiveEvidence === true)
                m.hasAnyChildrenWithPositiveEvidence = true;
            if (v.allChildrenLatestEvidenceIsPositive === false)
                m.allChildrenLatestEvidenceIsPositive = false;
            if (v.leadsToGoalTopDown === true)
                m.leadsToGoalTopDown = true;
            if (v.leadsToHighPriorityGoalTopDown === true)
                m.leadsToHighPriorityGoalTopDown = true;
            if (v.requiredForGoalBottomUp === true)
                m.requiredForGoalBottomUp = true;
            if (v.requiredForHighPriorityGoalBottomUp === true)
                m.requiredForHighPriorityGoalBottomUp = true;
        }
    }
}
let postProcessProfileBefore = function(profile,vertices,topLevelVertices,inEdges){
    profile.name = this.framework.getName();
    profile.id = this.frameworkId;
    profile.timeline = [];
}
let postProcessProfileEachElement = function(obj,inEdges,vertices,visited){
    if (visited == null) 
        visited = [];
    if (obj == null || EcArray.has(visited, obj.id))
        return {};
    EcArray.setAdd(visited, obj.id);

    const result = {
        totalWeight: 1.0,
        withPositiveEvidence: 0.0,
        withNegativeEvidenceAndNoPositiveEvidence: 0.0,
        withNegativeEvidenceAndPositiveEvidence: 0.0,
        withLastEvidenceBeingPositive: obj.state.latestEvidenceIsPositive ? 1.0 : 0.0
    };

    if (obj.state.hasPositiveEvidence && obj.state.hasNegativeEvidence)
        result.withNegativeEvidenceAndPositiveEvidence = 1.0;
    else if (obj.state.hasNegativeEvidence)
        result.withNegativeEvidenceAndNoPositiveEvidence = 1.0;
    else if (obj.state.hasPositiveEvidence)
        result.withPositiveEvidence = 1.0;

    // Recur for each child
    for (const child of obj.children) {
        const childResults = postProcessProfileEachElement(
            child, inEdges, vertices, visited
        );
        for (const key in childResults) {
            result[key] += childResults[key];
        }
    }

    // Recur for equivalent vertices
    if (inEdges.equivalent[obj.id] != null) {
        for (const relatedCompetency of inEdges.equivalent[obj.id]) {
            const childResults = postProcessProfileEachElement(
                vertices[relatedCompetency.id], inEdges, vertices, visited
            );
            for (const key in childResults)
                result[key] += childResults[key];
        }
    }

    obj.state.treeWeight = result.totalWeight; // TODO Is this relevant? Rename
    obj.state.percentLastEvidenceIsPositive =
        result.withLastEvidenceBeingPositive / result.totalWeight;
    obj.state.percentAllEvidenceIsPositive =
        result.withPositiveEvidence / result.totalWeight;
    obj.state.percentHasPositiveEvidence =
        (result.withPositiveEvidence + result.withNegativeEvidenceAndPositiveEvidence) /
        result.totalWeight;

    // Return data we calculated for parent recursive calls
    return result;
}    
let postProcessProfileAfter = function(o, profile){
    if (o.state != null)
        if ((o.state.isGoal || o.state.requiredForGoalBottomUp) && o.resources != null) {
            profile.timeline = profile.timeline.concat(o.resources);
        }
    if (o.state != null)
        if (o.state.isGoal || o.state.requiredForGoalBottomUp || o.state.leadsToGoalTopDown) {
            for (let o2 of o.children) {
                this.insertTimelineHelper(o2, profile);
            }
        }
}
module.exports = {
    enabled: true,
    version: "1.0.0",
    order: 100,
    fetchAssertions,
    insertResources,
    processAssertions,
    postProcessStart,
    postProcessEachVertex,
    postProcessEachEdge,
    postProcessEachEdgeRepeating,
    postProcessEachVertexRepeating,
    postProcessProfileBefore,
    postProcessProfileEachElement,
    postProcessProfileAfter
}