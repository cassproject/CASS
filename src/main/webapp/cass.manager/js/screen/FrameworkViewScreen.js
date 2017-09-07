/**
 * Screen that handles displaying Framework Details
 * 
 * @module cass.manager
 * @class FrameworkViewScreen
 * 
 * @author devlin.junker@eduworks.com
 */
FrameworkViewScreen = (function (FrameworkViewScreen) {
    
	EcRepository.caching = true;
	var springyHandleMap = {};
	
	var fonts = {
	    node: "bold 12px Arial",
	    edge: "bold 12px Arial"
	};
	
	/**
	 * Handles displaying relationship details in DOM
	 * 
	 * @memberOf FrameworkViewScreen
	 * @method buildFramework 
	 * @private
	 * @param {EcAlignment} framework 
	 * 			Relation to display
	 */
    function buildFramework(framework) {
    	var name;
		if(framework.getName != undefined){
			$("#frameworkViewerName").text(framework.getName());
		}else if(framework["name"] != undefined){
			$("#frameworkViewerName").text(framework["name"]);
		}else{
			$("#frameworkViewerName").html("<i>Unnamed Framework</i>");
		}
    		
    	$("#frameworkViewerId").text(framework.id);
    	
    	if(framework.getDescription != undefined){
			$("#frameworkViewerDescription").text(framework.getDescription());
		}else if(framework["description"] != undefined){
			$("#frameworkViewerDescription").text(framework["description"]);
		}
    	
    	cacheShowObjects(framework);
    }
    
    function cacheShowObjects(framework, callback){
    	if(framework.competency != undefined && framework.competency.length > 0){
    		$("#frameworkViewerContents").removeClass("hide");
    		$("#frameworkEmpty").addClass("hide");
    		$("#frameworkLoading").removeClass("hide");
        	AppController.serverController.getRepoInterface().precache(framework.competency, function(){
    			AppController.serverController.getRepoInterface().precache(framework.relation, function(){
    				AppController.serverController.getRepoInterface().precache(framework.level, function(){
    					$("#frameworkLoading").addClass("hide");
    					
    					var nodeSelectedFunction = displayVisualization(framework);
    		        	
    					ViewManager.showView(new FrameworkList(framework, {
    						selected:nodeSelectedFunction
    					}), "#frameworkContentsList");
    					
    					
    				});
    			});
    		});
    	}else{
    		$("#frameworkViewerContents").addClass("hide");
    		$("#frameworkEmpty").removeClass("hide");
    	}
    }

	FrameworkViewScreen.prototype.onClose = function(){
		if (window.springy != springyHandleMap[this.data.shortId()])
			return true;
		if (window.springy != null && window.springy !== undefined)
			window.springy.layout.stop();
		window.springy = null;
		return true;
	}

    /**
	 * Handles displaying relationship details in DOM
	 * 
	 * @memberOf FrameworkViewScreen
	 * @method displayVisualization 
	 * @private
	 */
    function displayVisualization(framework) {
        var canvas = $("#frameworkViewCanvas").get(0);
        var ctx = canvas.getContext("2d");

        var graph = new Springy.Graph();
        var nodes = {};

        canvas.width = $("#frameworkViewCanvas").parent().innerWidth() - 60;

        jQuery(function () {
            var springy = window.springy = $("#frameworkViewCanvas").springy({
                graph: graph,
                nodeSelected: function (node) {
                	
                    console.log('Node selected: ' + JSON.stringify(node.data));
                    
                    ViewManager.getView("#frameworkContentsList").setSelected(EcRemoteLinkedData.trimVersionFromUrl(node.data.id));
                },
                noNodeSelected: function(){
                	 ViewManager.getView("#frameworkContentsList").deselectAll();
                },
                stiffness:1000,
                minEnergyThreshold:0.1
            });
            springyHandleMap[framework.shortId()] = springy;
        });

        //window.springs = new Springy.Layout.ForceDirected(graph, 0.0, new Springy.Vector(200.0, 100.0), 0.1);

        var fetches = 0;

        if (framework.competency != undefined)
            for (var i = 0; i < framework.competency.length; i++) {
                fetches++;
                (function (i) {
                    timeout(function () {
                        EcCompetency.get(framework.competency[i], function (competency) {
                            fetches--;
                            
                            var name = competency.getName()
                            
                            
                            nodes[competency.shortId()] = graph.newNode({id:competency.id, "name":name, font: fonts.node, mass: 2});
                            nodes[competency.shortId()].gravity = 0.0;
                            nodes[competency.shortId()].fixed = true;
                            if (framework.competency.length < 20)
                                nodes[competency.shortId()].alwaysShowText = true;
                            if (fetches == 0) {
                            	$("#frameworkViewCanvas").removeClass("hide");
                                if (framework.relation != undefined)
                                    for (var i = 0; i < framework.relation.length; i++) {
                                        (function (i) {
                                            timeout(function () {
                                                EcAlignment.get(framework.relation[i], function (rel) {
                                                	var relation = new EcAlignment();
                                                	relation.copyFrom(rel);
                                                    if (relation.source !== undefined) {
                                                        var shortSource = EcRemoteLinkedData.trimVersionFromUrl(relation.source);
                                                        var shortTarget = EcRemoteLinkedData.trimVersionFromUrl(relation.target);
                                                        if (nodes[shortSource].alwaysShowText === undefined)
                                                            nodes[shortSource].alwaysShowText = false;
                                                        relation.font = fonts.edge;
                                                        if (relation.relationType == "requires") {
                                                            nodes[shortSource].alwaysShowText = true;
                                                            nodes[shortTarget].fixed = false;
                                                            nodes[shortTarget].gravity += 1.0;
                                                            relation.color = "#880000";
                                                            graph.newEdge(nodes[shortSource], nodes[shortTarget], relation);
                                                        }
                                                        if (relation.relationType == "narrows") {
                                                            nodes[shortTarget].alwaysShowText = true;
                                                            nodes[shortSource].fixed = false;
                                                            nodes[shortSource].gravity += 1.0;
                                                            relation.color = "#008800";
                                                            graph.newEdge(nodes[shortTarget], nodes[shortSource], relation);
                                                        }
                                                    }
                                                }, function () {});
                                            });
                                        })(i);
                                    }
                            }
                        }, function () {});
                    });
                })(i);
            }
        
        return function(competencyId){
        	window.springy.layout.eachNode(function(n, p){
        		if(EcRemoteLinkedData.trimVersionFromUrl(n.data.id) == competencyId){
        			window.springy.layout.selected = {
        		            node: n,
        		            point: p,
        		            distance: 0.0
        		        };
        		}
        	});
        }
    }

    
    function deleteFramework(framework){
    	ModalManager.showModal(new ConfirmModal(function(){
    		framework._delete(function(p1){
					ScreenManager.changeScreen(new FrameworkSearchScreen());
			}, function(err){
				if (err == null)
					err = "Unable to connect to server to delete framework";
				ViewManager.getView("#frameworkViewMessageContainer").displayAlert(err);
			});
			ModalManager.hideModal();
		}, "Are you sure you want to delete this framework?"));
    }
    
    /**
	 * Handles displaying error message when retrieving relationship for display
	 * 
	 * @memberOf FrameworkViewScreen
	 * @method displayRelation 
	 * @private
	 * @param {String} err 
	 * 			Error message to display
	 */
    function errorRetrieving(err) {
    	if (err == undefined)
			err = "Unable to Connect to Server to Retrieve Framework";

    	ViewManager.getView("#frameworkViewMessageContainer").displayAlert(err, "getFramework");
    }

    
    /**
	 * Attempts to download the file passed in
	 * 
	 * @memberOf FrameworkViewScreen
	 * @method saveFile
	 * @param content
	 * 			Content of file to save
	 * @param name
	 * 			Name of file to save
	 */
    function saveFile(content, name){
    	try {
		    var isFileSaverSupported = !!new Blob;
		    
		    var blob = new Blob([content], {type:"text/plain;charset=utf-8"});
    		saveAs(blob, name);
		} catch (e) {
			ViewManager.getView("#frameworkViewMessageContainer").displayAlert("Your browser doesn't support file downloads", "downloadFile");
		}
    }
    
    /**
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf FrameworkViewScreen
	 * @method display
	 * @param containerId
	 * 			Screen Container DOM ID
	 */
    FrameworkViewScreen.prototype.display = function (containerId, callback) {
        var data = this.data;

        if (data.id != null) {
            ScreenManager.setScreenParameters({
                "id": data.id
            })
        }

        ViewManager.showView(new MessageContainer("frameworkView"), "#frameworkViewMessageContainer");

        if (EcEncryptedValue.encryptOnSave(data.id))
            $("#frameworkViewerPrivateSymbol").removeClass("hide");
        else
            $("#frameworkViewerPrivateSymbol").addClass("hide");

        if (data.owner != undefined && data.owner.length > 0) {
            $("#frameworkViewOwner").text("")
            for (var i = 0; i < data.owner.length; i++) {
                if (i > 0)
                    $("#frameworkViewOwner").append(", ");

                
                $("#frameworkViewOwner").append("<span id='framework-owner-"+i+"'></span>");
                
                ViewManager.showView(new IdentityDisplay(data.owner[i]), "#framework-owner-"+i);
       
            }
        } else {
            $("#frameworkViewOwner").text("Public")
        }

        $("#frameworkViewSearchBtn").attr("href", "#" + FrameworkSearchScreen.prototype.displayName);
        $("#frameworkViewSearchBtn").click(function (event) {
            event.preventDefault();
            ScreenManager.changeScreen(new FrameworkSearchScreen(data));
        });

        $("#frameworkViewBtn").attr("href", "#" + FrameworkViewScreen.prototype.displayName);
        $("#frameworkViewBtn").click(function (event) {
            event.preventDefault();
        });

        if (AppController.identityController.canEdit(data)) {
            $("#editFrameworkBtn").click(function (event) {
                event.preventDefault();
                ScreenManager.changeScreen(new FrameworkEditScreen(data));
            })
        } else {
            $("#editFrameworkBtn").hide();
        }
        
        if (!AppController.identityController.owns(data) && !AppController.serverController.getAdmin()) {
            $("#frameworkViewDeleteBtn").remove();
        } else {
            $("#frameworkViewDeleteBtn").click(function () {
                deleteFramework();
            })
        }
        
        $("#jsonLdDownload").click(function(){
        	saveFile(data.toJson(), data.getGuid()+".jsonld");
        });
        
        // May need to include the signatureSheet to allow access to hidden/encrypted objects
        $("#rdfDownload").click(function(){
        	data.asRdfXml(function(rdf){
        		saveFile(rdf, data.getGuid()+".xml");
        	});
        });
        
        $("#ttlDownload").click(function(){
        	data.asTurtle(function(ttl){
        		saveFile(ttl, data.getGuid()+".ttl");
        	});
        });
        
        $("#nQuadsDownload").click(function(){
        	data.asNQuads(function(nquads){
        		saveFile(nquads, data.getGuid()+".n4");
        	});
        });
        
        $("#asnJsonDownload").click(function(){
        	data.asAsnJson(function(asn){
        		saveFile(asn, data.getGuid()+".json")
        	}, function(err){
        		ViewManager.getView("#frameworkViewMessageContainer").displayAlert("Cannot find ASN endpoint: "+err, "downloadFile");
        	}, AppController.serverController.selectedServerUrl)
        });
        
        $("#csvDownload").click(function(){
        	CSVExport.exportFramework(data.id, function(){
        		
        	}, function(){
        		
        	});
        })
        
        EcFramework.get(data.id, function(framework){
        	data = framework;
        	
        	AppController.storageController.addRecent(EcFramework.myType, data.shortId());
			ViewManager.getView(AppController.topBarContainerId).buildRecentFrameworkList(AppController.storageController.getRecent(EcFramework.myType));	
			
			buildFramework(data);
		}, function(msg){
			EcFramework.get(EcRemoteLinkedData.trimVersionFromUrl(data.id), function(framework){
				data = framework;
				
				AppController.storageController.addRecent(EcFramework.myType, data.shortId());
				ViewManager.getView(AppController.topBarContainerId).buildRecentFrameworkList(AppController.storageController.getRecent(EcFramework.myType));
				
				buildFramework(data);
			}, errorRetrieving);
		});
    };

    return FrameworkViewScreen;
})(FrameworkViewScreen);
