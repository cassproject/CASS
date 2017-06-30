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

    var framework = skyrepoGet.call(this,{id:query.id});
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
    for (var i = 0;i < f.competency.length;i++)
    	competencies[f.competency[i]] = EcCompetency.getBlocking(f.competency[i]);

    for (var i = 0;i < f.relation.length;i++)
    {
    	var r = EcAlignment.getBlocking(f.relation[i]);
    	if (r.relationType == Relation.NARROWS)
    	{
    		EcArray.setRemove(f.competency,r.source);
    		if (competencies[r.target].competency == null)
    			competencies[r.target].competency = [];
    		competencies[r.target].competency.push(competencies[r.source].id);
    		if (competencies[r.source]["asn:narrowsAlignment"] == null)
    			competencies[r.source]["asn:narrowsAlignment"] = [];
    		competencies[r.source]["asn:narrowsAlignment"].push(competencies[r.target].id);
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
		c.context="http://schema.cassproject.org/0.2/cass2asn";
		competencies[id] = JSON.parse(jsonLdToRdfJson(c.toJson()))[id];
	}

	f.context="http://schema.cassproject.org/0.2/cass2asn";
	delete f.relation;
	competencies[f.id] = JSON.parse(jsonLdToRdfJson(f.toJson()))[f.id];
    return JSON.stringify(competencies,null,2);
}
bindWebService("/asn", cassFrameworkAsAsn);