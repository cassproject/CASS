/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
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