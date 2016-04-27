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
        var cw = new CreativeWork();
        var ao = new AlignmentObject();
        cw.url = $("#selectedResource").text();
        ao.alignmentType = $("#alignmentTypeSelect option:selected").attr("alignment");
        ao.targetUrl = $("#selectedCompetency").attr("url");
        ao.targetName = $("#selectedCompetency").text();
        ao.targetDescription = $("#selectedCompetency").attr("description");
        ao.educationalFramework = $("#selectedCompetency").attr("framework");
        cw.generateId(repo.selectedServer);
        cw.addOwner(identity.ppk.toPk());
        cw.educationalAlignment = [ao];
        EcRepository.save(cw, function () {
            alert("Alignment saved.");
        }, error);
    }
    
});