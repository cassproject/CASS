ViewUserOverlay = (function(ViewUserOverlay){
	ViewUserOverlay.prototype.displayName = "viewUser";
	var ERROR_CONTAINER_ID = "#viewUserError";
	
	function displayError(err)
	{
		$(ERROR_CONTAINER_ID).text(err);
		$(ERROR_CONTAINER_ID).show();
	};
	function clearError()
	{
		$(ERROR_CONTAINER_ID).hide();
	};
	
	function setUserInfo(user)
	{
		$("#userId").text(user.getUserId());
		$("#lastIp").text(user.getLastIp());
		$("#lastLogin").text(user.getLastLogin());
	}
	
	ViewUserOverlay.prototype.display = function(containerId, callback)
	{
		var overlayUser = this.user;
		$(containerId).load("partial/overlay/viewUser.html", function(){
			clearError();
			
			setUserInfo(overlayUser)
			
			if(callback != undefined)
				callback();
		});
	};
	
	return ViewUserOverlay;
})(ViewUserOverlay);