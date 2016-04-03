
var selectedFramework = null;

function selectFramework(me) {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    selectedFramework = frameworkId;
    EcRepository.get(frameworkId, function (framework) {
        $("#selectedFramework").text("Framework (" + framework.name + ")");
        $('#selectFramework').foundation('close');
    }, error);
}
