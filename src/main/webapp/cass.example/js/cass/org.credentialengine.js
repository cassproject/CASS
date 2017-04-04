/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
/**
 *  credentialengine.org/IdentifierValue
 *  An identifier value.
 *  @author credentialengine.org
 *  @class IdentifierValue
 *  @module org.credentialengine
 *  @extends identifier
 */
var IdentifierValue = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    Thing.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "IdentifierValue";
};
IdentifierValue = stjs.extend(IdentifierValue, Thing, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
}, {identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/Competency
 *  An assertion of measurable or observable knowledge, skills, and abilities necessary to successful performance of a person in a given context.
 *  @author credentialengine.org
 *  @class Competency
 *  @module org.credentialengine
 *  @extends Statement
 */
var Competency = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    Thing.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "Competency";
};
Competency = stjs.extend(Competency, Thing, [], null, {identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/CredentialingAction
 *  An action taken by an agent affecting the status of an object resource.
 *  @author credentialengine.org
 *  @class CredentialingAction
 *  @module org.credentialengine
 *  @extends Action
 */
var CredentialingAction = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    Action.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "CredentialingAction";
};
CredentialingAction = stjs.extend(CredentialingAction, Action, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/actingAgent
     *  The direct performer or driver (animate or inanimate) of an action.
     *  @property actingAgent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.actingAgent = null;
    /**
     *  credentialengine.org/actionStatusType
     *  Indicates the current disposition of the action.
     *  @property actionStatusType
     *  @type ActionStatusType
     */
    prototype.actionStatusType = null;
    /**
     *  credentialengine.org/agent
     *  The direct performer or driver of the action (animate or inanimate).
     *  @property agent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.agent = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/endTime
     *  The endTime of something.
     *  @property endTime
     *  @type dateTime
     */
    prototype.endTime = null;
    /**
     *  credentialengine.org/instrument
     *  The object that helped the agent perform the action. e.g. John wrote a book with a pen.
     *  @property instrument
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.instrument = null;
    /**
     *  credentialengine.org/object
     *  The object upon [which] the action is carried out, whose state is kept intact or changed.
     *  @property object
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Competency | CompetencyFramework | Credential | CredentialOrganization | CredentialPerson | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.object = null;
    /**
     *  credentialengine.org/participant
     *  Other co-agents that participated in the action indirectly.
     *  @property participant
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.participant = null;
    /**
     *  credentialengine.org/resultingAward
     *  The result produced in the action.
     *  @property resultingAward
     *  @type CredentialAssertion
     */
    prototype.resultingAward = null;
    /**
     *  credentialengine.org/startTime
     *  The startTime of something.
     *  @property startTime
     *  @type dateTime
     */
    prototype.startTime = null;
}, {actingAgent: "Object", actionStatusType: "ActionStatusType", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", target: "EntryPoint", participant: "Object", instrument: "Thing", agent: "Object", object: "Thing", actionStatus: "ActionStatusType", result: "Thing", location: "Object", error: "Thing", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/CredentialAlignmentObject
 *  An alignment to a credentialing framework.
 *  @author credentialengine.org
 *  @class CredentialAlignmentObject
 *  @module org.credentialengine
 *  @extends AlignmentObject
 */
var CredentialAlignmentObject = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    AlignmentObject.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "CredentialAlignmentObject";
};
CredentialAlignmentObject = stjs.extend(CredentialAlignmentObject, AlignmentObject, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/alignmentDate
     *  The date  the alignment was made.
     *  @property alignmentDate
     *  @type dateTime
     */
    prototype.alignmentDate = null;
    /**
     *  credentialengine.org/alignmentType
     *  A category of alignment between the learning resource and the framework node.
     *  @property alignmentType
     *  @type Literal
     */
    prototype.alignmentType = null;
    /**
     *  credentialengine.org/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  credentialengine.org/framework
     *  The framework to which the resource being described is aligned.
     *  @property framework
     *  @type anyURI
     */
    prototype.framework = null;
    /**
     *  credentialengine.org/frameworkName
     *  The name of the framework to which the resource being described is aligned.
     *  @property frameworkName
     *  @type Literal
     */
    prototype.frameworkName = null;
    /**
     *  credentialengine.org/targetNode
     *  The node of a framework targeted by the alignment.
     *  @property targetNode
     *  @type anyURI
     */
    prototype.targetNode = null;
    /**
     *  credentialengine.org/targetNodeDescription
     *  The description of a node in an established educational framework.
     *  @property targetNodeDescription
     *  @type Literal
     */
    prototype.targetNodeDescription = null;
    /**
     *  credentialengine.org/targetNodeName
     *  The name of a node in an established educational framework.
     *  @property targetNodeName
     *  @type Literal
     */
    prototype.targetNodeName = null;
    /**
     *  credentialengine.org/weight
     *  An asserted measurement of the weight, degree, percent, or strength of a recommendation, requirement, or comparison.
     *  @property weight
     *  @type float
     */
    prototype.weight = 0.0;
}, {identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/EarningsProfile
 *  A resource that describes earning and related statistical information for a given credential.
 *  @author credentialengine.org
 *  @class EarningsProfile
 *  @module org.credentialengine
 *  @extends CreativeWork
 */
var EarningsProfile = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    CreativeWork.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "EarningsProfile";
};
EarningsProfile = stjs.extend(EarningsProfile, CreativeWork, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/credentialProfiled
     *  The resource being described is a profile of the credential being referenced.
     *  @property credentialProfiled
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.credentialProfiled = null;
    /**
     *  credentialengine.org/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type dateTime
     */
    prototype.dateEffective = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  credentialengine.org/source
     *  The source of this resource's information.
     *  @property source
     *  @type anyURI
     */
    prototype.source = null;
}, {credentialProfiled: "Object", jurisdiction: "JurisdictionProfile", region: "GeoCoordinates", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/AssessmentProfile
 *  A resource that describes the key characteristics of an assessment for a credential.
 *  @author credentialengine.org
 *  @class AssessmentProfile
 *  @module org.credentialengine
 *  @extends CreativeWork
 */
var AssessmentProfile = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    CreativeWork.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "AssessmentProfile";
};
AssessmentProfile = stjs.extend(AssessmentProfile, CreativeWork, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  credentialengine.org/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  credentialengine.org/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  credentialengine.org/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  credentialengine.org/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  credentialengine.org/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  credentialengine.org/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  credentialengine.org/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  credentialengine.org/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  credentialengine.org/creditHourType
     *  Units of time corresponding to types of credits.
     *  @property creditHourType
     *  @type Literal
     */
    prototype.creditHourType = null;
    /**
     *  credentialengine.org/creditHourValue
     *  The number of credit hours awarded for completing or attaining the resource being described.
     *  @property creditHourValue
     *  @type float
     */
    prototype.creditHourValue = 0.0;
    /**
     *  credentialengine.org/creditUnitType
     *  The type of credit associated with degree and non-degree learning opportunities.
     *  @property creditUnitType
     *  @type CredentialAlignmentObject
     */
    prototype.creditUnitType = null;
    /**
     *  credentialengine.org/creditUnitTypeDescription
     *  A more refined, detailed description of credit unit type.
     *  @property creditUnitTypeDescription
     *  @type Literal
     */
    prototype.creditUnitTypeDescription = null;
    /**
     *  credentialengine.org/creditUnitValue
     *  The number of either credit units awarded for college credit or continuing education units for completing or attaining the resource being described.
     *  @property creditUnitValue
     *  @type float
     */
    prototype.creditUnitValue = 0.0;
    /**
     *  credentialengine.org/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type dateTime
     */
    prototype.dateEffective = null;
    /**
     *  credentialengine.org/deliveryType
     *  The means by which the resource being described is delivered to people or interacted with by people.
     *  @property deliveryType
     *  @type CredentialAlignmentObject
     */
    prototype.deliveryType = null;
    /**
     *  credentialengine.org/deliveryTypeDescription
     *  A more detailed, refined description of delivery type.
     *  @property deliveryTypeDescription
     *  @type Literal
     */
    prototype.deliveryTypeDescription = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  credentialengine.org/entryCondition
     *  The prerequisites for entry into the resource being described.
     *  @property entryCondition
     *  @type ConditionProfile
     */
    prototype.entryCondition = null;
    /**
     *  credentialengine.org/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  credentialengine.org/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  credentialengine.org/instructionalProgramType
     *  The class identifier for instructional program context.
     *  @property instructionalProgramType
     *  @type CredentialAlignmentObject
     */
    prototype.instructionalProgramType = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  credentialengine.org/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  credentialengine.org/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  credentialengine.org/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  credentialengine.org/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  credentialengine.org/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  credentialengine.org/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  credentialengine.org/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  credentialengine.org/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  credentialengine.org/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  credentialengine.org/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  credentialengine.org/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  credentialengine.org/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  credentialengine.org/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  credentialengine.org/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  credentialengine.org/scoringMethodDescription
     *  The method used to score the assessment.
     *  @property scoringMethodDescription
     *  @type Literal
     */
    prototype.scoringMethodDescription = null;
    /**
     *  credentialengine.org/scoringMethodExample
     *  A resource that is an example of the method or tool used to score the assessment.
     *  @property scoringMethodExample
     *  @type anyURI
     */
    prototype.scoringMethodExample = null;
    /**
     *  credentialengine.org/scoringMethodExampleDescription
     *  The text of an example of the method or tool used to score the assessment.
     *  @property scoringMethodExampleDescription
     *  @type Literal
     */
    prototype.scoringMethodExampleDescription = null;
    /**
     *  credentialengine.org/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject | Literal
     */
    prototype.subject = null;
    /**
     *  credentialengine.org/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  credentialengine.org/targetAssessment
     *  A resource that provides direct, indirect, formative or summative evaluation or estimation of the nature, ability, or quality for the resource being described.
     *  @property targetAssessment
     *  @type Assessment | AssessmentProfile
     */
    prototype.targetAssessment = null;
    /**
     *  credentialengine.org/targetCompetency
     *  An alignment to a competency assertion in an established framework.
     *  @property targetCompetency
     *  @type CredentialAlignmentObject
     */
    prototype.targetCompetency = null;
    /**
     *  credentialengine.org/verificationMethodDescription
     *  Description of the methods used to evaluate the resource validity and reliability.
     *  @property verificationMethodDescription
     *  @type Literal
     */
    prototype.verificationMethodDescription = null;
    /**
     *  credentialengine.org/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", approvedBy: "Object", approvedIn: "JurisdictionProfile", availableAt: "GeoCoordinates", creditUnitType: "CredentialAlignmentObject", deliveryType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", entryCondition: "ConditionProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", instructionalProgramType: "CredentialAlignmentObject", jurisdiction: "JurisdictionProfile", maintenanceProcess: "ProcessProfile", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", requires: "Object", subject: "Object", targetAssessment: "Object", targetCompetency: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/ProcessProfile
 *  The type, nature, and related information about a process related to a credential.
 *  @author credentialengine.org
 *  @class ProcessProfile
 *  @module org.credentialengine
 *  @extends CreativeWork
 */
var ProcessProfile = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    CreativeWork.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "ProcessProfile";
};
ProcessProfile = stjs.extend(ProcessProfile, CreativeWork, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type dateTime
     */
    prototype.dateEffective = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  credentialengine.org/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  credentialengine.org/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  credentialengine.org/scoringMethodDescription
     *  The method used to score the assessment.
     *  @property scoringMethodDescription
     *  @type Literal
     */
    prototype.scoringMethodDescription = null;
    /**
     *  credentialengine.org/scoringMethodExample
     *  A resource that is an example of the method or tool used to score the assessment.
     *  @property scoringMethodExample
     *  @type anyURI
     */
    prototype.scoringMethodExample = null;
    /**
     *  credentialengine.org/scoringMethodExampleDescription
     *  The text of an example of the method or tool used to score the assessment.
     *  @property scoringMethodExampleDescription
     *  @type Literal
     */
    prototype.scoringMethodExampleDescription = null;
    /**
     *  credentialengine.org/targetAssessment
     *  A resource that provides direct, indirect, formative or summative evaluation or estimation of the nature, ability, or quality for the resource being described.
     *  @property targetAssessment
     *  @type Assessment | AssessmentProfile
     */
    prototype.targetAssessment = null;
    /**
     *  credentialengine.org/targetCredential
     *  A credential that is a focus or target of the resource being described.
     *  @property targetCredential
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.targetCredential = null;
    /**
     *  credentialengine.org/targetLearningOpportunity
     *  A learning opportunity that is the focus of the resource being described.
     *  @property targetLearningOpportunity
     *  @type LearningOpportunity | LearningOpportunityProfile
     */
    prototype.targetLearningOpportunity = null;
    /**
     *  credentialengine.org/verificationMethodDescription
     *  Description of the methods used to evaluate the resource validity and reliability.
     *  @property verificationMethodDescription
     *  @type Literal
     */
    prototype.verificationMethodDescription = null;
}, {jurisdiction: "JurisdictionProfile", region: "GeoCoordinates", targetAssessment: "Object", targetCredential: "Object", targetLearningOpportunity: "Object", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/LearningResource
 *  An entity that is used as part of an Educational Activity (e.g. a textbook) or that describes (e.g. a lesson plan) or records the Educational Activity (e.g. an audio- or video-recording of a lesson).
 *  @author credentialengine.org
 *  @class LearningResource
 *  @module org.credentialengine
 *  @extends CreativeWork
 */
var LearningResource = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    CreativeWork.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "LearningResource";
};
LearningResource = stjs.extend(LearningResource, CreativeWork, [], null, {contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/JurisdictionProfile
 *  Geo-political information about applicable geographic areas and their exceptions.
 *  @author credentialengine.org
 *  @class JurisdictionProfile
 *  @module org.credentialengine
 *  @extends CreativeWork
 */
var JurisdictionProfile = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    CreativeWork.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "JurisdictionProfile";
};
JurisdictionProfile = stjs.extend(JurisdictionProfile, CreativeWork, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/assertedBy
     *  The agent providing the information contained in the entity being described.
     *  @property assertedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.assertedBy = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
}, {assertedBy: "Object", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/RevocationProfile
 *  The conditions and methods by which a credential can be removed from a holder.
 *  @author credentialengine.org
 *  @class RevocationProfile
 *  @module org.credentialengine
 *  @extends CreativeWork
 */
var RevocationProfile = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    CreativeWork.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "RevocationProfile";
};
RevocationProfile = stjs.extend(RevocationProfile, CreativeWork, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/credentialProfiled
     *  The resource being described is a profile of the credential being referenced.
     *  @property credentialProfiled
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.credentialProfiled = null;
    /**
     *  credentialengine.org/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type dateTime
     */
    prototype.dateEffective = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
}, {credentialProfiled: "Object", jurisdiction: "JurisdictionProfile", region: "GeoCoordinates", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/Credential
 *  A qualification, achievement, personal or organizational quality, or aspect of an identity typically used to indicate suitability.
 *  @author credentialengine.org
 *  @class Credential
 *  @module org.credentialengine
 *  @extends CreativeWork
 */
var Credential = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    CreativeWork.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "Credential";
};
Credential = stjs.extend(Credential, CreativeWork, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  credentialengine.org/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  credentialengine.org/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  credentialengine.org/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  credentialengine.org/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  credentialengine.org/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  credentialengine.org/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  credentialengine.org/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  credentialengine.org/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  credentialengine.org/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  credentialengine.org/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  credentialengine.org/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  credentialengine.org/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  credentialengine.org/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson
     */
    prototype.copyrightHolder = null;
    /**
     *  credentialengine.org/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  credentialengine.org/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  credentialengine.org/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  credentialengine.org/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type dateTime
     */
    prototype.dateEffective = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  credentialengine.org/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  credentialengine.org/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  credentialengine.org/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  credentialengine.org/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  credentialengine.org/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  credentialengine.org/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  credentialengine.org/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  credentialengine.org/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type Image
     */
    prototype.image = null;
    /**
     *  credentialengine.org/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  credentialengine.org/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  credentialengine.org/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  credentialengine.org/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  credentialengine.org/isRecommendedFor
     *  The resources being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  credentialengine.org/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  credentialengine.org/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  credentialengine.org/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  credentialengine.org/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  credentialengine.org/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  credentialengine.org/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  credentialengine.org/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  credentialengine.org/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  credentialengine.org/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  credentialengine.org/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  credentialengine.org/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  credentialengine.org/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  credentialengine.org/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  credentialengine.org/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  credentialengine.org/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  credentialengine.org/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  credentialengine.org/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  credentialengine.org/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  credentialengine.org/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  credentialengine.org/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  credentialengine.org/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  credentialengine.org/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  credentialengine.org/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  credentialengine.org/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  credentialengine.org/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  credentialengine.org/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  credentialengine.org/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  credentialengine.org/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  credentialengine.org/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  credentialengine.org/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  credentialengine.org/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  credentialengine.org/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject | Literal
     */
    prototype.subject = null;
    /**
     *  credentialengine.org/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  credentialengine.org/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  credentialengine.org/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/TaskProfile
 *  A profile describing the required or recommended tasks to be performed by a holder of, or applicant for, a credential assertion.
 *  @author credentialengine.org
 *  @class TaskProfile
 *  @module org.credentialengine
 *  @extends CreativeWork
 */
var TaskProfile = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    CreativeWork.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "TaskProfile";
};
TaskProfile = stjs.extend(TaskProfile, CreativeWork, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  credentialengine.org/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  credentialengine.org/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  credentialengine.org/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type dateTime
     */
    prototype.dateEffective = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  credentialengine.org/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
}, {availableAt: "GeoCoordinates", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", jurisdiction: "JurisdictionProfile", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/CostProfile
 *  The type and nature of direct costs one would incur if one were to pursue attaining a credential.
 *  @author credentialengine.org
 *  @class CostProfile
 *  @module org.credentialengine
 *  @extends CreativeWork
 */
var CostProfile = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    CreativeWork.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "CostProfile";
};
CostProfile = stjs.extend(CostProfile, CreativeWork, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/audienceType
     *  The applicable audience.
     *  @property audienceType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceType = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/endTime
     *  The endTime of something.
     *  @property endTime
     *  @type dateTime
     */
    prototype.endTime = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  credentialengine.org/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  credentialengine.org/startTime
     *  The startTime of something.
     *  @property startTime
     *  @type dateTime
     */
    prototype.startTime = null;
}, {audienceType: "CredentialAlignmentObject", jurisdiction: "JurisdictionProfile", region: "GeoCoordinates", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/LearningOpportunityProfile
 *  A resource describing a learning opportunity.
 *  @author credentialengine.org
 *  @class LearningOpportunityProfile
 *  @module org.credentialengine
 *  @extends CreativeWork
 */
var LearningOpportunityProfile = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    CreativeWork.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "LearningOpportunityProfile";
};
LearningOpportunityProfile = stjs.extend(LearningOpportunityProfile, CreativeWork, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  credentialengine.org/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  credentialengine.org/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  credentialengine.org/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  credentialengine.org/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  credentialengine.org/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  credentialengine.org/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  credentialengine.org/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  credentialengine.org/creditHourType
     *  Units of time corresponding to types of credits.
     *  @property creditHourType
     *  @type Literal
     */
    prototype.creditHourType = null;
    /**
     *  credentialengine.org/creditHourValue
     *  The number of credit hours awarded for completing or attaining the resource being described.
     *  @property creditHourValue
     *  @type float
     */
    prototype.creditHourValue = 0.0;
    /**
     *  credentialengine.org/creditUnitType
     *  The type of credit associated with degree and non-degree learning opportunities.
     *  @property creditUnitType
     *  @type CredentialAlignmentObject
     */
    prototype.creditUnitType = null;
    /**
     *  credentialengine.org/creditUnitTypeDescription
     *  A more refined, detailed description of credit unit type.
     *  @property creditUnitTypeDescription
     *  @type Literal
     */
    prototype.creditUnitTypeDescription = null;
    /**
     *  credentialengine.org/creditUnitValue
     *  The number of either credit units awarded for college credit or continuing education units for completing or attaining the resource being described.
     *  @property creditUnitValue
     *  @type float
     */
    prototype.creditUnitValue = 0.0;
    /**
     *  credentialengine.org/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type dateTime
     */
    prototype.dateEffective = null;
    /**
     *  credentialengine.org/deliveryType
     *  The means by which the resource being described is delivered to people or interacted with by people.
     *  @property deliveryType
     *  @type CredentialAlignmentObject
     */
    prototype.deliveryType = null;
    /**
     *  credentialengine.org/deliveryTypeDescription
     *  A more detailed, refined description of delivery type.
     *  @property deliveryTypeDescription
     *  @type Literal
     */
    prototype.deliveryTypeDescription = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/entryCondition
     *  The prerequisites for entry into the resource being described.
     *  @property entryCondition
     *  @type ConditionProfile
     */
    prototype.entryCondition = null;
    /**
     *  credentialengine.org/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  credentialengine.org/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  credentialengine.org/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  credentialengine.org/instructionalProgramType
     *  The class identifier for instructional program context.
     *  @property instructionalProgramType
     *  @type CredentialAlignmentObject
     */
    prototype.instructionalProgramType = null;
    /**
     *  credentialengine.org/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  credentialengine.org/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  credentialengine.org/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  credentialengine.org/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  credentialengine.org/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  credentialengine.org/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  credentialengine.org/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  credentialengine.org/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  credentialengine.org/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  credentialengine.org/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  credentialengine.org/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  credentialengine.org/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  credentialengine.org/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject | Literal
     */
    prototype.subject = null;
    /**
     *  credentialengine.org/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  credentialengine.org/targetAssessment
     *  A resource that provides direct, indirect, formative or summative evaluation or estimation of the nature, ability, or quality for the resource being described.
     *  @property targetAssessment
     *  @type Assessment | AssessmentProfile
     */
    prototype.targetAssessment = null;
    /**
     *  credentialengine.org/targetCompetency
     *  An alignment to a competency assertion in an established framework.
     *  @property targetCompetency
     *  @type CredentialAlignmentObject
     */
    prototype.targetCompetency = null;
    /**
     *  credentialengine.org/targetLearningOpportunity
     *  A learning opportunity that is the focus of the resource being described.
     *  @property targetLearningOpportunity
     *  @type LearningOpportunity | LearningOpportunityProfile
     */
    prototype.targetLearningOpportunity = null;
    /**
     *  credentialengine.org/verificationMethodDescription
     *  Description of the methods used to evaluate the resource validity and reliability.
     *  @property verificationMethodDescription
     *  @type Literal
     */
    prototype.verificationMethodDescription = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", approvedBy: "Object", approvedIn: "JurisdictionProfile", availableAt: "GeoCoordinates", creditUnitType: "CredentialAlignmentObject", deliveryType: "CredentialAlignmentObject", entryCondition: "ConditionProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", hasPart: "Object", instructionalProgramType: "CredentialAlignmentObject", isPartOf: "Object", jurisdiction: "JurisdictionProfile", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", requires: "Object", subject: "Object", targetAssessment: "Object", targetCompetency: "CredentialAlignmentObject", targetLearningOpportunity: "Object", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/ConditionProfile
 *  A resource describing a condition between a credential and other resources to which the credential is subject during its lifecycle including the requirements to attain the credential.
 *  @author credentialengine.org
 *  @class ConditionProfile
 *  @module org.credentialengine
 *  @extends CreativeWork
 */
var ConditionProfile = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    CreativeWork.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "ConditionProfile";
};
ConditionProfile = stjs.extend(ConditionProfile, CreativeWork, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/assertedBy
     *  The agent providing the information contained in the entity being described.
     *  @property assertedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.assertedBy = null;
    /**
     *  credentialengine.org/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  credentialengine.org/audienceType
     *  The applicable audience.
     *  @property audienceType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceType = null;
    /**
     *  credentialengine.org/credentialProfiled
     *  The resource being described is a profile of the credential being referenced.
     *  @property credentialProfiled
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.credentialProfiled = null;
    /**
     *  credentialengine.org/creditHourType
     *  Units of time corresponding to types of credits.
     *  @property creditHourType
     *  @type Literal
     */
    prototype.creditHourType = null;
    /**
     *  credentialengine.org/creditHourValue
     *  The number of credit hours awarded for completing or attaining the resource being described.
     *  @property creditHourValue
     *  @type float
     */
    prototype.creditHourValue = 0.0;
    /**
     *  credentialengine.org/creditUnitType
     *  The type of credit associated with degree and non-degree learning opportunities.
     *  @property creditUnitType
     *  @type CredentialAlignmentObject
     */
    prototype.creditUnitType = null;
    /**
     *  credentialengine.org/creditUnitTypeDescription
     *  A more refined, detailed description of credit unit type.
     *  @property creditUnitTypeDescription
     *  @type Literal
     */
    prototype.creditUnitTypeDescription = null;
    /**
     *  credentialengine.org/creditUnitValue
     *  The number of either credit units awarded for college credit or continuing education units for completing or attaining the resource being described.
     *  @property creditUnitValue
     *  @type float
     */
    prototype.creditUnitValue = 0.0;
    /**
     *  credentialengine.org/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type dateTime
     */
    prototype.dateEffective = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  credentialengine.org/targetAssessment
     *  A resource that provides direct, indirect, formative or summative evaluation or estimation of the nature, ability, or quality for the resource being described.
     *  @property targetAssessment
     *  @type Assessment | AssessmentProfile
     */
    prototype.targetAssessment = null;
    /**
     *  credentialengine.org/targetCompetency
     *  An alignment to a competency assertion in an established framework.
     *  @property targetCompetency
     *  @type CredentialAlignmentObject
     */
    prototype.targetCompetency = null;
    /**
     *  credentialengine.org/targetCredential
     *  A credential that is a focus or target of the resource being described.
     *  @property targetCredential
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.targetCredential = null;
    /**
     *  credentialengine.org/targetLearningOpportunity
     *  A learning opportunity that is the focus of the resource being described.
     *  @property targetLearningOpportunity
     *  @type LearningOpportunity | LearningOpportunityProfile
     */
    prototype.targetLearningOpportunity = null;
    /**
     *  credentialengine.org/weight
     *  An asserted measurement of the weight, degree, percent, or strength of a recommendation, requirement, or comparison.
     *  @property weight
     *  @type float
     */
    prototype.weight = 0.0;
}, {assertedBy: "Object", audienceLevelType: "CredentialAlignmentObject", audienceType: "CredentialAlignmentObject", credentialProfiled: "Object", creditUnitType: "CredentialAlignmentObject", estimatedCost: "CostProfile", jurisdiction: "JurisdictionProfile", targetAssessment: "Object", targetCompetency: "CredentialAlignmentObject", targetCredential: "Object", targetLearningOpportunity: "Object", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/HoldersProfile
 *  The count and related statistical information of holders of a given credential.
 *  @author credentialengine.org
 *  @class HoldersProfile
 *  @module org.credentialengine
 *  @extends CreativeWork
 */
var HoldersProfile = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    CreativeWork.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "HoldersProfile";
};
HoldersProfile = stjs.extend(HoldersProfile, CreativeWork, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/credentialProfiled
     *  The resource being described is a profile of the credential being referenced.
     *  @property credentialProfiled
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.credentialProfiled = null;
    /**
     *  credentialengine.org/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type dateTime
     */
    prototype.dateEffective = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  credentialengine.org/source
     *  The source of this resource's information.
     *  @property source
     *  @type anyURI
     */
    prototype.source = null;
}, {credentialProfiled: "Object", jurisdiction: "JurisdictionProfile", region: "GeoCoordinates", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/IdentifierValueSet
 *  A set of identifier values.
 *  @author credentialengine.org
 *  @class IdentifierValueSet
 *  @module org.credentialengine
 *  @extends CreativeWork
 */
var IdentifierValueSet = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    CreativeWork.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "IdentifierValueSet";
};
IdentifierValueSet = stjs.extend(IdentifierValueSet, CreativeWork, [], null, {contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/EmploymentOutcomeProfile
 *  The employment outcomes and related statistical information for a given credential.
 *  @author credentialengine.org
 *  @class EmploymentOutcomeProfile
 *  @module org.credentialengine
 *  @extends CreativeWork
 */
var EmploymentOutcomeProfile = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    CreativeWork.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "EmploymentOutcomeProfile";
};
EmploymentOutcomeProfile = stjs.extend(EmploymentOutcomeProfile, CreativeWork, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/credentialProfiled
     *  The resource being described is a profile of the credential being referenced.
     *  @property credentialProfiled
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.credentialProfiled = null;
    /**
     *  credentialengine.org/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type dateTime
     */
    prototype.dateEffective = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/source
     *  The source of this resource's information.
     *  @property source
     *  @type anyURI
     */
    prototype.source = null;
}, {credentialProfiled: "Object", jurisdiction: "JurisdictionProfile", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/CredentialFramework
 *  The class of all structured sets of conceptual resources intentionally designed for use as value vocabulary terms for description and classification in the credentialing context.
 *  @author credentialengine.org
 *  @class CredentialFramework
 *  @module org.credentialengine
 */
var CredentialFramework = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    EcRemoteLinkedData.call(this, null, null);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "CredentialFramework";
};
CredentialFramework = stjs.extend(CredentialFramework, EcRemoteLinkedData, [], null, {owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/CareerPathway
 *  An integrated collection of credentials, programs, experiences, and services intended to develop technical, academic, and employability skills in a cluster of occupations that share common skills, knowledge, and interests.
 *  @author credentialengine.org
 *  @class CareerPathway
 *  @module org.credentialengine
 */
var CareerPathway = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    EcRemoteLinkedData.call(this, null, null);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "CareerPathway";
};
CareerPathway = stjs.extend(CareerPathway, EcRemoteLinkedData, [], null, {owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/DurationProfile
 *  A resource describing the temporal aspects of a resource.
 *  @author credentialengine.org
 *  @class DurationProfile
 *  @module org.credentialengine
 */
var DurationProfile = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    EcRemoteLinkedData.call(this, null, null);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "DurationProfile";
};
DurationProfile = stjs.extend(DurationProfile, EcRemoteLinkedData, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
}, {owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/ContactPoint
 *  A means of contacting a resource or its representative(s).
 *  @author credentialengine.org
 *  @class ContactPoint
 *  @module org.credentialengine
 */
var ContactPoint = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    EcRemoteLinkedData.call(this, null, null);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "ContactPoint";
};
ContactPoint = stjs.extend(ContactPoint, EcRemoteLinkedData, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/email
     *  Email address of the agent being described.
     *  @property email
     *  @type Literal | Email
     */
    prototype.email = null;
    /**
     *  credentialengine.org/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  credentialengine.org/socialMedia
     *  A social media resource for the resource being described.
     *  @property socialMedia
     *  @type anyURI
     */
    prototype.socialMedia = null;
}, {email: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/LearningOpportunity
 *  Structured and unstructured learning and development opportunities based in direct experience, formal and informal study, observation, and involvement in discourse and practice.
 *  @author credentialengine.org
 *  @class LearningOpportunity
 *  @module org.credentialengine
 */
var LearningOpportunity = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    EcRemoteLinkedData.call(this, null, null);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "LearningOpportunity";
};
LearningOpportunity = stjs.extend(LearningOpportunity, EcRemoteLinkedData, [], null, {owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/Assessment
 *  Direct, indirect, formative and summative evaluation or estimation of the nature, ability, or quality of a resource, performance, or outcome of an action.
 *  @author credentialengine.org
 *  @class Assessment
 *  @module org.credentialengine
 */
var Assessment = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    EcRemoteLinkedData.call(this, null, null);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "Assessment";
};
Assessment = stjs.extend(Assessment, EcRemoteLinkedData, [], null, {owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/Agent
 *  A resource that acts or has the power to act.
 *  @author credentialengine.org
 *  @class Agent
 *  @module org.credentialengine
 */
var Agent = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    EcRemoteLinkedData.call(this, null, null);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "Agent";
};
Agent = stjs.extend(Agent, EcRemoteLinkedData, [], null, {owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/CredentialAssertion
 *  The class of  representations of an awarded credential, used to share information about a credential belonging to one holder.
 *  @author credentialengine.org
 *  @class CredentialAssertion
 *  @module org.credentialengine
 */
var CredentialAssertion = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    EcRemoteLinkedData.call(this, null, null);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "CredentialAssertion";
};
CredentialAssertion = stjs.extend(CredentialAssertion, EcRemoteLinkedData, [], null, {owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/VerificationServiceProfile
 *  A resource describing the means by which someone can verify whether a credential has been attained.
 *  @author credentialengine.org
 *  @class VerificationServiceProfile
 *  @module org.credentialengine
 *  @extends Intangible
 */
var VerificationServiceProfile = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    Intangible.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "VerificationServiceProfile";
};
VerificationServiceProfile = stjs.extend(VerificationServiceProfile, Intangible, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type dateTime
     */
    prototype.dateEffective = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  credentialengine.org/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  credentialengine.org/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  credentialengine.org/targetCredential
     *  A credential that is a focus or target of the resource being described.
     *  @property targetCredential
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.targetCredential = null;
    /**
     *  credentialengine.org/verificationMethodDescription
     *  Description of the methods used to evaluate the resource validity and reliability.
     *  @property verificationMethodDescription
     *  @type Literal
     */
    prototype.verificationMethodDescription = null;
}, {estimatedCost: "CostProfile", jurisdiction: "JurisdictionProfile", offeredBy: "Object", offeredIn: "JurisdictionProfile", region: "GeoCoordinates", targetCredential: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/GeoCoordinates
 *  The geographic coordinates of a place or event.
 *  @author credentialengine.org
 *  @class GeoCoordinates
 *  @module org.credentialengine
 *  @extends StructuredValue
 */
var GeoCoordinates = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    StructuredValue.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "GeoCoordinates";
};
GeoCoordinates = stjs.extend(GeoCoordinates, StructuredValue, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/address
     *  Physical address of the resource.
     *  @property address
     *  @type PostalAddress
     */
    prototype.address = null;
    /**
     *  credentialengine.org/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  credentialengine.org/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
}, {address: "PostalAddress", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/RegulateAction
 *  An action by an independent, neutral, and authoritative agent enforcing the legal requirements of a resource.
 *  @author credentialengine.org
 *  @class RegulateAction
 *  @module org.credentialengine
 *  @extends CredentialingAction
 */
var RegulateAction = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    CredentialingAction.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "RegulateAction";
};
RegulateAction = stjs.extend(RegulateAction, CredentialingAction, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/actingAgent
     *  The direct performer or driver (animate or inanimate) of an action.
     *  @property actingAgent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.actingAgent = null;
    /**
     *  credentialengine.org/actionStatusType
     *  Indicates the current disposition of the action.
     *  @property actionStatusType
     *  @type ActionStatusType
     */
    prototype.actionStatusType = null;
    /**
     *  credentialengine.org/agent
     *  The direct performer or driver of the action (animate or inanimate).
     *  @property agent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.agent = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/endTime
     *  The endTime of something.
     *  @property endTime
     *  @type dateTime
     */
    prototype.endTime = null;
    /**
     *  credentialengine.org/instrument
     *  The object that helped the agent perform the action. e.g. John wrote a book with a pen.
     *  @property instrument
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.instrument = null;
    /**
     *  credentialengine.org/object
     *  The object upon [which] the action is carried out, whose state is kept intact or changed.
     *  @property object
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Competency | CompetencyFramework | Credential | CredentialOrganization | CredentialPerson | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.object = null;
    /**
     *  credentialengine.org/participant
     *  Other co-agents that participated in the action indirectly.
     *  @property participant
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.participant = null;
    /**
     *  credentialengine.org/resultingAward
     *  The result produced in the action.
     *  @property resultingAward
     *  @type CredentialAssertion
     */
    prototype.resultingAward = null;
    /**
     *  credentialengine.org/startTime
     *  The startTime of something.
     *  @property startTime
     *  @type dateTime
     */
    prototype.startTime = null;
}, {actingAgent: "Object", actionStatusType: "ActionStatusType", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", actingAgent: "Object", actionStatusType: "ActionStatusType", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", target: "EntryPoint", participant: "Object", instrument: "Thing", agent: "Object", object: "Thing", actionStatus: "ActionStatusType", result: "Thing", location: "Object", error: "Thing", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/ApproveAction
 *  An action by an independent, neutral, and authoritative agent that pronounces a favorable judgment of a resource.
 *  @author credentialengine.org
 *  @class ApproveAction
 *  @module org.credentialengine
 *  @extends CredentialingAction
 */
var ApproveAction = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    CredentialingAction.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "ApproveAction";
};
ApproveAction = stjs.extend(ApproveAction, CredentialingAction, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/actingAgent
     *  The direct performer or driver (animate or inanimate) of an action.
     *  @property actingAgent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.actingAgent = null;
    /**
     *  credentialengine.org/actionStatusType
     *  Indicates the current disposition of the action.
     *  @property actionStatusType
     *  @type ActionStatusType
     */
    prototype.actionStatusType = null;
    /**
     *  credentialengine.org/agent
     *  The direct performer or driver of the action (animate or inanimate).
     *  @property agent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.agent = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/endTime
     *  The endTime of something.
     *  @property endTime
     *  @type dateTime
     */
    prototype.endTime = null;
    /**
     *  credentialengine.org/instrument
     *  The object that helped the agent perform the action. e.g. John wrote a book with a pen.
     *  @property instrument
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.instrument = null;
    /**
     *  credentialengine.org/object
     *  The object upon [which] the action is carried out, whose state is kept intact or changed.
     *  @property object
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Competency | CompetencyFramework | Credential | CredentialOrganization | CredentialPerson | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.object = null;
    /**
     *  credentialengine.org/participant
     *  Other co-agents that participated in the action indirectly.
     *  @property participant
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.participant = null;
    /**
     *  credentialengine.org/resultingAward
     *  The result produced in the action.
     *  @property resultingAward
     *  @type CredentialAssertion
     */
    prototype.resultingAward = null;
    /**
     *  credentialengine.org/startTime
     *  The startTime of something.
     *  @property startTime
     *  @type dateTime
     */
    prototype.startTime = null;
}, {actingAgent: "Object", actionStatusType: "ActionStatusType", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", actingAgent: "Object", actionStatusType: "ActionStatusType", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", target: "EntryPoint", participant: "Object", instrument: "Thing", agent: "Object", object: "Thing", actionStatus: "ActionStatusType", result: "Thing", location: "Object", error: "Thing", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/RenewAction
 *  An action by an authoritative agent renewing an existing credential assertion.
 *  @author credentialengine.org
 *  @class RenewAction
 *  @module org.credentialengine
 *  @extends CredentialingAction
 */
var RenewAction = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    CredentialingAction.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "RenewAction";
};
RenewAction = stjs.extend(RenewAction, CredentialingAction, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/actingAgent
     *  The direct performer or driver (animate or inanimate) of an action.
     *  @property actingAgent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.actingAgent = null;
    /**
     *  credentialengine.org/actionStatusType
     *  Indicates the current disposition of the action.
     *  @property actionStatusType
     *  @type ActionStatusType
     */
    prototype.actionStatusType = null;
    /**
     *  credentialengine.org/agent
     *  The direct performer or driver of the action (animate or inanimate).
     *  @property agent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.agent = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/endTime
     *  The endTime of something.
     *  @property endTime
     *  @type dateTime
     */
    prototype.endTime = null;
    /**
     *  credentialengine.org/instrument
     *  The object that helped the agent perform the action. e.g. John wrote a book with a pen.
     *  @property instrument
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.instrument = null;
    /**
     *  credentialengine.org/object
     *  The object upon [which] the action is carried out, whose state is kept intact or changed.
     *  @property object
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Competency | CompetencyFramework | Credential | CredentialOrganization | CredentialPerson | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.object = null;
    /**
     *  credentialengine.org/participant
     *  Other co-agents that participated in the action indirectly.
     *  @property participant
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.participant = null;
    /**
     *  credentialengine.org/resultingAward
     *  The result produced in the action.
     *  @property resultingAward
     *  @type CredentialAssertion
     */
    prototype.resultingAward = null;
    /**
     *  credentialengine.org/startTime
     *  The startTime of something.
     *  @property startTime
     *  @type dateTime
     */
    prototype.startTime = null;
}, {actingAgent: "Object", actionStatusType: "ActionStatusType", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", actingAgent: "Object", actionStatusType: "ActionStatusType", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", target: "EntryPoint", participant: "Object", instrument: "Thing", agent: "Object", object: "Thing", actionStatus: "ActionStatusType", result: "Thing", location: "Object", error: "Thing", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/RecognizeAction
 *  An action by an independent, neutral, and authoritative agent acknowledging the validity of a resource.
 *  @author credentialengine.org
 *  @class RecognizeAction
 *  @module org.credentialengine
 *  @extends CredentialingAction
 */
var RecognizeAction = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    CredentialingAction.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "RecognizeAction";
};
RecognizeAction = stjs.extend(RecognizeAction, CredentialingAction, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/actingAgent
     *  The direct performer or driver (animate or inanimate) of an action.
     *  @property actingAgent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.actingAgent = null;
    /**
     *  credentialengine.org/actionStatusType
     *  Indicates the current disposition of the action.
     *  @property actionStatusType
     *  @type ActionStatusType
     */
    prototype.actionStatusType = null;
    /**
     *  credentialengine.org/agent
     *  The direct performer or driver of the action (animate or inanimate).
     *  @property agent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.agent = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/endTime
     *  The endTime of something.
     *  @property endTime
     *  @type dateTime
     */
    prototype.endTime = null;
    /**
     *  credentialengine.org/instrument
     *  The object that helped the agent perform the action. e.g. John wrote a book with a pen.
     *  @property instrument
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.instrument = null;
    /**
     *  credentialengine.org/object
     *  The object upon [which] the action is carried out, whose state is kept intact or changed.
     *  @property object
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Competency | CompetencyFramework | Credential | CredentialOrganization | CredentialPerson | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.object = null;
    /**
     *  credentialengine.org/participant
     *  Other co-agents that participated in the action indirectly.
     *  @property participant
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.participant = null;
    /**
     *  credentialengine.org/resultingAward
     *  The result produced in the action.
     *  @property resultingAward
     *  @type CredentialAssertion
     */
    prototype.resultingAward = null;
    /**
     *  credentialengine.org/startTime
     *  The startTime of something.
     *  @property startTime
     *  @type dateTime
     */
    prototype.startTime = null;
}, {actingAgent: "Object", actionStatusType: "ActionStatusType", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", actingAgent: "Object", actionStatusType: "ActionStatusType", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", target: "EntryPoint", participant: "Object", instrument: "Thing", agent: "Object", object: "Thing", actionStatus: "ActionStatusType", result: "Thing", location: "Object", error: "Thing", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/RightsAction
 *  An action asserting rights by an authoritative agent to possess, defend, transfer, license, and grant conditional access to a resource.
 *  @author credentialengine.org
 *  @class RightsAction
 *  @module org.credentialengine
 *  @extends CredentialingAction
 */
var RightsAction = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    CredentialingAction.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "RightsAction";
};
RightsAction = stjs.extend(RightsAction, CredentialingAction, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/actingAgent
     *  The direct performer or driver (animate or inanimate) of an action.
     *  @property actingAgent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.actingAgent = null;
    /**
     *  credentialengine.org/actionStatusType
     *  Indicates the current disposition of the action.
     *  @property actionStatusType
     *  @type ActionStatusType
     */
    prototype.actionStatusType = null;
    /**
     *  credentialengine.org/agent
     *  The direct performer or driver of the action (animate or inanimate).
     *  @property agent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.agent = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/endTime
     *  The endTime of something.
     *  @property endTime
     *  @type dateTime
     */
    prototype.endTime = null;
    /**
     *  credentialengine.org/instrument
     *  The object that helped the agent perform the action. e.g. John wrote a book with a pen.
     *  @property instrument
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.instrument = null;
    /**
     *  credentialengine.org/object
     *  The object upon [which] the action is carried out, whose state is kept intact or changed.
     *  @property object
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Competency | CompetencyFramework | Credential | CredentialOrganization | CredentialPerson | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.object = null;
    /**
     *  credentialengine.org/participant
     *  Other co-agents that participated in the action indirectly.
     *  @property participant
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.participant = null;
    /**
     *  credentialengine.org/resultingAward
     *  The result produced in the action.
     *  @property resultingAward
     *  @type CredentialAssertion
     */
    prototype.resultingAward = null;
    /**
     *  credentialengine.org/startTime
     *  The startTime of something.
     *  @property startTime
     *  @type dateTime
     */
    prototype.startTime = null;
}, {actingAgent: "Object", actionStatusType: "ActionStatusType", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", actingAgent: "Object", actionStatusType: "ActionStatusType", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", target: "EntryPoint", participant: "Object", instrument: "Thing", agent: "Object", object: "Thing", actionStatus: "ActionStatusType", result: "Thing", location: "Object", error: "Thing", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/AccreditAction
 *  An action by an independent, neutral, and authoritative agent that certifies a resource as meeting a prescribed set of standards.
 *  @author credentialengine.org
 *  @class AccreditAction
 *  @module org.credentialengine
 *  @extends CredentialingAction
 */
var AccreditAction = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    CredentialingAction.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "AccreditAction";
};
AccreditAction = stjs.extend(AccreditAction, CredentialingAction, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/actingAgent
     *  The direct performer or driver (animate or inanimate) of an action.
     *  @property actingAgent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.actingAgent = null;
    /**
     *  credentialengine.org/actionStatusType
     *  Indicates the current disposition of the action.
     *  @property actionStatusType
     *  @type ActionStatusType
     */
    prototype.actionStatusType = null;
    /**
     *  credentialengine.org/agent
     *  The direct performer or driver of the action (animate or inanimate).
     *  @property agent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.agent = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/endTime
     *  The endTime of something.
     *  @property endTime
     *  @type dateTime
     */
    prototype.endTime = null;
    /**
     *  credentialengine.org/instrument
     *  The object that helped the agent perform the action. e.g. John wrote a book with a pen.
     *  @property instrument
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.instrument = null;
    /**
     *  credentialengine.org/object
     *  The object upon [which] the action is carried out, whose state is kept intact or changed.
     *  @property object
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Competency | CompetencyFramework | Credential | CredentialOrganization | CredentialPerson | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.object = null;
    /**
     *  credentialengine.org/participant
     *  Other co-agents that participated in the action indirectly.
     *  @property participant
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.participant = null;
    /**
     *  credentialengine.org/resultingAward
     *  The result produced in the action.
     *  @property resultingAward
     *  @type CredentialAssertion
     */
    prototype.resultingAward = null;
    /**
     *  credentialengine.org/startTime
     *  The startTime of something.
     *  @property startTime
     *  @type dateTime
     */
    prototype.startTime = null;
}, {actingAgent: "Object", actionStatusType: "ActionStatusType", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", actingAgent: "Object", actionStatusType: "ActionStatusType", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", target: "EntryPoint", participant: "Object", instrument: "Thing", agent: "Object", object: "Thing", actionStatus: "ActionStatusType", result: "Thing", location: "Object", error: "Thing", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/RevokeAction
 *  An action by an authoritative agent removing a credential assertion from the credential holder based on violations.
 *  @author credentialengine.org
 *  @class RevokeAction
 *  @module org.credentialengine
 *  @extends CredentialingAction
 */
var RevokeAction = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    CredentialingAction.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "RevokeAction";
};
RevokeAction = stjs.extend(RevokeAction, CredentialingAction, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/actingAgent
     *  The direct performer or driver (animate or inanimate) of an action.
     *  @property actingAgent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.actingAgent = null;
    /**
     *  credentialengine.org/actionStatusType
     *  Indicates the current disposition of the action.
     *  @property actionStatusType
     *  @type ActionStatusType
     */
    prototype.actionStatusType = null;
    /**
     *  credentialengine.org/agent
     *  The direct performer or driver of the action (animate or inanimate).
     *  @property agent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.agent = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/endTime
     *  The endTime of something.
     *  @property endTime
     *  @type dateTime
     */
    prototype.endTime = null;
    /**
     *  credentialengine.org/instrument
     *  The object that helped the agent perform the action. e.g. John wrote a book with a pen.
     *  @property instrument
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.instrument = null;
    /**
     *  credentialengine.org/object
     *  The object upon [which] the action is carried out, whose state is kept intact or changed.
     *  @property object
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Competency | CompetencyFramework | Credential | CredentialOrganization | CredentialPerson | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.object = null;
    /**
     *  credentialengine.org/participant
     *  Other co-agents that participated in the action indirectly.
     *  @property participant
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.participant = null;
    /**
     *  credentialengine.org/resultingAward
     *  The result produced in the action.
     *  @property resultingAward
     *  @type CredentialAssertion
     */
    prototype.resultingAward = null;
    /**
     *  credentialengine.org/startTime
     *  The startTime of something.
     *  @property startTime
     *  @type dateTime
     */
    prototype.startTime = null;
}, {actingAgent: "Object", actionStatusType: "ActionStatusType", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", actingAgent: "Object", actionStatusType: "ActionStatusType", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", target: "EntryPoint", participant: "Object", instrument: "Thing", agent: "Object", object: "Thing", actionStatus: "ActionStatusType", result: "Thing", location: "Object", error: "Thing", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/AdvancedStandingAction
 *  An claim by an agent asserting that the object credential of the action provides advanced standing for a credential under the asserting agent's authority.
 *  @author credentialengine.org
 *  @class AdvancedStandingAction
 *  @module org.credentialengine
 *  @extends CredentialingAction
 */
var AdvancedStandingAction = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    CredentialingAction.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "AdvancedStandingAction";
};
AdvancedStandingAction = stjs.extend(AdvancedStandingAction, CredentialingAction, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/actingAgent
     *  The direct performer or driver (animate or inanimate) of an action.
     *  @property actingAgent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.actingAgent = null;
    /**
     *  credentialengine.org/actionStatusType
     *  Indicates the current disposition of the action.
     *  @property actionStatusType
     *  @type ActionStatusType
     */
    prototype.actionStatusType = null;
    /**
     *  credentialengine.org/agent
     *  The direct performer or driver of the action (animate or inanimate).
     *  @property agent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.agent = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/endTime
     *  The endTime of something.
     *  @property endTime
     *  @type dateTime
     */
    prototype.endTime = null;
    /**
     *  credentialengine.org/instrument
     *  The object that helped the agent perform the action. e.g. John wrote a book with a pen.
     *  @property instrument
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.instrument = null;
    /**
     *  credentialengine.org/object
     *  The object upon [which] the action is carried out, whose state is kept intact or changed.
     *  @property object
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Competency | CompetencyFramework | Credential | CredentialOrganization | CredentialPerson | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.object = null;
    /**
     *  credentialengine.org/participant
     *  Other co-agents that participated in the action indirectly.
     *  @property participant
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.participant = null;
    /**
     *  credentialengine.org/resultingAward
     *  The result produced in the action.
     *  @property resultingAward
     *  @type CredentialAssertion
     */
    prototype.resultingAward = null;
    /**
     *  credentialengine.org/startTime
     *  The startTime of something.
     *  @property startTime
     *  @type dateTime
     */
    prototype.startTime = null;
}, {actingAgent: "Object", actionStatusType: "ActionStatusType", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", actingAgent: "Object", actionStatusType: "ActionStatusType", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", target: "EntryPoint", participant: "Object", instrument: "Thing", agent: "Object", object: "Thing", actionStatus: "ActionStatusType", result: "Thing", location: "Object", error: "Thing", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/OfferAction
 *  An action by an authoritative agent offering access to a resource.
 *  @author credentialengine.org
 *  @class OfferAction
 *  @module org.credentialengine
 *  @extends CredentialingAction
 */
var OfferAction = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    CredentialingAction.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "OfferAction";
};
OfferAction = stjs.extend(OfferAction, CredentialingAction, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/actingAgent
     *  The direct performer or driver (animate or inanimate) of an action.
     *  @property actingAgent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.actingAgent = null;
    /**
     *  credentialengine.org/actionStatusType
     *  Indicates the current disposition of the action.
     *  @property actionStatusType
     *  @type ActionStatusType
     */
    prototype.actionStatusType = null;
    /**
     *  credentialengine.org/agent
     *  The direct performer or driver of the action (animate or inanimate).
     *  @property agent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.agent = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/endTime
     *  The endTime of something.
     *  @property endTime
     *  @type dateTime
     */
    prototype.endTime = null;
    /**
     *  credentialengine.org/instrument
     *  The object that helped the agent perform the action. e.g. John wrote a book with a pen.
     *  @property instrument
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.instrument = null;
    /**
     *  credentialengine.org/object
     *  The object upon [which] the action is carried out, whose state is kept intact or changed.
     *  @property object
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Competency | CompetencyFramework | Credential | CredentialOrganization | CredentialPerson | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.object = null;
    /**
     *  credentialengine.org/participant
     *  Other co-agents that participated in the action indirectly.
     *  @property participant
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.participant = null;
    /**
     *  credentialengine.org/resultingAward
     *  The result produced in the action.
     *  @property resultingAward
     *  @type CredentialAssertion
     */
    prototype.resultingAward = null;
    /**
     *  credentialengine.org/startTime
     *  The startTime of something.
     *  @property startTime
     *  @type dateTime
     */
    prototype.startTime = null;
}, {actingAgent: "Object", actionStatusType: "ActionStatusType", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", actingAgent: "Object", actionStatusType: "ActionStatusType", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", target: "EntryPoint", participant: "Object", instrument: "Thing", agent: "Object", object: "Thing", actionStatus: "ActionStatusType", result: "Thing", location: "Object", error: "Thing", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/FinancialAlignmentObject
 *  An alignment to a financial framework.
 *  @author credentialengine.org
 *  @class FinancialAlignmentObject
 *  @module org.credentialengine
 *  @extends CredentialAlignmentObject
 */
var FinancialAlignmentObject = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    CredentialAlignmentObject.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "FinancialAlignmentObject";
};
FinancialAlignmentObject = stjs.extend(FinancialAlignmentObject, CredentialAlignmentObject, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/alignmentDate
     *  The date  the alignment was made.
     *  @property alignmentDate
     *  @type dateTime
     */
    prototype.alignmentDate = null;
    /**
     *  credentialengine.org/alignmentType
     *  A category of alignment between the learning resource and the framework node.
     *  @property alignmentType
     *  @type Literal
     */
    prototype.alignmentType = null;
    /**
     *  credentialengine.org/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  credentialengine.org/framework
     *  The framework to which the resource being described is aligned.
     *  @property framework
     *  @type anyURI
     */
    prototype.framework = null;
    /**
     *  credentialengine.org/frameworkName
     *  The name of the framework to which the resource being described is aligned.
     *  @property frameworkName
     *  @type Literal
     */
    prototype.frameworkName = null;
    /**
     *  credentialengine.org/targetNode
     *  The node of a framework targeted by the alignment.
     *  @property targetNode
     *  @type anyURI
     */
    prototype.targetNode = null;
    /**
     *  credentialengine.org/targetNodeDescription
     *  The description of a node in an established educational framework.
     *  @property targetNodeDescription
     *  @type Literal
     */
    prototype.targetNodeDescription = null;
    /**
     *  credentialengine.org/targetNodeName
     *  The name of a node in an established educational framework.
     *  @property targetNodeName
     *  @type Literal
     */
    prototype.targetNodeName = null;
    /**
     *  credentialengine.org/weight
     *  An asserted measurement of the weight, degree, percent, or strength of a recommendation, requirement, or comparison.
     *  @property weight
     *  @type float
     */
    prototype.weight = 0.0;
}, {identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/Degree
 *  An academic credential conferred upon completion of a program or course of study, typically over multiple years at postsecondary education institutions.
 *  @author credentialengine.org
 *  @class Degree
 *  @module org.credentialengine
 *  @extends Credential
 */
var Degree = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    Credential.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "Degree";
};
Degree = stjs.extend(Degree, Credential, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  credentialengine.org/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  credentialengine.org/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  credentialengine.org/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  credentialengine.org/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  credentialengine.org/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  credentialengine.org/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  credentialengine.org/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  credentialengine.org/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  credentialengine.org/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  credentialengine.org/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  credentialengine.org/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  credentialengine.org/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  credentialengine.org/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson
     */
    prototype.copyrightHolder = null;
    /**
     *  credentialengine.org/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  credentialengine.org/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  credentialengine.org/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  credentialengine.org/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type dateTime
     */
    prototype.dateEffective = null;
    /**
     *  credentialengine.org/degreeConcentration
     *  A structured plan of study within a degree major.
     *  @property degreeConcentration
     *  @type CredentialAlignmentObject
     */
    prototype.degreeConcentration = null;
    /**
     *  credentialengine.org/degreeMajor
     *  The primary field of study of a degree-seeking student.
     *  @property degreeMajor
     *  @type CredentialAlignmentObject
     */
    prototype.degreeMajor = null;
    /**
     *  credentialengine.org/degreeMinor
     *  An optional, secondary field of study of a degree-seeking student.
     *  @property degreeMinor
     *  @type CredentialAlignmentObject
     */
    prototype.degreeMinor = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  credentialengine.org/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  credentialengine.org/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  credentialengine.org/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  credentialengine.org/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  credentialengine.org/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  credentialengine.org/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  credentialengine.org/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  credentialengine.org/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type Image
     */
    prototype.image = null;
    /**
     *  credentialengine.org/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  credentialengine.org/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  credentialengine.org/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  credentialengine.org/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  credentialengine.org/isRecommendedFor
     *  The resources being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  credentialengine.org/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  credentialengine.org/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  credentialengine.org/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  credentialengine.org/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  credentialengine.org/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  credentialengine.org/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  credentialengine.org/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  credentialengine.org/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  credentialengine.org/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  credentialengine.org/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  credentialengine.org/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  credentialengine.org/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  credentialengine.org/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  credentialengine.org/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  credentialengine.org/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  credentialengine.org/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  credentialengine.org/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  credentialengine.org/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  credentialengine.org/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  credentialengine.org/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  credentialengine.org/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  credentialengine.org/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  credentialengine.org/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  credentialengine.org/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  credentialengine.org/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  credentialengine.org/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  credentialengine.org/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  credentialengine.org/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  credentialengine.org/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  credentialengine.org/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  credentialengine.org/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  credentialengine.org/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject | Literal
     */
    prototype.subject = null;
    /**
     *  credentialengine.org/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  credentialengine.org/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  credentialengine.org/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", degreeConcentration: "CredentialAlignmentObject", degreeMajor: "CredentialAlignmentObject", degreeMinor: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/Diploma
 *  A credential awarded by educational institutions for successfully completion of a course of study or its equivalent.
 *  @author credentialengine.org
 *  @class Diploma
 *  @module org.credentialengine
 *  @extends Credential
 */
var Diploma = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    Credential.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "Diploma";
};
Diploma = stjs.extend(Diploma, Credential, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  credentialengine.org/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  credentialengine.org/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  credentialengine.org/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  credentialengine.org/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  credentialengine.org/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  credentialengine.org/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  credentialengine.org/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  credentialengine.org/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  credentialengine.org/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  credentialengine.org/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  credentialengine.org/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  credentialengine.org/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  credentialengine.org/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson
     */
    prototype.copyrightHolder = null;
    /**
     *  credentialengine.org/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  credentialengine.org/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  credentialengine.org/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  credentialengine.org/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type dateTime
     */
    prototype.dateEffective = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  credentialengine.org/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  credentialengine.org/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  credentialengine.org/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  credentialengine.org/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  credentialengine.org/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  credentialengine.org/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  credentialengine.org/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  credentialengine.org/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type Image
     */
    prototype.image = null;
    /**
     *  credentialengine.org/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  credentialengine.org/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  credentialengine.org/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  credentialengine.org/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  credentialengine.org/isRecommendedFor
     *  The resources being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  credentialengine.org/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  credentialengine.org/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  credentialengine.org/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  credentialengine.org/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  credentialengine.org/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  credentialengine.org/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  credentialengine.org/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  credentialengine.org/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  credentialengine.org/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  credentialengine.org/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  credentialengine.org/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  credentialengine.org/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  credentialengine.org/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  credentialengine.org/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  credentialengine.org/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  credentialengine.org/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  credentialengine.org/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  credentialengine.org/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  credentialengine.org/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  credentialengine.org/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  credentialengine.org/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  credentialengine.org/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  credentialengine.org/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  credentialengine.org/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  credentialengine.org/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  credentialengine.org/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  credentialengine.org/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  credentialengine.org/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  credentialengine.org/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  credentialengine.org/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  credentialengine.org/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  credentialengine.org/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject | Literal
     */
    prototype.subject = null;
    /**
     *  credentialengine.org/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  credentialengine.org/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  credentialengine.org/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/Certificate
 *  A credential that designates requisite mastery of the knowledge and skills of an occupation, profession, or academic program.
 *  @author credentialengine.org
 *  @class Certificate
 *  @module org.credentialengine
 *  @extends Credential
 */
var Certificate = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    Credential.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "Certificate";
};
Certificate = stjs.extend(Certificate, Credential, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  credentialengine.org/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  credentialengine.org/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  credentialengine.org/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  credentialengine.org/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  credentialengine.org/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  credentialengine.org/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  credentialengine.org/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  credentialengine.org/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  credentialengine.org/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  credentialengine.org/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  credentialengine.org/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  credentialengine.org/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  credentialengine.org/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson
     */
    prototype.copyrightHolder = null;
    /**
     *  credentialengine.org/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  credentialengine.org/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  credentialengine.org/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  credentialengine.org/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type dateTime
     */
    prototype.dateEffective = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  credentialengine.org/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  credentialengine.org/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  credentialengine.org/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  credentialengine.org/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  credentialengine.org/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  credentialengine.org/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  credentialengine.org/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  credentialengine.org/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type Image
     */
    prototype.image = null;
    /**
     *  credentialengine.org/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  credentialengine.org/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  credentialengine.org/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  credentialengine.org/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  credentialengine.org/isRecommendedFor
     *  The resources being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  credentialengine.org/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  credentialengine.org/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  credentialengine.org/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  credentialengine.org/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  credentialengine.org/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  credentialengine.org/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  credentialengine.org/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  credentialengine.org/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  credentialengine.org/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  credentialengine.org/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  credentialengine.org/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  credentialengine.org/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  credentialengine.org/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  credentialengine.org/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  credentialengine.org/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  credentialengine.org/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  credentialengine.org/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  credentialengine.org/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  credentialengine.org/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  credentialengine.org/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  credentialengine.org/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  credentialengine.org/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  credentialengine.org/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  credentialengine.org/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  credentialengine.org/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  credentialengine.org/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  credentialengine.org/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  credentialengine.org/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  credentialengine.org/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  credentialengine.org/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  credentialengine.org/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  credentialengine.org/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject | Literal
     */
    prototype.subject = null;
    /**
     *  credentialengine.org/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  credentialengine.org/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  credentialengine.org/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/QualityAssuranceCredential
 *  A credential assuring that an organization, program, or awarded credential meets prescribed requirements and may include development and administration of qualifying examinations.
 *  @author credentialengine.org
 *  @class QualityAssuranceCredential
 *  @module org.credentialengine
 *  @extends Credential
 */
var QualityAssuranceCredential = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    Credential.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "QualityAssuranceCredential";
};
QualityAssuranceCredential = stjs.extend(QualityAssuranceCredential, Credential, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  credentialengine.org/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  credentialengine.org/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  credentialengine.org/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  credentialengine.org/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  credentialengine.org/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  credentialengine.org/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  credentialengine.org/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  credentialengine.org/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  credentialengine.org/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  credentialengine.org/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  credentialengine.org/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  credentialengine.org/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  credentialengine.org/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson
     */
    prototype.copyrightHolder = null;
    /**
     *  credentialengine.org/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  credentialengine.org/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  credentialengine.org/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  credentialengine.org/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type dateTime
     */
    prototype.dateEffective = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  credentialengine.org/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  credentialengine.org/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  credentialengine.org/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  credentialengine.org/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  credentialengine.org/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  credentialengine.org/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  credentialengine.org/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  credentialengine.org/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type Image
     */
    prototype.image = null;
    /**
     *  credentialengine.org/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  credentialengine.org/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  credentialengine.org/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  credentialengine.org/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  credentialengine.org/isRecommendedFor
     *  The resources being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  credentialengine.org/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  credentialengine.org/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  credentialengine.org/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  credentialengine.org/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  credentialengine.org/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  credentialengine.org/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  credentialengine.org/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  credentialengine.org/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  credentialengine.org/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  credentialengine.org/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  credentialengine.org/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  credentialengine.org/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  credentialengine.org/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  credentialengine.org/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  credentialengine.org/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  credentialengine.org/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  credentialengine.org/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  credentialengine.org/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  credentialengine.org/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  credentialengine.org/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  credentialengine.org/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  credentialengine.org/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  credentialengine.org/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  credentialengine.org/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  credentialengine.org/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  credentialengine.org/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  credentialengine.org/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  credentialengine.org/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  credentialengine.org/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  credentialengine.org/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  credentialengine.org/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  credentialengine.org/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject | Literal
     */
    prototype.subject = null;
    /**
     *  credentialengine.org/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  credentialengine.org/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  credentialengine.org/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/License
 *  A credential awarded by a government agency that constitutes legal authority to do a specific job and/or utilize a specific item, system or infrastructure and are typically earned through some combination of degree or certificate attainment, certifications, assessments, work experience, and/or fees, and are time-limited and must be renewed periodically.
 *  @author credentialengine.org
 *  @class License
 *  @module org.credentialengine
 *  @extends Credential
 */
var License = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    Credential.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "License";
};
License = stjs.extend(License, Credential, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  credentialengine.org/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  credentialengine.org/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  credentialengine.org/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  credentialengine.org/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  credentialengine.org/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  credentialengine.org/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  credentialengine.org/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  credentialengine.org/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  credentialengine.org/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  credentialengine.org/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  credentialengine.org/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  credentialengine.org/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  credentialengine.org/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson
     */
    prototype.copyrightHolder = null;
    /**
     *  credentialengine.org/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  credentialengine.org/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  credentialengine.org/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  credentialengine.org/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type dateTime
     */
    prototype.dateEffective = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  credentialengine.org/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  credentialengine.org/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  credentialengine.org/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  credentialengine.org/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  credentialengine.org/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  credentialengine.org/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  credentialengine.org/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  credentialengine.org/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type Image
     */
    prototype.image = null;
    /**
     *  credentialengine.org/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  credentialengine.org/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  credentialengine.org/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  credentialengine.org/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  credentialengine.org/isRecommendedFor
     *  The resources being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  credentialengine.org/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  credentialengine.org/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  credentialengine.org/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  credentialengine.org/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  credentialengine.org/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  credentialengine.org/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  credentialengine.org/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  credentialengine.org/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  credentialengine.org/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  credentialengine.org/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  credentialengine.org/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  credentialengine.org/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  credentialengine.org/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  credentialengine.org/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  credentialengine.org/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  credentialengine.org/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  credentialengine.org/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  credentialengine.org/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  credentialengine.org/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  credentialengine.org/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  credentialengine.org/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  credentialengine.org/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  credentialengine.org/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  credentialengine.org/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  credentialengine.org/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  credentialengine.org/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  credentialengine.org/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  credentialengine.org/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  credentialengine.org/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  credentialengine.org/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  credentialengine.org/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  credentialengine.org/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject | Literal
     */
    prototype.subject = null;
    /**
     *  credentialengine.org/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  credentialengine.org/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  credentialengine.org/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/Certification
 *  A time-limited, renewable non-degree credential awarded by an authoritative body to an individual or organization for demonstrating the designated knowledge, skills, and abilities to perform a specific job.
 *  @author credentialengine.org
 *  @class Certification
 *  @module org.credentialengine
 *  @extends Credential
 */
var Certification = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    Credential.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "Certification";
};
Certification = stjs.extend(Certification, Credential, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  credentialengine.org/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  credentialengine.org/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  credentialengine.org/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  credentialengine.org/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  credentialengine.org/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  credentialengine.org/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  credentialengine.org/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  credentialengine.org/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  credentialengine.org/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  credentialengine.org/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  credentialengine.org/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  credentialengine.org/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  credentialengine.org/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson
     */
    prototype.copyrightHolder = null;
    /**
     *  credentialengine.org/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  credentialengine.org/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  credentialengine.org/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  credentialengine.org/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type dateTime
     */
    prototype.dateEffective = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  credentialengine.org/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  credentialengine.org/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  credentialengine.org/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  credentialengine.org/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  credentialengine.org/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  credentialengine.org/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  credentialengine.org/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  credentialengine.org/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type Image
     */
    prototype.image = null;
    /**
     *  credentialengine.org/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  credentialengine.org/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  credentialengine.org/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  credentialengine.org/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  credentialengine.org/isRecommendedFor
     *  The resources being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  credentialengine.org/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  credentialengine.org/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  credentialengine.org/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  credentialengine.org/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  credentialengine.org/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  credentialengine.org/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  credentialengine.org/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  credentialengine.org/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  credentialengine.org/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  credentialengine.org/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  credentialengine.org/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  credentialengine.org/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  credentialengine.org/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  credentialengine.org/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  credentialengine.org/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  credentialengine.org/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  credentialengine.org/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  credentialengine.org/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  credentialengine.org/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  credentialengine.org/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  credentialengine.org/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  credentialengine.org/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  credentialengine.org/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  credentialengine.org/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  credentialengine.org/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  credentialengine.org/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  credentialengine.org/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  credentialengine.org/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  credentialengine.org/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  credentialengine.org/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  credentialengine.org/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  credentialengine.org/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject | Literal
     */
    prototype.subject = null;
    /**
     *  credentialengine.org/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  credentialengine.org/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  credentialengine.org/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/Badge
 *  A recognition designed to be displayed as a marker of accomplishment, activity, achievement, skill, interest, association, or identity.
 *  @author credentialengine.org
 *  @class Badge
 *  @module org.credentialengine
 *  @extends Credential
 */
var Badge = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    Credential.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "Badge";
};
Badge = stjs.extend(Badge, Credential, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  credentialengine.org/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  credentialengine.org/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  credentialengine.org/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  credentialengine.org/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  credentialengine.org/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  credentialengine.org/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  credentialengine.org/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  credentialengine.org/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  credentialengine.org/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  credentialengine.org/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  credentialengine.org/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  credentialengine.org/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  credentialengine.org/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson
     */
    prototype.copyrightHolder = null;
    /**
     *  credentialengine.org/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  credentialengine.org/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  credentialengine.org/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  credentialengine.org/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type dateTime
     */
    prototype.dateEffective = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  credentialengine.org/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  credentialengine.org/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  credentialengine.org/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  credentialengine.org/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  credentialengine.org/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  credentialengine.org/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  credentialengine.org/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  credentialengine.org/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type Image
     */
    prototype.image = null;
    /**
     *  credentialengine.org/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  credentialengine.org/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  credentialengine.org/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  credentialengine.org/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  credentialengine.org/isRecommendedFor
     *  The resources being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  credentialengine.org/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  credentialengine.org/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  credentialengine.org/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  credentialengine.org/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  credentialengine.org/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  credentialengine.org/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  credentialengine.org/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  credentialengine.org/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  credentialengine.org/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  credentialengine.org/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  credentialengine.org/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  credentialengine.org/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  credentialengine.org/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  credentialengine.org/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  credentialengine.org/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  credentialengine.org/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  credentialengine.org/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  credentialengine.org/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  credentialengine.org/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  credentialengine.org/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  credentialengine.org/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  credentialengine.org/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  credentialengine.org/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  credentialengine.org/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  credentialengine.org/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  credentialengine.org/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  credentialengine.org/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  credentialengine.org/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  credentialengine.org/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  credentialengine.org/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  credentialengine.org/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  credentialengine.org/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject | Literal
     */
    prototype.subject = null;
    /**
     *  credentialengine.org/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  credentialengine.org/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  credentialengine.org/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/MicroCredential
 *  A credential that attests to achievement of a specific knowledge, skill, or competency.
 *  @author credentialengine.org
 *  @class MicroCredential
 *  @module org.credentialengine
 *  @extends Credential
 */
var MicroCredential = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    Credential.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "MicroCredential";
};
MicroCredential = stjs.extend(MicroCredential, Credential, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  credentialengine.org/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  credentialengine.org/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  credentialengine.org/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  credentialengine.org/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  credentialengine.org/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  credentialengine.org/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  credentialengine.org/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  credentialengine.org/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  credentialengine.org/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  credentialengine.org/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  credentialengine.org/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  credentialengine.org/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  credentialengine.org/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson
     */
    prototype.copyrightHolder = null;
    /**
     *  credentialengine.org/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  credentialengine.org/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  credentialengine.org/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  credentialengine.org/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type dateTime
     */
    prototype.dateEffective = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  credentialengine.org/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  credentialengine.org/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  credentialengine.org/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  credentialengine.org/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  credentialengine.org/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  credentialengine.org/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  credentialengine.org/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  credentialengine.org/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type Image
     */
    prototype.image = null;
    /**
     *  credentialengine.org/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  credentialengine.org/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  credentialengine.org/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  credentialengine.org/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  credentialengine.org/isRecommendedFor
     *  The resources being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  credentialengine.org/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  credentialengine.org/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  credentialengine.org/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  credentialengine.org/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  credentialengine.org/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  credentialengine.org/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  credentialengine.org/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  credentialengine.org/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  credentialengine.org/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  credentialengine.org/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  credentialengine.org/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  credentialengine.org/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  credentialengine.org/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  credentialengine.org/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  credentialengine.org/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  credentialengine.org/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  credentialengine.org/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  credentialengine.org/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  credentialengine.org/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  credentialengine.org/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  credentialengine.org/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  credentialengine.org/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  credentialengine.org/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  credentialengine.org/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  credentialengine.org/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  credentialengine.org/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  credentialengine.org/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  credentialengine.org/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  credentialengine.org/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  credentialengine.org/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  credentialengine.org/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  credentialengine.org/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject | Literal
     */
    prototype.subject = null;
    /**
     *  credentialengine.org/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  credentialengine.org/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  credentialengine.org/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/IndustryClassification
 *  The class of enumerations identifying industries.
 *  @author credentialengine.org
 *  @class IndustryClassification
 *  @module org.credentialengine
 *  @extends CredentialFramework
 */
var IndustryClassification = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    CredentialFramework.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "IndustryClassification";
};
IndustryClassification = stjs.extend(IndustryClassification, CredentialFramework, [], null, {owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/CompetencyFramework
 *  An entity comprised of a logically related set of competencies.
 *  @author credentialengine.org
 *  @class CompetencyFramework
 *  @module org.credentialengine
 *  @extends CredentialFramework
 */
var CompetencyFramework = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    CredentialFramework.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "CompetencyFramework";
};
CompetencyFramework = stjs.extend(CompetencyFramework, CredentialFramework, [], null, {owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/OccupationClassification
 *  The class of enumerations identifying occupations.
 *  @author credentialengine.org
 *  @class OccupationClassification
 *  @module org.credentialengine
 *  @extends CredentialFramework
 */
var OccupationClassification = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    CredentialFramework.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "OccupationClassification";
};
OccupationClassification = stjs.extend(OccupationClassification, CredentialFramework, [], null, {owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/InstructionalProgramClassification
 *  The class of enumerations identifying instructional programs.
 *  @author credentialengine.org
 *  @class InstructionalProgramClassification
 *  @module org.credentialengine
 *  @extends CredentialFramework
 */
var InstructionalProgramClassification = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    CredentialFramework.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "InstructionalProgramClassification";
};
InstructionalProgramClassification = stjs.extend(InstructionalProgramClassification, CredentialFramework, [], null, {owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/PostalAddress
 *  The mailing address.
 *  @author credentialengine.org
 *  @class PostalAddress
 *  @module org.credentialengine
 *  @extends ContactPoint
 */
var PostalAddress = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    ContactPoint.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "PostalAddress";
};
PostalAddress = stjs.extend(PostalAddress, ContactPoint, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  credentialengine.org/targetContactPoint
     *  Options for contacting the resource being described.
     *  @property targetContactPoint
     *  @type ContactPoint
     */
    prototype.targetContactPoint = null;
}, {targetContactPoint: "ContactPoint", email: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/Course
 *  A description of an educational course which may be offered as distinct instances at different times and places, or through different media or modes of study. An educational course is a sequence of one or more educational events and/or creative works which aims to build knowledge, competence or ability of learners.
 *  @author credentialengine.org
 *  @class Course
 *  @module org.credentialengine
 *  @extends LearningOpportunity
 */
var Course = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    LearningOpportunity.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "Course";
};
Course = stjs.extend(Course, LearningOpportunity, [], null, {owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/CredentialOrganization
 *  An organization that plays one or more key roles in the lifecycle of a credential.
 *  @author credentialengine.org
 *  @class CredentialOrganization
 *  @module org.credentialengine
 *  @extends Agent
 */
var CredentialOrganization = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    Agent.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "CredentialOrganization";
};
CredentialOrganization = stjs.extend(CredentialOrganization, Agent, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  credentialengine.org/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  credentialengine.org/address
     *  Physical address of the resource.
     *  @property address
     *  @type PostalAddress
     */
    prototype.address = null;
    /**
     *  credentialengine.org/agentPurpose
     *  A resource that describes the agent's primary purpose.
     *  @property agentPurpose
     *  @type anyURI
     */
    prototype.agentPurpose = null;
    /**
     *  credentialengine.org/agentPurposeDescription
     *  A description of the primary purpose of the agent being referenced.
     *  @property agentPurposeDescription
     *  @type Literal
     */
    prototype.agentPurposeDescription = null;
    /**
     *  credentialengine.org/agentSectorType
     *  The types of sociological, economic, or political subdivision of society served by an agent.
     *  @property agentSectorType
     *  @type CredentialAlignmentObject
     */
    prototype.agentSectorType = null;
    /**
     *  credentialengine.org/agentType
     *  The type of the described agent.
     *  @property agentType
     *  @type CredentialAlignmentObject
     */
    prototype.agentType = null;
    /**
     *  credentialengine.org/alternativeIdentifier
     *  An alternative, publicly available and globally unique agent identifier issued by an authoritative entity.
     *  @property alternativeIdentifier
     *  @type IdentifierValue
     */
    prototype.alternativeIdentifier = null;
    /**
     *  credentialengine.org/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  credentialengine.org/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  credentialengine.org/approves
     *  The agent being described officially accepts or authorizes the resource being referenced.
     *  @property approves
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | CompetencyFramework | Credential | CredentialOrganization | CredentialPerson | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QACredentialOrganization | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.approves = null;
    /**
     *  credentialengine.org/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  credentialengine.org/contactPoint
     *  A contact point for a person or organization.
     *  @property contactPoint
     *  @type ContactPoint | ContactPoint
     */
    prototype.contactPoint = null;
    /**
     *  credentialengine.org/credentialingAction
     *  Indicates a potential credentialing action, which describes an idealized action in which this thing would play an 'object' role.
     *  @property credentialingAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.credentialingAction = null;
    /**
     *  credentialengine.org/department
     *  The organization being referenced is a department of the organization being described.
     *  @property department
     *  @type CredentialOrganization | QACredentialOrganization
     */
    prototype.department = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/duns
     *  The Dun & Bradstreet DUNS number for identifying an organization or business person.
     *  @property duns
     *  @type Literal
     */
    prototype.duns = null;
    /**
     *  credentialengine.org/email
     *  Email address of the agent being described.
     *  @property email
     *  @type Literal | Email
     */
    prototype.email = null;
    /**
     *  credentialengine.org/employee
     *  The referenced person is an employee of the organization being described.
     *  @property employee
     *  @type CredentialPerson
     */
    prototype.employee = null;
    /**
     *  credentialengine.org/fein
     *  A Federal Employer Identification Number (FEIN) for identifying organizations, persons, states, government agencies, corporations, and companies.
     *  @property fein
     *  @type Literal
     */
    prototype.fein = null;
    /**
     *  credentialengine.org/foundingDate
     *  The date that this organization was founded.
     *  @property foundingDate
     *  @type dateTime
     */
    prototype.foundingDate = null;
    /**
     *  credentialengine.org/hasVerificationService
     *  A profile of available systems provided by the described agent to verify credential holders.
     *  @property hasVerificationService
     *  @type VerificationServiceProfile
     */
    prototype.hasVerificationService = null;
    /**
     *  credentialengine.org/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type Image
     */
    prototype.image = null;
    /**
     *  credentialengine.org/ipedsID
     *  The unique six (6) digit identifier assigned to all institutions that have submitted data to the Integrated Postsecondary Education Data System (IPEDS).
     *  @property ipedsID
     *  @type Literal
     */
    prototype.ipedsID = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  credentialengine.org/learningOpportunityOffered
     *  A learning opportunity offered by the agent.
     *  @property learningOpportunityOffered
     *  @type LearningOpportunityProfile
     */
    prototype.learningOpportunityOffered = null;
    /**
     *  credentialengine.org/missionAndGoalsStatement
     *  A resource that defines or explains the mission and goals statement of the resource being described.
     *  @property missionAndGoalsStatement
     *  @type anyURI
     */
    prototype.missionAndGoalsStatement = null;
    /**
     *  credentialengine.org/missionAndGoalsStatementDescription
     *  The mission and goals statement of the described agent.
     *  @property missionAndGoalsStatementDescription
     *  @type Literal
     */
    prototype.missionAndGoalsStatementDescription = null;
    /**
     *  credentialengine.org/naics
     *  The North American Industry Classification System (NAICS) code for a particular organization or business person.
     *  @property naics
     *  @type Literal
     */
    prototype.naics = null;
    /**
     *  credentialengine.org/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  credentialengine.org/offers
     *  Offers access to or issues the resource being referenced.
     *  @property offers
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.offers = null;
    /**
     *  credentialengine.org/opeID
     *  OPE ID number (Office of Postsecondary Education Identification) sometimes referred to as the Federal School Code.
     *  @property opeID
     *  @type Literal
     */
    prototype.opeID = null;
    /**
     *  credentialengine.org/owns
     *  The described agent has legal title to the referenced resource.
     *  @property owns
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.owns = null;
    /**
     *  credentialengine.org/parentOrganization
     *  The larger, parent organization of the organization being described.
     *  @property parentOrganization
     *  @type CredentialOrganization | QACredentialOrganization
     */
    prototype.parentOrganization = null;
    /**
     *  credentialengine.org/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  credentialengine.org/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  credentialengine.org/recognizes
     *  The agent being described recommends, endorses, indicates preference for, or otherwise provides positive judgment of a resource.
     *  @property recognizes
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | CompetencyFramework | Credential | CredentialOrganization | CredentialPerson | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QACredentialOrganization | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recognizes = null;
    /**
     *  credentialengine.org/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  credentialengine.org/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  credentialengine.org/renews
     *  The described agent handles the renewal of an award of the referenced credential.
     *  @property renews
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.renews = null;
    /**
     *  credentialengine.org/revokes
     *  The described agent ends the validity or operation of the resource being referenced based on cause.
     *  @property revokes
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.revokes = null;
    /**
     *  credentialengine.org/sameAs
     *  The resource being described is the same as the resource being referenced.
     *  @property sameAs
     *  @type 	/**
     *  credentialengine.org/serviceType
     *  The type of service offered by the organization.
     *  @property serviceType
     *  @type CredentialAlignmentObject
     */
    prototype.serviceType = null;
    /**
     *  credentialengine.org/socialMedia
     *  A social media resource for the resource being described.
     *  @property socialMedia
     *  @type anyURI
     */
    prototype.socialMedia = null;
    /**
     *  credentialengine.org/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  credentialengine.org/subOrganization
     *  The organization being described is the parent of the organization being referenced.
     *  @property subOrganization
     *  @type CredentialOrganization | QACredentialOrganization
     */
    prototype.subOrganization = null;
    /**
     *  credentialengine.org/targetContactPoint
     *  Options for contacting the resource being described.
     *  @property targetContactPoint
     *  @type ContactPoint
     */
    prototype.targetContactPoint = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", address: "PostalAddress", agentSectorType: "CredentialAlignmentObject", agentType: "CredentialAlignmentObject", alternativeIdentifier: "IdentifierValue", approvedBy: "Object", approvedIn: "JurisdictionProfile", approves: "Object", contactPoint: "Object", credentialingAction: "Object", department: "Object", email: "Object", employee: "CredentialPerson", hasVerificationService: "VerificationServiceProfile", image: "ImageObject", jurisdiction: "JurisdictionProfile", learningOpportunityOffered: "LearningOpportunityProfile", offers: "Object", owns: "Object", parentOrganization: "Object", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recognizes: "Object", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", renews: "Object", revokes: "Object", serviceType: "CredentialAlignmentObject", subOrganization: "Object", targetContactPoint: "ContactPoint", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/CredentialPerson
 *  An person who plays one or more key roles in the lifecycle of a credential.
 *  @author credentialengine.org
 *  @class CredentialPerson
 *  @module org.credentialengine
 *  @extends Agent
 */
var CredentialPerson = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    Agent.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "CredentialPerson";
};
CredentialPerson = stjs.extend(CredentialPerson, Agent, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  credentialengine.org/address
     *  Physical address of the resource.
     *  @property address
     *  @type PostalAddress
     */
    prototype.address = null;
    /**
     *  credentialengine.org/agentType
     *  The type of the described agent.
     *  @property agentType
     *  @type CredentialAlignmentObject
     */
    prototype.agentType = null;
    /**
     *  credentialengine.org/alternativeIdentifier
     *  An alternative, publicly available and globally unique agent identifier issued by an authoritative entity.
     *  @property alternativeIdentifier
     *  @type IdentifierValue
     */
    prototype.alternativeIdentifier = null;
    /**
     *  credentialengine.org/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  credentialengine.org/approves
     *  The agent being described officially accepts or authorizes the resource being referenced.
     *  @property approves
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | CompetencyFramework | Credential | CredentialOrganization | CredentialPerson | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QACredentialOrganization | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.approves = null;
    /**
     *  credentialengine.org/contactPoint
     *  A contact point for a person or organization.
     *  @property contactPoint
     *  @type ContactPoint | ContactPoint
     */
    prototype.contactPoint = null;
    /**
     *  credentialengine.org/credentialingAction
     *  Indicates a potential credentialing action, which describes an idealized action in which this thing would play an 'object' role.
     *  @property credentialingAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.credentialingAction = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/duns
     *  The Dun & Bradstreet DUNS number for identifying an organization or business person.
     *  @property duns
     *  @type Literal
     */
    prototype.duns = null;
    /**
     *  credentialengine.org/email
     *  Email address of the agent being described.
     *  @property email
     *  @type Literal | Email
     */
    prototype.email = null;
    /**
     *  credentialengine.org/fein
     *  A Federal Employer Identification Number (FEIN) for identifying organizations, persons, states, government agencies, corporations, and companies.
     *  @property fein
     *  @type Literal
     */
    prototype.fein = null;
    /**
     *  credentialengine.org/hasVerificationService
     *  A profile of available systems provided by the described agent to verify credential holders.
     *  @property hasVerificationService
     *  @type VerificationServiceProfile
     */
    prototype.hasVerificationService = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  credentialengine.org/missionAndGoalsStatement
     *  A resource that defines or explains the mission and goals statement of the resource being described.
     *  @property missionAndGoalsStatement
     *  @type anyURI
     */
    prototype.missionAndGoalsStatement = null;
    /**
     *  credentialengine.org/missionAndGoalsStatementDescription
     *  The mission and goals statement of the described agent.
     *  @property missionAndGoalsStatementDescription
     *  @type Literal
     */
    prototype.missionAndGoalsStatementDescription = null;
    /**
     *  credentialengine.org/naics
     *  The North American Industry Classification System (NAICS) code for a particular organization or business person.
     *  @property naics
     *  @type Literal
     */
    prototype.naics = null;
    /**
     *  credentialengine.org/offers
     *  Offers access to or issues the resource being referenced.
     *  @property offers
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.offers = null;
    /**
     *  credentialengine.org/owns
     *  The described agent has legal title to the referenced resource.
     *  @property owns
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.owns = null;
    /**
     *  credentialengine.org/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  credentialengine.org/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  credentialengine.org/recognizes
     *  The agent being described recommends, endorses, indicates preference for, or otherwise provides positive judgment of a resource.
     *  @property recognizes
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | CompetencyFramework | Credential | CredentialOrganization | CredentialPerson | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QACredentialOrganization | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recognizes = null;
    /**
     *  credentialengine.org/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  credentialengine.org/renews
     *  The described agent handles the renewal of an award of the referenced credential.
     *  @property renews
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.renews = null;
    /**
     *  credentialengine.org/revokes
     *  The described agent ends the validity or operation of the resource being referenced based on cause.
     *  @property revokes
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.revokes = null;
    /**
     *  credentialengine.org/sameAs
     *  The resource being described is the same as the resource being referenced.
     *  @property sameAs
     *  @type 	/**
     *  credentialengine.org/serviceType
     *  The type of service offered by the organization.
     *  @property serviceType
     *  @type CredentialAlignmentObject
     */
    prototype.serviceType = null;
}, {accreditedBy: "QACredentialOrganization", address: "PostalAddress", agentType: "CredentialAlignmentObject", alternativeIdentifier: "IdentifierValue", approvedBy: "Object", approves: "Object", contactPoint: "Object", credentialingAction: "Object", email: "Object", hasVerificationService: "VerificationServiceProfile", jurisdiction: "JurisdictionProfile", offers: "Object", owns: "Object", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recognizes: "Object", regulatedBy: "QACredentialOrganization", renews: "Object", revokes: "Object", serviceType: "CredentialAlignmentObject", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/QACredentialOrganization
 *  A quality assurance organization that plays one or more key roles in the lifecycle of a resource.
 *  @author credentialengine.org
 *  @class QACredentialOrganization
 *  @module org.credentialengine
 *  @extends Agent
 */
var QACredentialOrganization = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    Agent.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "QACredentialOrganization";
};
QACredentialOrganization = stjs.extend(QACredentialOrganization, Agent, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  credentialengine.org/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  credentialengine.org/address
     *  Physical address of the resource.
     *  @property address
     *  @type PostalAddress
     */
    prototype.address = null;
    /**
     *  credentialengine.org/agentPurpose
     *  A resource that describes the agent's primary purpose.
     *  @property agentPurpose
     *  @type anyURI
     */
    prototype.agentPurpose = null;
    /**
     *  credentialengine.org/agentPurposeDescription
     *  A description of the primary purpose of the agent being referenced.
     *  @property agentPurposeDescription
     *  @type Literal
     */
    prototype.agentPurposeDescription = null;
    /**
     *  credentialengine.org/agentSectorType
     *  The types of sociological, economic, or political subdivision of society served by an agent.
     *  @property agentSectorType
     *  @type CredentialAlignmentObject
     */
    prototype.agentSectorType = null;
    /**
     *  credentialengine.org/agentType
     *  The type of the described agent.
     *  @property agentType
     *  @type CredentialAlignmentObject
     */
    prototype.agentType = null;
    /**
     *  credentialengine.org/alternativeIdentifier
     *  An alternative, publicly available and globally unique agent identifier issued by an authoritative entity.
     *  @property alternativeIdentifier
     *  @type IdentifierValue
     */
    prototype.alternativeIdentifier = null;
    /**
     *  credentialengine.org/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  credentialengine.org/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  credentialengine.org/approves
     *  The agent being described officially accepts or authorizes the resource being referenced.
     *  @property approves
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | CompetencyFramework | Credential | CredentialOrganization | CredentialPerson | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QACredentialOrganization | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.approves = null;
    /**
     *  credentialengine.org/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  credentialengine.org/contactPoint
     *  A contact point for a person or organization.
     *  @property contactPoint
     *  @type ContactPoint | ContactPoint
     */
    prototype.contactPoint = null;
    /**
     *  credentialengine.org/credentialingAction
     *  Indicates a potential credentialing action, which describes an idealized action in which this thing would play an 'object' role.
     *  @property credentialingAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.credentialingAction = null;
    /**
     *  credentialengine.org/department
     *  The organization being referenced is a department of the organization being described.
     *  @property department
     *  @type CredentialOrganization | QACredentialOrganization
     */
    prototype.department = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/duns
     *  The Dun & Bradstreet DUNS number for identifying an organization or business person.
     *  @property duns
     *  @type Literal
     */
    prototype.duns = null;
    /**
     *  credentialengine.org/email
     *  Email address of the agent being described.
     *  @property email
     *  @type Literal | Email
     */
    prototype.email = null;
    /**
     *  credentialengine.org/employee
     *  The referenced person is an employee of the organization being described.
     *  @property employee
     *  @type CredentialPerson
     */
    prototype.employee = null;
    /**
     *  credentialengine.org/fein
     *  A Federal Employer Identification Number (FEIN) for identifying organizations, persons, states, government agencies, corporations, and companies.
     *  @property fein
     *  @type Literal
     */
    prototype.fein = null;
    /**
     *  credentialengine.org/foundingDate
     *  The date that this organization was founded.
     *  @property foundingDate
     *  @type dateTime
     */
    prototype.foundingDate = null;
    /**
     *  credentialengine.org/hasVerificationService
     *  A profile of available systems provided by the described agent to verify credential holders.
     *  @property hasVerificationService
     *  @type VerificationServiceProfile
     */
    prototype.hasVerificationService = null;
    /**
     *  credentialengine.org/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type Image
     */
    prototype.image = null;
    /**
     *  credentialengine.org/ipedsID
     *  The unique six (6) digit identifier assigned to all institutions that have submitted data to the Integrated Postsecondary Education Data System (IPEDS).
     *  @property ipedsID
     *  @type Literal
     */
    prototype.ipedsID = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  credentialengine.org/learningOpportunityOffered
     *  A learning opportunity offered by the agent.
     *  @property learningOpportunityOffered
     *  @type LearningOpportunityProfile
     */
    prototype.learningOpportunityOffered = null;
    /**
     *  credentialengine.org/missionAndGoalsStatement
     *  A resource that defines or explains the mission and goals statement of the resource being described.
     *  @property missionAndGoalsStatement
     *  @type anyURI
     */
    prototype.missionAndGoalsStatement = null;
    /**
     *  credentialengine.org/missionAndGoalsStatementDescription
     *  The mission and goals statement of the described agent.
     *  @property missionAndGoalsStatementDescription
     *  @type Literal
     */
    prototype.missionAndGoalsStatementDescription = null;
    /**
     *  credentialengine.org/naics
     *  The North American Industry Classification System (NAICS) code for a particular organization or business person.
     *  @property naics
     *  @type Literal
     */
    prototype.naics = null;
    /**
     *  credentialengine.org/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  credentialengine.org/offers
     *  Offers access to or issues the resource being referenced.
     *  @property offers
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.offers = null;
    /**
     *  credentialengine.org/opeID
     *  OPE ID number (Office of Postsecondary Education Identification) sometimes referred to as the Federal School Code.
     *  @property opeID
     *  @type Literal
     */
    prototype.opeID = null;
    /**
     *  credentialengine.org/owns
     *  The described agent has legal title to the referenced resource.
     *  @property owns
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.owns = null;
    /**
     *  credentialengine.org/parentOrganization
     *  The larger, parent organization of the organization being described.
     *  @property parentOrganization
     *  @type CredentialOrganization | QACredentialOrganization
     */
    prototype.parentOrganization = null;
    /**
     *  credentialengine.org/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  credentialengine.org/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  credentialengine.org/recognizes
     *  The agent being described recommends, endorses, indicates preference for, or otherwise provides positive judgment of a resource.
     *  @property recognizes
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | CompetencyFramework | Credential | CredentialOrganization | CredentialPerson | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QACredentialOrganization | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recognizes = null;
    /**
     *  credentialengine.org/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  credentialengine.org/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  credentialengine.org/renews
     *  The described agent handles the renewal of an award of the referenced credential.
     *  @property renews
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.renews = null;
    /**
     *  credentialengine.org/revokes
     *  The described agent ends the validity or operation of the resource being referenced based on cause.
     *  @property revokes
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.revokes = null;
    /**
     *  credentialengine.org/sameAs
     *  The resource being described is the same as the resource being referenced.
     *  @property sameAs
     *  @type 	/**
     *  credentialengine.org/serviceType
     *  The type of service offered by the organization.
     *  @property serviceType
     *  @type CredentialAlignmentObject
     */
    prototype.serviceType = null;
    /**
     *  credentialengine.org/socialMedia
     *  A social media resource for the resource being described.
     *  @property socialMedia
     *  @type anyURI
     */
    prototype.socialMedia = null;
    /**
     *  credentialengine.org/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  credentialengine.org/subOrganization
     *  The organization being described is the parent of the organization being referenced.
     *  @property subOrganization
     *  @type CredentialOrganization | QACredentialOrganization
     */
    prototype.subOrganization = null;
    /**
     *  credentialengine.org/targetContactPoint
     *  Options for contacting the resource being described.
     *  @property targetContactPoint
     *  @type ContactPoint
     */
    prototype.targetContactPoint = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", address: "PostalAddress", agentSectorType: "CredentialAlignmentObject", agentType: "CredentialAlignmentObject", alternativeIdentifier: "IdentifierValue", approvedBy: "Object", approvedIn: "JurisdictionProfile", approves: "Object", contactPoint: "Object", credentialingAction: "Object", department: "Object", email: "Object", employee: "CredentialPerson", hasVerificationService: "VerificationServiceProfile", image: "ImageObject", jurisdiction: "JurisdictionProfile", learningOpportunityOffered: "LearningOpportunityProfile", offers: "Object", owns: "Object", parentOrganization: "Object", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recognizes: "Object", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", renews: "Object", revokes: "Object", serviceType: "CredentialAlignmentObject", subOrganization: "Object", targetContactPoint: "ContactPoint", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/MasterDegree
 *  An award level that requires the successful completion of a program of study of at least the full-time equivalent of 1 but not more than 2 academic years of work beyond the bachelor's degree.
 *  @author credentialengine.org
 *  @class MasterDegree
 *  @module org.credentialengine
 *  @extends Degree
 */
var MasterDegree = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    Degree.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "MasterDegree";
};
MasterDegree = stjs.extend(MasterDegree, Degree, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  credentialengine.org/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  credentialengine.org/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  credentialengine.org/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  credentialengine.org/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  credentialengine.org/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  credentialengine.org/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  credentialengine.org/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  credentialengine.org/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  credentialengine.org/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  credentialengine.org/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  credentialengine.org/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  credentialengine.org/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  credentialengine.org/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson
     */
    prototype.copyrightHolder = null;
    /**
     *  credentialengine.org/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  credentialengine.org/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  credentialengine.org/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  credentialengine.org/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type dateTime
     */
    prototype.dateEffective = null;
    /**
     *  credentialengine.org/degreeConcentration
     *  A structured plan of study within a degree major.
     *  @property degreeConcentration
     *  @type CredentialAlignmentObject
     */
    prototype.degreeConcentration = null;
    /**
     *  credentialengine.org/degreeMajor
     *  The primary field of study of a degree-seeking student.
     *  @property degreeMajor
     *  @type CredentialAlignmentObject
     */
    prototype.degreeMajor = null;
    /**
     *  credentialengine.org/degreeMinor
     *  An optional, secondary field of study of a degree-seeking student.
     *  @property degreeMinor
     *  @type CredentialAlignmentObject
     */
    prototype.degreeMinor = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  credentialengine.org/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  credentialengine.org/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  credentialengine.org/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  credentialengine.org/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  credentialengine.org/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  credentialengine.org/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  credentialengine.org/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  credentialengine.org/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type Image
     */
    prototype.image = null;
    /**
     *  credentialengine.org/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  credentialengine.org/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  credentialengine.org/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  credentialengine.org/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  credentialengine.org/isRecommendedFor
     *  The resources being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  credentialengine.org/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  credentialengine.org/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  credentialengine.org/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  credentialengine.org/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  credentialengine.org/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  credentialengine.org/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  credentialengine.org/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  credentialengine.org/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  credentialengine.org/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  credentialengine.org/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  credentialengine.org/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  credentialengine.org/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  credentialengine.org/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  credentialengine.org/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  credentialengine.org/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  credentialengine.org/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  credentialengine.org/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  credentialengine.org/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  credentialengine.org/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  credentialengine.org/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  credentialengine.org/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  credentialengine.org/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  credentialengine.org/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  credentialengine.org/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  credentialengine.org/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  credentialengine.org/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  credentialengine.org/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  credentialengine.org/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  credentialengine.org/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  credentialengine.org/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  credentialengine.org/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  credentialengine.org/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject | Literal
     */
    prototype.subject = null;
    /**
     *  credentialengine.org/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  credentialengine.org/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  credentialengine.org/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", degreeConcentration: "CredentialAlignmentObject", degreeMajor: "CredentialAlignmentObject", degreeMinor: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", degreeConcentration: "CredentialAlignmentObject", degreeMajor: "CredentialAlignmentObject", degreeMinor: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/BachelorDegree
 *  An award level that normally requires at least 4 but not more than 5 years of full-time equivalent college-level work.
 *  @author credentialengine.org
 *  @class BachelorDegree
 *  @module org.credentialengine
 *  @extends Degree
 */
var BachelorDegree = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    Degree.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "BachelorDegree";
};
BachelorDegree = stjs.extend(BachelorDegree, Degree, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  credentialengine.org/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  credentialengine.org/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  credentialengine.org/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  credentialengine.org/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  credentialengine.org/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  credentialengine.org/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  credentialengine.org/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  credentialengine.org/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  credentialengine.org/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  credentialengine.org/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  credentialengine.org/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  credentialengine.org/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  credentialengine.org/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson
     */
    prototype.copyrightHolder = null;
    /**
     *  credentialengine.org/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  credentialengine.org/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  credentialengine.org/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  credentialengine.org/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type dateTime
     */
    prototype.dateEffective = null;
    /**
     *  credentialengine.org/degreeConcentration
     *  A structured plan of study within a degree major.
     *  @property degreeConcentration
     *  @type CredentialAlignmentObject
     */
    prototype.degreeConcentration = null;
    /**
     *  credentialengine.org/degreeMajor
     *  The primary field of study of a degree-seeking student.
     *  @property degreeMajor
     *  @type CredentialAlignmentObject
     */
    prototype.degreeMajor = null;
    /**
     *  credentialengine.org/degreeMinor
     *  An optional, secondary field of study of a degree-seeking student.
     *  @property degreeMinor
     *  @type CredentialAlignmentObject
     */
    prototype.degreeMinor = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  credentialengine.org/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  credentialengine.org/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  credentialengine.org/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  credentialengine.org/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  credentialengine.org/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  credentialengine.org/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  credentialengine.org/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  credentialengine.org/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type Image
     */
    prototype.image = null;
    /**
     *  credentialengine.org/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  credentialengine.org/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  credentialengine.org/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  credentialengine.org/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  credentialengine.org/isRecommendedFor
     *  The resources being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  credentialengine.org/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  credentialengine.org/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  credentialengine.org/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  credentialengine.org/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  credentialengine.org/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  credentialengine.org/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  credentialengine.org/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  credentialengine.org/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  credentialengine.org/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  credentialengine.org/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  credentialengine.org/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  credentialengine.org/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  credentialengine.org/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  credentialengine.org/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  credentialengine.org/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  credentialengine.org/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  credentialengine.org/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  credentialengine.org/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  credentialengine.org/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  credentialengine.org/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  credentialengine.org/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  credentialengine.org/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  credentialengine.org/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  credentialengine.org/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  credentialengine.org/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  credentialengine.org/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  credentialengine.org/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  credentialengine.org/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  credentialengine.org/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  credentialengine.org/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  credentialengine.org/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  credentialengine.org/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject | Literal
     */
    prototype.subject = null;
    /**
     *  credentialengine.org/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  credentialengine.org/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  credentialengine.org/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", degreeConcentration: "CredentialAlignmentObject", degreeMajor: "CredentialAlignmentObject", degreeMinor: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", degreeConcentration: "CredentialAlignmentObject", degreeMajor: "CredentialAlignmentObject", degreeMinor: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/AssociateDegree
 *  An award level that normally requires at least 2 but less than 4 years of full-time equivalent college-level work.
 *  @author credentialengine.org
 *  @class AssociateDegree
 *  @module org.credentialengine
 *  @extends Degree
 */
var AssociateDegree = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    Degree.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "AssociateDegree";
};
AssociateDegree = stjs.extend(AssociateDegree, Degree, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  credentialengine.org/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  credentialengine.org/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  credentialengine.org/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  credentialengine.org/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  credentialengine.org/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  credentialengine.org/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  credentialengine.org/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  credentialengine.org/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  credentialengine.org/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  credentialengine.org/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  credentialengine.org/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  credentialengine.org/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  credentialengine.org/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson
     */
    prototype.copyrightHolder = null;
    /**
     *  credentialengine.org/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  credentialengine.org/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  credentialengine.org/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  credentialengine.org/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type dateTime
     */
    prototype.dateEffective = null;
    /**
     *  credentialengine.org/degreeConcentration
     *  A structured plan of study within a degree major.
     *  @property degreeConcentration
     *  @type CredentialAlignmentObject
     */
    prototype.degreeConcentration = null;
    /**
     *  credentialengine.org/degreeMajor
     *  The primary field of study of a degree-seeking student.
     *  @property degreeMajor
     *  @type CredentialAlignmentObject
     */
    prototype.degreeMajor = null;
    /**
     *  credentialengine.org/degreeMinor
     *  An optional, secondary field of study of a degree-seeking student.
     *  @property degreeMinor
     *  @type CredentialAlignmentObject
     */
    prototype.degreeMinor = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  credentialengine.org/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  credentialengine.org/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  credentialengine.org/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  credentialengine.org/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  credentialengine.org/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  credentialengine.org/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  credentialengine.org/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  credentialengine.org/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type Image
     */
    prototype.image = null;
    /**
     *  credentialengine.org/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  credentialengine.org/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  credentialengine.org/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  credentialengine.org/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  credentialengine.org/isRecommendedFor
     *  The resources being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  credentialengine.org/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  credentialengine.org/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  credentialengine.org/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  credentialengine.org/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  credentialengine.org/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  credentialengine.org/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  credentialengine.org/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  credentialengine.org/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  credentialengine.org/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  credentialengine.org/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  credentialengine.org/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  credentialengine.org/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  credentialengine.org/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  credentialengine.org/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  credentialengine.org/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  credentialengine.org/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  credentialengine.org/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  credentialengine.org/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  credentialengine.org/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  credentialengine.org/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  credentialengine.org/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  credentialengine.org/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  credentialengine.org/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  credentialengine.org/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  credentialengine.org/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  credentialengine.org/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  credentialengine.org/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  credentialengine.org/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  credentialengine.org/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  credentialengine.org/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  credentialengine.org/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  credentialengine.org/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject | Literal
     */
    prototype.subject = null;
    /**
     *  credentialengine.org/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  credentialengine.org/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  credentialengine.org/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", degreeConcentration: "CredentialAlignmentObject", degreeMajor: "CredentialAlignmentObject", degreeMinor: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", degreeConcentration: "CredentialAlignmentObject", degreeMajor: "CredentialAlignmentObject", degreeMinor: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/DoctoralDegree
 *  The highest award level to be earned for postsecondary study.
 *  @author credentialengine.org
 *  @class DoctoralDegree
 *  @module org.credentialengine
 *  @extends Degree
 */
var DoctoralDegree = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    Degree.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "DoctoralDegree";
};
DoctoralDegree = stjs.extend(DoctoralDegree, Degree, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  credentialengine.org/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  credentialengine.org/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  credentialengine.org/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  credentialengine.org/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  credentialengine.org/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  credentialengine.org/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  credentialengine.org/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  credentialengine.org/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  credentialengine.org/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  credentialengine.org/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  credentialengine.org/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  credentialengine.org/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  credentialengine.org/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson
     */
    prototype.copyrightHolder = null;
    /**
     *  credentialengine.org/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  credentialengine.org/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  credentialengine.org/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  credentialengine.org/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type dateTime
     */
    prototype.dateEffective = null;
    /**
     *  credentialengine.org/degreeConcentration
     *  A structured plan of study within a degree major.
     *  @property degreeConcentration
     *  @type CredentialAlignmentObject
     */
    prototype.degreeConcentration = null;
    /**
     *  credentialengine.org/degreeMajor
     *  The primary field of study of a degree-seeking student.
     *  @property degreeMajor
     *  @type CredentialAlignmentObject
     */
    prototype.degreeMajor = null;
    /**
     *  credentialengine.org/degreeMinor
     *  An optional, secondary field of study of a degree-seeking student.
     *  @property degreeMinor
     *  @type CredentialAlignmentObject
     */
    prototype.degreeMinor = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  credentialengine.org/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  credentialengine.org/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  credentialengine.org/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  credentialengine.org/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  credentialengine.org/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  credentialengine.org/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  credentialengine.org/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  credentialengine.org/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type Image
     */
    prototype.image = null;
    /**
     *  credentialengine.org/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  credentialengine.org/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  credentialengine.org/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  credentialengine.org/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  credentialengine.org/isRecommendedFor
     *  The resources being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  credentialengine.org/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  credentialengine.org/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  credentialengine.org/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  credentialengine.org/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  credentialengine.org/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  credentialengine.org/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  credentialengine.org/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  credentialengine.org/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  credentialengine.org/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  credentialengine.org/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  credentialengine.org/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  credentialengine.org/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  credentialengine.org/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  credentialengine.org/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  credentialengine.org/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  credentialengine.org/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  credentialengine.org/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  credentialengine.org/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  credentialengine.org/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  credentialengine.org/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  credentialengine.org/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  credentialengine.org/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  credentialengine.org/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  credentialengine.org/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  credentialengine.org/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  credentialengine.org/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  credentialengine.org/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  credentialengine.org/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  credentialengine.org/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  credentialengine.org/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  credentialengine.org/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  credentialengine.org/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject | Literal
     */
    prototype.subject = null;
    /**
     *  credentialengine.org/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  credentialengine.org/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  credentialengine.org/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", degreeConcentration: "CredentialAlignmentObject", degreeMajor: "CredentialAlignmentObject", degreeMinor: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", degreeConcentration: "CredentialAlignmentObject", degreeMajor: "CredentialAlignmentObject", degreeMinor: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/SecondarySchoolDiploma
 *  A diploma awarded by secondary education institutions for successful completion of a secondary school program typically lasting four years.
 *  @author credentialengine.org
 *  @class SecondarySchoolDiploma
 *  @module org.credentialengine
 *  @extends Diploma
 */
var SecondarySchoolDiploma = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    Diploma.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "SecondarySchoolDiploma";
};
SecondarySchoolDiploma = stjs.extend(SecondarySchoolDiploma, Diploma, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  credentialengine.org/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  credentialengine.org/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  credentialengine.org/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  credentialengine.org/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  credentialengine.org/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  credentialengine.org/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  credentialengine.org/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  credentialengine.org/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  credentialengine.org/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  credentialengine.org/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  credentialengine.org/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  credentialengine.org/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  credentialengine.org/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson
     */
    prototype.copyrightHolder = null;
    /**
     *  credentialengine.org/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  credentialengine.org/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  credentialengine.org/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  credentialengine.org/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type dateTime
     */
    prototype.dateEffective = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  credentialengine.org/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  credentialengine.org/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  credentialengine.org/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  credentialengine.org/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  credentialengine.org/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  credentialengine.org/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  credentialengine.org/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  credentialengine.org/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type Image
     */
    prototype.image = null;
    /**
     *  credentialengine.org/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  credentialengine.org/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  credentialengine.org/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  credentialengine.org/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  credentialengine.org/isRecommendedFor
     *  The resources being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  credentialengine.org/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  credentialengine.org/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  credentialengine.org/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  credentialengine.org/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  credentialengine.org/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  credentialengine.org/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  credentialengine.org/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  credentialengine.org/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  credentialengine.org/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  credentialengine.org/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  credentialengine.org/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  credentialengine.org/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  credentialengine.org/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  credentialengine.org/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  credentialengine.org/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  credentialengine.org/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  credentialengine.org/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  credentialengine.org/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  credentialengine.org/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  credentialengine.org/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  credentialengine.org/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  credentialengine.org/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  credentialengine.org/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  credentialengine.org/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  credentialengine.org/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  credentialengine.org/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  credentialengine.org/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  credentialengine.org/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  credentialengine.org/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  credentialengine.org/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  credentialengine.org/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  credentialengine.org/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject | Literal
     */
    prototype.subject = null;
    /**
     *  credentialengine.org/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  credentialengine.org/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  credentialengine.org/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/GeneralEducationDevelopment
 *  A credential awarded by examination that demonstrates that an individual has acquired secondary school-level academic skills.
 *  @author credentialengine.org
 *  @class GeneralEducationDevelopment
 *  @module org.credentialengine
 *  @extends Diploma
 */
var GeneralEducationDevelopment = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    Diploma.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "GeneralEducationDevelopment";
};
GeneralEducationDevelopment = stjs.extend(GeneralEducationDevelopment, Diploma, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  credentialengine.org/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  credentialengine.org/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  credentialengine.org/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  credentialengine.org/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  credentialengine.org/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  credentialengine.org/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  credentialengine.org/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  credentialengine.org/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  credentialengine.org/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  credentialengine.org/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  credentialengine.org/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  credentialengine.org/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  credentialengine.org/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson
     */
    prototype.copyrightHolder = null;
    /**
     *  credentialengine.org/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  credentialengine.org/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  credentialengine.org/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  credentialengine.org/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type dateTime
     */
    prototype.dateEffective = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  credentialengine.org/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  credentialengine.org/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  credentialengine.org/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  credentialengine.org/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  credentialengine.org/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  credentialengine.org/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  credentialengine.org/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  credentialengine.org/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type Image
     */
    prototype.image = null;
    /**
     *  credentialengine.org/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  credentialengine.org/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  credentialengine.org/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  credentialengine.org/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  credentialengine.org/isRecommendedFor
     *  The resources being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  credentialengine.org/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  credentialengine.org/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  credentialengine.org/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  credentialengine.org/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  credentialengine.org/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  credentialengine.org/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  credentialengine.org/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  credentialengine.org/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  credentialengine.org/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  credentialengine.org/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  credentialengine.org/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  credentialengine.org/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  credentialengine.org/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  credentialengine.org/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  credentialengine.org/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  credentialengine.org/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  credentialengine.org/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  credentialengine.org/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  credentialengine.org/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  credentialengine.org/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  credentialengine.org/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  credentialengine.org/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  credentialengine.org/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  credentialengine.org/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  credentialengine.org/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  credentialengine.org/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  credentialengine.org/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  credentialengine.org/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  credentialengine.org/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  credentialengine.org/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  credentialengine.org/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  credentialengine.org/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject | Literal
     */
    prototype.subject = null;
    /**
     *  credentialengine.org/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  credentialengine.org/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  credentialengine.org/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/ApprenticeshipCertificate
 *  A credential earned through work-based learning and postsecondary earn-and-learn models that meet national standards and are applicable to industry trades and professions.
 *  @author credentialengine.org
 *  @class ApprenticeshipCertificate
 *  @module org.credentialengine
 *  @extends Certificate
 */
var ApprenticeshipCertificate = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    Certificate.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "ApprenticeshipCertificate";
};
ApprenticeshipCertificate = stjs.extend(ApprenticeshipCertificate, Certificate, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  credentialengine.org/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  credentialengine.org/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  credentialengine.org/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  credentialengine.org/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  credentialengine.org/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  credentialengine.org/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  credentialengine.org/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  credentialengine.org/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  credentialengine.org/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  credentialengine.org/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  credentialengine.org/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  credentialengine.org/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  credentialengine.org/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson
     */
    prototype.copyrightHolder = null;
    /**
     *  credentialengine.org/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  credentialengine.org/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  credentialengine.org/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  credentialengine.org/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type dateTime
     */
    prototype.dateEffective = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  credentialengine.org/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  credentialengine.org/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  credentialengine.org/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  credentialengine.org/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  credentialengine.org/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  credentialengine.org/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  credentialengine.org/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  credentialengine.org/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type Image
     */
    prototype.image = null;
    /**
     *  credentialengine.org/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  credentialengine.org/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  credentialengine.org/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  credentialengine.org/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  credentialengine.org/isRecommendedFor
     *  The resources being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  credentialengine.org/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  credentialengine.org/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  credentialengine.org/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  credentialengine.org/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  credentialengine.org/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  credentialengine.org/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  credentialengine.org/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  credentialengine.org/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  credentialengine.org/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  credentialengine.org/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  credentialengine.org/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  credentialengine.org/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  credentialengine.org/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  credentialengine.org/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  credentialengine.org/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  credentialengine.org/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  credentialengine.org/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  credentialengine.org/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  credentialengine.org/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  credentialengine.org/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  credentialengine.org/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  credentialengine.org/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  credentialengine.org/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  credentialengine.org/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  credentialengine.org/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  credentialengine.org/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  credentialengine.org/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  credentialengine.org/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  credentialengine.org/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  credentialengine.org/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  credentialengine.org/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  credentialengine.org/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject | Literal
     */
    prototype.subject = null;
    /**
     *  credentialengine.org/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  credentialengine.org/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  credentialengine.org/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/DigitalBadge
 *  A badge offered in digital form.
 *  @author credentialengine.org
 *  @class DigitalBadge
 *  @module org.credentialengine
 *  @extends Badge
 */
var DigitalBadge = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    Badge.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "DigitalBadge";
};
DigitalBadge = stjs.extend(DigitalBadge, Badge, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  credentialengine.org/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  credentialengine.org/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  credentialengine.org/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  credentialengine.org/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  credentialengine.org/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  credentialengine.org/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  credentialengine.org/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  credentialengine.org/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  credentialengine.org/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  credentialengine.org/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  credentialengine.org/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  credentialengine.org/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  credentialengine.org/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson
     */
    prototype.copyrightHolder = null;
    /**
     *  credentialengine.org/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  credentialengine.org/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  credentialengine.org/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  credentialengine.org/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type dateTime
     */
    prototype.dateEffective = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  credentialengine.org/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  credentialengine.org/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  credentialengine.org/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  credentialengine.org/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  credentialengine.org/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  credentialengine.org/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  credentialengine.org/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  credentialengine.org/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type Image
     */
    prototype.image = null;
    /**
     *  credentialengine.org/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  credentialengine.org/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  credentialengine.org/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  credentialengine.org/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  credentialengine.org/isRecommendedFor
     *  The resources being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  credentialengine.org/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  credentialengine.org/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  credentialengine.org/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  credentialengine.org/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  credentialengine.org/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  credentialengine.org/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  credentialengine.org/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  credentialengine.org/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  credentialengine.org/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  credentialengine.org/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  credentialengine.org/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  credentialengine.org/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  credentialengine.org/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  credentialengine.org/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  credentialengine.org/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  credentialengine.org/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  credentialengine.org/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  credentialengine.org/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  credentialengine.org/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  credentialengine.org/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  credentialengine.org/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  credentialengine.org/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  credentialengine.org/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  credentialengine.org/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  credentialengine.org/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  credentialengine.org/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  credentialengine.org/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  credentialengine.org/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  credentialengine.org/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  credentialengine.org/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  credentialengine.org/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  credentialengine.org/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject | Literal
     */
    prototype.subject = null;
    /**
     *  credentialengine.org/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  credentialengine.org/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  credentialengine.org/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/OpenBadge
 *  An Open Badge is a visual symbol containing verifiable claims in accordance with the Open Badges specification and delivered digitally.
 *  @author credentialengine.org
 *  @class OpenBadge
 *  @module org.credentialengine
 *  @extends Badge
 */
var OpenBadge = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    Badge.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "OpenBadge";
};
OpenBadge = stjs.extend(OpenBadge, Badge, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  credentialengine.org/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  credentialengine.org/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  credentialengine.org/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  credentialengine.org/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  credentialengine.org/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  credentialengine.org/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  credentialengine.org/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  credentialengine.org/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  credentialengine.org/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  credentialengine.org/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  credentialengine.org/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  credentialengine.org/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  credentialengine.org/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson
     */
    prototype.copyrightHolder = null;
    /**
     *  credentialengine.org/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  credentialengine.org/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  credentialengine.org/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  credentialengine.org/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type dateTime
     */
    prototype.dateEffective = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  credentialengine.org/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  credentialengine.org/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  credentialengine.org/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  credentialengine.org/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  credentialengine.org/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  credentialengine.org/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  credentialengine.org/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  credentialengine.org/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type Image
     */
    prototype.image = null;
    /**
     *  credentialengine.org/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  credentialengine.org/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  credentialengine.org/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  credentialengine.org/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  credentialengine.org/isRecommendedFor
     *  The resources being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  credentialengine.org/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  credentialengine.org/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  credentialengine.org/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  credentialengine.org/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  credentialengine.org/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  credentialengine.org/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  credentialengine.org/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  credentialengine.org/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  credentialengine.org/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  credentialengine.org/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  credentialengine.org/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  credentialengine.org/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  credentialengine.org/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  credentialengine.org/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  credentialengine.org/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  credentialengine.org/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  credentialengine.org/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  credentialengine.org/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  credentialengine.org/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  credentialengine.org/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  credentialengine.org/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  credentialengine.org/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  credentialengine.org/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  credentialengine.org/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  credentialengine.org/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  credentialengine.org/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  credentialengine.org/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  credentialengine.org/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  credentialengine.org/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  credentialengine.org/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  credentialengine.org/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  credentialengine.org/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject | Literal
     */
    prototype.subject = null;
    /**
     *  credentialengine.org/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  credentialengine.org/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  credentialengine.org/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/ProfessionalDoctorate
 *  A doctoral degree conferred upon completion of a program providing the knowledge and skills for the recognition, credential, or license required for professional practice.
 *  @author credentialengine.org
 *  @class ProfessionalDoctorate
 *  @module org.credentialengine
 *  @extends DoctoralDegree
 */
var ProfessionalDoctorate = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    DoctoralDegree.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "ProfessionalDoctorate";
};
ProfessionalDoctorate = stjs.extend(ProfessionalDoctorate, DoctoralDegree, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  credentialengine.org/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  credentialengine.org/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  credentialengine.org/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  credentialengine.org/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  credentialengine.org/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  credentialengine.org/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  credentialengine.org/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  credentialengine.org/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  credentialengine.org/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  credentialengine.org/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  credentialengine.org/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  credentialengine.org/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  credentialengine.org/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson
     */
    prototype.copyrightHolder = null;
    /**
     *  credentialengine.org/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  credentialengine.org/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  credentialengine.org/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  credentialengine.org/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type dateTime
     */
    prototype.dateEffective = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  credentialengine.org/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  credentialengine.org/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  credentialengine.org/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  credentialengine.org/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  credentialengine.org/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  credentialengine.org/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  credentialengine.org/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  credentialengine.org/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type Image
     */
    prototype.image = null;
    /**
     *  credentialengine.org/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  credentialengine.org/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  credentialengine.org/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  credentialengine.org/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  credentialengine.org/isRecommendedFor
     *  The resources being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  credentialengine.org/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  credentialengine.org/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  credentialengine.org/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  credentialengine.org/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  credentialengine.org/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  credentialengine.org/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  credentialengine.org/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  credentialengine.org/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  credentialengine.org/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  credentialengine.org/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  credentialengine.org/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  credentialengine.org/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  credentialengine.org/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  credentialengine.org/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  credentialengine.org/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  credentialengine.org/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  credentialengine.org/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  credentialengine.org/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  credentialengine.org/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  credentialengine.org/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  credentialengine.org/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  credentialengine.org/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  credentialengine.org/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  credentialengine.org/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  credentialengine.org/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  credentialengine.org/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  credentialengine.org/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  credentialengine.org/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  credentialengine.org/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  credentialengine.org/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  credentialengine.org/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  credentialengine.org/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject | Literal
     */
    prototype.subject = null;
    /**
     *  credentialengine.org/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  credentialengine.org/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  credentialengine.org/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", degreeConcentration: "CredentialAlignmentObject", degreeMajor: "CredentialAlignmentObject", degreeMinor: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", degreeConcentration: "CredentialAlignmentObject", degreeMajor: "CredentialAlignmentObject", degreeMinor: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/ResearchDoctorate
 *  A doctoral degree conferred for advanced work beyond the master level, including the preparation and defense of a thesis or dissertation based on original research, or the planning and execution of an original project demonstrating substantial artistic or scholarly achievement.
 *  @author credentialengine.org
 *  @class ResearchDoctorate
 *  @module org.credentialengine
 *  @extends DoctoralDegree
 */
var ResearchDoctorate = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    DoctoralDegree.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "ResearchDoctorate";
};
ResearchDoctorate = stjs.extend(ResearchDoctorate, DoctoralDegree, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  credentialengine.org/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  credentialengine.org/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  credentialengine.org/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  credentialengine.org/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  credentialengine.org/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  credentialengine.org/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  credentialengine.org/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  credentialengine.org/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  credentialengine.org/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  credentialengine.org/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  credentialengine.org/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  credentialengine.org/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  credentialengine.org/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson
     */
    prototype.copyrightHolder = null;
    /**
     *  credentialengine.org/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  credentialengine.org/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  credentialengine.org/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  credentialengine.org/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type dateTime
     */
    prototype.dateEffective = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  credentialengine.org/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  credentialengine.org/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  credentialengine.org/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  credentialengine.org/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  credentialengine.org/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  credentialengine.org/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  credentialengine.org/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  credentialengine.org/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type Image
     */
    prototype.image = null;
    /**
     *  credentialengine.org/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  credentialengine.org/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  credentialengine.org/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  credentialengine.org/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  credentialengine.org/isRecommendedFor
     *  The resources being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  credentialengine.org/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  credentialengine.org/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  credentialengine.org/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  credentialengine.org/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  credentialengine.org/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  credentialengine.org/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  credentialengine.org/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  credentialengine.org/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  credentialengine.org/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  credentialengine.org/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  credentialengine.org/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  credentialengine.org/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  credentialengine.org/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  credentialengine.org/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  credentialengine.org/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  credentialengine.org/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  credentialengine.org/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  credentialengine.org/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  credentialengine.org/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  credentialengine.org/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  credentialengine.org/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  credentialengine.org/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  credentialengine.org/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  credentialengine.org/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  credentialengine.org/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  credentialengine.org/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  credentialengine.org/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  credentialengine.org/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  credentialengine.org/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  credentialengine.org/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  credentialengine.org/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  credentialengine.org/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject | Literal
     */
    prototype.subject = null;
    /**
     *  credentialengine.org/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  credentialengine.org/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  credentialengine.org/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", degreeConcentration: "CredentialAlignmentObject", degreeMajor: "CredentialAlignmentObject", degreeMinor: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", degreeConcentration: "CredentialAlignmentObject", degreeMajor: "CredentialAlignmentObject", degreeMinor: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/JourneymanCertificate
 *  A credential awarded to skilled workers on successful completion of an apprenticeship in industry trades and professions.
 *  @author credentialengine.org
 *  @class JourneymanCertificate
 *  @module org.credentialengine
 *  @extends ApprenticeshipCertificate
 */
var JourneymanCertificate = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    ApprenticeshipCertificate.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "JourneymanCertificate";
};
JourneymanCertificate = stjs.extend(JourneymanCertificate, ApprenticeshipCertificate, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  credentialengine.org/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  credentialengine.org/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  credentialengine.org/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  credentialengine.org/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  credentialengine.org/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  credentialengine.org/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  credentialengine.org/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  credentialengine.org/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  credentialengine.org/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  credentialengine.org/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  credentialengine.org/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  credentialengine.org/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  credentialengine.org/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson
     */
    prototype.copyrightHolder = null;
    /**
     *  credentialengine.org/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  credentialengine.org/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  credentialengine.org/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  credentialengine.org/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type dateTime
     */
    prototype.dateEffective = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  credentialengine.org/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  credentialengine.org/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  credentialengine.org/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  credentialengine.org/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  credentialengine.org/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  credentialengine.org/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  credentialengine.org/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  credentialengine.org/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type Image
     */
    prototype.image = null;
    /**
     *  credentialengine.org/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  credentialengine.org/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  credentialengine.org/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  credentialengine.org/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  credentialengine.org/isRecommendedFor
     *  The resources being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  credentialengine.org/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  credentialengine.org/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  credentialengine.org/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  credentialengine.org/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  credentialengine.org/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  credentialengine.org/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  credentialengine.org/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  credentialengine.org/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  credentialengine.org/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  credentialengine.org/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  credentialengine.org/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  credentialengine.org/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  credentialengine.org/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  credentialengine.org/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  credentialengine.org/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  credentialengine.org/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  credentialengine.org/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  credentialengine.org/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  credentialengine.org/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  credentialengine.org/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  credentialengine.org/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  credentialengine.org/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  credentialengine.org/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  credentialengine.org/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  credentialengine.org/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  credentialengine.org/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  credentialengine.org/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  credentialengine.org/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  credentialengine.org/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  credentialengine.org/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  credentialengine.org/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  credentialengine.org/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject | Literal
     */
    prototype.subject = null;
    /**
     *  credentialengine.org/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  credentialengine.org/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  credentialengine.org/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/MasterCertificate
 *  A credential awarded upon demonstration through apprenticeship of the highest level of skills and performance in industry trades and professions.
 *  @author credentialengine.org
 *  @class MasterCertificate
 *  @module org.credentialengine
 *  @extends ApprenticeshipCertificate
 */
var MasterCertificate = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    ApprenticeshipCertificate.call(this);
    this.context = "http://purl.org/ctdl/terms/";
    this.type = "MasterCertificate";
};
MasterCertificate = stjs.extend(MasterCertificate, ApprenticeshipCertificate, [], function(constructor, prototype) {
    /**
     *  credentialengine.org/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  credentialengine.org/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  credentialengine.org/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  credentialengine.org/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  credentialengine.org/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  credentialengine.org/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  credentialengine.org/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  credentialengine.org/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  credentialengine.org/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  credentialengine.org/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  credentialengine.org/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  credentialengine.org/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  credentialengine.org/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  credentialengine.org/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson
     */
    prototype.copyrightHolder = null;
    /**
     *  credentialengine.org/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  credentialengine.org/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  credentialengine.org/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  credentialengine.org/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type dateTime
     */
    prototype.dateEffective = null;
    /**
     *  credentialengine.org/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  credentialengine.org/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  credentialengine.org/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  credentialengine.org/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  credentialengine.org/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  credentialengine.org/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  credentialengine.org/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  credentialengine.org/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  credentialengine.org/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  credentialengine.org/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type Image
     */
    prototype.image = null;
    /**
     *  credentialengine.org/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  credentialengine.org/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  credentialengine.org/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  credentialengine.org/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  credentialengine.org/isRecommendedFor
     *  The resources being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  credentialengine.org/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  credentialengine.org/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  credentialengine.org/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  credentialengine.org/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  credentialengine.org/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  credentialengine.org/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  credentialengine.org/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  credentialengine.org/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  credentialengine.org/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  credentialengine.org/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  credentialengine.org/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  credentialengine.org/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  credentialengine.org/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  credentialengine.org/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  credentialengine.org/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  credentialengine.org/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  credentialengine.org/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  credentialengine.org/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  credentialengine.org/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  credentialengine.org/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  credentialengine.org/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  credentialengine.org/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  credentialengine.org/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  credentialengine.org/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  credentialengine.org/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  credentialengine.org/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  credentialengine.org/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  credentialengine.org/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  credentialengine.org/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  credentialengine.org/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  credentialengine.org/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  credentialengine.org/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  credentialengine.org/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  credentialengine.org/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject | Literal
     */
    prototype.subject = null;
    /**
     *  credentialengine.org/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  credentialengine.org/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  credentialengine.org/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", copyrightHolder: "Object", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", hasPart: "Object", holders: "HoldersProfile", image: "ImageObject", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "Object", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
