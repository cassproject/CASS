/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
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
