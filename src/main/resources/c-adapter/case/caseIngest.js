var caseToCassSchema = "https://schema.cassproject.org/0.4/case2cass";
var testCase = false;

var caseInterface = {
    CFDocuments: function () {
        return httpGet(this.targetUrl + "/ims/case/v1p0/CFDocuments",true,{"Accept":"application/json"});
    },
    CFDocument: function (sourcedId) {
        return httpGet(this.targetUrl + "/ims/case/v1p0/CFDocuments/" + sourcedId,true,{"Accept":"application/json"});
    },
    CFPackages: function (sourcedId) {
        return httpGet(this.targetUrl + "/ims/case/v1p0/CFPackages/" + sourcedId,true,{"Accept":"application/json"});
    },
    CFItems: function (sourcedId) {
        return httpGet(this.targetUrl + "/ims/case/v1p0/CFItems/" + sourcedId,true,{"Accept":"application/json"});
    },
    CFAssociations: function (sourcedId) {
        return httpGet(this.targetUrl + "/ims/case/v1p0/CFAssociations/" + sourcedId,true,{"Accept":"application/json"});
    },
    CFItemAssociations: function (sourcedId) {
        return httpGet(this.targetUrl + "/ims/case/v1p0/CFItemAssociations/" + sourcedId,true,{"Accept":"application/json"});
    },
    CFAssociationGroupings: function (sourcedId) {
        return httpGet(this.targetUrl + "/ims/case/v1p0/CFAssociationGroupings/" + sourcedId,true,{"Accept":"application/json"});
    },
    CFConcepts: function (sourcedId) {
        return httpGet(this.targetUrl + "/ims/case/v1p0/CFConcepts/" + sourcedId,true,{"Accept":"application/json"});
    },
    CFItemTypes: function (sourcedId) {
        return httpGet(this.targetUrl + "/ims/case/v1p0/CFItemTypes/" + sourcedId,true,{"Accept":"application/json"});
    },
    CFLicenses: function (sourcedId) {
        return httpGet(this.targetUrl + "/ims/case/v1p0/CFLicenses/" + sourcedId,true,{"Accept":"application/json"});
    },
    CFSubjects: function (sourcedId) {
        return httpGet(this.targetUrl + "/ims/case/v1p0/CFSubjects/" + sourcedId,true,{"Accept":"application/json"});
    },
    CFRubrics: function (sourcedId) {
        return httpGet(this.targetUrl + "/ims/case/v1p0/CFRubrics/" + sourcedId,true,{"Accept":"application/json"});
    }
}

stripCassNamespace = function (o) {
    if (typeof o["@context"] === "string" && o["@context"].indexOf("://schema.cassproject.org") == -1)
        return o;
    var keys = EcObject.keys(o);
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (k.indexOf("cass:") == 0) {
            o[k.replace("cass:", "")] = o[k];
            delete o[k];
        }
    }
    return o;
}

setDateCreated = function(object) {
    if (object["ceasn:dateCreated"] == null && (object)["schema:dateCreated"] == null) {
        var timestamp = getTimestamp(object);
        var date;
        if (timestamp != null) {
            date = new Date(parseInt(timestamp)).toISOString();
        } else {
            date = new Date().toISOString();
        }
        object["schema:dateCreated"] = date;
    }
};

getTimestamp = function(object) {
    var timestamp = object["id"].substring(object["id"].lastIndexOf("/") + 1);
    if (timestamp.matches("[0-9]+")) {
        return Integer.parseInt(timestamp);
    } else {
        return null;
    }
};

convertCFDocumentToFramework = function (document) {
    var f = new EcFramework();
    f.assignId(document.identifier);
    if (document.subjectURI != null)
        for (var j = 0; j < document.subjectURI.length; j++) {
            document.subjectURI[j]["@context"] = caseToCassSchema;
            document.subjectURI[j]["@type"] = "reference";
            document.subjectURI[j]["schema:alignmentType"] = "educationalSubject";
        }
    document["@type"] = "CFDocument";
    document["@context"] = caseToCassSchema;
    document = jsonLdExpand(JSON.stringify(document));
    document = jsonLdCompact(JSON.stringify(document), cassContext);
    f.copyFrom(document);
    if ((f["schema:inLanguage"] == null || f["schema:inLanguage"] === undefined)
        && EcFramework.template != null && EcFramework.template["schema:inLanguage"] != null) {
        f["schema:inLanguage"] = EcFramework.template["schema:inLanguage"];
    }
    if (EcFramework.template != null && EcFramework.template["schema:dateCreated"] != null) {
        setDateCreated(f);
    }
    return f;
}

