/**
 *  Created by fray on 5/30/17.
 */
var AssertionCoprocessor = function() {};
AssertionCoprocessor = stjs.extend(AssertionCoprocessor, null, [], function(constructor, prototype) {
    prototype.assertionProcessor = null;
    prototype.collectAssertions = function(ip, listOfCompetencies, success) {
        success(new Array());
    };
}, {assertionProcessor: "AssertionProcessor"}, {});
/**
 *  Data structure used to hold data relevant to a request to determine the competence of an individual.
 *  (hereafter, "Inquiry")
 *  @class InquiryPacket
 *  @module org.cassproject
 *  @author fritz.ray@eduworks.com
 *  @author tom.buskirk@eduworks.com
 */
var InquiryPacket = /**
 *  Create an InquiryPacket.
 *  @constructor
 *  @param {EcPk[]} subject Public keys of the individual to retreive assertions about.
 *  @param {EcCompetency} competency Competency that the inquiry is made about.
 *  @param {EcLevel} level Level of the competency.
 *  @param {EcFramework} context Framework to provide boundaries for the inquiry within.
 *  @param {function(InquiryPacket)} success Method to call when a result has been reached.
 *  @param {function(string)} failure Method to call if the inquiry fails.
 *  @param {string} rule For rollup rules, this is a search used to populate this inquiry packet.
 *  @param {IPType} type The type of this inquiry packet. May be competency, rollup rule, or relation.
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
    constructor.IPType = stjs.enumeration("COMPETENCY", "ROLLUPRULE", "RELATION_AND", "RELATION_OR", "RELATION_NARROWS", "RELATION_BROADENS", "RELATION_REQUIRES", "RELATION_ISREQUIREDBY");
    constructor.ResultType = stjs.enumeration("TRUE", "FALSE", "UNKNOWN", "INDETERMINANT");
    /**
     *  One or more identifiers that identify an individual.
     *  @property subject
     *  @type EcPk[]
     */
    prototype.subject = null;
    /**
     *  Competency that this packet is inquiring about.
     *  May be multiple competencies that are either collapsed due to an inference loop, or are equivalent to one another.
     *  @property competency
     *  @type EcCompetency[]
     */
    prototype.competency = null;
    /**
     *  Framework that this inquiry is scoped to.
     *  @property context
     *  @type EcFramework
     */
    prototype.context = null;
    /**
     *  Callback when this and all child inquiries have successfully reached a conclusion.
     *  @property success
     *  @type function(InquiryPacket)
     */
    prototype.success = null;
    /**
     *  Callback if this inquiry requires additional information to proceed.
     *  @property ask
     *  @type string function(string) 
     */
    prototype.ask = null;
    /**
     *  Callback if this inquiry fails.
     *  @property failure
     *  @type function(string)
     */
    prototype.failure = null;
    /**
     *  Level that the competency is being measured at. 
     *  May have multiple levels referring to multiple competencies due to cycles or equivalence.
     *  @property level
     *  @type EcLevel[]
     */
    prototype.level = null;
    /**
     *  Packets that are equivalent to this packet. May be used when equivalence is best represented with additional packets.
     *  @property equivalentPackets
     *  @type InquiryPacket[]
     */
    prototype.equivalentPackets = null;
    /**
     *  Packets that assist in determining the state of this packet.
     *  @property subPackets
     *  @type InquiryPacket[]
     */
    prototype.subPackets = null;
    /**
     *  Datetime representing when this packet was created.
     *  @property dateCreated
     *  @internal
     *  @type number
     */
    prototype.dateCreated = 0.0;
    /**
     *  Mark true when assertions have been retrieved for this packet.
     *  @property hasCheckedAssertionsForCompetency
     *  @type boolean
     */
    prototype.hasCheckedAssertionsForCompetency = false;
    /**
     *  Mark true when rollup rules have been processed for this packet.
     *  @property hasCheckedRollupRulesForCompetency
     *  @type boolean
     */
    prototype.hasCheckedRollupRulesForCompetency = false;
    /**
     *  Mark true when relations have been processed for this packet.
     *  @property hasCheckedRelationshipsForCompetency
     *  @type boolean
     */
    prototype.hasCheckedRelationshipsForCompetency = false;
    /**
     *  Async counter to keep track of number of unresolved processes.
     *  @property numberOfQueriesRunning
     *  @type integer
     */
    prototype.numberOfQueriesRunning = 0;
    /**
     *  Local log for this inquiry packet.
     *  @property log
     *  @type string
     */
    prototype.log = null;
    /**
     *  Assertions (direct or indirect) that contribute to a positive result.
     *  @property positive
     *  @type EcAssertion[]
     */
    prototype.positive = null;
    /**
     *  Assertions (direct or indirect) that contribute to a negative result.
     *  @property negative
     *  @type EcAssertion[]
     */
    prototype.negative = null;
    /**
     *  Set to true if this packet has completed processing.
     *  @property finished
     *  @type boolean
     */
    prototype.finished = false;
    /**
     *  Set to true if this packet has finished stage one.
     *  @property stageOneFinished
     *  @type boolean
     */
    prototype.stageOneComplete = false;
    /**
     *  Type of inquiry packet. Inquiry packets can represent relational logic, rollup logic or competencies.
     *  @property type
     *  @type IPType
     */
    prototype.type = null;
    /**
     *  Rollup Rule search string. (if IPType == ROLLUPRULE)
     *  @property rule
     *  @type string 
     */
    prototype.rule = null;
    /**
     *  Result as a ResultType.
     *  @property result
     *  @type ResultType
     */
    prototype.result = null;
    prototype.getContext = function() {
        return this.context;
    };
    /**
     *  Returns true if any child packets have an indeterminate result.
     *  @method anyIndeterminantChildPackets
     *  @return {boolean}
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
     *  @method allChildPacketsUnknown
     *  @return {boolean}
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
     *  @method allChildPacketsUnknown
     *  @return {boolean}
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
     *  @method anyChildPacketsAreFalse
     *  @return {boolean} 
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
     *  @method anyChildPacketsAreUnknown
     *  @return {boolean}
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
     *  @method anyChildPacketsAreTrue
     *  @return {boolean}
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
     *  @method allEquivalentPacketsUnknown
     *  @return {boolean}
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
     *  @method allEquivalentPacketsTrueOrUnknown
     *  @return {boolean}
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
     *  @method allSubPacketsTrueOrUnknown
     *  @return {boolean}
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
     *  @method allEquivalentPacketsFalseOrUnknown	
     *  @return {boolean}
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
     *  @param competencyId
     *  @return
     */
    prototype.hasId = function(competencyId) {
        for (var i = 0; i < this.competency.length; i++) 
            if (this.competency[i].isId(competencyId)) 
                return true;
        return false;
    };
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
    prototype.listener = null;
    prototype.logFunction = null;
    prototype.parser = null;
    prototype.processor = null;
    prototype.success = null;
    prototype.failure = null;
    prototype.go = function() {
        this.processor.logFunction = this.logFunction;
        this.processor.success = this.success;
        this.processor.failure = this.failure;
        this.parser.s();
    };
}, {listener: "RollupListener.RollupListener", logFunction: {name: "Callback1", arguments: ["Object"]}, parser: "RollupParser.RollupParser", processor: "RollupRuleProcessor", success: {name: "Callback1", arguments: [null]}, failure: {name: "Callback1", arguments: [null]}}, {});
var RollupRulePacketGenerator = function(ip, ep) {
    this.ip = ip;
    this.ep = ep;
    this.queries = new Array();
    this.queryOperations = new Array();
};
RollupRulePacketGenerator = stjs.extend(RollupRulePacketGenerator, null, [], function(constructor, prototype) {
    constructor.OperationType = stjs.enumeration("AND", "OR");
    prototype.queries = null;
    prototype.queryOperations = null;
    prototype.ip = null;
    prototype.ep = null;
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
    constructor.main = function(args) {};
}, {queries: {name: "Array", arguments: [null]}, queryOperations: {name: "Array", arguments: [{name: "Enum", arguments: ["RollupRulePacketGenerator.OperationType"]}]}, ip: "InquiryPacket", ep: "AssertionProcessor"}, {});
if (!stjs.mainCallDisabled) 
    RollupRulePacketGenerator.main();
