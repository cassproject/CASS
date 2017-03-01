/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
/**
 * 
 *  @author Fritz
 */
var EcCrypto = function() {};
EcCrypto = stjs.extend(EcCrypto, null, [], function(constructor, prototype) {
    constructor.caching = false;
    constructor.decryptionCache = new Object();
}, {decryptionCache: "Object"}, {});
var AlgorithmIdentifier = function() {};
AlgorithmIdentifier = stjs.extend(AlgorithmIdentifier, null, [], function(constructor, prototype) {
    prototype.name = null;
    prototype.modulusLength = 0;
    prototype.length = 0;
    prototype.publicExponent = null;
    prototype.hash = null;
    prototype.iv = null;
    prototype.counter = null;
}, {iv: "ArrayBuffer", counter: "ArrayBuffer"}, {});
/**
 *  Helper classes for dealing with RSA Public Keys.
 *  @class EcPk
 *  @module com.eduworks.ec
 *  @author fritz.ray@eduworks.com
 */
var EcPk = function() {};
EcPk = stjs.extend(EcPk, null, [], function(constructor, prototype) {
    /**
     *  Decodes a PEM encoded SubjectPublicKeyInfo (PKCS#8) or RSAPublicKey (PKCS#1) formatted RSA Public Key.
     *  (In case you were curious.)
     *  @method fromPem
     *  @static
     *  @param {string} pem PEM as a string.
     *  @return {EcPk} Object used to perform public key operations.
     */
    constructor.fromPem = function(pem) {
        var pk = new EcPk();
        try {
            pk.pk = forge.pki.publicKeyFromPem(pem);
        }catch (ex) {
            return null;
        }
        return pk;
    };
    prototype.pk = null;
    /**
     *  Compares two public keys, and returns true if their PEM forms match.
     *  @method equals
     *  @param {EcPk} obj Object to compare to.
     *  @return {boolean} True if the keys match.
     */
    prototype.equals = function(obj) {
        if (stjs.isInstanceOf(obj.constructor, EcPk)) 
            return this.toPem().equals((obj).toPem());
        return Object.prototype.equals.call(this, obj);
    };
    /**
     *  Encodes the public key into a PEM encoded SubjectPublicKeyInfo (PKCS#8) formatted RSA Public Key.
     *  (In case you were curious.)
     *  @method toPem
     *  @return {string} PEM encoded public key without whitespace.
     */
    prototype.toPem = function() {
        return forge.pki.publicKeyToPem(this.pk).replaceAll("\r?\n", "");
    };
    /**
     *  Encodes the public key into a PEM encoded RSAPublicKey (PKCS#1) formatted RSA Public Key.
     *  (In case you were curious.)
     *  @method toPem
     *  @return {string} PEM encoded public key without whitespace.
     */
    prototype.toPkcs1Pem = function() {
        return forge.pki.publicKeyToRSAPublicKeyPem(this.pk).replaceAll("\r?\n", "");
    };
    /**
     *  Encodes the public key into a PEM encoded SubjectPublicKeyInfo (PKCS#8) formatted RSA Public Key.
     *  (In case you were curious.)
     *  @method toPem
     *  @return {string} PEM encoded public key without whitespace.
     */
    prototype.toPkcs8Pem = function() {
        return forge.pki.publicKeyToPem(this.pk).replaceAll("\r?\n", "");
    };
    /**
     *  Hashes the public key into an SSH compatible fingerprint.
     *  @method toHash
     *  @return {string} Public key fingerprint.
     */
    prototype.fingerprint = function() {
        var o = new Object();
        (o)["encoding"] = "hex";
        return forge.ssh.getPublicKeyFingerprint(this.pk, o);
    };
    prototype.verify = function(bytes, decode64) {
        return this.pk.verify(bytes, decode64);
    };
}, {pk: "forge.pk"}, {});
var jwk = function() {};
jwk = stjs.extend(jwk, null, [], function(constructor, prototype) {
    prototype.kty = null;
    prototype.k = null;
    prototype.alg = null;
    prototype.ext = null;
}, {}, {});
/**
 *  AES encryption tasks common across all variants of AES.
 *  @class EcAes 
 *  @module com.eduworks.ec
 *  @author fritz.ray@eduworks.com
 */
