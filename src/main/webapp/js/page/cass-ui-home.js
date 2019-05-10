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
const CASSUI_CONCEPT_EDITOR_PAGE = "cass-ui-concept-editor-ctr.html";

//**************************************************************************************************
// Variables

//**************************************************************************************************
// Page Functions
//**************************************************************************************************

function goToFrameworkExplorer() {
    location.assign(CASSUI_FWK_EXP_PAGE);
}

function goToProfileExplorer() {
    location.assign(CASSUI_PRF_EXP_PAGE);
}

function goToGapAnalysis() {
    location.assign(CASSUI_GAP_ANL_PAGE);
}

function goToVLRC() {
    location.assign(CASSUI_VLRC_PAGE);
}

function goToEditor() {
    location.assign(CASSUI_EDITOR_PAGE);
}

function goToConceptEditor() {
    location.assign(CASSUI_CONCEPT_EDITOR_PAGE);
}

function goToDocs() {
    location.assign("https://docs.cassproject.org");
}

function goToDevdocs() {
    location.assign("https://devs.cassproject.org");
}

function init() {
    setUpBokehEffect();
    loadCassUiSessionState();
    setCassUiMainMenuUserName();
}

function setUpBokehEffect() {
    var bokehContainer = $('#bokehEffect');
    var $newSpan;
    bokehContainer.hide();
    for (var i = 0; i < 20; i++) {
        $newSpan = $('<span></span>');
        bokehContainer.append($newSpan);
    }
    bokehContainer.fadeIn(2000);
}

//**************************************************************************************************
// Document on ready
//**************************************************************************************************

$(document).ready(function () {
    init();
});
