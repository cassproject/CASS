var LoginModal = (function(LoginModal){	
	var ERROR_CONTAINER_ID = "#loginError";
	
	function submitLogin(view){
		var server = $("#loginServer").val();
		var userId = $("#loginUserId").val(); 
		var password = $("#loginPassword").val();
		
		var oldSelectedServer = AppController.serverController.selectedServerName;
		
		AppController.serverController.selectServer(server);
		
		ViewManager.getView("#loginMessageContainer").clearAlert("loginFail");
		
		AppController.loginController.login(
			userId,
			password,
			function(){
				if(view.loginSuccess != undefined)
				{
					view.loginSuccess();
				}
				else
				{
					ModalManager.hideModal();
					ScreenManager.changeScreen(new UserIdentityScreen())
				}
				
				AppMenu.prototype.setLoggedIn();
			},
			function(err){	
				AppController.serverController.selectServer(oldSelectedServer);
				
				if(err == undefined)
					err = "Unable to Connect to Server";
				
				ViewManager.getView("#loginMessageContainer").displayAlert(err, "loginFail");
			}
		);
	}
	
	LoginModal.prototype.display = function(containerId, callback)
	{
		var view = this;
		
		var warning = this.warning;
		
		$(containerId).load("partial/modal/login.html", function(){
			ViewManager.showView(new MessageContainer("login"), "#loginMessageContainer", function(){
				if(warning != undefined)
					ViewManager.getView("#loginMessageContainer").displayWarning(warning);
			});
			
			if($(AppController.serverController.serverList).size() > 0 ){
				$("#loginServer").html("");
			}
			for(var serverName in AppController.serverController.serverList){
				var serverUrl = AppController.serverController.serverList[serverName];
				
				var option = $("<option></option>");
				option.attr("value", serverUrl);
				option.text(serverName);
				
				$("#loginServer").append(option);
			}
			
			$("#loginAddServer").click(function(){
				ModalManager.showModal(new AddServerModal(function(){
					ModalManager.showModal(new LoginModal());
				}));
			});
			
			$("#loginCreateAccount").click(function(){
				ModalManager.showModal(new CreateUserModal());
			});
			
			$("#loginForm").submit(function(event){
				event.preventDefault();
				submitLogin(view);
			});
			
			$("#loginCancel").click(function(event){
				event.preventDefault();
				ModalManager.hideModal();
			});
			
			if(callback != undefined)
				callback();
		});
	}
	
	return LoginModal;
})(LoginModal);