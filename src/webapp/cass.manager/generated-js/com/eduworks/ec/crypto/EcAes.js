/**
 *  AES encryption tasks common across all variants of AES. 
 *  @author fray
 */
var EcAes = function() {};
EcAes = stjs.extend(EcAes, null, [], function(constructor, prototype) {
    /**
     *  Generates a random Initialization Vector of length @i
     *  @param i Length of initialization Vector
     *  @return String representing the new Initialization Vector in Base64 Encoding.
     */
    constructor.newIv = function(i) {
        return forge.util.encode64(forge.random.getBytesSync(i));
    };
}, {}, {});
