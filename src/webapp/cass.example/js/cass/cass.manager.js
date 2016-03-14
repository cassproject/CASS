var SaveIdModal = function() {
    EcModal.call(this);
};
SaveIdModal = stjs.extend(SaveIdModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "tiny";
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet!");
    };
}, {}, {});
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
}, {field: "Object"}, {});
var LoginModal = function(success, fail) {
    EcModal.call(this);
    this.loginSuccess = success;
    this.loginFail = fail;
};
LoginModal = stjs.extend(LoginModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "tiny";
    prototype.loginSuccess = null;
    prototype.loginFail = null;
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet");
    };
}, {loginSuccess: "Callback0", loginFail: "Callback0"}, {});
var CreateUserModal = function() {
    EcModal.call(this);
};
CreateUserModal = stjs.extend(CreateUserModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "tiny";
    prototype.display = function(arg0, arg1) {
        console.error("Not Implemented Yet");
    };
}, {}, {});
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
var CompetencySearchScreen = function(lastViewed) {
    EcScreen.call(this);
    this.lastViewed = lastViewed;
};
CompetencySearchScreen = stjs.extend(CompetencySearchScreen, EcScreen, [], function(constructor, prototype) {
    constructor.displayName = "competencySearch";
    prototype.lastViewed = null;
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet!");
    };
    prototype.getDisplayName = function() {
        return CompetencySearchScreen.displayName;
    };
}, {lastViewed: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + CompetencySearchScreen.displayName)) {
            ScreenManager.startupScreen = new CompetencySearchScreen(null);
        }
    });
})();
var RepoCreateScreen = function(data) {
    EcScreen.call(this);
    this.data = data;
};
RepoCreateScreen = stjs.extend(RepoCreateScreen, EcScreen, [], function(constructor, prototype) {
    constructor.displayName = "repoCreate";
    prototype.data = null;
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet!");
    };
    prototype.getDisplayName = function() {
        return RepoCreateScreen.displayName;
    };
}, {data: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + RepoCreateScreen.displayName)) {
            ScreenManager.startupScreen = new RepoCreateScreen(null);
        }
    });
})();
var FileManagerScreen = function() {
    EcScreen.call(this);
};
FileManagerScreen = stjs.extend(FileManagerScreen, EcScreen, [], function(constructor, prototype) {
    constructor.displayName = "fileManager";
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet!");
    };
    prototype.getDisplayName = function() {
        return FileManagerScreen.displayName;
    };
}, {}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + FileManagerScreen.displayName)) {
            ScreenManager.startupScreen = new FileManagerScreen();
        }
    });
})();
var RepoSearchScreen = function(lastViewed) {
    EcScreen.call(this);
    this.lastViewed = lastViewed;
};
RepoSearchScreen = stjs.extend(RepoSearchScreen, EcScreen, [], function(constructor, prototype) {
    constructor.displayName = "repoSearch";
    prototype.lastViewed = null;
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet!");
    };
    prototype.getDisplayName = function() {
        return RepoSearchScreen.displayName;
    };
}, {lastViewed: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + RepoSearchScreen.displayName)) {
            ScreenManager.startupScreen = new RepoSearchScreen(null);
        }
    });
})();
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
        newContact.displayName = "N/A";
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
var RepoEdit = function(data, saveButtonId) {
    EcView.call(this);
    this.data = data;
    this.saveButtonId = saveButtonId;
};
RepoEdit = stjs.extend(RepoEdit, EcView, [], function(constructor, prototype) {
    prototype.data = null;
    prototype.saveButtonId = null;
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
var CryptoController = function() {};
CryptoController = stjs.extend(CryptoController, null, [], function(constructor, prototype) {
    prototype.identity = null;
    prototype.encryptField = function(text, id, fieldName) {
        if (this.identity.selectedIdentity == null) {
            selectKeyError();
            return null;
        }
        return EcEncryptedValue.encryptValue(text, id, fieldName, this.identity.selectedIdentity.ppk.toPk()).atIfy();
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
    prototype.search = function(query, success, failure, start, size) {
        var params = new Object();
        var paramProps = (params);
        if (start != null) 
            paramProps["start"] = start.intValue();
        if (size != null) 
            paramProps["size"] = size.intValue();
        if (paramProps["start"] != null || paramProps["size"] != null) 
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
    prototype.competencySearch = function(query, success, failure) {
        var queryAdd = "";
        queryAdd = "(@type:\"" + EcCompetency.myType + "\")";
        if (query == null || query == "") 
            query = queryAdd;
         else 
            query = "(" + query + ") AND " + queryAdd;
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
            selectKeyError();
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
var LoginController = function() {};
LoginController = stjs.extend(LoginController, null, [], function(constructor, prototype) {
    prototype.loginServer = null;
    prototype.identity = null;
    prototype.login = function(username, password, success, failure, server) {
        var identityManager = this.identity;
        this.loginServer.startLogin(username, password);
        this.loginServer.fetch(function(p1) {
            if (EcIdentityManager.ids.length > 0) 
                identityManager.select(EcIdentityManager.ids[0].ppk.toPem());
            success();
        }, function(p1) {
            failure(p1);
        }, server);
    };
    prototype.create = function(username, password, success, failure, server) {
        this.loginServer.startLogin(username, password);
        var me = this;
        this.loginServer.create(function(p1) {
            me.login(username, password, success, failure, server);
        }, function(p1) {
            failure(p1);
        }, new (stjs.extend(function LoginController$5() {
            EcCallbackReturn0.call(this);
        }, EcCallbackReturn0, [], function(constructor, prototype) {
            prototype.callback = function() {
                return "";
            };
        }, {}, {}))(), server);
    };
    prototype.save = function(success, failure, server) {
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
        }, {}, {}))(), server);
    };
    prototype.logout = function() {
        this.loginServer.clear();
        this.identity.selectedIdentity = null;
        EcIdentityManager.ids = new Array();
    };
}, {loginServer: "EcRemoteIdentityManager", identity: "IdentityController"}, {});
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
            ScreenManager.startupScreen = new UserIdentityScreen();
            ModalManager.showModal(new LoginModal(function() {
                ModalManager.hideModal();
                if (window.document.location.hash.startsWith("#" + new WelcomeScreen().getDisplayName())) {
                    ScreenManager.changeScreen(new UserIdentityScreen(), null, null);
                }
            }, function() {
                ScreenManager.changeScreen(new WelcomeScreen(), null, null);
            }));
        }
    });
})();
var AppController = function() {};
AppController = stjs.extend(AppController, null, [], function(constructor, prototype) {
    constructor.topBarContainerId = "#menuContainer";
    constructor.identityController = new IdentityController();
    constructor.searchController = new SearchController();
    constructor.loginController = new LoginController();
    constructor.repositoryController = new RepositoryController();
    constructor.cryptoController = new CryptoController();
    constructor.repoInterface = new EcRepository();
    constructor.loginServer = new EcRemoteIdentityManager();
    constructor.main = function(args) {
        AppController.repoInterface.selectedServer = "http://localhost:9722/api/custom/";
        AppController.searchController.repo = AppController.repoInterface;
        AppController.repositoryController.repo = AppController.repoInterface;
        AppController.repositoryController.identity = AppController.identityController;
        AppController.cryptoController.identity = AppController.identityController;
        AppController.loginController.identity = AppController.identityController;
        AppController.loginController.loginServer = AppController.loginServer;
        AppController.loginServer.configure("UserNameSaltIsSaltyWOOOOO", 5000, 64, "PasswordSalskfeSEfejsfjoepsjof", 5000, 64, "SuperSecretSELKeFJSEOFJSEPF", 5000);
        AppController.loginServer.setDefaultIdentityManagementServer("http://localhost:9722/api/custom/");
        ScreenManager.setDefaultScreen(new WelcomeScreen());
        $(window.document).ready(function(arg0, arg1) {
            ViewManager.showView(new AppMenu(), AppController.topBarContainerId, function() {
                ($(window.document)).foundation();
            });
            return true;
        });
    };
}, {identityController: "IdentityController", searchController: "SearchController", loginController: "LoginController", repositoryController: "RepositoryController", cryptoController: "CryptoController", repoInterface: "EcRepository", loginServer: "EcRemoteIdentityManager"}, {});
if (!stjs.mainCallDisabled) 
    AppController.main();
