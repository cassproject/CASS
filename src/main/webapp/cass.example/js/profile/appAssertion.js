/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

function createNewAssertion() {
    $("#newAssertion").foundation('open');
    $("#newAssertionAgent").html("");
    $("#newAssertionSubject").html("").append("<option>&lt;Contact&gt;</option>");
    $("#newAssertionCompetency").html("").append("<option>&lt;Competency&gt;</option>");
    for (var i = 0; i < EcIdentityManager.ids.length; i++)
        $("#newAssertionAgent").append("<option/>").children().last()
        .text(EcIdentityManager.ids[i].displayName)
        .attr("value", EcIdentityManager.ids[i].ppk.toPk().toPem());

    var contactPk = $("#contactSelector").find(".contact[aria-selected='true'] > #identity").attr("title");
    for (var i = 0; i < EcIdentityManager.contacts.length; i++) {
        $("#newAssertionSubject").append("<option/>").children().last()
            .text(EcIdentityManager.contacts[i].displayName)
            .attr("value", EcIdentityManager.contacts[i].pk.toPem());
        if (EcIdentityManager.contacts[i].pk.toPem().equals(contactPk))
            $("#newAssertionSubject").children().last().prop("selected", true);
    }
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    var competencyId = $("#frameworks").find(".cass-competency.is-active").attr("url");
    var competencyText = $("#frameworks").find(".cass-competency.is-active").find(".cass-competency-name").text();

    if (frameworkId == null) {
        var searchString = new EcCompetency().getSearchStringByType();
        repo.search(searchString, function (competency) {
            $("#newAssertionCompetency").append("<option/>").children().last()
                .text(competency.name)
                .attr("value", competency.shortId());
            if (competency.shortId() == competencyId) {
                $("#newAssertionCompetency").children().last().prop("selected", true);
                createNewAssertionSelectedCompetencyChanged(null);
            }
        }, null, error);
    } else {
        EcRepository.get(frameworkId, function (framework) {
            if (framework.competency != null)
                for (var i = 0; i < framework.competency.length; i++) {
                    EcRepository.get(framework.competency[i], function (competency) {
                        $("#newAssertionCompetency").append("<option/>").children().last()
                            .text(competency.name)
                            .attr("value", competency.shortId());
                        if (competency.shortId() == competencyId) {
                            $("#newAssertionCompetency").children().last().prop("selected", true);
                            createNewAssertionSelectedCompetencyChanged(null);
                        }
                    }, error);
                }
        }, error);
    }
    var currentDate = new Date();
    var timezoneOffset = currentDate.getTimezoneOffset() * 60 * 1000;
    var localDate = new Date(currentDate.getTime() - timezoneOffset);

    $('#newAssertionAssertionDateTime').val(localDate.toISOString().replace('Z', ''));
    localDate.setFullYear(localDate.getFullYear() + 1);
    $('#newAssertionExpirationDateTime').val(localDate.toISOString().replace('Z', ''));
}

$("body").on("change", "#newAssertionCompetency", null, createNewAssertionSelectedCompetencyChanged, error);

function createNewAssertionSelectedCompetencyChanged(e) {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    var competencyId = $("#newAssertionCompetency option:selected").attr("value");
    $("#newAssertionLevel").html("").append("<option value=''>No level available.</option>");
    if (frameworkId == null) {
        var searchString = new EcLevel().getSearchStringByType()+" AND (competency:\"" + competencyId + "\")";
        repo.search(searchString, function (level) {
            $("#newAssertionLevel").append("<option/>").children().last()
                .text(level.name)
                .attr("value", level.shortId());
        }, null, error);
    } else {
        EcRepository.get(frameworkId, function (framework) {
            if (framework.level != null) {
                var first = true;
                for (var i = 0; i < framework.level.length; i++) {
                    EcRepository.get(framework.level[i], function (level) {
                        if (level.competency == competencyId) {
                            if (first)
                                $("#newAssertionLevel").html("").append("<option value=''>No level selected.</option>");
                            first = false;
                            $("#newAssertionLevel").append("<option/>").children().last()
                                .text(level.name + " (" + level.description + ")")
                                .attr("value", level.shortId());
                        }
                    }, error);
                }
            }
        }, error);
    }
}

function newAssertion() {
    var agent = $("#newAssertionAgent option:selected").val();
    if (agent == $("#newAssertionAgent").attr("placeholder")) {
        error("You must log in or select an alias in order to assert a claim.");
        return;
    }
    agent = EcPk.fromPem(agent);
    var subject = $("#newAssertionSubject option:selected").val();
    if (subject == $("#newAssertionSubject").attr("placeholder")) {
        error("You must select a contact to make a claim about.");
        return;
    }
    subject = EcPk.fromPem(subject);
    var competency = $("#newAssertionCompetency option:selected").val();
    if (competency == $("#newAssertionCompetency").attr("placeholder")) {
        error("You must select a competency to claim the subject holds.");
        return;
    }
    var level = $("#newAssertionLevel option:selected").val();
    if (level == $("#newAssertionLevel").attr("placeholder"))
        level = null;
    var confidence = $("#newAssertionAssertionConfidence").val() / 100;
    var evidence = $("#newAssertionEvidence").val().split("\n");
    var eviNew = [];
    for (var i = 0; i < evidence.length; i++)
        if (evidence[i].trim() != "")
            eviNew.push(evidence[i].trim());
    evidence = eviNew;
    var assertionDateMs = moment($("#newAssertionAssertionDateTime").val()).valueOf();
    var expirationDateMs = moment($("#newAssertionExpirationDateTime").val()).valueOf();
    var decayFunctions = {
        linear: "t",
        logarithmic: "log(t)",
        exponential: "t^2"
    };
    if ($("#newAssertionDecayFunction").val() == $("#newAssertionDecayFunction").attr("placeholder")) {
        error("You must select a decay function. If in doubt, select linear.");
        return;
    }
    var decayFunction = decayFunctions[$("#newAssertionDecayFunction").val()];
    var assertion = new EcAssertion();
    assertion.generateId(repo.selectedServer);
    assertion.addOwner(agent);
    assertion.setSubject(subject);
    assertion.setAgent(agent);
    assertion.setCompetency(competency);
    assertion.setLevel(level);
    assertion.setConfidence(confidence);
    assertion.setEvidence(evidence);
    assertion.setAssertionDate(assertionDateMs);
    assertion.setExpirationDate(expirationDateMs);
    assertion.setDecayFunction(decayFunction);
    EcRepository.save(assertion, function (success) {
        $("#newAssertion").foundation('close');
        oneToOneSearch();
    }, error);
}
