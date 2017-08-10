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