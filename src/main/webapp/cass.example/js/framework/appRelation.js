/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

function insertExistingRelation() {
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

    var searchString = new EcAlignment().getSearchStringByType();
    searchString += " AND (source:\"" + competencyId + "\" OR target:\"" + competencyId + "\")";
    repo.search(searchString, null,
        function (relations) {
            $("#insertExistingRelationResults").html("");
            for (var i = 0; i < relations.length; i++) {
                EcAlignment.get(relations[i].shortId(), function (relation) {
                    var ui = $("#insertExistingRelation");
                    var source = EcRemoteLinkedData.trimVersionFromUrl(relation.source);
                    var target = EcRemoteLinkedData.trimVersionFromUrl(relation.target);
                    ui.find(".cass-competency-relations").append(cassRelationTemplate);
                    ui = ui.find(".cass-competency-relations").children().last();
                    ui.attr("url", relation.shortId());
                    ui.find(".cass-relation-source").attr("url", source);
                    ui.find(".cass-relation-target").attr("url", target);
                    ui.find(".cass-relation-type").text(relation.relationType);
                    if ($("[url='" + frameworkId + "']").find("[url='" + competencyId + "']").find("[url='" + relation.shortId() + "']").length > 0)
                        ui.find(".cass-relation-actions").html("<a class='button tiny disabled'>Exists</a>");
                    else
                        ui.find(".cass-relation-actions").html("<a class='button tiny' onclick='insertExistingRelationIntoFramework(this);setTimeout(function(){insertExistingRelation();},1000);'>Insert</a>");
                    populateCompetency(source);
                    populateCompetency(target);
                }, error);
            }
            $("#insertExistingRelation").foundation('open');
        }, error
    );
}

$("body").on("click", ".cass-relation-target,.cass-relation-source,.assertionCompetency", null, function (e) {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        return;
    }
    var competencyId = $(this).attr("url");
    e.stopPropagation();
    if ($(".cass-competency[url=\"" + competencyId + "\"]>.accordion-content").attr("aria-hidden") != "false") {
        $(".cass-framework[url='"+frameworkId+"']").find(".cass-framework-competencies").children(".accordion").foundation('down', $(".cass-competency[url='" + competencyId + "'],.cass-competency[actual='" + competencyId + "']>.accordion-content"));
        (function (url) {
            setTimeout(function () {
                timeout(function () {
                    if ($(".cass-competency[url=\"" + url + "\"],.cass-competency[actual=\"" + url + "\"]").length > 0)
                    $('html, body').animate({
                        scrollTop: $(".cass-competency[url=\"" + url + "\"],.cass-competency[actual=\"" + url + "\"]").offset().top
                    }, 500);
                });
            }, 500);
        })($(this).attr("url"));
    }
});

function insertNewRelation() {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    EcFramework.get(frameworkId, function (framework) {
        if (framework.competency == null) {
            error("No competencies found.");
            return;
        }
        $("#newRelationSource").html("");
        $("#newRelationTarget").html("");
        for (var i = 0; i < framework.competency.length; i++) {
            EcCompetency.get(framework.competency[i], function (competency) {
                var ui = $("#newRelationSource").append("<option/>").children().last();
                ui.text(competency.getName());
                ui.attr("value", competency.shortId());
                ui = $("#newRelationTarget").append("<option/>").children().last();
                ui.text(competency.getName());
                ui.attr("value", competency.shortId());
            }, error);
        }
        $("#newRelation").foundation('open');
        $("#newRelationSource").select();
    }, error);
}

function newRelation(close) {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    var f = new EcAlignment();
    f.source = $("#newRelationSource option:selected").attr("value");
    if (f.source == null) {
        error("Source not selected.");
        return;
    }
    f.target = $("#newRelationTarget option:selected").attr("value");
    if (f.target == null) {
        error("Target not selected.");
        return;
    }
    f.relationType = $("#newRelationType option:selected").attr("value");
    f.name = $("#newRelationName").val();
    f.description = $("#newRelationDescription").val();
    f.generateId(repo.selectedServer);
    if (identity != null)
        f.addOwner(identity.ppk.toPk());
    else
    {
        alert("Login required to create relation.");
        return;
    }
    EcRepository.save(f, function () {
        insertRelationIntoFramework(f.shortId(), frameworkId);
        if (close == null || close == true)
            $("#newRelation").foundation('close');    
    }, error);
}

function editRelationButton(me) {
    var relationId = $(me).parents(".cass-competency-relation").attr("url");
    editRelation(relationId);
}

function editRelation(relationId) {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    EcAlignment.get(relationId, function (relation) {
        $("#editRelationId").val(relation.shortId());
        $("#editRelationName").val(relation.getName());
        $("#editRelationDescription").val(relation.getDescription());
        EcFramework.get(frameworkId, function (framework) {
            $("#editRelationSource").html("");
            $("#editRelationTarget").html("");
            for (var i = 0; i < framework.competency.length; i++) {
                EcCompetency.get(framework.competency[i], function (competency) {
                    var ui = $("#editRelationSource").append("<option/>").children().last();
                    ui.text(competency.getName());
                    ui.attr("value", competency.shortId());
                    if (EcRemoteLinkedData.trimVersionFromUrl(relation.source) == competency.shortId())
                        ui.attr("selected", true);
                    ui = $("#editRelationTarget").append("<option/>").children().last();
                    ui.text(competency.getName());
                    ui.attr("value", competency.shortId());
                    if (EcRemoteLinkedData.trimVersionFromUrl(relation.target) == competency.shortId())
                        ui.attr("selected", true);
                }, error);
            }
        }, error);
        $("#editRelation").foundation('open');
    }, error);
}

function editRelationSave() {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    EcAlignment.get($("#editRelationId").val(), function (relation) {
        relation.source = $("#editRelationSource option:selected").attr("value");
        relation.target = $("#editRelationTarget option:selected").attr("value");
        relation.relationType = $("#editRelationType option:selected").attr("value");
        relation.name = $("#editRelationName").val();
        relation.description = $("#editRelationDescription").val();
        EcRepository.save(relation, function () {
            EcFramework.get(frameworkId, function (fw) {
                populateFrameworkRelation(fw, relation.shortId());
                $("#editRelation").foundation('close');
            });
        }, error);
    }, error);
}

function editRelationDelete() {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    if (confirm("This will delete the selected relation. Continue?") == true)
        EcAlignment.get($("#editRelationId").val(), function (relation) {
            EcRepository._delete(relation, function (response) {
                removeRelationFromFramework(relation.shortId(), frameworkId);
                $("#editRelation").foundation('close');
            }, error);
        });
}
