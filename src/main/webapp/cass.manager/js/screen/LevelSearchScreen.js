/**
 * Screen that handles displaying search results of relationships
 * 
 * @module cass.manager
 * @class LevelSearchScreen
 * 
 * @author devlin.junker@eduworks.com
 */
LevelSearchScreen = (function(LevelSearchScreen){
	
	var maxLength = 24;
	
	var searchHandle = null;
	
	/**
	 * Handles getting search params from DOM and initiating search request
	 * 
	 * @memberOf LevelSearchScreen
	 * @method runLevelSearch 
	 * @private
	 * @param {int} start 
	 * 			index to start search (number of results already displayed)
	 */
	function runLevelSearch(start){
		var query = $("#levelSearchText").val();

		if (query == null || query == "")
			query = "*";
		if (searchHandle != null)
			clearTimeout(searchHandle);
		
		var ownership = $("#levelSearchOwnership").val();
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
			
			ViewManager.getView("#levelSearchMessageContainer").clearAlert("searchFail");
			//ViewManager.getView("#levelSearchResults").showProgressMessage();
			ViewManager.getView("#levelSearchResults").deselectAll();
			
			var params = {};
			params.ownership = ownership;
			params.size = maxLength;
			params.start = start;
			
			EcLevel.search(AppController.serverController.getRepoInterface(), query, callback, errorSearching, params);
		}, 100);
	}
	
	/**
	 * Clears all results on screen before appending new results to Data Viewer
	 * 
	 * @memberOf LevelSearchScreen
	 * @method clearDisplayResults 
	 * @private
	 * @param {EcAlignment[]} results
	 * 			Results to display in the Data Viewer
	 */
	function clearDisplayResults(results)
	{
		ViewManager.getView("#levelSearchResults").clear();
		displayResults(results);
	}
	
	/**
	 * Just appends new results to Data Viewer
	 * 
	 * @memberOf LevelSearchScreen
	 * @method runRelationshipSearch 
	 * @private
	 * @param {EcAlignment[]} results
	 * 			Results to display in the Data Viewer
	 */
	function displayResults(results)
	{  
		ViewManager.getView("#menuContainer").showSortBasic();
		ViewManager.getView("#menuContainer").showSortByCompetency();
		
		ViewManager.getView("#levelSearchResults").populate(results);
		
		if(results.length == 0 && $("#levelResults-data").first().children().size() == 0)
		{
			ViewManager.getView("#levelSearchResults").showNoDataMessage();
		}else if(results.length < maxLength){
			$("#moreSearchResults").addClass("hide");
			//$(window).off("scroll", scrollSearchHandler);
		}else{
			$("#getMoreResults").click(function(){
				$("#getMoreResults").addClass("hide");
				$("#loadingMoreResults").removeClass("hide");
				runRelationshipSearch($("#levelResults-data .row[data-id]").size());
			})
			
			$("#getMoreResults").removeClass("hide");
			$("#moreSearchResults").removeClass("hide");
			$("#loadingMoreResults").addClass("hide");
			
			//$(window).scroll(scrollSearchHandler)
		}
		
		searchHandle = null;
	}
	
