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
