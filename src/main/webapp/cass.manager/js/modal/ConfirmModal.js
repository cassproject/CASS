var ConfirmModal = (function(ConfirmModal){	
	
	ConfirmModal.prototype.display = function(containerId)
	{
		var msg = this.message;
		
		var confirmCallback = this.confirmCallback;
		
		ViewManager.showView(new MessageContainer("confirm"), "#confirmMessageContainer");
		
		$("#confirmMessage").html(msg);
		
		$("#confirmBtn").click(function(event){
			confirmCallback();
		});
		
		$("#cancelBtn").click(function(event){
			ModalManager.hideModal();
		});
		
	}
	
	ConfirmModal.prototype.displayAlertMessage = function(msg){
		ViewManager.getView("#confirmMessageContainer").displayAlert(msg);
	}
	
	return ConfirmModal;
})(ConfirmModal);