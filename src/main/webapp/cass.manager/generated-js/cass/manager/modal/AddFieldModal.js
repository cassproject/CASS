/**
 *  Stub for the AddFieldModal
 *  
 *  @module cass.manager
 *  @author devlin.junker@eduworks.com
 *  @class AddFieldModal
 *  @extends EcModal
 *  @constructor
 */
var AddFieldModal = /**
 *  @constructor
 *  @param {Object} field
 *  @param {String} repoEditContainerId
 */
function(field, repoEditContainerId) {
    EcModal.call(this);
    this.field = field;
    this.repoEditContainerId = repoEditContainerId;
};
AddFieldModal = stjs.extend(AddFieldModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.field = null;
    prototype.repoEditContainerId = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/addField.html";
    };
}, {field: "Object"}, {});
