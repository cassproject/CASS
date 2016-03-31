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
