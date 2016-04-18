/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
FrameworkViewScreen = (function(FrameworkViewScreen){
	
	var relationTypes = {
	    isEnabledBy:"Enabled By",
	    requires:"Requires",
	    desires:"Desires",
	    isRelatedTo:"Related To",
	    isEquivalentTo:"Equivalent To"
	}
	
	var competencyContainer = "<li class='competency' style='margin-top:0.5rem;cursor:pointer;'><h6 class='competencyName' style='margin-bottom:0px;'><a></a> <small class='competencyId'></small></a></h6>" +
								"<div class='hide competencyDetails'>" +
								"<small class='competencyDescription' style='font-size:65%; margin-left:1.25rem;'></small>" +
								"<small class='competencyLevels hide' style='margin-left:1.25rem;display:block;'><span class='prefix'>Levels:</span> </small>" +
								"<ul class='competencyRelations' style='list-style:none; line-height:0.75rem;'></ul>" +
								"</div></li>";
	
	var relationContainer = "<li class='relation'><small><a><i class='relationType'></i> </a></small></li>";
	
	function createContactSmall(pem) {
		var ident = AppController.identityController.lookup(pem);
		return '<span class="ownershipDisplay has-tip" tabindex>'
				+ '<span class="qrcodeCanvas"></span>'
				+ '<span class="contactText" title="' + pem + '">'
				+ ident.displayName + '</span>' + '</span>';
	}
	
	function displayFramework(framework)
	{	    
	    $("#frameworkViewerId").text(framework.id);
	    $(".frameworkViewerName").text(framework.name);
	    $("#frameworkViewerDescription").text(framework.description);
	    $("#frameworkViewerLevels").html("");
	    
	    if(framework.competency == undefined || framework.competency.length == 0){
	    	$("#frameworkViewerContents").addClass("hide");
	    }
	    
	    for(var idx in framework.competency){
	    	EcRepository.get(framework.competency[idx], function(competency){
	    		if(framework.competencyObjects == undefined){
	    			framework.competencyObjects = {};
	    		}
	    		framework.competencyObjects[competency.id] = competency;
	    		
	    		addCompetency(competency);
	    	}, errorRetrievingCompetency);
	    }
	    
	    for(var idx in framework.relation){
	    	EcRepository.get(framework.relation[idx], function(relation){
	    		addRelation(relation, framework);
	    	}, errorRetrievingRelation);
	    }
	    
	    for(var idx in framework.level){
	    	EcRepository.get(framework.level[idx], addLevel, errorRetrievingLevel);
	    }
	    
	    if (framework.owner != undefined && framework.owner.length > 0) {
			$("#frameworkViewOwner").text("")
			for (var i = 0; i < framework.owner.length; i++) {
				if (i > 0)
					$("#frameworkViewOwner").append(", ");

				var pem = framework.owner[i];

				var contact = $(createContactSmall(pem));
				$("#frameworkViewOwner").append(contact);
				contact.children(".qrcodeCanvas").qrcode({
					width : 128,
					height : 128,
					text : forge.util.decode64(pem.replaceAll("-----.*-----", "").trim())
				});
			}
		} else {
			$("#frameworkViewOwner").text("Public")
		}
	}
	
	function addCompetency(competency)
	{
		var id = competency.shortId();
		id = id.split("/");
		id = id[id.length-1]
		
		var container = $(competencyContainer);
		container.attr('id', "competency-"+id);
		
		container.find(".competencyName").find('a').attr('href', "#"+CompetencyViewScreen+"?id="+competency.id);
		container.find(".competencyName").find('a').click(function(ev){
			ev.preventDefault();
			ScreenManager.changeScreen(new CompetencyViewScreen(competency));
		});
		
		container.click(function(ev){
			ev.preventDefault()
			$(container).find(".competencyDetails").toggleClass("hide")
		})
		
		
		container.find(".competencyName").find('a').text(competency.name);
		container.find(".competencyId").text(competency.id);
		container.find(".competencyDescription").text(competency.description);
		
		$("#frameworkContents").append(container);
	}
	
	var _addRelation = addRelation;
	function addRelation(relation, framework)
	{
		var sourceId =  EcRemoteLinkedData.trimVersionFromUrl(relation.source).split("/");
		sourceId = sourceId[sourceId.length-1];
		
		if($("#competency-"+sourceId).size() == 0){
			setTimeout(function(){ _addRelation(relation, framework); }, 100);
		}else{
			var id = relation.shortId().split("/");
			id = id[id.length-1];
			
			var container = $(relationContainer); 
			container.attr("id", "relation"+id);
			
			container.find(".relationType").text(relationTypes[relation["relationType"]]);
			
			container.find("a").attr("href", "#"+RelationshipEditScreen.displayName+"?id="+relation.id);
			
			container.find("a").click(function(ev){
				ev.preventDefault();
				ScreenManager.changeScreen(new RelationshipEditScreen(relation));
			});
			
			if(framework.competencyObjects != undefined && framework.competencyObjects[relation.target] != undefined){
				container.find("a").append(framework.competencyObjects[relation.target].name);
				$("#competency-"+sourceId).find(".competencyRelations").append(container);
			}else{
				AppController.repositoryController.viewCompetency(relation.target, function(competency){
					container.find("a").append(competency.name);
					$("#competency-"+sourceId).find(".competencyRelations").append(container);
				}, errorRetrievingCompetency);
			}
		}
	}
	
	var _addLevel = addLevel;
	function addLevel(level)
	{
		var container = $("<span data-tooltip data-fade-out-duration='1500' class='level has-tip top' style='font-weight:normal;'></span>");
		container.append(level.name);
		container.attr("id", level.id);
		
		var tip = "";
		if(level.description != undefined && level.description != "")
			tip += "Description: "+level.description+"<br/><br/>";
		if(level.title != undefined && level.title != "")
			tip += "Title: "+level.title+"<br/><br/>";
		if(level.performance != undefined && level.performance != "")
			tip += "Performance Measure: "+level.performance+"<br/><br/>";
		if(level.owner != undefined && level.owner.length > 0){
			tip += "Owner: ";
			for(var i = 0; i < level.owner.length; i++)
			{
				if(i != 0)
					tip+=", ";
				tip+=AppController.identityController.lookup(level.owner[i]).displayName;
			}
			tip+= "<br/><br/>"
		}
				
		tip += level.id;
		
		var competencyId = EcRemoteLinkedData.trimVersionFromUrl(level.competency).split("/");
		competencyId = competencyId[competencyId.length-1];
		
		var levelContainer = $("#competency-"+competencyId+" .competencyLevels");
		
		if(levelContainer.size() == 0){
			setTimeout(function(){
				_addLevel(level);
			}, 100);
		}else{
			if(levelContainer.children(".level").size() > 1)
				levelContainer.append(", ");
			levelContainer.append(container);
			levelContainer.removeClass("hide");
			
			new Foundation.Tooltip(container, {"tipText":tip});
		}
	}
	
	function errorRetrieving(err)
	{
		if(err == undefined)
			err = "Unable to Connect to Server to Retrieve Competency";
		
		ViewManager.getView("#frameworkViewMessageContainer").displayAlert(err, "getFramework");
	}
	
	function errorRetrievingCompetency(err)
	{
		if(err == undefined)
			err = "Unable to Connect to Server to Retrieve one or more Competencies";
		
		ViewManager.getView("#frameworkViewMessageContainer").displayAlert(err, "getCompetency");
	}
	
	function errorRetrievingRelation(err)
	{
		if(err == undefined)
			err = "Unable to Connect to Server to Retrieve one or more Relation(s)";
		
		ViewManager.getView("#frameworkViewMessageContainer").displayAlert(err, "getRelation");
	}
	
	function errorRetrievingLevel(err)
	{
		if(err == undefined)
			err = "Unable to Connect to Server to Retrieve one or more Level(s)";
		
		ViewManager.getView("#frameworkViewMessageContainer").displayAlert(err, "getLevel");
	}
	
	FrameworkViewScreen.prototype.display = function(containerId, callback)
	{
		var data = this.data;
		
		if(data.id != null)
		{
			ScreenManager.replaceHistory(this, containerId, {"id":data.id} )
		}
		
		$(containerId).load("partial/screen/frameworkView.html", function(){
			
			ViewManager.showView(new MessageContainer("frameworkView"), "#frameworkViewMessageContainer");
			
			$("#frameworkViewSearchBtn").attr("href", "#"+FrameworkSearchScreen.prototype.displayName);
			$("#frameworkViewSearchBtn").click(function(event){
				event.preventDefault();
				ScreenManager.changeScreen(new FrameworkSearchScreen(data))
			});
			
			$("#frameworkViewBtn").attr("href", "#"+FrameworkViewScreen.prototype.displayName);
			$("#frameworkViewBtn").click(function(event){
				event.preventDefault();
			});
			
			var canEdit = false;
			for(var index in EcIdentityManager.ids){
				var pk = EcIdentityManager.ids[index].ppk.toPk()
				if(data.canEdit(pk))
					canEdit = true;
			}
			
			if(data.owner == undefined || data.owner.length == 0)
				canEdit = true;
			
			if(canEdit){
				$("#editFrameworkBtn").click(function(event){
					event.preventDefault();
					ScreenManager.changeScreen(new FrameworkEditScreen(data))
				})
			}else{
				$("#editFrameworkBtn").remove();
			}
			
			
			EcRepository.get(data.id, displayFramework, errorRetrieving);
			
			if(callback != undefined)
				callback();
		});
	};
	
	return FrameworkViewScreen;
})(FrameworkViewScreen);