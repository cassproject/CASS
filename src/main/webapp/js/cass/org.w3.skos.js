/**
 *  www.w3.org/2004/02/skos/core/Collection
 *  A meaningful collection of concepts.
 *  Labelled collections can be used where you would like a set of concepts to be displayed under a 'node label' in the hierarchy.
 *  @author w3.org
 *  @class Collection
 *  @module org.w3.skos
 */
var Collection = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    EcRemoteLinkedData.call(this, "http://schema.cassproject.org/0.3/skos/", "Collection");
};
Collection = stjs.extend(Collection, EcRemoteLinkedData, [], function(constructor, prototype) {
    /**
     *  www.w3.org/2004/02/skos/core/member
     *  Relates a collection to one of its members.
     *  @property member
     *  @type N0e403dc85fe548d1b3d2f3d1ded36d20
     */
    prototype.member = null;
}, {member: {name: "Array", arguments: ["Object"]}, owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  www.w3.org/2004/02/skos/core/Concept
 *  An idea or notion; a unit of thought.
 *  @author w3.org
 *  @class Concept
 *  @module org.w3.skos
 */
var Concept = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    EcRemoteLinkedData.call(this, "https://schema.cassproject.org/0.3/skos/", "Concept");
};
Concept = stjs.extend(Concept, EcRemoteLinkedData, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.cassproject.org/0.3/skos/Concept";
    constructor.TYPE_0_2 = "https://schema.cassproject.org/0.3/skos/Concept";
    constructor.myType = Concept.TYPE_0_2;
    /**
     *  www.w3.org/2004/02/skos/core/topConceptOf
     *  Relates a concept to the concept scheme that it is a top level concept of.
     *  @property topConceptOf
     *  @type ConceptScheme
     */
    prototype.topConceptOf = null;
    /**
     *  www.w3.org/2004/02/skos/core/semanticRelation
     *  Links a concept to a concept related by meaning.
     *  @property semanticRelation
     *  @type Concept
     */
    prototype.semanticRelation = null;
    prototype.upgrade = function() {
        EcLinkedData.prototype.upgrade.call(this);
        if (Concept.TYPE_0_1.equals(this.getFullType())) {
            this.setContextAndType("https://schema.cassproject.org/0.3/skos", Concept.TYPE_0_2);
        }
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(Concept.TYPE_0_2);
        a.push(Concept.TYPE_0_1);
        return a;
    };
}, {topConceptOf: "ConceptScheme", semanticRelation: "Concept", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  www.w3.org/2004/02/skos/core/ConceptScheme
 *  A set of concepts, optionally including statements about semantic relationships between those concepts.
 *  A concept scheme may be defined to include concepts from different sources.
 *  @author w3.org
 *  @class ConceptScheme
 *  @module org.w3.skos
 */
var ConceptScheme = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    EcRemoteLinkedData.call(this, "https://schema.cassproject.org/0.3/skos/", "ConceptScheme");
};
ConceptScheme = stjs.extend(ConceptScheme, EcRemoteLinkedData, [], function(constructor, prototype) {
    constructor.TYPE_0_1 = "http://schema.cassproject.org/0.3/skos/ConceptScheme";
    constructor.TYPE_0_2 = "https://schema.cassproject.org/0.3/skos/ConceptScheme";
    constructor.myType = ConceptScheme.TYPE_0_2;
    /**
     *  www.w3.org/2004/02/skos/core/hasTopConcept
     *  Relates, by convention, a concept scheme to a concept which is topmost in the broader/narrower concept hierarchies for that scheme, providing an entry point to these hierarchies.
     *  @property hasTopConcept
     *  @type Concept
     */
    prototype.hasTopConcept = null;
    prototype.upgrade = function() {
        EcLinkedData.prototype.upgrade.call(this);
        if (ConceptScheme.TYPE_0_1.equals(this.getFullType())) {
            this.setContextAndType("https://schema.cassproject.org/0.3/skos", ConceptScheme.TYPE_0_2);
        }
    };
    prototype.getTypes = function() {
        var a = new Array();
        a.push(ConceptScheme.TYPE_0_2);
        a.push(ConceptScheme.TYPE_0_1);
        return a;
    };
}, {hasTopConcept: "Concept", owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
/**
 *  www.w3.org/2004/02/skos/core/OrderedCollection
 *  An ordered collection of concepts, where both the grouping and the ordering are meaningful.
 *  Ordered collections can be used where you would like a set of concepts to be displayed in a specific order, and optionally under a 'node label'.
 *  @author w3.org
 *  @class OrderedCollection
 *  @module org.w3.skos
 *  @extends Collection
 */
var OrderedCollection = /**
 *  Constructor, automatically sets @context and @type.
 *  @constructor
 */
function() {
    Collection.call(this);
    this.context = "http://schema.cassproject.org/0.3/skos/";
    this.type = "OrderedCollection";
};
OrderedCollection = stjs.extend(OrderedCollection, Collection, [], function(constructor, prototype) {
    /**
     *  www.w3.org/2004/02/skos/core/memberList
     *  Relates an ordered collection to the RDF list containing its members.
     *  @property memberList
     *  @type List
     */
    prototype.memberList = null;
}, {memberList: {name: "Array", arguments: ["Object"]}, member: {name: "Array", arguments: ["Object"]}, owner: {name: "Array", arguments: [null]}, signature: {name: "Array", arguments: [null]}, reader: {name: "Array", arguments: [null]}, atProperties: {name: "Array", arguments: [null]}}, {});
