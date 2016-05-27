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
	        	alert("Copied Key to Clipboard");
	        });
	        element.text(name);
	        $("#identityKeys").append(element);
	        $("#identityKeys").append($("<br/>"));
	        
	        var invitationOption = $("<option></option>");
	        invitationOption.attr("value", ppk);
	        invitationOption.text(name)
	        $("#shareContactIdentity").append(invitationOption);
	        
	    }
	}
	
	function refreshContacts(contacts){
		$("#contactList").html("");
		for (var index in contacts)
	    {
	    	var pk = contacts[index].pk.toPem().replaceAll("\r?\n","");
	        var name = contacts[index].displayName;
	        
	        var element = $("<span></span>");
	        element.attr("title", pk);
	        element.text(name);
	        
	        $("#contactList").append(element);
	        $("#contactList").append($("<br/>"));
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
	
	function checkNewContact(screen, containerId){
		var hashSplit = window.document.location.hash.split("?");
		
		if(hashSplit.length > 1){
			var firstParam = hashSplit[1];
			
			if(firstParam.startsWith("action")){
				var paramSplit = firstParam.split("&");
				
				if(paramSplit.length == 6 && paramSplit[0].startsWith("action") && paramSplit[1].startsWith("contactDisplayName") && 
						paramSplit[2].startsWith("contactKey") && paramSplit[3].startsWith("contactServer") && 
						paramSplit[4].startsWith("responseToken") && paramSplit[5].startsWith("responseSignature"))
				{
					var actionSplit = paramSplit[0].split("=");
					
					if(actionSplit.length > 1 && actionSplit[1] == "newContact"){
						var displayName = decodeURIComponent(paramSplit[1].split("=")[1]);
						var contactKey = decodeURIComponent(paramSplit[2].split("=")[1]);
						var contactServer = decodeURIComponent(paramSplit[3].split("=")[1]);
						var responseToken = decodeURIComponent(paramSplit[4].split("=")[1]);
						var responseSignature = decodeURIComponent(paramSplit[5].split("=")[1]);
						
						var c = new EcContact();
				        c.displayName = displayName;
				        c.pk = EcPk.fromPem(contactKey);
				        c.source = contactServer;
				        if (EcIdentityManager.getContact(c.pk) != null) {
				        	ScreenManager.replaceHistory(screen, containerId, null);
				            return;
				        }
				        EcIdentityManager.addContact(c);
				        refreshContacts(EcIdentityManager.contacts)
				        
				        ModalManager.showModal(new ContactGrantModal(c, responseToken, responseSignature, function(){
				        	ModalManager.showModal(new SaveIdModal("You have added a contact"));
				        }));
				        
				        
				        ScreenManager.replaceHistory(screen, containerId, null);
					}
				}
			}
		}
	}
	
	function checkContactGrants(){
	    AppController.repoInterface.search('(@encryptedType:"' + EcContactGrant.myType + '")', function (encryptedValue) {
	        EcRepository.get(encryptedValue.shortId(), function (encryptedValue) {
	            var ev = new EcEncryptedValue();
	            ev.copyFrom(encryptedValue);
	            var grant = ev.decryptIntoObject();
	            if (grant != null) {
	                var g = new EcContactGrant();
	                g.copyFrom(grant);
	                if (g.valid())
	                    ModalManager.showModal(new ContactAcceptModal(g, function(){
	                    	refreshContacts(EcIdentityManager.contacts);
	                    	ModalManager.showModal(new SaveIdModal("You have added a contact"));
	                    }));
	            }
	        }, null);
	    }, null, null);
	}
	
	UserIdentityScreen.prototype.display = function(containerId, callback)
	{
		var screen = this;
		
		$(containerId).load("partial/screen/userIdentity.html", function(){
			
			if(LoginController.getLoggedIn()){
				checkNewContact(screen, containerId);
				refreshContacts(EcIdentityManager.contacts);
				checkContactGrants();
			}
			
			refreshIdentities(EcIdentityManager.ids);
			
			
			$("#identityServerName").text(AppController.serverController.selectedServerName);
			$("#identityServerUrl").text(AppController.serverController.selectedServerUrl);
			
			$("#importAlias").click(function(event){
				event.preventDefault();
				
				$("#importContainer").removeClass("hide");
				$("#generateContainer").addClass("hide");
			});
			
			$("#generateAlias").click(function(event){
				event.preventDefault();
				
				$("#generateContainer").removeClass("hide");
				$("#importContainer").addClass("hide");
			})
			
			$("#importIdentity").click(function(event){
				event.preventDefault();
				
				activateKey($('#addKeyPpk')[0].files);
			});
			
			$("#generateIdentity").click(function(){
				var name = $("#generateIdentityName").val(); 
				AppController.identityController.generateIdentity(function(identity){
					 refreshIdentities(EcIdentityManager.ids);
					 download(identity.displayName+'.pem',identity.ppk.toPem());
					 ModalManager.showModal(new SaveIdModal("Your identities have changed"));
				 }, name);
			});
			
			$("#openSaveModal").click(function(){
				ModalManager.showModal(new SaveIdModal());
			});
			
			$("#generateInvitation").click(function(){
				var input = $("#shareContactName").val();
				
				if(input == undefined || input == ""){
					
					return;
				}
				
				var identityPpk = EcPpk.fromPem($("#shareContactIdentity").val());
				if(identityPpk == undefined || identityPpk == ""){
					
					return;
				}	
					
				var string = "Hi, I would like to add you as a contact in CASS.\n\nIf we are using the same CASS system, you may click the following link. If not, change the URL of my CASS server (" + window.location.href.split('/')[2] + ") to yours.\n\n"

			    var iv = EcAes.newIv(32);
			    string += window.location + "?action=newContact&contactDisplayName=" + encodeURIComponent(input) + "&contactKey=" + encodeURIComponent(identityPpk.toPk().toPem()) + "&contactServer=" + encodeURIComponent(AppController.serverController.selectedServerUrl) + "&responseToken=" + encodeURIComponent(iv) + "&responseSignature=" + encodeURIComponent(EcRsaOaep.sign(identityPpk, iv));
			    
			    copyTextToClipboard(string);
			    
			    alert("Invitation has been copied to your clipboard for sharing. \n\n Be careful who you share this with, anyone who accesses the invitation will be able to identify you");
			});
			
			if(callback != undefined)
				callback();
		});
	};
	
	return UserIdentityScreen;
})(UserIdentityScreen);