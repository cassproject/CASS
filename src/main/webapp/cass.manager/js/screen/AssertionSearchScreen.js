/**
 * Screen for searching for assertions, loads a {DataViewer} view to 
 * display the results of the search and prepares the 
 * 
 * @module cass.manager
 * @class AssertionSearchScreen
 * 
 * @author devlin.junker@eduworks.com
 */
AssertionSearchScreen = (function (AssertionSearchScreen) {

    var maxLength = 24;

    var searchHandle = null;

    /**
     * Method to run the assertion search on the server
     * 
     * @memberOf AssertionSearchScreen
     * @method runAssertionSearch
     * @private
     * @param {int} start
     * 			where in the repository index to start the search
     */
    function runAssertionSearch(start) {
        searchHandle = setTimeout(function () {

            ViewManager.getView("#assertionSearchMessageContainer").clearAlert("searchFail");

            var callback;
            if (start == undefined)
                callback = clearDisplayResults;
            else
                callback = displayResults;

            var params = {};
            params.size = maxLength;
            params.start = start;

            EcAssertion.search(AppController.serverController.getRepoInterface(), "*", function (results) {
                var waitFunc = function () {
                    if (ViewManager.getView("#assertionSearchResults") != undefined) {
                        callback(results);
                    } else {
                        setTimeout(waitFunc, 100);
                    }
                };

                waitFunc();
            }, errorSearching, params);
        }, 100);
    }

    /**
     * Clears the data in the DataViewer so that the table is empty
     * and then displays the results
     * 
     * @memberOf AssertionSearchScreen
     * @method clearDisplayResults
     * @private	
     * @param {Array<EcAssertion>} results
     * 			results to display after clearing the DataViewer
     */
    function clearDisplayResults(results) {
        ViewManager.getView("#assertionSearchResults").clear();
        displayResults(results);
    }

    /**
     * Displays results of the search, by appending them to the table,
     * does some checks on the number of results to see what interfaces 
     * should be visible
     * 
     * @memberOf AssertionSearchScreen
     * @method displayResults
     * @private
     * @param {Array<EcAssertion>} results
     * 			results to add to to the DataViewer
     */
    function displayResults(results) {
    	ViewManager.getView("#menuContainer").showSortBasic();
        ViewManager.getView("#assertionSearchResults").populate(results);

        if (results.length == 0 && $("#assertionResults-data").first().children().size() == 0) {
            ViewManager.getView("#assertionSearchResults").showNoDataMessage();
        } else if (results.length < maxLength) {
            $("#moreSearchResults").addClass("hide");
            //$(window).off("scroll", scrollSearchHandler);
        } else {
            $("#getMoreResults").click(function () {
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

    /*
     * 
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
    */

    /**
     * Error function called if the assertion search fails
     * 
     * @memberOf AssertionSearchScreen
     * @method errorSearching
     * @private
     * @param {String} err
     * 			Error message to display
     */
    function errorSearching(err) {
        if (err == undefined)
            err = "Unable to Connect to Server for Assertion Search";

        ViewManager.getView("#competencySearchMessageContainer").displayAlert(err, "searchFail");

        // TODO: Call Appropriate show/hide on dataViewer

    }

    /**
     * Overridden display function, called once html partial is loaded into DOM
     * 
     * @memberOf AssertionSearchScreen
     * @method display
     * @param {String} containerId
     * 			Screen Container DOM ID
     */
    AssertionSearchScreen.prototype.display = function (containerId) {
        var lastViewed = this.lastViewed;


        ViewManager.showView(new MessageContainer("assertionSearch"), "#assertionSearchMessageContainer");

        ViewManager.showView(new DataViewer("assertionResults", {
            sort: {},
            clickDataEdit: function (datum) {
                ScreenManager.changeScreen(new AssertionEditScreen(datum));
            },
            buildDataRow: function (row, id, datum) {
                row.append("<div class='small-5 columns'>" +
                    "<a>Assertion about <span class='datum-competency' style='font-style:italic'></span></a>" +
                    "</div>" +
                    "<div class='small-2 columns datum-subject'></div>" +
                    "<div class='small-2 columns datum-agent'></div>" +
                    "<div class='small-3 columns datum-owner'></div>");

                row.find(".datum-competency").text("Loading..");
                EcCompetency.get(datum.competency, function (competency) {
                    $("[data-id='" + datum.id + "']").find(".datum-competency").text(competency.name);
                }, function () {
                    row.find(".datum-competency").text("Unknown Competency");
                })


                for (var i in datum["owner"]) {
                    var trimId = EcRemoteLinkedData.trimVersionFromUrl(id)
                    var idEnd = trimId.split("/")[trimId.split("/").length - 1];
                    var elId = idEnd + "-owner-" + i;

                    var ownerEl = $("<span id='" + elId + "'></span>")
                    row.find(".datum-owner").append(ownerEl);

                    ViewManager.showView(new IdentityDisplay(datum["owner"][i]), "#" + elId)
                }

                row.find(".datum-agent").html("<span style='font-style:italic;'>Loading...</span>");
                datum.getAgentAsync(function (agent) {
                    if (agent == undefined || agent == null) {
                        row.find(".datum-agent").html("by <span style='font-style:italic;'>&lt;Restricted&gt;</span>");
                    } else {
                        row.find(".datum-agent").html("by <span id='assertion-agent" + datum.getGuid() + "'></span>");
                        ViewManager.showView(new IdentityDisplay(agent.toPem()), "#assertion-agent" + datum.getGuid() + "");
                    }
                }, function (error) {
                    row.find(".datum-agent").html("by <span style='font-style:italic;'>&lt;Restricted&gt;</span>");
                });

                row.find(".datum-subject").html("<span style='font-style:italic;'>Loading...</span>");
                datum.getSubjectAsync(function (sub) {
                    if (sub == undefined || sub == null) {
                        row.find(".datum-subject").html("about <span style='font-style:italic;'>&lt;Restricted&gt;</span>");
                    } else {
                        row.find(".datum-subject").html("about <span id='assertion-subject" + datum.getGuid() + "'></span>");
                        ViewManager.showView(new IdentityDisplay(sub.toPem()), "#assertion-subject" + datum.getGuid() + "");
                    }
                }, function (error) {
                    row.find(".datum-subject").html("about <span style='font-style:italic;'>&lt;Restricted&gt;</span>");
                });

                row.find("a").click(function (ev) {
                    ev.preventDefault();
                    ScreenManager.changeScreen(new AssertionViewScreen(datum));
                });

            }
        }), "#assertionSearchResults");

        runAssertionSearch();
        
    	ViewManager.getView("#menuContainer").showSortBasic();
	};
	
	/**
	 * Overridden onClose callback, called when leaving screen
	 * 
	 * @memberOf AssertionSearchScreen
	 * @method onClose
	 */
	AssertionSearchScreen.prototype.onClose = function(){
		ViewManager.getView("#menuContainer").hideSort();
	}
	
	AssertionSearchScreen.prototype.sortByTimestamp = function(){
		$("#assertionResults-sortSelect").val("timestamp");
		$("#assertionResults-sortSelect").trigger("change");
	}
	
	AssertionSearchScreen.prototype.sortByOwner = function(){
		$("#assertionResults-sortSelect").val("owner");
		$("#assertionResults-sortSelect").trigger("change");
	}
	

    return AssertionSearchScreen;
})(AssertionSearchScreen);
