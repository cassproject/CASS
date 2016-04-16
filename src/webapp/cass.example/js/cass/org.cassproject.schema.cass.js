/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
var Cass = function() {};
Cass = stjs.extend(Cass, null, [], function(constructor, prototype) {
    constructor.schema = "http://schema.eduworks.com/cass/0.1";
}, {}, {});
var Level = function() {
    Thing.call(this);
    this.schema = Cass.schema;
    this.type = Level.myType;
};
Level = stjs.extend(Level, Thing, [], function(constructor, prototype) {
    constructor.myType = "http://schema.eduworks.com/cass/0.1/level";
    prototype.competency = null;
    prototype.title = null;
    prototype.performance = null;
}, {mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
var Relation = function() {
    Thing.call(this);
    this.schema = Cass.schema;
    this.type = Relation.myType;
};
Relation = stjs.extend(Relation, Thing, [], function(constructor, prototype) {
    constructor.myType = "http://schema.eduworks.com/cass/0.1/relation";
    constructor.IS_ENABLED_BY = "isEnabledBy";
    constructor.REQUIRES = "requires";
    constructor.DESIRES = "desires";
    constructor.IS_RELATED_TO = "isRelatedTo";
    constructor.IS_EQUIVALENT_TO = "isEquivalenTo";
    prototype.source = null;
    prototype.target = null;
    prototype.relationType = null;
    prototype.validFrom = null;
    prototype.validThrough = null;
    prototype.agent = null;
}, {mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
var Source = function() {
    Thing.call(this);
    this.schema = Cass.schema;
    this.type = Source.myType;
};
Source = stjs.extend(Source, Thing, [], function(constructor, prototype) {
    constructor.myType = "http://schema.eduworks.com/cass/0.1/source";
    prototype.target = null;
}, {target: "EntryPoint", mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  A composition of references to competencies, alignments, and levels that
 *  embody a competency framework. It is reasonable safe to assume the maker of
 *  this framework implicitly accepts all data referred to by this object.
 *  
 *  @author fritz.ray@eduworks.com
 */
var Framework = function() {
    Thing.call(this);
    this.schema = Cass.schema;
    this.type = Framework.myType;
};
Framework = stjs.extend(Framework, Thing, [], function(constructor, prototype) {
    constructor.myType = "http://schema.eduworks.com/cass/0.1/framework";
    prototype.competency = null;
    prototype.relation = null;
    prototype.level = null;
    prototype.source = null;
}, {competency: {name: "Array", arguments: [null]}, relation: {name: "Array", arguments: [null]}, level: {name: "Array", arguments: [null]}, source: "Source", mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  A composition of references to assertions and acceptances that embody a
 *  person's profile. It is reasonably safe to assume the maker of this framework
 *  implicitly accepts all data referred to by this object.
 *  
 *  @author fritz.ray@eduworks.com
 */
var Profile = function() {
    Thing.call(this);
    this.schema = Cass.schema;
    this.type = Profile.myType;
};
Profile = stjs.extend(Profile, Thing, [], function(constructor, prototype) {
    constructor.myType = "http://schema.eduworks.com/cass/0.1/profile";
    prototype.person = null;
    prototype.assertion = null;
    prototype.acceptance = null;
}, {assertion: {name: "Array", arguments: [null]}, acceptance: {name: "Array", arguments: [null]}, mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
var Assertion = function() {
    Thing.call(this);
    this.schema = Cass.schema;
    this.type = Assertion.myType;
};
Assertion = stjs.extend(Assertion, Thing, [], function(constructor, prototype) {
    constructor.myType = "http://schema.eduworks.com/cass/0.1/assertion";
    prototype.competency = null;
    prototype.level = null;
    prototype.subject = null;
    prototype.agent = null;
    prototype.evidence = null;
    prototype.confidence = null;
    prototype.assertionDate = null;
    prototype.expirationDate = null;
    prototype.decayFunction = null;
}, {subject: "EcEncryptedValue", agent: "EcEncryptedValue", evidence: {name: "Array", arguments: ["EcEncryptedValue"]}, assertionDate: "EcEncryptedValue", expirationDate: "EcEncryptedValue", decayFunction: "EcEncryptedValue", mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  Under construction.
 *  
 *  Working model of a CASS competency.
 *  @author fritz.ray@eduworks.com
 */
var Competency = function() {
    Thing.call(this);
    this.schema = Cass.schema;
    this.type = Competency.myType;
};
Competency = stjs.extend(Competency, Thing, [], function(constructor, prototype) {
    constructor.myType = "http://schema.eduworks.com/cass/0.1/competency";
    prototype.scope = null;
}, {mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
