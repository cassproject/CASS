/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
var InquiryPacket = function(subject, competency, level, context, success, failure, rule, type) {
    this.positive = new Array();
    this.negative = new Array();
    this.equivalentPackets = new Array();
    this.subPackets = new Array();
    this.dateCreated = new Date().getTime();
    this.subject = subject;
    this.competency = new Array();
    if (competency != null) 
        this.competency.push(competency);
    this.level = level;
    this.context = context;
    this.success = success;
    this.failure = failure;
    this.rule = rule;
    this.type = type;
    this.result = null;
    this.log = "";
};
InquiryPacket = stjs.extend(InquiryPacket, null, [], function(constructor, prototype) {
    constructor.IPType = stjs.enumeration("COMPETENCY", "ROLLUPRULE", "RELATION_AND", "RELATION_OR", "RELATION_NARROWS", "RELATION_BROADENS", "RELATION_REQUIRES", "RELATION_ISREQUIREDBY");
    constructor.ResultType = stjs.enumeration("TRUE", "FALSE", "UNKNOWN", "INDETERMINANT");
    prototype.subject = null;
    prototype.competency = null;
    prototype.context = null;
    prototype.success = null;
    prototype.ask = null;
    prototype.failure = null;
    prototype.level = null;
    prototype.equivalentPackets = null;
    prototype.subPackets = null;
    prototype.dateCreated = 0.0;
    prototype.hasCheckedAssertionsForCompetency = false;
    prototype.hasCheckedRollupRulesForCompetency = false;
    prototype.hasCheckedRelationshipsForCompetency = false;
    prototype.numberOfQueriesRunning = 0;
    prototype.log = null;
    prototype.positive = null;
    prototype.negative = null;
    prototype.status = null;
    prototype.finished = false;
    prototype.type = null;
    prototype.rule = null;
    prototype.result = null;
    prototype.getContext = function() {
        return this.context;
    };
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
    prototype.allEquivalentPacketsUnknown = function() {
        for (var i = 0; i < this.equivalentPackets.length; i++) {
            if (!InquiryPacket.ResultType.UNKNOWN.equals(this.equivalentPackets[i].result)) 
                return false;
        }
        return true;
    };
    prototype.allEquivalentPacketsTrueOrUnknown = function() {
        for (var i = 0; i < this.equivalentPackets.length; i++) {
            if (InquiryPacket.ResultType.FALSE.equals(this.equivalentPackets[i].result) || InquiryPacket.ResultType.INDETERMINANT.equals(this.equivalentPackets[i].result)) 
                return false;
        }
        return true;
    };
    prototype.allSubPacketsTrueOrUnknown = function() {
        for (var i = 0; i < this.subPackets.length; i++) {
            if (InquiryPacket.ResultType.FALSE.equals(this.subPackets[i].result) || InquiryPacket.ResultType.INDETERMINANT.equals(this.subPackets[i].result)) 
                return false;
        }
        return true;
    };
    prototype.allEquivalentPacketsFalseOrUnknown = function() {
        for (var i = 0; i < this.equivalentPackets.length; i++) {
            if (InquiryPacket.ResultType.TRUE.equals(this.equivalentPackets[i].result) || InquiryPacket.ResultType.INDETERMINANT.equals(this.equivalentPackets[i].result)) 
                return false;
        }
        return true;
    };
    prototype.allSubPacketsFalseOrUnknown = function() {
        for (var i = 0; i < this.subPackets.length; i++) {
            if (InquiryPacket.ResultType.TRUE.equals(this.subPackets[i].result) || InquiryPacket.ResultType.INDETERMINANT.equals(this.subPackets[i].result)) 
                return false;
        }
        return true;
    };
    prototype.hasId = function(competencyId) {
        for (var i = 0; i < this.competency.length; i++) 
            if (this.competency[i].isId(competencyId)) 
                return true;
        return false;
    };
}, {subject: {name: "Array", arguments: ["EcPk"]}, competency: {name: "Array", arguments: ["EcCompetency"]}, context: "EcFramework", success: {name: "Callback1", arguments: ["InquiryPacket"]}, ask: {name: "Function1", arguments: [null, null]}, failure: {name: "Callback1", arguments: [null]}, level: "EcLevel", equivalentPackets: {name: "Array", arguments: ["InquiryPacket"]}, subPackets: {name: "Array", arguments: ["InquiryPacket"]}, positive: {name: "Array", arguments: ["EcAssertion"]}, negative: {name: "Array", arguments: ["EcAssertion"]}, type: {name: "Enum", arguments: ["InquiryPacket.IPType"]}, result: {name: "Enum", arguments: ["InquiryPacket.ResultType"]}}, {});
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
                meEp.continueProcessing(meIp);
        }, this.ip.failure, null, InquiryPacket.IPType.RELATION_AND);
    };
    prototype.generateRollupRulePacket = function(rule) {
        var meEp = this.ep;
        var meIp = this.ip;
        return new InquiryPacket(this.ip.subject, null, null, this.ip.context, function(p1) {
            if (meEp != null) 
                meEp.continueProcessing(meIp);
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
                meEp.continueProcessing(meIp);
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
var RelationshipPacketGenerator = function(ip, ep, processedAlignments) {
    this.ip = ip;
    this.ep = ep;
    this.processedAlignments = processedAlignments;
    this.narrowsPackets = new Array();
    this.broadensPackets = new Array();
    this.requiredPackets = new Array();
    this.isRequiredByPackets = new Array();
};
RelationshipPacketGenerator = stjs.extend(RelationshipPacketGenerator, null, [], function(constructor, prototype) {
    prototype.failure = null;
    prototype.success = null;
    prototype.logFunction = null;
    prototype.numberOfRelationsToProcess = 0;
    prototype.numberOfRelationsProcessed = 0;
    prototype.narrowsPackets = null;
    prototype.broadensPackets = null;
    prototype.requiredPackets = null;
    prototype.isRequiredByPackets = null;
    prototype.processedAlignments = null;
    prototype.ep = null;
    prototype.ip = null;
    prototype.log = function(string) {
        if (this.logFunction != null) 
            this.logFunction(string);
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
                    meEp.continueProcessing(meIp);
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
                    meEp.continueProcessing(meIp);
            }, this.ip.failure, null, InquiryPacket.IPType.RELATION_ISREQUIREDBY);
            rootRequiredPacket.subPackets = this.requiredPackets;
            this.ip.subPackets.push(rootRequiredPacket);
        }
    };
    prototype.pushNarrowsPacketsToIp = function() {
        if (this.narrowsPackets.length > 0) {
            var meEp = this.ep;
            var meIp = this.ip;
            var rootNarrowsPacket = new InquiryPacket(this.ip.subject, null, null, this.ip.context, function(p1) {
                if (meEp != null) 
                    meEp.continueProcessing(meIp);
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
                    meEp.continueProcessing(meIp);
            }, this.ip.failure, null, InquiryPacket.IPType.RELATION_BROADENS);
            rootBroadensPacket.subPackets = this.broadensPackets;
            this.ip.subPackets.push(rootBroadensPacket);
        }
    };
    prototype.finishRelationProcessing = function() {
        this.pushRequiredPacketsToIp();
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
                    meEp.continueProcessing(meIp);
            }, this.ip.failure, null, InquiryPacket.IPType.COMPETENCY));
        } else if (EcAlignment.REQUIRES.equals(alignment.relationType)) {
            if (this.ip.hasId(alignment.source)) 
                this.requiredPackets.push(new InquiryPacket(this.ip.subject, relatedCompetency, null, this.ip.context, function(p1) {
                    if (meEp != null) 
                        meEp.continueProcessing(meIp);
                }, this.ip.failure, null, InquiryPacket.IPType.COMPETENCY));
             else 
                this.isRequiredByPackets.push(new InquiryPacket(this.ip.subject, relatedCompetency, null, this.ip.context, function(p1) {
                    if (meEp != null) 
                        meEp.continueProcessing(meIp);
                }, this.ip.failure, null, InquiryPacket.IPType.COMPETENCY));
        } else if (EcAlignment.NARROWS.equals(alignment.relationType)) {
            if (this.ip.hasId(alignment.source)) 
                this.narrowsPackets.push(new InquiryPacket(this.ip.subject, relatedCompetency, null, this.ip.context, function(p1) {
                    if (meEp != null) 
                        meEp.continueProcessing(meIp);
                }, this.ip.failure, null, InquiryPacket.IPType.COMPETENCY));
             else 
                this.broadensPackets.push(new InquiryPacket(this.ip.subject, relatedCompetency, null, this.ip.context, function(p1) {
                    if (meEp != null) 
                        meEp.continueProcessing(meIp);
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
        if (ip.hasId(alignment.source)) 
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
    prototype.go = function() {
        var rpg = this;
        if (this.ip.getContext().relation == null) 
            this.success();
         else {
            this.numberOfRelationsToProcess = this.ip.getContext().relation.length;
            this.numberOfRelationsProcessed = 0;
            for (var i = 0; i < this.ip.getContext().relation.length; i++) {
                this.ip.numberOfQueriesRunning++;
                EcAlignment.get(this.ip.getContext().relation[i], function(p1) {
                    rpg.processFindCompetencyRelationshipSuccess(p1, rpg.ip);
                }, function(p1) {
                    rpg.processEventFailure(p1, rpg.ip);
                });
            }
        }
    };
}, {failure: {name: "Callback1", arguments: [null]}, success: "Callback0", logFunction: {name: "Callback1", arguments: ["Object"]}, narrowsPackets: {name: "Array", arguments: ["InquiryPacket"]}, broadensPackets: {name: "Array", arguments: ["InquiryPacket"]}, requiredPackets: {name: "Array", arguments: ["InquiryPacket"]}, isRequiredByPackets: {name: "Array", arguments: ["InquiryPacket"]}, processedAlignments: {name: "Map", arguments: [null, null]}, ep: "AssertionProcessor", ip: "InquiryPacket"}, {});
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
var AssertionProcessor = function() {
    this.repositories = new Array();
    this.step = AssertionProcessor.DEF_STEP;
};
AssertionProcessor = stjs.extend(AssertionProcessor, null, [], function(constructor, prototype) {
    prototype.repositories = null;
    prototype.step = false;
    prototype.logFunction = null;
    constructor.DEF_STEP = false;
    prototype.processedEquivalencies = null;
    prototype.log = function(ip, string) {
        if (this.logFunction != null) 
            this.logFunction(string);
        ip.log += "\n" + string;
    };
    prototype.has = function(subject, competency, level, context, additionalSignatures, success, ask, failure) {
        var ip = new InquiryPacket(subject, competency, level, context, success, failure, null, InquiryPacket.IPType.COMPETENCY);
        this.processedEquivalencies = {};
        this.log(ip, "Created new inquiry.");
        this.continueProcessing(ip);
    };
    prototype.isIn = function(ip, alreadyDone) {
        for (var i = 0; i < alreadyDone.length; i++) 
            if (ip == alreadyDone[i]) 
                return true;
        return false;
    };
    prototype.continueProcessing = function(ip) {
        if (!ip.finished) {
            if (!ip.hasCheckedAssertionsForCompetency) {
                this.findSubjectAssertionsForCompetency(ip);
                return true;
            } else if (!ip.hasCheckedRelationshipsForCompetency) {
                this.findCompetencyRelationships(ip);
                return true;
            } else if (!ip.hasCheckedRollupRulesForCompetency) {
                this.findRollupRulesForCompetency(ip);
                return true;
            } else {
                ip.finished = true;
            }
        }
        if (ip.finished) {
            if (this.processChildPackets(ip.equivalentPackets)) 
                return true;
            if (this.processChildPackets(ip.subPackets)) 
                return true;
        }
        if (ip.result == null) {
            this.determineResult(ip);
            if (ip.result != null && ip.success != null) 
                ip.success(ip);
            return true;
        }
        return false;
    };
    prototype.determineResult = function(ip) {};
    prototype.findCompetencyRelationships = function(ip) {};
    prototype.findSubjectAssertionsForCompetency = function(ip) {};
    prototype.processChildPackets = function(childPackets) {
        if (childPackets != null) {
            for (var i = 0; i < childPackets.length; i++) {
                if (this.continueProcessing(childPackets[i])) 
                    return true;
            }
        }
        return false;
    };
    prototype.checkStep = function(ip) {
        this.log(ip, "Checkstep: " + ip.numberOfQueriesRunning);
        if (ip.numberOfQueriesRunning == 0) {
            if (!this.step) 
                this.continueProcessing(ip);
        }
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
        this.log(ip, "Evidence:");
        for (var j = 0; j < a.getEvidenceCount(); j++) 
            this.log(ip, "  " + a.getEvidence(j));
        this.log(ip, "Recording in inquiry.");
    };
    prototype.buildAssertionSearchQuery = function(ip, competency) {
        if (InquiryPacket.IPType.ROLLUPRULE.equals(ip.type)) 
            return "(" + new EcAssertion().getSearchStringByType() + ") AND (" + ip.rule + ")";
         else if (InquiryPacket.IPType.COMPETENCY.equals(ip.type)) 
            return new EcAssertion().getSearchStringByTypeAndCompetency(competency);
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
        ip.status = status;
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
        if (ip.getContext().rollupRule == null) 
            this.continueProcessing(ip);
         else 
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
}, {repositories: {name: "Array", arguments: ["EcRepository"]}, logFunction: {name: "Callback1", arguments: ["Object"]}, processedEquivalencies: {name: "Map", arguments: [null, null]}}, {});
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
    prototype.processFoundAssertion = function(searchData, ip) {
        var a = new EcAssertion();
        a.copyFrom(searchData);
        var currentSubject;
        for (var i = 0; i < ip.subject.length; i++) {
            currentSubject = ip.subject[i];
            if (a.getSubject() == null) 
                continue;
            if (a.getSubject().equals(currentSubject)) {
                this.log(ip, "Matching Assertion found.");
                var assertionDate = a.getAssertionDate();
                if (assertionDate != null) 
                    if (assertionDate > stjs.trunc(new Date().getTime())) {
                        this.log(ip, "Assertion is made for a future date.");
                        return;
                    } else {
                        var expirationDate = a.getExpirationDate();
                        if (expirationDate != null) 
                            if (expirationDate <= stjs.trunc(new Date().getTime())) {
                                this.log(ip, "Assertion is expired. Skipping.");
                                return;
                            }
                    }
                this.logFoundAssertion(a, ip);
                if (a.getNegative()) {
                    this.log(ip, "Found valid negative assertion");
                    ip.negative.push(a);
                } else {
                    this.log(ip, "Found valid positive assertion");
                    ip.positive.push(a);
                }
            }
        }
    };
    prototype.processFindAssertionsSuccess = function(data, ip) {
        if (data.length == 0) 
            this.log(ip, "No results found.");
         else 
            this.log(ip, "Total number of assertions found: " + data.length);
        ip.numberOfQueriesRunning--;
        this.checkStep(ip);
    };
    prototype.findSubjectAssertionsForCompetency = function(ip) {
        ip.hasCheckedAssertionsForCompetency = true;
        if (!InquiryPacket.IPType.COMPETENCY.equals(ip.type) && !InquiryPacket.IPType.ROLLUPRULE.equals(ip.type)) {
            this.log(ip, "No assertions for combinator types");
            this.checkStep(ip);
            return;
        }
        var ep = this;
        for (var i = 0; i < this.repositories.length; i++) {
            var currentRepository = this.repositories[i];
            if (InquiryPacket.IPType.COMPETENCY.equals(ip.type)) 
                this.log(ip, "Searching: " + currentRepository.selectedServer);
            for (var h = 0; h < ip.competency.length; h++) {
                ip.numberOfQueriesRunning++;
                var competency = ip.competency[h];
                this.log(ip, "Querying repositories for subject assertions on competency: " + competency.id);
                currentRepository.search(this.buildAssertionSearchQuery(ip, competency), function(p1) {
                    ep.processFoundAssertion(p1, ip);
                }, function(p1) {
                    ep.processFindAssertionsSuccess(p1, ip);
                }, function(p1) {
                    ep.processEventFailure(p1, ip);
                });
            }
            if (InquiryPacket.IPType.ROLLUPRULE.equals(ip.type)) {
                ip.numberOfQueriesRunning++;
                this.log(ip, "Searching: " + currentRepository.selectedServer);
                currentRepository.search(this.buildAssertionSearchQuery(ip, null), function(p1) {
                    ep.processFoundAssertion(p1, ip);
                }, function(p1) {
                    ep.processFindAssertionsSuccess(p1, ip);
                }, function(p1) {
                    ep.processEventFailure(p1, ip);
                });
            }
        }
    };
    prototype.findCompetencyRelationships = function(ip) {
        ip.hasCheckedRelationshipsForCompetency = true;
        if (!InquiryPacket.IPType.COMPETENCY.equals(ip.type)) {
            this.log(ip, "No relationships for combinator types");
            this.checkStep(ip);
            return;
        }
        var ep = this;
        for (var i = 0; i < ip.competency.length; i++) {
            this.log(ip, "Finding relationships for competency: " + ip.competency[i]);
            this.findCompetencyRelationship(ip, ep, ip.competency[i]);
        }
    };
    prototype.findCompetencyRelationship = function(ip, ep, c) {
        var rpg = new RelationshipPacketGenerator(ip, ep, this.processedEquivalencies);
        rpg.failure = ip.failure;
        rpg.logFunction = this.logFunction;
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
}, {repositories: {name: "Array", arguments: ["EcRepository"]}, logFunction: {name: "Callback1", arguments: ["Object"]}, processedEquivalencies: {name: "Map", arguments: [null, null]}}, {});
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
}, {repositories: {name: "Array", arguments: ["EcRepository"]}, logFunction: {name: "Callback1", arguments: ["Object"]}, processedEquivalencies: {name: "Map", arguments: [null, null]}}, {});
