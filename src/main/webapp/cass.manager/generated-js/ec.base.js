var EcAsyncHelper = function() {};
EcAsyncHelper = stjs.extend(EcAsyncHelper, null, [], function(constructor, prototype) {
    constructor.scriptPath = null;
    prototype.counter = null;
    prototype.each = function(array, each, after) {
        var me = this;
        this.counter = array.length;
        if (array.length == 0) 
            after(array);
        for (var i = 0; i < array.length; i++) {
            if (this.counter > 0) 
                each(array[i], function() {
                    me.counter--;
                    if (me.counter == 0) 
                        after(array);
                });
        }
    };
    prototype.stop = function() {
        this.counter = -1;
    };
}, {}, {});
var EcCallbackReturn0 = function() {};
EcCallbackReturn0 = stjs.extend(EcCallbackReturn0, null, [], function(constructor, prototype) {
    prototype.callback = function() {};
}, {}, {});
var EcArray = function() {};
EcArray = stjs.extend(EcArray, null, [], function(constructor, prototype) {
    constructor.isArray = function(o) {
        return toString.call(o) == "[object Array]";
    };
}, {}, {});
var EcCallbackReturn1 = function() {};
EcCallbackReturn1 = stjs.extend(EcCallbackReturn1, null, [], function(constructor, prototype) {
    prototype.callback = function(param1) {};
}, {}, {});
var EcRemote = function() {};
EcRemote = stjs.extend(EcRemote, null, [], function(constructor, prototype) {
    constructor.async = true;
    constructor.postExpectingObject = function(server, service, fd, success, failure) {
        EcRemote.postInner(server, service, fd, EcRemote.getSuccessJSONCallback(success, failure), EcRemote.getFailureCallback(failure));
    };
    constructor.postExpectingString = function(server, service, fd, success, failure) {
        EcRemote.postInner(server, service, fd, EcRemote.getSuccessCallback(success, failure), EcRemote.getFailureCallback(failure));
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
        if ((fd)["_streams"] != null) {
            var chunks = (fd)["_streams"];
            var all = "";
            for (var i = 0; i < chunks.length; i++) {
                if ((typeof chunks[i]) == "function") 
                    all = all + "\r\n";
                 else 
                    all = all + chunks[i];
            }
            all = all + "\r\n" + "\r\n" + "--" + (fd)["_boundary"] + "--";
            p.headers = new Object();
            p.headers["Content-Type"] = "multipart/form-data; boundary=" + (fd)["_boundary"];
            p.data = all;
        } else {
            p.mimeType = "multipart/form-data";
            p.data = fd;
        }
        (p)["contentType"] = false;
        p.cache = false;
        p.async = EcRemote.async;
        p.processData = false;
        p.success = successCallback;
        p.error = failureCallback;
        EcRemote.upgradeHttpToHttps(p);
        $.ajax(p);
    };
    constructor.getExpectingObject = function(server, service, success, failure) {
        var url = server;
        if (!url.endsWith("/") && service != null && service.equals("")) 
            url += "/";
        if (service != null) 
            url += service;
        var p = {};
        p.method = "GET";
        p.url = url;
        p.cache = false;
        p.async = EcRemote.async;
        p.processData = false;
        p.dataType = "json";
        p.success = EcRemote.getSuccessJSONCallback(success, failure);
        p.error = EcRemote.getFailureCallback(failure);
        EcRemote.upgradeHttpToHttps(p);
        $.ajax(p);
    };
    constructor._delete = function(url, signatureSheet, success, failure) {
        var p = {};
        p.method = "DELETE";
        p.url = url;
        p.async = EcRemote.async;
        p.headers = new Object();
        p.headers["signatureSheet"] = signatureSheet;
        p.success = EcRemote.getSuccessCallback(success, failure);
        p.error = EcRemote.getFailureCallback(failure);
        EcRemote.upgradeHttpToHttps(p);
        $.ajax(p);
    };
    constructor.upgradeHttpToHttps = function(p) {
        if (window != null) 
            if (window.location != null) 
                if (p.url.indexOf(window.location.protocol) == -1) 
                    if (window.location.protocol.startsWith("https")) 
                        if (!p.url.startsWith("https:")) 
                            p.url = p.url.replace("http:", "https:");
    };
    constructor.handleFailure = function(failure, paramP1, paramP2, paramP3) {
        if (failure != null) 
            if (paramP1 != null) 
                if (paramP1.responseText != null) 
                    failure(paramP1.responseText);
                 else if (paramP1.statusText != null) 
                    failure(paramP1.statusText.toString());
                 else 
                    failure("General error in AJAX request.");
             else if (paramP2 != null) 
                failure(paramP2);
             else if (paramP3 != null) 
                failure(paramP2);
             else 
                failure("General error in AJAX request.");
    };
    constructor.getSuccessCallback = function(success, failure) {
        return function(arg0, arg1, arg2) {
            if (arg2.status > 300 || arg2.status < 200) 
                failure("Error with code: " + arg2.status);
             else if (success != null) 
                success(arg2.responseText);
        };
    };
    constructor.getSuccessJSONCallback = function(success, failure) {
        return function(arg0, arg1, arg2) {
            if (arg2.status > 300 || arg2.status < 200) 
                failure("Error with code: " + arg2.status);
             else if (success != null) 
                success(JSON.parse(arg2.responseText));
        };
    };
    constructor.getFailureCallback = function(failure) {
        return function(paramP1, paramP2, paramP3) {
            EcRemote.handleFailure(failure, paramP1, paramP2, paramP3);
        };
    };
}, {}, {});
var EcCallback = function() {};
EcCallback = stjs.extend(EcCallback, null, [], function(constructor, prototype) {
    prototype.callback = function(result) {};
}, {}, {});
