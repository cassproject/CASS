function insertExistingCompetencyIntoFramework() {
    var competencyId = $("#insertExistingCompetencyResults").find(".is-active").attr("url");
    var frameworkId = $("#frameworks").find(".is-active").attr("url");

    insertCompetencyIntoFramework(competencyId, frameworkId);
}

function insertCompetencyIntoFramework(competencyId, frameworkId) {
    if (competencyId == null) {
        error("Competency not selected.");
        return;
    }
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    EcRepository.get(frameworkId, function (framework) {
        var f = new EcFramework();
        f.copyFrom(framework);
        f.addCompetency(competencyId);
        EcRepository.save(f, function () {
            populateFramework(frameworkId);
        }, error);
    }, error);
}

function removeCompetencyFromFrameworkButton(me) {
    var competencyId = $(me).parents(".cass-competency").attr("url");
    var frameworkId = $("#frameworks").find(".is-active").attr("url");

    removeCompetencyFromFramework(competencyId, frameworkId);
}

function removeCompetencyFromFramework(competencyId, frameworkId) {
    if (competencyId == null) {
        error("Competency not selected.");
        return;
    }
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    EcRepository.get(frameworkId, function (framework) {
        var f = new EcFramework();
        f.copyFrom(framework);
        f.removeCompetency(competencyId, function () {
            EcRepository.save(f, function () {
                populateFramework(frameworkId);
            });
        }, error);
    }, error);
}

function bulkFromFrameworkButton() {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    var searchString = "(@type:\"" + Framework.myType + "\")";
    if ($("#frameworkSearch").val() != "")
        searchString += " AND (" + $("#frameworkSearch").val() + ")";
    repo.search(searchString, null,
        function (frameworks) {
            $("#bulkFromFrameworkSource").html("");
            $("#bulkFromFrameworkSource").append("<option/>");
            for (var i = 0; i < frameworks.length; i++) {
                var fw = frameworks[i];
                $("#bulkFromFrameworkSource").append("<option/>");
                $("#bulkFromFrameworkSource").children().last().attr("value", fw.shortId()).text(fw.name);
            }
            $("#bulkFromFramework").foundation('open');
        }, error
    );
}

var bulkMap = {};
var relationArray = [];

function bulkFromFramework() {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    var importFrameworkFrom = $("#bulkFromFrameworkSource option:selected").attr("value");
    if (importFrameworkFrom == null) {
        error("Framework not chosen.");
        return;
    }
    var copy = $("#bulkFromFrameworkCompetencyDuplicate").is(':checked');

    EcRepository.get(frameworkId, function (frameworkTarget) {
        EcRepository.get(importFrameworkFrom, function (frameworkSource) {
            if (frameworkTarget.competency === undefined)
                frameworkTarget.competency = [];
            if (frameworkSource.competency === undefined)
                frameworkSource.competency = [];
            if (frameworkTarget.relation === undefined)
                frameworkTarget.relation = [];
            if (frameworkSource.relation === undefined)
                frameworkSource.relation = [];
            if (frameworkTarget.level === undefined)
                frameworkTarget.level = [];
            if (frameworkSource.level === undefined)
                frameworkSource.level = [];
            if (copy) {
                bulkMap = {};
                relationArray = [];
                if (frameworkSource.competency.length == 0)
                    $("#bulkFromFramework").foundation('close');
                for (var i = 0; i < frameworkSource.competency.length; i++) {
                    //Copy all competencies and populate mapping in bulkMap.
                    var competencyId = frameworkSource.competency[i];
                    EcRepository.get(competencyId, function (competency) {
                        var oldId = competency.shortId();
                        competency.generateId(repo.selectedServer);
                        competency.owners = [];
                        if (identity != null)
                            competency.addOwner(identity.ppk.toPk());
                        frameworkTarget.competency.push(competency.shortId());
                        EcRepository.save(competency, function () {
                            bulkMap[oldId] = competency.shortId();
                            if (Object.keys(bulkMap).length == frameworkSource.competency.length) {
                                //Phase 2: Copy all relations (updating source/target IDs)
                                if (frameworkSource.relation.length == 0) {
                                    EcRepository.save(frameworkTarget, function () {
                                        populateFramework(frameworkId);
                                        $("#bulkFromFramework").foundation('close');
                                    }, error);
                                } else
                                    for (var i = 0; i < frameworkSource.relation.length; i++) {
                                        var relationId = frameworkSource.relation[i];
                                        EcRepository.get(relationId, function (relation) {
                                            var oldId = relation.shortId();
                                            relation.generateId(repo.selectedServer);
                                            relation.source = bulkMap[relation.source];
                                            relation.target = bulkMap[relation.target];
                                            relation.owners = [];
                                            if (identity != null)
                                                relation.addOwner(identity.ppk.toPk());
                                            if (relation.source === undefined || relation.target === undefined) {
                                                relationArray.push(relation.shortId());
                                                error("Some relations did not copy over. This may be due to missing competencies or versioning errors.");
                                                if (relationArray.length == frameworkSource.relation.length)
                                                    EcRepository.save(frameworkTarget, function () {
                                                        populateFramework(frameworkId);
                                                        $("#bulkFromFramework").foundation('close');
                                                    }, error);
                                            } else
                                                EcRepository.save(relation, function () {
                                                    frameworkTarget.relation.push(relation.shortId());
                                                    relationArray.push(relation.shortId());
                                                    if (relationArray.length == frameworkSource.relation.length)
                                                        EcRepository.save(frameworkTarget, function () {
                                                            populateFramework(frameworkId);
                                                            $("#bulkFromFramework").foundation('close');
                                                        }, error);
                                                }, error);
                                        }, error);
                                    }
                                    //Phase 3: Copy all relations (updating source/target IDs)
                                for (var i = 0; i < frameworkSource.level.length; i++) {
                                    var levelId = frameworkSource.level[i];
                                    EcRepository.get(levelId, function (level) {
                                        var oldId = level.shortId();
                                        level.generateId(repo.selectedServer);
                                        level.competency = bulkMap[level.competency];
                                        level.owners = [];
                                        if (identity != null)
                                            level.addOwner(identity.ppk.toPk());
                                        frameworkTarget.level.push(level.shortId());
                                        EcRepository.save(level, function () {}, error);
                                    }, error);
                                }
                            }
                        }, error);
                    }, error);
                }
            } else {
                frameworkTarget.competency = frameworkTarget.competency.concat(frameworkSource.competency).unique();
                frameworkTarget.relation = frameworkTarget.relation.concat(frameworkSource.relation).unique();
                frameworkTarget.level = frameworkTarget.level.concat(frameworkSource.level).unique();
                EcRepository.save(frameworkTarget, function () {
                    populateFramework(frameworkId);
                    $("#bulkFromFramework").foundation('close');
                }, error);
            }
        }, error);
    }, error);
}
