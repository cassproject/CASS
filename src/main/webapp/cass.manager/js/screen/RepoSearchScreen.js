/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
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
				if(types != undefined)
					urlParams.types = types;
				if(query != "*")
					urlParams.query = query;
				if(ownership != "all")
					urlParams.ownership = ownership;
				
				if(Object.keys(urlParams).length > 0)
					ScreenManager.replaceHistory(ScreenManager.getCurrentScreen(), ScreenManager.SCREEN_CONTAINER_ID, urlParams);
				else
					ScreenManager.replaceHistory(ScreenManager.getCurrentScreen(), ScreenManager.SCREEN_CONTAINER_ID, null);
				
				searchHandle = true;
				ViewManager.getView("#repoSearchMessageContainer").clearAlert("repoSearchFail");
				$("#repoSearchNone").addClass("hide");
				$("#repoSearchProgress").removeClass("hide");
				
				var params = {};
				params.size = maxLength;
				params.start = start;
				params.ownership = ownership;
				params.types = types;
				
				AppController.searchController.search(query, callback, errorSearching, params);
			}
		}, 100);
	}
	
	function clearDisplayResults(results)
	{
		var resultDiv = $("#repoSearchResultsPrivate").first(); 
		var height = resultDiv.height()
		resultDiv.css("height",height+"px");
		resultDiv.html("");
		
		displayResults(results);
	}
	
	function displayResults(results)
	{ 
		var resultDiv = $("#repoSearchResultsPrivate").first(); 
		
		var prevCount = resultDiv.children().length;
		
		$(results).each(function(idx, item){
			$("<div></div>").load("partial/element/searchResult.html", function(){
				$(this).addClass("tile");
				$(this).attr("tabindex", idx);
				
				
				var type = item.type;
				type = type.split("/");
				type = type[type.length - 1];
				$(this).find(".title").text(type);
				$(this).attr("id", item.id);
				
				$(this).click(function(){
					AppController.repositoryController.view($(this).attr("id"), viewResult);
				})
				
				resultDiv.append(this);
				
				if(resultDiv.children().length == prevCount+results.length)
				{
					resultDiv.css("height","");
					
					$("#repoSearchProgress").addClass("hide");
				}
			});
		});
		
		if(results.length == 0)
		{
			resultDiv.css("height","");
			
			$("#repoSearchNone").removeClass("hide");
			$("#repoSearchProgress").addClass("hide");
		}else if(results.length < maxLength){
			$("#moreSearchResults").addClass("hide");
			$(window).off("scroll", scrollSearchHandler);
		}else{
			$("#getMoreResults").click(function(){
				$("#moreSearchResults").addClass("hide");
				runRepoSearch(resultDiv.children().length);
			})
			
			$(window).scroll(scrollSearchHandler)
			
			$("#moreSearchResults").removeClass("hide");
		}
		
		searchHandle = null;
	}
	
	function scrollSearchHandler(){
		var resultDiv = $("#repoSearchResultsPrivate").first(); 
		if(($(window).height() + document.body.scrollTop) > ($(document).height() - 30))
		{
			$("#moreSearchResults").addClass("hide");
			runRepoSearch(resultDiv.children().size());
		}
	}
	
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
		
		$("#repoSearchTypes").html("");
		for(var i in typeObjects)
		{
			var typeObject = typeObjects[i];
			
			var fullType = typeObject.key;
			var count = typeObject.doc_count;
			
			var typeSplit = fullType.split("/");
			var shortType = typeSplit[typeSplit.length-1];
			shortType = shortType.slice(0,1).toUpperCase() + shortType.slice(1, shortType.length);

			if(urlTypes == undefined){
				var html = '<label title="'+fullType+'">'
	    			+ '<input type="checkbox" style="margin-bottom:0.5rem;" checked>'
	    			+ shortType+' ('+count+')'
	    			+'</label>';
			}else{
				var html = '<label title="'+fullType+'">'
    			+ '<input type="checkbox" style="margin-bottom:0.5rem;"';
				
				html += $.inArray(fullType, urlTypes) != -1 ? "checked" : "";
				
				html += '>'
    			+ shortType+' ('+count+')'
    			+'</label>';
			}
			
			
			
			$("#repoSearchTypes").append(html);
		}
		
		var selectToggle = $("#repoSearchSelectAllToggle");
		selectToggle.click(function(){
			if(selectToggle.text().indexOf("Deselect") == -1){
				$("#repoSearchTypes input:checkbox").prop('checked', true);
				selectToggle.text("Deselect All");
			}else{
				$("#repoSearchTypes input:checkbox").prop('checked', false);
				selectToggle.text("Select All");
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
		
		$(containerId).load("partial/screen/repoSearch.html", function(){
			ViewManager.showView(new MessageContainer("repoSearch"), "#repoSearchMessageContainer");
			
			$("#repoSearchBtn").click(function(event){
				event.preventDefault();
				runRepoSearch();
			});
			
			if(lastViewed != undefined)
			{
				$("#repoSearchViewBtn").attr("href", "#"+RepoViewScreen.prototype.displayName);
				$("#repoSearchViewBtn").removeClass("hide");
				$("#repoSearchViewBtn").click(function(event){
					event.preventDefault();
					ScreenManager.changeScreen(new RepoViewScreen(lastViewed));
				});
			}
			
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
				
			
			AppController.searchController.getTypes(displayTypes, errorDisplayingTypes);
			
			runRepoSearch();
			
			if(callback != undefined)
				callback();
		});
	};
	
	return RepoSearchScreen;
})(RepoSearchScreen);