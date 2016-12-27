/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
/**
 * Screen that handles displaying search results of relationships
 * 
 * @module cass.manager
 * @class RelationshipSearchScreen
 * 
 * @author devlin.junker@eduworks.com
 */
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
	
	/**
	 * Handles getting search params from DOM and initiating search request
	 * 
	 * @memberOf RelationshipSearchScreen
	 * @method runRelationshipSearch 
	 * @private
	 * @param {int} start 
	 * 			index to start search (number of results already displayed)
	 */
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
			
			if(Object.keys(urlParams).length > 0){
				ScreenManager.setScreenParameters(urlParams);
				ScreenManager.getCurrentScreen().setParams(urlParams);
			}else{
				ScreenManager.setScreenParameters(null);
				ScreenManager.getCurrentScreen().clearParams();
			}
			
			ViewManager.getView("#relationshipSearchMessageContainer").clearAlert("searchFail");
			//ViewManager.getView("#relationshipSearchResults").showProgressMessage();
			ViewManager.getView("#relationshipSearchResults").deselectAll();
			
			var params = {};
			params.ownership = ownership;
			params.size = maxLength;
			params.start = start;
			
			EcAlignment.search(AppController.serverController.getRepoInterface(), query, callback, errorSearching, params);
		}, 100);
	}
	
	/**
	 * Clears all results on screen before appending new results to Data Viewer
	 * 
	 * @memberOf RelationshipSearchScreen
	 * @method clearDisplayResults 
	 * @private
	 * @param {EcAlignment[]} results
	 * 			Results to display in the Data Viewer
	 */
	function clearDisplayResults(results)
	{
		ViewManager.getView("#relationshipSearchResults").clear();
		displayResults(results);
	}
	
	/**
	 * Just appends new results to Data Viewer
	 * 
	 * @memberOf RelationshipSearchScreen
	 * @method runRelationshipSearch 
	 * @private
	 * @param {EcAlignment[]} results
	 * 			Results to display in the Data Viewer
	 */
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
	
	/**
	 * Handles displaying errors during search
	 * 
	 * @memberOf RelationshipSearchScreen
	 * @method errorSearching 
	 * @private
	 * @param {String} err
	 * 			Error message to display
	 */
	function errorSearching(err){
		if(err == undefined)
			err = "Unable to Connect to Server for Competency Search";
		
		ViewManager.getView("#relationshipSearchMessageContainer").displayAlert(err, "searchFail");
		
		ViewManager.getView("#relationshipSearchResults").showNoDataMessage();
	}
	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf RelationshipSearchScreen
	 * @method display
	 * @param containerId
	 * 			Screen Container DOM ID
	 */
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
			buildDataRow:function(row, id, datum){				
				row.append("<a>" +
								"<div class='small-3 columns datum-source' style='font-weight:bold'></div> " +
								"<div class='small-2 columns datum-type' style='font-style:italic'></div>" +
								"<div class='small-3 columns end datum-target'></div>" +
							"</a>" +
							"<div class='small-4 columns datum-owner'></div>");
				
				if(datum["owner"] == undefined || datum["owner"].length == 0){
					row.find(".datum-owner").html("Public");
				}else{
					for(var i in datum["owner"]){
						var trimId = EcRemoteLinkedData.trimVersionFromUrl(id)
						var idEnd = trimId.split("/")[trimId.split("/").length-1];
						var elId = idEnd+"-owner-"+i;
						
						var ownerEl = $("<span id='"+elId+"'></span>")
						row.find(".datum-owner").append(ownerEl);
						
						ViewManager.showView(new IdentityDisplay(datum["owner"][i]), "#"+elId)
					}
				}
				
				
				EcCompetency.get(datum.source, function(competency){
					$("[data-id='"+datum.id+"']").find(".datum-source").text(competency.name)
				}, function(){
					row.find(".datum-source").text("Unknown Competency");
				})
				row.find(".datum-source").text("Loading..");
				
				EcCompetency.get(datum.target, function(competency){
					$("[data-id='"+datum.id+"']").find(".datum-target").text(competency.name)
				}, function(){
					row.find(".datum-target").text("Unknown Competency");
				})
				row.find(".datum-target").text("Loading..");
				
				if(relationTypes[datum.relationType] != undefined){
					row.find(".datum-type").text(relationTypes[datum.relationType])
				}else{
					row.find(".datum-type").text("has a relationship with");
				}
				
				row.find("a").click(function(ev){
					ev.preventDefault();
					ScreenManager.changeScreen(new RelationshipViewScreen(datum));
				})
				
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
	
	/**
	 * Sets the search parameters on the view, so they can be reloaded if the page is
	 * 
	 * @memberOf RelationshipSearchScreen
	 * @method setParams
	 * @param {Object} params
	 */
	RelationshipSearchScreen.prototype.setParams = function(params)
	{
		if(params == undefined){
			this.clearParams();
			return;
		}
		
		this.query = params.query;
		this.ownership = params.ownership;
	}
	
	/**
	 * Handles getting search parameters from DOM and running
	 * basic Repository search
	 * 
	 * @memberOf RelationshipSearchScreen
	 * @method clearParams
	 */
	RelationshipSearchScreen.prototype.clearParams = function(){
		this.query = undefined;
		this.ownership = undefined;
	}
	
	return RelationshipSearchScreen;
})(RelationshipSearchScreen);