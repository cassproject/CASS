var ConfirmModal = (function(ConfirmModal){	
	
	ConfirmModal.prototype.display = function(containerId, callback)
	{
		var msg = this.message;
		
		var confirmCallback = this.confirmCallback;
		$(containerId).load("partial/modal/confirm.html", function(){
			ViewManager.showView(new MessageContainer("confirm"), "#confirmMessageContainer");
			
			$("#confirmMessage").html(msg);
			
			$("#confirmBtn").click(function(event){
				confirmCallback();
			});
			
			$("#cancelBtn").click(function(event){
				ModalManager.hideModal();
			});
			
			if(callback != undefined)
				callback();
		});
	}
	
	ConfirmModal.prototype.displayAlertMessage = function(msg){
		ViewManager.getView("#confirmMessageContainer").displayAlert(msg);
	}
	
	return ConfirmModal;
})(ConfirmModal);