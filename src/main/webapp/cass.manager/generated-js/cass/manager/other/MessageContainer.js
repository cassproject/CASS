var MessageContainer = function(idPrefix) {
    EcView.call(this);
    this.prefix = idPrefix;
};
MessageContainer = stjs.extend(MessageContainer, EcView, [], function(constructor, prototype) {
    prototype.prefix = null;
    prototype.getHtmlLocation = function() {
        return "partial/other/messageContainer.html";
    };
    prototype.displayAlert = function(msg, msgId) {};
}, {}, {});
