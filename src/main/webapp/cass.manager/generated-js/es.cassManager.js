/**
 *  Manages the storage object of the browser whether it be the session or 
 *  local storage, and provides methods for retrieving values.
 *  
 *  Also holds a list of recently viewed object ids for different classes
 *  for a specific computer in the browsers storage, this can be used
 *  to precache objects for use or to display the recently viewed objects 
 *  
 *  @module cass.manager
 *  @class SessionController
 *  @constructor
 *  
 *  @author devlin.junker@eduworks.com
 */
var StorageController = function() {
    if (localStorage != null) 
        this.storageSystem = localStorage;
     else if (sessionStorage != null) 
        this.storageSystem = sessionStorage;
    var recent = this.storageSystem["cass.recent"];
    if (recent != null && recent != "") {
        try {
            this.recent = JSON.parse(recent);
        }catch (e) {
            this.recent = {};
        }
    } else {
        this.recent = {};
    }
};
StorageController = stjs.extend(StorageController, null, [], function(constructor, prototype) {
    prototype.storageSystem = null;
    prototype.MAX_RECENT = 3;
    prototype.recent = null;
    prototype.getStoredValue = function(key) {
        return this.storageSystem[key];
    };
    prototype.setStoredValue = function(key, val) {
        this.storageSystem[key] = val;
    };
    prototype.getRecent = function(type) {
        var list = this.recent[type];
        if (list == null) {
            list = [];
            this.recent[type] = list;
            this.storageSystem["cass.recent"] = JSON.stringify(this.recent);
        }
        return list;
    };
    prototype.addRecent = function(type, id) {
        var list = this.recent[type];
        if (list == null) {
            list = [id];
        } else if (list.indexOf(id) == -1) {
            if (list.length < this.MAX_RECENT) {
                list.push(id);
            } else {
                list.shift();
                list.push(id);
            }
        }
        this.recent[type] = list;
        this.storageSystem["cass.recent"] = JSON.stringify(this.recent);
    };
}, {storageSystem: "Storage", recent: {name: "Map", arguments: [null, {name: "Array", arguments: [null]}]}}, {});
var PermissionPropagationModal = function(data, cancelCallback) {
    EcModal.call(this);
    this.data = data;
    this.onCancel = cancelCallback;
};
PermissionPropagationModal = stjs.extend(PermissionPropagationModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "medium";
    prototype.data = null;
    prototype.onCancel = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/permissionPropagation.html";
    };
}, {data: "EcRemoteLinkedData", onCancel: "Callback0"}, {});
/**
 *  Stub for the AddFieldModal
 *  
 *  @module cass.manager
 *  @author devlin.junker@eduworks.com
 *  @class AddFieldModal
 *  @extends EcModal
 *  @constructor
 */
var AddFieldModal = /**
 *  @constructor
 *  @param {Object} field
 *  @param {String} repoEditContainerId
 */
function(field, repoEditContainerId) {
    EcModal.call(this);
    this.field = field;
    this.repoEditContainerId = repoEditContainerId;
};
AddFieldModal = stjs.extend(AddFieldModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.field = null;
    prototype.repoEditContainerId = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/addField.html";
    };
}, {field: "Object"}, {});
/**
 *  Stub for the AddCompetenciesToFrameworkModal
 *  
 *  @module cass.manager
 *  @author devlin.junker@eduworks.com
 *  @class AddCompetenciesToFrameworkModal
 *  @extends EcModal
 *  @constructor
 */
var AddToFrameworkModal = /**
 *  @constructor
 *  @param {EcRemoteLinkedData || EcRemoteLinkedData[]} data
 *  			The competency or array of competencies to add to the framework selected in the modal
 */
function(data) {
    EcModal.call(this);
    this.data = data;
};
AddToFrameworkModal = stjs.extend(AddToFrameworkModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "medium";
    prototype.data = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/addToFramework.html";
    };
}, {data: "EcRemoteLinkedData"}, {});
var ImportCompetenciesModal = function(data) {
    EcModal.call(this);
    this.data = data;
};
ImportCompetenciesModal = stjs.extend(ImportCompetenciesModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "medium";
    prototype.data = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/importCompetencies.html";
    };
}, {data: "EcRemoteLinkedData"}, {});
var RepoExportModal = function(data) {
    EcModal.call(this);
    this.data = data;
};
RepoExportModal = stjs.extend(RepoExportModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "medium";
    prototype.data = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/repoExport.html";
    };
}, {data: "EcRemoteLinkedData"}, {});
var CopyResourceModal = function(data, callback) {
    EcModal.call(this);
    this.data = data;
    this.callback = callback;
};
CopyResourceModal = stjs.extend(CopyResourceModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "medium";
    prototype.data = null;
    prototype.callback = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/copyResource.html";
    };
}, {data: "Object", callback: "Callback0"}, {});
var AdvancedPermissionsModal = function(data, callback, onlyReaders) {
    EcModal.call(this);
    this.data = data;
    this.saveCallback = callback;
    if (onlyReaders == null) 
        this.onlyReaders = false;
     else 
        this.onlyReaders = onlyReaders;
};
AdvancedPermissionsModal = stjs.extend(AdvancedPermissionsModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "medium";
    prototype.data = null;
    prototype.saveCallback = null;
    prototype.onlyReaders = false;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/advancedPermissions.html";
    };
}, {data: "EcRemoteLinkedData", saveCallback: {name: "Callback1", arguments: ["Object"]}}, {});
/**
 *  Stub for the AddFieldModal
 *  
 *  @module cass.manager
 *  @author devlin.junker@eduworks.com
 *  @class AddOwnerModal
 *  @extends EcModal
 *  @constructor
 */
var AddOwnerModal = /**
 *  @constructor
 *  @param {Object} field
 *  @param {String} objectContainerId
 */
function(field, objectContainerId) {
    EcModal.call(this);
    this.field = field;
    this.objectContainerId = objectContainerId;
};
AddOwnerModal = stjs.extend(AddOwnerModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.field = null;
    prototype.objectContainerId = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/addOwner.html";
    };
}, {field: "Object"}, {});
var EncryptOptionsModal = function(callback) {
    EcModal.call(this);
    this.callback = callback;
};
EncryptOptionsModal = stjs.extend(EncryptOptionsModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "tiny";
    prototype.callback = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/encryptOptions.html";
    };
}, {callback: {name: "Callback1", arguments: ["Object"]}}, {});
var EditLevelModal = function(data, callback) {
    EcModal.call(this);
    this.data = data;
    this.closeCallback = callback;
};
EditLevelModal = stjs.extend(EditLevelModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.data = null;
    prototype.closeCallback = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/editLevel.html";
    };
}, {data: "EcRemoteLinkedData", closeCallback: {name: "Callback1", arguments: ["EcLevel"]}}, {});
var ChangeServerModal = function() {
    EcModal.call(this);
};
ChangeServerModal = stjs.extend(ChangeServerModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "tiny";
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/changeServer.html";
    };
}, {}, {});
var RepoImportModal = function() {
    EcModal.call(this);
};
RepoImportModal = stjs.extend(RepoImportModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "medium";
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/import.html";
    };
}, {}, {});
var EvidenceViewModal = function(evidence) {
    EcModal.call(this);
    this.evidence = evidence;
};
EvidenceViewModal = stjs.extend(EvidenceViewModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "medium";
    prototype.evidence = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/viewEvidence.html";
    };
}, {evidence: {name: "Array", arguments: [null]}}, {});
var ConfirmModal = function(confirmCallback, message, header) {
    EcModal.call(this);
    this.confirmCallback = confirmCallback;
    this.message = message;
    this.header = header;
};
ConfirmModal = stjs.extend(ConfirmModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "tiny";
    prototype.header = null;
    prototype.message = null;
    prototype.confirmCallback = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/confirm.html";
    };
}, {confirmCallback: "Callback0"}, {});
var ChangeTypeModal = function(changeObj, repoEditContainerId) {
    EcModal.call(this);
    this.changeObj = changeObj;
    this.repoEditContainerId = repoEditContainerId;
};
ChangeTypeModal = stjs.extend(ChangeTypeModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.changeObj = null;
    prototype.repoEditContainerId = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/changeType.html";
    };
}, {changeObj: "Object"}, {});
var MessageModal = function(header, text, size, okCallback) {
    EcModal.call(this);
    this.header = header;
    this.message = text;
    if (size != null) 
        this.modalSize = size;
    this.okCallback = okCallback;
};
MessageModal = stjs.extend(MessageModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.header = "";
    prototype.message = "";
    prototype.okCallback = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/message.html";
    };
}, {okCallback: "Callback0"}, {});
var CreateUserModal = function() {
    EcModal.call(this);
};
CreateUserModal = stjs.extend(CreateUserModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/createUser.html";
    };
}, {}, {});
var SaveIdModal = function(msg) {
    EcModal.call(this);
    this.msg = msg;
};
SaveIdModal = stjs.extend(SaveIdModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "tiny";
    prototype.msg = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/saveId.html";
    };
}, {}, {});
var EditRollupRuleModal = function(data, callback) {
    EcModal.call(this);
    this.data = data;
    this.closeCallback = callback;
};
EditRollupRuleModal = stjs.extend(EditRollupRuleModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.data = null;
    prototype.closeCallback = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/editRollupRule.html";
    };
}, {data: "EcRemoteLinkedData", closeCallback: {name: "Callback1", arguments: ["EcRollupRule"]}}, {});
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
/**
 *  @author djunker
 * 
 * 	RepoEdit Stub for RepoEdit.js
 */
var RepoEdit = /**
 *  
 *  @param data
 *  @param saveButtonId
 *  @param messageContainerId
 */
