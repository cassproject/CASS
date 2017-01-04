var ContactAcceptModal = function(grant, close) {
    EcModal.call(this);
    this.grant = grant;
    this.onClose = close;
};
ContactAcceptModal = stjs.extend(ContactAcceptModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.grant = null;
    prototype.onClose = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/contactAccept.html";
    };
}, {grant: "EcContactGrant", onClose: "Callback0", onClose: "Callback0"}, {});
