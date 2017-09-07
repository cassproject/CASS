/**
 * Screen that displays user identity and contact information once the user has signed in
 * 
 * @module cass.manager
 * @class UserIdentityScreen
 * 
 * @author devlin.junker@eduworks.com
 */
UserIdentityScreen = (function (UserIdentityScreen) {
	
	/**
     * Called to clear and and display the identities
     * passed in, on the identity list
     * 
     * @memberOf UserIdentityScreen
     * @method refreshIdentities
     * @private
     * @param {EcIdentity[]} identities
     * 			identities to display
     */
    function refreshIdentities(identities) {
        $("#identityKeys").html("");
        $("#addKeyIv").val("");
        for (var index in identities) {
            var wrapper = $("<div class='identityKey' style='min-height:1.33rem;'></div>");

            var id = identities[index];

            var ppk = id.ppk.toPem().replaceAll("\r?\n", "");
            var name = id.displayName;

            var element = $("<span class='has-tip'></span>");

            element.attr("title", ppk);

            var clickFunction = function () {
                copyTextToClipboard(ppk);
                alert("Copied Key to Clipboard");
            };

            element.on("click", clickFunction);
            element.text(name);
            wrapper.append(element);

            var editNameBtn = $("<i class='fa fa-pencil float-right'></i>");

            editNameBtn.on("click", function () {
                var text = element.text();

                editNameBtn.addClass("hide")

                element.off("click");
                element.removeClass("has-tip");
                element.attr("contenteditable", true);
                element.focus();
                var sel, range
                if (window.getSelection && document.createRange) {
                    range = document.createRange();
                    range.selectNodeContents(element.get(0));
                    range.collapse(true);
                    sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else if (document.body.createTextRange) {
                    range = document.body.createTextRange();
                    range.moveToElementText(element.get(0));
                    range.collapse(true);
                    range.select();
                }

                element.blur(function () {
                    if (element.text() == "") {
                        element.text(text);
                    } else if (text != element.text()) {
                        id.displayName = element.text();
                        ModalManager.showModal(new SaveIdModal());
                    }

                    element.off("click");
                    element.on("click", clickFunction)
                    element.addClass("has-tip");

                    editNameBtn.removeClass("hide")

                });
            });

            wrapper.append(editNameBtn);

            $("#identityKeys").append(wrapper);

            var invitationOption = $("<option></option>");
            invitationOption.attr("value", ppk);
            invitationOption.text(name)
            $("#shareContactIdentity").append(invitationOption);

        }
    }

    /**
     * Called to clear and display the contacts
     * passed in, on the contact list
     * 
     * @memberOf UserIdentityScreen
     * @method refreshIdentities
     * @private
     * @param {EcContact[]} contacts
     * 			contacts to display
     */
    function refreshContacts(contacts) {
        $("#contactList").html("");
        for (var index in contacts) {
            var pk = contacts[index].pk.toPem().replaceAll("\r?\n", "");
            var name = contacts[index].displayName;

            var element = $("<span></span>");
            element.attr("title", pk);
            element.text(name);

            $("#contactList").append(element);
            $("#contactList").append($("<br/>"));
        }
    }

    /**
     * Sets the key passed in as the current key in the identity controller
     * 
     * @memberOf UserIdentityScreen
     * @method refreshIdentities
     * @private
     * @param {Object[]} ppk
     * 			list of files from the import input
     */
    function activateKey(ppk) {
        if (ppk.length == 0) {
            $("#addKeyPpk").addClass("is-invalid-label");
            return;

            $("#addKeyPpk").change(function () {
                $("#addKeyPpk").removeClass("is-invalid-label");
            })
        } else {
            $("#addKeyPpk").removeClass("is-invalid-label");
        }

        if (is(ppk, "FileList")) {
            for (var i in ppk) {
                var file = ppk[i];
                var fr = new FileReader();

                fr.onload = (function (file, fr) {
                    return function (event) {
                        AppController.identityController.addKey(fr.result, file.name.replace(".pem", ""), function () {
                            refreshIdentities(EcIdentityManager.ids);

                            AppController.loginController.loginServer.fetchServerAdminKeys(function (keys) {
                                for (var i = 0; i < EcIdentityManager.ids.length; i++) {
                                    if (keys.indexOf(EcIdentityManager.ids[i].ppk.toPk().toPem()) != -1) {
                                        AppController.loginController.setAdmin(true);
                                        ViewManager.getView("#menuContainer").checkAdmin()
                                    }
                                }
                            }, function () {

                            });

                            if (EcIdentityManager.ids.length == 1) {
                                AppController.identityController.select(EcIdentityManager.ids[0].ppk.toPem());
                            }

                            ModalManager.showModal(new SaveIdModal());

                            $("#addKeyPpk").replaceWith($("#addKeyPpk").val('').clone(true));

                            ViewManager.getView("#menuContainer").rebuildIdentityList();
                        });
                    }
                })(file, fr);

                if (is(file, "File"))
                    fr.readAsText(file);
            }
        } else {

        }
    }

    /**
     * Displays an error message
     * 
     * @memberOf UserIdentityScreen
     * @method refreshIdentities
     * @private
     * @param {String} error
     * 			Error message to display
     */
    function displayMessage(error, errorClass) {
    	ViewManager.getView("#userIdentityMessageContainer").displayAlert(error, errorClass);

    }

    /**
     * Hides any error messages
     * 
     * @memberOf UserIdentityScreen
     * @method refreshIdentities
     * @private
     */
    function hideMessage() {
    	ViewManager.getView("#userIdentityMessageContainer").clearAlert();
    }

    /**
     * Checks if the URL has a contact invitation in it and shows the
     * contact modal if so
     * 
     * @memberOf UserIdentityScreen
     * @method refreshIdentities
     * @private
     * @param {EcScreen} screen
     * 			Current screen, used to reload page
     * @param {String} containerId
     * 			Current screen container id, used to reload page
     */
    function checkNewContact(screen, containerId) {
        var hashSplit = window.document.location.hash.split("?");

        if (hashSplit.length > 1) {
            var firstParam = hashSplit[1];

            if (firstParam.startsWith("action")) {
                var paramSplit = firstParam.split("&");

                if (paramSplit.length == 6 && paramSplit[0].startsWith("action") && paramSplit[1].startsWith("contactDisplayName") &&
                    paramSplit[2].startsWith("contactKey") && paramSplit[3].startsWith("contactServer") &&
                    paramSplit[4].startsWith("responseToken") && paramSplit[5].startsWith("responseSignature")) {
                    var actionSplit = paramSplit[0].split("=");

                    if (actionSplit.length > 1 && actionSplit[1] == "newContact") {
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

                        ModalManager.showModal(new ContactGrantModal(c, responseToken, responseSignature, function () {
                            ModalManager.showModal(new SaveIdModal("You have added a contact"));
                        }));


                        ScreenManager.replaceHistory(screen, containerId, null);
                    }
                }
            }
        }
    }

    /**
     * Copys an inviation to the clipboard if possible
     * 
     * @memberOf UserIdentityScreen
     * @method copyInvitationText
     * @private
     */
    function copyInvitationText(){
    	if (document.selection) {
    		document.selection.empty();
            var range = document.body.createTextRange();
            range.moveToElementText(document.getElementById("invitationContainer"));
            range.select();
        } else if (window.getSelection) {
        	if (window.getSelection().empty) {  // Chrome
    		    window.getSelection().empty();
    		} else if (window.getSelection().removeAllRanges) {  // Firefox
    		    window.getSelection().removeAllRanges();
    		}
            var range = document.createRange();
            range.selectNode(document.getElementById("invitationContainer"));
            window.getSelection().addRange(range);
        }
        

        document.removeEventListener("copy",copyEvent,true);
        document.removeEventListener("copy",copyEvent,false);
         
        try {
        	var successful = document.execCommand('copy');
        	var msg = successful ? 'successful' : 'unsuccessful';
        	console.log('Copying text command was ' + msg);
          
	          if(successful){
	        	  $("#copyInvitation").find("#copy").css("display", "none");
	        	  $("#copyInvitation").find("#copied").css("display", "inline-block");
	        	  
	        	  $("#copyInvitation").find("#copied").fadeOut(1000, function(){
	        		  $("#copyInvitation").find("#copy").css("display", "inline-block");
	        	  })
	        	  ViewManager.getView("#invitationMessageContainer").displaySuccess("Succesfully Copied to Clipboard");
	        	  
	        	  setTimeout(function(){
	          		  ViewManager.getView("#invitationMessageContainer").clearSuccess();
	          	  }, 3000);
	          }else{
	        	  ViewManager.getView("#invitationMessageContainer").displayWarning("Unable to Copy to Clipboard")
	        	  ViewManager.getView("#invitationMessageContainer").clearSuccess();
	          }
        } catch (err) {
	          console.log('Oops, unable to copy');
	          ViewManager.getView("#invitationMessageContainer").displayWarning("Unable to Copy to Clipboard")
	          ViewManager.getView("#invitationMessageContainer").clearSuccess();
        }

        document.addEventListener("copy", copyEvent);
    }
    
    /**
     * Look in repository for any contact grants given by other users
     * 
     * @memberOf UserIdentityScreen
     * @method refreshIdentities
     * @private
     */
    function checkContactGrants() {
        AppController.serverController.getRepoInterface().search(new EcContactGrant().getSearchStringByType(), function (encryptedValue) {
            EcRepository.get(encryptedValue.shortId(), function (encryptedValue) {
                var ev = new EcEncryptedValue();
                ev.copyFrom(encryptedValue);
                var grant = ev.decryptIntoObject();
                if (grant != null) {
                    var g = new EcContactGrant();
                    g.copyFrom(grant);
                    if (g.valid())
                        ModalManager.showModal(new ContactAcceptModal(g, function () {
                            refreshContacts(EcIdentityManager.contacts);
                            ModalManager.showModal(new SaveIdModal("You have added a contact"));
                        }));
                }
            }, null);
        }, null, null);
    }

    /**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf UserIdentityScreen
	 * @method display
	 * @param containerId
	 * 			Screen Container DOM ID
	 */
    UserIdentityScreen.prototype.display = function (containerId) {
        var screen = this;

        ViewManager.showView(new MessageContainer("userIdentity"), "#userIdentityMessageContainer");
        ViewManager.showView(new MessageContainer("copyInvitation"), "#invitationMessageContainer");
        
        if (AppController.loginController.getLoggedIn()) {
            checkNewContact(screen, containerId);
            refreshContacts(EcIdentityManager.contacts);
            checkContactGrants();
        }

        refreshIdentities(EcIdentityManager.ids);


        $("#identityServerName").text(AppController.serverController.selectedServerName);
        $("#identityServerUrl").text(AppController.serverController.selectedServerUrl);

        $("#importIdentity").click(function (event) {
            event.preventDefault();

            $("#importContainer").removeClass("hide");
            $("#generateContainer").addClass("hide");
        });

        $("#startGenerateIdentity").click(function (event) {
            event.preventDefault();

            $("#generateContainer").removeClass("hide");
            $("#importContainer").addClass("hide");
        })

        $("#createImportIdentity").click(function (event) {
            event.preventDefault();

            activateKey($('#addKeyPpk')[0].files);
        });

        $("#generateIdentity").click(function () {
        	$("#generateInProgress").removeClass("hide");
        	$("#generateIdentity").addClass("hide");
        	
            var name = $("#generateIdentityName").val();
            AppController.identityController.generateIdentity(function (identity) {
                refreshIdentities(EcIdentityManager.ids);
                download(identity.displayName + '.pem', identity.ppk.toPem());
                ModalManager.showModal(new SaveIdModal("Your identities have changed"));
                $("#generateIdentity").removeClass("hide");
            	$("#generateInProgress").addClass("hide");
            }, name);
        });

        $("#openSaveModal").click(function () {
            ModalManager.showModal(new SaveIdModal());
        });

        $("#generateInvitation").click(function () {
            var input = $("#shareContactName").val();

            if (input == undefined || input == "") {

                return;
            }

            var identityPpk = EcPpk.fromPem($("#shareContactIdentity").val());
            if (identityPpk == undefined || identityPpk == "") {

                return;
            }

            var invitation = "Hi, I would like to add you as a contact in CASS.\n\nIf we are using the same CASS system, you may click the following link. If not, change the URL of my CASS server (" + window.location.href.split('/')[2] + ") to yours.\n\n"

            var iv = EcAes.newIv(32);
            var url = window.location + "?action=newContact&contactDisplayName=" + encodeURIComponent(input) + "&contactKey=" + encodeURIComponent(identityPpk.toPk().toPem()) + "&contactServer=" + encodeURIComponent(AppController.serverController.selectedServerUrl) + "&responseToken=" + encodeURIComponent(iv) + "&responseSignature=" + encodeURIComponent(EcRsaOaep.sign(identityPpk, iv));

            
            var string = invitation + url;
            
            invitation = invitation.replaceAll("Hi,", "Hi, <br/><br/>")
            
            $("#invitationBox").html(invitation);
            $("#linkBox").text(url);
            
            $("#invitationContainer").removeClass("hide")
            $("#invitationContainerHeader").removeClass("hide")
            $("#copyInvitation").removeClass("hide");
            
            $("#generateInvitation").text("Re-Generate")
            
            $("#invitationContainer").click(function(ev){
            	if($(ev.target).attr("id") != "invitationBox"){
            		copyInvitationText();
            	}
            })
            
            
            $("#copyInvitation").mousedown(function(){
            	copyInvitationText();
            });
            
            setTimeout(function(){
            	copyInvitationText();
            }, 100)
        });
    };

    UserIdentityScreen.prototype.refreshIdentities = function(ids){
        refreshIdentities(ids);
    }

    return UserIdentityScreen;
})(UserIdentityScreen);
