var caseToCassSchema = "https://schema.cassproject.org/0.4";
var testCase = false;

var caseInterface = {
    CFDocuments: async function () {
        return await httpGet(this.targetUrl + "/ims/case/v1p0/CFDocuments",true,{"Accept":"application/json"});
    },
    CFDocument: async function (sourcedId) {
        return await httpGet(this.targetUrl + "/ims/case/v1p0/CFDocuments/" + sourcedId,true,{"Accept":"application/json"});
    },
    CFPackages: async function (sourcedId) {
        return await httpGet(this.targetUrl + "/ims/case/v1p0/CFPackages/" + sourcedId,true,{"Accept":"application/json"});
    },
    CFItems: async function (sourcedId) {
        return await httpGet(this.targetUrl + "/ims/case/v1p0/CFItems/" + sourcedId,true,{"Accept":"application/json"});
    },
    CFAssociations: async function (sourcedId) {
        return await httpGet(this.targetUrl + "/ims/case/v1p0/CFAssociations/" + sourcedId,true,{"Accept":"application/json"});
    },
    CFItemAssociations: async function (sourcedId) {
        return await httpGet(this.targetUrl + "/ims/case/v1p0/CFItemAssociations/" + sourcedId,true,{"Accept":"application/json"});
    },
    CFAssociationGroupings: async function (sourcedId) {
        return await httpGet(this.targetUrl + "/ims/case/v1p0/CFAssociationGroupings/" + sourcedId,true,{"Accept":"application/json"});
    },
    CFConcepts: async function (sourcedId) {
        return await httpGet(this.targetUrl + "/ims/case/v1p0/CFConcepts/" + sourcedId,true,{"Accept":"application/json"});
    },
    CFItemTypes: async function (sourcedId) {
        return await httpGet(this.targetUrl + "/ims/case/v1p0/CFItemTypes/" + sourcedId,true,{"Accept":"application/json"});
    },
    CFLicenses: async function (sourcedId) {
        return await httpGet(this.targetUrl + "/ims/case/v1p0/CFLicenses/" + sourcedId,true,{"Accept":"application/json"});
    },
    CFSubjects: async function (sourcedId) {
        return await httpGet(this.targetUrl + "/ims/case/v1p0/CFSubjects/" + sourcedId,true,{"Accept":"application/json"});
    },
    CFRubrics: async function (sourcedId) {
        return await httpGet(this.targetUrl + "/ims/case/v1p0/CFRubrics/" + sourcedId,true,{"Accept":"application/json"});
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

convertCFDocumentToFramework = async function (document, terms) {
    var f = new EcFramework();
    f.assignId(document.identifier);
    if (document.subjectURI != null)
        for (var j = 0; j < document.subjectURI.length; j++) {
            document.subjectURI[j]["@context"] = caseToCassSchema;
            document.subjectURI[j]["@type"] = "reference";
            document.subjectURI[j]["schema:alignmentType"] = "educationalSubject";
        }
    document["@type"] = "Framework";
    document["@context"] = caseToCassSchema;
    for (let each in document) {
        if (terms[each]) {
            document[terms[each]] = document[each];
            delete document[each];
        }
    }
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

convertCFAssociationIntoRelation = async function (a, terms) {
    a["@type"] = "Relation";
    a["@context"] = caseToCassSchema;
    a.originNodeURI = a.originNodeURI.uri;
    a.destinationNodeURI = a.destinationNodeURI.uri;
    delete a.CFDocumentURI;
    for (let each in a) {
        if (terms[each]) {
            a[terms[each]] = a[each];
            delete a[each];
        }
    }
    a["cass:relationType"] = {
        "exactMatchOf": Relation.IS_EQUIVALENT_TO,
        "isChildOf": Relation.NARROWS
    }[a["cass:relationType"]];
    a = stripCassNamespace(a);
    var r = new EcAlignment();
    r.copyFrom(a);
    return r;
}

convertCFItemIntoCompetency = async function (a, terms) {
    a["@type"] = "Competency";
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
    for (let each in a) {
        if (terms[each]) {
            a[terms[each]] = a[each];
            delete a[each];
        }
    }
    var r = new EcCompetency();
    r.copyFrom(a);
    if (EcCompetency.template != null && EcCompetency.template["schema:dateCreated"] != null) {
        setDateCreated(r);
    }
    return r;
}

//Returns array of objects to save.
embedCFPackageIntoFramework = async function(f,document, terms){
	var p = await caseInterface.CFPackages.call(this,document.CFPackageURI.identifier);
	var results = [f];
	var i = 0;
	if (p.CFAssociations != null)
	for (i = 0;i < p.CFAssociations.length;i++)
	{
		var relation = await convertCFAssociationIntoRelation(p.CFAssociations[i], terms);
		results.push(relation);
        p.CFAssociations[i] = relation.id;
	}
	f.relation = p.CFAssociations;
    if (p.CFItems != null)
	for (i = 0;i < p.CFItems.length;i++)
	{
		var competency = await convertCFItemIntoCompetency(p.CFItems[i], terms);
		results.push(competency);
        p.CFItems[i] = competency.id;
	}
	f.competency = p.CFItems;
	return results;
}

testSuiteCase = async function() {
    var targetUrl = this.params.caseEndpoint;
    this.targetUrl = targetUrl;
    await caseInterface.CFAssociationGroupings.call(this, this.params.dId);
    await caseInterface.CFConcepts.call(this, this.params.dId);
    await caseInterface.CFDocument.call(this, this.params.dId);
    await caseInterface.CFItemAssociations.call(this, this.params.dId);
    await caseInterface.CFItemTypes.call(this, this.params.dId);
    await caseInterface.CFItems.call(this, this.params.dId);
    await caseInterface.CFLicenses.call(this, this.params.dId);
    await caseInterface.CFPackages.call(this, this.params.dId);
    await caseInterface.CFRubrics.call(this, this.params.dId);
    await caseInterface.CFSubjects.call(this, this.params.dId);
    await caseInterface.CFAssociations.call(this, this.params.dId);
}

var cassContext = null;
ingestCase = async function () {
    if (testCase == true) {
        return await testSuiteCase.call(this);
    }
    cassContext = JSON.stringify((await httpGet("https://schema.cassproject.org/0.4/",true,{"Accept":"application/json"}))["@context"]);
    let terms = JSON.parse(JSON.stringify((await httpGet("https://schema.cassproject.org/0.4/jsonld1.1/case2cassTerms",true))));
    var owner = fileToString.call(this,(fileFromDatastream).call(this,"owner"));

    var caseIdentity = new EcIdentity();
    caseIdentity.ppk = EcPpk.fromPem(keyFor("adapter.case.private"));
    caseIdentity.displayName = "CASE Server Identity";
    EcIdentityManager.default.addIdentity(caseIdentity);

    var targetUrl = this.params.caseEndpoint;
    if (targetUrl.endsWith("/"))
        targetUrl = targetUrl.substring(0,targetUrl.length-1);
    if (targetUrl == null)
        return "Please specify caseEndpoint = <target server> -- we'll add the /ims/case/v1p0.";
    this.targetUrl = targetUrl;
    var documents = null;
    if (this.params.dId != null)
        documents = {
            CFDocuments: [await caseInterface.CFDocument.call(this, this.params.dId)]
        };
    else
        documents = await caseInterface.CFDocuments.call(this);
    var dx;
    for (var i = 0; i < documents.CFDocuments.length; i++) {
        var document = documents.CFDocuments[i];
        var f = await convertCFDocumentToFramework(document, terms);
        var listToSave = await embedCFPackageIntoFramework.call(this,f, document, terms);
        for (var j = 0; j < listToSave.length; j++) {
            listToSave[j].addOwner(caseIdentity.ppk.toPk());
            if (owner != null)
                listToSave[j].addOwner(EcPk.fromPem(owner));
        }
        await repo.multiput(listToSave,function(results){},(error) => {
            global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.ERROR, "CaseIngestCaseError", error);
        });
    }
    return JSON.stringify(dx, null, 2);
}

getDocuments = async function () {
    var url = this.params.url;
    url += "ims/case/v1p0/CFDocuments";
    var results = await httpGet(url,true,{"Accept":"application/json"});
    return JSON.stringify(results);
}

bindWebService("/ims/case/harvest", ingestCase);
bindWebService("/ims/case/getDocs", getDocuments);
