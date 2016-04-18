/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
/*
 * The third definition defines the UI methods and server-exposed methods
 */
var KeyManager = (function(KeyManager){
	/**
	 * Local Methods are used to manipulate the UI elements on the page (They may also call Server Model or 
	 * Server Manager methods to affect the server, but that shouldn't be built by the UI developer)
	 */

	function selectKey(ppk)
	{
	    $("#keyManagerKeys").children("span").removeClass("success").addClass("alert");
	    $("#keyManagerKeys").find("[title='"+ppk+"']").removeClass("alert").addClass("success");
	    
	    AppController.identityController.select(ppk);
	}
	
	function refreshIdentities()
	{
		var identities = EcIdentityManager.ids;
		
	    $("#keyManagerKeys").html("");
	    for (var index in identities)
	    {
	    	var ppk = identities[index].ppk.toPem().replaceAll("\r?\n","");
	        var name = identities[index].displayName;
	        
	        var element = $("<span style='margin-bottom:0.25rem;'></span>");
	        
	        if(AppController.identityController.selectedIdentity != undefined && 
	        		name == AppController.identityController.selectedIdentity.displayName)
	        	element.addClass("label success");
	        else
	        	element.addClass("label alert");
	        element.attr("title", ppk);
	        element.click(ppk, function(event){
	        	selectKey(event.data);
	        });
	        element.text(name);
	        
	        $("#keyManagerKeys").append(element);
	        $("#keyManagerKeys").append($("<br/>"));
	    }
	}
	
	/**
	 * The display function defines how this view should be displayed
	 * @param containerId: defines the container that this view should be displayed in
	 * 		for screens -> screenContainer
	 * 		for overlays -> overlayContainer
	 * 		for modals -> modalContainer
	 */
	KeyManager.prototype.display = function(containerId, callback)
	{	
		$(this.saveButtonId).click(function(){
			AppController.repositoryController.upload(serializeField($("#datum")), saveSuccess, saveFailure);
		});
		
		$(containerId).load("partial/other/keyManager.html", function(){			
			
			refreshIdentities(containerId);
			
			if(callback != undefined)
				callback();
		});
	}
	
	return KeyManager;
})(KeyManager);