/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
RelationshipEditScreen = (function(RelationshipEditScreen){

	var currentRelation = null;
	
	function createContactSmall(pem)
	{
		var ident = AppController.identityController.lookup(pem);
	    return '<span class="ownershipDisplay has-tip" tabindex>'
	    	+ '<span class="qrcodeCanvas"></span>'
	    	+ '<span class="contactText" title="'+pem+'">'+ident.displayName+'</span>'
	    	+ '</span>';
	}
	
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
		AppController.repositoryController.viewCompetency($("#relationEditSource option:selected").attr("value"), relationEditPopulateSource, errorPopulatingDetails);
	}

	function relationEditTargetSelected()
	{ 
		ViewManager.getView("#relationshipEditMessageContainer").clearAlert("populateFail");
	    AppController.repositoryController.viewCompetency($("#relationEditTarget option:selected").attr("value"), relationEditPopulateTarget, errorPopulatingDetails);
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
	    	for(var i = 0; i < relation.owner.length; i++)
	    	{
	    		if(i > 0)
	    			$("#relationEditOwner").append(", ");
	    		
	    		var pem = competency.owner[i];
	    		
	    		var contact = $(createContactSmall(pem));
	    		$("#relationEditOwner").append(contact);            
	    		contact.children(".qrcodeCanvas").qrcode({
	                width:128,
	                height:128,
	                text:forge.util.decode64(pem.replaceAll("-----.*-----","").trim())
	            });   
	    	}
	    }
	    else
	    {
	    	$("#relationEditOwner").text("Public")
	    	$("#relationEditOwnerAdvanced").hide();
	    }
	}
	
	function relationshipCompetencySearch()
	{
		ViewManager.getView("#relationshipEditMessageContainer").clearAlert("competencyFindFail");
		AppController.searchController.competencySearch("", buildCompetencyInput, errorRetrievingCompetencies);
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
				if(data.name == "_New Relation" && AppController.identityController.selectedIdentity == undefined)
				{
					ViewManager.getView("#relationshipEditMessageContainer").displayWarning("You are Creating a Public Relationship, this relationship can be modified by anyone");	
				}
			});
			
			if(data != undefined)
			{
				AppController.repositoryController.viewRelation(data.id, function(relation){
					data = relation;
					relationshipEditActual(data);
				}, errorRetrieving);
			}
			else
			{
				data = new EcAlignment();
			    data.generateId(AppController.repoInterface.selectedServer);
			    data.name = "_New Relation";
			    if(AppController.identityController.selectedIdentity != undefined)
			    	data.addOwner(AppController.identityController.selectedIdentity.ppk.toPk());
			    
			    relationshipEditActual(data);
			    	
			}
			
			relationshipCompetencySearch();

			$("#relationEditSource").change(relationEditSourceSelected);
			$("#relationEditTarget").change(relationEditTargetSelected);
			
			$("#relationshipEditSaveBtn").click(function(ev){
				ev.preventDefault();
				
				var name = $("#relationEditName").val();
				if(name == "_New Relation")
				{
					ViewManager.getView("#relationshipEditMessageContainer").displayAlert("Cannot Create Relation with the Default Name");
					return;
				}
			    
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
			    EcRepository.save(currentRelation, function(){
			    	AppController.repositoryController.viewCompetency(data.source, function(competency){
			    		ScreenManager.changeScreen(new CompetencyViewScreen(competency));
			    	});
			    }, errorSaving);
			});
			
			if(callback != undefined)
				callback();
		});
	};
	
	return RelationshipEditScreen;
})(RelationshipEditScreen);