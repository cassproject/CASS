RepoViewScreen = (function(RepoViewScreen){
	
	
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
				EcRepository._delete(data, function(){
					ScreenManager.changeScreen(new RepoSearchScreen());
				}, function(err){
					if(err == undefined)
						err = "Unable to connect to server to delete item";
					ViewManager.getView("#repoViewMessageContainer").displayAlert(err)
				});
			})
		}
		
		$("#repoViewBtn").click(function(event){
			event.preventDefault();
		})
		
		ViewManager.showView(new RepoEdit(data, "#repoViewSaveBtn", "#repoViewMessageContainer"), "#repoViewResult");
	};
	
	return RepoViewScreen;
})(RepoViewScreen);