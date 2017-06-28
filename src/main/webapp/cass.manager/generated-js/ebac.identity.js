var RemoteIdentityManagerInterface = function() {};
RemoteIdentityManagerInterface = stjs.extend(RemoteIdentityManagerInterface, null, [], function(constructor, prototype) {
    prototype.configure = function(usernameSalt, usernameIterations, usernameWidth, passwordSalt, passwordIterations, passwordWidth, secretSalt, secretIterations) {};
    prototype.configureFromServer = function(success, failure) {};
    prototype.isGlobal = function() {};
    prototype.clear = function() {};
    prototype.setDefaultIdentityManagementServer = function(server) {};
    prototype.startLogin = function(username, password) {};
    prototype.changePassword = function(username, oldPassword, newPassword) {};
    prototype.fetch = function(success, failure) {};
    prototype.commit = function(success, failure, padGenerationCallback) {};
    prototype.create = function(success, failure, padGenerationCallback) {};
}, {}, {});
/**
 *  A contact is an identity that we do not own. Using the public key we may: 1.
 *  Send them information (by encrypting data with their public key) 2. Verify a
 *  signed message that was sent (by using the verify function of the public key)
 *  3. Distinguish between this identity and other identities through the
 *  displayName.
 *  
 *  @module com.eduworks.ec
 *  @class EcContact
 *  @constructor
 * 
 *  @author fritz.ray@eduworks.com
 */
