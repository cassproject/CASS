/**
 *  Location of strings that store the current namespace for general Eduworks Objects.
 *  @class General
 *  @module com.eduworks.ec
 *  @author fritz.ray@eduworks.com
 */
var General = function() {};
General = stjs.extend(General, null, [], function(constructor, prototype) {
    constructor.context_0_2 = "http://schema.eduworks.com/general/0.2";
    constructor.context_0_1 = "http://schema.eduworks.com/general/0.1";
    /**
     *  The latest version of the Eduworks Object namespace.
     *  @property context
     *  @static
     *  @type {string}
     */
    constructor.context = "http://schema.eduworks.com/general/0.2";
}, {}, {});
/**
 *  Location of strings that store the current namespace for EBAC/KBAC.
 *  @class Ebac
 *  @module org.cassproject
 *  @author fritz.ray@eduworks.com
 */
var Ebac = function() {};
Ebac = stjs.extend(Ebac, null, [], function(constructor, prototype) {
    constructor.context_0_1 = "http://schema.eduworks.com/ebac/0.1";
    constructor.context_0_2 = "http://schema.eduworks.com/ebac/0.2";
    constructor.context_0_3 = "http://schema.cassproject.org/kbac/0.2";
    /**
     *  Current version of KBAC.
     *  @property context
     *  @static
     *  @type string (URL)
     */
    constructor.context = "http://schema.cassproject.org/kbac/0.2";
}, {}, {});
/**
 *  Data wrapper to represent remotely hosted data. Includes necessary KBAC fields for
 *  permission controls, signing, identifying and locating the object.
 *  
 *  @class EcRemoteLinkedData
 *  @extends EcLinkedData
 *  @module org.cassproject
 *  @author fritz.ray@eduworks.com
 */
var EcRemoteLinkedData = /**
 *  Constructor for remote linked data object.
 *  @constructor
 *  @param {string} context JSON-LD Context.
 *  @param {string} type JSON-LD Type.
 */
