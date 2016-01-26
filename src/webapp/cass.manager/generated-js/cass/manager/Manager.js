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
