var resourceCommitHooks = [];

function selectResource(me)
{
    var url = $(me).parents(".cass-resource").find(".cass-resource-url").text();
    $("#selectedResource").text(url);
    $("#resourceSelector").foundation('close');
}
function selectCompetency(me)
{
    var text = $(me).parents(".cass-competency").find(".cass-competency-text").text();
    var url = $(me).parents(".cass-competency").find(".cass-competency-url").text();
    var framework = $("#frameworks").find(".is-active").attr("url");
    var description = $(me).parents(".cass-competency").find(".cass-competency-description").text();
    $("#selectedCompetency")
        .attr("url",url)
        .attr("framework",framework)
        .attr("description",description)
        .text(text);
    $("#competencySelector").foundation('close');
}
function createAlignment(me)
{
    for (var i = 0;i < resourceCommitHooks.length;i++)
    {
        resourceCommitHooks[i]();
    }
}