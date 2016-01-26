var SearchController = function() {};
SearchController = stjs.extend(SearchController, null, [], function(constructor, prototype) {
    prototype.repo = null;
    prototype.search = function(query) {
        this.repo.search(query, null, function(p1) {
            addTilesToSearchResults(p1);
        }, function(p1) {
            searchError(p1);
        });
    };
    prototype.fileSearch = function(query) {
        var queryAdd = "";
        if (fileManagerSearchesPublic) 
            queryAdd = "(@type:*file OR @encryptedType:*file)";
         else 
            queryAdd = "(@encryptedType:*file)";
        if (query == null || query == "") 
            query = queryAdd;
         else 
            query = "(" + query + ") AND " + queryAdd;
        this.repo.search(query, null, function(p1) {
            addTilesToFileSearchResult(p1);
        }, function(p1) {
            searchError(p1);
        });
    };
}, {repo: "EcRepository"}, {});
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
var RepositoryController = function() {};
RepositoryController = stjs.extend(RepositoryController, null, [], function(constructor, prototype) {
    prototype.repo = null;
    prototype.identity = null;
    prototype.downloadFile = function(id) {
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
        }, function(p1) {});
    };
    prototype.view = function(id) {
        EcRepository.get(id, function(p1) {
            dataEdit(p1.atIfy());
        }, function(p1) {});
    };
    prototype.encryptAndUploadFile = function(name, base64Data, mimeType) {
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
        this.repo.save(encryptedValue, function(p1) {
            fileUploaded();
        }, null);
    };
    prototype.uploadFile = function(name, base64Data, mimeType) {
        var f = new EcFile();
        f.data = base64Data;
        f.name = name;
        f.mimeType = mimeType;
        f.generateId(this.repo.selectedServer);
        this.repo.save(f, function(p1) {
            fileUploaded();
        }, null);
    };
    prototype.upload = function(data) {
        var d = new EcRemoteLinkedData("", "");
        d.copyFrom(JSON.parse(data));
        if (d.invalid()) 
            cannotSaveErrorInData();
        this.repo.save(d, function(p1) {
            savedData();
        }, function(p1) {
            errorSavingData(p1);
        });
    };
}, {repo: "EcRepository", identity: "IdentityController"}, {});
var LoginController = function() {};
LoginController = stjs.extend(LoginController, null, [], function(constructor, prototype) {
    prototype.loginServer = null;
    prototype.identity = null;
    prototype.login = function(username, password) {
        this.loginServer.login(username, password);
        this.loginServer.fetch(function(p1) {
            refreshIdentities(EcIdentityManager.ids);
            refreshContacts(EcIdentityManager.contacts);
            loginSuccess();
        }, function(p1) {
            refreshIdentities(EcIdentityManager.ids);
            refreshContacts(EcIdentityManager.contacts);
            logoutSuccess();
        });
    };
    prototype.create = function(username, password) {
        this.loginServer.login(username, password);
        var me = this;
        this.loginServer.create(function(p1) {
            me.login(username, password);
        }, function(p1) {
            refreshIdentities(EcIdentityManager.ids);
            refreshContacts(EcIdentityManager.contacts);
            logoutSuccess();
        }, new (stjs.extend(function LoginController$5() {
            EcCallbackReturn0.call(this);
        }, EcCallbackReturn0, [], function(constructor, prototype) {
            prototype.callback = function() {
                return padGenerationCallback();
            };
        }, {}, {}))());
    };
    prototype.save = function() {
        var me = this;
        this.loginServer.commit(function(p1) {
            saveSuccess();
        }, function(p1) {
            me.logout();
        }, new (stjs.extend(function LoginController$8() {
            EcCallbackReturn0.call(this);
        }, EcCallbackReturn0, [], function(constructor, prototype) {
            prototype.callback = function() {
                return padGenerationCallback();
            };
        }, {}, {}))());
    };
    prototype.logout = function() {
        this.loginServer.clear();
        this.identity.selectedIdentity = null;
        EcIdentityManager.ids = new Array();
        refreshIdentities(EcIdentityManager.ids);
        logoutSuccess();
    };
}, {loginServer: "EcRemoteIdentityManager", identity: "IdentityController"}, {});
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
        Manager.repo.selectedServer = "http://skyrepo.service.eduworks.com/";
        Manager.searchController.repo = Manager.repo;
        Manager.repositoryController.repo = Manager.repo;
        Manager.repositoryController.identity = Manager.identityController;
        Manager.cryptoController.identity = Manager.identityController;
        Manager.loginController.loginServer = Manager.loginServer;
        Manager.loginController.identity = Manager.identityController;
        Manager.loginServer.configure("UserNameSaltIsSaltyWOOOOO", 5000, 64, "PasswordSalskfeSEfejsfjoepsjof", 5000, 64, "SuperSecretSELKeFJSEOFJSEPF", 5000);
        Manager.loginServer.setIdentityManagementServer("http://skyrepo.service.eduworks.com/");
    };
}, {searchController: "SearchController", loginController: "LoginController", identityController: "IdentityController", repositoryController: "RepositoryController", cryptoController: "CryptoController", repo: "EcRepository", loginServer: "EcRemoteIdentityManager"}, {});
if (!stjs.mainCallDisabled) 
    Manager.main();
