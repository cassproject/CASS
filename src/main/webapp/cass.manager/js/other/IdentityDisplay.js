/**
 * View to display contact information including a qr code view of their pk,
 * the ability to name/request name from a key
 * 
 * @class IdentityDisplay
 * @author devlin.junker@eduworks.com
 */
var IdentityDisplay = (function(IdentityDisplay){

	/**
	 * @memberOf IdentityDisplay
	 * @method buildPopoutDisplay
	 * @private
	 * @param {String} pem
	 * 			String representation of the pk or Ppk
	 * @param {String} containerId
	 * 			DOM ID of the element for the identityDisplay 
	 */
	function buildPopoutDisplay(pem, containerId){
		var ident = AppController.identityController.lookup(pem);
		
		var container = $(containerId).find(".identityDisplay").first();
		
		container.attr("data-pk", pem);
		container.find(".identityText").text(ident.displayName);
		
		container.find(".qrcodeCanvas:empty").html("").qrcode({
            width: 256,
            height: 256,
            text: pem.replaceAll(/[\r\n]/g, "").trim()
		});
		
    	container.off("click.qr").on("click.qr",null,null,
            function(ev){
    			if( !($(ev.target).parents().hasClass("popout") || $(ev.target).hasClass("popout")) ){
		    		copyTextToClipboard(pem);
		    		alert("Public key copied to clipboard.");
    			}
	    	}
    	);
    	
    	container.on("mouseenter", function(){
    		container.find(".popout").removeClass("hide");
    		
    		container.find(".qrcodeCanvas").addClass("hide");
    		container.find(".connectContainer").addClass("hide");
    		container.find(".identifyContainer").addClass("hide");
    		container.find(".renameContainer").addClass("hide");
    	});
    	
    	container.on("mouseleave", function(){
    		container.find(".popout").addClass("hide");
    	});
    	
    	container.find(".qrBtn").click(function(ev){
    		ev.preventDefault();
    		container.find(".identifyContainer").addClass("hide");
    		container.find(".connectContainer").addClass("hide");
    		container.find(".renameContainer").addClass("hide");
    		
    		container.find(".qrcodeCanvas").toggleClass("hide");
    	});
    	
    	if(ident == IdentityController.unknownContact){
    		container.find(".knownIdentityContainer").addClass("hide");
    		container.find(".unknownIdentityContainer").removeClass("hide");
    	}else{
    		container.find(".unknownIdentityContainer").addClass("hide");
    		container.find(".knownIdentityContainer").removeClass("hide");
    	}
    	
    	container.find(".identifyBtn").click(function(ev){
    		ev.preventDefault();
    		container.find(".qrcodeCanvas").addClass("hide");
    		container.find(".connectContainer").addClass("hide");
    		
    		container.find(".identifyContainer").toggleClass("hide");
    		container.find(".identifyInput").focus();
    	});
    	
    	container.find(".connectBtn").click(function(ev){
    		ev.preventDefault();
    		
    		container.find(".qrcodeCanvas").addClass("hide");
    		container.find(".identifyContainer").addClass("hide");
    		
    		container.find(".connectContainer").toggleClass("hide");
    		container.find(".connectInput").focus();
    	});
    	
    	container.find(".saveIdentifyBtn").click(function(ev){
    		ev.preventDefault();
    		
    		var name = container.find(".identifyInput").val(); 
    		
    		AppController.identityController.addContact(pem, name);
    		$("[data-pk='"+pem+"'] .identityText").text(name);
    		$("[data-pk='"+pem+"'] .unknownIdentityContainer").addClass("hide");
    		$("[data-pk='"+pem+"'] .knownIdentityContainer").removeClass("hide");
    		
    		container.find(".identifyInput").val("");
    		
    		container.find(".popout").addClass("hide");
    	});
    	
    	container.find(".sendConnectBtn").click(function(ev){
    		ev.preventDefault();
    		
    		container.find(".connectInput").val("");
    		
    		container.find(".popout").addClass("hide");
    	});
    	
    	container.find(".renameBtn").click(function(ev){
    		ev.preventDefault();
    		
    		container.find(".qrcodeCanvas").addClass("hide");
    		
    		container.find(".renameContainer").toggleClass("hide");
    	});
		
		container.find(".saveRenameBtn").click(function(ev){
    		ev.preventDefault();
    		
    		var newName = container.find(".renameInput").val();
    		
    		if(AppController.identityController.isCurrentUser(pem)){
    			AppController.identityController.addKey(pem, newName);
    		}else{
    			AppController.identityController.addContact(pem, newName);
    		}
    		
    		$("[data-pk='"+pem+"'] .identityText").text(newName);
    		
    		container.find(".renameInput").val("");
    		
    		container.find(".popout").addClass("hide");
    	});
    	
	}
	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf IdentityDisplay
	 * @method display
	 * @param {String} containerId
	 * 			DOM ID of the element that holds this IdentityDisplay
	 */
	IdentityDisplay.prototype.display = function(containerId)
	{	
		var data = this.data;
		buildPopoutDisplay(data, containerId);
	}
	
	
	return IdentityDisplay;
})(IdentityDisplay);