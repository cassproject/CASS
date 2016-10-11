UserAdminScreen = (function(UserAdminScreen){
	
	UserAdminScreen.prototype.display = function(containerId)
	{			
		ViewManager.showView(new MessageContainer("userAdmin"), "#userAdminMessageContainer");
		
		$("#xapiAdapterConfigureBtn").click(function(ev){
			ev.preventDefault();
			$("#xapiConfiguration").removeClass("hide");
		})


		xapiConfig.get(AppController.serverController.selectedServerUrl, function(configObj){
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
				
			})
			
			$("#xapiSaveBtn").click(function(ev){
				ev.preventDefault();
				
				var config = new xapiConfig();
				
				config.enabled = $("#xapiAdapterEnabledSwitch").prop("checked");
				
				config["xapiEndpoint"] = $("#xapiEndpointInput").val();
				
				config["xapiHostName"] = $("#xapiEndpointHostnameInput").val();
				
				config["xapiAuth"] = $("#xapiAuthKeyInput").val();
				
				config.save(AppController.serverController.selectedServerUrl, function(){
					$("#xapiConfiguration").effect("highlight", {}, 1500);
				}, function(){
					
				});
				
				
			})
	};
	
	return UserAdminScreen;
})(UserAdminScreen);