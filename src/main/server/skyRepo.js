const EcArray = require('cassproject/src/com/eduworks/ec/array/EcArray');
const EcPk = require('cassproject/src/com/eduworks/ec/crypto/EcPk');
const EcRsaOaepAsync = require('cassproject/src/com/eduworks/ec/crypto/EcRsaOaepAsync');
const EcEncryptedValue = require('cassproject/src/org/cassproject/ebac/repository/EcEncryptedValue');
const EcRemoteLinkedData = require('cassproject/src/org/cassproject/schema/general/EcRemoteLinkedData');
const fs = require('fs');
const languageStrings = require("./constants/languageStrings");

//RS2 shims
let afterSave = function(o){
    //TODO: Websocket broadcast
    wsBroadcast(EcRemoteLinkedData.trimVersionFromUrl(o["@id"]));
}
let afterSaveBulk = function(ary){
    //TODO: Websocket broadcast
    wsBroadcast(JSON.stringify(ary));
}
let beforeGet = function(){
    //TODO: xAPI polling (if enabled);
}
//~RS2 shims~

global.keyFor = function (filename) {
    if (process.env[filename] != null)
        return process.env[filename];
    if (fs.existsSync(filename + ".pem"))
        return fileToString(fileLoad(filename + ".pem", false, true));
    if (fs.existsSync("etc/" + filename + ".pem"))
        return fileToString(fileLoad("etc/" + filename + ".pem", false, true));
    if (!fs.existsSync("etc"))
        createDirectory("etc");
    fileSave(EcPpk.generateKey().toPem(), "etc/" + filename + ".pem");
    return fileToString(fileLoad("etc/" + filename + ".pem", false, true));
}

