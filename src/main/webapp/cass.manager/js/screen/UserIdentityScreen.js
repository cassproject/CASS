/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
UserIdentityScreen = (function(UserIdentityScreen){
		
	function refreshIdentities(identities)
	{
	    $("#identityKeys").html("");
	    $("#addKeyIv").val("");
	    for (var index in identities)
	    {
	    	var ppk = identities[index].ppk.toPem().replaceAll("\r?\n","");
	        var name = identities[index].displayName;
	        
	        var element = $("<span></span>");
	        
	        element.attr("title", ppk);
	        element.click(function(){
	        	copyTextToClipboard(ppk);
	        });
	        element.text(name);
	        $("#identityKeys").append(element);
	        $("#identityKeys").append($("<br/>"));
	    }
	}
	
	function activateKey(ppk)
	{
		if(ppk.length == 0)
		{
			$("#addKeyPpk").addClass("is-invalid-label");
			return;
			
			$("#addKeyPpk").change(function(){
				$("#addKeyPpk").removeClass("is-invalid-label");
			})
		}
		else
		{
			$("#addKeyPpk").removeClass("is-invalid-label");
		}
		
	    if (is(ppk,"FileList"))
	    {
	        for (var i in ppk)
	        {
	            var file = ppk[i];
	            var fr=new FileReader();
	           
	            fr.onload=(function(file,fr){
	                return function(event){
	                	AppController.identityController.addKey(fr.result, file.name, function(){
	                		refreshIdentities(EcIdentityManager.ids);
	                		ModalManager.showModal(new SaveIdModal());
	                		
	                		$("#addKeyPpk").replaceWith($("#addKeyPpk").val('').clone(true));
	                	});
	                }
	            })(file,fr);
	           
	            if (is(file,"File"))
	                fr.readAsText(file); 
	        }
	    }
	    else
	    {
	    	AppController.identityController.addKey(fr.result, file.name, function(){
	    		refreshIdentities(EcIdentityManager.ids);
	    		ModalManager.showModal(new SaveIdModal());
	    		
	    		$("#addKeyPpk").replaceWith($("#addKeyPpk").val('').clone(true));
	    	});
	    }
	}
	
	function displayMessage(error, errorClass)
	{
		if(errorClass == undefined || errorClass == "")
			errorClass = "alert";
		
		var errorContainer = $("#identityError") 
		
		errorContainer.find("[data-msg='"+error+"']").remove();
		
		errorContainer.addClass(errorClass);
		errorContainer.attr("style", "");
		errorContainer.append("<div data-msg='"+error+"'>"+error+"</div>");
		errorContainer.removeClass("hide");
		
	}
	
	function hideMessage()
	{
		var errorContainer = $("#identityError") 
		
		errorContainer.fadeOut();
		errorContainer.addClass("hide");
		errorContainer.attr("style", "");
		errorContainer.html('<button class="close-button" type="button" data-close><span aria-hidden="true">&times;</span></button>');
	}
	
	UserIdentityScreen.prototype.display = function(containerId, callback)
	{
		$(containerId).load("partial/screen/userIdentity.html", function(){
			
			refreshIdentities(EcIdentityManager.ids);
			
			$("#identityServerName").text(AppController.serverController.selectedServerName);
			$("#identityServerUrl").text(AppController.serverController.selectedServerUrl);
			
			$("#importIdentity").click(function(event){
				event.preventDefault();
				
				activateKey($('#addKeyPpk')[0].files);
			});
			
			$("#generateIdentity").click(function(){
				var name = $("#generateIdentityName").val(); 
				AppController.identityController.generateIdentity(function(identity){
					 refreshIdentities(EcIdentityManager.ids);
					 download(identity.displayName+'.pem',identity.ppk.toPem());
					 ModalManager.showModal(new SaveIdModal());
				 }, name);
			});
			
			$("#openSaveModal").click(function(){
				ModalManager.showModal(new SaveIdModal());
			})
			
			if(callback != undefined)
				callback();
		});
	};
	
	return UserIdentityScreen;
})(UserIdentityScreen);