var AddCompetenciesToFrameworkModal = (function(AddCompetenciesToFrameworkModal){
	
	AddCompetenciesToFrameworkModal.prototype.display = function(containerId)
	{
		var data = this.data;
		
		var saveCallback = this.saveCallback;
		
		ViewManager.showView(new MessageContainer("addToFramework"), "#addToFrameworkMessageContainer");
		
		EcFramework.search(AppController.repoInterface, "*", function(frameworks){
			for(var i in frameworks){
				if(AppController.identityController.canEdit(frameworks[i])){
					$("#addToFrameworkList").append("<option value='"+frameworks[i].id+"'>"+frameworks[i].name+(frameworks[i].owner == undefined ? " (Public)": "")+"</option>");
				}
			}
			
			if($("#addToFrameworkList option").size() == 0){
				$("#addToFrameworkList").append("<option selected>Unable to add Competencies to any Frameworks</option>");
				$("#addToFrameworkList").attr("disabled", "disabled");
				
				ViewManager.getView("#addToFrameworkMessageContainer").displayAlert("Must have editing priviledges on a framework to add competencies");
			}
		}, function(err){
			
		})
		
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
				},function(err){
					
				})
			}, function(err){
				
			});
			
			
			
		});
		
		$("#addToFrameworkCancel").click(function(){
			ModalManager.hideModal();
		})
	}
	
	return AddCompetenciesToFrameworkModal;
})(AddCompetenciesToFrameworkModal);