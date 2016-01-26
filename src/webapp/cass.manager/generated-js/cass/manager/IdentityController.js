var IdentityController = function() {};
IdentityController = stjs.extend(IdentityController, null, [], function(constructor, prototype) {
    prototype.selectedIdentity = null;
    prototype.select = function(ppkPem) {
        var clickedPpk = EcPpk.fromPem(ppkPem);
        for (var i = 0; i < EcIdentityManager.ids.length; i++) 
            if (EcIdentityManager.ids[i].ppk.equals(clickedPpk)) 
                this.selectedIdentity = EcIdentityManager.ids[i];
    };
    prototype.lookup = function(pkPem) {
        var candidatePk = EcPk.fromPem(pkPem);
        for (var i = 0; i < EcIdentityManager.contacts.length; i++) 
            if (EcIdentityManager.contacts[i].pk.equals(candidatePk)) 
                return EcIdentityManager.contacts[i];
        var newContact = new EcContact();
        newContact.pk = candidatePk;
        EcIdentityManager.contacts.push(newContact);
        return newContact;
    };
    prototype.addKey = function(ppk, displayName) {
        var ident = new EcIdentity();
        ident.ppk = EcPpk.fromPem(ppk);
        ident.displayName = displayName;
        EcIdentityManager.addIdentity(ident);
        refreshContacts(EcIdentityManager.contacts);
        refreshIdentities(EcIdentityManager.ids);
    };
    prototype.generateIdentity = function() {
        EcPpk.generateKeyAsync(function(p1) {
            var ident = new EcIdentity();
            ident.ppk = p1;
            EcIdentityManager.addIdentity(ident);
            refreshContacts(EcIdentityManager.contacts);
            refreshIdentities(EcIdentityManager.ids);
            identityGenerated(ident);
        });
    };
}, {selectedIdentity: "EcIdentity"}, {});
