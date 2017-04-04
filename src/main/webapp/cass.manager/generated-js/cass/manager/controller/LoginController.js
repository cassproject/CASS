/**
 *  Manages the current user's logged in state and interfaces with the server to 
 *  sign in/out and create users
 *  
 *  @module cass.manager
 *  @class LoginController
 *  @constructor
 *  
 *  @author devlin.junker@eduworks.com
 */
var LoginController = /**
 *  On startup, check if the last time the user was on the page, whether or not they were signed in
 */
function(storage) {
    this.storageSystem = storage;
    this.refreshLoggedIn = this.storageSystem.getStoredValue("cass.login") == "true" ? true : false;
};
LoginController = stjs.extend(LoginController, null, [], function(constructor, prototype) {
    prototype.loginServer = null;
    prototype.identity = null;
    prototype.refreshLoggedIn = false;
    prototype.loggedIn = false;
    prototype.admin = false;
    prototype.storageSystem = null;
    /**
     *  Setter for the boolean flag of whether or not a user is loged in
     *  
     *  @method setLoggedIn
     *  @static
     *  @param {boolean} val 
     *  			true if signed in, false if logged out
     */
    prototype.setLoggedIn = function(val) {
        this.loggedIn = val;
        if (this.storageSystem != null) 
            this.storageSystem.setStoredValue("cass.login", val);
    };
    /**
     *  Getter for boolean flag of whether or not user is logged in
     *  
     *  @method getLoggedin
     *  @static
     *  @return {boolean} 
     *  			true if signed in, false if logged out
     */
    prototype.getLoggedIn = function() {
        return this.loggedIn;
    };
    /**
     *  Setter for boolean flag of whether or not the current user is admin
     *  
     *  @method setAdmin
     *  @param val 
     *  			true = admin, false = not admin
     */
    prototype.setAdmin = function(val) {
        this.admin = val;
    };
    /**
     *  Getter for boolean flag of whether or not current user is admin
     *  
     *  @method getAdmin
     *  @return {boolean}
     *  			true = admin, false = not admin
     */
    prototype.getAdmin = function() {
        return this.admin;
    };
    /**
     *  If the last time the user was using the application, they were signed in this
     *  returns true (used to remind them to sign in again once they return)
     *  
     *  @method getPreviouslyLoggedIn
     *  @static
     *  @return {boolean}
     *  		true if previously signed in, false if not signed in last time, or user is here for
     *  		the first time from this computer
     */
    prototype.getPreviouslyLoggedIn = function() {
        return this.refreshLoggedIn;
    };
    prototype.setLoginServer = function(loginServer) {
        this.loginServer = loginServer;
    };
    /**
     *  Validates a username and password on the server and then parses the user's credentials and
     *  checks if they have an admin key. Also tells the identity manager to check for contacts in
     *  local storage after signed in.
     *  
     *  @method login
     *  @param {String} username 
     *  			username of the user signing in
     *  @param {String} password
     *  			password of the user signing in
     *  @param {String} success 
     *  			callback on successful login
     *  @param {String} failure
     *  			callback on error during login
     */
    prototype.login = function(username, password, success, failure) {
        var identityManager = this.identity;
        var that = this;
        this.loginServer.startLogin(username, password);
        this.loginServer.fetch(function(p1) {
            EcIdentityManager.readContacts();
            EcRepository.cache = new Object();
            that.setLoggedIn(true);
            if (EcIdentityManager.ids.length > 0) {
                identityManager.select(EcIdentityManager.ids[0].ppk.toPem());
                that.loginServer.fetchServerAdminKeys(function(keys) {
                    for (var i = 0; i < EcIdentityManager.ids.length; i++) {
                        if (keys.indexOf(EcIdentityManager.ids[i].ppk.toPk().toPem()) != -1) {
                            that.setAdmin(true);
                            break;
                        }
                        that.setAdmin(false);
                    }
                    success();
                }, function(p1) {});
            } else {
                success();
            }
        }, function(p1) {
            failure(p1);
        });
    };
    /**
     *  Sets the flags so the user is logged out, wipes all sign in data so the user is no longer
     *  authenticated and is unidentified
     *  
     *  @method logout
     */
    prototype.logout = function() {
        this.loginServer.clear();
        this.identity.selectedIdentity = null;
        EcRepository.cache = new Object();
        this.setLoggedIn(false);
        EcIdentityManager.ids = new Array();
        EcIdentityManager.clearContacts();
        this.setAdmin(false);
    };
    /**
     *  Creates a new user and saves the account details on the login server, then signs in
     *  to the new account on successful creation
     *  
     *  @method create
     *  @param {String} username
     *  			username of the new account
     *  @param {String} password
     *  			password of the new account
     *  @param {Callback0} success
     *  			callback for successful creation and sign in 
     *  @param {Callback1<String>} failure
     *  			callback for error during creation
     */
    prototype.create = function(username, password, success, failure) {
        this.loginServer.startLogin(username, password);
        var me = this;
        this.loginServer.create(function(p1) {
            me.login(username, password, success, failure);
        }, function(p1) {
            failure(p1);
        }, function() {
            return "";
        });
    };
    /**
     *  Saves the users credentials and contacts to the server
     *  
     *  @method save
     *  @param {Callback0} success
     *  			callback for successful save
     *  @param {Callback1<String>} failure
     *  			callback for error during save
     */
    prototype.save = function(success, failure) {
        this.loginServer.commit(function(p1) {
            success();
        }, function(p1) {
            failure(p1);
        }, function() {
            return null;
        });
    };
}, {loginServer: "EcRemoteIdentityManager", identity: "IdentityController", storageSystem: "StorageController"}, {});
