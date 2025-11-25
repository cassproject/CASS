// Import necessary modules
const EcArray = require('cassproject/src/com/eduworks/ec/array/EcArray');
const { JSONPath } = require('jsonpath-plus');

// Function to fetch assertions (currently empty)
let fetchAssertions = async function () {
}

// Function to insert resources (currently empty)
let insertResources = async function () {
}

// Cache for conditions
let conditionCache = {};

// Function to process a single assertion
let processAssertion = async function (assertion, metaVertexId) {
	if (assertion.condition != null)
		return;
	let evidences = await assertion.getEvidences();
	if (evidences != null)
		for (let evidence of evidences) {
			try {
				// Decode the evidence and process it for conditions
				let decoded = JSON.parse(evidence);
				let c = await EcCompetency.get(metaVertexId, null, null, global.repo);
				let validConditions = c.validCondition;
				if (validConditions == null) {
					validConditions = [];
				}
				if (!EcArray.isArray(validConditions)) validConditions = [validConditions];
				console.log(validConditions);
				for (let validCondition of validConditions) {
					let concept = await EcConcept.get(validCondition);
					if (concept["skos:hiddenLabel"] != null) {
						let conditionCacheKey = EcCrypto.md5(evidence + EcRemoteLinkedData.getDisplayStringFrom(concept["skos:hiddenLabel"]));
						console.log(EcRemoteLinkedData.getDisplayStringFrom(concept["skos:hiddenLabel"]));
						let cached = conditionCache[conditionCacheKey];
						let jsonPathResults = null;
						if (cached != null)
							jsonPathResults = cached;
						else
							jsonPathResults = JSONPath({ json: decoded, path: EcRemoteLinkedData.getDisplayStringFrom(concept["skos:hiddenLabel"]) });
						console.log(jsonPathResults);
						if (cached == null)
							conditionCache[conditionCacheKey] = jsonPathResults;
						if (jsonPathResults.length > 0) {
							if (assertion.condition == null)
								assertion.condition = [];
							EcArray.setAdd(assertion.condition, EcRemoteLinkedData.getDisplayStringFrom(concept["skos:prefLabel"]));
						}
					}
				}
			}
			catch (ex) {
				console.error("didn't know what to do with this." + evidence);
				console.trace(ex);
			}
		}
}

// Function to process all assertions
let processAssertions = async function () {
	let params = this.params;
	let conditions = params.condition;
	console.log(conditions);
	if (conditions == null)
		conditions = [];
	if (!EcArray.isArray(conditions))
		conditions = [conditions];
	if (conditions.length == 0)
		console.log("Here I am doing additional processing over assertions and just populating conditions:");
	else
		console.log("Here I am doing additional processing over assertions, populating conditions and removing assertions without: " + conditions);
	//Walk the metaverticies (where we store data about each vertex, aka, competency.)
	for (const metaVertexId in this.g.metaVerticies) {
		const metaVertex = this.g.metaVerticies[metaVertexId];
		//For positive assertions, we want to remove any that don't have a condition.
		if (metaVertex.positiveAssertion != null)
			//Walk the assertions
			for (let index = 0; index < metaVertex.positiveAssertion.length; index++) {
				let assertion = metaVertex.positiveAssertion[index];
				let c = await EcCompetency.get(metaVertexId, null, null, global.repo);
				assertion.validCondition = c.validCondition;
				//Process the assertion to attach conditions
				await processAssertion(assertion, metaVertexId);
				if (
					conditions != null
					&& assertion.condition != null
				)
					//Walk the conditions
					for (let condition of conditions) {
						if (condition.startsWith("http"))
							condition = EcRemoteLinkedData.getDisplayStringFrom((await EcConcept.get(condition))["skos:prefLabel"]);
						//console.log(assertion.condition,condition);
						//If the condition is not in the assertion, remove the assertion
						if (
							//c.validCondition.indexOf(condition) != -1 && 
							assertion.condition.indexOf(condition) == -1
						) {
							metaVertex.positiveAssertion.splice(index--, 1);
							//console.log("Removed an assertion for not having a condition.");
							break;
						}
					}
			}
		//For negative assertions, we want to remove any that don't have a condition (same thing)
		if (metaVertex.negativeAssertion != null)
			//Walk the assertions
			for (let index = 0; index < metaVertex.negativeAssertion.length; index++) {
				let assertion = metaVertex.negativeAssertion[index];
				let c = await EcCompetency.get(metaVertexId, null, null, global.repo);
				assertion.validCondition = c.validCondition;
				//Process the assertion to attach conditions
				await processAssertion(assertion, metaVertexId);
				if (
					conditions != null
					&& assertion.condition != null
					//&& c.validCondition != null
				)
					//Walk the conditions
					for (let condition of conditions)
						//If the condition is not in the assertion, remove the assertion
						if (
							//c.validCondition.indexOf(condition) != -1 && 
							assertion.condition.indexOf(condition) == -1
						) {
							metaVertex.negativeAssertion.splice(index--, 1);
							//console.log("Removed an assertion for not having a condition.");
							break;
						}
			}
	}
}

// Function to perform post-processing at the start (currently empty)
let postProcessStart = async function (vertices, topLevelVertices, inEdges) {
}

// Function to perform post-processing on each vertex (currently empty)
let postProcessEachVertex = function (vertex, vertices, topLevelVertices, inEdges) {
}

// Function to perform post-processing on each edge (currently empty)
let postProcessEachEdge = function (edge, vertices, topLevelVertices, inEdges) {
}

// Function to perform repeating post-processing on each edge (currently empty)
let postProcessEachEdgeRepeating = function (edge, vertices, topLevelVertices, inEdges) {
}

// Function to perform repeating post-processing on each vertex (currently empty)
let postProcessEachVertexRepeating = function (vertex, vertices, topLevelVertices, inEdges) {
}

// Function to perform pre-processing on the profile (currently empty)
let postProcessProfileBefore = function (profile, vertices, topLevelVertices, inEdges) {
}

// Function to perform post-processing on each element of the profile
let postProcessProfileEachElement = function (obj, inEdges, vertices, visited) {
	for (const child of obj.children) {
		const childResults = postProcessProfileEachElement(
			child, inEdges, vertices, visited
		);
	}
	return {};
}

// Function to perform post-processing after the profile (currently empty)
let postProcessProfileAfter = function (o, profile) {
}

// Export the module with its functions and properties
module.exports = {
	enabled: false,
	name: "Conditions",
	version: "1.0.0",
	order: 60,
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