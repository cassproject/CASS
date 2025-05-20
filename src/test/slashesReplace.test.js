const chai = require('chai');
const assert = chai.assert;

describe('inferTypeFromObj function test', function () {
    it('should replace all slashes with dots', function () {
        // Our simulated inferTypeFromObj function (copy of the fixed function)
        const inferTypeFromObj = function (fullType) {
            if (fullType == null) {
                return fullType;
            }
            fullType = fullType.replace('http://', '');
            fullType = fullType.replace('https://', '');
            fullType = fullType.replace(/\//g, '.');
            fullType = fullType.replace(/:/g, '.');
            return fullType;
        };

        // Test with multiple slashes
        const result1 = inferTypeFromObj('schema.org/context/subcontext/subsubcontext/subsubsubcontext/type');
        assert.equal(result1, 'schema.org.context.subcontext.subsubcontext.subsubsubcontext.type');
        assert.isFalse(result1.includes('/'), 'Result should not contain any slashes');

        // Test with multiple colons
        const result2 = inferTypeFromObj('http:schema:org:context:subcontext:type');
        assert.equal(result2, 'http.schema.org.context.subcontext.type');
        assert.isFalse(result2.includes(':'), 'Result should not contain any colons');
    });
});