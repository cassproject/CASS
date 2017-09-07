/**
 * Handles adding a server URL and name to the list of servers
 * kept by the application
 * 
 * @module cass.manager
 * @class AddServerModal
 * 
 * @author devlin.junker@eduworks.com
 */
var AddServerModal = (function(AddServerModal){
	
	/**
	 * 
	 * @memberOf AddServerModal
	 * @method submitAddServer
	 * @private
	 * @param {Callback0} onClose
	 * 			Callback triggered once server is added to application list
	 */
	function submitAddServer(onClose){
		var name = $("#addServerName").val();
		var url = $("#addServerUrl").val();
		var me = this;
		var r = new EcRepository();
		r.selectedServer = url;
		r.autoDetectRepositoryAsync(function(){
			AppController.serverController.addServer(name, r.selectedServer, function(){
				AppController.serverController.selectServer(name,function(){
					if(AppController.loginController.getLoggedIn()){
						AppController.loginController.setLoggedIn(false);
						ViewManager.getView("#menuContainer").setLoggedOut();
					}

					AppMenu.prototype.setCurrentServer();

					ModalManager.hideModal();
				});
			},displayError);
		}, displayError);
	}
	
	/**
	 * Adds an error message in the MessageContainer Alert Box
	 * 
	 * @memberOf AddServerModal
	 * @method displayError
	 * @private
	 * @param {String} err
	 * 			Error to display 
	 */
	function displayError(err)
	{
		ViewManager.getView("#addServerMessageContainer").displayAlert(err);
	}
	
	/**
	 * Clears the error message in the MessageContainer Alert Box
	 * 
	 * @memberOf AddServerModal
	 * @method clearError
	 * @private
	 */
	function clearError()
	{
		ViewManager.getView("#addServerMessageContainer").clearAlert();
	}
	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf AddServerModal
	 * @method display
	 * @param {String} containerId
	 * 			The DOM ID of the Modal Container this modal is displayed in
	 */
	AddServerModal.prototype.display = function(containerId)
	{
		var closeCallback = this.onClose;
		
		ViewManager.showView(new MessageContainer("addServer"), "#addServerMessageContainer");
		
		if(this.server != undefined && this.server != null){
			$("#addServerUrl").val(this.server).attr("disabled", "disabled");
			$("#addServerMessage").text("It looks like you are coming from a new CASS server. Enter a name below to identify it for future use. This will only be available to your computer.")
		}
		
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