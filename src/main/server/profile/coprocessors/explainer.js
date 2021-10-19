//Each of these is being called such that using 'this' refers to the profileProcessor.
let fetchAssertions = async function(){
    console.log("Here I am fetching assertions.");
    return await EcAssertion.search(
        repo,
        // Note: Searches don't work well for encrypted data. This may return irrelevant data, or fail to return
        //       the relevant data.

        `"${this.pem}"`,
        async(assertions) => {
            let prevCount = assertions.length;
            assertions = await Promise.all(assertions.map(async(a)=>{
                let subjectPk = await a.getSubject();
                if (subjectPk.toPem() == this.pem)
                    return a;
                return null;
            }));
            console.log(`Relevant assertion count: (${prevCount} -> ${assertions.length})`);
            assertions.sort((a, b)=>{
                return b.id.localeCompare(a.id);
            });
            let concatAssertions = "";
            for (let assertion of assertions)
                concatAssertions += assertion.id;
            assertionHash = EcCrypto.md5(concatAssertions);
            return assertions;
        },
        null,
        {size: 10000}
    );
}
let insertResources = async function(){
    // Search for resource alignments
    let bigSearchString = "";
    let countdown = [...this.g.verticies];

    console.log("Here I am associating resources with each vertex, accessing my learning object repository (or XI)");
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
        console.log("Searching for alignments, " + results.length + " found.");

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

    console.log("Here I am processing over assertions and removing any ones I don't like.");
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

                    if (
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
                console.error(`ERROR: ${result.reason}`);
        }
    });
}
let postProcessStart = async function(vertices,topLevelVertices, inEdges){
    console.log("Here I am starting the post process, the stage of computing results.");
}  
let postProcessEachVertex = function(vertex,vertices,topLevelVertices,inEdges){
    if (inEdges.equivalent == null)
        inEdges.equivalent = {};
    if (inEdges.narrows == null)
        inEdges.narrows = {};
    const meta = this.g.getMetaStateCompetency(vertex);
    topLevelVertices[vertex.id] = meta; // All vertices go in here (these will be filtered later)
    vertices[vertex.id] = meta;

    console.log("Here I am initializing and computing initial vertex data that will populate my 'metavertex' and creating my state object.");

    meta.name = vertex.getName().trim();
    meta.id = vertex.shortId();
    meta.children = [];
    
    const state = {
    };

    meta.state = state;
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

    console.log("Here I am iterating over edges initially, initializing any edge properties, modifying the vertices, and constructing hierarchy based on my chosen relation types.");
    if (relationType === "narrows") {
        // Src NARROWS Dst -> Src is a child of Dst
        const child = src;
        const parent = dst;

        // Build children hierarchy
        vtxDst.children.push(vtxSrc);

        // If we're a child, we aren't a top level vertex!
        delete topLevelVertices[edge.source.id];

        // Mark this relationship for later
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
}
let postProcessEachEdgeRepeating = function(edge,vertices,topLevelVertices,inEdges){
    const vtxSrc = vertices[edge.source.id];
    const vtxDst = vertices[edge.destination.id];
    if (vtxSrc == null || vtxDst == null) return;
    const relationType = edge.edge.relationType;

    console.log("Here I am iterating over edges repeatedly until the data stabilizes, computing any edge properties or modifying the vertices.");
    if (relationType === "narrows") {
        const child = vtxSrc.state;
        const parent = vtxDst.state;
    }
}
let postProcessEachVertexRepeating = function(vertex,vertices,topLevelVertices,inEdges){ 
    const ms = this.g.getMetaStateCompetency(vertex);
    console.log("Here I am computing any vertex properties that are dependent on my neighbors repeatedly until the data stabilizes. My neighbors are organized by relation in inEdges.");

    if (inEdges.narrows[vertex.id] != null) {
        for (const thisVertex of inEdges.narrows[vertex.id]) {
            const vtx = vertices[thisVertex.id];
            if (vtx == null) continue;
            const v = vtx.state;
            const m = ms.state;
            console.log("Here I am making changes to the vertices based on the narrows relation.");
        }
    }

    if (inEdges.equivalent[vertex.shortId()] != null) {
        for (const thisVertex of inEdges.equivalent[vertex.shortId()]) {
            const vtx = vertices[thisVertex.id];
            if (vtx == null) continue;
            const v = vtx.state;
            const m = ms.state;
            console.log("Here I am making changes to the vertices based on the equivalent relation.");
        }
    }
}
let postProcessProfileBefore = function(profile,vertices,topLevelVertices,inEdges){
    console.log("Here I am initializing any variables on the profile object that will be the result of this object.")
    console.log("All the top level elements (represented as trees) will be attached to the profile.children object seen here:");
    console.log(profile);
}
let postProcessProfileEachElement = function(obj,inEdges,vertices,visited){
    if (visited == null) 
        visited = [];
    if (obj == null || EcArray.has(visited, obj.id))
        return {};
    EcArray.setAdd(visited, obj.id);

    console.log("Here I am calculating the leading edge changes to the profile elements.");

    let result = {};

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

    console.log("Here I am calculating the falling edge changes to the profile elements and saving data to the {obj.state}.");
    return result;
}    
let postProcessProfileAfter = function(o, profile){
    console.log("Here I am putting any finishing touches or annotations on the profile object.");
}

//The functions above occur in the order of the functions listed below.
module.exports = {
    enabled: false,
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