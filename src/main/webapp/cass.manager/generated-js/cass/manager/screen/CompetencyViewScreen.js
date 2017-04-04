var CompetencyViewScreen = function(data) {
    CassManagerScreen.call(this);
    this.data = data;
};
CompetencyViewScreen = stjs.extend(CompetencyViewScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "competencyView";
    prototype.data = null;
    prototype.getDisplayName = function() {
        return CompetencyViewScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/competencyView.html";
    };
    prototype.getData = function() {
        return this.data;
    };
    prototype.mc = null;
    prototype.display = function(containerId) {
        if (this.getData().id != null) {
            var params = new Object();
            (params)["id"] = this.getData().id;
            ScreenManager.setScreenParameters(params);
        }
        ViewManager.showView(this.mc = new MessageContainer("competencyView"), "#competencyViewMessageContainer", null);
        this.autoConfigure($(containerId));
        var me = this;
        EcCompetency.get(this.getData().id, function(competency) {
            AppController.storageController.addRecent(EcCompetency.myType, me.getData().id);
            (ViewManager.getView(AppController.topBarContainerId)).buildRecentCompetencyList(AppController.storageController.getRecent(EcCompetency.myType));
            me.data = competency;
            me.bindControls();
            me.predisplayCompetency();
        }, function(msg) {
            EcCompetency.get(EcRemoteLinkedData.trimVersionFromUrl(me.getData().id), function(framework) {
                me.data = framework;
                me.bindControls();
                me.predisplayCompetency();
            }, function(msg) {
                me.errorRetrieving(msg);
            });
        });
    };
    prototype.predisplayCompetency = function() {
        var me = this;
        me.autoRemove($("body"), "competency");
        me.autoRemove($("body"), "relation");
        me.autoRemove($("body"), "rollupRule");
        me.autoRemove($("body"), "level");
        me.autoAppend($("body"), "competency");
        me.autoFill($("body"), me.getData());
        this.getData().levels(AppController.serverController.getRepoInterface(), function(p1) {
            me.autoFill(me.autoAppend($("[ec-container='level']"), "level"), p1);
        }, (me)["errorFindingLevels"], function(p1) {
            if (p1.length == 0) 
                $("[ec-container='level']").text("None.");
            me.getData().rollupRules(AppController.serverController.getRepoInterface(), function(p1) {
                me.autoFill(me.autoAppend($("[ec-container='rollupRule']"), "rollupRule"), p1);
            }, (me)["errorFindingRollupRules"], function(p1) {
                if (p1.length == 0) 
                    $("[ec-container='rollupRule']").text("None.");
                me.getData().relations(AppController.serverController.getRepoInterface(), function(p1) {
                    me.autoFill(me.autoAppend($("[ec-container='relation']"), "relation"), p1);
                    me.bindControls();
                }, (me)["errorFindingRelations"], function(p1) {
                    if (p1.length == 0) 
                        $("[ec-container='relation']").text("None.");
                });
            });
        });
    };
    prototype.errorRetrieving = function(err) {
        if (err == null) 
            err = "Unable to Connect to Server to Retrieve Framework";
        this.mc.displayAlert(err, "getFramework");
    };
    prototype.bindControls = function() {};
}, {data: "Object", mc: "MessageContainer", data: "Object", reloadLoginCallback: {name: "Callback1", arguments: ["Object"]}, reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + CompetencyViewScreen.displayName)) {
            var urlParameters = (URLParams.getParams());
            var id = urlParameters["id"];
            if (id != null) {
                EcCompetency.get(id, function(data) {
                    ScreenManager.replaceScreen(new CompetencyViewScreen(data), CassManagerScreen.reloadShowLoginCallback, urlParameters);
                    CassManagerScreen.showLoginModalIfReload();
                }, function(p1) {
                    ScreenManager.replaceScreen(new CompetencySearchScreen(null, null, null), CassManagerScreen.reloadShowLoginCallback, urlParameters);
                    CassManagerScreen.showLoginModalIfReload();
                });
                ScreenManager.startupScreen = ScreenManager.LOADING_STARTUP_PAGE;
                return;
            }
            ScreenManager.startupScreen = new CompetencySearchScreen(null, null, null);
            CassManagerScreen.showLoginModalIfReload();
        }
    });
})();
