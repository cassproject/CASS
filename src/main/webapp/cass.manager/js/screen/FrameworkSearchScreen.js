/**
 * Screen that handles searching and displaying frameworks
 * 
 * @module cass.manager
 * @class FrameworkSearchScreen
 * 
 * @author devlin.junker@eduworks.com
 */
FrameworkSearchScreen = (function(FrameworkSearchScreen){
	
	var maxLength = 24;
	var searchHandle = null;
	
	/**
	 * Handles running the framework search with the parameters set in the DOM
	 * 
	 * @memberOf FrameworkSearchScreen
	 * @method runFrameworkSearch
	 * @private
	 * @param {int} start
	 * 			Where to start the search results at in the repository
	 */
	function runFrameworkSearch(start){
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
				
			
			ViewManager.getView("#frameworkSearchMessageContainer").clearAlert("searchFail");
			//ViewManager.getView("#frameworkSearchResults").showProgressMessage();
			ViewManager.getView("#frameworkSearchResults").deselectAll();
			
			var params = {};
			params.ownership = ownership;
			params.size = maxLength;
			params.start = start;
			
			EcFramework.search(AppController.serverController.getRepoInterface(), query, callback, errorSearching, params);
		}, 100);
	}
	
	/**
	 * Clears the currently displayed results before showing the results
	 * 
	 * @memberOf FrameworkSearchScreen
	 * @method clearDisplayResults
	 * @private
	 * @param {EcFramework[]} results
	 * 			Results of the framework search
	 */
	function clearDisplayResults(results)
	{
		ViewManager.getView("#frameworkSearchResults").clear();
		displayResults(results);
	}
	
	/**
	 * Displays the results of the framework search, appends them to the DataViewer table
	 * 
	 * @memberOf FrameworkSearchScreen
	 * @method displayResults
	 * @private
	 * @param {EcFramework[]} results
	 */
	function displayResults(results)
	{  
		ViewManager.getView("#menuContainer").showSortBasic();
		ViewManager.getView("#frameworkSearchResults").populate(results);
		
		if(results.length == 0 && $("#frameworkResults-data").first().children().size() == 0){
			ViewManager.getView("#frameworkSearchResults").showNoDataMessage();
		}else if(results.length < maxLength){
			$("#moreSearchResults").addClass("hide");
			//$(window).off("scroll", scrollSearchHandler);
		}else{
			$("#getMoreResults").click(function(){
				$("#getMoreResults").addClass("hide");
				$("#loadingMoreResults").removeClass("hide");
				runFrameworkSearch($("#frameworkResults-data").first().children().size());
			})
			
			$("#getMoreResults").removeClass("hide");
			$("#moreSearchResults").removeClass("hide");
			$("#loadingMoreResults").addClass("hide");
			
			//$(window).scroll(scrollSearchHandler)
		}
		
		searchHandle = null;
	}
	
