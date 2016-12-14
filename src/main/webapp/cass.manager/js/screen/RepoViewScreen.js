/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
/**
 * Screen that handles searching Viewing a raw repository object
 * lists types of objects available in repository to be used as a paremter of search
 * 
 * @module cass.manager
 * @class RepoViewScreen
 * 
 * @author devlin.junker@eduworks.com
 */
RepoViewScreen = (function(RepoViewScreen){
	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf RepoViewScreen
	 * @method display
	 * @param containerId
	 * 			Screen Container DOM ID
	 */
	RepoViewScreen.prototype.display = function(containerId)
	{
		var data = this.data
		
		if(data.id != null)
		{
			ScreenManager.setScreenParameters( {"id":data.id} )
		}
	
		$("#repoViewSearchBtn").attr("href", "#"+RepoSearchScreen.prototype.displayName);
		$("#repoViewSearchBtn").click(function(event){
			event.preventDefault();
			ScreenManager.changeScreen(new RepoSearchScreen(data))
		});
		
		if(!AppController.identityController.owns(data) && !AppController.loginController.getAdmin()){
			$("#repoViewDeleteBtn").remove();
		}else{
			$("#repoViewDeleteBtn").click(function(){
				ModalManager.showModal(new ConfirmModal(function(){
					EcRepository._delete(data, function(){
						ScreenManager.changeScreen(new RepoSearchScreen());
						ModalManager.hideModal();
					}, function(err){
						if(err == undefined)
							err = "Unable to connect to server to delete item";
						ViewManager.getView("#repoViewMessageContainer").displayAlert(err)
					});
	        	}, "Are you sure you want to delete this object?"))
			})
		}
		
		$("#repoViewBtn").click(function(event){
			event.preventDefault();
		})
		
		EcRepository.get(data.id, function (result) {
            data = result;
            ViewManager.showView(new RepoEdit(data, "#repoViewSaveBtn", "#repoViewMessageContainer"), "#repoViewResult");
        }, function(err){
        	if(err == undefined)
        		err = "Unable to get object from repository";
        	
        	ViewManager.getView("#repoViewMessageContainer").displayAlert(err)
        });
	};
	
	return RepoViewScreen;
})(RepoViewScreen);