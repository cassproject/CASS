/**
 * Modal to indicate to the user that another user has shared 
 * contact information with them via a ContactGrant 
 * 
 * @module cass.manager
 * @class ContactAcceptModal
 * 
 * @author devlin.junker@eduworks.com
 */
var ContactAcceptModal = (function(ContactAcceptModal){	
	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf ContactAcceptModal
	 * @method display
	 * @param {String} containerId
	 * 			The DOM ID of the Modal Container this modal is displayed in
	 */
	ContactAcceptModal.prototype.display = function(containerId)
	{
		var me = this;
		var closed = false;
		
		var grant = this.grant;
		
		var onClose = this.onClose;
		
		ViewManager.showView(new MessageContainer("contactAccept"), "#contactAcceptMessageContainer", function(){});
		
		$("#newContactName").text(grant.displayName);
		
		$("#addContact").click(function(event){
			event.preventDefault();
			
			var contact = new EcContact();
            contact.pk = EcPk.fromPem(grant.pk);
            contact.source = grant.source;
            contact.displayName = grant.displayName;
            
            EcIdentityManager.addContact(contact);
            
            EcRepository._delete(grant);
            
            ModalManager.hideModal();
		});
		
		$("#skipAddContact").click(function(event){
			event.preventDefault();
			ModalManager.hideModal();
		});
		
		$(containerId).on("closed.zf.reveal", function(){
			if(ModalManager.getCurrentModal() == me & !closed){
				onClose();
			}
			closed = true;
		});
		
	}
	
	return ContactAcceptModal;
})(ContactAcceptModal);