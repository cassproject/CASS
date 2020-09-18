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
var RollupListener = require('./RollupListener').RollupListener;
var grammarFileName = "Rollup.g4";


var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0003\fJ\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004\t\u0004",
    "\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0003\u0002\u0003\u0002\u0005",
    "\u0002\u000f\n\u0002\u0003\u0002\u0005\u0002\u0012\n\u0002\u0003\u0002",
    "\u0003\u0002\u0005\u0002\u0016\n\u0002\u0003\u0002\u0003\u0002\u0005",
    "\u0002\u001a\n\u0002\u0007\u0002\u001c\n\u0002\f\u0002\u000e\u0002\u001f",
    "\u000b\u0002\u0003\u0003\u0003\u0003\u0003\u0003\u0005\u0003$\n\u0003",
    "\u0003\u0004\u0003\u0004\u0005\u0004(\n\u0004\u0003\u0004\u0003\u0004",
    "\u0005\u0004,\n\u0004\u0003\u0004\u0003\u0004\u0003\u0005\u0003\u0005",
    "\u0003\u0005\u0005\u00053\n\u0005\u0003\u0005\u0003\u0005\u0005\u0005",
    "7\n\u0005\u0003\u0005\u0005\u0005:\n\u0005\u0003\u0005\u0003\u0005\u0005",
    "\u0005>\n\u0005\u0003\u0005\u0007\u0005A\n\u0005\f\u0005\u000e\u0005",
    "D\u000b\u0005\u0003\u0006\u0003\u0006\u0005\u0006H\n\u0006\u0003\u0006",
    "\u0002\u0002\u0007\u0002\u0004\u0006\b\n\u0002\u0002\u0002S\u0002\f",
    "\u0003\u0002\u0002\u0002\u0004#\u0003\u0002\u0002\u0002\u0006%\u0003",
    "\u0002\u0002\u0002\b/\u0003\u0002\u0002\u0002\nG\u0003\u0002\u0002\u0002",
    "\f\u000e\u0005\u0004\u0003\u0002\r\u000f\u0007\b\u0002\u0002\u000e\r",
    "\u0003\u0002\u0002\u0002\u000e\u000f\u0003\u0002\u0002\u0002\u000f\u001d",
    "\u0003\u0002\u0002\u0002\u0010\u0012\u0007\b\u0002\u0002\u0011\u0010",
    "\u0003\u0002\u0002\u0002\u0011\u0012\u0003\u0002\u0002\u0002\u0012\u0013",
    "\u0003\u0002\u0002\u0002\u0013\u0015\u0005\n\u0006\u0002\u0014\u0016",
    "\u0007\b\u0002\u0002\u0015\u0014\u0003\u0002\u0002\u0002\u0015\u0016",
    "\u0003\u0002\u0002\u0002\u0016\u0017\u0003\u0002\u0002\u0002\u0017\u0019",
    "\u0005\u0004\u0003\u0002\u0018\u001a\u0007\b\u0002\u0002\u0019\u0018",
    "\u0003\u0002\u0002\u0002\u0019\u001a\u0003\u0002\u0002\u0002\u001a\u001c",
    "\u0003\u0002\u0002\u0002\u001b\u0011\u0003\u0002\u0002\u0002\u001c\u001f",
    "\u0003\u0002\u0002\u0002\u001d\u001b\u0003\u0002\u0002\u0002\u001d\u001e",
    "\u0003\u0002\u0002\u0002\u001e\u0003\u0003\u0002\u0002\u0002\u001f\u001d",
    "\u0003\u0002\u0002\u0002 $\u0007\u0003\u0002\u0002!$\u0005\u0006\u0004",
    "\u0002\"$\u0007\u0004\u0002\u0002# \u0003\u0002\u0002\u0002#!\u0003",
    "\u0002\u0002\u0002#\"\u0003\u0002\u0002\u0002$\u0005\u0003\u0002\u0002",
    "\u0002%\'\u0007\n\u0002\u0002&(\u0007\b\u0002\u0002\'&\u0003\u0002\u0002",
    "\u0002\'(\u0003\u0002\u0002\u0002()\u0003\u0002\u0002\u0002)+\u0005",
    "\b\u0005\u0002*,\u0007\b\u0002\u0002+*\u0003\u0002\u0002\u0002+,\u0003",
    "\u0002\u0002\u0002,-\u0003\u0002\u0002\u0002-.\u0007\u000b\u0002\u0002",
    ".\u0007\u0003\u0002\u0002\u0002/0\u0007\t\u0002\u000202\u0007\u0007",
    "\u0002\u000213\u0007\b\u0002\u000221\u0003\u0002\u0002\u000223\u0003",
    "\u0002\u0002\u000236\u0003\u0002\u0002\u000247\u0007\f\u0002\u00025",
    "7\u0007\u0003\u0002\u000264\u0003\u0002\u0002\u000265\u0003\u0002\u0002",
    "\u000279\u0003\u0002\u0002\u00028:\u0007\b\u0002\u000298\u0003\u0002",
    "\u0002\u00029:\u0003\u0002\u0002\u0002:B\u0003\u0002\u0002\u0002;=\u0007",
    "\u0005\u0002\u0002<>\u0007\b\u0002\u0002=<\u0003\u0002\u0002\u0002=",
    ">\u0003\u0002\u0002\u0002>?\u0003\u0002\u0002\u0002?A\u0005\b\u0005",
    "\u0002@;\u0003\u0002\u0002\u0002AD\u0003\u0002\u0002\u0002B@\u0003\u0002",
    "\u0002\u0002BC\u0003\u0002\u0002\u0002C\t\u0003\u0002\u0002\u0002DB",
    "\u0003\u0002\u0002\u0002EH\u0007\u0005\u0002\u0002FH\u0007\u0006\u0002",
    "\u0002GE\u0003\u0002\u0002\u0002GF\u0003\u0002\u0002\u0002H\u000b\u0003",
    "\u0002\u0002\u0002\u0010\u000e\u0011\u0015\u0019\u001d#\'+269=BG"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4.PredictionContextCache();

