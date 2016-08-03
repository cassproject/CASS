var SaveIdModal = function(msg) {
    EcModal.call(this);
    this.msg = msg;
};
SaveIdModal = stjs.extend(SaveIdModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "tiny";
    prototype.msg = null;
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet!");
    };
}, {onClose: "Callback0"}, {});
