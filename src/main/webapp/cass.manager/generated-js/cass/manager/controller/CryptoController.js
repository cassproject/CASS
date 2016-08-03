/**
 *  Used to encrypt fields in the RepoEdit module, not used much in the admin UI, probably want
 *  to phase out or use better when rewriting the repoEdit/View/Create screens.
 *  
 *  @author devlin.junker@eduworks.com
 */
var CryptoController = function() {};
CryptoController = stjs.extend(CryptoController, null, [], function(constructor, prototype) {
    prototype.identity = null;
    /**
     *  Encrypts the text passed in
     *  
     *  @param text 
     *  			Value to be encrypted
     *  @param id
     *  			Id of the object that contains the field being encrypted
     *  @param fieldName 
     * 				(Not used) unsure why the encrypt function asks for this...
     *  @return EcEncryptedValue containing the encrypted text
     */
    prototype.encryptField = function(text, id, fieldName) {
        if (this.identity.selectedIdentity == null) {
            return null;
        }
        return EcEncryptedValue.encryptValueOld(text, id, fieldName, this.identity.selectedIdentity.ppk.toPk()).atIfy();
    };
    /**
     *  Attempts to decrypt the EcEncryptedValue passed in using the users identities stored in the 
     *  EcIdentityManager
     *  
     *  @param encryptedObject
     *  			EcEncryptedValue to be attempted to be decrypted (not sure why it is a string though...)
     *  @return Decrypted string value
     */
    prototype.decryptField = function(encryptedObject) {
        var e = new EcEncryptedValue();
        e.copyFrom(JSON.parse(encryptedObject));
        return e.decryptIntoString();
    };
}, {identity: "IdentityController"}, {});
