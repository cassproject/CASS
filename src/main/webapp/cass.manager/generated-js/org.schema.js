/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
var Thing = function() {
    EcRemoteLinkedData.call(this, "http://schema.org/", "http://schema.org/Thing");
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
}, {mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
var Person = function() {
    Thing.call(this);
    this.schema = "http://schema.org/";
    this.type = "http://schema.org/Person";
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
}, {affiliation: "Organization", alumniOf: "Organization", birthDate: "Date", birthPlace: "Object", brand: "Object", children: "Person", colleague: "Person", contactPoint: "Object", deathdate: "Date", deathPlace: "Object", follows: "Person", hasOfferCatalog: "Object", hasPOS: "Object", height: "Object", homeLocation: "Object", knows: "Person", makesOffer: "Object", memberOf: "Object", nationality: "Object", netWorth: "Object", owns: "Object", parent: "Person", performerIn: "Object", relatedTo: "Person", seeks: "Object", sibling: "Person", spouse: "Person", weight: "Object", workLocation: "Object", worksFor: "Organization", mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
var AlignmentObject = function() {
    Thing.call(this);
    this.schema = "http://schema.org/";
    this.type = "http://schema.org/Thing";
};
AlignmentObject = stjs.extend(AlignmentObject, Thing, [], function(constructor, prototype) {
    prototype.alignmentType = null;
    prototype.educationalFramework = null;
    prototype.targetDescription = null;
    prototype.targetName = null;
    prototype.targetUrl = null;
}, {mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
var CreativeWork = function() {
    Thing.call(this);
    this.schema = "http://schema.org/";
    this.type = "http://schema.org/CreativeWork";
};
CreativeWork = stjs.extend(CreativeWork, Thing, [], function(constructor, prototype) {
    prototype.about = null;
    prototype.accessibilityAPI = null;
    prototype.accessibilityControl = null;
    prototype.accessibilityFeature = null;
    prototype.accessibilityHazard = null;
    prototype.accountablePerson = null;
    prototype.aggregateRating = null;
    prototype.alternativeHeadline = null;
    prototype.associatedMedia = null;
    prototype.audience = null;
    prototype.audio = null;
    prototype.author = null;
    prototype.award = null;
    prototype.character = null;
    prototype.citation = null;
    prototype.comment = null;
    prototype.commentCount = 0;
    prototype.contentLocation = null;
    prototype.contentRating = null;
    prototype.contributor = null;
    prototype.copyrightHolder = null;
    prototype.copyrightYear = 0;
    prototype.creator = null;
    prototype.dateCreated = null;
    prototype.dateModified = null;
    prototype.datePublished = null;
    prototype.discussionUrl = null;
    prototype.editor = null;
    prototype.educationalAlignment = null;
    prototype.educationalUse = null;
    prototype.encoding = null;
    prototype.exampleOfWork = null;
    prototype.fileFormat = null;
    prototype.genre = null;
    prototype.hasPart = null;
    prototype.headline = null;
    prototype.inLanguage = null;
    prototype.interactionStatistic = null;
    prototype.interactivityType = null;
    prototype.isBasedOnUrl = null;
    prototype.isFamilyFriendly = false;
    prototype.isPartOf = null;
    prototype.keywords = null;
    prototype.learningResourceType = null;
    prototype.license = null;
    prototype.locationCreated = null;
    prototype.mainEntity = null;
    prototype.mentions = null;
    prototype.offers = null;
    prototype.position = null;
    prototype.producer = null;
    prototype.provider = null;
    prototype.publication = null;
    prototype.publisher = null;
    prototype.publishingPrinciples = null;
    prototype.recordedAt = null;
    prototype.releasedEvent = null;
    prototype.review = null;
    prototype.schemaVersion = null;
    prototype.sourceOrganization = null;
    prototype.text = null;
    prototype.thumbnailUrl = null;
    prototype.timeRequired = null;
    prototype.translator = null;
    prototype.typicalAgeRange = null;
    prototype.version = 0;
    prototype.video = null;
    prototype.workExample = null;
}, {about: "Thing", accountablePerson: "Person", aggregateRating: "Object", associatedMedia: "Object", audience: "Object", audio: "Object", author: "Thing", character: "Person", citation: "Object", comment: "Object", contentLocation: "Object", contributor: "Thing", copyrightHolder: "Thing", creator: "Thing", dateCreated: "Date", dateModified: "Date", datePublished: "Date", editor: "Person", educationalAlignment: "AlignmentObject", encoding: "Object", exampleOfWork: "CreativeWork", hasPart: "CreativeWork", interactionStatistic: "Object", isPartOf: "CreativeWork", license: "Object", locationCreated: "Object", mainEntity: "Thing", mentions: "Thing", offers: "Object", position: "Object", producer: "Thing", provider: "Thing", publication: "Object", publisher: "Thing", recordedAt: "Object", releasedEvent: "Object", review: "Object", sourceOrganization: "Organization", timeRequired: "Object", translator: "Thing", video: "Object", workExample: "CreativeWork", mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
var Action = function() {
    Thing.call(this);
    this.schema = "http://schema.org/";
    this.type = "http://schema.org/Action";
};
Action = stjs.extend(Action, Thing, [], function(constructor, prototype) {
    prototype.agent = null;
    prototype.endTime = null;
    prototype.startTime = null;
    prototype.target = null;
    prototype.error = null;
    prototype.instrument = null;
    prototype.location = null;
    prototype.object = null;
    prototype.participant = null;
    prototype.result = null;
}, {target: "EntryPoint", participant: {name: "Array", arguments: [null]}, mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
}, {actionApplication: "Object", mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
var Organization = function() {
    Thing.call(this);
    this.schema = "http://schema.org/";
    this.type = "http://schema.org/Organization";
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
}, {aggregateRating: "Thing", alumni: "Person", brand: "Object", contactPoint: "Object", department: "Organization", dissolutionDate: "Date", employee: "Person", event: "Object", founder: "Person", foundingDate: "Date", foundingLocation: "Object", hasOfferCatalog: "Object", hasPOS: "Object", logo: "Object", makesOffer: "Object", member: "Thing", memberOf: "Organization", numberOfEmployees: "Object", owns: "Object", parentOrganization: "Organization", review: "Object", seeks: "Object", subOrganization: "Organization", mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
