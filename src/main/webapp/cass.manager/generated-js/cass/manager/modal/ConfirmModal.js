var ConfirmModal = function(confirmCallback, message) {
    EcModal.call(this);
    this.confirmCallback = confirmCallback;
    this.message = message;
};
ConfirmModal = stjs.extend(ConfirmModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "tiny";
    prototype.message = null;
    prototype.confirmCallback = null;
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet");
    };
}, {confirmCallback: "Callback0", onClose: "Callback0"}, {});
