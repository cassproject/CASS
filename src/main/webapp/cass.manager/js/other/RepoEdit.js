/**
 * Repo Edit View that can be used to display a piece of data from the 
 * repository in an editable DIV container. Allows the developer to designate 
 * where the save button is that (when clicked) will save the piece of data to 
 * it's repository.
 * 
 * @class RepoEdit
 * @author devlin.junker@eduworks.com
 */
var RepoEdit = (function(RepoEdit){
	/**
	 * Builds the display initially by creating the different editable divs
	 * and fills the containerId passed in with the editor.
	 * 
	 * @memberOf RepoEdit
	 * @method buildDisplay
	 * @private
	 * @param {Object} data
	 * @param {String} myContainerId
	 */
	function buildDisplay(data, myContainerId){
		$('#datum').remove();
	    if ($('#datum').length == 0)
	        $(".dataRecepticle").append("<div id='datum'></div>");
	    replaceField($('#datum'),data);
	    $('#datum').children("div").css("overflow-x","inherit");
	    
	    $( "#datum" ).on( "click", ".label:contains('Encrypt')",function(){
	        var isObject = false;
	        var field = $(this).parents("[field]").first();

	        if(field.attr("id") == "datum"){
	        	ModalManager.showModal(new EncryptOptionsModal(function(options){
		        	  encryptField(field, serializeField(field), options.type, options.name);
		        	  ModalManager.hideModal();
		        }));
	        }else{
	        	encryptField(field, serializeField(field));
	        }
	        	        
	    });

	    $( "#datum" ).on( "click", ".label:contains('Add')",function(){
	    	var field = $(this).parent().parent().parent();
	        ModalManager.showModal(new AddOwnerModal(field, myContainerId))
	    });
	    
	    $( "#datum" ).on( "click", ".label:contains('Decrypt')",function(){
	        var field = $(this).parents("[field]").first();
	        if (field.find("[field='@type']").children("p").text() == new EcEncryptedValue().type)
	            decryptField(field);
	    });

	    $( "#datum" ).on( "click", ".label:contains('+')",function(){
	        var field = $(this).parents("[field]").first();
	        
	    	ModalManager.showModal(new AddFieldModal(field, myContainerId))
	    });

	    $( "#datum" ).on( "click", ".label:contains('X')",function(){
	        var data = $(this).parents("[field]").first();
	        
	        if(data.attr("id") == "datum"){
	        	data.remove();
	        }else{
	        	data.remove();
	        }
	    });
	    
	    $( "#datum" ).on( "click", ".label:contains('Copy')",function(){    	
	    	$("#datum").find("[field='@id']").each(
	            function(i,e){
	                var url = $(e).children("p").text();
	                var split = url.split("\/");
	                if (split[split.length-4] == "data") 
	                    split[split.length-2] = guid();
	                $(e).children("p").text(split.join("/"));
	                
	                if(i == $("#datum").find("[field='@id']").size() - 1)
	                {
	                	var obj = JSON.parse(serializeField($("#datum")));
	                	
	                	var data = new EcRemoteLinkedData();
	                	data.copyFrom(obj);
	                	delete data["@owner"];
	                	delete data["@signature"];
	                	ScreenManager.changeScreen(new RepoCreateScreen(data));
	                } 	
	            }
	        );
	    });
	    
	    $( "#datum" ).on( "click", ".label:contains('Change')",function(){
	    	var field = $(this).parent().parent().parent();
	    	ModalManager.showModal(new ChangeTypeModal(field, myContainerId));
	    });

	    $( "#datum" ).on( "click", ".label:contains('Verify')",function(){
	        var field = $(this).parents("[field]").first();
	        if (field.find("[field='@signature']").children("p").text() != undefined){
	        	if (field.find("[field='@owner']").children("p").text() != undefined)
	        		if(verifyField(field))
	        			ModalManager.showModal(new MessageModal("Verified!", "", "tiny"));
	        		else
	        			ViewManager.getView(messageContainerId).displayAlert("Unable to Verify", "verify")
	        }
	    });
	}


	/**
	 * Encrypts the field selected
	 * 
	 * @memberOf RepoEdit
	 * @method encryptField
	 * @private
	 * @param {jQueryObject} field
	 * @param {String} text
	 * @param {boolean} showType
	 * @param {boolean} showName
	 */
	function encryptField(field,text,showType, showName)
	{
	    if (AppController.identityController.selectedIdentity == null)
	    {
	        alert("Select a key.","You have no keys available to encrypt with.");
	        return;
	    }
	    
	    var fieldx = field.attr("field");
	    var id = $("[field='@id']").children("p").text();
	    
	    if(AppController.identityController.selectedIdentity == null)
	    	return;
	    
	    var oldType = undefined;
	    var oldName = undefined;
	    if(showType){
	    	oldType = JSON.parse(text)["@type"];
	    }
	    if(showName){
	    	oldName = JSON.parse(text)["name"];
	    }
	    
	    var obj = EcEncryptedValue.encryptValueOld(text, id, AppController.identityController.selectedIdentity.ppk.toPk());
	    
	    if(oldType != undefined){
	    	obj["encryptedType"] = oldType;
	    }
	    if(oldName != undefined){
	    	obj["name"] = oldName;
	    }
	    
	    if (obj != null)
	    {
	        if (field.find("[field='@id']").length > 0)
	            obj["@id"]=field.find("[field='@id']").children("p").text();
	        replaceField(field,obj);
	    }
	}
	
	/**
	 * @memberOf RepoEdit
	 * @method decryptField
	 * @private
	 * @param field
	 */
	function decryptField(field)
	{
	    var id = field.find("[field='@id']").children("p").text();
	    var fld = field.attr("field");
	    
	    var e = new EcEncryptedValue();
		e.copyFrom(JSON.parse(serializeField(field)));
	    
	    var result = e.decryptIntoObject();
	    if (result != null)
	        replaceField(field,result);
	    else
	    	result = e.decryptIntoString();
	    
	    if(result != null)
	    	replaceField(field, result);
	}

	/**
	 * @memberOf RepoEdit
	 * @method verifyField
	 * @private
	 * @param field
	 */
	function verifyField(field)
	{
	    var obj = JSON.parse(serializeField(field));
	   
	    var data = new EcRemoteLinkedData();
	    data.copyFrom(obj);
	    
	    return data.verify();
	}
	
	/* 
	 * Hacky way to understand how many object's are owned in this object,
	 * including this object. Used to properly display owner IdentityDisplays 
	 * at each level of hierarchy
	 * 
	 * i.e. is this the top level object owner? or are we displaying a encrypted 
	 * fields ownership?
	 * 
	 */
	var ownedNodes;
	
	/**
	 * @memberOf RepoEdit
	 * @method replaceField
	 * @private
	 * @param field
	 * @param data
	 * @param parentField
	 */
	function replaceField(field,data,parentField)
	{
		if(field.attr("id") == "datum")
			ownedNodes = 0;
		ownedNodes++;
		
		field.children("section").remove();
	    field.children("p").remove();
	    field.children("div").remove();
	    field.children("ul").remove();
	    field.children("span").remove();
	    
	    var obj;
	    try{
	    	obj = JSON.parse(data.toJson());
	    }catch(ex){
//	    	try{
//	    		var ecData = new EcRemoteLinkedData();
//	    		ecData.copyFrom(data);
//	    		obj = ecData;
//		    }
//		    catch(ex)
//		    {
		    	try{
		    		obj=JSON.parse(data);
		    	}catch(ex){
		    		obj = undefined;
		    	}
		        
//		    }
	    }
	    if (isObject(obj) || isObject(data))
	    {   
	    	if(obj == undefined)
	    		obj = data;
	    	
	    	if(field.attr("field") == undefined)
				field.attr("field", "dataObject")
	        field.append("<div style='margin-left:20px;'></div>");
	        for (var f in obj)
	        {
	            if (!isFunction(obj[f]) && obj[f] != undefined)
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
	    else if (isArray(data))
	    {
	        field.append("<ul style='margin-left:30px;'></ul>");
	        for (var index in data)
	        {
	            addField(field,parentField,data[index]);
	        }
	    }
	    else
	    {
	        if (field.children("label").text() == "@owner" || field.parent().parent().children("label").text() == "@owner")
	        {
	        	var id = "node-"+ownedNodes+"-owner-" + field.siblings("li").size();
	        	field.append("<span id='"+id+"' style='display:block;'></span>")
	        	
	        	
	        	ViewManager.showView(new IdentityDisplay(data),"#"+id);
	        	
	        	//var contact = $(createContactSmall(data));
	            //field.append(contact);  
	        }
	        else
	            field.append("<p style='text-overflow: ellipsis;margin-bottom:0px;overflow:hidden;'>"+data+"</p>");
	    }
	    decorate(field,field.children("label").text(), data);
	    contextualEnable(field,obj);
	    field.effect("highlight", {}, 1500);
	}

	/**
	 * @memberOf RepoEdit
	 * @method addField
	 * @private
	 * @param field
	 * @param f
	 * @param value
	 */
	function addField(field,f,value)
	{	
		if (field.children("div").length > 0)
	    {
	        field.children("div").append('<div field="'+f+'"></div>');
	        field.children("div").children("[field='"+f+"']").append('<label class="repoEdit-label" style="font-weight:500;text-decoration:underline;">'+f+'</label>');
	        replaceField(field.children("div").children("[field='"+f+"']"), value, f);
	    }
	    else if (field.children("ul").length > 0)
	    {
	    	var idx = field.children("ul").children("li").length;
	        field.children("ul").append('<li field="'+f+'['+idx+']"></li>');
	        //field.children("ul").children("li").last().append('<label>'+(field.children("ul").children("li").length-1)+'</label>');
	        replaceField(field.children("ul").children("li").last(),value,f);
	    }	
	}

	/**
	 * @memberOf RepoEdit
	 * @method decorate
	 * @private
	 * @param field
	 * @param f
	 * @param obj
	 */
	function decorate(field,f,obj)
	{
	    field.children("a").remove();
	    //If isNotCryptoFields AND is an object
	    if (f.indexOf("@") == -1 && f != "payload" && f != "secret" && field.children("div").length > 0)
	    {
	    	var buttonStr = "<section class='clearfix";
	    	if(!(obj instanceof EcRemoteLinkedData))
	    		buttonStr += " float-right";
	    	buttonStr += "'>";
	    		
	    	if(f != "" || (obj.owner != null && obj.owner.length != null && obj.owner.length > 0 
	    					&& AppController.identityController.canEdit(obj)))
	    	{
	    		buttonStr += decorationButton("X","Deletes this field.");
	    	}
	    	
	    	if(obj != undefined && obj["signature"] != undefined)
	    	{
	    		buttonStr += decorationButton("Verify","Verifies the object using the @signature to ensure it has not been changed by anyone but the @owner.")
	    	}
    		
	    	
	    	if(obj != undefined && obj["owner"] == undefined)
	    	{
	    		buttonStr += decorationButton("+","Add a new field to the object."); 
	    	}else if(AppController.identityController.owns(obj)){
	    		buttonStr+=decorationButton("+","Add a new field to the object.");
	    		if(obj.isAny(new EcEncryptedValue().getTypes())){
	    			buttonStr+=decorationButton("Decrypt","Decrypts the field so that it is no longer private.");
	    		}else{
	    			buttonStr+=decorationButton("Encrypt","Encrypts the field so nobody but you and the people you authorize can see the data.");
	    		}
	    		
	    	}
	    		
	    	buttonStr += "</section>";
	    	
	        field.prepend(buttonStr);
	       
	        field.children("p").attr("contenteditable","true");
	    }
	    //If isNotCryptoFields AND is an array
	    if (f.indexOf("@") == -1 && f != "payload" && f != "secret" && field.children("ul").length > 0)
	    {
	        field.prepend(decorationButton("+","Add a new entry to the list."));
	    }
	    //If isNotCryptoFields
	    if (f.indexOf("@") == -1 && f != "payload" && f != "secret" && field.children("div").length == 0)
	    {
	    	var buttonStr = decorationButton("X","Deletes this field.");
	        field.prepend(buttonStr);
	        field.children("p").attr("contenteditable","true");
	    }
	    if (f == "@id")
	    {
	        field.prepend(decorationButton("Copy","Changes the ID, causing the next save to write to a new object."));
	    }
	    if (f == "@type")
	    {
	        field.prepend(decorationButton("Change","Changes the type of the object."));
	    }
	    if (f == "@owner" && (obj != null && obj.length != null && obj.length > 0) )
	    {
	    	var owns = false;
	    	for(var j = 0; j < EcIdentityManager.ids.length; j++)
			{
	    		for (var i = 0; i < obj.length; i++)
					if (EcIdentityManager.ids[j].ppk.toPk().toPem() == obj[i])
						owns = true;
			}
	    	
	    	
	    	if(owns)
	    		field.prepend(decorationButton("Add","Adds an owner by public key."));
	    }
	}
	
	/**
	 * @memberOf RepoEdit
	 * @method decorationButton
	 * @private
	 * @param name
	 * @param title
	 */
	function decorationButton(name,title)
	{
	    return '<a style="margin-right:2px;" class="float-right label fieldBtn" title="'+title+'">'+name+'</a>';   
	}
	/**
	 * @memberOf RepoEdit
	 * @method decorationButtonDisabled
	 * @private
	 * @param name
	 * @param title
	 */
	function decorationButtonDisabled(name,title)
	{
	    return '<a style="margin-right:2px;color:gray;background-color:darkgray;" class="float-right label fieldBtn" title="'+title+'">'+name+'</a>';   
	}
	
	/**
	 * @memberOf RepoEdit
	 * @method contextualEnable
	 * @private
	 * @param field
	 * @param obj
	 */
	function contextualEnable(field,obj)
	{
	    field.children(".label:contains('decrypt')").text("encrypt");
	    field.children(".label:contains('verify')").hide();
	    if (isObject(obj))
	    {
	        if (
	            obj["@context"] != undefined 
	            && obj["@type"] != undefined 
	            && obj["@context"] == Ebac.context
	            && obj["@type"] == EbacEncryptedValue.type
	        )
	            field.children().first().children(".label:contains('encrypt')").text("decrypt");

	        if (
	            obj["@signature"] != undefined 
	            && obj["@type"] != undefined 
	        )
	            field.children().first().children(".label:contains('verify')").show();
	    }

	}
	
	/**
	 * @memberOf RepoEdit
	 * @method serializeField
	 * @private
	 * @param field
	 * @param child
	 */
	function serializeField(field,child)
	{
		if (field.children(".ownershipDisplay").size() == 1)
	    	return field.children(".ownershipDisplay").attr("pk");
		if (field.children("span").children(".identityDisplay").size() == 1)
			return field.find(".identityDisplay").attr("data-pk");
		else if(field.children("span").length == 1)
			return field.find("input[type='checkbox']").prop("checked");
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
	
	/**
	 * @memberOf RepoEdit
	 * @method saveSuccess
	 * @private
	 */
	function saveSuccess(){
		$("#datum").effect("highlight", {}, 1500);
	}
	

	var messageContainerId;
	/**
	 * @memberOf RepoEdit
	 * @method saveFailure
	 * @private
	 * @param {String} err
	 * 			Error message to display on failed save
	 */
	function saveFailure(err)
	{
		if(err == undefined)
			err = "Unable to Connect to Server to Save";
	    ViewManager.getView(messageContainerId).displayAlert(err);
	}
	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf RepoEdit
	 * @method display
	 * @param {String} containerId
	 * 			DOM ID of the element that holds this message container
	 */
	RepoEdit.prototype.display = function(containerId){
		
		var data = this.data;
		this.containerId = containerId;
		messageContainerId = this.messageContainerId;
		
		ViewManager.showView(new MessageContainer("repoEdit"), this.messageContainerId);
		
		$(this.saveButtonId).click(function(){
			var serialized = serializeField($("#datum"));
			if(serialized != undefined){
				var d = new EcRemoteLinkedData(null, null);
				d.copyFrom(JSON.parse(serialized));
				EcRepository.save(d, saveSuccess, saveFailure)
			}else if(data != undefined){
				EcRepository._delete(data, saveSuccess, saveFailure);
			}
		});
		
		$(this.saveButtonId).on("mousemove", function(){
			$("#datum").first().children("div").find("[field='@id']").each(function(i,e){
				var url = $(e).children("p").text();
				var split = url.split("\/");
				if (split[split.length-4] == "data") 
					split[split.length-1] = new Date().getTime();
				$(e).children("p").text(split.join("/"));
			})
		});
		
		buildDisplay(data, containerId);
	}
	
	/**
	 * @memberOf RepoEdit
	 * @method addField
	 * @param field
	 * @param f
	 * @param value
	 */
	RepoEdit.prototype.addField = function(field, f, value){
		addField(field,f,value);
	}
	
	/**
	 * @memberOf RepoEdit
	 * @method changeObject
	 * @param obj
	 */
	RepoEdit.prototype.changeObject = function(obj){
		buildDisplay(obj, this.containerId);
	}
	
	RepoEdit.prototype.changeType = function(field, context, type){
		field.children("div").children("[field='@context']").each(
			function(i, e){
				   $(e).children("p").text(context);
			}
		);
		
		
		field.children("div").children("[field='@type']").each(
            function(i,e){
                $(e).children("p").text(type);
                
                var newType;
                if(type.startsWith(context))
                	newType = type;
                else
                	newType = context+"."+type;
                
                var typeSplit = newType.split(/\/|\./);
                for(var i = typeSplit.length - 1; i>=0; i--) {
                	if(typeSplit[i] == "" || typeSplit[i] == "http:" || typeSplit[i] == "https:" || typeSplit[i] == "www")
                		typeSplit.splice(i, 1);
                }

                
                var url = $(e).parent().children("[field='@id']").children("p").text();
                var split = url.split("\/");
                if (split[split.length-4] == "data") 
                    split[split.length-3] = typeSplit.join(".");
                $(e).parent().children("[field='@id']").children("p").text(split.join("/"));
            }
        );
	}
	
	RepoEdit.prototype.addOwner = function(field, owner){
		addField(field.children("div").children("[field='@owner']"), "@owner", owner);
	}
	
	return RepoEdit;
})(RepoEdit);