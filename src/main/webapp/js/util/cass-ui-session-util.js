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
const PRF_TO_EXP_KEY = "profileToExplore";

const CASSUI_AFTER_LOGOUT_PAGE = "index.html";
const CASSUI_SES_EXP_QSP = "sessionExpired";

const CASS_CONT_PARAM_NAME = "cassCont";
const LCL_STR_PREFIX = "CASS_CONT_";

//**************************************************************************************************
// Variables

var repo;
var selectedServer;
var loggedInIdentityName;
var loggedInPkPem;
var loggedInPpkPem;

queryParams = function () {
    if (window.document.location.search == null)
        return {};
    var hashSplit = (window.document.location.search.split("?"));
    if (hashSplit.length > 1) {
        var o = {};
        var paramString = hashSplit[1];
        var parts = (paramString).split("&");
        for (var i = 0; i < parts.length; i++)
            o[parts[i].split("=")[0]] = decodeURIComponent(parts[i].replace(parts[i].split("=")[0] + "=", ""));
        return o;
    }
    return {};
};
queryParams = queryParams();

//**************************************************************************************************
// Page to Page Transfer - Misc Info (Goes in local storage since new page will be opened up in new tab)
//**************************************************************************************************
function storeProfileToExploreInfo(profilePem) {
    debugMessage("Saving profile to explore info...");
    localStorage.setItem(PRF_TO_EXP_KEY, profilePem);
    updateCassUiLastSessionLoadTime();
    debugMessage("Profile to explore info saved.");
}

function retrieveProfileToExploreInfo() {
    updateCassUiLastSessionLoadTime();
    if (queryParams.profilePem != null) var prfPem = queryParams.profilePem;
    else var prfPem = localStorage.getItem(PRF_TO_EXP_KEY);
    if (prfPem && prfPem != "") {
        localStorage.removeItem(PRF_TO_EXP_KEY);
        return prfPem;
    }
    else return null;
}

function storeFrameworkToExploreInfo(frameworkId) {
	debugMessage("Saving framework to explore info...");
    localStorage.setItem(FWK_TO_EXP_KEY, frameworkId);
	updateCassUiLastSessionLoadTime();
	debugMessage("Framework to explore info saved.");
}

function retrieveFrameworkToExploreInfo() {
	updateCassUiLastSessionLoadTime();
	if (queryParams.frameworkId != null) var fwkId = queryParams.frameworkId;
	else var fwkId = localStorage.getItem(FWK_TO_EXP_KEY);
	if (fwkId && fwkId != "") {
        localStorage.removeItem(FWK_TO_EXP_KEY);
		return fwkId;
	}
	else return null;
}

function storeFrameworkToFrameworkAlignmentInfo(alignType, fw1Id, fw2Id) {
	debugMessage("Saving framework to framework info...");
    localStorage.setItem(ALIGN_TYPE_KEY, alignType);
    localStorage.setItem(FTF_ALN_FW1ID_KEY, fw1Id);
    localStorage.setItem(FTF_ALN_FW2ID_KEY, fw2Id);
	updateCassUiLastSessionLoadTime();
	debugMessage("Framework to framework info saved.");
}

function retrieveAlignmentInfo() {
	var alignType = localStorage.getItem(ALIGN_TYPE_KEY);
	if (!alignType) return null;
	var rai = {};
	rai.alignType = alignType;
	if (alignType == FWK_TO_FWK_ALIGN_TYPE) {
		rai.fw1Id = localStorage.getItem(FTF_ALN_FW1ID_KEY);
		rai.fw2Id = localStorage.getItem(FTF_ALN_FW2ID_KEY);
        localStorage.removeItem(FTF_ALN_FW1ID_KEY);
        localStorage.removeItem(FTF_ALN_FW2ID_KEY);
	}
    localStorage.removeItem(ALIGN_TYPE_KEY);
	return rai;
}

