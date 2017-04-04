/**
 * Screen for Editing Assertions in the CASS Instance
 * 
 * @module cass.manager
 * @class AssertionEditScreen
 * 
 * @author devlin.junker@eduworks.com
 */	
AssertionEditScreen = (function(AssertionEditScreen){
	
	/**
	 * Helper function, converts the date passed in, to a string 
	 * that represents the date in local time
	 *
	 * @memberOf AssertionEditScreen
	 * @method dateToLocalString
	 * @private
	 * @param {Date} d 
	 * 			Date to convert to string
	 */
	function dateToLocalString(d){
		d = new Date(d.toUTCString());
		
		function zeroPadded(val) {
			if (val >= 10)
				return val;
			else
				return '0' + val;
		}
		
		return d.getFullYear()+"-"+zeroPadded(d.getMonth() + 1)+"-"+zeroPadded(d.getDate())+"T"+zeroPadded(d.getHours())+":"+zeroPadded(d.getMinutes())+":"+zeroPadded(d.getSeconds());
	}
	
	/**
	 * Displays the assertion passed in the editor on the screen
	 * 
	 * @memberOf AssertionEditScreen
	 * @param {EcAssertion} assertion 
	 * 			The assertion to be displayed
	 */
	function displayAssertion(assertion)
	{
		$('#competencyEditor').show();
	    $("#assertionEditId").val(assertion.id);
	   
	    if(assertion.agent != undefined){
	    	$("#assertionAgentInput option").removeAttr("selected");
		    var agentOption = $("#assertionAgentInput option[value='"+assertion.getAgent().toPem()+"']");
		    if(agentOption.size() != 1)
		    	$("#assertionAgentInput").append($("<option selected>Unknown</option>"));
		    else
		    	agentOption.attr("selected","selected");
	    }else if(AppController.identityController.selectedIdentity != undefined){
	    	$("#assertionAgentInput option[value='"+AppController.identityController.selectedIdentity.ppk.toPk().toPem()+"']").attr("selected", "selected");
	    	$("#assertionAgentInput").css("font-style","normal");
	    }
	    
	    if(assertion.subject != undefined){
	    	var subjectOption = $("#assertionSubjectInput option[value='"+assertion.getSubject().toPem()+"']");
	    	
	    	$("#assertionSubjectInput option").removeAttr("selected");
	    	if(subjectOption.size() == 1){
	    		subjectOption.attr("selected", "selected");
	    	}else{
	    		var option = $("<option selected='selected'>Unknown Subject</option>");
	    		option.attr("value", assertion.getSubject().toPem());
	    		$("#assertionSubjectInput").append(option);
	    	}
	    	$("#assertionSubjectInput").css("font-style","normal");
	    }
	    
	    if(assertion.competency != undefined){
	    	var competencyOption = $("#assertionCompetencyInput option[value='"+assertion.competency+"']");
	    	
	    	$("#assertionCompetencyInput option").removeAttr("selected");
	    	if(competencyOption.size() == 1){
	    		competencyOption.attr("selected", "selected");
	    	}else{
	    		EcCompetency.get(assertion.competency, function(competency){
	    			var competencyOption = $("#assertionCompetencyInput option[value='"+EcRemoteLinkedData.trimVersionFromUrl(competency.id)+"']");
	    			
	    			if(competencyOption.size() > 0){
	    				competencyOption.attr("selected", "selected");
	    			}else{
	    				var option = $("<option></option>");
						option.text(competency.name);
						option.attr("value", EcRemoteLinkedData.trimVersionFromUrl(competency.id));
						if(assertion.competency == EcRemoteLinkedData.trimVersionFromUrl(competency.id)){
							$("#assertionCompetencyInput option").removeAttr("selected");
							option.attr("selected");
						}
							
						$("#assertionCompetencyInput").append(option);
	    			}
	    		}, function(err){
	    			var option = $("<option selected='selected'>Unknown Competency</option>");
		    		option.attr("value", assertion.competency);
	    			$("#assertionCompetencyInput").append(option);
	    			
	    			ViewManager.getView("#assertionEditMessageContainer").displayAlert("Unable to find assertion's competency");
	    		});
	    	}
	    	$("#assertionCompetencyInput").css("font-style","normal");
	    	
	    	if(assertion.level != undefined && assertion.level != ""){
		    	var levelOption = $("#assertionLevelInput option[value='"+assertion.level+"']");
		    	
		    	$("#assertionLevelInput option").removeAttr("selected");
		    	if(levelOption.size() == 1){
		    		levelOption.attr("selected", "selected");
		    	}else{
		    		var option = $("<option selected='selected'>Unknown Level</option>");
		    		option.attr("value", assertion.level);
		    		$("#assertionLevelInput").append(option);
		    	}
		    }else{
		    	$("#assertionLevelInput").append("<option value='held' selected='selected'>Held (Demonstrated, but with no performance measures)</option>");
		    	$("#assertionLevelInput").attr("disabled", "disabled");
		    }
	    }
	    
	    
	    
	    if(assertion.confidence != undefined){
	    	$("#assertionConfidenceInput").val(assertion.confidence * 100);
	    	$("#assertionConfidenceDisplay").text(assertion.confidence * 100);
	    }
	    
	    if(assertion.evidence != undefined){
	    	if(assertion.getEvidenceCount() > 0){
	    		var evidences = [];
	    		for(var i = 0; i < assertion.getEvidenceCount(); i++){
	    			evidences.push(assertion.getEvidence(i));
	    		}
	    		
	    		evidences = evidences.join("/n");
	    		
	    		$("#assertionEvidenceInput").text(evidences);
	    	}
	    }
	    
	    
	    
	    if(assertion.getAssertionDate() != undefined){
	    	$("#assertionDateInput").val(dateToLocalString(new Date(assertion.getAssertionDate())));
	    }
	    
	    if(assertion.getExpirationDate() != undefined){
	    	$("#assertionExpirationInput").val(dateToLocalString(new Date(assertion.getExpirationDate())));
	    }
	    
	    if(assertion.decayFunction != undefined){
	    	$("#assertionDecayInput").val(assertion.getDecayFunction());
	    }
	    
	    if(assertion.owner != undefined && assertion.owner.length > 0)
	    {
	    	$("#assertionEditOwner").html("");
	    	for(var i = 0; i < assertion.owner.length; i++)
	    	{
	    		if(i > 0)
	    			$("#assertionEditOwner").append(", ");
	    		
	    		var pem = assertion.owner[i];

	    		$("#assertionEditOwner").append("<span id='assertion-owner-"+i+"'></span>");  
	    		
	    		ViewManager.showView(new IdentityDisplay(pem), "#assertion-owner-"+i)
	    		
	    	}
	    }else{
	    	$("#assertionEditOwner").text("N/A")
	    }
	    
	    if(assertion.reader != undefined && assertion.reader.length > 0)
	    {
	    	$("#assertionEditReaders").html("");
	    	$("#assertionEditNoReader").addClass("hide");
	    	for(var i = 0; i < assertion.reader.length; i++)
	    	{
	    		if(i > 0)
	    			$("#assertionEditReaders").append(", ");
	    		
	    		var pem = assertion.reader[i];
	    		
	    		$("#assertionEditReaders").append("<span id='assertion-reader-"+i+"'></span>")
	    		
	    		ViewManager.showView(new IdentityDisplay(pem), "#assertion-reader-"+i);
	    	}
	    }else{
	    	$("#assertionEditNoReader").removeClass("hide");
	    }
	}
	
	/**
	 * Builds the form before the assertion is displayed,
	 * this builds all  of the select options on the screen for
	 * identities and competencies/levels capable of selecting.
	 *  
	 * @memberOf AssertionEditScreen
	 * @method buildForm
	 * @private
	 * @param {EcAssertion} assertion
	 * 			The assertion that will be displayed later, used to pre-select options in the form
	 */
	function buildForm(assertion){
		
		for(var i in EcIdentityManager.ids){
			var option = $("<option></option>");
			
			option.text(EcIdentityManager.ids[i].displayName);
			option.attr("value", EcIdentityManager.ids[i].ppk.toPk().toPem());
			
			$("#assertionAgentInput").append(option);
		}
		
		$("#assertionAgentInput").change(function(ev){
			var pem = $("#assertionAgentInput").val();
    		
			$("#assertionEditOwner").html("<span id='assertion-owner-0'></span>");
			
			ViewManager.showView(new IdentityDisplay(pem), "#assertion-owner-0");
     
		})
	
		for(var i in EcIdentityManager.contacts){
			var option = $("<option></option>");
			
			option.text(EcIdentityManager.contacts[i].displayName);
			option.attr("value", EcIdentityManager.contacts[i].pk.toPem());
			
			$("#assertionSubjectInput").append(option);
		}
		if(EcIdentityManager.contacts.length == 0){
			var option = $("<option selected>Must be connected with other users to Assert Competency</option>");
			$("#assertionSubjectInput option").removeAttr("selected");
			$("#assertionSubjectInput").append(option.clone())
			$("#assertionSubjectInput").attr("disabled","disabled");
			$("#assertionCompetencyInput option").removeAttr("selected");
			$("#assertionCompetencyInput").append(option.clone())
			$("#assertionCompetencyInput").attr("disabled","disabled");
			$("#assertionLevelInput option").removeAttr("selected");
			$("#assertionLevelInput").append(option.clone())
			$("#assertionLevelInput").attr("disabled","disabled");
			$("#assertionConfidenceInput").attr("disabled","disabled");
			$("#assertionEvidenceInput").attr("disabled","disabled");
			$("#assertionDateInput").attr("disabled","disabled");
			$("#assertionExpirationInput").attr("disabled","disabled");
			$("#assertionDecayInput").attr("disabled","disabled");
			
			ViewManager.getView("#assertionEditMessageContainer").displayAlert("Cannot create an assertion unless you have a contact to assert about");
		}
		
		$("#assertionSubjectInput").change(function(){
			var pem = $("#assertionSubjectInput").val();
			//var contact = $(createContactSmall(pem));
    		//$("#assertionEditSubject").html(contact);
    		ViewManager.showView(new IdentityDisplay(pem), "#assertionEditSubject");
    		$("#assertionSubjectInput").css("font-style","normal");
		})
		
	
		
		var competencyList = {};
		EcCompetency.search(AppController.serverController.getRepoInterface(), "*", function(competencies){
			for(var i in competencies){
				competencyList[competencies[i].id] = competencies[i];
				
				var competencyOption = $("#assertionCompetencyInput option[value='"+EcRemoteLinkedData.trimVersionFromUrl(competencies[i].id)+"']")
				
				if(competencyOption.size() > 0){
					competencyOption.attr("selected", "selected");
				}else{
					var option = $("<option></option>");
					option.text(competencies[i].name);
					option.attr("value", EcRemoteLinkedData.trimVersionFromUrl(competencies[i].id));
					if(assertion.competency == EcRemoteLinkedData.trimVersionFromUrl(competencies[i].id)){
						$("#assertionCompetencyInput option").removeAttr("selected");
						option.attr("selected");
					}
						
					$("#assertionCompetencyInput").append(option);
				}
				
			}
		}, errorRetrievingCompetencies)
		
		if(assertion.competency != undefined && assertion.competency != ""){
			if(assertion.level == undefined || assertion.level == ""){
				$("#assertionLevelInput option").removeAttr("selected");
				$("#assertionLevelInput").append($("<option selected>No level selected</option>"));
			}
				
			EcLevel.searchByCompetency(AppController.serverController.getRepoInterface(), assertion.competency, function(levels){
				for(var i in levels){
					var option = $("<option></option>");
					option.text(levels[i].name);
					option.attr("value", EcRemoteLinkedData.trimVersionFromUrl(levels[i].id));
					if(assertion.level != undefined && assertion.level == EcRemoteLinkedData.trimVersionFromUrl(levels[i].id)){
						$("#assertionLevelInput option").removeAttr("selected");
						option.attr("selected", "selected")
					}
					
					$("#assertionLevelInput").append(option);
				}
			}, errorRetrievingLevels);
		}
		
		$("#assertionCompetencyInput").change(function(){
			var competencyId = $("#assertionCompetencyInput").val();
			$("#assertionCompetencyInput").css("font-style","normal");
			
			EcLevel.searchByCompetency(AppController.serverController.getRepoInterface(), competencyId, function(levels){
				$("#assertionLevelInput option").remove();
				for(var i in levels){
					var option = $("<option></option>");
					option.text(levels[i].name);
					option.attr("value", EcRemoteLinkedData.trimVersionFromUrl(levels[i].id));
					$("#assertionLevelInput").append(option);
				}
				if(levels.length == 0){
					$("#assertionLevelInput").append("<option selected value='held'>Held (Demonstrated, but with no performance measures)</option>");
					$("#assertionLevelInput").attr("disabled", "disabled");
					$("#assertionLevelInput").css("font-style","normal");
				}else{
					$("#assertionLevelInput").removeAttr("disabled");
					$("#assertionLevelInput").css("font-style","italic");
					$("#assertionLevelInput").append("<option selected class='hide' disabled='disabled'>Select the level of competency being asserted</option>");
				}
			}, errorRetrievingLevels);
		});
		
		$("#assertionLevelInput").change(function(){
			$("#assertionLevelInput").css("font-style","normal");
		})
	
		$("#assertionConfidenceInput").change(function(){
			var conf = $("#assertionConfidenceInput").val();
			$("#assertionConfidenceDisplay").text(conf);
		});
		
		$("#assertionDateInput").val(dateToLocalString(new Date()));
		var d = new Date();
		d.setFullYear(new Date().getFullYear() + 1);
		$("#assertionExpirationInput").val(dateToLocalString(d));
	}
	
	/**
	 * Triggered when the assertion is saved so the user knows it was successful
	 * 
	 * @memberOf AssertionEditScreen
	 * @method saveSuccess
	 * @private
	 */
	function saveSuccess(){
		$("#datum").effect("highlight", {}, 1500);
	}
	
	/**
	 * Error function if the server is down when trying to get the assertion to display in Message Container
	 * 
	 * @memberOf AssertionEditScreen
	 * @method errorRetrieving
	 * @private
	 * @param {String} err
	 * 			error message to display 
	 */
	function errorRetrieving(err)
	{
		if(err == undefined)
			err = "Unable to Connect to Server to Retrieve Assertion for Editing";
		ViewManager.getView("#assertionEditMessageContainer").displayAlert(err);
	}
	
	/**
	 * Error function if there is a problem saving the assertion to the server
	 * 
	 * @memberOf AssertionEditScreen
	 * @method errorSaving
	 * @private
	 * @param {String} err
	 * 			error message to display
	 */
	function errorSaving(err)
	{
		if(err == undefined)
			err = "Unable to Connect to Server to Save Assertion";
		
		ViewManager.getView("#assertionEditMessageContainer").displayAlert(err, "saveFail");
	}
	
	/**
	 * Error function if there is a problem retrieving the competency 
	 * list from the server during form creation
	 * 
	 * @memberOf AssertionEditScreen
	 * @method errorRetrievingCompetencies
	 * @private
	 * @param {String} err
	 * 			error message to display
	 */
	function errorRetrievingCompetencies(err)
	{
		if(err == undefined)
			err = "Unable to Connect to Server to Retrieve Competencies";
		ViewManager.getView("#assertionEditMessageContainer").displayAlert(err);
	}
	
	/**
	 *  Error function if there is a problem retrieving the level 
	 *  list from the server during form creation
	 * 
	 * @memberOf AssertionEditScreen
	 * @method errorRetrievingLevels
	 * @private
	 * @param {String} err
	 * 			error message to display
	 */
	function errorRetrievingLevels(err){
		if(err == undefined)
			err = "Unable to Connect to Server to Retrieve Levels";
		ViewManager.getView("#assertionEditMessageContainer").displayAlert(err);
	}
	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf AssertionEditScreen
	 * @method display
	 * @param {String} containerId
	 * 			Screen Container DOM ID
	 */
	AssertionEditScreen.prototype.display = function(containerId)
	{
		var data = this.data;
		
		if(data != undefined && data.id != undefined)
		{
			ScreenManager.setScreenParameters({"id":data.id});
		}
		
		var newAssertion = false;
		
		if(data == undefined){
			newAssertion = true;
			data = new EcAssertion();
		    data.generateId(AppController.serverController.getRepoInterface().selectedServer);
		    
		    if(AppController.identityController.selectedIdentity != undefined)
		    {
		    	data.addOwner(AppController.identityController.selectedIdentity.ppk.toPk());
		    }
		}
	
		ViewManager.showView(new MessageContainer("assertionEdit"), "#assertionEditMessageContainer", function(){
			if(newAssertion && !AppController.loginController.getLoggedIn())
			{
				ViewManager.getView("#assertionEditMessageContainer").displayAlert("Unable to Create an Assertion Unless you Identify yourself by logging in");
			}
		});
		
		$("#assertionEditSearchBtn").attr("href", "#"+AssertionSearchScreen.prototype.displayName);
		$("#assertionEditSearchBtn").click(function(event){
			event.preventDefault();
			ScreenManager.changeScreen(new AssertionSearchScreen())
		});
		
		if(newAssertion)
		{
			$("#assertionEditViewBtn").hide();
		}
		else
		{
			$("#assertionEditViewBtn").attr("href", "#"+AssertionViewScreen.prototype.displayName);
			$("#assertionEditViewBtn").click(function(event){
				event.preventDefault();
				ScreenManager.changeScreen(new AssertionViewScreen(data))
			});
		}
		
		
		$("#assertionEditBtn").attr("href", "#"+AssertionEditScreen.prototype.displayName);
		$("#assertionEditBtn").click(function(event){
			event.preventDefault();
		});
		
		$("#assertionEditCancelBtn").click(function(event){
			event.preventDefault();
			ScreenManager.changeScreen(new AssertionViewScreen());
		});
		
		if(newAssertion){
			$("#assertionEditDeleteBtn").remove();	
		}else{
			$("#assertionEditDeleteBtn").click(function(event){
				event.preventDefault();
				ModalManager.showModal(new ConfirmModal(function(){
					EcRepository._delete(data, function(){
						ScreenManager.changeScreen(new AssertionSearchScreen());
					}, function(err){
						if(err == undefined)
							err = "Unable to connect to server to delete assertion";
						ViewManager.getView("#assertionEditMessageContainer").displayAlert(err)
					});
					ModalManager.hideModal();
				}, "Are you sure you want to delete this assertion?"));
			})
		}
		
		if(newAssertion && (!AppController.loginController.getLoggedIn() || !AppController.identityController.canEdit(data))){
			$("#assertionEditSaveBtn").removeClass("fake-a-label");
			$("#assertionEditSaveBtn").css('cursor', "default");
			
			$("#assertionAgentInput").attr("disabled", "disabled");
			$("#assertionSubjectInput").attr("disabled", "disabled");
			$("#assertionCompetencyInput").attr("disabled", "disabled");
			$("#assertionLevelInput").attr("disabled", "disabled");
			$("#assertionConfidenceInput").attr("disabled", "disabled");
			$("#assertionEvidenceInput").attr("disabled", "disabled");
			$("#assertionDateInput").attr("disabled", "disabled");
			$("#assertionExpirationInput").attr("disabled", "disabled");
			$("#assertionDecayInput").attr("disabled", "disabled");
		}else{
			$("#assertionEditSaveBtn").click(function(event){
				event.preventDefault();
				
				if($("#assertionSubjectInput").val() == undefined || $("#assertionSubjectInput").val() == "" || $("#assertionSubjectInput").val() == $("#assertionSubjectInput #noSubject").text()){
					ViewManager.getView("#assertionEditMessageContainer").displayAlert("Unable to Create an Assertion Without Subject");
					return;
				}
				data.setSubject(EcPk.fromPem($("#assertionSubjectInput").val()))
				
				if($("#assertionAgentInput").val() == undefined || $("#assertionAgentInput").val() == "" || $("#assertionAgentInput").val() == $("#assertionAgentInput #noAgent").text()){
					ViewManager.getView("#assertionEditMessageContainer").displayAlert("Unable to Create an Assertion Without Specifying Agent");
					return;
				}
				data.setAgent(EcPk.fromPem($("#assertionAgentInput").val()))
				
				if($("#assertionCompetencyInput").val() == undefined || $("#assertionCompetencyInput").val() == "" || $("#assertionCompetencyInput").val() == $("#assertionCompetencyInput #noCompetency").text()){
					ViewManager.getView("#assertionEditMessageContainer").displayAlert("Unable to Create an Assertion Without Specifying Competency");
					return;
				}
				data.setCompetency($("#assertionCompetencyInput").val());
				
				if($("#assertionLevelInput").val() == undefined || $("#assertionLevelInput").val() == "" 
					|| $("#assertionLevelInput").val() == $("#assertionLevelInput #noLevel").text() || $("#assertionLevelInput").val() == "held"){
					data.setLevel("");
				}else{
					data.setLevel($("#assertionLevelInput").val());
				}
				
				var confidence = $("#assertionConfidenceInput").val();
				
				if(confidence > 1){
					confidence = confidence/100;
				}
				data.setConfidence(confidence);
				
				var evidences = $("#assertionEvidenceInput").val().split(/\n/);
				if(evidences != undefined && evidences.length == 1 && evidences[0] == undefined || evidences[0] == ""){
					data.evidence = undefined;
				}else{
					data.setEvidence(evidences);	
				}
				
				
				var dateSplit = new Date($("#assertionDateInput").val()).toUTCString().split(" ");
				dateSplit.splice(5,1);
				
				var expireSplit = new Date($("#assertionExpirationInput").val()).toUTCString().split(" ");
				expireSplit.splice(5,1);
				
				data.setAssertionDate(new Date(dateSplit.join(" ")).getTime());
				data.setExpirationDate(new Date(expireSplit.join(" ")).getTime());
				data.setDecayFunction($("#assertionDecayInput").val());

				data.save(saveSuccess, errorSaving);
			})
			
			$("#assertionEditSaveBtn").on("mousemove", function(){
				var url = $("#assertionEditId").val();
				var split = url.split("\/");
				if (split[split.length-4] == "data") 
					split[split.length-1] = new Date().getTime();
				$("#assertionEditId").val(split.join("/"));
			});
			
			buildForm(data);
		}
		
		$("#assertionEditAddReader").click(function(ev){
			ev.preventDefault();
			
			ModalManager.showModal(new AdvancedPermissionsModal(data, function(dataAfter){
				displayAssertion(dataAfter);
				ModalManager.hideModal();
			}, true));
		})
		
		if(newAssertion)
		{
			displayAssertion(data);
		}
		else
		{
			EcAssertion.get(data.id, function(assertion){
				data = assertion;
				displayAssertion(assertion)
			}, errorRetrieving);
		}
	};
	
	return AssertionEditScreen;
})(AssertionEditScreen);