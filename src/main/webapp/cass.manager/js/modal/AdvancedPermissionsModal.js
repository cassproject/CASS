var AdvancedPermissionsModal = (function(AdvancedPermissionsModal){
	
	function addOwner(contact){
		$('#advancedPermissionsAddOwner').typeahead('val', "");
		
		var pk;
		if(contact.pk != undefined)
			pk = contact.pk;
		else
			pk = contact.ppk.toPk();

		if($("#advancedPermissionsOwners option").size() == 1){
			$("#noOwners").addClass("hide");
			$("#advancedPermissionsOwners").removeClass("empty");
			$("#advancedPermissionsOwners").removeAttr("disabled");
		}
		
		var option = $("<option value='"+pk.toPem()+"'>"+contact.displayName+"</option>");
		$("#advancedPermissionsOwners").append(option);
	}
	
	function addReader(contact){
		$('#advancedPermissionsAddReader').typeahead('val', "");
		
		var pk;
		if(contact.pk != undefined)
			pk = contact.pk;
		else
			pk = contact.ppk.toPk();

		if($("#advancedPermissionsReaders option").size() == 1){
			$("#noReaders").addClass("hide");
			$("#advancedPermissionsReaders").removeClass("empty");
			$("#advancedPermissionsReaders").removeAttr("disabled");
		}
		
		var option = $("<option value='"+pk.toPem()+"'>"+contact.displayName+"</option>");
		$("#advancedPermissionsReaders").append(option);
	}
	
	function setupTypeaheads(data){
		$("#advancedPermissionsAddOwner").typeahead({
	  		hint: false,
	  		highlight: true,
	  		minLength: 2,
		},
		{
	  		name: 'contacts',
	  		source: function(q, syncCallback, asyncCallback){
	  			var knownUsers = [];
	  			
	  			for(var i in EcIdentityManager.ids)
	  				knownUsers.push(EcIdentityManager.ids[i])
	  				
	  			for(var i in EcIdentityManager.contacts)
	  				knownUsers.push(EcIdentityManager.contacts[i])
	  			
	  			for(var i = 0; i < knownUsers.length; i++){
	  				var pk;
	  				if(knownUsers[i].pk != undefined)
	  					pk = knownUsers[i].pk;
	  				else
	  					pk = knownUsers[i].ppk.toPk();
	  				
	  				var keys = $("#advancedPermissionsOwners option").map(function(i, el){
	  					return $(el).attr('value');
	  				});
	  				if(keys.toArray().indexOf(pk.toPem()) != -1 || knownUsers[i].source == undefined){
	  					knownUsers.splice(i, 1);
	  					i--;
	  					continue;
	  				}
	  				
	  				var keys = $("#advancedPermissionsReaders option").map(function(i, el){
	  					return $(el).attr('value');
	  				});
	  				if(keys.toArray().indexOf(pk.toPem()) != -1 || knownUsers[i].source == undefined){
	  					knownUsers.splice(i, 1);
	  					i--;
	  				}
	  			}
	  				
	  			syncCallback(knownUsers);
			},
			async:false,
	  		display: function(data){ return data["displayName"]; },
	  		templates:{
	  			suggestion:function(data){ return "<div>" + data["displayName"] + "</div>"; },
	  			notFound:function(){
	  				return "<div style='text-align:center'>No Identies or Contacts Found</div>";
	  			}
	  		}
		}).bind("typeahead:selected", function(ev, contact){
			addOwner(contact);
			
			var owners = $("#advancedPermissionsOwners option").map(function(i, el){
				if($(el).attr('value') != undefined)
					return $(el).attr('value');
			}).toArray();
			
			var temp = new EcRemoteLinkedData();
			temp.owner = [];
			for(var j in owners){
				temp.addOwner(EcPk.fromPem(owners[j]));
			}
			
			if(!AppController.identityController.canEdit(temp)){
				ViewManager.getView("#advancedPermissionsMessageContainer").displayWarning("This will prevent further modifications by you, as you no longer own the object(s)", "lostOwnership");
			}else{
				ViewManager.getView("#advancedPermissionsMessageContainer").clearWarning("lostOwnership");
			}
			
			ViewManager.getView("#advancedPermissionsMessageContainer").clearWarning("public");
		}).bind("typeahead:autocompleted", function(ev, contact){
			addOwner(contact);
			
			var owners = $("#advancedPermissionsOwners option").map(function(i, el){
				if($(el).attr('value') != undefined)
					return $(el).attr('value');
			}).toArray();
		
			var temp = new EcRemoteLinkedData();
			temp.owner = [];
			for(var j in owners){
				temp.addOwner(EcPk.fromPem(owners[j]));
			}
			
			if(!AppController.identityController.canEdit(temp)){
				ViewManager.getView("#advancedPermissionsMessageContainer").displayWarning("This will prevent further modifications by you, as you no longer own the object(s)", "lostOwnership");
			}else{
				ViewManager.getView("#advancedPermissionsMessageContainer").clearWarning("lostOwnership");
			}
			
			ViewManager.getView("#advancedPermissionsMessageContainer").clearWarning("public");
		});
		
		$("#advancedPermissionsAddReader").typeahead({
	  		hint: false,
	  		highlight: true,
	  		minLength: 2,
		},
		{
	  		name: 'contacts',
	  		source: function(q, syncCallback, asyncCallback){
	  			var knownUsers = [];
	  			
	  			for(var i in EcIdentityManager.ids)
	  				knownUsers.push(EcIdentityManager.ids[i])
	  				
	  			for(var i in EcIdentityManager.contacts)
	  				knownUsers.push(EcIdentityManager.contacts[i])
	  			
	  			for(var i = 0; i < knownUsers.length; i++){
	  				var pk;
	  				if(knownUsers[i].pk != undefined)
	  					pk = knownUsers[i].pk;
	  				else
	  					pk = knownUsers[i].ppk.toPk();
	  				
	  				var keys = $("#advancedPermissionsOwners option").map(function(i, el){
	  					return $(el).attr('value');
	  				});
	  				if(keys.toArray().indexOf(pk.toPem()) != -1 || knownUsers[i].source == undefined){
	  					knownUsers.splice(i, 1);
	  					i--;
	  					continue;
	  				}
	  				
	  				var keys = $("#advancedPermissionsReaders option").map(function(i, el){
	  					return $(el).attr('value');
	  				});
	  				if(keys.toArray().indexOf(pk.toPem()) != -1 || knownUsers[i].source == undefined){
	  					knownUsers.splice(i, 1);
	  					i--;
	  				}
	  			}
	  				
	  			syncCallback(knownUsers);
			},
			async:false,
	  		display: function(data){ return data["displayName"]; },
	  		templates:{
	  			suggestion:function(data){ return "<div>" + data["displayName"] + "</div>"; },
	  			notFound:function(){
	  				return "<div style='text-align:center'>No Identies or Contacts Found</div>";
	  			}
	  		}
		}).bind("typeahead:selected", function(ev, contact){
			addReader(contact);
		}).bind("typeahead:autocompleted", function(ev, contact){
			addReader(contact);
		});
	}
	
	AdvancedPermissionsModal.prototype.display = function(containerId, callback)
	{
		var data = this.data;
		
		var saveCallback = this.saveCallback;
		
		var onlyReaders = this.onlyReaders;
		
		$(containerId).load("partial/modal/advancedPermissions.html", function(){
			var alerts = {};
			var warnings = {};
			ViewManager.showView(new MessageContainer("advancedPermissions"), "#advancedPermissionsMessageContainer", function(){
				for(var id in alerts){
					ViewManager.getView("#advancedPermissionsMessageContainer").displayAlert(alerts[id], id);
				}
				for(var id in warnings){
					ViewManager.getView("#advancedPermissionsMessageContainer").displayWarning(warnings[id], id);
				}
			});
			
			
			var canSave = true;
			if(data instanceof Array){
				warnings[0] = "Modifying multiple resources, all resources will have the same permissions if saved";
				ViewManager.getView("#advancedPermissionsMessageContainer").displayWarning("Modifying multiple resources, all resources will have the same permissions if saved");
				for(var i in data){
					if(data[i].owner == undefined){
						alerts["public"] = "One or more objects is public, Cannot Modify Permissions";
						ViewManager.getView("#advancedPermissionsMessageContainer").displayAlert("One or more objects is public, Cannot Modify Permissions", "public");
						canSave = false;
					}else if(!AppController.identityController.owns(data[i])){
						alerts["notOwned"] = "One or more objects not owned by you, Cannot Modify Permissions";
						ViewManager.getView("#advancedPermissionsMessageContainer").displayAlert("One or more objects not owned by you, Cannot Modify Permissions", "notOwned");
						canSave = false;
					}
					
					if(data[i].type == EcEncryptedValue.type){
						warnings["decrypt"] = "May be decrypting an object by setting all public";
						ViewManager.getView("#advancedPermissionsMessageContainer").displayWarning("May be decrypting an object by setting all public", "decrypt");
					}
				}
			}else{
				if(data.owner == undefined){
					alerts["public"] = "Cannot Modify Permissions of Public Object";
					ViewManager.getView("#advancedPermissionsMessageContainer").displayAlert("Cannot Modify Permissions of Public Object", "public");
					$("#noOwners").removeClass("public");
					$("#advancedPermissionsOwners").addClass("empty")
					canSave = false;
				}else if(!AppController.identityController.owns(data)){
					alerts["notOwned"] = "Cannot Modify Permissions of Object not owned by you";
					ViewManager.getView("#advancedPermissionsMessageContainer").displayAlert("Cannot Modify Permissions of Object not owned by you", "notOwned");
					canSave = false;
				}
			}
			if(!canSave){
				$("#advancedPermissionsSave").attr("disabled", "disabled");
				$("#privateSwitch").attr("disabled", "disabled");
				$("#advancedPermissionsOwners").attr("disabled", "disabled");
				$("#advancedPermissionsReaders").attr("disabled", "disabled");
			}else{
				
				if(!onlyReaders){
					$("#privateSwitch").change(function(){
						if($("#advancedPermissionsOwners option").size() == 1 && $("#advancedPermissionsOwners").attr("disabled") == "disabled"){
							$("#privateSwitch").prop("checked", false)
							ViewManager.getView("#advancedPermissionsMessageContainer").displayAlert("Cannot encrypt a publicly owned object", "publicPrivate");
							return;
						}
						
						$("#readerRow").slideToggle();
						
						if(data instanceof Array){
							if(!$("#privateSwitch").prop("checked")){
								ViewManager.getView("#advancedPermissionsMessageContainer").displayWarning("May be decrypting an object by setting all public", "decrypt");
							}else{
								ViewManager.getView("#advancedPermissionsMessageContainer").clearWarning("decrypt");
							}
						}else if(data.privateEncrypted && !$("#privateSwitch").prop("checked")){
							ViewManager.getView("#advancedPermissionsMessageContainer").displayWarning("Decrypting object by setting it public", "decrypt");
						}else{
							ViewManager.getView("#advancedPermissionsMessageContainer").clearWarning("decrypt");
						}
					});
				}else{
					$("#advancedPermissionsAddOwner").prop("disabled", "disabled");
					$("#advancedPermissionsOwners").prop("disabled", "disabled");
					$("#privateSwitch").prop("checked", true)
					$("#privateSwitch").prop("disabled", "disabled")
					
					$("#ownerRow").addClass("hide");
					$("#privacyRow").addClass("hide");
					
					if(!$("#readerRow").is(":visible"))
						$("#readerRow").slideDown();
				}
				
				
				if(data instanceof Array){
					if(AppController.identityController.selectedIdentity != undefined){
						var option = $("<option value='"+AppController.identityController.selectedIdentity.ppk.toPk().toPem()+"' title='"+AppController.identityController.selectedIdentity.ppk.toPk().toPem()+"'>"+
								AppController.identityController.selectedIdentity.displayName +
							"</option>");
			
						$("#advancedPermissionsOwners").append(option);
					}else{
						$("#noOwners").removeClass("hide");
						$("#advancedPermissionsOwners").attr("disabled", "disabled");
						$("#advancedPermissionsOwners").addClass("empty");
					}
				}else{
					for(var i in data.owner){
						var option = $("<option value='"+data.owner[i]+"' title='"+data.owner[i]+"'>"+
								AppController.identityController.lookup(data.owner[i]).displayName +
							"</option>");
			
						$("#advancedPermissionsOwners").append(option);
					}
					
					for(var i in data.reader){
						var option = $("<option value='"+data.reader[i]+"' title='"+data.reader[i]+"'>"+
								AppController.identityController.lookup(data.reader[i]).displayName +
							"</option>");
			
						$("#advancedPermissionsReaders").append(option);
						
						$("#noReaders").addClass("hide");
						$("#advancedPermissionsReaders").removeAttr("disabled");
						$("#advancedPermissionsReaders").removeClass("empty");
					}
				}
				
				if(data.privateEncrypted == true){
					$("#privateSwitch").prop("checked", true);
					$("#readerRow").css('display',"block");
				}
				
				$("#advancedPermissionsOwners").focus(function(){
					$("#advancedPermissionsOwners").css("margin-bottom", "0px");
					$("#advancedPermissionsDeleteOwner").slideDown();
					
					$("#advancedPermissionsOwners").blur(function(){
						$("#advancedPermissionsDeleteOwner").slideUp(function(){
							$("#advancedPermissionsOwners").removeAttr("style");
						});
					})
				});
				
				$("#advancedPermissionsDeleteOwner").click(function(){
					$("#advancedPermissionsOwners option[value='"+$("#advancedPermissionsOwners").val()+"']").remove();
					if($("#advancedPermissionsOwners option").size() == 1){
						$("#noOwners").removeClass("hide")
						$("#advancedPermissionsOwners").attr("disabled", "disabled");
						$("#advancedPermissionsOwners").addClass("empty");
						
						ViewManager.getView("#advancedPermissionsMessageContainer").displayWarning("Public objects will not allow futher modifications of permissions", "public");
					}else{
						ViewManager.getView("#advancedPermissionsMessageContainer").clearWarning("public");
						
						var owners = $("#advancedPermissionsOwners option").map(function(i, el){
		  					if($(el).attr('value') != undefined)
		  						return $(el).attr('value');
		  				}).toArray();
						
						var temp = new EcRemoteLinkedData();
						temp.owner = [];
						for(var j in owners){
							temp.addOwner(EcPk.fromPem(owners[j]));
						}
						
						if(!AppController.identityController.canEdit(temp)){
							ViewManager.getView("#advancedPermissionsMessageContainer").displayWarning("This will prevent further modifications by you, as you no longer own the object(s)", "lostOwnership");
						}else{
							ViewManager.getView("#advancedPermissionsMessageContainer").clearWarning("lostOwnership");
						}
					}
				});
				
				$("#advancedPermissionsReaders").focus(function(){
					$("#advancedPermissionsReaders").css("margin-bottom", "0px");
					$("#advancedPermissionsDeleteReader").slideDown();
					
					$("#advancedPermissionsReaders").blur(function(){
						$("#advancedPermissionsDeleteReader").slideUp(function(){
							$("#advancedPermissionsReaders").removeAttr("style");
						});
					})
				});
				
				$("#advancedPermissionsDeleteReader").click(function(){
					$("#advancedPermissionsReaders option[value='"+$("#advancedPermissionsReaders").val()+"']").remove();
					if($("#advancedPermissionsReaders option").size() == 1){
						$("#noReaders").removeClass("hide")
						$("#advancedPermissionsReaders").attr("disabled", "disabled");
						$("#advancedPermissionsReaders").addClass("empty");
					}
				});
				
				setupTypeaheads(data);
				
				$("#advancedPermissionsSave").click(function(ev){
					ev.preventDefault();
					
					var owners = $("#advancedPermissionsOwners option").map(function(i, el){
	  					if($(el).attr('value') != undefined)
	  						return $(el).attr('value');
	  				}).toArray();
					
					var readers = $("#advancedPermissionsReaders option").map(function(i, el){
	  					if($(el).attr('value') != undefined)
	  						return $(el).attr('value');
	  				}).toArray();
					
					if(data instanceof Array){
						for(var i in data){
							data[i].owner = [];
							for(var j in owners){
								if(!onlyReaders)
									data[i].addOwner(EcPk.fromPem(owners[j]));
							}
							
							data[i].reader = [];
							for(var j in readers){
								data[i].addReader(EcPk.fromPem(readers[j]))
							}
							
							if(!onlyReaders)
								data[i].privateEncrypted = $("#privateSwitch").prop("checked");
						}
					}else{
						data.owner = [];
						for(var j in owners){
							if(!onlyReaders)
								data.addOwner(EcPk.fromPem(owners[j]));
						}
						
						data.reader = [];
						for(var j in readers){
							data.addReader(EcPk.fromPem(readers[j]))
						}
						
						if(!onlyReaders)
							data.privateEncrypted = $("#privateSwitch").prop("checked");
					}
					
					saveCallback(data);
				});				
			}
			
			
			$("#advancedPermissionsCancel").click(function(){				
				ModalManager.hideModal();
				if(data.isAny(new EcLevel().getTypes())){
					saveCallback(data);
				}
			})
			
			if(callback != undefined)
				callback();
		});
	}
	
	return AdvancedPermissionsModal;
})(AdvancedPermissionsModal);