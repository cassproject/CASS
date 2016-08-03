var MessageContainer = function(idPrefix) {
    EcView.call(this);
    this.prefix = idPrefix;
};
MessageContainer = stjs.extend(MessageContainer, EcView, [], function(constructor, prototype) {
    prototype.prefix = null;
    prototype.display = function(containerId, callback) {
        console.error("Not Implemented Yet");
    };
}, {}, {});
