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
		$(ERROR_CONTAINER_ID).text(err);
		$(ERROR_CONTAINER_ID).removeClass("hide");
	}
	function clearError()
	{
		$(ERROR_CONTAINER_ID).addClass("hide");
	}
	
	AddServerModal.prototype.display = function(containerId)
	{
		var closeCallback = this.onClose;
		
		clearError();
		
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