var EcContact = function() {};
EcContact = stjs.extend(EcContact, null, [], function(constructor, prototype) {
    /**
     *  Public Key of the contact
     *  
     *  @property pk
     *  @type EcPk
     */
    prototype.pk = null;
    /**
     *  Display Name of the contact
     *  
     *  @property displayName
     *  @type String
     */
    prototype.displayName = null;
    /**
     *  URL to the home server of the contact
     *  
     *  @property source
     *  @type String
     */
    prototype.source = null;
    /**
     *  Comparison method that checks if the key is the same as another EcContact
     *  
     *  @memberOf EcContact
     *  @method equals
     *  @param {Object} obj
     *  			Contact to compare if same key
     *  @return {boolean}
     *  			true if the key is the same, false if not
     */
    prototype.equals = function(obj) {
        if (stjs.isInstanceOf(obj.constructor, EcContact)) 
            return this.pk.equals((obj).pk);
        return Object.prototype.equals.call(this, obj);
    };
    /**
     *  Returns the URL to generic image that should be displayed for the contact
     *  
     *  @memberOf EcContact
     *  @method getImageUrl
     *  @return {String}
     *  			URL of generic image file
     */
    prototype.getImageUrl = function() {
        return "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/48px-User_icon_2.svg.png";
    };
    /**
     *  Helper function to encrypt a contact into an encrypted contact (storable
     *  version of a contact)
     *  
     *  @memberOf EcContact
     *  @method toEncryptedContact
     *  @param {String} secret
     *            AES secret used to encrypt the contact.
     *  @return {EbacContact}
     *  			Encrypted contact object.
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
     *  @memberOf EcContact
     *  @method fromEncryptedContact
     *  @static
     *  @param {EbacContact} contact
     *           Contact to decrypt.
     *  @param {String} secret
     *           AES secret used to decrypt the credential.
     *  @param {String} source
     *           Source of the credential, used to track where a contact
     *           came from.
     *  @return {EcContact}
     *  			Decrypted identity object, ready for use.
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
 *  @module com.eduworks.ec
 *  @class EcIdentity
 *  @constructor
 *  
 *  @author fritz.ray@eduworks.com
 */
var EcIdentity = function() {
    this.displayName = "Alias " + EcIdentity.identityCounter++;
};
EcIdentity = stjs.extend(EcIdentity, null, [], function(constructor, prototype) {
    constructor.identityCounter = 1;
    /**
     *  Private Key of this identity
     *  
     *  @property ppk
     *  @type EcPpk
     */
    prototype.ppk = null;
    /**
     *  Display name of this identity
     *  
     *  @property displayName
     *  @type String
     */
    prototype.displayName = null;
    /**
     *  String identifying where this identity came from
     *  
     *  @property displayName
     *  @type String
     */
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
     *  @memberOf EcIdentity
     *  @method toCredential
     *  @param {String} secret
     *           AES secret used to encrypt the credential.
     *  @return {EbacCredential} 
     *  			Encrypted credential object.
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
     *  @memberOf EcIdentity
     *  @method fromCredential
     *  @static
     *  @param {EbacCredential} credential
     *           Credential to decrypt.
     *  @param {String} secret
     *           AES secret used to decrypt the credential.
     *  @param {String} source
     *           Source of the credential, used to track where a credential
     *           came from.
     *  @return {EcIdentity}
     *  			Decrypted identity object, ready for use.
     */
    constructor.fromCredential = function(credential, secret, source) {
        var i = new EcIdentity();
        i.ppk = EcPpk.fromPem(EcAesCtr.decrypt(credential.ppk, secret, credential.iv));
        i.source = source;
        if (credential.displayName != null && credential.displayNameIv != null) 
            i.displayName = EcAesCtr.decrypt(credential.displayName, secret, credential.iv);
        return i;
    };
    /**
     *  Converts an identity to a contact.
     *  
     *  @memberOf EcIdentity
     *  @method toContact
     *  @return {EcContact}
     *  			Contact object.
     */
    prototype.toContact = function() {
        var c = new EcContact();
        c.displayName = this.displayName;
        c.pk = this.ppk.toPk();
        c.source = this.source;
        return c;
    };
}, {ppk: "EcPpk"}, {});
/**
 *  Manages identities and contacts, provides hooks to respond to identity and
 *  contact events, and builds signatures and signature sheets for authorizing
 *  movement of data. Also provides helper functions for identity management and
 *  reads the users contacts on application start with a static constructor that
 *  pulls them out of any temporary storage
 * 
 *  @module com.eduworks.ec
 *  @class EcIdentityManager
 *  @static
 * 
 *  @author fritz.ray@eduworks.com
 */
var EcIdentityManager = function() {};
EcIdentityManager = stjs.extend(EcIdentityManager, null, [], function(constructor, prototype) {
    constructor.async = true;
    constructor.main = function(args) {
        EcIdentityManager.readContacts();
    };
    /**
     *  The current user's owned identities (keys+displayName)
     * 
     *  @property ids
     *  @type EcIdentity[]
     *  @static
     */
    constructor.ids = new Array();
    /**
     *  Contacts (Keys that we do not own)
     * 
     *  @property contacts
     *  @type EcContact[]
     *  @static
     */
    constructor.contacts = new Array();
    /**
     *  Identity change hook.
     * 
     *  @property onIdentityChanged
     *  @type Callback1<EcIdentity>
     *  @static
     */
    constructor.onIdentityChanged = null;
    /**
     *  Contacts change hook.
     * 
     *  @property onContactChanged
     *  @type Callback1<EcIdentity>
     *  @static
     */
    constructor.onContactChanged = null;
    /**
     *  Trigger for the onIdentityChanged hook
     * 
     *  @memberOf EcIdentityManager
     *  @method identityChanged
     *  @static
     *  @param {EcIdentity} identity Identity that has changed
     */
    constructor.identityChanged = function(identity) {
        if (EcIdentityManager.onIdentityChanged != null) {
            EcIdentityManager.onIdentityChanged(identity);
        }
    };
    /**
     *  Trigger for the onContactChanged hook
     * 
     *  @memberOf EcIdentityManager
     *  @method contactChanged
     *  @static
     *  @param {EcContact} contact Contact that has changed
     */
    constructor.contactChanged = function(contact) {
        if (EcIdentityManager.onContactChanged != null) {
            EcIdentityManager.onContactChanged(contact);
        }
        EcIdentityManager.saveContacts();
    };
    /**
     *  Reads contact data from localstorage.
     * 
     *  @memberOf EcIdentityManager
     *  @method readContacts
     *  @static
     */
    constructor.readContacts = function() {
        var localStore = localStorage["contacts"];
        if (localStore == null) {
            return;
        }
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
                if (EcIdentityManager.contacts[j].pk.toPem() == contact.pk.toPem()) {
                    cont = true;
                }
            }
            if (cont) {
                continue;
            }
            EcIdentityManager.contacts.push(contact);
        }
    };
    /**
     *  Writes contact data to localstorage.
     * 
     *  @memberOf EcIdentityManager
     *  @method saveContacts
     *  @static
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
     * 
     *  @memberOf EcIdentityManager
     *  @method readIdentities
     *  @static
     */
    constructor.readIdentities = function() {
        var localStore = localStorage["identities"];
        if (localStore == null) {
            return;
        }
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
                if (EcIdentityManager.ids[j].ppk.toPem() == identity.ppk.toPem()) {
                    cont = true;
                }
            }
            if (cont) {
                continue;
            }
            EcIdentityManager.ids.push(identity);
        }
    };
    /**
     *  Writes contact data to localstorage.
     * 
     *  @memberOf EcIdentityManager
     *  @method saveIdentities
     *  @static
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
    /**
     *  Clears contacts from the local storage
     * 
     *  @memberOf EcIdentityManager
     *  @method clearContacts
     *  @static
     */
    constructor.clearContacts = function() {
        delete localStorage["contacts"];
        EcIdentityManager.contacts = new Array();
    };
    /**
     *  Clears identities from the local storage
     * 
     *  @memberOf EcIdentityManager
     *  @method clearIdentities
     *  @static
     */
    constructor.clearIdentities = function() {
        delete localStorage["identities"];
        EcIdentityManager.ids = new Array();
    };
    /**
     *  Adds an identity to the identity manager. Checks for duplicates. Triggers
     *  events.
     * 
     *  @memberOf EcIdentityManager
     *  @method addIdentity
     *  @static
     *  @param {EcIdentity} identity Identity to add.
     */
    constructor.addIdentity = function(identity) {
        for (var i = 0; i < EcIdentityManager.ids.length; i++) {
            if (EcIdentityManager.ids[i].equals(identity)) {
                return;
            }
        }
        EcIdentityManager.ids.push(identity);
        EcIdentityManager.identityChanged(identity);
    };
    /**
     *  Adds an identity to the identity manager. Checks for duplicates. Does not trigger
     *  events.
     * 
     *  @memberOf EcIdentityManager
     *  @method addIdentityQuietly
     *  @static
     *  @param {EcIdentity} identity Identity to add.
     */
    constructor.addIdentityQuietly = function(identity) {
        for (var i = 0; i < EcIdentityManager.ids.length; i++) {
            if (EcIdentityManager.ids[i].equals(identity)) {
                return;
            }
        }
        EcIdentityManager.ids.push(identity);
    };
    /**
     *  Adds a contact to the identity manager. Checks for duplicates. Triggers
     *  events.
     * 
     *  @memberOf EcIdentityManager
     *  @method addContact
     *  @static
     *  @param {EcContact} contact Contact to add.
     */
    constructor.addContact = function(contact) {
        for (var i = 0; i < EcIdentityManager.ids.length; i++) {
            if (EcIdentityManager.ids[i].ppk.toPk().toPem().equals(contact.pk.toPem())) {
                EcIdentityManager.ids[i].displayName = contact.displayName;
                EcIdentityManager.identityChanged(EcIdentityManager.ids[i]);
            }
        }
        for (var i = 0; i < EcIdentityManager.contacts.length; i++) {
            if (EcIdentityManager.contacts[i].pk.toPem().equals(contact.pk.toPem())) {
                EcIdentityManager.contacts[i].displayName = contact.displayName;
                EcIdentityManager.contactChanged(EcIdentityManager.contacts[i]);
            }
        }
        for (var i = 0; i < EcIdentityManager.contacts.length; i++) {
            if (EcIdentityManager.contacts[i].equals(contact)) {
                return;
            }
        }
        EcIdentityManager.contacts.push(contact);
        EcIdentityManager.contactChanged(contact);
    };
    /**
     *  Adds a contact to the identity manager. Checks for duplicates. Does not trigger
     *  events.
     * 
     *  @memberOf EcIdentityManager
     *  @method addContactQuietly
     *  @static
     *  @param {EcContact} contact Contact to add.
     */
    constructor.addContactQuietly = function(contact) {
        for (var i = 0; i < EcIdentityManager.ids.length; i++) {
            if (EcIdentityManager.ids[i].ppk.toPk().toPem().equals(contact.pk.toPem())) {
                EcIdentityManager.ids[i].displayName = contact.displayName;
                EcIdentityManager.contactChanged(contact);
            }
        }
        for (var i = 0; i < EcIdentityManager.contacts.length; i++) {
            if (EcIdentityManager.contacts[i].pk.toPem().equals(contact.pk.toPem())) {
                EcIdentityManager.contacts[i].displayName = contact.displayName;
                EcIdentityManager.contactChanged(contact);
            }
        }
        for (var i = 0; i < EcIdentityManager.contacts.length; i++) {
            if (EcIdentityManager.contacts[i].equals(contact)) {
                return;
            }
        }
        EcIdentityManager.contacts.push(contact);
        EcIdentityManager.contactChanged(contact);
    };
    /**
     *  Create a signature sheet, authorizing movement of data outside of our
     *  control.
     * 
     *  @memberOf EcIdentityManager
     *  @method signatureSheetFor
     *  @static
     *  @param {String[]} identityPksinPem Which identities to create signatures
     *  for.
     *  @param {long} duration Length of time in milliseconds to authorize
     *  control.
     *  @param {String} server Server that we are authorizing.
     *  @return {String} JSON Array containing signatures.
     */
    constructor.signatureSheetFor = function(identityPksinPem, duration, server) {
        var signatures = new Array();
        for (var j = 0; j < EcIdentityManager.ids.length; j++) {
            var ppk = EcIdentityManager.ids[j].ppk;
            var pk = ppk.toPk();
            if (identityPksinPem != null) {
                for (var i = 0; i < identityPksinPem.length; i++) {
                    var ownerPpk = EcPk.fromPem(identityPksinPem[i].trim());
                    if (pk.equals(ownerPpk)) {
                        signatures.push(EcIdentityManager.createSignature(duration, server, ppk).atIfy());
                    }
                }
            }
        }
        return JSON.stringify(signatures);
    };
    /**
     *  Asynchronous version of creating a signature sheet for a list of
     *  identities
     * 
     *  @memberOf EcIdentityManager
     *  @method signatureSheetForAsync
     *  @static
     *  @param {String[]} identityPksinPem Which identities to create signatures
     *  for.
     *  @param {long} duration Length of time in milliseconds to authorize
     *  control.
     *  @param {String} server Server that we are authorizing.
     *  @param {Callback1<String>} success Callback triggered once the signature
     *  sheet has been created, returns the signature sheet
     */
    constructor.signatureSheetForAsync = function(identityPksinPem, duration, server, success) {
        var signatures = new Array();
        new EcAsyncHelper().each(EcIdentityManager.ids, function(p1, incrementalSuccess) {
            var ppk = p1.ppk;
            var pk = ppk.toPk();
            var found = false;
            if (identityPksinPem != null) {
                for (var j = 0; j < identityPksinPem.length; j++) {
                    var ownerPpk = EcPk.fromPem(identityPksinPem[j].trim());
                    if (pk.equals(ownerPpk)) {
                        found = true;
                        EcIdentityManager.createSignatureAsync(duration, server, ppk, function(p1) {
                            signatures.push(p1.atIfy());
                            incrementalSuccess();
                        });
                    }
                }
            }
            if (!found) {
                incrementalSuccess();
            }
        }, function(pks) {
            success(JSON.stringify(signatures));
        });
    };
    constructor.signatureSheetCaching = false;
    constructor.signatureSheetCache = new Object();
    /**
     *  Create a signature sheet for all identities, authorizing movement of data
     *  outside of our control.
     * 
     *  @memberOf EcIdentityManager
     *  @method signatureSheet
     *  @static
     *  @param {long} duration Length of time in milliseconds to authorize
     *  control.
     *  @param {String} server Server that we are authorizing.
     *  @return {String} JSON Array containing signatures.
     */
    constructor.signatureSheet = function(duration, server) {
        var cache = null;
        if (EcIdentityManager.signatureSheetCaching) {
            cache = (EcIdentityManager.signatureSheetCache)[server];
            if (cache != null) {
                if (cache[0] > new Date().getTime() + duration) {
                    return cache[1];
                }
            }
            duration += 20000;
        }
        var signatures = new Array();
        for (var j = 0; j < EcIdentityManager.ids.length; j++) {
            var ppk = EcIdentityManager.ids[j].ppk;
            signatures.push(EcIdentityManager.createSignature(duration, server, ppk).atIfy());
        }
        var stringified = JSON.stringify(signatures);
        if (EcIdentityManager.signatureSheetCaching) {
            cache = new Array();
            cache[0] = new Date().getTime() + duration;
            cache[1] = stringified;
            (EcIdentityManager.signatureSheetCache)[server] = cache;
        }
        return stringified;
    };
    /**
     *  Asynchronous version of creating a signature sheet for all identities
     * 
     *  @memberOf EcIdentityManager
     *  @method signatureSheetAsync
     *  @static
     *  @param {long} duration Length of time in milliseconds to authorize
     *  control.
     *  @param {String} server Server that we are authorizing.
     *  @param {Callback<String>} success Callback triggered once the signature
     *  sheet has been created, returns the signature sheet
     */
    constructor.signatureSheetAsync = function(duration, server, success) {
        if (!EcIdentityManager.async) {
            var sheet = EcIdentityManager.signatureSheet(duration, server);
            if (success != null) 
                success(sheet);
            return;
        }
        var signatures = new Array();
        var cache = null;
        if (EcIdentityManager.signatureSheetCaching) {
            cache = (EcIdentityManager.signatureSheetCache)[server];
            if (cache != null) {
                if (cache[0] > new Date().getTime() + duration) {
                    success(cache[1]);
                    return;
                }
            }
            duration += 20000;
        }
        var finalDuration = duration;
        new EcAsyncHelper().each(EcIdentityManager.ids, function(p1, incrementalSuccess) {
            var ppk = p1.ppk;
            EcIdentityManager.createSignatureAsync(finalDuration, server, ppk, function(p1) {
                signatures.push(p1.atIfy());
                incrementalSuccess();
            });
        }, function(pks) {
            var cache = null;
            var stringified = JSON.stringify(signatures);
            if (EcIdentityManager.signatureSheetCaching) {
                cache = new Array();
                cache[0] = new Date().getTime() + finalDuration;
                cache[1] = stringified;
                (EcIdentityManager.signatureSheetCache)[server] = cache;
            }
            success(stringified);
        });
    };
    /**
     *  Create a signature for a specific identity, authorizing movement of data
     *  outside of our control.
     * 
     *  @memberOf EcIdentityManager
     *  @method createSignature
     *  @static
     *  @param {long} duration Length of time in milliseconds to authorize
     *  control.
     *  @param {String} server Server that we are authorizing.
     *  @param {EcPpk} ppk Key of the identity to create a signature for
     *  @return {Ebac Signature} Signature created
     */
    constructor.createSignature = function(duration, server, ppk) {
        var s = new EbacSignature();
        s.owner = ppk.toPk().toPem();
        s.expiry = new Date().getTime() + duration;
        s.server = server;
        s.signature = EcRsaOaep.sign(ppk, s.toJson());
        return s;
    };
    /**
     *  Asynchronously create a signature for a specific identity
     * 
     *  @memberOf EcIdentityManager
     *  @method createSignatureAsync
     *  @static
     *  @param {long} duration Length of time in milliseconds to authorize
     *  control.
     *  @param {String} server Server that we are authorizing.
     *  @param {EcPpk} ppk Key of the identity to create a signature for
     *  @param success Callback triggered once the signature sheet has been
     *  created, returns the signature
     */
    constructor.createSignatureAsync = function(duration, server, ppk, success) {
        var s = new EbacSignature();
        s.owner = ppk.toPk().toPem();
        s.expiry = new Date().getTime() + duration;
        s.server = server;
        EcRsaOaepAsync.sign(ppk, s.toJson(), function(p1) {
            s.signature = p1;
            success(s);
        }, null);
    };
    /**
     *  Get PPK from PK (if we have it)
     * 
     *  @memberOf EcIdentityManager
     *  @method getPpk
     *  @static
     *  @param {EcPk} fromPem PK to use to look up PPK
     *  @return {EcPpk} PPK or null.
     */
    constructor.getPpk = function(fromPem) {
        var pem = fromPem.toPem();
        for (var i = 0; i < EcIdentityManager.ids.length; i++) {
            if (pem.equals(EcIdentityManager.ids[i].ppk.toPk().toPem())) {
                return EcIdentityManager.ids[i].ppk;
            }
        }
        return null;
    };
    /**
     *  Get Contact from PK (if we have it)
     * 
     *  @memberOf EcIdentityManager
     *  @method getContact
     *  @static
     *  @param {EcPk} pk PK to use to look up PPK
     *  @return {EcPpk} PPK or null.
     */
    constructor.getContact = function(pk) {
        for (var i = 0; i < EcIdentityManager.contacts.length; i++) {
            if (pk.equals(EcIdentityManager.contacts[i].pk)) {
                return EcIdentityManager.contacts[i];
            }
        }
        return null;
    };
    /**
     *  Get Identity from PK (if we have it)
     * 
     *  @memberOf EcIdentityManager
     *  @method getIdentity
     *  @static
     *  @param {EcPk} pk PK to use to look up PPK
     *  @return {EcIdentity} identity or null.
     */
    constructor.getIdentity = function(pk) {
        for (var i = 0; i < EcIdentityManager.ids.length; i++) {
            if (pk.equals(EcIdentityManager.ids[i].ppk.toPk())) {
                return EcIdentityManager.ids[i];
            }
        }
        return null;
    };
    /**
     *  Sign a piece of data with all available keys that own that data.
     * 
     *  @memberOf EcIdentityManager
     *  @method sign
     *  @static
     *  @param {EcRemoteLinkedData} d Data to sign.
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
                if (!works) {
                    d.signature.splice(i);
                } else {
                    i++;
                }
            }
        }
        if (d.owner != null) {
            for (var i = 0; i < d.owner.length; i++) {
                var attempt = EcIdentityManager.getPpk(EcPk.fromPem(d.owner[i]));
                if (attempt != null) {
                    d.signWith(attempt);
                }
            }
        }
        if (d.signature != null && d.signature.length == 0) {
            delete (d)["signature"];
        }
    };
    constructor.myIdentitiesSearchString = function() {
        var searchString = "";
        for (var i = 0; i < EcIdentityManager.ids.length; i++) {
            if (i > 0) {
                searchString += " OR ";
            }
            searchString += "@reader:\"" + EcIdentityManager.ids[i].ppk.toPk().toPem() + "\"";
            searchString += " OR ";
            searchString += "@owner:\"" + EcIdentityManager.ids[i].ppk.toPk().toPem() + "\"";
        }
        return searchString;
    };
}, {ids: {name: "Array", arguments: ["EcIdentity"]}, contacts: {name: "Array", arguments: ["EcContact"]}, onIdentityChanged: {name: "Callback1", arguments: ["EcIdentity"]}, onContactChanged: {name: "Callback1", arguments: ["EcContact"]}, signatureSheetCache: "Object"}, {});
if (!stjs.mainCallDisabled) 
    EcIdentityManager.main();
/**
 *  Created by fray on 5/9/17.
 */
