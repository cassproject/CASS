var asnContext = {
	asn:"http://purl.org/ASN/schema/core/",
	cc:"http://creativecommons.org/ns#",
	dc:"http://purl.org/dc/elements/1.1/",
	dcterms:"http://purl.org/dc/terms/",
	foaf:"http://xmlns.com/foaf/0.1/",
	gemq:"http://purl.org/gem/qualifiers/",
	loc:"http://www.loc.gov/loc.terms/relators/",
	owl:"http://www.w3.org/2002/07/owl#",
	rdf:"http://www.w3.org/1999/02/22-rdf-syntax-ns#",
	rdfs:"http://www.w3.org/2000/01/rdf-schema#",
	skos:"http://www.w3.org/2004/02/skos/core#"
};
//asnContext["@vocab"] = "http://schema.cassproject.org/0.2/cass2asn";

function cassFrameworkAsAsn(){
	var query = queryParse.call(this);

	
    var framework = skyrepoGet.call(this,{id:this.params.id});
    
    var idSplit = framework["@id"].split("/");
    
    framework = skyrepoGet.call(this,{id:this.params.id, version:idSplit[idSplit.length-1], type:idSplit[idSplit.length-3]});
    
    debug(framework)
    
    if (framework == null)
    	error("Framework not found.","404");

    var f = new EcFramework();
    f.copyFrom(framework);
    if (f.competency == null) f.competency = [];
    if (f.relation == null) f.relation = [];

    var ids = [];
    ids = ids.concat(f.competency);
    ids = ids.concat(f.relation);

	if (ids.length > 0)
	{
    	var repo = new EcRepository();
    	var firstId = ids[0];
    	if (firstId.indexOf("data") != -1)
    	{
    		repo.selectedServer = firstId.substring(0,firstId.indexOf("/data"));
    		print(repo.selectedServer);
			repo.multiget(ids, function (results) {}, print, function (results) {});
		}
	}
	var allCompetencies = JSON.parse(JSON.stringify(f.competency));
    var competencies = {};
    var topLevelCompIds = []
    for (var i = 0;i < f.competency.length;i++){
    	competencies[f.competency[i]] = EcCompetency.getBlocking(f.competency[i]);
    }
    	

    for (var i = 0;i < f.relation.length;i++)
    {
    	var r = EcAlignment.getBlocking(f.relation[i]);
    	if (r.relationType == Relation.NARROWS)
    	{
    		EcArray.setRemove(f.competency,r.target);
    		if (competencies[r.target].competency == null)
    			competencies[r.target].competency = [];
    		competencies[r.target].competency.push(competencies[r.source].id);
    		if (competencies[r.source]["gemq:hasChild"] == null)
    			competencies[r.source]["gemq:hasChild"] = [];
    		competencies[r.source]["gemq:hasChild"].push(competencies[r.target].id);
    		
    		if (competencies[r.target]["gemq:isChildOf"] == null)
    			competencies[r.target]["gemq:isChildOf"] = [];
    		competencies[r.target]["gemq:isChildOf"].push(competencies[r.source].id);
    	}
    	if (r.relationType == Relation.IS_EQUIVALENT_TO)
    	{
    		EcArray.setRemove(f.competency,r.source);
    		if (competencies[r.target].sameAs == null)
    			competencies[r.target].sameAs = [];
    		competencies[r.target].sameAs.push(competencies[r.source].id);
    		competencies[r.source].sameAs.push(competencies[r.target].id);
    	}
    	if (r.relationType == Relation.IS_RELATED_TO)
    	{
    		EcArray.setRemove(f.competency,r.source);
    		if (competencies[r.target]["skos:relatedMatch"] == null)
    			competencies[r.target]["skos:relatedMatch"] = [];
    		competencies[r.target]["skos:relatedMatch"].push(competencies[r.source].id);
    		competencies[r.source]["skos:relatedMatch"].push(competencies[r.target].id);
    	}
    	if (r.relationType == Relation.REQUIRES)
    	{
    		EcArray.setRemove(f.competency,r.source);
    		if (competencies[r.target]["asn:prerequisiteAlignment"] == null)
    			competencies[r.target]["asn:prerequisiteAlignment"] = [];
    		competencies[r.target]["asn:prerequisiteAlignment"].push(competencies[r.source].id);
    	}
    }

	for (var i = 0;i < allCompetencies.length;i++)
	{
		var c = competencies[allCompetencies[i]];
		delete competencies[allCompetencies[i]];
		var id = c.id;
		c.context="http://schema.cassproject.org/0.3/cass2asn";
		competencies[id] = JSON.parse(jsonLdToRdfJson(c.toJson()))[id];
	}

	f.context="http://schema.cassproject.org/0.3/cass2asn";
	delete f.relation;
	competencies[f.id] = JSON.parse(jsonLdToRdfJson(f.toJson()))[f.id];
    return JSON.stringify(competencies,null,2);
}


