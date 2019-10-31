var CryptoKey = function() {};
CryptoKey = stjs.extend(CryptoKey, null, [], null, {}, {});
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
var jwk = function() {};
jwk = stjs.extend(jwk, null, [], function(constructor, prototype) {
    prototype.kty = null;
    prototype.k = null;
    prototype.alg = null;
    prototype.ext = null;
}, {}, {});
/**
 *  Helper classes for dealing with RSA Public Keys.
 * 
 *  @author fritz.ray@eduworks.com
 *  @class EcPk
 *  @module com.eduworks.ec
 */
var EcPk = function() {};
EcPk = stjs.extend(EcPk, null, [], function(constructor, prototype) {
    constructor.cache = null;
    prototype.pk = null;
    prototype.defaultPem = null;
    prototype.jwk = null;
    prototype.key = null;
    prototype.signKey = null;
    /**
     *  Decodes a PEM encoded SubjectPublicKeyInfo (PKCS#8) or RSAPublicKey (PKCS#1) formatted RSA Public Key.
     *  (In case you were curious.)
     * 
     *  @param {string} pem PEM as a string.
     *  @return {EcPk} Object used to perform public key operations.
     *  @method fromPem
     *  @static
     */
    constructor.fromPem = function(pem) {
        var pk = (EcPk.cache)[pem];
        if (pk != null) 
            return pk;
        pk = new EcPk();
        try {
            pk.pk = forge.pki.publicKeyFromPem(pem);
        }catch (ex) {
            return null;
        }
        (EcPk.cache)[pem] = pk;
        return pk;
    };
    /**
     *  Compares two public keys, and returns true if their PEM forms match.
     * 
     *  @param {EcPk} obj Object to compare to.
     *  @return {boolean} True if the keys match.
     *  @method equals
     */
    prototype.equals = function(obj) {
        if (stjs.isInstanceOf(obj.constructor, EcPk)) 
            return this.toPem().equals((obj).toPem());
        return Object.prototype.equals.call(this, obj);
    };
    /**
     *  Encodes the public key into a PEM encoded SubjectPublicKeyInfo (PKCS#8) formatted RSA Public Key.
     *  (In case you were curious.)
     * 
     *  @return {string} PEM encoded public key without whitespace.
     *  @method toPem
     */
    prototype.toPem = function() {
        if (this.defaultPem == null) 
            this.defaultPem = forge.pki.publicKeyToPem(this.pk).replaceAll("\r?\n", "");
        return this.defaultPem;
    };
    /**
     *  Encodes the public key into a PEM encoded RSAPublicKey (PKCS#1) formatted RSA Public Key.
     *  (In case you were curious.)
     * 
     *  @return {string} PEM encoded public key without whitespace.
     *  @method toPkcs1Pem
     */
    prototype.toPkcs1Pem = function() {
        return forge.pki.publicKeyToRSAPublicKeyPem(this.pk).replaceAll("\r?\n", "");
    };
    /**
     *  Encodes the public key into a PEM encoded SubjectPublicKeyInfo (PKCS#8) formatted RSA Public Key.
     *  (In case you were curious.)
     * 
     *  @return {string} PEM encoded public key without whitespace.
     *  @method toPkcs8Pem
     */
    prototype.toPkcs8Pem = function() {
        return forge.pki.publicKeyToPem(this.pk).replaceAll("\r?\n", "");
    };
    prototype.toJwk = function() {
        if (this.jwk == null) 
            this.jwk = pemJwk.pem2jwk(forge.pki.publicKeyToPem(this.pk));
        return this.jwk;
    };
    /**
     *  Hashes the public key into an SSH compatible fingerprint.
     * 
     *  @return {string} Public key fingerprint.
     *  @method fingerprint
     */
    prototype.fingerprint = function() {
        var o = new Object();
        (o)["encoding"] = "hex";
        return forge.ssh.getPublicKeyFingerprint(this.pk, o);
    };
    prototype.verify = function(bytes, decode64) {
        return this.pk.verify(bytes, decode64);
    };
}, {cache: "Object", pk: "forge.pk", jwk: "Object", key: "CryptoKey", signKey: "CryptoKey"}, {});
(function() {
    if (EcPk.cache == null) 
        EcPk.cache = new Object();
})();
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
/**
 *  @author Fritz
 *  @class EcCrypto
 */
var EcCrypto = function() {};
EcCrypto = stjs.extend(EcCrypto, null, [], function(constructor, prototype) {
    /**
     *  Turn on (defualt off) caching of decrypted data.
     *  @property caching
     *  @type boolean
     */
    constructor.caching = false;
    constructor.decryptionCache = new Object();
    /**
     *  Calculate MD5 hash of a string.
     *  @param {String} s String to MD5
     *  @return {String} MD5 hash
     *  @static
     *  @method md5
     */
    constructor.md5 = function(s) {
        var m = forge.md.md5.create();
        m.update(s);
        return m.digest().toHex();
    };
    /**
     *  Calculate SHA-256 hash of a string.
     *  @param {String} s String to SHA-256
     *  @return {String} SHA-256 hash
     *  @static
     *  @method sha256
     */
    constructor.sha256 = function(s) {
        var m = forge.md.sha256.create();
        m.update(s, "utf8");
        return m.digest().toHex();
    };
}, {decryptionCache: "Object"}, {});
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
 *  Helper classes for dealing with RSA Private Keys.
 * 
 *  @author fritz.ray@eduworks.com
 *  @class EcPpk
 *  @module com.eduworks.ec
 */
