var ChangeTypeModal = function(changeObj, repoEditContainerId) {
    EcModal.call(this);
    this.changeObj = changeObj;
    this.repoEditContainerId = repoEditContainerId;
};
ChangeTypeModal = stjs.extend(ChangeTypeModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.changeObj = null;
    prototype.repoEditContainerId = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/changeType.html";
    };
}, {changeObj: "Object"}, {});
