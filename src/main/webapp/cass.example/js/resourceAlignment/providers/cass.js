/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

//$("#alignmentTypeSelect").append("<option/>");
//$("#alignmentTypeSelect").children().last().attr("value","CASS-AO").attr("alignment","assesses").text("CASS as an LRMI (schema.org/AlignmentObject) 'assesses' alignment.");
//$("#alignmentTypeSelect").append("<option/>");
//$("#alignmentTypeSelect").children().last().attr("value","CASS-AO").attr("alignment","teaches").text("CASS as an LRMI (schema.org/AlignmentObject) 'teaches' alignment.");
//$("#alignmentTypeSelect").append("<option/>");
//$("#alignmentTypeSelect").children().last().attr("value","CASS-AO").attr("alignment","requires").text("CASS as an LRMI (schema.org/AlignmentObject) 'requires' alignment.");

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