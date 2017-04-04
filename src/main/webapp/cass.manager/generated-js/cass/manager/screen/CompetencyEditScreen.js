var CompetencyEditScreen = function(data, frameworkIdToAddCompetencyTo) {
    CassManagerScreen.call(this);
    this.data = data;
    this.frameworkId = frameworkIdToAddCompetencyTo;
};
CompetencyEditScreen = stjs.extend(CompetencyEditScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "competencyEdit";
    prototype.frameworkId = null;
    prototype.getDisplayName = function() {
        return CompetencyEditScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/competencyEdit.html";
    };
}, {data: "Object", reloadLoginCallback: {name: "Callback1", arguments: ["Object"]}, reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + CompetencyEditScreen.displayName)) {
            var urlParameters = (URLParams.getParams());
            var id = urlParameters["id"];
            if (id != null) {
                EcCompetency.get(id, function(data) {
                    ScreenManager.replaceScreen(new CompetencyEditScreen(data, urlParameters["frameworkId"]), CassManagerScreen.reloadShowLoginCallback, urlParameters);
                }, function(p1) {
                    ScreenManager.replaceScreen(new CompetencySearchScreen(null, null, null), CassManagerScreen.reloadShowLoginCallback, urlParameters);
                });
                ScreenManager.startupScreen = ScreenManager.LOADING_STARTUP_PAGE;
                return;
            }
            ScreenManager.startupScreen = new CompetencyEditScreen(null, null);
            CassManagerScreen.showLoginModalIfReload();
        }
    });
})();