var literalNames = [ null, null, null, null, null, null, null, null, "'['", 
                     "']'" ];

var symbolicNames = [ null, "NUMBER", "BOOLEAN", "LOGICAL_OPERATOR", "MATH_OPERATOR", 
                      "QUANTATIVE_OPERATOR", "WS", "KEY", "LEFT_BRACE", 
                      "RIGHT_BRACE", "VALUE" ];

var ruleNames =  [ "s", "token", "query", "innerquery", "logical_or_math_operator" ];

function RollupParser (input) {
	antlr4.Parser.call(this, input);
    this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
    this.ruleNames = ruleNames;
    this.literalNames = literalNames;
    this.symbolicNames = symbolicNames;
    return this;
}

RollupParser.prototype = Object.create(antlr4.Parser.prototype);
RollupParser.prototype.constructor = RollupParser;

Object.defineProperty(RollupParser.prototype, "atn", {
	get : function() {
		return atn;
	}
});

RollupParser.EOF = antlr4.Token.EOF;
RollupParser.NUMBER = 1;
RollupParser.BOOLEAN = 2;
RollupParser.LOGICAL_OPERATOR = 3;
RollupParser.MATH_OPERATOR = 4;
RollupParser.QUANTATIVE_OPERATOR = 5;
RollupParser.WS = 6;
RollupParser.KEY = 7;
RollupParser.LEFT_BRACE = 8;
RollupParser.RIGHT_BRACE = 9;
RollupParser.VALUE = 10;

RollupParser.RULE_s = 0;
RollupParser.RULE_token = 1;
RollupParser.RULE_query = 2;
RollupParser.RULE_innerquery = 3;
RollupParser.RULE_logical_or_math_operator = 4;


function SContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RollupParser.RULE_s;
    this.cLogic = null; // Logical_or_math_operatorContext
    return this;
}

SContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
SContext.prototype.constructor = SContext;

SContext.prototype.token = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(TokenContext);
    } else {
        return this.getTypedRuleContext(TokenContext,i);
    }
};

SContext.prototype.WS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(RollupParser.WS);
    } else {
        return this.getToken(RollupParser.WS, i);
    }
};


SContext.prototype.logical_or_math_operator = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(Logical_or_math_operatorContext);
    } else {
        return this.getTypedRuleContext(Logical_or_math_operatorContext,i);
    }
};

SContext.prototype.enterRule = function(listener) {
    if(listener instanceof RollupListener ) {
        listener.enterS(this);
	}
};

SContext.prototype.exitRule = function(listener) {
    if(listener instanceof RollupListener ) {
        listener.exitS(this);
	}
};




RollupParser.SContext = SContext;

