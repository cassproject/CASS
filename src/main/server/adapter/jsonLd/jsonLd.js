/**
 *
 */
async function importJsonLd(){
	var jsonLd, text;

	if(this.params.url != undefined && this.params.url != ""){
		text = httpGet(this.params.url,false);
	}else if(this.params.path != undefined && this.params.path  != ""){
		text = fileToString(fileLoad(this.params.path));
	}else if(this.params.text != undefined && this.params.text != ""){
		text = this.params.text;
	}else{
		var files = (fileFromDatastream).call(this);
		text = fileToString.call(this,files)[0];
	}

	try{
		jsonLd = JSON.parse(text);
	}catch(e){
		debug("Not json");
		jsonLd = rdfToJsonLd(text);
	}

	jsonLd = fixScalars(jsonLd);

	var frameworkObj = undefined;
	var competencyList = [];

	var graph = undefined;
	var context = undefined;
	if(jsonLd["@graph"] != undefined && jsonLd["@graph"] != ""){
		graph = jsonLd["@graph"];
		context = jsonLd["@context"];

		for(var idx in graph){
			var graphObj = graph[idx];

			if(graphObj["@type"] == "asn:StandardDocument"){
				frameworkObj = graphObj;
			}else if (graphObj["@type"] == "asn:Statement" ){ //&& graphObj["asn:statementLabel"] != undefined && (graphObj["asn:statementLabel"] == "Competency" || graphObj["asn:statementLabel"]["@value"] == "Competency")){
				competencyList.push(graphObj);
			}
		}

	}else{
		graph = [];
		context = asnContext;

		for(var idx in jsonLd){
			var obj = jsonLd[idx];

			var context = JSON.parse(JSON.stringify(asnContext));
			context["type"] = "@type";
			context["uri"] = "@id";

			obj["@context"] = context;

			if(obj["@id"] == undefined)
				obj["@id"] = idx;

			var expanded = await jsonLdExpand(JSON.stringify(obj));
			var graphObj = await jsonLdCompact(JSON.stringify(expanded), "https://schema.cassproject.org/0.4/");

			if(graphObj["rdf:type"] != undefined && graphObj["@type"] == undefined){
				if(graphObj["rdf:type"]["@id"] == undefined){
					graphObj["@type"] = graphObj["rdf:type"]
				}else{
					graphObj["@type"] = graphObj["rdf:type"]["@id"]
				}
				delete graphObj["rdf:type"];
			}

			if(graphObj["@type"] == "asn:StandardDocument"){
				frameworkObj = graphObj;
			}else if (graphObj["@type"] == "asn:Statement" ){
				competencyList.push(graphObj);
			}

			graph.push(graphObj);
		}
	}

	if(frameworkObj == undefined && competencyList.length != Object.keys(graph).length){
		await importJsonLdGraph.call(this,graph, context);
	}else{
		await importFrameworkToCass(this,frameworkObj, competencyList)
	}
}

bindWebService("/jsonld", importJsonLd);