var AssertionEditScreen = function(data) {
    CassManagerScreen.call(this);
    this.data = data;
};
AssertionEditScreen = stjs.extend(AssertionEditScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "assertionEdit";
    prototype.data = null;
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet!");
    };
    prototype.getDisplayName = function() {
        return AssertionEditScreen.displayName;
    };
}, {data: "Object", reloadLoginCallback: "Callback0", reloadShowLoginCallback: "Callback0"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + AssertionEditScreen.displayName)) {
            var hashSplit = (window.document.location.hash.split("?"));
            if (hashSplit.length > 1) {
                var firstParam = hashSplit[1];
                if (firstParam.startsWith("id")) {
                    var paramSplit = (firstParam.split("="));
                    if (paramSplit.length > 1) {
                        var id = paramSplit[1];
                        EcAssertion.get(id, function(data) {
                            ScreenManager.replaceScreen(new AssertionEditScreen(data), CassManagerScreen.reloadShowLoginCallback);
                        }, function(p1) {
                            ScreenManager.replaceScreen(new AssertionSearchScreen(null), CassManagerScreen.reloadShowLoginCallback);
                        });
                        ScreenManager.startupScreen = ScreenManager.LOADING_STARTUP_PAGE;
                        return;
                    }
                }
            }
            ScreenManager.startupScreen = new AssertionEditScreen(null);
            CassManagerScreen.showLoginModalIfReload();
        }
    });
})();
