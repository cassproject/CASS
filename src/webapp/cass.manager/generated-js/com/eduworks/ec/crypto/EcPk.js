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
