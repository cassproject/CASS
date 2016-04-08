var oneToOneDiv = $("#oneToOne").html();
$("#oneToOne").html("");

var oneToManyDiv = $("#oneToMany").html();
$("#oneToMany").html("");

var manyToManyDiv = $("#manyToMany").html();

function oneToOne()
{
    $(".topLevel").hide().html("");
    $("#oneToOne").html(oneToOneDiv).show();
    populateContacts();
    frameworkSearch();
    oneToOneSearch();
}
function oneToMany()
{
    $(".topLevel").hide().html("");
    $("#oneToMany").html(oneToManyDiv).show();
    populateContacts();
    frameworkSearch();
}
function manyToMany()
{
    $(".topLevel").hide().html("");
    $("#manyToMany").html(manyToManyDiv).show();
    populateContacts();
    frameworkSearch();
}