/**
 *  Signature used to authorize movement of data on behalf of a private-key
 *  holding owner.
 *  
 *  @author fritz.ray@eduworks.com
 */
var EbacSignature = function() {
    EcLinkedData.call(this, Ebac.schema, "http://schema.eduworks.com/ebac/0.1/timeLimitedSignature");
};
EbacSignature = stjs.extend(EbacSignature, EcLinkedData, [], function(constructor, prototype) {
    /**
     *  The public key of the authorizing party.
     */
    prototype.owner = null;
    /**
     *  The time in number of milliseconds since midnight of January 1, 1970
     *  00:00:00 UTC that this signature is authorized to move data.
     */
    prototype.expiry = 0.0;
    /**
     *  The signature of this object, having signed the object, having been
     *  encoded in JSON with no space or tabs in ASCII sort order, having no
     *  value for the signature at the time of signing.
     */
    prototype.signature = null;
    /**
     *  The server authorized to move data. If this is empty, the signature may
     *  be used by a server to ask for data from other servers.
     */
    prototype.server = null;
}, {atProperties: {name: "Array", arguments: [null]}}, {});
