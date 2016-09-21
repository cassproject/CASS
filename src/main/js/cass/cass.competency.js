/**
 *  TODO: Test case where an absent relation is in the framework.
 *  @author fritz.ray@eduworks.com
 */
var EcAlignment = function() {
    Relation.call(this);
};
EcAlignment = stjs.extend(EcAlignment, Relation, [], function(constructor, prototype) {
    prototype.setName = function(name) {
        this.name = name;
    };
    prototype.setDescription = function(description) {
        this.description = description;
    };
    prototype.save = function(success, failure) {
        if (this.source == null || this.source == "") {
            var msg = "Source Competency cannot be missing";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        if (this.target == null || this.target == "") {
            var msg = "Target Competency cannot be missing";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        if (this.relationType == null || this.relationType == "") {
            var msg = "Relation Type cannot be missing";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        if (this.privateEncrypted != null && this.privateEncrypted) {
            var encrypted = EcEncryptedValue.toEncryptedValue(this, false);
            EcRepository._save(encrypted, success, failure);
        } else {
            EcRepository._save(this, success, failure);
        }
    };
    prototype._delete = function(success, failure) {
        EcRepository.DELETE(this, success, failure);
    };
    constructor.get = function(id, success, failure) {
        EcRepository.get(id, function(p1) {
            var relation = new EcAlignment();
            if (p1.isA(EcEncryptedValue.myType)) {
                var encrypted = new EcEncryptedValue();
                encrypted.copyFrom(p1);
                p1 = encrypted.decryptIntoObject();
                p1.privateEncrypted = true;
            }
            if (p1.isAny(relation.getTypes())) {
                relation.copyFrom(p1);
                if (success != null) 
                    success(relation);
            } else {
                var msg = "Resultant object is not a relation.";
                if (failure != null) 
                    failure(msg);
                 else 
                    console.error(msg);
            }
        }, failure);
    };
    constructor.search = function(repo, query, success, failure, paramObj) {
        var queryAdd = new EcAlignment().getSearchStringByType();
        if (query == null || query == "") 
            query = queryAdd;
         else 
            query = "(" + query + ") AND " + queryAdd;
        repo.searchWithParams(query, paramObj, null, function(p1) {
            if (success != null) {
                var ret = [];
                for (var i = 0; i < p1.length; i++) {
                    var alignment = new EcAlignment();
                    if (p1[i].isAny(alignment.getTypes())) {
                        alignment.copyFrom(p1[i]);
                    } else if (p1[i].isA(EcEncryptedValue.myType)) {
                        var val = new EcEncryptedValue();
                        val.copyFrom(p1[i]);
                        if (val.isAnEncrypted(EcAlignment.myType)) {
                            var obj = val.decryptIntoObject();
                            alignment.copyFrom(obj);
                            alignment.privateEncrypted = true;
                        }
                    }
                    ret[i] = alignment;
                }
                success(ret);
            }
        }, failure);
    };
    constructor.searchBySource = function(repo, sourceId, success, failure, paramObj) {
        var query = "";
        query = "(" + new EcAlignment().getSearchStringByType();
        var noVersion = EcRemoteLinkedData.trimVersionFromUrl(sourceId);
        if (noVersion == sourceId) {
            query += " AND (source:\"" + sourceId + "\"))";
        } else {
            query += " AND (source:\"" + sourceId + "\" OR source:\"" + noVersion + "\"))";
        }
        repo.searchWithParams(query, paramObj, null, function(p1) {
            if (success != null) {
                var ret = [];
                for (var i = 0; i < p1.length; i++) {
                    var alignment = new EcAlignment();
                    if (p1[i].isAny(alignment.getTypes())) {
                        alignment.copyFrom(p1[i]);
                    } else if (p1[i].isA(EcEncryptedValue.myType)) {
                        var val = new EcEncryptedValue();
                        val.copyFrom(p1[i]);
                        if (val.isAnEncrypted(EcAlignment.myType)) {
                            var obj = val.decryptIntoObject();
                            if ((obj)["source"] != sourceId && (obj)["source"] != noVersion) {
                                continue;
                            }
                            alignment.copyFrom(obj);
                            alignment.privateEncrypted = true;
                        }
                    }
                    ret[i] = alignment;
                }
                success(ret);
            }
        }, failure);
    };
    constructor.searchByCompetency = function(repo, competencyId, success, failure, paramObj) {
        var query = "";
        query = "(" + new EcAlignment().getSearchStringByType();
        var noVersion = EcRemoteLinkedData.trimVersionFromUrl(competencyId);
        if (noVersion == competencyId) {
            query += " AND (source:\"" + competencyId + "\" OR target:\"" + competencyId + "\"))";
        } else {
            query += " AND (source:\"" + competencyId + "\" OR source:\"" + noVersion + "\" OR target:\"" + competencyId + "\" OR target:\"" + noVersion + "\"))";
        }
        query += " OR @encryptedType:\"" + EcAlignment.myType + "\" OR @encryptedType:\"" + EcAlignment.myType.replace(Cass.context + "/", "") + "\")";
        repo.searchWithParams(query, paramObj, null, function(p1) {
            if (success != null) {
                var ret = [];
                for (var i = 0; i < p1.length; i++) {
                    var alignment = new EcAlignment();
                    if (p1[i].isAny(alignment.getTypes())) {
                        alignment.copyFrom(p1[i]);
                    } else if (p1[i].isA(EcEncryptedValue.myType)) {
                        var val = new EcEncryptedValue();
                        val.copyFrom(p1[i]);
                        if (val.isAnEncrypted(EcAlignment.myType)) {
                            var obj = val.decryptIntoObject();
                            if ((obj)["source"] != competencyId && (obj)["source"] != noVersion && (obj)["target"] != competencyId && (obj)["target"] != noVersion) {
                                continue;
                            }
                            alignment.copyFrom(obj);
                            alignment.privateEncrypted = true;
                        }
                    }
                    ret[i] = alignment;
                }
                success(ret);
            }
        }, failure);
    };
}, {mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, secret: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  The sequence that assertions should be built as such: 1. Generate the ID. 2.
 *  Add the owner. 3. Set the subject. 4. Set the agent. Further functions may be
 *  called afterwards in any order. WARNING: The modifications of ownership and
 *  readership do not "just work".
 *  
 *  @author fritz.ray@eduworks.com
 */
var EcAssertion = function() {
    Assertion.call(this);
};
EcAssertion = stjs.extend(EcAssertion, Assertion, [], function(constructor, prototype) {
    prototype.getSubject = function() {
        if (this.subject == null) 
            return null;
        var v = new EcEncryptedValue();
        v.copyFrom(this.subject);
        var decryptedString = v.decryptIntoString();
        if (decryptedString == null) 
            return null;
        return EcPk.fromPem(decryptedString);
    };
    prototype.getAgent = function() {
        if (this.agent == null) 
            return null;
        var v = new EcEncryptedValue();
        v.copyFrom(this.agent);
        var decryptedString = v.decryptIntoString();
        if (decryptedString == null) 
            return null;
        return EcPk.fromPem(decryptedString);
    };
    prototype.getSubjectName = function() {
        if (this.subject == null) 
            return "Nobody";
        var subjectPk = this.getSubject();
        var identity = EcIdentityManager.getIdentity(subjectPk);
        if (identity != null && identity.displayName != null) 
            return identity.displayName + " (You)";
        var contact = EcIdentityManager.getContact(subjectPk);
        if (contact == null || contact.displayName == null) 
            return "Unknown Subject";
        return contact.displayName;
    };
    prototype.getAgentName = function() {
        if (this.agent == null) 
            return "Nobody";
        var agentPk = this.getAgent();
        var identity = EcIdentityManager.getIdentity(agentPk);
        if (identity != null && identity.displayName != null) 
            return identity.displayName + " (You)";
        var contact = EcIdentityManager.getContact(agentPk);
        if (contact == null || contact.displayName == null) 
            return "Unknown Agent";
        return contact.displayName;
    };
    prototype.getAssertionDate = function() {
        if (this.assertionDate == null) 
            return null;
        var v = new EcEncryptedValue();
        v.copyFrom(this.assertionDate);
        var decryptedString = v.decryptIntoString();
        if (decryptedString == null) 
            return null;
        return Long.parseLong(decryptedString);
    };
    prototype.getExpirationDate = function() {
        if (this.expirationDate == null) 
            return null;
        var v = new EcEncryptedValue();
        v.copyFrom(this.expirationDate);
        var decryptedString = v.decryptIntoString();
        if (decryptedString == null) 
            return null;
        return Long.parseLong(decryptedString);
    };
    prototype.getEvidenceCount = function() {
        if (this.evidence == null) 
            return 0;
        return this.evidence.length;
    };
    prototype.getEvidence = function(index) {
        if (this.evidence == null) 
            return null;
        var v = new EcEncryptedValue();
        v.copyFrom(this.evidence[index]);
        var decryptedString = v.decryptIntoString();
        return decryptedString;
    };
    prototype.getDecayFunction = function() {
        if (this.decayFunction == null) 
            return null;
        var v = new EcEncryptedValue();
        v.copyFrom(this.decayFunction);
        var decryptedString = v.decryptIntoString();
        if (decryptedString == null) 
            return null;
        return decryptedString;
    };
    prototype.getNegative = function() {
        if (this.negative == null) 
            return false;
        var v = new EcEncryptedValue();
        v.copyFrom(this.negative);
        var decryptedString = v.decryptIntoString();
        if (decryptedString != null) 
            decryptedString.toLowerCase();
        return "true".equals(decryptedString);
    };
    /**
     *  Sets the subject of an assertion. Makes a few assumptions: Owners of the
     *  object should be able to see and change the encrypted value. Owners and
     *  readers of the object should be persisted.
     *  
     *  @param pk
     */
    prototype.setSubject = function(pk) {
        var owners = new Array();
        var readers = this.reader;
        if (readers == null) 
            readers = new Array();
        if (this.subject != null) {
            owners.concat(this.subject.owner);
            readers.concat(this.subject.reader);
        }
        owners = owners.concat(this.owner);
        readers.push(pk.toPem());
        this.subject = EcEncryptedValue.encryptValue(pk.toPem(), this.id, "subject", owners, readers);
    };
    prototype.setAgent = function(pk) {
        this.agent = EcEncryptedValue.encryptValue(pk.toPem(), this.id, "agent", this.subject.owner, this.subject.reader);
    };
    prototype.setCompetency = function(competencyUrl) {
        this.competency = competencyUrl;
    };
    prototype.setLevel = function(levelUrl) {
        this.level = levelUrl;
    };
    prototype.setConfidence = function(confidenceZeroToOne) {
        this.confidence = confidenceZeroToOne;
    };
    prototype.setEvidence = function(evidences) {
        var encryptedValues = new Array();
        for (var i = 0; i < evidences.length; i++) 
            encryptedValues.push(EcEncryptedValue.encryptValue(evidences[i], this.id, "evidence", this.subject.owner, this.subject.reader));
        this.evidence = encryptedValues;
    };
    prototype.setAssertionDate = function(assertionDateMs) {
        this.assertionDate = EcEncryptedValue.encryptValue(assertionDateMs.toString(), this.id, "assertionDate", this.subject.owner, this.subject.reader);
    };
    prototype.setExpirationDate = function(expirationDateMs) {
        this.expirationDate = EcEncryptedValue.encryptValue(expirationDateMs.toString(), this.id, "expirationDate", this.subject.owner, this.subject.reader);
    };
    prototype.setDecayFunction = function(decayFunctionText) {
        this.decayFunction = EcEncryptedValue.encryptValue(decayFunctionText.toString(), this.id, "decayFunction", this.subject.owner, this.subject.reader);
    };
    prototype.setNegative = function(negativeB) {
        this.negative = EcEncryptedValue.encryptValue(negativeB.toString(), this.id, "negative", this.subject.owner, this.subject.reader);
    };
    prototype.save = function(success, failure) {
        if (this.competency == null || this.competency == "") {
            var msg = "Failing to save: Competency cannot be missing";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        if (this.subject == null) {
            var msg = "Failing to save: Subject cannot be missing";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        if (this.agent == null) {
            var msg = "Failing to save: Agent cannot be missing";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        if (this.confidence == null) {
            var msg = "Failing to save: Confidence cannot be missing";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        if (this.assertionDate == null) {
            var msg = "Failing to save: Assertion Date cannot be missing";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        if (this.decayFunction == null) {
            var msg = "Failing to save: Decay Function cannot be missing";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        if (this.privateEncrypted != null && this.privateEncrypted) {
            var encrypted = EcEncryptedValue.toEncryptedValue(this, false);
            EcRepository._save(encrypted, success, failure);
        } else {
            EcRepository._save(this, success, failure);
        }
    };
    prototype.addReader = function(newReader) {
        if (this.agent != null) {
            this.agent = EcEncryptedValue.revive(this.agent);
            this.agent.addReader(newReader);
        }
        if (this.assertionDate != null) {
            this.assertionDate = EcEncryptedValue.revive(this.assertionDate);
            this.assertionDate.addReader(newReader);
        }
        if (this.decayFunction != null) {
            this.decayFunction = EcEncryptedValue.revive(this.decayFunction);
            this.decayFunction.addReader(newReader);
        }
        if (this.evidence != null) 
            for (var i = 0; i < this.evidence.length; i++) {
                this.evidence[i] = EcEncryptedValue.revive(this.evidence[i]);
                this.evidence[i].addReader(newReader);
            }
        if (this.expirationDate != null) {
            this.expirationDate = EcEncryptedValue.revive(this.expirationDate);
            this.expirationDate.addReader(newReader);
        }
        if (this.negative != null) {
            this.negative = EcEncryptedValue.revive(this.negative);
            this.negative.addReader(newReader);
        }
        if (this.subject != null) {
            this.subject = EcEncryptedValue.revive(this.subject);
            this.subject.addReader(newReader);
        }
    };
    prototype.removeReader = function(newReader) {
        if (this.agent != null) {
            this.agent = EcEncryptedValue.revive(this.agent);
            this.agent.removeReader(newReader);
        }
        if (this.assertionDate != null) {
            this.assertionDate = EcEncryptedValue.revive(this.assertionDate);
            this.assertionDate.removeReader(newReader);
        }
        if (this.decayFunction != null) {
            this.decayFunction = EcEncryptedValue.revive(this.decayFunction);
            this.decayFunction.removeReader(newReader);
        }
        if (this.evidence != null) 
            for (var i = 0; i < this.evidence.length; i++) {
                this.evidence[i] = EcEncryptedValue.revive(this.evidence[i]);
                this.evidence[i].removeReader(newReader);
            }
        if (this.expirationDate != null) {
            this.expirationDate = EcEncryptedValue.revive(this.expirationDate);
            this.expirationDate.removeReader(newReader);
        }
        if (this.negative != null) {
            this.negative = EcEncryptedValue.revive(this.negative);
            this.negative.removeReader(newReader);
        }
        if (this.subject != null) {
            this.subject = EcEncryptedValue.revive(this.subject);
            this.subject.removeReader(newReader);
        }
    };
    constructor.get = function(id, success, failure) {
        EcRepository.get(id, function(p1) {
            var assertion = new EcAssertion();
            if (p1.isAny(assertion.getTypes())) {
                assertion.copyFrom(p1);
                if (success != null) 
                    success(assertion);
            } else {
                var msg = "Retrieved object was not an assertion";
                if (failure != null) 
                    failure(msg);
                 else 
                    console.error(msg);
            }
        }, failure);
    };
    constructor.search = function(repo, query, success, failure, paramObj) {
        var queryAdd = new EcAssertion().getSearchStringByType();
        if (query == null || query == "") 
            query = queryAdd;
         else 
            query = "(" + query + ") AND " + queryAdd;
        repo.searchWithParams(query, paramObj, null, function(p1) {
            if (success != null) {
                var ret = [];
                for (var i = 0; i < p1.length; i++) {
                    var assertion = new EcAssertion();
                    assertion.copyFrom(p1[i]);
                    ret[i] = assertion;
                }
                success(ret);
            }
        }, failure);
    };
    prototype.getSearchStringByTypeAndCompetency = function(competency) {
        return "(" + this.getSearchStringByType() + " AND competency:\"" + competency.shortId() + "\")";
    };
}, {subject: "EcEncryptedValue", agent: "EcEncryptedValue", evidence: {name: "Array", arguments: ["EcEncryptedValue"]}, assertionDate: "EcEncryptedValue", expirationDate: "EcEncryptedValue", decayFunction: "EcEncryptedValue", negative: "EcEncryptedValue", mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, secret: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  @author fritz.ray@eduworks.com
 */
var EcRollupRule = function() {
    RollupRule.call(this);
};
EcRollupRule = stjs.extend(EcRollupRule, RollupRule, [], function(constructor, prototype) {
    prototype.setName = function(name) {
        this.name = name;
    };
    prototype.setDescription = function(description) {
        this.description = description;
    };
    prototype.save = function(success, failure) {
        if (this.rule == null || this.rule == "") {
            var msg = "RollupRule Rule cannot be empty";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        if (this.competency == null || this.competency == "") {
            var msg = "RollupRule's Competency cannot be empty";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        if (this.privateEncrypted != null && this.privateEncrypted) {
            var encrypted = EcEncryptedValue.toEncryptedValue(this, false);
            EcRepository._save(encrypted, success, failure);
        } else {
            EcRepository._save(this, success, failure);
        }
    };
    prototype._delete = function(success, failure, repo) {
        EcRepository.DELETE(this, success, failure);
    };
    constructor.get = function(id, success, failure) {
        EcRepository.get(id, function(p1) {
            if (success == null) 
                return;
            if (!p1.isA(EcRollupRule.myType)) {
                if (failure != null) 
                    failure("Resultant object is not a level.");
                return;
            }
            var c = new EcRollupRule();
            c.copyFrom(p1);
            success(c);
        }, function(p1) {
            if (failure != null) 
                failure(p1);
        });
    };
}, {mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, secret: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  @author fritz.ray@eduworks.com
 */
var EcLevel = function() {
    Level.call(this);
};
EcLevel = stjs.extend(EcLevel, Level, [], function(constructor, prototype) {
    prototype.addRelationship = function(level, targetLevel, alignmentType, identity, server) {
        var a = new EcAlignment();
        a.source = this.id;
        a.target = targetLevel.id;
        a.relationType = alignmentType;
        a.addOwner(identity.toPk());
        a.generateId(server);
        a.signWith(identity);
    };
    prototype.setName = function(name) {
        this.name = name;
    };
    prototype.setDescription = function(description) {
        this.description = description;
    };
    prototype.save = function(success, failure) {
        if (this.name == null || this.name == "") {
            var msg = "Level name cannot be empty";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        if (this.competency == null || this.competency == "") {
            var msg = "Level's Competency cannot be empty";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        if (this.privateEncrypted != null && this.privateEncrypted) {
            var encrypted = EcEncryptedValue.toEncryptedValue(this, false);
            EcRepository._save(encrypted, success, failure);
        } else {
            EcRepository._save(this, success, failure);
        }
    };
    prototype._delete = function(success, failure, repo) {
        EcRepository.DELETE(this, success, failure);
    };
    constructor.get = function(id, success, failure) {
        EcRepository.get(id, function(p1) {
            var level = new EcLevel();
            if (p1.isA(EcEncryptedValue.myType)) {
                var encrypted = new EcEncryptedValue();
                encrypted.copyFrom(p1);
                p1 = encrypted.decryptIntoObject();
                p1.privateEncrypted = true;
            }
            if (p1.isAny(level.getTypes())) {
                level.copyFrom(p1);
                if (success != null) 
                    success(level);
            } else {
                var msg = "Resultant object is not a level.";
                if (failure != null) 
                    failure(msg);
                 else 
                    console.error(msg);
            }
        }, failure);
    };
    constructor.searchByCompetency = function(repo, competencyId, success, failure, paramObj) {
        if (competencyId == null || competencyId == "") {
            failure("No Competency Specified");
            return;
        }
        var query = "(" + new EcLevel().getSearchStringByType();
        query += " AND ( competency:\"" + competencyId + "\" OR competency:\"" + EcRemoteLinkedData.trimVersionFromUrl(competencyId) + "\"))";
        query += " OR @encryptedType:\"" + EcLevel.myType + "\" OR @encryptedType:\"" + EcLevel.myType.replace(Cass.context + "/", "") + "\"";
        repo.searchWithParams(query, paramObj, null, function(p1) {
            if (success != null) {
                var levels = [];
                for (var i = 0; i < p1.length; i++) {
                    var level = new EcLevel();
                    if (p1[i].isAny(level.getTypes())) {
                        level.copyFrom(p1[i]);
                    } else if (p1[i].isA(EcEncryptedValue.myType)) {
                        var val = new EcEncryptedValue();
                        val.copyFrom(p1[i]);
                        if (val.isAnEncrypted(EcLevel.myType)) {
                            var obj = val.decryptIntoObject();
                            if ((obj)["competency"] != competencyId) {
                                continue;
                            }
                            level.copyFrom(obj);
                            level.privateEncrypted = true;
                        }
                    }
                    level.copyFrom(p1[i]);
                    levels[i] = level;
                }
                if (success != null) 
                    success(levels);
            }
        }, failure);
    };
}, {mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, secret: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  @author fritz.ray@eduworks.com
 */
var EcCompetency = function() {
    Competency.call(this);
};
EcCompetency = stjs.extend(EcCompetency, Competency, [], function(constructor, prototype) {
    constructor.RELATIONSHIP_TYPE_REQUIRES = "requires";
    constructor.RELATIONSHIP_TYPE_DESIRES = "desires";
    constructor.RELATIONSHIP_TYPE_IS_ENABLED_BY = "isEnabledBy";
    constructor.RELATIONSHIP_TYPE_IS_RELATED_TO = "isRelatedTo";
    constructor.RELATIONSHIP_TYPE_IS_EQUIVALENT_TO = "isEquivalentTo";
    constructor.RELATIONSHIP_TYPE_LEVEL_GREATER_THAN = "greaterThan";
    constructor.RELATIONSHIP_TYPE_LEVEL_IS_EQUIVALENT_TO = "isEquivalentTo";
    constructor.RELATIONSHIP_TYPE_LEVEL_OVERLAPS = "overlaps";
    prototype.addAlignment = function(target, alignmentType, owner, server, success, failure) {
        var a = new EcAlignment();
        a.generateId(server);
        a.source = this.shortId();
        a.target = target.shortId();
        a.relationType = alignmentType;
        a.addOwner(owner.toPk());
        EcRepository.save(a, success, failure);
        return a;
    };
    prototype.relationships = function(repo, eachSuccess, failure, successAll) {
        repo.search(new EcAlignment().getSearchStringByType() + " AND (source:\"" + this.id + "\" OR target:\"" + this.id + "\" OR source:\"" + this.shortId() + "\" OR target:\"" + this.shortId() + "\")", function(p1) {
            var a = new EcAlignment();
            a.copyFrom(p1);
            if (eachSuccess != null) 
                eachSuccess(a);
        }, function(p1) {
            if (successAll != null) {
                var rels = [];
                for (var i = 0; i < p1.length; i++) {
                    var a = new EcAlignment();
                    a.copyFrom(p1[i]);
                    rels[i] = a;
                }
                if (successAll != null) 
                    successAll(rels);
            }
        }, failure);
    };
    prototype.addLevel = function(name, description, owner, server, success, failure) {
        var l = new EcLevel();
        l.generateId(server);
        l.competency = this.shortId();
        l.description = description;
        l.name = name;
        l.addOwner(owner.toPk());
        EcRepository.save(l, success, failure);
        return l;
    };
    prototype.levels = function(repo, success, failure, successAll) {
        var query = "(" + new EcLevel().getSearchStringByType() + " AND ( competency:\"" + this.id + "\" OR competency:\"" + this.shortId() + "\"))";
        query += " OR @encryptedType:\"" + EcLevel.myType + "\" OR @encryptedType:\"" + EcLevel.myType.replace(Cass.context + "/", "") + "\"";
        var competencyId = this.id;
        var shortId = this.shortId();
        repo.search(query, function(p1) {
            if (success != null) {
                var a = new EcLevel();
                if (p1.isA(EcLevel.myType)) {
                    a.copyFrom(p1);
                } else if (p1.isA(EcEncryptedValue.myType)) {
                    var val = new EcEncryptedValue();
                    val.copyFrom(p1);
                    if (val.isAnEncrypted(EcLevel.myType)) {
                        var obj = val.decryptIntoObject();
                        if ((obj)["competency"] != competencyId && (obj)["competency"] != shortId) {
                            return;
                        }
                        a.copyFrom(obj);
                        a.privateEncrypted = true;
                    }
                }
                success(a);
            }
        }, function(p1) {
            if (successAll != null) {
                var levels = [];
                for (var i = 0; i < p1.length; i++) {
                    var a = new EcLevel();
                    if (p1[i].isA(EcLevel.myType)) {
                        a.copyFrom(p1[i]);
                    } else if (p1[i].isA(EcEncryptedValue.myType)) {
                        var val = new EcEncryptedValue();
                        val.copyFrom(p1[i]);
                        if (val.isAnEncrypted(EcLevel.myType)) {
                            var obj = val.decryptIntoObject();
                            if ((obj)["competency"] != competencyId && (obj)["competency"] != shortId) {
                                continue;
                            }
                            a.copyFrom(obj);
                            a.privateEncrypted = true;
                        }
                    }
                    levels[i] = a;
                }
                if (successAll != null) 
                    successAll(levels);
            }
        }, failure);
    };
    prototype.setName = function(name) {
        this.name = name;
    };
    prototype.setDescription = function(description) {
        this.description = description;
    };
    prototype.setScope = function(scope) {
        this.scope = scope;
    };
    prototype.save = function(success, failure) {
        if (this.name == null || this.name == "") {
            var msg = "Competency Name can not be empty";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        if (this.invalid()) {
            var msg = "Cannot save competency. It is missing a vital component.";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        if (this.privateEncrypted != null && this.privateEncrypted) {
            var encrypted = EcEncryptedValue.toEncryptedValue(this, false);
            EcRepository._save(encrypted, success, failure);
        } else {
            EcRepository._save(this, success, failure);
        }
    };
    prototype._delete = function(success, failure, repo) {
        var me = this;
        EcRepository.DELETE(this, function(p1) {
            if (repo != null) {
                me.relationships(repo, function(p1) {
                    for (var i = 0; i < EcIdentityManager.ids.length; i++) {
                        if (p1.canEdit(EcIdentityManager.ids[i].ppk.toPk())) {
                            p1._delete(null, function(p1) {
                                if (failure != null) 
                                    failure("Unable to Delete Competency Relation");
                                 else 
                                    console.error("Unable to Delete Competency Relation");
                            });
                            return;
                        }
                    }
                }, failure, function(p1) {
                    if (success != null) 
                        success("");
                });
                me.levels(repo, function(p1) {
                    for (var i = 0; i < EcIdentityManager.ids.length; i++) {
                        if (p1.canEdit(EcIdentityManager.ids[i].ppk.toPk())) {
                            p1._delete(null, function(p1) {
                                if (failure != null) 
                                    failure("Unable to Delete Competency Relation");
                                 else 
                                    console.error("Unable to Delete Competency Relation");
                            }, repo);
                            return;
                        }
                    }
                }, failure, function(p1) {
                    if (success != null) 
                        success("");
                });
            } else {
                if (success != null) 
                    success(p1);
            }
        }, failure);
    };
    constructor.get = function(id, success, failure) {
        EcRepository.get(id, function(p1) {
            var competency = new EcCompetency();
            if (p1.isA(EcEncryptedValue.myType)) {
                var encrypted = new EcEncryptedValue();
                encrypted.copyFrom(p1);
                p1 = encrypted.decryptIntoObject();
                p1.privateEncrypted = true;
            }
            if (p1.isAny(competency.getTypes())) {
                competency.copyFrom(p1);
                if (success != null) 
                    success(competency);
            } else {
                var msg = "Retrieved object was not a competency";
                if (failure != null) 
                    failure(msg);
                 else 
                    console.error(msg);
            }
        }, failure);
    };
    constructor.search = function(repo, query, success, failure, paramObj) {
        var queryAdd = "";
        queryAdd = new EcCompetency().getSearchStringByType();
        if (query == null || query == "") 
            query = queryAdd;
         else 
            query = "(" + query + ") AND " + queryAdd;
        repo.searchWithParams(query, paramObj, null, function(p1) {
            if (success != null) {
                var ret = [];
                for (var i = 0; i < p1.length; i++) {
                    var comp = new EcCompetency();
                    if (p1[i].isAny(comp.getTypes())) {
                        comp.copyFrom(p1[i]);
                    } else if (p1[i].isA(EcEncryptedValue.myType)) {
                        var val = new EcEncryptedValue();
                        val.copyFrom(p1[i]);
                        if (val.isAnEncrypted(EcCompetency.myType)) {
                            var obj = val.decryptIntoObject();
                            comp.copyFrom(obj);
                            comp.privateEncrypted = true;
                        }
                    }
                    ret[i] = comp;
                }
                success(ret);
            }
        }, failure);
    };
}, {mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, secret: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
var EcFramework = function() {
    Framework.call(this);
};
EcFramework = stjs.extend(EcFramework, Framework, [], function(constructor, prototype) {
    prototype.addCompetency = function(id) {
        id = EcRemoteLinkedData.trimVersionFromUrl(id);
        if (this.competency == null) 
            this.competency = new Array();
        for (var i = 0; i < this.competency.length; i++) 
            if (this.competency[i].equals(id)) 
                return;
        this.competency.push(id);
    };
    constructor.relDone = {};
    constructor.levelDone = {};
    prototype.removeCompetency = function(id, success, failure) {
        var shortId = EcRemoteLinkedData.trimVersionFromUrl(id);
        if (this.competency == null) 
            this.competency = new Array();
        for (var i = 0; i < this.competency.length; i++) 
            if (this.competency[i].equals(shortId) || this.competency[i].equals(id)) 
                this.competency.splice(i, 1);
        if (this.relation == null && this.level == null) 
            if (success != null) 
                success("");
        EcFramework.relDone[id] = false;
        EcFramework.levelDone[id] = false;
        if (this.relation != null) {
            this.removeRelationshipsThatInclude(id, 0, function(p1) {
                if (EcFramework.levelDone[id]) {
                    if (success != null) 
                        success(p1);
                } else {
                    EcFramework.relDone[id] = true;
                }
            }, failure);
        } else {
            EcFramework.relDone[id] = true;
        }
        if (this.level != null) {
            this.removeLevelsThatInclude(id, 0, function(p1) {
                if (EcFramework.relDone[id]) {
                    if (success != null) 
                        success(p1);
                } else {
                    EcFramework.levelDone[id] = true;
                }
            }, failure);
        } else {
            EcFramework.levelDone[id] = true;
        }
    };
    prototype.removeRelationshipsThatInclude = function(id, i, success, failure) {
        var shortId = EcRemoteLinkedData.trimVersionFromUrl(id);
        var me = this;
        if (i >= this.relation.length && success != null) 
            success("");
         else 
            EcRepository.get(this.relation[i], function(p1) {
                var a = new EcAlignment();
                a.copyFrom(p1);
                if (a.source == shortId || a.target == shortId || a.source == id || a.target == id) {
                    me.relation.splice(i, 1);
                    me.removeRelationshipsThatInclude(id, i, success, failure);
                } else 
                    me.removeRelationshipsThatInclude(id, i + 1, success, failure);
            }, failure);
    };
    prototype.removeLevelsThatInclude = function(id, i, success, failure) {
        var shortId = EcRemoteLinkedData.trimVersionFromUrl(id);
        var me = this;
        if (i >= this.level.length && success != null) 
            success("");
         else 
            EcRepository.get(this.level[i], function(p1) {
                var a = new EcLevel();
                a.copyFrom(p1);
                if (a.competency == shortId || a.competency == id) {
                    me.level.splice(i, 1);
                    me.removeLevelsThatInclude(id, i, success, failure);
                } else 
                    me.removeLevelsThatInclude(id, i + 1, success, failure);
            }, failure);
    };
    prototype.addRelation = function(id) {
        id = EcRemoteLinkedData.trimVersionFromUrl(id);
        if (this.relation == null) 
            this.relation = new Array();
        for (var i = 0; i < this.relation.length; i++) 
            if (this.relation[i].equals(id)) 
                return;
        this.relation.push(id);
    };
    prototype.removeRelation = function(id) {
        id = EcRemoteLinkedData.trimVersionFromUrl(id);
        if (this.relation == null) 
            this.relation = new Array();
        for (var i = 0; i < this.relation.length; i++) 
            if (this.relation[i].equals(id)) 
                this.relation.splice(i, 1);
    };
    prototype.addLevel = function(id) {
        id = EcRemoteLinkedData.trimVersionFromUrl(id);
        if (this.level == null) 
            this.level = new Array();
        for (var i = 0; i < this.level.length; i++) 
            if (this.level[i].equals(id)) 
                return;
        this.level.push(id);
    };
    prototype.removeLevel = function(id) {
        id = EcRemoteLinkedData.trimVersionFromUrl(id);
        if (this.level == null) 
            this.level = new Array();
        for (var i = 0; i < this.level.length; i++) 
            if (this.level[i].equals(id)) 
                this.level.splice(i, 1);
    };
    prototype.save = function(success, failure) {
        if (this.name == null || this.name == "") {
            var msg = "Framework Name Cannot be Empty";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        if (this.privateEncrypted != null && this.privateEncrypted) {
            var encrypted = EcEncryptedValue.toEncryptedValue(this, false);
            EcRepository._save(encrypted, success, failure);
        } else {
            EcRepository._save(this, success, failure);
        }
    };
    prototype._delete = function(success, failure) {
        EcRepository.DELETE(this, success, failure);
    };
    constructor.get = function(id, success, failure) {
        EcRepository.get(id, function(p1) {
            var framework = new EcFramework();
            if (p1.isA(EcEncryptedValue.myType)) {
                var encrypted = new EcEncryptedValue();
                encrypted.copyFrom(p1);
                p1 = encrypted.decryptIntoObject();
                p1.privateEncrypted = true;
            }
            if (p1.isAny(framework.getTypes())) {
                framework.copyFrom(p1);
                if (success != null) 
                    success(framework);
            } else {
                var msg = "Resultant object is not a framework.";
                if (failure != null) 
                    failure(msg);
                 else 
                    console.error(msg);
            }
        }, function(p1) {
            if (failure != null) 
                failure(p1);
        });
    };
    constructor.search = function(repo, query, success, failure, paramObj) {
        var queryAdd = "";
        queryAdd = new EcFramework().getSearchStringByType();
        if (query == null || query == "") 
            query = queryAdd;
         else 
            query = "(" + query + ") AND " + queryAdd;
        repo.searchWithParams(query, paramObj, null, function(p1) {
            if (success != null) {
                var ret = [];
                for (var i = 0; i < p1.length; i++) {
                    var framework = new EcFramework();
                    if (p1[i].isAny(framework.getTypes())) {
                        framework.copyFrom(p1[i]);
                    } else if (p1[i].isA(EcEncryptedValue.myType)) {
                        var val = new EcEncryptedValue();
                        val.copyFrom(p1[i]);
                        if (val.isAnEncrypted(EcFramework.myType)) {
                            var obj = val.decryptIntoObject();
                            framework.copyFrom(obj);
                            framework.privateEncrypted = true;
                        }
                    }
                    ret[i] = framework;
                }
                success(ret);
            }
        }, failure);
    };
}, {relDone: {name: "Map", arguments: [null, null]}, levelDone: {name: "Map", arguments: [null, null]}, competency: {name: "Array", arguments: [null]}, relation: {name: "Array", arguments: [null]}, level: {name: "Array", arguments: [null]}, rollupRule: {name: "Array", arguments: [null]}, source: "Source", mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, secret: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
