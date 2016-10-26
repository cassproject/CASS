/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
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
var AddFieldModal = function(field, repoEditContainer) {
    EcModal.call(this);
    this.field = field;
    this.repoEditContainer = repoEditContainer;
};
AddFieldModal = stjs.extend(AddFieldModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.field = null;
    prototype.repoEditContainer = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/addField.html";
    };
}, {field: "Object", onClose: "Callback0"}, {});
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
var AddCompetenciesToFrameworkModal = function(data, callback) {
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
var ConfirmModal = function(confirmCallback, message) {
    EcModal.call(this);
    this.confirmCallback = confirmCallback;
    this.message = message;
};
ConfirmModal = stjs.extend(ConfirmModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "tiny";
    prototype.message = null;
    prototype.confirmCallback = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/confirm.html";
    };
}, {confirmCallback: "Callback0", onClose: "Callback0"}, {});
var ChangeTypeModal = function(repoEditContainer) {
    EcModal.call(this);
    this.repoEditContainer = repoEditContainer;
};
ChangeTypeModal = stjs.extend(ChangeTypeModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.repoEditContainer = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/changeType.html";
    };
}, {onClose: "Callback0"}, {});
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
var RepoEdit = function(data, saveButtonId, messageContainerId) {
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
        ($(containerId)).foundation();
        this.switchId = containerId + "-switch";
        if (this.switchName == null) 
            this.switchName = this.switchId.substring(1);
        $(containerId).find(".switch-input").prop("id", this.switchId.substring(1));
        $(containerId).find(".switch-input").prop("name", this.switchName);
        $(containerId).find(".switch-paddle").prop("for", this.switchName);
        if (this.switched) 
            $(this.switchId).prop("checked", this.switched);
        var me = this;
        $(this.switchId).change(stjs.bind(this, function(ev, THIS) {
            me.switched = !me.switched;
            if (me.onSwitch != null) 
                return me.onSwitch(ev, THIS);
            return true;
        }, 1));
    };
    prototype.isChecked = function() {
        return $(this.switchId).prop("checked");
    };
    prototype.setChecked = function(checked) {
        $(this.switchId).prop("checked", checked);
    };
}, {onSwitch: "EventHandler"}, {});
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
}, {}, {});
/**
 *  Manages the current user's logged in state and interfaces with the server to 
 *  sign in/out and create users
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
     *  Setter for the boolean flag of whether or not a user is signed in
     *  
     *  @param val 
     *  			true if signed in, false if signed out
     */
    constructor.setLoggedIn = function(val) {
        LoginController.loggedIn = val;
        if (LoginController.storageSystem != null) 
            LoginController.storageSystem["cass.login"] = val;
    };
    /**
     *  @return boolean whether or not the the user is logged in
     */
    constructor.getLoggedIn = function() {
        return LoginController.loggedIn;
    };
    /**
     *  Setter for boolean flag of whether or not the current user is admin
     *  @param val 
     *  			true = admin, false = not admin
     */
    prototype.setAdmin = function(val) {
        LoginController.admin = val;
    };
    /**
     *  @return - whether or not the current user is admin
     */
    prototype.getAdmin = function() {
        return LoginController.admin;
    };
    /**
     *  If the last time the user was using the application, they were signed in this
     *  returns true (used to remind them to sign in again once they return)
     *  
     *  @return true if previously signed in, false if not signed in last time, or user is here for
     *  the first time from this computer
     */
    constructor.getPreviouslyLoggedIn = function() {
        return LoginController.refreshLoggedIn;
    };
    /**
     *  Validates a username and password on the server and then parses the user's credentials and
     *  checks if they have an admin key. Also tells the identity manager to check for contacts in
     *  local storage after signed in.
     *  
     *  @param username 
     *  			username of the user signing in
     *  @param password
     *  			password of the user signing in
     *  @param success 
     *  			callback on successful login
     *  @param failure
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
     *  @param username
     *  			username of the new account
     *  @param password
     *  			password of the new account
     *  @param success
     *  			callback for successful creation and sign in 
     *  @param failure
     *  			callback for error during creation
     */
    prototype.create = function(username, password, success, failure) {
        this.loginServer.startLogin(username, password);
        var me = this;
        this.loginServer.create(function(p1) {
            me.login(username, password, success, failure);
        }, function(p1) {
            failure(p1);
        }, new (stjs.extend(function LoginController$5() {
            EcCallbackReturn0.call(this);
        }, EcCallbackReturn0, [], function(constructor, prototype) {
            prototype.callback = function() {
                return "";
            };
        }, {}, {}))());
    };
    /**
     *  Saves the users credentials and contacts to the server
     *  
     *  @param success
     *  			callback for successful save
     *  @param failure
     *  			callback for error during save
     */
    prototype.save = function(success, failure) {
        this.loginServer.commit(function(p1) {
            success();
        }, function(p1) {
            failure(p1);
        }, new (stjs.extend(function LoginController$8() {
            EcCallbackReturn0.call(this);
        }, EcCallbackReturn0, [], function(constructor, prototype) {
            prototype.callback = function() {
                return null;
            };
        }, {}, {}))());
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
var AppSettings = function() {};
AppSettings = stjs.extend(AppSettings, null, [], function(constructor, prototype) {
    constructor.FIELD_MSG_RETURN = "returnLoginMessage";
    constructor.FIELD_SERVER_URL = "defaultServerUrl";
    constructor.FIELD_SERVER_NAME = "defaultServerName";
    constructor.returnLoginMessage = "For Your Security, You are Logged Out on Page Reload. Please Enter Your Credentials to Continue Logged In.";
    constructor.defaultServerUrl = "https://sandbox.service.cassproject.org/";
    constructor.defaultServerName = "CASS Sandbox";
    constructor.loadSettings = function() {
        var urlBase = window.location.host + window.location.pathname;
        if (urlBase.startsWith("localhost")) 
            urlBase = "http://" + urlBase;
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
 *  Manages the current selected identity for the user, and interfaces the Identity Manager to 
 *  provide helper functions for ownership and user identification
 *  
 *  @author devlin.junker@eduworks.com
 */
var IdentityController = function() {};
IdentityController = stjs.extend(IdentityController, null, [], function(constructor, prototype) {
    prototype.selectedIdentity = null;
    /**
     *  Sets the currently selected identity to the ppk specified, only works if the ppk is in the 
     *  list of identities that the user owns
     *  
     *  @param ppkPem
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
     */
    prototype.unselect = function() {
        this.selectedIdentity = null;
    };
    /**
     *  Returns the contact that is associated with the PEM given, looks at both the user's
     *  identities and contacts to match the PEM. The Contact returned will contain the display
     *  name that the user set for the PEM
     *  
     *  @param pkPem 
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
        var newContact = new EcContact();
        newContact.pk = candidatePk;
        newContact.displayName = "Unknown";
        return newContact;
    };
    /**
     *  Adds a Key to the list of user identities managed by the EcIdentityManager
     *  
     *  @param ppk
     *  			Key to save to user identities
     *  @param displayName 
     *  			Name to associate with the key to be saved, to identify it
     *  @param success
     *  			Callback function once the key has been added
     */
    prototype.addKey = function(ppk, displayName, success) {
        var ident = new EcIdentity();
        ident.ppk = EcPpk.fromPem(ppk);
        ident.displayName = displayName;
        EcIdentityManager.addIdentity(ident);
        success();
    };
    /**
     *  Generates a new Encryption Key to save to the identity manager list
     *  
     *  @param success
     *  			callback, once they key has been generated and added to the identity manager
     *  @param displayName
     *  			display name for the key that is being generated to identify it
     */
    prototype.generateIdentity = function(success, displayName) {
        EcPpk.generateKeyAsync(function(p1) {
            var ident = new EcIdentity();
            ident.ppk = p1;
            if (displayName != null && displayName != "") 
                ident.displayName = displayName;
            EcIdentityManager.addIdentity(ident);
            success(ident);
        });
    };
    /**
     *  Helper function to determine if the logged in user owns a piece of data from the repository,
     *  useful for showing certain actions
     *  
     *  @param data 
     *  			The object to check for ownership of
     *  @return true if owned, false if not owned by the current user
     */
    prototype.owns = function(data) {
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
     *  @param data
     *  			The object to check for ability to edit
     *  @return true if editable, false if not
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
}, {selectedIdentity: "EcIdentity"}, {});
/**
 *  Manages the server that the search controller (through EcRepository) and
 *  the identity controller (through EcIdentityManager) communicate with. 
 *  Allows the user to change the server that the UI is talking with via the change server modal.
 *  
 *  @author djunker
 */
var ServerController = /**
 *  On Startup, a default server is set when the server controller is created. Also the
 *  storage system is determined to load/save the list of servers that we are aware of
 *  and switch to a previously selected server if the UI has been used before on this browser
 *  
 *  @param defaultServer
 *  			Base URL of the service end points on the server
 *  @param defaultServerName
 *  			Name of the Default Server (displayed to the user when selecting servers)
 */
function(defaultServer, defaultServerName) {
    this.serverList = {};
    if (localStorage != null) 
        this.storageSystem = localStorage;
     else if (sessionStorage != null) 
        this.storageSystem = sessionStorage;
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
};
ServerController = stjs.extend(ServerController, null, [], function(constructor, prototype) {
    prototype.serverList = null;
    prototype.selectedServerUrl = null;
    prototype.selectedServerName = null;
    prototype.storageSystem = null;
    /**
     *  Adds a server to this list of servers that can be selected from the change server modal
     *  
     *  @param name
     *  			Name of the server to be displayed in the list
     *  @param url
     *  			URL of the server that corresponds to the name
     *  @param success
     *  			Callback when the server is successfully added to the list
     *  @param failure
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
     *  @param identifier
     *  			Name of the server that was selected from the list, used to find URL to point at
     *  @param success
     *  			Callback when successfully change where the components are pointing and set the
     *  			selected server values
     *  @param failure
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
    prototype.repoInterface = null;
    prototype.remoteIdentityManager = null;
    /**
     *  Used during setup to set which EcRepository the server controller manages
     *  
     *  @param repoInterface
     *  			The interface to the repository to be used by the search controller
     */
    prototype.setRepoInterface = function(repoInterface) {
        this.repoInterface = repoInterface;
        repoInterface.selectedServer = this.selectedServerUrl;
    };
    /**
     *  Used during setup to set which EcRemoteIdentityManager the server controller manages
     *  
     *  @param loginServer
     *  			The interface to the server for managing identities and logging in with
     *  			the identity controller and login controller
     */
    prototype.setRemoteIdentityManager = function(loginServer) {
        this.remoteIdentityManager = loginServer;
        this.remoteIdentityManager.setDefaultIdentityManagementServer(this.selectedServerUrl);
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
    prototype.autoFill = function(scope, obj) {
        var props = (obj);
        for (var key in props) {
            this.fillInnerString(scope, obj, key);
        }
        for (var key in props) {
            this.fillInnerStringReferences(scope, obj, key);
        }
        for (var key in props) {
            this.fillInnerArray(scope, obj, key);
        }
    };
    prototype.fillInnerString = function(scope, dataObj, key) {
        var a = (dataObj);
        var v = a[key];
        var textTypes = "[ec-field='" + key + "']";
        if ((typeof v) == "string") {
            var s = v;
            var textFieldTypes = scope.find(textTypes);
            var attrFieldTypes = scope.find("[ec-attr-" + key + "]");
            textFieldTypes.text(v).val(v);
            attrFieldTypes.attr(key, v);
            attrFieldTypes.attr(key.toLowerCase(), v);
            if (scope.is("[ec-field='" + key + "']")) 
                scope.text(v);
            if (scope.is("[ec-attr-" + key + "]")) {
                scope.attr(key, v);
                scope.attr(key.toLowerCase(), v);
            }
        }
        if ((typeof v) == "function") {
            if ((v)["length"] == 0) {
                var textFieldTypes = scope.find(textTypes);
                var attrFieldTypes = scope.find("[ec-attr-" + key + "]");
                if (textFieldTypes.length + attrFieldTypes.length > 0) {
                    v = (v).apply(dataObj, new Array(0));
                    textFieldTypes.text(v).val(v);
                    attrFieldTypes.attr(key, v);
                    attrFieldTypes.attr(key.toLowerCase(), v);
                }
            }
        }
    };
    prototype.fillInnerStringReferences = function(scope, dataObj, key) {
        var a = (dataObj);
        var v = a[key];
        if ((typeof v) == "string") {
            var s = v;
            var referenceTypes = scope.find("[ec-reference='" + key + "']");
            if (referenceTypes.length > 0) {
                if (s.startsWith("http")) {
                    var p1 = EcRepository.getBlocking(s);
                    this.autoFill(referenceTypes, p1);
                }
            }
        }
        if ((typeof v) == "function") {}
    };
    prototype.fillInnerArray = function(scope, dataObj, key) {
        var props = (dataObj);
        var v = props[key];
        if (EcArray.isArray(v)) {
            var containers = scope.find("[ec-container='" + key + "']");
            for (var idx = 0; idx < containers.length; idx++) {
                var container = containers.eq(idx);
                var array = v;
                for (var i = 0; i < array.length; i++) {
                    this.fillInnerArrayContainer(scope, dataObj, key, props, container, array, i);
                }
            }
        }
    };
    prototype.fillInnerArrayContainer = function(scope, dataObj, key, props, container, array, i) {
        var arrayValue = array[i];
        if (arrayValue.toLowerCase().startsWith("http")) {
            var p1 = EcRepository.getBlocking(arrayValue);
            if (this.shouldFillInnerArray(props, container, p1)) {
                var newContainer = null;
                newContainer = container.find("[ec-template='" + key + "'][id='" + (p1)["id"] + "']");
                if (newContainer.length == 0) 
                    newContainer = this.autoAppend(container, key);
                this.autoFill(newContainer, p1);
                for (var k2 in props) {
                    this.fillInnerArray(newContainer, dataObj, k2);
                }
            }
        } else if (arrayValue.trim().startsWith("{")) {
            var c = this.autoAppend(scope, key);
            this.autoFill(c, JSON.parse(arrayValue));
        } else {
            var c = this.autoAppend(scope, key);
            c.text(arrayValue);
        }
    };
    prototype.shouldFillInnerArray = function(a, container, p1) {
        var attributes = container[0].attributes;
        var found = false;
        var ok = false;
        for (var j = 0; j < attributes.length; j++) {
            var attr = attributes[j];
            if (attr.name.startsWith("ec-condition-")) {
                found = true;
                var parts = (attr.name.replace("ec-condition-", "")).split("-");
                var parentKey = parts[0];
                var childKey = parts[1];
                var parentValue = container.attr(parentKey);
                var childValue = (p1)[childKey];
                if ((typeof childValue) == "function") 
                    childValue = (childValue).apply(p1, new Array(0));
                if (parentValue == childValue) 
                    ok = true;
            }
        }
        if (!found) 
            return true;
        if (found && !ok) 
            return false;
        if (found && ok) 
            return true;
        return false;
    };
    prototype.autoRemove = function(from, template) {
        from.find("[ec-template='" + template + "']").remove();
    };
    prototype.autoAppend = function(from, template) {
        if (from.is("[ec-container='" + template + "']")) {
            return from.append((this.nameToTemplate)[template]).children().last();
        }
        return from.find("[ec-container='" + template + "']").append((this.nameToTemplate)[template]).children().last();
    };
    prototype.nameToTemplate = null;
    prototype.autoConfigure = function(jQueryCore) {
        if (this.nameToTemplate == null) 
            this.nameToTemplate = new Object();
        var me = this;
        jQueryCore.find("[ec-template]").each(function(p1, p2) {
            me.autoConfigure($(p2));
            if ((me.nameToTemplate)[p2.getAttribute("ec-template")] == null) {
                (me.nameToTemplate)[p2.getAttribute("ec-template")] = (p2)["outerHTML"];
                p2.parentNode.removeChild(p2);
            }
        });
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
}, {data: "Object", nameToTemplate: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0"}, {});
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
}, {lastViewed: "Object", data: "Object", nameToTemplate: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0"}, {});
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
}, {data: "Object", nameToTemplate: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + FileManagerScreen.displayName)) {
            ScreenManager.startupScreen = new FileManagerScreen();
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
}, {lastViewed: "Object", types: {name: "Array", arguments: [null]}, data: "Object", nameToTemplate: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0"}, {});
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
}, {lastViewed: "Object", data: "Object", nameToTemplate: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0"}, {});
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
}, {lastViewed: "Object", data: "Object", nameToTemplate: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0"}, {});
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
}, {data: "Object", data: "Object", nameToTemplate: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + RepoCreateScreen.displayName)) {
            ScreenManager.startupScreen = new RepoCreateScreen(null);
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
}, {lastViewed: "Object", data: "Object", nameToTemplate: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + AssertionSearchScreen.displayName)) {
            ScreenManager.startupScreen = new AssertionSearchScreen(null);
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
}, {data: "Object", nameToTemplate: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0"}, {});
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
}, {data: "Object", data: "Object", nameToTemplate: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0"}, {});
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
}, {data: "Object", data: "Object", nameToTemplate: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0"}, {});
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
}, {data: "Object", data: "Object", nameToTemplate: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0"}, {});
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
}, {data: "Object", data: "Object", nameToTemplate: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0"}, {});
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
}, {data: "Object", nameToTemplate: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0"}, {});
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
}, {data: "Object", data: "Object", nameToTemplate: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0"}, {});
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
}, {data: "Object", data: "Object", nameToTemplate: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0"}, {});
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
var AppController = function() {};
AppController = stjs.extend(AppController, null, [], function(constructor, prototype) {
    constructor.topBarContainerId = "#menuContainer";
    constructor.serverController = null;
    constructor.identityController = new IdentityController();
    constructor.loginController = new LoginController();
    constructor.repoInterface = new EcRepository();
    constructor.loginServer = new EcRemoteIdentityManager();
    constructor.main = function(args) {
        AppSettings.loadSettings();
        AppController.repoInterface.autoDetectRepository();
        EcRepository.caching = true;
        if (AppController.repoInterface.selectedServer == null) {
            AppController.serverController = new ServerController(AppSettings.defaultServerUrl, AppSettings.defaultServerName);
        } else {
            AppController.serverController = new ServerController(AppController.repoInterface.selectedServer, "This Server (" + window.location.host + ")");
            AppController.serverController.addServer(AppSettings.defaultServerName, AppSettings.defaultServerUrl, null, null);
        }
        AppController.serverController.setRepoInterface(AppController.repoInterface);
        AppController.serverController.setRemoteIdentityManager(AppController.loginServer);
        AppController.loginServer.configureFromServer(null, function(p1) {
            alert(p1);
        });
        AppController.loginController.loginServer = AppController.loginServer;
        AppController.loginController.identity = AppController.identityController;
        ScreenManager.setDefaultScreen(new WelcomeScreen());
        EcIdentityManager.clearContacts();
        $(window.document).ready(function(arg0, arg1) {
            ViewManager.showView(new AppMenu(), AppController.topBarContainerId, function() {
                ($(window.document)).foundation();
            });
            return true;
        });
    };
}, {serverController: "ServerController", identityController: "IdentityController", loginController: "LoginController", repoInterface: "EcRepository", loginServer: "EcRemoteIdentityManager"}, {});
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
}, {data: "Object", nameToTemplate: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0"}, {});
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
        this.getData().levels(AppController.repoInterface, function(p1) {
            me.autoFill(me.autoAppend($("[ec-container='level']"), "level"), p1);
        }, (me)["errorFindingLevels"], function(p1) {
            if (p1.length == 0) 
                $("[ec-container='level']").text("None.");
            me.getData().rollupRules(AppController.repoInterface, function(p1) {
                me.autoFill(me.autoAppend($("[ec-container='rollupRule']"), "rollupRule"), p1);
            }, (me)["errorFindingRollupRules"], function(p1) {
                if (p1.length == 0) 
                    $("[ec-container='rollupRule']").text("None.");
                me.getData().relations(AppController.repoInterface, function(p1) {
                    me.autoFill(me.autoAppend($("[ec-container='relation']"), "relation"), p1);
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
}, {data: "Object", mc: "MessageContainer", data: "Object", nameToTemplate: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0"}, {});
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
        AppController.repoInterface.precache(this.getData().competency, function() {
            AppController.repoInterface.precache(me.getData().relation, function() {
                AppController.repoInterface.precache(me.getData().level, function() {
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
        }, "Are you sure you want to delete this framework?"), null);
    };
    prototype.errorRetrieving = function(err) {
        if (err == null) 
            err = "Unable to Connect to Server to Retrieve Framework";
        this.mc.displayAlert(err, "getFramework");
    };
    prototype.displayVisualization = function() {};
    prototype.bindControls = function() {};
}, {mc: "MessageContainer", data: "Object", nameToTemplate: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0"}, {});
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
}, {data: "Object", nameToTemplate: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0"}, {});
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
