//**************************************************************************************************
// CASS UI Framework Explorer Functions
//**************************************************************************************************

//**************************************************************************************************
// Constants

const FWK_EXP_IFRAME = "#fwkExpIFrame";
const FWK_EXP_IFRAME_SOURCE = "../cass-viewer/index.html?user=wait&origin=";
const FWK_EXP_IFRAME_SOURCE_FWK_ID_PARAM = "&frameworkId=";

const WAITING_MESSAGE = "waiting";
const ALIGN_MESSAGE = "gotoAlign";

const INIT_IDENTITY_ACTION = "initIdentity";

const CASSUI_RES_ALN_PAGE = "cass-ui-resource-aln-ctr.html";

//**************************************************************************************************
// Variables

//**************************************************************************************************
// Page Functions
//**************************************************************************************************

function handleAlignmentMessage(messageData) {
    debugMessage("Received: " + JSON.stringify(messageData));
    var alignType = messageData.alignType;
    if (alignType == FWK_TO_FWK_ALIGN_TYPE) {
        debugMessage("Handling framework to framework alignment");
        storeFrameworkToFrameworkAlignmentInfo(alignType,messageData.framework1Id,messageData.framework2Id);
        location.replace(CASSUI_RES_ALN_PAGE);
    }
    else {
        debugMessage("UNKNOWN ALIGNMENT TYPE REQUEST: " + alignType);
    }
}

function sendIdentityInitializeMessage() {
    $(FWK_EXP_IFRAME)[0].contentWindow.postMessage(JSON.stringify({
        action: INIT_IDENTITY_ACTION,
        serverParm: selectedServer,
        nameParm: loggedInIdentityName,
        pemParm: loggedInPpkPem
    }), window.location.origin);
}

function getFrameworkExplorerIframeSourceLink() {
    var frameworkId = retrieveFrameworkToExploreInfo();
    var ifs = FWK_EXP_IFRAME_SOURCE + window.location.origin;
    if (frameworkId && frameworkId != "") ifs += FWK_EXP_IFRAME_SOURCE_FWK_ID_PARAM + frameworkId;
    debugMessage("Opening framework explorer iFrame with: " + ifs);
    return ifs;
}

$(FWK_EXP_IFRAME).ready(function() {
    $(window).on("message", function(event) {
        if (event.originalEvent.data.message == WAITING_MESSAGE) {
            sendIdentityInitializeMessage();
        }
        else if (event.originalEvent.data.message == ALIGN_MESSAGE) {
            handleAlignmentMessage(event.originalEvent.data);
        }
    });
});

$(FWK_EXP_IFRAME).attr("src", getFrameworkExplorerIframeSourceLink());

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
