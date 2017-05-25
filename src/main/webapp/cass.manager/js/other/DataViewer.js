/**
 * Abstracted viewer for 'Rows' of data in a table on a page.
 * 
 * Defines callbacks that can alter the way that rows are displayed, 
 * or the actions available on each element or multiple elements of 
 * the row. Also has handler callbacks for specific events that 
 * occur for interactions or building the View.
 * 
 * The 'sort' callback object defines a sort function name, and a method 
 * that defines how to compare two different objects for sorting.
 * 
 * Callbacks available:
 * 		buildMenu() returns Menu DOM Container
 * 		buildDataRow(row, id, datum) *** Appends Row HTML to row parameter
 * 		buildRowToolbar(id, datum) returns Toolbar DOM Container
 * 		
 * 		moreMenuTools(prefix)
 * 		moreRowTools(datum) returns MoreActions DOM Container
 * 
 * 		clickDataSelect(ev, id, datum, prefix)
 * 		clickDataDelete(datum)
 * 		clickDataEdit(datum)
 * 		clickName(id, datum)
 * 		clickMenuDelete(selectedIdArr)
 * 		clickMenuPermissions(selectedIdArr)
 * 		permissionsChanged(data || arrData)
 * 
 * 		sort = {} of sort(a, b) functions
 * 		
 * 		afterPopulate()
 * 
 * @class DataViewer
 * @author devlin.junker@eduworks.com
 */