function repoAutoDetect() {
    if (process.env.CASS_LOOPBACK != null)
        repo.init(process.env.CASS_LOOPBACK,function(){
            global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, "CassRepoInit", EcObject.keys(EcRemoteLinkedData.forwardingTable).length + " records now in forwarding table.");
        }, (error) => {
            global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.ERROR, "CassRepoInitError", error);
        });
    else
        repo.autoDetectRepository();
    
    global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, "CassRepoAutoDetect",
        "Loopback: " + repo.selectedServer,
        "Loopback Proxy: " + repo.selectedServerProxy,
        "Elasticsearch Endpoint: " + elasticEndpoint,
        "Text Encoding: " + java.lang.System.getProperty("file.encoding"),
        "Text Encoding: " + java.nio.charset.Charset.defaultCharset().toString());
}
const elasticHeaders = global.elasticHeaders = function() {
  const headers = {};
  if (process.env.ELASTICSEARCH_AUTHORIZATION != null) {
    headers.Authorization = process.env.ELASTICSEARCH_AUTHORIZATION.trim();
  }
  return headers;
};
var elasticSearchVersion = function() {
    return ((elasticSearchInfo)["version"])["number"];
};
var getTypeFromObject = function(o) {
    var encryptedType = (o)["encryptedType"];
    var encryptedContext = (o)["encryptedContext"];
    var type = (o)["@type"];
    var context = (o)["@context"];
    if (type == null) 
        type = (o)["type"];
    if (context == null) 
        context = (o)["context"];
    if (encryptedType == null) 
        encryptedType = (o)["@encryptedType"];
    if (encryptedContext == null) 
        encryptedContext = (o)["@encryptedContext"];
    if (encryptedType != null) 
        type = encryptedType;
    if (encryptedContext != null) 
        context = encryptedContext;
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
var signatureSheet = async function() {
    var sigSheet = null;
    sigSheet = this.ctx.get("signatureSheet");
    if (sigSheet !== undefined && sigSheet != null) 
        return sigSheet;
    sigSheet = [];
    var fromDatastream = (fileFromDatastream).call(this, "signatureSheet", null);
    var stringFromDatastream = fileToString(fromDatastream);
    if (stringFromDatastream !== undefined && stringFromDatastream != null) 
        try {
            sigSheet = sigSheet.concat(JSON.parse(stringFromDatastream));
        }catch (ex) {
            error("Missing or Malformed Signature.", 496);
        }
    var hdrs = (headers).call(this);
    var camelcaseSignatureSheet = (hdrs)["signatureSheet"];
    var lowercaseSignatureSheet = (hdrs)["signaturesheet"];
    if (camelcaseSignatureSheet !== undefined && camelcaseSignatureSheet != null) 
        sigSheet = sigSheet.concat(JSON.parse(camelcaseSignatureSheet));
    if (lowercaseSignatureSheet !== undefined && lowercaseSignatureSheet != null) 
        sigSheet = sigSheet.concat(JSON.parse(lowercaseSignatureSheet));
    for (var i = 0; i < sigSheet.length; i++) {
        var signature = new EbacSignature();
        signature.copyFrom(sigSheet[i]);
        if (signature == null)
            error("Missing Signature.", 496);
        
        var owner = signature.owner;
        if (owner == null) 
            owner = (signature)["@owner"];
        (signature)["@owner"] = owner;
        signature.owner = null;
        let pk = EcPk.fromPem(owner);
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.INFO, "CassIdentity", pk.fingerprint());

        var validTypes = signature.getTypes();
        var foundType = false;
        for (var j = 0; j < validTypes.length; j++) 
            if (getTypeFromObject(sigSheet[i]) == validTypes[j]) 
                foundType = true;
        if (!foundType) 
            error("Invalid Signature Version.", 422);
        if (signature.expiry == null) 
            error("Missing expiry date.", 422);
        var now = new Date().getTime();
        if (signature.expiry < now) 
            if (process.env.ALLOW_SANCTIONED_REPLAY != 'true' || this.ctx.sanctionedReplay != true) //Used to replay replication / database log files without "just jamming the data in"
                error("A Signature is Expired. My time is " + now + " and the signature expires at " + signature.expiry, 419);
        var signBytes = signature.signature;
        if (signBytes == null) 
            signBytes = (signature)["@signature"];
        signature.signature = null;
        (signature)["@signature"] = null;
        if (!await EcRsaOaepAsync.verify(pk, signature.toJson(), signBytes)) 
            error("Invalid Signature Detected: " + signature.toJson(), 451);
        signature.owner = (signature)["@owner"];
        sigSheet[i] = signature;
    }
    this.ctx.put("signatureSheet", sigSheet);
    return sigSheet;
};
var isEncryptedType = function(obj) {
    return obj.isAny(new EbacEncryptedValue().getTypes());
};
var filterResults = async function(o) {
    if (o == null) 
        return o;
    if (EcArray.isArray(o)) {
        var ary = o;
        for (var i = 0; i < ary.length; i++) {
            if (ary[i] == null) 
                continue;
            var result = null;
            try {
                result = await (filterResults).call(this, ary[i], null);
            }catch (ex) {
                if (ex != null && ex.toString().indexOf("Signature Violation") == -1)
                     throw ex;
            }
            if (result == null) {
                ary.splice(i, 1);
                i--;
            } else 
                ary[i] = result;
        }
        return ary;
    } else if (EcObject.isObject(o)) {
        delete o.decryptedSecret;
        var rld = new EcRemoteLinkedData((o)["@context"], (o)["@type"]);
        rld.copyFrom(o);
        if ((rld.reader != null && rld.reader.length != 0) || isEncryptedType(rld)) {
            var signatures = await (signatureSheet).call(this);
            var foundSignature = false;
            for (var i = 0; i < signatures.length; i++) 
                if (JSON.stringify(o).indexOf(signatures[i].owner) != -1) {
                    foundSignature = true;
                    break;
                }
            if (!foundSignature) 
                throw new Error("Signature Violation");
            //Securing Proxy: Decrypt data that is being passed back via SSO.
            if (this.ctx.req.eim != null)
            {
                try
                {
                    if (isEncryptedType(rld))
                    {                        
                        var eev = new EcEncryptedValue();
                        eev.copyFrom(o);
                        o.decryptedSecret = await eev.decryptSecret(this.ctx.req.eim);
                    }
                }
                catch (msg){
                    global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.ERROR, "CassDecryptError", "We couldn't decrypt it, hope the client has better luck! -- " + msg);
                }
            }
        }
        var keys = EcObject.keys(o);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var result = null;
            result = await (filterResults).call(this, (o)[key], null);
            if (result != null) 
                (o)[key] = result;
             else 
                delete (o)[key];
        }
        return o;
    } else 
        return o;
};
var skyrepoUrlType = function(o) {
    return getTypeFromObject(o);
};
var inferTypeFromObj = function(o, atType) {
    // if (atType != null) 
    //     return atType;
    var fullType = skyrepoUrlType(o);
    if (fullType == null) 
        return fullType;
    fullType = fullType.replace("http://", "");
    fullType = fullType.replace("https://", "");
    fullType = fullType.replace("/", ".");
    fullType = fullType.replace("/", ".");
    fullType = fullType.replace("/", ".");
    fullType = fullType.replace(":", ".");
    fullType = fullType.replace(":", ".");
    fullType = fullType.replace(":", ".");
    return fullType;
};
var inferTypeWithoutObj = function(atType) {
    if (atType !== undefined && atType != null) 
        return atType;
    return "_all";
};
var putUrl = function(o, id, version, type) {
    var typeFromObj = inferTypeFromObj(o, type);
    var versionPart = null;
    var refreshPart = "refresh=true";
    if (this.ctx.get("refresh") !== undefined && this.ctx.get("refresh") != null) 
        refreshPart = "refresh=" + this.ctx.get("refresh");
    if (version === undefined || version == null) {
        versionPart = "?" + refreshPart;
    } else 
        versionPart = "?version=" + (version === undefined || version == null ? "" : version) + "&version_type=external&" + refreshPart;
    var url = elasticEndpoint;
    url += "/" + typeFromObj.toLowerCase();
    if (elasticSearchVersion().startsWith("7.") || elasticSearchVersion().startsWith("8.")) 
        url += "/_doc";
    else 
        url += "/" + typeFromObj;
    url += "/" + encodeURIComponent(id) + versionPart;
    if (skyrepoDebug)
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.DEBUG, "SkyrepoPutUrl", "Put:" + url);
    return url;
};
var putPermanentUrl = function(o, id, version, type) {
    var versionPart = null;
    var refreshPart = "refresh=true";
    if (this.ctx.get("refresh") !== undefined && this.ctx.get("refresh") != null) 
        refreshPart = "refresh=" + this.ctx.get("refresh");
    if (version === undefined || version == null) {
        versionPart = "?" + refreshPart;
    } else 
        versionPart = "?version=" + (version === undefined || version == null ? "" : version) + "&version_type=external&" + refreshPart;
    var url = elasticEndpoint;
    url += "/permanent";
    if (elasticSearchVersion().startsWith("7.") || elasticSearchVersion().startsWith("8.")) 
        url += "/_doc";
    else 
        url += "/permanent";
    url += "/" + encodeURIComponent(id) + "." + (version === undefined || version == null ? "" : version) + versionPart;
    if (skyrepoDebug)
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.DEBUG, "SkyrepoPutPermanentUrl", "PutPermanent:" + url);
    return url;
};
var putPermanentBaseUrl = function(o, id, version, type) {
    var versionPart = null;
    var refreshPart = "refresh=true";
    if (this.ctx.get("refresh") !== undefined && this.ctx.get("refresh") != null) 
        refreshPart = "refresh=" + this.ctx.get("refresh");
    if (version === undefined || version == null) {
        versionPart = "?" + refreshPart;
    } else 
        versionPart = "?version=" + (version === undefined || version == null ? "" : version) + "&version_type=external&" + refreshPart;
    var url = elasticEndpoint;
    url += "/permanent";
    if (elasticSearchVersion().startsWith("7.") || elasticSearchVersion().startsWith("8.")) 
        url += "/_doc";
     else 
        url += "/permanent";
    url += "/" + encodeURIComponent(id) + "." + versionPart;
    if (skyrepoDebug)
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.DEBUG, "SkyrepoPutPermanentBaseUrl", "PutPermanentBase:" + url);
    return url;
};
var getUrl = function(index, id, version, type) {
    var url = elasticEndpoint;
    url += "/" + index;
    if (elasticSearchVersion().startsWith("7.") || elasticSearchVersion().startsWith("8.")) 
        url += "/_doc";
    else if (index == "permanent") 
        url += "/permanent";
    else {
        var typeFromObj = inferTypeWithoutObj(type);
        url += "/" + typeFromObj;
    }
    if (index == "permanent") 
        url += "/" + encodeURIComponent(id) + "." + (version === undefined || version == null ? "" : version);
     else 
        url += "/" + encodeURIComponent(id);
    if (skyrepoDebug)
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.DEBUG, "SkyrepoGetUrl", "Get:" + url);
    return url;
};
var deleteUrl = function(id, version, type) {
    var typeFromObj = inferTypeWithoutObj(type);
    var refreshPart = "refresh=true";
    if (this.ctx.get("refresh") !== undefined && this.ctx.get("refresh") != null) 
        refreshPart = "refresh=" + this.ctx.get("refresh");
    var url = elasticEndpoint;
    url += "/" + typeFromObj.toLowerCase();
    if (elasticSearchVersion().startsWith("7.") || elasticSearchVersion().startsWith("8.")) 
        url += "/_doc";
     else 
        url += "/" + typeFromObj;
    url += "/" + encodeURIComponent(id);
    url += "?" + refreshPart;
    if (skyrepoDebug)
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.DEBUG, "SkyrepoDeleteUrl", "Delete:" + url);
    return url;
};
var deletePermanentBaseUrl = function(id, version, type) {
    var url = elasticEndpoint;
    url += "/permanent";
    if (elasticSearchVersion().startsWith("7.") || elasticSearchVersion().startsWith("8.")) 
        url += "/_doc";
     else 
        url += "/permanent";
    url += "/" + encodeURIComponent(id) + ".";
    if (skyrepoDebug)
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.DEBUG, "SkyrepoDeletePermBase", "DeletePermanentBase:" + url);
    return url;
};
var skyrepoPutInternalTypeCheck = function(typeChecked, o, type) {
    if (typeChecked) 
        return null;
    return inferTypeFromObj(o, type);
};
var languages = null;
var flattenLangstrings = function(o) {
    if (languages == null) {
        languages = {};
        let ary = languageStrings;
        for (var i = 0; i < ary.length; i++) 
            (languages)[ary[i]] = "yes";
    }
    if (EcObject.isObject(o)) {
        var keys = EcObject.keys(o);
        var langStringArray = new Array();
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key == "@value") 
                return (o)[key];
            if (langStringArray != null) {
                if ((languages)[key.toLowerCase()] == "yes") 
                    langStringArray.push((o)[key]);
                 else 
                    langStringArray = null;
            }
            (o)[key] = flattenLangstrings((o)[key]);
        }
        if (langStringArray != null && langStringArray.length > 0) 
            return langStringArray;
    } else if (EcArray.isArray(o)) {
        var a = o;
        for (var i = 0; i < a.length; i++) {
            a[i] = flattenLangstrings(a[i]);
        }
    }
    return o;
};
var skyrepoPutInternalIndex = async function(o, id, version, type) {
    var url = putUrl.call(this, o, id, version, type);
    o = flattenLangstrings(JSON.parse(JSON.stringify(o)));
    if ((o)["owner"] != null && EcArray.isArray((o)["owner"])) {
        var owners = (o)["owner"];
        for (var i = 0; i < owners.length; i++) 
            if (owners[i].indexOf("\n") != -1) 
                owners[i] = EcPk.fromPem(owners[i]).toPem();
    }
    if ((o)["reader"] != null && EcArray.isArray((o)["reader"])) {
        var owners = (o)["reader"];
        for (var i = 0; i < owners.length; i++) 
            if (owners[i].indexOf("\n") != -1) 
                owners[i] = EcPk.fromPem(owners[i]).toPem();
    }
    try {
        (o)["@version"] = parseInt(version);
        if (isNaN((o)["@version"])) 
            (o)["@version"] = new Date().getTime();
    }catch (ex) {
        (o)["@version"] = new Date().getTime();
    }
    if (type != null && type.indexOf("EncryptedValue") != -1) {
        delete (o)["payload"];
        delete (o)["secret"];
    }
    if (skyrepoDebug)
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, "SkyrepoPutInternalIndex", JSON.stringify(o));
    let response = await httpPost(o, url, "application/json", false, null, null, true, elasticHeaders());
    return response;
};
var permanentCreated = false;
var skyrepoPutInternalPermanent = async function(o, id, version, type) {
    if (permanentCreated != true) {
        var mappings = {};
        var permNoIndex = {};
        var doc = {};
        (mappings)["mappings"] = permNoIndex;
        
        if (elasticSearchVersion().startsWith("7.") || elasticSearchVersion().startsWith("8.")) 
            permNoIndex.enabled = false;
        else
            (permNoIndex)["permanent"] = doc;
        (doc)["enabled"] = false;
        var result = await httpPut(mappings, elasticEndpoint + "/permanent", "application/json", null, true, elasticHeaders());
        if (skyrepoDebug)
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, "SkyrepoPutInternalPerm", JSON.stringify(result));
        permanentCreated = true;
    }
    var data = {};
    (data)["data"] = JSON.stringify(o);
    var url = putPermanentBaseUrl.call(this,o, id, version, type);
    let results = await httpPost(data, url, "application/json", false, null, null, true, elasticHeaders());
    if (results === 409) {
        return JSON.stringify(results);
    }
    if (version != null) {
        url = putPermanentUrl.call(this,o, id, version, type);
        results = await httpPost(data, url, "application/json", false, null, null, true, elasticHeaders());
    }
    if (skyrepoDebug)
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, "SkyrepoPutInternalPerm", JSON.stringify(results));
    return JSON.stringify(results);
};
var skyrepoPutInternal = global.skyrepoPutInternal = async function(o, id, version, type) {
    //Securing Proxy: Sign data that is to be saved.
    let erld = new EcRemoteLinkedData(null,null);
    erld.copyFrom(o);
    if (this.ctx && this.ctx.req && this.ctx.req.eim != null)
    {
        try
        {
            await this.ctx.req.eim.sign(erld);
            o = JSON.parse(erld.toJson());
        }
        catch (msg){
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.ERROR, "SkyrepoPutInternalError", msg);
        }
    }
    var oldPermanent = await skyrepoGetPermanent(id, version, type);
    if (isNaN(version))
        version = null;
    let chosenVersion = version;
    if (chosenVersion == null)
    {
        if (oldPermanent != null && oldPermanent["_version"] != null && !isNaN(oldPermanent["_version"]))
            chosenVersion = oldPermanent["_version"]+1;
        else
            chosenVersion = 1;
    }
    var obj = await skyrepoPutInternalIndex.call(this,o, id, chosenVersion, type);
    if (erld.id != null)
    {
        var oldIndexRecords = await skyrepoGetIndexRecords(erld.shortId());
        if (oldIndexRecords != null)
            for (let oldIndexRecord of oldIndexRecords)
                if (oldIndexRecord._id != obj._id || oldIndexRecord._index != obj._index)
                    await skyrepoDeleteInternalIndex.call(this,oldIndexRecord._id, null, oldIndexRecord._index);
    }
    if (skyrepoDebug)
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, "SkyrepoPutInternal", JSON.stringify(obj));
    let permanentIds = [id];
    if (erld.id != null && erld.getGuid() != null)
        permanentIds.push(erld.getGuid())
    if (erld.id != null && erld.shortId() != null)
        permanentIds.push(EcCrypto.md5(erld.shortId()));
    EcArray.removeDuplicates(permanentIds);
    for (let permId of permanentIds)
    {
        let status = await skyrepoPutInternalPermanent.call(this,o, permId, chosenVersion, type);
        if (status === '409') {
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepoPutInternal", "409, version is: " + chosenVersion);
            let current = await skyrepoGetPermanent.call(this,permId,null,type);
            if (current && current._version > chosenVersion)
            {
                chosenVersion = current._version;
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepoPutInternal", "Updated to " + chosenVersion);
            }
            if (process.env.ALLOW_SANCTIONED_REPLAY != 'true' || this.ctx.sanctionedReplay != true) //Used to replay replication / database log files without "just jamming the data in"
                await skyrepoPutInternal.call(this, o, id, chosenVersion+1, type, true);
            break;
        }
    }
    var rld = new EcRemoteLinkedData(null, null);
    rld.copyFrom(o);
    if (rld.isAny(new EcRekeyRequest().getTypes())) {
        var err = new EcRekeyRequest();
        err.copyFrom(o);
        if (err.verify()) 
            err.addRekeyRequestToForwardingTable();
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, "SkyrepoPutInternal", EcObject.keys(EcRemoteLinkedData.forwardingTable).length + " records now in forwarding table.");
    }
};
var skyrepoGetIndexInternal = async function(index, id, version, type) {
    if (skyrepoDebug)
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, "SkyrepGetIndexInternal", "Fetching from " + index + " : " + type + " / " + id + " / " + version);
    let response = await httpGet(getUrl.call(this,index, id, version, type), true, elasticHeaders());
    return response;
};

