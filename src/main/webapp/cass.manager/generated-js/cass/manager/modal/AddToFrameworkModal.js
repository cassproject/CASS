/**
 *  Stub for the AddCompetenciesToFrameworkModal
 *  
 *  @module cass.manager
 *  @author devlin.junker@eduworks.com
 *  @class AddCompetenciesToFrameworkModal
 *  @extends EcModal
 *  @constructor
 */
var AddToFrameworkModal = /**
 *  @constructor
 *  @param {EcRemoteLinkedData || EcRemoteLinkedData[]} data
 *  			The competency or array of competencies to add to the framework selected in the modal
 */
function(data) {
    EcModal.call(this);
    this.data = data;
};
AddToFrameworkModal = stjs.extend(AddToFrameworkModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "medium";
    prototype.data = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/addToFramework.html";
    };
}, {data: "EcRemoteLinkedData"}, {});
