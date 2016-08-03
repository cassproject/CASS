var EvidenceViewModal = function(evidence) {
    EcModal.call(this);
    this.evidence = evidence;
};
EvidenceViewModal = stjs.extend(EvidenceViewModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "medium";
    prototype.evidence = null;
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet");
    };
}, {evidence: {name: "Array", arguments: [null]}, onClose: "Callback0"}, {});