/**
 *  Creates child packets for an InquiryPacket based on its context. 
 *  @class RelationshipPacketGenerator
 *  @author fritz.ray@eduworks.com
 *  @author tom.buskirk@eduworks.com
 *  @module org.cassproject
 */
var RelationshipPacketGenerator = /**
 *  Constructor for the RelationshipPacketGenerator
 *  @constructor
 *  @param {InquiryPacket} ip Inquiry Packet to generate and fill with relationship packets.
 *  @param {AssertionProcessor} ep Assertion processor to tell to resume when complete.
 *  @param {object} processedAlignments An object to fill with keys to ensure that relations are not processed twice.
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
     *  @property failure
     *  @type function(string)
     */
    prototype.failure = null;
    /**
     *  Method to call when the operation succeeds.
     *  @property success
     *  @type function()
     */
    prototype.success = null;
    /**
     *  Method to call when the generator has log statements to emit.
     *  @property logFunction
     *  @type function(any)
     */
    prototype.logFunction = null;
    /**
     *  Async counter to keep track of number of outstanding requests.
     *  @property numberOfRelationsToProcess
     *  @type integer
     */
    prototype.numberOfRelationsToProcess = 0;
    /**
     *  Number of relations that have been processed.
     *  @property numberOfRelationsProcessed
     *  @type integer
     */
    prototype.numberOfRelationsProcessed = 0;
    /**
     *  List of packets representing the narrows relation.
     *  @property narrowsPackets
     *  @type InquiryPacket[]
     */
    prototype.narrowsPackets = null;
    /**
     *  List of packets representing the broadens relation.
     *  @property broadensPackets
     *  @type InquiryPacket[]
     */
    prototype.broadensPackets = null;
    /**
     *  List of packets representing the required relation.
     *  @property requiredPackets
     *  @type InquiryPacket[]
     */
    prototype.requiredPackets = null;
    /**
     *  List of packets representing the isRequiredBy relation.
     *  @property isRequiredByPackets
     *  @type InquiryPacket[]
     */
    prototype.isRequiredByPackets = null;
    /**
     *  Alignments to ignore, as they have already been processed.
     *  @property processedAlignments;
     *  @type Object (Map<String,String>)
     */
    prototype.processedAlignments = null;
    /**
     *  Assertion Processor that invoked this generator.
     *  @property ep
     *  @type AssertionProcessor
     */
    prototype.ep = null;
    /**
     *  Inquiry Packet that this generator is creating relationships for.
     *  @property ip
     *  @type InquiryPacket
     */
    prototype.ip = null;
    prototype.relationLookup = null;
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
        EcCompetency.get(relatedCompetencyId, function(p1) {
            rpg.processGetRelatedCompetencySuccess(p1, alignment);
        }, function(p1) {
            rpg.processEventFailure(p1, ip);
        });
    };
    /**
     *  Method to invoke to begin relation processing.
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
}, {failure: {name: "Callback1", arguments: [null]}, success: "Callback0", logFunction: {name: "Callback1", arguments: ["Object"]}, narrowsPackets: {name: "Array", arguments: ["InquiryPacket"]}, broadensPackets: {name: "Array", arguments: ["InquiryPacket"]}, requiredPackets: {name: "Array", arguments: ["InquiryPacket"]}, isRequiredByPackets: {name: "Array", arguments: ["InquiryPacket"]}, processedAlignments: {name: "Map", arguments: [null, null]}, ep: "AssertionProcessor", ip: "InquiryPacket", relationLookup: "Object"}, {});
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
    prototype.repositories = null;
    prototype.step = false;
    prototype.profileMode = false;
    prototype.logFunction = null;
    prototype.assertions = null;
    prototype.coprocessors = null;
    constructor.DEF_STEP = false;
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
                success(ip);
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
        if (InquiryPacket.IPType.ROLLUPRULE.equals(ip.type)) 
            result = "(" + new EcAssertion().getSearchStringByType() + ") AND (" + ip.rule + ")";
         else if (InquiryPacket.IPType.COMPETENCY.equals(ip.type)) 
            result = new EcAssertion().getSearchStringByTypeAndCompetency(competency);
        for (var i = 0; i < ip.subject.length; i++) 
            result += " AND (\\*@reader:\"" + ip.subject[i].toPem() + "\")";
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
var RollupRuleProcessor = function(ip, ep) {
    this.ip = ip;
    this.rollupRulePacketGenerator = new RollupRulePacketGenerator(ip, ep);
};
RollupRuleProcessor = stjs.extend(RollupRuleProcessor, null, [], function(constructor, prototype) {
    prototype.onQueryExitResult = null;
    prototype.query = null;
    prototype.success = null;
    prototype.failure = null;
    prototype.logFunction = null;
    prototype.positive = null;
    prototype.negative = null;
    prototype.s = null;
    prototype.tok = null;
    prototype.que = null;
    prototype.ip = null;
    prototype.rollupRulePacketGenerator = null;
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
            if ("AND".equals(ctx.cLogic.text.toUpperCase())) {
                this.log("ADDING OPERATION: " + RollupRulePacketGenerator.OperationType.AND);
                this.rollupRulePacketGenerator.addQueryOperation(RollupRulePacketGenerator.OperationType.AND);
            } else if ("OR".equals(ctx.cLogic.text.toUpperCase())) {
                this.log("ADDING OPERATION: " + RollupRulePacketGenerator.OperationType.OR);
                this.rollupRulePacketGenerator.addQueryOperation(RollupRulePacketGenerator.OperationType.OR);
            }
        }
    };
}, {success: {name: "Callback1", arguments: [null]}, failure: {name: "Callback1", arguments: [null]}, logFunction: {name: "Callback1", arguments: ["Object"]}, positive: {name: "Array", arguments: ["EcAssertion"]}, negative: {name: "Array", arguments: ["EcAssertion"]}, s: "RrS", tok: "RrToken", que: "RrQuery", ip: "InquiryPacket", rollupRulePacketGenerator: "RollupRulePacketGenerator"}, {});
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
        } else if (ip.allChildPacketsAreTrue()) {
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
     * 
     *  IF assertionResult = INDETERMINANT THEN INDETERMINANT ELSE IF any
     *  equivalent packets = INDETERMINANT THEN INDETERMINANT ELSE IF any sub
     *  packets = INDETERMINANT THEN INDETERMINANT
     * 
     *  ELSE IF assertionResult = UNKNOWN: IF all equivalent packets = UNKNOWN IF
     *  all sub packets = UNKNOWN THEN UNKNOWN IF all sub packets = TRUE|UNKNOWN
     *  THEN TRUE IF all sub packets = FALSE|UNKNOWN THEN FALSE ELSE
     *  INDETERMINANT
     * 
     *  ELSE IF all equivalent packets = TRUE|UNKNOWN IF all sub packets =
     *  TRUE|UNKNOWN THEN TRUE ELSE INDETERMINANT
     * 
     *  ELSE IF all equivalent packets = FALSE|UNKNOWN IF all sub packets =
     *  FALSE|UNKNOWN THEN FALSE ELSE INDETERMINANT
     * 
     *  ELSE INDETERMINANT
     * 
     * 
     *  ELSE IF assertionResult = TRUE: IF all equivalent packets = TRUE|UNKNOWN
     *  IF all sub packets = TRUE|UNKNOWN THEN TRUE ELSE INDETERMINANT
     * 
     *  ELSE INDETERMINANT
     * 
     *  ELSE IF assertionResult = FALSE: IF all equivalent packets =
     *  FALSE|UNKNOWN IF all sub packets = FALSE|UNKNOWN THEN FALSE ELSE
     *  INDETERMINANT
     * 
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
            ip.result = InquiryPacket.ResultType.FALSE;
         else 
            ip.result = InquiryPacket.ResultType.UNKNOWN;
    };
    prototype.determineCombinatorBroadensResult = function(ip) {
        if (ip.anyChildPacketsAreFalse()) 
            ip.result = InquiryPacket.ResultType.FALSE;
         else if (this.transferIndeterminateOptimistically && ip.anyIndeterminantChildPackets()) 
            ip.result = InquiryPacket.ResultType.TRUE;
         else 
            ip.result = InquiryPacket.ResultType.UNKNOWN;
    };
    prototype.determineCombinatorRequiresResult = function(ip) {
        if (ip.anyChildPacketsAreFalse()) 
            ip.result = InquiryPacket.ResultType.FALSE;
         else if (this.transferIndeterminateOptimistically && ip.anyIndeterminantChildPackets()) 
            ip.result = InquiryPacket.ResultType.TRUE;
         else 
            ip.result = InquiryPacket.ResultType.UNKNOWN;
    };
    prototype.determineCombinatorIsRequiredByResult = function(ip) {
        if (ip.anyChildPacketsAreTrue()) 
            ip.result = InquiryPacket.ResultType.TRUE;
         else if (this.transferIndeterminateOptimistically && ip.anyIndeterminantChildPackets()) 
            ip.result = InquiryPacket.ResultType.FALSE;
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
     *  
     *  IF assertionResult = INDETERMINANT THEN INDETERMINANT ELSE IF any
     *  equivalent packets = INDETERMINANT THEN INDETERMINANT ELSE IF any sub
     *  packets = INDETERMINANT THEN INDETERMINANT
     *  
     *  ELSE IF assertionResult = UNKNOWN: IF all equivalent packets = UNKNOWN IF
     *  all sub packets = UNKNOWN THEN UNKNOWN IF all sub packets = TRUE|UNKNOWN
     *  THEN TRUE IF all sub packets = FALSE|UNKNOWN THEN FALSE ELSE
     *  INDETERMINANT
     *  
     *  ELSE IF all equivalent packets = TRUE|UNKNOWN IF all sub packets =
     *  TRUE|UNKNOWN THEN TRUE ELSE INDETERMINANT
     *  
     *  ELSE IF all equivalent packets = FALSE|UNKNOWN IF all sub packets =
     *  FALSE|UNKNOWN THEN FALSE ELSE INDETERMINANT
     *  
     *  ELSE INDETERMINANT
     *  
     *  
     *  ELSE IF assertionResult = TRUE: IF all equivalent packets = TRUE|UNKNOWN
     *  IF all sub packets = TRUE|UNKNOWN THEN TRUE ELSE INDETERMINANT
     *  
     *  ELSE INDETERMINANT
     *  
     *  ELSE IF assertionResult = FALSE: IF all equivalent packets =
     *  FALSE|UNKNOWN IF all sub packets = FALSE|UNKNOWN THEN FALSE ELSE
     *  INDETERMINANT
     *  
     *  ELSE INDETERMINANT
     *  
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
