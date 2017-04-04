AlignmentExplorerColumn = (function (AlignmentExplorerColumn) {

    AlignmentExplorerColumn.prototype.redrawJsInit = function () {
		$(this.containerId).find(".alignmentEditorElement").removeClass("highlighted");
    }
    AlignmentExplorerColumn.prototype.redrawJsFinal = function () {

        $(this.containerId).find(".loadingRow").hide();
        $(this.containerId).find(".alignmentEditorContainer").show();
    	var selectedTotal = 0;
    	var me=this;
    	while (me != null)
    	{
    		selectedTotal += me.selected;
    		me=me.left;
    	}
    	me = this;
    	while (me != null)
    	{
    		selectedTotal += me.selected;
    		me=me.right;
    	}
    	if (selectedTotal == 0)
			if ($(this.containerId).find(".alignmentEditorElement.highlighted").length == 0)
				$(this.containerId).find(".alignmentEditorElement").addClass("highlighted");
    }
    AlignmentExplorerColumn.prototype.redrawJs = function () {
    	var selectedTotal = 0;
		var me=this;
		while (me != null)
		{
			selectedTotal += me.selected;
			me=me.left;
		}
		me = this;
		while (me != null)
		{
			selectedTotal += me.selected;
			me=me.right;
		}
		if ((this.selected.length > 0 || selectedTotal == 0) && this.highlighted.length == 0 && this.right != null && this.right.relations != null && this.right.relations.length > 0)
		{
			var counter = 0;
			for (var i = 0;i < this.right.relations.length;i++){
				var relation = this.right.relations[i];
				if (new Relation().isA(relation.type)) {
					counter += $(this.containerId).find("[id=\""+relation.source+"\"]").addClass("highlighted").length;
					counter += $(this.containerId).find("[id=\""+relation.target+"\"]").addClass("highlighted").length;
				}
				if (new CreativeWork().isA(relation.type)) {
					counter += $(this.containerId).find("[id=\""+relation.url+"\"]").addClass("highlighted").length;
					if (relation.educationalAlignment != null)
						counter += $(this.containerId).find("[id=\""+relation.educationalAlignment.targetUrl+"\"]").addClass("highlighted").length;
				}
			}
			if (counter == 0 && this.relations != null)
			{
				for (var i = 0;i < this.relations.length;i++){
					var relation = this.relations[i];
					if (new Relation().isA(relation.type)) {
						counter += $(this.right.containerId).find("[id=\""+relation.source+"\"]").addClass("highlighted").length;
						counter += $(this.right.containerId).find("[id=\""+relation.target+"\"]").addClass("highlighted").length;
					}
					if (new CreativeWork().isA(relation.type)) {
						counter += $(this.right.containerId).find("[id=\""+relation.url+"\"]").addClass("highlighted").length;
						if (relation.educationalAlignment != null)
							counter += $(this.right.containerId).find("[id=\""+relation.educationalAlignment.targetUrl+"\"]").addClass("highlighted").length;
					}
				}
			}
		}
		if ((this.selected.length > 0 || selectedTotal == 0) && this.highlighted.length == 0 && this.left != null && this.left.relations != null && this.left.relations.length > 0)
		{
			var counter = 0;
			for (var i = 0;i < this.left.relations.length;i++){
				var relation = this.left.relations[i];
				if (new Relation().isA(relation.type)) {
					counter += $(this.containerId).find("[id=\""+relation.source+"\"]").addClass("highlighted").length;
					counter += $(this.containerId).find("[id=\""+relation.target+"\"]").addClass("highlighted").length;
				}
				if (new CreativeWork().isA(relation.type)) {
					counter += $(this.containerId).find("[id=\""+relation.url+"\"]").addClass("highlighted").length;
					if (relation.educationalAlignment != null)
						counter += $(this.containerId).find("[id=\""+relation.educationalAlignment.targetUrl+"\"]").addClass("highlighted").length;
				}
			}
			if (counter == 0 && this.relations != null)
			{
				for (var i = 0;i < this.relations.length;i++){
					var relation = this.relations[i];
					if (new Relation().isA(relation.type)) {
						counter += $(this.left.containerId).find("[id=\""+relation.source+"\"]").addClass("highlighted").length;
						counter += $(this.left.containerId).find("[id=\""+relation.target+"\"]").addClass("highlighted").length;
					}
					if (new CreativeWork().isA(relation.type)) {
						counter += $(this.left.containerId).find("[id=\""+relation.url+"\"]").addClass("highlighted").length;
						if (relation.educationalAlignment != null)
							counter += $(this.left.containerId).find("[id=\""+relation.educationalAlignment.targetUrl+"\"]").addClass("highlighted").length;
					}
				}
			}
		}
		$(this.containerId).find(".alignmentEditorElement small").remove();
		$(this.containerId).find(".alignmentEditorElement br").remove();
		for (var i = 0;i < this.highlighted.length;i++)
		{
			$(this.containerId).find("[id='"+this.highlighted[i].shortId()+"']").addClass("highlighted");
			var comments = this.idToComments[this.highlighted[i].shortId()];
			if (comments != null)
			{
				for (var j = 0;j < comments.length;j++)
					$(this.containerId).find("[id='"+this.highlighted[i].shortId()+"']").append("<br><small/>").children().last().text(comments[j]);
			}
		}
    }
    return AlignmentExplorerColumn;
})(AlignmentExplorerColumn);