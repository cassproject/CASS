var Thing = function() {
    EcRemoteLinkedData.call(this, "http://schema.org/", "Thing");
};
Thing = stjs.extend(Thing, EcRemoteLinkedData, [], function(constructor, prototype) {
    constructor.newThing = function() {
        return new Thing().toJson();
    };
    prototype.name = null;
    prototype.description = null;
    prototype.alternateName = null;
    prototype.url = null;
    prototype.sameAs = null;
    prototype.mainEntityOfPage = null;
    prototype.image = null;
    prototype.additionalType = null;
}, {mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
var EntryPoint = function() {
    Thing.call(this);
};
EntryPoint = stjs.extend(EntryPoint, Thing, [], function(constructor, prototype) {
    prototype.actionApplication = null;
    prototype.actionPlatform = null;
    prototype.contentType = null;
    prototype.encodingType = null;
    prototype.httpMethod = null;
    prototype.urlTemplate = null;
}, {actionApplication: "Object", mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  Schema.org/CreativeWork
 *  @author schema.org
 *  @class CreativeWork
 *  @extends Thing
 */
var CreativeWork = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    Thing.call(this);
    this.context = "http://schema.org/";
    this.type = "CreativeWork";
};
CreativeWork = stjs.extend(CreativeWork, Thing, [], function(constructor, prototype) {
    /**
     *  Schema.org/about
     *  @property about
     *  @type Thing
     */
    prototype.about = null;
    /**
     *  Schema.org/accessibilityAPI
     *  @property accessibilityAPI
     *  @type string
     */
    prototype.accessibilityAPI = null;
    /**
     *  Schema.org/accessibilityControl
     *  @property accessibilityControl
     *  @type string
     */
    prototype.accessibilityControl = null;
    /**
     *  Schema.org/accessibilityFeature
     *  @property accessibilityFeature
     *  @type string
     */
    prototype.accessibilityFeature = null;
    /**
     *  Schema.org/accessibilityHazard
     *  @property accessibilityHazard
     *  @type string
     */
    prototype.accessibilityHazard = null;
    /**
     *  Schema.org/accountablePerson
     *  @property accountablePerson
     *  @type Person
     */
    prototype.accountablePerson = null;
    /**
     *  Schema.org/aggregateRating
     *  @property aggregateRating
     *  @type AggregateRating
     */
    prototype.aggregateRating = null;
    /**
     *  Schema.org/alternativeHeadline
     *  @property alternativeHeadline
     *  @type string
     */
    prototype.alternativeHeadline = null;
    /**
     *  Schema.org/associatedMedia
     *  @property associatedMedia
     *  @type MediaObject
     */
    prototype.associatedMedia = null;
    /**
     *  Schema.org/audience
     *  @property audience
     *  @type Audience
     */
    prototype.audience = null;
    /**
     *  Schema.org/audio
     *  @property audio
     *  @type AudioObject
     */
    prototype.audio = null;
    /**
     *  Schema.org/author
     *  @property author
     *  @type Person | Organization
     */
    prototype.author = null;
    /**
     *  Schema.org/award
     *  @property award
     *  @type string
     */
    prototype.award = null;
    /**
     *  Schema.org/character
     *  @property character
     *  @type Person
     */
    prototype.character = null;
    /**
     *  Schema.org/citation
     *  @property citation
     *  @type CreativeWork | string
     */
    prototype.citation = null;
    /**
     *  Schema.org/comment
     *  @property comment
     *  @type Comment
     */
    prototype.comment = null;
    /**
     *  Schema.org/commentCount
     *  @property commentCount
     *  @type integer
     */
    prototype.commentCount = null;
    /**
     *  Schema.org/contentLocation
     *  @property contentLocation
     *  @type Place
     */
    prototype.contentLocation = null;
    /**
     *  Schema.org/contentRating
     *  @property contentRating
     *  @type Person
     */
    prototype.contentRating = null;
    /**
     *  Schema.org/contributor
     *  @property contributor
     *  @type Person
     */
    prototype.contributor = null;
    /**
     *  Schema.org/copyrightHolder
     *  @property copyrightHolder
     *  @type Person
     */
    prototype.copyrightHolder = null;
    /**
     *  Schema.org/copyrightYear
     *  @property copyrightYear
     *  @type Person
     */
    prototype.copyrightYear = null;
    /**
     *  Schema.org/creator
     *  @property creator
     *  @type Person
     */
    prototype.creator = null;
    /**
     *  Schema.org/dateCreated
     *  @property dateCreated
     *  @type Person
     */
    prototype.dateCreated = null;
    /**
     *  Schema.org/dateModified
     *  @property dateModified
     *  @type Person
     */
    prototype.dateModified = null;
    /**
     *  Schema.org/datePublished
     *  @property datePublished
     *  @type Person
     */
    prototype.datePublished = null;
    /**
     *  Schema.org/discussionUrl
     *  @property discussionUrl
     *  @type Person
     */
    prototype.discussionUrl = null;
    /**
     *  Schema.org/editor
     *  @property editor
     *  @type Person
     */
    prototype.editor = null;
    /**
     *  Schema.org/educationalAlignment
     *  @property educationalAlignment
     *  @type Person
     */
    prototype.educationalAlignment = null;
    /**
     *  Schema.org/educationalUse
     *  @property educationalUse
     *  @type Person
     */
    prototype.educationalUse = null;
    /**
     *  Schema.org/encoding
     *  @property encoding
     *  @type Person
     */
    prototype.encoding = null;
    /**
     *  Schema.org/exampleOfWork
     *  @property exampleOfWork
     *  @type Person
     */
    prototype.exampleOfWork = null;
    /**
     *  Schema.org/fileFormat
     *  @property fileFormat
     *  @type Person
     */
    prototype.fileFormat = null;
    /**
     *  Schema.org/genre
     *  @property genre
     *  @type Person
     */
    prototype.genre = null;
    /**
     *  Schema.org/hasPart
     *  @property hasPart
     *  @type Person
     */
    prototype.hasPart = null;
    /**
     *  Schema.org/headline
     *  @property headline
     *  @type Person
     */
    prototype.headline = null;
    /**
     *  Schema.org/inLanguage
     *  @property inLanguage
     *  @type Person
     */
    prototype.inLanguage = null;
    /**
     *  Schema.org/interactionStatistic
     *  @property interactionStatistic
     *  @type Person
     */
    prototype.interactionStatistic = null;
    /**
     *  Schema.org/interactivityType
     *  @property interactivityType
     *  @type Person
     */
    prototype.interactivityType = null;
    /**
     *  Schema.org/isBasedOnUrl
     *  @property isBasedOnUrl
     *  @type Person
     */
    prototype.isBasedOnUrl = null;
    /**
     *  Schema.org/character
     *  @property character
     *  @type Person
     */
    prototype.isFamilyFriendly = null;
    /**
     *  Schema.org/character
     *  @property character
     *  @type Person
     */
    prototype.isPartOf = null;
    /**
     *  Schema.org/character
     *  @property character
     *  @type Person
     */
    prototype.keywords = null;
    /**
     *  Schema.org/character
     *  @property character
     *  @type Person
     */
    prototype.learningResourceType = null;
    /**
     *  Schema.org/character
     *  @property character
     *  @type Person
     */
    prototype.license = null;
    /**
     *  Schema.org/character
     *  @property character
     *  @type Person
     */
    prototype.locationCreated = null;
    /**
     *  Schema.org/character
     *  @property character
     *  @type Person
     */
    prototype.mainEntity = null;
    /**
     *  Schema.org/character
     *  @property character
     *  @type Person
     */
    prototype.mentions = null;
    /**
     *  Schema.org/character
     *  @property character
     *  @type Person
     */
    prototype.offers = null;
    /**
     *  Schema.org/character
     *  @property character
     *  @type Person
     */
    prototype.position = null;
    /**
     *  Schema.org/character
     *  @property character
     *  @type Person
     */
    prototype.producer = null;
    /**
     *  Schema.org/character
     *  @property character
     *  @type Person
     */
    prototype.provider = null;
    /**
     *  Schema.org/character
     *  @property character
     *  @type Person
     */
    prototype.publication = null;
    /**
     *  Schema.org/character
     *  @property character
     *  @type Person
     */
    prototype.publisher = null;
    /**
     *  Schema.org/character
     *  @property character
     *  @type Person
     */
    prototype.publishingPrinciples = null;
    /**
     *  Schema.org/character
     *  @property character
     *  @type Person
     */
    prototype.recordedAt = null;
    /**
     *  Schema.org/character
     *  @property character
     *  @type Person
     */
    prototype.releasedEvent = null;
    /**
     *  Schema.org/character
     *  @property character
     *  @type Person
     */
    prototype.review = null;
    /**
     *  Schema.org/character
     *  @property character
     *  @type Person
     */
    prototype.schemaVersion = null;
    /**
     *  Schema.org/character
     *  @property character
     *  @type Person
     */
    prototype.sourceOrganization = null;
    /**
     *  Schema.org/character
     *  @property character
     *  @type Person
     */
    prototype.text = null;
    /**
     *  Schema.org/character
     *  @property character
     *  @type Person
     */
    prototype.thumbnailUrl = null;
    /**
     *  Schema.org/character
     *  @property character
     *  @type Person
     */
    prototype.timeRequired = null;
    /**
     *  Schema.org/character
     *  @property character
     *  @type Person
     */
    prototype.translator = null;
    /**
     *  Schema.org/character
     *  @property character
     *  @type Person
     */
    prototype.typicalAgeRange = null;
    /**
     *  Schema.org/character
     *  @property character
     *  @type Person
     */
    prototype.version = null;
    /**
     *  Schema.org/character
     *  @property character
     *  @type Person
     */
    prototype.video = null;
    /**
     *  Schema.org/character
     *  @property character
     *  @type Person
     */
    prototype.workExample = null;
}, {about: "Thing", accountablePerson: "Person", aggregateRating: "Object", associatedMedia: "Object", audience: "Object", audio: "Object", author: "Thing", character: "Person", citation: "Object", comment: "Object", contentLocation: "Object", contributor: "Thing", copyrightHolder: "Thing", creator: "Thing", dateCreated: "Date", dateModified: "Date", datePublished: "Date", editor: "Person", educationalAlignment: "AlignmentObject", encoding: "Object", exampleOfWork: "CreativeWork", hasPart: "CreativeWork", interactionStatistic: "Object", isPartOf: "CreativeWork", license: "Object", locationCreated: "Object", mainEntity: "Thing", mentions: "Thing", offers: "Object", position: "Object", producer: "Thing", provider: "Thing", publication: "Object", publisher: "Thing", recordedAt: "Object", releasedEvent: "Object", review: "Object", sourceOrganization: "Organization", timeRequired: "Object", translator: "Thing", video: "Object", workExample: "CreativeWork", mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  Schema.org/AlignmentObject
 *  @author schema.org
 *  @class AlignmentObject
 *  @extends Thing
 */
var AlignmentObject = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    Thing.call(this);
    this.context = "http://schema.org/";
    this.type = "AlignmentObject";
};
AlignmentObject = stjs.extend(AlignmentObject, Thing, [], function(constructor, prototype) {
    /**
     *  Schema.org/alignmentType
     *  @property alignmentType
     *  @type string
     */
    prototype.alignmentType = null;
    /**
     *  Schema.org/educationalFramework
     *  @property educationalFramework
     *  @type string
     */
    prototype.educationalFramework = null;
    /**
     *  Schema.org/targetDescription
     *  @property targetDescription
     *  @type string
     */
    prototype.targetDescription = null;
    /**
     *  Schema.org/targetName
     *  @property targetName
     *  @type string
     */
    prototype.targetName = null;
    /**
     *  Schema.org/targetUrl
     *  @property targetUrl
     *  @type URL
     */
    prototype.targetUrl = null;
}, {mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
var Demand = function() {
    Thing.call(this);
    this.context = "http://schema.org/";
    this.type = "Demand";
};
Demand = stjs.extend(Demand, Thing, [], function(constructor, prototype) {
    prototype.acceptedPaymentMethod = null;
    prototype.areaServed = null;
    prototype.availabilityEnds = null;
    prototype.availabilityStarts = null;
    prototype.eligibleTransactionVolume = null;
    prototype.gtin12 = null;
    prototype.gtin13 = null;
    prototype.gtin14 = null;
    prototype.gtin8 = null;
    prototype.inventoryLevel = null;
    prototype.itemOffered = null;
    prototype.mpn = null;
    prototype.seller = null;
    prototype.serialNumber = null;
    prototype.sku = null;
    prototype.validFrom = null;
    prototype.validThrough = null;
}, {acceptedPaymentMethod: "Thing", areaServed: "Thing", availabilityEnds: "Date", availabilityStarts: "Date", eligibleTransactionVolume: "Thing", inventoryLevel: "Thing", itemOffered: "Service", seller: "Thing", validFrom: "Date", validThrough: "Date", mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  Schema.org/Person.
 *  @author schema.org
 *  @class Person
 */
var Person = function() {
    Thing.call(this);
    this.context = "http://schema.org/";
    this.type = "Person";
};
Person = stjs.extend(Person, Thing, [], function(constructor, prototype) {
    prototype.additionalName = null;
    prototype.address = null;
    prototype.affiliation = null;
    prototype.alumniOf = null;
    prototype.award = null;
    prototype.birthDate = null;
    prototype.birthPlace = null;
    prototype.brand = null;
    prototype.children = null;
    prototype.colleague = null;
    prototype.contactPoint = null;
    prototype.deathdate = null;
    prototype.deathPlace = null;
    prototype.duns = null;
    prototype.email = null;
    prototype.familyName = null;
    prototype.faxNumber = null;
    prototype.follows = null;
    prototype.gender = null;
    prototype.givenName = null;
    prototype.globalLocationNumber = null;
    prototype.hasOfferCatalog = null;
    prototype.hasPOS = null;
    prototype.height = null;
    prototype.homeLocation = null;
    prototype.honorificPrefix = null;
    prototype.honorificSuffix = null;
    prototype.isicV4 = null;
    prototype.jobTitle = null;
    prototype.knows = null;
    prototype.makesOffer = null;
    prototype.memberOf = null;
    prototype.naics = null;
    prototype.nationality = null;
    prototype.netWorth = null;
    prototype.owns = null;
    prototype.parent = null;
    prototype.performerIn = null;
    prototype.relatedTo = null;
    prototype.seeks = null;
    prototype.sibling = null;
    prototype.spouse = null;
    prototype.taxID = null;
    prototype.telephone = null;
    prototype.vatID = null;
    prototype.weight = null;
    prototype.workLocation = null;
    prototype.worksFor = null;
}, {affiliation: "Organization", alumniOf: "Organization", birthDate: "Date", birthPlace: "Object", brand: "Object", children: "Person", colleague: "Person", contactPoint: "Object", deathdate: "Date", deathPlace: "Object", follows: "Person", hasOfferCatalog: "Object", hasPOS: "Object", height: "Object", homeLocation: "Object", knows: "Person", makesOffer: "Object", memberOf: "Object", nationality: "Object", netWorth: "Object", owns: "Object", parent: "Person", performerIn: "Object", relatedTo: "Person", seeks: "Demand", sibling: "Person", spouse: "Person", weight: "Object", workLocation: "Object", worksFor: "Organization", mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
var Service = function() {
    Thing.call(this);
    this.context = "http://schema.org/";
    this.type = "Service";
};
Service = stjs.extend(Service, Thing, [], function(constructor, prototype) {
    prototype.areaServed = null;
    prototype.award = null;
    prototype.brand = null;
    prototype.category = null;
    prototype.isRelatedTo = null;
    prototype.isSimilarTo = null;
    prototype.logo = null;
    prototype.provider = null;
    prototype.providerMobility = null;
    prototype.serviceOutput = null;
    prototype.serviceType = null;
}, {areaServed: "Thing", brand: "Organization", category: "Thing", isRelatedTo: "Thing", isSimilarTo: "Thing", logo: "Thing", provider: "Person", serviceOutput: "Thing", mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  Schema.org/Action
 *  @author schema.org
 *  @class Action
 *  @extends Thing
 */
var Action = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    Thing.call(this);
    this.context = "http://schema.org/";
    this.type = "Action";
};
Action = stjs.extend(Action, Thing, [], function(constructor, prototype) {
    /**
     *  Schema.org/agent
     *  @property agent
     *  @type Person | URL
     */
    prototype.agent = null;
    /**
     *  Schema.org/endTime
     *  @property endTime
     *  @type DateTime
     */
    prototype.endTime = null;
    /**
     *  Schema.org/startTime
     *  @property startTime
     *  @type DateTime
     */
    prototype.startTime = null;
    /**
     *  Schema.org/target
     *  @property target
     *  @type EntryPoint
     */
    prototype.target = null;
    /**
     *  Schema.org/error
     *  @property error
     *  @type Thing
     */
    prototype.error = null;
    /**
     *  Schema.org/instrument
     *  @property instrument
     *  @type Thing
     */
    prototype.instrument = null;
    /**
     *  Schema.org/location
     *  @property location
     *  @type Place | PostalAddress | string
     */
    prototype.location = null;
    /**
     *  Schema.org/object
     *  @property object
     *  @type Thing
     */
    prototype.object = null;
    /**
     *  Schema.org/participant
     *  @property participant
     *  @type Participant
     */
    prototype.participant = null;
    /**
     *  Schema.org/result
     *  @property result
     *  @type Thing
     */
    prototype.result = null;
}, {target: "EntryPoint", participant: {name: "Array", arguments: [null]}, mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
var Organization = function() {
    Thing.call(this);
    this.context = "http://schema.org/";
    this.type = "Organization";
};
Organization = stjs.extend(Organization, Thing, [], function(constructor, prototype) {
    prototype.address = null;
    prototype.aggregateRating = null;
    prototype.alumni = null;
    prototype.areaServed = null;
    prototype.award = null;
    prototype.brand = null;
    prototype.contactPoint = null;
    prototype.department = null;
    prototype.dissolutionDate = null;
    prototype.duns = null;
    prototype.email = null;
    prototype.employee = null;
    prototype.event = null;
    prototype.faxNumber = null;
    prototype.founder = null;
    prototype.foundingDate = null;
    prototype.foundingLocation = null;
    prototype.globalLocationNumber = null;
    prototype.hasOfferCatalog = null;
    prototype.hasPOS = null;
    prototype.isicV4 = null;
    prototype.legalName = null;
    prototype.location = null;
    prototype.logo = null;
    prototype.makesOffer = null;
    prototype.member = null;
    prototype.memberOf = null;
    prototype.naics = null;
    prototype.numberOfEmployees = null;
    prototype.owns = null;
    prototype.parentOrganization = null;
    prototype.review = null;
    prototype.seeks = null;
    prototype.subOrganization = null;
    prototype.taxID = null;
    prototype.telephone = null;
    prototype.vatID = null;
}, {aggregateRating: "Thing", alumni: "Person", brand: "Object", contactPoint: "Object", department: "Organization", dissolutionDate: "Date", employee: "Person", event: "Object", founder: "Person", foundingDate: "Date", foundingLocation: "Object", hasOfferCatalog: "Object", hasPOS: "Object", logo: "Object", makesOffer: "Object", member: "Thing", memberOf: "Organization", numberOfEmployees: "Object", owns: "Object", parentOrganization: "Organization", review: "Object", seeks: "Object", subOrganization: "Organization", mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
