var General = function() {};
General = stjs.extend(General, null, [], function(constructor, prototype) {
    constructor.schema = "http://schema.eduworks.com/general/0.1";
}, {}, {});
/**
 *  Data wrapper to represent remotely hosted data. Includes necessary fields for
 *  permission controls, signing, and identification of the object.
 *  
 *  @author fritz.ray@eduworks.com
 */
var EcRemoteLinkedData = function(schema, type) {
    EcLinkedData.call(this, schema, type);
};
EcRemoteLinkedData = stjs.extend(EcRemoteLinkedData, EcLinkedData, [], function(constructor, prototype) {
    /**
     *  PEM encoded public keys of the owner of the object. A repository, upon
     *  receiving a write operation, will ensure either the data did not
     *  previously exist, or that an owner has provided a signature authorizing
     *  the replacement of the old data with the new data.
     */
    prototype.owner = null;
    /**
     *  PEM encoded public keys of identities authorized to view the object. A
     *  repository will ignore write operations from these identities, but will
     *  allow them to read the object.
     */
    prototype.reader = null;
    /**
     *  Signatures of the object. The signing method is as follows: Remove the
     *  signature field. Encode the object and its fields in ascii-sort order
     *  JSON-LD using a space-free, tab-free encoding. Sign the aforementioned
     *  string.
     */
    prototype.signature = null;
    /**
     *  URL/URI used to retrieve and store the object, plus identify the object.
     */
    prototype.id = null;
    /**
     *  Will generate an identifier using the server URL provided (usually from
     *  an EcRepository).
     *  
     *  @param server
     *             Base URL of the server's repository functionality.
     */
    prototype.generateId = function(server) {
        this.id = server;
        if (!this.id.endsWith("/")) 
            this.id += "/";
        this.id += "data/";
        this.id += this.type.replace("http://", "").replaceAll("/", ".");
        this.id += "/";
        this.id += generateUUID();
        this.id += "/";
        this.id += new Date().getTime();
    };
    /**
     *  Determines if the object has pk as an owner. Homogenizes the PEM strings
     *  for comparison.
     *  
     *  @param pk
     *  @return True if owner is represented by the PK, false otherwise.
     */
    prototype.hasOwner = function(pk) {
        var pkPem = pk.toPem();
        for (var i = 0; i < this.owner.length; i++) 
            if (pkPem.equals(EcPk.fromPem(this.owner[i]).toPem())) 
                return true;
        return false;
    };
    /**
     *  Determines if the object has pk as an owner. Homogenizes the PEM strings
     *  for comparison.
     *  
     *  @param pk
     *  @return True if owner is represented by the PK, false otherwise.
     */
    prototype.canEdit = function(pk) {
        if (this.owner == null || this.owner.length == 0) 
            return true;
        return this.hasOwner(pk);
    };
    /**
     *  Encodes the object in a form where it is ready to be signed.
     *  
     *  @return ASCII-sort order encoded space-free and tab-free JSON-LD.
     */
    prototype.toSignableJson = function() {
        var d = JSON.parse(this.toJson());
        delete (d)["@signature"];
        delete (d)["@owner"];
        delete (d)["@reader"];
        delete (d)["@id"];
        var e = new EcLinkedData(d.schema, d.type);
        e.copyFrom(d);
        return e.toJson();
    };
    /**
     *  Sign this object with a private key.
     *  
     *  @param ppk
     */
    prototype.signWith = function(ppk) {
        var signableJson = this.toSignableJson();
        var signed = EcRsaOaep.sign(ppk, signableJson);
        if (this.signature != null) {
            for (var i = 0; i < this.signature.length; i++) 
                if (this.signature[i].equals(signed)) 
                    return;
        } else {
            this.signature = new Array();
        }
        this.signature.push(signed);
    };
    /**
     *  Adds an owner to the object, if the owner does not exist.
     *  
     *  @param newOwner
     *             PK of the new owner.
     */
    prototype.addOwner = function(newOwner) {
        var pem = newOwner.toPem();
        if (this.owner == null) 
            this.owner = new Array();
        for (var i = 0; i < this.owner.length; i++) 
            if (this.owner[i].equals(pem)) 
                return;
        this.owner.push(pem);
    };
    /**
     *  Determines if the object will survive and be retreivable from a server,
     *  should it be written.
     *  
     *  @return True if the object is NOT VALID for storage, false otherwise.
     */
    prototype.invalid = function() {
        if (this.id == null) 
            return true;
        if (this.id.contains("http://") == false) 
            return true;
        if (this.schema == null) 
            return true;
        if (this.getFullType() == null) 
            return true;
        if (this.getFullType().contains("http://") == false) 
            return true;
        return false;
    };
    prototype.updateTimestamp = function() {
        var rawId = this.id.substring(0, this.id.lastIndexOf("/"));
        if (rawId.endsWith("/") == false) 
            rawId += "/";
        rawId += new Date().getTime();
        this.id = rawId;
    };
    prototype.isId = function(id) {
        return EcRemoteLinkedData.trimVersionFromUrl(this.id).equals(EcRemoteLinkedData.trimVersionFromUrl(id));
    };
    constructor.trimVersionFromUrl = function(id) {
        if (id == null) 
            return null;
        if (id.substring(id.lastIndexOf("/")).contains("-")) 
            return id;
        var rawId = id.substring(0, id.lastIndexOf("/"));
        if (rawId.endsWith("/")) 
            rawId = rawId.substring(0, rawId.length - 1);
        return rawId;
    };
    prototype.shortId = function() {
        return EcRemoteLinkedData.trimVersionFromUrl(this.id);
    };
}, {owner: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
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
}, {owner: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
