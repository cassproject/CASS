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
            if (EcIdentityManager.ids.length > 0) {
                identityManager.select(EcIdentityManager.ids[0].ppk.toPem());
                that.loginServer.fetchServerAdminKeys(function(keys) {
                    for (var i = 0; i < EcIdentityManager.ids.length; i++) {
                        if (keys.indexOf(EcIdentityManager.ids[i].ppk.toPk().toPem()) != -1) {
                            that.setAdmin(true);
                        }
                    }
                }, function(p1) {});
            }
            EcIdentityManager.readContacts();
            EcRepository.cache = new Object();
            LoginController.setLoggedIn(true);
            success();
        }, function(p1) {
            failure(p1);
        });
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
 *  Used to encrypt fields in the RepoEdit module, not used much in the admin UI, probably want
 *  to phase out or use better when rewriting the repoEdit/View/Create screens.
 *  
 *  @author devlin.junker@eduworks.com
 */
var CryptoController = function() {};
CryptoController = stjs.extend(CryptoController, null, [], function(constructor, prototype) {
    prototype.identity = null;
    /**
     *  Encrypts the text passed in
     *  
     *  @param text 
     *  			Value to be encrypted
     *  @param id
     *  			Id of the object that contains the field being encrypted
     *  @param fieldName 
     * 				(Not used) unsure why the encrypt function asks for this...
     *  @return EcEncryptedValue containing the encrypted text
     */
    prototype.encryptField = function(text, id, fieldName) {
        if (this.identity.selectedIdentity == null) {
            return null;
        }
        return EcEncryptedValue.encryptValueOld(text, id, fieldName, this.identity.selectedIdentity.ppk.toPk()).atIfy();
    };
    /**
     *  Attempts to decrypt the EcEncryptedValue passed in using the users identities stored in the 
     *  EcIdentityManager
     *  
     *  @param encryptedObject
     *  			EcEncryptedValue to be attempted to be decrypted (not sure why it is a string though...)
     *  @return Decrypted string value
     */
    prototype.decryptField = function(encryptedObject) {
        var e = new EcEncryptedValue();
        e.copyFrom(JSON.parse(encryptedObject));
        return e.decryptIntoString();
    };
}, {identity: "IdentityController"}, {});
/**
 *  Provides methods to request objects from the repository on the server
 *  
 *  @author devlin.junker@eduworks.com
 */
