//Each of these is being called such that using 'this' refers to the profileProcessor.
let fetchAssertions = async function() {
}
let insertResources = async function() {
}
let processAssertions = async function() {
}
let postProcessStart = async function(vertices,topLevelVertices, inEdges) {
}  
let postProcessEachVertex = function(vertex,vertices,topLevelVertices,inEdges) {
    vertices[vertex.id].state.hasDirectPositiveAssertion = false;
    if (vertices[vertex.id].assertions != null)
        vertices[vertex.id].state.hasDirectPositiveAssertion = vertices[vertex.id].assertions.filter(a=>a.competency == vertex.getName()).length > 0;
}   
let postProcessEachEdge = function(edge,vertices,topLevelVertices,inEdges) {
}
let postProcessEachEdgeRepeating = function(edge,vertices,topLevelVertices,inEdges) {
}
let postProcessEachVertexRepeating = function(vertex,vertices,topLevelVertices,inEdges) {
}
let postProcessProfileBefore = function(profile,vertices,topLevelVertices,inEdges) {
}
let postProcessProfileEachElement = function (obj, inEdges, vertices, visited) {
    //Make sure the obj isn't in visited, to avoid infinite loops.
    if (visited == null)
        visited = new Set();
    if (visited.has(obj.id))
        return;
    visited.add(obj.id);
    // Recur for each child
    for (const child of obj.children) {
        const childResults = postProcessProfileEachElement(
            child, inEdges, vertices, visited
        );
    }
    return {};
}    
let postProcessProfileAfter = function(o, profile) {
}

module.exports = {
    enabled: true,
    version: "1.0.0",
    order: 200,
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