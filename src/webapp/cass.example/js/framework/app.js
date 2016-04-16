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

//setTimeout sometimes isn't enough to let the UI draw when hundreds of timeouts are queued up. 
//We add an extra layer of abstraction here to allow the UI to periodically draw.
var timeouts = [];
var tout = [];

function timeoutAndBlock(fun) {
    timeout(fun);
    $("#blocking").foundation('open');
}

var timeoutMax = 6;

function timeout(fun) {
    timeouts.push(fun);
    while (tout.length < timeoutMax)
        tout.push(setTimeout(timeoutLoop, 0));
}

function timeoutLoop() {
    var fun = timeouts.splice(0, 1);
    tout.splice(0,1);
    if (fun.length > 0) {
        (fun[0])();
        tout.push(setTimeout(timeoutLoop, 0));
        
        $(".status").text(timeouts.length + " tasks remaining...").show();
    } else {
        $(".status").text(timeouts.length + " tasks remaining...").hide();
        $("#blocking").foundation('close');
    }
}

function timeoutCheckpoint(){
    for (var i = 0;i < timeoutMax;i++)
    {
        timeout(function(){});
    }
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
