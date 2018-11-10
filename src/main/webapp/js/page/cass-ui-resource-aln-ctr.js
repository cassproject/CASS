//**************************************************************************************************
// CASS UI Resource Alignment Functions
//**************************************************************************************************

//**************************************************************************************************
// Constants

const RES_ALN_IFRAME = "#resAlnIFrame";
const COMP_ALN_IFRAME_SOURCE = "cass-align/index.html?user=wait&origin=";

const WAITING_MESSAGE = "waiting";
const INIT_ALIGN_MESSAGE = "initAlign";
const INIT_FWK_EXP_MESSAGE = "initFrameworkExplorer";

const INIT_IDENTITY_ACTION = "initIdentity";
const SET_FWK_ALIGN_PARMS_ACTION = "setFwkAlignParams";

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

function handleInitAlignmentMessage() {
	var alignInfo = retrieveAlignmentInfo();
	if (alignInfo.alignType == FWK_TO_FWK_ALIGN_TYPE) {
		$(RES_ALN_IFRAME)[0].contentWindow.postMessage(JSON.stringify({
			action: SET_FWK_ALIGN_PARMS_ACTION,
			fw1Id: alignInfo.fw1Id,
			fw2Id: alignInfo.fw2Id
		}), window.location.origin);
	} else {
		debugMessage("!!! handleInitAlignmentMessage UNKNOWN ALIGNMENT TYPE: " + alignInfo.alignType);
	}
}

function sendIdentityInitializeMessage() {
	$(RES_ALN_IFRAME)[0].contentWindow.postMessage(JSON.stringify({
		action: INIT_IDENTITY_ACTION,
		serverParm: selectedServer,
		nameParm: loggedInIdentityName,
		pemParm: loggedInPpkPem
	}), window.location.origin);
}

$(RES_ALN_IFRAME).ready(function () {
	$(window).on("message", function (event) {
		if (event.originalEvent.data.message == WAITING_MESSAGE) {
			sendIdentityInitializeMessage();
		} else if (event.originalEvent.data.message == INIT_ALIGN_MESSAGE) {
			handleInitAlignmentMessage();
		} else if (event.originalEvent.data.message == INIT_FWK_EXP_MESSAGE) {
			handleInitFrameworkExplorerMessage(event.originalEvent.data.frameworkId);
		}
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
