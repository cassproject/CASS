/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
var AddServerModal = (function(AddServerModal){	
	var ERROR_CONTAINER_ID = "#loginError";
	
	function submitAddServer(onClose){
		var name = $("#addServerName").val();
		var url = $("#addServerUrl").val();
		
		AppController.serverController.addServer(name, url, function(){
			AppController.serverController.selectServer(name);			
			AppMenu.prototype.setCurrentServer();
			
			ModalManager.hideModal();
			
			onClose();
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
	
	AddServerModal.prototype.display = function(containerId, callback)
	{
		var closeCallback = this.onClose;
		
		$(containerId).load("partial/modal/addServer.html", function(){
			clearError();
			
			$("#addServerForm").submit(function(event){
				event.preventDefault();
				submitAddServer(closeCallback);
			});
			
			$("#addServerCancel").click(function(event){
				event.preventDefault();
				ModalManager.hideModal();
				closeCallback();
			});
			
			if(callback != undefined)
				callback();
		});
	}
	
	return AddServerModal;
})(AddServerModal);