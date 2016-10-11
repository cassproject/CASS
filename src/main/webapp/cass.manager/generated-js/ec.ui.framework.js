/**
 *  Object stored in the ScreenManager's history cache array, to keep track of the history of screens and 
 *  which DOM element they were displayed in
 *  
 *  @author devlin.junker@eduworks.com
 */
var HistoryClosure = /**
 *  Constructor for the HistoryClosure Object
 *  
 *  @param name
 *  			Page Name associated with this page (used for loading history screens)
 *  @param screen
 *  			Screen to associate with the page name (to display when loading history screens)
 *  @param containerId
 *  			DOM Selector (ID) of the HTML container to display the screen in on load history
 */
function(name, screen, containerId) {
    this.pageName = name;
    this.screen = screen;
    this.containerId = containerId;
};
HistoryClosure = stjs.extend(HistoryClosure, null, [], function(constructor, prototype) {
    /**
     *  Name of the page (used to retrieve the correct screen on a back/forward button press)
     */
    prototype.pageName = null;
    /**
     *  Screen to store and associate with the page name so that it can be loaded if necessary
     */
    prototype.screen = null;
    /**
     *  ID of the container to display the screen in, once it has been found by page name
     */
    prototype.containerId = null;
}, {screen: "EcScreen"}, {});
/**
 *  Class that represents a "view" that can be displayed in an container element on the page. The View should define 
 *  a display function that loads HTML into the container element on the page and then finally calls the callback once
 *  the view has been completely initialized
 *  
 *  @author devlin.junker@eduworks.com
 */
var EcView = function() {};
EcView = stjs.extend(EcView, null, [], function(constructor, prototype) {
    /**
     *  Function to be defined in subclasses that returns the location of the main html file associated with this view
     *  
     *  @return
     *  			The string path to an html file
     */
    prototype.getHtmlLocation = function() {};
    /**
     *  Display function to override (usually in JavaScript) that will set up any event handlers
     */
    prototype.display = function(containerId) {
        console.error("Not Implemented");
    };
    /**
     *  Function that will convert a view to a certain other view class as long as it the converted type inherits the
     *  current type of the view
     *  
     *  @param _interface
     *  			Class type that the instance should be converted to
     *  @return
     *  			The converted instance of the type passed in
     */
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
    prototype.getUrlParameters = function() {
        return EcView.urlParameters();
    };
    constructor.urlParameters = function() {
        var hashSplit = (window.document.location.hash.split("?"));
        if (hashSplit.length > 1) {
            var o = null;
            var params = (o = new Object());
            var paramString = hashSplit[1];
            var parts = (paramString).split("&");
            for (var i = 0; i < parts.length; i++) 
                params[parts[i].split("=")[0]] = parts[i].replace(parts[i].split("=")[0] + "=", "");
            return o;
        }
        return new Object();
    };
}, {}, {});
/**
 *  Parent class of all view manager classes, stores a cache of the views and their corresponding DOM selectors
 *  and provides functions for setting a view to correspond to a selector and displaying a view after it has 
 *  been added to the cache. 
 *  
 *  @author devlin.junker@eduworks.com
 */
var ViewManager = function() {};
ViewManager = stjs.extend(ViewManager, null, [], function(constructor, prototype) {
    /**
     *  Storage that maps view class instances to DOM Elements
     */
    constructor.viewMap = {};
    /**
     *  Set's the view instance for a specific DOM selector
     *  
     *  @param containerId
     *  			DOM Selector for the element that will correspond to the view
     *  @param view
     *  			View that will correspond to the DOM Selector
     */
    constructor.setView = function(containerId, view) {
        ViewManager.viewMap[containerId] = view;
    };
    /**
     *  Returns the view instance that currently corresponds to a specific DOM selector
     *  
     *  @param containerId
     *  			DOM Selector that corresponds to the view to be returned
     *  @return
     *  			The view that corresponds to the DOM Selector passed in, or null if no view corresponds with it
     */
    constructor.getView = function(containerId) {
        return ViewManager.viewMap[containerId];
    };
    /**
     *  Relates the view to a DOM Selector and calls the view's display function to populate the inner html
     *  of the DOM Selector Element
     *  
     *  @param view
     *  			View to be displayed in the DOM Selector Element
     *  @param containerId
     *  			DOM Selector for element that the view will be displayed in
     *  @param callback
     *  			Callback function to be passed in to the view's display function (to be called once the view has been displayed)
     */
    constructor.showView = function(view, containerId, callback) {
        var htmlLocation = view.getHtmlLocation();
        if (htmlLocation != null) {
            ViewManager.setView(containerId, view);
            $(containerId).load(htmlLocation, null, function(p1, p2, p3) {
                view.display(containerId);
                if (callback != null) 
                    callback();
            });
        }
        $(containerId).removeClass("hide");
    };
    /**
     *  Hides the container specified by the containerId by adding 'hide' class
     *  
     *  @param containerId
     *  			DOM Selector for the element to add the 'hide' class to
     */
    constructor.hideView = function(containerId) {
        $(containerId).addClass("hide");
    };
}, {viewMap: {name: "Map", arguments: [null, "EcView"]}}, {});
/**
 *  STJS Wrapper for the Browser Native History Object
 *  
 *  @author devlin.junker@eduworks.com
 */
