var currentField = undefined;

$( ".dataMenu" ).on( "click", ".label:contains('encrypt')",function(){
    var isObject = false;
    var field = $(this).parent();
    encryptField(field,serializeField(field));
});

$( ".dataMenu" ).on( "click", ".label:contains('sign')",function(){
    var isObject = false;
    var field = $(this).parent();
    signField(field,JSON.parse(serializeField(field)));
});

$( ".dataMenu" ).on( "click", ".label:contains('decrypt')",function(){
    var field = $(this).parent();
    if (field.find("[field='@type']").children("p").text() == EbacEncryptedValue.type)
        decryptField(field);
});

$( ".dataMenu" ).on( "click", ".label:contains('verify')",function(){
    var field = $(this).parent();
    if (field.find("[field='@signature']").children("p").text() != undefined)
        if (field.find("[field='@owner']").children("p").text() != undefined)
            alert(verifyField(field));
});

$( ".dataMenu" ).on( "click", ".label:contains('+')",function(){
    currentField = $(this).parent();
    $(".objectProperties").show();
    if (currentField.children("ul").length > 0)
        $(".objectProperties").hide();
    $('#addFieldModal').foundation('reveal', 'open');
});

$( ".dataMenu" ).on( "click", ".label:contains('X')",function(){
    $(this).parent().remove();
});

$( ".dataMenu" ).on( "click", ".label:contains('copy')",function(){
    $(".newData").first().children("div").find("[field='@id']").each(
        function(i,e){
            var url = $(e).children("p").text();
            var split = url.split("\/");
            if (split[split.length-4] == "data") 
                split[split.length-2] = guid();
            $(e).children("p").text(split.join("/"));
        }
    )
});

$( ".dataMenu" ).on( "click", ".label:contains('change')",function(){
    $(".newData").first().children("div").children("div").children("[field='@context']").each(
        function(i,e){
            var newSchema = prompt("Please enter the new context.",$(e).children("p").text());
            $(e).children("p").text(newSchema);
        }
    )
    $(".newData").first().children("div").children("div").children("[field='@type']").each(
        function(i,e){
            var newType = prompt("Please enter the new type.",$(e).children("p").text());
            $(e).children("p").text(newType);
            
            var url = $(e).parent().children("[field='@id']").children("p").text();
            var split = url.split("\/");
            if (split[split.length-4] == "data") 
                split[split.length-3] = newType;
            $(e).parent().children("[field='@id']").children("p").text(split.join("/"));
        }
    )
});

$( ".dataMenu" ).on( "click", ".label:contains('Save')",function(){
    Manager.repositoryController.upload(serializeField($(".newData").first().children("div")));
    $(".newData").first().children("div").effect("highlight", {}, 1500);
});

$( ".dataMenu" ).on( "mousemove", ".label:contains('Save')",function(){
    $(".newData").first().children("div").find("[field='@id']").each(
        function(i,e){
            var url = $(e).children("p").text();
            var split = url.split("\/");
            if (split[split.length-4] == "data") 
                split[split.length-1] = new Date().getTime();
            $(e).children("p").text(split.join("/"));
        }
    )
});

$( "#addFieldModal" ).on( "click", "#addFieldModalText",function(){   
    addField(currentField,$("#addFieldModalName").val(),"value");
    $('#addFieldModal').foundation('reveal', 'close');
});

$( "#addFieldModal" ).on( "click", "#addFieldModalArray",function(){ 
    addField(currentField,$("#addFieldModalName").val(),"[]");
    $('#addFieldModal').foundation('reveal', 'close');
});

$( "#addFieldModal" ).on( "click", "#addFieldModalObject",function(){  
    addField(currentField,$("#addFieldModalName").val(),"{}");
    $('#addFieldModal').foundation('reveal', 'close');
});

$( "#addFieldModal" ).on( "click", "#addFieldModalDecal",function(){ 
    var t = new Thing();
    addField(currentField,$("#addFieldModalName").val(),t.toJson());
    $('#addFieldModal').foundation('reveal', 'close');
});

