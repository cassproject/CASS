var ChangeServerModal = (function(ChangeServerModal){	
	var ERROR_CONTAINER_ID = "#changeServerError";
	
	function submitChange(){
		var server = $("#newServer").val();
		
		AppController.serverController.selectServer(server, function(){
			AppMenu.prototype.setCurrentServer();
			ModalManager.hideModal();
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
	
	ChangeServerModal.prototype.display = function(containerId)
	{
		var view = this;
		
		clearError();
		
		$("#changeServerCurrentServer").text(AppController.serverController.selectedServerName);
		$("#changeServerCurrentServer").attr('title', AppController.serverController.selectedServerUrl);
		
		if($(AppController.serverController.serverList).size() > 0 ){
			$("#newServer").html("");
			for(var serverName in AppController.serverController.serverList){
				var serverUrl = AppController.serverController.serverList[serverName];
				
				var option = $("<option></option>");
				
				if(serverName == AppController.serverController.selectedServerName)
					option.attr("selected", "selected")
				option.attr("value", serverUrl);
				option.text(serverName);
				
				$("#newServer").append(option);
			}
		}
		
		if(LoginController.getLoggedIn()){
			displayError("Cannot change server when logged in, please log out to continue");
			
			$("#newServer").attr("disabled", "disabled");
			
			$("#changeServerForm").submit(function(event){
				event.preventDefault();
				return;
			});
		}
		else
		{
			$("#addServer").click(function(){
				ModalManager.showModal(new AddServerModal(function(){
					ModalManager.showModal(new ChangeServerModal());
				}));
			});
			
			$("#changeServerForm").submit(function(event){
				event.preventDefault();
				submitChange();
			});
		}
		
		$("#changeServerCancel").click(function(event){
			event.preventDefault();
			ModalManager.hideModal();
		});
		
	}
	
	return ChangeServerModal;
})(ChangeServerModal);