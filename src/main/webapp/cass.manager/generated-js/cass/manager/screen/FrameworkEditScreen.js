var FrameworkEditScreen = function(data) {
    CassManagerScreen.call(this);
    this.data = data;
};
FrameworkEditScreen = stjs.extend(FrameworkEditScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "frameworkEdit";
    prototype.data = null;
    prototype.getDisplayName = function() {
        return FrameworkEditScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/frameworkEdit.html";
    };
}, {data: "Object", reloadLoginCallback: "Callback0", reloadShowLoginCallback: "Callback0"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + FrameworkEditScreen.displayName)) {
            var hashSplit = (window.document.location.hash.split("?"));
            if (hashSplit.length > 1) {
                var firstParam = hashSplit[1];
                if (firstParam.startsWith("id")) {
                    var paramSplit = (firstParam.split("="));
                    if (paramSplit.length > 1) {
                        var id = paramSplit[1];
                        EcFramework.get(id, function(data) {
                            ScreenManager.replaceScreen(new FrameworkEditScreen(data), CassManagerScreen.reloadShowLoginCallback);
                        }, function(p1) {
                            ScreenManager.replaceScreen(new FrameworkSearchScreen(null, null, null), CassManagerScreen.reloadShowLoginCallback);
                        });
                        ScreenManager.startupScreen = ScreenManager.LOADING_STARTUP_PAGE;
                        return;
                    }
                }
            }
            ScreenManager.startupScreen = new FrameworkEditScreen(null);
            CassManagerScreen.showLoginModalIfReload();
        }
    });
})();