function dataEdit(data)
{    
    $('#datum').remove();
    if ($('#datum').length == 0)
        $(".dataRecepticle").append("<div id='datum'></div>");
    replaceField($('#datum'),data);
    $('#datum').children("div").css("overflow-x","inherit");
    $('.dataMenu').hide();
    $('.newData').show();
}

function serializeField(field,child)
{
    if (field.children("p").length == 1)
        return field.children("p").text();
    else if (field.children("div").length > 0)
    {
        var obj = {};
        var fields = field.children("div").children("[field!='']");
        for (var fieldIndex in fields)
            obj[fields.eq(fieldIndex).attr("field")]=serializeField(fields.eq(fieldIndex),true);
        if (child)
            return obj;
        return JSON.stringify(obj);
    }
    else if (field.children("ul").length > 0)
    {
        var obj = [];
        var fields = field.children("ul").children("li");
        for (var fieldIndex in fields)
        {
            var result = serializeField(fields.eq(fieldIndex),true);
            if (result != null && result !== undefined)
                obj.push(result);
        }
        if (child)
            return obj;
        return JSON.stringify(obj);
    }
}

function encryptField(field,text)
{
    if (Manager.identityController.selectedIdentity == null)
    {
        log("Select a key.","You have no keys available to encrypt with.");
        return;
    }
    
    var fieldx = field.attr("field");
    var id = $("[field='@id']").children("p").text();
    var obj = Manager.cryptoController.encryptField(text,id,fieldx);
    if (obj != null)
    {
        if (field.find("[field='@id']").length > 0)
            obj["@id"]=field.find("[field='@id']").children("p").text();
        replaceField(field,obj);
    }
}

function signField(field,obj)
{
    if (Manager.identityController.selectedIdentity == null)
    {
        log("Select a key.","You have no keys available to encrypt with.");
        return;
    }
    
    var fieldx = field.attr("field");
    var id = obj["@id"];
    log("Signing Data","Signing using " + $("#data .activeKeys").find(".success").text()+"\nThis will allow anyone to verify that the data came from you (or someone with your PPK).");
    
    var copy = JSON.parse(JSON.stringify(obj));
    delete copy["@signature"];
    delete copy["@owner"];
    var encryptedText = skycrypto.signAsymmetric(stringifyJSON(copy));
    
    obj["@signature"]=encryptedText;
    obj["@owner"]=skycrypto.pkText();
    
    replaceField(field,obj);
}

function replaceField(field,obj)
{
    field.children("p").remove();
    field.children("div").remove();
    field.children("ul").remove();
    try{
        obj=JSON.parse(obj);
    }
    catch(ex)
    {
    }
    
    if (isObject(obj))
    {        
        field.append("<div style='margin-left:20px;overflow-x: scroll;'></div>");
        for (var f in obj)
        {
            if (!isFunction(obj[f]))
                addField(field,f,obj[f]);
        }
        var sortList = field.children("div").children("div").get();
        sortList.sort(function (a, b) {
            if ( $(a).attr('field') < $(b).attr('field') )
                return -1;
            if ( $(a).attr('field') > $(b).attr('field') )
                return 1;
            return 0;
        });
        $.each(sortList,
            function(idx,itm)
            {
                itm.remove();
                field.children("div").append(itm);
            }
        );
    }
    else if (isArray(obj))
    {
        field.append("<ul style='margin-left:30px;'></ul>");
        for (var index in obj)
        {
            addField(field,index,obj[index]);
        }
    }
    else
    {
        if (field.children("label").text() == "@owner")
            field.append(createContactSmall(obj));
        else
            field.append("<p style='text-overflow: ellipsis;margin-bottom:0px;overflow:hidden;'>"+obj+"</p>");
    }
    decorate(field,field.children("label").text());
    contextualEnable(field,obj);
    field.effect("highlight", {}, 1500);
}

