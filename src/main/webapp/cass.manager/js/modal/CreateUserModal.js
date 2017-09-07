/**
 * Modal containing the form for creating a new user with a username
 * and password combination.
 * 
 * @module cass.manager
 * @class CreateUserModal
 * 
 * @author devlin.junker@eduworks.com
 */
var CreateUserModal = (function(CreateUserModal){
	
	/**
	 * Submits the username and password given to the server
	 * to create a new user 
	 * 
	 * @memberOf CreateUserModal
	 * @method submitCreateForm
	 * @private 
	 */
	function submitCreateForm(){
		ViewManager.getView("#createMessageContainer").clearAlert("createFail");
		
		var server = $("#createServer").val();
		
		AppController.serverController.selectServer(server,function(){
			AppController.loginController.create(
					$("#createUsername").val(),
					$("#createPassword").val(),
					function(){
						ModalManager.hideModal();
						ViewManager.getView(AppController.topBarContainerId).setLoggedIn();
						ScreenManager.changeScreen(new UserIdentityScreen());

						AppController.serverController.selectServer($("#createServer").val());
					},
					function(err){
						if(err == undefined)
							err = "Unable to Connect to Server to Create User";

						ViewManager.getView("#createMessageContainer").displayAlert(err, "createFail");
					}
				);
		});
	}
	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf CreateUserModal
	 * @method display
	 * @param {String} containerId
	 * 			The DOM ID of the Modal Container this modal is displayed in
	 */
	CreateUserModal.prototype.display = function(containerId)
	{
		ViewManager.showView(new MessageContainer("createUser"), "#createMessageContainer");
		
		if($(AppController.serverController.serverList).size() > 0 ){
			$("#createServer").html("");
		}
		for(var serverName in AppController.serverController.serverList){
			var serverUrl = AppController.serverController.serverList[serverName];
			
			var option = $("<option></option>");
			option.attr("value", serverUrl);
			option.text(serverName);
			
			if(serverName == AppController.serverController.selectedServerName)
				option.attr("selected", "selected")
			
			$("#createServer").append(option);
		}
		
		$("#createAddServer").click(function(){
			ModalManager.showModal(new AddServerModal(function(){
				ModalManager.showModal(new CreateUserModal());
			}));
		});
		
		$("#createForm").submit(function(event){
			event.preventDefault();
			submitCreateForm();
		})
		
	}
	
	return CreateUserModal;
})(CreateUserModal);