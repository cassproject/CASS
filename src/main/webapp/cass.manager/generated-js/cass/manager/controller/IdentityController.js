/**
 *  Manages the current selected identity for the user, and interfaces 
 *  the EBAC Identity Manager library to provide helper functions for 
 *  ownership and key identification
 *  
 *  @module cass.manager
 *  @class IdentityController
 *  @constructor
 *  
 *  @author devlin.junker@eduworks.com
 */
var IdentityController = function() {
    EcIdentityManager.clearContacts();
};
IdentityController = stjs.extend(IdentityController, null, [], function(constructor, prototype) {
    prototype.selectedIdentity = null;
    /**
     *  Sets the currently selected identity to the ppk specified, only works if the ppk is in the 
     *  list of identities that the user owns
     *  
     *  @method select
     *  @param {String} ppkPem
     *  			PEM of the identity that will be set to the current identity
     */
    prototype.select = function(ppkPem) {
        var clickedPpk = EcPpk.fromPem(ppkPem);
        for (var i = 0; i < EcIdentityManager.ids.length; i++) 
            if (EcIdentityManager.ids[i].ppk.equals(clickedPpk)) 
                this.selectedIdentity = EcIdentityManager.ids[i];
    };
    /**
     *  Clears the selected identity, so the user will be identified as public for any actions
     *  that they make going forward
     *  
     *  @method unselect
     */
    prototype.unselect = function() {
        this.selectedIdentity = null;
    };
    constructor.unknownContact = new EcContact();
    /**
     *  Returns the contact that is associated with the PEM given, looks at both the user's
     *  identities and contacts to match the PEM. The Contact returned will contain the display
     *  name that the user set for the PEM
     * 
     *  @method lookup
     *  @param {String} pkPem 
     *  			PEM of the contact to lookup
     *  @return Contact that contains the displayName and public key, if the user
     *  			does not have a display name stored for the PEM in either their contacts or identities,
     *  			will return the Unknown Contact which contains the key and a display name of "Unknown"
     */
    prototype.lookup = function(pkPem) {
        var candidatePk = EcPk.fromPem(pkPem);
        for (var i = 0; i < EcIdentityManager.ids.length; i++) {
            if (EcIdentityManager.ids[i].ppk.toPk().equals(candidatePk)) {
                var newContact = new EcContact();
                newContact.pk = candidatePk;
                newContact.displayName = EcIdentityManager.ids[i].displayName;
                return newContact;
            }
        }
        for (var i = 0; i < EcIdentityManager.contacts.length; i++) 
            if (EcIdentityManager.contacts[i].pk.equals(candidatePk)) 
                return EcIdentityManager.contacts[i];
        IdentityController.unknownContact.pk = candidatePk;
        IdentityController.unknownContact.displayName = "Unknown";
        return IdentityController.unknownContact;
    };
    /**
     *  Adds a Key to the list of user identities managed by the EcIdentityManager
     *  
     *  @method addKey
     *  @param {String} ppk
     *  			PEM representation of PPK Key to save to user identities
     *  @param {String} displayName 
     *  			Name to associate with the key to be saved, to identify it
     *  @param {Callback0} success
     *  			Callback function once the key has been added
     */
    prototype.addKey = function(ppk, displayName, success) {
        var ident = new EcIdentity();
        ident.ppk = EcPpk.fromPem(ppk);
        ident.displayName = displayName;
        EcIdentityManager.addIdentity(ident);
        if (success != null) 
            success();
    };
    /**
     *  Adds a contact to the list of user's contacts managed by EcIdentityManager
     *  
     *  @method addContact
     *  @param {String} pk
     *  			PEM representation of PK Key to save user contact
     *  @param {String} displayName
     *  			Name to associate with the key to be saved, to identify it
     *  @param {Callback0} success
     *  			Callback function once the contact has been added
     */
    prototype.addContact = function(pk, displayName, success) {
        var contact = new EcContact();
        contact.pk = EcPk.fromPem(pk);
        contact.displayName = displayName;
        EcIdentityManager.addContact(contact);
        if (success != null) 
            success();
    };
    /**
     *  Generates a new Encryption Key to save to the identity manager list
     *  
     *  @method generateIdentity
     *  @param {Callback1<EcIdentity>} success
     *  			callback, once they key has been generated and added to the identity manager
     *  @param {String} displayName
     *  			display name for the key that is being generated to identify it
     */
    prototype.generateIdentity = function(success, displayName) {
        EcPpk.generateKeyAsync(function(p1) {
            var ident = new EcIdentity();
            ident.ppk = p1;
            if (displayName != null && displayName != "") 
                ident.displayName = displayName;
            EcIdentityManager.addIdentity(ident);
            if (success != null) 
                success(ident);
        });
    };
    /**
     *  Helper function to determine if the logged in user owns a piece of data from the repository,
     *  useful for showing certain actions
     *  
     *  @method owns
     *  @param {EcRemoteLiinkedData} data 
     *  			The object to check for ownership of
     *  @return {boolean} true if owned, false if not owned by the current user
     */
    prototype.owns = function(data) {
        if ((data)["hasOwner"] != null) 
            for (var i = 0; i < EcIdentityManager.ids.length; i++) {
                if (data.hasOwner(EcIdentityManager.ids[i].ppk.toPk())) {
                    return true;
                }
            }
        return false;
    };
    /**
     *  Helper function to determine if the logged in user can modify a piece of data, this means 
     *  that they either own the data, or it is public
     *  
     *  @method canEdit
     *  @param {EcRemoteLinkedData} data
     *  			The object to check for ability to edit
     *  @return {boolean} true if editable, false if not
     */
    prototype.canEdit = function(data) {
        if (data.owner == null || data.owner.length == 0) 
            return true;
        for (var i = 0; i < EcIdentityManager.ids.length; i++) {
            if (data.canEdit(EcIdentityManager.ids[i].ppk.toPk())) {
                return true;
            }
        }
        return false;
    };
    /**
     *  Helper function to determine if the current user is associated with the key passed in
     *  
     *  @method isCurrentUser
     *  @param {String} pk
     *  			PEM representation of pk to check
     *  @return {boolean} true if the current logged in user is associated with the key
     */
    prototype.isCurrentUser = function(pk) {
        for (var i = 0; i < EcIdentityManager.ids.length; i++) {
            if (EcIdentityManager.ids[i].ppk.toPk().toString() == pk) {
                return true;
            }
        }
        return false;
    };
}, {selectedIdentity: "EcIdentity", unknownContact: "EcContact"}, {});
