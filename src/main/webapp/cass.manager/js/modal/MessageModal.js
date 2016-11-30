/**
 * Generic Modal to show a message to a user with an 'Ok' button
 * 
 * @module cass.manager
 * @class MessageModal
 * 
 * @author devlin.junker@eduworks.com
 */
var MessageModal = (function(MessageModal){	
	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf MessageModal
	 * @method display
	 * @param {String} containerId
	 * 			The DOM ID of the Modal Container this modal is displayed in
	 */
	MessageModal.prototype.display = function(containerId)
	{
		var okCallback = this.okCallback;
		
		$("#messageHeader").html(this.header);
		$("#messageText").html(this.message);
		if(this.message == "" || this.message == undefined){
			$("#messageText").css("margin-bottom", "0px");
			$("#okBtn").css("margin-top", "0px");
		}
		
		$("#okBtn").click(function(event){
			if(okCallback != undefined)
				okCallback();
			ModalManager.hideModal();
		});
		
	}
	
	return MessageModal;
})(MessageModal);