var OAuth2FileBasedRemoteIdentityManager = /**
 *  Reads the remote OAuth2 endpoint file.
 *  @memberOf OAuth2FileBasedRemoteIdentityManager
 *  @constructor
 *  @param {Callback0} Method to call when initialization is complete.
 */
function(initialized) {
    var me = this;
    EcRemote.getExpectingObject("", "hello.json", function(o) {
        try {
            me.configuration = JSON.parse(JSON.stringify(o));
            hello.init(o);
            me.constructor.oauthEnabled = true;
            initialized();
        }catch (ex) {
            me.constructor.oauthEnabled = false;
        }
    }, function(s) {
        me.constructor.oauthEnabled = false;
    });
};
OAuth2FileBasedRemoteIdentityManager = stjs.extend(OAuth2FileBasedRemoteIdentityManager, null, [RemoteIdentityManagerInterface], function(constructor, prototype) {
    constructor.oauthEnabled = false;
    prototype.server = null;
    prototype.configuration = null;
    prototype.oauthLoginResponse = null;
    prototype.network = null;
    prototype.global = null;
    /**
     *  Returns true if the identity manager is global. Returns false if the identity manager is local to the server.
     *  @memberOf OAuth2FileBasedRemoteIdentityManager
     *  @method isGlobal
     *  @return {Boolean} true if the identity manager is global.
     */
    prototype.isGlobal = function() {
        if (this.global == null) 
            return true;
        return this.global;
    };
    prototype.configure = function(usernameSalt, usernameIterations, usernameWidth, passwordSalt, passwordIterations, passwordWidth, secretSalt, secretIterations) {};
    prototype.configureFromServer = function(success, failure) {
        success(null);
    };
    /**
     *  Wipes login data and logs you out.
     * 
     *  @memberOf OAuth2FileBasedRemoteIdentityManager
     *  @method clear
     */
    prototype.clear = function() {
        OAuth2FileBasedRemoteIdentityManager.oauthEnabled = false;
        if (this.server != null) 
            hello.logout(this.server, null);
    };
    /**
     *  Configure compatible remote identity management server.
     * 
     *  @memberOf OAuth2FileBasedRemoteIdentityManager
     *  @method setDefaultIdentityManagementServer
     *  @param {String} server
     *             Name of the remote identity management server.
     */
    prototype.setDefaultIdentityManagementServer = function(server) {
        this.server = server;
    };
    prototype.startLogin = function(username, password) {};
    prototype.changePassword = function(username, oldPassword, newPassword) {
        return false;
    };
    /**
     *  Fetch credentials from server, invoking events based on login success or
     *  failure.
     * 
     *  Automatically populates EcIdentityManager.
     * 
     *  Does not require startLogin().
     * 
     *  @memberOf OAuth2FileBasedRemoteIdentityManager
     *  @method fetch
     *  @param {Callback1<Object>} success
     *  @param {Callback1<String>} failure
     */
    prototype.fetch = function(success, failure) {
        var o = new Object();
        (o)["scope"] = (this.configuration)[this.server + "Scope"];
        var me = this;
        hello.on("auth.login", function(o) {
            me.oauthLoginResponse = o;
            me.network = (me.oauthLoginResponse)["network"];
            hello.api(me.network + "/me/folders", "get", new Object()).then(function(folderResponse) {
                var folders = (folderResponse)["data"];
                var foundIdentities = false;
                var foundContacts = false;
                for (var i = 0; i < folders.length; i++) {
                    var d = folders[i];
                    var name = (d)["name"];
                    var id = (d)["id"];
                    if (name == "CASS Identities") {
                        foundIdentities = true;
                        me.hookIdentityManagerIdentities(id);
                        me.readIdentityFiles(id, success, failure);
                    }
                    if (name == "CASS Contacts") {
                        foundContacts = true;
                        me.hookIdentityManagerContacts(id);
                        me.readContactFiles(id, success, failure);
                    }
                }
                if (!foundIdentities) {
                    me.createIdentityFolder(success);
                }
                if (!foundContacts) {
                    me.createContactFolder();
                }
            }).fail(failure);
        });
        hello.login(this.server, o).fail(failure);
    };
    prototype.createContactFolder = function() {
        var me = this;
        var o = new Object();
        (o)["name"] = "CASS Contacts";
        hello.api(me.network + "/me/folders", "post", o).then(function(r) {
            me.hookIdentityManagerContacts((r)["id"]);
        });
    };
    prototype.createIdentityFolder = function(success) {
        var me = this;
        var o = new Object();
        (o)["name"] = "CASS Identities";
        hello.api(me.network + "/me/folders", "post", o).then(function(r) {
            me.hookIdentityManagerIdentities((r)["id"]);
            success(r);
        });
    };
    prototype.writeIdentityFiles = function(folderId, success) {
        var me = this;
        var helper = new EcAsyncHelper();
        helper.each(EcIdentityManager.ids, function(identity, callback0) {
            me.writeIdentityFile(folderId, identity, callback0);
        }, function(strings) {
            success(strings);
        });
    };
    prototype.writeIdentityFile = function(folderId, identity, finished) {
        var file = stringToFile(identity.ppk.toPem(), identity.displayName + ".pem", "text/plain");
        var o = new Object();
        (o)["id"] = (identity)["id"];
        if ((o)["id"] == undefined) 
            (o)["parent"] = folderId;
        (o)["name"] = file.name;
        var files = new Array();
        files.push(file);
        (o)["file"] = files;
        hello.api(this.network + "/me/files", (identity)["id"] == undefined ? "post" : "put", o).then(function(r) {
            (identity)["id"] = (r)["id"];
            if (finished != null) 
                finished();
        });
    };
    prototype.writeContactFiles = function(folderId) {
        for (var i = 0; i < EcIdentityManager.contacts.length; i++) {
            this.writeContactFile(folderId, EcIdentityManager.contacts[i]);
        }
    };
    prototype.writeContactFile = function(folderId, contact) {
        var file = stringToFile(contact.pk.toPem(), contact.displayName + ".pem", "text/plain");
        var o = new Object();
        (o)["id"] = (contact)["id"];
        if ((o)["id"] == undefined) 
            (o)["parent"] = folderId;
        (o)["name"] = file.name;
        var files = new Array();
        files.push(file);
        (o)["file"] = files;
        hello.api(this.network + "/me/files", (contact)["id"] == undefined ? "post" : "put", o).then(function(r) {
            (contact)["id"] = (r)["id"];
        });
    };
    prototype.readIdentityFiles = function(folderId, success, failure) {
        var me = this;
        var o = new Object();
        (o)["parent"] = folderId;
        hello.api(this.network + "/me/files", "get", o).then(function(folderResponse) {
            var files = (folderResponse)["data"];
            var h = new EcAsyncHelper();
            h.each(files, function(d, callback0) {
                var name = ((d)["name"]).replace("\\.pem", "");
                var id = (d)["id"];
                var directLink = (d)["downloadUrl"];
                EcRemote.getExpectingString("", directLink + "&access_token=" + (hello.getAuthResponse(me.network))["access_token"], function(s) {
                    var identity = new EcIdentity();
                    identity.displayName = name.replace(".pem", "");
                    identity.ppk = EcPpk.fromPem(s);
                    identity.source = "google";
                    (identity)["id"] = id;
                    EcIdentityManager.addIdentityQuietly(identity);
                    callback0();
                }, failure);
            }, function(strings) {
                success(null);
            });
        });
    };
    prototype.readContactFiles = function(folderId, success, failure) {
        var me = this;
        var o = new Object();
        (o)["parent"] = folderId;
        hello.api(this.network + "/me/files", "get", o).then(function(folderResponse) {
            var files = (folderResponse)["data"];
            var h = new EcAsyncHelper();
            h.each(files, function(d, callback0) {
                var name = ((d)["name"]).replace("\\.pem", "");
                var id = (d)["id"];
                var directLink = (d)["downloadUrl"];
                EcRemote.getExpectingString("", directLink + "&access_token=" + (hello.getAuthResponse(me.network))["access_token"], function(s) {
                    var contact = new EcContact();
                    contact.displayName = name.replace(".pem", "");
                    contact.pk = EcPk.fromPem(s);
                    contact.source = "google";
                    (contact)["id"] = id;
                    EcIdentityManager.addContactQuietly(contact);
                    callback0();
                }, failure);
            }, function(strings) {
                success(null);
            });
        });
    };
    prototype.hookIdentityManagerIdentities = function(folderId) {
        var me = this;
        EcIdentityManager.onIdentityChanged = function(identity) {
            me.writeIdentityFile(folderId, identity, null);
        };
    };
    prototype.hookIdentityManagerContacts = function(folderId) {
        var me = this;
        EcIdentityManager.onContactChanged = function(contact) {
            me.writeContactFile(folderId, contact);
        };
    };
    /**
     *  Commits credentials in EcIdentityManager to remote server.
     * 
     *  @memberOf OAuth2FileBasedRemoteIdentityManager
     *  @method commit
     *  @param {Callback1<String>} success
     *  @param {Callback1<String>} failure
     *  @param padGenerationCallback
     */
    prototype.commit = function(success, failure, padGenerationCallback) {
        var me = this;
        var apio = new Object();
        (apio)["network"] = this.network;
        if (hello.getAuthResponse(this.server)) 
            hello.api(me.network + "/me/folders", "get", apio).then(function(folderResponse) {
                var folders = (folderResponse)["data"];
                for (var i = 0; i < folders.length; i++) {
                    var d = folders[i];
                    var name = (d)["name"];
                    var id = (d)["id"];
                    if (name == "CASS Identities") {
                        me.writeIdentityFiles(id, success);
                    }
                    if (name == "CASS Contacts") {
                        me.writeContactFiles(id);
                    }
                }
            }).fail(failure);
         else 
            failure("Please login again.");
    };
    prototype.create = function(success, failure, padGenerationCallback) {
        var o = new Object();
        (o)["scope"] = (this.configuration)[this.server + "Scope"];
        var me = this;
        hello.on("auth.login", function(o) {
            me.oauthLoginResponse = o;
            me.network = (me.oauthLoginResponse)["network"];
            hello.api(me.network + "/me/folders", "get", new Object()).then(function(folderResponse) {
                var folders = (folderResponse)["data"];
                var foundIdentities = false;
                var foundContacts = false;
                for (var i = 0; i < folders.length; i++) {
                    var d = folders[i];
                    var name = (d)["name"];
                    var id = (d)["id"];
                    if (name == "CASS Identities") {
                        foundIdentities = true;
                        me.hookIdentityManagerIdentities(id);
                        me.readIdentityFiles(id, success, failure);
                    }
                    if (name == "CASS Contacts") {
                        foundContacts = true;
                        me.hookIdentityManagerContacts(id);
                        me.readContactFiles(id, success, failure);
                    }
                }
                if (!foundIdentities) {
                    me.createIdentityFolder(success);
                }
                if (!foundContacts) {
                    me.createContactFolder();
                }
            }).fail(failure);
        });
        hello.login(this.server, o).fail(failure);
    };
}, {configuration: "Object", oauthLoginResponse: "Object"}, {});
/**
 *  Contact Grant that is used to share your public key with another user
 *  
 *  @module com.eduworks.ec
 *  @class EcContact
 *  @extends EbacContactGrant
 *  @constructor
 *  
 *  @author fritz.ray@eduworks.com
 *  @author devlin.junker@eduworks.com
 */
