/**
 * Screen with a panel for displaying assertion details
 * 
 * @module cass.manager
 * @class AssertionViewScreen
 * 
 * @author devlin.junker@eduworks.com
 */
AssertionViewScreen = (function(AssertionViewScreen){
	
	/**
	 * Displays the assertion details in the HTML panel
	 * 
	 * @memberOf AssertionViewScreen
	 * @method displayAssertion
	 * @private
	 * @param {EcAssertion} assertion
	 * 				Assertion to display
	 */
	function displayAssertion(assertion)
	{	    
	    $("#assertionViewId").text(assertion.id);
	    
	    var agent = assertion.getAgent();
	    if(agent != undefined){
	    	var contact = $(createContactSmall(agent.toPem()));
	    	$("#assertionViewAgent").html(contact);
	    	ViewManager.showView(new IdentityDisplay(agent.toPem()), "#assertionViewAgent");
	    	if(contact.find(".contactText").text() == "Unknown"){
	    		$("#assertionViewAgentContainer").addClass("unknown");
	    		$("#assertionToggleUnknownBtn").removeClass("hide");
	    	}
	    }else{
	    	$("#assertionViewAgent").html("<span style='font-style:italic'>Unknown</span>");
	    	$("#assertionViewAgentContainer").addClass("unknown");
	    	$("#assertionViewAgentContainer").css("display", "none");
	    	$("#assertionToggleUnknownBtn").removeClass("hide");
	    }
	    
	    var sub = assertion.getSubject()
	    if(sub != undefined){
	    	//var contact = $(createContactSmall(sub.toPem()));
	    	//$("#assertionViewSubject").html(contact);
	    	ViewManager.showView(new IdentityDisplay(sub.toPem()), "#assertionViewSubject");
	    	if(contact.find(".contactText").text() == "Unknown"){
	    		$("#assertionViewSubjectContainer").addClass("unknown");
	    		$("#assertionToggleUnknownBtn").removeClass("hide");
	    	}
	    }else{
	    	$("#assertionViewSubject").html("<span style='font-style:italic'>Unknown</span>");
	    	$("#assertionViewSubjectContainer").addClass("unknown");
	    	$("#assertionViewSubjectContainer").css("display", "none");
	    	$("#assertionToggleUnknownBtn").removeClass("hide");
	    }
	    
	    
	    var competency = assertion.competency;
	    if(competency != undefined){
	    	EcCompetency.get(competency, function(competency){
	    		if(competency != undefined){
	    			var el = $("<a href='"+CompetencyViewScreen.displayName+"?id="+competency.id+"'>"+competency.name+"</a>");
	    			el.click(function(ev){
	    				ev.preventDefault();
	    				ScreenManager.changeScreen(new CompetencyViewScreen(competency));
	    			})
		    		$("#assertionViewCompetency").html(el);
	    		}else{
	    			$("#assertionViewCompetency").html("<span style='font-style:italic'>Unknown</span>");
	    			$("#assertionViewCompetencyContainer").addClass(" unknown");
	    			$("#assertionViewCompetencyContainer").css("display", "none");
	    			$("#assertionToggleUnknownBtn").removeClass("hide");
	    		}
	    		
	    	}, function(err){
	    		try{
	    			JSON.parse(err);
	    			
	    			errorFindingCompetency(err);
	    			
	    			return;
	    		}catch(e){}
	    		
	    		$("#assertionViewCompetency").html("<span style='font-style:italic'>Unknown</span>");
    			$("#assertionViewCompetencyContainer").addClass(" unknown");
    			$("#assertionViewCompetencyContainer").css("display", "none");
    			$("#assertionToggleUnknownBtn").removeClass("hide");
	    		
	    	});
	    }else{
	    	ViewManager.getView("#assertionViewMessageContainer").displayAlert("Assertion is Missing Competency Reference");
	    	$("#assertionViewCompetency").html("<span style='font-style:italic'>Unknown</span>");
			$("#assertionViewCompetencyContainer").addClass("hide unknown");
			$("#assertionViewCompetencyContainer").css("display", "none");
			$("#assertionToggleUnknownBtn").removeClass("hide");
	    }
	    
	    var level = assertion.level
	    if(level != undefined){
	    	EcLevel.get(level, function(level){
	    		if(level != undefined){
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
	    			
	    			var span = $("<span class='has-tip' style='font-weight:normal'></span>");
	    			span.text(level.name);
	    			$("#assertionViewLevel").append(span);
	    			
	    			new Foundation.Tooltip($("#assertionViewLevel .has-tip"), {"tipText":tip});
	    		}else{
	    			$("#assertionViewLevel").html("<span style='font-style:italic'>Unknown</span>");
	    			$("#assertionViewLevelContainer").addClass("unknown");
	    			$("#assertionViewLevelContainer").css("display", "none");
	    			$("#assertionToggleUnknownBtn").removeClass("hide");
	    		}
	    	}, errorFindingLevel)
	    }else{
	    	$("#assertionViewLevel").html("Held (Demonstrated, but with no performance measures)");
	    }
	    
	    
	    var confidence = assertion.confidence;
	    if(confidence < 1){
	    	confidence = Math.round(confidence*100);
	    }
	    $("#assertionViewConfidence").text(confidence + "%")
	    
	    var decay = assertion.getDecayFunction();
	    if(decay != undefined){
	    	if(decay == "linear"){
	    		$("#assertionViewDecay").text("Linear");
	    	}else if(decay == "exponential"){
	    		$("#assertionViewDecay").text("Exponential");
	    	}else if(decay == "logarithmic"){
	    		$("#assertionViewDecay").text("Logarithmic");
	    	}
	    }else{
	    	$("#assertionViewDecay").html("<span style='font-style:italic'>Unknown</span>");
	    	$("#assertionViewDecayContainer").addClass("unknown");
	    	$("#assertionViewDecayContainer").css("display", "none");
	    	$("#assertionToggleUnknownBtn").removeClass("hide");
	    }
	    
	    var evidenceCount = assertion.getEvidenceCount();
	    if(evidenceCount == 0){
	    	$("#assertionViewEvidence").text("No pieces of evidence available")
	    }else{ 
	    	if(evidenceCount == 1){
	    		$("#assertionViewEvidence").text("1 piece of evidence available");
	    		$("#assertionViewEvidence").addClass("fake-a");
	    	}else{
	    		$("#assertionViewEvidence").text(evidenceCount + " pieces of evidence available");
	    		$("#assertionViewEvidence").addClass("fake-a");
	    	}
	    	
	    	$("#assertionViewEvidence").click(function(ev){
	    		ev.preventDefault();
	    		var ev = [];
	    		for(var i = 0; i < assertion.getEvidenceCount(); i++){
	    			ev.push(assertion.getEvidence(i));
	    		}
	    		
	    		ModalManager.showModal(new EvidenceViewModal(ev));
	    	})
	    }
	    
	    var date = assertion.getAssertionDate();
	    if(date != undefined){
	    	$("#assertionViewDate").text(new Date(date).toLocaleString());
	    }else{
	    	$("#assertionViewDate").html("<span style='font-style:italic'>Unknown</span>");
	    	$("#assertionViewDateContainer").addClass("unknown");
	    	$("#assertionViewDateContainer").css("display", "none");
	    	$("#assertionToggleUnknownBtn").removeClass("hide");
	    }
	    
	    var expiration = assertion.getExpirationDate();
	    if(expiration != undefined){
	    	$("#assertionViewExpiration").text(new Date(expiration).toLocaleString());
	    }else{
	    	$("#assertionViewExpiration").html("<span style='font-style:italic'>Unknown</span>");
	    	$("#assertionViewExpirationContainer").addClass("unknown");
	    	$("#assertionViewExpirationContainer").css("display", "none");
	    	$("#assertionToggleUnknownBtn").removeClass("hide");
	    }
	    
	    if(assertion.owner != undefined && assertion.owner.length > 0)
	    {
	    	$("#assertionViewOwner").text("")
	    	for(var i = 0; i < assertion.owner.length; i++)
 	    	{
	    		if(i > 0)
	    			$("#assertionViewOwner").append(", ");
	    		
 	    		var pem = assertion.owner[i];
 	    		
 	    		$("#assertionViewOwner").append("<span id='assertion-owner-"+i+"'></span>");
 	    		
 	    		ViewManager.showView(new IdentityDisplay(pem), "#assertion-owner-"+i);
 	    	}
	    }
	    
	}
	
	/**
	 * Error function called if problem getting the assertion from the server
	 * 
	 * @memberOf AssertionViewScreen
	 * @method errorRetrieving
	 * @private
	 * @param {String} err
	 * 			Error message to display
	 */
	function errorRetrieving(err)
	{
		if(err == undefined)
			err = "Unable to Connect to Server to Retrieve Assertion";
		
		ViewManager.getView("#assertionViewMessageContainer").displayAlert(err, "getAssertion");
	}
	
	/**
	 *  Error function called if problem searching for competencies to display on form
	 * 
	 * @memberOf AssertionViewScreen
	 * @method errorFindingCompetency
	 * @private
	 * @param {String} err
	 * 			Error message to display
	 */
	function errorFindingCompetency(err){
		if(err == undefined)
			err = "Unable to Connect to Server to Retrieve Assertion Competency";
		
		ViewManager.getView("#assertionViewMessageContainer").displayAlert(err, "getCompetency");
	}
	
	/**
	 *  Error function called if problem searching for levels to display on form
	 * 
	 * @memberOf AssertionViewScreen
	 * @method errorFindingLevel
	 * @private
	 * @param {String} err
	 * 			Error message to display
	 */
	function errorFindingLevel(err){
		if(err == undefined)
			err = "Unable to Connect to Server to Retrieve Level";
		
		ViewManager.getView("#assertionViewMessageContainer").displayAlert(err, "getLevel");
	}
	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf AssertionViewScreen
	 * @method display
	 * @param {String} containerId
	 * 			Screen Container DOM ID
	 */
	AssertionViewScreen.prototype.display = function(containerId)
	{
		var data = this.data;
		
		if(data.id != null)
		{
			ScreenManager.setScreenParameters({"id":data.id});
		}
			
		ViewManager.showView(new MessageContainer("assertionView"), "#assertionViewMessageContainer");
		
		$("#assertionViewSearchBtn").attr("href", "#"+AssertionSearchScreen.prototype.displayName);
		$("#assertionViewSearchBtn").click(function(event){
			event.preventDefault();
			ScreenManager.changeScreen(new AssertionSearchScreen(data))
		});
		
		$("#assertionViewBtn").attr("href", "#"+AssertionViewScreen.prototype.displayName);
		$("#assertionViewBtn").click(function(event){
			event.preventDefault();
		});
		
		$("#assertionToggleUnknownBtn").click(function(ev){
			ev.preventDefault();
			if($("#assertionToggleUnknownBtn #toggleKeyword").text() == "Show"){
				$("#assertionToggleUnknownBtn #toggleKeyword").text("Hide");
				$(".unknown").slideDown();
			}else{
				$("#assertionToggleUnknownBtn #toggleKeyword").text("Show");
				$(".unknown").slideUp()	
			}
			
			
		})
		
		
		if(AppController.identityController.canEdit(data)){
			$("#editAssertionBtn").click(function(event){
				event.preventDefault();
				ScreenManager.changeScreen(new AssertionEditScreen(data))
			})
		}else{
			$("#editAssertionBtn").remove();
		}
		
		if(!AppController.identityController.owns(data) && !AppController.serverController.getAdmin()){
			$("#assertionViewDeleteBtn").remove();
		}else{
			$("#assertionViewDeleteBtn").click(function(){
				ModalManager.showModal(new ConfirmModal(function(){
					EcRepository._delete(data, function(){
						ScreenManager.changeScreen(new AssertionSearchScreen());
					}, function(err){
						if(err == undefined)
							err = "Unable to connect to server to delete assertion";
						ViewManager.getView("#assertionViewMessageContainer").displayAlert(err)
					});
					ModalManager.hideModal();
				}, "Are you sure you want to delete this assertion?"))
			})
		}
		
		
		EcAssertion.get(data.id, function(result){
			data = result;
			displayAssertion(result);
		}, errorRetrieving);
			
	};
	
	return AssertionViewScreen;
})(AssertionViewScreen);