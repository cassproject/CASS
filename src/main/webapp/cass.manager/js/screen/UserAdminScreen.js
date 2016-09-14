UserAdminScreen = (function(UserAdminScreen){
	
	UserAdminScreen.prototype.display = function(containerId, callback)
	{
		var screen = this;
		
		$(containerId).load("partial/screen/userAdmin.html", function(){
			
			ViewManager.showView(new MessageContainer("userAdmin"), "#userAdminMessageContainer");
			
			$("#xapiAdapterConfigureBtn").click(function(ev){
				ev.preventDefault();
				$("#xapiConfiguration").removeClass("hide");
			})
			
			if(callback != undefined)
				callback();
		});
	};
	
	return UserAdminScreen;
})(UserAdminScreen);