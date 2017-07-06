/**
 *  Parent class of all view manager classes, stores a cache of the views and
 *  their corresponding DOM selectors and provides functions for setting a view
 *  to correspond to a selector and displaying a view after it has been added to
 *  the cache.
 *  
 *  @module com.eduworks.ec.ui
 *  @class ViewManager
 *  
 *  @author devlin.junker@eduworks.com
 */
var ViewManager = function() {};
ViewManager = stjs.extend(ViewManager, null, [], function(constructor, prototype) {
    /**
     *  Storage that maps view class instances to DOM Elements
     *  
     *  @private
     *  @property viewMap
     *  @type Map<String, EcView>
     */
    constructor.viewMap = {};
    /**
     *  Set's the view instance for a specific DOM selector
     *  
     *  @memberOf ViewManager
     *  @method setView
     *  @param {String} containerId
     *             DOM Selector for the element that will correspond to the view
     *  @param {EcView} view
     *             View that will correspond to the DOM Selector
     */
    constructor.setView = function(containerId, view) {
        ViewManager.viewMap[containerId] = view;
    };
    /**
     *  Returns the view instance that currently corresponds to a specific DOM
     *  selector
     *  
     *  @memberOf ViewManager
     *  @method getView
     *  @param {String} containerId
     *           DOM Selector that corresponds to the view to be returned
     *  @return {EcView} 
     *  			The view that corresponds to the DOM Selector passed in, or null
     *          	if no view corresponds with it
     */
    constructor.getView = function(containerId) {
        return ViewManager.viewMap[containerId];
    };
    /**
     *  Relates the view to a DOM Selector and calls the view's display function
     *  to populate the inner html of the DOM Selector Element
     *  
     *  @memberOf ViewManager
     *  @method showView
     *  @param {EcView} view
     *             View to be displayed in the DOM Selector Element
     *  @param {String} containerId
     *             DOM Selector for element that the view will be displayed in
     *  @param {Callback0} callback
     *             Callback function to be passed in to the view's display
     *             function (to be called once the view has been displayed)
     */
    constructor.showView = function(view, containerId, callback) {
        var htmlLocation = view.getHtmlLocation();
        if (htmlLocation != null) {
            var oldView = ViewManager.getView(containerId);
            ViewManager.setView(containerId, view);
            if (oldView != null) 
                oldView.onClose();
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
     *  @memberOf ViewManager
     *  @method hideView
     *  @param {String} containerId
     *             DOM Selector for the element to add the 'hide' class to
     */
    constructor.hideView = function(containerId) {
        $(containerId).addClass("hide");
    };
    constructor.destroyView = function(containerId) {
        if (ViewManager.getView(containerId) == null) 
            return;
        ViewManager.getView(containerId).onClose();
        delete ViewManager.viewMap[containerId];
    };
}, {viewMap: {name: "Map", arguments: [null, "EcView"]}}, {});
/**
 *  Object stored in the ScreenManager's history cache array, to keep track of the history of screens and 
 *  which DOM element they were displayed in
 *  
 *  @module com.eduworks.ec.ui
 *  @class HistoryClosure
 *  
 *  @author devlin.junker@eduworks.com
 */
var HistoryClosure = /**
 *  Constructor for the HistoryClosure Object
 *  
 *  @constructor
 *  @param {String} name
 *  			Page Name associated with this page (used for loading history screens)
 *  @param {EcScreen} screen
 *  			Screen to associate with the page name (to display when loading history screens)
 *  @param {String} containerId
 *  			DOM Selector (ID) of the HTML container to display the screen in on load history
 *  @param {Object} params
 *  			URL Params associated with the screen shown
 */
function(name, screen, containerId, params) {
    this.pageName = name;
    this.screen = screen;
    this.containerId = containerId;
    this.screenParameters = params;
};
HistoryClosure = stjs.extend(HistoryClosure, null, [], function(constructor, prototype) {
    /**
     *  Name of the page (used to retrieve the correct screen on a back/forward button press)
     *  
     *  @property pageName
     *  @type String
     */
    prototype.pageName = null;
    /**
     *  Screen to store and associate with the page name so that it can be loaded if necessary
     *  
     *  @property screen
     *  @type EcScreen
     */
    prototype.screen = null;
    /**
     *  ID of the container to display the screen in, once it has been found by page name
     *  
     *  @property containerId
     *  @type String
     */
    prototype.containerId = null;
    /**
     *  URL Parameters associated with the screen
     *  
     *  @property screenParameters
     *  @type Object
     */
    prototype.screenParameters = null;
}, {screen: "EcScreen", screenParameters: "Object"}, {});
/**
 *  Class that represents a "view" that can be displayed in an container element on the page. The View should define 
 *  a display function that loads HTML into the container element on the page and then finally calls the callback once
 *  the view has been completely initialized
 *  
 *  @module com.eduworks.ec.ui
 *  @class EcView
 *  @author devlin.junker@eduworks.com
 */
var EcView = function() {};
EcView = stjs.extend(EcView, null, [], function(constructor, prototype) {
    /**
     *  Function to be defined in subclasses that returns the location of the main html file associated with this view
     *  
     *  @memberOf EcView
     *  @method getHtmlLocation
     *  @abstract
     *  @return {String}
     *  			The string path to an html file
     */
    prototype.getHtmlLocation = function() {};
    /**
     *  Display function to override (usually in JavaScript) that will set up any event handlers
     *  
     *  @memberOf EcView
     *  @method display
     *  @param {String} containerId
     */
    prototype.display = function(containerId) {
        console.error("Not Implemented");
    };
    /**
     *  Function that will convert a view to a certain other view class as long as it the converted type inherits the
     *  current type of the view
     *  
     *  @memberOf EcView
     *  @method as
     *  @param {Class} _interface
     *  			Class type that the instance should be converted to
     *  @return {Object}
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
    /**
     *  Event that is called when the view is deleted, removed, or found to have no applicable selector.
     *  Called upon screen change or when replacing a view with the same selector.
     * 
     *  @memberOf EcView
     *  @method onClose
     *  @return {Boolean} True if the view finished cleaning up after itself. False otherwise.
     */
    prototype.onClose = function() {
        return true;
    };
    /**
     *  Display this alert on the view.
     * 
     *  @memberOf EcView
     *  @method displayAlert
     *  @param {String} Error to display.
     *  @param {String} Type of error.
     */
    prototype.displayAlert = function(err, type) {};
    /**
     *  Clear the alert.
     * 
     *  @memberOf EcView
     *  @method clearAlert
     *  @param {String} Type of error.
     */
    prototype.clearAlert = function(type) {};
}, {}, {});
/**
 *  STJS Wrapper for the Browser Native History Object
 *  
 *  @author devlin.junker@eduworks.com
 */
var HistoryObject = function() {};
HistoryObject = stjs.extend(HistoryObject, null, [], function(constructor, prototype) {
    prototype.name = null;
    prototype.params = null;
}, {params: "Object"}, {});
/**
 *  View Manager sub class that manages loading "modal"s and has a few helper functions to make sure that
 *  they work properly
 * 
 *  @module com.eduworks.ec.ui
 *  @class ModalManager
 *  @extends ViewManager
 * 
 *  @author devlin.junker@eduworks.com
 */
var ModalManager = function() {
    ViewManager.call(this);
};
ModalManager = stjs.extend(ModalManager, ViewManager, [], function(constructor, prototype) {
    /**
     *  DOM Selector (ID) of the container to display Modal's in
     * 
     *  @property MODAL_CONTAINER_ID
     *  @type String
     */
    constructor.MODAL_CONTAINER_ID = "#modalContainer";
    /**
     *  Application flag that is set when a modal is open, so we can check from the application whether we're in a
     *  modal or not.
     * 
     *  @property inModal
     *  @type boolean
     */
    constructor.inModal = false;
    /**
     *  Retrieves the current view that corresponds to the Modal Container Element (Should be a Modal)
     * 
     *  @memberOf ModalManager
     *  @method getCurrentModal
     *  @static
     *  @return {EcModal}
     *  		EcModal instance that is currently being shown in the Modal container element
     */
    constructor.getCurrentModal = function() {
        return ViewManager.getView(ModalManager.MODAL_CONTAINER_ID);
    };
    /**
     *  Sets the current modal and then shows it by calling the modals display function
     * 
     *  @memberOf ModalManager
     *  @method showModal
     *  @static
     *  @param {EcModal} modal
     *  			Modal Instance to be displayed in the modal container and set as current
     *  @param {Callback0} callback
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
     * 
     *  @memberOf ModalManager
     *  @method hideModal
     *  @static
     */
    constructor.hideModal = function() {
        ($(ModalManager.MODAL_CONTAINER_ID)).foundation("close");
        ModalManager.inModal = false;
    };
}, {viewMap: {name: "Map", arguments: [null, "EcView"]}}, {});
(function() {
    $(ModalManager.MODAL_CONTAINER_ID).one("closed.zf.reveal", function(arg0, arg1) {
        var result = ModalManager.getCurrentModal().onClose();
        if (result == null || undefined == result) 
            return true;
        return result;
    });
})();
/**
 *  View Subclass representing modal views that are displayed in the modal container
 *  
 *  @module com.eduworks.ec.ui
 *  @class EcModal
 *  @extends EcView
 *  
 *  @author devlin.junker@eduworks.com
 */
var EcModal = function() {
    EcView.call(this);
};
EcModal = stjs.extend(EcModal, EcView, [], function(constructor, prototype) {
    /**
     *  To be overrided in subclasses, lets the developer define the size of the modal
     *  (Possible: tiny, small, medium, large, xlarge) 
     *  
     *  @property modalSize
     *  @type String
     */
    prototype.modalSize = "small";
    /**
     *  
     *  @memberOf EcModal
     *  @method getModalSize
     *  @abstract
     *  @return tiny, small, medium, large, or full depending on how large the modal should be
     */
    prototype.getModalSize = function() {};
}, {}, {});
/**
 *  Subclass of view that is specific for a screen, providing a display name that
 *  will be shown in the URL bar and that can be used on startup to check if the
 *  URL is asking for a certain page on startup.
 *  
 *  @module com.eduworks.ec.ui
 *  @class EcScreen
 *  @extends EcView
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
     *  startup to decide whether or not to load a specific page on startup.
     *  
     *  @property displayName
     *  @type string
     */
    prototype.displayName = "";
    /**
     *  Getter for the display name
     *  
     *  @memberOf EcScreen
     *  @method getDisplayName
     *  @return The display name for the screen
     */
    prototype.getDisplayName = function() {
        return this.displayName;
    };
    prototype.failure = null;
    prototype.setData = function(data) {};
    prototype.autoFill = function(scope, obj) {
        var props = (obj);
        for (var key in props) {
            this.fillInnerString(scope, obj, key);
        }
        for (var key in props) {
            this.fillInnerStringReferences(scope, obj, key);
        }
        for (var key in props) {
            this.fillInnerArray(scope, obj, key);
        }
    };
    prototype.fillInnerString = function(scope, dataObj, key) {
        var a = (dataObj);
        var v = a[key];
        var textTypes = "[ec-field='" + key + "']";
        if ((typeof v) == "string") {
            var s = v;
            var textFieldTypes = scope.find(textTypes);
            var attrFieldTypes = scope.find("[ec-attr-" + key + "]");
            textFieldTypes.text(v).val(v);
            attrFieldTypes.attr(key, v);
            attrFieldTypes.attr(key.toLowerCase(), v);
            if (scope.is("[ec-field='" + key + "']")) 
                scope.text(v);
            if (scope.is("[ec-attr-" + key + "]")) {
                scope.attr(key, v);
                scope.attr(key.toLowerCase(), v);
            }
        }
        if ((typeof v) == "function") {
            if ((v)["length"] == 0) {
                var textFieldTypes = scope.find(textTypes);
                var attrFieldTypes = scope.find("[ec-attr-" + key + "]");
                if (textFieldTypes.length + attrFieldTypes.length > 0) {
                    v = (v).apply(dataObj, new Array(0));
                    textFieldTypes.text(v).val(v);
                    attrFieldTypes.attr(key, v);
                    attrFieldTypes.attr(key.toLowerCase(), v);
                }
            }
        }
    };
    prototype.fillInnerStringReferences = function(scope, dataObj, key) {
        var a = (dataObj);
        var v = a[key];
        if ((typeof v) == "string") {
            var s = v;
            var referenceTypes = scope.find("[ec-reference='" + key + "']");
            if (referenceTypes.length > 0) {
                if (s.startsWith("http")) {
                    var p1 = EcRepository.getBlocking(s);
                    this.autoFill(referenceTypes, p1);
                }
            }
        }
        if ((typeof v) == "function") {}
    };
    prototype.fillInnerArray = function(scope, dataObj, key) {
        var props = (dataObj);
        var v = props[key];
        if (EcArray.isArray(v)) {
            var containers = scope.find("[ec-container~='" + key + "']");
            for (var idx = 0; idx < containers.length; idx++) {
                var container = containers.eq(idx);
                var array = v;
                for (var i = 0; i < array.length; i++) {
                    this.fillInnerArrayContainer(scope, dataObj, key, props, container, array, i);
                }
            }
        }
    };
    prototype.fillInnerArrayContainer = function(scope, dataObj, key, props, container, array, i) {
        var arrayValue = array[i];
        if (arrayValue.toLowerCase().startsWith("http")) {
            var p1 = EcRepository.getBlocking(arrayValue);
            if (this.shouldFillInnerArray(props, container, p1)) {
                var newContainer = null;
                newContainer = container.find("[ec-template='" + key + "'][id='" + (p1)["id"] + "']");
                if (newContainer.length == 0) 
                    newContainer = this.autoAppend(container, key);
                this.autoFill(newContainer, p1);
                for (var k2 in props) {
                    this.fillInnerArray(newContainer, dataObj, k2);
                }
            }
        } else if (arrayValue.trim().startsWith("{")) {
            var c = this.autoAppend(scope, key);
            this.autoFill(c, JSON.parse(arrayValue));
        } else {
            var c = this.autoAppend(scope, key);
            c.text(arrayValue);
        }
    };
    prototype.shouldFillInnerArray = function(a, container, p1) {
        var attributes = container[0].attributes;
        var found = false;
        var ok = false;
        for (var j = 0; j < attributes.length; j++) {
            var attr = attributes[j];
            if (attr.name.startsWith("ec-condition-")) {
                found = true;
                var parts = (attr.name.replace("ec-condition-", "")).split("-");
                var parentKey = parts[0];
                var childKey = parts[1];
                var parentValue = container.attr(parentKey);
                var childValue = (p1)[childKey];
                if ((typeof childValue) == "function") 
                    childValue = (childValue).apply(p1, new Array(0));
                if (parentValue == childValue) 
                    ok = true;
            }
        }
        if (!found) 
            return true;
        if (found && !ok) 
            return false;
        if (found && ok) 
            return true;
        return false;
    };
    prototype.autoRemove = function(from, template) {
        from.find("[ec-template='" + template + "']").remove();
    };
    prototype.autoAppend = function(from, template) {
        if (from.is("[ec-container~='" + template + "']")) {
            return from.append((this.nameToTemplate)[template]).children().last();
        }
        return from.find("[ec-container~='" + template + "']").append((this.nameToTemplate)[template]).children().last();
    };
    prototype.nameToTemplate = null;
    prototype.autoConfigure = function(jQueryCore) {
        if (this.nameToTemplate == null) 
            this.nameToTemplate = new Object();
        var me = this;
        jQueryCore.find("[ec-template]").each(function(p1, p2) {
            me.autoConfigure($(p2));
            if ((me.nameToTemplate)[p2.getAttribute("ec-template")] == null) {
                (me.nameToTemplate)[p2.getAttribute("ec-template")] = (p2)["outerHTML"];
                p2.parentNode.removeChild(p2);
            }
        });
    };
}, {failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
/**
 *  View Manager child class that manages loading "screen"s and saving screen history. This is the main view type
 *  in an application and represents a view that takes up (mostly) the entire browser page. History is tracked in the
 *  session, so  when the back button is pressed, the application will load the previous screen with any data that
 *  was associated with it.
 * 
 *  @author devlin.junker@eduworks.com
 *  @module com.eduworks.ec.ui
 *  @class Screenmanager
 *  @extends ViewManager
 */
var ScreenManager = function() {
    ViewManager.call(this);
};
ScreenManager = stjs.extend(ScreenManager, ViewManager, [], function(constructor, prototype) {
    /**
     *  DOM Selector (ID) of the Screen Container that will display all of the screen views
     * 
     *  @property SCREEN_CONTAINER_ID
     *  @type String
     */
    constructor.SCREEN_CONTAINER_ID = "#screenContainer";
    /**
     *  Array to track the history of the current session
     * 
     *  @property myHistory
     *  @type HistoryClosure[]
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
    }, {failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {}))();
    /**
     *  Screen to be set by application on application startup, dictates what the screen should be if the startup
     *  Screen hasn't been set
     * 
     *  @property defaultScreen
     *  @type EcScreen
     */
    constructor.defaultScreen = null;
    /**
     *  Screen to be set by application if it notices that a certain screen should be loaded on startup that is
     *  different from the default Screen
     * 
     *  @property startupScreen
     *  @type EcScreen
     */
    constructor.startupScreen = null;
    /**
     *  Callback to be invoked once the application has started and the first screen has been completely loaded
     *  and displayed
     * 
     *  @property startupCallback
     *  @type Callback1<String>
     */
    constructor.startupCallback = null;
    /**
     *  Callback invoked during a history load (used in Overlay Manager to open an overlay if it was last history view)
     * 
     *  @property loadHistoryCallback
     *  @type Callback2<EcScreen, Object>
     */
    constructor.loadHistoryCallback = null;
    /**
     *  Array of callbacks that will compare any markers saved in the browser to see if a specific startup screen
     *  should be set. These callbacks should be defined in the screen Java implementation to check if the screen
     *  should be loaded.
     * 
     *  @property startupScreenCallbacks
     *  @type Callback0[]
     */
    constructor.startupScreenCallbacks = [];
    /**
     *  Function to add startup screen callbacks to the array of callbacks
     * 
     *  @param {Callback0} callback
     *                     callback to add, all callbacks will be invoked on the application startup
     *  @memberOf ScreenManager
     *  @method addStartupScreenCallback
     *  @static
     */
    constructor.addStartupScreenCallback = function(callback) {
        ScreenManager.startupScreenCallbacks.unshift(callback);
    };
    /**
     *  Retrieves the current view that corresponds to the Screen Container Element (Should be a screen)
     * 
     *  @return {EcScreen}
     *  EcScreen instance that is currently being shown in the screen container element
     *  @memberOf ScreenManager
     *  @method getCurrentScreen
     *  @static
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
     *  @param {EcPage} page
     *                  The default screen that will be displayed if no startup screen is defined during load
     *  @memberOf ScreenManager
     *  @method setDefaultScreen
     *  @static
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
                ScreenManager.showScreen(ScreenManager.startupScreen, ScreenManager.SCREEN_CONTAINER_ID, function() {
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
            }, null);
            return true;
        });
    };
    /**
     *  Set's the current screen, then show's it by calling the display function. Depending on the
     *  addHistory flag, will add the page passed in to the history array, tracking session page history
     * 
     *  @param {EcScreen}  page
     *                     The screen to set as current and display
     *  @param {Callback0} callback
     *                     Function to invoke after the page has been displayed and foundation has been set up on the new HTML
     *  @param {Object}    params
     *                     URL parameters to set when the screen changes
     *  @param {boolean}   addHistory
     *                     Flag for whether to store this page in the history array
     *  @memberOf ScreenManager
     *  @method changeScreen
     *  @static
     */
    constructor.changeScreen = function(page, callback, params, addHistory) {
        if (addHistory == null) 
            addHistory = true;
        if (addHistory) 
            ScreenManager.addHistory(page, ScreenManager.SCREEN_CONTAINER_ID, params);
        ScreenManager.showScreen(page, ScreenManager.SCREEN_CONTAINER_ID, function() {
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
     *  @param {EcScreen}  page
     *                     Screen to set as current and display
     *  @param {Callback0} callback
     *                     Function to invoke after the page has been displayed and foundation has been set up on the new HTML
     *  @param {Object}    params
     *                     URL Parameters to set when replacing screen
     *  @memberOf ScreenManager
     *  @method replaceScreen
     *  @static
     */
    constructor.replaceScreen = function(page, callback, params) {
        ScreenManager.replaceHistory(page, ScreenManager.SCREEN_CONTAINER_ID, params);
        ScreenManager.showScreen(page, ScreenManager.SCREEN_CONTAINER_ID, function() {
            ($(ScreenManager.SCREEN_CONTAINER_ID)).foundation();
            if (callback != null) 
                callback();
        });
    };
    /**
     *  Reloads the current screen, leaving the history alone
     * 
     *  @param {Callback0} callback
     *                     Function to invoke after the page has been redisplayed and foundation has been set up on the new HTML
     *  @memberOf ScreenManager
     *  @method reloadCurrentScreen
     *  @static
     */
    constructor.reloadCurrentScreen = function(callback) {
        ScreenManager.showScreen(ScreenManager.getCurrentScreen(), ScreenManager.SCREEN_CONTAINER_ID, function() {
            ($(ScreenManager.SCREEN_CONTAINER_ID)).foundation();
            if (callback != null) 
                callback();
        });
    };
    /**
     *  Adds the screen passed in and the display container to a HistoryClosure element and pushes it
     *  on the end of the history cache array. This does not ensure that the screen is displayed though.
     * 
     *  @param {EcScreen} screen
     *                    The screen to add to the history cache array
     *  @param {String}   displayContainerId
     *                    DOM Element ID corresponding to where the screen will be displayed (likely the SCREEN_CONTAINER_ID)
     *  @param {Object}   params
     *                    Object containing key to value pairs that should be put in the url bar to store in history
     *  @memberOf ScreenManager
     *  @method addHistory
     *  @static
     */
    constructor.addHistory = function(screen, displayContainerId, params) {
        var name = screen.getDisplayName();
        if (name.equals("")) 
            name = screen.displayName;
        if (name.equals("")) 
            return;
        var hash = "#" + name;
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
        var pageName = name;
        ScreenManager.myHistory[ScreenManager.myHistory.length] = new HistoryClosure(pageName, screen, displayContainerId, params);
        (window.history).pushState({name: pageName, params: this.params}, pageName, hash);
    };
    /**
     *  Replaces the current end of the history array with a new HistoryClosure element that contains the screen and
     *  containerId passed in.
     * 
     *  @param {EcScreen} screen
     *                    Screen to add to the history element that will replace the last in the history array
     *  @param {String}   displayContainerId
     *                    DOM Element ID corresponding to where the screen will be displayed (likely the SCREEN_CONTAINER_ID)
     *  @param {Object{   params
     *                    Object containing key to value pairs that should be put in the url bar to remember state at this history point
     *  @memberOf ScreenManager
     *  @method replaceHistory
     *  @static
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
        ScreenManager.myHistory[idx] = new HistoryClosure(pageName, screen, displayContainerId, params);
        var hash = "#" + pageName;
        var query = "";
        if (params != null) {
            query += "?";
            for (var str in (params)) {
                if (!query.endsWith("?")) 
                    query += "&";
                query += str + "=" + (params)[str];
            }
        }
        window.location.hash = hash;
        if (query.endsWith("?")) {
            query = query.substring(0, hash.length - 1);
        }
        (window.history).replaceState({name: window.location.hash + window.location.search, params: this.params}, pageName, hash);
    };
    /**
     *  Sets the url parameters on the current page
     * 
     *  @param {Object} params
     *                  url parameters json object
     *  @memberOf ScreenManager
     *  @method setScreenParameters
     *  @static
     */
    constructor.setScreenParameters = function(params) {
        ScreenManager.replaceHistory(ScreenManager.myHistory[ScreenManager.myHistory.length - 1].screen, ScreenManager.SCREEN_CONTAINER_ID, params);
    };
    /**
     *  Searches through the history array for the last screen that was loaded with the name passed in, and then displays
     *  it in the container that it was associated with. If there is no screen in the history, then check
     *  if there is a startupScreen that can be loaded right now, otherwise load the default screen
     * 
     *  @param {String} name
     *                  Name of the screen to search for in the history array
     *  @memberOf ScreenManager
     *  @method loadHistoryScreen
     *  @static
     */
    constructor.loadHistoryScreen = function(name) {
        var backCount = 0;
        for (var i = ScreenManager.myHistory.length - 1; i > -1; i--) {
            backCount++;
            if (ScreenManager.myHistory[i].pageName == name) {
                if (ScreenManager.myHistory[i].screen != null) {
                    var screen = ScreenManager.myHistory[i].screen;
                    if (ScreenManager.loadHistoryCallback != null) 
                        ScreenManager.loadHistoryCallback(screen, ScreenManager.myHistory[i].screenParameters);
                    ScreenManager.showScreen(screen, ScreenManager.myHistory[i].containerId, function() {
                        ($(ScreenManager.SCREEN_CONTAINER_ID)).foundation();
                    });
                    ScreenManager.myHistory[ScreenManager.myHistory.length] = new HistoryClosure(name, screen, ScreenManager.myHistory[i].containerId, ScreenManager.myHistory[i].screenParameters);
                    window.history.go(-backCount);
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
            ScreenManager.changeScreen(ScreenManager.startupScreen, null, null, false);
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
    /**
     *  Shows a screen, and cleans up the previous screen.
     *  @param screen Screen to display.
     *  @param screenContainerId Container ID to display the screen in.
     *  @param callback0 Event to call when finished displaying.
     */
    constructor.showScreen = function(screen, screenContainerId, callback0) {
        ViewManager.showView(screen, screenContainerId, callback0);
        for (var viewContainerId in ViewManager.viewMap) {
            if ($(viewContainerId).length == 0) 
                ViewManager.destroyView(viewContainerId);
        }
    };
}, {myHistory: {name: "Array", arguments: ["HistoryClosure"]}, LOADING_STARTUP_PAGE: "EcScreen", defaultScreen: "EcScreen", startupScreen: "EcScreen", startupCallback: {name: "Callback1", arguments: [null]}, loadHistoryCallback: {name: "Callback2", arguments: ["EcScreen", "Object"]}, startupScreenCallbacks: {name: "Array", arguments: ["Callback0"]}, viewMap: {name: "Map", arguments: [null, "EcView"]}}, {});
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
 *  Subclass of view for an overlay, extends EcScreen because overlays should have a display name that can be used
 *  in the URL bar and in the history so the page can be loaded on back button or startup 
 *  
 *  @module com.eduworks.ec.ui
 *  @class EcOverlay
 *  @extends EcScreen
 *  
 *  @author devlin.junker@eduworks.com
 */
var EcOverlay = function() {
    EcScreen.call(this);
};
EcOverlay = stjs.extend(EcOverlay, EcScreen, [], null, {failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
var URLParams = function() {};
URLParams = stjs.extend(URLParams, null, [], function(constructor, prototype) {
    /**
     *  Returns the URL Query parameters of the browser window
     *  
     *  @memberOf URLParams
     *  @method queryParams
     *  @static
     *  @return {Map<String, String>}
     *  			URL Query Parameters in a map
     */
    constructor.queryParams = function() {
        if (window.document.location.search == null) 
            return {};
        var hashSplit = (window.document.location.search.split("?"));
        if (hashSplit.length > 1) {
            var o = {};
            var paramString = hashSplit[1];
            var parts = (paramString).split("&");
            for (var i = 0; i < parts.length; i++) 
                o[parts[i].split("=")[0]] = parts[i].replace(parts[i].split("=")[0] + "=", "");
            return o;
        }
        return {};
    };
    /**
     *  Returns the URL Hash parameters of the browser window
     *  
     *  @memberOf EcView
     *  @method hashParams
     *  @static
     *  @return {Map<String, String>}
     *  			URL Hash Parameters in a map
     */
    constructor.hashParams = function() {
        if (window.document.location.hash == null) 
            return {};
        var hashSplit = (window.document.location.hash.split("?"));
        if (hashSplit.length > 1) {
            var o = {};
            var paramString = hashSplit[1];
            var parts = (paramString).split("&");
            for (var i = 0; i < parts.length; i++) 
                o[parts[i].split("=")[0]] = parts[i].replace(parts[i].split("=")[0] + "=", "");
            return o;
        }
        return {};
    };
    /**
     *  Returns the URL parameters of the browser window
     *  
     *  @memberOf URLParams
     *  @method getParams
     *  @static
     *  @return {Map<String, String>}
     *  			URL Parameters in a map
     */
    constructor.getParams = function() {
        var params = URLParams.hashParams();
        var queryParams = URLParams.queryParams();
        for (var key in (queryParams)) {
            (params)[key] = (queryParams)[key];
        }
        return params;
    };
    /**
     *  Returns a specific URL parameter
     *  
     *  @memberOf URLParams
     *  @method get
     *  @static
     *  @param {String} paramName
     *  			Name of URL parameter to retrieve
     *  @return {String}
     *  			Value of URL parameter if it exists
     */
    constructor.get = function(paramName) {
        return URLParams.getParams()[paramName];
    };
    /**
     *  Sets a specific URL Parameter
     *  
     *  @memberOf URLParams
     *  @method set
     *  @static
     *  @param {String} paramName
     *  			Name of URL parameter to set
     *  @param {String} val
     *  			Value to set for URL parameter
     */
    constructor.set = function(paramName, val) {
        var params = URLParams.getParams();
        params[paramName] = val;
        ScreenManager.setScreenParameters(params);
    };
    /**
     *  Sets a specific URL Parameter
     *  
     *  @memberOf URLParams
     *  @method setAll
     *  @static
     *  @param {Object} params
     *  			Map of Strings to Strings for URL parameters
     */
    constructor.setAll = function(params) {
        ScreenManager.setScreenParameters(params);
    };
}, {}, {});
/**
 *  View Manager that manages displaying overlay views (views that take over the screen, but can be exited to return to
 *  the previous screen) with a few helper functions for managing overlays
 *  
 *  @module com.eduworks.ec.ui
 *  @class OverlayManager
 *  @extends ScreenManager
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
     *  
     *  @property OVERLAY_WRAPPER_ID
     *  @type String
     */
    constructor.OVERLAY_WRAPPER_ID = "#overlay";
    /**
     *  DOM Selector of the overlay close button (clicking this should hide the current overlay)
     *  
     *  @property OVERLAY_CLOSE_BTN_ID
     *  @type String
     */
    constructor.OVERLAY_CLOSE_BTN_ID = "#closeOverlay";
    /**
     *  DOM Selector of the HTML Element that will display the Overlay's HTML
     *  
     *  @property OVERLAY_CONTAINER_ID
     *  @type String
     */
    constructor.OVERLAY_CONTAINER_ID = "#overlayContainer";
    /**
     *  Used if one of the startupOverlayCallbacks decides that it should be displayed on startup (usually using
     *  the URL to check what should be displayed on start)
     *  
     *  @property startupOverlay
     *  @type EcOverlay
     */
    constructor.startupOverlay = null;
    /**
     *  Callbacks that can be defined and run on startup, that should check to see if an overlay should be displayed
     *  immediately when the application starts
     *  
     *  @property startupOverlayCallbacks
     *  @type Callback1<String>[] 
     */
    constructor.startupOverlayCallbacks = [];
    /**
     *  Adds a callback to be run on startup that can check if an overlay should be displayed (the callback should
     *  be defined in the overlay)
     *  
     *  @memberOf OverlayManager
     *  @method addStartupOverlayCallback
     *  @param {Callback1<String>} callback
     *  			callback to be added to the startupOverlayCallbacks list
     */
    constructor.addStartupOverlayCallback = function(callback) {
        OverlayManager.startupOverlayCallbacks.unshift(callback);
    };
    /**
     *  Application flag to check if we're currently in an overlay or not
     *  
     *  @property inOverlay
     *  @type boolean
     */
    constructor.inOverlay = false;
    /**
     *  Application flag to change the screen to the same screen on overlay close.
     *  
     *  @property refreshOnOverlayClose
     *  @type boolean
     */
    constructor.refreshOnOverlayClose = true;
    /**
     *  Retrieves the current view that corresponds to the Overlay Container Element (Should be a Overlay)
     *  
     *  @memberOf OverlayManager
     *  @method getCurrentOverlay
     *  @return {EcOverlay}
     *  		EcOverlay instance that is currently being shown in the Overlay container element
     */
    constructor.getCurrentOverlay = function() {
        return ViewManager.getView(OverlayManager.OVERLAY_CONTAINER_ID);
    };
    /**
     *  Variable to hold the last screen, this is useful if we follow a chain of overlays and then want to close them,
     *  we'll make sure to go back to the last screen that was visible to the user
     *  
     *  @property lastScreen
     *  @type EcScreen
     */
    constructor.lastScreen = null;
    /**
     *  Variable to hold the last screen URL Parameters
     *  
     *  @property lastScreenParams
     *  @type Object
     */
    constructor.lastScreenParams = null;
    /**
     *  Set's the current overlay, then show's it by calling the display function and unhiding the overlay container.
     *  Depending on the addHistory flag, will add the overlay passed in to the history array 
     *  
     *  @memberOf OverlayManager
     *  @method showOverlay
     *  @param {EcOverlay} overlay
     *  			The overlay to set as current and display
     *  @param {boolean} addHistory
     *  			Flag for whether to store this overlay in the history array
     */
    constructor.showOverlay = function(overlay, addHistory) {
        if (!OverlayManager.inOverlay && ScreenManager.myHistory[ScreenManager.myHistory.length - 1] != null) {
            OverlayManager.lastScreen = ScreenManager.myHistory[ScreenManager.myHistory.length - 1].screen;
            OverlayManager.lastScreenParams = ScreenManager.myHistory[ScreenManager.myHistory.length - 1].screenParameters;
        }
        if (addHistory == null) 
            addHistory = true;
        if (addHistory) 
            ScreenManager.addHistory(overlay, OverlayManager.OVERLAY_CONTAINER_ID, null);
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
     *  
     *  @memberOf OverlayManager
     *  @method hideOverlay
     */
    constructor.hideOverlay = function() {
        $(OverlayManager.OVERLAY_WRAPPER_ID).fadeOut();
        OverlayManager.inOverlay = false;
        if (ScreenManager.myHistory.length <= 2 && OverlayManager.refreshOnOverlayClose && OverlayManager.lastScreen != null) 
            OverlayManager.changeScreen(OverlayManager.lastScreen, null, OverlayManager.lastScreenParams, null);
        ViewManager.setView(OverlayManager.OVERLAY_CONTAINER_ID, null);
    };
}, {startupOverlay: "EcOverlay", startupOverlayCallbacks: {name: "Array", arguments: [{name: "Callback1", arguments: [null]}]}, lastScreen: "EcScreen", lastScreenParams: "Object", myHistory: {name: "Array", arguments: ["HistoryClosure"]}, LOADING_STARTUP_PAGE: "EcScreen", defaultScreen: "EcScreen", startupScreen: "EcScreen", startupCallback: {name: "Callback1", arguments: [null]}, loadHistoryCallback: {name: "Callback2", arguments: ["EcScreen", "Object"]}, startupScreenCallbacks: {name: "Array", arguments: ["Callback0"]}, viewMap: {name: "Map", arguments: [null, "EcView"]}}, {});
(function() {
    $(window).keydown(function(event, arg1) {
        if (event.keyCode == 27 && OverlayManager.inOverlay) {
            OverlayManager.hideOverlay();
        }
        return true;
    });
    ScreenManager.loadHistoryCallback = function(screen, params) {
        var overlay = screen.as(EcOverlay);
        if (overlay != null && !OverlayManager.inOverlay) {
            OverlayManager.showOverlay(overlay, false);
        } else if (OverlayManager.inOverlay) {
            OverlayManager.hideOverlay();
            OverlayManager.inOverlay = false;
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