function(data, saveButtonId, messageContainerId) {
    EcView.call(this);
    this.data = data;
    this.saveButtonId = saveButtonId;
    this.messageContainerId = messageContainerId;
};
RepoEdit = stjs.extend(RepoEdit, EcView, [], function(constructor, prototype) {
    prototype.data = null;
    prototype.saveButtonId = null;
    prototype.messageContainerId = null;
    prototype.getHtmlLocation = function() {
        return "partial/other/repoEdit.html";
    };
}, {data: "Object"}, {});
var IdentityDisplay = function(data) {
    EcView.call(this);
    this.data = data;
};
IdentityDisplay = stjs.extend(IdentityDisplay, EcView, [], function(constructor, prototype) {
    prototype.data = null;
    prototype.getHtmlLocation = function() {
        return "partial/other/identityDisplay.html";
    };
}, {data: "Object"}, {});
var DataViewer = function(idPrefix, callbacks) {
    EcView.call(this);
    this.prefix = idPrefix;
    this.callbacks = callbacks;
    this.dataStore = new Object();
};
DataViewer = stjs.extend(DataViewer, EcView, [], function(constructor, prototype) {
    prototype.prefix = null;
    prototype.callbacks = null;
    prototype.dataStore = null;
    prototype.getHtmlLocation = function() {
        return "partial/other/dataViewer.html";
    };
}, {callbacks: "Object", dataStore: "Object"}, {});
var AppMenu = function() {
    EcView.call(this);
};
AppMenu = stjs.extend(AppMenu, EcView, [], function(constructor, prototype) {
    prototype.getHtmlLocation = function() {
        return "partial/other/appMenu.html";
    };
    prototype.setLoggedIn = function() {};
    prototype.showRepoMenu = function(show) {};
    prototype.showExamplesMenu = function(show) {};
    prototype.buildRecentCompetencyList = function(list) {};
    prototype.buildRecentFrameworkList = function(list) {};
}, {}, {});
var Switch = function(onSwitch, switchedOn, switchName) {
    EcView.call(this);
    this.onSwitch = onSwitch;
    this.switchName = switchName;
    if (switchedOn != null) 
        this.switched = switchedOn;
};
Switch = stjs.extend(Switch, EcView, [], function(constructor, prototype) {
    prototype.onSwitch = null;
    prototype.switchName = null;
    prototype.switchId = null;
    prototype.switched = false;
    prototype.getHtmlLocation = function() {
        return "partial/other/switch.html";
    };
    prototype.display = function(containerId) {
        this.switchId = containerId + "-switch";
        if (this.switchId.startsWith("#")) 
            this.switchName = this.switchId.substring(1);
        $(containerId).find(".switch-input").prop("id", this.switchName);
        $(containerId).find(".switch-input").prop("name", this.switchName);
        $(containerId).find(".switch-paddle").prop("for", this.switchName);
        if (this.switched) 
            $(containerId).find(".switch-input").prop("checked", this.switched);
        var me = this;
        $(containerId).find(".switch-input").change(stjs.bind(this, function(ev, THIS) {
            me.switched = !me.switched;
            if (me.onSwitch != null) 
                return me.onSwitch(ev, THIS);
            return true;
        }, 1));
        ($(containerId)).foundation();
    };
    prototype.isChecked = function() {
        return $(this.switchId).prop("checked");
    };
    prototype.setChecked = function(checked) {
        $(this.switchId).prop("checked", checked);
    };
}, {onSwitch: "EventHandler"}, {});
var ContactAcceptModal = function(grant, close) {
    EcModal.call(this);
    this.grant = grant;
    this.closeEvent = close;
};
ContactAcceptModal = stjs.extend(ContactAcceptModal, EcModal, [], function(constructor, prototype) {
    prototype.closeEvent = null;
    prototype.modalSize = "small";
    prototype.grant = null;
    prototype.onClose = function() {
        if (this.closeEvent != null) 
            this.closeEvent();
        return EcView.prototype.onClose.call(this);
    };
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/contactAccept.html";
    };
}, {closeEvent: "Callback0", grant: "EcContactGrant"}, {});
var ContactGrantModal = function(contact, token, signature, close) {
    EcModal.call(this);
    this.contact = contact;
    this.token = token;
    this.signature = signature;
    this.closeEvent = close;
};
ContactGrantModal = stjs.extend(ContactGrantModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.contact = null;
    prototype.token = null;
    prototype.signature = null;
    prototype.closeEvent = null;
    prototype.onClose = function() {
        if (this.closeEvent != null) 
            this.closeEvent();
        return EcView.prototype.onClose.call(this);
    };
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/contactGrant.html";
    };
}, {contact: "EcContact", closeEvent: "Callback0"}, {});
var FrameworkList = function(data, callbacks) {
    EcView.call(this);
    this.data = data;
    this.callbacks = callbacks;
};
FrameworkList = stjs.extend(FrameworkList, EcView, [], function(constructor, prototype) {
    prototype.data = null;
    prototype.callbacks = null;
    prototype.getHtmlLocation = function() {
        return "partial/other/frameworkList.html";
    };
}, {data: "Object", callbacks: "Object"}, {});
var AddServerModal = function(modalClose) {
    EcModal.call(this);
    this.closeEvent = modalClose;
};
AddServerModal = stjs.extend(AddServerModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.closeEvent = null;
    prototype.onClose = function() {
        if (this.closeEvent != null) 
            this.closeEvent();
        return EcView.prototype.onClose.call(this);
    };
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/addServer.html";
    };
}, {closeEvent: "Callback0"}, {});
var MessageContainer = function(idPrefix) {
    EcView.call(this);
    this.prefix = idPrefix;
};
MessageContainer = stjs.extend(MessageContainer, EcView, [], function(constructor, prototype) {
    prototype.prefix = null;
    prototype.getHtmlLocation = function() {
        return "partial/other/messageContainer.html";
    };
    prototype.displayAlert = function(msg, msgId) {};
}, {}, {});
/**
 *  Created by fray on 3/10/17.
 */
var AlignmentEditorColumn = function() {
    EcView.call(this);
    this.collection = new Array();
    this.selected = new Array();
    this.highlighted = new Array();
};
AlignmentEditorColumn = stjs.extend(AlignmentEditorColumn, EcView, [], function(constructor, prototype) {
    constructor.COMPETENCY = Competency.myType;
    constructor.CREDENTIAL = new Credential().type;
    constructor.COURSE = new Course().type;
    constructor.RESOURCE = new CreativeWork().type;
    constructor.BADGE = new Badge().type;
    prototype.columnIndex = -1;
    prototype.containerId = null;
    prototype.getHtmlLocation = function() {
        return "partial/other/alignmentEditor.html";
    };
    prototype.selectedCategory = null;
    prototype.selectedSource = null;
    prototype.selectedCollection = null;
    prototype.sourceRepo = null;
    prototype.filter = null;
    prototype.type = null;
    prototype.urlCollectionIdentifier = null;
    prototype.collectionSearchString = null;
    prototype.collection = null;
    prototype.selected = null;
    prototype.highlighted = null;
    prototype.weight = null;
    prototype.lift = null;
    prototype.relations = null;
    prototype.left = null;
    prototype.right = null;
    prototype.screenHook = null;
    prototype.display = function(containerId) {
        this.containerId = containerId;
        this.bindControls(containerId);
    };
    prototype.bindControls = function(containerId) {};
    prototype.toggleNavigation = function() {};
    prototype.getType = function() {
        if (this.selectedCategory == "course") 
            return AlignmentEditorColumn.COURSE;
        if (this.selectedCategory == "competency") 
            return AlignmentEditorColumn.COMPETENCY;
        if (this.selectedCategory == "credential") 
            return AlignmentEditorColumn.CREDENTIAL;
        if (this.selectedCategory == "resource") 
            return AlignmentEditorColumn.RESOURCE;
        if (this.selectedCategory == "badge") 
            return AlignmentEditorColumn.BADGE;
        return null;
    };
    prototype.populate = function() {};
    prototype.redraw = function() {};
    prototype.redrawJs = function() {};
    prototype.redrawJsInit = function() {};
    prototype.redrawJsFinal = function() {};
    prototype.selectElement = function(id) {
        for (var i = 0; i < this.selected.length; i++) 
            if (this.selected[i].shortId() == id) {
                this.selected.splice(i, 1);
                if (this.right != null) 
                    this.right.deselectedEvent(id, true);
                if (this.left != null) 
                    this.left.deselectedEvent(id, false);
                return;
            }
        for (var i = 0; i < this.collection.length; i++) 
            if (this.collection[i].shortId() == id) {
                this.selected.push(this.collection[i]);
                if (this.right != null) 
                    this.right.selectedEvent(id, true);
                if (this.left != null) 
                    this.left.selectedEvent(id, false);
                return;
            }
    };
    prototype.selectedEvent = function(id, propegatesRight) {};
    prototype.deselectedEvent = function(id, propegatesRight) {};
    prototype.populateListCourses = function() {
        var me = this;
        var params = new Object();
        (params)["size"] = 5000;
        this.sourceRepo.searchWithParams("@type:Course", params, function(ecRemoteLinkedData) {}, function(strings) {
            me.collection = strings;
            me.selected = new Array();
            me.highlighted = new Array();
            me.populate();
        }, function(s) {});
    };
    prototype.populateListCredentials = function() {
        var me = this;
        var params = new Object();
        (params)["size"] = 5000;
        this.sourceRepo.searchWithParams("@type:Credential", params, function(ecRemoteLinkedData) {}, function(credentials) {
            me.collection = credentials;
            me.selected = new Array();
            me.highlighted = new Array();
            me.populate();
        }, function(s) {});
    };
    prototype.populateListBadges = function() {
        var me = this;
        var params = new Object();
        (params)["size"] = 5000;
        this.sourceRepo.searchWithParams("@type:Badge", params, function(ecRemoteLinkedData) {}, function(badges) {
            me.collection = badges;
            me.selected = new Array();
            me.highlighted = new Array();
            me.populate();
        }, function(s) {});
    };
    prototype.populateListCompetencies = function() {
        var me = this;
        EcFramework.get(this.selectedCollection, function(framework) {
            var eah = new EcAsyncHelper();
            me.collection = new Array();
            me.selected = new Array();
            me.highlighted = new Array();
            eah.each(framework.competency, function(s, callback0) {
                EcCompetency.get(s, function(ecCompetency) {
                    me.collection.push(ecCompetency);
                    callback0();
                }, function(s) {
                    callback0();
                });
            }, function(strings) {
                me.populate();
            });
        }, function(s) {});
    };
    prototype.getRelations = function() {
        var query = "";
        var me = this;
        if (me.selectedCategory == "competency") {
            for (var i = 0; i < me.collection.length; i++) {
                if (i > 0) 
                    query += " OR ";
                query += "source:\"" + me.collection[i].shortId() + "\"";
            }
            var params = new Object();
            (params)["size"] = 5000;
            EcAlignment.search(this.sourceRepo, query, function(strings) {
                me.relations = strings;
                if (me.screenHook != null) 
                    me.screenHook();
                 else 
                    me.redraw();
            }, function(s) {}, params);
        } else {
            for (var i = 0; i < me.collection.length; i++) {
                if (i > 0) 
                    query += " OR ";
                query += "url:\"" + me.collection[i].shortId() + "\"";
            }
            if (query != null && query != "") 
                query = "(" + query + ") AND " + new CreativeWork().getSearchStringByType();
             else 
                query = new CreativeWork().getSearchStringByType();
            var params = new Object();
            (params)["size"] = 5000;
            me.relations = new Array();
            me.sourceRepo.searchWithParams(query, params, function(ecRemoteLinkedData) {
                var cw = new CreativeWork();
                cw.copyFrom(ecRemoteLinkedData);
                me.relations.push(cw);
            }, function(strings) {
                if (me.screenHook != null) 
                    me.screenHook();
                 else 
                    me.redraw();
            }, function(s) {});
        }
    };
    prototype.populateListResources = function() {
        var me = this;
        var params = new Object();
        (params)["size"] = 5000;
        this.sourceRepo.searchWithParams(new CreativeWork().getSearchStringByType(), params, function(ecRemoteLinkedData) {}, function(strings) {
            me.collection = strings;
            me.selected = new Array();
            me.highlighted = new Array();
            me.populate();
        }, function(s) {});
    };
}, {sourceRepo: "EcRepository", collection: {name: "Array", arguments: ["Thing"]}, selected: {name: "Array", arguments: ["Thing"]}, highlighted: {name: "Array", arguments: ["Thing"]}, weight: {name: "Map", arguments: [null, null]}, lift: {name: "Map", arguments: [null, null]}, relations: {name: "Array", arguments: ["Thing"]}, left: "AlignmentEditorColumn", right: "AlignmentEditorColumn", screenHook: "Callback0"}, {});
/**
 *  Manages the server that the search controller (through EcRepository) and
 *  the identity controller (through EcIdentityManager) communicate with.
 *  Allows the user to change the server that the UI is talking with via the change server modal.
 * 
 *  @author devlin.junker@eduworks.com
 *  @module cass.manager
 *  @class ServerController
 *  @constructor
 */
