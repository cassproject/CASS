/*-
 * --BEGIN_LICENSE--
 * Competency and Skills System
 * -----
 * Copyright (C) 2015 - 2020 Eduworks Corporation and other contributing parties.
 * -----
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * --END_LICENSE--
 */

// Generated from Rollup.g4 by ANTLR 4.8
// jshint ignore: start
var antlr4 = require('antlr4/index');



var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0002\f`\b\u0001\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004",
    "\t\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t\u0007",
    "\u0004\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0003\u0002",
    "\u0006\u0002\u0019\n\u0002\r\u0002\u000e\u0002\u001a\u0003\u0002\u0003",
    "\u0002\u0006\u0002\u001f\n\u0002\r\u0002\u000e\u0002 \u0005\u0002#\n",
    "\u0002\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0005\u0003.\n\u0003\u0003",
    "\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0005\u00045",
    "\n\u0004\u0003\u0005\u0003\u0005\u0003\u0006\u0003\u0006\u0003\u0006",
    "\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006",
    "\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0005\u0006",
    "G\n\u0006\u0003\u0007\u0006\u0007J\n\u0007\r\u0007\u000e\u0007K\u0003",
    "\b\u0006\bO\n\b\r\b\u000e\bP\u0003\t\u0003\t\u0003\n\u0003\n\u0003\u000b",
    "\u0003\u000b\u0003\u000b\u0003\u000b\u0003\u000b\u0003\u000b\u0006\u000b",
    "]\n\u000b\r\u000b\u000e\u000b^\u0002\u0002\f\u0003\u0003\u0005\u0004",
    "\u0007\u0005\t\u0006\u000b\u0007\r\b\u000f\t\u0011\n\u0013\u000b\u0015",
    "\f\u0003\u0002\u0006\u0005\u0002,-//11\u0005\u0002\u000b\f\u000f\u000f",
    "\"\"\u0005\u000200C\\c|\u0003\u0002\"\"\u0002l\u0002\u0003\u0003\u0002",
    "\u0002\u0002\u0002\u0005\u0003\u0002\u0002\u0002\u0002\u0007\u0003\u0002",
    "\u0002\u0002\u0002\t\u0003\u0002\u0002\u0002\u0002\u000b\u0003\u0002",
    "\u0002\u0002\u0002\r\u0003\u0002\u0002\u0002\u0002\u000f\u0003\u0002",
    "\u0002\u0002\u0002\u0011\u0003\u0002\u0002\u0002\u0002\u0013\u0003\u0002",
    "\u0002\u0002\u0002\u0015\u0003\u0002\u0002\u0002\u0003\u0018\u0003\u0002",
    "\u0002\u0002\u0005-\u0003\u0002\u0002\u0002\u00074\u0003\u0002\u0002",
    "\u0002\t6\u0003\u0002\u0002\u0002\u000bF\u0003\u0002\u0002\u0002\rI",
    "\u0003\u0002\u0002\u0002\u000fN\u0003\u0002\u0002\u0002\u0011R\u0003",
    "\u0002\u0002\u0002\u0013T\u0003\u0002\u0002\u0002\u0015V\u0003\u0002",
    "\u0002\u0002\u0017\u0019\u00042;\u0002\u0018\u0017\u0003\u0002\u0002",
    "\u0002\u0019\u001a\u0003\u0002\u0002\u0002\u001a\u0018\u0003\u0002\u0002",
    "\u0002\u001a\u001b\u0003\u0002\u0002\u0002\u001b\"\u0003\u0002\u0002",
    "\u0002\u001c\u001e\u00070\u0002\u0002\u001d\u001f\u00042;\u0002\u001e",
    "\u001d\u0003\u0002\u0002\u0002\u001f \u0003\u0002\u0002\u0002 \u001e",
    "\u0003\u0002\u0002\u0002 !\u0003\u0002\u0002\u0002!#\u0003\u0002\u0002",
    "\u0002\"\u001c\u0003\u0002\u0002\u0002\"#\u0003\u0002\u0002\u0002#\u0004",
    "\u0003\u0002\u0002\u0002$%\u0007v\u0002\u0002%&\u0007t\u0002\u0002&",
    "\'\u0007w\u0002\u0002\'.\u0007g\u0002\u0002()\u0007h\u0002\u0002)*\u0007",
    "c\u0002\u0002*+\u0007n\u0002\u0002+,\u0007u\u0002\u0002,.\u0007g\u0002",
    "\u0002-$\u0003\u0002\u0002\u0002-(\u0003\u0002\u0002\u0002.\u0006\u0003",
    "\u0002\u0002\u0002/0\u0007C\u0002\u000201\u0007P\u0002\u000215\u0007",
    "F\u0002\u000223\u0007Q\u0002\u000235\u0007T\u0002\u00024/\u0003\u0002",
    "\u0002\u000242\u0003\u0002\u0002\u00025\b\u0003\u0002\u0002\u000267",
    "\t\u0002\u0002\u00027\n\u0003\u0002\u0002\u000289\u0007<\u0002\u0002",
    "9G\u0007>\u0002\u0002:;\u0007<\u0002\u0002;G\u0007@\u0002\u0002<=\u0007",
    "<\u0002\u0002=>\u0007>\u0002\u0002>G\u0007?\u0002\u0002?@\u0007<\u0002",
    "\u0002@A\u0007@\u0002\u0002AG\u0007?\u0002\u0002BC\u0007<\u0002\u0002",
    "CD\u0007#\u0002\u0002DG\u0007?\u0002\u0002EG\u0007<\u0002\u0002F8\u0003",
    "\u0002\u0002\u0002F:\u0003\u0002\u0002\u0002F<\u0003\u0002\u0002\u0002",
    "F?\u0003\u0002\u0002\u0002FB\u0003\u0002\u0002\u0002FE\u0003\u0002\u0002",
    "\u0002G\f\u0003\u0002\u0002\u0002HJ\t\u0003\u0002\u0002IH\u0003\u0002",
    "\u0002\u0002JK\u0003\u0002\u0002\u0002KI\u0003\u0002\u0002\u0002KL\u0003",
    "\u0002\u0002\u0002L\u000e\u0003\u0002\u0002\u0002MO\t\u0004\u0002\u0002",
    "NM\u0003\u0002\u0002\u0002OP\u0003\u0002\u0002\u0002PN\u0003\u0002\u0002",
    "\u0002PQ\u0003\u0002\u0002\u0002Q\u0010\u0003\u0002\u0002\u0002RS\u0007",
    "]\u0002\u0002S\u0012\u0003\u0002\u0002\u0002TU\u0007_\u0002\u0002U\u0014",
    "\u0003\u0002\u0002\u0002VW\u0007j\u0002\u0002WX\u0007v\u0002\u0002X",
    "Y\u0007v\u0002\u0002YZ\u0007r\u0002\u0002Z\\\u0003\u0002\u0002\u0002",
    "[]\n\u0005\u0002\u0002\\[\u0003\u0002\u0002\u0002]^\u0003\u0002\u0002",
    "\u0002^\\\u0003\u0002\u0002\u0002^_\u0003\u0002\u0002\u0002_\u0016\u0003",
    "\u0002\u0002\u0002\f\u0002\u001a \"-4FKP^\u0002"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

function RollupLexer(input) {
	antlr4.Lexer.call(this, input);
    this._interp = new antlr4.atn.LexerATNSimulator(this, atn, decisionsToDFA, new antlr4.PredictionContextCache());
    return this;
}

RollupLexer.prototype = Object.create(antlr4.Lexer.prototype);
RollupLexer.prototype.constructor = RollupLexer;

Object.defineProperty(RollupLexer.prototype, "atn", {
        get : function() {
                return atn;
        }
});

RollupLexer.EOF = antlr4.Token.EOF;
RollupLexer.NUMBER = 1;
RollupLexer.BOOLEAN = 2;
RollupLexer.LOGICAL_OPERATOR = 3;
RollupLexer.MATH_OPERATOR = 4;
RollupLexer.QUANTATIVE_OPERATOR = 5;
RollupLexer.WS = 6;
RollupLexer.KEY = 7;
RollupLexer.LEFT_BRACE = 8;
RollupLexer.RIGHT_BRACE = 9;
RollupLexer.VALUE = 10;

RollupLexer.prototype.channelNames = [ "DEFAULT_TOKEN_CHANNEL", "HIDDEN" ];

RollupLexer.prototype.modeNames = [ "DEFAULT_MODE" ];

RollupLexer.prototype.literalNames = [ null, null, null, null, null, null, 
                                       null, null, "'['", "']'" ];

RollupLexer.prototype.symbolicNames = [ null, "NUMBER", "BOOLEAN", "LOGICAL_OPERATOR", 
                                        "MATH_OPERATOR", "QUANTATIVE_OPERATOR", 
                                        "WS", "KEY", "LEFT_BRACE", "RIGHT_BRACE", 
                                        "VALUE" ];

RollupLexer.prototype.ruleNames = [ "NUMBER", "BOOLEAN", "LOGICAL_OPERATOR", 
                                    "MATH_OPERATOR", "QUANTATIVE_OPERATOR", 
                                    "WS", "KEY", "LEFT_BRACE", "RIGHT_BRACE", 
                                    "VALUE" ];

RollupLexer.prototype.grammarFileName = "Rollup.g4";


exports.RollupLexer = RollupLexer;

