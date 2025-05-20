const chai = require('chai');
const assert = chai.assert;
const skyRepo = require('../main/server/skyRepo.js');

describe('inferTypeFromObj function', function () {
    it('should handle URLs with more than three slashes', function () {
        // Create test object with a type that has many slashes
        const testObj = {
            '@context': 'http://schema.org/context',
            '@type': 'http://schema.org/context/subcontext/subsubcontext/subsubsubcontext/myType'
        };
        
        // Call the inferTypeFromObj function
        const result = skyRepo.inferTypeFromObj(testObj);
        
        // Verify all slashes were replaced with dots
        assert.isFalse(result.includes('/'), 'Result should not contain any slashes');
        assert.equal(result, 'schema.org.context.subcontext.subsubcontext.subsubsubcontext.myType', 
            'All slashes should be replaced with dots');
    });

    it('should handle URLs with more than three colons', function () {
        // Create test object with a type that has many colons
        const testObj = {
            '@context': 'http://schema.org/context',
            '@type': 'http:schema:org:context:subcontext:type'
        };
        
        // Call the inferTypeFromObj function
        const result = skyRepo.inferTypeFromObj(testObj);
        
        // Verify all colons were replaced with dots
        assert.isFalse(result.includes(':'), 'Result should not contain any colons');
        assert.equal(result, 'http.schema.org.context.subcontext.type', 
            'All colons should be replaced with dots');
    });
});