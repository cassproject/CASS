/*
 * The third definition defines the UI methods and server-exposed methods
 */
var AppMenu = (function(AppMenu){
	/**
	 * Local Methods are used to manipulate the UI elements on the page (They may also call Server Model or 
	 * Server Manager methods to affect the server, but that shouldn't be built by the UI developer)
	 */

	
	function selectKey(ppk)
	{
	    $("#appMenuIdentityList").find(".fake-a").removeClass("selected");
	    $("#appMenuIdentityList").find("[title='"+ppk+"']").addClass("selected");
	    
	    AppController.identityController.select(ppk);
	    
	    ScreenManager.replaceScreen(ScreenManager.getCurrentScreen());
	    
	    $("#appMenuUserIdentity").children().first().text(AppController.identityController.selectedIdentity.displayName);
	}

	var PUBLIC_NAME = "Public";
	var PUBLIC_TITLE = "No Personal Identity, all objects created will be owned by the public";
	
	function deselectKey(){
		$("#appMenuIdentityList").find(".fake-a").removeClass("selected");
	    $("#appMenuIdentityList").find("[title='"+PUBLIC_TITLE+"']").addClass("selected");
	    
	    AppController.identityController.unselect();
	    
	    ScreenManager.replaceScreen(ScreenManager.getCurrentScreen());
	    
	    $("#appMenuUserIdentity").children().first().text(PUBLIC_NAME+" (Logged In)");
	}
	
	function buildIdentityList(){
		var identities = EcIdentityManager.ids;
		
	    $("#appMenuIdentityList").html("");
        var identitySelected = false;
	    for (var index in identities)
	    {
	    	var ppk = identities[index].ppk.toPem().replaceAll("\r?\n","");
	        var name = identities[index].displayName;
	        
	        container = $("<li></li>");
	        element = $("<div class='fake-a'></div>");
	        
	        if(AppController.identityController.selectedIdentity != undefined && 
	        		name == AppController.identityController.selectedIdentity.displayName)
	        {
	        	element.addClass("selected");
	        	identitySelected = true;
	        	$("#appMenuUserIdentity").children().first().text(name)
	        }
	        	
	        element.attr("title", ppk);
	        element.click(ppk, function(event){
	        	selectKey(event.data);
	        });
	        element.text(name);
	        element.append($("<i class='fa fa-check'></i>"))
	        
	        container.append(element);
	        
	        $("#appMenuIdentityList").append(container);
	    }
	    
	    var container = $("<li></li>");
        var element = $("<div class='fake-a'></div>");
        if(!identitySelected)
        {
        	element.addClass("selected");
        	$("#appMenuUserIdentity").children().first().text(PUBLIC_NAME+" (Logged In)")
        }
        	
        element.attr("title", PUBLIC_TITLE);
        element.click(ppk, function(event){
        	deselectKey();
        });
        element.text(PUBLIC_NAME);
        element.append($("<i class='fa fa-check'></i>"))
        
        container.append(element);
        $("#appMenuIdentityList").prepend(container);
	}
	
	function loginModalCallback(){
		var screenName;
		
		if(ScreenManager.getCurrentScreen().getDisplayName != null){
			screenName = ScreenManager.getCurrentScreen().getDisplayName();
		}else{
			screenName = ScreenManager.getCurrentScreen().displayName;
		}
		
		if(screenName == WelcomeScreen.displayName){
			ModalManager.hideModal();
			ScreenManager.changeScreen(new UserIdentityScreen())
		}else{
			ModalManager.hideModal();
			ScreenManager.replaceScreen(ScreenManager.getCurrentScreen());
		}
	}
	
	/**
	 * The display function defines how this view should be displayed
	 */
	AppMenu.prototype.display = function()
	{
		var view = this;
				
		$("#appMenuToggle").click(function(ev){
			ev.preventDefault();
			return false;
		});
		
		AppMenu.prototype.setCurrentServer();
		
		$("#appMenuPublicChangeServer").click(function(){
			ModalManager.showModal(new ChangeServerModal());
		});
		
		$("#appMenuUserChangeServer").click(function(){
			ModalManager.showModal(new ChangeServerModal());
		});
		
		$("#appMenuHeader").attr("href", "#"+WelcomeScreen.prototype.displayName)
		$("#appMenuHeader").click(function(ev){
			ev.preventDefault();
			ScreenManager.changeScreen(new WelcomeScreen());
			return false;
		});
		
		$("#appMenuPublicTop").click(function(){
			ModalManager.showModal(new LoginModal(loginModalCallback));
		})
		$("#appMenuLogin").click(function(){
			ModalManager.showModal(new LoginModal(loginModalCallback));
		});
		$("#appMenuCreateAccount").click(function(){
			ModalManager.showModal(new CreateUserModal());
		});
		
		$("#appMenuAdminPage").click(function(){
			ScreenManager.changeScreen(new UserAdminScreen());
		})
		
		$("#appMenuUserIdentityPage").attr("href", "#"+UserIdentityScreen.prototype.displayName);
		$("#appMenuUserIdentityPage").click(function(event){
			event.preventDefault();
			ScreenManager.changeScreen(new UserIdentityScreen());
		});
		
		$("#appMenuUserLogout").click(function(event){
			event.preventDefault();
			
			AppController.loginController.save(function(){
				AppController.loginController.logout();
				AppMenu.prototype.setLoggedOut();
				ScreenManager.changeScreen(new WelcomeScreen());
			});
		});
		
		$("#appMenuRepoSearch").attr("href", "#"+RepoSearchScreen.prototype.displayName);
		$("#appMenuRepoSearch").click(function(event){
			event.preventDefault();
			ScreenManager.changeScreen(new RepoSearchScreen());
		});
		$("#appMenuRepository").attr("href", "#"+RepoSearchScreen.prototype.displayName);
		$("#appMenuRepository").click(function(event){
			event.preventDefault();
			ScreenManager.changeScreen(new RepoSearchScreen());
		})
		
		
		$("#appMenuRepoCreate").attr("href", "#"+RepoCreateScreen.prototype.displayName);
		$("#appMenuRepoCreate").click(function(event){
			event.preventDefault();
			ScreenManager.changeScreen(new RepoCreateScreen());
		});
		
		$("#appMenuFileManager").attr("href", "#"+FileManagerScreen.prototype.displayName);
		$("#appMenuFileManager").click(function(event){
			event.preventDefault();
			ScreenManager.changeScreen(new FileManagerScreen());
		});
		
		$("#appMenuFrameworks").attr("href", "#"+CompetencySearchScreen.prototype.displayName);
		$("#appMenuFrameworks").click(function(event){
			event.preventDefault();
			ScreenManager.changeScreen(new FrameworkSearchScreen());
		});
		
		$("#appMenuFrameworkSearch").attr("href", "#"+CompetencySearchScreen.prototype.displayName);
		$("#appMenuFrameworkSearch").click(function(event){
			event.preventDefault();
			ScreenManager.changeScreen(new FrameworkSearchScreen());
		});
		
		$("#appMenuFrameworkCreate").attr("href", "#"+CompetencyEditScreen.prototype.displayName);
		$("#appMenuFrameworkCreate").click(function(event){
			event.preventDefault();
			ScreenManager.changeScreen(new FrameworkEditScreen());
		});
		
		$("#appMenuCompetencies").attr("href", "#"+CompetencySearchScreen.prototype.displayName);
		$("#appMenuCompetencies").click(function(event){
			event.preventDefault();
			ScreenManager.changeScreen(new CompetencySearchScreen());
		});
		
		$("#appMenuCompetencySearch").attr("href", "#"+CompetencySearchScreen.prototype.displayName);
		$("#appMenuCompetencySearch").click(function(event){
			event.preventDefault();
			ScreenManager.changeScreen(new CompetencySearchScreen());
		});
		
		$("#appMenuCompetencyCreate").attr("href", "#"+CompetencyEditScreen.prototype.displayName);
		$("#appMenuCompetencyCreate").click(function(event){
			event.preventDefault();
			ScreenManager.changeScreen(new CompetencyEditScreen());
		});
		
		$("#appMenuCompetencyImport").click(function(event){
			event.preventDefault();
			ModalManager.showModal(new ImportCompetenciesModal());
		})
		
		
		$("#appMenuRelationshipSearch").attr("href", "#"+RelationshipSearchScreen.prototype.displayName);
		$("#appMenuRelationshipSearch").click(function(event){
			event.preventDefault();
			ScreenManager.changeScreen(new RelationshipSearchScreen());
		});
		
		$("#appMenuRelationshipCreate").attr("href", "#"+RelationshipEditScreen.prototype.displayName);
		$("#appMenuRelationshipCreate").click(function(event){
			event.preventDefault();
			ScreenManager.changeScreen(new RelationshipEditScreen());
		});
		
		
		$("#appMenuProfile").attr("href", "#"+AssertionSearchScreen.prototype.displayName);
		$("#appMenuProfile").click(function(event){
			event.preventDefault();
			ScreenManager.changeScreen(new AssertionSearchScreen());
		});
		
		$("#appMenuAssertionSearch").attr("href", "#"+AssertionSearchScreen.prototype.displayName);
		$("#appMenuAssertionSearch").click(function(event){
			event.preventDefault();
			ScreenManager.changeScreen(new AssertionSearchScreen());
		});
		
		$("#appMenuAssertionCreate").attr("href", "#"+AssertionEditScreen.prototype.displayName);
		$("#appMenuAssertionCreate").click(function(event){
			event.preventDefault();
			ScreenManager.changeScreen(new AssertionEditScreen());
		});
		
		if(Foundation.MediaQuery.atLeast("medium"))
		{
			$("#appMenuMain").removeClass("vertical");
			$("#appMenuPublic").removeClass("vertical");
			$("#appMenuUserInfo").removeClass("vertical");
			$("#appMenuUserInfo").addClass("align-right");
			$("#appMenuUserIdentitySubMenu").removeClass("hide");
			buildIdentityList();
		}
			
		
		$(window).on('changed.zf.mediaquery', function(event, name) {
			if(name == "small")
			{
				$("#appMenuMain").addClass("vertical");
				$("#appMenuPublic").addClass("vertical");
				$("#appMenuUserInfo").addClass("vertical");
				$("#appMenuUserInfo").removeClass("align-right");
				$("#appMenuUserIdentitySubMenu").addClass("hide");
				
			}
			else
			{
				$("#appMenuMain").removeClass("vertical");
				$("#appMenuPublic").removeClass("vertical");
				$("#appMenuUserInfo").removeClass("vertical");
				$("#appMenuUserInfo").addClass("align-right");
				$("#appMenuUserIdentitySubMenu").removeClass("hide");
				buildIdentityList();
			}
		});
			
	}
	
	AppMenu.prototype.rebuildIdentityList = function(){
		buildIdentityList();
	}
	
	AppMenu.prototype.setCurrentServer = function(){
		$("#appMenuIdentityServer").text(AppController.serverController.selectedServerName);
		$("#appMenuIdentityServer").attr('title', AppController.serverController.selectedServerUrl);
		$("#currentServer").html(AppController.serverController.selectedServerName);
		$("#currentServer").attr('title', AppController.serverController.selectedServerUrl);
	}
	
	AppMenu.prototype.setLoggedIn = function(){
		$("#appMenuPublic").addClass("hide");
		$("#appMenuUserInfo").removeClass("hide");
		
		if( AppController.loginController.getAdmin() )
		{
			$("#appMenuAdmin").removeClass("hide");
		}else{
			$("#appMenuAdmin").addClass("hide");
		}
		
		this.setCurrentServer();
		buildIdentityList();
	}
	
	AppMenu.prototype.setLoggedOut = function(){
		$("#appMenuPublic").removeClass("hide");
		$("#appMenuUserInfo").addClass("hide");
	}
	
	AppMenu.prototype.checkAdmin = function(){
		if( AppController.loginController.getAdmin() )
		{
			$("#appMenuAdmin").removeClass("hide");
		}else{
			$("#appMenuAdmin").addClass("hide");
		}
	}
	
	return AppMenu;
})(AppMenu);