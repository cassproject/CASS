/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
CompetencyEditScreen = (function(CompetencyEditScreen){
	
	function createContactSmall(pem)
	{
		var ident = AppController.identityController.lookup(pem);
	    return '<span class="ownershipDisplay has-tip" tabindex>'
	    	+ '<span class="qrcodeCanvas"></span>'
	    	+ '<span class="contactText" title="'+pem+'">'+ident.displayName+'</span>'
	    	+ '</span>';
	}
	
	function displayCompetency(competency)
	{
		$('#competencyEditor').show();
	    $("#competencyEditId").val(competency.id);
	    $("#competencyEditName").val(competency.name);
	    $("#competencyEditDescription").val(competency.description);
	    $("#competencyEditScope").val(competency.scope);
	    
	    if(competency.owner != undefined && competency.owner.length > 0)
	    {
	    	for(var i = 0; i < competency.owner.length; i++)
	    	{
	    		if(i > 0)
	    			$("#competencyEditOwner").append(", ");
	    		
	    		var pem = competency.owner[i];
	    		
	    		var contact = $(createContactSmall(pem));
	    		$("#competencyEditOwner").append(contact);            
	    		contact.children(".qrcodeCanvas").qrcode({
	                width:128,
	                height:128,
	                text:forge.util.decode64(pem.replaceAll("-----.*-----","").trim())
	            });   
	    	}
	    }else{
	    	$("#competencyEditOwner").text("Public")
	    	$("#competencyEditOwnerAdvanced").hide();
	    }
	    
	    competency.levels(AppController.repoInterface, addLevel, errorRetrievingLevels)
	    
	}
	
	function addLevel(level){
		$("#competencyNoLevels").addClass("hide");
		
		
		var container = $("<span data-tooltip data-fade-out-duration='1500' class='level fake-a has-tip top'></span>");
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
		
		if($("#competencyLevelContainer").children(".level").size() > 0)
			$("#competencyLevelContainer").append(", ");
		
		$("#competencyLevelContainer").append(container);
		
		container.click(function(ev){
			ev.preventDefault();
			ModalManager.showModal(new EditLevelModal(level, function(level){
				container.foundation("destroy");
				container.remove();
				
				if(level != null)
					addLevel(level)
				else if($("#competencyLevelContainer").find(".level").size() == 0)
					$("#competencyNoLevels").removeClass("hide");
			}));
		});
		
		new Foundation.Tooltip(container, {"tipText":tip});
	}
	
	function saveSuccess(){
		$("#datum").effect("highlight", {}, 1500);
	}
	
	function errorRetrieving(err)
	{
		if(err == undefined)
			err = "Unable to Connect to Server to Retrieve Competency for Editing";
		ViewManager.getView("#competencyEditMessageContainer").displayAlert(err);
	}
	
	function errorSaving(err)
	{
		if(err == undefined)
			err = "Unable to Connect to Server to Save Competency";
		
		ViewManager.getView("#competencyEditMessageContainer").displayAlert(err, "saveFail");
	}
	
	function errorRetrievingLevels(err){
		if(err == undefined)
			err = "Unable to Connect to Server to Retrieve Competency Levels";
		
		ViewManager.getView("#competencyEditMessageContainer").displayAlert(err, "getLevels");
	}
	
	var NEW_COMPETENCY_NAME = "_New Competency";
	
	CompetencyEditScreen.prototype.display = function(containerId, callback)
	{
		var data = this.data;
		
		if(data != undefined && data.id != undefined)
		{
			ScreenManager.replaceHistory(this, containerId, {"id":data.id} )
		}
		
		if(data == undefined){
			data = new EcCompetency();
		    data.generateId(AppController.repoInterface.selectedServer);
		    data.name = NEW_COMPETENCY_NAME;
		    
		    if(AppController.identityController.selectedIdentity != undefined)
		    {
		    	data.addOwner(AppController.identityController.selectedIdentity.ppk.toPk());
		    }
		}
		
		$(containerId).load("partial/screen/competencyEdit.html", function(){
			ViewManager.showView(new MessageContainer("competencyEdit"), "#competencyEditMessageContainer", function(){
				if(data.name == NEW_COMPETENCY_NAME && AppController.identityController.selectedIdentity == undefined)
				{
					ViewManager.getView("#competencyEditMessageContainer").displayWarning("You are Creating a Public Competency, this competency can be modified by anyone")
				}
			});
			
			$("#competencyEditSearchBtn").attr("href", "#"+CompetencySearchScreen.prototype.displayName);
			$("#competencyEditSearchBtn").click(function(event){
				event.preventDefault();
				if(data.name == NEW_COMPETENCY_NAME)
				{
					ScreenManager.changeScreen(new CompetencySearchScreen())
				}
				else
				{
					ScreenManager.changeScreen(new CompetencySearchScreen(data));
				}
				
			});
			
			if(data.name == NEW_COMPETENCY_NAME)
			{
				$("#competencyEditViewBtn").hide();
				
			}
			else
			{
				$("#competencyEditViewBtn").attr("href", "#"+CompetencyViewScreen.prototype.displayName);
				$("#competencyEditViewBtn").click(function(event){
					event.preventDefault();
					ScreenManager.changeScreen(new CompetencyViewScreen(data))
				});
			}
			
			
			$("#competencyEditBtn").attr("href", "#"+CompetencyEditScreen.prototype.displayName);
			$("#competencyEditBtn").click(function(event){
				event.preventDefault();
			});
			
			$("#competencyEditCancelBtn").click(function(event){
				event.preventDefault();
				ScreenManager.changeScreen(new CompetencyViewScreen(data))
			});
			
			$("#competencyEditSaveBtn").click(function(event){
				event.preventDefault();
				 
				data.name = $("#competencyEditName").val();
				data.description = $("#competencyEditDescription").val();
				data.scope = $("#competencyEditScope").val();
				
				
				if(data.name != NEW_COMPETENCY_NAME){
					ViewManager.getView("#competencyEditMessageContainer").clearAlert("saveFail");
					ViewManager.getView("#competencyEditMessageContainer").clearAlert("defaultName");
					EcRepository.save(data, saveSuccess, errorSaving);
				}else{
					ViewManager.getView("#competencyEditMessageContainer").displayAlert("Cannot Save Competency With Default Name", "defaultName");
				}
			})
			
			$("#competencyEditSaveBtn").on("mousemove", function(){
				var url = $("#competencyEditId").val();
				var split = url.split("\/");
				if (split[split.length-4] == "data") 
					split[split.length-1] = new Date().getTime();
				$("#competencyEditId").val(split.join("/"));
			});
			
			$("#competencyAddLevel").click(function(ev){
				ev.preventDefault();
				ModalManager.showModal(new EditLevelModal(data, function(level){
					addLevel(level);
				}));
			});
			
			if(data.name == NEW_COMPETENCY_NAME)
			{
				displayCompetency(data);
			}
			else
			{
				AppController.repositoryController.viewCompetency(data.id, function(competency){
					data = competency;
					displayCompetency(competency)
				}, errorRetrieving);
			}
						
			if(callback != undefined)
				callback();
		});
	};
	
	return CompetencyEditScreen;
})(CompetencyEditScreen);