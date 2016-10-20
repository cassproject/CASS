/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

var resourcesTemplate = $("#resources").outerHTML();
var resourceTemplate = $("#resource").outerHTML();
var resourceAlignmentTemplate = $(".cass-resource-alignment").outerHTML();
var providerTemplate = $(".cass-provider").outerHTML();

var flrUi = null;

timeout(function () {
    $("#resource-providers").append(providerTemplate);
    var ui = $("#resource-providers").children().last();

    flrUi = ui;

    ui.find(".cass-provider-name").text("Learning Registry");
    ui.find(".cass-provider-url").text("https://search.learningregistry.net/api/search");
    ui.find(".cass-provider-description").text("The learning registry is a new approach to capturing, connecting and sharing data about learning resources available online with the goal of making it easier for educators and students to access the rich content available in our ever-expanding digital universe.");
    ui.find("#resourceSearch").keypress(function (e) {
        if (e.which == 13) {
            searchFlr();
        }
    });
    ui.foundation();
});

function searchFlr() {
    $.ajax({
        url: "https://search.learningregistry.net/api/search",
        crossDomain: true,
        data: {
            api_key: "aab675781244d67ca4aecd47c2c75b9425ee9b0400db94389770b34c5d289bb5",
            q: flrUi.find("#resourceSearch").val(),
            jsonp: "abc123"
        },
        jsonp: "jsonp",
        dataType: "jsonp",
        jsonpCallback: "abc123",
        success: function (results) {

            var hits = results.hits.hits;
            flrUi.find(".cass-provider-resources").html(resourcesTemplate);
            var uis = flrUi.find(".cass-provider-resources").children().first();
            uis.html("");
            for (var i = 0; i < hits.length; i++) {
                var name = hits[i]["_source"].title;
                var description = hits[i]["_source"].description;
                var url = hits[i]["_source"].url;
                uis.append(resourceTemplate);
                var ui = uis.children().last();
                ui.find(".cass-resource-name").text(name);
                ui.find(".cass-resource-description").text(description);
                ui.find(".cass-resource-url").text(url).attr("href", url).unbind().click(function (e) {
                    e.preventDefault();
                    if (confirm("This will navigate to another page. Continue?"))
                        window.open($(this).attr("href"), "_blank");
                });

                var standards = hits[i]["_source"].standards;
                ui.find(".cass-resource-alignments").html("");
                if (standards != null) {
                    for (var j = 0; j < standards.length; j++) {
                        ui.find(".cass-resource-alignments").append(resourceAlignmentTemplate);
                        var sui = ui.find(".cass-resource-alignments").children().last();
                        sui.find("cass-alignment-target").text(standards[j]);
                    }
                }
            }
            uis.foundation();
        },
        error: function (error) {}
    });
}

$("#alignmentTypeSelect").append("<option/>");
$("#alignmentTypeSelect").children().last().text("No Selected Alignment Type");
$("#alignmentTypeSelect").append("<option/>");
$("#alignmentTypeSelect").children().last().attr("value", "LR-LRMI").attr("alignment", "assesses").text("Assesses - Store in LR Sandbox");
$("#alignmentTypeSelect").append("<option/>");
$("#alignmentTypeSelect").children().last().attr("value", "LR-LRMI").attr("alignment", "teaches").text("Teaches - Store in LR Sandbox");
$("#alignmentTypeSelect").append("<option/>");
$("#alignmentTypeSelect").children().last().attr("value", "LR-LRMI").attr("alignment", "requires").text("Requires - Store in LR Sandbox");

$("#main").append("<label title='gpg --export-secret-key -a \"Your Name\"'>LR Signing Key (if storing in the Learning Registry):</label><input type='file' id='pgpkey'/>");

var lrUsername = "";
var lrPassword = "";

