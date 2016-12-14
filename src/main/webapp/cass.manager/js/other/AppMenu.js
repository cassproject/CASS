/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
/**
 * View that controls the menu at the top of the CASS Manager
 * app. Controls the loggedIn/loggedOut status of the menu and
 * handles what happens when clicking on menu items.
 * 
 * @class AppMenu
 * @author devlin.junker@eduworks.com
 */
var AppMenu = (function(AppMenu){
	
	/**
	 * Handles selecting the current identity that the user wants
	 * to act as. This connects to the IdentityController and selects 
	 * the identity then changes the menu to show the selected identity.
	 * 
	 * @memberOf AppMenu
	 * @method selectKey
	 * @private
	 * @param {String} ppk 
	 * 			PEM representation of PPK
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
	
	/**
	 * Deselects the users identity, so the user is acting as public and not
	 * under a specific key identity. Changes the menu to match.
	 * 
	 * @memberOf AppMenu
	 * @method deselectKey
	 * @private
	 */
	function deselectKey(){
		$("#appMenuIdentityList").find(".fake-a").removeClass("selected");
	    $("#appMenuIdentityList").find("[title='"+PUBLIC_TITLE+"']").addClass("selected");
	    
	    AppController.identityController.unselect();
	    
	    ScreenManager.replaceScreen(ScreenManager.getCurrentScreen());
	    
	    $("#appMenuUserIdentity").children().first().text(PUBLIC_NAME+" (Logged In)");
	}
	
	/**
	 * Builds the list of possible key-based identities of the
	 * currently logged in user in the menu for selecting/deselecting 
	 * 
	 * @memberOf AppMenu
	 * @method buildIdentityList
	 * @private
	 */
	function buildIdentityList(){
		var identities = EcIdentityManager.ids;
		
	    $("#appMenuIdentityList").html("");
        var identitySelected = false;
	    for (var index in identities)
	    {
	    	var ppk = identities[index].ppk.toPem().replaceAll("\r?\n","");
	        var name = identities[index].displayName;
	        
	        var container = $("<li></li>");
	        var element = $("<div class='fake-a'></div>");
	        
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
	
	/**
	 * Function to pass to the callback parameter of the login modal,
	 * to be called when the user has successfully logged in.
	 * 
	 * @memberOf AppMenu
	 * @method loginModalCallback
	 * @private
	 */
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
	 * Overridden display function, called once html partial is loaded into DOM
	 * 
	 * @memberOf AppMenu
	 * @method display
	 * @param {String} containerId
	 * 			DOM ID for the element containing this menu
	 */
	AppMenu.prototype.display = function(containerId)
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
			
			AppController.loginController.logout();
			AppMenu.prototype.setLoggedOut();
			ScreenManager.changeScreen(new WelcomeScreen());
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
	
	
	/**
	 * Public method to rebuild the list of user identities, this is useful if
	 * an identity has been added or renamed so the proper identity
	 * names will be displayed.
	 * 
	 * @memberOf AppMenu
	 * @method rebuildIdentityList
	 */
	AppMenu.prototype.rebuildIdentityList = function(){
		buildIdentityList();
	}
	
	/**
	 * Rebuilds the current server display based on the server controllers values
	 * 
	 * @memberOf AppMenu
	 * @method setCurrentServer
	 */
	AppMenu.prototype.setCurrentServer = function(){
		$("#appMenuIdentityServer").text(AppController.serverController.selectedServerName);
		$("#appMenuIdentityServer").attr('title', AppController.serverController.selectedServerUrl);
		$("#currentServer").html(AppController.serverController.selectedServerName);
		$("#currentServer").attr('title', AppController.serverController.selectedServerUrl);
	}
	
	/**
	 * Sets the menu to the logged in state, showing the identities of the user and the
	 * identity screen link
	 * 
	 * @memberOf AppMenu
	 * @method setLoggedIn
	 */
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
	
	/**
	 * Sets the menu to the logged out state, shows that the user is public and can
	 * login or create an account
	 * 
	 * @memberOf AppMenu
	 * @method setLoggedOut
	 */
	AppMenu.prototype.setLoggedOut = function(){
		$("#appMenuPublic").removeClass("hide");
		$("#appMenuUserInfo").addClass("hide");
	}
	
	/**
	 * Checks the login controller to see if the user is admin, and if so sets the
	 * admin menu visible
	 * 
	 * @memberOf AppMenu
	 * @method checkAdmin
	 */
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