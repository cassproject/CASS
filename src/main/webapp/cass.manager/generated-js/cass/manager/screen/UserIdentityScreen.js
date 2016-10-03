var UserIdentityScreen = function() {
    EcScreen.call(this);
};
UserIdentityScreen = stjs.extend(UserIdentityScreen, EcScreen, [], function(constructor, prototype) {
    constructor.displayName = "identity";
    prototype.getDisplayName = function() {
        return UserIdentityScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/userIdentity.html";
    };
}, {}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + UserIdentityScreen.displayName)) {
            var hashSplit = (window.document.location.hash.split("?"));
            if (LoginController.getPreviouslyLoggedIn() || (hashSplit.length == 2 && hashSplit[1].startsWith("action"))) {
                ScreenManager.startupScreen = new UserIdentityScreen();
                ModalManager.showModal(new LoginModal(function() {
                    ModalManager.hideModal();
                }, function() {
                    if (!LoginController.getLoggedIn()) {
                        ScreenManager.replaceScreen(new WelcomeScreen(), null);
                    } else {
                        ScreenManager.reloadCurrentScreen(null);
                    }
                }, AppSettings.returnLoginMessage), null);
            }
        }
    });
})();
