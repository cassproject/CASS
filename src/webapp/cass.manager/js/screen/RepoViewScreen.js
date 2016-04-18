/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
RepoViewScreen = (function(RepoViewScreen){
	
	
	RepoViewScreen.prototype.display = function(containerId, callback)
	{
		var data = this.data
		
		if(data.id != null)
		{
			ScreenManager.replaceHistory(this, containerId, {"id":data.id} )
		}
		
		$(containerId).load("partial/screen/repoView.html", function(){
			$("#repoViewSearchBtn").attr("href", "#"+RepoSearchScreen.prototype.displayName);
			$("#repoViewSearchBtn").click(function(event){
				event.preventDefault();
				ScreenManager.changeScreen(new RepoSearchScreen(data))
			});
			
			$("#repoViewBtn").click(function(event){
				event.preventDefault();
			})
			
			ViewManager.showView(new RepoEdit(data, "#repoViewSaveBtn", "#repoViewMessageContainer"), "#repoViewResult");
			
			if(callback != undefined)
				callback();
		});
	};
	
	return RepoViewScreen;
})(RepoViewScreen);