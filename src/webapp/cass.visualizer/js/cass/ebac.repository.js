/**
 *  Represents an encrypted piece of data. Provides helper functions for
 *  encryption/decryption of JSON-LD objects, and provides some searchability of
 *  the data within.
 *  
 *  @author fritz.ray@eduworks.com
 */
var EcEncryptedValue = function() {
    EbacEncryptedValue.call(this);
};
EcEncryptedValue = stjs.extend(EcEncryptedValue, EbacEncryptedValue, [], function(constructor, prototype) {
    constructor.toEncryptedValue = function(d, hideType) {
        var v = new EbacEncryptedValue();
        if (!hideType) 
            v.encryptedType = d.type;
        var newIv = EcAes.newIv(32);
        var newSecret = EcAes.newIv(32);
        v.payload = EcAesCtr.encrypt(d.toJson(), newSecret, newIv);
        v.owner = d.owner;
        if ((d)["name"] != null) 
            v.name = (d)["name"];
        for (var i = 0; i < d.owner.length; i++) {
            var eSecret = new EbacEncryptedSecret();
            eSecret.iv = newIv;
            eSecret.secret = newSecret;
            if (v.secret == null) 
                v.secret = new Array();
            v.secret.push(EcRsaOaep.encrypt(EcPk.fromPem(d.owner[i]), eSecret.toEncryptableJson()));
        }
        return v;
    };
    constructor.encryptValue = function(text, id, fieldName, owner) {
        var v = new EbacEncryptedValue();
        var newIv = EcAes.newIv(32);
        var newSecret = EcAes.newIv(32);
        v.payload = EcAesCtr.encrypt(text, newSecret, newIv);
        v.addOwner(owner);
        for (var i = 0; i < v.owner.length; i++) {
            var eSecret = new EbacEncryptedSecret();
            eSecret.id = forge.util.encode64(forge.pkcs5.pbkdf2(id, "", 1, 8));
            eSecret.iv = newIv;
            eSecret.secret = newSecret;
            if (v.secret == null) 
                v.secret = new Array();
            v.secret.push(EcRsaOaep.encrypt(EcPk.fromPem(v.owner[i]), eSecret.toEncryptableJson()));
        }
        return v;
    };
    prototype.decryptIntoObject = function() {
        var d = null;
        if (this.owner != null) 
            for (var i = 0; i < this.owner.length; i++) {
                var decryptionKey = EcIdentityManager.getPpk(EcPk.fromPem(this.owner[i]));
                if (decryptionKey == null) 
                    continue;
                var decrypted = this.decryptToObject(decryptionKey);
                if (decrypted != null) 
                    return decrypted;
            }
        if (this.reader != null) 
            for (var i = 0; i < this.reader.length; i++) {
                var decryptionKey = EcIdentityManager.getPpk(EcPk.fromPem(this.reader[i]));
                if (decryptionKey == null) 
                    continue;
                var decrypted = this.decryptToObject(decryptionKey);
                if (decrypted != null) 
                    return decrypted;
            }
        for (var i = 0; i < EcIdentityManager.ids.length; i++) {
            var decryptionKey = EcIdentityManager.ids[i].ppk;
            var decrypted = this.decryptToObject(decryptionKey);
            if (decrypted != null) 
                return decrypted;
        }
        return null;
    };
    prototype.decryptIntoString = function() {
        var d = null;
        if (this.owner != null) 
            for (var i = 0; i < this.owner.length; i++) {
                var decryptionKey = EcIdentityManager.getPpk(EcPk.fromPem(this.owner[i]));
                if (decryptionKey == null) 
                    continue;
                var decrypted = this.decryptRaw(decryptionKey);
                if (decrypted != null) 
                    return decrypted;
            }
        if (this.reader != null) 
            for (var i = 0; i < this.reader.length; i++) {
                var decryptionKey = EcIdentityManager.getPpk(EcPk.fromPem(this.reader[i]));
                if (decryptionKey == null) 
                    continue;
                var decrypted = this.decryptRaw(decryptionKey);
                if (decrypted != null) 
                    return decrypted;
            }
        for (var i = 0; i < EcIdentityManager.ids.length; i++) {
            var decryptionKey = EcIdentityManager.ids[i].ppk;
            var decrypted = this.decryptRaw(decryptionKey);
            if (decrypted != null) 
                return decrypted;
        }
        return null;
    };
    prototype.decryptRaw = function(decryptionKey) {
        for (var j = 0; j < this.secret.length; j++) {
            var decryptedSecret = null;
            decryptedSecret = EcRsaOaep.decrypt(decryptionKey, this.secret[j]);
            if (!EcLinkedData.isProbablyJson(decryptedSecret)) 
                continue;
            var secret = EbacEncryptedSecret.fromEncryptableJson(JSON.parse(decryptedSecret));
            return EcAesCtr.decrypt(this.payload, secret.secret, secret.iv);
        }
        return null;
    };
    prototype.decryptToObject = function(decryptionKey) {
        for (var j = 0; j < this.secret.length; j++) {
            var decryptRaw = this.decryptRaw(decryptionKey);
            if (decryptRaw == null) 
                continue;
            if (!EcLinkedData.isProbablyJson(decryptRaw)) 
                continue;
            var decrypted = new EcRemoteLinkedData("", "");
            decrypted.copyFrom(JSON.parse(decryptRaw));
            return decrypted.deAtify();
        }
        return null;
    };
}, {secret: {name: "Array", arguments: [null]}, owner: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
var EcRepository = function() {};
EcRepository = stjs.extend(EcRepository, null, [], function(constructor, prototype) {
    prototype.selectedServer = null;
    constructor.caching = false;
    constructor.cache = new Object();
    /**
     *  Gets a JSON-LD object from the place designated by the URI.
     *  
     *  Uses a signature sheet gathered from {@link EcIdentityManager}.
     *  
     *  @param url
     *             URL of the remote object.
     *  @param success
     *             Event to call upon successful retrieval.
     *  @param failure
     *             Event to call upon spectacular failure.
     */
    constructor.get = function(url, success, failure) {
        if (EcRepository.caching) 
            if ((EcRepository.cache)[url] != null) {
                success((EcRepository.cache)[url]);
                return;
            }
        var fd = new FormData();
        fd.append("signatureSheet", EcIdentityManager.signatureSheet(60000, url));
        EcRemote.postExpectingObject(url, null, fd, function(p1) {
            var d = new EcRemoteLinkedData("", "");
            d.copyFrom(p1);
            if (EcRepository.caching) 
                (EcRepository.cache)[url] = d;
            success(d);
        }, failure);
    };
    /**
     *  Search a repository for JSON-LD compatible data.
     *  
     *  Uses a signature sheet gathered from {@link EcIdentityManager}.
     *  
     *  @param query
     *             ElasticSearch compatible query string, similar to Google query
     *             strings.
     *  @param eachSuccess
     *             Success event for each found object.
     *  @param success
     *             Success event, called after eachSuccess.
     *  @param failure
     *             Failure event.
     */
    prototype.search = function(query, eachSuccess, success, failure) {
        var fd = new FormData();
        fd.append("data", query);
        fd.append("signatureSheet", EcIdentityManager.signatureSheet(60000, this.selectedServer));
        EcRemote.postExpectingObject(this.selectedServer, "sky/repo/search", fd, function(p1) {
            var results = p1;
            for (var i = 0; i < results.length; i++) {
                var d = new EcRemoteLinkedData(null, null);
                d.copyFrom(results[i]);
                results[i] = d;
                if (eachSuccess != null) 
                    eachSuccess(results[i]);
            }
            if (success != null) 
                success(results);
        }, failure);
    };
    /**
     *  Search a repository for JSON-LD compatible data.
     *  
     *  Uses a signature sheet gathered from {@link EcIdentityManager}.
     *  
     *  @param query
     *             ElasticSearch compatible query string, similar to Google query
     *             strings.
     *  @param eachSuccess
     *             Success event for each found object.
     *  @param success
     *             Success event, called after eachSuccess.
     *  @param failure
     *             Failure event.
     */
    prototype.searchWithParams = function(query, params, eachSuccess, success, failure) {
        var fd = new FormData();
        fd.append("data", query);
        if (params != null) 
            fd.append("searchParams", JSON.stringify(params));
        fd.append("signatureSheet", EcIdentityManager.signatureSheet(60000, this.selectedServer));
        EcRemote.postExpectingObject(this.selectedServer, "sky/repo/search", fd, function(p1) {
            var results = p1;
            for (var i = 0; i < results.length; i++) {
                var d = new EcRemoteLinkedData(null, null);
                d.copyFrom(results[i]);
                results[i] = d;
                if (eachSuccess != null) 
                    eachSuccess(results[i]);
            }
            if (success != null) 
                success(results);
        }, failure);
    };
    constructor.escapeSearch = function(query) {
        var s = null;
        s = (query.split("\\")).join("\\\\");
        s = (s.split("-")).join("\\-");
        s = (s.split("=")).join("\\=");
        s = (s.split("&&")).join("\\&&");
        s = (s.split("||")).join("\\||");
        s = (s.split("<")).join("\\<");
        s = (s.split(">")).join("\\>");
        s = (s.split("|")).join("\\|");
        s = (s.split("(")).join("\\(");
        s = (s.split(")")).join("\\)");
        s = (s.split("{")).join("\\{");
        s = (s.split("}")).join("\\}");
        s = (s.split("[")).join("\\[");
        s = (s.split("]")).join("\\]");
        s = (s.split("^")).join("\\^");
        s = (s.split("\"")).join("\\\"");
        s = (s.split("~")).join("\\~");
        s = (s.split("*")).join("\\*");
        s = (s.split("?")).join("\\?");
        s = (s.split(":")).join("\\:");
        s = (s.split("/")).join("\\/");
        s = (s.split("+")).join("\\+");
        return s;
    };
    /**
     *  Attempts to save a piece of data.
     *  
     *  Uses a signature sheet informed by the owner field of the data.
     *  
     *  @param data
     *             Data to save to the location designated by its id.
     *  @param success
     *  @param failure
     */
    constructor.save = function(data, success, failure) {
        if (EcRepository.caching) {
            delete (EcRepository.cache)[data.id];
            delete (EcRepository.cache)[data.shortId()];
        }
        if (data.invalid()) {
            failure("Data is malformed.");
            return;
        }
        EcIdentityManager.sign(data);
        data.updateTimestamp();
        var fd = new FormData();
        fd.append("data", data.toJson());
        fd.append("signatureSheet", EcIdentityManager.signatureSheetFor(data.owner, 60000, data.id));
        EcRemote.postExpectingString(data.id, "", fd, success, failure);
    };
    /**
     *  Attempts to delete a piece of data.
     *  
     *  Uses a signature sheet informed by the owner field of the data.
     *  
     *  @param data
     *             Data to save to the location designated by its id.
     *  @param success
     *  @param failure
     */
    constructor._delete = function(data, success, failure) {
        if (EcRepository.caching) {
            delete (EcRepository.cache)[data.id];
            delete (EcRepository.cache)[data.shortId()];
        }
        EcRemote._delete(data.id, EcIdentityManager.signatureSheetFor(data.owner, 60000, data.id), success, failure);
    };
    constructor.sign = function(data, pen) {
        data.signature.push(EcRsaOaep.sign(pen, data.toSignableJson()));
    };
}, {cache: "Object"}, {});
