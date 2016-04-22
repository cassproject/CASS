/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

var commitTimeout = null;
EcIdentityManager.onContactChanged = function (contact) {
    if (commitTimeout != null)
        clearTimeout(commitTimeout);
    commitTimeout = setTimeout(function () {
        commitTimeout = null;
        if (identity == null) return;
        loginServer.commit(function () {}, silent);
        populateContacts();
    }, 1000);
}
EcIdentityManager.onIdentityChanged = function (identity) {
    if (commitTimeout != null)
        clearTimeout(commitTimeout);
    commitTimeout = setTimeout(function () {
        commitTimeout = null;
        if (identity == null) return;
        loginServer.commit(function () {}, silent);
        populateContacts();
    }, 1000);
}

var contactsContact = $(".contactsContact").outerHTML();

function populateContacts() {
    populateContactsActual();
    actionAddContactCheck();
}

function loopPopulateContacts() {
    populateContacts();
    setTimeout(function () {
        loopPopulateContacts()
    }, 60000);
}

function populateContactsActual() {
    $("#contactsList").html("");
    for (var i = 0; i < EcIdentityManager.ids.length; i++) {
        var identity = EcIdentityManager.ids[i];
        var ui = $("#contactsList").append(contactsContact).children().last();
        ui.find("a").hide();
        ui.find("#identity").attr("title", identity.ppk.toPk().toPem()).text("(You) " + identity.displayName);
    }
    if (EcIdentityManager.contacts !== undefined && EcIdentityManager.contacts.length != 0)
    for (var i = 0; i < EcIdentityManager.contacts.length; i++) {
        var contact = EcIdentityManager.contacts[i];

        if (EcIdentityManager.getPpk(contact.pk) == null) {
            var ui = $("#contactsList").append(contactsContact).children().last();
            ui.find("#identity").attr("title", contact.pk.toPem()).text(contact.displayName);
        }
    }
    else
    {
        $("#contactsList").html("No contacts. Please log in and invite people to connect with you.");
    }
}

function updateContact(me) {
    var pk = EcPk.fromPem($(me).attr("title"));
    var displayName = $(me).text();
    var contact = null;
    var found = false;
    for (var i = 0; i < EcIdentityManager.ids.length; i++) {
        if (pk.equals(EcIdentityManager.ids[i].ppk.toPk())) {
            found = true;
            contact = EcIdentityManager.ids[i];
            contact.displayName = displayName.replace("(You) ", "");
            EcIdentityManager.identityChanged(contact);
        }
    }
    if (!found)
        for (var i = 0; i < EcIdentityManager.contacts.length; i++) {
            if (pk.equals(EcIdentityManager.contacts[i].pk)) {
                found = true;
                contact = EcIdentityManager.contacts[i];
                contact.displayName = displayName.replace("(You) ", "");
                EcIdentityManager.contactChanged(contact);
            }
        }
    if (!found) {
        contact = new EcContact();
        contact.pk = pk;
        contact.displayName = displayName;
        EcIdentityManager.addContact(contact);
    }
}

function removeContact(me) {
    if (confirm("This will delete the contact. Continue?")) {
        var pk = EcPk.fromPem($(me).parents(".contact").find("#identity").attr("title"));
        for (var i = 0; i < EcIdentityManager.contacts.length; i++) {
            if (pk.equals(EcIdentityManager.contacts[i].pk)) {
                EcIdentityManager.contacts.splice(i, 1);
                EcIdentityManager.contactChanged(EcIdentityManager.contacts[i]);
                populateContactsActual();
            }
        }
    }
}

function getShareString() {
    var input = window.prompt("What name would you like the recipient to know you by?", identity.displayName);
    if (input == null) return;
    var string = "Hi, I would like to add you as a contact in CASS.\n\nIf we are using the same CASS system, you may click the following link. If not, change the URL of my CASS server (" + window.location.href.split('/')[2] + ") to yours.\n\n"

    var iv = EcAes.newIv(32);
    string += window.location + "?action=newContact&contactDisplayName=" + encodeURIComponent(input) + "&contactKey=" + encodeURIComponent(identity.ppk.toPk().toPem()) + "&contactServer=" + encodeURIComponent(repo.selectedServer) + "&responseToken=" + encodeURIComponent(iv) + "&responseSignature=" + encodeURIComponent(EcRsaOaep.sign(identity.ppk, iv));

    copyTextToClipboard(string);
    alert("The invitation has been copied to your clipboard.");
}

function actionAddContactCheck() {
    if (QueryString.action == "newContact" && identity != null) {
        var c = new EcContact();
        c.displayName = QueryString.contactDisplayName;
        c.pk = EcPk.fromPem(QueryString.contactKey);
        c.source = QueryString.contactServer;
        if (EcIdentityManager.getContact(c.pk) != null) {
            window.location = window.location.href.split('?')[0];
            return;
        }
        EcIdentityManager.addContact(c);
        if (window.confirm("Contact added. Would you like to reply with your contact info?")) {
            var grant = new EcContactGrant();
            grant.addOwner(c.pk);
            grant.addOwner(identity.ppk.toPk());
            grant.generateId(c.source);
            grant.source = loginServer.server;
            var displayName = window.prompt("How would you like to identify yourself to them?", identity.displayName);
            if (displayName != null) {
                grant.displayName = displayName;
                grant.pk = identity.ppk.toPk().toPem();
                grant.responseToken = QueryString.responseToken;
                grant.responseSignature = QueryString.responseSignature;
                grant.signWith(identity.ppk);
                var encrypted = EcEncryptedValue.toEncryptedValue(grant, false);
                EcRepository.save(encrypted, function (success) {
                    loginServer.commit(function () {
                        window.alert("Response sent. The page will now reload.");
                        window.location = window.location.href.split('?')[0];
                        return;
                    }, silent);
                }, error);
            }
        }
    }

    var searchString = '(@encryptedType:"' + EcContactGrant.myType + '")';
    repo.search(searchString, function (encryptedValue) {
        EcRepository.get(encryptedValue.shortId(), function (encryptedValue) {
            var ev = new EcEncryptedValue();
            ev.copyFrom(encryptedValue);
            var grant = ev.decryptIntoObject();
            if (grant != null) {
                var g = new EcContactGrant();
                g.copyFrom(grant);
                if (g.valid())
                    if (window.confirm("Someone identifying themselves as " + g.displayName + " has accepted your request. Would you like to add them to your contact list?")) {
                        var contact = new EcContact();
                        contact.pk = EcPk.fromPem(g.pk);
                        contact.source = g.source;
                        contact.displayName = g.displayName;
                        EcIdentityManager.addContact(contact);
                        alert(contact.displayName + " has accepted your invitation to connect and has been added to your contact list.");
                        populateContactsActual();
                        EcRepository._delete(ev);
                    };
            }
        }, error);
    }, null, silent);

}

timeout(function () {
    loopPopulateContacts();
});
