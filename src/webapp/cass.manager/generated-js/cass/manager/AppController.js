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
        AppController.serverController = new ServerController("http://skyrepo.service.eduworks.com/", "SkyRepo");
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
