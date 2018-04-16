cfError = function (code, codeMajor, severity, description, codeMinor, codeMinorValue) {
    error(JSON.stringify({
        "imsx_codeMajor": codeMajor,
        "imsx_severity": severity,
        "imsx_description": description,
        "imsx_codeMinor": {
            "imsx_codeMinorField": [
                {
                    "imsx_codeMinorFieldName": codeMinor,
                    "imsx_codeMinorFieldValue": codeMinorValue
                }
            ]
        }
    }, null, 2), code);
}

cfGetFramework = function (f) {
    var query = queryParse.call(this);
    if (f == null || f === undefined || !EcObject.isObject(f)) {
        if (f == null)
            f = skyrepoGet.call(this, query);
        if (f == null || f["@type"] == null || !f["@type"].contains("ramework"))
            f = null;
        if (f == null)
            f = EcFramework.getBlocking(urlDecode(this.params.id));
        if (f == null)
            f = EcFramework.getBlocking(query.id);
        if (f == null) {
            var result = null;
            EcFramework.search(repo, "@id:" + query.id, function (success) {
                result = success;
            }, console.log);
            if (result.length > 0) {
                f = new EcFramework();
                f.copyFrom(result[0]);
            }
        }
    }
    var result = new EcFramework();
    result.copyFrom(f);
    return result;
};

cfGetCompetency = function (c) {
    var query = queryParse.call(this);
    var url = null;
    if (!EcObject.isObject(c)) {
        url = c;
        c = null;
    }
    if (c == null || c === undefined) {
        var competency = null;
        if (competency == null)
            competency = skyrepoGet.call(this, query);
        if (competency == null || competency["@type"] == null || !competency["@type"].contains("ompetency"))
            competency = null;
        if (competency == null && url != null)
            competency = EcCompetency.getBlocking(url);
        if (competency == null && url != null)
            competency = EcCompetency.getBlocking(thisEndpoint() + "data/" + EcCrypto.md5(url));
        if (competency == null) {
            var result = null;
            EcCompetency.search(repo, "@id:" + query.id, function (success) {
                result = success;
            }, console.log);
            if (result.length > 0) {
                competency = new EcCompetency();
                competency.copyFrom(result[0]);
            }
        }
        var c = new EcCompetency();
        c.copyFrom(competency);
    }
    return c;
};
cfClean = function (o) {
    o = JSON.parse(JSON.stringify(o));
    for (var key in o) {
        if (key.contains(":") || key.contains("@"))
            delete o[key];
    }
    return o;
}