var EcAes = function() {};
EcAes = stjs.extend(EcAes, null, [], function(constructor, prototype) {
    /**
     *  Generates a random secret of length @i
     *  @method newSecret
     *  @static
     *  @param {integer} i Length of secret
     *  @return {string} String representing the new secret, encoded using Base64.
     */
    constructor.newSecret = function(i) {
        return forge.util.encode64(forge.random.getBytesSync(i));
    };
    /**
     *  Generates a random Initialization Vector of length @i
     *  @method newIv
     *  @static
     *  @param {integer} i Length of initialization Vector
     *  @return {string} String representing the new Initialization Vector, encoded using Base64.
     */
    constructor.newIv = function(i) {
        return forge.util.encode64(forge.random.getBytesSync(i));
    };
}, {}, {});
var CryptoKey = function() {};
CryptoKey = stjs.extend(CryptoKey, null, [], null, {}, {});
var EcAesParameters = function(iv) {
    this.iv = forge.util.decode64(iv);
};
EcAesParameters = stjs.extend(EcAesParameters, null, [], function(constructor, prototype) {
    prototype.iv = null;
}, {iv: "forge.payload"}, {});
var SubtleCrypto = function() {};
SubtleCrypto = stjs.extend(SubtleCrypto, null, [], function(constructor, prototype) {
    prototype.encrypt = function(algorithm, key, data) {
        return null;
    };
    prototype.decrypt = function(algorithm, key, data) {
        return null;
    };
    prototype.sign = function(algorithm, key, data) {
        return null;
    };
    prototype.verify = function(algorithm, key, signature, data) {
        return null;
    };
    prototype.generateKey = function(algorithm, extractable, keyUsages) {
        return null;
    };
    prototype.deriveBits = function(algorithm, baseKey, length) {
        return null;
    };
    prototype.importKey = function(format, keyData, algorithm, extractable, keyUsages) {
        return null;
    };
}, {}, {});
/**
 *  Helper methods for performing RSA Encryption methods. Uses Optimal Asymmetric
 *  Encryption Padding (OAEP) encryption and decryption. Uses RSA SSA PKCS#1 v1.5
 *  (RSASSA-PKCS1-V1_5) signing and verifying with UTF8 encoding.
 * 
 *  @author fritz.ray@eduworks.com
 *  @module com.eduworks.ec
 *  @class EcRsaOaep
 */
