//**************************************************************************************************
// CASS UI Gap Analysis Functions
//**************************************************************************************************

//**************************************************************************************************
// Constants

const GAP_ANL_IFRAME = "#gapAnalysisIFrame";
const GAP_ANL_IFRAME_SOURCE = "cass-gap-analysis/index.html?user=wait&origin=";

const WAITING_MESSAGE = "waiting";
const INIT_PRF_EXP_MESSAGE = "initProfileExplorer";

const INIT_IDENTITY_ACTION = "initIdentity";

const CASSUI_PRF_EXP_PAGE = "cass-ui-profile-exp-ctr.html";

//**************************************************************************************************
// Variables

function handleInitProfileExplorerMessage(profilePem) {
	debugMessage("handleInitProfileExplorerMessage storing profile pem: " + profilePem);
	storeProfileToExploreInfo(profilePem);
    var lson = copySessionStateToLocalStorage();
	//location.assign(CASSUI_PRF_EXP_PAGE);
    window.open(CASSUI_PRF_EXP_PAGE + "?" + CASS_CONT_PARAM_NAME + "=" + lson);
}

function sendIdentityInitializeMessage() {
	$(GAP_ANL_IFRAME)[0].contentWindow.postMessage(JSON.stringify({
		action: INIT_IDENTITY_ACTION,
		serverParm: selectedServer,
		nameParm: loggedInIdentityName,
		pemParm: loggedInPpkPem
	}), window.location.origin);
}

$(GAP_ANL_IFRAME).ready(function () {
	$(window).on("message", function (event) {
		if (event.originalEvent.data.message == WAITING_MESSAGE) {
			sendIdentityInitializeMessage();
		}
		else if (event.originalEvent.data.message == INIT_PRF_EXP_MESSAGE) {
			handleInitProfileExplorerMessage(event.originalEvent.data.profilePem);
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
