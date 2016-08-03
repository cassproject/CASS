/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

function insertBulkFromCsv() {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    $("#importCsv").foundation('open');
}

function analyzeCsv() {
    var file = $("#importCsvFile")[0].files[0];
    Papa.parse(file, {
        complete: function (results) {
            var data = results.data;
            if (data.length === undefined || data.length == 0) {
                alert("Invalid CSV.");
                return;
            }
            $("#importCsvColumnName").html("<option>N/A</option>");
            $("#importCsvColumnDescription").html("<option>N/A</option>");
            $("#importCsvColumnScope").html("<option>N/A</option>");
            for (var i = 0; i < data[0].length; i++) {
                $("#importCsvColumnName").append("<option/>").children().last().text(data[0][i]).attr("index", i);
                $("#importCsvColumnDescription").append("<option/>").children().last().text(data[0][i]).attr("index", i);
                $("#importCsvColumnScope").append("<option/>").children().last().text(data[0][i]).attr("index", i);
            }
        }
    });
}

function importCsv() {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    var file = $("#importCsvFile")[0].files[0];
    EcRepository.get(frameworkId, function (framework) {
        if (framework.competency == null)
            framework.competency = [];
        Papa.parse(file, {
            complete: function (results) {
                var data = results.data;
                if (data.length === undefined || data.length == 0) {
                    alert("Invalid CSV.");
                    return;
                }
                var nameIndex = parseInt($("#importCsvColumnName option:selected").attr("index"));
                var descriptionIndex = parseInt($("#importCsvColumnDescription option:selected").attr("index"));
                var scopeIndex = parseInt($("#importCsvColumnScope option:selected").attr("index"));
                for (var i = 1; i < data.length; i++) {
                    (function (i) {
                        timeout(function () {
                            var f = new EcCompetency();
                            if (data[i][nameIndex] === undefined || data[i][nameIndex] == "")
                                return;
                            if (nameIndex !== undefined)
                                f.name = data[i][nameIndex];
                            if (descriptionIndex !== undefined)
                                f.description = data[i][descriptionIndex];
                            if (scopeIndex !== undefined)
                                f.scope = data[i][scopeIndex];
                            f.generateId(repo.selectedServer);
                            if (identity != null)
                                f.addOwner(identity.ppk.toPk());
                            framework.competency.push(f.shortId());
                            EcRepository.save(f, function () {}, error);
                        });
                    })(i);
                }
                timeoutAndBlock(function () {
                    EcRepository.save(framework, function () {
                        populateFramework(frameworkId);
                    }, error);
                });
                $("#importCsv").foundation('close');
            }
        }, error);
    });
}

var csvOutput = [];

function exportCsv() {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    $("#exportCsvStatus").text("Getting Latest Framework Data...")
    $("#exportCsv").foundation('open');
    csvOutput = [];
    EcRepository.get(frameworkId, function (fw) {
        if (fw.competency === undefined || fw.competency.length == 0)
            timeout(function () {
                $("#exportCsv").foundation('close');
            });
        for (var i = 0; i < fw.competency.length; i++) {
            var competencyUrl = fw.competency[i];
            (function (competencyUrl, fw) {
                timeout(function () {
                    EcRepository.get(competencyUrl, function (competency) {
                        csvOutput.push(JSON.parse(competency.toJson()));
                        if (csvOutput.length == fw.competency.length) {
                            var csv = Papa.unparse(csvOutput);
                            var pom = document.createElement('a');
                            pom.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
                            pom.setAttribute('download', fw.name + ".csv");

                            if (document.createEvent) {
                                var event = document.createEvent('MouseEvents');
                                event.initEvent('click', true, true);
                                pom.dispatchEvent(event);
                            } else {
                                pom.click();
                            }
                            $("#exportCsv").foundation('close');
                        } else
                            $("#exportCsvStatus").text("Getting Latest Competency Data: On " + csvOutput.length + " of " + fw.competency.length);
                    }, error);
                }, (i * 50));
            })(competencyUrl, fw);
        }
    });
}

function insertBulkFromMedbiqXml() {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    $("#importMedbiqXml").foundation('open');
}

