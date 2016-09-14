var UserAdminScreen = function() {
    EcScreen.call(this);
};
UserAdminScreen = stjs.extend(UserAdminScreen, EcScreen, [], function(constructor, prototype) {
    constructor.displayName = "admin";
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet!");
    };
    prototype.getDisplayName = function() {
        return UserAdminScreen.displayName;
    };
}, {}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + UserAdminScreen.displayName)) {
            var hashSplit = (window.document.location.hash.split("?"));
            if (LoginController.getPreviouslyLoggedIn() || (hashSplit.length == 2 && hashSplit[1].startsWith("action"))) {
                ScreenManager.startupScreen = new UserAdminScreen();
                ModalManager.showModal(new LoginModal(function() {
                    ModalManager.hideModal();
                    if (!AppController.loginController.getAdmin()) {
                        ScreenManager.replaceScreen(new UserIdentityScreen(), null);
                    }
                }, function() {
                    if (!LoginController.getLoggedIn()) {
                        ScreenManager.replaceScreen(new WelcomeScreen(), null);
                    } else if (LoginController.admin) {
                        ScreenManager.replaceScreen(new UserIdentityScreen(), null);
                    } else {
                        ScreenManager.reloadCurrentScreen(null);
                    }
                }, AppSettings.returnLoginMessage), null);
            }
        }
    });
})();
