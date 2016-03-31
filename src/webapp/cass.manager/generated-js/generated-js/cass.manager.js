var AppSettings = function() {};
AppSettings = stjs.extend(AppSettings, null, [], function(constructor, prototype) {
    constructor.returnLoginMessage = "For Your Security, You are Logged Out on Page Reload. Please Enter Your Credentials to Continue Logged In.";
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
var AppMenu = function() {
    EcView.call(this);
};
AppMenu = stjs.extend(AppMenu, EcView, [], function(constructor, prototype) {
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet");
    };
}, {}, {});
var KeyManager = function() {
    EcView.call(this);
};
KeyManager = stjs.extend(KeyManager, EcView, [], function(constructor, prototype) {
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet");
    };
}, {}, {});
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
var ChangeServerModal = function() {
    EcModal.call(this);
};
ChangeServerModal = stjs.extend(ChangeServerModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "tiny";
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet");
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
    prototype.loginSuccess = null;
    prototype.warning = null;
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet");
    };
}, {loginSuccess: "Callback0", onClose: "Callback0"}, {});
var CreateUserModal = function() {
    EcModal.call(this);
};
CreateUserModal = stjs.extend(CreateUserModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.display = function(arg0, arg1) {
        console.error("Not Implemented Yet");
    };
}, {onClose: "Callback0"}, {});
var SaveIdModal = function() {
    EcModal.call(this);
};
SaveIdModal = stjs.extend(SaveIdModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "tiny";
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet!");
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
var LoginController = function() {};
LoginController = stjs.extend(LoginController, null, [], function(constructor, prototype) {
    prototype.loginServer = null;
    prototype.identity = null;
    constructor.refreshLoggedIn = false;
    constructor.loggedIn = false;
    constructor.storageSystem = null;
    constructor.setLoggedIn = function(val) {
        LoginController.loggedIn = val;
        if (LoginController.storageSystem != null) 
            LoginController.storageSystem["cass.login"] = val;
    };
    constructor.getLoggedIn = function() {
        return LoginController.loggedIn;
    };
    constructor.getPreviouslyLoggedIn = function() {
        return LoginController.refreshLoggedIn;
    };
    prototype.login = function(username, password, success, failure) {
        var identityManager = this.identity;
        this.loginServer.startLogin(username, password);
        this.loginServer.fetch(function(p1) {
            if (EcIdentityManager.ids.length > 0) 
                identityManager.select(EcIdentityManager.ids[0].ppk.toPem());
            LoginController.setLoggedIn(true);
            success();
        }, function(p1) {
            failure(p1);
        });
    };
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
    prototype.save = function(success, failure) {
        var me = this;
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
    prototype.logout = function() {
        this.loginServer.clear();
        this.identity.selectedIdentity = null;
        EcIdentityManager.ids = new Array();
        LoginController.setLoggedIn(false);
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
var CryptoController = function() {};
CryptoController = stjs.extend(CryptoController, null, [], function(constructor, prototype) {
    prototype.identity = null;
    prototype.encryptField = function(text, id, fieldName) {
        if (this.identity.selectedIdentity == null) {
            return null;
        }
        return EcEncryptedValue.encryptValueOld(text, id, fieldName, this.identity.selectedIdentity.ppk.toPk()).atIfy();
    };
    prototype.decryptField = function(encryptedObject) {
        var e = new EcEncryptedValue();
        e.copyFrom(JSON.parse(encryptedObject));
        return e.decryptIntoString();
    };
}, {identity: "IdentityController"}, {});
var SearchController = function() {};
SearchController = stjs.extend(SearchController, null, [], function(constructor, prototype) {
    prototype.repo = null;
    prototype.getTypes = function(success, failure) {
        this.repo.listTypes(success, failure);
    };
    prototype.search = function(query, success, failure, start, size, ownership, types) {
        var params = new Object();
        var paramProps = (params);
        if (start != null) 
            paramProps["start"] = start.intValue();
        if (size != null) 
            paramProps["size"] = size.intValue();
        if (ownership != null) 
            paramProps["ownership"] = ownership;
        if (types != null) 
            paramProps["types"] = types;
        if (paramProps["start"] != null || paramProps["size"] != null || paramProps["ownership"] != null || paramProps["ownership"] != null) 
            this.repo.searchWithParams(query, params, null, success, failure);
         else 
            this.repo.search(query, null, success, failure);
    };
    prototype.searchWithParams = function(query, params, success, failure) {
        this.repo.searchWithParams(query, params, null, success, failure);
    };
    prototype.fileSearch = function(query, searchPublic, success, failure) {
        var queryAdd = "";
        if (searchPublic) 
            queryAdd = "(@type:*file OR @encryptedType:*file)";
         else 
            queryAdd = "(@encryptedType:*file)";
        if (query == null || query == "") 
            query = queryAdd;
         else 
            query = "(" + query + ") AND " + queryAdd;
        this.repo.search(query, null, success, failure);
    };
    prototype.competencySearch = function(query, success, failure, ownership) {
        var queryAdd = "";
        queryAdd = "(@type:\"" + EcCompetency.myType + "\")";
        if (query == null || query == "") 
            query = queryAdd;
         else 
            query = "(" + query + ") AND " + queryAdd;
        var params = new Object();
        var paramProps = (params);
        if (ownership != null) 
            paramProps["ownership"] = ownership;
        if (paramProps["ownership"] != null) 
            this.repo.searchWithParams(query, params, null, success, failure);
         else 
            this.repo.search(query, null, success, failure);
    };
    prototype.relationSearchBySource = function(sourceId, success, failure) {
        var query = "";
        query = "(@type:\"" + EcAlignment.myType + "\")";
        var noVersion = EcRemoteLinkedData.trimVersionFromUrl(sourceId);
        if (noVersion == sourceId) {
            query += " AND (source:\"" + sourceId + "\")";
        } else {
            query += " AND (source:\"" + sourceId + "\" OR source:\"" + noVersion + "\")";
        }
        this.repo.search(query, null, success, failure);
    };
}, {repo: "EcRepository"}, {});
var IdentityController = function() {};
IdentityController = stjs.extend(IdentityController, null, [], function(constructor, prototype) {
    prototype.selectedIdentity = null;
    prototype.select = function(ppkPem) {
        var clickedPpk = EcPpk.fromPem(ppkPem);
        for (var i = 0; i < EcIdentityManager.ids.length; i++) 
            if (EcIdentityManager.ids[i].ppk.equals(clickedPpk)) 
                this.selectedIdentity = EcIdentityManager.ids[i];
    };
    prototype.unselect = function() {
        this.selectedIdentity = null;
    };
    prototype.currentOwner = function(pkPem) {
        var candidatePk = EcPk.fromPem(pkPem);
        for (var i = 0; i < EcIdentityManager.ids.length; i++) {
            if (EcIdentityManager.ids[i].ppk.toPk().equals(candidatePk)) {
                return true;
            }
        }
        return false;
    };
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
        EcIdentityManager.contacts.push(newContact);
        return newContact;
    };
    prototype.addKey = function(ppk, displayName, success) {
        var ident = new EcIdentity();
        ident.ppk = EcPpk.fromPem(ppk);
        ident.displayName = displayName;
        EcIdentityManager.addIdentity(ident);
        success();
    };
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
}, {selectedIdentity: "EcIdentity"}, {});
var RepositoryController = function() {};
RepositoryController = stjs.extend(RepositoryController, null, [], function(constructor, prototype) {
    prototype.repo = null;
    prototype.identity = null;
    prototype.downloadFile = function(id, failure) {
        EcRepository.get(id, function(p1) {
            var f = new EcFile();
            if (p1.isA(EcEncryptedValue.type)) {
                var encrypted = new EcEncryptedValue();
                encrypted.copyFrom(p1);
                p1 = encrypted.decryptIntoObject();
            }
            if (p1.isA(EcFile.type)) {
                f.copyFrom(p1);
                f.download();
            }
        }, failure);
    };
    prototype.view = function(id, success, failure) {
        EcRepository.get(id, success, failure);
    };
    prototype.encryptAndUploadFile = function(name, base64Data, mimeType, success, failure) {
        if (this.identity.selectedIdentity == null) {
            return;
        }
        var f = new EcFile();
        f.data = base64Data;
        f.name = name;
        f.mimeType = mimeType;
        f.addOwner(this.identity.selectedIdentity.ppk.toPk());
        var encryptedValue = EcEncryptedValue.toEncryptedValue(f, false);
        encryptedValue.generateId(this.repo.selectedServer);
        this.repo.constructor.save(encryptedValue, function(p1) {
            success();
        }, failure);
    };
    prototype.uploadFile = function(name, base64Data, mimeType, success, failure) {
        var f = new EcFile();
        f.data = base64Data;
        f.name = name;
        f.mimeType = mimeType;
        f.generateId(this.repo.selectedServer);
        this.repo.constructor.save(f, function(p1) {
            success();
        }, failure);
    };
    prototype.upload = function(data, success, fail) {
        var d = new EcRemoteLinkedData(null, null);
        d.copyFrom(JSON.parse(data));
        if (d.invalid()) {
            fail("Cannot save data. It is missing a vital component.");
        }
        this.repo.constructor.save(d, success, fail);
    };
}, {repo: "EcRepository", identity: "IdentityController"}, {});
var ServerController = function(defaultServer, defaultServerName) {
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
    this.storageSystem["cass.server.selected"] = JSON.stringify(this.selectedServerName);
    if (this.serverList[this.selectedServerName] == null) 
        this.addServer(this.selectedServerName, this.selectedServerUrl, null, null);
};
ServerController = stjs.extend(ServerController, null, [], function(constructor, prototype) {
    prototype.serverList = null;
    prototype.selectedServerUrl = null;
    prototype.selectedServerName = null;
    prototype.storageSystem = null;
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
    prototype.setRepoInterface = function(repoInterface) {
        this.repoInterface = repoInterface;
        repoInterface.selectedServer = this.selectedServerUrl;
    };
    prototype.setRemoteIdentityManager = function(loginServer) {
        this.remoteIdentityManager = loginServer;
        this.remoteIdentityManager.setDefaultIdentityManagementServer(this.selectedServerUrl);
    };
}, {serverList: {name: "Map", arguments: [null, null]}, storageSystem: "Storage", repoInterface: "EcRepository", remoteIdentityManager: "EcRemoteIdentityManager"}, {});
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
            ModalManager.showModal(new LoginModal(CassManagerScreen.reloadLoginCallback, null, AppSettings.returnLoginMessage));
        }
    };
}, {reloadLoginCallback: "Callback0", reloadShowLoginCallback: "Callback0"}, {});
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
            if (LoginController.getPreviouslyLoggedIn()) {
                ScreenManager.startupScreen = new UserIdentityScreen();
                ModalManager.showModal(new LoginModal(function() {
                    ModalManager.hideModal();
                    if (window.document.location.hash.startsWith("#" + new WelcomeScreen().getDisplayName())) {
                        ScreenManager.changeScreen(new UserIdentityScreen(), null, null);
                    }
                }, function() {
                    ScreenManager.replaceScreen(new WelcomeScreen(), null);
                }, AppSettings.returnLoginMessage));
            }
        }
    });
})();
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
        AppController.serverController = new ServerController("http://skyrepo.service.eduworks.com/", "Eduworks (Default)");
        AppController.loginServer.configure("UserNameSaltIsSaltyWOOOOO", 5000, 64, "PasswordSalskfeSEfejsfjoepsjof", 5000, 64, "SuperSecretSELKeFJSEOFJSEPF", 5000);
        AppController.serverController.setRepoInterface(AppController.repoInterface);
        AppController.serverController.setRemoteIdentityManager(AppController.loginServer);
        AppController.searchController.repo = AppController.repoInterface;
        AppController.repositoryController.repo = AppController.repoInterface;
        AppController.repositoryController.identity = AppController.identityController;
        AppController.cryptoController.identity = AppController.identityController;
        AppController.loginController.identity = AppController.identityController;
        AppController.loginController.loginServer = AppController.loginServer;
        ScreenManager.setDefaultScreen(new WelcomeScreen());
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
var RelationshipEditScreen = function(data) {
    CassManagerScreen.call(this);
    this.data = data;
};
RelationshipEditScreen = stjs.extend(RelationshipEditScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "relationshipEdit";
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
                                ScreenManager.replaceScreen(new CompetencySearchScreen(null, null, null), CassManagerScreen.reloadShowLoginCallback);
                        }, function(p1) {
                            ScreenManager.replaceScreen(new CompetencySearchScreen(null, null, null), CassManagerScreen.reloadShowLoginCallback);
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
