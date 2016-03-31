var RepositoryController = function() {};
RepositoryController = stjs.extend(RepositoryController, null, [], function(constructor, prototype) {
    prototype.repo = null;
    prototype.identity = null;
    prototype.downloadFile = function(id, failure) {
        EcRepository.get(id, function(p1) {
            var f = new EcFile();
            if (p1.isA(EcEncryptedValue.type)) {
                var encrypted = new EcEncryptedValue();
                encrypted.copyFrom(p1);
                p1 = encrypted.decryptIntoObject();
            }
            if (p1.isA(EcFile.type)) {
                f.copyFrom(p1);
                f.download();
            }
        }, failure);
    };
    prototype.view = function(id, success, failure) {
        EcRepository.get(id, success, failure);
    };
    prototype.encryptAndUploadFile = function(name, base64Data, mimeType, success, failure) {
        if (this.identity.selectedIdentity == null) {
            return;
        }
        var f = new EcFile();
        f.data = base64Data;
        f.name = name;
        f.mimeType = mimeType;
        f.addOwner(this.identity.selectedIdentity.ppk.toPk());
        var encryptedValue = EcEncryptedValue.toEncryptedValue(f, false);
        encryptedValue.generateId(this.repo.selectedServer);
        this.repo.constructor.save(encryptedValue, function(p1) {
            success();
        }, failure);
    };
    prototype.uploadFile = function(name, base64Data, mimeType, success, failure) {
        var f = new EcFile();
        f.data = base64Data;
        f.name = name;
        f.mimeType = mimeType;
        f.generateId(this.repo.selectedServer);
        this.repo.constructor.save(f, function(p1) {
            success();
        }, failure);
    };
    prototype.upload = function(data, success, fail) {
        var d = new EcRemoteLinkedData(null, null);
        d.copyFrom(JSON.parse(data));
        if (d.invalid()) {
            fail("Cannot save data. It is missing a vital component.");
        }
        this.repo.constructor.save(d, success, fail);
    };
}, {repo: "EcRepository", identity: "IdentityController"}, {});
