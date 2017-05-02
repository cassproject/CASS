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
}, {cancel: "Callback0", loginSuccess: {name: "Callback1", arguments: ["Object"]}}, {});
