var loginServer = new EcRemoteIdentityManager();
var identity = null;

var frameworksTemplate = $("#frameworks").outerHTML();
var cassFrameworkTemplate = $(".cass-framework").outerHTML();
var competencyTemplate = $("#competency").outerHTML();
var cassCompetencyTemplate = $(".cass-competency").outerHTML();
var cassRelationTemplate = $(".cass-competency-relation").outerHTML();
var cassLevelTemplate = $(".cass-competency-level").outerHTML();
$("#frameworks").html("");
$("#competency").remove();

loginServer.setDefaultIdentityManagementServer("http://sandbox.service.cassproject.org/");
loginServer.configure(
    "Replace this with your application salt.", 5000, 64,
    "Replace this with a different application salt.", 5000, 64,
    "Replace this with a third application salt.", 5000
);

var repo = new EcRepository();
EcRepository.caching = true;
repo.selectedServer = "http://sandbox.service.cassproject.org/";

function error(error) {
    alert(error);
}

function isObject(obj) {
  return toString.call(obj) == '[object Object]';
}

function isArray(obj) {
  return toString.call(obj) == '[object Array]';
}

//setTimeout sometimes isn't enough to let the UI draw.
//Solution? Why not another layer of abstraction!
var timeouts = [];
var tout = null;
function timeout(fun)
{
    timeouts.push(fun);
    if (tout == null)
        tout = setTimeout(timeoutLoop,0);
}

function timeoutLoop()
{
    var fun = timeouts.splice(0,1);
    if (fun.length > 0)
    {
        (fun[0])();
        tout = setTimeout(timeoutLoop,0);
    }
    else
    {
        tout = null;
    }
}