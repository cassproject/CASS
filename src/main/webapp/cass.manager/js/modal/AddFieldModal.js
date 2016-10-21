var AddFieldModal = (function(AddFieldModal){	
	
	function displayError(err, errId)
	{
		ViewManager.getView("#addFieldMessageContainer").displayAlert(err, errId);
	}
	function clearError()
	{
		ViewManager.getView("#addFieldMessageContainer").clearAlert();
	}
	
	AddFieldModal.prototype.display = function(containerId)
	{
		var addingTo = this.field;
		
		var dataEdit = ViewManager.getView(this.repoEditContainer);
		
		ViewManager.showView(new MessageContainer("addField"), "#addFieldMessageContainer");
		
		if (addingTo.children("ul").length > 0)
			$(".objectProperties").hide();
		else
			$(".objectProperties").show();
		
		if(dataEdit != undefined)
		{
			$( "#addFieldModalText" ).click(function(){   
				var fieldName = $("#addFieldModalName").val();
				
				if(fieldName != "" || addingTo.children("ul").length > 0 )
				{
					dataEdit.addField(addingTo, fieldName, "value");
					ModalManager.hideModal();
				}
				else
				{
					displayError("Unable to add Text without a field name", "addField");
				}
			});

			$( "#addFieldModalArray" ).click(function(){ 
				var fieldName = $("#addFieldModalName").val();
				
				if(fieldName != "" || addingTo.children("ul").length > 0 )
				{
					dataEdit.addField(addingTo, fieldName, new Array());
					ModalManager.hideModal();
				}
				else
				{
					displayError("Unable to add Array without a field name", "addField");
				}
			});

			$( "#addFieldModalObject" ).click(function(){  
				var fieldName = $("#addFieldModalName").val();
				
				if(fieldName != "" || addingTo.children("ul").length > 0 )
				{
					dataEdit.addField(addingTo, fieldName, "{}");
					ModalManager.hideModal();
				}
				else
				{
					displayError("Unable to add Object without a field name", "addField");
				}
			});

			$( "#addFieldModalDecal" ).click(function(){ 
				var fieldName = $("#addFieldModalName").val();
				
				if(fieldName != "" || addingTo.children("ul").length > 0 )
				{
					var t = new Thing();
					dataEdit.addField(addingTo, fieldName, t.toJson());
					ModalManager.hideModal();
				}
				else
				{
					displayError("Unable to add DECAL without a field name", "addField");
				}
			});
		}
		else
		{
			displayError("Unable to add Field, are you sure you're on the right page?", "addField");
		}
		
		
		$("#addFieldModalCancel").click(function(){
			ModalManager.hideModal();
		})
		
	}
	
	return AddFieldModal;
})(AddFieldModal);