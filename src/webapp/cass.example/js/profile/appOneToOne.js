$("#oneToOne").on("click", ".contact", null, function (e) {
    oneToOneSearch();
}, error);

$("#oneToOne").on("click", ".cass-framework", null, function (e) {
    oneToOneSearch();
}, error);

$("#oneToOne").on("click", ".cass-competency", null, function (e) {
}, error);

$("#oneToOne").on("click", ".assertionActionDelete", null, function (e) {
    EcRepository.get($(this).parents("#oneToOneAssertion").attr("url"), function (assertion) {
        EcRepository._delete(assertion, function (success) {
            oneToOneSearch();
        }, error);
    });
}, error);

function oneToOneSearch() {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        $("#oneToOneAssertions").text("Framework not selected.");
        return;
    }
    var contactPk = $("#contactSelector").find(".contact[aria-selected='true'] > #identity").attr("title");
    if (contactPk == null) {
        $("#oneToOneAssertions").text("Contact not selected.");
        return;
    }

    $("#oneToOneAssertions").text("");

    var searchString = "(@type:\"" + EcAssertion.myType + "\")";
    searchString += " AND (\\*@reader:\"" + contactPk.trim().replace(/\r?\n/g, "") + "\" OR \\*@owner:\"" + contactPk.trim().replace(/\r?\n/g, "") + "\")";
    var competencyId = $("#frameworks").find(".cass-competency.is-active").attr("url");
    if (competencyId != null) {
        searchString += " AND (competency:\"" + competencyId + "\")";
    }
    repo.search(searchString, null,
        function (assertions) {
            for (var i = 0; i < assertions.length; i++) {
                displayAssertionSearchItem(assertions[i]);
            }
        }, error
    );
}

var cassAssertionTemplate = $("#oneToOneAssertion").outerHTML();

function displayAssertionSearchItem(assertion) {
    EcRepository.get(assertion.shortId(), function (assertion) {
        var a = new EcAssertion();
        a.copyFrom(assertion);
        $("#oneToOneAssertions").append(cassAssertionTemplate);

        var ui = $("#oneToOneAssertions").children().last();

        ui.attr("url", assertion.shortId());

        if (a.getAssertionDate() != null)
            ui.find(".assertionTimestamp").text(moment(a.getAssertionDate()).fromNow());

        if (a.getAgent() != null)
        if (EcIdentityManager.getPpk(a.getAgent()) != null) {
            ui.find(".assertionAgent").text("You").attr("title", a.getAgent().toPem());
            ui.find(".assertionActionDelete").show();
        } else
            ui.find(".assertionAgent").text(a.getAgentName()).attr("title", a.getAgent().toPem());

        if (a.getSubject() != null)
        if (EcIdentityManager.getPpk(a.getSubject()) != null) {
            ui.find(".assertionSubject").text("You").attr("title", a.getSubject().toPem());
        } else
            ui.find(".assertionSubject").text(a.getSubjectName()).attr("title", a.getSubject().toPem());

        if (a.competency != null)
            (function (ui, a) {
                EcRepository.get(a.competency, function (competency) {
                    ui.find(".assertionCompetency").text(competency.name);
                }, error);
            })(ui, a);

        if (a.level != null && a.level.startsWith("http")) {
            (function (ui, a) {
                EcRepository.get(a.level, function (level) {
                    ui.find(".assertionLevel").text(level.name);
                }, error);
            })(ui, a);
        } else
            ui.find(".assertionOptionLevel").hide();

        if (a.getEvidenceCount() == 0)
            ui.find(".assertionEvidence").text("No evidence");
        else if (a.getEvidenceCount() == 1)
            ui.find(".assertionEvidence").text(a.getEvidenceCount() + " piece of evidence");
        else
            ui.find(".assertionEvidence").text(a.getEvidenceCount() + " pieces of evidence");

    }, error);
}
