/*
 * The third definition defines the UI methods and server-exposed methods
 */
var MessageContainer = (function(MessageContainer){

	function displayMessage(msg, msgId, containerId){
		var container = $(containerId);
		
		container.attr("style", "");
		container.removeClass("hide");
		
		var identifier = msgId != undefined ? msgId : msg;
		
		var messages = $(containerId+"Messages")
		
		messages.find("[data-msg='"+identifier+"']").remove();
		
		messages.append("<div data-msg='"+identifier+"'>"+msg+"</div>");
	}
	
	function clearMessage(containerId, msgId){
		var messages = $(containerId+"Messages");
		
		if(msgId == undefined || (messages.find("[data-msg]").size() == 1 && messages.find("[data-msg='"+msgId+"']").size() == 1)){
			hideMessageBox(containerId, function(){
				messages.html("");
			});
		}else{
			messages.find("[data-msg='"+msgId+"']").remove();
		}
			
	}
	
	function hideMessageBox(containerId, callback)
	{	
		var container = $(containerId);
		
		container.fadeOut({complete:function(){
			container.addClass("hide");
			container.attr("style", "");
			
			if(callback != undefined)
				callback();
		}});
	}
	
	
	/**
	 * The display function defines how this view should be displayed
	 * @param containerId: defines the container that this view should be displayed in
	 * 		for screens -> screenContainer
	 * 		for overlays -> overlayContainer
	 * 		for modals -> modalContainer
	 */
	MessageContainer.prototype.display = function(containerId)
	{	
		var prefix = this.prefix;
			
		$(containerId).find("[id]").each(function(i, e){
			$(e).attr("id", prefix+"-"+$(e).attr("id"))
		});
		
		$(containerId).find(".messageContainer").each(function(i, e){
			$(e).find('button').click(function(){
				hideMessageBox("#"+$(e).attr("id"));
			})
		})
	
	}
	
	MessageContainer.prototype.displayAlert = function(msg, msgId){
		var containerId = "#"+this.prefix+"-"+"alertbox";
		
		displayMessage(msg, msgId, containerId);
	}
	MessageContainer.prototype.displayWarning = function(msg, msgId){
		var containerId = "#"+this.prefix+"-"+"warningbox";
		
		displayMessage(msg, msgId, containerId);
	}
	MessageContainer.prototype.displaySuccess = function(msg, msgId){
		var containerId = "#"+this.prefix+"-"+"successbox";
		
		displayMessage(msg, msgId, containerId);
	}
	MessageContainer.prototype.displayPrimary = function(msg, msgId){
		var containerId = "#"+this.prefix+"-"+"primarybox";
		
		displayMessage(msg, msgId, containerId);
	}
	MessageContainer.prototype.displaySecondary = function(msg, msgId){
		var containerId = "#"+this.prefix+"-"+"secondarybox";
		
		displayMessage(msg, msgId, containerId);
	}
	
	
	MessageContainer.prototype.clearAlert = function(msgId){
		var containerId = "#"+this.prefix+"-"+"alertbox";
		
		clearMessage(containerId, msgId)
	}
	MessageContainer.prototype.clearWarning = function(msgId){
		var containerId = "#"+this.prefix+"-"+"warningbox";
		
		clearMessage(containerId, msgId)
	}
	MessageContainer.prototype.clearSuccess = function(msgId){
		var containerId = "#"+this.prefix+"-"+"successbox";
		
		clearMessage(containerId, msgId)
	}
	MessageContainer.prototype.clearPrimary = function(msgId){
		var containerId = "#"+this.prefix+"-"+"primarybox";
		
		clearMessage(containerId, msgId)
	}
	MessageContainer.prototype.clearSecondary = function(msgId){
		var containerId = "#"+this.prefix+"-"+"secondarybox";
		
		clearMessage(containerId, msgId)
	}
	
	MessageContainer.prototype.hideAlert = function(msg, msgId){
		var containerId = "#"+this.prefix+"-"+"alertbox";
		
		hideMessageBox(containerId);
	}
	MessageContainer.prototype.hideWarning = function(msg, msgId){
		var containerId = "#"+this.prefix+"-"+"warningbox";
		
		hideMessageBox(containerId);
	}
	MessageContainer.prototype.hideSuccess = function(msg, msgId){
		var containerId = "#"+this.prefix+"-"+"successbox";
		
		hideMessageBox(containerId);
	}
	MessageContainer.prototype.hidePrimary = function(msg, msgId){
		var containerId = "#"+this.prefix+"-"+"primarybox";
		
		hideMessageBox(containerId);
	}
	MessageContainer.prototype.hideSecondary = function(msg, msgId){
		var containerId = "#"+this.prefix+"-"+"secondarybox";
		
		hideMessageBox(containerId);
	}
	
	return MessageContainer;
})(MessageContainer);