var EcRsaOaep = function() {};
EcRsaOaep = stjs.extend(EcRsaOaep, null, [], function(constructor, prototype) {
    /**
     *  Encrypts a block of plaintext (no more than 256 bytes) with a public key
     *  using RSA OAEP encryption. Returns a base64 encoded ciphertext.
     * 
     *  @method encrypt
     *  @static
     *  @param {EcPk} pk Public Key.
     *  @param {string} plaintext Plaintext. Does not perform encoding.
     */
    constructor.encrypt = function(pk, plaintext) {
        if ($ == null) {
            return rsaEncrypt(plaintext, pk.toPem());
        }
        return forge.util.encode64(pk.pk.encrypt(plaintext, "RSA-OAEP"));
    };
    /**
     *  Decrypts a block of ciphertext (no more than 256 bytes) with a private
     *  key using RSA OAEP encryption. Returns a unencoded plaintext.
     * 
     *  @method decrypt
     *  @static
     *  @param {EcPpk} ppk Public private keypair.
     *  @param {string} ciphertext Ciphertext.
     *  @return {string} Unencoded plaintext.
     */
    constructor.decrypt = function(ppk, ciphertext) {
        if (EcCrypto.caching) {
            var cacheGet = null;
            cacheGet = (EcCrypto.decryptionCache)[ppk.toPem() + ciphertext];
            if (cacheGet != null) {
                return cacheGet;
            }
        }
        var result;
        if ($ == null) {
            result = rsaDecrypt(ciphertext, ppk.toPem());
        } else {
            result = ppk.ppk.decrypt(forge.util.decode64(ciphertext), "RSA-OAEP");
        }
        if (EcCrypto.caching) {
            (EcCrypto.decryptionCache)[ppk.toPem() + ciphertext] = result;
        }
        return result;
    };
    /**
     *  Creates a signature for the provided text using the public private
     *  keypair. May be verified with the public key. Uses SHA1 hash with a UTF8
     *  decoding of the text. Returns base64 encoded signature.
     * 
     *  @method sign
     *  @static
     *  @param {EcPpk} ppk Public private keypair.
     *  @param {string} text Text to sign.
     *  @return Base64 encoded signature.
     */
    constructor.sign = function(ppk, text) {
        if ($ == null) {
            return rsaSign(text, ppk.toPem());
        }
        var s = forge.md.sha1.create();
        s.update(text, "utf8");
        return forge.util.encode64(ppk.ppk.sign(s));
    };
    /**
     *  Creates a signature for the provided text using the public private
     *  keypair. May be verified with the public key. Uses SHA256 hash with a
     *  UTF8 decoding of the text. Returns base64 encoded signature.
     * 
     *  @method signSha256
     *  @static
     *  @param {EcPpk} ppk Public private keypair.
     *  @param {string} text Text to sign.
     *  @return Base64 encoded signature.
     */
    constructor.signSha256 = function(ppk, text) {
        var s = forge.md.sha256.create();
        s.update(text, "utf8");
        return forge.util.encode64(ppk.ppk.sign(s));
    };
    /**
     *  Verifies the integrity of the provided text using a signature and a
     *  public key. Uses SHA1 hash with a UTF8 decoding of the text.
     * 
     *  @static
     *  @method verify
     *  @param {EcPk} pk Public key.
     *  @param {string} text Text to verify.
     *  @param {string} signature Base64 encoded signature.
     *  @return True IFF the signature is valid.
     */
    constructor.verify = function(pk, text, signature) {
        if ($ == null) {
            return rsaVerify(signature, pk.toPem(), text);
        }
        var s = forge.md.sha1.create();
        s.update(text, "utf8");
        try {
            return pk.verify(s.digest().bytes(), forge.util.decode64(signature));
        }catch (ex) {
            return false;
        }
    };
}, {}, {});
var EcAesCtrAsyncNative = function() {};
EcAesCtrAsyncNative = stjs.extend(EcAesCtrAsyncNative, null, [], function(constructor, prototype) {
    constructor.encrypt = function(text, secret, iv, success, failure) {
        var keyUsages = new Array();
        keyUsages.push("encrypt", "decrypt");
        var algorithm = new AlgorithmIdentifier();
        algorithm.name = "AES-CTR";
        algorithm.counter = base64.decode(iv);
        algorithm.length = 128;
        var data;
        data = str2ab(text);
        window.crypto.subtle.importKey("raw", base64.decode(secret), algorithm, false, keyUsages).then(function(key) {
            var p = window.crypto.subtle.encrypt(algorithm, key, data);
            p.then(function(p1) {
                success(base64.encode(p1));
            });
        });
    };
    constructor.decrypt = function(text, secret, iv, success, failure) {
        var keyUsages = new Array();
        keyUsages.push("encrypt", "decrypt");
        var algorithm = new AlgorithmIdentifier();
        algorithm.name = "AES-CTR";
        algorithm.counter = base64.decode(iv);
        algorithm.length = 128;
        var data;
        data = base64.decode(text);
        window.crypto.subtle.importKey("raw", base64.decode(secret), algorithm, false, keyUsages).then(function(key) {
            var p = window.crypto.subtle.decrypt(algorithm, key, data);
            p.then(function(p1) {
                success(ab2str(p1));
            });
        });
    };
}, {}, {});
var EcRsaOaepAsyncNative = function() {};
EcRsaOaepAsyncNative = stjs.extend(EcRsaOaepAsyncNative, null, [], function(constructor, prototype) {
    constructor.encrypt = function(pk, text, success, failure) {
        var base64pk = pk.toPkcs8Pem().replace("-----BEGIN RSA PUBLIC KEY-----", "").replace("-----END RSA PUBLIC KEY-----", "");
        var keyUsages = new Array();
        keyUsages.push("encrypt");
        var algorithm = new AlgorithmIdentifier();
        algorithm.name = "RSA-OAEP";
        algorithm.hash = "SHA-1";
        var data;
        data = str2ab(text);
        window.crypto.subtle.importKey("spki", base64.decode(base64pk), algorithm, false, keyUsages).then(function(key) {
            var p = window.crypto.subtle.encrypt(algorithm, key, data);
            p.then(function(p1) {
                success(base64.encode(p1));
            });
        });
    };
    constructor.decrypt = function(ppk, text, success, failure) {
        var base64ppk = ppk.toPem().replace("-----BEGIN RSA PRIVATE KEY-----", "").replace("-----END RSA PRIVATE KEY-----", "");
        var keyUsages = new Array();
        keyUsages.push("decrypt");
        var algorithm = new AlgorithmIdentifier();
        algorithm.name = "RSA-OAEP";
        algorithm.hash = "SHA-1";
        window.crypto.subtle.importKey("pkcs8", base64.decode(base64ppk), algorithm, false, keyUsages).then(function(key) {
            var p = window.crypto.subtle.decrypt(algorithm, key, base64.decode(text));
            p.then(function(p1) {
                success(ab2str(p1));
            });
        });
    };
    constructor.sign = function(ppk, text, success, failure) {};
    constructor.signSha256 = function(ppk, text, success, failure) {};
    constructor.verify = function(pk, text, signature, success, failure) {};
}, {}, {});
/**
 *  Helper classes for dealing with RSA Private Keys.
 *  @class EcPpk
 *  @module com.eduworks.ec
 *  @author fritz.ray@eduworks.com
 */
