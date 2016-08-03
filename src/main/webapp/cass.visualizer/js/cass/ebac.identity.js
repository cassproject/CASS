/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
/**
 *  A contact is an identity that we do not own. Using the public key we may: 1.
 *  Send them information (by encrypting data with their public key) 2. Verify a
 *  signed message that was sent (by using the verify function of the public key)
 *  3. Distinguish between this identity and other identities through the
 *  displayName.
 *  
 *  @author fray
 */
var EcContact = function() {};
EcContact = stjs.extend(EcContact, null, [], function(constructor, prototype) {
    prototype.pk = null;
    prototype.displayName = null;
    prototype.source = null;
    prototype.equals = function(obj) {
        if (stjs.isInstanceOf(obj.constructor, EcContact)) 
            return this.pk.equals((obj).pk);
        return Object.prototype.equals.call(this, obj);
    };
    prototype.getImageUrl = function() {
        return "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/48px-User_icon_2.svg.png";
    };
    /**
     *  Helper function to encrypt a contact into an encrypted contact (storable
     *  version of a contact)
     *  
     *  @param secret
     *             AES secret used to encrypt the contact.
     *  @return Encrypted contact object.
     */
    prototype.toEncryptedContact = function(secret) {
        var c = new EbacContact();
        c.iv = EcAes.newIv(32);
        c.pk = EcAesCtr.encrypt(this.pk.toPem(), secret, c.iv);
        c.displayNameIv = EcAes.newIv(32);
        c.displayName = EcAesCtr.encrypt(this.displayName, secret, c.iv);
        c.sourceIv = EcAes.newIv(32);
        c.source = EcAesCtr.encrypt(this.source, secret, c.iv);
        return c;
    };
    /**
     *  Helper function to decrypt an encrypted contact (storable version of an contact)
     *  into an contact
     *  
     *  @param contact
     *             Contact to decrypt.
     *  @param secret
     *             AES secret used to decrypt the credential.
     *  @param source
     *             Source of the credential, used to track where a contact
     *             came from.
     *  @return Decrypted identity object, ready for use.
     */
    constructor.fromEncryptedContact = function(contact, secret, source) {
        var i = new EcContact();
        i.pk = EcPk.fromPem(EcAesCtr.decrypt(contact.pk, secret, contact.iv));
        i.source = source;
        if (contact.displayName != null && contact.displayNameIv != null) 
            i.displayName = EcAesCtr.decrypt(contact.displayName, secret, contact.iv);
        return i;
    };
}, {pk: "EcPk"}, {});
/**
 *  An identity is an alias that a person or system may own. It consists of a
 *  private key and a display name. Using the private key we may: 1. Perform all
 *  operations of a EcContact. 2. Decrypt messages using our private key. 3. Sign
 *  messages, ensuring the recipient knows that we sent the message and it was
 *  not altered.
 *  
 *  @author fray
 */
var EcIdentity = function() {
    this.displayName = "Alias " + EcIdentity.identityCounter++;
};
EcIdentity = stjs.extend(EcIdentity, null, [], function(constructor, prototype) {
    constructor.identityCounter = 1;
    prototype.ppk = null;
    prototype.displayName = null;
    prototype.source = null;
    prototype.equals = function(obj) {
        if (stjs.isInstanceOf(obj.constructor, EcIdentity)) 
            return this.ppk.equals((obj).ppk);
        return Object.prototype.equals.call(this, obj);
    };
    /**
     *  Helper function to encrypt an identity into a credential (storable
     *  version of an identity)
     *  
     *  @param secret
     *             AES secret used to encrypt the credential.
     *  @return Encrypted credential object.
     */
    prototype.toCredential = function(secret) {
        var c = new EbacCredential();
        c.iv = EcAes.newIv(32);
        c.ppk = EcAesCtr.encrypt(this.ppk.toPem(), secret, c.iv);
        c.displayNameIv = EcAes.newIv(32);
        c.displayName = EcAesCtr.encrypt(this.displayName, secret, c.iv);
        return c;
    };
    /**
     *  Helper function to decrypt a credential (storable version of an identity)
     *  into an identity)
     *  
     *  @param credential
     *             Credential to decrypt.
     *  @param secret
     *             AES secret used to decrypt the credential.
     *  @param source
     *             Source of the credential, used to track where a credential
     *             came from.
     *  @return Decrypted identity object, ready for use.
     */
    constructor.fromCredential = function(credential, secret, source) {
        var i = new EcIdentity();
        i.ppk = EcPpk.fromPem(EcAesCtr.decrypt(credential.ppk, secret, credential.iv));
        i.source = source;
        if (credential.displayName != null && credential.displayNameIv != null) 
            i.displayName = EcAesCtr.decrypt(credential.displayName, secret, credential.iv);
        return i;
    };
}, {ppk: "EcPpk"}, {});
/**
 *  Manages identities and contacts, provides hooks to respond to identity and
 *  contact events, and builds signatures and signature sheets for authorizing
 *  movement of data. Also provides helper functions for identity management.
 *  
 *  @author fritz.ray@eduworks.com
 */
