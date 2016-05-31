/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
var EcLinkedData = function(context, type) {
    this.setContextAndType(context, type);
};
EcLinkedData = stjs.extend(EcLinkedData, null, [], function(constructor, prototype) {
    /**
     *  Represents the @type field in JSON-LD.
     */
    prototype.type = null;
    /**
     *  Represents the @context field in JSON-LD.
     */
    prototype.context = null;
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
        return this.atIfyObject(this);
    };
    prototype.atIfyArray = function(o) {
        var a = new Array();
        for (var i = 0; i < o.length; i++) {
            if (stjs.isInstanceOf(o[i].constructor, EcLinkedData)) 
                a[i] = this.atIfyObject(o[i]);
             else if (EcArray.isArray(o[i])) 
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
     *  Uses the object's fully qualified type name and compares it to the
     *  provided type.
     *  
     *  @param type
     *             Fully qualified type name uri.
     *  @return True if match, False if not.
     */
    prototype.isAny = function(type) {
        var computedType = this.getFullType();
        for (var i = 0; i < type.length; i++) 
            if (computedType.equals(type[i]) || this.type.equals(type[i])) 
                return true;
        return false;
    };
    /**
     *  Gets the fully qualified type name, as JSON-LD allows the "namespace" of
     *  the type to be defined in @context.
     *  
     *  @return Fully qualified type name.
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
     *  @param that
     *             The freshly deserialized object, or the object to upcast into
     *             this object.
     */
    prototype.copyFrom = function(that) {
        var me = (this);
        var you = (that);
        this.upgrade();
        for (var key in you) {
            if (me[key] == null) 
                me[key.replace("@", "")] = you[key];
        }
        if (!this.isAny(this.getTypes())) 
             throw new RuntimeException("Incompatible type: " + this.getFullType());
    };
    /**
     *  Upgrades the object if necessary.
     */
    prototype.upgrade = function() {};
    /**
     *  Removes the @ symbol from properties in order to make them more
     *  accessible in Javascript.
     *  
     *  @return This object, with @ properties converted to @-less properties.
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
     *  @return Array of URIs.
     */
    prototype.getTypes = function() {
        var a = new Array();
        a.push(this.type);
        return a;
    };
}, {atProperties: {name: "Array", arguments: [null]}}, {});
