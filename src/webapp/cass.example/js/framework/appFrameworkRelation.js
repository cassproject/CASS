function populateFrameworkRelations(frameworkId) {
    EcRepository.get(frameworkId, function (fw) {
        var relationUi = $("[url='" + frameworkId + "']").find(".cass-competency-relations").html("");
        if (relationUi.length > 0 && fw.relation !== undefined) {
            for (var i = 0; i < fw.relation.length; i++) {
                populateFrameworkRelation(fw, fw.relation[i]);
            }
        }
    });
}

function populateFrameworkRelation(fw, relationId) {
    timeout(function(){
    EcRepository.get(relationId, function (relation) {
        var source = EcRemoteLinkedData.trimVersionFromUrl(relation.source);
        var target = EcRemoteLinkedData.trimVersionFromUrl(relation.target);
        $("[url='" + fw.shortId() + "']").find("[url='" + relation.shortId() + "']").remove();
        var ui = $("[url='" + fw.shortId() + "']").find("[url='" + source + "']");
        ui.find(".cass-competency-relations").append(cassRelationTemplate);
        ui = ui.find(".cass-competency-relations").children().last();
        ui.attr("url", relation.shortId());
        ui.find(".cass-relation-source").attr("url", source);
        ui.find(".cass-relation-target").attr("url", target);
        ui.find(".cass-relation-actions").append("<a class='canEditFramework' onclick='removeRelationFromFrameworkButton(this);' style='display:none;'>X</a>");
        ui.find(".cass-relation-actions").prepend("<a class='canEditRelation' onclick='editRelationButton(this);' style='display:none;'>✎</a>");
        ui.find(".cass-relation-type").text(relation.relationType);
        populateCompetency(source);
        populateCompetency(target);
        if (identity != null && relation.canEdit(identity.ppk.toPk()))
            ui.find(".canEditRelation").show();
        else
            ui.find(".canEditRelation").hide();
        if (identity != null && fw.canEdit(identity.ppk.toPk()))
            ui.find(".canEditFramework").show();
        else
            ui.find(".canEditFramework").hide();
        $("[url='" + fw.shortId() + "']").find("[url='" + target + "']").find(".cass-competency-relations").append(ui.clone());
    }, error);
    });
}

function insertExistingRelationIntoFramework(me) {
    var relationId = $(me).parent(".cass-competency-relation").attr("url");
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
