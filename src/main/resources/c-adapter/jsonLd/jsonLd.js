/**
 *
 */
function importJsonLd(){
	var jsonLd, text;

	if(this.params.url != undefined && this.params.url != ""){
		text = httpGet(this.params.url);
	}else if(this.params.path != undefined && this.params.path  != ""){
		text = fileToString(fileLoad(this.params.path));
	}else if(this.params.text != undefined && this.params.text != ""){
		text = this.params.text;
	}else{
		var file = getFileFromPost.call(this);

		if(file == undefined || file == null){
			error("Unable to find ASN to Convert");
		}else if(file.length != undefined){
			var data = getFileFromPost.call(this, "data");
			if(data != undefined && data != null){
				text = fileToString(data);
			}else if(file.length != 0){
				text = fileToString(file[0]);
			}else{
				error("No File Found");
			}
		}else{
			text = fileToString(file);
		}
	}

	try{
		jsonLd = JSON.parse(text);
	}catch(e){
		debug("Not json")

		jsonLd = rdfToJsonLd(text);
	}

	//print(JSON.stringify(jsonLd));

	jsonLd = fixScalars(jsonLd);

	//print(JSON.stringify(jsonLd));

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

			var expanded = jsonLdExpand(JSON.stringify(obj));

			//print(JSON.stringify(expanded));

			var graphObj = jsonLdCompact(JSON.stringify(expanded), "http://schema.cassproject.org/0.3/");

			//print(JSON.stringify(graphObj));

			if(graphObj["rdf:type"] != undefined && graphObj["@type"] == undefined){
				//print(JSON.stringify(graphObj["rdf:type"]));
				//print(Object.keys(graphObj["rdf:type"]));
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

			graph.push[graphObj];
		}
	}

	if(frameworkObj == undefined && competencyList.length != Object.keys(graph).length){
		importJsonLdGraph(graph, context);
	}else{
		importFrameworkToCass(frameworkObj, competencyList)
	}
}

bindWebService("/jsonld", importJsonLd);