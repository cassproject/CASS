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
        if (this.readers != null) 
            for (var i = 0; i < this.readers.length; i++) {
                var decryptionKey = EcIdentityManager.getPpk(EcPk.fromPem(this.readers[i]));
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
        if (this.readers != null) 
            for (var i = 0; i < this.readers.length; i++) {
                var decryptionKey = EcIdentityManager.getPpk(EcPk.fromPem(this.readers[i]));
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
}, {secret: {name: "Array", arguments: [null]}, owner: {name: "Array", arguments: [null]}, readers: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
var EcRepository = function() {};
EcRepository = stjs.extend(EcRepository, null, [], function(constructor, prototype) {
    prototype.selectedServer = null;
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
        var fd = new FormData();
        fd.append("signatureSheet", EcIdentityManager.signatureSheet(10000, url));
        EcRemote.postExpectingObject(url, null, fd, function(p1) {
            var d = new EcRemoteLinkedData("", "");
            d.copyFrom(p1);
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
        fd.append("signatureSheet", EcIdentityManager.signatureSheet(10000, this.selectedServer));
        EcRemote.postExpectingObject(this.selectedServer, "sky/repo/search", fd, function(p1) {
            var results = p1;
            if (eachSuccess != null) 
                for (var i = 0; i < results.length; i++) 
                    eachSuccess(results[i]);
            if (success != null) 
                success(results);
        }, failure);
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
    prototype.save = function(data, success, failure) {
        if (data.id == null) 
             throw new RuntimeException("Cannot save data that has no ID.");
        var fd = new FormData();
        fd.append("data", data.toJson());
        fd.append("signatureSheet", EcIdentityManager.signatureSheetFor(data.owner, 10000, data.id));
        EcRemote.postExpectingString(data.id, "", fd, success, failure);
    };
    prototype.update = function(data, success, failure) {
        EcRepository.get(data.id, success, failure);
    };
    prototype.sign = function(data, pen) {
        data.signature.push(EcRsaOaep.sign(pen, data.toSignableJson()));
    };
}, {}, {});
