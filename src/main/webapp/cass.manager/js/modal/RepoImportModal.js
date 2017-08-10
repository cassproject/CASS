/**
 * Modal for viewing evidence details
 * 
 * @module cass.manager
 * @class RepoImportModal
 * 
 * @author devlin.junker@eduworks.com
 */
var RepoImportModal = (function(RepoImportModal){	

	
	/**
	 * Handles getting CSV file from Competency CSV Input and 
	 * displays columns and # found once finished analyzing CSV
	 * 
	 * @memberOf RepoImportModal
	 * @method analyzeCsv
	 * @private
	 * @param {EcFramework} framework
	 * 			Framework to import CSV competencies too
	 */
	function analyzeCsv() {
	    var file = $("#generalImportFile")[0].files[0];
	    
	    CSVImport.analyzeFile(file, function(data){
	    	if (data.length === undefined || data.length == 0) {
            	ViewManager.getView("#generalImportMessageContainer").displayAlert("CSV could not be parsed", "parseCSV");
            	$("#submitGeneralImport").attr("disabled", "disabled")
            	$("#submitGeneralImport").off("click");
                return;
            }
            $("#submitGeneralImport").removeAttr("disabled");
            ViewManager.getView("#generalImportMessageContainer").clearAlert("parseCSV");
            
            $("#generalImportColumnId").html("<option index='-1'>N/A</option>");
            for (var i = 0; i < data[0].length; i++) {
                $("#generalImportColumnId").append("<option/>").children().last().text(data[0][i]).attr("index", i);
                
                if(data[0][i].toLowerCase().includes("id")){
                	$("#generalImportColumnId [index="+i+"]").attr("selected", "selected");
                	ViewManager.getView("#generalImportMessageContainer").displayPrimary("CSV column names atuomatically determined based off of name", "csvGuess");
                }
            }
            
            $("#generalImportColumnId").change(function(){
            	if($("#generalImportColumnId").val() != undefined && $("#generalImportColumnId").val() != -1){
            		
            	}else{
            		ViewManager.getView("#generalImportMessageContainer").displayWarning("If ID Column not set, imported data cannot be linked", "noID");
            	}
            });
            
            $("#submitGeneralImport").on("click", function(ev){
				ev.preventDefault();
				$("#submitGeneralImport").attr("disabled", "disabled");
				$("#submitGeneralImport").find(".fa-spin").removeClass("hide");
				setTimeout(function(){
					importCsv();
				}, 100);
			})
	    }, function(error){
        	ViewManager.getView("#generalImportMessageContainer").clearSuccess();
        	ViewManager.getView("#generalImportMessageContainer").displayAlert(error);
        });
	}
	
	/**
	 * Handles getting file and column input from DOM and pass
	 * to import to import competencies from CSV
	 * 
	 * @memberOf RepoImportModal
	 * @method importCsv
	 * @private
	 * @param {EcFramework} framework
	 * 			Framework that is being edited
	 */
	function importCsv() {  
	    var file = $("#generalImportFile")[0].files[0];
	   
        var idIndex = parseInt($("#generalImportColumnId option:selected").attr("index"));

        ViewManager.getView("#generalImportMessageContainer").clearAlert("selectName");
	    
        CSVImport.importData(file, AppController.serverController.selectedServerUrl, AppController.identityController.selectedIdentity,
        		function(savedObjects){
        	var query = "";
            for(var i = 0; i < savedObjects.length; i++)
            {
            	var obj = savedObjects[i];
            	
            	var id = obj.shortId().split("/");
        		id = id[id.length - 1];
        		
        		if(i > 0)
        			query += " OR ";
        		query += id;
            }
           
        	ScreenManager.changeScreen(new RepoSearchScreen(null, query))
        	
        	ModalManager.hideModal();
     
        }, function(error){
        	ViewManager.getView("#generalImportProgressMessageContainer").clearSuccess();
        	ViewManager.getView("#generalImportProgressMessageContainer").displayAlert(error);
        }, function(count){
        	ViewManager.getView("#generalImportProgressMessageContainer").displaySuccess("Sucessfully imported "+count+" objects", "progress")
        }, idIndex);
        
	}
	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf RepoImportModal
	 * @method display
	 * @param {String} containerId
	 * 			The DOM ID of the Modal Container this modal is displayed in
	 */
	RepoImportModal.prototype.display = function(containerId)
	{
	
		ViewManager.showView(new MessageContainer("generalImportProgress"), "#generalImportProgressMessageContainer");
		ViewManager.showView(new MessageContainer("importCompetencies"), "#generalImportMessageContainer", function(){
			if(AppController.identityController.selectedIdentity == undefined)
			{
				ViewManager.getView("#generalImportMessageContainer").displayWarning("Objects that are imported will be Public and can be modified by anyone", "noOwner");
			}
		});
		
		
		$("#generalImportFile").change(function(){
			analyzeCsv();
		})
		
		$(".cancelImport").click(function(ev){
			ev.preventDefault();
			ModalManager.hideModal();
		})
		
		if(AppController.identityController.selectedIdentity != undefined){
			var pem = AppController.identityController.selectedIdentity.ppk.toPk().toPem();
			
			ViewManager.showView(new IdentityDisplay(pem), "#generalImportOwner");
		}

	}
	
	return RepoImportModal;
})(RepoImportModal);