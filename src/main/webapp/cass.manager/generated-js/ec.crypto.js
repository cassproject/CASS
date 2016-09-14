var EcAesParameters = function(iv) {
    this.iv = forge.util.decode64(iv);
};
EcAesParameters = stjs.extend(EcAesParameters, null, [], function(constructor, prototype) {
    prototype.iv = null;
}, {iv: "forge.payload"}, {});
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
    prototype.verify = function(bytes, decode64) {
        return this.pk.verify(bytes, decode64);
    };
}, {pk: "forge.pk"}, {});
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
var EcRsa = function() {};
EcRsa = stjs.extend(EcRsa, null, [], function(constructor, prototype) {
    prototype.encrypt = function(pk, text) {};
    prototype.decrypt = function(ppk, text) {};
    prototype.sign = function(ppk, text) {};
    prototype.verify = function(pk, text, signature) {};
}, {}, {});
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
        EcRsaOaepAsync.q1 = new Array();
        EcRsaOaepAsync.q2 = new Array();
        EcRsaOaepAsync.w = new Worker((window)["scriptPath"] + "forgeAsync.js");
        EcRsaOaepAsync.w.onmessage = function(p1) {
            var o = p1.data;
            var success = EcRsaOaepAsync.q1.shift();
            var failure = EcRsaOaepAsync.q2.shift();
            if (success != null) 
                success((o)["result"]);
        };
        EcRsaOaepAsync.w.onerror = function(p1) {
            var success = EcRsaOaepAsync.q1.shift();
            var failure = EcRsaOaepAsync.q2.shift();
            if (failure != null) 
                failure(p1.toString());
        };
    };
    constructor.encrypt = function(pk, text, success, failure) {
        EcRsaOaepAsync.initWorker();
        if (!EcRemote.async || EcRsaOaepAsync.w == null) {
            success(EcRsaOaep.encrypt(pk, text));
        } else {
            var o = new Object();
            (o)["pk"] = pk.toPem();
            (o)["text"] = text;
            (o)["cmd"] = "encryptRsaOaep";
            EcRsaOaepAsync.q1.push(success);
            EcRsaOaepAsync.q2.push(failure);
            EcRsaOaepAsync.w.postMessage(o);
        }
    };
    constructor.decrypt = function(ppk, text, success, failure) {
        EcRsaOaepAsync.initWorker();
        if (!EcRemote.async || EcRsaOaepAsync.w == null) {
            success(EcRsaOaep.decrypt(ppk, text));
        } else {
            var o = new Object();
            (o)["ppk"] = ppk.toPem();
            (o)["text"] = text;
            (o)["cmd"] = "decryptRsaOaep";
            EcRsaOaepAsync.q1.push(success);
            EcRsaOaepAsync.q2.push(failure);
            EcRsaOaepAsync.w.postMessage(o);
        }
    };
    constructor.sign = function(ppk, text, success, failure) {
        EcRsaOaepAsync.initWorker();
        if (!EcRemote.async || EcRsaOaepAsync.w == null) {
            success(EcRsaOaep.sign(ppk, text));
        } else {
            var o = new Object();
            (o)["ppk"] = ppk.toPem();
            (o)["text"] = text;
            (o)["cmd"] = "signRsaOaep";
            EcRsaOaepAsync.q1.push(success);
            EcRsaOaepAsync.q2.push(failure);
            EcRsaOaepAsync.w.postMessage(o);
        }
    };
    constructor.signSha256 = function(ppk, text, success, failure) {
        EcRsaOaepAsync.initWorker();
        if (!EcRemote.async || EcRsaOaepAsync.w == null) {
            success(EcRsaOaep.signSha256(ppk, text));
        } else {
            var o = new Object();
            (o)["ppk"] = ppk.toPem();
            (o)["text"] = text;
            (o)["cmd"] = "signSha256RsaOaep";
            EcRsaOaepAsync.q1.push(success);
            EcRsaOaepAsync.q2.push(failure);
            EcRsaOaepAsync.w.postMessage(o);
        }
    };
    constructor.verify = function(pk, text, signature, success, failure) {
        EcRsaOaepAsync.initWorker();
        if (!EcRemote.async || EcRsaOaepAsync.w == null) {
            success(EcRsaOaep.verify(pk, text, signature));
        } else {
            var o = new Object();
            (o)["pk"] = pk.toPem();
            (o)["text"] = text;
            (o)["signature"] = signature;
            (o)["cmd"] = "verifyRsaOaep";
            EcRsaOaepAsync.q1.push(success);
            EcRsaOaepAsync.q2.push(failure);
            EcRsaOaepAsync.w.postMessage(o);
        }
    };
}, {w: {name: "Worker", arguments: ["Object"]}, q1: {name: "Array", arguments: ["Callback1"]}, q2: {name: "Array", arguments: ["Callback1"]}}, {});
var EcAesCtrAsync = function() {};
EcAesCtrAsync = stjs.extend(EcAesCtrAsync, null, [], function(constructor, prototype) {
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
        EcAesCtrAsync.q1 = new Array();
        EcAesCtrAsync.q2 = new Array();
        EcAesCtrAsync.w = new Worker((window)["scriptPath"] + "forgeAsync.js");
        EcAesCtrAsync.w.onmessage = function(p1) {
            var o = p1.data;
            var success = EcAesCtrAsync.q1.shift();
            var failure = EcAesCtrAsync.q2.shift();
            if (success != null) 
                success((o)["result"]);
        };
        EcAesCtrAsync.w.onerror = function(p1) {
            var success = EcAesCtrAsync.q1.shift();
            var failure = EcAesCtrAsync.q2.shift();
            if (failure != null) 
                failure(p1.toString());
        };
    };
    constructor.encrypt = function(text, secret, iv, success, failure) {
        EcAesCtrAsync.initWorker();
        if (!EcRemote.async || EcAesCtrAsync.w == null) {
            success(EcAesCtr.encrypt(text, secret, iv));
        } else {
            var o = new Object();
            (o)["secret"] = secret;
            (o)["iv"] = iv;
            (o)["text"] = text;
            (o)["cmd"] = "encryptAesCtr";
            EcAesCtrAsync.q1.push(success);
            EcAesCtrAsync.q2.push(failure);
            EcAesCtrAsync.w.postMessage(o);
        }
    };
    constructor.decrypt = function(text, secret, iv, success, failure) {
        EcAesCtrAsync.initWorker();
        if (!EcRemote.async || EcAesCtrAsync.w == null) {
            success(EcAesCtr.decrypt(text, secret, iv));
        } else {
            var o = new Object();
            (o)["secret"] = secret;
            (o)["iv"] = iv;
            (o)["text"] = text;
            (o)["cmd"] = "decryptAesCtr";
            EcAesCtrAsync.q1.push(success);
            EcAesCtrAsync.q2.push(failure);
            EcAesCtrAsync.w.postMessage(o);
        }
    };
}, {w: {name: "Worker", arguments: ["Object"]}, q1: {name: "Array", arguments: ["Callback1"]}, q2: {name: "Array", arguments: ["Callback1"]}}, {});
