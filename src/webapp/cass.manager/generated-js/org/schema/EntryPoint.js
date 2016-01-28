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