var EcPpk = function() {};
EcPpk = stjs.extend(EcPpk, null, [], function(constructor, prototype) {
    constructor.cache = null;
    prototype.defaultPem = null;
    prototype.jwk = null;
    prototype.key = null;
    prototype.signKey = null;
    prototype.ppk = null;
    prototype.defaultPk = null;
    /**
     *  Decodes a PEM encoded PrivateKeyInfo (PKCS#8) or RSAPrivateKey (PKCS#1) formatted RSA Public Key.
     *  (In case you were curious.)
     * 
     *  @param {string} pem PEM as a string.
     *  @return {EcPk} Object used to perform public key operations.
     *  @method fromPem
     *  @static
     */
    constructor.fromPem = function(pem) {
        var pk = (EcPpk.cache)[pem];
        if (pk != null) 
            return pk;
        pk = new EcPpk();
        try {
            pk.ppk = forge.pki.privateKeyFromPem(pem);
        }catch (ex) {
            return null;
        }
        (EcPpk.cache)[pem] = pk;
        return pk;
    };
    /**
     *  Generates an RSA Keypair using web workers.
     * 
     *  @param {function(EcPpk)} callback Method called when the keypair is generated.
     *  @method generateKeyAsync
     *  @static
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
     * 
     *  @return {EcPpk} Public private keypair.
     *  @method generateKey
     *  @static
     */
    constructor.generateKey = function() {
        var o = new Object();
        (o)["workers"] = -1;
        var keypair = forge.pki.rsa.generateKeyPair(o, null);
        var ppk = new EcPpk();
        ppk.ppk = keypair.privateKey;
        return ppk;
    };
    /**
     *  Returns true iff the PEM forms of the public private keypair match.
     *  Can also match against a public key if the public portion of the keypair match.
     * 
     *  @param {EcPpk|EcPk} Key to compare to.
     *  @return boolean If they match.
     *  @method equals
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
     * 
     *  @return {string} PEM encoded public key without whitespace.
     *  @method toPem
     */
    prototype.toPem = function() {
        if (this.defaultPem == null) 
            this.defaultPem = forge.pki.privateKeyToPem(this.ppk).replaceAll("\r?\n", "");
        return this.defaultPem;
    };
    /**
     *  Encodes the private key into a PEM encoded RSAPrivateKey (PKCS#1) formatted RSA Public Key.
     *  (In case you were curious.)
     * 
     *  @return {string} PEM encoded public key without whitespace.
     *  @method toPkcs1Pem
     */
    prototype.toPkcs1Pem = function() {
        return forge.pki.privateKeyToPem(this.ppk).replaceAll("\r?\n", "");
    };
    /**
     *  Encodes the private key into a PEM encoded PrivateKeyInfo (PKCS#8) formatted RSA Public Key.
     *  (In case you were curious.)
     * 
     *  @return {string} PEM encoded public key without whitespace.
     *  @method toPkcs8Pem
     */
    prototype.toPkcs8Pem = function() {
        return forge.pki.privateKeyInfoToPem(forge.pki.wrapRsaPrivateKey(forge.pki.privateKeyToAsn1(this.ppk))).replaceAll("\r?\n", "");
    };
    prototype.toJwk = function() {
        if (this.jwk == null) 
            this.jwk = pemJwk.pem2jwk(forge.pki.privateKeyToPem(this.ppk));
        return this.jwk;
    };
    prototype.toPkcs8 = function() {
        return forge.pki.wrapRsaPrivateKey(forge.pki.privateKeyToAsn1(this.ppk));
    };
    /**
     *  Extracts the public key portion from the public private keypair.
     * 
     *  @return {EcPk} Public Key Helper.
     *  @method toPk
     */
    prototype.toPk = function() {
        if (this.defaultPk != null) 
            return this.defaultPk;
        var pk = this.defaultPk = new EcPk();
        pk.pk = forge.pki.rsa.setPublicKey(this.ppk.n, this.ppk.e);
        return pk;
    };
    /**
     *  Returns true if this PPK is in an array of PPKs.
     * 
     *  @param {Array<EcPpk>} ppks Array of ppks
     *  @return true iff this PPK in ppks.
     *  @method inArray
     */
    prototype.inArray = function(ppks) {
        for (var i = 0; i < ppks.length; i++) {
            if (ppks[i].equals(this)) 
                return true;
        }
        return false;
    };
}, {cache: "Object", jwk: "Object", key: "CryptoKey", signKey: "CryptoKey", ppk: "forge.ppk", defaultPk: "EcPk"}, {});
(function() {
    if (EcPpk.cache == null) 
        EcPpk.cache = new Object();
})();
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
     *  @param {EcPk}   pk Public Key.
     *  @param {string} plaintext Plaintext. Does not perform encoding.
     *  @method encrypt
     *  @static
     */
    constructor.encrypt = function(pk, plaintext) {
        if ((typeof httpStatus) != "undefined") {
            return rsaEncrypt(plaintext, pk.toPem());
        }
        return forge.util.encode64(pk.pk.encrypt(forge.util.encodeUtf8(plaintext), "RSA-OAEP"));
    };
    /**
     *  Decrypts a block of ciphertext (no more than 256 bytes) with a private
     *  key using RSA OAEP encryption. Returns a unencoded plaintext.
     * 
     *  @param {EcPpk}  ppk Public private keypair.
     *  @param {string} ciphertext Ciphertext.
     *  @return {string} Unencoded plaintext.
     *  @method decrypt
     *  @static
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
        if ((typeof httpStatus) != "undefined") {
            result = rsaDecrypt(ciphertext, ppk.toPem());
        } else {
            result = forge.util.decodeUtf8(ppk.ppk.decrypt(forge.util.decode64(ciphertext), "RSA-OAEP"));
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
     *  @param {EcPpk}  ppk Public private keypair.
     *  @param {string} text Text to sign.
     *  @return Base64 encoded signature.
     *  @method sign
     *  @static
     */
    constructor.sign = function(ppk, text) {
        if ((typeof httpStatus) != "undefined") {
            return rsaSign(text, ppk.toPem());
        }
        var s = forge.md.sha1.create();
        s.update(forge.util.encodeUtf8(text), "utf8");
        return forge.util.encode64(ppk.ppk.sign(s));
    };
    /**
     *  Creates a signature for the provided text using the public private
     *  keypair. May be verified with the public key. Uses SHA256 hash with a
     *  UTF8 decoding of the text. Returns base64 encoded signature.
     * 
     *  @param {EcPpk}  ppk Public private keypair.
     *  @param {string} text Text to sign.
     *  @return Base64 encoded signature.
     *  @method signSha256
     *  @static
     */
    constructor.signSha256 = function(ppk, text) {
        var s = forge.md.sha256.create();
        s.update(forge.util.encodeUtf8(text), "utf8");
        return forge.util.encode64(ppk.ppk.sign(s));
    };
    /**
     *  Verifies the integrity of the provided text using a signature and a
     *  public key. Uses SHA1 hash with a UTF8 decoding of the text.
     * 
     *  @param {EcPk}   pk Public key.
     *  @param {string} text Text to verify.
     *  @param {string} signature Base64 encoded signature.
     *  @return True IFF the signature is valid.
     *  @static
     *  @method verify
     */
    constructor.verify = function(pk, text, signature) {
        if ((typeof httpStatus) != "undefined") {
            return rsaVerify(signature, pk.toPem(), text);
        }
        var s = forge.md.sha1.create();
        s.update(forge.util.encodeUtf8(text), "utf8");
        try {
            return pk.verify(s.digest().bytes(), forge.util.decode64(signature));
        }catch (ex) {
            return false;
        }
    };
}, {}, {});
/**
 *  Encrypts data synchronously using AES-256-CTR. Requires secret and iv to be 32 bytes.
 *  Output is encoded in base64 for easier handling.
 * 
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
     * 
     *  @param {string} plaintext Text to encrypt.
     *  @param {string} secret Secret to use to encrypt.
     *  @param {string} iv Initialization Vector to use to encrypt.
     *  @return {string} Ciphertext encoded using base64.
     *  @method encrypt
     *  @static
     */
    constructor.encrypt = function(plaintext, secret, iv) {
        if ((typeof httpStatus) != "undefined" && forge.util.decode64(secret).length == 16 && forge.util.decode64(iv).length == 16) 
            return aesEncrypt(plaintext, iv, secret);
        var c = forge.cipher.createCipher("AES-CTR", forge.util.decode64(secret));
        c.start(new EcAesParameters(iv));
        c.update(forge.util.createBuffer(forge.util.encodeUtf8(plaintext)));
        c.finish();
        var encrypted = c.output;
        return forge.util.encode64(encrypted.bytes());
    };
    /**
     *  Decrypts ciphertext using AES-256-CTR.
     *  Ciphertext must be base64 encoded ciphertext.
     *  Returns plaintext as a string (Sequence of bytes, no encoding).
     * 
     *  @param {string} ciphertext Ciphertext to decrypt.
     *  @param {string} secret Secret to use to decrypt.
     *  @param {string} iv Initialization Vector to use to decrypt.
     *  @return {string} Plaintext with no encoding.
     *  @method decrypt
     *  @static
     */
    constructor.decrypt = function(ciphertext, secret, iv) {
        if (EcCrypto.caching) {
            var cacheGet = (EcCrypto.decryptionCache)[secret + iv + ciphertext];
            if (cacheGet != null) 
                return cacheGet;
        }
        if ((typeof httpStatus) != "undefined" && forge.util.decode64(secret).length == 16 && forge.util.decode64(iv).length == 16) {
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
            (EcCrypto.decryptionCache)[secret + iv + ciphertext] = forge.util.decodeUtf8(decrypted.data);
        return forge.util.decodeUtf8(decrypted.data);
    };
}, {}, {});
/**
 *  Asynchronous implementation of {{#crossLink
 *  "EcRsaOaep"}}EcRsaOaep{{/crossLink}}. Uses web workers and assumes 8 workers.
 * 
 *  @author fritz.ray@eduworks.com
 *  @class EcRsaOaepAsyncWorker
 *  @module com.eduworks.ec
 */
