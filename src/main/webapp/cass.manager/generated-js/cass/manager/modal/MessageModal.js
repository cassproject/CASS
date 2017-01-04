var MessageModal = function(header, text, size, okCallback) {
    EcModal.call(this);
    this.header = header;
    this.message = text;
    this.modalSize = size;
    this.okCallback = okCallback;
};
MessageModal = stjs.extend(MessageModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.header = null;
    prototype.message = null;
    prototype.okCallback = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/message.html";
    };
}, {okCallback: "Callback0", onClose: "Callback0"}, {});
