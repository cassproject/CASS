/**
 *  Message used to retrieve credentials from a remote system.
 *  
 *  TODO: Vulnerable to replay attacks.
 *  
 *  @author fritz.ray@eduworks.com
 */
var EbacCredentialRequest = function() {
    EcLinkedData.call(this, Ebac.schema, "http://schema.eduworks.com/ebac/0.1/credentialRequest");
};
EbacCredentialRequest = stjs.extend(EbacCredentialRequest, EcLinkedData, [], function(constructor, prototype) {
    /**
     *  Hashed username.
     */
    prototype.username = null;
    /**
     *  Hashed password to authorize request.
     */
    prototype.password = null;
}, {atProperties: {name: "Array", arguments: [null]}}, {});