var RepositoryController = function() {};
RepositoryController = stjs.extend(RepositoryController, null, [], function(constructor, prototype) {
    prototype.repo = null;
    prototype.identity = null;
    /**
     *  Retrieves a file from the server and downloads it to the user's computer
     *  
     *  @param id
     *  			ID of the file to download
     *  @param failure
     *  			Callback if there is an error when retrieving the file
     */
    prototype.downloadFile = function(id, failure) {
        EcRepository.get(id, function(p1) {
            var f = new EcFile();
            if (p1.isA(EcEncryptedValue.myType)) {
                var encrypted = new EcEncryptedValue();
                encrypted.copyFrom(p1);
                p1 = encrypted.decryptIntoObject();
            }
            if (p1.isA(EcFile.myType)) {
                f.copyFrom(p1);
                f.download();
            }
        }, failure);
    };
    /**
     *  Upload's a file to the server, encrypts it first though. This will error if there is
     *  not a selected identity for a signed in user because it can't be encrypted
     *  
     *  @param name
     *  			Name of the file to be uploaded
     *  @param base64Data
     *  			Data for the file to be uploaded
     *  @param mimeType
     *  			MIME Type of the file to be uploaded
     *  @param success
     *  			Callback after the file has been encrypted and uploaded successfully
     *  @param failure
     *  			Callback if there is an error during the encryption or upload process
     */
    prototype.encryptAndUploadFile = function(name, base64Data, mimeType, success, failure) {
        if (this.identity.selectedIdentity == null) {
            failure("User not signed in or, no Identity selected");
            return;
        }
        var f = new EcFile();
        f.generateId(this.repo.selectedServer);
        f.data = base64Data;
        f.name = name;
        f.mimeType = mimeType;
        f.addOwner(this.identity.selectedIdentity.ppk.toPk());
        var encryptedValue = EcEncryptedValue.toEncryptedValue(f, false);
        EcRepository.save(encryptedValue, function(p1) {
            success();
        }, failure);
    };
    /**
     *  Upload's a file to the server without encrypting it. No owner is attached, so it will be a
     *  public file.
     *  
     *  @param name
     *  			Name of the file to be uploaded
     *  @param base64Data
     *  			Data for the file to be uploaded
     *  @param mimeType
     *  			MIME Type of the file to be uploaded
     *  @param success
     *  			Callback after the file has been encrypted and uploaded successfully
     *  @param failure
     *  			Callback if there is an error during the encryption or upload process
     */
    prototype.uploadFile = function(name, base64Data, mimeType, success, failure) {
        var f = new EcFile();
        f.data = base64Data;
        f.name = name;
        f.mimeType = mimeType;
        f.generateId(this.repo.selectedServer);
        EcRepository.save(f, function(p1) {
            success();
        }, failure);
    };
    /**
     *  Uploads a JSON Object String to the repository
     *  
     *  @param data
     *  			the JSON Object String to upload
     *  @param success
     *  			Callback for successful upload
     *  @param fail
     *  			Callback for error during upload
     */
    prototype.upload = function(data, success, fail) {
        var d = new EcRemoteLinkedData(null, null);
        d.copyFrom(JSON.parse(data));
        if (d.invalid()) {
            fail("Cannot save data. It is missing a vital component.");
        }
        EcRepository.save(d, success, fail);
    };
    /**
     *  Retrieve an object from the repository (unsure of type)
     *  @param id
     *  			ID of the object to retrieve from the repository
     *  @param success
     *  			Callback that returns the object after successfully retrieving it
     *  @param failure
     *  			Callback that returns any errors that occur during retrieval
     */
    prototype.view = function(id, success, failure) {
        EcRepository.get(id, success, failure);
    };
    /**
     *  Retrieve an object from the repository and check then cast it to a competency before returning it
     *  @param id
     *  			ID of the competency to retrieve from the repository
     *  @param success
     *  			Callback that returns the competency after successfully retrieving it
     *  @param failure
     *  			Callback that returns any errors that occur during retrieval
     */
    prototype.viewCompetency = function(id, success, failure) {
        EcRepository.get(id, function(p1) {
            var encrypted = new EcEncryptedValue();
            encrypted.copyFrom(p1);
            var competency = new EcCompetency();
            if (p1.isAny(competency.getTypes())) {
                competency.copyFrom(p1);
                success(competency);
            } else if (p1.isA(EcEncryptedValue.myType) && encrypted.isAnEncrypted(EcCompetency.myType)) {
                var decrypted = encrypted.decryptIntoObject();
                competency.copyFrom(decrypted);
                competency.privateEncrypted = true;
                success(competency);
            } else {
                failure("Retrieved object was not a competency");
            }
        }, failure);
    };
    /**
     *  Retrieve an object from the repository and check then cast it to a framework before returning it
     *  @param id
     *  			ID of the framework to retrieve from the repository
     *  @param success
     *  			Callback that returns the framework after successfully retrieving it
     *  @param failure
     *  			Callback that returns any errors that occur during retrieval
     */
    prototype.viewFramework = function(id, success, failure) {
        var me = this;
        EcRepository.get(id, function(p1) {
            var encrypted = new EcEncryptedValue();
            encrypted.copyFrom(p1);
            var framework = new EcFramework();
            if (p1.isAny(framework.getTypes())) {
                framework.copyFrom(p1);
                success(framework);
            } else if (p1.isA(EcEncryptedValue.myType) && encrypted.isAnEncrypted(EcFramework.myType)) {
                var decrypted = encrypted.decryptIntoObject();
                framework.copyFrom(decrypted);
                framework.privateEncrypted = true;
                success(framework);
            } else {
                failure("Retrieved object was not a framework");
            }
        }, failure);
    };
    /**
     *  Retrieve an object from the repository and check then cast it to a relation before returning it
     *  @param id
     *  			ID of the relation to retrieve from the repository
     *  @param success
     *  			Callback that returns the relation after successfully retrieving it
     *  @param failure
     *  			Callback that returns any errors that occur during retrieval
     */
    prototype.viewRelation = function(id, success, failure) {
        EcRepository.get(id, function(p1) {
            var encrypted = new EcEncryptedValue();
            encrypted.copyFrom(p1);
            var alignment = new EcAlignment();
            if (p1.isAny(alignment.getTypes())) {
                alignment.copyFrom(p1);
                success(alignment);
            } else if (p1.isA(EcEncryptedValue.myType) && encrypted.isAnEncrypted(EcAlignment.myType)) {
                var decrypted = encrypted.decryptIntoObject();
                alignment.copyFrom(decrypted);
                alignment.privateEncrypted = true;
                success(alignment);
            } else {
                failure("Retrieved object was not a relation");
            }
        }, failure);
    };
    /**
     *  Retrieve an object from the repository and check then cast it to a level before returning it
     *  @param id
     *  			ID of the level to retrieve from the repository
     *  @param success
     *  			Callback that returns the level after successfully retrieving it
     *  @param failure
     *  			Callback that returns any errors that occur during retrieval
     */
    prototype.viewLevel = function(id, success, failure) {
        EcRepository.get(id, function(p1) {
            var encrypted = new EcEncryptedValue();
            encrypted.copyFrom(p1);
            var level = new EcLevel();
            if (p1.isAny(level.getTypes())) {
                level.copyFrom(p1);
                success(level);
            } else if (p1.isA(EcEncryptedValue.myType) && encrypted.isAnEncrypted(EcLevel.myType)) {
                var decrypted = encrypted.decryptIntoObject();
                level.copyFrom(decrypted);
                ;
                level.privateEncrypted = true;
                success(level);
            } else {
                failure("Retrieved object was not a level");
            }
        }, failure);
    };
    /**
     *  Retrieve an object from the repository and check then cast it to a assertion before returning it
     *  @param id
     *  			ID of the assertion to retrieve from the repository
     *  @param success
     *  			Callback that returns the assertion after successfully retrieving it
     *  @param failure
     *  			Callback that returns any errors that occur during retrieval
     */
    prototype.viewAssertion = function(id, success, failure) {
        EcRepository.get(id, function(p1) {
            var assertion = new EcAssertion();
            if (p1.isAny(assertion.getTypes())) {
                assertion.copyFrom(p1);
                success(assertion);
            } else {
                failure("Retrieved object was not an assertion");
            }
        }, failure);
    };
}, {repo: "EcRepository", identity: "IdentityController"}, {});
/**
 *  Search Controller interfaces with the repository to build search queries based on
 *  the type of an object desired or other parameters that can be passed in
 *  
 *  @author devlin.junker@eduworks.com
 */
