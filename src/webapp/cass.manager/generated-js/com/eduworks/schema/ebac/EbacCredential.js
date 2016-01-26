/**
 *  AES encrypted public key and display name. Contains Initialization Vectors,
 *  but not secrets. Used to encrypt private identities for storage on remote
 *  systems.
 *  
 *  @author fritz.ray@eduworks.com
 */
var EbacCredential = function() {
    EcLinkedData.call(this, Ebac.schema, "http://schema.eduworks.com/ebac/0.1/credential");
};
EbacCredential = stjs.extend(EbacCredential, EcLinkedData, [], function(constructor, prototype) {
    /**
     *  AES Initialization Vector used to decode PPK.
     */
    prototype.iv = null;
    /**
     *  AES encrypted Private Key in PEM form.
     */
    prototype.ppk = null;
    /**
     *  AES Initialization Vector used to decode displayName.
     */
    prototype.displayNameIv = null;
    /**
     *  AES encrypted display name for identity.
     */
    prototype.displayName = null;
}, {atProperties: {name: "Array", arguments: [null]}}, {});
