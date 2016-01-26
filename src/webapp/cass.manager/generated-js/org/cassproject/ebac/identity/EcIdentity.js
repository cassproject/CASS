/**
 *  An identity is an alias that a person or system may own. It consists of a
 *  private key and a display name. Using the private key we may: 1. Perform all
 *  operations of a EcContact. 2. Decrypt messages using our private key. 3. Sign
 *  messages, ensuring the recipient knows that we sent the message and it was
 *  not altered.
 *  
 *  @author fray
 */
var EcIdentity = function() {
    this.displayName = "Alias " + EcIdentity.identityCounter++;
};
EcIdentity = stjs.extend(EcIdentity, null, [], function(constructor, prototype) {
    constructor.identityCounter = 1;
    prototype.ppk = null;
    prototype.displayName = null;
    prototype.source = null;
    prototype.equals = function(obj) {
        if (stjs.isInstanceOf(obj.constructor, EcIdentity)) 
            return this.ppk.equals((obj).ppk);
        return Object.prototype.equals.call(this, obj);
    };
    /**
     *  Helper function to encrypt an identity into a credential (storable
     *  version of an identity)
     *  
     *  @param secret
     *             AES secret used to encrypt the credential.
     *  @return Encrypted credential object.
     */
    prototype.toCredential = function(secret) {
        var c = new EbacCredential();
        c.iv = EcAes.newIv(32);
        c.ppk = EcAesCtr.encrypt(this.ppk.toPem(), secret, c.iv);
        c.displayNameIv = EcAes.newIv(32);
        c.displayName = EcAesCtr.encrypt(this.displayName, secret, c.iv);
        return c;
    };
    /**
     *  Helper function to decrypt a credential (storable version of an identity)
     *  into an identity)
     *  
     *  @param credential
     *             Credential to decrypt.
     *  @param secret
     *             AES secret used to decrypt the credential.
     *  @param source
     *             Source of the credential, used to track where a credential
     *             came from.
     *  @return Decrypted identity object, ready for use.
     */
    constructor.fromCredential = function(credential, secret, source) {
        var i = new EcIdentity();
        i.ppk = EcPpk.fromPem(EcAesCtr.decrypt(credential.ppk, secret, credential.iv));
        i.source = source;
        if (credential.displayName != null && credential.displayNameIv != null) 
            i.displayName = EcAesCtr.decrypt(credential.displayName, secret, credential.iv);
        return i;
    };
}, {ppk: "EcPpk"}, {});
