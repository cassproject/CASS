RelationshipEditScreen = (function(RelationshipEditScreen){

	var currentRelation = null;
	
	
	function buildCompetencyInput(results){
        $("#relationEditSource").html("<option selected disabled='disabled' class='hide'>Select Source Competency</option>");
        $("#relationEditTarget").html("<option selected disabled='disabled' class='hide'>Select Target Competency</option>");
        for (var i = 0;i < results.length;i++)
        {
            var competency = results[i];
            $("#relationEditSource").append("<option/>");
            $("#relationEditSource").children("option").last().attr("value",EcRemoteLinkedData.trimVersionFromUrl(competency.id)).text(competency.name);               
            $("#relationEditTarget").append("<option/>");
            $("#relationEditTarget").children("option").last().attr("value",EcRemoteLinkedData.trimVersionFromUrl(competency.id)).text(competency.name);
            if (currentRelation != null)
            {
                if (competency.isId(currentRelation.source))
                {
                    $("#relationEditSource").children("option").last().attr("selected",true);
                    relationEditSourceSelected();
                }
                if (competency.isId(currentRelation.target))
                {
                    $("#relationEditTarget").children("option").last().attr("selected",true);
                    relationEditTargetSelected();
                }
            }
        }
	}
	
	function relationEditSourceSelected()
	{ 
		ViewManager.getView("#relationshipEditMessageContainer").clearAlert("populateFail");
		EcCompetency.get($("#relationEditSource option:selected").attr("value"), relationEditPopulateSource, errorPopulatingDetails);
	}

	function relationEditTargetSelected()
	{ 
		ViewManager.getView("#relationshipEditMessageContainer").clearAlert("populateFail");
	    EcCompetency.get($("#relationEditTarget option:selected").attr("value"), relationEditPopulateTarget, errorPopulatingDetails);
	}
	
	function relationEditPopulateSource(competency)
	{
	    $("#relationEditSourceId").val(competency.shortId());
	    $("#relationEditSourceName").val(competency.name);
	    $("#relationEditSourceDescription").val(competency.description);
	    $("#relationEditSourceScope").val(competency.scope);
	}
	function relationEditPopulateTarget(competency)
	{
	    $("#relationEditTargetId").val(competency.shortId());
	    $("#relationEditTargetName").val(competency.name);
	    $("#relationEditTargetDescription").val(competency.description);
	    $("#relationEditTargetScope").val(competency.scope);
	}
	
	function relationshipEditActual(relation)
	{
	    $('.topLevel').hide();
	    currentRelation = relation;
	    $("#relationEditId").val(relation.id);
	    $("#relationEditName").val(relation.name);
	    $("#relationEditDescription").val(relation.description);
	    $('#relationEditor').show();
	    relationshipCompetencySearch();
	    
	    if(relation.owner != undefined && relation.owner.length > 0)
	    {
	    	$("#relationEditOwner").html("");
	    	for(var i = 0; i < relation.owner.length; i++)
	    	{
	    		if(i > 0)
	    			$("#relationEditOwner").append(", ");
	    		
	    		var pem = relation.owner[i];
	    		
	    		var contact = $(createContactSmall(pem));
	    		$("#relationEditOwner").append(contact);  
	    	}
	    }
	    else
	    {
	    	$("#relationEditOwner").text("Public")
	    	$("#relationEditOwnerAdvanced").hide();
	    }
	    
	    if(relation.privateEncrypted){
			if($("#privateRow").css("display") == "none")
				$("#privateRow").slideDown();
			
			if(relation.reader != undefined && relation.reader.length != 0)
		    {
		    	$("#relationEditNoReaders").addClass("hide");
		    	$("#relationEditReaders").html("");
		    	for(var i = 0; i < relation.reader.length; i++)
		    	{
		    		var pk = relation.reader[i];
		    		
		    		var contact = $(createContactSmall(pk));
		    		$("#relationEditReaders").append(contact);            
		    		
		    		if(i < relation.reader.length-1)
		    			$("#relationEditReaders").append(", ");
		    	}
		    }else{
		    	$("#relationEditNoReaders").removeClass("hide");
		    }
			
		}else if($("#privateRow").css("display") != "none"){
			$("#privateRow").slideUp();
		}
	}
	
	function relationshipCompetencySearch()
	{
		ViewManager.getView("#relationshipEditMessageContainer").clearAlert("competencyFindFail");
		EcCompetency.search(AppController.repoInterface, "*", buildCompetencyInput, errorRetrievingCompetencies);
	}

	
	function errorPopulatingDetails(err){
		if(err == undefined)
			err = "Unable to Connect to Server to Populate Competency Details";
		ViewManager.getView("#relationshipEditMessageContainer").displayAlert(err,"populateFail");
	}
	
	function errorRetrievingCompetencies(err){
		if(err == undefined)
			err = "Unable to Connect to Server to Retrieve List of Competencies";
		ViewManager.getView("#relationshipEditMessageContainer").displayAlert(err, "competencyFindFail");
	}
	
	function errorSaving(err){
		if(err == undefined)
			err = "Unable to Connect to Server to Save Relationship";
		ViewManager.getView("#relationshipEditMessageContainer").displayAlert(err, "saveFail");
	}
	
	function errorRetrieving(err){
		if(err == undefined)
			err = "Unable to Connect to Server to Retrieve Relationship";
		ViewManager.getView( "#relationshipEditMessageContainer").displayAlert(err);
	}
	
	var NEW_RELATION_NAME = "";
	
	RelationshipEditScreen.prototype.display = function(containerId)
	{
		var data = this.data;
		
		if(data != undefined && data.id != null)
		{
			ScreenManager.setScreenParameters({"id":data.id} )
		}
		
		ViewManager.showView(new MessageContainer("relationshipEdit"), "#relationshipEditMessageContainer", function(){
			if(data.name == "_New Relation" && AppController.identityController.selectedIdentity == undefined)
			{
				ViewManager.getView("#relationshipEditMessageContainer").displayWarning("You are Creating a Public Relationship, this relationship can be modified by anyone");	
			}
		});
		
		if(data != undefined)
		{
			EcAlignment.get(data.id, function(relation){
				data = relation;
				relationshipEditActual(data);
			}, errorRetrieving);
		}
		else
		{
			data = new EcAlignment();
		    data.generateId(AppController.repoInterface.selectedServer);
		    data.name = NEW_RELATION_NAME;
		    if(AppController.identityController.selectedIdentity != undefined)
		    	data.addOwner(AppController.identityController.selectedIdentity.ppk.toPk());
		    
		    relationshipEditActual(data);
		    	
		}
		
		relationshipCompetencySearch();

		$("#relationEditSource").change(relationEditSourceSelected);
		$("#relationEditTarget").change(relationEditTargetSelected);
		
		$("#relationshipEditCancelBtn").click(function(event){
			event.preventDefault();
			ScreenManager.changeScreen(new RelationshipViewScreen(data))
		});
		
		if(data.name == NEW_RELATION_NAME){
			$("#relationshipEditDeleteBtn").remove();	
		}else{
			$("#relationshipEditDeleteBtn").click(function(event){
				event.preventDefault();
				
				ModalManager.showModal(new ConfirmModal(function(){
					data._delete(function(){
						ScreenManager.changeScreen(new RelationshipSearchScreen());
					}, function(err){
						if(err == undefined)
							err = "Unable to connect to server to delete relationship";
						ViewManager.getView("#relationshipEditMessageContainer").displayAlert(err)
					});
					ModalManager.hideModal();
				}, "Are you sure you want to delete this relationship?"));
			})
		}
		
		$("#relationshipEditSaveBtn").click(function(ev){
			ev.preventDefault();
			
			var name = $("#relationEditName").val();
			
		    
			data.source = $("#relationEditSource option:selected").val();
		    if(data.source == "")
		    {
		    	ViewManager.getView("#relationshipEditMessageContainer").displayAlert("Cannot Create Relation without Source Competency Specified");
				return;
		    }
		    
		    data.target = $("#relationEditTarget option:selected").val();
		    if(data.target == "")
		    {
		    	ViewManager.getView("#relationshipEditMessageContainer").displayAlert("Cannot Create Relation without Target Competency Specified");
				return;
		    }
		    
		    data.name = name;
		    data.description = $("#relationEditDescription").val();
		    data.relationType = $("#relationEditType option:selected").attr("value");
		    
		    ViewManager.getView("#relationshipEditMessageContainer").clearAlert("saveFail");
		    currentRelation.save(function(){
		    	EcCompetency.get(data.source, function(competency){
		    		ScreenManager.changeScreen(new RelationshipViewScreen(currentRelation));
		    	});
		    }, errorSaving);
		});
		
		$("#relationEditOwnerAdvanced").click(function(ev){
			ev.preventDefault();
			
			data.name = $("#relationEditName").val();
			data.description = $("#relationEditDescription").val();
			
			ModalManager.showModal(new AdvancedPermissionsModal(data, function(dataAfter){
				data.owner = dataAfter.owner;
				data.privateEncrypted = dataAfter.privateEncrypted;
				data.reader = dataAfter.reader;
				
				relationshipEditActual(data);
				
				ModalManager.hideModal();
			}))
		})
			
	};
	
	return RelationshipEditScreen;
})(RelationshipEditScreen);