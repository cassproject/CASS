/**
 *  Helper class that immediately reflects changes into its remote repository.
 *  @author fritz.ray@eduworks.com
 */
var EcAlignment = function() {
    Relation.call(this);
};
EcAlignment = stjs.extend(EcAlignment, Relation, [], function(constructor, prototype) {
    prototype.setName = function(name) {
        this.name = name;
    };
    prototype.setDescription = function(description) {
        this.description = description;
    };
}, {mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  Helper class that immediately reflects changes into its remote repository.
 *  @author fritz.ray@eduworks.com
 */
var EcLevel = function() {
    Level.call(this);
};
EcLevel = stjs.extend(EcLevel, Level, [], function(constructor, prototype) {
    prototype.addRelationship = function(level, targetLevel, alignmentType, identity, server) {
        var a = new EcAlignment();
        a.source = this.id;
        a.target = targetLevel.id;
        a.relationType = alignmentType;
        a.addOwner(identity.toPk());
        a.generateId(server);
        a.signWith(identity);
    };
    prototype.setName = function(name) {
        this.name = name;
    };
    prototype.setDescription = function(description) {
        this.description = description;
    };
}, {mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  Helper class that immediately reflects changes into its remote repository.
 *  @author fritz.ray@eduworks.com
 */
var EcCompetency = function() {
    Competency.call(this);
};
EcCompetency = stjs.extend(EcCompetency, Competency, [], function(constructor, prototype) {
    constructor.RELATIONSHIP_TYPE_REQUIRES = "requires";
    constructor.RELATIONSHIP_TYPE_DESIRES = "desires";
    constructor.RELATIONSHIP_TYPE_IS_ENABLED_BY = "isEnabledBy";
    constructor.RELATIONSHIP_TYPE_IS_RELATED_TO = "isRelatedTo";
    constructor.RELATIONSHIP_TYPE_IS_EQUIVALENT_TO = "isEquivalentTo";
    constructor.RELATIONSHIP_TYPE_LEVEL_GREATER_THAN = "greaterThan";
    constructor.RELATIONSHIP_TYPE_LEVEL_IS_EQUIVALENT_TO = "isEquivalentTo";
    constructor.RELATIONSHIP_TYPE_LEVEL_OVERLAPS = "overlaps";
    prototype.addAlignment = function(target, alignmentType, owner, server) {
        var a = new EcAlignment();
        a.generateId(server);
        a.source = this.id;
        a.target = target.id;
        a.relationType = alignmentType;
        a.addOwner(owner.toPk());
    };
    prototype.relationships = function(repo, success, failure) {
        repo.search("type:\"" + EcAlignment.myType + "\" AND (source:\"" + this.id + "\" OR destination:\"" + this.id + "\")", function(p1) {
            var a = new EcAlignment();
            a.copyFrom(p1);
            success(a);
        }, null, failure);
    };
    prototype.addLevel = function(name, description, owner, server) {
        var l = new EcLevel();
        l.generateId(server);
        l.competency = this.id;
        l.description = description;
        l.name = name;
        l.addOwner(owner.toPk());
    };
    prototype.levels = function(repo, success, failure) {
        repo.search("type:\"" + EcLevel.myType + "\" AND competency:\"" + this.id + "\"", function(p1) {
            var a = new EcLevel();
            a.copyFrom(p1);
            success(a);
        }, null, failure);
    };
    prototype.setName = function(name) {
        this.name = name;
    };
    prototype.setDescription = function(description) {
        this.description = description;
    };
    prototype.setScope = function(scope) {
        this.scope = scope;
    };
}, {mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
var EcFramework = function() {
    Framework.call(this);
};
EcFramework = stjs.extend(EcFramework, Framework, [], function(constructor, prototype) {
    prototype.addCompetency = function(id) {
        id = EcRemoteLinkedData.trimVersionFromUrl(id);
        if (this.competency == null) 
            this.competency = new Array();
        for (var i = 0; i < this.competency.length; i++) 
            if (this.competency[i].equals(id)) 
                return;
        this.competency.push(id);
    };
    prototype.removeCompetency = function(id2, success, failure) {
        var id = EcRemoteLinkedData.trimVersionFromUrl(id2);
        if (this.competency == null) 
            this.competency = new Array();
        for (var i = 0; i < this.competency.length; i++) 
            if (this.competency[i].equals(id)) 
                this.competency.splice(i, 1);
        if (this.relation == null && this.level == null) 
            success("");
        if (this.relation != null) {
            this.removeRelationshipsThatInclude(id, 0, success, failure);
        }
        if (this.level != null) {
            this.removeLevelsThatInclude(id, 0, success, failure);
        }
    };
    prototype.removeRelationshipsThatInclude = function(id, i, success, failure) {
        var me = this;
        if (i >= this.relation.length) 
            success("");
         else 
            EcRepository.get(this.relation[i], function(p1) {
                var a = new EcAlignment();
                a.copyFrom(p1);
                if (a.source == id || a.target == id) {
                    me.relation.splice(i, 1);
                    me.removeRelationshipsThatInclude(id, i, success, failure);
                } else 
                    me.removeRelationshipsThatInclude(id, i + 1, success, failure);
            }, failure);
    };
    prototype.removeLevelsThatInclude = function(id, i, success, failure) {
        var me = this;
        if (i >= this.level.length) 
            success("");
         else 
            EcRepository.get(this.level[i], function(p1) {
                var a = new EcLevel();
                a.copyFrom(p1);
                if (a.competency == id) {
                    me.level.splice(i, 1);
                    me.removeLevelsThatInclude(id, i, success, failure);
                } else 
                    me.removeLevelsThatInclude(id, i + 1, success, failure);
            }, failure);
    };
    prototype.addRelation = function(id) {
        id = EcRemoteLinkedData.trimVersionFromUrl(id);
        if (this.relation == null) 
            this.relation = new Array();
        for (var i = 0; i < this.relation.length; i++) 
            if (this.relation[i].equals(id)) 
                return;
        this.relation.push(id);
    };
    prototype.removeRelation = function(id) {
        id = EcRemoteLinkedData.trimVersionFromUrl(id);
        if (this.relation == null) 
            this.relation = new Array();
        for (var i = 0; i < this.relation.length; i++) 
            if (this.relation[i].equals(id)) 
                this.relation.splice(i, 1);
    };
    prototype.addLevel = function(id) {
        id = EcRemoteLinkedData.trimVersionFromUrl(id);
        if (this.level == null) 
            this.level = new Array();
        for (var i = 0; i < this.level.length; i++) 
            if (this.level[i].equals(id)) 
                return;
        this.level.push(id);
    };
    prototype.removeLevel = function(id) {
        id = EcRemoteLinkedData.trimVersionFromUrl(id);
        if (this.level == null) 
            this.level = new Array();
        for (var i = 0; i < this.level.length; i++) 
            if (this.level[i].equals(id)) 
                this.level.splice(i, 1);
    };
}, {competency: {name: "Array", arguments: [null]}, relation: {name: "Array", arguments: [null]}, level: {name: "Array", arguments: [null]}, source: "Source", mainEntityOfPage: "Object", image: "Object", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
var CompetencyManager = function() {};
CompetencyManager = stjs.extend(CompetencyManager, null, [], function(constructor, prototype) {
    constructor.get = function(id, success, failure) {
        EcRepository.get(id, function(p1) {
            if (success == null) 
                return;
            if (!p1.isA(EcCompetency.myType)) {
                if (failure != null) 
                    failure("Resultant object is not a competency.");
                return;
            }
            var c = new EcCompetency();
            c.copyFrom(p1);
            success(c);
        }, function(p1) {
            if (failure != null) 
                failure(p1);
        });
    };
}, {}, {});
