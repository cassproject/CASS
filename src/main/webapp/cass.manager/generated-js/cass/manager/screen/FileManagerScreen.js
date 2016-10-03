var FileManagerScreen = function() {
    CassManagerScreen.call(this);
};
FileManagerScreen = stjs.extend(FileManagerScreen, CassManagerScreen, [], function(constructor, prototype) {
    constructor.displayName = "fileManager";
    prototype.getDisplayName = function() {
        return FileManagerScreen.displayName;
    };
    prototype.getHtmlLocation = function() {
        return "partial/screen/fileManager.html";
    };
}, {reloadLoginCallback: "Callback0", reloadShowLoginCallback: "Callback0"}, {});
(function() {
    ScreenManager.addStartupScreenCallback(function() {
        if (window.document.location.hash.startsWith("#" + FileManagerScreen.displayName)) {
            ScreenManager.startupScreen = new FileManagerScreen();
            CassManagerScreen.showLoginModalIfReload();
        }
    });
})();
