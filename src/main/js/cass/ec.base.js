/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
var EcRemote = function() {};
EcRemote = stjs.extend(EcRemote, null, [], function(constructor, prototype) {
    constructor.async = true;
    constructor.postExpectingObject = function(server, service, fd, success, failure) {
        var successCallback = function(arg0, arg1, arg2) {
            if (success != null) 
                success(JSON.parse(arg2.responseText));
        };
        var failureCallback = function(paramP1, paramP2, paramP3) {
            if (failure != null) 
                failure(paramP1.responseText);
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
                failure(paramP1.responseText);
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
        p.async = EcRemote.async;
        p.processData = false;
        p.success = successCallback;
        p.error = failureCallback;
        if (p.url.indexOf(window.location.protocol) == -1) 
            if (!p.url.startsWith("https")) 
                p.url = p.url.replace("http", "https");
        $.ajax(p);
    };
    constructor.getExpectingObject = function(server, service, success, failure) {
        var successCallback = function(arg0, arg1, arg2) {
            if (success != null) 
                success(JSON.parse(arg2.responseText));
        };
        var failureCallback = function(paramP1, paramP2, paramP3) {
            if (failure != null) 
                failure(paramP1.responseText);
        };
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
        p.success = successCallback;
        p.error = failureCallback;
        if (p.url.indexOf(window.location.protocol) == -1) 
            if (!p.url.startsWith("https")) 
                p.url = p.url.replace("http", "https");
        $.ajax(p);
    };
    constructor._delete = function(url, signatureSheet, success, failure) {
        var successCallback = function(arg0, arg1, arg2) {
            if (success != null) 
                success(arg2.responseText);
        };
        var failureCallback = function(paramP1, paramP2, paramP3) {
            if (failure != null) 
                failure(paramP1.responseText);
        };
        var p = {};
        p.method = "DELETE";
        p.url = url;
        p.async = EcRemote.async;
        p.headers = new Object();
        p.headers["signatureSheet"] = signatureSheet;
        p.success = successCallback;
        p.error = failureCallback;
        if (p.url.indexOf(window.location.protocol) == -1) 
            if (!p.url.startsWith("https")) 
                p.url = p.url.replace("http", "https");
        $.ajax(p);
    };
}, {}, {});
var EcCallbackReturn1 = function() {};
EcCallbackReturn1 = stjs.extend(EcCallbackReturn1, null, [], function(constructor, prototype) {
    prototype.callback = function(param1) {};
}, {}, {});
var EcArray = function() {};
EcArray = stjs.extend(EcArray, null, [], function(constructor, prototype) {
    constructor.isArray = function(o) {
        return toString.call(o) == "[object Array]";
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
