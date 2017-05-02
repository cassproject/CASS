/**
 * Handles the details of copying resources in the repository,
 * this gives the current user owner priveledges on a copy of a resource
 * 
 * @module cass.manager
 * @class RepoExportModal
 * 
 * @author devlin.junker@eduworks.com
 */
var RepoExportModal = (function(RepoExportModal){
	
	

	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf ContactGrantModal
	 * @method display
	 * @param {String} containerId
	 * 			The DOM ID of the Modal Container this modal is displayed in
	 */
	RepoExportModal.prototype.display = function(containerId)
	{
		var data = this.data;
	
		ViewManager.showView(new MessageContainer("repoExport"), "#repoExportMessageContainer", function(){
			if(data == undefined || data == null){
				ViewManager.getView("#repoExportMessageContainer").displayAlert("Error getting objects to export");
			}
		});
		
		var name = "";
		
		if(data == undefined || data == null){
			name = "Error";
		}else if(data instanceof Array){
			name = data.length + " CASS Objects"
		}else{
			if(data.name != undefined){
				name = data.name;
			}else if(data.id != undefined){
				name = data.id;
			}else{
				name = "1 CASS Object"
			}
			
			var arr = [];
			arr.push(data);
			data = arr;
		}
		
		
		$("#exportName").text(name);
		
		$("#submitExport").click(function(){
			var process = new CSVExport.CSVExportProcess();
			
			process.buildExport(data);
			
			var optName = $("#nameInput").val();
			if(optName != undefined && optName != ""){
				name = optName;
			}
			
			var date = new Date();
			process.downloadCSV(name +"-"+ date.getYear()+date.getMonth()+date.getDay());
			
			ModalManager.hideModal();
		});
		
		$("#cancelExport").click(function(){
			ModalManager.hideModal();
		});
		
	}
	
	return RepoExportModal;
})(RepoExportModal);