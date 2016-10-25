CompetencySearchScreen = (function(CompetencySearchScreen){
	
	var maxLength = 24;
	
	var searchHandle = null;
	
	function runCompetencySearch(start){
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
			
			ViewManager.getView("#competencySearchMessageContainer").clearAlert("searchFail");
			
			var params = {};
			params.ownership = ownership;
			params.size = maxLength;
			params.start = start;
			
			EcCompetency.search(AppController.repoInterface, query, callback, errorSearching, params);
		}, 100);
	}
	
	function clearDisplayResults(results)
	{
		ViewManager.getView("#competencySearchResults").clear();
		displayResults(results);
	}
	
	function displayResults(results)
	{ 
		ViewManager.getView("#competencySearchResults").populate(results);
		
		if(results.length == 0)
		{
			ViewManager.getView("#competencySearchResults").showNoDataMessage();
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
		var resultDiv = $("#competencyResults-data").first(); 
		
		if(resultDiv.size() == 0){
			$(window).off("scroll", scrollSearchHandler);
		}
		else if(($(window).height() + document.body.scrollTop) > ($(document).height() - 30))
		{
			//$("#moreSearchResults").addClass("hide");
			//$("#loadingMoreResults").removeClass("hide");
			runCompetencySearch(resultDiv.children().size());
		}
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
	
	CompetencySearchScreen.prototype.display = function(containerId)
	{
		var lastViewed = this.lastViewed;
		
		var query = this.query;
		var ownership = this.ownership;
		
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
				var el = $(	"<div>"+ 
								"<div class='small-8 columns'>" +
								"<a class='datum-name'></a>" +
								"<span class='datum-description'></span>" +
								"</div>" +
								"<div class='small-4 columns datum-owner'></div>" +
							"</div>");
				if(datum["name"] != undefined)
					el.find(".datum-name").text(datum["name"]);
				else
					el.find(".datum-name").text(id);
				
				if(datum["description"] != undefined)
					el.find(".datum-description").text(" - "+datum["description"]);
				else
					el.find(".datum-description").text("");
				
				if(datum["owner"] != undefined && datum["owner"].length > 0){
					var owner = "";
					for(var i in datum["owner"]){
						owner+= createContactSmall(datum["owner"][i])+ ", ";
					}
					owner = owner.substring(0, owner.length-2);
					el.find(".datum-owner").html(owner);
				}else{
					el.find(".datum-owner").text("Public");
				}
				
				el.find("a.datum-name").click(function(ev){
					ev.preventDefault();
					ScreenManager.changeScreen(new CompetencyViewScreen(datum));
				})
				
				return el.children();
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
		
	};
	
	return CompetencySearchScreen;
})(CompetencySearchScreen);