var EcIdentityManager = function() {};
EcIdentityManager = stjs.extend(EcIdentityManager, null, [], function(constructor, prototype) {
    constructor.main = function(args) {
        EcIdentityManager.readContacts();
    };
    constructor.ids = new Array();
    constructor.contacts = new Array();
    constructor.onIdentityChanged = null;
    constructor.onContactChanged = null;
    constructor.identityChanged = function(identity) {
        if (EcIdentityManager.onIdentityChanged != null) 
            EcIdentityManager.onIdentityChanged(identity);
    };
    constructor.contactChanged = function(contact) {
        if (EcIdentityManager.onContactChanged != null) 
            EcIdentityManager.onContactChanged(contact);
        EcIdentityManager.saveContacts();
    };
    /**
     *  Reads contact data from localstorage.
     */
    constructor.readContacts = function() {
        var localStore = localStorage["contacts"];
        if (localStore == null) 
            return;
        var c = JSON.parse(localStore);
        for (var i = 0; i < c.length; i++) {
            var contact = new EcContact();
            var o = c[i];
            var props = (o);
            contact.displayName = props["displayName"];
            contact.pk = EcPk.fromPem(props["pk"]);
            contact.source = props["source"];
            var cont = false;
            for (var j = 0; j < EcIdentityManager.contacts.length; j++) {
                if (EcIdentityManager.contacts[j].pk.toPem() == contact.pk.toPem()) 
                    cont = true;
            }
            if (cont) 
                continue;
            EcIdentityManager.contacts.push(contact);
        }
    };
    /**
     *  Writes contact data to localstorage.
     */
    constructor.saveContacts = function() {
        var c = new Array();
        for (var i = 0; i < EcIdentityManager.contacts.length; i++) {
            var o = new Object();
            var props = (o);
            var contact = EcIdentityManager.contacts[i];
            props["displayName"] = contact.displayName;
            props["pk"] = contact.pk.toPem();
            props["source"] = contact.source;
            c.push(o);
        }
        localStorage["contacts"] = JSON.stringify(c);
    };
    /**
     *  Reads contact data from localstorage.
     */
    constructor.readIdentities = function() {
        var localStore = localStorage["identities"];
        if (localStore == null) 
            return;
        var c = JSON.parse(localStore);
        for (var i = 0; i < c.length; i++) {
            var identity = new EcIdentity();
            var o = c[i];
            var props = (o);
            identity.displayName = props["displayName"];
            identity.ppk = EcPpk.fromPem(props["ppk"]);
            identity.source = props["source"];
            var cont = false;
            for (var j = 0; j < EcIdentityManager.ids.length; j++) {
                if (EcIdentityManager.ids[j].ppk.toPem() == identity.ppk.toPem()) 
                    cont = true;
            }
            if (cont) 
                continue;
            EcIdentityManager.ids.push(identity);
        }
    };
    /**
     *  Writes contact data to localstorage.
     */
    constructor.saveIdentities = function() {
        var c = new Array();
        for (var i = 0; i < EcIdentityManager.ids.length; i++) {
            var o = new Object();
            var props = (o);
            var identity = EcIdentityManager.ids[i];
            props["displayName"] = identity.displayName;
            props["ppk"] = identity.ppk.toPem();
            props["source"] = identity.source;
            c.push(o);
        }
        localStorage["identities"] = JSON.stringify(c);
    };
    constructor.clearContacts = function() {
        delete localStorage["contacts"];
        EcIdentityManager.contacts = new Array();
    };
    /**
     *  Adds an identity to the identity manager. Checks for duplicates. Triggers
     *  events.
     *  
     *  @param identity
     *             Identity to add.
     */
    constructor.addIdentity = function(identity) {
        for (var i = 0; i < EcIdentityManager.ids.length; i++) 
            if (EcIdentityManager.ids[i].equals(identity)) 
                return;
        EcIdentityManager.ids.push(identity);
        EcIdentityManager.identityChanged(identity);
    };
    /**
     *  Adds a contact to the identity manager. Checks for duplicates. Triggers
     *  events.
     *  
     *  @param contact
     *             Contact to add.
     */
    constructor.addContact = function(contact) {
        for (var i = 0; i < EcIdentityManager.ids.length; i++) 
            if (EcIdentityManager.ids[i].ppk.toPk().toPem().equals(contact.pk.toPem())) {
                EcIdentityManager.ids[i].displayName = contact.displayName;
                EcIdentityManager.contactChanged(contact);
            }
        for (var i = 0; i < EcIdentityManager.contacts.length; i++) 
            if (EcIdentityManager.contacts[i].pk.toPem().equals(contact.pk.toPem())) {
                EcIdentityManager.contacts[i].displayName = contact.displayName;
                EcIdentityManager.contactChanged(contact);
            }
        for (var i = 0; i < EcIdentityManager.contacts.length; i++) 
            if (EcIdentityManager.contacts[i].equals(contact)) 
                return;
        EcIdentityManager.contacts.push(contact);
        EcIdentityManager.contactChanged(contact);
    };
    /**
     *  Create a signature sheet, authorizing movement of data outside of our
     *  control.
     *  
     *  @param identityPksinPem
     *             Which identities to create signatures for.
     *  @param duration
     *             Length of time in milliseconds to authorize control.
     *  @param server
     *             Server that we are authorizing.
     *  @return JSON Array containing signatures.
     */
    constructor.signatureSheetFor = function(identityPksinPem, duration, server) {
        var signatures = new Array();
        var crypto = new EcRsaOaep();
        for (var j = 0; j < EcIdentityManager.ids.length; j++) {
            var ppk = EcIdentityManager.ids[j].ppk;
            var pk = ppk.toPk();
            if (identityPksinPem != null) 
                for (var i = 0; i < identityPksinPem.length; i++) {
                    var ownerPpk = EcPk.fromPem(identityPksinPem[i].trim());
                    if (pk.equals(ownerPpk)) 
                        signatures.push(EcIdentityManager.createSignature(duration, server, crypto, ppk).atIfy());
                }
        }
        return JSON.stringify(signatures);
    };
    /**
     *  Create a signature sheet for all identities, authorizing movement of data
     *  outside of our control.
     *  
     *  @param duration
     *             Length of time in milliseconds to authorize control.
     *  @param server
     *             Server that we are authorizing.
     *  @return JSON Array containing signatures.
     */
    constructor.signatureSheet = function(duration, server) {
        var signatures = new Array();
        var crypto = new EcRsaOaep();
        for (var j = 0; j < EcIdentityManager.ids.length; j++) {
            var ppk = EcIdentityManager.ids[j].ppk;
            signatures.push(EcIdentityManager.createSignature(duration, server, crypto, ppk).atIfy());
        }
        return JSON.stringify(signatures);
    };
    constructor.createSignature = function(duration, server, crypto, ppk) {
        var s = new EbacSignature();
        s.owner = ppk.toPk().toPem();
        s.expiry = new Date().getTime() + duration;
        s.server = server;
        s.signature = EcRsaOaep.sign(ppk, s.toJson());
        return s;
    };
    /**
     *  Get PPK from PK (if we have it)
     *  
     *  @param fromPem
     *             PK to use to look up PPK
     *  @return PPK or null.
     */
    constructor.getPpk = function(fromPem) {
        var pem = fromPem.toPem();
        for (var i = 0; i < EcIdentityManager.ids.length; i++) {
            if (pem.equals(EcIdentityManager.ids[i].ppk.toPk().toPem())) 
                return EcIdentityManager.ids[i].ppk;
        }
        return null;
    };
    /**
     *  Get Contact from PK (if we have it)
     *  
     *  @param fromPem
     *             PK to use to look up PPK
     *  @return PPK or null.
     */
    constructor.getContact = function(pk) {
        for (var i = 0; i < EcIdentityManager.contacts.length; i++) {
            if (pk.equals(EcIdentityManager.contacts[i].pk)) 
                return EcIdentityManager.contacts[i];
        }
        return null;
    };
    /**
     *  Get Identity from PK (if we have it)
     *  
     *  @param fromPem
     *             PK to use to look up PPK
     *  @return PPK or null.
     */
    constructor.getIdentity = function(pk) {
        for (var i = 0; i < EcIdentityManager.ids.length; i++) {
            if (pk.equals(EcIdentityManager.ids[i].ppk.toPk())) 
                return EcIdentityManager.ids[i];
        }
        return null;
    };
    /**
     *  Sign a piece of data with all available keys that own that data.
     *  
     *  @param d
     *             Data to sign.
     */
    constructor.sign = function(d) {
        if (d.signature != null) {
            for (var i = 0; i < d.signature.length; ) {
                var works = false;
                var signature = d.signature[i];
                if (d.owner != null) {
                    for (var j = 0; j < d.owner.length; j++) {
                        var owner = d.owner[j];
                        var pk = EcPk.fromPem(owner);
                        try {
                            if (EcRsaOaep.verify(pk, d.toSignableJson(), signature)) {
                                works = true;
                                break;
                            }
                        }catch (ex) {}
                    }
                }
                if (!works) 
                    d.signature.splice(i);
                 else 
                    i++;
            }
        }
        if (d.owner != null) {
            for (var i = 0; i < d.owner.length; i++) {
                var attempt = EcIdentityManager.getPpk(EcPk.fromPem(d.owner[i]));
                if (attempt != null) 
                    d.signWith(attempt);
            }
        }
    };
}, {ids: {name: "Array", arguments: ["EcIdentity"]}, contacts: {name: "Array", arguments: ["EcContact"]}, onIdentityChanged: {name: "Callback1", arguments: ["EcIdentity"]}, onContactChanged: {name: "Callback1", arguments: ["EcContact"]}}, {});
if (!stjs.mainCallDisabled) 
    EcIdentityManager.main();
