var RepoImportModal = function() {
    EcModal.call(this);
};
RepoImportModal = stjs.extend(RepoImportModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "medium";
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/import.html";
    };
}, {}, {});
