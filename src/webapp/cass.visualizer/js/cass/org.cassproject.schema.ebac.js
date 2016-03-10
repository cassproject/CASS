var Ebac = function() {};
Ebac = stjs.extend(Ebac, null, [], function(constructor, prototype) {
    constructor.schema = "http://schema.eduworks.com/ebac/0.1/";
}, {}, {});
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
/**
 *  Signature used to authorize movement of data on behalf of a private-key
 *  holding owner.
 *  
 *  @author fritz.ray@eduworks.com
 */
var EbacSignature = function() {
    EcLinkedData.call(this, Ebac.schema, "http://schema.eduworks.com/ebac/0.1/timeLimitedSignature");
};
EbacSignature = stjs.extend(EbacSignature, EcLinkedData, [], function(constructor, prototype) {
    /**
     *  The public key of the authorizing party.
     */
    prototype.owner = null;
    /**
     *  The time in number of milliseconds since midnight of January 1, 1970
     *  00:00:00 UTC that this signature is authorized to move data.
     */
    prototype.expiry = 0.0;
    /**
     *  The signature of this object, having signed the object, having been
     *  encoded in JSON with no space or tabs in ASCII sort order, having no
     *  value for the signature at the time of signing.
     */
    prototype.signature = null;
    /**
     *  The server authorized to move data. If this is empty, the signature may
     *  be used by a server to ask for data from other servers.
     */
    prototype.server = null;
}, {atProperties: {name: "Array", arguments: [null]}}, {});
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