var skyrepoManyGetIndexInternal = async function(index, manyParseParams) {
    if (skyrepoDebug)
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, "SkyrepManyGetIndexInternal", "Fetching from " + index + " : " + manyParseParams);

    let ary = manyParseParams;
    var mget = {};
    var docs = new Array();
    (mget)["docs"] = docs;
    for (var i = 0; i < ary.length; i++) {
        var parseParams = ary[i];
        var id = (parseParams)["id"];
        var type = (parseParams)["type"];
        var version = (parseParams)["version"];
        var p = {};
        (p)["_index"] = index;
        if (elasticSearchVersion().startsWith('8.')) {
        //Don't multiget with _type
        } else if (elasticSearchVersion().startsWith("7.")) 
            (p)["_type"] = "_doc";
         else 
            (p)["_type"] = index;
        (p)["_id"] = id + "." + (version == null ? "" : version); 
        docs.push(p);
    }

    let response = await httpPost(mget, elasticEndpoint + "/_mget", "application/json", false, null, null, true, elasticHeaders());
    return response;
};

var skyrepoGetIndexSearch = async function(id, version, type)
{
    var microSearchUrl = elasticEndpoint + "/_search?version&q=_id:" + id + "";
    let microSearch = await httpGet(microSearchUrl, true, elasticHeaders());
    if (skyrepoDebug)
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, "SkyrepGetIndexSearch", microSearchUrl);
    if (microSearch == null) 
        return null;
    var hitshits = (microSearch)["hits"];
    if (hitshits == null) 
        return null;
    var hits = (hitshits)["hits"];
    if (hits.length == 0) 
        return null;
    var hit = hits[0];
    return hit;
}

