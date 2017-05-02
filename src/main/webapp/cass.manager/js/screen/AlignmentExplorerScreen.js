AlignmentExplorerScreen = (function(AlignmentExplorerScreen){

	var columnCounter = 0;
	AlignmentExplorerScreen.prototype.createColumnDiv = function(){
		var col = $("#alignmentExplorerColumns").append('<div class="columns large-3"/>').children().last();

		var id = "alignmentExplorerColumn"+columnCounter++;
		col.attr("id",id);

		return "#"+id;
	}
	AlignmentExplorerScreen.prototype.reflow = function(){
		var ctr = $(".alignmentEditorContainer:visible");
		var ctrMinTop = canvas.height;
		var ctrMaxTop = 0;
		for (var i = 0;i < ctr.length;i++)
		{
			ctrMinTop = Math.min(ctrMinTop,$(ctr[i]).position().top);
			ctrMaxTop = Math.max(ctrMaxTop,$(ctr[i]).position().top);
		}
		$(".alignmentEditorContainer").css("height",window.innerHeight-ctrMinTop);
		for (var i = 0; i < this.columns.length; i++)
			this.columns[i].redrawJsInit();
		for (var i = 0; i < this.columns.length; i++)
			this.columns[i].redraw();
		for (var i = 0; i < this.columns.length; i++)
			this.columns[i].redrawJsFinal();
	}
	AlignmentExplorerScreen.prototype.bindControls = function(containerId){
		var me = this;
		setTimeout(function(){me.reflow()},100);
	}
	return AlignmentExplorerScreen;
})(AlignmentExplorerScreen);