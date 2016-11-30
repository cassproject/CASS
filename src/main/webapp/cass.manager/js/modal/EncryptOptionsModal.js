/**
 * Generic Modal for a confirm interaction, displays a message and 
 * waits for the user to select confirm, then triggers the confirm 
 * callback
 * 
 * @module cass.manager
 * @class EncryptOptionsModal
 * 
 * @author devlin.junker@eduworks.com
 */
var EncryptOptionsModal = (function(EncryptOptionsModal){	
	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf EncryptOptionsModal
	 * @method display
	 * @param {String} containerId
	 * 			The DOM ID of the Modal Container this modal is displayed in
	 */
	EncryptOptionsModal.prototype.display = function(containerId)
	{
		var callback = this.callback;
		
		ViewManager.showView(new MessageContainer("encryptOptions"), "#encryptOptionsMessageContainer");
		
		var showName = false;
		var showType = false;
		
		ViewManager.showView(new Switch(function(){
			showName = ViewManager.getView("#showName").isChecked()
		}, false, "showEncryptedName"), "#showName");
			
		ViewManager.showView(new Switch(function(){
			showType = ViewManager.getView("#showType").isChecked();
		}, false, "showEncryptedType"), "#showType");
		
		
		$("#confirmBtn").click(function(event){
			callback({
				type: showType,
				name: showName
			});
		});
		
		$("#cancelBtn").click(function(event){
			ModalManager.hideModal();
		});
		
	}
	
	return EncryptOptionsModal;
})(EncryptOptionsModal);