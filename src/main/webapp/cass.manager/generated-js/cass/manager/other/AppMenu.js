var AppMenu = function() {
    EcView.call(this);
};
AppMenu = stjs.extend(AppMenu, EcView, [], function(constructor, prototype) {
    prototype.getHtmlLocation = function() {
        return "partial/other/appMenu.html";
    };
}, {}, {});
