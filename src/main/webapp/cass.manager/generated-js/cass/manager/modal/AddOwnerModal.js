/**
 *  Stub for the AddFieldModal
 *  
 *  @module cass.manager
 *  @author devlin.junker@eduworks.com
 *  @class AddOwnerModal
 *  @extends EcModal
 *  @constructor
 */
var AddOwnerModal = /**
 *  @constructor
 *  @param {Object} field
 *  @param {String} objectContainerId
 */
function(field, objectContainerId) {
    EcModal.call(this);
    this.field = field;
    this.objectContainerId = objectContainerId;
};
AddOwnerModal = stjs.extend(AddOwnerModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.field = null;
    prototype.objectContainerId = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/addOwner.html";
    };
}, {field: "Object"}, {});
