/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

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

    var searchString = new EcLevel().getSearchStringByType();
    searchString += " AND (competency:\"" + competencyId + "\")";
    repo.search(searchString, null,
        function (levels) {
            if (levels.length == 0)
                $("#insertExistingLevelsResults").html("No levels found.");
            else
                $("#insertExistingLevelsResults").html("");
            for (var i = 0; i < levels.length; i++) {
                EcLevel.get(levels[i].shortId(), function (level) {
                    var ui = $("#insertExistingLevel");
                    ui.find(".cass-competency-levels").append(cassLevelTemplate);
                    ui = ui.find(".cass-competency-levels").children().last();
                    ui.attr("url", level.shortId());
                    ui.find(".cass-level-name").text(level.getName());
                    ui.find(".cass-level-title").text(level.title);
                    ui.find(".cass-level-description").text(level.getDescription());
                    if ($("[url='" + frameworkId + "']").find("[url='" + competencyId + "']").find("[url='" + level.shortId() + "']").length > 0)
                        ui.find(".cass-level-actions").html("<a class='button tiny float-right disabled'>Exists</a>&nbsp;");
                    else
                        ui.find(".cass-level-actions").html("<a class='button tiny float-right' onclick='insertExistingLevelIntoFramework(this);setTimeout(function(){insertExistingLevel();},1000);'>Insert</a>&nbsp;");
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
    $("#newLevelName").select();
}

function newLevel(close) {
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
        if (close == null || close == true)
            $("#newLevel").foundation('close');
        else
            $("#newLevelName").select();
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
        $("#editLevelName").val(level.getName());
        $("#editLevelTitle").val(level.title);
        $("#editLevelDescription").val(level.getDescription());
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
