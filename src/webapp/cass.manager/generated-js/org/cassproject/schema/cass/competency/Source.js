var Source = function() {
    Thing.call(this);
    this.schema = Cass.schema;
    this.type = Source.myType;
};
Source = stjs.extend(Source, Thing, [], function(constructor, prototype) {
    constructor.myType = "http://schema.eduworks.com/cass/0.1/source";
    prototype.target = null;
}, {target: "EntryPoint", mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
