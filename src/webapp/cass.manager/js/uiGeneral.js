function defaultObject()
{
    var t = new Thing();
    t.generateId(Manager.repo.selectedServer);
    t.name = "New Object";
    return t.toJson();
}

function selectKey(ppk)
{
    $("#data .activeKeys").children("span").removeClass("success").addClass("alert");
    $("#data .activeKeys").find("[title='"+ppk+"']").removeClass("alert").addClass("success");
    $("#fileManager .activeKeys").children("span").removeClass("success").addClass("alert");
    $("#fileManager .activeKeys").find("[title='"+ppk+"']").removeClass("alert").addClass("success");
    Manager.identityController.select(ppk);
}

function clearContacts()
{
    $(".contactsList").html("");
}

//TODO: Prevent XSS exploits.
function createContact(pk)
{
	var ident = Manager.identityController.lookup(pk);
    $(".contactsList").append('<hr>');
    $(".contactsList").append('<a class="button right tiny" style="margin-left:5px">Lookup</a>');
    $(".contactsList").append('<a class="button right tiny" style="margin-left:5px">Forget</a>');
    $(".contactsList").append('<h5>');
    $(".contactsList").append('<img src="'+ident.getImageUrl()+'">');
    $(".contactsList").append('<span class="contactText" title="'+pk+'" contenteditable="true">'+ident.displayName+'</span>');
    $(".contactsList").append('<br>');
    if (ident.source !== undefined)
        $(".contactsList").append('<small>Home: '+ident.source+'</small>');
    $(".contactsList").append('</h5>');
}

function createContactSmall(pk)
{
	var ident = Manager.identityController.lookup(pk);
    return '<div><img src="'+ident.getImageUrl()+'">'
    + '<span class="contactText" title="'+pk+'" contenteditable="true">'+ident.displayName+'</span></div><span style="display:none;">'+pk+'</span>';
}

$('body').on('focus', '.contactText', function() {
    var $this = $(this);
    $this.data('before', $this.html());
    return $this;
}).on('blur paste', '.contactText', function() {
    var $this = $(this);
    if ($this.data('before') !== $this.html()) {
        $this.data('before', $this.html());
        var pk = $(this).attr("title");
        var ident = Manager.identityController.lookup(pk);
        ident.displayName = $this.text();
        Manager.identityController.identityChanged();
    }
    return $this;
});