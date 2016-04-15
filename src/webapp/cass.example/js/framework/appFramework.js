function frameworkSearch() {
    var searchString = "(@type:\"" + Framework.myType + "\")";
    if ($("#frameworkSearch").length > 0 && $("#frameworkSearch").val().trim() != "")
        searchString += " AND (" + $("#frameworkSearch").val() + ")";
    repo.search(searchString, null,
        function (frameworks) {
            $("#frameworks").replaceWith(frameworksTemplate);
            $("#frameworks-frameworks").html("");
            for (var i = 0; i < frameworks.length; i++) {
                var fw = frameworks[i];
                $("#frameworks-frameworks").append(cassFrameworkTemplate);
                var ui = $("#frameworks-frameworks").children().last();
                ui.attr("url", fw.shortId());
                ui.find(".cass-framework-name").text(fw.name);
                ui.find(".cass-framework-description").text(fw.description);
            }
            $(document).foundation();
        }, error
    );
}

function newFrameworkButton() {
    $("#newFramework").foundation('open');
}

function newFramework() {
    var f = new Framework();
    f.name = $("#newFrameworkName").val();
    f.description = $("#newFrameworkDescription").val();
    f.generateId(repo.selectedServer);
    if (identity != null)
        f.addOwner(identity.ppk.toPk());
    else
    {
        alert("Login required to create framework.");
        return;
    }
    EcRepository.save(f, function () {
        frameworkSearch();
        $("#newFramework").foundation('close');
    }, error);
}

function populateFramework(frameworkId) {
    EcRepository.get(frameworkId, function (fw) {
        var fwui = $("[url='" + fw.shortId() + "']");
        fwui.find(".cass-framework-name").text(fw.name);
        if (fw.description === undefined || fw.description == null)
            fwui.find(".cass-framework-description").text("No description");
        else
            fwui.find(".cass-framework-description").text(fw.description);
        fwui.find(".cass-framework-url").text(fw.shortId()).attr("href", fw.shortId());
        fwui.find(".cass-framework-competencies").html(competencyTemplate);
        fwui.find("#competency").html("");
        if (fwui.find(".cass-framework-competencies").length > 0 && fw.competency !== undefined) {
            repo.precache(fw.competency);
            for (var i = 0; i < fw.competency.length; i++) {
                var competencyUrl = fw.competency[i];
                fwui.find("#competency").append(cassCompetencyTemplate);
                var ui = fwui.find("#competency").children().last();
                ui.attr("url", competencyUrl);
                ui.find(".cass-competency-relations").html("");
                ui.find(".cass-competency-actions").prepend("<a class='canEditCompetency' onclick='editCompetencyButton(this);' style='display:none;'>✎</a>");
                ui.find(".cass-competency-actions").append("<a class='canEditFramework' onclick='removeCompetencyFromFrameworkButton(this);' style='display:none;'>X</a>");
                (function (competencyUrl, i) {
                    timeout(function () {
                        populateCompetency(competencyUrl);
                    });
                })(competencyUrl, i);
            }
            fwui.find("#competency").foundation();
        }
        populateFrameworkRelations(frameworkId);
        populateFrameworkLevels(frameworkId);
        $(".canEditFramework").hide();
        for (var i = 0;i < EcIdentityManager.ids.length;i++)
            if (fw.canEdit(EcIdentityManager.ids[i].ppk.toPk()))
                if (identity != null)
                    $(".canEditFramework").show();
    });
}

$("body").on("click", ".cass-framework", null, function (e) {
    e.stopPropagation();

    setTimeout((function (frameworkUrl) {
        $(".canEditFramework").hide();
        populateFramework(frameworkUrl);
    })($(this).attr("url")), 0);
}, error);

function editFramework(e) {
    e.stopPropagation();
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    EcRepository.get(frameworkId, function (framework) {
        $("#editFrameworkName").val(framework.name);
        $("#editFrameworkDescription").val(framework.description);
        $("#editFramework").foundation('open');
    }, error);
}

function editFrameworkSave() {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    EcRepository.get(frameworkId, function (framework) {
        framework.name = $("#editFrameworkName").val();
        framework.description = $("#editFrameworkDescription").val();
        EcRepository.save(framework, function (framework) {
            frameworkSearch();
            $("#editFramework").foundation('close');
        }, error);
    }, error);
}

function editFrameworkDelete() {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    if (confirm("This will delete the selected framework. Continue?") == true)
        EcRepository.get(frameworkId, function (framework) {
            if (confirm("Delete all competencies, levels, and relations as well?") == true) {
                if (framework.competency != null)
                    for (var i = 0; i < framework.competency.length; i++)
                        (function (framework, i) {
                            timeout(function () {
                                EcRepository.get(framework.competency[i], function (competency) {
                                    EcRepository._delete(competency, function (success) {}, error);
                                });
                            })
                        })(framework, i);
                if (framework.level != null)
                    for (var i = 0; i < framework.level.length; i++)
                        (function (framework, i) {
                            timeout(function () {
                                EcRepository.get(framework.level[i], function (level) {
                                    EcRepository._delete(level, function (success) {}, error);
                                });
                            })
                        })(framework, i);
                if (framework.relation != null)
                    for (var i = 0; i < framework.relation.length; i++)
                        (function (framework, i) {
                            timeout(function () {
                                EcRepository.get(framework.relation[i], function (relation) {
                                    EcRepository._delete(relation, function (success) {}, error);
                                });
                            })
                        })(framework, i);
            }
            timeoutAndBlock(function () {
                EcRepository._delete(framework, function (response) {
                    frameworkSearch();
                }, error);
            });
            $("#editFramework").foundation('close');
        });
}
