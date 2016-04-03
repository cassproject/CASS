var permissionsObjectOwner = $(".permissionsObjectOwner").outerHTML();

function permissionsOn(me) {
    var objectUrl = $(me).parents(".cass-framework, .cass-competency, .cass-competency-level, .cass-competency-relation").attr("url");
    permissionsPopulate(objectUrl);
}

function permissionsPopulate(objectUrl)
{
    EcRepository.get(objectUrl, function (object) {
        if (object.type == EbacEncryptedValue.type) {
            $('#permissionsVisibility').attr("checked", "true");
            $(".permissionsViewer").show();
        } else {
            $('#permissionsVisibility').attr("checked", "false");
            $(".permissionsViewer").hide();
        }
        $("#permissionsObjectName").text(object.name);
        $("#permissionsObjectOwners").html("");
        $("#permissionsUrl").text(object.shortId());
        $("#permissionsVisibilitySwitch").hide();
        $("#permissionsAddViewer").hide();
        $("#permissionsAddOwner").hide();
        if (object.owner != undefined)
            for (var i = 0; i < object.owner.length; i++) {
                var ui = $("#permissionsObjectOwners").append(permissionsObjectOwner).children().last();
                var displayName = "Unknown (Click to Edit)";
                var pk = EcPk.fromPem(object.owner[i]);

                if (EcIdentityManager.getContact(pk) != null)
                    displayName = EcIdentityManager.getContact(pk).displayName;
                if (identity != null && pk.equals(identity.ppk.toPk())) {
                    $("#permissionsAddOwner").show();
                    $("#permissionsVisibilitySwitch").show();
                    if (object.type == EbacEncryptedValue.type)
                        $("#permissionsAddViewer").show();
                    displayName = "Me";
                }
                ui.find("#identity").text(displayName).attr("title", pk.toPem());
            }
        $("#permissionsAddOwner").html("<option>Select a contact to add them to owners.</option>");
        for (var i = 0; i < EcIdentityManager.contacts.length; i++) {
            var contact = EcIdentityManager.contacts[i];
            if (object.hasOwner(contact.pk))
                continue;
            var ui = $("#permissionsAddOwner").append("<option/>").children().last().attr("value", contact.pk.toPem()).text(contact.displayName);
        }

        $('#permissions').foundation('open');
    }, error);
}

function permissionsAddOwner(me)
{
    var objectUrl = $("#permissionsUrl").text();
    var pk = EcPk.fromPem($(me).children("option:selected").attr("value"));
    
    EcRepository.get(objectUrl, function (object) {
        object.addOwner(pk);
        EcRepository.save(object,function(success){
            permissionsPopulate(objectUrl);
        },error);
    });
}
                     
function permissionsRemoveOwner(me)
{
    var objectUrl = $("#permissionsUrl").text();
    var pk = EcPk.fromPem($(me).siblings("#identity").attr("title"));
    
    EcRepository.get(objectUrl, function (object) {
        object.removeOwner(pk);
        EcRepository.save(object,function(success){
            permissionsPopulate(objectUrl);
        },error);
    });
}