RollupParser.prototype.s = function() {

    var localctx = new SContext(this, this._ctx, this.state);
    this.enterRule(localctx, 0, RollupParser.RULE_s);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 10;
        this.token();
        this.state = 12;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,0,this._ctx);
        if(la_===1) {
            this.state = 11;
            this.match(RollupParser.WS);

        }
        this.state = 27;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << RollupParser.LOGICAL_OPERATOR) | (1 << RollupParser.MATH_OPERATOR) | (1 << RollupParser.WS))) !== 0)) {
            this.state = 15;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            if(_la===RollupParser.WS) {
                this.state = 14;
                this.match(RollupParser.WS);
            }

            this.state = 17;
            localctx.cLogic = this.logical_or_math_operator();
            this.state = 19;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            if(_la===RollupParser.WS) {
                this.state = 18;
                this.match(RollupParser.WS);
            }

            this.state = 21;
            this.token();
            this.state = 23;
            this._errHandler.sync(this);
            var la_ = this._interp.adaptivePredict(this._input,3,this._ctx);
            if(la_===1) {
                this.state = 22;
                this.match(RollupParser.WS);

            }
            this.state = 29;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function TokenContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RollupParser.RULE_token;
    this.cNumber = null; // Token
    this.cBoolean = null; // Token
    return this;
}

TokenContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
TokenContext.prototype.constructor = TokenContext;

TokenContext.prototype.NUMBER = function() {
    return this.getToken(RollupParser.NUMBER, 0);
};

TokenContext.prototype.query = function() {
    return this.getTypedRuleContext(QueryContext,0);
};

TokenContext.prototype.BOOLEAN = function() {
    return this.getToken(RollupParser.BOOLEAN, 0);
};

TokenContext.prototype.enterRule = function(listener) {
    if(listener instanceof RollupListener ) {
        listener.enterToken(this);
	}
};

TokenContext.prototype.exitRule = function(listener) {
    if(listener instanceof RollupListener ) {
        listener.exitToken(this);
	}
};




RollupParser.TokenContext = TokenContext;

RollupParser.prototype.token = function() {

    var localctx = new TokenContext(this, this._ctx, this.state);
    this.enterRule(localctx, 2, RollupParser.RULE_token);
    try {
        this.state = 33;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case RollupParser.NUMBER:
            this.enterOuterAlt(localctx, 1);
            this.state = 30;
            localctx.cNumber = this.match(RollupParser.NUMBER);
            break;
        case RollupParser.LEFT_BRACE:
            this.enterOuterAlt(localctx, 2);
            this.state = 31;
            this.query();
            break;
        case RollupParser.BOOLEAN:
            this.enterOuterAlt(localctx, 3);
            this.state = 32;
            localctx.cBoolean = this.match(RollupParser.BOOLEAN);
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function QueryContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RollupParser.RULE_query;
    this.cQuery = null; // InnerqueryContext
    return this;
}

QueryContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
QueryContext.prototype.constructor = QueryContext;

QueryContext.prototype.LEFT_BRACE = function() {
    return this.getToken(RollupParser.LEFT_BRACE, 0);
};

QueryContext.prototype.RIGHT_BRACE = function() {
    return this.getToken(RollupParser.RIGHT_BRACE, 0);
};

QueryContext.prototype.innerquery = function() {
    return this.getTypedRuleContext(InnerqueryContext,0);
};

QueryContext.prototype.WS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(RollupParser.WS);
    } else {
        return this.getToken(RollupParser.WS, i);
    }
};


QueryContext.prototype.enterRule = function(listener) {
    if(listener instanceof RollupListener ) {
        listener.enterQuery(this);
	}
};

QueryContext.prototype.exitRule = function(listener) {
    if(listener instanceof RollupListener ) {
        listener.exitQuery(this);
	}
};




RollupParser.QueryContext = QueryContext;

RollupParser.prototype.query = function() {

    var localctx = new QueryContext(this, this._ctx, this.state);
    this.enterRule(localctx, 4, RollupParser.RULE_query);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 35;
        this.match(RollupParser.LEFT_BRACE);
        this.state = 37;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===RollupParser.WS) {
            this.state = 36;
            this.match(RollupParser.WS);
        }

        this.state = 39;
        localctx.cQuery = this.innerquery();
        this.state = 41;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===RollupParser.WS) {
            this.state = 40;
            this.match(RollupParser.WS);
        }

        this.state = 43;
        this.match(RollupParser.RIGHT_BRACE);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function InnerqueryContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RollupParser.RULE_innerquery;
    this.cKey = null; // Token
    this.cOperator = null; // Token
    this.cValue = null; // Token
    this.cNumber = null; // Token
    this.cLogic = null; // Token
    return this;
}

InnerqueryContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
InnerqueryContext.prototype.constructor = InnerqueryContext;

InnerqueryContext.prototype.KEY = function() {
    return this.getToken(RollupParser.KEY, 0);
};

