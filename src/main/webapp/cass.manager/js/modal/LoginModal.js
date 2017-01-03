/**
 * Modal for authenticating a user and getting keys stored on server
 * 
 * @module cass.manager
 * @class LoginModal
 * 
 * @author devlin.junker@eduworks.com
 */
var LoginModal = (function(LoginModal){	
	var ERROR_CONTAINER_ID = "#loginError";
	
	/**
	 * Submits the information from the inputs to the server for authentication
	 * and handles response
	 * 
	 * @memberOf LoginModal
	 * @method submitLogin
	 * @private
	 */
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
					view.loginSuccess(EcView.urlParameters());
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
	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf LoginModal
	 * @method display
	 * @param {String} containerId
	 * 			The DOM ID of the Modal Container this modal is displayed in
	 */
	LoginModal.prototype.display = function(containerId)
	{
		var view = this;
		
		var warning = this.warning;
		
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
			
			if(serverName == AppController.serverController.selectedServerName)
				option.attr("selected", "selected")
			
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
	}
	
	return LoginModal;
})(LoginModal);