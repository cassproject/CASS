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
