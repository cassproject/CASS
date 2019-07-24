var NodePacket = function() {
    this.nodeList = new Array();
    this.nodeMap = {};
};
NodePacket = stjs.extend(NodePacket, null, [], function(constructor, prototype) {
    prototype.nodeList = null;
    prototype.nodeMap = null;
    prototype.getNodeList = function() {
        return this.nodeList;
    };
    prototype.setNodeList = function(nodeList) {
        this.nodeList = nodeList;
    };
    prototype.getNodeCount = function() {
        return this.nodeList.length;
    };
    prototype.addNode = function(n) {
        if (this.nodeMap[n.getId()] == null) {
            this.nodeList.push(n);
            this.nodeMap[n.getId()] = n;
        }
    };
    prototype.toString = function() {
        var ret = "";
        ret = ret + "NodePacket: (";
        for (var i = 0; i < this.nodeList.length; i++) {
            if ((i + 1) < this.nodeList.length) 
                ret = ret + this.nodeList[i].toString() + ", ";
             else 
                ret = ret + this.nodeList[i].toString();
        }
        ret = ret + ")";
        return ret;
    };
}, {nodeList: {name: "Array", arguments: ["Node"]}, nodeMap: {name: "Map", arguments: [null, "Node"]}}, {});
var Node = function(nameId) {
    this.name = nameId;
    this.id = nameId;
};
Node = stjs.extend(Node, null, [], function(constructor, prototype) {
    prototype.name = null;
    prototype.id = null;
    prototype.description = null;
    prototype.getName = function() {
        return this.name;
    };
    prototype.setName = function(name) {
        this.name = name;
    };
    prototype.getId = function() {
        return this.id;
    };
    prototype.setId = function(id) {
        this.id = id;
    };
    prototype.getDescription = function() {
        return this.description;
    };
    prototype.setDescription = function(description) {
        this.description = description;
    };
    prototype.toString = function() {
        return "Node: \"" + this.id + "\"";
    };
}, {}, {});
var ArrayUtil = function() {};
ArrayUtil = stjs.extend(ArrayUtil, null, [], function(constructor, prototype) {
    constructor.arrayContains = function(a, o) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] == o) 
                return true;
        }
        return false;
    };
    constructor.arrayRemove = function(a, o) {
        var retArray = new Array();
        for (var i = 0; i < a.length; i++) {
            if (a[i] != o) 
                retArray.push(a[i]);
        }
        return retArray;
    };
    constructor.arrayLastIndexOf = function(a, o) {
        for (var i = (a.length - 1); i >= 0; i--) {
            if (a[i] == o) 
                return i;
        }
        return -1;
    };
    constructor.arrayToString = function(a) {
        if (a == null || a.length == 0) 
            return "<Emtpy>";
        var ret = "";
        for (var i = 0; i < a.length; i++) {
            if ((i + 1) < a.length) 
                ret = ret + a[i].toString() + ", ";
             else 
                ret = ret + a[i].toString();
        }
        return ret;
    };
}, {}, {});
var NodeRelation = function(source, target, type) {
    this.source = source;
    this.target = target;
    this.type = type;
};
NodeRelation = stjs.extend(NodeRelation, null, [], function(constructor, prototype) {
    prototype.type = null;
    prototype.source = null;
    prototype.target = null;
    prototype.getSource = function() {
        return this.source;
    };
    prototype.setSource = function(source) {
        this.source = source;
    };
    prototype.getTarget = function() {
        return this.target;
    };
    prototype.setTarget = function(target) {
        this.target = target;
    };
    prototype.getType = function() {
        return this.type;
    };
    prototype.setType = function(type) {
        this.type = type;
    };
    prototype.toString = function() {
        return this.getSource().toString() + " >>" + this.getType() + "<< " + this.getTarget().toString();
    };
}, {type: {name: "Enum", arguments: ["RelationType.RELATION_TYPE"]}, source: "Node", target: "Node"}, {});
var RelationType = function() {};
RelationType = stjs.extend(RelationType, null, [], function(constructor, prototype) {
    constructor.RELATION_TYPE = stjs.enumeration("IS_EQUIVALENT_TO", "NARROWS", "BROADENS", "REQUIRES", "IS_REQUIRED_BY");
}, {}, {});
var NodeRelationMap = function() {
    this.nodeList = new Array();
    this.relationMap = {};
};
NodeRelationMap = stjs.extend(NodeRelationMap, null, [], function(constructor, prototype) {
    prototype.nodeList = null;
    prototype.relationMap = null;
    prototype.addNodeRelations = function(n, rm) {
        this.nodeList.push(n);
        this.relationMap[n.getId()] = rm;
    };
    prototype.getRelationsForNode = function(n) {
        return this.relationMap[n.getId()];
    };
    prototype.getNodeList = function() {
        return this.nodeList;
    };
    prototype.setNodeList = function(nodeList) {
        this.nodeList = nodeList;
    };
    prototype.getRelationMap = function() {
        return this.relationMap;
    };
    prototype.setRelationMap = function(relationMap) {
        this.relationMap = relationMap;
    };
    prototype.toString = function() {
        var ret = "";
        var n;
        var nra;
        for (var i = 0; i < this.nodeList.length; i++) {
            n = this.nodeList[i];
            ret = ret + n.toString() + "\n";
            nra = this.relationMap[n.getId()];
            for (var j = 0; j < nra.length; j++) {
                ret = ret + "\t" + nra[j].toString() + "\n";
            }
        }
        return ret;
    };
}, {nodeList: {name: "Array", arguments: ["Node"]}, relationMap: {name: "Map", arguments: [null, {name: "Array", arguments: ["NodeRelation"]}]}}, {});
/**
 *  Created by fray on 5/30/17.
 */
var AssertionCoprocessor = function() {};
AssertionCoprocessor = stjs.extend(AssertionCoprocessor, null, [], function(constructor, prototype) {
    prototype.assertionProcessor = null;
    prototype.collectAssertions = function(ip, listOfCompetencies, success) {
        success(new Array());
    };
    prototype.mutateAssertions = function(ip, listOfCompetencies, success) {
        success();
    };
}, {assertionProcessor: "AssertionProcessor"}, {});
/**
 *  Data structure used to hold data relevant to a request to determine the competence of an individual.
 *  (hereafter, "Inquiry")
 * 
 *  @author fritz.ray@eduworks.com
 *  @author tom.buskirk@eduworks.com
 *  @class InquiryPacket
 *  @module org.cassproject
 */
var InquiryPacket = /**
 *  Create an InquiryPacket.
 * 
 *  @param {EcPk[]}                  subject Public keys of the individual to retreive assertions about.
 *  @param {EcCompetency}            competency Competency that the inquiry is made about.
 *  @param {EcLevel}                 level Level of the competency.
 *  @param {EcFramework}             context Framework to provide boundaries for the inquiry within.
 *  @param {function(InquiryPacket)} success Method to call when a result has been reached.
 *  @param {function(string)}        failure Method to call if the inquiry fails.
 *  @param {string}                  rule For rollup rules, this is a search used to populate this inquiry packet.
 *  @param {IPType}                  type The type of this inquiry packet. May be competency, rollup rule, or relation.
 *  @constructor
 */