function addField(field,f,value)
{
    if (field.children("div").length > 0)
    {
        field.children("div").append('<div field="'+f+'"></div>');
        field.children("div").children("[field='"+f+"']").append('<label>'+f+'</label>');
        replaceField(field.children("div").children("[field='"+f+"']"),value);
    }
    else if (field.children("ul").length > 0)
    {
        field.children("ul").append('<li></li>');
        field.children("ul").children("li").last().append('<label>'+(field.children("ul").children("li").length-1)+'</label>');
        replaceField(field.children("ul").children("li").last(),value);
    }
}

function decorate(field,f)
{
    field.children("a").remove();
    //If isNotCryptoFields AND is an object
    if (f.indexOf("@") == -1 && f != "payload" && f != "secret" && field.children("div").length > 0)
    {
        field.prepend(decorationButtonDisabled("verify","Verifies the object using the @signature to ensure it has not been changed by anyone but the @owner.")+decorationButtonDisabled("sign","Signs the object to allow anyone to verify the object has not been changed since you edited it.")+decorationButton("+","Add a new field to the object."));
    }
    //If isNotCryptoFields AND is an array
    if (f.indexOf("@") == -1 && f != "payload" && f != "secret" && field.children("ul").length > 0)
    {
        field.prepend(decorationButton("+","Add a new entry to the list."));
    }
    //If isNotCryptoFields
    if (f.indexOf("@") == -1 && f != "payload" && f != "secret")
    {
        field.prepend(decorationButton("X","Deletes this field.")+decorationButton("encrypt","Encrypts the field so nobody but you and the people you authorize can see the data."));
        field.children("p").attr("contenteditable","true");
    }
    if (f == "@id")
    {
        field.prepend(decorationButton("copy","Changes the ID, causing the next save to write to a new object."));
    }
    if (f == "@type")
    {
        field.prepend(decorationButton("change","Changes the type of the object."));
    }
    if (f == "@owner")
    {
        field.prepend(decorationButtonDisabled("lookup","Looks up any available information on this Public Key."));
    }
}
function decorationButton(name,title)
{
    return '<a style="margin-right:2px;" class="right label" title="'+title+'">'+name+'</a>';   
}
function decorationButtonDisabled(name,title)
{
    return '<a style="margin-right:2px;color:gray;background-color:darkgray;" class="right label" title="'+title+'">'+name+'</a>';   
}
function contextualEnable(field,obj)
{
    field.children(".label:contains('decrypt')").text("encrypt");
    field.children(".label:contains('verify')").hide();
    if (isObject(obj))
    {
        if (
            obj["@schema"] != undefined 
            && obj["@type"] != undefined 
            && obj["@schema"] == Ebac.schema
            && obj["@type"] == EbacEncryptedValue.type
        )
            field.children(".label:contains('encrypt')").text("decrypt");

        if (
            obj["@signature"] != undefined 
            && obj["@type"] != undefined 
        )
            field.children(".label:contains('verify')").show();
    }

}

function decryptField(field)
{
    var id = field.find("[field='@id']").children("p").text();
    var fld = field.attr("field");
    
    var result = Manager.cryptoController.decryptField(serializeField(field));
    if (result != null)
        replaceField(field,result);
    skycrypto.selectedPpk = selectedPpk;
}

function verifyField(field)
{
    var id = $("[field='@id']").children("p").text();
    var pk = field.children("div").children("[field='@owner']").children("p").text();
    var signature = field.children("div").children("[field='@signature']").children("p").text();
    var obj = JSON.parse(serializeField(field));
    delete obj["@signature"];
    delete obj["@owner"];
    log("Verifying","Verifying the message using the public key.");
    var result = skycrypto.verifyAsymmetric(JSON.stringify(obj),signature,pk);
    return result;
}

function cannotSaveErrorInData()
{
    alert("Cannot save data. It is missing a vital component.");
}

function savedData()
{

}

function errorSavingData(p1)
{
    alert(p1);
}