var ServerController = /**
 *  On Startup:
 *  1) See if repo on this server, if so add the server given and the found server to the list
 *  2) Determine storage system to load/save list of other servers
 *  3) Switch to a previously selected server if the UI has been used before on this browser
 *  4) Set interfaces to point at endpoint
 * 
 *  @param {String} defaultServer
 *                  Base URL of the service end points on the server
 *  @param {String} defaultServerName
 *                  Name of the Default Server (displayed to the user when selecting servers)
 *  @constructor
 */
function(storageSystem, defaultServer, defaultServerName) {
    this.storageSystem = storageSystem;
    if (storageSystem == null) 
        this.storageSystem = new StorageController();
    this.serverList = {};
    this.repoInterface = new EcRepository();
    var me = this;
    var r = new EcRepository();
    r.autoDetectRepositoryAsync(function() {
        me.addServer("This Server (" + window.location.host + ")", r.selectedServer, null, null);
    }, function(o) {});
    var cachedList = storageSystem.getStoredValue("cass.server.list");
    if (cachedList != null) {
        cachedList = JSON.parse(cachedList);
        for (var serverName in (cachedList)) {
            this.addServer(serverName, (cachedList)[serverName], null, null);
        }
    }
    this.addServer(defaultServerName, defaultServer, null, null);
    var cachedSelected = storageSystem.getStoredValue("cass.server.selected");
    if (cachedSelected != null && this.serverList[cachedSelected] != null) {
        this.selectedServerName = cachedSelected;
        this.selectedServerUrl = this.serverList[this.selectedServerName];
    } else if (defaultServer != null) {
        this.selectedServerUrl = defaultServer;
        if (defaultServerName != null) {
            this.selectedServerName = defaultServerName;
        } else {
            this.selectedServerName = "Default";
        }
    } else {
        this.selectedServerUrl = "http://localhost:9200/api/custom/";
        this.selectedServerName = "Default (Localhost)";
        console.warn("Default Server Not Given, Set to LocalHost");
    }
    storageSystem.setStoredValue("cass.server.selected", this.selectedServerName);
    if (this.serverList[this.selectedServerName] == null) 
        this.addServer(this.selectedServerName, this.selectedServerUrl, null, null);
    EcRepository.caching = true;
    this.repoInterface.selectedServer = this.selectedServerUrl;
};
ServerController = stjs.extend(ServerController, null, [], function(constructor, prototype) {
    prototype.serverList = null;
    prototype.storageSystem = null;
    prototype.selectedServerUrl = null;
    prototype.selectedServerName = null;
    prototype.repoInterface = null;
    /**
     *  Adds a server to this list of servers that can be selected from the change server modal
     * 
     *  @param {String}            name
     *                             Name of the server to be displayed in the list
     *  @param {String}            url
     *                             URL of the server that corresponds to the name
     *  @param {Callback0}         success
     *                             Callback when the server is successfully added to the list
     *  @param {Callback1<String>} failure
     *                             Callback for any errors during adding to the list
     *  @method addServer
     */
    prototype.addServer = function(name, url, success, failure) {
        if (name == null) {
            if (failure != null) 
                failure("Cannot Add Server without a name");
            return;
        }
        if (url == null) {
            if (failure != null) 
                failure("Cannot Add Server with blank url");
            return;
        }
        this.serverList[name] = url;
        this.storageSystem.setStoredValue("cass.server.list", JSON.stringify(this.serverList));
        if (success != null) 
            success();
    };
    /**
     *  Sets the server that the UI will communicate with, changes where the EcRepository and
     *  EcRemoteIdentity Manager are pointing to and communicating with
     * 
     *  @param {String}            identifier
     *                             Name of the server that was selected from the list, used to find URL to point at
     *  @param {Callback0}         success
     *                             Callback when successfully change where the components are pointing and set the
     *                             selected server values
     *  @param {Callback1<String>} failure
     *                             Callback if any errors occur during changing where the components are pointing
     *  @method selectServer
     */
    prototype.selectServer = function(identifier, success, failure) {
        var that = this;
        var oldServer = this.selectedServerUrl;
        var oldServerName = this.selectedServerName;
        for (var serverName in this.serverList) {
            if (identifier.equals(serverName) || identifier.equals(this.serverList[serverName])) {
                this.selectedServerName = serverName;
                this.selectedServerUrl = this.serverList[serverName];
                if (this.repoInterface != null) 
                    this.repoInterface.selectedServer = this.selectedServerUrl;
                this.repoInterface.autoDetectRepositoryAsync(function() {
                    that.storageSystem.setStoredValue("cass.server.selected", that.selectedServerName);
                    that.checkForAdmin(success);
                }, function(error) {
                    if (that.repoInterface != null) 
                        that.repoInterface.selectedServer = oldServer;
                    that.selectedServerUrl = oldServer;
                    that.selectedServerName = oldServerName;
                    if (failure != null) 
                        failure(error);
                });
            }
        }
    };
    prototype.admin = false;
    /**
     *  Setter for boolean flag of whether or not the current user is admin
     * 
     *  @param val true = admin, false = not admin
     *  @method setAdmin
     */
    prototype.setAdmin = function(val) {
        this.admin = val;
    };
    /**
     *  Getter for boolean flag of whether or not current user is admin
     * 
     *  @return {boolean}
     *  true = admin, false = not admin
     *  @method getAdmin
     */
    prototype.getAdmin = function() {
        return this.admin;
    };
    prototype.checkForAdmin = function(success) {
        var me = this;
        me.repoInterface.fetchServerAdminKeys(function(keys) {
            me.setAdmin(false);
            for (var i = 0; i < EcIdentityManager.ids.length; i++) {
                if (keys.indexOf(EcIdentityManager.ids[i].ppk.toPk().toPem()) != -1) {
                    me.setAdmin(true);
                    break;
                }
            }
            if (success != null) 
                success();
        }, function(p1) {
            me.setAdmin(false);
            if (success != null) 
                success();
        });
    };
    /**
     *  Used to retrieve the interface to the repository we are currently pointed at
     * 
     *  @return {EcRepository}
     *  Repository Interface to call search/get/delete methods on
     *  @method getRepoInterface
     */
    prototype.getRepoInterface = function() {
        return this.repoInterface;
    };
    /**
     *  Used during setup to set which EcRepository the server controller manages
     * 
     *  @param {EcRepository} repoInterface
     *                        The interface to the repository to be used by the search controller
     *  @method setRepoInterface
     */
    prototype.setRepoInterface = function(repoInterface) {
        this.repoInterface = repoInterface;
        repoInterface.selectedServer = this.selectedServerUrl;
    };
}, {serverList: {name: "Map", arguments: [null, null]}, storageSystem: "StorageController", repoInterface: "EcRepository"}, {});
/**
 *  Manages the current user's logged in state and interfaces with the server to
 *  sign in/out and create users
 * 
 *  @author devlin.junker@eduworks.com
 *  @module cass.manager
 *  @class LoginController
 *  @constructor
 */
var LoginController = /**
 *  On startup, check if the last time the user was on the page, whether or not they were signed in
 */
function(storage) {
    this.storageSystem = storage;
    this.refreshLoggedIn = this.storageSystem.getStoredValue("cass.login") == "true" ? true : false;
};
LoginController = stjs.extend(LoginController, null, [], function(constructor, prototype) {
    prototype.loginServer = null;
    prototype.identity = null;
    prototype.refreshLoggedIn = false;
    prototype.loggedIn = false;
    prototype.storageSystem = null;
    /**
     *  Setter for the boolean flag of whether or not a user is loged in
     * 
     *  @param {boolean} val
     *                   true if signed in, false if logged out
     *  @method setLoggedIn
     *  @static
     */
    prototype.setLoggedIn = function(val) {
        this.loggedIn = val;
        if (this.storageSystem != null) 
            this.storageSystem.setStoredValue("cass.login", val);
    };
    /**
     *  Getter for boolean flag of whether or not user is logged in
     * 
     *  @return {boolean}
     *  true if signed in, false if logged out
     *  @method getLoggedin
     *  @static
     */
    prototype.getLoggedIn = function() {
        return this.loggedIn;
    };
    /**
     *  If the last time the user was using the application, they were signed in this
     *  returns true (used to remind them to sign in again once they return)
     * 
     *  @return {boolean}
     *  true if previously signed in, false if not signed in last time, or user is here for
     *  the first time from this computer
     *  @method getPreviouslyLoggedIn
     *  @static
     */
    prototype.getPreviouslyLoggedIn = function() {
        return this.refreshLoggedIn;
    };
    prototype.hello = function(network, success, failure) {
        var identityManager = this.identity;
        var me = this;
        this.loginServer = new OAuth2FileBasedRemoteIdentityManager(function() {
            me.loginServer.setDefaultIdentityManagementServer(network);
            me.loginServer.startLogin(null, null);
            me.loginServer.fetch(function(p1) {
                EcIdentityManager.readContacts();
                EcRepository.cache = new Object();
                me.setLoggedIn(true);
                if (EcIdentityManager.ids.length > 0) {
                    identityManager.select(EcIdentityManager.ids[0].ppk.toPem());
                }
                success();
            }, function(p1) {
                failure(p1);
            });
        });
    };
    /**
     *  Validates a username and password on the server and then parses the user's credentials and
     *  checks if they have an admin key. Also tells the identity manager to check for contacts in
     *  local storage after signed in.
     * 
     *  @param {String} username
     *                  username of the user signing in
     *  @param {String} password
     *                  password of the user signing in
     *  @param {String} success
     *                  callback on successful login
     *  @param {String} failure
     *                  callback on error during login
     *  @method login
     */
    prototype.login = function(username, password, server, success, failure) {
        var identityManager = this.identity;
        var that = this;
        this.loginServer = new EcRemoteIdentityManager();
        this.loginServer.setDefaultIdentityManagementServer(server);
        this.loginServer.configureFromServer(function(o) {
            that.loginServer.startLogin(username, password);
            that.loginServer.fetch(function(p1) {
                EcIdentityManager.readContacts();
                EcRepository.cache = new Object();
                that.setLoggedIn(true);
                if (EcIdentityManager.ids.length > 0) {
                    identityManager.select(EcIdentityManager.ids[0].ppk.toPem());
                }
                success();
            }, function(p1) {
                failure(p1);
            });
        }, failure);
    };
    /**
     *  Sets the flags so the user is logged out, wipes all sign in data so the user is no longer
     *  authenticated and is unidentified
     * 
     *  @method logout
     */
    prototype.logout = function() {
        this.loginServer.clear();
        this.identity.selectedIdentity = null;
        EcRepository.cache = new Object();
        this.setLoggedIn(false);
        EcIdentityManager.ids = new Array();
        EcIdentityManager.clearContacts();
    };
    /**
     *  Creates a new user and saves the account details on the login server, then signs in
     *  to the new account on successful creation
     * 
     *  @param {String}            username
     *                             username of the new account
     *  @param {String}            password
     *                             password of the new account
     *  @param {Callback0}         success
     *                             callback for successful creation and sign in
     *  @param {Callback1<String>} failure
     *                             callback for error during creation
     *  @method create
     */
    prototype.create = function(username, password, server, success, failure) {
        this.loginServer.startLogin(username, password);
        var me = this;
        this.loginServer.create(function(p1) {
            me.login(username, password, server, success, failure);
        }, function(p1) {
            failure(p1);
        }, function() {
            return "";
        });
    };
    /**
     *  Saves the users credentials and contacts to the server
     * 
     *  @param {Callback0}         success
     *                             callback for successful save
     *  @param {Callback1<String>} failure
     *                             callback for error during save
     *  @method save
     */
    prototype.save = function(success, failure) {
        this.loginServer.commit(function(p1) {
            success();
        }, function(p1) {
            failure(p1);
        }, function() {
            return null;
        });
    };
}, {loginServer: "RemoteIdentityManagerInterface", identity: "IdentityController", storageSystem: "StorageController"}, {});
/**
 *  Handles loading the CASS Manager settings from the settings.js file,
 *  this includes the default server to show and the message to show when the user
 *  refreshes the page and is logged out
 *  
 *  @module cass.manager
 *  @class AppSettings
 *  @static
 *  
 *  @author devlin.junker@eduworks.com
 */