var Manager = function() {};
Manager = stjs.extend(Manager, null, [], function(constructor, prototype) {
    constructor.searchController = new SearchController();
    constructor.loginController = new LoginController();
    constructor.identityController = new IdentityController();
    constructor.repositoryController = new RepositoryController();
    constructor.cryptoController = new CryptoController();
    constructor.repo = new EcRepository();
    constructor.loginServer = new EcRemoteIdentityManager();
    constructor.main = function(args) {
        Manager.repo.selectedServer = "http://localhost:9722/api/custom/";
        Manager.searchController.repo = Manager.repo;
        Manager.repositoryController.repo = Manager.repo;
        Manager.repositoryController.identity = Manager.identityController;
        Manager.cryptoController.identity = Manager.identityController;
        Manager.loginController.loginServer = Manager.loginServer;
        Manager.loginController.identity = Manager.identityController;
        Manager.loginServer.configure("UserNameSaltIsSaltyWOOOOO", 5000, 64, "PasswordSalskfeSEfejsfjoepsjof", 5000, 64, "SuperSecretSELKeFJSEOFJSEPF", 5000);
        Manager.loginServer.setDefaultIdentityManagementServer("http://skyrepo.service.eduworks.com/");
    };
}, {searchController: "SearchController", loginController: "LoginController", identityController: "IdentityController", repositoryController: "RepositoryController", cryptoController: "CryptoController", repo: "EcRepository", loginServer: "EcRemoteIdentityManager"}, {});
if (!stjs.mainCallDisabled) 
    Manager.main();
