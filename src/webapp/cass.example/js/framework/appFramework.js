
function frameworkSearch() {
    var searchString = "(@type:\"" + Framework.myType + "\")";
    if ($("#frameworkSearch").val() != "")
        searchString += " AND (" + $("#frameworkSearch").val() + ")";
    repo.search(searchString, null,
        function (frameworks) {
            $("#frameworks").replaceWith(frameworksTemplate);
            $("#frameworks").html("");
            for (var i = 0; i < frameworks.length; i++) {
                var fw = frameworks[i];
                $("#frameworks").append(cassFrameworkTemplate);
                var ui = $("#frameworks").children().last();
                ui.attr("url", fw.shortId());
                ui.find(".cass-framework-name").text(fw.name);
                ui.find(".cass-framework-description").text(fw.description);
            }
            $("#frameworks").foundation();
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
    EcRepository.save(f, function () {
        frameworkSearch();
        $("#newFramework").foundation('close');
    }, error);
}

function populateFramework(frameworkId) {
    EcRepository.get(frameworkId, function (fw) {
        var fwui = $("[url='" + fw.shortId() + "']");
        fwui.find(".cass-framework-name").text(fw.name);
        fwui.find(".cass-framework-description").text(fw.description);
        fwui.find(".cass-framework-url").text(fw.shortId()).attr("href", fw.shortId());
        fwui.find(".cass-framework-competencies").html(competencyTemplate);
        fwui.find("#competency").html("");
        if (fw.competency !== undefined) {
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
                    }, (0));
                })(competencyUrl, i);
            }
            fwui.find("#competency").foundation();
        }
        populateFrameworkRelations(frameworkId);
        populateFrameworkLevels(frameworkId);
        if (identity != null && fw.canEdit(identity.ppk.toPk()))
            $(".canEditFramework").show();
        else
            $(".canEditFramework").hide();
    });
}

$("body").on("click", ".cass-framework", null, function (e) {
    e.stopPropagation();

    setTimeout((function (frameworkUrl) {
        $(".canEditFramework").hide();
        populateFramework(frameworkUrl);
    })($(this).attr("url")),0);
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
            EcRepository._delete(framework, function (response) {
                frameworkSearch();
                $("#editFramework").foundation('close');
            }, error);
        });
}
