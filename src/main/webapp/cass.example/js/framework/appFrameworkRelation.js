/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

function populateFrameworkRelations(frameworkId,ui) {
    EcRepository.get(frameworkId, function (fw) {
        var relationUi = $("[url='" + frameworkId + "']").find(".cass-competency-relations").html("");
        if (relationUi.length > 0 && fw.relation !== undefined) {
            repo.precache(fw.relation);
            for (var i = 0; i < fw.relation.length; i++) {
                populateFrameworkRelation(fw, fw.relation[i],ui);
            }
        }
    });
}

function populateFrameworkRelation(fw, relationId,fwui) {
	EcRepository.get(relationId, function (relation) {
		var source = EcRemoteLinkedData.trimVersionFromUrl(relation.source);
		var target = EcRemoteLinkedData.trimVersionFromUrl(relation.target);
		var base = null;
		if (base != null)
			base = fwui;
		else
			base = $("[url='" + fw.shortId() + "']");
		base.find("[url='" + relation.shortId() + "']").remove();
		var ui = base.find(".cass-competency[url='" + source + "']");
		if (ui.length == 0)
			ui = base.find(".cass-competency[actual=\"" + source + "\"]");
		ui = ui.find(".cass-competency-relations").append(cassRelationTemplate).children().last();
		ui.attr("url", relation.shortId());
		var src = EcCompetency.getBlocking(source);
		var tgt = EcCompetency.getBlocking(target);
		if (src != null)
			ui.find(".cass-relation-source").attr("url", source).find(".cass-competency-name").text(src.getName());
		else
			ui.find(".cass-relation-source").attr("url", source).find(".cass-competency-name").text(source);
		if (tgt != null)
			ui.find(".cass-relation-target").attr("url", target).find(".cass-competency-name").text(tgt.getName());
		else
			ui.find(".cass-relation-target").attr("url", target).find(".cass-competency-name").text(target);
		ui.find(".cass-relation-type").text(relation.relationType);
		if (identity != null && relation.canEdit(identity.ppk.toPk()))
			ui.find(".canEditRelation").show();
		else
			ui.find(".canEditRelation").hide();
		if (identity != null && fw.canEdit(identity.ppk.toPk()))
			ui.find(".canEditFramework").show();
		else
			ui.find(".canEditFramework").hide();
		var tui = base.find(".cass-competency[url=\"" + target + "\"]");
		if (tui.length == 0)
			tui = base.find(".cass-competency[actual=\"" + target + "\"]");
		tui.find(".cass-competency-relations").append(ui.clone()).children().last();
	}, error);
}

function insertExistingRelationIntoFramework(me) {
    var relationId = $(me).parents(".cass-competency-relation").attr("url");
    var frameworkId = $("#frameworks").find(".is-active").attr("url");

    insertRelationIntoFramework(relationId, frameworkId);
}

function insertRelationIntoFramework(relationId, frameworkId) {
    if (relationId == null) {
        error("Relation not selected.");
        return;
    }
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    EcRepository.get(frameworkId, function (framework) {
        var f = new EcFramework();
        f.copyFrom(framework);
        f.addRelation(relationId);
        EcRepository.save(f, function () {
            EcRepository.get(frameworkId, function (fw) {
                populateFrameworkRelation(fw, relationId);
            });
        }, error);
    }, error);
}


function removeRelationFromFrameworkButton(me) {
    var relationId = $(me).parents(".cass-competency-relation").attr("url");
    var frameworkId = $("#frameworks").find(".is-active").attr("url");

    if (confirm("This will remove '" + $(me).parents(".cass-competency-relation").find(".cass-relation-source").text() + " " + $(me).parents(".cass-competency-relation").find(".cass-relation-type").text() + " " + $(me).parents(".cass-competency-relation").find(".cass-relation-target").text() + "' Continue?") == true)
        removeRelationFromFramework(relationId, frameworkId);
}

function removeRelationFromFramework(relationId, frameworkId) {
    if (relationId == null) {
        error("Relation not selected.");
        return;
    }
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    EcRepository.get(frameworkId, function (framework) {
        var f = new EcFramework();
        f.copyFrom(framework);
        f.removeRelation(relationId);
        EcRepository.save(f, function () {
            $("[url=\"" + frameworkId + "\"]").find("[url=\"" + relationId + "\"]").remove();
        }, error);
    }, error);
}
