var EcView = function() {};
EcView = stjs.extend(EcView, null, [], function(constructor, prototype) {
    prototype.display = function(containerId, callback) {};
    prototype.as = function(_interface) {
        var prototype = (this)["__proto__"];
        var constructor = (prototype)["constructor"];
        var inherits = (constructor)["$inherit"];
        if (inherits != null) 
            for (var i = 0; i < inherits.length; i++) {
                if (inherits[i] == _interface) {
                    return this;
                }
            }
        return null;
    };
}, {}, {});
var ViewManager = function() {};
ViewManager = stjs.extend(ViewManager, null, [], function(constructor, prototype) {
    constructor.viewMap = {};
    constructor.setView = function(containerId, view) {
        ViewManager.viewMap[containerId] = view;
    };
    constructor.getView = function(containerId) {
        return ViewManager.viewMap[containerId];
    };
    constructor.showView = function(view, containerId, callback) {
        ViewManager.setView(containerId, view);
        view.display(containerId, callback);
    };
}, {viewMap: {name: "Map", arguments: [null, "EcView"]}}, {});
var HistoryObject = function() {};
HistoryObject = stjs.extend(HistoryObject, null, [], function(constructor, prototype) {
    prototype.name = null;
}, {}, {});
var HistoryClosure = function(name, screen, containerId) {
    this.pageName = name;
    this.screen = screen;
    this.containerId = containerId;
};
HistoryClosure = stjs.extend(HistoryClosure, null, [], function(constructor, prototype) {
    prototype.pageName = null;
    prototype.screen = null;
    prototype.containerId = null;
}, {screen: "EcScreen"}, {});
var EcModal = function() {
    EcView.call(this);
};
EcModal = stjs.extend(EcModal, EcView, [], function(constructor, prototype) {
    prototype.modalSize = "small";
}, {}, {});
var EcScreen = function() {
    EcView.call(this);
};
EcScreen = stjs.extend(EcScreen, EcView, [], function(constructor, prototype) {
    prototype.displayName = "";
    prototype.getDisplayName = function() {
        return this.displayName;
    };
}, {}, {});
var ModalManager = function() {
    ViewManager.call(this);
};
ModalManager = stjs.extend(ModalManager, ViewManager, [], function(constructor, prototype) {
    constructor.MODAL_CONTAINER_ID = "#modalContainer";
    constructor.inModal = false;
    constructor.getCurrentModal = function() {
        return ViewManager.getView(ModalManager.MODAL_CONTAINER_ID);
    };
    constructor.showModal = function(modal) {
        $(ModalManager.MODAL_CONTAINER_ID).removeClass("tiny");
        $(ModalManager.MODAL_CONTAINER_ID).removeClass("small");
        $(ModalManager.MODAL_CONTAINER_ID).removeClass("large");
        $(ModalManager.MODAL_CONTAINER_ID).removeClass("full");
        if (modal.modalSize.equals("tiny") || modal.modalSize.equals("small") || modal.modalSize.equals("large") || modal.modalSize.equals("full")) {
            $(ModalManager.MODAL_CONTAINER_ID).addClass(modal.modalSize);
        } else {
            $(ModalManager.MODAL_CONTAINER_ID).addClass("small");
        }
        ViewManager.showView(modal, ModalManager.MODAL_CONTAINER_ID, function() {
            ($(window.document)).foundation();
            ($(ModalManager.MODAL_CONTAINER_ID)).foundation("open");
            ModalManager.inModal = true;
        });
    };
    constructor.hideModal = function() {
        ($(ModalManager.MODAL_CONTAINER_ID)).foundation("close");
        ModalManager.inModal = false;
    };
}, {viewMap: {name: "Map", arguments: [null, "EcView"]}}, {});
var EcOverlay = function() {
    EcScreen.call(this);
};
EcOverlay = stjs.extend(EcOverlay, EcScreen, [], null, {}, {});
var ScreenManager = function() {
    ViewManager.call(this);
};
ScreenManager = stjs.extend(ScreenManager, ViewManager, [], function(constructor, prototype) {
    constructor.SCREEN_CONTAINER_ID = "#screenContainer";
    constructor.myHistory = [];
    constructor.LOADING_STARTUP_PAGE = new (stjs.extend(function ScreenManager$1() {
        EcScreen.call(this);
    }, EcScreen, [], function(constructor, prototype) {
        prototype.display = function(containerId, callback) {
            if (callback != null) 
                callback();
        };
    }, {}, {}))();
    constructor.defaultScreen = null;
    constructor.startupScreen = null;
    constructor.startupCallback = null;
    constructor.loadHistoryCallback = null;
    constructor.startupScreenCallbacks = [];
    constructor.addStartupScreenCallback = function(callback) {
        ScreenManager.startupScreenCallbacks.unshift(callback);
    };
    constructor.getCurrentScreen = function() {
        return ViewManager.getView(ScreenManager.SCREEN_CONTAINER_ID);
    };
    constructor.setDefaultScreen = function(page) {
        ScreenManager.defaultScreen = page;
        $(window.document).ready(function(arg0, arg1) {
            for (var i = 0; i < ScreenManager.startupScreenCallbacks.length; i++) {
                var cb = ScreenManager.startupScreenCallbacks[i];
                cb();
            }
            if (ScreenManager.startupScreen != null) {
                ScreenManager.replaceScreen(ScreenManager.startupScreen, null);
                return true;
            }
            if (ScreenManager.defaultScreen == null) {
                console.error("Default Page Not Set, Cannot Start Application");
                return false;
            }
            var locationHash = window.document.location.hash;
            ScreenManager.replaceScreen(ScreenManager.defaultScreen, function() {
                if (ScreenManager.startupCallback != null) 
                    ScreenManager.startupCallback(locationHash);
            });
            return true;
        });
    };
    constructor.changeScreen = function(page, addHistory, callback) {
        if (addHistory == null) 
            addHistory = true;
        if (addHistory) 
            ScreenManager.addHistory(page, ScreenManager.SCREEN_CONTAINER_ID);
        ViewManager.showView(page, ScreenManager.SCREEN_CONTAINER_ID, function() {
            ($(window.document)).foundation();
            if (callback != null) 
                callback();
        });
    };
    constructor.replaceScreen = function(page, callback) {
        ScreenManager.replaceHistory(page, ScreenManager.SCREEN_CONTAINER_ID, null);
        ViewManager.showView(page, ScreenManager.SCREEN_CONTAINER_ID, function() {
            ($(window.document)).foundation();
            if (callback != null) 
                callback();
        });
    };
    constructor.addHistory = function(screen, displayContainerId) {
        var name = screen.getDisplayName();
        if (name.equals("")) 
            name = screen.displayName;
        if (name.equals("")) 
            return;
        var pageName = name;
        ScreenManager.myHistory[ScreenManager.myHistory.length] = new HistoryClosure(pageName, screen, displayContainerId);
        (window.history).pushState({name: pageName}, pageName, "#" + pageName);
    };
    constructor.replaceHistory = function(screen, displayContainerId, params) {
        var name = screen.getDisplayName();
        if (name.equals("")) 
            name = screen.displayName;
        if (name.equals("")) 
            return;
        var pageName = name;
        var idx = ScreenManager.myHistory.length - 1;
        if (idx < 0) 
            idx = 0;
        ScreenManager.myHistory[idx] = new HistoryClosure(pageName, screen, displayContainerId);
        var hash = "#" + pageName;
        if (params != null) {
            hash += "?";
            for (var str in (params)) {
                if (!hash.endsWith("?")) 
                    hash += "&";
                hash += str + "=" + (params)[str];
            }
        }
        (window.history).replaceState({name: pageName}, pageName, hash);
    };
    constructor.loadHistoryScreen = function(name) {
        for (var i = ScreenManager.myHistory.length - 1; i > -1; i--) {
            if (ScreenManager.myHistory[i].pageName == name) {
                if (ScreenManager.myHistory[i].screen != null) {
                    var screen = ScreenManager.myHistory[i].screen;
                    if (ScreenManager.loadHistoryCallback != null) 
                        ScreenManager.loadHistoryCallback(screen);
                    ViewManager.showView(screen, ScreenManager.myHistory[i].containerId, function() {
                        ($(window.document)).foundation();
                    });
                    ScreenManager.myHistory[ScreenManager.myHistory.length] = new HistoryClosure(name, screen, ScreenManager.myHistory[i].containerId);
                    return;
                }
            }
        }
        ScreenManager.startupScreen = null;
        for (var i = 0; i < ScreenManager.startupScreenCallbacks.length; i++) {
            var cb = ScreenManager.startupScreenCallbacks[i];
            cb();
        }
        if (ScreenManager.startupScreen != null) 
            ScreenManager.changeScreen(ScreenManager.startupScreen, false, null);
        var tempName = ScreenManager.defaultScreen.getDisplayName();
        if (tempName.equals("")) 
            tempName = ScreenManager.defaultScreen.displayName;
        if (tempName.equals("")) 
            return;
        var defaultName = name;
        if (name.equals(defaultName)) {
            window.history.go(-1 * window.history.length);
        }
    };
}, {myHistory: {name: "Array", arguments: ["HistoryClosure"]}, LOADING_STARTUP_PAGE: "EcScreen", defaultScreen: "EcScreen", startupScreen: "EcScreen", startupCallback: {name: "Callback1", arguments: [null]}, loadHistoryCallback: {name: "Callback1", arguments: ["EcScreen"]}, startupScreenCallbacks: {name: "Array", arguments: ["Callback0"]}, viewMap: {name: "Map", arguments: [null, "EcView"]}}, {});
(function() {
    $(window).on("popstate", function(event, arg1) {
        var state = (event.originalEvent)["state"];
        if (state != null) {
            var poppedName = (state)["name"];
            ScreenManager.loadHistoryScreen(poppedName);
        }
        return true;
    });
})();
var OverlayManager = function() {
    ScreenManager.call(this);
};
OverlayManager = stjs.extend(OverlayManager, ScreenManager, [], function(constructor, prototype) {
    constructor.OVERLAY_WRAPPER_ID = "#overlay";
    constructor.OVERLAY_CLOSE_BTN_ID = "#closeOverlay";
    constructor.OVERLAY_CONTAINER_ID = "#overlayContainer";
    constructor.startupOverlay = null;
    constructor.startupOverlayCallbacks = [];
    constructor.addStartupOverlayCallback = function(callback) {
        OverlayManager.startupOverlayCallbacks.unshift(callback);
    };
    constructor.inOverlay = false;
    constructor.getCurrentOverlay = function() {
        return ViewManager.getView(OverlayManager.OVERLAY_CONTAINER_ID);
    };
    constructor.lastScreen = null;
    constructor.showOverlay = function(overlay, addHistory) {
        if (!OverlayManager.inOverlay && ScreenManager.myHistory[ScreenManager.myHistory.length - 1] != null) 
            OverlayManager.lastScreen = ScreenManager.myHistory[ScreenManager.myHistory.length - 1].screen;
        if (addHistory == null) 
            addHistory = true;
        if (addHistory) 
            ScreenManager.addHistory(overlay, OverlayManager.OVERLAY_CONTAINER_ID);
        ViewManager.showView(overlay, OverlayManager.OVERLAY_CONTAINER_ID, function() {
            ($(window.document)).foundation();
            $(OverlayManager.OVERLAY_WRAPPER_ID).addClass("active");
            $(OverlayManager.OVERLAY_WRAPPER_ID).fadeIn();
            OverlayManager.inOverlay = true;
        });
        $(OverlayManager.OVERLAY_CLOSE_BTN_ID).off("click");
        $(OverlayManager.OVERLAY_CLOSE_BTN_ID).click(function(arg0, arg1) {
            OverlayManager.hideOverlay();
            return true;
        });
    };
    constructor.hideOverlay = function() {
        $(OverlayManager.OVERLAY_WRAPPER_ID).fadeOut();
        OverlayManager.inOverlay = false;
        ScreenManager.changeScreen(OverlayManager.lastScreen, true, null);
    };
}, {startupOverlay: "EcOverlay", startupOverlayCallbacks: {name: "Array", arguments: [{name: "Callback1", arguments: [null]}]}, lastScreen: "EcScreen", myHistory: {name: "Array", arguments: ["HistoryClosure"]}, LOADING_STARTUP_PAGE: "EcScreen", defaultScreen: "EcScreen", startupScreen: "EcScreen", startupCallback: {name: "Callback1", arguments: [null]}, loadHistoryCallback: {name: "Callback1", arguments: ["EcScreen"]}, startupScreenCallbacks: {name: "Array", arguments: ["Callback0"]}, viewMap: {name: "Map", arguments: [null, "EcView"]}}, {});
(function() {
    $(window).keydown(function(event, arg1) {
        if (event.keyCode == 27 && OverlayManager.inOverlay) 
            OverlayManager.hideOverlay();
        return true;
    });
    ScreenManager.loadHistoryCallback = function(screen) {
        var overlay = screen.as(EcOverlay);
        if (overlay != null && !OverlayManager.inOverlay) {
            OverlayManager.showOverlay(overlay, false);
        } else if (OverlayManager.inOverlay) {
            OverlayManager.hideOverlay();
        }
    };
    ScreenManager.startupCallback = function(locationHash) {
        for (var i = 0; i < OverlayManager.startupOverlayCallbacks.length; i++) {
            var cb = OverlayManager.startupOverlayCallbacks[i];
            cb(locationHash);
        }
        if (OverlayManager.startupOverlay != null) {
            OverlayManager.showOverlay(OverlayManager.startupOverlay, true);
        }
    };
})();
