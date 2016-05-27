/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
var CreateUserModal = (function(CreateUserModal){
	function submitCreateForm(view){
		ViewManager.getView("#createMessageContainer").clearAlert("createFail");
		
		var server = $("#createServer").val()
		
		AppController.serverController.selectServer(server);
		
		AppController.loginController.create(
		        $("#createUsername").val(),
		        $("#createPassword").val(),
		        function(){
		        	ModalManager.hideModal();
		    		ViewManager.getView(AppController.topBarContainerId).setLoggedIn();
		    		ScreenManager.changeScreen(new UserIdentityScreen());
		    		
		    		AppController.serverController.selectServer($("#createServer").val());
		        },
		        function(err){
		        	if(err == undefined)
		        		err = "Unable to Connect to Server to Create User";
		        	
		        	ViewManager.getView("#createMessageContainer").displayAlert(err, "createFail");
		        }		       
		    );
	}
	
	CreateUserModal.prototype.display = function(containerId, callback)
	{
		var view = this;
		$(containerId).load("partial/modal/createUser.html", function(){
			ViewManager.showView(new MessageContainer("createUser"), "#createMessageContainer");
			
			if($(AppController.serverController.serverList).size() > 0 ){
				$("#createServer").html("");
			}
			for(var serverName in AppController.serverController.serverList){
				var serverUrl = AppController.serverController.serverList[serverName];
				
				var option = $("<option></option>");
				option.attr("value", serverUrl);
				option.text(serverName);
				
				if(serverName == AppController.serverController.selectedServerName)
					option.attr("selected", "selected")
				
				$("#createServer").append(option);
			}
			
			$("#createAddServer").click(function(){
				ModalManager.showModal(new AddServerModal(function(){
					ModalManager.showModal(new CreateUserModal());
				}));
			});
			
			$("#createForm").submit(function(event){
				event.preventDefault();
				submitCreateForm(view);
			})
			
			if(callback != undefined)
				callback();
		});
	}
	
	return CreateUserModal;
})(CreateUserModal);