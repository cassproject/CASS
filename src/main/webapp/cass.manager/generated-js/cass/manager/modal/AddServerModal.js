var AddServerModal = function(modalClose, server) {
    EcModal.call(this);
    this.closeEvent = modalClose;
    this.server = server;
};
AddServerModal = stjs.extend(AddServerModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.closeEvent = null;
    prototype.server = null;
    prototype.onClose = function() {
        if (this.closeEvent != null) 
            this.closeEvent();
        return EcView.prototype.onClose.call(this);
    };
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/addServer.html";
    };
}, {closeEvent: "Callback0"}, {});
