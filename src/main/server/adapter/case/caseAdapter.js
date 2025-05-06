let loopback = require('../../shims/cassproject.js');

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

cfGetFramework = async function (f) {
    var query = queryParse.call(this);
    if (f == null || f === undefined || !EcObject.isObject(f)) {
        if (f == null)
            f = await skyrepoGet.call(this, query);
        if (f == null || f["@type"] == null || !f["@type"].contains("ramework"))
            f = null;
        if (f == null && this.params.id != null)
            f = await loopback.frameworkGet(decodeURIComponent(this.params.id));
        if (f == null)
            f = await loopback.frameworkGet(query.id);
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
    if (f == null)
        cfError(404,"failure","error","Framework not found.","uuid","unknownobject");
    var result = new EcFramework();
    result.copyFrom(f);
    return result;
};
var cfGetContext = function () {
    if (this.cfContext == null)
        this.cfContext = JSON.stringify(httpGet("https://schema.cassproject.org/imscasev1p0_context_v1p0.jsonld"));
    return this.cfContext;
}
cfGetCompetency = async function (c) {
    var cache = JSON.stringify(c)
    if (this[cache] != null)
        return this[cache];
    this[cache] = null;
    var query = queryParse.call(this);
    var url = null;
    if (!EcObject.isObject(c)) {
        url = c;
        c = null;
    }
    if (c == null || c === undefined) {
        var competency = null;
        if (competency == null)
            competency = await skyrepoGet.call(this, query);
        if (competency == null || competency["@type"] == null || !competency["@type"].contains("ompetency"))
            competency = null;
        if (competency == null && url != null)
            competency = await loopback.competencyGet(url);
        if (competency == null && url != null)
            competency = await loopback.competencyGet(global.repo.selectedServer + "data/" + EcCrypto.md5(url));
        if (competency == null) {
            var result = null;
            EcCompetency.search(repo, "@id:" + query.id, function (success) {
                result = success;
            }, console.log);
            if (result && result.length > 0) {
                competency = new EcCompetency();
                competency.copyFrom(result[0]);
            }
        }
        if (competency == null) {
            cfError(404,"failure","error","Competency not found.","uuid","unknownobject");
        }
        var c = new EcCompetency();
        c.copyFrom(competency);
    }
    this[cache] = c;
    return c;
};
cfGetAlignment = async function (c) {
    var query = queryParse.call(this);
    var url = null;
    if (!EcObject.isObject(c)) {
        url = c;
        c = null;
    }
    if (c == null || c === undefined) {
        var competency = null;
        if (competency == null)
            competency = await skyrepoGet.call(this, query);
        if (competency == null && url != null)
            competency = await loopback.alignmentGet(url);
        if (competency == null && url != null)
            competency = await loopback.alignmentGet(global.repo.selectedServer + "data/" + EcCrypto.md5(url));
        if (competency == null)
            cfError(404,"failure","error","Alignment not found.","uuid","unknownobject");
        c = new EcAlignment();
        c.copyFrom(competency);
    }
    return c;
};
cfClean = function (o) {
    o = JSON.parse(JSON.stringify(o));
    for (var key in o) {
        if (key.contains("/"))
            delete o[key];
        if (key.contains("cass:")) {
            delete o[key];
        }
        if (key.contains("case:")) {
            o[key.replace("case:", "")] = o[key];
            delete o[key];
        }
    }

    var ordered = {};
    Object.keys(o).sort().forEach(function (key) { // NOSONAR - Programmatic sort is necessary
        ordered[key] = o[key];
        delete o[key];
    });
    Object.keys(ordered).forEach(function (key) {
        o[key] = ordered[key];
    });
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
cfDocuments = async function (f, terms) {
    f = await cfGetFramework.call(this, f);
    if (f == null) {
        var aggResults = [];
        var me = this;
        let frameworks = loopback.frameworkSearch(repo, "*",{size: 5000});
        if (frameworks == null)
            error("Could not reach repository", 500);
        for (var i = 0;i < frameworks.length;i++) {
            var fw = await cfDocuments.call(me,frameworks[i], terms);
            if (fw != null)
            aggResults.push(JSON.parse(fw));
        }
        return JSON.stringify(aggResults, null, 2);
    }
    var name = f.getName();
    if (f.id == null) return null;
    var guid = f.getGuid();
    if (guid.startsWith("ce-"))
        guid = guid.substring(3);
    if (f["schema:identifier"] == null)
        f["schema:identifier"] = guid;
    for (let each in f) {
        if (terms[each]) {
            f[terms[each]] = f[each];
            delete f[each];
        }
        if (each === "type" || each === "@type") {
            f[each] = "case:CFDocument";
        }
    }
    let f2 = cfClean(f);
    f2["@context"] = "http://purl.imsglobal.org/spec/case/v1p0/context/imscasev1p0_context_v1p0.jsonld";
    f2.subjectURI = [];
    if (f2.subject != null && !EcArray.isArray(f2.subject)) f2.subject = [f2.subject];
    f2.uri = global.repo.selectedServer + "ims/case/v1p0/CFDocuments/" + guid;
    f2.CFPackageURI = {
        title: name,
        identifier: guid,
        uri: global.repo.selectedServer + "ims/case/v1p0/CFPackages/" + guid
    };
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
cfAssociations = async function () {
    return await cfItemAssociations.call(this);
}
/*Errors:
400 - An invalid selection field was supplied and data filtering on the selection criteria was not possible i.e. 'invalid_selection_field'. This is accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
401 - The request was not correctly authorised i.e. 'unauthorisedrequest'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
403 - This is used to indicate that the server can be reached and process the request but refuses to take any further action i.e. 'forbidden'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
404 - Either the supplied identifier is unknown in the Service Provider and so the object could not be changed or an invalid UUID has been supplied. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The statement 'Unknown Object' of 'Invalid UUID' should also be presented. The payload structure is defined by the structure imsx_StatusInfo.Type.
429 - The server is receiving too many requests i.e. 'server_busy'. Retry at a later time. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
500 - This code should be used only if there is catastrophic error and there is not a more appropriate code i.e. 'internal_server_error'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
*/
cfAssociationGroupings = async function () {
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
cfConcepts = async function () {
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
cfItems = async function (f, fw, terms) {
    var query = queryParse.call(this);
    f = await cfGetCompetency.call(this, f);
    result = {};
    var shortId = f.shortId();
    var guid = f.getGuid();
    if (guid.startsWith("ce-"))
        guid = guid.substring(3);
    if (f["schema:identifier"] == null)
        f["schema:identifier"] = guid;
    if (f.toJson != null)
        f = f.toJson();
    try {
        f = JSON.parse(f);
    } catch(e) {
        global.auditLogger.report(global.auditLogger.LogCategory.ADAPTER, global.auditLogger.Severity.ERROR, "CaseCfItemsParseError", e);
    }
    for (let each in f) {
        if (terms[each]) {
            f[terms[each]] = f[each];
            delete f[each];
        }
        if (each === "type" || each === "@type") {
            f[each] = "case:CFItem";
        }
    }
    let f2 = cfClean(f);
    f2["@context"] = "http://purl.imsglobal.org/spec/case/v1p0/context/imscasev1p0_context_v1p0.jsonld";
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
    f2.uri = global.repo.selectedServer + "ims/case/v1p0/CFItems/" + guid;
    f2.CFDocumentURI = {};
    if (fw == null) {
        var parent = skyrepoSearch.call(this,"competency:\"" + f2.uri + "\" OR competency:\"" + shortId + "\" OR competency:\"" + guid + "\" OR competency:\"" + EcCrypto.md5(f2.uri) + "\"");
        if (parent.length == 0)
            cfError(400, '400', 'failure/error', 'Could not find CFDocument for this CFItem.', '1337');
        t = parent[0];
        parent[0] = new EcFramework();
        parent[0].copyFrom(t);
    }
    else
        parent = [fw];
    f2.CFDocumentURI.uri = JSON.parse(await cfDocuments.call(this, parent[0], terms)).uri;
    f2.CFDocumentURI.title = parent[0].name;
    f2.CFDocumentURI.identifier = JSON.parse(await cfDocuments.call(this, parent[0], terms)).identifier;
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
cfItemAssociations = async function (f, fw, terms) {
    var query = queryParse.call(this);
    f = await cfGetAlignment.call(this, f);
    result = {};
    var timestamp = f.getTimestamp();
    var guid = f.getGuid();
    var shortId = f.shortId();
    for (let each in f) {
        if (terms[each]) {
            f[terms[each]] = f[each];
            delete f[each];
        }
        if (each === "type" || each === "@type") {
            f[each] = "case:CFAssociation";
        }
    }
    let f2 = f;
    f2.uri = global.repo.selectedServer + "ims/case/v1p0/CFAssociations/" + guid;
    if (fw == null) {
        var parent = skyrepoSearch("relation:\"" + f2.uri + "\" OR relation:\"" + shortId + "\" OR relation:\"" + guid + "\" OR relation:\"" + EcCrypto.md5(f2.uri) + "\"");
        if (parent.length == 0)
            cfError(400, '400', 'failure/error', 'Could not find CFDocument for this CFAssociation.', '1337');
        t = parent[0];
        fw = new EcFramework();
        fw.copyFrom(t);
    }
    else
        parent = [fw];
    f2["@context"] = "http://purl.imsglobal.org/spec/case/v1p0/context/imscasev1p0_context_v1p0.jsonld";
    f2.associationType = {"isEquivalentTo": "exactMatchOf", "narrows": "isChildOf"}[f2["case:relationType"]];
    delete f2["case:relationType"];
    if (f2["case:destinationNodeURI"] == null) return null;
    if (f2["case:originNodeURI"] == null) return null;
    if (f2["case:destinationNodeURI"] == fw.id)
        return null;
    var destNode = await cfGetCompetency.call(this, f2["case:destinationNodeURI"]);
    var sourceNode = await cfGetCompetency.call(this, f2["case:originNodeURI"]);
    if (destNode == null) return null;
    if (sourceNode == null) return null;
    delete f2["case:destinationNodeURI"];
    delete f2["case:originNodeURI"];
    f2.destinationNodeURI = {};
    f2.destinationNodeURI.title = destNode.name;
    f2.destinationNodeURI.uri = JSON.parse(await cfItems.call(this, destNode, fw, terms)).uri;
    f2.destinationNodeURI.identifier = JSON.parse(await cfItems.call(this, destNode, fw, terms)).identifier;
    f2.originNodeURI = {};
    f2.originNodeURI.title = sourceNode.name;
    f2.originNodeURI.uri = JSON.parse(await cfItems.call(this, sourceNode, fw, terms)).uri;
    f2.originNodeURI.identifier = JSON.parse(await cfItems.call(this, sourceNode, fw, terms)).identifier;
    f2.CFDocumentURI = {};
    f2.CFDocumentURI.uri = JSON.parse(await cfDocuments.call(this, parent[0], terms)).uri;
    f2.CFDocumentURI.title = parent[0].name;
    f2.CFDocumentURI.identifier = JSON.parse(await cfDocuments.call(this, parent[0], terms)).identifier;
    f2.lastChangeDateTime = new Date(timestamp).toISOString();
    f2.identifier = guid;
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
cfItemTypes = async function () {
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
cfLicenses = async function () {
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
cfPackages = async function (f) {
    if (repo == null)
        repo = new EcRepository();
    repo.selectedServer = global.repo.selectedServer;

    EcRepository.cache = {};
    var result = {};
    f = await cfGetFramework.call(this, f);
    var toPrecache = [];
    if (f.competency) {
        toPrecache = toPrecache.concat(f.competency);
    }
    if (f.relation) {
        toPrecache = toPrecache.concat(f.relation);
    }
    repo.precache(toPrecache, function (results) {});
    const terms = JSON.parse(JSON.stringify((await httpGet("https://schema.cassproject.org/0.4/jsonld1.1/cass2caseTerms")),true));

    result["@context"] = "http://purl.imsglobal.org/spec/case/v1p0/context/imscasev1p0_context_v1p0.jsonld";
    result.CFDocument = JSON.parse(await cfDocuments.call(this, f, terms));
    delete result.CFDocument["@context"];
    result.CFItems = [];
    if (f.competency != null)
        for (var i = 0; i < f.competency.length; i++) {
            var c = await loopback.competencyGet(f.competency[i]);
            if (c != null)
                c = JSON.parse(await cfItems.call(this, c, f, terms));
            if (c != null) {
                delete c["@context"];
                result.CFItems.push(c);
            }
        }
    result.CFAssociations = [];
    if (f.relation != null)
        for (var i = 0; i < f.relation.length; i++) {
            var a = await loopback.alignmentGet(f.relation[i]);
            if (a != null)
                a = JSON.parse(await cfItemAssociations.call(this, a, f, terms));
            if (a != null) {
                delete a["@context"];
                result.CFAssociations.push(a);
            }
        }
    result.CFDefinitions = {CFConcepts: [], CFSubject: [], CFLicenses: [], CFItemTypes: [], CFAssociationGroupings: []};
    delete result["@context"];
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
cfRubrics = async function () {
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
cfSubjects = async function () {
    error("Not yet implemented.", 501)
}

if (!global.disabledAdapters['case']) {
    bindWebService("/ims/case/v1p0/CFDocuments", cfDocuments);
    bindWebService("/ims/case/v1p0/CFAssociations", cfAssociations);
    bindWebService("/ims/case/v1p0/CFAssociationGroupings", cfAssociationGroupings);
    bindWebService("/ims/case/v1p0/CFConcepts", cfConcepts);
    bindWebService("/ims/case/v1p0/CFItems", cfItems);
    bindWebService("/ims/case/v1p0/CFItemAssociations", cfItemAssociations);
    bindWebService("/ims/case/v1p0/CFItemTypes", cfItemTypes);
    bindWebService("/ims/case/v1p0/CFLicenses", cfLicenses);
    bindWebService("/ims/case/v1p0/CFPackages/*", cfPackages);
    bindWebService("/ims/case/v1p0/CFRubrics", cfRubrics);
    bindWebService("/ims/case/v1p0/CFSubjects", cfSubjects);
}
