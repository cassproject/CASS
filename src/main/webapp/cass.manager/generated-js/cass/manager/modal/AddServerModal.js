var AddServerModal = function(modalClose) {
    EcModal.call(this);
    this.onClose = modalClose;
};
AddServerModal = stjs.extend(AddServerModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.onClose = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/addServer.html";
    };
}, {onClose: "Callback0", onClose: "Callback0"}, {});
