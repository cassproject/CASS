var FrameworkList = function(data, callbacks) {
    EcView.call(this);
    this.data = data;
    this.callbacks = callbacks;
};
FrameworkList = stjs.extend(FrameworkList, EcView, [], function(constructor, prototype) {
    prototype.data = null;
    prototype.callbacks = null;
    prototype.getHtmlLocation = function() {
        return "partial/other/frameworkList.html";
    };
}, {data: "Object", callbacks: "Object"}, {});
