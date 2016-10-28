var AddCompetenciesToFrameworkModal = (function(AddCompetenciesToFrameworkModal){
	
	function displayError(err)
	{
		ViewManager.getView("#addToFrameworkMessageContainer").displayAlert(err);
	}
	function clearError()
	{
		ViewManager.getView("#addToFrameworkMessageContainer").clearAlert();
	}
	
	function buildFrameworkOption(framework){
		var option = $("<option></option>");
		option.val(framework.id);
		option.text(framework.name + (framework.owner == undefined ? " (Public)": ""));
		
		return option;
	}
	
	AddCompetenciesToFrameworkModal.prototype.display = function(containerId)
	{
		var data = this.data;
		
		var saveCallback = this.saveCallback;
		
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