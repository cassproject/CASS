/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
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
}, {ppk: "forge.ppk"}, {});
