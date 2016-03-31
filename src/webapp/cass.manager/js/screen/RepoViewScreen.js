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