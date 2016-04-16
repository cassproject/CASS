/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

function populateFrameworkLevels(frameworkId) {
    EcRepository.get(frameworkId, function (fw) {
        $("[url='" + frameworkId + "']").find(".cass-competency-levels").html("");
        if (fw.level !== undefined) {
            repo.precache(fw.level);
            for (var i = 0; i < fw.level.length; i++) {
                EcRepository.get(fw.level[i], function (level) {
                    var ui = $("[url='" + frameworkId + "']").find("[url='" + level.competency + "']");
                    ui.find(".cass-competency-levels").append(cassLevelTemplate);
                    ui = ui.find(".cass-competency-levels").children().last();
                    ui.attr("url", level.shortId());
                    ui.find(".cass-level-name").text(level.name);
                    ui.find(".cass-level-title").text(level.title);
                    ui.find(".cass-level-description").text(level.description);
                    ui.find(".cass-level-actions").append("<a class='canEditLevel' onclick='removeLevelFromFrameworkButton(this);' style='display:none;'>X</a>");
                    ui.find(".cass-level-actions").prepend("<a class='canEditLevel' onclick='editLevelButton(this);' style='display:none;'>✎</a>");
                    if (identity != null && level.canEdit(identity.ppk.toPk()))
                        ui.find(".canEditLevel").show();
                    else
                        ui.find(".canEditLevel").hide();
                    if (identity != null && fw.canEdit(identity.ppk.toPk()))
                        ui.find(".canEditFramework").show();
                    else
                        ui.find(".canEditFramework").hide();
                }, error);
            }
        }
    });
}

function insertExistingLevelIntoFramework(me) {
    var levelId = $(me).parent(".cass-competency-level").attr("url");
    var frameworkId = $("#frameworks").find(".is-active").attr("url");

    insertLevelIntoFramework(levelId, frameworkId);
}

function insertLevelIntoFramework(levelId, frameworkId) {
    if (levelId == null) {
        error("Level not selected.");
        return;
    }
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    EcRepository.get(frameworkId, function (framework) {
        var f = new EcFramework();
        f.copyFrom(framework);
        f.addLevel(levelId);
        EcRepository.save(f, function () {
            populateFrameworkLevels(frameworkId);
        }, error);
    }, error);
}


function removeLevelFromFrameworkButton(me) {
    var levelId = $(me).parents(".cass-competency-level").attr("url");
    var frameworkId = $("#frameworks").find(".is-active").attr("url");

    removeLevelFromFramework(levelId, frameworkId);
}

function removeLevelFromFramework(levelId, frameworkId) {
    if (levelId == null) {
        error("Level not selected.");
        return;
    }
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    EcRepository.get(frameworkId, function (framework) {
        var f = new EcFramework();
        f.copyFrom(framework);
        f.removeLevel(levelId);
        EcRepository.save(f, function () {
            populateFrameworkLevels(frameworkId);
        }, error);
    }, error);
}
