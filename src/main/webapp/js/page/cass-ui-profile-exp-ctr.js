//**************************************************************************************************
// CASS UI Profile Explorer Functions
//**************************************************************************************************

//**************************************************************************************************
// Constants

const PRF_EXP_IFRAME = "#prfExpIFrame";
const PRF_EXP_IFRAME_SOURCE = "cass-profile/index.html?user=wait&origin=";
const PRF_EXP_IFRAME_SOURCE_PRF_PEM_PARAM = "&profilePem=";

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
    var lson = copySessionStateToLocalStorage();
	//location.assign(CASSUI_FWK_EXP_PAGE);
    window.open(CASSUI_FWK_EXP_PAGE + "?" + CASS_CONT_PARAM_NAME + "=" + lson);
}

function sendIdentityInitializeMessage() {
	$(PRF_EXP_IFRAME)[0].contentWindow.postMessage(JSON.stringify({
		action: INIT_IDENTITY_ACTION,
		serverParm: selectedServer,
		nameParm: loggedInIdentityName,
		pemParm: loggedInPpkPem
	}), window.location.origin);
}

function getProfileExplorerIframeSourceLink() {
    var prfPem = retrieveProfileToExploreInfo();
    var ifs = PRF_EXP_IFRAME_SOURCE + window.location.origin;
    if (prfPem && prfPem != "") ifs += PRF_EXP_IFRAME_SOURCE_PRF_PEM_PARAM + prfPem;
    debugMessage("Opening profile explorer iFrame with: " + ifs);
    return ifs;
}

$(PRF_EXP_IFRAME).ready(function () {
	$(window).on("message", function (event) {
		if (event.originalEvent.data.message == WAITING_MESSAGE) {
			sendIdentityInitializeMessage();
		}
		else if (event.originalEvent.data.message == INIT_FWK_EXP_MESSAGE) {
			handleInitFrameworkExplorerMessage(event.originalEvent.data.frameworkId);
		}
	});
});

$(PRF_EXP_IFRAME).attr("src", getProfileExplorerIframeSourceLink());

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
