var AlignmentObject = function() {
    Thing.call(this);
    this.schema = "http://schema.org/";
    this.type = "http://schema.org/Thing";
};
AlignmentObject = stjs.extend(AlignmentObject, Thing, [], function(constructor, prototype) {
    prototype.alignmentType = null;
    prototype.educationalFramework = null;
    prototype.targetDescription = null;
    prototype.targetName = null;
    prototype.targetUrl = null;
}, {mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
