var xapiConfig = function() {
    EcLinkedData.call(this, null, null);
};
xapiConfig = stjs.extend(xapiConfig, EcLinkedData, [], function(constructor, prototype) {
    prototype.enabled = false;
    prototype.xapiAuth = null;
    prototype.xapiEndpoint = null;
    prototype.xapiHostName = null;
    prototype.save = function(serverUrl, success, failure) {
        var fd = new FormData();
        fd.append("config", JSON.stringify(this));
        EcRemote.postExpectingObject(serverUrl, "adapter/xapi/config/set", fd, success, failure);
    };
    constructor.get = function(serverUrl, success, failure) {
        EcRemote.getExpectingObject(serverUrl, "adapter/xapi/config/get", success, failure);
    };
}, {atProperties: {name: "Array", arguments: [null]}}, {});
