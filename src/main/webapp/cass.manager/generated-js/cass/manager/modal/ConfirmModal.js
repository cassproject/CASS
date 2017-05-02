var ConfirmModal = function(confirmCallback, message, header) {
    EcModal.call(this);
    this.confirmCallback = confirmCallback;
    this.message = message;
    this.header = header;
};
ConfirmModal = stjs.extend(ConfirmModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "tiny";
    prototype.header = null;
    prototype.message = null;
    prototype.confirmCallback = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/confirm.html";
    };
}, {confirmCallback: "Callback0"}, {});
