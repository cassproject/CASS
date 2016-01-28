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
