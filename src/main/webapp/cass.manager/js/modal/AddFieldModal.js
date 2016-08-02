var AddFieldModal = (function(AddFieldModal){	
	var ERROR_CONTAINER_ID = "#loginError";
	
	function displayError(err)
	{
		$(ERROR_CONTAINER_ID).text(err);
		$(ERROR_CONTAINER_ID).show();
	}
	function clearError()
	{
		$(ERROR_CONTAINER_ID).hide();
	}
	
	AddFieldModal.prototype.display = function(containerId, callback)
	{
		var addingTo = this.field;
		
		var dataEdit = ViewManager.getView(this.repoEditContainer);
		
		$(containerId).load("partial/modal/addField.html", function(){
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
						displayError("");
					}
				});

				$( "#addFieldModalArray" ).click(function(){ 
					var fieldName = $("#addFieldModalName").val();
					
					if(fieldName != "" || addingTo.children("ul").length > 0 )
					{
						dataEdit.addField(addingTo, fieldName, "[]");
						ModalManager.hideModal();
					}
					else
					{
						displayError("");
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
						displayError("");
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
						displayError("");
					}
				});
			}
			else
			{
				displayError("");
			}
			
			
			$("#addFieldModalCancel").click(function(){
				ModalManager.hideModal();
			})
			
			if(callback != undefined)
				callback();
		});
	}
	
	return AddFieldModal;
})(AddFieldModal);