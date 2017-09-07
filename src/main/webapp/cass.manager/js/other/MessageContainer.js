/**
 * View for displaying messages to the user in relation to actions they perform
 * 
 * @class MessageContainer
 * @author devlin.junker@eduworks.com
 */
var MessageContainer = (function(MessageContainer){

	/**
	 * Actually handles displaying the message and associating 
	 * the messageId in the correct container
	 * 
	 * @memberOf MessageContainer
	 * @method displayMessage
	 * @private
	 * @param {String} msg
	 * 			Message to be displayed
	 * @param {String} msgId
	 * 			Message Id associated with message
	 * @param {String} containerId
	 * 			DOM ID of the element containing this MessageContainer
	 */
	function displayMessage(msg, msgId, containerId){
		var container = $(containerId);
		
		container.attr("style", "");
		container.removeClass("hide");
		
		var identifier = msgId != undefined ? msgId : msg;
		
		var messages = $(containerId+"Messages")
		
		messages.find("[data-msg='"+identifier+"']").remove();
		
		var div = $("<div></div>");
		div.attr("data-msg", identifier);
		div.text(msg);
		
		messages.append(div);
	}
	
	/**
	 * Handles clearing the message associated with the messageId
	 * clears all messages if no msgId passed in
	 * 
	 * @memberOf MessageContainer
	 * @method clearMessage
	 * @private
	 * @param {String} containerId
	 * 			DOM ID of the element containing this MessageContainer
	 * @param {String} [optional] msgId
	 * 			Message Id associated with message to clear
	 */
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
	
	/**
	 * Hides the MessageContainer from view, no matter how many messages are in it
	 * 
	 * @memberOf MessageContainer
	 * @method hideMessageBox
	 * @private
	 * @param {String} containerId
	 * 			DOM ID of the element containing this MessageContainer
	 * @param {Callback0} callback
	 * 			Callback once the MessageContainer has fully faded out
	 */
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
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf MessageContainer
	 * @method display
	 * @param {String} containerId
	 * 			DOM ID of the element that holds this message container
	 */
	MessageContainer.prototype.display = function(containerId)
	{	
		var prefix = this.prefix;
			
		var closeCallback = this.closeMessageCallback;
		$(containerId).find("[id]").each(function(i, e){
			$(e).attr("id", prefix+"-"+$(e).attr("id"))
		});
		
		$(containerId).find(".messageContainer").each(function(i, e){
			$(e).find('button').click(function(){
				hideMessageBox("#"+$(e).attr("id"), closeCallback);
				
			})
		});
	}
	
	/**
	 * Displays the message in the alert box of the MessageContainer
	 * 
	 * @memberOf MessageContainer
	 * @method displayAlert
	 * @param {String} msg
	 * 			Alert message to display
	 * @param {String} [optional] msgId
	 * 			ID to associate with the message for clearing later
	 */
	MessageContainer.prototype.displayAlert = function(msg, msgId){
		var containerId = "#"+this.prefix+"-"+"alertbox";
		
		displayMessage(msg, msgId, containerId);
	}
	/**
	 * Displays the message in the warning box of the MessageContainer
	 * 
	 * @memberOf MessageContainer
	 * @method displayWarning
	 * @param {String} msg
	 * 			Warning message to display
	 * @param {String} [optional] msgId
	 * 			ID to associate with the message for clearing later
	 */
	MessageContainer.prototype.displayWarning = function(msg, msgId){
		var containerId = "#"+this.prefix+"-"+"warningbox";
		
		displayMessage(msg, msgId, containerId);
	}
	/**
	 * Displays the message in the success box of the MessageContainer
	 * 
	 * @memberOf MessageContainer
	 * @method displaySuccess
	 * @param {String} msg
	 * 			Success message to display
	 * @param {String} [optional] msgId
	 * 			ID to associate with the message for clearing later
	 */
	MessageContainer.prototype.displaySuccess = function(msg, msgId){
		var containerId = "#"+this.prefix+"-"+"successbox";
		
		displayMessage(msg, msgId, containerId);
	}
	/**
	 * Displays the message in the primary box of the MessageContainer
	 * 
	 * @memberOf MessageContainer
	 * @method displayPrimary
	 * @param {String} msg
	 * 			Primary message to display
	 * @param {String} [optional] msgId
	 * 			ID to associate with the message for clearing later
	 */
	MessageContainer.prototype.displayPrimary = function(msg, msgId){
		var containerId = "#"+this.prefix+"-"+"primarybox";
		
		displayMessage(msg, msgId, containerId);
	}
	/**
	 * Displays the message in the secondary box of the MessageContainer
	 * 
	 * @memberOf MessageContainer
	 * @method displaySecondary
	 * @param {String} msg
	 * 			Secondary message to display
	 * @param {String} [optional] msgId
	 * 			ID to associate with the message for clearing later
	 */
	MessageContainer.prototype.displaySecondary = function(msg, msgId){
		var containerId = "#"+this.prefix+"-"+"secondarybox";
		
		displayMessage(msg, msgId, containerId);
	}
	
	/**
	 * Clears the message(s) in the alert box of the MessageContainer,
	 * if no msgId passed in, clears all alerts
	 * 
	 * @memberOf MessageContainer
	 * @method clearAlert
	 * @param {String} [optional] msgId
	 * 			ID of message to clear
	 */
	MessageContainer.prototype.clearAlert = function(msgId){
		var containerId = "#"+this.prefix+"-"+"alertbox";
		
		clearMessage(containerId, msgId)
	}
	/**
	 * Clears the message(s) in the warning box of the MessageContainer,
	 * if no msgId passed in, clears all warnings
	 * 
	 * @memberOf MessageContainer
	 * @method clearWarning
	 * @param {String} [optional] msgId
	 * 			ID of message to clear
	 */
	MessageContainer.prototype.clearWarning = function(msgId){
		var containerId = "#"+this.prefix+"-"+"warningbox";
		
		clearMessage(containerId, msgId)
	}
	/**
	 * Clears the message(s) in the success box of the MessageContainer,
	 * if no msgId passed in, clears all success messages
	 * 
	 * @memberOf MessageContainer
	 * @method clearSuccess
	 * @param {String} [optional] msgId
	 * 			ID of message to clear
	 */
	MessageContainer.prototype.clearSuccess = function(msgId){
		var containerId = "#"+this.prefix+"-"+"successbox";
		
		clearMessage(containerId, msgId)
	}
	/**
	 * Clears the message(s) in the primary box of the MessageContainer,
	 * if no msgId passed in, clears all primary messages
	 * 
	 * @memberOf MessageContainer
	 * @method clearPrimary
	 * @param {String} [optional] msgId
	 * 			ID of message to clear
	 */
	MessageContainer.prototype.clearPrimary = function(msgId){
		var containerId = "#"+this.prefix+"-"+"primarybox";
		
		clearMessage(containerId, msgId)
	}
	/**
	 * Clears the message(s) in the secondary box of the MessageContainer,
	 * if no msgId passed in, clears all secondary messages
	 * 
	 * @memberOf MessageContainer
	 * @method clearSecondary
	 * @param {String} [optional] msgId
	 * 			ID of message to clear
	 */
	MessageContainer.prototype.clearSecondary = function(msgId){
		var containerId = "#"+this.prefix+"-"+"secondarybox";
		
		clearMessage(containerId, msgId)
	}
	
	/**
	 * Hides the alert box of the message container
	 * 
	 * @memberOf MessageContainer
	 * @method hideAlert
	 */
	MessageContainer.prototype.hideAlert = function(){
		var containerId = "#"+this.prefix+"-"+"alertbox";
		
		hideMessageBox(containerId);
	}
	/**
	 * Hides the warning box of the message container
	 * 
	 * @memberOf MessageContainer
	 * @method hideWarning
	 */
	MessageContainer.prototype.hideWarning = function(msg, msgId){
		var containerId = "#"+this.prefix+"-"+"warningbox";
		
		hideMessageBox(containerId);
	}
	/**
	 * Hides the success box of the message container
	 * 
	 * @memberOf MessageContainer
	 * @method hideSuccess
	 */
	MessageContainer.prototype.hideSuccess = function(msg, msgId){
		var containerId = "#"+this.prefix+"-"+"successbox";
		
		hideMessageBox(containerId);
	}
	/**
	 * Hides the primary box of the message container
	 * 
	 * @memberOf MessageContainer
	 * @method hidePrimary
	 */
	MessageContainer.prototype.hidePrimary = function(msg, msgId){
		var containerId = "#"+this.prefix+"-"+"primarybox";
		
		hideMessageBox(containerId);
	}
	/**
	 * Hides the secondary box of the message container
	 * 
	 * @memberOf MessageContainer
	 * @method hideSecondary
	 */
	MessageContainer.prototype.hideSecondary = function(msg, msgId){
		var containerId = "#"+this.prefix+"-"+"secondarybox";
		
		hideMessageBox(containerId);
	}
	
	return MessageContainer;
})(MessageContainer);