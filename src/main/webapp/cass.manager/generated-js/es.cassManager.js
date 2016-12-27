/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
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
var AppMenu = function() {
    EcView.call(this);
};
AppMenu = stjs.extend(AppMenu, EcView, [], function(constructor, prototype) {
    prototype.getHtmlLocation = function() {
        return "partial/other/appMenu.html";
    };
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
}, {data: "EcRemoteLinkedData", closeCallback: {name: "Callback1", arguments: ["EcRollupRule"]}, onClose: "Callback0"}, {});
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
}, {callback: {name: "Callback1", arguments: ["Object"]}, onClose: "Callback0"}, {});
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
}, {data: "Object", callback: "Callback0", onClose: "Callback0"}, {});
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
}, {onClose: "Callback0"}, {});
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
}, {confirmCallback: "Callback0", onClose: "Callback0"}, {});
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
}, {field: "Object", onClose: "Callback0"}, {});
var AddServerModal = function(modalClose) {
    EcModal.call(this);
    this.onClose = modalClose;
};
AddServerModal = stjs.extend(AddServerModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.onClose = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/addServer.html";
    };
}, {onClose: "Callback0", onClose: "Callback0"}, {});
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
}, {changeObj: "Object", onClose: "Callback0"}, {});
var ContactAcceptModal = function(grant, close) {
    EcModal.call(this);
    this.grant = grant;
    this.onClose = close;
};
ContactAcceptModal = stjs.extend(ContactAcceptModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.grant = null;
    prototype.onClose = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/contactAccept.html";
    };
}, {grant: "EcContactGrant", onClose: "Callback0", onClose: "Callback0"}, {});
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
}, {data: "EcRemoteLinkedData", onClose: "Callback0"}, {});
var MessageModal = function(header, text, size, okCallback) {
    EcModal.call(this);
    this.header = header;
    this.message = text;
    this.modalSize = size;
    this.okCallback = okCallback;
};
MessageModal = stjs.extend(MessageModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.header = null;
    prototype.message = null;
    prototype.okCallback = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/message.html";
    };
}, {okCallback: "Callback0", onClose: "Callback0"}, {});
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
}, {field: "Object", onClose: "Callback0"}, {});
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
}, {data: "EcRemoteLinkedData", closeCallback: {name: "Callback1", arguments: ["EcLevel"]}, onClose: "Callback0"}, {});
/**
 *  Stub for the AddCompetenciesToFrameworkModal
 *  
 *  @module cass.manager
 *  @author devlin.junker@eduworks.com
 *  @class AddCompetenciesToFrameworkModal
 *  @extends EcModal
 *  @constructor
 */
var AddCompetenciesToFrameworkModal = /**
 *  @constructor
 *  @param {EcRemoteLinkedData || EcRemoteLinkedData[]} data
 *  			The competency or array of competencies to add to the framework selected in the modal
 */
function(data) {
    EcModal.call(this);
    this.data = data;
};
AddCompetenciesToFrameworkModal = stjs.extend(AddCompetenciesToFrameworkModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "medium";
    prototype.data = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/addToFramework.html";
    };
}, {data: "EcRemoteLinkedData", onClose: "Callback0"}, {});
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
}, {onClose: "Callback0"}, {});
var LoginModal = function(success, cancel, warningMessage) {
    EcModal.call(this);
    this.loginSuccess = success;
    this.onClose = cancel;
    this.warning = warningMessage;
};
LoginModal = stjs.extend(LoginModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.onClose = null;
    prototype.loginSuccess = null;
    prototype.warning = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/login.html";
    };
}, {onClose: "Callback0", loginSuccess: {name: "Callback1", arguments: ["Object"]}, onClose: "Callback0"}, {});
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
}, {onClose: "Callback0"}, {});
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
}, {data: "EcRemoteLinkedData", onCancel: "Callback0", onClose: "Callback0"}, {});
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
}, {evidence: {name: "Array", arguments: [null]}, onClose: "Callback0"}, {});
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
}, {data: "EcRemoteLinkedData", saveCallback: {name: "Callback1", arguments: ["Object"]}, onClose: "Callback0"}, {});
var ContactGrantModal = function(contact, token, signature, close) {
    EcModal.call(this);
    this.contact = contact;
    this.token = token;
    this.signature = signature;
    this.onClose = close;
};
ContactGrantModal = stjs.extend(ContactGrantModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.contact = null;
    prototype.token = null;
    prototype.signature = null;
    prototype.onClose = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/contactGrant.html";
    };
}, {contact: "EcContact", onClose: "Callback0", onClose: "Callback0"}, {});
/**
 *  Manages the current user's logged in state and interfaces with the server to 
 *  sign in/out and create users
 *  
 *  @module cass.manager
 *  @class LoginController
 *  @constructor
 *  
 *  @author devlin.junker@eduworks.com
 */
