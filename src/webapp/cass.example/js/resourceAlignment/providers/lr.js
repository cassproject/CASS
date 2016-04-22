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
        if(e.which == 13) {
        searchFlr();
        }
    });
                ui.foundation();
});

function searchFlr() {
    $.ajax({
        url:"http://search.learningregistry.net/api/search",
        crossDomain:true,
        data:{
            api_key:"aab675781244d67ca4aecd47c2c75b9425ee9b0400db94389770b34c5d289bb5",
            q:flrUi.find("#resourceSearch").val(),
            jsonp:"abc123"
        },
        jsonp:"jsonp",
        dataType: "jsonp",
        jsonpCallback:"abc123",
        success: function (results) {
        
            var hits = results.hits.hits;
            flrUi.find(".cass-provider-resources").html(resourcesTemplate);
            var uis = flrUi.find(".cass-provider-resources").children().first();
            uis.html("");
            for (var i = 0;i < hits.length;i++)
            {
                var name = hits[i]["_source"].title;
                var description = hits[i]["_source"].description;
                var url = hits[i]["_source"].url;
                uis.append(resourceTemplate);
                var ui = uis.children().last();
                ui.find(".cass-resource-name").text(name);
                ui.find(".cass-resource-description").text(description);
                ui.find(".cass-resource-url").text(url).attr("href",url);
                
                var standards = hits[i]["_source"].standards;
                ui.find(".cass-resource-alignments").html("");
                if (standards != null)
                {
                    for (var j = 0;j < standards.length;j++)
                    {
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
