var CopyResourceModal = (function(CopyResourceModal){
	
	function submitCopy(data, callback){
		if(data instanceof Array){
			var copied = 0;
			for(var i = 0; i < data.length; i++){
				var copy = new EcRemoteLinkedData();
				copy.copyFrom(data[i]);
				copy.generateId(AppController.serverController.selectedServerUrl);
				
				EcRepository.save(copy, function(){
					copied++;
					if(copied == data.length){
						ModalManager.hideModal();
						callback();
					}
				}, function(){
					ViewManager.getView("#copyResourceMessageContainer").displayAlert("Failed to Save Copied Resource: "+copy.name);
				})
			}
		}else{
			var copy = new EcRemoteLinkedData();
			copy.copyFrom(data);
			copy.generateId(AppController.serverController.selectedServerUrl);
			
			if(AppController.identityController.selectedIdentity != undefined){
				copy.addOwner(AppController.identityController.selectedIdentity.ppk.toPk());
			}
			
			EcRepository.save(copy, function(){
				ModalManager.hideModal();
				callback();
			}, function(){
				ViewManager.getView("#copyResourceMessageContainer").displayAlert("Failed to Save Copied Resource: "+copy.name);
			})
		}
	}
	
	function addResourceToList(resource){
		$("#copyResources").append($("<li>"+resource.name+"</li>"));
	}
	
	CopyResourceModal.prototype.display = function(containerId)
	{
		var data = this.data;
		var cb = this.callback;
	
		ViewManager.showView(new MessageContainer("copyResource"), "#copyResourceMessageContainer");

		if(data instanceof Array){
			for(var i = 0; i < data.length; i++){
				addResourceToList(data[i]);
			}
		}else{
			addResourceToList(data);
		}
		
		$("#submitCopyResources").click(function(){
			submitCopy(data, cb);
		});
		
		$("#cancelCopyResources").click(function(){
			ModalManager.hideModal();
		});
		
		if(AppController.identityController.selectedIdentity != undefined){
			var ownerElement = $(createContactSmall(AppController.identityController.selectedIdentity.ppk.toPk().toPem()));
			$("#copyOwner").append(ownerElement);
		}else{
			$("#copyOwner").text("Public");
		}
			
	}
	
	return CopyResourceModal;
})(CopyResourceModal);