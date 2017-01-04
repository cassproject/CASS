/**
 * Handles adding a new field to the RepoEdit Container on RepoCreateScreen
 * and RepoViewScreen.
 * 
 * TODO: Need to fix and make work better
 * 
 * @module cass.manager
 * @class AddFieldModal
 * 
 * @author devlin.junker@eduworks.com
 */
var AddFieldModal = (function(AddFieldModal){	
	
	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf AddFieldModal
	 * @method display
	 * @param {String} containerId
	 * 			The DOM ID of the Modal Container this modal is displayed in
	 */
	AddFieldModal.prototype.display = function(containerId)
	{
		var addingTo = this.field;
		
		var dataEdit = ViewManager.getView(this.repoEditContainerId);
		
		ViewManager.showView(new MessageContainer("addField"), "#addFieldMessageContainer");
		
		if (addingTo.children("ul").length > 0)
			$(".objectProperties").hide();
		else
			$(".objectProperties").show();
		
		if(dataEdit != undefined)
		{
			$( "#addFieldModalText" ).click(function(){   
				var fieldName = $("#addFieldModalName").val();
				
				if(fieldName != "" )
				{
					ViewManager.getView("#addFieldMessageContainer").clearAlert("emptyText");
					if(addingTo.find("[field="+fieldName+"]").size() > 0){
						ViewManager.getView("#addFieldMessageContainer").displayAlert("Field with that name already exists", "exists");
					}else{
						dataEdit.addField(addingTo, fieldName, "value");
						ModalManager.hideModal();
					}
				}
				else if(addingTo.children("ul").length > 0){
					dataEdit.addField(addingTo, fieldName, "value");
					ModalManager.hideModal();
				}
				else
				{
					ViewManager.getView("#addFieldMessageContainer").displayAlert("Unable to add Text without a field name", "emptyText");
				}
			});

			$( "#addFieldModalArray" ).click(function(){ 
				var fieldName = $("#addFieldModalName").val();
				
				if(fieldName != "")
				{
					ViewManager.getView("#addFieldMessageContainer").clearAlert("emptyArr");
					if(addingTo.find("[field="+fieldName+"]").size() > 0){
						ViewManager.getView("#addFieldMessageContainer").displayAlert("Field with that name already exists", "exists");
					}else{
						dataEdit.addField(addingTo, fieldName, new Array());
						ModalManager.hideModal();
					}
				}
				else if(addingTo.children("ul").length > 0 )
				{
					dataEdit.addField(addingTo, fieldName, new Array());
					ModalManager.hideModal();
				}
				else
				{
					ViewManager.getView("#addFieldMessageContainer").displayAlert("Unable to add Array without a field name", "emptyArr");
				}
			});

			$( "#addFieldModalJsonLd" ).click(function(){ 
				var fieldName = $("#addFieldModalName").val();

				
				if(fieldName != "" || addingTo.children("ul").length > 0)
				{
					ViewManager.getView("#addFieldMessageContainer").clearAlert("emptyObj");
					if(fieldName != "" && addingTo.find("[field="+fieldName+"]").size() > 0 && addingTo.children("ul").length == 0){
						ViewManager.getView("#addFieldMessageContainer").displayAlert("Field with that name already exists", "exists");
						return;
					}
					
					$("#typeSelectRow").removeClass("hide");
					
					$("#addBtn").click(function(){
						if(fieldName != "" && addingTo.find("[field="+fieldName+"]").size() > 0){	
							ViewManager.getView("#addFieldMessageContainer").displayAlert("Field with that name already exists", "exists");
						}
						
						else if(fieldName != "" || addingTo.children("ul").length > 0)
						{
							var t = new Thing();
							dataEdit.addField(addingTo, fieldName, t.toJson());
							ModalManager.hideModal();
						}
						else
						{
							ViewManager.getView("#addFieldMessageContainer").displayAlert("Unable to add Object without a field name", "emptyObj");
						}
					})
				}
				else
				{
					ViewManager.getView("#addFieldMessageContainer").displayAlert("Unable to add Object without a field name", "emptyObj");
				}
			});
		}
		else
		{
			ViewManager.getView("#addFieldMessageContainer").displayAlert("Unable to add Field, are you sure you're on the right page?", "addField");
		}
		
		
		$("#addFieldModalCancel").click(function(){
			ModalManager.hideModal();
		})
		
	}
	
	return AddFieldModal;
})(AddFieldModal);