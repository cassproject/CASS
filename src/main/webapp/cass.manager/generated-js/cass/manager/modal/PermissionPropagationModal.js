var PermissionPropagationModal = function(data, cancelCallback) {
    EcModal.call(this);
    this.data = data;
    this.onCancel = cancelCallback;
};
PermissionPropagationModal = stjs.extend(PermissionPropagationModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "medium";
    prototype.data = null;
    prototype.onCancel = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/permissionPropagation.html";
    };
}, {data: "EcRemoteLinkedData", onCancel: "Callback0"}, {});
