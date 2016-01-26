var LoginController = function() {};
LoginController = stjs.extend(LoginController, null, [], function(constructor, prototype) {
    prototype.loginServer = null;
    prototype.identity = null;
    prototype.login = function(username, password) {
        this.loginServer.login(username, password);
        this.loginServer.fetch(function(p1) {
            refreshIdentities(EcIdentityManager.ids);
            refreshContacts(EcIdentityManager.contacts);
            loginSuccess();
        }, function(p1) {
            refreshIdentities(EcIdentityManager.ids);
            refreshContacts(EcIdentityManager.contacts);
            logoutSuccess();
        });
    };
    prototype.create = function(username, password) {
        this.loginServer.login(username, password);
        var me = this;
        this.loginServer.create(function(p1) {
            me.login(username, password);
        }, function(p1) {
            refreshIdentities(EcIdentityManager.ids);
            refreshContacts(EcIdentityManager.contacts);
            logoutSuccess();
        }, new (stjs.extend(function LoginController$5() {
            EcCallbackReturn0.call(this);
        }, EcCallbackReturn0, [], function(constructor, prototype) {
            prototype.callback = function() {
                return padGenerationCallback();
            };
        }, {}, {}))());
    };
    prototype.save = function() {
        var me = this;
        this.loginServer.commit(function(p1) {
            saveSuccess();
        }, function(p1) {
            me.logout();
        }, new (stjs.extend(function LoginController$8() {
            EcCallbackReturn0.call(this);
        }, EcCallbackReturn0, [], function(constructor, prototype) {
            prototype.callback = function() {
                return padGenerationCallback();
            };
        }, {}, {}))());
    };
    prototype.logout = function() {
        this.loginServer.clear();
        this.identity.selectedIdentity = null;
        EcIdentityManager.ids = new Array();
        refreshIdentities(EcIdentityManager.ids);
        logoutSuccess();
    };
}, {loginServer: "EcRemoteIdentityManager", identity: "IdentityController"}, {});
