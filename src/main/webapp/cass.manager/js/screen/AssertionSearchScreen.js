AssertionSearchScreen = (function(AssertionSearchScreen){
	
	var maxLength = 24;
	
	var searchHandle = null;
	
	function runAssertionSearch(start){
		searchHandle = setTimeout(function() {
			
			ViewManager.getView("#assertionSearchMessageContainer").clearAlert("searchFail");
			
			var callback;
			if(start == undefined)
				callback = clearDisplayResults;
			else
				callback = displayResults;
			
			var params = {};
			params.size = maxLength;
			params.start = start;
			
			EcAssertion.search(AppController.repoInterface, "*", function(results){
				var waitFunc = function(){
					if(ViewManager.getView("#assertionSearchResults") != undefined){
						callback(results);
					}else{
						setTimeout(waitFunc, 100);
					}
				};
				
				waitFunc();
			}, errorSearching, params);
		}, 100);
	}
	
	function clearDisplayResults(results)
	{
		ViewManager.getView("#assertionSearchResults").clear();
		displayResults(results);
	}
	
	function displayResults(results)
	{ 
		ViewManager.getView("#assertionSearchResults").populate(results);
		
		if(results.length == 0 && $("#assertionResults-data").first().children().size() == 0){
			ViewManager.getView("#assertionSearchResults").showNoDataMessage();
		}else if(results.length < maxLength){
			$("#moreSearchResults").addClass("hide");
			//$(window).off("scroll", scrollSearchHandler);
		}else{
			$("#getMoreResults").click(function(){
				$("#getMoreResults").addClass("hide");
				$("#loadingMoreResults").removeClass("hide");
				runAssertionSearch($("#assertionResults-data").first().children().size());
			})
			
			$("#getMoreResults").removeClass("hide");
			$("#moreSearchResults").removeClass("hide");
			$("#loadingMoreResults").addClass("hide");
			
			//$(window).scroll(scrollSearchHandler)
		}
		
		searchHandle = null;
		
	}
	
//	function scrollSearchHandler(){
//		var resultDiv = $("#assertionResults-data").first(); 
//		
//		if(resultDiv.size() == 0){
//			$(window).off("scroll", scrollSearchHandler);
//		}
//		else if(($(window).height() + document.body.scrollTop) > ($(document).height() - 30))
//		{
//			//$("#moreSearchResults").addClass("hide");
//			//$("#loadingMoreResults").removeClass("hide");
//			runAssertionSearch(resultDiv.children().size());
//		}
//	}
	
	function errorSearching(err){
		if(err == undefined)
			err = "Unable to Connect to Server for Competency Search";
		
		ViewManager.getView("#competencySearchMessageContainer").displayAlert(err, "searchFail");
		
		// TODO: Call Appropriate show/hide on dataViewer
		
	}
	
	function viewCompetency(competency){
		ScreenManager.changeScreen(new CompetencyViewScreen(competency));
	}
	
	AssertionSearchScreen.prototype.display = function(containerId)
	{
		var lastViewed = this.lastViewed;
	
		
		ViewManager.showView(new MessageContainer("assertionSearch"), "#assertionSearchMessageContainer");
		
		ViewManager.showView(new DataViewer("assertionResults", {
			sort:{},
			clickDataEdit:function(datum){
				ScreenManager.changeScreen(new AssertionEditScreen(datum));
			},
			buildData:function(id, datum){
				var el = $( "<div>"+
								"<div class='small-5 columns'>" +
								"<a>Assertion about <span class='datum-competency' style='font-style:italic'></span></a>" +
								"</div>" + 
								"<div class='small-2 columns datum-subject'></div>" +
								"<div class='small-2 columns datum-agent'></div>" +
								"<div class='small-3 columns datum-owner'></div>" +
							"</div>");
				
				EcCompetency.get(datum.competency, function(competency){
					$("[data-id='"+datum.id+"']").find(".datum-competency").text(competency.name)
				}, function(){
					el.find(".datum-competency").text("Unknown Competency");
				})
				el.find(".datum-competency").text("Loading..");
				
				
				var owner = "";
				for(var i in datum["owner"]){
					owner+= createContactSmall(datum["owner"][i])+ ", "
				}
				owner = owner.substring(0, owner.length-2);
				el.find(".datum-owner").html(owner);
				
				var agent = datum.getAgent();
				if(agent == undefined)
					el.find(".datum-agent").html("by <span style='font-style:italic;'>Unknown</span>");
				else
					el.find(".datum-agent").html("by " + createContactSmall(agent.toPem()))
				
				var sub = datum.getSubject();
				if(sub == undefined)
					el.find(".datum-subject").html("by <span style='font-style:italic;'>Unknown</span>");
				else
					el.find(".datum-subject").html("on " + createContactSmall(sub.toPem()))
				
				
				el.find("a").click(function(ev){
					ev.preventDefault();
					ScreenManager.changeScreen(new AssertionViewScreen(datum));
				})
				
				return el.children();
			}
		}), "#assertionSearchResults");
		
		runAssertionSearch();
			
	};
	
	return AssertionSearchScreen;
})(AssertionSearchScreen);