var EcPpk = function() {};
EcPpk = stjs.extend(EcPpk, null, [], function(constructor, prototype) {
    /**
     *  Decodes a PEM encoded PrivateKeyInfo (PKCS#8) or RSAPrivateKey (PKCS#1) formatted RSA Public Key.
     *  (In case you were curious.)
     *  @method fromPem
     *  @static
     *  @param {string} pem PEM as a string.
     *  @return {EcPk} Object used to perform public key operations.
     */
    constructor.fromPem = function(pem) {
        var pk = new EcPpk();
        try {
            pk.ppk = forge.pki.privateKeyFromPem(pem);
        }catch (ex) {
            return null;
        }
        return pk;
    };
    /**
     *  Generates an RSA Keypair using web workers.
     *  @method generateKeyAsync
     *  @static
     *  @param {function(EcPpk)} callback Method called when the keypair is generated.
     */
    constructor.generateKeyAsync = function(callback) {
        var o = new Object();
        (o)["workers"] = -1;
        forge.pki.rsa.generateKeyPair(o, function(err, keypair) {
            var ppk = new EcPpk();
            ppk.ppk = keypair.privateKey;
            callback(ppk);
        });
    };
    /**
     *  Generates an RSA Keypair synchronously. Can take a while.
     *  @method generateKey
     *  @static
     *  @return {EcPpk} Public private keypair.
     */
    constructor.generateKey = function() {
        var o = new Object();
        (o)["workers"] = -1;
        var keypair = forge.pki.rsa.generateKeyPair(o, null);
        var ppk = new EcPpk();
        ppk.ppk = keypair.privateKey;
        return ppk;
    };
    prototype.ppk = null;
    /**
     *  Returns true iff the PEM forms of the public private keypair match.
     *  Can also match against a public key if the public portion of the keypair match.
     *  @method equals
     *  @param {EcPpk|EcPk} Key to compare to.
     *  @return boolean If they match.
     */
    prototype.equals = function(obj) {
        if (stjs.isInstanceOf(obj.constructor, EcPpk)) 
            return this.toPem().equals((obj).toPem());
        if (stjs.isInstanceOf(obj.constructor, EcPk)) 
            return this.toPk().toPem().equals((obj).toPem());
        return Object.prototype.equals.call(this, obj);
    };
    /**
     *  Encodes the private key into a PEM encoded RSAPrivateKey (PKCS#1) formatted RSA Public Key.
     *  (In case you were curious.)
     *  @method toPem
     *  @return {string} PEM encoded public key without whitespace.
     */
    prototype.toPem = function() {
        return forge.pki.privateKeyToPem(this.ppk).replaceAll("\r?\n", "");
    };
    /**
     *  Encodes the private key into a PEM encoded RSAPrivateKey (PKCS#1) formatted RSA Public Key.
     *  (In case you were curious.)
     *  @method toPkcs1Pem
     *  @return {string} PEM encoded public key without whitespace.
     */
    prototype.toPkcs1Pem = function() {
        return forge.pki.privateKeyToPem(this.ppk).replaceAll("\r?\n", "");
    };
    /**
     *  Encodes the private key into a PEM encoded PrivateKeyInfo (PKCS#8) formatted RSA Public Key.
     *  (In case you were curious.)
     *  @method toPkcs8Pem
     *  @return {string} PEM encoded public key without whitespace.
     */
    prototype.toPkcs8Pem = function() {
        return forge.pki.privateKeyInfoToPem(this.ppk).replaceAll("\r?\n", "");
    };
    prototype.toPkcs8 = function() {
        return forge.pki.wrapRsaPrivateKey(forge.pki.privateKeyToAsn1(this.ppk));
    };
    /**
     *  Extracts the public key portion from the public private keypair.
     *  @method toPk
     *  @return {EcPk} Public Key Helper.
     */
    prototype.toPk = function() {
        var pk = new EcPk();
        pk.pk = forge.pki.rsa.setPublicKey(this.ppk.n, this.ppk.e);
        return pk;
    };
    /**
     *  Returns true if this PPK is in an array of PPKs.
     *  @method inArray
     *  @param {Array<EcPpk>} ppks Array of ppks
     *  @return true iff this PPK in ppks.
     */
    prototype.inArray = function(ppks) {
        for (var i = 0; i < ppks.length; i++) {
            if (ppks[i].equals(this)) 
                return true;
        }
        return false;
    };
}, {ppk: "forge.ppk"}, {});
/**
 *  Encrypts data synchronously using AES-256-CTR. Requires secret and iv to be 32 bytes.
 *  Output is encoded in base64 for easier handling.
 *  @author fritz.ray@eduworks.com
 *  @module com.eduworks.ec
 *  @class EcAesCtr
 */
