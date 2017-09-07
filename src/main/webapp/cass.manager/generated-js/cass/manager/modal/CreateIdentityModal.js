var CreateIdentityModal = function(onSuccess) {
    EcModal.call(this);
    this.success = onSuccess;
};
CreateIdentityModal = stjs.extend(CreateIdentityModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.success = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/createIdentity.html";
    };
}, {success: "Callback0"}, {});
