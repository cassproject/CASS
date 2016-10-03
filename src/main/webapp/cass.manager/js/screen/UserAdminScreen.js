UserAdminScreen = (function(UserAdminScreen){
	
	UserAdminScreen.prototype.display = function(containerId)
	{			
		ViewManager.showView(new MessageContainer("userAdmin"), "#userAdminMessageContainer");
		
		$("#xapiAdapterConfigureBtn").click(function(ev){
			ev.preventDefault();
			$("#xapiConfiguration").removeClass("hide");
		})

	};
	
	return UserAdminScreen;
})(UserAdminScreen);