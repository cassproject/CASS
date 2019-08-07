/**
 *  Encrypted JSON-LD object or string.
 * 
 *  @author fritz.ray@eduworks.com
 *  @class EbacEncryptedValue
 *  @module org.cassproject
 */
var EbacEncryptedValue = function() {
    EcRemoteLinkedData.call(this, Ebac.context, EbacEncryptedValue.myType);
};
EbacEncryptedValue = stjs.extend(EbacEncryptedValue, EcRemoteLinkedData, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/ebac/0.1/encryptedValue";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/ebac/0.2/encryptedValue";
    constructor.TYPE_0_3 = "http://schema.cassproject.org/kbac/0.2/EncryptedValue";
    constructor.TYPE_0_4 = "https://schema.cassproject.org/kbac/0.4/EncryptedValue";
    constructor.myType = EbacEncryptedValue.TYPE_0_4;
    /**
     *  Optional Hint used to aid in search.
     *  Displays the type of the encrypted object.
     * 
     *  @property encryptedType
     *  @type string
     */
    prototype.encryptedType = null;
    /**
     *  Base-64 encoded, AES encrypted form of the encrypted object (or string).
     * 
     *  @property payload
     *  @type string
     */
    prototype.payload = null;
    /**
     *  Optional Hint used to aid in search and display.
     *  Name of the inner encrypted object.
     * 
     *  @property name
     *  @type string
     */
    prototype.name = null;
    /**
     *  Array of EbacEncryptedSecret objects encoded in Base-64, encrypted using
     *  RSA public keys of owners, readers, or other parties to allow them
     *  access to the payload.
     * 
     *  @property secret
     *  @type string[]
     */
    prototype.secret = null;
    prototype.copyFrom = function(that) {
        var me = (this);
        for (var key in me) 
            delete me[key];
        var you = (that);
        for (var key in you) {
            if (me[key] == null) 
                me[key.replace("@", "")] = you[key];
        }
        if (!this.isAny(this.getTypes())) 
             throw new RuntimeException("Incompatible type: " + this.getFullType());
    };
    prototype.upgrade = function() {
        EcLinkedData.prototype.upgrade.call(this);
        if (EbacEncryptedValue.TYPE_0_1 == this.type) {
            var me = (this);
            if (me["@context"] == null && me["@schema"] != null) 
                me["@context"] = me["@schema"];
            this.setContextAndType(Ebac.context_0_2, EbacEncryptedValue.TYPE_0_2);
        }
        if (EbacEncryptedValue.TYPE_0_2 == this.getFullType()) {
            this.setContextAndType(Ebac.context_0_3, EbacEncryptedValue.TYPE_0_3);
        }
        if (EbacEncryptedValue.TYPE_0_3 == this.getFullType()) {
            this.setContextAndType(Ebac.context_0_4, EbacEncryptedValue.TYPE_0_4);
        }
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(EbacEncryptedValue.TYPE_0_4);
        a.push(EbacEncryptedValue.TYPE_0_3);
        a.push(EbacEncryptedValue.TYPE_0_2);
        a.push(EbacEncryptedValue.TYPE_0_1);
        return a;
    };
}, {secret: {name: "Array", arguments: [null]}, owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  AES encrypted public key and display name. Contains Initialization Vectors,
 *  but not secrets. Used to encrypt public identities for storage on remote
 *  systems.
 * 
 *  @author fritz.ray@eduworks.com
 *  @class EbacContact
 *  @module org.cassproject
 */
var EbacContact = function() {
    EcLinkedData.call(this, Ebac.context, EbacContact.TYPE_0_4);
};
EbacContact = stjs.extend(EbacContact, EcLinkedData, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/ebac/0.2/contact";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/ebac/0.2/contact";
    constructor.TYPE_0_3 = "http://schema.cassproject.org/kbac/0.2/Contact";
    constructor.TYPE_0_4 = "https://schema.cassproject.org/kbac/0.4/Contact";
    /**
     *  AES Initialization Vector used to decode PPK. Base64 encoded.
     * 
     *  @property iv
     *  @type string
     */
    prototype.iv = null;
    /**
     *  AES encrypted Private Key in PEM format.
     * 
     *  @property pk
     *  @type string
     */
    prototype.pk = null;
    /**
     *  AES Initialization Vector used to decode displayName. Base64 encoded.
     * 
     *  @property displayNameIv
     *  @type string
     */
    prototype.displayNameIv = null;
    /**
     *  AES encrypted display name for identity.
     * 
     *  @property displayName
     *  @type string
     */
    prototype.displayName = null;
    /**
     *  AES Initialization Vector of the home server of the contact. Base64 encoded.
     * 
     *  @property sourceIv
     *  @type string
     */
    prototype.sourceIv = null;
    /**
     *  URL to the home server of the contact.
     * 
     *  @property source
     *  @type string
     */
    prototype.source = null;
    prototype.upgrade = function() {
        EcLinkedData.prototype.upgrade.call(this);
        if (EbacContact.TYPE_0_1.equals(this.type)) {
            var me = (this);
            if (me["@context"] == null && me["@schema"] != null) 
                me["@context"] = me["@schema"];
            this.setContextAndType(Ebac.context_0_2, EbacContact.TYPE_0_2);
        }
        if (EbacContact.TYPE_0_2.equals(this.getFullType())) {
            this.setContextAndType(Ebac.context_0_3, EbacContact.TYPE_0_3);
        }
        if (EbacContact.TYPE_0_3.equals(this.getFullType())) {
            this.setContextAndType(Ebac.context_0_4, EbacContact.TYPE_0_4);
        }
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(EbacContact.TYPE_0_4);
        a.push(EbacContact.TYPE_0_3);
        a.push(EbacContact.TYPE_0_2);
        a.push(EbacContact.TYPE_0_1);
        return a;
    };
}, {atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  Component of EbacEncryptedValue that contains data needed to decrypt
 *  encrypted payload. Is, itself, encrypted.
 *  <p>
 *  Also contains data used to verify that encrypted-data substitution attacks
 *  were not performed on the data.
 *  <p>
 *  Must be encryptable by RSA-2048, therefore, serialized form must less than 256
 *  bytes.
 * 
 *  @author fritz.ray@eduworks.com
 *  @class EbacEncryptedSecret
 *  @module org.cassproject
 */
var EbacEncryptedSecret = function() {
    EcLinkedData.call(this, Ebac.context, EbacEncryptedSecret.TYPE_0_4);
};
EbacEncryptedSecret = stjs.extend(EbacEncryptedSecret, EcLinkedData, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/ebac/0.1/encryptedSecret";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/ebac/0.2/encryptedSecret";
    constructor.TYPE_0_3 = "http://schema.cassproject.org/kbac/0.2/EncryptedSecret";
    constructor.TYPE_0_4 = "https://schema.cassproject.org/kbac/0.4/EncryptedSecret";
    /**
     *  IV used to encrypt/decrypt payload. Base64 encoded.
     * 
     *  @property iv
     *  @type string
     */
    prototype.iv = null;
    /**
     *  Hashed and Base64 encoded ID of the parent (if any) object.
     *  Used to verify the data has not been copied from elsewhere.
     * 
     *  @property id
     *  @type string
     */
    prototype.id = null;
    /**
     *  Secret used to encrypt/decrypt payload.
     * 
     *  @property secret
     *  @type string
     */
    prototype.secret = null;
    /**
     *  Dot and Bracket notated index of the field in the parent-most object (if
     *  any). Used to verify the field has not been copied from elsewhere.
     * 
     *  @property field
     *  @type string
     */
    prototype.field = null;
    /**
     *  Deserializes the field from a compact form used in RSA encryption.
     * 
     *  @param {JSONObject} obj Object to deserialize from.
     *  @return {EbacEncryptedSecret} Secret in object form.
     *  @method fromEncryptableJson
     *  @static
     */
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
    /**
     *  Serializes the field into a compact form for RSA encryption.
     * 
     *  @return {string} string
     *  @method toEncryptableJson
     */
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
    prototype.upgrade = function() {
        EcLinkedData.prototype.upgrade.call(this);
        if (EbacEncryptedSecret.TYPE_0_1.equals(this.type)) {
            var me = (this);
            if (me["@context"] == null && me["@schema"] != null) 
                me["@context"] = me["@schema"];
            this.setContextAndType(Ebac.context_0_2, EbacEncryptedSecret.TYPE_0_2);
        }
        if (EbacEncryptedSecret.TYPE_0_2.equals(this.getFullType())) {
            this.setContextAndType(Ebac.context_0_3, EbacEncryptedSecret.TYPE_0_3);
        }
        if (EbacEncryptedSecret.TYPE_0_3.equals(this.getFullType())) {
            this.setContextAndType(Ebac.context_0_4, EbacEncryptedSecret.TYPE_0_4);
        }
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(EbacEncryptedSecret.TYPE_0_4);
        a.push(EbacEncryptedSecret.TYPE_0_3);
        a.push(EbacEncryptedSecret.TYPE_0_2);
        a.push(EbacEncryptedSecret.TYPE_0_1);
        return a;
    };
}, {atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  Signature used to authorize movement of data on behalf of a private-key
 *  holding owner.
 * 
 *  @author fritz.ray@eduworks.com
 *  @class EbacSignature
 *  @module org.cassproject
 */
var EbacSignature = function() {
    EcLinkedData.call(this, Ebac.context, EbacSignature.TYPE_0_4);
};
EbacSignature = stjs.extend(EbacSignature, EcLinkedData, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/ebac/0.1/timeLimitedSignature";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/ebac/0.2/timeLimitedSignature";
    constructor.TYPE_0_3 = "http://schema.cassproject.org/kbac/0.2/TimeLimitedSignature";
    constructor.TYPE_0_4 = "https://schema.cassproject.org/kbac/0.4/TimeLimitedSignature";
    /**
     *  The public key of the authorizing party in PEM format.
     * 
     *  @property owner
     *  @type string
     */
    prototype.owner = null;
    /**
     *  The time in number of milliseconds since midnight of January 1, 1970
     *  00:00:00 UTC that this signature is authorized to move data.
     * 
     *  @property expiry
     *  @type long
     */
    prototype.expiry = null;
    /**
     *  The signature of this object, having signed the object, having been
     *  encoded in JSON with no space or tabs in ASCII sort order, having no
     *  value for the signature at the time of signing.
     * 
     *  @property signature
     *  @type string
     */
    prototype.signature = null;
    /**
     *  The server authorized to move data. If this is empty, the signature may
     *  be used by a server to ask for data from other servers.
     * 
     *  @property server
     *  @type string
     */
    prototype.server = null;
    prototype.upgrade = function() {
        EcLinkedData.prototype.upgrade.call(this);
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(EbacSignature.TYPE_0_4);
        a.push(EbacSignature.TYPE_0_3);
        a.push(EbacSignature.TYPE_0_2);
        a.push(EbacSignature.TYPE_0_1);
        return a;
    };
}, {atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  AES encrypted private key and display name. Contains Initialization Vectors,
 *  but not secrets. Used to encrypt private identities for storage on remote
 *  systems.
 * 
 *  @author fritz.ray@eduworks.com
 *  @class EbacCredential
 *  @module org.cassproject
 */
var EbacCredential = function() {
    EcLinkedData.call(this, Ebac.context, EbacCredential.TYPE_0_4);
};
EbacCredential = stjs.extend(EbacCredential, EcLinkedData, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/ebac/0.1/credential";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/ebac/0.2/credential";
    constructor.TYPE_0_3 = "http://schema.cassproject.org/kbac/0.2/Credential";
    constructor.TYPE_0_4 = "https://schema.cassproject.org/kbac/0.4/Credential";
    /**
     *  AES Initialization Vector used to decode PPK. Base64 encoded.
     * 
     *  @property iv
     *  @type string
     */
    prototype.iv = null;
    /**
     *  AES encrypted Private Key in PEM form.
     * 
     *  @property ppk
     *  @type string
     */
    prototype.ppk = null;
    /**
     *  AES Initialization Vector used to decode displayName. Base64 encoded.
     * 
     *  @property displayNameIv
     *  @type string
     */
    prototype.displayNameIv = null;
    /**
     *  AES encrypted display name for identity.
     * 
     *  @property displayName
     *  @type string
     */
    prototype.displayName = null;
    prototype.upgrade = function() {
        EcLinkedData.prototype.upgrade.call(this);
        if (EbacCredential.TYPE_0_1.equals(this.type)) {
            var me = (this);
            if (me["@context"] == null && me["@schema"] != null) 
                me["@context"] = me["@schema"];
            this.setContextAndType(Ebac.context_0_2, EbacCredential.TYPE_0_2);
        }
        if (EbacCredential.TYPE_0_2.equals(this.getFullType())) {
            this.setContextAndType(Ebac.context_0_3, EbacCredential.TYPE_0_3);
        }
        if (EbacCredential.TYPE_0_3.equals(this.getFullType())) {
            this.setContextAndType(Ebac.context_0_4, EbacCredential.TYPE_0_4);
        }
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(EbacCredential.TYPE_0_4);
        a.push(EbacCredential.TYPE_0_3);
        a.push(EbacCredential.TYPE_0_2);
        a.push(EbacCredential.TYPE_0_1);
        return a;
    };
}, {atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  Message used to retrieve credentials from a remote system.
 *  <p>
 *  TODO: Vulnerable to replay attacks.
 * 
 *  @author fritz.ray@eduworks.com
 *  @class EbacCredentialRequest
 *  @module org.cassproject
 */
var EbacCredentialRequest = function() {
    EcLinkedData.call(this, Ebac.context, EbacCredentialRequest.TYPE_0_4);
};
EbacCredentialRequest = stjs.extend(EbacCredentialRequest, EcLinkedData, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/ebac/0.1/credentialRequest";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/ebac/0.2/credentialRequest";
    constructor.TYPE_0_3 = "http://schema.cassproject.org/kbac/0.2/CredentialRequest";
    constructor.TYPE_0_4 = "https://schema.cassproject.org/kbac/0.4/CredentialRequest";
    /**
     *  Hashed username.
     * 
     *  @property username
     *  @type string
     */
    prototype.username = null;
    /**
     *  Hashed password to authorize request.
     * 
     *  @property password
     *  @type string
     */
    prototype.password = null;
    prototype.upgrade = function() {
        EcLinkedData.prototype.upgrade.call(this);
        if (EbacCredentialRequest.TYPE_0_1 == this.type) {
            var me = (this);
            if (me["@context"] == null && me["@schema"] != null) 
                me["@context"] = me["@schema"];
            this.setContextAndType(Ebac.context_0_2, EbacCredentialRequest.TYPE_0_2);
        }
        if (EbacCredentialRequest.TYPE_0_2 == this.getFullType()) {
            this.setContextAndType(Ebac.context_0_3, EbacCredentialRequest.TYPE_0_3);
        }
        if (EbacCredentialRequest.TYPE_0_3 == this.getFullType()) {
            this.setContextAndType(Ebac.context_0_4, EbacCredentialRequest.TYPE_0_4);
        }
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(EbacCredentialRequest.TYPE_0_4);
        a.push(EbacCredentialRequest.TYPE_0_3);
        a.push(EbacCredentialRequest.TYPE_0_2);
        a.push(EbacCredentialRequest.TYPE_0_1);
        return a;
    };
}, {atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  AES encrypted public key and display name message.
 *  Used to grant access to a contact.
 *  Contains Initialization Vectors, but not secrets.
 *  Used to encrypt public identities for storage on remote systems.
 * 
 *  @author fritz.ray@eduworks.com
 *  @class EbacContactGrant
 *  @module org.cassproject
 */
var EbacContactGrant = function() {
    EcRemoteLinkedData.call(this, Ebac.context, EbacContactGrant.TYPE_0_4);
};
EbacContactGrant = stjs.extend(EbacContactGrant, EcRemoteLinkedData, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/ebac/0.1/contactGrant";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/ebac/0.2/contactGrant";
    constructor.TYPE_0_3 = "http://schema.cassproject.org/kbac/0.2/ContactGrant";
    constructor.TYPE_0_4 = "https://schema.cassproject.org/kbac/0.4/ContactGrant";
    /**
     *  Public key being granted to the owner of this message.
     * 
     *  @property pk
     *  @type string(pem)
     */
    prototype.pk = null;
    /**
     *  Display name of the contact.
     * 
     *  @property displayName
     *  @type string
     */
    prototype.displayName = null;
    /**
     *  Source server of the contact.
     * 
     *  @property source
     *  @type string
     */
    prototype.source = null;
    /**
     *  Response token used to validate that this grant is in response to a contact request you sent.
     * 
     *  @property responseToken
     *  @type string
     */
    prototype.responseToken = null;
    /**
     *  Signature (Base64 encoded) of the response token to verify against your own public key
     *  to ensure that this grant is in response to a contact request you sent.
     * 
     *  @property responseSignature
     *  @type string
     */
    prototype.responseSignature = null;
    prototype.upgrade = function() {
        EcLinkedData.prototype.upgrade.call(this);
        if (EbacContactGrant.TYPE_0_1.equals(this.type)) {
            var me = (this);
            if (me["@context"] == null && me["@schema"] != null) 
                me["@context"] = me["@schema"];
            this.setContextAndType(Ebac.context_0_2, EbacContactGrant.TYPE_0_2);
        }
        if (EbacContactGrant.TYPE_0_2.equals(this.getFullType())) {
            this.setContextAndType(Ebac.context_0_3, EbacContactGrant.TYPE_0_3);
        }
        if (EbacContactGrant.TYPE_0_3.equals(this.getFullType())) {
            this.setContextAndType(Ebac.context_0_4, EbacContactGrant.TYPE_0_4);
        }
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(EbacContactGrant.TYPE_0_4);
        a.push(EbacContactGrant.TYPE_0_3);
        a.push(EbacContactGrant.TYPE_0_2);
        a.push(EbacContactGrant.TYPE_0_1);
        return a;
    };
}, {owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  Credential list along with one time pad and session-based token for use in
 *  commit actions.
 * 
 *  @author fritz.ray@eduworks.com
 *  @class EbacCredentials
 *  @module org.cassproject
 */
var EbacCredentials = function() {
    EcLinkedData.call(this, Ebac.context, EbacCredentials.TYPE_0_4);
};
EbacCredentials = stjs.extend(EbacCredentials, EcLinkedData, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/ebac/0.1/credentials";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/ebac/0.2/credentials";
    constructor.TYPE_0_3 = "http://schema.cassproject.org/kbac/0.2/Credentials";
    constructor.TYPE_0_4 = "https://schema.cassproject.org/kbac/0.4/Credentials";
    /**
     *  One time pad that may be used in password recovery. Base64 encoded.
     * 
     *  @property pad
     *  @type string
     */
    prototype.pad = null;
    /**
     *  Token provided by server to use in commit actions.
     * 
     *  @property token
     *  @type string
     */
    prototype.token = null;
    /**
     *  Credential array.
     * 
     *  @property credentials
     *  @type EbacCredential[]
     */
    prototype.credentials = null;
    /**
     *  Contact array.
     * 
     *  @property contacts
     *  @type EbacContact[]
     */
    prototype.contacts = null;
    prototype.upgrade = function() {
        EcLinkedData.prototype.upgrade.call(this);
        if (EbacCredentials.TYPE_0_1.equals(this.type)) {
            var me = (this);
            if (me["@context"] == null && me["@schema"] != null) 
                me["@context"] = me["@schema"];
            this.setContextAndType(Ebac.context_0_2, EbacCredentials.TYPE_0_2);
        }
        if (EbacCredentials.TYPE_0_2.equals(this.getFullType())) {
            this.setContextAndType(Ebac.context_0_3, EbacCredentials.TYPE_0_3);
        }
        if (EbacCredentials.TYPE_0_3.equals(this.getFullType())) {
            this.setContextAndType(Ebac.context_0_4, EbacCredentials.TYPE_0_4);
        }
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(EbacCredentials.TYPE_0_4);
        a.push(EbacCredentials.TYPE_0_3);
        a.push(EbacCredentials.TYPE_0_2);
        a.push(EbacCredentials.TYPE_0_1);
        return a;
    };
}, {credentials: {name: "Array", arguments: ["EbacCredential"]}, contacts: {name: "Array", arguments: ["EbacContact"]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  Message used to commit credentials to a remote login server.
 *  <p>
 *  TODO: Vulnerable to replay attacks. Token field prevents some replay
 *  attacks.
 * 
 *  @author fritz.ray@eduworks.com
 *  @class EbacCredentialCommit
 *  @module org.cassproject
 */
var EbacCredentialCommit = function() {
    EcLinkedData.call(this, Ebac.context, EbacCredentialCommit.TYPE_0_4);
    this.credentials = new EbacCredentials();
};
EbacCredentialCommit = stjs.extend(EbacCredentialCommit, EcLinkedData, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/ebac/0.1/credentialCommit";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/ebac/0.2/credentialCommit";
    constructor.TYPE_0_3 = "http://schema.cassproject.org/kbac/0.2/CredentialCommit";
    constructor.TYPE_0_4 = "https://schema.cassproject.org/kbac/0.4/CredentialCommit";
    /**
     *  Hashed username.
     * 
     *  @property username
     *  @type string
     */
    prototype.username = null;
    /**
     *  Hashed password to authorize commit.
     * 
     *  @property password
     *  @type string
     */
    prototype.password = null;
    /**
     *  Token provided to client when previously executed Request was done. May
     *  be empty if this is used as part of Create action.
     * 
     *  @property token
     *  @type string
     */
    prototype.token = null;
    /**
     *  List of credentials to commit to the login server storage.
     * 
     *  @property credentials
     *  @type EbacCredentials
     */
    prototype.credentials = null;
    prototype.upgrade = function() {
        EcLinkedData.prototype.upgrade.call(this);
        if (EbacCredentialCommit.TYPE_0_1.equals(this.type)) {
            var me = (this);
            if (me["@context"] == null && me["@schema"] != null) 
                me["@context"] = me["@schema"];
            this.setContextAndType(Ebac.context_0_2, EbacCredentialCommit.TYPE_0_2);
        }
        if (EbacCredentialCommit.TYPE_0_2.equals(this.getFullType())) {
            this.setContextAndType(Ebac.context_0_3, EbacCredentialCommit.TYPE_0_3);
        }
        if (EbacCredentialCommit.TYPE_0_3.equals(this.getFullType())) {
            this.setContextAndType(Ebac.context_0_4, EbacCredentialCommit.TYPE_0_4);
        }
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(EbacCredentialCommit.TYPE_0_4);
        a.push(EbacCredentialCommit.TYPE_0_3);
        a.push(EbacCredentialCommit.TYPE_0_2);
        a.push(EbacCredentialCommit.TYPE_0_1);
        return a;
    };
}, {credentials: "EbacCredentials", atProperties: {name: "Array", arguments: [null]}}, {});
