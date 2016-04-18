/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
CompetencySearchScreen = (function(CompetencySearchScreen){
	
	var searchHandle = null;
	
	function runCompetencySearch(){
		var query = $("#competencySearchText").val();

		if (query == null || query == "")
			query = "*";
		if (searchHandle != null)
			clearTimeout(searchHandle);
		
		var ownership = $("#competencySearchOwnership").val();
		if(ownership == 1)
			ownership = "public";
		else if(ownership == 3)
			ownership = "owned";
		else if(ownership == 4)
			ownership = "me"
		else
			ownership = "all";
		
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
			
			ViewManager.getView("#competencySearchMessageContainer").clearAlert("searchFail");
			$("#competencySearchResults").html("");
			$("#competencySearchProgress").removeClass("hide");
			$("#competencySearchNone").addClass("hide");
			
			var params = {};
			params.ownership = ownership;
			
			AppController.searchController.competencySearch(query, displayResults, errorSearching, ownership);
		}, 100);
	}
	
	function displayResults(results)
	{ 
		var tile = '<div class="tile" tabindex="0" style="display:block"><div class="cube app competency"><div class="front"><p class="title"></p></div><div class="back"><p class="status"></p><div class="actions"></div></div></div><a class="hotspot finger" title=""></a></div>';

	    $("#competencySearchResults").html("");
	    
	    if($(results).size() == 0){
	    	$("#competencySearchNone").removeClass("hide");
	    }
	    
	    $(results).each(function(index, competency){
		    $("#competencySearchResults").append(tile);
	        var t = $("#competencySearchResults").children(".tile").last();
	        var name = competency["name"];
	        t.find(".title").text(name);
	        t.attr("id", competency.id);
	        
	        t.click(function(e){
	        	e.preventDefault();
	        	viewCompetency(competency);
	        });
	    });
	    
		searchHandle = null;
		
		$("#competencySearchProgress").addClass("hide");
	}
	
	function errorSearching(err){
		if(err == undefined)
			err = "Unable to Connect to Server for Competency Search";
		
		ViewManager.getView("#competencySearchMessageContainer").displayAlert(err, "searchFail");
		
		$("#competencySearchNone").removeClass("hide");
		$("#competencySearchProgress").addClass("hide");
	}
	
	function viewCompetency(competency){
		ScreenManager.changeScreen(new CompetencyViewScreen(competency));
	}
	
	CompetencySearchScreen.prototype.display = function(containerId, callback)
	{
		var lastViewed = this.lastViewed;
		
		var query = this.query;
		var ownership = this.ownership;
		
		$(containerId).load("partial/screen/competencySearch.html", function(){
			
			ViewManager.showView(new MessageContainer("competencySearch"), "#competencySearchMessageContainer");
			
			$("#competencySearchSubmit").click(function(event){
				event.preventDefault();
				runCompetencySearch();
			});
			
			$("#competencySearchBtn").attr("href", CompetencySearchScreen.prototype.displayName);
			$("#competencySearchBtn").click(function(e){
				e.preventDefault();
			})
			
			$("#competencySearchViewBtn").attr("href", CompetencyViewScreen.prototype.displayName);
			if(lastViewed != undefined)
			{
				$("#competencySearchViewBtn").removeClass("hide");
				$("#competencySearchViewBtn").click(function(e){
					e.preventDefault();
					viewCompetency(lastViewed);
				})
			}
			else
			{
				$("#competencySearchViewBtn").click(function(e){
					e.preventDefault();
				})
			}
			
			$("#competencySearchText").keypress(function(e){
				var key = e.which;
				if(key == 13)  // the enter key code
				{
					runCompetencySearch();
				}
			});
			
			if(query != null)
				$("#competencySearchText").val(query)
			
			if(LoginController.getLoggedIn())
			{
				$("#competencySearchOwnership").attr("max", 4);
				$("#competencySearchOwnershipLoggedIn").removeClass("hide");
				$("#competencySearchOwnershipPublic").addClass("hide");
			}
			else
			{
				$("#competencySearchOwnershipLoggedIn").addClass("hide");
				$("#competencySearchOwnershipPublic").removeClass("hide");
			}
			
			if(ownership != null){
				if(ownership == "public")
					ownership = 1;
				else if(ownership == "owned")
					ownership = 3;
				else if(ownership == "me")
					ownership = 4
				
				$("#competencySearchOwnership").val(ownership);
			}
			
			runCompetencySearch();
			
			if(callback != undefined)
				callback();
		});
	};
	
	return CompetencySearchScreen;
})(CompetencySearchScreen);