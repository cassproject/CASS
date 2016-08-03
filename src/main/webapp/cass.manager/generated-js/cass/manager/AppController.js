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
