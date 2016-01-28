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