resourceCommitHooks.push(lrUpload = function () {

    if ($("#alignmentTypeSelect option:selected").attr("value") == "LR-LRMI") {
        var cw = new CreativeWork();
        var ao = new AlignmentObject();
        cw.url = $("#selectedResource").attr("url");
        cw.name = $("#selectedResource").text();
        ao.alignmentType = $("#alignmentTypeSelect option:selected").attr("alignment");
        ao.targetUrl = $("#selectedCompetency").attr("url");
        ao.targetName = $("#selectedCompetency").text();
        ao.targetDescription = $("#selectedCompetency").attr("description");
        ao.educationalFramework = $("#selectedCompetency").attr("framework");
        cw.educationalAlignment = [ao];

        if (privkey == null) {
            loadKey();
            return;
        }

        var envelope = makeEnvelope(cw);
        signEnvelope(envelope, function (ciphertext) {
            envelope["digital_signature"] = {
                signing_method: "LR-PGP.1.0",
                signature: ciphertext.data,
                key_location: ["http://urlecho.appspot.com/echo?body=" + encodeURIComponent(openpgp.key.readArmored(privkey).keys[0].toPublic().armor())]
            }
            envelope.active = true;
            lrUsername = prompt("Please enter your LR Sandbox Username.", lrUsername);
            if (lrUsername == null) return;
            lrPassword = prompt("Please enter your LR Sandbox Password.", lrPassword);
            if (lrPassword == null) return;
            $.ajax({
                type: "POST",
                url: "https://sandbox.learningregistry.org/publish",
                contentType: "application/json",
                data: JSON.stringify({
                    documents: [envelope]
                }),
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Basic " + btoa(lrUsername + ":" + lrPassword));
                },
                success: function (s) {
                    if (s.document_results[0].error !== undefined)
                        alert(s.document_results[0].OK + ": " + s.document_results[0].error);
                    else
                        window.open("http://sandbox.learningregistry.org/harvest/getrecord?request_ID=" + s.document_results[0].doc_ID + "&by_doc_ID=true", "_blank");
                },
                error: function (s) {
                    alert(JSON.stringify(s));
                },
                failure: function (s) {
                    alert(JSON.stringify(s));
                }
            });
        });
    }

});

makeEnvelope = function (cw) {
    var envelope = {
        "active": "true",
        "doc_type": "resource_data",
        "doc_version": "0.51.0",
        "identity": {
            owner: openpgp.key.readArmored(privkey).keys[0].users[0].userId.userid,
            submitter: "CASS Resource Aligner",
            submitter_type: "agent",
            curator: openpgp.key.readArmored(privkey).keys[0].users[0].userId.userid
        },
        "keys": ["CASS Resource Alignment", "CASS", "lr-test-data"],
        "payload_placement": "inline",
        "payload_schema": ["schema.org", "lrmi", "JSON-LD"],
        "resource_data": JSON.stringify(cw),
        "resource_data_type": "metadata",
        "resource_locator": cw.url,
        "TOS": {
            "submission_TOS": "http://www.learningregistry.org/tos"
        }
    }

    return envelope;
}

var privkey = null;

signEnvelope = function (ev, fun) {
    var options, encrypted;

    var bencoded = bencode(ev);
    var md = forge.md.sha256.create();
    md.update(bencoded);
    var hashed = md.digest().toHex();
    options = {
        data: hashed, // input as String (or Uint8Array)
        publicKeys: [openpgp.key.readArmored(privkey).keys[0].toPublic()],
        privateKeys: openpgp.key.readArmored(privkey).keys // for signing (optional)
    };

    openpgp.sign(options).then(function (ciphertext) {
        fun(ciphertext)
    });
}

function loadKey() {
    if ($("#pgpkey")[0].files.length == 1) {
        var reader = new FileReader();
        reader.onload = function (e) {
            privkey = e.target.result;
            if (openpgp.key.readArmored(privkey).keys.length == 0) {
                alert("Failed to import key.");
                return;
            }
            lrUpload();
            return;
        };
        reader.readAsText($("#pgpkey")[0].files[0]);
    } else {
        var cfm = confirm("You have not selected a LR signing key. Click OK to generate one.\n\nTo export, use 'gpg --export-secret-key -a \"<your name>\"'")
        if (cfm) {
            var name = prompt("Please enter your name.");
            if (name == null) return;
            var email = prompt("Please enter your email.");
            if (email == null) return;
            var options = {
                userIds: [{
                    name: name,
                    email: email
                    }], // multiple user IDs
                numBits: 2048
            };

            openpgp.generateKey(options).then(function (key) {
                privkey = key.privateKeyArmored; // '-----BEGIN PGP PRIVATE KEY BLOCK ... '
                download("lrSigningKey.gpg", privkey);
                $("#pgpkey").prev().text("LR Signing Key has been downloaded.");
                $("#pgpkey").remove();
                lrUpload();
            });
            return;
        }
    }
}
