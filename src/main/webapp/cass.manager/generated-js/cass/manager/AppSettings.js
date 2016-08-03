var AppSettings = function() {};
AppSettings = stjs.extend(AppSettings, null, [], function(constructor, prototype) {
    constructor.FIELD_MSG_RETURN = "returnLoginMessage";
    constructor.FIELD_SERVER_URL = "defaultServerUrl";
    constructor.FIELD_SERVER_NAME = "defaultServerName";
    constructor.FIELD_SALT_USER = "userEncryptionSalt";
    constructor.FIELD_SALT_PASS = "passwordEncryptionSalt";
    constructor.FIELD_SALT_SECRET = "secretEncryptionSalt";
    constructor.FIELD_ITERATIONS_USER = "userEncryptionIterations";
    constructor.FIELD_ITERATIONS_PASS = "passwordEncryptionIterations";
    constructor.FIELD_ITERATIONS_SECRET = "secretEncryptionIterations";
    constructor.FIELD_LENGTH_USER = "userEncryptionLength";
    constructor.FIELD_LENGTH_PASS = "passwordEncryptionLength";
    constructor.returnLoginMessage = "For Your Security, You are Logged Out on Page Reload. Please Enter Your Credentials to Continue Logged In.";
    constructor.defaultServerUrl = "https://sandbox.service.cassproject.org/";
    constructor.defaultServerName = "CASS Sandbox";
    constructor.defaultServerUserSalt = "BasicUsernameSalt";
    constructor.defaultServerUserIterations = 5000;
    constructor.defaultServerUserLength = 64;
    constructor.defaultServerPasswordSalt = "BasicPasswordSalt";
    constructor.defaultServerPasswordIterations = 5000;
    constructor.defaultServerPasswordLength = 64;
    constructor.defaultServerSecretSalt = "BasicSecretSalt";
    constructor.defaultServerSecretIterations = 5000;
    constructor.loadSettings = function() {
        var urlBase = window.location.host + window.location.pathname;
        if (urlBase.startsWith("localhost")) 
            urlBase = "http://" + urlBase;
        EcRemote.postExpectingString(urlBase, "settings/settings.js", null, function(settingsObjStr) {
            var settingsObj = JSON.parse(settingsObjStr);
            var msg = (settingsObj)[AppSettings.FIELD_MSG_RETURN];
            if (msg != null) 
                AppSettings.returnLoginMessage = msg;
            var serverUrl = (settingsObj)[AppSettings.FIELD_SERVER_URL];
            if (serverUrl != null) 
                AppSettings.defaultServerUrl = serverUrl;
            var serverName = (settingsObj)[AppSettings.FIELD_SERVER_NAME];
            if (serverName != null) 
                AppSettings.defaultServerUrl = serverName;
            var salt = (settingsObj)[AppSettings.FIELD_SALT_USER];
            if (salt != null) 
                AppSettings.defaultServerUserSalt = salt;
            salt = null;
            salt = (settingsObj)[AppSettings.FIELD_SALT_PASS];
            if (salt != null) 
                AppSettings.defaultServerPasswordSalt = salt;
            salt = null;
            salt = (settingsObj)[AppSettings.FIELD_SALT_SECRET];
            if (salt != null) 
                AppSettings.defaultServerSecretSalt = salt;
            salt = null;
            var iter = parseInt((settingsObj)[AppSettings.FIELD_ITERATIONS_USER]);
            if (!iter.equals(NaN)) 
                AppSettings.defaultServerUserIterations = iter.intValue();
            iter = parseInt((settingsObj)[AppSettings.FIELD_ITERATIONS_PASS]);
            if (!iter.equals(NaN)) 
                AppSettings.defaultServerPasswordIterations = iter.intValue();
            iter = parseInt((settingsObj)[AppSettings.FIELD_ITERATIONS_SECRET]);
            if (!iter.equals(NaN)) 
                AppSettings.defaultServerSecretIterations = iter.intValue();
            var len = parseInt((settingsObj)[AppSettings.FIELD_LENGTH_USER]);
            if (!len.equals(NaN)) 
                AppSettings.defaultServerUserLength = len.intValue();
            len = parseInt((settingsObj)[AppSettings.FIELD_LENGTH_PASS]);
            if (!len.equals(NaN)) 
                AppSettings.defaultServerPasswordLength = len.intValue();
        }, function(p1) {
            console.error("Unable to load settings file");
        });
    };
}, {}, {});
