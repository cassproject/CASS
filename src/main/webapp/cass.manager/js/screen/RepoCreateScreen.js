RepoCreateScreen = (function(RepoCreateScreen){
	
	RepoCreateScreen.prototype.display = function(containerId)
	{
		var data = this.data;
	
		if(data == undefined || Object.keys(data).length == 0)
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