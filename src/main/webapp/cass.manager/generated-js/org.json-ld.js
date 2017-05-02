/**
 *  Represents a JSON-LD linked data object and performs serialization.
 *  Note: Serialization and deserialization remove parameters that begin with '@'.
 *  Note: This Linked Data Object is not assumed to have an @id field.
 *  @author fritz.ray@eduworks.com
 *  @module org.json.ld
 *  @class EcLinkedData
 */
var EcLinkedData = /**
 *  Create a linked data object.
 *  @constructor
 *  @param {string} context JSON-LD Context.
 *  @param {string} type JSON-LD Type.
 */
function(context, type) {
    this.setContextAndType(context, type);
};
EcLinkedData = stjs.extend(EcLinkedData, null, [], function(constructor, prototype) {
    /**
     *  JSON-LD @type field.
     *  @property type
     *  @type string
     */
    prototype.type = null;
    /**
     *  JSON-LD @context field.
     *  @property context
     *  @type string
     */
    prototype.context = null;
    /**
     *  Set the JSON-LD @context and @type.
     *  @method setContextAndType
     *  @param {string} context JSON-LD Context.
     *  @param {string} type JSON-LD Type.
     */
    prototype.setContextAndType = function(context, type) {
        this.context = context;
        this.type = type;
        if (type != null) {
            this.type = type.replace(context, "");
            if (this.type.startsWith("/")) 
                this.type = this.type.substring(1);
        }
    };
    constructor.atProperties = ["id", "type", "schema", "context", "signature", "owner", "reader", "encryptedType"];
    /**
     *  Determines which fields to serialize into @fields.
     *  
     *  @internal
     *  @static
     *  @method isAtProperty
     *  @param {string} key Property name to check if it should be an @property.
     *  @return {boolean} True if property is in the set of atProperties.
     */
    constructor.isAtProperty = function(key) {
        for (var i = 0; i < EcLinkedData.atProperties.length; i++) 
            if (EcLinkedData.atProperties[i].equals(key)) 
                return true;
        return false;
    };
    /**
     *  Serializes this object to JSON.
     *  
     *  @method toJson
     *  @return {string} JSON formatted object (with JSON-LD fields).
     */
    prototype.toJson = function() {
        var o = this.atIfy();
        return JSON.stringify(o);
    };
    /**
     *  Forces Javascript to encode the object in alphabetical order in order to
     *  make signature based actions more viable. Also places @(at) symbols in
     *  front of appropriate fields.
     *  
     *  @internal
     *  @method atIfy
     *  @return {Object} Serializable JSON object.
     */
    prototype.atIfy = function() {
        return this.atIfyObject(this);
    };
    prototype.atIfyArray = function(o) {
        var a = new Array();
        for (var i = 0; i < o.length; i++) {
            if (EcObject.isObject(o[i])) {
                if (stjs.isInstanceOf(o[i].constructor, EcLinkedData)) 
                    a[i] = this.atIfyObject(o[i]);
                 else {
                    a[i] = o[i];
                }
            } else if (EcArray.isArray(o[i])) 
                a[i] = this.atIfyArray(o[i]);
             else 
                a[i] = o[i];
        }
        return a;
    };
    prototype.atIfyObject = function(o) {
        var keys = new Array();
        var me = (o);
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
                if (stjs.isInstanceOf(value.constructor, EcLinkedData)) 
                    value = (value).atIfy();
                 else if (EcArray.isArray(value)) 
                    value = this.atIfyArray(value);
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
     *  @method isProbablyJson
     *  @static 
     *  @param {string} probableJson JSON to test.
     *  @return {boolean} True if it is probably JSON. False if not.
     */
    constructor.isProbablyJson = function(probableJson) {
        return probableJson.trim().startsWith("{") && probableJson.trim().endsWith("}");
    };
    /**
     *  Uses the object's fully qualified type name and compares it to the
     *  provided type.
     *  
     *  @method isA
     *  @param {string} type Fully qualified type name uri.
     *  @return {boolean} True if match, False if not.
     */
    prototype.isA = function(type) {
        var computedType = this.getFullType();
        return computedType.equals(type) || this.type.equals(type);
    };
    /**
     *  Uses the object's fully qualified type name and compares it to the
     *  provided type.
     *  
     *  @method isAny
     *  @param {string[]} type Fully qualified type name uris.
     *  @return {boolean} True if match, False if not.
     */
    prototype.isAny = function(type) {
        var computedType = this.getFullType();
        if (type.length == 0) 
            return true;
        for (var i = 0; i < type.length; i++) 
            if (type[i].equals(computedType) || type[i].equals(this.type)) 
                return true;
        return false;
    };
    /**
     *  Gets the fully qualified type name, as JSON-LD allows the "namespace" of
     *  the type to be defined in @context.
     *  
     *  @method getFullType
     *  @return {string} Fully qualified type name.
     */
    prototype.getFullType = function() {
        if (this.context == null) 
            return this.type;
        if (this.type.contains("http")) 
            return this.type;
        var computedType = this.context;
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
     *  @method copyFrom
     *  @param that The freshly deserialized object, or the object to upcast into this object.
     */
    prototype.copyFrom = function(that) {
        var me = (this);
        for (var key in me) {
            if ((typeof me[key]) != "function") 
                delete me[key];
        }
        var you = (that);
        for (var key in you) {
            if ((typeof you[key]) != "function") 
                me[key.replace("@", "")] = you[key];
        }
        this.upgrade();
        if (!this.isAny(this.getTypes())) 
             throw new RuntimeException("Incompatible type: " + this.getFullType());
    };
    /**
     *  Upgrades the object to the latest version, performing transforms and the like.
     *  
     *  @method upgrade
     */
    prototype.upgrade = function() {};
    /**
     *  Removes the @ symbol from properties in order to make them more
     *  accessible in Javascript.
     *  
     *  @method deAtify
     *  @internal
     *  @return {EcLinkedData} This object, with @ properties converted to @-less properties.
     */
    prototype.deAtify = function() {
        var me = (this);
        for (var key in me) {
            if (me[key] == null) {
                var value = me[key];
                if (value != null) 
                    if (stjs.isInstanceOf(value.constructor, EcLinkedData)) 
                        value = (value).deAtify();
                me[key.replace("@", "")] = value;
            }
        }
        return this;
    };
    /**
     *  Gets all versions of JSON-LD type strings for this type of object.
     *  
     *  @method getTypes
     *  @return {string[]} Array of URIs.
     */
    prototype.getTypes = function() {
        var a = new Array();
        if (this.context != null && this.type != null) {
            var context = (!this.context.endsWith("/") ? this.context + "/" : this.context);
            a.push(context + this.type);
        }
        return a;
    };
}, {atProperties: {name: "Array", arguments: [null]}}, {});
