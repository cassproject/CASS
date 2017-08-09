/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
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
        if($("#blocking").size() > 0)
        	$("#blocking").foundation('close');
    }
}

function timeoutCheckpoint(){
    for (var i = 0;i < timeoutMax;i++)
    {
        timeout(function(){});
    }
}
