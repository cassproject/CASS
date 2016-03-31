CompetencyEditScreen = (function(CompetencyEditScreen){
	
	function createContactSmall(pk)
	{
		var ident = AppController.identityController.lookup(pk);
	    return '<span class="ownershipDisplay has-tip" tabindex>'
	    	+ '<span class="qrcodeCanvas"></span>'
	    	+ '<span class="contactText" title="'+pk+'">'+ident.displayName+'</span>'
	    	+ '</span>';
	}
	
	function displayCompetency(competency)
	{
		$('#competencyEditor').show();
	    $("#competencyEditId").val(competency.id);
	    $("#competencyEditName").val(competency.name);
	    $("#competencyEditDescription").val(competency.description);
	    $("#competencyEditScope").val(competency.scope);
	    
	    var field = $("#competencyEditOwner");
	    if(competency.owner != undefined)
	    {
	    	for(var i in competency.owner)
	    	{
	    		var pk = competency.owner[i];
	    		
	    		var contact = $(createContactSmall(pk));
	    		field.append(contact);            
	    		contact.children(".qrcodeCanvas").qrcode({
	                width:128,
	                height:128,
	                text:forge.util.decode64(pk.replaceAll("-----.*-----","").trim())
	            });   
	    	}
	    }else{
	    	$("#competencyEditOwner").text("Public")
	    	$("#competencyEditOwnerAdvanced").hide();
	    }
	    
	}
	
	function saveSuccess(){
		$("#datum").effect("highlight", {}, 1500);
	}
	
	function errorRetrieving(err)
	{
		if(err == undefined)
			err = "Unable to Connect to Server to Retrieve Competency for Editing";
		ViewManager.getView("#competencyEditMessageContainer").displayAlert(err);
	}
	
	function errorSaving(err)
	{
		if(err == undefined)
			err = "Unable to Connect to Server to Save Competency";
		
		ViewManager.getView("#competencyEditMessageContainer").displayAlert(err, "saveFail");
	}
	
	var NEW_COMPETENCY_NAME = "_New Competency";
	
	CompetencyEditScreen.prototype.display = function(containerId, callback)
	{
		var data = this.data;
		
		if(data != undefined && data.id != undefined)
		{
			ScreenManager.replaceHistory(this, containerId, {"id":data.id} )
		}
		
		if(data == undefined){
			data = new EcCompetency();
		    data.generateId(AppController.repoInterface.selectedServer);
		    data.name = NEW_COMPETENCY_NAME;
		    
		    if(AppController.identityController.selectedIdentity != undefined)
		    {
		    	data.addOwner(AppController.identityController.selectedIdentity.ppk.toPk());
		    }
		}
		
		$(containerId).load("partial/screen/competencyEdit.html", function(){
			ViewManager.showView(new MessageContainer("competencyEdit"), "#competencyEditMessageContainer", function(){
				if(data.name == NEW_COMPETENCY_NAME && AppController.identityController.selectedIdentity == undefined)
				{
					ViewManager.getView("#competencyEditMessageContainer").displayWarning("You are Creating a Public Competency, this competency can be modified by anyone")
				}
			});
			
			$("#competencyEditSearchBtn").attr("href", "#"+CompetencySearchScreen.prototype.displayName);
			$("#competencyEditSearchBtn").click(function(event){
				event.preventDefault();
				if(data.name == NEW_COMPETENCY_NAME)
				{
					ScreenManager.changeScreen(new CompetencySearchScreen())
				}
				else
				{
					ScreenManager.changeScreen(new CompetencySearchScreen(data));
				}
				
			});
			
			if(data.name == NEW_COMPETENCY_NAME)
			{
				$("#competencyEditViewBtn").hide();
				
			}
			else
			{
				$("#competencyEditViewBtn").attr("href", "#"+CompetencyViewScreen.prototype.displayName);
				$("#competencyEditViewBtn").click(function(event){
					event.preventDefault();
					ScreenManager.changeScreen(new CompetencyViewScreen(data))
				});
			}
			
			
			$("#competencyEditBtn").attr("href", "#"+CompetencyEditScreen.prototype.displayName);
			$("#competencyEditBtn").click(function(event){
				event.preventDefault();
			});
			
			$("#competencyEditCancelBtn").click(function(event){
				event.preventDefault();
				ScreenManager.changeScreen(new CompetencyViewScreen(data))
			});
			
			$("#competencyEditSaveBtn").click(function(event){
				event.preventDefault();
				 
				data.name = $("#competencyEditName").val();
				data.description = $("#competencyEditDescription").val();
				data.scope = $("#competencyEditScope").val();
				
				
				if(data.name != NEW_COMPETENCY_NAME){
					ViewManager.getView("#competencyEditMessageContainer").clearAlert("saveFail");
					ViewManager.getView("#competencyEditMessageContainer").clearAlert("defaultName");
					EcRepository.save(data, saveSuccess, errorSaving);
				}else{
					ViewManager.getView("#competencyEditMessageContainer").displayAlert("Cannot Save Competency With Default Name", "defaultName");
				}
			})
			
			$("#competencyEditSaveBtn").on("mousemove", function(){
				var url = $("#competencyEditId").val();
				var split = url.split("\/");
				if (split[split.length-4] == "data") 
					split[split.length-1] = new Date().getTime();
				$("#competencyEditId").val(split.join("/"));
			});
			
			if(data.name == NEW_COMPETENCY_NAME)
			{
				displayCompetency(data);
			}
			else
			{
				EcRepository.get(data.id, displayCompetency, errorRetrieving);
			}
						
			if(callback != undefined)
				callback();
		});
	};
	
	return CompetencyEditScreen;
})(CompetencyEditScreen);