/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
/**
 * Generic Modal to show a message to a user with an 'Ok' button
 * 
 * @module cass.manager
 * @class MessageModal
 * 
 * @author devlin.junker@eduworks.com
 */
var MessageModal = (function(MessageModal){	
	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf MessageModal
	 * @method display
	 * @param {String} containerId
	 * 			The DOM ID of the Modal Container this modal is displayed in
	 */
	MessageModal.prototype.display = function(containerId)
	{
		var okCallback = this.okCallback;
		
		$("#messageHeader").html(this.header);
		$("#messageText").html(this.message);
		if(this.message == "" || this.message == undefined){
			$("#messageText").css("margin-bottom", "0px");
			$("#okBtn").css("margin-top", "0px");
		}
		
		$("#okBtn").click(function(event){
			if(okCallback != undefined)
				okCallback();
			ModalManager.hideModal();
		});
		
	}
	
	return MessageModal;
})(MessageModal);