//	function scrollSearchHandler(){
//		var resultDiv = $("#levelResults-data").first(); 
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
	 * @memberOf LevelSearchScreen
	 * @method errorSearching 
	 * @private
	 * @param {String} err
	 * 			Error message to display
	 */
	function errorSearching(err){
		if(err == undefined)
			err = "Unable to Connect to Server for Competency Search";
		
		ViewManager.getView("#levelSearchMessageContainer").displayAlert(err, "searchFail");
		
		ViewManager.getView("#levelSearchResults").showNoDataMessage();
	}
	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf LevelSearchScreen
	 * @method display
	 * @param containerId
	 * 			Screen Container DOM ID
	 */
	LevelSearchScreen.prototype.display = function(containerId)
	{
		var lastViewed = this.lastViewed;
		
		var query = this.query;
		var ownership = this.ownership;
		
			
		ViewManager.showView(new MessageContainer("levelSearch"), "#levelSearchMessageContainer");
		
		var dataViewPrefix = "levelResults";
		
		ViewManager.showView(new DataViewer(dataViewPrefix, {
			sort:{
				"Competency":function(a, b){
					if(a == undefined)
						return true;
				
					var aId = EcRemoteLinkedData.trimVersionFromUrl(a["competency"]).split("/");
					aId = aId[aId.length -1]
					
					var bId = EcRemoteLinkedData.trimVersionFromUrl(b["competency"]).split("/");
					bId = bId[bId.length -1]
					
					if(aId > bId){
						return -1;
					}else{
						return 1;
					}
					
				}
			},
			clickDataEdit:function(datum){
				ScreenManager.changeScreen(new CompetencyViewScreen({id:datum.competency}), function(){
					ModalManager.showModal(new EditLevelModal(datum, function(){
						ScreenManager.reloadCurrentScreen();
					}));
				});
			},
			clickDataSelect:function(ev, id, datum, prefix){
				var row = $(ev.target).closest(".row");
				var aggId = row.attr("data-aggregateId");
				if(aggId == undefined)
					return;
				var aggregatedRows = row.siblings("[data-aggregateId='"+aggId+"']");
				
				if($(ev.target).is(":checked")){
					if(aggregatedRows.find(".datum-select:checked").size() == aggregatedRows.size()){
						row.siblings("[data-competencyId='"+aggId+"']").find(".datum-select").prop("checked", "checked");
						row.siblings("[data-competencyId='"+aggId+"']").find(".datum-select").prop("indeterminate", false);
					}else{
						row.siblings("[data-competencyId='"+aggId+"']").find(".datum-select").prop("indeterminate", true);
					}
				}else{
					if(aggregatedRows.find(".datum-select:checked").size() == 0){
						row.siblings("[data-competencyId='"+aggId+"']").find(".datum-select").removeAttr("checked");
						row.siblings("[data-competencyId='"+aggId+"']").find(".datum-select").prop("indeterminate", false);
					}else{
						row.siblings("[data-competencyId='"+aggId+"']").find(".datum-select").prop("indeterminate", true);
					}
				}
			},
			moreMenuTools:function(){
				var container = $("<div></div>");
				
				el = $("<li><span><i class='fa fa-download'></i> Export</span></li>");
				
				el.click(function(){
					var selected = ViewManager.getView("#levelSearchResults").getSelected();
					
					ModalManager.showModal(new RepoExportModal(selected));
				})
				
				container.append(el);
				
				return container.contents();
			},
			aggregateDataRows:function(row, id, datum){
				var aggId;
				if($("#levelSearchResults #"+dataViewPrefix+"-sortSelect").val() == "Competency" && datum["competency"] != undefined){
					aggId = datum["competency"];
				}else{
					$("#levelSearchResults #"+dataViewPrefix+"-data").append(row);
					return;
				}
				
				EcCompetency.get(aggId, function(competency){
					var version;
					if(aggId == competency.shortId()){
						version = "";
					}else{
						version = aggId.split("/");
						version = version[version.length - 1];
					}
					
					var shortCompId = competency.shortId().split("/");
					shortCompId = shortCompId[shortCompId.length - 1];
					
					if(version != ""){
						shortCompId +="-"+version;
					}
					
					row.attr("data-aggregateId", shortCompId);
					
					var competencyRow;
					
					if($("#levelSearchResults .competencyAggregateRow[data-competencyId="+shortCompId+"]").size() == 0){
						$("#levelSearchResults #"+dataViewPrefix+"-data").append("<div class='row column competencyAggregateRow' data-competencyId='"+shortCompId+"'></div>");
						
						competencyRow = $("#levelSearchResults .competencyAggregateRow[data-competencyId='"+shortCompId+"']")
					
						competencyRow.append($("<input type='checkbox' class='datum-select'></input>)"));
						
						competencyRow.on("click", ".datum-select", function(ev){					
							if($(".dataView").find(".datum-select:checked").size() == $("#"+dataViewPrefix+"-data .row").size()){
								$(".toggleSelectData").text("Unselect All");
							}else{
								$(".toggleSelectData").text("Select All");
							}
							
							if($(ev.target).is(":checked")){
								var relationRows = competencyRow.siblings("[data-aggregateId='"+shortCompId+"']");
								
								relationRows.addClass("selected");
								relationRows.find(".datum-select").prop("checked", "checked");
								
								var selected = ViewManager.getView("#levelSearchResults").getSelected();
								
								var allOwned = true;
								for(var i in selected){
									var d = selected[i];
									if(!AppController.identityController.owns(d))
										allOwned = false;
								}
								if(allOwned){
									$("#"+dataViewPrefix+"-menu").find(".fa-group").removeClass("hide");
									$("#"+dataViewPrefix+"-menu").find(".fa-trash").removeClass("hide");
								}else{
									$("#"+dataViewPrefix+"-menu").find(".fa-group").addClass("hide");
									var admin = AppController.serverController.getAdmin();
									if(!admin){
										$("#"+dataViewPrefix+"-menu").find(".fa-trash").addClass("hide");
									}
								}
							}else{
								var relationRows = competencyRow.siblings("[data-aggregateId='"+shortCompId+"']");
								
								relationRows.removeClass("selected");
								relationRows.find(".datum-select").removeAttr("checked");
								
								var selected = ViewManager.getView("#levelSearchResults").getSelected();
								
								var allOwned = true;
								for(var i in selected){
									var d = selected[i];
									if(!AppController.identityController.owns(d))
										allOwned = false;
								}
								if(allOwned){
									$("#"+dataViewPrefix+"-menu").find(".fa-group").removeClass("hide");
									$("#"+dataViewPrefix+"-menu").find(".fa-trash").removeClass("hide");
								}
							}
							
							if($(ev.target).closest(".dataView").find(".datum-select").is(":checked")){
								$(ev.target).closest(".dataView").addClass("selecting");
								
								if(!$("#"+dataViewPrefix+"-menu").is(":visible")){
									$("#"+dataViewPrefix+"-menu").slideDown();
								}
								
								$(".dataViewMenu .dataViewSelected").text($(".dataView").find("[data-id] .datum-select:checked").size());
							}else{
								$(ev.target).closest(".dataView").removeClass("selecting");
								
								if($("#"+dataViewPrefix+"-menu").is(":visible")){
									$("#"+dataViewPrefix+"-menu").slideUp();
								}
							}
							
						});
						
						competencyRow.attr("style","padding:7px 2px;padding-left:30px;background-color:#f3f3f3;cursor:default;");
						competencyRow.append("<div class='small-9 columns'></div>");
						competencyRow.find(".small-9").append(competency["name"]);
						
						if(version != "")
							competencyRow.find(".small-9").append("<small>(Version:"+version+")</small>");
						
						competencyRow.append("<div class='small-3 columns'>"+
												"<div class='rowToolbar'>"+
												"<span class='fa-stack fa-lg dataViewBtn' style='font-size: 0.45rem;margin-right:.8rem;' title='Load All Relationships'>"+
													"<i class='fa fa-refresh fa-stack-2x' style='font-size: 3em;top: -4px;'></i>" +
													"<i class='fa fa-plus fa-stack-1x' style='top: -2px;'></i>" +
												"</span> <a style='color:inherit;'><i title='View Competency' class='fa fa-external-link dataViewBtn' style='margin-right:1rem;'></a></i>" +
												"</div>" +
											"</div>");
						
						competencyRow.find(".fa-stack").click(function(ev){
							ev.preventDefault();
							if($(this).find(".fa-plus").hasClass("hide")){
								return;
							}
							$(this).find(".fa-plus").addClass("hide");
							$(this).find(".fa-refresh").addClass("fa-spin");
								
							competency.levels(AppController.serverController.getRepoInterface(), null, function(err){
								ViewManager.getView("#levelSearchMessageContainer").displayAlert("Error getting all levels: "+err);
								competencyRow.find(".fa-refresh").removeClass("fa-spin");
								competencyRow.find(".fa-plus").removeClass("hide");
							}, function(data){
								var next = competencyRow.nextAll(".competencyAggregateRow").first();
								next.before("<div class='row column loadingRow' style='text-align:center;padding:7px 2px;font-style:italic;'>Loading...</div>")
								
								ViewManager.getView("#levelSearchResults").populate(data);
								
								competencyRow.find(".fa-stack").remove();
								competencyRow.nextAll(".loadingRow").first().remove();
								competencyRow.find(".rowToolbar").css("padding-top", "5px");
							});
							
							
						});
						
						competencyRow.find("a").attr("href", "#"+CompetencyViewScreen.prototype.getDisplayName()+"?id="+aggId);
						
						competencyRow.find("a").click(function(ev){
							ev.preventDefault();
							ScreenManager.changeScreen(new CompetencyViewScreen(competency));
							return false;
						});
					}else{
						competencyRow = $("#levelSearchResults .competencyAggregateRow[data-competencyId='"+shortCompId+"']");
					}
					
					if(competencyRow.nextAll(".competencyAggregateRow").size() > 0){
						competencyRow.nextAll(".competencyAggregateRow").first().before(row);
					}else if(competencyRow.nextAll(".row").size() > 0){
						competencyRow.nextAll(".row").last().after(row);
					}else{
						competencyRow.after(row);
					}
					
					
				}, function(err){
					ViewManager.getView("#levelSearchMessageContainer").displayAlert("Error Retrieving Aggregate Competency: "+ err);
					
					var unknownAggregateRow;
					
					if($("#levelSearchResults .competencyAggregateRow[data-competencyId=unknown]").size() == 0){
						$("#levelSearchResults #"+dataViewPrefix+"-data").prepend("<div class='row column competencyAggregateRow' data-competencyId='unknown'></div>");
						
						unknownAggregateRow = $("#levelSearchResults .competencyAggregateRow[data-competencyId='unknown']")
						
						unknownAggregateRow.append($("<input type='checkbox' class='datum-select'></input>)"));
						
						unknownAggregateRow.on("click", ".datum-select", function(ev){					
							if($(".dataView").find(".datum-select:checked").size() == $("#"+dataViewPrefix+"-data .row").size()){
								$(".toggleSelectData").text("Unselect All");
							}else{
								$(".toggleSelectData").text("Select All");
							}
							
							if($(ev.target).is(":checked")){
								var relationRows = unknownAggregateRow.siblings("[data-aggregateId='"+shortCompId+"']");
								
								relationRows.addClass("selected");
								relationRows.find(".datum-select").prop("checked", "checked");
								
								var selected = ViewManager.getView("#levelSearchResults").getSelected();
								
								var allOwned = true;
								for(var i in selected){
									var d = selected[i];
									if(!AppController.identityController.owns(d))
										allOwned = false;
								}
								if(allOwned){
									$("#"+dataViewPrefix+"-menu").find(".fa-group").removeClass("hide");
									$("#"+dataViewPrefix+"-menu").find(".fa-trash").removeClass("hide");
								}else{
									$("#"+dataViewPrefix+"-menu").find(".fa-group").addClass("hide");
									var admin = AppController.serverController.getAdmin();
									if(!admin){
										$("#"+dataViewPrefix+"-menu").find(".fa-trash").addClass("hide");
									}
								}
							}else{
								var relationRows = unknownAggregateRow.siblings("[data-aggregateId='"+shortCompId+"']");
								
								relationRows.removeClass("selected");
								relationRows.find(".datum-select").removeAttr("checked");
								
								var selected = ViewManager.getView("#levelSearchResults").getSelected();
								
								var allOwned = true;
								for(var i in selected){
									var d = selected[i];
									if(!AppController.identityController.owns(d))
										allOwned = false;
								}
								if(allOwned){
									$("#"+dataViewPrefix+"-menu").find(".fa-group").removeClass("hide");
									$("#"+dataViewPrefix+"-menu").find(".fa-trash").removeClass("hide");
								}
							}
							
							if($(ev.target).closest(".dataView").find(".datum-select").is(":checked")){
								$(ev.target).closest(".dataView").addClass("selecting");
								
								if(!$("#"+dataViewPrefix+"-menu").is(":visible")){
									$("#"+dataViewPrefix+"-menu").slideDown();
								}
								
								$(".dataViewMenu .dataViewSelected").text($(".dataView").find("[data-id] .datum-select:checked").size());
							}else{
								$(ev.target).closest(".dataView").removeClass("selecting");
								
								if($("#"+dataViewPrefix+"-menu").is(":visible")){
									$("#"+dataViewPrefix+"-menu").slideUp();
								}
							}
							
						});
						
						unknownAggregateRow.attr("style","padding:7px 2px;padding-left:30px;background-color:#f3f3f3;cursor:default;color:#f74646;font-weight:500;");
						unknownAggregateRow.append("<div class='small-12 columns'></div>");
						unknownAggregateRow.find(".small-12").append("Unknown Competency");
					}else{
						unknownAggregateRow = $("#levelSearchResults .competencyAggregateRow[data-competencyId='unknown']");
					}
					
					if(unknownAggregateRow.nextAll(".competencyAggregateRow").size() > 0){
						unknownAggregateRow.nextAll(".competencyAggregateRow").first().before(row);
					}else if(unknownAggregateRow.nextAll(".row").size() > 0){
						unknownAggregateRow.nextAll(".row").last().after(row);
					}else{
						unknownAggregateRow.after(row);
					}
				});

			},
			buildDataRow:function(row, id, datum){				
				if($("#levelSearchResults #"+dataViewPrefix+"-sortSelect").val() == "Competency" && datum["competency"] != undefined){
					row.append("<a>" +
									"<div class='small-3 columns datum-title'></div>" +
								"</a>" +
								"<div class='small-6 columns datum-description'></div>" +
								"<div class='small-3 columns datum-owner'></div>");
				}else{
					row.append("<a>" +
									"<div class='small-2 columns end datum-title'></div>" +
								"</a>" +
								"<div class='small-4 columns datum-description'></div>" +
								"<div class='small-3 columns datum-competency'></div>" +
								"<div class='small-3 columns datum-owner'></div>");
				}
				
				
				
				if(datum["owner"] == undefined || datum["owner"].length == 0){
					row.find(".datum-owner").html("Public");
				}else{
					for(var i in datum["owner"]){
						var trimId = EcRemoteLinkedData.trimVersionFromUrl(id)
						var idEnd = trimId.split("/")[trimId.split("/").length-1];
						var elId = idEnd+"-owner-"+i;
						
						var ownerEl = $("<span id='"+elId+"'></span>")
						row.find(".datum-owner").append(ownerEl);
						
						var timeoutFunc = function(){
							if($("#"+elId).size() > 0){
								ViewManager.showView(new IdentityDisplay(datum["owner"][i]), "#"+elId)
							}else{
								setTimeout(timeoutFunc, 500);
							}
						};
						
						setTimeout(timeoutFunc, 500);
						
					}
				}
				
				if(row.find(".datum-competency").size() > 0){
					EcCompetency.get(datum.competency, function(competency){
						row.find(".datum-competency").html("on <span style='font-style:italic;'></span>");
						row.find(".datum-competency span").text(competency.name);
					}, function(){
						row.find(".datum-competency").text("Unknown Competency");
					})
					row.find(".datum-competency").text("Loading..");
				}
				
				if(datum.title != undefined && datum.title != "")
					row.find(".datum-title").text(datum.title)

				if(datum.description != undefined && datum.description != "")
					row.find(".datum-description").text(datum.description)
				
				row.find("a").click(function(ev){
					ev.preventDefault();
					ScreenManager.changeScreen(new CompetencyViewScreen({id:datum.competency}), function(){
						ModalManager.showModal(new EditLevelModal(datum, function(){
							ScreenManager.reloadCurrentScreen();
						}));
					});
				})
				
			}
		}), "#levelSearchResults");
		
		
		
		$("#levelSearchSubmit").click(function(event){
			event.preventDefault();
			runLevelSearch();
		});			
		$("#levelSearchOwnership").change(function(event){
			event.preventDefault();
			runLevelSearch();
		});

		
		$("#levelSearchText").keypress(function(e){
			var key = e.which;
			if(key == 13)  // the enter key code
			{
				runLevelSearch();
			}
		});
		
		if(query != null)
			$("#levelSearchText").val(query)
		
		if(AppController.loginController.getLoggedIn())
		{
			$("#levelSearchOwnership").attr("max", 4);
			$("#levelSearchOwnershipLoggedIn").removeClass("hide");
			$("#levelSearchOwnershipPublic").addClass("hide");
		}
		else
		{
			$("#levelSearchOwnershipLoggedIn").addClass("hide");
			$("#levelSearchOwnershipPublic").removeClass("hide");
		}
		
		if(ownership != null){
			if(ownership == "public")
				ownership = 1;
			else if(ownership == "owned")
				ownership = 3;
			else if(ownership == "me")
				ownership = 4
			
			$("#levelSearchOwnership").val(ownership);
		}
		
		runLevelSearch();
		
		ViewManager.getView("#menuContainer").showSortBasic();
		ViewManager.getView("#menuContainer").showSortByCompetency();
	};
	
	/**
	 * Overridden onClose callback, called when leaving screen
	 * 
	 * @memberOf LevelSearchScreen
	 * @method onClose
	 */
	LevelSearchScreen.prototype.onClose = function(){
		ViewManager.getView("#menuContainer").hideSort();
	}
	
	LevelSearchScreen.prototype.sortByTimestamp = function(){
		$("#levelResults-sortSelect").val("timestamp");
		$("#levelResults-sortSelect").trigger("change");
	}
	
	LevelSearchScreen.prototype.sortByOwner = function(){
		$("#levelResults-sortSelect").val("owner");
		$("#levelResults-sortSelect").trigger("change");
	}
	
	LevelSearchScreen.prototype.filterPublic = function(){
		$("#levelSearchOwnership").val(1);
		runLevelSearch();
	}
	
	LevelSearchScreen.prototype.filterAll = function(){
		$("#levelSearchOwnership").val(2);
		runLevelSearch();
	}
	
	LevelSearchScreen.prototype.filterOwned = function(){
		$("#levelSearchOwnership").val(3);
		runLevelSearch();
	}
	
	LevelSearchScreen.prototype.filterOwnedByMe = function(){
		if(!AppController.loginController.getLoggedIn()){
			return;
		}
		
		$("#levelSearchOwnership").val(4);
		runRepoSearch();
	}
	
	/**
	 * Sets the search parameters on the view, so they can be reloaded if the page is
	 * 
	 * @memberOf LevelSearchScreen
	 * @method setParams
	 * @param {Object} params
	 */
	LevelSearchScreen.prototype.setParams = function(params)
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
	 * @memberOf LevelSearchScreen
	 * @method clearParams
	 */
	LevelSearchScreen.prototype.clearParams = function(){
		this.query = undefined;
		this.ownership = undefined;
	}
	
	return LevelSearchScreen;
})(LevelSearchScreen);