var CompetencyEditScreen = function(data) {
    EcScreen.call(this);
    this.data = data;
};
CompetencyEditScreen = stjs.extend(CompetencyEditScreen, EcScreen, [], function(constructor, prototype) {
    constructor.displayName = "competencyEdit";
    prototype.data = null;
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet!");
    };
    prototype.getDisplayName = function() {
        return CompetencyEditScreen.displayName;
    };
}, {data: "Object"}, {});
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
                            ScreenManager.replaceScreen(new CompetencyEditScreen(data), null);
                        }, function(p1) {
                            ScreenManager.replaceScreen(new CompetencySearchScreen(null), null);
                        });
                        ScreenManager.startupScreen = ScreenManager.LOADING_STARTUP_PAGE;
                        return;
                    }
                }
            }
            ScreenManager.startupScreen = new CompetencyEditScreen(null);
        }
    });
})();
var CompetencyViewScreen = function(data) {
    EcScreen.call(this);
    this.data = data;
};
CompetencyViewScreen = stjs.extend(CompetencyViewScreen, EcScreen, [], function(constructor, prototype) {
    constructor.displayName = "competencyView";
    prototype.data = null;
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet!");
    };
    prototype.getDisplayName = function() {
        return CompetencyViewScreen.displayName;
    };
}, {data: "Object"}, {});
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
                            ScreenManager.replaceScreen(new CompetencyViewScreen(data), null);
                        }, function(p1) {
                            ScreenManager.replaceScreen(new CompetencySearchScreen(null), null);
                        });
                        ScreenManager.startupScreen = ScreenManager.LOADING_STARTUP_PAGE;
                        return;
                    }
                }
            }
            ScreenManager.startupScreen = new CompetencySearchScreen(null);
        }
    });
})();
var RepoViewScreen = function(data) {
    EcScreen.call(this);
    this.data = data;
};
RepoViewScreen = stjs.extend(RepoViewScreen, EcScreen, [], function(constructor, prototype) {
    constructor.displayName = "repoView";
    prototype.data = null;
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet!");
    };
    prototype.getDisplayName = function() {
        return RepoViewScreen.displayName;
    };
}, {data: "Object"}, {});
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
                            ScreenManager.replaceScreen(new RepoViewScreen(data), null);
                        }, function(p1) {
                            ScreenManager.replaceScreen(new RepoSearchScreen(null), null);
                        });
                        ScreenManager.startupScreen = ScreenManager.LOADING_STARTUP_PAGE;
                        return;
                    }
                }
            }
            ScreenManager.startupScreen = new RepoSearchScreen(null);
        }
    });
})();
var RelationshipEditScreen = function(data) {
    EcScreen.call(this);
    this.data = data;
};
RelationshipEditScreen = stjs.extend(RelationshipEditScreen, EcScreen, [], function(constructor, prototype) {
    constructor.displayName = "relationshipEdit";
    prototype.data = null;
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet!");
    };
    prototype.getDisplayName = function() {
        return RelationshipEditScreen.displayName;
    };
}, {data: "Object"}, {});
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
                                ScreenManager.replaceScreen(new RelationshipEditScreen(data), null);
                             else 
                                ScreenManager.replaceScreen(new CompetencySearchScreen(null), null);
                        }, function(p1) {
                            ScreenManager.replaceScreen(new CompetencySearchScreen(null), null);
                        });
                        ScreenManager.startupScreen = ScreenManager.LOADING_STARTUP_PAGE;
                        return;
                    }
                }
            }
            ScreenManager.startupScreen = new RelationshipEditScreen(null);
        }
    });
})();
