/**
 *  Class used to hold namespace data.
 * 
 *  @author fray
 *  @class Cass
 *  @module org.cassproject
 */
var Cass = function() {};
Cass = stjs.extend(Cass, null, [], function(constructor, prototype) {
    constructor.context_0_1 = "http://schema.eduworks.com/cass/0.1";
    constructor.context_0_2 = "http://schema.eduworks.com/cass/0.2";
    constructor.context_0_3 = "http://schema.cassproject.org/0.2";
    constructor.context_0_4 = "http://schema.cassproject.org/0.3";
    constructor.context = Cass.context_0_4;
}, {}, {});
/**
 *  Competencies include skills, knowledge, abilities, traits, and combinations thereof that are needed to perform a task or job. In CASS, competencies are identified and located using a globally unique ID. Competencies can be further described using titles, descriptions, levels, indicators (coming soon), roll-up rules, and relationships to other competencies.
 * 
 *  @author fritz.ray@eduworks.com
 *  @class Competency
 *  @module org.cassproject
 *  @extends CreativeWork
 */
var Competency = function() {
    CreativeWork.call(this);
    this.setContextAndType(Cass.context, Competency.myType);
};
Competency = stjs.extend(Competency, CreativeWork, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/cass/0.1/competency";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/cass/0.2/competency";
    constructor.TYPE_0_3 = "http://schema.cassproject.org/0.2/Competency";
    constructor.TYPE_0_4 = "http://schema.cassproject.org/0.3/Competency";
    constructor.myType = Competency.TYPE_0_4;
    /**
     *  Scope in which the competency may be applied. e.g. Underwater.
     * 
     *  @property scope
     *  @type string
     */
    prototype.scope = null;
    prototype.upgrade = function() {
        EcLinkedData.prototype.upgrade.call(this);
        if (Competency.TYPE_0_1.equals(this.type)) {
            if (this.url != null && this.sameAs == null) {
                this.sameAs = this.url;
                this.url = null;
            }
            var me = (this);
            if (me["@context"] == null && me["@schema"] != null) 
                me["@context"] = me["@schema"];
            this.setContextAndType(Cass.context_0_2, Competency.TYPE_0_2);
        }
        if (Competency.TYPE_0_2.equals(this.getFullType())) {
            this.setContextAndType(Cass.context_0_3, Competency.TYPE_0_3);
        }
        if (Competency.TYPE_0_3.equals(this.getFullType())) {
            this.setContextAndType(Cass.context_0_4, Competency.TYPE_0_4);
        }
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(Competency.TYPE_0_4);
        a.push(Competency.TYPE_0_3);
        a.push(Competency.TYPE_0_2);
        a.push(Competency.TYPE_0_1);
        return a;
    };
}, {contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  When an individual's performance in a competency can be measured, a level specifies milestones that an individual can reach, creating fine-grained distinction between the proficient and the adept.
 * 
 *  @author fritz.ray@eduworks.com
 *  @class Level
 *  @module org.cassproject
 *  @extends CreativeWork
 */
var Level = function() {
    CreativeWork.call(this);
    this.setContextAndType(Cass.context, Level.myType);
};
Level = stjs.extend(Level, CreativeWork, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/cass/0.1/level";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/cass/0.2/level";
    constructor.TYPE_0_3 = "http://schema.cassproject.org/0.2/Level";
    constructor.TYPE_0_4 = "http://schema.cassproject.org/0.3/Level";
    constructor.myType = Level.TYPE_0_4;
    /**
     *  Specifies the URL of the competency this level relates to.
     * 
     *  @property competency
     *  @type string(URL)
     */
    prototype.competency = null;
    /**
     *  The title that one who holds this performance level may assume.
     * 
     *  @property title
     *  @type string
     */
    prototype.title = null;
    /**
     *  The performance characteristics required by this level in text form.
     *  FR - Represented by description.
     * 
     *  @property performance
     *  @type string
     */
    prototype.performance = null;
    prototype.upgrade = function() {
        EcLinkedData.prototype.upgrade.call(this);
        if (Level.TYPE_0_1.equals(this.type)) {
            var me = (this);
            if (me["@context"] == null && me["@schema"] != null) 
                me["@context"] = me["@schema"];
            this.setContextAndType(Cass.context_0_2, Level.TYPE_0_2);
        }
        if (Level.TYPE_0_2.equals(this.getFullType())) {
            this.setContextAndType(Cass.context_0_3, Level.TYPE_0_3);
        }
        if (Level.TYPE_0_3.equals(this.getFullType())) {
            this.setContextAndType(Cass.context_0_4, Level.TYPE_0_4);
        }
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(Level.TYPE_0_4);
        a.push(Level.TYPE_0_3);
        a.push(Level.TYPE_0_2);
        a.push(Level.TYPE_0_1);
        return a;
    };
}, {contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  A segment of script that defines in a domain specific language how competence is transferred from one competency to another.
 * 
 *  @author fritz.ray@eduworks.com
 *  @class RollupRule
 *  @module org.cassproject
 *  @extends CreativeWork
 */
var RollupRule = function() {
    CreativeWork.call(this);
    this.setContextAndType(Cass.context, RollupRule.myType);
};
RollupRule = stjs.extend(RollupRule, CreativeWork, [], function(constructor, prototype) {
    constructor.TYPE_0_2 = "http://schema.eduworks.com/cass/0.2/rollupRule";
    constructor.TYPE_0_3 = "http://schema.cassproject.org/0.2/RollupRule";
    constructor.TYPE_0_4 = "http://schema.cassproject.org/0.3/RollupRule";
    constructor.myType = RollupRule.TYPE_0_4;
    /**
     *  The rollup rule encoded as source code that is understandable to the assertion processor.
     * 
     *  @property rule
     *  @type string
     */
    prototype.rule = null;
    /**
     *  Specifies the URL of the competency that the rollup rule pertains to.
     * 
     *  @property competency
     *  @type string
     */
    prototype.competency = null;
    prototype.upgrade = function() {
        EcLinkedData.prototype.upgrade.call(this);
        if (RollupRule.TYPE_0_2.equals(this.getFullType())) {
            this.setContextAndType(Cass.context_0_3, RollupRule.TYPE_0_3);
        }
        if (RollupRule.TYPE_0_3.equals(this.getFullType())) {
            this.setContextAndType(Cass.context_0_4, RollupRule.TYPE_0_4);
        }
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(RollupRule.TYPE_0_4);
        a.push(RollupRule.TYPE_0_3);
        a.push(RollupRule.TYPE_0_2);
        return a;
    };
}, {contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  A Competency Framework or simply Framework is a collection of competencies and relations between competencies in the framework and potentially between competencies in the framework and competencies in other frameworks. In practice, a Framework represents competencies related to a specific job, task, organization, career, knowledge domain, etc.
 * 
 *  @author fritz.ray@eduworks.com
 *  @class Framework
 *  @module org.cassproject
 *  @extends CreativeWork
 */
var Framework = function() {
    CreativeWork.call(this);
    this.setContextAndType(Cass.context, Framework.myType);
};
Framework = stjs.extend(Framework, CreativeWork, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/cass/0.1/framework";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/cass/0.2/framework";
    constructor.TYPE_0_3 = "http://schema.cassproject.org/0.2/Framework";
    constructor.TYPE_0_4 = "http://schema.cassproject.org/0.3/Framework";
    constructor.myType = Framework.TYPE_0_4;
    /**
     *  URLs of competencies included in this framework.
     * 
     *  @property competency
     *  @type string[]
     */
    prototype.competency = null;
    /**
     *  URLs of relations included in this framework.
     * 
     *  @property relation
     *  @type string[]
     */
    prototype.relation = null;
    /**
     *  URLs of levels included in this framework.
     * 
     *  @property level
     *  @type string[]
     */
    prototype.level = null;
    /**
     *  URLs of RollupRules included in this framework.
     * 
     *  @property rollupRule
     *  @type string[]
     */
    prototype.rollupRule = null;
    prototype.upgrade = function() {
        EcLinkedData.prototype.upgrade.call(this);
        if (Framework.TYPE_0_1.equals(this.type)) {
            var me = (this);
            if (me["@context"] == null && me["@schema"] != null) 
                me["@context"] = me["@schema"];
            this.setContextAndType(Cass.context_0_2, Framework.TYPE_0_2);
        }
        if (Framework.TYPE_0_2.equals(this.getFullType())) {
            this.setContextAndType(Cass.context_0_3, Framework.TYPE_0_3);
        }
        if (Framework.TYPE_0_3.equals(this.getFullType())) {
            this.setContextAndType(Cass.context_0_4, Framework.TYPE_0_4);
        }
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(Framework.TYPE_0_4);
        a.push(Framework.TYPE_0_3);
        a.push(Framework.TYPE_0_2);
        a.push(Framework.TYPE_0_1);
        return a;
    };
}, {competency: {name: "Array", arguments: [null]}, relation: {name: "Array", arguments: [null]}, level: {name: "Array", arguments: [null]}, rollupRule: {name: "Array", arguments: [null]}, contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  A relation between two objects.
 * 
 *  @author fritz.ray@eduworks.com
 *  @class Relation
 *  @module org.cassproject
 *  @extends CreativeWork
 */
var Relation = function() {
    CreativeWork.call(this);
    this.setContextAndType(Cass.context, Relation.myType);
};
Relation = stjs.extend(Relation, CreativeWork, [], function(constructor, prototype) {
    /**
     *  Relation type when one object enables the capability to obtain another.
     *  Enabling relations do not imply a requirement, but makes the acquisition of the source much easier.
     * 
     *  @property IS_ENABLED_BY
     *  @static
     *  @type string
     */
    constructor.IS_ENABLED_BY = "isEnabledBy";
    /**
     *  Relation type when one object requires another.
     *  Requiring relations are strict.
     * 
     *  @property REQUIRES
     *  @static
     *  @type string
     */
    constructor.REQUIRES = "requires";
    /**
     *  Relation type when one object desires another.
     *  Desire relations improve the range of applicability or improve performance of the source.
     * 
     *  @property DESIRES
     *  @static
     *  @type string
     */
    constructor.DESIRES = "desires";
    /**
     *  Relation type when one object is a subset of another.
     *  Narrows relations are strict, and represent a super/sub relation.
     * 
     *  @property NARROWS
     *  @static
     *  @type string
     */
    constructor.NARROWS = "narrows";
    /**
     *  Relation type when one object is related to another.
     *  Related relations provide linkages that do not necessarily carry information.
     *  Related relations are bidirectional.
     * 
     *  @property IS_RELATED_TO
     *  @static
     *  @type string
     */
    constructor.IS_RELATED_TO = "isRelatedTo";
    /**
     *  Relation type when one object is equivalent to another.
     *  Equivalent relations define two objects that are effectively equivalent.
     *  Equivalent relations are bidirectional.
     * 
     *  @property IS_RELATED_TO
     *  @static
     *  @type string
     */
    constructor.IS_EQUIVALENT_TO = "isEquivalentTo";
    constructor.TYPE_0_1 = "http://schema.eduworks.com/cass/0.1/relation";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/cass/0.2/relation";
    constructor.TYPE_0_3 = "http://schema.cassproject.org/0.2/Relation";
    constructor.TYPE_0_4 = "http://schema.cassproject.org/0.3/Relation";
    constructor.myType = Relation.TYPE_0_4;
    /**
     *  URL of the object at the beginning of the relation.
     *  A <relation> B, this is A.
     * 
     *  @property source
     *  @type string(url)
     */
    prototype.source = null;
    /**
     *  URL of the object at the end of the relation.
     *  A <relation> B, this is B.
     * 
     *  @property target
     *  @type string(url)
     */
    prototype.target = null;
    /**
     *  URL or controlled vocabulary of the relation.
     *  A <relation> B, this is <relation>.
     * 
     *  @property relationType
     *  @type string | URL
     */
    prototype.relationType = null;
    /**
     *  Date time in ISO 8601 format at which the relation may be observed.
     * 
     *  @property validFrom
     *  @type string
     */
    prototype.validFrom = null;
    /**
     *  Date time in ISO 8601 format at which the relation may no longer be observed.
     * 
     *  @property validThrough
     *  @type string
     */
    prototype.validThrough = null;
    prototype.upgrade = function() {
        EcLinkedData.prototype.upgrade.call(this);
        if ("isEquivalenTo" == this.relationType) 
            this.relationType = Relation.IS_EQUIVALENT_TO;
        if (Relation.TYPE_0_1 == this.type) {
            var me = (this);
            if (me["@context"] == null && me["@schema"] != null) 
                me["@context"] = me["@schema"];
            this.setContextAndType(Cass.context_0_2, Relation.TYPE_0_2);
        }
        if (Relation.TYPE_0_2 == this.getFullType()) {
            this.setContextAndType(Cass.context_0_3, Relation.TYPE_0_3);
        }
        if (Relation.TYPE_0_3 == this.getFullType()) {
            this.setContextAndType(Cass.context_0_4, Relation.TYPE_0_4);
        }
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(Relation.TYPE_0_4);
        a.push(Relation.TYPE_0_3);
        a.push(Relation.TYPE_0_2);
        a.push(Relation.TYPE_0_1);
        return a;
    };
}, {contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  A claim of competence in CASS is called an Assertion. It states with some confidence that an individual has mastered a competency at a given level, provides evidence of such mastery, and records data such as the time of assertion and the party making the assertion.
 * 
 *  @author fritz.ray@eduworks.com
 *  @class Assertion
 *  @module org.cassproject
 *  @extends CreativeWork
 */
var Assertion = function() {
    CreativeWork.call(this);
    this.setContextAndType(Cass.context, Assertion.myType);
};
Assertion = stjs.extend(Assertion, CreativeWork, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/cass/0.1/assertion";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/cass/0.2/assertion";
    constructor.TYPE_0_3 = "http://schema.cassproject.org/0.2/Assertion";
    constructor.TYPE_0_4 = "http://schema.cassproject.org/0.3/Assertion";
    constructor.myType = Assertion.TYPE_0_4;
    /**
     *  URL of the competency.
     * 
     *  @property competency
     *  @type string(URL)
     */
    prototype.competency = null;
    /**
     *  URL of the framework within which the assertion is restricted.
     * 
     *  @property framework
     *  @type string(URL)
     */
    prototype.framework = null;
    /**
     *  URL of the level, or null if 'held with no performance expectations'.
     * 
     *  @property level
     *  @type string
     */
    prototype.level = null;
    /**
     *  Confidence with which the assertion was made.
     *  Confidence has many interpretations, one possibility is the probability that the individual could demonstrate the competency again.
     * 
     *  @property confidence
     *  @type float [0,1]
     */
    prototype.confidence = null;
    /**
     *  Public Key in PEM format of the recipient of the assertion.
     * 
     *  @property subject
     *  @type EcEncryptedValue<Public Key PEM>
     */
    prototype.subject = null;
    /**
     *  Public Key in PEM format of the identity making the assertion.
     * 
     *  @property agent
     *  @type EcEncryptedValue<Public Key PEM>
     */
    prototype.agent = null;
    /**
     *  Encrypted evidence. May be a string, URL or schema.org/Thing.
     * 
     *  @property evidence
     *  @type EcEncryptedValue<string | URL | Thing>[]
     */
    prototype.evidence = null;
    /**
     *  Time that the assertion was made in milliseconds since the Unix Epoch.
     * 
     *  @property assertionDate
     *  @type EcEncryptedValue<long>
     */
    prototype.assertionDate = null;
    /**
     *  Time that the assertion expires, specified in milliseconds since the Unix Epoch.
     * 
     *  @property expirationDate
     *  @type EcEncryptedValue<long>
     */
    prototype.expirationDate = null;
    /**
     *  Describes the slope of the line from the initial confidence at the assertion date and the expiration date. t is a number between [0,1] representing the percentage of time that has elapsed. Examples include t^2 and ln(t).
     * 
     *  @property decayFunction
     *  @type EcEncryptedValue<string>
     */
    prototype.decayFunction = null;
    /**
     *  True if the assertion is a claim that the subject cannot demonstrate the competency.
     * 
     *  @property negative
     *  @type EcEncryptedValue<boolean>
     */
    prototype.negative = null;
    prototype.getSubject = function() {
        return EcPk.fromPem(this.subject);
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
            if (this.subject.owner != null) 
                owners.concat(this.subject.owner);
            if (this.subject.reader != null) 
                readers.concat(this.subject.reader);
        }
        if (this.owner != null) 
            owners = owners.concat(this.owner);
        readers.push(pk.toPem());
        this.subject = pk.toPem();
    };
    prototype.getSubjectAsync = function(success, failure) {
        success(EcPk.fromPem(this.subject));
    };
    prototype.getAgent = function() {
        return EcPk.fromPem(this.agent);
    };
    prototype.setAgent = function(pk) {
        this.agent = pk.toPem();
    };
    prototype.getAgentAsync = function(success, failure) {
        success(EcPk.fromPem(this.agent));
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
    prototype.getSubjectNameAsync = function(success, failure) {
        if (this.subject == null) {
            success("Nobody");
            return;
        }
        this.getSubjectAsync(function(subjectPk) {
            var identity = EcIdentityManager.getIdentity(subjectPk);
            if (identity != null && identity.displayName != null) {
                success(identity.displayName + " (You)");
                return;
            }
            var contact = EcIdentityManager.getContact(subjectPk);
            if (contact == null || contact.displayName == null) {
                success("Unknown Subject");
                return;
            }
            success(contact.displayName);
        }, failure);
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
    prototype.getAgentNameAsync = function(success, failure) {
        if (this.subject == null) {
            success("Nobody");
            return;
        }
        this.getAgentAsync(function(subjectPk) {
            var identity = EcIdentityManager.getIdentity(subjectPk);
            if (identity != null && identity.displayName != null) {
                success(identity.displayName + " (You)");
                return;
            }
            var contact = EcIdentityManager.getContact(subjectPk);
            if (contact == null || contact.displayName == null) {
                success("Unknown Agent");
                return;
            }
            success(contact.displayName);
        }, failure);
    };
    prototype.getAssertionDate = function() {
        return this.assertionDate;
    };
    prototype.setAssertionDate = function(assertionDateMs) {
        this.assertionDate = assertionDateMs;
    };
    prototype.getAssertionDateAsync = function(success, failure) {
        success(this.assertionDate);
    };
    prototype.getExpirationDate = function() {
        return this.expirationDate;
    };
    prototype.setExpirationDate = function(expirationDateMs) {
        this.expirationDate = expirationDateMs;
    };
    prototype.getExpirationDateAsync = function(success, failure) {
        success(this.expirationDate);
    };
    prototype.getEvidenceCount = function() {
        if (this.evidence == null) 
            return 0;
        return this.evidence.length;
    };
    prototype.getEvidence = function(index) {
        return this.evidence[index];
    };
    prototype.getEvidenceAsync = function(index, success, failure) {
        success(this.evidence[index]);
    };
    prototype.getDecayFunction = function() {
        return this.decayFunction;
    };
    prototype.setDecayFunction = function(decayFunctionText) {
        this.decayFunction = decayFunctionText;
    };
    prototype.getDecayFunctionAsync = function(success, failure) {
        success(this.decayFunction);
    };
    prototype.getNegative = function() {
        return "true".equals(this.negative);
    };
    prototype.setNegative = function(negativeB) {
        this.negative = negativeB;
    };
    prototype.getNegativeAsync = function(success, failure) {
        success("true".equals(this.negative));
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
        this.evidence = evidences;
    };
    prototype.upgrade = function() {
        EcLinkedData.prototype.upgrade.call(this);
        if (Assertion.TYPE_0_1.equals(this.type)) {
            var me = (this);
            if (me["@context"] == null && me["@schema"] != null) 
                me["@context"] = me["@schema"];
            this.setContextAndType(Cass.context_0_2, Assertion.TYPE_0_2);
        }
        if (Assertion.TYPE_0_2.equals(this.getFullType())) {
            this.setContextAndType(Cass.context_0_3, Assertion.TYPE_0_3);
        }
        if (Assertion.TYPE_0_3.equals(this.getFullType())) {
            this.setContextAndType(Cass.context_0_4, Assertion.TYPE_0_4);
        }
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(Assertion.TYPE_0_4);
        a.push(Assertion.TYPE_0_3);
        a.push(Assertion.TYPE_0_2);
        a.push(Assertion.TYPE_0_1);
        return a;
    };
}, {subject: "EcEncryptedValue", agent: "EcEncryptedValue", evidence: {name: "Array", arguments: ["EcEncryptedValue"]}, assertionDate: "EcEncryptedValue", expirationDate: "EcEncryptedValue", decayFunction: "EcEncryptedValue", negative: "EcEncryptedValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
