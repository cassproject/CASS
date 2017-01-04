/**
 * Generic Modal for a confirm interaction, displays a message and 
 * waits for the user to select confirm, then triggers the confirm 
 * callback
 * 
 * @module cass.manager
 * @class ConfirmModal
 * 
 * @author devlin.junker@eduworks.com
 */
var ConfirmModal = (function(ConfirmModal){	
	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf ConfirmModal
	 * @method display
	 * @param {String} containerId
	 * 			The DOM ID of the Modal Container this modal is displayed in
	 */
	ConfirmModal.prototype.display = function(containerId)
	{
		var msg = this.message;
		
		var confirmCallback = this.confirmCallback;
		
		ViewManager.showView(new MessageContainer("confirm"), "#confirmMessageContainer");
		
		if(this.header != undefined)
			$("#confirmHeader").text(this.header);
		
		$("#confirmMessage").html(msg);
		
		$("#confirmBtn").click(function(event){
			confirmCallback();
		});
		
		$("#cancelBtn").click(function(event){
			ModalManager.hideModal();
		});
		
	}
	
	/**
	 * Public function for showing an alert message in the confirm container, 
	 * can be used in the confirm callback to indicate an error during confirmation 
	 * 
	 * @memberOf ConfirmModal
	 * @method displayAlertMessage
	 * @param {String} msg
	 * 			Alert message to display
	 */
	ConfirmModal.prototype.displayAlertMessage = function(msg){
		ViewManager.getView("#confirmMessageContainer").displayAlert(msg);
	}
	
	return ConfirmModal;
})(ConfirmModal);