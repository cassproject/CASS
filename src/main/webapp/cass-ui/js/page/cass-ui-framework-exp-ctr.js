//**************************************************************************************************
// CASS UI Framework Explorer Functions
//**************************************************************************************************

//**************************************************************************************************
// Constants

const FWK_EXP_IFRAME = "#fwkExpIFrame";
const FWK_EXP_IFRAME_SOURCE = "../cass-viewer/cass-ui-framework-exp.html?user=wait&origin=";

const ALIGN_MESSAGE = "gotoAlign";

const CASSUI_RES_ALN_PAGE = "cass-ui-resource-aln-ctr.html";

//**************************************************************************************************
// Variables

//**************************************************************************************************
// Page Functions
//**************************************************************************************************

function handleAlignmentMessage(messageData) {
    debugMessage("Received: " + JSON.stringify(messageData));
    var alignType = data.alignType;
    if (alignType == FWK_TO_FWK_ALIGN_TYPE) {
        debugMessage("Handling framework to framework alignment");
        storeFrameworkToFrameworkAlignmentInfo(alignType,data.framework1Id,data.framework2Id);
        location.replace(CASSUI_RES_ALN_PAGE);
    }
    else {
        debugMessage("UNKNOWN ALIGNMENT TYPE REQUEST: " + alignType);
    }
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
        else if (event.originalEvent.data.message == ALIGN_MESSAGE) {
            handleAlignmentMessage(event.originalEvent.data);
        }
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
