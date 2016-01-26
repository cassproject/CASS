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
        pk.pk = forge.pki.publicKeyFromPem(pem);
        return pk;
    };
    prototype.pk = null;
    prototype.equals = function(obj) {
        if (stjs.isInstanceOf(obj.constructor, EcPk)) 
            return this.toPem().equals((obj).toPem());
        return Object.prototype.equals.call(this, obj);
    };
    prototype.toPem = function() {
        return forge.pki.publicKeyToPem(this.pk);
    };
    prototype.verify = function(bytes, decode64) {
        return null;
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
    constructor.verify = function(pk, text, signature) {
        var s = forge.md.sha1.create();
        s.update(text, "utf8");
        return pk.verify(s.digest().bytes(), forge.util.decode64(signature));
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
        pk.ppk = forge.pki.privateKeyFromPem(pem);
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
    prototype.ppk = null;
    prototype.equals = function(obj) {
        if (stjs.isInstanceOf(obj.constructor, EcPpk)) 
            return this.toPem().equals((obj).toPem());
        return Object.prototype.equals.call(this, obj);
    };
    prototype.toPem = function() {
        return forge.pki.privateKeyToPem(this.ppk);
    };
    prototype.toPk = function() {
        var pk = new EcPk();
        pk.pk = forge.pki.rsa.setPublicKey(this.ppk.n, this.ppk.e);
        return pk;
    };
}, {ppk: "forge.ppk"}, {});
