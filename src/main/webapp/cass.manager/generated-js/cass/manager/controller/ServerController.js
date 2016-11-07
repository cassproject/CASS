/**
 *  Manages the server that the search controller (through EcRepository) and
 *  the identity controller (through EcIdentityManager) communicate with. 
 *  Allows the user to change the server that the UI is talking with via the change server modal.
 *  
 *  @author devlin.junker@eduworks.com
 *  @class ServerController
 *  @constructor
 */
var ServerController = /**
 *  On Startup, a default server is set when the server controller is created. Also the
 *  storage system is determined to load/save the list of servers that we are aware of
 *  and switch to a previously selected server if the UI has been used before on this browser
 *  
 *  @constructor
 *  @param {String} defaultServer
 *  			Base URL of the service end points on the server
 *  @param {String} defaultServerName
 *  			Name of the Default Server (displayed to the user when selecting servers)
 */
function(defaultServer, defaultServerName) {
    this.serverList = {};
    if (localStorage != null) 
        this.storageSystem = localStorage;
     else if (sessionStorage != null) 
        this.storageSystem = sessionStorage;
    var cachedList = this.storageSystem["cass.server.list"];
    if (cachedList != null) {
        cachedList = JSON.parse(cachedList);
        for (var serverName in (cachedList)) {
            this.addServer(serverName, (cachedList)[serverName], null, null);
        }
    }
    var cachedSelected = this.storageSystem["cass.server.selected"];
    if (cachedSelected != null && this.serverList[cachedSelected] != null) {
        this.selectedServerName = cachedSelected;
        this.selectedServerUrl = this.serverList[this.selectedServerName];
    } else if (defaultServer != null) {
        this.selectedServerUrl = defaultServer;
        if (defaultServerName != null) {
            this.selectedServerName = defaultServerName;
        } else {
            this.selectedServerName = "Default";
        }
    } else {
        this.selectedServerUrl = "http://localhost:9200/api/custom/";
        this.selectedServerName = "Default (Localhost)";
        console.warn("Default Server Not Given, Set to LocalHost");
    }
    this.storageSystem["cass.server.selected"] = this.selectedServerName;
    if (this.serverList[this.selectedServerName] == null) 
        this.addServer(this.selectedServerName, this.selectedServerUrl, null, null);
};
ServerController = stjs.extend(ServerController, null, [], function(constructor, prototype) {
    prototype.serverList = null;
    prototype.selectedServerUrl = null;
    prototype.selectedServerName = null;
    prototype.storageSystem = null;
    /**
     *  Adds a server to this list of servers that can be selected from the change server modal
     *  
     *  @method addServer
     *  @param {String} name
     *  			Name of the server to be displayed in the list
     *  @param {String} url
     *  			URL of the server that corresponds to the name
     *  @param {Callback0} success
     *  			Callback when the server is successfully added to the list
     *  @param {Callback1<String>} failure
     *  			Callback for any errors during adding to the list
     */
    prototype.addServer = function(name, url, success, failure) {
        if (name == null) {
            if (failure != null) 
                failure("Cannot Add Server without a name");
            return;
        }
        if (url == null) {
            if (failure != null) 
                failure("Cannot Add Server with blank url");
            return;
        }
        this.serverList[name] = url;
        this.storageSystem["cass.server.list"] = JSON.stringify(this.serverList);
        if (success != null) 
            success();
    };
    /**
     *  Sets the server that the UI will communicate with, changes where the EcRepository and 
     *  EcRemoteIdentity Manager are pointing to and communicating with
     *  
     *  @method selectServer
     *  @param {String} identifier
     *  			Name of the server that was selected from the list, used to find URL to point at
     *  @param {Callback0} success
     *  			Callback when successfully change where the components are pointing and set the
     *  			selected server values
     *  @param {Callback1<String>} failure
     *  			Callback if any errors occur during changing where the components are pointing
     */
    prototype.selectServer = function(identifier, success, failure) {
        if (LoginController.getLoggedIn()) {
            LoginController.setLoggedIn(false);
        }
        var that = this;
        var oldServer = this.selectedServerUrl;
        var oldServerName = this.selectedServerName;
        for (var serverName in this.serverList) {
            if (identifier.equals(serverName) || identifier.equals(this.serverList[serverName])) {
                this.selectedServerName = serverName;
                this.selectedServerUrl = this.serverList[serverName];
                if (this.repoInterface != null) 
                    this.repoInterface.selectedServer = this.selectedServerUrl;
                if (this.remoteIdentityManager != null) 
                    this.remoteIdentityManager.setDefaultIdentityManagementServer(this.selectedServerUrl);
                this.remoteIdentityManager.configureFromServer(function(p1) {
                    that.storageSystem["cass.server.selected"] = that.selectedServerName;
                    if (success != null) 
                        success();
                }, function(p1) {
                    if (that.repoInterface != null) 
                        that.repoInterface.selectedServer = oldServer;
                    if (that.remoteIdentityManager != null) 
                        that.remoteIdentityManager.setDefaultIdentityManagementServer(oldServer);
                    that.selectedServerUrl = oldServer;
                    that.selectedServerName = oldServerName;
                    that.remoteIdentityManager.configureFromServer(null, null);
                    if (failure != null) 
                        failure(p1);
                });
                return;
            }
        }
        if (failure != null) 
            failure("Unable to select server requested: " + identifier);
    };
    prototype.repoInterface = null;
    prototype.remoteIdentityManager = null;
    /**
     *  Used during setup to set which EcRepository the server controller manages
     *  
     *  @method setRepoInterface
     *  @param {EcRepository} repoInterface
     *  			The interface to the repository to be used by the search controller
     */
    prototype.setRepoInterface = function(repoInterface) {
        this.repoInterface = repoInterface;
        repoInterface.selectedServer = this.selectedServerUrl;
    };
    /**
     *  Used during setup to set which EcRemoteIdentityManager the server controller manages
     *  
     *  @method setRemoteIdentityManager
     *  @param {EcRemoteIdentityManager} loginServer
     *  			The interface to the server for managing identities and logging in with
     *  			the identity controller and login controller
     */
    prototype.setRemoteIdentityManager = function(loginServer) {
        this.remoteIdentityManager = loginServer;
        this.remoteIdentityManager.setDefaultIdentityManagementServer(this.selectedServerUrl);
    };
}, {serverList: {name: "Map", arguments: [null, null]}, storageSystem: "Storage", repoInterface: "EcRepository", remoteIdentityManager: "EcRemoteIdentityManager"}, {});
