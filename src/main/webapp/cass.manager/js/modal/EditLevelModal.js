/**
 * Form for editing level details
 * 
 * @module cass.manager
 * @class EditLevelModal
 * 
 * @author devlin.junker@eduworks.com
 */
var EditLevelModal = (function(EditLevelModal){	
	
	/**
	 * Displays errors if they occur when trying to save level
	 * 
	 * @memberOf EditLevelModal
	 * @method saveLevelFail
	 * @private
	 * @param {String} err
	 * 			Error to display 
	 */
	function saveLevelFail(err){
		if(err == undefined)
			err = "Unable to Connect to Server to Save Level";
		
		ViewManager.getView("#editLevelError").displayAlert(err);
	}
	
	/**
	 * Displays errors if they occur during deleting the level
	 * 
	 * @memberOf EditLevelModal
	 * @method errorDeleting
	 * @private
	 * @param {String} err
	 * 			Error to display 
	 */
	function errorDeleting(err){
		if(err == undefined)
			err = "Unable to Connect to Server to Delete Level";
		
		ViewManager.getView("#editLevelError").displayAlert(err);
	}
	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf EditLevelModal
	 * @method display
	 * @param {String} containerId
	 * 			The DOM ID of the Modal Container this modal is displayed in
	 */
	EditLevelModal.prototype.display = function(containerId)
	{
		var data = this.data;
		var modalCloseCallback = this.closeCallback;
		
			
		ViewManager.showView(new MessageContainer("editLevel"), "#editLevelError", function(){
			if(AppController.identityController.selectedIdentity == undefined && data.isAny(new EcCompetency().getTypes()))
			{
				ViewManager.getView("#editLevelError").displayWarning("You are Creating a Public Level, this level can be modified by anyone");
			}
		});
		
		$("#editLevelCancel").click(function(event){
			event.preventDefault();
			ModalManager.hideModal();
		});
		
		if(data.isAny(new EcCompetency().getTypes()))
		{
			if(AppController.identityController.selectedIdentity != undefined)
			{
				$("#editLevelOwnership").text("");
				
				var pem = AppController.identityController.selectedIdentity.ppk.toPk().toPem()
				
				ViewManager.showView(new IdentityDisplay(pem), "#editLevelOwnership");
	    		
	    		$("#editLevelAdvancedOwnership").removeClass("hide");
				$("#editLevelAdvancedOwnership").click(function(ev){
					var level = new EcLevel();
					level.name = $("#editLevelName").val();
					level.title = $("#editLevelTitle").val();
					level.description = $("#editLevelDescription").val();
					level.performance = $("#editLevelPerformance").val();
					
					var owners = $("#editLevelOwnership").children("span").map(function(idx, el){
						return $(el).find(".contactText").attr("title");
					})
					
					for(var i = 0; i < owners.length; i++){
						level.addOwner(EcPk.fromPem(owners[i]))
					}
					
					if(!$("#editLevelVisibilityRow").hasClass("hide")){
						EcEncryptedValue.encryptOnSave(level.id, true);
						var readers = $("#editLevelReaders").children().map(function(idx, el){
							return $(el).find(".contactText").attr("title");
						})
						
						for(var i = 0; i < readers.length; i++){
							level.addReader(EcPk.fromPem(readers[i]))
						}
					}

					ModalManager.showModal(new AdvancedPermissionsModal(level, function(permissionedLevel){
						ModalManager.showModal(new EditLevelModal(data, modalCloseCallback), function(){
							$("#editLevelName").val(permissionedLevel.name);
							$("#editLevelTitle").val(permissionedLevel.title);
							$("#editLevelDescription").val(permissionedLevel.description);
							$("#editLevelPerformance").val(permissionedLevel.performance);
							
							if(permissionedLevel.owner != undefined && permissionedLevel.owner.length > 0)
							{
								$("#editLevelOwnership").text("");
								
								for(var i = 0; i < permissionedLevel.owner.length; i++)
								{	
									if(i > 0)
						    			$("#editLevelOwnership").append(", ");
									
									var pem = permissionedLevel.owner[i];

									$("#editLevelOwnership").append("<span id='level-owner-"+i+"'></span>");
									
									ViewManager.showView(new IdentityDisplay(pem), "#level-owner-"+i);
									
								}
							}else{
								$("#editLevelOwnership").text("Public");
							}
							
							if(EcEncryptedValue.encryptOnSave(permissionedLevel.id)){
								$("#editLevelVisibilityRow").removeClass("hide");
								$("#editLevelReadersRow").removeClass("hide");
								
								if(permissionedLevel.reader != undefined && permissionedLevel.reader.length > 0)
								{
									$("#editLevelReaders").text("");
									$("#editLevelReaders").css("font-style", "normal");
									
									for(var i = 0; i < permissionedLevel.reader.length; i++)
									{	
										if(i > 0)
							    			$("#editLevelReaders").append(", ");
										
										var pem = permissionedLevel.reader[i];
										
										$("#editLevelReaders").append("<span id='level-reader-"+i+"'></span>");
										
										ViewManager.showView(new IdentityDisplay(pem), "#level-reader-"+i);   
									}
								}else{
									$("#editLevelReaders").text("None Added Yet");
								}
							}else{
								$("#editLevelVisibilityRow").addClass("hide");
								$("#editLevelReadersRow").addClass("hide");
								
							}
						})
					}))
				});
			}
			
			
			$("#editLevelDelete").remove();
			
			$("#editLevelSubmit").click(function(event){
				event.preventDefault();
				
				var level = new EcLevel();
				if(AppController.identityController.selectedIdentity != undefined){
					level.addOwner(AppController.identityController.selectedIdentity.ppk.toPk());
				}
				level.generateId(AppController.serverController.selectedServerUrl)
				level.name = $("#editLevelName").val();
				level.title = $("#editLevelTitle").val();
				level.description = $("#editLevelDescription").val();
				level.performance = $("#editLevelPerformance").val();
				level.competency = data.shortId();
				
				var owners = $("#editLevelOwnership").children("span").map(function(idx, el){
					return $(el).find(".contactText").attr("title");
				})
				
				for(var i = 0; i < owners.length; i++){
					level.addOwner(EcPk.fromPem(owners[i]))
				}
				
				if(!$("#editLevelVisibilityRow").hasClass("hide")){
					EcEncryptedValue.encryptOnSave(level.id, true);
					var readers = $("#editLevelReaders").children().map(function(idx, el){
						return $(el).find(".contactText").attr("title");
					})
					
					for(var i = 0; i < readers.length; i++){
						level.addReader(EcPk.fromPem(readers[i]))
					}
				}
				
				if(level.name == undefined || level.name == ""){
					ViewManager.getView("#editLevelError").displayAlert("Level Requires a Name to be Saved");
					return;
				}
				
				level.save(function(){
					if(modalCloseCallback != undefined)
						modalCloseCallback(level);
					
					ModalManager.hideModal();
				}, saveLevelFail);
			})
		}
		else if(data.isAny(new EcLevel().getTypes()))
		{
			$("#editLevelDelete").removeClass("hide");
			
			$("#editLevelSubmit").text("Save");
			
			$("#editLevelName").val(data.name);
			$("#editLevelTitle").val(data.title);
			$("#editLevelDescription").val(data.description);
			$("#editLevelPerformance").val(data.performance);
			
			if(EcEncryptedValue.encryptOnSave(data.id)){
				$("#editLevelVisibilityRow").removeClass("hide");
				$("#editLevelReadersRow").removeClass("hide");
				
				if(data.reader != undefined && data.reader.length > 0)
				{
					$("#editLevelReaders").text("");
					$("#editLevelReaders").css("font-style", "normal");
					
					for(var i = 0; i < data.reader.length; i++)
					{	
						if(i > 0)
			    			$("#editLevelReaders").append(", ");
						
						var pem = data.reader[i];
						
						$("#editLevelReaders").append("<span id='level-reader-"+i+"'></span>");
						
						ViewManager.showView(new IdentityDisplay(pem), "#level-reader-"+i);    
					}
				}else{
					$("#editLevelReaders").text("None Added Yet");
				}
			}
			
			if(data.owner != undefined && data.owner.length > 0)
			{
				$("#editLevelOwnership").text("");
				
				for(var i = 0; i < data.owner.length; i++)
				{
					if(i > 0)
		    			$("#editLevelOwnership").append(", ");
					
					var pem = data.owner[i];
					
					$("#editLevelOwnership").append("<span id='level-owner-"+i+"'></span>");
					
					ViewManager.showView(new IdentityDisplay(pem), "#level-owner-"+i);
				}
			}
			
			var canEdit = false;
			for(var index in EcIdentityManager.ids){
				var pk = EcIdentityManager.ids[index].ppk.toPk()
				if(data.canEdit(pk))
					canEdit = true;
			}
			if(data.owner == undefined || data.owner.length == 0)
				canEdit = true;
			
			if(canEdit)
			{
				if(data.owner != undefined){
					$("#editLevelAdvancedOwnership").removeClass("hide");
					$("#editLevelAdvancedOwnership").click(function(ev){
						data.name = $("#editLevelName").val();
						data.title = $("#editLevelTitle").val();
						data.description = $("#editLevelDescription").val();
						data.performance = $("#editLevelPerformance").val();
						
						var owners = $("#editLevelOwnership").children("span").map(function(idx, el){
							return $(el).find(".contactText").attr("title");
						})
						
						for(var i = 0; i < owners.length; i++){
							data.addOwner(EcPk.fromPem(owners[i]))
						}
						
						if(!$("#editLevelVisibilityRow").hasClass("hide")){
							EcEncryptedValue.encryptOnSave(data.id, true);
							var readers = $("#editLevelReaders").children().map(function(idx, el){
								return $(el).find(".contactText").attr("title");
							})
							
							for(var i = 0; i < readers.length; i++){
								data.addReader(EcPk.fromPem(readers[i]))
							}
						}
						
						ModalManager.showModal(new AdvancedPermissionsModal(data, function(permissionedLevel){
							if(EcEncryptedValue.encryptOnSave(permissionedLevel.id)){
								$("#editLevelVisibilityRow").removeClass("hide");
								$("#editLevelReadersRow").removeClass("hide");
								
								if(permissionedLevel.reader != undefined && permissionedLevel.reader.length > 0)
								{
									$("#editLevelReaders").text("");
									$("#editLevelReaders").css("font-style", "normal");
									
									for(var i = 0; i < permissionedLevel.reader.length; i++)
									{	
										if(i > 0)
											$("#editLevelReaders").append(", ");
										
										var pem = permissionedLevel.reader[i];

										$("#editLevelReaders").append("<span id='level-reader-"+i+"'></span>");
										
										ViewManager.showView(new IdentityDisplay(pem), "#level-reader-"+i);  
									}
								}else{
									$("#editLevelReaders").text("None Added Yet");
								}
							}else{
								$("#editLevelVisibilityRow").addClass("hide");
								$("#editLevelReadersRow").addClass("hide");
								
							}
							
							ModalManager.showModal(new EditLevelModal(permissionedLevel, modalCloseCallback))
						}));
					});
				}
				
				$("#editLevelModalTitle").text("Edit Level");
				
				$("#editLevelSubmit").click(function(event){
					event.preventDefault();
					
					data.name = $("#editLevelName").val();
					data.title = $("#editLevelTitle").val();
					data.description = $("#editLevelDescription").val();
					data.performance = $("#editLevelPerformance").val();
					
					var owners = $("#editLevelOwnership").children("span").map(function(idx, el){
						return $(el).find(".contactText").attr("title");
					})
					
					for(var i = 0; i < owners.length; i++){
						data.addOwner(EcPk.fromPem(owners[i]))
					}
					
					if(!$("#editLevelVisibilityRow").hasClass("hide")){
						EcEncryptedValue.encryptOnSave(data.id, true);
						var readers = $("#editLevelReaders").children().map(function(idx, el){
							return $(el).find(".contactText").attr("title");
						})
						
						for(var i = 0; i < readers.length; i++){
							data.addReader(EcPk.fromPem(readers[i]))
						}
					}
					
					if(data.name == undefined || data.name == ""){
						ViewManager.getView("#editLevelError").displayAlert("Level Requires a Name to be Saved");
						return;
					}
					
					var url = data.id;
					var split = url.split("\/");
					if (split[split.length-4] == "data") 
						split[split.length-1] = new Date().getTime();
					data.id = split.join("/");
					
					data.save(function(level){
						if(modalCloseCallback != undefined)
							modalCloseCallback(data);
						
						ModalManager.hideModal();
					}, saveLevelFail);
				});
				
				$("#editLevelDelete").click(function(event){
					event.preventDefault();
					
					EcRepository._delete(data, function(){
						if(modalCloseCallback != undefined)
							modalCloseCallback(null);
						ModalManager.hideModal();
					}, errorDeleting);
				})
			}
			else
			{
				$("#editLevelModalTitle").text("View Level");
				
				$("#editLevelDelete").remove();
				$("#editLevelSubmit").remove();
				$("#editLevelCancel").remove();
				
				$("#editLevelName").attr("disabled", "disabled");
				$("#editLevelTitle").attr("disabled", "disabled");
				$("#editLevelDescription").attr("disabled", "disabled");
				$("#editLevelPerformance").attr("disabled", "disabled");
			}
		}
		else
		{
			ViewManager.getView("#editLevelError").displayAlert("Unrecognized Context For Level Modal");
			$("#editLevelName").attr("disabled", "disabled");
			$("#editLevelTitle").attr("disabled", "disabled");
			$("#editLevelDescription").attr("disabled", "disabled");
			$("#editLevelPerformance").attr("disabled", "disabled");
			
			$("#editLevelSubmit").click(function(event){
				event.preventDefault();
			});
		}
	}
	
	return EditLevelModal;
})(EditLevelModal);