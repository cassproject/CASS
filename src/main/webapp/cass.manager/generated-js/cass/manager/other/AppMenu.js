var AppMenu = function() {
    EcView.call(this);
};
AppMenu = stjs.extend(AppMenu, EcView, [], function(constructor, prototype) {
    prototype.getHtmlLocation = function() {
        return "partial/other/appMenu.html";
    };
    prototype.setLoggedIn = function() {};
    prototype.showRepoMenu = function(show) {};
    prototype.showExamplesMenu = function(show) {};
    prototype.buildRecentCompetencyList = function(list) {};
    prototype.buildRecentFrameworkList = function(list) {};
}, {}, {});
