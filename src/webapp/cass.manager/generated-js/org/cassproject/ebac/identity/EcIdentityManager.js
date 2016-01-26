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
    constructor.onIdentityAdded = null;
    constructor.onContactAdded = null;
    constructor.identityAdded = function(identity) {
        if (EcIdentityManager.onIdentityAdded != null) 
            EcIdentityManager.onIdentityAdded(identity);
    };
    constructor.contactAdded = function(contact) {
        if (EcIdentityManager.onContactAdded != null) 
            EcIdentityManager.onContactAdded(contact);
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
            var o = new Object();
            var props = (o);
            contact.displayName = props["displayName"];
            contact.pk = EcPk.fromPem(props["ok"]);
            contact.source = props["source"];
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
        localStorage["contacts"] = c;
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
        EcIdentityManager.identityAdded(identity);
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
            if (EcIdentityManager.contacts[i].equals(contact)) 
                return;
        EcIdentityManager.contacts.push(contact);
        EcIdentityManager.contactAdded(contact);
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
            var ourPem = ppk.toPk().toPem();
            if (identityPksinPem != null) 
                for (var i = 0; i < identityPksinPem.length; i++) {
                    var ownerPem = identityPksinPem[i];
                    if (ourPem.equals(ownerPem)) {
                        signatures.push(EcIdentityManager.createSignature(duration, server, crypto, ppk).atIfy());
                    }
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
}, {ids: {name: "Array", arguments: ["EcIdentity"]}, contacts: {name: "Array", arguments: ["EcContact"]}, onIdentityAdded: {name: "Callback1", arguments: ["EcIdentity"]}, onContactAdded: {name: "Callback1", arguments: ["EcContact"]}}, {});
if (!stjs.mainCallDisabled) 
    EcIdentityManager.main();
