/**
 * 
 * @class FrameworkList
 * @author devlin.junker@eduworks.com
 */
var FrameworkList = (function(FrameworkList){

	
	/**
	 * Builds the FrameworkList from a set of data (either a map from id to data, or an array)
	 * 
	 * @memberOf FrameworkList
	 * @method populateData
	 * @private
	 * @param {Array || Map} data	
	 * 			Set of data to be displayed
	 * @param {FrameworkList} self
	 * 			Reference to 'this' FrameworkList because of JavaScript weirdness
	 * @param {String} prefix
	 * 			FrameworkList prefix that uniquifys the view 
	 * @param {Object} callbacks
	 * 			Callback object that can be passed in by other developer to handle events or modify display
	 */
	function populateFramework(framework, containerId, callbacks){
		if(framework == undefined){
			//TODO: hide
			return;
		}
		
		
		$("#competencyList").html("");
		if(framework.competency != undefined){
			if(framework.competency.length > 7){
				$("#frameworkContentSearch").removeClass("hide");
			}
			
			for (var i = 0; i < framework.competency.length; i++) {
	            (function (i) {
	                timeout(function () {
	                    EcCompetency.get(framework.competency[i], function (competency) {
	                    	addCompetency(competency, containerId, callbacks);
	                    }, function(err){
	                    	
	                    })
	                })
	            })(i);
			}
		}
		
		if(framework.relation != undefined){
			for (var i = 0; i < framework.relation.length; i++) {
	            (function (i) {
	                timeout(function () {
	                	var retry;
	                	
	                    EcAlignment.get(framework.relation[i], function (rel) {
	                    	(retry = function(){
	                    		if($(".competency[data-id='"+rel.source+"']").size() > 0)
		                    		addRelation(rel, framework);
		                    	else
		                    		setTimeout(retry, 100);
	                    	})()
	                    	
	                    }, function(err){
	                    	
	                    })
	                })
	            })(i);
	            
			}
		}
		
		if(framework.level != undefined){
			for (var i = 0; i < framework.level.length; i++) {
	            (function (i) {
	                timeout(function () {
	                	var retry;
	                	
	                    EcLevel.get(framework.level[i], function (level) {
	                    	(retry = function(){
	                    		if($(".competency[data-id='"+level.competency+"']").size() > 0)
		                    		addLevel(level);
		                    	else
		                    		setTimeout(retry, 100);
	                    	})()
	                    }, function(err){
	                    	
	                    })
	                })
	            })(i);
			}
		}
		
		if(framework.rollupRule != undefined){
			for (var i = 0; i < framework.rollupRule.length; i++) {
	            (function (i) {
	                timeout(function () {
	                	var retry;
	                	
	                    EcRollupRule.get(framework.rollupRule[i], function (rule) {
	                    	(retry = function(){
	                    		if($(".competency[data-id='"+rule.competency+"']").size() > 0)
		                    		addRollup(rule);
		                    	else
		                    		setTimeout(retry, 100);
	                    	})()
	                    }, function(err){
	                    	
	                    })
	                })
	            })(i);
			}
		}
	}
	
	/**
	 * 
	 * 
	 * @memberOf FrameworkList
	 * @method addCompetency
	 * @private
	 */
	function addCompetency(competency, containerId, callbacks){
		var element = $("<li class='competency' style='margin-top: 0.5rem; cursor: pointer; padding: 0.25rem;'>"+
							"<div class='competencyDetails'>"+
								"<h6 class='competencyName' style='margin-bottom: 0px;'>"+
								"<a></a><br> <small class='competencyId'></small></h6>"+
								"<small class='competencyDescription' style='font-size: 0.75rem; margin-left: .5rem;'></small>" +
								"<div class='levelContainer hide' style='margin-left:1.25rem;'><small>" +
									"<strong>Levels:</strong> <span class='levelCount' style='font-size:0.7rem;'></span></small>"+
									"<ul class='competencyLevels' style='list-style: none; display:none;'></ul>" +
								"</div>"+
								"<div class='ruleContainer hide' style='margin-left:1.25rem;'><small>" +
									"<strong>Rules:</strong> <span class='ruleCount' style='font-size:0.7rem;'></span></small>"+
									"<ul class='rollupRules' style='list-style: none; display:none;'></ul>"+
								"</div>"+
								"<ul class='competencyRelations' style='list-style: none; '></ul>"+
							"</div></li>");
		
		element.attr("data-id", competency.shortId())
		element.find(".competencyName a").text(competency.name);
		element.find(".competencyDescription").text(competency.description);
		
		element.find(".competencyId").text(competency.shortId())
		
		element.attr("data-comp-id", competency.shortId());
		
		element.find(".competencyName a").click(function(ev){
    		ev.preventDefault();
    		
    		ScreenManager.changeScreen(new CompetencyViewScreen(competency));
    		
    		return false;
    	});
		
		element.find('.ruleCount').click(function(ev){
			element.find('.rollupRules').slideToggle();
		});
		
		element.find('.levelCount').click(function(ev){
			element.find('.competencyLevels').slideToggle();
		});
		
		element.click(function(ev){
			if($(ev.target).hasClass("fake-a") || $(ev.target).is("a"))
				return;
			
			element.toggleClass("selected");
			$(containerId+" .competency").not(element).removeClass("selected");
			
			if(callbacks != undefined && callbacks["selected"] != undefined)
				callbacks["selected"](competency.shortId());
		})

		$("#frameworkList").append(element);
	}
	
	/**
	 * 
	 * 
	 * @memberOf FrameworkList
	 * @method addRelation
	 * @private
	 */
	function addRelation(relation, framework){
		var element = $("<li class='relation'><small>"+
							"<i class='source'></i> " +
							"<span class='relationType'></span> " +
							"<i class='target'></i>" +
						"</small></li>");
		
		var type = AppSettings.relationTypes[relation.relationType];
		if(type == undefined)
			type = " has a relationship with ";
		element.find(".relationType").text(type);
		element.find(".source").attr("data-id", relation.source);
		element.find(".source").attr("data-id", relation.target);
		
		var sourceEl = element;
		var targetEl = element.clone();
		
		EcCompetency.get(relation.source, function(comp){
			sourceEl.find(".source").text(comp.name);
			targetEl.find(".source").text(comp.name);
			
			if(framework.competency.indexOf(relation.source) == -1){
				element.find("small").append(" <i class='fa fa-small fa-external-link' style='font-size:0.65rem'></i> ");
			}
		});
		
		EcCompetency.get(relation.target, function(comp){
			sourceEl.find(".target").text(comp.name);
			targetEl.find(".target").text(comp.name);
			
			if(framework.competency.indexOf(relation.target) == -1){
				element.find("small").append(" <i class='fa fa-small fa-external-link' style='font-size:0.65rem'></i> ");
			}
		});
		
		
		sourceEl.find(".target").addClass("fake-a");
		targetEl.find(".source").addClass("fake-a");
		
		$("[data-id='"+relation.source+"'] .competencyRelations").append(sourceEl);

		$("[data-id='"+relation.target+"'] .competencyRelations").append(targetEl);
	}
	
	/**
	 * 
	 * 
	 * @memberOf FrameworkList
	 * @method addLevel
	 * @private
	 */
	function addLevel(level){
		var element = $("<li class='level'>" +
							"<a class='levelName'></a> " +
							"<small class='levelTitle'></small>" +
							"<p class='levelDescription' style='font-size: .65rem; margin-left: .4rem; margin-bottom:0.65rem; line-height:0.5rem;'></p>" +
						"</li>");
		
		element.find(".levelName").text(level.name);
		element.find(".levelTitle").text("("+level.title+")");
		
		if(level.description != undefined && level.description != "")
			element.find(".levelDescription").text(level.description);
		else
			element.find(".levelDescription").hide();
		
		element.find(".levelName").click(function(){
			ModalManager.showModal(new EditLevelModal(level))
		});
		
		$("[data-id='"+level.competency+"'] .levelContainer").removeClass('hide');
		
		$("[data-id='"+level.competency+"'] .competencyLevels").append(element);
		
		var count = $("[data-id='"+level.competency+"'] .competencyLevels").find(".level").size();
		$("[data-id='"+level.competency+"'] .levelCount").text("( "+count+" )");
	}
	
	/**
	 * 
	 * 
	 * @memberOf FrameworkList
	 * @method addRollup
	 * @private
	 */
	function addRollup(rule){
		var element = $("<li class='rollupRule'>" +
							"<a class='ruleName'></a> " +
							"<p class='ruleDescription' style='font-size: .65rem; margin-left: .4rem; margin-bottom:0.65rem; line-height:0.5rem;'></p>" +
						"</li>");
		
		element.find(".ruleName").text(rule.name);
		if(rule.description != undefined && rule.description != "")
			element.find(".ruleDescription").text(rule.description);
		else
			element.find(".ruleDescription").hide();
						
		element.find(".ruleName").click(function(){
			ModalManager.showModal(new EditRollupRuleModal(rule))
		});
		
		$("[data-id='"+rule.competency+"'] .ruleContainer").removeClass('hide');

		$("[data-id='"+rule.competency+"'] .rollupRules").append(element);
		
		var count = $("[data-id='"+rule.competency+"'] .rollupRules").find(".rollupRule").size();
		$("[data-id='"+rule.competency+"'] .ruleCount").text("( "+count+" )");
	}
	
	/**
	 * Shows the 'Progress' message in the FrameworkList
	 * 
	 * @memberOf FrameworkList
	 * @method showProgressMessage
	 * @private
	 * @param {String} prefix
	 * 			FrameworkList prefix that uniquifys the view 
	 */
	function showProgressMessage(prefix){
		$("#"+prefix+"-progress").removeClass("hide");
	}
	

	
	/**
	 * Setup the FrameworkList after the html has been loaded
	 * 		renames Id's to uniqify
	 * 		builds Menu
	 * 		sets up select all 
	 * 
	 * Need to call Populate to build the rows
	 * 
	 * @memberOf FrameworkList
	 * @method display
	 * @param {String} containerId
	 * 			DOM ID of the element to display the FrameworkList
	 */
	FrameworkList.prototype.display = function(containerId){			
		var self = this;
					
		var framework = this.data;
		
		populateFramework(framework, containerId, this.callbacks);
		
		$("#frameworkContentSearch").keyup(function(ev){
			var text = $("#frameworkContentSearch").val().toLowerCase();
			
			if(text.length > 3){
				$("#frameworkList .competency").each(function(idx, el){
					if($(el).find('.competencyName').text().toLowerCase().indexOf(text) == 0){
						$(el).remove();
						
						var first = $("#frameworkList .competency").first();
						if(first.text().toLowerCase().indexOf(text) == 0){
							if(first.find(".competencyRelations .relation").size() >= $(el).find(".competencyRelations .relation").size()){
								first.after(el);
							}else{
								$("#frameworkList").prepend(el);
							}
						}else{
							$("#frameworkList").prepend(el);
						}
						
						$(el).show();
					}else if($(el).text().toLowerCase().indexOf(text) == -1){
						$(el).hide();
					}else{
						$(el).show();
					}
				})
			}else{
				$("#frameworkList .competency").show();
			}
		})
		
	}

	
	/**
	 * Shows the 'Progress' message in the FrameworkList
	 * 
	 * @memberOf FrameworkList
	 * @method setSelected
	 */
	FrameworkList.prototype.setSelected = function(competencyId){
		var cb = this.callbacks;
		
		$(".competency").removeClass("selected");
		
		var compEl = $(".competency[data-id='"+competencyId+"']");
		
		compEl.addClass("selected");
		
		var compList = compEl.parent();
		compEl.remove();
		
		compList.prepend(compEl);
		compEl.click(function(ev){
			if($(ev.target).hasClass("fake-a") || $(ev.target).is("a"))
				return;
			
			compEl.toggleClass("selected");
			$(".competency").not(compEl).removeClass("selected");
			
			if(cb != undefined && cb["selected"] != undefined)
				cb["selected"](competencyId)
		})
		
		$(".competency").not(compEl).each(function(idx, el){
			if($(el).find("[data-id='"+competencyId+"']").size() > 0){
				var parent = $(el).parent();
				$(el).remove();
				compEl.after(el);
				
				$(el).click(function(ev){
					if($(ev.target).hasClass("fake-a") || $(ev.target).is("a"))
						return;
					
					$(el).toggleClass("selected");
					$(".competency").not(el).removeClass("selected");
					
					if(cb != undefined && cb["selected"] != undefined)
						cb["selected"]($(el).attr("data-id"));
				})
			}
		})
	}
	
	
	/**
	 * Shows the 'Progress' message in the FrameworkList
	 * 
	 * @memberOf FrameworkList
	 * @method deselect
	 */
	FrameworkList.prototype.deselectAll = function(){
		$(".competency").removeClass("selected");
	}

	
	return FrameworkList;
})(FrameworkList);