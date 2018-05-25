var elasticEndpoint = "http://localhost:9200/";
var owner = function() {
    return "@owner";
};
var context = function() {
    return "@context";
};
var type = function() {
    return "@type";
};
var reader = function() {
    return "@reader";
};
var id = function() {
    return "@id";
};
var signature = function() {
    return "@signature";
};
var getTypeFromObject = function(o) {
    var type = (o)["type"];
    var context = (o)["context"];
    if (type == null) 
        return null;
    if (type.indexOf("http") != -1) 
        return type;
    if (context == null) 
        return type;
    if (context.endsWith("/")) 
        return context + type;
     else 
        return context + "/" + type;
};
/**
 *  Validate the signature sheet. Blow up if it is incorrect.
 * 
 *  @return
 */
var signatureSheet = function(me) {
    var signatureSheet = null;
    signatureSheet = (me)["signatureSheet"];
    if (signatureSheet != null) 
        return signatureSheet;
    signatureSheet = new Array();
    var fromDatastream = fileFromDatastream("signatureSheet");
    var stringFromDatastream = fileToString(fromDatastream);
    if (stringFromDatastream != null) 
        try {
            signatureSheet = signatureSheet.concat(JSON.parse(stringFromDatastream));
        }catch (ex) {}
    var headers = headers();
    var camelcaseSignatureSheet = (headers)["signatureSheet"];
    var lowercaseSignatureSheet = (headers)["signaturesheet"];
    if (camelcaseSignatureSheet != null) 
        signatureSheet = signatureSheet.concat(JSON.parse(camelcaseSignatureSheet));
    if (lowercaseSignatureSheet != null) 
        signatureSheet = signatureSheet.concat(JSON.parse(lowercaseSignatureSheet));
    for (var i = 0; i < signatureSheet.length; i++) {
        var signature = new EbacSignature();
        signature.copyFrom(signatureSheet[i]);
        signatureSheet[i] = signature;
        if (signature == null) 
            error("Missing Signature.", 496);
        var type = getTypeFromObject(signature);
        if (type == null) 
            if (type != "http://schema.cassproject.org/kbac/0.2/TimeLimitedSignature") 
                error("Invalid Signature Version.", 422);
        if (signature.expiry == null) 
            error("Missing expiry date.", 422);
        var now = date(null, null, true);
        if (signature.expiry < now) 
            error("A Signature is Expired. My time is " + now + " and the signature expires at " + signature.expiry, 419);
        var signBytes = signature.signature;
        signature.signature = null;
        if (!EcRsaOaep.verify(EcPk.fromPem(signature.owner), signature.toJson(), signBytes)) 
            error("Invalid Signature Detected: " + signature.toJson(), 451);
    }
    (me)["signatureSheet"] = signatureSheet;
    return signatureSheet;
};
var isEncryptedType = function(obj) {
    return obj.isAny(new EbacEncryptedValue().getTypes());
};
var filterResults = function(o) {
    if (EcObject.isObject(o)) {
        var rld = new EcRemoteLinkedData(null, null);
        rld.copyFrom(o);
        if (isEncryptedType(rld)) {
            var signatures = signatureSheet(this);
            for (var i = 0; i < signatures.length; i++) 
                if (rld.hasOwner(EcPk.fromPem(signatures[i].owner))) 
                    continue;
                 else if (rld.hasReader(EcPk.fromPem(signatures[i].owner))) 
                    continue;
                 else 
                    return null;
        }
        var keys = EcObject.keys(o);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            (o)[key] = (filterResults).call(this, (o)[key], null);
        }
        return rld;
    } else if (EcArray.isArray(o)) {
        var ary = o;
        for (var i = 0; i < ary.length; i++) 
            ary[i] = (filterResults).call(this, ary[i], null);
        return ary;
    } else 
        return o;
};
var skyrepoUrlType = function(o) {
    return getTypeFromObject(o);
};
var elasticMapping = function() {
    return null;
};
var elasticSettings = function() {
    return null;
};
var inferTypeFromObj = function(o, atType) {
    if (atType != null) 
        return atType;
    var fullType = skyrepoUrlType(o);
    fullType = fullType.replace("http://", "");
    fullType = fullType.replace("https://", "");
    fullType = fullType.replace("/", ".");
    return fullType;
};
var inferTypeWithoutObj = function(atType) {
    if (atType != null) 
        return atType;
    return "_all";
};
var putUrl = function(o, id, version, type) {
    var urlBase = urlBase();
    var typeFromObj = inferTypeFromObj(o, type);
    var versionPart = null;
    if (version == null || version == "") 
        versionPart = "?refresh=wait_for";
     else 
        versionPart = "?version=" + version + "&version_type=external&refresh=wait_for";
    var url = urlBase;
    url += "/" + typeFromObj.toLowerCase();
    url += "/" + typeFromObj;
    url += "/" + urlEncode(id) + versionPart;
    return url;
};
var getUrl = function(index, id, version, type) {
    var urlBase = urlBase();
    var typeFromObj = inferTypeWithoutObj(type);
    var versionPart = null;
    if (version == null || version == "") 
        versionPart = "";
     else 
        versionPart = "?version=" + version + "&version_type=external";
    var url = urlBase;
    url += "/" + index;
    url += "/" + typeFromObj;
    url += "/" + urlEncode(id) + versionPart;
    return url;
};
var deleteUrl = function(id, version, type) {
    var urlBase = urlBase();
    var typeFromObj = inferTypeWithoutObj(type);
    var url = urlBase;
    url += "/" + typeFromObj.toLowerCase();
    url += "/" + typeFromObj;
    url += "/" + urlEncode(id);
    url += "?refresh=true";
    return url;
};
var skyrepoPutInternalTypeCheck = function(typeChecked, o, type) {
    if (typeChecked) 
        return null;
    return inferTypeFromObj(o, type);
};
var skyrepoPutInternalIndex = function(o, id, version, type) {
    var url = putUrl(o, id, version, type);
    return httpPost(o, url, "application/json", false);
};
var skyrepoPutInternalPermanent = function(o, id, version, type) {
    return null;
};
var skyrepoPutInternal = function(o, id, version, type) {
    skyrepoPutInternalIndex(o, id, version, type);
    skyrepoPutInternalPermanent(o, id, version, type);
};
var skyRepoPutInternal = function(o, id, version, type) {
    skyrepoPutInternal(o, id, version, type);
};
var skyrepoGetIndexInternal = function(index, id, version, type) {
    return JSON.parse(httpGet(getUrl(index, id, version, type)));
};
var skyrepoGetIndex = function(id, version, type) {
    if (type != null && type != "") {
        return skyrepoGetIndexInternal(type.toLowerCase(), id, version, type);
    } else {
        var settings = elasticSettings();
        var keys = EcObject.keys(settings);
        for (var i = 0; i < keys.length; i++) {
            var result = skyrepoGetIndexInternal(keys[i], id, version, type);
            if (((result)["found"]) == true) {
                return result;
            }
        }
    }
    return null;
};
var skyrepoGetPermanent = function(id, version, type) {
    return null;
};
var skyrepoGetInternal = function(id, version, type) {
    if (version == null) 
        version = (skyrepoGetIndex(id, version, type))["_version"];
    var permanent = skyrepoGetPermanent(id, version, type);
    if (permanent != null) 
        return permanent;
    console.log("Failed to find " + id + "/" + version + "/" + type + " -- getting degraded form from search index.");
    return (skyrepoGetIndex(id, version, type))["_source"];
};
var skyrepoGet = function(id, version, type) {
    var result = skyrepoGetInternal(id, version, type);
    var filtered = (filterResults).call(this, result, null);
    if (EcObject.keys(filtered).length == 0) 
        return null;
    return filtered;
};
var skyrepoPut = function(o, id, version, type) {
    if (o == null) 
        return;
    validateSignatures(id, version, type, "Only an owner of an object may change it.", this);
    skyrepoPutInternal(o, id, version, type);
};
var validateSignatures = function(id, version, type, errorMessage, me) {
    var oldObj = new EcRemoteLinkedData(null, null);
    oldObj.copyFrom((skyrepoGet).call(me, id, version, type, null));
    if (oldObj.owner != null || oldObj.owner.length > 0) {
        var signatures = signatureSheet(me);
        var success = false;
        for (var i = 0; i < signatures.length; i++) {
            if (oldObj.hasOwner(EcPk.fromPem(signatures[i].owner))) {
                success = true;
                break;
            }
        }
        if (!success) 
            error(errorMessage, 401);
    }
};
var skyrepoDeleteInternalIndex = function(id, version, type) {
    var url = deleteUrl(id, version, type);
    return httpDelete(url);
};
var skyrepoDeleteInternalPermanent = function(id, version, type) {
    return null;
};
var skyrepoDelete = function(id, version, type) {
    validateSignatures(id, version, type, "Only an owner of an object may delete it.", this);
    skyrepoDeleteInternalIndex(id, version, type);
    skyrepoDeleteInternalPermanent(id, version, type);
};
var searchObj = function(q, start, size, sort, track_scores, me) {
    var s = new Object();
    if (start != null) 
        (s)["start"] = start;
    if (size != null) 
        (s)["size"] = start;
    if (sort != null) 
        (s)["sort"] = JSON.parse(sort);
    var query = new Object();
    (s)["query"] = query;
    var bool = new Object();
    (query)["bool"] = bool;
    var must = new Object();
    (bool)["must"] = must;
    var a = new Object();
    (must)["a"] = a;
    var query_string = new Object();
    (a)["query_string"] = query_string;
    (query_string)["query"] = q;
    var signatures = signatureSheet(me);
    if (signatures != null && signatures.length > 0) {
        var q2 = "";
        for (var i = 0; i < signatures.length; i++) {
            if (i > 0) 
                q2 += " OR ";
            q2 += signatures[i].owner;
        }
        var should = new Object();
        (bool)["should"] = should;
        var b = new Object();
        (must)["a"] = b;
        var query_string2 = new Object();
        (a)["query_string"] = query_string2;
        (query_string)["query"] = q2;
    }
    var source = new Array();
    source.push("*");
    (s)["_source"] = source;
    return s;
};
var searchUrl = function(urlRemainder) {
    var url = urlBase();
    if (urlRemainder != null) 
        url += urlRemainder;
    url += "/_search";
    return url;
};
var skyrepoSearch = function(q, urlRemainder, start, size, sort, track_scores) {
    var resultString = httpPost(searchObj(q, start, size, sort, track_scores, this), searchUrl(urlRemainder), "application/json", false);
    var results = JSON.parse(resultString);
    if ((results)["error"] != null) {
        var root_cause = ((results)["error"])["root_cause"];
        if (root_cause.length > 0) {
            var reasonObj = root_cause[0];
            var reason = (reasonObj)["reason"];
            if (reason != null) 
                error(reason, (results)["status"]);
        }
    }
    var hits = (results)["hits"];
    hits = (hits)["hits"];
    var searchResults = hits;
    for (var i = 0; i < searchResults.length; i++) {
        var searchResult = searchResults[i];
        var type = inferTypeFromObj((searchResult)["_source"], null);
        var id = (searchResult)["_id"];
        var version = (searchResult)["_version"];
        searchResults[i] = skyrepoGetPermanent(id, version, type);
    }
    return (filterResults).call(this, searchResults, null);
};
var queryParse = function(urlRemainder) {
    if (urlRemainder == null) 
        urlRemainder = this.parameters.urlRemainder;
    var split = urlRemainder.split("/");
    var result = new Object();
    if (split.length >= 2) 
        (result)["id"] = split[1];
    if (split.length >= 3) 
        (result)["type"] = split[2];
    if (split.length == 4) 
        (result)["version"] = split[3];
    return result;
};
var tryFormatOutput = function(o, expand) {
    var headers = headers();
    var accept = (headers)["Accept"];
    if (accept == null) 
        accept = (headers)["accept"];
    if (accept == null) 
        if (expand == true) 
            return jsonLdExpand(o);
         else 
            return o;
    if (accept == "text/n4" || accept == "application/rdf+n4") 
        return jsonLdToNQuads(o);
    if (accept == "application/rdf+json") 
        return jsonLdToRdfJson(o);
    if (accept == "application/rdf+xml") 
        return jsonLdToRdfXml(o);
    if (accept == "application/x-turtle" || accept == "text/turtle") 
        return jsonLdToTurtle(o);
    return o;
};
var endpointData = function() {
    var q = this.parameters.q;
    var urlRemainder = this.parameters.urlRemainder;
    var start = this.parameters.start;
    var size = this.parameters.size;
    var sort = this.parameters.sort;
    var track_scores = this.parameters.track_scores;
    var searchParams = fileFromDatastream("searchParams");
    if (searchParams != null) {
        if ((searchParams)["q"] != null) 
            q = (searchParams)["q"];
        if ((searchParams)["start"] != null) 
            start = (searchParams)["start"];
        if ((searchParams)["size"] != null) 
            size = (searchParams)["size"];
        if ((searchParams)["sort"] != null) 
            sort = (searchParams)["sort"];
        if ((searchParams)["track_scores"] != null) 
            track_scores = (searchParams)["track_scores"];
    }
    if (size == null) 
        size = "50";
    if (start == null) 
        start = "0";
    if (q != null) 
        return JSON.stringify((skyrepoSearch).call(this, q, urlRemainder, start, size, sort, track_scores));
    var methodType = this.parameters.methodType;
    var parseParams = queryParse(urlRemainder);
    var id = (parseParams)["id"];
    var type = (parseParams)["type"];
    var version = (parseParams)["version"];
    if (methodType == "DELETE") {
        (skyrepoDelete).call(this, id, version, type);
        afterSave();
        return null;
    } else if (methodType == "POST") {
        var o = JSON.parse(fileToString(fileFromDatastream("data")));
        (skyrepoPut).call(this, o, id, version, type);
        afterSave();
        return null;
    } else if (methodType == "GET") {
        var o = (skyrepoGet).call(this, id, version, type, null);
        var expand = this.parameters.expand != null;
        o = (tryFormatOutput).call(this, o, expand, null);
        return JSON.stringify(o);
    }
    return null;
};
var endpointMultiGet = function() {
    var ary = JSON.parse(fileToString(fileFromDatastream("data")));
    var results = new Array();
    for (var i = 0; i < ary.length; i++) {
        var urlRemainder = ary[i];
        var parseParams = queryParse(urlRemainder);
        var id = (parseParams)["id"];
        var type = (parseParams)["type"];
        var version = (parseParams)["version"];
        try {
            var o = (skyrepoGet).call(this, id, version, type, null);
            var expand = this.parameters.expand != null;
            results.push((tryFormatOutput).call(this, o, expand, null));
        }catch (ex) {}
    }
    return JSON.stringify(results);
};
var skyRepoSearch = function() {
    var q = this.parameters.q;
    var urlRemainder = this.parameters.urlRemainder;
    var start = this.parameters.start;
    var size = this.parameters.size;
    var sort = this.parameters.sort;
    var track_scores = this.parameters.track_scores;
    var searchParams = fileFromDatastream("searchParams");
    if (searchParams != null) {
        if ((searchParams)["q"] != null) 
            q = (searchParams)["q"];
        if ((searchParams)["start"] != null) 
            start = (searchParams)["start"];
        if ((searchParams)["size"] != null) 
            size = (searchParams)["size"];
        if ((searchParams)["sort"] != null) 
            sort = (searchParams)["sort"];
        if ((searchParams)["track_scores"] != null) 
            track_scores = (searchParams)["track_scores"];
    }
    if (size == null) 
        size = "50";
    if (start == null) 
        start = "0";
    if (q == null) 
        q = "*";
    return JSON.stringify((skyrepoSearch).call(this, q, urlRemainder, start, size, sort, track_scores));
};
var endpointSearch = function() {
    return (skyRepoSearch).call(this);
};
var endpointAdmin = function() {
    return JSON.stringify(skyrepoAdminList());
};
var skyrepoAdminPpk = function() {
    if (!fileExists("skyAdmin.pem")) 
        fileSave(EcPpk.fromPem(rsaGenerate()).toPem(), "skyAdmin.pem");
    return fileToString(fileLoad("skyAdmin.pem"));
};
var skyrepoAdminList = function() {
    var array = new Array();
    array.push(skyrepoAdminPpk());
    return array;
};
(function() {
    bindWebService("/data", endpointData);
    bindWebService("/sky/repo/search", skyRepoSearch);
    bindWebService("/sky/repo/multiGet", endpointMultiGet);
    bindWebService("/sky/repo/admin", endpointAdmin);
})();
