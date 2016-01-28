/**
 *  Encrypted JSON-LD object.
 *  
 *  @author fritz.ray@eduworks.com
 */
var EbacEncryptedValue = function() {
    EcRemoteLinkedData.call(this, Ebac.schema, EbacEncryptedValue.type);
};
EbacEncryptedValue = stjs.extend(EbacEncryptedValue, EcRemoteLinkedData, [], function(constructor, prototype) {
    constructor.type = "http://schema.eduworks.com/ebac/0.1/encryptedValue";
    /**
     *  Optional Hint used to aid search, showing the type of the inner encrypted
     *  object.
     */
    prototype.encryptedType = null;
    /**
     *  Base-64 encoded, AES encrypted form of the encrypted object (or data).
     */
    prototype.payload = null;
    /**
     *  Optional Hint used to aid view, showing a name of the inner encrypted
     *  object.
     */
    prototype.name = null;
    /**
     *  Array of EbacEncryptedSecret objects encoded in Base-64, encrypted using
     *  RSA public keys of owners or readers (or unknown parties) to allow them
     *  access to the payload.
     */
    prototype.secret = null;
}, {secret: {name: "Array", arguments: [null]}, owner: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
