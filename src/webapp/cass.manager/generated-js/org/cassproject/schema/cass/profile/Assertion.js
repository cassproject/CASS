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
