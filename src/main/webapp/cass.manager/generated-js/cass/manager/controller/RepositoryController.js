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
    prototype.view = function(id, success, failure) {
        EcRepository.get(id, success, failure);
    };
    prototype.viewCompetency = function(id, success, failure) {
        EcRepository.get(id, function(p1) {
            var encrypted = new EcEncryptedValue();
            encrypted.copyFrom(p1);
            if (p1.isA(EcCompetency.myType)) {
                var competency = new EcCompetency();
                competency.copyFrom(p1);
                success(competency);
            } else if (p1.isA(EcEncryptedValue.type) && encrypted.isAnEncrypted(EcCompetency.myType)) {
                var decrypted = encrypted.decryptIntoObject();
                var competency = new EcCompetency();
                competency.copyFrom(decrypted);
                competency.privateEncrypted = true;
                success(competency);
            } else {
                failure("Retrieved object was not a competency");
            }
        }, failure);
    };
    prototype.viewFramework = function(id, success, failure) {
        var me = this;
        EcRepository.get(id, function(p1) {
            var encrypted = new EcEncryptedValue();
            encrypted.copyFrom(p1);
            if (p1.isA(EcFramework.myType)) {
                var framework = new EcFramework();
                framework.copyFrom(p1);
                success(framework);
            } else if (p1.isA(EcEncryptedValue.type) && encrypted.isAnEncrypted(EcFramework.myType)) {
                var decrypted = encrypted.decryptIntoObject();
                var framework = new EcFramework();
                framework.copyFrom(decrypted);
                framework.privateEncrypted = true;
                success(framework);
            } else {
                failure("Retrieved object was not a framework");
            }
        }, failure);
    };
    prototype.viewRelation = function(id, success, failure) {
        EcRepository.get(id, function(p1) {
            var encrypted = new EcEncryptedValue();
            encrypted.copyFrom(p1);
            if (p1.isA(EcAlignment.myType)) {
                var alignment = new EcAlignment();
                alignment.copyFrom(p1);
                success(alignment);
            } else if (p1.isA(EcEncryptedValue.type) && encrypted.isAnEncrypted(EcAlignment.myType)) {
                var decrypted = encrypted.decryptIntoObject();
                var alignment = new EcAlignment();
                alignment.copyFrom(decrypted);
                alignment.privateEncrypted = true;
                success(alignment);
            } else {
                failure("Retrieved object was not a relation");
            }
        }, failure);
    };
    prototype.viewLevel = function(id, success, failure) {
        EcRepository.get(id, function(p1) {
            if (p1.isA(EcLevel.myType)) {
                var level = new EcLevel();
                level.copyFrom(p1);
                success(level);
            } else {
                failure("Retrieved object was not a level");
            }
        }, failure);
    };
    prototype.viewAssertion = function(id, success, failure) {
        EcRepository.get(id, function(p1) {
            if (p1.isA(EcAssertion.myType)) {
                var assertion = new EcAssertion();
                assertion.copyFrom(p1);
                success(assertion);
            } else {
                failure("Retrieved object was not an assertion");
            }
        }, failure);
    };
}, {repo: "EcRepository", identity: "IdentityController"}, {});
