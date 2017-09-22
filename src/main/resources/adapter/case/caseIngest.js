var targetUrl = "https://case.georgiastandards.org";

var caseInterface = {
	CFDocuments: function () {
		return httpGet(this.targetUrl + "/ims/case/v1p0/CFDocuments");
	},
	CFDocument: function (sourcedId) {
		return httpGet(this.targetUrl + "/ims/case/v1p0/CFDocuments/" + sourcedId);
	},
	CFPackages: function (sourcedId) {
		return httpGet(debug(this.targetUrl + "/ims/case/v1p0/CFPackages/" + sourcedId));
	},
	CFItems: function (sourcedId) {
		return httpGet(this.targetUrl + "/ims/case/v1p0/CFItems/" + sourcedId);
	},
	CFAssociations: function (sourcedId) {
		return httpGet(this.targetUrl + "/ims/case/v1p0/CFAssociations/" + sourcedId);
	},
	CFItemAssociations: function (sourcedId) {
		return httpGet(this.targetUrl + "/ims/case/v1p0/CFItemAssociations/" + sourcedId);
	},
	CFAssociationGroupings: function (sourcedId) {
		return httpGet(this.targetUrl + "/ims/case/v1p0/CFAssociationGroupings/" + sourcedId);
	},
	CFConcepts: function (sourcedId) {
		return httpGet(this.targetUrl + "/ims/case/v1p0/CFConcepts/" + sourcedId);
	},
	CFItemTypes: function (sourcedId) {
		return httpGet(this.targetUrl + "/ims/case/v1p0/CFItemTypes/" + sourcedId);
	},
	CFLicenses: function (sourcedId) {
		return httpGet(this.targetUrl + "/ims/case/v1p0/CFLicenses/" + sourcedId);
	},
	CFSubjects: function (sourcedId) {
		return httpGet(this.targetUrl + "/ims/case/v1p0/CFSubjects/" + sourcedId);
	},
	CFRubrics: function (sourcedId) {
		return httpGet(this.targetUrl + "/ims/case/v1p0/CFRubrics/" + sourcedId);
	}
}

ingestCase = function () {
	this.targetUrl = targetUrl;
	var documents = caseInterface.CFDocuments.call(this);
	for (var i = 0;i < 1;i++)
	{
	    var document = documents.CFDocuments[i];
	    debug(document);
	    var f = new EcFramework();
        f.assignId(document.identifier);
        f.name =
		dx = httpGet(document.CFPackageURI.uri);
		dx = f;
	}
	return JSON.stringify(dx,null,2);
}
bindWebService("/ims/case/ingest", ingestCase);
