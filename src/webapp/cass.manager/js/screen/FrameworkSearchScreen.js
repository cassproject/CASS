/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
FrameworkSearchScreen = (function(FrameworkSearchScreen){
	
	var searchHandle = null;
	
	function runFrameworkSearch(){
		var query = $("#frameworkSearchText").val();

		if (query == null || query == "")
			query = "*";
		if (searchHandle != null)
			clearTimeout(searchHandle);
		
		var ownership = $("#frameworkSearchOwnership").val();
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
			
			ViewManager.getView("#frameworkSearchMessageContainer").clearAlert("searchFail");
			$("#frameworkSearchResults").html("");
			$("#frameworkSearchProgress").removeClass("hide");
			$("#frameworkSearchNone").addClass("hide");
			
			AppController.searchController.frameworkSearch(query, displayResults, errorSearching, ownership);
		}, 100);
	}
	
	function displayResults(results)
	{ 
		var tile = '<div class="tile" tabindex="0" style="display:block"><div class="cube app competency"><div class="front"><p class="title"></p></div><div class="back"><p class="status"></p><div class="actions"></div></div></div><a class="hotspot finger" title=""></a></div>';

	    $("#frameworkSearchResults").html("");
	    
	    if($(results).size() == 0){
	    	$("#frameworkSearchNone").removeClass("hide");
	    }
	    
	    $(results).each(function(index, framework){
		    $("#frameworkSearchResults").append(tile);
	        var t = $("#frameworkSearchResults").children(".tile").last();
	        var name = framework["name"];
	        t.find(".title").text(name);
	        t.attr("id", framework.id);
	        
	        t.click(function(e){
	        	e.preventDefault();
	        	viewFramework(framework);
	        });
	    });
	    
		searchHandle = null;
		
		$("#frameworkSearchProgress").addClass("hide");
	}
	
	function errorSearching(err){
		if(err == undefined)
			err = "Unable to Connect to Server for Competency Search";
		
		ViewManager.getView("#competencySearchMessageContainer").displayAlert(err, "searchFail");
		
		$("#frameworkSearchNone").removeClass("hide");
		$("#frameworkSearchProgress").addClass("hide");
	}
	
	function viewFramework(framework){
		ScreenManager.changeScreen(new FrameworkViewScreen(framework));
	}
	
	FrameworkSearchScreen.prototype.display = function(containerId, callback)
	{
		var lastViewed = this.lastViewed;
		
		var query = this.query;
		var ownership = this.ownership;
		
		$(containerId).load("partial/screen/frameworkSearch.html", function(){
			
			ViewManager.showView(new MessageContainer("frameworkSearch"), "#frameworkSearchMessageContainer");
			
			$("#frameworkSearchSubmit").click(function(event){
				event.preventDefault();
				runFrameworkSearch();
			});
			
			$("#frameworkSearchBtn").attr("href", FrameworkSearchScreen.prototype.displayName);
			$("#frameworkSearchBtn").click(function(e){
				e.preventDefault();
			})
			
			$("#frameworkSearchViewBtn").attr("href", CompetencyViewScreen.prototype.displayName);
			if(lastViewed != undefined)
			{
				$("#frameworkSearchViewBtn").removeClass("hide");
				$("#frameworkSearchViewBtn").click(function(e){
					e.preventDefault();
					viewFramework(lastViewed);
				})
			}
			else
			{
				$("#frameworkSearchViewBtn").click(function(e){
					e.preventDefault();
				})
			}
			
			$("#frameworkSearchText").keypress(function(e){
				var key = e.which;
				if(key == 13)  // the enter key code
				{
					runFrameworkSearch();
				}
			});
			
			if(query != null)
				$("#frameworkSearchText").val(query)
			
			if(LoginController.getLoggedIn())
			{
				$("#frameworkSearchOwnership").attr("max", 4);
				$("#frameworkSearchOwnershipLoggedIn").removeClass("hide");
				$("#frameworkSearchOwnershipPublic").addClass("hide");
			}
			else
			{
				$("#frameworkSearchOwnershipLoggedIn").addClass("hide");
				$("#frameworkSearchOwnershipPublic").removeClass("hide");
			}
			
			if(ownership != null){
				if(ownership == "public")
					ownership = 1;
				else if(ownership == "owned")
					ownership = 3;
				else if(ownership == "me")
					ownership = 4
				
				$("#frameworkSearchOwnership").val(ownership);
			}
			
			runFrameworkSearch();
			
			if(callback != undefined)
				callback();
		});
	};
	
	return FrameworkSearchScreen;
})(FrameworkSearchScreen);