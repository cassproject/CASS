/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

var loginServer = new EcRemoteIdentityManager();
var repo = new EcRepository();

EcRepository.caching = true;

var identity = null;
var frameworksTemplate = $("#frameworks").outerHTML();
var cassFrameworkTemplate = $(".cass-framework").outerHTML();
var competencyTemplate = $("#competency").outerHTML();
var cassLevelTemplate = $(".cass-competency-level").outerHTML();
$(".cass-competency-level").remove();
var cassCompetencyTemplate = $(".cass-competency").outerHTML();
var cassRelationTemplate = $(".cass-competency-relation").outerHTML();
$("#frameworks").html("");
$("#competency").remove();

function error(error) {
    alert(error);
}

function silent(error) {}

function isObject(obj) {
    return toString.call(obj) == '[object Object]';
}

function isArray(obj) {
    return toString.call(obj) == '[object Array]';
}

timeout(function () {
    repo.autoDetectRepository();
    loginServer.setDefaultIdentityManagementServer(repo.selectedServer);
    loginServer.configure(
        "Replace this with your application salt.", 5000, 64,
        "Replace this with a different application salt.", 5000, 64,
        "Replace this with a third application salt.", 5000
    );
    frameworkSearch();
});
