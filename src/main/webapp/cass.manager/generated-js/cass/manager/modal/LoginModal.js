var LoginModal = function(success, cancel, warningMessage) {
    EcModal.call(this);
    this.loginSuccess = success;
    this.onClose = cancel;
    this.warning = warningMessage;
};
LoginModal = stjs.extend(LoginModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.onClose = null;
    prototype.loginSuccess = null;
    prototype.warning = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/login.html";
    };
}, {onClose: "Callback0", loginSuccess: "Callback0", onClose: "Callback0"}, {});
