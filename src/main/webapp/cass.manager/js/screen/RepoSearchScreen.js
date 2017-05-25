/**
 * Screen that handles searching the repository for all objects
 * lists types of objects available in repository to be used as a paremter of search
 * 
 * @module cass.manager
 * @class RepoSearchScreen
 * 
 * @author devlin.junker@eduworks.com
 */
RepoSearchScreen = (function(RepoSearchScreen){
	
	var maxLength = 24;
	
	var searchHandle = null;
	
	/**
	 * Handles getting search parameters from DOM and running
	 * basic Repository search
	 * 
	 * @memberOf RepoSearchScreen
	 * @method runRepoSearch
	 * @private
	 * @param {int} start
	 * 			Index to begin results at in repository
	 */
	function runRepoSearch(start){
		
		if(start == undefined || start <= 0){
			ViewManager.getView("#repoSearchResults").clear();
			$("#moreSearchResults").addClass("hide");
		}
		
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
				

				if(Object.keys(urlParams).length > 0){
					ScreenManager.setScreenParameters(urlParams);
					ScreenManager.getCurrentScreen().setParams(urlParams);
				}else{
					ScreenManager.setScreenParameters(null);
					ScreenManager.getCurrentScreen().clearParams();
				}
				
				
				
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
				
				AppController.serverController.getRepoInterface().searchWithParams(query, params, null, callback, errorSearching);
			}
		}, 100);
	}
	
	/**
	 *  Clears all results on screen before appending new results to Data Viewer
	 * 
	 * @memberOf RepoSearchScreen
	 * @method clearDisplayResults
	 * @private
	 * @param {EcRemoteLinkedData[]} results
	 * 			Results to display in the Data Viewer
	 */
	function clearDisplayResults(results)
	{
		ViewManager.getView("#repoSearchResults").clear();
		displayResults(results);
	}
	
	/**
	 * Just appends new results to Data Viewer
	 * 
	 * @memberOf RepoSearchScreen
	 * @method displayResults
	 * @private
	 * @param {EcRemoteLinkedData[]} results
	 * 			Results to display in the Data Viewer
	 */
	function displayResults(results)
	{ 
		ViewManager.getView("#menuContainer").showSortBasic();
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
	
	/**
	 * Handles displaying error message when retrieving type list
	 * 
	 * @memberOf RepoSearchScreen
	 * @method errorDisplayingTypes
	 * @private
	 * @param {String} err 
	 * 			Error message to display	
	 */
	function errorDisplayingTypes(errorMsg){
		if(errorMsg == undefined || errorMsg == "" )
			errorMsg = "Unable to retrieve type list";
		
		ViewManager.getView("#repoSearchMessageContainer").displayAlert(errorMsg, "repoTypesFail");
		$("#repoSearchTypeContainer").addClass("hide");
	}
	
	/**
	 * Handles displaying errors during search
	 * 
	 * @memberOf RepoSearchScreen
	 * @method errorSearching
	 * @private
	 * @param {String} err 
	 * 			Error message to display	
	 */
	function errorSearching(errorMsg){
		if(errorMsg == undefined || errorMsg == "" )
			errorMsg = "Unable to connect to server to retrieve search results";
		
		ViewManager.getView("#repoSearchMessageContainer").displayAlert(errorMsg, "repoSearchFail");
		searchHandle = null;
	}
	
	/**
	 * Handles what happens when the user wants to view a results by clicking on name
	 * in search results
	 * 
	 * @memberOf RepoSearchScreen
	 * @method viewResult
	 * @private
	 * @param {EcRemoteLinkedData} data
	 * 			Data the user is interested in viewing
	 */
	function viewResult(data)
	{
		ScreenManager.changeScreen(new RepoViewScreen(data));
	}
	
	
	var urlTypes;
	
	/**
	 * Displays the result of retrieving all types from repository in select box
	 * 
	 * @memberOf RepoSearchScreen
	 * @method displayTypes
	 * @private
	 * @param {Object[]} typeObjects
	 * 			Array of objects returned from type search
	 */
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
	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf RepoSearchScreen
	 * @method display
	 * @param containerId
	 * 			Screen Container DOM ID
	 */
	RepoSearchScreen.prototype.display = function(containerId, callback)
	{
		var lastViewed = this.lastViewed;
		searchHandle = null;
		
		var query = this.query;
		var ownership = this.ownership;
		urlTypes = this.types;
	
		ViewManager.showView(new MessageContainer("repoSearch"), "#repoSearchMessageContainer");
		
		ViewManager.showView(new DataViewer("repoResults", {
			moreMenuTools:function(){
				var container = $("<div></div>");
				
				el = $("<li><span><i class='fa fa-download'></i> Export</span></li>");
				
				el.click(function(){
					var selected = ViewManager.getView("#repoSearchResults").getSelected();
					
					ModalManager.showModal(new RepoExportModal(selected));
				})
				
				container.append(el);
				
				return container.contents();
			}
		}), "#repoSearchResults");
		
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
		
		if(AppController.loginController.getLoggedIn())
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
			
		AppController.serverController.getRepoInterface().listTypes(displayTypes, errorDisplayingTypes);
		
		runRepoSearch();
		ViewManager.getView("#menuContainer").showSortBasic();
	};
	
	/**
	 * Overridden onClose callback, called when leaving screen
	 * 
	 * @memberOf RepoSearchScreen
	 * @method onClose
	 */
	RepoSearchScreen.prototype.onClose = function(){
		ViewManager.getView("#menuContainer").hideSort();
	}
	
	RepoSearchScreen.prototype.sortByTimestamp = function(){
		$("#repoResults-sortSelect").val("timestamp");
		$("#repoResults-sortSelect").trigger("change");
	}
	
	RepoSearchScreen.prototype.sortByOwner = function(){
		$("#repoResults-sortSelect").val("owner");
		$("#repoResults-sortSelect").trigger("change");
	}
	
	RepoSearchScreen.prototype.filterPublic = function(){
		$("#repoSearchOwnership").val(1);
		runRepoSearch();
	}
	
	RepoSearchScreen.prototype.filterAll = function(){
		$("#repoSearchOwnership").val(2);
		runRepoSearch();
	}
	
	RepoSearchScreen.prototype.filterOwned = function(){
		$("#repoSearchOwnership").val(3);
		runRepoSearch();
	}
	
	RepoSearchScreen.prototype.filterOwnedByMe = function(){
		if(!AppController.loginController.getLoggedIn()){
			return;
		}
		
		$("#repoSearchOwnership").val(4);
		runRepoSearch();
	}
	
	/**
	 * Sets the search parameters on the view, so they can be reloaded if the page is
	 * 
	 * @memberOf RepoSearchScreen
	 * @method setParams
	 * @param {Object} params
	 */
	RepoSearchScreen.prototype.setParams = function(params)
	{
		if(params == undefined){
			this.clearParams();
			return;
		}
		
		this.query = params.query;
		this.ownership = params.ownership;
		this.types = params.types;
	}
	
	/**
	 * Handles getting search parameters from DOM and running
	 * basic Repository search
	 * 
	 * @memberOf RepoSearchScreen
	 * @method clearParams
	 */
	RepoSearchScreen.prototype.clearParams = function(){
		this.query = undefined;
		this.ownership = undefined;
		this.types = undefined;
	}
	
	return RepoSearchScreen;
})(RepoSearchScreen);