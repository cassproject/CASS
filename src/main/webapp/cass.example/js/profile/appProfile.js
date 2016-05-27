/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

$("#profile").on("click", ".contact", null, function (e) {
    timeout(function () {
        profileSearch();
    });
}, error);

$("#profile").on("click", ".cass-framework", null, function (e) {
    timeout(function () {
        profileSearch();
    });
}, error);

$("#profile").on("click", ".cass-competency", null, function (e) {
    e.stopPropagation();
}, error);

$("#profile").on("click", ".assertionActionDelete", null, function (e) {
    if (confirm("This will delete the selected assertion. Continue?") == true)
        EcRepository.get($(this).parents("#oneToOneAssertion").attr("url"), function (assertion) {
            EcRepository._delete(assertion, function (success) {
                profileSearch();
            }, error);
        });
}, error);

function profileBaseSearchString() {

    var contactPk = $("#contactSelector").find(".contact[aria-selected='true'] > #identity").attr("title");
    if (contactPk == null && identity != null)
        contactPk = identity.ppk.toPk().toPem();

    var searchString = "(@type:\"" + EcAssertion.myType + "\")";
    if (contactPk != null) {
        searchString += " AND (\\*@reader:\"" +
            contactPk.trim().replace(/\r?\n/g, "") +
            "\")";
        var selectedContact = EcIdentityManager.getContact(EcPk.fromPem(contactPk));
        if (selectedContact != null)
            $("#selectedContact").text(selectedContact.displayName);
    } else {
        $("#selectedContact").text("Nobody")
    }
    return searchString;
}

var acs = {};

function profileSearch() {
    $("#oneToOneAssertions").text("");
    acs = {};
    var searchString = profileBaseSearchString(); {
        repo.search(searchString, null,
            function (assertions) {
                $("#profileContainer").html("No assertions found about this person.<br><br>In order to see information here, you may: <ul><li>Use a CASS enabled learning resource that reports competence data.</li><li>Connect with other individuals by inviting them to use CASS and making assertions about each other.</li></ul>");
                for (var i = 0; i < assertions.length; i++) {
                    if (i == 0) {
                        $("#profileContainer").html(competencyTemplate);
                        $("#profileContainer").find("#competency").html("");
                    }
                    profileAccumulateAssertion(assertions[i], acs);
                }
                $("#profileContainer").find("#competency").foundation();
            }, error
        );
    }

}

var acsItemTemplate = {
    evidenceBadgeCount: 0,
    evidenceCertificationCount: 0,
    evidenceCourseCount: 0,
    evidencePersonalStatementCount: 0,
    evidenceOtherCount: 0
};

function profileAccumulateAssertion(assertion, acs) {
    var a = new EcAssertion();
    a.copyFrom(assertion);

    var cs = JSON.parse(JSON.stringify(acsItemTemplate));
    if (acs[a.competency] == null)
        acs[a.competency] = [];
    acs[a.competency].push(cs);
    var assertionDate = a.getAssertionDate();
    var expirationDate = a.getExpirationDate();

    try {
        var now = moment().valueOf();
        var spn = expirationDate - assertionDate;
        var elp = now - assertionDate;
        var opc = 1.0 - (elp / spn);
        cs.opc = opc;
        if (opc > 0 && opc < 1)
            cs.active = true;
        else
            cs.active = false;
    } catch (e) {}

    cs.evidenceCount = a.getEvidenceCount();
    cs.confidence = a.confidence;
    cs.assertionDate = assertionDate;
    cs.expirationDate = expirationDate;
    cs.evidenceCount = a.getEvidenceCount();
    for (var i = 0; i < a.getEvidenceCount(); i++) {
        (function (cs, i, a) {
            timeout(function () {

                var evidence = a.getEvidence(i);
                if (evidence.startsWith("http"))
                    cs.evidenceOther++;
                else
                    cs.evidencePersonalStatement++;
                profileUpdateAssertionTranscript(acs);
            });
        })(cs, i, a);
    }
    if ($("#profileContainer").find(".cass-competency[url='" + a.competency + "']").length == 0) {
        var fwui = $("#profileContainer").find("#competency");
        fwui.append(cassCompetencyTemplate);
        var ui = fwui.children().last();
        ui.attr("url", a.competency);
        ui.find(".cass-competency-relations").html("");
        populateCompetency(a.competency);
    }

    displayAssertionSearchItem($("#profileContainer").find(".cass-competency[url='" + a.competency + "']").find(".cass-competency-assertions").show(), a);
    profileUpdateAssertionTranscript(acs);
}

