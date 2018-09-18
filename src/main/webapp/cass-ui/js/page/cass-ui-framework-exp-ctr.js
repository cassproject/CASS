//**************************************************************************************************
// CASS UI Framework Explorer Functions
//**************************************************************************************************

//**************************************************************************************************
// Constants

const FWK_EXP_IFRAME = "#fwkExpIFrame";
const  FWK_EXP_IFRAME_SOURCE = "../cass-viewer/cass-ui-framework-exp.html?user=wait&origin=";

//**************************************************************************************************
// Variables

//**************************************************************************************************
// Page Functions
//**************************************************************************************************

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
        };
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
