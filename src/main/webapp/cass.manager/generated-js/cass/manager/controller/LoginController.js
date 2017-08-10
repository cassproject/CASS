/**
 *  Manages the current user's logged in state and interfaces with the server to
 *  sign in/out and create users
 * 
 *  @author devlin.junker@eduworks.com
 *  @module cass.manager
 *  @class LoginController
 *  @constructor
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
    prototype.storageSystem = null;
    /**
     *  Setter for the boolean flag of whether or not a user is loged in
     * 
     *  @param {boolean} val
     *                   true if signed in, false if logged out
     *  @method setLoggedIn
     *  @static
     */
    prototype.setLoggedIn = function(val) {
        this.loggedIn = val;
        if (this.storageSystem != null) 
            this.storageSystem.setStoredValue("cass.login", val);
    };
    /**
     *  Getter for boolean flag of whether or not user is logged in
     * 
     *  @return {boolean}
     *  true if signed in, false if logged out
     *  @method getLoggedin
     *  @static
     */
    prototype.getLoggedIn = function() {
        return this.loggedIn;
    };
    /**
     *  If the last time the user was using the application, they were signed in this
     *  returns true (used to remind them to sign in again once they return)
     * 
     *  @return {boolean}
     *  true if previously signed in, false if not signed in last time, or user is here for
     *  the first time from this computer
     *  @method getPreviouslyLoggedIn
     *  @static
     */
    prototype.getPreviouslyLoggedIn = function() {
        return this.refreshLoggedIn;
    };
    prototype.hello = function(network, success, failure) {
        var identityManager = this.identity;
        var me = this;
        this.loginServer = new OAuth2FileBasedRemoteIdentityManager(function() {
            me.loginServer.setDefaultIdentityManagementServer(network);
            me.loginServer.startLogin(null, null);
            me.loginServer.fetch(function(p1) {
                EcIdentityManager.readContacts();
                EcRepository.cache = new Object();
                me.setLoggedIn(true);
                if (EcIdentityManager.ids.length > 0) {
                    identityManager.select(EcIdentityManager.ids[0].ppk.toPem());
                }
                success();
            }, function(p1) {
                failure(p1);
            });
        });
    };
    /**
     *  Validates a username and password on the server and then parses the user's credentials and
     *  checks if they have an admin key. Also tells the identity manager to check for contacts in
     *  local storage after signed in.
     * 
     *  @param {String} username
     *                  username of the user signing in
     *  @param {String} password
     *                  password of the user signing in
     *  @param {String} success
     *                  callback on successful login
     *  @param {String} failure
     *                  callback on error during login
     *  @method login
     */
    prototype.login = function(username, password, server, success, failure) {
        var identityManager = this.identity;
        var that = this;
        this.loginServer = new EcRemoteIdentityManager();
        this.loginServer.setDefaultIdentityManagementServer(server);
        this.loginServer.configureFromServer(function(o) {
            that.loginServer.startLogin(username, password);
            that.loginServer.fetch(function(p1) {
                EcIdentityManager.readContacts();
                EcRepository.cache = new Object();
                that.setLoggedIn(true);
                if (EcIdentityManager.ids.length > 0) {
                    identityManager.select(EcIdentityManager.ids[0].ppk.toPem());
                }
                success();
            }, function(p1) {
                failure(p1);
            });
        }, failure);
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
    };
    /**
     *  Creates a new user and saves the account details on the login server, then signs in
     *  to the new account on successful creation
     * 
     *  @param {String}            username
     *                             username of the new account
     *  @param {String}            password
     *                             password of the new account
     *  @param {Callback0}         success
     *                             callback for successful creation and sign in
     *  @param {Callback1<String>} failure
     *                             callback for error during creation
     *  @method create
     */
    prototype.create = function(username, password, server, success, failure) {
        this.loginServer.startLogin(username, password);
        var me = this;
        this.loginServer.create(function(p1) {
            me.login(username, password, server, success, failure);
        }, function(p1) {
            failure(p1);
        }, function() {
            return "";
        });
    };
    /**
     *  Saves the users credentials and contacts to the server
     * 
     *  @param {Callback0}         success
     *                             callback for successful save
     *  @param {Callback1<String>} failure
     *                             callback for error during save
     *  @method save
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
}, {loginServer: "RemoteIdentityManagerInterface", identity: "IdentityController", storageSystem: "StorageController"}, {});
