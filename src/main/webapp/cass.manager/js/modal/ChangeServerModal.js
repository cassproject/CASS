var ChangeServerModal = (function(ChangeServerModal){	
	var ERROR_CONTAINER_ID = "#changeServerError";
	
	var lastVal;
	
	function submitChange(){
		var server = $("#newServer").val();
		
		AppController.serverController.selectServer(server, function(){
			AppMenu.prototype.setCurrentServer();
			ModalManager.hideModal();
			
			if(LoginController.getLoggedIn()){
				AppController.loginController.logout();
				ViewManager.getView("#menuContainer").setLoggedOut();
			}
			
			ScreenManager.changeScreen(new WelcomeScreen());
			
		}, function(err){
			$("#newServer").val(lastVal);
			displayError("Unable to change servers, reverting to previous server: "+err);
		});
	}
	function displayError(err)
	{
		ViewManager.getView("#changeServerMessageContainer").displayAlert(err);
	}
	function clearError()
	{
		ViewManager.getView("#changeServerMessageContainer").clearAlert();
	}
	
	ChangeServerModal.prototype.display = function(containerId)
	{
		var view = this;
		
		ViewManager.showView(new MessageContainer("changeServer"), "#changeServerMessageContainer", function(){
			if(LoginController.getLoggedIn()){
				ViewManager.getView("#changeServerMessageContainer").displayWarning("You are currently logged in, you will be logged out if you change servers");
			}
		});
		
		
		
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
		
		lastVal = AppController.serverController.selectedServerUrl;
		
		$("#addServer").click(function(){
			ModalManager.showModal(new AddServerModal(function(){
				ModalManager.showModal(new ChangeServerModal());
			}));
		});
		
		$("#changeServerForm").submit(function(event){
			event.preventDefault();
			submitChange();
		});
		
		$("#changeServerCancel").click(function(event){
			event.preventDefault();
			ModalManager.hideModal();
		});
		
	}
	
	return ChangeServerModal;
})(ChangeServerModal);