CompetencyViewScreen = (function(CompetencyViewScreen){
	
	var relationCounts = {};
	var relationTypes = {
	    isEnabledBy:"#competencyViewerRelationEnabling",
	    requires:"#competencyViewerRelationRequires",
	    desires:"#competencyViewerRelationDesires",
	    isRelatedTo:"#competencyViewerRelationRelated",
	    isEquivalentTo:"#competencyViewerRelationEquivalent"
	}
	
	
	function displayCompetency(competency)
	{
	    for (var key in relationTypes)
	    {
	        $(relationTypes[key]).html("");
	        $(relationTypes[key]).parent().addClass("hide");  
	    }
	    
	    $("#competencyViewerId").text(competency.id);
	    $(".competencyViewerName").text(competency.name);
	    $("#competencyViewerDescription").text(competency.description);
	    
	    if(competency.privateEncrypted)
			$("#competencyViewerPrivateSymbol").removeClass("hide");
		else
			$("#competencyViewerPrivateSymbol").addClass("hide");
	    
	    if(competency.owner != undefined && competency.owner.length > 0)
	    {
	    	$("#competencyViewOwner").text("")
	    	for(var i = 0; i < competency.owner.length; i++)
 	    	{
	    		if(i > 0)
	    			$("#competencyViewOwner").append(", ");
	    		
 	    		var pem = competency.owner[i];
 	    		
 	    		var contact = $(createContactSmall(pem));
 	    	}
	    }else{
 	    	$("#competencyViewOwner").text("Public")
 	    }
	    
	    EcAlignment.searchBySource(AppController.repoInterface,
	    		EcRemoteLinkedData.trimVersionFromUrl(competency.id),
	    		competencyViewRelationActual,
	    		errorFindingRelationships);   
	    
	    competency.levels(AppController.repoInterface, null, errorFindingLevels, addLevels)
	}
	
	function addLevels(levels)
	{
		if(levels.length == 0)
		{
			$("#competencyViewerLevels").addClass("hide");
		}
		else
		{
			for(var i = 0; i < levels.length; i++)
				addLevel(levels[i]);
		}
	}
	
	function addLevel(level){
		var container = $("<span data-tooltip data-fade-out-duration='1500' class='level has-tip top' style='font-weight:normal;'></span>");
		container.append(level.name);
		container.attr("id", level.id);
		
		var tip = "";
		if(level.description != undefined && level.description != "")
			tip += "Description: "+level.description+"<br/><br/>";
		if(level.title != undefined && level.title != "")
			tip += "Title: "+level.title+"<br/><br/>";
		if(level.performance != undefined && level.performance != "")
			tip += "Performance Measure: "+level.performance+"<br/><br/>";
		if(level.owner != undefined && level.owner.length > 0){
			tip += "Owner: ";
			for(var i = 0; i < level.owner.length; i++)
			{
				if(i != 0)
					tip+=", ";
				tip+=AppController.identityController.lookup(level.owner[i]).displayName;
			}
			tip+= "<br/><br/>"
		}
				
		tip += level.id;
		
		if($("#competencyViewerLevelList").children(".level").size() > 0)
			$("#competencyViewerLevelList").append(", ");
		
		$("#competencyViewerLevelList").append(container);
		
		new Foundation.Tooltip(container, {"tipText":tip});
	}
	
	function competencyViewRelationActual(arr)
	{
		if(arr.length == 0)
			$("#competencyViewerRelations").addClass("hide");
		
	    relationCounts = {}
	    for (var i = 0;i < arr.length;i++)
	    	competencyViewRelationInner(arr[i]);
	    for (var key in relationTypes)
	        if (relationCounts[key] !== undefined && relationCounts[key] > 0)
	            $(relationTypes[key]).parent().removeClass("hide");
	        else
	            $(relationTypes[key]).parent().addClass("hide");
	    
	}

	function competencyViewRelationInner(obj)
	{    
	    var relation = new EcAlignment();
	    relation.copyFrom(obj);
	    $(relationTypes[relation.relationType]).append("<li><a class='float-right'>Edit</a><a></a></li>");
	    var anchor = $(relationTypes[relation.relationType]).children("li").last().children("a").last();    
	    anchor.attr("id",relation.target).text("Loading...");
	    fetchNameFor(anchor,relation.target);
	    
	    anchor = $(relationTypes[relation.relationType]).children("li").last().children("a").first();  
	    anchor.attr("id",relation.id);
	    anchor.click(function(e){
	    	e.preventDefault();
	    	ScreenManager.changeScreen(new RelationshipEditScreen(relation))
	    })
	    
	    if (relationCounts[relation.relationType] === undefined) 
	        relationCounts[relation.relationType] = 0;
	    relationCounts[relation.relationType]++;
	    if (relationCounts[relation.relationType] !== undefined && relationCounts[relation.relationType] > 0)
	        $(relationTypes[relation.relationType]).parent().removeClass("hide");
	    else
	        $(relationTypes[relation.relationType]).parent().addClass("hide");
	}

	function fetchNameFor(dom,id)
	{
	    EcCompetency.get(id, function(c){
	        dom.text(c.name);        
	        dom.click(function(e){
	        	e.preventDefault();
	        	ScreenManager.changeScreen(new CompetencyViewScreen(c))
	        })
	    },errorFindingRelationships);
	}
	
	function errorRetrieving(err)
	{
		if(err == undefined)
			err = "Unable to Connect to Server to Retrieve Competency";
		
		ViewManager.getView("#competencyViewMessageContainer").displayAlert(err, "getCompetency");
	}
	
	function errorFindingRelationships(err){
		if(err == undefined)
			err = "Unable to Connect to Server to Retrieve Relationships";
		
		ViewManager.getView("#competencyViewMessageContainer").displayAlert(err, "getRelationships");
	}
	
	function errorFindingLevels(err){
		if(err == undefined)
			err = "Unable to Connect to Server to Retrieve Levels";
		
		ViewManager.getView("#competencyViewMessageContainer").displayAlert(err, "getLevels");
	}
	
	CompetencyViewScreen.prototype.display = function(containerId)
	{
		var data = this.data;
		
		if(data.id != null)
		{
			ScreenManager.setScreenParameters({"id":data.id});
		}
		
			
		ViewManager.showView(new MessageContainer("competencyView"), "#competencyViewMessageContainer");
		
		$("#competencyViewSearchBtn").attr("href", "#"+CompetencySearchScreen.prototype.displayName);
		$("#competencyViewSearchBtn").click(function(event){
			event.preventDefault();
			ScreenManager.changeScreen(new CompetencySearchScreen(data))
		});
		
		$("#competencyViewBtn").attr("href", "#"+CompetencyViewScreen.prototype.displayName);
		$("#competencyViewBtn").click(function(event){
			event.preventDefault();
		});
		
		if(AppController.identityController.canEdit(data)){
			$("#editCompetencyBtn").click(function(event){
				event.preventDefault();
				ScreenManager.changeScreen(new CompetencyEditScreen(data))
			})
		}else{
			$("#editCompetencyBtn").remove();
		}
		
		if(AppController.identityController.owns(data) || AppController.loginController.getAdmin()){
			$("#competencyViewDeleteBtn").click(function(){
				ModalManager.showModal(new ConfirmModal(function(){
					data._delete(function(){
						ScreenManager.changeScreen(new CompetencySearchScreen());
					}, function(err){
						if(err == undefined)
							err = "Unable to connect to server to delete competenncy";
						ViewManager.getView("#competencyViewMessageContainer").displayAlert(err)
					});
					ModalManager.hideModal();
				}, "Are you sure you want to delete this competency?"))
			})
		}else{
			$("#competencyViewDeleteBtn").remove();
		}
		
		
		EcCompetency.get(data.id, function(result){
			data = result;
			displayCompetency(result);
		}, errorRetrieving);
		

	};
	
	return CompetencyViewScreen;
})(CompetencyViewScreen);