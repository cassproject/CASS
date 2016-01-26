/**
 *  Credential list along with one time pad and session-based token for use in
 *  commit actions.
 *  
 *  @author fritz.ray@eduworks.com
 */
var EbacCredentials = function() {
    EcLinkedData.call(this, Ebac.schema, "http://schema.eduworks.com/ebac/0.1/credentials");
};
EbacCredentials = stjs.extend(EbacCredentials, EcLinkedData, [], function(constructor, prototype) {
    /**
     *  One time pad (aka perfect cipher)
     */
    prototype.pad = null;
    /**
     *  Token provided by server to use in commit actions.
     */
    prototype.token = null;
    /**
     *  Credential array.
     */
    prototype.credentials = null;
}, {credentials: {name: "Array", arguments: ["EbacCredential"]}, atProperties: {name: "Array", arguments: [null]}}, {});
