RelationshipSearchScreen = (function(RelationshipSearchScreen){
	
	var maxLength = 24;
	
	var relationTypes = {
	    isEnabledBy:"Enabled By",
	    requires:"Requires",
	    desires:"Desires",narrows: "Narrows",
	    isRelatedTo:"Related To",
	    isEquivalentTo:"Equivalent To"
	}
	
	var searchHandle = null;
	
	function runRelationshipSearch(start){
		var query = $("#relationshipSearchText").val();

		if (query == null || query == "")
			query = "*";
		if (searchHandle != null)
			clearTimeout(searchHandle);
		
		var ownership = $("#relationshipSearchOwnership").val();
		if(ownership == 1)
			ownership = "public";
		else if(ownership == 3)
			ownership = "owned";
		else if(ownership == 4)
			ownership = "me"
		else
			ownership = "all";
		
		var callback;
		if(start == undefined)
			callback = clearDisplayResults;
		else
			callback = displayResults;
		
		searchHandle = setTimeout(function() {
			var urlParams = {};
			if(window.location.hash.split("?").length > 1){
				var hashSplit = window.location.hash.split(/[?&]/)
				for(var i = 1; i < hashSplit.length; i++){
					var paramSplit = hashSplit[i].split("=");
					if(paramSplit.length == 2)
						urlParams[paramSplit[0]] = paramSplit[1]; 
				}
			}
			if(query != "*")
				urlParams.query = query;
			if(ownership != "all")
				urlParams.ownership = ownership;
			
			if(Object.keys(urlParams).length > 0)
				ScreenManager.setScreenParameters(urlParams);
			else
				ScreenManager.setScreenParameters(null);
			
			ViewManager.getView("#relationshipSearchMessageContainer").clearAlert("searchFail");
			//ViewManager.getView("#relationshipSearchResults").showProgressMessage();
			ViewManager.getView("#relationshipSearchResults").deselectAll();
			
			var params = {};
			params.ownership = ownership;
			params.size = maxLength;
			params.start = start;
			
			EcAlignment.search(AppController.repoInterface, query, callback, errorSearching, params);
		}, 100);
	}
	
	function clearDisplayResults(results)
	{
		ViewManager.getView("#relationshipSearchResults").clear();
		displayResults(results);
	}
	
	function displayResults(results)
	{  
		ViewManager.getView("#relationshipSearchResults").populate(results);
		
		if(results.length == 0 && $("#relationshipResults-data").first().children().size() == 0)
		{
			ViewManager.getView("#relationshipSearchResults").showNoDataMessage();
		}else if(results.length < maxLength){
			$("#moreSearchResults").addClass("hide");
			//$(window).off("scroll", scrollSearchHandler);
		}else{
			$("#getMoreResults").click(function(){
				$("#getMoreResults").addClass("hide");
				$("#loadingMoreResults").removeClass("hide");
				runRelationshipSearch($("#relationshipResults-data").first().children().size());
			})
			
			$("#getMoreResults").removeClass("hide");
			$("#moreSearchResults").removeClass("hide");
			$("#loadingMoreResults").addClass("hide");
			
			//$(window).scroll(scrollSearchHandler)
		}
		
		searchHandle = null;
	}
	
//	function scrollSearchHandler(){
//		var resultDiv = $("#relationshipResults-data").first(); 
//		
//		if(resultDiv.size() == 0){
//			$(window).off("scroll", scrollSearchHandler);
//		}
//		else if(($(window).height() + document.body.scrollTop) > ($(document).height() - 30))
//		{
//			//$("#moreSearchResults").addClass("hide");
//			//$("#loadingMoreResults").removeClass("hide");
//			runRelationshipSearch(resultDiv.children().size());
//		}
//	}
	
	function errorSearching(err){
		if(err == undefined)
			err = "Unable to Connect to Server for Competency Search";
		
		ViewManager.getView("#relationshipSearchMessageContainer").displayAlert(err, "searchFail");
		
		ViewManager.getView("#relationshipSearchResults").showNoDataMessage();
	}
	
	RelationshipSearchScreen.prototype.display = function(containerId)
	{
		var lastViewed = this.lastViewed;
		
		var query = this.query;
		var ownership = this.ownership;
		
			
		ViewManager.showView(new MessageContainer("relationshipSearch"), "#relationshipSearchMessageContainer");
		
		ViewManager.showView(new DataViewer("relationshipResults", {
			sort:{},
			clickDataEdit:function(datum){
				ScreenManager.changeScreen(new RelationshipEditScreen(datum));
			},
			buildData:function(id, datum){				
				var el = $("<div>" +
								"<a>" +
									"<div class='small-3 columns datum-source' style='font-weight:bold'></div> " +
									"<div class='small-2 columns datum-type' style='font-style:italic'></div>" +
									"<div class='small-3 columns end datum-target'></div>" +
								"</a>" +
								"<div class='small-4 columns datum-owner'></div>" +
							"</div>");
				
				var owner = "";
				if(datum["owner"] == undefined || datum["owner"].length == 0){
					owner = "Public"
				}else{
					for(var i in datum["owner"]){
						owner+= createContactSmall(datum["owner"][i])+ ", "
					}
					owner = owner.substring(0, owner.length-2);
				}
				el.find(".datum-owner").html(owner);
				
				EcCompetency.get(datum.source, function(competency){
					$("[data-id='"+datum.id+"']").find(".datum-source").text(competency.name)
				}, function(){
					el.find(".datum-source").text("Unknown Competency");
				})
				el.find(".datum-source").text("Loading..");
				
				EcCompetency.get(datum.target, function(competency){
					$("[data-id='"+datum.id+"']").find(".datum-target").text(competency.name)
				}, function(){
					el.find(".datum-target").text("Unknown Competency");
				})
				el.find(".datum-target").text("Loading..");
				
				if(relationTypes[datum.relationType] != undefined){
					el.find(".datum-type").text(relationTypes[datum.relationType])
		
				}else{
					el.find(".datum-type").text("has a relationship with");
				}
				
				el.find("a").click(function(ev){
					ev.preventDefault();
					ScreenManager.changeScreen(new RelationshipViewScreen(datum));
				})
				
				return el;
			}
		}), "#relationshipSearchResults");
		
		
		
		$("#relationshipSearchSubmit").click(function(event){
			event.preventDefault();
			runRelationshipSearch();
		});			
		$("#relationshipSearchOwnership").change(function(event){
			event.preventDefault();
			runRelationshipSearch();
		});

		
		$("#relationshipSearchText").keypress(function(e){
			var key = e.which;
			if(key == 13)  // the enter key code
			{
				runRelationshipSearch();
			}
		});
		
		if(query != null)
			$("#relationshipSearchText").val(query)
		
		if(LoginController.getLoggedIn())
		{
			$("#relationshipSearchOwnership").attr("max", 4);
			$("#relationshipSearchOwnershipLoggedIn").removeClass("hide");
			$("#relationshipSearchOwnershipPublic").addClass("hide");
		}
		else
		{
			$("#relationshipSearchOwnershipLoggedIn").addClass("hide");
			$("#relationshipSearchOwnershipPublic").removeClass("hide");
		}
		
		if(ownership != null){
			if(ownership == "public")
				ownership = 1;
			else if(ownership == "owned")
				ownership = 3;
			else if(ownership == "me")
				ownership = 4
			
			$("#relationshipSearchOwnership").val(ownership);
		}
		
		runRelationshipSearch();
	};
	
	return RelationshipSearchScreen;
})(RelationshipSearchScreen);