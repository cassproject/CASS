/**
 *  Provides methods to request objects from the repository on the server
 *  
 *  @author devlin.junker@eduworks.com
 */
var RepositoryController = function() {};
RepositoryController = stjs.extend(RepositoryController, null, [], function(constructor, prototype) {
    prototype.repo = null;
    prototype.identity = null;
    /**
     *  Retrieves a file from the server and downloads it to the user's computer
     *  
     *  @param id
     *  			ID of the file to download
     *  @param failure
     *  			Callback if there is an error when retrieving the file
     */
    prototype.downloadFile = function(id, failure) {
        EcRepository.get(id, function(p1) {
            var f = new EcFile();
            if (p1.isA(EcEncryptedValue.myType)) {
                var encrypted = new EcEncryptedValue();
                encrypted.copyFrom(p1);
                p1 = encrypted.decryptIntoObject();
            }
            if (p1.isA(EcFile.myType)) {
                f.copyFrom(p1);
                f.download();
            }
        }, failure);
    };
    /**
     *  Upload's a file to the server, encrypts it first though. This will error if there is
     *  not a selected identity for a signed in user because it can't be encrypted
     *  
     *  @param name
     *  			Name of the file to be uploaded
     *  @param base64Data
     *  			Data for the file to be uploaded
     *  @param mimeType
     *  			MIME Type of the file to be uploaded
     *  @param success
     *  			Callback after the file has been encrypted and uploaded successfully
     *  @param failure
     *  			Callback if there is an error during the encryption or upload process
     */
    prototype.encryptAndUploadFile = function(name, base64Data, mimeType, success, failure) {
        if (this.identity.selectedIdentity == null) {
            failure("User not signed in or, no Identity selected");
            return;
        }
        var f = new EcFile();
        f.generateId(this.repo.selectedServer);
        f.data = base64Data;
        f.name = name;
        f.mimeType = mimeType;
        f.addOwner(this.identity.selectedIdentity.ppk.toPk());
        var encryptedValue = EcEncryptedValue.toEncryptedValue(f, false);
        EcRepository.save(encryptedValue, function(p1) {
            success();
        }, failure);
    };
    /**
     *  Upload's a file to the server without encrypting it. No owner is attached, so it will be a
     *  public file.
     *  
     *  @param name
     *  			Name of the file to be uploaded
     *  @param base64Data
     *  			Data for the file to be uploaded
     *  @param mimeType
     *  			MIME Type of the file to be uploaded
     *  @param success
     *  			Callback after the file has been encrypted and uploaded successfully
     *  @param failure
     *  			Callback if there is an error during the encryption or upload process
     */
    prototype.uploadFile = function(name, base64Data, mimeType, success, failure) {
        var f = new EcFile();
        f.data = base64Data;
        f.name = name;
        f.mimeType = mimeType;
        f.generateId(this.repo.selectedServer);
        EcRepository.save(f, function(p1) {
            success();
        }, failure);
    };
    /**
     *  Uploads a JSON Object String to the repository
     *  
     *  @param data
     *  			the JSON Object String to upload
     *  @param success
     *  			Callback for successful upload
     *  @param fail
     *  			Callback for error during upload
     */
    prototype.upload = function(data, success, fail) {
        var d = new EcRemoteLinkedData(null, null);
        d.copyFrom(JSON.parse(data));
        if (d.invalid()) {
            fail("Cannot save data. It is missing a vital component.");
        }
        EcRepository.save(d, success, fail);
    };
    /**
     *  Retrieve an object from the repository (unsure of type)
     *  @param id
     *  			ID of the object to retrieve from the repository
     *  @param success
     *  			Callback that returns the object after successfully retrieving it
     *  @param failure
     *  			Callback that returns any errors that occur during retrieval
     */
    prototype.view = function(id, success, failure) {
        EcRepository.get(id, success, failure);
    };
    /**
     *  Retrieve an object from the repository and check then cast it to a competency before returning it
     *  @param id
     *  			ID of the competency to retrieve from the repository
     *  @param success
     *  			Callback that returns the competency after successfully retrieving it
     *  @param failure
     *  			Callback that returns any errors that occur during retrieval
     */
    prototype.viewCompetency = function(id, success, failure) {
        EcRepository.get(id, function(p1) {
            var encrypted = new EcEncryptedValue();
            encrypted.copyFrom(p1);
            var competency = new EcCompetency();
            if (p1.isAny(competency.getTypes())) {
                competency.copyFrom(p1);
                success(competency);
            } else if (p1.isA(EcEncryptedValue.myType) && encrypted.isAnEncrypted(EcCompetency.myType)) {
                var decrypted = encrypted.decryptIntoObject();
                competency.copyFrom(decrypted);
                competency.privateEncrypted = true;
                success(competency);
            } else {
                failure("Retrieved object was not a competency");
            }
        }, failure);
    };
    /**
     *  Retrieve an object from the repository and check then cast it to a framework before returning it
     *  @param id
     *  			ID of the framework to retrieve from the repository
     *  @param success
     *  			Callback that returns the framework after successfully retrieving it
     *  @param failure
     *  			Callback that returns any errors that occur during retrieval
     */
    prototype.viewFramework = function(id, success, failure) {
        var me = this;
        EcRepository.get(id, function(p1) {
            var encrypted = new EcEncryptedValue();
            encrypted.copyFrom(p1);
            var framework = new EcFramework();
            if (p1.isAny(framework.getTypes())) {
                framework.copyFrom(p1);
                success(framework);
            } else if (p1.isA(EcEncryptedValue.myType) && encrypted.isAnEncrypted(EcFramework.myType)) {
                var decrypted = encrypted.decryptIntoObject();
                framework.copyFrom(decrypted);
                framework.privateEncrypted = true;
                success(framework);
            } else {
                failure("Retrieved object was not a framework");
            }
        }, failure);
    };
    /**
     *  Retrieve an object from the repository and check then cast it to a relation before returning it
     *  @param id
     *  			ID of the relation to retrieve from the repository
     *  @param success
     *  			Callback that returns the relation after successfully retrieving it
     *  @param failure
     *  			Callback that returns any errors that occur during retrieval
     */
    prototype.viewRelation = function(id, success, failure) {
        EcRepository.get(id, function(p1) {
            var encrypted = new EcEncryptedValue();
            encrypted.copyFrom(p1);
            var alignment = new EcAlignment();
            if (p1.isAny(alignment.getTypes())) {
                alignment.copyFrom(p1);
                success(alignment);
            } else if (p1.isA(EcEncryptedValue.myType) && encrypted.isAnEncrypted(EcAlignment.myType)) {
                var decrypted = encrypted.decryptIntoObject();
                alignment.copyFrom(decrypted);
                alignment.privateEncrypted = true;
                success(alignment);
            } else {
                failure("Retrieved object was not a relation");
            }
        }, failure);
    };
    /**
     *  Retrieve an object from the repository and check then cast it to a level before returning it
     *  @param id
     *  			ID of the level to retrieve from the repository
     *  @param success
     *  			Callback that returns the level after successfully retrieving it
     *  @param failure
     *  			Callback that returns any errors that occur during retrieval
     */
    prototype.viewLevel = function(id, success, failure) {
        EcRepository.get(id, function(p1) {
            var encrypted = new EcEncryptedValue();
            encrypted.copyFrom(p1);
            var level = new EcLevel();
            if (p1.isAny(level.getTypes())) {
                level.copyFrom(p1);
                success(level);
            } else if (p1.isA(EcEncryptedValue.myType) && encrypted.isAnEncrypted(EcLevel.myType)) {
                var decrypted = encrypted.decryptIntoObject();
                level.copyFrom(decrypted);
                ;
                level.privateEncrypted = true;
                success(level);
            } else {
                failure("Retrieved object was not a level");
            }
        }, failure);
    };
    /**
     *  Retrieve an object from the repository and check then cast it to a assertion before returning it
     *  @param id
     *  			ID of the assertion to retrieve from the repository
     *  @param success
     *  			Callback that returns the assertion after successfully retrieving it
     *  @param failure
     *  			Callback that returns any errors that occur during retrieval
     */
    prototype.viewAssertion = function(id, success, failure) {
        EcRepository.get(id, function(p1) {
            var assertion = new EcAssertion();
            if (p1.isAny(assertion.getTypes())) {
                assertion.copyFrom(p1);
                success(assertion);
            } else {
                failure("Retrieved object was not an assertion");
            }
        }, failure);
    };
}, {repo: "EcRepository", identity: "IdentityController"}, {});
