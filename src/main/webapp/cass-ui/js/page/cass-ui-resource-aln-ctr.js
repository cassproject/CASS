//**************************************************************************************************
// CASS UI Resource Alignment Functions
//**************************************************************************************************

//**************************************************************************************************
// Constants

const RES_ALN_IFRAME = "#fwkExpIFrame";
const COMP_ALN_IFRAME_SOURCE = "../cass-align/cass-ui-framework-aln.html?user=wait&origin=";

const FWK_TO_FWK_ALIGN_TYPE = "fwkToFwk";

//**************************************************************************************************
// Variables

//**************************************************************************************************
// Page Functions
//**************************************************************************************************

function handleAlignmentMessage(messageData) {
    debugMessage("Received: " + JSON.stringify(messageData));
}

function sendIdentityInitializeMessage() {
    $("iframe")[0].contentWindow.postMessage(JSON.stringify({
        action: "initIdentity",
        serverParm: selectedServer,
        nameParm: loggedInIdentityName,
        pemParm: loggedInPpkPem
    }), window.location.origin);
}

$(FWK_EXP_IFRAME).ready(function() {
    $(window).on("message", function(event) {
        if (event.originalEvent.data.message == "waiting") {
            sendIdentityInitializeMessage();
        }
        // else if (event.originalEvent.data.message == ALIGN_MESSAGE) {
        //     handleAlignmentMessage(event.originalEvent.data);
        // }
    });
});
$(FWK_EXP_IFRAME).attr("src", FWK_EXP_IFRAME_SOURCE + window.location.origin);

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
