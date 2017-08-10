/**
 * Modal used to propagate permissions down the child objects in another object
 * 
 * @module cass.manager
 * @class PermissionPropagationModal
 * 
 * @author devlin.junker@eduworks.com
 */
var PermissionPropagationModal = (function(PermissionPropagationModal){	
	
	/**
	 * Displays the objects of the framework that will be changed and any
	 * issues with trying to propagate the permissions
	 * 
	 * @memberOf PermissionPropagationModal
	 * @method setupFrameworkDisplay
	 * @private
	 * @param {EcFramework} data
	 * 			EcFramework to propagate permissions from 
	 */
	function setupFrameworkDisplay(framework){
		var closeModal = true;
		
		var div = $("<div class='row columns'></div>");
		
		div.append("<div id='resultsList' class='row' style='border: 1px solid lightgrey; overflow-y:scroll;padding:0.3rem;height:8rem;'></div>")
		
		$("#propagateResultsDisplay").append(div);
		
		if(framework.competency != undefined && framework.competency.length > 0){
			$("#resultsList").append("<div id='competencyOptGroup' class='small-12 columns'><span class='prefix'>Competencies</span></div>");
			for(var idx in framework.competency){
				closeModal = false;
				EcCompetency.get(framework.competency[idx], function(data){
					var display = $("<div class='row'></div>")
				
					var col1 = $("<div class='small-1 columns'></div>");
					
					if(AppController.identityController.owns(data)){
						col1.prepend("<i class='fa fa-check' style='color:lightgreen;margin-top:0.25rem;'></i>");
						display.attr("title", "Permissions will be changed to match")
					}else if(AppController.identityController.canEdit(data)){
						col1.prepend("<i class='fa fa-minus' style='color:lightblue;margin-top:0.25rem;'></i>")
						display.attr("title", "Publicly owned, permissions will remain unchanged, but still editable by anyone")
						
						ViewManager.getView("#propagateMessageContainer").displayPrimary("One or more of the objects contained is publicly owned and permissions will not be affected", "publicObject");
					}else{
						col1.prepend("<i class='fa fa-times' style='color:red;margin-top:0.25rem;'></i>")
						display.attr("title", "Not owned by you, cannot change permissions")
						
						ViewManager.getView("#propagateMessageContainer").displayAlert("You are not allowed to modify the permissions on one or more of the objects contained", "noPropagation");
					}
					display.append(col1);
					
					var col2 = $("<div class='small-11 columns'></div>");
					col2.text(data.name);
					display.append(col2);
					
					$("#competencyOptGroup").append(display)
				}, function(err){
					displayAlert(err);
				});
			}
		}
		
		if(framework.relation != undefined && framework.relation.length > 0){
			$("#resultsList").append("<div id='relationsOptGroup' class='small-12 columns'><span class='prefix'>Relationships</span></div>");
			
			for(var idx in framework.relation){
				closeModal = false;
				EcAlignment.get(framework.relation[idx], function(data){
					EcCompetency.get(data.source, function(source){
						EcCompetency.get(data.target, function(target){
							var display = $("<div class='row'></div>")
							
							var col1 = $("<div class='small-1 columns'></div>");
							
							if(AppController.identityController.owns(data)){
								col1.prepend("<i class='fa fa-check' style='color:lightgreen;margin-top:0.25rem;'></i>");
								display.attr("title", "Permissions will be changed to match")
							}else if(AppController.identityController.canEdit(data)){
								col1.prepend("<i class='fa fa-minus' style='color:lightblue;margin-top:0.25rem;'></i>")
								display.attr("title", "Publicly owned, permissions will remain unchanged, but still editable by anyone")
								
								ViewManager.getView("#propagateMessageContainer").displayPrimary("One or more of the objects contained is publicly owned and permissions will not be affected", "publicObject");
							}else{
								col1.prepend("<i class='fa fa-times' style='color:red;margin-top:0.25rem;'></i>")
								display.attr("title", "Not owned by you, cannot change permissions")
								
								ViewManager.getView("#propagateMessageContainer").displayAlert("You are not allowed to modify the permissions on one or more of the objects contained", "noPropagation");
							}
							display.append(col1);
							
							
							var typeDisplay = AppSettings.relationTypes[data.relationType];
							if(typeDisplay == undefined){
								typeDisplay = data.relationType.split(/(?=[A-Z])/).join(" ");
							}
							
							var col2 = $("<div class='small-11 columns'></div>");
							col2.text(source.name+" "+typeDisplay+" "+target.name);
							display.append(col2);
							
							$("#relationsOptGroup").append(display)
						}, function(err){
							displayAlert(err)
						});
					}, function(err){
						displayAlert(err)
					});
					
				}, function(err){
					displayAlert(err);
				});
			}
		}
		
		if(framework.level != undefined && framework.level.length > 0){
			$("#resultsList").append("<div id='levelsOptGroup' class='small-12 columns'><span class='prefix'>Levels</span></div>");
			
			for(var idx in framework.level){
				closeModal = false;
				EcLevel.get(framework.level[idx], function(data){
					EcCompetency.get(data.competency, function(comp){
						var display = $("<div class='row'></div>")
						
						var col1 = $("<div class='small-1 columns'></div>");
						
						if(AppController.identityController.owns(data)){
							col1.prepend("<i class='fa fa-check' style='color:lightgreen;margin-top:0.25rem;'></i>");
							display.attr("title", "Permissions will be changed to match")
						}else if(AppController.identityController.canEdit(data)){
							col1.prepend("<i class='fa fa-minus' style='color:lightblue;margin-top:0.25rem;'></i>")
							display.attr("title", "Publicly owned, permissions will remain unchanged, but still editable by anyone")
							
							ViewManager.getView("#propagateMessageContainer").displayPrimary("One or more of the objects contained is publicly owned and permissions will not be affected", "publicObject");
						}else{
							col1.prepend("<i class='fa fa-times' style='color:red;margin-top:0.25rem;'></i>")
							display.attr("title", "Not owned by you, cannot change permissions")
							
							ViewManager.getView("#propagateMessageContainer").displayAlert("You are not allowed to modify the permissions on one or more of the objects contained", "noPropagation");
						}
						display.append(col1);
						
						var col2 = $("<div class='small-11 columns'></div>");
						col2.text(comp.name +" : "+data.name)
						display.append(col2);
						
						$("#levelsOptGroup").append(display)
					}, function(err){
						displayAlert(err);
					})
				}, function(err){
					displayAlert(err);
				});
			}
		}
		
		if(framework.rollupRule != undefined && framework.rollupRule.length > 0){
			$("#resultsList").append("<div id='rulesOptGroup' class='small-12 columns'><span class='prefix'>Rollup Rules</span></div>");
			
			for(var idx in framework.rollupRule){
				closeModal = false;
				EcRollupRule.get(framework.rollupRule[idx], function(data){
					EcCompetency.get(data.competency, function(comp){
						var display = $("<div class='row'></div>")
						
						var col1 = $("<div class='small-1 columns'></div>");
						
						if(AppController.identityController.owns(data)){
							col1.prepend("<i class='fa fa-check' style='color:lightgreen;margin-top:0.25rem;'></i>");
							display.attr("title", "Permissions will be changed to match")
						}else if(AppController.identityController.canEdit(data)){
							col1.prepend("<i class='fa fa-minus' style='color:lightblue;margin-top:0.25rem;'></i>")
							display.attr("title", "Publicly owned, permissions will remain unchanged, but still editable by anyone")
							
							ViewManager.getView("#propagateMessageContainer").displayPrimary("One or more of the objects contained is publicly owned and permissions will not be affected", "publicObject");
						}else{
							col1.prepend("<i class='fa fa-times' style='color:red;margin-top:0.25rem;'></i>")
							display.attr("title", "Not owned by you, cannot change permissions")
							
							ViewManager.getView("#propagateMessageContainer").displayAlert("You are not allowed to modify the permissions on one or more of the objects contained", "noPropagation");
						}
						display.append(col1);
						
						var col2 = $("<div class='small-11 columns'></div>");
						col2.text(comp.name+" : "+data.name)
						display.append(col2);
						
						$("#rulesOptGroup").append(display)
					}, function(err){
						displayAlert(err);
					});
					
				}, function(err){
					displayAlert(err);
				});
			}
		}
		
		if(closeModal)
			setTimeout(function(){
				ModalManager.hideModal();
			}, 100);
	}
	
	/**
	 * Does the legwork of copying permissions to all objects allowed
	 * 
	 * @memberOf PermissionPropagationModal
	 * @method populateFrameworkChanges
	 * @private
	 * @param {EcFramework} data
	 * 			EcFramework to propagate permissions from 
	 */
	function propagateFrameworkChanges(framework){
		var total = 0;
		var saved = {};
		var oldEOS = {};
		var failed = 0;
		
		if(framework.competency != undefined && framework.competency.length > 0){
			total += framework.competency.length;
			for(var idx in framework.competency){
				EcCompetency.get(framework.competency[idx], function(data){
					if(AppController.identityController.owns(data)){
						var old = new EcRemoteLinkedData();
						old.copyFrom(data);
						oldEOS[data.id] = EcEncryptedValue.encryptOnSave(data.id);
						
						data.owner = framework.owner;
						EcEncryptedValue.encryptOnSave(data.id, EcEncryptedValue.encryptOnSave(framework.id));
						data.reader = framework.reader;
						
						// Only attempt propagation if it has not failed on other objects yet
						if(failed == 0){
							data.save(function(){
								if(failed == 0){
									saved[data.id] = old;
									
									if(Object.keys(saved).length == total){
										ModalManager.hideModal();
										ScreenManager.getCurrentScreen().displaySuccess("Successfully propagated changes to referenced objects")
									}else{
										ViewManager.getView("#propagateProgressMessageContainer").displaySuccess(total+" objects saved", "saved");
									}
								}else{
									data.owner = old.owner;
									data.reader = old.reader
									EcEncryptedValue.encryptOnSave(data.id, oldEOS[data.id]);
									
									data.save(function(){
										delete saved[data.id];
										if(Object.keys(saved).length == 0){
											
										}
									}, function(){
										delete saved[data.id];
										if(Object.keys(saved).length == 0){
											
										}
									});	
									
									for(var id in saved){
										
									}
								}
								
							}, function(){
								failed++;
								
								ViewManager.getView("#propagateProgressMessageContainer").displaySuccess(total+" objects failed", "failed")
							});
						}
						
					}else{
						total--;
					}
				});
			}
		}
		
		if(framework.relation != undefined && framework.relation.length > 0){
			total += framework.relation.length;
			for(var idx in framework.relation){
				EcAlignment.get(framework.relation[idx], function(data){
					if(AppController.identityController.owns(data)){
						var old = new EcRemoteLinkedData();
						old.copyFrom(data);
						oldEOS[data.id] = EcEncryptedValue.encryptOnSave(data.id);
						
						data.owner = framework.owner;
						EcEncryptedValue.encryptOnSave(data.id, EcEncryptedValue.encryptOnSave(framework.id));
						data.reader = framework.reader;
						
						// Only attempt propagation if it has not failed on other objects yet
						if(failed == 0){
							data.save(function(){
								if(failed == 0){
									saved[data.id] = old;
									
									if(Object.keys(saved).length == total){
										ModalManager.hideModal();
										ScreenManager.getCurrentScreen().displaySuccess("Successfully propagated changes to referenced objects")
									}else{
										ViewManager.getView("#propagateProgressMessageContainer").displaySuccess(total+" objects saved", "saved");
									}
								}else{
									data.owner = old.owner;
									data.reader = old.reader
									EcEncryptedValue.encryptOnSave(data.id, oldEOS[data.id]);
									
									data.save(function(){
										delete saved[data.id];
										if(Object.keys(saved).length == 0){
											
										}
									}, function(){
										delete saved[data.id];
										if(Object.keys(saved).length == 0){
											
										}
									});	
									
									for(var id in saved){
										
									}
								}
								
							}, function(){
								failed++;
								
								ViewManager.getView("#propagateProgressMessageContainer").displaySuccess(total+" objects failed", "failed")
							});
						}
						
					}else{
						total--;
					}
				});
			}
		}
		
		if(framework.level != undefined && framework.level.length > 0){
			total += framework.level.length;
			for(var idx in framework.level){
				EcLevel.get(framework.level[idx], function(data){
					if(AppController.identityController.owns(data)){
						var old = new EcRemoteLinkedData();
						old.copyFrom(data);
						oldEOS[data.id] = EcEncryptedValue.encryptOnSave(data.id);
						
						data.owner = framework.owner;
						EcEncryptedValue.encryptOnSave(data.id, EcEncryptedValue.encryptOnSave(framework.id));
						data.reader = framework.reader;
						
						// Only attempt propagation if it has not failed on other objects yet
						if(failed == 0){
							data.save(function(){
								if(failed == 0){
									saved[data.id] = old;
									
									if(Object.keys(saved).length == total){
										ModalManager.hideModal();
										ScreenManager.getCurrentScreen().displaySuccess("Successfully propagated changes to referenced objects")
									}else{
										ViewManager.getView("#propagateProgressMessageContainer").displaySuccess(total+" objects saved", "saved");
									}
								}else{
									data.owner = old.owner;
									data.reader = old.reader
									EcEncryptedValue.encryptOnSave(data.id, oldEOS[data.id]);
									
									data.save(function(){
										delete saved[data.id];
										if(Object.keys(saved).length == 0){
											
										}
									}, function(){
										delete saved[data.id];
										if(Object.keys(saved).length == 0){
											
										}
									});	
									
									for(var id in saved){
										
									}
								}
								
							}, function(){
								failed++;
								
								ViewManager.getView("#propagateProgressMessageContainer").displaySuccess(total+" objects failed", "failed")
							});
						}
						
					}else{
						total--;
					}
				});
			}
		}
		
		if(framework.rollupRule != undefined && framework.rollupRule.length > 0){
			total += framework.rollupRule.length;
			for(var idx in framework.rollupRule){
				EcRollupRule.get(framework.rollupRule[idx], function(data){
					if(AppController.identityController.owns(data)){
						var old = new EcRemoteLinkedData();
						old.copyFrom(data);
						oldEOS[data.id] = EcEncryptedValue.encryptOnSave(data.id);
						
						data.owner = framework.owner;
						EcEncryptedValue.encryptOnSave(data.id, EcEncryptedValue.encryptOnSave(framework.id));
						data.reader = framework.reader;
						
						// Only attempt propagation if it has not failed on other objects yet
						if(failed == 0){
							data.save(function(){
								if(failed == 0){
									saved[data.id] = old;
									
									if(Object.keys(saved).length == total){
										ModalManager.hideModal();
										ScreenManager.getCurrentScreen().displaySuccess("Successfully propagated changes to referenced objects")
									}else{
										ViewManager.getView("#propagateProgressMessageContainer").displaySuccess(total+" objects saved", "saved");
									}
								}else{
									ViewManager.getView("#propagateMessageContainer").displayAlert("Failed to Propagate. Tried rolling back changes..", "rollback");
									
									data.owner = old[data.id].owner;
									data.reader = old[data.id].reader
									EcEncryptedValue.encryptOnSave(data.id, oldEOS[data.id]);
									
									data.save(function(){}, function(){
										ViewManager.getView("#propagateMessageContainer").displayAlert("Failed to Propagate. Failed to roll back.", "rollback");
									});	
									
									for(var id in saved){
										EcRepository.get(id, function(data){
											data.owner = old[data.id].owner;
											data.reader = old[data.id].reader
											EcEncryptedValue.encryptOnSave(data.id, oldEOS[data.id]);
											
											data.save(function(){
												delete saved[data.id];
												if(Object.keys(saved).length == 0){
													ViewManager.getView("#propagateMessageContainer").displaySuccess("Successfully rolled back propagation");
												}
											}, function(){
												delete saved[data.id];
												if(Object.keys(saved).length == 0){
													ViewManager.getView("#propagateMessageContainer").displaySuccess("Successfully rolled back propagation");
												}
											});	
										}, function(){
											ViewManager.getView("#propagateMessageContainer").displayAlert("Failed to Propagate. Failed to roll back.", "rollback");
										})
									}
								}
								
							}, function(){
								failed++;
								
								ViewManager.getView("#propagateProgressMessageContainer").displaySuccess(total+" objects failed", "failed")
							});
						}
					}else{
						total--;
					}
				});
			}
		}
	}
	
	/**
	 * Shows an alert message in the message Container
	 * 
	 * @memberOf PermissionPropagationModal
	 * @method displayAlertMessage
	 * @private
	 * @param {String} msg
	 * 			Alert message to display
	 */
	function displayAlert(msg){
		ViewManager.getView("#propagateMessageContainer").displayAlert(msg);
	}
	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf PermissionPropagationModal
	 * @method display
	 * @param {String} containerId
	 * 			The DOM ID of the Modal Container this modal is displayed in
	 */
	PermissionPropagationModal.prototype.display = function(containerId)
	{
		var data = this.data;
		
		var onCancel = this.onCancel;
		
		ViewManager.showView(new MessageContainer("propagate"), "#propagateMessageContainer");
		ViewManager.showView(new MessageContainer("propagateProgress"), "#propagateProgressMessageContainer");
		
		$("#propagateConfirmBtn").click(function(event){
			var prop = true;
			if(data.owner == null || data.owner.length == 0){
				prop = confirm("Are you sure that you would like to make all of these objects public?");
			}else if (!AppController.identityController.owns(data)){
				prop = confirm("Are you sure that you would like to remove your ownership from all of these objects?");
			}
			
			if(prop){
				if(data.isAny(new EcFramework().getTypes())){
					propagateFrameworkChanges(data);
				}
			}
		});
		
		$("#propagateCancelBtn").click(function(event){
			ModalManager.hideModal();
			if(onCancel != undefined)
				onCancel();
		});
	
		if(this.data.isAny(new EcFramework().getTypes())){
			setupFrameworkDisplay(this.data);
		}
	}
	
	
	
	return PermissionPropagationModal;
})(PermissionPropagationModal);