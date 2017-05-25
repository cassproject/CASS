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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "CredentialingAction";
};
CredentialingAction = stjs.extend(CredentialingAction, Action, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/actingAgent
     *  The direct performer or driver (animate or inanimate) of an action.
     *  @property actingAgent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.actingAgent = null;
    /**
     *  http://purl.org/ctdl/terms/actionStatusType
     *  Indicates the current disposition of the action.
     *  @property actionStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.actionStatusType = null;
    /**
     *  http://purl.org/ctdl/terms/agent
     *  The direct performer or driver of the action (animate or inanimate).
     *  @property agent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.agent = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/endDate
     *  The end date of something.
     *  @property endDate
     *  @type date
     */
    prototype.endDate = null;
    /**
     *  http://purl.org/ctdl/terms/evidenceOfAction
     *  A resource that provides evidence of the continuing validity of the action being described.
     *  @property evidenceOfAction
     *  @type anyURI
     */
    prototype.evidenceOfAction = null;
    /**
     *  http://purl.org/ctdl/terms/instrument
     *  The object that helped the agent perform the action. e.g. John wrote a book with a pen.
     *  @property instrument
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.instrument = null;
    /**
     *  http://purl.org/ctdl/terms/object
     *  The object upon [which] the action is carried out, whose state is kept intact or changed.
     *  @property object
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Competency | CompetencyFramework | Credential | CredentialOrganization | CredentialPerson | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QACredentialOrganization | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.object = null;
    /**
     *  http://purl.org/ctdl/terms/participant
     *  Other co-agents that participated in the action indirectly.
     *  @property participant
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.participant = null;
    /**
     *  http://purl.org/ctdl/terms/resultingAward
     *  The result produced in the action.
     *  @property resultingAward
     *  @type CredentialAssertion
     */
    prototype.resultingAward = null;
    /**
     *  http://purl.org/ctdl/terms/startDate
     *  The start date of something.
     *  @property startDate
     *  @type date
     */
    prototype.startDate = null;
}, {actingAgent: "Object", actionStatusType: "CredentialAlignmentObject", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", target: "EntryPoint", participant: "Object", instrument: "Thing", agent: "Object", object: "Thing", actionStatus: "ActionStatusType", result: "Thing", location: "Object", error: "Thing", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "CredentialAlignmentObject";
};
CredentialAlignmentObject = stjs.extend(CredentialAlignmentObject, AlignmentObject, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/alignmentDate
     *  The date  the alignment was made.
     *  @property alignmentDate
     *  @type date
     */
    prototype.alignmentDate = null;
    /**
     *  http://purl.org/ctdl/terms/alignmentType
     *  A category of alignment between the learning resource and the framework node.
     *  @property alignmentType
     *  @type Literal
     */
    prototype.alignmentType = null;
    /**
     *  http://purl.org/ctdl/terms/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  http://purl.org/ctdl/terms/framework
     *  The framework to which the resource being described is aligned.
     *  @property framework
     *  @type anyURI
     */
    prototype.framework = null;
    /**
     *  http://purl.org/ctdl/terms/frameworkName
     *  The name of the framework to which the resource being described is aligned.
     *  @property frameworkName
     *  @type Literal
     */
    prototype.frameworkName = null;
    /**
     *  http://purl.org/ctdl/terms/targetNode
     *  The node of a framework targeted by the alignment.
     *  @property targetNode
     *  @type anyURI
     */
    prototype.targetNode = null;
    /**
     *  http://purl.org/ctdl/terms/targetNodeDescription
     *  The description of a node in an established educational framework.
     *  @property targetNodeDescription
     *  @type Literal
     */
    prototype.targetNodeDescription = null;
    /**
     *  http://purl.org/ctdl/terms/targetNodeName
     *  The name of a node in an established educational framework.
     *  @property targetNodeName
     *  @type Literal
     */
    prototype.targetNodeName = null;
    /**
     *  http://purl.org/ctdl/terms/weight
     *  An asserted measurement of the weight, degree, percent, or strength of a recommendation, requirement, or comparison.
     *  @property weight
     *  @type float
     */
    prototype.weight = null;
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "EarningsProfile";
};
EarningsProfile = stjs.extend(EarningsProfile, CreativeWork, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/credentialProfiled
     *  The resource being described is a profile of the credential being referenced.
     *  @property credentialProfiled
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.credentialProfiled = null;
    /**
     *  http://purl.org/ctdl/terms/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type date
     */
    prototype.dateEffective = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  http://purl.org/ctdl/terms/source
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "AssessmentProfile";
};
AssessmentProfile = stjs.extend(AssessmentProfile, CreativeWork, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  http://purl.org/ctdl/terms/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  http://purl.org/ctdl/terms/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  http://purl.org/ctdl/terms/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  http://purl.org/ctdl/terms/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  http://purl.org/ctdl/terms/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  http://purl.org/ctdl/terms/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  http://purl.org/ctdl/terms/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  http://purl.org/ctdl/terms/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  http://purl.org/ctdl/terms/commonConditions
     *  The resource being referenced describes a set of common conditions applicable to the resource being described.
     *  @property commonConditions
     *  @type ConditionManifest
     */
    prototype.commonConditions = null;
    /**
     *  http://purl.org/ctdl/terms/corequisite
     *  The resource being referenced must be pursued concurrently with the resource being described.
     *  @property corequisite
     *  @type ConditionProfile
     */
    prototype.corequisite = null;
    /**
     *  http://purl.org/ctdl/terms/creditHourType
     *  Units of time corresponding to types of credits.
     *  @property creditHourType
     *  @type Literal
     */
    prototype.creditHourType = null;
    /**
     *  http://purl.org/ctdl/terms/creditHourValue
     *  The number of credit hours awarded for completing or attaining the resource being described.
     *  @property creditHourValue
     *  @type float
     */
    prototype.creditHourValue = null;
    /**
     *  http://purl.org/ctdl/terms/creditUnitType
     *  The type of credit associated with degree and non-degree learning opportunities.
     *  @property creditUnitType
     *  @type CredentialAlignmentObject
     */
    prototype.creditUnitType = null;
    /**
     *  http://purl.org/ctdl/terms/creditUnitTypeDescription
     *  A more refined, detailed description of credit unit type.
     *  @property creditUnitTypeDescription
     *  @type Literal
     */
    prototype.creditUnitTypeDescription = null;
    /**
     *  http://purl.org/ctdl/terms/creditUnitValue
     *  The number of either credit units awarded for college credit or continuing education units for completing or attaining the resource being described.
     *  @property creditUnitValue
     *  @type float
     */
    prototype.creditUnitValue = null;
    /**
     *  http://purl.org/ctdl/terms/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type date
     */
    prototype.dateEffective = null;
    /**
     *  http://purl.org/ctdl/terms/deliveryType
     *  The means by which the resource being described is delivered to people or interacted with by people.
     *  @property deliveryType
     *  @type CredentialAlignmentObject
     */
    prototype.deliveryType = null;
    /**
     *  http://purl.org/ctdl/terms/deliveryTypeDescription
     *  A more detailed, refined description of delivery type.
     *  @property deliveryTypeDescription
     *  @type Literal
     */
    prototype.deliveryTypeDescription = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  http://purl.org/ctdl/terms/entryCondition
     *  The prerequisites for entry into the resource being described.
     *  @property entryCondition
     *  @type ConditionProfile
     */
    prototype.entryCondition = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  http://purl.org/ctdl/terms/financialAssistance
     *  The types of financial assistance for which the resource being described qualifies.
     *  @property financialAssistance
     *  @type FinancialAlignmentObject
     */
    prototype.financialAssistance = null;
    /**
     *  http://purl.org/ctdl/terms/inLanguage
     *  The primary language used in or by the resource being described.
     *  @property inLanguage
     *  @type language
     */
    prototype.inLanguage = null;
    /**
     *  http://purl.org/ctdl/terms/instructionalProgramType
     *  The class identifier for instructional program context.
     *  @property instructionalProgramType
     *  @type CredentialAlignmentObject
     */
    prototype.instructionalProgramType = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  http://purl.org/ctdl/terms/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  http://purl.org/ctdl/terms/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  http://purl.org/ctdl/terms/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  http://purl.org/ctdl/terms/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  http://purl.org/ctdl/terms/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  http://purl.org/ctdl/terms/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  http://purl.org/ctdl/terms/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  http://purl.org/ctdl/terms/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  http://purl.org/ctdl/terms/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  http://purl.org/ctdl/terms/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  http://purl.org/ctdl/terms/scoringMethodDescription
     *  The method used to score the assessment.
     *  @property scoringMethodDescription
     *  @type Literal
     */
    prototype.scoringMethodDescription = null;
    /**
     *  http://purl.org/ctdl/terms/scoringMethodExample
     *  A resource that is an example of the method or tool used to score the assessment.
     *  @property scoringMethodExample
     *  @type anyURI
     */
    prototype.scoringMethodExample = null;
    /**
     *  http://purl.org/ctdl/terms/scoringMethodExampleDescription
     *  The text of an example of the method or tool used to score the assessment.
     *  @property scoringMethodExampleDescription
     *  @type Literal
     */
    prototype.scoringMethodExampleDescription = null;
    /**
     *  http://purl.org/ctdl/terms/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject
     */
    prototype.subject = null;
    /**
     *  http://purl.org/ctdl/terms/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  http://purl.org/ctdl/terms/targetAssessment
     *  A resource that provides direct, indirect, formative or summative evaluation or estimation of the nature, ability, or quality for the resource being described.
     *  @property targetAssessment
     *  @type Assessment | AssessmentProfile
     */
    prototype.targetAssessment = null;
    /**
     *  http://purl.org/ctdl/terms/targetCompetency
     *  An alignment to a competency assertion in an established framework.
     *  @property targetCompetency
     *  @type Competency | CredentialAlignmentObject
     */
    prototype.targetCompetency = null;
    /**
     *  http://purl.org/ctdl/terms/verificationMethodDescription
     *  Description of the methods used to evaluate the resource validity and reliability.
     *  @property verificationMethodDescription
     *  @type Literal
     */
    prototype.verificationMethodDescription = null;
    /**
     *  http://purl.org/ctdl/terms/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", approvedBy: "Object", approvedIn: "JurisdictionProfile", availableAt: "GeoCoordinates", commonConditions: "ConditionManifest", corequisite: "ConditionProfile", creditUnitType: "CredentialAlignmentObject", deliveryType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", entryCondition: "ConditionProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", financialAssistance: "FinancialAlignmentObject", instructionalProgramType: "CredentialAlignmentObject", jurisdiction: "JurisdictionProfile", maintenanceProcess: "ProcessProfile", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", requires: "Object", subject: "CredentialAlignmentObject", targetAssessment: "Object", targetCompetency: "Object", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "ProcessProfile";
};
ProcessProfile = stjs.extend(ProcessProfile, CreativeWork, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type date
     */
    prototype.dateEffective = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  http://purl.org/ctdl/terms/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  http://purl.org/ctdl/terms/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  http://purl.org/ctdl/terms/scoringMethodDescription
     *  The method used to score the assessment.
     *  @property scoringMethodDescription
     *  @type Literal
     */
    prototype.scoringMethodDescription = null;
    /**
     *  http://purl.org/ctdl/terms/scoringMethodExample
     *  A resource that is an example of the method or tool used to score the assessment.
     *  @property scoringMethodExample
     *  @type anyURI
     */
    prototype.scoringMethodExample = null;
    /**
     *  http://purl.org/ctdl/terms/scoringMethodExampleDescription
     *  The text of an example of the method or tool used to score the assessment.
     *  @property scoringMethodExampleDescription
     *  @type Literal
     */
    prototype.scoringMethodExampleDescription = null;
    /**
     *  http://purl.org/ctdl/terms/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  http://purl.org/ctdl/terms/targetAssessment
     *  A resource that provides direct, indirect, formative or summative evaluation or estimation of the nature, ability, or quality for the resource being described.
     *  @property targetAssessment
     *  @type Assessment | AssessmentProfile
     */
    prototype.targetAssessment = null;
    /**
     *  http://purl.org/ctdl/terms/targetCredential
     *  A credential that is a focus or target of the resource being described.
     *  @property targetCredential
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.targetCredential = null;
    /**
     *  http://purl.org/ctdl/terms/targetLearningOpportunity
     *  A learning opportunity that is the focus of the resource being described.
     *  @property targetLearningOpportunity
     *  @type LearningOpportunity | LearningOpportunityProfile
     */
    prototype.targetLearningOpportunity = null;
    /**
     *  http://purl.org/ctdl/terms/verificationMethodDescription
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "JurisdictionProfile";
};
JurisdictionProfile = stjs.extend(JurisdictionProfile, CreativeWork, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/assertedBy
     *  The agent providing the information contained in the entity being described.
     *  @property assertedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.assertedBy = null;
    /**
     *  http://purl.org/ctdl/terms/description
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "RevocationProfile";
};
RevocationProfile = stjs.extend(RevocationProfile, CreativeWork, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/credentialProfiled
     *  The resource being described is a profile of the credential being referenced.
     *  @property credentialProfiled
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.credentialProfiled = null;
    /**
     *  http://purl.org/ctdl/terms/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type date
     */
    prototype.dateEffective = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/region
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "Credential";
};
Credential = stjs.extend(Credential, CreativeWork, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  http://purl.org/ctdl/terms/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  http://purl.org/ctdl/terms/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  http://purl.org/ctdl/terms/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  http://purl.org/ctdl/terms/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  http://purl.org/ctdl/terms/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  http://purl.org/ctdl/terms/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  http://purl.org/ctdl/terms/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  http://purl.org/ctdl/terms/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  http://purl.org/ctdl/terms/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  http://purl.org/ctdl/terms/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  http://purl.org/ctdl/terms/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  http://purl.org/ctdl/terms/commonConditions
     *  The resource being referenced describes a set of common conditions applicable to the resource being described.
     *  @property commonConditions
     *  @type ConditionManifest
     */
    prototype.commonConditions = null;
    /**
     *  http://purl.org/ctdl/terms/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.copyrightHolder = null;
    /**
     *  http://purl.org/ctdl/terms/corequisite
     *  The resource being referenced must be pursued concurrently with the resource being described.
     *  @property corequisite
     *  @type ConditionProfile
     */
    prototype.corequisite = null;
    /**
     *  http://purl.org/ctdl/terms/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  http://purl.org/ctdl/terms/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  http://purl.org/ctdl/terms/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  http://purl.org/ctdl/terms/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type date
     */
    prototype.dateEffective = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  http://purl.org/ctdl/terms/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  http://purl.org/ctdl/terms/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  http://purl.org/ctdl/terms/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/financialAssistance
     *  The types of financial assistance for which the resource being described qualifies.
     *  @property financialAssistance
     *  @type FinancialAlignmentObject
     */
    prototype.financialAssistance = null;
    /**
     *  http://purl.org/ctdl/terms/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  http://purl.org/ctdl/terms/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  http://purl.org/ctdl/terms/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type anyURI
     */
    prototype.image = null;
    /**
     *  http://purl.org/ctdl/terms/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  http://purl.org/ctdl/terms/inLanguage
     *  The primary language used in or by the resource being described.
     *  @property inLanguage
     *  @type language
     */
    prototype.inLanguage = null;
    /**
     *  http://purl.org/ctdl/terms/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  http://purl.org/ctdl/terms/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  http://purl.org/ctdl/terms/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRecommendedFor
     *  The resource being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  http://purl.org/ctdl/terms/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  http://purl.org/ctdl/terms/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  http://purl.org/ctdl/terms/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  http://purl.org/ctdl/terms/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  http://purl.org/ctdl/terms/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  http://purl.org/ctdl/terms/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  http://purl.org/ctdl/terms/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  http://purl.org/ctdl/terms/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  http://purl.org/ctdl/terms/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  http://purl.org/ctdl/terms/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  http://purl.org/ctdl/terms/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  http://purl.org/ctdl/terms/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  http://purl.org/ctdl/terms/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  http://purl.org/ctdl/terms/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  http://purl.org/ctdl/terms/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  http://purl.org/ctdl/terms/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  http://purl.org/ctdl/terms/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  http://purl.org/ctdl/terms/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  http://purl.org/ctdl/terms/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  http://purl.org/ctdl/terms/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  http://purl.org/ctdl/terms/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  http://purl.org/ctdl/terms/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  http://purl.org/ctdl/terms/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  http://purl.org/ctdl/terms/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject
     */
    prototype.subject = null;
    /**
     *  http://purl.org/ctdl/terms/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  http://purl.org/ctdl/terms/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  http://purl.org/ctdl/terms/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "TaskProfile";
};
TaskProfile = stjs.extend(TaskProfile, CreativeWork, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  http://purl.org/ctdl/terms/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  http://purl.org/ctdl/terms/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  http://purl.org/ctdl/terms/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type date
     */
    prototype.dateEffective = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/name
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "CostProfile";
};
CostProfile = stjs.extend(CostProfile, CreativeWork, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/audienceType
     *  The applicable audience.
     *  @property audienceType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceType = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/endDate
     *  The end date of something.
     *  @property endDate
     *  @type date
     */
    prototype.endDate = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  http://purl.org/ctdl/terms/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  http://purl.org/ctdl/terms/startDate
     *  The start date of something.
     *  @property startDate
     *  @type date
     */
    prototype.startDate = null;
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "LearningOpportunityProfile";
};
LearningOpportunityProfile = stjs.extend(LearningOpportunityProfile, CreativeWork, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  http://purl.org/ctdl/terms/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  http://purl.org/ctdl/terms/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  http://purl.org/ctdl/terms/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  http://purl.org/ctdl/terms/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  http://purl.org/ctdl/terms/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  http://purl.org/ctdl/terms/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  http://purl.org/ctdl/terms/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  http://purl.org/ctdl/terms/commonConditions
     *  The resource being referenced describes a set of common conditions applicable to the resource being described.
     *  @property commonConditions
     *  @type ConditionManifest
     */
    prototype.commonConditions = null;
    /**
     *  http://purl.org/ctdl/terms/corequisite
     *  The resource being referenced must be pursued concurrently with the resource being described.
     *  @property corequisite
     *  @type ConditionProfile
     */
    prototype.corequisite = null;
    /**
     *  http://purl.org/ctdl/terms/creditHourType
     *  Units of time corresponding to types of credits.
     *  @property creditHourType
     *  @type Literal
     */
    prototype.creditHourType = null;
    /**
     *  http://purl.org/ctdl/terms/creditHourValue
     *  The number of credit hours awarded for completing or attaining the resource being described.
     *  @property creditHourValue
     *  @type float
     */
    prototype.creditHourValue = null;
    /**
     *  http://purl.org/ctdl/terms/creditUnitType
     *  The type of credit associated with degree and non-degree learning opportunities.
     *  @property creditUnitType
     *  @type CredentialAlignmentObject
     */
    prototype.creditUnitType = null;
    /**
     *  http://purl.org/ctdl/terms/creditUnitTypeDescription
     *  A more refined, detailed description of credit unit type.
     *  @property creditUnitTypeDescription
     *  @type Literal
     */
    prototype.creditUnitTypeDescription = null;
    /**
     *  http://purl.org/ctdl/terms/creditUnitValue
     *  The number of either credit units awarded for college credit or continuing education units for completing or attaining the resource being described.
     *  @property creditUnitValue
     *  @type float
     */
    prototype.creditUnitValue = null;
    /**
     *  http://purl.org/ctdl/terms/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type date
     */
    prototype.dateEffective = null;
    /**
     *  http://purl.org/ctdl/terms/deliveryType
     *  The means by which the resource being described is delivered to people or interacted with by people.
     *  @property deliveryType
     *  @type CredentialAlignmentObject
     */
    prototype.deliveryType = null;
    /**
     *  http://purl.org/ctdl/terms/deliveryTypeDescription
     *  A more detailed, refined description of delivery type.
     *  @property deliveryTypeDescription
     *  @type Literal
     */
    prototype.deliveryTypeDescription = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/entryCondition
     *  The prerequisites for entry into the resource being described.
     *  @property entryCondition
     *  @type ConditionProfile
     */
    prototype.entryCondition = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  http://purl.org/ctdl/terms/financialAssistance
     *  The types of financial assistance for which the resource being described qualifies.
     *  @property financialAssistance
     *  @type FinancialAlignmentObject
     */
    prototype.financialAssistance = null;
    /**
     *  http://purl.org/ctdl/terms/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  http://purl.org/ctdl/terms/inLanguage
     *  The primary language used in or by the resource being described.
     *  @property inLanguage
     *  @type language
     */
    prototype.inLanguage = null;
    /**
     *  http://purl.org/ctdl/terms/instructionalProgramType
     *  The class identifier for instructional program context.
     *  @property instructionalProgramType
     *  @type CredentialAlignmentObject
     */
    prototype.instructionalProgramType = null;
    /**
     *  http://purl.org/ctdl/terms/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  http://purl.org/ctdl/terms/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  http://purl.org/ctdl/terms/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  http://purl.org/ctdl/terms/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  http://purl.org/ctdl/terms/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  http://purl.org/ctdl/terms/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  http://purl.org/ctdl/terms/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  http://purl.org/ctdl/terms/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  http://purl.org/ctdl/terms/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject
     */
    prototype.subject = null;
    /**
     *  http://purl.org/ctdl/terms/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  http://purl.org/ctdl/terms/targetAssessment
     *  A resource that provides direct, indirect, formative or summative evaluation or estimation of the nature, ability, or quality for the resource being described.
     *  @property targetAssessment
     *  @type Assessment | AssessmentProfile
     */
    prototype.targetAssessment = null;
    /**
     *  http://purl.org/ctdl/terms/targetCompetency
     *  An alignment to a competency assertion in an established framework.
     *  @property targetCompetency
     *  @type Competency | CredentialAlignmentObject
     */
    prototype.targetCompetency = null;
    /**
     *  http://purl.org/ctdl/terms/targetLearningOpportunity
     *  A learning opportunity that is the focus of the resource being described.
     *  @property targetLearningOpportunity
     *  @type LearningOpportunity | LearningOpportunityProfile
     */
    prototype.targetLearningOpportunity = null;
    /**
     *  http://purl.org/ctdl/terms/verificationMethodDescription
     *  Description of the methods used to evaluate the resource validity and reliability.
     *  @property verificationMethodDescription
     *  @type Literal
     */
    prototype.verificationMethodDescription = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", approvedBy: "Object", approvedIn: "JurisdictionProfile", availableAt: "GeoCoordinates", commonConditions: "ConditionManifest", corequisite: "ConditionProfile", creditUnitType: "CredentialAlignmentObject", deliveryType: "CredentialAlignmentObject", entryCondition: "ConditionProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", instructionalProgramType: "CredentialAlignmentObject", isPartOf: "Object", jurisdiction: "JurisdictionProfile", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", requires: "Object", subject: "CredentialAlignmentObject", targetAssessment: "Object", targetCompetency: "Object", targetLearningOpportunity: "Object", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "ConditionProfile";
};
ConditionProfile = stjs.extend(ConditionProfile, CreativeWork, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/assertedBy
     *  The agent providing the information contained in the entity being described.
     *  @property assertedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.assertedBy = null;
    /**
     *  http://purl.org/ctdl/terms/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  http://purl.org/ctdl/terms/audienceType
     *  The applicable audience.
     *  @property audienceType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceType = null;
    /**
     *  http://purl.org/ctdl/terms/credentialProfiled
     *  The resource being described is a profile of the credential being referenced.
     *  @property credentialProfiled
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.credentialProfiled = null;
    /**
     *  http://purl.org/ctdl/terms/creditHourType
     *  Units of time corresponding to types of credits.
     *  @property creditHourType
     *  @type Literal
     */
    prototype.creditHourType = null;
    /**
     *  http://purl.org/ctdl/terms/creditHourValue
     *  The number of credit hours awarded for completing or attaining the resource being described.
     *  @property creditHourValue
     *  @type float
     */
    prototype.creditHourValue = null;
    /**
     *  http://purl.org/ctdl/terms/creditUnitType
     *  The type of credit associated with degree and non-degree learning opportunities.
     *  @property creditUnitType
     *  @type CredentialAlignmentObject
     */
    prototype.creditUnitType = null;
    /**
     *  http://purl.org/ctdl/terms/creditUnitTypeDescription
     *  A more refined, detailed description of credit unit type.
     *  @property creditUnitTypeDescription
     *  @type Literal
     */
    prototype.creditUnitTypeDescription = null;
    /**
     *  http://purl.org/ctdl/terms/creditUnitValue
     *  The number of either credit units awarded for college credit or continuing education units for completing or attaining the resource being described.
     *  @property creditUnitValue
     *  @type float
     */
    prototype.creditUnitValue = null;
    /**
     *  http://purl.org/ctdl/terms/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type date
     */
    prototype.dateEffective = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  http://purl.org/ctdl/terms/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  http://purl.org/ctdl/terms/targetAssessment
     *  A resource that provides direct, indirect, formative or summative evaluation or estimation of the nature, ability, or quality for the resource being described.
     *  @property targetAssessment
     *  @type Assessment | AssessmentProfile
     */
    prototype.targetAssessment = null;
    /**
     *  http://purl.org/ctdl/terms/targetCompetency
     *  An alignment to a competency assertion in an established framework.
     *  @property targetCompetency
     *  @type Competency | CredentialAlignmentObject
     */
    prototype.targetCompetency = null;
    /**
     *  http://purl.org/ctdl/terms/targetCredential
     *  A credential that is a focus or target of the resource being described.
     *  @property targetCredential
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.targetCredential = null;
    /**
     *  http://purl.org/ctdl/terms/targetLearningOpportunity
     *  A learning opportunity that is the focus of the resource being described.
     *  @property targetLearningOpportunity
     *  @type LearningOpportunity | LearningOpportunityProfile
     */
    prototype.targetLearningOpportunity = null;
    /**
     *  http://purl.org/ctdl/terms/weight
     *  An asserted measurement of the weight, degree, percent, or strength of a recommendation, requirement, or comparison.
     *  @property weight
     *  @type float
     */
    prototype.weight = null;
}, {assertedBy: "Object", audienceLevelType: "CredentialAlignmentObject", audienceType: "CredentialAlignmentObject", credentialProfiled: "Object", creditUnitType: "CredentialAlignmentObject", estimatedCost: "CostProfile", jurisdiction: "JurisdictionProfile", targetAssessment: "Object", targetCompetency: "Object", targetCredential: "Object", targetLearningOpportunity: "Object", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "HoldersProfile";
};
HoldersProfile = stjs.extend(HoldersProfile, CreativeWork, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/credentialProfiled
     *  The resource being described is a profile of the credential being referenced.
     *  @property credentialProfiled
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.credentialProfiled = null;
    /**
     *  http://purl.org/ctdl/terms/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type date
     */
    prototype.dateEffective = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  http://purl.org/ctdl/terms/source
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "EmploymentOutcomeProfile";
};
EmploymentOutcomeProfile = stjs.extend(EmploymentOutcomeProfile, CreativeWork, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/credentialProfiled
     *  The resource being described is a profile of the credential being referenced.
     *  @property credentialProfiled
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.credentialProfiled = null;
    /**
     *  http://purl.org/ctdl/terms/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type date
     */
    prototype.dateEffective = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/source
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
    EcRemoteLinkedData.call(this, "http://schema.eduworks.com/simpleCtdl", "CredentialFramework");
};
CredentialFramework = stjs.extend(CredentialFramework, EcRemoteLinkedData, [], null, {owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/ConditionManifest
 *  A set of conditions maintained at the organizational and/or sub-organizational level.
 *  @author credentialengine.org
 *  @class ConditionManifest
 *  @module org.credentialengine
 */
var ConditionManifest = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    EcRemoteLinkedData.call(this, "http://schema.eduworks.com/simpleCtdl", "ConditionManifest");
};
ConditionManifest = stjs.extend(ConditionManifest, EcRemoteLinkedData, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  http://purl.org/ctdl/terms/commonConditions
     *  The resource being referenced describes a set of common conditions applicable to the resource being described.
     *  @property commonConditions
     *  @type ConditionManifest
     */
    prototype.commonConditions = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/entryCondition
     *  The prerequisites for entry into the resource being described.
     *  @property entryCondition
     *  @type ConditionProfile
     */
    prototype.entryCondition = null;
    /**
     *  http://purl.org/ctdl/terms/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  http://purl.org/ctdl/terms/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRecommendedFor
     *  The resource being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  http://purl.org/ctdl/terms/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  http://purl.org/ctdl/terms/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  http://purl.org/ctdl/terms/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  http://purl.org/ctdl/terms/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  http://purl.org/ctdl/terms/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
}, {advancedStandingFrom: "Object", commonConditions: "ConditionManifest", entryCondition: "ConditionProfile", isAdvancedStandingFor: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", preparationFrom: "Object", recommends: "Object", requires: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    EcRemoteLinkedData.call(this, "http://schema.eduworks.com/simpleCtdl", "IdentifierValue");
};
IdentifierValue = stjs.extend(IdentifierValue, EcRemoteLinkedData, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
}, {owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    EcRemoteLinkedData.call(this, "http://schema.eduworks.com/simpleCtdl", "CareerPathway");
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
    EcRemoteLinkedData.call(this, "http://schema.eduworks.com/simpleCtdl", "DurationProfile");
};
DurationProfile = stjs.extend(DurationProfile, EcRemoteLinkedData, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/maximumDuration
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
    EcRemoteLinkedData.call(this, "http://schema.eduworks.com/simpleCtdl", "ContactPoint");
};
ContactPoint = stjs.extend(ContactPoint, EcRemoteLinkedData, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/email
     *  Email address of the agent being described.
     *  @property email
     *  @type Literal
     */
    prototype.email = null;
    /**
     *  http://purl.org/ctdl/terms/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  http://purl.org/ctdl/terms/socialMedia
     *  A social media resource for the resource being described.
     *  @property socialMedia
     *  @type anyURI
     */
    prototype.socialMedia = null;
}, {owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    EcRemoteLinkedData.call(this, "http://schema.eduworks.com/simpleCtdl", "LearningOpportunity");
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
    EcRemoteLinkedData.call(this, "http://schema.eduworks.com/simpleCtdl", "Assessment");
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
    EcRemoteLinkedData.call(this, "http://schema.eduworks.com/simpleCtdl", "Agent");
};
Agent = stjs.extend(Agent, EcRemoteLinkedData, [], null, {owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    EcRemoteLinkedData.call(this, "http://schema.eduworks.com/simpleCtdl", "Competency");
};
Competency = stjs.extend(Competency, EcRemoteLinkedData, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/inLanguage
     *  The primary language used in or by the resource being described.
     *  @property inLanguage
     *  @type language
     */
    prototype.inLanguage = null;
}, {owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    EcRemoteLinkedData.call(this, "http://schema.eduworks.com/simpleCtdl", "CredentialAssertion");
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "VerificationServiceProfile";
};
VerificationServiceProfile = stjs.extend(VerificationServiceProfile, Intangible, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type date
     */
    prototype.dateEffective = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  http://purl.org/ctdl/terms/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  http://purl.org/ctdl/terms/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  http://purl.org/ctdl/terms/targetCredential
     *  A credential that is a focus or target of the resource being described.
     *  @property targetCredential
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.targetCredential = null;
    /**
     *  http://purl.org/ctdl/terms/verificationMethodDescription
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "GeoCoordinates";
};
GeoCoordinates = stjs.extend(GeoCoordinates, StructuredValue, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/address
     *  Physical address of the resource.
     *  @property address
     *  @type PostalAddress
     */
    prototype.address = null;
    /**
     *  http://purl.org/ctdl/terms/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  http://purl.org/ctdl/terms/url
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "RegulateAction";
};
RegulateAction = stjs.extend(RegulateAction, CredentialingAction, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/actingAgent
     *  The direct performer or driver (animate or inanimate) of an action.
     *  @property actingAgent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.actingAgent = null;
    /**
     *  http://purl.org/ctdl/terms/actionStatusType
     *  Indicates the current disposition of the action.
     *  @property actionStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.actionStatusType = null;
    /**
     *  http://purl.org/ctdl/terms/agent
     *  The direct performer or driver of the action (animate or inanimate).
     *  @property agent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.agent = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/endDate
     *  The end date of something.
     *  @property endDate
     *  @type date
     */
    prototype.endDate = null;
    /**
     *  http://purl.org/ctdl/terms/evidenceOfAction
     *  A resource that provides evidence of the continuing validity of the action being described.
     *  @property evidenceOfAction
     *  @type anyURI
     */
    prototype.evidenceOfAction = null;
    /**
     *  http://purl.org/ctdl/terms/instrument
     *  The object that helped the agent perform the action. e.g. John wrote a book with a pen.
     *  @property instrument
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.instrument = null;
    /**
     *  http://purl.org/ctdl/terms/object
     *  The object upon [which] the action is carried out, whose state is kept intact or changed.
     *  @property object
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Competency | CompetencyFramework | Credential | CredentialOrganization | CredentialPerson | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QACredentialOrganization | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.object = null;
    /**
     *  http://purl.org/ctdl/terms/participant
     *  Other co-agents that participated in the action indirectly.
     *  @property participant
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.participant = null;
    /**
     *  http://purl.org/ctdl/terms/resultingAward
     *  The result produced in the action.
     *  @property resultingAward
     *  @type CredentialAssertion
     */
    prototype.resultingAward = null;
    /**
     *  http://purl.org/ctdl/terms/startDate
     *  The start date of something.
     *  @property startDate
     *  @type date
     */
    prototype.startDate = null;
}, {actingAgent: "Object", actionStatusType: "CredentialAlignmentObject", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", actingAgent: "Object", actionStatusType: "CredentialAlignmentObject", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", target: "EntryPoint", participant: "Object", instrument: "Thing", agent: "Object", object: "Thing", actionStatus: "ActionStatusType", result: "Thing", location: "Object", error: "Thing", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "ApproveAction";
};
ApproveAction = stjs.extend(ApproveAction, CredentialingAction, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/actingAgent
     *  The direct performer or driver (animate or inanimate) of an action.
     *  @property actingAgent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.actingAgent = null;
    /**
     *  http://purl.org/ctdl/terms/actionStatusType
     *  Indicates the current disposition of the action.
     *  @property actionStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.actionStatusType = null;
    /**
     *  http://purl.org/ctdl/terms/agent
     *  The direct performer or driver of the action (animate or inanimate).
     *  @property agent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.agent = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/endDate
     *  The end date of something.
     *  @property endDate
     *  @type date
     */
    prototype.endDate = null;
    /**
     *  http://purl.org/ctdl/terms/evidenceOfAction
     *  A resource that provides evidence of the continuing validity of the action being described.
     *  @property evidenceOfAction
     *  @type anyURI
     */
    prototype.evidenceOfAction = null;
    /**
     *  http://purl.org/ctdl/terms/instrument
     *  The object that helped the agent perform the action. e.g. John wrote a book with a pen.
     *  @property instrument
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.instrument = null;
    /**
     *  http://purl.org/ctdl/terms/object
     *  The object upon [which] the action is carried out, whose state is kept intact or changed.
     *  @property object
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Competency | CompetencyFramework | Credential | CredentialOrganization | CredentialPerson | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QACredentialOrganization | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.object = null;
    /**
     *  http://purl.org/ctdl/terms/participant
     *  Other co-agents that participated in the action indirectly.
     *  @property participant
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.participant = null;
    /**
     *  http://purl.org/ctdl/terms/resultingAward
     *  The result produced in the action.
     *  @property resultingAward
     *  @type CredentialAssertion
     */
    prototype.resultingAward = null;
    /**
     *  http://purl.org/ctdl/terms/startDate
     *  The start date of something.
     *  @property startDate
     *  @type date
     */
    prototype.startDate = null;
}, {actingAgent: "Object", actionStatusType: "CredentialAlignmentObject", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", actingAgent: "Object", actionStatusType: "CredentialAlignmentObject", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", target: "EntryPoint", participant: "Object", instrument: "Thing", agent: "Object", object: "Thing", actionStatus: "ActionStatusType", result: "Thing", location: "Object", error: "Thing", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "RenewAction";
};
RenewAction = stjs.extend(RenewAction, CredentialingAction, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/actingAgent
     *  The direct performer or driver (animate or inanimate) of an action.
     *  @property actingAgent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.actingAgent = null;
    /**
     *  http://purl.org/ctdl/terms/actionStatusType
     *  Indicates the current disposition of the action.
     *  @property actionStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.actionStatusType = null;
    /**
     *  http://purl.org/ctdl/terms/agent
     *  The direct performer or driver of the action (animate or inanimate).
     *  @property agent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.agent = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/endDate
     *  The end date of something.
     *  @property endDate
     *  @type date
     */
    prototype.endDate = null;
    /**
     *  http://purl.org/ctdl/terms/evidenceOfAction
     *  A resource that provides evidence of the continuing validity of the action being described.
     *  @property evidenceOfAction
     *  @type anyURI
     */
    prototype.evidenceOfAction = null;
    /**
     *  http://purl.org/ctdl/terms/instrument
     *  The object that helped the agent perform the action. e.g. John wrote a book with a pen.
     *  @property instrument
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.instrument = null;
    /**
     *  http://purl.org/ctdl/terms/object
     *  The object upon [which] the action is carried out, whose state is kept intact or changed.
     *  @property object
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Competency | CompetencyFramework | Credential | CredentialOrganization | CredentialPerson | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QACredentialOrganization | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.object = null;
    /**
     *  http://purl.org/ctdl/terms/participant
     *  Other co-agents that participated in the action indirectly.
     *  @property participant
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.participant = null;
    /**
     *  http://purl.org/ctdl/terms/resultingAward
     *  The result produced in the action.
     *  @property resultingAward
     *  @type CredentialAssertion
     */
    prototype.resultingAward = null;
    /**
     *  http://purl.org/ctdl/terms/startDate
     *  The start date of something.
     *  @property startDate
     *  @type date
     */
    prototype.startDate = null;
}, {actingAgent: "Object", actionStatusType: "CredentialAlignmentObject", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", actingAgent: "Object", actionStatusType: "CredentialAlignmentObject", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", target: "EntryPoint", participant: "Object", instrument: "Thing", agent: "Object", object: "Thing", actionStatus: "ActionStatusType", result: "Thing", location: "Object", error: "Thing", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "RecognizeAction";
};
RecognizeAction = stjs.extend(RecognizeAction, CredentialingAction, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/actingAgent
     *  The direct performer or driver (animate or inanimate) of an action.
     *  @property actingAgent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.actingAgent = null;
    /**
     *  http://purl.org/ctdl/terms/actionStatusType
     *  Indicates the current disposition of the action.
     *  @property actionStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.actionStatusType = null;
    /**
     *  http://purl.org/ctdl/terms/agent
     *  The direct performer or driver of the action (animate or inanimate).
     *  @property agent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.agent = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/endDate
     *  The end date of something.
     *  @property endDate
     *  @type date
     */
    prototype.endDate = null;
    /**
     *  http://purl.org/ctdl/terms/evidenceOfAction
     *  A resource that provides evidence of the continuing validity of the action being described.
     *  @property evidenceOfAction
     *  @type anyURI
     */
    prototype.evidenceOfAction = null;
    /**
     *  http://purl.org/ctdl/terms/instrument
     *  The object that helped the agent perform the action. e.g. John wrote a book with a pen.
     *  @property instrument
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.instrument = null;
    /**
     *  http://purl.org/ctdl/terms/object
     *  The object upon [which] the action is carried out, whose state is kept intact or changed.
     *  @property object
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Competency | CompetencyFramework | Credential | CredentialOrganization | CredentialPerson | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QACredentialOrganization | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.object = null;
    /**
     *  http://purl.org/ctdl/terms/participant
     *  Other co-agents that participated in the action indirectly.
     *  @property participant
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.participant = null;
    /**
     *  http://purl.org/ctdl/terms/resultingAward
     *  The result produced in the action.
     *  @property resultingAward
     *  @type CredentialAssertion
     */
    prototype.resultingAward = null;
    /**
     *  http://purl.org/ctdl/terms/startDate
     *  The start date of something.
     *  @property startDate
     *  @type date
     */
    prototype.startDate = null;
}, {actingAgent: "Object", actionStatusType: "CredentialAlignmentObject", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", actingAgent: "Object", actionStatusType: "CredentialAlignmentObject", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", target: "EntryPoint", participant: "Object", instrument: "Thing", agent: "Object", object: "Thing", actionStatus: "ActionStatusType", result: "Thing", location: "Object", error: "Thing", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "RightsAction";
};
RightsAction = stjs.extend(RightsAction, CredentialingAction, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/actingAgent
     *  The direct performer or driver (animate or inanimate) of an action.
     *  @property actingAgent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.actingAgent = null;
    /**
     *  http://purl.org/ctdl/terms/actionStatusType
     *  Indicates the current disposition of the action.
     *  @property actionStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.actionStatusType = null;
    /**
     *  http://purl.org/ctdl/terms/agent
     *  The direct performer or driver of the action (animate or inanimate).
     *  @property agent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.agent = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/endDate
     *  The end date of something.
     *  @property endDate
     *  @type date
     */
    prototype.endDate = null;
    /**
     *  http://purl.org/ctdl/terms/evidenceOfAction
     *  A resource that provides evidence of the continuing validity of the action being described.
     *  @property evidenceOfAction
     *  @type anyURI
     */
    prototype.evidenceOfAction = null;
    /**
     *  http://purl.org/ctdl/terms/instrument
     *  The object that helped the agent perform the action. e.g. John wrote a book with a pen.
     *  @property instrument
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.instrument = null;
    /**
     *  http://purl.org/ctdl/terms/object
     *  The object upon [which] the action is carried out, whose state is kept intact or changed.
     *  @property object
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Competency | CompetencyFramework | Credential | CredentialOrganization | CredentialPerson | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QACredentialOrganization | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.object = null;
    /**
     *  http://purl.org/ctdl/terms/participant
     *  Other co-agents that participated in the action indirectly.
     *  @property participant
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.participant = null;
    /**
     *  http://purl.org/ctdl/terms/resultingAward
     *  The result produced in the action.
     *  @property resultingAward
     *  @type CredentialAssertion
     */
    prototype.resultingAward = null;
    /**
     *  http://purl.org/ctdl/terms/startDate
     *  The start date of something.
     *  @property startDate
     *  @type date
     */
    prototype.startDate = null;
}, {actingAgent: "Object", actionStatusType: "CredentialAlignmentObject", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", actingAgent: "Object", actionStatusType: "CredentialAlignmentObject", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", target: "EntryPoint", participant: "Object", instrument: "Thing", agent: "Object", object: "Thing", actionStatus: "ActionStatusType", result: "Thing", location: "Object", error: "Thing", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "AccreditAction";
};
AccreditAction = stjs.extend(AccreditAction, CredentialingAction, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/actingAgent
     *  The direct performer or driver (animate or inanimate) of an action.
     *  @property actingAgent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.actingAgent = null;
    /**
     *  http://purl.org/ctdl/terms/actionStatusType
     *  Indicates the current disposition of the action.
     *  @property actionStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.actionStatusType = null;
    /**
     *  http://purl.org/ctdl/terms/agent
     *  The direct performer or driver of the action (animate or inanimate).
     *  @property agent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.agent = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/endDate
     *  The end date of something.
     *  @property endDate
     *  @type date
     */
    prototype.endDate = null;
    /**
     *  http://purl.org/ctdl/terms/evidenceOfAction
     *  A resource that provides evidence of the continuing validity of the action being described.
     *  @property evidenceOfAction
     *  @type anyURI
     */
    prototype.evidenceOfAction = null;
    /**
     *  http://purl.org/ctdl/terms/instrument
     *  The object that helped the agent perform the action. e.g. John wrote a book with a pen.
     *  @property instrument
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.instrument = null;
    /**
     *  http://purl.org/ctdl/terms/object
     *  The object upon [which] the action is carried out, whose state is kept intact or changed.
     *  @property object
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Competency | CompetencyFramework | Credential | CredentialOrganization | CredentialPerson | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QACredentialOrganization | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.object = null;
    /**
     *  http://purl.org/ctdl/terms/participant
     *  Other co-agents that participated in the action indirectly.
     *  @property participant
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.participant = null;
    /**
     *  http://purl.org/ctdl/terms/resultingAward
     *  The result produced in the action.
     *  @property resultingAward
     *  @type CredentialAssertion
     */
    prototype.resultingAward = null;
    /**
     *  http://purl.org/ctdl/terms/startDate
     *  The start date of something.
     *  @property startDate
     *  @type date
     */
    prototype.startDate = null;
}, {actingAgent: "Object", actionStatusType: "CredentialAlignmentObject", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", actingAgent: "Object", actionStatusType: "CredentialAlignmentObject", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", target: "EntryPoint", participant: "Object", instrument: "Thing", agent: "Object", object: "Thing", actionStatus: "ActionStatusType", result: "Thing", location: "Object", error: "Thing", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "RevokeAction";
};
RevokeAction = stjs.extend(RevokeAction, CredentialingAction, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/actingAgent
     *  The direct performer or driver (animate or inanimate) of an action.
     *  @property actingAgent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.actingAgent = null;
    /**
     *  http://purl.org/ctdl/terms/actionStatusType
     *  Indicates the current disposition of the action.
     *  @property actionStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.actionStatusType = null;
    /**
     *  http://purl.org/ctdl/terms/agent
     *  The direct performer or driver of the action (animate or inanimate).
     *  @property agent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.agent = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/endDate
     *  The end date of something.
     *  @property endDate
     *  @type date
     */
    prototype.endDate = null;
    /**
     *  http://purl.org/ctdl/terms/evidenceOfAction
     *  A resource that provides evidence of the continuing validity of the action being described.
     *  @property evidenceOfAction
     *  @type anyURI
     */
    prototype.evidenceOfAction = null;
    /**
     *  http://purl.org/ctdl/terms/instrument
     *  The object that helped the agent perform the action. e.g. John wrote a book with a pen.
     *  @property instrument
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.instrument = null;
    /**
     *  http://purl.org/ctdl/terms/object
     *  The object upon [which] the action is carried out, whose state is kept intact or changed.
     *  @property object
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Competency | CompetencyFramework | Credential | CredentialOrganization | CredentialPerson | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QACredentialOrganization | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.object = null;
    /**
     *  http://purl.org/ctdl/terms/participant
     *  Other co-agents that participated in the action indirectly.
     *  @property participant
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.participant = null;
    /**
     *  http://purl.org/ctdl/terms/resultingAward
     *  The result produced in the action.
     *  @property resultingAward
     *  @type CredentialAssertion
     */
    prototype.resultingAward = null;
    /**
     *  http://purl.org/ctdl/terms/startDate
     *  The start date of something.
     *  @property startDate
     *  @type date
     */
    prototype.startDate = null;
}, {actingAgent: "Object", actionStatusType: "CredentialAlignmentObject", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", actingAgent: "Object", actionStatusType: "CredentialAlignmentObject", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", target: "EntryPoint", participant: "Object", instrument: "Thing", agent: "Object", object: "Thing", actionStatus: "ActionStatusType", result: "Thing", location: "Object", error: "Thing", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "AdvancedStandingAction";
};
AdvancedStandingAction = stjs.extend(AdvancedStandingAction, CredentialingAction, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/actingAgent
     *  The direct performer or driver (animate or inanimate) of an action.
     *  @property actingAgent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.actingAgent = null;
    /**
     *  http://purl.org/ctdl/terms/actionStatusType
     *  Indicates the current disposition of the action.
     *  @property actionStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.actionStatusType = null;
    /**
     *  http://purl.org/ctdl/terms/agent
     *  The direct performer or driver of the action (animate or inanimate).
     *  @property agent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.agent = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/endDate
     *  The end date of something.
     *  @property endDate
     *  @type date
     */
    prototype.endDate = null;
    /**
     *  http://purl.org/ctdl/terms/evidenceOfAction
     *  A resource that provides evidence of the continuing validity of the action being described.
     *  @property evidenceOfAction
     *  @type anyURI
     */
    prototype.evidenceOfAction = null;
    /**
     *  http://purl.org/ctdl/terms/instrument
     *  The object that helped the agent perform the action. e.g. John wrote a book with a pen.
     *  @property instrument
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.instrument = null;
    /**
     *  http://purl.org/ctdl/terms/object
     *  The object upon [which] the action is carried out, whose state is kept intact or changed.
     *  @property object
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Competency | CompetencyFramework | Credential | CredentialOrganization | CredentialPerson | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QACredentialOrganization | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.object = null;
    /**
     *  http://purl.org/ctdl/terms/participant
     *  Other co-agents that participated in the action indirectly.
     *  @property participant
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.participant = null;
    /**
     *  http://purl.org/ctdl/terms/resultingAward
     *  The result produced in the action.
     *  @property resultingAward
     *  @type CredentialAssertion
     */
    prototype.resultingAward = null;
    /**
     *  http://purl.org/ctdl/terms/startDate
     *  The start date of something.
     *  @property startDate
     *  @type date
     */
    prototype.startDate = null;
}, {actingAgent: "Object", actionStatusType: "CredentialAlignmentObject", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", actingAgent: "Object", actionStatusType: "CredentialAlignmentObject", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", target: "EntryPoint", participant: "Object", instrument: "Thing", agent: "Object", object: "Thing", actionStatus: "ActionStatusType", result: "Thing", location: "Object", error: "Thing", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "OfferAction";
};
OfferAction = stjs.extend(OfferAction, CredentialingAction, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/actingAgent
     *  The direct performer or driver (animate or inanimate) of an action.
     *  @property actingAgent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.actingAgent = null;
    /**
     *  http://purl.org/ctdl/terms/actionStatusType
     *  Indicates the current disposition of the action.
     *  @property actionStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.actionStatusType = null;
    /**
     *  http://purl.org/ctdl/terms/agent
     *  The direct performer or driver of the action (animate or inanimate).
     *  @property agent
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.agent = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/endDate
     *  The end date of something.
     *  @property endDate
     *  @type date
     */
    prototype.endDate = null;
    /**
     *  http://purl.org/ctdl/terms/evidenceOfAction
     *  A resource that provides evidence of the continuing validity of the action being described.
     *  @property evidenceOfAction
     *  @type anyURI
     */
    prototype.evidenceOfAction = null;
    /**
     *  http://purl.org/ctdl/terms/instrument
     *  The object that helped the agent perform the action. e.g. John wrote a book with a pen.
     *  @property instrument
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.instrument = null;
    /**
     *  http://purl.org/ctdl/terms/object
     *  The object upon [which] the action is carried out, whose state is kept intact or changed.
     *  @property object
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Competency | CompetencyFramework | Credential | CredentialOrganization | CredentialPerson | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QACredentialOrganization | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.object = null;
    /**
     *  http://purl.org/ctdl/terms/participant
     *  Other co-agents that participated in the action indirectly.
     *  @property participant
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.participant = null;
    /**
     *  http://purl.org/ctdl/terms/resultingAward
     *  The result produced in the action.
     *  @property resultingAward
     *  @type CredentialAssertion
     */
    prototype.resultingAward = null;
    /**
     *  http://purl.org/ctdl/terms/startDate
     *  The start date of something.
     *  @property startDate
     *  @type date
     */
    prototype.startDate = null;
}, {actingAgent: "Object", actionStatusType: "CredentialAlignmentObject", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", actingAgent: "Object", actionStatusType: "CredentialAlignmentObject", agent: "Object", instrument: "Object", object: "Object", participant: "Object", resultingAward: "CredentialAssertion", target: "EntryPoint", participant: "Object", instrument: "Thing", agent: "Object", object: "Thing", actionStatus: "ActionStatusType", result: "Thing", location: "Object", error: "Thing", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "FinancialAlignmentObject";
};
FinancialAlignmentObject = stjs.extend(FinancialAlignmentObject, CredentialAlignmentObject, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/alignmentDate
     *  The date  the alignment was made.
     *  @property alignmentDate
     *  @type date
     */
    prototype.alignmentDate = null;
    /**
     *  http://purl.org/ctdl/terms/alignmentType
     *  A category of alignment between the learning resource and the framework node.
     *  @property alignmentType
     *  @type Literal
     */
    prototype.alignmentType = null;
    /**
     *  http://purl.org/ctdl/terms/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  http://purl.org/ctdl/terms/framework
     *  The framework to which the resource being described is aligned.
     *  @property framework
     *  @type anyURI
     */
    prototype.framework = null;
    /**
     *  http://purl.org/ctdl/terms/frameworkName
     *  The name of the framework to which the resource being described is aligned.
     *  @property frameworkName
     *  @type Literal
     */
    prototype.frameworkName = null;
    /**
     *  http://purl.org/ctdl/terms/targetNode
     *  The node of a framework targeted by the alignment.
     *  @property targetNode
     *  @type anyURI
     */
    prototype.targetNode = null;
    /**
     *  http://purl.org/ctdl/terms/targetNodeDescription
     *  The description of a node in an established educational framework.
     *  @property targetNodeDescription
     *  @type Literal
     */
    prototype.targetNodeDescription = null;
    /**
     *  http://purl.org/ctdl/terms/targetNodeName
     *  The name of a node in an established educational framework.
     *  @property targetNodeName
     *  @type Literal
     */
    prototype.targetNodeName = null;
    /**
     *  http://purl.org/ctdl/terms/weight
     *  An asserted measurement of the weight, degree, percent, or strength of a recommendation, requirement, or comparison.
     *  @property weight
     *  @type float
     */
    prototype.weight = null;
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "Degree";
};
Degree = stjs.extend(Degree, Credential, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  http://purl.org/ctdl/terms/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  http://purl.org/ctdl/terms/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  http://purl.org/ctdl/terms/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  http://purl.org/ctdl/terms/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  http://purl.org/ctdl/terms/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  http://purl.org/ctdl/terms/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  http://purl.org/ctdl/terms/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  http://purl.org/ctdl/terms/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  http://purl.org/ctdl/terms/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  http://purl.org/ctdl/terms/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  http://purl.org/ctdl/terms/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  http://purl.org/ctdl/terms/commonConditions
     *  The resource being referenced describes a set of common conditions applicable to the resource being described.
     *  @property commonConditions
     *  @type ConditionManifest
     */
    prototype.commonConditions = null;
    /**
     *  http://purl.org/ctdl/terms/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.copyrightHolder = null;
    /**
     *  http://purl.org/ctdl/terms/corequisite
     *  The resource being referenced must be pursued concurrently with the resource being described.
     *  @property corequisite
     *  @type ConditionProfile
     */
    prototype.corequisite = null;
    /**
     *  http://purl.org/ctdl/terms/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  http://purl.org/ctdl/terms/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  http://purl.org/ctdl/terms/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  http://purl.org/ctdl/terms/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type date
     */
    prototype.dateEffective = null;
    /**
     *  http://purl.org/ctdl/terms/degreeConcentration
     *  A structured plan of study within a degree major.
     *  @property degreeConcentration
     *  @type CredentialAlignmentObject
     */
    prototype.degreeConcentration = null;
    /**
     *  http://purl.org/ctdl/terms/degreeMajor
     *  The primary field of study of a degree-seeking student.
     *  @property degreeMajor
     *  @type CredentialAlignmentObject
     */
    prototype.degreeMajor = null;
    /**
     *  http://purl.org/ctdl/terms/degreeMinor
     *  An optional, secondary field of study of a degree-seeking student.
     *  @property degreeMinor
     *  @type CredentialAlignmentObject
     */
    prototype.degreeMinor = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  http://purl.org/ctdl/terms/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  http://purl.org/ctdl/terms/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  http://purl.org/ctdl/terms/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/financialAssistance
     *  The types of financial assistance for which the resource being described qualifies.
     *  @property financialAssistance
     *  @type FinancialAlignmentObject
     */
    prototype.financialAssistance = null;
    /**
     *  http://purl.org/ctdl/terms/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  http://purl.org/ctdl/terms/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  http://purl.org/ctdl/terms/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type anyURI
     */
    prototype.image = null;
    /**
     *  http://purl.org/ctdl/terms/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  http://purl.org/ctdl/terms/inLanguage
     *  The primary language used in or by the resource being described.
     *  @property inLanguage
     *  @type language
     */
    prototype.inLanguage = null;
    /**
     *  http://purl.org/ctdl/terms/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  http://purl.org/ctdl/terms/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  http://purl.org/ctdl/terms/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRecommendedFor
     *  The resource being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  http://purl.org/ctdl/terms/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  http://purl.org/ctdl/terms/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  http://purl.org/ctdl/terms/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  http://purl.org/ctdl/terms/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  http://purl.org/ctdl/terms/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  http://purl.org/ctdl/terms/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  http://purl.org/ctdl/terms/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  http://purl.org/ctdl/terms/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  http://purl.org/ctdl/terms/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  http://purl.org/ctdl/terms/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  http://purl.org/ctdl/terms/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  http://purl.org/ctdl/terms/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  http://purl.org/ctdl/terms/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  http://purl.org/ctdl/terms/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  http://purl.org/ctdl/terms/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  http://purl.org/ctdl/terms/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  http://purl.org/ctdl/terms/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  http://purl.org/ctdl/terms/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  http://purl.org/ctdl/terms/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  http://purl.org/ctdl/terms/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  http://purl.org/ctdl/terms/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  http://purl.org/ctdl/terms/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  http://purl.org/ctdl/terms/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  http://purl.org/ctdl/terms/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject
     */
    prototype.subject = null;
    /**
     *  http://purl.org/ctdl/terms/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  http://purl.org/ctdl/terms/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  http://purl.org/ctdl/terms/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", degreeConcentration: "CredentialAlignmentObject", degreeMajor: "CredentialAlignmentObject", degreeMinor: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "Diploma";
};
Diploma = stjs.extend(Diploma, Credential, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  http://purl.org/ctdl/terms/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  http://purl.org/ctdl/terms/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  http://purl.org/ctdl/terms/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  http://purl.org/ctdl/terms/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  http://purl.org/ctdl/terms/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  http://purl.org/ctdl/terms/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  http://purl.org/ctdl/terms/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  http://purl.org/ctdl/terms/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  http://purl.org/ctdl/terms/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  http://purl.org/ctdl/terms/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  http://purl.org/ctdl/terms/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  http://purl.org/ctdl/terms/commonConditions
     *  The resource being referenced describes a set of common conditions applicable to the resource being described.
     *  @property commonConditions
     *  @type ConditionManifest
     */
    prototype.commonConditions = null;
    /**
     *  http://purl.org/ctdl/terms/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.copyrightHolder = null;
    /**
     *  http://purl.org/ctdl/terms/corequisite
     *  The resource being referenced must be pursued concurrently with the resource being described.
     *  @property corequisite
     *  @type ConditionProfile
     */
    prototype.corequisite = null;
    /**
     *  http://purl.org/ctdl/terms/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  http://purl.org/ctdl/terms/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  http://purl.org/ctdl/terms/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  http://purl.org/ctdl/terms/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type date
     */
    prototype.dateEffective = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  http://purl.org/ctdl/terms/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  http://purl.org/ctdl/terms/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  http://purl.org/ctdl/terms/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/financialAssistance
     *  The types of financial assistance for which the resource being described qualifies.
     *  @property financialAssistance
     *  @type FinancialAlignmentObject
     */
    prototype.financialAssistance = null;
    /**
     *  http://purl.org/ctdl/terms/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  http://purl.org/ctdl/terms/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  http://purl.org/ctdl/terms/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type anyURI
     */
    prototype.image = null;
    /**
     *  http://purl.org/ctdl/terms/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  http://purl.org/ctdl/terms/inLanguage
     *  The primary language used in or by the resource being described.
     *  @property inLanguage
     *  @type language
     */
    prototype.inLanguage = null;
    /**
     *  http://purl.org/ctdl/terms/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  http://purl.org/ctdl/terms/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  http://purl.org/ctdl/terms/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRecommendedFor
     *  The resource being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  http://purl.org/ctdl/terms/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  http://purl.org/ctdl/terms/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  http://purl.org/ctdl/terms/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  http://purl.org/ctdl/terms/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  http://purl.org/ctdl/terms/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  http://purl.org/ctdl/terms/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  http://purl.org/ctdl/terms/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  http://purl.org/ctdl/terms/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  http://purl.org/ctdl/terms/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  http://purl.org/ctdl/terms/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  http://purl.org/ctdl/terms/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  http://purl.org/ctdl/terms/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  http://purl.org/ctdl/terms/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  http://purl.org/ctdl/terms/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  http://purl.org/ctdl/terms/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  http://purl.org/ctdl/terms/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  http://purl.org/ctdl/terms/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  http://purl.org/ctdl/terms/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  http://purl.org/ctdl/terms/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  http://purl.org/ctdl/terms/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  http://purl.org/ctdl/terms/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  http://purl.org/ctdl/terms/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  http://purl.org/ctdl/terms/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  http://purl.org/ctdl/terms/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject
     */
    prototype.subject = null;
    /**
     *  http://purl.org/ctdl/terms/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  http://purl.org/ctdl/terms/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  http://purl.org/ctdl/terms/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "Certificate";
};
Certificate = stjs.extend(Certificate, Credential, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  http://purl.org/ctdl/terms/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  http://purl.org/ctdl/terms/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  http://purl.org/ctdl/terms/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  http://purl.org/ctdl/terms/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  http://purl.org/ctdl/terms/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  http://purl.org/ctdl/terms/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  http://purl.org/ctdl/terms/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  http://purl.org/ctdl/terms/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  http://purl.org/ctdl/terms/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  http://purl.org/ctdl/terms/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  http://purl.org/ctdl/terms/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  http://purl.org/ctdl/terms/commonConditions
     *  The resource being referenced describes a set of common conditions applicable to the resource being described.
     *  @property commonConditions
     *  @type ConditionManifest
     */
    prototype.commonConditions = null;
    /**
     *  http://purl.org/ctdl/terms/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.copyrightHolder = null;
    /**
     *  http://purl.org/ctdl/terms/corequisite
     *  The resource being referenced must be pursued concurrently with the resource being described.
     *  @property corequisite
     *  @type ConditionProfile
     */
    prototype.corequisite = null;
    /**
     *  http://purl.org/ctdl/terms/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  http://purl.org/ctdl/terms/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  http://purl.org/ctdl/terms/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  http://purl.org/ctdl/terms/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type date
     */
    prototype.dateEffective = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  http://purl.org/ctdl/terms/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  http://purl.org/ctdl/terms/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  http://purl.org/ctdl/terms/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/financialAssistance
     *  The types of financial assistance for which the resource being described qualifies.
     *  @property financialAssistance
     *  @type FinancialAlignmentObject
     */
    prototype.financialAssistance = null;
    /**
     *  http://purl.org/ctdl/terms/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  http://purl.org/ctdl/terms/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  http://purl.org/ctdl/terms/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type anyURI
     */
    prototype.image = null;
    /**
     *  http://purl.org/ctdl/terms/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  http://purl.org/ctdl/terms/inLanguage
     *  The primary language used in or by the resource being described.
     *  @property inLanguage
     *  @type language
     */
    prototype.inLanguage = null;
    /**
     *  http://purl.org/ctdl/terms/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  http://purl.org/ctdl/terms/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  http://purl.org/ctdl/terms/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRecommendedFor
     *  The resource being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  http://purl.org/ctdl/terms/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  http://purl.org/ctdl/terms/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  http://purl.org/ctdl/terms/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  http://purl.org/ctdl/terms/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  http://purl.org/ctdl/terms/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  http://purl.org/ctdl/terms/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  http://purl.org/ctdl/terms/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  http://purl.org/ctdl/terms/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  http://purl.org/ctdl/terms/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  http://purl.org/ctdl/terms/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  http://purl.org/ctdl/terms/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  http://purl.org/ctdl/terms/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  http://purl.org/ctdl/terms/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  http://purl.org/ctdl/terms/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  http://purl.org/ctdl/terms/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  http://purl.org/ctdl/terms/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  http://purl.org/ctdl/terms/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  http://purl.org/ctdl/terms/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  http://purl.org/ctdl/terms/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  http://purl.org/ctdl/terms/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  http://purl.org/ctdl/terms/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  http://purl.org/ctdl/terms/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  http://purl.org/ctdl/terms/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  http://purl.org/ctdl/terms/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject
     */
    prototype.subject = null;
    /**
     *  http://purl.org/ctdl/terms/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  http://purl.org/ctdl/terms/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  http://purl.org/ctdl/terms/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "QualityAssuranceCredential";
};
QualityAssuranceCredential = stjs.extend(QualityAssuranceCredential, Credential, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  http://purl.org/ctdl/terms/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  http://purl.org/ctdl/terms/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  http://purl.org/ctdl/terms/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  http://purl.org/ctdl/terms/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  http://purl.org/ctdl/terms/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  http://purl.org/ctdl/terms/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  http://purl.org/ctdl/terms/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  http://purl.org/ctdl/terms/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  http://purl.org/ctdl/terms/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  http://purl.org/ctdl/terms/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  http://purl.org/ctdl/terms/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  http://purl.org/ctdl/terms/commonConditions
     *  The resource being referenced describes a set of common conditions applicable to the resource being described.
     *  @property commonConditions
     *  @type ConditionManifest
     */
    prototype.commonConditions = null;
    /**
     *  http://purl.org/ctdl/terms/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.copyrightHolder = null;
    /**
     *  http://purl.org/ctdl/terms/corequisite
     *  The resource being referenced must be pursued concurrently with the resource being described.
     *  @property corequisite
     *  @type ConditionProfile
     */
    prototype.corequisite = null;
    /**
     *  http://purl.org/ctdl/terms/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  http://purl.org/ctdl/terms/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  http://purl.org/ctdl/terms/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  http://purl.org/ctdl/terms/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type date
     */
    prototype.dateEffective = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  http://purl.org/ctdl/terms/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  http://purl.org/ctdl/terms/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  http://purl.org/ctdl/terms/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/financialAssistance
     *  The types of financial assistance for which the resource being described qualifies.
     *  @property financialAssistance
     *  @type FinancialAlignmentObject
     */
    prototype.financialAssistance = null;
    /**
     *  http://purl.org/ctdl/terms/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  http://purl.org/ctdl/terms/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  http://purl.org/ctdl/terms/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type anyURI
     */
    prototype.image = null;
    /**
     *  http://purl.org/ctdl/terms/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  http://purl.org/ctdl/terms/inLanguage
     *  The primary language used in or by the resource being described.
     *  @property inLanguage
     *  @type language
     */
    prototype.inLanguage = null;
    /**
     *  http://purl.org/ctdl/terms/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  http://purl.org/ctdl/terms/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  http://purl.org/ctdl/terms/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRecommendedFor
     *  The resource being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  http://purl.org/ctdl/terms/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  http://purl.org/ctdl/terms/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  http://purl.org/ctdl/terms/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  http://purl.org/ctdl/terms/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  http://purl.org/ctdl/terms/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  http://purl.org/ctdl/terms/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  http://purl.org/ctdl/terms/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  http://purl.org/ctdl/terms/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  http://purl.org/ctdl/terms/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  http://purl.org/ctdl/terms/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  http://purl.org/ctdl/terms/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  http://purl.org/ctdl/terms/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  http://purl.org/ctdl/terms/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  http://purl.org/ctdl/terms/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  http://purl.org/ctdl/terms/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  http://purl.org/ctdl/terms/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  http://purl.org/ctdl/terms/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  http://purl.org/ctdl/terms/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  http://purl.org/ctdl/terms/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  http://purl.org/ctdl/terms/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  http://purl.org/ctdl/terms/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  http://purl.org/ctdl/terms/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  http://purl.org/ctdl/terms/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  http://purl.org/ctdl/terms/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject
     */
    prototype.subject = null;
    /**
     *  http://purl.org/ctdl/terms/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  http://purl.org/ctdl/terms/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  http://purl.org/ctdl/terms/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "License";
};
License = stjs.extend(License, Credential, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  http://purl.org/ctdl/terms/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  http://purl.org/ctdl/terms/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  http://purl.org/ctdl/terms/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  http://purl.org/ctdl/terms/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  http://purl.org/ctdl/terms/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  http://purl.org/ctdl/terms/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  http://purl.org/ctdl/terms/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  http://purl.org/ctdl/terms/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  http://purl.org/ctdl/terms/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  http://purl.org/ctdl/terms/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  http://purl.org/ctdl/terms/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  http://purl.org/ctdl/terms/commonConditions
     *  The resource being referenced describes a set of common conditions applicable to the resource being described.
     *  @property commonConditions
     *  @type ConditionManifest
     */
    prototype.commonConditions = null;
    /**
     *  http://purl.org/ctdl/terms/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.copyrightHolder = null;
    /**
     *  http://purl.org/ctdl/terms/corequisite
     *  The resource being referenced must be pursued concurrently with the resource being described.
     *  @property corequisite
     *  @type ConditionProfile
     */
    prototype.corequisite = null;
    /**
     *  http://purl.org/ctdl/terms/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  http://purl.org/ctdl/terms/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  http://purl.org/ctdl/terms/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  http://purl.org/ctdl/terms/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type date
     */
    prototype.dateEffective = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  http://purl.org/ctdl/terms/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  http://purl.org/ctdl/terms/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  http://purl.org/ctdl/terms/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/financialAssistance
     *  The types of financial assistance for which the resource being described qualifies.
     *  @property financialAssistance
     *  @type FinancialAlignmentObject
     */
    prototype.financialAssistance = null;
    /**
     *  http://purl.org/ctdl/terms/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  http://purl.org/ctdl/terms/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  http://purl.org/ctdl/terms/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type anyURI
     */
    prototype.image = null;
    /**
     *  http://purl.org/ctdl/terms/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  http://purl.org/ctdl/terms/inLanguage
     *  The primary language used in or by the resource being described.
     *  @property inLanguage
     *  @type language
     */
    prototype.inLanguage = null;
    /**
     *  http://purl.org/ctdl/terms/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  http://purl.org/ctdl/terms/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  http://purl.org/ctdl/terms/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRecommendedFor
     *  The resource being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  http://purl.org/ctdl/terms/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  http://purl.org/ctdl/terms/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  http://purl.org/ctdl/terms/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  http://purl.org/ctdl/terms/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  http://purl.org/ctdl/terms/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  http://purl.org/ctdl/terms/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  http://purl.org/ctdl/terms/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  http://purl.org/ctdl/terms/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  http://purl.org/ctdl/terms/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  http://purl.org/ctdl/terms/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  http://purl.org/ctdl/terms/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  http://purl.org/ctdl/terms/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  http://purl.org/ctdl/terms/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  http://purl.org/ctdl/terms/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  http://purl.org/ctdl/terms/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  http://purl.org/ctdl/terms/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  http://purl.org/ctdl/terms/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  http://purl.org/ctdl/terms/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  http://purl.org/ctdl/terms/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  http://purl.org/ctdl/terms/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  http://purl.org/ctdl/terms/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  http://purl.org/ctdl/terms/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  http://purl.org/ctdl/terms/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  http://purl.org/ctdl/terms/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject
     */
    prototype.subject = null;
    /**
     *  http://purl.org/ctdl/terms/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  http://purl.org/ctdl/terms/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  http://purl.org/ctdl/terms/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "Certification";
};
Certification = stjs.extend(Certification, Credential, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  http://purl.org/ctdl/terms/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  http://purl.org/ctdl/terms/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  http://purl.org/ctdl/terms/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  http://purl.org/ctdl/terms/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  http://purl.org/ctdl/terms/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  http://purl.org/ctdl/terms/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  http://purl.org/ctdl/terms/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  http://purl.org/ctdl/terms/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  http://purl.org/ctdl/terms/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  http://purl.org/ctdl/terms/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  http://purl.org/ctdl/terms/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  http://purl.org/ctdl/terms/commonConditions
     *  The resource being referenced describes a set of common conditions applicable to the resource being described.
     *  @property commonConditions
     *  @type ConditionManifest
     */
    prototype.commonConditions = null;
    /**
     *  http://purl.org/ctdl/terms/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.copyrightHolder = null;
    /**
     *  http://purl.org/ctdl/terms/corequisite
     *  The resource being referenced must be pursued concurrently with the resource being described.
     *  @property corequisite
     *  @type ConditionProfile
     */
    prototype.corequisite = null;
    /**
     *  http://purl.org/ctdl/terms/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  http://purl.org/ctdl/terms/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  http://purl.org/ctdl/terms/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  http://purl.org/ctdl/terms/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type date
     */
    prototype.dateEffective = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  http://purl.org/ctdl/terms/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  http://purl.org/ctdl/terms/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  http://purl.org/ctdl/terms/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/financialAssistance
     *  The types of financial assistance for which the resource being described qualifies.
     *  @property financialAssistance
     *  @type FinancialAlignmentObject
     */
    prototype.financialAssistance = null;
    /**
     *  http://purl.org/ctdl/terms/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  http://purl.org/ctdl/terms/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  http://purl.org/ctdl/terms/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type anyURI
     */
    prototype.image = null;
    /**
     *  http://purl.org/ctdl/terms/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  http://purl.org/ctdl/terms/inLanguage
     *  The primary language used in or by the resource being described.
     *  @property inLanguage
     *  @type language
     */
    prototype.inLanguage = null;
    /**
     *  http://purl.org/ctdl/terms/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  http://purl.org/ctdl/terms/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  http://purl.org/ctdl/terms/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRecommendedFor
     *  The resource being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  http://purl.org/ctdl/terms/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  http://purl.org/ctdl/terms/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  http://purl.org/ctdl/terms/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  http://purl.org/ctdl/terms/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  http://purl.org/ctdl/terms/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  http://purl.org/ctdl/terms/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  http://purl.org/ctdl/terms/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  http://purl.org/ctdl/terms/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  http://purl.org/ctdl/terms/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  http://purl.org/ctdl/terms/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  http://purl.org/ctdl/terms/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  http://purl.org/ctdl/terms/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  http://purl.org/ctdl/terms/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  http://purl.org/ctdl/terms/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  http://purl.org/ctdl/terms/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  http://purl.org/ctdl/terms/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  http://purl.org/ctdl/terms/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  http://purl.org/ctdl/terms/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  http://purl.org/ctdl/terms/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  http://purl.org/ctdl/terms/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  http://purl.org/ctdl/terms/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  http://purl.org/ctdl/terms/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  http://purl.org/ctdl/terms/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  http://purl.org/ctdl/terms/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject
     */
    prototype.subject = null;
    /**
     *  http://purl.org/ctdl/terms/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  http://purl.org/ctdl/terms/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  http://purl.org/ctdl/terms/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "Badge";
};
Badge = stjs.extend(Badge, Credential, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  http://purl.org/ctdl/terms/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  http://purl.org/ctdl/terms/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  http://purl.org/ctdl/terms/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  http://purl.org/ctdl/terms/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  http://purl.org/ctdl/terms/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  http://purl.org/ctdl/terms/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  http://purl.org/ctdl/terms/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  http://purl.org/ctdl/terms/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  http://purl.org/ctdl/terms/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  http://purl.org/ctdl/terms/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  http://purl.org/ctdl/terms/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  http://purl.org/ctdl/terms/commonConditions
     *  The resource being referenced describes a set of common conditions applicable to the resource being described.
     *  @property commonConditions
     *  @type ConditionManifest
     */
    prototype.commonConditions = null;
    /**
     *  http://purl.org/ctdl/terms/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.copyrightHolder = null;
    /**
     *  http://purl.org/ctdl/terms/corequisite
     *  The resource being referenced must be pursued concurrently with the resource being described.
     *  @property corequisite
     *  @type ConditionProfile
     */
    prototype.corequisite = null;
    /**
     *  http://purl.org/ctdl/terms/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  http://purl.org/ctdl/terms/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  http://purl.org/ctdl/terms/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  http://purl.org/ctdl/terms/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type date
     */
    prototype.dateEffective = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  http://purl.org/ctdl/terms/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  http://purl.org/ctdl/terms/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  http://purl.org/ctdl/terms/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/financialAssistance
     *  The types of financial assistance for which the resource being described qualifies.
     *  @property financialAssistance
     *  @type FinancialAlignmentObject
     */
    prototype.financialAssistance = null;
    /**
     *  http://purl.org/ctdl/terms/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  http://purl.org/ctdl/terms/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  http://purl.org/ctdl/terms/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type anyURI
     */
    prototype.image = null;
    /**
     *  http://purl.org/ctdl/terms/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  http://purl.org/ctdl/terms/inLanguage
     *  The primary language used in or by the resource being described.
     *  @property inLanguage
     *  @type language
     */
    prototype.inLanguage = null;
    /**
     *  http://purl.org/ctdl/terms/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  http://purl.org/ctdl/terms/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  http://purl.org/ctdl/terms/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRecommendedFor
     *  The resource being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  http://purl.org/ctdl/terms/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  http://purl.org/ctdl/terms/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  http://purl.org/ctdl/terms/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  http://purl.org/ctdl/terms/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  http://purl.org/ctdl/terms/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  http://purl.org/ctdl/terms/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  http://purl.org/ctdl/terms/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  http://purl.org/ctdl/terms/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  http://purl.org/ctdl/terms/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  http://purl.org/ctdl/terms/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  http://purl.org/ctdl/terms/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  http://purl.org/ctdl/terms/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  http://purl.org/ctdl/terms/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  http://purl.org/ctdl/terms/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  http://purl.org/ctdl/terms/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  http://purl.org/ctdl/terms/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  http://purl.org/ctdl/terms/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  http://purl.org/ctdl/terms/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  http://purl.org/ctdl/terms/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  http://purl.org/ctdl/terms/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  http://purl.org/ctdl/terms/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  http://purl.org/ctdl/terms/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  http://purl.org/ctdl/terms/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  http://purl.org/ctdl/terms/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject
     */
    prototype.subject = null;
    /**
     *  http://purl.org/ctdl/terms/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  http://purl.org/ctdl/terms/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  http://purl.org/ctdl/terms/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "MicroCredential";
};
MicroCredential = stjs.extend(MicroCredential, Credential, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  http://purl.org/ctdl/terms/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  http://purl.org/ctdl/terms/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  http://purl.org/ctdl/terms/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  http://purl.org/ctdl/terms/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  http://purl.org/ctdl/terms/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  http://purl.org/ctdl/terms/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  http://purl.org/ctdl/terms/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  http://purl.org/ctdl/terms/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  http://purl.org/ctdl/terms/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  http://purl.org/ctdl/terms/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  http://purl.org/ctdl/terms/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  http://purl.org/ctdl/terms/commonConditions
     *  The resource being referenced describes a set of common conditions applicable to the resource being described.
     *  @property commonConditions
     *  @type ConditionManifest
     */
    prototype.commonConditions = null;
    /**
     *  http://purl.org/ctdl/terms/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.copyrightHolder = null;
    /**
     *  http://purl.org/ctdl/terms/corequisite
     *  The resource being referenced must be pursued concurrently with the resource being described.
     *  @property corequisite
     *  @type ConditionProfile
     */
    prototype.corequisite = null;
    /**
     *  http://purl.org/ctdl/terms/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  http://purl.org/ctdl/terms/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  http://purl.org/ctdl/terms/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  http://purl.org/ctdl/terms/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type date
     */
    prototype.dateEffective = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  http://purl.org/ctdl/terms/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  http://purl.org/ctdl/terms/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  http://purl.org/ctdl/terms/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/financialAssistance
     *  The types of financial assistance for which the resource being described qualifies.
     *  @property financialAssistance
     *  @type FinancialAlignmentObject
     */
    prototype.financialAssistance = null;
    /**
     *  http://purl.org/ctdl/terms/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  http://purl.org/ctdl/terms/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  http://purl.org/ctdl/terms/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type anyURI
     */
    prototype.image = null;
    /**
     *  http://purl.org/ctdl/terms/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  http://purl.org/ctdl/terms/inLanguage
     *  The primary language used in or by the resource being described.
     *  @property inLanguage
     *  @type language
     */
    prototype.inLanguage = null;
    /**
     *  http://purl.org/ctdl/terms/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  http://purl.org/ctdl/terms/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  http://purl.org/ctdl/terms/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRecommendedFor
     *  The resource being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  http://purl.org/ctdl/terms/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  http://purl.org/ctdl/terms/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  http://purl.org/ctdl/terms/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  http://purl.org/ctdl/terms/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  http://purl.org/ctdl/terms/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  http://purl.org/ctdl/terms/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  http://purl.org/ctdl/terms/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  http://purl.org/ctdl/terms/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  http://purl.org/ctdl/terms/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  http://purl.org/ctdl/terms/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  http://purl.org/ctdl/terms/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  http://purl.org/ctdl/terms/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  http://purl.org/ctdl/terms/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  http://purl.org/ctdl/terms/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  http://purl.org/ctdl/terms/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  http://purl.org/ctdl/terms/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  http://purl.org/ctdl/terms/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  http://purl.org/ctdl/terms/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  http://purl.org/ctdl/terms/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  http://purl.org/ctdl/terms/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  http://purl.org/ctdl/terms/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  http://purl.org/ctdl/terms/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  http://purl.org/ctdl/terms/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  http://purl.org/ctdl/terms/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject
     */
    prototype.subject = null;
    /**
     *  http://purl.org/ctdl/terms/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  http://purl.org/ctdl/terms/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  http://purl.org/ctdl/terms/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "CompetencyFramework";
};
CompetencyFramework = stjs.extend(CompetencyFramework, CredentialFramework, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/inLanguage
     *  The primary language used in or by the resource being described.
     *  @property inLanguage
     *  @type language
     */
    prototype.inLanguage = null;
}, {owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "PostalAddress";
};
PostalAddress = stjs.extend(PostalAddress, ContactPoint, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  http://purl.org/ctdl/terms/targetContactPoint
     *  Options for contacting the resource being described.
     *  @property targetContactPoint
     *  @type ContactPoint
     */
    prototype.targetContactPoint = null;
}, {targetContactPoint: "ContactPoint", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "CredentialOrganization";
};
CredentialOrganization = stjs.extend(CredentialOrganization, Agent, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  http://purl.org/ctdl/terms/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  http://purl.org/ctdl/terms/address
     *  Physical address of the resource.
     *  @property address
     *  @type PostalAddress
     */
    prototype.address = null;
    /**
     *  http://purl.org/ctdl/terms/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  http://purl.org/ctdl/terms/agentPurpose
     *  A resource that describes the agent's primary purpose.
     *  @property agentPurpose
     *  @type anyURI
     */
    prototype.agentPurpose = null;
    /**
     *  http://purl.org/ctdl/terms/agentPurposeDescription
     *  A description of the primary purpose of the agent being referenced.
     *  @property agentPurposeDescription
     *  @type Literal
     */
    prototype.agentPurposeDescription = null;
    /**
     *  http://purl.org/ctdl/terms/agentSectorType
     *  The types of sociological, economic, or political subdivision of society served by an agent.
     *  @property agentSectorType
     *  @type CredentialAlignmentObject
     */
    prototype.agentSectorType = null;
    /**
     *  http://purl.org/ctdl/terms/agentType
     *  The type of the described agent.
     *  @property agentType
     *  @type CredentialAlignmentObject
     */
    prototype.agentType = null;
    /**
     *  http://purl.org/ctdl/terms/alternativeIdentifier
     *  An alternative, publicly available and globally unique agent identifier issued by an authoritative entity.
     *  @property alternativeIdentifier
     *  @type IdentifierValue
     */
    prototype.alternativeIdentifier = null;
    /**
     *  http://purl.org/ctdl/terms/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  http://purl.org/ctdl/terms/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  http://purl.org/ctdl/terms/approves
     *  The agent being described officially accepts or authorizes the resource being referenced.
     *  @property approves
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | CompetencyFramework | Credential | CredentialOrganization | CredentialPerson | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QACredentialOrganization | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.approves = null;
    /**
     *  http://purl.org/ctdl/terms/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  http://purl.org/ctdl/terms/contactPoint
     *  A contact point for a person or organization.
     *  @property contactPoint
     *  @type ContactPoint
     */
    prototype.contactPoint = null;
    /**
     *  http://purl.org/ctdl/terms/credentialingAction
     *  Indicates a past or potential credentialing action in which the resource being described plays an 'object' role.
     *  @property credentialingAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.credentialingAction = null;
    /**
     *  http://purl.org/ctdl/terms/department
     *  The organization being referenced is a department of the organization being described.
     *  @property department
     *  @type CredentialOrganization | QACredentialOrganization
     */
    prototype.department = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  http://purl.org/ctdl/terms/duns
     *  The Dun & Bradstreet DUNS number for identifying an organization or business person.
     *  @property duns
     *  @type Literal
     */
    prototype.duns = null;
    /**
     *  http://purl.org/ctdl/terms/email
     *  Email address of the agent being described.
     *  @property email
     *  @type Literal
     */
    prototype.email = null;
    /**
     *  http://purl.org/ctdl/terms/employee
     *  The referenced person is an employee of the organization being described.
     *  @property employee
     *  @type CredentialPerson
     */
    prototype.employee = null;
    /**
     *  http://purl.org/ctdl/terms/fein
     *  A Federal Employer Identification Number (FEIN) for identifying organizations, persons, states, government agencies, corporations, and companies.
     *  @property fein
     *  @type Literal
     */
    prototype.fein = null;
    /**
     *  http://purl.org/ctdl/terms/foundingDate
     *  The date that this organization was founded.
     *  @property foundingDate
     *  @type Literal
     */
    prototype.foundingDate = null;
    /**
     *  http://purl.org/ctdl/terms/hasConditionManifest
     *  The resource being referenced describes a set of conditions maintained by the agent being described.
     *  @property hasConditionManifest
     *  @type ConditionManifest
     */
    prototype.hasConditionManifest = null;
    /**
     *  http://purl.org/ctdl/terms/hasVerificationService
     *  A profile of available systems provided by the described agent to verify credential holders.
     *  @property hasVerificationService
     *  @type VerificationServiceProfile
     */
    prototype.hasVerificationService = null;
    /**
     *  http://purl.org/ctdl/terms/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type anyURI
     */
    prototype.image = null;
    /**
     *  http://purl.org/ctdl/terms/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  http://purl.org/ctdl/terms/ipedsID
     *  The unique six (6) digit identifier assigned to all institutions that have submitted data to the Integrated Postsecondary Education Data System (IPEDS).
     *  @property ipedsID
     *  @type Literal
     */
    prototype.ipedsID = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  http://purl.org/ctdl/terms/learningOpportunityOffered
     *  A learning opportunity offered by the agent.
     *  @property learningOpportunityOffered
     *  @type LearningOpportunityProfile
     */
    prototype.learningOpportunityOffered = null;
    /**
     *  http://purl.org/ctdl/terms/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  http://purl.org/ctdl/terms/missionAndGoalsStatement
     *  A resource that defines or explains the mission and goals statement of the resource being described.
     *  @property missionAndGoalsStatement
     *  @type anyURI
     */
    prototype.missionAndGoalsStatement = null;
    /**
     *  http://purl.org/ctdl/terms/missionAndGoalsStatementDescription
     *  The mission and goals statement of the described agent.
     *  @property missionAndGoalsStatementDescription
     *  @type Literal
     */
    prototype.missionAndGoalsStatementDescription = null;
    /**
     *  http://purl.org/ctdl/terms/naics
     *  The North American Industry Classification System (NAICS) code for a particular organization or business person.
     *  @property naics
     *  @type Literal
     */
    prototype.naics = null;
    /**
     *  http://purl.org/ctdl/terms/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  http://purl.org/ctdl/terms/offers
     *  The agent being described offers or confers the resource being referenced.
     *  @property offers
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.offers = null;
    /**
     *  http://purl.org/ctdl/terms/opeID
     *  OPE ID number (Office of Postsecondary Education Identification) sometimes referred to as the Federal School Code.
     *  @property opeID
     *  @type Literal
     */
    prototype.opeID = null;
    /**
     *  http://purl.org/ctdl/terms/owns
     *  The described agent has legal title to the referenced resource.
     *  @property owns
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.owns = null;
    /**
     *  http://purl.org/ctdl/terms/parentOrganization
     *  The larger, parent organization of the organization being described.
     *  @property parentOrganization
     *  @type CredentialOrganization | QACredentialOrganization
     */
    prototype.parentOrganization = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  http://purl.org/ctdl/terms/recognizes
     *  The agent being described recommends, endorses, indicates preference for, or otherwise provides positive judgment of a resource.
     *  @property recognizes
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | CompetencyFramework | Credential | CredentialOrganization | CredentialPerson | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QACredentialOrganization | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recognizes = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  http://purl.org/ctdl/terms/renews
     *  The described agent handles the renewal of an award of the referenced credential.
     *  @property renews
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.renews = null;
    /**
     *  http://purl.org/ctdl/terms/revokes
     *  The described agent ends the validity or operation of the resource being referenced based on cause.
     *  @property revokes
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.revokes = null;
    /**
     *  http://purl.org/ctdl/terms/sameAs
     *  The resource being described is the same as the resource being referenced.
     *  @property sameAs
     *  @type anyURI
     */
    prototype.sameAs = null;
    /**
     *  http://purl.org/ctdl/terms/serviceType
     *  The type of service offered by the agent being described.
     *  @property serviceType
     *  @type CredentialAlignmentObject
     */
    prototype.serviceType = null;
    /**
     *  http://purl.org/ctdl/terms/socialMedia
     *  A social media resource for the resource being described.
     *  @property socialMedia
     *  @type anyURI
     */
    prototype.socialMedia = null;
    /**
     *  http://purl.org/ctdl/terms/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  http://purl.org/ctdl/terms/subOrganization
     *  The organization being described is the parent of the organization being referenced.
     *  @property subOrganization
     *  @type CredentialOrganization | QACredentialOrganization
     */
    prototype.subOrganization = null;
    /**
     *  http://purl.org/ctdl/terms/targetContactPoint
     *  Options for contacting the resource being described.
     *  @property targetContactPoint
     *  @type ContactPoint
     */
    prototype.targetContactPoint = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", address: "PostalAddress", administrationProcess: "ProcessProfile", agentSectorType: "CredentialAlignmentObject", agentType: "CredentialAlignmentObject", alternativeIdentifier: "IdentifierValue", approvedBy: "Object", approvedIn: "JurisdictionProfile", approves: "Object", contactPoint: "ContactPoint", credentialingAction: "Object", department: "Object", developmentProcess: "ProcessProfile", employee: "CredentialPerson", hasConditionManifest: "ConditionManifest", hasVerificationService: "VerificationServiceProfile", industryType: "CredentialAlignmentObject", jurisdiction: "JurisdictionProfile", learningOpportunityOffered: "LearningOpportunityProfile", maintenanceProcess: "ProcessProfile", offers: "Object", owns: "Object", parentOrganization: "Object", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recognizes: "Object", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", renews: "Object", revokes: "Object", serviceType: "CredentialAlignmentObject", subOrganization: "Object", targetContactPoint: "ContactPoint", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  credentialengine.org/CredentialPerson
 *  A person who plays a role as primary agent in a credentialing action.
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "CredentialPerson";
};
CredentialPerson = stjs.extend(CredentialPerson, Agent, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  http://purl.org/ctdl/terms/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  http://purl.org/ctdl/terms/approves
     *  The agent being described officially accepts or authorizes the resource being referenced.
     *  @property approves
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | CompetencyFramework | Credential | CredentialOrganization | CredentialPerson | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QACredentialOrganization | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.approves = null;
    /**
     *  http://purl.org/ctdl/terms/contactPoint
     *  A contact point for a person or organization.
     *  @property contactPoint
     *  @type ContactPoint
     */
    prototype.contactPoint = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/email
     *  Email address of the agent being described.
     *  @property email
     *  @type Literal
     */
    prototype.email = null;
    /**
     *  http://purl.org/ctdl/terms/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type anyURI
     */
    prototype.image = null;
    /**
     *  http://purl.org/ctdl/terms/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  http://purl.org/ctdl/terms/offers
     *  The agent being described offers or confers the resource being referenced.
     *  @property offers
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.offers = null;
    /**
     *  http://purl.org/ctdl/terms/owns
     *  The described agent has legal title to the referenced resource.
     *  @property owns
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.owns = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  http://purl.org/ctdl/terms/recognizes
     *  The agent being described recommends, endorses, indicates preference for, or otherwise provides positive judgment of a resource.
     *  @property recognizes
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | CompetencyFramework | Credential | CredentialOrganization | CredentialPerson | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QACredentialOrganization | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recognizes = null;
    /**
     *  http://purl.org/ctdl/terms/renews
     *  The described agent handles the renewal of an award of the referenced credential.
     *  @property renews
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.renews = null;
    /**
     *  http://purl.org/ctdl/terms/revokes
     *  The described agent ends the validity or operation of the resource being referenced based on cause.
     *  @property revokes
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.revokes = null;
    /**
     *  http://purl.org/ctdl/terms/sameAs
     *  The resource being described is the same as the resource being referenced.
     *  @property sameAs
     *  @type anyURI
     */
    prototype.sameAs = null;
    /**
     *  http://purl.org/ctdl/terms/serviceType
     *  The type of service offered by the agent being described.
     *  @property serviceType
     *  @type CredentialAlignmentObject
     */
    prototype.serviceType = null;
    /**
     *  http://purl.org/ctdl/terms/socialMedia
     *  A social media resource for the resource being described.
     *  @property socialMedia
     *  @type anyURI
     */
    prototype.socialMedia = null;
    /**
     *  http://purl.org/ctdl/terms/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  http://purl.org/ctdl/terms/targetContactPoint
     *  Options for contacting the resource being described.
     *  @property targetContactPoint
     *  @type ContactPoint
     */
    prototype.targetContactPoint = null;
}, {approvedBy: "Object", approvedIn: "JurisdictionProfile", approves: "Object", contactPoint: "ContactPoint", offers: "Object", owns: "Object", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recognizes: "Object", renews: "Object", revokes: "Object", serviceType: "CredentialAlignmentObject", targetContactPoint: "ContactPoint", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "QACredentialOrganization";
};
QACredentialOrganization = stjs.extend(QACredentialOrganization, Agent, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  http://purl.org/ctdl/terms/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  http://purl.org/ctdl/terms/address
     *  Physical address of the resource.
     *  @property address
     *  @type PostalAddress
     */
    prototype.address = null;
    /**
     *  http://purl.org/ctdl/terms/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  http://purl.org/ctdl/terms/agentPurpose
     *  A resource that describes the agent's primary purpose.
     *  @property agentPurpose
     *  @type anyURI
     */
    prototype.agentPurpose = null;
    /**
     *  http://purl.org/ctdl/terms/agentPurposeDescription
     *  A description of the primary purpose of the agent being referenced.
     *  @property agentPurposeDescription
     *  @type Literal
     */
    prototype.agentPurposeDescription = null;
    /**
     *  http://purl.org/ctdl/terms/agentSectorType
     *  The types of sociological, economic, or political subdivision of society served by an agent.
     *  @property agentSectorType
     *  @type CredentialAlignmentObject
     */
    prototype.agentSectorType = null;
    /**
     *  http://purl.org/ctdl/terms/agentType
     *  The type of the described agent.
     *  @property agentType
     *  @type CredentialAlignmentObject
     */
    prototype.agentType = null;
    /**
     *  http://purl.org/ctdl/terms/alternativeIdentifier
     *  An alternative, publicly available and globally unique agent identifier issued by an authoritative entity.
     *  @property alternativeIdentifier
     *  @type IdentifierValue
     */
    prototype.alternativeIdentifier = null;
    /**
     *  http://purl.org/ctdl/terms/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  http://purl.org/ctdl/terms/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  http://purl.org/ctdl/terms/approves
     *  The agent being described officially accepts or authorizes the resource being referenced.
     *  @property approves
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | CompetencyFramework | Credential | CredentialOrganization | CredentialPerson | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QACredentialOrganization | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.approves = null;
    /**
     *  http://purl.org/ctdl/terms/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  http://purl.org/ctdl/terms/contactPoint
     *  A contact point for a person or organization.
     *  @property contactPoint
     *  @type ContactPoint
     */
    prototype.contactPoint = null;
    /**
     *  http://purl.org/ctdl/terms/credentialingAction
     *  Indicates a past or potential credentialing action in which the resource being described plays an 'object' role.
     *  @property credentialingAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.credentialingAction = null;
    /**
     *  http://purl.org/ctdl/terms/department
     *  The organization being referenced is a department of the organization being described.
     *  @property department
     *  @type CredentialOrganization | QACredentialOrganization
     */
    prototype.department = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  http://purl.org/ctdl/terms/duns
     *  The Dun & Bradstreet DUNS number for identifying an organization or business person.
     *  @property duns
     *  @type Literal
     */
    prototype.duns = null;
    /**
     *  http://purl.org/ctdl/terms/email
     *  Email address of the agent being described.
     *  @property email
     *  @type Literal
     */
    prototype.email = null;
    /**
     *  http://purl.org/ctdl/terms/employee
     *  The referenced person is an employee of the organization being described.
     *  @property employee
     *  @type CredentialPerson
     */
    prototype.employee = null;
    /**
     *  http://purl.org/ctdl/terms/fein
     *  A Federal Employer Identification Number (FEIN) for identifying organizations, persons, states, government agencies, corporations, and companies.
     *  @property fein
     *  @type Literal
     */
    prototype.fein = null;
    /**
     *  http://purl.org/ctdl/terms/foundingDate
     *  The date that this organization was founded.
     *  @property foundingDate
     *  @type Literal
     */
    prototype.foundingDate = null;
    /**
     *  http://purl.org/ctdl/terms/hasConditionManifest
     *  The resource being referenced describes a set of conditions maintained by the agent being described.
     *  @property hasConditionManifest
     *  @type ConditionManifest
     */
    prototype.hasConditionManifest = null;
    /**
     *  http://purl.org/ctdl/terms/hasVerificationService
     *  A profile of available systems provided by the described agent to verify credential holders.
     *  @property hasVerificationService
     *  @type VerificationServiceProfile
     */
    prototype.hasVerificationService = null;
    /**
     *  http://purl.org/ctdl/terms/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type anyURI
     */
    prototype.image = null;
    /**
     *  http://purl.org/ctdl/terms/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  http://purl.org/ctdl/terms/ipedsID
     *  The unique six (6) digit identifier assigned to all institutions that have submitted data to the Integrated Postsecondary Education Data System (IPEDS).
     *  @property ipedsID
     *  @type Literal
     */
    prototype.ipedsID = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  http://purl.org/ctdl/terms/learningOpportunityOffered
     *  A learning opportunity offered by the agent.
     *  @property learningOpportunityOffered
     *  @type LearningOpportunityProfile
     */
    prototype.learningOpportunityOffered = null;
    /**
     *  http://purl.org/ctdl/terms/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  http://purl.org/ctdl/terms/missionAndGoalsStatement
     *  A resource that defines or explains the mission and goals statement of the resource being described.
     *  @property missionAndGoalsStatement
     *  @type anyURI
     */
    prototype.missionAndGoalsStatement = null;
    /**
     *  http://purl.org/ctdl/terms/missionAndGoalsStatementDescription
     *  The mission and goals statement of the described agent.
     *  @property missionAndGoalsStatementDescription
     *  @type Literal
     */
    prototype.missionAndGoalsStatementDescription = null;
    /**
     *  http://purl.org/ctdl/terms/naics
     *  The North American Industry Classification System (NAICS) code for a particular organization or business person.
     *  @property naics
     *  @type Literal
     */
    prototype.naics = null;
    /**
     *  http://purl.org/ctdl/terms/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  http://purl.org/ctdl/terms/offers
     *  The agent being described offers or confers the resource being referenced.
     *  @property offers
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.offers = null;
    /**
     *  http://purl.org/ctdl/terms/opeID
     *  OPE ID number (Office of Postsecondary Education Identification) sometimes referred to as the Federal School Code.
     *  @property opeID
     *  @type Literal
     */
    prototype.opeID = null;
    /**
     *  http://purl.org/ctdl/terms/owns
     *  The described agent has legal title to the referenced resource.
     *  @property owns
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.owns = null;
    /**
     *  http://purl.org/ctdl/terms/parentOrganization
     *  The larger, parent organization of the organization being described.
     *  @property parentOrganization
     *  @type CredentialOrganization | QACredentialOrganization
     */
    prototype.parentOrganization = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  http://purl.org/ctdl/terms/recognizes
     *  The agent being described recommends, endorses, indicates preference for, or otherwise provides positive judgment of a resource.
     *  @property recognizes
     *  @type ApprenticeshipCertificate | AssessmentProfile | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | CompetencyFramework | Credential | CredentialOrganization | CredentialPerson | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QACredentialOrganization | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recognizes = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  http://purl.org/ctdl/terms/renews
     *  The described agent handles the renewal of an award of the referenced credential.
     *  @property renews
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.renews = null;
    /**
     *  http://purl.org/ctdl/terms/revokes
     *  The described agent ends the validity or operation of the resource being referenced based on cause.
     *  @property revokes
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.revokes = null;
    /**
     *  http://purl.org/ctdl/terms/sameAs
     *  The resource being described is the same as the resource being referenced.
     *  @property sameAs
     *  @type anyURI
     */
    prototype.sameAs = null;
    /**
     *  http://purl.org/ctdl/terms/serviceType
     *  The type of service offered by the agent being described.
     *  @property serviceType
     *  @type CredentialAlignmentObject
     */
    prototype.serviceType = null;
    /**
     *  http://purl.org/ctdl/terms/socialMedia
     *  A social media resource for the resource being described.
     *  @property socialMedia
     *  @type anyURI
     */
    prototype.socialMedia = null;
    /**
     *  http://purl.org/ctdl/terms/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  http://purl.org/ctdl/terms/subOrganization
     *  The organization being described is the parent of the organization being referenced.
     *  @property subOrganization
     *  @type CredentialOrganization | QACredentialOrganization
     */
    prototype.subOrganization = null;
    /**
     *  http://purl.org/ctdl/terms/targetContactPoint
     *  Options for contacting the resource being described.
     *  @property targetContactPoint
     *  @type ContactPoint
     */
    prototype.targetContactPoint = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", address: "PostalAddress", administrationProcess: "ProcessProfile", agentSectorType: "CredentialAlignmentObject", agentType: "CredentialAlignmentObject", alternativeIdentifier: "IdentifierValue", approvedBy: "Object", approvedIn: "JurisdictionProfile", approves: "Object", contactPoint: "ContactPoint", credentialingAction: "Object", department: "Object", developmentProcess: "ProcessProfile", employee: "CredentialPerson", hasConditionManifest: "ConditionManifest", hasVerificationService: "VerificationServiceProfile", industryType: "CredentialAlignmentObject", jurisdiction: "JurisdictionProfile", learningOpportunityOffered: "LearningOpportunityProfile", maintenanceProcess: "ProcessProfile", offers: "Object", owns: "Object", parentOrganization: "Object", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recognizes: "Object", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", renews: "Object", revokes: "Object", serviceType: "CredentialAlignmentObject", subOrganization: "Object", targetContactPoint: "ContactPoint", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "MasterDegree";
};
MasterDegree = stjs.extend(MasterDegree, Degree, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  http://purl.org/ctdl/terms/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  http://purl.org/ctdl/terms/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  http://purl.org/ctdl/terms/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  http://purl.org/ctdl/terms/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  http://purl.org/ctdl/terms/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  http://purl.org/ctdl/terms/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  http://purl.org/ctdl/terms/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  http://purl.org/ctdl/terms/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  http://purl.org/ctdl/terms/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  http://purl.org/ctdl/terms/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  http://purl.org/ctdl/terms/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  http://purl.org/ctdl/terms/commonConditions
     *  The resource being referenced describes a set of common conditions applicable to the resource being described.
     *  @property commonConditions
     *  @type ConditionManifest
     */
    prototype.commonConditions = null;
    /**
     *  http://purl.org/ctdl/terms/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.copyrightHolder = null;
    /**
     *  http://purl.org/ctdl/terms/corequisite
     *  The resource being referenced must be pursued concurrently with the resource being described.
     *  @property corequisite
     *  @type ConditionProfile
     */
    prototype.corequisite = null;
    /**
     *  http://purl.org/ctdl/terms/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  http://purl.org/ctdl/terms/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  http://purl.org/ctdl/terms/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  http://purl.org/ctdl/terms/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type date
     */
    prototype.dateEffective = null;
    /**
     *  http://purl.org/ctdl/terms/degreeConcentration
     *  A structured plan of study within a degree major.
     *  @property degreeConcentration
     *  @type CredentialAlignmentObject
     */
    prototype.degreeConcentration = null;
    /**
     *  http://purl.org/ctdl/terms/degreeMajor
     *  The primary field of study of a degree-seeking student.
     *  @property degreeMajor
     *  @type CredentialAlignmentObject
     */
    prototype.degreeMajor = null;
    /**
     *  http://purl.org/ctdl/terms/degreeMinor
     *  An optional, secondary field of study of a degree-seeking student.
     *  @property degreeMinor
     *  @type CredentialAlignmentObject
     */
    prototype.degreeMinor = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  http://purl.org/ctdl/terms/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  http://purl.org/ctdl/terms/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  http://purl.org/ctdl/terms/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/financialAssistance
     *  The types of financial assistance for which the resource being described qualifies.
     *  @property financialAssistance
     *  @type FinancialAlignmentObject
     */
    prototype.financialAssistance = null;
    /**
     *  http://purl.org/ctdl/terms/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  http://purl.org/ctdl/terms/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  http://purl.org/ctdl/terms/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type anyURI
     */
    prototype.image = null;
    /**
     *  http://purl.org/ctdl/terms/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  http://purl.org/ctdl/terms/inLanguage
     *  The primary language used in or by the resource being described.
     *  @property inLanguage
     *  @type language
     */
    prototype.inLanguage = null;
    /**
     *  http://purl.org/ctdl/terms/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  http://purl.org/ctdl/terms/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  http://purl.org/ctdl/terms/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRecommendedFor
     *  The resource being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  http://purl.org/ctdl/terms/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  http://purl.org/ctdl/terms/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  http://purl.org/ctdl/terms/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  http://purl.org/ctdl/terms/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  http://purl.org/ctdl/terms/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  http://purl.org/ctdl/terms/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  http://purl.org/ctdl/terms/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  http://purl.org/ctdl/terms/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  http://purl.org/ctdl/terms/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  http://purl.org/ctdl/terms/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  http://purl.org/ctdl/terms/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  http://purl.org/ctdl/terms/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  http://purl.org/ctdl/terms/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  http://purl.org/ctdl/terms/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  http://purl.org/ctdl/terms/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  http://purl.org/ctdl/terms/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  http://purl.org/ctdl/terms/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  http://purl.org/ctdl/terms/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  http://purl.org/ctdl/terms/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  http://purl.org/ctdl/terms/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  http://purl.org/ctdl/terms/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  http://purl.org/ctdl/terms/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  http://purl.org/ctdl/terms/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  http://purl.org/ctdl/terms/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject
     */
    prototype.subject = null;
    /**
     *  http://purl.org/ctdl/terms/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  http://purl.org/ctdl/terms/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  http://purl.org/ctdl/terms/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", degreeConcentration: "CredentialAlignmentObject", degreeMajor: "CredentialAlignmentObject", degreeMinor: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", degreeConcentration: "CredentialAlignmentObject", degreeMajor: "CredentialAlignmentObject", degreeMinor: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "BachelorDegree";
};
BachelorDegree = stjs.extend(BachelorDegree, Degree, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  http://purl.org/ctdl/terms/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  http://purl.org/ctdl/terms/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  http://purl.org/ctdl/terms/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  http://purl.org/ctdl/terms/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  http://purl.org/ctdl/terms/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  http://purl.org/ctdl/terms/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  http://purl.org/ctdl/terms/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  http://purl.org/ctdl/terms/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  http://purl.org/ctdl/terms/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  http://purl.org/ctdl/terms/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  http://purl.org/ctdl/terms/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  http://purl.org/ctdl/terms/commonConditions
     *  The resource being referenced describes a set of common conditions applicable to the resource being described.
     *  @property commonConditions
     *  @type ConditionManifest
     */
    prototype.commonConditions = null;
    /**
     *  http://purl.org/ctdl/terms/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.copyrightHolder = null;
    /**
     *  http://purl.org/ctdl/terms/corequisite
     *  The resource being referenced must be pursued concurrently with the resource being described.
     *  @property corequisite
     *  @type ConditionProfile
     */
    prototype.corequisite = null;
    /**
     *  http://purl.org/ctdl/terms/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  http://purl.org/ctdl/terms/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  http://purl.org/ctdl/terms/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  http://purl.org/ctdl/terms/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type date
     */
    prototype.dateEffective = null;
    /**
     *  http://purl.org/ctdl/terms/degreeConcentration
     *  A structured plan of study within a degree major.
     *  @property degreeConcentration
     *  @type CredentialAlignmentObject
     */
    prototype.degreeConcentration = null;
    /**
     *  http://purl.org/ctdl/terms/degreeMajor
     *  The primary field of study of a degree-seeking student.
     *  @property degreeMajor
     *  @type CredentialAlignmentObject
     */
    prototype.degreeMajor = null;
    /**
     *  http://purl.org/ctdl/terms/degreeMinor
     *  An optional, secondary field of study of a degree-seeking student.
     *  @property degreeMinor
     *  @type CredentialAlignmentObject
     */
    prototype.degreeMinor = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  http://purl.org/ctdl/terms/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  http://purl.org/ctdl/terms/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  http://purl.org/ctdl/terms/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/financialAssistance
     *  The types of financial assistance for which the resource being described qualifies.
     *  @property financialAssistance
     *  @type FinancialAlignmentObject
     */
    prototype.financialAssistance = null;
    /**
     *  http://purl.org/ctdl/terms/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  http://purl.org/ctdl/terms/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  http://purl.org/ctdl/terms/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type anyURI
     */
    prototype.image = null;
    /**
     *  http://purl.org/ctdl/terms/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  http://purl.org/ctdl/terms/inLanguage
     *  The primary language used in or by the resource being described.
     *  @property inLanguage
     *  @type language
     */
    prototype.inLanguage = null;
    /**
     *  http://purl.org/ctdl/terms/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  http://purl.org/ctdl/terms/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  http://purl.org/ctdl/terms/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRecommendedFor
     *  The resource being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  http://purl.org/ctdl/terms/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  http://purl.org/ctdl/terms/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  http://purl.org/ctdl/terms/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  http://purl.org/ctdl/terms/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  http://purl.org/ctdl/terms/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  http://purl.org/ctdl/terms/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  http://purl.org/ctdl/terms/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  http://purl.org/ctdl/terms/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  http://purl.org/ctdl/terms/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  http://purl.org/ctdl/terms/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  http://purl.org/ctdl/terms/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  http://purl.org/ctdl/terms/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  http://purl.org/ctdl/terms/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  http://purl.org/ctdl/terms/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  http://purl.org/ctdl/terms/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  http://purl.org/ctdl/terms/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  http://purl.org/ctdl/terms/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  http://purl.org/ctdl/terms/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  http://purl.org/ctdl/terms/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  http://purl.org/ctdl/terms/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  http://purl.org/ctdl/terms/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  http://purl.org/ctdl/terms/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  http://purl.org/ctdl/terms/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  http://purl.org/ctdl/terms/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject
     */
    prototype.subject = null;
    /**
     *  http://purl.org/ctdl/terms/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  http://purl.org/ctdl/terms/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  http://purl.org/ctdl/terms/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", degreeConcentration: "CredentialAlignmentObject", degreeMajor: "CredentialAlignmentObject", degreeMinor: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", degreeConcentration: "CredentialAlignmentObject", degreeMajor: "CredentialAlignmentObject", degreeMinor: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "AssociateDegree";
};
AssociateDegree = stjs.extend(AssociateDegree, Degree, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  http://purl.org/ctdl/terms/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  http://purl.org/ctdl/terms/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  http://purl.org/ctdl/terms/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  http://purl.org/ctdl/terms/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  http://purl.org/ctdl/terms/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  http://purl.org/ctdl/terms/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  http://purl.org/ctdl/terms/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  http://purl.org/ctdl/terms/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  http://purl.org/ctdl/terms/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  http://purl.org/ctdl/terms/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  http://purl.org/ctdl/terms/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  http://purl.org/ctdl/terms/commonConditions
     *  The resource being referenced describes a set of common conditions applicable to the resource being described.
     *  @property commonConditions
     *  @type ConditionManifest
     */
    prototype.commonConditions = null;
    /**
     *  http://purl.org/ctdl/terms/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.copyrightHolder = null;
    /**
     *  http://purl.org/ctdl/terms/corequisite
     *  The resource being referenced must be pursued concurrently with the resource being described.
     *  @property corequisite
     *  @type ConditionProfile
     */
    prototype.corequisite = null;
    /**
     *  http://purl.org/ctdl/terms/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  http://purl.org/ctdl/terms/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  http://purl.org/ctdl/terms/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  http://purl.org/ctdl/terms/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type date
     */
    prototype.dateEffective = null;
    /**
     *  http://purl.org/ctdl/terms/degreeConcentration
     *  A structured plan of study within a degree major.
     *  @property degreeConcentration
     *  @type CredentialAlignmentObject
     */
    prototype.degreeConcentration = null;
    /**
     *  http://purl.org/ctdl/terms/degreeMajor
     *  The primary field of study of a degree-seeking student.
     *  @property degreeMajor
     *  @type CredentialAlignmentObject
     */
    prototype.degreeMajor = null;
    /**
     *  http://purl.org/ctdl/terms/degreeMinor
     *  An optional, secondary field of study of a degree-seeking student.
     *  @property degreeMinor
     *  @type CredentialAlignmentObject
     */
    prototype.degreeMinor = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  http://purl.org/ctdl/terms/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  http://purl.org/ctdl/terms/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  http://purl.org/ctdl/terms/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/financialAssistance
     *  The types of financial assistance for which the resource being described qualifies.
     *  @property financialAssistance
     *  @type FinancialAlignmentObject
     */
    prototype.financialAssistance = null;
    /**
     *  http://purl.org/ctdl/terms/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  http://purl.org/ctdl/terms/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  http://purl.org/ctdl/terms/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type anyURI
     */
    prototype.image = null;
    /**
     *  http://purl.org/ctdl/terms/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  http://purl.org/ctdl/terms/inLanguage
     *  The primary language used in or by the resource being described.
     *  @property inLanguage
     *  @type language
     */
    prototype.inLanguage = null;
    /**
     *  http://purl.org/ctdl/terms/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  http://purl.org/ctdl/terms/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  http://purl.org/ctdl/terms/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRecommendedFor
     *  The resource being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  http://purl.org/ctdl/terms/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  http://purl.org/ctdl/terms/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  http://purl.org/ctdl/terms/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  http://purl.org/ctdl/terms/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  http://purl.org/ctdl/terms/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  http://purl.org/ctdl/terms/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  http://purl.org/ctdl/terms/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  http://purl.org/ctdl/terms/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  http://purl.org/ctdl/terms/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  http://purl.org/ctdl/terms/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  http://purl.org/ctdl/terms/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  http://purl.org/ctdl/terms/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  http://purl.org/ctdl/terms/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  http://purl.org/ctdl/terms/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  http://purl.org/ctdl/terms/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  http://purl.org/ctdl/terms/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  http://purl.org/ctdl/terms/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  http://purl.org/ctdl/terms/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  http://purl.org/ctdl/terms/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  http://purl.org/ctdl/terms/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  http://purl.org/ctdl/terms/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  http://purl.org/ctdl/terms/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  http://purl.org/ctdl/terms/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  http://purl.org/ctdl/terms/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject
     */
    prototype.subject = null;
    /**
     *  http://purl.org/ctdl/terms/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  http://purl.org/ctdl/terms/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  http://purl.org/ctdl/terms/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", degreeConcentration: "CredentialAlignmentObject", degreeMajor: "CredentialAlignmentObject", degreeMinor: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", degreeConcentration: "CredentialAlignmentObject", degreeMajor: "CredentialAlignmentObject", degreeMinor: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "DoctoralDegree";
};
DoctoralDegree = stjs.extend(DoctoralDegree, Degree, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  http://purl.org/ctdl/terms/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  http://purl.org/ctdl/terms/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  http://purl.org/ctdl/terms/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  http://purl.org/ctdl/terms/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  http://purl.org/ctdl/terms/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  http://purl.org/ctdl/terms/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  http://purl.org/ctdl/terms/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  http://purl.org/ctdl/terms/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  http://purl.org/ctdl/terms/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  http://purl.org/ctdl/terms/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  http://purl.org/ctdl/terms/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  http://purl.org/ctdl/terms/commonConditions
     *  The resource being referenced describes a set of common conditions applicable to the resource being described.
     *  @property commonConditions
     *  @type ConditionManifest
     */
    prototype.commonConditions = null;
    /**
     *  http://purl.org/ctdl/terms/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.copyrightHolder = null;
    /**
     *  http://purl.org/ctdl/terms/corequisite
     *  The resource being referenced must be pursued concurrently with the resource being described.
     *  @property corequisite
     *  @type ConditionProfile
     */
    prototype.corequisite = null;
    /**
     *  http://purl.org/ctdl/terms/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  http://purl.org/ctdl/terms/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  http://purl.org/ctdl/terms/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  http://purl.org/ctdl/terms/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type date
     */
    prototype.dateEffective = null;
    /**
     *  http://purl.org/ctdl/terms/degreeConcentration
     *  A structured plan of study within a degree major.
     *  @property degreeConcentration
     *  @type CredentialAlignmentObject
     */
    prototype.degreeConcentration = null;
    /**
     *  http://purl.org/ctdl/terms/degreeMajor
     *  The primary field of study of a degree-seeking student.
     *  @property degreeMajor
     *  @type CredentialAlignmentObject
     */
    prototype.degreeMajor = null;
    /**
     *  http://purl.org/ctdl/terms/degreeMinor
     *  An optional, secondary field of study of a degree-seeking student.
     *  @property degreeMinor
     *  @type CredentialAlignmentObject
     */
    prototype.degreeMinor = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  http://purl.org/ctdl/terms/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  http://purl.org/ctdl/terms/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  http://purl.org/ctdl/terms/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/financialAssistance
     *  The types of financial assistance for which the resource being described qualifies.
     *  @property financialAssistance
     *  @type FinancialAlignmentObject
     */
    prototype.financialAssistance = null;
    /**
     *  http://purl.org/ctdl/terms/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  http://purl.org/ctdl/terms/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  http://purl.org/ctdl/terms/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type anyURI
     */
    prototype.image = null;
    /**
     *  http://purl.org/ctdl/terms/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  http://purl.org/ctdl/terms/inLanguage
     *  The primary language used in or by the resource being described.
     *  @property inLanguage
     *  @type language
     */
    prototype.inLanguage = null;
    /**
     *  http://purl.org/ctdl/terms/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  http://purl.org/ctdl/terms/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  http://purl.org/ctdl/terms/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRecommendedFor
     *  The resource being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  http://purl.org/ctdl/terms/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  http://purl.org/ctdl/terms/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  http://purl.org/ctdl/terms/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  http://purl.org/ctdl/terms/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  http://purl.org/ctdl/terms/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  http://purl.org/ctdl/terms/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  http://purl.org/ctdl/terms/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  http://purl.org/ctdl/terms/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  http://purl.org/ctdl/terms/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  http://purl.org/ctdl/terms/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  http://purl.org/ctdl/terms/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  http://purl.org/ctdl/terms/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  http://purl.org/ctdl/terms/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  http://purl.org/ctdl/terms/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  http://purl.org/ctdl/terms/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  http://purl.org/ctdl/terms/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  http://purl.org/ctdl/terms/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  http://purl.org/ctdl/terms/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  http://purl.org/ctdl/terms/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  http://purl.org/ctdl/terms/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  http://purl.org/ctdl/terms/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  http://purl.org/ctdl/terms/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  http://purl.org/ctdl/terms/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  http://purl.org/ctdl/terms/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject
     */
    prototype.subject = null;
    /**
     *  http://purl.org/ctdl/terms/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  http://purl.org/ctdl/terms/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  http://purl.org/ctdl/terms/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", degreeConcentration: "CredentialAlignmentObject", degreeMajor: "CredentialAlignmentObject", degreeMinor: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", degreeConcentration: "CredentialAlignmentObject", degreeMajor: "CredentialAlignmentObject", degreeMinor: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "SecondarySchoolDiploma";
};
SecondarySchoolDiploma = stjs.extend(SecondarySchoolDiploma, Diploma, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  http://purl.org/ctdl/terms/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  http://purl.org/ctdl/terms/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  http://purl.org/ctdl/terms/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  http://purl.org/ctdl/terms/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  http://purl.org/ctdl/terms/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  http://purl.org/ctdl/terms/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  http://purl.org/ctdl/terms/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  http://purl.org/ctdl/terms/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  http://purl.org/ctdl/terms/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  http://purl.org/ctdl/terms/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  http://purl.org/ctdl/terms/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  http://purl.org/ctdl/terms/commonConditions
     *  The resource being referenced describes a set of common conditions applicable to the resource being described.
     *  @property commonConditions
     *  @type ConditionManifest
     */
    prototype.commonConditions = null;
    /**
     *  http://purl.org/ctdl/terms/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.copyrightHolder = null;
    /**
     *  http://purl.org/ctdl/terms/corequisite
     *  The resource being referenced must be pursued concurrently with the resource being described.
     *  @property corequisite
     *  @type ConditionProfile
     */
    prototype.corequisite = null;
    /**
     *  http://purl.org/ctdl/terms/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  http://purl.org/ctdl/terms/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  http://purl.org/ctdl/terms/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  http://purl.org/ctdl/terms/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type date
     */
    prototype.dateEffective = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  http://purl.org/ctdl/terms/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  http://purl.org/ctdl/terms/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  http://purl.org/ctdl/terms/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/financialAssistance
     *  The types of financial assistance for which the resource being described qualifies.
     *  @property financialAssistance
     *  @type FinancialAlignmentObject
     */
    prototype.financialAssistance = null;
    /**
     *  http://purl.org/ctdl/terms/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  http://purl.org/ctdl/terms/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  http://purl.org/ctdl/terms/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type anyURI
     */
    prototype.image = null;
    /**
     *  http://purl.org/ctdl/terms/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  http://purl.org/ctdl/terms/inLanguage
     *  The primary language used in or by the resource being described.
     *  @property inLanguage
     *  @type language
     */
    prototype.inLanguage = null;
    /**
     *  http://purl.org/ctdl/terms/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  http://purl.org/ctdl/terms/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  http://purl.org/ctdl/terms/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRecommendedFor
     *  The resource being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  http://purl.org/ctdl/terms/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  http://purl.org/ctdl/terms/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  http://purl.org/ctdl/terms/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  http://purl.org/ctdl/terms/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  http://purl.org/ctdl/terms/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  http://purl.org/ctdl/terms/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  http://purl.org/ctdl/terms/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  http://purl.org/ctdl/terms/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  http://purl.org/ctdl/terms/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  http://purl.org/ctdl/terms/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  http://purl.org/ctdl/terms/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  http://purl.org/ctdl/terms/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  http://purl.org/ctdl/terms/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  http://purl.org/ctdl/terms/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  http://purl.org/ctdl/terms/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  http://purl.org/ctdl/terms/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  http://purl.org/ctdl/terms/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  http://purl.org/ctdl/terms/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  http://purl.org/ctdl/terms/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  http://purl.org/ctdl/terms/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  http://purl.org/ctdl/terms/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  http://purl.org/ctdl/terms/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  http://purl.org/ctdl/terms/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  http://purl.org/ctdl/terms/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject
     */
    prototype.subject = null;
    /**
     *  http://purl.org/ctdl/terms/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  http://purl.org/ctdl/terms/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  http://purl.org/ctdl/terms/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "GeneralEducationDevelopment";
};
GeneralEducationDevelopment = stjs.extend(GeneralEducationDevelopment, Diploma, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  http://purl.org/ctdl/terms/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  http://purl.org/ctdl/terms/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  http://purl.org/ctdl/terms/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  http://purl.org/ctdl/terms/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  http://purl.org/ctdl/terms/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  http://purl.org/ctdl/terms/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  http://purl.org/ctdl/terms/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  http://purl.org/ctdl/terms/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  http://purl.org/ctdl/terms/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  http://purl.org/ctdl/terms/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  http://purl.org/ctdl/terms/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  http://purl.org/ctdl/terms/commonConditions
     *  The resource being referenced describes a set of common conditions applicable to the resource being described.
     *  @property commonConditions
     *  @type ConditionManifest
     */
    prototype.commonConditions = null;
    /**
     *  http://purl.org/ctdl/terms/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.copyrightHolder = null;
    /**
     *  http://purl.org/ctdl/terms/corequisite
     *  The resource being referenced must be pursued concurrently with the resource being described.
     *  @property corequisite
     *  @type ConditionProfile
     */
    prototype.corequisite = null;
    /**
     *  http://purl.org/ctdl/terms/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  http://purl.org/ctdl/terms/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  http://purl.org/ctdl/terms/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  http://purl.org/ctdl/terms/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type date
     */
    prototype.dateEffective = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  http://purl.org/ctdl/terms/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  http://purl.org/ctdl/terms/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  http://purl.org/ctdl/terms/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/financialAssistance
     *  The types of financial assistance for which the resource being described qualifies.
     *  @property financialAssistance
     *  @type FinancialAlignmentObject
     */
    prototype.financialAssistance = null;
    /**
     *  http://purl.org/ctdl/terms/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  http://purl.org/ctdl/terms/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  http://purl.org/ctdl/terms/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type anyURI
     */
    prototype.image = null;
    /**
     *  http://purl.org/ctdl/terms/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  http://purl.org/ctdl/terms/inLanguage
     *  The primary language used in or by the resource being described.
     *  @property inLanguage
     *  @type language
     */
    prototype.inLanguage = null;
    /**
     *  http://purl.org/ctdl/terms/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  http://purl.org/ctdl/terms/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  http://purl.org/ctdl/terms/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRecommendedFor
     *  The resource being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  http://purl.org/ctdl/terms/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  http://purl.org/ctdl/terms/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  http://purl.org/ctdl/terms/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  http://purl.org/ctdl/terms/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  http://purl.org/ctdl/terms/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  http://purl.org/ctdl/terms/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  http://purl.org/ctdl/terms/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  http://purl.org/ctdl/terms/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  http://purl.org/ctdl/terms/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  http://purl.org/ctdl/terms/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  http://purl.org/ctdl/terms/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  http://purl.org/ctdl/terms/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  http://purl.org/ctdl/terms/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  http://purl.org/ctdl/terms/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  http://purl.org/ctdl/terms/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  http://purl.org/ctdl/terms/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  http://purl.org/ctdl/terms/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  http://purl.org/ctdl/terms/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  http://purl.org/ctdl/terms/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  http://purl.org/ctdl/terms/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  http://purl.org/ctdl/terms/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  http://purl.org/ctdl/terms/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  http://purl.org/ctdl/terms/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  http://purl.org/ctdl/terms/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject
     */
    prototype.subject = null;
    /**
     *  http://purl.org/ctdl/terms/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  http://purl.org/ctdl/terms/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  http://purl.org/ctdl/terms/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "ApprenticeshipCertificate";
};
ApprenticeshipCertificate = stjs.extend(ApprenticeshipCertificate, Certificate, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  http://purl.org/ctdl/terms/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  http://purl.org/ctdl/terms/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  http://purl.org/ctdl/terms/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  http://purl.org/ctdl/terms/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  http://purl.org/ctdl/terms/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  http://purl.org/ctdl/terms/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  http://purl.org/ctdl/terms/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  http://purl.org/ctdl/terms/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  http://purl.org/ctdl/terms/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  http://purl.org/ctdl/terms/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  http://purl.org/ctdl/terms/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  http://purl.org/ctdl/terms/commonConditions
     *  The resource being referenced describes a set of common conditions applicable to the resource being described.
     *  @property commonConditions
     *  @type ConditionManifest
     */
    prototype.commonConditions = null;
    /**
     *  http://purl.org/ctdl/terms/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.copyrightHolder = null;
    /**
     *  http://purl.org/ctdl/terms/corequisite
     *  The resource being referenced must be pursued concurrently with the resource being described.
     *  @property corequisite
     *  @type ConditionProfile
     */
    prototype.corequisite = null;
    /**
     *  http://purl.org/ctdl/terms/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  http://purl.org/ctdl/terms/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  http://purl.org/ctdl/terms/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  http://purl.org/ctdl/terms/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type date
     */
    prototype.dateEffective = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  http://purl.org/ctdl/terms/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  http://purl.org/ctdl/terms/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  http://purl.org/ctdl/terms/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/financialAssistance
     *  The types of financial assistance for which the resource being described qualifies.
     *  @property financialAssistance
     *  @type FinancialAlignmentObject
     */
    prototype.financialAssistance = null;
    /**
     *  http://purl.org/ctdl/terms/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  http://purl.org/ctdl/terms/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  http://purl.org/ctdl/terms/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type anyURI
     */
    prototype.image = null;
    /**
     *  http://purl.org/ctdl/terms/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  http://purl.org/ctdl/terms/inLanguage
     *  The primary language used in or by the resource being described.
     *  @property inLanguage
     *  @type language
     */
    prototype.inLanguage = null;
    /**
     *  http://purl.org/ctdl/terms/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  http://purl.org/ctdl/terms/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  http://purl.org/ctdl/terms/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRecommendedFor
     *  The resource being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  http://purl.org/ctdl/terms/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  http://purl.org/ctdl/terms/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  http://purl.org/ctdl/terms/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  http://purl.org/ctdl/terms/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  http://purl.org/ctdl/terms/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  http://purl.org/ctdl/terms/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  http://purl.org/ctdl/terms/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  http://purl.org/ctdl/terms/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  http://purl.org/ctdl/terms/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  http://purl.org/ctdl/terms/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  http://purl.org/ctdl/terms/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  http://purl.org/ctdl/terms/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  http://purl.org/ctdl/terms/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  http://purl.org/ctdl/terms/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  http://purl.org/ctdl/terms/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  http://purl.org/ctdl/terms/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  http://purl.org/ctdl/terms/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  http://purl.org/ctdl/terms/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  http://purl.org/ctdl/terms/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  http://purl.org/ctdl/terms/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  http://purl.org/ctdl/terms/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  http://purl.org/ctdl/terms/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  http://purl.org/ctdl/terms/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  http://purl.org/ctdl/terms/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject
     */
    prototype.subject = null;
    /**
     *  http://purl.org/ctdl/terms/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  http://purl.org/ctdl/terms/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  http://purl.org/ctdl/terms/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "DigitalBadge";
};
DigitalBadge = stjs.extend(DigitalBadge, Badge, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  http://purl.org/ctdl/terms/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  http://purl.org/ctdl/terms/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  http://purl.org/ctdl/terms/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  http://purl.org/ctdl/terms/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  http://purl.org/ctdl/terms/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  http://purl.org/ctdl/terms/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  http://purl.org/ctdl/terms/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  http://purl.org/ctdl/terms/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  http://purl.org/ctdl/terms/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  http://purl.org/ctdl/terms/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  http://purl.org/ctdl/terms/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  http://purl.org/ctdl/terms/commonConditions
     *  The resource being referenced describes a set of common conditions applicable to the resource being described.
     *  @property commonConditions
     *  @type ConditionManifest
     */
    prototype.commonConditions = null;
    /**
     *  http://purl.org/ctdl/terms/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.copyrightHolder = null;
    /**
     *  http://purl.org/ctdl/terms/corequisite
     *  The resource being referenced must be pursued concurrently with the resource being described.
     *  @property corequisite
     *  @type ConditionProfile
     */
    prototype.corequisite = null;
    /**
     *  http://purl.org/ctdl/terms/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  http://purl.org/ctdl/terms/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  http://purl.org/ctdl/terms/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  http://purl.org/ctdl/terms/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type date
     */
    prototype.dateEffective = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  http://purl.org/ctdl/terms/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  http://purl.org/ctdl/terms/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  http://purl.org/ctdl/terms/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/financialAssistance
     *  The types of financial assistance for which the resource being described qualifies.
     *  @property financialAssistance
     *  @type FinancialAlignmentObject
     */
    prototype.financialAssistance = null;
    /**
     *  http://purl.org/ctdl/terms/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  http://purl.org/ctdl/terms/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  http://purl.org/ctdl/terms/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type anyURI
     */
    prototype.image = null;
    /**
     *  http://purl.org/ctdl/terms/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  http://purl.org/ctdl/terms/inLanguage
     *  The primary language used in or by the resource being described.
     *  @property inLanguage
     *  @type language
     */
    prototype.inLanguage = null;
    /**
     *  http://purl.org/ctdl/terms/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  http://purl.org/ctdl/terms/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  http://purl.org/ctdl/terms/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRecommendedFor
     *  The resource being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  http://purl.org/ctdl/terms/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  http://purl.org/ctdl/terms/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  http://purl.org/ctdl/terms/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  http://purl.org/ctdl/terms/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  http://purl.org/ctdl/terms/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  http://purl.org/ctdl/terms/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  http://purl.org/ctdl/terms/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  http://purl.org/ctdl/terms/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  http://purl.org/ctdl/terms/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  http://purl.org/ctdl/terms/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  http://purl.org/ctdl/terms/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  http://purl.org/ctdl/terms/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  http://purl.org/ctdl/terms/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  http://purl.org/ctdl/terms/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  http://purl.org/ctdl/terms/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  http://purl.org/ctdl/terms/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  http://purl.org/ctdl/terms/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  http://purl.org/ctdl/terms/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  http://purl.org/ctdl/terms/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  http://purl.org/ctdl/terms/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  http://purl.org/ctdl/terms/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  http://purl.org/ctdl/terms/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  http://purl.org/ctdl/terms/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  http://purl.org/ctdl/terms/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject
     */
    prototype.subject = null;
    /**
     *  http://purl.org/ctdl/terms/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  http://purl.org/ctdl/terms/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  http://purl.org/ctdl/terms/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "OpenBadge";
};
OpenBadge = stjs.extend(OpenBadge, Badge, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  http://purl.org/ctdl/terms/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  http://purl.org/ctdl/terms/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  http://purl.org/ctdl/terms/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  http://purl.org/ctdl/terms/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  http://purl.org/ctdl/terms/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  http://purl.org/ctdl/terms/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  http://purl.org/ctdl/terms/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  http://purl.org/ctdl/terms/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  http://purl.org/ctdl/terms/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  http://purl.org/ctdl/terms/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  http://purl.org/ctdl/terms/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  http://purl.org/ctdl/terms/commonConditions
     *  The resource being referenced describes a set of common conditions applicable to the resource being described.
     *  @property commonConditions
     *  @type ConditionManifest
     */
    prototype.commonConditions = null;
    /**
     *  http://purl.org/ctdl/terms/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.copyrightHolder = null;
    /**
     *  http://purl.org/ctdl/terms/corequisite
     *  The resource being referenced must be pursued concurrently with the resource being described.
     *  @property corequisite
     *  @type ConditionProfile
     */
    prototype.corequisite = null;
    /**
     *  http://purl.org/ctdl/terms/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  http://purl.org/ctdl/terms/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  http://purl.org/ctdl/terms/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  http://purl.org/ctdl/terms/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type date
     */
    prototype.dateEffective = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  http://purl.org/ctdl/terms/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  http://purl.org/ctdl/terms/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  http://purl.org/ctdl/terms/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/financialAssistance
     *  The types of financial assistance for which the resource being described qualifies.
     *  @property financialAssistance
     *  @type FinancialAlignmentObject
     */
    prototype.financialAssistance = null;
    /**
     *  http://purl.org/ctdl/terms/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  http://purl.org/ctdl/terms/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  http://purl.org/ctdl/terms/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type anyURI
     */
    prototype.image = null;
    /**
     *  http://purl.org/ctdl/terms/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  http://purl.org/ctdl/terms/inLanguage
     *  The primary language used in or by the resource being described.
     *  @property inLanguage
     *  @type language
     */
    prototype.inLanguage = null;
    /**
     *  http://purl.org/ctdl/terms/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  http://purl.org/ctdl/terms/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  http://purl.org/ctdl/terms/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRecommendedFor
     *  The resource being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  http://purl.org/ctdl/terms/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  http://purl.org/ctdl/terms/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  http://purl.org/ctdl/terms/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  http://purl.org/ctdl/terms/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  http://purl.org/ctdl/terms/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  http://purl.org/ctdl/terms/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  http://purl.org/ctdl/terms/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  http://purl.org/ctdl/terms/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  http://purl.org/ctdl/terms/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  http://purl.org/ctdl/terms/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  http://purl.org/ctdl/terms/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  http://purl.org/ctdl/terms/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  http://purl.org/ctdl/terms/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  http://purl.org/ctdl/terms/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  http://purl.org/ctdl/terms/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  http://purl.org/ctdl/terms/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  http://purl.org/ctdl/terms/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  http://purl.org/ctdl/terms/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  http://purl.org/ctdl/terms/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  http://purl.org/ctdl/terms/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  http://purl.org/ctdl/terms/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  http://purl.org/ctdl/terms/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  http://purl.org/ctdl/terms/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  http://purl.org/ctdl/terms/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject
     */
    prototype.subject = null;
    /**
     *  http://purl.org/ctdl/terms/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  http://purl.org/ctdl/terms/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  http://purl.org/ctdl/terms/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "ProfessionalDoctorate";
};
ProfessionalDoctorate = stjs.extend(ProfessionalDoctorate, DoctoralDegree, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  http://purl.org/ctdl/terms/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  http://purl.org/ctdl/terms/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  http://purl.org/ctdl/terms/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  http://purl.org/ctdl/terms/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  http://purl.org/ctdl/terms/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  http://purl.org/ctdl/terms/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  http://purl.org/ctdl/terms/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  http://purl.org/ctdl/terms/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  http://purl.org/ctdl/terms/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  http://purl.org/ctdl/terms/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  http://purl.org/ctdl/terms/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  http://purl.org/ctdl/terms/commonConditions
     *  The resource being referenced describes a set of common conditions applicable to the resource being described.
     *  @property commonConditions
     *  @type ConditionManifest
     */
    prototype.commonConditions = null;
    /**
     *  http://purl.org/ctdl/terms/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.copyrightHolder = null;
    /**
     *  http://purl.org/ctdl/terms/corequisite
     *  The resource being referenced must be pursued concurrently with the resource being described.
     *  @property corequisite
     *  @type ConditionProfile
     */
    prototype.corequisite = null;
    /**
     *  http://purl.org/ctdl/terms/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  http://purl.org/ctdl/terms/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  http://purl.org/ctdl/terms/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  http://purl.org/ctdl/terms/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type date
     */
    prototype.dateEffective = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  http://purl.org/ctdl/terms/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  http://purl.org/ctdl/terms/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  http://purl.org/ctdl/terms/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/financialAssistance
     *  The types of financial assistance for which the resource being described qualifies.
     *  @property financialAssistance
     *  @type FinancialAlignmentObject
     */
    prototype.financialAssistance = null;
    /**
     *  http://purl.org/ctdl/terms/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  http://purl.org/ctdl/terms/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  http://purl.org/ctdl/terms/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type anyURI
     */
    prototype.image = null;
    /**
     *  http://purl.org/ctdl/terms/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  http://purl.org/ctdl/terms/inLanguage
     *  The primary language used in or by the resource being described.
     *  @property inLanguage
     *  @type language
     */
    prototype.inLanguage = null;
    /**
     *  http://purl.org/ctdl/terms/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  http://purl.org/ctdl/terms/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  http://purl.org/ctdl/terms/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRecommendedFor
     *  The resource being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  http://purl.org/ctdl/terms/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  http://purl.org/ctdl/terms/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  http://purl.org/ctdl/terms/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  http://purl.org/ctdl/terms/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  http://purl.org/ctdl/terms/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  http://purl.org/ctdl/terms/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  http://purl.org/ctdl/terms/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  http://purl.org/ctdl/terms/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  http://purl.org/ctdl/terms/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  http://purl.org/ctdl/terms/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  http://purl.org/ctdl/terms/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  http://purl.org/ctdl/terms/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  http://purl.org/ctdl/terms/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  http://purl.org/ctdl/terms/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  http://purl.org/ctdl/terms/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  http://purl.org/ctdl/terms/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  http://purl.org/ctdl/terms/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  http://purl.org/ctdl/terms/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  http://purl.org/ctdl/terms/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  http://purl.org/ctdl/terms/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  http://purl.org/ctdl/terms/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  http://purl.org/ctdl/terms/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  http://purl.org/ctdl/terms/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  http://purl.org/ctdl/terms/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject
     */
    prototype.subject = null;
    /**
     *  http://purl.org/ctdl/terms/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  http://purl.org/ctdl/terms/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  http://purl.org/ctdl/terms/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", degreeConcentration: "CredentialAlignmentObject", degreeMajor: "CredentialAlignmentObject", degreeMinor: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", degreeConcentration: "CredentialAlignmentObject", degreeMajor: "CredentialAlignmentObject", degreeMinor: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "ResearchDoctorate";
};
ResearchDoctorate = stjs.extend(ResearchDoctorate, DoctoralDegree, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  http://purl.org/ctdl/terms/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  http://purl.org/ctdl/terms/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  http://purl.org/ctdl/terms/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  http://purl.org/ctdl/terms/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  http://purl.org/ctdl/terms/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  http://purl.org/ctdl/terms/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  http://purl.org/ctdl/terms/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  http://purl.org/ctdl/terms/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  http://purl.org/ctdl/terms/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  http://purl.org/ctdl/terms/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  http://purl.org/ctdl/terms/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  http://purl.org/ctdl/terms/commonConditions
     *  The resource being referenced describes a set of common conditions applicable to the resource being described.
     *  @property commonConditions
     *  @type ConditionManifest
     */
    prototype.commonConditions = null;
    /**
     *  http://purl.org/ctdl/terms/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.copyrightHolder = null;
    /**
     *  http://purl.org/ctdl/terms/corequisite
     *  The resource being referenced must be pursued concurrently with the resource being described.
     *  @property corequisite
     *  @type ConditionProfile
     */
    prototype.corequisite = null;
    /**
     *  http://purl.org/ctdl/terms/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  http://purl.org/ctdl/terms/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  http://purl.org/ctdl/terms/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  http://purl.org/ctdl/terms/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type date
     */
    prototype.dateEffective = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  http://purl.org/ctdl/terms/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  http://purl.org/ctdl/terms/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  http://purl.org/ctdl/terms/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/financialAssistance
     *  The types of financial assistance for which the resource being described qualifies.
     *  @property financialAssistance
     *  @type FinancialAlignmentObject
     */
    prototype.financialAssistance = null;
    /**
     *  http://purl.org/ctdl/terms/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  http://purl.org/ctdl/terms/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  http://purl.org/ctdl/terms/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type anyURI
     */
    prototype.image = null;
    /**
     *  http://purl.org/ctdl/terms/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  http://purl.org/ctdl/terms/inLanguage
     *  The primary language used in or by the resource being described.
     *  @property inLanguage
     *  @type language
     */
    prototype.inLanguage = null;
    /**
     *  http://purl.org/ctdl/terms/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  http://purl.org/ctdl/terms/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  http://purl.org/ctdl/terms/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRecommendedFor
     *  The resource being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  http://purl.org/ctdl/terms/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  http://purl.org/ctdl/terms/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  http://purl.org/ctdl/terms/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  http://purl.org/ctdl/terms/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  http://purl.org/ctdl/terms/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  http://purl.org/ctdl/terms/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  http://purl.org/ctdl/terms/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  http://purl.org/ctdl/terms/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  http://purl.org/ctdl/terms/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  http://purl.org/ctdl/terms/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  http://purl.org/ctdl/terms/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  http://purl.org/ctdl/terms/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  http://purl.org/ctdl/terms/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  http://purl.org/ctdl/terms/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  http://purl.org/ctdl/terms/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  http://purl.org/ctdl/terms/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  http://purl.org/ctdl/terms/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  http://purl.org/ctdl/terms/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  http://purl.org/ctdl/terms/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  http://purl.org/ctdl/terms/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  http://purl.org/ctdl/terms/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  http://purl.org/ctdl/terms/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  http://purl.org/ctdl/terms/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  http://purl.org/ctdl/terms/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject
     */
    prototype.subject = null;
    /**
     *  http://purl.org/ctdl/terms/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  http://purl.org/ctdl/terms/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  http://purl.org/ctdl/terms/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", degreeConcentration: "CredentialAlignmentObject", degreeMajor: "CredentialAlignmentObject", degreeMinor: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", degreeConcentration: "CredentialAlignmentObject", degreeMajor: "CredentialAlignmentObject", degreeMinor: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "JourneymanCertificate";
};
JourneymanCertificate = stjs.extend(JourneymanCertificate, ApprenticeshipCertificate, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  http://purl.org/ctdl/terms/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  http://purl.org/ctdl/terms/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  http://purl.org/ctdl/terms/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  http://purl.org/ctdl/terms/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  http://purl.org/ctdl/terms/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  http://purl.org/ctdl/terms/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  http://purl.org/ctdl/terms/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  http://purl.org/ctdl/terms/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  http://purl.org/ctdl/terms/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  http://purl.org/ctdl/terms/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  http://purl.org/ctdl/terms/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  http://purl.org/ctdl/terms/commonConditions
     *  The resource being referenced describes a set of common conditions applicable to the resource being described.
     *  @property commonConditions
     *  @type ConditionManifest
     */
    prototype.commonConditions = null;
    /**
     *  http://purl.org/ctdl/terms/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.copyrightHolder = null;
    /**
     *  http://purl.org/ctdl/terms/corequisite
     *  The resource being referenced must be pursued concurrently with the resource being described.
     *  @property corequisite
     *  @type ConditionProfile
     */
    prototype.corequisite = null;
    /**
     *  http://purl.org/ctdl/terms/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  http://purl.org/ctdl/terms/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  http://purl.org/ctdl/terms/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  http://purl.org/ctdl/terms/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type date
     */
    prototype.dateEffective = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  http://purl.org/ctdl/terms/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  http://purl.org/ctdl/terms/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  http://purl.org/ctdl/terms/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/financialAssistance
     *  The types of financial assistance for which the resource being described qualifies.
     *  @property financialAssistance
     *  @type FinancialAlignmentObject
     */
    prototype.financialAssistance = null;
    /**
     *  http://purl.org/ctdl/terms/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  http://purl.org/ctdl/terms/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  http://purl.org/ctdl/terms/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type anyURI
     */
    prototype.image = null;
    /**
     *  http://purl.org/ctdl/terms/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  http://purl.org/ctdl/terms/inLanguage
     *  The primary language used in or by the resource being described.
     *  @property inLanguage
     *  @type language
     */
    prototype.inLanguage = null;
    /**
     *  http://purl.org/ctdl/terms/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  http://purl.org/ctdl/terms/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  http://purl.org/ctdl/terms/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRecommendedFor
     *  The resource being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  http://purl.org/ctdl/terms/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  http://purl.org/ctdl/terms/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  http://purl.org/ctdl/terms/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  http://purl.org/ctdl/terms/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  http://purl.org/ctdl/terms/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  http://purl.org/ctdl/terms/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  http://purl.org/ctdl/terms/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  http://purl.org/ctdl/terms/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  http://purl.org/ctdl/terms/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  http://purl.org/ctdl/terms/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  http://purl.org/ctdl/terms/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  http://purl.org/ctdl/terms/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  http://purl.org/ctdl/terms/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  http://purl.org/ctdl/terms/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  http://purl.org/ctdl/terms/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  http://purl.org/ctdl/terms/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  http://purl.org/ctdl/terms/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  http://purl.org/ctdl/terms/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  http://purl.org/ctdl/terms/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  http://purl.org/ctdl/terms/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  http://purl.org/ctdl/terms/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  http://purl.org/ctdl/terms/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  http://purl.org/ctdl/terms/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  http://purl.org/ctdl/terms/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject
     */
    prototype.subject = null;
    /**
     *  http://purl.org/ctdl/terms/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  http://purl.org/ctdl/terms/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  http://purl.org/ctdl/terms/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    this.context = "http://schema.eduworks.com/simpleCtdl";
    this.type = "MasterCertificate";
};
MasterCertificate = stjs.extend(MasterCertificate, ApprenticeshipCertificate, [], function(constructor, prototype) {
    /**
     *  http://purl.org/ctdl/terms/accreditedBy
     *  An agent that accredits the described resource.
     *  @property accreditedBy
     *  @type QACredentialOrganization
     */
    prototype.accreditedBy = null;
    /**
     *  http://purl.org/ctdl/terms/accreditedIn
     *  The resource being described is accredited in the jurisdiction being referenced.
     *  @property accreditedIn
     *  @type JurisdictionProfile
     */
    prototype.accreditedIn = null;
    /**
     *  http://purl.org/ctdl/terms/administrationProcess
     *  A profile of the process by which the resource being described, or aspects of it, are administered.
     *  @property administrationProcess
     *  @type ProcessProfile
     */
    prototype.administrationProcess = null;
    /**
     *  http://purl.org/ctdl/terms/advancedStandingFrom
     *  The resource being described has time or cost reduced by the resource being referenced.
     *  @property advancedStandingFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.advancedStandingFrom = null;
    /**
     *  http://purl.org/ctdl/terms/alternateName
     *  An alias for the item.
     *  @property alternateName
     *  @type Literal
     */
    prototype.alternateName = null;
    /**
     *  http://purl.org/ctdl/terms/approvedBy
     *  Pronouncement of a favorable judgment by the agent being referenced.
     *  @property approvedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.approvedBy = null;
    /**
     *  http://purl.org/ctdl/terms/approvedIn
     *  The resource being described is approved in the jurisdiction being referenced.
     *  @property approvedIn
     *  @type JurisdictionProfile
     */
    prototype.approvedIn = null;
    /**
     *  http://purl.org/ctdl/terms/audienceLevelType
     *  A point in a progression through an educational or training context, for which the described resource is intended.
     *  @property audienceLevelType
     *  @type CredentialAlignmentObject
     */
    prototype.audienceLevelType = null;
    /**
     *  http://purl.org/ctdl/terms/availabilityListing
     *  A resource that lists online and/or physical locations for the described resource.
     *  @property availabilityListing
     *  @type anyURI
     */
    prototype.availabilityListing = null;
    /**
     *  http://purl.org/ctdl/terms/availableAt
     *  The location where the described resource is available.
     *  @property availableAt
     *  @type GeoCoordinates
     */
    prototype.availableAt = null;
    /**
     *  http://purl.org/ctdl/terms/availableOnlineAt
     *  The online location where the described resource is available.
     *  @property availableOnlineAt
     *  @type anyURI
     */
    prototype.availableOnlineAt = null;
    /**
     *  http://purl.org/ctdl/terms/broadAlignment
     *  The resource being referenced covers all of the relevant concepts in the resource being described as well as relevant concepts not found in the resource being described.
     *  @property broadAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.broadAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/codedNotation
     *  A short set of alpha-numeric symbols that uniquely identifies a resource and supports its discovery.
     *  @property codedNotation
     *  @type Literal
     */
    prototype.codedNotation = null;
    /**
     *  http://purl.org/ctdl/terms/commonConditions
     *  The resource being referenced describes a set of common conditions applicable to the resource being described.
     *  @property commonConditions
     *  @type ConditionManifest
     */
    prototype.commonConditions = null;
    /**
     *  http://purl.org/ctdl/terms/copyrightHolder
     *  The party holding the legal copyright to the CreativeWork.
     *  @property copyrightHolder
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.copyrightHolder = null;
    /**
     *  http://purl.org/ctdl/terms/corequisite
     *  The resource being referenced must be pursued concurrently with the resource being described.
     *  @property corequisite
     *  @type ConditionProfile
     */
    prototype.corequisite = null;
    /**
     *  http://purl.org/ctdl/terms/credentialId
     *  A globally unique identifier by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property credentialId
     *  @type Literal
     */
    prototype.credentialId = null;
    /**
     *  http://purl.org/ctdl/terms/credentialStatusType
     *  The status of the credential.
     *  @property credentialStatusType
     *  @type CredentialAlignmentObject
     */
    prototype.credentialStatusType = null;
    /**
     *  http://purl.org/ctdl/terms/ctid
     *  A globally unique Credential Transparency Identifier (CTID) issued by the Credential Registry Service (CRS) by which the creator/owner/provider of a credential recognizes the credential in transactions with the external environment (e.g., in verifiable claims involving the credential).
     *  @property ctid
     *  @type Literal
     */
    prototype.ctid = null;
    /**
     *  http://purl.org/ctdl/terms/dateEffective
     *  The effective date of the described resource content.
     *  @property dateEffective
     *  @type date
     */
    prototype.dateEffective = null;
    /**
     *  http://purl.org/ctdl/terms/description
     *  A short description of the resource being described.
     *  @property description
     *  @type Literal
     */
    prototype.description = null;
    /**
     *  http://purl.org/ctdl/terms/developmentProcess
     *  A profile of the process by which the resource being described, or aspects of it, were created.
     *  @property developmentProcess
     *  @type ProcessProfile
     */
    prototype.developmentProcess = null;
    /**
     *  http://purl.org/ctdl/terms/earnings
     *  The resource being referenced is a profile of credential holder earnings data
     *  @property earnings
     *  @type EarningsProfile
     */
    prototype.earnings = null;
    /**
     *  http://purl.org/ctdl/terms/employmentOutcome
     *  A profile of jobs obtained with this credential by occupation and industry for a given period and area.
     *  @property employmentOutcome
     *  @type EmploymentOutcomeProfile
     */
    prototype.employmentOutcome = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedCost
     *  The estimated cost of the described resource.
     *  @property estimatedCost
     *  @type CostProfile
     */
    prototype.estimatedCost = null;
    /**
     *  http://purl.org/ctdl/terms/estimatedDuration
     *  The estimated time it will take to complete the described activity.
     *  @property estimatedDuration
     *  @type DurationProfile
     */
    prototype.estimatedDuration = null;
    /**
     *  http://purl.org/ctdl/terms/exactAlignment
     *  The relevant concepts in the resources being compared are coextensive.
     *  @property exactAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.exactAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/financialAssistance
     *  The types of financial assistance for which the resource being described qualifies.
     *  @property financialAssistance
     *  @type FinancialAlignmentObject
     */
    prototype.financialAssistance = null;
    /**
     *  http://purl.org/ctdl/terms/hasPart
     *  Indicates a resource that is (in some sense) a part of the resource being described.
     *  @property hasPart
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.hasPart = null;
    /**
     *  http://purl.org/ctdl/terms/holders
     *  A profile of the number and characteristics of credentialed individuals and their geographic locations.
     *  @property holders
     *  @type HoldersProfile
     */
    prototype.holders = null;
    /**
     *  http://purl.org/ctdl/terms/image
     *  The image or icon that represents the resource.
     *  @property image
     *  @type anyURI
     */
    prototype.image = null;
    /**
     *  http://purl.org/ctdl/terms/industryType
     *  The class identifier for the industry context from an established framework.
     *  @property industryType
     *  @type CredentialAlignmentObject
     */
    prototype.industryType = null;
    /**
     *  http://purl.org/ctdl/terms/inLanguage
     *  The primary language used in or by the resource being described.
     *  @property inLanguage
     *  @type language
     */
    prototype.inLanguage = null;
    /**
     *  http://purl.org/ctdl/terms/isAdvancedStandingFor
     *  The resource being described reduces time or cost for the resource being referenced.
     *  @property isAdvancedStandingFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isAdvancedStandingFor = null;
    /**
     *  http://purl.org/ctdl/terms/isPartOf
     *  Indicates a resource that the resource being described is (in some sense) part of.
     *  @property isPartOf
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | LearningOpportunityProfile | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPartOf = null;
    /**
     *  http://purl.org/ctdl/terms/isPreparationFor
     *  The resource being described provides preparation for the resource being referenced.
     *  @property isPreparationFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isPreparationFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRecommendedFor
     *  The resource being described is recommended for the resource being referenced.
     *  @property isRecommendedFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRecommendedFor = null;
    /**
     *  http://purl.org/ctdl/terms/isRequiredFor
     *  The resource being described is required for the resource being referenced.
     *  @property isRequiredFor
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.isRequiredFor = null;
    /**
     *  http://purl.org/ctdl/terms/jurisdiction
     *  The geo-political region in which the described resource is applicable.
     *  @property jurisdiction
     *  @type JurisdictionProfile
     */
    prototype.jurisdiction = null;
    /**
     *  http://purl.org/ctdl/terms/keyword
     *  Keywords or key phrases describing aspects of a resource considered useful for its discovery.
     *  @property keyword
     *  @type Literal
     */
    prototype.keyword = null;
    /**
     *  http://purl.org/ctdl/terms/latestVersion
     *  The latest version of the credential being described.
     *  @property latestVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.latestVersion = null;
    /**
     *  http://purl.org/ctdl/terms/maintenanceProcess
     *  The process by which the resource being described is maintained including review and updating.
     *  @property maintenanceProcess
     *  @type ProcessProfile
     */
    prototype.maintenanceProcess = null;
    /**
     *  http://purl.org/ctdl/terms/majorAlignment
     *  There is major overlap of relevant concepts between the two resources being compared.
     *  @property majorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.majorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/maximumDuration
     *  The maximum amount of time it will take to complete the described resource.
     *  @property maximumDuration
     *  @type duration
     */
    prototype.maximumDuration = null;
    /**
     *  http://purl.org/ctdl/terms/minorAlignment
     *  There is minor overlap of relevant concepts between the two resources being compared.
     *  @property minorAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.minorAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/name
     *  The name of the resource being described.
     *  @property name
     *  @type Literal
     */
    prototype.name = null;
    /**
     *  http://purl.org/ctdl/terms/narrowAlignment
     *  The resource being described covers all of the relevant concepts in the referenced resource as well as relevant concepts not found in the referenced resource.
     *  @property narrowAlignment
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.narrowAlignment = null;
    /**
     *  http://purl.org/ctdl/terms/occupationType
     *  The relevant occupation.
     *  @property occupationType
     *  @type CredentialAlignmentObject
     */
    prototype.occupationType = null;
    /**
     *  http://purl.org/ctdl/terms/offeredBy
     *  Access to the described resource is offered by the referenced agent.
     *  @property offeredBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.offeredBy = null;
    /**
     *  http://purl.org/ctdl/terms/offeredIn
     *  The resource being described is offered in the jurisdiction being referenced.
     *  @property offeredIn
     *  @type JurisdictionProfile
     */
    prototype.offeredIn = null;
    /**
     *  http://purl.org/ctdl/terms/ownedBy
     *  An agent that has an enforceable claim or title to a resource.
     *  @property ownedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.ownedBy = null;
    /**
     *  http://purl.org/ctdl/terms/preparationFrom
     *  Preparation for the resource being described is provided by the resource being referenced.
     *  @property preparationFrom
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.preparationFrom = null;
    /**
     *  http://purl.org/ctdl/terms/previousVersion
     *  The version of the credential that immediately precedes the credential being described.
     *  @property previousVersion
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | Credential | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.previousVersion = null;
    /**
     *  http://purl.org/ctdl/terms/processStandards
     *  A resource describing the criteria, standards, and/or requirements used.
     *  @property processStandards
     *  @type anyURI
     */
    prototype.processStandards = null;
    /**
     *  http://purl.org/ctdl/terms/processStandardsDescription
     *  A description of the criteria, standards, and/or requirements used.
     *  @property processStandardsDescription
     *  @type Literal
     */
    prototype.processStandardsDescription = null;
    /**
     *  http://purl.org/ctdl/terms/purposeType
     *  The intended type of application of the credential by the holder.
     *  @property purposeType
     *  @type CredentialAlignmentObject
     */
    prototype.purposeType = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedBy
     *  The agent being referenced acknowledges the validity of the described resource.
     *  @property recognizedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.recognizedBy = null;
    /**
     *  http://purl.org/ctdl/terms/recognizedIn
     *  The resource being described is publicly recommended, acknowledged, or endorsed in the jurisdiction being referenced.
     *  @property recognizedIn
     *  @type JurisdictionProfile
     */
    prototype.recognizedIn = null;
    /**
     *  http://purl.org/ctdl/terms/recommends
     *  The resource being described recommends the resource being referenced.
     *  @property recommends
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.recommends = null;
    /**
     *  http://purl.org/ctdl/terms/region
     *  A geo-political area of the described resource.
     *  @property region
     *  @type GeoCoordinates
     */
    prototype.region = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedBy
     *  The agent being referenced enforces the legal requirements of the referenced resource.
     *  @property regulatedBy
     *  @type QACredentialOrganization
     */
    prototype.regulatedBy = null;
    /**
     *  http://purl.org/ctdl/terms/regulatedIn
     *  The resource being described is regulated in the jurisdiction being referenced.
     *  @property regulatedIn
     *  @type JurisdictionProfile
     */
    prototype.regulatedIn = null;
    /**
     *  http://purl.org/ctdl/terms/relatedAction
     *  An action related to the described resource.
     *  @property relatedAction
     *  @type AccreditAction | AdvancedStandingAction | ApproveAction | CredentialingAction | OfferAction | RecognizeAction | RegulateAction | RenewAction | RevokeAction | RightsAction
     */
    prototype.relatedAction = null;
    /**
     *  http://purl.org/ctdl/terms/renewal
     *  Conditions necessary to maintenance and renewal of an awarded credential.
     *  @property renewal
     *  @type ConditionProfile
     */
    prototype.renewal = null;
    /**
     *  http://purl.org/ctdl/terms/renewedBy
     *  The agent being referenced handles the renewal of awards of the credential being described.
     *  @property renewedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.renewedBy = null;
    /**
     *  http://purl.org/ctdl/terms/renewedIn
     *  The resource being described is renewed in the jurisdiction being referenced.
     *  @property renewedIn
     *  @type JurisdictionProfile
     */
    prototype.renewedIn = null;
    /**
     *  http://purl.org/ctdl/terms/requires
     *  The resource being described requires the resource being referenced.
     *  @property requires
     *  @type ApprenticeshipCertificate | AssociateDegree | BachelorDegree | Badge | Certificate | Certification | ConditionProfile | Credential | CredentialAlignmentObject | Degree | DigitalBadge | Diploma | DoctoralDegree | GeneralEducationDevelopment | JourneymanCertificate | License | MasterCertificate | MasterDegree | MicroCredential | OpenBadge | ProfessionalDoctorate | QualityAssuranceCredential | ResearchDoctorate | SecondarySchoolDiploma
     */
    prototype.requires = null;
    /**
     *  http://purl.org/ctdl/terms/revocation
     *  Processes and criteria for ending (revoking) the validity or operation of an awarded credential.
     *  @property revocation
     *  @type RevocationProfile
     */
    prototype.revocation = null;
    /**
     *  http://purl.org/ctdl/terms/revokedBy
     *  The referenced agent handles the revocation of an awarded credential from the credential holder due to violations.
     *  @property revokedBy
     *  @type CredentialOrganization | CredentialPerson | QACredentialOrganization
     */
    prototype.revokedBy = null;
    /**
     *  http://purl.org/ctdl/terms/revokedIn
     *  The resource being described is revoked in the jurisdiction being referenced.
     *  @property revokedIn
     *  @type JurisdictionProfile
     */
    prototype.revokedIn = null;
    /**
     *  http://purl.org/ctdl/terms/subject
     *  Words or brief phrases describing topicality of a resource.
     *  @property subject
     *  @type CredentialAlignmentObject
     */
    prototype.subject = null;
    /**
     *  http://purl.org/ctdl/terms/subjectWebpage
     *  The web page where the subject of the resource being described is located.
     *  @property subjectWebpage
     *  @type anyURI
     */
    prototype.subjectWebpage = null;
    /**
     *  http://purl.org/ctdl/terms/url
     *  URL of the resource being described.
     *  @property url
     *  @type anyURI
     */
    prototype.url = null;
    /**
     *  http://purl.org/ctdl/terms/versionIdentifier
     *  An alphanumeric identifier of a version of the resource being described that is unique within the organizational context.
     *  @property versionIdentifier
     *  @type IdentifierValue
     */
    prototype.versionIdentifier = null;
}, {accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", accreditedBy: "QACredentialOrganization", accreditedIn: "JurisdictionProfile", administrationProcess: "ProcessProfile", advancedStandingFrom: "Object", approvedBy: "Object", approvedIn: "JurisdictionProfile", audienceLevelType: "CredentialAlignmentObject", availableAt: "GeoCoordinates", broadAlignment: "Object", commonConditions: "ConditionManifest", copyrightHolder: "Object", corequisite: "ConditionProfile", credentialStatusType: "CredentialAlignmentObject", developmentProcess: "ProcessProfile", earnings: "EarningsProfile", employmentOutcome: "EmploymentOutcomeProfile", estimatedCost: "CostProfile", estimatedDuration: "DurationProfile", exactAlignment: "Object", financialAssistance: "FinancialAlignmentObject", hasPart: "Object", holders: "HoldersProfile", industryType: "CredentialAlignmentObject", isAdvancedStandingFor: "Object", isPartOf: "Object", isPreparationFor: "Object", isRecommendedFor: "Object", isRequiredFor: "Object", jurisdiction: "JurisdictionProfile", latestVersion: "Object", maintenanceProcess: "ProcessProfile", majorAlignment: "Object", minorAlignment: "Object", narrowAlignment: "Object", occupationType: "CredentialAlignmentObject", offeredBy: "Object", offeredIn: "JurisdictionProfile", ownedBy: "Object", preparationFrom: "Object", previousVersion: "Object", purposeType: "CredentialAlignmentObject", recognizedBy: "Object", recognizedIn: "JurisdictionProfile", recommends: "Object", region: "GeoCoordinates", regulatedBy: "QACredentialOrganization", regulatedIn: "JurisdictionProfile", relatedAction: "Object", renewal: "ConditionProfile", renewedBy: "Object", renewedIn: "JurisdictionProfile", requires: "Object", revocation: "RevocationProfile", revokedBy: "Object", revokedIn: "JurisdictionProfile", subject: "CredentialAlignmentObject", versionIdentifier: "IdentifierValue", contributor: "Object", reviews: "Review", audience: "Audience", timeRequired: "Duration", publication: "PublicationEvent", contentLocation: "Place", temporalCoverage: "Object", isBasedOn: "Object", fileFormat: "Object", interactionStatistic: "InteractionCounter", recordedAt: "Event", isPartOf: "CreativeWork", exampleOfWork: "CreativeWork", dateCreated: "Object", releasedEvent: "PublicationEvent", publisher: "Object", encoding: "MediaObject", creator: "Object", hasPart: "CreativeWork", license: "Object", translator: "Object", offers: "Offer", schemaVersion: "Object", review: "Review", position: "Object", genre: "Object", character: "Person", producer: "Object", editor: "Person", locationCreated: "Place", about: "Thing", audio: "AudioObject", encodings: "MediaObject", funder: "Object", accountablePerson: "Person", material: "Object", author: "Object", sourceOrganization: "Organization", sponsor: "Object", provider: "Object", copyrightHolder: "Object", comment: "Comment", spatialCoverage: "Place", aggregateRating: "AggregateRating", educationalAlignment: "AlignmentObject", video: "VideoObject", version: "Object", mainEntity: "Thing", associatedMedia: "MediaObject", workExample: "CreativeWork", mentions: "Thing", citation: "Object", dateModified: "Object", inLanguage: "Object", isBasedOnUrl: "Object", identifier: "Object", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
