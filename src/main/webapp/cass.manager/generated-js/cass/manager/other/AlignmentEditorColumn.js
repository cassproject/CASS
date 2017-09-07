/**
 *  Created by fray on 3/10/17.
 */
var AlignmentEditorColumn = function() {
    EcView.call(this);
    this.collection = new Array();
    this.selected = new Array();
    this.highlighted = new Array();
};
AlignmentEditorColumn = stjs.extend(AlignmentEditorColumn, EcView, [], function(constructor, prototype) {
    constructor.COMPETENCY = Competency.myType;
    constructor.CREDENTIAL = new Credential().type;
    constructor.COURSE = new Course().type;
    constructor.RESOURCE = new CreativeWork().type;
    constructor.BADGE = new Badge().type;
    prototype.columnIndex = -1;
    prototype.containerId = null;
    prototype.getHtmlLocation = function() {
        return "partial/other/alignmentEditor.html";
    };
    prototype.selectedCategory = null;
    prototype.selectedSource = null;
    prototype.selectedCollection = null;
    prototype.sourceRepo = null;
    prototype.filter = null;
    prototype.type = null;
    prototype.urlCollectionIdentifier = null;
    prototype.collectionSearchString = null;
    prototype.collection = null;
    prototype.selected = null;
    prototype.highlighted = null;
    prototype.weight = null;
    prototype.lift = null;
    prototype.relations = null;
    prototype.left = null;
    prototype.right = null;
    prototype.screenHook = null;
    prototype.display = function(containerId) {
        this.containerId = containerId;
        this.bindControls(containerId);
    };
    prototype.bindControls = function(containerId) {};
    prototype.toggleNavigation = function() {};
    prototype.getType = function() {
        if (this.selectedCategory == "course") 
            return AlignmentEditorColumn.COURSE;
        if (this.selectedCategory == "competency") 
            return AlignmentEditorColumn.COMPETENCY;
        if (this.selectedCategory == "credential") 
            return AlignmentEditorColumn.CREDENTIAL;
        if (this.selectedCategory == "resource") 
            return AlignmentEditorColumn.RESOURCE;
        if (this.selectedCategory == "badge") 
            return AlignmentEditorColumn.BADGE;
        return null;
    };
    prototype.populate = function() {};
    prototype.redraw = function() {};
    prototype.redrawJs = function() {};
    prototype.redrawJsInit = function() {};
    prototype.redrawJsFinal = function() {};
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
    prototype.selectedEvent = function(id, propegatesRight) {};
    prototype.deselectedEvent = function(id, propegatesRight) {};
    prototype.populateListCourses = function() {
        var me = this;
        var params = new Object();
        (params)["size"] = 5000;
        this.sourceRepo.searchWithParams("@type:Course", params, function(ecRemoteLinkedData) {}, function(strings) {
            me.collection = strings;
            me.selected = new Array();
            me.highlighted = new Array();
            me.populate();
        }, function(s) {});
    };
    prototype.populateListCredentials = function() {
        var me = this;
        var params = new Object();
        (params)["size"] = 5000;
        this.sourceRepo.searchWithParams("@type:Credential", params, function(ecRemoteLinkedData) {}, function(credentials) {
            me.collection = credentials;
            me.selected = new Array();
            me.highlighted = new Array();
            me.populate();
        }, function(s) {});
    };
    prototype.populateListBadges = function() {
        var me = this;
        var params = new Object();
        (params)["size"] = 5000;
        this.sourceRepo.searchWithParams("@type:Badge", params, function(ecRemoteLinkedData) {}, function(badges) {
            me.collection = badges;
            me.selected = new Array();
            me.highlighted = new Array();
            me.populate();
        }, function(s) {});
    };
    prototype.populateListCompetencies = function() {
        var me = this;
        EcFramework.get(this.selectedCollection, function(framework) {
            var eah = new EcAsyncHelper();
            me.collection = new Array();
            me.selected = new Array();
            me.highlighted = new Array();
            if (framework.competency != undefined && framework.competency != null) {
                eah.each(framework.competency, function(s, callback0) {
                    EcCompetency.get(s, function(ecCompetency) {
                        me.collection.push(ecCompetency);
                        callback0();
                    }, function(s) {
                        callback0();
                    });
                }, function(strings) {
                    me.populate();
                });
            } else {
                me.populate();
            }
        }, function(s) {});
    };
    prototype.getRelations = function() {
        var query = "";
        var me = this;
        if (me.selectedCategory == "competency") {
            for (var i = 0; i < me.collection.length; i++) {
                if (i > 0) 
                    query += " OR ";
                query += "source:\"" + me.collection[i].shortId() + "\"";
            }
            var params = new Object();
            (params)["size"] = 5000;
            EcAlignment.search(this.sourceRepo, query, function(strings) {
                me.relations = strings;
                if (me.screenHook != null) 
                    me.screenHook();
                 else 
                    me.redraw();
            }, function(s) {}, params);
        } else {
            for (var i = 0; i < me.collection.length; i++) {
                if (i > 0) 
                    query += " OR ";
                query += "url:\"" + me.collection[i].shortId() + "\"";
            }
            if (query != null && query != "") 
                query = "(" + query + ") AND " + new CreativeWork().getSearchStringByType();
             else 
                query = new CreativeWork().getSearchStringByType();
            var params = new Object();
            (params)["size"] = 5000;
            me.relations = new Array();
            me.sourceRepo.searchWithParams(query, params, function(ecRemoteLinkedData) {
                var cw = new CreativeWork();
                cw.copyFrom(ecRemoteLinkedData);
                me.relations.push(cw);
            }, function(strings) {
                if (me.screenHook != null) 
                    me.screenHook();
                 else 
                    me.redraw();
            }, function(s) {});
        }
    };
    prototype.populateListResources = function() {
        var me = this;
        var params = new Object();
        (params)["size"] = 5000;
        this.sourceRepo.searchWithParams(new CreativeWork().getSearchStringByType(), params, function(ecRemoteLinkedData) {}, function(strings) {
            me.collection = strings;
            me.selected = new Array();
            me.highlighted = new Array();
            me.populate();
        }, function(s) {});
    };
}, {sourceRepo: "EcRepository", collection: {name: "Array", arguments: ["Thing"]}, selected: {name: "Array", arguments: ["Thing"]}, highlighted: {name: "Array", arguments: ["Thing"]}, weight: {name: "Map", arguments: [null, null]}, lift: {name: "Map", arguments: [null, null]}, relations: {name: "Array", arguments: ["Thing"]}, left: "AlignmentEditorColumn", right: "AlignmentEditorColumn", screenHook: "Callback0"}, {});
