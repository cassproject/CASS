//**************************************************************************************************
// CASS UI Home Page Functions
//**************************************************************************************************

//**************************************************************************************************
// Constants

//**************************************************************************************************
// Variables

var assertionList;

//**************************************************************************************************
// TEST TEMPORARY FUNCTIONS
//TODO GET RID OF THESE!!!!
//**************************************************************************************************
function getAssertionSearchQueryForProfileUser() {
    var searchQuery = "(\\*@reader:\"" + loggedInPkPem + "\")";
    debugMessage("Assertion search query: " + searchQuery);
    return searchQuery;
}

function handleGetAssertionsSuccess(arrayOfEcAssertions) {
    debugMessage("handleGetAssertionsSuccess: " + arrayOfEcAssertions.length);
    assertionList = arrayOfEcAssertions;
}

function handleGetAssertionsFailure(failMsg) {
    debugMessage("handleGetAssertionsFailure: " + failMsg);
}

function fetchAssertions() {
    assertionList = [];
    EcAssertion.search(repo, getAssertionSearchQueryForProfileUser(), handleGetAssertionsSuccess, handleGetAssertionsFailure, null);
}


//**************************************************************************************************
// Page Functions
//**************************************************************************************************

//TODO make sure user has logged in

function init() {
    debugMessage("cass-ui-home.js: init");
    loadCassUiSessionState();
    fetchAssertions(); //TODO REMOVE THIS!!!
}

//**************************************************************************************************
// Document on ready
//**************************************************************************************************

$(document).ready(function () {
    init();
});
