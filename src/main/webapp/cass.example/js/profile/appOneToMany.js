/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

$("#oneToMany").on("click", ".contact", null, function (e) {
    populateFramework($("#frameworks").find(".is-active").attr("url"));
    timeout(function () {
        oneToManySearch();
    });
}, error);

$("#oneToMany").on("click", ".cass-framework", null, function (e) {
    timeout(function () {
        oneToManySearch();
    });
}, error);

$("#oneToMany").on("click", ".cass-competency", null, function (e) {
    e.stopPropagation();
}, error);

function oneToManyBaseSearchString() {

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

function oneToManySearch() {
    $("#oneToOneAssertions").text("");
    var acs = {};
    var competencyId = $("#frameworks").find(".cass-competency.is-active").attr("url");
    var searchString = oneToManyBaseSearchString();

    if (competencyId != null) {
        searchString += " AND (competency:\"" + competencyId + "\")";
        acs[competencyId] = [];
        $(".cass-competency[url='"+competencyId+"'").find(".cass-competency-assertions").html("");
        repo.search(searchString, null,
            function (assertions) {
                for (var i = 0; i < assertions.length; i++) {
                    accumulateAssertion(assertions[i], acs);
                }
            }, error
        );
    } else {
        var frameworkId = $("#frameworks").find(".is-active").attr("url");
        if (frameworkId != null) {
            EcRepository.get(frameworkId, function (framework) {
                var searchString = oneToManyBaseSearchString();

                if (framework != null && framework.competency != null) {
                    searchString += " AND (";
                    for (var i = 0; i < framework.competency.length; i++) {
                        if (i != 0)
                            searchString += " OR ";
                        searchString += "(competency:\"" + framework.competency[i] + "\")";
                        acs[framework.competency[i]] = [];
                        $(".cass-competency[url='"+framework.competency[i]+"']").find(".cass-competency-assertions").html("");
                    }
                    searchString += ")";

                    repo.search(searchString, null,
                        function (assertions) {
                            for (var i = 0; i < assertions.length; i++) {
                                accumulateAssertion(assertions[i], acs);
                            }
                        }, error
                    );
                }
            }, error);
        }
    }

}

var acsItemTemplate = {
    evidenceBadgeCount: 0,
    evidenceCertificationCount: 0,
    evidenceCourseCount: 0,
    evidencePersonalStatementCount: 0,
    evidenceOtherCount: 0
};

function accumulateAssertion(assertion, acs) {
    EcRepository.get(assertion.shortId(), function (assertion) {
        var a = new EcAssertion();
        a.copyFrom(assertion);

        timeout(function () {
            var cs = JSON.parse(JSON.stringify(acsItemTemplate));
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
                        updateAssertionTranscript(acs);
                    });
                })(cs, i, a);
            }
            displayAssertionSearchItem($(".cass-competency[url='"+a.competency+"']").find(".cass-competency-assertions").show(),a);
            updateAssertionTranscript(acs);
        });
    });
}

function updateAssertionTranscript(acs) {
    var ary = Object.keys(acs);
    for (var competencyIdIndex = 0;competencyIdIndex < ary.length;competencyIdIndex++) {
        var competencyId = ary[competencyIdIndex];
        if (acs[competencyId].length > 0)
        EcRepository.get(competencyId, function (competency) {
            var ui = $("#frameworks").find(".cass-competency[url='" + competencyId + "']");
            var name = ui.children(".cass-competency-name");

            name.html("").append(competency.name);

            var mostRecentAssertion = 0;
            var leastRecentAssertion = Math.pow(2, 62) - 1;
            var numberOfEvidencePieces = 0;
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
                confidenceTotal += cs.confidence;
                confidences.push(cs.confidence);
                evidenceBadgeCount += cs.evidenceBadgeCount;
                evidenceCertificationCount += cs.evidenceCertificationCount;
                evidenceCourseCount += cs.evidenceCourseCount;
                evidencePersonalStatementCount += cs.evidencePersonalStatementCount;
                evidenceOtherCount += cs.evidenceOtherCount;
                if (cs.active) {
                    numberOfActiveAssertions++;
                    activeConfidenceTotal += cs.confidence;
                    activeConfidences.push(cs.confidence);
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
                name.children().last().text(", Last used: " + moment(mostRecentAssertion).fromNow());
            }
            if (acsFieldTemplate.leastRecentAssertion) {
                name.append("<span/>");
                name.children().last().text(", First used: " + moment(leastRecentAssertion).fromNow());
            }
            if (acsFieldTemplate.numberOfEvidencePieces) {
                name.append("<span/>");
                name.children().last().text(", "+numberOfEvidencePieces + " pieces of evidence.");
            }

        }, error);
    }
}

var acsFieldTemplate = {
    mostRecentAssertion: true,
    leastRecentAssertion: true,
    numberOfEvidencePieces: true,
    numberOfAssertions: false,
    numberOfActiveAssertions: false,
    totalConfidence: false,
    meanConfidence: false,
    medianConfidence: false,
    meanActiveConfidence: false,
    medianActiveConfidence: false,
    evidenceBadgeCount: false,
    evidenceCertificationCount: false,
    evidenceCourseCount: false,
    evidencePersonalStatement: true,
    evidenceOther: true
};
