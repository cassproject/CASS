var MoodleConfig = function() {
    EcLinkedData.call(this, null, null);
};
MoodleConfig = stjs.extend(MoodleConfig, EcLinkedData, [], function(constructor, prototype) {
    prototype.enabled = false;
    prototype.moodleEndpoint = null;
    prototype.moodleToken = null;
    prototype.save = function(serverUrl, success, failure) {
        var fd = new FormData();
        fd.append("config", JSON.stringify(this));
        EcIdentityManager.signatureSheetAsync(60000, serverUrl, function(signatureSheet) {
            fd.append("signatureSheet", signatureSheet);
            EcRemote.postExpectingObject(serverUrl, "adapter/moodle/config/set", fd, success, failure);
        });
    };
    constructor.get = function(serverUrl, success, failure) {
        var fd = new FormData();
        EcIdentityManager.signatureSheetAsync(60000, serverUrl, function(signatureSheet) {
            fd.append("signatureSheet", signatureSheet);
            EcRemote.postExpectingObject(serverUrl, "adapter/moodle/config/get", fd, success, failure);
        });
    };
}, {atProperties: {name: "Array", arguments: [null]}}, {});
var XapiConfig = function() {
    EcLinkedData.call(this, null, null);
};
XapiConfig = stjs.extend(XapiConfig, EcLinkedData, [], function(constructor, prototype) {
    prototype.enabled = false;
    prototype.xapiAuth = null;
    prototype.xapiEndpoint = null;
    prototype.xapiHostName = null;
    prototype.save = function(serverUrl, success, failure) {
        var fd = new FormData();
        fd.append("config", JSON.stringify(this));
        EcIdentityManager.signatureSheetAsync(60000, serverUrl, function(signatureSheet) {
            fd.append("signatureSheet", signatureSheet);
            EcRemote.postExpectingObject(serverUrl, "adapter/xapi/config/set", fd, success, failure);
        });
    };
    constructor.get = function(serverUrl, success, failure) {
        var fd = new FormData();
        EcIdentityManager.signatureSheetAsync(60000, serverUrl, function(signatureSheet) {
            fd.append("signatureSheet", signatureSheet);
            EcRemote.postExpectingObject(serverUrl, "adapter/xapi/config/get", fd, success, failure);
        });
    };
}, {atProperties: {name: "Array", arguments: [null]}}, {});
