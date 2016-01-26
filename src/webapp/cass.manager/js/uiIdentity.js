function generateIdentity()
{
    Manager.identityController.generateIdentity();
}

function identityGenerated(identity)
{
    downloadIdentity(identity);
}

function downloadIdentity(identity)
{
    download(identity.displayName+'.pem',identity.ppk.toPem());
}

function refreshIdentities(identities)
{
    $(".activeKeys").html("");
    $("#addKeyIv").val("");
    for (var index in identities)
    {
    	var ppk = identities[index].ppk.toPem().replaceAll("\r?\n","");
        var name = identities[index].displayName;
        $("#key .activeKeys").append("<span title='"+ppk+"' onclick='copyTextToClipboard(\""+ppk+"\");'>"+name+"</span><br>");
        $("#data .activeKeys").append("<span class='label alert' title='"+ppk+"' onclick='selectKey(\""+ppk+"\");'>"+name+"</span><br>");
        $("#fileManager .activeKeys").append("<span class='label alert' title='"+ppk+"' onclick='selectKey(\""+ppk+"\");'>"+name+"</span><br>");
    }
}

function refreshContacts(contacts)
{
    clearContacts();
    for (var index in contacts)
    {
    	var pk = contacts[index].pk.toPem();
    	var name = contacts[index].displayName;
        createContact(pk,name);
    }
}

function saveCredentials()
{
    Manager.loginController.save();
}

function logout()
{
    Manager.loginController.logout();
}

function padGenerationCallback()
{
    
}

function activateKey(ppk)
{
    if (is(ppk,"FileList"))
    {
        for (var i in ppk)
        {
            var file = ppk[i];
            var fr=new FileReader();
            fr.onload=(function(file,fr){
                return function(event){
                    Manager.identityController.addKey(fr.result,file.name);
                }
            })(file,fr);
            if (is(file,"File"))
                fr.readAsText(file); 
        }
    }
    else
    {
        Manager.identityController.addKey(fr.result,file.name);
    }
}