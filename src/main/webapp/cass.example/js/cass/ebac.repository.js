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
    constructor.toEncryptedValue = function(d, hideType) {
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
    prototype.decryptIntoObject = function() {
        if (!this.verify()) 
            return null;
        if (this.owner != null) 
            for (var i = 0; i < this.owner.length; i++) {
                var decryptionKey = EcIdentityManager.getPpk(EcPk.fromPem(this.owner[i]));
                if (decryptionKey == null) 
                    continue;
                var decrypted = this.decryptToObject(decryptionKey);
                if (decrypted != null) {
                    decrypted.id = this.id;
                    return decrypted;
                }
            }
        if (this.reader != null) 
            for (var i = 0; i < this.reader.length; i++) {
                var decryptionKey = EcIdentityManager.getPpk(EcPk.fromPem(this.reader[i]));
                if (decryptionKey == null) 
                    continue;
                var decrypted = this.decryptToObject(decryptionKey);
                if (decrypted != null) {
                    decrypted.id = this.id;
                    return decrypted;
                }
            }
        for (var i = 0; i < EcIdentityManager.ids.length; i++) {
            var decryptionKey = EcIdentityManager.ids[i].ppk;
            var decrypted = this.decryptToObject(decryptionKey);
            if (decrypted != null) {
                decrypted.id = this.id;
                return decrypted;
            }
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
        if (this.secret != null) 
            for (var j = 0; j < this.secret.length; j++) {
                try {
                    var decryptedSecret = null;
                    decryptedSecret = EcRsaOaep.decrypt(decryptionKey, this.secret[j]);
                    if (!EcLinkedData.isProbablyJson(decryptedSecret)) 
                        continue;
                    var secret = EbacEncryptedSecret.fromEncryptableJson(JSON.parse(decryptedSecret));
                    return EcAesCtr.decrypt(this.payload, secret.secret, secret.iv);
                }catch (ex) {}
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
            decrypted.privateEncrypted = true;
            return decrypted.deAtify();
        }
        return null;
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
        var payloadSecret = null;
        for (var i = 0; i < EcIdentityManager.ids.length; i++) {
            var decryptionKey = EcIdentityManager.ids[i].ppk;
            if (this.secret != null) 
                for (var j = 0; j < this.secret.length; j++) {
                    try {
                        var decryptedSecret = null;
                        decryptedSecret = EcRsaOaep.decrypt(decryptionKey, this.secret[j]);
                        if (!EcLinkedData.isProbablyJson(decryptedSecret)) 
                            continue;
                        payloadSecret = EbacEncryptedSecret.fromEncryptableJson(JSON.parse(decryptedSecret));
                        break;
                    }catch (ex) {
                        console.log("fail  " + this.secret[j]);
                    }
                }
            if (payloadSecret != null) 
                break;
        }
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
var EcRepository = function() {};
EcRepository = stjs.extend(EcRepository, null, [], function(constructor, prototype) {
    prototype.selectedServer = null;
    constructor.caching = false;
    constructor.cache = new Object();
    prototype.precache = function(urls) {
        var cacheUrls = new Array();
        for (var i = 0; i < urls.length; i++) {
            var url = urls[i];
            if (url.startsWith(this.selectedServer) && (EcRepository.cache)[url] == null) {
                cacheUrls.push(url.replace(this.selectedServer, ""));
            }
        }
        if (cacheUrls.length == 0) 
            return;
        var fd = new FormData();
        fd.append("data", JSON.stringify(cacheUrls));
        fd.append("signatureSheet", EcIdentityManager.signatureSheet(60000, this.selectedServer));
        EcRemote.postExpectingObject(this.selectedServer, "sky/repo/multiGet", fd, function(p1) {
            var results = p1;
            for (var i = 0; i < results.length; i++) {
                var d = new EcRemoteLinkedData(null, null);
                d.copyFrom(results[i]);
                results[i] = d;
                if (EcRepository.caching) 
                    (EcRepository.cache)[d.shortId()] = d;
            }
        }, null);
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
                if (EcRepository.caching) 
                    (EcRepository.cache)[d.shortId()] = d;
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
                if (EcRepository.caching) 
                    (EcRepository.cache)[d.shortId()] = d;
                if (eachSuccess != null) 
                    eachSuccess(results[i]);
            }
            if (success != null) 
                success(results);
        }, failure);
    };
    prototype.autoDetectRepository = function() {
        EcRemote.async = false;
        var protocols = new Array();
        protocols.push("https:");
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
        console.warn("Watch out! " + data.id + " is being saved with the repository save function, no value checking will occur");
        if (data.privateEncrypted != null && data.privateEncrypted) {
            var encrypted = EcEncryptedValue.toEncryptedValue(data, false);
            EcRepository._save(encrypted, success, failure);
        } else {
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
        console.warn("Watch out! " + data.id + " is being deleted with the repository delete function, no clean up delete operations will occur");
        EcRepository.DELETE(data, success, failure);
    };
    constructor.DELETE = function(data, success, failure) {
        if (EcRepository.caching) {
            delete (EcRepository.cache)[data.id];
            delete (EcRepository.cache)[data.shortId()];
        }
        EcRemote._delete(data.shortId(), EcIdentityManager.signatureSheet(60000, data.id), success, failure);
    };
    constructor.sign = function(data, pen) {
        data.signature.push(EcRsaOaep.sign(pen, data.toSignableJson()));
    };
}, {cache: "Object"}, {});