InnerqueryContext.prototype.QUANTATIVE_OPERATOR = function() {
    return this.getToken(RollupParser.QUANTATIVE_OPERATOR, 0);
};

InnerqueryContext.prototype.WS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(RollupParser.WS);
    } else {
        return this.getToken(RollupParser.WS, i);
    }
};


InnerqueryContext.prototype.VALUE = function() {
    return this.getToken(RollupParser.VALUE, 0);
};

InnerqueryContext.prototype.NUMBER = function() {
    return this.getToken(RollupParser.NUMBER, 0);
};

InnerqueryContext.prototype.innerquery = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(InnerqueryContext);
    } else {
        return this.getTypedRuleContext(InnerqueryContext,i);
    }
};

InnerqueryContext.prototype.LOGICAL_OPERATOR = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(RollupParser.LOGICAL_OPERATOR);
    } else {
        return this.getToken(RollupParser.LOGICAL_OPERATOR, i);
    }
};


InnerqueryContext.prototype.enterRule = function(listener) {
    if(listener instanceof RollupListener ) {
        listener.enterInnerquery(this);
	}
};

InnerqueryContext.prototype.exitRule = function(listener) {
    if(listener instanceof RollupListener ) {
        listener.exitInnerquery(this);
	}
};




RollupParser.InnerqueryContext = InnerqueryContext;

RollupParser.prototype.innerquery = function() {

    var localctx = new InnerqueryContext(this, this._ctx, this.state);
    this.enterRule(localctx, 6, RollupParser.RULE_innerquery);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 45;
        localctx.cKey = this.match(RollupParser.KEY);
        this.state = 46;
        localctx.cOperator = this.match(RollupParser.QUANTATIVE_OPERATOR);
        this.state = 48;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===RollupParser.WS) {
            this.state = 47;
            this.match(RollupParser.WS);
        }

        this.state = 52;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case RollupParser.VALUE:
            this.state = 50;
            localctx.cValue = this.match(RollupParser.VALUE);
            break;
        case RollupParser.NUMBER:
            this.state = 51;
            localctx.cNumber = this.match(RollupParser.NUMBER);
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
        this.state = 55;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,10,this._ctx);
        if(la_===1) {
            this.state = 54;
            this.match(RollupParser.WS);

        }
        this.state = 64;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,12,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                this.state = 57;
                localctx.cLogic = this.match(RollupParser.LOGICAL_OPERATOR);
                this.state = 59;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if(_la===RollupParser.WS) {
                    this.state = 58;
                    this.match(RollupParser.WS);
                }

                this.state = 61;
                this.innerquery(); 
            }
            this.state = 66;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,12,this._ctx);
        }

    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function Logical_or_math_operatorContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = RollupParser.RULE_logical_or_math_operator;
    this.cLogic = null; // Token
    this.cMath = null; // Token
    return this;
}

Logical_or_math_operatorContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Logical_or_math_operatorContext.prototype.constructor = Logical_or_math_operatorContext;

Logical_or_math_operatorContext.prototype.LOGICAL_OPERATOR = function() {
    return this.getToken(RollupParser.LOGICAL_OPERATOR, 0);
};

Logical_or_math_operatorContext.prototype.MATH_OPERATOR = function() {
    return this.getToken(RollupParser.MATH_OPERATOR, 0);
};

Logical_or_math_operatorContext.prototype.enterRule = function(listener) {
    if(listener instanceof RollupListener ) {
        listener.enterLogical_or_math_operator(this);
	}
};

Logical_or_math_operatorContext.prototype.exitRule = function(listener) {
    if(listener instanceof RollupListener ) {
        listener.exitLogical_or_math_operator(this);
	}
};




RollupParser.Logical_or_math_operatorContext = Logical_or_math_operatorContext;

RollupParser.prototype.logical_or_math_operator = function() {

    var localctx = new Logical_or_math_operatorContext(this, this._ctx, this.state);
    this.enterRule(localctx, 8, RollupParser.RULE_logical_or_math_operator);
    try {
        this.state = 69;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case RollupParser.LOGICAL_OPERATOR:
            this.enterOuterAlt(localctx, 1);
            this.state = 67;
            localctx.cLogic = this.match(RollupParser.LOGICAL_OPERATOR);
            break;
        case RollupParser.MATH_OPERATOR:
            this.enterOuterAlt(localctx, 2);
            this.state = 68;
            localctx.cMath = this.match(RollupParser.MATH_OPERATOR);
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


exports.RollupParser = RollupParser;
