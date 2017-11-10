cfError=function(code,codeMajor,severity,description,codeMinor,codeMinorValue)
{
    error(JSON.stringify({
       "imsx_codeMajor" : codeMajor,
       "imsx_severity" : severity,
       "imsx_description" : description,
       "imsx_codeMinor" : {
           "imsx_codeMinorField" : [
               {
                   "imsx_codeMinorFieldName" : codeMinor,
                   "imsx_codeMinorFieldValue" : codeMinorValue
               }
           ]
       }
   },null,2),code);
}

/*Errors:
400 - An invalid selection field was supplied and data filtering on the selection criteria was not possible i.e. 'invalid_selection_field'. This is accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
401 - The request was not correctly authorised i.e. 'unauthorisedrequest'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
403 - This is used to indicate that the server can be reached and process the request but refuses to take any further action i.e. 'forbidden'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
404 - Either the supplied identifier is unknown in the Service Provider and so the object could not be changed or an invalid UUID has been supplied. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The statement 'Unknown Object' of 'Invalid UUID' should also be presented. The payload structure is defined by the structure imsx_StatusInfo.Type.
429 - The server is receiving too many requests i.e. 'server_busy'. Retry at a later time. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
500 - This code should be used only if there is catastrophic error and there is not a more appropriate code i.e. 'internal_server_error'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
*/
cfDocuments = function(){
    var query = queryParse.call(this);
    var framework = null;
    if (framework == null)
        framework = skyrepoGet.call(this, query);
    var f = new EcFramework();
    f.copyFrom(framework);
    result = {};

	f.context = "http://schema.cassproject.org/0.3/cass2case";
    f = jsonLdExpand(f.toJson());
    var f2 = jsonLdCompact(JSON.stringify(f),"http://schema.cassproject.org/0.3/sampleCase");
    if (f2.subject != null && !EcArray.isArray(f2.subject))f2.subject=[f2.subject];
    return JSON.stringify(f2,null,2);
}
/*Errors:
400 - An invalid selection field was supplied and data filtering on the selection criteria was not possible i.e. 'invalid_selection_field'. This is accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
401 - The request was not correctly authorised i.e. 'unauthorisedrequest'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
403 - This is used to indicate that the server can be reached and process the request but refuses to take any further action i.e. 'forbidden'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
404 - Either the supplied identifier is unknown in the Service Provider and so the object could not be changed or an invalid UUID has been supplied. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The statement 'Unknown Object' of 'Invalid UUID' should also be presented. The payload structure is defined by the structure imsx_StatusInfo.Type.
429 - The server is receiving too many requests i.e. 'server_busy'. Retry at a later time. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
500 - This code should be used only if there is catastrophic error and there is not a more appropriate code i.e. 'internal_server_error'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
*/
cfAssociations = function(){
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
cfAssociationGroupings = function(){}
/*Errors:
400 - An invalid selection field was supplied and data filtering on the selection criteria was not possible i.e. 'invalid_selection_field'. This is accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
401 - The request was not correctly authorised i.e. 'unauthorisedrequest'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
403 - This is used to indicate that the server can be reached and process the request but refuses to take any further action i.e. 'forbidden'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
404 - Either the supplied identifier is unknown in the Service Provider and so the object could not be changed or an invalid UUID has been supplied. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The statement 'Unknown Object' of 'Invalid UUID' should also be presented. The payload structure is defined by the structure imsx_StatusInfo.Type.
429 - The server is receiving too many requests i.e. 'server_busy'. Retry at a later time. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
500 - This code should be used only if there is catastrophic error and there is not a more appropriate code i.e. 'internal_server_error'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
*/
cfConcepts = function(){}
/*
400 - An invalid selection field was supplied and data filtering on the selection criteria was not possible i.e. 'invalid_selection_field'. This is accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
401 - The request was not correctly authorised i.e. 'unauthorisedrequest'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
403 - This is used to indicate that the server can be reached and process the request but refuses to take any further action i.e. 'forbidden'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
404 - Either the supplied identifier is unknown in the Service Provider and so the object could not be changed or an invalid UUID has been supplied. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The statement 'Unknown Object' of 'Invalid UUID' should also be presented. The payload structure is defined by the structure imsx_StatusInfo.Type.
429 - The server is receiving too many requests i.e. 'server_busy'. Retry at a later time. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
500 - This code should be used only if there is catastrophic error and there is not a more appropriate code i.e. 'internal_server_error'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
*/
cfItems = function(){
    var query = queryParse.call(this);
    var framework = null;
    if (framework == null)
        framework = skyrepoGet.call(this, query);
    var f = new EcCompetency();
    f.copyFrom(framework);
    result = {};

	f.context = "http://schema.cassproject.org/0.3/cass2case";
    f = jsonLdExpand(f.toJson());
    var f2 = jsonLdCompact(JSON.stringify(f),"http://schema.cassproject.org/0.3/sampleCase");
    if (f2.subject != null && !EcArray.isArray(f2.subject))f2.subject=[f2.subject];
    if (f2.title != null)
    	f2.fullStatment = f2.title;
    delete f2.title;
    if (f2.description != null)
    	f2.notes = f2.description;
    delete f2.description;
    f2.CFDocumentURI = {};
    var parent = JSON.parse(skyRepoSearch({q:"competency:\""+f2.uri+"\" OR competency:\""+EcCrypto.md5(f2.uri)+"\""}));
    if (parent.length == 0)
    	cfError(400,'400','failure/error','Could not find CFDocument for this CFItem.','1337');
    t = parent[0];
    parent[0] = new EcFramework();
    parent[0].copyFrom(t);
    f2.CFDocumentURI.uri = parent[0].id;
    f2.CFDocumentURI.title = parent[0].name;
    f2.CFDocumentURI.identifier = parent[0]["schema:identifier"];
    if (f2.CFDocumentURI.identifier == null)
    	f2.CFDocumentURI.identifier = parent[0].getGuid();
    return JSON.stringify(f2,null,2);
}
/*
400 - An invalid selection field was supplied and data filtering on the selection criteria was not possible i.e. 'invalid_selection_field'. This is accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
401 - The request was not correctly authorised i.e. 'unauthorisedrequest'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
403 - This is used to indicate that the server can be reached and process the request but refuses to take any further action i.e. 'forbidden'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
404 - Either the supplied identifier is unknown in the Service Provider and so the object could not be changed or an invalid UUID has been supplied. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The statement 'Unknown Object' of 'Invalid UUID' should also be presented. The payload structure is defined by the structure imsx_StatusInfo.Type.
429 - The server is receiving too many requests i.e. 'server_busy'. Retry at a later time. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
500 - This code should be used only if there is catastrophic error and there is not a more appropriate code i.e. 'internal_server_error'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
*/
cfItemAssociations = function(){
    var query = queryParse.call(this);
    var framework = null;
    if (framework == null)
        framework = skyrepoGet.call(this, query);
    var f = new EcAlignment();
    f.copyFrom(framework);
    result = {};
	f.relationType = {"isEquivalentTo":"exactMatchOf","narrows":"isChildOf"}[f.relationType];

	f.context = "http://schema.cassproject.org/0.3/cass2case";
    f = jsonLdExpand(f.toJson());
//    f = jsonLdCompact(JSON.stringify(f),"http://schema.cassproject.org/0.3/cass2case");
    var f2 = jsonLdCompact(JSON.stringify(f),"http://schema.cassproject.org/0.3/sampleCase");
    var destNode = skyrepoGet({id:EcCrypto.md5(f2.destinationNodeURI.uri)});
    var t = destNode;
    destNode = new EcCompetency();
    destNode.copyFrom(t);
    var sourceNode = skyrepoGet({id:EcCrypto.md5(f2.originNodeURI.uri)});
    t = sourceNode;
    sourceNode = new EcCompetency();
    sourceNode.copyFrom(t);
    f2.destinationNodeURI.title = destNode.name;
    f2.destinationNodeURI.identifier = destNode["schema:identifier"];
    if (f2.destinationNodeURI.identifier == null)
    	f2.destinationNodeURI.identifier = destNode.getGuid();
    f2.originNodeURI.title = sourceNode.name;
    f2.originNodeURI.identifier = sourceNode["schema:identifier"];
    if (f2.originNodeURI.identifier == null)
    	f2.originNodeURI.identifier = sourceNode.getGuid();
    f2.CFDocumentURI = {};
    var parent = JSON.parse(skyRepoSearch({q:"relation:\""+f2.uri+"\" OR relation:\""+EcCrypto.md5(f2.uri)+"\""}));
    if (parent.length == 0)
    	cfError(400,'400','failure/error','Could not find CFDocument for this CFAssociation.','1337');
    t = parent[0];
    parent[0] = new EcFramework();
    parent[0].copyFrom(t);
    f2.CFDocumentURI.uri = parent[0].id;
    f2.CFDocumentURI.title = parent[0].name;
    f2.CFDocumentURI.identifier = parent[0]["schema:identifier"];
    if (f2.CFDocumentURI.identifier == null)
    	f2.CFDocumentURI.identifier = parent[0].getGuid();
    return JSON.stringify(f2,null,2);
}
/*
400 - An invalid selection field was supplied and data filtering on the selection criteria was not possible i.e. 'invalid_selection_field'. This is accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
401 - The request was not correctly authorised i.e. 'unauthorisedrequest'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
403 - This is used to indicate that the server can be reached and process the request but refuses to take any further action i.e. 'forbidden'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
404 - Either the supplied identifier is unknown in the Service Provider and so the object could not be changed or an invalid UUID has been supplied. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The statement 'Unknown Object' of 'Invalid UUID' should also be presented. The payload structure is defined by the structure imsx_StatusInfo.Type.
429 - The server is receiving too many requests i.e. 'server_busy'. Retry at a later time. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
500 - This code should be used only if there is catastrophic error and there is not a more appropriate code i.e. 'internal_server_error'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
*/
cfItemTypes = function(){}
/*
400 - An invalid selection field was supplied and data filtering on the selection criteria was not possible i.e. 'invalid_selection_field'. This is accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
401 - The request was not correctly authorised i.e. 'unauthorisedrequest'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
403 - This is used to indicate that the server can be reached and process the request but refuses to take any further action i.e. 'forbidden'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
404 - Either the supplied identifier is unknown in the Service Provider and so the object could not be changed or an invalid UUID has been supplied. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The statement 'Unknown Object' of 'Invalid UUID' should also be presented. The payload structure is defined by the structure imsx_StatusInfo.Type.
429 - The server is receiving too many requests i.e. 'server_busy'. Retry at a later time. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
500 - This code should be used only if there is catastrophic error and there is not a more appropriate code i.e. 'internal_server_error'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
*/
cfLicenses = function(){}
/*
400 - An invalid selection field was supplied and data filtering on the selection criteria was not possible i.e. 'invalid_selection_field'. This is accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
401 - The request was not correctly authorised i.e. 'unauthorisedrequest'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
403 - This is used to indicate that the server can be reached and process the request but refuses to take any further action i.e. 'forbidden'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
404 - Either the supplied identifier is unknown in the Service Provider and so the object could not be changed or an invalid UUID has been supplied. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The statement 'Unknown Object' of 'Invalid UUID' should also be presented. The payload structure is defined by the structure imsx_StatusInfo.Type.
429 - The server is receiving too many requests i.e. 'server_busy'. Retry at a later time. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
500 - This code should be used only if there is catastrophic error and there is not a more appropriate code i.e. 'internal_server_error'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
*/
cfPackages = function(){}
/*
400 - An invalid selection field was supplied and data filtering on the selection criteria was not possible i.e. 'invalid_selection_field'. This is accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
401 - The request was not correctly authorised i.e. 'unauthorisedrequest'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
403 - This is used to indicate that the server can be reached and process the request but refuses to take any further action i.e. 'forbidden'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
404 - Either the supplied identifier is unknown in the Service Provider and so the object could not be changed or an invalid UUID has been supplied. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The statement 'Unknown Object' of 'Invalid UUID' should also be presented. The payload structure is defined by the structure imsx_StatusInfo.Type.
429 - The server is receiving too many requests i.e. 'server_busy'. Retry at a later time. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
500 - This code should be used only if there is catastrophic error and there is not a more appropriate code i.e. 'internal_server_error'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
*/
cfRubrics = function(){}
/*
400 - An invalid selection field was supplied and data filtering on the selection criteria was not possible i.e. 'invalid_selection_field'. This is accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
401 - The request was not correctly authorised i.e. 'unauthorisedrequest'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
403 - This is used to indicate that the server can be reached and process the request but refuses to take any further action i.e. 'forbidden'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
404 - Either the supplied identifier is unknown in the Service Provider and so the object could not be changed or an invalid UUID has been supplied. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The statement 'Unknown Object' of 'Invalid UUID' should also be presented. The payload structure is defined by the structure imsx_StatusInfo.Type.
429 - The server is receiving too many requests i.e. 'server_busy'. Retry at a later time. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
500 - This code should be used only if there is catastrophic error and there is not a more appropriate code i.e. 'internal_server_error'. This would be accompanied by the 'codeMajor/severity' values of 'failure/error'. The payload structure is defined by the structure imsx_StatusInfo.Type.
*/
cfSubjects = function(){}

bindWebService("/ims/case/v1p0/CFDocuments",cfDocuments);
bindWebService("/ims/case/v1p0/CFAssociations",cfAssociations);
bindWebService("/ims/case/v1p0/CFAssociationGroupings",cfAssociationGroupings);
bindWebService("/ims/case/v1p0/CFConcepts",cfConcepts);
bindWebService("/ims/case/v1p0/CFItems",cfItems);
bindWebService("/ims/case/v1p0/CFItemAssociations",cfItemAssociations);
bindWebService("/ims/case/v1p0/CFItemTypes",cfItemTypes);
bindWebService("/ims/case/v1p0/CFLicenses",cfLicenses);
bindWebService("/ims/case/v1p0/CFPackages",cfPackages);
bindWebService("/ims/case/v1p0/CFRubrics",cfRubrics);
bindWebService("/ims/case/v1p0/CFSubjects",cfSubjects);
