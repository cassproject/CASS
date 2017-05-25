/**
 * Screen that handles displaying Relationship Details
 * 
 * @module cass.manager
 * @class RelationshipViewScreen
 * 
 * @author devlin.junker@eduworks.com
 */
RelationshipViewScreen = (function (RelationshipViewScreen) {
    /**
	 * Handles displaying relationship details in DOM
	 * 
	 * @memberOf RelationshipViewScreen
	 * @method displayRelation 
	 * @private
	 * @param {EcAlignment} relation 
	 * 			Relation to display
	 */
    function displayRelation(relation) {

        if (EcEncryptedValue.encryptOnSave(relation.id))
            $("#relationshipViewerPrivateSymbol").removeClass("hide");
        else
            $("#relationshipViewerPrivateSymbol").addClass("hide");

        if (relation.source != undefined) {
            EcCompetency.get(relation.source, function (competency) {
                var a = $("<a></a>");
                a.attr("href", "#" + CompetencyViewScreen.displayName);
                a.text(competency.name)
                $("#relationshipViewerSource").html(a);
                $("#relationshipViewerSource").click(function (event) {
                    event.preventDefault();
                    ScreenManager.changeScreen(new CompetencyViewScreen(competency));
                });
            }, function (err) {
                try {
                    var parsedErr = JSON.parse(err);
                    if (parsedErr.msg == undefined && parsedErr.message == undefined) {
                        $("#relationshipViewerSource").text("Unknown Competency");
                        $("#relationshipViewerSource").css("font-style", "italic");
                    }
                } catch (e) {
                    errorFindingSource(err);
                }
            });
        }

        if (relation.target != undefined) {
            EcCompetency.get(relation.target, function (competency) {
                var a = $("<a></a>");
                a.attr("href", "#" + CompetencyViewScreen.displayName);
                a.text(competency.name)
                $("#relationshipViewerTarget").html(a);
                $("#relationshipViewerTarget").click(function (event) {
                    event.preventDefault();
                    ScreenManager.changeScreen(new CompetencyViewScreen(competency));
                });
            }, function (err) {
                try {
                    var parsedErr = JSON.parse(err);
                    if (parsedErr.msg == undefined && parsedErr.message == undefined) {
                        $("#relationshipViewerTarget").text("Unknown Competency");
                        $("#relationshipViewerTarget").css("font-style", "italic");
                    }
                } catch (e) {
                    errorFindingTarget(err);
                }
            });
        }

        if (relation.relationType != undefined && AppSettings.relationTypes[relation.relationType] != undefined) {
            $("#relationshipViewerType").text(AppSettings.relationTypes[relation.relationType]);
        } else {
            $("#relationshipViewerType").text("has a relationship with");
        }

        $("#relationshipViewerId").text(relation.id);
        if (relation.name == null || relation.name == undefined)
            $(".relationshipViewerName").text("Relation");
        else
            $(".relationshipViewerName").text(relation.name);
        $("#relationshipViewerDescription").text(relation.description);

        if (relation.owner != undefined && relation.owner.length > 0) {
            $("#relationshipViewerOwner").text("")
            for (var i = 0; i < relation.owner.length; i++) {
                if (i > 0)
                    $("#relationshipViewerOwner").append(", ");

                var pem = relation.owner[i];

                $("#relationshipViewerOwner").append("<span id='relation-owner-"+i+"'></span>");
                
                ViewManager.showView(new IdentityDisplay(pem), "#relation-owner-"+i);
            }
        } else {
            $("#relationshipViewerOwner").text("Public")
        }

    }

    /**
	 * Handles displaying error message when retrieving relationship for display
	 * 
	 * @memberOf RelationshipViewScreen
	 * @method displayRelation 
	 * @private
	 * @param {String} err 
	 * 			Error message to display
	 */
    function errorRetrieving(err) {
        if (err == undefined)
            err = "Unable to Connect to Server to Retrieve Relation";

        ViewManager.getView("#relationshipViewMessageContainer").displayAlert(err, "getRelation");
    }

    /**
	 * Handles displaying error message when retrieving relationship source info
	 * 
	 * @memberOf RelationshipViewScreen
	 * @method errorFindingSource 
	 * @private
	 * @param {String} err 
	 * 			Error message to display		
	 */
    function errorFindingSource(err) {
        if (err == undefined)
            err = "Unable to Connect to Server to Retrieve Source Competency";

        ViewManager.getView("#relationshipViewMessageContainer").displayAlert(err, "getSource");
    }

    /**
	 * Handles displaying error message when retrieving relationship target info display
	 * 
	 * @memberOf RelationshipViewScreen
	 * @method errorFindingTarget 
	 * @private
	 * @param {String} err 
	 * 			Error message to display
	 */
    function errorFindingTarget(err) {
        if (err == undefined)
            err = "Unable to Connect to Server to Retrieve Target Competency";

        ViewManager.getView("#relationshipViewMessageContainer").displayAlert(err, "getTarget");
    }

    /**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf RelationshipViewScreen
	 * @method display
	 * @param containerId
	 * 			Screen Container DOM ID
	 */
    RelationshipViewScreen.prototype.display = function (containerId, callback) {
        var data = this.data;

        if (data.id != null) {
            ScreenManager.setScreenParameters({
                "id": data.id
            })
        }


        ViewManager.showView(new MessageContainer("relationshipView"), "#relationshipViewMessageContainer");

        $("#relationshipViewSearchBtn").attr("href", "#" + RelationshipSearchScreen.prototype.displayName);
        $("#relationshipViewSearchBtn").click(function (event) {
            event.preventDefault();
            ScreenManager.changeScreen(new RelationshipSearchScreen(data))
        });

        $("#relationshipViewBtn").attr("href", "#" + RelationshipViewScreen.prototype.displayName);
        $("#relationshipViewBtn").click(function (event) {
            event.preventDefault();
        });


        if (AppController.identityController.canEdit(data)) {
            $("#editRelationshipBtn").click(function (event) {
                event.preventDefault();
                ScreenManager.changeScreen(new RelationshipEditScreen(data))
            })
        } else {
            $("#editRelationshipBtn").remove();
        }

        if (!AppController.identityController.owns(data) && !AppController.serverController.getAdmin()) {
            $("#relationshipViewDeleteBtn").remove();
        } else {
            $("#relationshipViewDeleteBtn").click(function () {
                ModalManager.showModal(new ConfirmModal(function () {
                    data._delete(function () {
                        ScreenManager.changeScreen(new RelationshipSearchScreen());
                    }, function (err) {
                        if (err == undefined)
                            err = "Unable to connect to server to delete relationship";
                        ViewManager.getView("#relationshipViewMessageContainer").displayAlert(err)
                    });
                    ModalManager.hideModal();
                }, "Are you sure you want to delete this relationship?"))
            })
        }


        EcAlignment.get(data.id, function (result) {
            data = result;
            displayRelation(result);
        }, errorRetrieving);

    };

    return RelationshipViewScreen;
})(RelationshipViewScreen);
