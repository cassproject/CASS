var resourcesTemplate = $("#resources").outerHTML();
var resourceTemplate = $("#resource").outerHTML();
var resourceAlignmentTemplate = $(".cass-resource-alignment").outerHTML();
var providerTemplate = $(".cass-provider").outerHTML();

var flrUi = null;

timeout(function () {
    $("#resource-providers").append(providerTemplate);
    var ui = $("#resource-providers").children().last();

    flrUi = ui;

    ui.find(".cass-provider-name").text("Federal Learning Registry");
    ui.find(".cass-provider-url").text("http://search.learningregistry.net/api/search");
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
        url: "http://search.learningregistry.net/api/search",
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
$("#alignmentTypeSelect").children().last().attr("value", "LR-LRMI").attr("alignment", "assesses").text("LR Sandbox as an LRMI (schema.org/AlignmentObject) 'assesses' alignment.");
$("#alignmentTypeSelect").append("<option/>");
$("#alignmentTypeSelect").children().last().attr("value", "LR-LRMI").attr("alignment", "teaches").text("LR Sandbox as an LRMI (schema.org/AlignmentObject) 'teaches' alignment.");
$("#alignmentTypeSelect").append("<option/>");
$("#alignmentTypeSelect").children().last().attr("value", "LR-LRMI").attr("alignment", "requires").text("LR Sandbox as an LRMI (schema.org/AlignmentObject) 'requires' alignment.");

var lrUsername = "";
var lrPassword = "";

resourceCommitHooks.push(function () {

    if ($("#alignmentTypeSelect option:selected").attr("value") == "LR-LRMI") {
        if (identity == null || identity === undefined) {
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
        cw.educationalAlignment = [ao];

        var envelope = makeEnvelope(cw);
        var signedEnvelope = signEnvelope(envelope);
        lrUsername = prompt("Please enter your LR Sandbox Username.",lrUsername);
        lrPassword = prompt("Please enter your LR Sandbox Password.",lrPassword);
        $.ajax({
            type: "POST",
            url: "http://sandbox.learningregistry.org/publish",
            contentType: "application/json",
            data: JSON.stringify({
                documents: [signedEnvelope]
            }),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Basic " + btoa(lrUsername + ":" + lrPassword));
            },
            success: function (s) {
                if (s.document_results[0].error !== undefined)
                    alert(s.document_results[0].OK + ": " + s.document_results[0].error);
                else
                    window.open("http://sandbox.learningregistry.org/harvest/getrecord?request_ID="+s.document_results[0].doc_ID+"&by_doc_ID=true","_blank");
            },
            error: function (s) {
                alert(JSON.stringify(s));
            },
            failure: function (s) {
                alert(JSON.stringify(s));
            }
        });
    }

});

makeEnvelope = function (cw) {
    var envelope = {
        "active": true,
        "doc_type": "resource_data",
        "doc_version": "0.51.0",
        "identity": {
            owner: identity.ppk.toPk().toPem(),
            submitter: "CASS Resource Aligner",
            submitter_type: "agent",
            curator: "cassproject.org"
        },
        "keys": ["CASS Resource Alignment", "CASS"],
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

signEnvelope = function (ev) {
    var bencoded = bencode(ev);
    var md = forge.md.sha256.create();
    md.update(bencoded);
    var hashed = md.digest().toHex();
    var signature = EcRsaOaep.sign(identity.ppk, hashed);
    var clearsign = "-----BEGIN PGP SIGNED MESSAGE-----\nHash: SHA1\n\n" + hashed + "\n-----BEGIN PGP SIGNATURE-----\nVersion: GnuPG v1.4.10 (GNU/Linux)\n\n" + signature + "\n-----END PGP SIGNATURE-----\n";
    ev["digital_signature"] = {
        signing_method: "LR-PGP.1.0",
        signature: clearsign,
        key_location: ["http://urlecho.appspot.com/echo?body=" + encodeURIComponent(identity.ppk.toPk().toPem())]
    }
    return ev;
}
