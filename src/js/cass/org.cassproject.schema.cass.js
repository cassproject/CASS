var Cass = function() {};
Cass = stjs.extend(Cass, null, [], function(constructor, prototype) {
    constructor.schema = "http://schema.eduworks.com/cass/0.1";
}, {}, {});
var Alignment = function() {
    Thing.call(this);
    this.schema = Cass.schema;
    this.type = Alignment.myType;
};
Alignment = stjs.extend(Alignment, Thing, [], function(constructor, prototype) {
    constructor.myType = "http://schema.eduworks.com/cass/0.1/alignment";
    prototype.source = null;
    prototype.destination = null;
    prototype.alignmentType = null;
}, {mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
var Level = function() {
    Thing.call(this);
    this.schema = Cass.schema;
    this.type = Level.myType;
};
Level = stjs.extend(Level, Thing, [], function(constructor, prototype) {
    constructor.myType = "http://schema.eduworks.com/cass/0.1/level";
    prototype.competency = null;
    prototype.performance = null;
}, {mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
var Source = function() {
    Thing.call(this);
    this.schema = Cass.schema;
    this.type = Source.myType;
};
Source = stjs.extend(Source, Thing, [], function(constructor, prototype) {
    constructor.myType = "http://schema.eduworks.com/cass/0.1/source";
    prototype.target = null;
}, {target: "EntryPoint", mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    prototype.alignment = null;
    prototype.level = null;
}, {competency: {name: "Array", arguments: [null]}, alignment: {name: "Array", arguments: [null]}, level: {name: "Array", arguments: [null]}, mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  A composition of references to assertions and acceptances that embody a
 *  person's profile. It is reasonable safe to assume the maker of this framework
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
}, {assertion: {name: "Array", arguments: [null]}, acceptance: {name: "Array", arguments: [null]}, mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
}, {evidence: {name: "Array", arguments: [null]}, mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
    prototype.level = null;
    prototype.scope = null;
    prototype.source = null;
}, {level: {name: "Array", arguments: ["Level"]}, source: "Source", mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
