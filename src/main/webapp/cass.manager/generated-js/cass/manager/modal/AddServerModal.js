var AddServerModal = function(modalClose) {
    EcModal.call(this);
    this.onClose = modalClose;
};
AddServerModal = stjs.extend(AddServerModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.onClose = null;
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet");
    };
}, {onClose: "Callback0", onClose: "Callback0"}, {});
