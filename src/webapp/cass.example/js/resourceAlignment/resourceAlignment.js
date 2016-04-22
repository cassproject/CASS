function selectResource(me)
{
    var url = $(me).parents(".cass-resource").find(".cass-resource-url").text();
    $("#selectedResource").text(url);
    $("#resourceSelector").foundation('close');
}
function selectCompetency(me)
{
    var text = $(me).parents(".cass-resource").find(".cass-resource-text").text();
    var url = $(me).parents(".cass-resource").find(".cass-resource-url").text();
    $("#selectedCompetency").attr("url",url).text(text);
    $("#competencySelector").foundation('close');
}