function(subject, competency, level, context, success, failure, rule, type) {
    this.positive = new Array();
    this.negative = new Array();
    this.equivalentPackets = new Array();
    this.subPackets = new Array();
    this.dateCreated = new Date().getTime();
    this.subject = subject;
    this.competency = new Array();
    if (competency != null) 
        this.competency.push(competency);
    this.level = new Array();
    if (level != null) 
        this.level.push(level);
    this.context = context;
    this.success = success;
    this.failure = failure;
    this.rule = rule;
    this.type = type;
    this.result = null;
    this.log = "";
};
InquiryPacket = stjs.extend(InquiryPacket, null, [], function(constructor, prototype) {
    prototype.root = false;
    /**
     *  One or more identifiers that identify an individual.
     * 
     *  @property subject
     *  @type EcPk[]
     */
    prototype.subject = null;
    /**
     *  Competency that this packet is inquiring about.
     *  May be multiple competencies that are either collapsed due to an inference loop, or are equivalent to one another.
     * 
     *  @property competency
     *  @type EcCompetency[]
     */
    prototype.competency = null;
    /**
     *  Framework that this inquiry is scoped to.
     * 
     *  @property context
     *  @type EcFramework
     */
    prototype.context = null;
    /**
     *  Callback when this and all child inquiries have successfully reached a conclusion.
     * 
     *  @property success
     *  @type function(InquiryPacket)
     */
    prototype.success = null;
    /**
     *  Callback if this inquiry requires additional information to proceed.
     * 
     *  @property ask
     *  @type string function(string)
     */
    prototype.ask = null;
    /**
     *  Callback if this inquiry fails.
     * 
     *  @property failure
     *  @type function(string)
     */
    prototype.failure = null;
    /**
     *  Level that the competency is being measured at.
     *  May have multiple levels referring to multiple competencies due to cycles or equivalence.
     * 
     *  @property level
     *  @type EcLevel[]
     */
    prototype.level = null;
    /**
     *  Packets that are equivalent to this packet. May be used when equivalence is best represented with additional packets.
     * 
     *  @property equivalentPackets
     *  @type InquiryPacket[]
     */
    prototype.equivalentPackets = null;
    /**
     *  Packets that assist in determining the state of this packet.
     * 
     *  @property subPackets
     *  @type InquiryPacket[]
     */
    prototype.subPackets = null;
    /**
     *  Datetime representing when this packet was created.
     * 
     *  @property dateCreated
     *  @internal
     *  @type number
     */
    prototype.dateCreated = 0.0;
    /**
     *  Mark true when assertions have been retrieved for this packet.
     * 
     *  @property hasCheckedAssertionsForCompetency
     *  @type boolean
     */
    prototype.hasCheckedAssertionsForCompetency = false;
    /**
     *  Mark true when rollup rules have been processed for this packet.
     * 
     *  @property hasCheckedRollupRulesForCompetency
     *  @type boolean
     */
    prototype.hasCheckedRollupRulesForCompetency = false;
    /**
     *  Mark true when relations have been processed for this packet.
     * 
     *  @property hasCheckedRelationshipsForCompetency
     *  @type boolean
     */
    prototype.hasCheckedRelationshipsForCompetency = false;
    /**
     *  Async counter to keep track of number of unresolved processes.
     * 
     *  @property numberOfQueriesRunning
     *  @type integer
     */
    prototype.numberOfQueriesRunning = 0;
    /**
     *  Local log for this inquiry packet.
     * 
     *  @property log
     *  @type string
     */
    prototype.log = null;
    /**
     *  Assertions (direct or indirect) that contribute to a positive result.
     * 
     *  @property positive
     *  @type EcAssertion[]
     */
    prototype.positive = null;
    /**
     *  Assertions (direct or indirect) that contribute to a negative result.
     * 
     *  @property negative
     *  @type EcAssertion[]
     */
    prototype.negative = null;
    /**
     *  Set to true if this packet has completed processing.
     * 
     *  @property finished
     *  @type boolean
     */
    prototype.finished = false;
    /**
     *  Set to true if this packet has finished stage one.
     * 
     *  @property stageOneFinished
     *  @type boolean
     */
    prototype.stageOneComplete = false;
    /**
     *  Type of inquiry packet. Inquiry packets can represent relational logic, rollup logic or competencies.
     * 
     *  @property type
     *  @type IPType
     */
    prototype.type = null;
    /**
     *  Rollup Rule search string. (if IPType == ROLLUPRULE)
     * 
     *  @property rule
     *  @type string
     */
    prototype.rule = null;
    /**
     *  Result as a ResultType. ResultType is an autogenerated Enum object, and result._name may match "TRUE", "FALSE", "UNKNOWN", "INDETERMINANT"
     * 
     *  @property result
     *  @type ResultType
     */
    prototype.result = null;
    prototype.getContext = function() {
        return this.context;
    };
    /**
     *  Returns true if any child packets have an indeterminate result.
     * 
     *  @return {boolean}
     *  @method anyIndeterminantChildPackets
     */
    prototype.anyIndeterminantChildPackets = function() {
        for (var i = 0; i < this.equivalentPackets.length; i++) {
            if (InquiryPacket.ResultType.INDETERMINANT.equals(this.equivalentPackets[i].result)) 
                return true;
        }
        for (var i = 0; i < this.subPackets.length; i++) {
            if (InquiryPacket.ResultType.INDETERMINANT.equals(this.subPackets[i].result)) 
                return true;
        }
        return false;
    };
    /**
     *  Returns true if all child packets have unknown results.
     * 
     *  @return {boolean}
     *  @method allChildPacketsUnknown
     */
    prototype.allChildPacketsUnknown = function() {
        for (var i = 0; i < this.equivalentPackets.length; i++) {
            if (!InquiryPacket.ResultType.UNKNOWN.equals(this.equivalentPackets[i].result)) 
                return false;
        }
        for (var i = 0; i < this.subPackets.length; i++) {
            if (!InquiryPacket.ResultType.UNKNOWN.equals(this.subPackets[i].result)) 
                return false;
        }
        return true;
    };
    /**
     *  Returns true if all child packets have unknown results.
     * 
     *  @return {boolean}
     *  @method allChildPacketsUnknown
     */
    prototype.allChildPacketsAreTrue = function() {
        for (var i = 0; i < this.equivalentPackets.length; i++) {
            if (!InquiryPacket.ResultType.TRUE.equals(this.equivalentPackets[i].result)) 
                return false;
        }
        for (var i = 0; i < this.subPackets.length; i++) {
            if (!InquiryPacket.ResultType.TRUE.equals(this.subPackets[i].result)) 
                return false;
        }
        return true;
    };
    /**
     *  Returns true if any child packets have false results.
     * 
     *  @return {boolean}
     *  @method anyChildPacketsAreFalse
     */
    prototype.anyChildPacketsAreFalse = function() {
        for (var i = 0; i < this.equivalentPackets.length; i++) {
            if (InquiryPacket.ResultType.FALSE.equals(this.equivalentPackets[i].result)) 
                return true;
        }
        for (var i = 0; i < this.subPackets.length; i++) {
            if (InquiryPacket.ResultType.FALSE.equals(this.subPackets[i].result)) 
                return true;
        }
        return false;
    };
    /**
     *  Returns true if any child packets have unknown results.
     * 
     *  @return {boolean}
     *  @method anyChildPacketsAreUnknown
     */
    prototype.anyChildPacketsAreUnknown = function() {
        for (var i = 0; i < this.equivalentPackets.length; i++) {
            if (InquiryPacket.ResultType.UNKNOWN.equals(this.equivalentPackets[i].result)) 
                return true;
        }
        for (var i = 0; i < this.subPackets.length; i++) {
            if (InquiryPacket.ResultType.UNKNOWN.equals(this.subPackets[i].result)) 
                return true;
        }
        return false;
    };
    /**
     *  Returns true if any child packets have true results.
     * 
     *  @return {boolean}
     *  @method anyChildPacketsAreTrue
     */
    prototype.anyChildPacketsAreTrue = function() {
        for (var i = 0; i < this.equivalentPackets.length; i++) {
            if (InquiryPacket.ResultType.TRUE.equals(this.equivalentPackets[i].result)) 
                return true;
        }
        for (var i = 0; i < this.subPackets.length; i++) {
            if (InquiryPacket.ResultType.TRUE.equals(this.subPackets[i].result)) 
                return true;
        }
        return false;
    };
    /**
     *  Returns true if all equivalent packets have unknown results.
     * 
     *  @return {boolean}
     *  @method allEquivalentPacketsUnknown
     */
    prototype.allEquivalentPacketsUnknown = function() {
        for (var i = 0; i < this.equivalentPackets.length; i++) {
            if (!InquiryPacket.ResultType.UNKNOWN.equals(this.equivalentPackets[i].result)) 
                return false;
        }
        return true;
    };
    /**
     *  Returns true if all equivalent packets have the true or unknown result.
     * 
     *  @return {boolean}
     *  @method allEquivalentPacketsTrueOrUnknown
     */
    prototype.allEquivalentPacketsTrueOrUnknown = function() {
        for (var i = 0; i < this.equivalentPackets.length; i++) {
            if (InquiryPacket.ResultType.FALSE.equals(this.equivalentPackets[i].result) || InquiryPacket.ResultType.INDETERMINANT.equals(this.equivalentPackets[i].result)) 
                return false;
        }
        return true;
    };
    /**
     *  Returns true if all sub packets have the true or unknown result.
     * 
     *  @return {boolean}
     *  @method allSubPacketsTrueOrUnknown
     */
    prototype.allSubPacketsTrueOrUnknown = function() {
        for (var i = 0; i < this.subPackets.length; i++) {
            if (InquiryPacket.ResultType.FALSE.equals(this.subPackets[i].result) || InquiryPacket.ResultType.INDETERMINANT.equals(this.subPackets[i].result)) 
                return false;
        }
        return true;
    };
    /**
     *  Returns true if all equivalent packets have the false or unknown result.
     * 
     *  @return {boolean}
     *  @method allEquivalentPacketsFalseOrUnknown
     */
    prototype.allEquivalentPacketsFalseOrUnknown = function() {
        for (var i = 0; i < this.equivalentPackets.length; i++) {
            if (InquiryPacket.ResultType.TRUE.equals(this.equivalentPackets[i].result) || InquiryPacket.ResultType.INDETERMINANT.equals(this.equivalentPackets[i].result)) 
                return false;
        }
        return true;
    };
    /**
     *  Returns true if all sub packets have the false or unknown result.
     * 
     *  @return
     */
    prototype.allSubPacketsFalseOrUnknown = function() {
        for (var i = 0; i < this.subPackets.length; i++) {
            if (InquiryPacket.ResultType.TRUE.equals(this.subPackets[i].result) || InquiryPacket.ResultType.INDETERMINANT.equals(this.subPackets[i].result)) 
                return false;
        }
        return true;
    };
    /**
     *  Returns true if the provided ID represents a competency in this packet.
     * 
     *  @param competencyId
     *  @return
     */
    prototype.hasId = function(competencyId) {
        for (var i = 0; i < this.competency.length; i++) 
            if (this.competency[i].isId(competencyId)) 
                return true;
        return false;
    };
    constructor.IPType = stjs.enumeration("COMPETENCY", "ROLLUPRULE", "RELATION_AND", "RELATION_OR", "RELATION_NARROWS", "RELATION_BROADENS", "RELATION_REQUIRES", "RELATION_ISREQUIREDBY");
    constructor.ResultType = stjs.enumeration("TRUE", "FALSE", "UNKNOWN", "INDETERMINANT");
}, {subject: {name: "Array", arguments: ["EcPk"]}, competency: {name: "Array", arguments: ["EcCompetency"]}, context: "EcFramework", success: {name: "Callback1", arguments: ["InquiryPacket"]}, ask: {name: "Function1", arguments: [null, null]}, failure: {name: "Callback1", arguments: [null]}, level: {name: "Array", arguments: ["EcLevel"]}, equivalentPackets: {name: "Array", arguments: ["InquiryPacket"]}, subPackets: {name: "Array", arguments: ["InquiryPacket"]}, positive: {name: "Array", arguments: ["EcAssertion"]}, negative: {name: "Array", arguments: ["EcAssertion"]}, type: {name: "Enum", arguments: ["InquiryPacket.IPType"]}, result: {name: "Enum", arguments: ["InquiryPacket.ResultType"]}}, {});
var RrToken = function() {};
RrToken = stjs.extend(RrToken, null, [], function(constructor, prototype) {
    prototype.number = null;
    prototype.bool = null;
}, {}, {});
var RrQuery = function() {};
RrQuery = stjs.extend(RrQuery, null, [], function(constructor, prototype) {
    prototype.query = null;
}, {}, {});
var RrS = function() {
    this.token = new Array();
    this.query = new Array();
};
RrS = stjs.extend(RrS, null, [], function(constructor, prototype) {
    prototype.token = null;
    prototype.query = null;
    prototype.addToken = function(rrToken) {
        this.token.push(rrToken);
    };
    prototype.addQuery = function(rrQuery) {
        this.query.push(rrQuery);
    };
}, {token: {name: "Array", arguments: ["RrToken"]}, query: {name: "Array", arguments: ["RrQuery"]}}, {});
var RollupRuleInterface = function(input, processor) {
    var chars = new antlr4.InputStream(input);
    var lexer = new RollupLexer.RollupLexer(chars);
    var tokens = new antlr4.CommonTokenStream(lexer);
    this.parser = new RollupParser.RollupParser(tokens);
    this.parser.buildParseTrees = true;
    this.listener = new RollupListener.RollupListener();
    this.processor = processor;
    var me = this;
    this.listener.enterS = function(ctx) {
        me.processor.enterS(ctx);
    };
    this.listener.exitS = function(ctx) {
        me.processor.exitS(ctx);
        me.success(true);
    };
    this.listener.exitToken = function(ctx) {
        me.processor.exitToken(ctx);
    };
    this.listener.enterQuery = function(ctx) {
        me.processor.enterQuery(ctx);
    };
    this.listener.exitQuery = function(ctx) {
        me.processor.exitQuery(ctx);
    };
    this.listener.exitInnerquery = function(ctx) {
        me.processor.exitInnerquery(ctx);
    };
    this.listener.exitLogical_or_math_operator = function(ctx) {
        me.processor.exitLogical_or_math_operator(ctx);
    };
    this.parser.addParseListener(this.listener);
};
RollupRuleInterface = stjs.extend(RollupRuleInterface, null, [], function(constructor, prototype) {
    prototype.logFunction = null;
    prototype.success = null;
    prototype.failure = null;
    prototype.listener = null;
    prototype.parser = null;
    prototype.processor = null;
    prototype.go = function() {
        this.processor.logFunction = this.logFunction;
        this.processor.success = this.success;
        this.processor.failure = this.failure;
        this.parser.s();
    };
}, {logFunction: {name: "Callback1", arguments: ["Object"]}, success: {name: "Callback1", arguments: [null]}, failure: {name: "Callback1", arguments: [null]}, listener: "RollupListener.RollupListener", parser: "RollupParser.RollupParser", processor: "RollupRuleProcessor"}, {});
var ExceptionReturn = function(errorMessage) {
    this.errorMessage = errorMessage;
};
ExceptionReturn = stjs.extend(ExceptionReturn, null, [], function(constructor, prototype) {
    prototype.errorMessage = null;
    prototype.getErrorMessage = function() {
        return this.errorMessage;
    };
    prototype.setErrorMessage = function(errorMessage) {
        this.errorMessage = errorMessage;
    };
    prototype.getJsonString = function() {
        return JSON.stringify(this);
    };
}, {}, {});
var PapDependencyParms = function() {};
PapDependencyParms = stjs.extend(PapDependencyParms, null, [], function(constructor, prototype) {
    prototype.parentIndex = null;
    prototype.childIndex = null;
    prototype.type = null;
    prototype.weight = null;
    prototype.leak = null;
    prototype.dependencyFirst = false;
    prototype.reverse = false;
    prototype.getParentIndex = function() {
        return this.parentIndex;
    };
    prototype.setParentIndex = function(parentIndex) {
        this.parentIndex = parentIndex;
    };
    prototype.getChildIndex = function() {
        return this.childIndex;
    };
    prototype.setChildIndex = function(childIndex) {
        this.childIndex = childIndex;
    };
    prototype.getType = function() {
        return this.type;
    };
    prototype.setType = function(type) {
        this.type = type;
    };
    prototype.getWeight = function() {
        return this.weight;
    };
    prototype.setWeight = function(weight) {
        this.weight = weight;
    };
    prototype.getLeak = function() {
        return this.leak;
    };
    prototype.setLeak = function(leak) {
        this.leak = leak;
    };
    prototype.getDependencyFirst = function() {
        return this.dependencyFirst;
    };
    prototype.setDependencyFirst = function(dependencyFirst) {
        this.dependencyFirst = dependencyFirst;
    };
    prototype.getReverse = function() {
        return this.reverse;
    };
    prototype.setReverse = function(reverse) {
        this.reverse = reverse;
    };
    prototype.swapParentChildIndexes = function() {
        var temp = this.parentIndex;
        this.parentIndex = this.childIndex;
        this.childIndex = temp;
    };
}, {}, {});
var PacketRelation = function(source, target, type) {
    this.source = source;
    this.target = target;
    this.type = type;
};
PacketRelation = stjs.extend(PacketRelation, null, [], function(constructor, prototype) {
    prototype.type = null;
    prototype.source = null;
    prototype.target = null;
    prototype.getSource = function() {
        return this.source;
    };
    prototype.setSource = function(source) {
        this.source = source;
    };
    prototype.getTarget = function() {
        return this.target;
    };
    prototype.setTarget = function(target) {
        this.target = target;
    };
    prototype.getType = function() {
        return this.type;
    };
    prototype.setType = function(type) {
        this.type = type;
    };
    prototype.toString = function() {
        return this.getSource().toString() + " >>" + this.getType() + "<< " + this.getTarget().toString();
    };
}, {type: {name: "Enum", arguments: ["RelationType.RELATION_TYPE"]}, source: "NodePacket", target: "NodePacket"}, {});
var PapDependencyDefinitionBase = function(depClass, reverse, weight, leak) {
    this.depClass = depClass;
    this.reverse = reverse;
    this.weight = weight;
    this.leak = leak;
};
PapDependencyDefinitionBase = stjs.extend(PapDependencyDefinitionBase, null, [], function(constructor, prototype) {
    prototype.depClass = null;
    prototype.reverse = false;
    prototype.weight = null;
    prototype.leak = null;
    prototype.getDepClass = function() {
        return this.depClass;
    };
    prototype.setDepClass = function(depClass) {
        this.depClass = depClass;
    };
    prototype.getReverse = function() {
        return this.reverse;
    };
    prototype.setReverse = function(reverse) {
        this.reverse = reverse;
    };
    prototype.getWeight = function() {
        return this.weight;
    };
    prototype.setWeight = function(weight) {
        this.weight = weight;
    };
    prototype.getLeak = function() {
        return this.leak;
    };
    prototype.setLeak = function(leak) {
        this.leak = leak;
    };
}, {}, {});
var EcGraphUtil = function() {};
EcGraphUtil = stjs.extend(EcGraphUtil, null, [], function(constructor, prototype) {
    constructor.buildIdSearchQueryForIdList = function(idList) {
        var searchQuery = "";
        if (idList.length > 1) 
            searchQuery = "(";
        for (var i = 0; i < idList.length; i++) {
            if (i > 0) 
                searchQuery += " OR ";
            searchQuery += "(\\*@id:\"" + idList[i] + "\")";
        }
        if (idList.length > 1) 
            searchQuery += ")";
        return searchQuery;
    };
}, {}, {});
var SimpleAssertion = function(id, competencyId, confidence) {
    this.id = id;
    this.competencyId = competencyId;
    this.confidence = confidence;
};
SimpleAssertion = stjs.extend(SimpleAssertion, null, [], function(constructor, prototype) {
    prototype.id = null;
    prototype.subjectPem = null;
    prototype.competencyId = null;
    prototype.confidence = null;
    prototype.assertionDate = null;
    prototype.expirationDate = null;
    prototype.negative = null;
    prototype.getId = function() {
        return this.id;
    };
    prototype.setId = function(id) {
        this.id = id;
    };
    prototype.getSubjectPem = function() {
        return this.subjectPem;
    };
    prototype.setSubjectPem = function(subjectPem) {
        this.subjectPem = subjectPem;
    };
    prototype.getCompetencyId = function() {
        return this.competencyId;
    };
    prototype.setCompetencyId = function(competencyId) {
        this.competencyId = competencyId;
    };
    prototype.getConfidence = function() {
        return this.confidence;
    };
    prototype.setConfidence = function(confidence) {
        this.confidence = confidence;
    };
    prototype.getAssertionDate = function() {
        return this.assertionDate;
    };
    prototype.setAssertionDate = function(assertionDate) {
        this.assertionDate = assertionDate;
    };
    prototype.getExpirationDate = function() {
        return this.expirationDate;
    };
    prototype.setExpirationDate = function(expirationDate) {
        this.expirationDate = expirationDate;
    };
    prototype.isNegative = function() {
        return this.negative;
    };
    prototype.setNegative = function(negative) {
        this.negative = negative;
    };
}, {}, {});
var PapCompetencyNetwork = function(dependencies, numberNodes, settings) {
    this.numberNodes = numberNodes;
    this.dependencies = dependencies;
    this.activations = new Array();
    this.alphas = new Array();
    this.betas = new Array();
    this.updated = new Array();
    for (var i = 0; i < numberNodes; i++) {
        var beta_prior = settings.getBetaPrecision();
        var beta_mean = settings.getBetaMean();
        this.alphas.push(beta_mean * beta_prior);
        this.betas.push((1.0 - beta_mean) * beta_prior);
        this.activations.push(beta_mean);
        this.updated.push(false);
    }
};
PapCompetencyNetwork = stjs.extend(PapCompetencyNetwork, null, [], function(constructor, prototype) {
    constructor.LOW_CONFLICT_CLASS = "low";
    constructor.MEDIUM_CONFLICT_CLASS = "medium";
    constructor.HIGH_CONFLICT_CLASS = "high";
    constructor.EMPTY_PREDICTION = 0.0;
    constructor.EMPTY_CONFLICT_LEVEL = 0.0;
    constructor.MEDIUM_CONFLICT_CLASS_QUALIFIER = 1.05;
    constructor.HIGH_CONFLICT_CLASS_QUALIFIER = 1.5;
    prototype.dependencies = null;
    prototype.activations = null;
    prototype.alphas = null;
    prototype.betas = null;
    prototype.updated = null;
    prototype.numberNodes = 0;
    prototype.update = function(nodeIndex, change, positive) {
        var a = this.alphas[nodeIndex];
        var b = this.betas[nodeIndex];
        if (positive) 
            this.alphas[nodeIndex] = a + change;
         else 
            this.betas[nodeIndex] = b + change;
        this.activations[nodeIndex] = (a + (positive ? change : 0)) / (a + b + change);
        this.updated[nodeIndex] = true;
    };
    prototype.getPrediction = function(index) {
        if (this.updated[index]) {
            return this.activations[index];
        } else 
            return PapCompetencyNetwork.EMPTY_PREDICTION;
    };
    prototype.getConflictLevel = function(index) {
        if (this.updated[index]) {
            var a = this.alphas[index];
            var b = this.betas[index];
            var act = this.activations[index];
            var stdev = Math.sqrt((a * b) / (a + b + 1)) / (a + b);
            return Math.min(act, 1.0 - act) / stdev;
        } else 
            return PapCompetencyNetwork.EMPTY_CONFLICT_LEVEL;
    };
    prototype.getConflictClass = function(index) {
        var level = this.getConflictLevel(index);
        var res = PapCompetencyNetwork.LOW_CONFLICT_CLASS;
        if (level >= PapCompetencyNetwork.MEDIUM_CONFLICT_CLASS_QUALIFIER) 
            res = PapCompetencyNetwork.MEDIUM_CONFLICT_CLASS;
        if (level >= PapCompetencyNetwork.HIGH_CONFLICT_CLASS_QUALIFIER) 
            res = PapCompetencyNetwork.HIGH_CONFLICT_CLASS;
        return res;
    };
    prototype.getDependencies = function() {
        return this.dependencies;
    };
    prototype.setDependencies = function(dependencies) {
        this.dependencies = dependencies;
    };
    prototype.getActivations = function() {
        return this.activations;
    };
    prototype.setActivations = function(activations) {
        this.activations = activations;
    };
    prototype.getAlphas = function() {
        return this.alphas;
    };
    prototype.setAlphas = function(alphas) {
        this.alphas = alphas;
    };
    prototype.getBetas = function() {
        return this.betas;
    };
    prototype.setBetas = function(betas) {
        this.betas = betas;
    };
    prototype.getUpdated = function() {
        return this.updated;
    };
    prototype.setUpdated = function(updated) {
        this.updated = updated;
    };
    prototype.getNumberNodes = function() {
        return this.numberNodes;
    };
    prototype.setNumberNodes = function(numberNodes) {
        this.numberNodes = numberNodes;
    };
}, {dependencies: {name: "Map", arguments: [null, {name: "Map", arguments: [null, {name: "Array", arguments: ["PapDependency"]}]}]}, activations: {name: "Array", arguments: [null]}, alphas: {name: "Array", arguments: [null]}, betas: {name: "Array", arguments: [null]}, updated: {name: "Array", arguments: [null]}}, {});
var PapUpdate = function(index, change, positive) {
    this.index = index;
    this.change = change;
    this.visited = new Array();
    this.positive = positive;
};
PapUpdate = stjs.extend(PapUpdate, null, [], function(constructor, prototype) {
    prototype.index = 0;
    prototype.visited = null;
    prototype.change = 0.0;
    prototype.positive = false;
    prototype.hasVisited = function(index) {
        for (var i = 0; i < this.visited.length; i++) {
            if (this.visited[i].intValue() == index) 
                return true;
        }
        return false;
    };
    prototype.updateChild = function(index, change) {
        var res = new PapUpdate(index, change, this.positive);
        res.setVisited(this.cloneVisited());
        res.getVisited().push(index);
        return res;
    };
    prototype.toString = function() {
        var sign = this.positive ? "+" : "-";
        return "<update " + this.index + " | " + sign + this.change + ">";
    };
    prototype.compare = function(other) {
        var diff = this.change - other.getChange();
        if (diff < 0) 
            return 1;
        if (diff > 0) 
            return -1;
        return 0;
    };
    prototype.cloneVisited = function() {
        var newVis = new Array();
        for (var i = 0; i < this.visited.length; i++) {
            newVis.push(this.visited[i]);
        }
        return newVis;
    };
    prototype.getIndex = function() {
        return this.index;
    };
    prototype.setIndex = function(index) {
        this.index = index;
    };
    prototype.getVisited = function() {
        return this.visited;
    };
    prototype.setVisited = function(visited) {
        this.visited = visited;
    };
    prototype.getChange = function() {
        return this.change;
    };
    prototype.setChange = function(change) {
        this.change = change;
    };
    prototype.getPositive = function() {
        return this.positive;
    };
    prototype.setPositive = function(positive) {
        this.positive = positive;
    };
}, {visited: {name: "Array", arguments: [null]}}, {});
var CgEdge = function(source, target, relation) {
    this.source = source;
    this.target = target;
    this.relation = relation;
};
CgEdge = stjs.extend(CgEdge, null, [], function(constructor, prototype) {
    prototype.source = null;
    prototype.target = null;
    prototype.relation = null;
    prototype.getSource = function() {
        return this.source;
    };
    prototype.setSource = function(source) {
        this.source = source;
    };
    prototype.getTarget = function() {
        return this.target;
    };
    prototype.setTarget = function(target) {
        this.target = target;
    };
    prototype.getRelation = function() {
        return this.relation;
    };
    prototype.setRelation = function(relation) {
        this.relation = relation;
    };
}, {}, {});
var PapCompetencyPrediction = function() {};
PapCompetencyPrediction = stjs.extend(PapCompetencyPrediction, null, [], function(constructor, prototype) {
    prototype.competencyId = null;
    prototype.confidence = 0.0;
    prototype.conflictLevel = 0.0;
    prototype.conflictClass = null;
    prototype.getCompetencyId = function() {
        return this.competencyId;
    };
    prototype.setCompetencyId = function(competencyId) {
        this.competencyId = competencyId;
    };
    prototype.getConfidence = function() {
        return this.confidence;
    };
    prototype.setConfidence = function(confidence) {
        this.confidence = confidence;
    };
    prototype.getConflictLevel = function() {
        return this.conflictLevel;
    };
    prototype.setConflictLevel = function(conflictLevel) {
        this.conflictLevel = conflictLevel;
    };
    prototype.getConflictClass = function() {
        return this.conflictClass;
    };
    prototype.setConflictClass = function(conflictClass) {
        this.conflictClass = conflictClass;
    };
}, {}, {});
var PapSettings = function() {
    this.iterations = PapSettings.DEFAULT_ITERATIONS;
    this.abruptExpiration = PapSettings.DEFAULT_ABRUPT_EXP;
    this.gradualForgetting = PapSettings.DEFAULT_GRAD_FORGETTING;
    this.evidenceWeight = PapSettings.DEFAULT_EVIDENCE_WEIGHT;
    this.discount = PapSettings.DEFAULT_DISCOUNT;
    this.priorityQueueThreshold = PapSettings.DEFAULT_PRIORITY_QUEUE_THRESHOLD;
    this.betaPrecision = PapSettings.DEFAULT_BETA_PRECISION;
    this.betaMean = PapSettings.DEFAULT_BETA_MEAN;
};
PapSettings = stjs.extend(PapSettings, null, [], function(constructor, prototype) {
    constructor.DEFAULT_ITERATIONS = 200;
    constructor.DEFAULT_ABRUPT_EXP = false;
    constructor.DEFAULT_GRAD_FORGETTING = true;
    constructor.DEFAULT_EVIDENCE_WEIGHT = 1.0;
    constructor.DEFAULT_DISCOUNT = 1.0;
    constructor.DEFAULT_PRIORITY_QUEUE_THRESHOLD = 0.01;
    constructor.DEFAULT_BETA_PRECISION = 0.1;
    constructor.DEFAULT_BETA_MEAN = 0.2;
    prototype.iterations = null;
    prototype.abruptExpiration = false;
    prototype.gradualForgetting = false;
    prototype.evidenceWeight = null;
    prototype.discount = null;
    prototype.priorityQueueThreshold = null;
    prototype.betaPrecision = null;
    prototype.betaMean = null;
    prototype.getIterations = function() {
        return this.iterations;
    };
    prototype.setIterations = function(iterations) {
        this.iterations = iterations;
    };
    prototype.getAbruptExpiration = function() {
        return this.abruptExpiration;
    };
    prototype.setAbruptExpiration = function(abruptExpiration) {
        this.abruptExpiration = abruptExpiration;
    };
    prototype.getGradualForgetting = function() {
        return this.gradualForgetting;
    };
    prototype.setGradualForgetting = function(gradualForgetting) {
        this.gradualForgetting = gradualForgetting;
    };
    prototype.getEvidenceWeight = function() {
        return this.evidenceWeight;
    };
    prototype.setEvidenceWeight = function(evidenceWeight) {
        this.evidenceWeight = evidenceWeight;
    };
    prototype.getDiscount = function() {
        return this.discount;
    };
    prototype.setDiscount = function(discount) {
        this.discount = discount;
    };
    prototype.getPriorityQueueThreshold = function() {
        return this.priorityQueueThreshold;
    };
    prototype.setPriorityQueueThreshold = function(priorityQueueThreshold) {
        this.priorityQueueThreshold = priorityQueueThreshold;
    };
    prototype.getBetaPrecision = function() {
        return this.betaPrecision;
    };
    prototype.setBetaPrecision = function(betaPrecision) {
        this.betaPrecision = betaPrecision;
    };
    prototype.getBetaMean = function() {
        return this.betaMean;
    };
    prototype.setBetaMean = function(betaMean) {
        this.betaMean = betaMean;
    };
}, {}, {});
var PapAssertion = function(confidence, competencyIndex, assertionDate, expirationDate, result) {
    this.confidence = confidence;
    this.assertionDate = assertionDate;
    this.expirationDate = expirationDate;
    this.result = result;
    this.competencyIndex = competencyIndex;
};
PapAssertion = stjs.extend(PapAssertion, null, [], function(constructor, prototype) {
    prototype.confidence = null;
    prototype.competencyIndex = null;
    prototype.assertionDate = null;
    prototype.expirationDate = null;
    prototype.result = false;
    prototype.getConfidence = function() {
        return this.confidence;
    };
    prototype.setConfidence = function(confidence) {
        this.confidence = confidence;
    };
    prototype.getCompetencyIndex = function() {
        return this.competencyIndex;
    };
    prototype.setCompetencyIndex = function(competencyIndex) {
        this.competencyIndex = competencyIndex;
    };
    prototype.getAssertionDate = function() {
        return this.assertionDate;
    };
    prototype.setAssertionDate = function(assertionDate) {
        this.assertionDate = assertionDate;
    };
    prototype.getExpirationDate = function() {
        return this.expirationDate;
    };
    prototype.setExpirationDate = function(expirationDate) {
        this.expirationDate = expirationDate;
    };
    prototype.getResult = function() {
        return this.result;
    };
    prototype.setResult = function(result) {
        this.result = result;
    };
}, {}, {});
var NodeGraph = function() {
    this.nodeList = new Array();
    this.relationList = new Array();
    this.nodeMap = {};
    this.relationMap = {};
};
NodeGraph = stjs.extend(NodeGraph, null, [], function(constructor, prototype) {
    prototype.nodeList = null;
    prototype.nodeMap = null;
    prototype.relationList = null;
    prototype.relationMap = null;
    prototype.addNode = function(n) {
        if (this.nodeMap[n.getId()] == null) {
            this.nodeList.push(n);
            this.nodeMap[n.getId()] = n;
        }
    };
    prototype.createImpliedRelations = function() {
        try {
            var relationsToAdd = new Array();
            var nr;
            for (var i = 0; i < this.relationList.length; i++) {
                nr = this.relationList[i];
                if (nr.getType() == RelationType.RELATION_TYPE.NARROWS) {
                    relationsToAdd.push(new NodeRelation(nr.getTarget(), nr.getSource(), RelationType.RELATION_TYPE.BROADENS));
                } else if (nr.getType() == RelationType.RELATION_TYPE.REQUIRES) {
                    relationsToAdd.push(new NodeRelation(nr.getTarget(), nr.getSource(), RelationType.RELATION_TYPE.IS_REQUIRED_BY));
                } else if (nr.getType() == RelationType.RELATION_TYPE.BROADENS) {
                    relationsToAdd.push(new NodeRelation(nr.getTarget(), nr.getSource(), RelationType.RELATION_TYPE.NARROWS));
                } else if (nr.getType() == RelationType.RELATION_TYPE.IS_REQUIRED_BY) {
                    relationsToAdd.push(new NodeRelation(nr.getTarget(), nr.getSource(), RelationType.RELATION_TYPE.REQUIRES));
                }
            }
            var nnr;
            for (var i = 0; i < relationsToAdd.length; i++) {
                nnr = relationsToAdd[i];
                this.addRelation(nnr.getSource(), nnr.getTarget(), nnr.getType());
            }
        }catch (e) {
             throw new Exception("createImpliedRelations: " + e.toString());
        }
    };
    prototype.addRelation = function(sourceNode, targetNode, relationType) {
        try {
            if (sourceNode == null || targetNode == null) 
                return;
            var nodeRelationList;
            if (this.nodeHasRelations(sourceNode)) 
                nodeRelationList = this.getRelationListForNode(sourceNode);
             else {
                nodeRelationList = new Array();
                this.relationMap[sourceNode.getId()] = nodeRelationList;
            }
            var newNodeRelation = new NodeRelation(sourceNode, targetNode, relationType);
            if (!this.doesRelationAlreadyExist(newNodeRelation, nodeRelationList)) {
                nodeRelationList.push(newNodeRelation);
                this.relationList.push(newNodeRelation);
            }
        }catch (e) {
             throw new Exception("addRelation: " + e.toString());
        }
    };
    prototype.getRelationListForNode = function(n) {
        return this.relationMap[n.getId()];
    };
    prototype.getNarrowsIsRequiredByEqualsRelationListForNode = function(n) {
        var retList = new Array();
        if (this.relationMap[n.getId()] != null) {
            var nra = this.relationMap[n.getId()];
            var nr;
            for (var i = 0; i < nra.length; i++) {
                nr = nra[i];
                if (nr.getType() == RelationType.RELATION_TYPE.IS_EQUIVALENT_TO || nr.getType() == RelationType.RELATION_TYPE.NARROWS || nr.getType() == RelationType.RELATION_TYPE.IS_REQUIRED_BY) {
                    retList.push(nr);
                }
            }
        }
        return retList;
    };
    prototype.getBroadensRequiresEqualsRelationListForNode = function(n) {
        var retList = new Array();
        if (this.relationMap[n.getId()] != null) {
            var nra = this.relationMap[n.getId()];
            var nr;
            for (var i = 0; i < nra.length; i++) {
                nr = nra[i];
                if (nr.getType() == RelationType.RELATION_TYPE.IS_EQUIVALENT_TO || nr.getType() == RelationType.RELATION_TYPE.BROADENS || nr.getType() == RelationType.RELATION_TYPE.REQUIRES) {
                    retList.push(nr);
                }
            }
        }
        return retList;
    };
    prototype.getNodeList = function() {
        return this.nodeList;
    };
    prototype.setNodeList = function(nodeList) {
        this.nodeList = nodeList;
    };
    prototype.getRelationList = function() {
        return this.relationList;
    };
    prototype.setRelationList = function(relationList) {
        this.relationList = relationList;
    };
    prototype.nodeHasRelations = function(n) {
        if (this.relationMap[n.getId()] == null) 
            return false;
        return true;
    };
    prototype.doesRelationAlreadyExist = function(nodeRelation, nodeRelationList) {
        var nr;
        for (var i = 0; i < nodeRelationList.length; i++) {
            nr = nodeRelationList[i];
            if (nodeRelation.getSource().getId() == nr.getSource().getId() && nodeRelation.getTarget().getId() == nr.getTarget().getId() && nodeRelation.getType() == nr.getType()) 
                return true;
        }
        return false;
    };
    prototype.toStringGraphAll = function() {
        var ret = "";
        var n;
        for (var i = 0; i < this.nodeList.length; i++) {
            n = this.nodeList[i];
            ret = ret + n.toString() + "\n";
        }
        var nr;
        for (var i = 0; i < this.relationList.length; i++) {
            nr = this.relationList[i];
            ret = ret + nr.toString() + "\n";
        }
        return ret;
    };
    prototype.toStringGraphByNode = function() {
        var ret = "";
        ret = ret + " - TEST HOWDY - \n";
        var n;
        var nra;
        var nr;
        for (var i = 0; i < this.nodeList.length; i++) {
            n = this.nodeList[i];
            ret = ret + "   --> " + n.toString() + "\n";
            if (this.nodeHasRelations(n)) {
                nra = this.getRelationListForNode(n);
                for (var j = 0; j < nra.length; j++) {
                    nr = nra[j];
                    ret = ret + "\t\t" + nr.toString() + "\n";
                }
            } else 
                ret = ret + "\t\t---------NO RELATIONSHIPS---------\n";
        }
        return ret;
    };
    prototype.toStringGraphByNodeSplit = function() {
        var ret = "";
        var n;
        var nra;
        var nr;
        for (var i = 0; i < this.nodeList.length; i++) {
            n = this.nodeList[i];
            ret = ret + "   --> " + n.toString() + "\n";
            if (this.nodeHasRelations(n)) {
                ret = ret + "\t\t=== Narrows/isRequiredBy ===\n";
                nra = this.getNarrowsIsRequiredByEqualsRelationListForNode(n);
                for (var j = 0; j < nra.length; j++) {
                    nr = nra[j];
                    ret = ret + "\t\t" + nr.toString() + "\n";
                }
                ret = ret + "\t\t=== Broadens/Requires ===\n";
                nra = this.getBroadensRequiresEqualsRelationListForNode(n);
                for (var j = 0; j < nra.length; j++) {
                    nr = nra[j];
                    ret = ret + "\t\t" + nr.toString() + "\n";
                }
            } else 
                ret = ret + "\t\t---------NO RELATIONSHIPS---------\n";
        }
        return ret;
    };
}, {nodeList: {name: "Array", arguments: ["Node"]}, nodeMap: {name: "Map", arguments: [null, "Node"]}, relationList: {name: "Array", arguments: ["NodeRelation"]}, relationMap: {name: "Map", arguments: [null, {name: "Array", arguments: ["NodeRelation"]}]}}, {});
var RollupRulePacketGenerator = function(ip, ep) {
    this.ip = ip;
    this.ep = ep;
    this.queries = new Array();
    this.queryOperations = new Array();
};
RollupRulePacketGenerator = stjs.extend(RollupRulePacketGenerator, null, [], function(constructor, prototype) {
    prototype.queries = null;
    prototype.queryOperations = null;
    prototype.ip = null;
    prototype.ep = null;
    constructor.main = function(args) {};
    prototype.addQuery = function(query) {
        this.queries.push(query);
    };
    prototype.addQueryOperation = function(operation) {
        this.queryOperations.push(operation);
    };
    prototype.hasOrOperation = function() {
        for (var i = 0; i < this.queryOperations.length; i++) {
            if (RollupRulePacketGenerator.OperationType.OR.equals(this.queryOperations[i])) 
                return true;
        }
        return false;
    };
    prototype.getIPType = function() {
        if (this.hasOrOperation()) 
            return InquiryPacket.IPType.RELATION_OR;
        return InquiryPacket.IPType.RELATION_AND;
    };
    prototype.generateComboAndPacket = function() {
        var meEp = this.ep;
        var meIp = this.ip;
        return new InquiryPacket(this.ip.subject, null, null, this.ip.context, function(p1) {
            if (meEp != null) 
                meEp.continueProcessingFirstPass(meIp);
        }, this.ip.failure, null, InquiryPacket.IPType.RELATION_AND);
    };
    prototype.generateRollupRulePacket = function(rule) {
        var meEp = this.ep;
        var meIp = this.ip;
        return new InquiryPacket(this.ip.subject, null, null, this.ip.context, function(p1) {
            if (meEp != null) 
                meEp.continueProcessingFirstPass(meIp);
        }, this.ip.failure, rule, InquiryPacket.IPType.ROLLUPRULE);
    };
    prototype.addAllQueries = function(rollupIp) {
        for (var i = 0; i < this.queries.length; i++) {
            rollupIp.subPackets.push(this.generateRollupRulePacket(this.queries[i]));
        }
    };
    prototype.buildQueryTree = function(rollupIp) {
        if (this.queryOperations.length <= 0) 
            return;
        var currentAndPacket = this.generateComboAndPacket();
        var priorOt;
        if (RollupRulePacketGenerator.OperationType.OR.equals(this.queryOperations[0])) 
            rollupIp.subPackets.push(this.generateRollupRulePacket(this.queries[0]));
         else 
            currentAndPacket.subPackets.push(this.generateRollupRulePacket(this.queries[0]));
        priorOt = this.queryOperations[0];
        for (var i = 1; i < this.queryOperations.length; i++) {
            if (RollupRulePacketGenerator.OperationType.OR.equals(this.queryOperations[i])) {
                if (RollupRulePacketGenerator.OperationType.OR.equals(priorOt)) 
                    rollupIp.subPackets.push(this.generateRollupRulePacket(this.queries[i]));
                 else {
                    currentAndPacket.subPackets.push(this.generateRollupRulePacket(this.queries[i]));
                    rollupIp.subPackets.push(currentAndPacket);
                }
            } else {
                if (RollupRulePacketGenerator.OperationType.OR.equals(priorOt)) {
                    currentAndPacket = this.generateComboAndPacket();
                    currentAndPacket.subPackets.push(this.generateRollupRulePacket(this.queries[i]));
                } else 
                    currentAndPacket.subPackets.push(this.generateRollupRulePacket(this.queries[i]));
            }
            priorOt = this.queryOperations[i];
        }
        if (RollupRulePacketGenerator.OperationType.OR.equals(priorOt)) 
            rollupIp.subPackets.push(this.generateRollupRulePacket(this.queries[this.queries.length - 1]));
         else {
            currentAndPacket.subPackets.push(this.generateRollupRulePacket(this.queries[this.queries.length - 1]));
            rollupIp.subPackets.push(currentAndPacket);
        }
    };
    prototype.generatePacket = function() {
        var ipt = this.getIPType();
        var meEp = this.ep;
        var meIp = this.ip;
        var rollupIp = new InquiryPacket(this.ip.subject, null, null, this.ip.context, function(p1) {
            if (meEp != null) 
                meEp.continueProcessingFirstPass(meIp);
        }, this.ip.failure, null, ipt);
        if (InquiryPacket.IPType.RELATION_AND.equals(ipt)) 
            this.addAllQueries(rollupIp);
         else 
            this.buildQueryTree(rollupIp);
        return rollupIp;
    };
    constructor.OperationType = stjs.enumeration("AND", "OR");
}, {queries: {name: "Array", arguments: [null]}, queryOperations: {name: "Array", arguments: [{name: "Enum", arguments: ["RollupRulePacketGenerator.OperationType"]}]}, ip: "InquiryPacket", ep: "AssertionProcessor"}, {});
if (!stjs.mainCallDisabled) 
    RollupRulePacketGenerator.main();
