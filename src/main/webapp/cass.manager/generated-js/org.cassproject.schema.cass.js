var Cass = function() {};
Cass = stjs.extend(Cass, null, [], function(constructor, prototype) {
    constructor.context_0_1 = "http://schema.eduworks.com/cass/0.1";
    constructor.context_0_2 = "http://schema.eduworks.com/cass/0.2";
    constructor.context = "http://schema.eduworks.com/cass/0.2";
}, {}, {});
var Level = function() {
    Thing.call(this);
    this.setContextAndType(Cass.context, Level.myType);
};
Level = stjs.extend(Level, Thing, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/cass/0.1/level";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/cass/0.2/level";
    constructor.myType = Level.TYPE_0_2;
    prototype.competency = null;
    prototype.title = null;
    prototype.performance = null;
    prototype.upgrade = function() {
        EcLinkedData.prototype.upgrade.call(this);
        if (Level.TYPE_0_1.equals(this.type)) {
            var me = (this);
            if (me["@context"] == null && me["@schema"] != null) 
                me["@context"] = me["@schema"];
            this.setContextAndType(Cass.context_0_2, Level.TYPE_0_2);
        }
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(Level.TYPE_0_2);
        a.push(Level.TYPE_0_1);
        return a;
    };
}, {mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, secret: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
var Relation = function() {
    Thing.call(this);
    this.setContextAndType(Cass.context, Relation.myType);
};
Relation = stjs.extend(Relation, Thing, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/cass/0.1/relation";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/cass/0.2/relation";
    constructor.myType = Relation.TYPE_0_2;
    constructor.IS_ENABLED_BY = "isEnabledBy";
    constructor.REQUIRES = "requires";
    constructor.DESIRES = "desires";
    constructor.NARROWS = "narrows";
    constructor.IS_RELATED_TO = "isRelatedTo";
    constructor.IS_EQUIVALENT_TO = "isEquivalentTo";
    prototype.source = null;
    prototype.target = null;
    prototype.relationType = null;
    prototype.validFrom = null;
    prototype.validThrough = null;
    prototype.agent = null;
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
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(Relation.TYPE_0_2);
        a.push(Relation.TYPE_0_1);
        return a;
    };
}, {mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, secret: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
var RollupRule = function() {
    Thing.call(this);
    this.setContextAndType(Cass.context, RollupRule.myType);
};
RollupRule = stjs.extend(RollupRule, Thing, [], function(constructor, prototype) {
    constructor.TYPE_0_2 = "http://schema.eduworks.com/cass/0.2/rollupRule";
    constructor.myType = RollupRule.TYPE_0_2;
    prototype.rule = null;
    prototype.competency = null;
    prototype.upgrade = function() {
        EcLinkedData.prototype.upgrade.call(this);
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(RollupRule.TYPE_0_2);
        return a;
    };
}, {mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, secret: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
var Source = function() {
    Thing.call(this);
    this.setContextAndType(Cass.context, Source.myType);
};
Source = stjs.extend(Source, Thing, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/cass/0.1/source";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/cass/0.2/source";
    constructor.myType = Source.TYPE_0_2;
    prototype.target = null;
    prototype.upgrade = function() {
        EcLinkedData.prototype.upgrade.call(this);
        if (Source.TYPE_0_1.equals(this.type)) {
            var me = (this);
            if (me["@context"] == null && me["@schema"] != null) 
                me["@context"] = me["@schema"];
            this.setContextAndType(Cass.context_0_2, Source.TYPE_0_2);
        }
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(Source.TYPE_0_2);
        a.push(Source.TYPE_0_1);
        return a;
    };
}, {target: "EntryPoint", mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, secret: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  A composition of references to competencies, alignments, and levels that
 *  embody a competency framework. It is reasonable safe to assume the maker of
 *  this framework implicitly accepts all data referred to by this object.
 *  
 *  @author fritz.ray@eduworks.com
 */
var Framework = function() {
    Thing.call(this);
    this.setContextAndType(Cass.context, Framework.myType);
};
Framework = stjs.extend(Framework, Thing, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/cass/0.1/framework";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/cass/0.2/framework";
    constructor.myType = Framework.TYPE_0_2;
    prototype.competency = null;
    prototype.relation = null;
    prototype.level = null;
    prototype.rollupRule = null;
    prototype.source = null;
    prototype.upgrade = function() {
        EcLinkedData.prototype.upgrade.call(this);
        if (Framework.TYPE_0_1.equals(this.type)) {
            var me = (this);
            if (me["@context"] == null && me["@schema"] != null) 
                me["@context"] = me["@schema"];
            this.setContextAndType(Cass.context_0_2, Framework.TYPE_0_2);
        }
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(Framework.TYPE_0_2);
        a.push(Framework.TYPE_0_1);
        return a;
    };
}, {competency: {name: "Array", arguments: [null]}, relation: {name: "Array", arguments: [null]}, level: {name: "Array", arguments: [null]}, rollupRule: {name: "Array", arguments: [null]}, source: "Source", mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, secret: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  A composition of references to assertions and acceptances that embody a
 *  person's profile. It is reasonably safe to assume the maker of this framework
 *  implicitly accepts all data referred to by this object.
 *  
 *  @author fritz.ray@eduworks.com
 */
var Profile = function() {
    Thing.call(this);
    this.setContextAndType(Cass.context, Profile.myType);
};
Profile = stjs.extend(Profile, Thing, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/cass/0.1/profile";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/cass/0.2/profile";
    constructor.myType = Profile.TYPE_0_2;
    prototype.person = null;
    prototype.assertion = null;
    prototype.acceptance = null;
    prototype.upgrade = function() {
        EcLinkedData.prototype.upgrade.call(this);
        if (Profile.TYPE_0_1.equals(this.type)) {
            var me = (this);
            if (me["@context"] == null && me["@schema"] != null) 
                me["@context"] = me["@schema"];
            this.setContextAndType(Cass.context_0_2, Profile.TYPE_0_2);
        }
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(Profile.TYPE_0_2);
        a.push(Profile.TYPE_0_1);
        return a;
    };
}, {assertion: {name: "Array", arguments: [null]}, acceptance: {name: "Array", arguments: [null]}, mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, secret: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
var Assertion = function() {
    Thing.call(this);
    this.setContextAndType(Cass.context, Assertion.myType);
};
Assertion = stjs.extend(Assertion, Thing, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/cass/0.1/assertion";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/cass/0.2/assertion";
    constructor.myType = Assertion.TYPE_0_2;
    prototype.competency = null;
    prototype.framework = null;
    prototype.level = null;
    prototype.subject = null;
    prototype.agent = null;
    prototype.evidence = null;
    prototype.confidence = null;
    prototype.assertionDate = null;
    prototype.expirationDate = null;
    prototype.decayFunction = null;
    prototype.negative = null;
    prototype.upgrade = function() {
        EcLinkedData.prototype.upgrade.call(this);
        if (Assertion.TYPE_0_1.equals(this.type)) {
            var me = (this);
            if (me["@context"] == null && me["@schema"] != null) 
                me["@context"] = me["@schema"];
            this.setContextAndType(Cass.context_0_2, Assertion.TYPE_0_2);
        }
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(Assertion.TYPE_0_2);
        a.push(Assertion.TYPE_0_1);
        return a;
    };
}, {subject: "EcEncryptedValue", agent: "EcEncryptedValue", evidence: {name: "Array", arguments: ["EcEncryptedValue"]}, assertionDate: "EcEncryptedValue", expirationDate: "EcEncryptedValue", decayFunction: "EcEncryptedValue", negative: "EcEncryptedValue", mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, secret: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  Under construction.
 *  
 *  Working model of a CASS competency.
 *  
 *  @author fritz.ray@eduworks.com
 */
var Competency = function() {
    Thing.call(this);
    this.setContextAndType(Cass.context, Competency.myType);
};
Competency = stjs.extend(Competency, Thing, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.eduworks.com/cass/0.1/competency";
    constructor.TYPE_0_2 = "http://schema.eduworks.com/cass/0.2/competency";
    constructor.myType = Competency.TYPE_0_2;
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
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(Competency.TYPE_0_2);
        a.push(Competency.TYPE_0_1);
        return a;
    };
}, {mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, secret: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