//	function scrollSearchHandler(){
//		var resultDiv = $("#frameworkResults-data").first(); 
//		
//		if(resultDiv.size() == 0){
//			$(window).off("scroll", scrollSearchHandler);
//		}
//		else if(($(window).height() + document.body.scrollTop) > ($(document).height() - 30))
//		{
//			//$("#moreSearchResults").addClass("hide");
//			//$("#loadingMoreResults").removeClass("hide");
//			runFrameworkSearch(resultDiv.children().size());
//		}
//	}
	
	/**
	 * Handles displaying errors that occur during search
	 * 
	 * @memberOf FrameworkSearchScreen
	 * @method errorSearching
	 * @private
	 * @param {String} err
	 * 			Error message to display
	 */
	function errorSearching(err){
		if(err == undefined)
			err = "Unable to Connect to Server for Competency Search";
		
		ViewManager.getView("#frameworkSearchMessageContainer").displayAlert(err, "searchFail");
		
		ViewManager.getView("#frameworkSearchResults").showNoDataMessage();
	}
	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf FrameworkSearchScreen
	 * @method display
	 * @param containerId
	 * 			Screen Container DOM ID
	 */
	FrameworkSearchScreen.prototype.display = function(containerId)
	{
		var lastViewed = this.lastViewed;
		
		var query = this.query;
		var ownership = this.ownership;
	
		ViewManager.showView(new MessageContainer("frameworkSearch"), "#frameworkSearchMessageContainer");
		
		ViewManager.showView(new DataViewer("frameworkResults", {
			sort:{},
			clickDataEdit:function(datum){
				ScreenManager.changeScreen(new FrameworkEditScreen(datum));
			},
			moreMenuTools:function(){
				var container = $("<div></div>");
				
				el = $("<li><span><i class='fa fa-download'></i> Export</span></li>");
				
				el.click(function(){
					var selected = ViewManager.getView("#frameworkSearchResults").getSelected();
					
					ModalManager.showModal(new RepoExportModal(selected));
				})
				
				container.append(el);
				
				return container.contents();
			},
			buildDataRow:function(row, id, datum){
				var comps = (datum.competency == undefined ? 0 : datum.competency.length);
				var rels = (datum.relation == undefined ? 0 : datum.relation.length)
				
				row.append("<div class='small-4 columns'><a class='datum-name'></a></div>" +
							"<div class='small-2 columns'>"+ comps + (comps == 1 ? " Competency" : " Competencies") +"</div>" +
							"<div class='small-2 columns'>"+ rels + (rels == 1 ? " Relationship" : " Relationships")+"</div>" +
							"<div class='small-4 columns datum-owner'></div>");
				
				if(datum.name != undefined && datum.name != ""){
					row.find(".datum-name").text(datum.name);
				}else{
					row.find(".datum-name").html("<i>No Name</i>");
				}
					
				
				if(datum["owner"] != undefined && datum["owner"].length > 0){
					for(var i in datum["owner"]){
						var trimId = EcRemoteLinkedData.trimVersionFromUrl(id)
						var idEnd = trimId.split("/")[trimId.split("/").length-1];
						var elId = idEnd+"-owner-"+i;
						
						var ownerEl = $("<span id='"+elId+"'></span>")
						row.find(".datum-owner").append(ownerEl);
						
						ViewManager.showView(new IdentityDisplay(datum["owner"][i]), "#"+elId)
					}
				}else{
					row.find(".datum-owner").text("Public");
				}
				
				
				row.find(".datum-name").click(function(ev){
					ev.preventDefault();
					ScreenManager.changeScreen(new FrameworkViewScreen(datum));
				});
				
			}
		}), "#frameworkSearchResults");
		
		$("#frameworkSearchSubmit").click(function(event){
			event.preventDefault();
			runFrameworkSearch();
		});			
		$("#frameworkSearchOwnership").change(function(event){
			event.preventDefault();
			runFrameworkSearch();
		});

		
		$("#frameworkSearchText").keypress(function(e){
			var key = e.which;
			if(key == 13)  // the enter key code
			{
				runFrameworkSearch();
			}
		});
		
		if(query != null)
			$("#frameworkSearchText").val(query)
		
		if(AppController.loginController.getLoggedIn())
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
		
		ViewManager.getView("#menuContainer").showSortBasic();
	};
	
	/**
	 * Overridden onClose callback, called when leaving screen
	 * 
	 * @memberOf FrameworkSearchScreen
	 * @method onClose
	 */
	FrameworkSearchScreen.prototype.onClose = function(){
		ViewManager.getView("#menuContainer").hideSort();
	}
	
	FrameworkSearchScreen.prototype.sortByTimestamp = function(){
		$("#frameworkResults-sortSelect").val("timestamp");
		$("#frameworkResults-sortSelect").trigger("change");
	}
	
	FrameworkSearchScreen.prototype.sortByOwner = function(){
		$("#frameworkResults-sortSelect").val("owner");
		$("#frameworkResults-sortSelect").trigger("change");
	}
	
	FrameworkSearchScreen.prototype.filterPublic = function(){
		$("#frameworkSearchOwnership").val(1);
		runFrameworkSearch();
	}
	
	FrameworkSearchScreen.prototype.filterAll = function(){
		$("#frameworkSearchOwnership").val(2);
		runFrameworkSearch();
	}
	
	FrameworkSearchScreen.prototype.filterOwned = function(){
		$("#frameworkSearchOwnership").val(3);
		runFrameworkSearch();
	}
	
	FrameworkSearchScreen.prototype.filterOwnedByMe = function(){
		if(!AppController.loginController.getLoggedIn()){
			return;
		}
		
		$("#frameworkSearchOwnership").val(4);
		runFrameworkSearch();
	}
	
	/**
	 * Sets the search parameters on the view, so they can be reloaded if the page is
	 * 
	 * @memberOf FrameworkSearchScreen
	 * @method setParams
	 * @param {Object} params
	 */
	FrameworkSearchScreen.prototype.setParams = function(params)
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
	 * @memberOf FrameworkSearchScreen
	 * @method clearParams
	 */
	FrameworkSearchScreen.prototype.clearParams = function(){
		this.query = undefined;
		this.ownership = undefined;
	}
	
	return FrameworkSearchScreen;
})(FrameworkSearchScreen);