/**
 *  Processor used in Assertion Processing. Can estimate or determine competence
 *  of individuals.
 * 
 *  @author fritz.ray@eduworks.com
 *  @author tom.buskirk@eduworks.com
 *  @class AssertionProcessor
 *  @module org.cassproject
 */
var AssertionProcessor = function() {
    this.repositories = new Array();
    this.coprocessors = new Array();
    this.step = AssertionProcessor.DEF_STEP;
    this.profileMode = false;
};
AssertionProcessor = stjs.extend(AssertionProcessor, null, [], function(constructor, prototype) {
    constructor.DEF_STEP = false;
    prototype.repositories = null;
    prototype.step = false;
    prototype.profileMode = false;
    prototype.logFunction = null;
    prototype.assertions = null;
    prototype.coprocessors = null;
    prototype.processedEquivalencies = null;
    prototype.context = null;
    prototype.assertionsCollected = false;
    prototype.log = function(ip, string) {
        if (this.logFunction != null) {
            var id = "";
            if (ip.competency != null && ip.competency.length > 0) 
                id = ip.competency[0].shortId() + ":";
            this.logFunction(new Date().getTime() % 100000 + ": " + string);
        }
        ip.log += "\n" + string;
    };
    /**
     *  Asynchronously processes and provides an answer to the question: Does an
     *  individual hold a competency?
     * 
     *  @param {EcPk[]}                  subject Public keys that identify the subject.
     *  @param {EcCompetency}            competency The Competency being inquired about.
     *  @param {EcLevel}                 level The Level of the Competency at which the question
     *                                   is being asked.
     *  @param {EcFramework}             context The Framework in which to scope the inquiry.
     *  @param {EbacSignature[]}         additionalSignatures Additional signatures
     *                                   provided by an authority, used to request additional access on a one-time
     *                                   basis.
     *  @param {function(InquiryPacket)} success The method that is invoked when
     *                                   a decision has been reached.
     *  @param {string                   function(string)} ask The method that is invoked when the
     *                                   assertion processor detects that it needs information. (Usernames,
     *                                   passwords, etc)
     *  @param {function(string)}        failure The method that is invoked when the
     *                                   assertion processor has failed.
     *  @method has
     */
    prototype.has = function(subject, competency, level, context, additionalSignatures, success, ask, failure) {
        var ip = new InquiryPacket(subject, competency, level, context, success, failure, null, InquiryPacket.IPType.COMPETENCY);
        ip.root = true;
        this.processedEquivalencies = {};
        this.assertions = null;
        this.context = context;
        this.log(ip, "Created new inquiry.");
        var me = this;
        this.continueProcessingFirstPass(ip);
    };
    prototype.collectAssertionsForSecondPass = function(ip, success) {
        this.assertionsCollected = true;
        var listOfActivatedCompetencies = new Array();
        this.collectCompetencies(ip, listOfActivatedCompetencies, new Array());
        var me = this;
        listOfActivatedCompetencies.sort(function(a, b) {
            return b.compareTo(a);
        });
        var eah = new EcAsyncHelper();
        eah.each(this.repositories, function(currentRepository, callback0) {
            var searchQuery = me.buildAssertionsSearchQuery(ip, listOfActivatedCompetencies);
            me.log(ip, "Querying repositories for subject assertions on " + listOfActivatedCompetencies.length + " competencies: " + searchQuery);
            var params = new Object();
            (params)["size"] = 5000;
            EcAssertion.search(currentRepository, searchQuery, function(p1) {
                me.log(ip, p1.length + " assertions found.");
                me.assertions = new Object();
                for (var i = 0; i < p1.length; i++) {
                    var a = p1[i];
                    var competency = EcRemoteLinkedData.trimVersionFromUrl(a.competency);
                    if ((me.assertions)[competency] == null) 
                        (me.assertions)[competency] = new Array();
                    var as = (me.assertions)[competency];
                    as.push(a);
                }
                callback0();
            }, function(p1) {
                callback0();
            }, params);
        }, function(strings) {
            var eah2 = new EcAsyncHelper();
            eah2.each(me.coprocessors, function(ac, callback00) {
                ac.assertionProcessor = me;
                ac.collectAssertions(ip, listOfActivatedCompetencies, function(assertions) {
                    for (var i = 0; i < assertions.length; i++) {
                        var a = assertions[i];
                        var competency = EcRemoteLinkedData.trimVersionFromUrl(a.competency);
                        if ((me.assertions)[competency] == null) 
                            (me.assertions)[competency] = new Array();
                        var as = (me.assertions)[competency];
                        as.push(a);
                    }
                    callback00();
                });
            }, function(strings) {
                var eah3 = new EcAsyncHelper();
                eah3.each(me.coprocessors, function(ac, callback000) {
                    ac.assertionProcessor = me;
                    ac.mutateAssertions(ip, listOfActivatedCompetencies, callback000);
                }, function(strings) {
                    success(ip);
                });
            });
        });
    };
    prototype.isIn = function(ip, alreadyDone) {
        for (var i = 0; i < alreadyDone.length; i++) 
            if (ip == alreadyDone[i]) 
                return true;
        return false;
    };
    prototype.continueProcessingSecondPass = function(ip) {
        if (!ip.hasCheckedAssertionsForCompetency) 
            if (this.findSubjectAssertionsForCompetency(ip)) 
                if (EcRemote.async) 
                    return true;
        if (this.processChildPacketsSecondPass(ip.equivalentPackets)) 
            if (EcRemote.async) 
                return true;
        if (this.processChildPacketsSecondPass(ip.subPackets)) 
            if (EcRemote.async) 
                return true;
        if (ip.result == null) {
            this.determineResult(ip);
            this.log(ip, "Determined Result:" + ip.result);
            this.log(ip, "Success:" + ip.success);
            if (ip.result != null && ip.success != null) {
                this.log(ip, "Running success:" + ip.result);
                ip.success(ip);
            }
            if (EcRemote.async) 
                return true;
        }
        return false;
    };
    prototype.continueProcessingFirstPass = function(ip) {
        if (!ip.finished) {
            if (!ip.hasCheckedRelationshipsForCompetency) {
                this.findCompetencyRelationships(ip);
                if (EcRemote.async) 
                    return true;
            }
            if (!ip.hasCheckedRollupRulesForCompetency) {
                this.findRollupRulesForCompetency(ip);
                if (EcRemote.async) 
                    return true;
            }
            if (this.processChildPackets(ip.equivalentPackets)) 
                return true;
            if (this.processChildPackets(ip.subPackets)) 
                return true;
            ip.finished = true;
            if (!this.assertionsCollected) 
                if (ip.root) {
                    var me = this;
                    this.collectAssertionsForSecondPass(ip, function(p1) {
                        me.continueProcessingSecondPass(ip);
                    });
                    if (EcRemote.async) 
                        return true;
                } else 
                    ip.success(ip);
        }
        if (ip.finished) 
            if (this.assertions != null) 
                return this.continueProcessingSecondPass(ip);
        return false;
    };
    prototype.determineResult = function(ip) {};
    prototype.findCompetencyRelationships = function(ip) {};
    prototype.findSubjectAssertionsForCompetency = function(ip) {};
    prototype.processChildPackets = function(childPackets) {
        if (childPackets != null) 
            for (var i = 0; i < childPackets.length; i++) 
                if (this.continueProcessingFirstPass(childPackets[i])) 
                    return true;
        return false;
    };
    prototype.checkStep = function(ip) {
        this.log(ip, "Checkstep First Pass: " + ip.numberOfQueriesRunning);
        if (ip.numberOfQueriesRunning == 0) 
            if (!this.step && EcRemote.async) 
                this.continueProcessingFirstPass(ip);
    };
    prototype.processChildPacketsSecondPass = function(childPackets) {
        if (childPackets != null) 
            for (var i = 0; i < childPackets.length; i++) 
                if (this.continueProcessingSecondPass(childPackets[i])) 
                    return true;
        return false;
    };
    prototype.checkStepSecondPass = function(ip) {
        this.log(ip, "Checkstep Second Pass: " + ip.numberOfQueriesRunning);
        if (ip.numberOfQueriesRunning == 0) 
            if (!this.step && EcRemote.async) 
                this.continueProcessingSecondPass(ip);
    };
    prototype.processEventFailure = function(message, ip) {
        this.log(ip, "Event failed: " + message);
        ip.numberOfQueriesRunning--;
        ip.failure(message);
    };
    prototype.logFoundAssertion = function(a, ip) {
        this.log(ip, "No issues found with assertion.");
        this.log(ip, "Record Id: " + a.shortId());
        this.log(ip, "Confidence: " + a.confidence);
        this.log(ip, "Number of pieces of evidence: " + a.getEvidenceCount());
        this.log(ip, "Recording in inquiry.");
    };
    prototype.buildAssertionSearchQuery = function(ip, competency) {
        var result = null;
        if (InquiryPacket.IPType.ROLLUPRULE.equals(ip.type)) {
            if (ip.rule.indexOf("AND ") == 0) 
                ip.rule = ip.rule.replace("AND ", "");
            result = "(" + new EcAssertion().getSearchStringByType() + ") AND (" + ip.rule + ")";
        } else if (InquiryPacket.IPType.COMPETENCY.equals(ip.type)) 
            result = new EcAssertion().getSearchStringByTypeAndCompetency(competency);
        for (var i = 0; i < ip.subject.length; i++) 
            result += " AND (\\*@reader:\"" + ip.subject[i].toPem() + "\")";
        this.log(ip, "Search Query: " + result);
        if (result != null) 
            return result;
         throw new RuntimeException("Trying to build an assertion search query on an unsupported type: " + ip.type);
    };
    prototype.buildAssertionsSearchQuery = function(ip, competencies) {
        var result = null;
        if (InquiryPacket.IPType.ROLLUPRULE.equals(ip.type)) {
            ip.failure("NOT SUPPOSED TO BE HERE.");
             throw new RuntimeException("Collecting assertions when root node is a rollup rule. Not supported.");
        } else if (InquiryPacket.IPType.COMPETENCY.equals(ip.type)) {
            result = "(";
            for (var i = 0; i < competencies.length; i++) {
                if (i != 0) 
                    result += " OR ";
                result += "competency:\"" + competencies[i] + "\"";
            }
            result += ")";
        }
        for (var i = 0; i < ip.subject.length; i++) 
            result += " AND (\\*@reader:\"" + ip.subject[i].toPem() + "\")";
        if (result != null) 
            return result;
         throw new RuntimeException("Trying to build an assertion search query on an unsupported type: " + ip.type);
    };
    prototype.processRelationshipPacketsGenerated = function(ip, competency) {
        this.log(ip, "Relationships succesfully processed for: " + competency.id);
        ip.numberOfQueriesRunning--;
        this.checkStep(ip);
    };
    prototype.processRollupRuleInterpretSuccess = function(status, ip) {
        this.log(ip, "Rollup rule successfully interpreted.");
        ip.numberOfQueriesRunning--;
        this.checkStep(ip);
    };
    prototype.processRollupRuleInterpretSkipped = function(ip) {
        this.log(ip, "Rollup rule skipped.");
        ip.numberOfQueriesRunning--;
        this.checkStep(ip);
    };
    prototype.findRollupRulesForCompetency = function(ip) {
        ip.hasCheckedRollupRulesForCompetency = true;
        if (!InquiryPacket.IPType.COMPETENCY.equals(ip.type)) {
            this.log(ip, "No rollup rules for combinator types");
            this.checkStep(ip);
            return;
        }
        var ep = this;
        if (ip.getContext().rollupRule == null) {
            if (EcRemote.async) 
                this.continueProcessingFirstPass(ip);
        } else 
            for (var i = 0; i < ip.getContext().rollupRule.length; i++) {
                ip.numberOfQueriesRunning++;
                EcRollupRule.get(ip.getContext().rollupRule[i], function(rr) {
                    ep.processFindRollupRuleSuccess(rr, ip);
                }, function(p1) {
                    ep.processEventFailure(p1, ip);
                });
            }
    };
    prototype.processFindRollupRuleSuccess = function(rr, ip) {};
    prototype.collectCompetencies = function(ip, listOfActivatedCompetencies, listOfVisitedPackets) {
        if (this.profileMode) {
            for (var i = 0; i < this.context.competency.length; i++) 
                listOfActivatedCompetencies.push(this.context.competency[i]);
            return;
        }
        for (var i = 0; i < listOfVisitedPackets.length; i++) 
            if (ip == listOfVisitedPackets[i]) 
                return;
        listOfVisitedPackets.push(ip);
        for (var i = 0; i < ip.competency.length; i++) {
            for (var j = 0; j < listOfActivatedCompetencies.length; j++) 
                if (ip.competency[i].shortId() == listOfActivatedCompetencies[j]) 
                    continue;
            listOfActivatedCompetencies.push(ip.competency[i].shortId());
        }
        for (var i = 0; i < ip.equivalentPackets.length; i++) 
            this.collectCompetencies(ip.equivalentPackets[i], listOfActivatedCompetencies, listOfVisitedPackets);
        for (var i = 0; i < ip.subPackets.length; i++) 
            this.collectCompetencies(ip.subPackets[i], listOfActivatedCompetencies, listOfVisitedPackets);
    };
}, {repositories: {name: "Array", arguments: ["EcRepository"]}, logFunction: {name: "Callback1", arguments: ["Object"]}, assertions: "Object", coprocessors: {name: "Array", arguments: ["AssertionCoprocessor"]}, processedEquivalencies: {name: "Map", arguments: [null, null]}, context: "EcFramework"}, {});
/**
 *  Creates child packets for an InquiryPacket based on its context.
 * 
 *  @author fritz.ray@eduworks.com
 *  @author tom.buskirk@eduworks.com
 *  @class RelationshipPacketGenerator
 *  @module org.cassproject
 */
var RelationshipPacketGenerator = /**
 *  Constructor for the RelationshipPacketGenerator
 * 
 *  @param {InquiryPacket}      ip Inquiry Packet to generate and fill with relationship packets.
 *  @param {AssertionProcessor} ep Assertion processor to tell to resume when complete.
 *  @param {object}             processedAlignments An object to fill with keys to ensure that relations are not processed twice.
 *  @constructor
 */
