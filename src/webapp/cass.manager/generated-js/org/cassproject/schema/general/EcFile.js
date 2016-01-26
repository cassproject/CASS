/**
 *  A representation of a file.
 *  
 *  @author fritz.ray@eduworks.com
 */
var EcFile = function() {
    EcRemoteLinkedData.call(this, General.schema, EcFile.type);
};
EcFile = stjs.extend(EcFile, EcRemoteLinkedData, [], function(constructor, prototype) {
    constructor.type = "http://schema.eduworks.com/general/0.1/file";
    /**
     *  Optional checksum of the file, used to verify if the file has been
     *  transmitted correctly.
     */
    prototype.checksum = null;
    /**
     *  Mime type of the file.
     */
    prototype.mimeType = null;
    /**
     *  Base-64 encoded version of the bytestream of a file.
     *  
     *  Please note: This field will be empty in search results, but be populated
     *  in a direct get.
     */
    prototype.data = null;
    /**
     *  Name of the file.
     */
    prototype.name = null;
    /**
     *  Helper method to force the browser to download the file.
     */
    prototype.download = function() {
        var blob = base64ToBlob(this.data, this.mimeType);
        saveAs(blob, this.name);
    };
}, {owner: {name: "Array", arguments: [null]}, readers: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