var EcContactGrant = function() {
    EbacContactGrant.call(this);
};
EcContactGrant = stjs.extend(EcContactGrant, EbacContactGrant, [], function(constructor, prototype) {
    /**
     *  Verifies that the contact grant is valid
     *  
     *  @return {boolean}
     *  		true if valid, false if not
     */
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
}, {owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
 *  @module com.eduworks.ec
 *  @class EcRemoteIdentityManager
 *  
 *  @author fritz.ray@eduworks.com
 */
var EcRemoteIdentityManager = function() {};
EcRemoteIdentityManager = stjs.extend(EcRemoteIdentityManager, null, [RemoteIdentityManagerInterface], function(constructor, prototype) {
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
    prototype.global = null;
    /**
     *  Returns true if the identity manager is global. Returns false if the identity manager is local to the server.
     *  @memberOf EcRemoteIdentityManager
     *  @return {Boolean} true if the identity manager is global.
     */
    prototype.isGlobal = function() {
        if (this.global == null) 
            return false;
        return this.global;
    };
    /**
     *  Configure parameters of the remote login storage.
     *  
     *  @memberOf EcRemoteIdentityManager
     *  @method configure
     *  @param {String} usernameSalt
     *             Salt used in hashing the username.
     *  @param {int} usernameIterations
     *             Number of times to hash the username.
     *  @param {int} usernameWidth
     *             Resultant width of username in bytes.
     *  @param {String} passwordSalt
     *             Salt used to hash password.
     *  @param {int} passwordIterations
     *             Number of times to hash password.
     *  @param {int} passwordWidth
     *             Resultant width of password in bytes.
     *  @param {String} secretSalt
     *             Salt used to hash secret (composed of username + password)
     *  @param {int} secretIterations
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
    /**
     *  Configures parameters of the remote server by accessing configuration details via webservice
     *  
     *  @memberOf EcRemoteIdentityManager
     *  @method configureFromServer
     *  @param {Callback1<Object>} success
     *  			Callback triggered after successfully configured
     *  @param {Callback1<String>} failure
     *  			Callback triggered if an error during failure
     */
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
            if (success != null) 
                success(p1);
        }, function(p1) {
            me.configured = false;
            if (failure != null) 
                failure(p1);
             else 
                console.error(p1);
        });
    };
    /**
     *  Wipes login data.
     *  
     *  @memberOf EcRemoteIdentityManager
     *  @method clear
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
     *  @memberOf EcRemoteIdentityManager
     *  @method setDefaultIdentityManagementServer
     *  @param {String} server
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
     *  @memberOf EcRemoteIdentityManager
     *  @method startLogin
     *  @param {String} username
     *           Username to login with
     *  @param {String} password
     *           Password to authenticate username with
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
     *  @memberOf EcRemoteIdentityManager
     *  @method changePassword
     *  @param {String} username
     *           Username
     *  @param {String} oldPassword
     *           Current password
     *  @param {String} newPassword
     *           Desired password
     *  @return {boolean}
     *  			Valid password change request.
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
     *  @memberOf EcRemoteIdentityManager
     *  @method fetch
     *  @param {Callback1<Object>} success
     *  @param {Callback1<String>} failure
     */
    prototype.fetch = function(success, failure) {
        if (!this.configured) {
            failure("Remote Identity not configured.");
            return;
        }
        if (this.usernameWithSalt == null || this.passwordWithSalt == null || this.secretWithSalt == null) {
            failure("Please log in before performing this operation.");
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
     *  @memberOf EcRemoteIdentityManager
     *  @method commit
     *  @param {Callback1<String>} success
     *  @param {Callback1<String>} failure
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
     *  @memberOf EcRemoteIdentityManager
     *  @method create
     *  @param {Callback1<String>} success
     *  			Callback triggered after successfully creating an account
     *  @param {Callback1<String>} failure
     *  			Callback triggered if error creating an account
     *  @param padGenerationCallback
     *  			Callback triggered if pad not specified
     */
    prototype.create = function(success, failure, padGenerationCallback) {
        var service = "sky/id/create";
        this.sendCredentials(success, failure, padGenerationCallback, service);
    };
    /**
     *  Sends the identity managers credentials to the service specified
     *  
     *  @memberOf EcRemoteIdentityManager
     *  @method sendCredentials
     *  @param {Callback1<String>} success
     *  			Callback triggered if credentials sent successfully
     *  @param {Callback1<String>} failure
     *  			Callback triggered if error sending credentials
     *  @param padGenerationCallback
     *  			Callback triggered if pad needed
     *  @param service
     *  			Service to send credentials to on server
     */
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
            this.pad = padGenerationCallback();
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
        var me = this;
        EcIdentityManager.signatureSheetAsync(60000, this.server, function(p1) {
            fd.append("signatureSheet", p1);
            EcRemote.postExpectingString(me.server, service, fd, function(arg0) {
                success(arg0);
            }, function(arg0) {
                failure(arg0);
            });
        });
    };
    /**
     *  Splices together passwords (in a fashion more like shuffling a deck of
     *  cards, not appending).
     *  
     *  @memberOf EcRemoteIdentityManager
     *  @method splicePasswords
     *  @param {String[]} passwords
     *           Passwords to splice.
     *  @return {String}  
     *  			Spliced password.
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
}, {}, {});
