/**
 *  Represents an encrypted piece of data. Provides helper functions for
 *  encryption/decryption of JSON-LD objects, and provides some searchability of
 *  the data within.
 * 
 *  @author fritz.ray@eduworks.com
 *  @module com.eduworks.ec
 *  @class EcEncryptedValue
 *  @extends EbacEncryptedValue
 */
var EcEncryptedValue = function() {
    EbacEncryptedValue.call(this);
};
EcEncryptedValue = stjs.extend(EcEncryptedValue, EbacEncryptedValue, [], function(constructor, prototype) {
    constructor.encryptOnSaveMap = null;
    constructor.revive = function(partiallyRehydratedObject) {
        if (partiallyRehydratedObject == null) 
            return null;
        var v = new EcEncryptedValue();
        v.copyFrom(partiallyRehydratedObject);
        return v;
    };
    /**
     *  Converts a piece of (likely) encrypted remote linked data to an unencrypted object.
     *  @param d Data to decrypt
     *  @return Decrypted data
     *  @memberOf EcEncryptedValue
     *  @static
     *  @method fromEncryptedValue
     */
    constructor.fromEncryptedValue = function(d) {
        if (!d.isAny(new EcEncryptedValue().getTypes())) 
            return d;
        var eev = new EcEncryptedValue();
        eev.copyFrom(d);
        EcEncryptedValue.encryptOnSave(d.id, true);
        EcEncryptedValue.encryptOnSave(d.shortId(), true);
        return eev.decryptIntoObject();
    };
    /**
     *  Converts a piece of (likely) encrypted remote linked data to an unencrypted object.
     *  @param {EcRemoteLinkedData} d Data to decrypt
     *  @param {Callback1<EcRemoteLinkedData>} success
     *  @param {Callback1<String>} failure
     *  @param d Data to decrypt
     *  @return Decrypted data
     *  @memberOf EcEncryptedValue
     *  @static
     *  @method fromEncryptedValue
     */
    constructor.fromEncryptedValueAsync = function(d, success, failure) {
        if (!d.isAny(new EcEncryptedValue().getTypes())) 
            success(d);
         else {
            var eev = new EcEncryptedValue();
            eev.copyFrom(d);
            EcEncryptedValue.encryptOnSave(d.id, true);
            EcEncryptedValue.encryptOnSave(d.shortId(), true);
            eev.decryptIntoObjectAsync(success, failure);
        }
    };
    /**
     *  Converts a piece of remote linked data to an encrypted value
     * 
     *  @param {EcRemoteLinkedData} d Data to encrypt
     *  @param {Boolean}            hideType Flag to hide the type of the encrypted value
     *                              when encrypting
     *  @return {EcEncryptedValue} Encrypted value
     *  @memberOf EcEncryptedValue
     *  @method toEncryptedValue
     *  @static
     */
    constructor.toEncryptedValue = function(d, hideType) {
        d.updateTimestamp();
        var v = new EcEncryptedValue();
        if (hideType == null || !hideType) {
            v.encryptedType = d.type;
        }
        var newIv = EcAes.newIv(16);
        var newSecret = EcAes.newIv(16);
        var conceptName = (d)["skos:prefLabel"];
        var conceptSchemeName = (d)["dcterms:title"];
        v.payload = EcAesCtr.encrypt(d.toJson(), newSecret, newIv);
        v.owner = d.owner;
        v.reader = d.reader;
        v.id = d.id;
        if ((d)["name"] != null) {
            v.name = (d)["name"];
        }
        if (d.owner != null) {
            for (var i = 0; i < d.owner.length; i++) {
                var eSecret = new EbacEncryptedSecret();
                eSecret.iv = newIv;
                eSecret.secret = newSecret;
                if (v.secret == null) {
                    v.secret = new Array();
                }
                v.secret.push(EcRsaOaep.encrypt(EcPk.fromPem(d.owner[i]), eSecret.toEncryptableJson()));
            }
        }
        if (d.reader != null) {
            for (var i = 0; i < d.reader.length; i++) {
                var eSecret = new EbacEncryptedSecret();
                eSecret.iv = newIv;
                eSecret.secret = newSecret;
                if (v.secret == null) {
                    v.secret = new Array();
                }
                v.secret.push(EcRsaOaep.encrypt(EcPk.fromPem(d.reader[i]), eSecret.toEncryptableJson()));
            }
        }
        if (conceptName != null) {
            (v)["skos:prefLabel"] = conceptName;
        }
        if (conceptSchemeName != null) {
            (v)["dcterms:title"] = conceptSchemeName;
        }
        return v;
    };
    /**
     *  Converts a piece of remote linked data to an encrypted value,
     *  asynchronously
     * 
     *  @param {EcRemoteLinkedData}          d Data to encrypt
     *  @param {boolean}                     hideType Flag to hide the type of the encrypted value
     *                                       when encrypting
     *  @param {Callback1<EcEncryptedValue>} success Callback triggered with
     *                                       successfully encrypted, returns the encrypted value
     *  @param {Callback1<String>}           failure Callback triggered on error during
     *                                       encryption
     *  @memberOf EcEncryptedValue
     *  @method toEncryptedValueAsync
     *  @static
     */
    constructor.toEncryptedValueAsync = function(d, hideType, success, failure) {
        d.updateTimestamp();
        var v = new EcEncryptedValue();
        if (hideType == null || !hideType) {
            v.encryptedType = d.type;
        }
        var newIv = EcAes.newIv(16);
        var newSecret = EcAes.newIv(16);
        EcAesCtrAsync.encrypt(d.toJson(), newSecret, newIv, function(encryptedText) {
            v.payload = encryptedText;
            v.owner = d.owner;
            v.reader = d.reader;
            v.id = d.id;
            if ((d)["name"] != null) {
                v.name = (d)["name"];
            }
            if (d.owner != null) {
                new EcAsyncHelper().each(d.owner, function(pk, arg1) {
                    EcEncryptedValue.insertSecret(pk, arg1, newIv, newSecret, v, failure);
                }, function(arg0) {
                    if (d.reader != null) {
                        new EcAsyncHelper().each(d.reader, function(pk, arg1) {
                            EcEncryptedValue.insertSecret(pk, arg1, newIv, newSecret, v, failure);
                        }, function(arg0) {
                            success(v);
                        });
                    } else 
                        success(v);
                });
            }
        }, failure);
    };
    constructor.insertSecret = function(pk, success, newIv, newSecret, v, failure) {
        var eSecret = new EbacEncryptedSecret();
        eSecret.iv = newIv;
        eSecret.secret = newSecret;
        if (v.secret == null) {
            v.secret = new Array();
        }
        EcRsaOaepAsync.encrypt(EcPk.fromPem(pk), eSecret.toEncryptableJson(), function(encryptedSecret) {
            v.secret.push(encryptedSecret);
            success();
        }, failure);
    };
    /**
     *  Encrypts a text value with the key provided
     * 
     *  @param {String} text Text to encrypt
     *  @param {String} id ID of the encrypted value
     *  @param {EcPk}   owner Key to Encrypt
     *  @return {EcEncryptedValue} Encrypted value
     *  @memberOf EcEncryptedValue
     *  @method encryptValueOld
     *  @static
     *  @deprecated
     */
    constructor.encryptValueOld = function(text, id, owner) {
        var v = new EcEncryptedValue();
        var newIv = EcAes.newIv(16);
        var newSecret = EcAes.newIv(16);
        v.payload = EcAesCtr.encrypt(text, newSecret, newIv);
        v.addOwner(owner);
        for (var i = 0; i < v.owner.length; i++) {
            var eSecret = new EbacEncryptedSecret();
            eSecret.id = forge.util.encode64(forge.pkcs5.pbkdf2(id, "", 1, 8));
            eSecret.iv = newIv;
            eSecret.secret = newSecret;
            if (v.secret == null) {
                v.secret = new Array();
            }
            v.secret.push(EcRsaOaep.encrypt(EcPk.fromPem(v.owner[i]), eSecret.toEncryptableJson()));
        }
        return v;
    };
    /**
     *  Encrypts a text value with the owners and readers provided
     * 
     *  @param {String}   text Text to encrypt
     *  @param {String}   id ID of the value to encrypt
     *  @param {String[]} owners Owner keys to encrypt value with
     *  @param {String[]} readers Reader keys to encrypt value with
     *  @return {EcEncryptedValue} Encrypted value
     *  @memberOf EcEncryptedValue
     *  @method encryptValue
     *  @static
     */
    constructor.encryptValue = function(text, id, owners, readers) {
        var v = new EcEncryptedValue();
        var newIv = EcAes.newIv(16);
        var newSecret = EcAes.newIv(16);
        v.payload = EcAesCtr.encrypt(text, newSecret, newIv);
        if (owners != null) {
            for (var i = 0; i < owners.length; i++) {
                v.addOwner(EcPk.fromPem(owners[i]));
            }
        }
        if (owners != null) 
            if (v.owner != null) {
                for (var i = 0; i < v.owner.length; i++) {
                    var eSecret = new EbacEncryptedSecret();
                    eSecret.id = forge.util.encode64(forge.pkcs5.pbkdf2(id, "", 1, 8));
                    eSecret.iv = newIv;
                    eSecret.secret = newSecret;
                    if (v.secret == null) {
                        v.secret = new Array();
                    }
                    v.secret.push(EcRsaOaep.encrypt(EcPk.fromPem(v.owner[i]), eSecret.toEncryptableJson()));
                }
            }
        if (readers != null) 
            if (v.reader != null) {
                for (var i = 0; i < v.reader.length; i++) {
                    var eSecret = new EbacEncryptedSecret();
                    eSecret.id = forge.util.encode64(forge.pkcs5.pbkdf2(id, "", 1, 8));
                    eSecret.iv = newIv;
                    eSecret.secret = newSecret;
                    if (v.secret == null) {
                        v.secret = new Array();
                    }
                    v.secret.push(EcRsaOaep.encrypt(EcPk.fromPem(v.reader[i]), eSecret.toEncryptableJson()));
                }
            }
        if (readers != null) {
            for (var i = 0; i < readers.length; i++) {
                v.addReader(EcPk.fromPem(readers[i]));
            }
        }
        return v;
    };
    /**
     *  Encrypts a text value with the owners and readers provided
     * 
     *  @param {String}   text Text to encrypt
     *  @param {String}   id ID of the value to encrypt
     *  @param {String[]} owners Owner keys to encrypt value with
     *  @param {String[]} readers Reader keys to encrypt value with
     *  @return {EcEncryptedValue} Encrypted value
     *  @memberOf EcEncryptedValue
     *  @method encryptValue
     *  @static
     */
    constructor.encryptValueAsync = function(text, id, owners, readers, success, failure) {
        var v = new EcEncryptedValue();
        var newIv = EcAes.newIv(16);
        var newSecret = EcAes.newIv(16);
        v.payload = EcAesCtr.encrypt(text, newSecret, newIv);
        if (owners != null) {
            for (var i = 0; i < owners.length; i++) {
                v.addOwner(EcPk.fromPem(owners[i]));
            }
        }
        if (readers != null) {
            for (var i = 0; i < readers.length; i++) {
                v.addReaderBasic(EcPk.fromPem(readers[i]));
            }
        }
        var pks = new Array();
        if (owners != null) 
            if (v.owner != null) 
                pks = pks.concat(v.owner);
        if (readers != null) 
            if (v.reader != null) 
                pks = pks.concat(v.reader);
        new EcAsyncHelper().each(pks, function(pk, callback0) {
            var eSecret = new EbacEncryptedSecret();
            eSecret.id = forge.util.encode64(forge.pkcs5.pbkdf2(id, "", 1, 8));
            eSecret.iv = newIv;
            eSecret.secret = newSecret;
            if (v.secret == null) {
                v.secret = new Array();
            }
            EcRsaOaepAsync.encrypt(EcPk.fromPem(pk), eSecret.toEncryptableJson(), function(s) {
                v.secret.push(s);
                callback0();
            }, callback0);
        }, function(pks) {
            success(v);
        });
    };
    /**
     *  Encrypt a value with a specific IV and secret
     * 
     *  @param {String}   iv Initialization Vector for encryption
     *  @param {String}   secret Encryption secret
     *  @param {String}   text Text to encrypt
     *  @param {String}   id ID of value to encrypt
     *  @param {String[]} owners Owners keys to encrypt with
     *  @param {String[]} readers Reader Keys to encrypt with
     *  @return {EcEncryptedValue}
     *  @memberOf EcEncryptedValue
     *  @method encryptValueUsingIvAndSecret
     *  @static
     */
    constructor.encryptValueUsingIvAndSecret = function(iv, secret, text, id, owners, readers) {
        var v = new EcEncryptedValue();
        v.payload = EcAesCtr.encrypt(text, secret, iv);
        if (owners != null) {
            for (var i = 0; i < owners.length; i++) {
                v.addOwner(EcPk.fromPem(owners[i]));
            }
        }
        if (owners != null) {
            for (var i = 0; i < v.owner.length; i++) {
                var eSecret = new EbacEncryptedSecret();
                eSecret.id = forge.util.encode64(forge.pkcs5.pbkdf2(id, "", 1, 8));
                eSecret.iv = iv;
                eSecret.secret = secret;
                if (v.secret == null) {
                    v.secret = new Array();
                }
                v.secret.push(EcRsaOaep.encrypt(EcPk.fromPem(v.owner[i]), eSecret.toEncryptableJson()));
            }
        }
        if (readers != null) {
            for (var i = 0; i < readers.length; i++) {
                v.addReader(EcPk.fromPem(readers[i]));
            }
        }
        return v;
    };
    /**
     *  Setter and getter function for encryptOnSave of an identifier,
     *  encryptOnSave is used by the static save functions of a class to
     *  determine whether or not to encrypt something when it is saved. This
     *  value is usually set when an object is decrypted using one of the decrypt
     *  functions above.
     * 
     *  @param {String}  id ID of the data to get/set encryptOnSave for
     *  @param {boolean} [val] If passed in, sets the value, if null this
     *                   function gets the encryptOnSave value
     *  @return {boolean} if val is null/ignored returns value in the map, if val
     *  is passed in returns val
     *  @memberOf EcEncryptedValue
     *  @method encryptOnSave
     *  @static
     */
    constructor.encryptOnSave = function(id, val) {
        if (EcEncryptedValue.encryptOnSaveMap == null) {
            EcEncryptedValue.encryptOnSaveMap = {};
        }
        if (val == null) {
            if (EcEncryptedValue.encryptOnSaveMap[id] != null) {
                return EcEncryptedValue.encryptOnSaveMap[id];
            } else {
                return false;
            }
        } else {
            EcEncryptedValue.encryptOnSaveMap[id] = val;
            return val;
        }
    };
    /**
     *  Decrypts this encrypted value into an object
     * 
     *  @return The Decrypted Object
     *  @memberOf EcEncryptedValue
     *  @method decryptIntoObject
     */
    prototype.decryptIntoObject = function() {
        var decryptRaw = this.decryptIntoString();
        if (decryptRaw == null) {
            return null;
        }
        if (!EcLinkedData.isProbablyJson(decryptRaw)) {
            return null;
        }
        var decrypted = new EcRemoteLinkedData("", "");
        decrypted.copyFrom(JSON.parse(decryptRaw));
        EcEncryptedValue.encryptOnSave(decrypted.id, true);
        decrypted.id = this.id;
        return decrypted.deAtify();
    };
    /**
     *  Asynchronously decrypts this encrypted value into an object
     * 
     *  @param {Callback1<EcRemoteLinkedDat>} success Callback triggered on
     *                                        successful encryption, returns the decrypted object
     *  @param {Callback1<String>}            failure Callback triggered if error during
     *                                        encryption
     *  @memberOf EcEncryptedValue
     *  @method decryptIntoObjectAsync
     */
    prototype.decryptIntoObjectAsync = function(success, failure) {
        var id = this.id;
        this.decryptIntoStringAsync(function(decryptRaw) {
            if (decryptRaw == null) {
                failure("Could not decrypt data.");
            }
            if (!EcLinkedData.isProbablyJson(decryptRaw)) {
                failure("Could not decrypt data.");
            }
            var decrypted = new EcRemoteLinkedData("", "");
            decrypted.copyFrom(JSON.parse(decryptRaw));
            EcEncryptedValue.encryptOnSave(decrypted.id, true);
            decrypted.id = id;
            success(decrypted.deAtify());
        }, failure);
    };
    /**
     *  Asynchronously decrypts this encrypted value into an object with a IV and
     *  secret provided
     * 
     *  @param {String}                        iv Initialization Vector for decryption
     *  @param {String}                        secret Secret for decryption
     *  @param {Callback1<EcRemoteLinkedData>} success Callback triggered after
     *                                         successful decryption
     *  @param {Callback1<String>}             failure Callback triggered if error during
     *                                         decryption
     *  @memberOf EcEncryptedValue
     *  @method decryptIntoObjectUsingIvAndSecretAsync
     */
    prototype.decryptIntoObjectUsingIvAndSecretAsync = function(iv, secret, success, failure) {
        this.decryptIntoStringUsingIvAndSecretAsync(iv, secret, function(decryptRaw) {
            if (decryptRaw == null) {
                failure("Could not decrypt data.");
            }
            if (!EcLinkedData.isProbablyJson(decryptRaw)) {
                failure("Could not decrypt data.");
            }
            var decrypted = new EcRemoteLinkedData("", "");
            decrypted.copyFrom(JSON.parse(decryptRaw));
            EcEncryptedValue.encryptOnSave(decrypted.id, true);
            success(decrypted.deAtify());
        }, failure);
    };
    /**
     *  Decrypts an encrypted value into a string
     * 
     *  @return {String} Decrypted string value
     *  @memberOf EcEncryptedValue
     *  @method decryptIntoString
     */
    prototype.decryptIntoString = function() {
        var decryptSecret = this.decryptSecret();
        if (decryptSecret != null) {
            return EcAesCtr.decrypt(this.payload, decryptSecret.secret, decryptSecret.iv);
        }
        return null;
    };
    /**
     *  Decrypts an encrypted value into a string using an alternative secret.
     * 
     *  @return {String} Decrypted string value
     *  @memberOf EcEncryptedValue
     *  @method decryptIntoString
     */
    prototype.decryptIntoStringUsingSecret = function(decryptSecret) {
        if (decryptSecret != null) {
            return EcAesCtr.decrypt(this.payload, decryptSecret.secret, decryptSecret.iv);
        }
        return null;
    };
    /**
     *  Asynchronously decrypts an encrypted value into a string
     * 
     *  @param {Callback1<String>} success Callback triggered after successfully
     *                             decrypted, returns decrypted string
     *  @param {Callback1<String>} failure Callback triggered if error during
     *                             decryption
     *  @memberOf EcEncryptedValue
     *  @method decryptIntoStringAsync
     */
    prototype.decryptIntoStringAsync = function(success, failure) {
        var me = this;
        this.decryptSecretAsync(function(decryptSecret) {
            if (decryptSecret != null) {
                if (me.context == Ebac.context_0_2 || me.context == Ebac.context_0_3) {
                    if (base64.decode(decryptSecret.iv).byteLength == 32) 
                        decryptSecret.iv = base64.encode(base64.decode(decryptSecret.iv).slice(0, 16));
                }
                EcAesCtrAsync.decrypt(me.payload, decryptSecret.secret, decryptSecret.iv, success, failure);
            }
        }, failure);
    };
    /**
     *  Asynchronously decrypts an encrypted value into a string
     * 
     *  @param {Callback1<String>} success Callback triggered after successfully
     *                             decrypted, returns decrypted string
     *  @param {Callback1<String>} failure Callback triggered if error during
     *                             decryption
     *  @memberOf EcEncryptedValue
     *  @method decryptIntoStringAsync
     */
    prototype.decryptIntoStringUsingSecretAsync = function(decryptSecret, success, failure) {
        var me = this;
        if (decryptSecret != null) {
            if (me.context == Ebac.context_0_2 || me.context == Ebac.context_0_3) {
                if (base64.decode(decryptSecret.iv).byteLength == 32) 
                    decryptSecret.iv = base64.encode(base64.decode(decryptSecret.iv).slice(0, 16));
            }
            EcAesCtrAsync.decrypt(me.payload, decryptSecret.secret, decryptSecret.iv, success, failure);
        }
    };
    /**
     *  Asynchronously decrypts an encrypted value into a string with an IV and
     *  secrete provided
     * 
     *  @param {String}            iv Initialization Vector for decryption
     *  @param {String}            secret Secret for decryption
     *  @param {Callback1<String>} success Callback triggered on successful
     *                             decryption
     *  @param {Callback1<String>} failure Callback triggered if error during
     *                             decryption
     *  @memberOf EcEncryptedValue
     *  @method decryptIntoStringUsingIvAndSecretAsync
     */
    prototype.decryptIntoStringUsingIvAndSecretAsync = function(iv, secret, success, failure) {
        if (this.context == Ebac.context_0_2 || this.context == Ebac.context_0_3) {
            if (base64.decode(iv).byteLength == 32) 
                iv = base64.encode(base64.decode(iv).slice(0, 16));
        }
        EcAesCtrAsync.decrypt(this.payload, secret, iv, success, failure);
    };
    /**
     *  Attempts to decrypt the secret by using all Identities in the Identity
     *  Manager
     * 
     *  @return {EbacEncryptedSecret} Secret after decrypted
     *  @memberOf EcEncryptedValue
     *  @method decryptSecret
     */
    prototype.decryptSecret = function() {
        var candidateIndex = 0;
        if (this.owner != null) {
            for (var i = 0; i < this.owner.length; i++) {
                var decryptionKey = EcIdentityManager.getPpk(EcPk.fromPem(this.owner[i]));
                if (decryptionKey == null) {
                    candidateIndex++;
                    continue;
                }
                var decrypted = this.decryptSecretByKey(decryptionKey, candidateIndex);
                if (decrypted != null) {
                    return decrypted;
                }
            }
        }
        if (this.reader != null) {
            for (var i = 0; i < this.reader.length; i++) {
                var decryptionKey = EcIdentityManager.getPpk(EcPk.fromPem(this.reader[i]));
                if (decryptionKey == null) {
                    candidateIndex++;
                    continue;
                }
                var decrypted = this.decryptSecretByKey(decryptionKey, candidateIndex);
                if (decrypted != null) {
                    return decrypted;
                }
            }
        }
        for (var i = 0; i < EcIdentityManager.ids.length; i++) {
            var decryptionKey = EcIdentityManager.ids[i].ppk;
            var decrypted = this.decryptSecretByKey(decryptionKey, -1);
            if (decrypted != null) {
                return decrypted;
            }
        }
        return null;
    };
    /**
     *  Attempts to decrypt secret with a specific key
     * 
     *  @param {EcPpk} decryptionKey Key to attempt secret decryption
     *  @return {EbacEncryptedSecret} Decrypted Secret
     *  @memberOf EcEncryptedValue
     *  @method decryptSecretByKey
     */
    prototype.decryptSecretByKey = function(decryptionKey, tryThisIndexFirst) {
        var encryptedSecret = null;
        if (this.secret != null) {
            if (tryThisIndexFirst >= 0) 
                try {
                    encryptedSecret = this.tryDecryptSecretByKeyAndIndex(decryptionKey, tryThisIndexFirst);
                    if (encryptedSecret != null) 
                        return encryptedSecret;
                }catch (ex) {}
            for (var j = 0; j < this.secret.length; j++) {
                if (tryThisIndexFirst < 0 || j != tryThisIndexFirst) 
                    try {
                        encryptedSecret = this.tryDecryptSecretByKeyAndIndex(decryptionKey, j);
                    }catch (ex) {}
                if (encryptedSecret != null) 
                    return encryptedSecret;
            }
        }
        return null;
    };
    /**
     *  Asynchronously attempts to decrypt secret using all identities in
     *  Identity Manager
     * 
     *  @param {Callback1<EbacEncryptedSecret>} success Callback triggered after
     *                                          successfully decrypting secret, returns the decrypted secret
     *  @param {Callback1<String>}              failure Callback triggered if error decrypting
     *                                          secret
     *  @memberOf EcEncryptedValue
     *  @method decryptSecretAsync
     */
    prototype.decryptSecretAsync = function(success, failure) {
        var ppks = new Array();
        var estimatedIndices = new Array();
        if (this.owner != null) {
            for (var i = 0; i < this.owner.length; i++) {
                var decryptionKey = EcIdentityManager.getPpk(EcPk.fromPem(this.owner[i]));
                if (decryptionKey != null) {
                    if (!decryptionKey.inArray(ppks)) {
                        ppks.push(decryptionKey);
                        estimatedIndices.push(i);
                    }
                }
            }
        }
        if (this.reader != null) {
            for (var i = 0; i < this.reader.length; i++) {
                var decryptionKey = EcIdentityManager.getPpk(EcPk.fromPem(this.reader[i]));
                if (decryptionKey != null) {
                    if (!decryptionKey.inArray(ppks)) {
                        ppks.push(decryptionKey);
                        estimatedIndices.push(i + this.owner.length);
                    }
                }
            }
        }
        var me = this;
        var helper = new EcAsyncHelper();
        helper.each(ppks, function(decryptionKey, countdown) {
            var estimatedIndex = -1;
            for (var i = 0; i < ppks.length; i++) 
                if (ppks[i].equals(decryptionKey)) 
                    estimatedIndex = estimatedIndices[i];
            me.decryptSecretByKeyAsync(decryptionKey, estimatedIndex, function(p1) {
                if (helper.counter == -1) {
                    countdown();
                    return;
                }
                helper.stop();
                success(p1);
                countdown();
            }, function(arg0) {
                countdown();
            });
        }, function(arg0) {
            failure("Could not decrypt secret.");
        });
    };
    prototype.tryDecryptSecretByKeyAndIndex = function(decryptionKey, j) {
        var decryptedSecret = null;
        decryptedSecret = EcRsaOaep.decrypt(decryptionKey, this.secret[j]);
        if (EcLinkedData.isProbablyJson(decryptedSecret)) {
            var encryptedSecret = EbacEncryptedSecret.fromEncryptableJson(JSON.parse(decryptedSecret));
            return encryptedSecret;
        }
        return null;
    };
    /**
     *  Asynchronously attempts to decrypt secret with a specific key
     * 
     *  @param {EcPpk}                          decryptionKey Key to attempt secret decryption
     *  @param {Callback1<EbacEncryptedSecret>} success Callback triggered after
     *                                          successful decryption of secret, returns decrypted secret
     *  @param {Callback1<String>}              failure Callback triggered if error during
     *                                          secret decryption
     *  @memberOf EcEncryptedValue
     *  @method decryptSecretByKeyAsync
     */
    prototype.decryptSecretByKeyAsync = function(decryptionKey, estimatedIndex, success, failure) {
        var encryptedSecret = null;
        var me = this;
        if (this.secret != null) {
            if (estimatedIndex < 0 || estimatedIndex >= this.secret.length) {
                this.decryptSecretsByKeyAsync(decryptionKey, success, failure);
            } else {
                EcRsaOaepAsync.decrypt(decryptionKey, this.secret[estimatedIndex], function(decryptedSecret) {
                    if (!EcLinkedData.isProbablyJson(decryptedSecret)) {
                        me.decryptSecretsByKeyAsync(decryptionKey, success, failure);
                    } else {
                        success(EbacEncryptedSecret.fromEncryptableJson(JSON.parse(decryptedSecret)));
                    }
                }, function(arg0) {
                    me.decryptSecretsByKeyAsync(decryptionKey, success, failure);
                });
            }
        } else 
            failure("Secret field is empty.");
    };
    prototype.decryptSecretsByKeyAsync = function(decryptionKey, success, failure) {
        var helper = new EcAsyncHelper();
        helper.each(this.secret, function(decryptionSecret, decrement) {
            EcRsaOaepAsync.decrypt(decryptionKey, decryptionSecret, function(decryptedSecret) {
                if (helper.counter == -1) {
                    return;
                }
                if (!EcLinkedData.isProbablyJson(decryptedSecret)) {
                    decrement();
                } else {
                    helper.stop();
                    success(EbacEncryptedSecret.fromEncryptableJson(JSON.parse(decryptedSecret)));
                }
            }, function(arg0) {
                decrement();
            });
        }, function(arg0) {
            failure("Could not find decryption key.");
        });
    };
    /**
     *  Checks if this encrypted value is an encrypted version of a specific
     *  type, only works if the type wasn't hidden during encryption
     * 
     *  @param {String} type Type to compare if an encrypted type
     *  @return {boolean} True if encrypted version of type, false if not or
     *  can't tell
     *  @memberOf EcEncryptedValue
     *  @method isAnEncrypted
     */
    prototype.isAnEncrypted = function(type) {
        if (this.encryptedType == null) {
            return false;
        }
        var typeSplit = (type.split("/"));
        return this.encryptedType == type || this.encryptedType == typeSplit[typeSplit.length - 1];
    };
    /**
     *  Adds a reader to the object, if the reader does not exist.
     * 
     *  @param {EcPk} newReader PK of the new reader.
     *  @memberOf EcEncryptedValue
     *  @method addReader
     */
    prototype.addReader = function(newReader) {
        this.addReaderBasic(newReader);
        var payloadSecret = this.decryptSecret();
        if (payloadSecret == null) {
            console.error("Cannot add a Reader if you don't know the secret");
            return;
        }
        EcArray.setAdd(this.secret, EcRsaOaep.encrypt(newReader, payloadSecret.toEncryptableJson()));
    };
    /**
     *  Adds a reader to the object, if the reader does not exist.
     * 
     *  @param {EcPk} newReader PK of the new reader.
     *  @memberOf EcEncryptedValue
     *  @method addReader
     */
    prototype.addReaderBasic = function(newReader) {
        var pem = newReader.toPem();
        if (this.reader == null) {
            this.reader = new Array();
        }
        if (EcArray.has(this.reader, pem)) 
            return;
        if (this.owner != null) 
            if (EcArray.has(this.owner, pem)) 
                return;
        EcArray.setAdd(this.reader, pem);
    };
    /**
     *  Removes a reader from the object, if the reader does exist.
     * 
     *  @param {EcPk} oldReader PK of the old reader.
     *  @memberOf EcEncryptedValue
     *  @method removeReader
     */
    prototype.removeReader = function(oldReader) {
        var payloadSecret = this.decryptSecret();
        var pem = oldReader.toPem();
        if (this.reader != null) {
            EcArray.setRemove(this.reader, pem);
        }
        if (payloadSecret == null) {
            console.error("Cannot remove a Reader if you don't know the secret");
            return;
        }
        this.secret = new Array();
        if (this.owner != null) 
            for (var i = 0; i < this.owner.length; i++) 
                EcArray.setAdd(this.secret, EcRsaOaep.encrypt(EcPk.fromPem(this.owner[i]), payloadSecret.toEncryptableJson()));
        if (this.reader != null) 
            for (var i = 0; i < this.reader.length; i++) 
                EcArray.setAdd(this.secret, EcRsaOaep.encrypt(EcPk.fromPem(this.reader[i]), payloadSecret.toEncryptableJson()));
    };
    /**
     *  Adds a reader to the object, if the reader does not exist.
     * 
     *  @param {EcPk}              newReader PK of the new reader.
     *  @param {Callback0}         success   Callback triggered after successful encryption
     *  @param {Callback1<String>} failure Callback triggered if error during secret decryption
     *  @memberOf EcEncryptedValue
     *  @method addReaderAsync
     */
    prototype.addReaderAsync = function(newReader, success, failure) {
        var me = this;
        this.decryptSecretAsync(function(payloadSecret) {
            EcRsaOaepAsync.encrypt(newReader, payloadSecret.toEncryptableJson(), function(s) {
                var pem = newReader.toPem();
                if (me.reader == null) {
                    me.reader = new Array();
                }
                for (var i = 0; i < me.reader.length; i++) {
                    if (me.reader[i] == pem) {
                        success();
                        return;
                    }
                }
                EcArray.setAdd(me.reader, pem);
                EcArray.setAdd(me.secret, s);
                success();
            }, failure);
        }, failure);
    };
    /**
     *  Removes a reader from the object, if the reader does exist.
     * 
     *  @param {EcPk}              oldReader PK of the old reader.
     *  @param {Callback0}         success   Callback triggered after successful encryption
     *  @param {Callback1<String>} failure Callback triggered if error during secret decryption
     *  @memberOf EcEncryptedValue
     *  @method removeReaderAsync
     */
    prototype.removeReaderAsync = function(oldReader, success, failure) {
        var me = this;
        this.decryptSecretAsync(function(payloadSecret) {
            var pem = oldReader.toPem();
            if (me.reader != null) {
                EcArray.setRemove(me.reader, pem);
            }
            var ary = new Array();
            if (me.owner != null) 
                for (var i = 0; i < me.owner.length; i++) 
                    EcArray.setAdd(ary, EcPk.fromPem(me.owner[i]));
            if (me.reader != null) 
                for (var i = 0; i < me.reader.length; i++) 
                    EcArray.setAdd(ary, EcPk.fromPem(me.reader[i]));
            me.secret = new Array();
            var eah = new EcAsyncHelper();
            eah.each(ary, function(ecPk, callback0) {
                EcRsaOaepAsync.encrypt(oldReader, payloadSecret.toEncryptableJson(), function(secret) {
                    EcArray.setRemove(me.secret, secret);
                    callback0();
                }, failure);
            }, function(strings) {
                success();
            });
        }, failure);
    };
}, {encryptOnSaveMap: {name: "Map", arguments: [null, null]}, secret: {name: "Array", arguments: [null]}, owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  A representation of a file.
 * 
 *  @author fritz.ray@eduworks.com
 *  @module com.eduworks.ec
 *  @class GeneralFile
 *  @extends EcRemoteLinkedData
 *  @constructor
 */
var GeneralFile = function() {
    EcRemoteLinkedData.call(this, General.context, GeneralFile.myType);
};
GeneralFile = stjs.extend(GeneralFile, EcRemoteLinkedData, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/general/0.1/file";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/general/0.2/file";
    constructor.myType = GeneralFile.TYPE_0_2;
    /**
     *  Optional checksum of the file, used to verify if the file has been
     *  transmitted correctly.
     * 
     *  @property checksum
     *  @type String
     */
    prototype.checksum = null;
    /**
     *  Mime type of the file.
     * 
     *  @property mimeType
     *  @type String
     */
    prototype.mimeType = null;
    /**
     *  Base-64 encoded version of the bytestream of a file.
     * 
     *  @property data
     *  @type String
     */
    prototype.data = null;
    /**
     *  Name of the file, used to distinguish it
     * 
     *  @property name
     *  @type String
     */
    prototype.name = null;
    /**
     *  Helper method to force the browser to download the file.
     * 
     *  @memberOf GeneralFile
     *  @method download
     */
    prototype.download = function() {
        var blob = base64ToBlob(this.data, this.mimeType);
        saveAs(blob, this.name);
    };
    prototype.upgrade = function() {
        EcLinkedData.prototype.upgrade.call(this);
        if (GeneralFile.TYPE_0_1.equals(this.type)) {
            var me = (this);
            if (me["@context"] == null && me["@schema"] != null) 
                me["@context"] = me["@schema"];
            this.setContextAndType(General.context_0_2, GeneralFile.TYPE_0_2);
        }
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(GeneralFile.TYPE_0_2);
        a.push(GeneralFile.TYPE_0_1);
        return a;
    };
}, {owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  Repository object used to interact with the CASS Repository web services.
 *  Should be used for all CRUD and search operations
 * 
 *  @author fritz.ray@eduworks.com
 *  @module com.eduworks.ec
 *  @class EcRepository
 */
var EcRepository = function() {
    EcRepository.repos.push(this);
};
EcRepository = stjs.extend(EcRepository, null, [], function(constructor, prototype) {
    constructor.caching = false;
    constructor.cachingSearch = false;
    constructor.unsigned = false;
    constructor.alwaysTryUrl = false;
    constructor.cache = new Object();
    constructor.fetching = new Object();
    constructor.repos = new Array();
    prototype.adminKeys = null;
    prototype.selectedServer = null;
    prototype.autoDetectFound = false;
    prototype.timeOffset = 0;
    /**
     *  Gets a JSON-LD object from the place designated by the URI.
     *  <p>
     *  Uses a signature sheet gathered from {@link EcIdentityManager}.
     * 
     *  @param {String}                               url URL of the remote object.
     *  @param {Callback1<EcRemoteLinkedData>}success Event to call upon
     *                                                successful retrieval.
     *  @param {Callback1<String>}                    failure Event to call upon spectacular
     *                                                failure.
     *  @memberOf EcRepository
     *  @method get
     *  @static
     */
    constructor.get = function(url, success, failure) {
        if (url == null) {
            failure("URL is null. Cannot EcRepository.get");
            return;
        }
        if (url.toLowerCase().indexOf("http") != 0) {
            failure("URL does not begin with http. Cannot EcRepository.get");
            return;
        }
        var originalUrl = url;
        if (EcRemote.async == false) {
            var result = EcRepository.getBlocking(url);
            if (result == null) {
                if (failure != null) 
                    failure("Could not locate object. May be due to EcRepository.alwaysTryUrl flag.");
            } else if (success != null) 
                success(result);
            return;
        }
        if (EcRepository.caching) {
            if ((EcRepository.cache)[url] != null) {
                if (EcRemote.async) {
                    Task.immediate(function() {
                        success((EcRepository.cache)[originalUrl]);
                    });
                } else {
                    success((EcRepository.cache)[url]);
                }
                return;
            }
            if (EcRemote.async) {
                if ((EcRepository.fetching)[url] != null) {
                    if ((EcRepository.fetching)[url] > new Date().getTime()) {
                        setTimeout(function() {
                            EcRepository.get(originalUrl, success, failure);
                        }, 100);
                        return;
                    }
                }
                (EcRepository.fetching)[url] = new Date().getTime() + 60000;
            }
        }
        if (!EcRepository.shouldTryUrl(url)) {
            if (EcRepository.repos.length == 1) 
                url = EcRemoteLinkedData.veryShortId(EcRepository.repos[0].selectedServer, EcCrypto.md5(url));
             else {
                EcRepository.find(url, "Could not locate object. May be due to EcRepository.alwaysTryUrl flag.", new Object(), 0, success, failure);
                return;
            }
        }
        var fd = new FormData();
        var finalUrl = url;
        if (EcRepository.unsigned) {
            EcRemote.getExpectingObject(finalUrl, null, function(p1) {
                EcRepository.getHandleData(p1, originalUrl, success, failure, finalUrl);
            }, function(p1) {
                EcRepository.find(originalUrl, p1, new Object(), 0, success, failure);
            });
        } else {
            var offset = EcRepository.setOffset(url);
            EcIdentityManager.signatureSheetAsync(60000 + offset, url, function(p1) {
                if ((EcRepository.cache)[originalUrl] != null) {
                    delete (EcRepository.fetching)[originalUrl];
                    success((EcRepository.cache)[originalUrl]);
                    return;
                }
                fd.append("signatureSheet", p1);
                EcRemote.postExpectingObject(finalUrl, null, fd, function(p1) {
                    EcRepository.getHandleData(p1, originalUrl, success, failure, finalUrl);
                }, function(p1) {
                    EcRepository.find(originalUrl, p1, new Object(), 0, success, failure);
                });
            }, failure);
        }
    };
    constructor.setOffset = function(url) {
        var offset = 0;
        for (var i = 0; i < EcRepository.repos.length; i++) {
            if (url.indexOf(EcRepository.repos[i].selectedServer) != -1) {
                offset = EcRepository.repos[i].timeOffset;
            }
        }
        return offset;
    };
    constructor.getHandleData = function(p1, originalUrl, success, failure, finalUrl) {
        delete (EcRepository.fetching)[originalUrl];
        var d = new EcRemoteLinkedData("", "");
        d.copyFrom(p1);
        if (d.getFullType() == null) {
            EcRepository.find(originalUrl, JSON.stringify(p1), new Object(), 0, success, failure);
            return;
        }
        if (EcRepository.caching) {
            (EcRepository.cache)[finalUrl] = d;
            if (d.id != null) 
                (EcRepository.cache)[d.id] = d;
        }
        success(d);
    };
    constructor.shouldTryUrl = function(url) {
        if (url == null) 
            return false;
        if (EcRepository.alwaysTryUrl) 
            return true;
        if (EcRepository.repos.length == 0) 
            return true;
        if (url.indexOf("/api/") != -1 || url.indexOf("/data/") != -1) 
            return true;
        var validUrlFound = false;
        for (var i = 0; i < EcRepository.repos.length; i++) {
            if (EcRepository.repos[i].selectedServer == null) 
                continue;
            validUrlFound = true;
        }
        if (!validUrlFound) 
            return true;
        return false;
    };
    constructor.find = function(url, error, history, i, success, failure) {
        if (isNaN(i) || i == undefined || i > EcRepository.repos.length || EcRepository.repos[i] == null) {
            delete (EcRepository.fetching)[url];
            if (failure != null) 
                failure(error);
            return;
        }
        var repo = EcRepository.repos[i];
        if (repo.selectedServer == null) {
            EcRepository.find(url, error, history, i + 1, success, failure);
            return;
        }
        if (((history)[repo.selectedServer]) == true) {
            EcRepository.find(url, error, history, i + 1, success, failure);
            return;
        }
        (history)[repo.selectedServer] = true;
        repo.search("@id:\"" + url + "\"", null, function(strings) {
            if (strings == null || strings.length == 0) 
                EcRepository.find(url, error, history, i + 1, success, failure);
             else {
                var done = false;
                for (var i = 0; i < strings.length; i++) {
                    if (strings[i].id == url) {
                        if (done) 
                            log("Searching for exact ID:" + url + ", found more than one@:" + repo.selectedServer);
                        done = true;
                        delete (EcRepository.fetching)[url];
                        if (EcRepository.caching) {
                            (EcRepository.cache)[url] = strings[i];
                            if (strings[i].id != null) 
                                (EcRepository.cache)[url] = strings[i].id;
                        }
                        success(strings[i]);
                    }
                }
                if (done) 
                    return;
                EcRepository.find(url, error, history, i + 1, success, failure);
            }
        }, function(s) {
            EcRepository.find(url, s, history, i + 1, success, failure);
        });
    };
    constructor.findBlocking = function(url, error, history, i) {
        if (i > EcRepository.repos.length || EcRepository.repos[i] == null) {
            delete (EcRepository.fetching)[url];
            return null;
        }
        var repo = EcRepository.repos[i];
        if (repo.selectedServer == null) {
            return EcRepository.findBlocking(url, error, history, i + 1);
        }
        if (((history)[repo.selectedServer]) == true) 
            EcRepository.findBlocking(url, error, history, i + 1);
        (history)[repo.selectedServer] = true;
        var strings = repo.searchBlocking("@id:\"" + url + "\"");
        if (strings == null || strings.length == 0) 
            return EcRepository.findBlocking(url, error, history, i + 1);
         else {
            for (var j = 0; j < strings.length; j++) {
                if (strings[j].id == url) {
                    delete (EcRepository.fetching)[url];
                    if (EcRepository.caching) {
                        (EcRepository.cache)[url] = strings[j];
                        if (strings[j].id != null) 
                            (EcRepository.cache)[url] = strings[j].id;
                    }
                    return strings[j];
                }
            }
        }
        return EcRepository.findBlocking(url, error, history, i + 1);
    };
    /**
     *  Retrieves a piece of data synchronously from the server, blocking until
     *  it is returned
     * 
     *  @param {String} url URL ID of the data to be retrieved
     *  @return {EcRemoteLinkedData} Data retrieved, corresponding to the ID
     *  @memberOf EcRepository
     *  @method getBlocking
     *  @static
     */
    constructor.getBlocking = function(url) {
        if (url.toLowerCase().indexOf("http") != 0) {
            return null;
        }
        var originalUrl = url;
        if (originalUrl == null) 
            return null;
        if (EcRepository.caching) {
            if ((EcRepository.cache)[originalUrl] != null) {
                return (EcRepository.cache)[originalUrl];
            }
        }
        if (!EcRepository.shouldTryUrl(originalUrl)) {
            if (EcRepository.repos.length == 1) 
                url = EcRemoteLinkedData.veryShortId(EcRepository.repos[0].selectedServer, EcCrypto.md5(url));
             else {
                return EcRepository.findBlocking(originalUrl, "Could not locate object. May be due to EcRepository.alwaysTryUrl flag.", new Object(), 0);
            }
        }
        var fd = new FormData();
        var p1 = null;
        if (EcRepository.unsigned == false) {
            var offset = EcRepository.setOffset(url);
            p1 = EcIdentityManager.signatureSheet(60000 + offset, originalUrl);
            fd.append("signatureSheet", p1);
        }
        var oldAsync = EcRemote.async;
        EcRemote.async = false;
        var finalUrl = url;
        EcRemote.postExpectingObject(finalUrl, null, fd, function(p1) {
            var d = new EcRemoteLinkedData("", "");
            d.copyFrom(p1);
            if (d.getFullType() == null) {
                EcRepository.findBlocking(originalUrl, JSON.stringify(p1), new Object(), 0);
                return;
            }
            (EcRepository.cache)[originalUrl] = d;
            if (d != null) {
                if (d.id != null) 
                    (EcRepository.cache)[d.id] = d;
            }
        }, function(s) {
            var d = EcRepository.findBlocking(originalUrl, s, new Object(), 0);
            (EcRepository.cache)[originalUrl] = d;
            if (d != null) {
                if (d.id != null) 
                    (EcRepository.cache)[d.id] = d;
            }
        });
        EcRemote.async = oldAsync;
        var result = (EcRepository.cache)[originalUrl];
        if (!EcRepository.caching) {
            delete (EcRepository.cache)[originalUrl];
        }
        return result;
    };
    /**
     *  Escapes a search query
     * 
     *  @param {String} query Query string to escape
     *  @return {String} Escaped query string
     *  @memberOf EcRepository
     *  @method escapeSearch
     *  @static
     */
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
     *  <p>
     *  Uses a signature sheet informed by the owner field of the data.
     * 
     *  @param {EcRemoteLinkedData} data Data to save to the location designated
     *                              by its id.
     *  @param {Callback1<String>}  success Callback triggered on successful save
     *  @param {Callback1<String>}  failure Callback triggered if error during
     *                              save
     *  @memberOf EcRepository
     *  @method save
     *  @static
     */
    constructor.save = function(data, success, failure) {
        EcRepository._save(data, success, failure, null);
    };
    /**
     *  Attempts to save a piece of data. If the @id of the data is not of this server, will register the data to the server.
     *  <p>
     *  Uses a signature sheet informed by the owner field of the data.
     * 
     *  @param {EcRemoteLinkedData} data Data to save to the location designated
     *                              by its id.
     *  @param {Callback1<String>}  success Callback triggered on successful save
     *  @param {Callback1<String>}  failure Callback triggered if error during
     *                              save
     *  @memberOf EcRepository
     *  @method save
     *  @static
     */
    prototype.saveTo = function(data, success, failure) {
        EcRepository._save(data, success, failure, this);
    };
    /**
     *  Attempts to save a piece of data. Does some checks before saving to
     *  ensure the data is valid. This version does not send a console warning,
     *  <p>
     *  Uses a signature sheet informed by the owner field of the data.
     * 
     *  @param {EcRemoteLinkedData} data Data to save to the location designated
     *                              by its id.
     *  @param {Callback1<String>}  success Callback triggered on successful save
     *  @param {Callback1<String>}  failure Callback triggered if error during
     *                              save
     *  @memberOf EcRepository
     *  @method _save
     *  @static
     */
    constructor._save = function(data, success, failure, repo) {
        if (data.invalid()) {
            var msg = "Cannot save data. It is missing a vital component.";
            if (failure != null) {
                failure(msg);
            } else {
                console.error(msg);
            }
            return;
        }
        if (data.reader != null && data.reader.length == 0) {
            delete (data)["reader"];
        }
        if (data.owner != null && data.owner.length == 0) {
            delete (data)["owner"];
        }
        if (EcEncryptedValue.encryptOnSave(data.id, null)) {
            var encrypted = EcEncryptedValue.toEncryptedValue(data, false);
            EcIdentityManager.sign(encrypted);
            EcRepository._saveWithoutSigning(encrypted, success, failure, repo);
        } else {
            EcIdentityManager.sign(data);
            EcRepository._saveWithoutSigning(data, success, failure, repo);
        }
    };
    /**
     *  Attempts to save many pieces of data. Does some checks before saving to
     *  ensure the data is valid. This version does not send a console warning,
     *  <p>
     *  Uses a signature sheet informed by the owner field of the data.
     * 
     *  @param {Array<EcRemoteLinkedData>} data Data to save to the location designated
     *                                     by its id.
     *  @param {Callback1<String>}         success Callback triggered on successful save
     *  @param {Callback1<String>}         failure Callback triggered if error during
     *                                     save
     *  @memberOf EcRepository
     *  @method multiput
     *  @static
     */
    prototype.multiput = function(data, success, failure) {
        var me = this;
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            if (d.invalid()) {
                var msg = "Cannot save data. It is missing a vital component.";
                if (failure != null) {
                    failure(msg);
                } else {
                    console.error(msg);
                }
                return;
            }
            if (d.reader != null && d.reader.length == 0) {
                delete (d)["reader"];
            }
            if (d.owner != null && d.owner.length == 0) {
                delete (d)["owner"];
            }
        }
        var allOwners = new Array();
        var serialized = new Array();
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            if (EcEncryptedValue.encryptOnSave(d.id, null)) {
                var encrypted = EcEncryptedValue.toEncryptedValue(d, false);
                EcIdentityManager.sign(encrypted);
                data[i] = encrypted;
            } else {
                EcIdentityManager.sign(d);
            }
            if (EcRepository.caching) {
                delete (EcRepository.cache)[d.id];
                delete (EcRepository.cache)[d.shortId()];
            }
            if (d.invalid()) {
                failure("Data is malformed.");
                return;
            }
            if (EcRepository.alwaysTryUrl || this.constructor.shouldTryUrl(d.id)) 
                d.updateTimestamp();
            if (d.owner != null) 
                for (var j = 0; j < d.owner.length; j++) 
                    EcArray.setAdd(allOwners, d.owner[j]);
            serialized.push(JSON.parse(d.toJson()));
        }
        var fd = new FormData();
        fd.append("data", JSON.stringify(serialized));
        var afterSignatureSheet = function(signatureSheet) {
            fd.append("signatureSheet", signatureSheet);
            EcRemote.postExpectingString(me.selectedServer, "sky/repo/multiPut", fd, success, failure);
        };
        if (EcRemote.async == false) {
            var signatureSheet;
            if (allOwners != null && allOwners.length > 0) {
                signatureSheet = EcIdentityManager.signatureSheetFor(allOwners, 60000 + this.timeOffset, this.selectedServer);
            } else {
                signatureSheet = EcIdentityManager.signatureSheet(60000 + this.timeOffset, this.selectedServer);
            }
            afterSignatureSheet(signatureSheet);
        } else if (allOwners != null && allOwners.length > 0) {
            EcIdentityManager.signatureSheetForAsync(allOwners, 60000 + this.timeOffset, this.selectedServer, afterSignatureSheet, failure);
        } else {
            EcIdentityManager.signatureSheetAsync(60000 + this.timeOffset, this.selectedServer, afterSignatureSheet, failure);
        }
    };
    /**
     *  Attempts to save a piece of data without signing it.
     *  <p>
     *  Uses a signature sheet informed by the owner field of the data.
     * 
     *  @param {EcRemoteLinkedData} data Data to save to the location designated
     *                              by its id.
     *  @param {Callback1<String>}  success Callback triggered on successful save
     *  @param {Callback1<String>}  failure Callback triggered if error during
     *                              save
     *  @memberOf EcRepository
     *  @method _saveWithoutSigning
     *  @static
     */
    constructor._saveWithoutSigning = function(data, success, failure, repo) {
        if (EcRepository.caching) {
            delete (EcRepository.cache)[data.id];
            delete (EcRepository.cache)[data.shortId()];
        }
        if (data.invalid()) {
            failure("Data is malformed.");
            return;
        }
        if (EcRepository.alwaysTryUrl || repo == null || repo.constructor.shouldTryUrl(data.id)) 
            data.updateTimestamp();
        var fd = new FormData();
        fd.append("data", data.toJson());
        var afterSignatureSheet = function(signatureSheet) {
            fd.append("signatureSheet", signatureSheet);
            if (!EcRepository.alwaysTryUrl) 
                if (repo != null) 
                    if (!repo.constructor.shouldTryUrl(data.id) || data.id.indexOf(repo.selectedServer) == -1) {
                        EcRemote.postExpectingString(EcRemote.urlAppend(repo.selectedServer, "data/" + data.getDottedType() + "/" + EcCrypto.md5(data.shortId())), "", fd, success, failure);
                        return;
                    }
            EcRemote.postExpectingString(data.id, "", fd, success, failure);
        };
        var offset = 0;
        if (repo == null) {
            offset = EcRepository.setOffset(data.id);
        } else {
            offset = repo.timeOffset;
        }
        if (EcRemote.async == false) {
            var signatureSheet;
            if (data.owner != null && data.owner.length > 0) {
                signatureSheet = EcIdentityManager.signatureSheetFor(data.owner, 60000 + offset, data.id);
            } else {
                signatureSheet = EcIdentityManager.signatureSheet(60000 + offset, data.id);
            }
            afterSignatureSheet(signatureSheet);
        } else if (data.owner != null && data.owner.length > 0) {
            EcIdentityManager.signatureSheetForAsync(data.owner, 60000 + offset, data.id, afterSignatureSheet, failure);
        } else {
            EcIdentityManager.signatureSheetAsync(60000 + offset, data.id, afterSignatureSheet, failure);
        }
    };
    /**
     *  Attempts to delete a piece of data.
     *  <p>
     *  Uses a signature sheet informed by the owner field of the data.
     * 
     *  @param {EcRemoteLinkedData} data Data to save to the location designated
     *                              by its id.
     *  @param {Callback1<String>}  success Callback triggered on successful
     *                              delete
     *  @param {Callback1<String>}  failure Callback triggered if error during
     *                              delete
     *  @memberOf EcRepository
     *  @method _delete
     *  @static
     */
    constructor._delete = function(data, success, failure) {
        EcRepository.DELETE(data, success, failure);
    };
    /**
     *  Attempts to delete a piece of data.
     *  <p>
     *  Uses a signature sheet informed by the owner field of the data.
     * 
     *  @param {EcRemoteLinkedData} data Data to save to the location designated
     *                              by its id.
     *  @param {Callback1<String>}  success Callback triggered on successful
     *                              delete
     *  @param {Callback1<String>}  failure Callback triggered if error during
     *                              delete
     *  @memberOf EcRepository
     *  @method DELETE
     *  @static
     */
    constructor.DELETE = function(data, success, failure) {
        if (EcRepository.caching) {
            delete (EcRepository.cache)[data.id];
            delete (EcRepository.cache)[data.shortId()];
        }
        var targetUrl;
        targetUrl = data.shortId();
        var offset = EcRepository.setOffset(data.id);
        if (data.owner != null && data.owner.length > 0) {
            if (EcRemote.async) {
                EcIdentityManager.signatureSheetForAsync(data.owner, 60000 + offset, data.id, function(signatureSheet) {
                    if (signatureSheet.length == 2) {
                        for (var i = 0; i < EcRepository.repos.length; i++) {
                            if (data.id.indexOf(EcRepository.repos[i].selectedServer) != -1) {
                                EcRepository.repos[i].deleteRegistered(data, success, failure);
                                return;
                            }
                        }
                        failure("Cannot delete object without a signature. If deleting from a server, use the non-static _delete");
                    } else 
                        EcRemote._delete(targetUrl, signatureSheet, success, failure);
                }, failure);
            } else {
                var signatureSheet = EcIdentityManager.signatureSheetFor(data.owner, 60000 + offset, data.id);
                if (signatureSheet.length == 2) {
                    for (var i = 0; i < EcRepository.repos.length; i++) {
                        if (data.id.indexOf(EcRepository.repos[i].selectedServer) != -1) {
                            EcRepository.repos[i].deleteRegistered(data, success, failure);
                            return;
                        }
                    }
                    failure("Cannot delete object without a signature. If deleting from a server, use the non-static _delete");
                } else 
                    EcRemote._delete(targetUrl, signatureSheet, success, failure);
            }
        } else {
            EcRemote._delete(targetUrl, "[]", success, failure);
        }
    };
    /**
     *  Attempts to delete a piece of data.
     *  <p>
     *  Uses a signature sheet informed by the owner field of the data.
     * 
     *  @param {EcRemoteLinkedData} data Data to save to the location designated
     *                              by its id.
     *  @param {Callback1<String>}  success Callback triggered on successful
     *                              delete
     *  @param {Callback1<String>}  failure Callback triggered if error during
     *                              delete
     *  @memberOf EcRepository
     *  @method DELETE
     *  @static
     */
    prototype.deleteRegistered = function(data, success, failure) {
        if (EcRepository.caching) {
            delete (EcRepository.cache)[data.id];
            delete (EcRepository.cache)[data.shortId()];
        }
        var targetUrl;
        if (EcRepository.shouldTryUrl(data.id)) 
            targetUrl = data.shortId();
         else {
            targetUrl = EcRemote.urlAppend(this.selectedServer, "data/" + data.getDottedType() + "/" + EcCrypto.md5(data.shortId()));
        }
        var me = this;
        if (data.owner != null && data.owner.length > 0) {
            if (EcRemote.async) {
                EcIdentityManager.signatureSheetForAsync(data.owner, 60000 + this.timeOffset, data.id, function(signatureSheet) {
                    if (signatureSheet.length == 2 && me.adminKeys != null) {
                        EcIdentityManager.signatureSheetForAsync(me.adminKeys, 60000 + me.timeOffset, data.id, function(signatureSheet) {
                            EcRemote._delete(targetUrl, signatureSheet, success, failure);
                        }, failure);
                    } else 
                        EcRemote._delete(targetUrl, signatureSheet, success, failure);
                }, failure);
            } else {
                var signatureSheet = EcIdentityManager.signatureSheetFor(data.owner, 60000 + me.timeOffset, data.id);
                if (signatureSheet.length == 2 && me.adminKeys != null) {
                    signatureSheet = EcIdentityManager.signatureSheetFor(me.adminKeys, 60000 + me.timeOffset, data.id);
                    EcRemote._delete(targetUrl, signatureSheet, success, failure);
                } else 
                    EcRemote._delete(targetUrl, signatureSheet, success, failure);
            }
        } else {
            EcRemote._delete(targetUrl, "[]", success, failure);
        }
    };
    /**
     *  Retrieves data from the server and caches it for use later during the
     *  application. This should be called before the data is needed if possible,
     *  so loading displays can be faster.
     * 
     *  @param {String[]}  urls List of Data ID Urls that should be precached
     *  @param {Callback0} success Callback triggered once all of the data has
     *                     been retrieved
     *  @memberOf EcRepository
     *  @method precache
     */
    prototype.precache = function(urls, success) {
        if (urls == null || urls.length == 0) {
            if (success != null) {
                success();
            }
            return;
        }
        var cacheUrls = new Array();
        for (var i = 0; i < urls.length; i++) {
            var url = urls[i];
            if ((EcRepository.cache)[url] != null) {} else if (url.startsWith(this.selectedServer)) {
                cacheUrls.push(url.replace(this.selectedServer, "").replace("custom/", ""));
            } else {
                cacheUrls.push("data/" + EcCrypto.md5(url));
            }
        }
        if (cacheUrls.length == 0) {
            if (success != null) {
                success();
            }
            return;
        }
        var fd = new FormData();
        fd.append("data", JSON.stringify(cacheUrls));
        var me = this;
        if (EcRepository.unsigned) {
            this.precachePost(success, cacheUrls, fd, me);
        } else {
            EcIdentityManager.signatureSheetAsync(60000 + this.timeOffset, this.selectedServer, function(p1) {
                fd.append("signatureSheet", p1);
                me.precachePost(success, cacheUrls, fd, me);
            }, null);
        }
    };
    /**
     *  Retrieves data from the server and caches it for use later during the
     *  application. This should be called before the data is needed if possible,
     *  so loading displays can be faster.
     * 
     *  @param {String[]}  urls List of Data ID Urls that should be precached
     *  @param {Callback0} success Callback triggered once all of the data has
     *                     been retrieved
     *  @memberOf EcRepository
     *  @method precachePost
     */
    prototype.precachePost = function(success, cacheUrls, fd, me) {
        EcRemote.postExpectingObject(me.selectedServer, "sky/repo/multiGet", fd, function(p1) {
            var results = p1;
            for (var i = 0; i < results.length; i++) {
                var d = new EcRemoteLinkedData(null, null);
                d.copyFrom(results[i]);
                results[i] = d;
                if (EcRepository.caching) {
                    if (!EcRepository.shouldTryUrl(d.id)) {
                        var md5 = EcCrypto.md5(d.shortId());
                        for (var j = 0; j < cacheUrls.length; j++) {
                            var url = cacheUrls[j];
                            if (url.indexOf(md5) != -1) {
                                (EcRepository.cache)[url] = d;
                                break;
                            }
                        }
                    }
                    (EcRepository.cache)[d.shortId()] = d;
                    (EcRepository.cache)[d.id] = d;
                }
            }
            if (success != null) {
                success();
            }
        }, null);
    };
    /**
     *  Returns an array of JSON-LD objects from the places designated by the given URIs.
     *  <p>
     *  Uses a signature sheet gathered from {@link EcIdentityManager}.
     * 
     *  @param {Array<String>}                        urls URLs of the remote objects.
     *  @param {Callback1<Array<EcRemoteLinkedData>>} success Event to call upon
     *                                                successful retrieval.
     *  @param {Callback1<String>}                    failure Event to call upon spectacular
     *                                                failure.
     *  @param {Callback1<Array<EcRemoteLinkedData>>} cachedValues Event to call upon
     *                                                successful retrieval from cache.
     *  @memberOf EcRepository
     *  @method multiget
     */
    prototype.multiget = function(urls, success, failure) {
        if (urls == null || urls.length == 0) {
            if (failure != null) {
                failure("");
            }
            return;
        }
        var results = new Array();
        var me = this;
        if (EcRepository.caching) 
            this.precache(urls, function() {
                var eah = new EcAsyncHelper();
                me.multigetInner(urls, success, results, eah);
            });
         else {
            var eah = new EcAsyncHelper();
            this.multigetInner(urls, success, results, eah);
        }
    };
    prototype.multigetInner = function(urls, success, results, eah) {
        eah.each(urls, function(url, done) {
            EcRepository.get(url, function(result) {
                results.push(result);
                done();
            }, function(s) {
                done();
            });
        }, function(urls) {
            success(results);
        });
    };
    /**
     *  Search a repository for JSON-LD compatible data.
     *  <p>
     *  Uses a signature sheet gathered from {@link EcIdentityManager}.
     * 
     *  @param {String}                          query ElasticSearch compatible query string, similar to
     *                                           Google query strings.
     *  @param {Callback1<EcRemoteLinkedData>}   eachSuccess Success event for each
     *                                           found object.
     *  @param {Callback1<EcRemoteLinkedData[]>} success Success event, called
     *                                           after eachSuccess.
     *  @param {Callback1<String>}               failure Failure event.
     *  @memberOf EcRepository
     *  @method search
     */
    prototype.search = function(query, eachSuccess, success, failure) {
        this.searchWithParams(query, null, eachSuccess, success, failure);
    };
    /**
     *  Search a repository for JSON-LD compatible data synchronously.
     *  <p>
     *  Uses a signature sheet gathered from {@link EcIdentityManager}.
     * 
     *  @param {String} query ElasticSearch compatible query string, similar to
     *                  Google query strings.
     *  @returns EcRemoteLinkedData[]
     *  @memberOf EcRepository
     *  @method search
     */
    prototype.searchBlocking = function(query) {
        return this.searchWithParamsBlocking(query, null);
    };
    /**
     *  Search a repository for JSON-LD compatible data.
     *  <p>
     *  Uses a signature sheet gathered from {@link EcIdentityManager}.
     * 
     *  @param {String}                          query ElasticSearch compatible query string, similar to
     *                                           Google query strings.
     *  @param {Object}                          paramObj Additional parameters that can be used to tailor
     *                                           the search.
     *  @param {Callback1<EcRemoteLinkedData>}   eachSuccess Success event for each
     *                                           found object.
     *  @param {Callback1<EcRemoteLinkedData[]>} success Success event, called
     *                                           after eachSuccess.
     *  @param {Callback1<String>}               failure Failure event.
     *  @memberOf EcRepository
     *  @method searchWithParams
     */
    prototype.searchWithParams = function(originalQuery, originalParamObj, eachSuccess, success, failure) {
        if (EcRemote.async == false) {
            var result = this.searchWithParamsBlocking(originalQuery, originalParamObj);
            if (result == null) {
                if (failure != null) 
                    failure("Search failed.");
            } else {
                for (var i = 0; i < result.length; i++) 
                    if (eachSuccess != null) 
                        eachSuccess(result[i]);
                if (success != null) 
                    success(result);
            }
            return;
        }
        var query = originalQuery;
        var paramObj = originalParamObj;
        if (paramObj == null) {
            paramObj = new Object();
        }
        var params = new Object();
        var paramProps = (params);
        query = this.searchParamProps(query, paramObj, paramProps);
        if ((paramObj)["fields"] != null) {
            paramProps["fields"] = (paramObj)["fields"];
        }
        var cacheKey;
        if (EcRepository.cachingSearch) {
            cacheKey = JSON.stringify(paramProps) + query;
            if ((EcRepository.cache)[cacheKey] != null) {
                this.handleSearchResults((EcRepository.cache)[cacheKey], eachSuccess, success, failure);
                return;
            }
            var me = this;
            if (EcRemote.async) {
                if ((EcRepository.fetching)[cacheKey] != null) {
                    if ((EcRepository.fetching)[cacheKey] > new Date().getTime()) {
                        setTimeout(function() {
                            me.searchWithParams(originalQuery, originalParamObj, eachSuccess, success, failure);
                        }, 100);
                        return;
                    }
                }
                (EcRepository.fetching)[cacheKey] = new Date().getTime() + 60000;
            }
        } else {
            cacheKey = null;
        }
        var fd = new FormData();
        fd.append("data", query);
        if (params != null) {
            fd.append("searchParams", JSON.stringify(params));
        }
        var me = this;
        if (EcRepository.unsigned == true || (paramObj)["unsigned"] == true) {
            fd.append("signatureSheet", "[]");
            EcRemote.postExpectingObject(me.selectedServer, "sky/repo/search", fd, function(p1) {
                if (EcRepository.cachingSearch) {
                    (EcRepository.cache)[cacheKey] = p1;
                }
                if (cacheKey != null) {
                    delete (EcRepository.fetching)[cacheKey];
                }
                me.handleSearchResults(p1, eachSuccess, success, failure);
            }, function(p1) {
                if (cacheKey != null) {
                    delete (EcRepository.fetching)[cacheKey];
                }
                if (failure != null) {
                    failure(p1);
                }
            });
        } else 
            EcIdentityManager.signatureSheetAsync(60000 + this.timeOffset, this.selectedServer, function(signatureSheet) {
                fd.append("signatureSheet", signatureSheet);
                EcRemote.postExpectingObject(me.selectedServer, "sky/repo/search", fd, function(p1) {
                    if (EcRepository.cachingSearch) {
                        (EcRepository.cache)[cacheKey] = p1;
                    }
                    if (cacheKey != null) {
                        delete (EcRepository.fetching)[cacheKey];
                    }
                    me.handleSearchResults(p1, eachSuccess, success, failure);
                }, function(p1) {
                    if (cacheKey != null) {
                        delete (EcRepository.fetching)[cacheKey];
                    }
                    if (failure != null) {
                        failure(p1);
                    }
                });
            }, failure);
    };
    /**
     *  Search a repository for JSON-LD compatible data synchronously.
     *  <p>
     *  Uses a signature sheet gathered from {@link EcIdentityManager}.
     * 
     *  @param {String} query ElasticSearch compatible query string, similar to
     *                  Google query strings.
     *  @param {Object} paramObj Additional parameters that can be used to tailor
     *                  the search.
     *  @returns EcRemoteLinkedData[]
     *  @memberOf EcRepository
     *  @method searchWithParams
     */
    prototype.searchWithParamsBlocking = function(originalQuery, originalParamObj) {
        var query = originalQuery;
        var paramObj = originalParamObj;
        if (paramObj == null) {
            paramObj = new Object();
        }
        var params = new Object();
        var paramProps = (params);
        query = this.searchParamProps(query, paramObj, paramProps);
        if ((paramObj)["fields"] != null) {
            paramProps["fields"] = (paramObj)["fields"];
        }
        var oldAsync = EcRemote.async;
        EcRemote.async = false;
        var cacheKey;
        cacheKey = JSON.stringify(paramProps) + query;
        if (EcRepository.cachingSearch) {
            if ((EcRepository.cache)[cacheKey] != null) {
                return this.handleSearchResults((EcRepository.cache)[cacheKey], null, null, null);
            }
        }
        var fd = new FormData();
        fd.append("data", query);
        if (params != null) {
            fd.append("searchParams", JSON.stringify(params));
        }
        var me = this;
        if (EcRepository.unsigned == true || (paramObj)["unsigned"] == true) {
            fd.append("signatureSheet", "[]");
            EcRemote.postExpectingObject(me.selectedServer, "sky/repo/search", fd, function(p1) {
                (EcRepository.cache)[cacheKey] = p1;
                if (cacheKey != null) {
                    delete (EcRepository.fetching)[cacheKey];
                }
            }, function(p1) {
                if (cacheKey != null) {
                    delete (EcRepository.fetching)[cacheKey];
                }
                (EcRepository.cache)[cacheKey] = null;
            });
        } else {
            var signatureSheet;
            signatureSheet = EcIdentityManager.signatureSheet(60000 + this.timeOffset, this.selectedServer);
            fd.append("signatureSheet", signatureSheet);
            EcRemote.postExpectingObject(me.selectedServer, "sky/repo/search", fd, function(p1) {
                (EcRepository.cache)[cacheKey] = p1;
                if (cacheKey != null) {
                    delete (EcRepository.fetching)[cacheKey];
                }
            }, function(p1) {
                if (cacheKey != null) {
                    delete (EcRepository.fetching)[cacheKey];
                }
                (EcRepository.cache)[cacheKey] = null;
            });
        }
        var result = this.handleSearchResults((EcRepository.cache)[cacheKey], null, null, null);
        if (!EcRepository.cachingSearch) {
            delete (EcRepository.cache)[cacheKey];
        }
        EcRemote.async = oldAsync;
        return result;
    };
    prototype.searchParamProps = function(query, paramObj, paramProps) {
        if ((paramObj)["start"] != null) {
            paramProps["start"] = (paramObj)["start"];
        }
        if ((paramObj)["size"] != null) {
            paramProps["size"] = (paramObj)["size"];
        }
        if ((paramObj)["types"] != null) {
            paramProps["types"] = (paramObj)["types"];
        }
        if ((paramObj)["sort"] != null) {
            paramProps["sort"] = (paramObj)["sort"];
        }
        if ((paramObj)["track_scores"] != null) {
            paramProps["track_scores"] = (paramObj)["track_scores"];
        }
        if ((paramObj)["index_hint"] != null) {
            paramProps["index_hint"] = (paramObj)["index_hint"];
        }
        if ((paramObj)["ownership"] != null) {
            var ownership = (paramObj)["ownership"];
            if (!query.startsWith("(") || !query.endsWith(")")) {
                query = "(" + query + ")";
            }
            if (ownership == "public") {
                query += " AND (_missing_:@owner)";
            } else if (ownership == "owned") {
                query += " AND (_exists_:@owner)";
            } else if (ownership == "me") {
                query += " AND (";
                for (var i = 0; i < EcIdentityManager.ids.length; i++) {
                    if (i != 0) {
                        query += " OR ";
                    }
                    var id = EcIdentityManager.ids[i];
                    query += "@owner:\"" + id.ppk.toPk().toPem() + "\"";
                }
                query += ")";
            }
        }
        return query;
    };
    /**
     *  Searches known repository endpoints to set the server configuration for
     *  this repositories instance
     * 
     *  @memberOf EcRepository
     *  @method autoDetectRepository
     */
    prototype.autoDetectRepositoryAsync = function(success, failure) {
        var protocols = new Array();
        if (window != null) {
            if (window.location != null) {
                if (window.location.protocol == "https:") {
                    protocols.push("https:");
                }
            }
        }
        if (window != null) {
            if (window.location != null) {
                if (window.location.protocol == "http:") {
                    protocols.push("http:");
                    protocols.push("https:");
                }
            }
        }
        if (protocols.length == 0) {
            protocols.push("https:");
            protocols.push("http:");
        }
        var hostnames = new Array();
        var servicePrefixes = new Array();
        if (this.selectedServer != null) {
            var e = window.document.createElement("a");
            (e)["href"] = this.selectedServer;
            hostnames.push((e)["host"]);
            servicePrefixes.push((e)["pathname"]);
        } else {
            if (window.location.host != null) {
                hostnames.push(window.location.host, window.location.host.replace(".", ".service."), window.location.host + ":8080", window.location.host.replace(".", ".service.") + ":8080");
            }
            if (window.location.hostname != null) {
                hostnames.push(window.location.hostname, window.location.hostname.replace(".", ".service."), window.location.hostname + ":8080", window.location.hostname.replace(".", ".service.") + ":8080");
            }
        }
        EcArray.removeDuplicates(hostnames);
        servicePrefixes.push("/" + window.location.pathname.split("/")[1] + "/api/", "/", "/service/", "/api/");
        EcArray.removeDuplicates(servicePrefixes);
        var me = this;
        me.autoDetectFound = false;
        for (var j = 0; j < hostnames.length; j++) {
            for (var k = 0; k < servicePrefixes.length; k++) {
                for (var i = 0; i < protocols.length; i++) {
                    this.autoDetectRepositoryActualAsync(protocols[i] + "//" + hostnames[j] + servicePrefixes[k].replaceAll("//", "/"), success, failure);
                    setTimeout(function() {
                        if (me.autoDetectFound == false) {
                            var servicePrefixes = new Array();
                            servicePrefixes.push("/" + window.location.pathname.split("/")[1] + "/api/custom/", "/api/custom/");
                            EcArray.removeDuplicates(servicePrefixes);
                            for (var j = 0; j < hostnames.length; j++) {
                                for (var k = 0; k < servicePrefixes.length; k++) {
                                    for (var i = 0; i < protocols.length; i++) {
                                        me.autoDetectRepositoryActualAsync(protocols[i] + "//" + hostnames[j] + servicePrefixes[k].replaceAll("//", "/"), success, failure);
                                        setTimeout(function() {
                                            if (me.autoDetectFound == false) 
                                                failure("Could not find service.");
                                        }, 5000);
                                    }
                                }
                            }
                        }
                    }, 5000);
                }
            }
        }
    };
    /**
     *  Searches known repository endpoints to set the server configuration for
     *  this repositories instance
     * 
     *  @memberOf EcRepository
     *  @method autoDetectRepository
     */
    prototype.autoDetectRepository = function() {
        EcRemote.async = false;
        var protocols = new Array();
        if (window != null) {
            if (window.location != null) {
                if (window.location.protocol == "https:") {
                    protocols.push("https:");
                }
            }
        }
        if (window != null) {
            if (window.location != null) {
                if (window.location.protocol == "http:") {
                    protocols.push("http:");
                    protocols.push("https:");
                }
            }
        }
        if (protocols.length == 0) {
            protocols.push("https:");
            protocols.push("http:");
        }
        var hostnames = new Array();
        var servicePrefixes = new Array();
        if (this.selectedServer != null && window != null && window.document != null) {
            var e = window.document.createElement("a");
            if (e != null) {
                (e)["href"] = this.selectedServer;
                hostnames.push((e)["host"]);
                servicePrefixes.push((e)["pathname"]);
            }
        } else if (window != null && window.location != null) {
            if (window.location.host != null) {
                hostnames.push(window.location.host, window.location.host.replace(".", ".service."), window.location.host + ":8080", window.location.host.replace(".", ".service.") + ":8080");
            }
            if (window.location.hostname != null) {
                hostnames.push(window.location.hostname, window.location.hostname.replace(".", ".service."), window.location.hostname + ":8080", window.location.hostname.replace(".", ".service.") + ":8080");
            }
        }
        if (window != null) {
            if (window.location != null) {
                servicePrefixes.push("/" + window.location.pathname.split("/")[1] + "/api/");
                servicePrefixes.push("/" + window.location.pathname.split("/")[1] + "/api/custom/");
            }
        }
        if (hostnames.length == 0) {
            hostnames.push("localhost", "localhost:8080");
        }
        servicePrefixes.push("/");
        servicePrefixes.push("/service/");
        servicePrefixes.push("/api/");
        servicePrefixes.push("/api/custom/");
        for (var j = 0; j < hostnames.length; j++) {
            for (var k = 0; k < servicePrefixes.length; k++) {
                for (var i = 0; i < protocols.length; i++) {
                    if (this.autoDetectRepositoryActual(protocols[i] + "//" + hostnames[j] + servicePrefixes[k].replaceAll("//", "/"))) {
                        EcRemote.async = true;
                        return;
                    }
                }
            }
        }
        EcRemote.async = true;
    };
    /**
     *  Handles the actual detection of repository endpoint /ping service
     * 
     *  @param {String} guess The server prefix
     *  @return {boolean} Whether the detection successfully found the endpoint
     *  @memberOf EcRepository
     *  @method autoDetectRepositoryAsync
     *  @private
     */
    prototype.autoDetectRepositoryActualAsync = function(guess, success, failure) {
        var me = this;
        var successCheck = function(p1) {
            if (p1 != null) {
                if ((p1)["ping"] == "pong") {
                    if ((p1)["time"] != null) 
                        me.timeOffset = (new Date().getTime()) - ((p1)["time"]);
                    if (me.autoDetectFound == false) {
                        me.selectedServer = guess;
                        me.autoDetectFound = true;
                        success();
                    }
                }
            }
        };
        var failureCheck = function(p1) {
            if (p1 != null) {
                if (!(p1 == "")) {
                    try {
                        if (p1.indexOf("pong") != -1) {
                            if (me.autoDetectFound == false) {
                                me.selectedServer = guess;
                                me.autoDetectFound = true;
                                success();
                            }
                        }
                    }catch (ex) {}
                }
            }
        };
        if (guess != null && guess != "") {
            try {
                EcRemote.getExpectingObject(guess, "ping", successCheck, failureCheck);
            }catch (ex) {}
        }
        return this.autoDetectFound;
    };
    /**
     *  Handles the actual detection of repository endpoint /ping service
     * 
     *  @param {String} guess The server prefix
     *  @return {boolean} Whether the detection successfully found the endpoint
     *  @memberOf EcRepository
     *  @method autoDetectRepositoryActual
     *  @private
     */
    prototype.autoDetectRepositoryActual = function(guess) {
        var oldTimeout = EcRemote.timeout;
        EcRemote.timeout = 500;
        var me = this;
        var successCheck = function(p1) {
            if (p1 != null) {
                if ((p1)["ping"] == "pong") {
                    if ((p1)["time"] != null) 
                        me.timeOffset = (new Date().getTime()) - ((p1)["time"]);
                    me.selectedServer = guess;
                    me.autoDetectFound = true;
                }
            }
        };
        var failureCheck = function(p1) {
            if (p1 != null) {
                if (p1 != "") {
                    try {
                        if (p1.indexOf("pong") != -1) {
                            me.selectedServer = guess;
                            me.autoDetectFound = true;
                        }
                    }catch (ex) {}
                }
            }
        };
        if (guess != null && guess != "") {
            try {
                EcRemote.getExpectingObject(guess, "ping", successCheck, failureCheck);
            }catch (ex) {}
        }
        EcRemote.timeout = oldTimeout;
        return this.autoDetectFound;
    };
    /**
     *  Lists all types visible to the current user in the repository
     *  <p>
     *  Uses a signature sheet gathered from {@link EcIdentityManager}.
     * 
     *  @param {Callback1<Object[]>} success Success event
     *  @param {Callback1<String>}   failure Failure event.
     *  @memberOf EcRepository
     *  @method listTypes
     */
    prototype.listTypes = function(success, failure) {
        var fd = new FormData();
        fd.append("signatureSheet", EcIdentityManager.signatureSheet(60000 + this.timeOffset, this.selectedServer));
        EcRemote.postExpectingObject(this.selectedServer, "sky/repo/types", fd, function(p1) {
            var results = p1;
            if (success != null) {
                success(results);
            }
        }, failure);
    };
    /**
     *  Backs up the skyrepo elasticsearch database to the server backup directory
     * 
     *  @param {String}            serverSecret Secret string stored on the server to authenticate administrative rights
     *  @param {Callback1<Object>} success Success event
     *  @param {Callback1<String>} failure Failure event.
     *  @memberOf EcRepository
     *  @method backup
     */
    prototype.backup = function(serverSecret, success, failure) {
        EcRemote.getExpectingObject(this.selectedServer, "util/backup?secret=" + serverSecret, success, failure);
    };
    /**
     *  Restores the skyrepo elasticsearch backup from the server backup directory
     * 
     *  @param {String}            serverSecret Secret string stored on the server to authenticate administrative rights
     *  @param {Callback1<Object>} success Success event
     *  @param {Callback1<String>} failure Failure event.
     *  @memberOf EcRepository
     *  @method restoreBackup
     */
    prototype.restoreBackup = function(serverSecret, success, failure) {
        EcRemote.getExpectingObject(this.selectedServer, "util/restore?secret=" + serverSecret, success, failure);
    };
    /**
     *  Wipes all data from the the skyrepo elasticsearch, can only be restored by using backup restore
     * 
     *  @param {String}            serverSecret Secret string stored on the server to authenticate administrative rights
     *  @param {Callback1<Object>} success Success event
     *  @param {Callback1<String>} failure Failure event.
     *  @memberOf EcRepository
     *  @method wipe
     */
    prototype.wipe = function(serverSecret, success, failure) {
        EcRemote.getExpectingObject(this.selectedServer, "util/purge?secret=" + serverSecret, success, failure);
    };
    /**
     *  Handles the search results in search by params, before returning them
     *  with the callback passed into search method
     * 
     *  @param {EcRemoteLinkedData[]}            results Results to handle before returning
     *  @param {Callback1<EcRemoteLinkedData>}   eachSuccess Callback function to
     *                                           trigger for each search result
     *  @param {Callback1<EcRemoteLinkedData[]>} success Callback function to
     *                                           trigger with all search results
     *  @param failure
     *  @memberOf EcRepository
     *  @method handleSearchResults
     *  @private
     */
    prototype.handleSearchResults = function(results, eachSuccess, success, failure) {
        if (results == null) {
            if (failure != null) 
                failure("Error in search. See HTTP request for more details.");
            return null;
        }
        for (var i = 0; i < results.length; i++) {
            var d = new EcRemoteLinkedData(null, null);
            d.copyFrom(results[i]);
            results[i] = d;
            if (EcRepository.caching) {
                (EcRepository.cache)[d.shortId()] = d;
                (EcRepository.cache)[d.id] = d;
            }
            if (eachSuccess != null) {
                eachSuccess(results[i]);
            }
        }
        if (success != null) {
            success(results);
        }
        return results;
    };
    /**
     *  Fetches the admin keys from the server to compare for check if current
     *  user is an admin user
     * 
     *  @param {Callback1<String[]>} success
     *                               Callback triggered when the admin keys are successfully returned,
     *                               returns an array of the admin public keys
     *  @param {Callback1<String>}   failure
     *                               Callback triggered if error occurs fetching admin keys
     *  @memberOf EcRemoteIdentityManager
     *  @method fetchServerAdminKeys
     */
    prototype.fetchServerAdminKeys = function(success, failure) {
        var service;
        if (this.selectedServer.endsWith("/")) {
            service = "sky/admin";
        } else {
            service = "/sky/admin";
        }
        var me = this;
        EcRemote.getExpectingObject(this.selectedServer, service, function(p1) {
            var ary = p1;
            me.adminKeys = new Array();
            for (var i = 0; i < ary.length; i++) {
                me.adminKeys.push(ary[i]);
            }
            success(ary);
        }, function(p1) {
            failure("");
        });
    };
    constructor.getAs = function(id, result, success, failure) {
        EcRepository.get(id, function(p1) {
            if (p1.getClass() == result.getClass()) 
                if (success != null) {
                    success(p1);
                    return;
                }
            EcEncryptedValue.fromEncryptedValueAsync(p1, function(p1) {
                if (p1.isAny(result.getTypes())) {
                    result.copyFrom(p1);
                    if (EcRepository.caching) {
                        (EcRepository.cache)[result.shortId()] = result;
                        (EcRepository.cache)[result.id] = result;
                    }
                    if (success != null) 
                        success(result);
                } else {
                    var msg = "Retrieved object was not a " + result.getFullType();
                    if (failure != null) 
                        failure(msg);
                     else 
                        console.error(msg);
                }
            }, failure);
        }, failure);
    };
    constructor.getBlockingAs = function(id, result) {
        var p1 = EcRepository.getBlocking(id);
        if (p1 == null) 
            return null;
        if (p1.getClass() == result.getClass()) 
            return p1;
        p1 = EcEncryptedValue.fromEncryptedValue(p1);
        if (p1.isAny(result.getTypes())) {
            result.copyFrom(p1);
            if (EcRepository.caching) {
                (EcRepository.cache)[result.shortId()] = result;
                (EcRepository.cache)[result.id] = result;
            }
            return result;
        } else {
            var msg = "Retrieved object was not a " + result.getFullType();
            console.error(msg);
            return null;
        }
    };
    constructor.searchAs = function(repo, query, factory, success, failure, paramObj) {
        if (paramObj == null) 
            paramObj = new Object();
        var template = (factory());
        var queryAdd = template.getSearchStringByType();
        (paramObj)["index_hint"] = "*" + template.type.toLowerCase();
        if (query == null || query == "") 
            query = queryAdd;
         else 
            query = "(" + query + ") AND " + queryAdd;
        repo.searchWithParams(query, paramObj, null, function(p1s) {
            var eah = new EcAsyncHelper();
            if (success != null) {
                eah.eachSet(p1s, function(p1, set) {
                    EcEncryptedValue.fromEncryptedValueAsync(p1, function(p1) {
                        var result = factory();
                        if (p1.isAny(result.getTypes())) {
                            result.copyFrom(p1);
                            set(result);
                        }
                    }, EcAsyncHelper.setNull(set));
                }, function(results) {
                    success(results);
                });
            }
        }, failure);
    };
}, {cache: "Object", fetching: "Object", repos: {name: "Array", arguments: ["EcRepository"]}, adminKeys: {name: "Array", arguments: [null]}}, {});
/**
 *  Implementation of a file with methods for communicating with repository services
 * 
 *  @author devlin.junker@eduworks.com
 *  @module com.eduworks.ec
 *  @class EcFile
 *  @extends GeneralFile
 *  @constructor
 */
var EcFile = function() {
    GeneralFile.call(this);
};
EcFile = stjs.extend(EcFile, GeneralFile, [], function(constructor, prototype) {
    /**
     *  Factory method for creating a file with certain values
     * 
     *  @param {String} name
     *                  Name of the file to be created
     *  @param {String} base64Data
     *                  Base 64 encoded file data
     *  @param {String} mimeType
     *                  MIME Type of the file
     *  @return {EcFile}
     *  The file created
     *  @memberOf EcFile
     *  @method create
     *  @static
     */
    constructor.create = function(name, base64Data, mimeType) {
        var f = new EcFile();
        f.data = base64Data;
        f.name = name;
        f.mimeType = mimeType;
        return f;
    };
    /**
     *  Retrieves a file from the server specified by it's ID
     * 
     *  @param {String}            id
     *                             ID of the file data to be retrieved
     *  @param {Callback1<EcFile>} success
     *                             Callback triggered if successfully retrieved from the server,
     *                             returns the retrieved file
     *  @param {Callback1<String>} failure
     *                             Callback triggered if error occurs while retrieving file from server
     *  @memberOf EcFile
     *  @method get
     *  @static
     */
    constructor.get = function(id, success, failure) {
        EcRepository.getAs(id, new EcFile(), success, failure);
    };
    constructor.getBlocking = function(id) {
        return EcRepository.getBlockingAs(id, new EcFile());
    };
    /**
     *  Searches the repository given for files that match the query passed in
     * 
     *  @param {EcRepository}       repo
     *                              Repository to search for files
     *  @param {String}             query
     *                              Query to user for search
     *  @param {Callback1<EcFile[]> success
     *                              Callback triggered after search completes,
     *                              returns results
     *  @param {Callback1<String>}  failure
     *                              Callback triggered if error occurs while searching
     *  @param {Object}             paramObj
     *                              Parameters to pass to search
     *  @memberOf EcFile
     *  @method search
     *  @static
     */
    constructor.search = function(repo, query, success, failure, paramObj) {
        EcRepository.searchAs(repo, query, function() {
            return new EcFile();
        }, success, failure, paramObj);
    };
    /**
     *  Saves this file in the repository using the repository web services
     * 
     *  @param {Callback1<String>} success
     *                             Callback triggered if successfully saved
     *  @param {Callback1<String>} failure
     *                             Callback triggered if error occurs while saving
     *  @memberOf EcFile
     *  @method save
     */
    prototype.save = function(success, failure) {
        if (this.name == null || this.name == "") {
            var msg = "File Name can not be empty";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        EcRepository.save(this, success, failure);
    };
    /**
     *  Deletes the file from the repository using repository web services
     * 
     *  @param {Callback1<String>} success
     *                             Callback triggered if successfully deleted
     *  @param {Callback1<String>} failure
     *                             Callback triggered if error occurs while deleting
     *  @memberOf EcFile
     *  @method _delete
     */
    prototype._delete = function(repo, success, failure) {
        repo.constructor.DELETE(this, success, failure);
    };
}, {owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
