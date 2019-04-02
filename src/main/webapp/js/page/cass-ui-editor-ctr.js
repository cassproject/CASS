//**************************************************************************************************
// CASS UI Profile Explorer Functions
//**************************************************************************************************

//**************************************************************************************************
// Constants

const ADD_CEASN_DATA_FIELDS = false;
const CEASN_FIELD_TOGGLE = "ceasnDataFields=true";

const PRF_EXP_IFRAME = "#prfExpIFrame";
const PRF_EXP_IFRAME_SOURCE = "cass-editor/index.html?tlaProfile=true&user=wait&editIframe=true";

const WAITING_MESSAGE = "waiting";
const INIT_FWK_EXP_MESSAGE = "initFrameworkExplorer";

const INIT_IDENTITY_ACTION = "identity";

const CASSUI_FWK_EXP_PAGE = "cass-ui-editor-ctr.html";

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
		identity: loggedInPpkPem
	}), window.location.origin);
}

$(PRF_EXP_IFRAME).ready(function () {
	$(window).on("message", function (event) {
		if (event.originalEvent.data.message == WAITING_MESSAGE) {
			sendIdentityInitializeMessage();
		} else if (event.originalEvent.data.message == INIT_FWK_EXP_MESSAGE) {
			handleInitFrameworkExplorerMessage(event.originalEvent.data.frameworkId);
		}
	});
});

function getEditorIframeSourceLink() {
	var ifs = PRF_EXP_IFRAME_SOURCE;
	if (ADD_CEASN_DATA_FIELDS) ifs += "&" + CEASN_FIELD_TOGGLE;
	ifs += "&origin="+ window.location.origin + "&server=" + selectedServer;
	debugMessage("Opening cass editor iFrame with: " + ifs);
	return ifs;
}

function init() {
	loadCassUiSessionState();
	$(PRF_EXP_IFRAME).attr("src", getEditorIframeSourceLink());
	setCassUiMainMenuUserName();
}

//**************************************************************************************************
// Document on ready
//**************************************************************************************************

$(document).ready(function () {
	init();
});
