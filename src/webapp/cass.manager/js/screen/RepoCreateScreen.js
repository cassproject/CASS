/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
RepoCreateScreen = (function(RepoCreateScreen){

	function displayMessage(error, errorClass)
	{
		if(errorClass == undefined || errorClass == "")
			errorClass = "alert";
		
		var errorContainer = $("#repoCreateError");
		
		errorContainer.find("[data-msg='"+error+"']").remove();
		
		errorContainer.addClass(errorClass);
		errorContainer.attr("style", "");
		errorContainer.append("<div data-msg='"+error+"'>"+error+"</div>");
		errorContainer.removeClass("hide");
		
	}
	
	function hideError()
	{	
		var errorContainer = $("#repoCreateError");
		
		errorContainer.fadeOut();
		errorContainer.addClass("hide");
		errorContainer.attr("style", "");
		errorContainer.html("");
	}
	
	RepoCreateScreen.prototype.display = function(containerId, callback)
	{
		var data = this.data;
		
		$(containerId).load("partial/screen/repoCreate.html", function(){
			
			if(data == undefined)
			{
				var t = new Thing();
				t.generateId(AppController.repoInterface.selectedServer);
				t.name = "New Object";
		    
				if(AppController.identityController.selectedIdentity != undefined)
			    {
			    	t.addOwner(AppController.identityController.selectedIdentity.ppk.toPk());
			    }
				
				data = t;
			}
			else if(data.hasOwner == undefined && data["@owner"] == undefined)
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
			
			if(callback != undefined)
				callback();
		});
	};
	
	return RepoCreateScreen;
})(RepoCreateScreen);