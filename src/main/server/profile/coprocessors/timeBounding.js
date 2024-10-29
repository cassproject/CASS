//Each of these is being called such that using 'this' refers to the profileProcessor.
let fetchAssertions = async function () {
    let params = this.params;
    let startDate = null;
    let endDate = null;
    if (params.startDate != null)
        startDate = new Date(parseInt(params.startDate));
    if (params.endDate != null)
        endDate = new Date(parseInt(params.endDate));
    if (startDate == null && endDate == null)
        return;
    this.cache = false;
    global.auditLogger.report(global.auditLogger.LogCategory.PROFILE, global.auditLogger.Severity.INFO, "CassFetchAssertions", "We are time bounding, turning off caching.");
}
let insertResources = async function () {
}
let processAssertions = async function () {
    let params = this.params;
    let startDate = null;
    let endDate = null;
    if (params.startDate != null)
        startDate = new Date(parseInt(params.startDate));
    if (params.endDate != null)
        endDate = new Date(parseInt(params.endDate));
    if (startDate == null && endDate == null)
        return;
    global.auditLogger.report(global.auditLogger.LogCategory.PROFILE, global.auditLogger.Severity.INFO, "CassProcessAssertions", `Here I am doing additional processing over assertions and removing those that are before ${startDate} or after ${endDate}.`);
    for (const metaVertexId in this.g.metaVerticies) {
        const metaVertex = this.g.metaVerticies[metaVertexId];
        if (metaVertex.positiveAssertion != null)
            for (let index = 0; index < metaVertex.positiveAssertion.length; index++) {
                let assertionDate = await metaVertex.positiveAssertion[index].getAssertionDate();
                if (startDate != null && assertionDate < startDate.getTime()) {
                    global.auditLogger.report(global.auditLogger.LogCategory.PROFILE, global.auditLogger.Severity.INFO, "CassProcessAssertions", `Removing assertion where ${assertionDate} < (startDate)${startDate.getTime()}`);
                    metaVertex.positiveAssertion.splice(index--, 1); // NOSONAR -- Method for filtering.
                }
                else if (endDate != null && endDate.getTime() < assertionDate) {
                    global.auditLogger.report(global.auditLogger.LogCategory.PROFILE, global.auditLogger.Severity.INFO, "CassProcessAssertions", `Removing assertion where (endDate) ${endDate.getTime()} < ${assertionDate}`);
                    metaVertex.positiveAssertion.splice(index--, 1); // NOSONAR -- Method for filtering.
                }
            }
        if (metaVertex.negativeAssertion != null)
            for (let index = 0; index < metaVertex.negativeAssertion.length; index++) {
                let assertionDate = await metaVertex.negativeAssertion[index].getAssertionDate();
                if (startDate != null && assertionDate < startDate.getTime()) {
                    global.auditLogger.report(global.auditLogger.LogCategory.PROFILE, global.auditLogger.Severity.INFO, "CassProcessAssertions", `Removing assertion where ${assertionDate} < (startDate)${startDate.getTime()}`);
                    metaVertex.negativeAssertion.splice(index--, 1); // NOSONAR -- Method for filtering.
                }
                else if (endDate != null && endDate.getTime() < assertionDate) {
                    global.auditLogger.report(global.auditLogger.LogCategory.PROFILE, global.auditLogger.Severity.INFO, "CassProcessAssertions", `Removing assertion where ${(endDate) + endDate.getTime()} < ${assertionDate}`);
                    metaVertex.negativeAssertion.splice(index--, 1); // NOSONAR -- Method for filtering.
                }
            }
    }
}
let postProcessStart = async function (vertices, topLevelVertices, inEdges) {
}
let postProcessEachVertex = function (vertex, vertices, topLevelVertices, inEdges) {
}
let postProcessEachEdge = function (edge, vertices, topLevelVertices, inEdges) {
}
let postProcessEachEdgeRepeating = function (edge, vertices, topLevelVertices, inEdges) {
}
let postProcessEachVertexRepeating = function (vertex, vertices, topLevelVertices, inEdges) {
}
let postProcessProfileBefore = function (profile, vertices, topLevelVertices, inEdges) {
}
let postProcessProfileEachElement = function (obj, inEdges, vertices, visited) {
    return {};
}
let postProcessProfileAfter = function (o, profile) {
}

module.exports = {
    enabled: true,
    version: "1.0.0",
    order: 50,
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