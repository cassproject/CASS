/**
 *  Handles loading the CASS Manager settings from the settings.js file,
 *  this includes the default server to show and the message to show when the user
 *  refreshes the page and is logged out
 *  
 *  @module cass.manager
 *  @class AppSettings
 *  @static
 *  
 *  @author devlin.junker@eduworks.com
 */
var AppSettings = function() {};
AppSettings = stjs.extend(AppSettings, null, [], function(constructor, prototype) {
    constructor.FIELD_MSG_RETURN = "returnLoginMessage";
    constructor.FIELD_SERVER_URL = "defaultServerUrl";
    constructor.FIELD_SERVER_NAME = "defaultServerName";
    constructor.FIELD_SHOW_REPO_MENU = "showRepoMenu";
    constructor.FIELD_SHOW_EXAMPLES_MENU = "showExamplesMenu";
    constructor.returnLoginMessage = "For Your Security, You are Logged Out on Page Reload. Please Enter Your Credentials to Continue Logged In.";
    constructor.defaultServerUrl = "https://sandbox.service.cassproject.org/";
    constructor.defaultServerName = "CASS Sandbox";
    constructor.showRepoMenu = false;
    constructor.showExamplesMenu = false;
    constructor.relationTypes = null;
    /**
     *  Loads the settings from the settings file at settings/settings.js
     *  
     *  @static
     *  @method loadSettings
     */
    constructor.loadSettings = function() {
        var urlBase = "http://" + window.location.host + window.location.pathname;
        EcRemote.getExpectingObject(urlBase, "settings/settings.js", function(settingsObj) {
            var msg = (settingsObj)[AppSettings.FIELD_MSG_RETURN];
            if (msg != null) 
                AppSettings.returnLoginMessage = msg;
            var serverUrl = (settingsObj)[AppSettings.FIELD_SERVER_URL];
            if (serverUrl != null) 
                AppSettings.defaultServerUrl = serverUrl;
            var serverName = (settingsObj)[AppSettings.FIELD_SERVER_NAME];
            if (serverName != null) 
                AppSettings.defaultServerUrl = serverName;
            if ((settingsObj)[AppSettings.FIELD_SHOW_REPO_MENU] == "true") 
                AppSettings.showRepoMenu = true;
            if ((settingsObj)[AppSettings.FIELD_SHOW_EXAMPLES_MENU] == "true") 
                AppSettings.showExamplesMenu = true;
        }, function(p1) {
            console.error("Unable to load settings file");
        });
    };
}, {relationTypes: {name: "Map", arguments: [null, null]}}, {});
(function() {
    AppSettings.relationTypes = {"isEnabledBy": "is Enabled by", "requires": "Requires", "desires": "Desires", "narrows": "Narrows", "isRelatedTo": "is Related to", "isEquivalentTo": "is Equivalent to"};
})();