var SearchController = function() {};
SearchController = stjs.extend(SearchController, null, [], function(constructor, prototype) {
    prototype.repo = null;
    /**
     *  Fetches an array of strings that identify the types present in the repository
     *  
     *  @param success
     *  			Callback when the list has been returned, hands the list back to the UI
     *  @param failure 
     *  			Callback if an error occurs while retrieving the types, returns the 
     *  			server response
     */
    prototype.getTypes = function(success, failure) {
        this.repo.listTypes(success, failure);
    };
    /**
     *  Very Basic Search, doesn't modify the query passed in except to wrap it in parenthesis
     *  
     *  @param query
     *  			The query to pass to ths search web service
     *  @param success 
     *  			Callback when the search successfully returns a list of objects found 
     *  			with the query
     *  @param failure 
     *  			Callback if an error occurs during the search, returns the server response
     *  			as a string
     *  @param paramObj 
     *  			Object with parameters to pass to the search web service (allowable
     *  			parameters include: start, size, types and ownership)
     */
    prototype.search = function(query, success, failure, paramObj) {
        if (paramObj == null) 
            paramObj = new Object();
        var params = new Object();
        var paramProps = (params);
        if ((paramObj)["start"] != null) 
            paramProps["start"] = (paramObj)["start"];
        if ((paramObj)["size"] != null) 
            paramProps["size"] = (paramObj)["size"];
        if ((paramObj)["types"] != null) 
            paramProps["types"] = (paramObj)["types"];
        if ((paramObj)["ownership"] != null) {
            var ownership = (paramObj)["ownership"];
            if (!query.startsWith("(") || !query.endsWith(")")) {
                query = "(" + query + ")";
            }
            if (ownership.equals("public")) {
                query += " AND (_missing_:@owner)";
            } else if (ownership.equals("owned")) {
                query += " AND (_exists_:@owner)";
            } else if (ownership.equals("me")) {
                query += " AND (";
                for (var i = 0; i < EcIdentityManager.ids.length; i++) {
                    if (i != 0) {
                        query += " OR ";
                    }
                    var id = EcIdentityManager.ids[i];
                    query += "@owner:\"" + id.ppk.toPk().toPem() + "\"";
                }
                query += ")";
            }
        }
        if ((paramObj)["fields"] != null) 
            paramProps["fields"] = (paramObj)["fields"];
        if (paramProps["start"] != null || paramProps["size"] != null || paramProps["ownership"] != null || paramProps["types"] != null || paramProps["fields"] != null) 
            this.repo.searchWithParams(query, params, null, success, failure);
         else 
            this.repo.search(query, null, success, failure);
    };
    prototype.searchWithParams = function(query, params, success, failure) {
        this.repo.searchWithParams(query, params, null, success, failure);
    };
    /**
     *  Searches for files that match the query passed in, if query is blank returns list of all 
     *  files up to the limit of returnable objects 
     *  
     *  @param query 
     *  			String to match files against
     *  @param searchPublic 
     *  			boolean flag to search for public files only
     *  @param success 
     *  			Callback to return the file objects found
     *  @param failure 
     *  			Callback to return any errors that occured during the file search
     */
    prototype.fileSearch = function(query, searchPublic, success, failure) {
        var queryAdd = "";
        queryAdd = new EcFile().getSearchStringByType();
        if (query == null || query == "") 
            query = queryAdd;
         else 
            query = "(" + query + ") AND " + queryAdd;
        if (searchPublic) {
            this.search(query, success, failure, null);
        } else {
            var params = new Object();
            (params)["ownership"] = "owned";
            this.search(query, success, failure, params);
        }
    };
    /**
     *  Searches for frameworks that match the query, if the query is blank returns list of all frameworks
     *  up to the limit of returnable objects
     *  
     *  @param query 
     *  			String to match frameworks against
     *  @param success 
     *  			Callback to return the frameworks found
     *  @param failure 
     *  			Callback to return any errors during search
     *  @param paramObj
     *  			Object containing search parameters (fields: start, size, ownership)
     */
    prototype.frameworkSearch = function(query, success, failure, paramObj) {
        var queryAdd = "";
        queryAdd = new EcFramework().getSearchStringByType();
        if (query == null || query == "") 
            query = queryAdd;
         else 
            query = "(" + query + ") AND " + queryAdd;
        this.search(query, function(p1) {
            if (success != null) {
                var ret = [];
                for (var i = 0; i < p1.length; i++) {
                    var framework = new EcFramework();
                    if (p1[i].isAny(framework.getTypes())) {
                        framework.copyFrom(p1[i]);
                    } else if (p1[i].isA(EcEncryptedValue.myType)) {
                        var val = new EcEncryptedValue();
                        val.copyFrom(p1[i]);
                        if (val.isAnEncrypted(EcFramework.myType)) {
                            var obj = val.decryptIntoObject();
                            framework.copyFrom(obj);
                            framework.privateEncrypted = true;
                        }
                    }
                    ret[i] = framework;
                }
                success(ret);
            }
        }, failure, paramObj);
    };
    /**
     *  Searches for competencies that match the query, if the query is blank returns list of all competencies
     *  up to the limit of returnable objects
     *  
     *  @param query 
     *  			String to match competencies against
     *  @param success 
     *  			Callback to return the competencies found
     *  @param failure 
     *  			Callback to return any errors during search
     *  @param paramObj
     *  			Object containing search parameters (fields: start, size, ownership)
     */
    prototype.competencySearch = function(query, success, failure, paramObj) {
        var queryAdd = "";
        queryAdd = new EcCompetency().getSearchStringByType();
        if (query == null || query == "") 
            query = queryAdd;
         else 
            query = "(" + query + ") AND " + queryAdd;
        this.search(query, function(p1) {
            if (success != null) {
                var ret = [];
                for (var i = 0; i < p1.length; i++) {
                    var comp = new EcCompetency();
                    if (p1[i].isAny(comp.getTypes())) {
                        comp.copyFrom(p1[i]);
                    } else if (p1[i].isA(EcEncryptedValue.myType)) {
                        var val = new EcEncryptedValue();
                        val.copyFrom(p1[i]);
                        if (val.isAnEncrypted(EcCompetency.myType)) {
                            var obj = val.decryptIntoObject();
                            comp.copyFrom(obj);
                            comp.privateEncrypted = true;
                        }
                    }
                    ret[i] = comp;
                }
                success(ret);
            }
        }, failure, paramObj);
    };
    /**
     *  Searches for the levels associated with a given competencyId, if competencyId is empty or
     *  null, failure is invoked
     *  
     *  @param competencyId 
     *  			Id of the competency to search for associated levels on
     *  @param success 
     *  			Callback to return the levels found
     *  @param failure 
     *  			Callback to return any errors during search
     */
    prototype.levelSearchByCompetency = function(competencyId, success, failure) {
        if (competencyId == null || competencyId == "") {
            failure("No Competency Specified");
            return;
        }
        var query = "(" + new EcLevel().getSearchStringByType();
        query += " AND ( competency:\"" + competencyId + "\" OR competency:\"" + EcRemoteLinkedData.trimVersionFromUrl(competencyId) + "\"))";
        query += " OR @encryptedType:\"" + EcLevel.myType + "\" OR @encryptedType:\"" + EcLevel.myType.replace(Cass.context + "/", "") + "\"";
        this.search(query, function(p1) {
            if (success != null) {
                var levels = [];
                for (var i = 0; i < p1.length; i++) {
                    var level = new EcLevel();
                    if (p1[i].isAny(level.getTypes())) {
                        level.copyFrom(p1[i]);
                    } else if (p1[i].isA(EcEncryptedValue.myType)) {
                        var val = new EcEncryptedValue();
                        val.copyFrom(p1[i]);
                        if (val.isAnEncrypted(EcLevel.myType)) {
                            var obj = val.decryptIntoObject();
                            if ((obj)["competency"] != competencyId) {
                                continue;
                            }
                            level.copyFrom(obj);
                            level.privateEncrypted = true;
                        }
                    }
                    level.copyFrom(p1[i]);
                    levels[i] = level;
                }
                if (success != null) 
                    success(levels);
            }
        }, failure, null);
    };
    /**
     *  Searches for relations that match the query, if the query is blank returns list of all relations
     *  up to the limit of returnable objects
     *  
     *  @param query 
     *  			String to match relations against
     *  @param success 
     *  			Callback to return the relations found
     *  @param failure 
     *  			Callback to return any errors during search
     *  * @param paramObj
     *  			Object containing search parameters (fields: start, size, ownership)
     */
    prototype.relationSearch = function(query, success, failure, paramObj) {
        var queryAdd = new EcAlignment().getSearchStringByType();
        if (query == null || query == "") 
            query = queryAdd;
         else 
            query = "(" + query + ") AND " + queryAdd;
        this.search(query, function(p1) {
            if (success != null) {
                var ret = [];
                for (var i = 0; i < p1.length; i++) {
                    var alignment = new EcAlignment();
                    if (p1[i].isAny(alignment.getTypes())) {
                        alignment.copyFrom(p1[i]);
                    } else if (p1[i].isA(EcEncryptedValue.myType)) {
                        var val = new EcEncryptedValue();
                        val.copyFrom(p1[i]);
                        if (val.isAnEncrypted(EcAlignment.myType)) {
                            var obj = val.decryptIntoObject();
                            alignment.copyFrom(obj);
                            alignment.privateEncrypted = true;
                        }
                    }
                    ret[i] = alignment;
                }
                success(ret);
            }
        }, failure, paramObj);
    };
    /**
     *  Searches for relationships that have the source competency specified by sourceId
     *  
     *  @param sourceId 
     *  			ID of the competency for which relationships are returned that contain this ID 
     *  			in the source field
     *  @param success 
     *  			Callback to return the relations found
     *  @param failure 
     *  			Callback to return any errors during search
     */
    prototype.relationSearchBySource = function(sourceId, success, failure) {
        var query = "";
        query = "(" + new EcAlignment().getSearchStringByType();
        var noVersion = EcRemoteLinkedData.trimVersionFromUrl(sourceId);
        if (noVersion == sourceId) {
            query += " AND (source:\"" + sourceId + "\"))";
        } else {
            query += " AND (source:\"" + sourceId + "\" OR source:\"" + noVersion + "\"))";
        }
        query += " OR @encryptedType:\"" + EcAlignment.myType + "\" OR @encryptedType:\"" + EcAlignment.myType.replace(Cass.context + "/", "") + "\")";
        this.search(query, function(p1) {
            if (success != null) {
                var ret = [];
                for (var i = 0; i < p1.length; i++) {
                    var alignment = new EcAlignment();
                    if (p1[i].isAny(alignment.getTypes())) {
                        alignment.copyFrom(p1[i]);
                    } else if (p1[i].isA(EcEncryptedValue.myType)) {
                        var val = new EcEncryptedValue();
                        val.copyFrom(p1[i]);
                        if (val.isAnEncrypted(EcAlignment.myType)) {
                            var obj = val.decryptIntoObject();
                            if ((obj)["source"] != sourceId && (obj)["source"] != noVersion) {
                                continue;
                            }
                            alignment.copyFrom(obj);
                            alignment.privateEncrypted = true;
                        }
                    }
                    ret[i] = alignment;
                }
                success(ret);
            }
        }, failure, null);
    };
    /**
     *  Searches for relationships that have either the source or target competency specified 
     *  by competencyId
     *  
     *  @param competencyId 
     * 				ID of the competency for which relationships are returned that 
     *  			contain this ID in the source or target field
     *  @param success 
     *  			Callback to return the relations found
     *  @param failure 
     *  			Callback to return any errors during search
     */
    prototype.relationSearchBySourceOrTarget = function(competencyId, success, failure) {
        var query = "";
        query = "(" + new EcAlignment().getSearchStringByType();
        var noVersion = EcRemoteLinkedData.trimVersionFromUrl(competencyId);
        if (noVersion == competencyId) {
            query += " AND (source:\"" + competencyId + "\" OR target:\"" + competencyId + "\"))";
        } else {
            query += " AND (source:\"" + competencyId + "\" OR source:\"" + noVersion + "\" OR target:\"" + competencyId + "\" OR target:\"" + noVersion + "\"))";
        }
        query += " OR @encryptedType:\"" + EcAlignment.myType + "\" OR @encryptedType:\"" + EcAlignment.myType.replace(Cass.context + "/", "") + "\")";
        var fields = ["source", "target", "relationType"];
        var params = new Object();
        (params)["fields"] = fields;
        this.search(query, function(p1) {
            if (success != null) {
                var ret = [];
                for (var i = 0; i < p1.length; i++) {
                    var alignment = new EcAlignment();
                    if (p1[i].isAny(alignment.getTypes())) {
                        alignment.copyFrom(p1[i]);
                    } else if (p1[i].isA(EcEncryptedValue.myType)) {
                        var val = new EcEncryptedValue();
                        val.copyFrom(p1[i]);
                        if (val.isAnEncrypted(EcAlignment.myType)) {
                            var obj = val.decryptIntoObject();
                            if ((obj)["source"] != competencyId && (obj)["source"] != noVersion && (obj)["target"] != competencyId && (obj)["target"] != noVersion) {
                                continue;
                            }
                            alignment.copyFrom(obj);
                            alignment.privateEncrypted = true;
                        }
                    }
                    ret[i] = alignment;
                }
                success(ret);
            }
        }, failure, params);
    };
    /**
     *  Searches for assertion that match the query, if the query is blank returns list of all relations
     *  up to the limit of returnable objects
     *  
     *  @param query 
     *  			String to match assertion against
     *  @param success 
     *  			Callback to return the assertions found
     *  @param failure 
     *  			Callback to return any errors during search
     *  @param paramObj
     *  			Object containing search parameters (fields: start, size)
     */
    prototype.assertionSearch = function(query, success, failure, paramObj) {
        var queryAdd = new EcAssertion().getSearchStringByType();
        if (query == null || query == "") 
            query = queryAdd;
         else 
            query = "(" + query + ") AND " + queryAdd;
        this.search(query, function(p1) {
            if (success != null) {
                var ret = [];
                for (var i = 0; i < p1.length; i++) {
                    var assertion = new EcAssertion();
                    assertion.copyFrom(p1[i]);
                    ret[i] = assertion;
                }
                success(ret);
            }
        }, failure, paramObj);
    };
}, {repo: "EcRepository"}, {});
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
        EcRemote.postExpectingString(urlBase, "settings/settings.js", null, function(settingsObjStr) {
            var settingsObj = JSON.parse(settingsObjStr);
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
    constructor.searchController = new SearchController();
    constructor.loginController = new LoginController();
    constructor.repositoryController = new RepositoryController();
    constructor.cryptoController = new CryptoController();
    constructor.repoInterface = new EcRepository();
    constructor.loginServer = new EcRemoteIdentityManager();
    constructor.main = function(args) {
        AppSettings.loadSettings();
        AppController.repoInterface.autoDetectRepository();
        if (AppController.repoInterface.selectedServer == null) 
            AppController.serverController = new ServerController(AppSettings.defaultServerUrl, AppSettings.defaultServerName);
         else 
            AppController.serverController = new ServerController(AppController.repoInterface.selectedServer, "This Server (" + window.location.host + ")");
        AppController.serverController.setRepoInterface(AppController.repoInterface);
        AppController.serverController.setRemoteIdentityManager(AppController.loginServer);
        AppController.searchController.repo = AppController.repoInterface;
        AppController.repositoryController.repo = AppController.repoInterface;
        AppController.loginServer.configure(AppSettings.defaultServerUserSalt, AppSettings.defaultServerUserIterations, AppSettings.defaultServerUserLength, AppSettings.defaultServerPasswordSalt, AppSettings.defaultServerPasswordIterations, AppSettings.defaultServerPasswordLength, AppSettings.defaultServerSecretSalt, AppSettings.defaultServerSecretIterations);
        AppController.loginController.loginServer = AppController.loginServer;
        AppController.repositoryController.identity = AppController.identityController;
        AppController.cryptoController.identity = AppController.identityController;
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
}, {serverController: "ServerController", identityController: "IdentityController", searchController: "SearchController", loginController: "LoginController", repositoryController: "RepositoryController", cryptoController: "CryptoController", repoInterface: "EcRepository", loginServer: "EcRemoteIdentityManager"}, {});
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
                        AppController.repositoryController.view(id, function(data) {
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
                        AppController.repositoryController.view(id, function(data) {
                            if (data.isA(EcAlignment.myType)) 
                                ScreenManager.replaceScreen(new RelationshipEditScreen(data), CassManagerScreen.reloadShowLoginCallback);
                             else 
                                ScreenManager.replaceScreen(new RelationshipSearchScreen(null, null, null), CassManagerScreen.reloadShowLoginCallback);
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
                        AppController.repositoryController.view(id, function(data) {
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
                        AppController.repositoryController.view(id, function(data) {
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
                        AppController.repositoryController.view(id, function(data) {
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
                        AppController.repositoryController.view(id, function(data) {
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
                        AppController.repositoryController.view(id, function(data) {
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
                        AppController.repositoryController.viewFramework(id, function(data) {
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
                        AppController.repositoryController.view(id, function(data) {
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
