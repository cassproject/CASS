//**************************************************************************************************
// CASS UI Home Page Functions
//**************************************************************************************************

//**************************************************************************************************
// Constants

const CASSUI_FWK_EXP_PAGE = "cass-ui-framework-exp-ctr.html";
const CASSUI_PRF_EXP_PAGE = "cass-ui-profile-exp-ctr.html";
const CASSUI_GAP_ANL_PAGE = "cass-ui-gap-analysis-ctr.html";
const CASSUI_VLRC_PAGE = "cass-ui-vlrc-exp-ctr.html";
const CASSUI_EDITOR_PAGE = "cass-ui-editor-ctr.html";

//**************************************************************************************************
// Variables

//**************************************************************************************************
// Page Functions
//**************************************************************************************************

function goToFrameworkExplorer() {
	location.replace(CASSUI_FWK_EXP_PAGE);
}

function goToProfileExplorer() {
	location.replace(CASSUI_PRF_EXP_PAGE);
}

function goToGapAnalysis() {
	location.replace(CASSUI_GAP_ANL_PAGE);
}

function goToVLRC() {
	location.replace(CASSUI_VLRC_PAGE);
}

function goToEditor() {
	location.replace(CASSUI_EDITOR_PAGE);
}

function goToDocs() {
	location.replace("https://docs.cassproject.org");
}

function goToDevdocs() {
	location.replace("https://devs.cassproject.org");
}

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
