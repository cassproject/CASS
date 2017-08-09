/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
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