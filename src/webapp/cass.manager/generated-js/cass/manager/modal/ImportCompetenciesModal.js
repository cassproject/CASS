var ImportCompetenciesModal = function(data) {
    EcModal.call(this);
    this.data = data;
};
ImportCompetenciesModal = stjs.extend(ImportCompetenciesModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "medium";
    prototype.data = null;
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet");
    };
}, {data: "EcRemoteLinkedData", onClose: "Callback0"}, {});
