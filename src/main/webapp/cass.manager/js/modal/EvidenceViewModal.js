var EvidenceViewModal = (function(EvidenceViewModal){	
	
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
				var a = $("<li><a href='"+ev+"'>"+ev+"</a></li>");
				
				$("#evidenceList").append(a);
			}else{
				$("#evidenceList").append("<li>"+ev+"</li>");
			}
		}
		
	}
	
	return EvidenceViewModal;
})(EvidenceViewModal);