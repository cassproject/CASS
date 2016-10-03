var SaveIdModal = (function(SaveIdModal){	

	function submitSave(){
		AppController.loginController.save(
			saveSuccess,
			saveFailure
		);
	}
	function saveSuccess()
	{
		ModalManager.hideModal();	
		
		AppMenu.prototype.rebuildIdentityList();
	}
	function saveFailure(err)
	{
		ViewManager.getView("#saveIdentityMessageContainer").displayAlert(err);
	}
	
	SaveIdModal.prototype.display = function(containerId)
	{
		var msg = this.msg;
		
		ViewManager.showView(new MessageContainer("saveId"), "#saveIdentityMessageContainer");
		
		if(msg == undefined){
			msg = "Something has changed...";
		}
		$("#saveMessageContainer").text(msg);
		
		$("#saveId").click(function(event){
			submitSave()
		});
		
		$("#skipSaveId").click(function(event){
			ModalManager.hideModal();
		});
		
	}
	
	return SaveIdModal;
})(SaveIdModal);