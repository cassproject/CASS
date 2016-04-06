var commitTimeout = null;
EcIdentityManager.onContactChanged = function (contact) {
    if (commitTimeout != null)
        clearTimeout(commitTimeout);
    commitTimeout = setTimeout(function () {
        commitTimeout = null;
        loginServer.commit(function(){},silent);
        populateContacts();
    }, 5000);
}

var contactsContact = $(".contactsContact").outerHTML();

function populateContacts() {
    $("#contactsList").html("");
    for (var i = 0; i < EcIdentityManager.contacts.length; i++) {
        var contact = EcIdentityManager.contacts[i];
        var ui = $("#contactsList").append(contactsContact).children().last();
        if (identity != null && identity.ppk.toPk().equals(contact.pk))
        ui.find("#identity").attr("title", contact.pk.toPem()).text("(You) "+contact.displayName);
        else
        ui.find("#identity").attr("title", contact.pk.toPem()).text(contact.displayName);
    }
}

function updateContact(me) {
    var pk = EcPk.fromPem($(me).attr("title"));
    var displayName = $(me).text();
    var contact = null;
    if (EcIdentityManager.getContact(pk) != null) {
        contact = EcIdentityManager.getContact(pk);
        contact.displayName = displayName;
        EcIdentityManager.contactChanged(contact);
    } else {
        contact = new EcContact();
        contact.pk = pk;
        contact.displayName = displayName;
        EcIdentityManager.addContact(contact);
    }
}
