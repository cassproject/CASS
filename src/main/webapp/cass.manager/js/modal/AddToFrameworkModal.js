/**
 * Modal for adding the competencies passed in to the constructor to a framework
 * that is selected from a dropdown list in the modal.
 * 
 * @module cass.manager
 * @class AddToFrameworkModal
 * 
 * @author devlin.junker@eduworks.com
 */
var AddToFrameworkModal = (function(AddToFrameworkModal){
	
	/**
	 * Adds an error message in the MessageContainer Alert Box
	 * 
	 * @memberOf AddToFrameworkModal
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
	 * @memberOf AddToFrameworkModal
	 * @method clearError
	 * @private
	 */
	function clearError()
	{
		ViewManager.getView("#addToFrameworkMessageContainer").clearAlert();
	}
	
	/**
	 * @memberOf AddToFrameworkModal
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
	 * @memberOf AddToFrameworkModal
	 * @method display
	 * @param {String} containerId
	 * 			The DOM ID of the Modal Container this modal is displayed in
	 */
	AddToFrameworkModal.prototype.display = function(containerId)
	{
		var data = this.data;
		
		ViewManager.showView(new MessageContainer("addToFramework"), "#addToFrameworkMessageContainer", function(){
			if(data instanceof Array){
				var competencies = false;
				var relations = false; 
				var unknown = false;
				
				for(var i in data){
					if(data[i].type != undefined){
						if((new EcCompetency()).getTypes().indexOf(data[i].getFullType()) != -1){
							competencies = true;
						}else if((new EcAlignment()).getTypes().indexOf(data[i].getFullType()) != -1){
							relations = true;
						}else{
							unknown = true;
							ViewManager.getView("#addToFrameworkMessageContainer").displayWarning("Unsure how to add object ("+data[i].id+") with type ("+data[i].type+") to framework", "unknownType");
						}
					}else{
						unknown = true;
						ViewManager.getView("#addToFrameworkMessageContainer").displayWarning("Unsure how to add object ("+data[i].id+") with no type to framework", "noType");
					}
				}
				
				if(unknown || (relations && competencies)){
					if(data.length > 1){
						$("#dataDescription").text("the objects")
					}else{
						$("#dataDescription").text("the object")
					}
				}else if(relations){
					if(data.length > 1){
						$("#dataDescription").text("the relations")
					}else{
						$("#dataDescription").text("the relation")
					}
				}else if(competencies){
					if(data.length > 1){
						$("#dataDescription").text("the competencies")
					}else{
						$("#dataDescription").text("the competency");
					}
					
				}
			}else if(data.id != undefined){
				if(data.type != undefined){
					if(EcCompetency.getTypes().indexOf(data.getFullType()) != -1){
						$("#dataDescription").text("the competency");
					}else if(EcAlignment.getTypes().indexOf(data.getFullType()) != -1){
						$("#dataDescription").text("the relation");
					}else{
						ViewManager.getView("#addToFrameworkMessageContainer").displayWarning("Unsure how to add object ("+data[i].id+") with type ("+data[i].type+") to framework", "unknownType");
					}
				}else{
					ViewManager.getView("#addToFrameworkMessageContainer").displayWarning("Unsure how to add object ("+data[i].id+") with no type to framework", "noType");
				}
				
			}
		});
		
		
		EcFramework.search(AppController.serverController.getRepoInterface(), "*", function(frameworks){
			$("#addToFrameworkList").html();
			for(var i in frameworks){
				if(AppController.identityController.canEdit(frameworks[i])){
					$("#addToFrameworkList").append(buildFrameworkOption(frameworks[i]));
				}
			}
			
			if($("#addToFrameworkList option").size() == 0){
				$("#addToFrameworkList").append("<option selected>Unable to add to any Frameworks</option>");
				$("#addToFrameworkList").attr("disabled", "disabled");
				
				ViewManager.getView("#addToFrameworkMessageContainer").displayAlert("Must have editing priviledges on a framework to add competencies");
			}
		}, displayError);
		
		$("#addToFrameworkSave").click(function(ev){
			ev.preventDefault();
			
			var id = $("#addToFrameworkList").val();
			
			EcFramework.get(id, function(result){
				if(data instanceof Array){
					for(var i in data){
						if(data[i].type != undefined){
							if((new EcCompetency()).getTypes().indexOf(data[i].getFullType()) != -1){
								result.addCompetency(data[i].id);
							}else if((new EcAlignment()).getTypes().indexOf(data[i].getFullType()) != -1){
								result.addRelation(data[i].id)
							}else{
								
							}
						}else{
							ViewManager.getView("#addToFrameworkMessageContainer").displayWarning("Unsure how to add object ("+data[i].id+") with unknown type to framework", "unknownType");
						}
					}
				}else if(data.id != undefined){
					if(data.type != undefined){
						if((new EcCompetency()).getTypes().indexOf(data.getFullType()) != -1){
							result.addCompetency(data.id);
						}else if((new EcAlignment()).getTypes().indexOf(data.getFullType()) != -1){
							result.addRelation(data.id)
						}else{
							return;
						}
					}else{
						result.addCompetency(data.id);
					}
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
	
	return AddToFrameworkModal;
})(AddToFrameworkModal);