var AppSettings = function() {};
AppSettings = stjs.extend(AppSettings, null, [], function(constructor, prototype) {
    constructor.FIELD_MSG_RETURN = "returnLoginMessage";
    constructor.FIELD_SERVER_URL = "defaultServerUrl";
    constructor.FIELD_SERVER_NAME = "defaultServerName";
    constructor.FIELD_SHOW_REPO_MENU = "showRepoMenu";
    constructor.FIELD_SHOW_EXAMPLES_MENU = "showExamplesMenu";
    constructor.returnLoginMessage = "For Your Security, You are Logged Out on Page Reload. Please Enter Your Credentials to Continue Logged In.";
    constructor.defaultServerUrl = "https://sandbox.service.cassproject.org/";
    constructor.defaultServerName = "CASS Sandbox";
    constructor.showRepoMenu = false;
    constructor.showExamplesMenu = false;
    constructor.relationTypes = null;
    /**
     *  Loads the settings from the settings file at settings/settings.js
     *  
     *  @static
     *  @method loadSettings
     */
    constructor.loadSettings = function() {
        var urlBase = "http://" + window.location.host + window.location.pathname;
        EcRemote.getExpectingObject(urlBase, "settings/settings.js", function(settingsObj) {
            var msg = (settingsObj)[AppSettings.FIELD_MSG_RETURN];
            if (msg != null) 
                AppSettings.returnLoginMessage = msg;
            var serverUrl = (settingsObj)[AppSettings.FIELD_SERVER_URL];
            if (serverUrl != null) 
                AppSettings.defaultServerUrl = serverUrl;
            var serverName = (settingsObj)[AppSettings.FIELD_SERVER_NAME];
            if (serverName != null) 
                AppSettings.defaultServerUrl = serverName;
            if ((settingsObj)[AppSettings.FIELD_SHOW_REPO_MENU] == "true") 
                AppSettings.showRepoMenu = true;
            if ((settingsObj)[AppSettings.FIELD_SHOW_EXAMPLES_MENU] == "true") 
                AppSettings.showExamplesMenu = true;
        }, function(p1) {
            console.error("Unable to load settings file");
        });
    };
}, {relationTypes: {name: "Map", arguments: [null, null]}}, {});
(function() {
    AppSettings.relationTypes = {"isEnabledBy": "is Enabled by", "requires": "Requires", "desires": "Desires", "narrows": "Narrows", "isRelatedTo": "is Related to", "isEquivalentTo": "is Equivalent to"};
})();
var WelcomeScreen = function() {
    EcScreen.call(this);
};
WelcomeScreen = stjs.extend(WelcomeScreen, EcScreen, [], function(constructor, prototype) {
    constructor.displayName = "welcome";
    prototype.getDisplayName = function() {
        return WelcomeScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/welcome.html";
    };
}, {failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
/**
 *  Created by fray on 3/23/17.
 */
var AlignmentExplorerColumn = function() {
    AlignmentEditorColumn.call(this);
};
AlignmentExplorerColumn = stjs.extend(AlignmentExplorerColumn, AlignmentEditorColumn, [], function(constructor, prototype) {
    prototype.idToComments = null;
    prototype.idToCommentHighlight = null;
    prototype.selectElement = function(id) {
        for (var i = 0; i < this.selected.length; i++) 
            if (this.selected[i].shortId() == id) {
                this.selected.splice(i, 1);
                if (this.right != null) 
                    this.right.deselectedEvent(id, true);
                if (this.left != null) 
                    this.left.deselectedEvent(id, false);
                return;
            }
        for (var i = 0; i < this.collection.length; i++) 
            if (this.collection[i].shortId() == id) {
                this.selected.push(this.collection[i]);
                if (this.right != null) 
                    this.right.selectedEvent(id, true);
                if (this.left != null) 
                    this.left.selectedEvent(id, false);
                return;
            }
    };
    prototype.selectedEvent = function(id, propegatesRight) {
        if (this.screenHook != null) 
            this.screenHook();
    };
    prototype.redraw = function() {
        var sel = null;
        if (this.left != null) 
            sel = this.left.selected;
        var rels = this.relations;
        if (rels == null) 
            rels = new Array();
        if (this.left != null) 
            rels = rels.concat(this.left.relations);
        if (sel != null) {
            this.idToComments = new Object();
            this.idToCommentHighlight = new Object();
            this.highlighted = new Array();
            for (var i = 0; i < sel.length; i++) {
                var t = sel[i];
                this.highlight(t, rels, new Array());
            }
            this.selected = this.highlighted;
        }
        this.redrawJs();
    };
    prototype.redrawJs = function() {};
    prototype.redrawJsInit = function() {};
    prototype.appendComment = function(id, comment) {
        var tray = (this.idToComments)[id];
        if (tray == null) {
            tray = new Array();
            (this.idToComments)[id] = tray;
        }
        EcArray.setAdd(tray, comment);
    };
    prototype.highlightComment = function(id) {
        var tray = (this.idToComments)[id];
        if (tray == null) {
            (this.idToCommentHighlight)[id] = true;
        }
    };
    prototype.highlight = function(selectedItem, rels, walked) {
        if (EcArray.has(walked, selectedItem)) 
            return;
        walked.push(selectedItem);
        if (!EcArray.has(this.highlighted, selectedItem)) 
            if (EcArray.has(this.collection, selectedItem)) 
                this.highlighted.push(selectedItem);
        for (var j = 0; j < rels.length; j++) {
            var relation = rels[j];
            if (new Relation().isA(relation.type)) {
                var r = relation;
                if (selectedItem.shortId() == r.source || selectedItem.shortId() == r.target) {
                    var relationOk = false;
                    var comment = "";
                    if (selectedItem.shortId() == r.target && r.relationType == Relation.NARROWS) {
                        relationOk = true;
                        comment = "Subcompetency of " + (EcRepository.getBlocking(r.target)).name;
                    }
                    if (r.relationType == Relation.IS_EQUIVALENT_TO) {
                        relationOk = true;
                        comment = "Equivalent competency.";
                    }
                    if (selectedItem.shortId() == r.source && r.relationType == Relation.REQUIRES) {
                        relationOk = true;
                        comment = "Required by " + (EcRepository.getBlocking(r.source)).name;
                    }
                    if (relationOk) 
                        for (var k = 0; k < this.collection.length; k++) {
                            var candidate = this.collection[k];
                            if (candidate.shortId() == r.source || candidate.shortId() == r.target) {
                                this.appendComment(selectedItem.shortId(), comment);
                                EcArray.setAdd(this.highlighted, candidate);
                                this.highlight(candidate, rels, walked);
                            }
                        }
                }
            }
            if (new CreativeWork().isA(relation.type)) {
                var r = relation;
                if (r.educationalAlignment != null) 
                    if (selectedItem.shortId() == r.url || selectedItem.shortId() == r.educationalAlignment.targetUrl) {
                        for (var k = 0; k < this.collection.length; k++) {
                            var candidate = this.collection[k];
                            if (candidate.shortId() == r.url || candidate.shortId() == r.educationalAlignment.targetUrl) {
                                var comment = "";
                                if (candidate.shortId() == r.url) {
                                    if (r.educationalAlignment.alignmentType == "requires") 
                                        comment = "Requires " + (EcRepository.getBlocking(r.educationalAlignment.targetUrl)).name;
                                    if (r.educationalAlignment.alignmentType == "teaches") 
                                        comment = "Teaches " + (EcRepository.getBlocking(r.educationalAlignment.targetUrl)).name;
                                    if (r.educationalAlignment.alignmentType == "assesses") 
                                        comment = "Assesses " + (EcRepository.getBlocking(r.educationalAlignment.targetUrl)).name;
                                    if (r.educationalAlignment.alignmentType == "http://schema.cassproject.org/0.2/vocab/asserts") 
                                        comment = "Asserts " + (EcRepository.getBlocking(r.educationalAlignment.targetUrl)).name;
                                    if (selectedItem.shortId() == r.educationalAlignment.targetUrl) 
                                        this.highlightComment(comment);
                                }
                                if (candidate.shortId() == r.educationalAlignment.targetUrl) {
                                    if (r.educationalAlignment.alignmentType == "requires") 
                                        comment = "Required by " + (EcRepository.getBlocking(r.url)).name;
                                    if (r.educationalAlignment.alignmentType == "teaches") 
                                        comment = "Taught by " + (EcRepository.getBlocking(r.url)).name;
                                    if (r.educationalAlignment.alignmentType == "assesses") 
                                        comment = "Assessed by " + (EcRepository.getBlocking(r.url)).name;
                                    if (r.educationalAlignment.alignmentType == "http://schema.cassproject.org/0.2/vocab/asserts") 
                                        comment = "Asserted by " + (EcRepository.getBlocking(r.url)).name;
                                    if (selectedItem.shortId() == r.url) 
                                        this.highlightComment(comment);
                                }
                                if (comment != "") 
                                    this.appendComment(selectedItem.shortId(), comment);
                                EcArray.setAdd(this.highlighted, candidate);
                                this.highlight(candidate, rels, walked);
                            }
                        }
                    }
            }
        }
    };
    prototype.deselectedEvent = function(id, propegatesRight) {
        this.selectedEvent(id, propegatesRight);
    };
}, {idToComments: "Object", idToCommentHighlight: "Object", sourceRepo: "EcRepository", collection: {name: "Array", arguments: ["Thing"]}, selected: {name: "Array", arguments: ["Thing"]}, highlighted: {name: "Array", arguments: ["Thing"]}, weight: {name: "Map", arguments: [null, null]}, lift: {name: "Map", arguments: [null, null]}, relations: {name: "Array", arguments: ["Thing"]}, left: "AlignmentEditorColumn", right: "AlignmentEditorColumn", screenHook: "Callback0"}, {});
/**
 *  Main entry point of the application. Figures out the settings and
 *  starts the EC UI Framework at the appropriate screen.
 *  
 *  @module cass.manager
 *  @class AppController
 *  @static
 *  
 *  @author devlin.junker@eduworks.com
 */
var AppController = function() {};
AppController = stjs.extend(AppController, null, [], function(constructor, prototype) {
    constructor.topBarContainerId = "#menuContainer";
    /**
     *  Manages the server connection by storing and configuring 
     *  the CASS instance endpoint for the rest of the application
     *  and managing the interfaces to it.  
     *  
     *  @property serverController
     *  @static
     *  @type ServerController
     */
    constructor.serverController = null;
    /**
     *  Manages the current user's identities and contacts through the
     *  KBAC libraries. 
     *  
     *  @property identityController
     *  @static
     *  @type IdentityController
     */
    constructor.identityController = null;
    /**
     *  Handles the login/logout and admin communications with the server.
     *  
     *  @property loginController
     *  @static
     *  @type LoginController
     */
    constructor.loginController = null;
    /**
     *  Handles the browser storage
     *  
     *  @property sessionController
     *  @static
     *  @type SessionController
     */
    constructor.storageController = null;
    /**
     *  Entry point of the application
     *  
     *  @param {String[]} args
     *  			Not used at all...
     */
    constructor.main = function(args) {
        AppController.identityController = new IdentityController();
        AppController.storageController = new StorageController();
        AppController.loginController = new LoginController(AppController.storageController);
        AppController.serverController = new ServerController(AppController.storageController, AppSettings.defaultServerUrl, AppSettings.defaultServerName);
        AppSettings.loadSettings();
        AppController.loginController.identity = AppController.identityController;
        ScreenManager.setDefaultScreen(new WelcomeScreen());
        $(window.document).ready(function(arg0, arg1) {
            ViewManager.showView(new AppMenu(), AppController.topBarContainerId, function() {
                ($(window.document)).foundation();
                var menu = ViewManager.getView(AppController.topBarContainerId);
                menu.showRepoMenu(AppSettings.showRepoMenu);
                menu.showExamplesMenu(AppSettings.showExamplesMenu);
            });
            return true;
        });
    };
}, {serverController: "ServerController", identityController: "IdentityController", loginController: "LoginController", storageController: "StorageController"}, {});
if (!stjs.mainCallDisabled) 
    AppController.main();
var LoginModal = function(success, cancel, warningMessage) {
    EcModal.call(this);
    this.loginSuccess = success;
    this.cancel = cancel;
    this.warning = warningMessage;
};
LoginModal = stjs.extend(LoginModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.cancel = null;
    prototype.loginSuccess = null;
    prototype.warning = null;
    prototype.onClose = function() {
        if (this.cancel != null) 
            this.cancel();
        return EcView.prototype.onClose.call(this);
    };
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/login.html";
    };
    prototype.submitOauth2 = function(server) {
        var me = this;
        var failure = function(err) {
            ViewManager.getView("#loginMessageContainer").displayAlert(err, "loginFail");
        };
        ViewManager.getView("#loginMessageContainer").clearAlert("loginFail");
        AppController.loginController.hello(server, function() {
            AppController.serverController.checkForAdmin(function() {
                if (me.loginSuccess != null) {
                    me.loginSuccess(URLParams.getParams());
                } else {
                    ModalManager.hideModal();
                }
                new AppMenu().setLoggedIn();
            });
        }, failure);
    };
    prototype.submitLogin = function(userId, password, server) {
        var me = this;
        var failure = function(err) {
            ViewManager.getView("#loginMessageContainer").displayAlert(err, "loginFail");
        };
        ViewManager.getView("#loginMessageContainer").clearAlert("loginFail");
        AppController.loginController.login(userId, password, server, function() {
            AppController.serverController.checkForAdmin(function() {
                AppController.serverController.checkForAdmin(function() {
                    if (me.loginSuccess != null) {
                        me.loginSuccess(URLParams.getParams());
                    } else {
                        ModalManager.hideModal();
                    }
                    new AppMenu().setLoggedIn();
                });
            });
        }, failure);
    };
}, {cancel: "Callback0", loginSuccess: {name: "Callback1", arguments: ["Object"]}}, {});
var CassManagerScreen = function() {
    EcScreen.call(this);
};
CassManagerScreen = stjs.extend(CassManagerScreen, EcScreen, [], function(constructor, prototype) {
    prototype.data = null;
    prototype.setData = function(data) {
        this.data = data;
    };
    constructor.reloadLoginCallback = function(o) {
        ModalManager.hideModal();
        var currentScreen = ScreenManager.getCurrentScreen();
        if (o == null) 
            currentScreen.setData(URLParams.getParams());
         else 
            currentScreen.setData(o);
        ScreenManager.replaceScreen(currentScreen, null, null);
    };
    constructor.reloadShowLoginCallback = function() {
        CassManagerScreen.showLoginModalIfReload();
    };
    constructor.showLoginModalIfReload = function() {
        if (AppController.loginController.getPreviouslyLoggedIn() && !AppController.loginController.getLoggedIn()) {
            ModalManager.showModal(new LoginModal(CassManagerScreen.reloadLoginCallback, null, AppSettings.returnLoginMessage), null);
        }
    };
}, {data: "Object", reloadLoginCallback: {name: "Callback1", arguments: ["Object"]}, reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
var FrameworkSearchScreen = function(lastViewed, query, ownership) {
    CassManagerScreen.call(this);
    this.lastViewed = lastViewed;
    this.query = query;
    this.ownership = ownership;
};
FrameworkSearchScreen = stjs.extend(FrameworkSearchScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "frameworkSearch";
    prototype.lastViewed = null;
    prototype.query = null;
    prototype.ownership = null;
    prototype.getDisplayName = function() {
        return FrameworkSearchScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/frameworkSearch.html";
    };
}, {lastViewed: "Object", data: "Object", reloadLoginCallback: {name: "Callback1", arguments: ["Object"]}, reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + FrameworkSearchScreen.displayName)) {
            var hashSplit = (window.document.location.hash.split("?"));
            if (hashSplit.length > 1) {
                var query = null;
                var ownership = null;
                var param = hashSplit[1];
                var paramSplit = (param.split("&"));
                for (var i = 0; i < paramSplit.length; i++) {
                    var paramPiece = paramSplit[i];
                    if (paramPiece.startsWith("query")) 
                        query = paramSplit[i].split("=")[1];
                     else if (paramPiece.startsWith("ownership")) 
                        ownership = paramSplit[i].split("=")[1];
                }
                if (query != null || ownership != null) {
                    ScreenManager.startupScreen = new FrameworkSearchScreen(null, query, ownership);
                    CassManagerScreen.showLoginModalIfReload();
                    return;
                }
            }
            ScreenManager.startupScreen = new FrameworkSearchScreen(null, null, null);
            CassManagerScreen.showLoginModalIfReload();
        }
    });
})();
var FileManagerScreen = function() {
    CassManagerScreen.call(this);
};
FileManagerScreen = stjs.extend(FileManagerScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "fileManager";
    prototype.getDisplayName = function() {
        return FileManagerScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/fileManager.html";
    };
}, {data: "Object", reloadLoginCallback: {name: "Callback1", arguments: ["Object"]}, reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + FileManagerScreen.displayName)) {
            ScreenManager.startupScreen = new FileManagerScreen();
            CassManagerScreen.showLoginModalIfReload();
        }
    });
})();
var UserIdentityScreen = function() {
    CassManagerScreen.call(this);
};
UserIdentityScreen = stjs.extend(UserIdentityScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "identity";
    prototype.getDisplayName = function() {
        return UserIdentityScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/userIdentity.html";
    };
}, {data: "Object", reloadLoginCallback: {name: "Callback1", arguments: ["Object"]}, reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + UserIdentityScreen.displayName)) {
            var hashSplit = (window.document.location.hash.split("?"));
            if (AppController.loginController.getPreviouslyLoggedIn() || (hashSplit.length == 2 && hashSplit[1].startsWith("action"))) {
                ScreenManager.startupScreen = new UserIdentityScreen();
                ModalManager.showModal(new LoginModal(function(o) {
                    ModalManager.hideModal();
                }, function() {
                    if (!AppController.loginController.getLoggedIn()) {
                        ScreenManager.replaceScreen(new WelcomeScreen(), null, null);
                    } else {
                        ScreenManager.reloadCurrentScreen(null);
                    }
                }, AppSettings.returnLoginMessage), null);
            }
        }
    });
})();
var LevelSearchScreen = function(lastViewed, query, ownership) {
    CassManagerScreen.call(this);
    this.lastViewed = lastViewed;
    this.query = query;
    this.ownership = ownership;
};
LevelSearchScreen = stjs.extend(LevelSearchScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "levelSearch";
    prototype.lastViewed = null;
    prototype.query = null;
    prototype.ownership = null;
    prototype.getDisplayName = function() {
        return LevelSearchScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/levelSearch.html";
    };
}, {lastViewed: "Object", data: "Object", reloadLoginCallback: {name: "Callback1", arguments: ["Object"]}, reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + LevelSearchScreen.displayName)) {
            var hashSplit = (window.document.location.hash.split("?"));
            if (hashSplit.length > 1) {
                var query = null;
                var ownership = null;
                var param = hashSplit[1];
                var paramSplit = (param.split("&"));
                for (var i = 0; i < paramSplit.length; i++) {
                    var paramPiece = paramSplit[i];
                    if (paramPiece.startsWith("query")) 
                        query = paramSplit[i].split("=")[1];
                     else if (paramPiece.startsWith("ownership")) 
                        ownership = paramSplit[i].split("=")[1];
                }
                if (query != null || ownership != null) {
                    ScreenManager.startupScreen = new LevelSearchScreen(null, query, ownership);
                    CassManagerScreen.showLoginModalIfReload();
                    return;
                }
            }
            ScreenManager.startupScreen = new LevelSearchScreen(null, null, null);
            CassManagerScreen.showLoginModalIfReload();
        }
    });
})();
var RepoCreateScreen = function(data) {
    CassManagerScreen.call(this);
    this.data = data;
};
RepoCreateScreen = stjs.extend(RepoCreateScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "repoCreate";
    prototype.data = null;
    prototype.getDisplayName = function() {
        return RepoCreateScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/repoCreate.html";
    };
}, {data: "Object", data: "Object", reloadLoginCallback: {name: "Callback1", arguments: ["Object"]}, reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + RepoCreateScreen.displayName)) {
            ScreenManager.startupScreen = new RepoCreateScreen(null);
            CassManagerScreen.showLoginModalIfReload();
        }
    });
})();
var RollupRuleSearchScreen = function(lastViewed, query, ownership) {
    CassManagerScreen.call(this);
    this.lastViewed = lastViewed;
    this.query = query;
    this.ownership = ownership;
};
RollupRuleSearchScreen = stjs.extend(RollupRuleSearchScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "ruleSearch";
    prototype.lastViewed = null;
    prototype.query = null;
    prototype.ownership = null;
    prototype.getDisplayName = function() {
        return RollupRuleSearchScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/ruleSearch.html";
    };
}, {lastViewed: "Object", data: "Object", reloadLoginCallback: {name: "Callback1", arguments: ["Object"]}, reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + RollupRuleSearchScreen.displayName)) {
            var hashSplit = (window.document.location.hash.split("?"));
            if (hashSplit.length > 1) {
                var query = null;
                var ownership = null;
                var param = hashSplit[1];
                var paramSplit = (param.split("&"));
                for (var i = 0; i < paramSplit.length; i++) {
                    var paramPiece = paramSplit[i];
                    if (paramPiece.startsWith("query")) 
                        query = paramSplit[i].split("=")[1];
                     else if (paramPiece.startsWith("ownership")) 
                        ownership = paramSplit[i].split("=")[1];
                }
                if (query != null || ownership != null) {
                    ScreenManager.startupScreen = new RollupRuleSearchScreen(null, query, ownership);
                    CassManagerScreen.showLoginModalIfReload();
                    return;
                }
            }
            ScreenManager.startupScreen = new RollupRuleSearchScreen(null, null, null);
            CassManagerScreen.showLoginModalIfReload();
        }
    });
})();
var CompetencySearchScreen = function(lastViewed, query, ownership) {
    CassManagerScreen.call(this);
    this.lastViewed = lastViewed;
    this.query = query;
    this.ownership = ownership;
};
CompetencySearchScreen = stjs.extend(CompetencySearchScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "competencySearch";
    prototype.lastViewed = null;
    prototype.query = null;
    prototype.ownership = null;
    prototype.getDisplayName = function() {
        return CompetencySearchScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/competencySearch.html";
    };
}, {lastViewed: "Object", data: "Object", reloadLoginCallback: {name: "Callback1", arguments: ["Object"]}, reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + CompetencySearchScreen.displayName)) {
            var hashSplit = (window.document.location.hash.split("?"));
            if (hashSplit.length > 1) {
                var query = null;
                var ownership = null;
                var param = hashSplit[1];
                var paramSplit = (param.split("&"));
                for (var i = 0; i < paramSplit.length; i++) {
                    var paramPiece = paramSplit[i];
                    if (paramPiece.startsWith("query")) 
                        query = paramSplit[i].split("=")[1];
                     else if (paramPiece.startsWith("ownership")) 
                        ownership = paramSplit[i].split("=")[1];
                }
                if (query != null || ownership != null) {
                    ScreenManager.startupScreen = new CompetencySearchScreen(null, query, ownership);
                    CassManagerScreen.showLoginModalIfReload();
                    return;
                }
            }
            ScreenManager.startupScreen = new CompetencySearchScreen(null, null, null);
            CassManagerScreen.showLoginModalIfReload();
        }
    });
})();
var RelationshipSearchScreen = function(lastViewed, query, ownership) {
    CassManagerScreen.call(this);
    this.lastViewed = lastViewed;
    this.query = query;
    this.ownership = ownership;
};
RelationshipSearchScreen = stjs.extend(RelationshipSearchScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "relationSearch";
    prototype.lastViewed = null;
    prototype.query = null;
    prototype.ownership = null;
    prototype.getDisplayName = function() {
        return RelationshipSearchScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/relationshipSearch.html";
    };
}, {lastViewed: "Object", data: "Object", reloadLoginCallback: {name: "Callback1", arguments: ["Object"]}, reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + RelationshipSearchScreen.displayName)) {
            var hashSplit = (window.document.location.hash.split("?"));
            if (hashSplit.length > 1) {
                var query = null;
                var ownership = null;
                var param = hashSplit[1];
                var paramSplit = (param.split("&"));
                for (var i = 0; i < paramSplit.length; i++) {
                    var paramPiece = paramSplit[i];
                    if (paramPiece.startsWith("query")) 
                        query = paramSplit[i].split("=")[1];
                     else if (paramPiece.startsWith("ownership")) 
                        ownership = paramSplit[i].split("=")[1];
                }
                if (query != null || ownership != null) {
                    ScreenManager.startupScreen = new RelationshipSearchScreen(null, query, ownership);
                    CassManagerScreen.showLoginModalIfReload();
                    return;
                }
            }
            ScreenManager.startupScreen = new RelationshipSearchScreen(null, null, null);
            CassManagerScreen.showLoginModalIfReload();
        }
    });
})();
var RepoSearchScreen = function(lastViewed, query, ownership, types) {
    CassManagerScreen.call(this);
    this.lastViewed = lastViewed;
    this.query = query;
    this.ownership = ownership;
    this.types = types;
};
RepoSearchScreen = stjs.extend(RepoSearchScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "repoSearch";
    prototype.lastViewed = null;
    prototype.query = null;
    prototype.ownership = null;
    prototype.types = null;
    prototype.getDisplayName = function() {
        return RepoSearchScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/repoSearch.html";
    };
}, {lastViewed: "Object", types: {name: "Array", arguments: [null]}, data: "Object", reloadLoginCallback: {name: "Callback1", arguments: ["Object"]}, reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + RepoSearchScreen.displayName)) {
            var urlParameters = (URLParams.getParams());
            var query = urlParameters["query"];
            var ownership = urlParameters["ownership"];
            var ts = urlParameters["types"];
            var types = null;
            if (ts != null) 
                types = (ts.toString().split(","));
            if (query != null || ownership != null || types != null) {
                ScreenManager.startupScreen = new RepoSearchScreen(null, query, ownership, types);
                CassManagerScreen.showLoginModalIfReload();
                return;
            }
            ScreenManager.startupScreen = new RepoSearchScreen(null, null, null, null);
            CassManagerScreen.showLoginModalIfReload();
        }
    });
})();
var AlignmentEditorScreen = function() {
    CassManagerScreen.call(this);
    this.columns = new Array();
};
AlignmentEditorScreen = stjs.extend(AlignmentEditorScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "AlignmentEditor";
    prototype.columns = null;
    prototype.containerId = null;
    prototype.addColumn = function() {
        var column = new AlignmentEditorColumn();
        column.columnIndex = this.columns.length;
        var lastColumn = null;
        if (this.columns.length > 0) 
            lastColumn = this.columns[this.columns.length - 1];
        if (lastColumn != null) {
            lastColumn.right = column;
            column.left = lastColumn;
        }
        this.columns.push(column);
        this.addedColumn(column);
        var me = this;
        column.screenHook = function() {
            me.updateControls();
            me.reflow();
        };
        column.display(this.containerId);
        this.reflow();
        return column;
    };
    prototype.createRelations = function(relationType) {
        var left = this.columns[0].selected;
        var right = this.columns[1].selected;
        var leftFramework = null;
        var rightFramework = null;
        if (this.columns[0].selectedCollection != null) 
            leftFramework = EcFramework.getBlocking(this.columns[0].selectedCollection);
        if (this.columns[1].selectedCollection != null) 
            rightFramework = EcFramework.getBlocking(this.columns[1].selectedCollection);
        var me = this;
        for (var i = 0; i < left.length; i++) 
            for (var j = 0; j < right.length; j++) {
                if (this.columns[0].selectedCategory == "competency") 
                    if (this.columns[1].selectedCategory == "competency") {
                        var a = new EcAlignment();
                        a.generateId(this.columns[0].sourceRepo.selectedServer);
                        if (AppController.identityController.selectedIdentity == null) 
                             throw new RuntimeException("No identity selected.");
                        a.addOwner(AppController.identityController.selectedIdentity.ppk.toPk());
                        a.source = left[i].shortId();
                        a.target = right[j].shortId();
                        a.relationType = relationType;
                        var found = false;
                        var relations = this.columns[0].relations;
                        for (var ii = 0; ii < relations.length; ii++) {
                            var r = relations[ii];
                            if (r.source == a.source && r.target == a.target && r.relationType == a.relationType) {
                                found = true;
                                if (leftFramework != null) 
                                    if (AppController.identityController.canEdit(leftFramework)) 
                                        leftFramework.removeRelation(r.id);
                                if (rightFramework != null) 
                                    if (AppController.identityController.canEdit(rightFramework)) 
                                        rightFramework.removeRelation(r.id);
                                EcRepository._delete(r, function(s) {
                                    me.columns[0].getRelations();
                                }, function(s) {
                                     throw new RuntimeException(s);
                                });
                            }
                        }
                        if (!found) {
                            relations.push(a);
                            if (leftFramework != null) 
                                if (AppController.identityController.canEdit(leftFramework)) 
                                    leftFramework.addRelation(a.id);
                            if (rightFramework != null) 
                                if (AppController.identityController.canEdit(rightFramework)) 
                                    rightFramework.addRelation(a.id);
                            EcRepository.save(a, function(s) {
                                me.columns[0].getRelations();
                            }, function(s) {
                                 throw new RuntimeException(s);
                            });
                        }
                    }
            }
        if (leftFramework != null) 
            if (AppController.identityController.canEdit(leftFramework)) 
                leftFramework.save(null, null);
        if (rightFramework != null) 
            if (AppController.identityController.canEdit(rightFramework)) 
                rightFramework.save(null, null);
    };
    prototype.createAlignments = function(relationType) {
        var left = this.columns[0].selected;
        var right = this.columns[1].selected;
        var me = this;
        for (var i = 0; i < left.length; i++) 
            for (var j = 0; j < right.length; j++) {
                if ((this.columns[0].selectedCategory != "competency") || (this.columns[1].selectedCategory != "competency")) {
                    var a = new CreativeWork();
                    a.generateId(this.columns[0].sourceRepo.selectedServer);
                    if (AppController.identityController.selectedIdentity == null) 
                         throw new RuntimeException("No identity selected.");
                    a.addOwner(AppController.identityController.selectedIdentity.ppk.toPk());
                    a.url = left[i].shortId();
                    a.educationalAlignment = new AlignmentObject();
                    a.educationalAlignment.alignmentType = relationType;
                    a.educationalAlignment.educationalFramework = this.columns[1].selectedCollection;
                    a.educationalAlignment.targetUrl = right[j].shortId();
                    a.educationalAlignment.targetName = right[j].name;
                    a.educationalAlignment.targetDescription = right[j].description;
                    var found = false;
                    var relations = this.columns[0].relations;
                    for (var ii = 0; ii < relations.length; ii++) {
                        var r = relations[ii];
                        if (r.educationalAlignment != null) 
                            if (r.url == a.url && r.educationalAlignment.targetUrl == a.educationalAlignment.targetUrl && r.educationalAlignment.alignmentType == a.educationalAlignment.alignmentType) {
                                found = true;
                                EcRepository._delete(r, function(s) {
                                    me.columns[0].getRelations();
                                }, function(s) {
                                     throw new RuntimeException(s);
                                });
                            }
                    }
                    if (!found) {
                        relations.push(a);
                        EcRepository.save(a, function(s) {
                            me.columns[0].getRelations();
                        }, function(s) {
                             throw new RuntimeException(s);
                        });
                    }
                }
            }
    };
    prototype.reflow = function() {};
    prototype.addedColumn = function(column) {
        ViewManager.showView(column, this.createColumnDiv(), function() {});
    };
    prototype.updateControls = function() {};
    prototype.createColumnDiv = function() {
        return null;
    };
    prototype.getDisplayName = function() {
        return AlignmentEditorScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/alignmentEditor.html";
    };
    prototype.display = function(containerId) {
        this.containerId = containerId;
        this.columns = new Array();
        this.addColumn();
        this.addColumn();
        this.bindControls(containerId);
    };
    prototype.bindControls = function(containerId) {};
}, {columns: {name: "Array", arguments: ["AlignmentEditorColumn"]}, data: "Object", reloadLoginCallback: {name: "Callback1", arguments: ["Object"]}, reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + AlignmentEditorScreen.displayName)) {
            ScreenManager.startupScreen = new AlignmentEditorScreen();
            CassManagerScreen.showLoginModalIfReload();
        }
    });
})();
/**
 *  Created by fray on 3/23/17.
 */
