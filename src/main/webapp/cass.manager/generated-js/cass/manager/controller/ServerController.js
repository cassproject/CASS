/**
 *  Manages the server that the search controller (through EcRepository) and
 *  the identity controller (through EcIdentityManager) communicate with.
 *  Allows the user to change the server that the UI is talking with via the change server modal.
 * 
 *  @author devlin.junker@eduworks.com
 *  @module cass.manager
 *  @class ServerController
 *  @constructor
 */
var ServerController = /**
 *  On Startup:
 *  1) See if repo on this server, if so add the server given and the found server to the list
 *  2) Determine storage system to load/save list of other servers
 *  3) Switch to a previously selected server if the UI has been used before on this browser
 *  4) Set interfaces to point at endpoint
 * 
 *  @param {String} defaultServer
 *                  Base URL of the service end points on the server
 *  @param {String} defaultServerName
 *                  Name of the Default Server (displayed to the user when selecting servers)
 *  @constructor
 */
function(storageSystem, defaultServer, defaultServerName) {
    this.storageSystem = storageSystem;
    if (storageSystem == null) 
        this.storageSystem = new StorageController();
    this.serverList = {};
    this.repoInterface = new EcRepository();
    var me = this;
    var r = new EcRepository();
    r.autoDetectRepositoryAsync(function() {
        me.addServer("This Server (" + window.location.host + ")", r.selectedServer, null, null);
    }, function(o) {});
    var cachedList = storageSystem.getStoredValue("cass.server.list");
    if (cachedList != null) {
        cachedList = JSON.parse(cachedList);
        for (var serverName in (cachedList)) {
            this.addServer(serverName, (cachedList)[serverName], null, null);
        }
    }
    this.addServer(defaultServerName, defaultServer, null, null);
    var cachedSelected = storageSystem.getStoredValue("cass.server.selected");
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
    storageSystem.setStoredValue("cass.server.selected", this.selectedServerName);
    if (this.serverList[this.selectedServerName] == null) 
        this.addServer(this.selectedServerName, this.selectedServerUrl, null, null);
    EcRepository.caching = true;
    this.repoInterface.selectedServer = this.selectedServerUrl;
};
ServerController = stjs.extend(ServerController, null, [], function(constructor, prototype) {
    prototype.serverList = null;
    prototype.storageSystem = null;
    prototype.selectedServerUrl = null;
    prototype.selectedServerName = null;
    prototype.repoInterface = null;
    /**
     *  Adds a server to this list of servers that can be selected from the change server modal
     * 
     *  @param {String}            name
     *                             Name of the server to be displayed in the list
     *  @param {String}            url
     *                             URL of the server that corresponds to the name
     *  @param {Callback0}         success
     *                             Callback when the server is successfully added to the list
     *  @param {Callback1<String>} failure
     *                             Callback for any errors during adding to the list
     *  @method addServer
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
        this.storageSystem.setStoredValue("cass.server.list", JSON.stringify(this.serverList));
        if (success != null) 
            success();
    };
    /**
     *  Sets the server that the UI will communicate with, changes where the EcRepository and
     *  EcRemoteIdentity Manager are pointing to and communicating with
     * 
     *  @param {String}            identifier
     *                             Name of the server that was selected from the list, used to find URL to point at
     *  @param {Callback0}         success
     *                             Callback when successfully change where the components are pointing and set the
     *                             selected server values
     *  @param {Callback1<String>} failure
     *                             Callback if any errors occur during changing where the components are pointing
     *  @method selectServer
     */
    prototype.selectServer = function(identifier, success, failure) {
        var that = this;
        var oldServer = this.selectedServerUrl;
        var oldServerName = this.selectedServerName;
        for (var serverName in this.serverList) {
            if (identifier.equals(serverName) || identifier.equals(this.serverList[serverName])) {
                this.selectedServerName = serverName;
                this.selectedServerUrl = this.serverList[serverName];
                if (this.repoInterface != null) 
                    this.repoInterface.selectedServer = this.selectedServerUrl;
                this.repoInterface.autoDetectRepositoryAsync(function() {
                    that.storageSystem.setStoredValue("cass.server.selected", that.selectedServerName);
                    that.checkForAdmin(success);
                }, function(error) {
                    if (that.repoInterface != null) 
                        that.repoInterface.selectedServer = oldServer;
                    that.selectedServerUrl = oldServer;
                    that.selectedServerName = oldServerName;
                    if (failure != null) 
                        failure(error);
                });
            }
        }
    };
    prototype.admin = false;
    /**
     *  Setter for boolean flag of whether or not the current user is admin
     * 
     *  @param val true = admin, false = not admin
     *  @method setAdmin
     */
    prototype.setAdmin = function(val) {
        this.admin = val;
    };
    /**
     *  Getter for boolean flag of whether or not current user is admin
     * 
     *  @return {boolean}
     *  true = admin, false = not admin
     *  @method getAdmin
     */
    prototype.getAdmin = function() {
        return this.admin;
    };
    prototype.checkForAdmin = function(success) {
        var me = this;
        me.repoInterface.fetchServerAdminKeys(function(keys) {
            me.setAdmin(false);
            for (var i = 0; i < EcIdentityManager.ids.length; i++) {
                if (keys.indexOf(EcIdentityManager.ids[i].ppk.toPk().toPem()) != -1) {
                    me.setAdmin(true);
                    break;
                }
            }
            if (success != null) 
                success();
        }, function(p1) {
            me.setAdmin(false);
            if (success != null) 
                success();
        });
    };
    /**
     *  Used to retrieve the interface to the repository we are currently pointed at
     * 
     *  @return {EcRepository}
     *  Repository Interface to call search/get/delete methods on
     *  @method getRepoInterface
     */
    prototype.getRepoInterface = function() {
        return this.repoInterface;
    };
    /**
     *  Used during setup to set which EcRepository the server controller manages
     * 
     *  @param {EcRepository} repoInterface
     *                        The interface to the repository to be used by the search controller
     *  @method setRepoInterface
     */
    prototype.setRepoInterface = function(repoInterface) {
        this.repoInterface = repoInterface;
        repoInterface.selectedServer = this.selectedServerUrl;
    };
}, {serverList: {name: "Map", arguments: [null, null]}, storageSystem: "StorageController", repoInterface: "EcRepository"}, {});
