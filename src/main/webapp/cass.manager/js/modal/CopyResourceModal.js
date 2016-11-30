/**
 * Handles the details of copying resources in the repository,
 * this gives the current user owner priveledges on a copy of a resource
 * 
 * @module cass.manager
 * @class CopyResourceModal
 * 
 * @author devlin.junker@eduworks.com
 */
var CopyResourceModal = (function(CopyResourceModal){
	
	/**
	 * Handles actually copying the data selected and then triggering the callback
	 * once it has completed copying everything
	 * 
	 * @memberOf CopyResourceModal
	 * @method submitCopy
	 * @private
	 * @param {EcRemoteLinkedData || EcRemoteLinkedData[]} data
	 * 			Data or array of data to be copied
	 * @param {Callback0} callback
	 * 			Callback to be triggered once successfully copied everything
	 */
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
	
	/**
	 * Adds a resource name to the list of resources being copied
	 * 
	 * @memberOf CopyResourceModal
	 * @method submitCopy
	 * @private
	 * @param {EcLinkedData} resource
	 */
	function addResourceToList(resource){
		$("#copyResources").append($("<li>"+resource.name+"</li>"));
	}
	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf ContactGrantModal
	 * @method display
	 * @param {String} containerId
	 * 			The DOM ID of the Modal Container this modal is displayed in
	 */
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