/**
 * Screen showing of the capabilities of the Repository for saving and encrypitng data
 * 
 * @module cass.manager
 * @class FileManagerScreen
 * 
 * @uthor devlin.junker@eduworks.com
 */
FileManagerScreen = (function(FileManagerScreen){
	
	/**
	 * Displays an error that occurs during upload
	 * 
	 * @memberOf FileManagerScreen
	 * @method uploadFailed
	 * @private
	 * @param {String} err
	 * 			Error message to display
	 */
	function uploadFailed(err)
	{
		if(err == undefined)
			err = "Unable to Connect to Server for Upload";
		ViewManager.getView("#fileManagerMessageContainer").displayAlert(err, "uploadFail");
	}
	
	/**
	 * Displays an error that occurs during download
	 * 
	 * @memberOf FileManagerScreen
	 * @method searchFailed
	 * @private
	 * @param {String} err
	 * 			Error message to display
	 */
	function downloadFailed(err)
	{
		if(err == undefined)
			err = "Unable to Connect to Server for Download";
		ViewManager.getView("#fileManagerMessageContainer").displayAlert(err, "downloadFail");
	}
	
	/**
	 * Displays an error that occurs during search
	 * 
	 * @memberOf FileManagerScreen
	 * @method searchFailed
	 * @private
	 * @param {String} err
	 * 			Error message to display
	 */
	function searchFailed(err)
	{
		if(err == undefined)
			err = "Unable to Connect to Server to Search";
		ViewManager.getView("#fileManagerMessageContainer").displayAlert(err, "searchFail");
	}
	
	
	var tile = '<div class="tile" tabindex="0" style="display:block"><div class="cube app document"><div class="front"><p class="title"></p></div><div class="back"><p class="status"></p><div class="actions"></div></div></div><a class="hotspot finger" title=""></a></div>';
	
	/**
	 * Displays the dom representing the results of the file search
	 * 
	 * @memberOf FileManagerScreen
	 * @method displayResult
	 * @private
	 * @param {EcRemoteLinkedData[]} obj
	 * 			Results from File Manager search
	 */
	function displayResult(obj)
	{
	    $("#fileManagerResults").html("");
	    for (var index in obj)
	    {
	        $("#fileManagerResults").append(tile);
	        var t = $("#fileManagerResults").children(".tile").last();
	        var name = obj[index]["name"];
	        t.find(".title").text(name);
	        t.attr("id",obj[index].id);
	    }
	    
	    $( "#fileManagerResults" ).on( "click", ".tile",function(){
	    	ViewManager.getView("#fileManagerMessageContainer").clearAlert("downloadFail");
	        
	    	EcFile.get($(this).attr("id"), function(file){
	        	file.download();
	        }, downloadFailed)
	    });
	}
	
	/**
	 * Handles getting search parameters from DOM and starting search
	 * 
	 * @memberOf FileManagerScreen
	 * @method fileSearch
	 * @private
	 */
	function fileSearch(){
		var query = $("#fileManagerSearchText").val();

		ViewManager.getView("#fileManagerMessageContainer").clearAlert("searchFail");
		
		var paramObj;
		if(fileManagerSearchesPublic){
			paramObj = null;
		}else{
			paramObj = {ownership:"owned"};
		}
		
		EcFile.search(AppController.serverController.getRepoInterface(), query, displayResult, searchFailed, paramObj);
	}

	/**
	 * Handles Starting the upload of files from the DOM
	 * 
	 * @memberOf FileManagerScreen
	 * @method startFileUpload
	 * @private
	 */
	function startFileUpload()
	{
	    var tile = '<div class="tile" tabindex="0" style="display:block"><div class="cube app document"><div class="front"><p class="title">Initializing...</p></div><div class="back"><p class="status"></p><div class="actions"></div></div></div><a class="hotspot finger" title=""></a></div>';
	    $("#fileManagerResults").append(tile);
	    if (files.length > 0)
	        if (fileManagerEncrypted)
	            setTimeout(function(){startFileUpload2(true);},100);
	        else
	            setTimeout(function(){startFileUpload2(false);},100);
	}

	/**
	 * Handles changing the DOM to indicate upload began
	 * 
	 * @memberOf FileManagerScreen
	 * @method startFileUpload2
	 * @private
	 * @param {boolean} encrypt
	 * 			Whether or not to encrypt the file uploaded
	 */
	function startFileUpload2(encrypt)
	{
	    var t = $("#fileManagerResults").children(".tile").last();
	    t.find(".title").text("Uploading...");
	    setTimeout(function(){startFileUpload3(encrypt);},100);
	}

	/**
	 * Handles actually creating the file based on DOM input and
	 * saving to the server
	 * 
	 * @memberOf FileManagerScreen
	 * @method startFileUpload3
	 * @private
	 * @param {boolean} encrypt
	 * 			Whether or not to encrypt the file uploaded
	 */
	function startFileUpload3(encrypt)
	{
	    var reader = new FileReader();
	    reader.onload = function(event) {
	        var file = EcFile.create(files[0].name,
	            		event.target.result.split(",")[1],
	            		event.target.result.split(";")[0].split(":")[1]);
	        file.generateId(AppController.serverController.getRepoInterface().selectedServer)
	    	
	        if(encrypt){
	        	EcEncryptedValue.encryptOnSave(file.id, true);
	        	file.addOwner(AppController.identityController.selectedIdentity.ppk.toPk());
	        }
	        	
	        
	        file.save(fileUploaded, uploadFailed);
	        
	    };
	    reader.readAsDataURL(files[0]);    
	}
	
	/**
	 * Handles displaying that the upload was successful
	 * 
	 * @memberOf FileManagerScreen
	 * @method fileUploaded
	 * @private
	 */
	function fileUploaded()
	{
		ViewManager.getView("#fileManagerMessageContainer").clearAlert("uploadFail");
		
	    var t = $("#fileManagerResults").children(".tile").last();
	    t.find(".title").text("Completed.");
	    files.shift();
	    if (files.length != 0)
	        startFileUpload();
	    else
	    	fileSearch();
	}
	
	var fileManagerEncrypted = true;
	var fileManagerSearchesPublic = true;

	var brdr = '2px dotted #0B85A1';
	var obj = $("#dragTarget");

	var files;
	var timeout;
	
	/**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf FileManagerScreen
	 * @method display
	 * @param containerId
	 * 			Screen Container DOM ID
	 */
	FileManagerScreen.prototype.display = function(containerId){
		ViewManager.showView(new MessageContainer("fileSearch"), "#fileManagerMessageContainer");
		
		fileSearch();

		$( "#fileManagerSearchText" ).on( "keyup", function(event){
			fileSearch();
		});
		
		$( "#fileManagerSearchBtn" ).click(fileSearch);
		
		$("#fileManagerEncrypted").change(function(){
		    fileManagerEncrypted = this.checked;
		    fileSearch();
		})
		$("#fileManagerPublic").change(function(){
		    fileManagerSearchesPublic = this.checked;
		    fileSearch();
		})
		
		$("#dragTarget").on('dragenter', function (e)
		{
			e.stopPropagation();
			e.preventDefault();
			brdr = '2px solid #0B85A1';
		});
		$("#dragTarget").on('dragover', function (e) 
		{
			e.stopPropagation();
		    e.preventDefault();
		    brdr = '2px solid #0B85A1';
			$("#dragTarget").css('border', brdr);
		});
		
		$("body").on('dragover', function (e) 
		{
			clearTimeout( timeout );
			timeout = setTimeout( function(){         
				$("#dragTarget").css('border', '');
			}, 200);
			$("#dragTarget").css('border', brdr);
		});
		$("#dragTarget").on('dragleave', function (e) 
		{
			e.stopPropagation();
			e.preventDefault();
			brdr = '2px dotted #0B85A1';
		});
		
		$("#dragTarget").on('drop', function (e) 
		{
			$(this).css('border', '');
			e.preventDefault();
			var fileContainer = e.originalEvent.dataTransfer.files;
			if (fileManagerEncrypted && AppController.identityController.selectedIdentity == null)
			{
				ViewManager.getView("#fileManagerMessageContainer").displayAlert("Cannot Encrypt, User Not Logged In or Identity Not Selected", "noIdentity");
				return;
			}else{
				ViewManager.getView("#fileManagerMessageContainer").clearAlert("noIdentity");
			}
			
			files = [];
			for (var index = 0;index < fileContainer.length;index++)
				files.push(fileContainer[index]);
			$("#fileManagerResults").html("");
			startFileUpload();
		});

	};
	
	return FileManagerScreen;
})(FileManagerScreen);