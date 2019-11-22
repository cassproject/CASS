/**
 *  Represents a JSON-LD linked data object and performs serialization.
 *  Note: Serialization and deserialization remove parameters that begin with '@'.
 *  Note: This Linked Data Object is not assumed to have an @id field.
 * 
 *  @author fritz.ray@eduworks.com
 *  @module org.json.ld
 *  @class EcLinkedData
 */
var EcLinkedData = /**
 *  Create a linked data object.
 * 
 *  @param {string} context JSON-LD Context.
 *  @param {string} type JSON-LD Type.
 *  @constructor
 */
function(context, type) {
    this.setContextAndType(context, type);
};
EcLinkedData = stjs.extend(EcLinkedData, null, [], function(constructor, prototype) {
    constructor.atProperties = ["id", "type", "schema", "context", "signature", "graph", "owner", "reader", "encryptedType", "encryptedContext"];
    /**
     *  JSON-LD @type field.
     * 
     *  @property type
     *  @type string
     */
    prototype.type = null;
    /**
     *  JSON-LD @context field.
     * 
     *  @property context
     *  @type string
     */
    prototype.context = null;
    /**
     *  Determines which fields to serialize into @fields.
     * 
     *  @param {string} key Property name to check if it should be an @property.
     *  @return {boolean} True if property is in the set of atProperties.
     *  @internal
     *  @static
     *  @method isAtProperty
     */
    constructor.isAtProperty = function(key) {
        for (var i = 0; i < EcLinkedData.atProperties.length; i++) 
            if (EcLinkedData.atProperties[i].equals(key)) 
                return true;
        return false;
    };
    /**
     *  Helper function to determine if a piece of data is probably a JSON
     *  object.
     * 
     *  @param {string} probableJson JSON to test.
     *  @return {boolean} True if it is probably JSON. False if not.
     *  @method isProbablyJson
     *  @static
     */
    constructor.isProbablyJson = function(probableJson) {
        return probableJson.trim().startsWith("{") && probableJson.trim().endsWith("}");
    };
    /**
     *  Set the JSON-LD @context and @type.
     * 
     *  @param {string} context JSON-LD Context.
     *  @param {string} type JSON-LD Type.
     *  @method setContextAndType
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
    /**
     *  Serializes this object to JSON.
     * 
     *  @return {string} JSON formatted object (with JSON-LD fields).
     *  @method toJson
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
     *  @return {Object} Serializable JSON object.
     *  @internal
     *  @method atIfy
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
            if (me["type"] != null) 
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
     *  Uses the object's fully qualified type name and compares it to the
     *  provided type.
     * 
     *  @param {string} type Fully qualified type name uri.
     *  @return {boolean} True if match, False if not.
     *  @method isA
     */
    prototype.isA = function(type) {
        var computedType = this.getFullType();
        return computedType.equals(type) || this.type.equals(type);
    };
    /**
     *  Uses the object's fully qualified type name and compares it to the
     *  provided type.
     * 
     *  @param {string[]} type Fully qualified type name uris.
     *  @return {boolean} True if match, False if not.
     *  @method isAny
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
     *  @return {string} Fully qualified type name.
     *  @method getFullType
     */
    prototype.getFullType = function() {
        if (this.context == null) 
            return this.type;
        if (this.type.indexOf("http") != -1) 
            return this.type;
        var computedType = this.context;
        if (EcObject.isObject(this.context)) {
            var typeParts = this.type.split(":");
            if (typeParts.length == 2) {
                computedType = (this.context)[typeParts[0]];
                if (!computedType.endsWith("/")) 
                    computedType += "/";
                computedType += typeParts[1];
                return computedType;
            } else if ((this.context)["@vocab"] != null) 
                computedType = (this.context)["@vocab"];
        }
        if (!computedType.endsWith("/")) 
            computedType += "/";
        computedType += this.type;
        return computedType;
    };
    /**
     *  Also could be called "upcast", for those in the know.
     *  <p>
     *  Ghetto method of copying properties from some other object. As freshly
     *  deserialized javascript objects do not inherently attach the functions of
     *  their type, it is this or factory hell.
     * 
     *  @param that The freshly deserialized object, or the object to upcast into this object.
     *  @method copyFrom
     */
    prototype.copyFrom = function(that) {
        var me = (this);
        for (var key in me) {
            if ((typeof me[key]) != "function") 
                delete me[key];
        }
        var you = (that);
        for (var key in you) {
            if ((typeof you[key]) != "function") {
                if (you["@type"] != null) 
                    me[key.replace("@", "")] = you[key];
                 else 
                    me[key] = you[key];
            }
        }
        var stripNamespace = null;
        var newContext = null;
        if (this.type != null && this.context != null && EcObject.isObject(this.context)) {
            var typeParts = this.type.split(":");
            if (typeParts.length == 2) {
                newContext = (this.context)[typeParts[0]];
                stripNamespace = typeParts[0];
                if (!newContext.endsWith("/")) 
                    newContext += "/";
            } else if ((this.context)["@vocab"] != null) 
                newContext = (this.context)["@vocab"];
        }
        if (stripNamespace != null) 
            for (var key in me) {
                if ((typeof me[key]) != "function") {
                    if (key.startsWith(stripNamespace + ":")) {
                        if (EcArray.isArray(me[key])) {
                            (me)[key.replace(stripNamespace + ":", "")] = JSON.parse(JSON.stringify(me[key]).replaceAll(stripNamespace + ":", ""));
                        } else if (EcObject.isObject(me[key])) {
                            (me)[key.replace(stripNamespace + ":", "")] = JSON.parse(JSON.stringify(me[key]).replaceAll(stripNamespace + ":", ""));
                        } else 
                            (me)[key.replace(stripNamespace + ":", "")] = me[key];
                        delete me[key];
                    }
                }
            }
        if (newContext != null) 
            this.context = newContext;
        this.upgrade();
        if (!this.isAny(this.getTypes())) 
             throw new RuntimeException("Incompatible type: " + this.getFullType());
    };
    prototype.recast = function(translationContext, targetContext, success, failure) {
        var me = this;
        var json = JSON.parse(this.toJson());
        if (targetContext == null) 
            targetContext = (json)["@context"];
        (json)["@context"] = translationContext;
        var finalTargetContext = targetContext;
        jsonld.expand(json, new Object(), function(error, actual) {
            if (error != null) {
                failure((error)["message"]);
                return;
            }
            jsonld.compact(actual, finalTargetContext, new Object(), function(s, o, o2) {
                if (s != null) {
                    failure(s);
                    return;
                }
                me.copyFrom(o);
                (me)["@context"] = finalTargetContext;
                success(me);
            });
        });
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
     *  @return {EcLinkedData} This object, with @ properties converted to @-less properties.
     *  @method deAtify
     *  @internal
     */
    prototype.deAtify = function() {
        var me = (this);
        var typeFound = false;
        if (me["@type"] != null) 
            typeFound = true;
        for (var key in me) {
            if (me[key] == null) {
                if (typeFound) {
                    var value = me[key];
                    if (value != null) 
                        if (stjs.isInstanceOf(value.constructor, EcLinkedData)) 
                            value = (value).deAtify();
                    me[key.replace("@", "")] = value;
                } else {
                    var value = me[key];
                    if (value != null) 
                        if (stjs.isInstanceOf(value.constructor, EcLinkedData)) 
                            value = (value).deAtify();
                    me[key] = value;
                }
            }
        }
        return this;
    };
    /**
     *  Gets all versions of JSON-LD type strings for this type of object.
     * 
     *  @return {string[]} Array of URIs.
     *  @method getTypes
     */
    prototype.getTypes = function() {
        var a = new Array();
        if (this.context != null && this.type != null) {
            if (!EcObject.isObject(this.context)) {
                var context = (!this.context.endsWith("/") ? this.context + "/" : this.context);
                if (this.type.indexOf(context) == 0) 
                    a.push(this.type);
                 else 
                    a.push(context + this.type);
            }
        }
        return a;
    };
    prototype.compact = function(remoteContextUrl, success, failure) {
        var me = this;
        jsonld.compact(this.toJson(), remoteContextUrl, new Object(), function(err, compacted, context) {
            if (err != null) {
                failure(err);
                return;
            }
            me.copyFrom(compacted);
            success(this);
        });
    };
}, {atProperties: {name: "Array", arguments: [null]}}, {});
