/**
 * Modal containing the form for creating a new user with a username
 * and password combination.
 * 
 * @module cass.manager
 * @class CreateIdentityModal
 * 
 * @author devlin.junker@eduworks.com
 */
var CreateIdentityModal = (function(CreateIdentityModal){
	
	/**
	 * Submits the username and password given to the server
	 * to create a new user 
	 * 
	 * @memberOf CreateIdentityModal
	 * @method submitCreateForm
	 * @private 
	 */
	function submitCreateForm(successCallback){
		ViewManager.getView("#createIdentityMessageContainer").clearAlert("createFail");

		$("#createButton").prop("disabled", true);
		$("#createIdentitySpinner").removeClass("hide");

        var name = $("#createIdentityName").val();
        AppController.identityController.generateIdentity(function (identity) {
            if(ScreenManager.getCurrentScreen().refreshIdentities != undefined)
                ScreenManager.getCurrentScreen().refreshIdentitie(EcIdentityManager.ids);
            download(identity.displayName + '.pem', identity.ppk.toPem());
            AppController.loginController.save(
                function(){
                    $("#createButton").removeAttr("disabled");
                    $("#createIdentitySpinner").addClass("hide");
                    ModalManager.hideModal();
                	if(successCallback != undefined){
                		successCallback();
					}
				},
                function(err){
                    $("#createButton").removeAttr("disabled");
                    $("#createIdentitySpinner").addClass("hide");
				}
            );
        }, name);
	}
	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf CreateIdentityModal
	 * @method display
	 * @param {String} containerId
	 * 			The DOM ID of the Modal Container this modal is displayed in
	 */
	CreateIdentityModal.prototype.display = function(containerId)
	{
		var successCallback = this.success;
		
		ViewManager.showView(new MessageContainer("createIdentity"), "#createIdentityMessageContainer");
		
		$("#createForm").submit(function(event){
			event.preventDefault();
			submitCreateForm(successCallback);
		})
		
	}
	
	return CreateIdentityModal;
})(CreateIdentityModal);