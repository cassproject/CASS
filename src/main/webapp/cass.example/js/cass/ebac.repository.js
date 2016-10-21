/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
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
    constructor.revive = function(partiallyRehydratedObject) {
        var v = new EcEncryptedValue();
        v.copyFrom(partiallyRehydratedObject);
        return v;
    };
    constructor.toEncryptedValue = function(d, hideType) {
        if (d.privateEncrypted != null) 
            delete (d)["privateEncrypted"];
        d.updateTimestamp();
        var v = new EcEncryptedValue();
        if (!hideType) 
            v.encryptedType = d.type;
        var newIv = EcAes.newIv(32);
        var newSecret = EcAes.newIv(32);
        v.payload = EcAesCtr.encrypt(d.toJson(), newSecret, newIv);
        v.owner = d.owner;
        v.reader = d.reader;
        v.id = d.id;
        if ((d)["name"] != null) 
            v.name = (d)["name"];
        if (d.owner != null) 
            for (var i = 0; i < d.owner.length; i++) {
                var eSecret = new EbacEncryptedSecret();
                eSecret.iv = newIv;
                eSecret.secret = newSecret;
                if (v.secret == null) 
                    v.secret = new Array();
                v.secret.push(EcRsaOaep.encrypt(EcPk.fromPem(d.owner[i]), eSecret.toEncryptableJson()));
            }
        if (d.reader != null) 
            for (var i = 0; i < d.reader.length; i++) {
                var eSecret = new EbacEncryptedSecret();
                eSecret.iv = newIv;
                eSecret.secret = newSecret;
                if (v.secret == null) 
                    v.secret = new Array();
                v.secret.push(EcRsaOaep.encrypt(EcPk.fromPem(d.reader[i]), eSecret.toEncryptableJson()));
            }
        return v;
    };
    constructor.toEncryptedValueAsync = function(d, hideType, success, failure) {
        d.updateTimestamp();
        var v = new EcEncryptedValue();
        if (!hideType) 
            v.encryptedType = d.type;
        var newIv = EcAes.newIv(32);
        var newSecret = EcAes.newIv(32);
        EcAesCtrAsync.encrypt(d.toJson(), newSecret, newIv, function(encryptedText) {
            v.payload = encryptedText;
            v.owner = d.owner;
            v.reader = d.reader;
            v.id = d.id;
            if ((d)["name"] != null) 
                v.name = (d)["name"];
            if (d.owner != null) 
                new EcAsyncHelper().each(d.owner, function(pk, arg1) {
                    var eSecret = new EbacEncryptedSecret();
                    eSecret.iv = newIv;
                    eSecret.secret = newSecret;
                    if (v.secret == null) 
                        v.secret = new Array();
                    EcRsaOaepAsync.encrypt(EcPk.fromPem(pk), eSecret.toEncryptableJson(), function(encryptedSecret) {
                        v.secret.push(encryptedSecret);
                        arg1();
                    }, failure);
                }, function(arg0) {
                    if (d.reader != null) 
                        new EcAsyncHelper().each(d.reader, function(pk, arg1) {
                            var eSecret = new EbacEncryptedSecret();
                            eSecret.iv = newIv;
                            eSecret.secret = newSecret;
                            if (v.secret == null) 
                                v.secret = new Array();
                            EcRsaOaepAsync.encrypt(EcPk.fromPem(pk), eSecret.toEncryptableJson(), function(encryptedSecret) {
                                v.secret.push(encryptedSecret);
                                arg1();
                            }, failure);
                        }, function(arg0) {
                            success(v);
                        });
                });
        }, failure);
    };
    constructor.encryptValueOld = function(text, id, fieldName, owner) {
        var v = new EcEncryptedValue();
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
    constructor.encryptValue = function(text, id, fieldName, owners, readers) {
        var v = new EcEncryptedValue();
        var newIv = EcAes.newIv(32);
        var newSecret = EcAes.newIv(32);
        v.payload = EcAesCtr.encrypt(text, newSecret, newIv);
        if (owners != null) 
            for (var i = 0; i < owners.length; i++) 
                v.addOwner(EcPk.fromPem(owners[i]));
        if (owners != null) 
            for (var i = 0; i < v.owner.length; i++) {
                var eSecret = new EbacEncryptedSecret();
                eSecret.id = forge.util.encode64(forge.pkcs5.pbkdf2(id, "", 1, 8));
                eSecret.iv = newIv;
                eSecret.secret = newSecret;
                if (v.secret == null) 
                    v.secret = new Array();
                v.secret.push(EcRsaOaep.encrypt(EcPk.fromPem(v.owner[i]), eSecret.toEncryptableJson()));
            }
        if (readers != null) 
            for (var i = 0; i < readers.length; i++) 
                v.addReader(EcPk.fromPem(readers[i]));
        return v;
    };
    constructor.encryptValueUsingIvAndSecret = function(iv, secret, text, id, fieldName, owners, readers) {
        var v = new EcEncryptedValue();
        v.payload = EcAesCtr.encrypt(text, secret, iv);
        if (owners != null) 
            for (var i = 0; i < owners.length; i++) 
                v.addOwner(EcPk.fromPem(owners[i]));
        if (owners != null) 
            for (var i = 0; i < v.owner.length; i++) {
                var eSecret = new EbacEncryptedSecret();
                eSecret.id = forge.util.encode64(forge.pkcs5.pbkdf2(id, "", 1, 8));
                eSecret.iv = iv;
                eSecret.secret = secret;
                if (v.secret == null) 
                    v.secret = new Array();
                v.secret.push(EcRsaOaep.encrypt(EcPk.fromPem(v.owner[i]), eSecret.toEncryptableJson()));
            }
        if (readers != null) 
            for (var i = 0; i < readers.length; i++) 
                v.addReader(EcPk.fromPem(readers[i]));
        return v;
    };
    prototype.decryptIntoObject = function() {
        var decryptRaw = this.decryptIntoString();
        if (decryptRaw == null) 
            return null;
        if (!EcLinkedData.isProbablyJson(decryptRaw)) 
            return null;
        var decrypted = new EcRemoteLinkedData("", "");
        decrypted.copyFrom(JSON.parse(decryptRaw));
        decrypted.privateEncrypted = true;
        decrypted.id = this.id;
        return decrypted.deAtify();
    };
    prototype.decryptIntoObjectAsync = function(success, failure) {
        var id = this.id;
        this.decryptIntoStringAsync(function(decryptRaw) {
            if (decryptRaw == null) 
                failure("Could not decrypt data.");
            if (!EcLinkedData.isProbablyJson(decryptRaw)) 
                failure("Could not decrypt data.");
            var decrypted = new EcRemoteLinkedData("", "");
            decrypted.copyFrom(JSON.parse(decryptRaw));
            decrypted.privateEncrypted = true;
            decrypted.id = id;
            success(decrypted.deAtify());
        }, failure);
    };
    prototype.decryptIntoObjectUsingIvAndSecretAsync = function(iv, secret, success, failure) {
        this.decryptIntoStringUsingIvAndSecretAsync(iv, secret, function(decryptRaw) {
            if (decryptRaw == null) 
                failure("Could not decrypt data.");
            if (!EcLinkedData.isProbablyJson(decryptRaw)) 
                failure("Could not decrypt data.");
            var decrypted = new EcRemoteLinkedData("", "");
            decrypted.copyFrom(JSON.parse(decryptRaw));
            decrypted.privateEncrypted = true;
            success(decrypted.deAtify());
        }, failure);
    };
    prototype.decryptIntoString = function() {
        var decryptSecret = this.decryptSecret();
        if (decryptSecret != null) 
            return EcAesCtr.decrypt(this.payload, decryptSecret.secret, decryptSecret.iv);
        return null;
    };
    prototype.decryptIntoStringAsync = function(success, failure) {
        var me = this;
        this.decryptSecretAsync(function(decryptSecret) {
            if (decryptSecret != null) 
                EcAesCtrAsync.decrypt(me.payload, decryptSecret.secret, decryptSecret.iv, success, failure);
        }, failure);
    };
    prototype.decryptIntoStringUsingIvAndSecretAsync = function(iv, secret, success, failure) {
        EcAesCtrAsync.decrypt(this.payload, secret, iv, success, failure);
    };
    prototype.decryptSecret = function() {
        if (this.owner != null) 
            for (var i = 0; i < this.owner.length; i++) {
                var decryptionKey = EcIdentityManager.getPpk(EcPk.fromPem(this.owner[i]));
                if (decryptionKey == null) 
                    continue;
                var decrypted = this.decryptSecretByKey(decryptionKey);
                if (decrypted != null) 
                    return decrypted;
            }
        if (this.reader != null) 
            for (var i = 0; i < this.reader.length; i++) {
                var decryptionKey = EcIdentityManager.getPpk(EcPk.fromPem(this.reader[i]));
                if (decryptionKey == null) 
                    continue;
                var decrypted = this.decryptSecretByKey(decryptionKey);
                if (decrypted != null) 
                    return decrypted;
            }
        for (var i = 0; i < EcIdentityManager.ids.length; i++) {
            var decryptionKey = EcIdentityManager.ids[i].ppk;
            var decrypted = this.decryptSecretByKey(decryptionKey);
            if (decrypted != null) 
                return decrypted;
        }
        return null;
    };
    prototype.decryptSecretAsync = function(success, failure) {
        var ppks = new Array();
        if (this.owner != null) 
            for (var i = 0; i < this.owner.length; i++) {
                var decryptionKey = EcIdentityManager.getPpk(EcPk.fromPem(this.owner[i]));
                if (decryptionKey != null) 
                    if (!decryptionKey.inArray(ppks)) 
                        ppks.push(decryptionKey);
            }
        if (this.reader != null) 
            for (var i = 0; i < this.reader.length; i++) {
                var decryptionKey = EcIdentityManager.getPpk(EcPk.fromPem(this.reader[i]));
                if (decryptionKey != null) 
                    if (!decryptionKey.inArray(ppks)) 
                        ppks.push(decryptionKey);
            }
        for (var i = 0; i < EcIdentityManager.ids.length; i++) {
            var decryptionKey = EcIdentityManager.ids[i].ppk;
            if (decryptionKey != null) 
                if (!decryptionKey.inArray(ppks)) 
                    ppks.push(decryptionKey);
        }
        var me = this;
        new EcAsyncHelper().each(ppks, function(decryptionKey, countdown) {
            me.decryptSecretByKeyAsync(decryptionKey, success, function(arg0) {
                countdown();
            });
        }, function(arg0) {
            failure("Could not decrypt secret.");
        });
    };
    prototype.decryptSecretByKey = function(decryptionKey) {
        var encryptedSecret = null;
        if (this.secret != null) 
            for (var j = 0; j < this.secret.length; j++) {
                try {
                    var decryptedSecret = null;
                    decryptedSecret = EcRsaOaep.decrypt(decryptionKey, this.secret[j]);
                    if (!EcLinkedData.isProbablyJson(decryptedSecret)) 
                        continue;
                    encryptedSecret = EbacEncryptedSecret.fromEncryptableJson(JSON.parse(decryptedSecret));
                }catch (ex) {}
            }
        return encryptedSecret;
    };
    prototype.decryptSecretByKeyAsync = function(decryptionKey, success, failure) {
        var encryptedSecret = null;
        if (this.secret != null) {
            var helper = new EcAsyncHelper();
            helper.each(this.secret, function(decryptionSecret, decrement) {
                EcRsaOaepAsync.decrypt(decryptionKey, decryptionSecret, function(decryptedSecret) {
                    if (helper.counter == -1) 
                        return;
                    if (!EcLinkedData.isProbablyJson(decryptedSecret)) 
                        decrement();
                     else {
                        helper.stop();
                        success(EbacEncryptedSecret.fromEncryptableJson(JSON.parse(decryptedSecret)));
                    }
                }, function(arg0) {
                    decrement();
                });
            }, function(arg0) {
                failure("Could not find decryption key.");
            });
        }
    };
    prototype.isAnEncrypted = function(type) {
        if (this.encryptedType == null) 
            return false;
        var typeSplit = (type.split("/"));
        return this.encryptedType.equals(type) || this.encryptedType.equals(typeSplit[typeSplit.length - 1]);
    };
    /**
     *  Adds a reader to the object, if the reader does not exist.
     *  
     *  @param newReader
     *             PK of the new reader.
     */
    prototype.addReader = function(newReader) {
        var payloadSecret = this.decryptSecret();
        if (payloadSecret == null) {
            console.error("Cannot add a Reader if you don't know the secret");
            return;
        }
        var pem = newReader.toPem();
        if (this.reader == null) 
            this.reader = new Array();
        for (var i = 0; i < this.reader.length; i++) 
            if (this.reader[i].equals(pem)) 
                return;
        this.reader.push(pem);
        this.secret.push(EcRsaOaep.encrypt(newReader, payloadSecret.toEncryptableJson()));
    };
    /**
     *  Removes a reader from the object, if the reader does exist.
     *  
     *  @param oldReader
     *             PK of the old reader.
     */
    prototype.removeReader = function(oldReader) {
        var pem = oldReader.toPem();
        if (this.reader == null) 
            this.reader = new Array();
        for (var i = 0; i < this.reader.length; i++) 
            if (this.reader[i].equals(pem)) 
                this.reader.splice(i, 1);
    };
}, {owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, secret: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  A representation of a file.
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
     */
    prototype.checksum = null;
    /**
     *  Mime type of the file.
     */
    prototype.mimeType = null;
    /**
     *  Base-64 encoded version of the bytestream of a file.
     *  
     *  Please note: This field will be empty in search results, but be populated
     *  in a direct get.
     */
    prototype.data = null;
    prototype.name = null;
    /**
     *  Helper method to force the browser to download the file.
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
}, {owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, secret: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
var EcRepository = function() {};
EcRepository = stjs.extend(EcRepository, null, [], function(constructor, prototype) {
    prototype.selectedServer = null;
    constructor.caching = false;
    constructor.cachingSearch = false;
    constructor.cache = new Object();
    constructor.fetching = new Object();
    prototype.precache = function(urls, success) {
        if (urls == null) {
            if (success != null) 
                success();
            return;
        }
        var cacheUrls = new Array();
        for (var i = 0; i < urls.length; i++) {
            var url = urls[i];
            if (url.startsWith(this.selectedServer) && (EcRepository.cache)[url] == null) {
                cacheUrls.push(url.replace(this.selectedServer, ""));
            }
        }
        if (cacheUrls.length == 0) {
            if (success != null) 
                success();
            return;
        }
        var fd = new FormData();
        fd.append("data", JSON.stringify(cacheUrls));
        var me = this;
        EcIdentityManager.signatureSheetAsync(60000, this.selectedServer, function(p1) {
            fd.append("signatureSheet", p1);
            EcRemote.postExpectingObject(me.selectedServer, "sky/repo/multiGet", fd, function(p1) {
                var results = p1;
                for (var i = 0; i < results.length; i++) {
                    var d = new EcRemoteLinkedData(null, null);
                    d.copyFrom(results[i]);
                    results[i] = d;
                    if (EcRepository.caching) 
                        (EcRepository.cache)[d.shortId()] = d;
                }
                if (success != null) 
                    success();
            }, null);
        });
    };
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
                setTimeout(function() {
                    success((EcRepository.cache)[url]);
                }, 0);
                return;
            }
        if ((EcRepository.fetching)[url] > new Date().getMilliseconds() - 1000) {
            setTimeout(function() {
                EcRepository.get(url, success, failure);
            }, 100);
            return;
        }
        (EcRepository.fetching)[url] = new Date().getMilliseconds();
        var fd = new FormData();
        EcIdentityManager.signatureSheetAsync(60000, url, function(p1) {
            if ((EcRepository.cache)[url] != null) {
                success((EcRepository.cache)[url]);
                return;
            }
            fd.append("signatureSheet", p1);
            EcRemote.postExpectingObject(url, null, fd, function(p1) {
                delete (EcRepository.fetching)[url];
                var d = new EcRemoteLinkedData("", "");
                d.copyFrom(p1);
                if (d.getFullType() == null) {
                    if (failure != null) 
                        failure(JSON.stringify(p1));
                    return;
                }
                if (EcRepository.caching) 
                    (EcRepository.cache)[url] = d;
                success(d);
            }, function(p1) {
                delete (EcRepository.fetching)[url];
                if (failure != null) 
                    failure(p1);
            });
        });
    };
    constructor.getBlocking = function(url) {
        if (EcRepository.caching) 
            if ((EcRepository.cache)[url] != null) {
                return (EcRepository.cache)[url];
            }
        var fd = new FormData();
        var p1 = EcIdentityManager.signatureSheet(60000, url);
        fd.append("signatureSheet", p1);
        EcRemote.async = false;
        EcRemote.postExpectingObject(url, null, fd, function(p1) {
            var d = new EcRemoteLinkedData("", "");
            d.copyFrom(p1);
            if (d.getFullType() == null) {
                return;
            }
            (EcRepository.cache)[url] = d;
        }, null);
        EcRemote.async = true;
        var result = (EcRepository.cache)[url];
        if (!EcRepository.caching) 
            (EcRepository.cache)[url] = null;
        return result;
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
        this.searchWithParams(query, null, eachSuccess, success, failure);
    };
    /**
     *  Search a repository for JSON-LD compatible data.
     *  
     *  Uses a signature sheet gathered from {@link EcIdentityManager}.
     *  
     *  @param query
     *             ElasticSearch compatible query string, similar to Google query
     *             strings.
     *  @param paramObj
     *             Additional parameters that can be used to tailor the search.
     *  @param eachSuccess
     *             Success event for each found object.
     *  @param success
     *             Success event, called after eachSuccess.
     *  @param failure
     *             Failure event.
     */
    prototype.searchWithParams = function(query, paramObj, eachSuccess, success, failure) {
        if (paramObj == null) 
            paramObj = new Object();
        var params = new Object();
        var paramProps = (params);
        if ((paramObj)["start"] != null) 
            paramProps["start"] = (paramObj)["start"];
        if ((paramObj)["size"] != null) 
            paramProps["size"] = (paramObj)["size"];
        if ((paramObj)["types"] != null) 
            paramProps["types"] = (paramObj)["types"];
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
        if ((paramObj)["fields"] != null) 
            paramProps["fields"] = (paramObj)["fields"];
        var cacheKey;
        if (EcRepository.cachingSearch) {
            cacheKey = JSON.stringify(paramProps) + query;
            if ((EcRepository.cache)[cacheKey] != null) {
                var results = (EcRepository.cache)[cacheKey];
                for (var i = 0; i < results.length; i++) {
                    var d = new EcRemoteLinkedData(null, null);
                    d.copyFrom(results[i]);
                    results[i] = d;
                    if (EcRepository.caching) 
                        (EcRepository.cache)[d.shortId()] = d;
                    if (eachSuccess != null) 
                        eachSuccess(results[i]);
                }
                if (success != null) 
                    success(results);
            }
        } else 
            cacheKey = null;
        var fd = new FormData();
        fd.append("data", query);
        if (params != null) 
            fd.append("searchParams", JSON.stringify(params));
        var me = this;
        EcIdentityManager.signatureSheetAsync(60000, this.selectedServer, function(signatureSheet) {
            fd.append("signatureSheet", signatureSheet);
            EcRemote.postExpectingObject(me.selectedServer, "sky/repo/search", fd, function(p1) {
                if (EcRepository.cachingSearch) {
                    (EcRepository.cache)[cacheKey] = p1;
                }
                var results = p1;
                for (var i = 0; i < results.length; i++) {
                    var d = new EcRemoteLinkedData(null, null);
                    d.copyFrom(results[i]);
                    results[i] = d;
                    if (EcRepository.caching) 
                        (EcRepository.cache)[d.shortId()] = d;
                    if (eachSuccess != null) 
                        eachSuccess(results[i]);
                }
                if (success != null) 
                    success(results);
            }, failure);
        });
    };
    prototype.autoDetectRepository = function() {
        EcRemote.async = false;
        var protocols = new Array();
        protocols.push("https:");
        if (window != null) 
            if (window.location != null) 
                if (window.location.protocol == "http:") 
                    protocols.push("http:");
        var hostnames = new Array();
        if (window.location.host != null) 
            hostnames.push(window.location.host, window.location.host.replace(".", ".service."), window.location.host + ":8080", window.location.host.replace(".", ".service.") + ":8080");
        if (window.location.hostname != null) 
            hostnames.push(window.location.hostname, window.location.hostname.replace(".", ".service."), window.location.hostname + ":8080", window.location.hostname.replace(".", ".service.") + ":8080");
        hostnames.push("localhost", "localhost:8080", "localhost:9722");
        var servicePrefixes = new Array("/" + window.location.pathname.split("/")[1] + "/api/custom/", "/", "/service/", "/api/custom/");
        for (var j = 0; j < hostnames.length; j++) 
            for (var k = 0; k < servicePrefixes.length; k++) 
                for (var i = 0; i < protocols.length; i++) 
                    if (this.autoDetectRepositoryActual(protocols[i] + "//" + hostnames[j] + servicePrefixes[k])) {
                        EcRemote.async = true;
                        return;
                    }
        EcRemote.async = true;
    };
    prototype.autoDetectFound = false;
    prototype.autoDetectRepositoryActual = function(guess) {
        var me = this;
        var successCheck = function(p1) {
            if (p1 != null) 
                if ((p1)["ping"].equals("pong")) {
                    me.selectedServer = guess;
                    me.autoDetectFound = true;
                }
        };
        var failureCheck = function(p1) {
            if (p1 != null) 
                if (!p1.equals("")) 
                    if (p1.contains("pong")) {
                        me.selectedServer = guess;
                        me.autoDetectFound = true;
                    }
        };
        if (guess != null && guess.equals("") == false) 
            try {
                EcRemote.getExpectingObject(guess, "ping", successCheck, failureCheck);
            }catch (ex) {}
        return this.autoDetectFound;
    };
    /**
     *  Lists all types visible to the current user in the repository
     *  
     *  Uses a signature sheet gathered from {@link EcIdentityManager}.
     *  
     *  @param success
     *             Success event
     *  @param failure
     *             Failure event.
     */
    prototype.listTypes = function(success, failure) {
        var fd = new FormData();
        fd.append("signatureSheet", EcIdentityManager.signatureSheet(60000, this.selectedServer));
        EcRemote.postExpectingObject(this.selectedServer, "sky/repo/types", fd, function(p1) {
            var results = p1;
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
    constructor.save = function(data, success, failure) {
        if (data.invalid()) {
            var msg = "Cannot save data. It is missing a vital component.";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        if (data.privateEncrypted != null && data.privateEncrypted) {
            var encrypted = EcEncryptedValue.toEncryptedValue(data, false);
            EcRepository._save(encrypted, success, failure);
        } else {
            if (data.privateEncrypted != null) 
                delete (data)["privateEncrypted"];
            EcRepository._save(data, success, failure);
        }
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
    constructor._save = function(data, success, failure) {
        EcIdentityManager.sign(data);
        EcRepository._saveWithoutSigning(data, success, failure);
    };
    /**
     *  Attempts to save a piece of data without signing it.
     *  
     *  Uses a signature sheet informed by the owner field of the data.
     *  
     *  @param data
     *             Data to save to the location designated by its id.
     *  @param success
     *  @param failure
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
        EcIdentityManager.signatureSheetForAsync(data.owner, 60000, data.id, function(arg0) {
            fd.append("signatureSheet", arg0);
            EcRemote.postExpectingString(data.id, "", fd, success, failure);
        });
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
        EcRepository.DELETE(data, success, failure);
    };
    constructor.DELETE = function(data, success, failure) {
        if (EcRepository.caching) {
            delete (EcRepository.cache)[data.id];
            delete (EcRepository.cache)[data.shortId()];
        }
        EcIdentityManager.signatureSheetAsync(60000, data.id, function(signatureSheet) {
            EcRemote._delete(data.shortId(), signatureSheet, success, failure);
        });
    };
}, {cache: "Object", fetching: "Object"}, {});
var EcFile = function() {
    GeneralFile.call(this);
};
EcFile = stjs.extend(EcFile, GeneralFile, [], function(constructor, prototype) {
    prototype.save = function(success, failure) {
        if (this.name == null || this.name == "") {
            var msg = "Competency Name can not be empty";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        if (this.invalid()) {
            var msg = "Cannot save file. It is missing a vital component.";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        if (this.privateEncrypted != null && this.privateEncrypted) {
            var encrypted = EcEncryptedValue.toEncryptedValue(this, false);
            EcRepository._save(encrypted, success, failure);
        } else {
            EcRepository._save(this, success, failure);
        }
    };
    prototype._delete = function(success, failure) {
        EcRepository.DELETE(this, success, failure);
    };
    constructor.create = function(name, base64Data, mimeType) {
        var f = new EcFile();
        f.data = base64Data;
        f.name = name;
        f.mimeType = mimeType;
        return f;
    };
    constructor.get = function(id, success, failure) {
        EcRepository.get(id, function(p1) {
            var f = new EcFile();
            if (p1.isA(EcEncryptedValue.myType)) {
                var encrypted = new EcEncryptedValue();
                encrypted.copyFrom(p1);
                p1 = encrypted.decryptIntoObject();
                p1.privateEncrypted = true;
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
                            file.privateEncrypted = true;
                        }
                    }
                    ret[i] = file;
                }
                success(ret);
            }
        }, failure);
    };
}, {owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, secret: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