var LoginController = function() {};
LoginController = stjs.extend(LoginController, null, [], function(constructor, prototype) {
    prototype.loginServer = null;
    prototype.identity = null;
    constructor.refreshLoggedIn = false;
    constructor.loggedIn = false;
    constructor.admin = false;
    constructor.storageSystem = null;
    /**
     *  Setter for the boolean flag of whether or not a user is loged in
     *  
     *  @method setLoggedIn
     *  @static
     *  @param {boolean} val 
     *  			true if signed in, false if logged out
     */
    constructor.setLoggedIn = function(val) {
        LoginController.loggedIn = val;
        if (LoginController.storageSystem != null) 
            LoginController.storageSystem["cass.login"] = val;
    };
    /**
     *  Getter for boolean flag of whether or not user is logged in
     *  
     *  @method getLoggedin
     *  @static
     *  @return {boolean} 
     *  			true if signed in, false if logged out
     */
    constructor.getLoggedIn = function() {
        return LoginController.loggedIn;
    };
    /**
     *  Setter for boolean flag of whether or not the current user is admin
     *  
     *  @method setAdmin
     *  @param val 
     *  			true = admin, false = not admin
     */
    prototype.setAdmin = function(val) {
        LoginController.admin = val;
    };
    /**
     *  Getter for boolean flag of whether or not current user is admin
     *  
     *  @method getAdmin
     *  @return {boolean}
     *  			true = admin, false = not admin
     */
    prototype.getAdmin = function() {
        return LoginController.admin;
    };
    /**
     *  If the last time the user was using the application, they were signed in this
     *  returns true (used to remind them to sign in again once they return)
     *  
     *  @method getPreviouslyLoggedIn
     *  @static
     *  @return {boolean}
     *  		true if previously signed in, false if not signed in last time, or user is here for
     *  		the first time from this computer
     */
    constructor.getPreviouslyLoggedIn = function() {
        return LoginController.refreshLoggedIn;
    };
    prototype.setLoginServer = function(loginServer) {
        this.loginServer = loginServer;
    };
    /**
     *  Validates a username and password on the server and then parses the user's credentials and
     *  checks if they have an admin key. Also tells the identity manager to check for contacts in
     *  local storage after signed in.
     *  
     *  @method login
     *  @param {String} username 
     *  			username of the user signing in
     *  @param {String} password
     *  			password of the user signing in
     *  @param {String} success 
     *  			callback on successful login
     *  @param {String} failure
     *  			callback on error during login
     */
    prototype.login = function(username, password, success, failure) {
        var identityManager = this.identity;
        var that = this;
        this.loginServer.startLogin(username, password);
        this.loginServer.fetch(function(p1) {
            EcIdentityManager.readContacts();
            EcRepository.cache = new Object();
            LoginController.setLoggedIn(true);
            if (EcIdentityManager.ids.length > 0) {
                identityManager.select(EcIdentityManager.ids[0].ppk.toPem());
                that.loginServer.fetchServerAdminKeys(function(keys) {
                    for (var i = 0; i < EcIdentityManager.ids.length; i++) {
                        if (keys.indexOf(EcIdentityManager.ids[i].ppk.toPk().toPem()) != -1) {
                            that.setAdmin(true);
                            break;
                        }
                        that.setAdmin(false);
                    }
                    success();
                }, function(p1) {});
            } else {
                success();
            }
        }, function(p1) {
            failure(p1);
        });
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
        LoginController.setLoggedIn(false);
        EcIdentityManager.ids = new Array();
        EcIdentityManager.clearContacts();
        this.setAdmin(false);
    };
    /**
     *  Creates a new user and saves the account details on the login server, then signs in
     *  to the new account on successful creation
     *  
     *  @method create
     *  @param {String} username
     *  			username of the new account
     *  @param {String} password
     *  			password of the new account
     *  @param {Callback0} success
     *  			callback for successful creation and sign in 
     *  @param {Callback1<String>} failure
     *  			callback for error during creation
     */
    prototype.create = function(username, password, success, failure) {
        this.loginServer.startLogin(username, password);
        var me = this;
        this.loginServer.create(function(p1) {
            me.login(username, password, success, failure);
        }, function(p1) {
            failure(p1);
        }, function() {
            return "";
        });
    };
    /**
     *  Saves the users credentials and contacts to the server
     *  
     *  @method save
     *  @param {Callback0} success
     *  			callback for successful save
     *  @param {Callback1<String>} failure
     *  			callback for error during save
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
}, {loginServer: "EcRemoteIdentityManager", identity: "IdentityController", storageSystem: "Storage"}, {});
(function() {
    if (localStorage != null) 
        LoginController.storageSystem = localStorage;
     else if (sessionStorage != null) 
        LoginController.storageSystem = sessionStorage;
    if (LoginController.storageSystem["cass.login"] != null) {
        LoginController.refreshLoggedIn = LoginController.storageSystem["cass.login"] == "true" ? true : false;
        LoginController.storageSystem["cass.login"] = false;
    }
})();
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
    constructor.returnLoginMessage = "For Your Security, You are Logged Out on Page Reload. Please Enter Your Credentials to Continue Logged In.";
    constructor.defaultServerUrl = "https://sandbox.service.cassproject.org/";
    constructor.defaultServerName = "CASS Sandbox";
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
        }, function(p1) {
            console.error("Unable to load settings file");
        });
    };
}, {}, {});
/**
 *  Manages the server that the search controller (through EcRepository) and
 *  the identity controller (through EcIdentityManager) communicate with. 
 *  Allows the user to change the server that the UI is talking with via the change server modal.
 *  
 *  @module cass.manager
 *  @class ServerController
 *  @constructor
 *  
 *  @author devlin.junker@eduworks.com
 */
var ServerController = /**
 *  On Startup:
 *  	1) See if repo on this server, if so add the server given and the found server to the list
 *   2) Determine storage system to load/save list of other servers 
 *   3) Switch to a previously selected server if the UI has been used before on this browser
 *   4) Set interfaces to point at endpoint
 *  
 *  @constructor
 *  @param {String} defaultServer
 *  			Base URL of the service end points on the server
 *  @param {String} defaultServerName
 *  			Name of the Default Server (displayed to the user when selecting servers)
 */
function(defaultServer, defaultServerName) {
    this.serverList = {};
    this.repoInterface = new EcRepository();
    this.remoteIdentityManager = new EcRemoteIdentityManager();
    if (localStorage != null) 
        this.storageSystem = localStorage;
     else if (sessionStorage != null) 
        this.storageSystem = sessionStorage;
    this.repoInterface.autoDetectRepository();
    EcRepository.caching = true;
    if (this.repoInterface.selectedServer != null) {
        this.addServer(defaultServerName, defaultServer, null, null);
        defaultServer = this.repoInterface.selectedServer;
        defaultServerName = "This Server (" + window.location.host + ")";
        this.addServer(defaultServerName, defaultServer, null, null);
    }
    var cachedList = this.storageSystem["cass.server.list"];
    if (cachedList != null) {
        cachedList = JSON.parse(cachedList);
        for (var serverName in (cachedList)) {
            this.addServer(serverName, (cachedList)[serverName], null, null);
        }
    }
    var cachedSelected = this.storageSystem["cass.server.selected"];
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
    this.storageSystem["cass.server.selected"] = this.selectedServerName;
    if (this.serverList[this.selectedServerName] == null) 
        this.addServer(this.selectedServerName, this.selectedServerUrl, null, null);
    this.remoteIdentityManager.setDefaultIdentityManagementServer(this.selectedServerUrl);
    this.remoteIdentityManager.configureFromServer(null, function(p1) {
        alert(p1);
    });
    this.repoInterface.selectedServer = this.selectedServerUrl;
};
ServerController = stjs.extend(ServerController, null, [], function(constructor, prototype) {
    prototype.serverList = null;
    prototype.storageSystem = null;
    prototype.selectedServerUrl = null;
    prototype.selectedServerName = null;
    prototype.repoInterface = null;
    prototype.remoteIdentityManager = null;
    /**
     *  Adds a server to this list of servers that can be selected from the change server modal
     *  
     *  @method addServer
     *  @param {String} name
     *  			Name of the server to be displayed in the list
     *  @param {String} url
     *  			URL of the server that corresponds to the name
     *  @param {Callback0} success
     *  			Callback when the server is successfully added to the list
     *  @param {Callback1<String>} failure
     *  			Callback for any errors during adding to the list
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
        this.storageSystem["cass.server.list"] = JSON.stringify(this.serverList);
        if (success != null) 
            success();
    };
    /**
     *  Sets the server that the UI will communicate with, changes where the EcRepository and 
     *  EcRemoteIdentity Manager are pointing to and communicating with
     *  
     *  @method selectServer
     *  @param {String} identifier
     *  			Name of the server that was selected from the list, used to find URL to point at
     *  @param {Callback0} success
     *  			Callback when successfully change where the components are pointing and set the
     *  			selected server values
     *  @param {Callback1<String>} failure
     *  			Callback if any errors occur during changing where the components are pointing
     */
    prototype.selectServer = function(identifier, success, failure) {
        if (LoginController.getLoggedIn()) {
            LoginController.setLoggedIn(false);
        }
        var that = this;
        var oldServer = this.selectedServerUrl;
        var oldServerName = this.selectedServerName;
        for (var serverName in this.serverList) {
            if (identifier.equals(serverName) || identifier.equals(this.serverList[serverName])) {
                this.selectedServerName = serverName;
                this.selectedServerUrl = this.serverList[serverName];
                if (this.repoInterface != null) 
                    this.repoInterface.selectedServer = this.selectedServerUrl;
                if (this.remoteIdentityManager != null) 
                    this.remoteIdentityManager.setDefaultIdentityManagementServer(this.selectedServerUrl);
                this.remoteIdentityManager.configureFromServer(function(p1) {
                    that.storageSystem["cass.server.selected"] = that.selectedServerName;
                    if (success != null) 
                        success();
                }, function(p1) {
                    if (that.repoInterface != null) 
                        that.repoInterface.selectedServer = oldServer;
                    if (that.remoteIdentityManager != null) 
                        that.remoteIdentityManager.setDefaultIdentityManagementServer(oldServer);
                    that.selectedServerUrl = oldServer;
                    that.selectedServerName = oldServerName;
                    that.remoteIdentityManager.configureFromServer(null, null);
                    if (failure != null) 
                        failure(p1);
                });
                return;
            }
        }
        if (failure != null) 
            failure("Unable to select server requested: " + identifier);
    };
    /**
     *  Used to retrieve the interface to the repository we are currently pointed at
     *  
     *  @method getRepoInterface
     *  @return {EcRepository}
     *  			Repository Interface to call search/get/delete methods on
     */
    prototype.getRepoInterface = function() {
        return this.repoInterface;
    };
    /**
     *  Used during setup to set which EcRepository the server controller manages
     *  
     *  @method setRepoInterface
     *  @param {EcRepository} repoInterface
     *  			The interface to the repository to be used by the search controller
     */
    prototype.setRepoInterface = function(repoInterface) {
        this.repoInterface = repoInterface;
        repoInterface.selectedServer = this.selectedServerUrl;
    };
    prototype.getRemoteIdentityManager = function() {
        return this.remoteIdentityManager;
    };
    /**
     *  Used during setup to set which EcRemoteIdentityManager the server controller manages
     *  
     *  @method setRemoteIdentityManager
     *  @param {EcRemoteIdentityManager} loginServer
     *  			The interface to the server for managing identities and logging in with
     *  			the identity controller and login controller
     */
    prototype.setRemoteIdentityManager = function(loginServer) {
        this.remoteIdentityManager = loginServer;
        this.remoteIdentityManager.setDefaultIdentityManagementServer(this.selectedServerUrl);
        this.remoteIdentityManager.configureFromServer(null, function(p1) {
            alert(p1);
        });
    };
}, {serverList: {name: "Map", arguments: [null, null]}, storageSystem: "Storage", repoInterface: "EcRepository", remoteIdentityManager: "EcRemoteIdentityManager"}, {});
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
            currentScreen.setData(EcView.urlParameters());
         else 
            currentScreen.setData(o);
        ScreenManager.replaceScreen(currentScreen, null, null);
    };
    constructor.reloadShowLoginCallback = function() {
        CassManagerScreen.showLoginModalIfReload();
    };
    constructor.showLoginModalIfReload = function() {
        if (LoginController.getPreviouslyLoggedIn() && !LoginController.getLoggedIn()) {
            ModalManager.showModal(new LoginModal(CassManagerScreen.reloadLoginCallback, null, AppSettings.returnLoginMessage), null);
        }
    };
}, {data: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
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
}, {lastViewed: "Object", data: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + AssertionSearchScreen.displayName)) {
            ScreenManager.startupScreen = new AssertionSearchScreen(null);
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
}, {lastViewed: "Object", data: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
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
}, {data: "Object", data: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + RepoCreateScreen.displayName)) {
            ScreenManager.startupScreen = new RepoCreateScreen(null);
            CassManagerScreen.showLoginModalIfReload();
        }
    });
})();
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
}, {lastViewed: "Object", data: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
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
}, {lastViewed: "Object", data: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
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
}, {lastViewed: "Object", types: {name: "Array", arguments: [null]}, data: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + RepoSearchScreen.displayName)) {
            var urlParameters = (EcView.urlParameters());
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
}, {data: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + FileManagerScreen.displayName)) {
            ScreenManager.startupScreen = new FileManagerScreen();
            CassManagerScreen.showLoginModalIfReload();
        }
    });
})();
var WelcomeScreen = function() {
    CassManagerScreen.call(this);
};
WelcomeScreen = stjs.extend(WelcomeScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "welcome";
    prototype.getDisplayName = function() {
        return WelcomeScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/welcome.html";
    };
}, {data: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
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
}, {data: "Object", data: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + AssertionEditScreen.displayName)) {
            var urlParameters = (EcView.urlParameters());
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
}, {data: "Object", data: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + RelationshipViewScreen.displayName)) {
            var urlParameters = (EcView.urlParameters());
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
}, {data: "Object", data: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + RelationshipEditScreen.displayName)) {
            var urlParameters = (EcView.urlParameters());
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
            ScreenManager.startupScreen = new RelationshipEditScreen(null);
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
}, {data: "Object", data: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + FrameworkEditScreen.displayName)) {
            var urlParameters = (EcView.urlParameters());
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
}, {data: "Object", data: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + AssertionViewScreen.displayName)) {
            var urlParameters = (EcView.urlParameters());
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
}, {data: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + CompetencyEditScreen.displayName)) {
            var urlParameters = (EcView.urlParameters());
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
}, {data: "Object", data: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + RepoViewScreen.displayName)) {
            var urlParameters = (EcView.urlParameters());
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
    constructor.serverController = new ServerController(AppSettings.defaultServerUrl, AppSettings.defaultServerName);
    /**
     *  Manages the current user's identities and contacts through the
     *  KBAC libraries. 
     *  
     *  @property identityController
     *  @static
     *  @type IdentityController
     */
    constructor.identityController = new IdentityController();
    /**
     *  Handles the login/logout and admin communications with the server.
     *  
     *  @property loginController
     *  @static
     *  @type LoginController
     */
    constructor.loginController = new LoginController();
    /**
     *  Entry point of the application
     *  
     *  @param {String[]} args
     *  			Not used at all...
     */
    constructor.main = function(args) {
        AppSettings.loadSettings();
        AppController.loginController.setLoginServer(AppController.serverController.getRemoteIdentityManager());
        AppController.loginController.identity = AppController.identityController;
        ScreenManager.setDefaultScreen(new WelcomeScreen());
        $(window.document).ready(function(arg0, arg1) {
            ViewManager.showView(new AppMenu(), AppController.topBarContainerId, function() {
                ($(window.document)).foundation();
            });
            return true;
        });
    };
}, {serverController: "ServerController", identityController: "IdentityController", loginController: "LoginController"}, {});
if (!stjs.mainCallDisabled) 
    AppController.main();
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
}, {data: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + UserIdentityScreen.displayName)) {
            var hashSplit = (window.document.location.hash.split("?"));
            if (LoginController.getPreviouslyLoggedIn() || (hashSplit.length == 2 && hashSplit[1].startsWith("action"))) {
                ScreenManager.startupScreen = new UserIdentityScreen();
                ModalManager.showModal(new LoginModal(function(o) {
                    ModalManager.hideModal();
                }, function() {
                    if (!LoginController.getLoggedIn()) {
                        ScreenManager.replaceScreen(new WelcomeScreen(), null, null);
                    } else {
                        ScreenManager.reloadCurrentScreen(null);
                    }
                }, AppSettings.returnLoginMessage), null);
            }
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
    prototype.display = function(containerId) {
        if (this.getData().id != null) {
            var params = new Object();
            (params)["id"] = this.getData().id;
            ScreenManager.setScreenParameters(params);
        }
        ViewManager.showView(this.mc = new MessageContainer("frameworkView"), "#frameworkViewMessageContainer", null);
        this.autoConfigure($(containerId));
        var me = this;
        EcFramework.get(this.getData().id, function(framework) {
            me.data = framework;
            me.predisplayFramework(function() {
                me.bindControls();
            });
        }, function(msg) {
            EcFramework.get(EcRemoteLinkedData.trimVersionFromUrl(me.getData().id), function(framework) {
                me.data = framework;
                me.predisplayFramework(function() {
                    me.bindControls();
                });
            }, function(msg) {
                me.errorRetrieving(msg);
            });
        });
    };
    prototype.predisplayFramework = function(callback) {
        var me = this;
        AppController.serverController.getRepoInterface().precache(this.getData().competency, function() {
            AppController.serverController.getRepoInterface().precache(me.getData().relation, function() {
                AppController.serverController.getRepoInterface().precache(me.getData().level, function() {
                    me.autoRemove($("body"), "framework");
                    me.autoAppend($("body"), "framework");
                    me.autoFill($("body"), me.getData());
                    me.displayVisualization();
                    callback();
                });
            });
        });
    };
    prototype.deleteFramework = function() {
        var me = this;
        ModalManager.showModal(new ConfirmModal(function() {
            me.getData()._delete(function(p1) {
                ScreenManager.changeScreen(new FrameworkSearchScreen(null, null, null), null, null, null);
            }, function(err) {
                if (err == null) 
                    err = "Unable to connect to server to delete framework";
                me.mc.displayAlert(err, null);
            });
            ModalManager.hideModal();
        }, "Are you sure you want to delete this framework?", null), null);
    };
    prototype.errorRetrieving = function(err) {
        if (err == null) 
            err = "Unable to Connect to Server to Retrieve Framework";
        this.mc.displayAlert(err, "getFramework");
    };
    prototype.displayVisualization = function() {};
    prototype.bindControls = function() {};
}, {mc: "MessageContainer", data: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + FrameworkViewScreen.displayName)) {
            var urlParameters = (EcView.urlParameters());
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
        EcCompetency.get(this.getData().id, function(framework) {
            me.data = framework;
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
}, {data: "Object", mc: "MessageContainer", data: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + CompetencyViewScreen.displayName)) {
            var urlParameters = (EcView.urlParameters());
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
}, {data: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + UserAdminScreen.displayName)) {
            var hashSplit = (window.document.location.hash.split("?"));
            if (LoginController.getPreviouslyLoggedIn() || (hashSplit.length == 2 && hashSplit[1].startsWith("action"))) {
                ScreenManager.startupScreen = ScreenManager.LOADING_STARTUP_PAGE;
                ModalManager.showModal(new LoginModal(function(o) {
                    ModalManager.hideModal();
                    if (!AppController.loginController.getAdmin()) {
                        ScreenManager.replaceScreen(new UserIdentityScreen(), null, null);
                    } else {
                        ScreenManager.replaceScreen(new UserAdminScreen(), null, null);
                    }
                }, function() {
                    if (!LoginController.getLoggedIn()) {
                        ScreenManager.replaceScreen(new WelcomeScreen(), null, null);
                    } else if (LoginController.admin) {
                        ScreenManager.replaceScreen(new UserAdminScreen(), null, null);
                    } else {
                        ScreenManager.reloadCurrentScreen(null);
                    }
                }, AppSettings.returnLoginMessage), null);
            }
        }
    });
})();
