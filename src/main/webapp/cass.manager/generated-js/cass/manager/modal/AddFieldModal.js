/**
 *  Stub for the AddFieldModal
 *  
 *  @author devlin.junker@eduworks.com
 *  @class AddFieldModal
 *  @extends EcModal
 *  @constructor
 */
var AddFieldModal = /**
 *  @constructor
 *  @param {Object} field
 *  @param {String} repoEditContainer
 */
function(field, repoEditContainer) {
    EcModal.call(this);
    this.field = field;
    this.repoEditContainer = repoEditContainer;
};
AddFieldModal = stjs.extend(AddFieldModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.field = null;
    prototype.repoEditContainer = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/addField.html";
    };
}, {field: "Object", onClose: "Callback0"}, {});