var EcAesCtr = function() {};
EcAesCtr = stjs.extend(EcAesCtr, null, [], function(constructor, prototype) {
    /**
     *  Encrypts plaintext using AES-256-CTR. 
     *  Plaintext is treated as as a sequence of bytes, does not perform UTF8 decoding.
     *  Returns base64 encoded ciphertext.
     *  @method encrypt
     *  @static
     *  @param {string} plaintext Text to encrypt.
     *  @param {string} secret Secret to use to encrypt.
     *  @param {string} iv Initialization Vector to use to encrypt.
     *  @return {string} Ciphertext encoded using base64.
     */
    constructor.encrypt = function(plaintext, secret, iv) {
        if ($ == null && forge.util.decode64(secret).length == 16 && forge.util.decode64(iv).length == 16) 
            return aesEncrypt(plaintext, iv, secret);
        var c = forge.cipher.createCipher("AES-CTR", forge.util.decode64(secret));
        c.start(new EcAesParameters(iv));
        c.update(forge.util.createBuffer(plaintext));
        c.finish();
        var encrypted = c.output;
        return forge.util.encode64(encrypted.bytes());
    };
    /**
     *  Decrypts ciphertext using AES-256-CTR. 
     *  Ciphertext must be base64 encoded ciphertext.
     *  Returns plaintext as a string (Sequence of bytes, no encoding).
     *  @method decrypt
     *  @static
     *  @param {string} ciphertext Ciphertext to decrypt.
     *  @param {string} secret Secret to use to decrypt.
     *  @param {string} iv Initialization Vector to use to decrypt.
     *  @return {string} Plaintext with no encoding.
     */
    constructor.decrypt = function(ciphertext, secret, iv) {
        if (EcCrypto.caching) {
            var cacheGet = (EcCrypto.decryptionCache)[secret + iv + ciphertext];
            if (cacheGet != null) 
                return cacheGet;
        }
        if ($ == null && forge.util.decode64(secret).length == 16 && forge.util.decode64(iv).length == 16) {
            var result = aesDecrypt(ciphertext, iv, secret);
            if (EcCrypto.caching) 
                (EcCrypto.decryptionCache)[secret + iv + ciphertext] = result;
            return result;
        }
        var c = forge.cipher.createDecipher("AES-CTR", forge.util.decode64(secret));
        c.start(new EcAesParameters(iv));
        c.update(forge.util.createBuffer(forge.util.decode64(ciphertext)));
        c.finish();
        var decrypted = c.output;
        if (EcCrypto.caching) 
            (EcCrypto.decryptionCache)[secret + iv + ciphertext] = decrypted.data;
        return decrypted.data;
    };
}, {}, {});
/**
 *  Asynchronous implementation of {{#crossLink
 *  "EcRsaOaep"}}EcRsaOaep{{/crossLink}}. Uses web workers and assumes 8 workers.
 * 
 *  @class EcRsaOaepAsync
 *  @module com.eduworks.ec
 *  @author fritz.ray@eduworks.com
 */
