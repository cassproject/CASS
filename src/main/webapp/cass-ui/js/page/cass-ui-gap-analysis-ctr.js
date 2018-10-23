//**************************************************************************************************
// CASS UI Gap Analysis Functions
//**************************************************************************************************

//**************************************************************************************************
// Constants

const GAP_ANL_IFRAME = "#gapAnalysisIFrame";
const GAP_ANL_IFRAME_SOURCE = "../cass-gap-analysis/index.html?user=wait&origin=";

const WAITING_MESSAGE = "waiting";

const INIT_IDENTITY_ACTION = "initIdentity";

//**************************************************************************************************
// Variables

function handleInitFrameworkExplorerMessage(frameworkId) {
    debugMessage("handleInitFrameworkExplorerMessage storing framework id: " + frameworkId);
    storeFrameworkToExploreInfo(frameworkId);
    location.replace(CASSUI_FWK_EXP_PAGE);
}

function sendIdentityInitializeMessage() {
    $(GAP_ANL_IFRAME)[0].contentWindow.postMessage(JSON.stringify({
        action: INIT_IDENTITY_ACTION,
        serverParm: selectedServer,
        nameParm: loggedInIdentityName,
        pemParm: loggedInPpkPem
    }), window.location.origin);
}

$(GAP_ANL_IFRAME).ready(function() {
    $(window).on("message", function(event) {
        if (event.originalEvent.data.message == WAITING_MESSAGE) {
            sendIdentityInitializeMessage();
        }
        else if (event.originalEvent.data.message == INIT_FWK_EXP_MESSAGE) {
            handleInitFrameworkExplorerMessage(event.originalEvent.data.frameworkId);
        }
    });
});

$(GAP_ANL_IFRAME).attr("src", GAP_ANL_IFRAME_SOURCE + window.location.origin);

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
