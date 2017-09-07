AlignmentEditorColumn = (function (AlignmentEditorColumn) {
    var itemTemplate = "";
    var colors = {};
    var alpha = 0.1;
    colors[EcAlignment.IS_EQUIVALENT_TO] = 'rgba(0,0,0,' + alpha + ')';
    colors[EcAlignment.IS_RELATED_TO] = 'rgba(128,128,128,' + alpha + ')';//"gray";
    colors[EcAlignment.REQUIRES] = 'rgba(210,105,30,' + alpha + ')';//"chocolate";
    colors[EcAlignment.NARROWS] = 'rgba(0,0,255,' + alpha + ')';//"blue";
    colors[EcAlignment.DESIRES] = 'rgba(255,128,0,' + alpha + ')';//"orange";
    colors[EcAlignment.IS_ENABLED_BY] = 'rgba(128,0,128,' + alpha + ')';//"purple";
    colors["teaches"] = 'rgba(0,128,0,' + alpha + ')';//"green";
    colors["assesses"] = 'rgba(255,0,0,' + alpha + ')';//"red";
    colors["requires"] = 'rgba(210,105,30,' + alpha + ')';//"chocolate";
    colors["http://schema.cassproject.org/0.2/vocab/asserts"] = 'rgba(255,0,255,' + alpha + ')';//"Fuchsia";
    var highlightedColors = {};
    var alpha = 0.6;
    highlightedColors[EcAlignment.IS_EQUIVALENT_TO] = 'rgba(0,0,0,' + alpha + ')';
    highlightedColors[EcAlignment.IS_RELATED_TO] = 'rgba(128,128,128,' + alpha + ')';//"gray";
    highlightedColors[EcAlignment.REQUIRES] = 'rgba(210,105,30,' + alpha + ')';//"chocolate";
    highlightedColors[EcAlignment.NARROWS] = 'rgba(0,0,255,' + alpha + ')';//"blue";
    highlightedColors[EcAlignment.DESIRES] = 'rgba(255,128,0,' + alpha + ')';//"orange";
    highlightedColors[EcAlignment.IS_ENABLED_BY] = 'rgba(128,0,128,' + alpha + ')';//"purple";
    highlightedColors["teaches"] = 'rgba(0,128,0,' + alpha + ')';//"green";
    highlightedColors["assesses"] = 'rgba(255,0,0,' + alpha + ')';//"red";
    highlightedColors["requires"] = 'rgba(210,105,30,' + alpha + ')';//"chocolate";
    highlightedColors["http://schema.cassproject.org/0.2/vocab/asserts"] = 'rgba(255,0,255,' + alpha + ')';//"Fuchsia";
    var fillColors = {};
    alpha = 0.05;
    fillColors[EcAlignment.IS_EQUIVALENT_TO] = 'rgba(0,0,0,' + alpha + ')';
    fillColors[EcAlignment.IS_RELATED_TO] = 'rgba(128,128,128,' + alpha + ')';//"gray";
    fillColors[EcAlignment.REQUIRES] = 'rgba(210,105,30,' + alpha + ')';//"chocolate";
    fillColors[EcAlignment.NARROWS] = 'rgba(0,0,255,' + alpha + ')';//"blue";
    fillColors[EcAlignment.DESIRES] = 'rgba(255,128,0,' + alpha + ')';//"orange";
    fillColors[EcAlignment.IS_ENABLED_BY] = 'rgba(128,0,128,' + alpha + ')';//"purple";
    fillColors["teaches"] = 'rgba(0,128,0,' + alpha + ')';//"green";
    fillColors["assesses"] = 'rgba(255,0,0,' + alpha + ')';//"red";
    fillColors["requires"] = 'rgba(210,105,30,' + alpha + ')';//"chocolate";
    fillColors["http://schema.cassproject.org/0.2/vocab/asserts"] = 'rgba(255,0,255,' + alpha + ')';//"Fuchsia";
    var highlightedFillColors = {};
    alpha = 0.2;
    highlightedFillColors[EcAlignment.IS_EQUIVALENT_TO] = 'rgba(0,0,0,' + alpha + ')';
    highlightedFillColors[EcAlignment.IS_RELATED_TO] = 'rgba(128,128,128,' + alpha + ')';//"gray";
    highlightedFillColors[EcAlignment.REQUIRES] = 'rgba(210,105,30,' + alpha + ')';//"chocolate";
    highlightedFillColors[EcAlignment.NARROWS] = 'rgba(0,0,255,' + alpha + ')';//"blue";
    highlightedFillColors[EcAlignment.DESIRES] = 'rgba(255,128,0,' + alpha + ')';//"orange";
    highlightedFillColors[EcAlignment.IS_ENABLED_BY] = 'rgba(128,0,128,' + alpha + ')';//"purple";
    highlightedFillColors["teaches"] = 'rgba(0,128,0,' + alpha + ')';//"green";
    highlightedFillColors["assesses"] = 'rgba(255,0,0,' + alpha + ')';//"red";
    highlightedFillColors["requires"] = 'rgba(210,105,30,' + alpha + ')';//"chocolate";
    highlightedFillColors["http://schema.cassproject.org/0.2/vocab/asserts"] = 'rgba(255,0,255,' + alpha + ')';//"Fuchsia";

	var populated = {};
    AlignmentEditorColumn.prototype.populate = function () {
        var me = this;
        var container = $(me.containerId);
        var list = container.find(".alignmentEditorContainer");
        list.html("").hide();
        container.find(".loadingRow").show();
        populated = {};
        for (var i = 0; i < me.collection.length; i++) {
            var item = me.collection[i];
            var name;
            if(item.getName != undefined)
            	name = item.getName();
            else
            	name = item.name;
            
            if (name != null && me.filter != null && me.filter != "" && name.toLowerCase().indexOf(me.filter.toLowerCase()) == -1)
                continue;
            list.append(itemTemplate);
            var li = list.children().last();
            li.attr("id", item.shortId());
            if (item.name != null){
            	if(item.name["@value"] != null){
            		li.find("[ec-field='name']").text(item.getName());
            	}else{
            		li.find("[ec-field='name']").text(item.name);
            	}
            }
            	
			else if (item.url != null)
            	li.find("[ec-field='name']").text(item.url);
            else
            	li.find("[ec-field='name']").text("<Unknown>");
            if (item.url != null)
			if (populated[item.url] != null)
			{
				li.remove();
				continue;
			}
			populated[item.url] = true;
            li.click(function (evt) {
                var target = $(evt.currentTarget);
                me.selectElement(target.attr("id"));
                target.toggleClass("selected");
                if (me.screenHook != null)
                    me.screenHook();
            });
        }
        list.off("scroll");
        list.scroll(function () {
            me.redraw();
        });
        me.getRelations();
    }
    AlignmentEditorColumn.prototype.deselectAll = function () {
        var me = this;
        var container = $(me.containerId);
        container.find(".alignmentEditorElement.selected").trigger('click');
        me.selected = [];
    }
    AlignmentEditorColumn.prototype.redraw = function () {
        var me = this;
        var container = $(me.containerId);
        container.find(".alignmentEditorContainer").show();
        container.find(".loadingRow").hide();

        var allElementsMe = container.find(".alignmentEditorElement");
        if (me.left != null)
            me.left.redraw();
        if (me.right == null) return;
        var allElementsRight = $(me.right.containerId).find(".alignmentEditorElement");

        var margin = parseInt($("#alignmentEditorColumns").css("margin-bottom"));
        
        var canvas = $("#canvas")[0];
        var columns = $("#alignmentEditorColumns");
        canvas.style.width = $(canvas).parent().width() +"px";
        canvas.style.height = (columns.height() + margin)+"px";
        if (canvas.width != canvas.offsetWidth)
            canvas.width = canvas.offsetWidth;
        if (canvas.height != canvas.offsetHeight)
            canvas.height = columns.height()+margin;
        var ctx = $("#canvas")[0].getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgb(255,255,255)';
       
        ctx.fillRect(0, 0, canvas.width, canvas.height + margin);

        if (me.relations != null){
            for (var i = 0; i < me.relations.length; i++) {
                var relationType = me.relations[i].relationType;
                if (relationType == null)
                    if (me.relations[i].educationalAlignment != null)
                        relationType = me.relations[i].educationalAlignment.alignmentType;
                if (relationType == null)
                    continue;
                var leftId = me.relations[i].source;
                if (leftId == null)
                    leftId = me.relations[i].url;
                if (leftId == null)
                    continue;
                var rightId = me.relations[i].target;
                if (rightId == null)
                    if (me.relations[i].educationalAlignment != null)
                        rightId = me.relations[i].educationalAlignment.targetUrl;
                if (rightId == null)
                    continue;

                var left = container.find("[id='" + leftId + "']");
                var right = $(me.right.containerId + " [id='" + rightId + "']");
                if (left.length == 0) continue;
                if (right.length == 0) continue;

                var highlight = true;
                if (me.selected.length == 0 && me.right.selected.length == 0)
                    ctx.fillStyle = highlightedFillColors[me.relations[i].relationType];
                else {
                    highlight = false;
                    for (var j = 0; j < me.selected.length; j++) {
                        if (me.selected[j].shortId() == leftId)
                            highlight = true;
                        if (me.selected[j].shortId() == rightId)
                            highlight = true;
                    }
                    for (var j = 0; j < me.right.selected.length; j++) {
                        if (me.right.selected[j].shortId() == leftId)
                            highlight = true;
                        if (me.right.selected[j].shortId() == rightId)
                            highlight = true;
                    }
                }

                ctx.beginPath();
                if (highlight)
                    ctx.strokeStyle = highlightedColors[relationType];
                else
                    ctx.strokeStyle = colors[relationType];

                //Full box height method.
                var x1 = left.position().left + left.outerWidth() - $(canvas).position().left;
                var y1 = left.position().top + (left.outerHeight(true) - left.outerHeight(false)) / 2 - $(canvas).position().top;
                var x2 = right.position().left - $(canvas).position().left;
                var y2 = right.position().top + (right.outerHeight(true) - right.outerHeight(false)) / 2 - $(canvas).position().top;
                var x3 = x2;
                var y3 = right.position().top + right.outerHeight(true) - (right.outerHeight(true) - right.outerHeight(false)) / 2 - $(canvas).position().top;
                var x4 = x1;
                var y4 = left.position().top + left.outerHeight(true) - (left.outerHeight(true) - left.outerHeight(false)) / 2 - $(canvas).position().top;

                //Fixed height line method.
    //			var x1 = left.position().left+left.outerWidth();
    //			var y1 = left.position().top+left.outerHeight(true)/2-15;
    //			var x2 = right.position().left;
    //			var y2 = right.position().top+right.outerHeight(true)/2-15;
    //			var x3 = x2;
    //			var y3 = right.position().top+right.outerHeight(true)/2+15;
    //			var x4 = x1;
    //			var y4 = left.position().top+left.outerHeight(true)/2+15;
                ctx.moveTo(x1, y1);

    //			var xc = (x1 + x2) / 2;
    //			var yc = (y1 + y1 + y1 + y2) / 4;
    //
    //			var xd = (x1 + x2) / 2;
    //			var yd = (y1 + y2 + y2 + y2) / 4;
    //			ctx.quadraticCurveTo(xc,yc, x2, y2);
    //			ctx.bezierCurveTo(xc,yc, xd,yd,x2, y2);
                ctx.lineTo(x2, y2);
                ctx.lineTo(x3, y3);

    //			xc = (x3 + x4) / 2;
    //			yc = (y3 + y3 + y3 + y4) / 4;
    //			xd = (x3 + x4) / 2;
    //			yd = (y3 + y4 + y4 + y4) / 4;
    //			ctx.bezierCurveTo(xc,yc,xd,yd,x4,y4)
    //			ctx.quadraticCurveTo(xc,yc, x4, y4);
                ctx.lineTo(x4, y4);
                ctx.lineTo(x1, y1);
                ctx.closePath();
                if (highlight)
                    ctx.fillStyle = highlightedFillColors[relationType];
                else
                    ctx.fillStyle = fillColors[relationType];
                ctx.fill();
                ctx.stroke();
            }
            
            ctx.clearRect(0, canvas.height - margin, canvas.width, margin);
            ctx.fillStyle = 'rgb(255,255,255)';
           
            ctx.fillRect(0, canvas.height - margin, canvas.width, margin);
           
            if($("#mappingFrameworkColumn").is(":visible")){
            	ctx.clearRect(0, 0, canvas.width,  $("#mappingFrameworkColumn").height());
                ctx.fillStyle = 'rgb(255,255,255)';
               
                ctx.fillRect(0, 0, canvas.width, $("#mappingFrameworkColumn").height());
            }
            
        }
        
//        for (var i = 0;i < allElementsMe.length;i++)
//        {
//        	for (var j = 0;j < allElementsRight.length;j++)
//        	{
//        		var mine = $(allElementsMe[i]);
//        		var right = $(allElementsRight[j]);
//        		var pointA = {left:mine.position().left+mine.outerWidth(),top:mine.position().top+mine.outerHeight(true)/2};
//        		var pointB = {left:right.position().left,top:right.position().top+right.outerHeight(true)/2};
//				ctx.beginPath();
//        		ctx.fillStyle="#000000";
//        		ctx.moveTo(pointA.left,pointA.top);
//        		ctx.lineTo(pointB.left,pointB.top);
//        		ctx.stroke();
//        	}
//        }
    }
    AlignmentEditorColumn.prototype.bindControls = function (containerId) {
        var me = this;
        var container = $(containerId);
        itemTemplate = container.find(".alignmentEditorContainer").html();
        container.find(".alignmentEditorContainer").html("");
        container.find(".alignmentEditorCategory").change(function (evt) {
            var selectedCategory = container.find(".alignmentEditorCategory option:selected").val();
            container.find(".alignmentEditorCollection").hide();
            container.find(".alignmentEditorContainer").hide();
            container.find(".alignmentEditorContainer").html("");
            container.find(".columnFilter").addClass("hide");
            var source = container.find(".alignmentEditorSource");
            source.html("<option disabled selected value> -- Select Source -- </option>").show();
            var lookup = {
            	"course":"Courses",
            	"competency":"Frameworks",
            	"credential":"Credentials",
            	"badge":"Badges",
            	"resource":"Resources"
            };
            for (var name in AppController.serverController.serverList)
    			source.append("<option/>").children().last().attr("value", AppController.serverController.serverList[name]).text(name + " " + lookup[selectedCategory]);
            me.redraw();
        });
        container.find(".alignmentEditorSource").change(function (evt) {
            var selectedCategory = container.find(".alignmentEditorCategory option:selected").val();
            var selectedSource = container.find(".alignmentEditorSource option:selected").val();
            var collection = container.find(".alignmentEditorCollection");
            container.find(".alignmentEditorContainer").hide();
            collection.html("<option disabled selected value> -- Select Framework -- </option>").hide();
            me.selectedCategory = selectedCategory;
            me.selectedSource = selectedSource;
            me.sourceRepo = new EcRepository();
            me.sourceRepo.selectedServer = selectedSource;
            me.sourceRepo.autoDetectRepository();
            if (selectedCategory == "course") {
                me.populateListCourses();
            }
            if (selectedCategory == "competency") {
            	container.find(".alignmentEditorContainer").html("");
            	container.find(".columnFilter").addClass("hide");
                EcFramework.search(me.sourceRepo, "", function (ary) {
                    for (var i = 0; i < ary.length; i++) {
                        var framework = ary[i];
                        collection.append("<option/>").children().last().attr("value", framework.shortId()).text(framework.getName());
                    }
                    collection.show();
                    me.redraw();
                }, function (error) {
                },{size:5000});
            }else{
            	var sourceName = container.find(".alignmentEditorSource option:selected").text();
                container.find(".alignmentEditorColumnSelectCollapsed").html("<i class='fa fa-caret-right'></i> "+sourceName);
            	container.find(".alignmentEditorColumnSelects").slideUp(function () {
	                me.redraw();
	                if (me.screenHook != null)
	                    me.screenHook();
	            });
            	if(selectedSource != undefined && selectedSource != ""){
                	container.find(".columnFilter").removeClass("hide");
                	container.find(".alignmentEditorColumnSelectCollapsed").addClass("navigationHidden");
                }
            }
            if (selectedCategory == "credential") {
                me.populateListCredentials();
            }
            if (selectedCategory == "badge") {
                me.populateListBadges();
            }
            if (selectedCategory == "resource") {
                me.populateListResources();
            }
            me.redraw();
            container.find(".alignmentEditorContainer").hide();
            container.find(".loadingRow").show();
        });
        container.find(".alignmentEditorCollection").change(function (evt) {
            var selectedCategory = container.find(".alignmentEditorCategory option:selected").val();
            var selectedSource = container.find(".alignmentEditorSource option:selected").val();
            var selectedCollection = container.find(".alignmentEditorCollection option:selected").val();
            container.find(".alignmentEditorContainer").hide();
            me.selectedCategory = selectedCategory;
            me.selectedSource = selectedSource;
            me.selectedCollection = selectedCollection;
            if (selectedCategory == "course") {
                me.populateListCourses();
            }
            if (selectedCategory == "competency") {
                me.populateListCompetencies();
                
                var sourceName = container.find(".alignmentEditorSource option:selected").text().substring(0, container.find(".alignmentEditorSource option:selected").text().length - 11);
            	var collectionName = container.find(".alignmentEditorCollection option:selected").text()
                container.find(".alignmentEditorColumnSelectCollapsed").html("<i class='fa fa-caret-right'></i> "+sourceName+" : "+collectionName);
            	container.find(".alignmentEditorColumnSelects").slideUp(function () {
	                me.redraw();
	                if (me.screenHook != null)
	                    me.screenHook();
	            });
            }
            if (selectedCategory == "badge") {
                me.populateListBadges();
            }
            if (selectedCategory == "credential") {
                me.populateListCredentials();
            }
            if (selectedCategory == "resource") {
                me.populateListResources();
            }
            me.redraw();
            if (!container.find(".alignmentEditorColumnSelectCollapsed").hasClass("navigationHidden")){
	        	container.find(".alignmentEditorColumnSelectCollapsed").addClass("navigationHidden");
	        	container.find(".columnFilter").removeClass("hide");
	        }
        });
        container.find(".columnFilter").keyup(function (evt) {
            me.deselectAll();
            me.filter = container.find(".columnFilter").val();
            me.populate();
        })
        container.find(".alignmentEditorColumnSelectCollapsed").click(function (evt) {
            me.toggleNavigation(evt);
        });
    }
    AlignmentEditorColumn.prototype.toggleNavigation = function (evt) {
        var me = this;
        var container = $(me.containerId);
        if (container.find(".alignmentEditorColumnSelectCollapsed").hasClass("navigationHidden")){
        	var text = container.find(".alignmentEditorColumnSelectCollapsed").text();
        	container.find(".alignmentEditorColumnSelectCollapsed").html("<i class='fa fa-caret-down'></i> "+text);
        	container.find(".alignmentEditorColumnSelectCollapsed").removeClass("navigationHidden");
        	
        	var selectedCategory = container.find(".alignmentEditorCategory option:selected").val();
            var selectedSource = container.find(".alignmentEditorSource option:selected").val();
            var selectedCollection = container.find(".alignmentEditorCollection option:selected").val();
            
            if((selectedCategory == "competency" && selectedCollection != undefined && selectedCollection != "") 
            		|| (selectedCategory != "competency" && selectedSource != undefined && selectedSource != "")){
            	container.find(".columnFilter").removeClass("hide");
            }else{
            	container.find(".columnFilter").addClass("hide");
            }
        	
        }else{
        	var text = container.find(".alignmentEditorColumnSelectCollapsed").text();
        	container.find(".alignmentEditorColumnSelectCollapsed").html("<i class='fa fa-caret-right'></i> "+text);
        	container.find(".alignmentEditorColumnSelectCollapsed").addClass("navigationHidden");
        }
            
        container.find(".alignmentEditorColumnSelects").slideToggle(function () {
            me.redraw();
            if (me.screenHook != null)
                me.screenHook();
        });

    }
    return AlignmentEditorColumn;
})(AlignmentEditorColumn);
