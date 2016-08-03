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
