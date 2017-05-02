/**
 * Screen that displays admin specific info and allows admin to access adapter configuration
 * 
 * @module cass.manager
 * @class UserAdminScreen
 * 
 * @author devlin.junker@eduworks.com
 */
UserAdminScreen = (function(UserAdminScreen){
	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf UserAdminScreen
	 * @method display
	 * @param containerId
	 * 			Screen Container DOM ID
	 */
	UserAdminScreen.prototype.display = function(containerId)
	{			
		ViewManager.showView(new MessageContainer("userAdmin"), "#userAdminMessageContainer");
		ViewManager.showView(new MessageContainer("moodleToCass"), "#moodleToCassMessageContainer");
		ViewManager.showView(new MessageContainer("cassToMoodle"), "#cassToMoodleMessageContainer");
		ViewManager.showView(new MessageContainer("database"), "#databaseMessageContainer");
		
		$("#xapiAdapterConfigureBtn").click(function(ev){
			ev.preventDefault();
			$(".configRow").addClass("hide");
			$("#xapiConfiguration").removeClass("hide");
		})
		$("#moodleAdapterConfigureBtn").click(function(ev){
			ev.preventDefault();
			$(".configRow").addClass("hide");
			$("#moodleConfiguration").removeClass("hide");
		})


		XapiConfig.get(AppController.serverController.selectedServerUrl, function(configObj){
			if(configObj != null){
				if(configObj["enabled"])
					$("#xapiAdapterEnabledSwitch").prop("checked", true);
				else
					$("#xapiAdapterEnabledSwitch").prop("checked", false);
					
				if(configObj["xapiEndpoint"] != null)
					$("#xapiEndpointInput").val(configObj["xapiEndpoint"]);
					
				if(configObj["xapiHostName"] != null)
					$("#xapiEndpointHostnameInput").val(configObj["xapiHostName"]);
				
				if(configObj["xapiAuth"] != null)
					$("#xapiAuthKeyInput").val(configObj["xapiAuth"]);
			}
		}, function(error){
			
		});
			
		$("#xapiSaveBtn").click(function(ev){
			ev.preventDefault();
			
			var config = new XapiConfig();
			
			config.enabled = $("#xapiAdapterEnabledSwitch").prop("checked");
			
			config["xapiEndpoint"] = $("#xapiEndpointInput").val();
			
			config["xapiHostName"] = $("#xapiEndpointHostnameInput").val();
			
			config["xapiAuth"] = $("#xapiAuthKeyInput").val();
			
			config.save(AppController.serverController.selectedServerUrl, function(){
				$("#xapiConfiguration").effect("highlight", {}, 1500);
			}, function(){
				
			});
		});
		
		
		MoodleConfig.get(AppController.serverController.selectedServerUrl, function(configObj){
			if(configObj != null){
				if(configObj["moodleToCassEnabled"]){
					$("#moodleToCassEnabledSwitch").prop("checked", true);
					$("#moodleToCassContainer").removeClass("hide");
					$("#moodleToCassBtn").removeAttr("disabled");
				}else{
					$("#moodleToCassEnabledSwitch").prop("checked", false);
					$("#moodleToCassContainer").addClass("hide");
					$("#moodleToCassBtn").attr("disabled", "disabled");
				}
				
				if(configObj["cassToMoodleEnabled"]){
					$("#cassToMoodleEnabledSwitch").prop("checked", true);
					$("#cassToMoodleContainer").removeClass("hide");
					$("#cassToMoodleBtn").removeAttr("disabled");
				}else{
					$("#cassToMoodleEnabledSwitch").prop("checked", false);
					$("#cassToMoodleContainer").addClass("hide");
					$("#cassToMoodleBtn").attr("disabled", "disabled");
				}
					
				if(configObj["moodleEndpoint"] != null)
					$("#moodleEndpointInput").val(configObj["moodleEndpoint"]);
				
				if(configObj["moodleToken"] != null)
					$("#moodleTokenInput").val(configObj["moodleToken"]);
			}
		}, function(error){
			
		});
		
		$("#moodleToCassEnabledSwitch").on("change", function(){
			if($("#moodleToCassEnabledSwitch").is(":checked")){
				$("#moodleToCassContainer").removeClass("hide");
			}else{
				$("#moodleToCassContainer").addClass("hide");
			}
		})
		
		$("#cassToMoodleEnabledSwitch").on("change", function(){
			if($("#cassToMoodleEnabledSwitch").is(":checked")){
				$("#cassToMoodleContainer").removeClass("hide");
			}else{
				$("#cassToMoodleContainer").addClass("hide");
			}
		})
		
		$("#moodleSaveBtn").click(function(ev){
			ev.preventDefault();
			
			var config = new MoodleConfig();
			
			config["moodleToCassEnabled"] = $("#moodleToCassEnabledSwitch").prop("checked");
			
			config["cassToMoodleEnabled"] = $("#cassToMoodleEnabledSwitch").prop("checked");
			
			config["moodleEndpoint"] = $("#moodleEndpointInput").val();
			
			config["moodleToken"] = $("#moodleTokenInput").val();
			
			config.save(AppController.serverController.selectedServerUrl, function(){
				$("#moodleConfiguration").effect("highlight", {}, 1500);
				
				if($("#cassToMoodleEnabledSwitch").is(":checked")){
					$("#cassToMoodleBtn").removeAttr("disabled");
				}else{
					$("#cassToMoodleBtn").attr("disabled", "disabled");
				}
				
				if($("#moodleToCassEnabledSwitch").is(":checked")){
					$("#moodleToCassBtn").removeAttr("disabled");
				}else{
					$("#moodleToCassBtn").attr("disabled", "disabled");
				}
			}, function(){
				
			});
		});
		
		$("#moodleToCassBtn").click(function(){
			if($("#moodleToCassBtn").attr("disabled") != undefined && $("#moodleToCassBtn").attr("disabled") != ""){
				ViewManager.getView("#moodleToCassMessageContainer").displayWarning("Save Moodle Configuration First");
				$("#moodleSaveBtn").effect("highlight", {}, 1500);
				return;
			} 
			ViewManager.getView("#moodleToCassMessageContainer").clearWarning();
			
			$("#moodleToCassSyncing").removeClass("hide");
			$("#moodleToCassBtn").attr("disabled", "disabled");
			
			MoodleConfig.syncMoodleToCass(AppController.serverController.selectedServerUrl, function(result){
				$("#moodleToCassSyncing").addClass("hide");
				$("#moodleToCassBtn").removeAttr("disabled");
				ViewManager.getView("#moodleToCassMessageContainer").clearAlert();
				ViewManager.getView("#moodleToCassMessageContainer").displaySuccess("Successfully Synced");
			}, function(err){
				$("#moodleToCassSyncing").addClass("hide");
				$("#moodleToCassBtn").removeAttr("disabled");
				ViewManager.getView("#moodleToCassMessageContainer").clearSuccess();
				ViewManager.getView("#moodleToCassMessageContainer").displayAlert("Error Syncing: "+error);
			});
		})
		
		$("#cassToMoodleBtn").click(function(){
			if($("#cassToMoodleBtn").attr("disabled") != undefined && $("#cassToMoodleBtn").attr("disabled") != ""){
				ViewManager.getView("#cassToMoodleMessageContainer").displayWarning("Save Moodle Configuration First");
				$("#moodleSaveBtn").effect("highlight", {}, 1500);
				return;
			}
			ViewManager.getView("#cassToMoodleMessageContainer").clearWarning();
			
			$("#cassToMoodleSyncing").removeClass("hide");
			$("#cassToMoodleBtn").attr("disabled", "disabled");
			
			MoodleConfig.syncCassToMoodle(AppController.serverController.selectedServerUrl, function(result){
				$("#cassToMoodleSyncing").addClass("hide");
				$("#cassToMoodleBtn").removeAttr("disabled");
				ViewManager.getView("#cassToMoodleMessageContainer").clearAlert();
				ViewManager.getView("#cassToMoodleMessageContainer").displaySuccess("Successfully Synced");
			}, function(err){
				$("#cassToMoodleSyncing").addClass("hide");
				$("#cassToMoodleBtn").removeAttr("disabled");
				ViewManager.getView("#cassToMoodleMessageContainer").clearSuccess();
				ViewManager.getView("#cassToMoodleMessageContainer").displayAlert("Error Syncing: "+error);
			});
		})
		
		
		$("#skyrepoBackup").click(function(){
			var secret = prompt("Please enter the Server Secret (from the .secret file on the CASS Server) to complete the backup")
			
			AppController.serverController.repoInterface.backup(secret, function(){
				ViewManager.getView("#databaseMessageContainer").clearAlert()
				ViewManager.getView("#databaseMessageContainer").displaySuccess("Successfully backed up database")
			}, function(err){
				var error = "Error backing up database: "+err;
				ViewManager.getView("#databaseMessageContainer").displayAlert(error);
				ViewManager.getView("#databaseMessageContainer").clearSuccess();
			});
		});
		
		$("#skyrepoRestore").click(function(){
			var secret = prompt("Please enter the Server Secret (from the .secret file on the CASS Server) to complete the restore")
			
			AppController.serverController.repoInterface.restoreBackup(secret, function(){
				ViewManager.getView("#databaseMessageContainer").clearAlert()
				ViewManager.getView("#databaseMessageContainer").displaySuccess("Successfully restored database")
			}, function(err){
				var error = "Error restoring database: "+err;
				ViewManager.getView("#databaseMessageContainer").displayAlert(error);
				ViewManager.getView("#databaseMessageContainer").clearSuccess();
			});
		});
		
		$("#skyrepoWipe").click(function(){
			var secret = prompt("Please enter the Server Secret (from the .secret file on the CASS Server) to complete the database wipe")
			
			AppController.serverController.repoInterface.wipe(secret, function(){
				ViewManager.getView("#databaseMessageContainer").clearAlert()
				ViewManager.getView("#databaseMessageContainer").displaySuccess("Successfully wiped database")
			}, function(err){
				var error = "Error wiping database: "+err;
				ViewManager.getView("#databaseMessageContainer").displayAlert(error);
				ViewManager.getView("#databaseMessageContainer").clearSuccess();
			});
		});
	};
	
	return UserAdminScreen;
})(UserAdminScreen);