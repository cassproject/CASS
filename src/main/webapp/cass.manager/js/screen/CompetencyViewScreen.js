	
CompetencyViewScreen.prototype.errorFindingRelations = function(err){
		if(err == undefined)
			err = "Unable to Connect to Server to Retrieve Relationships";
		
		ViewManager.getView("#competencyViewMessageContainer").displayAlert(err, "getRelationships");
	}

CompetencyViewScreen.prototype.errorFindingRollupRules = function(err){
		if(err == undefined)
			err = "Unable to Connect to Server to Retrieve Relationships";
		
		ViewManager.getView("#competencyViewMessageContainer").displayAlert(err, "getRelationships");
	}
	
CompetencyViewScreen.prototype.errorFindingLevels = function(err){
		if(err == undefined)
			err = "Unable to Connect to Server to Retrieve Levels";
		
		ViewManager.getView("#competencyViewMessageContainer").displayAlert(err, "getLevels");
	}
	
	CompetencyViewScreen.prototype.bindControls = function(containerId)
	{
		var data = this.data;
		
		$("#competencyViewSearchBtn").attr("href", "#"+CompetencySearchScreen.prototype.displayName);
		$("#competencyViewSearchBtn").click(function(event){
			event.preventDefault();
			ScreenManager.changeScreen(new CompetencySearchScreen(data))
		});
		
		$("#competencyViewBtn").attr("href", "#"+CompetencyViewScreen.prototype.displayName);
		$("#competencyViewBtn").click(function(event){
			event.preventDefault();
		});
		
		if(AppController.identityController.canEdit(data)){
			$("#editCompetencyBtn").click(function(event){
				event.preventDefault();
				ScreenManager.changeScreen(new CompetencyEditScreen(data))
			})
		}else{
			$("#editCompetencyBtn").remove();
		}
		
		$('[ec-container="competency"]').on("click","a[id]",null,function(evt){
			if (this.getAttribute("id").indexOf(".competency/") != -1)
				ScreenManager.changeScreen(new CompetencyViewScreen({id:this.getAttribute("id")}));
		});
		
		if(AppController.identityController.owns(data) || AppController.loginController.getAdmin()){
			$("#competencyViewDeleteBtn").click(function(){
				ModalManager.showModal(new ConfirmModal(function(){
					data._delete(function(){
						ScreenManager.changeScreen(new CompetencySearchScreen());
					}, function(err){
						if(err == undefined)
							err = "Unable to connect to server to delete competenncy";
						ViewManager.getView("#competencyViewMessageContainer").displayAlert(err)
					});
					ModalManager.hideModal();
				}, "Are you sure you want to delete this competency?"))
			})
		}else{
			$("#competencyViewDeleteBtn").remove();
		}
		
	};
	