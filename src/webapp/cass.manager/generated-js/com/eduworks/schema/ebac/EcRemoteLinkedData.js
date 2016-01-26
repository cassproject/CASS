var EcRemoteLinkedData = function(schema, type) {
    EcLinkedData.call(this, schema, type);
};
EcRemoteLinkedData = stjs.extend(EcRemoteLinkedData, EcLinkedData, [], function(constructor, prototype) {
    prototype.owner = null;
    prototype.signature = null;
    prototype.id = null;
    prototype.generateId = function(server) {
        this.id = server;
        if (!this.id.endsWith("/")) 
            this.id += "/";
        this.id += EcRandom.generateUUID();
        this.id += "/";
        this.id += new Date().getTime();
    };
    prototype.hasOwner = function(pk) {
        var pkPem = pk.toPem();
        for (var i = 0; i < this.owner.length; i++) 
            if (pkPem.equals(EcPk.fromPem(this.owner[i]).toPem())) 
                return true;
        return false;
    };
    prototype.toSignableJson = function() {
        var d = JSON.parse(this.toJson());
        delete (d)["@signature"];
        return d.toJson();
    };
}, {owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
