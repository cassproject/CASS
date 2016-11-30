var IdentityDisplay = function(data) {
    EcView.call(this);
    this.data = data;
};
IdentityDisplay = stjs.extend(IdentityDisplay, EcView, [], function(constructor, prototype) {
    prototype.data = null;
    prototype.getHtmlLocation = function() {
        return "partial/other/identityDisplay.html";
    };
}, {data: "Object"}, {});
