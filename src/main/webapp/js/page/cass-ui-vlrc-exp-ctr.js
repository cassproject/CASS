//**************************************************************************************************
// CASS UI Framework Explorer Functions
//**************************************************************************************************

//**************************************************************************************************
// Constants

const VLRC_EXP_IFRAME = "#vlrcExpIFrame";
const VLRC_EXP_IFRAME_SOURCE = "cass-vlrc/index.html?user=wait&css=../css/cass-ui-editor.css&origin=";
const VLRC_EXP_IFRAME_SOURCE_VLRC_ID_PARAM = "?frameworkId=";

const WAITING_MESSAGE = "waiting";
const ALIGN_MESSAGE = "gotoAlign";
const CONTACT_UPDATED_MESSAGE = "contactsUpdated";

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

function sendContactInitializeMessage() {
    var ary = [];
    for (var i = 0; i < EcIdentityManager.contacts.length; i++)
        ary.push({
            pk: EcIdentityManager.contacts[i].pk.toPem(),
            displayName: EcIdentityManager.contacts[i].displayName
        });
    $(VLRC_EXP_IFRAME)[0].contentWindow.postMessage(JSON.stringify({
        action: CONTACT_UPDATED_MESSAGE,
        contacts: ary
    }), window.location.origin);
}

$(VLRC_EXP_IFRAME).ready(function () {
    $(window).on("message", function (event) {
        if (event.originalEvent.data.message == WAITING_MESSAGE) {
            sendIdentityInitializeMessage();
            sendContactInitializeMessage();
        }
        else if (event.originalEvent.data.message == CONTACT_UPDATED_MESSAGE) {
            EcIdentityManager.contacts = [];
            for (var i = 0; i < event.originalEvent.data.contacts.length; i++) {
                var c = new EcContact();
                c.pk = EcPk.fromPem(event.originalEvent.data.contacts[i].pk);
                c.displayName = event.originalEvent.data.contacts[i].displayName;
                EcIdentityManager.contacts.push(c);
            }
            ecIdentMgr.commit(function () {
                sessionStorage.setItem("usernameWithSalt", ecIdentMgr.usernameWithSalt);
                sessionStorage.setItem("passwordWithSalt", ecIdentMgr.passwordWithSalt);
                sessionStorage.setItem("secretWithSalt", ecIdentMgr.secretWithSalt);
                sessionStorage.setItem("pad", ecIdentMgr.pad);
                sessionStorage.setItem("token", ecIdentMgr.token);
            }, console.error);
        }
    });
});

$(VLRC_EXP_IFRAME).attr("src", getVLRCIframeSourceLink());

var ecIdentMgr = new EcRemoteIdentityManager();
function init() {
    loadCassUiSessionState();
    setCassUiMainMenuUserName();
    ecIdentMgr.server = repo.selectedServer;
    ecIdentMgr.usernameWithSalt = sessionStorage.getItem("usernameWithSalt");
    ecIdentMgr.passwordWithSalt = sessionStorage.getItem("passwordWithSalt");
    ecIdentMgr.secretWithSalt = sessionStorage.getItem("secretWithSalt");
    ecIdentMgr.pad = sessionStorage.getItem("pad");
    ecIdentMgr.token = sessionStorage.getItem("token");
    ecIdentMgr.configureFromServer(function () {
        ecIdentMgr.fetch(function () {
        }, console.error);
    }, console.error);
}

//**************************************************************************************************
// Document on ready
//**************************************************************************************************

$(document).ready(function () {
    init();
});