var EcRsaOaepAsync = function() {};
EcRsaOaepAsync = stjs.extend(EcRsaOaepAsync, null, [], function(constructor, prototype) {
    constructor.rotator = 0;
    constructor.w = null;
    constructor.q1 = null;
    constructor.q2 = null;
    constructor.initWorker = function() {
        if (window == null && (typeof self).equals("undefined")) {
            return;
        }
        if (!EcRemote.async) {
            return;
        }
        if (EcRsaOaepAsync.w != null) {
            return;
        }
        EcRsaOaepAsync.rotator = 0;
        EcRsaOaepAsync.q1 = new Array();
        EcRsaOaepAsync.q2 = new Array();
        EcRsaOaepAsync.w = new Array();
        for (var index = 0; index < 8; index++) {
            EcRsaOaepAsync.createWorker(index);
        }
    };
    constructor.createWorker = function(index) {
        EcRsaOaepAsync.q1.push(new Array());
        EcRsaOaepAsync.q2.push(new Array());
        var wkr;
        EcRsaOaepAsync.w.push(wkr = new Worker((window)["scriptPath"] + "forgeAsync.js"));
        wkr.onmessage = function(p1) {
            var o = p1.data;
            var success = EcRsaOaepAsync.q1[index].shift();
            var failure = EcRsaOaepAsync.q2[index].shift();
            if (success != null) {
                success((o)["result"]);
            }
        };
        wkr.onerror = function(p1) {
            var success = EcRsaOaepAsync.q1[index].shift();
            var failure = EcRsaOaepAsync.q2[index].shift();
            if (failure != null) {
                failure(p1.toString());
            }
        };
    };
    /**
     *  Asynchronous form of {{#crossLink
     *  "EcRsaOaep/encrypt:method"}}EcRsaOaep.encrypt{{/crossLink}}
     * 
     *  @method encrypt
     *  @static
     *  @param {EcPk} pk Public Key to use to encrypt.
     *  @param {string} plaintext Plaintext to encrypt.
     *  @param {function(string)} success Success method, result is Base64
     *  encoded Ciphertext.
     *  @param {function(string)} failure Failure method, parameter is error
     *  message.
     */
    constructor.encrypt = function(pk, plaintext, success, failure) {
        EcRsaOaepAsync.initWorker();
        if (!EcRemote.async || EcRsaOaepAsync.w == null) {
            success(EcRsaOaep.encrypt(pk, plaintext));
        } else {
            var worker = EcRsaOaepAsync.rotator++;
            EcRsaOaepAsync.rotator = EcRsaOaepAsync.rotator % 8;
            var o = new Object();
            (o)["pk"] = pk.toPem();
            (o)["text"] = plaintext;
            (o)["cmd"] = "encryptRsaOaep";
            EcRsaOaepAsync.q1[worker].push(success);
            EcRsaOaepAsync.q2[worker].push(failure);
            EcRsaOaepAsync.w[worker].postMessage(o);
        }
    };
    /**
     *  Asynchronous form of {{#crossLink
     *  "EcRsaOaep/decrypt:method"}}EcRsaOaep.decrypt{{/crossLink}}
     * 
     *  @method decrypt
     *  @static
     *  @param {EcPpk} ppk Public private keypair to use to decrypt.
     *  @param {string} ciphertext Ciphertext to decrypt.
     *  @param {function(string)} success Success method, result is unencoded
     *  plaintext.
     *  @param {function(string)} failure Failure method, parameter is error
     *  message.
     */
    constructor.decrypt = function(ppk, ciphertext, success, failure) {
        if (EcCrypto.caching) {
            var cacheGet = null;
            cacheGet = (EcCrypto.decryptionCache)[ppk.toPem() + ciphertext];
            if (cacheGet != null) {
                success(cacheGet);
                return;
            }
        }
        EcRsaOaepAsync.initWorker();
        if (!EcRemote.async || EcRsaOaepAsync.w == null) {
            success(EcRsaOaep.decrypt(ppk, ciphertext));
        } else {
            var worker = EcRsaOaepAsync.rotator++;
            EcRsaOaepAsync.rotator = EcRsaOaepAsync.rotator % 8;
            var o = new Object();
            (o)["ppk"] = ppk.toPem();
            (o)["text"] = ciphertext;
            (o)["cmd"] = "decryptRsaOaep";
            if (EcCrypto.caching) {
                EcRsaOaepAsync.q1[worker].push(function(p1) {
                    (EcCrypto.decryptionCache)[ppk.toPem() + ciphertext] = p1;
                    success(p1);
                });
            } else {
                EcRsaOaepAsync.q1[worker].push(success);
            }
            EcRsaOaepAsync.q2[worker].push(failure);
            EcRsaOaepAsync.q2[worker].push(failure);
            EcRsaOaepAsync.w[worker].postMessage(o);
        }
    };
    /**
     *  Asynchronous form of {{#crossLink
     *  "EcRsaOaep/sign:method"}}EcRsaOaep.sign{{/crossLink}}
     * 
     *  @method sign
     *  @static
     *  @param {EcPpk} ppk Public private keypair to use to sign message.
     *  @param {string} text Text to sign.
     *  @param {function(string)} success Success method, result is Base64
     *  encoded signature.
     *  @param {function(string)} failure Failure method, parameter is error
     *  message.
     */
    constructor.sign = function(ppk, text, success, failure) {
        EcRsaOaepAsync.initWorker();
        if (!EcRemote.async || EcRsaOaepAsync.w == null) {
            success(EcRsaOaep.sign(ppk, text));
        } else {
            var worker = EcRsaOaepAsync.rotator++;
            EcRsaOaepAsync.rotator = EcRsaOaepAsync.rotator % 8;
            var o = new Object();
            (o)["ppk"] = ppk.toPem();
            (o)["text"] = text;
            (o)["cmd"] = "signRsaOaep";
            EcRsaOaepAsync.q1[worker].push(success);
            EcRsaOaepAsync.q2[worker].push(failure);
            EcRsaOaepAsync.w[worker].postMessage(o);
        }
    };
    /**
     *  Asynchronous form of {{#crossLink
     *  "EcRsaOaep/signSha256:method"}}EcRsaOaep.signSha256{{/crossLink}}
     * 
     *  @method signSha256
     *  @static
     *  @param {EcPpk} ppk Public private keypair to use to sign message.
     *  @param {string} text Text to sign.
     *  @param {function(string)} success Success method, result is Base64
     *  encoded signature.
     *  @param {function(string)} failure Failure method, parameter is error
     *  message.
     */
    constructor.signSha256 = function(ppk, text, success, failure) {
        EcRsaOaepAsync.initWorker();
        if (!EcRemote.async || EcRsaOaepAsync.w == null) {
            success(EcRsaOaep.signSha256(ppk, text));
        } else {
            var worker = EcRsaOaepAsync.rotator++;
            EcRsaOaepAsync.rotator = EcRsaOaepAsync.rotator % 8;
            var o = new Object();
            (o)["ppk"] = ppk.toPem();
            (o)["text"] = text;
            (o)["cmd"] = "signSha256RsaOaep";
            EcRsaOaepAsync.q1[worker].push(success);
            EcRsaOaepAsync.q2[worker].push(failure);
            EcRsaOaepAsync.w[worker].postMessage(o);
        }
    };
    /**
     *  Asynchronous form of {{#crossLink
     *  "EcRsaOaep/verify:method"}}EcRsaOaep.verify{{/crossLink}}
     * 
     *  @method verify
     *  @static
     *  @param {EcPk} pk Public key to use to verify message.
     *  @param {string} text Text to use in verification.
     *  @param {string} signature Signature to use in verification.
     *  @param {function(boolean)} success Success method, result is whether
     *  signature is valid.
     *  @param {function(string)} failure Failure method, parameter is error
     *  message.
     */
    constructor.verify = function(pk, text, signature, success, failure) {
        EcRsaOaepAsync.initWorker();
        if (!EcRemote.async || EcRsaOaepAsync.w == null) {
            success(EcRsaOaep.verify(pk, text, signature));
        } else {
            var worker = EcRsaOaepAsync.rotator++;
            EcRsaOaepAsync.rotator = EcRsaOaepAsync.rotator % 8;
            var o = new Object();
            (o)["pk"] = pk.toPem();
            (o)["text"] = text;
            (o)["signature"] = signature;
            (o)["cmd"] = "verifyRsaOaep";
            EcRsaOaepAsync.q1[worker].push(success);
            EcRsaOaepAsync.q2[worker].push(failure);
            EcRsaOaepAsync.w[worker].postMessage(o);
        }
    };
}, {w: {name: "Array", arguments: [{name: "Worker", arguments: ["Object"]}]}, q1: {name: "Array", arguments: [{name: "Array", arguments: ["Callback1"]}]}, q2: {name: "Array", arguments: [{name: "Array", arguments: ["Callback1"]}]}}, {});
/**
 *  Asynchronous implementation of {{#crossLink
 *  "EcAesCtr"}}EcAesCtr{{/crossLink}}. Uses web workers and assumes 8 workers.
 * 
 *  @class EcAesCtrAsync
 *  @module com.eduworks.ec
 *  @author fritz.ray@eduworks.com
 */