var skyrepoGetIndexRecords = async function(id)
{
    let hashId = EcCrypto.md5(id);
    var microSearchUrl = elasticEndpoint + "/_search?version&q=@id:\"" + id + "\" OR @id:\"" + hashId + "\"";
    let microSearch = await httpGet(microSearchUrl, true, elasticHeaders());
    if (skyrepoDebug)
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, "SkyrepGetIndexRecords", microSearchUrl);
    if (microSearch == null) 
        return null;
    var hitshits = (microSearch)["hits"];
    if (hitshits == null) 
        return null;
    var hits = (hitshits)["hits"];
    if (hits.length == 0) 
        return null;
    return hits;
}

var skyrepoGetIndex = async function(id, version, type) {
    if (type !== undefined && type != null && type != "") {
        var result = await skyrepoGetIndexInternal(type.toLowerCase(), id, version, type);
        return result;
    } else {
        return await skyrepoGetIndexSearch(id,version,type);
    }
};
var skyrepoManyGetIndex = async function(manyParseParams) {
    if (type !== undefined && type != null && type != "") {
        var results = await skyrepoManyGetIndexInternal(type.toLowerCase(), manyParseParams);
        return results;
    } else {
        let results = [];
        for (let parseParams of manyParseParams)
        {
            var id = (parseParams)["id"];
            var type = (parseParams)["type"];
            var version = (parseParams)["version"];
            let result = await skyrepoGetIndexSearch(id,version,type);
            if (result != null)
                results.push(result);
        }
        return results;
    }
};
var skyrepoGetPermanent = async function(id, version, type) {
    var result = await skyrepoGetIndexInternal.call(this,"permanent", id, version, type);
    return result;
};
global.skyrepoGetInternal = async function(id, version, type) {
    var result = await skyrepoGetPermanent(id, version, type);
    if (result == null) 
        return null;
    if ((result)["error"] != null) 
        return null;
    if ((result)["found"] == true) 
        return JSON.parse(((result)["_source"])["data"]);
    if (skyrepoDebug)
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, "SkyrepGetInternal", "Failed to find " + type + "/" + id + "/" + version + " -- trying degraded form from search index.");
    result = await (skyrepoGetIndex).call(this, id, version, type);
    if (result == null) 
        return null;
    if ((result)["error"] != null) 
        return null;
    if ((result)["found"] == true || (result)["_source"] != null) 
        return (result)["_source"];
    return null;
};
var skyrepoManyGetPermanent = async function(manyParseParams) {
    var result = await skyrepoManyGetIndexInternal.call(this,"permanent", manyParseParams);
    return result;
};
global.skyrepoManyGetInternal = async function(manyParseParams) {
    var response = await skyrepoManyGetPermanent(manyParseParams);
    
    var resultDocs = (response)["docs"];
    var results = [];
    var notFoundInPermanent = [];
    if (resultDocs != null) {
        for (var i = 0; i < resultDocs.length; i++) {
            var doc = resultDocs[i];
            if ((doc)["found"]) {
                results.push(JSON.parse(((doc)["_source"])["data"]));
            }
            else
                notFoundInPermanent.push(manyParseParams[i]);
        }
    }

    if (skyrepoDebug && notFoundInPermanent.length > 0)
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, "SkyrepManyGetInternal", "Failed to find " + manyParseParams + " -- trying degraded form from search index.");

    response = await (skyrepoManyGetIndex).call(this, notFoundInPermanent);
    resultDocs = (response)["docs"];
    if (resultDocs != null) {
        for (var i = 0; i < resultDocs.length; i++) {
            var doc = resultDocs[i];
            if ((doc)["found"]) {
                delete (lookup)[((doc)["_id"]).substring(0, ((doc)["_id"]).length - 1)];
                results.push(JSON.parse(((doc)["_source"])["data"]));
            }
        }
    }
    return results;
};
global.skyrepoGet = async function(parseParams) {
    if (parseParams == null && EcObject.isObject(this.params.obj)) 
        parseParams = this.params.obj;
    if (parseParams == null) {
        parseParams = {};
        (parseParams)["id"] = this.params.id;
        (parseParams)["type"] = this.params.type;
        (parseParams)["version"] = this.params.version;
        (parseParams)["versions"] = this.params.versions;
    }
    if (skyrepoDebug)
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, "SkyrepGet", JSON.stringify(parseParams));
    if (skyrepoDebug)
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, "SkyrepGet", JSON.stringify(this.params.obj));
    var id = (parseParams)["id"];
    var type = (parseParams)["type"];
    var version = (parseParams)["version"];
    var versions = (parseParams)["versions"];
    return await (skyrepoGetParsed).call(this, id, version, type, null, versions);
};
var skyrepoGetParsed = async function(id, version, type, versions) {
    var result = await (skyrepoGetInternal).call(this, id, version, type);
    if (result == null) 
        return null;
    var filtered = null;
    try {
        filtered = await (filterResults).call(this, result, null);
    }catch (ex) {
        if (ex.toString().indexOf("Signature Violation") != -1) 
             throw ex;
    }
    if (versions == "true") {}
    if (filtered == null) 
        return null;
    if (EcObject.keys(filtered).length == 0) 
        return null;
    return filtered;
};
var skyrepoManyGetParsed = async function(manyParseParams) {
    var results = await (skyrepoManyGetInternal).call(this, manyParseParams);
    if (results == null) 
        return null;
    var filtered = null;
    try {
        filtered = await (filterResults).call(this, results, null);
    }catch (ex) {
        if (ex.toString().indexOf("Signature Violation") != -1) 
             throw ex;
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.ERROR, "SkyrepManyGetParsedError", ex);
    }
    if (filtered == null) 
        return null;
    return filtered;
};
var skyrepoPut = async function(parseParams) {
    if (parseParams == null && this.params.id != null && this.params.id != "") {
        parseParams = {};
        (parseParams)["id"] = this.params.id;
        (parseParams)["type"] = this.params.type;
        (parseParams)["version"] = this.params.version;
        (parseParams)["obj"] = this.params.obj;
    }
    if (skyrepoDebug)
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, "SkyrepPut", "put pp:" + JSON.stringify(parseParams));
    if (skyrepoDebug)
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, "SkyrepPut", "put obj:" + JSON.stringify(this.params.obj));
    if (parseParams == null && EcObject.isObject(this.params.obj)) 
        parseParams = this.params.obj;
    var obj = (parseParams)["obj"];
    if (!EcObject.isObject(obj)) 
        obj = JSON.parse(obj);
    var id = (parseParams)["id"];
    var type = (parseParams)["type"];
    var version = (parseParams)["version"];
    return await (skyrepoPutParsed).call(this, obj, id, version, type, null);
};
global.skyrepoPutParsed = async function(o, id, version, type) {
    if (o == null) 
        return;

    let initialObj = o;
    
    await (validateSignatures).call(this, id, version, type, initialObj, "Only an owner of an object may change it.");
    await skyrepoPutInternal.call(this,o, id, version, type);
};
var validateSignatures = async function(id, version, type, initialObj, errorMessage) {

    let signatures = await ((signatureSheet).call(this));
    let ownershipRequired = global.blockPublicCreation;

    let storedObj = await (skyrepoGetInternal).call(this, id, version, type);
    if (storedObj == null) {

        if (!ownershipRequired)
            return null;
        
        let objWasProvided = initialObj != undefined;
        if (!objWasProvided)
            error("Forbidden, this instance does not allow public resource creation.  Could not determine initial object.", 403);

        let initialObjWrapped = new EcRemoteLinkedData(null, null);
        initialObjWrapped.copyFrom(initialObj);

        let alreadyHasOwnership = await ((validateOwners).call(this, initialObjWrapped, signatures));
        if (!alreadyHasOwnership)
            error("Forbidden, this instance does not allow public resource creation.  Could not determine initial object ownership.", 403);
        
        return null;
    }
    
    let clonedObj = new EcRemoteLinkedData(null, null);
    clonedObj.copyFrom(storedObj);

    let objectOwners = clonedObj.owner;
    let hasOwners = objectOwners !== undefined && objectOwners != null && objectOwners.length > 0;
    if (hasOwners) {
        let validOwners = await ((validateOwners).call(this, clonedObj, signatures));
        if (!validOwners)
            error(errorMessage, 401);
    }

    return clonedObj;
};

