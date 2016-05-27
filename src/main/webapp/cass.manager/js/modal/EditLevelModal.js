/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
var EditLevelModal = (function(EditLevelModal){	
	
	function createContactSmall(pem)
	{
		var ident = AppController.identityController.lookup(pem);
	    return '<span class="ownershipDisplay has-tip" tabindex>'
	    	+ '<span class="qrcodeCanvas"></span>'
	    	+ '<span class="contactText" title="'+pem+'">'+ident.displayName+'</span>'
	    	+ '</span>';
	}
	
	function saveLevelFail(err){
		if(err == undefined)
			err = "Unable to Connect to Server to Save Level";
		
		ViewManager.getView("#editLevelError").displayAlert(err);
	}
	
	function errorDeleting(err){
		if(err == undefined)
			err = "Unable to Connect to Server to Delete Level";
		
		ViewManager.getView("#editLevelError").displayAlert(err);
	}
	
	EditLevelModal.prototype.display = function(containerId, callback)
	{
		var data = this.data;
		var modalCloseCallback = this.closeCallback;
		
		$(containerId).load("partial/modal/editLevel.html", function(){
			
			ViewManager.showView(new MessageContainer("editLevel"), "#editLevelError", function(){
				if(AppController.identityController.selectedIdentity == undefined && data.isA(EcCompetency.myType))
				{
					ViewManager.getView("#editLevelError").displayWarning("You are Creating a Public Level, this level can be modified by anyone");
				}
			});
			
			$("#editLevelCancel").click(function(event){
				event.preventDefault();
				ModalManager.hideModal();
			});
			
			if(data.isA(EcCompetency.myType))
			{
				if(AppController.identityController.selectedIdentity != undefined)
				{
					$("#editLevelOwnership").text("");
					
					var pem = AppController.identityController.selectedIdentity.ppk.toPk().toPem()
					
					var contact = $(createContactSmall(pem));
					$("#editLevelOwnership").append(contact);            
		    		contact.children(".qrcodeCanvas").qrcode({
		                width:128,
		                height:128,
		                text:forge.util.decode64(pem.replaceAll("-----.*-----","").trim())
		            });   
				}
				
				$("#editLevelDelete").remove();
				
				$("#editLevelSubmit").click(function(event){
					event.preventDefault();
					
					var level = new EcLevel();
					if(AppController.identityController.selectedIdentity != undefined){
						level.addOwner(AppController.identityController.selectedIdentity.ppk.toPk());
					}
					level.generateId(AppController.serverController.selectedServerUrl)
					level.name = $("#editLevelName").val();
					level.title = $("#editLevelTitle").val();
					level.description = $("#editLevelDescription").val();
					level.performance = $("#editLevelPerformance").val();
					level.competency = data.shortId();
					
					
					if(level.name == undefined || level.name == ""){
						ViewManager.getView("#editLevelError").displayAlert("Level Requires a Name to be Saved");
						return;
					}
					
					EcRepository.save(level, function(){
						if(modalCloseCallback != undefined)
							modalCloseCallback(level);
						
						ModalManager.hideModal();
					}, saveLevelFail);
				})
			}
			else if(data.isA(EcLevel.myType))
			{
				$("#editLevelDelete").removeClass("hide");
				
				$("#editLevelSubmit").text("Save");
				
				$("#editLevelName").val(data.name);
				$("#editLevelTitle").val(data.title);
				$("#editLevelDescription").val(data.description);
				$("#editLevelPerformance").val(data.performance);
				
				if(data.owner != undefined && data.owner.length > 0)
				{
					$("#editLevelOwnership").text("");
					
					for(var i = 0; i < data.owner.length; i++)
					{	
						var pem = data.owner[i];
						
						var contact = $(createContactSmall(pem));
						$("#editLevelOwnership").append(contact);            
			    		contact.children(".qrcodeCanvas").qrcode({
			                width:128,
			                height:128,
			                text:forge.util.decode64(pem.replaceAll("-----.*-----","").trim())
			            });   
					}
				}
				
				var canEdit = false;
				for(var index in EcIdentityManager.ids){
					var pk = EcIdentityManager.ids[index].ppk.toPk()
					if(data.canEdit(pk))
						canEdit = true;
				}
				if(data.owner == undefined || data.owner.length == 0)
					canEdit = true;
				
				if(canEdit)
				{
					$("#editLevelModalTitle").text("Edit Level");
					
					$("#editLevelSubmit").click(function(event){
						event.preventDefault();
						
						data.name = $("#editLevelName").val();
						data.title = $("#editLevelTitle").val();
						data.description = $("#editLevelDescription").val();
						data.performance = $("#editLevelPerformance").val();
						
						if(data.name == undefined || data.name == ""){
							ViewManager.getView("#editLevelError").displayAlert("Level Requires a Name to be Saved");
							return;
						}
						
						var url = data.id;
						var split = url.split("\/");
						if (split[split.length-4] == "data") 
							split[split.length-1] = new Date().getTime();
						data.id = split.join("/");
						
						EcRepository.save(data, function(level){
							if(modalCloseCallback != undefined)
								modalCloseCallback(data);
							
							ModalManager.hideModal();
						}, saveLevelFail);
					});
					
					$("#editLevelDelete").click(function(event){
						event.preventDefault();
						
						EcRepository._delete(data, function(){
							if(modalCloseCallback != undefined)
								modalCloseCallback(null);
							ModalManager.hideModal();
						}, errorDeleting);
					})
				}
				else
				{
					$("#editLevelModalTitle").text("View Level");
					
					$("#editLevelDelete").remove();
					$("#editLevelSubmit").remove();
					$("#editLevelCancel").remove();
					
					$("#editLevelName").attr("disabled", "disabled");
					$("#editLevelTitle").attr("disabled", "disabled");
					$("#editLevelDescription").attr("disabled", "disabled");
					$("#editLevelPerformance").attr("disabled", "disabled");
				}
			}
			else
			{
				ViewManager.getView("#editLevelError").displayAlert("Unrecognized Context For Level Modal");
				$("#editLevelName").attr("disabled", "disabled");
				$("#editLevelTitle").attr("disabled", "disabled");
				$("#editLevelDescription").attr("disabled", "disabled");
				$("#editLevelPerformance").attr("disabled", "disabled");
				
				$("#editLevelSubmit").click(function(event){
					event.preventDefault();
				});
			}
			
			
			
			if(callback != undefined)
				callback();
		});
	}
	
	return EditLevelModal;
})(EditLevelModal);