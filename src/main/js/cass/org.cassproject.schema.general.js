var Ebac = function() {};
Ebac = stjs.extend(Ebac, null, [], function(constructor, prototype) {
    constructor.context_0_1 = "http://schema.eduworks.com/ebac/0.1";
    constructor.context_0_2 = "http://schema.eduworks.com/ebac/0.2";
    constructor.context = "http://schema.eduworks.com/ebac/0.2";
}, {}, {});
var General = function() {};
General = stjs.extend(General, null, [], function(constructor, prototype) {
    constructor.context_0_2 = "http://schema.eduworks.com/general/0.2";
    constructor.context_0_1 = "http://schema.eduworks.com/general/0.1";
    constructor.context = "http://schema.eduworks.com/general/0.2";
}, {}, {});
/**
 *  Data wrapper to represent remotely hosted data. Includes necessary fields for
 *  permission controls, signing, and identification of the object.
 *  
 *  @author fritz.ray@eduworks.com
 */
var EcRemoteLinkedData = function(context, type) {
    EcLinkedData.call(this, context, type);
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
    prototype.privateEncrypted = null;
    /**
     *  PEM encoded public keys of identities authorized to view the object. A
     *  repository will ignore write operations from these identities, but will
     *  allow them to read the object.
     */
    prototype.reader = null;
    /**
     *  Array of EbacEncryptedSecret objects encoded in Base-64, encrypted using
     *  RSA public keys of owners or readers (or unknown parties) to allow them
     *  access to the payload.
     */
    prototype.secret = null;
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
        this.id += this.getFullType().replace("http://", "").replaceAll("/", ".");
        this.id += "/";
        this.id += generateUUID();
        this.id += "/";
        this.id += new Date().getTime();
    };
    /**
     *  Will generate an identifier using the server URL provided (usually from
     *  an EcRepository).
     *  
     *  @param server
     *             Base URL of the server's repository functionality.
     */
    prototype.assignId = function(server, newId) {
        this.id = server;
        if (!this.id.endsWith("/")) 
            this.id += "/";
        this.id += "data/";
        this.id += this.getFullType().replace("http://", "").replaceAll("/", ".");
        this.id += "/";
        this.id += newId;
        this.id += "/";
        this.id += new Date().getTime();
    };
    /**
     *  Determines if the object has pk as an owner. Homogenizes the PEM strings
     *  for comparison.
     *  
     *  @param pk
     *             Public Key of the owner in object (forge) form.
     *  @return True if owner is represented by the PK, false otherwise.
     */
    prototype.hasOwner = function(pk) {
        if (this.owner == null) 
            return false;
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
     *             Public Key of the owner in object (forge) form.
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
        if (this.type.contains("http://schema.eduworks.com/") && this.type.contains("/0.1/")) {
            delete (d)["@signature"];
            delete (d)["@owner"];
            delete (d)["@reader"];
            delete (d)["@id"];
            delete (d)["privateEncrypted"];
        } else {
            delete (d)["@signature"];
            delete (d)["@id"];
            delete (d)["privateEncrypted"];
        }
        var e = new EcLinkedData(d.context, d.type);
        e.copyFrom(d);
        return e.toJson();
    };
    /**
     *  Sign this object with a private key.
     *  
     *  @param ppk
     *             Private Key of the owner in object (forge) form.
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
     *  Verify's the object's signatures
     *  
     *  @return true if all of the signatures could be verified, false if they
     *          could not
     */
    prototype.verify = function() {
        if (this.signature != null) {
            for (var i = 0; i < this.signature.length; ) {
                var works = false;
                var sig = this.signature[i];
                if (this.owner != null) {
                    for (var j = 0; j < this.owner.length; j++) {
                        var own = this.owner[j];
                        var pk = EcPk.fromPem(own);
                        var verify = false;
                        try {
                            verify = EcRsaOaep.verify(pk, this.toSignableJson(), sig);
                        }catch (ex) {}
                        if (verify) {
                            works = true;
                            break;
                        }
                    }
                }
                if (!works) 
                    return false;
                 else 
                    i++;
            }
            if (this.signature.length == 0) 
                return false;
            return true;
        }
        return false;
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
        this.signature = null;
    };
    /**
     *  Removes an owner from the object, if the owner does exist.
     *  
     *  @param oldOwner
     *             PK of the new owner.
     */
    prototype.removeOwner = function(oldOwner) {
        var pem = oldOwner.toPem();
        if (this.owner == null) 
            this.owner = new Array();
        for (var i = 0; i < this.owner.length; i++) 
            if (this.owner[i].equals(pem)) 
                this.owner.splice(i, 1);
        this.signature = null;
    };
    /**
     *  Adds a reader to the object, if the reader does not exist.
     *  
     *  @param newReader
     *             PK of the new reader.
     */
    prototype.addReader = function(newReader) {
        var pem = newReader.toPem();
        if (this.reader == null) 
            this.reader = new Array();
        for (var i = 0; i < this.reader.length; i++) 
            if (this.reader[i].equals(pem)) 
                return;
        this.reader.push(pem);
        this.signature = null;
    };
    /**
     *  Removes a reader from the object, if the reader does exist.
     *  
     *  @param oldReader
     *             PK of the old reader.
     */
    prototype.removeReader = function(oldReader) {
        var pem = oldReader.toPem();
        if (this.reader == null) 
            this.reader = new Array();
        for (var i = 0; i < this.reader.length; i++) 
            if (this.reader[i].equals(pem)) 
                this.reader.splice(i, 1);
        this.signature = null;
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
        if (this.context == null) 
            return true;
        if (this.getFullType() == null) 
            return true;
        if (this.getFullType().contains("http://") == false && this.getFullType().contains("https://") == false) 
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
        if (!id.substring(id.lastIndexOf("/")).matches("^\\/[0-9]+$")) 
            return id;
        var rawId = id.substring(0, id.lastIndexOf("/"));
        if (rawId.endsWith("/")) 
            rawId = rawId.substring(0, rawId.length - 1);
        return rawId;
    };
    prototype.shortId = function() {
        return EcRemoteLinkedData.trimVersionFromUrl(this.id);
    };
    prototype.getSearchStringByType = function() {
        var types = this.getTypes();
        var result = "";
        for (var i = 0; i < types.length; i++) {
            if (i != 0) 
                result += " OR ";
            result += "@type:\"" + types[i] + "\"";
            var lastSlash = types[i].lastIndexOf("/");
            result += " OR (@context:\"" + types[i].substring(0, lastSlash) + "\" AND @type:\"" + types[i].substring(lastSlash + 1) + "\")";
        }
        for (var i = 0; i < types.length; i++) {
            if (result.equals("") == false) 
                result += " OR ";
            result += "@encryptedType:\"" + types[i] + "\"";
            var lastSlash = types[i].lastIndexOf("/");
            result += " OR (@context:\"" + Ebac.context + "\" AND @encryptedType:\"" + types[i].substring(lastSlash + 1) + "\")";
        }
        return "(" + result + ")";
    };
}, {owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, secret: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