function asnFrameworkToCass(){
	var asnToCassFrameworkContext = JSON.parse(JSON.stringify(asnContext));
	asnToCassFrameworkContext["@vocab"] = "http://schema.cassproject.org/0.3/";
	asnToCassFrameworkContext["asn:StandardDocument"] = "http://schema.cassproject.org/0.3/Framework";
	asnToCassFrameworkContext["dc:title"] = "http://schema.org/name";
	asnToCassFrameworkContext["dcterms:description"] = "http://schema.org/description";
	asnToCassFrameworkContext["sameAs"] = "http://schema.org/sameAs";

	var asnToCassCompetencyContext = JSON.parse(JSON.stringify(asnContext));
	asnToCassCompetencyContext["asn:Statement"] = "http://schema.cassproject.org/0.3/Competency";
	asnToCassCompetencyContext["dcterms:description"] = "http://schema.org/name";
	asnToCassCompetencyContext["sameAs"] =  "http://schema.org/sameAs";

	var jsonLd, text;

	if(this.params.url != undefined && this.params.url != ""){
		text = httpGet(this.params.url)
	}else if(this.params.file != undefined && this.params.file  != ""){
		text = fileToString(fileLoad(this.params.file));
	}else if(this.params.text != undefined && this.params.text != ""){
		text = this.params.text
	}else{
		var file = getFileFromPost();
		
		if(file == undefined || file == null){
			error("Unable to find ASN to Convert");
		}else if(file.length != undefined){
			text = fileToString(file[0]);
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
	

	var frameworkObj = undefined;
	var competencyList = [];
	var cassCompetencies = [];
	var cassRelationships = [];
	var idMap = {};
	var parentMap = {};
	
	if(jsonLd["@graph"] != undefined && jsonLd["@graph"] != ""){
		var graph = jsonLd["@graph"];
		
		for(var idx in graph){
			var graphObj = graph[idx];
			
			if(graphObj["@type"] == "asn:StandardDocument"){
				frameworkObj = graphObj;
			}else if (graphObj["@type"] == "asn:Statement" ){ //&& graphObj["asn:statementLabel"] != undefined && (graphObj["asn:statementLabel"] == "Competency" || graphObj["asn:statementLabel"]["@value"] == "Competency")){
				competencyList.push(graphObj);
			}
		}
		
		if(frameworkObj == undefined && competencyList.length != Object.keys(graph).length){
			importJsonLdGraph(graph, jsonLd["@context"]);
		}else{
			for(var idx in competencyList){
				var asnComp = competencyList[idx];
				
				var compType="schema.cassproject.org.0.3.Competency";
				var compGuid = generateUUID();
				var compVersion=date(null, null, true);
				
				var newId = repoEndpoint() + "data/" + compType + "/" + compGuid + "/" + compVersion;
				
				idMap[asnComp["@id"]] = newId;
				cassCompetencies.push(newId);
				
				var childComps = asnComp["gemq:hasChild"];
				if(childComps != undefined && childComps.length != undefined){
					for(var idx in childComps){
						parentMap[childComps[idx]["@id"]] = newId; 
					}
				}
				
				
				var newComp = JSON.parse(JSON.stringify(asnComp));
				delete newComp["gemq:hasChild"];
				
				newComp["@context"] = asnToCassCompetencyContext;
				newComp["sameAs"] = asnComp["@id"];
				
				var expandedComp = jsonLdExpand(JSON.stringify(newComp));
				
				var compactedComp = jsonLdCompact(JSON.stringify(expandedComp), "http://schema.cassproject.org/0.3");
				
				delete compactedComp["gemq:isChildOf"];
				
				compactedComp["@id"] = newId;
				
				//debug(JSON.stringify(compactedComp, null, 2))
				
				// Create Competency
				skyrepoPut({"obj":JSON.stringify(compactedComp), "type":compType, "id":compGuid, "version":compVersion});
				
				if(asnComp["gemq:isChildOf"] != undefined && asnComp["gemq:isChildOf"] != ""){
					var parentId = asnComp["gemq:isChildOf"]["@id"];
					
					var relType = "schema.cassproject.org.0.3.Relation";
					var relId = generateUUID();
					var relVersion = date(null, null, true);

					if(idMap[parentId] != undefined && idMap[parentId] != ""){
						
						var relation = {source:idMap[parentId], target:compactedComp["@id"], relationType:"narrows"};
						relation["@context"] = "http://schema.cassproject.org/0.3/";
						relation["@type"] = "Relation";
						relation["@id"] = repoEndpoint() + "data/" + relType + "/" + relId + "/" + relVersion;
						
						cassRelationships.push(relation["@id"]);
						
						// Create Parent-Child Relation
						skyrepoPut({"obj":JSON.stringify(relation), "type":relType, "id":relId, "version":relVersion})
					} 
				}	
			} // end for each competency in  competencyList
			
			if(frameworkObj != null){
				var guid=generateUUID();
				var type="schema.cassproject.org.0.3.Framework";
				var version= date(null, null, true);
				
				frameworkObj["@context"] = asnToCassFrameworkContext;
				frameworkObj["sameAs"] = frameworkObj["@id"];
				frameworkObj["@id"] = repoEndpoint() + "data/" + type + "/" + guid + "/" + version;

				
				var expanded = jsonLdExpand(JSON.stringify(frameworkObj))[0];
				
				var compacted = jsonLdCompact(JSON.stringify(expanded), "http://schema.cassproject.org/0.3/");
				
				
				delete compacted["gemq:hasChild"];
				
				compacted["competency"] = cassCompetencies;
				compacted["relation"] = cassRelationships;
				
				debug(JSON.stringify(compacted));
				
				// Create Framework
				skyrepoPut({"obj":JSON.stringify(compacted), "type":type, "id":guid, "version":version});
			} // end if frameworkObj != null
		}
	}else{
		error("no @graph created, unsure how to parse");
	}
}




function importJsonLdGraph(graph, context){
	debug("importing jsonld graph")
	
	for(var idx in graph){
		var graphObj = graph[idx];
		
		if(context != undefined){
			if(context["schema"] == undefined){
				context["schema"] = "http://schema.org";
			}
			
			graphObj["@context"] = context;
			
			var expanded = jsonLdExpand(JSON.stringify(graphObj))[0];
			var compacted = jsonLdCompact(JSON.stringify(expanded), "http://schema.cassproject.org/0.3/");
		}
		
		compacted["sameAs"] = compacted["@id"];
		
		var type = compacted["@type"]
		var guid=generateUUID();
		var version= date(null, null, true);
		
		compacted["@id"] = repoEndpoint() + "data/" + type + "/" + guid + "/" + version;
		
		debug(skyrepoPut({"obj":JSON.stringify(compacted), "id":guid, "version":version}));
	}
}

function importJsonLd(){
	var jsonLd, text;

	if(this.params.url != undefined && this.params.url != ""){
		text = httpGet(this.params.url)
	}else if(this.params.file != undefined && this.params.file  != ""){
		text = fileToString(fileLoad(this.params.file));
	}else if(this.params.text != undefined && this.params.text != ""){
		text = this.params.text
	}else{
		var file = getFileFromPost();
		
		if(file == undefined || file == null){
			error("Unable to find ASN to Convert");
		}else if(file.length != undefined){
			text = fileToString(file[0]);
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
	
	if(jsonLd["@graph"] != undefined && jsonLd["@graph"] != ""){
		var graph = jsonLd["@graph"];
		
		importJsonLdGraph(graph, jsonLd["@context"]);
		
	}else{
		error("no @graph created, unsure how to parse");
	}
}

bindWebService("/jsonld", importJsonLd);
bindWebService("/toAsn", cassFrameworkAsAsn);
bindWebService("/fromAsn", asnFrameworkToCass);

