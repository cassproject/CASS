var RepoExportModal = function(data) {
    EcModal.call(this);
    this.data = data;
};
RepoExportModal = stjs.extend(RepoExportModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "medium";
    prototype.data = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/repoExport.html";
    };
}, {data: "EcRemoteLinkedData"}, {});
