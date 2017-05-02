var ContactAcceptModal = function(grant, close) {
    EcModal.call(this);
    this.grant = grant;
    this.closeEvent = close;
};
ContactAcceptModal = stjs.extend(ContactAcceptModal, EcModal, [], function(constructor, prototype) {
    prototype.closeEvent = null;
    prototype.modalSize = "small";
    prototype.grant = null;
    prototype.onClose = function() {
        if (this.closeEvent != null) 
            this.closeEvent();
        return EcView.prototype.onClose.call(this);
    };
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/contactAccept.html";
    };
}, {closeEvent: "Callback0", grant: "EcContactGrant"}, {});
