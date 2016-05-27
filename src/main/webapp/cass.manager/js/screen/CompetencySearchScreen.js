CompetencySearchScreen = (function(CompetencySearchScreen){
	
	function createContactSmall(pk)
	{
		var ident = AppController.identityController.lookup(pk);
	    return '<span class="ownershipDisplay has-tip" tabindex>'
	    	+ '<span class="qrcodeCanvas"></span>'
	    	+ '<span class="contactText" title="'+pk+'">'+ident.displayName+'</span>'
	    	+ '</span>';
	}
	
	var searchHandle = null;
	
	function runCompetencySearch(){
		var query = $("#competencySearchText").val();

		if (query == null || query == "")
			query = "*";
		if (searchHandle != null)
			clearTimeout(searchHandle);
		
		var ownership = $("#competencySearchOwnership").val();
		if(ownership == 1)
			ownership = "public";
		else if(ownership == 3)
			ownership = "owned";
		else if(ownership == 4)
			ownership = "me"
		else
			ownership = "all";
		
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
			
			ViewManager.getView("#competencySearchMessageContainer").clearAlert("searchFail");
			
			var params = {};
			params.ownership = ownership;
			
			AppController.searchController.competencySearch(query, displayResults, errorSearching, ownership);
		}, 100);
	}
	
	function displayResults(results)
	{ 
		searchHandle = null;
		ViewManager.getView("#competencySearchResults").populate(results);
	}
	
	function errorSearching(err){
		if(err == undefined)
			err = "Unable to Connect to Server for Competency Search";
		
		ViewManager.getView("#competencySearchMessageContainer").displayAlert(err, "searchFail");
		
		$("#competencySearchNone").removeClass("hide");
		$("#competencySearchProgress").addClass("hide");
	}
	
	function viewCompetency(competency){
		ScreenManager.changeScreen(new CompetencyViewScreen(competency));
	}
	
	CompetencySearchScreen.prototype.display = function(containerId, callback)
	{
		var lastViewed = this.lastViewed;
		
		var query = this.query;
		var ownership = this.ownership;
		
		$(containerId).load("partial/screen/competencySearch.html", function(){
			ViewManager.showView(new MessageContainer("competencySearch"), "#competencySearchMessageContainer");
			
			ViewManager.showView(new DataViewer("competencyResults", {
				sort:{},
				clickDataEdit:function(datum){
					ScreenManager.changeScreen(new CompetencyEditScreen(datum));
				},
				moreMenuTools:function(){
					var el = $("<li><span><i class='fa fa-sitemap'></i> Add to Framework</span></li>");
					
					el.click(function(){
						var selected = ViewManager.getView("#competencySearchResults").getSelected();
						
						ModalManager.showModal(new AddCompetenciesToFrameworkModal(selected));
					})
					
					return el;
				},
				buildData:function(id, datum){
					var html = "<div class='small-8 columns'>" +
					"<a class='datum-name'>{{dataName}}</a>" +
					"<span class='datum-description'>{{dataDescription}}</span>" +
					"</div>" +
					"<div class='small-4 columns datum-owner'>{{dataOwner}}</div>";
	
				html = html.replaceAll(/{{dataId}}/g, id);
				
				if(datum["name"] != undefined)
					html = html.replaceAll(/{{dataName}}/g, datum["name"])
				else
					html = html.replaceAll(/{{dataName}}/g, id);
			
				if(datum["description"] != undefined)
					html = html.replaceAll(/{{dataDescription}}/g, " - "+datum["description"])
				else
					html = html.replaceAll(/{{dataDescription}}/g, "");
					
				
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
			            width:128,
			            height:128,
			            text:forge.util.decode64($(element).find(".contactText").attr("title").replaceAll("-----.*-----","").trim())
			        });  
				})
				
				el.find("a.datum-name").click(function(ev){
					ev.preventDefault();
					ScreenManager.changeScreen(new CompetencyViewScreen(datum));
				})
				
				return el;
				}
			}), "#competencySearchResults");
			
			
			$("#competencySearchSubmit").click(function(event){
				event.preventDefault();
				runCompetencySearch();
			});
			
			$("#competencySearchText").keypress(function(e){
				var key = e.which;
				if(key == 13)  // the enter key code
				{
					runCompetencySearch();
				}
			});
			
			if(query != null)
				$("#competencySearchText").val(query)
			
			if(LoginController.getLoggedIn())
			{
				$("#competencySearchOwnership").attr("max", 4);
				$("#competencySearchOwnershipLoggedIn").removeClass("hide");
				$("#competencySearchOwnershipPublic").addClass("hide");
			}
			else
			{
				$("#competencySearchOwnershipLoggedIn").addClass("hide");
				$("#competencySearchOwnershipPublic").removeClass("hide");
			}
			
			if(ownership != null){
				if(ownership == "public")
					ownership = 1;
				else if(ownership == "owned")
					ownership = 3;
				else if(ownership == "me")
					ownership = 4
				
				$("#competencySearchOwnership").val(ownership);
			}
			
			runCompetencySearch();
			
			if(callback != undefined)
				callback();
		});
	};
	
	return CompetencySearchScreen;
})(CompetencySearchScreen);