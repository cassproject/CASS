/**
 *
 */
async function importJsonLd() {
	var jsonLd, text;

	if (this.params.url != undefined && this.params.url != "") {
		text = httpGet(this.params.url, false);
	} else if (this.params.path != undefined && this.params.path != "") {
		text = fileToString(fileLoad(this.params.path));
	} else if (this.params.text != undefined && this.params.text != "") {
		text = this.params.text;
	} else {
		var files = (fileFromDatastream).call(this);
		text = fileToString.call(this, files)[0];
	}

	try {
		jsonLd = JSON.parse(text);
	} catch (e) {
		debug("Not json");
		jsonLd = rdfToJsonLd(text);
	}

	jsonLd = fixScalars(jsonLd);

	var frameworkObj = undefined;
	var competencyList = [];

	var graph = undefined;
	var context = undefined;
	if (jsonLd["@graph"] != undefined && jsonLd["@graph"] != "") {
		graph = jsonLd["@graph"];
		context = jsonLd["@context"];

		for (var idx in graph) {
			var graphObj = graph[idx];

			if (graphObj["@type"] == "asn:StandardDocument") {
				frameworkObj = graphObj;
			} else if (graphObj["@type"] == "asn:Statement") { //&& graphObj["asn:statementLabel"] != undefined && (graphObj["asn:statementLabel"] == "Competency" || graphObj["asn:statementLabel"]["@value"] == "Competency")){
				competencyList.push(graphObj);
			}
		}

	} else {
		graph = [];
		context = asnContext;

		for (var idx in jsonLd) {
			var obj = jsonLd[idx];

			var context = JSON.parse(JSON.stringify(asnContext));
			context["type"] = "@type";
			context["uri"] = "@id";

			obj["@context"] = context;

			if (obj["@id"] == undefined)
				obj["@id"] = idx;

			var expanded = await jsonLdExpand(JSON.stringify(obj));
			var graphObj = await jsonLdCompact(JSON.stringify(expanded), "https://schema.cassproject.org/0.4/");

			if (graphObj["rdf:type"] != undefined && graphObj["@type"] == undefined) {
				if (graphObj["rdf:type"]["@id"] == undefined) {
					graphObj["@type"] = graphObj["rdf:type"]
				} else {
					graphObj["@type"] = graphObj["rdf:type"]["@id"]
				}
				delete graphObj["rdf:type"];
			}

			if (graphObj["@type"] == "asn:StandardDocument") {
				frameworkObj = graphObj;
			} else if (graphObj["@type"] == "asn:Statement") {
				competencyList.push(graphObj);
			}

			graph.push(graphObj);
		}
	}

	if (frameworkObj == undefined && competencyList.length != Object.keys(graph).length) {
		await importJsonLdGraph.call(this, graph, context);
	} else {
		await importFrameworkToCass(this, frameworkObj, competencyList)
	}
}

if (!global.disabledAdapters['jsonld']) {
	/**
	 * @openapi
	 * /api/jsonld:
	 *   post:
	 *     tags:
	 *       - JSON-LD Adapter
	 *     summary: Import a JSON-LD or RDF document
	 *     description: |
	 *       Parses a JSON-LD document (or converts RDF to JSON-LD) and imports
	 *       it as CaSS frameworks and competencies. Input can be provided via
	 *       URL, file path, raw text, or file upload.
	 *     parameters:
	 *       - in: query
	 *         name: url
	 *         schema:
	 *           type: string
	 *         description: URL of a JSON-LD or RDF document to fetch and import.
	 *       - in: query
	 *         name: path
	 *         schema:
	 *           type: string
	 *         description: Server file path of a JSON-LD or RDF document to load.
	 *       - in: query
	 *         name: text
	 *         schema:
	 *           type: string
	 *         description: Raw JSON-LD or RDF text to import.
	 *     requestBody:
	 *       content:
	 *         multipart/form-data:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               file:
	 *                 type: string
	 *                 format: binary
	 *                 description: A JSON-LD or RDF file to upload and import.
	 *     responses:
	 *       200:
	 *         description: Import completed successfully.
	 */
	bindWebService("/jsonld", importJsonLd);
}
