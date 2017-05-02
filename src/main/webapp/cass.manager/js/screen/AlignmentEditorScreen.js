AlignmentEditorScreen = (function(AlignmentEditorScreen){

	var columnCounter = 0;
	AlignmentEditorScreen.prototype.createColumnDiv = function(){
		var col = $("#alignmentEditorColumns").append('<div class="columns large-4"/>').children().last();

		var id = "alignmentEditorColumn"+columnCounter++;
		col.attr("id",id);

		return "#"+id;
	}
	AlignmentEditorScreen.prototype.updateControls = function(){
		$(this.containerId+" #alignmentEditorControls button").attr("disabled","true");
		if (this.columns.length != 2)
			return;
		if (this.columns[0].selected.length > 0)
			$("#alignmentEditorDeselectLeft").attr("disabled",null);
		if (this.columns[1].selected.length > 0)
			$("#alignmentEditorDeselectRight").attr("disabled",null);
		if (this.columns[0].collection.length == 0)
			return;
		if (this.columns[1].collection.length == 0)
			return;
		if (this.columns[0].selected.length == 0)
			return;
		if (this.columns[1].selected.length == 0)
			return;
		var leftType = this.columns[0].selectedCategory;
		var rightType = this.columns[1].selectedCategory;
		if (leftType == "course")
		{
			if (rightType == "course")
			{
				$("#alignmentEditorEquivalent").attr("disabled",null);
				$("#alignmentEditorTeaches").attr("disabled",null);
				$("#alignmentEditorRequires").attr("disabled",null);
			}
			if (rightType == "competency")
			{
				$("#alignmentEditorTeaches").attr("disabled",null);
				$("#alignmentEditorAssesses").attr("disabled",null);
				$("#alignmentEditorRequires").attr("disabled",null);
			}
			if (rightType == "credential")
			{
				$("#alignmentEditorGrants").attr("disabled",null);
				$("#alignmentEditorRequires").attr("disabled",null);
			}
			if (rightType == "resource")
			{
				$("#alignmentEditorTeaches").attr("disabled",null);
				$("#alignmentEditorRequires").attr("disabled",null);
			}
		}
		if (leftType == "credential")
		{
			if (rightType == "course")
			{
				$("#alignmentEditorRequires").attr("disabled",null);
			}
			if (rightType == "competency")
			{
				$("#alignmentEditorAsserts").attr("disabled",null);
				$("#alignmentEditorGrants").attr("disabled",null);
				$("#alignmentEditorRequires").attr("disabled",null);
			}
			if (rightType == "credential")
			{
				$("#alignmentEditorEquivalent").attr("disabled",null);
				$("#alignmentEditorGrants").attr("disabled",null);
				$("#alignmentEditorRequires").attr("disabled",null);
			}
			if (rightType == "resource")
			{
			}
		}
		if (leftType == "competency")
		{
			if (rightType == "competency")
			{
				$("#alignmentEditorEquivalent").attr("disabled",null);
				$("#alignmentEditorRelated").attr("disabled",null);
				$("#alignmentEditorRequires").attr("disabled",null);
				$("#alignmentEditorNarrows").attr("disabled",null);
				$("#alignmentEditorDesires").attr("disabled",null);
				$("#alignmentEditorEnables").attr("disabled",null);
			}
		}
		if (leftType == "resource")
		{
			if (rightType == "course")
			{
				$("#alignmentEditorRequires").attr("disabled",null);
			}
			if (rightType == "competency")
			{
				$("#alignmentEditorTeaches").attr("disabled",null);
				$("#alignmentEditorAssesses").attr("disabled",null);
				$("#alignmentEditorRequires").attr("disabled",null);
			}
			if (rightType == "credential")
			{
				$("#alignmentEditorRequires").attr("disabled",null);
			}
			if (rightType == "resource")
			{
				$("#alignmentEditorEquivalent").attr("disabled",null);
				$("#alignmentEditorRequires").attr("disabled",null);
			}
		}
		if (leftType == "badge")
		{
			if (rightType == "competency")
			{
				$("#alignmentEditorAsserts").attr("disabled",null);
			}
		}
	}
	AlignmentEditorScreen.prototype.reflow = function(){
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
			this.columns[i].redraw();
	}

	AlignmentEditorScreen.prototype.bindControls = function(containerId){
		var me = this;
		var resizer = function(evt){
			me.reflow();
		};
		$(window).resize(resizer);
		var controls = $(containerId+" #alignmentEditorControls");
		controls.append("<button class='button' id='alignmentEditorDeselectLeft' disabled title='Deselect all items on the left side.'>"+"Left: Deselect All"+"</button>").children().last().click(function(evt){
			me.columns[0].deselectAll();
		});
		controls.append("<button class='button' id='alignmentEditorEquivalent' style='background:black;' disabled title='Items on the left are de-facto or functionally equivalent to items on the right.'>"+"Equivalent"+"</button>").children().last().click(function(evt){
			me.createRelations(Relation.IS_EQUIVALENT_TO);
		});
		controls.append("<button class='button' id='alignmentEditorRelated' style='background:gray;' disabled title='Items on the left and right are related in some non-functional way.'>"+"Related To"+"</button>").children().last().click(function(evt){
			me.createRelations(Relation.IS_RELATED_TO);
		});
		controls.append("<button class='button' id='alignmentEditorNarrows' style='background:blue;' disabled title='Items on the left are sub-items of items on the right.'>"+"Narrows"+"</button>").children().last().click(function(evt){
			me.createRelations(Relation.NARROWS);
		});
		controls.append("<button class='button' id='alignmentEditorDesires' style='background:orange;color:black;' disabled title='Items on the left are positively influenced by items on the right.'>"+"Desires"+"</button>").children().last().click(function(evt){
			me.createRelations(Relation.DESIRES);
		});
		controls.append("<button class='button' id='alignmentEditorRequires' style='background:chocolate;' disabled title='Items on the left require items on the right for completion.'>"+"Requires"+"</button>").children().last().click(function(evt){
			me.createRelations(Relation.REQUIRES);
			me.createAlignments("requires");
		});
		controls.append("<button class='button' id='alignmentEditorTeaches' style='background:green;' disabled title='Items on the left teach about items on the right.'>"+"Teaches"+"</button>").children().last().click(function(evt){
			me.createAlignments("teaches");
		});
		controls.append("<button class='button' id='alignmentEditorAssesses' style='background:red;' disabled title='Items on the left assess knowledge about items on the right.'>"+"Assesses"+"</button>").children().last().click(function(evt){
			me.createAlignments("assesses");
		});
		controls.append("<button class='button' id='alignmentEditorAsserts' style='background:pink;' disabled title='Items on the left assess knowledge about items on the right.'>"+"Asserts"+"</button>").children().last().click(function(evt){
			me.createAlignments("http://schema.cassproject.org/0.2/vocab/asserts");
		});
		controls.append("<button class='button' id='alignmentEditorDeselectRight' disabled title='Deselect all items on the right side.'>"+"Right: Deselect All"+"</button>").children().last().click(function(evt){
			me.columns[1].deselectAll();
        });
		controls.append("<button class='button' id='alignmentEditorHelp' disabled style='float:right;'>"+"?"+"</button>");

		setTimeout(function(){me.reflow()},100);
	}
	return AlignmentEditorScreen;
})(AlignmentEditorScreen);