var EcContactGrant = function() {
    EbacContactGrant.call(this);
};
EcContactGrant = stjs.extend(EcContactGrant, EbacContactGrant, [], function(constructor, prototype) {
    constructor.myType = "http://schema.eduworks.com/ebac/0.2/contactGrant";
    prototype.valid = function() {
        if (!this.verify()) 
            return false;
        if (this.invalid()) 
            return false;
        var found = false;
        for (var i = 0; i < EcIdentityManager.ids.length; i++) {
            if (EcRsaOaep.verify(EcIdentityManager.ids[i].ppk.toPk(), this.responseToken, this.responseSignature)) 
                found = true;
        }
        return found;
    };
}, {owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, secret: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  Logs into and stores/retrieves credentials from a compatible remote server.
 *  Performs anonymization of the user.
 *  
 *  Requires initialization with server specific salts. Server specific salts
 *  prevent co-occurrence attacks, should credentials on one server be
 *  compromised (intercepted in transit).
 *  
 *  Transmits hashed username, hashed password, and encrypts credentials using
 *  the hashed combination of the username and password. This prevents the system
 *  storing the credentials from having any knowledge of the user.
 *  
 *  Password recovery is done by, when the password changes, creating a
 *  cryptographic pad (or perfect cipher) where one half is stored on the server,
 *  and the other half is stored with the user. Should the user lose this pad and
 *  forget their password, they are not able to recover or reset their password,
 *  and their data should be considered lost.
 *  
 *  @author fritz.ray@eduworks.com
 */
var EcRemoteIdentityManager = function() {};
EcRemoteIdentityManager = stjs.extend(EcRemoteIdentityManager, null, [], function(constructor, prototype) {
    prototype.usernameSalt = null;
    prototype.usernameIterations = 0;
    prototype.usernameWidth = 0;
    prototype.passwordSalt = null;
    prototype.passwordIterations = 0;
    prototype.passwordWidth = 0;
    prototype.secretSalt = null;
    prototype.secretIterations = 0;
    prototype.configured = false;
    prototype.server = null;
    prototype.usernameWithSalt = null;
    prototype.passwordWithSalt = null;
    prototype.secretWithSalt = null;
    prototype.pad = null;
    prototype.token = null;
    /**
     *  Configure parameters of the remote login storage.
     *  
     *  @param usernameSalt
     *             Salt used in hashing the username.
     *  @param usernameIterations
     *             Number of times to hash the username.
     *  @param usernameWidth
     *             Resultant width of username in bytes.
     *  @param passwordSalt
     *             Salt used to hash password.
     *  @param passwordIterations
     *             Number of times to hash password.
     *  @param passwordWidth
     *             Resultant width of password in bytes.
     *  @param secretSalt
     *             Salt used to hash secret (composed of username + password)
     *  @param secretIterations
     *             Number of times to hash secret.
     */
    prototype.configure = function(usernameSalt, usernameIterations, usernameWidth, passwordSalt, passwordIterations, passwordWidth, secretSalt, secretIterations) {
        this.usernameSalt = usernameSalt;
        this.usernameIterations = usernameIterations;
        this.usernameWidth = usernameWidth;
        this.passwordSalt = passwordSalt;
        this.passwordIterations = passwordIterations;
        this.passwordWidth = passwordWidth;
        this.secretSalt = secretSalt;
        this.secretIterations = secretIterations;
        this.configured = true;
    };
    prototype.configureFromServer = function(success, failure) {
        var me = this;
        EcRemote.getExpectingObject(this.server, "sky/id/salts", function(p1) {
            me.usernameSalt = (p1)["usernameSalt"];
            if (me.usernameSalt.length < 16) {
                failure("Insufficient length on Username Salt");
                return;
            }
            me.usernameIterations = stjs.trunc((p1)["usernameIterations"]);
            if (me.usernameIterations < 1000) {
                failure("Insufficient iterations on Username Hash");
                return;
            }
            me.usernameWidth = stjs.trunc((p1)["usernameLength"]);
            if (me.usernameWidth != 64) {
                failure("Username Hash required to be length 64.");
                return;
            }
            me.passwordSalt = (p1)["passwordSalt"];
            if (me.passwordSalt.length < 16) {
                failure("Insufficient length on Password Salt");
                return;
            }
            me.passwordIterations = stjs.trunc((p1)["passwordIterations"]);
            if (me.passwordIterations < 1000) {
                failure("Insufficient iterations on Password Hash");
                return;
            }
            me.passwordWidth = stjs.trunc((p1)["passwordLength"]);
            if (me.passwordWidth != 64) {
                failure("Password Hash required to be length 64.");
                return;
            }
            me.secretSalt = (p1)["secretSalt"];
            if (me.secretSalt.length < 16) {
                failure("Insufficient length on Secret Salt");
                return;
            }
            me.secretIterations = stjs.trunc((p1)["secretIterations"]);
            if (me.secretIterations < 1000) {
                failure("Insufficient iterations on Secret Hash");
                return;
            }
            me.configured = true;
            success(p1);
        }, function(p1) {
            me.configured = false;
            failure(p1);
        });
    };
    /**
     *  Wipes login data.
     */
    prototype.clear = function() {
        this.usernameWithSalt = null;
        this.passwordWithSalt = null;
        this.secretWithSalt = null;
        this.pad = null;
        this.token = null;
    };
    /**
     *  Configure compatible remote identity management server.
     *  
     *  @param server
     *             URL to remote identity management server.
     */
    prototype.setDefaultIdentityManagementServer = function(server) {
        this.server = server;
    };
    /**
     *  "Log Into" system, generating credentials. Does not actually remotely
     *  access any machine.
     *  
     *  Please clear username and password fields after this function is called.
     *  
     *  @param username
     *             Username
     *  @param password
     *             Password
     */
    prototype.startLogin = function(username, password) {
        if (!this.configured) {
            alert("Remote Identity not configured.");
            return;
        }
        this.usernameWithSalt = forge.util.encode64(forge.pkcs5.pbkdf2(username, this.usernameSalt, this.usernameIterations, this.usernameWidth));
        this.passwordWithSalt = forge.util.encode64(forge.pkcs5.pbkdf2(password, this.passwordSalt, this.passwordIterations, this.passwordWidth));
        var arys = new Array();
        arys.push(username, password);
        var secret = this.splicePasswords(arys);
        this.secretWithSalt = forge.util.encode64(forge.pkcs5.pbkdf2(secret, this.secretSalt, this.secretIterations, 32));
    };
    /**
     *  Change password of user in memory. Does not automatically commit new credentials.
     *  
     *  Please clear username and password fields after this function is called.
     *  
     *  @param username
     *             Username
     *  @param oldPassword
     *             Current password
     *  @param newPassword
     *             Desired password
     */
    prototype.changePassword = function(username, oldPassword, newPassword) {
        var usernameHash = forge.util.encode64(forge.pkcs5.pbkdf2(username, this.usernameSalt, this.usernameIterations, this.usernameWidth));
        if (!this.usernameWithSalt.equals(usernameHash)) {
            alert("Username does not match. Aborting password change.");
            return false;
        }
        var oldPasswordHash = forge.util.encode64(forge.pkcs5.pbkdf2(oldPassword, this.passwordSalt, this.passwordIterations, this.passwordWidth));
        if (!this.passwordWithSalt.equals(oldPasswordHash)) {
            alert("Old password does not match. Aborting password change.");
            return false;
        }
        this.passwordWithSalt = forge.util.encode64(forge.pkcs5.pbkdf2(newPassword, this.passwordSalt, this.passwordIterations, this.passwordWidth));
        var arys = new Array();
        arys.push(username, newPassword);
        var secret = this.splicePasswords(arys);
        this.secretWithSalt = forge.util.encode64(forge.pkcs5.pbkdf2(secret, this.secretSalt, this.secretIterations, 32));
        return true;
    };
    /**
     *  Fetch credentials from server, invoking events based on login success or
     *  failure.
     *  
     *  Automatically populates EcIdentityManager.
     *  
     *  Requires login().
     *  
     *  @param success
     *  @param failure
     */
    prototype.fetch = function(success, failure) {
        if (!this.configured) {
            alert("Remote Identity not configured.");
            return;
        }
        if (this.usernameWithSalt == null || this.passwordWithSalt == null || this.secretWithSalt == null) {
            alert("Please log in before performing this operation.");
            return;
        }
        var r = new EbacCredentialRequest();
        r.username = this.usernameWithSalt;
        r.password = this.passwordWithSalt;
        var fd = new FormData();
        fd.append("credentialRequest", r.toJson());
        var me = this;
        EcRemote.postExpectingObject(this.server, "sky/id/login", fd, function(arg0) {
            var cs = arg0;
            me.pad = cs.pad;
            me.token = cs.token;
            if (cs.credentials != null) 
                for (var i = 0; i < cs.credentials.length; i++) {
                    var c = cs.credentials[i];
                    var identity = EcIdentity.fromCredential(c, me.secretWithSalt, me.server);
                    EcIdentityManager.addIdentity(identity);
                }
            if (cs.contacts != null) 
                for (var i = 0; i < cs.contacts.length; i++) {
                    var c = cs.contacts[i];
                    var identity = EcContact.fromEncryptedContact(c, me.secretWithSalt, me.server);
                    EcIdentityManager.addContact(identity);
                }
            success(arg0);
        }, function(arg0) {
            failure(arg0);
        });
    };
    /**
     *  Commits credentials in EcIdentityManager to remote server.
     *  
     *  Will trigger pad generation and fail if the pad has not been specified.
     *  
     *  @param success
     *  @param failure
     *  @param padGenerationCallback
     */
    prototype.commit = function(success, failure, padGenerationCallback) {
        var service = "sky/id/commit";
        this.sendCredentials(success, failure, padGenerationCallback, service);
    };
    /**
     *  Creates an account.
     *  
     *  Please note that the remote login server does not throw error messages if
     *  an account creation is blocked due to being a duplicate. This prevents
     *  login probing. This will always succeed (if the request is properly
     *  formed and makes it to the server).
     *  
     *  Will trigger pad generation and fail if the pad has not been specified.
     *  
     *  @param success
     *  @param failure
     *  @param padGenerationCallback
     */
    prototype.create = function(success, failure, padGenerationCallback) {
        var service = "sky/id/create";
        this.sendCredentials(success, failure, padGenerationCallback, service);
    };
    prototype.sendCredentials = function(success, failure, padGenerationCallback, service) {
        if (!this.configured) 
            alert("Remote Identity not configured.");
        if (this.usernameWithSalt == null || this.passwordWithSalt == null || this.secretWithSalt == null) {
            alert("Please log in before performing this operation.");
            return;
        }
        var credentials = new Array();
        var contacts = new Array();
        if (this.pad == null && padGenerationCallback != null) 
            this.pad = padGenerationCallback.callback();
        for (var i = 0; i < EcIdentityManager.ids.length; i++) {
            var id = EcIdentityManager.ids[i];
            if (id.source != null && id.source.equals(this.server) == false) 
                continue;
            id.source = this.server;
            credentials.push(id.toCredential(this.secretWithSalt));
        }
        for (var i = 0; i < EcIdentityManager.contacts.length; i++) {
            var id = EcIdentityManager.contacts[i];
            if (id.source != null && id.source.equals(this.server) == false) 
                continue;
            id.source = this.server;
            contacts.push(id.toEncryptedContact(this.secretWithSalt));
        }
        var commit = new EbacCredentialCommit();
        commit.username = this.usernameWithSalt;
        commit.password = this.passwordWithSalt;
        commit.token = this.token;
        commit.credentials.pad = this.pad;
        commit.credentials.credentials = credentials;
        commit.credentials.contacts = contacts;
        var fd = new FormData();
        fd.append("credentialCommit", commit.toJson());
        fd.append("signatureSheet", EcIdentityManager.signatureSheet(60000, this.server));
        EcRemote.postExpectingString(this.server, service, fd, function(arg0) {
            success(arg0);
        }, function(arg0) {
            failure(arg0);
        });
    };
    /**
     *  Splices together passwords (in a fashion more like shuffling a deck of
     *  cards, not appending).
     *  
     *  @param passwords
     *             Passwords to splice.
     *  @return Spliced password.
     */
    prototype.splicePasswords = function(passwords) {
        var passwordSplice = "";
        for (var charIndex = 0; charIndex > 0; charIndex++) {
            var foundAny = false;
            for (var passwordIndex = 0; passwordIndex < passwords.length; passwordIndex++) {
                if (charIndex >= passwords[passwordIndex].length) 
                    continue;
                passwordSplice += passwords[passwordIndex].charAt(charIndex);
                foundAny = true;
            }
            if (!foundAny) 
                break;
        }
        return passwordSplice;
    };
    prototype.fetchServerAdminKeys = function(success, failure) {
        var service;
        if (this.server.endsWith("/")) {
            service = "sky/admin";
        } else {
            service = "/sky/admin";
        }
        EcRemote.getExpectingObject(this.server, service, function(p1) {
            success(p1);
        }, function(p1) {
            failure("");
        });
    };
}, {}, {});