function(ip, ep, processedAlignments) {
    this.ip = ip;
    this.ep = ep;
    this.processedAlignments = processedAlignments;
    this.narrowsPackets = new Array();
    this.broadensPackets = new Array();
    this.requiredPackets = new Array();
    this.isRequiredByPackets = new Array();
};
RelationshipPacketGenerator = stjs.extend(RelationshipPacketGenerator, null, [], function(constructor, prototype) {
    /**
     *  Method to call when any operation fails.
     * 
     *  @property failure
     *  @type function(string)
     */
    prototype.failure = null;
    /**
     *  Method to call when the operation succeeds.
     * 
     *  @property success
     *  @type function()
     */
    prototype.success = null;
    /**
     *  Method to call when the generator has log statements to emit.
     * 
     *  @property logFunction
     *  @type function(any)
     */
    prototype.logFunction = null;
    /**
     *  List of packets representing the narrows relation.
     * 
     *  @property narrowsPackets
     *  @type InquiryPacket[]
     */
    prototype.narrowsPackets = null;
    /**
     *  List of packets representing the broadens relation.
     * 
     *  @property broadensPackets
     *  @type InquiryPacket[]
     */
    prototype.broadensPackets = null;
    /**
     *  List of packets representing the required relation.
     * 
     *  @property requiredPackets
     *  @type InquiryPacket[]
     */
    prototype.requiredPackets = null;
    /**
     *  List of packets representing the isRequiredBy relation.
     * 
     *  @property isRequiredByPackets
     *  @type InquiryPacket[]
     */
    prototype.isRequiredByPackets = null;
    prototype.relationLookup = null;
    /**
     *  Async counter to keep track of number of outstanding requests.
     * 
     *  @property numberOfRelationsToProcess
     *  @type integer
     */
    prototype.numberOfRelationsToProcess = 0;
    /**
     *  Number of relations that have been processed.
     * 
     *  @property numberOfRelationsProcessed
     *  @type integer
     */
    prototype.numberOfRelationsProcessed = 0;
    /**
     *  Alignments to ignore, as they have already been processed.
     * 
     *  @property processedAlignments;
     *  @type Object (Map<String,String>)
     */
    prototype.processedAlignments = null;
    /**
     *  Assertion Processor that invoked this generator.
     * 
     *  @property ep
     *  @type AssertionProcessor
     */
    prototype.ep = null;
    /**
     *  Inquiry Packet that this generator is creating relationships for.
     * 
     *  @property ip
     *  @type InquiryPacket
     */
    prototype.ip = null;
    prototype.log = function(string) {
        if (this.logFunction != null) 
            this.logFunction("" + new Date().getTime() % 100000 + ": " + string);
    };
    prototype.processEventFailure = function(message, ip) {
        ip.numberOfQueriesRunning--;
        this.failure(message);
    };
    prototype.pushRequiredPacketsToIp = function() {
        if (this.requiredPackets.length > 0) {
            var meEp = this.ep;
            var meIp = this.ip;
            var rootRequiredPacket = new InquiryPacket(this.ip.subject, null, null, this.ip.context, function(p1) {
                if (meEp != null) 
                    meEp.continueProcessingFirstPass(meIp);
            }, this.ip.failure, null, InquiryPacket.IPType.RELATION_REQUIRES);
            rootRequiredPacket.subPackets = this.requiredPackets;
            this.ip.subPackets.push(rootRequiredPacket);
        }
    };
    prototype.pushIsRequiredByPacketsToIp = function() {
        if (this.isRequiredByPackets.length > 0) {
            var meEp = this.ep;
            var meIp = this.ip;
            var rootRequiredPacket = new InquiryPacket(this.ip.subject, null, null, this.ip.context, function(p1) {
                if (meEp != null) 
                    meEp.continueProcessingFirstPass(meIp);
            }, this.ip.failure, null, InquiryPacket.IPType.RELATION_ISREQUIREDBY);
            rootRequiredPacket.subPackets = this.isRequiredByPackets;
            this.ip.subPackets.push(rootRequiredPacket);
        }
    };
    prototype.pushNarrowsPacketsToIp = function() {
        if (this.narrowsPackets.length > 0) {
            var meEp = this.ep;
            var meIp = this.ip;
            var rootNarrowsPacket = new InquiryPacket(this.ip.subject, null, null, this.ip.context, function(p1) {
                if (meEp != null) 
                    meEp.continueProcessingFirstPass(meIp);
            }, this.ip.failure, null, InquiryPacket.IPType.RELATION_NARROWS);
            rootNarrowsPacket.subPackets = this.narrowsPackets;
            this.ip.subPackets.push(rootNarrowsPacket);
        }
    };
    prototype.pushBroadensPacketsToIp = function() {
        if (this.broadensPackets.length > 0) {
            var meEp = this.ep;
            var meIp = this.ip;
            var rootBroadensPacket = new InquiryPacket(this.ip.subject, null, null, this.ip.context, function(p1) {
                if (meEp != null) 
                    meEp.continueProcessingFirstPass(meIp);
            }, this.ip.failure, null, InquiryPacket.IPType.RELATION_BROADENS);
            rootBroadensPacket.subPackets = this.broadensPackets;
            this.ip.subPackets.push(rootBroadensPacket);
        }
    };
    prototype.finishRelationProcessing = function() {
        this.pushRequiredPacketsToIp();
        this.pushIsRequiredByPacketsToIp();
        this.pushNarrowsPacketsToIp();
        this.pushBroadensPacketsToIp();
        this.success();
    };
    prototype.processGetRelatedCompetencySuccess = function(relatedCompetency, alignment) {
        this.numberOfRelationsProcessed++;
        var meEp = this.ep;
        var meIp = this.ip;
        if (this.processedAlignments[alignment.shortId()] != null) {
            this.ip.numberOfQueriesRunning--;
            this.checkForFinish();
            return;
        }
        this.processedAlignments[alignment.shortId()] = "done";
        this.log("Adding new " + alignment.relationType + " relationship packet");
        if (EcAlignment.IS_EQUIVALENT_TO.equals(alignment.relationType)) {
            var ip2 = null;
            this.ip.equivalentPackets.push(ip2 = new InquiryPacket(this.ip.subject, relatedCompetency, null, this.ip.context, function(p1) {
                if (meEp != null) 
                    meEp.continueProcessingFirstPass(meIp);
            }, this.ip.failure, null, InquiryPacket.IPType.COMPETENCY));
        } else if (EcAlignment.REQUIRES.equals(alignment.relationType)) {
            if (this.ip.hasId(alignment.source)) 
                this.requiredPackets.push(new InquiryPacket(this.ip.subject, relatedCompetency, null, this.ip.context, function(p1) {
                    if (meEp != null) 
                        meEp.continueProcessingFirstPass(meIp);
                }, this.ip.failure, null, InquiryPacket.IPType.COMPETENCY));
             else 
                this.isRequiredByPackets.push(new InquiryPacket(this.ip.subject, relatedCompetency, null, this.ip.context, function(p1) {
                    if (meEp != null) 
                        meEp.continueProcessingFirstPass(meIp);
                }, this.ip.failure, null, InquiryPacket.IPType.COMPETENCY));
        } else if (EcAlignment.NARROWS.equals(alignment.relationType)) {
            if (this.ip.hasId(alignment.source)) 
                this.narrowsPackets.push(new InquiryPacket(this.ip.subject, relatedCompetency, null, this.ip.context, function(p1) {
                    if (meEp != null) 
                        meEp.continueProcessingFirstPass(meIp);
                }, this.ip.failure, null, InquiryPacket.IPType.COMPETENCY));
             else 
                this.broadensPackets.push(new InquiryPacket(this.ip.subject, relatedCompetency, null, this.ip.context, function(p1) {
                    if (meEp != null) 
                        meEp.continueProcessingFirstPass(meIp);
                }, this.ip.failure, null, InquiryPacket.IPType.COMPETENCY));
        }
        this.ip.numberOfQueriesRunning--;
        this.checkForFinish();
    };
    prototype.checkForFinish = function() {
        if (this.numberOfRelationsProcessed >= this.numberOfRelationsToProcess) 
            this.finishRelationProcessing();
    };
    prototype.processFindCompetencyRelationshipSuccess = function(alignment, ip) {
        ip.numberOfQueriesRunning--;
        var relatedCompetencyId = null;
        if (ip.hasId(alignment.source) && ip.hasId(alignment.target)) {
            this.numberOfRelationsProcessed++;
            this.checkForFinish();
            return;
        } else if (ip.hasId(alignment.source)) 
            relatedCompetencyId = alignment.target;
         else if (ip.hasId(alignment.target)) 
            relatedCompetencyId = alignment.source;
         else {
            this.numberOfRelationsProcessed++;
            this.checkForFinish();
            return;
        }
        this.log("Relationship found (" + alignment.relationType + ") source: " + alignment.source + " target: " + alignment.target);
        ip.numberOfQueriesRunning++;
        var rpg = this;
        if (!ip.context.isId(alignment.source) && !ip.context.isId(alignment.target)) {
            EcCompetency.get(relatedCompetencyId, function(p1) {
                rpg.processGetRelatedCompetencySuccess(p1, alignment);
            }, function(p1) {
                rpg.processEventFailure(p1, ip);
            });
        } else {
            this.numberOfRelationsProcessed++;
            ip.numberOfQueriesRunning--;
            this.checkForFinish();
        }
    };
    /**
     *  Method to invoke to begin relation processing.
     * 
     *  @method go
     */
    prototype.go = function() {
        var rpg = this;
        if (this.ip.getContext().relation == null) 
            this.success();
         else {
            this.numberOfRelationsToProcess = 0;
            for (var i = 0; i < this.ip.competency.length; i++) {
                var relationsRelatedToThisCompetency = (this.relationLookup)[this.ip.competency[i].shortId()];
                if (relationsRelatedToThisCompetency == null) 
                    relationsRelatedToThisCompetency = new Array();
                this.numberOfRelationsToProcess += relationsRelatedToThisCompetency.length;
                this.numberOfRelationsProcessed = 0;
                for (var j = 0; j < relationsRelatedToThisCompetency.length; j++) {
                    this.ip.numberOfQueriesRunning++;
                    rpg.processFindCompetencyRelationshipSuccess(relationsRelatedToThisCompetency[j], rpg.ip);
                }
                if (relationsRelatedToThisCompetency.length == 0) {
                    this.checkForFinish();
                }
            }
        }
    };
}, {failure: {name: "Callback1", arguments: [null]}, success: "Callback0", logFunction: {name: "Callback1", arguments: ["Object"]}, narrowsPackets: {name: "Array", arguments: ["InquiryPacket"]}, broadensPackets: {name: "Array", arguments: ["InquiryPacket"]}, requiredPackets: {name: "Array", arguments: ["InquiryPacket"]}, isRequiredByPackets: {name: "Array", arguments: ["InquiryPacket"]}, relationLookup: "Object", processedAlignments: {name: "Map", arguments: [null, null]}, ep: "AssertionProcessor", ip: "InquiryPacket"}, {});
var RollupRuleGenerator = function(ip) {
    this.ip = ip;
    this.rule = "";
    this.outerRule = "";
};
RollupRuleGenerator = stjs.extend(RollupRuleGenerator, null, [], function(constructor, prototype) {
    prototype.failure = null;
    prototype.success = null;
    prototype.rule = null;
    prototype.outerRule = null;
    prototype.ip = null;
    prototype.go = function() {
        var me = this;
        if (this.ip.getContext().relation == null) 
            this.success(null);
         else 
            for (var i = 0; i < this.ip.getContext().relation.length; i++) {
                this.ip.numberOfQueriesRunning++;
                EcAlignment.get(this.ip.getContext().relation[i], function(p1) {
                    me.ip.numberOfQueriesRunning--;
                    if (!p1.source.equals(me.ip.competency) && !p1.target.equals(me.ip.competency)) 
                        return;
                    if (p1.source.equals(me.ip.competency)) {
                        if (p1.relationType.equals(EcAlignment.REQUIRES)) {
                            if (me.rule != null && me.rule != "") 
                                me.rule += " AND ";
                            me.rule += "[notNegative competency:\"" + p1.target + "\"]";
                        }
                        if (p1.relationType.equals(EcAlignment.NARROWS)) {
                            if (me.outerRule != null && me.outerRule != "") 
                                me.outerRule += " OR ";
                            me.outerRule += "[competency:\"" + p1.target + "\"]";
                        }
                    }
                }, function(p1) {
                    me.ip.numberOfQueriesRunning--;
                });
            }
    };
}, {failure: {name: "Callback1", arguments: [null]}, success: {name: "Callback1", arguments: [null]}, ip: "InquiryPacket"}, {});
var TrustCoprocessor = function() {
    AssertionCoprocessor.call(this);
};
TrustCoprocessor = stjs.extend(TrustCoprocessor, AssertionCoprocessor, [], function(constructor, prototype) {
    prototype.agent = null;
    prototype.multiplier = 1.0;
    prototype.removeNoConfidence = false;
    prototype.mutateAssertions = function(ip, listOfCompetencies, success) {
        var keys = EcObject.keys(this.assertionProcessor.assertions);
        for (var keyIndex = 0; keyIndex < keys.length; keyIndex++) {
            var ary = (this.assertionProcessor.assertions)[keys[keyIndex]];
            for (var i = 0; i < ary.length; i++) {
                var a = ary[i];
                if (a.getAgent().toPem() == this.agent.toPem()) {
                    a.confidence = a.confidence * this.multiplier;
                    if (this.removeNoConfidence && a.confidence == 0.0) 
                        ary.splice(i--, 1);
                }
            }
        }
        success();
    };
}, {agent: "EcPk", assertionProcessor: "AssertionProcessor"}, {});
var PapDependency = function(depParms) {
    PapDependencyParms.call(this);
    if (depParms.getDependencyFirst()) {
        this.setParentIndex(depParms.getParentIndex());
        this.setChildIndex(depParms.getChildIndex());
    } else {
        this.setChildIndex(depParms.getParentIndex());
        this.setParentIndex(depParms.getChildIndex());
    }
    this.setType(depParms.getType());
    this.setWeight(depParms.getWeight());
    this.setLeak(depParms.getLeak());
};
PapDependency = stjs.extend(PapDependency, PapDependencyParms, [], function(constructor, prototype) {
    constructor.NECESSARY_TYPE = "NECESSARY";
    constructor.SUFFICIENT_TYPE = "SUFFICIENT";
    constructor.EQUIVALENCE_TYPE = "EQUIVALENCE";
    constructor.BROADENS_TYPE = "BROADENS";
    constructor.NULL_TYPE = "NULL";
    constructor.HASH_CODE_MULTIPLIER = 41;
    constructor.HASH_CODE_PERCENTAGE_MULTIPLIER = 97;
    constructor.getDependencyTypes = function() {
        var dt = new Array();
        dt.push(PapDependency.NECESSARY_TYPE);
        dt.push(PapDependency.SUFFICIENT_TYPE);
        dt.push(PapDependency.EQUIVALENCE_TYPE);
        dt.push(PapDependency.BROADENS_TYPE);
        dt.push(PapDependency.NULL_TYPE);
        return dt;
    };
    prototype.toString = function() {
        return "Dependency: [" + this.getType().toString() + "] " + this.getParentIndex() + " <-- " + this.getChildIndex();
    };
    prototype.equals = function(other) {
        return (this.getParentIndex() == (other).getParentIndex()) && (this.getChildIndex() == (other).getChildIndex()) && (this.getType() == (other).getType());
    };
    prototype.hashCode = function() {
        var temp = 0;
        if (PapDependency.NECESSARY_TYPE.equalsIgnoreCase(this.getType())) 
            temp = 1;
         else if (PapDependency.EQUIVALENCE_TYPE.equalsIgnoreCase(this.getType())) 
            temp = 2;
         else if (PapDependency.SUFFICIENT_TYPE.equalsIgnoreCase(this.getType())) 
            temp = 3;
         else if (PapDependency.BROADENS_TYPE.equalsIgnoreCase(this.getType())) 
            temp = 4;
        temp *= PapDependency.HASH_CODE_MULTIPLIER;
        temp += this.getParentIndex();
        temp *= PapDependency.HASH_CODE_MULTIPLIER;
        temp += this.getChildIndex();
        return temp + (stjs.trunc((100 * this.getWeight())) % PapDependency.HASH_CODE_PERCENTAGE_MULTIPLIER);
    };
}, {}, {});
var NodePacketGraph = function() {
    this.nodePacketList = new Array();
    this.nodePacketMap = {};
    this.relationList = new Array();
};
NodePacketGraph = stjs.extend(NodePacketGraph, null, [], function(constructor, prototype) {
    prototype.nodePacketList = null;
    prototype.nodePacketMap = null;
    prototype.relationList = null;
    prototype.initNodePacketGraph = function(nodes) {
        var np;
        var n;
        this.nodePacketList = new Array();
        this.nodePacketMap = {};
        this.relationList = new Array();
        for (var i = 0; i < nodes.length; i++) {
            n = nodes[i];
            np = new NodePacket();
            np.addNode(n);
            this.nodePacketList.push(np);
            this.nodePacketMap[n.getId()] = np;
        }
    };
    prototype.getNodePacketForNode = function(n) {
        return this.nodePacketMap[n.getId()];
    };
    prototype.mergeNodePackets = function(packet1, packet2) {
        if (packet1 != packet2) {
            var n;
            var na = packet2.getNodeList();
            for (var i = 0; i < na.length; i++) {
                n = na[i];
                packet1.addNode(n);
                this.nodePacketMap[n.getId()] = packet1;
            }
            this.nodePacketList = ArrayUtil.arrayRemove(this.nodePacketList, packet2);
        }
    };
    prototype.getNodePacketList = function() {
        return this.nodePacketList;
    };
    prototype.setNodePacketList = function(nodePacketList) {
        this.nodePacketList = nodePacketList;
    };
    prototype.getRelationList = function() {
        return this.relationList;
    };
    prototype.setRelationList = function(relationList) {
        this.relationList = relationList;
    };
    prototype.addNodePacket = function(np) {
        this.nodePacketList.push(np);
    };
    prototype.addRelation = function(sourceNodePacket, targetNodePacket, relationType) {
        var newPacketRelation = new PacketRelation(sourceNodePacket, targetNodePacket, relationType);
        this.relationList.push(newPacketRelation);
    };
    prototype.buildPacketRelationsFromNodeRelations = function(nodeRelationList) {
        var sourceNodePacket;
        var targetNodePacket;
        var nr;
        for (var i = 0; i < nodeRelationList.length; i++) {
            nr = nodeRelationList[i];
            sourceNodePacket = this.getNodePacketForNode(nr.getSource());
            targetNodePacket = this.getNodePacketForNode(nr.getTarget());
            if (sourceNodePacket != targetNodePacket) 
                this.addRelation(sourceNodePacket, targetNodePacket, nr.getType());
        }
    };
    prototype.toStringGraphAll = function() {
        var ret = "";
        ret = ret + ">> Packets: \n";
        var np;
        for (var i = 0; i < this.nodePacketList.length; i++) {
            np = this.nodePacketList[i];
            ret = ret + "   " + np.toString() + "\n";
        }
        var pr;
        if (this.relationList.length > 0) {
            ret = ret + ">>Relationships: >\n";
            for (var i = 0; i < this.relationList.length; i++) {
                pr = this.relationList[i];
                ret = ret + "   " + pr.toString() + "\n";
            }
        } else {
            ret = ret + ">>NO RELATIONS EXIST!";
        }
        return ret;
    };
}, {nodePacketList: {name: "Array", arguments: ["NodePacket"]}, nodePacketMap: {name: "Map", arguments: [null, "NodePacket"]}, relationList: {name: "Array", arguments: ["PacketRelation"]}}, {});
var PapDependencyDefinitions = function() {
    this.dependencyDefinitionMap = {};
};
PapDependencyDefinitions = stjs.extend(PapDependencyDefinitions, null, [], function(constructor, prototype) {
    constructor.DEFAULT_WEIGHT = 1.0;
    constructor.DEFAULT_LEAK = 0.0;
    constructor.DEFAULT_REVERSE = false;
    constructor.DEFAULT_NARROWS_BASE_CLASS = "broadens";
    constructor.DEFAULT_NARROWS_REVERSE = true;
    constructor.DEFAULT_NARROWS_WEIGHT = 0.9;
    constructor.DEFAULT_NARROWS_LEAK = 0.0;
    constructor.DEFAULT_NARROWS_KEY = "narrows";
    constructor.DEFAULT_ENABLES_BASE_CLASS = "isSufficientFor";
    constructor.DEFAULT_ENABLES_REVERSE = true;
    constructor.DEFAULT_ENABLES_WEIGHT = 0.9;
    constructor.DEFAULT_ENABLES_LEAK = 0.0;
    constructor.DEFAULT_ENABLES_KEY = "enables";
    constructor.DEFAULT_REQUIRES_BASE_CLASS = "isRequiredBy";
    constructor.DEFAULT_REQUIRES_REVERSE = false;
    constructor.DEFAULT_REQUIRES_WEIGHT = 0.9;
    constructor.DEFAULT_REQUIRES_LEAK = 0.0;
    constructor.DEFAULT_REQUIRES_KEY = "requires";
    prototype.dependencyDefinitionMap = null;
    /**
     *  Pulled default values from CruncherAssertionProcessor
     *      dependencyDefs = new JSONObject();
     * 
     *      JSONObject narrows = new JSONObject();
     *      narrows.put("class","broadens");
     *      narrows.put("reverse",true);
     *      narrows.put("weight",0.9);
     *      dependencyDefs.put("narrows",narrows);
     * 
     *      JSONObject enables = new JSONObject();
     *      enables.put("class","isSufficientFor");
     *      enables.put("weight",0.9);
     *      enables.put("reverse",true);
     *      dependencyDefs.put("enables",enables);
     * 
     *      JSONObject requires = new JSONObject();
     *      requires.put("class","isRequiredBy");
     *      requires.put("weight",0.9);
     *      dependencyDefs.put("requires",requires);
     */
    prototype.initDefaultDefinitions = function() {
        var narrowsDepDef = new PapDependencyDefinitionBase(PapDependencyDefinitions.DEFAULT_NARROWS_BASE_CLASS, PapDependencyDefinitions.DEFAULT_NARROWS_REVERSE, PapDependencyDefinitions.DEFAULT_NARROWS_WEIGHT, PapDependencyDefinitions.DEFAULT_NARROWS_LEAK);
        var enablesDepDef = new PapDependencyDefinitionBase(PapDependencyDefinitions.DEFAULT_ENABLES_BASE_CLASS, PapDependencyDefinitions.DEFAULT_ENABLES_REVERSE, PapDependencyDefinitions.DEFAULT_ENABLES_WEIGHT, PapDependencyDefinitions.DEFAULT_ENABLES_LEAK);
        var requiresDepDef = new PapDependencyDefinitionBase(PapDependencyDefinitions.DEFAULT_REQUIRES_BASE_CLASS, PapDependencyDefinitions.DEFAULT_REQUIRES_REVERSE, PapDependencyDefinitions.DEFAULT_REQUIRES_WEIGHT, PapDependencyDefinitions.DEFAULT_REQUIRES_LEAK);
        this.addDependencyDefinition(PapDependencyDefinitions.DEFAULT_NARROWS_KEY, narrowsDepDef);
        this.addDependencyDefinition(PapDependencyDefinitions.DEFAULT_ENABLES_KEY, enablesDepDef);
        this.addDependencyDefinition(PapDependencyDefinitions.DEFAULT_REQUIRES_KEY, requiresDepDef);
    };
    prototype.getWeightForType = function(depType) {
        var base = this.dependencyDefinitionMap[depType];
        if (base == null) 
            return PapDependencyDefinitions.DEFAULT_WEIGHT;
         else 
            return base.getWeight();
    };
    prototype.getLeakForType = function(depType) {
        var base = this.dependencyDefinitionMap[depType];
        if (base == null) 
            return PapDependencyDefinitions.DEFAULT_LEAK;
         else 
            return base.getLeak();
    };
    prototype.getReverseForType = function(depType) {
        var base = this.dependencyDefinitionMap[depType];
        if (base == null) 
            return PapDependencyDefinitions.DEFAULT_REVERSE;
         else 
            return base.getReverse();
    };
    prototype.addDependencyDefinition = function(relationshipName, definition) {
        this.getDependencyDefinitionMap()[relationshipName] = definition;
    };
    prototype.getDependencyDefinitionMap = function() {
        return this.dependencyDefinitionMap;
    };
    prototype.setDependencyDefinitionMap = function(dependencyDefinitionMap) {
        this.dependencyDefinitionMap = dependencyDefinitionMap;
    };
}, {dependencyDefinitionMap: {name: "Map", arguments: [null, "PapDependencyDefinitionBase"]}}, {});
var CompetencyGraph = function(includeAssertions) {
    this.nodes = new Array();
    this.edges = new Array();
    this.positiveAssertions = new Array();
    this.negativeAssertions = new Array();
    this.nodeMap = {};
    this.edgeMap = {};
    this.includeAssertions = includeAssertions;
};
CompetencyGraph = stjs.extend(CompetencyGraph, null, [], function(constructor, prototype) {
    constructor.NARROWS_RELATION_TEXT = "narrows";
    constructor.BROADENS_RELATION_TEXT = "broadens";
    constructor.REQUIRES_RELATION_TEXT = "requires";
    constructor.IS_REQUIRED_BY_RELATION_TEXT = "isRequiredBy";
    constructor.IS_EQUIVALENT_TO_RELATION_TEXT = "isEquivalentTo";
    constructor.EDGE_MAP_FIELD_DELIMETER = " -------||||||------- ";
    constructor.CleanGraph = function(nodes, edges) {
        this.nodes = nodes;
        this.edges = edges;
    };
    constructor.CleanGraph = stjs.extend(constructor.CleanGraph, null, [], function(constructor, prototype) {
        prototype.nodes = null;
        prototype.edges = null;
    }, {nodes: {name: "Array", arguments: [null]}, edges: {name: "Array", arguments: ["CgEdge"]}}, {});
    constructor.CleanGraphWithAssertions = function(nodes, edges, positiveAssertions, negativeAssertions) {
        this.nodes = nodes;
        this.edges = edges;
        this.positiveAssertions = positiveAssertions;
        this.negativeAssertions = negativeAssertions;
    };
    constructor.CleanGraphWithAssertions = stjs.extend(constructor.CleanGraphWithAssertions, null, [], function(constructor, prototype) {
        prototype.nodes = null;
        prototype.edges = null;
        prototype.positiveAssertions = null;
        prototype.negativeAssertions = null;
    }, {nodes: {name: "Array", arguments: [null]}, edges: {name: "Array", arguments: ["CgEdge"]}, positiveAssertions: {name: "Array", arguments: ["SimpleAssertion"]}, negativeAssertions: {name: "Array", arguments: ["SimpleAssertion"]}}, {});
    prototype.nodes = null;
    prototype.edges = null;
    prototype.positiveAssertions = null;
    prototype.negativeAssertions = null;
    prototype.nodeMap = null;
    prototype.edgeMap = null;
    prototype.includeAssertions = false;
    prototype.addNode = function(id) {
        if (!this.graphContainsNode(id)) {
            this.nodes.push(id);
            this.nodeMap[id] = id;
        }
    };
    prototype.getEdgeKey = function(source, target, relationType) {
        return source + CompetencyGraph.EDGE_MAP_FIELD_DELIMETER + target + CompetencyGraph.EDGE_MAP_FIELD_DELIMETER + relationType;
    };
    prototype.addEdge = function(source, target, relationType) {
        if (!this.graphContainsEdge(source, target, relationType)) {
            this.edges.push(new CgEdge(source, target, relationType));
            var edgeKey = this.getEdgeKey(source, target, relationType);
            this.edgeMap[edgeKey] = edgeKey;
        }
    };
    prototype.addPositiveAssertion = function(simpleAssertion) {
        if (simpleAssertion != null) 
            this.positiveAssertions.push(simpleAssertion);
    };
    prototype.addNegativeAssertion = function(simpleAssertion) {
        if (simpleAssertion != null) 
            this.negativeAssertions.push(simpleAssertion);
    };
    prototype.graphContainsNode = function(nodeId) {
        if (this.nodeMap[nodeId] == null) 
            return false;
        return true;
    };
    prototype.graphContainsEdge = function(source, target, relationType) {
        if (this.edgeMap[this.getEdgeKey(source, target, relationType)] == null) 
            return false;
        return true;
    };
    prototype.createImpliedRelationships = function() {
        var edgesToAdd = new Array();
        var e;
        for (var i = 0; i < this.edges.length; i++) {
            e = this.edges[i];
            if (e.getRelation().equalsIgnoreCase(CompetencyGraph.NARROWS_RELATION_TEXT)) {
                edgesToAdd.push(new CgEdge(e.getTarget(), e.getSource(), CompetencyGraph.BROADENS_RELATION_TEXT));
            } else if (e.getRelation().equalsIgnoreCase(CompetencyGraph.REQUIRES_RELATION_TEXT)) {
                edgesToAdd.push(new CgEdge(e.getTarget(), e.getSource(), CompetencyGraph.IS_REQUIRED_BY_RELATION_TEXT));
            } else if (e.getRelation().equalsIgnoreCase(CompetencyGraph.IS_EQUIVALENT_TO_RELATION_TEXT)) {
                edgesToAdd.push(new CgEdge(e.getTarget(), e.getSource(), CompetencyGraph.IS_EQUIVALENT_TO_RELATION_TEXT));
            }
        }
        var ne;
        for (var i = 0; i < edgesToAdd.length; i++) {
            ne = edgesToAdd[i];
            this.addEdge(ne.getSource(), ne.getTarget(), ne.getRelation());
        }
    };
    prototype.getJsonString = function() {
        if (this.includeAssertions) 
            return JSON.stringify(new CompetencyGraph.CleanGraphWithAssertions(this.nodes, this.edges, this.positiveAssertions, this.negativeAssertions));
         else 
            return JSON.stringify(new CompetencyGraph.CleanGraph(this.nodes, this.edges));
    };
    prototype.getNodes = function() {
        return this.nodes;
    };
    prototype.setNodes = function(nodes) {
        this.nodes = nodes;
    };
    prototype.getEdges = function() {
        return this.edges;
    };
    prototype.setEdges = function(edges) {
        this.edges = edges;
    };
    prototype.getPositiveAssertions = function() {
        return this.positiveAssertions;
    };
    prototype.setPositiveAssertions = function(positiveAssertions) {
        this.positiveAssertions = positiveAssertions;
    };
    prototype.getNegativeAssertions = function() {
        return this.negativeAssertions;
    };
    prototype.setNegativeAssertions = function(negativeAssertions) {
        this.negativeAssertions = negativeAssertions;
    };
}, {nodes: {name: "Array", arguments: [null]}, edges: {name: "Array", arguments: ["CgEdge"]}, positiveAssertions: {name: "Array", arguments: ["SimpleAssertion"]}, negativeAssertions: {name: "Array", arguments: ["SimpleAssertion"]}, nodeMap: {name: "Map", arguments: [null, null]}, edgeMap: {name: "Map", arguments: [null, null]}}, {});
/**
 *  Graph for working with a framework. Additional computed data (such as profile data) can be overlaid on the graph through the use of "metaverticies" and "metaedges" that hold additional information.
 * 
 *  @author fritz.ray@eduworks.com
 *  @author tom.buskirk@eduworks.com
 *  @class EcFrameworkGraph
 */
