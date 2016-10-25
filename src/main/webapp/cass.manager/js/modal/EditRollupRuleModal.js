var EditRollupRuleModal = (function (EditRollupRuleModal) {

    function saveRollupRuleFail(err) {
        if (err == undefined)
            err = "Unable to Connect to Server to Save RollupRule";

        ViewManager.getView("#editRollupRuleError").displayAlert(err);
    }

    function errorDeleting(err) {
        if (err == undefined)
            err = "Unable to Connect to Server to Delete RollupRule";

        ViewManager.getView("#editRollupRuleError").displayAlert(err);
    }

    EditRollupRuleModal.prototype.display = function (containerId) {
        var data = this.data;
        var modalCloseCallback = this.closeCallback;

        ViewManager.showView(new MessageContainer("editRollupRule"), "#editRollupRuleError", function () {
            if (AppController.identityController.selectedIdentity == undefined && data.isAny(new EcCompetency().getTypes())) {
                ViewManager.getView("#editRollupRuleError").displayWarning("You are Creating a Public RollupRule, this Rollup Rule can be modified by anyone");
            }
        });

        $("#editRollupRuleCancel").click(function (event) {
            event.preventDefault();
            ModalManager.hideModal();
        });

        if (data.isAny(new EcCompetency().getTypes())) {
            if (AppController.identityController.selectedIdentity != undefined) {
                $("#editRollupRuleOwnership").text("");

                var pem = AppController.identityController.selectedIdentity.ppk.toPk().toPem()

                var contact = $(createContactSmall(pem));
                $("#editRollupRuleOwnership").append(contact);

                $("#editRollupRuleAdvancedOwnership").removeClass("hide");
                $("#editRollupRuleAdvancedOwnership").click(function (ev) {
                    var rollupRule = new EcRollupRule();
                    rollupRule.name = $("#editRollupRuleName").val();
                    rollupRule.rule = $("#editRollupRuleRule").val();
                    rollupRule.description = $("#editRollupRuleDescription").val();
                    rollupRule.outcome = $("#editRollupRuleOutcome").val();

                    var owners = $("#editRollupRuleOwnership").children("span").map(function (idx, el) {
                        return $(el).find(".contactText").attr("title");
                    })

                    for (var i = 0; i < owners.length; i++) {
                        rollupRule.addOwner(EcPk.fromPem(owners[i]))
                    }

                    if (!$("#editRollupRuleVisibilityRow").hasClass("hide")) {
                        rollupRule.privateEncrypted = true;
                        var readers = $("#editRollupRuleReaders").children().map(function (idx, el) {
                            return $(el).find(".contactText").attr("title");
                        })

                        for (var i = 0; i < readers.length; i++) {
                            rollupRule.addReader(EcPk.fromPem(readers[i]))
                        }
                    }

                    ModalManager.showModal(new AdvancedPermissionsModal(rollupRule, function (permissionedRollupRule) {
                        ModalManager.showModal(new EditRollupRuleModal(data, modalCloseCallback), function () {
                            $("#editRollupRuleName").val(permissionedRollupRule.name);
                            $("#editRollupRuleRule").val(permissionedRollupRule.rule);
                            $("#editRollupRuleDescription").val(permissionedRollupRule.description);
                            $("#editRollupRuleOutcome").val(permissionedRollupRule.outcome);

                            if (permissionedRollupRule.owner != undefined && permissionedRollupRule.owner.length > 0) {
                                $("#editRollupRuleOwnership").text("");

                                for (var i = 0; i < permissionedRollupRule.owner.length; i++) {
                                    if (i > 0)
                                        $("#editRollupRuleOwnership").append(", ");

                                    var pem = permissionedRollupRule.owner[i];

                                    var contact = $(createContactSmall(pem));
                                    $("#editRollupRuleOwnership").append(contact);
                                }
                            } else {
                                $("#editRollupRuleOwnership").text("Public");
                            }

                            if (permissionedRollupRule.privateEncrypted) {
                                $("#editRollupRuleVisibilityRow").removeClass("hide");
                                $("#editRollupRuleReadersRow").removeClass("hide");

                                if (permissionedRollupRule.reader != undefined && permissionedRollupRule.reader.length > 0) {
                                    $("#editRollupRuleReaders").text("");
                                    $("#editRollupRuleReaders").css("font-style", "normal");

                                    for (var i = 0; i < permissionedRollupRule.reader.length; i++) {
                                        if (i > 0)
                                            $("#editRollupRuleReaders").append(", ");

                                        var pem = permissionedRollupRule.reader[i];

                                        var contact = $(createContactSmall(pem));
                                        $("#editRollupRuleReaders").append(contact);
                                    }
                                } else {
                                    $("#editRollupRuleReaders").text("None Added Yet");
                                }
                            } else {
                                $("#editRollupRuleVisibilityRow").addClass("hide");
                                $("#editRollupRuleReadersRow").addClass("hide");

                            }
                        })
                    }))
                });
            }


            $("#editRollupRuleDelete").remove();

            $("#editRollupRuleSubmit").click(function (event) {
                event.preventDefault();

                var rollupRule = new EcRollupRule();
                if (AppController.identityController.selectedIdentity != undefined) {
                    rollupRule.addOwner(AppController.identityController.selectedIdentity.ppk.toPk());
                }
                rollupRule.generateId(AppController.serverController.selectedServerUrl)
                rollupRule.name = $("#editRollupRuleName").val();
                rollupRule.rule = $("#editRollupRuleRule").val();
                rollupRule.description = $("#editRollupRuleDescription").val();
                rollupRule.outcome = $("#editRollupRuleOutcome").val();
                rollupRule.competency = data.shortId();

                var owners = $("#editRollupRuleOwnership").children("span").map(function (idx, el) {
                    return $(el).find(".contactText").attr("title");
                })

                for (var i = 0; i < owners.length; i++) {
                    rollupRule.addOwner(EcPk.fromPem(owners[i]))
                }

                if (!$("#editRollupRuleVisibilityRow").hasClass("hide")) {
                    rollupRule.privateEncrypted = true;
                    var readers = $("#editRollupRuleReaders").children().map(function (idx, el) {
                        return $(el).find(".contactText").attr("title");
                    })

                    for (var i = 0; i < readers.length; i++) {
                        rollupRule.addReader(EcPk.fromPem(readers[i]))
                    }
                }

                if (rollupRule.name == undefined || rollupRule.name == "") {
                    ViewManager.getView("#editRollupRuleError").displayAlert("RollupRule Requires a Name to be Saved");
                    return;
                }

                rollupRule.save(function () {
                    if (modalCloseCallback != undefined)
                        modalCloseCallback(rollupRule);

                    ModalManager.hideModal();
                }, saveRollupRuleFail);
            })
        } else if (data.isAny(new EcRollupRule().getTypes())) {
            $("#editRollupRuleDelete").removeClass("hide");

            $("#editRollupRuleSubmit").text("Save");

            $("#editRollupRuleName").val(data.name);
            $("#editRollupRuleRule").val(data.rule);
            $("#editRollupRuleDescription").val(data.description);
            $("#editRollupRuleOutcome").val(data.outcome);

            if (data.privateEncrypted == true) {
                $("#editRollupRuleVisibilityRow").removeClass("hide");
                $("#editRollupRuleReadersRow").removeClass("hide");

                if (data.reader != undefined && data.reader.length > 0) {
                    $("#editRollupRuleReaders").text("");
                    $("#editRollupRuleReaders").css("font-style", "normal");

                    for (var i = 0; i < data.reader.length; i++) {
                        if (i > 0)
                            $("#editRollupRuleReaders").append(", ");

                        var pem = data.reader[i];

                        var contact = $(createContactSmall(pem));
                        $("#editRollupRuleReaders").append(contact);
                    }
                } else {
                    $("#editRollupRuleReaders").text("None Added Yet");
                }
            }

            if (data.owner != undefined && data.owner.length > 0) {
                $("#editRollupRuleOwnership").text("");

                for (var i = 0; i < data.owner.length; i++) {
                    if (i > 0)
                        $("#editRollupRuleOwnership").append(", ");

                    var pem = data.owner[i];

                    var contact = $(createContactSmall(pem));
                    $("#editRollupRuleOwnership").append(contact);
                }
            }

            var canEdit = false;
            for (var index in EcIdentityManager.ids) {
                var pk = EcIdentityManager.ids[index].ppk.toPk()
                if (data.canEdit(pk))
                    canEdit = true;
            }
            if (data.owner == undefined || data.owner.length == 0)
                canEdit = true;

            if (canEdit) {
                if (data.owner != undefined) {
                    $("#editRollupRuleAdvancedOwnership").removeClass("hide");
                    $("#editRollupRuleAdvancedOwnership").click(function (ev) {
                        data.name = $("#editRollupRuleName").val();
                        data.rule = $("#editRollupRuleRule").val();
                        data.description = $("#editRollupRuleDescription").val();
                        data.outcome = $("#editRollupRuleOutcome").val();

                        var owners = $("#editRollupRuleOwnership").children("span").map(function (idx, el) {
                            return $(el).find(".contactText").attr("title");
                        })

                        for (var i = 0; i < owners.length; i++) {
                            data.addOwner(EcPk.fromPem(owners[i]))
                        }

                        if (!$("#editRollupRuleVisibilityRow").hasClass("hide")) {
                            data.privateEncrypted = true;
                            var readers = $("#editRollupRuleReaders").children().map(function (idx, el) {
                                return $(el).find(".contactText").attr("title");
                            })

                            for (var i = 0; i < readers.length; i++) {
                                data.addReader(EcPk.fromPem(readers[i]))
                            }
                        }

                        ModalManager.showModal(new AdvancedPermissionsModal(data, function (permissionedRollupRule) {
                            if (permissionedRollupRule.privateEncrypted) {
                                $("#editRollupRuleVisibilityRow").removeClass("hide");
                                $("#editRollupRuleReadersRow").removeClass("hide");

                                if (permissionedRollupRule.reader != undefined && permissionedRollupRule.reader.length > 0) {
                                    $("#editRollupRuleReaders").text("");
                                    $("#editRollupRuleReaders").css("font-style", "normal");

                                    for (var i = 0; i < permissionedRollupRule.reader.length; i++) {
                                        var pem = permissionedRollupRule.reader[i];

                                        var contact = $(createContactSmall(pem));
                                        $("#editRollupRuleReaders").append(contact);
                                    }
                                } else {
                                    $("#editRollupRuleReaders").text("None Added Yet");
                                }
                            } else {
                                $("#editRollupRuleVisibilityRow").addClass("hide");
                                $("#editRollupRuleReadersRow").addClass("hide");

                            }

                            ModalManager.showModal(new EditRollupRuleModal(permissionedRollupRule, modalCloseCallback))
                        }));
                    });
                }

                $("#editRollupRuleModalTitle").text("Edit RollupRule");

                $("#editRollupRuleSubmit").click(function (event) {
                    event.preventDefault();

                    data.name = $("#editRollupRuleName").val();
                    data.rule = $("#editRollupRuleRule").val();
                    data.description = $("#editRollupRuleDescription").val();
                    data.outcome = $("#editRollupRuleOutcome").val();

                    var owners = $("#editRollupRuleOwnership").children("span").map(function (idx, el) {
                        return $(el).find(".contactText").attr("title");
                    })

                    for (var i = 0; i < owners.length; i++) {
                        data.addOwner(EcPk.fromPem(owners[i]))
                    }

                    if (!$("#editRollupRuleVisibilityRow").hasClass("hide")) {
                        data.privateEncrypted = true;
                        var readers = $("#editRollupRuleReaders").children().map(function (idx, el) {
                            return $(el).find(".contactText").attr("title");
                        })

                        for (var i = 0; i < readers.length; i++) {
                            data.addReader(EcPk.fromPem(readers[i]))
                        }
                    }

                    if (data.name == undefined || data.name == "") {
                        ViewManager.getView("#editRollupRuleError").displayAlert("RollupRule Requires a Name to be Saved");
                        return;
                    }

                    var url = data.id;
                    var split = url.split("\/");
                    if (split[split.length - 4] == "data")
                        split[split.length - 1] = new Date().getTime();
                    data.id = split.join("/");

                    data.save(data, function (rollupRule) {
                        if (modalCloseCallback != undefined)
                            modalCloseCallback(data);

                        ModalManager.hideModal();
                    }, saveRollupRuleFail);
                });

                $("#editRollupRuleDelete").click(function (event) {
                    event.preventDefault();

                    EcRepository._delete(data, function () {
                        if (modalCloseCallback != undefined)
                            modalCloseCallback(null);
                        ModalManager.hideModal();
                    }, errorDeleting);
                })
            } else {
                $("#editRollupRuleModalTitle").text("View RollupRule");

                $("#editRollupRuleDelete").remove();
                $("#editRollupRuleSubmit").remove();
                $("#editRollupRuleCancel").remove();

                $("#editRollupRuleName").attr("disabled", "disabled");
                $("#editRollupRuleRule").attr("disabled", "disabled");
                $("#editRollupRuleDescription").attr("disabled", "disabled");
                $("#editRollupRuleOutcome").attr("disabled", "disabled");
            }
        } else {
            ViewManager.getView("#editRollupRuleError").displayAlert("Unrecognized Context For RollupRule Modal");
            $("#editRollupRuleName").attr("disabled", "disabled");
            $("#editRollupRuleRule").attr("disabled", "disabled");
            $("#editRollupRuleDescription").attr("disabled", "disabled");
            $("#editRollupRuleOutcome").attr("disabled", "disabled");

            $("#editRollupRuleSubmit").click(function (event) {
                event.preventDefault();
            });
        }



    }

    return EditRollupRuleModal;
})(EditRollupRuleModal);
