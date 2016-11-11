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