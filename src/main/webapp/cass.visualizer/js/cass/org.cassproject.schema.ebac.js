/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
/**
 *  Message used to retrieve credentials from a remote system.
 *  
 *  TODO: Vulnerable to replay attacks.
 *  
 *  @author fritz.ray@eduworks.com
 */
var EbacCredentialRequest = function() {
    EcLinkedData.call(this, Ebac.context, EbacCredentialRequest.TYPE_0_2);
};
EbacCredentialRequest = stjs.extend(EbacCredentialRequest, EcLinkedData, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/ebac/0.1/credentialRequest";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/ebac/0.2/credentialRequest";
    /**
     *  Hashed username.
     */
    prototype.username = null;
    /**
     *  Hashed password to authorize request.
     */
    prototype.password = null;
    prototype.upgrade = function() {
        EcLinkedData.prototype.upgrade.call(this);
        if (EbacCredentialRequest.TYPE_0_1.equals(this.type)) {
            var me = (this);
            if (me["@context"] == null && me["@schema"] != null) 
                me["@context"] = me["@schema"];
            this.setContextAndType(Ebac.context_0_2, EbacCredentialRequest.TYPE_0_2);
        }
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(EbacCredentialRequest.TYPE_0_2);
        a.push(EbacCredentialRequest.TYPE_0_1);
        return a;
    };
}, {atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  Credential list along with one time pad and session-based token for use in
 *  commit actions.
 *  
 *  @author fritz.ray@eduworks.com
 */
var EbacCredentials = function() {
    EcLinkedData.call(this, Ebac.context, EbacCredentials.TYPE_0_2);
};
EbacCredentials = stjs.extend(EbacCredentials, EcLinkedData, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/ebac/0.1/credentials";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/ebac/0.2/credentials";
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
    /**
     *  Contact array.
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
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(EbacCredentials.TYPE_0_2);
        a.push(EbacCredentials.TYPE_0_1);
        return a;
    };
}, {credentials: {name: "Array", arguments: ["EbacCredential"]}, contacts: {name: "Array", arguments: ["EbacContact"]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  AES encrypted private key and display name. Contains Initialization Vectors,
 *  but not secrets. Used to encrypt private identities for storage on remote
 *  systems.
 *  
 *  @author fritz.ray@eduworks.com
 */
var EbacCredential = function() {
    EcLinkedData.call(this, Ebac.context, EbacCredential.TYPE_0_2);
};
EbacCredential = stjs.extend(EbacCredential, EcLinkedData, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/ebac/0.1/credential";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/ebac/0.2/credential";
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
    prototype.upgrade = function() {
        EcLinkedData.prototype.upgrade.call(this);
        if (EbacCredential.TYPE_0_1.equals(this.type)) {
            var me = (this);
            if (me["@context"] == null && me["@schema"] != null) 
                me["@context"] = me["@schema"];
            this.setContextAndType(Ebac.context_0_2, EbacCredential.TYPE_0_2);
        }
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(EbacCredential.TYPE_0_2);
        a.push(EbacCredential.TYPE_0_1);
        return a;
    };
}, {atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  AES encrypted public key and display name. Contains Initialization Vectors,
 *  but not secrets. Used to encrypt public identities for storage on remote
 *  systems.
 *  
 *  @author fritz.ray@eduworks.com
 */
var EbacContact = function() {
    EcLinkedData.call(this, Ebac.context, EbacContact.TYPE_0_2);
};
EbacContact = stjs.extend(EbacContact, EcLinkedData, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/ebac/0.2/contact";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/ebac/0.2/contact";
    /**
     *  AES Initialization Vector used to decode PPK.
     */
    prototype.iv = null;
    /**
     *  AES encrypted Private Key in PEM form.
     */
    prototype.pk = null;
    /**
     *  AES Initialization Vector used to decode displayName.
     */
    prototype.displayNameIv = null;
    /**
     *  AES encrypted display name for identity.
     */
    prototype.displayName = null;
    prototype.sourceIv = null;
    prototype.source = null;
    prototype.upgrade = function() {
        EcLinkedData.prototype.upgrade.call(this);
        if (EbacContact.TYPE_0_1.equals(this.type)) {
            var me = (this);
            if (me["@context"] == null && me["@schema"] != null) 
                me["@context"] = me["@schema"];
            this.setContextAndType(Ebac.context_0_2, EbacContact.TYPE_0_2);
        }
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(EbacContact.TYPE_0_2);
        a.push(EbacContact.TYPE_0_1);
        return a;
    };
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
    EcLinkedData.call(this, Ebac.context, EbacEncryptedSecret.TYPE_0_2);
};
EbacEncryptedSecret = stjs.extend(EbacEncryptedSecret, EcLinkedData, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/ebac/0.1/encryptedSecret";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/ebac/0.2/encryptedSecret";
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
    prototype.upgrade = function() {
        EcLinkedData.prototype.upgrade.call(this);
        if (EbacEncryptedSecret.TYPE_0_1.equals(this.type)) {
            var me = (this);
            if (me["@context"] == null && me["@schema"] != null) 
                me["@context"] = me["@schema"];
            this.setContextAndType(Ebac.context_0_2, EbacEncryptedSecret.TYPE_0_2);
        }
    };
    prototype.getTypes = function() {
        var a = new Array();
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
 */
var EbacSignature = function() {
    EcLinkedData.call(this, Ebac.context, EbacSignature.TYPE_0_2);
};
EbacSignature = stjs.extend(EbacSignature, EcLinkedData, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/ebac/0.1/timeLimitedSignature";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/ebac/0.2/timeLimitedSignature";
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
    prototype.upgrade = function() {
        EcLinkedData.prototype.upgrade.call(this);
        if (EbacSignature.TYPE_0_1.equals(this.type)) {
            var me = (this);
            if (me["@context"] == null && me["@schema"] != null) 
                me["@context"] = me["@schema"];
            this.setContextAndType(Ebac.context_0_2, EbacSignature.TYPE_0_2);
        }
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(EbacSignature.TYPE_0_2);
        a.push(EbacSignature.TYPE_0_1);
        return a;
    };
}, {atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  Encrypted JSON-LD object.
 *  
 *  @author fritz.ray@eduworks.com
 */
var EbacEncryptedValue = function() {
    EcRemoteLinkedData.call(this, Ebac.context, EbacEncryptedValue.myType);
};
EbacEncryptedValue = stjs.extend(EbacEncryptedValue, EcRemoteLinkedData, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/ebac/0.1/encryptedValue";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/ebac/0.2/encryptedValue";
    constructor.myType = EbacEncryptedValue.TYPE_0_2;
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
        if (EbacEncryptedValue.TYPE_0_1.equals(this.type)) {
            var me = (this);
            if (me["@context"] == null && me["@schema"] != null) 
                me["@context"] = me["@schema"];
            this.setContextAndType(Ebac.context_0_2, EbacEncryptedValue.TYPE_0_2);
        }
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(EbacEncryptedValue.TYPE_0_2);
        a.push(EbacEncryptedValue.TYPE_0_1);
        return a;
    };
}, {owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, secret: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  AES encrypted public key and display name. Contains Initialization Vectors,
 *  but not secrets. Used to encrypt public identities for storage on remote
 *  systems.
 *  
 *  @author fritz.ray@eduworks.com
 */
var EbacContactGrant = function() {
    EcRemoteLinkedData.call(this, Ebac.context, EbacContactGrant.TYPE_0_2);
};
EbacContactGrant = stjs.extend(EbacContactGrant, EcRemoteLinkedData, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/ebac/0.1/contactGrant";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/ebac/0.2/contactGrant";
    prototype.iv = null;
    prototype.pk = null;
    prototype.displayName = null;
    prototype.source = null;
    prototype.responseToken = null;
    prototype.responseSignature = null;
    prototype.upgrade = function() {
        EcLinkedData.prototype.upgrade.call(this);
        if (EbacContactGrant.TYPE_0_1.equals(this.type)) {
            var me = (this);
            if (me["@context"] == null && me["@schema"] != null) 
                me["@context"] = me["@schema"];
            this.setContextAndType(Ebac.context_0_2, EbacContactGrant.TYPE_0_2);
        }
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(EbacContactGrant.TYPE_0_2);
        a.push(EbacContactGrant.TYPE_0_1);
        return a;
    };
}, {owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, secret: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  Message used to commit credentials to a remote login server.
 *  
 *  TODO: Semi-vulnerable to replay attacks. Token field prevents some replay
 *  attacks.
 *  
 *  @author fritz.ray@eduworks.com
 */
var EbacCredentialCommit = function() {
    EcLinkedData.call(this, Ebac.context, EbacCredentialCommit.TYPE_0_2);
    this.credentials = new EbacCredentials();
};
EbacCredentialCommit = stjs.extend(EbacCredentialCommit, EcLinkedData, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/ebac/0.1/credentialCommit";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/ebac/0.2/credentialCommit";
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
    prototype.upgrade = function() {
        EcLinkedData.prototype.upgrade.call(this);
        if (EbacCredentialCommit.TYPE_0_1.equals(this.type)) {
            var me = (this);
            if (me["@context"] == null && me["@schema"] != null) 
                me["@context"] = me["@schema"];
            this.setContextAndType(Ebac.context_0_2, EbacCredentialCommit.TYPE_0_2);
        }
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(EbacCredentialCommit.TYPE_0_2);
        a.push(EbacCredentialCommit.TYPE_0_1);
        return a;
    };
}, {credentials: "EbacCredentials", atProperties: {name: "Array", arguments: [null]}}, {});
