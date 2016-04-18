/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
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