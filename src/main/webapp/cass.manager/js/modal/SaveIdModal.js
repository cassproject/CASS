/**
 * Modal to handle saving identities and contact information
 * to the server
 * 
 * @module cass.manager
 * @class SaveIdModal
 * 
 * @author devlin.junker@eduworks.com
 */
var SaveIdModal = (function(SaveIdModal){	

	/**
	 * Submits the identities and contacts to the server
	 * 
	 * @memberOf SaveIdModal
	 * @method submitSave
	 * @private
	 */
	function submitSave(){
		AppController.loginController.save(
			saveSuccess,
			saveFailure
		);
	}

	/**
	 * Handles what happens if succesfully saved
	 * 
	 * @memberOf SaveIdModal
	 * @method saveSuccess
	 * @private
	 */
	function saveSuccess()
	{
		ModalManager.hideModal();	
		
		AppMenu.prototype.rebuildIdentityList();
	}
	
	/**
	 * Handles displaying errors if failure during save
	 * 
	 * @memberOf SaveIdModal
	 * @method saveFailure
	 * @private
	 * @param {String} err
	 * 			Error to display 
	 */
	function saveFailure(err)
	{
		ViewManager.getView("#saveIdentityMessageContainer").displayAlert(err);
	}
	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf SaveIdModal
	 * @method display
	 * @param {String} containerId
	 * 			The DOM ID of the Modal Container this modal is displayed in
	 */
	SaveIdModal.prototype.display = function(containerId)
	{
		var msg = this.msg;
		
		ViewManager.showView(new MessageContainer("saveId"), "#saveIdentityMessageContainer");
		
		if(msg == undefined){
			msg = "Something has changed...";
		}
		$("#saveMessageContainer").text(msg);
		
		$("#saveId").click(function(event){
			submitSave()
		});
		
		$("#skipSaveId").click(function(event){
			ModalManager.hideModal();
		});
		
	}
	
	return SaveIdModal;
})(SaveIdModal);