var EcRsaOaepAsyncWorker = function() {};
EcRsaOaepAsyncWorker = stjs.extend(EcRsaOaepAsyncWorker, null, [], function(constructor, prototype) {
    constructor.rotator = 0;
    constructor.w = null;
    constructor.q1 = null;
    constructor.q2 = null;
    constructor.initWorker = function() {
        if (window == null && ((typeof self).equals("undefined")) || Worker == undefined || Worker == null) {
            return;
        }
        if (!EcRemote.async) {
            return;
        }
        if (EcRsaOaepAsyncWorker.w != null) {
            return;
        }
        EcRsaOaepAsyncWorker.rotator = 0;
        EcRsaOaepAsyncWorker.q1 = new Array();
        EcRsaOaepAsyncWorker.q2 = new Array();
        EcRsaOaepAsyncWorker.w = new Array();
        for (var index = 0; index < 8; index++) {
            EcRsaOaepAsyncWorker.createWorker(index);
        }
    };
    constructor.createWorker = function(index) {
        EcRsaOaepAsyncWorker.q1.push(new Array());
        EcRsaOaepAsyncWorker.q2.push(new Array());
        var wkr;
        if ((window)["scriptPath"] != null) 
            EcRsaOaepAsyncWorker.w.push(wkr = new Worker((window)["scriptPath"] + "forgeAsync.js"));
         else 
            EcRsaOaepAsyncWorker.w.push(wkr = new Worker("forgeAsync.js"));
        wkr.onmessage = function(p1) {
            var o = p1.data;
            var success = EcRsaOaepAsyncWorker.q1[index].shift();
            var failure = EcRsaOaepAsyncWorker.q2[index].shift();
            if ((o)["error"] != null) {
                if (failure != null) 
                    failure((o)["error"]);
            } else if (success != null) {
                success((o)["result"]);
            }
        };
        wkr.onerror = function(p1) {
            var success = EcRsaOaepAsyncWorker.q1[index].shift();
            var failure = EcRsaOaepAsyncWorker.q2[index].shift();
            if (failure != null) {
                failure(p1.toString());
            }
        };
    };
    /**
     *  Asynchronous form of {{#crossLink
     *  "EcRsaOaep/encrypt:method"}}EcRsaOaep.encrypt{{/crossLink}}
     * 
     *  @param {EcPk}             pk Public Key to use to encrypt.
     *  @param {string}           plaintext Plaintext to encrypt.
     *  @param {function(string)} success Success method, result is Base64
     *                            encoded Ciphertext.
     *  @param {function(string)} failure Failure method, parameter is error
     *                            message.
     *  @method encrypt
     *  @static
     */
    constructor.encrypt = function(pk, plaintext, success, failure) {
        EcRsaOaepAsyncWorker.initWorker();
        if (!EcRemote.async || EcRsaOaepAsyncWorker.w == null) {
            success(EcRsaOaep.encrypt(pk, plaintext));
        } else {
            var worker = EcRsaOaepAsyncWorker.rotator++;
            EcRsaOaepAsyncWorker.rotator = EcRsaOaepAsyncWorker.rotator % 8;
            var o = new Object();
            (o)["pk"] = pk.toPem();
            (o)["text"] = forge.util.encodeUtf8(plaintext);
            (o)["cmd"] = "encryptRsaOaep";
            EcRsaOaepAsyncWorker.q1[worker].push(success);
            EcRsaOaepAsyncWorker.q2[worker].push(failure);
            EcRsaOaepAsyncWorker.w[worker].postMessage(o);
        }
    };
    /**
     *  Asynchronous form of {{#crossLink
     *  "EcRsaOaep/decrypt:method"}}EcRsaOaep.decrypt{{/crossLink}}
     * 
     *  @param {EcPpk}            ppk Public private keypair to use to decrypt.
     *  @param {string}           ciphertext Ciphertext to decrypt.
     *  @param {function(string)} success Success method, result is unencoded
     *                            plaintext.
     *  @param {function(string)} failure Failure method, parameter is error
     *                            message.
     *  @method decrypt
     *  @static
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
        EcRsaOaepAsyncWorker.initWorker();
        if (!EcRemote.async || EcRsaOaepAsyncWorker.w == null) {
            success(EcRsaOaep.decrypt(ppk, ciphertext));
        } else {
            var worker = EcRsaOaepAsyncWorker.rotator++;
            EcRsaOaepAsyncWorker.rotator = EcRsaOaepAsyncWorker.rotator % 8;
            var o = new Object();
            (o)["ppk"] = ppk.toPem();
            (o)["text"] = ciphertext;
            (o)["cmd"] = "decryptRsaOaep";
            if (EcCrypto.caching) {
                EcRsaOaepAsyncWorker.q1[worker].push(function(p1) {
                    (EcCrypto.decryptionCache)[ppk.toPem() + ciphertext] = forge.util.decodeUtf8(p1);
                    success(forge.util.decodeUtf8(p1));
                });
            } else {
                EcRsaOaepAsyncWorker.q1[worker].push(function(p1) {
                    success(forge.util.decodeUtf8(p1));
                });
            }
            EcRsaOaepAsyncWorker.q2[worker].push(failure);
            EcRsaOaepAsyncWorker.w[worker].postMessage(o);
        }
    };
    /**
     *  Asynchronous form of {{#crossLink
     *  "EcRsaOaep/sign:method"}}EcRsaOaep.sign{{/crossLink}}
     * 
     *  @param {EcPpk}            ppk Public private keypair to use to sign message.
     *  @param {string}           text Text to sign.
     *  @param {function(string)} success Success method, result is Base64
     *                            encoded signature.
     *  @param {function(string)} failure Failure method, parameter is error
     *                            message.
     *  @method sign
     *  @static
     */
    constructor.sign = function(ppk, text, success, failure) {
        EcRsaOaepAsyncWorker.initWorker();
        if (!EcRemote.async || EcRsaOaepAsyncWorker.w == null) {
            success(EcRsaOaep.sign(ppk, text));
        } else {
            var worker = EcRsaOaepAsyncWorker.rotator++;
            EcRsaOaepAsyncWorker.rotator = EcRsaOaepAsyncWorker.rotator % 8;
            var o = new Object();
            (o)["ppk"] = ppk.toPem();
            (o)["text"] = forge.util.encodeUtf8(text);
            (o)["cmd"] = "signRsaOaep";
            EcRsaOaepAsyncWorker.q1[worker].push(success);
            EcRsaOaepAsyncWorker.q2[worker].push(failure);
            EcRsaOaepAsyncWorker.w[worker].postMessage(o);
        }
    };
    /**
     *  Asynchronous form of {{#crossLink
     *  "EcRsaOaep/signSha256:method"}}EcRsaOaep.signSha256{{/crossLink}}
     * 
     *  @param {EcPpk}            ppk Public private keypair to use to sign message.
     *  @param {string}           text Text to sign.
     *  @param {function(string)} success Success method, result is Base64
     *                            encoded signature.
     *  @param {function(string)} failure Failure method, parameter is error
     *                            message.
     *  @method signSha256
     *  @static
     */
    constructor.signSha256 = function(ppk, text, success, failure) {
        EcRsaOaepAsyncWorker.initWorker();
        if (!EcRemote.async || EcRsaOaepAsyncWorker.w == null) {
            success(EcRsaOaep.signSha256(ppk, text));
        } else {
            var worker = EcRsaOaepAsyncWorker.rotator++;
            EcRsaOaepAsyncWorker.rotator = EcRsaOaepAsyncWorker.rotator % 8;
            var o = new Object();
            (o)["ppk"] = ppk.toPem();
            (o)["text"] = forge.util.encodeUtf8(text);
            (o)["cmd"] = "signSha256RsaOaep";
            EcRsaOaepAsyncWorker.q1[worker].push(success);
            EcRsaOaepAsyncWorker.q2[worker].push(failure);
            EcRsaOaepAsyncWorker.w[worker].postMessage(o);
        }
    };
    /**
     *  Asynchronous form of {{#crossLink
     *  "EcRsaOaep/verify:method"}}EcRsaOaep.verify{{/crossLink}}
     * 
     *  @param {EcPk}              pk Public key to use to verify message.
     *  @param {string}            text Text to use in verification.
     *  @param {string}            signature Signature to use in verification.
     *  @param {function(boolean)} success Success method, result is whether
     *                             signature is valid.
     *  @param {function(string)}  failure Failure method, parameter is error
     *                             message.
     *  @method verify
     *  @static
     */
    constructor.verify = function(pk, text, signature, success, failure) {
        EcRsaOaepAsyncWorker.initWorker();
        if (!EcRemote.async || EcRsaOaepAsyncWorker.w == null) {
            success(EcRsaOaep.verify(pk, text, signature));
        } else {
            var worker = EcRsaOaepAsyncWorker.rotator++;
            EcRsaOaepAsyncWorker.rotator = EcRsaOaepAsyncWorker.rotator % 8;
            var o = new Object();
            (o)["pk"] = pk.toPem();
            (o)["text"] = forge.util.encodeUtf8(text);
            (o)["signature"] = signature;
            (o)["cmd"] = "verifyRsaOaep";
            EcRsaOaepAsyncWorker.q1[worker].push(success);
            EcRsaOaepAsyncWorker.q2[worker].push(failure);
            EcRsaOaepAsyncWorker.w[worker].postMessage(o);
        }
    };
}, {w: {name: "Array", arguments: [{name: "Worker", arguments: ["Object"]}]}, q1: {name: "Array", arguments: [{name: "Array", arguments: ["Callback1"]}]}, q2: {name: "Array", arguments: [{name: "Array", arguments: ["Callback1"]}]}}, {});
/**
 *  Asynchronous implementation of {{#crossLink
 *  "EcAesCtr"}}EcAesCtr{{/crossLink}}. Uses web workers and assumes 8 workers.
 * 
 *  @author fritz.ray@eduworks.com
 *  @class EcAesCtrAsyncWorker
 *  @module com.eduworks.ec
 */
