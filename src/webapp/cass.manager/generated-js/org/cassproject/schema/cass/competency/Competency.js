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
