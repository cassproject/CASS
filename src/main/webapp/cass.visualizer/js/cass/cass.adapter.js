/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
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
