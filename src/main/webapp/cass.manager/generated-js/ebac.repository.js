/**
 *  Represents an encrypted piece of data. Provides helper functions for
 *  encryption/decryption of JSON-LD objects, and provides some searchability of
 *  the data within.
 * 
 *  @module com.eduworks.ec
 *  @class EcEncryptedValue
 *  @extends EbacEncryptedValue
 * 
 *  @author fritz.ray@eduworks.com
 */
var EcEncryptedValue = function() {
    EbacEncryptedValue.call(this);
};
EcEncryptedValue = stjs.extend(EcEncryptedValue, EbacEncryptedValue, [], function(constructor, prototype) {
    constructor.revive = function(partiallyRehydratedObject) {
        var v = new EcEncryptedValue();
        v.copyFrom(partiallyRehydratedObject);
        return v;
    };
    /**
     *  Converts a piece of remote linked data to an encrypted value
     * 
     *  @memberOf EcEncryptedValue
     *  @method toEncryptedValue
     *  @static
     *  @param {EcRemoteLinkedData} d Data to encrypt
     *  @param {boolean} hideType Flag to hide the type of the encrypted value
     *  when encrypting
     *  @return {EcEncryptedValue} Encrypted value
     */
    constructor.toEncryptedValue = function(d, hideType) {
        d.updateTimestamp();
        var v = new EcEncryptedValue();
        if (!hideType) {
            v.encryptedType = d.type;
        }
        var newIv = EcAes.newIv(16);
        var newSecret = EcAes.newIv(16);
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
        return v;
    };
    /**
     *  Converts a piece of remote linked data to an encrypted value,
     *  asynchronously
     * 
     *  @memberOf EcEncryptedValue
     *  @method toEncryptedValueAsync
     *  @static
     *  @param {EcRemoteLinkedData} d Data to encrypt
     *  @param {boolean} hideType Flag to hide the type of the encrypted value
     *  when encrypting
     *  @param {Callback1<EcEncryptedValue>} success Callback triggered with
     *  successfully encrypted, returns the encrypted value
     *  @param {Callback1<String>} failure Callback triggered on error during
     *  encryption
     */
    constructor.toEncryptedValueAsync = function(d, hideType, success, failure) {
        d.updateTimestamp();
        var v = new EcEncryptedValue();
        if (!hideType) {
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
                    var eSecret = new EbacEncryptedSecret();
                    eSecret.iv = newIv;
                    eSecret.secret = newSecret;
                    if (v.secret == null) {
                        v.secret = new Array();
                    }
                    EcRsaOaepAsync.encrypt(EcPk.fromPem(pk), eSecret.toEncryptableJson(), function(encryptedSecret) {
                        v.secret.push(encryptedSecret);
                        arg1();
                    }, failure);
                }, function(arg0) {
                    if (d.reader != null) {
                        new EcAsyncHelper().each(d.reader, function(pk, arg1) {
                            var eSecret = new EbacEncryptedSecret();
                            eSecret.iv = newIv;
                            eSecret.secret = newSecret;
                            if (v.secret == null) {
                                v.secret = new Array();
                            }
                            EcRsaOaepAsync.encrypt(EcPk.fromPem(pk), eSecret.toEncryptableJson(), function(encryptedSecret) {
                                v.secret.push(encryptedSecret);
                                arg1();
                            }, failure);
                        }, function(arg0) {
                            success(v);
                        });
                    }
                });
            }
        }, failure);
    };
    /**
     *  Encrypts a text value with the key provided
     * 
     *  @memberOf EcEncryptedValue
     *  @method encryptValueOld
     *  @static
     *  @deprecated
     *  @param {String} text Text to encrypt
     *  @param {String} id ID of the encrypted value
     *  @param {EcPk} owner Key to Encrypt
     *  @return {EcEncryptedValue} Encrypted value
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
     *  @memberOf EcEncryptedValue
     *  @method encryptValue
     *  @static
     *  @param {String} text Text to encrypt
     *  @param {String} id ID of the value to encrypt
     *  @param {String[]} owners Owner keys to encrypt value with
     *  @param {String[]} readers Reader keys to encrypt value with
     *  @return {EcEncryptedValue} Encrypted value
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
     *  Encrypt a value with a specific IV and secret
     * 
     *  @memberOf EcEncryptedValue
     *  @method encryptValueUsingIvAndSecret
     *  @static
     *  @param {String} iv Initialization Vector for encryption
     *  @param {String} secret Encryption secret
     *  @param {String} text Text to encrypt
     *  @param {String} id ID of value to encrypt
     *  @param {String[]} owners Owners keys to encrypt with
     *  @param {String[]} readers Reader Keys to encrypt with
     *  @return {EcEncryptedValue}
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
     *  Decrypts this encrypted value into an object
     * 
     *  @memberOf EcEncryptedValue
     *  @method decryptIntoObject
     *  @return The Decrypted Object
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
     *  @memberOf EcEncryptedValue
     *  @method decryptIntoObjectAsync
     *  @param {Callback1<EcRemoteLinkedDat>} success Callback triggered on
     *  successful encryption, returns the decrypted object
     *  @param {Callback1<String>} failure Callback triggered if error during
     *  encryption
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
     *  @memberOf EcEncryptedValue
     *  @method decryptIntoObjectUsingIvAndSecretAsync
     *  @param {String} iv Initialization Vector for decryption
     *  @param {String} secret Secret for decryption
     *  @param {Callback1<EcRemoteLinkedData>} success Callback triggered after
     *  successful decryption
     *  @param {Callback1<String>} failure Callback triggered if error during
     *  decryption
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
     *  @memberOf EcEncryptedValue
     *  @method decryptIntoString
     *  @return {String} Decrypted string value
     */
    prototype.decryptIntoString = function() {
        var decryptSecret = this.decryptSecret();
        if (decryptSecret != null) {
            return EcAesCtr.decrypt(this.payload, decryptSecret.secret, decryptSecret.iv);
        }
        return null;
    };
    /**
     *  Asynchronously decrypts an encrypted value into a string
     * 
     *  @memberOf EcEncryptedValue
     *  @method decryptIntoStringAsync
     *  @param {Callback1<String>} success Callback triggered after successfully
     *  decrypted, returns decrypted string
     *  @param {Callback1<String>} failure Callback triggered if error during
     *  decryption
     */
    prototype.decryptIntoStringAsync = function(success, failure) {
        var me = this;
        this.decryptSecretAsync(function(decryptSecret) {
            if (decryptSecret != null) {
                EcAesCtrAsync.decrypt(me.payload, decryptSecret.secret, decryptSecret.iv, success, failure);
            }
        }, failure);
    };
    /**
     *  Asynchronously decrypts an encrypted value into a string with an IV and
     *  secrete provided
     * 
     *  @memberOf EcEncryptedValue
     *  @method decryptIntoStringUsingIvAndSecretAsync
     *  @param {String} iv Initialization Vector for decryption
     *  @param {String} secret Secret for decryption
     *  @param {Callback1<String>} success Callback triggered on successful
     *  decryption
     *  @param {Callback1<String>} failure Callback triggered if error during
     *  decryption
     */
    prototype.decryptIntoStringUsingIvAndSecretAsync = function(iv, secret, success, failure) {
        EcAesCtrAsync.decrypt(this.payload, secret, iv, success, failure);
    };
    /**
     *  Attempts to decrypt the secret by using all Identities in the Identity
     *  Manager
     * 
     *  @memberOf EcEncryptedValue
     *  @method decryptSecret
     *  @return {EbacEncryptedSecret} Secret after decrypted
     */
    prototype.decryptSecret = function() {
        if (this.owner != null) {
            for (var i = 0; i < this.owner.length; i++) {
                var decryptionKey = EcIdentityManager.getPpk(EcPk.fromPem(this.owner[i]));
                if (decryptionKey == null) {
                    continue;
                }
                var decrypted = this.decryptSecretByKey(decryptionKey);
                if (decrypted != null) {
                    return decrypted;
                }
            }
        }
        if (this.reader != null) {
            for (var i = 0; i < this.reader.length; i++) {
                var decryptionKey = EcIdentityManager.getPpk(EcPk.fromPem(this.reader[i]));
                if (decryptionKey == null) {
                    continue;
                }
                var decrypted = this.decryptSecretByKey(decryptionKey);
                if (decrypted != null) {
                    return decrypted;
                }
            }
        }
        for (var i = 0; i < EcIdentityManager.ids.length; i++) {
            var decryptionKey = EcIdentityManager.ids[i].ppk;
            var decrypted = this.decryptSecretByKey(decryptionKey);
            if (decrypted != null) {
                return decrypted;
            }
        }
        return null;
    };
    /**
     *  Asynchronously attempts to decrypt secret using all identities in
     *  Identity Manager
     * 
     *  @memberOf EcEncryptedValue
     *  @method decryptSecretAsync
     *  @param {Callback1<EbacEncryptedSecret>} success Callback triggered after
     *  successfully decrypting secret, returns the decrypted secret
     *  @param {Callback1<String>} failure Callback triggered if error decrypting
     *  secret
     */
    prototype.decryptSecretAsync = function(success, failure) {
        var ppks = new Array();
        if (this.owner != null) {
            for (var i = 0; i < this.owner.length; i++) {
                var decryptionKey = EcIdentityManager.getPpk(EcPk.fromPem(this.owner[i]));
                if (decryptionKey != null) {
                    if (!decryptionKey.inArray(ppks)) {
                        ppks.push(decryptionKey);
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
                    }
                }
            }
        }
        for (var i = 0; i < EcIdentityManager.ids.length; i++) {
            var decryptionKey = EcIdentityManager.ids[i].ppk;
            if (decryptionKey != null) {
                if (!decryptionKey.inArray(ppks)) {
                    ppks.push(decryptionKey);
                }
            }
        }
        var me = this;
        var helper = new EcAsyncHelper();
        helper.each(ppks, function(decryptionKey, countdown) {
            me.decryptSecretByKeyAsync(decryptionKey, function(p1) {
                if (helper.counter == -1) {
                    return;
                }
                helper.stop();
                success(p1);
            }, function(arg0) {
                countdown();
            });
        }, function(arg0) {
            failure("Could not decrypt secret.");
        });
    };
    /**
     *  Attempts to decrypt secret with a specific key
     * 
     *  @memberOf EcEncryptedValue
     *  @method decryptSecretByKey
     *  @param {EcPpk} decryptionKey Key to attempt secret decryption
     *  @return {EbacEncryptedSecret} Decrypted Secret
     */
    prototype.decryptSecretByKey = function(decryptionKey) {
        var encryptedSecret = null;
        if (this.secret != null) {
            for (var j = 0; j < this.secret.length; j++) {
                try {
                    var decryptedSecret = null;
                    decryptedSecret = EcRsaOaep.decrypt(decryptionKey, this.secret[j]);
                    if (!EcLinkedData.isProbablyJson(decryptedSecret)) {
                        continue;
                    }
                    encryptedSecret = EbacEncryptedSecret.fromEncryptableJson(JSON.parse(decryptedSecret));
                }catch (ex) {}
            }
        }
        return encryptedSecret;
    };
    /**
     *  Asynchronously attempts to decrypt secret with a specific key
     * 
     *  @memberOf EcEncryptedValue
     *  @method decryptSecretByKeyAsync
     *  @param {EcPpk} decryptionKey Key to attempt secret decryption
     *  @param {Callback1<EbacEncryptedSecret>} success Callback triggered after
     *  successful decryption of secret, returns decrypted secret
     *  @param {Callback1<String>} failure Callback triggered if error during
     *  secret decryption
     */
    prototype.decryptSecretByKeyAsync = function(decryptionKey, success, failure) {
        var encryptedSecret = null;
        if (this.secret != null) {
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
        } else 
            failure("Secret field is empty.");
    };
    /**
     *  Checks if this encrypted value is an encrypted version of a specific
     *  type, only works if the type wasn't hidden during encryption
     * 
     *  @memberOf EcEncryptedValue
     *  @method isAnEncrypted
     *  @param {String} type Type to compare if an encrypted type
     *  @return {boolean} True if encrypted version of type, false if not or
     *  can't tell
     */
    prototype.isAnEncrypted = function(type) {
        if (this.encryptedType == null) {
            return false;
        }
        var typeSplit = (type.split("/"));
        return this.encryptedType.equals(type) || this.encryptedType.equals(typeSplit[typeSplit.length - 1]);
    };
    /**
     *  Adds a reader to the object, if the reader does not exist.
     * 
     *  @memberOf EcEncryptedValue
     *  @method addReader
     *  @param {EcPk} newReader PK of the new reader.
     */
    prototype.addReader = function(newReader) {
        var pem = newReader.toPem();
        if (this.reader == null) {
            this.reader = new Array();
        }
        for (var i = 0; i < this.reader.length; i++) {
            if (this.reader[i].equals(pem)) {
                return;
            }
        }
        this.reader.push(pem);
        var payloadSecret = this.decryptSecret();
        if (payloadSecret == null) {
            console.error("Cannot add a Reader if you don't know the secret");
            return;
        }
        EcArray.setAdd(this.secret, EcRsaOaep.encrypt(newReader, payloadSecret.toEncryptableJson()));
    };
    /**
     *  Removes a reader from the object, if the reader does exist.
     * 
     *  @memberOf EcEncryptedValue
     *  @method removeReader
     *  @param {EcPk} oldReader PK of the old reader.
     */
    prototype.removeReader = function(oldReader) {
        var pem = oldReader.toPem();
        if (this.reader == null) {
            this.reader = new Array();
        }
        for (var i = 0; i < this.reader.length; i++) {
            if (this.reader[i].equals(pem)) {
                this.reader.splice(i, 1);
            }
        }
    };
    constructor.encryptOnSaveMap = null;
    /**
     *  Setter and getter function for encryptOnSave of an identifier,
     *  encryptOnSave is used by the static save functions of a class to
     *  determine whether or not to encrypt something when it is saved. This
     *  value is usually set when an object is decrypted using one of the decrypt
     *  functions above.
     * 
     *  @memberOf EcEncryptedValue
     *  @method encryptOnSave
     *  @static
     *  @param {String} id ID of the data to get/set encryptOnSave for
     *  @param {boolean} [val] If passed in, sets the value, if null this
     *  function gets the encryptOnSave value
     *  @return {boolean} if val is null/ignored returns value in the map, if val
     *  is passed in returns val
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
}, {encryptOnSaveMap: {name: "Map", arguments: [null, null]}, secret: {name: "Array", arguments: [null]}, owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  A representation of a file.
 *  
 *  @module com.eduworks.ec
 *  @class GeneralFile
 *  @extends EcRemoteLinkedData
 *  @constructor
 *  
 *  @author fritz.ray@eduworks.com
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
var EcRepository = function() {};
EcRepository = stjs.extend(EcRepository, null, [], function(constructor, prototype) {
    prototype.selectedServer = null;
    constructor.caching = false;
    constructor.cachingSearch = false;
    constructor.unsigned = false;
    constructor.cache = new Object();
    constructor.fetching = new Object();
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
            if (url.startsWith(this.selectedServer) && (EcRepository.cache)[url] == null) {
                cacheUrls.push(url.replace(this.selectedServer, "").replace("custom/", ""));
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
            EcRemote.postExpectingObject(me.selectedServer, "sky/repo/multiGet", fd, function(p1) {
                var results = p1;
                for (var i = 0; i < results.length; i++) {
                    var d = new EcRemoteLinkedData(null, null);
                    d.copyFrom(results[i]);
                    results[i] = d;
                    if (EcRepository.caching) {
                        (EcRepository.cache)[d.shortId()] = d;
                        (EcRepository.cache)[d.id] = d;
                    }
                }
                if (success != null) {
                    success();
                }
            }, null);
        } else 
            EcIdentityManager.signatureSheetAsync(60000, this.selectedServer, function(p1) {
                fd.append("signatureSheet", p1);
                EcRemote.postExpectingObject(me.selectedServer, "sky/repo/multiGet", fd, function(p1) {
                    var results = p1;
                    for (var i = 0; i < results.length; i++) {
                        var d = new EcRemoteLinkedData(null, null);
                        d.copyFrom(results[i]);
                        results[i] = d;
                        if (EcRepository.caching) {
                            (EcRepository.cache)[d.shortId()] = d;
                            (EcRepository.cache)[d.id] = d;
                        }
                    }
                    if (success != null) {
                        success();
                    }
                }, null);
            });
    };
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
        if (EcRepository.caching) {
            if ((EcRepository.cache)[url] != null) {
                if (EcRemote.async) {
                    Task.immediate(function() {
                        success((EcRepository.cache)[url]);
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
                            EcRepository.get(url, success, failure);
                        }, 100);
                        return;
                    }
                }
                (EcRepository.fetching)[url] = new Date().getTime() + 60000;
            }
        }
        var fd = new FormData();
        if (EcRepository.unsigned) {
            EcRemote.postExpectingObject(url, null, fd, function(p1) {
                delete (EcRepository.fetching)[url];
                var d = new EcRemoteLinkedData("", "");
                d.copyFrom(p1);
                if (d.getFullType() == null) {
                    if (failure != null) {
                        failure(JSON.stringify(p1));
                    }
                    return;
                }
                if (EcRepository.caching) {
                    (EcRepository.cache)[d.id] = d;
                    (EcRepository.cache)[d.shortId()] = d;
                }
                success(d);
            }, function(p1) {
                delete (EcRepository.fetching)[url];
                if (failure != null) {
                    failure(p1);
                }
            });
        } else 
            EcIdentityManager.signatureSheetAsync(60000, url, function(p1) {
                if ((EcRepository.cache)[url] != null) {
                    delete (EcRepository.fetching)[url];
                    success((EcRepository.cache)[url]);
                    return;
                }
                fd.append("signatureSheet", p1);
                EcRemote.postExpectingObject(url, null, fd, function(p1) {
                    delete (EcRepository.fetching)[url];
                    var d = new EcRemoteLinkedData("", "");
                    d.copyFrom(p1);
                    if (d.getFullType() == null) {
                        if (failure != null) {
                            failure(JSON.stringify(p1));
                        }
                        return;
                    }
                    if (EcRepository.caching) {
                        (EcRepository.cache)[d.id] = d;
                        (EcRepository.cache)[d.shortId()] = d;
                    }
                    success(d);
                }, function(p1) {
                    delete (EcRepository.fetching)[url];
                    if (failure != null) {
                        failure(p1);
                    }
                });
            });
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
        if (EcRepository.caching) {
            if ((EcRepository.cache)[url] != null) {
                return (EcRepository.cache)[url];
            }
        }
        var fd = new FormData();
        var p1 = null;
        if (EcRepository.unsigned == false) {
            p1 = EcIdentityManager.signatureSheet(60000, url);
            fd.append("signatureSheet", p1);
        }
        var oldAsync = EcRemote.async;
        EcRemote.async = false;
        EcRemote.postExpectingObject(url, null, fd, function(p1) {
            var d = new EcRemoteLinkedData("", "");
            d.copyFrom(p1);
            if (d.getFullType() == null) {
                return;
            }
            (EcRepository.cache)[url] = d;
        }, null);
        EcRemote.async = oldAsync;
        var result = (EcRepository.cache)[url];
        if (!EcRepository.caching) {
            (EcRepository.cache)[url] = null;
        }
        return result;
    };
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
    prototype.multiget = function(urls, success, failure, cachedValues) {
        if (urls == null || urls.length == 0) {
            if (failure != null) {
                failure("");
            }
            return;
        }
        if (EcRepository.caching) {
            var cachedVals = [];
            for (var i = 0; i < urls.length; i++) {
                if ((EcRepository.cache)[urls[i]] != null) {
                    cachedVals.push((EcRepository.cache)[urls[i]]);
                }
            }
            if (cachedValues != null) 
                cachedValues(cachedVals);
        }
        var onServer = new Array();
        for (var i = 0; i < urls.length; i++) {
            var url = urls[i];
            if (url.startsWith(this.selectedServer)) {
                onServer.push(url.replace(this.selectedServer, "").replace("custom/", ""));
            }
        }
        var fd = new FormData();
        fd.append("data", JSON.stringify(onServer));
        var me = this;
        if (EcRepository.unsigned == true) 
            EcRemote.postExpectingObject(me.selectedServer, "sky/repo/multiGet", fd, function(p1) {
                var results = p1;
                for (var i = 0; i < results.length; i++) {
                    var d = new EcRemoteLinkedData(null, null);
                    d.copyFrom(results[i]);
                    results[i] = d;
                    if (EcRepository.caching) {
                        (EcRepository.cache)[d.shortId()] = d;
                        (EcRepository.cache)[d.id] = d;
                    }
                }
                if (success != null) {
                    success(results);
                }
            }, failure);
         else 
            EcIdentityManager.signatureSheetAsync(60000, this.selectedServer, function(p1) {
                fd.append("signatureSheet", p1);
                EcRemote.postExpectingObject(me.selectedServer, "sky/repo/multiGet", fd, function(p1) {
                    var results = p1;
                    for (var i = 0; i < results.length; i++) {
                        var d = new EcRemoteLinkedData(null, null);
                        d.copyFrom(results[i]);
                        results[i] = d;
                        if (EcRepository.caching) {
                            (EcRepository.cache)[d.shortId()] = d;
                            (EcRepository.cache)[d.id] = d;
                        }
                    }
                    if (success != null) {
                        success(results);
                    }
                }, failure);
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
     *  Search a repository for JSON-LD compatible data.
     *  <p>
     *  Uses a signature sheet gathered from {@link EcIdentityManager}.
     * 
     *  @param {String}                          query ElasticSearch compatible query string, similar to
     *                                           Google query strings.
     *  @param {Object}                          paramObj Additional parameters that can be used to tailor
     *                                           the search.
     *  @param size
     *  @param start
     *  @param {Callback1<EcRemoteLinkedData>}   eachSuccess Success event for each
     *                                           found object.
     *  @param {Callback1<EcRemoteLinkedData[]>} success Success event, called
     *                                           after eachSuccess.
     *  @param {Callback1<String>}               failure Failure event.
     *  @memberOf EcRepository
     *  @method searchWithParams
     */
    prototype.searchWithParams = function(originalQuery, originalParamObj, eachSuccess, success, failure) {
        var query = originalQuery;
        var paramObj = originalParamObj;
        if (paramObj == null) {
            paramObj = new Object();
        }
        var params = new Object();
        var paramProps = (params);
        if ((paramObj)["start"] != null) {
            paramProps["start"] = (paramObj)["start"];
        }
        if ((paramObj)["size"] != null) {
            paramProps["size"] = (paramObj)["size"];
        }
        if ((paramObj)["types"] != null) {
            paramProps["types"] = (paramObj)["types"];
        }
        if ((paramObj)["ownership"] != null) {
            var ownership = (paramObj)["ownership"];
            if (!query.startsWith("(") || !query.endsWith(")")) {
                query = "(" + query + ")";
            }
            if (ownership.equals("public")) {
                query += " AND (_missing_:@owner)";
            } else if (ownership.equals("owned")) {
                query += " AND (_exists_:@owner)";
            } else if (ownership.equals("me")) {
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
        if ((paramObj)["fields"] != null) {
            paramProps["fields"] = (paramObj)["fields"];
        }
        var cacheKey;
        if (EcRepository.cachingSearch) {
            cacheKey = JSON.stringify(paramProps) + query;
            if ((EcRepository.cache)[cacheKey] != null) {
                this.handleSearchResults((EcRepository.cache)[cacheKey], eachSuccess, success);
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
                me.handleSearchResults(p1, eachSuccess, success);
            }, function(p1) {
                if (cacheKey != null) {
                    delete (EcRepository.fetching)[cacheKey];
                }
                if (failure != null) {
                    failure(p1);
                }
            });
        } else 
            EcIdentityManager.signatureSheetAsync(60000, this.selectedServer, function(signatureSheet) {
                fd.append("signatureSheet", signatureSheet);
                EcRemote.postExpectingObject(me.selectedServer, "sky/repo/search", fd, function(p1) {
                    if (EcRepository.cachingSearch) {
                        (EcRepository.cache)[cacheKey] = p1;
                    }
                    if (cacheKey != null) {
                        delete (EcRepository.fetching)[cacheKey];
                    }
                    me.handleSearchResults(p1, eachSuccess, success);
                }, function(p1) {
                    if (cacheKey != null) {
                        delete (EcRepository.fetching)[cacheKey];
                    }
                    if (failure != null) {
                        failure(p1);
                    }
                });
            });
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
        servicePrefixes.push("/" + window.location.pathname.split("/")[1] + "/api/", "/" + window.location.pathname.split("/")[1] + "/api/custom/", "/", "/service/", "/api/", "/api/custom/");
        var me = this;
        me.autoDetectFound = false;
        for (var j = 0; j < hostnames.length; j++) {
            for (var k = 0; k < servicePrefixes.length; k++) {
                for (var i = 0; i < protocols.length; i++) {
                    this.autoDetectRepositoryActualAsync(protocols[i] + "//" + hostnames[j] + servicePrefixes[k].replaceAll("//", "/"), success, failure);
                    setTimeout(function() {
                        if (me.autoDetectFound == false) 
                            failure("Could not find service.");
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
        servicePrefixes.push("/" + window.location.pathname.split("/")[1] + "/api/", "/" + window.location.pathname.split("/")[1] + "/api/custom/", "/", "/service/", "/api/", "/api/custom/");
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
    prototype.autoDetectFound = false;
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
                if ((p1)["ping"].equals("pong")) {
                    me.selectedServer = guess;
                    me.autoDetectFound = true;
                    success();
                }
            }
        };
        var failureCheck = function(p1) {
            if (p1 != null) {
                if (!p1.equals("")) {
                    if (p1.contains("pong")) {
                        me.selectedServer = guess;
                        me.autoDetectFound = true;
                        success();
                    }
                }
            }
        };
        if (guess != null && guess.equals("") == false) {
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
                if ((p1)["ping"].equals("pong")) {
                    me.selectedServer = guess;
                    me.autoDetectFound = true;
                }
            }
        };
        var failureCheck = function(p1) {
            if (p1 != null) {
                if (!p1.equals("")) {
                    if (p1.contains("pong")) {
                        me.selectedServer = guess;
                        me.autoDetectFound = true;
                    }
                }
            }
        };
        if (guess != null && guess.equals("") == false) {
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
        fd.append("signatureSheet", EcIdentityManager.signatureSheet(60000, this.selectedServer));
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
        EcRemote.getExpectingObject(this.selectedServer, "skyrepo/util/backup?secret=" + serverSecret, success, failure);
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
        EcRemote.getExpectingObject(this.selectedServer, "skyrepo/util/restore?secret=" + serverSecret, success, failure);
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
        EcRemote.getExpectingObject(this.selectedServer, "skyrepo/util/purge?secret=" + serverSecret, success, failure);
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
     *  @memberOf EcRepository
     *  @method handleSearchResults
     *  @private
     */
    prototype.handleSearchResults = function(results, eachSuccess, success) {
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
     *  Attempts to save a piece of data. Does some checks before saving to
     *  ensure the data is valid. Warns the developer that they are using the
     *  repository save function rather than an object specific version, this can
     *  be avoided by calling _save
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
        console.warn("Using EcRepository 'save' method, if this is intentional consider calling '_save'");
        EcRepository._save(data, success, failure);
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
    constructor._save = function(data, success, failure) {
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
            EcIdentityManager.sign(data);
            EcRepository._saveWithoutSigning(data, success, failure);
        } else {
            EcIdentityManager.sign(data);
            EcRepository._saveWithoutSigning(data, success, failure);
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
    constructor._saveWithoutSigning = function(data, success, failure) {
        if (EcRepository.caching) {
            delete (EcRepository.cache)[data.id];
            delete (EcRepository.cache)[data.shortId()];
        }
        if (data.invalid()) {
            failure("Data is malformed.");
            return;
        }
        data.updateTimestamp();
        var fd = new FormData();
        fd.append("data", data.toJson());
        if (data.owner != null && data.owner.length > 0) {
            EcIdentityManager.signatureSheetForAsync(data.owner, 60000, data.id, function(arg0) {
                fd.append("signatureSheet", arg0);
                EcRemote.postExpectingString(data.id, "", fd, success, failure);
            });
        } else {
            EcIdentityManager.signatureSheetAsync(60000, data.id, function(arg0) {
                fd.append("signatureSheet", arg0);
                EcRemote.postExpectingString(data.id, "", fd, success, failure);
            });
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
        EcIdentityManager.signatureSheetAsync(60000, data.id, function(signatureSheet) {
            EcRemote._delete(data.shortId(), signatureSheet, success, failure);
        });
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
        EcRemote.getExpectingObject(this.selectedServer, service, function(p1) {
            success(p1);
        }, function(p1) {
            failure("");
        });
    };
}, {cache: "Object", fetching: "Object"}, {});
/**
 *  Implementation of a file with methods for communicating with repository services
 *  
 *  @module com.eduworks.ec
 *  @class EcFile
 *  @extends GeneralFile
 *  @constructor
 *  
 *  @author devlin.junker@eduworks.com
 */
var EcFile = function() {
    GeneralFile.call(this);
};
EcFile = stjs.extend(EcFile, GeneralFile, [], function(constructor, prototype) {
    /**
     *  Saves this file in the repository using the repository web services
     *  
     *  @memberOf EcFile
     *  @method save
     *  @param {Callback1<String>} success
     *  			Callback triggered if successfully saved
     *  @param {Callback1<String>} failure
     *  			Callback triggered if error occurs while saving
     */
    prototype.save = function(success, failure) {
        if (this.name == null || this.name == "") {
            var msg = "Competency Name can not be empty";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        EcRepository._save(this, success, failure);
    };
    /**
     *  Deletes the file from the repository using repository web services
     *  
     *  @memberOf EcFile
     *  @method _delete
     *  @param {Callback1<String>} success
     *  			Callback triggered if successfully deleted
     *  @param {Callback1<String>} failure
     *  			Callback triggered if error occurs while deleting
     */
    prototype._delete = function(success, failure) {
        EcRepository.DELETE(this, success, failure);
    };
    /**
     *  Factory method for creating a file with certain values
     *  
     *  @memberOf EcFile
     *  @method create
     *  @static
     *  @param {String} name
     *  			Name of the file to be created
     *  @param {String} base64Data
     *  			Base 64 encoded file data
     *  @param {String} mimeType
     *  			MIME Type of the file
     *  @return {EcFile}
     *  			The file created
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
     *  @memberOf EcFile
     *  @method get
     *  @static
     *  @param {String} id
     *  			ID of the file data to be retrieved
     *  @param {Callback1<EcFile>} success
     *  			Callback triggered if successfully retrieved from the server,
     *  			returns the retrieved file
     *  @param {Callback1<String>} failure
     *  			Callback triggered if error occurs while retrieving file from server
     */
    constructor.get = function(id, success, failure) {
        EcRepository.get(id, function(p1) {
            var f = new EcFile();
            if (p1.isA(EcEncryptedValue.myType)) {
                var encrypted = new EcEncryptedValue();
                encrypted.copyFrom(p1);
                p1 = encrypted.decryptIntoObject();
                EcEncryptedValue.encryptOnSave(p1.id, true);
            }
            if (p1 != null && p1.isA(GeneralFile.myType)) {
                f.copyFrom(p1);
                if (success != null) 
                    success(f);
            } else {
                if (failure != null) 
                    failure("Resultant object is not a competency.");
                return;
            }
        }, failure);
    };
    /**
     *  Searches the repository given for files that match the query passed in
     *  
     *  @memberOf EcFile
     *  @method search
     *  @static
     *  @param {EcRepository} repo
     *  			Repository to search for files
     *  @param {String} query
     *  			Query to user for search
     *  @param {Callback1<EcFile[]> success
     *  			Callback triggered after search completes,
     *  			returns results
     *  @param {Callback1<String>} failure
     *  			Callback triggered if error occurs while searching
     *  @param {Object} paramObj
     *  			Parameters to pass to search
     *  		@param start
     *  		@param size
     */
    constructor.search = function(repo, query, success, failure, paramObj) {
        var queryAdd = "";
        queryAdd = new GeneralFile().getSearchStringByType();
        if (query == null || query == "") 
            query = queryAdd;
         else 
            query = "(" + query + ") AND " + queryAdd;
        repo.searchWithParams(query, paramObj, null, function(p1) {
            if (success != null) {
                var ret = [];
                for (var i = 0; i < p1.length; i++) {
                    var file = new EcFile();
                    if (p1[i].isAny(file.getTypes())) {
                        file.copyFrom(p1[i]);
                    } else if (p1[i].isA(EcEncryptedValue.myType)) {
                        var val = new EcEncryptedValue();
                        val.copyFrom(p1[i]);
                        if (val.isAnEncrypted(EcFile.myType)) {
                            var obj = val.decryptIntoObject();
                            file.copyFrom(obj);
                            EcEncryptedValue.encryptOnSave(file.id, true);
                        }
                    }
                    ret[i] = file;
                }
                success(ret);
            }
        }, failure);
    };
}, {owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
