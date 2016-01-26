/**
 *  Component of EbacEncryptedValue that contains data needed to decrypt
 *  encrypted payload. Is, in itself, encrypted.
 *  
 *  Also contains data used to verify that encrypted-data substitution attacks
 *  were not performed on the data.
 *  
 *  Must be encryptable by RSA, therefore, serialized form is less than 256
 *  bytes.
 *  
 *  @author fritz.ray@eduworks.com
 */
var EbacEncryptedSecret = function() {
    EcLinkedData.call(this, Ebac.schema, "http://schema.eduworks.com/ebac/0.1/encryptedSecret");
};
EbacEncryptedSecret = stjs.extend(EbacEncryptedSecret, EcLinkedData, [], function(constructor, prototype) {
    /**
     *  IV used to encrypt/decrypt payload.
     */
    prototype.iv = null;
    /**
     *  Hashed and Base64 encoded ID of the parent (if any) object.
     */
    prototype.id = null;
    /**
     *  Secret used to encrypt/decrypt payload.
     */
    prototype.secret = null;
    /**
     *  Dot and Bracket notated index of the field in the parent-most object (if
     *  any).
     */
    prototype.field = null;
    prototype.toEncryptableJson = function() {
        var o = (new Object());
        o["v"] = this.iv;
        if (this.id != null) 
            o["d"] = this.id;
        o["s"] = this.secret;
        if (this.field != null) 
            o["f"] = this.field;
        return JSON.stringify(o);
    };
    constructor.fromEncryptableJson = function(obj) {
        var secret = new EbacEncryptedSecret();
        var o = (obj);
        secret.iv = o["v"];
        if (o["d"] != null) 
            secret.id = o["d"];
        secret.secret = o["s"];
        if (o["f"] != null) 
            secret.field = o["f"];
        return secret;
    };
}, {atProperties: {name: "Array", arguments: [null]}}, {});
