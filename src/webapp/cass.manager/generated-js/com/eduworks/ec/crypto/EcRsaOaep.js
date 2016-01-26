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
