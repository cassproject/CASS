/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
var ImportCompetenciesModal = function(data) {
    EcModal.call(this);
    this.data = data;
};
ImportCompetenciesModal = stjs.extend(ImportCompetenciesModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "medium";
    prototype.data = null;
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet");
    };
}, {data: "EcRemoteLinkedData", onClose: "Callback0"}, {});
var SaveIdModal = function(msg) {
    EcModal.call(this);
    this.msg = msg;
};
SaveIdModal = stjs.extend(SaveIdModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "tiny";
    prototype.msg = null;
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet!");
    };
}, {onClose: "Callback0"}, {});
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
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet");
    };
}, {contact: "EcContact", onClose: "Callback0", onClose: "Callback0"}, {});
var ConfirmModal = function(confirmCallback, message) {
    EcModal.call(this);
    this.confirmCallback = confirmCallback;
    this.message = message;
};
ConfirmModal = stjs.extend(ConfirmModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "tiny";
    prototype.message = null;
    prototype.confirmCallback = null;
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet");
    };
}, {confirmCallback: "Callback0", onClose: "Callback0"}, {});
var EditLevelModal = function(data, callback) {
    EcModal.call(this);
    this.data = data;
    this.closeCallback = callback;
};
EditLevelModal = stjs.extend(EditLevelModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.data = null;
    prototype.closeCallback = null;
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet");
    };
}, {data: "EcRemoteLinkedData", closeCallback: {name: "Callback1", arguments: ["EcLevel"]}, onClose: "Callback0"}, {});
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
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet");
    };
}, {onClose: "Callback0", loginSuccess: "Callback0", onClose: "Callback0"}, {});
var CreateUserModal = function() {
    EcModal.call(this);
};
CreateUserModal = stjs.extend(CreateUserModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.display = function(arg0, arg1) {
        console.error("Not Implemented Yet");
    };
}, {onClose: "Callback0"}, {});
var AddServerModal = function(modalClose) {
    EcModal.call(this);
    this.onClose = modalClose;
};
AddServerModal = stjs.extend(AddServerModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.onClose = null;
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet");
    };
}, {onClose: "Callback0", onClose: "Callback0"}, {});
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
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet");
    };
}, {data: "EcRemoteLinkedData", saveCallback: {name: "Callback1", arguments: ["Object"]}, onClose: "Callback0"}, {});
var AddFieldModal = function(field, repoEditContainer) {
    EcModal.call(this);
    this.field = field;
    this.repoEditContainer = repoEditContainer;
};
AddFieldModal = stjs.extend(AddFieldModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.field = null;
    prototype.repoEditContainer = null;
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet");
    };
}, {field: "Object", onClose: "Callback0"}, {});
var CopyResourceModal = function(data, callback) {
    EcModal.call(this);
    this.data = data;
    this.callback = callback;
};
CopyResourceModal = stjs.extend(CopyResourceModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "medium";
    prototype.data = null;
    prototype.callback = null;
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet");
    };
}, {data: "Object", callback: "Callback0", onClose: "Callback0"}, {});
var EvidenceViewModal = function(evidence) {
    EcModal.call(this);
    this.evidence = evidence;
};
EvidenceViewModal = stjs.extend(EvidenceViewModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "medium";
    prototype.evidence = null;
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet");
    };
}, {evidence: {name: "Array", arguments: [null]}, onClose: "Callback0"}, {});
var AddCompetenciesToFrameworkModal = function(data, callback) {
    EcModal.call(this);
    this.data = data;
};
AddCompetenciesToFrameworkModal = stjs.extend(AddCompetenciesToFrameworkModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "medium";
    prototype.data = null;
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet");
    };
}, {data: "EcRemoteLinkedData", onClose: "Callback0"}, {});
var ContactAcceptModal = function(grant, close) {
    EcModal.call(this);
    this.grant = grant;
    this.onClose = close;
};
ContactAcceptModal = stjs.extend(ContactAcceptModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.grant = null;
    prototype.onClose = null;
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet");
    };
}, {grant: "EcContactGrant", onClose: "Callback0", onClose: "Callback0"}, {});
var ChangeServerModal = function() {
    EcModal.call(this);
};
ChangeServerModal = stjs.extend(ChangeServerModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "tiny";
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet");
    };
}, {onClose: "Callback0"}, {});
var ChangeTypeModal = function(repoEditContainer) {
    EcModal.call(this);
    this.repoEditContainer = repoEditContainer;
};
ChangeTypeModal = stjs.extend(ChangeTypeModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.repoEditContainer = null;
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet");
    };
}, {onClose: "Callback0"}, {});
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
                        }
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
var WelcomeScreen = function() {
    EcScreen.call(this);
};
WelcomeScreen = stjs.extend(WelcomeScreen, EcScreen, [], function(constructor, prototype) {
    constructor.displayName = "welcome";
    prototype.display = function(arg0, arg1) {
        console.error("Not Implemented Yet");
    };
    prototype.getDisplayName = function() {
        return WelcomeScreen.displayName;
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
        if (data.owner == null) 
            return false;
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
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet");
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
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet");
    };
}, {callbacks: "Object", dataStore: "Object"}, {});
var AppMenu = function() {
    EcView.call(this);
};
AppMenu = stjs.extend(AppMenu, EcView, [], function(constructor, prototype) {
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet");
    };
}, {}, {});
var MessageContainer = function(idPrefix) {
    EcView.call(this);
    this.prefix = idPrefix;
};
MessageContainer = stjs.extend(MessageContainer, EcView, [], function(constructor, prototype) {
    prototype.prefix = null;
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet");
    };
}, {}, {});
var AppSettings = function() {};
AppSettings = stjs.extend(AppSettings, null, [], function(constructor, prototype) {
    constructor.FIELD_MSG_RETURN = "returnLoginMessage";
    constructor.FIELD_SERVER_URL = "defaultServerUrl";
    constructor.FIELD_SERVER_NAME = "defaultServerName";
    constructor.FIELD_SALT_USER = "userEncryptionSalt";
    constructor.FIELD_SALT_PASS = "passwordEncryptionSalt";
    constructor.FIELD_SALT_SECRET = "secretEncryptionSalt";
    constructor.FIELD_ITERATIONS_USER = "userEncryptionIterations";
    constructor.FIELD_ITERATIONS_PASS = "passwordEncryptionIterations";
    constructor.FIELD_ITERATIONS_SECRET = "secretEncryptionIterations";
    constructor.FIELD_LENGTH_USER = "userEncryptionLength";
    constructor.FIELD_LENGTH_PASS = "passwordEncryptionLength";
    constructor.returnLoginMessage = "For Your Security, You are Logged Out on Page Reload. Please Enter Your Credentials to Continue Logged In.";
    constructor.defaultServerUrl = "https://sandbox.service.cassproject.org/";
    constructor.defaultServerName = "CASS Sandbox";
    constructor.defaultServerUserSalt = "BasicUsernameSalt";
    constructor.defaultServerUserIterations = 5000;
    constructor.defaultServerUserLength = 64;
    constructor.defaultServerPasswordSalt = "BasicPasswordSalt";
    constructor.defaultServerPasswordIterations = 5000;
    constructor.defaultServerPasswordLength = 64;
    constructor.defaultServerSecretSalt = "BasicSecretSalt";
    constructor.defaultServerSecretIterations = 5000;
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
            var salt = (settingsObj)[AppSettings.FIELD_SALT_USER];
            if (salt != null) 
                AppSettings.defaultServerUserSalt = salt;
            salt = null;
            salt = (settingsObj)[AppSettings.FIELD_SALT_PASS];
            if (salt != null) 
                AppSettings.defaultServerPasswordSalt = salt;
            salt = null;
            salt = (settingsObj)[AppSettings.FIELD_SALT_SECRET];
            if (salt != null) 
                AppSettings.defaultServerSecretSalt = salt;
            salt = null;
            var iter = parseInt((settingsObj)[AppSettings.FIELD_ITERATIONS_USER]);
            if (!iter.equals(NaN)) 
                AppSettings.defaultServerUserIterations = iter.intValue();
            iter = parseInt((settingsObj)[AppSettings.FIELD_ITERATIONS_PASS]);
            if (!iter.equals(NaN)) 
                AppSettings.defaultServerPasswordIterations = iter.intValue();
            iter = parseInt((settingsObj)[AppSettings.FIELD_ITERATIONS_SECRET]);
            if (!iter.equals(NaN)) 
                AppSettings.defaultServerSecretIterations = iter.intValue();
            var len = parseInt((settingsObj)[AppSettings.FIELD_LENGTH_USER]);
            if (!len.equals(NaN)) 
                AppSettings.defaultServerUserLength = len.intValue();
            len = parseInt((settingsObj)[AppSettings.FIELD_LENGTH_PASS]);
            if (!len.equals(NaN)) 
                AppSettings.defaultServerPasswordLength = len.intValue();
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
            if (failure != null) 
                failure("Must be logged out to change servers");
        } else {
            for (var serverName in this.serverList) {
                if (identifier.equals(serverName) || identifier.equals(this.serverList[serverName])) {
                    this.selectedServerName = serverName;
                    this.selectedServerUrl = this.serverList[serverName];
                    if (this.repoInterface != null) 
                        this.repoInterface.selectedServer = this.selectedServerUrl;
                    if (this.remoteIdentityManager != null) 
                        this.remoteIdentityManager.setDefaultIdentityManagementServer(this.selectedServerUrl);
                    this.storageSystem["cass.server.selected"] = this.selectedServerName;
                    if (success != null) 
                        success();
                    return;
                }
            }
            if (failure != null) 
                failure("Unable to select server requested: " + identifier);
        }
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
var UserIdentityScreen = function() {
    EcScreen.call(this);
};
UserIdentityScreen = stjs.extend(UserIdentityScreen, EcScreen, [], function(constructor, prototype) {
    constructor.displayName = "identity";
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet!");
    };
    prototype.getDisplayName = function() {
        return UserIdentityScreen.displayName;
    };
}, {}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + UserIdentityScreen.displayName)) {
            var hashSplit = (window.document.location.hash.split("?"));
            if (LoginController.getPreviouslyLoggedIn() || (hashSplit.length == 2 && hashSplit[1].startsWith("action"))) {
                ScreenManager.startupScreen = new UserIdentityScreen();
                ModalManager.showModal(new LoginModal(function() {
                    ModalManager.hideModal();
                }, function() {
                    if (!LoginController.getLoggedIn()) {
                        ScreenManager.replaceScreen(new WelcomeScreen(), null);
                    } else {
                        ScreenManager.reloadCurrentScreen(null);
                    }
                }, AppSettings.returnLoginMessage), null);
            }
        }
    });
})();
var CassManagerScreen = function() {
    EcScreen.call(this);
};
CassManagerScreen = stjs.extend(CassManagerScreen, EcScreen, [], function(constructor, prototype) {
    constructor.reloadLoginCallback = function() {
        ModalManager.hideModal();
        ScreenManager.replaceScreen(ScreenManager.getCurrentScreen(), null);
    };
    constructor.reloadShowLoginCallback = function() {
        CassManagerScreen.showLoginModalIfReload();
    };
    constructor.showLoginModalIfReload = function() {
        if (LoginController.getPreviouslyLoggedIn() && !LoginController.getLoggedIn()) {
            ModalManager.showModal(new LoginModal(CassManagerScreen.reloadLoginCallback, null, AppSettings.returnLoginMessage), null);
        }
    };
}, {reloadLoginCallback: "Callback0", reloadShowLoginCallback: "Callback0"}, {});
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
        if (AppController.repoInterface.selectedServer == null) {
            AppController.serverController = new ServerController(AppSettings.defaultServerUrl, AppSettings.defaultServerName);
        } else {
            AppController.serverController = new ServerController(AppController.repoInterface.selectedServer, "This Server (" + window.location.host + ")");
            AppController.serverController.addServer(AppSettings.defaultServerName, AppSettings.defaultServerUrl, null, null);
        }
        AppController.serverController.setRepoInterface(AppController.repoInterface);
        AppController.serverController.setRemoteIdentityManager(AppController.loginServer);
        AppController.loginServer.configure(AppSettings.defaultServerUserSalt, AppSettings.defaultServerUserIterations, AppSettings.defaultServerUserLength, AppSettings.defaultServerPasswordSalt, AppSettings.defaultServerPasswordIterations, AppSettings.defaultServerPasswordLength, AppSettings.defaultServerSecretSalt, AppSettings.defaultServerSecretIterations);
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
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet!");
    };
    prototype.getDisplayName = function() {
        return RelationshipSearchScreen.displayName;
    };
}, {lastViewed: "Object", reloadLoginCallback: "Callback0", reloadShowLoginCallback: "Callback0"}, {});
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
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet!");
    };
    prototype.getDisplayName = function() {
        return RepoSearchScreen.displayName;
    };
}, {lastViewed: "Object", types: {name: "Array", arguments: [null]}, reloadLoginCallback: "Callback0", reloadShowLoginCallback: "Callback0"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + RepoSearchScreen.displayName)) {
            var hashSplit = (window.document.location.hash.split("?"));
            if (hashSplit.length > 1) {
                var query = null;
                var ownership = null;
                var types = null;
                var param = hashSplit[1];
                var paramSplit = (param.split("&"));
                for (var i = 0; i < paramSplit.length; i++) {
                    var paramPiece = paramSplit[i];
                    if (paramPiece.startsWith("query")) 
                        query = paramSplit[i].split("=")[1];
                     else if (paramPiece.startsWith("ownership")) 
                        ownership = paramSplit[i].split("=")[1];
                     else if (paramPiece.startsWith("types")) 
                        types = (paramSplit[i].split("=")[1].split(","));
                }
                if (query != null || ownership != null || types != null) {
                    ScreenManager.startupScreen = new RepoSearchScreen(null, query, ownership, types);
                    CassManagerScreen.showLoginModalIfReload();
                    return;
                }
            }
            ScreenManager.startupScreen = new RepoSearchScreen(null, null, null, null);
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
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet!");
    };
    prototype.getDisplayName = function() {
        return AssertionSearchScreen.displayName;
    };
}, {lastViewed: "Object", reloadLoginCallback: "Callback0", reloadShowLoginCallback: "Callback0"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + AssertionSearchScreen.displayName)) {
            ScreenManager.startupScreen = new AssertionSearchScreen(null);
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
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet!");
    };
    prototype.getDisplayName = function() {
        return RepoCreateScreen.displayName;
    };
}, {data: "Object", reloadLoginCallback: "Callback0", reloadShowLoginCallback: "Callback0"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + RepoCreateScreen.displayName)) {
            ScreenManager.startupScreen = new RepoCreateScreen(null);
            CassManagerScreen.showLoginModalIfReload();
        }
    });
})();
var FileManagerScreen = function() {
    CassManagerScreen.call(this);
};
FileManagerScreen = stjs.extend(FileManagerScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "fileManager";
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet!");
    };
    prototype.getDisplayName = function() {
        return FileManagerScreen.displayName;
    };
}, {reloadLoginCallback: "Callback0", reloadShowLoginCallback: "Callback0"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + FileManagerScreen.displayName)) {
            ScreenManager.startupScreen = new FileManagerScreen();
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
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet!");
    };
    prototype.getDisplayName = function() {
        return CompetencySearchScreen.displayName;
    };
}, {lastViewed: "Object", reloadLoginCallback: "Callback0", reloadShowLoginCallback: "Callback0"}, {});
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
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet!");
    };
    prototype.getDisplayName = function() {
        return FrameworkSearchScreen.displayName;
    };
}, {lastViewed: "Object", reloadLoginCallback: "Callback0", reloadShowLoginCallback: "Callback0"}, {});
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
var UserAdminScreen = function() {
    EcScreen.call(this);
};
UserAdminScreen = stjs.extend(UserAdminScreen, EcScreen, [], function(constructor, prototype) {
    constructor.displayName = "admin";
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet!");
    };
    prototype.getDisplayName = function() {
        return UserAdminScreen.displayName;
    };
}, {}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + UserAdminScreen.displayName)) {
            var hashSplit = (window.document.location.hash.split("?"));
            if (LoginController.getPreviouslyLoggedIn() || (hashSplit.length == 2 && hashSplit[1].startsWith("action"))) {
                ScreenManager.startupScreen = new UserAdminScreen();
                ModalManager.showModal(new LoginModal(function() {
                    ModalManager.hideModal();
                    if (!AppController.loginController.getAdmin()) {
                        ScreenManager.replaceScreen(new UserIdentityScreen(), null);
                    }
                }, function() {
                    if (!LoginController.getLoggedIn()) {
                        ScreenManager.replaceScreen(new WelcomeScreen(), null);
                    } else if (LoginController.admin) {
                        ScreenManager.replaceScreen(new UserIdentityScreen(), null);
                    } else {
                        ScreenManager.reloadCurrentScreen(null);
                    }
                }, AppSettings.returnLoginMessage), null);
            }
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
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet!");
    };
    prototype.getDisplayName = function() {
        return RelationshipViewScreen.displayName;
    };
}, {data: "Object", reloadLoginCallback: "Callback0", reloadShowLoginCallback: "Callback0"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + RelationshipViewScreen.displayName)) {
            var hashSplit = (window.document.location.hash.split("?"));
            if (hashSplit.length > 1) {
                var firstParam = hashSplit[1];
                if (firstParam.startsWith("id")) {
                    var paramSplit = (firstParam.split("="));
                    if (paramSplit.length > 1) {
                        var id = paramSplit[1];
                        EcAlignment.get(id, function(data) {
                            ScreenManager.replaceScreen(new RelationshipViewScreen(data), CassManagerScreen.reloadShowLoginCallback);
                            CassManagerScreen.showLoginModalIfReload();
                        }, function(p1) {
                            ScreenManager.replaceScreen(new RelationshipSearchScreen(null, null, null), CassManagerScreen.reloadShowLoginCallback);
                            CassManagerScreen.showLoginModalIfReload();
                        });
                        ScreenManager.startupScreen = ScreenManager.LOADING_STARTUP_PAGE;
                        return;
                    }
                }
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
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet!");
    };
    prototype.getDisplayName = function() {
        return RelationshipEditScreen.displayName;
    };
}, {data: "Object", reloadLoginCallback: "Callback0", reloadShowLoginCallback: "Callback0"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + RelationshipEditScreen.displayName)) {
            var hashSplit = (window.document.location.hash.split("?"));
            if (hashSplit.length > 1) {
                var firstParam = hashSplit[1];
                if (firstParam.startsWith("id")) {
                    var paramSplit = (firstParam.split("="));
                    if (paramSplit.length > 1) {
                        var id = paramSplit[1];
                        EcAlignment.get(id, function(data) {
                            ScreenManager.replaceScreen(new RelationshipEditScreen(data), CassManagerScreen.reloadShowLoginCallback);
                        }, function(p1) {
                            ScreenManager.replaceScreen(new RelationshipSearchScreen(null, null, null), CassManagerScreen.reloadShowLoginCallback);
                        });
                        ScreenManager.startupScreen = ScreenManager.LOADING_STARTUP_PAGE;
                        return;
                    }
                }
            }
            ScreenManager.startupScreen = new RelationshipEditScreen(null);
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
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet!");
    };
    prototype.getDisplayName = function() {
        return RepoViewScreen.displayName;
    };
}, {data: "Object", reloadLoginCallback: "Callback0", reloadShowLoginCallback: "Callback0"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + RepoViewScreen.displayName)) {
            var hashSplit = (window.document.location.hash.split("?"));
            if (hashSplit.length > 1) {
                var firstParam = hashSplit[1];
                if (firstParam.startsWith("id")) {
                    var paramSplit = (firstParam.split("="));
                    if (paramSplit.length > 1) {
                        var id = paramSplit[1];
                        EcRepository.get(id, function(data) {
                            ScreenManager.replaceScreen(new RepoViewScreen(data), CassManagerScreen.reloadShowLoginCallback);
                        }, function(p1) {
                            ScreenManager.replaceScreen(new RepoSearchScreen(null, null, null, null), CassManagerScreen.reloadShowLoginCallback);
                        });
                        ScreenManager.startupScreen = ScreenManager.LOADING_STARTUP_PAGE;
                        return;
                    }
                }
            }
            ScreenManager.startupScreen = new RepoSearchScreen(null, null, null, null);
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
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet!");
    };
    prototype.getDisplayName = function() {
        return AssertionEditScreen.displayName;
    };
}, {data: "Object", reloadLoginCallback: "Callback0", reloadShowLoginCallback: "Callback0"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + AssertionEditScreen.displayName)) {
            var hashSplit = (window.document.location.hash.split("?"));
            if (hashSplit.length > 1) {
                var firstParam = hashSplit[1];
                if (firstParam.startsWith("id")) {
                    var paramSplit = (firstParam.split("="));
                    if (paramSplit.length > 1) {
                        var id = paramSplit[1];
                        EcAssertion.get(id, function(data) {
                            ScreenManager.replaceScreen(new AssertionEditScreen(data), CassManagerScreen.reloadShowLoginCallback);
                        }, function(p1) {
                            ScreenManager.replaceScreen(new AssertionSearchScreen(null), CassManagerScreen.reloadShowLoginCallback);
                        });
                        ScreenManager.startupScreen = ScreenManager.LOADING_STARTUP_PAGE;
                        return;
                    }
                }
            }
            ScreenManager.startupScreen = new AssertionEditScreen(null);
            CassManagerScreen.showLoginModalIfReload();
        }
    });
})();
var CompetencyEditScreen = function(data) {
    CassManagerScreen.call(this);
    this.data = data;
};
CompetencyEditScreen = stjs.extend(CompetencyEditScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "competencyEdit";
    prototype.data = null;
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet!");
    };
    prototype.getDisplayName = function() {
        return CompetencyEditScreen.displayName;
    };
}, {data: "Object", reloadLoginCallback: "Callback0", reloadShowLoginCallback: "Callback0"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + CompetencyEditScreen.displayName)) {
            var hashSplit = (window.document.location.hash.split("?"));
            if (hashSplit.length > 1) {
                var firstParam = hashSplit[1];
                if (firstParam.startsWith("id")) {
                    var paramSplit = (firstParam.split("="));
                    if (paramSplit.length > 1) {
                        var id = paramSplit[1];
                        EcCompetency.get(id, function(data) {
                            ScreenManager.replaceScreen(new CompetencyEditScreen(data), CassManagerScreen.reloadShowLoginCallback);
                        }, function(p1) {
                            ScreenManager.replaceScreen(new CompetencySearchScreen(null, null, null), CassManagerScreen.reloadShowLoginCallback);
                        });
                        ScreenManager.startupScreen = ScreenManager.LOADING_STARTUP_PAGE;
                        return;
                    }
                }
            }
            ScreenManager.startupScreen = new CompetencyEditScreen(null);
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
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet!");
    };
    prototype.getDisplayName = function() {
        return AssertionViewScreen.displayName;
    };
}, {data: "Object", reloadLoginCallback: "Callback0", reloadShowLoginCallback: "Callback0"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + AssertionViewScreen.displayName)) {
            var hashSplit = (window.document.location.hash.split("?"));
            if (hashSplit.length > 1) {
                var firstParam = hashSplit[1];
                if (firstParam.startsWith("id")) {
                    var paramSplit = (firstParam.split("="));
                    if (paramSplit.length > 1) {
                        var id = paramSplit[1];
                        EcAssertion.get(id, function(data) {
                            ScreenManager.replaceScreen(new AssertionViewScreen(data), CassManagerScreen.reloadShowLoginCallback);
                            CassManagerScreen.showLoginModalIfReload();
                        }, function(p1) {
                            ScreenManager.replaceScreen(new CompetencySearchScreen(null, null, null), CassManagerScreen.reloadShowLoginCallback);
                            CassManagerScreen.showLoginModalIfReload();
                        });
                        ScreenManager.startupScreen = ScreenManager.LOADING_STARTUP_PAGE;
                        return;
                    }
                }
            }
            ScreenManager.startupScreen = new AssertionSearchScreen(null);
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
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet!");
    };
    prototype.getDisplayName = function() {
        return CompetencyViewScreen.displayName;
    };
}, {data: "Object", reloadLoginCallback: "Callback0", reloadShowLoginCallback: "Callback0"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + CompetencyViewScreen.displayName)) {
            var hashSplit = (window.document.location.hash.split("?"));
            if (hashSplit.length > 1) {
                var firstParam = hashSplit[1];
                if (firstParam.startsWith("id")) {
                    var paramSplit = (firstParam.split("="));
                    if (paramSplit.length > 1) {
                        var id = paramSplit[1];
                        EcCompetency.get(id, function(data) {
                            ScreenManager.replaceScreen(new CompetencyViewScreen(data), CassManagerScreen.reloadShowLoginCallback);
                            CassManagerScreen.showLoginModalIfReload();
                        }, function(p1) {
                            ScreenManager.replaceScreen(new CompetencySearchScreen(null, null, null), CassManagerScreen.reloadShowLoginCallback);
                            CassManagerScreen.showLoginModalIfReload();
                        });
                        ScreenManager.startupScreen = ScreenManager.LOADING_STARTUP_PAGE;
                        return;
                    }
                }
            }
            ScreenManager.startupScreen = new CompetencySearchScreen(null, null, null);
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
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet!");
    };
    prototype.getDisplayName = function() {
        return FrameworkEditScreen.displayName;
    };
}, {data: "Object", reloadLoginCallback: "Callback0", reloadShowLoginCallback: "Callback0"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + FrameworkEditScreen.displayName)) {
            var hashSplit = (window.document.location.hash.split("?"));
            if (hashSplit.length > 1) {
                var firstParam = hashSplit[1];
                if (firstParam.startsWith("id")) {
                    var paramSplit = (firstParam.split("="));
                    if (paramSplit.length > 1) {
                        var id = paramSplit[1];
                        EcFramework.get(id, function(data) {
                            ScreenManager.replaceScreen(new FrameworkEditScreen(data), CassManagerScreen.reloadShowLoginCallback);
                        }, function(p1) {
                            ScreenManager.replaceScreen(new FrameworkSearchScreen(null, null, null), CassManagerScreen.reloadShowLoginCallback);
                        });
                        ScreenManager.startupScreen = ScreenManager.LOADING_STARTUP_PAGE;
                        return;
                    }
                }
            }
            ScreenManager.startupScreen = new FrameworkEditScreen(null);
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
    prototype.data = null;
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet!");
    };
    prototype.getDisplayName = function() {
        return FrameworkViewScreen.displayName;
    };
}, {data: "Object", reloadLoginCallback: "Callback0", reloadShowLoginCallback: "Callback0"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + FrameworkViewScreen.displayName)) {
            var hashSplit = (window.document.location.hash.split("?"));
            if (hashSplit.length > 1) {
                var firstParam = hashSplit[1];
                if (firstParam.startsWith("id")) {
                    var paramSplit = (firstParam.split("="));
                    if (paramSplit.length > 1) {
                        var id = paramSplit[1];
                        EcFramework.get(id, function(data) {
                            ScreenManager.replaceScreen(new FrameworkViewScreen(data), CassManagerScreen.reloadShowLoginCallback);
                            CassManagerScreen.showLoginModalIfReload();
                        }, function(p1) {
                            ScreenManager.replaceScreen(new FrameworkSearchScreen(null, null, null), CassManagerScreen.reloadShowLoginCallback);
                            CassManagerScreen.showLoginModalIfReload();
                        });
                        ScreenManager.startupScreen = ScreenManager.LOADING_STARTUP_PAGE;
                        return;
                    }
                }
            }
            ScreenManager.startupScreen = new FrameworkSearchScreen(null, null, null);
            CassManagerScreen.showLoginModalIfReload();
        }
    });
})();
