AssertionSearchScreen = (function(AssertionSearchScreen){
	
	function createContactSmall(pk)
	{
		var ident = AppController.identityController.lookup(pk);
	    return '<span class="ownershipDisplay has-tip" tabindex>'
	    	+ '<span class="qrcodeCanvas"></span>'
	    	+ '<span class="contactText" title="'+pk+'">'+ident.displayName+'</span>'
	    	+ '</span>';
	}
	
	var searchHandle = null;
	
	function runAssertionSearch(){
		searchHandle = setTimeout(function() {
			
			ViewManager.getView("#assertionSearchMessageContainer").clearAlert("searchFail");
			
			AppController.searchController.assertionSearch("*", function(results){
				var waitFunc = function(){
					if(ViewManager.getView("#assertionSearchResults") != undefined){
						displayResults(results);
					}else{
						setTimeout(waitFunc, 100);
					}
				};
				
				waitFunc();
			}, errorSearching);
		}, 100);
	}
	
	function displayResults(results)
	{ 
		searchHandle = null;
		
		ViewManager.getView("#assertionSearchResults").populate(results);
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
	
	AssertionSearchScreen.prototype.display = function(containerId, callback)
	{
		var lastViewed = this.lastViewed;
		
		$(containerId).load("partial/screen/assertionSearch.html", function(){
			
			ViewManager.showView(new MessageContainer("assertionSearch"), "#assertionSearchMessageContainer");
			
			AppController.searchController.competencySearch("*", function(competencies){
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
						
						el.find(".ownershipDisplay").each(function(i, element){
							$(element).children(".qrcodeCanvas").qrcode({
				                width:128,
				                height:128,
				                text:forge.util.decode64($(element).find(".contactText").attr("title").replaceAll("-----.*-----","").trim())
				            });  
						})
						
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
			
			
			if(callback != undefined)
				callback();
		});
	};
	
	return AssertionSearchScreen;
})(AssertionSearchScreen);