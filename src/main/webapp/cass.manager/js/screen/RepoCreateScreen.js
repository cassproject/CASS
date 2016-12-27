/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
/**
 * Screen that handles editing Raw objects from Repository,
 * uses the RepoEdit View to handle editing
 * 
 * @module cass.manager
 * @class RepoCreateScreen
 * 
 * @author devlin.junker@eduworks.com
 */
RepoCreateScreen = (function(RepoCreateScreen){
	
	 /**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf RepoCreateScreen
	 * @method display
	 * @param containerId
	 * 			Screen Container DOM ID
	 */
	RepoCreateScreen.prototype.display = function(containerId)
	{
		var data = this.data;
	
		if(data == undefined || Object.keys(data).length == 0)
		{
			var t = new Thing();
			t.generateId(AppController.serverController.getRepoInterface().selectedServer);
			t.name = "New Object";
	    
			if(AppController.identityController.selectedIdentity != undefined)
		    {
		    	t.addOwner(AppController.identityController.selectedIdentity.ppk.toPk());
		    }
			
			data = t;
		}
		
		if(data.hasOwner == undefined && data["@owner"] == undefined)
		{
			if(AppController.identityController.selectedIdentity != undefined)
		    {
		    	data["@owner"] = [];
		    	data["@owner"][0] = AppController.identityController.selectedIdentity.ppk.toPk().toPem();
		    }
		}
		
		ViewManager.showView(new RepoEdit(data, "#repoCreateSaveBtn", "#repoCreateMessageContainer"), "#repoCreateData", function(){
			if(data.name == "New Object" && AppController.identityController.selectedIdentity == undefined)
				 ViewManager.getView("#repoCreateMessageContainer").displayWarning("You are Creating a Public Repository Item, this item can be modified by anyone", "warning");
		});

	};
	
	return RepoCreateScreen;
})(RepoCreateScreen);