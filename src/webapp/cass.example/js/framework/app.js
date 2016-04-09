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

//setTimeout sometimes isn't enough to let the UI draw.
//Solution? Why not another layer of abstraction!
var timeouts = [];
var tout = [];

function timeoutAndBlock(fun) {
    timeout(fun);
    $("#blocking").foundation('open');
}

function timeout(fun) {
    timeouts.push(fun);
    while (tout.length < 1)
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
