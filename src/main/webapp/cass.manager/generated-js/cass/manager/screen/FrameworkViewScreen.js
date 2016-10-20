var FrameworkViewScreen = function(data) {
    CassManagerScreen.call(this);
    this.data = data;
};
FrameworkViewScreen = stjs.extend(FrameworkViewScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "frameworkView";
    prototype.mc = null;
    prototype.getData = function() {
        return this.data;
    };
    prototype.getDisplayName = function() {
        return FrameworkViewScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/frameworkView.html";
    };
    prototype.display = function(containerId) {
        if (this.getData().id != null) {
            var params = new Object();
            (params)["id"] = this.getData().id;
            ScreenManager.setScreenParameters(params);
        }
        ViewManager.showView(this.mc = new MessageContainer("frameworkView"), "#frameworkViewMessageContainer", null);
        this.autoConfigure($(containerId));
        var me = this;
        EcFramework.get(this.getData().id, function(framework) {
            me.data = framework;
            me.bindControls();
            me.predisplayFramework();
        }, function(msg) {
            EcFramework.get(EcRemoteLinkedData.trimVersionFromUrl(me.getData().id), function(framework) {
                me.data = framework;
                me.bindControls();
                me.predisplayFramework();
            }, function(msg) {
                me.errorRetrieving(msg);
            });
        });
    };
    prototype.predisplayFramework = function() {
        var me = this;
        AppController.repoInterface.precache(this.getData().competency, function() {
            AppController.repoInterface.precache(me.getData().relation, function() {
                AppController.repoInterface.precache(me.getData().level, function() {
                    me.autoRemove($("body"), "framework");
                    me.autoAppend($("body"), "framework");
                    me.autoFill($("body"), me.getData());
                    me.displayVisualization();
                });
            });
        });
    };
    prototype.deleteFramework = function() {
        var me = this;
        ModalManager.showModal(new ConfirmModal(function() {
            me.getData()._delete(function(p1) {
                ScreenManager.changeScreen(new FrameworkSearchScreen(null, null, null), null, null, null);
            }, function(err) {
                if (err == null) 
                    err = "Unable to connect to server to delete framework";
                me.mc.displayAlert(err, null);
            });
            ModalManager.hideModal();
        }, "Are you sure you want to delete this framework?"), null);
    };
    prototype.errorRetrieving = function(err) {
        if (err == null) 
            err = "Unable to Connect to Server to Retrieve Framework";
        this.mc.displayAlert(err, "getFramework");
    };
    prototype.displayVisualization = function() {};
    prototype.bindControls = function() {};
}, {mc: "MessageContainer", data: "Object", nameToTemplate: "Object", reloadLoginCallback: "Callback1", reloadShowLoginCallback: "Callback0"}, {});
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
