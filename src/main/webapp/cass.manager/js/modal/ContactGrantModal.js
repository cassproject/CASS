/**
 * Modal to indicate that the user has followed a link to add a new contact
 * and allows them to send their own contact grant to the user
 * 
 * @module cass.manager
 * @class ContactAcceptModal
 * 
 * @author devlin.junker@eduworks.com
 */
var ContactGrantModal = (function(ContactGrantModal){	
	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf ContactGrantModal
	 * @method display
	 * @param {String} containerId
	 * 			The DOM ID of the Modal Container this modal is displayed in
	 */
	ContactGrantModal.prototype.display = function(containerId)
	{
		var me = this;
		var closed = false;
		
		var contact = this.contact;
		var responseToken = this.token;
		var responseSignature = this.signature;
		
		var onClose = this.onClose;
		
		
		ViewManager.showView(new MessageContainer("contactGrant"), "#contactGrantMessageContainer", function(){});
		
		if(EcIdentityManager.ids != undefined){
			for(var i = 0; i < EcIdentityManager.ids.length; i++)
			{
				var option = $("<option></option>");
				
				option.attr("value", EcIdentityManager.ids[i].ppk.toPem());
				option.text(EcIdentityManager.ids[i].displayName);
				
				$("#contactGrantIdentity").append(option);
			}
		}
		
		$("#sendContactGrant").click(function(event){
			event.preventDefault();
			
			var displayName = $("#contactGrantDisplayName").val();
			if(displayName == undefined || displayName == ""){
				ViewManager.getView("#contactGrantMessageContainer").displayAlert("Cannot Share Information without a Display Name");
				return;
			}
			
			var identity = $("#contactGrantIdentity").val();
			if(identity == undefined || identity == ""){
				ViewManager.getView("#contactGrantMessageContainer").displayAlert("Cannot Share Information without an Identity Selected");
				return;
			}
			
			var grant = new EcContactGrant();
            grant.addOwner(contact.pk);
            grant.addOwner(EcPpk.fromPem(identity).toPk());
            grant.generateId(contact.source);
            grant.source = AppController.serverController.selectedServerUrl;

            grant.displayName = displayName;
            grant.pk = EcPpk.fromPem(identity).toPk().toPem();
            
            grant.responseToken = responseToken;
            grant.responseSignature = responseSignature;
            
            grant.signWith(EcPpk.fromPem(identity));
            
            var encrypted = EcEncryptedValue.toEncryptedValue(grant, false);
            
            EcRepository.save(encrypted, function () {
            	ModalManager.hideModal();
            }, function(){});
		});
		
		$("#skipContactGrant").click(function(event){
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
	
	return ContactGrantModal;
})(ContactGrantModal);