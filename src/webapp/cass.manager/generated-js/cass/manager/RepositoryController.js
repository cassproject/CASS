var RepositoryController = function() {};
RepositoryController = stjs.extend(RepositoryController, null, [], function(constructor, prototype) {
    prototype.repo = null;
    prototype.identity = null;
    prototype.downloadFile = function(id) {
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
        }, function(p1) {});
    };
    prototype.view = function(id) {
        EcRepository.get(id, function(p1) {
            dataEdit(p1.atIfy());
        }, function(p1) {});
    };
    prototype.encryptAndUploadFile = function(name, base64Data, mimeType) {
        if (this.identity.selectedIdentity == null) {
            selectKeyError();
            return;
        }
        var f = new EcFile();
        f.data = base64Data;
        f.name = name;
        f.mimeType = mimeType;
        f.addOwner(this.identity.selectedIdentity.ppk.toPk());
        var encryptedValue = EcEncryptedValue.toEncryptedValue(f, false);
        encryptedValue.generateId(this.repo.selectedServer);
        this.repo.save(encryptedValue, function(p1) {
            fileUploaded();
        }, null);
    };
    prototype.uploadFile = function(name, base64Data, mimeType) {
        var f = new EcFile();
        f.data = base64Data;
        f.name = name;
        f.mimeType = mimeType;
        f.generateId(this.repo.selectedServer);
        this.repo.save(f, function(p1) {
            fileUploaded();
        }, null);
    };
    prototype.upload = function(data) {
        var d = new EcRemoteLinkedData("", "");
        d.copyFrom(JSON.parse(data));
        if (d.invalid()) 
            cannotSaveErrorInData();
        this.repo.save(d, function(p1) {
            savedData();
        }, function(p1) {
            errorSavingData(p1);
        });
    };
}, {repo: "EcRepository", identity: "IdentityController"}, {});
