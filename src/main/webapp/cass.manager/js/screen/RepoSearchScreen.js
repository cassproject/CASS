RepoSearchScreen = (function(RepoSearchScreen){
	
	var maxLength = 24;
	
	var searchHandle = null;
	
	function runRepoSearch(start){
		
		var query = $("#repoSearchText").val();
		
		if (query == null || query == "")
			query = "*";
		
		var ownership = $("#repoSearchOwnership").val();
		if(ownership == 1)
			ownership = "public";
		else if(ownership == 3)
			ownership = "owned";
		else if(ownership == 4)
			ownership = "me"
		else
			ownership = "all";
		
		var types = undefined;
		if($("#repoSearchTypes input:checkbox:checked").size() != $("#repoSearchTypes input:checkbox").size())
		{
			 types = $("#repoSearchTypes input:checkbox:checked").map(function(){
			      return $(this).parent().attr('title');
		    }).get();
		}else if($("#repoSearchTypes input:checkbox:checked").size() == 0 && urlTypes != undefined){
			types = urlTypes;
		}else{
			types = undefined;
		}
		
		
		if (searchHandle != null)
			clearTimeout(searchHandle);
		
		var callback;
		if(start == undefined)
			callback = clearDisplayResults;
		else
			callback = displayResults;
		
		setTimeout(function() {
			if(searchHandle == null)
			{
				var urlParams = {};
				if(window.location.hash.split("?").length > 1){
					var hashSplit = window.location.hash.split(/[?&]/)
					for(var i = 1; i < hashSplit.length; i++){
						var paramSplit = hashSplit[i].split("=");
						if(paramSplit.length == 2)
							urlParams[paramSplit[0]] = paramSplit[1]; 
					}
				}
				
				if(types != undefined)
					urlParams.types = types;
				else if(urlParams.types != undefined)
					delete urlParams.types;
				
				if(query != "*")
					urlParams.query = query;
				else if(urlParams.query != undefined)
					delete urlParams.query;
				
				if(ownership != "all")
					urlParams.ownership = ownership;
				else if(urlParams.ownership != undefined)
					delete urlParams.ownership;
				
				if(Object.keys(urlParams).length > 0)
					ScreenManager.replaceHistory(ScreenManager.getCurrentScreen(), ScreenManager.SCREEN_CONTAINER_ID, urlParams);
				else
					ScreenManager.replaceHistory(ScreenManager.getCurrentScreen(), ScreenManager.SCREEN_CONTAINER_ID, null);
				
				searchHandle = true;
				ViewManager.getView("#repoSearchMessageContainer").clearAlert("repoSearchFail");
				//ViewManager.getView("#repoSearchResults").showProgressMessage();
				ViewManager.getView("#repoSearchResults").deselectAll();
				
				if($("#repoResults-data").first().children().size() == 0)
					ViewManager.getView("#repoSearchResults").showProgressMessage();
				
				var params = {};
				params.size = maxLength;
				params.start = start;
				params.ownership = ownership;
				params.types = types;
				
				AppController.repoInterface.searchWithParams(query, params, null, callback, errorSearching);
			}
		}, 100);
	}
	
	function clearDisplayResults(results)
	{
		ViewManager.getView("#repoSearchResults").clear();
		displayResults(results);
	}
	
	function displayResults(results)
	{ 
		ViewManager.getView("#repoSearchResults").populate(results);
		
		var rows = $("#repoResults-data").first().children();
		
		if(results.length == 0)
		{
			ViewManager.getView("#repoSearchResults").showNoDataMessage();
		}else if(results.length < maxLength){
			$("#moreSearchResults").addClass("hide");
			//$(window).off("scroll", scrollSearchHandler);
		}else{
			$("#getMoreResults").click(function(){
				$("#getMoreResults").addClass("hide");
				$("#loadingMoreResults").removeClass("hide");
				runRepoSearch($("#repoResults-data").first().children().size());
			})
			
			$("#getMoreResults").removeClass("hide");
			$("#moreSearchResults").removeClass("hide");
			$("#loadingMoreResults").addClass("hide");
			
			//$(window).scroll(scrollSearchHandler)
		}
		
		searchHandle = null;
	}
	
//	function scrollSearchHandler(){
//		var resultDiv = $("#repoResults-data").first(); 
//		
//		if(resultDiv.size() == 0){
//			$(window).off("scroll", scrollSearchHandler);
//		}
//		else if(($(window).height() + document.body.scrollTop) > ($(document).height() - 30))
//		{
//			//$("#moreSearchResults").addClass("hide");
//			//$("#loadingMoreResults").removeClass("hide");
//			runRepoSearch(resultDiv.children().size());
//		}
//	}
	
	function errorDisplayingTypes(errorMsg){
		if(errorMsg == undefined || errorMsg == "" )
			errorMsg = "Unable to retrieve type list";
		
		ViewManager.getView("#repoSearchMessageContainer").displayAlert(errorMsg, "repoTypesFail");
		$("#repoSearchTypeContainer").addClass("hide");
	}
	
	function errorSearching(errorMsg){
		if(errorMsg == undefined || errorMsg == "" )
			errorMsg = "Unable to connect to server to retrieve search results";
		
		ViewManager.getView("#repoSearchMessageContainer").displayAlert(errorMsg, "repoSearchFail");
		searchHandle = null;
	}
	
	function viewResult(data)
	{
		ScreenManager.changeScreen(new RepoViewScreen(data));
	}
	
	
	var urlTypes;
	function displayTypes(typeObjects)
	{
		if($(typeObjects).size() == 0)
			errorDisplayingTypes("No Types Returned");
		
		$("#repoSearchTypes li.type").remove();
		for(var i in typeObjects)
		{
			var typeObject = typeObjects[i];
			
			var fullType = typeObject.key;
			var count = typeObject.doc_count;
			
			var typeSplit = fullType.split("/");
			var shortType = typeSplit[typeSplit.length-1];
			shortType = shortType.slice(0,1).toUpperCase() + shortType.slice(1, shortType.length);

			var el;
			if(urlTypes == undefined){
				el = $("<li class='type'><label></label></li>");
				el.find("label").attr("title", fullType);
				el.find("label").text(shortType+' ('+count+')');
				el.find("label").prepend("<input type='checkbox' style='margin-bottom:0.5rem;' checked='checked'/>");
			}else{
				el = $("<li class='type'><label></label></li>");
				el.find("label").attr("title", fullType);
				el.find("label").text(shortType+' ('+count+')');
				el.find("label").prepend("<input type='checkbox' style='margin-bottom:0.5rem;'/>");
				if($.inArray(fullType, urlTypes) != -1)
					el.find("input").attr("checked", "checked");
				
				if(urlTypes.length == 1 && $.inArray(fullType, urlTypes) != -1){
					$("#repoSearchTypesText").text(shortType+' ('+count+')');
				}
			}
				
			$("#repoSearchTypes").prepend(el);
		}
		
		if(urlTypes != undefined && urlTypes.length > 1){
			$("#repoSearchTypesText").text(urlTypes.length + " Types Selected")
			$("#repoSearchTypesText").css("font-size", "small");
		}
		
		var selectToggle = $("#repoSearchSelectAllToggle");
		selectToggle.click(function(){
			if(selectToggle.text().indexOf("Deselect") == -1){
				$("#repoSearchTypes input:checkbox").prop('checked', true);
				selectToggle.text("Deselect All");
				$("#repoSearchTypes input:checkbox").trigger("change");
			}else{
				$("#repoSearchTypes input:checkbox").prop('checked', false);
				selectToggle.text("Select All");
			}
		})
		
		var typesChanged = false;
		$("#repoSearchTypes input:checkbox").change(function(){
			typesChanged = true;
		})
		
		var el = new Foundation.Dropdown($("#repoSearchTypes"));
		
		$(el.$element).bind("hide.zf.dropdown", function(ev){
			
			var checked = $("#repoSearchTypes input:checked");
			
			var typeText;
			if(checked.size() == 0 || checked.size() == $("#repoSearchTypes input").size()){
				typeText = "All";
				$("#repoSearchTypes input:checkbox").prop('checked', true);
				selectToggle.text("Deselect All");
				$("#repoSearchTypesText").css("font-size", "normal");
			}else if(checked.size() == 1){
				typeText = checked.closest("label").text();
				$("#repoSearchTypesText").css("font-size", "normal");
			}else{
				typeText = checked.size() + " Types Selected";
				$("#repoSearchTypesText").css("font-size", "small");
			}
			
			$("#repoSearchTypesText").text(typeText);
			
			if(typesChanged){
				typesChanged = false;
				runRepoSearch();
			}
				
		})
	}
	
	RepoSearchScreen.prototype.display = function(containerId, callback)
	{
		var lastViewed = this.lastViewed;
		searchHandle = null;
		
		var query = this.query;
		var ownership = this.ownership;
		urlTypes = this.types;
	
		ViewManager.showView(new MessageContainer("repoSearch"), "#repoSearchMessageContainer");
		
		ViewManager.showView(new DataViewer("repoResults", {}), "#repoSearchResults");
		
		$("#repoSearchBtn").click(function(event){
			event.preventDefault();
			runRepoSearch();
		});
		$("#repoSearchOwnership").change(function(event){
			event.preventDefault();
			runRepoSearch();
		});
		
		
		$("#repoSearchText").keypress(function(e){
			var key = e.which;
			if(key == 13)  // the enter key code
			{
				runRepoSearch();
			}
		});
		if(query != null)
			$("#repoSearchText").val(query);
		
		if(LoginController.getLoggedIn())
		{
			$("#repoSearchOwnership").attr("max", 4);
			$("#repoSearchOwnershipLoggedIn").removeClass("hide");
			$("#repoSearchOwnershipPublic").addClass("hide");
		}
		else
		{
			$("#repoSearchOwnershipLoggedIn").addClass("hide");
			$("#repoSearchOwnershipPublic").removeClass("hide");
		}
		if(ownership != null){
			if(ownership == "public")
				ownership = 1;
			else if(ownership == "owned")
				ownership = 3;
			else if(ownership == "me")
				ownership = 4
			
			$("#repoSearchOwnership").val(ownership);
		}
			
		AppController.repoInterface.listTypes(displayTypes, errorDisplayingTypes);
		
		runRepoSearch();
	};
	
	return RepoSearchScreen;
})(RepoSearchScreen);