function analyzeMedbiqXml() {
    var file = $("#importMedbiqXmlFile")[0].files[0];
    $("#importMedbiqXmlCompetencies").text("");
    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var obj = new X2JS().xml_str2json( e.target.result );
            medbiqXmlCompetencies = {};
            medbiqXmlLookForCompetencyObject(obj);
            $("#importMedbiqXmlCompetencies").text("Step 3: " + Object.keys(medbiqXmlCompetencies).length + " competencies detected. Tap Import to finish.");
        };
        reader.readAsText(file);
    }
}

function medbiqXmlLookForCompetencyObject(obj) {
    var key;
    if (isObject(obj) || isArray(obj))
        for (key in obj) {
            if (key == "CompetencyObject")
                medbiqXmlParseCompetencyObject(obj[key]);
            else
                medbiqXmlLookForCompetencyObject(obj[key]);
        }
}

var medbiqXmlCompetencies = {};
var medbiqXmlToSave = [];

function medbiqXmlParseCompetencyObject(obj) {
    if (isArray(obj)) {
        var key;
        for (key in obj) {
            medbiqXmlParseCompetencyObject(obj[key]);
        }
    } else {
        var newCompetency = {};
        if (obj["lom"] !== undefined && obj["lom"]["general"] !== undefined) {
            newCompetency.name = obj["lom"]["general"]["title"]["string"].toString();
            if (obj["lom"]["general"]["description"] !== undefined)
                newCompetency.description = obj["lom"]["general"]["description"]["string"].toString();
            if (obj["lom"]["general"]["identifier"] !== undefined)
                newCompetency.sameAs = obj["lom"]["general"]["identifier"]["entry"].toString();
            if (newCompetency.description === undefined)
                newCompetency.description = "";
            medbiqXmlCompetencies[newCompetency.sameAs] = newCompetency;
        }
    }
}

function importMedbiqXml() {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    EcRepository.get(frameworkId, function (framework) {
        if (framework.competency == null)
            framework.competency = [];
        var i = 0;
        for (var key in medbiqXmlCompetencies) {
            i += 100;
            var f = new EcCompetency();
            var obj = medbiqXmlCompetencies[key];
            if (obj.name === undefined)
                continue;
            f.name = obj.name;
            if (obj.url !== undefined)
                f.sameAs = obj.url;
            if (obj.description !== undefined)
                f.description = obj.description;
            f.generateId(repo.selectedServer);
            if (identity != null)
                f.addOwner(identity.ppk.toPk());
            framework.competency.push(f.shortId());
            medbiqXmlToSave.push(f);
        }
        medbiqXmlStartUpload(framework);
    }, error);
}

function medbiqXmlStartUpload(framework) {
    var frameworkId = $("#frameworks").find(".is-active").attr("url");
    if (frameworkId == null) {
        error("Framework not selected.");
        return;
    }
    if (medbiqXmlToSave.length == 0) {
        EcRepository.save(framework, function () {
            $("#importMedbiqXml").foundation('close');
            populateFramework(frameworkId);
        }, error);
    } else {
        for (var i = 0; i < 10; i++) {
            if (medbiqXmlToSave.length == 0) continue;
            var f = medbiqXmlToSave[0];
            medbiqXmlToSave.splice(0, 1);
            if (i == 9 || medbiqXmlToSave.length == 0)
                EcRepository.save(f, function () {
                    $("#importMedbiqXmlProgress").text("Step 4: " + medbiqXmlToSave.length + " competencies remaining to upload.");
                    medbiqXmlStartUpload(framework);
                }, error);
            else
                EcRepository.save(f, function () {
                    $("#importMedbiqXmlProgress").text("Step 4: " + medbiqXmlToSave.length + " competencies remaining to upload.");
                }, error);
        }
    }
}

function insertBulkFromAsnJson() {
    $("#importAsnJson").foundation('open');
}

var asnJsonSource = null;
var asnJsonFramework = null;
var asnJsonFrameworkUrl = null;
var asnJsonCompetencies = null;

