FrameworkSearchScreen = (function(FrameworkSearchScreen){
	
	var maxLength = 24;
	
	function createContactSmall(pk)
	{
		var ident = AppController.identityController.lookup(pk);
	    return '<span class="ownershipDisplay has-tip" tabindex>'
	    	+ '<span class="qrcodeCanvas"></span>'
	    	+ '<span class="contactText" title="'+pk+'">'+ident.displayName+'</span>'
	    	+ '</span>';
	}
	
	var searchHandle = null;
	
	function runFrameworkSearch(start){
		var query = $("#frameworkSearchText").val();

		if (query == null || query == "")
			query = "*";
		if (searchHandle != null)
			clearTimeout(searchHandle);
		
		var ownership = $("#frameworkSearchOwnership").val();
		if(ownership == 1)
			ownership = "public";
		else if(ownership == 3)
			ownership = "owned";
		else if(ownership == 4)
			ownership = "me"
		else
			ownership = "all";
		
		var callback;
		if(start == undefined)
			callback = clearDisplayResults;
		else
			callback = displayResults;
		
		searchHandle = setTimeout(function() {
			var urlParams = {};
			if(query != "*")
				urlParams.query = query;
			if(ownership != "all")
				urlParams.ownership = ownership;
			
			if(Object.keys(urlParams).length > 0)
				ScreenManager.replaceHistory(ScreenManager.getCurrentScreen(), ScreenManager.SCREEN_CONTAINER_ID, urlParams);
			else
				ScreenManager.replaceHistory(ScreenManager.getCurrentScreen(), ScreenManager.SCREEN_CONTAINER_ID, null);
			
			ViewManager.getView("#frameworkSearchMessageContainer").clearAlert("searchFail");
			ViewManager.getView("#frameworkSearchResults").showProgressMessage();
			ViewManager.getView("#frameworkSearchResults").deselectAll();
			
			var params = {};
			params.ownership = ownership;
			params.size = maxLength;
			params.start = start;
			
			EcFramework.search(AppController.repoInterface, query, callback, errorSearching, params);
		}, 100);
	}
	
	function clearDisplayResults(results)
	{
		ViewManager.getView("#frameworkSearchResults").clear();
		displayResults(results);
	}
	
	function displayResults(results)
	{  
		ViewManager.getView("#frameworkSearchResults").populate(results);
		
		if(results.length == 0)
		{
			ViewManager.getView("#frameworkSearchResults").showNoDataMessage();
		}else if(results.length < maxLength){
//			$("#moreSearchResults").addClass("hide");
			$(window).off("scroll", scrollSearchHandler);
		}else{
//			$("#getMoreResults").click(function(){
//				$("#moreSearchResults").addClass("hide");
//				runRepoSearch(resultDiv.children().size());
//			})
			
			$(window).scroll(scrollSearchHandler)
			
//			$("#moreSearchResults").removeClass("hide");
//			$("#loadingMoreResults").addClass("hide");
			
		}
		
		searchHandle = null;
	}
	
	function scrollSearchHandler(){
		var resultDiv = $("#frameworkResults-data").first(); 
		
		if(resultDiv.size() == 0){
			$(window).off("scroll", scrollSearchHandler);
		}
		else if(($(window).height() + document.body.scrollTop) > ($(document).height() - 30))
		{
			//$("#moreSearchResults").addClass("hide");
			//$("#loadingMoreResults").removeClass("hide");
			runFrameworkSearch(resultDiv.children().size());
		}
	}
	
	function errorSearching(err){
		if(err == undefined)
			err = "Unable to Connect to Server for Competency Search";
		
		ViewManager.getView("frameworkSearchMessageContainer").displayAlert(err, "searchFail");
		
		ViewManager.getView("#frameworkSearchResults").showNoDataMessage();
	}
	
	FrameworkSearchScreen.prototype.display = function(containerId)
	{
		var lastViewed = this.lastViewed;
		
		var query = this.query;
		var ownership = this.ownership;
	
		ViewManager.showView(new MessageContainer("frameworkSearch"), "#frameworkSearchMessageContainer");
		
		ViewManager.showView(new DataViewer("frameworkResults", {
			sort:{},
			clickDataEdit:function(datum){
				ScreenManager.changeScreen(new FrameworkEditScreen(datum));
			},
			buildData:function(id, datum){
				var comps = (datum.competency == undefined ? 0 : datum.competency.length);
				var rels = (datum.relation == undefined ? 0 : datum.relation.length)
				
				var html = "<div class='small-4 columns'><a class='datum-name'>"+datum.name+"</a></div>" +
							"<div class='small-2 columns'>"+ comps + (comps == 1 ? " Competency" : " Competencies") +"</div>" +
							"<div class='small-2 columns'>"+ rels + (rels == 1 ? " Relationship" : " Relationships")+"</div>" +
							"<div class='small-4 columns'>{{dataOwner}}</div>";
				
				if(datum["owner"] != undefined && datum["owner"].length > 0){
					var owner = "";
					for(var i in datum["owner"]){
						owner+= createContactSmall(datum["owner"][i])+ ", "
					}
					owner = owner.substring(0, owner.length-2);
					html = html.replaceAll(/{{dataOwner}}/g, owner);
				}else{
					html = html.replaceAll(/{{dataOwner}}/g, "Public");
				}
				
				var el = $(html)
				
				el.find(".ownershipDisplay").each(function(i, element){
					$(element).children(".qrcodeCanvas").qrcode({
		                width:256,
		                height:256,
		                text:forge.util.decode64($(element).find(".contactText").attr("title"))
		            });  
				})
				
				el.find(".datum-name").click(function(ev){
					ev.preventDefault();
					ScreenManager.changeScreen(new FrameworkViewScreen(datum));
				});
				
				return el;
			}
		}), "#frameworkSearchResults");
		
		$("#frameworkSearchSubmit").click(function(event){
			event.preventDefault();
			runFrameworkSearch();
		});			
		$("#frameworkSearchOwnership").change(function(event){
			event.preventDefault();
			runFrameworkSearch();
		});

		
		$("#frameworkSearchText").keypress(function(e){
			var key = e.which;
			if(key == 13)  // the enter key code
			{
				runFrameworkSearch();
			}
		});
		
		if(query != null)
			$("#frameworkSearchText").val(query)
		
		if(LoginController.getLoggedIn())
		{
			$("#frameworkSearchOwnership").attr("max", 4);
			$("#frameworkSearchOwnershipLoggedIn").removeClass("hide");
			$("#frameworkSearchOwnershipPublic").addClass("hide");
		}
		else
		{
			$("#frameworkSearchOwnershipLoggedIn").addClass("hide");
			$("#frameworkSearchOwnershipPublic").removeClass("hide");
		}
		
		if(ownership != null){
			if(ownership == "public")
				ownership = 1;
			else if(ownership == "owned")
				ownership = 3;
			else if(ownership == "me")
				ownership = 4
			
			$("#frameworkSearchOwnership").val(ownership);
		}
		
		runFrameworkSearch();
			
	};
	
	return FrameworkSearchScreen;
})(FrameworkSearchScreen);