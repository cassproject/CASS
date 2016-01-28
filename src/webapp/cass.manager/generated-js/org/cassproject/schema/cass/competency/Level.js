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
