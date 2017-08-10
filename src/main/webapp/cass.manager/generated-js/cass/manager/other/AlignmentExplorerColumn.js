/**
 *  Created by fray on 3/23/17.
 */
var AlignmentExplorerColumn = function() {
    AlignmentEditorColumn.call(this);
};
AlignmentExplorerColumn = stjs.extend(AlignmentExplorerColumn, AlignmentEditorColumn, [], function(constructor, prototype) {
    prototype.idToComments = null;
    prototype.idToCommentHighlight = null;
    prototype.selectElement = function(id) {
        for (var i = 0; i < this.selected.length; i++) 
            if (this.selected[i].shortId() == id) {
                this.selected.splice(i, 1);
                if (this.right != null) 
                    this.right.deselectedEvent(id, true);
                if (this.left != null) 
                    this.left.deselectedEvent(id, false);
                return;
            }
        for (var i = 0; i < this.collection.length; i++) 
            if (this.collection[i].shortId() == id) {
                this.selected.push(this.collection[i]);
                if (this.right != null) 
                    this.right.selectedEvent(id, true);
                if (this.left != null) 
                    this.left.selectedEvent(id, false);
                return;
            }
    };
    prototype.selectedEvent = function(id, propegatesRight) {
        if (this.screenHook != null) 
            this.screenHook();
    };
    prototype.redraw = function() {
        var sel = null;
        if (this.left != null) 
            sel = this.left.selected;
        var rels = this.relations;
        if (rels == null) 
            rels = new Array();
        if (this.left != null) 
            rels = rels.concat(this.left.relations);
        if (sel != null) {
            this.idToComments = new Object();
            this.idToCommentHighlight = new Object();
            this.highlighted = new Array();
            for (var i = 0; i < sel.length; i++) {
                var t = sel[i];
                this.highlight(t, rels, new Array());
            }
            this.selected = this.highlighted;
        }
        this.redrawJs();
    };
    prototype.redrawJs = function() {};
    prototype.redrawJsInit = function() {};
    prototype.appendComment = function(id, comment) {
        var tray = (this.idToComments)[id];
        if (tray == null) {
            tray = new Array();
            (this.idToComments)[id] = tray;
        }
        EcArray.setAdd(tray, comment);
    };
    prototype.highlightComment = function(id) {
        var tray = (this.idToComments)[id];
        if (tray == null) {
            (this.idToCommentHighlight)[id] = true;
        }
    };
    prototype.highlight = function(selectedItem, rels, walked) {
        if (EcArray.has(walked, selectedItem)) 
            return;
        walked.push(selectedItem);
        if (!EcArray.has(this.highlighted, selectedItem)) 
            if (EcArray.has(this.collection, selectedItem)) 
                this.highlighted.push(selectedItem);
        for (var j = 0; j < rels.length; j++) {
            var relation = rels[j];
            if (new Relation().isA(relation.type)) {
                var r = relation;
                if (selectedItem.shortId() == r.source || selectedItem.shortId() == r.target) {
                    var relationOk = false;
                    var comment = "";
                    if (selectedItem.shortId() == r.target && r.relationType == Relation.NARROWS) {
                        relationOk = true;
                        comment = "Subcompetency of " + (EcRepository.getBlocking(r.target)).name;
                    }
                    if (r.relationType == Relation.IS_EQUIVALENT_TO) {
                        relationOk = true;
                        comment = "Equivalent competency.";
                    }
                    if (selectedItem.shortId() == r.source && r.relationType == Relation.REQUIRES) {
                        relationOk = true;
                        comment = "Required by " + (EcRepository.getBlocking(r.source)).name;
                    }
                    if (relationOk) 
                        for (var k = 0; k < this.collection.length; k++) {
                            var candidate = this.collection[k];
                            if (candidate.shortId() == r.source || candidate.shortId() == r.target) {
                                this.appendComment(selectedItem.shortId(), comment);
                                EcArray.setAdd(this.highlighted, candidate);
                                this.highlight(candidate, rels, walked);
                            }
                        }
                }
            }
            if (new CreativeWork().isA(relation.type)) {
                var r = relation;
                if (r.educationalAlignment != null) 
                    if (selectedItem.shortId() == r.url || selectedItem.shortId() == r.educationalAlignment.targetUrl) {
                        for (var k = 0; k < this.collection.length; k++) {
                            var candidate = this.collection[k];
                            if (candidate.shortId() == r.url || candidate.shortId() == r.educationalAlignment.targetUrl) {
                                var comment = "";
                                if (candidate.shortId() == r.url) {
                                    if (r.educationalAlignment.alignmentType == "requires") 
                                        comment = "Requires " + (EcRepository.getBlocking(r.educationalAlignment.targetUrl)).name;
                                    if (r.educationalAlignment.alignmentType == "teaches") 
                                        comment = "Teaches " + (EcRepository.getBlocking(r.educationalAlignment.targetUrl)).name;
                                    if (r.educationalAlignment.alignmentType == "assesses") 
                                        comment = "Assesses " + (EcRepository.getBlocking(r.educationalAlignment.targetUrl)).name;
                                    if (r.educationalAlignment.alignmentType == "http://schema.cassproject.org/0.2/vocab/asserts") 
                                        comment = "Asserts " + (EcRepository.getBlocking(r.educationalAlignment.targetUrl)).name;
                                    if (selectedItem.shortId() == r.educationalAlignment.targetUrl) 
                                        this.highlightComment(comment);
                                }
                                if (candidate.shortId() == r.educationalAlignment.targetUrl) {
                                    if (r.educationalAlignment.alignmentType == "requires") 
                                        comment = "Required by " + (EcRepository.getBlocking(r.url)).name;
                                    if (r.educationalAlignment.alignmentType == "teaches") 
                                        comment = "Taught by " + (EcRepository.getBlocking(r.url)).name;
                                    if (r.educationalAlignment.alignmentType == "assesses") 
                                        comment = "Assessed by " + (EcRepository.getBlocking(r.url)).name;
                                    if (r.educationalAlignment.alignmentType == "http://schema.cassproject.org/0.2/vocab/asserts") 
                                        comment = "Asserted by " + (EcRepository.getBlocking(r.url)).name;
                                    if (selectedItem.shortId() == r.url) 
                                        this.highlightComment(comment);
                                }
                                if (comment != "") 
                                    this.appendComment(selectedItem.shortId(), comment);
                                EcArray.setAdd(this.highlighted, candidate);
                                this.highlight(candidate, rels, walked);
                            }
                        }
                    }
            }
        }
    };
    prototype.deselectedEvent = function(id, propegatesRight) {
        this.selectedEvent(id, propegatesRight);
    };
}, {idToComments: "Object", idToCommentHighlight: "Object", sourceRepo: "EcRepository", collection: {name: "Array", arguments: ["Thing"]}, selected: {name: "Array", arguments: ["Thing"]}, highlighted: {name: "Array", arguments: ["Thing"]}, weight: {name: "Map", arguments: [null, null]}, lift: {name: "Map", arguments: [null, null]}, relations: {name: "Array", arguments: ["Thing"]}, left: "AlignmentEditorColumn", right: "AlignmentEditorColumn", screenHook: "Callback0"}, {});
