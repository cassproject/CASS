// Generated from Rollup.g4 by ANTLR 4.5
// jshint ignore: start
var antlr4 = require('antlr4/index');
var RollupListener = require('./RollupListener').RollupListener;
var grammarFileName = "Rollup.g4";

var serializedATN = ["\3\u0430\ud6d1\u8206\uad2d\u4417\uaef1\u8d80\uaadd",
    "\3\fJ\4\2\t\2\4\3\t\3\4\4\t\4\4\5\t\5\4\6\t\6\3\2\3\2\5\2\17\n\2\3\2",
    "\5\2\22\n\2\3\2\3\2\5\2\26\n\2\3\2\3\2\5\2\32\n\2\7\2\34\n\2\f\2\16",
    "\2\37\13\2\3\3\3\3\3\3\5\3$\n\3\3\4\3\4\5\4(\n\4\3\4\3\4\5\4,\n\4\3",
    "\4\3\4\3\5\3\5\3\5\5\5\63\n\5\3\5\3\5\5\5\67\n\5\3\5\5\5:\n\5\3\5\3",
    "\5\5\5>\n\5\3\5\7\5A\n\5\f\5\16\5D\13\5\3\6\3\6\5\6H\n\6\3\6\2\2\7\2",
    "\4\6\b\n\2\2S\2\f\3\2\2\2\4#\3\2\2\2\6%\3\2\2\2\b/\3\2\2\2\nG\3\2\2",
    "\2\f\16\5\4\3\2\r\17\7\b\2\2\16\r\3\2\2\2\16\17\3\2\2\2\17\35\3\2\2",
    "\2\20\22\7\b\2\2\21\20\3\2\2\2\21\22\3\2\2\2\22\23\3\2\2\2\23\25\5\n",
    "\6\2\24\26\7\b\2\2\25\24\3\2\2\2\25\26\3\2\2\2\26\27\3\2\2\2\27\31\5",
    "\4\3\2\30\32\7\b\2\2\31\30\3\2\2\2\31\32\3\2\2\2\32\34\3\2\2\2\33\21",
    "\3\2\2\2\34\37\3\2\2\2\35\33\3\2\2\2\35\36\3\2\2\2\36\3\3\2\2\2\37\35",
    "\3\2\2\2 $\7\3\2\2!$\5\6\4\2\"$\7\4\2\2# \3\2\2\2#!\3\2\2\2#\"\3\2\2",
    "\2$\5\3\2\2\2%\'\7\n\2\2&(\7\b\2\2\'&\3\2\2\2\'(\3\2\2\2()\3\2\2\2)",
    "+\5\b\5\2*,\7\b\2\2+*\3\2\2\2+,\3\2\2\2,-\3\2\2\2-.\7\13\2\2.\7\3\2",
    "\2\2/\60\7\t\2\2\60\62\7\7\2\2\61\63\7\b\2\2\62\61\3\2\2\2\62\63\3\2",
    "\2\2\63\66\3\2\2\2\64\67\7\f\2\2\65\67\7\3\2\2\66\64\3\2\2\2\66\65\3",
    "\2\2\2\679\3\2\2\28:\7\b\2\298\3\2\2\29:\3\2\2\2:B\3\2\2\2;=\7\5\2\2",
    "<>\7\b\2\2=<\3\2\2\2=>\3\2\2\2>?\3\2\2\2?A\5\b\5\2@;\3\2\2\2AD\3\2\2",
    "\2B@\3\2\2\2BC\3\2\2\2C\t\3\2\2\2DB\3\2\2\2EH\7\5\2\2FH\7\6\2\2GE\3",
    "\2\2\2GF\3\2\2\2H\13\3\2\2\2\20\16\21\25\31\35#\'+\62\669=BG"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4.PredictionContextCache();

var literalNames = [ 'null', 'null', 'null', 'null', 'null', 'null', 'null', 
                     'null', "'['", "']'" ];

var symbolicNames = [ 'null', "NUMBER", "BOOLEAN", "LOGICAL_OPERATOR", "MATH_OPERATOR", 
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
            _la = this._input.LA(1);
            if(_la===RollupParser.WS) {
                this.state = 14;
                this.match(RollupParser.WS);
            }

            this.state = 17;
            localctx.cLogic = this.logical_or_math_operator();
            this.state = 19;
            _la = this._input.LA(1);
            if(_la===RollupParser.WS) {
                this.state = 18;
                this.match(RollupParser.WS);
            }

            this.state = 21;
            this.token();
            this.state = 23;
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
        _la = this._input.LA(1);
        if(_la===RollupParser.WS) {
            this.state = 36;
            this.match(RollupParser.WS);
        }

        this.state = 39;
        localctx.cQuery = this.innerquery();
        this.state = 41;
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
        _la = this._input.LA(1);
        if(_la===RollupParser.WS) {
            this.state = 47;
            this.match(RollupParser.WS);
        }

        this.state = 52;
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