var HistoryObject = function() {};
HistoryObject = stjs.extend(HistoryObject, null, [], function(constructor, prototype) {
    prototype.name = null;
}, {}, {});
/**
 *  View Subclass representing modal views that are displayed in the modal container
 *  
 *  @author devlin.junker@eduworks.com
 */
var EcModal = function() {
    EcView.call(this);
};
EcModal = stjs.extend(EcModal, EcView, [], function(constructor, prototype) {
    /**
     *  To be overrided in subclasses, lets the developer define the size of the modal
     */
    prototype.modalSize = "small";
    /**
     *  Function to be invoked when the modal is closed, can be overriden or left blank if nothing
     *  needs to happen on the modal close 
     */
    prototype.onClose = null;
    /**
     *  @return tiny, small, medium, large, or full depending on how large the modal should be
     */
    prototype.getModalSize = function() {};
}, {onClose: "Callback0"}, {});
/**
 *  Subclass of view that is specific for a screen, providing a display name that
 *  will be shown in the URL bar and that can be used on startup to check if the
 *  URL is asking for a certain page on startup.
 *  
 *  @author devlin.junker@eduworks.com
 */
var EcScreen = function() {
    EcView.call(this);
};
EcScreen = stjs.extend(EcScreen, EcView, [], function(constructor, prototype) {
    /**
     *  Name that identifies a certain type of screen, shown in the URL bar to
     *  help the user understand the page that they are on and used during
     *  startup to decide whether or not to load a specifici page on startup.
     */
    prototype.displayName = "";
    /**
     *  Getter for the display name
     *  
     *  @return The display name for the screen
     */
    prototype.getDisplayName = function() {
        return this.displayName;
    };
    prototype.setData = function(data) {};
}, {}, {});
/**
 *  View Manager sub class that manages loading "modal"s and has a few helper functions to make sure that 
 *  they work properly
 *  
 *  @author djunker
 */
var ModalManager = function() {
    ViewManager.call(this);
};
ModalManager = stjs.extend(ModalManager, ViewManager, [], function(constructor, prototype) {
    /**
     *  DOM Selector (ID) of the container to display Modal's in
     */
    constructor.MODAL_CONTAINER_ID = "#modalContainer";
    /**
     *  Application flag that is set when a modal is open, so we can check from the application whether we're in a 
     *  modal or not.
     */
    constructor.inModal = false;
    /**
     *  Retrieves the current view that corresponds to the Modal Container Element (Should be a Modal)
     *  
     *  @return
     *  		EcModal instance that is currently being shown in the Modal container element
     */
    constructor.getCurrentModal = function() {
        return ViewManager.getView(ModalManager.MODAL_CONTAINER_ID);
    };
    /**
     *  Sets the current modal and then shows it by calling the modals display function
     *   
     *  @param modal
     *  			Modal Instance to be displayed in the modal container and set as current
     *  @param callback
     *  			Function to invoke after the modal has been displayed
     */
    constructor.showModal = function(modal, callback) {
        $(ModalManager.MODAL_CONTAINER_ID).removeClass("tiny");
        $(ModalManager.MODAL_CONTAINER_ID).removeClass("small");
        $(ModalManager.MODAL_CONTAINER_ID).removeClass("medium");
        $(ModalManager.MODAL_CONTAINER_ID).removeClass("large");
        $(ModalManager.MODAL_CONTAINER_ID).removeClass("full");
        var modalSize = modal.getModalSize();
        if (modalSize.equals("tiny") || modalSize.equals("small") || modalSize.equals("medium") || modalSize.equals("large") || modalSize.equals("full")) {
            $(ModalManager.MODAL_CONTAINER_ID).addClass(modalSize);
        } else {
            $(ModalManager.MODAL_CONTAINER_ID).addClass("small");
        }
        ViewManager.showView(modal, ModalManager.MODAL_CONTAINER_ID, function() {
            ($(ModalManager.MODAL_CONTAINER_ID)).foundation();
            ($(ModalManager.MODAL_CONTAINER_ID)).foundation("open");
            ModalManager.inModal = true;
            if (callback != null) {
                callback();
            }
        });
    };
    /**
     *  Hides the modal container and returns to the screen or overlay that was being displayed beneath it
     */
    constructor.hideModal = function() {
        ($(ModalManager.MODAL_CONTAINER_ID)).foundation("close");
        ModalManager.inModal = false;
    };
}, {viewMap: {name: "Map", arguments: [null, "EcView"]}}, {});
(function() {
    $(ModalManager.MODAL_CONTAINER_ID).one("closed.zf.reveal", function(arg0, arg1) {
        if (ModalManager.getCurrentModal().onClose != null) 
            ModalManager.getCurrentModal().onClose();
        return true;
    });
})();
/**
 *  Subclass of view for an overlay, extends EcScreen because overlays should have a display name that can be used
 *  in the URL bar and in the history so the page can be loaded on back button or startup 
 *  
 *  @author devlin.junker@eduworks.com
 */
