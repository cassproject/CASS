var AddServerModal = (function(AddServerModal){	
	var ERROR_CONTAINER_ID = "#loginError";
	
	function submitAddServer(onClose){
		var name = $("#addServerName").val();
		var url = $("#addServerUrl").val();
		
		AppController.serverController.addServer(name, url, function(){
			AppController.serverController.selectServer(name);			
			AppMenu.prototype.setCurrentServer();
			
			ModalManager.hideModal();
			
			onClose();
		}, displayError);
	}
	function displayError(err)
	{
		ViewManager.getView("#addServerMessageContainer").displayAlert(err);
	}
	function clearError()
	{
		ViewManager.getView("#addServerMessageContainer").clearAlert();
	}
	
	AddServerModal.prototype.display = function(containerId)
	{
		var closeCallback = this.onClose;
		
		ViewManager.showView(new MessageContainer("addServer"), "#addServerMessageContainer");
		
		$("#addServerForm").submit(function(event){
			event.preventDefault();
			submitAddServer(closeCallback);
		});
		
		$("#addServerCancel").click(function(event){
			event.preventDefault();
			ModalManager.hideModal();
			closeCallback();
		});
		
	}
	
	return AddServerModal;
})(AddServerModal);