var EcAesCtrAsync = function() {};
EcAesCtrAsync = stjs.extend(EcAesCtrAsync, null, [], function(constructor, prototype) {
    constructor.rotator = 0;
    constructor.w = null;
    constructor.q1 = null;
    constructor.q2 = null;
    constructor.initWorker = function() {
        if (window == null && (typeof self).equals("undefined")) {
            return;
        }
        if (!EcRemote.async) {
            return;
        }
        if (EcAesCtrAsync.w != null) {
            return;
        }
        EcAesCtrAsync.rotator = 0;
        EcAesCtrAsync.q1 = new Array();
        EcAesCtrAsync.q2 = new Array();
        EcAesCtrAsync.w = new Array();
        for (var index = 0; index < 8; index++) {
            EcAesCtrAsync.createWorker(index);
        }
    };
    constructor.createWorker = function(index) {
        EcAesCtrAsync.q1.push(new Array());
        EcAesCtrAsync.q2.push(new Array());
        var wkr;
        EcAesCtrAsync.w.push(wkr = new Worker((window)["scriptPath"] + "forgeAsync.js"));
        wkr.onmessage = function(p1) {
            var o = p1.data;
            var success = EcAesCtrAsync.q1[index].shift();
            var failure = EcAesCtrAsync.q2[index].shift();
            if (success != null) {
                success((o)["result"]);
            }
        };
        wkr.onerror = function(p1) {
            var success = EcAesCtrAsync.q1[index].shift();
            var failure = EcAesCtrAsync.q2[index].shift();
            if (failure != null) {
                failure(p1.toString());
            }
        };
    };
    /**
     *  Asynchronous form of {{#crossLink
     *  "EcAesCtr/encrypt:method"}}EcAesCtr.encrypt{{/crossLink}}
     * 
     *  @method encrypt
     *  @static
     *  @param {string} plaintext Text to encrypt.
     *  @param {string} secret Secret to use to encrypt.
     *  @param {string} iv Initialization Vector to use to encrypt.
     *  @param {function(string)} success Success method, result is Base64
     *  encoded Ciphertext.
     *  @param {function(string)} failure Failure method, parameter is error
     *  message.
     */
    constructor.encrypt = function(plaintext, secret, iv, success, failure) {
        EcAesCtrAsync.initWorker();
        if (!EcRemote.async || EcAesCtrAsync.w == null) {
            success(EcAesCtr.encrypt(plaintext, secret, iv));
        } else {
            var worker = EcAesCtrAsync.rotator++;
            EcAesCtrAsync.rotator = EcAesCtrAsync.rotator % 8;
            var o = new Object();
            (o)["secret"] = secret;
            (o)["iv"] = iv;
            (o)["text"] = plaintext;
            (o)["cmd"] = "encryptAesCtr";
            EcAesCtrAsync.q1[worker].push(success);
            EcAesCtrAsync.q2[worker].push(failure);
            EcAesCtrAsync.w[worker].postMessage(o);
        }
    };
    /**
     *  Asynchronous form of {{#crossLink
     *  "EcAesCtr/decrypt:method"}}EcAesCtr.decrypt{{/crossLink}}
     * 
     *  @method decrypt
     *  @static
     *  @param {string} ciphertext Text to decrypt.
     *  @param {string} secret Secret to use to decrypt.
     *  @param {string} iv Initialization Vector to use to decrypt.
     *  @param {function(string)} success Success method, result is Plaintext
     *  with no encoding.
     *  @param {function(string)} failure Failure method, parameter is error
     *  message.
     */
    constructor.decrypt = function(ciphertext, secret, iv, success, failure) {
        if (EcCrypto.caching) {
            var cacheGet = null;
            cacheGet = (EcCrypto.decryptionCache)[secret + iv + ciphertext];
            if (cacheGet != null) {
                success(cacheGet);
                return;
            }
        }
        EcAesCtrAsync.initWorker();
        if (!EcRemote.async || EcAesCtrAsync.w == null) {
            success(EcAesCtr.decrypt(ciphertext, secret, iv));
        } else {
            var worker = EcAesCtrAsync.rotator++;
            EcAesCtrAsync.rotator = EcAesCtrAsync.rotator % 8;
            var o = new Object();
            (o)["secret"] = secret;
            (o)["iv"] = iv;
            (o)["text"] = ciphertext;
            (o)["cmd"] = "decryptAesCtr";
            if (EcCrypto.caching) {
                EcAesCtrAsync.q1[worker].push(function(p1) {
                    (EcCrypto.decryptionCache)[secret + iv + ciphertext] = p1;
                    success(p1);
                });
            } else {
                EcAesCtrAsync.q1[worker].push(success);
            }
            EcAesCtrAsync.q2[worker].push(failure);
            EcAesCtrAsync.w[worker].postMessage(o);
        }
    };
}, {w: {name: "Array", arguments: [{name: "Worker", arguments: ["Object"]}]}, q1: {name: "Array", arguments: [{name: "Array", arguments: ["Callback1"]}]}, q2: {name: "Array", arguments: [{name: "Array", arguments: ["Callback1"]}]}}, {});