var DataViewer = (function(DataViewer){

	/**
	 * Sorts the data before displaying it in the DataViewer table
	 * 
	 * @memberOf DataViewer
	 * @method sortData
	 * @private
	 * @param {String} prefix
	 * 			DataViewer prefix that uniquifys the view 
	 * @param {Array || Map} data
	 * @param {Object} callbacks
	 * 			Callback object that can be passed in by other developer to handle events or modify display
	 */
	function sortData(prefix, data, callbacks){
		if(data == undefined){
			return;
		}
		
		var arr;
		
		var wasObject = false;
		if(data instanceof Array){
			arr = data;
		}else if(data instanceof Object){
			wasObject = true;
			arr = [];
			for(var i in data){
				arr.push(data[i]);
			}
			
		}else{
			return;
		}
		
		
		var sortType = $("#"+prefix+"-sortSelect").val();
		
		var defaultSort = (callbacks == undefined || callbacks["sort"] == undefined || callbacks["sort"][sortType] == undefined);
		
		if(sortType == "type"){
			arr.sort(function(a, b){
				if(a.type > b.type){
					return 1;
				}else if(b.type > a.type){
					return -1;
				}else{
					return 0;
				}
			});
		}else if(sortType == "owner" || (AppController.loginController.getLoggedIn() && defaultSort)){
			arr.sort(function(a, b){
				if(AppController.identityController.owns(a)){
					if(AppController.identityController.owns(b)){
						return 0;
					}else{
						return -1;
					}
				}else if(AppController.identityController.owns(b)){
					return 1;
				}else if(a.owner == undefined || a.owner.length == 0){
					return -1;
				}else if(b.owner == undefined || b.owner.length == 0){
					return 1;
				}else if(a.owner[0] > b.owner[0]){
					return 1;
				}else if(b.owner[0] > a.owner[0]){
					return -1
				}else{
					return 0;
				}
			});
		}else if(sortType == "timestamp" || (!AppController.loginController.getLoggedIn() && defaultSort)){
			arr.sort(function(a, b){
				// By ID Timestamp (date newest -> oldest)
				var aId = a.id.split("/");
				aId = aId[aId.length -1]
				
				var bId = b.id.split("/");
				bId = bId[bId.length -1]
				
				if(aId > bId){
					return -1;
				}else{
					return 1;
				}
			});
		}else if(callbacks != undefined && callbacks["sort"] != undefined){
			arr.sort(callbacks["sort"][sortType]);
		}
		
		return arr;
	}
	
	/**
	 * Builds the sort input based on the sorts that are hard coded and 
	 * what are passed in via the callbacks object 
	 *
	 * Note: Sort Callbacks can be implemented so that if undefined is 
	 * 	passed they return a string name of the sort type, otherwise
	 * 	the key of the sort object will be used
	 * 
	 * @memberOf DataViewer
	 * @method buildSort
	 * @private
	 * @param {String} prefix
	 * 			DataViewer prefix that uniquifys the view 
	 * @param {Array || Map} data
	 * @param {DataViewer} self
	 * 			Reference to 'this' DataViewer because of JavaScript weirdness
	 * @param {Object} callbacks
	 * 			Callback object that can be passed in by other developer to handle events or modify display
	 */
	function buildSort(prefix, data, self, callbacks){
		$("#"+prefix+"-sortSelect").html("");
		$("#"+prefix+"-sortSelect").off("change");
		
		var urlParams = {};
		if(window.location.hash.split("?").length > 1){
			var hashSplit = window.location.hash.split(/[?&]/)
			for(var i = 1; i < hashSplit.length; i++){
				var paramSplit = hashSplit[i].split("=");
				if(paramSplit.length == 2)
					urlParams[paramSplit[0]] = paramSplit[1]; 
			}
		}
		
		var option = $("<option value='timestamp'>Sort by Timestamp</option>");
		if(urlParams["sort"] == undefined && !AppController.loginController.getLoggedIn())
			option.attr("selected","selected");
		$("#"+prefix+"-sortSelect").append(option);
		
		option = $("<option value='owner'>Sort by Owner</option>");
		if(urlParams["sort"] == "owner" || (urlParams["sort"] == undefined && AppController.loginController.getLoggedIn()))
			option.attr("selected","selected");
		$("#"+prefix+"-sortSelect").append(option);
		
		if(callbacks != undefined && callbacks["sort"] != undefined && callbacks["sort"] instanceof Object){
			for(var type in callbacks["sort"]){
				option = $("<option value='"+type+"'>Sort by "+type+"</option>")
				
				if(urlParams["sort"] == undefined && callbacks["sort"][type]())
					option.attr("selected","selected");
				
				if(urlParams["sort"] == type)
					option.attr("selected","selected");
				
				$("#"+prefix+"-sortSelect").append(option);
			}
		}else{
			option = $("<option value='type'>Sort by Type</option>");
			if(urlParams["sort"] == "type")
				option.attr("selected","selected");
			$("#"+prefix+"-sortSelect").append(option);
		}
		
		$("#"+prefix+"-sortSelect").removeClass("hide")
		
		$("#"+prefix+"-sortSelect").on("change", function(){
			urlParams["sort"] = $("#"+prefix+"-sortSelect").val();

			var otherDefault = false;
			if(callbacks["sort"] != undefined){
				for(var type in callbacks["sort"]){
					if(callbacks["sort"][type]()){
						otherDefault = true;
						if(urlParams["sort"] == type)
							delete urlParams["sort"];
					}
				}
			}
			if(otherDefault){
				
			}else if(urlParams["sort"] == "timestamp" && !AppController.loginController.getLoggedIn()){
				delete urlParams["sort"];
			}else if(urlParams["sort"] == "owner" && AppController.loginController.getLoggedIn()){
				delete urlParams["sort"];
			}
				
			
			ScreenManager.setScreenParameters(urlParams);
			
			$("#"+prefix+"-data").find(".row").remove();
			populateData(self.dataStore, self, prefix, callbacks);
		});
	}
	
	/**
	 * Builds the dataviewer from a set of data (either a map from id to data, or an array)
	 * 
	 * @memberOf DataViewer
	 * @method populateData
	 * @private
	 * @param {Array || Map} data	
	 * 			Set of data to be displayed
	 * @param {DataViewer} self
	 * 			Reference to 'this' DataViewer because of JavaScript weirdness
	 * @param {String} prefix
	 * 			DataViewer prefix that uniquifys the view 
	 * @param {Object} callbacks
	 * 			Callback object that can be passed in by other developer to handle events or modify display
	 */
	function populateData(data, self, prefix, callbacks){
		if(data == undefined){
			showNoDataMessage(prefix);
			return;
		}
		
		$(".toggleSelectData").removeClass("hide");
		$(".toggleSelectData").text("Select All");
		
		if(self.dataStore == undefined)
			self.dataStore = {};
		
		var newSearch = false;
		
		$("#"+prefix+"-none").addClass("hide");
		$("#"+prefix+"-progress").addClass("hide");
		$("#"+prefix+"-menu").removeClass("hide");
		$("#"+prefix+"-data").removeClass("hide");
	
		buildSort(prefix, data, self, callbacks);
		data = sortData(prefix, data, callbacks);
		
		if(data instanceof Array){
			if(data.length == 0){
				showNoDataMessage(prefix);
				return;
			}
			
			if($("#"+prefix+"-data .row").size() == 0){
				for(var i in self.dataStore){
					delete self.dataStore[i];
				}
			}
			
			for(var idx in data){
				var id;
				if(data[idx]["id"] != undefined){
					id = data[idx]["id"]
				}else{
					id = idx;
				}
				
				if(self.dataStore[id] == undefined){
					buildData(data[idx]["id"], data[idx], prefix, callbacks, self);
				}
				
				self.dataStore[id] = data[idx];
			}
		}else if(data instanceof Object){
			if(Object.keys(data).length == 0){
				showNoDataMessage(prefix);
				return;
			}
			
			if($("#"+prefix+"-data .row").size() == 0){
				for(var i in self.dataStore){
					delete self.dataStore[i];
				}
			}
			
			for(var i in data){
				self.dataStore[i] = data[i];
			}
			
			for(var id in data){
				buildData(id, data[idx], prefix, callbacks, self);
			}
		}else{
			
		}
		
		deselectAll(prefix);
		
		if(callbacks != undefined && callbacks["afterPopulate"]){
			callbacks["afterPopulate"]();
		}
	}
	
	/**
	 * The beginning function call to build a row, handles all the extra stuff like the checkbox
	 * and encryption status etc
	 * 
	 * @memberOf DataViewer
	 * @method buildData
	 * @private
	 * @param {String} id
	 * 			ID of data to be displayed in the row
	 * @param {EcRemoteLinkedData} datum
	 * 			The data to be displayed in the row
	 * @param {String} prefix
	 * 			DataViewer prefix that uniquifys the view 
	 * @param {Object} callbacks
	 * 			Callback object that can be passed in by other developer to handle events or modify display
	 * @param {DataViewer} self
	 * 			Reference to 'this' DataViewer because of JavaScript weirdness
	 */
	function buildData(id, datum, prefix, callbacks, self){
		var row;
		if($(".row[data-id='"+id+"']").size() == 0){
			row = $("<div class='row column' style='padding:7px 2px;padding-left:40px;'></div>");
		}else{
			return;
		}
		
		row.attr("data-id", id);
		row.attr("title", id);
		
		var dataSelect = $("<input type='checkbox' class='datum-select'></input>)");
		
		row.append(dataSelect);
		
		if(datum.isAny != undefined){
			if(datum.isAny(new EcEncryptedValue().getTypes())){
				var lockIcon = $("<i class='fa fa-lock fake-a' style='position: absolute;top: 33%;left: 37px;color: #2A3A2B;'></i>");
				row.append(lockIcon);
			}else if(EcEncryptedValue.encryptOnSave(datum.id) == true){
				var lockIcon = $("<i class='fa fa-unlock-alt fake-a' style='position: absolute;top: 33%;left: 37px;color: #2A3A2B;'></i>");
				row.append(lockIcon);
			}
		}
		
		
		row.on("click", ".datum-select", function(ev){
			if(callbacks != undefined && callbacks["clickDataSelect"] != undefined){
				callbacks["clickDataSelect"](ev, id, datum, prefix);
			}
			
			if($(".dataView").find(".datum-select:checked").size() == $("#"+prefix+"-data .row").size()){
				$(".toggleSelectData").text("Unselect All");
			}else{
				$(".toggleSelectData").text("Select All");
			}
			
			if($(ev.target).is(":checked")){
				$(ev.target).closest(".row").addClass("selected");
				//row.find(".data-id").slideDown();
				
				if(!AppController.identityController.owns(datum)){
					$("#"+prefix+"-menu").find(".fa-group").addClass("hide");
					var admin = AppController.serverController.getAdmin();
					if(!admin){
						$("#"+prefix+"-menu").find(".fa-trash").addClass("hide");
					}
				}
			}else{
				$(ev.target).closest(".row").removeClass("selected");
				//row.find(".data-id").slideUp();
				
				var selected = [];
				$("#"+prefix+"-data").find(".row.selected").each(function(i, obj){
					selected.push(self.dataStore[$(obj).attr("data-id")]);
				});
				
				if(!AppController.identityController.owns(datum)){
					var allOwned = true;
					for(var i in selected){
						var d = selected[i];
						if(!AppController.identityController.owns(d))
							allOwned = false;
					}
					if(allOwned){
						
						$("#"+prefix+"-menu").find(".fa-group").removeClass("hide");
						$("#"+prefix+"-menu").find(".fa-trash").removeClass("hide");
					}
				}
			}
			
			if($(ev.target).closest(".dataView").find(".datum-select").is(":checked")){
				$(ev.target).closest(".dataView").addClass("selecting");
				
				if(!$("#"+prefix+"-menu").is(":visible")){
					$("#"+prefix+"-menu").slideDown();
				}
				
				$(".dataViewMenu .dataViewSelected").text($(".dataView").find("[data-id] .datum-select:checked").size());
			}else{
				$(ev.target).closest(".dataView").removeClass("selecting");
				
				if($("#"+prefix+"-menu").is(":visible")){
					$("#"+prefix+"-menu").slideUp();
				}
			}
			
		});
		
		
		if(callbacks != undefined && callbacks["aggregateDataRows"] != undefined){
			callbacks["aggregateDataRows"](row, id, datum);
		}else{
			$("#"+prefix+"-data").append(row);
		}
		
		
		var dataDisplay;
		
		if(callbacks != undefined && callbacks["buildDataRow"] != undefined){
			dataDisplay = callbacks["buildDataRow"](row, id, datum);
			
			var rowInner = $(dataDisplay);
			
			row.append(rowInner);
		}else{
			dataDisplay = defaultBuildRow(row, id, datum, callbacks);
		}
		
		
		
		var rowToolbar = $("<div class='rowToolbar'></div>");
		if(callbacks != undefined && callbacks["buildRowToolbar"] != undefined){
			rowToolbar.append(callbacks["buildRowToolbar"](id, datum));
		}else{
			rowToolbar.append(defaultBuildRowToolbar(id, datum, callbacks));
		}
		
		row.append(rowToolbar)
		
		
	}
	
	/**
	 * Callback that is triggered when the delete button is pressed to confirm the user wanted to delete
	 * 
	 * @memberOf DataViewer
	 * @method confirmDeleteDataRow
	 * @private
	 * @param {jQueryObject} element
	 * 			DOM element clicked on to cause the delete event to occure
	 * @param {EcRemoteLinkedData} datum
	 * 			The data corresponding to the row
	 * @param {Object} callbacks
	 * 			Callback object that can be passed in by other developer to handle events or modify display
	 */
	function confirmDeleteDataRow(element, datum, callbacks){
		if(callbacks != undefined && callbacks["clickDataDelete"] != undefined){
			callbacks["clickDataDelete"](datum);
		}else{
			var id;
			if(datum.name != undefined)
				id = datum.name;
			else
				id = datum.id;
				
			var msg = "Are you sure you want to delete <em>"+id+"</em>?"
			
			ModalManager.showModal(new ConfirmModal(function(){
				EcRepository._delete(datum, function(){
					ModalManager.hideModal();
					
					var row = element.closest(".row");
					var siblings = row.siblings(".row")
					
					row.remove();
					
					if(siblings.size() == 0){
						showNoDataMessage(prefix);
						$(".toggleSelectData").addClass("hide");
					}
				}, function(err){
					ModalManager.getCurrentModal().displayAlertMessage(err);
				})
			}, msg))
		}
	}
	
	/**
	 * Default Method to build a row toolbar for the DataViewer
	 * 
	 * @memberOf DataViewer
	 * @method defaultBuildRowToolbar
	 * @private
	 * @param {String} id
	 * 			ID of the data displayed in the row
	 * @param {EcRemoteLinkedData} datum
	 * 			The data displayed in the row
	 * @param {Object} callbacks
	 * 			Callback object that can be passed in by other developer to handle events or modify display
	 */
	function defaultBuildRowToolbar(id, datum, callbacks){
		var html = "<div style='padding-top:5px;'>" +
					"<i class='fa fa-trash dataViewBtn' title='Delete' style='margin-right:1rem;'></i>" +
					"<i class='fa fa-group dataViewBtn' title='Manage Permissions' style='margin-right:1rem;'></i>" +
					"<i class='fa fa-clone dataViewBtn' title='Copy Resource' style='margin-right:1rem;'></i>" +
					"<i class='fa fa-pencil dataViewBtn' title='Edit Resource' style='margin-right:1rem;'></i>"; +
				"</div>";
		
		var element = $(html);
		
		if(callbacks != undefined && callbacks["moreRowTools"]){
			var more = $("<i class='fa fa-ellipsis-v dataViewBtn' title='Additional Actions' style='margin-right:1rem;'></i>");
			
			var list = $("<ul class='contextMenu' style='list-style:none;margin:0px;'></ul>");
			
			var moreActions = callbacks["moreRowTools"](datum);
			
			if(moreActions != undefined && moreActions != "" && $(moreActions).size() > 0){
				element.append(more);
				
				element.find(".fa-ellipsis-v").click(function(ev){
					ev.preventDefault();
					
					list.append(moreActions);
					
					list.css("left", ev.clientX);
					list.css("top", ev.clientY);
					
					$("body").append(list);
				});
			}
			
		}
		
		if(!AppController.identityController.owns(datum)){
			element.find(".fa-group").remove();
			
			// TODO: Figure out admin user stuff
			var adminUser = AppController.serverController.getAdmin();
			if(!adminUser){
				element.find(".fa-trash").remove();
			}else{
				element.find(".fa-trash").click(function(){
					confirmDeleteDataRow(element, datum, callbacks);
				});
			}
		}else{
			element.find(".fa-group").click(function(){
				ModalManager.showModal(new AdvancedPermissionsModal(datum, function(data){
					EcRepository.save(data, function(){
						ModalManager.hideModal();
						ScreenManager.reloadCurrentScreen();
					}, function(){
						ViewManager.getView("#advancedPermissionsMessageContainer").displayAlert("Error Saving Changed Permissions");
					})
				}));
			});
			
			element.find(".fa-trash").click(function(){
				confirmDeleteDataRow(element, datum, callbacks)
			});
		}
		
		if(!AppController.identityController.canEdit(datum)){
			element.find(".fa-pencil").remove();
		}else{
			element.find(".fa-pencil").click(function(ev){
				ev.preventDefault();
				if(callbacks != undefined && callbacks["clickDataEdit"] != undefined)
					callbacks["clickDataEdit"](datum);
				else	
					ScreenManager.changeScreen(new RepoViewScreen(datum));
			})
		}
		
		element.find(".fa-clone").click(function(ev){
			ev.preventDefault();
			ModalManager.showModal(new CopyResourceModal(datum, function(){
				ScreenManager.reloadCurrentScreen();
			}));
		});
		
		return element;
	}
	
	/**
	 * Default method to build a data row for the DataViewer
	 * 
	 * @memberOf DataViewer
	 * @method defaultBuildRow
	 * @private
	 * @param {jQueryObject} row
	 * 			row element on the screen to display the row in
	 * @param {String} id
	 * 			ID of the data  displayed in the row
	 * @param {EcRemoteLinkedData} datum
	 * 			The data to be displayed in the row
	 * @param {Object} callbacks
	 * 			Callback object that can be passed in by other developer to handle events or modify display
	 */
	function defaultBuildRow(row, id, datum, callbacks){
		
		row.append("<div class='small-6 columns'>" +
						"<a class='datum-name'></a>" +
						"<span class='datum-description'></span>" +
						"</div>" +
					"<div class='small-2 columns datum-type'></div>" +
					"<div class='small-4 columns datum-owner'></div>")
		
		if(datum["name"] != undefined){
			row.find(".datum-name").text(datum["name"]);
		}else{
			row.find(".datum-name").text(id);
			row.find(".datum-name").css("font-size", "0.8rem");
		}
		
		if(datum["description"] != undefined)
			row.find(".datum-description").text(" - "+datum["description"]);
		
		if(datum["type"] != undefined){
			var typeSplit = datum["type"].split("/");
			row.find(".datum-type").text(typeSplit[typeSplit.length-1]);
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
		
		
		row.find("a.datum-name").click(function(ev){
			ev.preventDefault();
			if(callbacks != undefined && callbacks["clickName"] != undefined){
				callbacks["clickName"](id, datum);
			}else{
				ScreenManager.changeScreen(new RepoViewScreen(datum));
			}
		})
		
	}

	/**
	 * Default method to build the menu for the DataViewer
	 * 
	 * @memberOf DataViewer
	 * @method defaultBuildMenu
	 * @private
	 * @param {String} prefix
	 * 			DataViewer prefix that uniquifys the view 
	 * @param {DataViewer} self
	 * 			Reference to 'this' DataViewer because of JavaScript weirdness
	 * @param {Object} callbacks
	 * 			Callback object that can be passed in by other developer to handle events or modify display
	 */
	function defaultBuildMenu(prefix, self, callbacks){
		var html = "<div class='row column' style='position:relative;padding:7px 2px; font-weight:500; background-color: lightgrey;'>" +
					"<div class='small-3 columns'>" +
						"<span class='deselectData dataViewBtn'> <i class='fa fa-undo'></i> Unselect All</span>" +
					"</div>" +
					"<div class='small-5 columns' style='text-align:center'>" +
						"<span class='dataViewSelected'></span> selected" +
					"</div>" +
					"<div class='small-3 columns' style='text-align:right;padding-top:3px;'>" +
						"<i class='fa fa-trash dataViewBtn' title='Delete' style='margin-right:1rem;'></i>" +
						"<i class='fa fa-group dataViewBtn' title='Manage Permissions' style='margin-right:1rem;'></i>" +
						"<i class='fa fa-clone dataViewBtn' title='Copy Resource' style='margin-right:1rem;'></i>" +
						"<ul id='moreMenuBtns' class='dropdown menu align-right hide' style='display:inline-block;vertical-align:middle;text-align:left;' data-dropdown-menu data-disable-hover='true' data-click-open='true' data-close-on-click='true'>" +
							"<li id='moreMenuContainer'><span class='dataViewBtn' style='padding:0px 5px; display:inline-block;'><i class='fa fa-ellipsis-v'></i></span></li>" +
						"</ul>" +
					"</div>" +
				"</div>";
		
		var row = $(html);
		
		row.find(".deselectData").click(function(ev){
			deselectAll(prefix)
			$(".toggleSelectData").text("Select All");
		})
		
		row.find(".fa-clone").click(function(){
			var selected = [];
			$("#"+prefix+"-data").find(".row.selected").each(function(i, obj){
				selected.push(self.dataStore[$(obj).attr("data-id")]);
			});
			
			ModalManager.showModal(new CopyResourceModal(selected, function(){
				ScreenManager.reloadCurrentScreen();
			}))
		});
		
		row.find(".fa-trash").click(function(){
			var selected = [];
			$("#"+prefix+"-data").find(".row.selected").each(function(i, obj){
				selected.push(self.dataStore[$(obj).attr("data-id")]);
			});
			
			if(callbacks != undefined && callbacks["clickMenuDelete"] != undefined){
				callbacks["clickMenuDelete"](selected);
			}else{
				ModalManager.showModal(new ConfirmModal(function(){
					var deleted = 0;
					
					var runDelete = function(id, datum){
						EcRepository._delete(datum, function(){
							$("#"+prefix+"-data").find(".row[data-id='"+id+"']").remove();
							
							if($("#"+prefix+"-data").find(".row").size() == 0){
								showNoDataMessage(prefix);
								$(".toggleSelectData").addClass("hide");
							}
							
							deleted++;
							if(deleted == selected.length){
								ModalManager.hideModal();
								if($("#"+prefix+"-menu").is(":visible")){
									$("#"+prefix+"-menu").slideUp();
								}
							}
						}, function(err){
							ModalManager.getCurrentModal().displayAlertMessage(err);
						})
					}
					
					for(var i in selected){
						runDelete(selected[i].id, selected[i]);
					}
				}, "Are you sure you want to delete the selected resources?"));
			}
		});
		
		row.find(".fa-group").click(function(){
			var selected = [];
			$("#"+prefix+"-data").find(".row.selected").each(function(i, obj){
				selected.push(self.dataStore[$(obj).attr("data-id")]);
			});
			
			if(selected.length == 1)
				selected = selected[0];
			
			if(callbacks != undefined && callbacks["clickMenuPermissions"] != undefined){
				callbacks["clickMenuPermissions"](selected);
			}else{
				ModalManager.showModal(new AdvancedPermissionsModal(selected, function(data){
					if(! (data instanceof Array)){
						data = [data]
					}
						
					if(callbacks != undefined && callbacks["permissionsChanged"] != undefined){
						callbacks["permissionsChanged"](data);
					}else{
						var saved = 0;
						for(var i in data){
							EcRepository.save(data[i], function(){
								saved++;
								if(saved == data.length){
									ModalManager.hideModal();
									ScreenManager.reloadCurrentScreen();
								}
							}, function(){
								ViewManager.getView("#advancedPermissionsMessageContainer").displayAlert("Error Saving Changed Permissions");
							});
						}
					}
				}));
			}
		});
		
		if(callbacks != undefined && callbacks["moreMenuTools"]){
			var list = $("<ul class='menu contextMenu'></ul>");
			row.find("#moreMenuContainer").append(list);
			
			var moreActions = callbacks["moreMenuTools"](prefix);
			
			if(moreActions != undefined && moreActions != "" && $(moreActions).size() > 0){
				row.find("#moreMenuBtns").removeClass("hide");
				
				list.append(moreActions);
			}
			
		}
		
		return row;
	}
	
	/**
	 * Shows the 'No Data' message in the DataViewer
	 * 
	 * @memberOf DataViewer
	 * @method showNoDataMessage
	 * @private
	 * @param {String} prefix
	 * 			DataViewer prefix that uniquifys the view 
	 */
	function showNoDataMessage(prefix){
		$("#"+prefix+"-none").removeClass("hide");
		$("#"+prefix+"-progress").addClass("hide");
		$("#"+prefix+"-menu").addClass("hide");
		$("#"+prefix+"-data").addClass("hide");
		
		$(".selectData").addClass("hide");
	}
	
	/**
	 * Shows the 'Progress' message in the DataViewer
	 * 
	 * @memberOf DataViewer
	 * @method showProgressMessage
	 * @private
	 * @param {String} prefix
	 * 			DataViewer prefix that uniquifys the view 
	 */
	function showProgressMessage(prefix){
		$("#"+prefix+"-progress").removeClass("hide");
		//$("#"+prefix+"-none").addClass("hide");
		//$("#"+prefix+"-menu").addClass("hide");
		//$("#"+prefix+"-data").addClass("hide");
	}
	
	/**
	 * Triggers the deselection of all elements in the DataViewer right now
	 * 
	 * @memberOf DataViewer
	 * @method deselectAll
	 * @private
	 * @param {String} prefix
	 * 			DataViewer prefix that uniquifys the view 
	 */
	function deselectAll(prefix){
		$(".dataView").find(".row").removeClass("selected");
		
		$(".dataView").removeClass("selecting");
		
		$(".dataView .datum-select").attr("checked", false);
		
		if($("#"+prefix+"-menu").is(":visible")){
			$("#"+prefix+"-menu").slideUp();
		}
	}
	
	/**
	 * Returns the data objects corresponding to all of the selected elements in the DataViewer
	 * 
	 * @memberOf DataViewer
	 * @method getSelectedData
	 * @private
	 * @param {String} prefix
	 * 			DataViewer prefix that uniquifys the view 
	 * @param {DataViewer} self
	 * 			Reference to 'this' DataViewer because of JavaScript weirdness
	 */
	function getSelectedData(prefix, self){
		var selected = [];
		$("#"+prefix+"-data").find(".row.selected").each(function(i, obj){
			if(self.dataStore[$(obj).attr("data-id")] != undefined)
				selected.push(self.dataStore[$(obj).attr("data-id")]);
		});
		return selected;
	}
	
	/**
	 * Setup the DataViewer after the html has been loaded
	 * 		renames Id's to uniqify
	 * 		builds Menu
	 * 		sets up select all 
	 * 
	 * Need to call Populate to build the rows
	 * 
	 * @memberOf DataViewer
	 * @method display
	 * @param {String} containerId
	 * 			DOM ID of the element to display the DataViewer
	 */
	DataViewer.prototype.display = function(containerId){	
		var prefix = this.prefix;
		
		var callbacks = this.callbacks;
		
		var self = this;
					
		
		$(containerId).find("[id]").each(function(i, e){
			$(e).attr("id", prefix+"-"+$(e).attr("id"))
		});
		
		var menu;
		if(callbacks != undefined && callbacks["buildMenu"] != undefined){
			menu = callbacks["buildMenu"]();
		}else{
			menu = defaultBuildMenu(prefix, self, callbacks);
		}
		
		$("#"+prefix+"-menu").append(menu);
		$("#"+prefix+"-menu").foundation();
		
		
		$(".toggleSelectData").click(function(){
			if($(".dataView").find(".datum-select:checked").size() == $("#"+prefix+"-data .row").size()){
				deselectAll(prefix);
				$(".toggleSelectData").text("Select All");
			}else{
				$(".dataView").find(".row").addClass("selected");
				
				$(".dataView").addClass("selecting");
				
				$(".dataView .datum-select").prop("checked", true);
				
				$(".dataViewMenu .dataViewSelected").text($(".dataView").find("[data-id] .datum-select:checked").size());
				
				if(!$("#"+prefix+"-menu").is(":visible") && menu != undefined){
					$("#"+prefix+"-menu").slideDown();
				}
				
				$(".toggleSelectData").text("Unselect All");
				
				var allOwned = true;
				var allData = getSelectedData(prefix, self);
				for(var i in allData){
					if(!AppController.identityController.owns(allData[i])){
						allOwned = false;
						$("#"+prefix+"-menu").find(".fa-group").addClass("hide");
						$("#"+prefix+"-menu").find(".fa-trash").addClass("hide");
					}
				}
				if(allOwned){
					$("#"+prefix+"-menu").find(".fa-group").removeClass("hide");
					$("#"+prefix+"-menu").find(".fa-trash").removeClass("hide");
				}
				
				if(AppController.serverController.getAdmin()){
					$("#"+prefix+"-menu").find(".fa-trash").removeClass("hide");
				}
			}
		});
	}

	/**
	 * Clears the rows of data from the DOM and empty's the datastore member field
	 * 
	 * @memberOf DataViewer
	 * @method clear
	 */
	DataViewer.prototype.clear = function(){
		$("#"+this.prefix+"-data").find(".row").remove();
		this.dataStore = {};
	}
	
	/**
	 * Builds the rows of data in HTML
	 * 
	 * @memberOf DataViewer
	 * @method populate
	 * @param {Array || Map} data
	 * 			Data to add to the DataViewer
	 */
	DataViewer.prototype.populate = function(data){
		var dataSize;
		if(data instanceof Object){
			dataSize = Object.keys(data).length;
		}else if(data instanceof Array){
			dataSize = data.length;
		}
		
		if(dataSize > 0){
			populateData(data, this, this.prefix, this.callbacks);
		}else if($("#"+this.prefix+"-data").find(".row").size() == 0){
			showNoDataMessage(this.prefix);
		}
	}
	
	/**
	 * Shows the 'No Data' message in the DataViewer
	 * 
	 * @memberOf DataViewer
	 * @method showNoDataMessage
	 */
	DataViewer.prototype.showNoDataMessage = function(){
		showNoDataMessage(this.prefix);
	}
	
	/**
	 * Shows the 'Progress' message in the DataViewer
	 * 
	 * @memberOf DataViewer
	 * @method showProgressMessage
	 */
	DataViewer.prototype.showProgressMessage = function(){
		showProgressMessage(this.prefix);
	}
	
	/**
	 * Triggers the deselection of all elements in the DataViewer right now
	 * 
	 * @memberOf DataViewer
	 * @method deselectAll
	 */
	DataViewer.prototype.deselectAll = function(){
		deselectAll(this.prefix);
	}
	
	/**
	 * Returns the data objects corresponding to all of the selected elements in the DataViewer
	 * 
	 * @memberOf DataViewer
	 * @method getSelected
	 */
	DataViewer.prototype.getSelected = function(){
		return getSelectedData(this.prefix, this);
	}
	
	return DataViewer;
})(DataViewer);