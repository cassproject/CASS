var skyrepoDebug = false;
var elasticEndpoint = "http://localhost:9200";
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
    var type = (o)["@type"];
    var context = (o)["@context"];
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
var signatureSheet = function() {
    var sigSheet = null;
    sigSheet = (this)["signatureSheet"];
    if (sigSheet != null) 
        return sigSheet;
    sigSheet = new Array();
    var fromDatastream = (fileFromDatastream).call(this, "signatureSheet", null);
    var stringFromDatastream = fileToString(fromDatastream);
    if (stringFromDatastream != null) 
        try {
            sigSheet = sigSheet.concat(JSON.parse(stringFromDatastream));
        }catch (ex) {}
    var hdrs = (headers).call(this);
    var camelcaseSignatureSheet = (hdrs)["signatureSheet"];
    var lowercaseSignatureSheet = (hdrs)["signaturesheet"];
    if (camelcaseSignatureSheet != null) 
        sigSheet = sigSheet.concat(JSON.parse(camelcaseSignatureSheet));
    if (lowercaseSignatureSheet != null) 
        sigSheet = sigSheet.concat(JSON.parse(lowercaseSignatureSheet));
    for (var i = 0; i < sigSheet.length; i++) {
        var signature = new EbacSignature();
        signature.copyFrom(sigSheet[i]);
        if (signature == null) 
            error("Missing Signature.", 496);
        if (getTypeFromObject(sigSheet[i]) != "http://schema.cassproject.org/kbac/0.2/TimeLimitedSignature") 
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
        sigSheet[i] = signature;
    }
    (this)["signatureSheet"] = sigSheet;
    return sigSheet;
};
var isEncryptedType = function(obj) {
    return obj.isAny(new EbacEncryptedValue().getTypes());
};
var filterResults = function(o) {
    if (o == null) 
        return o;
    if (EcArray.isArray(o)) {
        var ary = o;
        for (var i = 0; i < ary.length; i++) {
            if (ary[i] == null) 
                continue;
            var result = (filterResults).call(this, ary[i], null);
            if (result == null) {
                ary.splice(i, 1);
                i--;
            } else 
                ary[i] = result;
        }
        return ary;
    } else if (EcObject.isObject(o)) {
        var rld = new EcRemoteLinkedData(null, null);
        rld.copyFrom(o);
        if (isEncryptedType(rld)) {
            var signatures = (signatureSheet).call(this);
            var foundSignature = false;
            for (var i = 0; i < signatures.length; i++) 
                if (rld.toJson().indexOf(signatures[i].owner) != -1) {
                    foundSignature = true;
                    break;
                }
            if (!foundSignature) 
                return null;
        }
        var keys = EcObject.keys(o);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            (rld)[key] = (filterResults).call(this, (o)[key], null);
        }
        return rld.atIfy();
    } else 
        return o;
};
var skyrepoUrlType = function(o) {
    return getTypeFromObject(o);
};
var elasticMapping = function() {
    return httpGet(elasticEndpoint + "/_mapping");
};
var elasticSettings = function() {
    return httpGet(elasticEndpoint + "/_settings");
};
var inferTypeFromObj = function(o, atType) {
    if (atType != null) 
        return atType;
    var fullType = skyrepoUrlType(o);
    fullType = fullType.replace("http://", "");
    fullType = fullType.replace("https://", "");
    fullType = fullType.replace("/", ".");
    fullType = fullType.replace("/", ".");
    fullType = fullType.replace("/", ".");
    return fullType;
};
var inferTypeWithoutObj = function(atType) {
    if (atType != null) 
        return atType;
    return "_all";
};
var putUrl = function(o, id, version, type) {
    var typeFromObj = inferTypeFromObj(o, type);
    var versionPart = null;
    if (version == null || version == "") 
        versionPart = "?refresh=wait_for";
     else 
        versionPart = "?version=" + version + "&version_type=external&refresh=true";
    var url = elasticEndpoint;
    url += "/" + typeFromObj.toLowerCase();
    url += "/" + typeFromObj;
    url += "/" + urlEncode(id) + versionPart;
    if (skyrepoDebug) 
        console.log("Put:" + url);
    return url;
};
var putPermanentUrl = function(o, id, version, type) {
    var typeFromObj = inferTypeFromObj(o, type);
    var versionPart = null;
    if (version == null || version == "") 
        versionPart = "?refresh=true";
     else 
        versionPart = "?version=" + version + "&version_type=external&refresh=true";
    var url = elasticEndpoint;
    url += "/permanent";
    url += "/permanent";
    url += "/" + urlEncode(id) + "." + version + versionPart;
    if (skyrepoDebug) 
        console.log("PutPermanent:" + url);
    return url;
};
var getUrl = function(index, id, version, type) {
    var typeFromObj = inferTypeWithoutObj(type);
    var versionPart = null;
    if (version == null || version == "") 
        versionPart = "";
     else 
        versionPart = "?version=" + version + "&version_type=external";
    var url = elasticEndpoint;
    url += "/" + index;
    if (index == "permanent") 
        url += "/permanent";
     else 
        url += "/" + typeFromObj;
    if (index == "permanent") 
        url += "/" + urlEncode(id) + "." + version;
     else 
        url += "/" + urlEncode(id);
    if (skyrepoDebug) 
        console.log("Get:" + url);
    return url;
};
var deleteUrl = function(id, version, type) {
    var typeFromObj = inferTypeWithoutObj(type);
    var url = elasticEndpoint;
    url += "/" + typeFromObj.toLowerCase();
    url += "/" + typeFromObj;
    url += "/" + urlEncode(id);
    url += "?refresh=true";
    if (skyrepoDebug) 
        console.log("Delete:" + url);
    return url;
};
var skyrepoPutInternalTypeCheck = function(typeChecked, o, type) {
    if (typeChecked) 
        return null;
    return inferTypeFromObj(o, type);
};
var skyrepoPutInternalIndex = function(o, id, version, type) {
    var url = putUrl(o, id, version, type);
    if (skyrepoDebug) 
        console.log(JSON.stringify(o));
    return httpPost(o, url, "application/json", false);
};
var permanentCreated = false;
var skyrepoPutInternalPermanent = function(o, id, version, type) {
    if (permanentCreated != true) {
        var mappings = new Object();
        var permNoIndex = new Object();
        var doc = new Object();
        (mappings)["mappings"] = permNoIndex;
        (permNoIndex)["permanent"] = doc;
        (doc)["enabled"] = false;
        var result = httpPut(mappings, elasticEndpoint + "/permanent", "application/json");
        if (skyrepoDebug) 
            console.log(JSON.stringify(result));
        permanentCreated = true;
    }
    var data = new Object();
    (data)["data"] = JSON.stringify(o);
    var url = putPermanentUrl(o, id, version, type);
    var out = httpPost(data, url, "application/json", false);
    if (skyrepoDebug) 
        console.log(JSON.stringify(out));
    return JSON.stringify(out);
};
var skyrepoPutInternal = function(o, id, version, type) {
    var obj = skyrepoPutInternalIndex(o, id, version, type);
    if (skyrepoDebug) 
        console.log(JSON.stringify(obj));
    version = (obj)["_version"];
    skyrepoPutInternalPermanent(o, id, version, type);
};
var skyRepoPutInternal = function(o, id, version, type) {
    skyrepoPutInternal(o, id, version, type);
};
var skyrepoGetIndexInternal = function(index, id, version, type) {
    if (skyrepoDebug) 
        console.log("Fetching from " + index + " : " + type + " / " + id + " / " + version);
    var result = httpGet(getUrl(index, id, version, type));
    return result;
};
var skyrepoGetIndex = function(id, version, type) {
    if (type != null && type != "") {
        var result = skyrepoGetIndexInternal(type.toLowerCase(), id, version, type);
        return result;
    } else {
        var microSearchUrl = elasticEndpoint + "/_search?version&q=_id:" + id + "";
        var microSearch = httpGet(microSearchUrl);
        if (skyrepoDebug) 
            console.log(microSearchUrl);
        var hitshits = (microSearch)["hits"];
        var hits = (hitshits)["hits"];
        if (hits.length == 0) 
            return null;
        var hit = hits[0];
        return hit;
    }
};
var skyrepoGetPermanent = function(id, version, type) {
    var result = skyrepoGetIndexInternal("permanent", id, version, type);
    return result;
};
var skyrepoGetInternal = function(id, version, type) {
    var versionRetrievalObject = null;
    if (version == null) {
        versionRetrievalObject = (skyrepoGetIndex).call(this, id, version, type, null);
        if (versionRetrievalObject != null) 
            version = (versionRetrievalObject)["_version"];
        if (versionRetrievalObject != null) 
            type = (versionRetrievalObject)["_type"];
    }
    if (version == null) 
        return null;
    var result = skyrepoGetPermanent(id, version, type);
    if (result == null) 
        return null;
    if ((result)["error"] != null) 
        return null;
    if ((result)["found"] == true) 
        return JSON.parse(((result)["_source"])["data"]);
    if (skyrepoDebug) 
        console.log("Failed to find " + type + "/" + id + "/" + version + " -- trying degraded form from search index.");
    if (versionRetrievalObject != null) 
        result = versionRetrievalObject;
     else 
        result = (skyrepoGetIndex).call(this, id, version, type, null);
    if (result == null) 
        return null;
    if ((result)["error"] != null) 
        return null;
    if ((result)["found"] == true || (result)["_source"] != null) 
        return (result)["_source"];
    return null;
};
var skyrepoGet = function(parseParams) {
    if (parseParams == null && EcObject.isObject(this.params.obj)) 
        parseParams = this.params.obj;
    if (parseParams == null) {
        parseParams = new Object();
        (parseParams)["id"] = this.params.id;
        (parseParams)["type"] = this.params.type;
        (parseParams)["version"] = this.params.version;
    }
    if (skyrepoDebug) 
        console.log(JSON.stringify(parseParams));
    if (skyrepoDebug) 
        console.log(JSON.stringify(this.params.obj));
    var id = (parseParams)["id"];
    var type = (parseParams)["type"];
    var version = (parseParams)["version"];
    return (skyrepoGetParsed).call(this, id, version, type, null);
};
var skyrepoGetParsed = function(id, version, type) {
    var result = (skyrepoGetInternal).call(this, id, version, type, null);
    if (result == null) 
        return null;
    var filtered = (filterResults).call(this, result, null);
    if (filtered == null) 
        return null;
    if (EcObject.keys(filtered).length == 0) 
        return null;
    return filtered;
};
var skyrepoPut = function(parseParams) {
    if (parseParams == null && this.params.id != null && this.params.id != "") {
        parseParams = new Object();
        (parseParams)["id"] = this.params.id;
        (parseParams)["type"] = this.params.type;
        (parseParams)["version"] = this.params.version;
        (parseParams)["obj"] = this.params.obj;
    }
    if (skyrepoDebug) 
        console.log("put pp:" + JSON.stringify(parseParams));
    if (skyrepoDebug) 
        console.log("put obj:" + JSON.stringify(this.params.obj));
    if (parseParams == null && EcObject.isObject(this.params.obj)) 
        parseParams = this.params.obj;
    var obj = (parseParams)["obj"];
    if (!EcObject.isObject(obj)) 
        obj = JSON.parse(obj);
    var id = (parseParams)["id"];
    var type = (parseParams)["type"];
    var version = (parseParams)["version"];
    return (skyrepoPutParsed).call(this, obj, id, version, type, null);
};
var skyrepoPutParsed = function(o, id, version, type) {
    if (o == null) 
        return;
    (validateSignatures).call(this, id, version, type, "Only an owner of an object may change it.");
    skyrepoPutInternal(o, id, version, type);
};
var validateSignatures = function(id, version, type, errorMessage) {
    var oldGet = (skyrepoGetParsed).call(this, id, version, type, null);
    if (oldGet == null) 
        return;
    var oldObj = new EcRemoteLinkedData(null, null);
    oldObj.copyFrom(oldGet);
    if (oldObj.owner != null && oldObj.owner.length > 0) {
        var signatures = (signatureSheet).call(this);
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
    (validateSignatures).call(this, id, version, type, "Only an owner of an object may delete it.");
    skyrepoDeleteInternalIndex(id, version, type);
    skyrepoDeleteInternalPermanent(id, version, type);
};
var searchObj = function(q, start, size, sort, track_scores) {
    var s = new Object();
    if (start != null) 
        (s)["from"] = start;
    if (size != null) 
        (s)["size"] = size;
    if (sort != null) 
        (s)["sort"] = JSON.parse(sort);
    (s)["version"] = true;
    var query = new Object();
    (s)["query"] = query;
    var bool = new Object();
    (query)["bool"] = bool;
    var must = new Object();
    (bool)["must"] = must;
    var query_string = new Object();
    (must)["query_string"] = query_string;
    var signatures = (signatureSheet).call(this);
    var concern = false;
    if (q.indexOf("*") != -1 && q.trim() != "*") 
        concern = true;
    if (q.indexOf("@reader") != -1) 
        concern = true;
    (query_string)["query"] = q;
    if (signatures != null && signatures.length > 0) {
        var q2 = "";
        for (var i = 0; i < signatures.length; i++) {
            if (i > 0) 
                q2 += " OR ";
            q2 += "\"" + signatures[i].owner + "\"";
        }
        var should = new Object();
        (bool)["should"] = should;
        var query_string2 = new Object();
        (should)["query_string"] = query_string2;
        (query_string2)["query"] = q2;
    }
    return s;
};
var searchUrl = function(urlRemainder) {
    var url = elasticEndpoint;
    if (urlRemainder != null && urlRemainder != "" && urlRemainder != "/") 
        url += urlRemainder.toLowerCase();
     else 
        url += "/*,-permanent";
    if (!url.endsWith("/")) 
        url += "/";
    url += "_search";
    if (skyrepoDebug) 
        console.log(url);
    return url;
};
var skyrepoSearch = function(q, urlRemainder, start, size, sort, track_scores) {
    var searchParameters = (searchObj).call(this, q, start, size, sort, track_scores);
    if (skyrepoDebug) 
        console.log(JSON.stringify(searchParameters));
    var results = httpPost(searchParameters, searchUrl(urlRemainder), "application/json", false);
    if (skyrepoDebug) 
        console.log(JSON.stringify(results));
    if ((results)["error"] != null) {
        var root_cause = ((results)["error"])["root_cause"];
        if (root_cause.length > 0) {
            var reasonObj = root_cause[0];
            var reason = (reasonObj)["reason"];
            if (reason != null) 
                error(reason, (results)["status"]);
        }
    }
    var hits = ((results)["hits"])["hits"];
    var searchResults = new Array();
    for (var i = 0; i < hits.length; i++) {
        var searchResult = hits[i];
        var type = inferTypeFromObj((searchResult)["_source"], null);
        var id = (searchResult)["_id"];
        var version = (searchResult)["_version"];
        searchResult = (skyrepoGetInternal).call(this, id, version, type, null);
        if (searchResult == null) 
            continue;
        var preLength = JSON.stringify(searchResult).length;
        if (skyrepoDebug) 
            console.log("pre filter length:" + preLength);
        searchResult = (filterResults).call(this, searchResult, null);
        if (searchResult == null) 
            continue;
        if (skyrepoDebug) 
            console.log("post filter length:" + JSON.stringify(searchResult).length);
        if (preLength != JSON.stringify(searchResult).length) {
            var signatures = (signatureSheet).call(this);
            for (var j = 0; j < signatures.length; j++) {
                if (JSON.stringify(searchResult).indexOf(signatures[j].owner) != -1) {
                    if (skyrepoDebug) 
                        console.log("Matched signature:" + signatures[j].owner);
                    searchResults.push(searchResult);
                    break;
                }
            }
        } else 
            searchResults.push(searchResult);
    }
    return searchResults;
};
var queryParse = function(urlRemainder) {
    if (urlRemainder == null && this.params.urlRemainder != null) 
        urlRemainder = this.params.urlRemainder;
    if (urlRemainder == null) 
        error("No resource specified.", 404);
    var split = urlRemainder.split("/");
    var result = new Object();
    if (split.length >= 2) 
        (result)["id"] = split[1];
    if (split.length >= 3) {
        (result)["type"] = split[1];
        (result)["id"] = split[2];
    }
    if (split.length == 4) 
        (result)["version"] = split[3];
    return result;
};
var tryFormatOutput = function(o, expand) {
    var hdrs = (headers).call(this);
    var accept = (hdrs)["Accept"];
    if (accept == null) 
        accept = (hdrs)["accept"];
    if (accept == null) 
        if (expand == true) 
            return JSON.stringify(jsonLdExpand(o));
         else 
            return JSON.stringify(o);
    if (accept == "text/n4" || accept == "application/rdf+n4") 
        return jsonLdToNQuads(o);
    if (accept == "application/rdf+json") 
        return jsonLdToRdfJson(o);
    if (accept == "application/rdf+xml") 
        return jsonLdToRdfXml(o);
    if (accept == "application/x-turtle" || accept == "text/turtle") 
        return jsonLdToTurtle(o);
    return JSON.stringify(o);
};
var endpointData = function() {
    var q = this.params.q;
    var urlRemainder = this.params.urlRemainder;
    var start = 0;
    if (this.params.start != null) 
        start = parseInt(this.params.start);
    var size = 50;
    if (this.params.size != null) 
        size = parseInt(this.params.size);
    var sort = this.params.sort;
    var track_scores = this.params.track_scores;
    var searchParams = (fileFromDatastream).call(this, "searchParams", null);
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
        size = 50;
    if (start == null) 
        start = 0;
    if (q != null) {
        (beforeGet).call(this);
        return JSON.stringify((skyrepoSearch).call(this, q, urlRemainder, start, size, sort, track_scores));
    }
    var methodType = this.params.methodType;
    var parseParams = (queryParse).call(this, urlRemainder, null);
    var id = (parseParams)["id"];
    var type = (parseParams)["type"];
    var version = (parseParams)["version"];
    if (methodType == "DELETE") {
        (skyrepoDelete).call(this, id, version, type);
        (afterSave).call(this);
        return null;
    } else if (methodType == "POST") {
        var o = JSON.parse(fileToString((fileFromDatastream).call(this, "data", null)));
        if (o == null || o == "") {
            (beforeGet).call(this);
            o = (skyrepoGetParsed).call(this, id, version, type, null);
            if (o == null) 
                error("Object not found or you did not supply sufficient permissions to access the object.", 404);
            var expand = this.params.expand != null;
            o = (tryFormatOutput).call(this, o, expand, null);
            return o;
        }
        (skyrepoPutParsed).call(this, o, id, version, type);
        (afterSave).call(this);
        return null;
    } else if (methodType == "GET") {
        (beforeGet).call(this);
        var o = (skyrepoGetParsed).call(this, id, version, type, null);
        if (o == null) 
            error("Object not found or you did not supply sufficient permissions to access the object.", 404);
        var expand = this.params.expand != null;
        o = (tryFormatOutput).call(this, o, expand, null);
        return o;
    }
    return null;
};
var endpointMultiGet = function() {
    var ary = JSON.parse(fileToString((fileFromDatastream).call(this, "data", null)));
    var results = new Array();
    if (ary != null) {
        for (var i = 0; i < ary.length; i++) {
            var urlRemainder = ary[i];
            var parseParams = (queryParse).call(this, urlRemainder, null);
            var id = (parseParams)["id"];
            var type = (parseParams)["type"];
            var version = (parseParams)["version"];
            try {
                var o = (skyrepoGetParsed).call(this, id, version, type, null);
                if (o != null) 
                    results.push(o);
            }catch (ex) {}
        }
    }
    return JSON.stringify(results);
};
var skyRepoSearch = function() {
    var q = this.params.q;
    var urlRemainder = this.params.urlRemainder;
    var start = 0;
    if (this.params.start != null) 
        start = parseInt(this.params.start);
    var size = 50;
    if (this.params.size != null) 
        size = parseInt(this.params.size);
    var sort = this.params.sort;
    var track_scores = this.params.track_scores;
    var searchParams = JSON.parse(fileToString((fileFromDatastream).call(this, "searchParams", null)));
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
    var data = fileToString((fileFromDatastream).call(this, "data", null));
    if (data != null && data != "") 
        q = data;
    if (q == null || q == "") 
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
var usernameSalt = null;
var passwordSalt = null;
var secretSalt = null;
var skyIdSalt = null;
var skyIdSecretStr = null;
var skyIdSecret = function() {
    return skyIdSecretStr;
};
var skyIdSecretKey = null;
var skyIdPem = null;
var cachedSalts = new Object();
var salts = function() {
    return JSON.stringify(cachedSalts);
};
var skyIdCreate = function() {
    var id = null;
    var password = null;
    var credentials = null;
    var searchParams = JSON.parse(fileToString((fileFromDatastream).call(this, "credentialCommit", null)));
    if (searchParams != null) {
        if ((searchParams)["username"] != null) 
            id = (searchParams)["username"];
        if ((searchParams)["password"] != null) 
            password = (searchParams)["password"];
        if ((searchParams)["credentials"] != null) 
            credentials = (searchParams)["credentials"];
    }
    if (id == null) 
        error("Missing username.", 422);
    if (password == null) 
        error("Missing password.", 422);
    var payload = credentials;
    var saltedPassword = forge.util.encode64(forge.pkcs5.pbkdf2(password, skyIdSalt, 10000, 64));
    (payload)["password"] = saltedPassword;
    var saltedId = forge.util.encode64(forge.pkcs5.pbkdf2(id, skyIdSalt, 10000, 16));
    var signatureSheet = new Array();
    signatureSheet.push(EcIdentityManager.createSignature(60000, null, skyIdPem));
    (this)["signatureSheet"] = signatureSheet;
    var get = (skyrepoGetParsed).call(this, saltedId, null, "schema.cassproject.org.kbac.0.2.EncryptedValue", null);
    if (get != null) 
        get = JSON.parse(EcAesCtr.decrypt((get)["payload"], skyIdSecretKey, saltedId));
    var encryptedPayload = new EcEncryptedValue();
    encryptedPayload.addOwner(skyIdPem.toPk());
    encryptedPayload.payload = EcAesCtr.encrypt(JSON.stringify(payload), skyIdSecretKey, saltedId);
    if (get == null) 
        (skyrepoPutParsed).call(this, JSON.parse(encryptedPayload.toJson()), saltedId, null, "schema.cassproject.org.kbac.0.2.EncryptedValue");
     else 
        error("Cannot create, account already exists.", 422);
    return null;
};
var skyIdCommit = function() {
    var id = null;
    var password = null;
    var token = null;
    var credentials = null;
    var searchParams = JSON.parse(fileToString((fileFromDatastream).call(this, "credentialCommit", null)));
    if (searchParams != null) {
        if ((searchParams)["username"] != null) 
            id = (searchParams)["username"];
        if ((searchParams)["password"] != null) 
            password = (searchParams)["password"];
        if ((searchParams)["token"] != null) 
            token = (searchParams)["token"];
        if ((searchParams)["credentials"] != null) 
            credentials = (searchParams)["credentials"];
    }
    if (id == null) 
        error("Missing username.", 422);
    if (password == null) 
        error("Missing password.", 422);
    if (token == null) 
        error("Missing token.", 422);
    var payload = credentials;
    (payload)["token"] = token;
    var saltedPassword = forge.util.encode64(forge.pkcs5.pbkdf2(password, skyIdSalt, 10000, 64));
    (payload)["password"] = saltedPassword;
    var saltedId = forge.util.encode64(forge.pkcs5.pbkdf2(id, skyIdSalt, 10000, 16));
    var encryptedPayload = new EcEncryptedValue();
    encryptedPayload.addOwner(skyIdPem.toPk());
    encryptedPayload.payload = EcAesCtr.encrypt(JSON.stringify(payload), skyIdSecretKey, saltedId);
    var signatureSheet = new Array();
    signatureSheet.push(EcIdentityManager.createSignature(60000, null, skyIdPem));
    (this)["signatureSheet"] = signatureSheet;
    var get = (skyrepoGetParsed).call(this, saltedId, null, "schema.cassproject.org.kbac.0.2.EncryptedValue", null);
    if (get == null) 
        error("User does not exist.", 404);
    get = JSON.parse(EcAesCtr.decrypt((get)["payload"], skyIdSecretKey, saltedId));
    if ((get)["token"] != token) 
        error("An error in synchronization has occurred. Please re-login and try again.", 403);
    (skyrepoPutParsed).call(this, JSON.parse(encryptedPayload.toJson()), saltedId, null, "schema.cassproject.org.kbac.0.2.EncryptedValue");
    return null;
};
var skyIdLogin = function() {
    var id = null;
    var password = null;
    var credentials = null;
    var searchParams = JSON.parse(fileToString((fileFromDatastream).call(this, "credentialRequest", null)));
    if (searchParams != null) {
        if ((searchParams)["username"] != null) 
            id = (searchParams)["username"];
        if ((searchParams)["password"] != null) 
            password = (searchParams)["password"];
        if ((searchParams)["credentials"] != null) 
            credentials = (searchParams)["credentials"];
    }
    if (id == null) 
        error("Missing username.", 422);
    if (password == null) 
        error("Missing password.", 422);
    var saltedPassword = forge.util.encode64(forge.pkcs5.pbkdf2(password, skyIdSalt, 10000, 64));
    var saltedId = forge.util.encode64(forge.pkcs5.pbkdf2(id, skyIdSalt, 10000, 16));
    var signatureSheet = new Array();
    signatureSheet.push(EcIdentityManager.createSignature(60000, null, skyIdPem));
    (this)["signatureSheet"] = signatureSheet;
    var get = (skyrepoGetParsed).call(this, saltedId, null, "schema.cassproject.org.kbac.0.2.EncryptedValue", null);
    if (get == null) 
        error("User does not exist.", 404);
    get = JSON.parse(EcAesCtr.decrypt((get)["payload"], skyIdSecretKey, saltedId));
    if ((get)["password"] != saltedPassword) 
        error("Invalid password.", 403);
    (get)["token"] = randomString(20);
    var encryptedPayload = new EcEncryptedValue();
    encryptedPayload.addOwner(skyIdPem.toPk());
    encryptedPayload.payload = EcAesCtr.encrypt(JSON.stringify(get), skyIdSecretKey, saltedId);
    (skyrepoPutParsed).call(this, JSON.parse(encryptedPayload.toJson()), saltedId, null, "schema.cassproject.org.kbac.0.2.EncryptedValue");
    delete (get)["password"];
    return JSON.stringify(get);
};
(function() {
    if (!fileExists("skyId.username.public.salt")) 
        fileSave(randomString(2048), "skyId.username.public.salt");
    usernameSalt = fileToString(fileLoad("skyId.username.public.salt"));
    if (!fileExists("skyId.password.public.salt")) 
        fileSave(randomString(2048), "skyId.password.public.salt");
    passwordSalt = fileToString(fileLoad("skyId.password.public.salt"));
    if (!fileExists("skyId.secret.public.salt")) 
        fileSave(randomString(2048), "skyId.secret.public.salt");
    secretSalt = fileToString(fileLoad("skyId.secret.public.salt"));
    (cachedSalts)["usernameSalt"] = usernameSalt;
    (cachedSalts)["usernameIterations"] = 5000;
    (cachedSalts)["usernameLength"] = 64;
    (cachedSalts)["passwordSalt"] = passwordSalt;
    (cachedSalts)["passwordIterations"] = 5000;
    (cachedSalts)["passwordLength"] = 64;
    (cachedSalts)["secretSalt"] = secretSalt;
    (cachedSalts)["secretIterations"] = 5000;
    (cachedSalts)["secretLength"] = 64;
    if (!fileExists("skyId.salt")) 
        fileSave(randomString(2048), "skyId.salt");
    skyIdSalt = fileToString(fileLoad("skyId.salt"));
    if (!fileExists("skyId.secret")) 
        fileSave(randomString(2048), "skyId.secret");
    skyIdSecretStr = fileToString(fileLoad("skyId.secret"));
    skyIdSecretKey = forge.util.encode64(forge.pkcs5.pbkdf2(skyIdSecretStr, skyIdSalt, 10000, 16));
    if (!fileExists("skyId.pem")) 
        fileSave(EcPpk.fromPem(rsaGenerate()).toPem(), "skyId.pem");
    skyIdPem = EcPpk.fromPem(fileToString(fileLoad("skyId.pem")));
    bindWebService("/sky/id/salts", salts);
    bindWebService("/sky/id/create", skyIdCreate);
    bindWebService("/sky/id/commit", skyIdCommit);
    bindWebService("/sky/id/login", skyIdLogin);
})();
