/**
 * Screen with form for editing competency details
 * 
 * @module cass.manager
 * @class CompetencyEditScreen
 * 
 * @author devlin.junker@eduworks.com
 */
CompetencyEditScreen = (function (CompetencyEditScreen) {

    var frameworkId = null;
    var data = null;

    /**
     * Handles displaying the details of the competency in the HTML
     * 
     * @memberOf CompetencyEditScreen
     * @method displayCompetency
     * @private
     * @param {EcCompetency} competency
     * 			The competency to be displayed in the HTML
     */
    function displayCompetency(competency) {
        $('#competencyEditor').show();
        $("#competencyEditId").val(competency.id);
        $("#competencyEditName").val(competency.getName());
        $("#competencyEditDescription").val(competency.getDescription());
        $("#competencyEditScope").val(competency.scope);

        if (competency.owner != undefined && competency.owner.length > 0) {
            $("#competencyEditOwner").html("");
            for (var i = 0; i < competency.owner.length; i++) {
                if (i > 0)
                    $("#competencyEditOwner").append(", ");

                var pem = competency.owner[i];

              
                $("#competencyEditOwner").append("<span id='competency-owner-"+i+"'></span>");
                
                ViewManager.showView(new IdentityDisplay(pem), "#competency-owner-"+i);
            }
        } else {
            $("#competencyEditOwner").text("Public")
            $("#competencyEditOwnerAdvanced").hide();
        }

        if (EcEncryptedValue.encryptOnSave(competency.id)) {
            if ($("#privateRow").css("display") == "none")
                $("#privateRow").slideDown();

            if (competency.reader != undefined && competency.reader.length != 0) {
                $("#competencyEditNoReaders").addClass("hide");
                $("#competencyEditReaders").html("");
                for (var i = 0; i < competency.reader.length; i++) {
                    var pk = competency.reader[i];

                    //var contact = $(createContactSmall(pk));
                    //$("#competencyEditReaders").append(contact);
                    
                    $("#competencyEditReaders").append("<span id='competency-reader-"+i+"'></span>");
                    ViewManager.showView(new IdentityDisplay(pk), "#competency-reader-"+i);

                    if (i < competency.reader.length - 1)
                        $("#competencyEditReaders").append(", ");
                }
            } else {
                $("#competencyEditNoReaders").removeClass("hide");
            }
        } else if ($("#privateRow").css("display") != "none") {
            $("#privateRow").slideUp();
        }

        $("#competencyNoLevels").removeClass("hide");
        $("#competencyLevelContainer").children(".level").remove();
        competency.levels(AppController.serverController.getRepoInterface(), addLevel, errorRetrievingLevels)

        $("#competencyNoRollupRules").removeClass("hide");
        $("#competencyRollupRuleContainer").children(".rollupRule").remove();
        competency.rollupRules(AppController.serverController.getRepoInterface(), addRollupRule, errorRetrievingRollupRules)

    }

    /**
     * Handles adding the elements containing level details, with
     * click handlers on them for editing the level displayed
     * 
     * @memberOf CompetencyEditScreen
     * @method addLevel
     * @private
     * @param {EcLevel} level
     * 			Level to display in the element that is created
     */
    function addLevel(level) {
        $("#competencyNoLevels").addClass("hide");

        var container = $("<span data-tooltip data-fade-out-duration='1500' class='level fake-a has-tip top'></span>");
        container.append(level.getName());
        container.attr("id", level.id);

        var tip = "";
        if (level.description != undefined && level.description != "")
            tip += "Description: " + level.description + "<br/><br/>";
        if (level.title != undefined && level.title != "")
            tip += "Title: " + level.title + "<br/><br/>";
        if (level.performance != undefined && level.performance != "")
            tip += "Performance Measure: " + level.performance + "<br/><br/>";
        if (level.owner != undefined && level.owner.length > 0) {
            tip += "Owner: ";
            for (var i = 0; i < level.owner.length; i++) {
                if (i != 0)
                    tip += ", ";
                tip += AppController.identityController.lookup(level.owner[i]).displayName;
            }
            tip += "<br/><br/>"
        }

        tip += level.id;

        if ($("#competencyLevelContainer").children("span").size() > 0)
            $("#competencyLevelContainer").append(", ");

        $("#competencyLevelContainer").append(container);

        container.click(function (ev) {
            ev.preventDefault();
            ModalManager.showModal(new EditLevelModal(level, function (level) {
                var commas = container.parent().contents().filter(function() {
                    return this.nodeType == 3;
                });
                commas.last().remove();
            	container.foundation("destroy");
                container.remove();
               

                if (level != null)
                    addLevel(level)
                else if ($("#competencyLevelContainer").find(".level").size() == 0)
                    $("#competencyNoLevels").removeClass("hide");
            }));
        });

        new Foundation.Tooltip(container, {
            "tipText": tip
        });
    }
    
    /**
     * Handles adding an element containing rollup rule details,
     * with click handlers for editing the rollup rule displayed
     * 
     * @memberOf CompetencyEditScreen
     * @method addRollupRule
     * @private
     * @param {EcRollupRule} rollupRule
     * 			Rollup rule to be displayed
     */
    function addRollupRule(rollupRule) {
        $("#competencyNoRollupRules").addClass("hide");

        var container = $("<span data-tooltip data-fade-out-duration='1500' class='rollup-rule fake-a has-tip top'></span>");
        container.append(rollupRule.getName());
        container.attr("id", rollupRule.id);

        var tip = "";
        if (rollupRule.description != undefined && rollupRule.description != "")
            tip += "Description: " + rollupRule.description + "<br/><br/>";
        if (rollupRule.rule != undefined && rollupRule.rule != "")
            tip += "Rule: " + rollupRule.rule + "<br/><br/>";
        if (rollupRule.outcome != undefined && rollupRule.outcome != "")
            tip += "Outcome: " + rollupRule.outcome + "<br/><br/>";
        if (rollupRule.owner != undefined && rollupRule.owner.length > 0) {
            tip += "Owner: ";
            for (var i = 0; i < rollupRule.owner.length; i++) {
                if (i != 0)
                    tip += ", ";
                tip += AppController.identityController.lookup(rollupRule.owner[i]).displayName;
            }
            tip += "<br/><br/>"
        }

        tip += rollupRule.id;

        if ($("#competencyRollupRuleContainer").children("span").size() > 0)
            $("#competencyRollupRuleContainer").append(", ");

        $("#competencyRollupRuleContainer").append(container);

        container.click(function (ev) {
            ev.preventDefault();
            ModalManager.showModal(new EditRollupRuleModal(rollupRule, function (rollupRule) {
            	var commas = container.parent().contents().filter(function() {
                    return this.nodeType == 3;
                });
                commas.last().remove();
            	container.foundation("destroy");
                container.remove();

                if (rollupRule != null)
                    addRollupRule(rollupRule)
                else if ($("#competencyRollupRuleContainer").find("span").size() == 0)
                    $("#competencyNoRollupRules").removeClass("hide");
            }));
        });

        new Foundation.Tooltip(container, {
            "tipText": tip
        });
    }

    
    /**
     * Callback when the competency is  saved to let 
     * the user know it was successful. If the frameworkId
     * variable is set, add the competency, lefels and rollup rule
     * to the framework and return to the framework page 
     * 
     * @memberOf CompetencyEditScreen
     */
    function saveSuccess() {
        $("#datum").effect("highlight", {}, 1500);
        
        if (frameworkId != null) {
            EcFramework.get(frameworkId, function (framework) {
            	var rulesDone = false;
            	var levelsDone = false;
                framework.addCompetency(data.id);
                data.levels(AppController.serverController.getRepoInterface(), function (level) {
                    framework.addLevel(level.id);
                }, errorRetrievingLevels, function (levels) {
                    framework.save(function (s) {
                    	if(rulesDone)
	                        ScreenManager.changeScreen(new FrameworkEditScreen({
	                            id: EcRemoteLinkedData.trimVersionFromUrl(frameworkId)
	                        }));
                    	else
                    		levelsDone = true;
                    }, errorSaving);
                });

                data.rollupRules(AppController.serverController.getRepoInterface(), function (rollupRule) {
                    framework.addRollupRule(rollupRule.id);
                }, errorRetrievingRollupRules, function (rollupRules) {
                    framework.save(function (s) {
                        if(levelsDone)
	                    	ScreenManager.changeScreen(new FrameworkEditScreen({
	                            id: EcRemoteLinkedData.trimVersionFromUrl(frameworkId)
	                        }));
                        else
                        	rulesDone = true;
                    }, errorSaving);
                });

            }, errorRetrieving);
        }
    }

    /**
	 * Error function called if problem getting the competency from the server
	 * 
	 * @memberOf CompetencyEditScreen
	 * @method errorRetrieving
	 * @private
	 * @param {String} err
	 * 			Error message to display
	 */
    function errorRetrieving(err) {
        if (err == undefined)
            err = "Unable to Connect to Server to Retrieve Competency for Editing";
        ViewManager.getView("#competencyEditMessageContainer").displayAlert(err);
    }

    /**
	 * Error function called if problem saving the competency to the server
	 * 
	 * @memberOf CompetencyEditScreen
	 * @method errorSaving
	 * @private
	 * @param {String} err
	 * 			Error message to display
	 */
    function errorSaving(err) {
        if (err == undefined)
            err = "Unable to Connect to Server to Save Competency";

        ViewManager.getView("#competencyEditMessageContainer").displayAlert(err, "saveFail");
    }

    /**
	 * Error function called if problem retrieving competency levels from server
	 * 
	 * @memberOf CompetencyEditScreen
	 * @method errorRetrievingLevels
	 * @private
	 * @param {String} err
	 * 			Error message to display
	 */
    function errorRetrievingLevels(err) {
        if (err == undefined)
            err = "Unable to Connect to Server to Retrieve Competency Levels";

        ViewManager.getView("#competencyEditMessageContainer").displayAlert(err, "getLevels");
    }

    /**
	 * Error function called if problem retrieving competency rollup rules from the server
	 * 
	 * @memberOf CompetencyEditScreen
	 * @method errorRetrievingRollupRules
	 * @private
	 * @param {String} err
	 * 			Error message to display
	 */
    function errorRetrievingRollupRules(err) {
        if (err == undefined)
            err = "Unable to Connect to Server to Retrieve Competency Rollup Rules";

        ViewManager.getView("#competencyEditMessageContainer").displayAlert(err, "getRollupRules");
    }

    
    
    
    /**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf CompetencyEditScreen
	 * @method display
	 * @param {String} containerId
	 * 			Screen Container DOM ID
	 */
    CompetencyEditScreen.prototype.display = function (containerId) {
        data = this.data;
        if (data == null)
            data = {};

        if (data.id != undefined)
            ScreenManager.setScreenParameters({
                "id": data.id
            });

        if (this.frameworkId != null)
            ScreenManager.setScreenParameters({
                "frameworkId": this.frameworkId
            });
        else if (data.frameworkId != null)
            ScreenManager.setScreenParameters({
                "frameworkId": this.frameworkId = data.frameworkId
            });

        frameworkId = this.frameworkId;

        if (data.id == undefined) {
            data = new EcCompetency();
            data.generateId(AppController.serverController.getRepoInterface().selectedServer);
            data.name = "";

            if (AppController.identityController.selectedIdentity != undefined) {
                data.addOwner(AppController.identityController.selectedIdentity.ppk.toPk());
            }
            
            $("#competencyEditName").focus();
        }

        ViewManager.showView(new MessageContainer("competencyEdit"), "#competencyEditMessageContainer", function () {
            if (data.name == "" && AppController.identityController.selectedIdentity == undefined) {
                ViewManager.getView("#competencyEditMessageContainer").displayWarning("You are Creating a Public Competency, this competency can be modified by anyone")
            }
        });

        $("#competencyEditSearchBtn").attr("href", "#" + CompetencySearchScreen.prototype.displayName);
        $("#competencyEditSearchBtn").click(function (event) {
            event.preventDefault();
            if (data.name == "") {
                ScreenManager.changeScreen(new CompetencySearchScreen())
            } else {
                ScreenManager.changeScreen(new CompetencySearchScreen(data));
            }

        });

        if (data.name == "") {
            $("#competencyEditViewBtn").hide();

        } else {
            $("#competencyEditViewBtn").attr("href", "#" + CompetencyViewScreen.prototype.displayName);
            $("#competencyEditViewBtn").click(function (event) {
                event.preventDefault();
                ScreenManager.changeScreen(new CompetencyViewScreen(data))
            });
        }


        $("#competencyEditBtn").attr("href", "#" + CompetencyEditScreen.prototype.displayName);
        $("#competencyEditBtn").click(function (event) {
            event.preventDefault();
        });

        $("#competencyEditCancelBtn").click(function (event) {
            event.preventDefault();
            if (frameworkId == null)
                ScreenManager.changeScreen(new CompetencyViewScreen(data))
            else
                ScreenManager.changeScreen(new FrameworkEditScreen({
                    id: EcRemoteLinkedData.trimVersionFromUrl(frameworkId)
                }));
        });

        if (data.name == "") {
            $("#competencyEditDeleteBtn").remove();
        } else {
            $("#competencyEditDeleteBtn").click(function (event) {
                event.preventDefault();

                ModalManager.showModal(new ConfirmModal(function () {
                    data._delete(function () {
                        ScreenManager.changeScreen(new CompetencySearchScreen());
                    }, function (err) {
                        if (err == undefined)
                            err = "Unable to connect to server to delete framework";
                        ViewManager.getView("#competencyEditMessageContainer").displayAlert(err)
                    });
                    ModalManager.hideModal();
                }, "Are you sure you want to delete this competency?"))
            })
        }

        $("#competencyEditSaveBtn").click(function (event) {
            event.preventDefault();

            data.setName($("#competencyEditName").val());
            data.setDescription($("#competencyEditDescription").val());
            data.scope = $("#competencyEditScope").val();

            if (data.name != "") {
                ViewManager.getView("#competencyEditMessageContainer").clearAlert("saveFail");
                ViewManager.getView("#competencyEditMessageContainer").clearAlert("defaultName");
                data.save(saveSuccess, errorSaving);
            } else {
                ViewManager.getView("#competencyEditMessageContainer").displayAlert("Cannot Save Competency Without a Name", "defaultName");
            }
        })

        $("#competencyEditSaveBtn").on("mousemove", function () {
            var url = $("#competencyEditId").val();
            var split = url.split("\/");
            if (split[split.length - 4] == "data")
                split[split.length - 1] = new Date().getTime();
            $("#competencyEditId").val(split.join("/"));
        });

        $("#competencyAddLevel").click(function (ev) {
            ev.preventDefault();
            ModalManager.showModal(new EditLevelModal(data, function (level) {
                addLevel(level);
            }));
        });

        $("#competencyAddRollupRule").click(function (ev) {
            ev.preventDefault();
            ModalManager.showModal(new EditRollupRuleModal(data, function (rollupRule) {
                addRollupRule(rollupRule);
            }));
        });

        $("#competencyEditOwnerAdvanced").click(function (ev) {
            ev.preventDefault();

            data.setName($("#competencyEditName").val());
            data.setDescription($("#competencyEditDescription").val());
            data.scope = $("#competencyEditScope").val();

            ModalManager.showModal(new AdvancedPermissionsModal(data, function (dataAfter) {
                data.owner = dataAfter.owner;
                data.reader = dataAfter.reader;

                displayCompetency(data);

                ModalManager.hideModal();
            }))
        })

        if (data.name == "") {
            displayCompetency(data);
        } else {
            EcCompetency.get(data.id, function (competency) {
                data = competency;
                displayCompetency(competency)
            }, errorRetrieving);
        }

    };

    return CompetencyEditScreen;
})(CompetencyEditScreen);
