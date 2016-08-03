var ChangeTypeModal = function(repoEditContainer) {
    EcModal.call(this);
    this.repoEditContainer = repoEditContainer;
};
ChangeTypeModal = stjs.extend(ChangeTypeModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.repoEditContainer = null;
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet");
    };
}, {onClose: "Callback0"}, {});
