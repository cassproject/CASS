/**
 *  Main entry point of the application. Figures out the settings and
 *  starts the EC UI Framework at the appropriate screen.
 *  
 *  @module cass.manager
 *  @class AppController
 *  @static
 *  
 *  @author devlin.junker@eduworks.com
 */
var AppController = function() {};
AppController = stjs.extend(AppController, null, [], function(constructor, prototype) {
    constructor.topBarContainerId = "#menuContainer";
    /**
     *  Manages the server connection by storing and configuring 
     *  the CASS instance endpoint for the rest of the application
     *  and managing the interfaces to it.  
     *  
     *  @property serverController
     *  @static
     *  @type ServerController
     */
    constructor.serverController = null;
    /**
     *  Manages the current user's identities and contacts through the
     *  KBAC libraries. 
     *  
     *  @property identityController
     *  @static
     *  @type IdentityController
     */
    constructor.identityController = null;
    /**
     *  Handles the login/logout and admin communications with the server.
     *  
     *  @property loginController
     *  @static
     *  @type LoginController
     */
    constructor.loginController = null;
    /**
     *  Handles the browser storage
     *  
     *  @property sessionController
     *  @static
     *  @type SessionController
     */
    constructor.storageController = null;
    /**
     *  Entry point of the application
     *  
     *  @param {String[]} args
     *  			Not used at all...
     */
    constructor.main = function(args) {
        AppController.identityController = new IdentityController();
        AppController.storageController = new StorageController();
        AppController.loginController = new LoginController(AppController.storageController);
        AppController.serverController = new ServerController(AppController.storageController, AppSettings.defaultServerUrl, AppSettings.defaultServerName);
        AppSettings.loadSettings();
        AppController.loginController.identity = AppController.identityController;
        ScreenManager.setDefaultScreen(new WelcomeScreen());
        $(window.document).ready(function(arg0, arg1) {
            ViewManager.showView(new AppMenu(), AppController.topBarContainerId, function() {
                ($(window.document)).foundation();
                var menu = ViewManager.getView(AppController.topBarContainerId);
                menu.showRepoMenu(AppSettings.showRepoMenu);
                menu.showExamplesMenu(AppSettings.showExamplesMenu);
            });
            return true;
        });
    };
}, {serverController: "ServerController", identityController: "IdentityController", loginController: "LoginController", storageController: "StorageController"}, {});
if (!stjs.mainCallDisabled) 
    AppController.main();
