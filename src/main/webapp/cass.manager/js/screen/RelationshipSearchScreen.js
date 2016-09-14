RelationshipSearchScreen = (function(RelationshipSearchScreen){
	
	var maxLength = 24;
	
	var relationTypes = {
	    isEnabledBy:"Enabled By",
	    requires:"Requires",
	    desires:"Desires",
	    isRelatedTo:"Related To",
	    isEquivalentTo:"Equivalent To"
	}
	
	function createContactSmall(pk)
	{
		var ident = AppController.identityController.lookup(pk);
	    return '<span class="ownershipDisplay has-tip" tabindex>'
	    	+ '<span class="qrcodeCanvas"></span>'
	    	+ '<span class="contactText" title="'+pk+'">'+ident.displayName+'</span>'
	    	+ '</span>';
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
			if(query != "*")
				urlParams.query = query;
			if(ownership != "all")
				urlParams.ownership = ownership;
			
			if(Object.keys(urlParams).length > 0)
				ScreenManager.replaceHistory(ScreenManager.getCurrentScreen(), ScreenManager.SCREEN_CONTAINER_ID, urlParams);
			else
				ScreenManager.replaceHistory(ScreenManager.getCurrentScreen(), ScreenManager.SCREEN_CONTAINER_ID, null);
			
			ViewManager.getView("#relationshipSearchMessageContainer").clearAlert("searchFail");
			//ViewManager.getView("#relationshipSearchResults").showProgressMessage();
			//ViewManager.getView("#relationshipSearchResults").deselectAll();
			
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
		
		if(results.length == 0)
		{
			ViewManager.getView("#relationshipSearchResults").showNoDataMessage();
		}else if(results.length < maxLength){
//			$("#moreSearchResults").addClass("hide");
			$(window).off("scroll", scrollSearchHandler);
		}else{
//			$("#getMoreResults").click(function(){
//				$("#moreSearchResults").addClass("hide");
//				runRepoSearch(resultDiv.children().size());
//			})
			
			$(window).scroll(scrollSearchHandler)
			
//			$("#moreSearchResults").removeClass("hide");
//			$("#loadingMoreResults").addClass("hide");
			
		}
		
		searchHandle = null;
	}
	
	function scrollSearchHandler(){
		var resultDiv = $("#relationshipResults-data").first(); 
		
		if(resultDiv.size() == 0){
			$(window).off("scroll", scrollSearchHandler);
		}
		else if(($(window).height() + document.body.scrollTop) > ($(document).height() - 30))
		{
			//$("#moreSearchResults").addClass("hide");
			//$("#loadingMoreResults").removeClass("hide");
			runRelationshipSearch(resultDiv.children().size());
		}
	}
	
	function errorSearching(err){
		if(err == undefined)
			err = "Unable to Connect to Server for Competency Search";
		
		ViewManager.getView("#relationshipSearchMessageContainer").displayAlert(err, "searchFail");
		
		ViewManager.getView("#relationshipSearchResults").showNoDataMessage();
	}
	
	RelationshipSearchScreen.prototype.display = function(containerId, callback)
	{
		var lastViewed = this.lastViewed;
		
		var query = this.query;
		var ownership = this.ownership;
		
		$(containerId).load("partial/screen/relationshipSearch.html", function(){
			
			ViewManager.showView(new MessageContainer("relationshipSearch"), "#relationshipSearchMessageContainer");
			
			EcCompetency.search(AppController.repoInterface, "*", function(competencies){
				var cache = {};
				for(var i in competencies){
					cache[EcRemoteLinkedData.trimVersionFromUrl(competencies[i].id)] = competencies[i];
				}
			
				ViewManager.showView(new DataViewer("relationshipResults", {
					sort:{},
					clickDataEdit:function(datum){
						ScreenManager.changeScreen(new RelationshipEditScreen(datum));
					},
					buildData:function(id, datum){
						var html = "<div>" +
										"<a>" +
											"<div class='small-3 columns' style='font-weight:bold'>{{dataSource}}</div> " +
											"<div class='small-2 columns' style='font-style:italic'>{{dataRelationType}}</div>" +
											"<div class='small-3 columns end'>{{dataTarget}}</div>" +
										"</a>" +
										"<div class='small-4 columns datum-owner'>{{dataOwner}}</div>" +
									"</div>";
						
						if(cache[EcRemoteLinkedData.trimVersionFromUrl(datum.source)] != undefined){
							html = html.replaceAll(/{{dataSource}}/, cache[EcRemoteLinkedData.trimVersionFromUrl(datum.source)].name)
						}else{
							html = html.replaceAll(/{{dataSource}}/, "Unknown Competency");
						}
						
						if(cache[EcRemoteLinkedData.trimVersionFromUrl(datum.target)] != undefined){
							html = html.replaceAll(/{{dataTarget}}/, cache[EcRemoteLinkedData.trimVersionFromUrl(datum.target)].name)
						}else{
							html = html.replaceAll(/{{dataTarget}}/, "Unknown Competency");
						}
						
						if(relationTypes[datum.relationType] != undefined){
							html = html.replaceAll(/{{dataRelationType}}/, relationTypes[datum.relationType])
						}else{
							html = html.replaceAll(/{{dataRelationType}}/, "has a relationship with");
						}
						
						var owner = "";
						if(datum["owner"] == undefined || datum["owner"].length == 0){
							owner = "Public"
						}else{
							for(var i in datum["owner"]){
								owner+= createContactSmall(datum["owner"][i])+ ", "
							}
							owner = owner.substring(0, owner.length-2);
						}
						
						html = html.replaceAll(/{{dataOwner}}/g, owner);
						
						var el = $(html);
						
						el.find(".ownershipDisplay").each(function(i, element){
							$(element).children(".qrcodeCanvas").qrcode({
				                width:128,
				                height:128,
				                text:forge.util.decode64($(element).find(".contactText").attr("title").replaceAll("-----.*-----","").trim())
				            });  
						})
						
						el.find("a").click(function(ev){
							ev.preventDefault();
							ScreenManager.changeScreen(new RelationshipViewScreen(datum));
						})
						
						return el;
					}
				}), "#relationshipSearchResults");
				
				runRelationshipSearch();
			}, function(err){
				
			});
			
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
			
			if(callback != undefined)
				callback();
		});
	};
	
	return RelationshipSearchScreen;
})(RelationshipSearchScreen);