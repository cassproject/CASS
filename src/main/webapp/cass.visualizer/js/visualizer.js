/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

var fonts = {
    node: "bold 12px Arial"
};

var error = function (error) {
    console.log(error);
}

var frameworkId = "https://cass.tla.cassproject.org/api/custom/data/schema.cassproject.org.0.2.Framework/012e77e0-3a47-4b24-bb12-370a76ac2adc";
$(document).ready(function () {
    return;
    var me = this;
    me.fetches = 0;
    EcRepository.get(frameworkId, function (framework) {
        if (framework.competency != undefined)
            for (var i = 0; i < framework.competency.length; i++) {
                me.fetches++;
                EcCompetency.get(framework.competency[i], function (competency) {
                    me.fetches--;
                    var treeNode = $("#tree").append("<li><ul><progress style='display:none;'></progress><span class=\"progressText\"></span></ul></li>").children().last();
                    treeNode.attr("id", competency.shortId());
                    treeNode.prepend(competency.name);

                    if (me.fetches == 0) {
                        if (framework.relation != undefined)
                            for (var i = 0; i < framework.relation.length; i++) {
                                me.fetches++;
                                EcAlignment.get(framework.relation[i], function (relation) {
                                    me.fetches--;
                                    if (relation.source !== undefined) {
                                        if (relation.relationType == "narrows") {
                                            $("[id=\"" + relation.target + "\"]").children().append($("[id=\"" + relation.source + "\"]"));
                                        }
                                        if (me.fetches == 0) {
                                            for (var i = 0; i < framework.relation.length; i++) {
                                                me.fetches++;
                                                EcAlignment.get(framework.relation[i], function (relation) {
                                                    me.fetches--;
                                                    if (relation.source !== undefined) {
                                                        if (relation.relationType == "requires") {
                                                            if ($("[id=\"" + relation.target + "\"]").prevAll("[id=\"" + relation.source + "\"]").length > 0)
                                                                $("[id=\"" + relation.target + "\"]").insertBefore($("[id=\"" + relation.source + "\"]"));
                                                        }
                                                    }
                                                    if (me.fetches == 0) {
                                                        alignActivities();
                                                    }
                                                }, error);
                                            }
                                        }
                                    }
                                }, error);
                            }
                    }
                }, error);
            }
    }, error);
});

function dumpEveryone() {
    $("option").each(function (i, element) {
        console.log($(element).attr("value"));
        var id = $(element).attr("value");
        EcRemote.async = false;
        var str = "https://cass.tla.cassproject.org/api/custom/learner/competency?userId=USERID&framework=FRAMEWORKID";
        str = str.replace("USERID", id);
        str = str.replace("FRAMEWORKID", frameworkId);
        userid = id;
        EcRemote.getExpectingObject(str, null, bluelight, error);
    });

    var temp = [];
    for (var id in csv) {
        temp[0] = [];
        var col = 1;
        for (var competency in csv[id]) {
            temp[0][col] = competency;
            var row = 1;
            for (var id2 in csv) {
                if (temp[row] == null || temp[row] === undefined)
                    temp[row] = [];
                temp[row][0] = id;
                temp[row][col] = csv[id2][competency];
                row++;
            }
            col++;
        }
        break;
    }
    resu = Papa.unparse(temp);
    download("results.csv", resu);
}
var resu;

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function alignActivities() {
    EcRemote.getExpectingObject("https://cass.tla.cassproject.org/api/custom", "/nuxeo", activities, error);
}

function activities(a) {
    for (var i = 0; i < a.length; i++) {
        var activity = a[i];
        if (activity.properties === undefined) continue;
        if (activity.properties["activity:activityId"] === undefined) continue;
        if (activity.properties["activity:statementFilterAndInfo"] === undefined) continue;
        for (var j = 0; j < activity.properties["activity:statementFilterAndInfo"].length; j++) {
            var statementFilter = activity.properties["activity:statementFilterAndInfo"][j];
            var competency = statementFilter.competency;
            if (competency.startsWith("http") == false)
                competency = "https://cass.tla.cassproject.org/api/custom/data/" + competency;
            var href;
            if (statementFilter.meaning == "TEACHES")
                href = $("[id=\"" + competency + "\"]").children().last().prepend("<li><a></li>").children().first().children().first();
            else
                href = $("[id=\"" + competency + "\"]").children().last().append("<li><a></li>").children().last().children().last();
            href.attr("href", activity.properties["activity:location"]);
            href.text(activity.properties["dc:title"]);
            if (activity.properties["dc:description"] !== undefined)
                href.append("<br><small></small>").children().last().text(activity.properties["dc:description"]);
        }
    }
    button();
}

function button() {
    $("button").hide();
    $("#loading").show();
    $("#tree").hide();
    $("#total").hide();
    $("#totalText").hide();
    var str = "https://cass.tla.cassproject.org/api/custom/learner/competency?userId=USERID&framework=FRAMEWORKID";
    str = str.replace("USERID", $("option:selected").val());
    str = str.replace("FRAMEWORKID", frameworkId);
    EcRemote.getExpectingObject(str, null, greenlight, error);
}

function greenlight(packets) {
    $("progress").attr("max", 0).attr("value", 0).hide();
    $("total").attr("max", 0).attr("value", 0).hide();
    $("li").show();
    for (var i = 0; i < packets.length; i++) {
        var packet = packets[i];
        var competency = packet[0].url;
        competency = EcRemoteLinkedData.trimVersionFromUrl(competency);
        var competent = packet[1].level == 2;
        var total = $("#total");
        var totalText = $("#totalText");
        var progress = $("[id=\"" + competency + "\"]").parent().children("progress");
        var progressText = $("[id=\"" + competency + "\"]").parent().children(".progressText");
        progress.attr("max", parseInt(progress.attr("max")) + 1);
        total.attr("max", parseInt(total.attr("max")) + 1);
        if (competent) {
            $("[id=\"" + competency + "\"]").hide();
            progress.attr("value", parseInt(progress.attr("value")) + 1).show();
            total.attr("value", parseInt(total.attr("value")) + 1).show();
        }
        progressText.text(" " + progress.attr("value") + " of " + progress.attr("max") + " subsections complete.");
        totalText.text(" " + total.attr("value") + " of " + total.attr("max") + " sections complete.");
    }
    $("button").show();
    $("#loading").hide();
    $("#tree").show();
    $("#total").show();
    $("#totalText").show();
}
var userid = null;
var csv = {};

function bluelight(packets) {
    csv[userid] = {};
    for (var i = 0; i < packets.length; i++) {
        var packet = packets[i];
        var competency = packet[0].url;
        competency = EcRemoteLinkedData.trimVersionFromUrl(competency);
        var competent = packet[1].level == 2;
        if (competent)
            csv[userid][competency] = "1";
        else
            csv[userid][competency] = "0";
    }
}