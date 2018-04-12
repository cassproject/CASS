/*-
 * --BEGIN_LICENSE--
 * Competency and Skills System
 * -----
 * Copyright (C) 2015 - 2018 Eduworks Corporation and other contributing parties.
 * -----
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * --END_LICENSE--
 */

/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

$("#alignmentTypeSelect").append("<option/>");
$("#alignmentTypeSelect").children().last().attr("value","CASS-AO").attr("alignment","assesses").text("Assesses - Store in CASS");
$("#alignmentTypeSelect").append("<option/>");
$("#alignmentTypeSelect").children().last().attr("value","CASS-AO").attr("alignment","teaches").text("Teaches - Store in CASS");
$("#alignmentTypeSelect").append("<option/>");
$("#alignmentTypeSelect").children().last().attr("value","CASS-AO").attr("alignment","requires").text("Requires - Store in CASS");
var resourceTemplate = $("#resource").outerHTML();
var urlUi;

timeout(function () {
    $("#resource-providers").append(providerTemplate);
    var ui = $("#resource-providers").children().last();

    urlUi = ui;

    ui.find(".cass-provider-name").text("URL");
    ui.find(".cass-provider-url").hide();
    ui.find("#resourceSearch").attr("Placeholder","Enter URL here.")
    ui.find(".cass-provider-description").text("Associate any resource on the internet with a competency through this simple tool.");
    ui.find("#resourceSearch").keyup(function (e) {
        
        urlUi.find(".cass-provider-resources").html(resourcesTemplate);
        var uis = urlUi.find(".cass-provider-resources").children().first();
        uis.html(resourceTemplate);
        var ui = uis.children().last();
        ui.find(".cass-resource-name").text(urlUi.find("#resourceSearch").val());
        ui.find(".cass-resource-description").text("Resource at:");
        ui.find(".cass-resource-url").text(urlUi.find("#resourceSearch").val());
        ui.find(".cass-resource-alignments").hide();
        
        uis.foundation();
    });
    ui.foundation();
});

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
        cw.url = $("#selectedResource").attr("url");
        cw.name = $("#selectedResource").text();
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
