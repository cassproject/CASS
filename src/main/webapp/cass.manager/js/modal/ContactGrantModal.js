var ContactGrantModal = (function(ContactGrantModal){	
	
	ContactGrantModal.prototype.display = function(containerId, callback)
	{
		var me = this;
		var closed = false;
		
		var contact = this.contact;
		var responseToken = this.token;
		var responseSignature = this.signature;
		
		var onClose = this.onClose;
		
		
		$(containerId).load("partial/modal/contactGrant.html", function(){
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
	            grant.source = AppController.loginServer.server;

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
			
			if(callback != undefined)
				callback();
		});
	}
	
	return ContactGrantModal;
})(ContactGrantModal);