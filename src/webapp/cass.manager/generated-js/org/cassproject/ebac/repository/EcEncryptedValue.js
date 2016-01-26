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
