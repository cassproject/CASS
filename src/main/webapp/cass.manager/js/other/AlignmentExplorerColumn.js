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
    	me = this;
    	if (selectedTotal == 0)
			if ($(this.containerId).find(".alignmentEditorElement.highlighted").length == 0)
				$(this.containerId).find(".alignmentEditorElement").addClass("highlighted");
		if (me.left == null && me.right == null)
			$(this.containerId).find(".alignmentEditorElement").addClass("highlighted");
    }
    AlignmentExplorerColumn.prototype.redrawJs = function () {
    	var selected = [];
    	var leftContainerId = null;
		var me=this;
		while (me != null)
		{
			selected = selected.concat(me.selected);
			leftContainerId = me.containerId;
			me=me.left;
		}
		me = this.right;
		while (me != null)
		{
			selected = selected.concat(me.selected);
			me=me.right;
		}
		for (var i = 0;i < selected.length;i++)
			$("[id=\""+selected[i].shortId()+"\"]").addClass("highlighted");
		if (this.relations != null)
			for (var i = 0;i < this.relations.length;i++){
				var relation = this.relations[i];
				if (new Relation().isA(relation.type)) {

					var src = $("[id=\""+relation.source+"\"]");
					if (src.length == 0) continue;
					var tgt = $("[id=\""+relation.target+"\"]");
					if (tgt.length == 0) continue;
					if ($(leftContainerId).find("[id=\""+relation.source+"\"]").length > 0)
						src.addClass("highlighted");
					if ($(leftContainerId).find("[id=\""+relation.target+"\"]").length > 0)
						tgt.addClass("highlighted");
					if (src.hasClass("highlighted") == false && selected.length > 0)
						continue;
					if (tgt.hasClass("highlighted") == false && selected.length > 0)
						continue;
					src.addClass("highlighted");
					tgt.addClass("highlighted");
				}
				if (new CreativeWork().isA(relation.type)) {
					var src = $("[id=\""+relation.url+"\"]");
					if (src.length == 0) continue;
					if (relation.educationalAlignment == null) continue;
					var tgt = $("[id=\""+relation.educationalAlignment.targetUrl+"\"]");
					if (tgt.length == 0) continue;
					if ($(leftContainerId).find("[id=\""+relation.url+"\"]").length > 0)
						src.addClass("highlighted");
					if ($(leftContainerId).find("[id=\""+relation.educationalAlignment.targetUrl+"\"]").length > 0)
						tgt.addClass("highlighted");
					if (src.hasClass("highlighted") == false && selected.length > 0)
						continue;
					if (tgt.hasClass("highlighted") == false && selected.length > 0)
						continue;
					src.addClass("highlighted");
					tgt.addClass("highlighted");
				}
			}

//		if ((this.selected.length > 0 || selectedTotal == 0) && this.highlighted.length == 0 && this.right != null && this.right.relations != null && this.right.relations.length > 0)
//		{
//			var counter = 0;
//			for (var i = 0;i < this.right.relations.length;i++){
//				var relation = this.right.relations[i];
//				if (new Relation().isA(relation.type)) {
//					counter += $(this.containerId).find("[id=\""+relation.source+"\"]").addClass("highlighted").length;
//					counter += $(this.containerId).find("[id=\""+relation.target+"\"]").addClass("highlighted").length;
//				}
//				if (new CreativeWork().isA(relation.type)) {
//					counter += $(this.containerId).find("[id=\""+relation.url+"\"]").addClass("highlighted").length;
//					if (relation.educationalAlignment != null)
//						counter += $(this.containerId).find("[id=\""+relation.educationalAlignment.targetUrl+"\"]").addClass("highlighted").length;
//				}
//			}
//			if (counter == 0 && this.relations != null)
//			{
//				for (var i = 0;i < this.relations.length;i++){
//					var relation = this.relations[i];
//					if (new Relation().isA(relation.type)) {
//						counter += $(this.right.containerId).find("[id=\""+relation.source+"\"]").addClass("highlighted").length;
//						counter += $(this.right.containerId).find("[id=\""+relation.target+"\"]").addClass("highlighted").length;
//					}
//					if (new CreativeWork().isA(relation.type)) {
//						counter += $(this.right.containerId).find("[id=\""+relation.url+"\"]").addClass("highlighted").length;
//						if (relation.educationalAlignment != null)
//							counter += $(this.right.containerId).find("[id=\""+relation.educationalAlignment.targetUrl+"\"]").addClass("highlighted").length;
//					}
//				}
//			}
//		}
//		if ((this.selected.length > 0 || selectedTotal == 0) && this.highlighted.length == 0 && this.left != null && this.left.relations != null && this.left.relations.length > 0)
//		{
//			var counter = 0;
//			for (var i = 0;i < this.left.relations.length;i++){
//				var relation = this.left.relations[i];
//				if (new Relation().isA(relation.type)) {
//					counter += $(this.containerId).find("[id=\""+relation.source+"\"]").addClass("highlighted").length;
//					counter += $(this.containerId).find("[id=\""+relation.target+"\"]").addClass("highlighted").length;
//				}
//				if (new CreativeWork().isA(relation.type)) {
//					counter += $(this.containerId).find("[id=\""+relation.url+"\"]").addClass("highlighted").length;
//					if (relation.educationalAlignment != null)
//						counter += $(this.containerId).find("[id=\""+relation.educationalAlignment.targetUrl+"\"]").addClass("highlighted").length;
//				}
//			}
//			if (counter == 0 && this.relations != null)
//			{
//				for (var i = 0;i < this.relations.length;i++){
//					var relation = this.relations[i];
//					if (new Relation().isA(relation.type)) {
//						counter += $(this.left.containerId).find("[id=\""+relation.source+"\"]").addClass("highlighted").length;
//						counter += $(this.left.containerId).find("[id=\""+relation.target+"\"]").addClass("highlighted").length;
//					}
//					if (new CreativeWork().isA(relation.type)) {
//						counter += $(this.left.containerId).find("[id=\""+relation.url+"\"]").addClass("highlighted").length;
//						if (relation.educationalAlignment != null)
//							counter += $(this.left.containerId).find("[id=\""+relation.educationalAlignment.targetUrl+"\"]").addClass("highlighted").length;
//					}
//				}
//			}
//		}
		$(this.containerId).find(".alignmentEditorElement ul li").remove();
		for (var i = 0;i < this.highlighted.length;i++)
		{
			$(this.containerId).find("[id='"+this.highlighted[i].shortId()+"']").addClass("highlighted");
			var comments = this.idToComments[this.highlighted[i].shortId()];
			if (comments != null)
			{
				for (var j = 0;j < comments.length;j++)
				{
					var comment = $(this.containerId).find("[id='"+this.highlighted[i].shortId()+"'] ul").append("<li/>").children().last();
					comment.text(comments[j]);
					if (this.idToCommentHighlight[comments[j]] == true)
                    	comment.addClass("fulfilled");

				}
			}
		}
    }
    return AlignmentExplorerColumn;
})(AlignmentExplorerColumn);