/*Errors:
400 - An invalid selection field was supplied and data filtering on the selection criteria was not possible i.e. 'invalid_selection_field'. This is accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
401 - The request was not correctly authorised i.e. 'unauthorisedrequest'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
403 - This is used to indicate that the server can be reached and process the request but refuses to take any further action i.e. 'forbidden'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
404 - Either the supplied identifier is unknown in the Service Provider and so the object could not be changed or an invalid UUID has been supplied. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The statement 'Unknown Object' of 'Invalid UUID' should also be presented. The payload structure is defined by the structure imsx_StatusInfo.Type.
429 - The server is receiving too many requests i.e. 'server_busy'. Retry at a later time. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
500 - This code should be used only if there is catastrophic error and there is not a more appropriate code i.e. 'internal_server_error'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
*/
cfDocuments = function (f) {
    f = cfGetFramework.call(this, f);
    var name = f.getName();
    var guid = f.getGuid();
    f.context = "http://schema.cassproject.org/0.3/cass2case";
    f = jsonLdExpand(f.toJson());
    var f2 = jsonLdCompact(JSON.stringify(f), "http://schema.cassproject.org/0.3/sampleCase");
    f2.identifier = guid;
    f2.subjectURI = [];
    if (f2.subject != null && !EcArray.isArray(f2.subject)) f2.subject = [f2.subject];
    f2.CFPackageURI = {
        title: name,
        identifier: guid,
        uri: thisEndpoint() + "ims/case/v1p0/CFPackages/" + guid
    }
    f2.uri = thisEndpoint() + "ims/case/v1p0/CFDocuments/" + guid;
    f2 = cfClean(f2);
    return JSON.stringify(f2, null, 2);
}
/*Errors:
400 - An invalid selection field was supplied and data filtering on the selection criteria was not possible i.e. 'invalid_selection_field'. This is accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
401 - The request was not correctly authorised i.e. 'unauthorisedrequest'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
403 - This is used to indicate that the server can be reached and process the request but refuses to take any further action i.e. 'forbidden'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
404 - Either the supplied identifier is unknown in the Service Provider and so the object could not be changed or an invalid UUID has been supplied. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The statement 'Unknown Object' of 'Invalid UUID' should also be presented. The payload structure is defined by the structure imsx_StatusInfo.Type.
429 - The server is receiving too many requests i.e. 'server_busy'. Retry at a later time. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
500 - This code should be used only if there is catastrophic error and there is not a more appropriate code i.e. 'internal_server_error'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
*/
cfAssociations = function () {
    return cfItemAssociations.call(this);
}
/*Errors:
400 - An invalid selection field was supplied and data filtering on the selection criteria was not possible i.e. 'invalid_selection_field'. This is accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
401 - The request was not correctly authorised i.e. 'unauthorisedrequest'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
403 - This is used to indicate that the server can be reached and process the request but refuses to take any further action i.e. 'forbidden'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
404 - Either the supplied identifier is unknown in the Service Provider and so the object could not be changed or an invalid UUID has been supplied. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The statement 'Unknown Object' of 'Invalid UUID' should also be presented. The payload structure is defined by the structure imsx_StatusInfo.Type.
429 - The server is receiving too many requests i.e. 'server_busy'. Retry at a later time. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
500 - This code should be used only if there is catastrophic error and there is not a more appropriate code i.e. 'internal_server_error'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
*/
cfAssociationGroupings = function () {
    error("Not yet implemented.", 501)
}
/*Errors:
400 - An invalid selection field was supplied and data filtering on the selection criteria was not possible i.e. 'invalid_selection_field'. This is accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
401 - The request was not correctly authorised i.e. 'unauthorisedrequest'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
403 - This is used to indicate that the server can be reached and process the request but refuses to take any further action i.e. 'forbidden'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
404 - Either the supplied identifier is unknown in the Service Provider and so the object could not be changed or an invalid UUID has been supplied. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The statement 'Unknown Object' of 'Invalid UUID' should also be presented. The payload structure is defined by the structure imsx_StatusInfo.Type.
429 - The server is receiving too many requests i.e. 'server_busy'. Retry at a later time. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
500 - This code should be used only if there is catastrophic error and there is not a more appropriate code i.e. 'internal_server_error'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
*/
cfConcepts = function () {
    error("Not yet implemented.", 501)
}
/*
400 - An invalid selection field was supplied and data filtering on the selection criteria was not possible i.e. 'invalid_selection_field'. This is accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
401 - The request was not correctly authorised i.e. 'unauthorisedrequest'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
403 - This is used to indicate that the server can be reached and process the request but refuses to take any further action i.e. 'forbidden'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
404 - Either the supplied identifier is unknown in the Service Provider and so the object could not be changed or an invalid UUID has been supplied. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The statement 'Unknown Object' of 'Invalid UUID' should also be presented. The payload structure is defined by the structure imsx_StatusInfo.Type.
429 - The server is receiving too many requests i.e. 'server_busy'. Retry at a later time. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
500 - This code should be used only if there is catastrophic error and there is not a more appropriate code i.e. 'internal_server_error'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
*/
cfItems = function (f, fw) {
    var query = queryParse.call(this);
    f = cfGetCompetency.call(this, f);
    result = {};
    var shortId = f.shortId();
    var guid = f.getGuid();
    f.context = "http://schema.cassproject.org/0.3/cass2case";
    f = jsonLdExpand(f.toJson());
    var f2 = jsonLdCompact(JSON.stringify(f), "http://schema.cassproject.org/0.3/sampleCase");
    if (f2.subject != null && !EcArray.isArray(f2.subject)) f2.subject = [f2.subject];
    if (f2.title != null)
        f2.fullStatement = f2.title;
    delete f2.title;
    if (f2.description != null)
        f2.notes = f2.description;
    delete f2.description;
    if (f2.CFItemType == null) {
        f2.CFItemType = null;
        f2.CFItemTypeURI = null;
    }
    f2.CFDocumentURI = {};
    if (fw == null) {
        var parent = JSON.parse(skyRepoSearch({q: "competency:\"" + f2.uri + "\" OR competency:\"" + shortId + "\" OR competency:\"" + guid + "\" OR competency:\"" + EcCrypto.md5(f2.uri) + "\""}));
        if (parent.length == 0)
            cfError(400, '400', 'failure/error', 'Could not find CFDocument for this CFItem.', '1337');
        t = parent[0];
        parent[0] = new EcFramework();
        parent[0].copyFrom(t);
    }
    else
        parent = [fw];
    f2.CFDocumentURI.uri = JSON.parse(cfDocuments.call(this, parent[0])).uri;
    f2.CFDocumentURI.title = parent[0].name;
    f2.CFDocumentURI.identifier = JSON.parse(cfDocuments.call(this, parent[0])).identifier;
    f2.identifier = guid;
    f2.uri = thisEndpoint() + "ims/case/v1p0/CFItems/" + guid;
    f2 = cfClean(f2);
    return JSON.stringify(f2, null, 2);
}
/*
400 - An invalid selection field was supplied and data filtering on the selection criteria was not possible i.e. 'invalid_selection_field'. This is accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
401 - The request was not correctly authorised i.e. 'unauthorisedrequest'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
403 - This is used to indicate that the server can be reached and process the request but refuses to take any further action i.e. 'forbidden'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
404 - Either the supplied identifier is unknown in the Service Provider and so the object could not be changed or an invalid UUID has been supplied. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The statement 'Unknown Object' of 'Invalid UUID' should also be presented. The payload structure is defined by the structure imsx_StatusInfo.Type.
429 - The server is receiving too many requests i.e. 'server_busy'. Retry at a later time. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
500 - This code should be used only if there is catastrophic error and there is not a more appropriate code i.e. 'internal_server_error'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
*/
cfItemAssociations = function (f, fw) {
    var query = queryParse.call(this);
    if (f == null || f === undefined) {
        var framework = null;
        if (framework == null)
            framework = skyrepoGet.call(this, query);
        f = new EcAlignment();
        f.copyFrom(framework);
    }
    result = {};
    var timestamp = f.getTimestamp();
    var guid = f.getGuid();
    var shortId = f.shortId();
    f.context = "http://schema.cassproject.org/0.3/cass2case";
    f = jsonLdExpand(f.toJson());
//    f = jsonLdCompact(JSON.stringify(f),"http://schema.cassproject.org/0.3/cass2case");
    var f2 = jsonLdCompact(JSON.stringify(f), "http://schema.cassproject.org/0.3/sampleCase");
    f2.associationType = {"isEquivalentTo": "exactMatchOf", "narrows": "isChildOf"}[f2.relationType];
    delete f2.relationType;
    if (f2.destinationNodeURI == null) return null;
    if (f2.originNodeURI == null) return null;
    var destNode = cfGetCompetency(f2.destinationNodeURI.uri);
    var t = destNode;
    destNode = new EcCompetency();
    destNode.copyFrom(t);
    var sourceNode = cfGetCompetency(f2.originNodeURI.uri);
    t = sourceNode;
    sourceNode = new EcCompetency();
    sourceNode.copyFrom(t);
    f2.destinationNodeURI.title = destNode.name;
    f2.destinationNodeURI.uri = JSON.parse(cfItems.call(this, destNode, fw)).uri;
    f2.destinationNodeURI.identifier = JSON.parse(cfItems.call(this, destNode, fw)).identifier;
    f2.originNodeURI.title = sourceNode.name;
    f2.originNodeURI.uri = JSON.parse(cfItems.call(this, sourceNode, fw)).uri;
    f2.originNodeURI.identifier = JSON.parse(cfItems.call(this, sourceNode, fw)).identifier;
    f2.CFDocumentURI = {};
    if (fw == null) {
        var parent = JSON.parse(skyRepoSearch({q: "relation:\"" + f2.uri + "\" OR relation:\"" + shortId + "\" OR relation:\"" + guid + "\" OR relation:\"" + EcCrypto.md5(f2.uri) + "\""}));
        if (parent.length == 0)
            cfError(400, '400', 'failure/error', 'Could not find CFDocument for this CFAssociation.', '1337');
        t = parent[0];
        parent[0] = new EcFramework();
        parent[0].copyFrom(t);
    }
    else
        parent = [fw];
    f2.CFDocumentURI.uri = JSON.parse(cfDocuments.call(this, parent[0])).uri;
    f2.CFDocumentURI.title = parent[0].name;
    f2.CFDocumentURI.identifier = JSON.parse(cfDocuments.call(this, parent[0])).identifier;
    f2.lastChangeDateTime = date(timestamp, "yyyy-MM-dd'T'HH:mm:ssXXX");
    f2.identifier = guid;
    f2.uri = thisEndpoint() + "ims/case/v1p0/CFAssociations/" + guid;
    f2 = cfClean(f2);
    return JSON.stringify(f2, null, 2);
}
/*
400 - An invalid selection field was supplied and data filtering on the selection criteria was not possible i.e. 'invalid_selection_field'. This is accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
401 - The request was not correctly authorised i.e. 'unauthorisedrequest'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
403 - This is used to indicate that the server can be reached and process the request but refuses to take any further action i.e. 'forbidden'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
404 - Either the supplied identifier is unknown in the Service Provider and so the object could not be changed or an invalid UUID has been supplied. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The statement 'Unknown Object' of 'Invalid UUID' should also be presented. The payload structure is defined by the structure imsx_StatusInfo.Type.
429 - The server is receiving too many requests i.e. 'server_busy'. Retry at a later time. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
500 - This code should be used only if there is catastrophic error and there is not a more appropriate code i.e. 'internal_server_error'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
*/
cfItemTypes = function () {
    error("Not yet implemented.", 501)
}
/*
400 - An invalid selection field was supplied and data filtering on the selection criteria was not possible i.e. 'invalid_selection_field'. This is accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
401 - The request was not correctly authorised i.e. 'unauthorisedrequest'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
403 - This is used to indicate that the server can be reached and process the request but refuses to take any further action i.e. 'forbidden'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
404 - Either the supplied identifier is unknown in the Service Provider and so the object could not be changed or an invalid UUID has been supplied. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The statement 'Unknown Object' of 'Invalid UUID' should also be presented. The payload structure is defined by the structure imsx_StatusInfo.Type.
429 - The server is receiving too many requests i.e. 'server_busy'. Retry at a later time. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
500 - This code should be used only if there is catastrophic error and there is not a more appropriate code i.e. 'internal_server_error'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
*/
cfLicenses = function () {
    error("Not yet implemented.", 501)
}
/*
400 - An invalid selection field was supplied and data filtering on the selection criteria was not possible i.e. 'invalid_selection_field'. This is accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
401 - The request was not correctly authorised i.e. 'unauthorisedrequest'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
403 - This is used to indicate that the server can be reached and process the request but refuses to take any further action i.e. 'forbidden'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
404 - Either the supplied identifier is unknown in the Service Provider and so the object could not be changed or an invalid UUID has been supplied. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The statement 'Unknown Object' of 'Invalid UUID' should also be presented. The payload structure is defined by the structure imsx_StatusInfo.Type.
429 - The server is receiving too many requests i.e. 'server_busy'. Retry at a later time. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
500 - This code should be used only if there is catastrophic error and there is not a more appropriate code i.e. 'internal_server_error'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
*/
var repo;
cfPackages = function (f) {
    if (repo == null)
        repo = new EcRepository();
    repo.selectedServer = thisEndpoint();

    EcRepository.cache = {};
    var result = {};
    var f2 = result;
    f = cfGetFramework.call(this, f);

    result.CFDocument = JSON.parse(cfDocuments.call(this, f));
    result.CFItems = [];
    if (f.competency != null)
        for (var i = 0; i < f.competency.length; i++) {
            var c = EcCompetency.getBlocking(f.competency[i]);
            if (c != null)
                c= JSON.parse(cfItems(c, f));
            if (c != null)
                result.CFItems.push(c);
        }
    result.CFAssociations = [];
    if (f.relation != null)
        for (var i = 0; i < f.relation.length; i++) {
            var a = EcAlignment.getBlocking(f.relation[i]);
            if (a != null)
                a = JSON.parse(cfItemAssociations(a, f));
            if (a != null)
                result.CFAssociations.push(a);
        }
    result.CFDefinitions = {CFConcepts: [], CFSubject: [], CFLicenses: [], CFItemTypes: [], CFAssociationGroupings: []};
    f2 = cfClean(f2);
    return JSON.stringify(result, null, 2);
}
/*
400 - An invalid selection field was supplied and data filtering on the selection criteria was not possible i.e. 'invalid_selection_field'. This is accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
401 - The request was not correctly authorised i.e. 'unauthorisedrequest'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
403 - This is used to indicate that the server can be reached and process the request but refuses to take any further action i.e. 'forbidden'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
404 - Either the supplied identifier is unknown in the Service Provider and so the object could not be changed or an invalid UUID has been supplied. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The statement 'Unknown Object' of 'Invalid UUID' should also be presented. The payload structure is defined by the structure imsx_StatusInfo.Type.
429 - The server is receiving too many requests i.e. 'server_busy'. Retry at a later time. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
500 - This code should be used only if there is catastrophic error and there is not a more appropriate code i.e. 'internal_server_error'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
*/
cfRubrics = function () {
    error("Not yet implemented.", 501)
}
/*
400 - An invalid selection field was supplied and data filtering on the selection criteria was not possible i.e. 'invalid_selection_field'. This is accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
401 - The request was not correctly authorised i.e. 'unauthorisedrequest'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
403 - This is used to indicate that the server can be reached and process the request but refuses to take any further action i.e. 'forbidden'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
404 - Either the supplied identifier is unknown in the Service Provider and so the object could not be changed or an invalid UUID has been supplied. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The statement 'Unknown Object' of 'Invalid UUID' should also be presented. The payload structure is defined by the structure imsx_StatusInfo.Type.
429 - The server is receiving too many requests i.e. 'server_busy'. Retry at a later time. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
500 - This code should be used only if there is catastrophic error and there is not a more appropriate code i.e. 'internal_server_error'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
*/
cfSubjects = function () {
    error("Not yet implemented.", 501)
}

bindWebService("/ims/case/v1p0/CFDocuments", cfDocuments);
bindWebService("/ims/case/v1p0/CFAssociations", cfAssociations);
bindWebService("/ims/case/v1p0/CFAssociationGroupings", cfAssociationGroupings);
bindWebService("/ims/case/v1p0/CFConcepts", cfConcepts);
bindWebService("/ims/case/v1p0/CFItems", cfItems);
bindWebService("/ims/case/v1p0/CFItemAssociations", cfItemAssociations);
bindWebService("/ims/case/v1p0/CFItemTypes", cfItemTypes);
bindWebService("/ims/case/v1p0/CFLicenses", cfLicenses);
bindWebService("/ims/case/v1p0/CFPackages", cfPackages);
bindWebService("/ims/case/v1p0/CFRubrics", cfRubrics);
bindWebService("/ims/case/v1p0/CFSubjects", cfSubjects);
