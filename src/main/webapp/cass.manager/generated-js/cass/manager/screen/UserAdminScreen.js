var UserAdminScreen = function() {
    CassManagerScreen.call(this);
};
UserAdminScreen = stjs.extend(UserAdminScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "admin";
    prototype.getDisplayName = function() {
        return UserAdminScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/userAdmin.html";
    };
}, {data: "Object", reloadLoginCallback: {name: "Callback1", arguments: ["Object"]}, reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + UserAdminScreen.displayName)) {
            var hashSplit = (window.document.location.hash.split("?"));
            if (AppController.loginController.getPreviouslyLoggedIn() || (hashSplit.length == 2 && hashSplit[1].startsWith("action"))) {
                ScreenManager.startupScreen = ScreenManager.LOADING_STARTUP_PAGE;
                ModalManager.showModal(new LoginModal(function(o) {
                    ModalManager.hideModal();
                    if (!AppController.serverController.getAdmin()) {
                        ScreenManager.replaceScreen(new UserIdentityScreen(), null, null);
                    } else {
                        ScreenManager.replaceScreen(new UserAdminScreen(), null, null);
                    }
                }, function() {
                    if (!AppController.loginController.getLoggedIn()) {
                        ScreenManager.replaceScreen(new WelcomeScreen(), null, null);
                    } else if (AppController.serverController.getAdmin()) {
                        ScreenManager.replaceScreen(new UserAdminScreen(), null, null);
                    } else {
                        ScreenManager.reloadCurrentScreen(null);
                    }
                }, AppSettings.returnLoginMessage), null);
            }
        }
    });
})();
