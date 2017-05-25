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
	
	var inverseTypes = {
		isEnabledBy:"Enables",
		requires:"is Required By",
		desires:"is Desired By",
		narrows:"is Narrowed By",
		isRelatedTo:"is Related To",
		isEquivalentTo:"is Equivalent To"
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
		ViewManager.getView("#menuContainer").showSortBasic();
		ViewManager.getView("#menuContainer").showSortRelations();
		
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
				runRelationshipSearch($("#relationshipResults-data .row[data-id]").size());
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
		
		var dataViewPrefix = "relationshipResults";
		
		ViewManager.showView(new DataViewer(dataViewPrefix, {
			sort:{
				"Source":function(a, b){
					if(a == undefined)
						return true;
				
					var aId = EcRemoteLinkedData.trimVersionFromUrl(a["source"]).split("/");
					aId = aId[aId.length -1]
					
					var bId = EcRemoteLinkedData.trimVersionFromUrl(b["source"]).split("/");
					bId = bId[bId.length -1]
					
					if(aId > bId){
						return -1;
					}else{
						return 1;
					}
					
				},
				"Target":function(a, b){
					if(a == undefined)
						return false; 
					
					var aId = EcRemoteLinkedData.trimVersionFromUrl(a["target"]).split("/");
					aId = aId[aId.length -1]
					
					var bId = EcRemoteLinkedData.trimVersionFromUrl(b["target"]).split("/");
					bId = bId[bId.length -1]
					
					if(aId > bId){
						return -1;
					}else{
						return 1;
					}
				}
			},
			clickDataEdit:function(datum){
				ScreenManager.changeScreen(new RelationshipEditScreen(datum));
			},
			moreMenuTools:function(){
				var container = $("<div></div>");
				var el = $("<li><span><i class='fa fa-sitemap'></i> Add to Framework</span></li>");
				
				el.click(function(){
					var selected = ViewManager.getView("#relationshipSearchResults").getSelected();
					
					ModalManager.showModal(new AddToFrameworkModal(selected));
				})
				container.append(el);
				
				el = $("<li><span><i class='fa fa-download'></i> Export</span></li>");
				
				el.click(function(){
					var selected = ViewManager.getView("#relationshipSearchResults").getSelected();
					
					ModalManager.showModal(new RepoExportModal(selected));
				})
				
				container.append(el);
				
				return container.contents();
				
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
			aggregateDataRows:function(row, id, datum){
				var aggId;
				if($("#relationshipSearchResults #"+dataViewPrefix+"-sortSelect").val() == "Source" && datum["source"] != undefined){
					aggId = datum["source"];
				}else if($("#relationshipSearchResults #"+dataViewPrefix+"-sortSelect").val() == "Target" && datum["target"] != undefined){
					aggId = datum["target"];
				}else{
					$("#relationshipSearchResults #"+dataViewPrefix+"-data").append(row);
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
					
					if($("#relationshipSearchResults .competencyAggregateRow[data-competencyId="+shortCompId+"]").size() == 0){
						$("#relationshipSearchResults #"+dataViewPrefix+"-data").append("<div class='row column competencyAggregateRow' data-competencyId='"+shortCompId+"'></div>");
						
						competencyRow = $("#relationshipSearchResults .competencyAggregateRow[data-competencyId='"+shortCompId+"']")
					
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
								
								var selected = ViewManager.getView("#relationshipSearchResults").getSelected();
								
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
								
								var selected = ViewManager.getView("#relationshipSearchResults").getSelected();
								
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
								
							competency.relations(AppController.serverController.getRepoInterface(), null, function(err){
								ViewManager.getView("#relationshipSearchMessageContainer").displayAlert("Error getting all relationship: "+err);
								competencyRow.find(".fa-refresh").removeClass("fa-spin");
								competencyRow.find(".fa-plus").removeClass("hide");
							}, function(data){
								var next = competencyRow.nextAll(".competencyAggregateRow").first();
								next.before("<div class='row column loadingRow' style='text-align:center;padding:7px 2px;font-style:italic;'>Loading...</div>")
								
								ViewManager.getView("#relationshipSearchResults").populate(data);
								
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
						competencyRow = $("#relationshipSearchResults .competencyAggregateRow[data-competencyId='"+shortCompId+"']");
					}
					
					if(competencyRow.nextAll(".competencyAggregateRow").size() > 0){
						competencyRow.nextAll(".competencyAggregateRow").first().before(row);
					}else if(competencyRow.nextAll(".row").size() > 0){
						competencyRow.nextAll(".row").last().after(row);
					}else{
						competencyRow.after(row);
					}
					
					
				}, function(err){
					ViewManager.getView("#relationshipSearchMessageContainer").displayAlert("Error Retrieving Aggregate Competency: "+ err);
					
					var unknownAggregateRow;
					
					if($("#relationshipSearchResults .competencyAggregateRow[data-competencyId=unknown]").size() == 0){
						$("#relationshipSearchResults #"+dataViewPrefix+"-data").prepend("<div class='row column competencyAggregateRow' data-competencyId='unknown'></div>");
						
						unknownAggregateRow = $("#relationshipSearchResults .competencyAggregateRow[data-competencyId='unknown']")
						
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
								
								var selected = ViewManager.getView("#relationshipSearchResults").getSelected();
								
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
								
								var selected = ViewManager.getView("#relationshipSearchResults").getSelected();
								
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
						unknownAggregateRow = $("#relationshipSearchResults .competencyAggregateRow[data-competencyId='unknown']");
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
				if($("#relationshipSearchResults #"+dataViewPrefix+"-sortSelect").val() == "Source" && datum["source"] != undefined){
					row.append("<a>" +
									"<div class='small-2 columns datum-type' style='font-style:italic'></div>" +
									"<div class='small-6 columns end datum-target'></div>" +
								"</a>" +
								"<div class='small-4 columns datum-owner'></div>");
				}else if($("#relationshipSearchResults #"+dataViewPrefix+"-sortSelect").val() == "Target" && datum["target"] != undefined){
					row.append("<a>" +
							"<div class='small-2 columns datum-type' style='font-style:italic'></div>" +
							"<div class='small-6 columns end datum-source'></div>" +
						"</a>" +
						"<div class='small-4 columns datum-owner'></div>");
				}else{
					row.append("<a>" +
									"<div class='small-3 columns end datum-source'></div>" +
									"<div class='small-2 columns datum-type' style='font-style:italic'></div>" +
									"<div class='small-3 columns end datum-target'></div>" +
								"</a>" +
								"<div class='small-4 columns datum-owner'></div>");
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
				
				if(row.find(".datum-source").size() > 0){
					EcCompetency.get(datum.source, function(competency){
						row.find(".datum-source").text(competency.name)
					}, function(){
						row.find(".datum-source").text("Unknown Competency");
					})
					row.find(".datum-source").text("Loading..");
				}
				
				if(row.find(".datum-target").size() > 0){
					EcCompetency.get(datum.target, function(competency){
						row.find(".datum-target").text(competency.name)
					}, function(){
						row.find(".datum-target").text("Unknown Competency");
					})
					row.find(".datum-target").text("Loading..");
				}
				
				var types;
				if(row.find(".datum-target").size() == 0){
					types = inverseTypes;
				}else{
					types = AppSettings.relationTypes;
				}
				
				
				if(types[datum.relationType] != undefined){
					row.find(".datum-type").text(types[datum.relationType])
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
		
		if(AppController.loginController.getLoggedIn())
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
		
		ViewManager.getView("#menuContainer").showSortBasic();
		ViewManager.getView("#menuContainer").showSortRelations();
	};
	
	/**
	 * Overridden onClose callback, called when leaving screen
	 * 
	 * @memberOf RelationshipSearchScreen
	 * @method onClose
	 */
	RelationshipSearchScreen.prototype.onClose = function(){
		ViewManager.getView("#menuContainer").hideSort();
	}
	
	RelationshipSearchScreen.prototype.sortByTimestamp = function(){
		$("#relationshipResults-sortSelect").val("timestamp");
		$("#relationshipResults-sortSelect").trigger("change");
	}
	
	RelationshipSearchScreen.prototype.sortByOwner = function(){
		$("#relationshipResults-sortSelect").val("owner");
		$("#relationshipResults-sortSelect").trigger("change");
	}
	
	RelationshipSearchScreen.prototype.filterPublic = function(){
		$("#relationshipSearchOwnership").val(1);
		runRelationshipSearch();
	}
	
	RelationshipSearchScreen.prototype.filterAll = function(){
		$("#relationshipSearchOwnership").val(2);
		runRelationshipSearch();
	}
	
	RelationshipSearchScreen.prototype.filterOwned = function(){
		$("#relationshipSearchOwnership").val(3);
		runRelationshipSearch();
	}
	
	RelationshipSearchScreen.prototype.filterOwnedByMe = function(){
		if(!AppController.loginController.getLoggedIn()){
			return;
		}
		
		$("#relationshipSearchOwnership").val(4);
		runRelationshipSearch();
	}
	
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