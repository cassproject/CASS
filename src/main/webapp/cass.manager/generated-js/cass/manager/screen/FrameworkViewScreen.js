var FrameworkViewScreen = function(data) {
    CassManagerScreen.call(this);
    this.data = data;
};
FrameworkViewScreen = stjs.extend(FrameworkViewScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "frameworkView";
    prototype.data = null;
    prototype.getDisplayName = function() {
        return FrameworkViewScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/frameworkView.html";
    };
}, {data: "Object", data: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0", nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + FrameworkViewScreen.displayName)) {
            var urlParameters = (EcView.urlParameters());
            var id = urlParameters["id"];
            if (id != null) {
                EcFramework.get(id, function(data) {
                    ScreenManager.replaceScreen(new FrameworkViewScreen(data), CassManagerScreen.reloadShowLoginCallback, urlParameters);
                    CassManagerScreen.showLoginModalIfReload();
                }, function(p1) {
                    ScreenManager.replaceScreen(new FrameworkSearchScreen(null, null, null), CassManagerScreen.reloadShowLoginCallback, urlParameters);
                    CassManagerScreen.showLoginModalIfReload();
                });
                ScreenManager.startupScreen = ScreenManager.LOADING_STARTUP_PAGE;
                return;
            }
            ScreenManager.startupScreen = new FrameworkSearchScreen(null, null, null);
            CassManagerScreen.showLoginModalIfReload();
        }
    });
})();
