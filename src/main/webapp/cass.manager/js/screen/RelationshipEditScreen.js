/**
 * Screen that handles editing a relationship in a form
 * 
 * @module cass.manager
 * @class RelationshipEditScreen
 * 
 * @author devlin.junker@eduworks.com
 */
RelationshipEditScreen = (function(RelationshipEditScreen){

	var currentRelation = null;
	
	/**
	 * Builds the competency selectors on the relationship edit form
	 * 
	 * @memberOf RelationshipEditScreen
	 * @method buildCompetencyInput
	 * @private 
	 * @param {EcCompetency[]} results
	 * 			list of competencies from competency search
	 */
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
	
	/**
	 * Builds the relationType selectors on the relationship edit form
	 * 
	 * @memberOf RelationshipEditScreen
	 * @method buildRelationTypeInput
	 * @private 
	 * @param {EcAlignment} relation
	 * 			relation that we are currently editing, to set the option selected attribute
	 */
	function buildRelationTypeInput(relation){
		for (var type in AppSettings.relationTypes){
			$("#relationEditType").append("<option value='"+type+"'>"+AppSettings.relationTypes[type]+"</option>")
		}
		
		if(relation != null && relation.relationType != null && relation.relationType != ""){
			var currentOption = $("#relationEditType option[value='"+relation.relationType+"']");
			if(currentOption.size() > 0){
				currentOption.attr("selected", "selected");
			}else{
				var typeDisplay = relation.relationType.split(/(?=[A-Z])/).join(" ");
				
				$("#relationEditType").append("<option value='"+relation.relationType+"'>"+typeDisplay+"</option>")
			}
		}
	}
	
	/**
	 * Starts to populate the disabled source fields in the form, asks for the
	 * source competency info from the server
	 * 
	 * @memberOf RelationshipEditScreen
	 * @method relationEditSourceSelected
	 * @private 
	 */
	function relationEditSourceSelected()
	{ 
		ViewManager.getView("#relationshipEditMessageContainer").clearAlert("populateFail");
		EcCompetency.get($("#relationEditSource option:selected").attr("value"), relationEditPopulateSource, errorPopulatingDetails);
	}

	/**
	 * Starts to populate the disabled target fields in the form, asks for the
	 * target competency info from the server
	 * 
	 * @memberOf RelationshipEditScreen
	 * @method relationEditTargetSelected
	 * @private 
	 */
	function relationEditTargetSelected()
	{ 
		ViewManager.getView("#relationshipEditMessageContainer").clearAlert("populateFail");
	    EcCompetency.get($("#relationEditTarget option:selected").attr("value"), relationEditPopulateTarget, errorPopulatingDetails);
	}
	
	/**
	 * Populates the disabled source fields
	 * 
	 * @memberOf RelationshipEditScreen
	 * @method relationEditPopulateSource
	 * @private 
	 * @param {EcCompetency} competency
	 * 			Competency to display details of
	 */
	function relationEditPopulateSource(competency)
	{
	    $("#relationEditSourceId").val(competency.shortId());
	    $("#relationEditSourceName").val(competency.name);
	    $("#relationEditSourceDescription").val(competency.description);
	    $("#relationEditSourceScope").val(competency.scope);
	}
	
	/**
	 * Populates the disabled target fields
	 * 
	 * @memberOf RelationshipEditScreen
	 * @method relationEditPopulateTarget
	 * @private
	 * @param {EcCompetency} competency
	 * 			Competency to display details of 
	 */
	function relationEditPopulateTarget(competency)
	{
	    $("#relationEditTargetId").val(competency.shortId());
	    $("#relationEditTargetName").val(competency.name);
	    $("#relationEditTargetDescription").val(competency.description);
	    $("#relationEditTargetScope").val(competency.scope);
	}
	
	/**
	 * Populates the rest of the relationship fields
	 * 
	 * @memberOf RelationshipEditScreen
	 * @method relationshipEditActual
	 * @private 
	 * @param {EcAlignment} relation
	 * 			relationship details to display
	 */
	function relationshipEditActual(relation)
	{
	    $('.topLevel').hide();
	    currentRelation = relation;
	    
	    buildRelationTypeInput(relation);
	    
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
	    		$("#relationEditOwner").append("<span id='relation-owner-"+i+"'></span>");
                
                ViewManager.showView(new IdentityDisplay(pem), "#relation-owner-"+i);  
	    	}
	    }
	    else
	    {
	    	$("#relationEditOwner").text("Public")
	    	$("#relationEditOwnerAdvanced").hide();
	    }
	    
	    if(EcEncryptedValue.encryptOnSave(relation.id)){
			if($("#privateRow").css("display") == "none")
				$("#privateRow").slideDown();
			
			if(relation.reader != undefined && relation.reader.length != 0)
		    {
		    	$("#relationEditNoReaders").addClass("hide");
		    	$("#relationEditReaders").html("");
		    	for(var i = 0; i < relation.reader.length; i++)
		    	{
		    		var pk = relation.reader[i];
		    		
		    		$("#relationEditReaders").append("<span id='relation-reader-'"+i+"></span>");
	                
	                ViewManager.showView(new IdentityDisplay(pk), "#relation-reader-"+i);             
		    		
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
	
	/**
	 * Handles starting the competency search to build competency selects
	 * 
	 * @memberOf RelationshipEditScreen
	 * @method relationshipCompetencySearch
	 * @private 
	 */
	function relationshipCompetencySearch()
	{
		ViewManager.getView("#relationshipEditMessageContainer").clearAlert("competencyFindFail");
		EcCompetency.search(AppController.serverController.getRepoInterface(), "*", buildCompetencyInput, errorRetrievingCompetencies);
	}

	/**
	 * Handles displaying errors while retrieving the details of competencies
	 * selected in the source/target selects
	 * 
	 * @memberOf RelationshipEditScreen
	 * @method errorPopulatingDetails
	 * @private 
	 * @param {String} err
	 * 			Error message to display
	 */
	function errorPopulatingDetails(err){
		if(err == undefined)
			err = "Unable to Connect to Server to Populate Competency Details";
		ViewManager.getView("#relationshipEditMessageContainer").displayAlert(err,"populateFail");
	}
	
	/**
	 * Handles displaying errors while searching for competencies to
	 * put in source/target selects
	 * 
	 * @memberOf RelationshipEditScreen
	 * @method errorRetrievingCompetencies
	 * @private 
	 * @param {String} err
	 * 			Error message to display
	 */
	function errorRetrievingCompetencies(err){
		if(err == undefined)
			err = "Unable to Connect to Server to Retrieve List of Competencies";
		ViewManager.getView("#relationshipEditMessageContainer").displayAlert(err, "competencyFindFail");
	}
	
	/**
	 * Handles displaying errors while saving relation
	 * 
	 * @memberOf RelationshipEditScreen
	 * @method errorSaving
	 * @private 
	 * @param {String} err
	 * 			Error message to display
	 */
	function errorSaving(err){
		if(err == undefined)
			err = "Unable to Connect to Server to Save Relationship";
		ViewManager.getView("#relationshipEditMessageContainer").displayAlert(err, "saveFail");
	}
	
	/**
	 * Handles displaying errors while retrieving competency
	 * 
	 * @memberOf RelationshipEditScreen
	 * @method errorRetrieving
	 * @private 
	 * @param {String} err
	 * 			Error message to display
	 */
	function errorRetrieving(err){
		if(err == undefined)
			err = "Unable to Connect to Server to Retrieve Relationship";
		ViewManager.getView( "#relationshipEditMessageContainer").displayAlert(err);
	}
	
	
	
	var NEW_RELATION_NAME = "";
	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf RelationshipEditScreen
	 * @method display
	 * @param containerId
	 * 			Screen Container DOM ID
	 */
	RelationshipEditScreen.prototype.display = function(containerId)
	{
		var data = this.data;
		
		if(data != undefined && data.id != undefined)
		{
			ScreenManager.setScreenParameters({"id":data.id} )
		}else if(data != undefined && data.source != undefined){
			ScreenManager.setScreenParameters({"source":data.source} )
		}else if(data != undefined && data.target != undefined){
			ScreenManager.setScreenParameters({"target":data.target} )
		}
		
		ViewManager.showView(new MessageContainer("relationshipEdit"), "#relationshipEditMessageContainer", function(){
			if(data.name == "_New Relation" && AppController.identityController.selectedIdentity == undefined)
			{
				ViewManager.getView("#relationshipEditMessageContainer").displayWarning("You are Creating a Public Relationship, this relationship can be modified by anyone");	
			}
		});
		
		if(data != undefined && data.id != undefined)
		{
			EcAlignment.get(data.id, function(relation){
				data = relation;
				relationshipEditActual(data);
			}, errorRetrieving);
		}
		else if(data != undefined && data.source != undefined)
		{
			var source = data.source
			data = new EcAlignment();
		    data.generateId(AppController.serverController.getRepoInterface().selectedServer);
		    data.name = NEW_RELATION_NAME;
		    data.source = source;
		    if(AppController.identityController.selectedIdentity != undefined)
		    	data.addOwner(AppController.identityController.selectedIdentity.ppk.toPk());
		    
		    relationshipEditActual(data);
		}
		else if(data != undefined && data.target != undefined)
		{
			var target = data.target
			data = new EcAlignment();
		    data.generateId(AppController.serverController.getRepoInterface().selectedServer);
		    data.name = NEW_RELATION_NAME;
		    data.target = target;
		    if(AppController.identityController.selectedIdentity != undefined)
		    	data.addOwner(AppController.identityController.selectedIdentity.ppk.toPk());
		    
		    relationshipEditActual(data);
		}
		else
		{
			data = new EcAlignment();
		    data.generateId(AppController.serverController.getRepoInterface().selectedServer);
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
				data.reader = dataAfter.reader;
				
				relationshipEditActual(data);
				
				ModalManager.hideModal();
			}))
		})
			
	};
	
	return RelationshipEditScreen;
})(RelationshipEditScreen);