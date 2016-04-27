$("#alignmentTypeSelect").append("<option/>");
$("#alignmentTypeSelect").children().last().attr("value","CASS-AO").attr("alignment","assesses").text("CASS as an LRMI (schema.org/AlignmentObject) 'assesses' alignment.");
$("#alignmentTypeSelect").append("<option/>");
$("#alignmentTypeSelect").children().last().attr("value","CASS-AO").attr("alignment","teaches").text("CASS as an LRMI (schema.org/AlignmentObject) 'teaches' alignment.");
$("#alignmentTypeSelect").append("<option/>");
$("#alignmentTypeSelect").children().last().attr("value","CASS-AO").attr("alignment","requires").text("CASS as an LRMI (schema.org/AlignmentObject) 'requires' alignment.");

resourceCommitHooks.push(function(){
    
    if ($("#alignmentTypeSelect option:selected").attr("value") == "CASS-AO")
    {
        if (identity == null || identity === undefined)
        {
            error("Please log in to commit alignments.");
            return;
        }
        var ao = new AlignmentObject();
        ao.url = $("#selectedResource").text();
        ao.alignmentType = $("#alignmentTypeSelect option:selected").attr("alignment");
        ao.targetUrl = $("#selectedCompetency").attr("url");
        ao.targetName = $("#selectedCompetency").text();
        ao.targetDescription = $("#selectedCompetency").attr("description");
        ao.educationalFramework = $("#selectedCompetency").attr("framework");
        ao.generateId(repo.selectedServer);
        ao.addOwner(identity.ppk.toPk());
        EcRepository.save(ao, function () {
            alert("Alignment saved.");
        }, error);
    }
    
});