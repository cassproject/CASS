/**
 *  Implementation of a Rollup Rule object with methods for interacting with CASS
 *  services on a server.
 * 
 *  @author fritz.ray@eduworks.com
 *  @author devlin.junker@eduworks.com
 *  @module org.cassproject
 *  @class EcRollupRule
 *  @constructor
 *  @extends RollupRule
 */
var EcRollupRule = function() {
    RollupRule.call(this);
};
EcRollupRule = stjs.extend(EcRollupRule, RollupRule, [], function(constructor, prototype) {
    /**
     *  Retrieves a rollup rule from the server
     * 
     *  @param {String}                  id
     *                                   ID of the rollup rule to retrieve
     *  @param {Callback1<EcRollupRule>} success
     *                                   Callback triggered on successful retrieving rollup rule,
     *                                   returns the rollup rule
     *  @param {Callback1<String>}       failure
     *                                   Callback triggered if error retrieving rollup rule
     *  @memberOf EcRollupRule
     *  @method get
     *  @static
     */
    constructor.get = function(id, success, failure) {
        EcRepository.getAs(id, new EcRollupRule(), success, failure);
    };
    constructor.getBlocking = function(id) {
        return EcRepository.getBlockingAs(id, new EcRollupRule());
    };
    /**
     *  Searches for levels with a string query
     * 
     *  @param {EcRepository}                   repo
     *                                          Repository to search for levels
     *  @param {String}                         query
     *                                          query string to use in search
     *  @param {Callback1<Array<EcRollupRule>>} success
     *                                          Callback triggered when searches successfully
     *  @param {Callback1<String>}              failure
     *                                          Callback triggered if an error occurs while searching
     *  @param {Object}                         paramObj
     *                                          Search parameters object to pass in
     *  @memberOf EcRollupRule
     *  @method search
     *  @static
     */
    constructor.search = function(repo, query, success, failure, paramObj) {
        EcRepository.searchAs(repo, query, function() {
            return new EcRollupRule();
        }, success, failure, paramObj);
    };
    /**
     *  Method for setting a rollup rule name
     * 
     *  @param name
     *  @memberOf EcRollupRule
     *  @method setName
     */
    prototype.setName = function(name) {
        this.name = name;
    };
    /**
     *  Method for setting a rollup rule description
     * 
     *  @param {String} description
     *  @memberOf EcRollupRule
     *  @method setDescription
     */
    prototype.setDescription = function(description) {
        this.description = description;
    };
    /**
     *  Saves this rollup rules details on the server specified by its ID
     * 
     *  @param {Callback1<String>} success
     *                             Callback triggered on successful save of rollup rule
     *  @param {Callback1<String>} failure
     *                             Callback triggered if error saving rollup rule
     *  @memberOf EcRollupRule
     *  @method save
     */
    prototype.save = function(success, failure, repo) {
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
        if (repo == null) 
            EcRepository.save(this, success, failure);
         else 
            repo.saveTo(this, success, failure);
    };
    /**
     *  Deletes this rollup rule from the server specified by it's ID
     * 
     *  @param {Callback1<String>} success
     *                             Callback triggered on successful deleting the rollup rle
     *  @param {Callback1<String>} failure
     *                             Callback triggered if error deleting the rollup rule
     *  @memberOf EcRollupRule
     *  @method _delete
     */
    prototype._delete = function(success, failure) {
        EcRepository.DELETE(this, success, failure);
    };
}, {about: "Thing", educationalAlignment: "AlignmentObject", associatedMedia: "MediaObject", funder: "Person", audio: "AudioObject", workExample: "CreativeWork", provider: "Person", encoding: "MediaObject", character: "Person", audience: "Audience", sourceOrganization: "Organization", isPartOf: "CreativeWork", video: "VideoObject", publication: "PublicationEvent", contributor: "Organization", reviews: "Review", hasPart: "CreativeWork", releasedEvent: "PublicationEvent", contentLocation: "Place", aggregateRating: "AggregateRating", locationCreated: "Place", accountablePerson: "Person", spatialCoverage: "Place", offers: "Offer", editor: "Person", copyrightHolder: "Person", recordedAt: "Event", publisher: "Person", interactionStatistic: "InteractionCounter", exampleOfWork: "CreativeWork", mainEntity: "Thing", author: "Person", timeRequired: "Duration", translator: "Person", comment: "Comment", inLanguage: "Language", review: "Review", license: "CreativeWork", encodings: "MediaObject", isBasedOn: "Product", creator: "Person", sponsor: "Organization", producer: "Person", mentions: "Thing", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  Implementation of an alignment object with methods for interacting with CASS
 *  services on a server.
 * 
 *  @author fritz.ray@eduworks.com
 *  @author devlin.junker@eduworks.com
 *  <p>
 *  TODO: Test case where an absent relation is in the framework.
 *  @module org.cassproject
 *  @class EcAlignment
 *  @constructor
 *  @extends Relation
 */
var EcAlignment = function() {
    Relation.call(this);
};
EcAlignment = stjs.extend(EcAlignment, Relation, [], function(constructor, prototype) {
    prototype.equals = function(obj) {
        if ((obj).id == null) 
            return ((obj).source == this.source && (obj).target == this.target && (obj).relationType == this.relationType);
        return this.isId((obj).id);
    };
    /**
     *  Retrieves the alignment specified with the ID from the server
     * 
     *  @param {String}                 id
     *                                  ID of the alignment to retrieve
     *  @param {Callback1<EcAlignment>} success
     *                                  Callback triggered on successfully retrieving the alignment,
     *                                  returns the alignment
     *  @param {Callback1<String>}      [failure]
     *                                  Callback triggered if error while retrieving alignment
     *  @memberOf EcAlignment
     *  @method get
     *  @static
     */
    constructor.get = function(id, success, failure) {
        EcRepository.getAs(id, new EcAlignment(), success, failure);
    };
    /**
     *  Retrieves an alignment from it's server synchronously, the call
     *  blocks until it is successful or an error occurs
     * 
     *  @param {String} id
     *                  ID of the alignment to retrieve
     *  @return EcAlignment
     *  The alignment retrieved
     *  @memberOf EcAlignment
     *  @method getBlocking
     *  @static
     */
    constructor.getBlocking = function(id) {
        return EcRepository.getBlockingAs(id, new EcAlignment());
    };
    /**
     *  Searches the repository using the query and optional parameters provided
     * 
     *  @param {EcRepository}                  repo
     *                                         Repository to search using the query provided
     *  @param {String}                        query
     *                                         The query to send to the search
     *  @param {Callback1<Array<EcAlignment>>} success
     *                                         Callback triggered on successful search return
     *  @param {Callback1<String>}             [failure]
     *                                         Callback triggered if error searching
     *  @param {Object}                        [paramObj]
     *                                         Parameters to include in the search
     *  @memberOf EcAlignment
     *  @method search
     *  @static
     */
    constructor.search = function(repo, query, success, failure, paramObj) {
        EcRepository.searchAs(repo, query, function() {
            return new EcAlignment();
        }, success, failure, paramObj);
    };
    /**
     *  Searches the repository for alignments with a specific ID in the source field
     * 
     *  @param {EcRepository}                  repo
     *                                         Repository to search for alignments with the source specified
     *  @param {String}                        sourceId
     *                                         ID in the source field of the alignments to find
     *  @param {Callback1<Array<EcAlignment>>} success
     *                                         Callback triggered on successful search return
     *  @param {Callback1<String>}             [failure]
     *                                         Callback triggered if error searching
     *  @param {Object}                        [paramObj]
     *                                         Parameters to include in the search
     *  @memberOf EcAlignment
     *  @method searchBySource
     *  @static
     */
    constructor.searchBySource = function(repo, sourceId, success, failure, paramObj) {
        var query = "";
        var noVersion = EcRemoteLinkedData.trimVersionFromUrl(sourceId);
        if (noVersion == sourceId) {
            query += "source:\"" + sourceId + "\"";
        } else {
            query += "source:\"" + sourceId + "\" OR source:\"" + noVersion + "\"";
        }
        EcAlignment.search(repo, query, success, failure, paramObj);
    };
    /**
     *  Searches the repository for alignments with one of an array of IDs in the source field
     * 
     *  @param {EcRepository}                  repo
     *                                         Repository to search for alignments with the source specified
     *  @param {String}                        sourceId
     *                                         ID in the source field of the alignments to find
     *  @param {Callback1<Array<EcAlignment>>} success
     *                                         Callback triggered on successful search return
     *  @param {Callback1<String>}             [failure]
     *                                         Callback triggered if error searching
     *  @param {Object}                        [paramObj]
     *                                         Parameters to include in the search
     *  @memberOf EcAlignment
     *  @method searchBySource
     *  @static
     */
    constructor.searchBySources = function(repo, sourceIds, success, failure, paramObj) {
        var query = "";
        query = "(source:";
        var noVersions = [];
        for (var i = 0; i < sourceIds.length; i++) {
            var sourceId = sourceIds[i];
            if (i != 0) 
                query += " OR ";
            var noVersion = EcRemoteLinkedData.trimVersionFromUrl(sourceId);
            if (noVersion == sourceId) {
                query += "\"" + sourceId + "\"";
            } else {
                query += "\"" + sourceId + "\" OR source:\"" + noVersion + "\"";
            }
            noVersions.push(noVersion);
        }
        query += ")";
        EcAlignment.search(repo, query, success, failure, paramObj);
    };
    /**
     *  Searches the repository for alignments with a specific ID in the target field
     * 
     *  @param {EcRepository}                  repo
     *                                         Repository to search for alignments with the source specified
     *  @param {String}                        competencyId
     *                                         ID in the target field of the alignments to find
     *  @param {Callback1<Array<EcAlignment>>} success
     *                                         Callback triggered on successful search return
     *  @param {Callback1<String>}             [failure]
     *                                         Callback triggered if error searching
     *  @param {Object}                        [paramObj]
     *                                         Parameters to include in the search
     *  @memberOf EcAlignment
     *  @method searchByCompetency
     *  @static
     */
    constructor.searchByCompetency = function(repo, competencyId, success, failure, paramObj) {
        var query = "";
        var noVersion = EcRemoteLinkedData.trimVersionFromUrl(competencyId);
        if (noVersion == competencyId) {
            query += " AND (source:\"" + competencyId + "\" OR target:\"" + competencyId + "\")";
        } else {
            query += " AND (source:\"" + competencyId + "\" OR source:\"" + noVersion + "\" OR target:\"" + competencyId + "\" OR target:\"" + noVersion + "\")";
        }
        EcAlignment.search(repo, query, success, failure, paramObj);
    };
    /**
     *  Setter for alignment name
     * 
     *  @param {String} name
     *                  name to give this alignment
     *  @memberOf EcAlignment
     *  @method setName
     */
    prototype.setName = function(name) {
        this.name = name;
    };
    /**
     *  Setter for alignment description
     * 
     *  @param {String} description
     *                  description to give this alignment
     *  @memberOf EcAlignment
     *  @method setDescription
     */
    prototype.setDescription = function(description) {
        this.description = description;
    };
    /**
     *  Saves this alignment details on the server corresponding to its ID
     * 
     *  @param {Callback1<String>} success
     *                             Callback triggered on successfully saving the alignment
     *  @param {Callback1<String>} [failure]
     *                             Callback triggered if error while saving alignment
     *  @memberOf EcAlignment
     *  @method save
     */
    prototype.save = function(success, failure, repo) {
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
        if (repo == null) 
            EcRepository.save(this, success, failure);
         else 
            repo.saveTo(this, success, failure);
    };
    /**
     *  Deletes the alignment from the server corresponding to its ID
     * 
     *  @param {Callback1<String>} success
     *                             Callback triggered on successfully deleting the alignment
     *  @param {Callback1<String>} [failure]
     *                             Callback triggered if error while deleting alignment
     *  @memberOf EcAlignment
     *  @method _delete
     */
    prototype._delete = function(success, failure) {
        EcRepository.DELETE(this, success, failure);
    };
}, {about: "Thing", educationalAlignment: "AlignmentObject", associatedMedia: "MediaObject", funder: "Person", audio: "AudioObject", workExample: "CreativeWork", provider: "Person", encoding: "MediaObject", character: "Person", audience: "Audience", sourceOrganization: "Organization", isPartOf: "CreativeWork", video: "VideoObject", publication: "PublicationEvent", contributor: "Organization", reviews: "Review", hasPart: "CreativeWork", releasedEvent: "PublicationEvent", contentLocation: "Place", aggregateRating: "AggregateRating", locationCreated: "Place", accountablePerson: "Person", spatialCoverage: "Place", offers: "Offer", editor: "Person", copyrightHolder: "Person", recordedAt: "Event", publisher: "Person", interactionStatistic: "InteractionCounter", exampleOfWork: "CreativeWork", mainEntity: "Thing", author: "Person", timeRequired: "Duration", translator: "Person", comment: "Comment", inLanguage: "Language", review: "Review", license: "CreativeWork", encodings: "MediaObject", isBasedOn: "Product", creator: "Person", sponsor: "Organization", producer: "Person", mentions: "Thing", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  Created by fray on 11/29/17.
 */
var EcConceptScheme = function() {
    ConceptScheme.call(this);
    var me = (this);
    if (EcConceptScheme.template != null) {
        var you = (EcConceptScheme.template);
        for (var key in you) {
            if ((typeof you[key]) != "function") 
                me[key.replace("@", "")] = you[key];
        }
    }
};
EcConceptScheme = stjs.extend(EcConceptScheme, ConceptScheme, [], function(constructor, prototype) {
    constructor.template = null;
    /**
     *  Retrieves a concept scheme from the server, specified by the ID
     * 
     *  @param {String}                 id
     *                                  ID of the concept scheme to retrieve
     *  @param {Callback1<EcConceptScheme>} success
     *                                  Callback triggered after successfully retrieving the concept scheme,
     *                                  returns the retrieved concept scheme
     *  @param {Callback1<String>}      failure
     *                                  Callback triggered if an error occurs while retrieving the concept scheme
     *  @memberOf EcConceptScheme
     *  @method get
     *  @static
     */
    constructor.get = function(id, success, failure) {
        EcRepository.getAs(id, new EcConceptScheme(), success, failure);
    };
    /**
     *  Retrieves a concept scheme from the server in a blocking fashion, specified by the ID
     * 
     *  @param {String}                 id
     *                                  ID of the concept scheme to retrieve
     *  @param {Callback1<EcConceptScheme>} success
     *                                  Callback triggered after successfully retrieving the concept scheme,
     *                                  returns the retrieved concept scheme
     *  @param {Callback1<String>}      failure
     *                                  Callback triggered if an error occurs while retrieving the concept scheme
     *  @memberOf EcConceptScheme
     *  @method getBlocking
     *  @static
     */
    constructor.getBlocking = function(id) {
        return EcRepository.getBlockingAs(id, new EcConceptScheme());
    };
    /**
     *  Searches the repository given for concept schemes using the query passed in
     * 
     *  @param {EcRepository}                 repo
     *                                        Repository to search for concept schemes
     *  @param {String}                       query
     *                                        Query string used to search for a concept scheme
     *  @param {Callback1<Array<EcConceptScheme>} success
     *                                        Callback triggered when the search successfully returns,
     *                                        returns search results
     *  @param {Callback1<String>}            failure
     *                                        Callback triggered if an error occurs while searching
     *  @param {Object}                       paramObj
     *                                        Parameter object for search
     *  @memberOf EcConceptScheme
     *  @method search
     *  @static
     */
    constructor.search = function(repo, query, success, failure, paramObj) {
        EcRepository.searchAs(repo, query, function() {
            return new EcConceptScheme();
        }, success, failure, paramObj);
    };
}, {template: "Object", hasTopConcept: "Concept", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  Created by fray on 11/29/17.
 */
var EcConcept = function() {
    Concept.call(this);
    var me = (this);
    if (EcConcept.template != null) {
        var you = (EcConcept.template);
        for (var key in you) {
            if ((typeof you[key]) != "function") 
                me[key.replace("@", "")] = you[key];
        }
    }
};
EcConcept = stjs.extend(EcConcept, Concept, [], function(constructor, prototype) {
    constructor.template = null;
    /**
     *  Retrieves a concept from it's server asynchronously
     * 
     *  @param {String}            id
     *                             ID of the concept to retrieve from the server
     *  @param {Callback1<String>} success
     *                             Callback triggered after retrieving the concept,
     *                             returns the concept retrieved
     *  @param {Callback1<String>} failure
     *                             Callback triggered if error retrieving concept
     *  @memberOf EcConcept
     *  @method get
     *  @static
     */
    constructor.get = function(id, success, failure) {
        EcRepository.getAs(id, new EcConcept(), success, failure);
    };
    /**
     *  Retrieves a concept from it's server synchronously, the call
     *  blocks until it is successful or an error occurs
     * 
     *  @param {String} id
     *                  ID of the concept to retrieve
     *  @return EcConcept
     *  The concept retrieved
     *  @memberOf EcConcept
     *  @method getBlocking
     *  @static
     */
    constructor.getBlocking = function(id) {
        return EcRepository.getBlockingAs(id, new EcConcept());
    };
    /**
     *  Searches a repository for competencies that match the search query
     * 
     *  @param {EcRepository}                  repo
     *                                         Repository to search using the query
     *  @param {String}                        query
     *                                         Query string to pass to the search web service
     *  @param {Callback1<Array<EcConcept>> success
     *                                         Callback triggered after completing the search, returns the results
     *  @param {Callback1<String>}             failure
     *                                         Callback triggered if error searching
     *  @param {Object}                        paramObj
     *                                         Parameter object for search
     *  @memberOf EcConcept
     *  @method search
     *  @static
     */
    constructor.search = function(repo, query, success, failure, paramObj) {
        EcRepository.searchAs(repo, query, function() {
            return new EcConcept();
        }, success, failure, paramObj);
    };
}, {template: "Object", topConceptOf: "ConceptScheme", semanticRelation: "Concept", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    prototype.equals = function(obj) {
        return this.isId((obj).id);
    };
    constructor.get = function(id, success, failure) {
        EcRepository.getAs(id, new EcAssertion(), success, failure);
    };
    constructor.getBlocking = function(id) {
        return EcRepository.getBlockingAs(id, new EcAssertion());
    };
    constructor.search = function(repo, query, success, failure, paramObj) {
        EcRepository.searchAs(repo, query, function() {
            return new EcAssertion();
        }, success, failure, paramObj);
    };
    prototype.getSubject = function() {
        if (this.subject == null) 
            return null;
        var v = new EcEncryptedValue();
        v.copyFrom(this.subject);
        var codebook = Assertion.getCodebook(this);
        var decryptedString;
        if (codebook != null) 
            decryptedString = v.decryptIntoStringUsingSecret(codebook.subject);
         else {
            decryptedString = v.decryptIntoString();
        }
        if (decryptedString == null) 
            return null;
        return EcPk.fromPem(decryptedString);
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
        var readers = null;
        if (this.reader == null) 
            readers = new Array();
         else 
            readers = JSON.parse(JSON.stringify(this.reader));
        if (this.subject != null) {
            if (this.subject.owner != null) 
                owners.concat(this.subject.owner);
            if (this.subject.reader != null) 
                readers.concat(this.subject.reader);
        }
        if (this.owner != null) 
            owners = owners.concat(this.owner);
        readers.push(pk.toPem());
        this.subject = EcEncryptedValue.encryptValue(pk.toPem(), this.id, owners, readers);
    };
    prototype.setSubjectAsync = function(pk, success, failure) {
        var me = this;
        var owners = new Array();
        var readers = null;
        if (this.reader == null) 
            readers = new Array();
         else 
            readers = JSON.parse(JSON.stringify(this.reader));
        if (this.subject != null) {
            if (this.subject.owner != null) 
                owners.concat(this.subject.owner);
            if (this.subject.reader != null) 
                readers.concat(this.subject.reader);
        }
        if (this.owner != null) 
            owners = owners.concat(this.owner);
        readers.push(pk.toPem());
        EcEncryptedValue.encryptValueAsync(pk.toPem(), this.id, owners, readers, function(subject) {
            me.subject = subject;
            success();
        }, failure);
    };
    prototype.getSubjectAsync = function(success, failure) {
        if (this.subject == null) {
            success(null);
            return;
        }
        var v = new EcEncryptedValue();
        v.copyFrom(this.subject);
        var decrypted = function(decryptedString) {
            if (decryptedString == null) 
                failure("Could not decrypt subject.");
             else 
                success(EcPk.fromPem(decryptedString));
        };
        var codebook = Assertion.getCodebook(this);
        if (codebook != null) 
            v.decryptIntoStringUsingSecretAsync(codebook.subject, decrypted, failure);
         else 
            v.decryptIntoStringAsync(decrypted, failure);
    };
    prototype.getAgent = function() {
        if (this.agent == null) 
            return null;
        var v = new EcEncryptedValue();
        v.copyFrom(this.agent);
        var codebook = Assertion.getCodebook(this);
        var decryptedString;
        if (codebook != null) 
            decryptedString = v.decryptIntoStringUsingSecret(codebook.agent);
         else {
            decryptedString = v.decryptIntoString();
        }
        if (decryptedString == null) 
            return null;
        return EcPk.fromPem(decryptedString);
    };
    prototype.setAgent = function(pk) {
        this.agent = EcEncryptedValue.encryptValue(pk.toPem(), this.id, this.subject.owner, this.subject.reader);
    };
    prototype.setAgentAsync = function(pk, success, failure) {
        var me = this;
        EcEncryptedValue.encryptValueAsync(pk.toPem(), this.id, this.subject.owner, this.subject.reader, function(agent) {
            me.agent = agent;
            success();
        }, failure);
    };
    prototype.getAgentAsync = function(success, failure) {
        if (this.agent == null) {
            success(null);
            return;
        }
        var v = new EcEncryptedValue();
        v.copyFrom(this.agent);
        var decrypted = function(decryptedString) {
            if (decryptedString == null) 
                failure("Could not decrypt agent.");
             else 
                success(EcPk.fromPem(decryptedString));
        };
        var codebook = Assertion.getCodebook(this);
        if (codebook != null) 
            v.decryptIntoStringUsingSecretAsync(codebook.agent, decrypted, failure);
         else 
            v.decryptIntoStringAsync(decrypted, failure);
    };
    prototype.getSubjectName = function() {
        if (this.subject == null) 
            return "Nobody";
        var subjectPk = this.getSubject();
        var name = EcAssertion.getNameByPkBlocking(subjectPk);
        if (name != null) 
            return name;
        return "Unknown Subject";
    };
    prototype.getSubjectNameAsync = function(success, failure) {
        if (this.subject == null) {
            success("Nobody");
            return;
        }
        this.getSubjectAsync(EcAssertion.getNameByPk(success, failure, "Unknown Subject"), failure);
    };
    prototype.getAgentName = function() {
        if (this.agent == null) 
            return "Nobody";
        var agentPk = this.getAgent();
        var name = EcAssertion.getNameByPkBlocking(agentPk);
        if (name != null) 
            return name;
        return "Unknown Agent";
    };
    prototype.getAgentNameAsync = function(success, failure) {
        if (this.subject == null) {
            success("Nobody");
            return;
        }
        this.getAgentAsync(EcAssertion.getNameByPk(success, failure, "Unknown Agent"), failure);
    };
    constructor.getNameByPk = function(success, failure, dflt) {
        return function(pk) {
            var repoHelper = new EcAsyncHelper();
            repoHelper.each(EcRepository.repos, function(ecRepository, callback0) {
                var url = ecRepository.selectedServer;
                if (url == null) {
                    callback0();
                    return;
                }
                if (url.endsWith("/") == false) 
                    url += "/";
                url += "data/" + pk.fingerprint();
                EcRepository.get(url, function(personOrOrganization) {
                    var e = new EcEncryptedValue();
                    if (personOrOrganization.isAny(e.getTypes())) {
                        e.copyFrom(personOrOrganization);
                        e.decryptIntoObjectAsync(function(decryptedPersonOrOrganization) {
                            var name = Thing.getDisplayStringFrom((decryptedPersonOrOrganization)["name"]);
                            if (name != null && repoHelper.counter != -1) {
                                success(name);
                                repoHelper.stop();
                            } else {
                                callback0();
                                return;
                            }
                        }, function(s) {
                            callback0();
                        });
                    } else {
                        var name = Thing.getDisplayStringFrom((personOrOrganization)["name"]);
                        if (name != null && repoHelper.counter != -1) {
                            success(name);
                            repoHelper.stop();
                        } else {
                            callback0();
                            return;
                        }
                    }
                }, function(s) {
                    callback0();
                });
            }, function(strings) {
                var identity = EcIdentityManager.getIdentity(pk);
                if (identity != null && identity.displayName != null) {
                    success(identity.displayName + " (You)");
                    return;
                }
                var contact = EcIdentityManager.getContact(pk);
                if (contact != null && contact.displayName != null) {
                    success(contact.displayName);
                    return;
                }
                success(dflt);
            });
        };
    };
    constructor.getNameByPkBlocking = function(agentPk) {
        for (var i = 0; i < EcRepository.repos.length; i++) {
            var url = EcRepository.repos[i].selectedServer;
            if (url == null) 
                continue;
            if (url.endsWith("/") == false) 
                url += "/";
            url += "data/" + agentPk.fingerprint();
            var personOrOrganization = EcRepository.getBlocking(url);
            if (personOrOrganization == null) 
                continue;
            var e = new EcEncryptedValue();
            if (personOrOrganization.isAny(e.getTypes())) {
                e.copyFrom(personOrOrganization);
                var decryptedPersonOrOrganization = e.decryptIntoObject();
                if (decryptedPersonOrOrganization != null) 
                    personOrOrganization = decryptedPersonOrOrganization;
            }
            var name = Thing.getDisplayStringFrom((personOrOrganization)["name"]);
            if (name != null) 
                return name;
        }
        var identity = EcIdentityManager.getIdentity(agentPk);
        if (identity != null && identity.displayName != null) 
            return identity.displayName + " (You)";
        var contact = EcIdentityManager.getContact(agentPk);
        if (contact != null && contact.displayName != null) 
            return contact.displayName;
        return null;
    };
    prototype.getAssertionDate = function() {
        if (this.assertionDate == null) 
            return null;
        var v = new EcEncryptedValue();
        v.copyFrom(this.assertionDate);
        var codebook = Assertion.getCodebook(this);
        var decryptedString;
        if (codebook != null) 
            decryptedString = v.decryptIntoStringUsingSecret(codebook.assertionDate);
         else {
            decryptedString = v.decryptIntoString();
        }
        if (decryptedString == null) 
            return null;
        return Long.parseLong(decryptedString);
    };
    prototype.setAssertionDate = function(assertionDateMs) {
        this.assertionDate = EcEncryptedValue.encryptValue(assertionDateMs.toString(), this.id, this.subject.owner, this.subject.reader);
    };
    prototype.setAssertionDateAsync = function(assertionDateMs, success, failure) {
        var me = this;
        EcEncryptedValue.encryptValueAsync(assertionDateMs.toString(), this.id, this.subject.owner, this.subject.reader, function(assertionDate) {
            me.assertionDate = assertionDate;
            success();
        }, failure);
    };
    prototype.getAssertionDateAsync = function(success, failure) {
        if (this.assertionDate == null) {
            success(null);
            return;
        }
        var v = new EcEncryptedValue();
        v.copyFrom(this.assertionDate);
        var decrypted = function(decryptedString) {
            if (decryptedString == null) 
                failure("Could not decrypt assertion date.");
             else 
                success(Long.parseLong(decryptedString));
        };
        var codebook = Assertion.getCodebook(this);
        if (codebook != null) 
            v.decryptIntoStringUsingSecretAsync(codebook.assertionDate, decrypted, failure);
         else 
            v.decryptIntoStringAsync(decrypted, failure);
    };
    prototype.getExpirationDate = function() {
        if (this.expirationDate == null) 
            return null;
        var v = new EcEncryptedValue();
        var codebook = Assertion.getCodebook(this);
        var decryptedString;
        v.copyFrom(this.expirationDate);
        if (codebook != null) 
            decryptedString = v.decryptIntoStringUsingSecret(codebook.expirationDate);
         else {
            decryptedString = v.decryptIntoString();
        }
        if (decryptedString == null) 
            return null;
        return Long.parseLong(decryptedString);
    };
    prototype.setExpirationDate = function(expirationDateMs) {
        this.expirationDate = EcEncryptedValue.encryptValue(expirationDateMs.toString(), this.id, this.subject.owner, this.subject.reader);
    };
    prototype.setExpirationDateAsync = function(expirationDateMs, success, failure) {
        var me = this;
        EcEncryptedValue.encryptValueAsync(expirationDateMs.toString(), this.id, this.subject.owner, this.subject.reader, function(expirationDate) {
            me.expirationDate = expirationDate;
            success();
        }, failure);
    };
    prototype.getExpirationDateAsync = function(success, failure) {
        if (this.expirationDate == null) {
            success(null);
            return;
        }
        var v = new EcEncryptedValue();
        v.copyFrom(this.expirationDate);
        var decrypted = function(decryptedString) {
            if (decryptedString == null) 
                failure("Could not decrypt expiration date.");
             else 
                success(Long.parseLong(decryptedString));
        };
        var codebook = Assertion.getCodebook(this);
        if (codebook != null) 
            v.decryptIntoStringUsingSecretAsync(codebook.expirationDate, decrypted, failure);
         else 
            v.decryptIntoStringAsync(decrypted, failure);
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
        var codebook = Assertion.getCodebook(this);
        var decryptedString;
        if (codebook != null) 
            decryptedString = v.decryptIntoStringUsingSecret(codebook.evidence[index]);
         else {
            decryptedString = v.decryptIntoString();
        }
        return decryptedString;
    };
    prototype.getEvidencesAsync = function(success, failure) {
        var results = new Array();
        if (this.evidence != null) 
            new EcAsyncHelper().each(this.evidence, function(e, callback0) {
                e.decryptIntoStringAsync(function(str) {
                    results.push(str);
                    callback0();
                }, callback0);
            }, function(strings) {
                success(results);
            });
         else 
            success(results);
    };
    prototype.getEvidenceAsync = function(index, success, failure) {
        if (this.evidence[index] == null) {
            success(null);
            return;
        }
        var v = new EcEncryptedValue();
        v.copyFrom(this.evidence[index]);
        var decrypted = function(decryptedString) {
            if (decryptedString == null) 
                failure("Could not decrypt evidence.");
             else 
                success(decryptedString);
        };
        var codebook = Assertion.getCodebook(this);
        if (codebook != null) 
            v.decryptIntoStringUsingSecretAsync(codebook.evidence[index], decrypted, failure);
         else 
            v.decryptIntoStringAsync(decrypted, failure);
    };
    prototype.getDecayFunction = function() {
        if (this.decayFunction == null) 
            return null;
        var v = new EcEncryptedValue();
        v.copyFrom(this.decayFunction);
        var codebook = Assertion.getCodebook(this);
        var decryptedString;
        if (codebook != null) 
            decryptedString = v.decryptIntoStringUsingSecret(codebook.decayFunction);
         else {
            decryptedString = v.decryptIntoString();
        }
        if (decryptedString == null) 
            return null;
        return decryptedString;
    };
    prototype.setDecayFunction = function(decayFunctionText) {
        this.decayFunction = EcEncryptedValue.encryptValue(decayFunctionText.toString(), this.id, this.subject.owner, this.subject.reader);
    };
    prototype.setDecayFunctionAsync = function(decayFunctionText, success, failure) {
        var me = this;
        EcEncryptedValue.encryptValueAsync(decayFunctionText, this.id, this.subject.owner, this.subject.reader, function(decayFunction) {
            me.decayFunction = decayFunction;
            success();
        }, failure);
    };
    prototype.getDecayFunctionAsync = function(success, failure) {
        if (this.decayFunction == null) {
            success(null);
            return;
        }
        var v = new EcEncryptedValue();
        v.copyFrom(this.decayFunction);
        var decrypted = function(decryptedString) {
            if (decryptedString == null) 
                failure("Could not decrypt decay function.");
             else 
                success(decryptedString);
        };
        var codebook = Assertion.getCodebook(this);
        if (codebook != null) 
            v.decryptIntoStringUsingSecretAsync(codebook.decayFunction, decrypted, failure);
         else 
            v.decryptIntoStringAsync(decrypted, failure);
    };
    prototype.getNegative = function() {
        if (this.negative == null) 
            return false;
        var v = new EcEncryptedValue();
        v.copyFrom(this.negative);
        var codebook = Assertion.getCodebook(this);
        var decryptedString;
        if (codebook != null) 
            decryptedString = v.decryptIntoStringUsingSecret(codebook.negative);
         else {
            decryptedString = v.decryptIntoString();
        }
        if (decryptedString != null) 
            decryptedString.toLowerCase();
        return "true".equals(decryptedString);
    };
    prototype.setNegative = function(negativeB) {
        this.negative = EcEncryptedValue.encryptValue(negativeB.toString(), this.id, this.subject.owner, this.subject.reader);
    };
    prototype.setNegativeAsync = function(negativeB, success, failure) {
        var me = this;
        EcEncryptedValue.encryptValueAsync(negativeB.toString(), this.id, this.subject.owner, this.subject.reader, function(negative) {
            me.negative = negative;
            success();
        }, failure);
    };
    prototype.getNegativeAsync = function(success, failure) {
        if (this.negative == null) {
            success(null);
            return;
        }
        var v = new EcEncryptedValue();
        v.copyFrom(this.negative);
        var decrypted = function(decryptedString) {
            if (decryptedString == null) 
                if (decryptedString == null) {
                    failure("Could not decrypt negative.");
                    return;
                }
            if (decryptedString != null) 
                decryptedString.toLowerCase();
            success("true".equals(decryptedString));
        };
        var codebook = Assertion.getCodebook(this);
        if (codebook != null) 
            v.decryptIntoStringUsingSecretAsync(codebook.negative, decrypted, failure);
         else 
            v.decryptIntoStringAsync(decrypted, failure);
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
            encryptedValues.push(EcEncryptedValue.encryptValue(evidences[i], this.id, this.subject.owner, this.subject.reader));
        this.evidence = encryptedValues;
    };
    prototype.setEvidenceAsync = function(evidences, success, failure) {
        var me = this;
        var encryptedValues = new Array();
        new EcAsyncHelper().each(evidences, function(s, callback0) {
            EcEncryptedValue.encryptValueAsync(s, me.id, me.subject.owner, me.subject.reader, function(ecEncryptedValue) {
                encryptedValues.push(ecEncryptedValue);
                callback0();
            }, callback0);
        }, function(strings) {
            me.evidence = encryptedValues;
            success();
        });
    };
    prototype.save = function(success, failure, repo) {
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
        if (repo == null) 
            EcRepository.save(this, success, failure);
         else 
            repo.saveTo(this, success, failure);
    };
    prototype.addReader = function(newReader) {
        if (this.agent != null) {
            this.agent.addReader(newReader);
        }
        if (this.assertionDate != null) {
            this.assertionDate.addReader(newReader);
        }
        if (this.decayFunction != null) {
            this.decayFunction.addReader(newReader);
        }
        if (this.evidence != null) 
            for (var i = 0; i < this.evidence.length; i++) {
                this.evidence[i].addReader(newReader);
            }
        if (this.expirationDate != null) {
            this.expirationDate.addReader(newReader);
        }
        if (this.negative != null) {
            this.negative.addReader(newReader);
        }
        if (this.subject != null) {
            this.subject.addReader(newReader);
        }
        EcRemoteLinkedData.prototype.addReader.call(this, newReader);
    };
    prototype.removeReader = function(newReader) {
        if (this.agent != null) {
            this.agent.removeReader(newReader);
        }
        if (this.assertionDate != null) {
            this.assertionDate.removeReader(newReader);
        }
        if (this.decayFunction != null) {
            this.decayFunction.removeReader(newReader);
        }
        if (this.evidence != null) 
            for (var i = 0; i < this.evidence.length; i++) {
                this.evidence[i].removeReader(newReader);
            }
        if (this.expirationDate != null) {
            this.expirationDate.removeReader(newReader);
        }
        if (this.negative != null) {
            this.negative.removeReader(newReader);
        }
        if (this.subject != null) {
            this.subject.removeReader(newReader);
        }
        EcRemoteLinkedData.prototype.removeReader.call(this, newReader);
    };
    prototype.addReaderAsync = function(newReader, success, failure) {
        var ary = new Array();
        if (this.agent != null) {
            ary.push(this.agent);
        }
        if (this.assertionDate != null) {
            ary.push(this.assertionDate);
        }
        if (this.decayFunction != null) {
            ary.push(this.decayFunction);
        }
        if (this.evidence != null) 
            for (var i = 0; i < this.evidence.length; i++) {
                ary.push(this.evidence[i]);
            }
        if (this.expirationDate != null) {
            ary.push(this.expirationDate);
        }
        if (this.negative != null) {
            ary.push(this.negative);
        }
        if (this.subject != null) {
            ary.push(this.subject);
        }
        EcRemoteLinkedData.prototype.addReader.call(this, newReader);
        var eah = new EcAsyncHelper();
        eah.each(ary, function(ecEncryptedValue, callback0) {
            ecEncryptedValue.addReaderAsync(newReader, callback0, function(s) {
                if (!eah.isStopped()) {
                    eah.stop();
                    failure("Failed to add reader to an assertion.");
                }
            });
        }, function(strings) {
            success();
        });
    };
    prototype.removeReaderAsync = function(oldReader, success, failure) {
        var ary = new Array();
        if (this.agent != null) {
            ary.push(this.agent);
        }
        if (this.assertionDate != null) {
            ary.push(this.assertionDate);
        }
        if (this.decayFunction != null) {
            ary.push(this.decayFunction);
        }
        if (this.evidence != null) 
            for (var i = 0; i < this.evidence.length; i++) {
                ary.push(this.evidence[i]);
            }
        if (this.expirationDate != null) {
            ary.push(this.expirationDate);
        }
        if (this.negative != null) {
            ary.push(this.negative);
        }
        if (this.subject != null) {
            ary.push(this.subject);
        }
        EcRemoteLinkedData.prototype.removeReader.call(this, oldReader);
        var eah = new EcAsyncHelper();
        eah.each(ary, function(ecEncryptedValue, callback0) {
            ecEncryptedValue.removeReaderAsync(oldReader, callback0, function(s) {
                if (!eah.isStopped()) {
                    eah.stop();
                    failure("Failed to remove reader to an assertion.");
                }
            });
        }, function(strings) {
            success();
        });
    };
    prototype.getSearchStringByTypeAndCompetency = function(competency) {
        return "(" + this.getSearchStringByType() + " AND competency:\"" + competency.shortId() + "\")";
    };
}, {codebooks: "Object", subject: "EcEncryptedValue", agent: "EcEncryptedValue", evidence: {name: "Array", arguments: ["EcEncryptedValue"]}, assertionDate: "EcEncryptedValue", expirationDate: "EcEncryptedValue", decayFunction: "EcEncryptedValue", negative: "EcEncryptedValue", about: "Thing", educationalAlignment: "AlignmentObject", associatedMedia: "MediaObject", funder: "Person", audio: "AudioObject", workExample: "CreativeWork", provider: "Person", encoding: "MediaObject", character: "Person", audience: "Audience", sourceOrganization: "Organization", isPartOf: "CreativeWork", video: "VideoObject", publication: "PublicationEvent", contributor: "Organization", reviews: "Review", hasPart: "CreativeWork", releasedEvent: "PublicationEvent", contentLocation: "Place", aggregateRating: "AggregateRating", locationCreated: "Place", accountablePerson: "Person", spatialCoverage: "Place", offers: "Offer", editor: "Person", copyrightHolder: "Person", recordedAt: "Event", publisher: "Person", interactionStatistic: "InteractionCounter", exampleOfWork: "CreativeWork", mainEntity: "Thing", author: "Person", timeRequired: "Duration", translator: "Person", comment: "Comment", inLanguage: "Language", review: "Review", license: "CreativeWork", encodings: "MediaObject", isBasedOn: "Product", creator: "Person", sponsor: "Organization", producer: "Person", mentions: "Thing", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  Implementation of a Level object with methods for interacting with CASS
 *  services on a server.
 * 
 *  @author fritz.ray@eduworks.com
 *  @author devlin.junker@eduworks.com
 *  @module org.cassproject
 *  @class EcLevel
 *  @constructor
 *  @extends Level
 */
var EcLevel = function() {
    Level.call(this);
};
EcLevel = stjs.extend(EcLevel, Level, [], function(constructor, prototype) {
    /**
     *  Retrieves a level from the server specified by its ID
     * 
     *  @param {String}             id
     *                              ID of the level to retrieve
     *  @param {Callback1<EcLevel>} success
     *                              Callback triggered when successfully retrieving the level,
     *                              returns the level
     *  @param {Callback1<String>}  failure
     *                              Callback triggered if error occurs when retrieving the level
     *  @memberOf EcLevel
     *  @method get
     *  @static
     */
    constructor.get = function(id, success, failure) {
        EcRepository.getAs(id, new EcLevel(), success, failure);
    };
    /**
     *  Retrieves a level from it's server synchronously, the call
     *  blocks until it is successful or an error occurs
     * 
     *  @param {String} id
     *                  ID of the level to retrieve
     *  @return EcLevel
     *  The level retrieved
     *  @memberOf EcLevel
     *  @method getBlocking
     *  @static
     */
    constructor.getBlocking = function(id) {
        return EcRepository.getBlockingAs(id, new EcLevel());
    };
    /**
     *  Searches for levels with a string query
     * 
     *  @param {EcRepository}              repo
     *                                     Repository to search for levels
     *  @param {String}                    query
     *                                     query string to use in search
     *  @param {Callback1<Array<EcLevel>>} success
     *                                     Callback triggered when searches successfully
     *  @param {Callback1<String>}         failure
     *                                     Callback triggered if an error occurs while searching
     *  @param {Object}                    paramObj
     *                                     Search parameters object to pass in
     *  @memberOf EcLevel
     *  @method search
     *  @static
     */
    constructor.search = function(repo, query, success, failure, paramObj) {
        EcRepository.searchAs(repo, query, function() {
            return new EcLevel();
        }, success, failure, paramObj);
    };
    /**
     *  Searches for levels using a competency that the results must be related to
     * 
     *  @param {EcRepository}              repo
     *                                     Repository to search for levels
     *  @param {String}                    competencyId
     *                                     competency ID that the levels are rleated to
     *  @param {Callback1<Array<EcLevel>>} success
     *                                     Callback triggered when searches successfully
     *  @param {Callback1<String>}         failure
     *                                     Callback triggered if an error occurs while searching
     *  @param {Object}                    paramObj
     *                                     Search parameters object to pass in
     *  @memberOf EcLevel
     *  @method searchByCompetency
     *  @static
     */
    constructor.searchByCompetency = function(repo, competencyId, success, failure, paramObj) {
        if (competencyId == null || competencyId == "") {
            failure("No Competency Specified");
            return;
        }
        var query = "competency:\"" + competencyId + "\" OR competency:\"" + EcRemoteLinkedData.trimVersionFromUrl(competencyId) + "\"";
        EcLevel.search(repo, competencyId, success, failure, paramObj);
    };
    /**
     *  Adds a relationship between this level and a target level to define
     *  how they correspond to one another
     * 
     *  @param {EcLevel} targetLevel
     *                   Target level of the relationship
     *  @param {String}  alignmentType
     *                   Type of relationship
     *  @param {EcPpk}   identity
     *                   Private key that will own the new relationship
     *  @param {String}  server
     *                   URL Prefix of the new relationship ID (Server it will be saved on)
     *  @memberOf EcLevel
     *  @method addRelationship
     */
    prototype.addRelationship = function(targetLevel, alignmentType, identity, serverUrl, success, failure, repo) {
        var a = new EcAlignment();
        a.source = this.id;
        a.target = targetLevel.id;
        a.relationType = alignmentType;
        a.addOwner(identity.toPk());
        if (repo == null || repo.selectedServer.indexOf(serverUrl) != -1) 
            a.generateId(serverUrl);
         else 
            a.generateShortId(serverUrl);
        a.signWith(identity);
        a.save(success, failure, repo);
    };
    /**
     *  Method to set the name of this level
     * 
     *  @param {String} name
     *                  Name to set on the level
     *  @memberOf EcLevel
     *  @method setName
     */
    prototype.setName = function(name) {
        this.name = name;
    };
    /**
     *  Method to set the description of the level
     * 
     *  @param {String} description
     *                  Description to set on the level
     *  @memberOf EcLevel
     *  @method setDescription
     */
    prototype.setDescription = function(description) {
        this.description = description;
    };
    /**
     *  Saves this levels details to the server
     * 
     *  @param {Callback1<String>} success
     *                             Callback triggered on successfully saving the level to the server
     *  @param {Callback1<String>} failure
     *                             Callback triggered if error occurs while saving the level to the server
     *  @memberOf EcLevel
     *  @method save
     */
    prototype.save = function(success, failure, repo) {
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
        if (repo == null) 
            EcRepository.save(this, success, failure);
         else 
            repo.saveTo(this, success, failure);
    };
    /**
     *  Deletes the level from it's repository
     * 
     *  @param {Callback1<String>} success
     *                             Callback triggered when the level is successfully deleted from the server
     *  @param {Callback1<String>} failure
     *                             Callback triggered if an error occurs while deleting the level
     *  @memberOf EcLevel
     *  @method _delete
     */
    prototype._delete = function(success, failure) {
        EcRepository.DELETE(this, success, failure);
    };
}, {about: "Thing", educationalAlignment: "AlignmentObject", associatedMedia: "MediaObject", funder: "Person", audio: "AudioObject", workExample: "CreativeWork", provider: "Person", encoding: "MediaObject", character: "Person", audience: "Audience", sourceOrganization: "Organization", isPartOf: "CreativeWork", video: "VideoObject", publication: "PublicationEvent", contributor: "Organization", reviews: "Review", hasPart: "CreativeWork", releasedEvent: "PublicationEvent", contentLocation: "Place", aggregateRating: "AggregateRating", locationCreated: "Place", accountablePerson: "Person", spatialCoverage: "Place", offers: "Offer", editor: "Person", copyrightHolder: "Person", recordedAt: "Event", publisher: "Person", interactionStatistic: "InteractionCounter", exampleOfWork: "CreativeWork", mainEntity: "Thing", author: "Person", timeRequired: "Duration", translator: "Person", comment: "Comment", inLanguage: "Language", review: "Review", license: "CreativeWork", encodings: "MediaObject", isBasedOn: "Product", creator: "Person", sponsor: "Organization", producer: "Person", mentions: "Thing", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  Implementation of a Competency object with methods for interacting with CASS
 *  services on a server.
 * 
 *  @author fritz.ray@eduworks.com
 *  @author devlin.junker@eduworks.com
 *  @module org.cassproject
 *  @class EcCompetency
 *  @constructor
 *  @extends Competency
 */
var EcCompetency = function() {
    Competency.call(this);
    var me = (this);
    if (EcCompetency.template != null) {
        var you = (EcCompetency.template);
        for (var key in you) {
            if ((typeof you[key]) != "function") 
                me[key.replace("@", "")] = you[key];
        }
    }
};
EcCompetency = stjs.extend(EcCompetency, Competency, [], function(constructor, prototype) {
    constructor.relDone = {};
    constructor.levelDone = {};
    constructor.template = null;
    prototype.equals = function(obj) {
        return this.isId((obj).id);
    };
    /**
     *  Retrieves a competency from it's server asynchronously
     * 
     *  @param {String}            id
     *                             ID of the competency to retrieve from the server
     *  @param {Callback1<String>} success
     *                             Callback triggered after retrieving the competency,
     *                             returns the competency retrieved
     *  @param {Callback1<String>} failure
     *                             Callback triggered if error retrieving competency
     *  @memberOf EcCompetency
     *  @method get
     *  @static
     */
    constructor.get = function(id, success, failure) {
        EcRepository.getAs(id, new EcCompetency(), success, failure);
    };
    /**
     *  Retrieves a competency from it's server synchronously, the call
     *  blocks until it is successful or an error occurs
     * 
     *  @param {String} id
     *                  ID of the competency to retrieve
     *  @return EcCompetency
     *  The competency retrieved
     *  @memberOf EcCompetency
     *  @method getBlocking
     *  @static
     */
    constructor.getBlocking = function(id) {
        return EcRepository.getBlockingAs(id, new EcCompetency());
    };
    /**
     *  Searches a repository for competencies that match the search query
     * 
     *  @param {EcRepository}                  repo
     *                                         Repository to search using the query
     *  @param {String}                        query
     *                                         Query string to pass to the search web service
     *  @param {Callback1<Array<EcCompetency>> success
     *                                         Callback triggered after completing the search, returns the results
     *  @param {Callback1<String>}             failure
     *                                         Callback triggered if error searching
     *  @param {Object}                        paramObj
     *                                         Parameter object for search
     *  @memberOf EcCompetency
     *  @method search
     *  @static
     */
    constructor.search = function(repo, query, success, failure, paramObj) {
        EcRepository.searchAs(repo, query, function() {
            return new EcCompetency();
        }, success, failure, paramObj);
    };
    /**
     *  Adds a new alignment on the server specified with this competency as its
     *  source and the specified target competency
     * 
     *  @param {EcCompetency}      target
     *                             Competency to be related with
     *  @param {String}            alignmentType
     *                             String defining the relationship type
     *  @param {EcPpk}             owner
     *                             Private Key that will own the relationship created
     *  @param {String}            server
     *                             URL Prefix of the new relationship (Server it will be saved on)
     *  @param {Callback1<String>} success
     *                             Callback triggered after successfully creating and saving the relationship
     *  @param {Callback1<String>} [failure]
     *                             Callback triggered if error creating and saving relationship
     *  @return EcAlignment
     *  Created relationship
     *  @memberOf EcCompetency
     *  @method addAlignment
     */
    prototype.addAlignment = function(target, alignmentType, owner, serverUrl, success, failure, repo) {
        var a = new EcAlignment();
        if (repo == null || repo.selectedServer.indexOf(serverUrl) != -1) 
            a.generateId(serverUrl);
         else 
            a.generateShortId(serverUrl);
        a.source = this.shortId();
        a.target = target.shortId();
        a.relationType = alignmentType;
        a.addOwner(owner.toPk());
        a.save(success, failure, repo);
        return a;
    };
    /**
     *  Searches the repository given for any relationships that contain this competency
     * 
     *  @param {EcRepository}                  repo
     *                                         Repository to search for relationships
     *  @param {Callback1<EcAlignment>}        eachSuccess
     *                                         Callback triggered for each relationship found
     *  @param {Callback1<String>}             failure
     *                                         Callback triggered if an error finding relationships
     *  @param {Callback1<Array<EcAlignment>>} successAll
     *                                         Callback triggered once all of the relationships have been found
     *  @memberOf EcCompetency
     *  @method relations
     */
    prototype.relations = function(repo, eachSuccess, failure, successAll) {
        this.relationships(repo, eachSuccess, failure, successAll);
    };
    /**
     *  Searches the repository given for any relationships that contain this competency
     * 
     *  @param {EcRepository}                  repo
     *                                         Repository to search for relationships
     *  @param {Callback1<EcAlignment>}        eachSuccess
     *                                         Callback triggered for each relationship found
     *  @param {Callback1<String>}             failure
     *                                         Callback triggered if an error finding relationships
     *  @param {Callback1<Array<EcAlignment>>} successAll
     *                                         Callback triggered once all of the relationships have been found
     *  @memberOf EcCompetency
     *  @method relations
     *  @deprecated
     */
    prototype.relationships = function(repo, eachSuccess, failure, successAll) {
        EcAlignment.search(repo, "source:\"" + this.id + "\" OR target:\"" + this.id + "\" OR source:\"" + this.shortId() + "\" OR target:\"" + this.shortId() + "\"", function(results) {
            for (var i = 0; i < results.length; i++) 
                eachSuccess(results[i]);
            successAll(results);
        }, failure, new Object());
    };
    /**
     *  Adds a new level on the server specified for this competency.
     * 
     *  @param {String}            name
     *                             Name of the new level to create
     *  @param {String}            description
     *                             Description of the new level to create
     *  @param {String}            owner
     *                             Private key of the owner of the new level
     *  @param {String}            server
     *                             URL Prefix for the new level's ID (Server saved on)
     *  @param {Callback1<String>} success
     *                             Callback triggered after successfully creating and saving the level
     *  @param {Callback1<String>} failure
     *                             Callback triggered if an error creating and saving the level
     *  @return EcLevel
     *  Level created
     *  @memberOf EcCompetency
     *  @method addLevel
     */
    prototype.addLevel = function(name, description, owner, serverUrl, success, failure, repo) {
        var l = new EcLevel();
        if (repo == null || repo.selectedServer.indexOf(serverUrl) != -1) 
            l.generateId(serverUrl);
         else 
            l.generateShortId(serverUrl);
        l.competency = this.shortId();
        l.description = description;
        l.name = name;
        l.addOwner(owner.toPk());
        l.save(success, failure, repo);
        return l;
    };
    /**
     *  Searches the repository given for any levels of this competency
     * 
     *  @param {EcRepository}              repo
     *                                     Repository to search for levels
     *  @param {Callback1<EcLevel>}        success
     *                                     Callback triggered for each level found
     *  @param {Callback1<String>}         failure
     *                                     Callback triggered if an error finding levels
     *  @param {Callback1<Array<EcLevel>>} successAll
     *                                     Callback triggered once all of the levels have been found
     *  @memberOf EcCompetency
     *  @method levels
     */
    prototype.levels = function(repo, eachSuccess, failure, successAll) {
        var query = "competency:\"" + this.id + "\" OR competency:\"" + this.shortId() + "\"";
        EcLevel.search(repo, query, function(results) {
            for (var i = 0; i < results.length; i++) 
                eachSuccess(results[i]);
            successAll(results);
        }, failure, new Object());
    };
    /**
     *  Adds a new rollup rule on the server specified for this competency
     * 
     *  @param {String}            name
     *                             Name of the rollup rule to create
     *  @param {String}            description
     *                             Description of the rollup rule to create
     *  @param {EcPpk}             owner
     *                             Private key that will own the new rollup rule
     *  @param {String}            server
     *                             URL Prefix for the new rollup rule's ID (Server that it will be saved on)
     *  @param {Callback1<String>} success
     *                             Callback triggered if successfully save the rollup rule
     *  @param {Callback1<String>} failure
     *                             Callback triggered fi error during save of rollup rule
     *  @return EcRollupRule
     *  Created rollup rule
     *  @memberOf EcCompetency
     *  @method addRollupRule
     */
    prototype.addRollupRule = function(name, description, owner, serverUrl, success, failure, repo) {
        var r = new EcRollupRule();
        if (repo == null) 
            if (repo == null || repo.selectedServer.indexOf(serverUrl) != -1) 
                r.generateId(serverUrl);
             else 
                r.generateShortId(serverUrl);
        r.competency = this.shortId();
        r.description = description;
        r.name = name;
        r.addOwner(owner.toPk());
        r.save(success, failure, repo);
        return r;
    };
    /**
     *  Searches the repository given for any rollup rules of this competency
     * 
     *  @param {EcRepository}                  repo
     *                                         Repository to search for levels
     *  @param {Callback1<EcRollupRule>}       success
     *                                         Callback triggered for each rollup rule found
     *  @param {Callback1<String>}             failure
     *                                         Callback triggered if an error finding rollup rule
     *  @param {Callback1<Array<EcRollupRule>} successAll
     *                                         Callback triggered once all of the rollup rules have been found
     *  @memberOf EcCompetency
     *  @method rollupRules
     */
    prototype.rollupRules = function(repo, eachSuccess, failure, successAll) {
        var query = "competency:\"" + this.id + "\" OR competency:\"" + this.shortId() + "\"";
        EcRollupRule.search(repo, query, function(results) {
            for (var i = 0; i < results.length; i++) 
                eachSuccess(results[i]);
            successAll(results);
        }, failure, new Object());
    };
    /**
     *  Method to set competency scope
     * 
     *  @param {String} scope
     *                  Scope to set for its competency
     *  @memberOf EcCompetency
     *  @method setScope
     */
    prototype.setScope = function(scope) {
        this.scope = scope;
    };
    /**
     *  Saves the competency details to the server
     * 
     *  @param {Callback1<String>} success
     *                             Callback triggered on successfully saving the competency
     *  @param {Callback1<String>} failure
     *                             Callback triggered if error saving competency
     *  @memberOf EcCompetency
     *  @method save
     */
    prototype.save = function(success, failure, repo) {
        if (this.name == null || this.name == "") {
            var msg = "Competency Name can not be empty";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        if (repo == null) 
            EcRepository.save(this, success, failure);
         else 
            repo.saveTo(this, success, failure);
    };
    /**
     *  Deletes the competency from the server
     *  <p>
     *  TODO: Delete rollup rules?
     * 
     *  @param {Callback1<String>} success
     *                             Callback triggered on successful deleting the competency
     *  @param {Callback1<String>} failure
     *                             Callback triggered if error deleting the competency
     *  @param {EcRepository}      repo
     *                             Repository to delete from and to check for levels or relationships to delete
     *  @memberOf EcCompetency
     *  @method _delete
     */
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
                    if (EcCompetency.levelDone[this.id]) {
                        if (success != null) 
                            success("");
                    } else {
                        EcCompetency.relDone[this.id] = true;
                    }
                });
                me.levels(repo, function(p1) {
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
                    if (EcCompetency.relDone[this.id]) {
                        if (success != null) 
                            success("");
                    } else {
                        EcCompetency.levelDone[this.id] = true;
                    }
                });
            } else {
                if (success != null) 
                    success(p1);
            }
        }, failure);
    };
}, {relDone: {name: "Map", arguments: [null, null]}, levelDone: {name: "Map", arguments: [null, null]}, template: "Object", about: "Thing", educationalAlignment: "AlignmentObject", associatedMedia: "MediaObject", funder: "Person", audio: "AudioObject", workExample: "CreativeWork", provider: "Person", encoding: "MediaObject", character: "Person", audience: "Audience", sourceOrganization: "Organization", isPartOf: "CreativeWork", video: "VideoObject", publication: "PublicationEvent", contributor: "Organization", reviews: "Review", hasPart: "CreativeWork", releasedEvent: "PublicationEvent", contentLocation: "Place", aggregateRating: "AggregateRating", locationCreated: "Place", accountablePerson: "Person", spatialCoverage: "Place", offers: "Offer", editor: "Person", copyrightHolder: "Person", recordedAt: "Event", publisher: "Person", interactionStatistic: "InteractionCounter", exampleOfWork: "CreativeWork", mainEntity: "Thing", author: "Person", timeRequired: "Duration", translator: "Person", comment: "Comment", inLanguage: "Language", review: "Review", license: "CreativeWork", encodings: "MediaObject", isBasedOn: "Product", creator: "Person", sponsor: "Organization", producer: "Person", mentions: "Thing", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  Implementation of a Framework object with methods for interacting with CASS
 *  services on a server.
 * 
 *  @author fritz.ray@eduworks.com
 *  @author devlin.junker@eduworks.com
 *  @module org.cassproject
 *  @class EcFramework
 *  @constructor
 *  @extends Framework
 */
var EcFramework = function() {
    Framework.call(this);
    var me = (this);
    if (EcFramework.template != null) {
        var you = (EcFramework.template);
        for (var key in you) {
            if ((typeof you[key]) != "function") 
                me[key.replace("@", "")] = you[key];
        }
    }
};
EcFramework = stjs.extend(EcFramework, Framework, [], function(constructor, prototype) {
    constructor.relDone = {};
    constructor.levelDone = {};
    constructor.template = null;
    prototype.equals = function(obj) {
        return this.isId((obj).id);
    };
    /**
     *  Retrieves a framework from the server, specified by the ID
     * 
     *  @param {String}                 id
     *                                  ID of the framework to retrieve
     *  @param {Callback1<EcFramework>} success
     *                                  Callback triggered after successfully retrieving the framework,
     *                                  returns the retrieved framework
     *  @param {Callback1<String>}      failure
     *                                  Callback triggered if an error occurs while retrieving the framework
     *  @memberOf EcFramework
     *  @method get
     *  @static
     */
    constructor.get = function(id, success, failure) {
        EcRepository.getAs(id, new EcFramework(), success, failure);
    };
    /**
     *  Retrieves a framework from the server in a blocking fashion, specified by the ID
     * 
     *  @param {String}                 id
     *                                  ID of the framework to retrieve
     *  @param {Callback1<EcFramework>} success
     *                                  Callback triggered after successfully retrieving the framework,
     *                                  returns the retrieved framework
     *  @param {Callback1<String>}      failure
     *                                  Callback triggered if an error occurs while retrieving the framework
     *  @memberOf EcFramework
     *  @method getBlocking
     *  @static
     */
    constructor.getBlocking = function(id) {
        return EcRepository.getBlockingAs(id, new EcFramework());
    };
    /**
     *  Searches the repository given for frameworks using the query passed in
     * 
     *  @param {EcRepository}                 repo
     *                                        Repository to search for frameworks
     *  @param {String}                       query
     *                                        Query string used to search for a framework
     *  @param {Callback1<Array<EcFramework>} success
     *                                        Callback triggered when the search successfully returns,
     *                                        returns search results
     *  @param {Callback1<String>}            failure
     *                                        Callback triggered if an error occurs while searching
     *  @param {Object}                       paramObj
     *                                        Parameter object for search
     *  @memberOf EcFramework
     *  @method search
     *  @static
     */
    constructor.search = function(repo, query, success, failure, paramObj) {
        EcRepository.searchAs(repo, query, function() {
            return new EcFramework();
        }, success, failure, paramObj);
    };
    /**
     *  Adds the competency ID specified to the frameworks list of competency IDs
     * 
     *  @param {String} id
     *                  ID of the competency to add
     *  @memberOf EcFramework
     *  @method addCompetency
     */
    prototype.addCompetency = function(id) {
        id = EcRemoteLinkedData.trimVersionFromUrl(id);
        if (this.competency == null) 
            this.competency = new Array();
        for (var i = 0; i < this.competency.length; i++) 
            if (EcRemoteLinkedData.trimVersionFromUrl(this.competency[i]).equals(id)) 
                return;
        this.competency.push(id);
    };
    /**
     *  Removes a competency ID from the framework's list, also removes any
     *  levels and relations associated with that competency
     *  <p>
     *  TODO: remove rollup rules? should we add flag to remove these extras
     * 
     *  @param {String}            id
     *                             ID of the competency to remove
     *  @param {Callback1<String>} success
     *                             Callback triggered after succesfully removing the competency and levels and relationships
     *  @param {Callback1<String>} failure
     *                             Callback triggered if error occurs when removing competency and levels and relationships
     *  @memberOf EcFramework
     *  @method removeCompetency
     */
    prototype.removeCompetency = function(id, success, failure) {
        var shortId = EcRemoteLinkedData.trimVersionFromUrl(id);
        if (this.competency == null) 
            this.competency = new Array();
        for (var i = 0; i < this.competency.length; i++) 
            if (this.competency[i].equals(shortId) || this.competency[i].equals(id)) 
                this.competency.splice(i, 1);
        if ((this.relation == null || this.relation.length == 0) && (this.level == null || this.level.length == 0)) 
            if (success != null) {
                success("");
                return;
            }
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
    /**
     *  Helper method to remove relationships associated with a competency from this framework
     * 
     *  @param {String}            id
     *                             ID of the competency being removed, to find relationships on
     *  @param {int}               i
     *                             recursive index parameter
     *  @param {Callback1<String>} success
     *                             Callback triggered after all relationships in the framework have been checked
     *  @param {Callback1<String>} failure
     *                             Callback triggered if error occurs looking through relationships
     *  @memberOf EcFramework
     *  @method removeRelationshipsThatInclude
     *  @private
     */
    prototype.removeRelationshipsThatInclude = function(id, i, success, failure) {
        var shortId = EcRemoteLinkedData.trimVersionFromUrl(id);
        var me = this;
        if (i >= this.relation.length && success != null) 
            success("");
         else 
            EcAlignment.get(this.relation[i], function(a) {
                if (a != null && a.source == shortId || a.target == shortId || a.source == id || a.target == id) {
                    me.relation.splice(i, 1);
                    me.removeRelationshipsThatInclude(id, i, success, failure);
                } else 
                    me.removeRelationshipsThatInclude(id, i + 1, success, failure);
            }, function(s) {
                me.removeRelationshipsThatInclude(id, i + 1, success, failure);
            });
    };
    /**
     *  Helper method to remove levels associated with a competency from this framework
     * 
     *  @param {String}            id
     *                             ID of the competency being removed, to find levels on
     *  @param {int}               i
     *                             recursive index parameter
     *  @param {Callback1<String>} success
     *                             Callback triggered after all levels in the framework have been checked
     *  @param {Callback1<String>} failure
     *                             Callback triggered if error occurs looking through levels
     *  @memberOf EcFramework
     *  @method removeLevelsThatInclude
     *  @private
     */
    prototype.removeLevelsThatInclude = function(id, i, success, failure) {
        var shortId = EcRemoteLinkedData.trimVersionFromUrl(id);
        var me = this;
        if (i >= this.level.length && success != null) 
            success("");
         else 
            EcLevel.get(this.level[i], function(a) {
                if (a.competency == shortId || a.competency == id) {
                    me.level.splice(i, 1);
                    me.removeLevelsThatInclude(id, i, success, failure);
                } else 
                    me.removeLevelsThatInclude(id, i + 1, success, failure);
            }, function(s) {
                me.removeLevelsThatInclude(id, i + 1, success, failure);
            });
    };
    /**
     *  Adds a relation ID to the framework's list of relations
     * 
     *  @param {String} id
     *                  ID to add to the framework's relation list
     *  @memberOf EcFramework
     *  @method addRelation
     */
    prototype.addRelation = function(id) {
        id = EcRemoteLinkedData.trimVersionFromUrl(id);
        if (this.relation == null) 
            this.relation = new Array();
        for (var i = 0; i < this.relation.length; i++) 
            if (EcRemoteLinkedData.trimVersionFromUrl(this.relation[i]).equals(id)) 
                return;
        this.relation.push(id);
    };
    /**
     *  Removes a relation ID from the framework's list of relations
     * 
     *  @param {String} id
     *                  ID to remove from the framework's relation list
     *  @memberOf EcFramework
     *  @method removeCompetency
     */
    prototype.removeRelation = function(id) {
        id = EcRemoteLinkedData.trimVersionFromUrl(id);
        if (this.relation == null) 
            this.relation = new Array();
        for (var i = 0; i < this.relation.length; i++) 
            if (EcRemoteLinkedData.trimVersionFromUrl(this.relation[i]).equals(id)) 
                this.relation.splice(i, 1);
    };
    /**
     *  Adds a level ID to the framework's list of levels
     * 
     *  @param {String} id
     *                  ID of the level to add to framework's list
     *  @memberOf EcFramework
     *  @method addLevel
     */
    prototype.addLevel = function(id) {
        id = EcRemoteLinkedData.trimVersionFromUrl(id);
        if (this.level == null) 
            this.level = new Array();
        for (var i = 0; i < this.level.length; i++) 
            if (EcRemoteLinkedData.trimVersionFromUrl(this.level[i]).equals(id)) 
                return;
        this.level.push(id);
    };
    /**
     *  Removes a level ID from the framework's list of levels
     * 
     *  @param {String} id
     *                  ID to remove from framework's level list
     *  @memberOf EcFramework
     *  @method removeLevel
     */
    prototype.removeLevel = function(id) {
        id = EcRemoteLinkedData.trimVersionFromUrl(id);
        if (this.level == null) 
            this.level = new Array();
        for (var i = 0; i < this.level.length; i++) 
            if (EcRemoteLinkedData.trimVersionFromUrl(this.level[i]).equals(id)) 
                this.level.splice(i, 1);
    };
    /**
     *  Adds a rollup rule ID to the framework's list of rollup rules
     * 
     *  @param {String} id
     *                  ID of the rollup rule to add
     *  @memberOf EcFramework
     *  @method addRollupRule
     */
    prototype.addRollupRule = function(id) {
        id = EcRemoteLinkedData.trimVersionFromUrl(id);
        if (this.rollupRule == null) 
            this.rollupRule = new Array();
        for (var i = 0; i < this.rollupRule.length; i++) 
            if (EcRemoteLinkedData.trimVersionFromUrl(this.rollupRule[i]).equals(id)) 
                return;
        this.rollupRule.push(id);
    };
    /**
     *  Removes a rollup rule ID from the framework's list of rollup rules
     * 
     *  @param {String} id
     *                  ID to remove from rollup rule list
     *  @memberOf EcFramework
     *  @method removeRollupRule
     */
    prototype.removeRollupRule = function(id) {
        id = EcRemoteLinkedData.trimVersionFromUrl(id);
        if (this.rollupRule == null) 
            this.rollupRule = new Array();
        for (var i = 0; i < this.rollupRule.length; i++) 
            if (EcRemoteLinkedData.trimVersionFromUrl(this.rollupRule[i]).equals(id)) 
                this.rollupRule.splice(i, 1);
    };
    /**
     *  Saves this frameworks details on the server specified by it's ID
     * 
     *  @param {Callback1<String>} success
     *                             Callback triggered after successfully saving the framework
     *  @param {Callback1<String>} failure
     *                             Callback triggered if error occurs while saving the framework
     *  @memberOf EcFramework
     *  @method save
     */
    prototype.save = function(success, failure, repo) {
        if (this.name == null || this.name == "") {
            var msg = "Framework Name Cannot be Empty";
            if (failure != null) 
                failure(msg);
             else 
                console.error(msg);
            return;
        }
        if (repo == null) 
            EcRepository.save(this, success, failure);
         else 
            repo.saveTo(this, success, failure);
    };
    /**
     *  Deletes this framework from the server specified by it's ID
     * 
     *  @param {Callback1<String>} success
     *                             Callback triggered if successfully deleted framework
     *  @param {Callback1<String>} failure
     *                             Callback triggered if error occurs when deleting the framework
     *  @memberOf EcFramework
     *  @method _delete
     */
    prototype._delete = function(success, failure) {
        EcRepository.DELETE(this, success, failure);
    };
    prototype.asAsnJson = function(success, failure, fallbackServerUrl) {
        var id = this.id;
        var server = this.getServerBaseUrl();
        if (server != null && server != undefined && !server.endsWith("/")) {
            server = server + "/";
        }
        EcRemote.getExpectingString(server, "asn?id=" + this.getGuid(), success, function(p1) {
            if (fallbackServerUrl != null && fallbackServerUrl != undefined) {
                var server = fallbackServerUrl;
                if (!server.endsWith("/")) {
                    server = server + "/";
                }
                EcRemote.getExpectingString(server, "asn?id=" + id, success, failure);
            } else {
                failure(p1);
            }
        });
    };
}, {relDone: {name: "Map", arguments: [null, null]}, levelDone: {name: "Map", arguments: [null, null]}, template: "Object", competency: {name: "Array", arguments: [null]}, relation: {name: "Array", arguments: [null]}, level: {name: "Array", arguments: [null]}, rollupRule: {name: "Array", arguments: [null]}, about: "Thing", educationalAlignment: "AlignmentObject", associatedMedia: "MediaObject", funder: "Person", audio: "AudioObject", workExample: "CreativeWork", provider: "Person", encoding: "MediaObject", character: "Person", audience: "Audience", sourceOrganization: "Organization", isPartOf: "CreativeWork", video: "VideoObject", publication: "PublicationEvent", contributor: "Organization", reviews: "Review", hasPart: "CreativeWork", releasedEvent: "PublicationEvent", contentLocation: "Place", aggregateRating: "AggregateRating", locationCreated: "Place", accountablePerson: "Person", spatialCoverage: "Place", offers: "Offer", editor: "Person", copyrightHolder: "Person", recordedAt: "Event", publisher: "Person", interactionStatistic: "InteractionCounter", exampleOfWork: "CreativeWork", mainEntity: "Thing", author: "Person", timeRequired: "Duration", translator: "Person", comment: "Comment", inLanguage: "Language", review: "Review", license: "CreativeWork", encodings: "MediaObject", isBasedOn: "Product", creator: "Person", sponsor: "Organization", producer: "Person", mentions: "Thing", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
