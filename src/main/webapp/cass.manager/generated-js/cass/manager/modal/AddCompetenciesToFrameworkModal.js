/**
 *  Stub for the AddCompetenciesToFrameworkModal
 *  
 *  @author devlin.junker@eduworks.com
 *  @class AddCompetenciesToFrameworkModal
 *  @extends EcModal
 *  @constructor
 */
var AddCompetenciesToFrameworkModal = /**
 *  @constructor
 *  @param {EcRemoteLinkedData || EcRemoteLinkedData[]} data
 *  			The competency or array of competencies to add to the framework selected in the modal
 */
function(data) {
    EcModal.call(this);
    this.data = data;
};
AddCompetenciesToFrameworkModal = stjs.extend(AddCompetenciesToFrameworkModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "medium";
    prototype.data = null;
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/addToFramework.html";
    };
}, {data: "EcRemoteLinkedData", onClose: "Callback0"}, {});
