var MessageContainer = function(idPrefix, closeMessage) {
    EcView.call(this);
    this.prefix = idPrefix;
    this.closeMessageCallback = closeMessage;
};
MessageContainer = stjs.extend(MessageContainer, EcView, [], function(constructor, prototype) {
    prototype.prefix = null;
    prototype.closeMessageCallback = null;
    prototype.getHtmlLocation = function() {
        return "partial/other/messageContainer.html";
    };
    prototype.displayAlert = function(msg, msgId) {};
    prototype.clearAlert = function(msgId) {};
}, {closeMessageCallback: "Callback0"}, {});
