function anySearchContact(q, highlightCompetency, highlightAssertion, highlightFramework, timesToExpand) {
    repo.search(q, null, function (results) {
        if (results == null) return;
        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            if (new EcFramework().isA(result.type)) {
                highlightFramework(result, timesToExpand);
                if (result.competency != null)
                    if (anyExtendFrameworkToCompetency && timesToExpand > 0)
                        for (var j = 0; j < result.competency.length; j++)
                            anySearchContact(new EcCompetency().getSearchStringByType()+ " AND (\"" + result.competency[j] + "\")", highlightCompetency, highlightAssertion, highlightFramework, timesToExpand - 1);
            }
            var result = results[i];
            if (new EcCompetency().isA(result.type)) {
                highlightCompetency(result, timesToExpand);
                if (anyExtendCompetencyToAssertion && timesToExpand > 0)
                    anySearchContact(new EcAssertion().getSearchStringByType() + " AND (competency:\"" + result.shortId() + "\")", highlightCompetency, highlightAssertion, highlightFramework, timesToExpand - 1);
                if (anyExtendCompetencyToFramework && timesToExpand > 0)
                    anySearchContact(new EcFramework().getSearchStringByType() + " AND (competency:\"" + result.shortId() + "\")", highlightCompetency, highlightAssertion, highlightFramework, timesToExpand - 1);
            }
            var result = results[i];
            if (new EcAssertion().isA(result.type)) {
                if (result.subject == null) continue;
                highlightAssertion(result, timesToExpand);
                if (anyExtendAssertionToCompetency && timesToExpand > 0)
                    anySearchContact(new EcCompetency().getSearchStringByType() + " AND (\"" + result.competency + "\")", highlightCompetency, highlightAssertion, highlightFramework, timesToExpand - 1);
            }
        }
    }, error);
}

var anyExtendCompetencyToFramework = false;
var anyExtendFrameworkToCompetency = false;
var anyExtendCompetencyToAssertion = false;
var anyExtendAssertionToCompetency = false;
