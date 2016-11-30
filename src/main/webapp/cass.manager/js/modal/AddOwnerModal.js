/**
 * Handles adding an owner to an object, lets the user select from their
 * contacts or paste a public key PEM as an owner
 * 
 * @module cass.manager
 * @class AddOwnerModal
 * 
 * @author devlin.junker@eduworks.com
 */
var AddOwnerModal = (function(AddOwnerModal){	
	
	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf AddOwnerModal
	 * @method display
	 * @param {String} containerId
	 * 			The DOM ID of the Modal Container this modal is displayed in
	 */
	AddOwnerModal.prototype.display = function(containerId)
	{
		var addingTo = this.field;
		
		var objectContainerId = this.objectContainerId;
		
		ViewManager.showView(new MessageContainer("addOwner"), "#addOwnerMessageContainer");
		
		var ownerElements = addingTo.children("div").children("[field='@owner']").find("ul").find(".identityDisplay");
		
		var owners = [];
		for(var i = 0; i < ownerElements.size(); i++){
			var el = ownerElements.get(i);
			var pk = $(el).attr("data-pk")
			owners.push(pk)
		}
		
		ViewManager.showView(new DataViewer("addOwner", {
			buildMenu: function(){},
			buildRowToolbar: function(){},
			buildDataRow: function(row, id, datum){
				var rowHtml = $("<div class='small-12 columns'></div>");
				rowHtml.text(datum.displayName);
				rowHtml.attr("title", datum.pk.toPem());
				
				row.append(rowHtml);
				
				row.attr("data-id", datum.pk.toPem());
			}
		}), "#contactDisplay", function(){
			var identities = {};
			for (var i in EcIdentityManager.contacts){
				var id = EcIdentityManager.contacts[i];
				if(id.pk == undefined)
					continue;
				if(owners.indexOf(id.pk.toPem()) != -1)
					continue;
				var con = new EcContact();
				con.displayName = id.displayName;
				con.pk = id.pk;
				con.id = con.pk.toPem();
				identities[con.pk.toPem()] = con;
			}
			
			for (var i in EcIdentityManager.ids){
				var id = EcIdentityManager.ids[i];
				if(id.ppk == undefined)
					continue;
				if(owners.indexOf(id.ppk.toPk().toPem()) != -1)
					continue;
				var con = new EcContact();
				con.displayName = id.displayName;
				con.pk = id.ppk.toPk();
				con.id = con.pk.toPem();
				identities[con.pk.toPem()] = con;
			}
			
			ViewManager.getView("#contactDisplay").populate(identities);
			$("#addOwner-data").css("border", "1px solid #b3b3b3")
			$("#addOwner-none").text("No Identities or Contacts available")
		});
		
		$("#addOwnerSubmit").click(function(){
			var key = $("#ownerKeyPaste").text();
			
			if(key == undefined || key == ""){
				var keys = ViewManager.getView("#contactDisplay").getSelected();
				for(var idx in keys){
					ViewManager.getView(objectContainerId).addOwner(addingTo, keys[idx].pk.toPem());
				}
			}else{
				ViewManager.getView(objectContainerId).addOwner(addingTo, key);
			}
			
			ModalManager.hideModal();
		})
		
		$("#addOwnerModalCancel").click(function(){
			ModalManager.hideModal();
		})
	}
	
	return AddOwnerModal;
})(AddOwnerModal);