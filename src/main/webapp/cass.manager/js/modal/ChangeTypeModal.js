/**
 * TODO: Need to fix and make work better
 * 
 * @module cass.manager
 * @class ChangeTypeModal
 * 
 * @author devlin.junker@eduworks.com
 */
var ChangeTypeModal = (function(ChangeTypeModal){	
	
	/**
	 * Adds an error message in the MessageContainer Alert Box
	 * 
	 * @memberOf ChangeTypeModal
	 * @method displayError
	 * @private
	 * @param {String} err
	 * 			Error to display 
	 */
	function displayError(err)
	{
		ViewManager.getView("#changeTypeMessageContainer").displayAlert(err);
	}
	
	/**
	 * Clears the error message in the MessageContainer Alert Box
	 * 
	 * @memberOf ChangeTypeModal
	 * @method clearError
	 * @private
	 */
	function clearError()
	{
		ViewManager.getView("#changeTypeMessageContainer").clearAlert();
	}
	
	var typeSelected = {};
	
	/**
	 * Builds the select option for each type passed in to
	 * this method
	 * 
	 * @memberOf ChangeTypeModal
	 * @method addOptionToTypeSelect
	 * @private
	 * @param {Object} obj
	 * 			Empty instance of a type to be displayed
	 */
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
				obj.generateId(AppController.serverController.getRepoInterface().selectedServer)
			dataEdit.changeObject(obj);
		};
	}
	
	/**
	 * Connects with DataEdit View on RepoEdit/RepoViewScreen's and changes 
	 * the type once a new one has been selected in this modal
	 * 
	 * @memberOf ChangeTypeModal
	 * @method submitChangeType
	 * @private
	 * @param {DataEdit} dataEdit
	 * 			DataEdit View to interact with
	 */
	function submitChangeType(changeObj, dataEdit){
		var type = $("#changeTypeSelect").val();
		
		if(typeSelected[type] != undefined){
			typeSelected[type](addingTo, dataEdit);
			ModalManager.hideModal();
		}else{
			var context = $("#changeTypeOtherSchemaInput").val();
			var otherType = $("#changeTypeOtherInput").val();
			if(otherType != undefined && otherType != "" && context != undefined && context != ""){
				
				dataEdit.changeType(changeObj, context, otherType)

				
				ModalManager.hideModal();
			}else{
				displayError("Cannot Set Blank Context or Type")
			}
		}
	}
	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf ChangeTypeModal
	 * @method display
	 * @param {String} containerId
	 * 			The DOM ID of the Modal Container this modal is displayed in
	 */
	ChangeTypeModal.prototype.display = function(containerId)
	{	
		typeSelected = [];
		
		var changeObj = this.changeObj;
		
		var dataEdit = ViewManager.getView(this.repoEditContainerId);
		
		
		ViewManager.showView(new MessageContainer("changeType"), "#changeTypeMessageContainer");
		
		var thing = new Thing();
		thing.name = "New Thing";
		addOptionToTypeSelect(thing);
		
		if(dataEdit != undefined){
			$("#changeTypeSelect").change(function(){
				if($("#changeTypeSelect").val() == "other"){
					$("#changeTypeOtherContainer").removeClass("hide");
				}else{
					$("#changeTypeOtherContainer").addClass("hide");
				}
			});
			
			$("#changeTypeSubmit").click(function(){
				submitChangeType(changeObj, dataEdit);
			});
		}else{
			$("#changeTypeSelect").attr("disabled", "disabled")
			
			ViewManager.getView("#changeTypeMessageContainer").displayAlert("Unable to change type, are you one the right screen?");
		}
			
		
		
		
		
		$("#changeTypeCancel").click(function(){
			ModalManager.hideModal();
		})
		
	}
	
	return ChangeTypeModal;
})(ChangeTypeModal);