const validateOwners = async(obj, signatures) => {

    for (let i = 0; i < signatures.length; i++) {
        let owner = signatures[i].owner;
        if (owner == null) {
            owner = (signatures[i])["@owner"];
        }
        if (obj.hasOwner(EcPk.fromPem(owner))) {
            return true;
        }
    }

    return false;
}

var skyrepoDeleteInternalIndex = async function(id, version, type) {
    var url = deleteUrl.call(this, id, version, type);
    return await httpDelete(url, null, true, elasticHeaders());
};
var skyrepoDeleteInternalPermanent = async function(id, version, type) {
    var url = deletePermanentBaseUrl(id, version, type);
    return await httpDelete(url, null, true, elasticHeaders());
};
global.skyrepoDelete = async function(id, version, type) {
    let oldObj = await (validateSignatures).call(this, id, version, type, null, "Only an owner of an object may delete it.");
    let permanentIds = [id];
    if (oldObj.id != null && oldObj.getGuid() != null)
        permanentIds.push(oldObj.getGuid())
    if (oldObj.id != null && oldObj.shortId() != null)
        permanentIds.push(EcCrypto.md5(oldObj.shortId()));
    EcArray.removeDuplicates(permanentIds);
    if (oldObj != null) {
        await skyrepoDeleteInternalIndex.call(this, id, version, type);
        for (let permId of permanentIds)
            await skyrepoDeleteInternalPermanent.call(this, permId, version, type);
    } else {
        error("Can't find object to delete", 401);
    }
    return oldObj;
};
var searchObj = async function(q, start, size, sort, track_scores) {
    var s = {};
    if (start != null) 
        (s)["from"] = start;
    if (size != null) 
        (s)["size"] = size;
    if (sort != null) 
        (s)["sort"] = JSON.parse(sort);
    (s)["version"] = true;
    var query = {};
    (s)["query"] = query;
    var bool = {};
    (query)["bool"] = bool;
    var must = {};
    (bool)["must"] = must;
    var query_string = {};
    (must)["query_string"] = query_string;
    var signatures = await (signatureSheet).call(this);
    var concern = false;
    if (q.indexOf("*") != -1 && q.trim() != "*") 
        concern = true;
    if (q.indexOf("reader") != -1 || q.indexOf("@reader") != -1) 
        concern = true;
    (query_string)["query"] = q;
    if (signatures != null && signatures.length > 0) {
        var q2 = "";
        for (var i = 0; i < signatures.length; i++) {
            if (i > 0) 
                q2 += " OR ";
            q2 += "\"" + signatures[i].owner + "\"";
        }
        var should = {};
        (bool)["should"] = should;
        var query_string2 = {};
        (should)["query_string"] = query_string2;
        (query_string2)["query"] = q2;
    }
    return s;
};
var searchUrl = function(urlRemainder, index_hint) {
    var url = elasticEndpoint;
    if (index_hint != null && index_hint.indexOf("permanent") != -1) 
        index_hint = null;
    if (urlRemainder != null && urlRemainder != "" && urlRemainder != "/") 
        url += urlRemainder.toLowerCase();
     else if (index_hint == null) 
        url += "/*,-permanent";
     else 
        url += "/" + index_hint;
    if (!url.endsWith("/")) 
        url += "/";
    url += "_search";
    if (skyrepoDebug)
        global.auditLogger.report(global.auditLogger.LogCategory.SYSTEM, global.auditLogger.Severity.DEBUG, "SkyrepSearchUrl", url);
    return url;
};
var skyrepoSearch = async function(q, urlRemainder, start, size, sort, track_scores, index_hint) {
    var searchParameters = await (searchObj).call(this, q, start, size, sort, track_scores);
    if (skyrepoDebug)
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, "SkyrepSearch", JSON.stringify(searchParameters));
    let results = await httpPost(searchParameters, searchUrl(urlRemainder, index_hint), "application/json", false, null, null, true, elasticHeaders());
    
    if (skyrepoDebug)
        global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, "SkyrepSearch", JSON.stringify(results));
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
        if (type == null) {
            hits.splice(i--, 1);
            continue;
        }
        var id = (searchResult)["_id"];
        var hit = "";
        if (type != null) 
            hit += type + "/";
        hit += id;
        hits[i] = hit;
    }
    var me = this;
    searchResults = await endpointManyGet.call({ctx:me.ctx,params:{objs:hits}});
    for (var i = 0;i < searchResults.length;i++)
        if (searchResults[i] == null)
            searchResults.splice(i--,1);
    return searchResults;
};
let fetching = 0;
global.queryParse = function(urlRemainder) {
    if (urlRemainder == null && this.params.urlRemainder != null) 
        urlRemainder = this.params.urlRemainder;
    if (urlRemainder == null) 
        error("No resource specified.", 404);
    var split = urlRemainder.split("/");
    var result = {};
    if (split.length >= 1) 
        (result)["id"] = split[0];
    if (split.length >= 2) {
        (result)["type"] = split[0];
        (result)["id"] = split[1];
    }
    if (split.length == 3) 
        (result)["version"] = split[2] == "" ? null : parseInt(split[2]);
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
    if (accept == "application/rdf+xml") 
        return jsonLdToRdfXml(o);
    if (accept == "application/x-turtle" || accept == "text/turtle") 
        return jsonLdToTurtle(o);
    return JSON.stringify(o);
};
var endpointData = async function() {
    var q = this.params.q;
    var urlRemainder = this.params.urlRemainder;
    var start = 0;
    if (this.params.start !== undefined) 
    if (this.params.start != null) 
        start = parseInt(this.params.start);
    var size = 50;
    if (this.params.size !== undefined) 
    if (this.params.size != null) 
        size = parseInt(this.params.size);
    if (this.params.refresh !== undefined) 
    if (this.params.refresh != null) 
        this.ctx.put("refresh", this.params.refresh);
    var sort = this.params.sort;
    var track_scores = this.params.track_scores;
    var index_hint = this.params.index_hint;
    var versions = this.params.versions;
    var searchParams = (fileFromDatastream).call(this, "searchParams", null);
    if (searchParams != null) {
        searchParams = fileToString(searchParams);
        if (searchParams !== undefined) 
        if (searchParams != null) 
            searchParams = JSON.parse(searchParams);
        if ((searchParams)["q"] != undefined) 
        if ((searchParams)["q"] != null) 
            q = (searchParams)["q"];
        if ((searchParams)["start"] != undefined) 
        if ((searchParams)["start"] != null) 
            start = (searchParams)["start"];
        if ((searchParams)["size"] != undefined) 
        if ((searchParams)["size"] != null) 
            size = (searchParams)["size"];
        if ((searchParams)["sort"] != undefined) 
        if ((searchParams)["sort"] != null) 
            sort = (searchParams)["sort"];
        if ((searchParams)["track_scores"] != undefined) 
        if ((searchParams)["track_scores"] != null) 
            track_scores = (searchParams)["track_scores"];
        if ((searchParams)["index_hint"] != undefined) 
        if ((searchParams)["index_hint"] != null) 
            index_hint = (searchParams)["index_hint"];
        if ((searchParams)["versions"] != undefined) 
        if ((searchParams)["versions"] != null) 
            versions = (searchParams)["versions"];
    }
    if (size === undefined || size == null) 
        size = 50;
    if (start === undefined || start == null) 
        start = 0;
    if (q !== undefined && q != null) {
        (beforeGet).call(this);
        return JSON.stringify(await (skyrepoSearch).call(this, q, urlRemainder, start, size, sort, track_scores, index_hint));
    }
    var methodType = this.params.methodType;
    var parseParams = (queryParse).call(this, urlRemainder, null);
    var id = (parseParams)["id"];
    var type = (parseParams)["type"];
    var version = (parseParams)["version"];
    if (methodType == "DELETE") {
        var oldObj = await (skyrepoDelete).call(this, id, version, type);
        if (oldObj == null) 
            return null;
        afterSave(JSON.parse(oldObj.toJson()));
        return null;
    } else if (methodType == "POST") {
        var o = (fileFromDatastream).call(this, "data", null);
        if (o !== undefined && o != null)
            o = JSON.parse(fileToString(o));
        if (o == null || o == "") {
            (beforeGet).call(this);
            o = await (skyrepoGetParsed).call(this, id, version, type, null, versions);
            if (o == null) 
                error("Object not found or you did not supply sufficient permissions to access the object.", 404);
            var expand = this.params.expand != null;
            o = (tryFormatOutput).call(this, o, expand, null);
            return o;
        }
        await (skyrepoPutParsed).call(this, o, id, version, type);
        afterSave(o);
        return null;
    } else if (methodType == "GET") {
        (beforeGet).call(this);
        var o = await (skyrepoGetParsed).call(this, id, version, type, null, versions);
        if (o == null) 
            error("Object not found or you did not supply sufficient permissions to access the object.", 404);
        var expand = this.params.expand != null;
        o = (tryFormatOutput).call(this, o, expand, null);
        return o;
    }
    return null;
};
var endpointMultiGet = async function() {
    var ary = JSON.parse(fileToString((fileFromDatastream).call(this, "data", null)));
    var lookup = {};
    var mget = {};
    var docs = new Array();
    (mget)["docs"] = docs;
    for (var i = 0; i < ary.length; i++) {
        var urlRemainder = ary[i].replace("data/",'');
        var parseParams = (queryParse).call(this, urlRemainder, null);
        var id = (parseParams)["id"];
        (lookup)[id] = urlRemainder;
        var type = (parseParams)["type"];
        var version = (parseParams)["version"];
        var p = {};
        (p)["_index"] = "permanent";
    if (elasticSearchVersion().startsWith('8.')) {
      //Don't multiget with _type
    } else 
        if (elasticSearchVersion().startsWith("7.")) 
            (p)["_type"] = "_doc";
         else 
            (p)["_type"] = "permanent";
        (p)["_id"] = id + "." + (version == null ? "" : version); 
        docs.push(p);
    }
    let response = await httpPost(mget, elasticEndpoint + "/_mget", "application/json", false, null, null, true, elasticHeaders());
    var resultDocs = (response)["docs"];
    var results = [];
    if (resultDocs != null) {
        for (var i = 0; i < resultDocs.length; i++) {
            var doc = resultDocs[i];
            if ((doc)["found"]) {
                delete (lookup)[((doc)["_id"]).substring(0, ((doc)["_id"]).length - 1)];
                results.push(JSON.parse(((doc)["_source"])["data"]));
            }
        }
    }
    await (filterResults).call(this, results, null);
    ary = EcObject.keys(lookup);
    for (var i = 0; i < ary.length; i++) 
        ary[i] = (lookup)[ary[i]];
    if (ary != null) {
        var me = this;
        let forEachResults = await Promise.all(ary.map(function(hit){return endpointSingleGet.call({ctx:me.ctx,params:{obj:hit}})}));
        for (var i = 0; i < forEachResults.length; i++)
            if (forEachResults[i] != null)
                results.push(forEachResults[i]);
    }
    return JSON.stringify(results);
};
var endpointMultiPutEach = async function() {
    var ld = new EcRemoteLinkedData(null, null);
    var o = this.params.obj;
    ld.copyFrom(o);
    var id = null;
    if (!EcRepository.alwaysTryUrl && repo != null && !repo.constructor.shouldTryUrl(ld.id) && ld.id.indexOf(repo.selectedServer) == -1) 
        id = EcCrypto.md5(ld.shortId());
     else 
        id = ld.getGuid();
    var version = ld.getTimestamp();
    if (isNaN(version)) 
        version = null;
    var type = ld.getDottedType();
    try {
        this.ctx.put("refresh", "false");
        await (skyrepoPutParsed).call(this, o, id, version, type);
        return o;
    }catch (ex) {
        //debug(ex);
    }
    return null;
};
var endpointMultiPut = async function() {
    var ary = JSON.parse(fileToString((fileFromDatastream).call(this, "data", null)));
    var results = new Array();
    if (ary != null) {
        // The following is also in skyrepoPutInternalPermanent. Adding it here avoids trying to create the permanent index for each object in multiput.
        if (permanentCreated != true) {
            var mappings = {};
            var permNoIndex = {};
            var doc = {};
            (mappings)["mappings"] = permNoIndex;
            
            if (elasticSearchVersion().startsWith("7.") || elasticSearchVersion().startsWith("8.")) 
                permNoIndex.enabled = false;
            else
                (permNoIndex)["permanent"] = doc;
            (doc)["enabled"] = false;
            var result = await httpPut(mappings, elasticEndpoint + "/permanent", "application/json", null, true, elasticHeaders());
            if (skyrepoDebug)
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.DEBUG, "SkyrepEndpointMultiput", JSON.stringify(result));
            permanentCreated = true;
        }
        await ((signatureSheet).call(this));
        for (let idx = 0; idx < ary.length; idx+=100) {
            let forEachResults = await Promise.all(ary.slice(idx, idx+100).map((hit)=>{return endpointMultiPutEach.call({ctx:this.ctx,dataStreams:this.dataStreams,params:{obj:hit}})}));
            for (var i = 0; i < forEachResults.length; i++) 
                if (forEachResults[i] != null) 
                    results.push(forEachResults[i]);
        }
    }
    await httpGet(elasticEndpoint + "/_all/_refresh", true, elasticHeaders());
    var ids = [];
    for (var i = 0; i < results.length; i++) {
        var o = results[i];
        ids.push(EcRemoteLinkedData.trimVersionFromUrl((o)["@id"]));
    }
    afterSaveBulk(ids);
    return JSON.stringify(results);
};
var endpointSingleGet = async function() {
    var urlRemainder = this.params.obj;
    var parseParams = (queryParse).call(this, urlRemainder, null);
    var id = (parseParams)["id"];
    var type = (parseParams)["type"];
    var version = (parseParams)["version"];
    var o = await (skyrepoGetParsed).call(this, id, version, type, null, null);
    if (o != null) 
        return o;
    return null;
};
var endpointManyGet = async function(){
    var manyParseParams = [];
    for (let urlRemainder of this.params.objs)
    {
        var parseParams = (queryParse).call(this, urlRemainder, null);
        manyParseParams.push(parseParams);
    }
    if (manyParseParams.length == 0)
        return [];
    var o = await (skyrepoManyGetParsed).call(this, manyParseParams);
    if (o != null) 
        return o;
    return null;
} 
var skyRepoSearch = async function() {
    var q = this.params.q;
    var urlRemainder = this.params.urlRemainder;
    var start = 0;
    if (this.params.start != undefined) 
    if (this.params.start != null) 
        start = parseInt(this.params.start);
    var size = 50;
    if (this.params.size != undefined) 
    if (this.params.size != null) 
        size = parseInt(this.params.size);
    var sort = this.params.sort;
    var track_scores = this.params.track_scores;
    var index_hint = this.params.index_hint;
    var searchParams = JSON.parse(fileToString((fileFromDatastream).call(this, "searchParams", null)));
    if (searchParams != null) {
        if ((searchParams)["q"] != undefined) 
        if ((searchParams)["q"] != null) 
            q = (searchParams)["q"];
        if ((searchParams)["start"] != undefined) 
        if ((searchParams)["start"] != null) 
            start = (searchParams)["start"];
        if ((searchParams)["size"] != undefined) 
        if ((searchParams)["size"] != null) 
            size = (searchParams)["size"];
        if ((searchParams)["sort"] != undefined) 
        if ((searchParams)["sort"] != null) 
            sort = (searchParams)["sort"];
        if ((searchParams)["track_scores"] != undefined) 
        if ((searchParams)["track_scores"] != null) 
            track_scores = (searchParams)["track_scores"];
        if ((searchParams)["index_hint"] != undefined) 
        if ((searchParams)["index_hint"] != null) 
            index_hint = (searchParams)["index_hint"];
    }
    var data = fileToString((fileFromDatastream).call(this, "data", null));
    if (data !== undefined && data != null && data != "") 
        q = data;
    if (q === undefined || q == null || q == "") 
        q = "*";
    return JSON.stringify(await (skyrepoSearch).call(this, q, urlRemainder, start, size, sort, track_scores, index_hint));
};
var endpointSearch = function() {
    return (skyRepoSearch).call(this);
};
var endpointAdmin = function() {
    return JSON.stringify(skyrepoAdminList());
};
var skyrepoAdminPpk = function() {
    if (!fs.existsSync("etc/skyAdmin.pem")) 
        fileSave(EcPpk.fromPem(rsaGenerate()).toPem(), "etc/skyAdmin.pem");
    return fileToString(fileLoad("etc/skyAdmin.pem"));
};
var skyrepoAdminList = function() {
    var array = new Array();
    array.push(skyrepoAdminPpk());
    return array;
};
var pingWithTime = function() {
    var o = {};
    (o)["ping"] = "pong";
    (o)["time"] = new Date().getTime();
    //Securing Proxy: Return public key as part of init.
    if (this.ctx.req.eim != null)
        (o)["ssoPublicKey"] = this.ctx.req.eim.ids[0].ppk.toPk().toPem();
        
    if (this.ctx.req.oidc != null)
    {
       (o)["ssoLogin"] = (process.env.CASS_OIDC_BASE_URL || 'http://localhost/')+"api/login";
       (o)["ssoLogout"] = (process.env.CASS_OIDC_BASE_URL || 'http://localhost/')+"api/logout";
    }
    // Add banner info if set in env vars
    (o)["banner"] = {
        message: process.env.CASS_BANNER_MESSAGE, // string
        color: process.env.CASS_BANNER_TEXT_COLOR, // valid css color value
        background: process.env.CASS_BANNER_BACKGROUND_COLOR // valid css color value
    };
    // Add MOTD info if set in env vars
    (o).motd = {
        title: process.env.MOTD_TITLE,
        message: process.env.MOTD_MESSAGE
    };
    // Add default plugins if set in env vars
    if (process.env.DEFAULT_PLUGINS) {
        (o).plugins = process.env.DEFAULT_PLUGINS;
    }
    return JSON.stringify(o);
};
(function() {
    bindWebService("/ping", pingWithTime);
    bindWebService("/data/*", endpointData);
    bindWebService("/sky/repo/search", skyRepoSearch);
    bindWebService("/sky/repo/multiGet", endpointMultiGet);
    bindWebService("/sky/repo/multiPut", endpointMultiPut);
    bindWebService("/sky/admin", endpointAdmin);
})();