var LoginModal = function(success, cancel, warningMessage) {
    EcModal.call(this);
    this.loginSuccess = success;
    this.cancel = cancel;
    this.warning = warningMessage;
};
LoginModal = stjs.extend(LoginModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.cancel = null;
    prototype.loginSuccess = null;
    prototype.warning = null;
    prototype.onClose = function() {
        if (this.cancel != null) 
            this.cancel();
        return EcView.prototype.onClose.call(this);
    };
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/login.html";
    };
    prototype.submitOauth2 = function(server) {
        var me = this;
        var failure = function(err) {
            ViewManager.getView("#loginMessageContainer").displayAlert(err, "loginFail");
        };
        ViewManager.getView("#loginMessageContainer").clearAlert("loginFail");
        AppController.loginController.hello(server, function() {
            AppController.serverController.checkForAdmin(function() {
                if (me.loginSuccess != null) {
                    me.loginSuccess(URLParams.getParams());
                } else {
                    ModalManager.hideModal();
                }
                new AppMenu().setLoggedIn();
            });
        }, failure);
    };
    prototype.submitLogin = function(userId, password, server) {
        var me = this;
        var failure = function(err) {
            ViewManager.getView("#loginMessageContainer").displayAlert(err, "loginFail");
        };
        ViewManager.getView("#loginMessageContainer").clearAlert("loginFail");
        AppController.loginController.login(userId, password, server, function() {
            AppController.serverController.checkForAdmin(function() {
                AppController.serverController.checkForAdmin(function() {
                    if (me.loginSuccess != null) {
                        me.loginSuccess(URLParams.getParams());
                    } else {
                        ModalManager.hideModal();
                    }
                    new AppMenu().setLoggedIn();
                });
            });
        }, failure);
    };
}, {cancel: "Callback0", loginSuccess: {name: "Callback1", arguments: ["Object"]}}, {});
