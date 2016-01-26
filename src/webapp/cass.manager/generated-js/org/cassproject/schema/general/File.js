var File = function() {
    EcRemoteLinkedData.call(this, General.schema, File.type);
};
File = stjs.extend(File, EcRemoteLinkedData, [], function(constructor, prototype) {
    constructor.type = "http://schema.eduworks.com/general/0.1/file";
    prototype.checksum = null;
    prototype.mimeType = null;
    /**
     *  This field will be empty in search results, but be populated in a direct
     *  get.
     */
    prototype.data = null;
    prototype.name = null;
    prototype.download = function() {
        var document = window.document;
        var pom = document.createElement("a");
        pom.setAttribute("href", "data:text/plain;base64," + this.data);
        pom.setAttribute("download", this.name);
        pom.click();
    };
}, {owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