function analyzeAsnJson() {
    var file = $("#importAsnJsonFile")[0].files[0];
    $("#importAsnJsonCompetencies").text("");
    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            asnJsonSource = JSON.parse(e.target.result);
            asnJsonFramework = null;
            asnJsonCompetencies = {};
            asnJsonLookThroughSource();
            if (asnJsonFramework == null) {
                $("#importAsnJsonCompetencies").text("Could not find StandardDocument.");
            } else {
                $("#importAsnJsonCompetencies").text("Step 3: One framework and " + Object.keys(asnJsonCompetencies).length + " competencies detected. Tap Import to finish.");
            }
        };
        reader.readAsText(file);
    }
}

function asnJsonLookThroughSource() {
    for (var key in asnJsonSource) {
        var value = asnJsonSource[key];
        if (isObject(value)) {
            if (value["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"] != null) {
                if (value["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"][0].value == "http://purl.org/ASN/schema/core/StandardDocument") {
                    asnJsonFramework = value;
                    asnJsonFrameworkUrl = key;
                    var children = value["http://purl.org/gem/qualifiers/hasChild"];
                    if (children != null)
                        for (var j = 0; j < children.length; j++) {
                            asnJsonPrime(children[j].value);
                        }
                }
            }
        }
    }
}

function asnJsonPrime(key) {
    var value = asnJsonSource[key];
    if (isObject(value)) {
        if (value["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"] != null) {
            if (value["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"][0].value == "http://purl.org/ASN/schema/core/Statement") {
                asnJsonCompetencies[key] = value;
                var children = value["http://purl.org/gem/qualifiers/hasChild"];
                if (children != null)
                    for (var j = 0; j < children.length; j++) {
                        asnJsonPrime(children[j].value);
                    }
            }
        }
    }
}

function importAsnJson() {
    var f = new EcFramework();
    f.competency = [];
    f.relation = [];
    importAsnJsonCompetencies(f);
    timeoutCheckpoint();
    importAsnJsonRelations(f, asnJsonFramework, null);
    timeoutCheckpoint();
    importAsnJsonFramework(f);
    $("#importAsnJson").foundation('close');
}

function importAsnJsonCompetencies(framework) {
    for (var key in asnJsonCompetencies) {
        (function (key) {
            timeout(function () {
                var f = new EcCompetency();
                var obj = asnJsonCompetencies[key];
                if (obj["http://purl.org/dc/elements/1.1/title"] === undefined)
                    f.name = obj["http://purl.org/dc/terms/description"][0].value;
                else
                    f.name = obj["http://purl.org/dc/elements/1.1/title"][0].value;
                f.sameAs = key;
                if (obj["http://purl.org/dc/terms/description"] !== undefined)
                    f.description = obj["http://purl.org/dc/terms/description"][0].value;
                f.generateId(repo.selectedServer);
                if (identity != null)
                    f.addOwner(identity.ppk.toPk());
                framework.competency.push(f.shortId());
                asnJsonCompetencies[key] = f;
                EcRepository.save(f, function (success) {}, error);
            });
        })(key);
    }
}

function importAsnJsonRelations(framework, node, nodeId) {
    var value = asnJsonSource[key];
    var children = node["http://purl.org/gem/qualifiers/hasChild"];
    if (children != null)
        for (var j = 0; j < children.length; j++) {
            if (nodeId != null) {
                (function (j) {
                    timeout(function () {
                        var f = new EcAlignment();
                        f.target = asnJsonCompetencies[nodeId].shortId();
                        f.source = asnJsonCompetencies[children[j].value].shortId();
                        f.relationType = "narrows";
                        f.name = "";
                        f.description = "";
                        f.generateId(repo.selectedServer);
                        if (identity != null)
                            f.addOwner(identity.ppk.toPk());
                        framework.relation.push(f.shortId());
                        EcRepository.save(f, function () {}, error);
                    });
                })(j);
            }
            importAsnJsonRelations(framework, asnJsonCompetencies[children[j].value], children[j].value);
        }
}

function importAsnJsonFramework(f) {
    timeoutAndBlock(function () {
        f.name = asnJsonFramework["http://purl.org/dc/elements/1.1/title"][0].value;
        f.description = asnJsonFramework["http://purl.org/dc/terms/description"][0].value;
        f.generateId(repo.selectedServer);
        f.sameAs = asnJsonFrameworkUrl;
        if (identity != null)
            f.addOwner(identity.ppk.toPk());
        EcRepository.save(f, function () {
            frameworkSearch();
        }, error);
    });
}
