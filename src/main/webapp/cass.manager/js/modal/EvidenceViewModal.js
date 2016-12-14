/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
/**
 * Modal for viewing evidence details
 * 
 * @module cass.manager
 * @class EvidenceViewModal
 * 
 * @author devlin.junker@eduworks.com
 */
var EvidenceViewModal = (function(EvidenceViewModal){	
	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf EvidenceViewModal
	 * @method display
	 * @param {String} containerId
	 * 			The DOM ID of the Modal Container this modal is displayed in
	 */
	EvidenceViewModal.prototype.display = function(containerId)
	{
		var evidence = this.evidence;
		
		ViewManager.showView(new MessageContainer("viewEvidence"), "#viewEvidenceMessageContainer", function(){
			if(evidence.length == 0){
				ViewManager.getView("#viewEvidenceMessageContainer").displayAlert("No Evidences Available to Display");
			}
		});
		
		$("#viewEvidenceCloseBtn").click(function(event){
			event.preventDefault();
			ModalManager.hideModal();
		});
		
		
		for(var i in evidence){
			var ev = evidence[i];
			
			if(ev.startsWith("http") || ev.startsWith("www")){
				var a = $("<a></a>");
				a.attr("href", ev);
				a.text(ev);
				
				var li = $("<li></li>");
				li.append(a);
				
				$("#evidenceList").append(li);
			}else{
				var li = $("<li></li>");
				li.text(ev);
				$("#evidenceList").append(li);
			}
		}
		
	}
	
	return EvidenceViewModal;
})(EvidenceViewModal);