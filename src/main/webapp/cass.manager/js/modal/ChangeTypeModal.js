/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
var ChangeTypeModal = (function(ChangeTypeModal){	
	var ERROR_CONTAINER_ID = "#changeTypeError";
	
	function displayError(err)
	{
		$(ERROR_CONTAINER_ID).text(err);
		$(ERROR_CONTAINER_ID).show();
	}
	function clearError()
	{
		$(ERROR_CONTAINER_ID).hide();
	}
	
	var typeSelected = {};
	
	function addOptionToTypeSelect(obj){
		if(obj.type == null || obj.schema == null)
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
			var schema = $("#changeTypeOtherSchemaInput").val();
			var otherType = $("#changeTypeOtherInput").val();
			if(otherType != undefined && otherType != "" && schema != undefined && schema != ""){
				dataEdit.changeType(schema, otherType);
				ModalManager.hideModal();
			}else{
				displayError("Cannot Set Blank Schema or Type")
			}
		}
	}
	
	ChangeTypeModal.prototype.display = function(containerId, callback)
	{	
		typeSelected = [];
		var dataEdit = ViewManager.getView(this.repoEditContainer);
		
		$(containerId).load("partial/modal/changeType.html", function(){
			
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
				displayError("");
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
			
			if(callback != undefined)
				callback();
		});
	}
	
	return ChangeTypeModal;
})(ChangeTypeModal);