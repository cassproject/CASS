//**************************************************************************************************
// CASS UI Framework Explorer Functions
//**************************************************************************************************

//**************************************************************************************************
// Constants

const VLRC_EXP_IFRAME = "#vlrcExpIFrame";
const VLRC_EXP_IFRAME_SOURCE = "cass-vlrc/index.html?user=wait&origin=";
const VLRC_EXP_IFRAME_SOURCE_VLRC_ID_PARAM = "?frameworkId=";

const WAITING_MESSAGE = "waiting";
const ALIGN_MESSAGE = "gotoAlign";

const INIT_IDENTITY_ACTION = "initIdentity";

//**************************************************************************************************
// Variables

//**************************************************************************************************
// Page Functions
//**************************************************************************************************

function getVLRCIframeSourceLink() {
	var frameworkId = retrieveFrameworkToExploreInfo();
	var ifs = VLRC_EXP_IFRAME_SOURCE + window.location.origin;
	if (frameworkId && frameworkId != "") ifs += VLRC_EXP_IFRAME_SOURCE_VLRC_ID_PARAM + frameworkId;
	debugMessage("Opening VLRC iFrame with: " + ifs);
	return ifs;
}

function sendIdentityInitializeMessage() {
	$(VLRC_EXP_IFRAME)[0].contentWindow.postMessage(JSON.stringify({
		action: INIT_IDENTITY_ACTION,
		serverParm: selectedServer,
		nameParm: loggedInIdentityName,
		pemParm: loggedInPpkPem
	}), window.location.origin);
}

$(VLRC_EXP_IFRAME).ready(function () {
	$(window).on("message", function (event) {
		if (event.originalEvent.data.message == WAITING_MESSAGE) {
			sendIdentityInitializeMessage();
		}
	});
});

$(VLRC_EXP_IFRAME).attr("src", getVLRCIframeSourceLink());

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
