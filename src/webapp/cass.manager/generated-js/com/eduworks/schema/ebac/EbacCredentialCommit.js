/**
 *  Message used to commit credentials to a remote login server.
 *  
 *  TODO: Semi-vulnerable to replay attacks. Token field prevents some replay
 *  attacks.
 *  
 *  @author fritz.ray@eduworks.com
 */
var EbacCredentialCommit = function() {
    EcLinkedData.call(this, Ebac.schema, "http://schema.eduworks.com/ebac/0.1/credentialCommit");
    this.credentials = new EbacCredentials();
};
EbacCredentialCommit = stjs.extend(EbacCredentialCommit, EcLinkedData, [], function(constructor, prototype) {
    /**
     *  Hashed username.
     */
    prototype.username = null;
    /**
     *  Hashed password to authorize commit.
     */
    prototype.password = null;
    /**
     *  Token provided to client when previously executed Request was done. May
     *  be empty if this is used as part of Create action.
     */
    prototype.token = null;
    /**
     *  List of credentials to commit to the login server storage.
     */
    prototype.credentials = null;
}, {credentials: "EbacCredentials", atProperties: {name: "Array", arguments: [null]}}, {});
