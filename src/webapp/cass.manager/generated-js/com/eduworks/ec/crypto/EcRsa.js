var EcRsa = function() {};
EcRsa = stjs.extend(EcRsa, null, [], function(constructor, prototype) {
    prototype.encrypt = function(pk, text) {};
    prototype.decrypt = function(ppk, text) {};
    prototype.sign = function(ppk, text) {};
    prototype.verify = function(pk, text, signature) {};
}, {}, {});
