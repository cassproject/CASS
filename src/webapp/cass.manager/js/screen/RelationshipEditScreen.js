RelationshipEditScreen = (function(RelationshipEditScreen){

	var currentRelation = null;
	
	function buildCompetencyInput(results){
        $("#relationEditSource").html("<option/>");
        $("#relationEditTarget").html("<option/>");
        for (var i = 0;i < results.length;i++)
        {
            var competency = results[i];
            $("#relationEditSource").append("<option/>");
            $("#relationEditSource").children("option").last().attr("value",competency.id).text(competency.name);               
            $("#relationEditTarget").append("<option/>");
            $("#relationEditTarget").children("option").last().attr("value",competency.id).text(competency.name);
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
	    EcRepository.get($("#relationEditSource option:selected").attr("value"), relationEditPopulateSource, errorPopulatingDetails);
	}

	function relationEditTargetSelected()
	{ 
		ViewManager.getView("#relationshipEditMessageContainer").clearAlert("populateFail");
	    EcRepository.get($("#relationEditTarget option:selected").attr("value"), relationEditPopulateTarget, errorPopulatingDetails);
	}
	
	function relationEditPopulateSource(competency)
	{
	    $("#relationEditSourceId").val(competency.id);
	    $("#relationEditSourceName").val(competency.name);
	    $("#relationEditSourceDescription").val(competency.description);
	    $("#relationEditSourceScope").val(competency.scope);
	}
	function relationEditPopulateTarget(competency)
	{
	    $("#relationEditTargetId").val(competency.id);
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
	}
	
	function relationshipCompetencySearch()
	{
		ViewManager.getView("#relationshipEditMessageContainer").clearAlert("competencyFindFail");
		AppController.searchController.competencySearch("", buildCompetencyInput, errorRetrievingCompetencies);
	}
	
	function saveSuccess(){
		ScreenManager.changeScreen(new CompetencySearchScreen())
	}
	
	function relationSave()
	{
		ViewManager.getView("#relationshipEditMessageContainer").clearAlert("saveFail");
	    currentRelation.source = $("#relationEditSource option:selected").attr("value");
	    currentRelation.target = $("#relationEditTarget option:selected").attr("value");
	    currentRelation.name = $("#relationEditName").val();
	    currentRelation.description = $("#relationEditDescription").val();
	    currentRelation.relationType = $("#relationEditType option:selected").attr("value");
	    EcRepository.save(currentRelation, saveSuccess, errorSaving);
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
	
	RelationshipEditScreen.prototype.display = function(containerId, callback)
	{
		var data = this.data;
		
		if(data != undefined && data.id != null)
		{
			ScreenManager.replaceHistory(this, containerId, {"id":data.id} )
		}
		
		$(containerId).load("partial/screen/relationshipEdit.html", function(){
			ViewManager.showView(new MessageContainer("relationshipEdit"), "#relationshipEditMessageContainer", function(){
				if(data.name == "New Relation" && AppController.identityController.selectedIdentity == undefined)
				{
					ViewManager.getView( "#relationshipEditMessageContainer").displayWarning("You are Creating a Public Relationship, this relationship can be modified by anyone");	
				}
			});
			
			if(data != undefined)
			{
				AppController.repositoryController.view(data.id, relationshipEditActual, errorRetrieving);
			}
			else
			{
				data = new EcAlignment();
			    data.generateId(AppController.repoInterface.selectedServer);
			    data.name = "New Relation";
			    
			    relationshipEditActual(data);
			    	
			}
			
			relationshipCompetencySearch();

			$("#relationEditSource").change(relationEditSourceSelected);
			$("#relationEditTarget").change(relationEditTargetSelected);
			
			$("#relationshipEditSaveBtn").click(relationSave);
			
			if(callback != undefined)
				callback();
		});
	};
	
	return RelationshipEditScreen;
})(RelationshipEditScreen);