var ContactAcceptModal = (function(ContactAcceptModal){	
	
	ContactAcceptModal.prototype.display = function(containerId, callback)
	{
		var me = this;
		var closed = false;
		
		var grant = this.grant;
		
		var onClose = this.onClose;
		
		
		$(containerId).load("partial/modal/contactAccept.html", function(){
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
			
			if(callback != undefined)
				callback();
		});
	}
	
	return ContactAcceptModal;
})(ContactAcceptModal);