var EcOverlay = function() {
    EcScreen.call(this);
};
EcOverlay = stjs.extend(EcOverlay, EcScreen, [], null, {}, {});
/**
 *  View Manager child class that manages loading "screen"s and saving screen history. This is the main view type
 *  in an application and represents a view that takes up (mostly) the entire browser page. History is tracked in the
 *  session, so  when the back button is pressed, the application will load the previous screen with any data that 
 *  was associated with it.
 *  
 *  @author devlin.junker@eduworks.com
 */
var ScreenManager = function() {
    ViewManager.call(this);
};
ScreenManager = stjs.extend(ScreenManager, ViewManager, [], function(constructor, prototype) {
    /**
     *  DOM Selector (ID) of the Screen Container that will display all of the screen views
     */
    constructor.SCREEN_CONTAINER_ID = "#screenContainer";
    /**
     *  Array to track the history of the current session
     */
    constructor.myHistory = [];
    /**
     *  Screen to be used when another screen is loading information from the server before being able to display
     *  itself. Notice that the display function does not affect the DOM on the page in any way.
     */
    constructor.LOADING_STARTUP_PAGE = new (stjs.extend(function ScreenManager$1() {
        EcScreen.call(this);
    }, EcScreen, [], function(constructor, prototype) {
        prototype.getHtmlLocation = function() {
            return null;
        };
    }, {}, {}))();
    /**
     *  Screen to be set by application on application startup, dictates what the screen should be if the startup
     *  Screen hasn't been set
     */
    constructor.defaultScreen = null;
    /**
     *  Screen to be set by application if it notices that a certain screen should be loaded on startup that is 
     *  different from the default Screen
     */
    constructor.startupScreen = null;
    /**
     *  Callback to be invoked once the application has started and the first screen has been completely loaded
     *  and displayed
     */
    constructor.startupCallback = null;
    /**
     *  Callback invoked during a history load (used in Overlay Manager to open an overlay if it was last history view)
     */
    constructor.loadHistoryCallback = null;
    /**
     *  Array of callbacks that will compare any markers saved in the browser to see if a specific startup screen
     *  should be set. These callbacks should be defined in the screen Java implementation to check if the screen
     *  should be loaded.
     */
    constructor.startupScreenCallbacks = [];
    /**
     *  Function to add startup screen callbacks to the array of callbacks
     *  
     *  @param callback
     *  			callback to add, all callbacks will be invoked on the application startup
     */
    constructor.addStartupScreenCallback = function(callback) {
        ScreenManager.startupScreenCallbacks.unshift(callback);
    };
    /**
     *  Retrieves the current view that corresponds to the Screen Container Element (Should be a screen)
     *  
     *  @return
     *  		EcScreen instance that is currently being shown in the screen container element
     */
    constructor.getCurrentScreen = function() {
        return ViewManager.getView(ScreenManager.SCREEN_CONTAINER_ID);
    };
    /**
     *  Sets the application default Screen that is shown if no startup screen has been defined.
     *  Also sets up some code to run during the application load, that calls the startup callbacks
     *  to see if there is a startup screen different than the defaultScreen, then displays it or the
     *  defaultScreen depending on the results
     *  
     *  @param page
     *  			The default screen that will be displayed if no startup screen is defined during load
     */
    constructor.setDefaultScreen = function(page) {
        ScreenManager.defaultScreen = page;
        $(window.document).ready(function(arg0, arg1) {
            for (var i = 0; i < ScreenManager.startupScreenCallbacks.length; i++) {
                var cb = ScreenManager.startupScreenCallbacks[i];
                cb();
            }
            if (ScreenManager.startupScreen != null) {
                var params = null;
                if (window.document.location.hash.contains("?")) {
                    var hashSplit = (window.document.location.hash.split("?"));
                    if (hashSplit.length > 1 && hashSplit[1] != "") {
                        var paramSplit = (hashSplit[1].split("&"));
                        for (var i = 0; i < paramSplit.length; i++) {
                            var argSplit = (paramSplit[i].split("="));
                            if (argSplit.length == 2) 
                                if (params == null) 
                                    params = new Object();
                            (params)[argSplit[0]] = argSplit[1];
                        }
                    }
                }
                ScreenManager.replaceHistory(ScreenManager.startupScreen, ScreenManager.SCREEN_CONTAINER_ID, params);
                ViewManager.showView(ScreenManager.startupScreen, ScreenManager.SCREEN_CONTAINER_ID, function() {
                    ($(ScreenManager.SCREEN_CONTAINER_ID)).foundation();
                });
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
    /**
     *  Set's the current screen, then show's it by calling the display function. Depending on the
     *  addHistory flag, will add the page passed in to the history array, tracking session page history
     *  
     *  @param page
     *  			The screen to set as current and display
     *  @param addHistory
     *  			Flag for whether to store this page in the history array
     *  @param callback
     *  			Function to invoke after the page has been displayed and foundation has been set up on the new HTML
     */
    constructor.changeScreen = function(page, addHistory, callback) {
        if (addHistory == null) 
            addHistory = true;
        if (addHistory) 
            ScreenManager.addHistory(page, ScreenManager.SCREEN_CONTAINER_ID);
        ViewManager.showView(page, ScreenManager.SCREEN_CONTAINER_ID, function() {
            ($(ScreenManager.SCREEN_CONTAINER_ID)).foundation();
            if (callback != null) 
                callback();
        });
    };
    /**
     *  Set's the current screen, then show's it by calling the display function. This replaces the current HistoryClosure
     *  element for the current screen in the history array, rather than leaving it and (potentially) adding another
     *  history array element like changeScreen
     *  
     *  @param page
     *  			Screen to set as current and display
     *  @param callback
     *  			Function to invoke after the page has been displayed and foundation has been set up on the new HTML
     */
    constructor.replaceScreen = function(page, callback) {
        ScreenManager.replaceHistory(page, ScreenManager.SCREEN_CONTAINER_ID, null);
        ViewManager.showView(page, ScreenManager.SCREEN_CONTAINER_ID, function() {
            ($(ScreenManager.SCREEN_CONTAINER_ID)).foundation();
            if (callback != null) 
                callback();
        });
    };
    /**
     *  Reloads the current screen, leaving the history alone
     *  
     *  @param callback
     *  			Function to invoke after the page has been redisplayed and foundation has been set up on the new HTML
     */
    constructor.reloadCurrentScreen = function(callback) {
        ViewManager.showView(ScreenManager.getCurrentScreen(), ScreenManager.SCREEN_CONTAINER_ID, function() {
            ($(ScreenManager.SCREEN_CONTAINER_ID)).foundation();
            if (callback != null) 
                callback();
        });
    };
    /**
     *  Adds the screen passed in and the display container to a HistoryClosure element and pushes it 
     *  on the end of the history cache array. This does not ensure that the screen is displayed though.
     *  
     *  @param screen
     *  			The screen to add to the history cache array
     *  @param displayContainerId
     *  			DOM Element ID corresponding to where the screen will be displayed (likely the SCREEN_CONTAINER_ID)
     */
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
    /**
     *  Replaces the current end of the history array with a new HistoryClosure element that contains the screen and 
     *  containerId passed in.
     *  
     *  @param screen
     *  			Screen to add to the history element that will replace the last in the history array
     *  @param displayContainerId
     *  			DOM Element ID corresponding to where the screen will be displayed (likely the SCREEN_CONTAINER_ID)
     *  @param params
     *  			Object containing key to value pairs that should be put in the url bar to remember state at this history point
     */
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
        if (hash.endsWith("?")) {
            hash = hash.substring(0, hash.length - 1);
        }
        (window.history).replaceState({name: pageName}, pageName, hash);
    };
    /**
     *  Sets the url parameters on the current page
     *  @param params
     *  		url parameters json object
     */
    constructor.setScreenParameters = function(params) {
        ScreenManager.replaceHistory(ScreenManager.myHistory[ScreenManager.myHistory.length - 1].screen, ScreenManager.SCREEN_CONTAINER_ID, params);
    };
    /**
     *  Searches through the history array for the last screen that was loaded with the name passed in, and then displays
     *  it in the container that it was associated with. If there is no screen in the history, then check
     *  if there is a startupScreen that can be loaded right now, otherwise load the default screen
     *  
     *  @param name
     *  			Name of the screen to search for in the history array
     */
    constructor.loadHistoryScreen = function(name) {
        for (var i = ScreenManager.myHistory.length - 1; i > -1; i--) {
            if (ScreenManager.myHistory[i].pageName == name) {
                if (ScreenManager.myHistory[i].screen != null) {
                    var screen = ScreenManager.myHistory[i].screen;
                    if (ScreenManager.loadHistoryCallback != null) 
                        ScreenManager.loadHistoryCallback(screen);
                    ViewManager.showView(screen, ScreenManager.myHistory[i].containerId, function() {
                        ($(ScreenManager.SCREEN_CONTAINER_ID)).foundation();
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
/**
 *  View Manager that manages displaying overlay views (views that take over the screen, but can be exited to return to
 *  the previous screen) with a few helper functions for managing overlays
 *  
 *  @author devlin.junker@eduworks.com
 *  (NOT TESTED MUCH YET)
 */
var OverlayManager = function() {
    ScreenManager.call(this);
};
OverlayManager = stjs.extend(OverlayManager, ScreenManager, [], function(constructor, prototype) {
    /**
     *  DOM Selector of the overlay wrapper (Should contain the overlay container and overlay close button)
     */
    constructor.OVERLAY_WRAPPER_ID = "#overlay";
    /**
     *  DOM Selector of the overlay close button (clicking this should hide the current overlay) 
     */
    constructor.OVERLAY_CLOSE_BTN_ID = "#closeOverlay";
    /**
     *  DOM Selector of the HTML Element that will display the Overlay's HTML
     */
    constructor.OVERLAY_CONTAINER_ID = "#overlayContainer";
    /**
     *  Used if one of the startupOverlayCallbacks decides that it should be displayed on startup (usually using
     *  the URL to check what should be displayed on start)
     */
    constructor.startupOverlay = null;
    /**
     *  Callbacks that can be defined and run on startup, that should check to see if an overlay should be displayed
     *  immediately when the application starts
     */
    constructor.startupOverlayCallbacks = [];
    /**
     *  Adds a callback to be run on startup that can check if an overlay should be displayed (the callback should
     *  be defined in the overlay)
     *  
     *  @param callback
     *  			callback to be added to the startupOverlayCallbacks list
     */
    constructor.addStartupOverlayCallback = function(callback) {
        OverlayManager.startupOverlayCallbacks.unshift(callback);
    };
    /**
     *  Application flag to check if we're currently in an overlay or not
     */
    constructor.inOverlay = false;
    /**
     *  Retrieves the current view that corresponds to the Overlay Container Element (Should be a Overlay)
     *  
     *  @return
     *  		EcModal instance that is currently being shown in the Overlay container element
     */
    constructor.getCurrentOverlay = function() {
        return ViewManager.getView(OverlayManager.OVERLAY_CONTAINER_ID);
    };
    /**
     *  Variable to hold the last screen, this is useful if we follow a chain of overlays and then want to close them,
     *  we'll make sure to go back to the last screen that was visible to the user
     */
    constructor.lastScreen = null;
    /**
     *  Set's the current overlay, then show's it by calling the display function and unhiding the overlay container.
     *  Depending on the addHistory flag, will add the overlay passed in to the history array 
     *  
     *  @param overlay
     *  			The overlay to set as current and display
     *  @param addHistory
     *  			Flag for whether to store this overlay in the history array
     */
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
    /**
     *  Hides the overlay container and sets the inOverlay flag to false, adds the last screen to the history array so
     *  there is a chain from initial screen to overlay (could be multiple) to initial screen. This way we can press the
     *  back button and be shown the last overlay.
     */
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
