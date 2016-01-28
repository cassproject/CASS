var Thing = function() {
    EcRemoteLinkedData.call(this, "http://schema.org/", "http://schema.org/Thing");
};
Thing = stjs.extend(Thing, EcRemoteLinkedData, [], function(constructor, prototype) {
    constructor.newThing = function() {
        return new Thing().toJson();
    };
    prototype.name = null;
    prototype.description = null;
    prototype.alternateName = null;
    prototype.url = null;
    prototype.sameAs = null;
    prototype.mainEntityOfPage = null;
    prototype.image = null;
    prototype.additionalType = null;
}, {mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
var EntryPoint = function() {
    Thing.call(this);
};
EntryPoint = stjs.extend(EntryPoint, Thing, [], function(constructor, prototype) {
    prototype.actionApplication = null;
    prototype.actionPlatform = null;
    prototype.contentType = null;
    prototype.encodingType = null;
    prototype.httpMethod = null;
    prototype.urlTemplate = null;
}, {actionApplication: "Object", mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
var Action = function() {
    Thing.call(this);
    this.schema = "http://schema.org/";
    this.type = "http://schema.org/Action";
};
Action = stjs.extend(Action, Thing, [], function(constructor, prototype) {
    prototype.agent = null;
    prototype.endTime = null;
    prototype.startTime = null;
    prototype.target = null;
    prototype.error = null;
    prototype.instrument = null;
    prototype.location = null;
    prototype.object = null;
    prototype.participant = null;
    prototype.result = null;
}, {participant: {name: "Array", arguments: [null]}, mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
