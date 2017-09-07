var AlignmentEditorScreen = function() {
    CassManagerScreen.call(this);
    this.columns = new Array();
};
AlignmentEditorScreen = stjs.extend(AlignmentEditorScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "AlignmentEditor";
    prototype.columns = null;
    prototype.containerId = null;
    prototype.addColumn = function() {
        var column = new AlignmentEditorColumn();
        column.columnIndex = this.columns.length;
        var lastColumn = null;
        if (this.columns.length > 0) 
            lastColumn = this.columns[this.columns.length - 1];
        if (lastColumn != null) {
            lastColumn.right = column;
            column.left = lastColumn;
        }
        this.columns.push(column);
        this.addedColumn(column);
        var me = this;
        column.screenHook = function() {
            me.updateControls();
            me.reflow();
        };
        column.display(this.containerId);
        this.reflow();
        return column;
    };
    prototype.createRelations = function(relationType) {
        if (AppController.identityController.selectedIdentity == null) {
            if (AppController.loginController.getLoggedIn() == true) {
                (ViewManager.getView("#alignmentEditorMessageContainer")).displayAlert("You need to select an identity to own the new relationship", "noIdentity");
            } else {
                (ViewManager.getView("#alignmentEditorMessageContainer")).displayAlert("You need to sign in in order to create a new relationship", "noIdentity");
            }
            this.reflow();
            return;
        }
        (ViewManager.getView("#alignmentEditorMessageContainer")).clearAlert("noIdentity");
        var left = this.columns[0].selected;
        var right = this.columns[1].selected;
        var leftFramework = null;
        var rightFramework = null;
        if (this.columns[0].selectedCollection != null) 
            leftFramework = EcFramework.getBlocking(this.columns[0].selectedCollection);
        if (this.columns[1].selectedCollection != null) 
            rightFramework = EcFramework.getBlocking(this.columns[1].selectedCollection);
        var me = this;
        for (var i = 0; i < left.length; i++) 
            for (var j = 0; j < right.length; j++) {
                if (this.columns[0].selectedCategory == "competency") 
                    if (this.columns[1].selectedCategory == "competency") {
                        var a = new EcAlignment();
                        a.generateId(this.columns[0].sourceRepo.selectedServer);
                        if (AppController.identityController.selectedIdentity == null) 
                             throw new RuntimeException("No identity selected.");
                        a.addOwner(AppController.identityController.selectedIdentity.ppk.toPk());
                        a.source = left[i].shortId();
                        a.target = right[j].shortId();
                        a.relationType = relationType;
                        var found = false;
                        var relations = this.columns[0].relations;
                        for (var ii = 0; ii < relations.length; ii++) {
                            var r = relations[ii];
                            if (r.source == a.source && r.target == a.target && r.relationType == a.relationType) {
                                found = true;
                                if (leftFramework != null) 
                                    if (AppController.identityController.canEdit(leftFramework)) 
                                        leftFramework.removeRelation(r.id);
                                if (rightFramework != null) 
                                    if (AppController.identityController.canEdit(rightFramework)) 
                                        rightFramework.removeRelation(r.id);
                                EcRepository._delete(r, function(s) {
                                    me.columns[0].getRelations();
                                }, function(s) {
                                     throw new RuntimeException(s);
                                });
                            }
                        }
                        if (!found) {
                            relations.push(a);
                            if (leftFramework != null) 
                                if (AppController.identityController.canEdit(leftFramework)) 
                                    leftFramework.addRelation(a.id);
                            if (rightFramework != null) 
                                if (AppController.identityController.canEdit(rightFramework)) 
                                    rightFramework.addRelation(a.id);
                            EcRepository.save(a, function(s) {
                                me.columns[0].getRelations();
                            }, function(s) {
                                 throw new RuntimeException(s);
                            });
                        }
                    }
            }
        if (leftFramework != null) 
            if (AppController.identityController.canEdit(leftFramework)) 
                leftFramework.save(null, null);
        if (rightFramework != null) 
            if (AppController.identityController.canEdit(rightFramework)) 
                rightFramework.save(null, null);
    };
    prototype.createAlignments = function(relationType) {
        if (AppController.identityController.selectedIdentity == null) {
            if (AppController.loginController.getLoggedIn() == true) {
                (ViewManager.getView("#alignmentEditorMessageContainer")).displayAlert("You need to select an identity to own the new relationship", "noIdentity");
            } else {
                (ViewManager.getView("#alignmentEditorMessageContainer")).displayAlert("You need to sign in in order to create a new relationship", "noIdentity");
            }
            this.reflow();
            return;
        }
        var left = this.columns[0].selected;
        var right = this.columns[1].selected;
        var me = this;
        for (var i = 0; i < left.length; i++) 
            for (var j = 0; j < right.length; j++) {
                if ((this.columns[0].selectedCategory != "competency") || (this.columns[1].selectedCategory != "competency")) {
                    var a = new CreativeWork();
                    a.generateId(this.columns[0].sourceRepo.selectedServer);
                    if (AppController.identityController.selectedIdentity == null) 
                         throw new RuntimeException("No identity selected.");
                    a.addOwner(AppController.identityController.selectedIdentity.ppk.toPk());
                    a.url = left[i].shortId();
                    a.educationalAlignment = new AlignmentObject();
                    a.educationalAlignment.alignmentType = relationType;
                    a.educationalAlignment.educationalFramework = this.columns[1].selectedCollection;
                    a.educationalAlignment.targetUrl = right[j].shortId();
                    a.educationalAlignment.targetName = right[j].name;
                    a.educationalAlignment.targetDescription = right[j].description;
                    var found = false;
                    var relations = this.columns[0].relations;
                    for (var ii = 0; ii < relations.length; ii++) {
                        var r = relations[ii];
                        if (r.educationalAlignment != null) 
                            if (r.url == a.url && r.educationalAlignment.targetUrl == a.educationalAlignment.targetUrl && r.educationalAlignment.alignmentType == a.educationalAlignment.alignmentType) {
                                found = true;
                                EcRepository._delete(r, function(s) {
                                    me.columns[0].getRelations();
                                }, function(s) {
                                     throw new RuntimeException(s);
                                });
                            }
                    }
                    if (!found) {
                        relations.push(a);
                        EcRepository.save(a, function(s) {
                            me.columns[0].getRelations();
                        }, function(s) {
                             throw new RuntimeException(s);
                        });
                    }
                }
            }
    };
    prototype.reflow = function() {};
    prototype.addedColumn = function(column) {
        ViewManager.showView(column, this.createColumnDiv(), function() {});
    };
    prototype.updateControls = function() {};
    prototype.createColumnDiv = function() {
        return null;
    };
    prototype.getDisplayName = function() {
        return AlignmentEditorScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/alignmentEditor.html";
    };
    prototype.display = function(containerId) {
        this.containerId = containerId;
        this.columns = new Array();
        this.addColumn();
        ($(this.createColumnDiv()).attr("id", "mappingFrameworkColumn")).css("display", "none").html("<div style='font-weight: 800;'>Mapping Framework:</div><select id='mappingFrameworkServerSelect'><option disabled='' selected=''>-- Select Server --</option></select><select 'mappingFrameworkSelect'><option disabled='' selected=''>-- Select Framework or Create New --</option></select>");
        this.addColumn();
        this.bindControls(containerId);
        var me = this;
        ViewManager.showView(new MessageContainer("alignmentEditor", function() {
            me.reflow();
        }), "#alignmentEditorMessageContainer", function() {
            if (AppController.identityController.selectedIdentity == null || AppController.identityController.selectedIdentity == undefined) {
                if (AppController.loginController.getLoggedIn() == true) {
                    (ViewManager.getView("#alignmentEditorMessageContainer")).displayAlert("You need to select an identity to own any relationships or alignments", "noIdentity");
                } else {
                    (ViewManager.getView("#alignmentEditorMessageContainer")).displayAlert("You need to sign in in order to create a relationship or alignment", "noIdentity");
                }
            }
        });
    };
    prototype.bindControls = function(containerId) {};
}, {columns: {name: "Array", arguments: ["AlignmentEditorColumn"]}, data: "Object", reloadLoginCallback: {name: "Callback1", arguments: ["Object"]}, reloadShowLoginCallback: "Callback0", failure: {name: "Callback1", arguments: [null]}, nameToTemplate: "Object"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + AlignmentEditorScreen.displayName)) {
            ScreenManager.startupScreen = new AlignmentEditorScreen();
            CassManagerScreen.showLoginModalIfReload();
        }
    });
})();
