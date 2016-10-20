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
		
		if(results.length == 0)
		{
			ViewManager.getView("#assertionSearchResults").showNoDataMessage();
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
		var resultDiv = $("#assertionResults-data").first(); 
		
		if(resultDiv.size() == 0){
			$(window).off("scroll", scrollSearchHandler);
		}
		else if(($(window).height() + document.body.scrollTop) > ($(document).height() - 30))
		{
			//$("#moreSearchResults").addClass("hide");
			//$("#loadingMoreResults").removeClass("hide");
			runAssertionSearch(resultDiv.children().size());
		}
	}
	
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
		
		EcCompetency.search(AppController.repoInterface, "*", function(competencies){
			var cache = {};
			for(var i in competencies){
				cache[EcRemoteLinkedData.trimVersionFromUrl(competencies[i].id)] = competencies[i];
			}
			
			ViewManager.showView(new DataViewer("assertionResults", {
				sort:{},
				clickDataEdit:function(datum){
					ScreenManager.changeScreen(new AssertionEditScreen(datum));
				},
				buildData:function(id, datum){
					var html = "<div class='small-5 columns'>" +
								"<a>Assertion about <span class='datum-competency' style='font-style:italic'>{{dataCompetency}}</span></a>" +
								"</div>" + 
								"<div class='small-2 columns datum-subject'>{{dataSubject}}</div>" +
								"<div class='small-2 columns datum-agent'>{{dataAgent}}</div>" +
								"<div class='small-3 columns datum-owner'>{{dataOwner}}</div>";
					
					if(cache[EcRemoteLinkedData.trimVersionFromUrl(datum.competency)] != undefined){
						html = html.replaceAll(/{{dataCompetency}}/, cache[EcRemoteLinkedData.trimVersionFromUrl(datum.competency)].name)
					}else{
						html = html.replaceAll(/{{dataCompetency}}/, "Unknown Competency");
					}
					
					var owner = "";
					for(var i in datum["owner"]){
						owner+= createContactSmall(datum["owner"][i])+ ", "
					}
					owner = owner.substring(0, owner.length-2);
					html = html.replaceAll(/{{dataOwner}}/g, owner);
					
					var agent = datum.getAgent();
					if(agent == undefined)
						html = html.replaceAll(/{{dataAgent}}/, "by <span style='font-style:italic;'>Unknown</span>");
					else
						html = html.replaceAll(/{{dataAgent}}/, "by " + createContactSmall(agent.toPem()));
					
					var sub = datum.getSubject();
					if(sub == undefined)
						html = html.replaceAll(/{{dataSubject}}/, "on <span style='font-style:italic;'>Unknown</span>");
					else
						html = html.replaceAll(/{{dataSubject}}/, "on " + createContactSmall(sub.toPem()));
					
					var el = $(html);
					
					
					el.find("a").click(function(ev){
						ev.preventDefault();
						ScreenManager.changeScreen(new AssertionViewScreen(datum));
					})
					
					return el;
				}
			}), "#assertionSearchResults");
			
			runAssertionSearch();
		}, function(err){
			
		});
			
	};
	
	return AssertionSearchScreen;
})(AssertionSearchScreen);