function profileUpdateAssertionTranscript(acs) {
    var ary = Object.keys(acs);
    for (var competencyIdIndex = 0; competencyIdIndex < ary.length; competencyIdIndex++) {
        var competencyId = ary[competencyIdIndex];
        if (acs[competencyId].length > 0)
            EcRepository.get(competencyId, function (competency) {
                var ui = $("#profileContainer").find(".cass-competency[url='" + competencyId + "']");
                var name = ui.children(".cass-competency-name");

                name.html("").append(competency.name);

                var mostRecentAssertion = 0;
                var leastRecentAssertion = Math.pow(2, 62) - 1;
                var numberOfEvidencePieces = 0;
                var numberOfActiveEvidencePieces = 0;
                var numberOfAssertions = 0;
                var confidenceTotal = 0.0;
                var confidences = [];
                var evidenceBadgeCount = 0;
                var evidenceCertificationCount = 0;
                var evidenceCourseCount = 0;
                var evidencePersonalStatementCount = 0;
                var evidenceOtherCount = 0;

                var numberOfActiveAssertions = 0;
                var activeConfidenceTotal = 0.0;
                var activeConfidences = [];

                for (var i = 0; i < acs[competency.shortId()].length; i++) {
                    var cs = acs[competency.shortId()][i];
                    mostRecentAssertion = Math.max(mostRecentAssertion, cs.assertionDate);
                    leastRecentAssertion = Math.min(leastRecentAssertion, cs.assertionDate);
                    numberOfEvidencePieces += cs.evidenceCount;
                    numberOfAssertions++;
                    confidenceTotal += parseFloat(cs.confidence);
                    confidences.push(parseFloat(cs.confidence));
                    evidenceBadgeCount += cs.evidenceBadgeCount;
                    evidenceCertificationCount += cs.evidenceCertificationCount;
                    evidenceCourseCount += cs.evidenceCourseCount;
                    evidencePersonalStatementCount += cs.evidencePersonalStatementCount;
                    evidenceOtherCount += cs.evidenceOtherCount;
                    if (cs.active) {
                        numberOfActiveAssertions++;
                        numberOfActiveEvidencePieces += cs.evidenceCount;
                        activeConfidenceTotal += parseFloat(cs.confidence);
                        activeConfidences.push(parseFloat(cs.confidence));
                    }
                }

                confidences.sort();
                var medianConfidence = confidences[Math.floor(confidences.length / 2)];
                if (medianConfidence === undefined)
                    medianConfidence = "Unknown";
                activeConfidences.sort();
                var activeMedianConfidence = activeConfidences[Math.floor(confidences.length / 2)];
                if (acsFieldTemplate.mostRecentAssertion) {
                    name.append("<span/>");
                    name.children().last().text(", Last demonstrated: " + moment(mostRecentAssertion).fromNow());
                }
                if (acsFieldTemplate.leastRecentAssertion) {
                    name.append("<span/>");
                    name.children().last().text(", First demonstrated: " + moment(leastRecentAssertion).fromNow());
                }
                if (acsFieldTemplate.meanActiveConfidence) {
                    name.append("<span/>");
                    name.children().last().text(", " + Math.floor((activeConfidenceTotal / activeConfidences.length) * 100) + "% confidence");
                }
                if (acsFieldTemplate.numberOfEvidencePieces) {
                    name.append("<span/>");
                    if (numberOfEvidencePieces == 0);
                    else if (numberOfEvidencePieces == 1)
                        name.children().last().text(", " + numberOfEvidencePieces + " piece of evidence.");
                    else
                        name.children().last().text(", " + numberOfEvidencePieces + " pieces of evidence.");
                }
                if (acsFieldTemplate.numberOfActiveEvidencePieces) {
                    name.append("<span/>");
                    if (numberOfActiveEvidencePieces == 0);
                    else if (numberOfActiveEvidencePieces == 1)
                        name.children().last().text(", " + numberOfEvidencePieces + " piece of current evidence.");
                    else
                        name.children().last().text(", " + numberOfEvidencePieces + " pieces of current evidence.");
                }

            }, error);
    }
}

var acsFieldTemplate = {
    mostRecentAssertion: false,
    leastRecentAssertion: false,
    numberOfEvidencePieces: false,
    numberOfActiveEvidencePieces: true,
    numberOfAssertions: false,
    numberOfActiveAssertions: false,
    totalConfidence: false,
    meanConfidence: false,
    medianConfidence: false,
    meanActiveConfidence: true,
    medianActiveConfidence: false,
    evidenceBadgeCount: false,
    evidenceCertificationCount: false,
    evidenceCourseCount: false,
    evidencePersonalStatement: true,
    evidenceOther: true
};
