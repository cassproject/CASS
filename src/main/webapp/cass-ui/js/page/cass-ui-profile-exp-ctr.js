//**************************************************************************************************
// CASS UI Profile Explorer Functions
//**************************************************************************************************

//**************************************************************************************************
// Constants

const PRF_EXP_IFRAME = "#prfExpIFrame";
const PRF_EXP_IFRAME_SOURCE = "../cass-profile/index.html?user=wait&origin=";

const WAITING_MESSAGE = "waiting";
const INIT_FWK_EXP_MESSAGE = "initFrameworkExplorer";

const INIT_IDENTITY_ACTION = "initIdentity";

const CASSUI_FWK_EXP_PAGE = "cass-ui-framework-exp-ctr.html";

//**************************************************************************************************
// Variables

//**************************************************************************************************
// Page Functions
//**************************************************************************************************

function handleInitFrameworkExplorerMessage(frameworkId) {
    debugMessage("handleInitFrameworkExplorerMessage storing framework id: " + frameworkId);
    storeFrameworkToExploreInfo(frameworkId);
    location.replace(CASSUI_FWK_EXP_PAGE);
}

function sendIdentityInitializeMessage() {
    $(PRF_EXP_IFRAME)[0].contentWindow.postMessage(JSON.stringify({
        action: INIT_IDENTITY_ACTION,
        serverParm: selectedServer,
        nameParm: loggedInIdentityName,
        pemParm: loggedInPpkPem
    }), window.location.origin);
}

$(PRF_EXP_IFRAME).ready(function() {
    $(window).on("message", function(event) {
        if (event.originalEvent.data.message == WAITING_MESSAGE) {
            sendIdentityInitializeMessage();
        }
        else if (event.originalEvent.data.message == INIT_FWK_EXP_MESSAGE) {
            handleInitFrameworkExplorerMessage(event.originalEvent.data.frameworkId);
        }
    });
});

$(PRF_EXP_IFRAME).attr("src", PRF_EXP_IFRAME_SOURCE + window.location.origin);

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
