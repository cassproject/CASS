/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
var ImportCompetenciesModal = (function(ImportCompetenciesModal){	
	
	function createContactSmall(pem) {
		var ident = AppController.identityController.lookup(pem);
		return '<span class="ownershipDisplay has-tip" tabindex>'
				+ '<span class="qrcodeCanvas"></span>'
				+ '<span class="contactText" title="' + pem + '">'
				+ ident.displayName + '</span>' + '</span>';
	}
	
	var cached_frameworks = {};

	function addLocationFramework(framework){
		var id = framework.shortId().split("/");
		var id = id[id.length-1];
		
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
	
	function addFrameworks(frameworks){
		for(var i = 0; i < frameworks.length; i++){
			var framework = frameworks[i];
			var id = framework.shortId().split("/");
			var id = id[id.length-1];
			
			addLocationFramework(framework)
			
			cached_frameworks[id] = framework;
		}
	}
	
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
	
	function errorFindingFrameworks(err){
		if(err == undefined)
			err = "Unable to Connect to Server to Find Frameworks";
				
		ViewManager.getView("#importCompetenciesMessageContainer").displayAlert(err, "getFramework");
	}
	
	function errorParsing(err){
		if(err == undefined)
			err = "CSV could not be parsed";
			
		ViewManager.getView("#importCompetenciesMessageContainer").displayAlert(err, "parseCSV");
	}
	
	function errorSavingCompetency(err){
		if(err == undefined)
			err = "Could not connect to server to save competency";
			
		ViewManager.getView("#importCompetenciesMessageContainer").displayAlert(err, "saveCompetency");
	}
	
	function errorSavingFramework(err){
		if(err == undefined)
			err = "Could not connect to server to save framework";
			
		ViewManager.getView("#importCompetenciesMessageContainer").displayAlert(err, "saveFramework");
	}
	
	function errorFindingCompetency(err){
		if(err == undefined)
			err = "Could not connect to server to find source framework competencies";
			
		ViewManager.getView("#importCompetenciesMessageContainer").displayAlert(err, "findCompetencies");
	}
	
	function analyzeCsv(framework) {
	    var file = $("#importCsvFile")[0].files[0];
	    Papa.parse(file, {
	        complete: function (results) {
	            var data = results.data;
	            if (data.length === undefined || data.length == 0) {
	            	ViewManager.getView("#importCompetenciesMessageContainer").displayAlert("CSV could not be parsed", "parseCSV");
	            	$("#submitImportCsv").attr("disabled", "disabled")
	            	$("#submitImportCsv").off("click");
	                return;
	            }
	            $("#submitImportCsv").removeAttr("disabled");
	            ViewManager.getView("#importCompetenciesMessageContainer").clearAlert("parseCSV");
	            
	            $("#importCsvColumnName").html("<option index='-1'>N/A</option>");
	            $("#importCsvColumnDescription").html("<option index='-1'>N/A</option>");
	            $("#importCsvColumnScope").html("<option index='-1'>N/A</option>");
	            for (var i = 0; i < data[0].length; i++) {
	                $("#importCsvColumnName").append("<option/>").children().last().text(data[0][i]).attr("index", i);
	                $("#importCsvColumnDescription").append("<option/>").children().last().text(data[0][i]).attr("index", i);
	                $("#importCsvColumnScope").append("<option/>").children().last().text(data[0][i]).attr("index", i);
	            }
	            
	            $("#submitImportCsv").on("click", function(ev){
					ev.preventDefault();
					if(framework != undefined)
						importCsv(framework);
					else
						importCsv(cached_frameworks[$("#importLocationSelect").val()]);
				})
	        },
	        error: errorParsing
	    });
	}
	
	function importCsv(framework) {  
	    var file = $("#importCsvFile")[0].files[0];
	    
	    Papa.parse(file, {
            complete: function (results) {
                var data = results.data;
                if (data.length === undefined || data.length == 0) {
                	ViewManager.getView("#importCompetenciesMessageContainer").displayAlert("CSV could not be parsed", "parseCSV");
                    return;
                }
                ViewManager.getView("#importCompetenciesMessageContainer").clearAlert("parseCSV");
                
                var nameIndex = parseInt($("#importCsvColumnName option:selected").attr("index"));
                var descriptionIndex = parseInt($("#importCsvColumnDescription option:selected").attr("index"));
                var scopeIndex = parseInt($("#importCsvColumnScope option:selected").attr("index"));
                
                if(nameIndex == -1 ){
                	ViewManager.getView("#importCompetenciesMessageContainer").displayAlert("Must select a column that contains competency names", "selectName");
                	return;
                }
                ViewManager.getView("#importCompetenciesMessageContainer").clearAlert("selectName");
                
                
                var competencies = [];
                
                for (var i = 1; i < data.length; i++) {
                	var f = new EcCompetency();
                    if (data[i][nameIndex] === undefined || data[i][nameIndex] == ""){
                    	ViewManager.getView("#importCompetenciesMessageContainer").displayAlert("Name column contained blank value or could not be found in the CSV", "findName");
                    	return;
                    }
                    ViewManager.getView("#importCompetenciesMessageContainer").clearAlert("findName");
                    if (nameIndex !== -1)
                        f.name = data[i][nameIndex];
                    if (descriptionIndex !== -1)
                        f.description = data[i][descriptionIndex];
                    if (scopeIndex !== -1)
                        f.scope = data[i][scopeIndex];
                    f.generateId(AppController.serverController.selectedServerUrl);
                    if (AppController.identityController.selectedIdentity != null)
                        f.addOwner(AppController.identityController.selectedIdentity.ppk.toPk());
                    competencies.push(f);
                }
                
                var saved = 0;
                var failed = 0;
                var query = "";
                for(var i = 0; i < competencies.length; i++)
                {
                	var comp = competencies[i]
                	EcRepository.save(comp, function (response) {
                		saved++;
                	}, function(err){
                		failed++;
                		ViewManager.getView("#importCompetenciesMessageContainer").displayAlert("Failed to save competency with name: '"+comp.name+"'");
                	});
                	
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
                
                var finishUp = function(){
                	if((saved + failed) == competencies.length){
                		if(framework != undefined){
                			delete framework.competencyObjects;
        	                EcRepository.save(framework, function () { 
        	                	ScreenManager.changeScreen(new FrameworkViewScreen(framework))
        	                }, errorSavingFramework);
                		}else{
                        	ScreenManager.changeScreen(new CompetencySearchScreen(null, query))
                        }
                		
                		if(saved == competencies.length)
                			ModalManager.hideModal();
                	}else{
                		setTimeout(finishUp, 200);
                	}
                }
                
                setTimeout(finishUp, 200);
                	
            },
	        error: errorParsing
        });
	}
	
	function importFromFramework(framework){
		if(framework == undefined)
			framework = cached_frameworks[$("#importLocationSelect").val()];
		
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
		
		var copy = $("#copySwitch").is(":checked");
		
		if(copy){
			var saved = 0;
			var failed = 0;
			for(var i = 0; i < source.competency.length; i++){
				var id = source.competency[i];
				
				AppController.repositoryController.viewCompetency(id, function(comp){
					var f = new EcCompetency();
					f.copyFrom(comp);
					
					f.generateId(AppController.serverController.selectedServerUrl);
                    
					if (AppController.identityController.selectedIdentity != null)
                        f.addOwner(AppController.identityController.selectedIdentity.ppk.toPk());

					EcRepository.save(f, function(){
						saved++;
						framework.addCompetency(f.id);
					}, function(err){
						failed++;
						errorSavingCompetency("Trouble Copying Competency: "+comp.id);
					});
				}, errorFindingCompetency);
			}
			
			var finishUp = function(){
				if((saved + failed) == source.competency.length){
					EcRepository.save(framework, function(){
						ScreenManager.changeScreen(new FrameworkViewScreen(framework));
						
						if(saved == source.competency.length)
							ModalManager.hideModal();
					}, errorSavingFramework);
				}else{
					setTimeout(finishUp, 200);
				}
			}
			
			setTimeout(finishUp, 200);
		}else{
			for(var i = 0; i < source.competency.length; i++){
				framework.addCompetency(source.competency[i]);
			}
			
			delete framework.competencyObjects;
			EcRepository.save(framework, function(){
				ScreenManager.changeScreen(new FrameworkViewScreen(framework));
				ModalManager.hideModal();
			}, errorSavingFramework);
		}
	}
	
	function importMedbiq(framework){
		// TOOD: Copy this from appImport.js
	}
	
	var medbiqXmlCompetencies = {};
	var medbiqXmlToSave = [];
	
	function analyzeMedbiq(framework){
		 var file = $("#importMedbiqFile")[0].files[0];
		    $("#medbiqImportProgress").text("");
		    if (file) {
		        var reader = new FileReader();
		        reader.onload = function (e) {
		        	var obj = new X2JS().xml_str2json( e.target.result );

		            medbiqXmlCompetencies = {};
		            medbiqXmlToSave = [];
		            medbiqXmlLookForCompetencyObject(obj);
		            $("#medbiqImportProgress").text(Object.keys(medbiqXmlCompetencies).length + " competencies detected. Press import to finish.");
		            $("#submitImportMedbiq").removeAttr("disabled")
		            
		            $("#submitImportMedbiq").click(function(){
		            	if(Object.keys(medbiqXmlCompetencies).length == 0)
		            		ViewManager.getView("#importCompetenciesMessageContainer").displayAlert("No Competencies Found to Import", "noMedbiqCompetencies");
		            	else
		            		importMedbiq(framework);
		            })
		        };
		        reader.readAsText(file);
		    
		        $("#submitImportMedbiq").click(function(){
		        	startImportMedbiqXml(framework);
		        })
		    }
	}
	
	function medbiqXmlLookForCompetencyObject(obj) {
	    var key;
	    if (isObject(obj) || isArray(obj))
	        for (key in obj) {
	            if (key == "CompetencyObject")
	                medbiqXmlParseCompetencyObject(obj[key]);
	            else
	                medbiqXmlLookForCompetencyObject(obj[key]);
	        }
	}

	function medbiqXmlParseCompetencyObject(obj) {
	    if (isArray(obj)) {
	        var key;
	        for (key in obj) {
	            medbiqXmlParseCompetencyObject(obj[key]);
	        }
	    } else {
	        var newCompetency = {};
	        if (obj["lom"] !== undefined && obj["lom"]["general"] !== undefined) {
	            newCompetency.name = obj["lom"]["general"]["title"]["string"].toString();
	            if (obj["lom"]["general"]["description"] !== undefined)
	                newCompetency.description = obj["lom"]["general"]["description"]["string"].toString();
	            if (obj["lom"]["general"]["identifier"] !== undefined)
	                newCompetency.url = obj["lom"]["general"]["identifier"]["entry"].toString();
	            if (newCompetency.description === undefined)
	                newCompetency.description = "";
	            medbiqXmlCompetencies[newCompetency.url] = newCompetency;
	        }
	    }
	}
	
	function startImportMedbiqXml(framework) {
	    if(framework != undefined){
	    	 importMedbiqXml(framework);
	    }else{
	    	importMedbiqXml(cached_frameworks[$("#importLocationSelect").val()]);
	    }
	}
	
	function importMedbiqXml(framework){
		if (framework != null && framework.competency == null)
            framework.competency = [];
        
        for (var key in medbiqXmlCompetencies) {

            var f = new EcCompetency();
            
            var obj = medbiqXmlCompetencies[key];
            if (obj.name === undefined)
                continue;
            f.name = obj.name;
            if (obj.url !== undefined)
                f.url = obj.url;
            if (obj.description !== undefined)
                f.description = obj.description;
            f.generateId(AppController.serverController.selectedServerUrl);
            if (AppController.identityController.selectedIdentity != null)
                f.addOwner(AppController.identityController.selectedIdentity.ppk.toPk())
      
            if(framework != null)
            	framework.addCompetency(f.shortId());
            
            medbiqXmlToSave.push(f);
        }
        
        medbiqXmlStartUpload(framework);
	}
	
	function medbiqXmlStartUpload(framework) {

	    if (medbiqXmlToSave.length == 0 && framework != null) {
	        EcRepository.save(framework, function () {
	        	ModalManager.hideModal();
	        }, errorSavingFramework);
	    } else {
	        for (var i = 0; i < 10; i++) {
	            if (medbiqXmlToSave.length == 0) continue;
	            var f = medbiqXmlToSave[0];
	            medbiqXmlToSave.splice(0, 1);
	            if (i == 9 || medbiqXmlToSave.length == 0)
	                EcRepository.save(f, function () {
	                    $("#medbiqImportProgress").text(medbiqXmlToSave.length + " competencies remaining to upload.");
	                    medbiqXmlStartUpload(framework);
	                }, errorSavingCompetency);
	            else
	                EcRepository.save(f, function () {
	                    $("#medbiqImportProgress").text(medbiqXmlToSave.length + " competencies remaining to upload.");
	                }, errorSavingCompetency);
	        }
	    }
	}
	
	
	ImportCompetenciesModal.prototype.display = function(containerId, callback)
	{
		var data = this.data;
		
		$(containerId).load("partial/modal/importCompetencies.html", function(){
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
				AppController.searchController.frameworkSearch("*", addFrameworks, errorFindingFrameworks, "public");
				AppController.searchController.frameworkSearch("*", addFrameworks, errorFindingFrameworks, "me");
			}else{
				$("#selectFramework").removeClass("hide");
				
				if(data.owner == undefined || data.owner.length == 0)
					addPublicFramework(data);
				else
					addMyFramework(data);
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
				$("#modalContainer").foundation("open")
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
				
				AppController.searchController.frameworkSearch("*", addSourceFrameworks, errorFindingFrameworks);
				
				ViewManager.getView("#importCompetenciesMessageContainer").clearWarning("noOwner");
				
				$("#copySwitch").change(function(){
					if($("#copySwitch").is(":checked")){
						$("#importFrameworkOwner").fadeIn();
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
						importFromFramework(data);
					})
				})
			})
			
			$("#importCsvFile").change(function(){
				analyzeCsv(data);
			})
			
			$("#importMedbiqFile").change(function(){
				analyzeMedbiq(data);
			})
			
			$(".cancelImport").click(function(ev){
				ev.preventDefault();
				ModalManager.hideModal();
			})
			
			if(AppController.identityController.selectedIdentity != undefined){
				var pem = AppController.identityController.selectedIdentity.ppk.toPk().toPem();
				var contact = $(createContactSmall(pem));
				$(".importCompetenciesOwner").html(contact);
				contact.children(".qrcodeCanvas").qrcode({
					width : 128,
					height : 128,
					text : forge.util.decode64(pem.replaceAll("-----.*-----", "").trim())
				});
			}

			if(callback != undefined)
				callback();
		});
	}
	
	return ImportCompetenciesModal;
})(ImportCompetenciesModal);