var EcFrameworkGraph = function() {
    EcDirectedGraph.call(this);
    this.metaVerticies = new Object();
    this.metaEdges = new Object();
    this.competencyMap = new Object();
    this.edgeMap = new Object();
    this.dontTryAnyMore = new Object();
    this.frameworks = new Array();
};
EcFrameworkGraph = stjs.extend(EcFrameworkGraph, EcDirectedGraph, [], function(constructor, prototype) {
    prototype.metaVerticies = null;
    prototype.metaEdges = null;
    prototype.competencyMap = null;
    prototype.edgeMap = null;
    prototype.dontTryAnyMore = null;
    prototype.frameworks = null;
    prototype.addFrameworkSuccessCallback = null;
    prototype.addFrameworkFailureCallback = null;
    prototype.repo = null;
    /**
     *  Adds a framework to the graph, and creates the edges to connect the competencies in the framework.
     * 
     *  @param {EcFramework}     framework Framework to add to the graph.
     *  @param {EcRepository}    repo Repository to fetch data from that exists in the framework.
     *  @param {function()}      success Method to invoke when done adding the framework.
     *  @param {function(error)} failure Method to invoke when things go badly.
     *  @method addFramework
     *  @memberOf EcFrameworkGraph
     */
    prototype.addFramework = function(framework, repo, success, failure) {
        this.frameworks.push(framework);
        var me = this;
        repo.multiget(framework.competency.concat(framework.relation), function(data) {
            var competencyTemplate = new EcCompetency();
            var alignmentTemplate = new EcAlignment();
            var eah = new EcAsyncHelper();
            eah.each(data, function(d, callback0) {
                if (d.isAny(competencyTemplate.getTypes())) {
                    EcCompetency.get(d.id, function(c) {
                        me.addToMetaStateArray(me.getMetaStateCompetency(c), "framework", framework);
                        me.addCompetency(c);
                        callback0();
                    }, callback0);
                } else if (d.isAny(alignmentTemplate.getTypes())) {
                    EcAlignment.get(d.id, function(alignment) {
                        me.addRelation(alignment);
                        me.addToMetaStateArray(me.getMetaStateAlignment(alignment), "framework", framework);
                        callback0();
                    }, callback0);
                } else 
                    callback0();
            }, function(strings) {
                success();
            });
        }, failure);
    };
    prototype.fetchFrameworkAlignments = function(framework) {
        var me = this;
        EcAlignment.search(this.repo, EcGraphUtil.buildIdSearchQueryForIdList(framework.relation), function(ecaa) {
            for (var i = 0; i < ecaa.length; i++) {
                var a = ecaa[i];
                me.addRelation(a);
                me.addToMetaStateArray(me.getMetaStateAlignment(a), "framework", framework);
            }
            me.addFrameworkSuccessCallback();
        }, me.addFrameworkFailureCallback, null);
    };
    /**
     *  Helper method to populate the graph with assertion data, based on propagation rules implicit in the relations (see devs.cassproject.org, Relations). Does not draw conclusions. Must be able to decrypt 'negative' value.
     * 
     *  @param {Assertion[]}     assertions Assertion candidates to use to populate the graph.
     *  @param {function()}      success Method to invoke when the operation completes successfully.
     *  @param {function(error)} failure Error method.
     */
    prototype.processAssertionsBoolean = function(assertions, success, failure) {
        var me = this;
        var eah = new EcAsyncHelper();
        eah.each(assertions, function(assertion, done) {
            var competency = me.getCompetency(assertion.competency);
            if (competency == null || !me.containsVertex(competency)) {
                done();
                return;
            }
            assertion.getNegativeAsync(function(negative) {
                me.processAssertionsBooleanPerAssertion(assertion, negative, competency, done, new Array());
            }, eah.failWithCallback(failure, done));
        }, function(strings) {
            success();
        });
    };
    prototype.processAssertionsBooleanPerAssertion = function(assertion, negative, competency, done, visited) {
        var me = this;
        if (EcArray.has(visited, competency)) {
            done();
            return;
        }
        visited.push(competency);
        if (negative) {
            var metaState = this.getMetaStateCompetency(competency);
            this.addToMetaStateArray(metaState, "negativeAssertion", assertion);
            new EcAsyncHelper().each(me.getOutEdges(competency), function(alignment, callback0) {
                var c = me.getCompetency(alignment.target);
                me.processAssertionBooleanOutward(alignment, callback0, c, me, assertion, negative, visited);
            }, function(strings) {
                new EcAsyncHelper().each(me.getInEdges(competency), function(alignment, callback0) {
                    var c = me.getCompetency(alignment.source);
                    me.processAssertionBooleanInward(alignment, callback0, c, me, assertion, negative, visited);
                }, function(strings) {
                    done();
                });
            });
        } else {
            var metaState = this.getMetaStateCompetency(competency);
            this.addToMetaStateArray(metaState, "positiveAssertion", assertion);
            new EcAsyncHelper().each(me.getInEdges(competency), function(alignment, callback0) {
                var c = me.getCompetency(alignment.source);
                me.processAssertionBooleanOutward(alignment, callback0, c, me, assertion, negative, visited);
            }, function(strings) {
                new EcAsyncHelper().each(me.getOutEdges(competency), function(alignment, callback0) {
                    var c = me.getCompetency(alignment.target);
                    me.processAssertionBooleanInward(alignment, callback0, c, me, assertion, negative, visited);
                }, function(strings) {
                    done();
                });
            });
        }
    };
    prototype.processAssertionBooleanOutward = function(alignment, callback0, c, me, assertion, negative, visited) {
        if (alignment.relationType == Relation.NARROWS) 
            me.processAssertionsBooleanPerAssertion(assertion, negative, c, callback0, visited);
         else if (alignment.relationType == Relation.IS_EQUIVALENT_TO) 
            me.processAssertionsBooleanPerAssertion(assertion, negative, c, callback0, visited);
         else 
            callback0();
    };
    prototype.processAssertionBooleanInward = function(alignment, callback0, c, me, assertion, negative, visited) {
        if (alignment.relationType == Relation.REQUIRES) 
            me.processAssertionsBooleanPerAssertion(assertion, negative, c, callback0, visited);
         else if (alignment.relationType == Relation.IS_EQUIVALENT_TO) 
            me.processAssertionsBooleanPerAssertion(assertion, negative, c, callback0, visited);
         else 
            callback0();
    };
    prototype.addToMetaStateArray = function(metaState, key, value) {
        if (metaState == null) 
            return;
        if ((metaState)[key] == null) 
            (metaState)[key] = new Array();
        ((metaState)[key]).push(value);
    };
    /**
     *  Fetches the Meta Competency (additional state information used to compute profiles or other data) for a competency.
     * 
     *  @param {EcCompetency} c Competency to fetch meta state for.
     *  @return Meta state (empty object by default)
     *  @method getMetaStateCompetency
     *  @memberOf EcFrameworkGraph
     */
    prototype.getMetaStateCompetency = function(c) {
        var result = this.metaVerticies[c.shortId()];
        if (result == null) {
            if (this.containsVertex(c) == false) 
                return null;
            if (this.metaVerticies[c.shortId()] == null) 
                this.metaVerticies[c.shortId()] = result = new Object();
        }
        return result;
    };
    prototype.getMetaStateAlignment = function(a) {
        var result = this.metaEdges[a.shortId()];
        if (result == null) {
            if (this.containsEdge(a) == false) 
                return null;
            if (this.metaEdges[a.shortId()] == null) 
                this.metaEdges[a.shortId()] = result = new Object();
        }
        return result;
    };
    prototype.containsVertex = function(competency) {
        return (this.competencyMap)[competency.shortId()] != null;
    };
    prototype.containsEdge = function(competency) {
        return (this.edgeMap)[competency.shortId()] != null;
    };
    prototype.getCompetency = function(competencyId) {
        var c = null;
        c = (this.competencyMap)[competencyId];
        if (c == null) 
            c = EcCompetency.getBlocking(competencyId);
        return c;
    };
    prototype.addCompetency = function(competency) {
        if (competency == null) 
            return false;
        if (this.containsVertex(competency)) 
            return false;
        (this.competencyMap)[competency.shortId()] = competency;
        (this.competencyMap)[competency.id] = competency;
        return this.addVertex(competency);
    };
    prototype.addRelation = function(alignment) {
        if (alignment == null) 
            return false;
        if (this.containsEdge(alignment)) 
            return false;
        var source = (this.competencyMap)[alignment.source];
        if (source == null && (this.dontTryAnyMore)[alignment.source] != null) 
            return false;
        if (source == null) 
            source = this.getCompetency(alignment.source);
        if (source == null) 
            (this.dontTryAnyMore)[alignment.source] = "";
        var target = (this.competencyMap)[alignment.target];
        if (target == null && (this.dontTryAnyMore)[alignment.target] != null) 
            return false;
        if (target == null) 
            target = this.getCompetency(alignment.target);
        if (target == null) 
            (this.dontTryAnyMore)[alignment.target] = "";
        if (source == null || target == null) 
            return false;
        return this.addEdgeUnsafely(alignment, source, target);
    };
    prototype.addHyperEdge = function(edge, vertices) {
         throw new RuntimeException("Don't do this.");
    };
    prototype.getEdgeType = function(edge) {
        return edge.relationType;
    };
    prototype.getDefaultEdgeType = function() {
        return EcAlignment.NARROWS;
    };
}, {metaVerticies: {name: "Map", arguments: [null, "Object"]}, metaEdges: {name: "Map", arguments: [null, "Object"]}, competencyMap: "Object", edgeMap: "Object", dontTryAnyMore: "Object", frameworks: {name: "Array", arguments: ["EcFramework"]}, addFrameworkSuccessCallback: "Callback0", addFrameworkFailureCallback: {name: "Callback1", arguments: [null]}, repo: "EcRepository", edges: {name: "Array", arguments: [{name: "Triple", arguments: ["V", "V", "E"]}]}, verticies: {name: "Array", arguments: ["V"]}}, {});
var PapNetworkPrediction = function(predictionDate, subjectPem, competencyList, competencyNetwork) {
    this.predictionDate = predictionDate;
    this.subjectPem = subjectPem;
    this.predictions = new Array();
    var currentCompetency;
    var pcp;
    for (var i = 0; i < competencyList.length; i++) {
        currentCompetency = competencyList[i];
        pcp = new PapCompetencyPrediction();
        pcp.setCompetencyId(currentCompetency);
        pcp.setConfidence(competencyNetwork.getPrediction(i));
        pcp.setConflictLevel(competencyNetwork.getConflictLevel(i));
        pcp.setConflictClass(competencyNetwork.getConflictClass(i));
        this.predictions.push(pcp);
    }
};
PapNetworkPrediction = stjs.extend(PapNetworkPrediction, null, [], function(constructor, prototype) {
    prototype.predictionDate = null;
    prototype.subjectPem = null;
    prototype.predictions = null;
    prototype.getPredictionDate = function() {
        return this.predictionDate;
    };
    prototype.setPredictionDate = function(predictionDate) {
        this.predictionDate = predictionDate;
    };
    prototype.getSubjectPem = function() {
        return this.subjectPem;
    };
    prototype.setSubjectPem = function(subjectPem) {
        this.subjectPem = subjectPem;
    };
    prototype.getPredictions = function() {
        return this.predictions;
    };
    prototype.setPredictions = function(predictions) {
        this.predictions = predictions;
    };
    prototype.getJsonString = function() {
        return JSON.stringify(this);
    };
}, {predictions: {name: "Array", arguments: ["PapCompetencyPrediction"]}}, {});
var OpenBadgeCoprocessor = function() {
    AssertionCoprocessor.call(this);
};
OpenBadgeCoprocessor = stjs.extend(OpenBadgeCoprocessor, AssertionCoprocessor, [], function(constructor, prototype) {
    prototype.email = null;
    prototype.badgePluginIdentifier = null;
    prototype.confidenceOfBadges = 1.0;
    prototype.collectAssertions = function(ip, listOfCompetencies, success) {
        if (listOfCompetencies.length == 0) {
            AssertionCoprocessor.prototype.collectAssertions.call(this, ip, listOfCompetencies, success);
            return;
        }
        var assertions = new Array();
        var me = this;
        var eah = new EcAsyncHelper();
        eah.each(me.assertionProcessor.repositories, function(currentRepository, callback0) {
            var searchQuery = "@type:\"BadgeClass\"";
            for (var i = 0; i < listOfCompetencies.length; i++) {
                if (i == 0) 
                    searchQuery += " AND (";
                if (i > 0) 
                    searchQuery += " OR ";
                searchQuery += "alignment.targetUrl:\"" + listOfCompetencies[i] + "\"";
            }
            if (listOfCompetencies.length > 0) 
                searchQuery += ")";
            me.assertionProcessor.log(ip, "Querying repositories for badges regarding " + listOfCompetencies.length + " query: " + searchQuery);
            var params = new Object();
            (params)["size"] = 5000;
            currentRepository.searchWithParams(searchQuery, params, null, function(p1) {
                me.assertionProcessor.log(ip, p1.length + " badgeClasses found.");
                var badgeClassHelper = new EcAsyncHelper();
                badgeClassHelper.each(p1, function(badgeClass, badgeClassDone) {
                    currentRepository.search("@context:\"https://w3id.org/openbadges/v2\" AND @type:Assertion AND badge:\"" + badgeClass.id + "\"", null, function(badgeAssertions) {
                        for (var j = 0; j < badgeAssertions.length; j++) {
                            var hash = EcCrypto.sha256(me.email + ((badgeAssertions[j])["recipient"])["salt"]);
                            if ("sha256$" + hash.toLowerCase() != ((badgeAssertions[j])["recipient"])["identity"]) {
                                me.assertionProcessor.log(ip, me.email + " hashed with salt != " + ((badgeAssertions[j])["recipient"])["identity"]);
                                badgeAssertions.splice(j--, 1);
                            } else 
                                me.assertionProcessor.log(ip, me.email + " hashed with salt == " + ((badgeAssertions[j])["recipient"])["identity"]);
                        }
                        for (var j = 0; j < badgeAssertions.length; j++) {
                            var alignments = (badgeClass)["alignment"];
                            if (alignments != null) 
                                for (var k = 0; k < alignments.length; k++) {
                                    var alignment = alignments[k];
                                    var a = new Assertion();
                                    a.addOwner(ip.subject[0]);
                                    a.setSubject(ip.subject[0]);
                                    a.setAgent(me.badgePluginIdentifier);
                                    a.competency = (alignment)["targetUrl"];
                                    me.assertionProcessor.log(ip, "Generating Assertion for competency: " + (alignment)["targetUrl"]);
                                    a.framework = (alignment)["targetFramework"];
                                    a.confidence = me.confidenceOfBadges;
                                    var evidence = new Array();
                                    evidence.push(badgeAssertions[j].id);
                                    a.setEvidence(evidence);
                                    a.setAssertionDate(new Date((badgeAssertions[j])["issuedOn"]).getTime());
                                    assertions.push(a);
                                }
                        }
                        badgeClassDone();
                    }, ip.failure);
                }, function(strings) {
                    callback0();
                });
            }, ip.failure);
        }, function(strings) {
            success(assertions);
        });
    };
}, {badgePluginIdentifier: "EcPk", assertionProcessor: "AssertionProcessor"}, {});
var TestGraphBuilder = function() {};
TestGraphBuilder = stjs.extend(TestGraphBuilder, null, [], function(constructor, prototype) {
    constructor.buildTest0 = function(graph) {
        var nodeA = new Node("A");
        var nodeB = new Node("B");
        var nodeC = new Node("C");
        graph.addNode(nodeA);
        graph.addNode(nodeB);
        graph.addNode(nodeC);
        graph.addRelation(nodeA, nodeB, RelationType.RELATION_TYPE.NARROWS);
        graph.addRelation(nodeB, nodeC, RelationType.RELATION_TYPE.NARROWS);
        graph.addRelation(nodeC, nodeA, RelationType.RELATION_TYPE.NARROWS);
    };
    constructor.buildTest1 = function(graph) {
        var nodeA = new Node("A");
        var nodeB = new Node("B");
        var nodeC = new Node("C");
        var nodeD = new Node("D");
        var nodeE = new Node("E");
        graph.addNode(nodeA);
        graph.addNode(nodeB);
        graph.addNode(nodeC);
        graph.addNode(nodeD);
        graph.addNode(nodeE);
        graph.addRelation(nodeA, nodeB, RelationType.RELATION_TYPE.NARROWS);
        graph.addRelation(nodeB, nodeC, RelationType.RELATION_TYPE.NARROWS);
        graph.addRelation(nodeC, nodeD, RelationType.RELATION_TYPE.NARROWS);
        graph.addRelation(nodeD, nodeB, RelationType.RELATION_TYPE.NARROWS);
        graph.addRelation(nodeC, nodeE, RelationType.RELATION_TYPE.NARROWS);
    };
    constructor.buildTest2 = function(graph) {
        var nodeA = new Node("A");
        var nodeB = new Node("B");
        var nodeC = new Node("C");
        var nodeD = new Node("D");
        var nodeE = new Node("E");
        var nodeF = new Node("F");
        var nodeG = new Node("G");
        graph.addNode(nodeA);
        graph.addNode(nodeB);
        graph.addNode(nodeC);
        graph.addNode(nodeD);
        graph.addNode(nodeE);
        graph.addNode(nodeF);
        graph.addNode(nodeG);
        graph.addRelation(nodeA, nodeB, RelationType.RELATION_TYPE.IS_EQUIVALENT_TO);
        graph.addRelation(nodeB, nodeC, RelationType.RELATION_TYPE.NARROWS);
        graph.addRelation(nodeC, nodeD, RelationType.RELATION_TYPE.IS_REQUIRED_BY);
        graph.addRelation(nodeD, nodeF, RelationType.RELATION_TYPE.IS_REQUIRED_BY);
        graph.addRelation(nodeF, nodeB, RelationType.RELATION_TYPE.NARROWS);
        graph.addRelation(nodeD, nodeE, RelationType.RELATION_TYPE.IS_REQUIRED_BY);
        graph.addRelation(nodeE, nodeG, RelationType.RELATION_TYPE.REQUIRES);
    };
    constructor.buildTest3 = function(graph) {
        var nodeA = new Node("A");
        var nodeB = new Node("B");
        var nodeC = new Node("C");
        var nodeD = new Node("D");
        var nodeE = new Node("E");
        var nodeF = new Node("F");
        var nodeG = new Node("G");
        var nodeH = new Node("H");
        var nodeI = new Node("I");
        graph.addNode(nodeA);
        graph.addNode(nodeB);
        graph.addNode(nodeC);
        graph.addNode(nodeD);
        graph.addNode(nodeE);
        graph.addNode(nodeF);
        graph.addNode(nodeG);
        graph.addNode(nodeH);
        graph.addNode(nodeI);
        graph.addRelation(nodeA, nodeB, RelationType.RELATION_TYPE.NARROWS);
        graph.addRelation(nodeB, nodeC, RelationType.RELATION_TYPE.NARROWS);
        graph.addRelation(nodeC, nodeD, RelationType.RELATION_TYPE.IS_REQUIRED_BY);
        graph.addRelation(nodeD, nodeI, RelationType.RELATION_TYPE.IS_REQUIRED_BY);
        graph.addRelation(nodeI, nodeB, RelationType.RELATION_TYPE.IS_REQUIRED_BY);
        graph.addRelation(nodeD, nodeE, RelationType.RELATION_TYPE.IS_REQUIRED_BY);
        graph.addRelation(nodeE, nodeF, RelationType.RELATION_TYPE.IS_REQUIRED_BY);
        graph.addRelation(nodeF, nodeG, RelationType.RELATION_TYPE.IS_REQUIRED_BY);
        graph.addRelation(nodeG, nodeH, RelationType.RELATION_TYPE.IS_REQUIRED_BY);
        graph.addRelation(nodeH, nodeE, RelationType.RELATION_TYPE.IS_REQUIRED_BY);
    };
    constructor.buildTest4 = function(graph) {
        var nodeA = new Node("A");
        var nodeB = new Node("B");
        var nodeC = new Node("C");
        var nodeD = new Node("D");
        var nodeE = new Node("E");
        var nodeF = new Node("F");
        var nodeG = new Node("G");
        var nodeH = new Node("H");
        var nodeI = new Node("I");
        graph.addNode(nodeA);
        graph.addNode(nodeB);
        graph.addNode(nodeC);
        graph.addNode(nodeD);
        graph.addNode(nodeE);
        graph.addNode(nodeF);
        graph.addNode(nodeG);
        graph.addNode(nodeH);
        graph.addNode(nodeI);
        graph.addRelation(nodeD, nodeE, RelationType.RELATION_TYPE.IS_REQUIRED_BY);
        graph.addRelation(nodeA, nodeB, RelationType.RELATION_TYPE.NARROWS);
        graph.addRelation(nodeB, nodeC, RelationType.RELATION_TYPE.NARROWS);
        graph.addRelation(nodeF, nodeG, RelationType.RELATION_TYPE.IS_REQUIRED_BY);
        graph.addRelation(nodeG, nodeH, RelationType.RELATION_TYPE.IS_REQUIRED_BY);
        graph.addRelation(nodeI, nodeB, RelationType.RELATION_TYPE.IS_REQUIRED_BY);
        graph.addRelation(nodeE, nodeF, RelationType.RELATION_TYPE.IS_REQUIRED_BY);
        graph.addRelation(nodeC, nodeD, RelationType.RELATION_TYPE.IS_REQUIRED_BY);
        graph.addRelation(nodeD, nodeI, RelationType.RELATION_TYPE.IS_REQUIRED_BY);
        graph.addRelation(nodeH, nodeE, RelationType.RELATION_TYPE.IS_REQUIRED_BY);
        graph.addRelation(nodeG, nodeB, RelationType.RELATION_TYPE.NARROWS);
    };
    constructor.buildTest5 = function(graph) {
        var nodeA = new Node("A");
        var nodeB = new Node("B");
        var nodeC = new Node("C");
        var nodeD = new Node("D");
        var nodeE = new Node("E");
        var nodeF = new Node("F");
        var nodeG = new Node("G");
        var nodeH = new Node("H");
        var nodeI = new Node("I");
        graph.addNode(nodeA);
        graph.addNode(nodeB);
        graph.addNode(nodeC);
        graph.addNode(nodeD);
        graph.addNode(nodeE);
        graph.addNode(nodeF);
        graph.addNode(nodeG);
        graph.addNode(nodeH);
        graph.addNode(nodeI);
        graph.addRelation(nodeA, nodeB, RelationType.RELATION_TYPE.NARROWS);
        graph.addRelation(nodeB, nodeC, RelationType.RELATION_TYPE.NARROWS);
        graph.addRelation(nodeC, nodeD, RelationType.RELATION_TYPE.IS_REQUIRED_BY);
        graph.addRelation(nodeD, nodeI, RelationType.RELATION_TYPE.IS_REQUIRED_BY);
        graph.addRelation(nodeI, nodeB, RelationType.RELATION_TYPE.BROADENS);
        graph.addRelation(nodeD, nodeE, RelationType.RELATION_TYPE.BROADENS);
        graph.addRelation(nodeE, nodeF, RelationType.RELATION_TYPE.BROADENS);
        graph.addRelation(nodeF, nodeG, RelationType.RELATION_TYPE.BROADENS);
        graph.addRelation(nodeG, nodeH, RelationType.RELATION_TYPE.REQUIRES);
        graph.addRelation(nodeH, nodeE, RelationType.RELATION_TYPE.NARROWS);
    };
    constructor.buildTest6 = function(graph) {
        var nodeA = new Node("A");
        var nodeB = new Node("B");
        var nodeC = new Node("C");
        var nodeD = new Node("D");
        var nodeE = new Node("E");
        var nodeF = new Node("F");
        var nodeG = new Node("G");
        var nodeH = new Node("H");
        var nodeI = new Node("I");
        graph.addNode(nodeA);
        graph.addNode(nodeB);
        graph.addNode(nodeC);
        graph.addNode(nodeD);
        graph.addNode(nodeE);
        graph.addNode(nodeF);
        graph.addNode(nodeG);
        graph.addNode(nodeH);
        graph.addNode(nodeI);
        graph.addRelation(nodeA, nodeB, RelationType.RELATION_TYPE.NARROWS);
        graph.addRelation(nodeB, nodeC, RelationType.RELATION_TYPE.NARROWS);
        graph.addRelation(nodeC, nodeD, RelationType.RELATION_TYPE.IS_REQUIRED_BY);
        graph.addRelation(nodeD, nodeI, RelationType.RELATION_TYPE.IS_REQUIRED_BY);
        graph.addRelation(nodeI, nodeB, RelationType.RELATION_TYPE.IS_REQUIRED_BY);
        graph.addRelation(nodeD, nodeE, RelationType.RELATION_TYPE.REQUIRES);
        graph.addRelation(nodeE, nodeF, RelationType.RELATION_TYPE.BROADENS);
        graph.addRelation(nodeF, nodeG, RelationType.RELATION_TYPE.BROADENS);
        graph.addRelation(nodeG, nodeH, RelationType.RELATION_TYPE.REQUIRES);
        graph.addRelation(nodeH, nodeE, RelationType.RELATION_TYPE.REQUIRES);
    };
    constructor.buildTest7 = function(graph) {
        var nodeA = new Node("A");
        var nodeB = new Node("B");
        var nodeC = new Node("C");
        var nodeD = new Node("D");
        var nodeE = new Node("E");
        var nodeF = new Node("F");
        graph.addNode(nodeA);
        graph.addNode(nodeB);
        graph.addNode(nodeC);
        graph.addNode(nodeD);
        graph.addNode(nodeE);
        graph.addNode(nodeF);
        graph.addRelation(nodeA, nodeB, RelationType.RELATION_TYPE.NARROWS);
        graph.addRelation(nodeB, nodeC, RelationType.RELATION_TYPE.NARROWS);
        graph.addRelation(nodeC, nodeD, RelationType.RELATION_TYPE.IS_REQUIRED_BY);
        graph.addRelation(nodeD, nodeB, RelationType.RELATION_TYPE.IS_REQUIRED_BY);
        graph.addRelation(nodeB, nodeF, RelationType.RELATION_TYPE.BROADENS);
        graph.addRelation(nodeF, nodeE, RelationType.RELATION_TYPE.REQUIRES);
        graph.addRelation(nodeE, nodeB, RelationType.RELATION_TYPE.REQUIRES);
    };
    constructor.buildTestGraph = function() {
        var graph = new NodeGraph();
        TestGraphBuilder.buildTest7(graph);
        graph.createImpliedRelations();
        return graph;
    };
}, {}, {});
var RollupRuleProcessor = function(ip, ep) {
    this.ip = ip;
    this.rollupRulePacketGenerator = new RollupRulePacketGenerator(ip, ep);
};
RollupRuleProcessor = stjs.extend(RollupRuleProcessor, null, [], function(constructor, prototype) {
    prototype.success = null;
    prototype.failure = null;
    prototype.logFunction = null;
    prototype.positive = null;
    prototype.negative = null;
    prototype.onQueryExitResult = null;
    prototype.query = null;
    prototype.rollupRulePacketGenerator = null;
    prototype.s = null;
    prototype.tok = null;
    prototype.que = null;
    prototype.ip = null;
    prototype.log = function(string) {
        if (this.logFunction != null) 
            this.logFunction(string);
    };
    prototype.enterS = function(ctx) {
        if (this.s != null) 
             throw new RuntimeException("We found another S in our S.");
        this.s = new RrS();
    };
    prototype.exitS = function(ctx) {
        this.ip.subPackets.push(this.rollupRulePacketGenerator.generatePacket());
    };
    prototype.enterToken = function(ctx) {
        this.s.addToken(this.tok = new RrToken());
    };
    prototype.exitToken = function(ctx) {};
    prototype.enterQuery = function(ctx) {
        this.s.addQuery(this.que = new RrQuery());
        this.query = "";
        this.onQueryExitResult = null;
    };
    prototype.exitQuery = function(ctx) {
        this.que.query = this.query.trim();
        this.log("ADDING QUERY: " + this.query.trim());
        this.rollupRulePacketGenerator.addQuery(this.query.trim());
    };
    prototype.exitInnerquery = function(ctx) {
        if (ctx.cLogic != null) 
            this.query += " " + ctx.cLogic.text + " ";
        if (ctx.cValue != null) {
            this.query += ctx.cKey.text + "" + ctx.cOperator.text + "\"" + ctx.cValue.text + "\" ";
        }
        if (ctx.cNumber != null) {
            this.query += ctx.cKey.text + "" + ctx.cOperator.text + "" + ctx.cNumber.text + " ";
        }
    };
    prototype.exitLogical_or_math_operator = function(ctx) {
        if (ctx.cLogic != null) {
            if ("AND" == ctx.cLogic.text.toUpperCase()) {
                this.log("ADDING OPERATION: " + RollupRulePacketGenerator.OperationType.AND);
                this.rollupRulePacketGenerator.addQueryOperation(RollupRulePacketGenerator.OperationType.AND);
            } else if ("OR" == ctx.cLogic.text.toUpperCase()) {
                this.log("ADDING OPERATION: " + RollupRulePacketGenerator.OperationType.OR);
                this.rollupRulePacketGenerator.addQueryOperation(RollupRulePacketGenerator.OperationType.OR);
            }
        }
    };
}, {success: {name: "Callback1", arguments: [null]}, failure: {name: "Callback1", arguments: [null]}, logFunction: {name: "Callback1", arguments: ["Object"]}, positive: {name: "Array", arguments: ["EcAssertion"]}, negative: {name: "Array", arguments: ["EcAssertion"]}, rollupRulePacketGenerator: "RollupRulePacketGenerator", s: "RrS", tok: "RrToken", que: "RrQuery", ip: "InquiryPacket"}, {});
var CyclicGraphCollapser = function() {};
CyclicGraphCollapser = stjs.extend(CyclicGraphCollapser, null, [], function(constructor, prototype) {
    prototype.nodesProcessed = null;
    prototype.visitedNodes = null;
    prototype.buildNarrowsIsRequiredByEqualsMap = function(graph) {
        var relationMap = new NodeRelationMap();
        var n;
        var nodeList = graph.getNodeList();
        for (var i = 0; i < nodeList.length; i++) {
            n = nodeList[i];
            relationMap.addNodeRelations(n, graph.getNarrowsIsRequiredByEqualsRelationListForNode(n));
        }
        return relationMap;
    };
    prototype.buildBroadensRequiresEqualsMap = function(graph) {
        var relationMap = new NodeRelationMap();
        var n;
        var nodeList = graph.getNodeList();
        for (var i = 0; i < nodeList.length; i++) {
            n = nodeList[i];
            relationMap.addNodeRelations(n, graph.getBroadensRequiresEqualsRelationListForNode(n));
        }
        return relationMap;
    };
    prototype.mergeEquivalentNodes = function(relationMap, npg) {
        var nodeList = relationMap.getNodeList();
        var nodeRelations;
        var nr;
        for (var i = 0; i < nodeList.length; i++) {
            nodeRelations = relationMap.getRelationsForNode(nodeList[i]);
            for (var j = 0; j < nodeRelations.length; j++) {
                nr = nodeRelations[j];
                if (nr.getType() == RelationType.RELATION_TYPE.IS_EQUIVALENT_TO) {
                    npg.mergeNodePackets(npg.getNodePacketForNode(nr.getSource()), npg.getNodePacketForNode(nr.getTarget()));
                }
            }
        }
    };
    prototype.mergeCyclicNodes = function(startCycleNode, npg) {
        var startingIdx = ArrayUtil.arrayLastIndexOf(this.visitedNodes, startCycleNode);
        var partOfCycleNode;
        for (var i = startingIdx + 1; i < this.visitedNodes.length; i++) {
            partOfCycleNode = this.visitedNodes[i];
            if (partOfCycleNode != startCycleNode) {
                npg.mergeNodePackets(npg.getNodePacketForNode(startCycleNode), npg.getNodePacketForNode(partOfCycleNode));
            }
        }
    };
    prototype.findCycles = function(n, relationMap, npg) {
        if (ArrayUtil.arrayContains(this.visitedNodes, n)) {
            this.mergeCyclicNodes(n, npg);
        } else {
            this.nodesProcessed.push(n);
            var relationsToVisit = relationMap.getRelationsForNode(n);
            if (relationsToVisit == null || relationsToVisit.length == 0) 
                return;
             else {
                this.visitedNodes.push(n);
                var nr;
                for (var i = 0; i < relationsToVisit.length; i++) {
                    nr = relationsToVisit[i];
                    this.findCycles(nr.getTarget(), relationMap, npg);
                }
                this.visitedNodes = ArrayUtil.arrayRemove(this.visitedNodes, n);
            }
        }
    };
    prototype.startFindCycles = function(relationMap, npg) {
        var nodeList = relationMap.getNodeList();
        for (var i = 0; i < nodeList.length; i++) {
            this.visitedNodes = new Array();
            this.findCycles(nodeList[i], relationMap, npg);
        }
    };
    prototype.buildNodePacketGraph = function(relationMap) {
        var npg = new NodePacketGraph();
        npg.initNodePacketGraph(relationMap.getNodeList());
        this.mergeEquivalentNodes(relationMap, npg);
        this.nodesProcessed = new Array();
        this.startFindCycles(relationMap, npg);
        return npg;
    };
    prototype.mergeNodePacketGraphs = function(nirbeNpg, breNpg) {
        var mergedNpg = nirbeNpg;
        var np;
        var nodePacketList = breNpg.getNodePacketList();
        for (var i = 0; i < nodePacketList.length; i++) {
            np = nodePacketList[i];
            if (np.getNodeCount() > 1) {
                var targetNodePacket = mergedNpg.getNodePacketForNode(np.getNodeList()[0]);
                for (var j = 1; j < np.getNodeList().length; j++) {
                    mergedNpg.mergeNodePackets(targetNodePacket, mergedNpg.getNodePacketForNode(np.getNodeList()[j]));
                }
            }
        }
        return mergedNpg;
    };
    prototype.collapseGraph = function(graph) {
        try {
            var nirbeNrm = this.buildNarrowsIsRequiredByEqualsMap(graph);
            var nirbeNpg = this.buildNodePacketGraph(nirbeNrm);
            var breNrm = this.buildBroadensRequiresEqualsMap(graph);
            var breNpg = this.buildNodePacketGraph(breNrm);
            var finalNodePacketGraph = this.mergeNodePacketGraphs(nirbeNpg, breNpg);
            finalNodePacketGraph.buildPacketRelationsFromNodeRelations(graph.getRelationList());
            return finalNodePacketGraph;
        }catch (e) {
             throw e;
        }
    };
}, {nodesProcessed: {name: "Array", arguments: ["Node"]}, visitedNodes: {name: "Array", arguments: ["Node"]}}, {});
var CompetencyGraphBuilder = function() {
    this.repositories = new Array();
    this.subjects = new Array();
};
CompetencyGraphBuilder = stjs.extend(CompetencyGraphBuilder, null, [], function(constructor, prototype) {
    constructor.SIZE_OF_ASSERTION_QUERY = 5000;
    prototype.success = null;
    prototype.failure = null;
    prototype.includeAssertions = true;
    prototype.frameworkId = null;
    prototype.rootCompetencyId = null;
    prototype.repositories = null;
    prototype.subjects = null;
    prototype.createImpliedEdges = true;
    prototype.competencyGraph = null;
    prototype.frameworkRelationMap = null;
    prototype.frameworkRelationList = null;
    prototype.assertionList = null;
    prototype.assertionMap = null;
    prototype.relationshipsToProcess = 0;
    prototype.relationshipsProcessed = 0;
    prototype.repositoriesToQuery = 0;
    prototype.repostioriesQueried = 0;
    prototype.assertionsToFillIn = 0;
    prototype.assertionsFilledIn = 0;
    prototype.getRelationsForCompetency = function(competencyId) {
        var competencyRelations = this.frameworkRelationMap[competencyId];
        if (competencyRelations == null) {
            competencyRelations = new Array();
            this.frameworkRelationMap[competencyId] = competencyRelations;
        }
        return competencyRelations;
    };
    prototype.addRelationToCompetencyMap = function(competencyId, relation) {
        var competencyRelations;
        competencyRelations = this.getRelationsForCompetency(competencyId);
        competencyRelations.push(relation);
        this.frameworkRelationMap[competencyId] = competencyRelations;
    };
    prototype.buildFrameworkRelationsMap = function() {
        var relation;
        for (var i = 0; i < this.frameworkRelationList.length; i++) {
            relation = this.frameworkRelationList[i];
            this.addRelationToCompetencyMap(relation.source, relation);
            this.addRelationToCompetencyMap(relation.target, relation);
        }
    };
    prototype.addCompetencyTreeToGraph = function(competencyId) {
        this.competencyGraph.addNode(competencyId);
        var competencyRelations = this.frameworkRelationMap[competencyId];
        if (competencyRelations != null && competencyRelations.length > 0) {
            var relation;
            for (var i = 0; i < competencyRelations.length; i++) {
                relation = competencyRelations[i];
                if (!this.competencyGraph.graphContainsEdge(relation.source, relation.target, relation.relationType)) {
                    this.competencyGraph.addEdge(relation.source, relation.target, relation.relationType);
                }
                if (!this.competencyGraph.graphContainsNode(relation.target)) {
                    this.addCompetencyTreeToGraph(relation.target);
                }
                if (!this.competencyGraph.graphContainsNode(relation.source)) {
                    this.addCompetencyTreeToGraph(relation.source);
                }
            }
        }
    };
    prototype.returnGraph = function() {
        this.success(this.competencyGraph);
    };
    prototype.addAssertionsToGraph = function() {
        var sa;
        var a;
        for (var i = 0; i < this.assertionList.length; i++) {
            a = this.assertionList[i];
            sa = this.assertionMap[a.id];
            if (sa != null) {
                if (sa.isNegative()) 
                    this.competencyGraph.addNegativeAssertion(sa);
                 else 
                    this.competencyGraph.addPositiveAssertion(sa);
            }
        }
    };
    prototype.checkAssertionDetailsFetched = function() {
        if (this.assertionsFilledIn >= this.assertionsToFillIn) {
            this.addAssertionsToGraph();
            this.returnGraph();
        }
    };
    prototype.fetchAssertionDetailsNegativeStatus = function(a, sa) {
        var cgb = this;
        a.getNegativeAsync(function(negative) {
            if (negative != null && negative) 
                sa.setNegative(true);
             else 
                sa.setNegative(false);
            cgb.assertionMap[sa.getId()] = sa;
            cgb.assertionsFilledIn++;
            cgb.checkAssertionDetailsFetched();
        }, function(s) {
            sa.setNegative(false);
            cgb.assertionMap[sa.getId()] = sa;
            cgb.assertionsFilledIn++;
            cgb.checkAssertionDetailsFetched();
        });
    };
    prototype.fetchAssertionDetailsExpirationDate = function(a, sa) {
        var cgb = this;
        a.getExpirationDateAsync(function(expirationDate) {
            if (expirationDate == null || expirationDate <= stjs.trunc(new Date().getTime())) {
                cgb.assertionsFilledIn++;
                cgb.checkAssertionDetailsFetched();
            } else {
                sa.setExpirationDate(expirationDate);
                cgb.fetchAssertionDetailsNegativeStatus(a, sa);
            }
        }, function(s) {
            cgb.failure(new ExceptionReturn("Failed fetchAssertionDetailsExpirationDate: " + s));
        });
    };
    prototype.fetchAssertionDetailsAssertionDate = function(a, sa) {
        var cgb = this;
        a.getAssertionDateAsync(function(assertionDate) {
            if (assertionDate == null || assertionDate > stjs.trunc(new Date().getTime())) {
                cgb.assertionsFilledIn++;
                cgb.checkAssertionDetailsFetched();
            } else {
                sa.setAssertionDate(assertionDate);
                cgb.fetchAssertionDetailsExpirationDate(a, sa);
            }
        }, function(s) {
            cgb.failure(new ExceptionReturn("Failed fetchAssertionDetailsAssertionDate: " + s));
        });
    };
    prototype.isASubject = function(pk) {
        if (this.subjects == null || this.subjects.length == 0) 
            return true;
        var sub;
        for (var i = 0; i < this.subjects.length; i++) {
            sub = this.subjects[i];
            if (sub.toPem().trim() == pk.toPem().trim()) 
                return true;
        }
        return false;
    };
    prototype.fetchAssertionDetailsSubject = function(a, sa) {
        var cgb = this;
        a.getSubjectAsync(function(sub) {
            if (sub == null || !cgb.isASubject(sub)) {
                cgb.assertionsFilledIn++;
                cgb.checkAssertionDetailsFetched();
            } else {
                sa.setSubjectPem(sub.toPem());
                cgb.fetchAssertionDetailsAssertionDate(a, sa);
            }
        }, function(s) {
            cgb.failure(new ExceptionReturn("Failed fetchAssertionDetailsSubject: " + s));
        });
    };
    prototype.fillInAssertions = function() {
        this.assertionsToFillIn = this.assertionList.length;
        this.assertionsFilledIn = 0;
        if (this.assertionsToFillIn == 0) 
            this.returnGraph();
        var a;
        var sa;
        for (var i = 0; i < this.assertionList.length; i++) {
            a = this.assertionList[i];
            sa = new SimpleAssertion(a.id, a.competency, a.confidence);
            this.fetchAssertionDetailsSubject(a, sa);
        }
    };
    prototype.checkNumberOfReposQueried = function() {
        if (this.repostioriesQueried >= this.repositoriesToQuery) {
            this.fillInAssertions();
        }
    };
    prototype.addAssertionsToList = function(repoAssertions) {
        for (var i = 0; i < repoAssertions.length; i++) {
            this.assertionList.push(repoAssertions[i]);
        }
        this.repostioriesQueried++;
    };
    prototype.buildAssertionSearchQuery = function() {
        var query = "(";
        for (var i = 0; i < this.competencyGraph.getNodes().length; i++) {
            if (i != 0) 
                query += " OR ";
            query += "competency:\"" + this.competencyGraph.getNodes()[i] + "\"";
        }
        query += ")";
        if (this.subjects != null) {
            for (var i = 0; i < this.subjects.length; i++) {
                query += " AND (\\*@reader:\"" + this.subjects[i].toPem() + "\")";
            }
        }
        return query;
    };
    prototype.processCompetencyAssertions = function() {
        this.repositoriesToQuery = this.repositories.length;
        this.repostioriesQueried = 0;
        var currentRepository;
        var params = new Object();
        (params)["size"] = CompetencyGraphBuilder.SIZE_OF_ASSERTION_QUERY;
        var searchQuery = this.buildAssertionSearchQuery();
        var cgb = this;
        for (var i = 0; i < this.repositories.length; i++) {
            currentRepository = this.repositories[i];
            EcAssertion.search(currentRepository, searchQuery, function(assertions) {
                cgb.addAssertionsToList(assertions);
                cgb.checkNumberOfReposQueried();
            }, function(s) {
                cgb.failure(new ExceptionReturn("Error fetching assertions: " + s));
            }, params);
        }
    };
    prototype.assembleGraphComponents = function() {
        try {
            this.buildFrameworkRelationsMap();
            this.addCompetencyTreeToGraph(this.rootCompetencyId);
            if (this.createImpliedEdges) 
                this.competencyGraph.createImpliedRelationships();
            if (this.includeAssertions) 
                this.processCompetencyAssertions();
             else 
                this.returnGraph();
        }catch (e) {
            this.failure(new ExceptionReturn("Exception buildAndReturnCompetencyGraph: " + e.toString()));
        }
    };
    prototype.checkNumberOfRelationsProcessed = function() {
        if (this.relationshipsProcessed >= this.relationshipsToProcess) {
            this.assembleGraphComponents();
        }
    };
    prototype.addRelationshipToList = function(a) {
        this.frameworkRelationList.push(a);
        this.relationshipsProcessed++;
    };
    prototype.fetchFrameworkRelations = function(f) {
        this.relationshipsToProcess = f.relation.length;
        this.relationshipsProcessed = 0;
        var cgb = this;
        if (this.relationshipsToProcess == 0) {
            this.competencyGraph.addNode(this.rootCompetencyId);
            this.success(this.competencyGraph);
        } else {
            for (var i = 0; i < this.relationshipsToProcess; i++) {
                EcAlignment.get(f.relation[i], function(a) {
                    cgb.addRelationshipToList(a);
                    cgb.checkNumberOfRelationsProcessed();
                }, function(s) {
                    cgb.failure(new ExceptionReturn("Error fetching relationship: " + s));
                });
            }
        }
    };
    prototype.fetchFrameworkAndGo = function() {
        var cgb = this;
        EcFramework.get(this.frameworkId, function(f) {
            cgb.fetchFrameworkRelations(f);
        }, function(s) {
            cgb.failure(new ExceptionReturn("Error fetching framework(" + cgb.frameworkId + "): " + s));
        });
    };
    prototype.validateInput = function() {
        if (this.includeAssertions && (this.repositories == null || this.repositories.length == 0)) {
            this.failure(new ExceptionReturn("Assertion repository information not provided."));
        } else if (this.success == null) {
            this.failure(new ExceptionReturn("Success callback required."));
        } else if (this.frameworkId == null) {
            this.failure(new ExceptionReturn("Framework ID required."));
        } else if (this.rootCompetencyId == null) {
            this.failure(new ExceptionReturn("Root Competency ID required."));
        }
    };
    prototype.initBuilder = function(createImpliedEdges) {
        this.createImpliedEdges = createImpliedEdges;
        this.competencyGraph = new CompetencyGraph(this.includeAssertions);
        this.assertionMap = {};
        this.frameworkRelationMap = {};
        this.frameworkRelationList = new Array();
        this.assertionList = new Array();
    };
    prototype.buildCompetencyGraph = function(createImpliedEdges) {
        this.validateInput();
        this.initBuilder(createImpliedEdges);
        this.fetchFrameworkAndGo();
    };
}, {success: {name: "Callback1", arguments: ["CompetencyGraph"]}, failure: {name: "Callback1", arguments: ["ExceptionReturn"]}, repositories: {name: "Array", arguments: ["EcRepository"]}, subjects: {name: "Array", arguments: ["EcPk"]}, competencyGraph: "CompetencyGraph", frameworkRelationMap: {name: "Map", arguments: [null, {name: "Array", arguments: ["EcAlignment"]}]}, frameworkRelationList: {name: "Array", arguments: ["EcAlignment"]}, assertionList: {name: "Array", arguments: ["EcAssertion"]}, assertionMap: {name: "Map", arguments: [null, "SimpleAssertion"]}}, {});
/**
 *  Processor used in determining all the competencies a for which a user has assertions.
 *  Utilizes EcFrameworkGraph
 * 
 *  @author fritz.ray@eduworks.com
 *  @author tom.buskirk@eduworks.com
 *  @class ProfileProcessor
 *  @module org.cassproject
 */