convertCFAssociationIntoRelation = function (a) {
    a["@type"] = "CFAssociation";
    a["@context"] = caseToCassSchema;
    a.originNodeURI = a.originNodeURI.uri;
    a.destinationNodeURI = a.destinationNodeURI.uri;
    delete a.CFDocumentURI;
    a = jsonLdExpand(JSON.stringify(a));
    a = jsonLdCompact(JSON.stringify(a), cassContext);
    a.relationType = {
        "exactMatchOf": Relation.IS_EQUIVALENT_TO,
        "isChildOf": Relation.NARROWS
    }[a.relationType];
    a = stripCassNamespace(a);
    var r = new EcAlignment();
    r.copyFrom(a);
    return r;
}

convertCFItemIntoCompetency = function (a) {
    a["@type"] = "CFItem";
    a["@context"] = caseToCassSchema;
    delete a.CFDocumentURI;
    if (a.educationLevel != null)
        for (var i = 0; i < a.educationLevel.length; i++) {
            if (!EcObject.isObject(a.educationLevel[i]))
                a.educationLevel[i] = {
                    "@type": "reference",
                    "@context": caseToCassSchema,
                    "schema:alignmentType": "educationalLevel",
                    "schema:targetName": a.educationLevel[i]
                };
        }
    a = jsonLdExpand(JSON.stringify(a));
    a = jsonLdCompact(JSON.stringify(a), cassContext);
    var r = new EcCompetency();
    r.copyFrom(a);
    if (EcCompetency.template != null && EcCompetency.template["schema:dateCreated"] != null) {
        setDateCreated(r);
    }
    return r;
}

//Returns array of objects to save.
embedCFPackageIntoFramework = function(f,document){
	var p = caseInterface.CFPackages.call(this,document.CFPackageURI.identifier);
	var results = [f];
	var i = 0;
	if (p.CFAssociations != null)
	for (i = 0;i < p.CFAssociations.length;i++)
	{
		var relation = convertCFAssociationIntoRelation(p.CFAssociations[i]);
		results.push(relation);
        p.CFAssociations[i] = relation.id;
	}
	f.relation = p.CFAssociations;
    if (p.CFItems != null)
	for (i = 0;i < p.CFItems.length;i++)
	{
		var competency = convertCFItemIntoCompetency(p.CFItems[i]);
		results.push(competency);
        p.CFItems[i] = competency.id;
	}
	f.competency = p.CFItems;
	return results;
}

testSuiteCase = function() {
    var targetUrl = this.params.caseEndpoint;
    this.targetUrl = targetUrl;
    caseInterface.CFAssociationGroupings.call(this, this.params.dId);
    caseInterface.CFConcepts.call(this, this.params.dId);
    caseInterface.CFDocuments.call(this, this.params.dId);
    caseInterface.CFItemAssociations.call(this, this.params.dId);
    caseInterface.CFItemTypes.call(this, this.params.dId);
    caseInterface.CFItems.call(this, this.params.dId);
    caseInterface.CFLicenses.call(this, this.params.dId);
    caseInterface.CFPackages.call(this, this.params.dId);
    caseInterface.CFRubrics.call(this, this.params.dId);
    caseInterface.CFSubjects.call(this, this.params.dId);
    caseInterface.CFAssociations.call(this, this.params.dId);
}

var cassContext = null;
ingestCase = function () {
    if (testCase == true) {
        return testSuiteCase.call(this);
    }
    cassContext = JSON.stringify(JSON.parse(httpGet("https://schema.cassproject.org/0.4/",true,{"Accept":"application/json"}))["@context"]);
    var owner = fileToString.call(this,(fileFromDatastream).call(this,"owner"));

    var caseIdentity = new EcIdentity();
    caseIdentity.ppk = EcPpk.fromPem(keyFor("adapter.case.private"));
    caseIdentity.displayName = "CASE Server Identity";
    EcIdentityManager.addIdentity(caseIdentity);

    EcRemote.async = false;
    var targetUrl = this.params.caseEndpoint;
    if (targetUrl == null)
        return "Please specify caseEndpoint = <target server> -- we'll add the /ims/case/v1p0.";
    this.targetUrl = targetUrl;
    var documents = null;
    if (this.params.dId != null)
        documents = {
            CFDocuments: [caseInterface.CFDocument.call(this, this.params.dId)]
        };
    else
        documents = caseInterface.CFDocuments.call(this);
    var dx;
    for (var i = 0; i < documents.CFDocuments.length; i++) {
        var document = documents.CFDocuments[i];
        var f = convertCFDocumentToFramework(document);
        var listToSave = embedCFPackageIntoFramework.call(this,f, document);
        for (var j = 0; j < listToSave.length; j++) {
            listToSave[j].addOwner(caseIdentity.ppk.toPk());
            if (owner != null)
                listToSave[j].addOwner(EcPk.fromPem(owner));
        }
        repo.multiput(listToSave,function(results){},console.error);
    }
    return JSON.stringify(dx, null, 2);
}

getDocuments = function () {
    var url = this.params.url;
    url += "ims/case/v1p0/CFDocuments";
    var results = httpGet(url,true,{"Accept":"application/json"});
    return JSON.stringify(results);
}

bindWebService("/ims/case/harvest", ingestCase);
bindWebService("/ims/case/getDocs", getDocuments);
