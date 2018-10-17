//**************************************************************************************************
// CASS UI Session Utilities
//**************************************************************************************************
//TODO loadCassUiSessionState build contact maps???

//**************************************************************************************************
// Constants

const CASSUI_SESSION_TIMEOUT_MS = 1800000; //30 minutes

const SES_STR_SELSERVER_KEY = "sessionCassUiSelServer";
const SES_STR_IDNAME_KEY = "sessionCassUiIdName";
const SES_STR_PPKPEM_KEY = "sessionCassUiPpkPEM";
const SES_STR_LAST_SESSION_LOAD_KEY = "sessionCassUiLastSessionLoadTime";

const ALIGN_TYPE_KEY = "cassUiAlignType";
const FWK_TO_FWK_ALIGN_TYPE = "fwkToFwk";
const FTF_ALN_FW1ID_KEY = "cassUiFwkToFwkFw1Id";
const FTF_ALN_FW2ID_KEY = "cassUiFwkToFwkFw2Id";

const FWK_TO_EXP_KEY = "frameworkToExplore";

const CASSUI_AFTER_LOGOUT_PAGE = "cass-ui-login.html";
const CASSUI_SES_EXP_QSP = "sessionExpired";

//**************************************************************************************************
// Variables

var repo;
var selectedServer;
var loggedInIdentityName;
var loggedInPkPem;
var loggedInPpkPem;

// //TODO build these???
// var contactsByNameMap;
// var contactsByPkPemMap = {};
// var contactDisplayList;

//**************************************************************************************************
// Page to Page Transfer - Misc Info
//**************************************************************************************************
function storeFrameworkToExploreInfo(frameworkId) {
	debugMessage("Saving framework to explore info...");
	sessionStorage.setItem(FWK_TO_EXP_KEY, frameworkId);
	updateCassUiLastSessionLoadTime();
	debugMessage("Framework to explore info saved.");
}

function retrieveFrameworkToExploreInfo() {
	updateCassUiLastSessionLoadTime();
	var fwkId = sessionStorage.getItem(FWK_TO_EXP_KEY);
	if (fwkId && fwkId != "") {
		sessionStorage.setItem(FWK_TO_EXP_KEY, "");
		return fwkId;
	} else return null;
}

function storeFrameworkToFrameworkAlignmentInfo(alignType, fw1Id, fw2Id) {
	debugMessage("Saving framework to framework info...");
	sessionStorage.setItem(ALIGN_TYPE_KEY, alignType);
	sessionStorage.setItem(FTF_ALN_FW1ID_KEY, fw1Id);
	sessionStorage.setItem(FTF_ALN_FW2ID_KEY, fw2Id);
	updateCassUiLastSessionLoadTime();
	debugMessage("Framework to framework info saved.");
}

function retrieveAlignmentInfo() {
	var alignType = sessionStorage.getItem(ALIGN_TYPE_KEY);
	if (!alignType) return null;
	var rai = {};
	rai.alignType = alignType;
	if (alignType == FWK_TO_FWK_ALIGN_TYPE) {
		rai.fw1Id = sessionStorage.getItem(FTF_ALN_FW1ID_KEY);
		rai.fw2Id = sessionStorage.getItem(FTF_ALN_FW2ID_KEY);
	}
	return rai;
}

//**************************************************************************************************
// Repository Intialization
//**************************************************************************************************
function initRepo() {
	debugMessage("Initializing repository...");
	repo = new EcRepository();
	if (selectedServer = "autoDetect") {
		repo.autoDetectRepository();
		selectedServer = repo.selectedServer;
	} else {
		repo.selectedServer = selectedServer;
	}
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

function updateCassUiLastSessionLoadTime() {
	var d = new Date();
	sessionStorage.setItem(SES_STR_LAST_SESSION_LOAD_KEY, d.getTime());
}

function saveCassUiSessionState() {
	debugMessage("Saving session state...");
	sessionStorage.clear();
	sessionStorage.setItem(SES_STR_SELSERVER_KEY, selectedServer);
	sessionStorage.setItem(SES_STR_IDNAME_KEY, loggedInIdentityName);
	sessionStorage.setItem(SES_STR_PPKPEM_KEY, loggedInPpkPem);
	updateCassUiLastSessionLoadTime();
	debugMessage("Session state saved.");
}

function isCassUiSessionTimedOut() {
	var lslt = sessionStorage.getItem(SES_STR_LAST_SESSION_LOAD_KEY);
	var cd = new Date();
	if (lslt + CASSUI_SESSION_TIMEOUT_MS >= cd.getTime()) return false;
	else return true;
}

function isCassUiSessionStateValid() {
	if (sessionStorage.getItem(SES_STR_SELSERVER_KEY) == null) return false;
	else if (sessionStorage.getItem(SES_STR_IDNAME_KEY) == null) return false;
	else if (sessionStorage.getItem(SES_STR_PPKPEM_KEY) == null) return false;
	else return !isCassUiSessionTimedOut();
}

//TODO loadCassUiSessionState build contact maps???
function loadCassUiSessionState() {
	if (isCassUiSessionStateValid()) {
		debugMessage("Loading session state...");
		selectedServer = sessionStorage.getItem(SES_STR_SELSERVER_KEY);
		initRepo();
		loggedInIdentityName = sessionStorage.getItem(SES_STR_IDNAME_KEY);
		loggedInPpkPem = sessionStorage.getItem(SES_STR_PPKPEM_KEY);
		initSessionIdentity();
		updateCassUiLastSessionLoadTime();
		debugMessage("Session state loaded.");
	} else {
		debugMessage("Session state is invalid");
		goToCassUISessionExpired();
	}
}

function clearCassUiSession() {
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
}

function goToCassUISessionExpired() {
	clearCassUiSession();
	location.replace(CASSUI_AFTER_LOGOUT_PAGE + "?" + CASSUI_SES_EXP_QSP + "=true");
}

//**************************************************************************************************
// Logout
//**************************************************************************************************

function logoutCassUi() {
	clearCassUiSession();
	location.replace(CASSUI_AFTER_LOGOUT_PAGE);
}
