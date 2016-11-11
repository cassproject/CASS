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
				if(configObj["enabled"])
					$("#moodleAdapterEnabledSwitch").prop("checked", true);
				else
					$("#moodleAdapterEnabledSwitch").prop("checked", false);
					
				if(configObj["moodleEndpoint"] != null)
					$("#moodleEndpointInput").val(configObj["moodleEndpoint"]);
				
				if(configObj["moodleToken"] != null)
					$("#moodleTokenInput").val(configObj["moodleToken"]);
			}
		}, function(error){
			
		});
		
		$("#moodleSaveBtn").click(function(ev){
			ev.preventDefault();
			
			var config = new MoodleConfig();
			
			config.enabled = $("#moodleAdapterEnabledSwitch").prop("checked");
			
			config["moodleEndpoint"] = $("#moodleEndpointInput").val();
			
			
			config["moodleToken"] = $("#moodleTokenInput").val();
			
			config.save(AppController.serverController.selectedServerUrl, function(){
				$("#moodleConfiguration").effect("highlight", {}, 1500);
			}, function(){
				
			});
		});
	};
	
	return UserAdminScreen;
})(UserAdminScreen);