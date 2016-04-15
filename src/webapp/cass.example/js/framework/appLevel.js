
function insertExistingLevel() {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    var competencyId = $("#frameworks").find(".is-active").find(".cass-framework-competencies").find(".is-active").attr("url");
    if (competencyId == null) {
        error("Competency not selected.");
        return;
    }

    var searchString = "(@type:\"" + EcLevel.myType + "\")";
    searchString += " AND (competency:\"" + competencyId + "\")";
    repo.search(searchString, null,
        function (levels) {
            $("#insertExistingLevelsResults").html("");
            for (var i = 0; i < levels.length; i++) {
                EcRepository.get(levels[i].shortId(), function (level) {
                    var ui = $("#insertExistingLevel");
                    ui.find(".cass-competency-levels").append(cassLevelTemplate);
                    ui = ui.find(".cass-competency-levels").children().last();
                    ui.attr("url", level.shortId());
                    ui.find(".cass-level-name").text(level.name);
                    ui.find(".cass-level-title").text(level.title);
                    ui.find(".cass-level-description").text(level.description);
                    if ($("[url='" + frameworkId + "']").find("[url='" + competencyId + "']").find("[url='" + level.shortId() + "']").length > 0)
                        ui.prepend("<a class='float-right disabled'>Exists</a>");
                    else
                        ui.prepend("<a class='float-right' onclick='insertExistingLevelIntoFramework(this);setTimeout(function(){insertExistingLevel();},1000);'>Insert</a>");
                }, error);
            }
            $("#insertExistingLevel").foundation('open');
        }, error
    );
}

function insertNewLevel() {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    var competencyId = $("#frameworks").find(".cass-competency.is-active").attr("url");
    if (competencyId == null) {
        error("Competency not selected.");
        return;
    }
    $("#newLevelName").html("");
    $("#newLevelTitle").html("");
    $("#newLevelDescription").html("");
    $("#newLevel").foundation('open');
}

function newLevel(frameworkId) {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    var competencyId = $("#frameworks").find(".cass-competency.is-active").attr("url");
    if (competencyId == null) {
        error("Competency not selected.");
        return;
    }
    var f = new EcLevel();
    f.name = $("#newLevelName").val();
    f.title = $("#newLevelTitle").val();
    f.description = $("#newLevelDescription").val();
    f.competency = competencyId;
    f.generateId(repo.selectedServer);
    if (identity != null)
        f.addOwner(identity.ppk.toPk());
    else
    {
        alert("Login required to create level.");
        return;
    }
    EcRepository.save(f, function () {
        insertLevelIntoFramework(f.shortId(), frameworkId);
        $("#newLevel").foundation('close');
    }, error);
}

function editLevelButton(me) {
    var levelId = $(me).parents(".cass-competency-level").attr("url");
    editLevel(levelId);
}

function editLevel(levelId) {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    EcRepository.get(levelId, function (level) {
        $("#editLevelId").val(level.shortId());
        $("#editLevelName").val(level.name);
        $("#editLevelTitle").val(level.title);
        $("#editLevelDescription").val(level.description);
        $("#editLevel").foundation('open');
    }, error);
}

function editLevelSave() {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    EcRepository.get($("#editLevelId").val(), function (level) {
        level.name = $("#editLevelName").val();
        level.title = $("#editLevelTitle").val();
        level.description = $("#editLevelDescription").val();
        EcRepository.save(level, function () {
            populateFrameworkLevels(frameworkId);
            $("#editLevel").foundation('close');
        }, error);
    }, error);
}

function editLevelDelete() {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    if (confirm("This will delete the selected level. Continue?") == true)
        EcRepository.get($("#editLevelId").val(), function (level) {
            EcRepository._delete(level, function (response) {
                removeLevelFromFramework(level.shortId(), frameworkId);
                $("#editLevel").foundation('close');
            }, error);
        });
}