var EcAesCtrAsyncWorker = function() {};
EcAesCtrAsyncWorker = stjs.extend(EcAesCtrAsyncWorker, null, [], function(constructor, prototype) {
    constructor.rotator = 0;
    constructor.w = null;
    constructor.q1 = null;
    constructor.q2 = null;
    constructor.initWorker = function() {
        if (window == null && ((typeof self).equals("undefined")) || Worker == undefined || Worker == null) {
            return;
        }
        if (!EcRemote.async) {
            return;
        }
        if (EcAesCtrAsyncWorker.w != null) {
            return;
        }
        EcAesCtrAsyncWorker.rotator = 0;
        EcAesCtrAsyncWorker.q1 = new Array();
        EcAesCtrAsyncWorker.q2 = new Array();
        EcAesCtrAsyncWorker.w = new Array();
        for (var index = 0; index < 8; index++) {
            EcAesCtrAsyncWorker.createWorker(index);
        }
    };
    constructor.createWorker = function(index) {
        EcAesCtrAsyncWorker.q1.push(new Array());
        EcAesCtrAsyncWorker.q2.push(new Array());
        var wkr;
        if ((window)["scriptPath"] != null) 
            EcAesCtrAsyncWorker.w.push(wkr = new Worker((window)["scriptPath"] + "forgeAsync.js"));
         else 
            EcAesCtrAsyncWorker.w.push(wkr = new Worker("forgeAsync.js"));
        wkr.onmessage = function(p1) {
            var o = p1.data;
            var success = EcAesCtrAsyncWorker.q1[index].shift();
            var failure = EcAesCtrAsyncWorker.q2[index].shift();
            if ((o)["error"] != null) {
                if (failure != null) 
                    failure((o)["error"]);
            } else if (success != null) {
                success((o)["result"]);
            }
        };
        wkr.onerror = function(p1) {
            var success = EcAesCtrAsyncWorker.q1[index].shift();
            var failure = EcAesCtrAsyncWorker.q2[index].shift();
            if (failure != null) {
                failure(p1.toString());
            }
        };
    };
    /**
     *  Asynchronous form of {{#crossLink
     *  "EcAesCtr/encrypt:method"}}EcAesCtr.encrypt{{/crossLink}}
     * 
     *  @param {string}           plaintext Text to encrypt.
     *  @param {string}           secret Secret to use to encrypt.
     *  @param {string}           iv Initialization Vector to use to encrypt.
     *  @param {function(string)} success Success method, result is Base64
     *                            encoded Ciphertext.
     *  @param {function(string)} failure Failure method, parameter is error
     *                            message.
     *  @method encrypt
     *  @static
     */
    constructor.encrypt = function(plaintext, secret, iv, success, failure) {
        EcAesCtrAsyncWorker.initWorker();
        if (!EcRemote.async || EcAesCtrAsyncWorker.w == null) {
            success(EcAesCtr.encrypt(plaintext, secret, iv));
        } else {
            var worker = EcAesCtrAsyncWorker.rotator++;
            EcAesCtrAsyncWorker.rotator = EcAesCtrAsyncWorker.rotator % 8;
            var o = new Object();
            (o)["secret"] = secret;
            (o)["iv"] = iv;
            (o)["text"] = forge.util.encodeUtf8(plaintext);
            (o)["cmd"] = "encryptAesCtr";
            EcAesCtrAsyncWorker.q1[worker].push(success);
            EcAesCtrAsyncWorker.q2[worker].push(failure);
            EcAesCtrAsyncWorker.w[worker].postMessage(o);
        }
    };
    /**
     *  Asynchronous form of {{#crossLink
     *  "EcAesCtr/decrypt:method"}}EcAesCtr.decrypt{{/crossLink}}
     * 
     *  @param {string}           ciphertext Text to decrypt.
     *  @param {string}           secret Secret to use to decrypt.
     *  @param {string}           iv Initialization Vector to use to decrypt.
     *  @param {function(string)} success Success method, result is Plaintext
     *                            with no encoding.
     *  @param {function(string)} failure Failure method, parameter is error
     *                            message.
     *  @method decrypt
     *  @static
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
        EcAesCtrAsyncWorker.initWorker();
        if (!EcRemote.async || EcAesCtrAsyncWorker.w == null) {
            success(EcAesCtr.decrypt(ciphertext, secret, iv));
        } else {
            var worker = EcAesCtrAsyncWorker.rotator++;
            EcAesCtrAsyncWorker.rotator = EcAesCtrAsyncWorker.rotator % 8;
            var o = new Object();
            (o)["secret"] = secret;
            (o)["iv"] = iv;
            (o)["text"] = ciphertext;
            (o)["cmd"] = "decryptAesCtr";
            if (EcCrypto.caching) {
                EcAesCtrAsyncWorker.q1[worker].push(function(p1) {
                    (EcCrypto.decryptionCache)[secret + iv + ciphertext] = forge.util.decodeUtf8(p1);
                    success(forge.util.decodeUtf8(p1));
                });
            } else {
                EcAesCtrAsyncWorker.q1[worker].push(function(p1) {
                    success(forge.util.decodeUtf8(p1));
                });
            }
            EcAesCtrAsyncWorker.q2[worker].push(failure);
            EcAesCtrAsyncWorker.w[worker].postMessage(o);
        }
    };
}, {w: {name: "Array", arguments: [{name: "Worker", arguments: ["Object"]}]}, q1: {name: "Array", arguments: [{name: "Array", arguments: ["Callback1"]}]}, q2: {name: "Array", arguments: [{name: "Array", arguments: ["Callback1"]}]}}, {});
/**
 *  Async version of EcRsaOaep that uses browser extensions (window.crypto) to accomplish cryptography much faster.
 *  Falls back to EcRsaOaepAsyncWorker, if window.crypto is not available.
 *  @class EcRsaOaepAsync
 */
var EcRsaOaepAsync = function() {};
EcRsaOaepAsync = stjs.extend(EcRsaOaepAsync, null, [], function(constructor, prototype) {
    /**
     *  Asynchronous form of {{#crossLink
     *  "EcRsaOaep/encrypt:method"}}EcRsaOaep.encrypt{{/crossLink}}
     * 
     *  @param {EcPk}             pk Public Key to use to encrypt.
     *  @param {string}           plaintext Plaintext to encrypt.
     *  @param {function(string)} success Success method, result is Base64
     *                            encoded Ciphertext.
     *  @param {function(string)} failure Failure method, parameter is error
     *                            message.
     *  @method encrypt
     *  @static
     */
    constructor.encrypt = function(pk, plainText, success, failure) {
        if (EcRemote.async == false) {
            success(EcRsaOaep.encrypt(pk, plainText));
            return;
        }
        if (EcBrowserDetection.isIeOrEdge() || window == null || window.crypto == null || window.crypto.subtle == null) {
            EcRsaOaepAsyncWorker.encrypt(pk, plainText, success, failure);
            return;
        }
        var keyUsages = new Array();
        keyUsages.push("encrypt");
        var algorithm = new Object();
        algorithm.name = "RSA-OAEP";
        algorithm.hash = "SHA-1";
        if (pk.key == null) 
            window.crypto.subtle.importKey("jwk", pk.toJwk(), algorithm, false, keyUsages).then(function(key) {
                pk.key = key;
                window.crypto.subtle.encrypt(algorithm, key, str2ab(forge.util.encodeUtf8(plainText))).then(function(p1) {
                    success(base64.encode(p1));
                }, failure);
            }, failure);
         else 
            window.crypto.subtle.encrypt(algorithm, pk.key, str2ab(forge.util.encodeUtf8(plainText))).then(function(p1) {
                success(base64.encode(p1));
            }, failure);
    };
    /**
     *  Asynchronous form of {{#crossLink
     *  "EcRsaOaep/decrypt:method"}}EcRsaOaep.decrypt{{/crossLink}}
     * 
     *  @param {EcPpk}            ppk Public private keypair to use to decrypt.
     *  @param {string}           ciphertext Ciphertext to decrypt.
     *  @param {function(string)} success Success method, result is unencoded
     *                            plaintext.
     *  @param {function(string)} failure Failure method, parameter is error
     *                            message.
     *  @method decrypt
     *  @static
     */
    constructor.decrypt = function(ppk, cipherText, success, failure) {
        if (EcCrypto.caching) {
            var cacheGet = null;
            cacheGet = (EcCrypto.decryptionCache)[ppk.toPem() + cipherText];
            if (cacheGet != null) {
                success(cacheGet);
                return;
            }
        }
        if (EcRemote.async == false) {
            success(EcRsaOaep.decrypt(ppk, cipherText));
            return;
        }
        if (EcBrowserDetection.isIeOrEdge() || window == null || window.crypto == null || window.crypto.subtle == null) {
            EcRsaOaepAsyncWorker.decrypt(ppk, cipherText, success, failure);
            return;
        }
        var keyUsages = new Array();
        keyUsages.push("decrypt");
        var algorithm = new Object();
        algorithm.name = "RSA-OAEP";
        algorithm.hash = "SHA-1";
        if (ppk.key == null) 
            window.crypto.subtle.importKey("jwk", ppk.toJwk(), algorithm, false, keyUsages).then(function(key) {
                ppk.key = key;
                window.crypto.subtle.decrypt(algorithm, key, base64.decode(cipherText)).then(function(p1) {
                    var result = forge.util.decodeUtf8(ab2str(p1));
                    if (EcCrypto.caching) {
                        (EcCrypto.decryptionCache)[ppk.toPem() + cipherText] = result;
                    }
                    success(result);
                }, failure);
            }, failure);
         else 
            window.crypto.subtle.decrypt(algorithm, ppk.key, base64.decode(cipherText)).then(function(p1) {
                var result = forge.util.decodeUtf8(ab2str(p1));
                if (EcCrypto.caching) {
                    (EcCrypto.decryptionCache)[ppk.toPem() + cipherText] = result;
                }
                success(result);
            }, failure);
    };
    /**
     *  Asynchronous form of {{#crossLink
     *  "EcRsaOaep/sign:method"}}EcRsaOaep.sign{{/crossLink}}
     * 
     *  @param {EcPpk}            ppk Public private keypair to use to sign message.
     *  @param {string}           text Text to sign.
     *  @param {function(string)} success Success method, result is Base64
     *                            encoded signature.
     *  @param {function(string)} failure Failure method, parameter is error
     *                            message.
     *  @method sign
     *  @static
     */
    constructor.sign = function(ppk, text, success, failure) {
        if (EcRemote.async == false) {
            success(EcRsaOaep.sign(ppk, text));
            return;
        }
        if (EcBrowserDetection.isIeOrEdge() || window == null || window.crypto == null || window.crypto.subtle == null) {
            EcRsaOaepAsyncWorker.sign(ppk, text, success, failure);
            return;
        }
        var keyUsages = new Array();
        keyUsages.push("sign");
        var algorithm = new Object();
        algorithm.name = "RSASSA-PKCS1-v1_5";
        algorithm.hash = "SHA-1";
        if (ppk.signKey == null) 
            window.crypto.subtle.importKey("jwk", ppk.toJwk(), algorithm, false, keyUsages).then(function(key) {
                ppk.signKey = key;
                window.crypto.subtle.sign(algorithm, key, str2ab(forge.util.encodeUtf8(text))).then(function(p1) {
                    success(base64.encode(p1));
                }, failure);
            }, failure);
         else 
            window.crypto.subtle.sign(algorithm, ppk.signKey, str2ab(forge.util.encodeUtf8(text))).then(function(p1) {
                success(base64.encode(p1));
            }, failure);
    };
    /**
     *  Asynchronous form of {{#crossLink
     *  "EcRsaOaep/signSha256:method"}}EcRsaOaep.signSha256{{/crossLink}}
     * 
     *  @param {EcPpk}            ppk Public private keypair to use to sign message.
     *  @param {string}           text Text to sign.
     *  @param {function(string)} success Success method, result is Base64
     *                            encoded signature.
     *  @param {function(string)} failure Failure method, parameter is error
     *                            message.
     *  @method signSha256
     *  @static
     */
    constructor.signSha256 = function(ppk, text, success, failure) {
        if (EcRemote.async == false) {
            success(EcRsaOaep.signSha256(ppk, text));
            return;
        }
        if (EcBrowserDetection.isIeOrEdge() || window == null || window.crypto == null || window.crypto.subtle == null) {
            EcRsaOaepAsyncWorker.sign(ppk, text, success, failure);
            return;
        }
        var keyUsages = new Array();
        keyUsages.push("sign");
        var algorithm = new Object();
        algorithm.name = "RSASSA-PKCS1-v1_5";
        algorithm.hash = "SHA-256";
        if (ppk.signKey == null) 
            window.crypto.subtle.importKey("jwk", ppk.toJwk(), algorithm, false, keyUsages).then(function(key) {
                ppk.signKey = key;
                window.crypto.subtle.sign(algorithm, key, str2ab(forge.util.encodeUtf8(text))).then(function(p1) {
                    success(base64.encode(p1));
                }, failure);
            }, failure);
         else 
            window.crypto.subtle.sign(algorithm, ppk.signKey, str2ab(forge.util.encodeUtf8(text))).then(function(p1) {
                success(base64.encode(p1));
            }, failure);
    };
    /**
     *  Asynchronous form of {{#crossLink
     *  "EcRsaOaep/verify:method"}}EcRsaOaep.verify{{/crossLink}}
     * 
     *  @param {EcPk}              pk Public key to use to verify message.
     *  @param {string}            text Text to use in verification.
     *  @param {string}            signature Signature to use in verification.
     *  @param {function(boolean)} success Success method, result is whether
     *                             signature is valid.
     *  @param {function(string)}  failure Failure method, parameter is error
     *                             message.
     *  @method verify
     *  @static
     */
    constructor.verify = function(pk, text, signature, success, failure) {
        if (EcRemote.async == false) {
            success(EcRsaOaep.verify(pk, text, signature));
            return;
        }
        if (EcBrowserDetection.isIeOrEdge() || window == null || window.crypto == null || window.crypto.subtle == null) {
            EcRsaOaepAsyncWorker.verify(pk, text, signature, success, failure);
            return;
        }
        var keyUsages = new Array();
        keyUsages.push("verify");
        var algorithm = new Object();
        algorithm.name = "RSASSA-PKCS1-v1_5";
        algorithm.hash = "SHA-1";
        if (pk.signKey == null) 
            window.crypto.subtle.importKey("jwk", pk.toJwk(), algorithm, false, keyUsages).then(function(key) {
                pk.signKey = key;
                window.crypto.subtle.verify(algorithm, key, base64.decode(signature), str2ab(forge.util.encodeUtf8(text))).then(function(p1) {
                    success(p1);
                }, failure);
            }, failure);
         else 
            window.crypto.subtle.verify(algorithm, pk.signKey, base64.decode(signature), str2ab(forge.util.encodeUtf8(text))).then(function(p1) {
                success(p1);
            }, failure);
    };
}, {}, {});
/**
 *  Async version of EcAesCtr that uses browser extensions (window.crypto) to accomplish cryptography much faster.
 *  Falls back to EcAesCtrAsyncWorker, if window.crypto is not available.
 *  @class EcAesCtrAsync
 */
var EcAesCtrAsync = function() {};
EcAesCtrAsync = stjs.extend(EcAesCtrAsync, null, [], function(constructor, prototype) {
    /**
     *  Asynchronous form of {{#crossLink
     *  "EcAesCtr/encrypt:method"}}EcAesCtr.encrypt{{/crossLink}}
     * 
     *  @param {string}           plaintext Text to encrypt.
     *  @param {string}           secret Secret to use to encrypt.
     *  @param {string}           iv Initialization Vector to use to encrypt.
     *  @param {function(string)} success Success method, result is Base64
     *                            encoded Ciphertext.
     *  @param {function(string)} failure Failure method, parameter is error
     *                            message.
     *  @method encrypt
     *  @static
     */
    constructor.encrypt = function(plaintext, secret, iv, success, failure) {
        if (window == null || window.crypto == null || window.crypto.subtle == null) {
            EcAesCtrAsyncWorker.encrypt(plaintext, secret, iv, success, failure);
            return;
        }
        if (EcRemote.async == false) {
            success(EcAesCtr.encrypt(plaintext, secret, iv));
            return;
        }
        var keyUsages = new Array();
        keyUsages.push("encrypt", "decrypt");
        var algorithm = new Object();
        algorithm.name = "AES-CTR";
        algorithm.counter = base64.decode(iv);
        algorithm.length = 128;
        var data;
        data = str2ab(plaintext);
        window.crypto.subtle.importKey("raw", base64.decode(secret), algorithm, false, keyUsages).then(function(key) {
            var p = window.crypto.subtle.encrypt(algorithm, key, data);
            p.then(function(p1) {
                success(base64.encode(p1));
            }, failure);
        }, failure);
    };
    /**
     *  Asynchronous form of {{#crossLink
     *  "EcAesCtr/decrypt:method"}}EcAesCtr.decrypt{{/crossLink}}
     * 
     *  @param {string}           ciphertext Text to decrypt.
     *  @param {string}           secret Secret to use to decrypt.
     *  @param {string}           iv Initialization Vector to use to decrypt.
     *  @param {function(string)} success Success method, result is Plaintext
     *                            with no encoding.
     *  @param {function(string)} failure Failure method, parameter is error
     *                            message.
     *  @method decrypt
     *  @static
     */
    constructor.decrypt = function(ciphertext, secret, iv, success, failure) {
        if (EcCrypto.caching) {
            var cacheGet = (EcCrypto.decryptionCache)[secret + iv + ciphertext];
            if (cacheGet != null) {
                success(cacheGet);
                return;
            }
        }
        if (window.crypto == null || window.crypto.subtle == null) {
            EcAesCtrAsyncWorker.decrypt(ciphertext, secret, iv, success, failure);
            return;
        }
        if (EcRemote.async == false) {
            success(EcAesCtr.decrypt(ciphertext, secret, iv));
        }
        var keyUsages = new Array();
        keyUsages.push("encrypt", "decrypt");
        var algorithm = new Object();
        algorithm.name = "AES-CTR";
        algorithm.counter = base64.decode(iv);
        algorithm.length = 128;
        var data;
        data = base64.decode(ciphertext);
        window.crypto.subtle.importKey("raw", base64.decode(secret), algorithm, false, keyUsages).then(function(key) {
            var p = window.crypto.subtle.decrypt(algorithm, key, data);
            p.then(function(p1) {
                (EcCrypto.decryptionCache)[secret + iv + ciphertext] = ab2str(p1);
                success(ab2str(p1));
            }, failure);
        }, failure);
    };
}, {}, {});
