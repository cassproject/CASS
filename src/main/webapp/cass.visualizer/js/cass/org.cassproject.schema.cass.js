/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
/**
 *  Class used to hold namespace data.
 *  @author fray
 *  @class Cass
 *  @module org.cassproject
 */
var Cass = function() {};
Cass = stjs.extend(Cass, null, [], function(constructor, prototype) {
    constructor.context_0_1 = "http://schema.eduworks.com/cass/0.1";
    constructor.context_0_2 = "http://schema.eduworks.com/cass/0.2";
    constructor.context_0_3 = "http://schema.cassproject.org/0.2";
    constructor.context = "http://schema.cassproject.org/0.2";
}, {}, {});
/**
 *  Competencies include skills, knowledge, abilities, traits, and combinations thereof that are needed to perform a task or job. In CASS, competencies are identified and located using a globally unique ID. Competencies can be further described using titles, descriptions, levels, indicators (coming soon), roll-up rules, and relationships to other competencies.
 *   
 *  @author fritz.ray@eduworks.com
 *  @class Competency
 *  @module org.cassproject
 *  @extends Intangible
 */
var Competency = function() {
    Intangible.call(this);
    this.setContextAndType(Cass.context, Competency.myType);
};
Competency = stjs.extend(Competency, Intangible, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/cass/0.1/competency";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/cass/0.2/competency";
    constructor.TYPE_0_3 = "http://schema.cassproject.org/0.2/Competency";
    constructor.myType = Competency.TYPE_0_3;
    /**
     *  Scope in which the competency may be applied. e.g. Underwater.
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
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(Competency.TYPE_0_3);
        a.push(Competency.TYPE_0_2);
        a.push(Competency.TYPE_0_1);
        return a;
    };
}, {image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  When an individual's performance in a competency can be measured, a level specifies milestones that an individual can reach, creating fine-grained distinction between the proficient and the adept.
 *  @author fritz.ray@eduworks.com
 *  @class Level
 *  @module org.cassproject
 *  @extends Intangible
 */
var Level = function() {
    Intangible.call(this);
    this.setContextAndType(Cass.context, Level.myType);
};
Level = stjs.extend(Level, Intangible, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/cass/0.1/level";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/cass/0.2/level";
    constructor.TYPE_0_3 = "http://schema.cassproject.org/0.2/Level";
    constructor.myType = Level.TYPE_0_3;
    /**
     *  Specifies the URL of the competency this level relates to.
     *  @property competency
     *  @type string(URL) 
     */
    prototype.competency = null;
    /**
     *  The title that one who holds this performance level may assume.
     *  @property title
     *  @type string
     */
    prototype.title = null;
    /**
     *  The performance characteristics required by this level in text form.
     *  TBD: Isn't this what description represents?
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
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(Level.TYPE_0_3);
        a.push(Level.TYPE_0_2);
        a.push(Level.TYPE_0_1);
        return a;
    };
}, {image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  A claim of competence in CASS is called an Assertion. It states with some confidence that an individual has mastered a competency at a given level, provides evidence of such mastery, and records data such as the time of assertion and the party making the assertion.
 *  @author fritz.ray@eduworks.com
 *  @class Assertion
 *  @module org.cassproject
 *  @extends Intangible
 */
var Assertion = function() {
    Intangible.call(this);
    this.setContextAndType(Cass.context, Assertion.myType);
};
Assertion = stjs.extend(Assertion, Intangible, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/cass/0.1/assertion";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/cass/0.2/assertion";
    constructor.TYPE_0_3 = "http://schema.cassproject.org/0.2/Assertion";
    constructor.myType = Assertion.TYPE_0_3;
    /**
     *  URL of the competency.
     *  @property competency
     *  @type string(URL)
     */
    prototype.competency = null;
    /**
     *  URL of the framework within which the assertion is restricted.
     *  @property framework
     *  @type string(URL)
     */
    prototype.framework = null;
    /**
     *  URL of the level, or null if 'held with no performance expectations'.
     *  @property level
     *  @type string
     */
    prototype.level = null;
    /**
     *  Public Key in PEM format of the recipient of the assertion.
     *  @property subject
     *  @type EcEncryptedValue<Public Key PEM>
     */
    prototype.subject = null;
    /**
     *  Public Key in PEM format of the identity making the assertion.
     *  @property agent
     *  @type EcEncryptedValue<Public Key PEM>
     */
    prototype.agent = null;
    /**
     *  Encrypted evidence. May be a string, URL or schema.org/Thing.
     *  @property evidence
     *  @type EcEncryptedValue<string | URL | Thing>[]
     */
    prototype.evidence = null;
    /**
     *  Confidence with which the assertion was made. 
     *  Confidence has many interpretations, one possibility is the probability that the individual could demonstrate the competency again.
     *  @property confidence
     *  @type float [0,1]
     */
    prototype.confidence = null;
    /**
     *  Time that the assertion was made in milliseconds since the Unix Epoch.
     *  @property assertionDate
     *  @type EcEncryptedValue<long>
     */
    prototype.assertionDate = null;
    /**
     *  Time that the assertion expires, specified in milliseconds since the Unix Epoch.
     *  @property expirationDate
     *  @type EcEncryptedValue<long>
     */
    prototype.expirationDate = null;
    /**
     *  Describes the slope of the line from the initial confidence at the assertion date and the expiration date. t is a number between [0,1] representing the percentage of time that has elapsed. Examples include t^2 and ln(t).
     *  @property decayFunction
     *  @type EcEncryptedValue<string>
     */
    prototype.decayFunction = null;
    /**
     *  True if the assertion is a claim that the subject cannot demonstrate the competency.
     *  @property negative
     *  @type EcEncryptedValue<boolean>
     */
    prototype.negative = null;
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
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(Assertion.TYPE_0_3);
        a.push(Assertion.TYPE_0_2);
        a.push(Assertion.TYPE_0_1);
        return a;
    };
}, {subject: "EcEncryptedValue", agent: "EcEncryptedValue", evidence: {name: "Array", arguments: ["EcEncryptedValue"]}, assertionDate: "EcEncryptedValue", expirationDate: "EcEncryptedValue", decayFunction: "EcEncryptedValue", negative: "EcEncryptedValue", image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  A segment of script that defines in a domain specific language how competence is transferred from one competency to another.
 *  
 *  @author fritz.ray@eduworks.com
 *  @class RollupRule
 *  @module org.cassproject
 *  @extends Intangible
 */
var RollupRule = function() {
    Intangible.call(this);
    this.setContextAndType(Cass.context, RollupRule.myType);
};
RollupRule = stjs.extend(RollupRule, Intangible, [], function(constructor, prototype) {
    constructor.TYPE_0_2 = "http://schema.eduworks.com/cass/0.2/rollupRule";
    constructor.TYPE_0_3 = "http://schema.cassproject.org/0.2/RollupRule";
    constructor.myType = RollupRule.TYPE_0_3;
    /**
     *  The rollup rule encoded as source code that is understandable to the assertion processor.
     *  @property rule
     *  @type string
     */
    prototype.rule = null;
    /**
     *  Specifies the URL of the competency that the rollup rule pertains to.
     *  @property competency
     *  @type string
     */
    prototype.competency = null;
    prototype.upgrade = function() {
        EcLinkedData.prototype.upgrade.call(this);
        if (RollupRule.TYPE_0_2.equals(this.getFullType())) {
            this.setContextAndType(Cass.context_0_3, RollupRule.TYPE_0_3);
        }
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(RollupRule.TYPE_0_3);
        a.push(RollupRule.TYPE_0_2);
        return a;
    };
}, {image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  A Competency Framework or simply Framework is a collection of competencies and relations between competencies in the framework and potentially between competencies in the framework and competencies in other frameworks. In practice, a Framework represents competencies related to a specific job, task, organization, career, knowledge domain, etc.
 *  
 *  @author fritz.ray@eduworks.com
 *  @class Framework
 *  @module org.cassproject
 *  @extends Intangible
 */
var Framework = function() {
    Intangible.call(this);
    this.setContextAndType(Cass.context, Framework.myType);
};
Framework = stjs.extend(Framework, Intangible, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/cass/0.1/framework";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/cass/0.2/framework";
    constructor.TYPE_0_3 = "http://schema.cassproject.org/0.2/Framework";
    constructor.myType = Framework.TYPE_0_3;
    /**
     *  URLs of competencies included in this framework.
     *  @property competency
     *  @type string[]
     */
    prototype.competency = null;
    /**
     *  URLs of relations included in this framework.
     *  @property relation
     *  @type string[]
     */
    prototype.relation = null;
    /**
     *  URLs of levels included in this framework.
     *  @property level
     *  @type string[]
     */
    prototype.level = null;
    /**
     *  URLs of RollupRules included in this framework.
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
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(Framework.TYPE_0_3);
        a.push(Framework.TYPE_0_2);
        a.push(Framework.TYPE_0_1);
        return a;
    };
}, {competency: {name: "Array", arguments: [null]}, relation: {name: "Array", arguments: [null]}, level: {name: "Array", arguments: [null]}, rollupRule: {name: "Array", arguments: [null]}, image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  A relation between two objects.
 *  @author fritz.ray@eduworks.com
 *  @class Relation
 *  @module org.cassproject
 *  @extends Intangible
 */
var Relation = function() {
    Intangible.call(this);
    this.setContextAndType(Cass.context, Relation.myType);
};
Relation = stjs.extend(Relation, Intangible, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/cass/0.1/relation";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/cass/0.2/relation";
    constructor.TYPE_0_3 = "http://schema.cassproject.org/0.2/Relation";
    constructor.myType = Relation.TYPE_0_3;
    /**
     *  Relation type when one object enables the capability to obtain another.
     *  Enabling relations do not imply a requirement, but makes the acquisition of the source much easier.
     *  @property IS_ENABLED_BY
     *  @static
     *  @type string
     */
    constructor.IS_ENABLED_BY = "isEnabledBy";
    /**
     *  Relation type when one object requires another.
     *  Requiring relations are strict.
     *  @property REQUIRES
     *  @static
     *  @type string
     */
    constructor.REQUIRES = "requires";
    /**
     *  Relation type when one object desires another.
     *  Desire relations improve the range of applicability or improve performance of the source.
     *  @property DESIRES
     *  @static
     *  @type string
     */
    constructor.DESIRES = "desires";
    /**
     *  Relation type when one object is a subset of another.
     *  Narrows relations are strict, and represent a super/sub relation.
     *  @property NARROWS
     *  @static
     *  @type string
     */
    constructor.NARROWS = "narrows";
    /**
     *  Relation type when one object is related to another.
     *  Related relations provide linkages that do not necessarily carry information.
     *  Related relations are bidirectional.
     *  @property IS_RELATED_TO
     *  @static
     *  @type string
     */
    constructor.IS_RELATED_TO = "isRelatedTo";
    /**
     *  Relation type when one object is equivalent to another.
     *  Equivalent relations define two objects that are effectively equivalent.
     *  Equivalent relations are bidirectional.
     *  @property IS_RELATED_TO
     *  @static
     *  @type string
     */
    constructor.IS_EQUIVALENT_TO = "isEquivalentTo";
    /**
     *  URL of the object at the beginning of the relation.
     *  A <relation> B, this is A.
     *  @property source
     *  @type string(url)
     */
    prototype.source = null;
    /**
     *  URL of the object at the end of the relation.
     *  A <relation> B, this is B.
     *  @property target
     *  @type string(url)
     */
    prototype.target = null;
    /**
     *  URL or controlled vocabulary of the relation.
     *  A <relation> B, this is <relation>.
     *  @property relationType
     *  @type string | URL
     */
    prototype.relationType = null;
    /**
     *  Date time in ISO 8601 format at which the relation may be observed.
     *  @property validFrom
     *  @type string
     */
    prototype.validFrom = null;
    /**
     *  Date time in ISO 8601 format at which the relation may no longer be observed.
     *  @property validThrough
     *  @type string
     */
    prototype.validThrough = null;
    prototype.upgrade = function() {
        EcLinkedData.prototype.upgrade.call(this);
        if ("isEquivalenTo".equals(this.relationType)) 
            this.relationType = Relation.IS_EQUIVALENT_TO;
        if (Relation.TYPE_0_1.equals(this.type)) {
            var me = (this);
            if (me["@context"] == null && me["@schema"] != null) 
                me["@context"] = me["@schema"];
            this.setContextAndType(Cass.context_0_2, Relation.TYPE_0_2);
        }
        if (Relation.TYPE_0_2.equals(this.getFullType())) {
            this.setContextAndType(Cass.context_0_3, Relation.TYPE_0_3);
        }
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(Relation.TYPE_0_3);
        a.push(Relation.TYPE_0_2);
        a.push(Relation.TYPE_0_1);
        return a;
    };
}, {image: "Object", potentialAction: "Action", mainEntityOfPage: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
