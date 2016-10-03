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
        AppController.repoInterface.constructor.caching = true;
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