var AlignmentExplorerScreen = function() {
    CassManagerScreen.call(this);
};
AlignmentExplorerScreen = stjs.extend(AlignmentExplorerScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "AlignmentExplorer";
    prototype.columns = null;
    prototype.containerId = null;
    prototype.addColumn = function() {
        var column = new AlignmentExplorerColumn();
        column.columnIndex = this.columns.length;
        var lastColumn = null;
        if (this.columns.length > 0) 
            lastColumn = this.columns[this.columns.length - 1];
        if (lastColumn != null) {
            lastColumn.right = column;
            column.left = lastColumn;
        }
        this.columns.push(column);
        this.addedColumn(column);
        var me = this;
        column.screenHook = function() {
            me.updateControls();
            me.reflow();
        };
        column.display(this.containerId);
        this.reflow();
        return column;
    };
    prototype.reflow = function() {};
    prototype.addedColumn = function(column) {
        ViewManager.showView(column, this.createColumnDiv(), function() {});
    };
    prototype.updateControls = function() {};
    prototype.createColumnDiv = function() {
        return null;
    };
    prototype.getDisplayName = function() {
        return AlignmentExplorerScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/alignmentExplorer.html";
    };
    prototype.display = function(containerId) {
        this.containerId = containerId;
        this.columns = new Array();
        this.addColumn();
        this.addColumn();
        this.addColumn();
        this.addColumn();
        this.bindControls(containerId);
    };
    prototype.bindControls = function(containerId) {};
}, {columns: {name: "Array", arguments: ["AlignmentExplorerColumn"]}, data: "Object", reloadLoginCallback: {name: "Callback1", arguments: ["Object"]}, reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + AlignmentExplorerScreen.displayName)) {
            ScreenManager.startupScreen = new AlignmentExplorerScreen();
            CassManagerScreen.showLoginModalIfReload();
        }
    });
})();
var AssertionSearchScreen = function(lastViewed) {
    CassManagerScreen.call(this);
    this.lastViewed = lastViewed;
};
AssertionSearchScreen = stjs.extend(AssertionSearchScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "assertionAll";
    prototype.lastViewed = null;
    prototype.getDisplayName = function() {
        return AssertionSearchScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/assertionSearch.html";
    };
}, {lastViewed: "Object", data: "Object", reloadLoginCallback: {name: "Callback1", arguments: ["Object"]}, reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + AssertionSearchScreen.displayName)) {
            ScreenManager.startupScreen = new AssertionSearchScreen(null);
            CassManagerScreen.showLoginModalIfReload();
        }
    });
})();
var FrameworkViewScreen = function(data) {
    CassManagerScreen.call(this);
    this.data = data;
};
FrameworkViewScreen = stjs.extend(FrameworkViewScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "frameworkView";
    prototype.mc = null;
    prototype.getData = function() {
        return this.data;
    };
    prototype.getDisplayName = function() {
        return FrameworkViewScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/frameworkView.html";
    };
    prototype.display = function(containerId) {};
}, {mc: "MessageContainer", data: "Object", reloadLoginCallback: {name: "Callback1", arguments: ["Object"]}, reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + FrameworkViewScreen.displayName)) {
            var urlParameters = (URLParams.getParams());
            var id = urlParameters["id"];
            if (id != null) {
                EcFramework.get(id, function(data) {
                    ScreenManager.replaceScreen(new FrameworkViewScreen(data), CassManagerScreen.reloadShowLoginCallback, urlParameters);
                    CassManagerScreen.showLoginModalIfReload();
                }, function(p1) {
                    ScreenManager.replaceScreen(new FrameworkSearchScreen(null, null, null), CassManagerScreen.reloadShowLoginCallback, urlParameters);
                    CassManagerScreen.showLoginModalIfReload();
                });
                ScreenManager.startupScreen = ScreenManager.LOADING_STARTUP_PAGE;
                return;
            }
            ScreenManager.startupScreen = new FrameworkSearchScreen(null, null, null);
            CassManagerScreen.showLoginModalIfReload();
        }
    });
})();
var FrameworkEditScreen = function(data) {
    CassManagerScreen.call(this);
    this.data = data;
};
FrameworkEditScreen = stjs.extend(FrameworkEditScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "frameworkEdit";
    prototype.data = null;
    prototype.getDisplayName = function() {
        return FrameworkEditScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/frameworkEdit.html";
    };
}, {data: "Object", data: "Object", reloadLoginCallback: {name: "Callback1", arguments: ["Object"]}, reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + FrameworkEditScreen.displayName)) {
            var urlParameters = (URLParams.getParams());
            var id = urlParameters["id"];
            if (id != null) {
                EcFramework.get(id, function(data) {
                    ScreenManager.replaceScreen(new FrameworkEditScreen(data), CassManagerScreen.reloadShowLoginCallback, urlParameters);
                }, function(p1) {
                    ScreenManager.replaceScreen(new FrameworkSearchScreen(null, null, null), CassManagerScreen.reloadShowLoginCallback, urlParameters);
                });
                ScreenManager.startupScreen = ScreenManager.LOADING_STARTUP_PAGE;
                return;
            }
            ScreenManager.startupScreen = new FrameworkEditScreen(null);
            CassManagerScreen.showLoginModalIfReload();
        }
    });
})();
var UserAdminScreen = function() {
    CassManagerScreen.call(this);
};
UserAdminScreen = stjs.extend(UserAdminScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "admin";
    prototype.getDisplayName = function() {
        return UserAdminScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/userAdmin.html";
    };
}, {data: "Object", reloadLoginCallback: {name: "Callback1", arguments: ["Object"]}, reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + UserAdminScreen.displayName)) {
            var hashSplit = (window.document.location.hash.split("?"));
            if (AppController.loginController.getPreviouslyLoggedIn() || (hashSplit.length == 2 && hashSplit[1].startsWith("action"))) {
                ScreenManager.startupScreen = ScreenManager.LOADING_STARTUP_PAGE;
                ModalManager.showModal(new LoginModal(function(o) {
                    ModalManager.hideModal();
                    if (!AppController.serverController.getAdmin()) {
                        ScreenManager.replaceScreen(new UserIdentityScreen(), null, null);
                    } else {
                        ScreenManager.replaceScreen(new UserAdminScreen(), null, null);
                    }
                }, function() {
                    if (!AppController.loginController.getLoggedIn()) {
                        ScreenManager.replaceScreen(new WelcomeScreen(), null, null);
                    } else if (AppController.serverController.getAdmin()) {
                        ScreenManager.replaceScreen(new UserAdminScreen(), null, null);
                    } else {
                        ScreenManager.reloadCurrentScreen(null);
                    }
                }, AppSettings.returnLoginMessage), null);
            }
        }
    });
})();
var CompetencyEditScreen = function(data, frameworkIdToAddCompetencyTo) {
    CassManagerScreen.call(this);
    this.data = data;
    this.frameworkId = frameworkIdToAddCompetencyTo;
};
CompetencyEditScreen = stjs.extend(CompetencyEditScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "competencyEdit";
    prototype.frameworkId = null;
    prototype.getDisplayName = function() {
        return CompetencyEditScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/competencyEdit.html";
    };
}, {data: "Object", reloadLoginCallback: {name: "Callback1", arguments: ["Object"]}, reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + CompetencyEditScreen.displayName)) {
            var urlParameters = (URLParams.getParams());
            var id = urlParameters["id"];
            if (id != null) {
                EcCompetency.get(id, function(data) {
                    ScreenManager.replaceScreen(new CompetencyEditScreen(data, urlParameters["frameworkId"]), CassManagerScreen.reloadShowLoginCallback, urlParameters);
                }, function(p1) {
                    ScreenManager.replaceScreen(new CompetencySearchScreen(null, null, null), CassManagerScreen.reloadShowLoginCallback, urlParameters);
                });
                ScreenManager.startupScreen = ScreenManager.LOADING_STARTUP_PAGE;
                return;
            }
            ScreenManager.startupScreen = new CompetencyEditScreen(null, null);
            CassManagerScreen.showLoginModalIfReload();
        }
    });
})();
var CompetencyViewScreen = function(data) {
    CassManagerScreen.call(this);
    this.data = data;
};
CompetencyViewScreen = stjs.extend(CompetencyViewScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "competencyView";
    prototype.data = null;
    prototype.getDisplayName = function() {
        return CompetencyViewScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/competencyView.html";
    };
    prototype.getData = function() {
        return this.data;
    };
    prototype.mc = null;
    prototype.display = function(containerId) {
        if (this.getData().id != null) {
            var params = new Object();
            (params)["id"] = this.getData().id;
            ScreenManager.setScreenParameters(params);
        }
        ViewManager.showView(this.mc = new MessageContainer("competencyView"), "#competencyViewMessageContainer", null);
        this.autoConfigure($(containerId));
        var me = this;
        EcCompetency.get(this.getData().id, function(competency) {
            AppController.storageController.addRecent(EcCompetency.myType, me.getData().id);
            (ViewManager.getView(AppController.topBarContainerId)).buildRecentCompetencyList(AppController.storageController.getRecent(EcCompetency.myType));
            me.data = competency;
            me.bindControls();
            me.predisplayCompetency();
        }, function(msg) {
            EcCompetency.get(EcRemoteLinkedData.trimVersionFromUrl(me.getData().id), function(framework) {
                me.data = framework;
                me.bindControls();
                me.predisplayCompetency();
            }, function(msg) {
                me.errorRetrieving(msg);
            });
        });
    };
    prototype.predisplayCompetency = function() {
        var me = this;
        me.autoRemove($("body"), "competency");
        me.autoRemove($("body"), "relation");
        me.autoRemove($("body"), "rollupRule");
        me.autoRemove($("body"), "level");
        me.autoAppend($("body"), "competency");
        me.autoFill($("body"), me.getData());
        this.getData().levels(AppController.serverController.getRepoInterface(), function(p1) {
            me.autoFill(me.autoAppend($("[ec-container='level']"), "level"), p1);
        }, (me)["errorFindingLevels"], function(p1) {
            if (p1.length == 0) 
                $("[ec-container='level']").text("None.");
            me.getData().rollupRules(AppController.serverController.getRepoInterface(), function(p1) {
                me.autoFill(me.autoAppend($("[ec-container='rollupRule']"), "rollupRule"), p1);
            }, (me)["errorFindingRollupRules"], function(p1) {
                if (p1.length == 0) 
                    $("[ec-container='rollupRule']").text("None.");
                me.getData().relations(AppController.serverController.getRepoInterface(), function(p1) {
                    me.autoFill(me.autoAppend($("[ec-container='relation']"), "relation"), p1);
                    me.bindControls();
                }, (me)["errorFindingRelations"], function(p1) {
                    if (p1.length == 0) 
                        $("[ec-container='relation']").text("None.");
                });
            });
        });
    };
    prototype.errorRetrieving = function(err) {
        if (err == null) 
            err = "Unable to Connect to Server to Retrieve Framework";
        this.mc.displayAlert(err, "getFramework");
    };
    prototype.bindControls = function() {};
}, {data: "Object", mc: "MessageContainer", data: "Object", reloadLoginCallback: {name: "Callback1", arguments: ["Object"]}, reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + CompetencyViewScreen.displayName)) {
            var urlParameters = (URLParams.getParams());
            var id = urlParameters["id"];
            if (id != null) {
                EcCompetency.get(id, function(data) {
                    ScreenManager.replaceScreen(new CompetencyViewScreen(data), CassManagerScreen.reloadShowLoginCallback, urlParameters);
                    CassManagerScreen.showLoginModalIfReload();
                }, function(p1) {
                    ScreenManager.replaceScreen(new CompetencySearchScreen(null, null, null), CassManagerScreen.reloadShowLoginCallback, urlParameters);
                    CassManagerScreen.showLoginModalIfReload();
                });
                ScreenManager.startupScreen = ScreenManager.LOADING_STARTUP_PAGE;
                return;
            }
            ScreenManager.startupScreen = new CompetencySearchScreen(null, null, null);
            CassManagerScreen.showLoginModalIfReload();
        }
    });
})();
var RelationshipEditScreen = function(data) {
    CassManagerScreen.call(this);
    this.data = data;
};
RelationshipEditScreen = stjs.extend(RelationshipEditScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "relationEdit";
    prototype.data = null;
    prototype.getDisplayName = function() {
        return RelationshipEditScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/relationshipEdit.html";
    };
}, {data: "Object", data: "Object", reloadLoginCallback: {name: "Callback1", arguments: ["Object"]}, reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + RelationshipEditScreen.displayName)) {
            var urlParameters = (URLParams.getParams());
            var id = urlParameters["id"];
            if (id != null) {
                EcAlignment.get(id, function(data) {
                    ScreenManager.replaceScreen(new RelationshipEditScreen(data), CassManagerScreen.reloadShowLoginCallback, urlParameters);
                }, function(p1) {
                    ScreenManager.replaceScreen(new RelationshipSearchScreen(null, null, null), CassManagerScreen.reloadShowLoginCallback, urlParameters);
                });
                ScreenManager.startupScreen = ScreenManager.LOADING_STARTUP_PAGE;
                return;
            }
            var source = urlParameters["source"];
            if (source != null) {
                var data = new Object();
                (data)["source"] = source;
                ScreenManager.startupScreen = new RelationshipEditScreen(data);
                CassManagerScreen.showLoginModalIfReload();
                return;
            }
            var target = urlParameters["target"];
            if (target != null) {
                var data = new Object();
                (data)["target"] = target;
                ScreenManager.startupScreen = new RelationshipEditScreen(data);
                CassManagerScreen.showLoginModalIfReload();
                return;
            }
            ScreenManager.startupScreen = new RelationshipEditScreen(null);
            CassManagerScreen.showLoginModalIfReload();
        }
    });
})();
var RelationshipViewScreen = function(data) {
    CassManagerScreen.call(this);
    this.data = data;
};
RelationshipViewScreen = stjs.extend(RelationshipViewScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "relationView";
    prototype.data = null;
    prototype.getDisplayName = function() {
        return RelationshipViewScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/relationshipView.html";
    };
}, {data: "Object", data: "Object", reloadLoginCallback: {name: "Callback1", arguments: ["Object"]}, reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + RelationshipViewScreen.displayName)) {
            var urlParameters = (URLParams.getParams());
            var id = urlParameters["id"];
            if (id != null) {
                EcAlignment.get(id, function(data) {
                    ScreenManager.replaceScreen(new RelationshipViewScreen(data), CassManagerScreen.reloadShowLoginCallback, urlParameters);
                    CassManagerScreen.showLoginModalIfReload();
                }, function(p1) {
                    ScreenManager.replaceScreen(new RelationshipSearchScreen(null, null, null), CassManagerScreen.reloadShowLoginCallback, urlParameters);
                    CassManagerScreen.showLoginModalIfReload();
                });
                ScreenManager.startupScreen = ScreenManager.LOADING_STARTUP_PAGE;
                return;
            }
            ScreenManager.startupScreen = new RelationshipSearchScreen(null, null, null);
            CassManagerScreen.showLoginModalIfReload();
        }
    });
})();
var RepoViewScreen = function(data) {
    CassManagerScreen.call(this);
    this.data = data;
};
RepoViewScreen = stjs.extend(RepoViewScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "repoView";
    prototype.data = null;
    prototype.getDisplayName = function() {
        return RepoViewScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/repoView.html";
    };
}, {data: "Object", data: "Object", reloadLoginCallback: {name: "Callback1", arguments: ["Object"]}, reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + RepoViewScreen.displayName)) {
            var urlParameters = (URLParams.getParams());
            var id = urlParameters["id"];
            if (id != null) {
                EcRepository.get(id, function(data) {
                    ScreenManager.replaceScreen(new RepoViewScreen(data), CassManagerScreen.reloadShowLoginCallback, urlParameters);
                }, function(p1) {
                    ScreenManager.replaceScreen(new RepoSearchScreen(null, null, null, null), CassManagerScreen.reloadShowLoginCallback, urlParameters);
                });
                ScreenManager.startupScreen = ScreenManager.LOADING_STARTUP_PAGE;
                return;
            }
            ScreenManager.startupScreen = new RepoSearchScreen(null, null, null, null);
            CassManagerScreen.showLoginModalIfReload();
        }
    });
})();
var AssertionViewScreen = function(data) {
    CassManagerScreen.call(this);
    this.data = data;
};
AssertionViewScreen = stjs.extend(AssertionViewScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "assertionView";
    prototype.data = null;
    prototype.getDisplayName = function() {
        return AssertionViewScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/assertionView.html";
    };
}, {data: "Object", data: "Object", reloadLoginCallback: {name: "Callback1", arguments: ["Object"]}, reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + AssertionViewScreen.displayName)) {
            var urlParameters = (URLParams.getParams());
            var id = urlParameters["id"];
            if (id != null) {
                EcAssertion.get(id, function(data) {
                    ScreenManager.replaceScreen(new AssertionViewScreen(data), CassManagerScreen.reloadShowLoginCallback, urlParameters);
                    CassManagerScreen.showLoginModalIfReload();
                }, function(p1) {
                    ScreenManager.replaceScreen(new CompetencySearchScreen(null, null, null), CassManagerScreen.reloadShowLoginCallback, urlParameters);
                    CassManagerScreen.showLoginModalIfReload();
                });
                ScreenManager.startupScreen = ScreenManager.LOADING_STARTUP_PAGE;
                return;
            }
            ScreenManager.startupScreen = new AssertionSearchScreen(null);
            CassManagerScreen.showLoginModalIfReload();
        }
    });
})();
var AssertionEditScreen = function(data) {
    CassManagerScreen.call(this);
    this.data = data;
};
AssertionEditScreen = stjs.extend(AssertionEditScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "assertionEdit";
    prototype.data = null;
    prototype.getDisplayName = function() {
        return AssertionEditScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/assertionEdit.html";
    };
}, {data: "Object", data: "Object", reloadLoginCallback: {name: "Callback1", arguments: ["Object"]}, reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + AssertionEditScreen.displayName)) {
            var urlParameters = (URLParams.getParams());
            var id = urlParameters["id"];
            if (id != null) {
                EcAssertion.get(id, function(data) {
                    ScreenManager.replaceScreen(new AssertionEditScreen(data), CassManagerScreen.reloadShowLoginCallback, urlParameters);
                }, function(p1) {
                    ScreenManager.replaceScreen(new AssertionSearchScreen(null), CassManagerScreen.reloadShowLoginCallback, urlParameters);
                });
                ScreenManager.startupScreen = ScreenManager.LOADING_STARTUP_PAGE;
                return;
            }
            ScreenManager.startupScreen = new AssertionEditScreen(null);
            CassManagerScreen.showLoginModalIfReload();
        }
    });
})();