function(context, type) {
    EcLinkedData.call(this, context, type);
};
EcRemoteLinkedData = stjs.extend(EcRemoteLinkedData, EcLinkedData, [], function(constructor, prototype) {
    /**
     *  PEM encoded public keys of the owner of the object. A repository, upon
     *  receiving a write operation, will ensure either the data did not
     *  previously exist, or that an owner has provided a signature authorizing
     *  the replacement of the old data with the new data.
     *  @property owner
     *  @type string[] (PEM)
     */
    prototype.owner = null;
    /**
     *  Signatures of the object. The signing method is as follows: Remove the
     *  signature field. Encode the object and its fields in ascii-sort order
     *  JSON-LD using a space-free, tab-free encoding. Sign the aforementioned
     *  string.
     *  @property signature
     *  @type string[] (Base64)
     */
    prototype.signature = null;
    /**
     *  URL/URI used to retrieve, store and identify the object.
     *  @property id
     *  @type string (URL)
     */
    prototype.id = null;
    /**
     *  PEM encoded public keys of identities authorized to view the object. A
     *  repository will ignore write operations from these identities, but will
     *  allow them to read the object.
     *  @property reader
     *  @type string[] (PEM)
     */
    prototype.reader = null;
    /**
     *  Will generate an identifier using the server URL provided (usually from
     *  an EcRepository).
     *  
     *  @method generateId
     *  @param {string} server Base URL of the server's repository functionality.
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
     *  an EcRepository) and unique identifier.
     *  
     *  @method assignId
     *  @param {string} server Base URL of the server's repository functionality.
     *  @param {string} uniqueIdentifier Canonical identifier. Must contain a letter or symbol.
     */
    prototype.assignId = function(server, uniqueIdentifier) {
        this.id = server;
        if (!this.id.endsWith("/")) 
            this.id += "/";
        this.id += "data/";
        this.id += this.getFullType().replace("http://", "").replaceAll("/", ".");
        this.id += "/";
        this.id += uniqueIdentifier;
        this.id += "/";
        this.id += new Date().getTime();
    };
    /**
     *  Determines if the object has an owner identified by pk. 
     *  Homogenizes the PEM strings for comparison. 
     *  Homogenization is necessary for comparing PKCS#1 and PKCS#8 or PKs with Certificates, etc.
     *  
     *  @method hasOwner
     *  @param {EcPk} pk Public Key of the owner.
     *  @return {boolean} True if owner is represented by the PK, false otherwise.
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
     *  Determines if the PK matches an owner or if the object is public. 
     *  Homogenizes the PEM strings for comparison. 
     *  Homogenization is necessary for comparing PKCS#1 and PKCS#8 or PKs with Certificates, etc.
     *  
     *  @method canEdit
     *  @param {EcPk} pk Public Key of the owner.
     *  @return {boolean} True if owner is represented by the PK, false otherwise.
     */
    prototype.canEdit = function(pk) {
        if (this.owner == null || this.owner.length == 0) 
            return true;
        return this.hasOwner(pk);
    };
    /**
     *  Encodes the object in a form where it is ready to be signed. 
     *  This method is under long term review, and may change from version to version.
     *  
     *  @method toSignableJson
     *  @return ASCII-sort order encoded space-free and tab-free JSON-LD.
     */
    prototype.toSignableJson = function() {
        var d = JSON.parse(this.toJson());
        if (this.type.contains("http://schema.eduworks.com/") && this.type.contains("/0.1/")) {
            delete (d)["@signature"];
            delete (d)["@owner"];
            delete (d)["@reader"];
            delete (d)["@id"];
        } else {
            delete (d)["@signature"];
            delete (d)["@id"];
        }
        var e = new EcLinkedData(d.context, d.type);
        e.copyFrom(d);
        return e.toJson();
    };
    /**
     *  Sign this object using a private key. 
     *  Does not check for ownership, objects signed with keys absent from @owner or @reader may be removed.
     *  
     *  @method signWith
     *  @param {EcPpk} ppk Public private keypair.
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
     *  Verifies the object's signatures.
     *  
     *  @method verify
     *  @return {boolean} true if all of the signatures could be verified, false if they could not
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
     *  Note that this method invalidates all signatures.
     *  
     *  @method addOwner
     *  @param {EcPk} newOwner PK of the new owner.
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
     *  Note that this method invalidates all signatures.
     *  
     *  @method removeOwner
     *  @param {EcPk} oldOwner PK to remove.
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
     *  Note that this method invalidates all signatures.
     *  
     *  @method addReader
     *  @param {EcPk} newReader PK of the new reader.
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
     *  Note that this method invalidates all signatures.
     *  
     *  @method removeReader
     *  @param {EcPk} oldReader PK of the old reader.
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
     *  Determines if the object is not retrievable from a repository should it be written.
     *  
     *  @method invalid
     *  @return {boolean} True if the object is NOT VALID for storage, false otherwise.
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
    /**
     *  Updates the ID timestamp of the object, for versioning purposes.
     *  @method updateTimestamp
     */
    prototype.updateTimestamp = function() {
        var rawId = this.id.substring(0, this.id.lastIndexOf("/"));
        if (rawId.endsWith("/") == false) 
            rawId += "/";
        rawId += new Date().getTime();
        this.id = rawId;
    };
    /**
     *  Returns true if the provided ID represents this object. 
     *  Use this, as version information can make direct comparison difficult.
     *  @method isId
     *  @param {string} id
     *  @return {boolean} True if the provided ID represents this object.
     */
    prototype.isId = function(id) {
        return EcRemoteLinkedData.trimVersionFromUrl(this.id).equals(EcRemoteLinkedData.trimVersionFromUrl(id));
    };
    /**
     *  Removes the version information from an identifier.
     *  Warning: Will remove identifier if the identifier is composed solely of digits!!!
     *  @method trimVersionFromUrl
     *  @static
     *  @param {string} id Slash delimited URL or path.
     *  @return ID without version.
     */
    constructor.trimVersionFromUrl = function(id) {
        if (id == null) 
            return null;
        if (!id.substring(id.lastIndexOf("/")).matches("\\/[0-9]+")) 
            return id;
        var rawId = id.substring(0, id.lastIndexOf("/"));
        if (rawId.endsWith("/")) 
            rawId = rawId.substring(0, rawId.length - 1);
        return rawId;
    };
    /**
     *  Return the ID of this object without the version information. 
     *  Used to reference the latest version of an object.
     *  
     *  @method shortId
     *  @return {string} ID of the latest version of this object.
     */
    prototype.shortId = function() {
        return EcRemoteLinkedData.trimVersionFromUrl(this.id);
    };
    /**
     *  Return the GUID portion of the short ID.
     *  @method getGuid
     *  @return {string} Guid of the linked data object.
     */
    prototype.getGuid = function() {
        var shortId = EcRemoteLinkedData.trimVersionFromUrl(this.id);
        var parts = shortId.split("/");
        return parts[parts.length - 1];
    };
    /**
     *  Return a valid ElasticSearch search string that will retrieve all objects with this type.
     *  @method getSearchStringByType
     *  @return {string} ElasticSearch compatible search string.
     */
    prototype.getSearchStringByType = function() {
        var types = this.getTypes();
        var result = "";
        for (var i = 0; i < types.length; i++) {
            if (i != 0) 
                result += " OR ";
            result += "@type:\"" + types[i] + "\"";
            var lastSlash = types[i].lastIndexOf("/");
            result += " OR (@context:\"" + types[i].substring(0, lastSlash + 1) + "\" AND @type:\"" + types[i].substring(lastSlash + 1) + "\")";
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
}, {owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
