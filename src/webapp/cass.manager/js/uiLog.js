function log(short,long)
{
    if ($("#dataLog").children("span").length > 50)
        $("#dataLog").children("span").first().remove();
    var logElement = $("#dataLog").append("<span title='"+long+"'><br>"+short+"</span>");
    var height = logElement.children("span").last().offset().top;
    logElement.stop();
    logElement.animate({
        scrollTop: height
    }, 500);
    console.log(short);
    console.log(long);
}