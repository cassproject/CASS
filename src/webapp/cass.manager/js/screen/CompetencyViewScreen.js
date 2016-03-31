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
	        $(relationTypes[key]).hide().prev().hide();  
	    }
	    
	    $("#competencyViewerId").text(competency.id);
	    $(".competencyViewerName").text(competency.name);
	    $("#competencyViewerDescription").text(competency.description);
	    $("#competencyViewerLevels").html("");
	    AppController.searchController.relationSearchBySource(EcRemoteLinkedData.trimVersionFromUrl(competency.id),
	    		competencyViewRelationActual,
	    		errorFindingRelationships);    
	    $('#competencyViewer').show();
	    
	}
	
	function competencyViewRelationActual(arr)
	{
	    relationCounts = {}
	    for (var i = 0;i < arr.length;i++)
	        EcRepository.get(arr[i].id,competencyViewRelationInner,errorFindingRelationships);
	    for (var key in relationTypes)
	        if (relationCounts[key] !== undefined && relationCounts[key] > 0)
	            $(relationTypes[key]).show().prev().show();
	        else
	            $(relationTypes[key]).hide().prev().hide();  
	    
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
	        $(relationTypes[relation.relationType]).show().prev().show();
	    else
	        $(relationTypes[relation.relationType]).hide().prev().hide();  
	}

	function fetchNameFor(dom,id)
	{
	    EcRepository.get(id,function(obj){
	        var c = new EcCompetency();
	        c.copyFrom(obj);
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
	
	CompetencyViewScreen.prototype.display = function(containerId, callback)
	{
		var data = this.data;
		
		if(data.id != null)
		{
			ScreenManager.replaceHistory(this, containerId, {"id":data.id} )
		}
		
		$(containerId).load("partial/screen/competencyView.html", function(){
			
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
			
			var canEdit = false;
			for(var index in EcIdentityManager.ids){
				var pk = identities[index].ppk.toPk()
				if(data.canEdit(pk))
					canEdit = true;
			}
			
			if(canEdit){
				$("#editCompetencyBtn").click(function(event){
					event.preventDefault();
					ScreenManager.changeScreen(new CompetencyEditScreen(data))
				})
			}else{
				$("#editCompetencyBtn").remove();
			}
			
			
			
			
			EcRepository.get(data.id, displayCompetency, errorRetrieving);
			
			if(callback != undefined)
				callback();
		});
	};
	
	return CompetencyViewScreen;
})(CompetencyViewScreen);