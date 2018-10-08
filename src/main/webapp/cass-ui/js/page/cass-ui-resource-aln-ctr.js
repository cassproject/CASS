//**************************************************************************************************
// CASS UI Resource Alignment Functions
//**************************************************************************************************

//**************************************************************************************************
// Constants

const RES_ALN_IFRAME = "#resAlnIFrame";
const COMP_ALN_IFRAME_SOURCE = "../cass-align/cass-ui-framework-aln.html?user=wait&origin=";

//**************************************************************************************************
// Variables

//**************************************************************************************************
// Page Functions
//**************************************************************************************************

function sendIdentityInitializeMessage() {
    debugMessage("cass-ui-resource-aln-ctr.js -> sendIdentityInitializeMessage");
    $("iframe")[0].contentWindow.postMessage(JSON.stringify({
        action: "initIdentity",
        serverParm: selectedServer,
        nameParm: loggedInIdentityName,
        pemParm: loggedInPpkPem
    }), window.location.origin);
}

$(RES_ALN_IFRAME).ready(function() {
    $(window).on("message", function(event) {
        if (event.originalEvent.data.message == "waiting") {
            sendIdentityInitializeMessage();
        }
        // else if (event.originalEvent.data.message == ALIGN_MESSAGE) {
        //     handleAlignmentMessage(event.originalEvent.data);
        // }
    });
});

$(RES_ALN_IFRAME).attr("src", COMP_ALN_IFRAME_SOURCE + window.location.origin);

function init() {
    loadCassUiSessionState();
    setCassUiMainMenuUserName();
}

//**************************************************************************************************
// Document on ready
//**************************************************************************************************

$(document).ready(function () {
    init();
});
