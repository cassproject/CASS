/**
 * Modal for viewing evidence details
 * 
 * @module cass.manager
 * @class ImportCompetenciesModal
 * 
 * @author devlin.junker@eduworks.com
 */
var ImportCompetenciesModal = (function(ImportCompetenciesModal){	
	
	var cached_frameworks = {};

	/**
	 * Adds a framework to the select input of frameworks to add 
	 * imported competencies to
	 * 
	 * @memberOf ImportCompetenciesModal
	 * @method addLocationFramework
	 * @private
	 * @param {EcFramework} framework
	 * 			Framework details to add to the select input
	 */
	function addLocationFramework(framework){
		var id = framework.shortId().split("/");
		var id = id[id.length-1];
		
		$("#noLocation").text("No Specific Framework");
		
		var op = $("<option></option>");
		op.attr("value", id);
		
		if(framework.owner == undefined || framework.owner.length == 0){
			op.text(framework.name+" (Public)");
			$("#importLocationSelect").append(op);
		}else{
			op.text(framework.name);
			
			op.insertAfter("#noLocation")
		}
		
	}
	
	/**
	 * Adds list of frameworks to select input of frameworks to add
	 * imported competencies too
	 * 
	 * @memberOf ImportCompetenciesModal
	 * @method addFrameworks
	 * @private
	 * @param {EcFramework[]} frameworks
	 * 			List of frameworks to add
	 */
	function addFrameworks(frameworks){
		for(var i = 0; i < frameworks.length; i++){
			var framework = frameworks[i];
			var id = framework.shortId().split("/");
			var id = id[id.length-1];
			
			addLocationFramework(framework)
			
			cached_frameworks[id] = framework;
		}
		if(frameworks.length == 0){
			$("#noLocation").text("No Specific Framework");
		}
	}
	
	/**
	 * Adds framework to source select input for transferring
	 * competencies from (to another framework)
	 * 
	 * @memberOf ImportCompetenciesModal
	 * @method addSourceFramework
	 * @private
	 * @param {EcFramework} framework
	 * 			Framework to add to source select
	 */
	function addSourceFramework(framework){
		var id = framework.shortId().split("/");
		var id = id[id.length-1];
		
		var op = $("<option></option>");
		op.attr("value", id);
		if(framework.owner == undefined || framework.owner.length == 0){
			op.text(framework.name+" (Public)");
			$("#importSourceSelect").append(op);
		}else{
			op.text(framework.name);
			
			op.insertAfter("#noSource")
		}
	}
	
	/**
	 * Adds a list of frameworks to the source input for 
	 * transferring competencies from (to another framework)
	 * 
	 * 
	 * @memberOf ImportCompetenciesModal
	 * @method addSourceFrameworks
	 * @private
	 */
	function addSourceFrameworks(frameworks){
		for(var i = 0; i < frameworks.length; i++){
			var framework = frameworks[i];
			var id = framework.shortId().split("/");
			var id = id[id.length-1];
			
			if(id != $("#importLocationSelect").val())
				addSourceFramework(framework);
			
			cached_frameworks[id] = framework;
		}
	}
	
	/**
	 * Displays error if problem finding a list of frameworks to display
	 * 
	 * @memberOf ImportCompetenciesModal
	 * @method errorFindingFrameworks
	 * @private
	 * @param {String} err
	 * 			Error to display 
	 */
	function errorFindingFrameworks(err){
		if(err == undefined)
			err = "Unable to Connect to Server to Find Frameworks";
				
		ViewManager.getView("#importCompetenciesMessageContainer").displayAlert(err, "getFramework");
	}
	
	/**
	 * Displays error if problem parsing CSV
	 * 
	 * @memberOf ImportCompetenciesModal
	 * @method errorParsing
	 * @private
	 * @param {String} err
	 * 			Error to display 
	 */
	function errorParsing(err){
		if(err == undefined)
			err = "CSV could not be parsed";
			
		ViewManager.getView("#importCompetenciesMessageContainer").displayAlert(err, "parseCSV");
	}
	
	/**
	 * Displays error if problem saving competency during import
	 * 
	 * @memberOf ImportCompetenciesModal
	 * @method errorSavingCompetency
	 * @private
	 * @param {String} err
	 * 			Error to display 
	 */
	function errorSavingCompetency(err){
		if(err == undefined)
			err = "Could not connect to server to save competency";
			
		ViewManager.getView("#importCompetenciesMessageContainer").displayAlert(err, "saveCompetency");
	}
	
	/**
	 * Displays error if problem saving framework during import (ASN)
	 * 
	 * @memberOf ImportCompetenciesModal
	 * @method errorSavingFramework
	 * @private
	 * @param {String} err
	 * 			Error to display 
	 */
	function errorSavingFramework(err){
		if(err == undefined)
			err = "Could not connect to server to save framework";
			
		ViewManager.getView("#importCompetenciesMessageContainer").displayAlert(err, "saveFramework");
	}
	
	/**
	 * Displays error if problem finding competencies in source framework
	 * during framework import
	 * 
	 * @memberOf ImportCompetenciesModal
	 * @method errorFindingCompetency
	 * @private
	 * @param {String} err
	 * 			Error to display 
	 */
	function errorFindingCompetency(err){
		if(err == undefined)
			err = "Could not connect to server to find source framework competencies";
			
		ViewManager.getView("#importCompetenciesMessageContainer").displayAlert(err, "findCompetencies");
	}

	/**
	 * Handles getting CSV file from Competency CSV Input and 
	 * displays columns and # found once finished analyzing CSV
	 * 
	 * @memberOf ImportCompetenciesModal
	 * @method analyzeCsv
	 * @private
	 * @param {EcFramework} framework
	 * 			Framework to import CSV competencies too
	 */
	function analyzeCsv(framework) {
	    var file = $("#importCsvFile")[0].files[0];
	    
	    CSVImport.analyzeFile(file, function(data){
	    	if (data.length === undefined || data.length == 0) {
            	ViewManager.getView("#importCompetenciesMessageContainer").displayAlert("CSV could not be parsed", "parseCSV");
            	$("#submitImportCsv").attr("disabled", "disabled")
            	$("#submitImportCsv").off("click");
            	$(".importCsvRelation").addClass("hide");
                return;
            }
            $("#submitImportCsv").removeAttr("disabled");
            ViewManager.getView("#importCompetenciesMessageContainer").clearAlert("parseCSV");
            
            $("#importCsvColumnName").html("<option index='-1'>N/A</option>");
            $("#importCsvColumnDescription").html("<option index='-1'>N/A</option>");
            $("#importCsvColumnScope").html("<option index='-1'>N/A</option>");
            $("#importCsvColumnId").html("<option index='-1'>N/A</option>");
            for (var i = 0; i < data[0].length; i++) {
                $("#importCsvColumnName").append("<option/>").children().last().text(data[0][i]).attr("index", i);
                $("#importCsvColumnDescription").append("<option/>").children().last().text(data[0][i]).attr("index", i);
                $("#importCsvColumnScope").append("<option/>").children().last().text(data[0][i]).attr("index", i);
                $("#importCsvColumnId").append("<option/>").children().last().text(data[0][i]).attr("index", i);
                
                if(data[0][i].toLowerCase().includes("name")){
                	$("#importCsvColumnName [index="+i+"]").attr("selected", "selected");
                	ViewManager.getView("#importCompetenciesMessageContainer").displayPrimary("CSV column names atuomatically determined based off of name", "csvGuess");
                }else if(data[0][i].toLowerCase().includes("description")){
                	$("#importCsvColumnDescription [index="+i+"]").attr("selected", "selected");
                	ViewManager.getView("#importCompetenciesMessageContainer").displayPrimary("CSV column names atuomatically determined based off of name", "csvGuess");
                }else if(data[0][i].toLowerCase().includes("scope")){
                	 $("#importCsvColumnScope [index="+i+"]").attr("selected", "selected");
                	 ViewManager.getView("#importCompetenciesMessageContainer").displayPrimary("CSV column names atuomatically determined based off of name", "csvGuess");
                }else if(data[0][i].toLowerCase().includes("id")){
                	$("#importCsvColumnId [index="+i+"]").attr("selected", "selected");
                	ViewManager.getView("#importCompetenciesMessageContainer").displayPrimary("CSV column names atuomatically determined based off of name", "csvGuess");
                	$(".importCsvRelation").removeClass("hide");
                }
            }
            
            $("#importCsvColumnId").change(function(){
            	if($("#importCsvColumnId").val() != undefined && $("#importCsvColumnId").val() != -1){
            		$(".importCsvRelation").removeClass("hide");
            	}
            })
            
            
            $("#submitImportCsv").on("click", function(ev){
				ev.preventDefault();
				$("#submitImportCsv").attr("disabled", "disabled");
				$("#submitImportCsv").find(".fa-spin").removeClass("hide");
				setTimeout(function(){
					importCsv(framework);
				}, 100);
			})
	    }, errorParsing);
	}

	/**
	 * Handles getting CSV file from Relation CSV input and 
	 * displays columns and # found once finished analyzing CSV
	 * 
	 * @memberOf ImportCompetenciesModal
	 * @method analyzeRelationCsv
	 * @private
	 */
	function analyzeRelationCsv() {
	    var file = $("#importCsvRelation")[0].files[0];
	    
	    CSVImport.analyzeFile(file, function(data){
	    	if (data.length === undefined || data.length == 0) {
            	ViewManager.getView("#importCompetenciesMessageContainer").displayAlert("CSV could not be parsed", "parseCSV");
            	$("#submitImportCsv").attr("disabled", "disabled")
            	$("#submitImportCsv").off("click");
                return;
            }
            $("#submitImportCsv").removeAttr("disabled");
            ViewManager.getView("#importCompetenciesMessageContainer").clearAlert("parseCSV");
            
            $("#importCsvColumnSource").html("<option index='-1'>N/A</option>");
            $("#importCsvColumnRelationType").html("<option index='-1'>N/A</option>");
            $("#importCsvColumnTarget").html("<option index='-1'>N/A</option>");
            for (var i = 0; i < data[0].length; i++) {
                $("#importCsvColumnSource").append("<option/>").children().last().text(data[0][i]).attr("index", i);
                $("#importCsvColumnRelationType").append("<option/>").children().last().text(data[0][i]).attr("index", i);
                $("#importCsvColumnTarget").append("<option/>").children().last().text(data[0][i]).attr("index", i);
                
                if(data[0][i].toLowerCase().includes("source")){
                	$("#importCsvColumnSource [index="+i+"]").attr("selected", "selected");
                	ViewManager.getView("#importCompetenciesMessageContainer").displayPrimary("CSV column names atuomatically determined based off of name", "csvGuess");
                }else if(data[0][i].toLowerCase().includes("relationType")){
                	$("#importCsvColumnRelationType [index="+i+"]").attr("selected", "selected");
                	ViewManager.getView("#importCompetenciesMessageContainer").displayPrimary("CSV column names atuomatically determined based off of name", "csvGuess");
                }else if(data[0][i].toLowerCase().includes("target")){
                	$("#importCsvColumnTarget [index="+i+"]").attr("selected", "selected");
                	ViewManager.getView("#importCompetenciesMessageContainer").displayPrimary("CSV column names atuomatically determined based off of name", "csvGuess");
                }
            }
            
	    }, errorParsing)
	}
	
	/**
	 * Handles getting file and column input from DOM and pass
	 * to import to import competencies from CSV
	 * 
	 * @memberOf ImportCompetenciesModal
	 * @method importCsv
	 * @private
	 * @param {EcFramework} framework
	 * 			Framework that is being edited
	 */
	function importCsv(framework) {  
		var editingFramework = true;
		if(framework == undefined){
			editingFramework = false;
			framework = cached_frameworks[$("#importLocationSelect").val()]
		}

	    var file = $("#importCsvFile")[0].files[0];
	    var relation = $("#importCsvRelation")[0].files[0];
	    
	    var nameIndex = parseInt($("#importCsvColumnName option:selected").attr("index"));
        var descriptionIndex = parseInt($("#importCsvColumnDescription option:selected").attr("index"));
        var scopeIndex = parseInt($("#importCsvColumnScope option:selected").attr("index"));
        var idIndex = parseInt($("#importCsvColumnId option:selected").attr("index"));
        var sourceIndex = parseInt($("#importCsvColumnSource option:selected").attr("index"));
        var relationTypeIndex = parseInt($("#importCsvColumnRelationType option:selected").attr("index"));
        var targetIndex = parseInt($("#importCsvColumnTarget option:selected").attr("index"));
        
        if(nameIndex == -1 ){
        	ViewManager.getView("#importCompetenciesMessageContainer").displayAlert("Must select a column that contains competency names", "selectName");
        	$("#submitImportCsv").addClass("alert");
			$("#submitImportCsv").attr("disabled", "disabled");
			
			$("#importCsvColumnName").change(function(){
				$("#submitImportCsv").removeClass("alert");
				$("#submitImportCsv").removeAttr("disabled", "disabled");
			});
        	
        	return;
        }
        ViewManager.getView("#importCompetenciesMessageContainer").clearAlert("selectName");
	    
        CSVImport.importCompetencies(file, AppController.serverController.selectedServerUrl, AppController.identityController.selectedIdentity,
        		nameIndex, descriptionIndex, scopeIndex, idIndex,relation,sourceIndex,relationTypeIndex,targetIndex,function(savedCompetencies,savedRelations){
        	var query = "";
            for(var i = 0; i < savedCompetencies.length; i++)
            {
            	var comp = savedCompetencies[i];
            	
            	if(framework != undefined){
            		framework.addCompetency(comp.id)
            	}else{
            		var id = comp.shortId().split("/");
            		id = id[id.length - 1];
            		
            		if(i > 0)
            			query += " OR ";
            		query += id;
            	}
            }

            for(var i = 0; i < savedRelations.length; i++)
            {
            	var comp = savedRelations[i];
            	
            	if(framework != undefined){
            		framework.addRelation(comp.id)
            	}else{
            		var id = comp.shortId().split("/");
            		id = id[id.length - 1];
            		
            		if(i > 0)
            			query += " OR ";
            		query += id;
            	}
            }
            
            if(framework != undefined){
    			if(!editingFramework){
	                framework.save(function () { 
	                	ScreenManager.changeScreen(new FrameworkViewScreen(framework))
	                	ModalManager.hideModal();
	                }, errorSavingFramework);
    			}else{
    				for(var i = 0; i < savedCompetencies.length; i++){
    					ScreenManager.getCurrentScreen().addCompetency(savedCompetencies[i]);
    				}
    				for(var i = 0; i < savedRelations.length; i++){
    					ScreenManager.getCurrentScreen().addRelation(savedRelations[i]);
    				}
    				
    				ModalManager.showModal(new ConfirmModal(function(){
        				var f = new EcFramework();
        				f.copyFrom(framework);
        				f.save(function(){
        					ScreenManager.getCurrentScreen().showSave();
        					ModalManager.hideModal();
        				}, function(err){
        					ScreenManager.getCurrentScreen().errorSaving(err);
        					ModalManager.hideModal();
        				});
        			}, "Would you like to save the framework now?", "Competencies Added!"));
    			}
    			
    			
    		}else{
            	ScreenManager.changeScreen(new CompetencySearchScreen(null, query))
            	
            	ModalManager.hideModal();
            }
    		
    		
        }, function(error){
        	ViewManager.getView("#csvImportProgressMessageContainer").clearSuccess();
        	ViewManager.getView("#csvImportProgressMessageContainer").displayAlert(error);
        }, function(progressObj){
        	if(progressObj != undefined && progressObj["competencies"] != undefined){
        		if(progressObj["relations"] == undefined){
        			ViewManager.getView("#csvImportProgressMessageContainer").displaySuccess("Sucessfully imported "+progressObj["competencies"]+" competencies", "competenciesImported")
        		}else{
        			ViewManager.getView("#csvImportProgressMessageContainer").displaySuccess("Sucessfully imported "+progressObj["relations"]+" relations", "relationsImported")
        		}
        	}
        	
        });
        
	}
	
	/**
	 * Handles getting framework to copy/link competencies
	 * from and target framework from DOM
	 * 
	 * @memberOf ImportCompetenciesModal
	 * @method importFromFramework
	 * @private
	 * @param {EcFramework} framework
	 * 			Framework that is being edited 
	 */
	function importFromFramework(framework){
		var editingFramework = true;
		if(framework == undefined){
			editingFramework = false;
			framework = cached_frameworks[$("#importLocationSelect").val()];
		}
			
		if(framework == undefined){
			ViewManager.getView("#importCompetenciesMessageContainer").displayAlert("Problem finding framework to import to", "missingLocationFramework");
			return;
		}
		ViewManager.getView("#importCompetenciesMessageContainer").clearAlert("missingLocationFramework");
		
		var source = cached_frameworks[$("#importSourceSelect").val()];
		
		if(source == undefined){
			ViewManager.getView("#importCompetenciesMessageContainer").displayAlert("Problem finding framework to import from", "missingSourceFramework");
			return;
		}
		ViewManager.getView("#importCompetenciesMessageContainer").clearAlert("missingSourceFramework");
		
		if(source.competency == undefined || source.competency.length == 0){
			ViewManager.getView("#importCompetenciesMessageContainer").displayAlert(source.name+" contains no competencies", "missingSourceFrameworkCompetencies");
			$("#submitImportFramework").addClass("alert");
			$("#submitImportFramework").attr("disabled", "disabled");
			
			$("#importLocationSelect").change(function(){
				$("#submitImportFramework").removeClass("alert");
				$("#submitImportFramework").removeAttr("disabled", "disabled");
			});
			
			return;
		}
		ViewManager.getView("#importCompetenciesMessageContainer").clearAlert("missingSourceFrameworkCompetencies");
		
		var copy = $("#copySwitch").is(":checked");
		
		FrameworkImport.importCompetencies(source, framework, copy, AppController.serverController.selectedServerUrl, AppController.identityController.selectedIdentity,
			function(savedCompetencies, savedRelations)
		{
			if(editingFramework){
				for(var i = 0; i < savedCompetencies.length; i++)
				{
					ScreenManager.getCurrentScreen().addCompetency(savedCompetencies[i]);
				}
				for(var i = 0; i < savedRelations.length; i++)
				{
					ScreenManager.getCurrentScreen().addRelation(savedRelations[i]);
				}
			}else{
				ScreenManager.changeScreen(new FrameworkViewScreen(framework));
			}
			
			ModalManager.hideModal();
		}, 
		function(error)
		{
			ViewManager.getView("#importCompetenciesMessageContainer").displayAlert(error);
		});

	}

	/**
	 * Analyzes a medbiquitious XML file for competencies to import
	 * 
	 * @memberOf ImportCompetenciesModal
	 * @method analyzeMedbiq
	 * @private
	 * @param {EcFramework} framework
	 * 			Framework that is being edited 
	 */
	function analyzeMedbiq(framework){
		var importAllowed = function(){
			$("#submitImportMedbiq").attr("disabled", "disabled");
			$("#submitImportMedbiq").find(".fa-spin").removeClass("hide");
			setTimeout(function(){
				startImportMedbiqXml(framework);
			}, 100);
		}
		
		var file = $("#importMedbiqFile")[0].files[0];
		$("#medbiqImportProgress").text("");
		
		$("#medbiqAnalyzeProgress").removeClass("hide");
		
	    MedbiqImport.analyzeFile(file, function(found){
	    	$("#medbiqAnalyzeProgress").addClass("hide");
	    	
	    	if(found.length == 0)
	    	{
	    		ViewManager.getView("#importCompetenciesMessageContainer").displayAlert("No Competencies Found to Import", "noCompetencies");
	    		$("#submitImportMedbiq").addAttr("disabled");
	    		$("#submitImportMedbiq").off("click", importAllowed)
	    		return;
	    	}	
	    	ViewManager.getView("#importCompetenciesMessageContainer").clearAlert("noCompetencies");
	    		
	    	$("#medbiqImportProgress").text(Object.keys(found).length + " competencies detected. Press import to finish.");
            $("#submitImportMedbiq").removeAttr("disabled");
            
            $("#submitImportMedbiq").on("click", importAllowed)
	    }, function(error){
	    	ViewManager.getView("#importCompetenciesMessageContainer").displayAlert(error);
	    });
	}
	
	/**
	 * Calls medbiq importer to import frameworks
	 * 
	 * @memberOf ImportCompetenciesModal
	 * @method startImportMedbiqXml
	 * @private
	 * @param {EcFramework} framework
	 * 			Framework that is being edited 
	 */
	function startImportMedbiqXml(framework) {
	    var editingFramework = true;
		if(framework == undefined){
			editingFramework = false;
	    	framework = cached_frameworks[$("#importLocationSelect").val()];
	    }
	    
	    MedbiqImport.importCompetencies(AppController.serverController.selectedServerUrl, AppController.identityController.selectedIdentity,
	    		function(savedCompetencies)
	    {
	    	var query = "";
	    	for(var i = 0; i < savedCompetencies.length; i++){
	    		if(framework != null){
	    			framework.addCompetency(savedCompetencies[i].id);
	    		}else{
	    			var id = savedCompetencies[i].shortId().split("/");
            		id = id[id.length - 1];
            		
            		if(i > 0)
            			query += " OR ";
            		query += id;
	    		}
	    	}

	    	if(framework != null){
	    		if(!editingFramework){
	                framework.save(function () { 
	                	ScreenManager.changeScreen(new FrameworkViewScreen(framework))
	                }, errorSavingFramework);
    			}else{
    				for(var i = 0; i < savedCompetencies.length; i++){
    					ScreenManager.getCurrentScreen().addCompetency(savedCompetencies[i]);
    				}
    			}
	    	}else{
	    		ScreenManager.changeScreen(new CompetencySearchScreen(null, query))
	    	}
	    	
	    	ModalManager.hideModal();
	    },
	    function(error){
	    	ViewManager.getView("#importCompetenciesMessageContainer").displayAlert(error);
	    	ViewManager.getView("#importCompetenciesMessageContainer").clearSuccess();
	    }, 
	    function(progressObj){
        	if(progressObj != undefined && progressObj["competencies"] != undefined){
        		ViewManager.getView("#importCompetenciesMessageContainer").displaySuccess("Sucessfully imported "+progressObj["competencies"]+" competencies", "competenciesImported")
        	}
        	
        });
	}
	
	/**
	 * Analyzes an ASN file for competencies and sets up modal
	 * to import them
	 * 
	 * @memberOf ImportCompetenciesModal
	 * @method analyzeASN
	 * @private
	 * @param {EcFramework} framework
	 * 			Framework that is being edited  
	 */
	function analyzeASN(framework){
		var importAllowed = function(){
			$("#submitImportASN").attr("disabled", "disabled");
			$("#submitImportASN").find(".fa-spin").removeClass("hide");
			setTimeout(function(){
				startImportASN(framework);
			}, 100)
		}
		
		var file = $("#importASNFile")[0].files[0];
		$("#asnImportProgress").text("");
		
		$("#asnAnalyzeProgress").removeClass("hide");
		
		ASNImport.analyzeFile(file, function(found){
			$("#asnAnalyzeProgress").addClass("hide");
			if(found.length == 0)
	    	{
	    		ViewManager.getView("#importCompetenciesMessageContainer").displayAlert("No Competencies Found to Import", "noCompetencies");
	    		$("#submitImportASN").addAttr("disabled");
	    		$("#submitImportASN").off("click", importAllowed)
	    		return;
	    	}	
	    	ViewManager.getView("#importCompetenciesMessageContainer").clearAlert("noCompetencies");
	    		
	    	$("#asnImportProgress").text(Object.keys(found).length + " competencies detected. Press import to finish.");
            $("#submitImportASN").removeAttr("disabled");
            
            $("#submitImportASN").on("click", importAllowed)
          
	    }, function(error){
	    	ViewManager.getView("#importCompetenciesMessageContainer").displayAlert(error);
	    });
	}
	
	/**
	 * Calls the ASN Import with an ASN file to import
	 * competencies from.
	 * 
	 * @memberOf ImportCompetenciesModal
	 * @method startImportASN
	 * @private
	 * @param {EcFramework} framework
	 * 			Framework that is being edited  
	 */
	function startImportASN(framework){
		var editingFramework = true;
		if(framework == undefined){
			editingFramework = false;
		   	framework = cached_frameworks[$("#importLocationSelect").val()];
		}
		
		var createFramework = $("#createFrameworkSwitch").is(":checked");
		
		ASNImport.importCompetencies(AppController.serverController.selectedServerUrl, 
				AppController.identityController.selectedIdentity,
				createFramework,
	    		function(savedCompetencies, createdFramework)
	    {	
	    	var query = "";
	    	for(var i = 0; i < savedCompetencies.length; i++){
	    		if(framework != null){
	    			framework.addCompetency(savedCompetencies[i].id);
	    		}else{
	    			var id = savedCompetencies[i].shortId().split("/");
            		id = id[id.length - 1];
            		
            		if(i > 0)
            			query += " OR ";
            		query += id;
	    		}
	    	}

	    	if(framework != null){
	    		if(!editingFramework){
	                framework.save(function () { 
	                	ScreenManager.changeScreen(new FrameworkViewScreen(framework))
	                }, errorSavingFramework);
    			}else{
    				for(var i = 0; i < savedCompetencies.length; i++){
    					ScreenManager.getCurrentScreen().addCompetency(savedCompetencies[i]);
    				}
    			}
	    	}else if(createdFramework != null){
	    		ScreenManager.changeScreen(new FrameworkViewScreen(createdFramework));
	    	}else{
	    		ScreenManager.changeScreen(new CompetencySearchScreen(null, query))
	    	}
	    	
	    	ModalManager.hideModal();
	    },
	    function(error){
	    	ViewManager.getView("#importCompetenciesMessageContainer").displayAlert(error);
	    	ViewManager.getView("#importCompetenciesMessageContainer").clearSuccess();
	    },
	    function(progressObj){
	    	if(progressObj != undefined && progressObj["competencies"] != undefined){
        		if(progressObj["relations"] == undefined){
        			ViewManager.getView("#importCompetenciesMessageContainer").displaySuccess("Sucessfully imported "+progressObj["competencies"]+" competencies", "competenciesImported")
        		}else{
        			ViewManager.getView("#importCompetenciesMessageContainer").displaySuccess("Sucessfully imported "+progressObj["relations"]+" relations", "relationsImported")
        		}
        	}
        });
	}
	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf ImportCompetenciesModal
	 * @method display
	 * @param {String} containerId
	 * 			The DOM ID of the Modal Container this modal is displayed in
	 */
	ImportCompetenciesModal.prototype.display = function(containerId)
	{
		var data = this.data;
	
		ViewManager.showView(new MessageContainer("csvImportProgress"), "#csvImportProgressMessageContainer");
		ViewManager.showView(new MessageContainer("importCompetencies"), "#importCompetenciesMessageContainer", function(){
			if(AppController.identityController.selectedIdentity == undefined)
			{
				ViewManager.getView("#importCompetenciesMessageContainer").displayWarning("Competencies that are imported will be Public and can be modified by anyone", "noOwner");
			}
			
			if(data == undefined)
			{
				ViewManager.getView("#importCompetenciesMessageContainer").displayWarning("No Framework Specified, Competencies will not be attached to any frameworks when imported", "noFrameworkSelected");
			}
		});
		
		if(data == undefined){
			EcFramework.search(AppController.serverController.getRepoInterface(), "*", addFrameworks, errorFindingFrameworks, {ownership:"public"});
			EcFramework.search(AppController.serverController.getRepoInterface(), "*", addFrameworks, errorFindingFrameworks, {ownership:"me"});
		}else{
			$("#selectFramework").removeClass("hide");
			
			// TODO:
			
			addLocationFramework(data);
			$("#noLocation").removeAttr('selected');
			
			var id = data.shortId().split("/");
			var id = id[id.length-1];
			$("#importLocationSelect option[value="+id+"]").attr("selected", "selected");
			
			$("#importLocationSelect").attr("disabled","disabled")
		}
		
		$("#importLocationSelect").change(function(ev){
			if($("#importLocationSelect").val() == ""){
				$("#selectFramework").addClass("hide");
				$("#frameworkSourceRow").addClass("hide");
				ViewManager.getView("#importCompetenciesMessageContainer").displayWarning("No Framework Specified, Competencies will not be attached to any frameworks when imported", "noFrameworkSelected");
			}else{
				$("#selectFramework").removeClass("hide");
				ViewManager.getView("#importCompetenciesMessageContainer").clearWarning("noFrameworkSelected");
			}
		});
		

		$("#selectCSV").click(function(ev){
			ev.preventDefault();
			$(".sourceRow").addClass("hide");
			$("#csvSourceRow").removeClass("hide");
			$("#csvOwnerRow").removeClass("hide");
			$("#csvActionRow").removeClass("hide");
			$("#modalContainer").foundation("open")
		});

		$("#importCsvRelation").change(function(ev){
			ev.preventDefault();
			if ($("#importCsvFile")[0].files.length > 0)
				$("#csvRelationRow").removeClass("hide");
			else
				$("#csvRelationRow").addClass("hide");
		});
		
		$("#selectMedbiq").click(function(ev){
			ev.preventDefault();
			$(".sourceRow").addClass("hide");
			$("#medbiqSourceRow").removeClass("hide");
			$("#modalContainer").foundation("open")
		});
		
		$("#selectFramework").click(function(ev){
			ev.preventDefault();
			$(".sourceRow").addClass("hide");
			$("#frameworkSourceRow").removeClass("hide");
			$("#modalContainer").foundation("open")
			
			EcFramework.search(AppController.serverController.getRepoInterface(), "*", addSourceFrameworks, errorFindingFrameworks);
			
			ViewManager.getView("#importCompetenciesMessageContainer").clearWarning("noOwner");
			
			$("#copySwitch").change(function(){
				if($("#copySwitch").is(":checked")){
					$("#importFrameworkOwner").fadeIn();
					if(AppController.identityController.selectedIdentity == undefined)
						ViewManager.getView("#importCompetenciesMessageContainer").displayWarning("Competencies that are copied will be Public and can be modified by anyone", "noOwner");
				}else{
					$("#importFrameworkOwner").fadeOut();
					ViewManager.getView("#importCompetenciesMessageContainer").clearWarning("noOwner");
				}
			})
			
			$("#importSourceSelect").change(function(ev){
				$("#submitImportFramework").removeAttr("disabled");
				$("#submitImportFramework").click(function(ev){
					ev.preventDefault();
					$("#submitImportFramework").attr("disabled", "disabled");
					$("#submitImportFramework").find(".fa-spin").removeClass("hide");
					setTimeout(function(){
						importFromFramework(data);
					}, 100)
				})
			})
		});
		
		$("#selectASN").click(function(ev){
			ev.preventDefault();
			$(".sourceRow").addClass("hide");
			$("#asnSourceRow").removeClass("hide");
			$("#modalContainer").foundation("open");
			
			if(data == undefined){
				$("#createFrameworkInputs").removeClass("hide");
				$("#noCreateFrameworkInputs").addClass("hide");
				
				var newFrameworkOption = $("<option selected>New ASN Framework</option>");
				$("#createFrameworkSwitch").change(function(){
					if($("#createFrameworkSwitch").is(":checked")){
						$("#importLocationSelect").attr("disabled", "disabled");
						$("#importLocationSelect").append(newFrameworkOption)
					}else{
						$("#importLocationSelect").removeAttr("disabled");
						newFrameworkOption.remove();
					}
				})
			}else{
				$("#createFrameworkInputs").addClass("hide");
				$("#noCreateFrameworkInputs").removeClass("hide");
			}
		})
		
		
		$("#importASNFile").change(function(){
			analyzeASN(data);
		})
		
		$("#importCsvFile").change(function(){
			analyzeCsv(data);
		})
		
		$("#importCsvRelation").change(function(){
			analyzeRelationCsv(data);
		})
		
		$("#importMedbiqFile").change(function(){
			analyzeMedbiq(data);
		})
		
		$(".cancelImport").click(function(ev){
			ev.preventDefault();
			ModalManager.hideModal();
		})
		
		$("#newFramework").click(function(){
			ScreenManager.changeScreen(new FrameworkEditScreen());
			ModalManager.hideModal();
		});
		
		if(AppController.identityController.selectedIdentity != undefined){
			var pem = AppController.identityController.selectedIdentity.ppk.toPk().toPem();
			
			ViewManager.showView(new IdentityDisplay(pem), "#importCsvCompetenciesOwner");
			ViewManager.showView(new IdentityDisplay(pem), "#importMedbiqCompetenciesOwner");
			ViewManager.showView(new IdentityDisplay(pem), "#importAsnCompetenciesOwner");
			ViewManager.showView(new IdentityDisplay(pem), "#importAsnCompetenciesCreateFrameworkOwner");
			ViewManager.showView(new IdentityDisplay(pem), "#importFrameworkCompetenciesOwner");
			
		}

	}
	
	return ImportCompetenciesModal;
})(ImportCompetenciesModal);