var ProfileProcessor = function() {};
ProfileProcessor = stjs.extend(ProfileProcessor, null, [], function(constructor, prototype) {
    constructor.DEBUG = true;
    prototype.profilePkPems = null;
    prototype.repo = null;
    prototype.successCallback = null;
    prototype.failureCallback = null;
    prototype.frameworksToProcess = 0;
    prototype.frameworksProcessed = 0;
    prototype.assertedFrameworkGraphs = null;
    prototype.unfilteredAssertionList = null;
    prototype.profileAssertions = null;
    prototype.addedAssertionIds = null;
    prototype.assertionCompetencies = null;
    prototype.debugMessage = function(o) {
        if (ProfileProcessor.DEBUG) 
            console.log(o);
    };
    prototype.checkAllFrameworkGraphAssertionsHaveProcessed = function() {
        this.debugMessage("checkAllFrameworkGraphAssertionsHaveProcessed");
        this.debugMessage("frameworksProcessed: " + this.frameworksProcessed);
        if (this.frameworksProcessed >= this.frameworksToProcess) {
            this.debugMessage("All profile assertion framework graphs processed");
            this.successCallback();
        }
    };
    prototype.processFrameworkGraphAssertions = function(efg, framework) {
        this.debugMessage("(" + Date.now() + ") Processing framework graph assertions for:");
        this.debugMessage(framework.shortId());
        this.debugMessage(framework.getName());
        var me = this;
        efg.processAssertionsBoolean(this.profileAssertions, function() {
            me.frameworksProcessed++;
            me.assertedFrameworkGraphs.push(efg);
            me.checkAllFrameworkGraphAssertionsHaveProcessed();
        }, function(err) {
            me.handleFailedFrameworkGraphOperation("Process Graph: " + err);
        });
    };
    prototype.handleFailedFrameworkGraphOperation = function(err) {
        this.debugMessage("handleFailedFrameworkGraphOperation: " + err);
        this.frameworksProcessed++;
        this.checkAllFrameworkGraphAssertionsHaveProcessed();
    };
    prototype.buildProfileAssertionFrameworkGraph = function(framework) {
        this.debugMessage("(" + Date.now() + ") Generating framework graph for:");
        this.debugMessage(framework.shortId());
        this.debugMessage(framework.getName());
        var me = this;
        var efg = new EcFrameworkGraph();
        efg.addFramework(framework, this.repo, function() {
            me.processFrameworkGraphAssertions(efg, framework);
        }, function(err) {
            me.handleFailedFrameworkGraphOperation("Build Graph: " + err);
        });
    };
    prototype.generateProfileAssertionFrameworkGraphs = function(profileAssertionFrameworks) {
        if (profileAssertionFrameworks.length <= 0) 
            this.successCallback();
         else {
            this.frameworksToProcess = profileAssertionFrameworks.length;
            this.debugMessage("Generating framework graphs...");
            this.debugMessage(profileAssertionFrameworks);
            for (var i = 0; i < profileAssertionFrameworks.length; i++) {
                this.buildProfileAssertionFrameworkGraph(profileAssertionFrameworks[i]);
            }
        }
    };
    prototype.buildAssertionCompetencyList = function() {
        this.assertionCompetencies = new Array();
        for (var i = 0; i < this.profileAssertions.length; i++) {
            var asr = this.profileAssertions[i];
            if (!EcArray.has(this.assertionCompetencies, asr.competency)) {
                this.assertionCompetencies.push(asr.competency);
            }
        }
    };
    prototype.getFrameworkSearchQueryForAssertionCompetencies = function() {
        var searchQuery = "";
        if (this.assertionCompetencies.length > 1) 
            searchQuery = "(";
        for (var i = 0; i < this.assertionCompetencies.length; i++) {
            if (i > 0) 
                searchQuery += " OR ";
            searchQuery += "(competency:\"" + this.assertionCompetencies[i] + "\")";
        }
        if (this.assertionCompetencies.length > 1) 
            searchQuery += ")";
        this.debugMessage("Framework search query: " + searchQuery);
        return searchQuery;
    };
    prototype.findFrameworksForProfileAssertions = function() {
        this.unfilteredAssertionList = null;
        this.buildAssertionCompetencyList();
        this.debugMessage("Fetching Assertion Frameworks...");
        var me = this;
        EcFramework.search(this.repo, this.getFrameworkSearchQueryForAssertionCompetencies(), function(arrayOfEcFrameworks) {
            me.debugMessage("Assertion Frameworks Fetched");
            me.generateProfileAssertionFrameworkGraphs(arrayOfEcFrameworks);
        }, me.failureCallback, null);
    };
    prototype.filterAssertionList = function() {
        if (this.unfilteredAssertionList.length == 0) 
            this.successCallback();
         else {
            var me = this;
            var eah = new EcAsyncHelper();
            eah.each(this.unfilteredAssertionList, function(assertion, done) {
                assertion.getSubjectAsync(function(subject) {
                    if (subject != null) {
                        if (EcArray.has(me.profilePkPems, subject.toPem())) {
                            if (!EcArray.has(me.addedAssertionIds, assertion.shortId())) {
                                me.profileAssertions.push(assertion);
                                me.addedAssertionIds.push(assertion.shortId());
                            }
                        }
                    }
                    done();
                }, eah.failWithCallback(me.failureCallback, done));
            }, function(aa) {
                me.debugMessage("Assertions filtered");
                me.debugMessage(me.profileAssertions);
                me.findFrameworksForProfileAssertions();
            });
        }
    };
    prototype.isEnvelopeOwnedByProfileUser = function(asrEnv) {
        if (asrEnv.owner == null) 
            return false;
        for (var i = 0; i < asrEnv.owner.length; i++) {
            if (EcArray.has(this.profilePkPems, asrEnv.owner[i])) 
                return true;
        }
        return false;
    };
    prototype.isEncryptedAssertionEnvelope = function(asrEnv) {
        return true;
    };
    prototype.processPotentialAssertionEnvelope = function(potAsrEnv) {
        this.debugMessage("processPotentialAssertionEnvelope: " + potAsrEnv.shortId());
        if (this.isEncryptedAssertionEnvelope(potAsrEnv) && this.isEnvelopeOwnedByProfileUser(potAsrEnv)) {
            var nv = new EcEncryptedValue();
            nv.copyFrom(potAsrEnv);
            var aed = nv.decryptIntoObject();
            var realAsrEnv = new AssertionEnvelope();
            realAsrEnv.copyFrom(aed);
            for (var i = 0; i < realAsrEnv.assertion.length; i++) {
                var eca = new EcAssertion();
                eca.copyFrom(realAsrEnv.getAssertion(i));
                this.unfilteredAssertionList.push(eca);
            }
        }
    };
    prototype.processAssertionEnvelopes = function(ecRldArray) {
        this.debugMessage("Processing Assertion Envelopes...");
        if (ecRldArray != null && ecRldArray.length > 0) {
            for (var i = 0; i < ecRldArray.length; i++) {
                this.processPotentialAssertionEnvelope(ecRldArray[i]);
            }
        }
        this.filterAssertionList();
    };
    prototype.fetchAssertionEnvelopes = function() {
        this.debugMessage("Fetching Assertion Envelopes...");
        var me = this;
        this.repo.searchWithParams(new AssertionEnvelope().getSearchStringByType(), null, null, function(ecRldArray) {
            me.debugMessage("Assertion Envelopes Fetched");
            me.processAssertionEnvelopes(ecRldArray);
        }, me.failureCallback);
    };
    prototype.getAssertionSearchQueryForProfilePkPems = function() {
        var searchQuery = "";
        if (this.profilePkPems.length > 1) 
            searchQuery = "(";
        for (var i = 0; i < this.profilePkPems.length; i++) {
            if (i > 0) 
                searchQuery += " OR ";
            searchQuery += "(\\*@reader:\"" + this.profilePkPems[i] + "\")";
        }
        if (this.profilePkPems.length > 1) 
            searchQuery += ")";
        this.debugMessage("Assertion search query: " + searchQuery);
        return searchQuery;
    };
    prototype.fetchProfileAssertions = function() {
        this.debugMessage("Fetching Assertions...");
        var me = this;
        EcAssertion.search(this.repo, this.getAssertionSearchQueryForProfilePkPems(), function(arrayOfEcAssertions) {
            me.debugMessage("Assertions Fetched");
            if (arrayOfEcAssertions != null && arrayOfEcAssertions.length > 0) {
                me.unfilteredAssertionList = arrayOfEcAssertions;
            }
            me.fetchAssertionEnvelopes();
        }, me.failureCallback, null);
    };
    prototype.processProfileAssertions = function(repo, profilePkPems, success, failure) {
        this.profilePkPems = profilePkPems;
        this.repo = repo;
        this.successCallback = success;
        this.failureCallback = failure;
        this.assertedFrameworkGraphs = new Array();
        this.profileAssertions = new Array();
        this.unfilteredAssertionList = new Array();
        this.addedAssertionIds = new Array();
        this.fetchProfileAssertions();
    };
}, {profilePkPems: {name: "Array", arguments: [null]}, repo: "EcRepository", successCallback: "Callback0", failureCallback: {name: "Callback1", arguments: [null]}, assertedFrameworkGraphs: {name: "Array", arguments: ["EcFrameworkGraph"]}, unfilteredAssertionList: {name: "Array", arguments: ["EcAssertion"]}, profileAssertions: {name: "Array", arguments: ["EcAssertion"]}, addedAssertionIds: {name: "Array", arguments: [null]}, assertionCompetencies: {name: "Array", arguments: [null]}}, {});
var PredictiveAssertionProcessor = function() {};
PredictiveAssertionProcessor = stjs.extend(PredictiveAssertionProcessor, null, [], function(constructor, prototype) {
    constructor.LOG_ENABLED = false;
    constructor.ABRUBT_EXP_RETENTION = 0.0;
    constructor.DEFAULT_RETENTION = 1.0;
    constructor.STEP_SIZE_NUMERATOR = 1.0;
    constructor.INITIAL_VALUE = 0.0;
    constructor.INIT_PARENT_IDX_DEP_PARM = -1;
    constructor.INIT_CHILD_IDX_DEP_PARM = -1;
    constructor.INIT_WEIGHT_DEP_PARM = 0.0;
    constructor.INIT_LEAK_DEP_PARM = 0.0;
    constructor.INIT_REVERSE_DEP_PARM = false;
    constructor.DEFAULT_PROB_LEARN_UNMET_REQS = 0.0;
    constructor.DEFAULT_PROB_INSUFF = 0.0;
    constructor.DEFAULT_DISCOUNT = 1.0;
    prototype.competencyIndex = null;
    prototype.values = null;
    prototype.dependencies = null;
    prototype.assertions = null;
    prototype.dependencyDefs = null;
    prototype.settings = null;
    prototype.inputGraph = null;
    prototype.subjectPem = null;
    prototype.predictionDate = null;
    prototype.competencyNetwork = null;
    prototype.stepSize = 0.0;
    prototype.priorityQueueThreshold = 0.0;
    prototype.competencePrediction = null;
    prototype.log = function(s) {
        if (PredictiveAssertionProcessor.LOG_ENABLED) {
            console.log(s);
        }
    };
    prototype.verifyDependencyDefs = function() {
        if (this.dependencyDefs == null) {
            this.dependencyDefs = new PapDependencyDefinitions();
            this.dependencyDefs.initDefaultDefinitions();
        }
    };
    prototype.processInputParameters = function(inputGraph, subjectPem, predictionDate, dependencyDefs, settings) {
        this.dependencyDefs = dependencyDefs;
        this.verifyDependencyDefs();
        this.settings = settings;
        if (this.settings == null) 
            this.settings = new PapSettings();
        this.inputGraph = inputGraph;
        this.subjectPem = subjectPem;
        if (this.subjectPem != null) 
            this.subjectPem = this.subjectPem.trim();
        this.predictionDate = predictionDate;
        if (this.predictionDate == null) 
            this.predictionDate = stjs.trunc((new Date()).getTime());
        this.stepSize = PredictiveAssertionProcessor.STEP_SIZE_NUMERATOR / this.settings.getIterations();
        this.priorityQueueThreshold = this.settings.getPriorityQueueThreshold() / this.settings.getIterations();
    };
    prototype.initDependenciesMap = function() {
        this.dependencies = {};
        var type;
        for (var i = 0; i < PapDependency.getDependencyTypes().length; i++) {
            type = PapDependency.getDependencyTypes()[i];
            var dependencySubMap = {};
            this.dependencies[type] = dependencySubMap;
        }
    };
    prototype.initAssertionsMap = function() {
        this.assertions = {};
        for (var i = 0; i < this.inputGraph.getNodes().length; i++) {
            this.assertions[String.valueOf(i)] = new Array();
        }
    };
    prototype.buildValuesCompetencyIndexAndDependencies = function() {
        this.competencyIndex = {};
        this.values = new Array();
        for (var i = 0; i < this.inputGraph.getNodes().length; i++) {
            this.values.push(PredictiveAssertionProcessor.INITIAL_VALUE);
            this.competencyIndex[this.inputGraph.getNodes()[i]] = i;
            var type;
            for (var j = 0; j < PapDependency.getDependencyTypes().length; j++) {
                type = PapDependency.getDependencyTypes()[j];
                this.dependencies[type][String.valueOf(i)] = new Array();
            }
        }
    };
    prototype.initDataStructures = function() {
        this.initDependenciesMap();
        this.initAssertionsMap();
        this.buildValuesCompetencyIndexAndDependencies();
    };
    prototype.getDefaultPapDependencyParms = function() {
        var depParms = new PapDependencyParms();
        depParms.setType(PapDependency.NULL_TYPE);
        depParms.setParentIndex(PredictiveAssertionProcessor.INIT_PARENT_IDX_DEP_PARM);
        depParms.setChildIndex(PredictiveAssertionProcessor.INIT_CHILD_IDX_DEP_PARM);
        depParms.setWeight(PredictiveAssertionProcessor.INIT_WEIGHT_DEP_PARM);
        depParms.setLeak(PredictiveAssertionProcessor.INIT_LEAK_DEP_PARM);
        depParms.setReverse(PredictiveAssertionProcessor.INIT_REVERSE_DEP_PARM);
        return depParms;
    };
    prototype.getDependencyParmsForEdge = function(edge) {
        var depType = edge.getRelation();
        var depClass = this.dependencyDefs.getDependencyDefinitionMap()[depType].getDepClass();
        var depParms = this.getDefaultPapDependencyParms();
        switch (depClass.toLowerCase()) {
            case "isrequiredby":
                depParms.setChildIndex(this.competencyIndex[edge.getSource()]);
                depParms.setParentIndex(this.competencyIndex[edge.getTarget()]);
                depParms.setType(PapDependency.NECESSARY_TYPE);
                depParms.setWeight(this.dependencyDefs.getWeightForType(depType));
                depParms.setLeak(this.dependencyDefs.getLeakForType(depType));
                depParms.setReverse(this.dependencyDefs.getReverseForType(depType));
                break;
            case "issufficientfor":
                depParms.setChildIndex(this.competencyIndex[edge.getSource()]);
                depParms.setParentIndex(this.competencyIndex[edge.getTarget()]);
                depParms.setType(PapDependency.SUFFICIENT_TYPE);
                depParms.setWeight(this.dependencyDefs.getWeightForType(depType));
                depParms.setLeak(this.dependencyDefs.getLeakForType(depType));
                depParms.setReverse(this.dependencyDefs.getReverseForType(depType));
                break;
            case "isequivalentto":
                depParms.setParentIndex(this.competencyIndex[edge.getSource()]);
                depParms.setChildIndex(this.competencyIndex[edge.getTarget()]);
                depParms.setType(PapDependency.EQUIVALENCE_TYPE);
                depParms.setWeight(this.dependencyDefs.getWeightForType(depType));
                break;
            case "broadens":
                depParms.setParentIndex(this.competencyIndex[edge.getSource()]);
                depParms.setChildIndex(this.competencyIndex[edge.getTarget()]);
                depParms.setType(PapDependency.BROADENS_TYPE);
                depParms.setWeight(this.dependencyDefs.getWeightForType(depType));
                depParms.setReverse(this.dependencyDefs.getReverseForType(depType));
                break;
        }
        return depParms;
    };
    prototype.dependencyExists = function(type, index, dependency) {
        var dependencyArray = this.dependencies[type][index];
        if (dependencyArray == null) {
            return true;
        }
        var currentDep;
        for (var i = 0; i < dependencyArray.length; i++) {
            currentDep = dependencyArray[i];
            if (currentDep.equals(dependency)) 
                return true;
        }
        return false;
    };
    prototype.processEdges = function() {
        for (var i = 0; i < this.inputGraph.getEdges().length; i++) {
            var edge = this.inputGraph.getEdges()[i];
            var depParms = this.getDependencyParmsForEdge(edge);
            var newDep;
            if (PapDependency.EQUIVALENCE_TYPE.equals(depParms.getType())) {
                depParms.setDependencyFirst(true);
                newDep = new PapDependency(depParms);
                if (!this.dependencyExists(depParms.getType(), String.valueOf(depParms.getParentIndex()), newDep)) {
                    this.dependencies[depParms.getType()][String.valueOf(depParms.getParentIndex())].push(newDep);
                }
                depParms.swapParentChildIndexes();
                newDep = new PapDependency(depParms);
                if (!this.dependencyExists(depParms.getType(), String.valueOf(depParms.getParentIndex()), newDep)) {
                    this.dependencies[depParms.getType()][String.valueOf(depParms.getParentIndex())].push(newDep);
                }
            } else if (edge.getRelation() != null && edge.getRelation().trim().length > 0) {
                depParms.setDependencyFirst(!depParms.getReverse());
                newDep = new PapDependency(depParms);
                if (!this.dependencyExists(depParms.getType(), String.valueOf(depParms.getParentIndex()), newDep)) {
                    this.dependencies[depParms.getType()][String.valueOf(depParms.getParentIndex())].push(newDep);
                }
            }
        }
    };
    prototype.addAssertions = function(assertionList) {
        var sa;
        var pa;
        for (var i = 0; i < assertionList.length; i++) {
            sa = assertionList[i];
            if (sa.getAssertionDate() <= this.predictionDate && ((!this.settings.getAbruptExpiration()) || this.predictionDate <= sa.getExpirationDate())) {
                var index = this.competencyIndex[sa.getCompetencyId()];
                pa = new PapAssertion(sa.getConfidence(), index, sa.getAssertionDate(), sa.getExpirationDate(), !sa.isNegative());
                this.assertions[String.valueOf(index)].push(pa);
            }
        }
    };
    prototype.processAssertions = function() {
        if (this.subjectPem == null || this.subjectPem.length <= 0) {
            this.addAssertions(this.inputGraph.getNegativeAssertions());
            this.addAssertions(this.inputGraph.getPositiveAssertions());
        } else {
            var sa;
            var matchingAssertionList = new Array();
            for (var i = 0; i < this.inputGraph.getNegativeAssertions().length; i++) {
                sa = this.inputGraph.getNegativeAssertions()[i];
                if (this.subjectPem.equals(sa.getSubjectPem())) 
                    matchingAssertionList.push(sa);
            }
            this.addAssertions(matchingAssertionList);
            matchingAssertionList = new Array();
            for (var i = 0; i < this.inputGraph.getPositiveAssertions().length; i++) {
                sa = this.inputGraph.getPositiveAssertions()[i];
                if (this.subjectPem.equals(sa.getSubjectPem())) 
                    matchingAssertionList.push(sa);
            }
            this.addAssertions(matchingAssertionList);
        }
    };
    prototype.getTimeFactor = function(assertionDate, expirationDate) {
        var range = expirationDate - assertionDate;
        var timeUntilPrediction = this.predictionDate - assertionDate;
        var rate = (timeUntilPrediction) / range;
        return rate;
    };
    prototype.getRetention = function(assertionDate, expirationDate) {
        if (this.settings.getAbruptExpiration() && this.predictionDate > (expirationDate)) 
            return PredictiveAssertionProcessor.ABRUBT_EXP_RETENTION;
         else {
            if (this.settings.getGradualForgetting()) {
                var factor = this.getTimeFactor(assertionDate, expirationDate);
                return Math.exp(-factor);
            } else 
                return PredictiveAssertionProcessor.DEFAULT_RETENTION;
        }
    };
    prototype.addAssertionsToUpdateQueue = function(updateQueue) {
        var assertionList;
        var assertion;
        var val;
        for (var i = 0; i < this.inputGraph.getNodes().length; i++) {
            assertionList = this.assertions[String.valueOf(i)];
            for (var j = 0; j < assertionList.length; j++) {
                assertion = assertionList[j];
                val = this.stepSize * assertion.getConfidence() * this.settings.getEvidenceWeight() * this.getRetention(assertion.getAssertionDate(), assertion.getExpirationDate());
                if (val > this.priorityQueueThreshold) {
                    updateQueue.push(new PapUpdate(assertion.getCompetencyIndex(), val, assertion.getResult()));
                }
            }
        }
    };
    prototype.processNecessaryNetworkDependencies = function(update, updateQueue) {
        var updateDependencies = this.competencyNetwork.getDependencies()[PapDependency.NECESSARY_TYPE][String.valueOf(update.getIndex())];
        if (updateDependencies != null) {
            var probabilityLearnUnmetRequirements = PredictiveAssertionProcessor.DEFAULT_PROB_LEARN_UNMET_REQS;
            if (updateDependencies.length > 0) {
                probabilityLearnUnmetRequirements = updateDependencies[0].getLeak();
            }
            var totalRes = (1 - probabilityLearnUnmetRequirements);
            var dep;
            for (var i = 0; i < updateDependencies.length; i++) {
                dep = updateDependencies[i];
                totalRes *= (1 - dep.getWeight() * this.competencyNetwork.getActivations()[dep.getChildIndex()]);
            }
            var gradient;
            for (var i = 0; i < updateDependencies.length; i++) {
                dep = updateDependencies[i];
                if (!update.hasVisited(dep.getChildIndex())) {
                    gradient = update.getChange() * totalRes / (1 - dep.getWeight() * this.competencyNetwork.getActivations()[dep.getChildIndex()]) * dep.getWeight() * this.settings.getDiscount();
                    if (gradient > this.priorityQueueThreshold) {
                        updateQueue.push(update.updateChild(dep.getChildIndex(), gradient));
                    }
                }
            }
        }
    };
    prototype.processSufficientNetworkDependencies = function(update, updateQueue) {
        var updateDependencies = this.competencyNetwork.getDependencies()[PapDependency.SUFFICIENT_TYPE][String.valueOf(update.getIndex())];
        if (updateDependencies != null) {
            var probabilityInsufficient = PredictiveAssertionProcessor.DEFAULT_PROB_INSUFF;
            if (updateDependencies.length > 0) {
                probabilityInsufficient = updateDependencies[0].getLeak();
            }
            var totalRes = (1 - probabilityInsufficient);
            var dep;
            for (var i = 0; i < updateDependencies.length; i++) {
                dep = updateDependencies[i];
                totalRes *= (1.0 - (1.0 - this.competencyNetwork.getActivations()[dep.getChildIndex()]) * dep.getWeight());
            }
            var gradient;
            for (var i = 0; i < updateDependencies.length; i++) {
                dep = updateDependencies[i];
                if (!update.hasVisited(dep.getChildIndex())) {
                    gradient = update.getChange() * (1.0 - totalRes / (1.0 - dep.getWeight() * (1.0 - this.competencyNetwork.getActivations()[dep.getChildIndex()]))) * this.settings.getDiscount();
                    if (gradient > this.priorityQueueThreshold) {
                        updateQueue.push(update.updateChild(dep.getChildIndex(), gradient));
                    }
                }
            }
        }
    };
    prototype.processEquivalenceNetworkDependencies = function(update, updateQueue) {
        var updateDependencies = this.competencyNetwork.getDependencies()[PapDependency.EQUIVALENCE_TYPE][String.valueOf(update.getIndex())];
        if (updateDependencies != null) {
            var dep;
            var gradient;
            for (var i = 0; i < updateDependencies.length; i++) {
                dep = updateDependencies[i];
                if (!update.hasVisited(dep.getChildIndex())) {
                    gradient = update.getChange() * dep.getWeight() * this.settings.getDiscount();
                    if (Math.abs(gradient) > this.priorityQueueThreshold) {
                        updateQueue.push(update.updateChild(dep.getChildIndex(), gradient));
                    }
                }
            }
        }
    };
    prototype.processBroadensNetworkDependencies = function(update, updateQueue) {
        var updateDependencies = this.competencyNetwork.getDependencies()[PapDependency.BROADENS_TYPE][String.valueOf(update.getIndex())];
        if (updateDependencies != null) {
            var dep;
            var gradient;
            for (var i = 0; i < updateDependencies.length; i++) {
                dep = updateDependencies[i];
                if (!update.hasVisited(dep.getChildIndex())) {
                    gradient = update.getChange() * this.settings.getDiscount() * dep.getWeight();
                    if (gradient > this.priorityQueueThreshold) {
                        updateQueue.push(update.updateChild(dep.getChildIndex(), gradient));
                    }
                }
            }
        }
    };
    prototype.predictCompetence = function() {
        this.competencyNetwork = new PapCompetencyNetwork(this.dependencies, this.inputGraph.getNodes().length, this.settings);
        var updateQueue;
        var currentUpdate;
        for (var iteration = 0; iteration < this.settings.getIterations(); iteration++) {
            updateQueue = new Array();
            this.addAssertionsToUpdateQueue(updateQueue);
             while (updateQueue.length > 0){
                currentUpdate = updateQueue.pop();
                this.competencyNetwork.update(currentUpdate.getIndex(), currentUpdate.getChange(), currentUpdate.getPositive());
                this.processNecessaryNetworkDependencies(currentUpdate, updateQueue);
                this.processSufficientNetworkDependencies(currentUpdate, updateQueue);
                this.processEquivalenceNetworkDependencies(currentUpdate, updateQueue);
                this.processBroadensNetworkDependencies(currentUpdate, updateQueue);
            }
        }
    };
    prototype.buildCompetencePrediction = function() {
        this.competencePrediction = new PapNetworkPrediction(this.predictionDate, this.subjectPem, this.inputGraph.getNodes(), this.competencyNetwork);
    };
    prototype.predictAll = function(inputGraph, subjectPem, predictionDate, dependencyDefs, settings) {
        this.processInputParameters(inputGraph, subjectPem, predictionDate, dependencyDefs, settings);
        this.initDataStructures();
        this.processEdges();
        this.processAssertions();
        this.predictCompetence();
        this.buildCompetencePrediction();
        return this.competencePrediction;
    };
}, {competencyIndex: {name: "Map", arguments: [null, null]}, values: {name: "Array", arguments: [null]}, dependencies: {name: "Map", arguments: [null, {name: "Map", arguments: [null, {name: "Array", arguments: ["PapDependency"]}]}]}, assertions: {name: "Map", arguments: [null, {name: "Array", arguments: ["PapAssertion"]}]}, dependencyDefs: "PapDependencyDefinitions", settings: "PapSettings", inputGraph: "CompetencyGraph", competencyNetwork: "PapCompetencyNetwork", competencePrediction: "PapNetworkPrediction"}, {});
var CombinatorAssertionProcessor = function() {
    AssertionProcessor.call(this);
};
CombinatorAssertionProcessor = stjs.extend(CombinatorAssertionProcessor, AssertionProcessor, [], function(constructor, prototype) {
    constructor.relationLookup = null;
    prototype.processFoundAssertion = function(a, ip, success, failure) {
        var eah = new EcAsyncHelper();
        var me = this;
        eah.each(ip.subject, function(p1, p2) {
            me.checkSubject(a, p1, ip, p2, function(p1) {
                failure(p1);
            });
        }, function(p1) {
            success();
        });
    };
    prototype.checkSubject = function(a, currentSubject, ip, success, failure) {
        var me = this;
        a.getSubjectAsync(function(sub) {
            if (sub.equals(currentSubject)) {
                me.log(ip, "Matching Assertion found.");
                a.getAssertionDateAsync(function(assertionDate) {
                    if (assertionDate != null) 
                        if (assertionDate > stjs.trunc(new Date().getTime())) {
                            me.log(ip, "Assertion is made for a future date.");
                            success();
                            return;
                        }
                    a.getExpirationDateAsync(function(expirationDate) {
                        if (expirationDate != null) 
                            if (expirationDate <= stjs.trunc(new Date().getTime())) {
                                me.log(ip, "Assertion is expired. Skipping.");
                                success();
                                return;
                            }
                        me.logFoundAssertion(a, ip);
                        a.getNegativeAsync(function(p1) {
                            if (p1 != null && p1) {
                                me.log(ip, "Found valid negative assertion");
                                ip.negative.push(a);
                            } else {
                                me.log(ip, "Found valid positive assertion");
                                ip.positive.push(a);
                            }
                            success();
                        }, function(p1) {
                            me.log(ip, "Found valid positive assertion");
                            ip.positive.push(a);
                            success();
                        });
                    }, failure);
                }, failure);
            } else 
                failure("Incorrect subject.");
        }, failure);
    };
    prototype.processFindAssertionsSuccess = function(data, ip) {
        if (data.length == 0) 
            this.log(ip, "No results found.");
         else 
            this.log(ip, "Total number of assertions found: " + data.length);
        ip.numberOfQueriesRunning--;
        this.checkStepSecondPass(ip);
    };
    prototype.findSubjectAssertionsForCompetency = function(ip) {
        if (this.assertions == null) 
            return true;
        ip.hasCheckedAssertionsForCompetency = true;
        if (!InquiryPacket.IPType.COMPETENCY.equals(ip.type) && !InquiryPacket.IPType.ROLLUPRULE.equals(ip.type)) {
            this.log(ip, "No assertions for combinator types");
            return false;
        }
        var me = this;
        if (InquiryPacket.IPType.COMPETENCY.equals(ip.type)) {
            for (var h = 0; h < ip.competency.length; h++) {
                ip.numberOfQueriesRunning++;
                var competency = ip.competency[h];
                var assertionsForThisCompetency = (this.assertions)[competency.shortId()];
                if (assertionsForThisCompetency == null) 
                    assertionsForThisCompetency = new Array();
                var eah = new EcAsyncHelper();
                eah.each(assertionsForThisCompetency, function(p1, p2) {
                    me.processFoundAssertion(p1, ip, p2, function(p1) {
                        p2();
                    });
                }, function(p1) {
                    me.processFindAssertionsSuccess(p1, ip);
                });
            }
            return true;
        } else 
            for (var i = 0; i < this.repositories.length; i++) {
                var currentRepository = this.repositories[i];
                if (InquiryPacket.IPType.ROLLUPRULE.equals(ip.type)) {
                    ip.numberOfQueriesRunning++;
                    this.log(ip, "Searching: " + currentRepository.selectedServer);
                    currentRepository.search(this.buildAssertionSearchQuery(ip, null), function(p1) {}, function(p1) {
                        var eah = new EcAsyncHelper();
                        eah.each(p1, function(p1, p2) {
                            var a = new EcAssertion();
                            a.copyFrom(p1);
                            me.processFoundAssertion(a, ip, p2, function(p1) {
                                p2();
                            });
                        }, function(p1) {
                            me.processFindAssertionsSuccess(p1, ip);
                        });
                    }, function(p1) {
                        me.processEventFailure(p1, ip);
                    });
                }
            }
        return true;
    };
    prototype.findCompetencyRelationships = function(ip) {
        ip.hasCheckedRelationshipsForCompetency = true;
        if (!InquiryPacket.IPType.COMPETENCY.equals(ip.type)) {
            this.log(ip, "No relationships for combinator types");
            this.checkStep(ip);
            return;
        }
        var ep = this;
        var relationLookup = this.constructor.relationLookup;
        if (relationLookup == null) {
            relationLookup = new Object();
            if (ep.context != null && ep.context.relation != null) 
                for (var i = 0; i < ep.context.relation.length; i++) {
                    var a = EcAlignment.getBlocking(ep.context.relation[i]);
                    if (a == null) 
                        continue;
                    if ((relationLookup)[a.source] == null) 
                        (relationLookup)[a.source] = new Array();
                    ((relationLookup)[a.source]).push(a);
                    if ((relationLookup)[a.target] == null) 
                        (relationLookup)[a.target] = new Array();
                    ((relationLookup)[a.target]).push(a);
                }
            if (this.profileMode) 
                this.constructor.relationLookup = relationLookup;
        }
        for (var i = 0; i < ip.competency.length; i++) {
            this.log(ip, "Finding relationships for competency: " + ip.competency[i]);
            this.findCompetencyRelationship(ip, ep, ip.competency[i], relationLookup);
        }
    };
    prototype.findCompetencyRelationship = function(ip, ep, c, relationLookup) {
        var rpg = new RelationshipPacketGenerator(ip, ep, this.processedEquivalencies);
        rpg.failure = ip.failure;
        rpg.logFunction = this.logFunction;
        rpg.relationLookup = relationLookup;
        rpg.success = function() {
            ep.processRelationshipPacketsGenerated(ip, c);
        };
        this.log(ip, "Executing relationship packet generator");
        ip.numberOfQueriesRunning++;
        rpg.go();
    };
    prototype.processFindRollupRuleSuccess = function(rr, ip) {
        var ep = this;
        if (!ip.hasId(rr.competency)) {
            ep.processRollupRuleInterpretSkipped(ip);
            return;
        }
        this.log(ip, "Found rollup rule: " + rr.rule);
        var rrp = new RollupRuleProcessor(ip, this);
        rrp.positive = ip.positive;
        rrp.negative = ip.negative;
        var rri = new RollupRuleInterface(rr.rule, rrp);
        rri.logFunction = this.logFunction;
        rri.success = function(p1) {
            ep.processRollupRuleInterpretSuccess(p1, ip);
        };
        rri.failure = ip.failure;
        this.log(ip, "Executing rollup rule interpreter");
        rri.go();
    };
}, {relationLookup: "Object", repositories: {name: "Array", arguments: ["EcRepository"]}, logFunction: {name: "Callback1", arguments: ["Object"]}, assertions: "Object", coprocessors: {name: "Array", arguments: ["AssertionCoprocessor"]}, processedEquivalencies: {name: "Map", arguments: [null, null]}, context: "EcFramework"}, {});
var FrameworkCollapser = function() {};
FrameworkCollapser = stjs.extend(FrameworkCollapser, null, [], function(constructor, prototype) {
    prototype.repo = null;
    prototype.framework = null;
    prototype.createImpliedRelations = false;
    prototype.competencyArray = null;
    prototype.competencyNodeMap = null;
    prototype.relationArray = null;
    prototype.frameworkNodeGraph = null;
    prototype.collapsedFrameworkNodePacketGraph = null;
    prototype.successCallback = null;
    prototype.failureCallback = null;
    prototype.addCompetenciesToFrameworkNodeGraph = function() {
        var cmp;
        var n;
        this.competencyNodeMap = {};
        for (var i = 0; i < this.competencyArray.length; i++) {
            cmp = this.competencyArray[i];
            n = new Node(cmp.shortId());
            n.setName(cmp.getName());
            n.setDescription(cmp.getDescription());
            this.frameworkNodeGraph.addNode(n);
            this.competencyNodeMap[cmp.shortId()] = n;
        }
    };
    prototype.getRelationType = function(rs) {
        if ("requires".equalsIgnoreCase(rs)) 
            return RelationType.RELATION_TYPE.REQUIRES;
         else if ("narrows".equalsIgnoreCase(rs)) 
            return RelationType.RELATION_TYPE.NARROWS;
         else if ("isEquivalentTo".equalsIgnoreCase(rs)) 
            return RelationType.RELATION_TYPE.IS_EQUIVALENT_TO;
         else 
            return null;
    };
    prototype.addRelationshipsToFrameworkNodeGraph = function() {
        var rel;
        var type;
        var sourceNode;
        var targetNode;
        for (var i = 0; i < this.relationArray.length; i++) {
            rel = this.relationArray[i];
            type = this.getRelationType(rel.relationType);
            if (type != null) {
                sourceNode = this.competencyNodeMap[rel.source];
                targetNode = this.competencyNodeMap[rel.target];
                if (sourceNode != null && targetNode != null) {
                    this.frameworkNodeGraph.addRelation(sourceNode, targetNode, type);
                }
            }
        }
    };
    prototype.generateFrameworkNodeGraph = function() {
        this.frameworkNodeGraph = new NodeGraph();
        this.addCompetenciesToFrameworkNodeGraph();
        this.addRelationshipsToFrameworkNodeGraph();
        if (this.createImpliedRelations) 
            this.frameworkNodeGraph.createImpliedRelations();
    };
    prototype.collapseFrameworkNodeGraph = function() {
        var cgc = new CyclicGraphCollapser();
        this.collapsedFrameworkNodePacketGraph = cgc.collapseGraph(this.frameworkNodeGraph);
    };
    prototype.continueFrameworkCollapse = function() {
        try {
            this.generateFrameworkNodeGraph();
            try {
                this.collapseFrameworkNodeGraph();
                this.successCallback(this.framework.shortId(), this.collapsedFrameworkNodePacketGraph);
            }catch (e2) {
                this.failureCallback("Framework collapse failed: " + e2.toString());
            }
        }catch (e) {
            this.failureCallback("Framework node graph generation failed: " + e.toString());
        }
    };
    prototype.fetchFrameworkAlignments = function(framework) {
        var me = this;
        EcAlignment.search(this.repo, EcGraphUtil.buildIdSearchQueryForIdList(framework.relation), function(ecaa) {
            me.relationArray = ecaa;
            me.continueFrameworkCollapse();
        }, me.failureCallback, null);
    };
    prototype.collapseFramework = function(repo, framework, createImpliedRelations, success, failure) {
        if (framework == null) 
            failure("Framework is null or undefined");
         else if (framework.competency == null || framework.competency.length < 1) 
            failure("Framework has no competencies");
         else if (repo == null) 
            failure("Repo is null or undefined");
         else {
            this.repo = repo;
            this.framework = framework;
            this.createImpliedRelations = createImpliedRelations;
            this.successCallback = success;
            this.failureCallback = failure;
            var me = this;
            var fwkParam = framework;
            EcCompetency.search(repo, EcGraphUtil.buildIdSearchQueryForIdList(framework.competency), function(ecca) {
                me.competencyArray = ecca;
                me.fetchFrameworkAlignments(fwkParam);
            }, me.failureCallback, null);
        }
    };
}, {repo: "EcRepository", framework: "EcFramework", competencyArray: {name: "Array", arguments: ["EcCompetency"]}, competencyNodeMap: {name: "Map", arguments: [null, "Node"]}, relationArray: {name: "Array", arguments: ["EcAlignment"]}, frameworkNodeGraph: "NodeGraph", collapsedFrameworkNodePacketGraph: "NodePacketGraph", successCallback: {name: "Callback2", arguments: [null, "NodePacketGraph"]}, failureCallback: {name: "Callback1", arguments: [null]}}, {});
var OptimisticQuadnaryAssertionProcessor = function() {
    CombinatorAssertionProcessor.call(this);
};
OptimisticQuadnaryAssertionProcessor = stjs.extend(OptimisticQuadnaryAssertionProcessor, CombinatorAssertionProcessor, [], function(constructor, prototype) {
    prototype.transferIndeterminateOptimistically = true;
    prototype.determineCombinatorAndResult = function(ip) {
        if (ip.anyChildPacketsAreFalse()) {
            ip.result = InquiryPacket.ResultType.FALSE;
        } else if (ip.anyIndeterminantChildPackets()) {
            ip.result = InquiryPacket.ResultType.INDETERMINANT;
        } else if (ip.anyChildPacketsAreUnknown()) {
            ip.result = InquiryPacket.ResultType.UNKNOWN;
        } else {
            ip.result = InquiryPacket.ResultType.TRUE;
        }
    };
    prototype.determineCombinatorNarrowsResult = function(ip) {
        if (ip.anyChildPacketsAreTrue()) {
            ip.result = InquiryPacket.ResultType.TRUE;
        } else if (this.transferIndeterminateOptimistically && ip.anyIndeterminantChildPackets()) {
            ip.result = InquiryPacket.ResultType.FALSE;
        } else {
            ip.result = InquiryPacket.ResultType.UNKNOWN;
        }
    };
    prototype.determineCombinatorBroadensResult = function(ip) {
        if (ip.anyChildPacketsAreFalse()) {
            ip.result = InquiryPacket.ResultType.FALSE;
        } else if (this.transferIndeterminateOptimistically && ip.anyIndeterminantChildPackets()) {
            ip.result = InquiryPacket.ResultType.TRUE;
        } else if (!(ip.anyChildPacketsAreFalse() || ip.anyChildPacketsAreUnknown())) {
            ip.result = InquiryPacket.ResultType.TRUE;
        } else {
            ip.result = InquiryPacket.ResultType.UNKNOWN;
        }
    };
    prototype.determineCombinatorRequiresResult = function(ip) {
        if (ip.anyChildPacketsAreFalse()) {
            ip.result = InquiryPacket.ResultType.FALSE;
        } else if (this.transferIndeterminateOptimistically && ip.anyIndeterminantChildPackets()) {
            ip.result = InquiryPacket.ResultType.TRUE;
        } else {
            ip.result = InquiryPacket.ResultType.UNKNOWN;
        }
    };
    prototype.determineCombinatorIsRequiredByResult = function(ip) {
        if (ip.anyChildPacketsAreTrue()) {
            ip.result = InquiryPacket.ResultType.TRUE;
        } else if (this.transferIndeterminateOptimistically && ip.anyIndeterminantChildPackets()) {
            ip.result = InquiryPacket.ResultType.FALSE;
        } else {
            ip.result = InquiryPacket.ResultType.UNKNOWN;
        }
    };
    prototype.determineCombinatorOrResult = function(ip) {
        if (ip.anyChildPacketsAreTrue()) {
            ip.result = InquiryPacket.ResultType.TRUE;
        } else if (ip.anyIndeterminantChildPackets()) {
            ip.result = InquiryPacket.ResultType.INDETERMINANT;
        } else if (ip.allChildPacketsUnknown()) {
            ip.result = InquiryPacket.ResultType.UNKNOWN;
        } else {
            ip.result = InquiryPacket.ResultType.FALSE;
        }
    };
    prototype.getPacketAssertionResult = function(ip) {
        if (ip.positive.length > 0 && ip.negative.length == 0) {
            return InquiryPacket.ResultType.TRUE;
        } else if (ip.positive.length == 0 && ip.negative.length > 0) {
            return InquiryPacket.ResultType.FALSE;
        } else if (ip.positive.length > 0 && ip.negative.length > 0) {
            return InquiryPacket.ResultType.INDETERMINANT;
        } else {
            return InquiryPacket.ResultType.UNKNOWN;
        }
    };
    prototype.determineResultForUnknownAssertionResult = function(ip) {
        if (ip.allChildPacketsUnknown()) {
            ip.result = InquiryPacket.ResultType.UNKNOWN;
        } else if (ip.allEquivalentPacketsUnknown()) {
            if (ip.allSubPacketsTrueOrUnknown()) {
                ip.result = InquiryPacket.ResultType.TRUE;
            } else if (ip.allSubPacketsFalseOrUnknown()) {
                ip.result = InquiryPacket.ResultType.FALSE;
            } else {
                ip.result = InquiryPacket.ResultType.INDETERMINANT;
            }
        } else if (ip.allEquivalentPacketsTrueOrUnknown()) {
            if (ip.allSubPacketsTrueOrUnknown()) {
                ip.result = InquiryPacket.ResultType.TRUE;
            } else {
                ip.result = InquiryPacket.ResultType.INDETERMINANT;
            }
        } else if (ip.allEquivalentPacketsFalseOrUnknown()) {
            if (ip.allSubPacketsFalseOrUnknown()) {
                ip.result = InquiryPacket.ResultType.FALSE;
            } else {
                ip.result = InquiryPacket.ResultType.INDETERMINANT;
            }
        } else {
            ip.result = InquiryPacket.ResultType.INDETERMINANT;
        }
    };
    prototype.determineResultForTrueAssertionResult = function(ip) {
        if (ip.allEquivalentPacketsTrueOrUnknown()) {
            if (ip.allSubPacketsTrueOrUnknown()) {
                ip.result = InquiryPacket.ResultType.TRUE;
            } else {
                ip.result = InquiryPacket.ResultType.INDETERMINANT;
            }
        } else {
            ip.result = InquiryPacket.ResultType.INDETERMINANT;
        }
    };
    prototype.determineResultForFalseAssertionResult = function(ip) {
        if (ip.allEquivalentPacketsFalseOrUnknown()) {
            if (ip.allSubPacketsFalseOrUnknown()) {
                ip.result = InquiryPacket.ResultType.FALSE;
            } else {
                ip.result = InquiryPacket.ResultType.INDETERMINANT;
            }
        } else {
            ip.result = InquiryPacket.ResultType.INDETERMINANT;
        }
    };
    /**
     *  IF IP type is COMPETENCY|ROLLUPRULE: assertionResult = ( IF number of
     *  positive assertions > 0 && number of negative assertions = 0 THEN
     *  assertionResult = TRUE IF number of positive assertions = 0 && number of
     *  negative assertions > 0 THEN assertionResult = FALSE IF number of
     *  positive assertions > 0 && number of negative assertions > 0 THEN
     *  assertionResult = INDETERMINANT IF number of positive assertions = 0 &&
     *  number of negative assertions = 0 THEN assertionResult = UNKNOWN )
     *  <p>
     *  IF assertionResult = INDETERMINANT THEN INDETERMINANT ELSE IF any
     *  equivalent packets = INDETERMINANT THEN INDETERMINANT ELSE IF any sub
     *  packets = INDETERMINANT THEN INDETERMINANT
     *  <p>
     *  ELSE IF assertionResult = UNKNOWN: IF all equivalent packets = UNKNOWN IF
     *  all sub packets = UNKNOWN THEN UNKNOWN IF all sub packets = TRUE|UNKNOWN
     *  THEN TRUE IF all sub packets = FALSE|UNKNOWN THEN FALSE ELSE
     *  INDETERMINANT
     *  <p>
     *  ELSE IF all equivalent packets = TRUE|UNKNOWN IF all sub packets =
     *  TRUE|UNKNOWN THEN TRUE ELSE INDETERMINANT
     *  <p>
     *  ELSE IF all equivalent packets = FALSE|UNKNOWN IF all sub packets =
     *  FALSE|UNKNOWN THEN FALSE ELSE INDETERMINANT
     *  <p>
     *  ELSE INDETERMINANT
     *  <p>
     *  <p>
     *  ELSE IF assertionResult = TRUE: IF all equivalent packets = TRUE|UNKNOWN
     *  IF all sub packets = TRUE|UNKNOWN THEN TRUE ELSE INDETERMINANT
     *  <p>
     *  ELSE INDETERMINANT
     *  <p>
     *  ELSE IF assertionResult = FALSE: IF all equivalent packets =
     *  FALSE|UNKNOWN IF all sub packets = FALSE|UNKNOWN THEN FALSE ELSE
     *  INDETERMINANT
     *  <p>
     *  ELSE INDETERMINANT
     */
    prototype.determineCompetencyOrRollupRuleResult = function(ip) {
        var assertionResult = this.getPacketAssertionResult(ip);
        if (InquiryPacket.ResultType.INDETERMINANT.equals(assertionResult) || ip.anyIndeterminantChildPackets()) {
            ip.result = InquiryPacket.ResultType.INDETERMINANT;
        } else if (InquiryPacket.ResultType.UNKNOWN.equals(assertionResult)) {
            this.determineResultForUnknownAssertionResult(ip);
        } else if (InquiryPacket.ResultType.TRUE.equals(assertionResult)) {
            this.determineResultForTrueAssertionResult(ip);
        } else {
            this.determineResultForFalseAssertionResult(ip);
        }
    };
    prototype.determineResult = function(ip) {
        if (ip.numberOfQueriesRunning == 0) {
            if (InquiryPacket.IPType.RELATION_AND.equals(ip.type)) {
                this.determineCombinatorAndResult(ip);
            } else if (InquiryPacket.IPType.RELATION_OR.equals(ip.type)) {
                this.determineCombinatorOrResult(ip);
            } else if (InquiryPacket.IPType.RELATION_NARROWS.equals(ip.type)) {
                this.determineCombinatorNarrowsResult(ip);
            } else if (InquiryPacket.IPType.RELATION_BROADENS.equals(ip.type)) {
                this.determineCombinatorBroadensResult(ip);
            } else if (InquiryPacket.IPType.RELATION_REQUIRES.equals(ip.type)) {
                this.determineCombinatorRequiresResult(ip);
            } else if (InquiryPacket.IPType.RELATION_ISREQUIREDBY.equals(ip.type)) {
                this.determineCombinatorIsRequiredByResult(ip);
            } else {
                this.determineCompetencyOrRollupRuleResult(ip);
            }
        } else {
            this.log(ip, "We are not finished accumulating data to answer this query. Error: " + ip.numberOfQueriesRunning);
        }
    };
}, {relationLookup: "Object", repositories: {name: "Array", arguments: ["EcRepository"]}, logFunction: {name: "Callback1", arguments: ["Object"]}, assertions: "Object", coprocessors: {name: "Array", arguments: ["AssertionCoprocessor"]}, processedEquivalencies: {name: "Map", arguments: [null, null]}, context: "EcFramework"}, {});
var PessimisticQuadnaryAssertionProcessor = function() {
    CombinatorAssertionProcessor.call(this);
};
PessimisticQuadnaryAssertionProcessor = stjs.extend(PessimisticQuadnaryAssertionProcessor, CombinatorAssertionProcessor, [], function(constructor, prototype) {
    prototype.transferIndeterminateOptimistically = true;
    prototype.determineCombinatorAndResult = function(ip) {
        if (ip.anyChildPacketsAreFalse()) 
            ip.result = InquiryPacket.ResultType.FALSE;
         else if (ip.anyIndeterminantChildPackets()) 
            ip.result = InquiryPacket.ResultType.INDETERMINANT;
         else if (ip.anyChildPacketsAreUnknown()) 
            ip.result = InquiryPacket.ResultType.UNKNOWN;
         else 
            ip.result = InquiryPacket.ResultType.TRUE;
    };
    prototype.determineCombinatorNarrowsResult = function(ip) {
        if (ip.anyChildPacketsAreTrue()) 
            ip.result = InquiryPacket.ResultType.TRUE;
         else if (this.transferIndeterminateOptimistically && ip.anyIndeterminantChildPackets()) 
            ip.result = InquiryPacket.ResultType.TRUE;
         else 
            ip.result = InquiryPacket.ResultType.UNKNOWN;
    };
    prototype.determineCombinatorBroadensResult = function(ip) {
        if (ip.anyChildPacketsAreFalse()) 
            ip.result = InquiryPacket.ResultType.FALSE;
         else if (ip.anyIndeterminantChildPackets()) 
            ip.result = InquiryPacket.ResultType.FALSE;
         else 
            ip.result = InquiryPacket.ResultType.UNKNOWN;
    };
    prototype.determineCombinatorRequiresResult = function(ip) {
        if (ip.anyChildPacketsAreFalse()) 
            ip.result = InquiryPacket.ResultType.FALSE;
         else if (ip.anyIndeterminantChildPackets()) 
            ip.result = InquiryPacket.ResultType.FALSE;
         else 
            ip.result = InquiryPacket.ResultType.UNKNOWN;
    };
    prototype.determineCombinatorIsRequiredByResult = function(ip) {
        if (ip.anyChildPacketsAreTrue()) 
            ip.result = InquiryPacket.ResultType.TRUE;
         else if (this.transferIndeterminateOptimistically && ip.anyIndeterminantChildPackets()) 
            ip.result = InquiryPacket.ResultType.TRUE;
         else 
            ip.result = InquiryPacket.ResultType.UNKNOWN;
    };
    prototype.determineCombinatorOrResult = function(ip) {
        if (ip.anyChildPacketsAreTrue()) 
            ip.result = InquiryPacket.ResultType.TRUE;
         else if (ip.anyIndeterminantChildPackets()) 
            ip.result = InquiryPacket.ResultType.INDETERMINANT;
         else if (ip.allChildPacketsUnknown()) 
            ip.result = InquiryPacket.ResultType.UNKNOWN;
         else 
            ip.result = InquiryPacket.ResultType.FALSE;
    };
    prototype.getPacketAssertionResult = function(ip) {
        if (ip.positive.length > 0 && ip.negative.length == 0) 
            return InquiryPacket.ResultType.TRUE;
         else if (ip.positive.length == 0 && ip.negative.length > 0) 
            return InquiryPacket.ResultType.FALSE;
         else if (ip.positive.length > 0 && ip.negative.length > 0) 
            return InquiryPacket.ResultType.INDETERMINANT;
         else 
            return InquiryPacket.ResultType.UNKNOWN;
    };
    prototype.determineResultForUnknownAssertionResult = function(ip) {
        if (ip.allChildPacketsUnknown()) 
            ip.result = InquiryPacket.ResultType.UNKNOWN;
         else if (ip.allEquivalentPacketsUnknown()) {
            if (ip.allSubPacketsTrueOrUnknown()) 
                ip.result = InquiryPacket.ResultType.TRUE;
             else if (ip.allSubPacketsFalseOrUnknown()) 
                ip.result = InquiryPacket.ResultType.FALSE;
             else 
                ip.result = InquiryPacket.ResultType.INDETERMINANT;
        } else if (ip.allEquivalentPacketsTrueOrUnknown()) {
            if (ip.allSubPacketsTrueOrUnknown()) 
                ip.result = InquiryPacket.ResultType.TRUE;
             else 
                ip.result = InquiryPacket.ResultType.INDETERMINANT;
        } else if (ip.allEquivalentPacketsFalseOrUnknown()) {
            if (ip.allSubPacketsFalseOrUnknown()) 
                ip.result = InquiryPacket.ResultType.FALSE;
             else 
                ip.result = InquiryPacket.ResultType.INDETERMINANT;
        } else 
            ip.result = InquiryPacket.ResultType.INDETERMINANT;
    };
    prototype.determineResultForTrueAssertionResult = function(ip) {
        if (ip.allEquivalentPacketsTrueOrUnknown()) {
            if (ip.allSubPacketsTrueOrUnknown()) 
                ip.result = InquiryPacket.ResultType.TRUE;
             else 
                ip.result = InquiryPacket.ResultType.INDETERMINANT;
        } else 
            ip.result = InquiryPacket.ResultType.INDETERMINANT;
    };
    prototype.determineResultForFalseAssertionResult = function(ip) {
        if (ip.allEquivalentPacketsFalseOrUnknown()) {
            if (ip.allSubPacketsFalseOrUnknown()) 
                ip.result = InquiryPacket.ResultType.FALSE;
             else 
                ip.result = InquiryPacket.ResultType.INDETERMINANT;
        } else 
            ip.result = InquiryPacket.ResultType.INDETERMINANT;
    };
    /**
     *  IF IP type is COMPETENCY|ROLLUPRULE: assertionResult = ( IF number of
     *  positive assertions > 0 && number of negative assertions = 0 THEN
     *  assertionResult = TRUE IF number of positive assertions = 0 && number of
     *  negative assertions > 0 THEN assertionResult = FALSE IF number of
     *  positive assertions > 0 && number of negative assertions > 0 THEN
     *  assertionResult = INDETERMINANT IF number of positive assertions = 0 &&
     *  number of negative assertions = 0 THEN assertionResult = UNKNOWN )
     *  <p>
     *  IF assertionResult = INDETERMINANT THEN INDETERMINANT ELSE IF any
     *  equivalent packets = INDETERMINANT THEN INDETERMINANT ELSE IF any sub
     *  packets = INDETERMINANT THEN INDETERMINANT
     *  <p>
     *  ELSE IF assertionResult = UNKNOWN: IF all equivalent packets = UNKNOWN IF
     *  all sub packets = UNKNOWN THEN UNKNOWN IF all sub packets = TRUE|UNKNOWN
     *  THEN TRUE IF all sub packets = FALSE|UNKNOWN THEN FALSE ELSE
     *  INDETERMINANT
     *  <p>
     *  ELSE IF all equivalent packets = TRUE|UNKNOWN IF all sub packets =
     *  TRUE|UNKNOWN THEN TRUE ELSE INDETERMINANT
     *  <p>
     *  ELSE IF all equivalent packets = FALSE|UNKNOWN IF all sub packets =
     *  FALSE|UNKNOWN THEN FALSE ELSE INDETERMINANT
     *  <p>
     *  ELSE INDETERMINANT
     *  <p>
     *  <p>
     *  ELSE IF assertionResult = TRUE: IF all equivalent packets = TRUE|UNKNOWN
     *  IF all sub packets = TRUE|UNKNOWN THEN TRUE ELSE INDETERMINANT
     *  <p>
     *  ELSE INDETERMINANT
     *  <p>
     *  ELSE IF assertionResult = FALSE: IF all equivalent packets =
     *  FALSE|UNKNOWN IF all sub packets = FALSE|UNKNOWN THEN FALSE ELSE
     *  INDETERMINANT
     *  <p>
     *  ELSE INDETERMINANT
     */
    prototype.determineCompetencyOrRollupRuleResult = function(ip) {
        var assertionResult = this.getPacketAssertionResult(ip);
        if (InquiryPacket.ResultType.INDETERMINANT.equals(assertionResult) || ip.anyIndeterminantChildPackets()) 
            ip.result = InquiryPacket.ResultType.INDETERMINANT;
         else if (InquiryPacket.ResultType.UNKNOWN.equals(assertionResult)) 
            this.determineResultForUnknownAssertionResult(ip);
         else if (InquiryPacket.ResultType.TRUE.equals(assertionResult)) 
            this.determineResultForTrueAssertionResult(ip);
         else 
            this.determineResultForFalseAssertionResult(ip);
    };
    prototype.determineResult = function(ip) {
        if (ip.numberOfQueriesRunning == 0) {
            if (InquiryPacket.IPType.RELATION_AND.equals(ip.type)) 
                this.determineCombinatorAndResult(ip);
             else if (InquiryPacket.IPType.RELATION_OR.equals(ip.type)) 
                this.determineCombinatorOrResult(ip);
             else if (InquiryPacket.IPType.RELATION_NARROWS.equals(ip.type)) 
                this.determineCombinatorNarrowsResult(ip);
             else if (InquiryPacket.IPType.RELATION_BROADENS.equals(ip.type)) 
                this.determineCombinatorBroadensResult(ip);
             else if (InquiryPacket.IPType.RELATION_REQUIRES.equals(ip.type)) 
                this.determineCombinatorRequiresResult(ip);
             else if (InquiryPacket.IPType.RELATION_ISREQUIREDBY.equals(ip.type)) 
                this.determineCombinatorIsRequiredByResult(ip);
             else 
                this.determineCompetencyOrRollupRuleResult(ip);
        } else {
            this.log(ip, "We are not finished accumulating data to answer this query. Error: " + ip.numberOfQueriesRunning);
        }
    };
}, {relationLookup: "Object", repositories: {name: "Array", arguments: ["EcRepository"]}, logFunction: {name: "Callback1", arguments: ["Object"]}, assertions: "Object", coprocessors: {name: "Array", arguments: ["AssertionCoprocessor"]}, processedEquivalencies: {name: "Map", arguments: [null, null]}, context: "EcFramework"}, {});