//**************************************************************************************************
// Repository Intialization
//**************************************************************************************************
function initRepo() {
	if (repo != null)
		return;
	debugMessage("Initializing repository...");
	repo = new EcRepository();
	if (selectedServer == "autoDetect") {
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
	var eciPpk = EcPpk.fromPem(loggedInPpkPem);
    eci.ppk = eciPpk;
    EcIdentityManager.ids.push(eci);
	var person = EcPerson.getByPkBlocking(repo,eciPpk.toPk());
	if (person != null)
		if (person.name != null)
			loggedInIdentityName = person.getName();
    eci.displayName = loggedInIdentityName;
	loggedInPkPem = EcIdentityManager.ids[0].ppk.toPk().toPem();
	debugMessage("Identity initialized:");
	debugMessage("Display Name: " + EcIdentityManager.ids[0].displayName);
	debugMessage("Public Key: " + loggedInPkPem);
}

//**************************************************************************************************
// Session Storage Management
//**************************************************************************************************

function updateCassUiLastSessionLoadTime() {
	sessionStorage.setItem(SES_STR_LAST_SESSION_LOAD_KEY, Date.now());
}

function saveCassUiSessionState() {
	debugMessage("Saving session state...");
	sessionStorage.setItem(SES_STR_SELSERVER_KEY, selectedServer);
	sessionStorage.setItem(SES_STR_IDNAME_KEY, loggedInIdentityName);
	sessionStorage.setItem(SES_STR_PPKPEM_KEY, loggedInPpkPem);
	updateCassUiLastSessionLoadTime();
	debugMessage("Session state saved.");
}

function copySessionStateToLocalStorage() {
    var localStorageObjectName = LCL_STR_PREFIX + Date.now();
    var sso = {};
    sso[SES_STR_SELSERVER_KEY] =  selectedServer;
    sso[SES_STR_IDNAME_KEY] =  loggedInIdentityName;
    sso[SES_STR_PPKPEM_KEY] =  loggedInPpkPem;
    sso[SES_STR_LAST_SESSION_LOAD_KEY] = Date.now();
    localStorage.setItem(localStorageObjectName,JSON.stringify(sso));
    return localStorageObjectName;
}

function isCassUiSessionTimedOut() {
	var lslt = sessionStorage.getItem(SES_STR_LAST_SESSION_LOAD_KEY);
	if (!lslt || lslt.trim() == "" || (lslt + CASSUI_SESSION_TIMEOUT_MS >= Date.now())) return false;
	else return true;
}

function isCassUiSessionStateValid() {
	if (sessionStorage.getItem(SES_STR_SELSERVER_KEY) == null) return false;
	else if (sessionStorage.getItem(SES_STR_IDNAME_KEY) == null) return false;
	else if (sessionStorage.getItem(SES_STR_PPKPEM_KEY) == null) return false;
	else return !isCassUiSessionTimedOut();
}

function loadCassUiSessionStateFromSessionStorage() {
    if (isCassUiSessionStateValid()) {
        debugMessage("Loading session state...");
        selectedServer = sessionStorage.getItem(SES_STR_SELSERVER_KEY);
        initRepo();
        loggedInIdentityName = sessionStorage.getItem(SES_STR_IDNAME_KEY);
        loggedInPpkPem = sessionStorage.getItem(SES_STR_PPKPEM_KEY);
        initSessionIdentity();
        updateCassUiLastSessionLoadTime();
        debugMessage("Session state loaded.");
    }
    else {
        debugMessage("Session state is invalid");
        goToCassUISessionExpired();
    }
}

function setCassSessionStateFromLocalStorage(cassContId) {
    try {
		var sso = JSON.parse(localStorage.getItem(cassContId));
        sessionStorage.setItem(SES_STR_SELSERVER_KEY,sso[SES_STR_SELSERVER_KEY]);
        sessionStorage.setItem(SES_STR_IDNAME_KEY,sso[SES_STR_IDNAME_KEY]);
        sessionStorage.setItem(SES_STR_PPKPEM_KEY,sso[SES_STR_PPKPEM_KEY]);
        sessionStorage.setItem(SES_STR_LAST_SESSION_LOAD_KEY,sso[SES_STR_LAST_SESSION_LOAD_KEY]);

	}
	catch(e) {
        debugMessage("Could not find CASS continue state in local storage: " + cassContId);
	}
    localStorage.removeItem(cassContId);
}

function loadCassUiSessionStateFromLocalStorage(cassContId) {
    debugMessage("Loading session state from local storage...");
	setCassSessionStateFromLocalStorage(cassContId);
    loadCassUiSessionStateFromSessionStorage();
}

function loadCassUiSessionState() {
	var cassContId = queryParams[CASS_CONT_PARAM_NAME];
	if (cassContId && cassContId.trim() != "") loadCassUiSessionStateFromLocalStorage(cassContId);
	else loadCassUiSessionStateFromSessionStorage();
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
	location.assign(CASSUI_AFTER_LOGOUT_PAGE + "?" + CASSUI_SES_EXP_QSP + "=true");
}

//**************************************************************************************************
// Logout
//**************************************************************************************************

function logoutCassUi() {
	clearCassUiSession();
	location.assign(CASSUI_AFTER_LOGOUT_PAGE);
}
