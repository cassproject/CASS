/**
 *  Logs into and stores/retrieves credentials from a compatible remote server.
 *  Performs complete anonymization of the user.
 *  
 *  Requires initialization with application specific salts. Application specific
 *  salts prevent co-occurrence attacks, should credentials in one application be
 *  compromised (intercepted in transit).
 *  
 *  Transmits hashed username, hashed password, and encrypts credentials using
 *  the hashed combination of the username and password. This prevents the system
 *  storing the credentials from having any knowledge of the user.
 *  
 *  Password recovery is done through, when the password changes, creating a
 *  cryptographic pad (or perfect cipher) where one half is stored on the server,
 *  and the other half is stored with the user. Should the user lose this pad and
 *  forget their password, they are not able to recover or reset their password,
 *  and their data should be considered lost.
 *  
 *  @author fritz.ray@eduworks.com
 */
var EcRemoteIdentityManager = function() {};
EcRemoteIdentityManager = stjs.extend(EcRemoteIdentityManager, null, [], function(constructor, prototype) {
    prototype.usernameSalt = null;
    prototype.usernameIterations = 0;
    prototype.usernameWidth = 0;
    prototype.passwordSalt = null;
    prototype.passwordIterations = 0;
    prototype.passwordWidth = 0;
    prototype.secretSalt = null;
    prototype.secretIterations = 0;
    prototype.configured = false;
    prototype.selectedServer = null;
    prototype.usernameWithSalt = null;
    prototype.passwordWithSalt = null;
    prototype.secretWithSalt = null;
    prototype.pad = null;
    prototype.token = null;
    /**
     *  Configure parameters of the remote login storage.
     *  
     *  @param usernameSalt
     *             Salt used in hashing the username.
     *  @param usernameIterations
     *             Number of times to hash the username.
     *  @param usernameWidth
     *             Resultant width of username in bytes.
     *  @param passwordSalt
     *             Salt used to hash password.
     *  @param passwordIterations
     *             Number of times to hash password.
     *  @param passwordWidth
     *             Resultant width of password in bytes.
     *  @param secretSalt
     *             Salt used to hash secret (composed of username + password)
     *  @param secretIterations
     *             Number of times to hash secret.
     */
    prototype.configure = function(usernameSalt, usernameIterations, usernameWidth, passwordSalt, passwordIterations, passwordWidth, secretSalt, secretIterations) {
        this.usernameSalt = usernameSalt;
        this.usernameIterations = usernameIterations;
        this.usernameWidth = usernameWidth;
        this.passwordSalt = passwordSalt;
        this.passwordIterations = passwordIterations;
        this.passwordWidth = passwordWidth;
        this.secretSalt = secretSalt;
        this.secretIterations = secretIterations;
        this.configured = true;
    };
    /**
     *  Wipes login data.
     */
    prototype.clear = function() {
        this.usernameWithSalt = null;
        this.passwordWithSalt = null;
        this.secretWithSalt = null;
        this.pad = null;
        this.token = null;
    };
    /**
     *  Configure compatible remote identity management server.
     *  
     *  @param server
     *             URL to remote identity management server.
     */
    prototype.setIdentityManagementServer = function(server) {
        this.selectedServer = server;
    };
    /**
     *  "Log Into" system, generating credentials. Does not actually remotely
     *  access any machine.
     *  
     *  Please clear username and password fields after this function is called.
     *  
     *  @param username
     *             Username
     *  @param password
     *             Password
     */
    prototype.login = function(username, password) {
        if (!this.configured) 
            alert("Remote Identity not configured.");
        this.usernameWithSalt = forge.util.encode64(forge.pkcs5.pbkdf2(username, this.usernameSalt, this.usernameIterations, this.usernameWidth));
        this.passwordWithSalt = forge.util.encode64(forge.pkcs5.pbkdf2(password, this.passwordSalt, this.passwordIterations, this.passwordWidth));
        var arys = new Array();
        arys.push(username, password);
        var secret = this.splicePasswords(arys);
        this.secretWithSalt = forge.util.encode64(forge.pkcs5.pbkdf2(secret, this.secretSalt, this.secretIterations, 32));
    };
    /**
     *  Fetch credentials from server, invoking events based on login success or
     *  failure.
     *  
     *  Automatically populates EcIdentityManager.
     *  
     *  Requires login().
     *  
     *  @param success
     *  @param failure
     */
    prototype.fetch = function(success, failure) {
        if (!this.configured) 
            alert("Remote Identity not configured.");
        if (this.usernameWithSalt == null || this.passwordWithSalt == null || this.secretWithSalt == null) {
            alert("Please log in before performing this operation.");
            return;
        }
        var r = new EbacCredentialRequest();
        r.username = this.usernameWithSalt;
        r.password = this.passwordWithSalt;
        var fd = new FormData();
        fd.append("credentialRequest", r.toJson());
        var me = this;
        EcRemote.postExpectingObject(this.selectedServer, "sky/id/login", fd, function(arg0) {
            var cs = arg0;
            me.pad = cs.pad;
            me.token = cs.token;
            for (var i = 0; i < cs.credentials.length; i++) {
                var c = cs.credentials[i];
                var identity = EcIdentity.fromCredential(c, me.secretWithSalt, me.selectedServer);
                EcIdentityManager.addIdentity(identity);
            }
            success(arg0);
        }, function(arg0) {
            failure(arg0);
        });
    };
    /**
     *  Commits credentials in EcIdentityManager to remote server.
     *  
     *  Will trigger pad generation and fail if the pad has not been specified.
     *  
     *  @param success
     *  @param failure
     *  @param padGenerationCallback
     */
    prototype.commit = function(success, failure, padGenerationCallback) {
        var service = "sky/id/commit";
        this.sendCredentials(success, failure, padGenerationCallback, service);
    };
    /**
     *  Creates an account.
     *  
     *  Please note that the remote login server does not throw error messages if
     *  an account creation is blocked due to being a duplicate. This prevents
     *  login probing. This will always succeed (if the request is properly
     *  formed and makes it to the server).
     *  
     *  Will trigger pad generation and fail if the pad has not been specified.
     *  
     *  @param success
     *  @param failure
     *  @param padGenerationCallback
     */
    prototype.create = function(success, failure, padGenerationCallback) {
        var service = "sky/id/create";
        this.sendCredentials(success, failure, padGenerationCallback, service);
    };
    prototype.sendCredentials = function(success, failure, padGenerationCallback, service) {
        if (!this.configured) 
            alert("Remote Identity not configured.");
        if (this.usernameWithSalt == null || this.passwordWithSalt == null || this.secretWithSalt == null) {
            alert("Please log in before performing this operation.");
            return;
        }
        var credentials = new Array();
        if (this.pad == null) 
            this.pad = padGenerationCallback.callback();
        for (var i = 0; i < EcIdentityManager.ids.length; i++) {
            var id = EcIdentityManager.ids[i];
            credentials.push(id.toCredential(this.secretWithSalt));
        }
        var commit = new EbacCredentialCommit();
        commit.username = this.usernameWithSalt;
        commit.password = this.passwordWithSalt;
        commit.token = this.token;
        commit.credentials.pad = this.pad;
        commit.credentials.credentials = credentials;
        var fd = new FormData();
        fd.append("credentialCommit", commit.toJson());
        EcRemote.postExpectingString(this.selectedServer, service, fd, function(arg0) {
            success(arg0);
        }, function(arg0) {
            failure(arg0);
        });
    };
    /**
     *  Splices together passwords (in a fashion more like shuffling a deck of
     *  cards, not appending).
     *  
     *  @param passwords
     *             Passwords to splice.
     *  @return Spliced password.
     */
    prototype.splicePasswords = function(passwords) {
        var passwordSplice = "";
        for (var charIndex = 0; charIndex > 0; charIndex++) {
            var foundAny = false;
            for (var passwordIndex = 0; passwordIndex < passwords.length; passwordIndex++) {
                if (charIndex >= passwords[passwordIndex].length) 
                    continue;
                passwordSplice += passwords[passwordIndex].charAt(charIndex);
                foundAny = true;
            }
            if (!foundAny) 
                break;
        }
        return passwordSplice;
    };
}, {}, {});
