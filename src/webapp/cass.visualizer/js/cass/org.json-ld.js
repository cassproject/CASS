var EcLinkedData = function(schema, type) {
    this.schema = schema;
    this.type = type;
};
EcLinkedData = stjs.extend(EcLinkedData, null, [], function(constructor, prototype) {
    /**
     *  Represents the @type field in JSON-LD.
     */
    prototype.type = null;
    /**
     *  Represents the @schema field in JSON-LD.
     */
    prototype.schema = null;
    constructor.atProperties = ["id", "type", "schema", "context", "signature", "owner", "encryptedType"];
    /**
     *  Determines which fields to serialize into @fields.
     *  
     *  @param s
     *  @return
     */
    constructor.isAtProperty = function(s) {
        for (var i = 0; i < EcLinkedData.atProperties.length; i++) 
            if (EcLinkedData.atProperties[i].equals(s)) 
                return true;
        return false;
    };
    prototype.toJson = function() {
        var o = this.atIfy();
        return JSON.stringify(o);
    };
    /**
     *  Forces Javascript to encode the object in alphabetical order in order to
     *  make signature based actions more viable. Also places @(at) symbols in
     *  front of appropriate fields.
     *  
     *  @return Serializable JSON object.
     */
    prototype.atIfy = function() {
        var keys = new Array();
        var me = (this);
        for (var key in me) {
            if (EcLinkedData.isAtProperty(key)) 
                key = "@" + key;
            keys.push(key);
        }
        keys.sort(function(a, b) {
            return a.compareTo(b);
        });
        var op = (new Object());
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = me[key.replace("@", "")];
            if (value != null) 
                op[key] = value;
             else 
                value = me[key];
            if (value != null) 
                op[key] = value;
        }
        return op;
    };
    /**
     *  Helper function to determine if a piece of data is probably a JSON
     *  object.
     *  
     *  @param probableJson
     *  @return True if is probably JSON. False if not.
     */
    constructor.isProbablyJson = function(probableJson) {
        return probableJson.trim().startsWith("{") && probableJson.trim().endsWith("}");
    };
    /**
     *  Uses the object's fully qualified type name and compares it to the
     *  provided type.
     *  
     *  @param type
     *             Fully qualified type name uri.
     *  @return True if match, False if not.
     */
    prototype.isA = function(type) {
        var computedType = this.getFullType();
        return computedType.equals(type) || this.type.equals(type);
    };
    /**
     *  Gets the fully qualified type name, as JSON-LD allows the "namespace" of
     *  the type to be defined in @schema.
     *  
     *  @return Fully qualified type name.
     */
    prototype.getFullType = function() {
        var computedType = this.schema;
        if (this.type.contains("http") == false && computedType.contains("http") == false) 
            computedType = (this)["context"].toString();
        if (!computedType.endsWith("/")) 
            computedType += "/";
        computedType += this.type;
        return computedType;
    };
    /**
     *  Also could be called "upcast", for those in the know.
     *  
     *  Ghetto method of copying properties from some other object. As freshly
     *  deserialized javascript objects do not inherently attach the functions of
     *  their type, it is this or factory hell.
     *  
     *  @param that
     *             The freshly deserialized object, or the object to upcast into
     *             this object.
     */
    prototype.copyFrom = function(that) {
        var me = (this);
        var you = (that);
        for (var key in you) {
            if (me[key] == null) 
                me[key.replace("@", "")] = you[key];
        }
    };
    /**
     *  Removes the @ symbol from properties in order to make them more
     *  accessible in Javascript.
     *  
     *  @return This object, with @ properties converted to @-less properties.
     */
    prototype.deAtify = function() {
        var me = (this);
        for (var key in me) {
            if (me[key] == null) 
                me[key.replace("@", "")] = me[key];
        }
        return this;
    };
}, {atProperties: {name: "Array", arguments: [null]}}, {});
