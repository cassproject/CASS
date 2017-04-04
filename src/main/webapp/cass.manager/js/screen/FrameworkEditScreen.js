/**
 * Screen with a form for editing Frameworks
 * 
 * @module cass.manager
 * @class FrameworkEditScreen
 * 
 * @author devlin.junker@eduworks.com
 */
FrameworkEditScreen = (function (FrameworkEditScreen) {

	var formDirty;

    /**
     * Displays all of the framework details in the form on the screen
     * 
     * @memberOf FrameworkEditScreen
     * @method displayFramework
     * @private
     * @param {EcFramework} framework
     * 			Framework to display
     */
    function displayFramework(framework) {
        $("#frameworkEditId").val(framework.id);
        $("#frameworkEditName").val(framework.name);
        $("#frameworkEditDescription").val(framework.description);

        if (framework.owner != undefined && framework.owner.length != 0) {
            $("#frameworkEditOwner").html("");
            for (var i = 0; i < framework.owner.length; i++) {
                var pk = framework.owner[i];

                $("#frameworkEditOwner").append("<span id='framework-owner-"+i+"'></span>");
                
                ViewManager.showView(new IdentityDisplay(pk), "#framework-owner-"+i);

                if (i < framework.owner.length - 1)
                    $("#frameworkEditOwner").append(", ");
            }
            $("#frameworkEditOwnerAdvanced").removeClass("hide");
        } else {
            $("#frameworkEditOwner").text("Public")
            $("#frameworkEditOwnerAdvanced").addClass("hide");
        }

        if (EcEncryptedValue.encryptOnSave(framework.id)) {
            if ($("#privateRow").css("display") == "none")
                $("#privateRow").slideDown();

            if (framework.reader != undefined && framework.reader.length != 0) {
                $("#frameworkEditNoReaders").addClass("hide");
                $("#frameworkEditReaders").html("");
                for (var i = 0; i < framework.reader.length; i++) {
                    var pk = framework.reader[i];

                    $("#frameworkEditReaders").append("<span id='framework-reader-"+i+"'></span>");
                    
                    ViewManager.showView(new IdentityDisplay(pk), "#framework-reader-"+i);

                    if (i < framework.reader.length - 1)
                        $("#frameworkEditReaders").append(", ");
                }
            } else {
                $("#frameworkEditNoReaders").removeClass("hide");
            }
        } else if ($("#privateRow").css("display") != "none") {
            $("#privateRow").slideUp();
        }


        $("#frameworkEditCompetencies option").not("#noCompetencies").remove();
        for (var idx in framework.competency) {
            EcCompetency.get(framework.competency[idx], addCompetency, errorRetrievingCompetency);
        }

        $("#frameworkEditRelations option").not("#noRelations").remove();
        for (var idx in framework.relation) {
            EcAlignment.get(framework.relation[idx], addRelation, errorRetrievingRelation)
        }

        $("#frameworkEditLevels option").not("#noLevels").remove();
        for (var idx in framework.level) {
            EcLevel.get(framework.level[idx], function (level) {
                addLevel(level);
            }, errorRetrievingLevel);
        }

        $("#frameworkEditRollupRules option").not("#noRollupRules").remove();
        for (var idx in framework.rollupRule) {
            EcRollupRule.get(framework.rollupRule[idx], function (rollupRule) {
                addRollupRule(rollupRule);
            }, errorRetrievingRollupRule);
        }
    }

    /**
     * Adds a competency to the competency list in the form
     * 
     * @memberOf FrameworkEditScreen
     * @method addCompetency
     * @private
     * @param {EcCompetency} competency 
     * 			Competency to include in the framework edit form
     */
    function addCompetency(competency) {
        $("#frameworkEditCompetencies #noCompetencies").hide();

        $("#frameworkEditCompetencies").removeAttr("disabled");
        $("#frameworkEditCompetencies").removeClass("empty");

        var option = $("<option></option>");
        option.attr("title", competency.id);
        option.attr("id", competency.id);
        option.attr("value", competency.id);
        option.text(competency.name + (competency.description == undefined ? "" : " - " + competency.description));
        $("#frameworkEditCompetencies").append(option);
        formDirty = true;
    }

    /**
     * Adds a relation to the relation list in the form
     * 
     * @memberOf FrameworkEditScreen
     * @method addRelation
     * @private
     * @param {EcAlignment} relation
     * 			Relation to include in the framework edit form
     */
    function addRelation(relation) {
        $("#frameworkEditRelations #noRelations").hide();

        $("#frameworkEditRelations").removeAttr("disabled");
        $("#frameworkEditRelations").removeClass("empty");

        var sourceId = EcRemoteLinkedData.trimVersionFromUrl(relation.source).split("/");
        sourceId = sourceId[sourceId.length - 1] + "-relations";


        var competencyGroup = $("#frameworkEditRelations optgroup#" + sourceId);
        if (competencyGroup.size() == 0) {
            competencyGroup = $("<optgroup></optgroup>");
            competencyGroup.attr("id", sourceId);
            competencyGroup.attr("label", EcCompetency.getBlocking(relation.source).name)
            $("#frameworkEditRelations").append(competencyGroup);
        }

        var basicId = relation.shortId().split("/");
        basicId = basicId[basicId.length - 1];

        var option = $("<option style='font-style:italic;'></option>");
        option.attr("id", basicId);
        option.val(relation.id);
        option.text(relation["relationType"] + " " + EcCompetency.getBlocking(relation.target).name);

        competencyGroup.append(option)
        formDirty = true;
    }

    /**
     * Adds a level to the level list in the form
     * 
     * @memberOf FrameworkEditScreen
     * @method addLevel
     * @private
     * @param {EcLevel} level
     * 			Level to include in level list
     */
    function addLevel(level) {
        $("#frameworkEditLevels #noLevels").hide();

        $("#frameworkEditLevels").removeAttr("disabled");
        $("#frameworkEditLevels").removeClass("empty");

        var competency = EcCompetency.getBlocking(level.competency);

        if (competency == undefined)
            competency = EcCompetency.getBlocking(EcRemoteLinkedData.trimVersionFromUrl(level.competency));

        var competencyId = competency.shortId().split("/");
        competencyId = competencyId[competencyId.length - 1] + "-levels";

        var competencyGroup = $("#frameworkEditLevels optgroup#" + competencyId);

        if (competencyGroup.size() == 0) {
            competencyGroup = $("<optgroup></optgroup>");
            competencyGroup.attr("id", competencyId);
            competencyGroup.attr("label", competency.name);
            $("#frameworkEditLevels").append(competencyGroup);
        }

        var basicId = level.shortId().split("/");
        basicId = basicId[basicId.length - 1];

        var option = $("<option style='font-style:italic'></option>");
        option.attr("id", basicId);
        option.val(level.id);
        option.attr("title", (level.performance == undefined ? level.description : level.performance) + "'>" + level.name + " (Title: " + level.title + ")");
        option.text(level.name);
        competencyGroup.append(option);

        formDirty = true;

    }

    /**
     * Adds a rollup rule to the rollup rule list in the form
     * 
     * @memberOf FrameworkEditScreen
     * @method addRollupRule
     * @private
     * @param {EcRollupRule} rollupRule
     * 			Rollup Rule to include in the list
     */
    function addRollupRule(rollupRule) {
        $("#frameworkEditRollupRules #noRollupRules").hide();

        $("#frameworkEditRollupRules").removeAttr("disabled");
        $("#frameworkEditRollupRules").removeClass("empty");

        var competency = EcCompetency.getBlocking(rollupRule.competency);

        if (competency == undefined)
            competency = EcCompetency.getBlocking(EcRemoteLinkedData.trimVersionFromUrl(rollupRule.competency));

        var competencyId = competency.shortId().split("/");
        competencyId = competencyId[competencyId.length - 1] + "-rollupRules";

        var competencyGroup = $("#frameworkEditRollupRules optgroup#" + competencyId);

        if (competencyGroup.size() == 0) {
            competencyGroup = $("<optgroup></optgroup>");
            competencyGroup.attr("id", competencyId);
            competencyGroup.attr("label", competency.name);
            $("#frameworkEditRollupRules").append(competencyGroup);
        }

        var basicId = rollupRule.shortId().split("/");
        basicId = basicId[basicId.length - 1];

        var option = $("<option style='font-style:italic'></option>");
        option.attr("id", basicId);
        option.val(rollupRule.id);
        option.attr("title", rollupRule.description);
        option.text(rollupRule.name);
        competencyGroup.append(option);

        formDirty = true;

    }

    /**
     * Handles triggering changes in the DOM to indicate the the framework was saved successfully
     * 
     * @memberOf FrameworkEditScreen
     * @method saveSuccess
     * @private
     */
    function saveSuccess() {
        $("#datum").effect("highlight", {}, 1500);
        formDirty = false;
    }

    /**
     * Error Handling if problem retrieving framework to display on screen
     * 
     * @memberOf FrameworkEditScreen
     * @method errorRetrieving
     * @private
     * @param {String} err
	 * 			Error message to display
     */
    function errorRetrieving(err) {
        if (err == undefined)
            err = "Unable to Connect to Server to Retrieve Competency for Editing";
        ViewManager.getView("#frameworkEditMessageContainer").displayAlert(err);
    }

    /**
     * Error Handling if problem saving framework
     * 
     * @memberOf FrameworkEditScreen
     * @method errorSaving
     * @private
     * @param {String} err
	 * 			Error message to display
     */
    function errorSaving(err) {
        if (err == undefined)
            err = "Unable to Connect to Server to Save Competency";

        ViewManager.getView("#frameworkEditMessageContainer").displayAlert(err, "saveFail");
    }

    /**
     * Error Handling if problem retrieving competency in framework
     * 
     * @memberOf FrameworkEditScreen
     * @method errorRetrievingCompetency
     * @private
     * @param {String} err
	 * 			Error message to display
     */
    function errorRetrievingCompetency(err) {
        if (err == undefined)
            err = "Unable to Connect to Server to Retrieve Competency";

        ViewManager.getView("#frameworkEditMessageContainer").displayAlert(err, "getCompetency");
    }

    /**
     * Error Handling if problem retrieving relation in framework
     * 
     * @memberOf FrameworkEditScreen
     * @method errorRetrievingRelation
     * @private
     * @param {String} err
	 * 			Error message to display
     */
    function errorRetrievingRelation(err) {
        if (err == undefined)
            err = "Unable to Connect to Server to Retrieve Relation";

        ViewManager.getView("#frameworkEditMessageContainer").displayAlert(err, "getRelation");
    }

    /**
     * Error Handling if problem retrieving level in framework
     * 
     * @memberOf FrameworkEditScreen
     * @method errorRetrievingLevel
     * @private
     * @param {String} err
	 * 			Error message to display
     */
    function errorRetrievingLevel(err) {
        if (err == undefined)
            err = "Unable to Connect to Server to Retrieve Level";

        ViewManager.getView("#frameworkEditMessageContainer").displayAlert(err, "getLevel");
    }

    /**
     * Error Handling if problem retrieving rollup rule in framework
     * 
     * @memberOf FrameworkEditScreen
     * @method errorRetrievingRollupRule
     * @private
     * @param {String} err
	 * 			Error message to display
     */
    function errorRetrievingRollupRule(err) {
        if (err == undefined)
            err = "Unable to Connect to Server to Retrieve Rollup Rule";

        ViewManager.getView("#frameworkEditMessageContainer").displayAlert(err, "getRollupRule");
    }

    /**
     * Error Handling if problem searching for competencies to add to the framework
     * 
     * @memberOf FrameworkEditScreen
     * @method errorSearchingCompetencies
     * @private
     * @param {String} err
	 * 			Error message to display
     */
    function errorSearchingCompetencies(err) {
        if (err == undefined)
            err = "Unable to Connect to Server to Search Competency";

        ViewManager.getView("#frameworkEditMessageContainer").displayAlert(err, "searchCompetencies");
    }

    /**
     * Error Handling if problem searching for relations to add to the framework
     * 
     * @memberOf FrameworkEditScreen
     * @method errorSearchingRelations
     * @private
     * @param {String} err
	 * 			Error message to display
     */
    function errorSearchingRelations(err) {
        if (err == undefined)
            err = "Unable to Connect to Server to Search Relations";

        ViewManager.getView("#frameworkEditMessageContainer").displayAlert(err, "searchRelations");
    }

    /**
     * Error Handling if problem searching for levels to add to the framework
     * 
     * @memberOf FrameworkEditScreen
     * @method errorSearchingLevels
     * @private
     * @param {String} err
	 * 			Error message to display
     */
    function errorSearchingLevels(err) {
        if (err == undefined)
            err = "Unable to Connect to Server to Search Levels";

        ViewManager.getView("#frameworkEditMessageContainer").displayAlert(err, "searchLevels");
    }

    /**
     * Error Handling if problem searching for rollup rules to add to the framework
     * 
     * @memberOf FrameworkEditScreen
     * @method errorSearchingRollupRules
     * @private
     * @param {String} err
	 * 			Error message to display
     */
    function errorSearchingRollupRules(err) {
        if (err == undefined)
            err = "Unable to Connect to Server to Search Rollup Rules";

        ViewManager.getView("#frameworkEditMessageContainer").displayAlert(err, "searchRollupRules");
    }

    /**
     * Error Handling if problem removing competency from framework
     * 
     * @memberOf FrameworkEditScreen
     * @method errorRemovingCompetency
     * @private
     * @param {String} err
	 * 			Error message to display
     */
    function errorRemovingCompetency(err) {
        ViewManager.getView("#frameworkEditMessageContainer").displayAlert(err, "removeCompetency");
    }

    var _setupLevelTypeahead = setupLevelTypeahead;

    /**
     * Handles setting up the level typeahead on screen setup
     * 
     * @memberOf FrameworkEditScreen
     * @method setupLevelTypeahead
     * @private
     * @param {EcFramework} framework
     * 			Framework used to help determine which competencies to use during level search
     */
    function setupLevelTypeahead(framework) {
        $("#frameworkEditAddLevel").typeahead({
            hint: false,
            highlight: true,
            minLength: 2,
        }, {
            name: 'levels',
            source: function (q, syncCallback, asyncCallback) {
                var levels = {};

                var i = 0;
                for (var j = 0; j < framework.competency.length; j++) {
                    var id = framework.competency[j];
                    EcCompetency.get(id, function (competency) {
                        competency.levels(AppController.serverController.getRepoInterface(), undefined, errorSearchingLevels, function (results) {
                            i++;

                            for (var idx in results) {
                                levels[results[idx].id] = results[idx];
                            }

                            if (i == framework.competency.length) {
                                var ret = [];
                                for (var id in levels) {
                                    if (framework.level == undefined || framework.level.indexOf(id) == -1 && framework.level.indexOf(EcRemoteLinkedData.trimVersionFromUrl(id)) == -1) {
                                        ret.push(levels[id])
                                    }
                                }

                                asyncCallback(ret);
                            }
                        });
                    });
                }
            },
            async: true,
            display: function (data) {
                return EcCompetency.getBlocking(data.competency).name + " - " + data.name + " (Title: " + data["title"] + ")";
            },
            templates: {
                suggestion: function (data) {
                    return "<div class='typeaheadSuggestion'>" + EcCompetency.getBlocking(data.competency).name + " - <i>" + data["name"] + " (Title: " + data["title"] + ") <span class='label secondary'>"+data["id"]+"</span></i></div>";
                }
            }
        }).bind("typeahead:selected", function (ev, data) {
            $('#frameworkEditAddLevel').typeahead('val', "");
            framework.addLevel(data.id);
            addLevel(data);
        }).bind("typeahead:autocompleted", function (obj, data) {
            $('#frameworkEditAddLevel').typeahead('val', "");
            framework.addLevel(data.id);
            addLevel(data);
        });
    }

    var _setupRollupRuleTypeahead = setupRollupRuleTypeahead;

    /**
     * Handles setting up the rollup rule typeahead on screen setup
     * 
     * @memberOf FrameworkEditScreen
     * @method setupRollupRuleTypeahead
     * @private
     * @param {EcFramework} framework
     * 			Framework used to help determine which competencies to use during rollup rules search
     */
    function setupRollupRuleTypeahead(framework) {
        $("#frameworkEditAddRollupRule").typeahead({
            hint: false,
            highlight: true,
            minLength: 2,
        }, {
            name: 'rollupRules',
            source: function (q, syncCallback, asyncCallback) {
                var rollupRules = {};

                var i = 0;
                for (var j = 0; j < framework.competency.length; j++) {
                    var id = framework.competency[j];
                    var competency = EcCompetency.getBlocking(id);
                    competency.rollupRules(AppController.serverController.getRepoInterface(), undefined, errorSearchingRollupRules, function (results) {
                        i++;

                        for (var idx in results) {
                            rollupRules[results[idx].id] = results[idx];
                        }

                        if (i == framework.competency.length) {
                            var ret = [];
                            for (var id in rollupRules) {
                                if (framework.rollupRule == undefined || framework.rollupRule.indexOf(id) == -1 && framework.rollupRule.indexOf(EcRemoteLinkedData.trimVersionFromUrl(id)) == -1) {
                                    ret.push(rollupRules[id])
                                }
                            }

                            asyncCallback(ret);
                        }
                    });
                }
            },
            async: true,
            display: function (data) {
                return EcCompetency.getBlocking(data.competency).name + " - " + data.name;
            },
            templates: {
                suggestion: function (data) {
                    return "<div class='typeaheadSuggestion'>" + EcCompetency.getBlocking(data.competency).name + " - <i>" + data["name"] + "</i> <span class='label secondary'>"+data["id"]+"</span></div>";
                }
            }
        }).bind("typeahead:selected", function (ev, data) {
            $('#frameworkEditAddRollupRule').typeahead('val', "");
            framework.addRollupRule(data.id);
            addRollupRule(data);
        }).bind("typeahead:autocompleted", function (obj, data) {
            $('#frameworkEditAddRollupRule').typeahead('val', "");
            framework.addRollupRule(data.id);
            addRollupRule(data);
        });
    }

    var _setupRelationTypehead = setupRelationTypeahead;

    /**
     * Handles setting up the relation typeahead on screen setup
     * 
     * @memberOf FrameworkEditScreen
     * @method setupRelationTypeahead
     * @private
     * @param {EcFramework} framework
     * 			Framework used to help determine which competencies to use during relation search
     */
    function setupRelationTypeahead(framework) {
        $("#frameworkEditAddRelation").typeahead({
            hint: false,
            highlight: true,
            minLength: 2,
        }, {
            name: 'relations',
            source: function (q, syncCallback, asyncCallback) {
                var relations = {};

                var i = 0;
                EcAlignment.searchBySources(AppController.serverController.getRepoInterface(), framework.competency, function (results) {
                    asyncCallback(results);
                }, errorSearchingRelations);
            },
            async: true,
            display: function (data) {
                return EcCompetency.getBlocking(data.source).name + " " + AppSettings.relationTypes[data["relationType"]] + " " + EcCompetency.getBlocking(data.target).name;
            },
            templates: {
                suggestion: function (data) {
                    return "<div class='typeaheadSuggestion'>" + EcCompetency.getBlocking(data.source).name + " <i>" + AppSettings.relationTypes[data["relationType"]] + "</i> " + EcCompetency.getBlocking(data.target).name + " <span class='label secondary'>"+data["id"]+"</span></div>";
                }
            }
        }).bind("typeahead:selected", function (ev, data) {
            $('#frameworkEditAddRelation').typeahead('val', "");
            framework.addRelation(data.id);
            addRelation(data);
        }).bind("typeahead:autocompleted", function (obj, data) {
            $('#frameworkEditAddRelation').typeahead('val', "");
            framework.addRelation(data.id);
            addRelation(data);
        });
    }

    /**
     * Handles setting up the competency typeahead on screen setup
     * 
     * @memberOf FrameworkEditScreen
     * @method setupCompetencyTypeahead
     * @private
     * @param {EcFramework} framework
     * 			Framework used to help determine which competencies already exist in the framework
     */
    function setupCompetencyTypeahead(framework) {
        $("#frameworkEditAddCompetency").typeahead({
            hint: false,
            highlight: true,
            minLength: 2,
        }, {
            limit: 25,
            name: 'competencies',
            source: function (q, syncCallback, asyncCallback) {
                EcCompetency.search(AppController.serverController.getRepoInterface(), q, function (results) {
                    var filtered = [];

                    for (var idx in results) {
                        if (framework.competency == undefined || (framework.competency.indexOf(results[idx].id) == -1 && framework.competency.indexOf(results[idx].shortId()) == -1)) {
                            filtered.push(results[idx]);
                        }
                    }

                    asyncCallback(filtered);
                }, errorSearchingCompetencies);
            },
            async: true,
            display: function (data) {
                return data["name"];
            },
            templates: {
                suggestion: function (data) {
                    return "<div class='typeaheadSuggestion' title='" + data["id"] + "'>" + data["name"] + "<span class='label secondary'>"+data["id"]+"</span></div>";
                }
            }
        }).bind("typeahead:selected", function (ev, data) {
            $('#frameworkEditAddCompetency').typeahead('val', "");
            framework.addCompetency(data.id);
            addCompetency(data);

        }).bind("typeahead:autocompleted", function (obj, data) {
            $('#frameworkEditAddCompetency').typeahead('val', "");
            framework.addCompetency(data.id);
            addCompetency(data);

        });
    }

    var NEW_FRAMEWORK_NAME = "";

    /**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf FrameworkEditScreen
	 * @method display
	 * @param containerId
	 * 			Screen Container DOM ID
	 */
    FrameworkEditScreen.prototype.display = function (containerId, callback) {
        var data = this.data;

        formDirty = false;

        if (data != undefined){
        	if(data.id != undefined) {
	            ScreenManager.setScreenParameters({
	                "id": EcRemoteLinkedData.trimVersionFromUrl(data.id)
	            });
        	}else{
        		data = undefined
        	}
        }

        if (data == undefined ) {
            data = new EcFramework();
            data.generateId(AppController.serverController.getRepoInterface().selectedServer);
            data.name = NEW_FRAMEWORK_NAME;

            if (AppController.identityController.selectedIdentity != undefined) {
                data.addOwner(AppController.identityController.selectedIdentity.ppk.toPk());
            }
            
            $("#frameworkEditName").focus();
        }

        ViewManager.showView(new MessageContainer("frameworkEdit"), "#frameworkEditMessageContainer", function () {
            if (data.name == NEW_FRAMEWORK_NAME && AppController.identityController.selectedIdentity == undefined) {
                ViewManager.getView("#frameworkEditMessageContainer").displayWarning("You are Creating a Public Framework, this competency can be modified by anyone")
            }
        });

        $("#frameworkEditSearchBtn").attr("href", "#" + FrameworkSearchScreen.prototype.displayName);
        $("#frameworkEditSearchBtn").click(function (event) {
            event.preventDefault();
            if (data.name == NEW_FRAMEWORK_NAME) {
                ScreenManager.changeScreen(new FrameworkSearchScreen())
            } else {
                ScreenManager.changeScreen(new FrameworkSearchScreen(data));
            }

        });

        if (data.name == NEW_FRAMEWORK_NAME) {
            $("#frameworkEditCreateCompetency").hide();

        } else {
            $("#frameworkEditCreateCompetency").attr("href", "#" + FrameworkEditScreen.prototype.displayName + "?frameworkId=" + EcRemoteLinkedData.trimVersionFromUrl(data.id));
            $("#frameworkEditCreateCompetency").click(function (event) {
                event.preventDefault();
				if(data.name == NEW_FRAMEWORK_NAME)
				{
				}
				else
				{
					ModalManager.showModal(new ConfirmModal(function(){
	                    ScreenManager.changeScreen(new CompetencyEditScreen(null, data.id), function(){
	                    	ModalManager.hideModal();
	                    });
	                }, "Creating a new competency will navigate away from this screen.<br/><br/> Any unsaved changes will be lost"));
				}
            });
        }

        if (data.name == NEW_FRAMEWORK_NAME) {
            $("#frameworkEditViewBtn").hide();

        } else {
            $("#frameworkEditViewBtn").attr("href", "#" + FrameworkViewScreen.prototype.displayName);
            $("#frameworkEditViewBtn").click(function (event) {
                event.preventDefault();
                ScreenManager.changeScreen(new FrameworkViewScreen(data))
            });
        }

        $("#frameworkEditBtn").attr("href", "#" + FrameworkEditScreen.prototype.displayName);
        $("#frameworkEditBtn").click(function (event) {
            event.preventDefault();
        });

        $("#frameworkEditCancelBtn").click(function (event) {
            event.preventDefault();
            ScreenManager.changeScreen(new FrameworkViewScreen(data))
        });

        if (data.name == NEW_FRAMEWORK_NAME) {
            $("#frameworkEditDeleteBtn").remove();
        } else {
            $("#frameworkEditDeleteBtn").click(function (event) {
                event.preventDefault();
                ModalManager.showModal(new ConfirmModal(function () {
                    data._delete(function () {
                        ScreenManager.changeScreen(new FrameworkSearchScreen());
                    }, function (err) {
                        if (err == undefined)
                            err = "Unable to connect to server to delete framework";
                        ViewManager.getView("#frameworkEditMessageContainer").displayAlert(err)
                    });
                    ModalManager.hideModal();
                }, "Are you sure you want to delete this framework?"));
            })
        }

        $("#frameworkEditSaveBtn").click(function (event) {
            event.preventDefault();

            data.name = $("#frameworkEditName").val();
            data.description = $("#frameworkEditDescription").val();
            data.id = $("#frameworkEditId").val();

            if (data.name != NEW_FRAMEWORK_NAME) {
                ViewManager.getView("#frameworkEditMessageContainer").clearAlert("saveFail");
                ViewManager.getView("#frameworkEditMessageContainer").clearAlert("defaultName");

                var savingData = new EcFramework();
                for (var key in data) {
                    savingData[key] = data[key];
                }

                savingData.save(function (str) {
                    data.id = savingData.id;
                    $("#frameworkEditId").val(data.id);
                    saveSuccess(str);
                }, errorSaving);
            } else {
                ViewManager.getView("#frameworkEditMessageContainer").displayAlert("Cannot Save Framework With Default Name", "defaultName");
            }
        });

        $("#frameworkEditSaveBtn").on("mousemove", function () {
            var url = $("#frameworkEditId").val();
            var split = url.split("\/");
            if (split[split.length - 4] == "data")
                split[split.length - 1] = new Date().getTime();
            $("#frameworkEditId").val(split.join("/"));
        });

        $("#importCompetenciesBtn").click(function () {
        	data.name = $("#frameworkEditName").val();
        	
        	if(data.name == undefined || data.name.trim() == ""){
        		alert("Framework name cannot be empty");
        	}else{
        		ModalManager.showModal(new ImportCompetenciesModal(data));
        	}
        })

        $("#frameworkEditCompetencies").focus(function () {
            setTimeout(function () {
                if ($("#frameworkEditCompetencies").val() != undefined && $("#frameworkEditCompetencies").val() != "") {
                    $("#frameworkEditCompetencies").css("margin-bottom", "0rem");
                    $("#frameworkEditDeleteCompetency").slideDown();
                }
            }, 100)
        });
        $("#frameworkEditCompetencies").blur(function () {
            $("#frameworkEditDeleteCompetency").slideUp(function () {
                $("#frameworkEditCompetencies").css("margin-bottom", "1rem");
            });
        });
        $("#frameworkEditDeleteCompetency").click(function (ev) {
            ev.preventDefault();
            var ids = $("#frameworkEditCompetencies").val();

            for (var idx in ids) {
                var id = ids[idx];

                data.removeCompetency(id, function () {
                    $("#frameworkEditOwner").text("");
                    $("#frameworkEditCompetencies").html("");
                    $("#frameworkEditRelations").html("");
                    $("#frameworkEditLevels").html("");
                    $("#frameworkEditRollupRules").html("");

                    data.name = $("#frameworkEditName").val();
                    data.description = $("#frameworkEditDescription").val();

                    displayFramework(data);
                }, errorRemovingCompetency);
            }
            formDirty = true;
        });
        $("#frameworkEditRelations").focus(function () {
            setTimeout(function () {
                if ($("#frameworkEditRelations").val() != undefined && $("#frameworkEditRelations").val() != "") {
                    $("#frameworkEditRelations").css("margin-bottom", "0rem");
                    $("#frameworkEditDeleteRelation").slideDown();
                }
            }, 100);
        });
        $("#frameworkEditRelations").blur(function () {
            $("#frameworkEditDeleteRelation").slideUp(function () {
                $("#frameworkEditRelations").css("margin-bottom", "1rem");
            });
        });
        $("#frameworkEditDeleteRelation").click(function (ev) {
            ev.preventDefault();
            var ids = $("#frameworkEditRelations").val();

            for (var idx in ids) {
                var id = ids[idx];

                data.removeRelation(id);

                var basicId = EcRemoteLinkedData.trimVersionFromUrl(id).split("/");
                basicId = basicId[basicId.length - 1];
                $("#frameworkEditRelations #" + basicId).remove();
            }

            $("#frameworkEditRelations optgroup").each(function (idx, el) {
                if ($(el).children().size() == 0)
                    $(el).remove();
            });

            formDirty = true;
        });

        $("#frameworkEditLevels").focus(function () {
            setTimeout(function () {
                if ($("#frameworkEditLevels").val() != undefined && $("#frameworkEditLevels").val() != "") {
                    $("#frameworkEditLevels").css("margin-bottom", "0rem");
                    $("#frameworkEditDeleteLevel").slideDown();
                }
            }, 100);
        });
        $("#frameworkEditLevels").blur(function () {
            $("#frameworkEditDeleteLevel").slideUp(function () {
                $("#frameworkEditLevels").css("margin-bottom", "1rem");
            });
        });
        $("#frameworkEditDeleteLevel").click(function (ev) {
            ev.preventDefault();
            var ids = $("#frameworkEditLevels").val();

            for (var idx in ids) {
                var id = ids[idx];

                data.removeLevel(id);

                var basicId = EcRemoteLinkedData.trimVersionFromUrl(id).split("/");
                basicId = basicId[basicId.length - 1];
                $("#frameworkEditLevels #" + basicId).remove();
            }

            $("#frameworkEditLevels optgroup").each(function (idx, el) {
                if ($(el).children().size() == 0)
                    $(el).remove();
            })

            formDirty = true;
        });

        $("#frameworkEditRollupRules").focus(function () {
            setTimeout(function () {
                if ($("#frameworkEditRollupRules").val() != undefined && $("#frameworkEditRollupRules").val() != "") {
                    $("#frameworkEditRollupRules").css("margin-bottom", "0rem");
                    $("#frameworkEditDeleteRollupRule").slideDown();
                }
            }, 100);
        });
        $("#frameworkEditRollupRules").blur(function () {
            $("#frameworkEditDeleteRollupRule").slideUp(function () {
                $("#frameworkEditRollupRules").css("margin-bottom", "1rem");
            });
        });
        $("#frameworkEditDeleteRollupRule").click(function (ev) {
            ev.preventDefault();
            var ids = $("#frameworkEditRollupRules").val();

            for (var idx in ids) {
                var id = ids[idx];

                data.removeRollupRule(id);

                var basicId = EcRemoteLinkedData.trimVersionFromUrl(id).split("/");
                basicId = basicId[basicId.length - 1];
                $("#frameworkEditRollupRules #" + basicId).remove();
            }

            $("#frameworkEditRollupRules optgroup").each(function (idx, el) {
                if ($(el).children().size() == 0)
                    $(el).remove();
            });
        });

        $("#frameworkEditOwnerAdvanced").click(function (ev) {
            ev.preventDefault();

            data.name = $("#frameworkEditName").val();
            data.description = $("#frameworkEditDescription").val();

            var oldOwner = data.owner.slice(0);
            var oldReader = data.reader == undefined ? undefined :data.reader.slice(0);
            
            ModalManager.showModal(new AdvancedPermissionsModal(data, function (dataAfter) {
            	if(!AppController.identityController.owns(dataAfter)){
            		if(!confirm("Are you sure you want to remove your ownership from this framework? \n\n You will no longer be able to edit it if you do")){
            			data.owner = oldOwner
            			data.reader = oldReader;
            			ModalManager.hideModal();
            			return;
            		}
            	}
            	
               	var changed = false;
               	if(oldOwner != undefined && data.owner != undefined && oldOwner.length != data.owner.length){
               		for (var idx in oldOwner){
               			if(data.owner.indexOf(oldOwner[idx]) == -1)
               				changed = true;
               		}
               		for (var idx in data.owner){
               			if(oldOwner.indexOf(data.owner[idx]) == -1)
               				changed = true;
               		}
               	}else if (oldOwner != undefined && data.owner == undefined){
               		changed = true;
               	}
               	
               	if(oldReader == undefined && data.reader != undefined && data.reader.length > 0){
               		changed = true;
               	}else if(oldReader != undefined){
               		if(data.reader == undefined){
               			changed = true;
               		}else if(oldReader.length > 0 && (data.reader == undefined || data.reader.length == 0)){
            			changed = true;
            		}else if(oldReader.length == 0 && (data.reader != undefined && data.reader.length > 0)){
            			changed = true;
            		}else if(data.reader != undefined && oldReader.length != data.reader.length){
            			for (var idx in oldReader){
                   			if(data.reader.indexOf(oldReader[idx]) == -1)
                   				changed = true;
                   		}
                   		for (var idx in data.reader){
                   			if(oldReader.indexOf(data.reader[idx]) == -1)
                   				changed = true;
                   		}
            		}
               	}
            	
            	if(changed){
                	data.owner = dataAfter.owner;
                    data.reader = dataAfter.reader;

                    displayFramework(data);

                    ModalManager.showModal(new PermissionPropagationModal(data, function(){
                    	displayFramework(data);
                    }));
               	}else{
               		ModalManager.hideModal();
               	}
               	
            }))
        })


        if (data.name == NEW_FRAMEWORK_NAME) {
            displayFramework(data);
            setupCompetencyTypeahead(data);
            setupRelationTypeahead(data);
            setupLevelTypeahead(data);
            setupRollupRuleTypeahead(data);
        } else {
            EcFramework.get(data.id, function (framework) {
                data = framework;

                displayFramework(data);
                setupCompetencyTypeahead(data);
                setupRelationTypeahead(data);
                setupLevelTypeahead(data);
                setupRollupRuleTypeahead(data);
            }, errorRetrieving);
        }

    };

    /**
	 * Public function for adding a competency to the edit form while it is being displayed
	 * 
	 * @memberOf FrameworkEditScreen
	 * @method addCompetency
	 * @param {EcCompetency} competency
	 * 			Competency to add to the framework
	 */
    FrameworkEditScreen.prototype.addCompetency = function (competency) {
        addCompetency(competency);
    }

    /**
	 * Public function for adding a relation to the edit form while it is being displayed
	 * 
	 * @memberOf FrameworkEditScreen
	 * @method addRelation
	 * @param {EcAlignment} relation
	 * 			relation to add to the framework
	 */
    FrameworkEditScreen.prototype.addRelation = function (relation) {
        addRelation(relation);
    }

    /**
	 * Public function for showing that the framework has been saved by another view
	 * 
	 * @memberOf FrameworkEditScreen
	 * @method showSave
	 */
    FrameworkEditScreen.prototype.showSave = function () {
    	saveSuccess();
    }
    
    /**
	 * Public function for showing error saving framework by another view
	 * 
	 * @memberOf FrameworkEditScreen
	 * @method errorSaving
	 * @param {String} err
	 * 			Error Message to display
	 */
    FrameworkEditScreen.prototype.errorSaving = function (err) {
    	errorSaving(err)
    }
    
    /**
	 * Public function for showing successful action in another view (modal probably)
	 * 
	 * @memberOf FrameworkEditScreen
	 * @method displaySuccess
	 * @param {String} msg
	 * 			Message to display
	 */
    FrameworkEditScreen.prototype.displaySuccess = function (msg) {
    	 if (msg != undefined)
    		 ViewManager.getView("#frameworkEditMessageContainer").displaySuccess(msg);
    }
    
    return FrameworkEditScreen;
})(FrameworkEditScreen);
