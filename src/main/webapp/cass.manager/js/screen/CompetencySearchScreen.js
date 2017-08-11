/**
 * Screen for displaying search results from a competency search in 
 * a DataViewer view. 
 * 
 * @module cass.manager
 * @class CompetencySearchScreen
 *  
 * @author devlin.junker@eduworks.com
 */
CompetencySearchScreen = (function(CompetencySearchScreen){
	
	var maxLength = 24;
	
	var searchHandle = null;
	
	/**
     * Method to run the competency search on the server
     * 
     * @memberOf CompetencySearchScreen
     * @method runCompetencySearch
     * @private
     * @param {int} start
     */
	function runCompetencySearch(start){
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
				
			
			ViewManager.getView("#competencySearchMessageContainer").clearAlert("searchFail");
			//ViewManager.getView("#competencySearchResults").showProgressMessage();
			ViewManager.getView("#competencySearchResults").deselectAll();
			
			var params = {};
			params.ownership = ownership;
			params.size = maxLength;
			params.start = start;
			
			EcCompetency.search(AppController.serverController.getRepoInterface(), query, callback, errorSearching, params);
		}, 100);
	}
	
	/**
	 * Clears the data in the DataViewer so that the table is empty
	 * and then displays the results
	 * 
	 * @memberOf CompetencySearchScreen
	 * @method clearDisplayResults
	 * @private	
	 * @param {Array<EcCompetency>} results
	 * 			results to display after clearing the DataViewer
	 */
	function clearDisplayResults(results)
	{
		ViewManager.getView("#competencySearchResults").clear();
		displayResults(results);
	}
	
	/**
	 * Displays results of the search, by appending them to the table,
	 * does some checks on the number of results to see what interfaces 
	 * should be visible
	 * 
	 * @memberOf CompetencySearchScreen
	 * @method displayResults
	 * @private
	 * @param {Array<EcAssertion>} results
	 * 			results to add to to the DataViewer
	 */
	function displayResults(results)
	{ 
		ViewManager.getView("#menuContainer").showSortBasic();
		ViewManager.getView("#competencySearchResults").populate(results);
		
		
		if(results.length == 0 && $("#competencyResults-data").first().children().size() == 0)
		{
			ViewManager.getView("#competencySearchResults").showNoDataMessage();
		}else if(results.length < maxLength){
			$("#moreSearchResults").addClass("hide");
			//$(window).off("scroll", scrollSearchHandler);
		}else{
			$("#getMoreResults").click(function(){
				$("#getMoreResults").addClass("hide");
				$("#loadingMoreResults").removeClass("hide");
				runCompetencySearch($("#competencyResults-data").first().children().size());
			})
			
			$("#getMoreResults").removeClass("hide");
			$("#moreSearchResults").removeClass("hide");
			$("#loadingMoreResults").addClass("hide");
			
			//$(window).scroll(scrollSearchHandler)
		}
		
		searchHandle = null;
	}
	
	/*
	function scrollSearchHandler(){
		var resultDiv = $("#competencyResults-data").first(); 
		
		if(resultDiv.children().size() == 0){
			$(window).off("scroll", scrollSearchHandler);
		}
		else if(($(window).height() + document.body.scrollTop) > ($(document).height() - 30))
		{
			//$("#moreSearchResults").addClass("hide");
			//$("#loadingMoreResults").removeClass("hide");
			runCompetencySearch(resultDiv.children().size() );
		}
	}
	*/
	
	/**
     * Called when error searching for competency
     * 
     * @memberOf CompetencySearchScreen
     * @method errorSearching
     * @private
     * @param {String} err
     * 			Error message to be displayed
     */
	function errorSearching(err){
		if(err == undefined)
			err = "Unable to Connect to Server for Competency Search";
		
		ViewManager.getView("#competencySearchMessageContainer").displayAlert(err, "searchFail");
		
		$("#competencySearchNone").removeClass("hide");
		$("#competencySearchProgress").addClass("hide");
	}

	/**
     * Called when the competency name is clicked on in the DataViewer
     * 
     * @memberOf CompetencySearchScreen
     * @method viewCompetency
     * @private 
     * @param {EcCompetency} competency	
     * 			Competency to display on the CompetencyViewScreen changed to
     */
	function viewCompetency(competency){
		ScreenManager.changeScreen(new CompetencyViewScreen(competency));
	}
	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf CompetencySearchScreen
	 * @method display
	 * @param containerId
	 * 			Screen Container DOM ID
	 */
	CompetencySearchScreen.prototype.display = function(containerId)
	{
		var lastViewed = this.lastViewed;
		
		var query = this.query;
		var ownership = this.ownership;
		
		ViewManager.showView(new MessageContainer("competencySearch"), "#competencySearchMessageContainer");
		
		ViewManager.showView(new DataViewer("competencyResults", {
			sort:{},
			clickDataEdit:function(datum){
				ScreenManager.changeScreen(new CompetencyEditScreen(datum));
			},
			moreMenuTools:function(){
				var container = $("<div></div>");
				
				var el = $("<li><span><i class='fa fa-sitemap'></i> Add to Framework</span></li>");
				
				el.click(function(){
					var selected = ViewManager.getView("#competencySearchResults").getSelected();
					
					ModalManager.showModal(new AddToFrameworkModal(selected));
				})
				
				container.append(el);
				
				el = $("<li><span><i class='fa fa-download'></i> Export</span></li>");
				
				el.click(function(){
					var selected = ViewManager.getView("#competencySearchResults").getSelected();
					
					ModalManager.showModal(new RepoExportModal(selected));
				})
				
				container.append(el);
				
				return container.contents();
			},
			buildDataRow:function(row, id, datum){
				row.append("<div class='small-8 columns'>" +
							"<a class='datum-name'></a>" +
							"<span class='datum-description'></span>" +
							"</div>" +
							"<div class='small-4 columns datum-owner'></div>");
				
				var name;
				if(datum.getName != undefined){
					name = datum.getName();
				}else if(datum["name"] != undefined){
					name = datum["name"];
				}else{
					name = id;
				}
					
				row.find(".datum-name").text(name);
				
				var desc;
				if(datum.getDescription != undefined && datum.getDescription() != null && datum.getDescription() != ""){
					desc = " - "+datum.getDescription();
				}else if(datum["description"] != undefined && datum["description"] != ""){
					desc = " - "+datum["description"];
				}else{
					desc = "";
				}
				row.find(".datum-description").text(desc);
				
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
				
				row.find("a.datum-name").click(function(ev){
					ev.preventDefault();
					ScreenManager.changeScreen(new CompetencyViewScreen(datum));
				});
				
			}
		}), "#competencySearchResults");
		
		
		$("#competencySearchSubmit").click(function(event){
			event.preventDefault();
			runCompetencySearch();
		});
		
		$("#competencySearchText").keypress(function(e){
			var key = e.which;
			if(key == 13)  // the enter key code
			{
				runCompetencySearch();
			}
		});
		
		if(query != null)
			$("#competencySearchText").val(query)
		
		if(AppController.loginController.getLoggedIn())
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
		
		ViewManager.getView("#menuContainer").showSortBasic();
	};
	
	/**
	 * Overridden onClose callback, called when leaving screen
	 * 
	 * @memberOf CompetencySearchScreen
	 * @method onClose
	 */
	CompetencySearchScreen.prototype.onClose = function(){
		ViewManager.getView("#menuContainer").hideSort();
	}
	
	CompetencySearchScreen.prototype.sortByTimestamp = function(){
		$("#competencyResults-sortSelect").val("timestamp");
		$("#competencyResults-sortSelect").trigger("change");
	}
	
	CompetencySearchScreen.prototype.sortByOwner = function(){
		$("#competencyResults-sortSelect").val("owner");
		$("#competencyResults-sortSelect").trigger("change");
	}
	
	CompetencySearchScreen.prototype.filterPublic = function(){
		$("#competencySearchOwnership").val(1);
		runCompetencySearch();
	}
	
	CompetencySearchScreen.prototype.filterAll = function(){
		$("#competencySearchOwnership").val(2);
		runCompetencySearch();
	}
	
	CompetencySearchScreen.prototype.filterOwned = function(){
		$("#competencySearchOwnership").val(3);
		runCompetencySearch();
	}
	
	CompetencySearchScreen.prototype.filterOwnedByMe = function(){
		if(!AppController.loginController.getLoggedIn()){
			return;
		}
		
		$("#competencySearchOwnership").val(4);
		runCompetencySearch();
	}
	
	/**
	 * Sets the search parameters on the view, so they can be reloaded if the page is
	 * 
	 * @memberOf CompetencySearchScreen
	 * @method setParams
	 * @param {Object} params
	 */
	CompetencySearchScreen.prototype.setParams = function(params)
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
	 * @memberOf CompetencySearchScreen
	 * @method clearParams
	 */
	CompetencySearchScreen.prototype.clearParams = function(){
		this.query = undefined;
		this.ownership = undefined;
	}
	
	return CompetencySearchScreen;
})(CompetencySearchScreen);