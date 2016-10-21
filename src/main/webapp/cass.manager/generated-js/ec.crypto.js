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
var EcPk = function() {};
EcPk = stjs.extend(EcPk, null, [], function(constructor, prototype) {
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
    prototype.equals = function(obj) {
        if (stjs.isInstanceOf(obj.constructor, EcPk)) 
            return this.toPem().equals((obj).toPem());
        return Object.prototype.equals.call(this, obj);
    };
    prototype.toPem = function() {
        return forge.pki.publicKeyToPem(this.pk).replaceAll("\r?\n", "");
    };
    prototype.toRsaPublicKey = function() {
        return forge.pki.publicKeyToRSAPublicKeyPem(this.pk).replaceAll("\r?\n", "");
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
 *  @author fray
 */
var EcAes = function() {};
EcAes = stjs.extend(EcAes, null, [], function(constructor, prototype) {
    /**
     *  Generates a random Initialization Vector of length @i
     *  @param i Length of initialization Vector
     *  @return String representing the new Initialization Vector in Base64 Encoding.
     */
    constructor.newIv = function(i) {
        return forge.util.encode64(forge.random.getBytesSync(i));
    };
}, {}, {});
var CryptoKey = function() {};
CryptoKey = stjs.extend(CryptoKey, null, [], null, {}, {});
var EcRsaOaep = function() {};
EcRsaOaep = stjs.extend(EcRsaOaep, null, [], function(constructor, prototype) {
    constructor.encrypt = function(pk, text) {
        return forge.util.encode64(pk.pk.encrypt(text, "RSA-OAEP"));
    };
    constructor.decrypt = function(ppk, text) {
        return ppk.ppk.decrypt(forge.util.decode64(text), "RSA-OAEP");
    };
    constructor.sign = function(ppk, text) {
        var s = forge.md.sha1.create();
        s.update(text, "utf8");
        return forge.util.encode64(ppk.ppk.sign(s));
    };
    constructor.signSha256 = function(ppk, text) {
        var s = forge.md.sha256.create();
        s.update(text, "utf8");
        return forge.util.encode64(ppk.ppk.sign(s));
    };
    constructor.verify = function(pk, text, signature) {
        var s = forge.md.sha1.create();
        s.update(text, "utf8");
        try {
            return pk.verify(s.digest().bytes(), forge.util.decode64(signature));
        }catch (ex) {
            return false;
        }
    };
}, {}, {});
var EcAesParameters = function(iv) {
    this.iv = forge.util.decode64(iv);
};
EcAesParameters = stjs.extend(EcAesParameters, null, [], function(constructor, prototype) {
    prototype.iv = null;
}, {iv: "forge.payload"}, {});
var EcRsa = function() {};
EcRsa = stjs.extend(EcRsa, null, [], function(constructor, prototype) {
    prototype.encrypt = function(pk, text) {};
    prototype.decrypt = function(ppk, text) {};
    prototype.sign = function(ppk, text) {};
    prototype.verify = function(pk, text, signature) {};
}, {}, {});
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
var EcPpk = function() {};
EcPpk = stjs.extend(EcPpk, null, [], function(constructor, prototype) {
    constructor.fromPem = function(pem) {
        var pk = new EcPpk();
        try {
            pk.ppk = forge.pki.privateKeyFromPem(pem);
        }catch (ex) {
            return null;
        }
        return pk;
    };
    constructor.generateKeyAsync = function(callback) {
        var o = new Object();
        (o)["workers"] = -1;
        forge.pki.rsa.generateKeyPair(o, function(err, keypair) {
            var ppk = new EcPpk();
            ppk.ppk = keypair.privateKey;
            callback(ppk);
        });
    };
    constructor.generateKey = function() {
        var o = new Object();
        (o)["workers"] = -1;
        var keypair = forge.pki.rsa.generateKeyPair(o, null);
        var ppk = new EcPpk();
        ppk.ppk = keypair.privateKey;
        return ppk;
    };
    prototype.ppk = null;
    prototype.equals = function(obj) {
        if (stjs.isInstanceOf(obj.constructor, EcPpk)) 
            return this.toPem().equals((obj).toPem());
        if (stjs.isInstanceOf(obj.constructor, EcPk)) 
            return this.toPk().toPem().equals((obj).toPem());
        return Object.prototype.equals.call(this, obj);
    };
    prototype.toPem = function() {
        return forge.pki.privateKeyToPem(this.ppk).replaceAll("\r?\n", "");
    };
    prototype.toPKCS8 = function() {
        return forge.pki.wrapRsaPrivateKey(forge.pki.privateKeyToAsn1(this.ppk));
    };
    prototype.toPk = function() {
        var pk = new EcPk();
        pk.pk = forge.pki.rsa.setPublicKey(this.ppk.n, this.ppk.e);
        return pk;
    };
    prototype.inArray = function(ppks) {
        for (var i = 0; i < ppks.length; i++) {
            if (ppks[i].equals(this)) 
                return true;
        }
        return false;
    };
}, {ppk: "forge.ppk"}, {});
var EcRsaOaepAsync = function() {};
EcRsaOaepAsync = stjs.extend(EcRsaOaepAsync, null, [], function(constructor, prototype) {
    constructor.rotator = 0;
    constructor.w = null;
    constructor.q1 = null;
    constructor.q2 = null;
    constructor.initWorker = function() {
        if ((typeof self).equals("undefined")) 
            return;
        if (!EcRemote.async) 
            return;
        if (EcRsaOaepAsync.w != null) 
            return;
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
            if (success != null) 
                success((o)["result"]);
        };
        wkr.onerror = function(p1) {
            var success = EcRsaOaepAsync.q1[index].shift();
            var failure = EcRsaOaepAsync.q2[index].shift();
            if (failure != null) 
                failure(p1.toString());
        };
    };
    constructor.encrypt = function(pk, text, success, failure) {
        EcRsaOaepAsync.initWorker();
        if (!EcRemote.async || EcRsaOaepAsync.w == null) {
            success(EcRsaOaep.encrypt(pk, text));
        } else {
            var worker = EcRsaOaepAsync.rotator++;
            EcRsaOaepAsync.rotator = EcRsaOaepAsync.rotator % 8;
            var o = new Object();
            (o)["pk"] = pk.toPem();
            (o)["text"] = text;
            (o)["cmd"] = "encryptRsaOaep";
            EcRsaOaepAsync.q1[worker].push(success);
            EcRsaOaepAsync.q2[worker].push(failure);
            EcRsaOaepAsync.w[worker].postMessage(o);
        }
    };
    constructor.decrypt = function(ppk, text, success, failure) {
        EcRsaOaepAsync.initWorker();
        if (!EcRemote.async || EcRsaOaepAsync.w == null) {
            success(EcRsaOaep.decrypt(ppk, text));
        } else {
            var worker = EcRsaOaepAsync.rotator++;
            EcRsaOaepAsync.rotator = EcRsaOaepAsync.rotator % 8;
            var o = new Object();
            (o)["ppk"] = ppk.toPem();
            (o)["text"] = text;
            (o)["cmd"] = "decryptRsaOaep";
            EcRsaOaepAsync.q1[worker].push(success);
            EcRsaOaepAsync.q2[worker].push(failure);
            EcRsaOaepAsync.w[worker].postMessage(o);
        }
    };
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
var EcAesCtr = function() {};
EcAesCtr = stjs.extend(EcAesCtr, null, [], function(constructor, prototype) {
    constructor.encrypt = function(text, secret, iv) {
        var c = forge.cipher.createCipher("AES-CTR", forge.util.decode64(secret));
        c.start(new EcAesParameters(iv));
        c.update(forge.util.createBuffer(text));
        c.finish();
        var encrypted = c.output;
        return forge.util.encode64(encrypted.bytes());
    };
    constructor.decrypt = function(text, secret, iv) {
        var c = forge.cipher.createDecipher("AES-CTR", forge.util.decode64(secret));
        c.start(new EcAesParameters(iv));
        c.update(forge.util.createBuffer(forge.util.decode64(text)));
        c.finish();
        var decrypted = c.output;
        return decrypted.data;
    };
}, {}, {});
var EcAesCtrAsync = function() {};
EcAesCtrAsync = stjs.extend(EcAesCtrAsync, null, [], function(constructor, prototype) {
    constructor.rotator = 0;
    constructor.w = null;
    constructor.q1 = null;
    constructor.q2 = null;
    constructor.initWorker = function() {
        if ((typeof self).equals("undefined")) 
            return;
        if (!EcRemote.async) 
            return;
        if (EcAesCtrAsync.w != null) 
            return;
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
            if (success != null) 
                success((o)["result"]);
        };
        wkr.onerror = function(p1) {
            var success = EcAesCtrAsync.q1[index].shift();
            var failure = EcAesCtrAsync.q2[index].shift();
            if (failure != null) 
                failure(p1.toString());
        };
    };
    constructor.encrypt = function(text, secret, iv, success, failure) {
        EcAesCtrAsync.initWorker();
        if (!EcRemote.async || EcAesCtrAsync.w == null) {
            success(EcAesCtr.encrypt(text, secret, iv));
        } else {
            var worker = EcAesCtrAsync.rotator++;
            EcAesCtrAsync.rotator = EcAesCtrAsync.rotator % 8;
            var o = new Object();
            (o)["secret"] = secret;
            (o)["iv"] = iv;
            (o)["text"] = text;
            (o)["cmd"] = "encryptAesCtr";
            EcAesCtrAsync.q1[worker].push(success);
            EcAesCtrAsync.q2[worker].push(failure);
            EcAesCtrAsync.w[worker].postMessage(o);
        }
    };
    constructor.decrypt = function(text, secret, iv, success, failure) {
        EcAesCtrAsync.initWorker();
        if (!EcRemote.async || EcAesCtrAsync.w == null) {
            success(EcAesCtr.decrypt(text, secret, iv));
        } else {
            var worker = EcAesCtrAsync.rotator++;
            EcAesCtrAsync.rotator = EcAesCtrAsync.rotator % 8;
            var o = new Object();
            (o)["secret"] = secret;
            (o)["iv"] = iv;
            (o)["text"] = text;
            (o)["cmd"] = "decryptAesCtr";
            EcAesCtrAsync.q1[worker].push(success);
            EcAesCtrAsync.q2[worker].push(failure);
            EcAesCtrAsync.w[worker].postMessage(o);
        }
    };
}, {w: {name: "Array", arguments: [{name: "Worker", arguments: ["Object"]}]}, q1: {name: "Array", arguments: [{name: "Array", arguments: ["Callback1"]}]}, q2: {name: "Array", arguments: [{name: "Array", arguments: ["Callback1"]}]}}, {});
