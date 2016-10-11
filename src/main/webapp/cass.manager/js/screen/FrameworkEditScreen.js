FrameworkEditScreen = (function(FrameworkEditScreen){
	
	var relationTypes = {
	    isEnabledBy:"Enabled By",
	    requires:"Requires",
	    desires:"Desires",
	    isRelatedTo:"Related To",
	    isEquivalentTo:"Equivalent To"
	}
	
	function createContactSmall(pk)
	{
		var ident = AppController.identityController.lookup(pk);
	    return '<span class="ownershipDisplay has-tip" tabindex>'
	    	+ '<span class="qrcodeCanvas"></span>'
	    	+ '<span class="contactText" title="'+pk+'">'+ident.displayName+'</span>'
	    	+ '</span>';
	}
	
	function displayFramework(framework)
	{
	    $("#frameworkEditId").val(framework.id);
	    $("#frameworkEditName").val(framework.name);
	    $("#frameworkEditDescription").val(framework.description);
	    
	    if(framework.owner != undefined && framework.owner.length != 0)
	    {
	    	$("#frameworkEditOwner").html("");
	    	for(var i = 0; i < framework.owner.length; i++)
	    	{
	    		var pk = framework.owner[i];
	    		
	    		var contact = $(createContactSmall(pk));
	    		$("#frameworkEditOwner").append(contact);            
	    		contact.children(".qrcodeCanvas").qrcode({
	                width:128,
	                height:128,
	                text:forge.util.decode64(pk.replaceAll("-----.*-----","").trim())
	            });
	    		
	    		if(i < framework.owner.length-1)
	    			$("#frameworkEditOwner").append(", ");
	    	}
	    	$("#frameworkEditOwnerAdvanced").removeClass("hide");
	    }else{
	    	$("#frameworkEditOwner").text("Public")
	    	$("#frameworkEditOwnerAdvanced").addClass("hide");
	    }
	    
	    if(framework.privateEncrypted){
			if($("#privateRow").css("display") == "none")
				$("#privateRow").slideDown();
			
			if(framework.reader != undefined && framework.reader.length != 0)
		    {
		    	$("#frameworkEditNoReaders").addClass("hide");
		    	$("#frameworkEditReaders").html("");
		    	for(var i = 0; i < framework.reader.length; i++)
		    	{
		    		var pk = framework.reader[i];
		    		
		    		var contact = $(createContactSmall(pk));
		    		$("#frameworkEditReaders").append(contact);            
		    		contact.children(".qrcodeCanvas").qrcode({
		                width:128,
		                height:128,
		                text:forge.util.decode64(pk.replaceAll("-----.*-----","").trim())
		            });
		    		
		    		if(i < framework.reader.length-1)
		    			$("#frameworkEditReaders").append(", ");
		    	}
		    }else{
		    	$("#frameworkEditNoReaders").removeClass("hide");
		    }
		}else if($("#privateRow").css("display") != "none"){
			$("#privateRow").slideUp();
		}
		
	    
	    $("#frameworkEditCompetencies option").not("#noCompetencies").remove();
	    for(var idx in framework.competency)
	    {
	    	EcCompetency.get(framework.competency[idx], addCompetency, errorRetrievingCompetency);
	    }

	    $("#frameworkEditRelations option").not("#noRelations").remove();
	    for(var idx in framework.relation)
	    {
	    	EcAlignment.get(framework.relation[idx], addRelation, errorRetrievingRelation)
	    }
	    
	    $("#frameworkEditLevels option").not("#noLevels").remove();
	    for(var idx in framework.level)
	    {
	    	EcLevel.get(framework.level[idx], function(level){addLevel(framework,level);}, errorRetrievingLevel);
	    }
	}
	
	function addCompetency(competency){
		$("#frameworkEditCompetencies #noCompetencies").hide();
		
		$("#frameworkEditCompetencies").removeAttr("disabled");
		$("#frameworkEditCompetencies").removeClass("empty");
		
		$("#frameworkEditCompetencies").append("<option title='"+competency.id+"' id='"+competency.id+"' value='"+competency.id+"'>"+competency.name+(competency.description == undefined ? "" : " - "+competency.description)+"</option>");
	}
	
	function addRelation(relation){
		$("#frameworkEditRelations #noRelations").hide();
		
		$("#frameworkEditRelations").removeAttr("disabled");
		$("#frameworkEditRelations").removeClass("empty");
		
		var sourceId = EcRemoteLinkedData.trimVersionFromUrl(relation.source).split("/");
		sourceId = sourceId[sourceId.length-1] + "-relations";
		
		
		var competencyGroup = $("#frameworkEditRelations optgroup#"+sourceId);
		if(competencyGroup.size() == 0){
			competencyGroup = $("<optgroup id='"+sourceId+"' label='"+EcCompetency.getBlocking(relation.source).name+"'></optgroup>");
			$("#frameworkEditRelations").append(competencyGroup);
		}
		
		var basicId = relation.shortId().split("/");
		basicId = basicId[basicId.length-1];
		
		competencyGroup.append("<option id='"+basicId+"' value='"+relation.id+"' style='font-style:italic;'>"+relation["relationType"]+" "+EcCompetency.getBlocking(relation.target).name+"</option>")
		
	}
	
	function addLevel(framework, level){
		$("#frameworkEditLevels #noLevels").hide();
		
		$("#frameworkEditLevels").removeAttr("disabled");
		$("#frameworkEditLevels").removeClass("empty");
		
		var competency = EcCompetency.getBlocking(level.competency);
		
		if(competency == undefined)
			competency = EcCompetency.getBlocking(EcRemoteLinkedData.trimVersionFromUrl(level.competency));
				
		var competencyId = competency.shortId().split("/");
		competencyId = competencyId[competencyId.length-1] + "-levels";
		
		var competencyGroup = $("#frameworkEditLevels optgroup#"+competencyId);
		
		if(competencyGroup.size() == 0){
			competencyGroup = $("<optgroup id='"+competencyId+"' label='"+competency.name+"'></optgroup>");
			$("#frameworkEditLevels").append(competencyGroup);
		}
		
		var basicId = level.shortId().split("/");
		basicId = basicId[basicId.length-1];
		
		competencyGroup.append("<option id='"+basicId+"' value='"+level.id+"' style='font-style:italic' title='"+(level.performance == undefined ? level.description : level.performance)+"'>"+level.name+" (Title: "+level.title+")</option>")
	}
	
	function saveSuccess(){
		$("#datum").effect("highlight", {}, 1500);
	}
	
	function errorRetrieving(err)
	{
		if(err == undefined)
			err = "Unable to Connect to Server to Retrieve Competency for Editing";
		ViewManager.getView("#frameworkEditMessageContainer").displayAlert(err);
	}
	
	function errorSaving(err)
	{
		if(err == undefined)
			err = "Unable to Connect to Server to Save Competency";
		
		ViewManager.getView("#frameworkEditMessageContainer").displayAlert(err, "saveFail");
	}
	
	function errorRetrievingCompetency(err){
		if(err == undefined)
			err = "Unable to Connect to Server to Retrieve Competency";
		
		ViewManager.getView("#frameworkEditMessageContainer").displayAlert(err, "getCompetency");
	}
	
	function errorRetrievingRelation(err){
		if(err == undefined)
			err = "Unable to Connect to Server to Retrieve Relation";
		
		ViewManager.getView("#frameworkEditMessageContainer").displayAlert(err, "getRelation");
	}
	
	function errorRetrievingLevel(err){
		if(err == undefined)
			err = "Unable to Connect to Server to Retrieve Level";
		
		ViewManager.getView("#frameworkEditMessageContainer").displayAlert(err, "getLevel");
	}
	
	function errorSearchingCompetencies(err){
		if(err == undefined)
			err = "Unable to Connect to Server to Search Competency";
		
		ViewManager.getView("#frameworkEditMessageContainer").displayAlert(err, "searchCompetencies");
	}
	
	function errorSearchingRelations(err){
		if(err == undefined)
			err = "Unable to Connect to Server to Search Relations";
		
		ViewManager.getView("#frameworkEditMessageContainer").displayAlert(err, "searchRelations");
	}
	
	function errorSearchingLevels(err){
		if(err == undefined)
			err = "Unable to Connect to Server to Search Levels";
		
		ViewManager.getView("#frameworkEditMessageContainer").displayAlert(err, "searchLevels");
	}
	
	function errorRemovingCompetency(err){
		ViewManager.getView("#frameworkEditMessageContainer").displayAlert(err, "removeCompetency");
	}
	
	var _setupLevelTypeahead = setupLevelTypeahead;
	function setupLevelTypeahead(framework){
		$("#frameworkEditAddLevel").typeahead({
	  		hint: false,
	  		highlight: true,
	  		minLength: 2,
		},
		{
	  		name: 'levels',
	  		source: function(q, syncCallback, asyncCallback){
	  			var levels = {};
	  			
	  			var i = 0;
	  			for(var id in framework.competency)
	  			{
	  				EcCompetency.get(id,function(competency){
		  				competency.levels(AppController.repoInterface, undefined, errorSearchingLevels, function(results){
		  					i++;
		  					
		  					for(var idx in results){
		  						levels[results[idx].id] = results[idx];
		  					}
		  					
		  					if(i == framework.competency.length){
		  						var ret = [];
		  						for(var id in levels){
		  							if(framework.level == undefined || framework.level.indexOf(id) == -1 && framework.level.indexOf(EcRemoteLinkedData.trimVersionFromUrl(id)) == -1)
			  						{
		  								ret.push(levels[id])
			  						}
		  						}
		  						
		  						asyncCallback(ret);		  					
		  					}
		  				});
	  				});
	  			}
			},
			async:true,
	  		display: function(data){ return EcCompetency.getBlocking(data.competency).name +" - "+data.name+" (Title: "+ data["title"]+ ")"; },
	  		templates:{
	  			suggestion:function(data){ return "<div>"+EcCompetency.getBlocking(data.competency).name+" - <i>"+data["name"]+" (Title: "+data["title"]+ ")</i></div>"; }
	  		}
		}).bind("typeahead:selected", function(ev, data){
			$('#frameworkEditAddLevel').typeahead('val', "");
			framework.addLevel(data.id);
			addLevel(framework, data);
		}).bind("typeahead:autocompleted", function(obj, data){
			$('#frameworkEditAddLevel').typeahead('val', "");
			framework.addLevel(data.id);
			addLevel(framework, data);
		});
	}
	
	var _setupRelationTypehead = setupRelationTypeahead;
	function setupRelationTypeahead(framework){
		$("#frameworkEditAddRelation").typeahead({
	  		hint: false,
	  		highlight: true,
	  		minLength: 2,
		},
		{
	  		name: 'relations',
	  		source: function(q, syncCallback, asyncCallback){
	  			var relations = {};
	  			
	  			var i = 0;
	  			for(var id in framework.competency)
	  			{
	  				EcAlignment.searchBySource(AppController.repoInterface, id, function(results){
	  					i++;
	  					
	  					for(var idx in results){
	  						relations[results[idx].id] = results[idx];
	  					}
	  					
	  					if(i == framework.competency.length){
	  						var ret = [];
	  						for(var id in relations){
	  							if(framework.relation == undefined || framework.relation.indexOf(id) == -1 && framework.relation.indexOf(EcRemoteLinkedData.trimVersionFromUrl(id)) == -1)
	  							{
	  								var rel = relations[id];			  							
	  								ret.push(rel);
  									if(ret.length == Object.keys(relations).length)
  										asyncCallback(ret);
	  							}
	  							else
	  							{
	  								delete relations[id]
	  							}
	  						}
	  							
	  						
	  						
	  					}
	  				}, errorSearchingRelations);
	  			}
			},
			async:true,
	  		display: function(data){ 
	  			return EcCompetency.getBlocking(data.source).name+" "+relationTypes[data["relationType"]]+" "+EcCompetency.getBlocking(data.target).name; 
	  		},
	  		templates:{
	  			suggestion:function(data){ return "<div>"+data["name"]+" ("+ EcCompetency.getBlocking(data.source).name+" <i>"+relationTypes[data["relationType"]]+"</i> "+EcCompetency.getBlocking(data.target).name + ")</div>"; }
	  		}
		}).bind("typeahead:selected", function(ev, data){
			$('#frameworkEditAddRelation').typeahead('val', "");
			framework.addRelation(data.id);
			addRelation(data);
		}).bind("typeahead:autocompleted", function(obj, data){
			$('#frameworkEditAddRelation').typeahead('val', "");
			framework.addRelation(data.id);
			addRelation(data);
		});
	}
	
	function setupCompetencyTypeahead(framework){		
		$("#frameworkEditAddCompetency").typeahead({
	  		hint: false,
	  		highlight: true,
	  		minLength: 2,
		},
		{
			limit: 25,
	  		name: 'competencies',
	  		source: function(q, syncCallback, asyncCallback){
	  			EcCompetency.search(AppController.repoInterface, q, function(results){
	  				var filtered = [];
					
					for(var idx in results){
						if(framework.competency == undefined 
								|| (framework.competency.indexOf(results[idx].id) == -1
								&& framework.competency.indexOf(results[idx].shortId()) == -1)){
							filtered.push(results[idx]);
						}
					}
					
					asyncCallback(filtered);
	  			}, errorSearchingCompetencies);
			},
			async:true,
	  		display: function(data){ return data["name"]; },
	  		templates:{
	  			suggestion:function(data){ return "<div title='"+data["title"]+"'>" + data["name"] + "</div>"; }
	  		}
		}).bind("typeahead:selected", function(ev, data){
			$('#frameworkEditAddCompetency').typeahead('val', "");
			framework.addCompetency(data.id);
			addCompetency(data);
			
		}).bind("typeahead:autocompleted", function(obj, data){
			$('#frameworkEditAddCompetency').typeahead('val', "");
			framework.addCompetency(data.id);
			addCompetency(data);
			
		});
	}
	
	var NEW_FRAMEWORK_NAME = "_New Framework";
	
	FrameworkEditScreen.prototype.display = function(containerId, callback)
	{
		var data = this.data;
		
		if(data != undefined && data.id != undefined)
		{
			ScreenManager.setScreenParameters({"id": EcRemoteLinkedData.trimVersionFromUrl(data.id)} )
		}
		
		if(data == undefined){
			data = new EcFramework();
		    data.generateId(AppController.repoInterface.selectedServer);
		    data.name = NEW_FRAMEWORK_NAME;
		    
		    if(AppController.identityController.selectedIdentity != undefined)
		    {
		    	data.addOwner(AppController.identityController.selectedIdentity.ppk.toPk());
		    }
		}
		
		ViewManager.showView(new MessageContainer("frameworkEdit"), "#frameworkEditMessageContainer", function(){
			if(data.name == NEW_FRAMEWORK_NAME && AppController.identityController.selectedIdentity == undefined)
			{
				ViewManager.getView("#frameworkEditMessageContainer").displayWarning("You are Creating a Public Framework, this competency can be modified by anyone")
			}
		});

		$("#frameworkEditSearchBtn").attr("href", "#"+FrameworkSearchScreen.prototype.displayName);
		$("#frameworkEditSearchBtn").click(function(event){
			event.preventDefault();
			if(data.name == NEW_FRAMEWORK_NAME)
			{
				ScreenManager.changeScreen(new FrameworkSearchScreen())
			}
			else
			{
				ScreenManager.changeScreen(new FrameworkSearchScreen(data));
			}
			
		});

		if(data.name == NEW_FRAMEWORK_NAME)
		{
			$("#frameworkEditCreateCompetency").hide();
			
		}
		else
		{
			$("#frameworkEditCreateCompetency").attr("href", "#"+FrameworkEditScreen.prototype.displayName+"?frameworkId="+EcRemoteLinkedData.trimVersionFromUrl(data.id));
			$("#frameworkEditCreateCompetency").click(function(event){
				event.preventDefault();
				if(data.name == NEW_FRAMEWORK_NAME)
				{
				}
				else
				{
					ScreenManager.changeScreen(new CompetencyEditScreen(null,data.id));
				}			
			});
		}
		
		if(data.name == NEW_FRAMEWORK_NAME)
		{
			$("#frameworkEditViewBtn").hide();
			
		}
		else
		{
			$("#frameworkEditViewBtn").attr("href", "#"+FrameworkViewScreen.prototype.displayName);
			$("#frameworkEditViewBtn").click(function(event){
				event.preventDefault();
				ScreenManager.changeScreen(new FrameworkViewScreen(data))
			});
		}
		
		
		$("#frameworkEditBtn").attr("href", "#"+FrameworkEditScreen.prototype.displayName);
		$("#frameworkEditBtn").click(function(event){
			event.preventDefault();
		});
		
		$("#frameworkEditCancelBtn").click(function(event){
			event.preventDefault();
			ScreenManager.changeScreen(new FrameworkViewScreen(data))
		});
		
		if(data.name == NEW_FRAMEWORK_NAME){
			$("#frameworkEditDeleteBtn").remove();	
		}else{
			$("#frameworkEditDeleteBtn").click(function(event){
				event.preventDefault();
				ModalManager.showModal(new ConfirmModal(function(){
					data._delete(function(){
						ScreenManager.changeScreen(new FrameworkSearchScreen());
					}, function(err){
						if(err == undefined)
							err = "Unable to connect to server to delete framework";
						ViewManager.getView("#frameworkEditMessageContainer").displayAlert(err)
					});
					ModalManager.hideModal();
				}, "Are you sure you want to delete this framework?"))
			})
		}
		
		
		$("#frameworkEditSaveBtn").click(function(event){
			event.preventDefault();
			 
			data.name = $("#frameworkEditName").val();
			data.description = $("#frameworkEditDescription").val();
			data.id = $("#frameworkEditId").val();
			
			if(data.name != NEW_FRAMEWORK_NAME){
				ViewManager.getView("#frameworkEditMessageContainer").clearAlert("saveFail");
				ViewManager.getView("#frameworkEditMessageContainer").clearAlert("defaultName");
				
				var savingData = new EcFramework();
				for(var key in data){
					savingData[key] = data[key];
				}
				
				savingData.save(function(str){
					data.id = savingData.id;
					$("#frameworkEditId").val(data.id);
					saveSuccess(str);
				}, errorSaving);
			}else{
				ViewManager.getView("#frameworkEditMessageContainer").displayAlert("Cannot Save Framework With Default Name", "defaultName");
			}
		})
		
		$("#frameworkEditSaveBtn").on("mousemove", function(){
			var url = $("#frameworkEditId").val();
			var split = url.split("\/");
			if (split[split.length-4] == "data") 
				split[split.length-1] = new Date().getTime();
			$("#frameworkEditId").val(split.join("/"));
		});
		
		$("#importCompetenciesBtn").click(function(){
			ModalManager.showModal(new ImportCompetenciesModal(data));
		})
		
		$("#frameworkEditCompetencies").focus(function(){
			setTimeout(function(){
				if($("#frameworkEditCompetencies").val() != undefined && $("#frameworkEditCompetencies").val() != "")
				{
					$("#frameworkEditCompetencies").css("margin-bottom", "0rem");
					$("#frameworkEditDeleteCompetency").slideDown();
				}
			}, 100)
		});
		$("#frameworkEditCompetencies").blur(function(){
			$("#frameworkEditDeleteCompetency").slideUp(function(){
				$("#frameworkEditCompetencies").css("margin-bottom", "1rem");
			});
		});
		$("#frameworkEditDeleteCompetency").click(function(ev){
			ev.preventDefault();
			var ids = $("#frameworkEditCompetencies").val();
			
			for(var idx in ids){
				var id = ids[idx];
				
				data.removeCompetency(id, function(){
					$("#frameworkEditOwner").text("");
					$("#frameworkEditCompetencies").html("");
					$("#frameworkEditRelations").html("");
					$("#frameworkEditLevels").html("");
					
					data.name = $("#frameworkEditName").val();
					data.description = $("#frameworkEditDescription").val();
					
					displayFramework(data);
				}, errorRemovingCompetency);
			}
		});
		
		$("#frameworkEditRelations").focus(function(){
			setTimeout(function(){
				if($("#frameworkEditRelations").val() != undefined && $("#frameworkEditRelations").val() != "")
				{
					$("#frameworkEditRelations").css("margin-bottom", "0rem");
					$("#frameworkEditDeleteRelation").slideDown();
				}
			}, 100);
		});
		$("#frameworkEditRelations").blur(function(){
			$("#frameworkEditDeleteRelation").slideUp(function(){
				$("#frameworkEditRelations").css("margin-bottom", "1rem");
			});
		});
		$("#frameworkEditDeleteRelation").click(function(ev){
			ev.preventDefault();
			var ids = $("#frameworkEditRelations").val();
			
			for(var idx in ids){
				var id = ids[idx];
				
				data.removeRelation(id);

				var basicId = EcRemoteLinkedData.trimVersionFromUrl(id).split("/");
				basicId = basicId[basicId.length-1];
				$("#frameworkEditRelations #"+basicId).remove();
			}
			
			$("#frameworkEditRelations optgroup").each(function(idx, el){
				if($(el).children().size() == 0)
					$(el).remove();
			})
		});
		
		$("#frameworkEditLevels").focus(function(){
			setTimeout(function(){
				if($("#frameworkEditLevels").val() != undefined && $("#frameworkEditLevels").val() != "")
				{
					$("#frameworkEditLevels").css("margin-bottom", "0rem");
					$("#frameworkEditDeleteLevel").slideDown();
				}
			}, 100);
		});
		$("#frameworkEditLevels").blur(function(){
			$("#frameworkEditDeleteLevel").slideUp(function(){
				$("#frameworkEditLevels").css("margin-bottom", "1rem");
			});
		});
		$("#frameworkEditDeleteLevel").click(function(ev){
			ev.preventDefault();
			var ids = $("#frameworkEditLevels").val();
			
			for(var idx in ids){
				var id = ids[idx];
				
				data.removeLevel(id);
				
				var basicId = EcRemoteLinkedData.trimVersionFromUrl(id).split("/");
				basicId = basicId[basicId.length-1];
				$("#frameworkEditLevels #"+basicId).remove();
			}
			
			$("#frameworkEditLevels optgroup").each(function(idx, el){
				if($(el).children().size() == 0)
					$(el).remove();
			})
		});
		
		$("#frameworkEditOwnerAdvanced").click(function(ev){
			ev.preventDefault();
			
			data.name = $("#frameworkEditName").val();
			data.description = $("#frameworkEditDescription").val();
			
			ModalManager.showModal(new AdvancedPermissionsModal(data, function(dataAfter){
				data.owner = dataAfter.owner;
				data.privateEncrypted = dataAfter.privateEncrypted;
				data.reader = dataAfter.reader;
				
				displayFramework(data);
				
				ModalManager.hideModal();
			}))
		})
		
		
		if(data.name == NEW_FRAMEWORK_NAME)
		{
			displayFramework(data);
			setupCompetencyTypeahead(data);
		    setupRelationTypeahead(data);
		    setupLevelTypeahead(data);
		}
		else{
			EcFramework.get(data.id, function(framework){
				data = framework;
				
				displayFramework(data);
				setupCompetencyTypeahead(data);
			    setupRelationTypeahead(data);
			    setupLevelTypeahead(data);
			}, errorRetrieving);
		}
			
	};

	FrameworkEditScreen.prototype.addCompetency = function(competency){
		addCompetency(competency);
	}
	
	FrameworkEditScreen.prototype.addRelation = function(relation){
		addRelation(relation);
	}
	
	return FrameworkEditScreen;
})(FrameworkEditScreen);