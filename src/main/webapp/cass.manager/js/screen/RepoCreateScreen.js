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
	
	RepoCreateScreen.prototype.display = function(containerId)
	{
		var data = this.data;
	
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

	};
	
	return RepoCreateScreen;
})(RepoCreateScreen);