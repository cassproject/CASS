var EcRemote = function() {};
EcRemote = stjs.extend(EcRemote, null, [], function(constructor, prototype) {
    constructor.postExpectingObject = function(server, service, fd, success, failure) {
        var successCallback = function(arg0, arg1, arg2) {
            if (success != null) 
                success(JSON.parse(arg2.responseText));
        };
        var failureCallback = function(paramP1, paramP2, paramP3) {
            if (failure != null) 
                failure(paramP2);
        };
        EcRemote.postInner(server, service, fd, successCallback, failureCallback);
    };
    constructor.postExpectingString = function(server, service, fd, success, failure) {
        var successCallback = function(arg0, arg1, arg2) {
            if (success != null) 
                success(arg2.responseText);
        };
        var failureCallback = function(paramP1, paramP2, paramP3) {
            if (failure != null) 
                failure(paramP2);
        };
        EcRemote.postInner(server, service, fd, successCallback, failureCallback);
    };
    constructor.postInner = function(server, service, fd, successCallback, failureCallback) {
        var url = server;
        if (!url.endsWith("/") && service != null && !"".equals(service)) 
            url += "/";
        if (service != null) 
            url += service;
        var p = {};
        p.method = "POST";
        p.url = url;
        p.mimeType = "multipart/form-data";
        p.data = fd;
        (p)["contentType"] = false;
        p.cache = false;
        p.processData = false;
        p.success = successCallback;
        p.error = failureCallback;
        $.ajax(p);
    };
    constructor.getExpectingObject = function(server, service, success, failure) {
        var successCallback = function(arg0, arg1, arg2) {
            if (success != null) 
                success(JSON.parse(arg2.responseText));
        };
        var failureCallback = function(paramP1, paramP2, paramP3) {
            if (failure != null) 
                failure(paramP2);
        };
        var url = server;
        if (!url.endsWith("/") && service != null && service.isEmpty() == false) 
            url += "/";
        if (service != null) 
            url += service;
        var p = {};
        p.method = "GET";
        p.url = url;
        p.cache = false;
        p.processData = false;
        p.success = successCallback;
        p.error = failureCallback;
        $.ajax(p);
    };
}, {}, {});
var EcCallbackReturn0 = function() {};
EcCallbackReturn0 = stjs.extend(EcCallbackReturn0, null, [], function(constructor, prototype) {
    prototype.callback = function() {};
}, {}, {});
var EcCallback = function() {};
EcCallback = stjs.extend(EcCallback, null, [], function(constructor, prototype) {
    prototype.callback = function(result) {};
}, {}, {});
