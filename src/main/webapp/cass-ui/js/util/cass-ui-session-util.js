//**************************************************************************************************
// CASS UI Session Utilities
//**************************************************************************************************
//TODO loadCassUiSessionState check for invalid session state
//TODO loadCassUiSessionState build contact maps???

//**************************************************************************************************
// Constants
const SES_STR_SELSERVER_KEY = "sessionCassUiSelServer";
const SES_STR_IDNAME_KEY = "sessionCassUiIdName";
const SES_STR_PPKPEM_KEY = "sessionCassUiPpkPEM";

const CASSUI_AFTER_LOGOUT_PAGE = "cass-ui-login.html";

//**************************************************************************************************
// Variables

var repo;
var selectedServer;
var loggedInIdentityName;
var loggedInPkPem;
var loggedInPpkPem;

//TODO build these???
var contactsByNameMap;
var contactsByPkPemMap = {};
var contactDisplayList;

//**************************************************************************************************
// Repository Intialization
//**************************************************************************************************
function initRepo() {
    debugMessage("Initializing repository...");
    repo = new EcRepository();
    repo.selectedServer = selectedServer;
    debugMessage("Repository initialized.");
}

//**************************************************************************************************
// Identity Intialization
//**************************************************************************************************
function initSessionIdentity() {
    debugMessage("Initializing identity...");
    var eci = new EcIdentity();
    eci.source = selectedServer;
    eci.displayName = loggedInIdentityName;
    var eciPpk = EcPpk.fromPem(loggedInPpkPem);
    eci.ppk = eciPpk;
    EcIdentityManager.ids.push(eci);
    loggedInPkPem = EcIdentityManager.ids[0].ppk.toPk().toPem();
    debugMessage("Identity intialized:");
    debugMessage("Display Name: " + EcIdentityManager.ids[0].displayName);
    debugMessage("Public Key: " + loggedInPkPem);
}

//**************************************************************************************************
// Session Storage Management
//**************************************************************************************************

function saveCassUiSessionState() {
    debugMessage("Saving session state...");
    sessionStorage.clear();
    sessionStorage.setItem(SES_STR_SELSERVER_KEY,selectedServer);
    sessionStorage.setItem(SES_STR_IDNAME_KEY,loggedInIdentityName);
    sessionStorage.setItem(SES_STR_PPKPEM_KEY,loggedInPpkPem);
    debugMessage("Session state saved.");
}

//TODO loadCassUiSessionState check for invalid session state
//TODO loadCassUiSessionState build contact maps???
function loadCassUiSessionState() {
    debugMessage("Loading session state...");
    selectedServer = sessionStorage.getItem(SES_STR_SELSERVER_KEY);
    initRepo();
    loggedInIdentityName  = sessionStorage.getItem(SES_STR_IDNAME_KEY);
    loggedInPpkPem = sessionStorage.getItem(SES_STR_PPKPEM_KEY);
    initSessionIdentity();
    debugMessage("Session state loaded.");
}

//**************************************************************************************************
// Logout
//**************************************************************************************************

function logoutCassUi() {
    repo = null;
    selectedServer = null;
    loggedInIdentityName = null;
    loggedInPkPem = null;
    loggedInPpkPem = null;
    if (EcIdentityManager) {
        EcIdentityManager.clearContacts();
        EcIdentityManager.clearIdentities();
    }
    sessionStorage.clear();
    location.replace(CASSUI_AFTER_LOGOUT_PAGE);
}