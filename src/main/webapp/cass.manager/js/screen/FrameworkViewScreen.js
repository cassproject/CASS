var fonts = {
    node: "bold 12px Arial",
    edge: "bold 12px Arial"
};

EcRepository.caching = true;

FrameworkViewScreen.prototype.relationTypes = {
    isEnabledBy: "Enabled By",
    requires: "Requires",
    desires: "Desires",
    narrows: "Narrows",
    isRelatedTo: "Related To",
    isEquivalentTo: "Equivalent To"
}

FrameworkViewScreen.prototype.fetches = 0;

FrameworkViewScreen.prototype.displayVisualization = function () {
    var framework = this.getData();
    var canvas = $("#frameworkViewCanvas").get(0);
    var ctx = canvas.getContext("2d");

    var graph = new Springy.Graph();
    var nodes = {};

    canvas.width = $("#frameworkViewCanvas").parent().innerWidth() - 60;

    jQuery(function () {
        var springy = window.springy = $("#frameworkViewCanvas").springy({
            graph: graph,
            nodeSelected: function (node) {
                console.log('Node selected: ' + JSON.stringify(node.data));
            }
        });
    });

    window.springs = new Springy.Layout.ForceDirected(graph, 0.0, new Springy.Vector(200.0, 100.0), 0.1);

    var me = this;

    if (framework.competency != undefined)
        for (var i = 0; i < framework.competency.length; i++) {
            me.fetches++;
            (function (i) {
                timeout(function () {
                    EcCompetency.get(framework.competency[i], function (competency) {
                        me.fetches--;
                        competency.font = fonts.node;
                        competency.mass = 2;
                        nodes[competency.shortId()] = graph.newNode(competency);
                        nodes[competency.shortId()].gravity = 0.0;
                        nodes[competency.shortId()].fixed = true;
                        if (framework.competency.length < 20)
                            nodes[competency.shortId()].alwaysShowText = true;
                        if (me.fetches == 0) {
                            if (framework.relation != undefined)
                                for (var i = 0; i < framework.relation.length; i++) {
                                    (function (i) {
                                        timeout(function () {
                                            EcAlignment.get(framework.relation[i], function (relation) {
                                                if (relation.source !== undefined) {
                                                    var shortSource = EcRemoteLinkedData.trimVersionFromUrl(relation.source);
                                                    var shortTarget = EcRemoteLinkedData.trimVersionFromUrl(relation.target);
                                                    if (nodes[shortSource].alwaysShowText === undefined)
                                                        nodes[shortSource].alwaysShowText = false;
                                                    relation.font = fonts.edge;
                                                    if (relation.relationType == "requires") {
                                                        nodes[shortSource].alwaysShowText = true;
                                                        nodes[shortTarget].fixed = false;
                                                        nodes[shortTarget].gravity += 1.0;
                                                        relation.color = "#880000";
                                                        graph.newEdge(nodes[shortSource], nodes[shortTarget], relation);
                                                    }
                                                    if (relation.relationType == "narrows") {
                                                        nodes[shortTarget].alwaysShowText = true;
                                                        nodes[shortSource].fixed = false;
                                                        nodes[shortSource].gravity += 1.0;
                                                        relation.color = "#008800";
                                                        graph.newEdge(nodes[shortTarget], nodes[shortSource], relation);
                                                    }
                                                }
                                            }, function () {});
                                        });
                                    })(i);
                                }
                        }
                    }, function () {});
                });
            })(i);
        }
}

FrameworkViewScreen.prototype.bindControls = function () {
    var framework = this.getData();

    if (framework.privateEncrypted)
        $("#frameworkViewerPrivateSymbol").removeClass("hide");
    else
        $("#frameworkViewerPrivateSymbol").addClass("hide");

    if (framework.competency == undefined || framework.competency.length == 0) {
        $("#frameworkViewerContents").addClass("hide");
    }

    if (framework.owner != undefined && framework.owner.length > 0) {
        $("#frameworkViewOwner").text("")
        for (var i = 0; i < framework.owner.length; i++) {
            if (i > 0)
                $("#frameworkViewOwner").append(", ");

            var pem = framework.owner[i];

            var contact = $(createContactSmall(pem));
            $("#frameworkViewOwner").append(contact);
        }
    } else {
        $("#frameworkViewOwner").text("Public")
    }

    $("#frameworkViewSearchBtn").attr("href", "#" + FrameworkSearchScreen.prototype.displayName);
    $("#frameworkViewSearchBtn").click(function (event) {
        event.preventDefault();
        ScreenManager.changeScreen(new FrameworkSearchScreen(framework));
    });

    $("#frameworkViewBtn").attr("href", "#" + FrameworkViewScreen.prototype.displayName);
    $("#frameworkViewBtn").click(function (event) {
        event.preventDefault();
    });

    if (AppController.identityController.canEdit(framework)) {
        $("#editFrameworkBtn").click(function (event) {
            event.preventDefault();
            ScreenManager.changeScreen(new FrameworkEditScreen(framework));
        })
    } else {
        $("#editFrameworkBtn").hide();
    }

    var me = this;
    if (!AppController.identityController.owns(framework) && !AppController.loginController.getAdmin()) {
        $("#frameworkViewDeleteBtn").remove();
    } else {
        $("#frameworkViewDeleteBtn").click(function () {
            me.deleteFramework();
        })
    }
};
