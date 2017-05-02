var EncryptOptionsModal = function(callback) {
    EcModal.call(this);
    this.callback = callback;
};
EncryptOptionsModal = stjs.extend(EncryptOptionsModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "tiny";
    prototype.callback = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/encryptOptions.html";
    };
}, {callback: {name: "Callback1", arguments: ["Object"]}}, {});
