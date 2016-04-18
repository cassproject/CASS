/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
var ChangeServerModal = (function(ChangeServerModal){	
	var ERROR_CONTAINER_ID = "#changeServerError";
	
	function submitChange(){
		var server = $("#newServer").val();
		
		AppController.serverController.selectServer(server, function(){
			AppMenu.prototype.setCurrentServer();
			ModalManager.hideModal();
		}, displayError);
	}
	function displayError(err)
	{
		$(ERROR_CONTAINER_ID).text(err);
		$(ERROR_CONTAINER_ID).removeClass("hide");
	}
	function clearError()
	{
		$(ERROR_CONTAINER_ID).addClass("hide");
	}
	
	ChangeServerModal.prototype.display = function(containerId, callback)
	{
		var view = this;
		
		$(containerId).load("partial/modal/changeServer.html", function(){
			clearError();
			
			$("#changeServerCurrentServer").text(AppController.serverController.selectedServerName);
			$("#changeServerCurrentServer").attr('title', AppController.serverController.selectedServerUrl);
			
			if($(AppController.serverController.serverList).size() > 0 ){
				$("#newServer").html("");
				for(var serverName in AppController.serverController.serverList){
					var serverUrl = AppController.serverController.serverList[serverName];
					
					var option = $("<option></option>");
					
					if(serverName == AppController.serverController.selectedServerName)
						option.attr("selected", "selected")
					option.attr("value", serverUrl);
					option.text(serverName);
					
					$("#newServer").append(option);
				}
			}
			
			if(LoginController.getLoggedIn()){
				displayError("Cannot change server when logged in, please log out to continue");
				
				$("#newServer").attr("disabled", "disabled");
				
				$("#changeServerForm").submit(function(event){
					event.preventDefault();
					return;
				});
			}
			else
			{
				$("#addServer").click(function(){
					ModalManager.showModal(new AddServerModal(function(){
						ModalManager.showModal(new ChangeServerModal());
					}));
				});
				
				$("#changeServerForm").submit(function(event){
					event.preventDefault();
					submitChange();
				});
			}
			
			$("#changeServerCancel").click(function(event){
				event.preventDefault();
				ModalManager.hideModal();
			});
			
			if(callback != undefined)
				callback();
		});
	}
	
	return ChangeServerModal;
})(ChangeServerModal);