var ChangeTypeModal = (function(ChangeTypeModal){	
	
	function displayError(err)
	{
		ViewManager.getView("#changeTypeMessageContainer").displayAlert(err);
	}
	function clearError()
	{
		ViewManager.getView("#changeTypeMessageContainer").clearAlert();
	}
	
	var typeSelected = {};
	
	function addOptionToTypeSelect(obj){
		if(obj.type == null || obj.context == null)
			return;
		
		var option = $("<option></option>");
		option.text(obj.type);
		option.attr("value", obj.type);
		option.attr('selected', 'selected')
		
		$("#changeTypeSelect").prepend(option);
		
		typeSelected[obj.type] = function(dataEdit){
			if(obj.generateId != undefined)
				obj.generateId(AppController.repoInterface.selectedServer)
			dataEdit.changeObject(obj);
		};
	}
	
	function submitChangeType(dataEdit){
		var type = $("#changeTypeSelect").val();
		
		if(typeSelected[type] != undefined){
			typeSelected[type](dataEdit);
			ModalManager.hideModal();
		}else{
			var context = $("#changeTypeOtherSchemaInput").val();
			var otherType = $("#changeTypeOtherInput").val();
			if(otherType != undefined && otherType != "" && context != undefined && context != ""){
				dataEdit.changeType(context, otherType);
				ModalManager.hideModal();
			}else{
				displayError("Cannot Set Blank Context or Type")
			}
		}
	}
	
	ChangeTypeModal.prototype.display = function(containerId)
	{	
		typeSelected = [];
		var dataEdit = ViewManager.getView(this.repoEditContainer);
		
		ViewManager.showView(new MessageContainer("changeType"), "#changeTypeMessageContainer");
		
		var thing = new Thing();
		thing.name = "New Thing";
		addOptionToTypeSelect(thing);
		
		if(dataEdit != undefined)
		{
			$("#changeTypeSubmit").click(function(){
				submitChangeType(dataEdit);
			});
		}
		else
		{
			displayError("Cannot Change Type, are you sure you're on the right screen?");
		}
		
		$("#changeTypeSelect").change(function(){
			if($("#changeTypeSelect").val() == "other"){
				$("#changeTypeOtherContainer").removeClass("hide");
			}else{
				$("#changeTypeOtherContainer").addClass("hide");
			}
		});
		
		
		$("#changeTypeCancel").click(function(){
			ModalManager.hideModal();
		})
		
	}
	
	return ChangeTypeModal;
})(ChangeTypeModal);