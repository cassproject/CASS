/*
 * Callbacks available:
 * 		buildMenu
 * 		buildData
 * 		buildRowToolbar
 * 		
 * 		moreMenuTools
 * 		moreRowTools
 * 
 * 		clickDataSelect
 * 		clickDataDelete
 * 		clickDataEdit
 * 		clickName
 * 		clickMenuDelete
 * 		clickMenuPermissions
 * 		permissionsChanged
 * 
 * 		sort = {} of sort(a, b) functions
 * 		
 * 		afterPopulate
 */
var DataViewer = (function(DataViewer){

	function createContactSmall(pk)
	{
		var ident = AppController.identityController.lookup(pk);
	    return '<span class="ownershipDisplay has-tip" tabindex>'
	    	+ '<span class="qrcodeCanvas"></span>'
	    	+ '<span class="contactText" title="'+pk+'">'+ident.displayName+'</span>'
	    	+ '</span>';
	}
	
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
		}else if(sortType == "owner" || (LoginController.getLoggedIn() && defaultSort)){
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
		}else if(sortType == "timestamp" || (!LoginController.getLoggedIn() && defaultSort)){
			arr.sort(function(a, b){
				// By ID Timestamp (date newest -> oldest)
				aId = a.id.split("/");
				aId = aId[aId.length -1]
				
				bId = b.id.split("/");
				bId = bId[bId.length -1]
				
				if(aId > bId){
					return -1;
				}else{
					return 1;
				}
			});
		}else if(callbacks != undefined && callbacks["sort"] != undefined){
			arr.sort(callback["sort"][sortType]);
		}
		
		return arr;
	}
	
	// Note: Sort Callbacks can be implemented so that if undefined is passed they return a string name of the sort type, otherwise
	// 	the key of the sort object will be used
	function buildSort(prefix, data, self, callbacks){
		$("#"+prefix+"-sortSelect").html("");
		
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
		if(urlParams["sort"] == undefined && !LoginController.getLoggedIn())
			option.attr("selected","selected");
		$("#"+prefix+"-sortSelect").append(option);
		
		option = $("<option value='owner'>Sort by Owner</option>");
		if(urlParams["sort"] == "owner" || (urlParams["sort"] == undefined && LoginController.getLoggedIn()))
			option.attr("selected","selected");
		$("#"+prefix+"-sortSelect").append(option);
		
		if(callbacks != undefined && callbacks["sort"] != undefined && callbacks["sort"] instanceof Object){
			for(var type in callbacks["sort"]){
				if(callbacks["sort"][type]() == undefined)
					option = $("<option value='"+type+"'>Sort by"+type+"</option>")
				else
					option = $("<option value='"+type+"'>Sort by"+callbacks["sort"][type]()+"</option>");
				
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
		
		$("#"+prefix+"-sortSelect").change(function(){
			urlParams["sort"] = $("#"+prefix+"-sortSelect").val();

			if(urlParams["sort"] == "timestamp")
				delete urlParams["sort"];
			ScreenManager.replaceHistory(ScreenManager.getCurrentScreen(), ScreenManager.SCREEN_CONTAINER_ID, urlParams);
			
			$("#"+prefix+"-data").find(".row").remove();
			populateData(self.dataStore, self, prefix, callbacks);
		});
	}
	
	function populateData(data, self, prefix, callbacks){
		if(data == undefined){
			showNoDataMessage(prefix);
			return;
		}
		
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
				
				buildData(data[idx]["id"], data[idx], prefix, callbacks, self);
				
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
	
	function buildData(id, datum, prefix, callbacks, self){
		
		var row = $("<div class='row column' datum-id='"+id+"' title='"+id+"' style='padding:7px 2px;padding-left:40px;'></div>");
		
		var dataSelect = $("<input type='checkbox' class='datum-select'></input>)");
		
		row.append(dataSelect);
		
		if(datum.isA(EcEncryptedValue.type)){
			var lockIcon = $("<i class='fa fa-lock fake-a' style='position: absolute;top: 33%;left: 37px;color: #2A3A2B;'></i>");
			row.append(lockIcon);
		}else if(datum.privateEncrypted == true){
			var lockIcon = $("<i class='fa fa-unlock-alt fake-a' style='position: absolute;top: 33%;left: 37px;color: #2A3A2B;'></i>");
			row.append(lockIcon);
		}
		
		
		
		
		row.on("click", ".datum-select", function(ev){
			if(callbacks != undefined && callbacks["clickDataSelect"] != undefined){
				callbacks["clickDataSelect"](ev, id, datum, prefix);
			}
			
			if($(ev.target).is(":checked")){
				$(ev.target).closest(".row").addClass("selected");
				//row.find(".datum-id").slideDown();
				
				if(!AppController.identityController.owns(datum)){
					$("#"+prefix+"-menu").find(".fa-group").addClass("hide");
					var admin = AppController.loginController.getAdmin();
					if(!admin){
						$("#"+prefix+"-menu").find(".fa-trash").addClass("hide");
					}
				}
			}else{
				$(ev.target).closest(".row").removeClass("selected");
				//row.find(".datum-id").slideUp();
				
				var selected = [];
				$("#"+prefix+"-data").find(".row.selected").each(function(i, obj){
					selected.push(self.dataStore[$(obj).attr("datum-id")]);
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
				
				$(".dataViewMenu .dataViewSelected").text($(".dataView").find(".datum-select:checked").size());
			}else{
				$(ev.target).closest(".dataView").removeClass("selecting");
				
				if($("#"+prefix+"-menu").is(":visible")){
					$("#"+prefix+"-menu").slideUp();
				}
			}
			
		});
		
		var dataDisplay;
		
		if(callbacks != undefined && callbacks["buildData"] != undefined){
			dataDisplay = callbacks["buildData"](id, datum);
		}else{
			dataDisplay = defaultBuildRow(id, datum, callbacks);
		}
		
		var rowInner = $(dataDisplay);
		
		row.append(rowInner);
		
		var rowToolbar = $("<div class='rowToolbar'></div>");
		if(callbacks != undefined && callbacks["buildRowToolbar"] != undefined){
			rowToolbar.append(callbacks["buildRowToolbar"](id, datum));
		}else{
			rowToolbar.append(defaultBuildRowToolbar(id, datum, callbacks));
		}
		
		row.append(rowToolbar)
		
		$("#"+prefix+"-data").append(row);
	}
	
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
					element.closest(".row").remove();
				}, function(err){
					ModalManager.getCurrentModal().displayAlertMessage(err);
				})
			}, msg))
		}
	}
	
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
			var adminUser = AppController.loginController.getAdmin();
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
	
	
	function defaultBuildRow(id, datum, callbacks){
		var html = "<div class='small-6 columns'>" +
						"<a class='datum-name'>{{dataName}}</a>" +
						"<span class='datum-description'>{{dataDescription}}</span>" +
						//"<div class='datum-id' style='font-size:small;display:none;'>{{dataId}}</div>" + 
					"</div>" +
					"<div class='small-2 columns datum-type'>{{dataType}}</div>" +
					"<div class='small-4 columns datum-owner'>{{dataOwner}}</div>";
		
		html = html.replaceAll(/{{dataId}}/g, id);
		
		if(datum["name"] != undefined)
			html = html.replaceAll(/{{dataName}}/g, datum["name"])
		else
			html = html.replaceAll(/{{dataName}}/g, id);
	
		if(datum["description"] != undefined)
			html = html.replaceAll(/{{dataDescription}}/g, " - "+datum["description"])
		else
			html = html.replaceAll(/{{dataDescription}}/g, "");
			
		if(datum["type"] != undefined){
			var typeSplit = datum["type"].split("/");
			html = html.replaceAll(/{{dataType}}/g, typeSplit[typeSplit.length-1]);
		}else{
			html = html.replaceAll(/{{dataType}}/g, "");
		}
		
		if(datum["owner"] != undefined && datum["owner"].length > 0){
			var owner = "";
			for(var i in datum["owner"]){
				owner+= createContactSmall(datum["owner"][i])+ ", "
			}
			owner = owner.substring(0, owner.length-2);
			html = html.replaceAll(/{{dataOwner}}/g, owner);
		}else{
			html = html.replaceAll(/{{dataOwner}}/g, "Public");
		}
		
		var el = $(html)
		
		if(datum["name"] == undefined){
			el.find(".datum-name").css("font-size", "0.8rem");
		}
		
		el.find(".ownershipDisplay").each(function(i, element){
			$(element).children(".qrcodeCanvas").qrcode({
                width:128,
                height:128,
                text:forge.util.decode64($(element).find(".contactText").attr("title").replaceAll("-----.*-----","").trim())
            });  
		})
		
		el.find("a.datum-name").click(function(ev){
			ev.preventDefault();
			if(callbacks != undefined && callbacks["clickName"] != undefined){
				callbacks["clickName"](id, datum);
			}else{
				ScreenManager.changeScreen(new RepoViewScreen(datum));
			}
		})
		
		return el;
	}

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
		})
		
		row.find(".fa-clone").click(function(){
			var selected = [];
			$("#"+prefix+"-data").find(".row.selected").each(function(i, obj){
				selected.push(self.dataStore[$(obj).attr("datum-id")]);
			});
			
			ModalManager.showModal(new CopyResourceModal(selected, function(){
				ScreenManager.reloadCurrentScreen();
			}))
		});
		
		row.find(".fa-trash").click(function(){
			var selected = [];
			$("#"+prefix+"-data").find(".row.selected").each(function(i, obj){
				selected.push(self.dataStore[$(obj).attr("datum-id")]);
			});
			
			if(callbacks != undefined && callbacks["clickMenuDelete"] != undefined){
				callbacks["clickMenuDelete"](selected);
			}else{
				ModalManager.showModal(new ConfirmModal(function(){
					var deleted = 0;
					
					var runDelete = function(id, datum){
						EcRepository._delete(datum, function(){
							$("#"+prefix+"-data").find(".row[datum-id='"+id+"']").remove();
							
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
				selected.push(self.dataStore[$(obj).attr("datum-id")]);
			});
			
			if(selected.length == 1)
				selected = selected[0];
			
			if(callbacks != undefined && callbacks["clickMenuPermissions"] != undefined){
				callbacks["clickMenuPermissions"](selected);
			}else{
				ModalManager.showModal(new AdvancedPermissionsModal(selected, function(data){
					if(!data instanceof Array){
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
	
	function showNoDataMessage(prefix){
		$("#"+prefix+"-none").removeClass("hide");
		$("#"+prefix+"-progress").addClass("hide");
		$("#"+prefix+"-menu").addClass("hide");
		$("#"+prefix+"-data").addClass("hide");
	}
	
	function showProgressMessage(prefix){
		$("#"+prefix+"-progress").removeClass("hide");
		$("#"+prefix+"-none").addClass("hide");
		$("#"+prefix+"-menu").addClass("hide");
		$("#"+prefix+"-data").addClass("hide");
	}
	
	function deselectAll(prefix){
		$(".dataView").find(".row").removeClass("selected");
		
		$(".dataView").removeClass("selecting");
		
		$(".dataView .datum-select").attr("checked", false);
		
		if($("#"+prefix+"-menu").is(":visible")){
			$("#"+prefix+"-menu").slideUp();
		}
	}
	
	function getSelectedData(prefix, self){
		var selected = [];
		$("#"+prefix+"-data").find(".row.selected").each(function(i, obj){
			selected.push(self.dataStore[$(obj).attr("datum-id")]);
		});
		return selected;
	}
	
	/**
	 * The display function defines how this view should be displayed
	 * @param containerId: defines the container that this view should be displayed in
	 * 		for screens -> screenContainer
	 * 		for overlays -> overlayContainer
	 * 		for modals -> modalContainer
	 */
	DataViewer.prototype.display = function(containerId, callback){	
		var prefix = this.prefix;
		
		var callbacks = this.callbacks;
		
		var self = this;
		
		$(containerId).load("partial/other/dataViewer.html", function(){			
			
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
			
			if(callback != undefined)
				callback();
		});
	}
	
	DataViewer.prototype.clear = function(){
		$("#"+this.prefix+"-data").find(".row").remove();
	}
	
	DataViewer.prototype.populate = function(data){
		var dataSize;
		if(data instanceof Object){
			dataSize = Object.keys(data).length;
		}else if(data instanceof Array){
			dataSize = data.length;
		}
		
		if(dataSize > 0){
			populateData(data, this, this.prefix, this.callbacks);
		}else{
			showNoDataMessage(this.prefix);
		}
	}
	
	DataViewer.prototype.showNoDataMessage = function(){
		showNoDataMessage(this.prefix);
	}
	
	DataViewer.prototype.showProgressMessage = function(){
		showProgressMessage(this.prefix);
	}
	
	DataViewer.prototype.deselectAll = function(){
		deselectAll(this.prefix);
	}
	
	DataViewer.prototype.getSelected = function(){
		return getSelectedData(this.prefix, this);
	}
	
	return DataViewer;
})(DataViewer);