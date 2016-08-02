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
	
	AddServerModal.prototype.display = function(containerId, callback)
	{
		var closeCallback = this.onClose;
		
		$(containerId).load("partial/modal/addServer.html", function(){
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
			
			if(callback != undefined)
				callback();
		});
	}
	
	return AddServerModal;
})(AddServerModal);