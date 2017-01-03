/**
 * Modal for adding the competencies passed in to the constructor to a framework
 * that is selected from a dropdown list in the modal.
 * 
 * @module cass.manager
 * @class AddCompetenciesToFrameworkModal
 * 
 * @author devlin.junker@eduworks.com
 */
var AddCompetenciesToFrameworkModal = (function(AddCompetenciesToFrameworkModal){
	
	/**
	 * Adds an error message in the MessageContainer Alert Box
	 * 
	 * @memberOf AddCompetenciesToFrameworkModal
	 * @method displayError
	 * @private
	 * @param {String} err
	 * 			Error to display 
	 */
	function displayError(err) {
		ViewManager.getView("#addToFrameworkMessageContainer").displayAlert(err);
	}
	
	/**
	 * Clears the error message in the MessageContainer Alert Box
	 * 
	 * @memberOf AddCompetenciesToFrameworkModal
	 * @method clearError
	 * @private
	 */
	function clearError()
	{
		ViewManager.getView("#addToFrameworkMessageContainer").clearAlert();
	}
	
	/**
	 * @memberOf AddCompetenciesToFrameworkModal
	 * @method buildFrameworkOption
	 * @private
	 * @param {EcFramework} framework
	 * 			The Framework to build on option for
	 */
	function buildFrameworkOption(framework){
		var option = $("<option></option>");
		option.val(framework.id);
		option.text(framework.name + (framework.owner == undefined ? " (Public)": ""));
		
		return option;
	}
	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf AddCompetenciesToFrameworkModal
	 * @method display
	 * @param {String} containerId
	 * 			The DOM ID of the Modal Container this modal is displayed in
	 */
	AddCompetenciesToFrameworkModal.prototype.display = function(containerId)
	{
		var data = this.data;
		

		ViewManager.showView(new MessageContainer("addToFramework"), "#addToFrameworkMessageContainer");
		
		EcFramework.search(AppController.repoInterface, "*", function(frameworks){
			for(var i in frameworks){
				if(AppController.identityController.canEdit(frameworks[i])){
					$("#addToFrameworkList").append(buildFrameworkOption(frameworks[i]));
				}
			}
			
			if($("#addToFrameworkList option").size() == 0){
				$("#addToFrameworkList").append("<option selected>Unable to add Competencies to any Frameworks</option>");
				$("#addToFrameworkList").attr("disabled", "disabled");
				
				ViewManager.getView("#addToFrameworkMessageContainer").displayAlert("Must have editing priviledges on a framework to add competencies");
			}
		}, displayError)
		
		$("#addToFrameworkSave").click(function(ev){
			ev.preventDefault();
			
			var id = $("#addToFrameworkList").val();
			
			EcFramework.get(id, function(result){
				if(data instanceof Array){
					for(var i in data){
						result.addCompetency(data[i].id);
					}
				}else{
					
				}
				
				result.save(function(){
					ModalManager.hideModal();
					ScreenManager.changeScreen(new FrameworkViewScreen(result));
				},displayError)
			}, displayError);
			
			
			
		});
		
		$("#addToFrameworkCancel").click(function(){
			ModalManager.hideModal();
		})
	}
	
	return AddCompetenciesToFrameworkModal;
})(AddCompetenciesToFrameworkModal);