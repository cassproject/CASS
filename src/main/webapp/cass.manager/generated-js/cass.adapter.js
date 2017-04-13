/**
 *  Object that holds the Moodle Adapter configuration values returned 
 *  from the server and provides methods for saving new config values 
 *  
 *  @module org.cassproject
 *  @class MoodleConfig
 *  @constructor
 *  
 *  @author devlin.junker@eduworks.com
 */
var MoodleConfig = function() {
    EcLinkedData.call(this, null, null);
};
MoodleConfig = stjs.extend(MoodleConfig, EcLinkedData, [], function(constructor, prototype) {
    prototype.enabled = false;
    prototype.moodleEndpoint = null;
    prototype.moodleToken = null;
    /**
     *  Saves this config Objects configuration values to the server specified
     *  
     *  @memberOf MoodleConfig
     *  @method save
     *  @param {String} serverUrl
     *  			URL of server to save configuration values to
     *  @param {Callback1<Object>} success
     *  			Callback triggered on successfully saving config values to server
     *  @param {Callback1<String>} failure
     *  			Callback triggered if an error occurs while saving the config values
     */
    prototype.save = function(serverUrl, success, failure) {
        var fd = new FormData();
        fd.append("config", JSON.stringify(this));
        EcIdentityManager.signatureSheetAsync(60000, serverUrl, function(signatureSheet) {
            fd.append("signatureSheet", signatureSheet);
            EcRemote.postExpectingObject(serverUrl, "adapter/moodle/config/set", fd, success, failure);
        });
    };
    /**
     *  Retrieves the Moodle adapter configuration values from the server
     *  
     *  @memberOf MoodleConfig
     *  @method get
     *  @static
     *  @param {String} serverUrl
     *  			URL of server to save configuration values to
     *  @param {Callback1<Object>} success
     *  			Callback triggered on successfully retrieving config values to server
     *  @param {Callback1<String>} failure
     *  			Callback triggered if an error occurs while getting the config values
     */
    constructor.get = function(serverUrl, success, failure) {
        var fd = new FormData();
        EcIdentityManager.signatureSheetAsync(60000, serverUrl, function(signatureSheet) {
            fd.append("signatureSheet", signatureSheet);
            EcRemote.postExpectingObject(serverUrl, "adapter/moodle/config/get", fd, success, failure);
        });
    };
    /**
     *  Retrieves the Moodle adapter Encryption Key from the server to share frameworks with
     *  
     *  @memberOf MoodleConfig
     *  @method get
     *  @static
     *  @param {String} serverUrl
     *  			URL of server to save configuration values to
     *  @param {Callback1<String>} success
     *  			Callback triggered on successfully retrieving config values to server
     *  @param {Callback1<String>} failure
     *  			Callback triggered if an error occurs while getting the config values
     */
    constructor.getMoodleKey = function(serverUrl, success, failure) {
        var fd = new FormData();
        EcIdentityManager.signatureSheetAsync(60000, serverUrl, function(signatureSheet) {
            fd.append("signatureSheet", signatureSheet);
            EcRemote.postExpectingString(serverUrl, "adapter/moodle/config/key", fd, success, failure);
        });
    };
    constructor.syncCassToMoodle = function(serverUrl, success, failure) {
        EcRemote.postExpectingString(serverUrl, "moodle/cassToMoodle", new FormData(), success, failure);
    };
    constructor.syncMoodleToCass = function(serverUrl, success, failure) {
        EcRemote.postExpectingString(serverUrl, "moodle/moodleToCass", new FormData(), success, failure);
    };
}, {atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  Object that holds the xAPI Adapter configuration values returned 
 *  from the server and provides methods for saving new config values 
 *  
 *  @module org.cassproject
 *  @class XapiConfig
 *  @constructor
 *  
 *  @author devlin.junker@eduworks.com
 */
var XapiConfig = function() {
    EcLinkedData.call(this, null, null);
};
XapiConfig = stjs.extend(XapiConfig, EcLinkedData, [], function(constructor, prototype) {
    prototype.enabled = false;
    prototype.xapiAuth = null;
    prototype.xapiEndpoint = null;
    prototype.xapiHostName = null;
    /**
     *  Saves this config Objects configuration values to the server specified
     *  
     *  @memberOf XapiConfig
     *  @method save
     *  @param serverUrl
     *  			URL of server to save configuration values to
     *  @param success
     *  			Callback triggered on successfully saving config values to server
     *  @param failure
     *  			Callback triggered if an error occurs while saving the config values
     */
    prototype.save = function(serverUrl, success, failure) {
        var fd = new FormData();
        fd.append("config", JSON.stringify(this));
        EcIdentityManager.signatureSheetAsync(60000, serverUrl, function(signatureSheet) {
            fd.append("signatureSheet", signatureSheet);
            EcRemote.postExpectingObject(serverUrl, "adapter/xapi/config/set", fd, success, failure);
        });
    };
    /**
     *  Retrieves the adapter configuration values from the server
     *  
     *  @memberOf XapiConfig
     *  @method get
     *  @static
     *  @param serverUrl
     *  			URL of server to save configuration values to
     *  @param success
     *  			Callback triggered on successfully retrieving config values to server
     *  @param failure
     *  			Callback triggered if an error occurs while getting the config values
     */
    constructor.get = function(serverUrl, success, failure) {
        var fd = new FormData();
        EcIdentityManager.signatureSheetAsync(60000, serverUrl, function(signatureSheet) {
            fd.append("signatureSheet", signatureSheet);
            EcRemote.postExpectingObject(serverUrl, "adapter/xapi/config/get", fd, success, failure);
        });
    };
}, {atProperties: {name: "Array", arguments: [null]}}, {});
